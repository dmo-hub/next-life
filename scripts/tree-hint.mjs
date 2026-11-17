// ด่านคำใบ้กำแพงโลกบนผังตระกูล (โลกซ้อนทับ ใบ 11): คำตามขั้น 1/2/3 · ขั้น 0 ไม่มีบรรทัด · ไม่มีตัวเลขในคำใบ้
// ครบ 3 จุดที่วาดผังตระกูล (การ์ดจบปรโลก · การ์ดแรกเกิดรุ่นถัดไป · แผงครอบครัว) · จอ 390/1280 ไม่ล้น · error 0
// ขั้นต้องเดินข้ามโลกจริงถึงจะสูง ซึ่งกดผ่านหน้าเว็บไม่ไหว ⇒ ตัดตัวอ่านขั้นในบันเดิลให้อ่านจาก localStorage แทน
// (ไม่ผูกเลขเกณฑ์ใน life.mjs — เกณฑ์เปลี่ยนด่านนี้ไม่ต้องแก้)
// ต้องมี playwright-core + Chromium (ดูหัว scripts/shots.mjs) · ใช้: node scripts/tree-hint.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { GATE_KEY, readGateHash } from '../src/site/gate.mjs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require(process.env.PW_CORE ?? 'playwright-core');
} catch {
  console.error('ไม่พบ playwright-core — ติดตั้งตามหัวไฟล์ scripts/shots.mjs หรือตั้ง PW_CORE');
  process.exit(2);
}
const WORDS = { 1: 'ม่านระหว่างโลก: บาง', 2: 'ม่านระหว่างโลก: ขาด', 3: 'ม่านระหว่างโลก: ฉีกกว้าง' };
const ANY = 'ม่านระหว่างโลก';
const STAGE_DEF = 'const overlapStageOf = (st) => OVERLAP_STAGE_MIN.findLastIndex((min) => overlapOf(st) >= min);';
const docs = new URL('../docs/', import.meta.url);
const bundle = readFileSync(new URL('play.js', docs), 'utf8');
if (!bundle.includes(STAGE_DEF)) {
  console.error('ไม่พบนิยาม overlapStageOf ในบันเดิล — แก้ STAGE_DEF ให้ตรง src/engine/life.mjs');
  process.exit(1);
}
const js = bundle.replace(STAGE_DEF, 'const overlapStageOf = () => Number(localStorage.getItem("__stage") || 0);');
const gate = [GATE_KEY, String(readGateHash())];
const browser = await pw.chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});
const btn = (page, name) => page.locator('#app > .card .choices button', { hasText: name }).first();
const body = (page) => page.locator('body').innerText();
const over = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
const veilLines = (t) => t.split('\n').filter((l) => l.includes(ANY));

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
for (const stage of [0, 1, 2, 3]) {
  const want = WORDS[stage] ?? null;
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/play.js*', (r) => r.fulfill({ contentType: 'text/javascript', body: js }));
  await page.addInitScript(([g, s]) => { sessionStorage.setItem(...g); localStorage.setItem('__stage', s); }, [gate, String(stage)]);
  await page.goto(new URL('play.html', docs).href);
  await page.waitForTimeout(1200);
  if (await page.locator('.sheet').count()) await page.keyboard.press('Escape');
  const reached = await playToEnd(page);
  const seen = {};
  let worst = await over(page);
  seen.endCard = veilLines(await body(page));
  if (reached) {
    await btn(page, 'ไปเกิด').click();
    await page.waitForTimeout(800);
    seen.birth = veilLines(await body(page));
    worst = Math.max(worst, await over(page));
    await page.locator('.mnav button', { hasText: 'ครอบครัว' }).first().click().catch(() => {});
    await page.waitForTimeout(500);
    // แผงทับการ์ดเดิมที่ยังอยู่ใต้ ⇒ อ่านเฉพาะแผง ไม่งั้นนับคำใบ้ของการ์ดซ้ำ
    seen.panel = veilLines(await page.locator('.sheet').first().innerText().catch(() => ''));
    for (const w of [390, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(300);
      worst = Math.max(worst, await over(page));
    }
  }
  await page.close();
  const bad = [];
  if (!reached) bad.push('เล่นไม่ถึงการ์ดจบ');
  for (const [k, lines] of Object.entries(seen)) {
    const ok = want ? lines.length === 1 && lines[0].trim() === want : lines.length === 0;
    if (!ok) bad.push(`${k}=${JSON.stringify(lines)}`);
  }
  if (Object.values(seen).flat().some((l) => /\d/.test(l))) bad.push('คำใบ้มีตัวเลข');
  if (worst > 0) bad.push(`ล้น ${worst}px`);
  if (errors.length) bad.push(`error ${errors.length}`);
  if (bad.length) fail++;
  console.log(`ขั้น ${stage}: ${Object.entries(seen).map(([k, l]) => `${k} ${l.length ? l.join('/').trim() : '-'}`).join(' · ')} · ล้น ${worst}px · error ${errors.length}${bad.length ? ` ⇒ ตก (${bad.join('; ')})` : ''}`);
}
await browser.close();
console.log(fail ? 'ตก' : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
