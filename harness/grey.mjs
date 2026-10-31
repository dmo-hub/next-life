// เงินเทา (ใบ 36 thelands-8): เงินจากทางมืดเข้าถุงแยก ไม่นับฐานะ/มรดก/ชื่อเสียง · ยึดเฉพาะตอนถูกจับครั้งแรก · ฟอกไม่สร้างเงิน
// เนื้อหาจริงยังไม่ติด grey (เลนเนื้อหาเติมทีหลัง) ⇒ ด่านแพตช์ในหน่วยความจำ: ตัวเลือกทางมืด (ตั้ง took_bribe/embezzler หรือบาปหมวดเอาเปรียบ/โกง
// และมีเงินได้) → เงินได้ทุกก้อนในตัวเลือกนั้นติด grey · เมื่อเนื้อหาจริงติดแล้ว ด่านใช้ของจริงแทนแพตช์
// ไม่นับ = ชีวิตที่ได้เงินเทา เทียบชีวิตเดียวกันที่ตัดเงินก้อนนั้นทิ้ง: state ตอนตายต้องเท่ากันทุกช่องยกเว้นถุงเงินเทาเอง
// (เงินเทาไม่ดึงเลขสุ่มและไม่ไปไหน ถ้ารั่วเข้า money/ฐานะ/มรดกทางใดทางหนึ่ง สองชีวิตจะแยกกัน)
// ตัวควบคุม --pour: เทเงินเทาเข้า money ทุกการ์ด → ต้องตก
import { playLife, mixSeed, standingOf, legacyUnits, famePoints, GREY, greyAdd, greySeize, greyLaunder, greyLaunderLock } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const n = arg('--n', 500), seed = arg('--seed', 1);
const POUR = process.argv.includes('--pour');
const DARK_FLAGS = ['took_bribe', 'embezzler'];
const DARK_CATS = ['greed_harm', 'cheat_exploit', 'unjust_judgment', 'oppress_subjects', 'kill_for_gain'];
const GREY_KEYS = ['grey', 'greyLaunderAge'];
// ข้อเทียบใช้บอทที่ไม่อ่านป้ายผล: ชีวิตเทียบที่ตัดเงินทิ้งได้ป้ายเสี่ยงต่าง (riskLabel คิดจากขนาดเงิน) บอทอ่านป้ายจึงเลือกต่างทั้งที่เงินเทาไม่ได้รั่ว
// บอทบาปหยิบทางมืดมากสุด จึงครอบกรณีเงินเทาได้มากพอ · ข้ออื่นใช้ครบทุกบอท
const LEAK_BOTS = ['สุ่ม', 'สายบุญ', 'สายบาป'];

