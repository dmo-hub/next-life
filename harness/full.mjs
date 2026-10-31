// harness เต็ม (B07 · ใบ 07 + ใบ 12): บอท 6 บุคลิก × (seed ตายตัว + seed สุ่ม) × n ชีวิต รันขนานใน worker
// + harness เดิมที่มีด่านของตัวเอง (merit · lineage · finance · titles · belief) เป็น process ข้าง ๆ — คำสั่งเดียวได้ทุกด่าน
// ด่าน (1) titles · (2) ไม่มีเหตุการณ์/ตัวเลือก/ธงตาย · (3a)(3b) อายุ · (4) จำนวนการ์ด · (5) merit · (6)(7) belief (หวยสายมู · สายมูไม่แตะอายุ)
// จังหวะบังคับ: เทียบกับ harness/baseline.json (seed ตายตัวชุดเดียวกัน) ชุดใหม่ต้องไม่แย่กว่า · --save เขียนผลรอบนี้เป็นฐานใหม่เมื่อไม่มีด่านตก (ตกแล้วยังจะเขียน = --force)
// --release = 100,000 ชีวิตต่อบอท (ก่อนปล่อย) · --seed2 N ระบุ seed สุ่มซ้ำได้ · --solo ไม่รัน harness ข้าง ๆ
import { Worker } from 'node:worker_threads';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { parse } from 'yaml';
import { loadContent } from '../src/node/load.mjs';
import { effectSites } from '../src/node/lint/util.mjs';
import { BOTS, isekaiBot } from './bots.mjs';
import { playLife, mixSeed, COURT_SCENES } from '../src/engine/index.mjs';
import { gate3a, gate3b, gate4, blame, compareBaseline, gate3bTol, splitDeadChoices, MIN_EXPECTED_PICKS } from './gates.mjs';

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const release = has('release');
const n = opt('n', release ? 100000 : 20000);
const seed = opt('seed', 1);
// seed สุ่มต้องพิมพ์ออกทุกรอบ — ตกที่ seed นี้แล้วต้องรันซ้ำได้
const seed2 = opt('seed2', Math.floor(Math.random() * 0x7fffffff));
const root = new URL('../', import.meta.url);
const BASELINE = new URL('harness/baseline.json', root);
const content = loadContent();
const f = (v, d = 2) => v.toFixed(d);
const fails = [];
const started = Date.now();
// ฐานใช้เทียบได้เมื่อ n และ seed ตายตัวตรงกันเท่านั้น
const stored = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;
const prev = stored?.n === n && stored?.seed === seed ? stored : null;

// ---- งาน worker: บอท × seed ----
const jobs = [];
for (const s of [seed, seed2]) for (const bot of Object.keys(BOTS)) jobs.push({ bot, seed: s, n });

// ---- harness ข้าง ๆ: อ่านคำสั่งจาก package.json ให้ตรงกับ npm run <ชื่อ> เสมอ ----
const scripts = JSON.parse(readFileSync(new URL('package.json', root), 'utf8')).scripts;
const SIDE = has('solo') ? [] : ['merit', 'lineage', 'finance', 'titles', 'belief'].filter((k) => scripts[k]);
const side = SIDE.map((name) => {
  const [, file, ...rest] = scripts[name].split(' ');
  return new Promise((done) => {
    const t0 = Date.now();
    const p = spawn(process.execPath, [file, ...rest], { cwd: root });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => done({ name, code, out, ms: Date.now() - t0 }));
  });
});

const slots = Math.max(1, availableParallelism() - SIDE.length);
const results = [];
let next = 0;
const runOne = () => {
  if (next >= jobs.length) return null;
  const job = jobs[next++];
  return new Promise((done, fail) => {
    const w = new Worker(new URL('./sweep-worker.mjs', import.meta.url), { workerData: job });
    w.once('message', (r) => results.push(r));
    w.once('error', fail);
    w.once('exit', () => done(runOne()));
  });
};
await Promise.all(Array.from({ length: Math.min(slots, jobs.length) }, runOne));
const sideOut = await Promise.all(side);
const wall = Date.now() - started;

const IDS = content.events.map((e) => e.id);
const main = results;
const of = (bot, s) => main.find((r) => r.bot === bot && r.seed === s);

