import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span
        className="mb-4 text-6xl font-light italic"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-gold)", opacity: 0.4 }}
      >
        404
      </span>
      <h1
        className="mb-3 text-2xl font-medium italic"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
      >
        Term not found
      </h1>
      <p
        className="mb-8 max-w-sm text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
      >
        This term doesn&apos;t exist in the dictionary. Try browsing all entries or searching for something.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/terms"
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
          style={{
            fontFamily: "var(--font-sans)",
            background: "var(--color-gold)",
            color: "var(--color-bg)",
          }}
        >
          Browse all terms
        </Link>
        <Link
          href="/"
          className="text-sm transition-colors duration-150"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
