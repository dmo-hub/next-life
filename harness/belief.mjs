// harness ของสายมู (B09 · ใบ 12 ด่าน harness 6–7) บนเนื้อหาจริง
// ด่าน 6: หวยสายมู — รางวัลเล็กของบุญเต็ม ÷ 1.4% ≈ max_mult · บาปมาก = ฐานจริง · รางวัลใหญ่ไม่ขยับทุกบอท · เพดานต่อชีวิตไม่ทะลุ
// ด่าน 7: เหตุการณ์ belief ไม่เปลี่ยนอายุเฉลี่ยของบอทสุ่ม (ตัดเหตุการณ์ belief ออกทั้งชุดเป็นตัวควบคุม)
// ตัวคูณ m คำนวณตอนบอทกดซื้อจากฟังก์ชันเดียวกับแกน — harness อ่านบัญชีได้ แกนไม่เก็บ m ไว้ใน state
import { playLife, openChoices, mixSeed, makeRng, meritId, MERIT_WEIGHTS, MERIT_LEVELS, SIN_CATS, FLAG_CATS, LOTTERY_PRIZES, drawPrize, smallPrizeMult } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { lintContext } from '../src/node/lint/index.mjs';
import { LOTTERY } from '../src/node/lint/vocab.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 20000);
const seed = opt('seed', 1);
const content = loadContent();
const lotteryEvents = content.events.filter((e) => e.belief?.kind === 'lottery_numen');
const cap = Math.min(...lotteryEvents.map((e) => e.belief.cap_per_life));
const MAX_MULT = Math.max(...lotteryEvents.map((e) => e.belief.odds_modifier.max_mult));

const table = LOTTERY_PRIZES;
const rate = (small) => table.prizes.filter((p) => p.small === small).reduce((s, p) => s + p.n, 0) / table.per;
const P_SMALL = rate(true), P_BIG = rate(false);
const Z = 1.96;
// ด่านในเกม (6ข) ใช้ 3 SE: seed ตายตัวแต่เนื้อหาเปลี่ยนทุกรอบ ลำดับสุ่มจึงเลื่อน — แถบ 95% ตกเองราว 1 ใน 20 รอบทั้งที่สูตรถูก
// สูตรตรวจละเอียดที่ 6ก (4 ล้านใบต่อค่า m) อยู่แล้ว
const Z_GAME = 3;
const f = (v, d = 2) => v.toFixed(d);
const pct = (v, d = 3) => `${(v * 100).toFixed(d)}%`;
// ช่วงเชื่อมั่นของสัดส่วน (Wilson) — อัตราเล็กมากใช้ช่วงปกติแล้วติดลบ
function wilson(k, N, Z = 1.96) {
  const p = k / N, d = 1 + (Z * Z) / N;
  const mid = (p + (Z * Z) / (2 * N)) / d, half = (Z * Math.sqrt((p * (1 - p)) / N + (Z * Z) / (4 * N * N))) / d;
  return [mid - half, mid + half];
}
let fail = 0;
const verdict = (ok) => {
  if (!ok) fail++;
  return ok ? 'ผ่าน' : 'ตก';
};

// 6ก ตัวจับรางวัลของแกนล้วน: ล้านใบต่อค่า m ด้วย stream แยก — แยกความผิดของสูตรออกจากความผิดของเนื้อหา/บอท
console.log(`ด่าน 6ก ตัวจับรางวัลของแกน (ฐาน เล็ก ${pct(P_SMALL)} · ใหญ่ ${pct(P_BIG, 4)})`);
const DRAWS = 4_000_000;
for (const m of [1, MAX_MULT]) {
  const rng = makeRng(seed ^ Math.imul(m, 0x9e3779b1));
  let small = 0, big = 0;
  for (let i = 0; i < DRAWS; i++) {
    const p = drawPrize(table, m, rng.next());
    if (p?.small) small++;
    else if (p) big++;
  }
  const [s0, s1] = wilson(small, DRAWS), [b0, b1] = wilson(big, DRAWS);
  const okS = s0 / P_SMALL <= m && m <= s1 / P_SMALL, okB = b0 <= P_BIG && P_BIG <= b1;
  console.log(`  m ${m}: เล็ก ÷ ฐาน ${f(small / DRAWS / P_SMALL, 3)} (CI ${f(s0 / P_SMALL, 3)}–${f(s1 / P_SMALL, 3)}) → ${verdict(okS)} · ใหญ่ ${pct(big / DRAWS, 4)} (CI ${pct(b0, 4)}–${pct(b1, 4)}) → ${verdict(okB)}`);
}

