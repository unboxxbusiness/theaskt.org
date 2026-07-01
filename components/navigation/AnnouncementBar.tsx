"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

interface AnnouncementProps {
  announcement?: {
    title: string;
    description: string;
    bgColor?: string;
    gradientEndColor?: string;
    ctaLink?: string;
    ctaText?: string;
    countdownTarget?: string;
  } | null;
}

export default function AnnouncementBar({ announcement }: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });

  // Initialize visibility state based on session storage
  useEffect(() => {
    if (typeof window !== "undefined" && announcement) {
      const isDismissed = sessionStorage.getItem(`announcement-dismissed-${announcement.title}`);
      if (isDismissed) {
        setIsVisible(false);
      }
    }
  }, [announcement]);

  // Set up the countdown ticker
  useEffect(() => {
    if (!announcement?.countdownTarget) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(announcement.countdownTarget!) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      };
    };

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [announcement?.countdownTarget]);

  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) return null;
  if (!announcement || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`announcement-dismissed-${announcement.title}`, "true");
    }
  };

  // Build the gradient background style
  const bgStyle = announcement.gradientEndColor
    ? { background: `linear-gradient(135deg, ${announcement.bgColor || '#14213d'}, ${announcement.gradientEndColor})` }
    : { backgroundColor: announcement.bgColor || "#14213d" };

  return (
    <div
      className="relative w-full overflow-hidden text-white py-2.5 sm:py-3 px-8 text-center text-xs font-sans transition-all shadow-md z-[60]"
      style={bgStyle}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-7xl mx-auto pr-4">
        {/* Animated Badge */}
        <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm animate-pulse">
          Limited Offer
        </span>

        {/* Announcement Description */}
        <span className="font-semibold tracking-wide text-white/95">
          {announcement.description}
        </span>

        {/* Live Countdown Timer */}
        {announcement.countdownTarget && !timeLeft.isExpired && (
          <span className="inline-flex items-center gap-1.5 bg-black/15 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 font-mono tracking-wider shadow-inner">
            <svg
              className="h-3.5 w-3.5 text-amber-300 animate-spin"
              style={{ animationDuration: '4s' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {String(timeLeft.hours).padStart(2, "0")}h :{" "}
              {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </span>
        )}

        {/* CTA Button */}
        {announcement.ctaLink && (
          <a
            href={announcement.ctaLink}
            className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-all shadow-sm ml-1"
          >
            {announcement.ctaText || "Claim Offer"} &rarr;
          </a>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss Announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
