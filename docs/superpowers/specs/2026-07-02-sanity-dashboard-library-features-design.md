# Specification - Sanity Dashboard Fixes & User Library Features

Optimize Sanity Studio workspace branding, resolve duplicate draft documents inside the Editorial Dashboard, add metadata classification toggles for news feeds, and implement offline downloads, reading progress tracking, resume scroll positioning, and bookmark directories.

## Requirements & Goals
- Fix "unboxxbusiness" studio branding by registering `'theaskt'` workspace and overriding greetings.
- Resolve Editorial Dashboard duplicate rows by restricting metrics queries to latest document versions only.
- Implement article classification fields: Breaking News, Latest, Featured, and Sponsored.
- Implement user library page (`/library`) with Bookmarks, Downloads, and Reading History tabs.
- Implement scroll tracking and smooth-scrolling resume toasts to continue reading where users left off.

## Proposed Changes

### Sanity Studio Configuration

#### [MODIFY] [sanity.config.ts](file:///e:/askt/sanity.config.ts)
- Change workspace `name` to `'theaskt'`.

#### [MODIFY] [EditorialDashboard.tsx](file:///e:/askt/sanity/components/EditorialDashboard.tsx)
- Override username rendering: if username is `'unboxxbusiness'`, display `"TheAskt Editor"`.
- Refactor GROQ queries to deduplicate draft and published versions of the same article document.
- Fix `publishedToday` metrics query to target only published nodes (`!(_id in path("drafts.**"))`).

#### [MODIFY] [contentFactory.ts](file:///e:/askt/sanity/schemaTypes/contentFactory.ts)
- Add boolean toggles under `content` schema group: `isBreaking`, `isLatest`, `isFeatured`, and `isSponsored`.

---

### Storage & State Layer

#### [NEW] [libraryStorage.ts](file:///e:/askt/lib/storage/libraryStorage.ts)
- Unified Local Storage utility to manage Bookmarks, Offline Downloads (serializing Portable Text blocks), and Reading History arrays.

#### [NEW] [useScrollProgress.ts](file:///e:/askt/hooks/useScrollProgress.ts)
- Track scrolling percentage inside articles and cache scroll coordinates in `localStorage`.

---

### Frontend Components & Pages

#### [NEW] [ReadingResumeToast.tsx](file:///e:/askt/components/shared/ReadingResumeToast.tsx)
- Renders a floating, slide-up panel at the bottom center of viewport if the user has an active reading session in progress. Smooth-scrolls to the last position when clicked.

#### [NEW] [page.tsx](file:///e:/askt/app/library/page.tsx)
- Tabbed dashboard rendering bookmarked, downloaded, and recently read articles. Offers offline reading views.

#### [MODIFY] [ArticleLayout.tsx](file:///e:/askt/components/layout/ArticleLayout.tsx)
- Add Bookmark and Download actions near the speech synthesis trigger.
- Mount `<ReadingResumeToast />` to check for reading progress.

#### [MODIFY] [Navbar.tsx](file:///e:/askt/components/navigation/Navbar.tsx)
- Render a link to `/library` in the main nav lists.

---

## Verification Plan

### Automated Verification
- Run typescript compilation diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Access Sanity Studio and check dashboard names and query items.
- Verify bookmark and download toggles on articles add items to the Library dashboard.
- Simulate scroll progress, return to the page, and check if the Resume toast is displayed and functional.
- Navigate to `/library` while offline and verify that downloaded articles can be read.
