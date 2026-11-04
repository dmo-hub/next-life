// ผลจำลองเส้นทางงานของหน้าเฉลย (ui-redo ใบ 21): ต่อสาย/อาชีพ → ทางเข้า · การ์ดระหว่างงาน · ทางออก พร้อมจำนวนชีวิต
// รันสั่งแยก ไม่ผูก build — build อ่านไฟล์ผล data/career-sim.json อย่างเดียว เวลา build จึงไม่เพิ่ม
// % บนหน้า = ชีวิตที่เจอ ÷ ชีวิตที่เคยทำงานนั้น (เจอกี่ครั้งก็นับ 1) · ทุกบอทใน BOTS เล่นจำนวนเท่ากัน
// ใช้: node harness/career-sim.mjs [--n <ชีวิตต่อบอท>] [--seed <s>] [--out <ไฟล์>]
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { playLife, mixSeed, isWorking, RETIRE_AGE } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';
import { careerCardIds, isCareerCard, OFFICE_UNIT, unitKey } from '../src/site/career.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const n = Number(opt('n', 1000));
const seed = Number(opt('seed', 1));
const out = new URL(opt('out', '../data/career-sim.json'), import.meta.url);
const content = loadContent();
const EVENTS = new Map(content.events.map((e) => [e.id, e]));
const CAREER = careerCardIds(content);

// ตัวเลือกที่พาเข้า/ออกงานได้ทันที: ผลบนตัวเลือกหรือผลสุ่มทางใดทางหนึ่งมี job · ladder · office · retire
const JOB_FX = ['job', 'ladder', 'office', 'retire'];
const movesJob = (c) => [c, ...(c?.outcomes ?? [])].some((x) => JOB_FX.some((k) => x?.effects?.[k] !== undefined));
// การ์ดที่แกนสร้างเปลี่ยนงานเองในตัวเลือก (เลื่อนขั้น · ชวนลงสมัคร · ชวนรับราชการ · เกษียณก่อนกำหนด)
const ENGINE_MOVE = /^(promo_|office_|recruit_gov$|early_retire$|first_job$|school_gate_)/;

function units(st) {
  const u = [];
  if (isWorking(st)) u.push(unitKey(st.ladder?.id ?? 'none', st.occupation));
  if (st.office) u.push(OFFICE_UNIT);
  return u;
}

const tally = new Map();
const unit = (k) => {
  if (!tally.has(k)) tally.set(k, { lives: 0, entries: new Map(), cards: new Map(), exits: new Map() });
  return tally.get(k);
};
const bump = (m, k, v = { n: 0 }) => {
  if (!m.has(k)) m.set(k, v);
  m.get(k).n++;
};

