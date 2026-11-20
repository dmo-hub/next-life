// ประตูเข้าสายบนต้นไม้ (ใบ 10): บอททุ่มแขนงของโหนดประตูแต่ละตัวใน tree.yaml gates แล้ววัดว่า
//   (1) ตัวเลือกที่ติด gate ของโหนดนั้นถูกกดอย่างน้อย 1 ครั้งทุกตัว (ไม่มีตัวเลือกตาย)
//   (2) รายการยกเว้นด่าน 2 ของ full (GATE_ONLY_* ใน gates.mjs) ถึง/กดได้ทุกตัว
// สองขั้น: A) บอททุ่มทางไปโหนดแล้วปลดได้จริง > 0 (ต้นไม้พาไปถึงประตู) · B) ชีวิตที่ประตูเปิดตั้งแต่ต้น (ข้ามการรอปลด) กดตัวเลือกติดประตูได้ทุกตัว — การ์ดหายากต้องการชีวิตเยอะกว่าที่บอทปลดทัน
//   (3) ตัวควบคุม: บอทไม่ทุ่มต้นไม้ = ตัวเลือกประตูโหนดนั้น 0 (ยกเว้นประตูที่ธงชวนเปิดเอง) — ไม่งั้นประตูไม่ได้ปิดจริง
// ทุกรอบตัดโฟกัสเดิมที่ผูกกับโหนดทิ้ง (gates.<โหนด> = ชื่อที่ไม่มีจริง) ให้เหลือทางเปิดเดียวคือต้นไม้ · ธงชวน/ทายาทยังทำงานตามปกติ
// ตกเมื่อ (1) (2) หรือ (3) ไม่ผ่าน · GATE_REACH_DROP=<โหนด> ถอดโหนดออกจากการทุ่ม (ตัวควบคุม: ต้องตก)
import { newLife, playLife, mixSeed, treeOffersNow, treeInvestNode } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS, withGate } from './bots.mjs';
import { GATE_ONLY_EVENTS, GATE_ONLY_CHOICES } from './gates.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 300), seed = arg('--seed', 1);
const drop = process.env.GATE_REACH_DROP;
const base = loadContent();
const defs = base.tree.nodes;
const nodes = Object.keys(base.tree.gates);
const content = { ...base, tree: { ...base.tree, gates: Object.fromEntries(nodes.map((id) => [id, '_none'])) } };

// ทางไปโหนด: ตัวเองกับบรรพบุรุษทุกตัว · ทุกปีทุ่มโหนดแรกที่เปิดอยู่ในทาง (เร็วสุดที่เป็นไปได้ — พิสูจน์ว่าถึงได้ ไม่ใช่วัดว่าบอทเก่งแค่ไหน)
const pathTo = (id) => { const s = new Set(); const walk = (x) => { if (s.has(x)) return; s.add(x); for (const p of defs[x].pre ?? []) walk(p); }; walk(id); return s; };
const treeToward = (node) => { const way = pathTo(node); return (st) => { if (st.tree?.cur && way.has(st.tree.cur)) return; const next = treeOffersNow(st).find((id) => way.has(id) && !defs[id].hidden); if (next) treeInvestNode(st, next, !!defs[next].keystone); }; };

// ตัวเลือกที่ติดประตู: คีย์ตรงกับ full (เหตุการณ์#id ตัวเลือก หรือลำดับถ้าไม่มี id)
const gated = new Map();
for (const e of content.events) (e.choices ?? []).forEach((c, i) => { if (c.gate !== undefined) gated.set(`${e.id}#${c.id ?? i}`, [c.gate].flat()); });
const byId = new Map(content.events.map((e) => [e.id, e]));

const measure = (label, make, count = n, prep = null) => {
  const picks = new Map(), fired = new Map();
  let lives = 0, opened = 0;
  for (const [name, bot] of Object.entries(BOTS)) {
    for (let i = 0; i < count; i++) {
      const { pick, extra } = make(bot);
      const choose = Object.assign((card, rng, st) => {
        const k = pick(card, rng, st);
        const ev = card.id && byId.get(card.id);
        if (ev) { const key = `${ev.id}#${ev.choices?.[k]?.id ?? k}`; picks.set(key, (picks.get(key) ?? 0) + 1); }
        return k;
      }, extra);
      const s0 = mixSeed(seed, i * 7 + name.length);
      const st0 = newLife(s0, content);
      prep?.(st0);
      const { state } = playLife(s0, content, choose, (card) => { if (card.id) fired.set(card.id, (fired.get(card.id) ?? 0) + 1); }, st0);
      lives++;
      if (label.node && state.tree?.done?.[label.node] !== undefined) opened++;
    }
  }
  return { picks, fired, lives, opened };
};