console.log(`harness เต็ม · ${n.toLocaleString('en-US')} ชีวิตต่อบอท${release ? ' (โหมดก่อนปล่อย)' : ''} · seed ${seed} + seed สุ่ม ${seed2} · บอท ${Object.keys(BOTS).join(' · ')} · เหตุการณ์ ${content.events.length}`);

// ---- เวลา (ข้อ "ยังไม่รู้" ของใบ 07) ----
console.log(`\nเวลา: ทั้งหมด ${f(wall / 1000, 1)} วิ (worker ${slots} ช่องขนาน · harness ข้าง ๆ ${SIDE.length} ตัว)`);
for (const s of [seed, seed2]) console.log(`  seed ${s}: ${Object.keys(BOTS).map((b) => `${b} ${f(of(b, s).ms / 1000, 1)}`).join(' · ')} วิ`);
const perLife = main.reduce((a, r) => a + r.ms, 0) / main.reduce((a, r) => a + r.n, 0);
console.log(`  เฉลี่ย ${f(perLife, 2)} ms/ชีวิต (รวมระหว่างชาติ · วัดขณะรันขนาน ช้ากว่ารันเดี่ยวเพราะแย่งคอร์) ⇒ 20,000 ชีวิตต่อ worker ≈ ${f((perLife * 20000) / 1000, 0)} วิ`);
for (const x of sideOut) console.log(`  npm run ${x.name}: ${f(x.ms / 1000, 1)} วิ`);

// ---- ค่าแถบหลุดช่วง (ด่านพื้นฐานเดียวกับ npm run gate) ----
const statBad = main.reduce((a, r) => a + r.statBad, 0);
console.log(`\nค่าสถานะหลุด 0–100/เงินไม่ใช่ตัวเลข ทุกบอททุกการ์ด: ${statBad} → ${statBad ? 'ตก' : 'ผ่าน'}`);
if (statBad) fails.push('ค่าสถานะ');

