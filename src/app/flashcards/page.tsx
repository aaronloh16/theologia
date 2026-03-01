"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSavedIds } from "@/lib/saved";
import { getAllTerms, type Term } from "@/lib/terms";
import { getCustomTerms } from "@/lib/customTerms";

const staticTerms = getAllTerms();

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type StudyMode = "saved" | "all";

export default function FlashcardsPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<StudyMode>("saved");
  const [deck, setDeck] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [learning, setLearning] = useState<Set<string>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);

  const loadDeck = useCallback(
    (m: StudyMode) => {
      const custom = getCustomTerms();
      const termsById = new Map([...staticTerms, ...custom].map((t) => [t.id, t]));
      let terms: Term[];
      if (m === "saved") {
        const ids = getSavedIds();
        terms = ids.map((id) => termsById.get(id)).filter(Boolean) as Term[];
      } else {
        terms = [...staticTerms, ...custom];
      }
      setDeck(shuffle(terms));
      setIndex(0);
      setFlipped(false);
      setKnown(new Set());
      setLearning(new Set());
      setSessionStarted(true);
    },
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!sessionStarted) return;
    function handler(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function goNext() {
    if (index < deck.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function goPrev() {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  function markKnown() {
    if (!card) return;
    setKnown((s) => new Set(s).add(card.id));
    setLearning((s) => {
      const n = new Set(s);
      n.delete(card.id);
      return n;
    });
    goNext();
  }

  function markLearning() {
    if (!card) return;
    setLearning((s) => new Set(s).add(card.id));
    setKnown((s) => {
      const n = new Set(s);
      n.delete(card.id);
      return n;
    });
    goNext();
  }

  function reshuffleAndRestart() {
    setDeck((d) => shuffle(d));
    setIndex(0);
    setFlipped(false);
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p style={{ color: "var(--color-ink-faint)", fontFamily: "var(--font-sans)" }}>Loading...</p>
      </div>
    );
  }

  // Mode selection screen
  if (!sessionStarted) {
    const savedCount = getSavedIds().length;
    return (
      <div className="mx-auto max-w-lg px-4 pb-20 sm:px-6">
        <div className="py-12 text-center">
          <p
            className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Study Mode
          </p>
          <h1
            className="mb-3 text-3xl sm:text-4xl font-semibold"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
          >
            Flashcards
          </h1>
          <p
            className="text-sm mb-10"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Choose which terms to study
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Saved terms option */}
          <button
            onClick={() => {
              setMode("saved");
              loadDeck("saved");
            }}
            disabled={savedCount === 0}
            className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all duration-150"
            style={{
              background: "var(--color-surface)",
              borderColor: savedCount > 0 ? "var(--color-border)" : "var(--color-border-soft)",
              opacity: savedCount > 0 ? 1 : 0.5,
              cursor: savedCount > 0 ? "pointer" : "not-allowed",
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
              style={{ background: "var(--color-highlight)", color: "var(--color-gold)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)", fontSize: "1.0625rem" }}>
                Saved terms only
              </p>
              <p className="text-sm" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
                {savedCount === 0
                  ? "No terms saved yet — bookmark some first"
                  : `Study your ${savedCount} saved ${savedCount === 1 ? "term" : "terms"}`}
              </p>
            </div>
          </button>

          {/* All terms option */}
          <button
            onClick={() => {
              setMode("all");
              loadDeck("all");
            }}
            className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all duration-150"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
              style={{ background: "var(--color-highlight)", color: "var(--color-gold)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)", fontSize: "1.0625rem" }}>
                All {staticTerms.length + getCustomTerms().length} terms
              </p>
              <p className="text-sm" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
                Full dictionary, shuffled randomly
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Empty deck
  if (deck.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-4 text-lg font-medium" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink-muted)" }}>
          No terms to study
        </p>
        <Link href="/terms" className="text-sm link-gold" style={{ fontFamily: "var(--font-sans)" }}>
          Browse and save some terms first →
        </Link>
      </div>
    );
  }

  const card = deck[index];
  const progress = ((index + 1) / deck.length) * 100;
  const isFinished = index === deck.length - 1 && (known.has(card.id) || learning.has(card.id));

  // Finished screen
  if (isFinished) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-20 sm:px-6">
        <div className="py-16 text-center">
          <div className="mb-6 text-5xl" style={{ color: "var(--color-gold)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>
            Session complete
          </h2>
          <p className="text-sm mb-8" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
            You studied {deck.length} {deck.length === 1 ? "term" : "terms"}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center">
              <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-sans)", color: "var(--color-gold)" }}>
                {known.size}
              </p>
              <p className="text-xs mt-1" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
                Know it
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
                {learning.size}
              </p>
              <p className="text-xs mt-1" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
                Still learning
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reshuffleAndRestart}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
              style={{ fontFamily: "var(--font-sans)", background: "var(--color-gold)", color: "var(--color-bg)" }}
            >
              Study again
            </button>
            <button
              onClick={() => setSessionStarted(false)}
              className="btn-ghost"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Change deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
      {/* Top bar */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={() => setSessionStarted(false)}
          className="text-xs transition-colors"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
        >
          ← Back
        </button>
        <p className="text-xs font-medium" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>
          {index + 1} of {deck.length}
        </p>
        <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
          <span style={{ color: "var(--color-gold)" }}>{known.size} known</span>
          <span>{learning.size} learning</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%`, background: "var(--color-gold)" }}
        />
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="flashcard-container cursor-pointer select-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="flashcard-inner"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            position: "relative",
            minHeight: "20rem",
          }}
        >
          {/* Front — term */}
          <div
            className="flashcard-face rounded-2xl border flex flex-col items-center justify-center p-8 sm:p-12"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-card-hover)",
              backfaceVisibility: "hidden",
              position: "absolute",
              inset: 0,
            }}
          >
            <p
              className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
            >
              Term
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-center leading-tight mb-8"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
            >
              {card.term}
            </h2>
            <p className="text-xs" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
              Tap to reveal definition
            </p>
          </div>

          {/* Back — definition */}
          <div
            className="flashcard-face rounded-2xl border flex flex-col items-center justify-center p-8 sm:p-12"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-gold)",
              boxShadow: "var(--shadow-card-hover)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              inset: 0,
            }}
          >
            <p
              className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-sans)", color: "var(--color-gold)" }}
            >
              Definition
            </p>
            <p
              className="text-center leading-[1.75] mb-6"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink)",
                fontSize: "1.125rem",
                fontWeight: 400,
                maxWidth: "32rem",
              }}
            >
              {card.shortDefinition}
            </p>
            <Link
              href={`/terms/${card.id}`}
              className="text-xs link-gold"
              style={{ fontFamily: "var(--font-sans)" }}
              onClick={(e) => e.stopPropagation()}
            >
              Read full definition →
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="btn-ghost"
          style={{
            fontFamily: "var(--font-sans)",
            opacity: index === 0 ? 0.3 : 1,
            cursor: index === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Prev
        </button>

        {flipped && (
          <>
            <button
              onClick={markLearning}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-150"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-ink-muted)",
                borderColor: "var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              Still learning
            </button>
            <button
              onClick={markKnown}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
              style={{
                fontFamily: "var(--font-sans)",
                background: "var(--color-gold)",
                color: "var(--color-bg)",
              }}
            >
              Know it
            </button>
          </>
        )}

        <button
          onClick={goNext}
          disabled={index === deck.length - 1}
          className="btn-ghost"
          style={{
            fontFamily: "var(--font-sans)",
            opacity: index === deck.length - 1 ? 0.3 : 1,
            cursor: index === deck.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next →
        </button>
      </div>

      {/* Keyboard hints */}
      <p
        className="mt-6 text-center text-[10px] tracking-wide"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
      >
        Space to flip · Arrow keys to navigate
      </p>
    </div>
  );
}
