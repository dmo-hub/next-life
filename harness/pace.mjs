// จังหวะการ์ด (B37a): จำนวนการ์ดต่อชีวิต + กองสุ่มช่วงไหนแห้งเมื่อจับปีละหลายรอบ → รายการกองที่ต้องเติม (B37b)
// --rounds 2,3,3,2,2,1 = จำนวนรอบต่อปีตามลำดับช่วงวัย (เด็ก → ชรา) · ไม่ใส่ = ค่าที่เกมใช้ (POOL_ROUNDS) · --off = 1 รอบทุกช่วง
// นัดค้าง = นัดที่ถึงอายุแล้วแต่ไม่ออก ขณะยังมีชีวิต (เงื่อนไขของตอนต่อไม่ผ่าน) — เรื่องหลายตอนขาดกลางทาง · ตายก่อนถึงนัดไม่นับ
// --intensity [--k 2] = รายงานการ์ดหนัก/เบาเรียงกันยังไงต่อชีวิต แทนรายงานข้างบน (ไม่มีเกณฑ์ตก · ตกเฉพาะตัวควบคุม)
import { registerHooks } from 'node:module';

const args = process.argv.slice(2);
const intensityMode = args.includes('--intensity');
// ความหนักวัดจากผลของตัวเลือกจริง จึงต้องเห็น state ทันทีหลัง choose — ก่อนใบถัดไปเดินปี · ดักตอนโหลดแทนการแก้ engine
const CHOOSE = 'export function choose(st, idx, loan) {';
if (intensityMode) {
  registerHooks({
    load(url, context, nextLoad) {
      const out = nextLoad(url, context);
      if (!url.endsWith('/src/engine/life.mjs')) return out;
      const source = String(out.source);
      const hits = source.split(CHOOSE).length - 1;
      if (hits !== 1) throw new Error(`pace --intensity: จุดดัก choose ใน life.mjs ตรง ${hits} ที่ ต้อง 1`);
      return { ...out, source: source.replace(CHOOSE, `${CHOOSE}\n  const out = chooseTapped(st, idx, loan);\n  globalThis.__afterChoose?.(st);\n  return out;\n}\nfunction chooseTapped(st, idx, loan) {`) };
    },
  });
}
// โหลดหลังตั้งตัวดัก — import แบบ static ถูกโหลดก่อนบรรทัดแรกของไฟล์
const { playLife, mixSeed, STAGES, POOL_CHANCE, POOL_ROUNDS, POOL_ROUNDS_OFF, setPoolRounds, stageOf, netWorth, moneyValue } = await import('../src/engine/index.mjs');
const { loadContent } = await import('../src/node/load.mjs');
const { gate4, gate4Long } = await import('./gates.mjs');
const { random: randomBot, BOTS } = await import('./bots.mjs');

const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const n = Number(opt('n', intensityMode ? 300 : 2000));
const seed = Number(opt('seed', 1));
const names = STAGES.map((s) => s.name);
if (args.includes('--off')) setPoolRounds(POOL_ROUNDS_OFF);
else if (opt('rounds')) setPoolRounds(Object.fromEntries(opt('rounds').split(',').map((v, i) => [names[i], Number(v)])));

const content = loadContent();
if (intensityMode) process.exit(intensity() ? 0 : 1);
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

