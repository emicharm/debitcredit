/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'debitcredit-v1';

// Install event - skip waiting
sw.addEventListener('install', (event) => {
    event.waitUntil(sw.skipWaiting());
});

// Activate event - claim clients
sw.addEventListener('activate', (event) => {
    event.waitUntil(sw.clients.claim());
});

// Fetch event - network first, then cache
sw.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone).catch(() => {});
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then(cached => {
                    return cached || new Response('Offline', { status: 503 });
                });
            })
    );
});

