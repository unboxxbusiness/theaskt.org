"use client";

import React from "react";
import Container from "./Container";
import Typography from "../typography/Typography";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableOfContents from "../navigation/TableOfContents";
import ReadingProgress from "../shared/ReadingProgress";
import Image from "next/image";
import { formatDate } from "@/lib/date";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { extractArticleText } from "@/lib/speech/extractArticleText";
import ListenButton from "../speech/ListenButton";
import ArticleSpeechPlayer from "../speech/ArticleSpeechPlayer";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import ReadingResumeToast from "../shared/ReadingResumeToast";
import { 
  isBookmarked, 
  isDownloaded, 
  toggleBookmark, 
  toggleDownload, 
  addToHistory 
} from "@/lib/storage/libraryStorage";

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
  content?: any[] | null;
  sources?: Array<{ title: string; url: string }> | null;
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
  content = [],
  sources = [],
}: ArticleLayoutProps) {
  const plainText = React.useMemo(() => extractArticleText(content), [content]);
  const speech = useSpeechSynthesis(plainText);

  const [savedBookmark, setSavedBookmark] = React.useState(false);
  const [savedOffline, setSavedOffline] = React.useState(false);
  const [pageSlug, setPageSlug] = React.useState("");

  React.useEffect(() => {
    // Resolve slug from URL on client side
    const slug = window.location.pathname.replace(/^\/learn\//, '').replace(/\/$/, '');
    setPageSlug(slug);
    setSavedBookmark(isBookmarked(slug));
    setSavedOffline(isDownloaded(slug));
    
    // Add to history list on mount
    addToHistory({
      slug,
      title,
      coverImageUrl,
      readingTime,
      authorName,
      publishDate,
      category,
    });
  }, [title, coverImageUrl, readingTime, authorName, publishDate, category]);

  // Activate scroll progress tracker (only runs when pageSlug resolves)
  useScrollProgress(pageSlug);

  const handleToggleBookmark = () => {
    const state = toggleBookmark({
      slug: pageSlug,
      title,
      coverImageUrl,
      readingTime,
      authorName,
      publishDate,
      category,
    });
    setSavedBookmark(state);
  };

  const handleToggleDownload = () => {
    const state = toggleDownload({
      slug: pageSlug,
      title,
      content: content || [],
      coverImageUrl,
      readingTime,
      authorName,
      publishDate,
      category,
    });
    setSavedOffline(state);
  };
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
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <ListenButton
            isPlaying={speech.isPlaying}
            isPaused={speech.isPaused}
            isSupported={speech.isSupported}
            onPlay={speech.play}
            onPause={speech.pause}
            onResume={speech.resume}
          />
          <button
            onClick={handleToggleBookmark}
            suppressHydrationWarning
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-98 cursor-pointer font-sans shadow-xs ${
              savedBookmark
                ? "border-link bg-bg-secondary text-link font-extrabold"
                : "border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h"
            }`}
          >
            {savedBookmark ? "Saved Bookmark" : "Bookmark"}
          </button>
          <button
            onClick={handleToggleDownload}
            suppressHydrationWarning
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-98 cursor-pointer font-sans shadow-xs ${
              savedOffline
                ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-extrabold"
                : "border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h"
            }`}
          >
            {savedOffline ? "Saved Offline" : "Download Offline"}
          </button>
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

          {sources && sources.length > 0 && (
            <div className="pt-6 mt-8 border-t border-border-primary text-xs text-text-secondary space-y-2 max-w-3xl font-sans">
              <p className="font-semibold text-text-h">Sources:</p>
              <ul className="list-disc list-inside space-y-1.5">
                {sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link hover:text-link-hover hover:underline transition-colors break-all"
                    >
                      {source.title} — {source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
      <ArticleSpeechPlayer controller={speech} />
      <ReadingResumeToast slug={pageSlug} />
    </Container>
  );
}
