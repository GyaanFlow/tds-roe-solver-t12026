const CACHE_NAME = 'tds-portal-v18';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/tds-config.json',
  // CDNs
  'https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/seedrandom.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js'
];

// Install Event - Immediately take control
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching core assets');
      return cache.addAll(CORE_ASSETS).catch(err => console.warn('[ServiceWorker] Pre-cache warning:', err));
    })
  );
});

// Activate Event - Clean up all old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Strict Network-First Strategy for JS/HTML/CSS (no stale cache)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests and non-http/https
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Ignore analytics and Vercel toolbar/system routes
  if (url.hostname.includes('vercel-insights') || url.pathname.startsWith('/_vercel')) {
    return;
  }

  // For application code (.js, .html, .css, local API/solvers), force no-cache fetch
  const isAppCode = url.origin === location.origin || url.pathname.endsWith('.js') || url.pathname.endsWith('.html') || url.pathname.endsWith('.css');

  event.respondWith(
    fetch(isAppCode ? new Request(event.request, { cache: 'no-cache' }) : event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fall back to cache when offline
        return caches.match(event.request);
      })
  );
});
