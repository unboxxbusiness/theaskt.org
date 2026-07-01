<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Satori & ImageResponse SVG Rules
* **No Direct Icon Library Imports**: When generating images dynamically with `next/og` (Satori), never import React icon components (e.g., from `lucide-react`) directly. Satori cannot compile components using `forwardRef` or react lifecycle hooks.
* **Inline Raw Paths**: Extract raw SVG elements and render standard `<svg>` tags with inline attributes (`viewBox`, `stroke`, `fill`, etc.) inside the JSX returned by `ImageResponse`.

# Next.js 16 next.config.ts Rules
* **No `eslint` Config Key**: In Next.js 16+, do not define the `eslint` configuration key within the export config object. It is deprecated and results in build compilation warnings/errors.

# Sanity Studio Custom Rules
* **Sanity v3 Singletons**: When configuring singleton documents (e.g. settings) in the Structure Builder, do not use `S.documentListItem()`. Instead, use the standard pattern:
  ```typescript
  S.listItem()
    .title('Title')
    .child(
      S.document()
        .schemaType('schemaType')
        .documentId('documentId')
        .title('Title')
    )
  ```
* **Card Component Attributes**: Do not pass the `hover` prop to `@sanity/ui` `<Card>` elements as it propagates to the DOM as a non-boolean attribute, triggering React console warnings. Apply style attributes or standard classes instead.
* **Background Installation Checks**: If background package installations (`npm install`) hang or execute silently, verify if a local Next.js dev server is holding locks on `node_modules` folders. Manual addition of dependencies to `package.json` followed by installation represents a more reliable alternative.

# Next.js App Router Page Wrappers
* **Separate Client Forms**: To enable full metadata exports (SEO titles, meta descriptions, canonical links) and server-side JSON-LD injection, never label page-level files (`app/**/page.tsx`) with `"use client"`. Instead, structure pages as Server Components that wrap and render nested Client Component forms (e.g. `app/contact/page.tsx` rendering `<ContactForm />`).
* **Deduplicate Sanity Fetches**: When querying site settings or other configurations in both `generateMetadata()` and page rendering, wrap the fetching functions using React's `cache()` helper inside `lib/sanity.ts`. This ensures only a single fetch request is issued to the Sanity API CDN per page load.

# Sanity UI Layouts
* **Text Styling props**: The Sanity v3 `@sanity/ui` `<Text>` component does not support props like `italic`. Apply styles like `style={{ fontStyle: 'italic' }}` or nest children inside `<i>` tags instead.

# Reusable Inputs & Form Accessibility (WCAG)
* **Error-Input Pairing**: Always pair form inputs, selects, textareas, and checkboxes with labels using correct `id` and `htmlFor` properties (fall back to the react-hook-form `name` attribute if no explicit `id` is set).
* **ARIA describedby**: Connect validation error elements to inputs using `aria-describedby={error ? errorId : undefined}` and `id={errorId}`, while adding `role="alert"` and `aria-invalid={true}` to improve screen reader accessibility.

