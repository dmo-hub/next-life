// harness สกิลข้ามชาติ (06s dsd-1 + isd-2): บอทหนึ่งตัว = ผู้เล่นหนึ่งคนมีคลังของตัวเอง เล่นหลายรุ่นต่อกันผ่านปรโลก
// รายงาน % รุ่นที่ทางนั้นเกิดจริง: ลงคลังจากต่างโลก · ลงคลังจากไทย · อัปขั้นในชาติ · พกไปชาติหน้า · ผลเบาไทยมีที่ให้ทำงาน
// ✗ เมื่อทางใด < MIN หรือทางรางวัล (ลงคลัง/อัปขั้น) > MAX · ตัวควบคุม (เปิดเสมอ): ปิดทีละทางแล้วทางนั้นต้องตก ไม่งั้นตัวนับไม่ได้วัดของจริง
// เนื้อจริงยังไม่มีแหล่งลงคลังไทยและจุดอัปเกรด ⇒ ใช้ content-fixtures/harness/skills/ ใส่ในหน่วยความจำ ไม่เข้าเกม
// ผลเบาไทยนับ "โอกาส" (การ์ดหมวดที่ตรงกับสกิลที่พก) ไม่ขึ้นกับ k — ทางต้องเปิดอยู่แม้ k = 0 · --k ทับค่าในเกมเพื่อวัดเท่านั้น
// บรรทัด [วัด] ไม่ตัดสินผ่าน/ตก — ไว้เทียบค่า k และโหมดโตเร็ว (--catch a = ทีละ 2 ถึงขั้นคลัง · none = ไม่มีโตเร็ว · c18 = ได้ขั้นคลังเมื่ออายุ 18)
// k มีผลเฉพาะชีวิตที่พกสกิล ⇒ ด่านชีวิตเดี่ยว (lifehash/stats) วัดผล k ไม่ได้ · --ctl 0 ข้ามตัวควบคุมตอนวัดหลายค่า
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { playLife, playAfterlife, nextLife, newLife, mixSeed, makeRng, skillBookAdd, bookCarryOffers, thaiSkillMul, successP, THAI_SKILL, SKILL, ISEKAI_SKILLS, ISEKAI_EVENTS } from '../src/engine/index.mjs';
import { loadContent, loadSkillMap } from '../src/node/load.mjs';
import { random } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 200);
const seed = opt('seed', 1);
const GENS = opt('gens', 4);
THAI_SKILL.k = opt('k', THAI_SKILL.k);
const CTL = opt('ctl', 1);
const CATCH = args.includes('--catch') ? args[args.indexOf('--catch') + 1] : 'a';
if (!['a', 'none', 'c18'].includes(CATCH)) throw new Error(`--catch รับ a · none · c18 (ได้ ${CATCH})`);

export const SKILLS_GATE = { min: 0.02, max: 0.9 };
const FIX = 'content-fixtures/harness/skills/';
const UP = parse(readFileSync(`${FIX}upgrade.yaml`, 'utf8'));
const MAP = loadSkillMap(`${FIX}skill-map.yaml`);
const PATHS = { isekaiEarn: 'ลงคลังจากต่างโลก', thaiEarn: 'ลงคลังจากไทย', upgrade: 'อัปขั้นในชาติ', carry: 'พกไปชาติหน้า', light: 'ผลเบาไทยมีที่ทำงาน' };
const REWARD = ['isekaiEarn', 'thaiEarn', 'upgrade'];
const BOT_SALT = 0x5c111;
const THAI_CATS = Object.fromEntries(Object.entries(ISEKAI_SKILLS).map(([id, s]) => [id, s.thai]));

// off = ชื่อทางที่ปิด (ตัวควบคุม) · ปิดที่กลไกหรือแหล่ง ไม่ใช่ที่ตัวนับ
function setup(off) {
  const content = loadContent();
  content.skillMap = off === 'thaiEarn' ? {} : MAP;
  if (off !== 'upgrade') {
    for (const e of content.events) if (UP.thai.includes(e.category)) for (const c of e.choices ?? []) for (const o of c.outcomes ?? []) if (o.ok) o.upgrade = true;
  }
  for (const e of ISEKAI_EVENTS) if (UP.isekai.includes(e.id)) for (const c of e.choices) if (off === 'upgrade') delete c.upgrade; else c.upgrade = true;
  for (const [id, s] of Object.entries(ISEKAI_SKILLS)) if (off === 'light') delete s.thai; else if (THAI_CATS[id]) s.thai = THAI_CATS[id];
  return content;
}

