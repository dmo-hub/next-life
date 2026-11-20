// harness ครอบครัว (B36a): บอท 6 บุคลิกเล่นเนื้อหาจริง ไล่ทุกการ์ด
// ด่าน: จำนวนลูกต่อชีวิตอยู่ในกรอบ · สมาชิกตายตามตารางชีพ (ตายจริง/คาดจาก qx ใกล้ 1 · ตัวควบคุมใช้ qx อายุ +20 ต้องหลุด)
// · คนที่จากไปไม่กลับมามีชีวิต และไม่ถูกการ์ดเรียกชื่อ · ชื่อในบ้านไม่ซ้ำ · ธง married/has_kids ตรงกับสมาชิกจริงทุกการ์ด
// · ทางในตระกูลเกิดเป็นลูก/หลานจริงที่ยังอยู่ (ชื่อ/เพศ/ปีเกิดตรง)
// B36a2: คนในบ้านจากไปเองมีการ์ดแจ้งครบ · คนเป้าของการ์ดสุ่ม · bond อยู่ใน floor–100 ทุกการ์ด (เนื้อหายังไม่มี op ลด bond) · การ์ดดูแลพา bond ขึ้นเกินค่าเริ่มได้จริง · ญาติช่วยเกิดได้จริง
// · สัตว์เลี้ยงตายตรงอายุขัย · เพื่อนรุ่นเกิดปีเดียวกับเรา · สองบทบาทนี้ไม่ตั้งธง
// #9: %เคยแต่ง (อยู่ถึง 45) ต่างกันระหว่างช่วงปีเกิดไม่เกิน 3 pp · อายุแต่งครั้งแรกเฉลี่ย 24–28
import { playLife, playAfterlife, nextLife, mixSeed, lifeQx, focusOf, memberAge, newLife, addMember, ageKin, BOND_START, BOND_FLOOR, FILIAL, openChoices, meritId, MERIT_LEVELS } from '../src/engine/index.mjs';
import { readFileSync } from 'node:fs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS, random } from './bots.mjs';
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
// B165 รักครั้งใหม่หลังคู่ตาย: ไม่ขึ้นในช่วงไว้ทุกข์ 3 ปี · ขึ้นได้จริง · แต่งรอบสองได้คู่ใหม่ที่ยังอยู่
const MOURN = 3;
let loveCards = 0, loveEarly = 0, rewed = 0, rewedBad = 0;
// #9 อัตราแต่งงานตามรุ่นเกิด (ด่าน ค): %เคยแต่งของคนอยู่ถึง 45 ต่างกันระหว่างช่วงปีเกิด 10 ปีทุกคู่ ≤ WED_SPREAD pp
// · อายุแต่งครั้งแรกเฉลี่ยอยู่ใน WED_AGE · "เคยแต่ง" = flagAge.married (จดครั้งแรก ไม่ลบตอนคู่จากไป)
// เทียบกันเองในเกม ไม่ใช่เทียบโลกจริง
// ช่วงเล็กสุดต่ำกว่า WED_MIN คน (อยู่ถึง 45) = ข้ามข้อส่วนต่าง: noise ของตัวอย่างเล็กเกิน 3 pp เอง (--n 1000 ช่วงเล็กสุด ~350–500 คน ตก 2 ใน 3 seed)
const WED_SPREAD = 3, WED_AGE = [24, 28], WED_MIN = 2000;
const wedCohort = new Map();
// ใบ 93 (B114 ข้อ 153 167): สัดส่วนคู่แรกของชีวิตที่หย่า แยกตามปีที่แต่ง · กรอบอยู่ data/divorce-rate.json
const divBands = JSON.parse(readFileSync(new URL('../data/divorce-rate.json', import.meta.url), 'utf8')).bands.map((x) => ({ ...x, wed: 0, div: 0 }));
// ใบ 94 (B114 ข้อ 153): ชีวิตคู่ที่มีนอกใจ (เราหรือคู่) ต่อชีวิตที่เคยแต่ง · ราวครึ่งจบหย่า · วัดเฉพาะบอทสุ่ม (สายบุญไม่เคยรับ สายบาปรับทุกใบ)
const CHEAT = { from: 0.10, to: 0.15, divFrom: 0.30, divTo: 0.70, wed: 0, cheat: 0, div: 0, us: 0, them: 0 };
// ใบ 97 (B114 ข้อ 158 161 162): ชีวิตที่เคยหย่า → คืนดีกับคู่เก่า · ไม่เกิน 1 ครั้งต่อชีวิต · ไม่เกิน 5 ปีหลังหย่า · วัดบอทสุ่ม (ทางคืนดีเป็น 1 ใน 4 ตัวเลือก)
const REUNION = { from: 0.03, to: 0.20, div: 0, back: 0, twice: 0, late: 0 };
const wedAges = [];
const kidsAt50 = [];
const roles = { spouse: 0, child: 0, grandchild: 0 };
const fmt = (v) => v.toFixed(2);

