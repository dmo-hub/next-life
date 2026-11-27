// ตัวสุ่มการ์ดกองสุ่มออกตรงน้ำหนักไหม — ด่านผลปลายทางเห็นแค่ "เลขเพี้ยน" ด่านนี้ชี้ที่ตัวเลือกการ์ดตรง ๆ
// A = ตัวสุ่มล้วนบนกองสมมุติ · B = ทุกครั้งที่ชีวิตจริงจั่วกอง จดกอง + น้ำหนัก + ใบที่ได้ แล้วเทียบ chi-square (p<0.01)
// --n จำนวนชีวิตของ B · --draws จำนวนจั่วของ A · --top แถวตารางคาด/จริง (0 = ทุกใบ) · --card id[,id] ดูเฉพาะใบ
import { registerHooks } from 'node:module';

// ดักตอนโหลดแทนการแก้ engine หรือเขียนตัวกรองกองซ้ำ — สำเนาตัวกรองจะบังบั๊กที่ด่านนี้ตามหา · บรรทัดเป้าเปลี่ยนรูป = ล้มดัง ไม่วัดเงียบ ๆ จากศูนย์
const PICK = /return weighted\(st\.rng, pool, (pool\.map\(.*\))\);/g;
registerHooks({
  load(url, context, nextLoad) {
    const out = nextLoad(url, context);
    if (!url.endsWith('/src/engine/life.mjs')) return out;
    const source = String(out.source);
    const hits = source.match(PICK)?.length ?? 0;
    if (hits !== 1) throw new Error(`pick-fair: จุดจั่วกองใน life.mjs ตรง ${hits} ที่ ต้อง 1`);
    return { ...out, source: source.replace(PICK, (_, w) => `const w = ${w}; const got = weighted(st.rng, pool, w); globalThis.__pickTap?.(stage, pool, w, got); return got;`) };
  },
});

const { playLife, mixSeed, STAGES } = await import('../src/engine/index.mjs');
const { weighted } = await import('../src/engine/life.mjs');
const { makeRng } = await import('../src/engine/rng.mjs');
const { loadContent } = await import('../src/node/load.mjs');
const { random: randomBot } = await import('./bots.mjs');

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const n = Number(opt('n', 300));
const seed = Number(opt('seed', 1));
const draws = Number(opt('draws', 200000));
const top = Number(opt('top', 15));
const only = opt('card')?.split(',');

const Z99 = 2.326348;
const MIN_EXPECTED = 5;
const PIT_BINS = 20;
const TOY = [1, 2, 3, 5, 8, 13, 20.5, 40.25];
const BIAS = 1.2;

// Wilson–Hilferty: ค่าวิกฤต chi-square ที่ p = 0.01
const critical = (df) => df * (1 - 2 / (9 * df) + Z99 * Math.sqrt(2 / (9 * df))) ** 3;
const chi = (obs, exp) => obs.reduce((s, o, i) => s + (o - exp[i]) ** 2 / exp[i], 0);
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const f = (v) => v.toFixed(2);
let failed = false;
const verdict = (label, stat, df, wantFail = false) => {
  const over = stat > critical(df);
  const ok = over === wantFail;
  failed ||= !ok;
  console.log(`${ok ? 'ผ่าน' : 'ตก  '}  ${label} · chi-square ${f(stat)} · df ${df} · วิกฤต ${f(critical(df))}${wantFail ? ' (ตัวควบคุม ต้องเกิน)' : ''}`);
};

// ── ด่าน A ──
function toy(sampled) {
  const rng = makeRng(seed);
  const ids = TOY.map((_, i) => i);
  const obs = ids.map(() => 0);
  for (let i = 0; i < draws; i++) obs[weighted(rng, ids, sampled)]++;
  return chi(obs, TOY.map((w) => (draws * w) / sum(TOY)));
}
console.log(`ด่าน A ตัวสุ่มล้วน · กอง ${TOY.length} ใบ · จั่ว ${draws.toLocaleString('en-US')} · seed ${seed}`);
verdict('น้ำหนักตรง', toy(TOY), TOY.length - 1);
// ปลอมทีละใบครบทุกใบ — ใบน้ำหนักน้อยสุดคือเคสจับยากสุด
TOY.forEach((w, k) => verdict(`ใบ ${k} (น้ำหนัก ${w}) ปลอม ×${BIAS}`, toy(TOY.map((x, i) => (i === k ? x * BIAS : x))), TOY.length - 1, true));

// ── ด่าน B ──
// กองจริงแทบไม่ซ้ำหน้ากัน (ใบที่ออกแล้วถูกตัด) จึงรวมค่าคาด Σp ต่อใบข้ามทุกครั้งที่จั่ว · ตัวควบคุม = ค่าคาดแบบไม่สนน้ำหนัก
const tally = () => ({ stage: new Map(), pit: new Array(PIT_BINS).fill(0) });
const real = tally(), flat = tally();
const shown = new Map();
const pitRng = makeRng(seed ^ 0x2f6e2b1d);
let picks = 0;
function record(t, stage, pool, w, got, v) {
  let cards = t.stage.get(stage);
  if (!cards) t.stage.set(stage, (cards = new Map()));
  const total = sum(w);
  let below = 0, found = false;
  pool.forEach((e, i) => {
    let c = cards.get(e.id);
    if (!c) cards.set(e.id, (c = { exp: 0, obs: 0 }));
    const p = w[i] / total;
    c.exp += p;
    if (e === got) {
      found = true;
      c.obs++;
      // สุ่มจุดในช่องของใบที่ได้ ⇒ ถ้าตัวสุ่มตรง ค่านี้กระจายสม่ำเสมอ 0–1 ไม่ว่ากองหน้าตาอย่างไร
      t.pit[Math.min(PIT_BINS - 1, Math.floor((below + v * p) * PIT_BINS))]++;
    }
    below += p;
  });
  if (!found) throw new Error(`pick-fair: ใบที่ได้ไม่อยู่ในกอง (${stage})`);
}
globalThis.__pickTap = (stage, pool, w, got) => {
  picks++;
  const v = pitRng.next();
  record(real, stage, pool, w, got, v);
  record(flat, stage, pool, pool.map(() => 1), got, v);
};

