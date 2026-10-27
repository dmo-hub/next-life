// ด่าน 3a · 3b · 4 ของใบ 07 — npm run gate (บอทสุ่มชุดเดียว) กับ harness เต็ม (6 บุคลิก × 2 seed) ตัดสินด้วยโค้ดชุดเดียวกัน
// แต่ละด่านคืนบรรทัดที่พิมพ์ + ตก/ผ่าน ผู้เรียกเป็นคนพิมพ์และตั้ง exit code
import { expectedDeathAge, periodE0, qx, e0FromLx, infantMortality, MAX_AGE } from '../src/engine/index.mjs';

const f = (v) => v.toFixed(2);

// ด่าน 4: จำนวนการ์ดของชีวิตที่ตายหลังอายุ 60 (นับการ์ดเปลี่ยนช่วงและการ์ดตายด้วย)
// ช่วงขยับขึ้นเมื่อกองสุ่มจับได้หลายรอบต่อปี (pace.mjs) — 100–180 ครอบชีวิตที่เนื้อหาตอนนี้รับไหว
// เปิด GATE4_LONG_ON เมื่อเนื้อหาเติมกองพอถึงเป้าเล่นนานขึ้น ~2 เท่า ช่วงจึงเป็น CARD_LONG_*
export const CARD_LONG_MIN = 150, CARD_LONG_MAX = 260;
export const GATE4_LONG_ON = false;
export const [CARD_MIN, CARD_MAX] = GATE4_LONG_ON ? [CARD_LONG_MIN, CARD_LONG_MAX] : [100, 180];
export const CARD_SHARE = 0.9;
// พักการตัดสินได้ระหว่างรอเนื้อหา · ยังพิมพ์ตัวเลขทุกรอบเพื่อดูว่าเนื้อหาที่เติมดันขึ้นมาใกล้เกณฑ์แค่ไหน
export const GATE4_PAUSED = false;
export const cardsInRange = (c) => c >= CARD_MIN && c <= CARD_MAX;

// ด่าน 2 + เทียบรอบก่อน: ตัวเลือกที่ไม่มีใครเลือกนับว่าตายเมื่อการ์ดขึ้นพอให้ตัวเลือกนั้นควรถูกเลือกแล้วเท่านั้น
// คาดยอดเลือก = ชีวิตของบอทสุ่มที่เจอการ์ด (explored) / จำนวนตัวเลือก — บอทบุคลิกเลือกตามคะแนน ตัวเลือกที่ไม่มีบุคลิกไหนชอบ
// (เช่นไม่มีป้ายผล) จึงได้แค่จากบอทสุ่ม · ต่ำกว่าเกณฑ์ ศูนย์ครั้งเป็นแค่ rng ที่เลื่อนตามเนื้อหาที่เพิ่ม — รายงาน ⚠ ไม่ตก
export const MIN_EXPECTED_PICKS = 10;
export function splitDeadChoices(events, fired, explored, picks, min = MIN_EXPECTED_PICKS) {
  const dead = [], thin = [];
  // ตัวเลือกของเหตุการณ์ที่ตายนับในเหตุการณ์แล้ว ไม่ซ้ำที่นี่
  for (const e of events) {
    if (!fired.has(e.id)) continue;
    const expected = (explored.get(e.id) ?? 0) / e.choices.length;
    e.choices.forEach((c, i) => {
      if (picks.has(`${e.id}#${i}`)) return;
      const id = `${e.id}#${c.id ?? i}`;
      if (expected >= min) dead.push(id);
      else thin.push({ id, expected });
    });
  }
  return { dead, thin };
}

function cardGate(cardsOver60, name, min, max, paused, pausedText) {
  const xs = [...cardsOver60].sort((a, b) => a - b);
  const inRange = xs.filter((c) => c >= min && c <= max).length;
  const share = xs.length ? inRange / xs.length : 0;
  const pct = (p) => xs[Math.min(xs.length - 1, Math.floor(p * xs.length))];
  const ok = share >= CARD_SHARE;
  const line = `${name}: ชีวิตที่ตายหลัง 60 ยาว ${min}–${max} การ์ด ${f(share * 100)}% (ต้อง ≥${CARD_SHARE * 100}%) · ${xs.length} ชีวิต · การ์ด p5 ${pct(0.05)} · p25 ${pct(0.25)} · p50 ${pct(0.5)} · p75 ${pct(0.75)} · p95 ${pct(0.95)} · ต่ำกว่า ${min} ${xs.filter((c) => c < min).length} · เกิน ${max} ${xs.filter((c) => c > max).length} → ${ok ? 'ผ่าน' : paused ? `ตก (${pausedText})` : 'ตก'}`;
  return { line, share, fail: !ok && !paused };
}