function playOne(lifeSeed, bot) {
  let prev = [];
  let last = null;
  const had = new Set();
  const seen = new Map();
  const entries = new Map();
  const exits = new Map();
  const add = (m, u, k, v) => {
    if (!m.has(u)) m.set(u, new Map());
    if (!m.get(u).has(k)) m.get(u).set(k, v);
  };
  // ทางที่พาเปลี่ยนงานรอบนี้: ตัวเลือกล่าสุดที่เปลี่ยนงานได้ = การ์ดนั้น · ไม่งั้นแกนเปลี่ยนเองตอนขึ้นปี
  const via = (st, from) => {
    if (last && (last.moves || ENGINE_MOVE.test(last.id))) return { key: `${last.id}#${last.text}`, v: { id: last.id, text: last.text } };
    if (from && from.split('|')[0] === st.ladder?.id) return { key: 'engine:promote', v: { engine: 'promote' } };
    if (st.ladder?.from === st.age && (st.ladder.id === 'army' || st.ladder.id === 'police')) return { key: 'engine:cadet', v: { engine: 'cadet' } };
    return { key: 'engine:other', v: { engine: 'other' } };
  };
  // ทางออกนับรวมต่อการ์ด — ตัวเลือกเลื่อนขั้น 4 ทางพาไปขั้นเดียวกัน แยกตัวเลือกแล้วแถวซ้ำกันทั้งกล่อง
  const byCard = (w) => (w.v.id ? { key: w.v.id, v: { id: w.v.id } } : w);
  const pick = Object.assign((card, rng, st) => {
    const i = bot(card, rng, st);
    const idx = typeof i === 'object' ? i.i : i;
    const id = card.ev?.id ?? card.id;
    const src = EVENTS.get(id)?.choices?.[idx] ?? card.ev?.choices?.[idx];
    last = { id, idx, text: src?.text ?? card.choices?.[idx]?.text ?? card.choices?.[idx] ?? '', moves: movesJob(src) };
    return i;
  }, bot);
  playLife(lifeSeed, content, pick, (card, st) => {
    const dead = card.kind === 'death';
    const cur = dead ? [] : units(st);
    for (const u of cur) if (!prev.includes(u)) {
      had.add(u);
      const w = via(st, prev.find((p) => p !== OFFICE_UNIT));
      add(entries, u, w.key, w.v);
    }
    for (const u of prev) if (!cur.includes(u)) {
      const to = cur.find((x) => x !== OFFICE_UNIT && x !== u);
      let e;
      if (dead) e = { key: 'death', v: { kind: 'death' } };
      else if (u !== OFFICE_UNIT && to) {
        const w = byCard(via(st, u));
        e = { key: `to:${to}:${w.key}`, v: { kind: 'move', to, ...w.v } };
      } else if (u !== OFFICE_UNIT && st.retiredAt !== null && st.retiredAt !== undefined && st.age < RETIRE_AGE) e = { key: 'early', v: { kind: 'early_retire' } };
      else if (u !== OFFICE_UNIT && st.age >= RETIRE_AGE) e = { key: 'retire', v: { kind: 'retire' } };
      else {
        const w = byCard(via(st, null));
        e = { key: `out:${w.key}`, v: { kind: 'leave', ...w.v } };
      }
      add(exits, u, e.key, e.v);
    }
    const id = card.ev?.id ?? card.id;
    if (!dead && id && (CAREER.has(id) || isCareerCard(id))) {
      const office = id.startsWith('office_');
      for (const u of cur) if ((u === OFFICE_UNIT) === office) add(seen, u, id, { id });
    }
    prev = cur;
  });
  for (const u of had) unit(u).lives++;
  for (const [m, key] of [[entries, 'entries'], [seen, 'cards'], [exits, 'exits']])
    for (const [u, ks] of m) for (const [k, v] of ks) bump(unit(u)[key], k, { ...v, n: 0 });
}

const t0 = Date.now();
const botNames = Object.keys(BOTS);
botNames.forEach((name, b) => {
  for (let i = 0; i < n; i++) playOne(mixSeed(seed + b * 1_000_003, i), BOTS[name]);
});
const sorted = (m) => [...m.values()].sort((a, b) => b.n - a.n);
let sha = 'unknown';
try {
  sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: new URL('..', import.meta.url) }).toString().trim();
} catch {}
const result = {
  assumption: true,
  note: 'ผลจำลองจากบอทของเกม ไม่ใช่สถิติจริง — % = ชีวิตที่เจอ ÷ ชีวิตที่เคยทำงานนั้น · สร้างด้วย node harness/career-sim.mjs',
  sha,
  seed,
  perBot: n,
  bots: botNames,
  lives: n * botNames.length,
  cards: [...CAREER].sort(),
  units: Object.fromEntries([...tally].sort(([a], [b]) => a.localeCompare(b)).map(([k, t]) => [k, { lives: t.lives, entries: sorted(t.entries), cards: sorted(t.cards), exits: sorted(t.exits) }])),
};
writeFileSync(out, `${JSON.stringify(result, null, 1)}\n`);
console.log(`ชีวิต ${result.lives} (${botNames.length} บอท × ${n}) · ${tally.size} สาย/อาชีพ · การ์ดเกี่ยวกับงาน ${CAREER.size} ใบ · sha ${sha} · ${((Date.now() - t0) / 1000).toFixed(1)} วิ → ${out.pathname}`);
