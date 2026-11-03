// ด่านตัวควบคุมลาง (omc-2): ลางที่มีตัวเลือกตามมาเปลี่ยนแบบชีวิต/ฉายาได้ (ลางภัยยุคเคยกดลูกนกหัดบินจน full ตก) — เกมอื่นไม่มีลางเตือนก่อนภัยให้เทียบตัวเลข
// เดิน seed เดียวกันสองชุด: เนื้อหาเต็ม vs ตัดใบลางออกจากเนื้อหา แล้วเทียบอัตราแบบชีวิต + ฉายาทุกตัว (ชุดเดียวกับ titles.mjs)
// ตัดที่เนื้อหา ไม่ใช่ตัดออกจาก log หลังเล่น — ต้องเห็นผลของธง braced: และโควตาปีที่ใบลางกิน
// ใช้เมื่อ diff แตะใบลาง/ที่ออกลาง · ไม่เข้า full (เวลา) · ไม่ครอบลางบัญชี (ไม่มีตัวเลือก · ตัดต้องเพิ่มธงใน engine)
// ลูปนับลอกจาก titles.mjs ไม่ import — ไฟล์นั้นเป็นสคริปต์รันทันที
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { createHash } from 'node:crypto';
import { playLife, playAfterlife, nextLife, mixSeed } from '../src/engine/index.mjs';
import { titlesOf, ALL_PATTERNS, TITLES, FAMILY_TITLES } from '../src/engine/titles.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

// ลางชนิดใหม่ที่มีตัวเลือกตามมา = เพิ่ม key · ตัวเลือกต้องตัดใบลางอย่างเดียว ไม่งั้นตัวควบคุม (2) ตก
const CUT = { herald: (e) => !!e.herald_of };
// ตก = ทั้งสองเงื่อนไข: z กันสัญญาณสุ่มของตัวหายาก · ส่วนต่างสัมพัทธ์กันผลจิ๋วของตัวใหญ่ที่ z สูงเพราะ n เยอะ
const Z_FAIL = 3;
const REL_FAIL = 0.25;
// ตัวที่เจ้าของยอมรับว่าลางขยับจริงตามดีไซน์ — ยังพิมพ์ตัวเลขทุกรอบ (~ แทน ✗) แต่ไม่นับตก · ค่าห่างจากตัวเลขที่ยอมรับมากเมื่อไหร่ค่อยยกกลับไปให้เจ้าของดู
const ACCEPTED = {
  't:grandparent': 'ลางภัยยุค 18+ (af1) ลดผู้เลี้ยงหลานแทนพ่อแม่ ~1/4 — ยอมรับที่ n2000 seed 1: มีลาง 2.98% ตัดลาง 4.04% z −7.73',
};

const cutOf = (content, k) => ({ ...content, events: content.events.filter((e) => !CUT[k](e)) });

