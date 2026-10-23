// งานหนึ่งชิ้นของ harness เต็ม: บอทหนึ่งตัว × seed หนึ่งชุด × n ชีวิต (เล่นต่อถึงระหว่างชาติ) แล้วคืนผลรวม
// แยก worker ต่อชิ้นเพราะ 20,000 ชีวิตใช้ราวนาทีครึ่งต่อชิ้น — 12 ชิ้นต่อกันเกิน 15 นาที
import { parentPort, workerData } from 'node:worker_threads';
import { playLife, playAfterlife, mixSeed } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';
import { addGroup, groupKey, cardsInRange } from './gates.mjs';

const { bot, seed, n, dropBelief } = workerData;
const content = loadContent();
// ตัวควบคุมด่าน (7): ถอดเหตุการณ์ belief ออกทั้งหมด แล้วเทียบอายุเฉลี่ยกับรอบที่มี
if (dropBelief) content.events = content.events.filter((e) => e.category !== 'belief');
const era = content.era;
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations', 'network'];

const inc = (m, k, v = 1) => m.set(k, (m.get(k) ?? 0) + v);
const add3 = (m, k, a, b, c) => {
  const x = m.get(k) ?? [0, 0, 0];
  x[0] += a;
  x[1] += b;
  x[2] += c;
  m.set(k, x);
};
const r = {
  bot, seed, n, dropBelief: !!dropBelief,
  ageSum: 0, statBad: 0,
  groups: new Map(),
  cardsOver60: [],
  // ชีวิตที่เจอเหตุการณ์นั้น (นับครั้งเดียวต่อชีวิต) · ครั้งที่กดตัวเลือก id#ลำดับ · ธงที่เคยติด
  fired: new Map(), picks: new Map(), flags: new Set(),
  // ชี้ต้นเหตุ (blame ใน gates.mjs): ต่อกลุ่ม 3b → id → [ชีวิต, ผลรวมส่วนต่างอายุ, ผลรวมอายุที่เจอ] + [[อายุตาย, ส่วนต่างอายุ]] ทุกชีวิต
  // · ด่าน 4 → id → [ชีวิตหลัง 60, ชีวิตที่จำนวนการ์ดหลุดช่วง, ผลรวมอายุที่เจอ] + [[อายุตาย, หลุดช่วง 0/1]]
  ageBlame: new Map(), groupLives: new Map(), cardBlame: new Map(), cardLives: [],
  // การ์ดเหตุการณ์ในชีวิต (ไม่นับระหว่างชาติ) ต่อ ช่วงวัย|หมวด · แฟนตาซี (แนว B) และหวยสายมูต่อชีวิต
  cells: new Map(), fantasy: new Map(), numen: 0,
};
const t0 = Date.now();
const pick = BOTS[bot];
for (let i = 0; i < n; i++) {
  // อายุที่เจอครั้งแรก เฉพาะการ์ดในชีวิต — ฉากระหว่างชาติเกิดหลังตาย เป็นต้นเหตุของอายุตายไม่ได้
  const seenAt = new Map();
  const seen = new Set();
  let fantasy = 0;
  const choose = (card, rng, h) => {
    const idx = pick(card, rng, h);
    if (card.id) inc(r.picks, `${card.id}#${idx}`);
    return idx;
  };
  const onCard = (card, st) => {
    for (const k of STAT_KEYS) if (!(st[k] >= 0 && st[k] <= 100)) r.statBad++;
    if (!Number.isFinite(st.money)) r.statBad++;
    for (const f of Object.keys(st.flags)) r.flags.add(f.split(':')[0]);
    if (card.kind !== 'event') return;
    seen.add(card.id);
    if (!seenAt.has(card.id)) seenAt.set(card.id, card.age);
    const ev = st.pending;
    inc(r.cells, `${card.stage}|${ev.category ?? '-'}`);
    if (card.type === 'B') fantasy++;
    if (ev.belief?.kind === 'lottery_numen') r.numen++;
  };
  const { age, cards, state } = playLife(mixSeed(seed, i), content, choose, onCard);
  r.ageSum += age;
  inc(r.fantasy, fantasy);
  const diff = addGroup(r.groups, era, state, age);
  const gk = groupKey(state);
  const gb = r.ageBlame.get(gk) ?? new Map();
  for (const [id, at] of seenAt) add3(gb, id, 1, diff, at);
  r.ageBlame.set(gk, gb);
  const gl = r.groupLives.get(gk) ?? [];
  gl.push([age, diff]);
  r.groupLives.set(gk, gl);
  if (age > 60) {
    r.cardsOver60.push(cards);
    const out = cardsInRange(cards) ? 0 : 1;
    r.cardLives.push([age, out]);
    for (const [id, at] of seenAt) add3(r.cardBlame, id, 1, out, at);
  }
  playAfterlife(state, choose, (card) => {
    if (card.kind === 'scene') seen.add(card.id);
  });
  for (const id of seen) inc(r.fired, id);
}
r.ms = Date.now() - t0;
parentPort.postMessage(r);
