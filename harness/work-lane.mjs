// ด่านวัดการ์ดวัยทำงานไม่ตรงสาย (ใบ 180 · ข้อ 296 312–314)
// นับว่าคนแต่ละสาย (st.ladder.id · gov army police private trade hunter · none) และคนมีธงเจ้าของกิจการ own_business
// เจอการ์ดที่เรื่องผูกสายอื่นกี่ใบต่อชีวิต — "เรื่องผูกสายไหน" อ่านจากป้ายต่อใบใน harness/lane-tags.json (เลนติดเอง)
// ห้ามจัดสายด้วยรายการคำ (กันวัดวนกับ lint ใบ 182 และ harness/office.mjs) — ใบไม่มีป้าย = ใช้ได้ทุกสาย ไม่นับ
//
// ป้าย: { groups: { <ชื่อกลุ่ม>: { fit: [สายที่เรื่องใช้ได้], owner: true|false } }, cards: { <id>: <ชื่อกลุ่ม> | [สาย...] } }
//   owner = คนมีธง own_business ใช้ได้ไหม (เรื่องลูกจ้างบริษัท = false · เรื่องร้าน/แผง = true)
// ไล่ป้ายเพิ่ม: ส่วน "ใบไม่มีป้ายที่เอียงเข้าสายเดียว" ชี้ใบที่ควรเปิดอ่านก่อน (ไม่ตัดสิน — ต้องอ่านเรื่องแล้วติดป้ายเอง)
// ผลทุกใบพิมพ์ลง --out (JSON) ให้เลนไล่
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { playLife, mixSeed } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const n = Number(arg('--n', 500)), seed = Number(arg('--seed', 1));
const out = arg('--out', null);
const tagsPath = arg('--tags', fileURLToPath(new URL('./lane-tags.json', import.meta.url)));
const MIN_LIVES = 50;       // สายที่ชีวิตน้อยกว่านี้ รายงานแต่ไม่ตัดสิน
const MAX_PER_LIFE = Number(arg('--max', 0.5)); // เฉลี่ยใบไม่ตรงสาย/ชีวิต ต่อสาย (ตั้งเป้าจริงหลังกวาด — เจ้าของเคาะ)
const SKEW_MIN = 20, SKEW_SHARE = 0.8, SKEW_LIFT = 1.4; // ใบไม่มีป้ายออก ≥20 ครั้ง · ≥80% อยู่สายเดียว (ไม่ใช่ none) · และสูงกว่าสัดส่วนของสายนั้นในทุกใบ ≥1.4 เท่า (trade เป็นส่วนใหญ่ของชีวิต ไม่เทียบฐานจะท่วมรายการ)
const LANES = ['gov', 'army', 'police', 'private', 'trade', 'hunter', 'none'];
const WORK_STAGES = new Set(['ทำงาน', 'กลางคน']);

const tags = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
const groups = tags.groups ?? {};
const specOf = (id) => {
  const t = tags.cards?.[id];
  if (!t) return null;
  if (Array.isArray(t)) return { fit: t, owner: false };
  const g = groups[t];
  if (!g) throw new Error(`ป้ายใบ ${id}: ไม่มีกลุ่ม ${t}`);
  return g;
};

const content = loadContent();
const byId = new Map(content.events.map((e) => [e.id, e]));
for (const id of Object.keys(tags.cards ?? {})) {
  const e = byId.get(id);
  if (!e) throw new Error(`ป้ายใบ ${id}: ไม่มีการ์ดนี้ใน content`);
  if (!WORK_STAGES.has(e.stage)) throw new Error(`ป้ายใบ ${id}: ไม่ใช่การ์ดวัยทำงาน (${e.stage})`);
}

const lane = Object.fromEntries([...LANES, 'owner'].map((l) => [l, { lives: 0, cards: 0, tagged: 0, mis: 0, per: [] }]));
const cardMis = new Map();   // id → { n, by: Map<lane,count> }
const cardAll = new Map();   // id → Map<lane,count> (ทุกใบวัยทำงาน)
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);

for (const bot of Object.values(BOTS)) {
  for (let i = 0; i < n; i++) {
    const life = new Map(); // key → { cards, tagged, mis }
    const slot = (k) => life.get(k) ?? life.set(k, { cards: 0, tagged: 0, mis: 0 }).get(k);
    playLife(mixSeed(seed, i), content, bot, (card, st) => {
      if (card.kind !== 'event' || !WORK_STAGES.has(card.stage) || st.workFrom === null) return;
      const e = byId.get(card.id);
      if (!e) return;
      const L = st.ladder?.id ?? 'none';
      const owner = !!st.flags.own_business;
      const keys = owner ? [L, 'owner'] : [L];
      for (const k of keys) slot(k).cards++;
      bump(cardAll.get(card.id) ?? cardAll.set(card.id, new Map()).get(card.id), L);
      const spec = specOf(card.id);
      if (!spec) return;
      for (const k of keys) slot(k).tagged++;
      // คนธง own_business: ใช้ได้เฉพาะเมื่อกลุ่มอนุญาต owner · ไม่งั้นนับไม่ตรงที่แถว owner (และสายของตัวเองถ้าสายนั้นไม่อยู่ใน fit)
      const laneBad = !spec.fit.includes(L);
      const ownerBad = owner && !spec.owner;
      if (laneBad && !(owner && spec.owner)) slot(L).mis++;
      if (ownerBad) slot('owner').mis++;
      if (laneBad && !(owner && spec.owner) || ownerBad) {
        const c = cardMis.get(card.id) ?? cardMis.set(card.id, { n: 0, by: new Map() }).get(card.id);
        c.n++;
        bump(c.by, ownerBad && !laneBad ? 'owner' : L);
      }
    });
    for (const [k, g] of life) {
      const t = lane[k] ?? (lane[k] = { lives: 0, cards: 0, tagged: 0, mis: 0, per: [] });
      t.lives++; t.cards += g.cards; t.tagged += g.tagged; t.mis += g.mis; t.per.push(g.mis);
    }
  }
}

