// ด่านล้นจอทุกหน้าเว็บ (B65) — เปิดทุกหน้าที่ 390/1280 นับล้นแนวนอนและ console error
// ภาพจอเกม (ui-redo 45): กดเล่น play.html ถึงจอเริ่ม · กลางชีวิต · ตาย แล้วถ่ายลง docs/dev/shots/ ตามชื่อ UI_SHOTS ของหน้าดีไซน์ UI
// ⇒ ถ่ายแล้วต้อง npm run build ให้ dev/ui.html ขึ้นภาพ (site:check 7e จับหน้าค้าง) · เลนที่แก้จอเกมรันแล้ว commit ภาพ
// ภาพในหน้าเว็บที่เหลือ (otherworld-birth · otherworld-event) ถ่ายนอกสคริปต์นี้ · ภาพการ์ดชาติไทยเลิกใช้ตั้งแต่หน้าแรกไม่มีภาพ
// เวลาและ Math.random ในหน้าถูกตรึง ⇒ ผลเหมือนเดิมทุกรอบ เปลี่ยนเฉพาะเมื่อหน้าเปลี่ยน
// ต้องมี playwright-core + Chromium ในเครื่อง (ไม่อยู่ใน dependencies ของเกม):
//   npm i -g playwright-core && npx playwright install chromium   หรือ ตั้ง PW_CORE=<โฟลเดอร์ playwright-core> PW_EXE=<chrome.exe>
// ใช้: node scripts/shots.mjs  · --check = ตรวจอย่างเดียว ไม่เขียนภาพ (ด่านของเลนไม่ทำให้ working tree เปลี่ยน)
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { UI_SHOTS_AT, UI_SHOT_W } from '../src/site/ui.mjs';

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
// clock = เวลาเดินด้วย page.clock แทน — หน้าเล่นมีตัวกันคลิกรอแอนิเมชันจบ (fxGate) เวลานิ่งที่ 0 จะกดอะไรไม่ได้เลย
const freeze = ({ seed, clock }) => {
  let a = seed >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  if (!clock) {
    const t0 = 1767225600000;
    Date.now = () => t0;
    performance.now = () => 0;
  } else {
    // performance.now ของ page.clock ยังนับเวลาจริงช่วงโหลดหน้าปนมา (ต่างกันรอบละไม่กี่ ms) ⇒ อิง Date.now ที่หยุดไว้แทน
    const d0 = Date.now();
    performance.now = () => Date.now() - d0;
  }
  try { localStorage.clear(); } catch {}
};

const browser = await pw.chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});
let fail = 0;

async function open(file, width, seed = 7) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(freeze, { seed });
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
// จอเกม: กดปุ่มแรกของการ์ดไปเรื่อย ๆ (ปุ่มเลข 1 ก่อน — ไม่กด "พับไว้ก่อน" ที่เปิดแผงสถานะ) จนถึงการ์ดตาย
// reduced-motion ⇒ ไม่มีแอนิเมชันค้างครึ่งทางในภาพ · แผ่นอัปเดตล่าสุดปิดด้วย Escape แบบผู้เล่น (เนื้อแผ่นเปลี่ยนทุกรุ่น ภาพจะเปลี่ยนตาม)
// ทั้ง 3 จอมาจากชีวิตเดียวกัน · ชีวิตจากไปก่อนถึงกลางชีวิต = เลื่อนเวลาเริ่ม (seed ชีวิตใหม่) แล้วเล่นใหม่ · ทุกขนาดใช้เวลาเริ่มชุดเดียวกัน
const isShot = {
  start: (s) => s.kicker === 'เปิดชีวิต',
  mid: (s) => s.thai && s.keys && s.age >= 30,
  death: (s) => s.mem,
};
const T0 = 1767225600000;
const LIVES = 10;
async function playLife(w, t) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  // install อย่างเดียวเวลายังเดินตามนาฬิกาจริง ⇒ seed ชีวิต (Date.now ^ performance.now) ต่างทุกรอบ · pauseAt หยุดไว้ เดินเฉพาะ runFor
  await page.clock.install({ time: t });
  await page.clock.pauseAt(t + 1000);
  await page.addInitScript(freeze, { seed: 7, clock: true });
  await page.goto(pageUrl('play.html'));
  await page.clock.runFor(2000);
  if (await page.locator('.sheet').count()) {
    await page.keyboard.press('Escape');
    await page.clock.runFor(1000);
  }
  const got = {};
  for (let i = 0; i < 400 && !got.death; i++) {
    const s = await page.evaluate(() => {
      const c = document.querySelector('#app > .card');
      return {
        kicker: c?.querySelector('.kicker')?.textContent ?? '',
        thai: !!c && !c.matches('.i, .mem, .b'),
        mem: !!c?.matches('.mem'),
        keys: !!c?.querySelector('.choices [data-key]'),
        age: Number(document.querySelector('.sb-age b')?.textContent ?? -1),
      };
    });
    for (const id of Object.keys(isShot)) {
      if (got[id] || !isShot[id](s)) continue;
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      got[id] = { over, png: await page.screenshot({ animations: 'disabled' }) };
    }
    if (got.death) break;
    // การ์ดที่ปุ่มยังปิดอยู่ (รอเวลา/แอนิเมชัน) ⇒ เดินเวลาต่อแทนการกด
    const b = page.locator('#app > .card .choices button:not([disabled])');
    const one = b.and(page.locator('[data-key="1"]'));
    if (await one.count()) await one.click();
    else if (await b.count()) await b.first().click();
    await page.clock.runFor(2000);
  }
  // ผ่านการ์ดตายไปปรโลกอีกใบ — ด่าน console จับหน้าที่พังหลังตาย (ฉากปรโลก/ต่างโลกเรียกโค้ดคนละชุด)
  if (got.death) {
    await page.locator('#app > .card .choices button:not([disabled])').first().click();
    await page.clock.runFor(2000);
  }
  await ctx.close();
  return { got, errors };
}
const write = !process.argv.includes('--check');
const shotDir = new URL(UI_SHOTS_AT, docs);
if (write) mkdirSync(shotDir, { recursive: true });
let life = null;
for (const w of UI_SHOT_W) {
  let r;
  for (let n = life ?? 0; n < (life ?? LIVES - 1) + 1; n++) {
    r = await playLife(w, T0 + n * 60000);
    if (r.errors.length || Object.keys(isShot).every((id) => r.got[id])) {
      life ??= n;
      break;
    }
  }
  const miss = Object.keys(isShot).filter((id) => !r.got[id]);
  for (const [id, x] of Object.entries(r.got)) {
    if (x.over > 0) fail++;
    console.log(`play.html ${id} @${w}: ล้น ${Math.max(0, x.over)}px${x.over > 0 ? ' → ตก' : ''}`);
    if (write && !miss.length) writeFileSync(new URL(`${id}-${w}.png`, shotDir), x.png);
  }
  if (miss.length || r.errors.length) fail++;
  console.log(`play.html @${w}: ชีวิตที่ ${(life ?? LIVES - 1) + 1} · error ${r.errors.length}${r.errors.length ? ` (${r.errors[0].slice(0, 120)}) → ตก` : ''}${miss.length ? ` · ไม่ถึงจอ ${miss.join(' ')} → ตก` : ''}`);
}
if (write) console.log(`ภาพจอเกมอยู่ docs/${UI_SHOTS_AT} — npm run build ให้หน้าดีไซน์ UI ขึ้นภาพ`);
await browser.close();
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
