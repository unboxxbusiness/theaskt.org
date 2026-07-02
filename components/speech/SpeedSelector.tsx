"use client";

import { Gauge } from "lucide-react";

interface SpeedSelectorProps {
  currentRate: number;
  onChangeRate: (rate: number) => void;
}

export default function SpeedSelector({ currentRate, onChangeRate }: SpeedSelectorProps) {
  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-primary rounded-lg px-2.5 py-1 text-xs text-text-secondary hover:text-text-h transition-colors">
      <Gauge className="h-3.5 w-3.5 text-text-muted" />
      <select
        value={currentRate}
        onChange={(e) => onChangeRate(parseFloat(e.target.value))}
        className="bg-transparent font-sans font-semibold focus:outline-none cursor-pointer text-[11px] pr-1.5"
        aria-label="Select playback speed"
      >
        {speeds.map((speed) => (
          <option key={speed} value={speed} className="bg-bg-card text-text-body">
            {speed === 1.0 ? "1.0x" : `${speed}x`}
          </option>
        ))}
      </select>
    </div>
  );
}
