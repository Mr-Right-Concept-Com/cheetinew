// CheetiHost Service Worker for PWA support
// NOTE: bumped version to avoid mixed old/new cached assets causing React "Invalid hook call" crashes.
const CACHE_NAME = "cheetihost-v2";
const APP_SHELL_URLS = ["/", "/manifest.json", "/favicon.ico"]; 

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(APP_SHELL_URLS);
    }),
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Don't try to cache cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  const accept = event.request.headers.get("accept") || "";
  const isHtmlNavigation =
    event.request.mode === "navigate" || accept.includes("text/html");

  // Network-first for HTML/navigation to prevent serving an old index.html that references
  // newer JS chunks (or vice versa).
  if (isHtmlNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match("/");
        }),
    );
    return;
  }

  // Stale-while-revalidate for other same-origin assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          // Only cache successful basic responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Allow the app to trigger immediate activation (optional)
self.addEventListener("message", (event) => {
  if (event?.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
