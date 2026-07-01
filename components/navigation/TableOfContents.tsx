"use client";

import { useEffect, useState } from "react";
import Typography from "../typography/Typography";
import { ChevronDown, AlignLeft } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Find all h2 and h3 elements inside the prose body
    const prose = document.querySelector(".prose");
    if (!prose) return;

    const headingElements = prose.querySelectorAll("h2, h3");
    const items: HeadingItem[] = [];

    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      // Ensure the element has a unique ID for referencing
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-") + `-${index}`;
        el.id = id;
      }
      items.push({
        id,
        text,
        level: el.tagName.toLowerCase(),
      });
    });

    setHeadings(items);

    // Track active heading using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  /* ponytail: TableOfContents with dynamic IntersectionObserver active indicator highlights */
  return (
    <div className="w-full">
      {/* Mobile view accordion banner */}
      <div className="lg:hidden border border-border-primary bg-bg-secondary rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-text-h uppercase tracking-wider cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <AlignLeft className="h-4 w-4" /> Table of Contents
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileOpen ? "rotate-180" : ""}`} />
        </button>
        {isMobileOpen && (
          <div className="border-t border-border-primary px-4 py-3 bg-bg-card space-y-2.5 max-h-60 overflow-y-auto">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setIsMobileOpen(false)}
                className={`block text-xs transition-colors hover:text-link ${
                  h.level === "h3" ? "pl-3 text-text-muted" : "text-text-secondary"
                } ${activeId === h.id ? "text-link font-bold" : ""}`}
              >
                {h.text}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Desktop view sticky sidebar */}
      <div className="hidden lg:block sticky top-24 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
        <Typography variant="h4" className="text-[10px] font-bold text-text-muted tracking-wider uppercase border-b border-border-primary pb-2 block">
          In this article
        </Typography>
        <nav className="space-y-2">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-xs transition-all hover:text-link border-l-2 py-0.5 leading-relaxed ${
                h.level === "h3" 
                  ? "pl-4 text-text-muted text-[11px]" 
                  : "pl-3 text-text-secondary font-medium"
              } ${
                activeId === h.id 
                  ? "border-link text-link font-bold scale-[1.02] pl-4" 
                  : "border-transparent"
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