// ── จังหวะความหนัก (--intensity) ──
function intensity() {
  // เกณฑ์ "ใบหนัก" ยังเป็นค่าตั้งต้นของรายงาน — เงินหายต้องถึงทั้งก้อนขั้นต่ำและสัดส่วนของทรัพย์สุทธิ
  const HEAVY = { health: 10, moneyYears: 0.5, moneyShare: 0.25 };
  const FAMILY = ['partner', 'spouse', 'child', 'grandchild', 'sibling'];
  const WHY = { health: 'สุขภาพลด', money: 'เงินหาย', family: 'คนในครอบครัวตาย', near: 'เฉียดตาย', death: 'ตาย' };
  const INJECT = 5;
  const ERA_SPAN = 20;
  const k = Number(opt('k', 2));

  const snap = (st) => ({
    health: st.health,
    net: netWorth(st),
    // เงินเก็บหนึ่งปีของยุคและอาชีพตอนนั้น (มีพื้นค่าแรงขั้นต่ำ) ทำให้เกณฑ์เทียบข้ามยุคได้
    unit: -moneyValue(st, { unit: 'income_x', amount: -1 }),
    lost: (st.parents ?? []).filter((m) => !m.alive).length + (st.kin ?? []).filter((m) => FAMILY.includes(m.role) && !m.alive).length,
    near: st.nearDeath != null,
  });
  // สุขภาพ/เงินนับเฉพาะผลของตัวเลือกใบนี้ · ความตายในครอบครัว/เฉียดตายเกิดตอนขึ้นปีแล้วเล่าบนใบถัดมา จึงเทียบกับท้ายใบก่อน
  function reasons(prev, at, after, kind) {
    const why = [];
    if (at.health - after.health >= HEAVY.health) why.push('health');
    if (at.net - after.net >= Math.max(HEAVY.moneyYears * at.unit, HEAVY.moneyShare * at.net)) why.push('money');
    if (after.lost > prev.lost) why.push('family');
    if ((after.near && !prev.near) || kind === 'court') why.push('near');
    if (kind === 'death') why.push('death');
    return why;
  }

  const bots = Object.entries(BOTS);
  const lives = [];
  let taps = 0;
  for (let i = 0; i < n; i++) {
    const [botName, bot] = bots[i % bots.length];
    const beats = [];
    let open = null, prev = null, inCourt = false;
    const close = () => {
      if (!open) return;
      const after = open.after ?? open.at;
      const why = reasons(prev ?? open.at, open.at, after, open.kind);
      // การ์ดผลเป็นหางของตัวเลือกก่อนหน้า — นับแยกจะกลายเป็น "ช่วงพัก" ปลอมหลังใบหนักทุกใบ
      const last = beats.at(-1);
      if (open.kind === 'result' && last) last.why = [...new Set([...last.why, ...why])];
      else beats.push({ why, stage: open.stage, era: open.era });
      prev = after;
      open = null;
    };
    globalThis.__afterChoose = (st) => {
      taps++;
      if (open) open.after = snap(st);
    };
    playLife(mixSeed(seed, i), content, bot, (card, st) => {
      close();
      if (card.trip) return;
      // ด่านศาลหลายใบเป็นเรื่องเฉียดตายเรื่องเดียว นับใบแรกใบเดียว
      if (card.court && inCourt) return;
      inCourt = !!card.court;
      const at = snap(st);
      const age = card.age ?? st.age;
      const year = st.birthYear + age;
      open = { at, kind: card.court ? 'court' : card.kind, stage: stageOf(age), era: Math.floor(year / ERA_SPAN) * ERA_SPAN };
    });
    close();
    lives.push({ bot: botName, beats });
  }
  delete globalThis.__afterChoose;

  const heavy = (b) => b.why.length > 0;
  const longest = (beats) => {
    let run = 0, best = 0;
    for (const b of beats) {
      run = heavy(b) ? run + 1 : 0;
      best = Math.max(best, run);
    }
    return best;
  };
  // ใบหนักที่ k ใบก่อนหน้าหนักหมด = ไม่มีช่วงพักก่อน
  const noRest = (beats) => beats.map((b, i) => heavy(b) && i >= k && beats.slice(i - k, i).every(heavy));

  const q = (xs, p) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))] ?? 0;
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
  const f = (v, d = 2) => v.toFixed(d);
  function table(title, keyOf, order) {
    const groups = new Map(order?.map((g) => [g, []]));
    for (const life of lives) {
      const flags = noRest(life.beats);
      const mine = new Map();
      life.beats.forEach((b, i) => {
        const g = keyOf(b, life);
        let m = mine.get(g);
        if (!m) mine.set(g, (m = { beats: [], noRest: 0 }));
        m.beats.push(b);
        if (flags[i]) m.noRest++;
      });
      for (const [g, m] of mine) {
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(m);
      }
    }
    console.log(`\n${title.padEnd(14)} ชีวิต    ใบ/ชีวิต  หนัก %  หนักติดยาวสุด (เฉลี่ย · p90 · สูงสุด)  ไม่ได้พัก/ชีวิต`);
    for (const [g, ms] of groups) {
      if (!ms.length) continue;
      const all = ms.flatMap((m) => m.beats);
      const runs = ms.map((m) => longest(m.beats));
      console.log(`${String(g).padEnd(14)} ${String(ms.length).padStart(5)}  ${f(all.length / ms.length, 1).padStart(10)}  ${f((all.filter(heavy).length / all.length) * 100, 1).padStart(6)}  ${f(mean(runs)).padStart(18)} · ${String(q(runs, 0.9)).padStart(3)} · ${String(Math.max(...runs)).padStart(4)}  ${f(mean(ms.map((m) => m.noRest))).padStart(16)}`);
    }
  }

  console.log(`จังหวะความหนัก · ชีวิต ${n} · seed ${seed} · บอทเวียน ${bots.length} ตัว · พัก k = ${k}`);
  console.log(`ใบหนัก = สุขภาพลด ≥ ${HEAVY.health} · ทรัพย์สุทธิหาย ≥ ${HEAVY.moneyYears} ปีเงินเก็บ และ ≥ ${HEAVY.moneyShare * 100}% · คนในครอบครัวตาย · เฉียดตาย · ตาย · การ์ดผลรวมเข้าใบก่อน · ไม่นับในทริปต่างโลก`);
  table('ทั้งชีวิต', () => 'ทั้งหมด');
  table('ช่วงวัย', (b) => b.stage, STAGES.map((s) => s.name));
  table(`ยุค (พ.ศ. ${ERA_SPAN} ปี)`, (b) => b.era, [...new Set(lives.flatMap((l) => l.beats.map((b) => b.era)))].sort((a, b) => a - b));
  table('บอท', (_, life) => life.bot, bots.map(([name]) => name));
  const all = lives.flatMap((l) => l.beats);
  console.log(`\nเหตุที่ทำให้หนัก (% ของใบทั้งหมด · ใบเดียวนับได้หลายเหตุ): ${Object.entries(WHY).map(([id, label]) => `${label} ${f((all.filter((b) => b.why.includes(id)).length / all.length) * 100)}`).join(' · ')}`);

  // ตัวควบคุม: ใบที่สร้างผ่านตัวจัดชั้นเดียวกันที่เกณฑ์พอดีต้องหนัก ต่ำกว่าเกณฑ์หนึ่งหน่วยต้องเบา แล้วยัดติดกันกลางชีวิตจริง
  const base = { health: 80, net: 0, unit: 1000, lost: 0, near: false };
  const made = (drop) => ({ why: reasons(base, base, { ...base, health: base.health - drop }, 'event'), stage: 'ตัวควบคุม', era: 0 });
  const forced = lives.map(({ beats }) => {
    const mid = beats.length >> 1;
    return [...beats.slice(0, mid), ...Array.from({ length: INJECT }, () => made(HEAVY.health)), ...beats.slice(mid)];
  });
  const before = lives.map((l) => longest(l.beats)), after = forced.map(longest);
  const rest = (xs) => xs.reduce((s, beats) => s + noRest(beats).filter(Boolean).length, 0);
  const checks = [
    [`ตัวดัก choose ทำงาน (${taps.toLocaleString('en-US')} ครั้ง)`, taps > 0],
    [`สุขภาพลด ${HEAVY.health} = หนัก · ${HEAVY.health - 1} = เบา`, made(HEAVY.health).why.length > 0 && made(HEAVY.health - 1).why.length === 0],
    [`ยัดใบหนัก ${INJECT} ใบติด: ยาวสุดเฉลี่ย ${f(mean(before))} → ${f(mean(after))} · ต่ำสุด ${Math.min(...after)}`, after.every((v, i) => v >= INJECT && v >= before[i]) && mean(after) > mean(before)],
    [`ยัดแล้วใบไม่ได้พักรวม ${rest(lives.map((l) => l.beats))} → ${rest(forced)}`, rest(forced) > rest(lives.map((l) => l.beats))],
  ];
  console.log('\nตัวควบคุม');
  for (const [label, ok] of checks) console.log(`${ok ? 'ผ่าน' : 'ตก  '}  ${label}`);
  return checks.every(([, ok]) => ok);
}
