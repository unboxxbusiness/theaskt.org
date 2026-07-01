"use client";

import { useTheme } from "@/components/theme-provider";
import ReadingPreferences from "./ReadingPreferences";

export default function FocusModeOverlay() {
  const { focusMode } = useTheme();

  if (!focusMode) return null;

  /* ponytail: floating overlay button to prevent trapping users in Focus Mode */
  return (
    <div className="fixed top-6 right-6 z-[60] bg-bg-card border border-border-primary shadow-2xl rounded-full p-1 animate-fade-in transition-colors">
      <ReadingPreferences />
    </div>
  );
}
