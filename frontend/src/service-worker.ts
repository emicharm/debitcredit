/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

// Update version to force cache refresh when corrupted
const CACHE_VERSION = 'v2';
const CACHE_NAME = `debitcredit-${CACHE_VERSION}`;

// Install event - skip waiting
sw.addEventListener('install', (event) => {
    event.waitUntil(sw.skipWaiting());
});

// Activate event - claim clients and clean old caches
sw.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all([
                // Delete all old caches
                ...cacheNames
                    .filter((cacheName) => cacheName.startsWith('debitcredit-') && cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName)),
                // Claim clients
                sw.clients.claim()
            ]);
        })
    );
});

// Fetch event - network first, then cache
sw.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Skip caching for service worker itself to prevent issues
    if (url.pathname.includes('service-worker')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Only cache successful responses
                if (response.ok && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone).catch(() => {
                            // Silently fail cache put errors
                        });
                    });
                }
                return response;
            })
            .catch(async () => {
                // Try to get from cache on network error
                const cached = await caches.match(event.request);
                if (cached) {
                    return cached;
                }

                // For navigation requests, try to return the app shell
                if (event.request.mode === 'navigate') {
                    const appShell = await caches.match('/');
                    if (appShell) return appShell;
                }

                // Return offline response
                return new Response('Offline - Please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

