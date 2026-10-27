// ภาพหน้าจอจริงบนหน้าเว็บ (B65) + ด่านล้นจอทุกหน้า — เปิด play.html / isekai.html แล้วกดจนถึงฉาก ถ่ายเฉพาะการ์ดเป็น webp ลง docs/img/
// เวลาและ Math.random ในหน้าถูกตรึง ⇒ seed ชีวิตกับทางที่กดเหมือนเดิมทุกรอบ ภาพจึงเปลี่ยนเฉพาะเมื่อเกมเปลี่ยน
// ต้องมี playwright-core + Chromium ในเครื่อง (ไม่อยู่ใน dependencies ของเกม):
//   npm i -g playwright-core && npx playwright install chromium   หรือ ตั้ง PW_CORE=<โฟลเดอร์ playwright-core> PW_EXE=<chrome.exe>
// ใช้: node scripts/shots.mjs            ถ่ายภาพ + ตรวจล้น
//      node scripts/shots.mjs --check    ตรวจล้น/console error อย่างเดียว ไม่เขียนภาพ
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
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
const checkOnly = process.argv.includes('--check');
const MAX_KB = 120;

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

// กดปุ่มที่เปิดอยู่ (ปุ่มแรกที่ตรง prefer ก่อน ไม่งั้นสุ่มจาก Math.random ที่ตรึงไว้) จน until(หน้า) เป็นจริง
async function playUntil(page, until, { prefer = null, max = 4000 } = {}) {
  for (let i = 0; i < max; i++) {
    if (typeof until === 'string' ? await page.evaluate((src) => new RegExp(src).test(document.body.innerText), until) : await page.evaluate(until)) return true;
    const ok = await page.evaluate((prefer) => {
      const b = [...document.querySelectorAll('button')].filter((x) => !x.disabled && x.offsetParent && !x.closest('header, details, .share'));
      if (!b.length) return false;
      const want = prefer && b.find((x) => prefer.some((p) => x.textContent.includes(p)));
      (want ?? b[Math.floor(Math.random() * b.length)]).click();
      return true;
    }, prefer);
    if (!ok) await page.waitForTimeout(20);
  }
  return false;
}

async function shot(page, selector, name) {
  const el = await page.$(selector);
  if (!el) throw new Error(`${name}: ไม่เจอ ${selector}`);
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'webp', quality: 72, captureBeyondViewport: true, clip: { x: box.x, y: box.y + (await page.evaluate(() => scrollY)), width: box.width, height: Math.min(box.height, 1600), scale: 1 } });
  const file = new URL(`img/${name}.webp`, docs);
  writeFileSync(file, Buffer.from(data, 'base64'));
  const kb = Math.round(statSync(file).size / 1024);
  console.log(`docs/img/${name}.webp ${Math.round(box.width)}×${Math.round(Math.min(box.height, 1600))} ${kb} KB`);
  if (kb > MAX_KB) { console.log(`  ใหญ่เกิน ${MAX_KB} KB → ตก`); fail++; }
}


if (!checkOnly) {
  mkdirSync(new URL('img/', docs), { recursive: true });
  // ชาติไทย: การ์ดเกิด → การ์ดเลือก (≥3 ทาง) → การ์ดตาย → ปรโลก
  const { page, errors } = await open('play.html', 390);
  await page.waitForSelector('article.card');
  await shot(page, 'article.card', 'thai-birth');
  const choice = () => {
    const c = document.querySelector('article.card');
    const n = c ? c.querySelectorAll('.choices button:not([disabled])').length : 0;
    return n >= 4 && !/เปิดชีวิต|ลืมตาดูโลก/.test(c.innerText);
  };
  if (!(await playUntil(page, choice))) throw new Error('ไม่เจอการ์ดเลือก');
  await shot(page, 'article.card', 'thai-choice');
  if (!(await playUntil(page, 'ไปช่วงระหว่างชาติ'))) throw new Error('ไม่ถึงการ์ดตาย');
  await shot(page, 'article.card', 'thai-death');
  if (!(await playUntil(page, 'บัญชีบุญบาป เฉลยที่ปรโลก', { prefer: ['ไปช่วงระหว่างชาติ'] }))) throw new Error('ไม่ถึงปรโลก');
  await shot(page, 'article.card', 'thai-afterlife');
  if (errors.length) { console.log(`play.html console error ${errors.length}: ${errors.slice(0, 3).join(' | ')} → ตก`); fail++; }
  await page.close();

  // ต่างโลก (เกมสั้น): เลือกบทบาท → การ์ดเหตุการณ์
  const iso = await open('isekai.html', 390);
  const roles = 'เกิดเป็นสไลม์|สโลว์ไลฟ์ชายป่า';
  if (!(await playUntil(iso.page, roles, { max: 60 }))) throw new Error('isekai: ไม่เจอการ์ดเลือกบทบาท');
  await shot(iso.page, 'main', 'otherworld-role');
  const event = () => !/เกิดเป็นสไลม์|สโลว์ไลฟ์ชายป่า|ใช้ให้คุ้ม/.test(document.body.innerText) && document.querySelectorAll('main button:not([disabled])').length >= 2;
  if (!(await playUntil(iso.page, event, { max: 60 }))) throw new Error('isekai: ไม่เจอการ์ดเหตุการณ์');
  await shot(iso.page, 'main', 'otherworld-event');
  if (iso.errors.length) { console.log(`isekai.html console error ${iso.errors.length} → ตก`); fail++; }
  await iso.page.close();
}

// ทุกหน้าเว็บ 390/1280: ล้นแนวนอน 0 · console error 0
for (const p of ['index', 'about', 'overview', 'otherworld', 'catalog', 'cards', 'whatsnew', 'spec']) {
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
