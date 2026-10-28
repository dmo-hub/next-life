// สาเหตุการตาย (B110): ตารางชีพบอกว่าตายเมื่อไร ตารางสาเหตุ (WHO GHE) บอกว่าตายด้วยอะไร
// ปัจจัยเสี่ยงคูณเฉพาะสาเหตุที่เกี่ยว แล้วหารด้วยค่าเฉลี่ยของทั้งประชากร (norm) — คนทั้งรุ่นยังตายตามตารางชีพ
// คนไม่มีปัจจัยเสี่ยงจึงอยู่ยืนกว่าค่าเฉลี่ย ส่วนคนมีปัจจัยเสี่ยงสั้นกว่า
import { qx, protoYear, MAX_AGE } from './era.mjs';

// โรคเรื้อรังมีช่วงป่วยก่อนตาย (ตรวจเจอ → ดูแล → บอกลา) · ที่เหลือมาไม่บอกล่วงหน้า
export const CHRONIC = ['heart', 'stroke', 'cancer', 'diabetes_kidney', 'liver', 'chronic_resp'];
export const ILL_YEARS = [1, 3];
// พ่อ/แม่ตายด้วยโรคกลุ่มนี้ = ลูกเสี่ยงโรคเดียวกันเพิ่ม (นับตั้งแต่ปีที่พ่อ/แม่จากไป — ประวัติครอบครัวที่หมอถาม) · ส่งต่อทีละชั้น พ่อแม่→ลูก
export const HEREDITARY = ['heart', 'diabetes_kidney', 'cancer'];
export const HEREDITY_RISK = 1.3;
// ตัวคูณตามงานวิจัยที่เจ้าของเคาะ · รวมหลายตัวแล้วไม่เกิน DEATH_RISK_CAP
export const DEATH_RISK = {
  smoker: { heart: 1.8, chronic_resp: 1.8, cancer: 1.8 },
  heavy_drinker: { liver: 1.6, road: 1.6 },
  sporty: { heart: 0.8, diabetes_kidney: 0.8 },
};
export const DEATH_RISK_CAP = 2;
// ยุคก่อนข้อมูลสาเหตุ: อัตราตายส่วนที่เกินปีแรกของข้อมูลเป็นของกลุ่มนี้ (data/death-causes.json rules.past)
const COMMUNICABLE = ['infection', 'pneumonia', 'newborn'];

export const causeBand = (era, age) => {
  const a = era.causes.ages;
  let i = 0;
  while (i + 1 < a.length && a[i + 1] <= age) i++;
  return i;
};

// สัดส่วนสาเหตุของผู้ตายอายุ age ในปีต้นแบบ py เรียงตาม era.causes.keys
export function causeShares(era, sex, py, age) {
  const c = era.causes;
  const rows = c[sex];
  const b = causeBand(era, age);
  const base = rows[Math.max(0, Math.min(rows.length - 1, py - c.from))].map((v) => v[b]);
  if (py >= c.from) return base;
  const q0 = qx(era, sex, c.from, age);
  const q = qx(era, sex, py, age);
  if (!(q > q0)) return base;
  const out = base.map((v) => (v * q0) / q);
  const idx = COMMUNICABLE.map((k) => c.keys.indexOf(k));
  const w = idx.reduce((s, j) => s + base[j], 0);
  const extra = (q - q0) / q;
  if (w > 0) for (const j of idx) out[j] += (extra * base[j]) / w;
  else out[c.keys.indexOf('infection')] += extra;
  return out;
}

// ตัวคูณปัจจัยเสี่ยงของชีวิตนี้ต่อสาเหตุ key (ยังไม่หาร norm)
export function riskOf(st, key) {
  let m = 1;
  for (const [flag, by] of Object.entries(DEATH_RISK)) if (st.flags[flag] && by[key]) m *= by[key];
  if (st.heredity?.includes(key)) m *= HEREDITY_RISK;
  return Math.min(DEATH_RISK_CAP, m);
}

// พ่อ/แม่จากไปด้วยโรคที่ถ่ายทอดได้ → จดเป็นประวัติครอบครัวของชีวิตนี้ (คืน true = เพิ่งรู้ปีนี้)
export function inherit(st, cause) {
  if (!HEREDITARY.includes(cause) || st.heredity.includes(cause)) return false;
  st.heredity.push(cause);
  return true;
}

