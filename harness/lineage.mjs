// harness ระหว่างชาติ + หลายรุ่น (B06): บอท 3 บุคลิกเล่นตระกูลละหลายรุ่นผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ
// ด่าน: เล่นครบทุกรุ่น · ช่วงที่ 7 ยาว 6–10 การ์ด · ปรโลกเฉลยบัญชีทุกครั้งและที่เดียว · ส่งต่อ 30–70% ตรงสูตร
// · ฐานะชาติหน้าขยับตามกรรมทั้งสองทาง (ใบ 05 แรงทุกทาง) · หนี้ไม่ตกถึงลูก · ทุกฉากในเนื้อหาออกได้จริง · ค่าแถบไม่หลุด
import { newLife, playLife, playAfterlife, nextLife, openChoices, mixSeed, meritId, MERIT_WEIGHTS, MERIT_LEVELS, SIN_CATS, FLAG_CATS, CLASSES, CARRY, carryLedger, AFTERLIFE_STAGE, REALMS, KIN_TIERS, kinTier, COURT_SCENES, makeRng } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { stuckCard, unfilledIn } from './gates.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 2000);
const gens = opt('gens', 3);
const seed = opt('seed', 1);
const content = loadContent();

// บอทชุดเดียวกับ harness/merit.mjs — holder = st (การ์ดชีวิต) หรือ af (การ์ดระหว่างชาติ) มี pending.choices ให้อ่านป้าย
const score = (c) =>
  (c.merit ?? []).reduce((s, t) => {
    const id = meritId(t.cat);
    if (id === 'neutral') return s;
    const v = MERIT_WEIGHTS[id] * (FLAG_CATS.includes(id) ? 1 : MERIT_LEVELS[t.level]);
    return s + (SIN_CATS.includes(id) ? -v : v);
  }, 0);
const extreme = (sign) => (card, rng, h) => {
  if (h.pending?.alloc) return 0;
  const open = openChoices(card);
  // การ์ดต่างโลก (B68) ไม่มีป้ายบุญบาป — สุ่มแบบ bots.mjs
  if (!h.pending) return open[rng.int(0, open.length - 1)];
  const s = open.map((i) => sign * score(h.pending.choices[i]));
  const best = Math.max(...s);
  const ties = open.filter((_, j) => s[j] === best);
  return ties[rng.int(0, ties.length - 1)];
};
const BOTS = {
  สุ่ม: (card, rng) => {
    const open = openChoices(card);
    return open[rng.int(0, open.length - 1)];
  },
  สายบุญ: extreme(1),
  สายบาป: extreme(-1),
};

const LEAK = /ledger|merit|sin|karma|byCat|broken|omenTone|omenAge/i;
const REVEAL = 'reckoning';
function* keys(v) {
  if (Array.isArray(v)) for (const x of v) yield* keys(x);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { yield k; yield* keys(x); }
}
const STAT_KEYS = ['health', 'happiness', 'knowledge', 'relations', 'network'];
// ใบศาลเฉียดตาย (B153) ใช้ stage ระหว่างชาติแต่ออกกลางชีวิต ไม่ใช่ฉากปรโลก — ด่าน near นับใบพวกนี้แทน
const sceneIds = content.events.filter((e) => e.stage === AFTERLIFE_STAGE && !COURT_SCENES.includes(e.scene)).map((e) => e.id);
const fired = new Map(sceneIds.map((id) => [id, 0]));
const fails = [];
const f = (v, d = 2) => v.toFixed(d);
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

