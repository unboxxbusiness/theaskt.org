import React from "react";
import Container from "./Container";
import Typography from "../typography/Typography";

interface PolicyLayoutProps {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, effectiveDate, children }: PolicyLayoutProps) {
  /* ponytail: structured template to avoid duplicate sections on legal and disclaimer views */
  return (
    <Container className="py-16 max-w-3xl">
      <div className="space-y-4 text-center pb-8 border-b border-border-primary mb-8">
        <Typography variant="display">{title}</Typography>
        <Typography variant="small" className="italic">Effective Date: {effectiveDate}</Typography>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-text-secondary leading-relaxed font-sans space-y-6">
        {children}
      </div>
    </Container>
  );
}
