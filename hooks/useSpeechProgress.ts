"use client";

import { useEffect, useState } from "react";
import { estimateReadingTime } from "@/lib/speech/estimateReadingTime";

export interface SpeechProgress {
  elapsedTime: number;
  remainingTime: number;
  totalTime: number;
  percentage: number;
}

/**
 * Custom React hook to estimate continuous timeline progress of speech synthesis.
 * Uses word indexing along with a fallback active ticker to predict remaining and elapsed times.
 */
export function useSpeechProgress(
  text: string,
  chunks: string[],
  currentChunkIndex: number,
  isPlaying: boolean,
  rate: number
): SpeechProgress {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset elapsed time tracker when playback is fully reset/stopped
  useEffect(() => {
    if (currentChunkIndex === 0 && !isPlaying) {
      setElapsedTime(0);
    }
  }, [currentChunkIndex, isPlaying]);

  // Increment active timer every second while speech is playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Word-count calculation base
  const totalWords = text.trim().split(/\s+/).filter(Boolean).length || 1;
  
  let completedWords = 0;
  for (let i = 0; i < currentChunkIndex; i++) {
    completedWords += chunks[i]?.trim().split(/\s+/).filter(Boolean).length || 0;
  }

  // Calculate dynamic visual percentage
  const percentage = Math.min(
    100,
    Math.max(
      0,
      Math.round((completedWords / totalWords) * 100)
    )
  );

  const totalTime = estimateReadingTime(text, rate);
  const remainingTime = Math.max(0, totalTime - elapsedTime);

  return {
    elapsedTime,
    remainingTime,
    totalTime,
    percentage,
  };
}
