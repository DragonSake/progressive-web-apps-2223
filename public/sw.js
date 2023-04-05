const CACHE_NAME = 'cash';

self.addEventListener('install', function(event) { 
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                '/',
                '/images/bg.png',
                '/images/icon-192x192.png',
                '/images/q.png',
                '/manifest.json',
                '/style/style.css',
                '/scripts/main.js',
                '/offline'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    // Delete old caches except the current one
                    return cacheName.startsWith('cash-') && cacheName !== CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Add a listener for fetch events
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching...");

  // Respond to the fetch event with a cached or network response
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If the request is in the cache, return it
        // and update the cache with a network response in the background
        const fetchPromise = fetch(event.request)
        .then((fetchedResponse) => {
          // Make a copy of the network response to save in the cache
          const cacheCopy = fetchedResponse.clone();
          // Open the cache and add the network response
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          // Return the network response
          return fetchedResponse;
        });
        // Return the cached response or the network response
        return cachedResponse || fetchPromise;
      } else {
        // If the request is not in the cache, fetch it from the network
        // and add it to the cache
        return fetch(event.request)
          .then((fetchedResponse) => {
            // Make a copy of the network response to save in the cache
            const cacheCopy = fetchedResponse.clone();
            // Open the cache and add the network response
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
            // Return the network response
            return fetchedResponse;
          })
          .catch(() => {
            // If the network fetch fails, return an offline fallback page
            return caches.match("/offline");
          });
      }
    })
  );
});

