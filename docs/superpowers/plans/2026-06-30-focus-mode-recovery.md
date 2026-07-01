# Focus Mode Recovery Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a floating user interface overlay that renders the reading preferences settings dropdown in the top-right corner of the browser viewport exclusively when Focus Mode is active. This allows users to exit Focus Mode and return to normal mode, restoring visibility of the main navigation headers and footers.

**Architecture:** We will create a client component `<FocusModeOverlay />` that registers context hooks to evaluate the `focusMode` state. If active, it renders a fixed position container at the top right of the viewport with the `<ReadingPreferences />` settings icon.

**Tech Stack:** React Context, Tailwind CSS fixed styles.

## Global Constraints
- Render the overlay inside the `<ThemeProvider>` context scope.
- Maintain existing styles and separation of concerns.

---

### Task 1: Focus Mode Recovery Overlay Integration

**Files:**
- Create: `components/shared/FocusModeOverlay.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `focusMode` boolean state from ThemeProvider context
- Produces: Floating preference dropdown menu in the top-right viewport corner in Focus Mode

- [ ] **Step 1: Create the FocusModeOverlay component**
  Create [FocusModeOverlay.tsx](file:///e:/askt/components/shared/FocusModeOverlay.tsx) containing:
  ```typescript
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
  ```

- [ ] **Step 2: Render FocusModeOverlay inside Root Layout**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to import `<FocusModeOverlay />` and render it inside `<ThemeProvider>` next to `<SwRegister />` and other wrapper elements:
  ```typescript
  // Import FocusModeOverlay from "@/components/shared/FocusModeOverlay"
  // Render <FocusModeOverlay /> below ThemeProvider in RootLayout
  ```

- [ ] **Step 3: Verification**
  Check that compile succeeds. Run: `npx tsc --noEmit`
  Expected: PASS
