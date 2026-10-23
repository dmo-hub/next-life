// ด่าน 3a · 3b · 4 ของใบ 07 — npm run gate (บอทสุ่มชุดเดียว) กับ harness เต็ม (6 บุคลิก × 2 seed) ตัดสินด้วยโค้ดชุดเดียวกัน
// แต่ละด่านคืนบรรทัดที่พิมพ์ + ตก/ผ่าน ผู้เรียกเป็นคนพิมพ์และตั้ง exit code
import { expectedDeathAge, periodE0, qx, e0FromLx, infantMortality, MAX_AGE } from '../src/engine/index.mjs';

const f = (v) => v.toFixed(2);

// ด่าน 4: จำนวนการ์ดของชีวิตที่ตายหลังอายุ 60 (นับการ์ดเปลี่ยนช่วงและการ์ดตายด้วย)
// ขอบล่างลดจาก 80 เมื่อเลิกการ์ดสรุปรายปี (สรุปเฉพาะตอนเปลี่ยนช่วงวัย) — ขอบบนคงไว้ให้เนื้อหาเรื่องต่อเติมได้
export const CARD_MIN = 70, CARD_MAX = 150, CARD_SHARE = 0.9;
// พักการตัดสินได้ระหว่างรอเนื้อหา · ยังพิมพ์ตัวเลขทุกรอบเพื่อดูว่าเนื้อหาที่เติมดันขึ้นมาใกล้เกณฑ์แค่ไหน
export const GATE4_PAUSED = false;
export const cardsInRange = (c) => c >= CARD_MIN && c <= CARD_MAX;

export function gate4(cardsOver60) {
  const xs = [...cardsOver60].sort((a, b) => a - b);
  const inRange = xs.filter(cardsInRange).length;
  const share = xs.length ? inRange / xs.length : 0;
  const pct = (p) => xs[Math.min(xs.length - 1, Math.floor(p * xs.length))];
  const ok = share >= CARD_SHARE;
  const line = `ด่าน 4: ชีวิตที่ตายหลัง 60 ยาว ${CARD_MIN}–${CARD_MAX} การ์ด ${f(share * 100)}% (ต้อง ≥${CARD_SHARE * 100}%) · ${xs.length} ชีวิต · การ์ด p5 ${pct(0.05)} · p25 ${pct(0.25)} · p50 ${pct(0.5)} · p75 ${pct(0.75)} · p95 ${pct(0.95)} · ต่ำกว่า ${CARD_MIN} ${xs.filter((c) => c < CARD_MIN).length} · เกิน ${CARD_MAX} ${xs.filter((c) => c > CARD_MAX).length} → ${ok ? 'ผ่าน' : GATE4_PAUSED ? 'ตก (พักการตัดสิน รอกองสุ่มเหตุการณ์)' : 'ตก'}`;
  return { line, share, fail: !ok && !GATE4_PAUSED };
}

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
// กลุ่ม = ทศวรรษเกิด × เพศ · ค่า [ผลรวมอายุจริง, ผลรวมอายุที่ข้อมูลคาด, ผลรวม e0 ปีเกิด, จำนวน]
export const AGE_TOL = 3;
// กลุ่มเล็กกว่านี้ค่าเฉลี่ยแกว่งเกิน ±1 ปีจากสุ่มล้วน (อายุตาย SD ราว 22 ปี) ตัดสินไม่ได้
export const MIN_LIVES = 500;
export const groupKey = (st) => `${Math.floor(st.birthYear / 10) * 10}|${st.sex}`;
// คืนส่วนต่างอายุจริงกับที่ข้อมูลคาดของชีวิตนี้ — harness เต็มใช้ชี้เหตุการณ์ต้นเหตุ
export function addGroup(groups, era, st, age) {
  const key = groupKey(st);
  const g = groups.get(key) ?? [0, 0, 0, 0];
  const exp = expectedDeathAge(era, st.sex, st.birthYear, st.seed);
  g[0] += age;
  g[1] += exp;
  g[2] += periodE0(era, st.sex, st.birthYear);
  g[3]++;
  groups.set(key, g);
  return age - exp;
}
export function mergeGroups(into, from) {
  for (const [k, v] of from) {
    const g = into.get(k) ?? [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) g[i] += v[i];
    into.set(k, g);
  }
  return into;
}

