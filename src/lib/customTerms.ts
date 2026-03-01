"use client";

import type { Term } from "./terms";
import { slugify } from "./utils";

const STORAGE_KEY = "theologia-custom-terms";
const PREFIX = "custom-";

export type CustomTermInput = {
  term: string;
  shortDefinition: string;
  fullDefinition: string;
};

type StoredTerm = CustomTermInput & { id: string; createdAt: number };

function toTerm(raw: StoredTerm): Term {
  return {
    id: raw.id,
    term: raw.term.trim(),
    shortDefinition: raw.shortDefinition.trim(),
    fullDefinition: (raw.fullDefinition || raw.shortDefinition).trim(),
    example: "",
    nonExample: "",
    seeAlso: [],
    contrastsWith: [],
    tags: [],
  };
}

export function getCustomTerms(): Term[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTerm[];
    return parsed.map(toTerm).sort((a, b) => a.term.localeCompare(b.term));
  } catch {
    return [];
  }
}

function generateId(termName: string): string {
  const base = slugify(termName) || "term";
  const existing = getCustomTerms().map((t) => t.id);
  let id = `${PREFIX}${base}`;
  if (!existing.includes(id)) return id;
  let n = 1;
  while (existing.includes(`${id}-${n}`)) n++;
  return `${id}-${n}`;
}

export function addCustomTerm(input: CustomTermInput): Term {
  const term = input.term.trim();
  const shortDef = input.shortDefinition.trim();
  const fullDef = input.fullDefinition.trim() || shortDef;
  if (!term || !shortDef) throw new Error("Term and short definition are required");

  const all: StoredTerm[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const id = generateId(term);
  const raw: StoredTerm = { id, term, shortDefinition: shortDef, fullDefinition: fullDef, createdAt: Date.now() };
  all.push(raw);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("theologia-custom-terms-change"));
  return toTerm(raw);
}

export function updateCustomTerm(id: string, input: Partial<CustomTermInput>): Term | null {
  if (!id.startsWith(PREFIX)) return null;
  const all: StoredTerm[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return null;

  const updated: StoredTerm = {
    ...all[idx],
    term: input.term !== undefined ? input.term.trim() : all[idx].term,
    shortDefinition: input.shortDefinition !== undefined ? input.shortDefinition.trim() : all[idx].shortDefinition,
    fullDefinition: input.fullDefinition !== undefined ? input.fullDefinition.trim() : all[idx].fullDefinition,
  };
  if (!updated.term || !updated.shortDefinition) return null;
  updated.fullDefinition = updated.fullDefinition || updated.shortDefinition;

  all[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("theologia-custom-terms-change"));
  return toTerm(updated);
}

export function deleteCustomTerm(id: string): boolean {
  if (!id.startsWith(PREFIX)) return false;
  const all: StoredTerm[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent("theologia-custom-terms-change"));
  return true;
}

export function getCustomTermById(id: string): Term | null {
  return getCustomTerms().find((t) => t.id === id) || null;
}

export function isCustomTermId(id: string): boolean {
  return id.startsWith(PREFIX);
}
