/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

/**
 * Service Worker Install Event.
 * - Called when the service worker is first installed.
 * - self.skipWaiting() forces the waiting service worker to become active immediately.
 */
self.addEventListener("install", () => {
    self.skipWaiting();
});

/**
 * Service Worker Fetch Event.
 * - Intercepts all outgoing network requests.
 * - Tries to serve the request from the cache first.
 * - If not in cache, it performs a network fetch as fallback.
 */
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