function run(off, lives) {
  const content = setup(off);
  const EV = Object.fromEntries(content.events.map((e) => [e.id, e]));
  const s = { gens: 0, later: 0, isekaiEarn: 0, thaiEarn: 0, upgrade: 0, carry: 0, light: 0, bookUp: 0, firstCarry: 0, overCarry: 0, bookDown: 0, inBook: {}, carried: {} };
  const m = { age: [0, 0], ageCarry: [0, 0], cards: [0, 0], cardsCarry: [0, 0], ok: {}, cap: { n: 0, reached: 0, lv: 0 } };
  const c18 = new WeakSet();
  for (let i = 0; i < lives; i++) {
    const rng = makeRng(mixSeed(seed ^ BOT_SALT, i));
    let book = {};
    let capOf = {};
    let st = newLife(mixSeed(seed, i), content);
    for (let g = 0; g < GENS; g++) {
      const got = { isekaiEarn: false, thaiEarn: false, upgrade: false, light: false };
      // ตัวควบคุมลงคลังจากต่างโลก = ผู้เล่นไม่รับของขวัญจากการ์ดจบต่างโลก
      const earn = (card, key) => {
        if (off === 'isekaiEarn' && key === 'isekaiEarn') return;
        const e = card.earn[rng.int(0, card.earn.length - 1)];
        const r = skillBookAdd(book, e.id, e.lv);
        if ((r.book[e.id] ?? 0) < (book[e.id] ?? 0)) s.bookDown++;
        if (r.up) { s.inBook[e.id] = (s.inBook[e.id] ?? 0) + 1; if (book[e.id]) s.bookUp++; }
        book = r.book;
        got[key] = true;
      };
      const see = (card, x) => {
        if (card.earn?.length) earn(card, card.kind === 'verdict' ? 'thaiEarn' : 'isekaiEarn');
        const ev = !card.trip && x?.pending?.id && EV[x.pending.id];
        if (ev && thaiSkillMul(x.skills, ev.category, 1) > 1 && ev.choices?.some((c) => c.outcomes?.some((o) => o.ok))) got.light = true;
        // โหมด c18 จำลองในตัววัด: ชีวิตไทยถึง 18 แล้วสกิลที่พกขึ้นเป็นขั้นคลังทีเดียว (ทริปต่างโลกหลังจากนั้นได้ขั้นนี้ติดไป)
        if (CATCH === 'c18' && x?.content && x.skills?.length && x.age >= 18 && !c18.has(x)) {
          c18.add(x);
          x.skills = x.skills.map((k) => ({ ...k, lv: Math.max(k.lv, capOf[k.id] ?? 1) }));
        }
      };
      // การ์ดอัปเกรด: ปุ่มผ่านอยู่ท้ายสุด ⇒ กดเลขที่น้อยกว่าจำนวนปุ่มลบหนึ่ง = ได้ฝึกจริง
      const pick = (card, r, h) => {
        const p = random(card, r, h);
        if ((card.kind === 'upgrade' || card.step === 'upgrade') && p < card.choices.length - 1) got.upgrade = true;
        // อัตราทาง ok = ค่าคาดหมายจากน้ำหนักจริงตอนกด (ก่อน choose) · เฉพาะตัวเลือกที่มีทั้งทาง ok และไม่ ok
        const ev = h?.content && !card.trip && h.pending;
        const c = ev?.choices?.[typeof p === 'object' ? p.i : p];
        if (c?.outcomes?.some((o) => o.ok) && !c.outcomes.every((o) => o.ok)) {
          const cat = ev.category ?? '-';
          const row = (m.ok[cat] ??= { hit: [0, 0], miss: [0, 0] })[thaiSkillMul(h.skills, ev.category, 1) > 1 ? 'hit' : 'miss'];
          row[0] += successP(h, c, ev);
          row[1]++;
        }
        return p;
      };
      pick.isekai = true;
      if (g === 0 && st.skills?.length) s.firstCarry++;
      if (g > 0) {
        s.later++;
        if (st.skills?.length) s.carry++;
      }
      const life = playLife(st.seed, content, pick, see, st);
      const { state } = life;
      const held = g > 0 && state.skills?.length;
      for (const [k, v] of [['age', life.age], ['cards', life.cards]]) {
        m[k][0] += v; m[k][1]++;
        if (held) { m[`${k}Carry`][0] += v; m[`${k}Carry`][1]++; }
      }
      for (const k of state.skills ?? []) if ((capOf[k.id] ?? 1) > 1) { m.cap.n++; m.cap.lv += k.lv; if (k.lv >= capOf[k.id]) m.cap.reached++; }
      // ปรโลก (รวมชาติต่างโลกที่เข้าจากปรโลก) นับเป็นรุ่นเดียวกับชีวิตไทยที่เพิ่งจบ · รุ่นสุดท้ายไม่เดินปรโลก
      const af = g < GENS - 1 ? playAfterlife(state, pick, see) : null;
      s.gens++;
      for (const k of Object.keys(got)) if (got[k]) s[k]++;
      if (!af) break;
      const offers = bookCarryOffers(book).map((o) => o.id);
      const ids = [];
      if (off !== 'carry') while (offers.length && ids.length < SKILL.carry) ids.push(offers.splice(rng.int(0, offers.length - 1), 1)[0]);
      if (ids.length > SKILL.carry) s.overCarry++;
      for (const id of ids) s.carried[id] = (s.carried[id] ?? 0) + 1;
      capOf = Object.fromEntries(ids.map((id) => [id, book[id]]));
      st = nextLife(af, ids, CATCH === 'none' ? {} : book);
    }
  }
  if (!off) s.m = m;
  return s;
}