const out = {};
let streamBad = 0, streamChecks = 0, childDeaths = 0, childBad = 0, occBad = 0, provBad = 0, provSame = 0, rebirths = 0;
let leaks = 0, reveals = 0, afterlives = 0, statBad = 0, carryBad = 0, debtLeak = 0, lenBad = 0, isekaiLives = 0, isekaiBad = 0;
// ธงข้ามรุ่น (heir:): ก ทางอื่นไม่ได้ · ข ได้เฉพาะธงในทะเบียน ชั้นไม่เกินเพดาน รุ่นก่อนถือจริง · ค ไม่ปนกับ flags ของทายาท
const HEIR = content.heir ?? {};
// การ์ดค้าง + ช่องแทนค่าค้างระหว่างชาติ (stuckCard · unfilledIn ใน gates.mjs) — การ์ดฉาก/ศาลปรโลกแกนสร้างเอง lint ไม่เห็น · ชีวิตและทริปตรวจที่ density
const eventById = Object.fromEntries(content.events.map((e) => [e.id, e]));
const stuck = new Map(), unfilled = new Map();
const parentReaders = (e) => [e.when?.parent_flags, e.multipliers?.parent_flags, ...(e.choices ?? []).flatMap((c) => (c.outcomes ?? []).map((o) => o.multipliers?.parent_flags))].some(Boolean);
const heirReaders = content.events.filter(parentReaders);
let heirA = 0, heirB = 0, heirC = 0, heirTwin = 0, heirGot = 0;
const lens = [];
// ทางในตระกูลแยกชั้น (B18): จำนวน · ผลรวมสัดส่วนส่งต่อ · มรดก (เท่ารายได้ปี) · |ส่วนต่างความสัมพันธ์+คอนเน็คชั่นจากบ้าน|
const tiers = KIN_TIERS.map(() => ({ n: 0, carry: 0, legacy: 0, kin: 0, units: [] }));
const causeGen = Array.from({ length: gens }, () => new Map());
const CAUSE_MIN = 30;
for (const [name, pick] of Object.entries(BOTS)) {
  const r = { realms: {}, paths: { child: 0, reborn: 0 }, byX: { child: [[0, 0], [0, 0], [0, 0]], reborn: [[0, 0], [0, 0], [0, 0]] }, ages: Array.from({ length: gens }, () => [0, 0]), legacy: [0, 0] };
  for (let i = 0; i < n; i++) {
    let st = null;
    // ชีวิตต่างโลก (B68) นับเป็นรุ่นของตัวเอง — รุ่นที่ g ของบอทอาจได้ gen มากกว่า g + 1
    let wantGen = 1;
    for (let g = 0; g < gens; g++) {
      const lifeSeed = st ? st.seed : mixSeed(seed, i);
      let deathCard = null;
      const life = playLife(lifeSeed, content, pick, (card, s) => {
        for (const k of STAT_KEYS) if (!(s[k] >= 0 && s[k] <= 100)) statBad++;
        if (card.kind === 'death') {
          deathCard = card;
          if (card[REVEAL] !== undefined) leaks++;
        }
      }, st ?? undefined);
      st = life.state;
      // ใบ 07: ตายตอนเด็กได้การ์ดบันทึกสั้นพร้อมสถิติยุค แล้วเข้าช่วงที่ 7 ตามปกติ (ช่วงที่ 7 ตรวจด้านล่างเหมือนทุกชีวิต)
      if (life.age < 13) {
        childDeaths++;
        if (!(deathCard?.short && deathCard.note)) childBad++;
      }
      if (st.gen !== wantGen) fails.push(`ตระกูล ${i} รุ่นที่ ${g + 1} ได้ gen ${st.gen} (ควรเป็น ${wantGen})`);
      r.ages[g][0] += life.age;
      causeGen[g].set(st.cause ?? 'other', (causeGen[g].get(st.cause ?? 'other') ?? 0) + 1);
      r.ages[g][1]++;
      // สำเนาบัญชีตอนการ์ดส่งต่อ (หลังฉากระหว่างชาติปรับบัญชีครบแล้ว) = บัญชีที่ makeHeir ใช้
      let verdict = null;
      let snap = null;
      let verdicts = 0;
      const prevFlags = { ...st.flags };
      const af = playAfterlife(st, pick, (card, a) => {
        for (const u of unfilledIn(card)) unfilled.set(`${card.id ?? card.kind} ${u}`, (unfilled.get(`${card.id ?? card.kind} ${u}`) ?? 0) + 1);
        const why = stuckCard(card, eventById);
        if (why) stuck.set(`${card.id ?? card.kind} (${why})`, (stuck.get(`${card.id ?? card.kind} (${why})`) ?? 0) + 1);
        const { [REVEAL]: reveal, ...rest } = card;
        for (const k of keys(rest)) if (LEAK.test(k)) leaks++;
        if (card.kind === 'verdict') {
          if (reveal) reveals++;
          verdict = a.verdict;
          verdicts++;
        } else if (reveal !== undefined) leaks++;
        if (card.kind === 'scene') fired.set(card.id, fired.get(card.id) + 1);
        // บัญชีที่ปรโลกตัดสินรอบสุดท้าย (a.st.ledger บัญชีเดียวของดวงวิญญาณ) — ชาติไทยคือบัญชีของชีวิต · กลับจากต่างโลกคือบัญชีของชาติต่างโลก (B68)
        if (card.kind === 'carry') snap = { merit: a.st.ledger.merit, sin: a.st.ledger.sin, byCat: { ...a.st.ledger.byCat }, broken: {} };
      });
      afterlives++;
      // การ์ดตาย 1 ใบ + การ์ดที่ระหว่างชาติออก (แกนนับ รวมการ์ดผล)
      const len = 1 + af.cards;
      // ไปต่างโลกมีปรโลกรอบที่สองต่อท้าย (B68) — ช่วงที่ 7 ยาว 6–10 วัดเฉพาะชีวิตที่ไม่ข้ามโลก
      if (!af.isekaiLives.length) {
        lens.push(len);
        if (len < 6 || len > 10) lenBad++;
      }
      r.realms[verdict.realm.name] = (r.realms[verdict.realm.name] ?? 0) + 1;
      r.paths[af.path]++;
      const h = af.heir;
      // กรอบ CARRY คุมสัดส่วนก่อนคูณชั้น — ชั้นลูก (และทางเกิดใหม่) ตัวคูณ 1 จึงยังอยู่ใน 30–70% ตรง ๆ
      const base = h.carried / kinTier(h.tier).carry;
      if (!(base >= CARRY.min - 1e-12 && base <= CARRY.max + 1e-12)) carryBad++;
      if ((af.path === 'child') !== (h.tier !== null)) carryBad++;
      if (h.tier) {
        const t = tiers[h.tier - 1];
        t.n++;
        t.carry += h.carried;
        t.legacy += h.legacy.units;
        t.units.push(h.legacy.units);
        t.kin += Math.abs(h.kin.relations) + Math.abs(h.kin.network);
      }
      const want = carryLedger(snap, verdict.net, h.carried);
      if (!near(want.merit, h.ledger.merit) || !near(want.sin, h.ledger.sin)) carryBad++;
      // สูตรเขียนซ้ำอิสระจากแกน: ฝั่งที่ชนะที่ปรโลกถูกหัก spend × |สุทธิ| (ไม่ติดลบ) ฝั่งแพ้ไม่ถูกหัก แล้วคูณ r
      const win = verdict.net >= 0 ? 'merit' : 'sin', lose = win === 'merit' ? 'sin' : 'merit';
      if (!near(h.ledger[win], Math.max(0, snap[win] - CARRY.spend * Math.abs(verdict.net)) * h.carried) || !near(h.ledger[lose], snap[lose] * h.carried)) carryBad++;
      if (h.ledger.merit > snap.merit + 1e-9 || h.ledger.sin > snap.sin + 1e-9) carryBad++;
      if (h.legacy && (h.legacy.units < 0 || (st.estate.money < 0 && h.legacy.units !== 0))) debtLeak++;
      if (h.legacy) {
        r.legacy[0] += h.legacy.units;
        r.legacy[1]++;
      }
      const bin = verdict.x <= -0.2 ? 0 : verdict.x < 0.3 ? 1 : 2;
      const cell = r.byX[af.path][bin];
      cell[0] += CLASSES.indexOf(h.cls);
      cell[1]++;
      // รุ่นถัดไปต้องดึงเลขสุ่มของโลกตำแหน่งเดียวกับชีวิตแรก: heir ที่ทับด้วยค่าที่ชีวิตแรกสุ่มได้เอง (ไม่มีโบนัส/บัญชี/มรดก)
      // ต้องเล่นออกมาเหมือนชีวิตไม่มี heir ทุกหลัก — ถ้า heir ไปเลื่อน stream ชะตาจะต่าง
      if (g === 0 && i < 200) {
        const plain = newLife(h.seed, content);
        const twin = newLife(h.seed, content, { birthYear: plain.birthYear, sex: plain.sex, region: { name: plain.region, ses: plain.ses }, cls: plain.cls, bonus: {} });
        const a = playLife(h.seed, content, pick, null, plain), b = playLife(h.seed, content, pick, null, twin);
        if (a.age !== b.age || a.cards !== b.cards || Math.round(a.state.money) !== Math.round(b.state.money)) streamBad++;
        streamChecks++;
        // ธงพ่อแม่ครบทั้งทะเบียนต้องไม่ขยับอะไรนอกการ์ดที่อ่านมัน (ความเสี่ยงตาย ฉายา ตำแหน่ง อ่าน flags ไม่ใช่ parentFlags)
        // มีการ์ดอ่านแล้วชีวิตต่างได้โดยชอบ ⇒ ส่วนนี้วัดได้เฉพาะตอนเนื้อหายังไม่มีผู้อ่าน
        if (!heirReaders.length) {
          const full = newLife(h.seed, content, { birthYear: plain.birthYear, sex: plain.sex, region: { name: plain.region, ses: plain.ses }, cls: plain.cls, bonus: {}, parentFlags: Object.fromEntries(Object.keys(HEIR).map((k) => [k, 1])) });
          const c = playLife(h.seed, content, pick, null, full);
          if (a.age !== c.age || a.cards !== c.cards || Math.round(a.state.money) !== Math.round(c.state.money)) heirTwin++;
        }
      }
      const lastJob = st.occupation, lastProv = st.province;
      wantGen = st.gen + 1 + af.isekaiLives.length;
      if (af.isekaiLives.length) isekaiLives += af.isekaiLives.length;
      if (af.isekaiLives.length && h.lineage.length !== (st.lineage?.length ?? 0) + 1 + af.isekaiLives.length) isekaiBad++;
      // ปรโลกตัดสินทุกชาติ: ชาติไทย 1 ครั้ง + ชาติต่างโลกละ 1 ครั้ง (B68 วงเดียว)
      if (verdicts !== 1 + af.isekaiLives.length) isekaiBad++;
      st = nextLife(af);
      const pf = Object.entries(st.parentFlags ?? {});
      if (af.path !== 'child') { if (pf.length) heirA++; }
      else {
        for (const [k, t] of pf) if (!HEIR[k] || t !== h.tier || t > HEIR[k].tier || !prevFlags[k]) heirB++;
        for (const [k, x] of Object.entries(HEIR)) if (prevFlags[k] && h.tier <= x.tier && !st.parentFlags[k]) heirB++;
      }
      if (af.path === 'child' && pf.length) heirGot++;
      if (Object.keys(st.flags).length) heirC++;
      if (af.path === 'child' && st.familyOcc !== lastJob) occBad++;
      if (af.path === 'child' && st.province !== lastProv) provBad++;
      // เกิดใหม่ต้องสุ่มจังหวัดใหม่จริง — ถ้าทางเกิดใหม่ติดจังหวัดเดิมเกือบทุกครั้ง แปลว่าค่าบ้านรั่วมาทางที่ไม่ใช่ลูก
      if (af.path !== 'child') { rebirths++; if (st.province === lastProv) provSame++; }
      for (const k of STAT_KEYS) if (!(st[k] >= 0 && st[k] <= 100)) statBad++;
    }
  }
  out[name] = r;
}

