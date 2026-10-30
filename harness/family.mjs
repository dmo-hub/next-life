// harness ครอบครัว (B36a): บอท 6 บุคลิกเล่นเนื้อหาจริง ไล่ทุกการ์ด
// ด่าน: จำนวนลูกต่อชีวิตอยู่ในกรอบ · สมาชิกตายตามตารางชีพ (ตายจริง/คาดจาก qx ใกล้ 1 · ตัวควบคุมใช้ qx อายุ +20 ต้องหลุด)
// · คนที่จากไปไม่กลับมามีชีวิต และไม่ถูกการ์ดเรียกชื่อ · ชื่อในบ้านไม่ซ้ำ · ธง married/has_kids ตรงกับสมาชิกจริงทุกการ์ด
// · ทางในตระกูลเกิดเป็นลูก/หลานจริงที่ยังอยู่ (ชื่อ/เพศ/ปีเกิดตรง)
// B36a2: คนในบ้านจากไปเองมีการ์ดแจ้งครบ · คนเป้าของการ์ดสุ่ม · bond อยู่ใน floor–100 ทุกการ์ด (เนื้อหายังไม่มี op ลด bond) · การ์ดดูแลพา bond ขึ้นเกินค่าเริ่มได้จริง · ญาติช่วยเกิดได้จริง
// · สัตว์เลี้ยงตายตรงอายุขัย · เพื่อนรุ่นเกิดปีเดียวกับเรา · สองบทบาทนี้ไม่ตั้งธง
import { playLife, playAfterlife, nextLife, mixSeed, lifeQx, focusOf, memberAge, newLife, addMember, ageKin, BOND_START, BOND_FLOOR } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';
import { kinGaps, kinDeadRefs, familyLockShort, FAMILY_OPEN_MIN } from './kin.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 5000);
const seed = opt('seed', 1);
const content = loadContent();
const era = content.era;
const eventById = new Map(content.events.map((e) => [e.id, e]));
// กรอบจำนวนลูกเฉลี่ยของคนที่อยู่ถึง 50 — ค่าตั้งของเกม (ไม่มีอัตราเจริญพันธุ์รวมรายยุคในชุดข้อมูล) · ลูกมาจากตัวเลือกของผู้เล่นเท่านั้น
// ขอบล่างต่ำเพราะเนื้อหายังมีทางมีลูกน้อย (การ์ดถามมีลูกเพิ่มอยู่ในงานเนื้อหาครอบครัว) — ขอบนี้กันแค่ "ไม่มีใครมีลูกเลย"
const KIDS_BAND = [0.05, 3];
// ปีเกิดของรุ่นถัดไปถูกตัดที่ปีเกิดสุดท้ายในข้อมูล (ทางในตระกูลเดิม) — ลูกจริงที่เกิดหลังจากนั้นเทียบหลังตัด
const lastBirth = era.births.from + era.births.w.length - 1;

const kinDead = new Map();
let revive = 0, deadNamed = 0, flagBad = 0, nameDup = 0, households = 0, cards = 0;
let died = 0, expected = 0, expectedShift = 0;
let heirChecks = 0, heirBad = 0;
let bondBad = 0, bondUp = 0, aided = 0;
let lossCards = 0, lossEvents = 0, multiKid = 0, notLatest = 0;
// B164 ใครมาส่งงานศพ: ตัดวลีคงที่ของบรรทัดออกแล้วต้องเหลือแค่ตัวเลข — เหลืออย่างอื่น = มีชื่อคนหรือคำหลุดเข้ามา
let funerals = 0, whoLines = 0, whoCame = 0, whoAway = 0, whoLeak = 0, whoShort = 0;
const WHO_FIXED = ['เป็นคนในวงการที่เคยร่วมงานกันมา', 'เป็นเพื่อนบ้านและคนที่เคยช่วยเหลือกันมา', 'แขกที่เหลือส่วนใหญ่', 'แขกส่วนใหญ่', 'ศาลามีแต่คนในบ้าน', 'อยู่ช่วยงานจนเสร็จ', 'แวะมาแค่ครู่เดียว', 'เพื่อนรุ่นเดียวกัน', 'คู่ชีวิต', 'ลูก', 'หลาน', 'และ', 'คน', '·'];
const whoLeft = (text) => WHO_FIXED.reduce((t, w) => t.split(w).join(''), text).replace(/[\d\s]/g, '');
const kidsAt50 = [];
const roles = { spouse: 0, child: 0, grandchild: 0 };
const fmt = (v) => v.toFixed(2);

