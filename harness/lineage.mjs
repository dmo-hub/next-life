// harness ระหว่างชาติ + หลายรุ่น (B06): บอท 3 บุคลิกเล่นตระกูลละหลายรุ่นผ่านฟังก์ชันชุดเดียวกับหน้าเว็บ
// ด่าน: เล่นครบทุกรุ่น · ช่วงที่ 7 ยาว 6–10 การ์ด · ศาลเฉลยบัญชีทุกครั้งและที่เดียว · ส่งต่อ 30–70% ตรงสูตร
// · ฐานะชาติหน้าขยับตามกรรมทั้งสองทาง (ใบ 05 แรงทุกทาง) · หนี้ไม่ตกถึงลูก · ทุกฉากในเนื้อหาออกได้จริง · ค่าแถบไม่หลุด
import { newLife, playLife, playAfterlife, nextLife, openChoices, mixSeed, meritId, MERIT_WEIGHTS, MERIT_LEVELS, SIN_CATS, FLAG_CATS, CLASSES, CARRY, carryLedger, AFTERLIFE_STAGE, REALMS, KIN_TIERS, kinTier } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';

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
  if (h.pending.alloc) return 0;
  const open = openChoices(card);
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
const sceneIds = content.events.filter((e) => e.stage === AFTERLIFE_STAGE).map((e) => e.id);
const fired = new Map(sceneIds.map((id) => [id, 0]));
const fails = [];
const f = (v, d = 2) => v.toFixed(d);
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

const out = {};
let streamBad = 0, streamChecks = 0, childDeaths = 0, childBad = 0, occBad = 0;
let leaks = 0, reveals = 0, afterlives = 0, statBad = 0, carryBad = 0, debtLeak = 0, lenBad = 0;
const lens = [];
// ทางในตระกูลแยกชั้น (B18): จำนวน · ผลรวมสัดส่วนส่งต่อ · มรดก (เท่ารายได้ปี) · |ส่วนต่างความสัมพันธ์+คอนเน็คชั่นจากบ้าน|
const tiers = KIN_TIERS.map(() => ({ n: 0, carry: 0, legacy: 0, kin: 0 }));
for (const [name, pick] of Object.entries(BOTS)) {
  const r = { realms: {}, paths: { child: 0, reborn: 0 }, byX: { child: [[0, 0], [0, 0], [0, 0]], reborn: [[0, 0], [0, 0], [0, 0]] }, ages: Array.from({ length: gens }, () => [0, 0]), legacy: [0, 0] };
  for (let i = 0; i < n; i++) {
    let st = null;
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
      if (st.gen !== g + 1) fails.push(`ตระกูล ${i} รุ่นที่ ${g + 1} ได้ gen ${st.gen}`);
      r.ages[g][0] += life.age;
      r.ages[g][1]++;
      // สำเนาบัญชีตอนการ์ดส่งต่อ (หลังฉากระหว่างชาติปรับบัญชีครบแล้ว) = บัญชีที่ makeHeir ใช้
      let verdict = null;
      let snap = null;
      const af = playAfterlife(st, pick, (card, a) => {
        const { [REVEAL]: reveal, ...rest } = card;
        for (const k of keys(rest)) if (LEAK.test(k)) leaks++;
        if (card.kind === 'verdict') {
          if (reveal) reveals++;
          verdict = a.verdict;
        } else if (reveal !== undefined) leaks++;
        if (card.kind === 'scene') fired.set(card.id, fired.get(card.id) + 1);
        if (card.kind === 'carry') snap = { merit: a.st.ledger.merit, sin: a.st.ledger.sin, byCat: { ...a.st.ledger.byCat }, broken: {} };
      });
      afterlives++;
      // การ์ดตาย 1 ใบ + การ์ดที่ระหว่างชาติออก (แกนนับ รวมการ์ดผล)
      const len = 1 + af.cards;
      lens.push(len);
      if (len < 6 || len > 10) lenBad++;
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
        t.kin += Math.abs(h.kin.relations) + Math.abs(h.kin.network);
      }
      const want = carryLedger(snap, verdict.net, h.carried);
      if (!near(want.merit, h.ledger.merit) || !near(want.sin, h.ledger.sin)) carryBad++;
      // สูตรเขียนซ้ำอิสระจากแกน: ฝั่งที่ชนะที่ศาลถูกหัก spend × |สุทธิ| (ไม่ติดลบ) ฝั่งแพ้ไม่ถูกหัก แล้วคูณ r
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
      }
      const lastJob = st.occupation;
      st = nextLife(af);
      if (af.path === 'child' && st.familyOcc !== lastJob) occBad++;
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

