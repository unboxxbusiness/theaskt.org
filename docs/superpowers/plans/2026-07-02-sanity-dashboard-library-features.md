# Sanity Dashboard Fixes & User Library Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Sanity Studio editorial dashboard branding and GROQ duplication issues, add article classification toggles, and implement client-side library features (Bookmarks, Offline Downloads, Reading Progress tracking, and Continue Reading scroll prompts).

**Architecture:** We will update Sanity configurations and schemas to add fields and correct GROQ queries. On the client side, we will implement a unified local storage library hook/utility and a scroll listener hook. Then we will add control buttons, scroll resume popups, and a central `/library` page.

**Tech Stack:** Next.js, Sanity, TypeScript, TailwindCSS, Lucide Icons, LocalStorage.

## Global Constraints
- Do not use external TTS services.
- Never write page-level files `app/**/page.tsx` with `"use client"` directly; wrap child client sub-components instead.

---

### Task 1: Sanity Workspace branding and classification fields

**Files:**
- Modify: `sanity.config.ts`
- Modify: `sanity/schemaTypes/contentFactory.ts`

- [ ] **Step 1: Modify sanity.config.ts to update the workspace name**
  Change the workspace `name` from `'default'` to `'theaskt'` in `sanity.config.ts`.
  ```diff
  export default defineConfig({
  -  name: 'default',
  +  name: 'theaskt',
     title: 'TheAskt Studio',
  ```

- [ ] **Step 2: Add feed classification fields in sanity/schemaTypes/contentFactory.ts**
  Add the four classification toggles (`isBreaking`, `isLatest`, `isFeatured`, and `isSponsored`) inside the `contentFactory.ts` fields array right after the `status` field definition (around line 324).
  ```typescript
        defineField({
          name: 'isBreaking',
          title: 'Breaking News',
          type: 'boolean',
          group: 'content',
          initialValue: false,
        }),
        defineField({
          name: 'isLatest',
          title: 'Latest News',
          type: 'boolean',
          group: 'content',
          initialValue: true,
        }),
        defineField({
          name: 'isFeatured',
          title: 'Featured Article',
          type: 'boolean',
          group: 'content',
          initialValue: false,
        }),
        defineField({
          name: 'isSponsored',
          title: 'Sponsored Content',
          type: 'boolean',
          group: 'content',
          initialValue: false,
        }),
  ```

- [ ] **Step 3: Verify sanity studio compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no compilation errors.

- [ ] **Step 4: Commit**
  ```bash
  git add sanity.config.ts sanity/schemaTypes/contentFactory.ts
  git commit -m "feat: configure sanity branding and classification schema fields"
  ```

---

### Task 2: Sanity Editorial Dashboard GROQ Query fixes

**Files:**
- Modify: `sanity/components/EditorialDashboard.tsx`

- [ ] **Step 1: Clean up unboxxbusiness branding name**
  Override the welcome back user greeting name (around line 39) so that if it equals `"unboxxbusiness"` or `"unboxx"`, it displays `"TheAskt Editor"`.
  ```typescript
  const rawName = currentUser?.name || '';
  const name = rawName === 'unboxxbusiness' || rawName === 'unboxx' ? 'TheAskt Editor' : rawName;
  ```
  Update the JSX welcome text on line 181 to use this resolved `name` instead of `currentUser?.name`.

