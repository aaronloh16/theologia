"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCustomTermById,
  deleteCustomTerm,
  updateCustomTerm,
} from "@/lib/customTerms";
import { getSavedIds, toggleSaved } from "@/lib/saved";
import type { Term } from "@/lib/terms";
import { SaveButton } from "./SaveButton";
import { CopyLinkButton } from "./CopyLinkButton";

type Props = {
  id: string;
};

export function CustomTermViewer({ id }: Props) {
  const router = useRouter();
  const [term, setTerm] = useState<Term | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTerm, setEditTerm] = useState("");
  const [editShort, setEditShort] = useState("");
  const [editFull, setEditFull] = useState("");

  useEffect(() => {
    setTerm(getCustomTermById(id));
  }, [id]);

  useEffect(() => {
    function handler() {
      setTerm(getCustomTermById(id));
    }
    window.addEventListener("theologia-custom-terms-change", handler);
    return () => window.removeEventListener("theologia-custom-terms-change", handler);
  }, [id]);

  function startEdit() {
    if (!term) return;
    setEditTerm(term.term);
    setEditShort(term.shortDefinition);
    setEditFull(term.fullDefinition);
    setEditing(true);
  }

  function saveEdit() {
    if (!term) return;
    const updated = updateCustomTerm(id, {
      term: editTerm.trim(),
      shortDefinition: editShort.trim(),
      fullDefinition: editFull.trim(),
    });
    if (updated) {
      setTerm(updated);
      setEditing(false);
    }
  }

  function cancelEdit() {
    setEditing(false);
  }

  function handleDelete() {
    if (!term) return;
    if (!window.confirm(`Delete "${term.term}"? This can't be undone.`)) return;
    if (getSavedIds().includes(id)) toggleSaved(id); // Remove from saved list
    deleteCustomTerm(id);
    router.push("/saved");
  }

  if (!term) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}>
          Term not found. It may have been deleted.
        </p>
        <Link href="/saved" className="mt-4 inline-block text-sm link-gold" style={{ fontFamily: "var(--font-sans)" }}>
          Back to saved terms
        </Link>
      </div>
    );
  }

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const termUrl = `${siteUrl}/terms/${term.id}`;

  if (editing) {
    return (
      <article className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
        <nav className="mb-10 flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/saved" className="hover:underline">Saved</Link>
          <span>/</span>
          <span style={{ color: "var(--color-ink-muted)" }}>Edit</span>
        </nav>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
              Term
            </label>
            <input
              value={editTerm}
              onChange={(e) => setEditTerm(e.target.value)}
              className="w-full rounded-xl border px-4 py-2.5"
              style={{ fontFamily: "var(--font-serif)", background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
              Short definition
            </label>
            <input
              value={editShort}
              onChange={(e) => setEditShort(e.target.value)}
              className="w-full rounded-xl border px-4 py-2.5"
              style={{ fontFamily: "var(--font-serif)", background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
              Full definition
            </label>
            <textarea
              value={editFull}
              onChange={(e) => setEditFull(e.target.value)}
              rows={5}
              className="w-full rounded-xl border px-4 py-2.5 resize-y"
              style={{ fontFamily: "var(--font-serif)", background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveEdit}
              disabled={!editTerm.trim() || !editShort.trim()}
              className="rounded-lg px-5 py-2.5 text-sm font-medium"
              style={{ fontFamily: "var(--font-sans)", background: "var(--color-gold)", color: "var(--color-bg)" }}
            >
              Save changes
            </button>
            <button onClick={cancelEdit} className="btn-ghost" style={{ fontFamily: "var(--font-sans)" }}>
              Cancel
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
      <nav className="mb-10 flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/saved" className="hover:underline">Saved</Link>
        <span>/</span>
        <span style={{ color: "var(--color-ink-muted)" }}>{term.term}</span>
      </nav>

      {/* Custom badge */}
      <span
        className="inline-block mb-4 text-xs font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-gold)",
          background: "var(--color-highlight)",
        }}
      >
        Your term
      </span>

      <div className="flex items-start justify-between gap-4">
        <h1
          className="mb-2 leading-tight"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink)",
            fontWeight: 600,
            fontSize: "clamp(2rem, 6vw, 3rem)",
          }}
        >
          {term.term}
        </h1>
        <div className="shrink-0 mt-2 flex items-center gap-2">
          <SaveButton termId={term.id} size="md" />
        </div>
      </div>

      <div className="mt-6 mb-8 h-px w-12" style={{ background: "var(--color-gold)", opacity: 0.5 }} />

      <blockquote
        className="mb-8 rounded-xl px-6 py-5"
        style={{
          background: "var(--color-highlight)",
          borderLeft: "4px solid var(--color-gold)",
        }}
      >
        <p className="text-[1.0625rem] leading-[1.75]" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)", fontWeight: 500 }}>
          {term.shortDefinition}
        </p>
      </blockquote>

      <div className="mb-12">
        <p
          className="leading-[1.8]"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink)",
            fontSize: "1.0625rem",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {term.fullDefinition}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/random" className="btn-ghost" style={{ fontFamily: "var(--font-sans)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
          </svg>
          Random term
        </Link>
        <CopyLinkButton url={termUrl} />
        <button onClick={startEdit} className="btn-ghost" style={{ fontFamily: "var(--font-sans)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn-ghost"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}
