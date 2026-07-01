# Spec: Editor Stability, Mobile Navbar, and Article Layout Spacing

## 1. Goal Description
The objective is to fix the remaining block editor auto-closure bugs (specifically during clipboard paste operations), build a responsive, premium mobile navbar menu, align article text layout properties between mobile and desktop viewports, and re-order the Table of Contents on mobile viewports so that it appears before the main content.

---

## 2. Proposed Technical Changes

### 2.1. Intercepting Stale Modals (Clipboard Paste Events) [sanity.config.ts](file:///e:/askt/sanity.config.ts)
- **Problem**: When a user pastes content using keyboard commands (`Ctrl+V` / `Cmd+V`), a clipboard `paste` event is emitted. The main Portable Text block editor listens to `paste` events at the document level. If it intercepts the paste event, it automatically closes any active block modal to direct the paste action to the main rich text body.
- **Solution**: We will add a capturing `paste` event listener at the window level. If a paste occurs inside an input or textarea element inside the active dialog wrapper (`div[role="dialog"]`), we call `e.stopPropagation()` immediately. This allows the local input field to receive the paste content but stops the event from propagating up to the parent block editor's listener, securing the modal's open state.

### 2.2. Table of Contents Mobile Ordering [ArticleLayout.tsx](file:///e:/askt/components/layout/ArticleLayout.tsx)
- **Problem**: The `<TableOfContents />` is rendered inside the sidebar column, stacking below the prose content on mobile.
- **Solution**: Duplicate the `TableOfContents` component instantiation inside `ArticleLayout.tsx`:
  - Render a mobile-only container (`lg:hidden`) containing `<TableOfContents />` at the very top of the prose column (directly above the child elements).
  - Wrap the sidebar Table of Contents in a desktop-only container (`hidden lg:block`).

### 2.3. Mobile Layout Spacing & Paragraph Alignment [ArticleLayout.tsx](file:///e:/askt/components/layout/ArticleLayout.tsx)
- **Problem**: On desktop, the title and prose content columns are restricted to `max-w-3xl` (768px), keeping them left-aligned and highly legible. On mobile/tablet, the prose container expands to full width (`max-w-none`), creating inconsistent spacing and overly long line lengths.
- **Solution**: Replace `max-w-none` on the prose div with `max-w-3xl` to keep it restricted, clean, and perfectly aligned with the article header across all viewport widths.

### 2.4. Responsive Mobile Navigation Menu [Navbar.tsx](file:///e:/askt/components/navigation/Navbar.tsx)
- **Desktop/Tablet Layout**: Keep the current horizontal nav bar layout active for viewports `md` and larger.
- **Mobile Layout (< md)**:
  - Hide the horizontal nav link stream and right-aligned buttons.
  - Render a clean header toolbar:
    - Left: brand logo link.
    - Right: modern search trigger, reading settings toggle, and a Hamburger Toggle button (`Menu` / `Close` toggle).
  - Clicking the Hamburger button opens a full-screen drawer overlay (`fixed inset-0 z-50 bg-bg-card/98 backdrop-blur-md`):
    - Vertically lists navigation items with large, accessible text and dividers.
    - Supports collapsible submenus (tapping an item with children toggles an accordion).
    - Features a large call-to-action button ("Join Free") at the bottom of the drawer.
    - Closes automatically when any route link is clicked.

---

## 3. Verification Plan

### Automated Checks
- Run `npx tsc --noEmit` to verify type safety.
- Run `npm run build` to verify production compiles.
