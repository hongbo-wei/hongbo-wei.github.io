/**
 * Service Worker for Hongbo Wei Portfolio
 * Provides offline capability and caching
 */

const CACHE_NAME = 'hongbo-portfolio-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/experience.html',
    '/404.html',
    '/offline.html',
    '/assets/css/main.min.css',
    '/assets/css/critical.css',
    '/assets/js/app.min.js',
    '/assets/img/logo-black-circle.webp',
    '/assets/img/introduction-visual.webp',
    '/assets/img/favicon_io/favicon-32x32.png',
    '/assets/img/favicon_io/favicon-16x16.png',
    '/assets/img/favicon_io/apple-touch-icon.png'
];

// Install event - precache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching core assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (except CDN assets)
    if (url.origin !== self.location.origin && 
        !url.hostname.includes('clustrmaps.com')) {
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful navigation responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached page or offline page
                    return caches.match(request)
                        .then((cached) => cached || caches.match(OFFLINE_URL));
                })
        );
        return;
    }

    // Handle static assets - stale-while-revalidate
    event.respondWith(
        caches.match(request)
            .then((cached) => {
                const fetchPromise = fetch(request)
                    .then((response) => {
                        // Cache valid responses
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => cached);

                // Return cached version immediately, update in background
                return cached || fetchPromise;
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
