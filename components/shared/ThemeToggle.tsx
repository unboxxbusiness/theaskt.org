"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function ThemeToggle() {
  const { setTheme } = useTheme()

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "light" : "dark")
    }
  }

  /* ponytail: simple switch handler toggles classes on html element */
  return (
    <button
      onClick={toggleTheme}
      suppressHydrationWarning
      className="relative p-1.5 rounded-full hover:bg-bg-secondary transition-colors text-text-muted hover:text-text-h cursor-pointer flex items-center justify-center h-8 w-8"
      title="Toggle Theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-600 dark:text-zinc-300" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
