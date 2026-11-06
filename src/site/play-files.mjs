// ไฟล์ของหน้าเล่นที่ build เขียน (ui-redo 96 · ข้อ 203 204): ชื่อคงที่ เปลี่ยนรุ่นแค่ ?v= — docs/ ไม่มีไฟล์ชื่อ hash ค้าง และสอง branch merge แล้วได้ชื่อเดียวกัน
// ทุกไฟล์ในนี้ใส่ .gitattributes merge=build (site-check ตรวจ)
export const PLAY_FILES = { data: 'play-data.js', app: 'play.js', sw: 'sw.js' };

const q = (version) => `?v=${encodeURIComponent(version)}`;
export const playAssets = (version) => [`${PLAY_FILES.data}${q(version)}`, `${PLAY_FILES.app}${q(version)}`];

// defer: สคริปต์รันตามลำดับหลังอ่าน HTML จบ ⇒ หัว + โครงหน้าเปิดขึ้นจอก่อน · ข้อมูลต้องมาก่อนโค้ด
// service worker เฉพาะ http(s) — เปิดไฟล์ตรงจากเครื่อง (file://) ลงทะเบียนไม่ได้ และ harness/smoke เปิดแบบนั้น
export const playScripts = (version) =>
  `${playAssets(version).map((src) => `<script src="${src}" defer></script>`).join('\n')}\n` +
  `<script>if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) addEventListener('load', () => navigator.serviceWorker.register('${PLAY_FILES.sw}').catch(() => {}));</script>`;

// เล่นออฟไลน์หลังเปิดครั้งแรก (ข้อ 203): ติดตั้งแล้วเก็บหน้าเล่น + ข้อมูล + สคริปต์ + ฟอนต์ของรุ่นนี้ไว้ก่อน
// หน้า (navigate) ขอเน็ตก่อน ไม่ได้จึงใช้ของในแคช — ผู้เล่นออนไลน์ได้หน้ารุ่นล่าสุดเสมอ
// ไฟล์อื่นตอบจากแคชทันทีแล้วขอของใหม่เก็บไว้เบื้องหลัง — รุ่นเดียวกันแต่ build ใหม่ (ยังไม่ bump) ได้ของใหม่ในการเปิดครั้งถัดไป
// แคชชื่อตามรุ่น: รุ่นใหม่ติดตั้งแล้วลบแคชรุ่นเก่า
export function swJs(version, fonts) {
  const core = ['play.html', ...playAssets(version), 'favicon.svg', ...fonts];
  return `// build สร้าง (src/site/play-files.mjs) — ห้ามแก้มือ
const CACHE = ${JSON.stringify(`nl-${version}`)};
const CORE = ${JSON.stringify(core)};
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
`;
}
