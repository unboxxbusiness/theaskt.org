"use client";

import { useEffect } from "react";

export function useScrollProgress(slug: string) {
  useEffect(() => {
    if (typeof window === "undefined" || !slug) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = window.scrollY;
      const percentage = Math.min(
        100,
        Math.max(0, Math.round((currentScroll / totalHeight) * 100))
      );

      try {
        const progressData = JSON.parse(localStorage.getItem("theaskt_scroll_progress") || "{}");
        progressData[slug] = {
          scrollY: currentScroll,
          percentage,
          updatedAt: Date.now(),
        };
        localStorage.setItem("theaskt_scroll_progress", JSON.stringify(progressData));
      } catch (e) {
        console.error("Error writing scroll progress data:", e);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);
}

export function getScrollProgress(slug: string): { scrollY: number; percentage: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const progressData = JSON.parse(localStorage.getItem("theaskt_scroll_progress") || "{}");
    return progressData[slug] || null;
  } catch {
    return null;
  }
}
