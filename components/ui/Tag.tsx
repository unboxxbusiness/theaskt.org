import React from "react";
import Link from "next/link";

interface TagProps {
  label: string;
  href?: string;
  className?: string;
}

export default function Tag({ label, href, className = "" }: TagProps) {
  const content = (
    <span className={`inline-flex items-center rounded-full bg-bg-secondary border border-border-primary px-2.5 py-0.5 text-[10px] font-medium text-text-secondary hover:bg-bg-section-alt hover:text-text-h transition-colors select-none ${className}`}>
      #{label}
    </span>
  );

  /* ponytail: simple linkable tag helper */
  if (href) {
    return <Link href={href} className="no-underline">{content}</Link>;
  }

  return content;
}
