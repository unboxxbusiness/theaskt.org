"use client";

import { useState, useEffect, useRef } from "react";
import { splitSpeechChunks } from "@/lib/speech/splitSpeechChunks";
import { useSpeechVoices } from "./useSpeechVoices";
import { useSpeechProgress, SpeechProgress } from "./useSpeechProgress";

export interface SpeechController {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  progress: SpeechProgress;
  playbackRate: number;
  selectedVoice: SpeechSynthesisVoice | null;
  voices: SpeechSynthesisVoice[];
  activeText: string;
  
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

/**
 * Orchestrator hook for SpeechSynthesis API. 
 * Manages active speaking chunk queues, dynamic rates, voice mappings, and event emissions.
 */
export function useSpeechSynthesis(text: string): SpeechController {
  const { voices, defaultVoice } = useSpeechVoices();

  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isCancelIntentionalRef = useRef(false);

  // Setup client context compatibility checks
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true);
    }
  }, []);

  // Update plain text chunk array when source text updates
  useEffect(() => {
    chunksRef.current = splitSpeechChunks(text);
  }, [text]);

  // Keep index reference in sync for asynchronous browser event callbacks
  useEffect(() => {
    currentChunkIndexRef.current = currentChunkIndex;
  }, [currentChunkIndex]);

  // Automatically detect if content contains Devanagari characters (Hindi script)
  const isHindiText = /[\u0900-\u097F]/.test(text);

  // Map system default voice on first voice load based on language detection
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      const languageMatch = voices.find((voice) => {
        const lang = voice.lang.toLowerCase();
        return isHindiText ? lang.startsWith("hi") : lang.startsWith("en");
      });
      setSelectedVoice(languageMatch || defaultVoice || voices[0] || null);
    }
  }, [voices, defaultVoice, isHindiText, selectedVoice]);

  const progress = useSpeechProgress(
    text,
    chunksRef.current,
    currentChunkIndex,
    isPlaying,
    rate
  );

  const speakChunk = (index: number, cancelActive: boolean = false) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Reset ongoing system speech tasks only if explicitly forced
    if (cancelActive) {
      isCancelIntentionalRef.current = true;
      window.speechSynthesis.cancel();
    }

    const textToSpeak = chunksRef.current[index];
    if (!textToSpeak) {
      handleStop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = rate;

    utterance.onend = () => {
      const nextIndex = currentChunkIndexRef.current + 1;
      if (nextIndex < chunksRef.current.length) {
        setCurrentChunkIndex(nextIndex);
        speakChunk(nextIndex, false);
      } else {
        handleStop();
      }
    };

    utterance.onerror = (event) => {
      // Ignore if cancellation was triggered intentionally by player controllers
      if (isCancelIntentionalRef.current) {
        return;
      }
      // Ignore user-triggered pause/stop interruption/cancellation events
      if (event.error === "interrupted" || event.error === "canceled") {
        return;
      }
      console.error("SpeechSynthesisUtterance triggered error:", event);
      handleStop();
    };

    window.speechSynthesis.speak(utterance);
    // Reset cancellation flag once speaking task is successfully queued
    isCancelIntentionalRef.current = false;
  };

  const handlePlay = () => {
    if (chunksRef.current.length === 0) return;
    setIsPlaying(true);
    setIsPaused(false);
    speakChunk(currentChunkIndex, true);
    console.log("analytics: listen_started");
  };

  const handlePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    console.log("analytics: listen_paused");
  };

  const handleResume = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPlaying(true);
    setIsPaused(false);
    console.log("analytics: listen_resumed");
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    isCancelIntentionalRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
    console.log("analytics: listen_completed / speech_cancelled");
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      speakChunk(currentChunkIndex, true);
    }
  };

  const changeVoice = (newVoice: SpeechSynthesisVoice) => {
    setSelectedVoice(newVoice);
    if (isPlaying) {
      speakChunk(currentChunkIndex, true);
    }
  };

  // Safe navigation cleanup unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        isCancelIntentionalRef.current = true;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    isSupported,
    progress,
    playbackRate: rate,
    selectedVoice,
    voices,
    activeText: chunksRef.current[currentChunkIndex] || "",
    play: handlePlay,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
    setRate: changeRate,
    setVoice: changeVoice,
  };
}
