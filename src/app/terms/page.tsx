import { getTermsGroupedByLetter, getLetters, getAllTerms } from "@/lib/terms";
import { AlphabetNav } from "@/components/AlphabetNav";
import { TermCard } from "@/components/TermCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Terms",
  description: "All theological terms, A to Z.",
};

export default function TermsIndexPage() {
  const groups = getTermsGroupedByLetter();
  const letters = getLetters();
  const total = getAllTerms().length;

  return (
    <div>
      <AlphabetNav letters={letters} />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {/* Page header */}
        <div className="py-12 text-center">
          <p
            className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Complete Index
          </p>
          <h1
            className="mb-3 text-3xl sm:text-4xl font-semibold"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
          >
            All Terms
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            {total} entries · A to Z
          </p>
        </div>

        {/* Letter sections */}
        {letters.map((letter) => {
          const sectionTerms = groups[letter] || [];
          return (
            <section key={letter} id={`section-${letter}`} className="mb-12">
              {/* Letter heading */}
              <div
                className="sticky flex items-center gap-4 py-4 mb-5"
                style={{
                  top: "calc(3.5rem + 2.625rem)",
                  background: "var(--color-bg)",
                  zIndex: 10,
                }}
              >
                <span
                  className="text-5xl font-semibold"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--color-gold)",
                    lineHeight: 1,
                    opacity: 0.85,
                  }}
                >
                  {letter}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--color-border)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
                >
                  {sectionTerms.length} {sectionTerms.length === 1 ? "term" : "terms"}
                </span>
              </div>

              {/* Terms list */}
              <div className="flex flex-col gap-3">
                {sectionTerms.map((term) => (
                  <TermCard key={term.id} term={term} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