// ญาติ/พ่อแม่ (B110 ชิ้น 2): ตายตามตารางชีพทั้งรุ่น ไม่มีปัจจัยเสี่ยงรายคน · โรคเรื้อรังนัดล่วงหน้า 1–3 ปีแบบเดียวกับตัวเอง
// roll = เลขที่ stream เดิมของคนนั้น (famRng/kinRng) ดึงปีละครั้งเท่าเดิม · สาเหตุและนัดป่วยดึงจาก rng แยก (kinCauseRng)
// p.ill = {cause, age} นัดตายที่อายุนั้น (อายุแบบเดียวกับ age ที่ส่งเข้า) · คืนสาเหตุ หรือ null = รอดปีนี้
export function kinDeathRoll(era, seed, rng, p, year, age, roll) {
  if (p.ill && age >= p.ill.age) return p.ill.cause;
  const keys = era.causes.keys;
  const py = protoYear(era, seed, year);
  const q = qx(era, p.sex, py, age);
  const s = causeShares(era, p.sex, py, age);
  if (q >= 1) return pickCause(rng, keys, s);
  // เด็กเล็กยังไม่มีนัดจากปีก่อนครบทุกระยะ — ส่วนที่นัดไม่ถึงของโรคเรื้อรังตายปีนี้เลย
  const span = ILL_YEARS[1] - ILL_YEARS[0] + 1;
  const unscheduled = (span - Math.max(0, Math.min(span, age - ILL_YEARS[0] + 1))) / span;
  const now = s.map((x, j) => q * x * (CHRONIC.includes(keys[j]) ? unscheduled : 1));
  if (roll < now.reduce((a, x) => a + x, 0)) return pickCause(rng, keys, now);
  if (!p.ill) {
    const years = rng.int(...ILL_YEARS);
    const at = age + years;
    const py2 = protoYear(era, seed, year + years);
    const q2 = at >= MAX_AGE ? 1 : qx(era, p.sex, py2, at);
    if (q2 < 1) {
      const ch = causeShares(era, p.sex, py2, at).map((x, j) => (CHRONIC.includes(keys[j]) ? q2 * x : 0));
      if (rng.next() < ch.reduce((a, x) => a + x, 0)) p.ill = { cause: pickCause(rng, keys, ch), age: at };
    }
  }
  return null;
}

// สาเหตุของการตายที่ไม่ได้มาจากตารางชีพ (การ์ดเนื้อหาสั่งตาย) — สุ่มตามสัดส่วนของอายุนั้น
export function kinCause(era, seed, rng, sex, year, age) {
  return pickCause(rng, era.causes.keys, causeShares(era, sex, protoYear(era, seed, year), age));
}

// ข้อความแกนตอนญาติตรวจเจอโรคเรื้อรัง — เลน A ต่อยอดด้วยการ์ด when.kin_illness
export const KIN_ILL_TEXT = {
  heart: (who) => `${who}ตรวจพบว่าหัวใจไม่ค่อยดีแล้ว หมอให้กินยาและระวังตัวไปตลอด`,
  stroke: (who) => `${who}เส้นเลือดในสมองตีบจนต้องนอนโรงพยาบาล กลับบ้านมาร่างกายไม่เหมือนเดิม`,
  cancer: (who) => `ผลตรวจของ${who}ออกมาว่าเป็นมะเร็ง หมอเริ่มพูดถึงการรักษาที่ยาวและหนัก`,
  diabetes_kidney: (who) => `เบาหวานกับไตของ${who}ทรุดลงจนหมอนัดตรวจถี่ขึ้นทุกเดือน`,
  liver: (who) => `หมอบอกว่าตับของ${who}เริ่มแข็ง ต้องดูแลตัวเองอย่างจริงจัง`,
  chronic_resp: (who) => `${who}หายใจหอบเหนื่อยง่ายขึ้นทุกวัน หมอบอกว่าปอดเสื่อมเรื้อรัง`,
};

// ค่าเฉลี่ยของ riskOf ทั้งประชากรที่ยังมีชีวิตในเพศ×ช่วงอายุนั้น — ไม่มีข้อมูล = 1
const normOf = (era, sex, key, b) => era.causes.norm?.[sex]?.[key]?.[b] ?? 1;

// ส่วนของ qx ที่แต่ละสาเหตุกิน (ผลรวม = โอกาสตายรวมของปีนั้น) · k = ตัวคูณสุขภาพ×กรรมของชีวิตนี้
export function causeHazards(st, py, age, k) {
  const era = st.content.era;
  const base = qx(era, st.sex, py, age);
  const s = causeShares(era, st.sex, py, age);
  const b = causeBand(era, age);
  return era.causes.keys.map((key, j) => base * k * s[j] * (riskOf(st, key) / normOf(era, st.sex, key, b)));
}

// สุ่มสาเหตุตามน้ำหนัก · เฉพาะดัชนีที่ allow ยอม (ไม่ใส่ = ทุกตัว)
export function pickCause(rng, keys, w, allow = null) {
  let sum = 0;
  for (let j = 0; j < w.length; j++) if (!allow || allow(keys[j])) sum += w[j];
  if (!(sum > 0)) return 'other';
  let r = rng.next() * sum;
  for (let j = 0; j < w.length; j++) {
    if (allow && !allow(keys[j])) continue;
    r -= w[j];
    if (r < 0) return keys[j];
  }
  return keys.findLast((key) => !allow || allow(key));
}