if (!isMainThread) {
  const { bot, set, cut, n, gens, seed } = workerData;
  const full = loadContent();
  const content = set === 'ctl' ? cutOf(full, cut) : full;
  const cutIds = new Set(full.events.filter(CUT[cut]).map((e) => e.id));
  const play = BOTS[bot];
  const count = {};
  const hit = (id) => (count[id] = (count[id] ?? 0) + 1);
  // ต่อตระกูล: hash ทุกรุ่น (log ตัวเลือก + อายุตาย) · เจอใบลางในรุ่นไหนก็ได้ · จำนวนชีวิตที่เจอใบลาง
  const hashes = [];
  const saw = new Uint8Array(n);
  let cutLives = 0;
  for (let i = 0; i < n; i++) {
    const h = createHash('sha1');
    let st = null;
    for (let g = 0; g < gens; g++) {
      const { age, state } = playLife(mixSeed(seed, i * 7919 + g), content, play, null, st ?? undefined);
      const t = titlesOf(state);
      if (t.pattern) hit(`p:${t.pattern.id}`);
      for (const x of t.titles) hit(`t:${x.id}`);
      for (const x of t.family) hit(`f:${x.id}`);
      // done จับใบที่ออกแต่ไม่ลง log ด้วย (ใบไม่มีตัวเลือก) — ตัวควบคุม (1) ต้องไม่พลาดใบลางที่หลุดมา
      if (state.log.some((e) => cutIds.has(e.id)) || [...cutIds].some((id) => state.done[id])) {
        saw[i] = 1;
        cutLives++;
      }
      h.update(JSON.stringify(state.log));
      h.update(`|${age}|`);
      if (g < gens - 1) st = nextLife(playAfterlife(state, play));
    }
    hashes.push(h.digest('base64'));
  }
  parentPort.postMessage({ bot, set, count, hashes, saw, cutLives, lives: n * gens });
} else {
  const args = process.argv.slice(2);
  const opt = (name, def) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : def;
  };
  const n = Number(opt('n', 2000));
  const gens = Number(opt('gens', 3));
  const seed = Number(opt('seed', 1));
  const cut = opt('cut', 'herald');
  if (!CUT[cut]) {
    console.error(`--cut ${cut} ไม่รู้จัก · มี ${Object.keys(CUT).join(' · ')}`);
    process.exit(1);
  }
  const started = Date.now();
  const jobs = Object.keys(BOTS).flatMap((bot) => ['full', 'ctl'].map((set) => ({ bot, set, cut, n, gens, seed })));
  const results = [];
  let next = 0;
  const runOne = () => {
    if (next >= jobs.length) return null;
    const job = jobs[next++];
    return new Promise((done, fail) => {
      const w = new Worker(new URL(import.meta.url), { workerData: job });
      w.once('message', (r) => results.push(r));
      w.once('error', fail);
      w.once('exit', () => done(runOne()));
    });
  };
  await Promise.all(Array.from({ length: Math.min(availableParallelism(), jobs.length) }, runOne));
  const of = (bot, set) => results.find((r) => r.bot === bot && r.set === set);

  console.log(`ด่านตัวควบคุมลาง --cut ${cut} · ${Object.keys(BOTS).join(' · ')} × ${n} ตระกูล × ${gens} รุ่น · seed ${seed} · ${((Date.now() - started) / 1000).toFixed(0)} วิ`);

  // ---- ตัวควบคุมของตัววัด: ไม่ผ่าน = ตารางอ่านไม่ได้ ----
  let ctlCut = 0, quiet = 0, quietSame = 0, loud = 0, loudDiff = 0;
  for (const b of Object.keys(BOTS)) {
    const a = of(b, 'full');
    const c = of(b, 'ctl');
    ctlCut += c.cutLives;
    for (let i = 0; i < n; i++) {
      const same = a.hashes[i] === c.hashes[i];
      if (a.saw[i]) {
        loud++;
        if (!same) loudDiff++;
      } else {
        quiet++;
        if (same) quietSame++;
      }
    }
  }
  const c1 = ctlCut === 0;
  const c2 = quietSame === quiet;
  const c3 = loudDiff > 0;
  console.log(`\nตัวควบคุม`);
  console.log(`  (1) ชุดตัดลางเจอใบลาง ${ctlCut} ชีวิต ${c1 ? 'ผ่าน' : '→ ตก การตัดไม่ครบ'}`);
  console.log(`  (2) ตระกูลไม่เจอลางทั้ง ${gens} รุ่น: ชีวิตตรงชุดตัด ${quietSame}/${quiet} ${c2 ? 'ผ่าน' : '→ ตก การตัดเปลี่ยนอย่างอื่นนอกจากลาง'}`);
  console.log(`  (3) ตระกูลที่เจอลาง: ต่างจากชุดตัด ${loudDiff}/${loud} ${c3 ? 'ผ่าน' : '→ ตก ตัววัดไม่ไว'}`);
  if (!(c1 && c2 && c3)) {
    console.log('\nตัวควบคุมไม่ผ่าน ไม่พิมพ์ตาราง');
    process.exit(1);
  }

  const sum = (bots, set) => {
    const out = { count: {}, lives: 0 };
    for (const b of bots) {
      const r = of(b, set);
      out.lives += r.lives;
      for (const [k, v] of Object.entries(r.count)) out.count[k] = (out.count[k] ?? 0) + v;
    }
    return out;
  };
  const pct = (p) => `${(p * 100).toFixed(2)}%`;
  const accepted = [];
  const table =(label, bots, judge) => {
    const A = sum(bots, 'full');
    const C = sum(bots, 'ctl');
    let fail = 0;
    const line = (name, id) => {
      const a = A.count[id] ?? 0;
      const c = C.count[id] ?? 0;
      const pa = a / A.lives;
      const pc = c / C.lives;
      // z สองสัดส่วนแบบรวมค่า p · ทั้งสองชุดเป็น 0 = ไม่ต่าง
      const p = (a + c) / (A.lives + C.lives);
      const se = Math.sqrt(p * (1 - p) * (1 / A.lives + 1 / C.lives));
      const z = se ? (pa - pc) / se : 0;
      // เทียบกับชุดตัดลาง (ไม่มีลาง = ฐาน) · ฐาน 0 แต่ชุดเต็มมี = เปลี่ยนเต็ม
      const rel = pc ? Math.abs(pa - pc) / pc : pa ? Infinity : 0;
      const over = Math.abs(z) >= Z_FAIL && rel >= REL_FAIL;
      const bad = over && !ACCEPTED[id];
      if (bad && judge) fail++;
      if (over && !bad && judge) accepted.push(id);
      const relTxt = rel === Infinity ? '∞' : `${(rel * 100).toFixed(0)}%`;
      console.log(`${bad ? '✗' : over ? '~' : ' '} ${name.padEnd(28)} ${String(a).padStart(6)} ${pct(pa).padStart(7)} ${String(c).padStart(6)} ${pct(pc).padStart(7)} ${((pa - pc) * 100).toFixed(2).padStart(7)} ${z.toFixed(2).padStart(6)} ${relTxt.padStart(5)}`);
    };
    console.log(`\n${label} · ชีวิตละชุด ${A.lives}`);
    console.log(`  ${''.padEnd(28)} ${'มีลาง'.padStart(14)} ${'ตัดลาง'.padStart(14)} ${'ต่าง'.padStart(7)} ${'z'.padStart(6)} ${'สัมพัทธ์'.padStart(5)}`);
    console.log('แบบชีวิต');
    for (const x of ALL_PATTERNS) line(x.name, `p:${x.id}`);
    console.log('ฉายา');
    for (const x of TITLES) line(x.name, `t:${x.id}`);
    console.log('ฉายาตระกูล');
    for (const x of FAMILY_TITLES) line(x.name, `f:${x.id}`);
    return fail;
  };
  const fail = table('ทุกบอทรวม (ตัดสิน)', Object.keys(BOTS), true);
  // เพดานแบบชีวิตกระจุกวัดบนบอทสุ่ม — พิมพ์ให้เห็นแยก แต่ไม่ตัดสิน: ชีวิตชุดเดียวน้อยกว่ารวม 6 เท่า ตัวหายากแกว่งเกิน z ง่าย
  table('บอทสุ่มอย่างเดียว (ดูอย่างเดียว ไม่ตัดสิน)', ['สุ่ม'], false);
  for (const id of accepted) console.log(`~ ${id} เกินขอบแต่ยอมรับแล้ว: ${ACCEPTED[id]}`);
  console.log(fail ? `\nด่านตัวควบคุมลางตก ${fail} ตัว (|z| ≥ ${Z_FAIL} และต่างสัมพัทธ์ ≥ ${REL_FAIL * 100}%)` : `\nด่านตัวควบคุมลางผ่าน: แบบชีวิต ${ALL_PATTERNS.length} + ฉายา ${TITLES.length} + ตระกูล ${FAMILY_TITLES.length} ตัว ไม่มีตัวไหนขยับเกินขอบ`);
  if (fail) process.exitCode = 1;
}
