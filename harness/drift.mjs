// ด่านขั้นความเพี้ยน (world-drift ใบ 218): บอททุกบุคลิกเล่น 2 รุ่นต่อกัน แล้วตรวจเหตุแต่ง (การ์ด drift_) รายรุ่น
// full เล่นรุ่นเดียว ⇒ การ์ด drift_ ถึงไม่ได้ที่ full ด่าน 2 · ด่านนี้ตัดสินว่าถึงได้จริงแทน
// ด่าน (ตก = exit 1):
//   (1) รุ่น 1 เหตุแต่ง 0 ใบ ทั้งนัดและที่ออก ทุกบอท · ตัวควบคุม: วางแผนบังคับขั้น 1 ให้รุ่น 1 ตัววัดต้องเห็น
//   (2) รุ่น 2 นัดตามจำนวนของขั้น (ตารางเขียนจากสเปก ไม่อ่านค่าคงที่ engine) · ออก > 0 ทุกบอท · ออกตรงปีที่นัดทุกใบ
//       ตัวควบคุม: เลื่อนปีนัดไป 1 ปี ตัววัดออกผิดปีต้องเห็น
//   (3) เหตุแต่งไม่อยู่ในข้อมูลเหตุบ้านเมือง: era.events ไม่มี id drift_ · ตัวควบคุมเติมเหตุแต่ง 1 ใบ จำนวน era.events ไม่ขยับ
//       ชุดที่ฉายา storm/survivor นับ (erasShown) ไม่มีเหตุแต่ง · lastEraAge ตรงปีเหตุจริงที่ออกล่าสุด
//   (4) เลขสุ่มแยก: รุ่น 2 จากทายาทคนเดิม มี/ไม่มีการ์ด drift_ ในเนื้อหา เลขสุ่มหลักและค่าซ้อนทับตอนเริ่มเท่ากัน
//   (5) เซฟเก่า: ชีวิตที่ไม่มีช่อง drift ไม่ได้แผนใหม่ตอนทริปกลับบ้าน (run > 0) · ตัวควบคุม: มีช่อง = ได้แผน
import { playLife, playAfterlife, nextLife, newLife, mixSeed, driftPlan, driftStageOf, erasShown } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';
import { siteFacts } from '../src/site/facts.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 200);
const seed = opt('seed', 1);
const content = loadContent();
const PREFIX = 'drift_';
const QUOTA = [[0, 0], [1, 1], [2, 3], [4, 6], [4, 6]];
const isDrift = (id) => typeof id === 'string' && id.startsWith(PREFIX);
const fail = [];
const rows = [];

// ออกผิดปี = ออกก่อนนัด · ออกตอนยังอยู่นอกบ้านชนิดที่การ์ดห้าม · หรือช้ากว่านัดโดยมีปีที่ไม่ได้ถูกเลื่อนเพราะนอกบ้าน
// นัดเลื่อนจนกลับบ้านเป็นกติกาของ awayDefer ไม่ใช่ความเพี้ยน แต่ต้องพิสูจน์ครบทุกปีที่ช้า จาก held ที่แกนจด
const blockedKinds = (id) => content.events.find((e) => e.id === id)?.away_block ?? [];
const heldEveryYear = (p, f) => {
  const kinds = blockedKinds(f.id);
  for (let a = p.age; a < f.age; a++) if (!(p.held ?? []).some((h) => h.age === a && kinds.includes(h.kind))) return false;
  return true;
};
const isOff = (plan, f) => {
  if (f.away && blockedKinds(f.id).includes(f.away)) return true;
  const p = plan.find((x) => x.event === f.id);
  return !p || f.age < p.age || !heldEveryYear(p, f);
};
const offDate = (plan, fired) => fired.filter((f) => isOff(plan, f)).length;

