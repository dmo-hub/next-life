// ด่านป้ายเตือนล้างตระกูล (โลกซ้อนทับ ใบ 10): ตระกูลค่าซ้อนทับ > 0 ต้องเห็นบรรทัดเตือนครบทุกทางที่ล้างตระกูล
// (ปุ่มเริ่มตระกูลใหม่ · ลิงก์เพื่อน · การ์ดจบปรโลก) · ค่า 0 ต้องไม่มีบรรทัดนั้น และไม่ล้นจอ 390 · error 0
// ค่าซ้อนทับต้องเดินข้ามโลกจริงถึงจะ > 0 ซึ่งกดผ่านหน้าเว็บไม่ไหว ⇒ ตัดตัวอ่านค่าในบันเดิลให้อ่านจาก localStorage แทน
// ต้องมี playwright-core + Chromium (ดูหัว scripts/shots.mjs) · ใช้: node scripts/reset-warn.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { GATE_KEY, readGateHash } from '../src/site/gate.mjs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require(process.env.PW_CORE ?? 'playwright-core');
} catch {
  console.error('ไม่พบ playwright-core — ติดตั้งตามหัวไฟล์ scripts/shots.mjs หรือตั้ง PW_CORE');
  process.exit(2);
}
const WARN = 'โลกที่บางลงจะหายไปด้วย';
const OV_DEF = "const overlapOf = (st) => (dlcOpen(st, 'overlap') ? st?.overlap ?? 0 : 0);";
const docs = new URL('../docs/', import.meta.url);
const bundle = readFileSync(new URL('play.js', docs), 'utf8');
if (!bundle.includes(OV_DEF)) {
  console.error('ไม่พบนิยาม overlapOf ในบันเดิล — แก้ OV_DEF ให้ตรง src/engine/life.mjs');
  process.exit(1);
}
const js = bundle.replace(OV_DEF, 'const overlapOf = () => Number(localStorage.getItem("__ov") || 0);');
const gate = [GATE_KEY, String(readGateHash())];
const browser = await pw.chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});

async function open(ov, query = '') {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  page.errors = [];
  page.on('console', (m) => m.type() === 'error' && page.errors.push(m.text()));
  page.on('pageerror', (e) => page.errors.push(String(e)));
  await page.route('**/play.js*', (r) => r.fulfill({ contentType: 'text/javascript', body: js }));
  await page.addInitScript(([g, v]) => { sessionStorage.setItem(...g); localStorage.setItem('__ov', v); }, [gate, ov]);
  await page.goto(new URL(`play.html${query}`, docs).href);
  await page.waitForTimeout(1200);
  if (await page.locator('.sheet').count()) await page.keyboard.press('Escape');
  return page;
}
const text = (page, sel) => page.locator(sel).allInnerTexts().then((a) => a.join('\n'));
const btn = (page, name) => page.locator('#app > .card .choices button', { hasText: name }).first();

// เล่นถึงการ์ดจบปรโลก (ปุ่ม "ไปเกิด" คู่ "เริ่มตระกูลใหม่") · คืน false ถ้าเกินจำนวนก้าว
async function playToEnd(page) {
  for (let i = 0; i < 900; i++) {
    if ((await btn(page, 'ไปเกิด').count()) && (await btn(page, 'เริ่มตระกูลใหม่').count())) return true;
    const b = page.locator('#app > .card .choices button:not([disabled])').first();
    if (!(await b.count())) { await page.waitForTimeout(250); continue; }
    await b.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(120);
  }
  return false;
}

let fail = 0;
for (const ov of ['0', '2']) {
  const want = ov !== '0';
  const seen = {};
  // ทางที่ 1+3: ปุ่มเริ่มตระกูลใหม่หน้าเล่นต่อ (ชาติประจำวันใช้ confirmNew ตัวเดียวกัน)
  let page = await open(ov);
  await playToEnd(page);
  seen.endCard = (await text(page, '#app > .card .note')).includes(WARN);
  let over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await page.reload();
  await page.waitForTimeout(1200);
  if (await page.locator('.sheet').count()) await page.keyboard.press('Escape');
  await btn(page, 'เริ่มตระกูลใหม่').click();
  await page.waitForTimeout(400);
  seen.confirm = (await text(page, '#app > .card .body')).includes(WARN);
  over = Math.max(over, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  const errors = [...page.errors];
  await page.close();
  // ทางที่ 2: ลิงก์เพื่อนตอนมีตระกูลค้าง
  page = await open(ov);
  await playToEnd(page);
  await page.goto(new URL('play.html?seed=12345', docs).href);
  await page.waitForTimeout(1200);
  if (await page.locator('.sheet').count()) await page.keyboard.press('Escape');
  seen.link = (await text(page, '#app > .card .body')).includes(WARN);
  over = Math.max(over, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  errors.push(...page.errors);
  await page.close();
  const bad = Object.entries(seen).filter(([, v]) => v !== want).map(([k]) => k);
  if (bad.length || over > 0 || errors.length) fail++;
  console.log(`ค่าซ้อนทับ ${ov}: ${Object.entries(seen).map(([k, v]) => `${k} ${v ? 'มีบรรทัด' : 'ไม่มี'}`).join(' · ')} · ล้น ${over}px · error ${errors.length}${bad.length ? ` ⇒ ตก (${bad.join(',')})` : ''}`);
}
await browser.close();
console.log(fail ? 'ตก' : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
