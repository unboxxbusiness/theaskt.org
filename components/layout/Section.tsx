import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  divider?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  divider = false,
}: SectionProps) {
  /* ponytail: standardized padding gaps for editorial layout rhythm */
  return (
    <section id={id} className={`py-20 md:py-28 ${divider ? "border-t border-border-primary" : ""} ${className}`}>
      {children}
    </section>
  );
}
