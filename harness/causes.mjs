// harness สาเหตุการตาย (B110): บอทสุ่มเล่นเนื้อหาจริง
// ด่าน: ทุกการตายมีสาเหตุในรายการ · สัดส่วนสาเหตุต่อช่วงวัยใกล้ค่าที่ข้อมูลคาดจากอายุ/ปีของผู้ตายเอง
// (ตัวควบคุม: เทียบกับสัดส่วนของอายุ +30 ต้องหลุด) · โรคเรื้อรังทุกรายมีการ์ดตรวจเจอก่อนตาย และตายตามที่นัดด้วยโรคนั้น
// · คนไม่มีปัจจัยเสี่ยงที่อยู่ถึง 30 อายุยืนกว่าคนสูบบุหรี่ และคนสูบตายด้วยกลุ่มที่บุหรี่เกี่ยวมากกว่า
// อายุเฉลี่ยทั้งประชากรเทียบตารางชีพอยู่ในด่าน 3b (npm run gate) ไม่ซ้ำที่นี่
// ชิ้น 2: พ่อแม่/ญาติที่จากไปมีสาเหตุทุกคน สัดส่วนใกล้ค่าคาดจากอายุ/ปีของเขาเอง · ญาติที่ตายตามนัดโรคเรื้อรังมีการ์ดแจ้งก่อน
// · พ่อ/แม่ตายด้วยโรคถ่ายทอดได้ ⇒ ชีวิตนั้นจดประวัติครอบครัว และตายด้วยโรคนั้นบ่อยกว่าคนไม่มีประวัติ
// ชิ้น 3: ทำร้ายตัวเองพาสายด่วน 1323 · สัตว์คู่ใจมีสาเหตุ · การ์ดสั่งตายพร้อมสาเหตุได้สาเหตุนั้นโดยไม่ดึงเลขสุ่ม
// B168: ตายสงบ (วัยชรา/โรคเรื้อรังที่นัดไว้ อายุ ≥60) ได้การ์ดย้อนความทรงจำ 1 ใบพอดีก่อนคำสั่งเสีย · ทางอื่น 0 · ไม่มีช่อง {} ดิบ
// · ตัวควบคุม นัดตายอุบัติเหตุอายุ 70 = 0 ใบ (นัดโรคเรื้อรังอายุ 70 ต้องได้)
import { playLife, newLife, applyFamily, mixSeed, protoYear, causeShares, CHRONIC, DEATH_RISK, HEREDITARY, MAX_AGE, PET_CAUSES, memoryStories, isGone, stageOf, MEMORY } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 20000);
const seed = opt('seed', 1);
const content = loadContent();
const era = content.era;
const keys = era.causes.keys;
// ช่วงวัยที่ตัดสิน · กลุ่มที่ค่าคาดต่ำกว่า MIN_SHARE ไม่ตัดสิน (นับน้อยจนสุ่มแกว่งเกินกรอบ)
const BANDS = [[0, 4], [5, 29], [30, 59], [60, MAX_AGE]];
const MIN_SHARE = 0.02;
// กรอบ: ห่างค่าคาดไม่เกิน 4 SE หรือ 1.5 จุด แล้วแต่ตัวไหนกว้างกว่า
const TOL_PTS = 0.015;
const SMOKE_KEYS = Object.keys(DEATH_RISK.smoker);

