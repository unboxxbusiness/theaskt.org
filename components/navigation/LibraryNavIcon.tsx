"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Inline Bookmark SVG (no lucide import to avoid SSR issues)
function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const STORAGE_KEYS = [
  "theaskt_bookmarks",
  "theaskt_downloads",
  "theaskt_history",
];

function hasLibraryData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return STORAGE_KEYS.some((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    });
  } catch {
    return false;
  }
}

interface LibraryNavIconProps {
  className?: string;
}

export default function LibraryNavIcon({ className = "" }: LibraryNavIconProps) {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check on mount
    setHasData(hasLibraryData());

    // Re-check when localStorage changes (bookmark/download actions in other tabs)
    const handleStorage = () => setHasData(hasLibraryData());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!hasData) return null;

  return (
    <Link
      href="/library"
      aria-label="My Library"
      title="My Library"
      className={`text-nav-inactive hover:text-nav-hover transition-colors flex items-center justify-center rounded-full hover:bg-bg-secondary ${className}`}
    >
      <BookmarkIcon />
    </Link>
  );
}