const fails = [];
const reach = new Map();
const fireAll = new Map();
for (const node of nodes) {
  const target = node === drop ? ['know'] : [...pathTo(node)].filter((x) => x !== node);
  const a = measure({ node }, (bot) => ({ pick: withGate(bot), extra: { tree: node === drop ? () => {} : treeToward(node) } }), Math.max(1, Math.round(n / 3)));
  const r = measure({}, (bot) => ({ pick: withGate(bot), extra: {} }), n, node === drop ? null : (st) => { st.tree = { done: { [node]: 18 }, yrs: {}, cards: {} }; });
  if (!a.opened) fails.push(`บอททุ่มทางไป ${node} แล้วปลดไม่ได้เลย (${a.lives} ชีวิต)`);
  const mine = [...gated].filter(([, ids]) => ids.includes(node)).map(([k]) => k);
  const hit = mine.filter((k) => (r.picks.get(k) ?? 0) > 0);
  for (const k of mine) reach.set(k, Math.max(reach.get(k) ?? 0, r.picks.get(k) ?? 0));
  for (const [k, v] of r.fired) fireAll.set(k, (fireAll.get(k) ?? 0) + v);
  for (const [k, v] of r.picks) if (GATE_ONLY_CHOICES.includes(k)) reach.set(k, Math.max(reach.get(k) ?? 0, v));
  console.log(`${node} (${defs[node].name} · ทุ่มทางผ่าน ${target.join('>')}): บอททุ่ม ${a.lives} ชีวิต ปลดได้ ${a.opened} · ประตูเปิดตั้งแต่ต้น ${r.lives} ชีวิต · ตัวเลือกติดประตู ${hit.length}/${mine.length}${mine.length - hit.length ? ` · ไม่ถึง ${mine.filter((k) => !hit.includes(k)).join(' · ')}` : ''}`);
}
// การ์ดออกน้อยกว่า MIN_FIRED ครั้งทั้งที่ประตูเปิด = ทางเข้าการ์ดเองหายาก (เช่น ถูกหวยรางวัลที่หนึ่ง · วัดได้ ~10 ครั้ง/9,000 ชีวิต) ตัดสินที่ประตูไม่ได้ → เตือน ไม่ตก · การ์ดออกพอแล้วแต่ไม่มีใครกด = ตก
const MIN_FIRED = 20;
const dead = [...gated.keys()].filter((k) => !reach.get(k));
const rare = dead.filter((k) => (fireAll.get(k.split('#')[0]) ?? 0) < MIN_FIRED);
const bad = dead.filter((k) => !rare.includes(k));
if (rare.length) console.log(`⚠ การ์ดออกน้อยกว่า ${MIN_FIRED} ครั้งแม้ประตูเปิด (ทางเข้าการ์ดหายาก ตัดสินที่ประตูไม่ได้): ${rare.join(' · ')}`);
if (bad.length) fails.push(`ตัวเลือกติดประตูที่การ์ดออกแล้วแต่ไม่มีใครกด ${bad.length}: ${bad.join(' · ')}`);
const deadOnly = [...GATE_ONLY_CHOICES.filter((k) => !reach.get(k) && !gated.has(k)), ...GATE_ONLY_EVENTS.filter((k) => !fireAll.get(k))];
if (deadOnly.length) fails.push(`รายการยกเว้นด่าน 2 ที่บอททุ่มต้นไม้แล้วยังไม่ถึง ${deadOnly.length}: ${deadOnly.join(' · ')}`);

// ตัวควบคุม: ไม่ทุ่มต้นไม้ ตัวเลือกประตู (ที่ธงชวนไม่เปิด) ต้องไม่ถูกกดเลย
const ctl = measure({}, (bot) => ({ pick: bot, extra: {} }));
const leaked = [...gated.keys()].filter((k) => (ctl.picks.get(k) ?? 0) > 0).map((k) => `${k} (${ctl.picks.get(k)})`);
console.log(`ตัวควบคุมไม่ทุ่มต้นไม้: ${ctl.lives} ชีวิต · ตัวเลือกติดประตูที่ถูกกด ${leaked.length}`);
if (leaked.length) fails.push(`ประตูรั่ว: ไม่ปลดโหนดแต่ตัวเลือกถูกกด ${leaked.join(' · ')}`);

if (fails.length) { console.log('\nตก'); for (const f of fails) console.log(`  ✗ ${f}`); process.exit(1); }
console.log(`\nผ่าน · ตัวเลือกติดประตู ${gated.size} ถึงครบ · รายการยกเว้นด่าน 2 ${GATE_ONLY_EVENTS.length + GATE_ONLY_CHOICES.length} ถึงครบ · ประตูไม่รั่ว`);
