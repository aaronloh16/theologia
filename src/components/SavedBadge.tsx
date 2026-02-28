"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSavedCount } from "@/lib/saved";

export function SavedBadge() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const sync = useCallback(() => {
    setCount(getSavedCount());
  }, []);

  useEffect(() => {
    setMounted(true);
    sync();
    const handler = () => sync();
    window.addEventListener("theologia-saved-change", handler);
    return () => window.removeEventListener("theologia-saved-change", handler);
  }, [sync]);

  if (!mounted) return null;

  return (
    <Link
      href="/saved"
      className="nav-pill relative"
      style={{ fontFamily: "var(--font-sans)" }}
      title={`${count} saved terms`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: count > 0 ? "var(--color-gold)" : "currentColor" }}>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
          style={{
            background: "var(--color-gold)",
            color: "var(--color-bg)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {count > 99 ? "99" : count}
        </span>
      )}
    </Link>
  );
}
