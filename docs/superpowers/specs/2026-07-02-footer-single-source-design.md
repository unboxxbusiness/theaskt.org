# Specification - Dynamic CMS-Driven Footer

Establish a single source of truth for the application's footer links, pulling custom columns and active categories directly from Sanity CMS, and eliminating all hardcoded fallback values.

## Requirements & Goals
- Remove all hardcoded navigation link arrays in the codebase for the footer.
- Dynamically fetch all available `category` documents from Sanity CMS and render them as a dedicated "Categories" column.
- Render other custom columns (e.g., Platform, Company, Support) dynamically based on the CMS settings in `siteSettings.footerLinks`.
- Keep the design highly optimized using server-side caching (`react.cache`) to ensure zero performance overhead.

## Proposed Changes

### Data and Queries Layer

#### [MODIFY] [sanity.ts](file:///e:/askt/lib/sanity.ts)
- Add `getCachedCategories` wrapper using React's `cache` to fetch categories and deduplicate them in layouts.
- Import `categoriesQuery` from `queries.ts`.

---

### Layouts Layer

#### [MODIFY] [layout.tsx](file:///e:/askt/app/layout.tsx)
- Import `getCachedCategories` from `@/lib/sanity`.
- Fetch the categories server-side inside `RootLayout`.
- Pass the fetched categories array to the `<Footer>` component.

---

### Components Layer

#### [MODIFY] [Footer.tsx](file:///e:/askt/components/navigation/Footer.tsx)
- Update `FooterProps` to accept `categories` array.
- Remove hardcoded static array fallbacks (`rawColumns`).
- Dynamically build the final columns display by combining columns from `settings?.footerLinks` with the dynamically generated "Categories" column.
- Ensure proper styling and responsive grid mapping for the new layout.

---

## Verification Plan

### Automated Verification
- Run compiler diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Verify that footer columns (including "Categories") are rendered on the homepage and deep pages.
- Check that adding a new category in Sanity Studio automatically populates it in the footer navigation.
