// ด่าน keep (reigns-13): อัปเดตห้ามล้างของที่ผู้เล่นสะสม — เทียบกับฐานของเวอร์ชันที่ปล่อยล่าสุด (harness/keep-ids.json · harness/fixtures/keep-snaps.json)
// ก. id ที่ของสะสมในเครื่องผู้เล่นอ้าง ห้ามหาย: ฉายา · ฉายาตระกูล (สมุดฉายา) · ช่องภาพ + เหตุการณ์ยุค (สมุดภาพ · อนุสรณ์)
//    + การ์ดที่ถูกอ้าง (ผลย้อน schedules · การ์ดต่อ next · การ์ดที่ปลดภาพ) — คำนวณจากเนื้อหาตอนรัน · การ์ดอื่นหาย = เตือนพร้อมชื่อ ไม่ตก
// ข. ชื่อ key ที่เก็บในเครื่องผู้เล่น (localStorage ใน src/ui/app.mjs) ห้ามหาย — เปลี่ยนชื่อ key = ของใน key นั้นหายทั้งก้อน
// ค. เซฟภาพถ่ายของเวอร์ชันฐาน โหลดด้วยแกนปัจจุบัน (restore → repairLife แบบหน้าเว็บ) แล้วเล่นต่อจนจบ: พัง 0 · ค่าติดมาไม่ตรง 0 · การ์ดค้างใช้ไม่ได้ 0
//    เซฟกลางระหว่างชาติ (รวมกลางวงปรโลก) เล่นต่อจนการ์ดส่งต่อแล้วเกิดรุ่นถัดไป · ฐานยังไม่มีเซฟแบบนี้ = สร้างสดจากแกนนี้ตรวจแทน
//    + เซฟระหว่างชาติก่อนมีวงปรโลก (harness/fixtures/keep-after-old.json) ต้องเล่นแบบเดิมจนเกิด ไม่มีการ์ดวงโผล่
// ตัวควบคุม (รันทุกครั้ง): ตัด id 1 ตัว → ก ต้องเห็น · ตัดการ์ดที่เซฟค้าง → ค ต้องเห็น stale · เซฟรูปแบบอื่น → restore ต้องพัง
// --save (ผู้รวมงานรันหลัง bump): เขียนฐานใหม่ทั้งสองไฟล์จากเวอร์ชันนี้ · ไม่มีฐาน = ตก ไม่ใช่ผ่านเงียบ
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { newLife, nextCard, choose, makeRng, mixSeed, TITLES, FAMILY_TITLES, startAfterlife, nextAfterCard, chooseAfter, nextLife } from '../src/engine/index.mjs';
import { snapshot, restore, repairLife, SNAP_V } from '../src/engine/save.mjs';
import { ERA_PICS } from '../src/ui/art.mjs';
import { loadContent } from '../src/node/load.mjs';
import { effectSites } from '../src/node/lint/util.mjs';
import { readVersion } from '../src/site/facts.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i < 0 ? d : process.argv[i + 1]; };
const SAVE = process.argv.includes('--save');
// เซฟละ ~15 KB — เพดานไฟล์ฐาน 300 KB จึงเก็บ 16 เซฟ
const N = Number(arg('--n', 16));
const SEED = Number(arg('--seed', 1));
const IDS_FILE = new URL('./keep-ids.json', import.meta.url);
const SNAPS_FILE = new URL('./fixtures/keep-snaps.json', import.meta.url);
const OLD_AFTER_FILE = new URL('./fixtures/keep-after-old.json', import.meta.url);
// เซฟกลางระหว่างชาติ 1 ใน 4 ของชุด
const N_AFTER = Math.round(N / 4);
const SNAPS_MAX_KB = 300;
const PLAY_MAX = 400;
// ระหว่างชาติสุ่มกดทางต่างโลกได้ — ชาติต่างโลกเล่นอยู่ในระหว่างชาติ ยาวได้หลายร้อยใบ
const AFTER_MAX = 3000;

const content = loadContent();
const app = readFileSync(new URL('../src/ui/app.mjs', import.meta.url), 'utf8');
const { version } = readVersion();

