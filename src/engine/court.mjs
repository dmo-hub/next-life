// เฉียดตาย + โกงความตายถูกเรียกตัว (B153): ทริปศาลทั้งตัวขณะยังมีชีวิต
// เฉียดตายไม่ยืดชีวิต — คิดจากแถบเลขสุ่มตายตัวเดิมที่เลยผลรวมไปนิดเดียว (ไม่ดึงเลขเพิ่มจาก st.rng/causeRng) ⇒ อายุตายและสาเหตุเท่าเดิมทุกชีวิต
// โกงความตาย = ผลสุ่มตายจริงตอนถือธง ⇒ ไปศาลก่อน แล้วตายปีเดิม (อายุขัยไม่ยืด)
// การ์ดศาลไม่แตะค่าสถานะ/บัญชี (เนื้อหาผ่าน lint court-shape) และไม่นับโควตาการ์ดของปี — ชีวิตหลังฟื้นจึงเดินเหมือนไม่มีทริป
import { makeRng } from './rng.mjs';
import { recordMerit, netLedger } from './merit.mjs';
import { AFTERLIFE_STAGE } from './life.mjs';
import { VERDICT_REF } from './afterlife.mjs';

// band = แถบเกือบตายเป็นสัดส่วนของโอกาสตายจากอุบัติเหตุของปีนั้น (ค่าตั้งของเกม วัดเป้าใน harness/near-death)
// minAge = ต่ำกว่านี้ไม่มีทริป (การ์ดเล่าเหตุแบบผู้ใหญ่) · salt = stream เลือกใบศาล แยกจากทุก stream ของโลก
export const NEAR_DEATH = { band: 1, minAge: 15, causes: ['road', 'accident'], salt: 0x7f4a7c15 };
export const COURT_SCENES = ['near', 'visit', 'summons'];
// ระดับคำใบ้จากบัญชีสุทธิ (ช่วงเดียวกับ verdictLevel −1..1) · ขอบตามภูมิที่ปรโลก: นรก ≤ −0.5 · เปรต/ดิรัจฉาน < 0 · เทวดา > 2/3
export const NEAR_HINT_LEVELS = [
  { id: 'dark2', upTo: -0.5 },
  { id: 'dark1', upTo: -0.01 },
  { id: 'even', upTo: 0.2 },
  { id: 'bright1', upTo: 2 / 3 },
  { id: 'bright2', upTo: Infinity },
];
export const hintLevel = (ledger) => {
  const x = Math.max(-1, Math.min(1, netLedger(ledger) / VERDICT_REF));
  return NEAR_HINT_LEVELS.find((l) => x <= l.upTo).id;
};

// เรียกจาก deathRoll ตอนรอด: over = u − ผลรวมโอกาสตาย (≥ 0) · now = โอกาสรายสาเหตุของปีนี้
// สาเหตุของเหตุเกือบตายอ่านจากตำแหน่ง over ในแถบเอง ไม่ต้องสุ่มเพิ่ม
export function nearMiss(st, over, keys, now) {
  if (st.nearDeath != null || st.court || st.age < NEAR_DEATH.minAge) return;
  let edge = 0;
  for (const cause of NEAR_DEATH.causes) {
    edge += NEAR_DEATH.band * (now[keys.indexOf(cause)] ?? 0);
    if (over < edge) {
      st.nearDeath = st.age;
      st.court = { mode: 'visit', near: cause, steps: ['near', 'visit', 'hint'], i: 0, wait: false };
      return;
    }
  }
}

export const summonsCourt = (cause) => ({ mode: 'summons', cause, steps: ['summons'], i: 0, wait: false });

const courtRng = (st) => (st.nearRng ??= makeRng(st.seed ^ NEAR_DEATH.salt));

function courtEvent(st, scene) {
  const c = st.court;
  const pool = st.content.events.filter((e) => e.stage === AFTERLIFE_STAGE && e.scene === scene && (scene !== 'near' || e.near === c.near));
  return pool.length ? pool[Math.floor(courtRng(st).next() * pool.length)] : null;
}

const courtBase = (st, mode) => ({ kind: 'event', court: mode, type: 'B', national: false, funeral: false, age: st.age, stage: AFTERLIFE_STAGE });

// การ์ดใบถัดไปของทริป · null = ทริปจบ (ผู้เรียกปิดทริป) · ขั้นที่ไม่มีเนื้อหาข้ามไป
export function courtCard(st) {
  const c = st.court;
  if (c.wait) throw new Error('ยังมีการ์ดที่รอเลือก');
  while (c.i < c.steps.length) {
    const step = c.steps[c.i];
    if (step === 'hint') {
      c.i++;
      const lines = st.content.nearHints?.[hintLevel(st.ledger)];
      if (!lines?.length) continue;
      const text = lines[Math.floor(courtRng(st).next() * lines.length)];
      return { ...courtBase(st, c.mode), id: 'court_hint', title: null, text, choices: [], fx: [], locked: [] };
    }
    const ev = courtEvent(st, step);
    if (!ev) {
      c.i++;
      continue;
    }
    if (ev.choices.length) {
      c.ev = ev;
      c.wait = true;
    } else c.i++;
    return { ...courtBase(st, c.mode), id: ev.id, title: ev.title ?? null, text: ev.text, choices: ev.choices.map((x) => x.text), fx: ev.choices.map(() => ''), locked: ev.choices.map(() => null) };
  }
  return null;
}

// ใบเยือน/เกือบตาย = ป้ายกลางล้วน ไม่ลงบัญชี (karmaMultiplier ต้องไม่ขยับ) · ใบถูกเรียกตัวลงบัญชีได้ เพราะตายปีนี้อยู่แล้ว ผลไปถึงปรโลกเท่านั้น
// ไม่ลง st.log — การ์ดตายสรุปจาก log ทริปจะทำให้ชีวิตที่เฉียดตายต่างจากชีวิตเดียวกันที่ไม่เฉียด
export function chooseCourt(st, idx) {
  const c = st.court;
  const ch = c.wait && c.ev.choices[idx];
  if (!ch) throw new Error('ตัวเลือกไม่ถูกต้อง');
  if (c.mode === 'summons') for (const f of recordMerit(st.ledger, ch.merit, c.ev.id)) st.flags[f] = true;
  c.ev = null;
  c.wait = false;
  c.i++;
}

// บอทเลือกใบศาลด้วย stream ของตัวเอง — stream บอทหลักของชีวิตไม่เลื่อน ทางเลือกหลังทริปจึงเท่าเดิม
export const courtPick = (card, rng) => Math.floor(rng.next() * card.choices.length);
