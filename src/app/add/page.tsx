"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addCustomTerm } from "@/lib/customTerms";
import { toggleSaved } from "@/lib/saved";

export default function AddTermPage() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [shortDefinition, setShortDefinition] = useState("");
  const [fullDefinition, setFullDefinition] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = term.trim();
    const sd = shortDefinition.trim();
    const fd = fullDefinition.trim();

    if (!t) {
      setError("Please enter a term.");
      return;
    }
    if (!sd) {
      setError("Please enter a short definition (one sentence).");
      return;
    }

    setSubmitting(true);
    try {
      const newTerm = addCustomTerm({
        term: t,
        shortDefinition: sd,
        fullDefinition: fd || sd,
      });
      // Auto-save so they can study it right away
      toggleSaved(newTerm.id);
      router.push(`/terms/${newTerm.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-10 flex items-center gap-2 text-xs"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
      >
        <Link href="/" className="hover:underline" style={{ color: "var(--color-ink-faint)" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/saved" className="hover:underline" style={{ color: "var(--color-ink-faint)" }}>
          Saved
        </Link>
        <span>/</span>
        <span style={{ color: "var(--color-ink-muted)" }}>Add term</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <span
          className="inline-block mb-4 text-xs font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-gold)",
            background: "var(--color-highlight)",
          }}
        >
          Your dictionary
        </span>
        <h1
          className="mb-3 text-2xl sm:text-3xl font-semibold"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
        >
          Add your own term
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}
        >
          Extend your study list with terms from lectures, readings, or notes. New terms are saved for flashcards automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              fontFamily: "var(--font-sans)",
              background: "color-mix(in srgb, #dc2626 12%, transparent)",
              color: "var(--color-ink)",
              border: "1px solid color-mix(in srgb, #dc2626 30%, transparent)",
            }}
          >
            {error}
          </div>
        )}

        {/* Term */}
        <div>
          <label
            htmlFor="term"
            className="block mb-2 text-xs font-medium uppercase tracking-wider"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
          >
            Term <span style={{ color: "var(--color-gold)" }}>*</span>
          </label>
          <input
            id="term"
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. TULIP, Hermeneutical Spiral"
            autoFocus
            className="w-full rounded-xl border px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          />
        </div>

        {/* Short definition */}
        <div>
          <label
            htmlFor="shortDefinition"
            className="block mb-2 text-xs font-medium uppercase tracking-wider"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
          >
            Short definition <span style={{ color: "var(--color-gold)" }}>*</span>
          </label>
          <input
            id="shortDefinition"
            type="text"
            value={shortDefinition}
            onChange={(e) => setShortDefinition(e.target.value)}
            placeholder="One concise sentence (shown on flashcards)"
            className="w-full rounded-xl border px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          />
        </div>

        {/* Full definition */}
        <div>
          <label
            htmlFor="fullDefinition"
            className="block mb-2 text-xs font-medium uppercase tracking-wider"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
          >
            Full definition <span className="text-[10px] font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="fullDefinition"
            value={fullDefinition}
            onChange={(e) => setFullDefinition(e.target.value)}
            placeholder="Add more detail, context, or examples..."
            rows={5}
            className="w-full rounded-xl border px-4 py-3 text-base resize-y min-h-[8rem] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-150 disabled:opacity-60"
            style={{
              fontFamily: "var(--font-sans)",
              background: "var(--color-gold)",
              color: "var(--color-bg)",
            }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add term
              </>
            )}
          </button>
          <Link
            href="/saved"
            className="btn-ghost text-center"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