// การ์ดที่ของอื่นอ้างถึง: ผลย้อน/การ์ดต่อจากตัวเลือก + การ์ดที่ปลดภาพในสมุดภาพ (ช่อง era ของการ์ด · PIC_FOLLOW ของหน้าเว็บ)
function referencedEvents() {
  const ref = new Set();
  for (const e of content.events) {
    if (e.era) ref.add(e.id);
    for (const { node } of effectSites(e)) {
      for (const s of node.schedules ?? []) if (s?.event) ref.add(s.event);
      if (typeof node.next === 'string') ref.add(node.next);
    }
  }
  const follow = app.match(/const PIC_FOLLOW = (\{[^}]*\})/)?.[1];
  if (follow) for (const [, id] of follow.matchAll(/(\w+):/g)) ref.add(id);
  return [...ref].filter((id) => content.events.some((e) => e.id === id)).sort();
}
function collect() {
  return {
    titles: TITLES.map((t) => t.id),
    family: FAMILY_TITLES.map((t) => t.id),
    eraEvents: content.era.events.map((e) => e.id),
    picSlots: Object.entries(ERA_PICS).flatMap(([id, slots]) => [`e:${id}`, ...slots.map(([k]) => `s:${id}:${k}`)]),
    refEvents: referencedEvents(),
    events: content.events.map((e) => e.id),
    storage: [...new Set([...app.matchAll(/'(next-life-[\w-]+)'/g)].map((m) => m[1]))].sort(),
  };
}
const HARD = ['titles', 'family', 'eraEvents', 'picSlots', 'refEvents', 'storage'];
const lostOf = (base, now) => Object.fromEntries(Object.keys(base).filter((k) => Array.isArray(base[k])).map((k) => [k, base[k].filter((x) => !(now[k] ?? []).includes(x))]));

// เซฟกลางชีวิต (การ์ด 10–69) ด้วยตัวเลือกแรกที่กดได้ — ทางเดียวกับที่วัดตอนสำรวจ 29 เวอร์ชัน
const firstOpen = (card) => Math.max(0, (card.choices ?? []).findIndex((_, i) => !card.locked?.[i]));
// ทางสืบสายเลือดต้องระบุคน เหมือนจอที่ส่ง id ของคนที่ผู้เล่นกด · แกนอ่าน id เฉพาะทางนี้ การ์ดอื่นส่งไปก็ไม่มีผล
const pickAfter = (af, card, idx) => chooseAfter(af, idx, card.heirs?.[0]?.id);
const kept = (st) => ({ age: st.age, money: Math.round(st.money), flags: Object.keys(st.flags).sort().join(), gen: st.gen ?? 1 });
function makeSnaps() {
  const out = [];
  for (let i = 0; out.length < N - N_AFTER && i < N * 6; i++) {
    const st = newLife(mixSeed(0x6b656570, i), content);
    const stop = 10 + (i * 37) % 60;
    let card = nextCard(st);
    for (let k = 0; k < stop && card.kind !== 'death' && !st.dead; k++) {
      if (card.choices?.length) choose(st, firstOpen(card));
      card = nextCard(st);
    }
    if (card.kind === 'death' || st.dead) continue;
    out.push({ snap: snapshot({ st, af: null, card, ui: {} }, content), kept: kept(st), pending: st.pending?.id ?? null });
  }
  return [...out, ...makeAfterSnaps(N_AFTER)];
}
// เซฟกลางระหว่างชาติ: เล่นจนตายด้วยตัวเลือกแรก แล้วหยุดที่การ์ดระหว่างชาติใบที่ 3–22 (ทางเกิดกดตัวแรก = เป็นลูก/เกิดใหม่ ⇒ ถึงวงปรโลก)
function makeAfterSnaps(n) {
  const out = [];
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const st = newLife(mixSeed(0x61667465, i), content);
    let card = nextCard(st);
    for (let k = 0; k < 2000 && card.kind !== 'death'; k++) {
      if (card.choices?.length) choose(st, firstOpen(card));
      card = nextCard(st);
    }
    if (card.kind !== 'death') continue;
    const af = startAfterlife(st);
    const stop = 3 + (i * 7) % 20;
    card = nextAfterCard(af);
    for (let k = 0; k < stop && !card.done; k++) {
      if (card.choices?.length) pickAfter(af, card, firstOpen(card));
      card = nextAfterCard(af);
    }
    if (card.done || af.isekai) continue;
    out.push({ snap: snapshot({ st, af, card, ui: {} }, content), kept: kept(st), pending: af.pending?.id ?? null, after: true, loop: af.loop?.year ?? null });
  }
  return out;
}
// โหลดแบบหน้าเว็บแล้วเล่นต่อจนจบ · rng ของการเล่นต่อจาก --seed (ชุดเซฟเดิม ทางเล่นต่างกัน)
function replay(s, cont, seed) {
  const r = { restoreFail: 0, stale: 0, keptBad: 0, playFail: 0, err: null };
  let root;
  try { root = restore(s.snap, cont); } catch (e) { r.restoreFail = 1; r.err = String(e).slice(0, 100); return r; }
  const st = root.st;
  let card = root.card;
  const rng = makeRng(seed);
  const pickOpen = (c) => {
    const open = c.choices.map((_, i) => i).filter((i) => !c.locked?.[i]);
    return open.length ? open[Math.floor(rng.next() * open.length)] : 0;
  };
  // ระหว่างชาติ: ทางเดียวกับ snapRead ของหน้าเว็บ (การ์ดที่ค้างหายจากเนื้อหาใหม่ = จั่วใหม่) แล้วเดินจนเกิดรุ่นถัดไป
  if (root.af) {
    const af = root.af;
    if (JSON.stringify(kept(st)) !== JSON.stringify(s.kept)) r.keptBad = 1;
    r.loopCards = 0;
    try {
      if (!af.isekai && card.choices?.length && !af.pending) { r.stale = 1; card = nextAfterCard(af); }
      for (let k = 0; k < AFTER_MAX && !card.done; k++) {
        if (card.loop) r.loopCards++;
        if (card.choices?.length) pickAfter(af, card, pickOpen(card));
        card = nextAfterCard(af);
      }
      if (!card.done) throw new Error(`ระหว่างชาติไม่จบใน ${AFTER_MAX} การ์ด`);
      nextLife(af);
    } catch (e) { r.playFail = 1; r.err = String(e).slice(0, 100); }
    return r;
  }
  if (repairLife(st, card)) { r.stale = 1; card = nextCard(st); }
  if (JSON.stringify(kept(st)) !== JSON.stringify(s.kept)) r.keptBad = 1;
  try {
    for (let k = 0; k < PLAY_MAX && card.kind !== 'death'; k++) {
      if (card.choices?.length) choose(st, pickOpen(card));
      card = nextCard(st);
    }
    if (card.kind !== 'death') throw new Error(`ไม่จบใน ${PLAY_MAX} การ์ด`);
  } catch (e) { r.playFail = 1; r.err = String(e).slice(0, 100); }
  return r;
}

