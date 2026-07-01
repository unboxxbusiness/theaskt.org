# Maximum SEO & AI Search Optimization (AEO) Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor and optimize the Next.js App Router application for maximum search engine discoverability and LLM-powered context citation (ChatGPT Search, Perplexity, Claude, Gemini, etc.).

**Key Deliverables:**
1. Dynamic metadata base & canonical configs for all static/dynamic routes.
2. Search indexation rules served via `robots.ts`.
3. Auto-injected structured JSON-LD schemas (Organization, WebSite, Breadcrumbs, Article, FAQ, Person, and EducationalOrganization).
4. Google Analytics 4 integration.
5. Expanded Sanity CMS schema inputs (Overrides for Meta Title, Meta Description, ogImage, canonicalUrl, and noIndex toggle).

---

## Proposed Changes

### Task 1: Reusable SEO Components & Configuration

- [ ] **Step 1: Create JsonLd structured data injection component**
  Create [JsonLd.tsx](file:///e:/askt/components/shared/JsonLd.tsx):
  ```typescript
  "use client";

  export default function JsonLd({ schema }: { schema: any }) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }
  ```

- [ ] **Step 2: Create Google Analytics 4 integration component**
  Create [Analytics.tsx](file:///e:/askt/components/shared/Analytics.tsx):
  ```typescript
  "use client";

  import Script from "next/script";

  export default function Analytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return null;

    /* ponytail: minimal native Google Analytics 4 integration */
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </>
    );
  }
  ```

- [ ] **Step 3: Create Robots.txt configuration**
  Create [robots.ts](file:///e:/askt/app/robots.ts):
  ```typescript
  import { MetadataRoute } from 'next';

  export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
  ```

---

### Task 2: Metadata & JSON-LD Global Registrations

- [ ] **Step 1: Update Root Layout**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx):
  * Import `Analytics` from `@/components/shared/Analytics`.
  * Import `JsonLd` from `@/components/shared/JsonLd`.
  * Define `metadataBase` in layout's `generateMetadata` function (using `process.env.NEXT_PUBLIC_BASE_URL`).
  * Add default `alternates: { canonical: '/' }` and robots options to metadata.
  * Inject the `Analytics` tracker and default `Organization` & `WebSite` JSON-LD schemas inside layout body.
    * Organization properties: Name: TheAskt, URL: theaskt.com, logo icon URL.
    * WebSite properties: Name: TheAskt, target search query url.

- [ ] **Step 2: Update Breadcrumb list component**
  Modify [Breadcrumb.tsx](file:///e:/askt/components/navigation/Breadcrumb.tsx):
  * Dynamic breadcrumb elements mapped to JSON-LD `BreadcrumbList` schema and returned inside a `<script>` tag.

---

### Task 3: Metadata, Canonical & JSON-LD for Static Routes

- [ ] **Step 1: Define canonical tags for static pages**
  Update metadata properties to include alternates/canonical settings:
  * [app/about/page.tsx](file:///e:/askt/app/about/page.tsx) -> `alternates: { canonical: '/about' }`
  * [app/contact/page.tsx](file:///e:/askt/app/contact/page.tsx) -> `alternates: { canonical: '/contact' }`
  * [app/book-session/page.tsx](file:///e:/askt/app/book-session/page.tsx) -> `alternates: { canonical: '/book-session' }`
  * [app/download-brochure/page.tsx](file:///e:/askt/app/download-brochure/page.tsx) -> `alternates: { canonical: '/download-brochure' }`
  * [app/privacy-policy/page.tsx](file:///e:/askt/app/privacy-policy/page.tsx) -> `alternates: { canonical: '/privacy-policy' }`
  * [app/terms-of-use/page.tsx](file:///e:/askt/app/terms-of-use/page.tsx) -> `alternates: { canonical: '/terms-of-use' }`
  * [app/disclaimer/page.tsx](file:///e:/askt/app/disclaimer/page.tsx) -> `alternates: { canonical: '/disclaimer' }`

- [ ] **Step 2: Add FAQ & Course schemas to AI Career Program page**
  Modify [app/career-program/page.tsx](file:///e:/askt/app/career-program/page.tsx):
  * Render `FAQPage` and `EducationalOrganization` schemas.

---

### Task 4: Dynamic Category, Tag, Author & Article Route Optimizations

- [ ] **Step 1: Add dynamic page metadata canonicals**
  * Update [app/learn/page.tsx](file:///e:/askt/app/learn/page.tsx) with Hub metadata and `/learn` canonical tag.
  * Update [app/learn/category/[slug]/page.tsx](file:///e:/askt/app/learn/category/[slug]/page.tsx) to generate canonical dynamic alternates.
  * Update [app/learn/tag/[slug]/page.tsx](file:///e:/askt/app/learn/tag/[slug]/page.tsx) to generate canonical dynamic alternates.
  * Update [app/learn/author/[slug]/page.tsx](file:///e:/askt/app/learn/author/[slug]/page.tsx) to generate canonical dynamic alternates, and render `Person` schema dynamically.

- [ ] **Step 2: Add Article schema to Dynamic Article details page**
  Modify [app/learn/[slug]/page.tsx](file:///e:/askt/app/learn/[slug]/page.tsx):
  * Import `JsonLd` and dynamically generate `Article` schema (headline, cover, datePublished, author, body excerpt details).
  * Check Sanity configuration flags (canonical overrides, robots directives noindex toggle, custom sharing cover).

---

### Task 5: Sanity CMS SEO fields extension

- [ ] **Step 1: Update Sanity schemas to add overrides**
  * Modify [sanity/schemaTypes/contentFactory.ts](file:///e:/askt/sanity/schemaTypes/contentFactory.ts) adding:
    * `canonicalUrl` (string)
    * `ogImage` (image)
    * `noIndex` (boolean)
  * Modify [sanity/schemaTypes/author.ts](file:///e:/askt/sanity/schemaTypes/author.ts) to support metadata settings.
  * Modify [sanity/schemaTypes/category.ts](file:///e:/askt/sanity/schemaTypes/category.ts) to support metadata settings.
  * Modify [sanity/schemaTypes/homepage.ts](file:///e:/askt/sanity/schemaTypes/homepage.ts) to support metadata settings.

---

## Verification Plan

### Automated Tests
- Run check script: `npx tsc --noEmit`
- Verify sitemap schema mapping structure compiles correctly.

### Manual Verification
- Check HTML sources of dynamic and static pages to ensure canonical tags are correctly formed as absolute paths.
- Check structured data markup format matches schema.org validator standards.
