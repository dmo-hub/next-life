// ด่านค่าซ้อนทับ (โลกซ้อนทับ ใบ 08): บอททุกบุคลิกเล่นต่อกันหลายรุ่นแบบข้ามโลก แล้วรายงานค่าซ้อนทับของตระกูลรายรุ่น
// ฝั่งข้ามโลก: กดรับการ์ดชวนทุกใบ (ทริปไปกลับ/ถูกเรียก) · ทางเกิดจากชาติไทยเลือกต่างโลกเสมอ · จากต่างโลกกลับโลกเดิม หรืออยู่ต่ออีกรอบตามสุ่ม
// ตัวควบคุม: บุคลิกเดียวกันที่ไม่ข้ามโลกเลย (ปฏิเสธการ์ดชวน · ทางเกิดไม่เลือกต่างโลก) ค่าต้องเป็น 0 ทุกรุ่น
// ด่าน (ตก = exit 1):
//   (1) บัญชีเหยียบซ้ำ: ค่าที่ขึ้นระหว่างชีวิต = ทริปกลับบ้านของชีวิตนั้น · ค่าที่ขึ้นตอนเกิดใหม่ = 1 เมื่อรอบปรโลกมีชาติต่างโลกคั่น ไม่งั้น 0
//       ⇒ ทริปหลง · เกิดในโลกปกติต่อกัน · ปรโลกคั่นชาติ ไม่เพิ่ม · ชาติต่างโลกติดกันหลายรอบกลับครั้งเดียว +1
//   (2) ฝั่งข้ามโลกมีตระกูลที่ค่า > 0 · มีตัวอย่างทั้งเกิดกลับและทริปกลับบ้าน — ไม่มี = ตัววัดไม่ได้วัดอะไร
//   (3) ตัวควบคุมไม่ข้ามโลก = 0 ทุกรุ่น
//   (4) ค่าไม่ลดระหว่างรุ่นในทุกบอท
//   (5) เริ่มตระกูลใหม่ (newLife ไม่มี heir) = 0 แม้ตระกูลก่อนหน้าค่าสูง
import { playLife, playAfterlife, nextLife, newLife, mixSeed, overlapOf, PATHS, ENTRY } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 200);
const gens = opt('gens', 4);
const seed = opt('seed', 1);
const content = loadContent();

const P_ISEKAI = PATHS.findIndex((p) => p.id === 'isekai');
const P_REBORN = PATHS.findIndex((p) => p.id === 'reborn');
// จากต่างโลกอยู่ต่ออีกรอบ — ให้มีตัวอย่างชาติต่างโลกติดกัน (ต้องได้ +1 ครั้งเดียวตอนกลับ)
const STAY = 0.3;
const open = (card, k) => k >= 0 && k < card.choices.length && !card.locked?.[k];
const randomOpen = (card, rng) => {
  const ks = card.choices.map((_, k) => k).filter((k) => open(card, k));
  return ks[Math.floor(rng.next() * ks.length)];
};

// ห่อบุคลิกเดิม: การ์ดอื่นทุกใบเลือกตามบุคลิก (ส่ง .focus ต่อ) · ต่างกันแค่การ์ดชวน การ์ดทริป และการ์ดทางเกิด
const crosser = (bot) => Object.assign((card, rng, h) => {
  if (card.entry) return ENTRY.accept;
  if (card.kind === 'path') {
    if (h?.from && open(card, P_ISEKAI) && rng.next() < STAY) return P_ISEKAI;
    const want = h?.from ? P_REBORN : P_ISEKAI;
    return open(card, want) ? want : randomOpen(card, rng);
  }
  return bot(card, rng, h);
}, bot, { isekai: true, trip: randomOpen });
const stayer = (bot) => Object.assign((card, rng, h) => {
  if (card.kind === 'path') {
    const k = bot(card, rng, h);
    return k !== P_ISEKAI && open(card, k) ? k : card.choices.map((_, j) => j).find((j) => j !== P_ISEKAI && open(card, j));
  }
  return bot(card, rng, h);
}, bot);

