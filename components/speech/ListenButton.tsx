"use client";

import { Play, Volume2 } from "lucide-react";

interface ListenButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
}

export default function ListenButton({
  isPlaying,
  isPaused,
  isSupported,
  onPlay,
  onPause,
  onResume,
}: ListenButtonProps) {
  if (!isSupported) {
    return (
      <span className="text-[10px] text-text-muted italic font-sans select-none">
        Listening is not supported on this browser.
      </span>
    );
  }

  const handleClick = () => {
    if (isPlaying) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-98 cursor-pointer font-sans shadow-xs ${
        isPlaying
          ? "border-link bg-bg-secondary text-link font-extrabold"
          : "border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h"
      }`}
      aria-label={isPlaying ? "Pause reading article" : isPaused ? "Resume reading article" : "Listen to article audio"}
    >
      {isPlaying ? (
        <>
          <span className="flex items-end gap-0.5 h-3.5 pb-0.5">
            <span className="w-0.5 h-2 bg-link rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></span>
            <span className="w-0.5 h-3 bg-link rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }}></span>
            <span className="w-0.5 h-1.5 bg-link rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}></span>
            <span className="w-0.5 h-2.5 bg-link rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }}></span>
          </span>
          Playing Audio
        </>
      ) : isPaused ? (
        <>
          <Play className="h-3.5 w-3.5 fill-current" />
          Resume Listening
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          Listen to Article
        </>
      )}
    </button>
  );
}