export function gate3b(groups) {
  const lines = [`\nด่าน 3b: อายุเฉลี่ยห่างค่าที่ข้อมูลคาดตามแนวชีวิต ไม่เกิน ±${AGE_TOL} ปี`, 'ทศวรรษเกิด เพศ   ชีวิต  อายุเฉลี่ย  ข้อมูลคาด  ต่าง   (e0 ปีเกิด)'];
  const failed = [];
  let small = 0, worst = 0;
  for (const key of [...groups.keys()].sort()) {
    const [dec, sex] = key.split('|');
    const [real, exp, e0, c] = groups.get(key);
    const diff = real / c - exp / c;
    const ok = Math.abs(diff) <= AGE_TOL;
    const judged = c >= MIN_LIVES;
    if (!judged) small++;
    else {
      worst = Math.max(worst, Math.abs(diff));
      if (!ok) failed.push({ key, diff });
    }
    const verdict = !judged ? 'ไม่ตัดสิน (ชีวิตน้อย)' : ok ? 'ผ่าน' : 'ตก';
    lines.push(`${dec}s ${sex.padEnd(4)} ${String(c).padStart(6)} ${f(real / c).padStart(10)} ${f(exp / c).padStart(10)} ${(diff >= 0 ? '+' : '') + f(diff)} (${f(e0 / c)}) ${verdict}`);
  }
  if (failed.length) lines.push(`ด่าน 3b ตก ${failed.length} กลุ่ม`);
  else if (small) lines.push(`ด่าน 3b ยังไม่ตัดสิน: ${small} กลุ่มมีไม่ถึง ${MIN_LIVES} ชีวิต — รัน npm run gate (20,000 ชีวิต)`);
  else lines.push('ด่าน 3b ผ่านทุกกลุ่ม');
  return { lines, fail: failed.length > 0, failed, worst };
}

// ชี้ id ต้นเหตุเมื่อด่านตก: ค่าเฉลี่ยของชีวิตที่เจอเหตุการณ์ ลบชีวิตที่อยู่ถึงอายุเฉลี่ยที่เหตุการณ์ออกแต่ไม่เจอ
// × สัดส่วนที่เจอในกลุ่ม = เหตุการณ์นี้ดันค่าเฉลี่ยของทั้งกลุ่มไปเท่าไร
// เทียบกับชีวิตที่รอดถึงอายุนั้นเท่านั้น — เทียบกับทุกชีวิตแล้วการ์ดที่ต้องโตก่อนถึงเจอ (เข้าเรียน · งานแรก) ขึ้นอันดับหนึ่งเสมอ
// เป็นความสัมพันธ์ ไม่ใช่เหตุผล · lives = [[อายุตาย, ค่า]] ทุกชีวิตในกลุ่ม · byId = Map(id → [ชีวิตที่เจอ, ผลรวมค่า, ผลรวมอายุที่เจอ])
export function blame(lives, byId, sign, top = 5) {
  const rows = [];
  for (const [id, [ne, se, sa]] of byId) {
    if (ne < 30) continue;
    const at = Math.floor(sa / ne);
    let n = 0, sum = 0;
    for (const [age, v] of lives) if (age >= at) {
      n++;
      sum += v;
    }
    if (n - ne < 30) continue;
    const push = (se / ne - (sum - se) / (n - ne)) * (ne / lives.length);
    if (Math.sign(push) === sign) rows.push({ id, n: ne, at, push });
  }
  return rows.sort((a, b) => Math.abs(b.push) - Math.abs(a.push)).slice(0, top);
}
