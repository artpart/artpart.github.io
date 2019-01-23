var filesToCatch = [
    '/',
    '/index.html',
    '/besuchsbericht_erstellen.html',
    '/jquery-3.3.1.min.js',
    '/scripts/main.js',
    '/styles/main.js'

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(filesToCatch);
        })
    );
});