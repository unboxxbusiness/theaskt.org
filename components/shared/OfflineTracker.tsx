"use client";

import { useEffect } from "react";

interface OfflineTrackerProps {
  slug: string;
  title: string;
  excerpt?: string;
}

export default function OfflineTracker({ slug, title, excerpt = "" }: OfflineTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("previously_read_articles");
      const list = stored ? JSON.parse(stored) : [];
      
      // Filter out duplicate entries for the current slug
      const filtered = list.filter((item: any) => item.slug !== slug);
      filtered.unshift({ slug, title, excerpt, timestamp: Date.now() });
      
      // Keep only the most recent 15 articles to save localstorage capacity
      const trimmed = filtered.slice(0, 15);
      
      localStorage.setItem("previously_read_articles", JSON.stringify(trimmed));
    } catch (e) {
      console.error("Error storing offline article metadata:", e);
    }
  }, [slug, title, excerpt]);

  /* ponytail: silent client-side localStorage visited articles list queue */
  return null;
}
