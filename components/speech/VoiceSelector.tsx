"use client";

import { Volume2 } from "lucide-react";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onChangeVoice: (voice: SpeechSynthesisVoice) => void;
}

export default function VoiceSelector({
  voices,
  selectedVoice,
  onChangeVoice,
}: VoiceSelectorProps) {
  if (voices.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-primary rounded-lg px-2.5 py-1 text-xs text-text-secondary hover:text-text-h transition-colors max-w-[140px] sm:max-w-[200px] overflow-hidden">
      <Volume2 className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
      <select
        value={selectedVoice?.name || ""}
        onChange={(e) => {
          const match = voices.find((v) => v.name === e.target.value);
          if (match) onChangeVoice(match);
        }}
        className="bg-transparent font-sans font-semibold focus:outline-none cursor-pointer text-[11px] truncate flex-1 pr-1.5"
        aria-label="Select system voice"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name} className="bg-bg-card text-text-body">
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
    </div>
  );
}
