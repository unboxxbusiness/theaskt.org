# PWA, Offline Caching & FCM Push Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor and optimize the existing Next.js App Router application into a Progressive Web App (PWA) with native service worker caching, offline visited article indexes, background sync for form submissions, and Firebase Cloud Messaging (FCM) push permissions.

**Architecture:** We will implement a native Service Worker `public/sw.js` to handle asset caching (CSS, JS, fonts, static assets), stale-while-revalidate caches for article detail pages, custom offline navigation, and FCM background notification payloads. Form queueing is handled client-side via IndexedDB, syncing automatically on recovery.

**Tech Stack:** Native Service Worker API, IndexedDB API, Native Push API, Firebase Web Cloud Messaging REST API.

## Global Constraints
- Support both Light and Dark mode using next-themes
- Do not add heavy dependencies; prioritize standard browser APIs
- Do not change existing UI or business logic, add PWA capabilities alongside the current design system
- Pass all Lighthouse PWA audit criteria (installable, standalone display, HTTPS, icons)

---

### Task 1: Web App Manifest & App Configuration

**Files:**
- Create: `public/manifest.json`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Static logo and icon paths
- Produces: Web App Manifest file registered in layout metadata

- [ ] **Step 1: Create the PWA Manifest file**
  Create [manifest.json](file:///e:/askt/public/manifest.json) containing:
  ```json
  {
    "name": "TheAskt — AI Career & Opportunity Platform",
    "short_name": "TheAskt",
    "description": "Learn AI, Build Skills, Create Career Opportunities.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#FFFFFF",
    "theme_color": "#14213D",
    "orientation": "portrait",
    "categories": ["education", "business", "productivity"],
    "icons": [
      {
        "src": "/next.svg",
        "sizes": "192x192",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/next.svg",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "maskable"
      }
    ]
  }
  ```

- [ ] **Step 2: Link manifest inside root layout**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to declare the manifest path and basic mobile theme colors in Next.js metadata.
  ```typescript
  // app/layout.tsx metadata updates
  export async function generateMetadata(): Promise<Metadata> {
    const settings = await client.fetch(siteSettingsQuery).catch(() => null);
    return {
      title: settings?.defaultSeoTitle || "TheAskt — AI Career & Opportunity Platform",
      description: settings?.defaultSeoDescription || "Learn AI, Build Skills, Create Career Opportunities.",
      manifest: "/manifest.json",
      themeColor: "#14213D",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "TheAskt",
      },
    };
  }
  ```

- [ ] **Step 3: Verify manifest registration**
  Check that compile succeeds. Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 2: Service Worker & Caching Strategy

**Files:**
- Create: `public/sw.js`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Browser navigation requests and dynamic sub-asset cache queries
- Produces: Service Worker intercepting fetch events for caching offline fallbacks

- [ ] **Step 1: Write native Service Worker script**
  Create [sw.js](file:///e:/askt/public/sw.js) mapping cache names and fetch strategies:
  ```javascript
  const CACHE_NAME = 'theaskt-cache-v1';
  const OFFLINE_URL = '/offline';

  const STATIC_ASSETS = [
    OFFLINE_URL,
    '/',
    '/learn',
    '/about',
    '/contact',
    '/manifest.json',
    '/next.svg',
    '/globals.css'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }).then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
    // Only intercept local HTTP GET requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
      return;
    }

    const url = new URL(event.request.url);

    // Bypass caching for Sanity Studio and Admin API endpoints
    if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/api/')) {
      return;
    }

    // Navigation requests (HTML pages)
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => {
            return caches.match(event.request).then((cachedResponse) => {
              return cachedResponse || caches.match(OFFLINE_URL);
            });
          })
      );
      return;
    }

    // Static Assets: Cache-First
    if (
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.match(/\.(woff2?|ttf|png|jpe?g|gif|svg|ico)$/)
    ) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          });
        })
      );
      return;
    }

    // Default strategy: Stale-While-Revalidate
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
  });
  ```

- [ ] **Step 2: Register Service Worker in Root Layout**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to register the service worker on client component load:
  ```typescript
  // Register service worker inside layout.tsx using a Client component helper
  // We can include a tiny inline script tag or load a wrapper component. Let's create components/shared/SwRegister.tsx
  ```

- [ ] **Step 3: Create SwRegister component**
  Create [SwRegister.tsx](file:///e:/askt/components/shared/SwRegister.tsx):
  ```typescript
  "use client";

  import { useEffect } from "react";

  export default function SwRegister() {
    useEffect(() => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("Service Worker registered successfully: ", reg.scope);
            })
            .catch((err) => {
              console.error("Service Worker registration failed: ", err);
            });
        });
      }
    }, []);

    return null;
  }
  ```
  Render `<SwRegister />` inside `<ThemeProvider>` in [layout.tsx](file:///e:/askt/app/layout.tsx).

---

### Task 3: Visited Article Caching & Offline Page

**Files:**
- Create: `components/shared/OfflineTracker.tsx`
- Create: `app/offline/page.tsx`
- Modify: `app/learn/[slug]/page.tsx`

**Interfaces:**
- Consumes: Visited article slug, title, and descriptions
- Produces: List of read articles cached offline inside LocalStorage

- [ ] **Step 1: Write OfflineTracker client script**
  Create [OfflineTracker.tsx](file:///e:/askt/components/shared/OfflineTracker.tsx):
  ```typescript
  "use client";

  import { useEffect } from "react";

  interface OfflineTrackerProps {
    slug: string;
    title: string;
    excerpt?: string;
  }

  export default function OfflineTracker({ slug, title, excerpt = "" }: OfflineTrackerProps) {
    useEffect(() => {
      if (typeof window === "undefined") return;
      try {
        const stored = localStorage.getItem("previously_read_articles");
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((item: any) => item.slug !== slug);
        filtered.unshift({ slug, title, excerpt, timestamp: Date.now() });
        const trimmed = filtered.slice(0, 15); // Keep last 15 items max
        localStorage.setItem("previously_read_articles", JSON.stringify(trimmed));
      } catch (e) {
        console.error("Error storing offline article metadata:", e);
      }
    }, [slug, title, excerpt]);

    return null;
  }
  ```

- [ ] **Step 2: Bind OfflineTracker in Article Details template**
  Modify [page.tsx](file:///e:/askt/app/learn/\[slug\]/page.tsx) to render `<OfflineTracker slug={slug} title={title} excerpt={article.excerpt} />` at the bottom of the page return block.

- [ ] **Step 3: Refactor PWA custom Offline page**
  Modify [page.tsx](file:///e:/askt/app/offline/page.tsx) with a responsive design rendering a list of cached articles:
  ```typescript
  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import Container from "@/components/layout/Container";
  import Typography from "@/components/typography/Typography";
  import Button from "@/components/ui/Button";

  interface CachedArticle {
    slug: string;
    title: string;
    excerpt: string;
  }

  export default function OfflinePage() {
    const [cached, setCached] = useState<CachedArticle[]>([]);

    useEffect(() => {
      try {
        const stored = localStorage.getItem("previously_read_articles");
        if (stored) {
          setCached(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to read cached articles list:", e);
      }
    }, []);

    const handleRetry = () => {
      window.location.reload();
    };

    return (
      <Container className="py-20 max-w-xl text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <Typography variant="display">Offline</Typography>
          <Typography variant="body" className="text-text-secondary leading-relaxed block">
            No internet connection detected. Please verify your connection status and try again.
          </Typography>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={handleRetry} variant="primary">
            Retry Connection
          </Button>
          <Button as={Link} href="/" variant="outline">
            Return Home
          </Button>
        </div>

        {cached.length > 0 && (
          <div className="pt-8 border-t border-border-primary space-y-4 text-left">
            <Typography variant="h3" className="text-sm font-bold text-text-h">
              Continue Reading Visited Articles:
            </Typography>
            <div className="space-y-3">
              {cached.map((art, idx) => (
                <Link
                  key={idx}
                  href={`/learn/${art.slug}`}
                  className="block p-4 rounded-xl border border-border-primary bg-bg-secondary hover:border-link transition-colors"
                >
                  <Typography variant="h4" className="text-xs font-bold text-text-h hover:text-link transition-colors">
                    {art.title}
                  </Typography>
                  {art.excerpt && (
                    <Typography variant="small" className="line-clamp-2 leading-relaxed text-text-muted mt-1">
                      {art.excerpt}
                    </Typography>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    );
  }
  ```

---

### Task 4: Offline Form Background Sync

**Files:**
- Create: `lib/offlineSync.ts`
- Modify: `lib/firebase.ts`

**Interfaces:**
- Consumes: Offline form submissions and queues them in IndexedDB
- Produces: Sync handlers uploading documents to Firestore when connectivity is recovered

- [ ] **Step 1: Write IndexedDB offline form synchronizer utility**
  Create [offlineSync.ts](file:///e:/askt/lib/offlineSync.ts):
  ```typescript
  import { submitToFirestore } from "./firebase";

  const DB_NAME = "askt-offline-sync";
  const STORE_NAME = "submissions";

  function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  export async function queueOfflineSubmission(collectionName: string, data: Record<string, string>) {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add({
        collectionName,
        data,
        timestamp: Date.now()
      });
      request.onsuccess = () => {
        console.log(`Queued offline submission for ${collectionName}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  export async function syncOfflineSubmissions() {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = async () => {
      const items = getAllRequest.result;
      if (!items || items.length === 0) return;

      console.log(`Attempting to sync ${items.length} offline submissions...`);
      for (const item of items) {
        try {
          await submitToFirestore(item.collectionName, item.data, true); // Pass bypass flag
          // Success: delete item
          const deleteTx = db.transaction(STORE_NAME, "readwrite");
          deleteTx.objectStore(STORE_NAME).delete(item.id);
        } catch (e) {
          console.error(`Failed to sync submission ${item.id}:`, e);
        }
      }
    };
  }

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
      syncOfflineSubmissions();
    });
  }
  ```

- [ ] **Step 2: Intercept Firestore submissions in Firebase library**
  Modify [firebase.ts](file:///e:/askt/lib/firebase.ts) to intercept submissions when `navigator.onLine` is false:
  ```typescript
  // Add bypass parameter to skip queueing during re-sync
  export async function submitToFirestore(
    collectionName: string,
    data: Record<string, string>,
    bypassQueue = false
  ) {
    if (typeof window !== "undefined" && !navigator.onLine && !bypassQueue) {
      const { queueOfflineSubmission } = await import("./offlineSync");
      await queueOfflineSubmission(collectionName, data);
      return { success: true, offline: true };
    }
    
    // Original implementation remains unchanged...
  ```

---

### Task 5: PWA Install Prompt & Smart Permission Requests

**Files:**
- Create: `components/shared/InstallBanner.tsx`
- Create: `lib/analytics.ts`
- Modify: `components/shared/FcmInitializer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Beforeinstallprompt events and client scrolling metrics
- Produces: Dynamic prompt banner and FCM permission triggers

- [ ] **Step 1: Write InstallBanner Component**
  Create [InstallBanner.tsx](file:///e:/askt/components/shared/InstallBanner.tsx):
  ```typescript
  "use client";

  import { useEffect, useState } from "react";
  import Typography from "../typography/Typography";
  import Button from "../ui/Button";

  export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // Show after second visit/delay or some scrolling activity
        const visitCount = parseInt(localStorage.getItem("visit_count") || "0");
        localStorage.setItem("visit_count", (visitCount + 1).toString());
        
        if (visitCount >= 1) {
          setShowBanner(true);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }, []);

    const handleInstall = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Install user prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
      <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-xl border border-border-primary bg-bg-card p-5 shadow-2xl animate-fade-in transition-colors">
        <div className="space-y-3">
          <Typography variant="h3" className="text-xs font-bold text-text-h">Add to Home Screen</Typography>
          <Typography variant="small" className="leading-4 block text-text-secondary">
            Install TheAskt on your device for offline reading, quick app access, and opportunities updates.
          </Typography>
          <div className="flex gap-2 pt-1">
            <Button onClick={handleInstall} variant="primary" size="sm">
              Install App
            </Button>
            <Button onClick={() => setShowBanner(false)} variant="outline" size="sm">
              Later
            </Button>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create offline-ready Analytics queuing helper**
  Create [analytics.ts](file:///e:/askt/lib/analytics.ts):
  ```typescript
  const TRACKER_KEY = "askt_offline_events";

  export function trackEvent(name: string, payload: Record<string, any> = {}) {
    if (typeof window === "undefined") return;

    const event = { name, payload, timestamp: Date.now() };

    if (!navigator.onLine) {
      try {
        const stored = localStorage.getItem(TRACKER_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.push(event);
        localStorage.setItem(TRACKER_KEY, JSON.stringify(list));
        console.log(`Queued event ${name} offline.`);
      } catch (e) {
        console.error("Failed to queue analytics offline:", e);
      }
      return;
    }

    // Online: print or dispatch event
    console.log(`Analytics event sent: ${name}`, payload);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
      try {
        const stored = localStorage.getItem(TRACKER_KEY);
        if (stored) {
          const list = JSON.parse(stored);
          console.log(`Syncing ${list.length} queued analytics events online...`);
          localStorage.removeItem(TRACKER_KEY);
        }
      } catch (e) {
        console.error("Failed to sync offline analytics events:", e);
      }
    });
  }
  ```

- [ ] **Step 3: Refactor FcmInitializer with smart engagement hooks**
  Modify [FcmInitializer.tsx](file:///e:/askt/components/shared/FcmInitializer.tsx) to ask permission only after meaningful engagement (60s delay, scrolling 70% of page, or downloading brochure/joining newsletter):
  ```typescript
  // Bind scrolls and timer hooks inside FcmInitializer.tsx
  // Set showPrompt only if Notification.permission === "default" AND engagement thresholds are met.
  ```

- [ ] **Step 4: Load prompts inside layout template**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to render `<InstallBanner />`.

---

### Task 6: New Version Notifications & FCM worker binding

**Files:**
- Create: `components/shared/VersionNotification.tsx`
- Modify: `public/sw.js`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Service Worker controller change events
- Produces: Top-level version notification banner with a Refresh reload trigger

- [ ] **Step 1: Write Service Worker update listener script**
  Create [VersionNotification.tsx](file:///e:/askt/components/shared/VersionNotification.tsx):
  ```typescript
  "use client";

  import { useEffect, useState } from "react";
  import Typography from "../typography/Typography";
  import Button from "../ui/Button";

  export default function VersionNotification() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

      navigator.serviceWorker.ready.then((reg) => {
        setSwRegistration(reg);

        const handleUpdate = () => {
          if (reg.waiting) {
            setUpdateAvailable(true);
          }
        };

        // Listen for new service worker instances
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Check if there is an active worker waiting
        if (reg.waiting) {
          setUpdateAvailable(true);
        }
      });
    }, []);

    const handleRefresh = () => {
      if (!swRegistration || !swRegistration.waiting) return;
      // Send skipWaiting message to the waiting Service Worker
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    };

    if (!updateAvailable) return null;

    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm rounded-xl border border-border-primary bg-bg-card p-4 shadow-2xl flex items-center justify-between gap-4 animate-fade-in">
        <Typography variant="small" className="font-semibold text-text-h">
          A new version is available.
        </Typography>
        <Button onClick={handleRefresh} variant="accent" size="sm">
          Refresh
        </Button>
      </div>
    );
  }
  ```

- [ ] **Step 2: Bind version skip message trigger in Service Worker**
  Modify [sw.js](file:///e:/askt/public/sw.js) to activate new service worker when receiving SKIP_WAITING event:
  ```javascript
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  ```

- [ ] **Step 3: Load VersionNotification inside layout template**
  Modify [layout.tsx](file:///e:/askt/app/layout.tsx) to render `<VersionNotification />`.

---

## Verification Plan

### Automated Tests
- Run typecheck check: `npx tsc --noEmit`
- Run local production bundle compiler: `npm run build`

### Manual Verification
- Simulate offline network using Chrome DevTools Network Offline tab and verify that the `/offline` route displays with retry buttons, navigation links, and previously visited articles index list.
- Submit brochure download form offline, observe database REST network fail, review IndexedDB submissions store index, toggle network back online, and verify sync dispatch.
- Confirm VAPID cloud permission prompts display on scroll (70% viewport scroll) or elapsed timer engagement.