// ---- ด่าน 2: ไม่มีเหตุการณ์/ตัวเลือก/ธงตาย (รวมทุกบอท ทั้งสอง seed) ----
const reg = parse(readFileSync(new URL('content/rules/flags.yaml', root), 'utf8'));
const FLAGS = [...Object.keys(reg.flags ?? {}), ...Object.keys(reg.prefixes ?? {})];
// ธงที่บอทหลักไม่มีทางตั้งโดยกติกา: isekai_call ตั้งเมื่อกดรับการ์ดชวนไปต่างโลกเท่านั้น และบอทที่ไม่ประกาศ isekai ปฏิเสธโดยไม่ดึงเลขสุ่ม
// (B68d · ชีวิตไทยของบอทหลักจึงเท่าเดิมทุกหลัก) ⇒ ใส่บอทสายต่างโลกในชุดหลักไม่ได้ ต้องพิสูจน์ว่าถึงได้ด้วยรอบเล็กของบอทสายต่างโลกแยก
// รอบเล็กหาไม่เจอ = ธงตายจริง ตกด่านตามเดิม
const SIDE_REACH = { isekai_call: isekaiBot };
const sideFlags = new Set();
for (const [flag, bot] of Object.entries(SIDE_REACH)) {
  for (let i = 0; i < 200 && !sideFlags.has(flag); i++) if (playLife(mixSeed(seed, 9500 + i), content, bot).state.flags?.[flag]) sideFlags.add(flag);
  console.log(`ธงที่บอทหลักไม่ตั้งโดยกติกา · ${flag}: บอทสายต่างโลก${sideFlags.has(flag) ? 'ถึง' : 'ไม่ถึง'}`);
}
// การ์ดที่ when.parent_flags.has ออกได้เฉพาะทายาทของรุ่นที่ถือธง — ชีวิตที่นี่เป็นรุ่นเดียว parentFlags ว่างเสมอ ⇒ ถึงไม่ได้โดยโครงสร้าง
// ด่านว่าใบพวกนี้ออกได้จริงอยู่ที่ npm run lineage · ธงที่มีแต่ใบพวกนี้ตั้งก็ถึงไม่ได้ด้วยเหตุเดียวกัน · ใบที่ผู้อ่านธงพ่อแม่แค่คูณโอกาสยังตัดสินที่นี่
const HEIR_ONLY = new Set(content.events.filter((e) => e.when?.parent_flags?.has?.length).map((e) => e.id));
const setters = new Map();
for (const e of content.events) for (const { node } of effectSites(e)) for (const fl of node.sets_flags ?? []) setters.set(fl, [...(setters.get(fl) ?? []), e.id]);
const HEIR_FLAGS = new Set([...setters].filter(([, ids]) => ids.every((id) => HEIR_ONLY.has(id))).map(([fl]) => fl));
console.log(`ข้ามที่ด่าน 2 (ตัดสินที่ npm run lineage): การ์ดที่ต้องมีธงพ่อแม่ ${HEIR_ONLY.size} ใบ · ธงที่มีแต่การ์ดพวกนั้นตั้ง ${HEIR_FLAGS.size} ตัว${HEIR_FLAGS.size ? ` (${[...HEIR_FLAGS].join(' · ')})` : ''}`);
// ใบศาล (B153) แกนแทรกเองตอนเฉียดตาย/ถูกเรียกตัว และบอทศาลเลือกแทน — ไม่จั่วจากกองและไม่ผ่านบอทหลัก ⇒ ด่าน 2 ตัดสินไม่ได้
// ด่านว่าออกครบลำดับและถูกเรียกตัวทุกชีวิตที่ถือธงอยู่ที่ npm run near · ธง cheat_death ข้ามเฉพาะตอนยังไม่มีการ์ดตั้ง (near ตั้งเอง) — มีการ์ดตั้งเมื่อไรกลับมาตัดสินที่นี่
const COURT_ONLY = new Set(content.events.filter((e) => COURT_SCENES.includes(e.scene)).map((e) => e.id));
const COURT_FLAGS = new Set(['cheat_death'].filter((fl) => !setters.has(fl)));
console.log(`ข้ามที่ด่าน 2 (ตัดสินที่ npm run near): ใบศาล ${COURT_ONLY.size} ใบ · ธงที่ยังไม่มีการ์ดตั้ง ${COURT_FLAGS.size} ตัว${COURT_FLAGS.size ? ` (${[...COURT_FLAGS].join(' · ')})` : ''}`);
// ของสายธุรกิจที่ถึงได้เฉพาะชีวิตที่ถือโฟกัสธุรกิจครบ 3 ปี (โฟกัสใบ 04 · เจ้าของเคาะ ข) — บอทหลักถือโฟกัสธุรกิจน้อยเกินจะถึงใน full
// พิสูจน์ว่าถึงได้จริงใน biz-reach: บังคับโฟกัสธุรกิจ 1,000 ชีวิต 18/18 ตัว > 0 · ไม่โฟกัส 0 ทุกตัว · id ที่ไม่มีในเนื้อหาแล้ว = ตก (กันรายการเน่า)
// FULL_FOCUS_DROP=<id> ถอดออกจากรายการชั่วคราว (ตัวควบคุม: ถอดแล้วด่าน 2 ต้องตก)
const FOCUS_ONLY_WHY = 'ต้องโฟกัสธุรกิจครบ 3 ปี · พิสูจน์ใน biz-reach: บังคับโฟกัส 18/18 > 0';
const FOCUS_ONLY_EVENTS = ['biz_grocery_rival_01', 'biz_credit_book_01', 'era_econ_gfc_cafe_01', 'mid_risky_chase_01', 'career_dream_crossroad_01', 'young_shop_rush_01'];
const FOCUS_ONLY_CHOICES = ['biz_grocery_01#open_grocery', 'biz_grocery_01#credit_book', 'debt_guarantor_ask_01#joint_shop', 'era_econ_gfc_adult_01#0', 'era_econ_oil2_farm_01#3', 'mid_crisis_01#quit_dream', 'mid_risky_bet_01#all_in', 'career_dream_01#quit_for_dream', 'young_shop_01#cafe', 'young_shop_01#chicken_rice', 'young_shop_01#partner', 'young_shop_01#chicken_rice_rite'];
const focusDrop = process.env.FULL_FOCUS_DROP;
const FOCUS_ONLY = new Set([...FOCUS_ONLY_EVENTS, ...FOCUS_ONLY_CHOICES].filter((id) => id !== focusDrop));
const choiceIds = new Set(content.events.flatMap((e) => (e.choices ?? []).map((c, i) => `${e.id}#${c.id ?? i}`)));
const focusRotten = [...FOCUS_ONLY_EVENTS.filter((id) => !content.events.some((e) => e.id === id)), ...FOCUS_ONLY_CHOICES.filter((id) => !choiceIds.has(id))];
console.log(`ข้ามที่ด่าน 2 (${FOCUS_ONLY_WHY}): เหตุการณ์ ${FOCUS_ONLY_EVENTS.length} · ตัวเลือก ${FOCUS_ONLY_CHOICES.length}${focusDrop ? ` · ตัวควบคุมถอด ${focusDrop}` : ''} — ${[...FOCUS_ONLY_EVENTS, ...FOCUS_ONLY_CHOICES].join(' · ')}`);
if (focusRotten.length) {
  console.log(`  ✗ รายการยกเว้นอ้าง id ที่ไม่มีในเนื้อหาแล้ว: ${focusRotten.join(' · ')}`);
  fails.push('ด่าน 2 รายการยกเว้นโฟกัส');
}
// ฐานเทียบรอบก่อนคิดจาก seed ตายตัวเท่านั้น — รวม seed สุ่มแล้วตัวที่รอดเพราะ seed สุ่มจะกลายเป็น "ตายใหม่" ในรอบหน้า
function deadOf(runs) {
  const fired = new Map(), picks = new Set(), flags = new Set();
  for (const r of runs) {
    for (const [k, v] of r.fired) fired.set(k, (fired.get(k) ?? 0) + v);
    for (const k of r.picks.keys()) picks.add(k);
    for (const x of r.flags) flags.add(x);
  }
  const explored = new Map();
  for (const r of runs) if (r.bot === 'สุ่ม') for (const [k, v] of r.fired) explored.set(k, (explored.get(k) ?? 0) + v);
  const { dead, thin } = splitDeadChoices(content.events.filter((e) => !COURT_ONLY.has(e.id)), fired, explored, picks);
  return {
    fired,
    events: content.events.filter((e) => !fired.has(e.id) && !HEIR_ONLY.has(e.id) && !COURT_ONLY.has(e.id) && !FOCUS_ONLY.has(e.id)).map((e) => e.id),
    choices: dead.filter((id) => !FOCUS_ONLY.has(id)),
    thinChoices: thin,
    flags: FLAGS.filter((x) => !flags.has(x) && !sideFlags.has(x) && !HEIR_FLAGS.has(x) && !COURT_FLAGS.has(x)),
  };
}
const { fired, events: deadEvents, choices: deadChoices, thinChoices, flags: deadFlags } = deadOf(main);
const lives = main.reduce((a, r) => a + r.n, 0);
console.log(`\nด่าน 2: ${lives.toLocaleString('en-US')} ชีวิต · ไม่มีใครถึง — เหตุการณ์ ${deadEvents.length} · ตัวเลือก ${deadChoices.length} · ธง ${deadFlags.length} → ${deadEvents.length + deadChoices.length + deadFlags.length ? 'ตก' : 'ผ่าน'}`);
for (const [label, xs] of [['เหตุการณ์', deadEvents], ['ตัวเลือก', deadChoices], ['ธง', deadFlags]]) if (xs.length) console.log(`  ✗ ${label}: ${xs.join(' · ')}`);
// จังหวะบังคับ (ใบ 07): ระหว่างทางยอมของตายที่ค้างอยู่ในฐานแล้ว (ตัวที่ตายใหม่ตกที่ขั้นเทียบรอบก่อน) · ก่อนปล่อยต้องไม่มีเลย
if (deadEvents.length + deadChoices.length + deadFlags.length && (release || !prev)) fails.push('ด่าน 2');
else if (deadEvents.length + deadChoices.length + deadFlags.length) console.log('  (ระหว่างทาง: ตัดสินเฉพาะตัวที่ตายใหม่เทียบฐาน ที่ขั้นเทียบรอบก่อน · --release ตัดสินทั้งหมด)');
// เกือบตาย: เจอน้อยกว่า 1 ใน 10,000 ชีวิต — ผ่านด่านแต่ seed ใหม่อาจไม่ถึง
const rare = content.events.filter((e) => fired.has(e.id) && fired.get(e.id) / lives < 1e-4).map((e) => `${e.id} (${fired.get(e.id)})`);
if (rare.length) console.log(`  ⚠ เหตุการณ์ที่เจอไม่ถึง 1 ใน 10,000 ชีวิต: ${rare.join(' · ')}`);
if (thinChoices.length) console.log(`  ⚠ ตัวเลือกที่ไม่มีใครเลือกแต่การ์ดขึ้นน้อยเกินตัดสิน (คาดยอดเลือก < ${MIN_EXPECTED_PICKS}): ${thinChoices.map((x) => `${x.id} (คาด ${f(x.expected, 1)})`).join(' · ')}`);

