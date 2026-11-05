// ความจำข้ามชาติ (B67a · ใบ 159): ของชาติก่อนที่ชาตินี้จำได้ ส่งต่อทุกทางเกิดผ่านทายาท (makeHeir) ช่องเดียว
// ไม่ใช่บัญชีบุญบาป — ไม่มีแต้ม ไม่มีชื่อหมวด · การ์ดอ่านผ่าน when.past_life เท่านั้น
// ชีวิตแรกไม่มีช่อง st.past (ไม่ใช่ null) ⇒ ชีวิตที่ไม่มีชาติก่อนได้สถานะเท่าก่อนมีระบบทุกไบต์
// ไม่ import life.mjs (life.mjs import ไฟล์นี้)

// พรสวรรค์ติดชาติ (ข้อ 3): ชาติก่อนทำอาชีพหลักนานถึง years ปี → ชาตินี้ได้งานเดียวกันแล้วตัวคูณรายได้เริ่มที่ mul แทน 1
export const PAST_TALENT = { years: 10, mul: 1.1 };
// วิธีตายของชีวิตที่หายไปต่างโลก — ไม่มีศพ ไม่มีสาเหตุในกลุ่มสาเหตุตาย
export const PAST_GONE = 'gone';
export const PAST_PROVINCE = ['same', 'other'];

// อาชีพที่ทำนานที่สุดของชีวิตนี้ · ปีเท่ากันเอาอาชีพที่เริ่มนับก่อน · ไม่เคยทำงาน = null
export function pastMainJob(st) {
  let job = null, years = 0;
  for (const [k, n] of Object.entries(st.workYears ?? {})) if (n > years) [job, years] = [k, n];
  return { job, years };
}

const addOnce = (list, v) => (v && !list.includes(v) ? [...list, v] : list);

// ความจำที่ชีวิตที่เพิ่งจบฝากให้ชาติถัดไป · realm = id ภูมิที่ปรโลกชี้ให้ชาตินี้ · gone = หายไปต่างโลก
// รายการสะสม (ภูมิ/อาชีพที่เคยเป็น) ต่อจากความจำเดิม · treasures/wish/barami = ช่องของกิมมิคข้อ 6 7 10 ส่งต่อค่าเดิมจนกว่าใบนั้นจะเติม
export function pastOf(st, realm, gone) {
  const prev = st.past;
  const { job, years } = pastMainJob(st);
  return {
    lives: (prev?.lives ?? 0) + 1,
    province: st.province ?? null,
    job,
    jobYears: years,
    cause: gone ? PAST_GONE : st.cause ?? 'other',
    realm,
    realms: addOnce(prev?.realms ?? [], realm),
    jobs: addOnce(prev?.jobs ?? [], job),
    treasures: [...(prev?.treasures ?? [])],
    wish: null,
    barami: prev?.barami ?? 0,
  };
}

// อาชีพที่ชาตินี้มีพรสวรรค์ติดมา · null = ไม่มี (ชีวิตแรก/ชาติก่อนทำงานไม่นานพอ)
export const pastTalent = (past) => (past?.job && past.jobYears >= PAST_TALENT.years ? past.job : null);

// ตัวคูณรายได้ตอนเริ่มงาน: งานตรงพรสวรรค์ได้ mul · งานอื่น 1 เท่าเดิม
export const talentStart = (st) => (st.talent && st.talent === st.occupation ? PAST_TALENT.mul : 1);

// when.past_life: any = มี/ไม่มีชาติก่อน · province = เกิดจังหวัดเดียวกับชาติก่อนไหม · job/cause = อาชีพหลัก/วิธีตายชาติก่อน
// realm = เคยไปภูมินั้นสักชาติ · talent = มีพรสวรรค์ติดชาติ · เงื่อนไขอื่นนอกจาก any:false ต้องมีชาติก่อน
export function pastLifeOk(st, w) {
  const p = st.past;
  if (w.any !== undefined && w.any !== !!p) return false;
  if (!p) return w.any === false && Object.keys(w).length === 1;
  if (w.province !== undefined && (w.province === 'same') !== (p.province === st.province)) return false;
  if (w.job && !w.job.includes(p.job)) return false;
  if (w.cause && !w.cause.includes(p.cause)) return false;
  if (w.realm && !w.realm.some((r) => p.realms.includes(r))) return false;
  if (w.talent !== undefined && w.talent !== !!st.talent) return false;
  return true;
}

// เซฟก่อนมีความจำข้ามชาติ: ชีวิตรุ่นที่ 2 ขึ้นไปสร้างจากแถวท้ายของผังตระกูล (ที่เกิด · วิธีตาย · ภูมิ) · อาชีพไม่เคยบันทึก = null
// realmId แปลงชื่อภูมิในผังเป็น id (ผู้เรียกส่งมา — ไฟล์นี้ไม่ import ปรโลก)
export function pastFromLineage(lineage, realmId) {
  const rows = (lineage ?? []).filter((l) => !l.isekai);
  const last = rows.at(-1);
  if (!last) return undefined;
  const realms = [];
  for (const l of rows) {
    const r = realmId(l.realm);
    if (r && !realms.includes(r)) realms.push(r);
  }
  return { lives: rows.length, province: last.province ?? null, job: null, jobYears: 0, cause: last.gone ? PAST_GONE : last.cause ?? 'other', realm: realmId(last.realm), realms, jobs: [], treasures: [], wish: null, barami: 0 };
}
