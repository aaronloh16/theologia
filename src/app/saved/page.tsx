"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSavedIds, clearAllSaved } from "@/lib/saved";
import { getAllTerms, type Term } from "@/lib/terms";
import { getCustomTerms } from "@/lib/customTerms";
import { TermCard } from "@/components/TermCard";

export default function SavedPage() {
  const [savedTerms, setSavedTerms] = useState<Term[]>([]);
  const [mounted, setMounted] = useState(false);

  const sync = useCallback(() => {
    const ids = getSavedIds();
    const staticTerms = getAllTerms();
    const customTerms = getCustomTerms();
    const termsById = new Map([...staticTerms, ...customTerms].map((t) => [t.id, t]));
    const terms = ids.map((id) => termsById.get(id)).filter(Boolean) as Term[];
    setSavedTerms(terms);
  }, []);

  useEffect(() => {
    setMounted(true);
    sync();
    const handler = () => sync();
    window.addEventListener("theologia-saved-change", handler);
    window.addEventListener("theologia-custom-terms-change", handler);
    return () => {
      window.removeEventListener("theologia-saved-change", handler);
      window.removeEventListener("theologia-custom-terms-change", handler);
    };
  }, [sync]);

  function handleClearAll() {
    if (window.confirm("Remove all saved terms?")) {
      clearAllSaved();
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p style={{ color: "var(--color-ink-faint)", fontFamily: "var(--font-sans)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      {/* Header */}
      <div className="py-12 text-center">
        <p
          className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
        >
          Study List
        </p>
        <h1
          className="mb-3 text-3xl sm:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
        >
          Saved Terms
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
        >
          {savedTerms.length === 0
            ? "No terms saved yet"
            : `${savedTerms.length} ${savedTerms.length === 1 ? "term" : "terms"} saved`}
        </p>
      </div>

      {savedTerms.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="mb-6 text-5xl"
            style={{ color: "var(--color-border)", opacity: 0.6 }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p
            className="mb-2 text-lg font-medium"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink-muted)" }}
          >
            No saved terms yet
          </p>
          <p
            className="mb-6 text-sm max-w-sm mx-auto"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)", lineHeight: 1.6 }}
          >
            Browse terms and tap the bookmark icon to save them here, or add your own from lectures and readings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                background: "var(--color-gold)",
                color: "var(--color-bg)",
              }}
            >
              Browse all terms
            </Link>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium border transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                borderColor: "var(--color-border)",
                color: "var(--color-ink)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add your own
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Actions bar */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-3">
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                fontFamily: "var(--font-sans)",
                background: "var(--color-gold)",
                color: "var(--color-bg)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="12" y1="9" x2="12" y2="15" />
                <line x1="9" y1="12" x2="15" y2="12" />
              </svg>
              Study as flashcards
            </Link>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                borderColor: "var(--color-border)",
                color: "var(--color-ink)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add term
            </Link>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs transition-colors duration-150"
              style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
            >
              Clear all
            </button>
          </div>

          {/* Saved terms list */}
          <div className="flex flex-col gap-3">
            {savedTerms.map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
