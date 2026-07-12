const CACHE_NAME = 'training-handbook-v2';
const STATIC_FILES = ['./manifest.webmanifest', './icons/icon.svg'];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch('./', { cache: 'reload' });
  const html = await response.text();
  const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(match => new URL(match[1], self.registration.scope).href)
    .filter(url => url.startsWith(self.registration.scope));

  await cache.put('./', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
  await cache.put('./index.html', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
  await cache.addAll([...STATIC_FILES, ...new Set(assetPaths)]);
}

self.addEventListener('install', event => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
