# Production & Cost Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize TheAskt Next.js App Router application for performance, caching, security, cost-efficiency, and correct next/image rendering.

**Key Deliverables:**
1. Configure `next.config.ts` to allow `cdn.sanity.io` image domains.
2. Replace raw `<img>` tags with standard Next.js `<Image />` component configurations for dynamic resizing and AVIF/WebP delivery.
3. Inject `generateStaticParams` static parametrizations and enable explicit `revalidate` ISR variables in learn detail routes (`[slug]/page.tsx`, `category/[slug]/page.tsx`, `tag/[slug]/page.tsx`, `author/[slug]/page.tsx`).
4. Prevent concurrent double-submissions in newsletter, booking, download, and contact forms.
5. De-duplicate push notification token registrations using `localStorage` caching.
6. Create server-side Edge-cachable API endpoint `/api/search` and map client dialog fetches to it.
7. Create standard secure `firestore.rules` configuration file in the project root.

---

## Proposed Changes

### Task 1: next/image remote patterns configuration
**Files:**
- Modify: [next.config.ts](file:///e:/askt/next.config.ts)

- [ ] **Step 1: Edit next.config.ts**
  Add images remotePatterns rules to authorize Sanity CDN images:
  ```typescript
  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  };

  export default nextConfig;
  ```

---

### Task 2: next/image component replacements
**Files:**
- Modify: [components/ui/Avatar.tsx](file:///e:/askt/components/ui/Avatar.tsx)
- Modify: [components/layout/ArticleLayout.tsx](file:///e:/askt/components/layout/ArticleLayout.tsx)
- Modify: [components/cards/Card.tsx](file:///e:/askt/components/cards/Card.tsx)
- Modify: [components/cards/ArticleCard.tsx](file:///e:/askt/components/cards/ArticleCard.tsx)
- Modify: [app/learn/[slug]/page.tsx](file:///e:/askt/app/learn/[slug]/page.tsx)
- Modify: [app/learn/author/[slug]/page.tsx](file:///e:/askt/app/learn/author/[slug]/page.tsx)

- [ ] **Step 1: Update Avatar.tsx**
  Replace raw `<img>` with Next.js `<Image />` containing height/width metrics or fallback.
- [ ] **Step 2: Update ArticleLayout.tsx**
  Replace article cover `<img>` with `<Image />`.
- [ ] **Step 3: Update Card.tsx**
  Replace author avatar `<img>` with `<Image />`.
- [ ] **Step 4: Update ArticleCard.tsx**
  Replace article card cover `<img>` with `<Image />`.
- [ ] **Step 5: Update app/learn/[slug]/page.tsx**
  Replace dynamic content inline `<img>` block parser with Next.js `<Image />`.
- [ ] **Step 6: Update app/learn/author/[slug]/page.tsx**
  Replace author photo `<img>` with `<Image />`.

---

### Task 3: Static Generation Parametrization (generateStaticParams) & ISR
**Files:**
- Modify: [app/learn/[slug]/page.tsx](file:///e:/askt/app/learn/[slug]/page.tsx)
- Modify: [app/learn/category/[slug]/page.tsx](file:///e:/askt/app/learn/category/[slug]/page.tsx)
- Modify: [app/learn/tag/[slug]/page.tsx](file:///e:/askt/app/learn/tag/[slug]/page.tsx)
- Modify: [app/learn/author/[slug]/page.tsx](file:///e:/askt/app/learn/author/[slug]/page.tsx)

- [ ] **Step 1: Add generateStaticParams and revalidate to learn detail page**
  Export `generateStaticParams()` to fetch existing slugs and compile pages at build time, and export `revalidate = 600`.
- [ ] **Step 2: Add generateStaticParams to category page**
  Export `generateStaticParams()` matching category slugs.
- [ ] **Step 3: Add generateStaticParams to tag page**
  Export `generateStaticParams()` matching tag slugs.
- [ ] **Step 4: Add generateStaticParams to author page**
  Export `generateStaticParams()` matching author slugs.

---

### Task 4: Duplicate Form Submission Prevention
**Files:**
- Modify: [app/contact/page.tsx](file:///e:/askt/app/contact/page.tsx)
- Modify: [app/book-session/page.tsx](file:///e:/askt/app/book-session/page.tsx)
- Modify: [components/forms/NewsletterForm.tsx](file:///e:/askt/components/forms/NewsletterForm.tsx)
- Modify: [components/forms/DownloadBrochureForm.tsx](file:///e:/askt/components/forms/DownloadBrochureForm.tsx)
- Modify: [components/forms/CareerBrochureForm.tsx](file:///e:/askt/components/forms/CareerBrochureForm.tsx)

- [ ] **Step 1: Prevent duplicate submit in contact page**
  Add `if (loading) return;` at the beginning of `onSubmit`.
- [ ] **Step 2: Prevent duplicate submit in book session page**
  Add `if (loading) return;` at the beginning of `onSubmit`.
- [ ] **Step 3: Prevent duplicate submit in NewsletterForm**
  Add `if (loading) return;` at the beginning of `onSubmit`.
- [ ] **Step 4: Prevent duplicate submit in DownloadBrochureForm**
  Add `if (loading) return;` at the beginning of `onSubmit`.
- [ ] **Step 5: Prevent duplicate submit in CareerBrochureForm**
  Add `if (loading) return;` at the beginning of `onSubmit`.

---

### Task 5: Push Notification Token De-duplication
**Files:**
- Modify: [components/shared/FcmInitializer.tsx](file:///e:/askt/components/shared/FcmInitializer.tsx)

- [ ] **Step 1: Check localStorage before registering fcmToken**
  Inside `requestPermission` in `FcmInitializer.tsx`, verify if `"fcm_token"` is already saved. If yes, skip `submitToFirestore` database write.

---

### Task 6: Server-Side Cached Search API Handler
**Files:**
- Create: [app/api/search/route.ts](file:///e:/askt/app/api/search/route.ts)
- Modify: [components/navigation/SearchDialog.tsx](file:///e:/askt/components/navigation/SearchDialog.tsx)

- [ ] **Step 1: Create search route handler**
  Add `/api/search` using Edge-caching control header to route search request matches.
- [ ] **Step 2: Refactor SearchDialog to query /api/search**
  Use `fetch` to query server route instead of calling `client.fetch` directly on the client.

---

### Task 7: Firestore Security Rules Configurations
**Files:**
- Create: [firestore.rules](file:///e:/askt/firestore.rules)

- [ ] **Step 1: Create firestore.rules**
  Define strict validation and restrict public read access.

---

## Verification Plan

### Automated Tests
- Run compile: `npx tsc --noEmit`
- Run local production compilation: `npm run build`
