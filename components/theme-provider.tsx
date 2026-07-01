"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system" | "eye-comfort"
export type FontSize = "small" | "medium" | "large"
export type ReadingWidth = "normal" | "wide"
export type LineHeight = "normal" | "comfortable"

type ThemeProviderState = {
  theme: Theme
  fontSize: FontSize
  readingWidth: ReadingWidth
  lineHeight: LineHeight
  focusMode: boolean
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
  setReadingWidth: (width: ReadingWidth) => void
  setLineHeight: (height: LineHeight) => void
  setFocusMode: (focus: boolean) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  [key: string]: any
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [fontSize, setFontSizeState] = useState<FontSize>("medium")
  const [readingWidth, setReadingWidthState] = useState<ReadingWidth>("normal")
  const [lineHeight, setLineHeightState] = useState<LineHeight>("comfortable")
  const [focusMode, setFocusModeState] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const root = window.document.documentElement

    // Recover preferences from localStorage
    const savedTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme
    const savedFontSize = (localStorage.getItem("font-size") as FontSize) || "medium"
    const savedWidth = (localStorage.getItem("reading-width") as ReadingWidth) || "normal"
    const savedLeading = (localStorage.getItem("line-height") as LineHeight) || "comfortable"
    const savedFocus = localStorage.getItem("focus-mode") === "true"

    setThemeState(savedTheme)
    setFontSizeState(savedFontSize)
    setReadingWidthState(savedWidth)
    setLineHeightState(savedLeading)
    setFocusModeState(savedFocus)

    // Apply classes to root element
    applyThemeClass(savedTheme)
    applyFontSizeClass(savedFontSize)
    applyReadingWidthClass(savedWidth)
    applyLineHeightClass(savedLeading)
    applyFocusModeClass(savedFocus)
  }, [defaultTheme, storageKey])

  const applyThemeClass = (t: Theme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "eye-comfort")

    if (t === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(t)
    }
  }

  const applyFontSizeClass = (size: FontSize) => {
    const root = window.document.documentElement
    root.classList.remove("pref-font-small", "pref-font-medium", "pref-font-large")
    root.classList.add(`pref-font-${size}`)
  }

  const applyReadingWidthClass = (width: ReadingWidth) => {
    const root = window.document.documentElement
    root.classList.remove("pref-width-normal", "pref-width-wide")
    root.classList.add(`pref-width-${width}`)
  }

  const applyLineHeightClass = (leading: LineHeight) => {
    const root = window.document.documentElement
    root.classList.remove("pref-leading-normal", "pref-leading-comfortable")
    root.classList.add(`pref-leading-${leading}`)
  }

  const applyFocusModeClass = (focus: boolean) => {
    const root = window.document.documentElement
    if (focus) {
      root.classList.add("focus-mode")
    } else {
      root.classList.remove("focus-mode")
    }
  }

  const value = {
    theme,
    fontSize,
    readingWidth,
    lineHeight,
    focusMode,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
      applyThemeClass(newTheme)
    },
    setFontSize: (size: FontSize) => {
      localStorage.setItem("font-size", size)
      setFontSizeState(size)
      applyFontSizeClass(size)
    },
    setReadingWidth: (width: ReadingWidth) => {
      localStorage.setItem("reading-width", width)
      setReadingWidthState(width)
      applyReadingWidthClass(width)
    },
    setLineHeight: (leading: LineHeight) => {
      localStorage.setItem("line-height", leading)
      setLineHeightState(leading)
      applyLineHeightClass(leading)
    },
    setFocusMode: (focus: boolean) => {
      localStorage.setItem("focus-mode", focus ? "true" : "false")
      setFocusModeState(focus)
      applyFocusModeClass(focus)
    }
  }

  /* ponytail: single context wrapper managing all user visual layout preferences */
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
