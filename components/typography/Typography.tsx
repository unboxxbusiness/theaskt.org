import React from "react";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "lead"
  | "body-large"
  | "body"
  | "small"
  | "caption"
  | "label";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Typography({
  variant = "body",
  children,
  className = "",
  as,
}: TypographyProps) {
  /* ponytail: single unified component for all typographic elements to prevent font-size drift */
  const Component = as || (
    variant === "display" ? "h1" :
    variant === "h1" ? "h1" :
    variant === "h2" ? "h2" :
    variant === "h3" ? "h3" :
    variant === "h4" ? "h4" :
    variant === "label" ? "label" : "p"
  );

  const styles: Record<TypographyVariant, string> = {
    display: "font-serif text-4xl sm:text-5xl md:text-[length:var(--font-size-display)] font-extrabold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h1: "font-serif text-3xl sm:text-4xl md:text-[length:var(--font-size-h1)] font-extrabold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h2: "font-serif text-2xl sm:text-3xl md:text-[length:var(--font-size-h2)] font-bold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h3: "font-serif text-[length:var(--font-size-h3)] font-bold text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h4: "font-sans text-[length:var(--font-size-h4)] font-bold text-text-h uppercase tracking-wider",
    lead: "font-sans text-[length:var(--font-size-lead)] text-text-secondary leading-[var(--leading-body)]",
    "body-large": "font-serif text-[length:var(--font-size-body-large)] leading-[var(--leading-body)] text-text-body",
    body: "font-sans text-[length:var(--font-size-body)] leading-[var(--leading-body)] text-text-body",
    small: "font-sans text-[length:var(--font-size-small)] text-text-secondary leading-normal",
    caption: "font-sans text-[length:var(--font-size-caption)] text-text-muted leading-tight uppercase tracking-wider",
    label: "font-sans text-[length:var(--font-size-caption)] font-semibold text-text-secondary uppercase tracking-wider block mb-1",
  };

  let variantStyle = styles[variant];
  const hasCustomColor = className.split(" ").some((c) => c.startsWith("text-"));
  if (hasCustomColor) {
    variantStyle = variantStyle
      .replace(/\btext-text-h\b/g, "")
      .replace(/\btext-text-secondary\b/g, "")
      .replace(/\btext-text-body\b/g, "")
      .replace(/\btext-text-muted\b/g, "");
  }

  return (
    <Component className={`${variantStyle} ${className}`}>
      {children}
    </Component>
  );
}
