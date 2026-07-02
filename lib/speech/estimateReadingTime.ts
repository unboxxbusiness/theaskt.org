/**
 * Estimates total speaking duration in seconds based on word count and playback rate.
 * Standard speaking rate is estimated at 150 words per minute (WPM).
 */
export function estimateReadingTime(text: string, rate: number = 1.0): number {
  if (!text) return 0;

  const words = text.trim().split(/\s+/).length;
  const baseWpm = 150; // standard speaking rate
  const adjustedWpm = baseWpm * rate;

  // returns total duration in seconds
  const durationSeconds = (words / adjustedWpm) * 60;
  return Math.max(1, Math.round(durationSeconds));
}
