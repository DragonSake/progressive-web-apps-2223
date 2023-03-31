self.addEventListener('install', function(event) { 
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open('v9').then(function(cache) {
            return cache.addAll([
                '/',
                './style/style.css',
                '/main.js',
                '/app.js',
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');

});

// // self.addEventListener("fetch", (e) => {
// //     console.log("[Service Worker] Fetching...")
// //     e.respondWith(
// //         caches.match(e.request)
// //             .then(cachedResponse => {

// //                 if (cachedResponse) return cachedResponse

// //                 return fetch(e.request)
// //                     .then(response => {
// //                         // If the request is not a GET request,
// //                         // OR if the request does not start with 'http'
// //                         // don't cache the response
// //                         if (e.request.method !== 'GET' || e.request.url.indexOf('http') !== 0) return response

// //                         // Cache the response
// //                         return caches.open(CACHE_NAME)
// //                             .then(cache => {
// //                                 cache.put(e.request, response.clone())
// //                                 return response
// //                             })
// //                     })

// //             })
// //     )
// // })