// บอทเลือกตามป้ายบุญบาปแบบ harness บุญบาป แต่ซื้อทุกครั้งที่เจอหวยสายมู — ได้ตัวอย่างใบมากพอต่อกลุ่ม
const score = (c) =>
  (c.merit ?? []).reduce((s, t) => {
    const id = meritId(t.cat);
    if (id === 'neutral') return s;
    const v = MERIT_WEIGHTS[id] * (FLAG_CATS.includes(id) ? 1 : MERIT_LEVELS[t.level]);
    return s + (SIN_CATS.includes(id) ? -v : v);
  }, 0);
const persona = (sign) => (card, rng, st) => {
  const open = openChoices(card);
  if (st.pending.alloc) return sign ? 0 : open[rng.int(0, open.length - 1)];
  if (!sign) return open[rng.int(0, open.length - 1)];
  const s = open.map((i) => sign * score(st.pending.choices[i]));
  const best = Math.max(...s);
  const ties = open.filter((_, j) => s[j] === best);
  return ties[rng.int(0, ties.length - 1)];
};
const buyer = (pick, ms) => (card, rng, st) => {
  const ev = st.pending;
  const i = ev.belief?.kind === 'lottery_numen' ? ev.choices.findIndex((c) => c.ticket) : -1;
  if (i < 0 || card.locked?.[i]) return pick(card, rng, st);
  ms.push(smallPrizeMult(st.ledger, ev.belief.odds_modifier));
  return i;
};

const ctx = lintContext();
const texts = new Set();
const BOTS = { สายบุญ: 1, สายบาป: -1, สุ่ม: 0 };
const res = {};
for (const [name, sign] of Object.entries(BOTS)) {
  const r = { tickets: [], lives: 0, over: 0, five: 0, fiveHit: 0, maxFires: 0 };
  for (let i = 0; i < n; i++) {
    const ms = [];
    const { state } = playLife(mixSeed(seed, i), content, buyer(persona(sign), ms), (card) => card.kind === 'result' && card.type === 'B' && texts.add(card.text));
    const b = state.belief;
    if (!b?.lottery) continue;
    r.lives++;
    r.maxFires = Math.max(r.maxFires, b.lottery);
    if (b.lottery > cap || b.tickets > cap || b.draws.length !== ms.length) r.over++;
    ms.forEach((m, j) => r.tickets.push({ m, prize: b.draws[j] }));
    if (b.tickets === cap && ms.every((m) => m === MAX_MULT)) {
      r.five++;
      if (b.draws.some((id) => table.prizes.find((p) => p.id === id)?.small)) r.fiveHit++;
    }
  }
  res[name] = r;
}

const isSmall = (t) => t.prize && table.prizes.find((p) => p.id === t.prize).small;
const isBig = (t) => t.prize && !isSmall(t);
console.log(`\nด่าน 6ข หวยสายมูในเกม · ${n} ชีวิตต่อบอท · seed ${seed} · บอทซื้อทุกใบที่เจอ`);
console.log('บอท     ชีวิตที่เจอ  ใบ    m เฉลี่ย  บุญเต็ม  เล็ก ÷ ฐาน (ทุกใบ)  ใหญ่ (ครั้ง/คาด)  สูงสุด/ชีวิต');
for (const [name, r] of Object.entries(res)) {
  const N = r.tickets.length, k = r.tickets.filter(isSmall).length, big = r.tickets.filter(isBig).length;
  const full = r.tickets.filter((t) => t.m === MAX_MULT).length;
  console.log(`${name.padEnd(6)} ${String(r.lives).padStart(10)} ${String(N).padStart(6)} ${f(r.tickets.reduce((s, t) => s + t.m, 0) / N, 3).padStart(8)} ${String(full).padStart(8)} ${f(k / N / P_SMALL, 3).padStart(18)} ${`${big}/${f(N * P_BIG)}`.padStart(16)} ${String(r.maxFires).padStart(12)}`);
}