for (const [bot, pick] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    const was = new Map();
    const check = (card, st) => {
      cards++;
      if (card.kind === 'result' && card.text.includes('มาช่วยประคอง')) aided++;
      if (card.kind === 'death' && card.funeral) {
        funerals++;
        const w = card.funeral.who;
        const living = st.kin.filter((m) => ['spouse', 'child', 'grandchild', 'peer'].includes(m.role) && m.alive).length;
        if (w) {
          whoLines++;
          if (w.includes('อยู่ช่วยงาน')) whoCame++;
          if (w.includes('แวะมาแค่ครู่เดียว')) whoAway++;
          if (whoLeft(w)) whoLeak++;
        } else if (living || card.funeral.guests) whoShort++;
      }
      for (const m of [...st.parents, ...st.kin]) if (m.alive && !(m.bond >= BOND_FLOOR && m.bond <= 100)) bondBad++;
      for (const m of st.kin) {
        if (was.get(m.id) === false && m.alive) revive++;
        was.set(m.id, m.alive);
      }
      if (card.loss) lossCards++;
      // คนเป้าสุ่มตอนการ์ดเลือกขึ้น — การ์ดผลใบถัดมายังเรียกคนเดิมได้แม้ผลทำให้เขาจากไป จึงตรวจเฉพาะการ์ดเลือก
      // การ์ดชวนไปต่างโลก (B68d) ไม่ผ่านการเลือกคนเป้าและข้อความไม่เรียกชื่อใคร — คนเป้าที่ค้างจากการ์ดก่อนหน้าจึงไม่ใช่คนที่การ์ดนี้เรียก
      // ใบศาลเฉียดตาย (B153) ก็เช่นกัน — แกนแทรกกลางชีวิตโดยไม่เลือกคนเป้า
      if (card.kind === 'event' && !card.entry && !card.court) {
        // B138: ข้อความที่ยังเปิดอยู่เอ่ยถึงแม่ พ่อ คู่ ลูก สัตว์เลี้ยง ที่ไม่มีชีวิตแล้ว
        const ev = eventById.get(card.id);
        if (ev) for (const k of kinDeadRefs(card, ev, st)) kinDead.set(k, (kinDead.get(k) ?? 0) + 1);
        for (const r of ['spouse', 'child', 'grandchild']) {
          const f = focusOf(st, r);
          if (f && !f.alive) deadNamed++;
        }
        const kids = st.kin.filter((m) => m.role === 'child' && m.alive && !m.left);
        if (kids.length > 1) {
          multiKid++;
          if (focusOf(st, 'child').id !== kids.at(-1).id) notLatest++;
        }
      }
      const has = (role) => st.kin.some((m) => m.role === role && m.alive && !m.left);
      if (st.kin.some((m) => m.role === 'spouse') && !!st.flags.married !== has('spouse')) flagBad++;
      if (st.kin.some((m) => m.role === 'child') && !!st.flags.has_kids !== has('child')) flagBad++;
    };
    const { state: st } = playLife(mixSeed(seed, i * 7 + 1), content, pick, check);
    for (const m of [...st.parents, ...st.kin]) if (m.bond > BOND_START[m.role ?? 'parent']) bondUp++;
    lossEvents += st.kinLoss.length;
    for (const m of st.kin) {
      roles[m.role]++;
      // สัตว์ตายตามอายุขัยของชนิด ไม่ใช่ตารางชีพคน (B44)
      if (m.role === 'pet' || m.role === 'herd') continue;
      // ความเสี่ยงสะสมปีต่อปีของช่วงที่สมาชิกมีชีวิตระหว่างชีวิตผู้เล่น (ปีเกิดถึงปีตายหรือปีที่ผู้เล่นตาย)
      const end = m.alive ? st.birthYear + st.age : m.born + m.diedAge + 1;
      for (let y = Math.max(m.born, st.birthYear) + 1; y <= end; y++) {
        const a = y - m.born - 1;
        expected += lifeQx(era, st.seed, m.sex, y, a);
        expectedShift += lifeQx(era, st.seed, m.sex, y, Math.min(110, a + 20));
      }
      if (!m.alive) died++;
    }
    // ชื่อสัตว์ซ้ำชื่อคนได้ (เจ้าดำ) — นับเฉพาะคน
    const names = [st.name, ...st.parents.map((p) => p.name), ...st.kin.filter((m) => m.role !== 'pet' && m.role !== 'herd').map((m) => m.name)];
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
// B138: ด่านคงที่ไล่ทุกการ์ด (ครอบการ์ดที่บอทยังไม่เคยเจอ) + ด่านตอนเล่นจริง (จับเงื่อนไขที่เขียนไว้แต่ไม่ตรงคนที่เอ่ยถึง)
{
  const gaps = kinGaps(content.events);
  check('ข้อความที่เอ่ยถึงคนในบ้านมีเงื่อนไขให้เขายังอยู่', gaps.length, gaps.length ? ` · ${gaps.slice(0, 5).map((g) => `${g.id} ${g.at} ${g.who} «${g.text}»`).join(' · ')}` : '');
  const short = familyLockShort(content.events);
  check(`ล็อกด้วยครอบครัวแล้วยังกดได้ ≥ ${FAMILY_OPEN_MIN} ตัวเลือก`, short.length, short.length ? ` · ${short.map((x) => `${x.id} ${x.open}/${x.of}`).join(' · ')}` : '');
  const dead = [...kinDead].sort((a, b) => b[1] - a[1]);
  check('การ์ดที่ขึ้นไม่เอ่ยถึงคนในบ้านที่ไม่อยู่แล้ว', dead.reduce((t, [, v]) => t + v, 0), dead.length ? ` · ${dead.slice(0, 5).map(([k, v]) => `${k} ×${v}`).join(' · ')}` : '');
}
check(`ชื่อในบ้านไม่ซ้ำ (${households} บ้าน)`, nameDup);
check('ธง married/has_kids ตรงสมาชิกจริงทุกการ์ด', flagBad);
check('ทางในตระกูลเกิดเป็นลูก/หลานจริง', heirChecks ? heirBad : 1, ` ${heirChecks - heirBad}/${heirChecks}`);
check(`bond อยู่ใน ${BOND_FLOOR}–100 ทุกการ์ด`, bondBad);
check('การ์ดดูแลพา bond เกินค่าเริ่มได้', bondUp ? 0 : 1, ` ${bondUp} คน`);
check('ญาติช่วยประคองเกิดได้', aided ? 0 : 1, ` ${aided} ครั้ง`);
check('คนในบ้านจากไปเองทุกครั้งมีการ์ดแจ้ง', lossEvents && lossCards === lossEvents ? 0 : 1, ` ${lossCards}/${lossEvents}`);
check('คนเป้าของการ์ดสุ่มได้ ไม่ใช่ลูกคนเล็กเสมอ', multiKid && notLatest ? 0 : 1, ` ${notLatest}/${multiKid} การ์ด`);
check('งานศพบอกใครมาส่งทุกงานที่มีคน (B164)', whoShort, ` ${whoLines}/${funerals} งาน`);
check('  บรรทัดใครมาส่งไม่มีชื่อคน', whoLeak);
check('  ขึ้นได้ทั้งทางอยู่ช่วยงานและแวะครู่เดียว', whoCame && whoAway ? 0 : 1, ` อยู่ ${whoCame} · แวะ ${whoAway}`);

// สัตว์เลี้ยง/เพื่อนรุ่น: ยังไม่มีเนื้อหาใช้ — ทดสอบกับชีวิตจริงที่เติมสมาชิกเอง
{
  const st = newLife(mixSeed(seed, 99), content);
  const pet = addMember(st, 'pet', { kind: 'หมา', life: [3, 3] });
  const herd = addMember(st, 'herd', { kind: 'ไก่', life: [2, 2] });
  const peer = addMember(st, 'peer');
  for (let a = 1; a <= 5; a++) {
    st.age = a;
    ageKin(st, st.birthYear + a);
  }
  // คู่ใจมีชื่อสุ่มจาก seed · ฝูงไม่มีชื่อ (B44)
  check('สัตว์เลี้ยงตายตรงอายุขัย', !pet.alive && pet.diedAge === 3 && !!pet.name && pet.kind === 'หมา' && !herd.alive && herd.diedAge === 2 && herd.name === null ? 0 : 1);
  check('เพื่อนรุ่นเกิดปีเดียวกับเรา มีชื่อ', peer.born === st.birthYear && !!peer.name ? 0 : 1);
  check('สัตว์เลี้ยง/เพื่อนรุ่นไม่ตั้งธงครอบครัว', st.flags.married || st.flags.has_kids ? 1 : 0);
}
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
