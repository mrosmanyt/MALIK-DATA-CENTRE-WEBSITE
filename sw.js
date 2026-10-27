/* MALIK DATA CENTRE — Service Worker (offline + installable PWA) */
const CACHE = "mdc-cache-v21";
const ASSETS = [
  "./",
  "./index.html",
  "./index.css",
  "./promo.css",
  "./cart.css",
  "./ux.css",
  "./advanced.css",
  "./mobile.css",
  "./pages.css",
  "./theme.css",
  "./index.js",
  "./promo.js",
  "./cart.js",
  "./ux.js",
  "./advanced.js",
  "./store-backend.js",
  "./pages.js",
  "./tool-links.js",
  "./manifest.json",
  "./assets/logo.webp",
  "./assets/logo-96.png",
  "./assets/hero_banner.webp"
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
  // never cache live data or the admin panel (private, must always be fresh)
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/(api\/|admin|assets\/admin\/|data\/|blog\/p\/|sitemap-cms\.xml)/.test(url.pathname)) return;
  
  // Network-first for navigations, JS & CSS scripts to guarantee instant live updates
  if (req.mode === "navigate" || req.url.includes(".js") || req.url.includes(".css")) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
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