// ---- ด่าน 3a (ไม่ผ่านการสุ่ม) · 3b + 4 บอทสุ่ม ทั้งสอง seed ----
const g3a = gate3a(content.era);
// ผ่านพิมพ์บรรทัดสรุปบรรทัดเดียว · ตกพิมพ์ปี-เพศที่ห่างทุกบรรทัด
console.log((g3a.fail ? g3a.lines : g3a.lines.slice(-1)).join('\n'));
if (g3a.fail) fails.push('ด่าน 3a');
const judged = {};
for (const s of [seed, seed2]) {
  const r = of('สุ่ม', s);
  const g3b = gate3b(r.groups);
  const g4 = gate4(r.cardsOver60);
  judged[s] = { g3b, g4 };
  console.log(`\n[บอทสุ่ม · seed ${s}]${g3b.lines.join('\n')}`);
  for (const { key, diff } of g3b.failed) {
    const top = blame(r.lives.filter((l) => l[0] === key).map(([, age, d, , idx, ats]) => [age, d, idx, ats]), IDS, Math.sign(diff));
    console.log(`  ต้นเหตุที่น่าสงสัยของ ${key.replace('|', 's ')} (${diff > 0 ? 'อายุเกิน' : 'อายุขาด'}): ${top.map((x) => `${x.id} ${x.push >= 0 ? '+' : ''}${f(x.push)} ปี (${x.n} ชีวิต)`).join(' · ') || 'ไม่มีเหตุการณ์ใดเอียงชัด'}`);
  }
  if (g3b.fail) fails.push(`ด่าน 3b seed ${s}`);
  console.log(g4.line);
  if (g4.fail) {
    fails.push(`ด่าน 4 seed ${s}`);
    const top = blame(r.lives.filter((l) => l[3] !== null).map(([, age, , out, idx, ats]) => [age, out, idx, ats]), IDS, 1);
    console.log(`  ต้นเหตุที่น่าสงสัย (เจอแล้วการ์ดหลุดช่วงบ่อยขึ้น): ${top.map((x) => `${x.id} +${f(x.push * 100)}% (${x.n} ชีวิต)`).join(' · ') || 'ไม่มีเหตุการณ์ใดเอียงชัด'}`);
  }
}
// บอทอื่นพิมพ์ไว้ดู ไม่ตัดสิน — ด่าน 3b/4 นิยามกับบอทสุ่ม (ใบ 07) บุคลิกที่เลือกสุดทางตั้งใจให้อายุ/ความยาวต่างจากค่ากลาง
console.log('\nบอทอื่น (ไม่ตัดสิน): อายุเฉลี่ย · ด่าน 4 % ในช่วง');
for (const s of [seed, seed2]) console.log(`  seed ${s}: ${Object.keys(BOTS).map((b) => `${b} ${f(of(b, s).ageSum / n)} ปี ${f(gate4(of(b, s).cardsOver60).share * 100, 1)}%`).join(' · ')}`);

