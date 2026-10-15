const CACHE_NAME = 'codeva-zahabad-card-v6';
const ASSETS = [
    '/',
    '/styles.css?v=6',
    '/script.js?v=6',
    '/logo-codeva.png',
    '/icon-192.png',
    '/icon-512.png',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    // No bloquea la instalación si algún recurso falla
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(ASSETS.map((url) => cache.add(url)))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

// Red primero para todo (nunca sirve HTML/CSS/JS viejo si hay conexión);
// el caché solo entra cuando no hay red.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    event.respondWith(
        fetch(req).then((res) => {
            if (res.ok) {
                const copy = res.clone();
                const key = req.mode === 'navigate' ? '/' : req;
                caches.open(CACHE_NAME).then((c) => c.put(key, copy));
            }
            return res;
        }).catch(() =>
            caches.match(req.mode === 'navigate' ? '/' : req).then((r) => r || Response.error())
        )
    );
});
