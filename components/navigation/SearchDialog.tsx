"use client";

import { useEffect, useState } from 'react';
import { Search, X, BookOpen, User, Folder, Tag } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  type: 'article' | 'author' | 'category' | 'tag';
  url: string;
}

export default function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
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
          let type: 'article' | 'author' | 'category' | 'tag' = 'article';
          let url = `/learn/${item.slug}`;

          if (item._type === 'category') {
            type = 'category';
            url = `/learn/category/${item.slug}`;
          } else if (item._type === 'tag') {
            type = 'tag';
            url = `/learn/tag/${item.slug}`;
          } else if (item._type === 'author') {
            type = 'author';
            url = `/learn/author/${item.slug}`;
          }

          return {
            title: item.title,
            type,
            url
          };
        });

        setResults(mapped);
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce to prevent Sanity API request flooding

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  /* ponytail: refactored GlobalSearch into SearchDialog layout matching modal z-indices */
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-20">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="w-full max-w-lg rounded-xl border border-border-primary bg-bg-card shadow-2xl overflow-hidden animate-fade-in relative z-10">
        <div className="flex items-center gap-3 border-b border-border-primary px-4 py-3 bg-bg-secondary text-text-h">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search articles, guides, tags, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text-h outline-none placeholder-text-muted"
            autoFocus
          />
          <button onClick={onClose} className="rounded p-1 hover:bg-bg-section-alt text-text-muted hover:text-text-h transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 bg-bg-card">
          {loading ? (
            <div className="py-8 text-center text-xs text-text-muted">
              Searching indices...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, idx) => (
                <Link
                  key={idx}
                  href={result.url}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-h"
                >
                  {result.type === 'article' && <BookOpen className="h-3.5 w-3.5 text-text-muted" />}
                  {result.type === 'author' && <User className="h-3.5 w-3.5 text-text-muted" />}
                  {result.type === 'category' && <Folder className="h-3.5 w-3.5 text-text-muted" />}
                  {result.type === 'tag' && <Tag className="h-3.5 w-3.5 text-text-muted" />}
                  <span className="font-medium flex-1">{result.title}</span>
                  <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[9px] capitalize tracking-wide font-semibold text-text-muted">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-text-muted">
              {query ? "No matches found." : "Type search terms to explore..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
