var filesToCatch = [
    '/',
    '/index.html',
    '/besuchsbericht_erstellen.html',
    '/scripts/jquery-3.3.1.min.js',
    '/scripts/idb.js',
    '/scripts/main.js',
    '/scripts/capture.js',
    '/styles/main.css'

];

//var cacheName = 'pwa-v1';

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open('pwa-v1').then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(filesToCatch);
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});