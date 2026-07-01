"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import Button from "@/components/ui/Button";

interface CachedArticle {
  slug: string;
  title: string;
  excerpt: string;
}

export default function OfflinePage() {
  const [cached, setCached] = useState<CachedArticle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("previously_read_articles");
      if (stored) {
        setCached(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read cached articles list:", e);
    }
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  /* ponytail: minimal offline page rendering cached read articles list */
  return (
    <Container className="py-20 max-w-xl text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Typography variant="display">Offline</Typography>
        <Typography variant="body" className="text-text-secondary leading-relaxed block">
          No internet connection detected. Please verify your connection status and try again.
        </Typography>
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={handleRetry} variant="primary">
          Retry Connection
        </Button>
        <Button as={Link} href="/" variant="outline">
          Return Home
        </Button>
      </div>

      {cached.length > 0 && (
        <div className="pt-8 border-t border-border-primary space-y-4 text-left">
          <Typography variant="h3" className="text-sm font-bold text-text-h">
            Continue Reading Visited Articles:
          </Typography>
          <div className="space-y-3">
            {cached.map((art, idx) => (
              <Link
                key={idx}
                href={`/learn/${art.slug}`}
                className="block p-4 rounded-xl border border-border-primary bg-bg-secondary hover:border-link transition-colors"
              >
                <Typography variant="h4" className="text-xs font-bold text-text-h hover:text-link transition-colors">
                  {art.title}
                </Typography>
                {art.excerpt && (
                  <Typography variant="small" className="line-clamp-2 leading-relaxed text-text-muted mt-1">
                    {art.excerpt}
                  </Typography>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
