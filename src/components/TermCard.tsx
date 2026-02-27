import Link from "next/link";
import type { Term } from "@/lib/terms";

type Props = {
  term: Term;
};

export function TermCard({ term }: Props) {
  return (
    <Link href={`/terms/${term.id}`} className="term-card-link group">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3
            className="font-semibold leading-snug"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              fontSize: "1.125rem",
            }}
          >
            {term.term}
          </h3>
          <span
            className="shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-gold)" }}
          >
            →
          </span>
        </div>
        <p
          className="leading-relaxed line-clamp-2"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink-muted)",
            fontSize: "0.9375rem",
            lineHeight: "1.65",
          }}
        >
          {term.shortDefinition}
        </p>
        {term.seeAlso.length > 0 && (
          <p
            className="mt-2 text-xs"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-faint)" }}
          >
            See also: {term.seeAlso.slice(0, 3).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
