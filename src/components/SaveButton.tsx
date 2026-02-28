"use client";

import { useState, useEffect, useCallback } from "react";
import { isSaved, toggleSaved } from "@/lib/saved";

type Props = {
  termId: string;
  size?: "sm" | "md";
};

export function SaveButton({ termId, size = "md" }: Props) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sync = useCallback(() => {
    setSaved(isSaved(termId));
  }, [termId]);

  useEffect(() => {
    setMounted(true);
    sync();
    const handler = () => sync();
    window.addEventListener("theologia-saved-change", handler);
    return () => window.removeEventListener("theologia-saved-change", handler);
  }, [sync]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSaved(termId);
    setSaved(nowSaved);
  }

  if (!mounted) {
    return <div className={size === "sm" ? "w-7 h-7" : "w-9 h-9"} />;
  }

  const dim = size === "sm" ? 16 : 20;

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save for study"}
      title={saved ? "Remove from saved" : "Save for study"}
      className="flex items-center justify-center rounded-lg transition-all duration-150 active:scale-90"
      style={{
        width: size === "sm" ? "1.75rem" : "2.25rem",
        height: size === "sm" ? "1.75rem" : "2.25rem",
        color: saved ? "var(--color-gold)" : "var(--color-ink-faint)",
        background: saved ? "var(--color-highlight)" : "transparent",
        border: saved ? "1px solid var(--color-gold)" : "1px solid transparent",
      }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={saved ? "0" : "1.75"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
