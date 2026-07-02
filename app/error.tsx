"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to console or error tracking service
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  return (
    <Container className="py-24 space-y-12 animate-fade-in max-w-2xl flex-1 flex flex-col justify-center">
      {/* Icon & Heading */}
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <Typography variant="h1" className="font-serif text-3xl font-bold text-text-h">
            Something Went Wrong
          </Typography>
          <Typography variant="lead" className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed font-sans">
            An unexpected runtime anomaly occurred in the application pipeline. We have flagged this error for review.
          </Typography>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap gap-4 justify-center items-center font-sans">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-98 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border-primary hover:bg-bg-secondary px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-h transition-all"
        >
          <Home className="h-3.5 w-3.5" />
          Return Home
        </Link>
      </div>

      {/* Collapsible Error Specs for Debugging */}
      <div className="border border-border-primary rounded-xl overflow-hidden bg-bg-secondary transition-all">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-5 py-4 text-xs font-semibold text-text-secondary hover:text-text-h transition-colors cursor-pointer bg-bg-secondary"
        >
          <span className="font-mono">Technical Details (Debug)</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showDetails && (
          <div className="border-t border-border-primary p-5 bg-bg-card font-mono text-[11px] leading-relaxed text-text-secondary space-y-3 max-h-56 overflow-y-auto">
            <div>
              <span className="font-bold text-red-500">Error:</span> {error.message || "Unknown Application Error"}
            </div>
            {error.digest && (
              <div>
                <span className="font-bold text-text-muted">Digest ID:</span> {error.digest}
              </div>
            )}
            <div className="text-[10px] text-text-muted italic pt-2">
              Note: Full traces are omitted in production environment settings for security containment.
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
