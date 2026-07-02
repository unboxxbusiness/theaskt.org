"use client";

import { useEffect, useState } from "react";
import { getScrollProgress } from "@/hooks/useScrollProgress";
import { BookOpen, X } from "lucide-react";
import Typography from "../typography/Typography";

interface ReadingResumeToastProps {
  slug: string;
}

export default function ReadingResumeToast({ slug }: ReadingResumeToastProps) {
  const [progress, setProgress] = useState<{ scrollY: number; percentage: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const saved = getScrollProgress(slug);
    if (saved && saved.percentage > 10 && saved.percentage < 90) {
      setProgress(saved);
      // Show after a slight delay for better layout transitions
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [slug]);

  const handleResume = () => {
    if (progress) {
      window.scrollTo({
        top: progress.scrollY,
        behavior: "smooth",
      });
      setIsVisible(false);
    }
  };

  if (!isVisible || !progress) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-slide-in">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-primary bg-bg-card p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-link flex-shrink-0" />
          <div className="text-left">
            <Typography variant="h4" className="text-xs font-semibold text-text-h">
              Continue Reading?
            </Typography>
            <Typography variant="small" className="text-text-muted text-[10px] block mt-0.5">
              You read {progress.percentage}% last time.
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResume}
            className="px-3 py-1.5 rounded-lg bg-link text-btn-primary-text hover:bg-link-hover text-[11px] font-bold transition-colors cursor-pointer"
          >
            Resume
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-bg-secondary text-text-muted hover:text-text-h transition-colors cursor-pointer"
            aria-label="Dismiss resume reading prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
