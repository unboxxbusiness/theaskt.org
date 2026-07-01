import React from "react";
import Link from "next/link";
import Typography from "../typography/Typography";
import Button from "../ui/Button";

interface CtaSectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  background?: "primary" | "secondary" | "accent";
  alignment?: "left" | "center" | "right";
}

export default function CtaSection({
  title,
  description,
  ctaText,
  ctaLink,
  secondaryText,
  secondaryLink,
  background = "secondary",
  alignment = "center",
}: CtaSectionProps) {
  const bgClasses = {
    primary: "bg-bg-primary border border-border-primary",
    secondary: "bg-bg-secondary border border-border-primary",
    accent: "bg-footer-bg text-footer-heading border border-border-primary"
  };

  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end"
  };

  /* ponytail: simple and premium call to action banner conforming to spacing guidelines */
  return (
    <section className={`py-12 px-6 sm:px-8 rounded-2xl w-full max-w-4xl flex flex-col gap-6 ${bgClasses[background]} ${alignClasses[alignment]}`}>
      <div className="space-y-2 max-w-2xl">
        <Typography variant="h2" className={alignment === "center" ? "text-center" : alignment === "left" ? "text-left" : "text-right"}>
          {title}
        </Typography>
        <Typography variant="small" className="leading-relaxed block">
          {description}
        </Typography>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary" as={Link} href={ctaLink}>
          {ctaText}
        </Button>
        {secondaryText && secondaryLink && (
          <Button variant="secondary" as={Link} href={secondaryLink}>
            {secondaryText}
          </Button>
        )}
      </div>
    </section>
  );
}
