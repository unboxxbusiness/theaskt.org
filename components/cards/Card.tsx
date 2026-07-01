import React from "react";
import Link from "next/link";
import Image from "next/image";
import Typography from "../typography/Typography";
import Badge from "../ui/Badge";
import ArticleCard from "./ArticleCard";
import TestimonialCard from "./TestimonialCard";
import FeatureCard from "./FeatureCard";

interface BaseCardProps {
  variant: "article" | "category" | "author" | "resource" | "testimonial" | "feature";
  title?: string;
  slug?: string;
  description?: string;
  coverImageUrl?: string | null;
  authorName?: string;
  authorAvatar?: string | null;
  publishDate?: string;
  categoryName?: string;
  count?: number;
  quote?: string;
  role?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Card({
  variant,
  title,
  slug,
  description,
  coverImageUrl,
  authorName,
  authorAvatar,
  publishDate,
  categoryName,
  count,
  quote,
  role,
  icon,
  className = ""
}: BaseCardProps) {
  switch (variant) {
    case "article":
    case "resource":
      return (
        <ArticleCard
          title={title || ""}
          slug={slug || ""}
          excerpt={description || ""}
          coverImageUrl={coverImageUrl}
          authorName={authorName}
          publishedAt={publishDate}
          categoryName={categoryName}
          className={className}
        />
      );

    case "testimonial":
      return (
        <TestimonialCard
          name={title || authorName || ""}
          quote={quote || ""}
          role={role}
        />
      );

    case "feature":
      return (
        <FeatureCard
          title={title || ""}
          description={description || ""}
          icon={icon}
          className={className}
        />
      );

    case "category":
      return (
        <div className={`p-6 border border-border-primary bg-bg-secondary rounded-xl hover:border-link hover:shadow-lg transition-all duration-300 ${className}`}>
          <Link href={`/learn/category/${slug}`} className="group block space-y-1">
            <Typography variant="h3" className="group-hover:text-link-hover transition-colors text-base leading-snug">
              {title || categoryName}
            </Typography>
            {description && (
              <Typography variant="small" className="line-clamp-2 leading-relaxed">
                {description}
              </Typography>
            )}
            <Typography variant="caption" className="text-text-muted mt-2 block">
              {count} {count === 1 ? "article" : "articles"} &rarr;
            </Typography>
          </Link>
        </div>
      );

    case "author":
      return (
        <div className={`p-6 border border-border-primary bg-bg-secondary rounded-xl flex gap-4 hover:border-link hover:shadow-lg transition-all duration-300 ${className}`}>
          {authorAvatar ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border-primary flex-shrink-0">
              <Image src={authorAvatar} alt={authorName || "Author"} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-bg-primary border border-border-primary flex-shrink-0" />
          )}
          <div className="space-y-1.5">
            <Link href={`/learn/author/${slug}`} className="group">
              <Typography variant="h3" className="group-hover:text-link-hover transition-colors text-sm font-bold">
                {authorName}
              </Typography>
            </Link>
            {description && (
              <Typography variant="small" className="line-clamp-2 leading-relaxed text-xs">
                {description}
              </Typography>
            )}
          </div>
        </div>
      );

    case "resource":
      return (
        <div className={`p-5 border border-border-primary bg-bg-secondary rounded-xl hover:-translate-y-1 hover:border-link hover:shadow-lg transition-all duration-300 ${className}`}>
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="featured">RESOURCE</Badge>
            {publishDate && (
              <Typography variant="caption" className="text-text-muted">
                {new Date(publishDate).toLocaleDateString()}
              </Typography>
            )}
          </div>
          <Link href={`/learn/${slug}`} className="group block space-y-1">
            <Typography variant="h3" className="group-hover:text-link-hover transition-colors text-base font-bold leading-tight">
              {title}
            </Typography>
            <Typography variant="small" className="line-clamp-2 leading-relaxed text-xs">
              {description}
            </Typography>
          </Link>
        </div>
      );

    default:
      return null;
  }
}
