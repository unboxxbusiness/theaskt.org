"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Typography from "../typography/Typography";
import JsonLd from "../shared/JsonLd";

interface BreadcrumbProps {
  items?: Array<{
    label: string;
    url: string;
  }>;
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  // If no items are explicitly provided, automatically generate them from the pathname
  const breadcrumbItems = items || React.useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, idx) => {
      const url = "/" + segments.slice(0, idx + 1).join("/");
      const label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return { label, url };
    });
  }, [pathname]);

  if (breadcrumbItems.length === 0) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://theaskt.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...breadcrumbItems.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": item.label,
        "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`
      }))
    ]
  };

  /* ponytail: simple auto-generated breadcrumbs leveraging route paths */
  return (
    <>
      <JsonLd schema={schema} />
      <nav className="flex items-center gap-1.5 text-xs text-text-muted select-none" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-link transition-colors flex items-center justify-center p-0.5">
          <Home className="h-3.5 w-3.5" />
        </Link>
        {breadcrumbItems.map((item, idx) => {
          const isLast = idx === breadcrumbItems.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3 w-3 text-text-muted/65 flex-shrink-0" />
              {isLast ? (
                <span className="font-semibold text-text-h truncate max-w-[160px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.url} className="hover:text-link transition-colors truncate max-w-[120px]">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