console.log(`ตระกูล ${n} ต่อบอท × ${gens} รุ่น · seed ${seed} · ฉากระหว่างชาติ ${sceneIds.length} ใบ`);
const realmNames = REALMS.map((x) => x.name);
console.log(`บอท     อายุเฉลี่ยรายรุ่น            ${realmNames.join(' ')}   เป็นลูก/เกิดใหม่  มรดกเฉลี่ย (เท่ารายได้ปี)`);
for (const [name, r] of Object.entries(out)) {
  const ages = r.ages.map(([s, c]) => f(s / c, 1)).join(' / ');
  const realms = realmNames.map((x) => String(r.realms[x] ?? 0).padStart(5)).join(' ');
  console.log(`${name.padEnd(6)} ${ages.padEnd(26)} ${realms}   ${r.paths.child}/${r.paths.reborn}   ${r.legacy[1] ? f(r.legacy[0] / r.legacy[1]) : '-'}`);
}

// ฐานะชาติหน้าเฉลี่ย (ดัชนี 0–9) ตามระดับกรรมที่ปรโลก: บาป ≤ −0.2 · กลาง · บุญ ≥ 0.3 — ต้องเรียงขึ้นทั้งทางเป็นลูกและเกิดใหม่
// ช่องกลางชีวิตน้อยแกว่งตาม seed และสัดส่วนอาชีพในช่องนั้น (Simpson) ⇒ ชีวิตไม่ถึงเกณฑ์ตัดสินแค่ บาป < บุญ แบบด่าน finance
const MIN_MID = 300;
console.log('\nฐานะชาติหน้าเฉลี่ย (0 = ยากไร้ · 9 = มั่งคั่ง) ตามกรรมที่ปรโลก   บาป   กลาง   บุญ');
for (const path of ['reborn', 'child']) {
  const cells = [0, 1, 2].map((b) => Object.values(out).reduce((s, r) => [s[0] + r.byX[path][b][0], s[1] + r.byX[path][b][1]], [0, 0]));
  const means = cells.map(([s, c]) => (c ? s / c : NaN));
  const small = cells[1][1] < MIN_MID;
  const ok = small ? means[0] < means[2] : means[0] < means[1] && means[1] < means[2];
  console.log(`${path === 'child' ? 'เป็นลูก ' : 'เกิดใหม่'} ${means.map((m, b) => `${f(m)} (${cells[b][1]})`).join('  ')} → ${ok ? 'ผ่าน' : 'ตก'}${small ? ' (กลางไม่ตัดสิน ชีวิตน้อย · ตัดสินแค่ บาป < บุญ)' : ''}`);
  if (!ok) fails.push(`ฐานะชาติหน้าทาง${path} ไม่เรียงตามกรรม`);
}

