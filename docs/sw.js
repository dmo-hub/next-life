// build สร้าง (src/site/play-files.mjs) — ห้ามแก้มือ
const CACHE = "nl-v0.6.107";
const CORE = ["play.html","play-data.js?v=v0.6.107","play.js?v=v0.6.107","favicon.svg","fonts/Sarabun-Regular.woff2","fonts/Sarabun-SemiBold.woff2","fonts/Srisakdi-Bold.woff2","fonts/Maitree-SemiBold.woff2"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('nl-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
const keep = (req, res) => {
  if (res.ok && res.type === 'basic') {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // หน้าเล่นมี ?seed= ของลิงก์เพื่อน — เก็บและหาโดยไม่สนพารามิเตอร์ แคชจึงไม่งอกตาม seed
    e.respondWith(fetch(req).then((res) => keep(req.url.split('?')[0], res)).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || Response.error())));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => keep(req, res));
    if (hit) {
      e.waitUntil(net.catch(() => {}));
      return hit;
    }
    return net;
  }));
});