const p90 = (a) => (a.length ? [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.ceil(0.9 * a.length) - 1)] : 0);
const nTag = Object.keys(tags.cards ?? {}).length;
console.log(`การ์ดวัยทำงานไม่ตรงสาย · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · ป้ายสายต่อใบ ${nTag} ใบ (${tagsPath.split(/[\\/]/).pop()})`);
console.log('\nสาย      ชีวิต   การ์ด  ติดป้าย  ไม่ตรง  เฉลี่ย/ชีวิต  p90');
for (const k of [...LANES, 'owner']) {
  const t = lane[k];
  if (!t.lives) continue;
  console.log(`${k.padEnd(8)}${String(t.lives).padStart(6)}${String(t.cards).padStart(8)}${String(t.tagged).padStart(9)}${String(t.mis).padStart(8)}${(t.mis / t.lives).toFixed(3).padStart(13)}${String(p90(t.per)).padStart(5)}`);
}
console.log('(ชีวิตต่อสาย = ชีวิตที่มีการ์ดวัยทำงาน ≥1 ใบตอนอยู่สายนั้น · ชีวิตเดียวเปลี่ยนสายนับทั้งสองสาย · owner = มีธง own_business ซ้อนกับสายปกติ)');

const misList = [...cardMis].sort((a, b) => b[1].n - a[1].n);
console.log(`\nใบที่ออกให้คนนอกสาย ${misList.length} ใบ (id · ครั้ง · สายที่เจอ · ป้าย):`);
for (const [id, c] of misList.slice(0, 30)) {
  console.log(`  ${id} ${c.n} · ${[...c.by].sort((a, b) => b[1] - a[1]).map(([l, k]) => `${l}:${k}`).join(' ')} · ${JSON.stringify(tags.cards[id])}`);
}

// ใบไม่มีป้ายที่เอียงเข้าสายเดียว — ตัวช่วยไล่ ไม่ตัดสิน
const laneBase = {};
let allDraws = 0;
for (const m of cardAll.values()) for (const [l, k] of m) { laneBase[l] = (laneBase[l] ?? 0) + k; allDraws += k; }
const skew = [];
for (const [id, m] of cardAll) {
  if (specOf(id)) continue;
  const tot = [...m.values()].reduce((s, x) => s + x, 0);
  if (tot < SKEW_MIN) continue;
  const [top, k] = [...m].sort((a, b) => b[1] - a[1])[0];
  if (top === 'none' || k / tot < SKEW_SHARE || k / tot < SKEW_LIFT * (laneBase[top] / allDraws)) continue;
  skew.push({ id, lane: top, share: k / tot, n: tot, when: byId.get(id).when ?? null });
}
skew.sort((a, b) => b.n - a.n);
console.log(`\nใบไม่มีป้ายที่ออกให้สายเดียว ≥${SKEW_SHARE * 100}% (ออก ≥${SKEW_MIN} ครั้ง · ไม่นับ none · สูงกว่าฐานสาย ≥${SKEW_LIFT} เท่า) ${skew.length} ใบ — อ่านเรื่องแล้วติดป้าย (ใบที่มี when.occupation/ladder อยู่แล้วเป็นปกติ):`);
for (const s of skew.slice(0, 40)) console.log(`  ${s.id} ${s.lane} ${(s.share * 100).toFixed(0)}% (${s.n})${s.when?.occupation || s.when?.ladder ? ' [มี when]' : ''}`);

if (out) {
  fs.writeFileSync(out, JSON.stringify({
    n, seed, tags: nTag,
    lanes: Object.fromEntries(Object.entries(lane).filter(([, t]) => t.lives).map(([k, t]) => [k, { lives: t.lives, cards: t.cards, tagged: t.tagged, mis: t.mis, perLife: +(t.mis / t.lives).toFixed(4) }])),
    mismatch: misList.map(([id, c]) => ({ id, n: c.n, by: Object.fromEntries(c.by), tag: tags.cards[id] })),
    unlabeledSkew: skew,
  }, null, 1));
  console.log(`\nเขียน ${out}`);
}

let fail = 0;
const check = (label, bad, extra = '') => { console.log(`${label}${extra} → ${bad ? 'ตก' : 'ผ่าน'}`); if (bad) fail++; };
console.log('');
for (const k of [...LANES, 'owner']) {
  const t = lane[k];
  if (!t.lives) continue;
  if (t.lives < MIN_LIVES) { console.log(`${k} ชีวิต ${t.lives} < ${MIN_LIVES} · ไม่ตัดสิน`); continue; }
  check(`${k} ไม่ตรงสายเฉลี่ย ≤ ${MAX_PER_LIFE} ใบ/ชีวิต`, t.mis / t.lives > MAX_PER_LIFE, ` · ${(t.mis / t.lives).toFixed(3)} (${t.mis}/${t.lives})`);
}
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
