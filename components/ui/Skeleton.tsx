import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  /* ponytail: dynamic pulse layout to represent items loading state */
  return <div className={`animate-pulse bg-border-primary/50 dark:bg-border-secondary rounded ${className}`} />;
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin h-5 w-5 text-link ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4 border border-border-primary rounded-xl">
      <Skeleton className="w-full h-32 rounded-lg" />
      <Skeleton className="w-16 h-3.5" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-5/6 h-3" />
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-2/3 h-5" />
      </div>
      <Skeleton className="w-full h-64 rounded-xl" />
      <div className="space-y-2.5">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    </div>
  );
}