const started = Date.now();
const rows = [];
const fails = [];
const fail = (msg) => fails.push(msg);
let resetChecked = 0;
for (const [name, base] of Object.entries(BOTS)) {
  for (const [mode, bot] of [['ข้าม', crosser(base)], ['ไม่ข้าม', stayer(base)]]) {
    const r = { name, mode, byGen: Array.from({ length: gens }, () => []), born: 0, trip: 0, lost: 0, chain: 0, bad: 0, drop: 0, families: 0, top: 0 };
    rows.push(r);
    for (let i = 0; i < n; i++) {
      let st = null;
      let prev = 0;
      for (let g = 0; g < gens; g++) {
        const start = overlapOf(st);
        const { state } = playLife(mixSeed(seed, i * 7919 + g), content, bot, null, st ?? undefined);
        const home = (state.trips ?? []).filter((t) => t.home).length;
        r.trip += home;
        if (state.tripLost) r.lost++;
        if (overlapOf(state) - start !== home) r.bad++;
        const v = overlapOf(state);
        if (v < prev) r.drop++;
        prev = v;
        r.byGen[g].push(v);
        if (g === gens - 1) break;
        const af = playAfterlife(state, bot);
        const back = af.isekaiLives.length ? 1 : 0;
        r.born += back;
        if (af.isekaiLives.length > 1) r.chain++;
        if (overlapOf(af.heir) - v !== back) r.bad++;
        st = nextLife(af);
        if (overlapOf(st) !== overlapOf(af.heir)) r.bad++;
      }
      if (prev > 0) {
        r.families++;
        r.top = Math.max(r.top, prev);
        // เริ่มตระกูลใหม่หลังตระกูลที่ค่าสูง — ไม่มี heir จึงต้องเป็น 0 และไม่มีช่อง overlap ในสถานะ
        const fresh = newLife(mixSeed(seed ^ 0x0e1a9, i), content);
        resetChecked++;
        if (overlapOf(fresh) !== 0 || 'overlap' in fresh) fail(`${name}: เริ่มตระกูลใหม่ได้ค่า ${overlapOf(fresh)}`);
      }
    }
    if (r.bad) fail(`${name} ${mode}: บัญชีเหยียบซ้ำไม่ตรง ${r.bad} จุด`);
    if (r.drop) fail(`${name} ${mode}: ค่าลดระหว่างรุ่น ${r.drop} ตระกูล`);
    if (mode === 'ไม่ข้าม' && r.byGen.some((vs) => vs.some((v) => v !== 0))) fail(`${name} ไม่ข้าม: ค่าไม่เป็น 0`);
  }
}

const cross = rows.filter((r) => r.mode === 'ข้าม');
const sum = (k) => cross.reduce((s, r) => s + r[k], 0);
if (!sum('families')) fail('ฝั่งข้ามโลกไม่มีตระกูลไหนค่า > 0');
if (!sum('born')) fail('ไม่มีตัวอย่างเกิดกลับโลกปกติหลังชาติต่างโลก');
if (!sum('trip')) fail('ไม่มีตัวอย่างทริปกลับบ้าน');
if (!resetChecked) fail('ไม่ได้ตรวจเริ่มตระกูลใหม่สักครั้ง');

const mean = (vs) => (vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : 0);
const pct = (c, t) => `${t ? ((c / t) * 100).toFixed(1) : '0.0'}%`;
console.log(`ด่านค่าซ้อนทับ · ${Object.keys(BOTS).join(' · ')} × ${n} ตระกูล × ${gens} รุ่น × (ข้าม + ไม่ข้าม) · seed ${seed} · ${((Date.now() - started) / 1000).toFixed(0)} วิ\n`);
const genHead = Array.from({ length: gens }, (_, g) => `รุ่น ${g + 1}`.padStart(13)).join('');
console.log(`${'บอท'.padEnd(14)}${'แบบ'.padEnd(9)}${genHead}  เกิดกลับ  ทริปกลับ  ทริปหลง  ต่างโลกติดกัน  ตระกูล>0  สูงสุด`);
for (const r of rows) {
  const cells = r.byGen.map((vs) => `${mean(vs).toFixed(2)}/${pct(vs.filter((v) => v > 0).length, vs.length)}`.padStart(13)).join('');
  console.log(`${r.name.padEnd(14)}${r.mode.padEnd(9)}${cells}  ${String(r.born).padStart(8)}  ${String(r.trip).padStart(8)}  ${String(r.lost).padStart(7)}  ${String(r.chain).padStart(13)}  ${pct(r.families, n).padStart(8)}  ${String(r.top).padStart(6)}`);
}
console.log('  (ช่องรุ่น = ค่าเฉลี่ยตอนจบชีวิต / สัดส่วนตระกูลที่ค่า > 0)');

// กระจายค่าตอนจบรุ่นสุดท้ายของฝั่งข้ามโลก — ใบขั้นของค่าซ้อนทับใช้ตั้งเกณฑ์
const last = cross.flatMap((r) => r.byGen[gens - 1]);
const dist = new Map();
for (const v of last) dist.set(Math.min(v, 6), (dist.get(Math.min(v, 6)) ?? 0) + 1);
console.log(`\nค่าตอนจบรุ่น ${gens} (ฝั่งข้ามโลก ${last.length} ตระกูล): ${[...dist.keys()].sort((a, b) => a - b).map((k) => `${k === 6 ? '6+' : k} = ${pct(dist.get(k), last.length)}`).join(' · ')}`);

console.log(`\nตัวควบคุมไม่ข้ามโลก: ${rows.filter((r) => r.mode === 'ไม่ข้าม').every((r) => r.byGen.every((vs) => vs.every((v) => v === 0))) ? '0 ทุกรุ่นทุกบอท ผ่าน' : 'มีค่า > 0 ตก'}`);
console.log(`เริ่มตระกูลใหม่ตรวจ ${resetChecked} ครั้ง`);
if (fails.length) {
  for (const f of fails) console.log(`✗ ${f}`);
  console.log(`ด่านค่าซ้อนทับตก ${fails.length} ข้อ`);
  process.exitCode = 1;
} else {
  console.log(`ด่านค่าซ้อนทับผ่าน: บัญชีเหยียบซ้ำตรงทุกชีวิต · เกิดกลับ ${sum('born')} · ทริปกลับบ้าน ${sum('trip')} · ทริปหลงไม่นับ ${sum('lost')} · ค่าไม่ลด · ตัวควบคุม = 0`);
}