const obs = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const OBS = obs;
const exp = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const ctl = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const deaths = BANDS.map(() => 0);
const DEATHS = deaths;
// ญาติ: แยกจากตัวเอง
const kObs = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const kExp = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const kCtl = BANDS.map(() => Object.fromEntries(keys.map((k) => [k, 0])));
const kDeaths = BANDS.map(() => 0);
let kinNoCause = 0, kinIllDeaths = 0, kinIllUntold = 0, kinIllCards = 0, kinChronicOther = 0, heirMissing = 0;
// คู่ (ชีวิต × โรคถ่ายทอดได้) ที่อยู่ถึง 30: [ตายด้วยโรคนั้นจริง, ค่าคาดจากอายุ/ปีที่ตาย] แยกตามมีประวัติครอบครัวโรคนั้นหรือไม่
// เทียบสัดส่วน จริง÷คาด — คนมีประวัติครอบครัวมักอายุยืนกว่า (พ่อแม่ต้องตายก่อน) เทียบดิบจะได้ผลของอายุปน
const hered = { yes: [0, 0], no: [0, 0] };
// ชิ้น 3: การ์ดที่บอกว่าทำร้ายตัวเองต้องพาสายด่วน · สายด่วนไม่หลุดไปการ์ดอื่น · สัตว์คู่ใจที่จากไปมีสาเหตุของสัตว์
let careCards = 0, careNoHelp = 0, careStray = 0, petLoss = 0, petNoCause = 0;
let noCause = 0, cardMismatch = 0, chronicDeaths = 0, chronicUntold = 0, illCards = 0, illWrong = 0;
const life30 = { none: [0, 0], smoker: [0, 0] };
// B168: เข้าเกณฑ์ (มีเรื่องพอ) · ได้ · ไม่เข้าแต่ได้ · ได้เกินใบ · ใบถัดไปไม่ใช่คำสั่งเสีย · ช่อง {} ดิบ · เข้าเกณฑ์แต่ไม่ได้ ที่สุขภาพยังเหลือ (ตายกลางปีจากผลการ์ดสุขภาพเป็น 0 = ไม่เข้าตามสเปก)
const mem = { fit: 0, got: 0, stray: 0, multi: 0, order: 0, raw: 0, miss: 0, missMid: 0 };
const smokeShare = { none: [0, 0], smoker: [0, 0] };
const fmt = (v, d = 2) => v.toFixed(d);