const base = loadContent();
const gain = (fx) => fx?.money && typeof fx.money === 'object' && fx.money.amount > 0;
const dark = (c) => {
  const outs = c.outcomes ?? [];
  const flags = [...(c.sets_flags ?? []), ...outs.flatMap((o) => o.sets_flags ?? [])];
  const merit = [...(c.merit ?? []), ...outs.flatMap((o) => o.merit ?? [])];
  return (gain(c.effects) || outs.some((o) => gain(o.effects))) && (flags.some((f) => DARK_FLAGS.includes(f)) || merit.some((t) => DARK_CATS.includes(t.cat)));
};
const already = base.events.some((e) => (e.choices ?? []).some((c) => [c, ...(c.outcomes ?? [])].some((x) => x.effects?.money?.grey)));
// grey = ติดป้ายเงินเทา · cut = ตัดเงินก้อนนั้นทิ้ง (ชีวิตเทียบ)
function variant(mode) {
  const events = structuredClone(base.events);
  let touched = 0;
  for (const e of events) for (const c of e.choices ?? []) {
    if (!(already ? [c, ...(c.outcomes ?? [])].some((x) => x.effects?.money?.grey) : dark(c))) continue;
    touched++;
    for (const x of [c, ...(c.outcomes ?? [])]) {
      if (!gain(x.effects)) continue;
      if (mode === 'grey') x.effects.money.grey = true;
      else delete x.effects.money;
    }
  }
  return { content: { ...base, events }, touched };
}
const G = variant('grey'), C = variant('cut');
const strip = (st) => JSON.stringify(st, (k, v) => (k === 'content' || GREY_KEYS.includes(k) ? undefined : v));

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fail++;
};
console.log(`เงินเทา · ${Object.keys(BOTS).length} บอท × ${n} ชีวิต · seed ${seed} · ตัวเลือกเงินเทา ${G.touched} (${already ? 'จากเนื้อหาจริง' : 'แพตช์ในหน่วยความจำ'})${POUR ? ' · ตัวควบคุมเทเข้า money' : ''}`);
let leak = 0, compared = 0, withGrey = 0, neg = 0, seizeBad = 0, seized = 0;
for (const [name, bot] of Object.entries(BOTS)) {
  for (let i = 0; i < n; i++) {
    const s = mixSeed(seed, i);
    let prevGrey = 0, prevCaught = false;
    const a = playLife(s, G.content, bot, (card, st) => {
      const g = st.grey ?? 0;
      if (g < 0) neg++;
      // ลดได้ทางเดียวในชีวิตที่ไม่มีการ์ดยึด/ฟอก: ถูกจับครั้งแรก และลดเหลือ (1 − seize) ของถุงก่อนหน้าพอดี (เงินก้อนที่ได้พร้อมถูกจับถูกยึดด้วย)
      if (g < prevGrey - 1e-6) {
        seized++;
        if (!(st.flags.caught_fraud && !prevCaught)) seizeBad++;
      }
      prevCaught = !!st.flags.caught_fraud;
      if (POUR && g > 0) {
        st.money += g;
        st.grey = 0;
      }
      prevGrey = st.grey ?? 0;
    });
    if (!LEAK_BOTS.includes(name)) continue;
    compared++;
    const b = playLife(s, C.content, bot);
    if ((a.state.grey ?? 0) > 0 || a.state.flags.took_bribe || a.state.flags.embezzler) withGrey++;
    const same = strip(a.state) === strip(b.state) && standingOf(a.state) === standingOf(b.state) && legacyUnits(a.state) === legacyUnits(b.state) && famePoints(a.state, standingOf(a.state)) === famePoints(b.state, standingOf(b.state));
    if (!same) leak++;
  }
}
check(`เงินเทาไม่รั่วเข้าเงิน/ฐานะ/มรดก/ชื่อเสียง (ชีวิตที่ได้เงินเทา = ชีวิตที่ตัดเงินก้อนนั้นทิ้ง ยกเว้นถุง · บอท ${LEAK_BOTS.join(' ')})`, leak, ` · ${compared} ชีวิต · มีเงินเทา/ธงทางมืด ${withGrey}`);
check('ถุงเงินเทาไม่ติดลบ', neg);
check('ถุงลดเฉพาะการ์ดที่ถูกจับครั้งแรก', seizeBad, ` · ลด ${seized} ครั้ง`);
if (!withGrey) check('ชีวิตมีเงินเทาจริง (ด่านไม่ได้ผ่านเพราะไม่มีใครหยิบ)', 1);

// ยึด/ฟอก/ล็อก ตรงที่สถานะ (เนื้อหายังไม่มีการ์ดยึด/ฟอก)
const st = { grey: 0, money: 0, age: 30, greyLaunderAge: null };
const unit = [];
greyAdd(st, 1000);
greyAdd(st, -50);
if (st.grey !== 1000) unit.push(`เงินลบไม่เข้าถุง: ${st.grey}`);
if (greyLaunderLock(st) !== null) unit.push('มีเงินเทา ยังไม่ฟอกปีนี้ ต้องไม่ล็อก');
greyLaunder(st, 0.5);
if (Math.abs(st.money - 500 * (1 - GREY.fee)) > 1e-9 || st.grey !== 500) unit.push(`ฟอกครึ่ง: money ${st.money} grey ${st.grey}`);
if (!greyLaunderLock(st)) unit.push('ฟอกแล้วปีนี้ต้องล็อก');
st.age++;
if (greyLaunderLock(st) !== null) unit.push('ปีใหม่ต้องปลดล็อก');
greySeize(st, GREY.seize);
if (st.grey !== 250) unit.push(`ยึดครึ่ง: ${st.grey}`);
const empty = { money: 0, age: 30 };
greySeize(empty, 0.5);
if ('grey' in empty) unit.push('ยึดชีวิตที่ไม่มีถุงต้องไม่สร้างช่อง (state เดิมทุกไบต์)');
if (greyLaunderLock(empty) === null) unit.push('ไม่มีเงินเทาต้องล็อกฟอก');
check('ยึด · ฟอกเสียค่าฟอกไม่สร้างเงิน · ล็อกปีละครั้ง · ไม่สร้างช่องในชีวิตที่ไม่มีถุง', unit.length, unit.length ? ` · ${unit.join(' · ')}` : '');
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
