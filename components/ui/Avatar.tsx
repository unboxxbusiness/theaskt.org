import React from "react";

import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  /* ponytail: simple rounded avatar placeholder or dynamic cdn image */
  return (
    <div className={`relative rounded-full overflow-hidden border border-border-primary bg-bg-secondary flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] uppercase font-bold">
          {alt.slice(0, 2)}
        </div>
      )}
    </div>
  );
}