for (let i = 0; i < n; i++) {
  let told = null;
  let healthDeath = false;
  let parentsAt = null;
  let memN = 0, memPrev = false;
  const r = playLife(mixSeed(seed, i), content, random, (card, st) => {
    if (memPrev && card.id !== 'funeral_wishes_01') mem.order++;
    memPrev = card.kind === 'memory';
    if (memPrev) {
      memN++;
      if (/[{}]/.test(JSON.stringify([card.text, card.items, card.choices]))) mem.raw++;
    }
    // อายุพ่อแม่ตอนเราเกิด → ปีที่เขาตาย · คนที่ตายก่อนเราเกิด/ชะตารู้แล้ว (ผู้เล่นรุ่นก่อน) ไม่นับ
    parentsAt ??= st.parents.map((p) => (p.alive ? p.age : null));
    if (card.kinIllness) kinIllCards++;
    if (card.illness) {
      illCards++;
      told = { cause: card.illness.cause, at: st.age + card.illness.left };
    }
    if (card.kind === 'death') {
      if (card.cause !== st.cause) cardMismatch++;
      healthDeath = st.health <= 0;
    }
    const said = card.kind === 'death' ? card.cause : card.loss?.cause;
    if (said === 'self_harm') {
      careCards++;
      if (card.help?.phone !== '1323') careNoHelp++;
    } else if (card.help) careStray++;
    if (card.loss?.role === 'pet') {
      petLoss++;
      if (!Object.hasOwn(PET_CAUSES, card.loss.cause)) petNoCause++;
    }
  });
  const st = r.state;
  const age = r.age;
  // เกณฑ์ตามสเปกเขียนแยกจาก memoryEligible — ใช้ตัวเดียวกัน ด่านจะผ่านเองเสมอ
  const calm = st.age >= MEMORY.from && !isGone(st) && (st.cause === 'other' || (CHRONIC.includes(st.cause) && st.terminal?.cause === st.cause));
  const fit = calm && memoryStories(st, stageOf).length >= MEMORY.min;
  if (fit) mem.fit++;
  if (memN) mem.got++;
  if (memN && !fit) mem.stray++;
  if (memN > 1) mem.multi++;
  if (fit && !memN) st.health > 0 ? mem.miss++ : mem.missMid++;
  const kinDead = [
    ...st.parents.map((p, j) => (!p.alive && parentsAt?.[j] !== null && !p.gone && p.diesAt === undefined ? { m: p, year: st.birthYear + p.diedAge - parentsAt[j], age: p.diedAge, tells: true } : null)).filter(Boolean),
    ...(st.kin ?? []).filter((m) => !m.alive && !['pet', 'herd'].includes(m.role)).map((m) => ({ m, year: m.born + m.diedAge + 1, age: m.diedAge, tells: ['spouse', 'child', 'grandchild'].includes(m.role) && !m.left })),
  ];
  for (const { m, year, age: a, tells } of kinDead) {
    if (!keys.includes(m.cause)) {
      kinNoCause++;
      continue;
    }
    const b = BANDS.findIndex(([lo, hi]) => a >= lo && a <= hi);
    const py = protoYear(era, st.seed, year);
    const s = causeShares(era, m.sex, py, a);
    const s2 = causeShares(era, m.sex, py, Math.min(MAX_AGE - 1, a + 30));
    kDeaths[b]++;
    kObs[b][m.cause]++;
    keys.forEach((k, j) => {
      kExp[b][k] += s[j];
      kCtl[b][k] += s2[j];
    });
    if (m.ill && m.ill.cause === m.cause && m.ill.age === a) {
      if (tells) {
        kinIllDeaths++;
        if (m.ill.toldAt === undefined) kinIllUntold++;
      }
    } else if (CHRONIC.includes(m.cause) && a >= 3) kinChronicOther++;
  }
  for (const p of st.parents) if (!p.alive && HEREDITARY.includes(p.cause) && !st.heredity.includes(p.cause)) heirMissing++;
  if (age >= 30) {
    const sh = causeShares(era, st.sex, protoYear(era, st.seed, st.birthYear + age), age);
    for (const k of HEREDITARY) {
      const g = st.heredity.includes(k) ? hered.yes : hered.no;
      g[0] += st.cause === k ? 1 : 0;
      g[1] += sh[keys.indexOf(k)];
    }
  }
  if (!keys.includes(st.cause)) {
    noCause++;
    continue;
  }
  if (CHRONIC.includes(st.cause) && age >= 3 && !healthDeath) {
    chronicDeaths++;
    if (!told) chronicUntold++;
  }
  // นัดแล้วตายก่อนนัดด้วยเหตุอื่นได้ (อุบัติเหตุ) · ถึงนัดแล้วต้องเป็นโรคที่บอกไว้
  if (told && age >= told.at && (age !== told.at || st.cause !== told.cause) && !healthDeath) illWrong++;
  const b = BANDS.findIndex(([lo, hi]) => age >= lo && age <= hi);
  const py = protoYear(era, st.seed, st.birthYear + age);
  const s = causeShares(era, st.sex, py, age);
  const s2 = causeShares(era, st.sex, py, Math.min(MAX_AGE - 1, age + 30));
  deaths[b]++;
  obs[b][st.cause]++;
  keys.forEach((k, j) => {
    exp[b][k] += s[j];
    ctl[b][k] += s2[j];
  });
  if (age >= 30) {
    const risky = Object.keys(DEATH_RISK).some((f) => st.flags[f]);
    const g = st.flags.smoker ? 'smoker' : risky ? null : 'none';
    if (g) {
      life30[g][0] += age;
      life30[g][1]++;
      smokeShare[g][0] += SMOKE_KEYS.includes(st.cause) ? 1 : 0;
      smokeShare[g][1]++;
    }
  }
}

let fail = 0;
const check = (label, bad, extra = '') => {
  console.log(`${bad ? '✗' : '✓'} ${label}${extra}`);
  if (bad) fail++;
};

// คืนจำนวนกลุ่มที่หลุดกรอบ (เทียบกับค่าคาด e) พร้อมบรรทัดแสดงผล
function judge(e, show, obs = OBS, deaths = DEATHS) {
  let out = 0;
  BANDS.forEach(([lo, hi], b) => {
    const d = deaths[b];
    if (!d) return;
    const row = [];
    for (const k of keys) {
      const p = e[b][k] / d;
      if (p < MIN_SHARE) continue;
      const o = obs[b][k] / d;
      const tol = Math.max(TOL_PTS, 4 * Math.sqrt((p * (1 - p)) / d));
      const bad = Math.abs(o - p) > tol;
      if (bad) out++;
      row.push(`${bad ? '!' : ''}${k} ${fmt(o * 100, 1)}/${fmt(p * 100, 1)}`);
    }
    if (show) console.log(`  อายุ ${lo}–${hi === MAX_AGE ? '+' : hi} (${d} ราย) จริง/คาด %: ${row.join(' · ')}`);
  });
  return out;
}

