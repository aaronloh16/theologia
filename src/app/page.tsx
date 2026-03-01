import Link from "next/link";
import { getAllTerms, getLetters } from "@/lib/terms";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function HomePage() {
  const terms = getAllTerms();
  const letters = getLetters();
  const featured = pickRandom(terms, 3);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center px-4 pb-20 pt-24 sm:pt-32 text-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="mb-10 h-px w-16" style={{ background: "var(--color-gold)", opacity: 0.45 }} />

        <p
          className="mb-3 text-[10px] font-medium uppercase tracking-[0.24em]"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
        >
          A pocket dictionary
        </p>

        <h1
          className="mb-4 font-light leading-none uppercase"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink)",
            fontSize: "clamp(3rem, 10vw, 5.5rem)",
            letterSpacing: "0.13em",
          }}
        >
          Theologia
        </h1>

        <p
          className="mb-1 text-xl sm:text-2xl"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink-muted)",
            fontWeight: 500,
          }}
        >
          Theological Dictionary
        </p>

        <p
          className="mt-3 mb-10 text-xs"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)", letterSpacing: "0.04em" }}
        >
          {terms.length} entries · Grenz, Guretzki &amp; Nordling
        </p>

        <div className="w-full max-w-lg">
          <SearchBar terms={terms} placeholder="Search theological terms…" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <Link
            href="/terms"
            className="text-sm font-medium link-gold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Browse A–Z →
          </Link>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <Link
            href="/flashcards"
            className="text-sm font-medium link-gold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Flashcards
          </Link>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <Link
            href="/add"
            className="text-sm font-medium link-gold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Add your own
          </Link>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <Link
            href="/random"
            className="text-sm transition-colors duration-150"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
          >
            Random term
          </Link>
        </div>

        <div className="mt-16 h-px w-16" style={{ background: "var(--color-gold)", opacity: 0.45 }} />
      </section>

      {/* ── Alphabet Nav ───────────────────────────────────────────── */}
      <section
        className="border-y py-5 px-4"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-2xl flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-5">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-center sm:text-left shrink-0"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Jump to letter
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {letters.map((letter) => (
              <Link
                key={letter}
                href={`/terms#${letter}`}
                className="flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-surface)] hover:border-[var(--color-gold)]"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-ink-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {letter}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured terms ─────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p
            className="mb-8 text-center text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Selected terms
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((term) => (
              <Link key={term.id} href={`/terms/${term.id}`} className="feature-card">
                <span
                  className="text-[10px] font-medium uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--color-gold)" }}
                >
                  {term.term[0].toUpperCase()}
                </span>
                <h3
                  className="text-lg font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
                >
                  {term.term}
                </h3>
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink-muted)" }}
                >
                  {term.shortDefinition}
                </p>
                <span
                  className="mt-auto text-xs"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--color-gold)" }}
                >
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
