const CACHE_NAME = 'chronoquest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
];

// ✅ Install: Cache app shell
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// ✅ Activate: Take control immediately
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(self.clients.claim());
});

// ✅ Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
