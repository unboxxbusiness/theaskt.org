import React from "react";

type BadgeVariant = "category" | "featured" | "new" | "popular";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "category", children, className = "" }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    category: "bg-badge-cat-bg text-badge-cat-text border border-border-primary/30",
    featured: "bg-badge-feat-bg text-badge-feat-text border border-[#FCA311]/20",
    new: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10",
    popular: "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-500/10",
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
