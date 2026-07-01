const CACHE_NAME = 'theaskt-cache-v2';
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

/* ponytail: production-ready native PWA Service Worker caching and push rules */
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
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // Bypass cache rules for Studio CMS and Admin API requests
  if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/api/')) {
    return;
  }

  // HTML page requests: Network-First falling back to Cache or custom /offline page shell
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

  // Static Assets (CSS, JS, Fonts, Images): Cache-First
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

  // Stale-While-Revalidate for other fetch requests
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

// Update instance when SKIP_WAITING is received
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle FCM background pushes
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Opportunities Alert', body: event.data.text() };
    }
  }

  const title = data.title || 'New Opportunity Available';
  const options = {
    body: data.body || 'Open TheAskt to check details.',
    icon: '/next.svg',
    badge: '/next.svg',
    data: {
      clickUrl: data.clickUrl || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Deep link redirect on notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification.data?.clickUrl || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === clickUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickUrl);
      }
    })
  );
});