// ---- ด่านจาก harness ข้าง ๆ: (1) titles · (5) merit · (6)(7) belief · lineage · finance ----
const VERDICT = /ด่าน|→|ผ่าน|ตก/;
for (const x of sideOut) {
  const ok = x.code === 0;
  console.log(`\nnpm run ${x.name} → ${ok ? 'ผ่าน' : `ตก (exit ${x.code})`}`);
  const lines = x.out.split(/\r?\n/).filter((l) => has('verbose') || (VERDICT.test(l) && !l.startsWith('  ') && l.length < 220) || l.startsWith('✗'));
  for (const l of lines) console.log(`  ${l}`);
  if (!ok) fails.push(`npm run ${x.name}`);
}
if (!scripts.titles) console.log('\nด่าน 1 (แบบชีวิต/ฉายา ≥0.1%) → ไม่ตัดสิน: ยังไม่มี npm run titles ในสาขานี้ (B10 สาย C)');

// ---- ด่าน 5–7 ของใบ 12 บนเนื้อหาจริง ----
const vowSet = of('สุ่ม', seed).flags.has('vow_broken');
console.log(`\nด่าน 5 บนเนื้อหาจริง: vow_broken ${vowSet ? 'ตั้งได้' : 'ยังไม่มีใครตั้ง'} (บอทสุ่ม seed ${seed}) · ตัดสินจริงที่ npm run merit ซึ่งเติมเนื้อหาทดสอบ`);
// ด่าน 6–7 ตัดสินที่ npm run belief (ตัวควบคุมถอดสายมู + CI 95%) — ไม่รันซ้ำที่นี่
if (!scripts.belief) console.log('ด่าน 6–7 → ไม่ตัดสิน: ยังไม่มี npm run belief ในสาขานี้ (B09)');

