"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { Term } from "@/lib/terms";

type Props = {
  terms: Term[];
  placeholder?: string;
  className?: string;
};

export function SearchBar({ terms, placeholder = "Search 498 terms…", className = "" }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Term[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fuse = useRef(
    new Fuse(terms, {
      keys: [
        { name: "term", weight: 3 },
        { name: "shortDefinition", weight: 1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    })
  );

  const search = useCallback(
    (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      const hits = fuse.current.search(q, { limit: 7 });
      setResults(hits.map((h) => h.item));
      setOpen(hits.length > 0);
      setActive(-1);
    },
    []
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    search(q);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && results[active]) {
        router.push(`/terms/${results[active].id}`);
        close();
      }
    } else if (e.key === "Escape") {
      close();
    }
  }

  function close() {
    setOpen(false);
    setActive(-1);
    setQuery("");
    inputRef.current?.blur();
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (active >= 0 && listRef.current) {
      const item = listRef.current.children[active] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [active]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className="flex items-center gap-2 px-3 rounded-lg border transition-all duration-150"
        style={{
          background: "var(--color-surface)",
          borderColor: open ? "var(--color-gold)" : "var(--color-border)",
          boxShadow: open ? "0 0 0 3px color-mix(in srgb, var(--color-gold) 15%, transparent)" : "none",
        }}
      >
        {/* Search icon */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--color-ink-faint)", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 py-2.5 bg-transparent outline-none text-sm min-w-0"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink)",
          }}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search theological terms"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />

        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="flex items-center justify-center w-4 h-4 rounded-sm transition-colors"
            style={{ color: "var(--color-ink-faint)" }}
            aria-label="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-dropdown)",
            maxHeight: "22rem",
            overflowY: "auto",
          }}
        >
          {results.map((term, i) => (
            <li key={term.id} role="option" aria-selected={i === active}>
              <Link
                href={`/terms/${term.id}`}
                onClick={close}
                className="flex flex-col gap-0.5 px-4 py-3 transition-colors duration-100"
                style={{
                  background:
                    i === active ? "var(--color-highlight)" : "transparent",
                  borderBottom: i < results.length - 1 ? `1px solid var(--color-border-soft)` : "none",
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-ink)" }}
                >
                  {term.term}
                </span>
                <span
                  className="text-xs leading-relaxed line-clamp-1"
                  style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}
                >
                  {term.shortDefinition}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/terms?q=${encodeURIComponent(query)}`}
              onClick={close}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs transition-colors"
              style={{
                borderTop: `1px solid var(--color-border)`,
                color: "var(--color-gold)",
                fontFamily: "var(--font-sans)",
                background: "transparent",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              See all results for &ldquo;{query}&rdquo;
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
