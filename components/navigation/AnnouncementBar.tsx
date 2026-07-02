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
      className="relative w-full overflow-hidden text-white py-2 px-10 text-center text-[10px] sm:text-[11px] font-sans transition-all shadow-sm z-[60] border-b border-white/10"
      style={bgStyle}
    >
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pr-4 sm:pr-0 leading-relaxed">
          {/* Animated Badge */}
          <span className="inline-flex items-center rounded bg-white/15 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white select-none">
            {announcement.ctaText ? "Offer" : "Alert"}
          </span>

          {/* Announcement Description & Inline CTA */}
          <span className="font-semibold tracking-wide text-white/95">
            {announcement.description}
            {announcement.ctaLink && (
              <a
                href={announcement.ctaLink}
                className="underline font-bold text-white hover:text-amber-300 ml-1.5 transition-colors inline-block"
              >
                {announcement.ctaText || "Claim Offer"} &rarr;
              </a>
            )}
          </span>

          {/* Live Countdown Timer */}
          {announcement.countdownTarget && !timeLeft.isExpired && (
            <span className="inline-flex items-center gap-1.5 bg-black/20 border border-white/10 px-2 py-0.5 rounded text-[9.5px] font-bold text-amber-300 font-mono tracking-wider select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {timeLeft.days > 0 && `${timeLeft.days}d `}
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss Announcement"
        suppressHydrationWarning
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
