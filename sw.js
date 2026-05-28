const CACHE_NAME = "visitor-management-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js"
];

// Install Service Worker
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })

  );

});

// Fetch Cached Files
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});