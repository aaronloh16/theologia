"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  letters: string[];
};

export function AlphabetNav({ letters }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Track which letter section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    letters.forEach((letter) => {
      const el = document.getElementById(`section-${letter}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(letter);
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [letters]);

  function scrollTo(letter: string) {
    const el = document.getElementById(`section-${letter}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActive(letter);
  }

  return (
    <div
      ref={navRef}
      className="sticky top-14 z-30 border-b py-2.5 overflow-x-auto"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 94%, transparent)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-0.5 px-4">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => scrollTo(letter)}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm font-medium transition-all duration-150"
            style={{
              fontFamily: "var(--font-sans)",
              color: active === letter ? "var(--color-surface)" : "var(--color-ink-muted)",
              background: active === letter ? "var(--color-gold)" : "transparent",
              fontSize: "0.8125rem",
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
