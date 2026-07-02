"use client";

import { Play, Pause, Square } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export default function PlaybackControls({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {isPlaying ? (
        <button
          onClick={onPause}
          className="p-2.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text transition-all active:scale-95 cursor-pointer shadow-sm"
          aria-label="Pause reading"
        >
          <Pause className="h-4 w-4" />
        </button>
      ) : isPaused ? (
        <button
          onClick={onResume}
          className="p-2.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text transition-all active:scale-95 cursor-pointer shadow-sm"
          aria-label="Resume reading"
        >
          <Play className="h-4 w-4 fill-current" />
        </button>
      ) : (
        <button
          onClick={onPlay}
          className="p-2.5 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text transition-all active:scale-95 cursor-pointer shadow-sm"
          aria-label="Start reading"
        >
          <Play className="h-4 w-4 fill-current" />
        </button>
      )}

      {(isPlaying || isPaused) && (
        <button
          onClick={onStop}
          className="p-2.5 rounded-full border border-border-primary hover:bg-bg-secondary text-text-secondary hover:text-text-h transition-all active:scale-95 cursor-pointer"
          aria-label="Stop reading"
        >
          <Square className="h-4 w-4 fill-current" />
        </button>
      )}
    </div>
  );
}
