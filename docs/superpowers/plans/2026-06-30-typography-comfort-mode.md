# Typography, Eye Comfort Theme & Reading Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the website typography and spacing scales into a premium reading experience, adding an Eye Comfort theme palette, an interactive reading preferences control, scroll progress bars, sticky table of contents, and a focus layout toggle.

**Architecture:** We will declare CSS variable mappings inside `app/globals.css` to allow font sizes, line heights, and layout widths to adapt dynamically based on classes applied to the root `<html>` element. This preserves server-rendered typography performance while offering client-side customization.

**Tech Stack:** Tailwind CSS custom styling, React Context, localStorage persistence API, intersection observer API.

## Global Constraints
- Do not convert `Typography.tsx` into a client component.
- Support both dark, light, and eye-comfort modes.
- Maintain existing branding styles.
- Pass WCAG AA accessibility standards.

---

### Task 1: Eye Comfort Mode & CSS Variables Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `components/theme-provider.tsx`

**Interfaces:**
- Consumes: Custom themes and typography preferences
- Produces: HTML root variables mapping fluid text sizes and warm sepia tones

- [ ] **Step 1: Declare custom themes and typography scales**
  Modify [globals.css](file:///e:/askt/app/globals.css) to add `@custom-variant eye-comfort`, declare core typography CSS variables in `:root`, and create `.eye-comfort` and preference selector classes:
  ```css
  @import "tailwindcss";

  @custom-variant dark (&:where(.dark, .dark *));
  @custom-variant eye-comfort (&:where(.eye-comfort, .eye-comfort *));

  :root {
    /* Existing Light variables... */
    --font-size-display: 36px;
    --font-size-h1: 30px;
    --font-size-h2: 24px;
    --font-size-h3: 18px;
    --font-size-h4: 14px;
    --font-size-lead: 14px;
    --font-size-body-large: 16px;
    --font-size-body: 14px;
    --font-size-small: 12px;
    --font-size-caption: 10px;

    --leading-heading: 1.15;
    --leading-body: 1.7;
    --leading-list: 1.6;
    --leading-quote: 1.7;
  }

  /* Font size overrides mapping fluid typography scale */
  html.pref-font-small {
    --font-size-display: 48px;
    --font-size-h1: 36px;
    --font-size-h2: 28px;
    --font-size-h3: 24px;
    --font-size-h4: 18px;
    --font-size-lead: 18px;
    --font-size-body-large: 18px;
    --font-size-body: 16px;
    --font-size-small: 14px;
    --font-size-caption: 12px;
  }

  html.pref-font-medium {
    --font-size-display: 60px;
    --font-size-h1: 48px;
    --font-size-h2: 36px;
    --font-size-h3: 30px;
    --font-size-h4: 24px;
    --font-size-lead: 22px;
    --font-size-body-large: 20px;
    --font-size-body: 18px;
    --font-size-small: 16px;
    --font-size-caption: 14px;
  }

  html.pref-font-large {
    --font-size-display: 72px;
    --font-size-h1: 54px;
    --font-size-h2: 42px;
    --font-size-h3: 36px;
    --font-size-h4: 28px;
    --font-size-lead: 24px;
    --font-size-body-large: 22px;
    --font-size-body: 20px;
    --font-size-small: 18px;
    --font-size-caption: 16px;
  }

  /* Line height overrides */
  html.pref-leading-normal {
    --leading-heading: 1.15;
    --leading-body: 1.7;
    --leading-list: 1.6;
    --leading-quote: 1.7;
  }

  html.pref-leading-comfortable {
    --leading-heading: 1.25;
    --leading-body: 1.85;
    --leading-list: 1.7;
    --leading-quote: 1.8;
  }

  /* Eye Comfort Mode sepia palette */
  .eye-comfort {
    --bg-primary: #F8F5EF;
    --bg-secondary: #FFFDF8;
    --bg-card: #FFFDF8;
    --bg-section-alt: #E8E2D8;
    --bg-code: #E8E2D8;

    --text-h: #2D2A26;
    --text-body: #2D2A26;
    --text-secondary: #5B5752;
    --text-muted: #7C7873;
    --text-caption: #7C7873;
    --link: #0F4C81;
    --link-hover: #14213D;

    --border-primary: #E8E2D8;
    --border-secondary: #E8E2D8;
    --divider: #E8E2D8;

    --nav-bg: #F8F5EF;
    --nav-border: #E8E2D8;
    --nav-active: #2D2A26;
    --nav-inactive: #5B5752;
    --nav-hover: #0F4C81;

    --btn-primary-bg: #14213D;
    --btn-primary-text: #FFFDF8;
    --btn-primary-hover: #2D2A26;

    --btn-secondary-bg: transparent;
    --btn-secondary-border: #14213D;
    --btn-secondary-text: #14213D;
    --btn-secondary-hover: #E8E2D8;

    --btn-accent-bg: #0F4C81;
    --btn-accent-text: #FFFDF8;
    --btn-accent-hover: #14213D;

    --input-bg: #FFFDF8;
    --input-border: #E8E2D8;
    --input-focus: #0F4C81;
    --input-placeholder: #7C7873;
    --input-text: #2D2A26;

    --card-bg: #FFFDF8;
    --card-border: #E8E2D8;
    --card-hover-border: #0F4C81;

    --badge-cat-bg: #E8E2D8;
    --badge-cat-text: #0F4C81;
  }
  ```

- [ ] **Step 2: Update theme provider script to support Eye Comfort and preferences**
  Modify [theme-provider.tsx](file:///e:/askt/components/theme-provider.tsx) to configure type definitions and class assignments:
  ```typescript
  export type Theme = "light" | "dark" | "system" | "eye-comfort";
  export type FontSize = "small" | "medium" | "large";
  export type ReadingWidth = "normal" | "wide";
  export type LineHeight = "normal" | "comfortable";

  type ThemeProviderState = {
    theme: Theme;
    fontSize: FontSize;
    readingWidth: ReadingWidth;
    lineHeight: LineHeight;
    focusMode: boolean;
    setTheme: (theme: Theme) => void;
    setFontSize: (size: FontSize) => void;
    setReadingWidth: (width: ReadingWidth) => void;
    setLineHeight: (height: LineHeight) => void;
    setFocusMode: (focus: boolean) => void;
  }
  // Initialize states with localStorage recovery inside useEffect hooks
  ```

---

### Task 2: Standardize Typography Elements & Section Spacing

**Files:**
- Modify: `components/typography/Typography.tsx`
- Modify: `components/layout/Section.tsx`
- Modify: `components/layout/Container.tsx`

**Interfaces:**
- Consumes: Theme provider metrics
- Produces: Scaled layout elements respecting reading preferences

- [ ] **Step 1: Map Typography variants to CSS variables**
  Modify [Typography.tsx](file:///e:/askt/components/typography/Typography.tsx) to consume CSS variables for text scaling:
  ```typescript
  const styles: Record<TypographyVariant, string> = {
    display: "font-serif text-4xl sm:text-5xl md:text-[length:var(--font-size-display)] font-extrabold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h1: "font-serif text-3xl sm:text-[length:var(--font-size-h1)] font-extrabold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h2: "font-serif text-2xl sm:text-[length:var(--font-size-h2)] font-bold tracking-tight text-text-h leading-[var(--leading-heading)] text-wrap-balance",
    h3: "font-serif text-[length:var(--font-size-h3)] font-bold text-text-h leading-[var(--leading-heading)]",
    h4: "font-sans text-[length:var(--font-size-h4)] font-bold text-text-h uppercase tracking-wider",
    lead: "font-sans text-[length:var(--font-size-lead)] text-text-secondary leading-[var(--leading-body)]",
    "body-large": "font-serif text-[length:var(--font-size-body-large)] leading-[var(--leading-body)] text-text-body",
    body: "font-sans text-[length:var(--font-size-body)] leading-[var(--leading-body)] text-text-body",
    small: "font-sans text-[length:var(--font-size-small)] text-text-secondary leading-normal",
    caption: "font-sans text-[length:var(--font-size-caption)] text-text-muted leading-tight uppercase tracking-wider",
    label: "font-sans text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1",
  };
  ```

- [ ] **Step 2: Polish Section margin rhythm**
  Modify [Section.tsx](file:///e:/askt/components/layout/Section.tsx) to align spacing variables:
  ```typescript
  // Spacing increased to section limits: py-20 md:py-28 (5-7rem)
  ```

- [ ] **Step 3: Update Container configurations**
  Modify [Container.tsx](file:///e:/askt/components/layout/Container.tsx) to support dynamic reading layouts:
  - Add variant props: `homepage` (1280px), `landing` (1200px), `article` (740px), `policy` (780px).

---

### Task 3: Preferences Control Dropdown Panel

**Files:**
- Create: `components/shared/ReadingPreferences.tsx`
- Modify: `components/navigation/Navbar.tsx`

**Interfaces:**
- Consumes: ThemeProvider settings context hooks
- Produces: Reading settings dashboard rendered in header bar

- [ ] **Step 1: Create the ReadingPreferences controls panel**
  Create [ReadingPreferences.tsx](file:///e:/askt/components/shared/ReadingPreferences.tsx) detailing options for Font size (Small/Medium/Large), Width (Normal/Wide), Line Height (Normal/Comfortable), and Theme (Light/Dark/Comfort):
  ```typescript
  "use client";

  import { useTheme } from "@/components/theme-provider";
  import { Settings, Check } from "lucide-react";
  // Render options panel toggling state
  ```

- [ ] **Step 2: Replace ThemeToggle in Navigation**
  Modify [Navbar.tsx](file:///e:/askt/components/navigation/Navbar.tsx) to replace the simple `ThemeToggle` with the new `<ReadingPreferences />` panel.

---

### Task 4: Reading Progress Bar & Focus Mode

**Files:**
- Create: `components/shared/ReadingProgress.tsx`
- Modify: `app/learn/[slug]/page.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Browser scroll coordinates
- Produces: Progress gauge indicator and distraction-free layouts

- [ ] **Step 1: Write ReadingProgress script**
  Create [ReadingProgress.tsx](file:///e:/askt/components/shared/ReadingProgress.tsx):
  ```typescript
  "use client";

  import { useEffect, useState } from "react";

  export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          setProgress((scrollTop / docHeight) * 100);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <div className="fixed top-0 left-0 w-full h-[3px] bg-border-primary z-50">
        <div 
          className="h-full bg-btn-primary-bg transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }
  ```

- [ ] **Step 2: Support Focus Mode layout class switches**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to hide the Navbar, AnnouncementBar, and Footer whenever the client state `.focus-mode` class is active on root.

---

### Task 5: Sticky Table of Contents Component

**Files:**
- Create: `components/navigation/TableOfContents.tsx`
- Modify: `app/learn/[slug]/page.tsx`

**Interfaces:**
- Consumes: Target heading selectors in detailed articles
- Produces: Highlighted dynamic sidebar menus

- [ ] **Step 1: Write TableOfContents client controller**
  Create [TableOfContents.tsx](file:///e:/askt/components/navigation/TableOfContents.tsx):
  - Parse headings (h2, h3) using selector queries.
  - Track active items using `IntersectionObserver`.
  - Support collapsible mobile drawer toggles.

- [ ] **Step 2: Render TableOfContents in detailed articles**
  Modify [page.tsx](file:///e:/askt/app/learn/\[slug\]/page.tsx) to integrate TOC sidebar next to main prose layout grid columns.

---

### Task 6: Polish UI Elements (Pull Quotes, Code blocks, Forms, Buttons)

**Files:**
- Modify: `components/ui/Button.tsx`
- Modify: `components/ui/Input.tsx`

**Interfaces:**
- Consumes: Core design elements
- Produces: Large tap layouts matching WCAG standards

- [ ] **Step 1: Enlarge Buttons layout properties**
  Modify [Button.tsx](file:///e:/askt/components/ui/Button.tsx) sizing scales to set the minimum height to 48px and standard primary buttons to 56px.

- [ ] **Step 2: Enlarge Input text size**
  Modify [Input.tsx](file:///e:/askt/components/ui/Input.tsx) to set input font scale to 18px (`text-base` or `text-lg`) with comfortable padding bounds.

---

## Verification Plan

### Automated Tests
- Run typecheck check: `npx tsc --noEmit`
- Run local production bundle compiler: `npm run build`

### Manual Verification
- Simulate Eye Comfort Theme mode, checking that background color shifts to warm sepia (#F8F5EF) and primary text shifts to #2D2A26.
- Alter font size settings and verify layout margins scale seamlessly.
- Open long guides and verify that the top progress indicator tracking scroll metrics loads correctly.
