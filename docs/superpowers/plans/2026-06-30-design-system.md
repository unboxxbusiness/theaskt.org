# Unified Design System & Component Refactoring Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing Next.js + Tailwind CSS codebase to use a unified, premium editorial design system inspired by Apple, Linear, and The Washington Post, using a clean component structure with zero UI duplication.

**Architecture:** We will build reusable primitives across standard visual categories (UI, typography, layout, navigation, cards, forms) and refactor the app pages to consume them. Intentional simplifications will leverage standard platform features (like native `<details>` for accordions and dialog overlays) to avoid bloating the codebase, marked with `/* ponytail: simplified */` comments.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, React 19, Lucide React, React Hook Form, Zod.

## Global Constraints
- **Single Design Language**: Consistent margins, borders, typography, hover transitions, and colors in light and dark mode.
- **Component Folder Structure**: Save components under `components/ui/`, `components/layout/`, `components/forms/`, `components/cards/`, `components/sections/`, `components/navigation/`, `components/feedback/`, `components/typography/`, and `components/shared/`.
- **Theme Support**: Use the existing client-side `ThemeProvider` class mappings (`bg-bg-primary`, `text-text-body`, etc.) defined in `app/globals.css`.
- **YAGNI & Simplicity**: Rely on pure tailwind utilities, standard react props, and clean structure. No unrequested package installations.

---

## Tasks

### Task 1: Create Typography and Layout Primitives
Create typography elements and container/section elements that lock in consistent margins and hierarchies.

**Files:**
- Create: `components/typography/Typography.tsx`
- Create: `components/layout/Container.tsx`
- Create: `components/layout/Section.tsx`

- [ ] **Step 1**: Write and save the `Typography` component in `components/typography/Typography.tsx` implementing Display, H1-H4, lead, body, and caption variants.
- [ ] **Step 2**: Write and save the `Container` layout component in `components/layout/Container.tsx` with max-w constraints.
- [ ] **Step 3**: Write and save the `Section` wrapper component in `components/layout/Section.tsx`.

---

### Task 2: Create UI Core Primitives
Create button variants, HTML5 details accordions, badges, loading skeletons, and interactive dialog portals.

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Accordion.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Skeleton.tsx`
- Create: `components/ui/Modal.tsx`

- [ ] **Step 1**: Write the unified `Button` component supporting primary/outline/ghost/accent variants.
- [ ] **Step 2**: Write the accessible `Accordion` using native `<details>` toggle elements.
- [ ] **Step 3**: Write standard `Badge` tag.
- [ ] **Step 4**: Write loading animations and `Skeleton` segments.
- [ ] **Step 5**: Write dynamic modal/popup container supporting Esc dismiss and focus-locking.

---

### Task 3: Create Form and Input Primitives
Create React Hook Form wrapper components: Inputs, Textareas, Select lists, Labels, and checkboxes.

**Files:**
- Create: `components/ui/Input.tsx`

- [ ] **Step 1**: Write custom React ref-forwarded `Input` and `Textarea` controls.
- [ ] **Step 2**: Write ref-forwarded `Select` and checkbox markup.
- [ ] **Step 3**: Compile clean styling schemas matching the input focus colors.

---

### Task 4: Create Reusable Layout & Navigation Primitives
Create announcement banner, Navbar, Footer, and Policy templates.

**Files:**
- Create: `components/layout/PolicyLayout.tsx`
- Create: `components/layout/ArticleLayout.tsx`
- Create: `components/navigation/AnnouncementBar.tsx`
- Create: `components/navigation/Navbar.tsx`
- Create: `components/navigation/Footer.tsx`

- [ ] **Step 1**: Write general Policy layout helper.
- [ ] **Step 2**: Write central Article layout wrapper.
- [ ] **Step 3**: Port announcements data renderers.
- [ ] **Step 4**: Move global Header and Footer files into `components/navigation/`.

---

### Task 5: Refactor App Pages to use Design System
Modify homepage, career-program page, book-session, contact, and legal sections to consume the new design system.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/career-program/page.tsx`
- Modify: `app/book-session/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/terms-of-use/page.tsx`
- Modify: `app/privacy-policy/page.tsx`
- Modify: `app/disclaimer/page.tsx`

- [ ] **Step 1**: Refactor homepage columns and grids.
- [ ] **Step 2**: Refactor program page module blocks and brochures forms.
- [ ] **Step 3**: Refactor book session forms and selections.
- [ ] **Step 4**: Refactor legal policy templates.