let ctlSeen = false, ctlOff = 0, ctlLate = 0, ctlAway = 0, held = 0;
for (const [name, bot] of Object.entries(BOTS)) {
  let g1 = 0, sched = 0, fired = 0, off = 0, badQuota = 0, eraLeak = 0, eraLast = 0;
  for (let i = 0; i < n; i++) {
    let st = newLife(mixSeed(seed, i), content);
    for (let g = 0; g < 2; g++) {
      const live = st.scheduled.filter((x) => x.drift);
      const plan = live.map((x) => ({ ...x }));
      const seen = [];
      const { state } = playLife(st.seed, content, bot, (c, s) => {
        if (isDrift(c.id)) seen.push({ id: c.id, age: c.age, away: s?.outside?.kind ?? null });
      }, st);
      plan.forEach((p, k) => { p.held = live[k].held; });
      if (g === 0) {
        g1 += plan.length + seen.length;
        if (i === 0) {
          const probe = newLife(mixSeed(seed, i), content);
          driftPlan(probe, 0, 1);
          ctlSeen ||= probe.scheduled.some((x) => x.drift);
        }
        st = nextLife(playAfterlife(state, bot));
        continue;
      }
      const [lo, hi] = QUOTA[driftStageOf(state)];
      if (plan.length < lo || plan.length > hi) badQuota++;
      sched += plan.length;
      fired += seen.length;
      off += offDate(plan, seen);
      held += seen.filter((f) => !isOff(plan, f) && plan.some((p) => p.event === f.id && f.age > p.age)).length;
      if (i === 0 && seen.length) ctlOff += offDate(plan.map((p) => ({ ...p, age: p.age + 1 })), seen);
      // ตัวควบคุม: ช้า 1 ปีโดยไม่มีปีที่เลื่อน · ออกตอนยังอยู่นอกบ้าน — ทั้งสองแบบต้องนับเป็นผิดปี
      ctlLate += offDate(plan.map((p) => ({ ...p, age: p.age - 1, held: undefined })), seen);
      ctlAway += offDate(plan, seen.filter((f) => blockedKinds(f.id).length).map((f) => ({ ...f, away: blockedKinds(f.id)[0] })));
      const shown = erasShown(state, state.age);
      eraLeak += shown.filter(({ e }) => isDrift(e.id)).length;
      const last = shown.length ? Math.max(...shown.map(({ age }) => age)) : null;
      if (state.lastEraAge !== last) eraLast++;
    }
  }
  rows.push(`${name}: รุ่น 1 เหตุแต่ง ${g1} · รุ่น 2 นัด ${sched}/${n} ออก ${fired} ผิดปี ${off} จำนวนผิดขั้น ${badQuota} · erasShown มีเหตุแต่ง ${eraLeak} · lastEraAge ไม่ตรง ${eraLast}`);
  if (g1) fail.push(`(1) ${name} รุ่น 1 มีเหตุแต่ง ${g1}`);
  if (badQuota) fail.push(`(2) ${name} จำนวนนัดผิดขั้น ${badQuota} ชีวิต`);
  if (!fired) fail.push(`(2) ${name} รุ่น 2 ไม่มีเหตุแต่งออกเลย`);
  if (off) fail.push(`(2) ${name} ออกผิดปี ${off}`);
  if (eraLeak) fail.push(`(3) ${name} erasShown มีเหตุแต่ง ${eraLeak}`);
  if (eraLast) fail.push(`(3) ${name} lastEraAge ไม่ตรงเหตุจริง ${eraLast} ชีวิต`);
}
if (!ctlSeen) fail.push('(1) ตัวควบคุม: บังคับขั้น 1 ให้รุ่น 1 แล้วไม่เห็นนัด — ตัววัดไม่ได้วัด');
if (!ctlOff) fail.push('(2) ตัวควบคุม: เลื่อนปีนัดแล้วตัววัดผิดปีไม่เห็น');
if (!ctlLate) fail.push('(2) ตัวควบคุม: ช้าโดยไม่ได้อยู่นอกบ้านแล้วตัววัดไม่เห็น');
if (!ctlAway) fail.push('(2) ตัวควบคุม: ออกตอนยังอยู่นอกบ้านแล้วตัววัดไม่เห็น');
rows.push(`ตัวควบคุม (1) บังคับขั้น 1 เห็นนัด: ${ctlSeen} · (2) เลื่อนปีนัดเห็นผิดปี: ${ctlOff} · ช้าโดยไม่นอกบ้านเห็นผิดปี: ${ctlLate} · ออกตอนนอกบ้านเห็นผิดปี: ${ctlAway} · เลื่อนเพราะนอกบ้านครบทุกปี: ${held}`);

