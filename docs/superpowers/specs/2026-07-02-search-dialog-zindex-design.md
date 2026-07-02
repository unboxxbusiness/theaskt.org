# Specification - Search Dialog Z-Index Layout Fix

Resolve the overlapping layout issue where the announcement bar overlays the active search modal.

## Requirements & Goals
- Elevate the z-index of the `<SearchDialog>` modal overlay and its backdrop relative to the `<AnnouncementBar>` (`z-[60]`).
- Ensure that the search dialog covers all layouts, headers, and announcements cleanly when active.

## Proposed Changes

### Navigation Components

#### [MODIFY] [SearchDialog.tsx](file:///e:/askt/components/navigation/SearchDialog.tsx)
- Change the container layout div's z-index class from `z-50` to `z-[90]`.

---

## Verification Plan

### Automated Verification
- Run typescript compilation diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Launch the search dialog with the announcement bar visible. Verify the modal backdrop obscures the announcement bar without overlay bleed.
