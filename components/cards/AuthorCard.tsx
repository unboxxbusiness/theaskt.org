import React from "react";
import Link from "next/link";
import Avatar from "../ui/Avatar";
import Typography from "../typography/Typography";

interface AuthorCardProps {
  name: string;
  avatarUrl?: string | null;
  biography?: string;
  slug?: string;
  className?: string;
}

export default function AuthorCard({
  name,
  avatarUrl,
  biography,
  slug,
  className = "",
}: AuthorCardProps) {
  const content = (
    <div className={`p-5 rounded-xl border border-border-primary bg-bg-secondary flex gap-4 ${className}`}>
      <Avatar src={avatarUrl} alt={name} size="lg" />
      <div className="space-y-1">
        <Typography variant="h3" className="text-xs font-bold text-text-h">
          About {name}
        </Typography>
        {biography && (
          <Typography variant="small" className="leading-relaxed block text-xs">
            {biography}
          </Typography>
        )}
      </div>
    </div>
  );

  /* ponytail: links container to author route index if slug is given */
  if (slug) {
    return (
      <Link href={`/learn/author/${slug}`} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
