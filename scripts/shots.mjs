// ด่านล้นจอทุกหน้าเว็บ (B65) — เปิดทุกหน้าที่ 390/1280 นับล้นแนวนอนและ console error
// ภาพในหน้าเว็บที่เหลือ (otherworld-birth · otherworld-event) ถ่ายนอกสคริปต์นี้ · ภาพการ์ดชาติไทยเลิกใช้ตั้งแต่หน้าแรกไม่มีภาพ
// เวลาและ Math.random ในหน้าถูกตรึง ⇒ ผลเหมือนเดิมทุกรอบ เปลี่ยนเฉพาะเมื่อหน้าเปลี่ยน
// ต้องมี playwright-core + Chromium ในเครื่อง (ไม่อยู่ใน dependencies ของเกม):
//   npm i -g playwright-core && npx playwright install chromium   หรือ ตั้ง PW_CORE=<โฟลเดอร์ playwright-core> PW_EXE=<chrome.exe>
// ใช้: node scripts/shots.mjs  (รับ --check ไว้เข้ากับคำสั่งเดิม ผลเหมือนกัน)
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require(process.env.PW_CORE ?? 'playwright-core');
} catch {
  console.error('ไม่พบ playwright-core — ติดตั้งตามหัวไฟล์ scripts/shots.mjs หรือตั้ง PW_CORE');
  process.exit(2);
}
const docs = new URL('../docs/', import.meta.url);
const pageUrl = (p) => new URL(p, docs).href;

// ตรึงเวลา + สุ่มของหน้า (mulberry32) ก่อนสคริปต์เกมรัน · localStorage ว่างทุกครั้ง (ไม่มีการ์ดเล่นต่อ)
const freeze = (seed) => {
  let a = seed >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const t0 = 1767225600000;
  Date.now = () => t0;
  performance.now = () => 0;
  try { localStorage.clear(); } catch {}
};

const browser = await pw.chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});
let fail = 0;

async function open(file, width, seed = 7) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(freeze, seed);
  await page.goto(pageUrl(file));
  return { page, errors };
}

// ทุกหน้าเว็บ 390/1280: ล้นแนวนอน 0 · console error 0
for (const p of ['index', 'about', 'worlds', 'otherworld', 'catalog', 'cards', 'whatsnew', 'guide']) {
  for (const w of [390, 1280]) {
    const { page, errors } = await open(`${p}.html`, w);
    await page.waitForLoadState('load');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const bad = over > 0 || errors.length;
    if (bad) fail++;
    console.log(`${p}.html @${w}: ล้น ${Math.max(0, over)}px · error ${errors.length}${bad ? ' → ตก' : ''}`);
    await page.close();
  }
}
await browser.close();
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
