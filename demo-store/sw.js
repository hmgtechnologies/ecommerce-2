/* ============================================================================
 * HMG StoreForge v2 — Service Worker (PWA offline support)
 * Caches the app shell so the store loads instantly and works offline-ish.
 * Product data (Supabase/JSON) is always fetched fresh (network-first).
 * ==========================================================================*/
const CACHE = "storeforge-v8";
const SHELL = [
  "./", "./index.html", "./track.html",
  "./assets/css/style.css", "./assets/css/extras.css",
  "./assets/js/config.js", "./assets/js/analytics.js", "./assets/js/i18n.js",
  "./assets/js/store.js", "./assets/js/store-extras.js", "./assets/js/store-extras2.js",
  "./assets/js/store-extras3.js", "./assets/js/store-extras4.js", "./assets/js/store-extras5.js",
  "./assets/js/store-extras6.js", "./assets/js/store-extras7.js", "./assets/js/marketplace.js",
  "./assets/js/products-fallback.js", "./products.json",
  "./assets/images/logo.png", "./assets/images/placeholder.png",
  "./assets/images/hero.jpg", "./assets/images/favicon.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Network-first for product data (always fresh)
  if (url.pathname.endsWith("products.json") || url.href.includes("/rest/v1/")) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }
  // Cache-first for the app shell / assets
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      if (res.ok && url.origin === location.origin) caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
