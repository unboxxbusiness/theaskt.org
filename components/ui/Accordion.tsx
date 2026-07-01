import React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  /* ponytail: HTML5 details/summary wrappers achieve accessible collapse without heavy JS libraries */
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <details
          key={index}
          className="group border border-border-primary rounded-xl bg-bg-secondary p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all duration-200"
        >
          <summary className="flex items-center justify-between text-xs font-bold text-text-h list-none outline-none">
            <span>{item.title}</span>
            <span className="transition-transform duration-200 group-open:rotate-180 text-text-secondary">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <div className="mt-3 text-xs text-text-secondary leading-relaxed border-t border-border-primary/50 pt-3">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
