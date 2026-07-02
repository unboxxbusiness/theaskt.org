# Specification - Restrict Search to Articles Only

Restrict the search feature to search and match only article documents, omitting categories, tags, and authors.

## Proposed Changes

### Search API

#### [MODIFY] [route.ts](file:///e:/askt/app/api/search/route.ts)
- Modify the GROQ query to only query `_type == "article"`.
- Clean up the query fields to only retrieve `_type`, `title`, and `slug`.

---

## Verification Plan

### Automated Verification
- Run typescript compilation diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Test search by typing terms that match categories, tags, or authors (e.g. "guides" or "careers"). Confirm no category/tag results are returned.
- Test search by typing words matching article titles. Confirm only articles are displayed.
