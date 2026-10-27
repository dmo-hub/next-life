// ค่าสถานะขับการ์ด (B112): โอกาสสำเร็จของตัวเลือกที่ผูกค่าสถานะ ต้องขยับตามค่าทุกช่วง ไม่ใช่กระโดดแค่ที่ 30/70
// อ่านโอกาสจาก successPct ตัวเดียวกับป้ายบนปุ่ม (ไม่สุ่มซ้ำ) · แยกช่วงค่า 0–29 · 30–49 · 50–69 · 70–100 · ทิศตามตัวคูณ (v > 1 = ค่าสูงช่วย)
import { playLife, mixSeed, successPct, STAT_KEYS, STAT_LABELS, STAT_CURVE } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 2000), seed = arg('--seed', 1);
const content = loadContent();
const byId = Object.fromEntries(content.events.map((e) => [e.id, e]));
const EDGES = [30, 50, 70];
const bucket = (x) => EDGES.filter((e) => x >= e).length;
const acc = Object.fromEntries(STAT_KEYS.map((k) => [k, [0, 1, 2, 3].map(() => ({ up: [0, 0], down: [0, 0] }))]));
let clipped = 0, seen = 0;

for (const [, bot] of Object.entries(BOTS)) {
  for (let i = 0; i < n / Object.keys(BOTS).length; i++) {
    playLife(mixSeed(seed, i), content, bot, (card, st) => {
      const ev = card.id && byId[card.id];
      if (!ev?.choices) return;
      for (const c of ev.choices) {
        if (!c.outcomes?.some((o) => o.ok) || c.outcomes.every((o) => o.ok)) continue;
        if (c.outcomes.some((o) => o.multipliers?.karma || o.multipliers?.wish)) continue;
        const ok = c.outcomes.find((o) => o.ok && o.multipliers?.stats);
        if (!ok) continue;
        const pct = successPct(st, c);
        seen++;
        if (pct <= STAT_CURVE.okMin * 100 || pct >= STAT_CURVE.okMax * 100) clipped++;
        for (const [k, v] of Object.entries(ok.multipliers.stats)) {
          const side = acc[k]?.[bucket(st[k])]?.[v >= 1 ? 'up' : 'down'];
          if (side) { side[0] += pct; side[1]++; }
        }
      }
    });
  }
}

const fail = [];
const fmt = (s) => (s[1] ? `${(s[0] / s[1]).toFixed(1).padStart(5)}% (${s[1]})` : '      —      ');
console.log(`ตัวเลือกที่ผูกค่าสถานะ ${seen.toLocaleString('en-US')} ครั้ง · ชนเพดาน ${STAT_CURVE.okMin * 100}–${STAT_CURVE.okMax * 100}% ${clipped}`);
console.log('ค่า          ทิศ    0–29            30–49           50–69           70–100');
for (const k of STAT_KEYS) {
  for (const dir of ['up', 'down']) {
    const row = acc[k].map((b) => b[dir]);
    if (!row.some((s) => s[1])) continue;
    console.log(`${STAT_LABELS[k].padEnd(12)} ${dir === 'up' ? 'สูงช่วย' : 'ต่ำช่วย'}  ${row.map(fmt).join(' ')}`);
    // ช่วงที่มีตัวอย่างพอ (≥ 30 ครั้ง) ต้องเรียงตามทิศ
    const avg = row.filter((s) => s[1] >= 30).map((s) => s[0] / s[1]);
    const bad = avg.slice(1).filter((a, i) => (dir === 'up' ? a < avg[i] : a > avg[i])).length;
    if (bad) fail.push(`${STAT_LABELS[k]} ${dir}: กลับทิศ ${bad} ช่วง`);
  }
}
console.log(fail.length ? `\nตก: ${fail.join(' · ')}` : '\nโอกาสสำเร็จเรียงตามค่าสถานะทุกค่า → ผ่าน');
process.exit(fail.length ? 1 : 0);