// ---- รายงาน: ช่องเนื้อหาบาง · แฟนตาซีต่อชีวิต ----
const STAGES = ['เด็ก', 'วัยรุ่น', 'หนุ่มสาว', 'ทำงาน', 'กลางคน', 'ชรา'];
const CATS = ['study', 'work_money', 'family', 'health', 'belief', 'society'];
const THIN = 3;
const rnd = of('สุ่ม', seed);
console.log(`\nช่องเนื้อหา ช่วงวัย × หมวด: จำนวนใบในเนื้อหา / การ์ดที่ออกต่อ 100 ชีวิต (บอทสุ่ม seed ${seed}) · ✗ = น้อยกว่า ${THIN} ใบ`);
console.log(`${''.padEnd(9)}${CATS.map((c) => c.padStart(12)).join('')}`);
const thin = [];
for (const s of STAGES) {
  const row = CATS.map((c) => {
    const k = content.events.filter((e) => e.stage === s && e.category === c).length;
    const per = ((rnd.cells.get(`${s}|${c}`) ?? 0) / n) * 100;
    if (k < THIN) thin.push(`${s}×${c}`);
    return `${k < THIN ? '✗' : ' '}${k}/${f(per, 0)}`.padStart(12);
  });
  console.log(`${s.padEnd(9)}${row.join('')}`);
}
console.log(`ช่องบาง ${thin.length} ช่อง — ชุดเนื้อหาถัดไปเริ่มจากช่องเหล่านี้`);

// เป้า 5–8 ใบต่อชีวิต (MAP) นับการ์ดแนว B ในช่วงมีชีวิต ไม่นับระหว่างชาติ · หวยสายมูนับรวม
// เกินครึ่งของเป้าขั้นต่ำ = ยกให้เจ้าของเคาะ — เกณฑ์คงที่ ไม่ลอยตามจำนวนแฟนตาซีที่เนื้อหามีตอนนั้น
const FANTASY = [5, 8];
const NUMEN_WARN = FANTASY[0] / 2;
console.log(`\nแฟนตาซี/สายมูต่อชีวิต (เป้า ${FANTASY[0]}–${FANTASY[1]}):`);
for (const b of Object.keys(BOTS)) {
  const r = of(b, seed);
  let sum = 0, inBand = 0;
  for (const [k, c] of r.fantasy) {
    sum += k * c;
    if (k >= FANTASY[0] && k <= FANTASY[1]) inBand += c;
  }
  const mean = sum / n;
  const warn = mean < FANTASY[0] || mean > FANTASY[1] ? ' ⚠ นอกเป้า' : '';
  const numen = r.numen / n;
  const half = numen > NUMEN_WARN ? ` ⚠ หวยสายมูเกิน ${NUMEN_WARN} ใบ ยกให้เจ้าของเคาะ` : '';
  console.log(`  ${b.padEnd(10)} เฉลี่ย ${f(mean)} ใบ · ในเป้า ${f((inBand / n) * 100, 1)}% ของชีวิต · หวยสายมู ${f(numen)} ใบ${warn}${half}`);
}

