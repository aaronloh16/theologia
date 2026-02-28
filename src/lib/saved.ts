"use client";

const STORAGE_KEY = "theologia-saved";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string): boolean {
  const ids = getSavedIds();
  const index = ids.indexOf(id);
  if (index >= 0) {
    ids.splice(index, 1);
  } else {
    ids.push(id);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("theologia-saved-change", { detail: ids }));
  return index < 0; // returns true if now saved
}

export function clearAllSaved(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("theologia-saved-change", { detail: [] }));
}

export function getSavedCount(): number {
  return getSavedIds().length;
}
