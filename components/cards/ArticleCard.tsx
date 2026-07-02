import React from "react";
import Link from "next/link";
import Image from "next/image";
import Typography from "../typography/Typography";
import Badge from "../ui/Badge";
import { formatDate } from "@/lib/date";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  type?: string;
  coverImageUrl?: string | null;
  publishedAt?: string;
  authorName?: string;
  categoryName?: string;
  categorySlug?: string;
  variant?: "lead" | "secondary" | "opinion" | "trending" | "newspaper";
  index?: number;
  className?: string;
  isBreaking?: boolean;
  isLatest?: boolean;
  isFeatured?: boolean;
  isSponsored?: boolean;
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  type = "article",
  coverImageUrl,
  publishedAt,
  authorName = "Editor",
  categoryName,
  categorySlug,
  variant = "secondary",
  index = 0,
  className = "",
  isBreaking = false,
  isLatest = false,
  isFeatured = false,
  isSponsored = false,
}: ArticleCardProps) {
  // Resolve the priority label badge: Breaking > Featured > Sponsored > Latest
  const classificationBadge = isBreaking
    ? { label: "Breaking", style: "bg-red-600 text-white" }
    : isFeatured
    ? { label: "Featured", style: "bg-amber-500 text-white" }
    : isSponsored
    ? { label: "Sponsored", style: "bg-bg-secondary border border-border-primary text-text-secondary" }
    : isLatest
    ? { label: "Latest", style: "bg-link text-btn-primary-text" }
    : null;

  if (variant === "newspaper") {
    return (
      <article className={`space-y-3 pb-6 border-b border-border-primary group hover:-translate-y-0.5 transition-all duration-200 ${className}`}>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {classificationBadge && (
            <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${classificationBadge.style}`}>
              {classificationBadge.label}
            </span>
          )}
          {categoryName && (
            <Badge variant="category">{categoryName}</Badge>
          )}
        </div>
        <Link href={`/learn/${slug}`} className="block">
          <h3 className="font-serif text-base font-bold leading-snug text-text-h group-hover:text-link transition-colors line-clamp-3">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 font-sans">
          {excerpt}
        </p>
        <div className="pt-3 mt-3 border-t border-border-primary flex items-center justify-between text-[10px] text-text-muted font-sans">
          <span>By <span className="font-semibold">{authorName}</span></span>
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </article>
    );
  }
  /* ponytail: single unified article card with variants avoids duplicate layout elements in lists */
  if (variant === "trending") {
    return (
      <Link href={`/learn/${slug}`} className={`group flex gap-4 items-start pb-4 border-b border-border-secondary last:border-b-0 last:pb-0 ${className}`}>
        <span className="font-serif text-3xl font-extrabold text-border-primary dark:text-text-muted/30 leading-none group-hover:text-link-hover transition-colors">
          0{index + 1}
        </span>
        <div className="space-y-1">
          <h4 className="font-serif text-xs font-bold leading-snug text-text-h group-hover:text-link-hover transition-colors line-clamp-2">
            {title}
          </h4>
          <p className="text-[10px] text-text-muted">By {authorName}</p>
        </div>
      </Link>
    );
  }

  if (variant === "opinion") {
    return (
      <article className={`space-y-2 border-b border-border-secondary pb-6 last:border-b-0 last:pb-0 ${className}`}>
        {categoryName && (
          <div>
            <Badge variant="category">{categoryName}</Badge>
          </div>
        )}
        <Link href={`/learn/${slug}`} className="block group">
          <Typography variant="h3" className="group-hover:text-link-hover transition-colors text-base leading-snug">
            {title}
          </Typography>
        </Link>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <div className="text-[10px] text-text-muted pt-1">
          By <span className="font-medium text-text-secondary">{authorName}</span>
        </div>
      </article>
    );
  }

  if (variant === "lead") {
    return (
      <article className={`space-y-4 ${className}`}>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {classificationBadge && (
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${classificationBadge.style}`}>
                {classificationBadge.label}
              </span>
            )}
            {categoryName && (
              <Badge variant="featured">{categoryName}</Badge>
            )}
          </div>
          <Link href={`/learn/${slug}`} className="block group">
            <Typography variant="display" className="text-left group-hover:text-link-hover transition-colors">
              {title}
            </Typography>
          </Link>
        </div>
        
        {coverImageUrl ? (
          <div className="relative w-full h-64 overflow-hidden rounded-xl border border-border-primary">
            <Image src={coverImageUrl} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-56 bg-bg-secondary border border-border-primary rounded-xl flex items-center justify-center text-text-muted text-xs">
            Cover Illustration
          </div>
        )}
        
        <p className="text-sm text-text-secondary leading-7">
          {excerpt}
        </p>
        <div className="text-[10px] text-text-muted flex items-center gap-3">
          <span>By <span className="font-semibold text-text-secondary">{authorName}</span></span>
          {publishedAt && <span>•</span>}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </article>
    );
  }

  return (
    <article className={`space-y-3 hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {coverImageUrl && (
        <div className="relative w-full h-32 overflow-hidden rounded-xl border border-border-primary">
          <Image src={coverImageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {classificationBadge && (
          <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${classificationBadge.style}`}>
            {classificationBadge.label}
          </span>
        )}
        {categoryName && (
          <Badge variant="category">{categoryName}</Badge>
        )}
      </div>
      <Link href={`/learn/${slug}`} className="block group">
        <Typography variant="h3" className="group-hover:text-link-hover transition-colors line-clamp-2 text-base leading-snug">
          {title}
        </Typography>
      </Link>
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {excerpt}
      </p>
    </article>
  );
}
