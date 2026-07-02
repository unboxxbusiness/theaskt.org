"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import { getBookmarks, getDownloads, getHistory, ArticleData } from "@/lib/storage/libraryStorage";
import { getScrollProgress } from "@/hooks/useScrollProgress";
import Link from "next/link";
import { Bookmark, Download, History, BookOpen, ChevronRight, X, ArrowLeft } from "lucide-react";
import CustomPortableText from "@/components/shared/CustomPortableText";

export default function LibraryView() {
  const [tab, setTab] = useState<"bookmarks" | "downloads" | "history">("bookmarks");
  const [bookmarks, setBookmarks] = useState<ArticleData[]>([]);
  const [downloads, setDownloads] = useState<ArticleData[]>([]);
  const [history, setHistory] = useState<ArticleData[]>([]);
  const [activeOfflineArticle, setActiveOfflineArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setDownloads(getDownloads());
    setHistory(getHistory());
  }, []);

  const getProgressInfo = (slug: string) => {
    const prog = getScrollProgress(slug);
    return prog ? prog.percentage : null;
  };

  const renderArticleItem = (art: ArticleData) => {
    const percentage = getProgressInfo(art.slug);

    return (
      <div 
        key={art.slug} 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border-primary bg-bg-card hover:border-link transition-all group"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {art.category && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-badge-feat-text bg-badge-feat-bg border border-badge-feat-text/20 px-2 py-0.5 rounded-full select-none">
                {art.category}
              </span>
            )}
            {percentage !== null && (
              <span className="text-[10px] font-semibold font-mono text-link">
                {percentage >= 90 ? "Completed" : `${percentage}% Read`}
              </span>
            )}
          </div>
          <Typography variant="h3" className="text-sm font-bold text-text-h group-hover:text-link transition-colors truncate text-left">
            {art.title}
          </Typography>
          <div className="text-[10px] text-text-secondary flex flex-wrap items-center gap-2">
            {art.authorName && <span>By {art.authorName}</span>}
            {art.readingTime && (
              <>
                <span className="text-text-muted">•</span>
                <span>{art.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {tab === "downloads" ? (
            <button
              onClick={() => setActiveOfflineArticle(art)}
              suppressHydrationWarning
              className="px-4 py-2 rounded-xl bg-link text-btn-primary-text hover:bg-link-hover text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" /> Read Offline
            </button>
          ) : (
            <Link
              href={`/learn/${art.slug}`}
              className="px-4 py-2 rounded-xl border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
            >
              Open Article <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <Container className="py-20 space-y-8 max-w-4xl min-h-[70vh]">
      <div className="space-y-2 text-left">
        <Typography variant="display" className="text-2xl font-bold font-serif leading-tight">My Library</Typography>
        <Typography variant="body" className="text-xs text-text-secondary leading-relaxed block">
          Access your bookmarked content, check reading history, and read offline downloads.
        </Typography>
      </div>

      {/* Tab triggers row */}
      <div className="flex border-b border-border-primary overflow-x-auto pb-1 gap-2 select-none">
        {(["bookmarks", "downloads", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            suppressHydrationWarning
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              tab === t
                ? "border-link text-link font-extrabold"
                : "border-transparent text-text-muted hover:text-text-h"
            }`}
          >
            {t === "bookmarks" && <Bookmark className="h-4 w-4" />}
            {t === "downloads" && <Download className="h-4 w-4" />}
            {t === "history" && <History className="h-4 w-4" />}
            <span className="capitalize">{t}</span>
          </button>
        ))}
      </div>

      {/* Lists sections */}
      <div className="space-y-4">
        {tab === "bookmarks" && (
          bookmarks.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-primary rounded-2xl">
              <Typography variant="body" className="text-xs text-text-secondary italic block">No bookmarked articles yet.</Typography>
            </div>
          ) : (
            bookmarks.map(renderArticleItem)
          )
        )}

        {tab === "downloads" && (
          downloads.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-primary rounded-2xl">
              <Typography variant="body" className="text-xs text-text-secondary italic block">No downloaded articles found.</Typography>
            </div>
          ) : (
            downloads.map(renderArticleItem)
          )
        )}

        {tab === "history" && (
          history.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-primary rounded-2xl">
              <Typography variant="body" className="text-xs text-text-secondary italic block">Your reading history is empty.</Typography>
            </div>
          ) : (
            history.map(renderArticleItem)
          )
        )}
      </div>

      {/* Offline Reader Modal Overlay */}
      {activeOfflineArticle && (
        <div className="fixed inset-0 z-50 bg-bg-primary overflow-y-auto p-4 md:p-8 animate-fade-in flex flex-col">
          <Container className="max-w-3xl flex-1 flex flex-col space-y-6 pt-10">
            <div className="flex items-center justify-between border-b border-border-primary pb-4">
              <button
                onClick={() => setActiveOfflineArticle(null)}
                suppressHydrationWarning
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-h transition-colors font-semibold cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to library
              </button>
              <button
                onClick={() => setActiveOfflineArticle(null)}
                suppressHydrationWarning
                className="p-1.5 rounded-full hover:bg-bg-secondary text-text-muted hover:text-text-h transition-colors cursor-pointer"
                aria-label="Close offline reading pane"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              {activeOfflineArticle.category && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-badge-feat-text bg-badge-feat-bg border border-badge-feat-text/20 px-2.5 py-0.5 rounded-full">
                  {activeOfflineArticle.category}
                </span>
              )}
              <Typography variant="h1" className="text-xl font-bold font-serif leading-tight">
                {activeOfflineArticle.title}
              </Typography>
              <div className="text-xs text-text-secondary flex items-center gap-3">
                {activeOfflineArticle.authorName && <span>By {activeOfflineArticle.authorName}</span>}
                {activeOfflineArticle.publishDate && <span>• {activeOfflineArticle.publishDate}</span>}
              </div>
            </div>

            {/* Portable Text offline rendering view */}
            <div className="prose prose-sm dark:prose-invert text-text-body space-y-4 pt-4 leading-relaxed font-serif text-[15px] pb-20">
              {activeOfflineArticle.content && Array.isArray(activeOfflineArticle.content) ? (
                <CustomPortableText value={activeOfflineArticle.content} />
              ) : (
                <p className="italic text-text-muted text-left">No offline content available.</p>
              )}
            </div>
          </Container>
        </div>
      )}
    </Container>
  );
}