if (SAVE) {
  const ids = { version, snapV: SNAP_V, ...collect() };
  writeFileSync(IDS_FILE, `${JSON.stringify(ids, null, 1)}\n`);
  mkdirSync(new URL('./fixtures/', import.meta.url), { recursive: true });
  const snaps = makeSnaps();
  const body = `${JSON.stringify({ version, snaps })}\n`;
  writeFileSync(SNAPS_FILE, body);
  const kb = Buffer.byteLength(body) / 1024;
  console.log(`keep --save · ฐาน ${version} · harness/keep-ids.json · harness/fixtures/keep-snaps.json ${snaps.length} เซฟ ${kb.toFixed(0)} KB`);
  if (kb > SNAPS_MAX_KB) { console.log(`เซฟฐานใหญ่เกิน ${SNAPS_MAX_KB} KB — ลด --n`); process.exitCode = 1; }
  process.exit();
}

let fail = 0;
const check = (label, bad, extra = '') => { console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`); if (bad) fail++; };
if (!existsSync(IDS_FILE) || !existsSync(SNAPS_FILE)) {
  check('มีฐานของเวอร์ชันที่ปล่อยล่าสุด (npm run keep -- --save)', 1, ` · ขาด ${[!existsSync(IDS_FILE) && 'harness/keep-ids.json', !existsSync(SNAPS_FILE) && 'harness/fixtures/keep-snaps.json'].filter(Boolean).join(' · ')}`);
  process.exit(1);
}
const base = JSON.parse(readFileSync(IDS_FILE, 'utf8'));
const now = collect();
const lost = lostOf(base, now);
console.log(`keep · ฐาน ${base.version} → ตอนนี้ ${version}`);
const grew = HARD.map((k) => [k, now[k].filter((x) => !base[k].includes(x)).length]).filter(([, n]) => n).map(([k, n]) => `${k} +${n}`);
if (grew.length) console.log(`ใหม่: ${grew.join(' · ')} (ตัวหารโต ของเดิมคงนับ)`);
check('ก. id ของสะสม/การ์ดที่ถูกอ้าง ห้ามหาย', HARD.filter((k) => k !== 'storage').reduce((n, k) => n + lost[k].length, 0), HARD.filter((k) => k !== 'storage' && lost[k].length).map((k) => ` · ${k}: ${lost[k].join(' ')}`).join(''));
if (lost.events.length) console.log(`  ⚠ การ์ดหายที่ไม่มีใครอ้าง ${lost.events.length} ใบ (เตือน ไม่ตก · เซฟที่ค้างการ์ดเหล่านี้จั่วใหม่): ${lost.events.join(' ')}`);
check('ข. key ที่เก็บในเครื่องผู้เล่น ห้ามหาย', lost.storage.length, lost.storage.length ? ` · ${lost.storage.join(' ')}` : ` (${now.storage.length} key)`);

const { snaps, version: snapsVer } = JSON.parse(readFileSync(SNAPS_FILE, 'utf8'));
const kb = readFileSync(SNAPS_FILE).length / 1024;
const sum = { restoreFail: 0, stale: 0, keptBad: 0, playFail: 0 };
const errs = [];
for (const s of snaps) {
  const r = replay(s, content, mixSeed(SEED, snaps.indexOf(s)));
  for (const k in sum) sum[k] += r[k];
  if (r.err && errs.length < 3) errs.push(r.err);
}
const staleOk = snaps.filter((s) => s.pending && lost.events.includes(s.pending)).length;
check(`ค. เซฟของ ${snapsVer} (${snaps.length} เซฟ · ${kb.toFixed(0)} KB · เล่นต่อ seed ${SEED}) โหลด+เล่นต่อจนจบ`, sum.restoreFail + sum.keptBad + sum.playFail + Math.max(0, sum.stale - staleOk), ` · restore พัง ${sum.restoreFail} · ค่าไม่ตรง ${sum.keptBad} · เล่นต่อพัง ${sum.playFail} · การ์ดค้างใช้ไม่ได้ ${sum.stale} (ยอมตามการ์ดหาย ${staleOk})${errs.length ? ` · ${errs.join(' | ')}` : ''}`);
check(`  เซฟฐานไม่เกิน ${SNAPS_MAX_KB} KB`, kb > SNAPS_MAX_KB ? 1 : 0, ` (${kb.toFixed(0)} KB)`);

// เซฟกลางระหว่างชาติของแกนนี้ (สร้างสด): ภาพถ่าย → โหลด → เล่นต่อจนเกิด · ต้องมีเซฟกลางวงปรโลกอย่างน้อย 1
{
  const fresh = makeAfterSnaps(N_AFTER);
  const rs = fresh.map((s, i) => replay(s, content, mixSeed(SEED, 100 + i)));
  const bad = rs.reduce((n, r) => n + r.restoreFail + r.keptBad + r.playFail + r.stale, 0);
  const inLoop = fresh.filter((s) => s.loop !== null).length;
  check(`ค′ เซฟกลางระหว่างชาติของแกนนี้ (${fresh.length} เซฟ · กลางวงปรโลก ${inLoop}) โหลด+เล่นต่อจนเกิด`, bad + (inLoop ? 0 : 1), rs.find((r) => r.err) ? ` · ${rs.find((r) => r.err).err}` : '');
}
// เซฟระหว่างชาติก่อนมีวงปรโลก: เล่นแบบเดิมจนเกิด ไม่มีการ์ดวงโผล่ (เซฟเก่ากลางฉาก 6 ขั้น)
{
  const ok = existsSync(OLD_AFTER_FILE);
  const old = ok ? JSON.parse(readFileSync(OLD_AFTER_FILE, 'utf8')) : { snaps: [], version: '?' };
  const rs = old.snaps.map((s, i) => replay(s, content, mixSeed(SEED, 200 + i)));
  const bad = rs.reduce((n, r) => n + r.restoreFail + r.keptBad + r.playFail + r.stale + (r.loopCards ? 1 : 0), 0);
  check(`ค″ เซฟระหว่างชาติก่อนมีวงของ ${old.version} (${old.snaps.length} เซฟ) เล่นแบบเดิมจนเกิด`, bad + (ok && old.snaps.length ? 0 : 1), rs.find((r) => r.err) ? ` · ${rs.find((r) => r.err).err}` : '');
}

// ตัวควบคุม: ตัววัดต้องเห็นของพังที่ทำขึ้นเอง ไม่งั้นด่านนี้ผ่านเงียบได้
{
  const cut = { ...now, titles: now.titles.slice(1), storage: now.storage.slice(1) };
  const cl = lostOf(base, cut);
  const s0 = snaps.find((s) => s.pending);
  const noCard = s0 && { ...content, events: content.events.filter((e) => e.id !== s0.pending) };
  const st = s0 ? replay(s0, noCard, 1).stale : 0;
  let vBad = 0;
  try { restore(snaps[0].snap.replace(`"v":${SNAP_V}`, '"v":-1'), content); } catch { vBad = 1; }
  check('  ตัวควบคุม: ตัดฉายา 1 · key 1 → ก/ข เห็น · ตัดการ์ดที่เซฟค้าง → stale · เซฟรูปแบบอื่น → restore พัง', (cl.titles.length >= 1 ? 0 : 1) + (cl.storage.length >= 1 ? 0 : 1) + (st ? 0 : 1) + (vBad ? 0 : 1));
}
process.exitCode = fail ? 1 : 0;
