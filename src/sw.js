/* eslint-disable no-restricted-globals */
const cacheName = 'hello-pwa';
const filesToCache = [
  '/todo/',
  '/todo/index.html',
  '/todo/css/style.css',
  '/todo/main.js',
];

console.log('SW running');

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache).catch((err) => console.error(err));
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', (e) => {
  e.respondWith(

    caches.match(e.request).then(() => {
      // todo add caches logic here
      return fetch(e.request);
    })
  );
});