// ---- จังหวะบังคับ: เทียบรอบก่อน (seed ตายตัวเท่านั้น — seed สุ่มเปลี่ยนทุกรอบ) ----
const fixedDead = deadOf(main.filter((r) => r.seed === seed));
const now = {
  n, seed,
  deadEvents: fixedDead.events, deadChoices: fixedDead.choices, deadFlags: fixedDead.flags,
  statBad,
  gate4Share: Number(f(judged[seed].g4.share, 4)),
  gate3bWorst: Number(f(judged[seed].g3b.worst, 3)),
  gate3bWorstSe: Number(f(judged[seed].g3b.worstSe, 3)),
  ageMean: Object.fromEntries(Object.keys(BOTS).map((b) => [b, Number(f(of(b, seed).ageSum / n, 3))])),
};
if (prev) {
  const worse = compareBaseline(prev, now);
  console.log(`\nเทียบรอบก่อน (${prev.at ?? '?'}): ${worse.length ? `แย่ลง ${worse.length} ข้อ → ตก` : 'ไม่แย่กว่า → ผ่าน'}`);
  for (const w of worse) console.log(`  ✗ ${w}`);
  // ตัวที่ไม่นับต้องเห็น — ไม่งั้นการ์ดหายากที่ตายจริงจะผ่านเงียบไปทุกรอบ
  const excused = fixedDead.thinChoices.filter((x) => !prev.deadChoices.includes(x.id));
  if (excused.length) console.log(`  ⚠ ตัวเลือกไม่มีใครเลือกแต่ไม่นับ (บอทสุ่มเจอการ์ดน้อย คาด < ${MIN_EXPECTED_PICKS}): ${excused.map((x) => `${x.id} (คาด ${f(x.expected, 1)})`).join(' · ')}`);
  console.log(`  3b ห่างสุด ${prev.gate3bWorst} → ${now.gate3bWorst} ปี · ยอมเพิ่ม ${f(gate3bTol(prev, now))} (SE ${prev.gate3bWorstSe ?? '-'} → ${now.gate3bWorstSe})`);
  const ages = Object.keys(now.ageMean).map((b) => `${b} ${prev.ageMean[b] ?? '?'}→${now.ageMean[b]}`).join(' · ');
  console.log(`  อายุเฉลี่ย: ${ages}`);
  if (worse.length) fails.push('เทียบรอบก่อน');
} else if (stored) console.log(`\nเทียบรอบก่อน → ข้าม: ฐานเก็บไว้ที่ n ${stored.n} seed ${stored.seed}`);
else console.log('\nเทียบรอบก่อน → ยังไม่มี harness/baseline.json · รันด้วย --save --force เพื่อเก็บรอบนี้เป็นฐาน');
// ด่านตก (รวมแย่กว่าฐาน) แล้วยังเขียนฐาน = ยอมรับผลที่แย่ลงเงียบ ๆ — ต้องใส่ --force ให้เห็นว่าตั้งใจ
if (has('save')) {
  if (fails.length && !has('force')) console.log(`  ไม่เขียน harness/baseline.json: ตก ${fails.length} ข้อ · ยอมรับผลรอบนี้เป็นฐานจริง = ใส่ --force เพิ่ม`);
  else {
    writeFileSync(BASELINE, `${JSON.stringify({ ...now, at: new Date().toISOString().slice(0, 10) }, null, 2)}\n`);
    console.log(`  เขียน harness/baseline.json แล้ว${fails.length ? ` (--force ทับทั้งที่ตก ${fails.length} ข้อ)` : ''}`);
  }
}

console.log(`\n${fails.length ? `ตก ${fails.length}: ${fails.join(' · ')}` : 'ผ่านทุกด่านที่ตัดสินได้'} · seed สุ่มรอบนี้ ${seed2} (รันซ้ำ: npm run full -- --seed2 ${seed2})`);
if (fails.length) process.exitCode = 1;