// ฐานะชาติหน้าเฉลี่ย (ดัชนี 0–9) ตามระดับกรรมที่ศาล: บาป ≤ −0.2 · กลาง · บุญ ≥ 0.3 — ต้องเรียงขึ้นทั้งทางเป็นลูกและเกิดใหม่
console.log('\nฐานะชาติหน้าเฉลี่ย (0 = ยากไร้ · 9 = มั่งคั่ง) ตามกรรมที่ศาล   บาป   กลาง   บุญ');
for (const path of ['reborn', 'child']) {
  const cells = [0, 1, 2].map((b) => Object.values(out).reduce((s, r) => [s[0] + r.byX[path][b][0], s[1] + r.byX[path][b][1]], [0, 0]));
  const means = cells.map(([s, c]) => (c ? s / c : NaN));
  const ok = means[0] < means[1] && means[1] < means[2];
  console.log(`${path === 'child' ? 'เป็นลูก ' : 'เกิดใหม่'} ${means.map((m, b) => `${f(m)} (${cells[b][1]})`).join('  ')} → ${ok ? 'ผ่าน' : 'ตก'}`);
  if (!ok) fails.push(`ฐานะชาติหน้าทาง${path} ไม่เรียงตามกรรม`);
}

lens.sort((a, b) => a - b);
const q = (p) => lens[Math.min(lens.length - 1, Math.floor(p * lens.length))];
const check = (label, bad, extra = '') => {
  console.log(`${label}${extra} → ${bad ? `ตก ${bad}` : 'ผ่าน'}`);
  if (bad) fails.push(label);
};
console.log('');
check(`ช่วงที่ 7 ยาว 6–10 การ์ด (นับการ์ดตาย) ${afterlives.toLocaleString('en-US')} ครั้ง`, lenBad, ` · p5 ${q(0.05)} · p50 ${q(0.5)} · p95 ${q(0.95)} · สูงสุด ${lens.at(-1)}`);
check('เฉลยบัญชีบนการ์ดศาลทุกครั้ง', afterlives - reveals);
check('ค่าบัญชีไม่ออกนอกการ์ดศาล', leaks);
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
// ทุกชั้นออกได้จริง แล้วค่าเฉลี่ยที่ส่งต่อต้องไม่เพิ่มเมื่อห่างสายเลือดขึ้น (ลูก ≥ หลาน ≥ เหลน)
const tm = tiers.map((t) => ({ n: t.n, carry: t.carry / t.n, legacy: t.legacy / t.n, kin: t.kin / t.n }));
console.log(`\nชั้นในตระกูล          ${KIN_TIERS.map((t) => t.name.padEnd(8)).join(' ')}`);
for (const [k, label] of [['n', 'จำนวน'], ['carry', 'ส่งต่อบุญบาปเฉลี่ย'], ['legacy', 'มรดกเฉลี่ย (เท่ารายได้ปี)'], ['kin', 'ส่วนต่างจากบ้านเฉลี่ย']]) {
  console.log(`  ${label.padEnd(20)} ${tm.map((t) => (k === 'n' ? String(t.n) : f(t[k])).padEnd(8)).join(' ')}`);
}
check('เกิดเป็นลูก/หลาน/เหลนได้จริงทุกชั้น', tm.filter((t) => !t.n).length, ` ${tm.map((t) => t.n).join(' / ')}`);
const desc = (k) => tm.every((t, i) => !i || !(t[k] > tm[i - 1][k]));
check('ส่งต่อบุญบาป ลูก ≥ หลาน ≥ เหลน', desc('carry') ? 0 : 1);
check('มรดก ลูก ≥ หลาน ≥ เหลน', desc('legacy') ? 0 : 1);
check('ความสัมพันธ์/คอนเน็คชั่นจากบ้าน ลูก ≥ หลาน ≥ เหลน', desc('kin') ? 0 : 1);
if (!sceneIds.length) fails.push('ไม่มีฉากระหว่างชาติในเนื้อหา');
if (fails.length) {
  for (const x of fails) console.log(`  ✗ ${x}`);
  process.exitCode = 1;
}
