// Basic service worker for offline caching and faster repeat visits
const CACHE_VERSION = "v6"; // bump to force clients to fetch latest CSS/HTML
const PRECACHE = `precache-${CACHE_VERSION}`;
const RUNTIME = `runtime-${CACHE_VERSION}`;

// Add core assets that are safe to cache aggressively
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/script.js",
  "/images/logo.png",
  "/services.html",
  "/rag-fine-tuning-explained.html",
  "/ai-resources.html",
  "/about.html",
  "/contact.html",
  "/kerry-generative-ai.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
      )
      .then((cachesToDelete) =>
        Promise.all(cachesToDelete.map((cacheName) => caches.delete(cacheName)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (
    url.origin === location.origin &&
    (request.mode === "navigate" || request.destination === "document")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (
    url.origin === location.origin &&
    (request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image")
  ) {
    event.respondWith(
      caches.open(RUNTIME).then((cache) =>
        cache.match(request).then((cachedResponse) => {
          const networkFetch = fetch(request)
            .then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cachedResponse);
          return cachedResponse || networkFetch;
        })
      )
    );
    return;
  }
});
