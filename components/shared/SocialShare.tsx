"use client";

import React, { useState, useEffect } from "react";
import { Link2, Linkedin, Twitter, Facebook, MessageCircle, Check } from "lucide-react";
import Button from "../ui/Button";

interface SocialShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function SocialShare({ url, title = "Check this out!", className = "" }: SocialShareProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(url || window.location.href);
    }
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  /* ponytail: minimal flat share bar with native web intents */
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1.5">Share:</span>
      
      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="p-1.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-colors cursor-pointer"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>

      {/* X (formerly Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        className="p-1.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-colors cursor-pointer"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className="p-1.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-colors cursor-pointer"
      >
        <Facebook className="h-3.5 w-3.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className="p-1.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-colors cursor-pointer"
      >
        <MessageCircle className="h-3.5 w-3.5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        title="Copy Link"
        className="p-1.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-colors cursor-pointer"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
