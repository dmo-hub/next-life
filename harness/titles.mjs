// harness ของฉายา (B10 · ใบ 04): บอทหลายบุคลิกเล่นต่อกันหลายรุ่น แล้วนับว่าแต่ละตัวออกกี่ %
// ด่าน (1) ใบ 07: ฉายาทุกตัว (รวมฉายาตระกูล) ≥ MIN_RATE ของชีวิตทั้งหมดรวมทุกบุคลิก
// · ผลของ titlesOf ไม่มีค่าบัญชีบุญบาป (ขึ้นบนการ์ดตายก่อนปรโลกเฉลย)
// ตัดสินจากหลาย seed: seed เดียวทำให้ของที่อัตราใกล้เกณฑ์ตกสลับ seed ⇒ รัน SEEDS seed (--seed ถึง +SEEDS−1) ตัดสินที่อัตรารวม
// = จำนวนครั้งรวมทุก seed ÷ ชีวิตรวมทุก seed (ไม่ใช่ค่าเฉลี่ยของอัตรา · ไม่ใช่ seed ใดผ่านก็พอ) · log พิมพ์จำนวนต่อ seed · ไม่มีรายชื่อยกเว้น
// --n = ตระกูลต่อ seed · TITLES_CUT=<id ฉายา> ตัวควบคุม: ฉายานั้นได้ไม่ได้จริง ด่านต้องตก
import { playLife, playAfterlife, nextLife, mixSeed } from '../src/engine/index.mjs';
import { titlesOf, TITLES, FAMILY_TITLES } from '../src/engine/titles.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 6000);
const gens = opt('gens', 3);
const seed = opt('seed', 1);
const SEEDS = 3;
const MIN_RATE = 0.001;
const content = loadContent();
const cut = process.env.TITLES_CUT;
if (cut) {
  const t = [...TITLES, ...FAMILY_TITLES].find((x) => x.id === cut);
  if (!t) throw new Error(`TITLES_CUT ${cut} ไม่มีฉายานี้`);
  t.test = () => false;
}

const count = new Map();
const bySeed = Array.from({ length: SEEDS }, () => new Map());
const livesBySeed = Array(SEEDS).fill(0);
let d = 0;
const hit = (id) => {
  count.set(id, (count.get(id) ?? 0) + 1);
  bySeed[d].set(id, (bySeed[d].get(id) ?? 0) + 1);
};
let lives = 0, leak = 0;
// ช่องที่ผลของ titlesOf มีได้ — ช่องอื่นนอกนี้ = อาจพาค่าซ่อนออกไปกับการ์ดตาย
const OUT_KEYS = new Set(['titles', 'family', 'id', 'name', 'tier', 'hint']);
const started = Date.now();
for (d = 0; d < SEEDS; d++) for (const [name, bot] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    let st = null;
    for (let g = 0; g < gens; g++) {
      const { state } = playLife(mixSeed(seed + d, i * 7919 + g), content, bot, null, st ?? undefined);
      const t = titlesOf(state);
      lives++;
      livesBySeed[d]++;
      JSON.stringify(t, (k, v) => {
        if (k && !OUT_KEYS.has(k) && !/^\d+$/.test(k)) leak++;
        return v;
      });
      for (const x of t.titles) hit(`t:${x.id}`);
      for (const x of t.family) hit(`f:${x.id}`);
      if (g < gens - 1) st = nextLife(playAfterlife(state, bot));
    }
  }
}

const pct = (c) => `${((c / lives) * 100).toFixed(2)}%`;
let fail = 0;
const line = (label, id, tier = '') => {
  const c = count.get(id) ?? 0;
  const ok = c / lives >= MIN_RATE;
  if (!ok) fail++;
  const per = bySeed.map((m) => String(m.get(id) ?? 0).padStart(5)).join(' ');
  console.log(`${ok ? ' ' : '✗'} ${label.padEnd(28)} ${tier.padEnd(7)} ${String(c).padStart(6)} ${pct(c).padStart(7)}  ต่อ seed ${per}`);
};
console.log(`ชีวิต ${lives} (${Object.keys(BOTS).join(' · ')} × ${n} ตระกูล × ${gens} รุ่น × ${SEEDS} seed: ${livesBySeed.join(' / ')}) · seed ${seed}–${seed + SEEDS - 1} · ตัดสินที่อัตรารวม · ${((Date.now() - started) / 1000).toFixed(0)} วิ${cut ? ` · ตัวควบคุมตัด ${cut}` : ''}`);
console.log('\nฉายา');
for (const t of TITLES) line(t.name, `t:${t.id}`, t.tier);
console.log('\nฉายาตระกูล');
for (const t of FAMILY_TITLES) line(t.name, `f:${t.id}`);

console.log(`\nผลของ titlesOf ไม่มีช่องบัญชีบุญบาป: ${leak ? `รั่ว ${leak} → ตก` : 'ผ่าน'}`);
console.log(fail ? `ด่าน (1) ตก ${fail} ตัวต่ำกว่า ${MIN_RATE * 100}%` : `ด่าน (1) ผ่าน: ฉายา ${TITLES.length} + ตระกูล ${FAMILY_TITLES.length} ตัว ≥ ${MIN_RATE * 100}% ทุกตัว`);
if (fail || leak) process.exitCode = 1;
