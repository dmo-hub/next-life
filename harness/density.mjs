// สัดส่วนการ์ดมีตัวเลือก (adopt-study tickets/02): ต่อชีวิตโลกหลักที่อยู่ถึง 18 — การ์ดที่กดได้ ≥ 2 ทาง ÷ (การ์ดทั้งหมด − การ์ดผล)
// การ์ดผล (result) เป็นส่วนของการเลือกที่เพิ่งกด ไม่ใช่หน้าที่ผู้เล่นแค่อ่าน จึงไม่อยู่ในตัวหาร · การ์ดในทริปต่างโลกไม่นับ (ไม่ใช่โลกหลัก)
// "กดได้" = openChoices ตัดตัวเลือกล็อก · เด็กที่ตายก่อน 18 ไม่นับต่อชีวิต (ชีวิตสั้นการ์ดระบบกินสัดส่วน)
// ด่าน: p10 ต่อชีวิตของทุกบอท ≥ MIN (เป้าเป็นของชีวิต ไม่ใช่ค่ากลาง — ชีวิตส่วนน้อยที่การ์ดเลือกบางต้องไม่หลุดเป้า) · ตัวควบคุม: ตัวหารรวมการ์ดผล (นิยามก่อนเคาะ) ต้องต่ำกว่าตัวจริงทุกบอท
// ไม่มีการ์ดค้าง (stuckCard ใน gates.mjs) ทั้งโลกหลักและทริป — lint กันได้แค่ requires ของเนื้อหา ไม่ครอบการ์ดที่แกนสร้างกับล็อก/ซ่อนจากที่อื่น
import { playLife, mixSeed, openChoices } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';
import { stuckCard } from './gates.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 2000), seed = arg('--seed', 1);
const DENSITY = { min: 0.65, adult: 18 };
const content = loadContent();
const byId = Object.fromEntries(content.events.map((e) => [e.id, e]));
const q = (xs, p) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))];
const pct = (x) => `${(100 * x).toFixed(1)}%`;

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fail++;
};
console.log(`สัดส่วนการ์ดมีตัวเลือก · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · ตัวหาร = ทั้งหมด − การ์ดผล`);
const low = [], ctlBad = [], stuck = new Map();
const stuckAt = (k) => stuck.set(k, (stuck.get(k) ?? 0) + 1);
for (const [name, bot] of Object.entries(BOTS)) {
  const share = [], shareAll = [];
  for (let i = 0; i < n; i++) {
    let all = 0, result = 0, open = 0;
    const r = playLife(mixSeed(seed, i), content, bot, (card) => {
      const why = stuckCard(card, byId);
      if (why) stuckAt(`${card.id ?? card.kind} (${why})`);
      if (card.isekai || card.trip) return;
      all++;
      if (card.kind === 'result') result++;
      if (card.choices?.length && openChoices(card).length >= 2) open++;
    });
    if (r.age < DENSITY.adult || all === result) continue;
    share.push(open / (all - result));
    shareAll.push(open / all);
  }
  const p10 = q(share, 0.1), p50 = q(share, 0.5), ctl = q(shareAll, 0.5);
  console.log(`  ${name.padEnd(10)} ${share.length} ชีวิต · p10 ${pct(p10)} · p50 ${pct(p50)} · p90 ${pct(q(share, 0.9))} · ตัวควบคุม (รวมการ์ดผล) p50 ${pct(ctl)}`);
  if (!(p10 >= DENSITY.min)) low.push(`${name} ${pct(p10)}`);
  if (!(ctl < p50)) ctlBad.push(name);
}
check(`p10 ต่อชีวิตทุกบอท ≥ ${pct(DENSITY.min)}`, low.length, low.length ? ` · ${low.join(' · ')}` : '');
check('  ตัวควบคุม: ตัวหารรวมการ์ดผลต่ำกว่าตัวจริงทุกบอท', ctlBad.length, ctlBad.length ? ` · ${ctlBad.join(' · ')}` : '');
check('ไม่มีการ์ดค้าง (ไม่มีปุ่มที่เห็นและกดได้) ทั้งโลกหลักและทริป', [...stuck.values()].reduce((a, b) => a + b, 0), stuck.size ? ` · ${[...stuck].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${v}`).join(' · ')}` : '');
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