for (const [bot, pick] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    const was = new Map();
    const joined = new Map();
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
        if (!joined.has(m.id)) joined.set(m.id, st.birthYear + st.age);
      }
      if (card.loss) lossCards++;
      if (card.kind === 'eraEvent' || card.kind === 'event') {
        const id = card.ev?.id ?? card.id;
        if (id?.startsWith('remarry_love_')) {
          loveCards++;
          const l = st.kinLoss.findLast((x) => x.role === 'spouse');
          if (!l || st.birthYear + st.age - l.year < MOURN) loveEarly++;
        }
      }
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
      // แยกทาง (ใบ 89/92) = ออกจากบ้านแต่ยังเป็นคู่ตามกฎหมาย ธง married คง
      const spouseKept = has('spouse') || st.kin.some((m) => m.role === 'spouse' && m.alive && m.status === 'apart');
      if (st.kin.some((m) => m.role === 'spouse') && !!st.flags.married !== spouseKept) flagBad++;
      if (st.kin.some((m) => m.role === 'child') && !!st.flags.has_kids !== has('child')) flagBad++;
    };
    const { state: st } = playLife(mixSeed(seed, i * 7 + 1), content, pick, check);
    for (const m of [...st.parents, ...st.kin]) if (m.bond > BOND_START[m.role ?? 'parent']) bondUp++;
    const wedAt = st.log.find((x) => x.id.startsWith('remarry_wedding_'));
    if (wedAt) {
      rewed++;
      // คู่ใหม่ = คู่ที่เพิ่มหลังคู่เก่าจากไป · ต้องไม่ใช่คนเดิมที่ฟื้น
      const spouses = st.kin.filter((m) => m.role === 'spouse');
      if (spouses.length < 2 || spouses.at(-1).born === undefined) rewedBad++;
    }
    // พ่อแม่ตอนผู้เล่นเด็กเล็กลงบันทึกอย่างเดียว ไม่มีการ์ดแจ้ง (ใบ 104)
    lossEvents += st.kinLoss.filter((l) => !(l.role === 'parent' && l.atYou < 7)).length;
    for (const m of st.kin) {
      roles[m.role]++;
      // สัตว์ตายตามอายุขัยของชนิด ไม่ใช่ตารางชีพคน (B44)
      if (m.role === 'pet' || m.role === 'herd') continue;
      // ความเสี่ยงสะสมปีต่อปีของช่วงที่สมาชิกอยู่ในบ้านระหว่างชีวิตผู้เล่น (ปีเข้าบ้านถึงปีตายหรือปีที่ผู้เล่นตาย)
      // คู่ครองเกิดก่อนเข้าบ้าน และต้องรอดมาถึงวันแต่ง — นับความเสี่ยงช่วงก่อนนั้นด้วยทำให้ค่าคาดเกินจริง ~8% (อัตราส่วนเคยค้างที่ 0.90)
      // ปีเข้าบ้านของคู่ครอง = ปีของการ์ดแรกที่เห็นในบ้าน · ลูก/หลานเกิดปีที่เข้าบ้าน ใช้ born (หลานที่แกนเพิ่มระหว่างปีโผล่ในการ์ดถัดไป)
      const end = m.alive ? st.birthYear + st.age : m.born + m.diedAge + 1;
      const entry = m.role === 'spouse' ? (joined.get(m.id) ?? end) : m.born;
      for (let y = Math.max(m.born, st.birthYear, entry) + 1; y <= end; y++) {
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
    const wedAge = st.flagAge?.married;
    if (wedAge !== undefined) {
      const wy = st.birthYear + wedAge, band = divBands.find((x) => wy >= x.from && wy <= x.to), first = st.kin.find((m) => m.role === 'spouse');
      if (band && first) {
        band.wed++;
        if (first.status === 'divorced') band.div++;
      }
      if (bot === 'สุ่ม' && first) {
        CHEAT.wed++;
        const us = !!st.flags.we_cheated, them = !!st.flags.spouse_cheated;
        if (us || them) {
          CHEAT.cheat++;
          if (us) CHEAT.us++;
          if (them) CHEAT.them++;
          if (first.status === 'divorced') CHEAT.div++;
        }
      }
    }
    if (bot === 'สุ่ม') {
      const back = st.kin.filter((m) => m.reunited !== undefined);
      if (back.length || st.kin.some((m) => m.status === 'divorced')) REUNION.div++;
      if (back.length) REUNION.back++;
      if (back.length > 1) REUNION.twice++;
      if (back.some((m) => m.reunitedGap < 1 || m.reunitedGap > 5)) REUNION.late++;
    }
    if (wedAge !== undefined) wedAges.push(wedAge);
    if (st.age >= 45) {
      const c = wedCohort.get(Math.floor(st.birthYear / 10) * 10) ?? { to45: 0, ever: 0 };
      c.to45++;
      if (wedAge !== undefined) c.ever++;
      wedCohort.set(Math.floor(st.birthYear / 10) * 10, c);
    }
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
check(`การ์ดรักใหม่ไม่ขึ้นใน ${MOURN} ปีหลังคู่ตาย (B165)`, loveEarly, ` ${loveCards} ใบ`);
check('  การ์ดรักใหม่ขึ้นได้ · แต่งรอบสองได้คู่ใหม่', loveCards && rewed ? rewedBad : 1, ` แต่ง ${rewed} ชีวิต`);
{
  const rows = [...wedCohort].sort((a, b) => a[0] - b[0]).map(([from, c]) => ({ from, ...c, pct: (100 * c.ever) / Math.max(1, c.to45) }));
  const spread = (rs) => Math.max(...rs.map((r) => r.pct)) - Math.min(...rs.map((r) => r.pct));
  const ageMean = wedAges.reduce((s, v) => s + v, 0) / Math.max(1, wedAges.length);
  const inAge = (v) => v >= WED_AGE[0] && v <= WED_AGE[1];
  console.log(`แต่งงานตามรุ่นเกิด (#9) · %เคยแต่ง (อยู่ถึง 45): ${rows.map((r) => `${r.from} ${r.pct.toFixed(1)}% (${r.to45})`).join(' · ')}`);
  const small = Math.min(...rows.map((r) => r.to45));
  if (small < WED_MIN) console.log(`%เคยแต่งต่างกันระหว่างช่วงปีเกิด ≤ ${WED_SPREAD} pp ${spread(rows).toFixed(1)} pp → ข้าม (ช่วงเล็กสุด ${small} คน < ${WED_MIN} · รัน --n 5000)`);
  else check(`%เคยแต่งต่างกันระหว่างช่วงปีเกิด ≤ ${WED_SPREAD} pp`, rows.length >= 2 && spread(rows) <= WED_SPREAD ? 0 : 1, ` ${spread(rows).toFixed(1)} pp · ${rows.length} ช่วง · ช่วงเล็กสุด ${small} คน`);
  // ตัวควบคุม: ตัดคนเคยแต่งของช่วงแรกลงครึ่ง ส่วนต่างต้องเกินกรอบ
  const cut = rows.map((r, i) => (i ? r : { ...r, pct: r.pct / 2 }));
  check('  ตัวควบคุม ช่วงแรกแต่งครึ่งเดียว ต้องหลุดกรอบ', spread(cut) > WED_SPREAD ? 0 : 1, ` ${spread(cut).toFixed(1)} pp`);
  check(`อายุแต่งครั้งแรกเฉลี่ย ${WED_AGE.join('–')}`, wedAges.length && inAge(ageMean) ? 0 : 1, ` ${fmt(ageMean)} ปี · ${wedAges.length} คน`);
  check('  ตัวควบคุม อายุ +5 ปี ต้องหลุดกรอบ', inAge(ageMean + 5) ? 1 : 0, ` ${fmt(ageMean + 5)}`);
}

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
// B167: ลูกเลียนแรงที่เราดูแลพ่อแม่ — บอทกตัญญู (การ์ดดูแลพ่อแม่เลือกบุญดูแลพ่อแม่สูงสุด) vs บอทละทิ้ง (ทาง away/home ก่อน)
// การ์ดอื่นสุ่มเหมือนกัน · seed ชุดเดียวกัน · step 0 = ตัวควบคุม (ส่วนต่างที่เหลือมาจากผลอื่นของตัวเลือก เช่น relations)
// วัด bond ลูกเฉลี่ยที่การ์ดแรกตั้งแต่อายุ FILIAL.at (หลังแกนปรับ) · ญาติช่วยประคองหลังอายุนั้นต่อชีวิต
{
  const FILIAL_SCORE = { care_parents: 1, abuse_elders: -1 };
  const careScore = (c) => (c.merit ?? []).reduce((t, m) => t + (FILIAL_SCORE[meritId(m.cat)] ?? 0) * (MERIT_LEVELS[m.level] ?? 0), 0);
  const filialBot = (kind) => (card, rng, st) => {
    const chs = st?.pending?.choices;
    if (!chs?.some((c) => c.filial)) return random(card, rng);
    const open = openChoices(card);
    const score = (i) => (kind === 'good' ? careScore(chs[i]) : (['away', 'home'].includes(chs[i].filial) ? 10 : 0) - careScore(chs[i]));
    return open.reduce((a, b) => (score(b) > score(a) ? b : a));
  };
  const lives = Math.min(n, 2000);
  const run = (kind, step) => {
    const keep = FILIAL.step;
    FILIAL.step = step;
    let sum = 0, cnt = 0, aid = 0;
    for (let i = 0; i < lives; i++) {
      let at = null;
      let helped = 0;
      const { state: st } = playLife(mixSeed(seed, i * 11 + 5), content, filialBot(kind), (card, st) => {
        if (st.age < FILIAL.at) return;
        if (at === null) at = st.filial?.n ? st.kin.filter((m) => m.role === 'child' && m.alive && !m.left).map((m) => m.bond) : [];
        if (card.kind === 'result' && card.text.includes('มาช่วยประคอง')) helped++;
      });
      if (!at?.length) continue;
      sum += at.reduce((a, b) => a + b, 0) / at.length;
      cnt++;
      aid += helped;
    }
    FILIAL.step = keep;
    return { bond: sum / Math.max(1, cnt), cnt, aid: aid / Math.max(1, cnt) };
  };
  const g = run('good', FILIAL.step), a = run('away', FILIAL.step), g0 = run('good', 0), a0 = run('away', 0);
  const dd = (g.bond - a.bond) - (g0.bond - a0.bond);
  console.log(`ดูแลพ่อแม่ (B167) · ${lives} ชีวิต/บอท · ถึง ${FILIAL.at} มีลูก+เคยดูแล: กตัญญู ${g.cnt} · ละทิ้ง ${a.cnt}`);
  console.log(`  bond ลูกตอน ${FILIAL.at}: กตัญญู ${fmt(g.bond)} · ละทิ้ง ${fmt(a.bond)} · ตัวควบคุม step 0: ${fmt(g0.bond)} / ${fmt(a0.bond)}`);
  console.log(`  ญาติช่วยประคองหลัง ${FILIAL.at} ต่อชีวิต: กตัญญู ${fmt(g.aid)} · ละทิ้ง ${fmt(a.aid)} · step 0: ${fmt(g0.aid)} / ${fmt(a0.aid)}`);
  check(`  ส่วนต่าง bond ลูก (กตัญญู − ละทิ้ง) เกินตัวควบคุม ≥ 2×step`, g.cnt && a.cnt && dd >= 2 * FILIAL.step ? 0 : 1, ` ${fmt(dd)}`);
  check('  ญาติช่วยประคองตอนแก่: กตัญญูมากกว่าละทิ้ง และห่างกว่าตัวควบคุม', g.aid > a.aid && g.aid - a.aid > g0.aid - a0.aid ? 0 : 1);
}
for (const x of divBands) {
  const r = x.div / Math.max(1, x.wed);
  check(`หย่าตามยุค (ใบ 93) · แต่ง ${x.from}–${x.to} ใกล้ ${x.target} ±${x.tolerance}`, x.wed >= 300 && Math.abs(r - x.target) <= x.tolerance ? 0 : 1, ` ${x.div}/${x.wed} = ${fmt(r)}`);
}
{
  const r = CHEAT.cheat / Math.max(1, CHEAT.wed), d = CHEAT.div / Math.max(1, CHEAT.cheat);
  check(`นอกใจ (ใบ 94) · ชีวิตคู่ที่มีนอกใจ ${CHEAT.from}–${CHEAT.to} (เรา ${CHEAT.us} · คู่ ${CHEAT.them})`, CHEAT.wed >= 200 && r >= CHEAT.from && r <= CHEAT.to ? 0 : 1, ` ${CHEAT.cheat}/${CHEAT.wed} = ${fmt(r)}`);
  check(`นอกใจ (ใบ 94) · จบหย่า ${CHEAT.divFrom}–${CHEAT.divTo}`, CHEAT.cheat >= 25 && d >= CHEAT.divFrom && d <= CHEAT.divTo ? 0 : 1, ` ${CHEAT.div}/${CHEAT.cheat} = ${fmt(d)}`);
}
{
  const r = REUNION.back / Math.max(1, REUNION.div);
  check(`คืนดีคู่เก่า (ใบ 97) · ชีวิตที่เคยหย่าแล้วคืนดี ${REUNION.from}–${REUNION.to}`, REUNION.div >= 100 && r >= REUNION.from && r <= REUNION.to ? 0 : 1, ` ${REUNION.back}/${REUNION.div} = ${fmt(r)}`);
  check('คืนดีคู่เก่า (ใบ 97) · ไม่เกิน 1 ครั้งต่อชีวิต · อยู่ใน 1–5 ปีหลังหย่า', REUNION.twice + REUNION.late, ` ซ้ำ ${REUNION.twice} · นอกช่วง ${REUNION.late}`);
}
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
