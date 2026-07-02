"use client";

import { X } from "lucide-react";
import PlaybackControls from "./PlaybackControls";
import SpeedSelector from "./SpeedSelector";
import VoiceSelector from "./VoiceSelector";
import { SpeechController } from "@/hooks/useSpeechSynthesis";
import Typography from "../typography/Typography";

interface ArticleSpeechPlayerProps {
  controller: SpeechController;
}

export default function ArticleSpeechPlayer({ controller }: ArticleSpeechPlayerProps) {
  const {
    isPlaying,
    isPaused,
    progress,
    playbackRate,
    selectedVoice,
    voices,
    play,
    pause,
    resume,
    stop,
    setRate,
    setVoice,
  } = controller;

  // Display only if playing or paused
  if (!isPlaying && !isPaused && progress.percentage === 0) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div 
      className="fixed z-50 transition-all duration-350 animate-fade-in
        /* Mobile: full-width bottom bar */
        bottom-0 left-0 right-0 w-full border-t border-border-primary bg-bg-card p-4 shadow-2xl md:max-w-md
        /* Desktop: floating bottom-right container overrides */
        md:bottom-6 md:right-6 md:left-auto md:rounded-2xl md:border"
      role="region"
      aria-label="Audio player controls"
    >
      <div className="space-y-4">
        {/* Top Header Row with Close Trigger */}
        <div className="flex items-center justify-between border-b border-border-primary pb-2.5">
          <div className="space-y-0.5">
            <Typography variant="label" className="uppercase tracking-wider text-[9px] text-text-muted">
              Audio Reading
            </Typography>
            <Typography variant="h4" className="text-xs font-semibold text-text-h truncate max-w-[240px] font-sans">
              {isPlaying ? "Reading aloud..." : "Audio paused"}
            </Typography>
          </div>
          
          <button
            onClick={stop}
            className="p-1 rounded-full text-text-muted hover:text-text-h hover:bg-bg-secondary transition-colors cursor-pointer"
            aria-label="Close and stop audio player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PlaybackControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlay={play}
            onPause={pause}
            onResume={resume}
            onStop={stop}
          />
          
          <div className="flex items-center gap-2">
            <SpeedSelector currentRate={playbackRate} onChangeRate={setRate} />
            <VoiceSelector voices={voices} selectedVoice={selectedVoice} onChangeVoice={setVoice} />
          </div>
        </div>

        {/* Progress Timeline Row */}
        <div className="space-y-1.5 pt-1">
          {/* Progress bar line */}
          <div className="relative w-full h-1 bg-border-primary rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-link transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress.percentage}%` }}
              role="progressbar"
              aria-valuenow={progress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          
          {/* Duration details */}
          <div className="flex items-center justify-between text-[10px] font-semibold font-mono text-text-muted select-none">
            <span>{formatTime(progress.elapsedTime)}</span>
            <span>{formatTime(progress.totalTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
