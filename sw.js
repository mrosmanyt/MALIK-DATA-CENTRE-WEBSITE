/* MALIK DATA CENTRE — Service Worker (offline + installable PWA) */
const CACHE = "mdc-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./index.css",
  "./effects.css",
  "./promo.css",
  "./cart.css",
  "./ux.css",
  "./advanced.css",
  "./mobile.css",
  "./index.js",
  "./effects.js",
  "./promo.js",
  "./cart.js",
  "./ux.js",
  "./advanced.js",
  "./store-backend.js",
  "./manifest.json",
  "./assets/logo.png",
  "./assets/hero_banner.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Network-first for navigations, cache-first for static assets
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached)
    )
  );
});
