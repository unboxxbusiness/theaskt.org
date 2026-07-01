"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Check, Sun, Moon, Eye, AlignLeft, Maximize2, Minimize2 } from "lucide-react";
import { useTheme, Theme, FontSize, ReadingWidth, LineHeight } from "@/components/theme-provider";
import Typography from "../typography/Typography";

export default function ReadingPreferences() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    theme,
    fontSize,
    readingWidth,
    lineHeight,
    focusMode,
    setTheme,
    setFontSize,
    setReadingWidth,
    setLineHeight,
    setFocusMode,
  } = useTheme();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ponytail: compact interactive reading preferences control drop-down */
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-bg-secondary text-text-muted hover:text-text-h transition-colors cursor-pointer flex items-center justify-center h-9 w-9 focus:ring-2 focus:ring-link/25 focus:outline-none"
        title="Reading Preferences"
        aria-label="Reading Preferences"
        aria-expanded={isOpen}
        suppressHydrationWarning
      >
        <Settings className="h-4.5 w-4.5 animate-hover-spin" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 rounded-xl border border-border-primary bg-bg-card p-4 shadow-xl z-50 animate-fade-in space-y-4">
          <Typography variant="h4" className="text-[10px] font-bold tracking-wider text-text-muted border-b border-border-primary pb-2 block">
            Reading Options
          </Typography>

          {/* Theme selections */}
          <div className="space-y-1.5">
            <Typography variant="label" className="text-[9px]">Appearance</Typography>
            <div className="grid grid-cols-3 gap-1">
              {(["light", "dark", "eye-comfort"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                    theme === t
                      ? "border-link bg-bg-secondary text-text-h font-bold shadow-sm"
                      : "border-border-primary bg-transparent text-text-muted hover:text-text-h hover:bg-bg-secondary/40"
                  }`}
                >
                  {t === "light" && <Sun className="h-3.5 w-3.5 mb-1 text-amber-500" />}
                  {t === "dark" && <Moon className="h-3.5 w-3.5 mb-1 text-zinc-400" />}
                  {t === "eye-comfort" && <Eye className="h-3.5 w-3.5 mb-1 text-emerald-600 dark:text-emerald-400" />}
                  <span className="capitalize">{t === "eye-comfort" ? "Comfort" : t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size selections */}
          <div className="space-y-1.5">
            <Typography variant="label" className="text-[9px]">Text Size</Typography>
            <div className="flex rounded-lg border border-border-primary overflow-hidden">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-1.5 text-center text-[10px] font-medium capitalize cursor-pointer transition-all border-r last:border-r-0 border-border-primary ${
                    fontSize === size
                      ? "bg-bg-secondary text-text-h font-bold"
                      : "bg-transparent text-text-muted hover:text-text-h hover:bg-bg-secondary/40"
                  }`}
                >
                  {size === "small" ? "Aa" : size === "medium" ? "Aa+" : "Aa++"}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height and Width options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Typography variant="label" className="text-[9px]">Line Spacing</Typography>
              <div className="flex rounded-lg border border-border-primary overflow-hidden">
                {(["normal", "comfortable"] as const).map((lh) => (
                  <button
                    key={lh}
                    onClick={() => setLineHeight(lh)}
                    className={`flex-1 py-1.5 text-center text-[10px] font-medium capitalize cursor-pointer transition-all border-r last:border-r-0 border-border-primary ${
                      lineHeight === lh
                        ? "bg-bg-secondary text-text-h font-bold"
                        : "bg-transparent text-text-muted hover:text-text-h hover:bg-bg-secondary/40"
                    }`}
                  >
                    {lh === "normal" ? "Tight" : "Wide"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Typography variant="label" className="text-[9px]">Page Width</Typography>
              <div className="flex rounded-lg border border-border-primary overflow-hidden">
                {(["normal", "wide"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setReadingWidth(w)}
                    className={`flex-1 py-1.5 text-center text-[10px] font-medium capitalize cursor-pointer transition-all border-r last:border-r-0 border-border-primary ${
                      readingWidth === w
                        ? "bg-bg-secondary text-text-h font-bold"
                        : "bg-transparent text-text-muted hover:text-text-h hover:bg-bg-secondary/40"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Mode option */}
          <div className="border-t border-border-primary pt-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <Typography variant="h4" className="text-[10px] font-bold text-text-h normal-case tracking-normal">
                Focus Mode
              </Typography>
              <Typography variant="small" className="text-[9px] block text-text-muted leading-tight">
                Hide layouts for reading
              </Typography>
            </div>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`p-1.5 rounded-lg border cursor-pointer transition-all flex items-center justify-center ${
                focusMode
                  ? "border-link bg-bg-secondary text-text-h font-bold shadow-sm"
                  : "border-border-primary bg-transparent text-text-muted hover:text-text-h hover:bg-bg-secondary/40"
              }`}
              title="Toggle Focus Mode"
            >
              {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