const content = loadContent();
for (let i = 0; i < n; i++) {
  playLife(mixSeed(seed, i), content, randomBot, (card) => {
    if (card.kind === 'event') shown.set(card.id, (shown.get(card.id) ?? 0) + 1);
  });
}

// ใบค่าคาดต่ำกว่าเกณฑ์รวมเป็นช่องเดียวต่อช่วงวัย — chi-square ใช้กับช่องเล็กไม่ได้
// แบ่งช่องตามค่าคาดจริงเสมอ รวมตอนตรวจตัวควบคุม — แบ่งตามค่าคาดปลอม ชีวิตน้อยจะยุบเหลือไม่กี่ช่องจนจับไม่ได้
function bins(cards, shape) {
  const obs = [], exp = [];
  let restObs = 0, restExp = 0;
  for (const [id, c] of cards) {
    if (shape.get(id).exp >= MIN_EXPECTED) {
      obs.push(c.obs);
      exp.push(c.exp);
    } else {
      restObs += c.obs;
      restExp += c.exp;
    }
  }
  if (restExp >= MIN_EXPECTED || !exp.length) {
    obs.push(restObs);
    exp.push(restExp);
  } else {
    obs[obs.length - 1] += restObs;
    exp[exp.length - 1] += restExp;
  }
  return { obs, exp };
}
function totals(t, print) {
  let stat = 0, df = 0;
  for (const { name } of STAGES) {
    const cards = t.stage.get(name);
    if (!cards) continue;
    const { obs, exp } = bins(cards, real.stage.get(name));
    if (obs.length < 2) continue;
    const x = chi(obs, exp);
    stat += x;
    df += obs.length - 1;
    if (print) console.log(`      ${name.padEnd(9)} จั่ว ${String(sum(obs)).padStart(6)} · ใบในกอง ${String(cards.size).padStart(4)} · ช่อง ${String(obs.length).padStart(4)} · chi-square ${f(x).padStart(8)} · วิกฤต ${f(critical(obs.length - 1))}`);
  }
  return { stat, df };
}
const pitChi = (t) => chi(t.pit, t.pit.map(() => picks / PIT_BINS));

console.log(`\nด่าน B ในเกมจริง · ชีวิต ${n} · seed ${seed} · จั่วกอง ${picks.toLocaleString('en-US')} ครั้ง`);
if (!picks) {
  console.log('ตก    ไม่เจอการจั่วกองเลย');
  process.exit(1);
}
const a = totals(real, true);
const b = totals(flat, false);
verdict('รายใบ (รวมทุกช่วงวัย)', a.stat, a.df);
verdict(`ตำแหน่งในกอง ${PIT_BINS} ช่อง`, pitChi(real), PIT_BINS - 1);
verdict('รายใบ เทียบค่าคาดไม่สนน้ำหนัก', b.stat, b.df, true);
// ตัวสุ่มที่ตรงน้ำหนักทำให้ตำแหน่งสม่ำเสมอเฉพาะเมื่อค่าคาดใช้น้ำหนักจริง
verdict('ตำแหน่ง เทียบค่าคาดไม่สนน้ำหนัก', pitChi(flat), PIT_BINS - 1, true);

// ── ตารางคาดการณ์ ──
// จับได้ ≠ ออกจริง: ใบที่จับได้ถูกทิ้งเมื่อปีนั้นติดโควตาเรื่องต่อ และใบเดียวกันออกทางนัด/เรื่องต่อได้โดยไม่ผ่านกอง
const rows = [...real.stage].flatMap(([stage, cards]) => [...cards].map(([id, c]) => ({ stage, id, ...c, z: (c.obs - c.exp) / Math.sqrt(c.exp) })));
rows.sort((x, y) => Math.abs(y.z) - Math.abs(x.z));
// ใบค่าคาดน้อย จับได้ครั้งเดียวก็ได้ z สูง — จัดอันดับเฉพาะใบที่ค่าคาดพอ
const ranked = rows.filter((r) => r.exp >= MIN_EXPECTED);
const picked = only ? rows.filter((r) => only.includes(r.id)) : top > 0 ? ranked.slice(0, top) : rows;
const per = (v) => f((v / n) * 100).padStart(7);
console.log(`\nครั้งต่อ 100 ชีวิต (${only ? 'ใบที่ขอ' : top > 0 ? `เบี้ยวสุด ${picked.length} จาก ${ranked.length} ใบที่ค่าคาด ≥ ${MIN_EXPECTED}`: `ทุกใบ ${rows.length}`}) · คาด = จาก weight · จับได้ = จากกอง · ออกจริง = ทุกทางเข้า`);
console.log('   คาด  จับได้  ออกจริง  z      ช่วงวัย   id');
for (const r of picked) console.log(`${per(r.exp)} ${per(r.obs)} ${per(shown.get(r.id) ?? 0)}  ${f(r.z).padStart(5)}  ${r.stage.padEnd(9)} ${r.id}`);
for (const id of only ?? []) if (!rows.some((r) => r.id === id)) console.log(`      -  ${id} ไม่เคยอยู่ในกองที่จั่วเลยใน ${n} ชีวิต`);

process.exit(failed ? 1 : 0);
