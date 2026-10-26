// harness ครอบครัว (B36a): บอท 6 บุคลิกเล่นเนื้อหาจริง ไล่ทุกการ์ด
// ด่าน: จำนวนลูกต่อชีวิตอยู่ในกรอบ · สมาชิกตายตามตารางชีพ (ตายจริง/คาดจาก qx ใกล้ 1 · ตัวควบคุมใช้ qx อายุ +20 ต้องหลุด)
// · คนที่จากไปไม่กลับมามีชีวิต และไม่ถูกการ์ดเรียกชื่อ · ชื่อในบ้านไม่ซ้ำ · ธง married/has_kids ตรงกับสมาชิกจริงทุกการ์ด
// · ทางในตระกูลเกิดเป็นลูก/หลานจริงที่ยังอยู่ (ชื่อ/เพศ/ปีเกิดตรง)
import { playLife, playAfterlife, nextLife, mixSeed, lifeQx, focusOf, memberAge } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 5000);
const seed = opt('seed', 1);
const content = loadContent();
const era = content.era;
// กรอบจำนวนลูกเฉลี่ยของคนที่อยู่ถึง 50 — ค่าตั้งของเกม (ไม่มีอัตราเจริญพันธุ์รวมรายยุคในชุดข้อมูล) · ลูกมาจากตัวเลือกของผู้เล่นเท่านั้น
// ขอบล่างต่ำเพราะเนื้อหายังมีทางมีลูกน้อย (การ์ดถามมีลูกเพิ่มอยู่ในงานเนื้อหาครอบครัว) — ขอบนี้กันแค่ "ไม่มีใครมีลูกเลย"
const KIDS_BAND = [0.05, 3];
// ปีเกิดของรุ่นถัดไปถูกตัดที่ปีเกิดสุดท้ายในข้อมูล (ทางในตระกูลเดิม) — ลูกจริงที่เกิดหลังจากนั้นเทียบหลังตัด
const lastBirth = era.births.from + era.births.w.length - 1;

let revive = 0, deadNamed = 0, flagBad = 0, nameDup = 0, households = 0, cards = 0;
let died = 0, expected = 0, expectedShift = 0;
let heirChecks = 0, heirBad = 0;
const kidsAt50 = [];
const roles = { spouse: 0, child: 0, grandchild: 0 };
const fmt = (v) => v.toFixed(2);

for (const [bot, pick] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    const was = new Map();
    const check = (card, st) => {
      cards++;
      for (const m of st.kin) {
        if (was.get(m.id) === false && m.alive) revive++;
        was.set(m.id, m.alive);
      }
      for (const r of ['spouse', 'child', 'grandchild']) {
        const f = focusOf(st, r);
        if (f && !f.alive) deadNamed++;
      }
      const has = (role) => st.kin.some((m) => m.role === role && m.alive && !m.left);
      if (st.kin.some((m) => m.role === 'spouse') && !!st.flags.married !== has('spouse')) flagBad++;
      if (st.kin.some((m) => m.role === 'child') && !!st.flags.has_kids !== has('child')) flagBad++;
    };
    const { state: st } = playLife(mixSeed(seed, i * 7 + 1), content, pick, check);
    for (const m of st.kin) {
      roles[m.role]++;
      // ความเสี่ยงสะสมปีต่อปีของช่วงที่สมาชิกมีชีวิตระหว่างชีวิตผู้เล่น (ปีเกิดถึงปีตายหรือปีที่ผู้เล่นตาย)
      const end = m.alive ? st.birthYear + st.age : m.born + m.diedAge + 1;
      for (let y = Math.max(m.born, st.birthYear) + 1; y <= end; y++) {
        const a = y - m.born - 1;
        expected += lifeQx(era, st.seed, m.sex, y, a);
        expectedShift += lifeQx(era, st.seed, m.sex, y, Math.min(110, a + 20));
      }
      if (!m.alive) died++;
    }
    const names = [st.name, ...st.parents.map((p) => p.name), ...st.kin.map((m) => m.name)];
    households++;
    if (new Set(names).size !== names.length) nameDup++;
    if (st.age >= 50) kidsAt50.push(st.kin.filter((m) => m.role === 'child').length);
    // ทางในตระกูล: ถ้ามีลูก/หลานจริงที่ยังอยู่ ผู้เล่นรุ่นถัดไปต้องเป็นหนึ่งในนั้น
    const af = playAfterlife(st, pick);
    if (af.path === 'child' && af.heir) {
      const real = st.kin.filter((m) => m.alive && (af.heir.tier === 1 ? m.role === 'child' : af.heir.tier === 2 && m.role === 'grandchild'));
      if (real.length) {
        heirChecks++;
        const next = nextLife(af);
        if (!real.some((m) => m.name === next.name && m.sex === next.sex && Math.min(lastBirth, m.born) === next.birthYear)) heirBad++;
      }
    }
  }
}

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fail++;
};
const mean = kidsAt50.reduce((s, v) => s + v, 0) / Math.max(1, kidsAt50.length);
const dist = [0, 1, 2, 3].map((k) => kidsAt50.filter((v) => (k === 3 ? v >= 3 : v === k)).length);
console.log(`ครอบครัว · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · การ์ด ${cards.toLocaleString('en-US')}`);
console.log(`สมาชิกที่เกิด: คู่ครอง ${roles.spouse} · ลูก ${roles.child} · หลาน ${roles.grandchild}`);
console.log(`ลูกต่อชีวิต (อยู่ถึง 50 · ${kidsAt50.length} ชีวิต): เฉลี่ย ${fmt(mean)} · 0/1/2/3+ คน = ${dist.join(' / ')}`);
check(`ลูกเฉลี่ยอยู่ในกรอบ ${KIDS_BAND.join('–')}`, mean >= KIDS_BAND[0] && mean <= KIDS_BAND[1] ? 0 : 1);
const ratio = died / Math.max(1e-9, expected), ratioShift = died / Math.max(1e-9, expectedShift);
check('สมาชิกตายตามตารางชีพ (ตายจริง/คาดจาก qx 0.9–1.1)', ratio >= 0.9 && ratio <= 1.1 ? 0 : 1, ` ${died} / ${fmt(expected)} = ${fmt(ratio)}`);
check('  ตัวควบคุม qx อายุ +20 ต้องหลุดกรอบ', ratioShift >= 0.9 && ratioShift <= 1.1 ? 1 : 0, ` ${fmt(ratioShift)}`);
check('คนที่จากไปไม่กลับมามีชีวิต', revive);
check('การ์ดไม่เรียกชื่อคนที่จากไป', deadNamed);
check(`ชื่อในบ้านไม่ซ้ำ (${households} บ้าน)`, nameDup);
check('ธง married/has_kids ตรงสมาชิกจริงทุกการ์ด', flagBad);
check('ทางในตระกูลเกิดเป็นลูก/หลานจริง', heirChecks ? heirBad : 1, ` ${heirChecks - heirBad}/${heirChecks}`);
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