export const gate4 = (cardsOver60) => cardGate(cardsOver60, 'ด่าน 4', CARD_MIN, CARD_MAX, GATE4_PAUSED, 'พักการตัดสิน รอกองสุ่มเหตุการณ์');
// ระยะห่างจากเป้าเล่นนานขึ้นก่อนเปิด — พิมพ์ดูเฉย ๆ ไม่ตัดสิน (เปิดแล้ว gate4 ตัดสินช่วงนี้เอง)
export const gate4Long = (cardsOver60) => cardGate(cardsOver60, 'ด่าน 4 เป้าเล่นนาน', CARD_LONG_MIN, CARD_LONG_MAX, true, 'ยังไม่เปิด รอเนื้อหาเติมกอง');

// 3a: ตารางชีพรายปีที่เกมใช้ต้องให้ e0 และอัตราตายทารกตรงข้อมูลจริงของปีนั้น (ไม่ผ่านแกนเกม ไม่ผ่านการสุ่ม)
// แยกจาก 3b เพราะเป้าของ 3b คำนวณจาก qx ตัวเดียวกับที่เกมใช้ ถ้าตารางชีพผิด 3b ก็ยังผ่าน
const E0_TOL = 0.05, IMR_TOL = 0.5;
export function gate3a(era) {
  const lines = [];
  let bad = 0, worstE0 = 0, worstImr = 0;
  const lastMort = era.mort.from + era.mort.e0.ชาย.v.length - 1;
  for (const sex of ['ชาย', 'หญิง']) {
    for (let y = era.mort.from; y <= lastMort; y++) {
      const lx = [1];
      for (let a = 0; a < MAX_AGE; a++) lx.push(lx[a] * (1 - qx(era, sex, y, a)));
      const dE0 = Math.abs(e0FromLx(lx) - periodE0(era, sex, y));
      const dImr = Math.abs((1 - lx[1]) * 1000 - infantMortality(era, sex, y));
      worstE0 = Math.max(worstE0, dE0);
      worstImr = Math.max(worstImr, dImr);
      if (dE0 > E0_TOL || dImr > IMR_TOL) {
        bad++;
        lines.push(`  ✗ ${sex} ${y}: e0 ห่าง ${f(dE0)} · IMR ห่าง ${f(dImr)}`);
      }
    }
  }
  lines.push(`\nด่าน 3a: ตารางชีพที่เกมใช้ vs ข้อมูลจริงรายปี (e0 ±${E0_TOL} · IMR ±${IMR_TOL}/1,000) ห่างสุด e0 ${worstE0.toFixed(4)} · IMR ${worstImr.toFixed(4)} → ${bad ? `ตก ${bad} ปี-เพศ` : 'ผ่าน'}`);
  return { lines, fail: bad > 0 };
}