// บุญเต็ม = ใบที่ซื้อตอนบัญชีถึงสเกลอ้างอิงแล้ว (m = max_mult) ของบอทสายบุญ
const MIN_TICKETS = 200;
const ratioCheck = (label, ts, want) => {
  const N = ts.length, k = ts.filter(isSmall).length;
  const [lo, hi] = wilson(k, N, Z_GAME);
  const ok = N >= MIN_TICKETS && lo / P_SMALL <= want && want <= hi / P_SMALL;
  console.log(`${label}: ${N} ใบ (ต้อง ≥${MIN_TICKETS}) · เล็ก ${pct(k / N)} ÷ ${pct(P_SMALL, 1)} = ${f(k / N / P_SMALL, 3)} (±${Z_GAME} SE ${f(lo / P_SMALL, 3)}–${f(hi / P_SMALL, 3)} ต้องครอบ ${want}) → ${verdict(ok)}`);
};
console.log('');
ratioCheck('บุญเต็ม (สายบุญ m = max_mult)', res['สายบุญ'].tickets.filter((t) => t.m === MAX_MULT), MAX_MULT);
const sinTickets = res['สายบาป'].tickets;
ratioCheck('สายบาป (ทุกใบ)', sinTickets, 1);
const sinAbove = sinTickets.filter((t) => t.m !== 1).length;
console.log(`สายบาปได้ m ≠ 1: ${sinAbove} ใบ (ใบที่บัญชียังบวกตอนต้นชีวิตนับได้ · ต่ำกว่า 1 ห้ามมี ${sinTickets.filter((t) => t.m < 1).length}) → ${verdict(sinTickets.every((t) => t.m >= 1))}`);

// รางวัลใหญ่ทุกบอทต้องเท่าฐานจริง — นับรวมทุกใบของบอทนั้น ช่วงเชื่อมั่นครอบ 0.0168%
for (const [name, r] of Object.entries(res)) {
  const N = r.tickets.length, big = r.tickets.filter(isBig).length;
  const [lo, hi] = wilson(big, N, Z_GAME);
  console.log(`รางวัลใหญ่ ${name}: ${big} ครั้ง/${N} ใบ = ${pct(big / N, 4)} (±${Z_GAME} SE ${pct(lo, 4)}–${pct(hi, 4)} ต้องครอบ ${pct(P_BIG, 4)}) → ${verdict(lo <= P_BIG && P_BIG <= hi)}`);
}
const over = Object.values(res).reduce((s, r) => s + r.over, 0);
console.log(`เพดาน ${cap} ครั้ง/ชีวิต (lint ≤${LOTTERY.cap}): ชีวิตที่ทะลุหรือนับใบไม่ตรง ${over} → ${verdict(over === 0)}`);
const g = res['สายบุญ'];
console.log(`อ้างอิง: บุญเต็มที่เจอครบ ${cap} ใบ ถูกรางวัลเล็ก ≥1 ครั้ง ${g.fiveHit}/${g.five} = ${g.five ? pct(g.fiveHit / g.five, 1) : '-'} (ใบ 12 คาด ≈25.0% · ฐาน ≈6.8%)`);

// ข้อความผลที่แกนเขียนเองต้องผ่านคำต้องห้ามชุดเดียวกับเนื้อหา (ไม่บอกว่าเลข/บุญทำให้ถูก)
const hits = [...texts].flatMap((s) => ctx.banned.filter((b) => b.re.test(s)).map((b) => `${b.id}: ${s}`));
for (const h of hits) console.log(`  ✗ ${h}`);
console.log(`ข้อความผลของแกน ${texts.size} แบบ ผ่านคำต้องห้าม ${ctx.banned.length} ข้อ → ${verdict(!hits.length)}`);

// ด่าน 7: บอทสุ่มล้วน (ไม่บังคับซื้อ) เนื้อหาเต็ม vs ตัดเหตุการณ์ belief ทั้งหมด — ส่วนต่างอายุเฉลี่ยต้องไม่มีนัยสำคัญ
const noBelief = { ...content, events: content.events.filter((e) => !e.belief) };
const ages = (c) => {
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(playLife(mixSeed(seed, i), c, persona(0)).age);
  const mean = xs.reduce((s, x) => s + x, 0) / n;
  return { mean, v: xs.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1) };
};
const a = ages(content), b = ages(noBelief);
const d = a.mean - b.mean, se = Math.sqrt(a.v / n + b.v / n);
console.log(`\nด่าน 7: อายุเฉลี่ยบอทสุ่ม มีสายมู ${f(a.mean)} · ไม่มี ${f(b.mean)} (ตัด ${content.events.length - noBelief.events.length} เหตุการณ์) · ต่าง ${d >= 0 ? '+' : ''}${f(d)} ปี (CI 95% ${f(d - Z * se)}–${f(d + Z * se)} ต้องครอบ 0) → ${verdict(Math.abs(d) <= Z * se)}`);

if (fail) process.exitCode = 1;
