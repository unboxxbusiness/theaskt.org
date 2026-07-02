import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/date";

interface LearnHeroCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  authorName?: string;
  categoryName?: string;
  isBreaking?: boolean;
  isLatest?: boolean;
  isFeatured?: boolean;
  isSponsored?: boolean;
  readingTime?: number;
}

export default function LearnHeroCard({
  title,
  slug,
  excerpt,
  publishedAt,
  authorName = "Editor",
  categoryName,
  isBreaking = false,
  isLatest = false,
  isFeatured = false,
  isSponsored = false,
  readingTime,
}: LearnHeroCardProps) {
  const classificationBadge = isBreaking
    ? { label: "Breaking", style: "bg-red-600 text-white" }
    : isFeatured
    ? { label: "Featured", style: "bg-amber-500 text-white" }
    : isSponsored
    ? { label: "Sponsored", style: "bg-bg-secondary border border-border-primary text-text-secondary" }
    : isLatest
    ? { label: "Latest", style: "bg-link text-btn-primary-text" }
    : null;

  return (
    <article className="space-y-5 pb-8 border-b border-border-primary">
      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {classificationBadge && (
          <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${classificationBadge.style}`}>
            {classificationBadge.label}
          </span>
        )}
        {categoryName && (
          <Badge variant="category">{categoryName}</Badge>
        )}
      </div>

      {/* Title */}
      <Link href={`/learn/${slug}`} className="block group">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-text-h group-hover:text-link transition-colors line-clamp-3">
          {title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-sm sm:text-base text-text-secondary leading-7 line-clamp-3 font-sans">
        {excerpt}
      </p>

      {/* Byline + CTA row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted font-sans">
          By{" "}
          <span className="font-semibold text-text-secondary">{authorName}</span>
          {publishedAt && <> &middot; {formatDate(publishedAt)}</>}
          {readingTime && <> &middot; {readingTime} min read</>}
        </p>
        <Link
          href={`/learn/${slug}`}
          className="text-xs font-bold text-link hover:text-link-hover transition-colors inline-flex items-center gap-1 font-sans"
        >
          Read Full Article &rarr;
        </Link>
      </div>
    </article>
  );
}
