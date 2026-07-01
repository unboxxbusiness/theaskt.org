import React from "react";

export type ContainerVariant = "homepage" | "landing" | "article" | "policy" | "default";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: ContainerVariant;
}

export default function Container({
  children,
  className = "",
  variant = "default",
}: ContainerProps) {
  const widths: Record<ContainerVariant, string> = {
    homepage: "max-w-[1280px]",
    landing: "max-w-[1200px]",
    article: "max-w-[740px]", // 720-760px range
    policy: "max-w-[780px]",   // 760-800px range
    default: "max-w-6xl",
  };

  /* ponytail: responsive container wrapper centered with dynamic width rules mapping page variants */
  return (
    <div className={`mx-auto ${widths[variant]} px-6 w-full ${className}`}>
      {children}
    </div>
  );
}
