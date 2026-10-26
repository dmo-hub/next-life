// จังหวะการ์ด (B37a): จำนวนการ์ดต่อชีวิต + กองสุ่มช่วงไหนแห้งเมื่อจับปีละหลายรอบ → รายการกองที่ต้องเติม (B37b)
// --rounds 2,3,3,2,2,1 = จำนวนรอบต่อปีตามลำดับช่วงวัย (เด็ก → ชรา) · ไม่ใส่ = ค่าที่เกมใช้ (POOL_ROUNDS) · --off = 1 รอบทุกช่วง
// นัดค้าง = นัดที่ถึงอายุแล้วแต่ไม่ออก ขณะยังมีชีวิต (เงื่อนไขของตอนต่อไม่ผ่าน) — เรื่องหลายตอนขาดกลางทาง · ตายก่อนถึงนัดไม่นับ
import { playLife, mixSeed, STAGES, POOL_CHANCE, POOL_ROUNDS, POOL_ROUNDS_OFF, setPoolRounds, stageOf } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { gate4, gate4Long } from './gates.mjs';
import { random as randomBot } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const n = Number(opt('n', 2000));
const seed = Number(opt('seed', 1));
const names = STAGES.map((s) => s.name);
if (args.includes('--off')) setPoolRounds(POOL_ROUNDS_OFF);
else if (opt('rounds')) setPoolRounds(Object.fromEntries(opt('rounds').split(',').map((v, i) => [names[i], Number(v)])));

const content = loadContent();
const poolIds = new Set(content.events.filter((e) => e.weight && e.at_age === undefined && !e.era).map((e) => e.id));
const poolSize = Object.fromEntries(names.map((s) => [s, content.events.filter((e) => poolIds.has(e.id) && e.stage === s).length]));

const per = Object.fromEntries(names.map((s) => [s, { lives: 0, years: 0, pool: 0, dry: [], cards: 0 }]));
const cardsOver60 = [];
let missed = 0, scheduled = 0, sameYear = 0, cardsAll = 0;
const missedBy = new Map();
for (let i = 0; i < n; i++) {
  let live = new Set(), prevAge = null;
  const seen = new Set();
  const onCard = (card, st) => {
    cardsAll++;
    if (card.kind !== 'death' && card.age === prevAge) sameYear++;
    prevAge = card.age;
    if (card.kind === 'event' && poolIds.has(card.id)) per[stageOf(card.age)].pool++;
    if (card.kind !== 'death') per[stageOf(card.age)].cards++;
    const now = new Set(st.scheduled);
    for (const x of now) if (!seen.has(x)) { seen.add(x); scheduled++; }
    if (card.kind !== 'death') {
      for (const x of live) {
        if (now.has(x) || st.done[x.event]) continue;
        missed++;
        missedBy.set(x.event, (missedBy.get(x.event) ?? 0) + 1);
      }
    }
    live = now;
  };
  const { age, cards, state } = playLife(mixSeed(seed, i), content, randomBot, onCard);
  if (age > 60) cardsOver60.push(cards);
  for (const s of STAGES) {
    if (age < s.from) continue;
    const next = STAGES[STAGES.indexOf(s) + 1]?.from ?? Infinity;
    per[s.name].lives++;
    per[s.name].years += Math.min(age, next - 1) - s.from + 1;
    per[s.name].dry.push(state.poolDry?.[s.name] ?? 0);
  }
}

const f = (v) => v.toFixed(2);
const q = (xs, p) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))] ?? 0;
console.log(`ชีวิต ${n} · seed ${seed} · รอบต่อปี ${names.map((s) => `${s} ${POOL_ROUNDS[s]}`).join(' · ')}`);
console.log(gate4(cardsOver60).line);
console.log(gate4Long(cardsOver60).line);
console.log(`การ์ดอายุเดียวกับใบก่อน ${f((sameYear / cardsAll) * 100)}% ของการ์ดทั้งหมด · นัด ${scheduled.toLocaleString('en-US')} · นัดค้าง ${missed}${missedBy.size ? ` (${[...missedBy].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id, c]) => `${id} ${c}`).join(' · ')})` : ''}`);
console.log('\nช่วงวัย     รอบ  โอกาส  กอง  การ์ด/ชีวิต  กองสุ่ม/ชีวิต  รอบแห้ง/ชีวิต (เฉลี่ย · p90)  ต้องเติม ≈');
// ต้องเติม ≈ ใบที่หายไปต่อชีวิตที่ p90 เพราะกองแห้ง (รอบแห้ง × โอกาสต่อรอบ) — เติมใบที่เกิดได้กว้างเท่านี้ กองไม่แห้งก่อนจบช่วง
const refill = {};
for (const s of names) {
  const x = per[s];
  if (!x.lives) continue;
  const dryMean = x.dry.reduce((a, b) => a + b, 0) / x.lives;
  const dry90 = q(x.dry, 0.9);
  refill[s] = Math.ceil(dry90 * POOL_CHANCE[s]);
  console.log(`${s.padEnd(9)} ${String(POOL_ROUNDS[s]).padStart(3)}  ${f(POOL_CHANCE[s])}  ${String(poolSize[s]).padStart(3)}  ${f(x.cards / x.lives).padStart(10)}  ${f(x.pool / x.lives).padStart(12)}  ${f(dryMean).padStart(10)} · ${String(dry90).padStart(3)}  ${String(refill[s]).padStart(8)}`);
}
console.log(`\nรวมต้องเติมกองสุ่ม ≈ ${Object.values(refill).reduce((a, b) => a + b, 0)} ใบ (ชีวิต p90) เพื่อให้รอบที่ตั้งไว้ไม่แห้ง`);
