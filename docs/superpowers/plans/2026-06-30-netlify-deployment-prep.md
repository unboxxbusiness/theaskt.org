# Netlify Deployment Preparation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure and verify the Next.js App Router application for seamless deployment on Netlify.

**Key Deliverables:**
1. Root `netlify.toml` file setting Node.js 20, build command, and redirect configuration.
2. Root `.env.example` template mapping all required API and client-facing environment keys.
3. Successful compilation verification of `npm run build`.

---

## Proposed Changes

### Task 1: Netlify Configuration and Templates

- [ ] **Step 1: Create netlify.toml config file**
  Create [netlify.toml](file:///e:/askt/netlify.toml) with:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"

  [build.environment]
    NODE_VERSION = "20"

  # Redirect rule to ensure client-side hydration works on deep routing
  [[redirects]]
    from = "/*"
    status = 200
    force = false
  ```

- [ ] **Step 2: Create .env.example template**
  Create [.env.example](file:///e:/askt/.env.example) listing all variable keys:
  ```ini
  # Sanity Studio Configuration
  NEXT_PUBLIC_SANITY_PROJECT_ID=
  NEXT_PUBLIC_SANITY_DATASET=

  # Firebase Client Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  NEXT_PUBLIC_FIREBASE_VAPID_KEY=

  # Firebase Server Admin Configuration
  FIREBASE_MESSAGING_SERVER_KEY=

  # Webhook Security
  SANITY_WEBHOOK_SECRET=

  # Site Settings
  NEXT_PUBLIC_BASE_URL=
  ```

- [ ] **Step 3: Build Verification**
  Run local build: `npm run build`
  Expected: Successful compilation without type or bundler errors.