// 3b (ใบ 07 + MAP: ตายตามแนวชีวิต): อายุเฉลี่ยของบอทสุ่ม vs อายุตายที่ข้อมูลคาดตามแนวชีวิต (ตารางชีพของแต่ละปีที่ผ่าน) ไม่ใช่ e0 ปีเกิด
// กลุ่ม = ทศวรรษเกิด × เพศ · ค่า [ผลรวมอายุจริง, ผลรวมอายุที่ข้อมูลคาด, ผลรวม e0 ปีเกิด, จำนวน, ผลรวมกำลังสองของส่วนต่าง]
export const AGE_TOL = 3;
// กลุ่มเล็กกว่านี้ค่าเฉลี่ยแกว่งเกิน ±1 ปีจากสุ่มล้วน (อายุตาย SD ราว 22 ปี) ตัดสินไม่ได้
export const MIN_LIVES = 500;
// SD ของส่วนต่างต่อชีวิตเมื่อกลุ่มไม่ได้เก็บผลรวมกำลังสองมา (กลุ่มที่สร้างมือในชุดทดสอบ)
const AGE_SD = 22;
const groupSe = ([real, exp, , c, sq]) => {
  const mean = (real - exp) / c;
  const sd = sq === undefined ? AGE_SD : Math.sqrt(Math.max(0, sq / c - mean * mean));
  return sd / Math.sqrt(c);
};
export const groupKey = (st) => `${Math.floor(st.birthYear / 10) * 10}|${st.sex}`;
// คืนส่วนต่างอายุจริงกับที่ข้อมูลคาดของชีวิตนี้ — harness เต็มใช้ชี้เหตุการณ์ต้นเหตุ
export function addGroup(groups, era, st, age) {
  const key = groupKey(st);
  const g = groups.get(key) ?? [0, 0, 0, 0, 0];
  const exp = expectedDeathAge(era, st.sex, st.birthYear, st.seed);
  g[0] += age;
  g[1] += exp;
  g[2] += periodE0(era, st.sex, st.birthYear);
  g[3]++;
  g[4] += (age - exp) ** 2;
  groups.set(key, g);
  return age - exp;
}
export function gate3b(groups) {
  const lines = [`\nด่าน 3b: อายุเฉลี่ยห่างค่าที่ข้อมูลคาดตามแนวชีวิต ไม่เกิน ±${AGE_TOL} ปี`, 'ทศวรรษเกิด เพศ   ชีวิต  อายุเฉลี่ย  ข้อมูลคาด  ต่าง   (e0 ปีเกิด)'];
  const failed = [];
  let small = 0, worst = 0, worstSe = 0;
  for (const key of [...groups.keys()].sort()) {
    const [dec, sex] = key.split('|');
    const [real, exp, e0, c] = groups.get(key);
    const diff = real / c - exp / c;
    const ok = Math.abs(diff) <= AGE_TOL;
    const judged = c >= MIN_LIVES;
    if (!judged) small++;
    else {
      if (Math.abs(diff) > worst) [worst, worstSe] = [Math.abs(diff), groupSe(groups.get(key))];
      if (!ok) failed.push({ key, diff });
    }
    const verdict = !judged ? 'ไม่ตัดสิน (ชีวิตน้อย)' : ok ? 'ผ่าน' : 'ตก';
    lines.push(`${dec}s ${sex.padEnd(4)} ${String(c).padStart(6)} ${f(real / c).padStart(10)} ${f(exp / c).padStart(10)} ${(diff >= 0 ? '+' : '') + f(diff)} (${f(e0 / c)}) ${verdict}`);
  }
  if (failed.length) lines.push(`ด่าน 3b ตก ${failed.length} กลุ่ม`);
  else if (small) lines.push(`ด่าน 3b ยังไม่ตัดสิน: ${small} กลุ่มมีไม่ถึง ${MIN_LIVES} ชีวิต — รัน npm run gate (20,000 ชีวิต)`);
  else lines.push('ด่าน 3b ผ่านทุกกลุ่ม');
  return { lines, fail: failed.length > 0, failed, worst, worstSe };
}

