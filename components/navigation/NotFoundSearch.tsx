"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, User, Folder, Tag, X } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  title: string;
  type: "article" | "author" | "category" | "tag";
  url: string;
}

export default function NotFoundSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const rawResults = response.ok ? await response.json() : [];

        const mapped = rawResults.map((item: any) => {
          let type: "article" | "author" | "category" | "tag" = "article";
          let url = `/learn/${item.slug}`;

          if (item._type === "category") {
            type = "category";
            url = `/learn/category/${item.slug}`;
          } else if (item._type === "tag") {
            type = "tag";
            url = `/learn/tag/${item.slug}`;
          } else if (item._type === "author") {
            type = "author";
            url = `/learn/author/${item.slug}`;
          }

          return {
            title: item.title,
            type,
            url,
          };
        });

        setResults(mapped);
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="w-full max-w-lg mx-auto relative space-y-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tutorials, authors, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-bg-secondary border border-border-primary rounded-full px-5 py-3.5 pl-12 pr-12 text-sm text-text-h focus:outline-none focus:border-link transition-colors font-sans shadow-xs"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bg-section-alt text-text-muted hover:text-text-h transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {query.trim() && (
        <div className="absolute left-0 right-0 z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border-primary bg-bg-card shadow-xl p-2 animate-fade-in">
          {loading ? (
            <div className="py-8 text-center text-xs text-text-muted font-sans flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-link border-t-transparent rounded-full animate-spin"></span>
              Searching indices...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, idx) => (
                <Link
                  key={idx}
                  href={result.url}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-h font-sans"
                >
                  {result.type === "article" && <BookOpen className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />}
                  {result.type === "author" && <User className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />}
                  {result.type === "category" && <Folder className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />}
                  {result.type === "tag" && <Tag className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />}
                  <span className="font-medium flex-1 truncate">{result.title}</span>
                  <span className="rounded bg-bg-secondary px-2 py-0.5 text-[9px] capitalize tracking-wide font-semibold text-text-muted">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-text-muted font-sans">
              No matching publications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
