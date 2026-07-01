import React from "react";
import Container from "./Container";
import Typography from "../typography/Typography";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableOfContents from "../navigation/TableOfContents";
import ReadingProgress from "../shared/ReadingProgress";
import Image from "next/image";
import { formatDate } from "@/lib/date";

interface ArticleLayoutProps {
  title: string;
  category?: string;
  categorySlug?: string;
  authorName?: string;
  publishDate?: string;
  readingTime?: number;
  coverImageUrl?: string | null;
  children: React.ReactNode;
  relatedBlock?: React.ReactNode;
  newsletterBlock?: React.ReactNode;
}

export default function ArticleLayout({
  title,
  category,
  categorySlug,
  authorName,
  publishDate,
  readingTime,
  coverImageUrl,
  children,
  relatedBlock,
  newsletterBlock,
}: ArticleLayoutProps) {
  /* ponytail: central article/resources layout wrapper mapping correct responsive spacing grids */
  return (
    <Container className="py-20 space-y-10 relative">
      <ReadingProgress />
      
      <div className="space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-link-hover transition-colors font-sans font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to learn hub
          </Link>
          {category && (
            <>
              <span className="text-text-muted text-[10px] select-none">•</span>
              <Link 
                href={`/learn/category/${categorySlug}`} 
                className="inline-block text-[10px] uppercase font-bold tracking-wider text-badge-feat-text border border-badge-feat-text/20 bg-badge-feat-bg px-2.5 py-0.5 rounded-full hover:border-link transition-colors font-sans"
              >
                {category}
              </Link>
            </>
          )}
        </div>
        <Typography variant="h1" className="text-xl font-bold font-serif leading-tight">{title}</Typography>
        <div className="text-xs text-text-secondary flex flex-wrap items-center gap-3 font-sans">
          {authorName && <span>By <span className="font-semibold text-text-h">{authorName}</span></span>}
          {publishDate && <span className="text-text-muted">•</span>}
          {publishDate && <span>{formatDate(publishDate)}</span>}
          {readingTime && <span className="text-text-muted">•</span>}
          {readingTime && <span className="font-semibold text-link">{readingTime} min read</span>}
        </div>
      </div>

      {coverImageUrl && (
        <div className="relative w-full h-80 overflow-hidden rounded-xl border border-border-primary">
          <Image src={coverImageUrl} alt={title} fill className="object-cover" priority />
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* Mobile Table of Contents - placed at the top before the article text */}
          <div className="lg:hidden">
            <TableOfContents />
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-3xl text-text-body space-y-6">
            {children}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          {/* Desktop Table of Contents - sticky sidebar */}
          <div className="hidden lg:block">
            <TableOfContents />
          </div>
          {newsletterBlock}
          {relatedBlock}
        </div>
      </div>
    </Container>
  );
}
