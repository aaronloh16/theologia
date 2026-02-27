import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllTermIds,
  getTermById,
  getAllTerms,
  resolveSeeAlso,
} from "@/lib/terms";
import { LinkedDefinition } from "@/components/LinkedDefinition";
import { CopyLinkButton } from "@/components/CopyLinkButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllTermIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const term = getTermById(id);
  if (!term) return {};
  return {
    title: term.term,
    description: term.shortDefinition,
    openGraph: {
      title: `${term.term} · Theologia`,
      description: term.shortDefinition,
    },
  };
}

export default async function TermPage({ params }: Props) {
  const { id } = await params;
  const term = getTermById(id);
  if (!term) notFound();

  const allTerms = getAllTerms();
  const currentIndex = allTerms.findIndex((t) => t.id === id);
  const prev = currentIndex > 0 ? allTerms[currentIndex - 1] : null;
  const next = currentIndex < allTerms.length - 1 ? allTerms[currentIndex + 1] : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theologia.vercel.app";
  const termUrl = `${siteUrl}/terms/${term.id}`;

  const resolvedSeeAlso = term.seeAlso
    .map((ref) => {
      const resolvedId = resolveSeeAlso(ref);
      const linked = resolvedId ? getTermById(resolvedId) : null;
      return { ref, id: resolvedId, term: linked };
    })
    .filter((r) => r.ref.trim().length > 0);

  return (
    <article className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-10 flex items-center gap-2 text-xs"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
      >
        <Link href="/" className="hover:underline" style={{ color: "var(--color-ink-faint)" }}>Home</Link>
        <span>/</span>
        <Link href="/terms" className="hover:underline" style={{ color: "var(--color-ink-faint)" }}>Terms</Link>
        <span>/</span>
        <span style={{ color: "var(--color-ink-muted)" }}>{term.term}</span>
      </nav>

      {/* Letter badge */}
      <span
        className="inline-block mb-4 text-xs font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-gold)",
          background: "var(--color-highlight)",
        }}
      >
        {term.term[0].toUpperCase()}
      </span>

      {/* Heading */}
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

      <div className="mt-6 mb-8 h-px w-12" style={{ background: "var(--color-gold)", opacity: 0.5 }} />

      {/* Short definition callout */}
      <blockquote
        className="mb-8 rounded-xl px-6 py-5"
        style={{
          background: "var(--color-highlight)",
          borderLeft: "4px solid var(--color-gold)",
        }}
      >
        <p
          className="text-[1.0625rem] leading-[1.75]"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)", fontWeight: 500 }}
        >
          {term.shortDefinition}
        </p>
      </blockquote>

      {/* Full definition */}
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
          <LinkedDefinition text={term.fullDefinition} />
        </p>
      </div>

      {/* See Also */}
      {resolvedSeeAlso.length > 0 && (
        <div className="mb-12">
          <p
            className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            Related concepts
          </p>
          <div className="flex flex-wrap gap-2.5">
            {resolvedSeeAlso.map(({ ref, id: refId, term: refTerm }) =>
              refId && refTerm ? (
                <Link key={ref} href={`/terms/${refId}`} className="see-also-pill" style={{ fontFamily: "var(--font-serif)" }}>
                  {refTerm.term}
                </Link>
              ) : (
                <span
                  key={ref}
                  className="rounded-full px-3 py-1 text-sm italic border"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--color-ink-faint)",
                    borderColor: "var(--color-border-soft)",
                  }}
                >
                  {ref}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex flex-wrap items-center gap-3 border-t pt-8"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link href="/random" className="btn-ghost" style={{ fontFamily: "var(--font-sans)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
          </svg>
          Random term
        </Link>
        <CopyLinkButton url={termUrl} />
      </div>

      {/* Prev / Next */}
      <nav
        className="mt-10 grid grid-cols-2 gap-3 border-t pt-8"
        style={{ borderColor: "var(--color-border-soft)" }}
      >
        {prev ? (
          <Link href={`/terms/${prev.id}`} className="nav-card">
            <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
              ← Previous
            </span>
            <span className="text-sm font-semibold leading-snug" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>
              {prev.term}
            </span>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/terms/${next.id}`} className="nav-card text-right">
            <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}>
              Next →
            </span>
            <span className="text-sm font-semibold leading-snug" style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}>
              {next.term}
            </span>
          </Link>
        ) : <div />}
      </nav>
    </article>
  );
}