const share = (s, k) => (k === 'carry' ? s.carry / Math.max(1, s.later) : s[k] / Math.max(1, s.gens));
const pct = (x) => `${(100 * x).toFixed(1)}%`;
const fails = (s) => Object.keys(PATHS).filter((k) => share(s, k) < SKILLS_GATE.min || (REWARD.includes(k) && share(s, k) > SKILLS_GATE.max));

const t0 = Date.now();
const s = run(null, n);
let fail = 0;
const check = (name, ok, detail) => {
  if (!ok) fail++;
  console.log(`${ok ? 'ผ่าน' : 'ตก  '} ${name} · ${detail}`);
};
console.log(`[skills] n ${n} สาย × ${GENS} รุ่น · seed ${seed} · k ${THAI_SKILL.k} · เกณฑ์ทาง ≥${pct(SKILLS_GATE.min)} · ทางรางวัล ≤${pct(SKILLS_GATE.max)} · fixture ${FIX}`);
for (const [k, name] of Object.entries(PATHS)) {
  const x = share(s, k);
  check(name, x >= SKILLS_GATE.min && (!REWARD.includes(k) || x <= SKILLS_GATE.max), `${pct(x)} (${s[k]}/${k === 'carry' ? s.later : s.gens} รุ่น)`);
}
check('ชีวิตแรกไม่มีสกิลพก', s.firstCarry === 0, `${s.firstCarry} สาย`);
check(`พกไม่เกิน ${SKILL.carry}`, s.overCarry === 0, `${s.overCarry} ครั้ง`);
check('ขั้นในคลังไม่ลด', s.bookDown === 0, `${s.bookDown} ครั้ง · ขั้นคลังขึ้นจากลงซ้ำ/อัป ${s.bookUp} ครั้ง`);
const ids = Object.keys(ISEKAI_SKILLS);
console.log(`ต่อสกิล (ครั้งที่ลงคลัง/ขั้นขึ้น · ครั้งที่ถูกพก): ${ids.map((id) => `${id} ${s.inBook[id] ?? 0}/${s.carried[id] ?? 0}`).join(' · ')}`);
const never = ids.filter((id) => !s.inBook[id]);
console.log(`สกิลที่ไม่เคยลงคลัง: ${never.length ? never.join(' ') : '-'}`);
const avg = ([sum, cnt]) => (cnt ? sum / cnt : 0).toFixed(2);
console.log(`[วัด] ชีวิตไทย อายุตายเฉลี่ย ${avg(s.m.age)} (รุ่นที่พกสกิล ${avg(s.m.ageCarry)} · ${s.m.ageCarry[1]} รุ่น) · การ์ด/ชีวิต ${avg(s.m.cards)} (รุ่นที่พก ${avg(s.m.cardsCarry)})`);
const okp = ([sum, cnt]) => (cnt ? `${((100 * sum) / cnt).toFixed(2)}% n${cnt}` : '-');
console.log(`[วัด] ทาง ok ต่อหมวด (ตรงสกิลที่พก | ไม่ตรง): ${Object.entries(s.m.ok).sort().map(([cat, r]) => `${cat} ${okp(r.hit)} | ${okp(r.miss)}`).join(' · ')}`);
const cp = s.m.cap;
console.log(`[วัด] โตเร็ว --catch ${CATCH}: สกิลพกที่คลัง >1 ${cp.n} ตัว-รุ่น · ถึงขั้นคลังตอนตาย ${cp.n ? pct(cp.reached / cp.n) : '-'} · ขั้นเฉลี่ยตอนตาย ${cp.n ? (cp.lv / cp.n).toFixed(2) : '-'}`);

// ตัวควบคุม: ปิดทีละทาง ต้องตกที่ทางนั้น
const ctlN = Math.max(30, Math.round(n / 4));
for (const k of CTL ? Object.keys(PATHS) : []) {
  const c = run(k, ctlN);
  check(`ตัวควบคุม ปิด${PATHS[k]} → ทางนั้นตก`, fails(c).includes(k), `${pct(share(c, k))} (n ${ctlN})`);
}
setup(null);
console.log(`${((Date.now() - t0) / 1000).toFixed(0)} วินาที · ${fail ? `ตก ${fail} ข้อ` : 'ผ่านทั้งหมด'}`);
process.exit(fail ? 1 : 0);
