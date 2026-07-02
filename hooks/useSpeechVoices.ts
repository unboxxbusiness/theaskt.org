"use client";

import { useEffect, useState } from "react";

/**
 * Custom React hook to query, load, and filter browser speech synthesis voices.
 * Safely handles asynchronous system loads on different platforms (iOS/Android/Desktop).
 */
export function useSpeechVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [defaultVoice, setDefaultVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const systemVoices = window.speechSynthesis.getVoices();

      // Find the single best premium English voice
      const englishVoices = systemVoices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
      const bestEnglish = englishVoices.find((voice) => {
        const name = voice.name.toLowerCase();
        return (
          name.includes("natural") || 
          name.includes("google") || 
          name.includes("siri") || 
          name.includes("microsoft") || 
          name.includes("apple")
        );
      }) || englishVoices[0] || null;

      // Find the single best premium Hindi voice
      const hindiVoices = systemVoices.filter((voice) => voice.lang.toLowerCase().startsWith("hi"));
      const bestHindi = hindiVoices.find((voice) => {
        const name = voice.name.toLowerCase();
        return (
          name.includes("natural") || 
          name.includes("google") || 
          name.includes("siri") || 
          name.includes("microsoft") || 
          name.includes("apple")
        );
      }) || hindiVoices[0] || null;

      // Store only the two best voices in the state
      const filtered = [bestEnglish, bestHindi].filter((v): v is SpeechSynthesisVoice => v !== null);

      setVoices(filtered);
      setDefaultVoice(bestEnglish || filtered[0] || null);
    };

    loadVoices();

    // Chrome/Android load voices asynchronously and trigger this event
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  return { voices, defaultVoice };
}