console.log(`สาเหตุการตาย ${n} ชีวิต · seed ${seed}`);
check('ทุกการตายมีสาเหตุในรายการ', noCause, ` (ไม่มี ${noCause})`);
check('การ์ดตายบอกสาเหตุเดียวกับสถานะ', cardMismatch);
const off = judge(exp, true);
check('สัดส่วนสาเหตุต่อช่วงวัยใกล้ค่าคาด', off, ` (หลุด ${off} กลุ่ม)`);
const offCtl = judge(ctl, false);
check('  ตัวควบคุม สัดส่วนของอายุ +30 ต้องหลุด', offCtl ? 0 : 1, ` (หลุด ${offCtl} กลุ่ม)`);
check('โรคเรื้อรังทุกรายมีการ์ดตรวจเจอก่อนตาย', chronicDeaths ? chronicUntold : 1, ` ${chronicDeaths - chronicUntold}/${chronicDeaths}`);
check('ถึงนัดแล้วตายด้วยโรคที่ตรวจเจอ', illWrong, ` (การ์ดตรวจเจอ ${illCards} ใบ)`);
const mean = ([s, c]) => (c ? s / c : NaN);
const dLife = mean(life30.none) - mean(life30.smoker);
check('อยู่ถึง 30: ไม่มีปัจจัยเสี่ยงอายุยืนกว่าคนสูบบุหรี่', dLife > 1 ? 0 : 1, ` ${fmt(mean(life30.none), 1)} vs ${fmt(mean(life30.smoker), 1)} ปี (${life30.none[1]}/${life30.smoker[1]} ชีวิต)`);
check('คนสูบตายด้วยหัวใจ/ปอด/มะเร็งมากกว่า', mean(smokeShare.smoker) > mean(smokeShare.none) ? 0 : 1, ` ${fmt(mean(smokeShare.smoker) * 100, 1)}% vs ${fmt(mean(smokeShare.none) * 100, 1)}%`);
console.log('ญาติ/พ่อแม่');
check('ญาติที่จากไปมีสาเหตุในรายการทุกคน', kinNoCause, ` (ไม่มี ${kinNoCause})`);
const kOff = judge(kExp, true, kObs, kDeaths);
check('สัดส่วนสาเหตุของญาติต่อช่วงวัยใกล้ค่าคาด', kOff, ` (หลุด ${kOff} กลุ่ม)`);
const kOffCtl = judge(kCtl, false, kObs, kDeaths);
check('  ตัวควบคุม สัดส่วนของอายุ +30 ต้องหลุด', kOffCtl ? 0 : 1, ` (หลุด ${kOffCtl} กลุ่ม)`);
check('คนในบ้านที่ตายตามนัดโรคเรื้อรังมีการ์ดแจ้งก่อนทุกคน', kinIllDeaths ? kinIllUntold : 1, ` ${kinIllDeaths - kinIllUntold}/${kinIllDeaths} · การ์ดแจ้ง ${kinIllCards} ใบ · เรื้อรังไม่ผ่านนัด (การ์ดสั่งตาย/ทารก) ${kinChronicOther}`);
check('พ่อ/แม่ตายด้วยโรคถ่ายทอดได้ ⇒ มีในประวัติครอบครัว', heirMissing, ` (ขาด ${heirMissing})`);
check('มีประวัติครอบครัว ⇒ ตายด้วยโรคนั้นเกินค่าคาดมากกว่า', mean(hered.yes) > mean(hered.no) ? 0 : 1, ` จริง÷คาด ${fmt(mean(hered.yes))} vs ${fmt(mean(hered.no))} (ตาย ${hered.yes[0]}/${hered.no[0]} ราย)`);
console.log('ชิ้น 3');
check('ตาย/จากไปด้วยการทำร้ายตัวเอง ⇒ การ์ดมีสายด่วน 1323', careCards ? careNoHelp : 1, ` ${careCards - careNoHelp}/${careCards} ใบ`);
check('สายด่วนไม่ขึ้นบนการ์ดสาเหตุอื่น', careStray, ` (หลุด ${careStray})`);
check('สัตว์คู่ใจที่จากไปมีสาเหตุ แก่/ป่วย/อุบัติเหตุ', petLoss ? petNoCause : 1, ` ${petLoss - petNoCause}/${petLoss} ตัว`);
// การ์ดเนื้อหาสั่งตายพร้อมสาเหตุ (เมาแล้วขับ = road): สาเหตุตรงตามการ์ด และไม่ดึงเลขจาก kinCauseRng · ตัวควบคุม: ไม่ใส่ cause ต้องดึง
{
  const st = newLife(mixSeed(seed, 7), content);
  applyFamily(st, { family: [{ add: 'spouse' }, { add: 'pet', kind: 'หมา', life: [10, 15] }] });
  const draw = (fn) => {
    const before = st.kinCauseRng.state;
    fn();
    return before !== st.kinCauseRng.state;
  };
  const spouse = st.kin.find((m) => m.role === 'spouse');
  const pet = st.kin.find((m) => m.role === 'pet');
  const parent = st.parents.find((p) => p.alive);
  const d1 = draw(() => applyFamily(st, { family: [{ die: 'spouse', cause: 'road' }, { die: 'pet', cause: 'accident' }, { die: 'parent', cause: 'road' }] }));
  check('การ์ดสั่งตายพร้อมสาเหตุ ⇒ สาเหตุตามการ์ด ไม่ดึงเลขสุ่ม', spouse.cause === 'road' && pet.cause === 'accident' && parent.cause === 'road' && !d1 ? 0 : 1, ` คู่ ${spouse.cause} · สัตว์ ${pet.cause} · พ่อแม่ ${parent.cause} · ดึงเลข ${d1}`);
  const other = st.parents.find((p) => p.alive);
  const d2 = other ? draw(() => applyFamily(st, { family: [{ die: 'parent' }] })) : false;
  check('  ตัวควบคุม ไม่ใส่สาเหตุ ⇒ สุ่มจาก kinCauseRng', other && d2 && keys.includes(other.cause) ? 0 : 1, ` (${other?.cause} · ดึงเลข ${d2})`);
}
check('ตายสงบอายุ ≥60 ได้การ์ดย้อนความทรงจำ', mem.got ? mem.miss : 1, ` ${mem.got}/${mem.fit} ชีวิต · ขาดเพราะตายกลางปีสุขภาพหมด ${mem.missMid}`);
check('ทางอื่นไม่มีการ์ดย้อน · ไม่เกิน 1 ใบ · ใบถัดไปเป็นคำสั่งเสีย', mem.stray + mem.multi + mem.order, ` (หลุด ${mem.stray} · เกิน ${mem.multi} · ลำดับ ${mem.order})`);
check('การ์ดย้อนไม่มีช่อง {} ดิบ', mem.raw, ` (${mem.raw})`);
// นัดตายตอนขึ้นปีอายุ 70 ผ่าน st.terminal (ทางเดียวกับโรคที่หมอบอก) · อุบัติเหตุต้องไม่ได้ · โรคเรื้อรังต้องได้ — ผลไม่ได้แปลว่าเงื่อนไขอ่านสาเหตุจริง
{
  const forced = (cause) => {
    let lives = 0, cards = 0;
    for (let i = 0; i < 40 && lives < 10; i++) {
      let set = false, c = 0;
      const st = playLife(mixSeed(seed + 99, i), content, random, (card, s) => {
        if (card.kind === 'memory') c++;
        if (!set && s.age === 69 && !s.dead && !s.trip && !s.court) {
          s.terminal = { cause, age: 70, told: true };
          set = true;
        }
      }).state;
      if (!set || st.age !== 70 || st.cause !== cause || memoryStories(st, stageOf).length < MEMORY.min) continue;
      lives++;
      cards += c;
    }
    return { lives, cards };
  };
  const road = forced('road'), cancer = forced('cancer');
  check('  ตัวควบคุม นัดตายอุบัติเหตุอายุ 70 = 0 ใบ', road.lives ? road.cards : 1, ` ${road.cards} ใบ/${road.lives} ชีวิต`);
  check('  ตัวควบคุม นัดตายโรคเรื้อรังอายุ 70 = 1 ใบทุกชีวิต', cancer.lives && cancer.cards === cancer.lives ? 0 : 1, ` ${cancer.cards} ใบ/${cancer.lives} ชีวิต`);
}
console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
if (fail) process.exitCode = 1;