// ชี้ id ต้นเหตุเมื่อด่านตก: คนที่เจอเหตุการณ์ตอนอายุ a เทียบกับค่าเฉลี่ยของคนไม่เจอที่ยังมีชีวิตที่อายุ a
// เฉลี่ยส่วนต่างของคนเจอ × สัดส่วนที่เจอในกลุ่ม = เหตุการณ์นี้ดันค่าเฉลี่ยของทั้งกลุ่มไปเท่าไร
// เทียบที่อายุของแต่ละคน: เทียบกับทุกชีวิตแล้วการ์ดที่ต้องโตก่อนถึงเจอ (เข้าเรียน · งานแรก) ขึ้นอันดับหนึ่งเสมอ
// ส่วนตัดที่อายุเดียวทั้งก้อนทิ้งคนที่เจอแล้วตายเร็ว ซึ่งคือตัวที่ด่าน 3b ต้องหา · เป็นความสัมพันธ์ ไม่ใช่เหตุผล
// lives = [[อายุตาย, ค่า, ลำดับเหตุการณ์ที่เจอ, อายุที่เจอ]] · ids = ลำดับ → id
export const MIN_SIDE = 30;
export function blame(lives, ids, sign, top = 5) {
  // ผลรวมจากท้าย: คน/ค่าของทุกชีวิตที่ยังอยู่ที่อายุ a (ตายอายุ ≥ a)
  const MAX = Math.max(...lives.map((l) => l[0])) + 2;
  const tail = (rows) => {
    const n = new Float64Array(MAX), s = new Float64Array(MAX);
    for (const [age, v] of rows) {
      n[age]++;
      s[age] += v;
    }
    for (let a = MAX - 2; a >= 0; a--) {
      n[a] += n[a + 1];
      s[a] += s[a + 1];
    }
    return { n, s };
  };
  const all = tail(lives);
  const byEvent = new Map();
  for (const [age, v, idx, ats] of lives) idx.forEach((e, k) => {
    const x = byEvent.get(e) ?? [];
    x.push([age, v, ats[k]]);
    byEvent.set(e, x);
  });
  const rows = [];
  for (const [e, seers] of byEvent) {
    if (seers.length < MIN_SIDE || lives.length - seers.length < MIN_SIDE) continue;
    const mine = tail(seers);
    let d = 0, used = 0;
    for (const [, v, a] of seers) {
      const n = all.n[a] - mine.n[a];
      if (n < MIN_SIDE) continue;
      d += v - (all.s[a] - mine.s[a]) / n;
      used++;
    }
    if (used < MIN_SIDE) continue;
    const push = (d / used) * (seers.length / lives.length);
    if (Math.sign(push) === sign) rows.push({ id: ids[e], n: seers.length, push });
  }
  return rows.sort((a, b) => Math.abs(b.push) - Math.abs(a.push)).slice(0, top);
}

// จังหวะบังคับ (ใบ 07): ผลรอบนี้ต้องไม่แย่กว่าฐาน (seed ตายตัวชุดเดียวกัน) · คืนรายการที่แย่ลง ว่าง = ผ่าน
// ส่วนต่างเล็กกว่า SLACK เป็นแค่เลขสุ่มที่ขยับตามเนื้อหาที่เพิ่ม ไม่นับว่าแย่ลง
export const SLACK = { gate4Share: 0.005, gate3bWorst: 0.25 };
// 3b ห่างสุดเป็นค่าเฉลี่ยของกลุ่มเดียว (หลักร้อยชีวิต SE เกือบ 1 ปี) — ขยับเกิน SLACK ได้จากเนื้อหาที่สับเส้นทางชีวิตล้วน ๆ
// ตกเมื่อเพิ่มเกินช่วง 95% ของผลต่างสองค่าเฉลี่ย · ฐานที่ยังไม่เก็บ SE ใช้ SE รอบนี้แทน
export const GATE3B_Z = 1.96;
export const gate3bTol = (prev, now) => {
  const a = prev.gate3bWorstSe ?? now.gate3bWorstSe ?? 0, b = now.gate3bWorstSe ?? 0;
  return Math.max(SLACK.gate3bWorst, GATE3B_Z * Math.sqrt(a * a + b * b));
};
export function compareBaseline(prev, now) {
  const worse = [];
  for (const k of ['deadEvents', 'deadChoices', 'deadFlags']) {
    const add = now[k].filter((x) => !prev[k].includes(x));
    if (add.length) worse.push(`${k} ใหม่ ${add.join(' · ')}`);
  }
  if (now.statBad > prev.statBad) worse.push(`statBad ${prev.statBad} → ${now.statBad}`);
  if (now.gate4Share < prev.gate4Share - SLACK.gate4Share) worse.push(`ด่าน 4 ${f(prev.gate4Share * 100)}% → ${f(now.gate4Share * 100)}%`);
  const tol = gate3bTol(prev, now);
  if (now.gate3bWorst > prev.gate3bWorst + tol) worse.push(`ด่าน 3b ห่างสุด ${prev.gate3bWorst} → ${now.gate3bWorst} ปี (ยอม +${f(tol)})`);
  return worse;
}