- [ ] **Step 2: Update GROQ queries to deduplicate draft/published versions**
  Modify the `draftsQuery`, `myQuery`, `scheduledQuery`, and `reviewQuery` GROQ statements to ensure only the latest version of each article is returned. Update `publishedQuery` to target published files (`!(_id in path("drafts.**"))`).
  ```typescript
          // 1. Recent Drafts
          const draftsQuery = `*[_type == "article" && _id in path("drafts.**")] | order(_updatedAt desc)[0..4]{
            _id, _type, title, _updatedAt, status, "authorName": author->name
          }`;
          
          // 2. My Articles (latest version only, prioritizing drafts)
          const myQuery = `*[_type == "article" && author->name == $name && (!(_id in path("drafts.**")) && !defined(*[_id == "drafts." + ^._id][0])) || (_id in path("drafts.**"))] | order(_updatedAt desc)[0..4]{
            _id, _type, title, _updatedAt, status, "authorName": author->name
          }`;

          // 3. Scheduled Posts
          const scheduledQuery = `*[_type == "article" && (status == "scheduled" || publishedAt > now()) && (!(_id in path("drafts.**")) && !defined(*[_id == "drafts." + ^._id][0])) || (_id in path("drafts.**"))] | order(publishedAt asc)[0..4]{
            _id, _type, title, _updatedAt, publishedAt, status, "authorName": author->name
          }`;

          // 4. Needs Review
          const reviewQuery = `*[_type == "article" && status == "inReview" && (!(_id in path("drafts.**")) && !defined(*[_id == "drafts." + ^._id][0])) || (_id in path("drafts.**"))] | order(_updatedAt desc)[0..4]{
            _id, _type, title, _updatedAt, status, "authorName": author->name
          }`;

          // 5. Published Today (exclude drafts entirely)
          const publishedQuery = `*[_type == "article" && !(_id in path("drafts.**")) && publishedAt >= $todayStart] | order(publishedAt desc)[0..4]{
            _id, _type, title, _updatedAt, publishedAt, status, "authorName": author->name
          }`;
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add sanity/components/EditorialDashboard.tsx
  git commit -m "fix: clean editorial dashboard greetings and query duplications"
  ```

---

### Task 3: Local Storage utility for library management

**Files:**
- Create: `lib/storage/libraryStorage.ts`

- [ ] **Step 1: Create local library storage module**
  Create `lib/storage/libraryStorage.ts` implementing actions for bookmarks, downloads, and reading history.
  ```typescript
  export interface ArticleData {
    slug: string;
    title: string;
    excerpt?: string;
    content?: any[];
    coverImageUrl?: string | null;
    readingTime?: number;
    authorName?: string;
    publishDate?: string;
    category?: string;
  }

  const STORAGE_KEYS = {
    BOOKMARKS: "theaskt_bookmarks",
    DOWNLOADS: "theaskt_downloads",
    HISTORY: "theaskt_history",
  };

  export function getBookmarks(): ArticleData[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]");
  }

  export function toggleBookmark(article: ArticleData): boolean {
    const list = getBookmarks();
    const index = list.findIndex((a) => a.slug === article.slug);
    if (index > -1) {
      list.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return false; // unbookmarked
    } else {
      list.unshift(article);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return true; // bookmarked
    }
  }

  export function isBookmarked(slug: string): boolean {
    return getBookmarks().some((a) => a.slug === slug);
  }

  export function getDownloads(): ArticleData[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADS) || "[]");
  }

  export function toggleDownload(article: ArticleData): boolean {
    const list = getDownloads();
    const index = list.findIndex((a) => a.slug === article.slug);
    if (index > -1) {
      list.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(list));
      return false; // deleted
    } else {
      list.unshift(article);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(list));
      return true; // downloaded
    }
  }

  export function isDownloaded(slug: string): boolean {
    return getDownloads().some((a) => a.slug === slug);
  }

  export function addToHistory(article: ArticleData) {
    if (typeof window === "undefined") return;
    const list: ArticleData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    const filtered = list.filter((a) => a.slug !== article.slug);
    filtered.unshift(article);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 30)));
  }

  export function getHistory(): ArticleData[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add lib/storage/libraryStorage.ts
  git commit -m "feat: add unified local storage library management system"
  ```

---

### Task 4: Scroll progress tracker hook

**Files:**
- Create: `hooks/useScrollProgress.ts`

