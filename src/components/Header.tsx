import Link from "next/link";
import type { Term } from "@/lib/terms";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  terms: Term[];
};

export function Header({ terms }: Props) {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 90%, transparent)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-xs font-medium uppercase transition-opacity duration-150 hover:opacity-60"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink)",
            letterSpacing: "0.18em",
          }}
        >
          Theologia
        </Link>

        <div className="flex-1 max-w-md mx-auto">
          <SearchBar terms={terms} placeholder="Search terms…" />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link href="/terms" className="nav-pill hidden sm:inline-flex" style={{ fontFamily: "var(--font-sans)" }}>
            Browse A–Z
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