// (3) ข้อมูลเหตุบ้านเมือง — อ่านเลขเดียวกับหน้าเว็บ (siteFacts.eraEvents) · ตัวควบคุมเติมเหตุแต่ง 1 ใบ เลขเหตุไม่ขยับ แต่เลขการ์ดขยับ (ตัวควบคุมได้เติมจริง)
const leak = content.era.events.filter((e) => isDrift(e.id)).length;
const spiked = { ...content, events: [...content.events, { ...content.events.find((e) => isDrift(e.id)), id: `${PREFIX}ctl_01` }] };
const [f0, f1] = [siteFacts(content), siteFacts(spiked)];
rows.push(`facts เหตุการณ์บ้านเมือง ${f0.eraEvents} → เติมเหตุแต่ง ${f1.eraEvents} · การ์ด ${f0.cards} → ${f1.cards} · era.events มีเหตุแต่ง ${leak}`);
if (leak) fail.push(`(3) era.events มีเหตุแต่ง ${leak}`);
if (f1.eraEvents !== f0.eraEvents) fail.push('(3) เติมเหตุแต่งแล้วเลขเหตุการณ์บ้านเมืองขยับ');
if (f1.cards === f0.cards) fail.push('(3) ตัวควบคุม: เติมเหตุแต่งแล้วเลขการ์ดไม่ขยับ — ไม่ได้เติมจริง');

// (4) เลขสุ่มแยก — ทายาทคนเดียวกัน เนื้อหามี/ไม่มีการ์ด drift_
const bare = { ...content, events: content.events.filter((e) => !isDrift(e.id)) };
let rngDiff = 0, ovDiff = 0, planned = 0;
for (let i = 0; i < Math.min(n, 50); i++) {
  const { state } = playLife(mixSeed(seed, i), content, BOTS[Object.keys(BOTS)[0]]);
  const af = playAfterlife(state, BOTS[Object.keys(BOTS)[0]]);
  const a = newLife(af.heir.seed, content, af.heir), b = newLife(af.heir.seed, bare, af.heir);
  planned += a.scheduled.filter((x) => x.drift).length;
  for (let k = 0; k < 5; k++) if (a.rng.next() !== b.rng.next()) rngDiff++;
  if ((a.overlap ?? 0) !== (b.overlap ?? 0)) ovDiff++;
}
rows.push(`เลขสุ่มหลักต่าง ${rngDiff} · ค่าซ้อนทับต่าง ${ovDiff} · (ชีวิตฝั่งมีเนื้อหาได้นัด ${planned})`);
if (!planned) fail.push('(4) ฝั่งมีเนื้อหาไม่ได้นัดเลย — เทียบไม่ได้วัดอะไร');
if (rngDiff) fail.push(`(4) เลขสุ่มหลักต่าง ${rngDiff}`);
if (ovDiff) fail.push(`(4) ค่าซ้อนทับต่าง ${ovDiff}`);

// (5) เซฟเก่า — ช่อง drift หายแบบเซฟก่อนมีใบนี้
{
  const { state } = playLife(mixSeed(seed, 0), content, BOTS[Object.keys(BOTS)[0]]);
  const heir = playAfterlife(state, BOTS[Object.keys(BOTS)[0]]).heir;
  const old = newLife(heir.seed, content, heir);
  delete old.drift;
  old.scheduled = old.scheduled.filter((x) => !x.drift);
  driftPlan(old, 1);
  const got = old.scheduled.filter((x) => x.drift).length;
  const ctl = newLife(heir.seed, content, heir);
  ctl.scheduled = ctl.scheduled.filter((x) => !x.drift);
  driftPlan(ctl, 1);
  const ctlGot = ctl.scheduled.filter((x) => x.drift).length;
  rows.push(`เซฟเก่าทริปกลับบ้านได้นัด ${got} · ตัวควบคุมมีช่องได้นัด ${ctlGot}`);
  if (got) fail.push(`(5) เซฟเก่าได้นัดเหตุแต่งกลางชีวิต ${got}`);
  if (!ctlGot) fail.push('(5) ตัวควบคุม: มีช่อง drift แล้วไม่ได้นัด');
}

console.log(`ด่านขั้นความเพี้ยน n=${n} seed=${seed}`);
for (const r of rows) console.log(`  ${r}`);
if (fail.length) {
  console.log(`ตก ${fail.length} ข้อ`);
  for (const f of fail) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('ผ่านทุกข้อ');
