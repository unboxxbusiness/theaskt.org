# Specification - Mobile Layout & PWA Installation Fix

Configure the PWA assets to make the app fully installable on mobile, refactor the mobile navigation drawer to include reading settings, and redesign the announcement bar to have a premium, newsroom-style inline alert layout.

## Requirements & Goals
- Make the PWA fully installable by ensuring valid manifest icon assets (`icon-192.png` and `icon-512.png`) are resolved.
- Refactor the mobile menu drawer to include the reading preferences settings inline.
- Clean up the mobile header bar to remove redundant icons, creating more breathing room.
- Redesign the announcement bar to use a slim, inline layout (underlined link instead of large buttons, pulsing minimalist countdown indicator) that fits nicely on mobile.

## Proposed Changes

### PWA Assets

#### [NEW] [icon-192.png](file:///e:/askt/public/icon-192.png) & [icon-512.png](file:///e:/askt/public/icon-512.png)
- Provided premium logo assets in the public folder, matching the `manifest.json` icons definition, resolving PWA installability blocks.

---

### Navigation Drawer

#### [MODIFY] [Navbar.tsx](file:///e:/askt/components/navigation/Navbar.tsx)
- Remove `<ReadingPreferences />` from the mobile navbar row cluster (line 229) to clean up the header spacing.
- Embed `<ReadingPreferences />` at the bottom of the mobile drawer menu (Drawer Footer section), separated by a subtle border and titled "Reading Settings".

---

### Announcement Bar

#### [MODIFY] [AnnouncementBar.tsx](file:///e:/askt/components/navigation/AnnouncementBar.tsx)
- Redesign the announcement layout:
  - Remove the spinning SVG clock and replace it with a compact, tabular countdown font featuring a minimalist pulsing indicator dot (`animate-ping`).
  - Render the CTA as an inline underlined text link (`underline font-bold hover:text-amber-300`) instead of a white button.
  - Simplify padding (`py-2`) and grid elements on mobile to guarantee a single-line or clean two-line flow.

---

## Verification Plan

### Automated Verification
- Run TypeScript diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Access the mobile view on a device or emulator and open the drawer to verify "Reading Settings" is present.
- Verify the announcement bar layout on simulated mobile screens.
- Open Chrome DevTools -> Application -> Manifest to confirm PWA is fully valid and installable.