lens.sort((a, b) => a - b);
const q = (p) => lens[Math.min(lens.length - 1, Math.floor(p * lens.length))];
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fails.push(label);
};
console.log('');
check(`ช่วงที่ 7 ยาว 6–10 การ์ด (นับการ์ดตาย) ${lens.length.toLocaleString('en-US')} ครั้ง`, lenBad, ` · p5 ${q(0.05)} · p50 ${q(0.5)} · p95 ${q(0.95)} · สูงสุด ${lens.at(-1)}`);
// การ์ดปรโลก 1 ใบต่อชาติ — ชาติต่างโลกก็เฉลยบัญชีที่ปรโลกเหมือนชาติไทย
check('เฉลยบัญชีบนการ์ดปรโลกทุกครั้ง', afterlives + isekaiLives - reveals);
check('ค่าบัญชีไม่ออกนอกการ์ดปรโลก', leaks);
check(`ส่งต่อ ${CARRY.min * 100}–${CARRY.max * 100}% ตรงสูตร (หักฝั่งที่ชี้ปลายทางก่อน)`, carryBad);
check('หนี้ไม่ตกถึงลูก · มรดกไม่ติดลบ', debtLeak);
check('ค่าแถบ 0–100 ทุกการ์ดทุกรุ่น', statBad);
const dead = [...fired].filter(([, c]) => !c).map(([id]) => id);
check(`ฉากระหว่างชาติออกได้จริงทุกใบ (${sceneIds.length} ใบ)`, dead.length, dead.length ? ` ไม่เคยออก: ${dead.join(' ')}` : '');
check(`ตายตอนเด็ก (${childDeaths} ชีวิต) ได้การ์ดบันทึกสั้น + สถิติยุค`, childBad + (childDeaths ? 0 : 1));
check(`รุ่นถัดไปดึงเลขสุ่มของโลกตำแหน่งเดียวกับชีวิตแรก (${streamChecks} คู่)`, streamBad);
const childPaths = Object.values(out).reduce((s, r) => s + r.paths.child, 0);
check('ทางเป็นลูกเกิดได้จริง', childPaths ? 0 : 1, ` ${childPaths} ครั้ง`);
check('ทางเป็นลูก อาชีพที่บ้าน = งานสุดท้ายของรุ่นก่อน', occBad);
check('ทางเป็นลูก เกิดจังหวัดเดียวกับรุ่นก่อน', provBad);
check('ทางเกิดใหม่ สุ่มจังหวัดใหม่ (ติดจังหวัดเดิมไม่เกิน 20%)', provSame > rebirths * 0.2 ? 1 : 0, ` ${provSame}/${rebirths}`);
// ทุกชั้นออกได้จริง แล้วค่าเฉลี่ยที่ส่งต่อต้องไม่เพิ่มเมื่อห่างสายเลือดขึ้น (ลูก ≥ หลาน ≥ เหลน)
const tm = tiers.map((t) => ({ n: t.n, carry: t.carry / t.n, legacy: t.legacy / t.n, kin: t.kin / t.n }));
console.log(`\nชั้นในตระกูล          ${KIN_TIERS.map((t) => t.name.padEnd(8)).join(' ')}`);
for (const [k, label] of [['n', 'จำนวน'], ['carry', 'ส่งต่อบุญบาปเฉลี่ย'], ['legacy', 'มรดกเฉลี่ย (เท่ารายได้ปี)'], ['kin', 'ส่วนต่างจากบ้านเฉลี่ย']]) {
  console.log(`  ${label.padEnd(20)} ${tm.map((t) => (k === 'n' ? String(t.n) : f(t[k])).padEnd(8)).join(' ')}`);
}
check('เกิดเป็นลูก/หลาน/เหลนได้จริงทุกชั้น', tm.filter((t) => !t.n).length, ` ${tm.map((t) => t.n).join(' / ')}`);
const desc = (k) => tm.every((t, i) => !i || !(t[k] > tm[i - 1][k]));
check('ส่งต่อบุญบาป ลูก ≥ หลาน ≥ เหลน', desc('carry') ? 0 : 1);
// มรดกหางยาว (ชีวิตก้อนใหญ่ไม่กี่ชีวิตลากค่าเฉลี่ยทั้งชั้น) — ค่าเฉลี่ยชั้นติดกันสลับกันได้จาก noise ล้วนที่ seed เดียว
// ⇒ ตกเฉพาะกลับทิศที่พิสูจน์ได้แบบด่าน finance: bootstrap ค่าเฉลี่ยในชั้น หาช่วง 95% ของ (ชั้นใกล้ − ชั้นห่าง) · ขอบบน < 0 = ตก
// RNG ของ bootstrap ผูกกับ --seed และไม่แตะ stream ของแกน ⇒ ผลซ้ำทุกหลัก ชีวิตไม่ขยับ
const BOOT = 1000;
const bootRng = makeRng(mixSeed(seed, 0xb007));
const bootMeans = (xs) => {
  const out = new Float64Array(BOOT);
  for (let b = 0; b < BOOT; b++) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) s += xs[Math.floor(bootRng.next() * xs.length)];
    out[b] = s / xs.length;
  }
  return out;
};
const legacyBoots = tiers.map((t) => bootMeans(t.units));
let legacyInv = 0;
for (let i = 1; i < tiers.length; i++) {
  const diffs = legacyBoots[i - 1].map((v, b) => v - legacyBoots[i][b]).sort();
  const [lo, hi] = [diffs[Math.floor(BOOT * 0.025)], diffs[Math.ceil(BOOT * 0.975) - 1]];
  const d = tm[i - 1].legacy - tm[i].legacy;
  if (hi < 0) legacyInv++;
  console.log(`  มรดก ${KIN_TIERS[i - 1].name}−${KIN_TIERS[i].name} ${f(d)} ช่วง 95% [${f(lo)}, ${f(hi)}] → ${hi < 0 ? 'กลับทิศ → ตก' : d >= 0 ? 'ผ่าน' : 'เสมอ (noise) → ผ่าน'}`);
}
check('มรดก ลูก ≥ หลาน ≥ เหลน (ตกเฉพาะกลับทิศที่พิสูจน์ได้)', legacyInv);
check('ความสัมพันธ์/คอนเน็คชั่นจากบ้าน ลูก ≥ หลาน ≥ เหลน', desc('kin') ? 0 : 1);
check('ต่างโลกเกิดได้จริง ลงผังตระกูลรุ่นละชาติ และปรโลกตัดสินทุกชาติ', isekaiBad + (isekaiLives ? 0 : 1), ` ${isekaiLives} ชีวิต`);
check('ไม่มีการ์ดค้างระหว่างชาติ (ไม่มีปุ่มที่เห็นและกดได้)', [...stuck.values()].reduce((a, b) => a + b, 0), stuck.size ? ` · ${[...stuck].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${v}`).join(' · ')}` : '');
check('ไม่มีช่องแทนค่าค้างบนจอระหว่างชาติ', [...unfilled.values()].reduce((a, b) => a + b, 0), unfilled.size ? ` · ${[...unfilled].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${v}`).join(' · ')}` : '');