- [ ] **Step 1: Create scroll listener hook**
  Create `hooks/useScrollProgress.ts` to compute reading percentages and track vertical pixel positions in localStorage.
  ```typescript
  "use client";

  import { useEffect } from "react";

  export function useScrollProgress(slug: string) {
    useEffect(() => {
      if (typeof window === "undefined" || !slug) return;

      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        const currentScroll = window.scrollY;
        const percentage = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));

        const progressData = JSON.parse(localStorage.getItem("theaskt_scroll_progress") || "{}");
        progressData[slug] = {
          scrollY: currentScroll,
          percentage,
          updatedAt: Date.now(),
        };

        localStorage.setItem("theaskt_scroll_progress", JSON.stringify(progressData));
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [slug]);
  }

  export function getScrollProgress(slug: string): { scrollY: number; percentage: number } | null {
    if (typeof window === "undefined") return null;
    const progressData = JSON.parse(localStorage.getItem("theaskt_scroll_progress") || "{}");
    return progressData[slug] || null;
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add hooks/useScrollProgress.ts
  git commit -m "feat: implement scroll progress tracker hook"
  ```

---

### Task 5: Resume reading floating toast

**Files:**
- Create: `components/shared/ReadingResumeToast.tsx`

- [ ] **Step 1: Create Resume toast component**
  Create `components/shared/ReadingResumeToast.tsx` that displays a slide-up toast if saved progress is between 10% and 90%. Smooth scrolls when clicked.
  ```typescript
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
      const saved = getScrollProgress(slug);
      if (saved && saved.percentage > 10 && saved.percentage < 90) {
        setProgress(saved);
        // Show after a slight delay for better transition
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
            <div>
              <Typography variant="h4" className="text-xs font-semibold text-text-h">
                Continue Reading?
              </Typography>
              <Typography variant="small" className="text-text-muted text-[10px]">
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
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add components/shared/ReadingResumeToast.tsx
  git commit -m "feat: create ReadingResumeToast smooth-scroll prompt component"
  ```

---

### Task 6: Article Layout page integration

**Files:**
- Modify: `components/layout/ArticleLayout.tsx`

- [ ] **Step 1: Integrate scroll hook, bookmark/download triggers, and toast**
  Modify `ArticleLayout.tsx` to handle bookmarks/downloads, use the scroll tracking hook, and mount `<ReadingResumeToast />`.
  ```typescript
  // Around line 30, inside destructuring:
  content = [],
  
  // Right after speech Synthesis initialization:
  useScrollProgress(categorySlug ? `${categorySlug}/${title}` : title); // Fallback to unique name if slug isn't simple
  const articleSlug = categorySlug ? `${categorySlug}/${title}` : title; // use simpler mapping if available

  // Add history logging inside useEffect:
  React.useEffect(() => {
    if (title) {
      addToHistory({
        slug: window.location.pathname.replace('/learn/', ''),
        title,
        excerpt: "Article Reading Session",
        coverImageUrl,
        readingTime,
        authorName,
        publishDate,
        category,
      });
    }
  }, [title]);

  const [savedBookmark, setSavedBookmark] = React.useState(false);
  const [savedOffline, setSavedOffline] = React.useState(false);
  const pageSlugRef = React.useRef("");

  React.useEffect(() => {
    const slug = window.location.pathname.replace('/learn/', '');
    pageSlugRef.current = slug;
    setSavedBookmark(isBookmarked(slug));
    setSavedOffline(isDownloaded(slug));
  }, []);

  const handleToggleBookmark = () => {
    const state = toggleBookmark({
      slug: pageSlugRef.current,
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
      slug: pageSlugRef.current,
      title,
      content,
      coverImageUrl,
      readingTime,
      authorName,
      publishDate,
      category,
    });
    setSavedOffline(state);
  };
  ```

