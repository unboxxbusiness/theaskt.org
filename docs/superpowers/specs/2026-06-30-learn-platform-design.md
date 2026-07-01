# TheAskt AI Career & Learning Platform: Design Specification

This document details the architectural and visual design specifications to optimize and evolve the existing Next.js + Sanity Studio application into a premium editorial AI Career and Learning platform inspired by *The Washington Post*, *Bloomberg*, and *Medium*.

## Design Principles

- **Editorial Elegance**: Zero gradients, zero glassmorphism. Focus on large, readable typography, generous whitespace, sharp minimal borders, and a centered reading container (640px–720px max-width) to enhance readability.
- **Dynamic & Non-Technical**: Editors can manage all navigation, footer layouts, homepages, announcements, and SEO meta tags directly via Sanity Studio without touching the frontend.
- **Lightweight & Fast**: Zero heavy dependencies. We use native platform features (Web API `fetch`, custom REST clients) and server-side components for fast, search-optimized pages.

---

## 1. Sanity Studio Schema Architecture

We will introduce new schemas to handle settings and structure dynamically:

### Homepage (`homepage` - Singleton)
- **Hero Section**: `title` (string), `subtitle` (text), `ctaText` (string), `ctaLink` (string)
- **AI Career Program Section**: `heading` (string), `description` (text), `features` (array of objects with title & text)
- **FAQ Section**: `faqs` (array of references to `faq` documents)
- **Testimonial Section**: `testimonials` (array of references to `testimonial` documents)

### Site & Navigation Settings (`siteSettings` - Singleton)
- **General**: `siteName` (string), `logoText` (string)
- **Navigation Links**: `headerMenu` (array of objects supporting nested submenus and external links)
- **Footer Settings**: `footerLinks` (array of link groups), `copyrightText` (string)
- **SEO Defaults**: `defaultSeoTitle` (string), `defaultSeoDescription` (text), `fallbackShareImage` (image)

### Announcements (`announcement` - Document type)
- **Fields**: `title`, `description`, `ctaText`, `ctaLink`, `bgColor` (hex), `active` (boolean), `startDate`, `endDate`

---

## 2. Dynamic Frontend Routes

All routes under `/learn` will be fully query-driven from Sanity using GROQ:

- `/learn`: Displays a featured hero article, trending column, latest articles feed, category filters, and featured resources.
- `/learn/[slug]`: Renders premium long-form content. Features reading time, breadcrumbs, social sharing buttons, progress tracker, and related articles.
- `/learn/category/[slug]`: Displays filtered articles tagged with the category.
- `/learn/tag/[slug]`: Renders tag-specific search results.
- `/learn/author/[slug]`: Author profile layout, avatar, biography, social media links, and a grid of their articles.

---

## 3. Rich Content (Portable Text)

Next.js will render Sanity Portable Text using customized components:
- **Headings / Lists / Paragraphs**: Large serif fonts for body copy, high-contrast sans-serif for headings.
- **Quotes**: Premium indented blockquotes with custom left accent borders.
- **Tables**: Clean horizontal grid lines.
- **Media Embeds**: Custom components for YouTube/Vimeo, Twitter embeds, Image Galleries, and File/PDF attachments.
- **Callouts**: Styled informational panels with border accents.

---

## 4. Submissions & Push Notifications

- **Forms**: Built using `react-hook-form` + `zod` validation.
- **Firestore REST integration**: Form submissions (Newsletter, Contact, Book Session, Brochure Downloads) POST directly to Firestore via the custom REST client.
- **Push Notifications**: FCM prompt shown conditionally after user scroll/time engagement, saving mock/webpush tokens via REST.

---

## 5. Performance & SEO

- **Static Generation & ISR**: Pages are statically pre-rendered with Incremental Static Regeneration (revalidated every 60 minutes) to ensure fast responses and high SEO indexing.
- **Dynamic Meta Tags**: Next.js `generateMetadata` retrieves real-time titles, descriptions, and OpenGraph/Twitter cards from Sanity on a per-page basis.
- **Feeds**: Automatic generation of `/sitemap.xml` and `/rss.xml` feeds for search crawlers and RSS readers.