// ง ทางเป็นลูกในบอทสุ่มมีน้อย — บังคับทาง child (ถ้าไม่ถูกล็อก) ตระกูลละ 2 รุ่น แล้วดูป้าย parentFrom ในรุ่นสอง
const forceChild = (card, rng, h) => (h.pending?.path && !card.locked?.[0] ? 0 : BOTS.สุ่ม(card, rng));
const byId = new Map(content.events.map((e) => [e.id, e]));
const heirFired = new Map(heirReaders.filter((e) => e.when?.parent_flags?.has).map((e) => [e.id, 0]));
let forced = 0, withFlag = 0, dCards = 0, heirD = 0;
for (let i = 0; i < Math.min(n, 500); i++) {
  const first = playLife(mixSeed(seed, 7700 + i), content, forceChild);
  const af = playAfterlife(first.state, forceChild);
  if (af.path !== 'child') continue;
  const st = nextLife(af);
  forced++;
  if (Object.keys(st.parentFlags).length) withFlag++;
  playLife(st.seed, content, forceChild, (card, s) => {
    if (heirFired.has(card.id)) heirFired.set(card.id, heirFired.get(card.id) + 1);
    if (!card.parentFrom) return;
    dCards++;
    const has = byId.get(card.id)?.when?.parent_flags?.has ?? [];
    for (const x of card.parentFrom) if (!has.includes(x.flag) || s.parentFlags[x.flag] !== x.tier) heirD++;
  }, st);
}
console.log('');
check('ทางเกิดใหม่/ต่างโลกไม่ได้ธงพ่อแม่', heirA);
check('ทางเป็นลูกได้ธงในทะเบียน heir: ครบ ชั้นไม่เกินเพดาน และรุ่นก่อนถือจริง', heirB, ` · ได้ธง ${heirGot} ชีวิต`);
check('ทายาทเกิดมามีธงตัวเองว่าง (ธงพ่อแม่อยู่ช่องแยก)', heirC);
// ทายาทตายได้ทุกสาเหตุแบบรุ่นแรก (ไอเดีย thelands-5 — เขา: ธงตายค้าง ทายาทอมตะ) · สาเหตุที่รุ่นแรกน้อยกว่าเกณฑ์หายไปในรุ่นหลังได้จาก rng ล้วน ไม่ตัดสิน
const counted = [...causeGen[0]].filter(([, v]) => v >= CAUSE_MIN).map(([c]) => c);
const lostCause = counted.flatMap((c) => causeGen.slice(1).flatMap((m, g) => (m.get(c) ? [] : [`${c} รุ่น ${g + 2}`])));
console.log(`  สาเหตุตายต่อรุ่น (นับ ${counted.length} สาเหตุที่รุ่นแรก ≥${CAUSE_MIN}): ${counted.map((c) => `${c} ${causeGen.map((m) => m.get(c) ?? 0).join('/')}`).join(' · ')}`);
check('ทายาทรุ่นหลังตายได้ทุกสาเหตุที่รุ่นแรกตาย', lostCause.length, lostCause.length ? ` · หาย: ${lostCause.join(' · ')}` : '');
check(`ธงพ่อแม่ครบทะเบียนไม่ขยับชีวิตเมื่อไม่มีการ์ดอ่าน (${heirReaders.length ? 'มีผู้อ่านแล้ว ข้าม' : `${streamChecks} คู่`})`, heirTwin);
check(`ป้าย parentFrom ตรงเงื่อนไขการ์ด (${dCards} ใบ)`, heirD);
const deadHeir = [...heirFired].filter(([, c]) => !c).map(([id]) => id);
// ธงหายากถึงทายาทแค่ไม่กี่ชีวิตใน 500 ตระกูล (loan_shark ปิดหนี้ก่อนตาย) — ใบที่ไม่ออกเองลองซ้ำด้วยทายาทที่ถือธงครบ แยกดวงออกจากการ์ดที่ออกไม่ได้จริง
const HEIR_RETRY = 200;
const deadForced = deadHeir.filter((id) => {
  const ev = byId.get(id);
  const parentFlags = Object.fromEntries(ev.when.parent_flags.has.map((f) => [f, 1]));
  for (let i = 0; i < HEIR_RETRY; i++) {
    const s = mixSeed(seed, 9900 + i);
    const p = newLife(s, content);
    let hit = false;
    playLife(s, content, forceChild, (card) => { if (card.id === id) hit = true; }, newLife(s, content, { birthYear: p.birthYear, sex: p.sex, region: { name: p.region, ses: p.ses }, cls: p.cls, bonus: {}, parentFlags }));
    if (hit) return false;
  }
  return true;
});
check(`การ์ดที่กั้นด้วยธงพ่อแม่ออกได้จริงทุกใบ (${heirFired.size} ใบ · ไม่นับใบที่มีแค่ตัวคูณ · ไม่ออกเอง ${deadHeir.length} ใบลองถือธงซ้ำ ${HEIR_RETRY} ชีวิต)`, deadForced.length, deadForced.length ? ` ไม่เคยออก: ${deadForced.join(' ')}` : '');
console.log(`ทางลูกบังคับ: ถือธงพ่อแม่ ${withFlag}/${forced} ชีวิต · การ์ดอ่านธงพ่อแม่ ${heirReaders.length} ใบ · ไม่เคยออก ${deadHeir.length}${deadHeir.length ? `: ${deadHeir.join(' ')}` : ''}`);
if (!sceneIds.length) fails.push('ไม่มีฉากระหว่างชาติในเนื้อหา');
if (fails.length) {
  for (const x of fails) console.log(`  ✗ ${x}`);
  process.exitCode = 1;
}