- [ ] **Step 2: Update buttons layout near the metadata block**
  Place bookmark and offline download actions adjacent to the ListenButton:
  ```typescript
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-98 cursor-pointer font-sans shadow-xs ${
              savedOffline
                ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-extrabold"
                : "border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h"
            }`}
          >
            {savedOffline ? "Saved Offline" : "Download Offline"}
          </button>
        </div>
  ```

- [ ] **Step 3: Mount ReadingResumeToast**
  Place `<ReadingResumeToast slug={pageSlugRef.current} />` right before the closing `</Container>`.

- [ ] **Step 4: Commit**
  ```bash
  git add components/layout/ArticleLayout.tsx
  git commit -m "feat: bind bookmarks, offline downloads, and resume toasts in ArticleLayout"
  ```

---

### Task 7: Library dashboard page

**Files:**
- Create: `app/library/page.tsx`

- [ ] **Step 1: Create client-side library page**
  Create `app/library/page.tsx` to display Bookmarks, Offline downloads, and History. Supports reading full downloaded articles directly inside an overlay modal.
  ```typescript
  "use client";

  import React, { useState, useEffect } from "react";
  import Container from "@/components/layout/Container";
  import Typography from "@/components/typography/Typography";
  import { getBookmarks, getDownloads, getHistory, ArticleData } from "@/lib/storage/libraryStorage";
  import { getScrollProgress } from "@/hooks/useScrollProgress";
  import Link from "next/link";
  import { Bookmark, Download, History, BookOpen, ChevronRight, X, ArrowLeft } from "lucide-react";
  import CustomPortableText from "@/app/learn/[slug]/page"; // import portable text viewer if exported, or build custom local copy

  export default function LibraryPage() {
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
        <div key={art.slug} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border-primary bg-bg-card hover:border-link transition-all group">
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
            <Typography variant="h3" className="text-sm font-bold text-text-h group-hover:text-link transition-colors truncate">
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
        <div className="space-y-2">
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
          <div className="fixed inset-0 z-50 bg-bg-primary/95 overflow-y-auto p-4 md:p-8 animate-fade-in flex flex-col">
            <Container className="max-w-3xl flex-1 flex flex-col space-y-6 pt-10">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <button
                  onClick={() => setActiveOfflineArticle(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-h transition-colors font-semibold cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to library
                </button>
                <button
                  onClick={() => setActiveOfflineArticle(null)}
                  className="p-1.5 rounded-full hover:bg-bg-secondary text-text-muted hover:text-text-h transition-colors cursor-pointer"
                  aria-label="Close offline reading pane"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
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

              {/* Simplified plain-text paragraph list generator for offline reading */}
              <div className="prose prose-sm dark:prose-invert text-text-body space-y-4 pt-4 leading-relaxed font-serif text-[15px]">
                {activeOfflineArticle.content && Array.isArray(activeOfflineArticle.content) ? (
                  activeOfflineArticle.content.map((block: any, idx: number) => {
                    if (block._type === "block" && block.children) {
                      const textVal = block.children.map((c: any) => c.text || "").join("");
                      return <p key={idx}>{textVal}</p>;
                    }
                    return null;
                  })
                ) : (
                  <p className="italic text-text-muted">No offline content available.</p>
                )}
              </div>
            </Container>
          </div>
        )}
      </Container>
    );
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add app/library/page.tsx
  git commit -m "feat: implement My Library page with offline reading modal layout"
  ```

---

### Task 8: Navbar links

**Files:**
- Modify: `components/navigation/Navbar.tsx`

- [ ] **Step 1: Render Library links in Navbar lists**
  Add the "My Library" link to the navbar choices. Let's view the nav links around line 60 of `Navbar.tsx` and append:
  ```typescript
  { href: "/library", label: "My Library" }
  ```
  in both desktop menu lists and hamburger drawers.

- [ ] **Step 2: Commit**
  ```bash
  git add components/navigation/Navbar.tsx
  git commit -m "feat: add My Library route navigation link in Navbar"
  ```

---

### Task 9: Compilation & Build Validation

**Files:**
- Test: Build output

- [ ] **Step 1: Run TypeScript compilation checks**
  Run: `npx tsc --noEmit`
  Expected: Command completes with 0 errors.

- [ ] **Step 2: Run Next.js production build**
  Run: `npm run build`
  Expected: Next.js build bundle compiles successfully with exit code 0.

- [ ] **Step 3: Commit**
  ```bash
  git commit --allow-empty -m "build: verify editorial dashboard and library feature integrations"
  ```
