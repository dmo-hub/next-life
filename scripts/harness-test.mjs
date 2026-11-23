// ทดสอบตัว harness เอง (ไม่ใช่เนื้อหา): ด่านต้องตกเมื่อควรตก · ตัวชี้ต้นเหตุคิดถูกบนตัวอย่างมือ · ตัวเทียบฐานจับของที่แย่ลง
// · บอทอ่านป้ายถูก กดเฉพาะตัวที่เปิด และเล่นซ้ำได้ผลเดิม — ใครแก้ harness/gates.mjs หรือ bots.mjs จนด่านผ่านง่ายเกิน ไฟล์นี้ตก
import { readFileSync } from "node:fs";
import { treePace, treePaceCtl, treeInvest, treeYearEnd, applyFamily, ageKin, spouseOf, spouseStatus, funeralWho, letterTo, lossOk, exPartnerOf, familyOf, lossText, becomePartner, parentSpouseOf, spouseOk, KIN_CUSTODY, DIVORCE_SPLIT, BOND_FLOOR, NOT_MINE } from '../src/engine/index.mjs';
import { playLife, levelValue, thaiEarn, goalNames, lifeTreeGoals, newLife, mixSeed, makeRng, openChoices, familyOk, lifeGateOpen, GATE_FLAG, OFFICE_GATE, moneyTight, sinPicks, DARK_GATE, nextLife, playAfterlife, whenOk, choose, monthlyIncome, snapshot, restore, repairLife, PAST_TALENT, picksAfter, CLASSES, focusYearEnd, focusOffers, dieMidYear, causeWords, nextCard, moneyValue, chooseSpend } from '../src/engine/index.mjs';
import { loadContent, loadEvents, loadSkillMap } from '../src/node/load.mjs';
import { gate3b, gate4, blame, compareBaseline, gate3bTol, GATE3B_Z, splitDeadChoices, MIN_EXPECTED_PICKS, MIN_LIVES, AGE_TOL, CARD_MIN, CARD_MAX } from '../harness/gates.mjs';
import { BOTS, readFx, random, withSpend, SPEND_WAY } from '../harness/bots.mjs';
import { kinGaps, kinDeadRefs, familyLockShort } from '../harness/kin.mjs';
import { cadetCard, chooseCadet } from '../src/engine/cadet.mjs';
import { newLedger } from '../src/engine/merit.mjs';

const fails = [];
const rows = [];
const check = (label, ok, detail = '') => {
  rows.push([label, `${ok ? 'ผ่าน' : 'ตก'}${detail ? ` · ${detail}` : ''}`]);
  if (!ok) fails.push(`${label}${detail ? ` (${detail})` : ''}`);
};
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const f2 = (v) => v.toFixed(2);

// blame: 40 คนเจอตอน 10 ตาย 20 (−10) · 40 คนเจอตอน 50 ตาย 70 (0) · 200 คนไม่เจอ ตาย 70 (0)
// คนเจอตอน 10 เทียบคนไม่เจอที่ยังอยู่ที่ 10 = −10 · คนเจอตอน 50 = 0 ⇒ เฉลี่ย −5 × 80/280 = −1.4286
{
  const L = [];
  for (let i = 0; i < 40; i++) L.push([20, -10, Int16Array.of(0), Uint8Array.of(10)]);
  for (let i = 0; i < 40; i++) L.push([70, 0, Int16Array.of(0), Uint8Array.of(50)]);
  for (let i = 0; i < 200; i++) L.push([70, 0, new Int16Array(), new Uint8Array()]);
  const [top] = blame(L, ['X'], -1);
  check('blame ตัวอย่างมือ = −1.4286', top && near(top.push, -10 / 7, 1e-4), top ? top.push.toFixed(4) : 'ไม่มีผล');
  check('blame ทิศตรงข้ามไม่คืนอะไร', blame(L, ['X'], 1).length === 0);
  // + 100 คนไม่เจอ ตาย 15 (−20): ที่อายุ 10 ฐานคนไม่เจอ = −6.67 · ที่อายุ 50 = 0
  // ⇒ (−3.33 + 0) / 2 × 80/380 = −0.3509 · ถ้าเทียบกับคนไม่เจอทั้งหมดไม่ดูอายุ ทิศจะพลิกเป็น +0.351
  for (let i = 0; i < 100; i++) L.push([15, -20, new Int16Array(), new Uint8Array()]);
  const [byAge] = blame(L, ['X'], -1);
  check('blame เทียบคนไม่เจอที่ยังอยู่ที่อายุเดียวกัน = −0.3509', byAge && near(byAge.push, -(10 / 3 / 2) * (80 / 380), 1e-4), byAge ? byAge.push.toFixed(4) : 'ไม่มีผล');
}

// ด่าน 4: สัดส่วนในช่วง CARD_MIN–CARD_MAX ต้อง ≥90%
{
  const mid = Math.round((CARD_MIN + CARD_MAX) / 2);
  const pass = [...Array(95).fill(mid), ...Array(5).fill(CARD_MIN - 1)];
  const fail = [...Array(85).fill(mid), ...Array(15).fill(CARD_MAX + 1)];
  check('ด่าน 4 ผ่านที่ 95%', !gate4(pass).fail);
  check('ด่าน 4 ตกที่ 85%', gate4(fail).fail);
}

// ด่าน 3b: กลุ่มที่ชีวิตพอตัดสินแล้วห่างเกิน ±AGE_TOL ต้องตก · กลุ่มเล็กไม่ตัดสิน
{
  const g = (diff, c) => new Map([['2500|ชาย', [(70 + diff) * c, 70 * c, 60 * c, c]]]);
  check('ด่าน 3b ตกเมื่อห่างเกิน', gate3b(g(AGE_TOL + 1, MIN_LIVES)).fail);
  check('ด่าน 3b ผ่านเมื่ออยู่ในกรอบ', !gate3b(g(AGE_TOL - 1, MIN_LIVES)).fail);
  check('ด่าน 3b กลุ่มเล็กไม่ตัดสิน', !gate3b(g(AGE_TOL * 3, MIN_LIVES - 1)).fail);
}

// ตัวเทียบฐาน: ของตายใหม่ · ด่าน 4 ลด · 3b ห่างขึ้น ต้องจับได้ · แกว่งในขอบไม่นับ
{
  const base = { deadEvents: ['a'], deadChoices: [], deadFlags: [], statBad: 0, gate4Share: 0.99, gate3bWorst: 1 };
  check('ฐานเดิม = ไม่แย่กว่า', compareBaseline(base, { ...base }).length === 0);
  check('ของตายใหม่ = แย่ลง', compareBaseline(base, { ...base, deadChoices: ['x#0'] }).length === 1);
  check('ของตายหายไป ≠ แย่ลง', compareBaseline(base, { ...base, deadEvents: [] }).length === 0);
  check('ด่าน 4 ลด 1 จุด = แย่ลง', compareBaseline(base, { ...base, gate4Share: 0.98 }).length === 1);
  check('ด่าน 4 แกว่ง 0.3 จุด ≠ แย่ลง', compareBaseline(base, { ...base, gate4Share: 0.987 }).length === 0);
  check('3b ห่างขึ้น 0.3 ปี = แย่ลง', compareBaseline(base, { ...base, gate3bWorst: 1.3 }).length === 1);
  check('ค่าแถบหลุดเพิ่ม = แย่ลง', compareBaseline(base, { ...base, statBad: 1 }).length === 1);
  // 3b ยอมตาม SE ของกลุ่มที่ห่างสุด: กลุ่ม ~900 ชีวิต (SE 0.74) ขยับ 0.76 ปี = noise · กลุ่มใหญ่ (SE 0.1) ขยับเท่ากัน = แย่ลง
  const se = (x) => ({ ...base, gate3bWorstSe: x });
  check('3b ขยับในช่วง noise ของกลุ่มเล็ก ≠ แย่ลง', compareBaseline(se(0.74), { ...se(0.74), gate3bWorst: 1.76 }).length === 0);
  check('3b ขยับเกิน noise ของกลุ่มใหญ่ = แย่ลง', compareBaseline(se(0.1), { ...se(0.1), gate3bWorst: 1.76 }).length === 1);
  check('3b ฐานไม่มี SE ใช้ SE รอบนี้', compareBaseline(base, { ...se(0.74), gate3bWorst: 1.76 }).length === 0);
  check('3b SE รวม = √(a²+b²)', near(gate3bTol(se(0.3), se(0.4)), GATE3B_Z * 0.5));
}

// 3b เก็บ SE ของกลุ่มที่ห่างสุดจากส่วนต่างรายชีวิต
{
  const c = MIN_LIVES;
  // ครึ่งหนึ่ง +12 อีกครึ่ง −8 ⇒ เฉลี่ย +2 · SD 10 · SE 10/√c
  const g = new Map([['2500|ชาย', [72 * c, 70 * c, 60 * c, c, (144 + 64) / 2 * c]]]);
  const { worst, worstSe } = gate3b(g);
  check('3b worstSe = SD/√n', near(worst, 2) && near(worstSe, 10 / Math.sqrt(c)), `${f2(worst)} · ${f2(worstSe)}`);
}

// ตัวเลือกตาย: บอทสุ่มเจอการ์ดพอแต่ไม่มีใครเลือก = ตาย · บอทสุ่มเจอน้อย = ⚠ ไม่ตัดสิน แม้บอทบุคลิกเจอบ่อย · เลือกแล้ว = ไม่ตาย
{
  const k = MIN_EXPECTED_PICKS;
  const ev = (id) => ({ id, choices: [{ id: 'a' }, { id: 'b' }, {}] });
  const fired = new Map([['busy', 100 * k], ['rare', 100 * k]]);
  const explored = new Map([['busy', 3 * k], ['rare', 3 * k - 1]]);
  const picks = new Set(['busy#0', 'rare#0']);
  const { dead, thin } = splitDeadChoices([ev('busy'), ev('rare'), ev('never')], fired, explored, picks);
  check('บอทสุ่มเจอการ์ดพอ ไม่มีใครเลือก = ตาย', dead.join() === 'busy#b,busy#2', dead.join());
  check('บอทสุ่มเจอน้อยกว่าเกณฑ์ = ⚠ ไม่ตาย', thin.map((x) => x.id).join() === 'rare#b,rare#2', thin.map((x) => x.id).join());
  check('การ์ดไม่เคยขึ้น ไม่นับที่ตัวเลือก', ![...dead, ...thin.map((x) => x.id)].some((x) => x.startsWith('never')));
}

// บอทอ่านป้ายที่ผู้เล่นเห็น
{
  const fx = readFx('ชีวิต ↑ · เงิน ↓ · ความสัมพันธ์ ↑ ระยะยาว · ลงทุน');
  check('readFx แตกป้ายถูก', fx.stat.health === 1 && fx.stat.money === -1 && fx.stat.relations === 2 && fx.tags.join() === 'ลงทุน', JSON.stringify(fx));
  const card = { choices: ['ก', 'ข', 'ค'], fx: ['เงิน ↑', 'ชีวิต ↑', 'ความสัมพันธ์ ↑'], locked: [null, null, null] };
  const h = { pending: { choices: [{}, {}, {}] } };
  check('สายเงินเลือกเงิน', BOTS['สายเงิน'](card, makeRng(1), h) === 0);
  check('สายสุขภาพเลือกสุขภาพ', BOTS['สายสุขภาพ'](card, makeRng(1), h) === 1);
  check('สายครอบครัวเลือกความสัมพันธ์', BOTS['สายครอบครัว'](card, makeRng(1), h) === 2);
  const locked = { ...card, locked: ['เงินไม่พอ', null, null] };
  check('สายเงินไม่กดตัวที่ล็อก', BOTS['สายเงิน'](locked, makeRng(1), h) !== 0);
}

// บอททุกตัวบนแกนจริง: กดเฉพาะตัวเลือกที่เปิด · seed เดิมได้ชีวิตเดิมทุกการ์ด
{
  const content = loadContent();
  for (const [name, bot] of Object.entries(BOTS)) {
    let closed = 0;
    const play = () => {
      const trace = [];
      for (let i = 0; i < 5; i++) {
        const pick = (card, rng, st) => {
          const idx = bot(card, rng, st);
          if (!openChoices(card).includes(idx)) closed++;
          trace.push(idx);
          return idx;
        };
        const { age, cards } = playLife(mixSeed(7, i), content, pick);
        trace.push(`|${age}/${cards}`);
      }
      return trace.join(',');
    };
    const a = play(), b = play();
    check(`บอท${name} เล่นซ้ำได้ผลเดิม + กดเฉพาะตัวที่เปิด`, a === b && closed === 0, closed ? `กดตัวปิด ${closed}` : '');
  }
}

// B138 ข้อความเอ่ยถึงคนในบ้าน: ไม่มีเงื่อนไข = ตก · เงื่อนไขพ่อแม่ไม่ระบุเพศไม่พอสำหรับคำว่าแม่ · ล็อกตัวเลือก/กั้นทั้งใบ = ผ่าน
// · คำซ้อน (แม่ค้า · ลูกค้า) และญาติคนอื่นไม่นับ · ตอนเล่น: แม่ตายแล้วตัวเลือกที่เปิดอยู่ต้องถูกจับ ตัวที่ล็อกไม่นับ
{
  const M = { role: 'parent', sex: 'หญิง', alive: true };
  const card = (extra = {}, c3 = {}) => ({ id: 'x', stage: 'เด็ก', text: 'ฝนตก', ...extra, choices: [{ text: 'ก' }, { text: 'ข' }, { text: 'ค' }, { text: 'ให้แม่แปรงฟันให้', ...c3 }] });
  check('B138 ตัวเลือกเอ่ยถึงแม่ไม่มีเงื่อนไข = ตก', kinGaps([card()]).length === 1);
  check('B138 เงื่อนไขพ่อแม่ไม่ระบุเพศไม่พอ', kinGaps([card({}, { requires: { family: [{ role: 'parent', alive: true }] } })]).length === 1);
  check('B138 ล็อกตัวเลือกด้วยแม่ = ผ่าน', kinGaps([card({}, { requires: { family: [M] } })]).length === 0);
  check('B138 กั้นทั้งใบด้วยแม่ = ผ่าน', kinGaps([card({ when: { family: [M] } })]).length === 0);
  check('B138 แม่ค้า · ลูกค้า · แม่เพื่อน ไม่นับ', kinGaps([card({ stage: 'ทำงาน', text: 'แม่ค้าเรียกลูกค้า แม่เพื่อนโทรมา' }, { text: 'ซื้อของ' })]).length === 0);
  check('B138 ลูกในการ์ดวัยทำงานไม่มีเงื่อนไข = ตก', kinGaps([card({ stage: 'ทำงาน', text: 'ลูกไม่สบายตอนดึก' }, { text: 'ซื้อของ' })]).length === 1);
  const two = card({}, { requires: { family: [M] } });
  two.choices[2] = { text: 'กอดแม่', requires: { family: [M] } };
  check('B138 ล็อก 2 ใน 4 ตัวเลือก = ตก · 1 ใน 4 = ผ่าน', familyLockShort([two]).length === 1 && familyLockShort([card({}, { requires: { family: [M] } })]).length === 0);
  const st = { parents: [{ sex: 'หญิง', alive: false }, { sex: 'ชาย', alive: true }], kin: [] };
  const ev = card();
  check('B138 แกน familyOk แยกพ่อแม่ตามเพศ', !familyOk(st, M) && familyOk(st, { role: 'parent', sex: 'ชาย', alive: true }) && familyOk(st, { role: 'parent', alive: true }));
  check('B138 ตอนเล่น: แม่ตายแล้วตัวเลือกยังเปิด = จับได้ · ล็อกอยู่ = ไม่นับ', kinDeadRefs({ locked: [null, null, null, null] }, ev, st).length === 1 && kinDeadRefs({ locked: [null, null, null, 'แม่ไม่อยู่แล้ว'] }, ev, st).length === 0);
}

// B159 ป้าย parentFrom: การ์ดที่ when.parent_flags.has ตรงธงที่ทายาทถือ = ป้าย [{flag, tier}] · ไม่ถือธง = การ์ดไม่ออกและไม่มีช่องบนใบไหนเลย
// หน้าจอเช็กแค่ว่ามีช่อง ⇒ ช่องว่าง [] ก็นับว่าพัง
{
  const base = loadContent();
  const src = base.events.find((e) => e.stage === 'วัยรุ่น' && e.type === 'A' && !e.when);
  // ตัดการ์ดจริงที่กั้นด้วย when.parent_flags ออก — pf_probe เป็นการ์ดเดียวที่ขึ้นป้าย (ใบที่มีแค่ตัวคูณไม่ขึ้นป้าย) ผลจึงไม่ขยับตามเนื้อหา
  const content = { ...base, events: [...base.events.filter((e) => !e.when?.parent_flags), { ...src, id: 'pf_probe', multipliers: undefined, weight: 1000, when: { parent_flags: { has: ['smoker'] } } }] };
  const pick = (card) => (card.locked ? card.locked.findIndex((x) => !x) : 0);
  const runWith = (cnt, seed, parentFlags) => {
    const seen = [];
    const p = newLife(seed, cnt);
    playLife(seed, cnt, pick, (c) => seen.push(c), newLife(seed, cnt, { birthYear: p.birthYear, sex: p.sex, region: { name: p.region, ses: p.ses }, cls: p.cls, bonus: {}, parentFlags }));
    return { probe: seen.filter((c) => c.id === 'pf_probe'), keyed: seen.filter((c) => 'parentFrom' in c) };
  };
  // จั่วจากกองสุ่มตามโอกาสต่อปี — เนื้อหาเปลี่ยนแล้วลำดับสุ่มของ seed เดียวอาจไม่จั่ว probe เลย ⇒ หา seed แรกที่ถือธงแล้ว probe ออก (ไม่เจอ = คืน seed 5 ให้เช็กตก)
  const SEEDS = Array.from({ length: 40 }, (_, i) => 5 + i);
  const findSeed = (cnt) => SEEDS.find((s) => runWith(cnt, s, { smoker: 1 }).probe.length > 0) ?? 5;
  const seed = findSeed(content);
  const run = (parentFlags) => runWith(content, seed, parentFlags);
  const none = run({}), smoker = run({ smoker: 1 }), other = run({ heavy_drinker: 1 });
  // ตัวควบคุม: probe ที่ต้องการธงที่ไม่มีใครถือ ⇒ ไม่มี seed ไหนใน 40 ตัวทำให้ probe ออก (ตัวหา seed ไม่เสกการ์ดขึ้นมาเอง)
  const dead = { ...content, events: content.events.map((e) => (e.id === 'pf_probe' ? { ...e, when: { parent_flags: { has: ['pf_nobody_holds'] } } } : e)) };
  check('B159 ตัวควบคุม: probe ต้องธงที่ไม่มีใครถือ ⇒ ไม่มี seed ไหนทำให้ออก', SEEDS.every((s) => runWith(dead, s, { smoker: 1 }).probe.length === 0));
  check('B159 ไม่มีธงพ่อแม่ = การ์ดอ่านธงไม่ออก · ไม่มีช่อง parentFrom', !none.probe.length && !none.keyed.length && !other.probe.length && !other.keyed.length);
  check('B159 ถือธงตรง = การ์ดออก ป้าย [{flag, tier}] เฉพาะใบนั้น', smoker.probe.length > 0 && smoker.keyed.length === smoker.probe.length && JSON.stringify(smoker.probe[0].parentFrom) === '[{"flag":"smoker","tier":1}]');
}

// เป้าชีวิต (life-goal ใบ 02 · ย้ายมาผูกต้นไม้ ft15): ปลดโหนดใหญ่ (b) หรือ keystone (k) ตัวแรกของแขนง = ได้ความสุข goal_joy ครั้งเดียวต่อแขนง · การ์ดตายเล่ารายการ · สกิลจาก skillMap.lifeGoal (id = แขนง)
{
  const base = loadContent();
  const tr = base.tree;
  const joy = levelValue(tr.goal_joy);
  const nodes = Object.entries(tr.nodes);
  const pick = (branch, sizes) => nodes.filter(([, d]) => d.branch === branch && sizes.includes(d.size)).map(([id]) => id);
  const mk = (done, content = base) => { const s = newLife(11, content); s.happiness = 40; s.tree = { cur: null, done: Object.fromEntries(done.map((id) => [id, 20])), yrs: {}, cards: {}, hist: [] }; return s; };
  const [m1, m2] = pick('money', ['b', 'k']);
  const [r1] = pick('rel', ['b', 'k']);
  const [m0] = pick('money', ['s']);
  check('lg02 ค่า goal_joy ใน tree.yaml = ระดับ 2 (+12)', tr.goal_joy === 2 && joy === 12, `${tr.goal_joy} · ${joy}`);
  const none = mk([m0]);
  lifeTreeGoals(none);
  check('lg02 ปลดแต่โหนดเล็ก (s) = ไม่มีรางวัล ไม่มีรายการ', !none.goalsDone && none.happiness === 40, `${none.goalsDone}`);
  const s = mk([m1]);
  lifeTreeGoals(s);
  check('lg02 ปลดโหนดใหญ่/keystone = ความสุข +12 จดแขนง+โหนด', s.happiness === 40 + joy && s.goalsDone.join() === 'money' && s.goalNode.money === m1, `${s.happiness} · ${s.goalsDone} · ${JSON.stringify(s.goalNode)}`);
  // ตัวควบคุม: เนื้อเดียวกันแต่ goal_joy = 0 ⇒ ไม่มีรางวัล ไม่มีรายการ
  const c0 = mk([m1], { ...base, tree: { ...tr, goal_joy: 0 } });
  lifeTreeGoals(c0);
  check('lg02 ตัวควบคุม goal_joy 0 = ไม่ได้รางวัล ไม่มีรายการ', c0.happiness === 40 && !c0.goalsDone, `${c0.happiness} · ${c0.goalsDone}`);
  s.tree.done[m2] = 21;
  lifeTreeGoals(s);
  check('lg02 โหนดใหญ่ตัวที่สองของแขนงเดิม = ไม่ได้รางวัลซ้ำ', s.happiness === 40 + joy && s.goalsDone.length === 1, `${s.happiness} · ${s.goalsDone}`);
  s.tree.done[r1] = 22;
  lifeTreeGoals(s);
  check('lg02 โหนดใหญ่ของอีกแขนง = ได้รางวัลอีกครั้ง · เล่าครบสองรายการ', s.happiness === 40 + 2 * joy && s.goalsDone.join() === 'money,rel' && goalNames(s).join() === [tr.nodes[m1].name, tr.nodes[r1].name].join(), `${s.happiness} · ${goalNames(s)}`);
  check('lg02 ไม่สำเร็จเลย = ไม่มีรายการบนตัว', !newLife(11, base).goalsDone);
}

// สกิลจากเป้าชีวิต (life-goal ใบ 03): skillMap.lifeGoal เทียบ id แขนงของต้นไม้ · thaiEarn ให้สกิลเมื่อ st.goalsDone มี id นั้น · ชื่อเป้าชุดเดียวกับการ์ดตายกับสมุด
{
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { pathToFileURL } = await import('node:url');
  const dir = mkdtempSync(join(tmpdir(), 'lg03-'));
  const mapOf = (body) => { const f = join(dir, `m${Math.random().toString(36).slice(2)}.yaml`); writeFileSync(f, body); return pathToFileURL(f).href; };
  const base = loadContent();
  const ok = loadSkillMap(mapOf('lifeGoal:\n  money: [appraise]\n  rel: [regen]\n'));
  check('lg03 skillMap.lifeGoal รับ id แขนงของต้นไม้', ok.lifeGoal.money?.[0] === 'appraise' && ok.lifeGoal.rel?.[0] === 'regen', JSON.stringify(ok.lifeGoal));
  let threw = '';
  try { loadSkillMap(mapOf('lifeGoal:\n  mid: [appraise]\n')); } catch (e) { threw = String(e.message); }
  check('lg03 โหนดกลาง (mid) ไม่ใช่แขนง ใน lifeGoal ตกด่านโหลด', /lifeGoal\.mid/.test(threw), threw.slice(0, 80));
  threw = '';
  try { loadSkillMap(mapOf('lifeGoal:\n  nope_goal: [appraise]\n')); } catch (e) { threw = String(e.message); }
  check('lg03 id ที่ไม่มีในทะเบียนใน lifeGoal ตกด่านโหลด', /lifeGoal\.nope_goal/.test(threw), threw.slice(0, 80));
  const mk = (goals) => { const s = newLife(11, { ...base, skillMap: ok }); if (goals) s.goalsDone = goals; return s; };
  const ids = (s) => thaiEarn(s).map((x) => x.id);
  check('lg03 เป้าสำเร็จ = ได้สกิลตามตาราง', ids(mk(['money'])).includes('appraise'), ids(mk(['money'])).join());
  const two = ids(mk(['money', 'rel']));
  check('lg03 สำเร็จสองอัน = ได้ทั้งสองสกิล', two.includes('appraise') && two.includes('regen'), two.join());
  check('lg03 ไม่สำเร็จเลย = ไม่ได้สกิลจากเป้า', !ids(mk()).includes('appraise') && !ids(mk()).includes('regen'), ids(mk()).join());
  check('lg03 เป้าที่ตารางไม่ให้สกิล = ไม่ได้ ไม่ตก', ids(mk(['know'])).every((x) => x !== 'appraise' && x !== 'regen'));
  const old = goalNames(mk(['study_hard']));
  check('lg03 เซฟเก่า (id ต้นสายโฟกัสเดิม) ไม่ตก · ข้ามชื่อเป้าที่ไม่มีโหนดรองรับ', old.length === 0, old.join());
  check('lg03 ไม่มีรายการ = ชื่อว่าง', goalNames(mk()).length === 0);
  // ตารางจริง (เจ้าของเคาะ): ทุกเป้ามีสกิล ≥1 และสกิลมีจริง — ทะเบียนตกด่านโหลดอยู่แล้ว ข้อนี้กันตารางว่างกลับมา
  const real = Object.keys(base.skillMap.lifeGoal ?? {});
  check('lg03 ตารางจริงครบ 5 แขนง', real.length === 5, real.join());
}

// ประตูเข้าสาย (โฟกัสใบ 04): ตัวเลือกติดป้าย gate ซ่อน (hidden + locked) จนประตูเปิด — ไม่ตัดออก เลขลำดับจึงตรงเนื้อหา · ประตูเปิดจากโฟกัสครบ chain_years · ทายาท · ธงชวน
// การ์ดชวนลงสมัครตอนยังไม่มีตำแหน่ง = ประตูการเมือง · บอทมีนโยบายโฟกัส ~1/3 ตามน้ำ
{
  const base = loadContent();
  const byId = new Map(base.events.map((e) => [e.id, e]));
  const gated = base.events.filter((e) => e.choices.some((c) => c.gate));
  const probe = { id: 'gate_probe', type: 'A', category: 'work_money', stage: 'ทำงาน', years: [2400, 2700], weight: 100000, text: 'probe', choices: [
    { id: 'open', text: 'เปิดกิจการ', gate: 'mo5', merit: [{ cat: 'neutral' }] }, ...[1, 2, 3].map((i) => ({ id: `n${i}`, text: `อื่น ${i}`, merit: [{ cat: 'neutral' }] })),
  ] };
  const content = { ...base, events: [...base.events, probe] };
  const visible = (c) => c.choices.filter((_, i) => !c.hidden?.[i]).length;
  const seen = (prep) => {
    const st = newLife(11, content);
    prep(st);
    let n = null;
    playLife(11, content, (card) => (card.id === 'gate_probe' ? card.choices.length - 1 : random(card, makeRng(1))), (c) => { if (c.id === 'gate_probe') n = visible(c) + (c.hidden?.some((h, i) => h && !c.locked?.[i]) ? 100 : 0); }, st);
    return n;
  };
  check('ใบ 04 ประตูปิด = ตัวเลือกติดประตูไม่ขึ้น (การ์ดยังออก 3 ตัวเลือก)', seen(() => {}) === 3, `${seen(() => {})}`);
  check('ft15 focusYears ครบ chain_years ไม่เปิดประตูแล้ว (สะพานตัด · เซฟเก่าแปลงตอนโหลด)', seen((st) => (st.focusYears = { business: 3 })) === 3);
  check('ใบ 04 ทายาทรับประตูที่รุ่นก่อนเปิด = ขึ้นโดยไม่ต้องสะสมเอง', seen((st) => (st.gates = ['mo5'])) === 4);
  check('ใบ 04 ธงชวน gate:<โหนด> = ขึ้น', seen((st) => (st.flags[GATE_FLAG + 'mo5'] = true)) === 4);
  check('ใบ 10 ปลดโหนดประตู = ตัวเลือกขึ้น', seen((st) => { st.tree = { done: { mo5: 30 }, yrs: {}, cards: {} }; }) === 4);
  check('ใบ 10 ปลดโหนดอื่น (ไม่ใช่โหนดประตู) = ยังซ่อน', seen((st) => { st.tree = { done: { mo3: 30 }, yrs: {}, cards: {} }; }) === 3);
  check('ใบ 10 ล้างโหนดประตูแล้ว = ประตูปิดอีก', seen((st) => { st.tree = { done: {}, gone: { mo5: 30 }, yrs: {}, cards: {} }; }) === 3);
  check('ft15 st.gates/ธง ชื่อโฟกัสเดิมที่ไม่ผ่านการแปลงตอนโหลด = ไม่เปิดประตู (ชื่อเดิมไม่ใช่รหัสโหนดแล้ว)', seen((st) => { st.gates = ['business']; }) === 3 && seen((st) => (st.flags[GATE_FLAG + 'business'] = true)) === 3);

  // ชีวิตจริงทั้งกอง: จำนวนตัวเลือกบนการ์ดที่ติดป้าย = ตามสถานะประตูตอนการ์ดออก · ชีวิตตามน้ำ/ประตูปิดไม่เคยเห็นตัวเลือกประตู
  const N = 1200;
  let wrong = 0, invites = 0, invitesClosed = 0, bizLives = 0, bizInvite = 0;
  for (let i = 0; i < N; i++) {
    const seed = mixSeed(404, i);
    const bot = BOTS[Object.keys(BOTS)[i % 6]];
    let st0 = null, invited = false;
    const { state: st } = playLife(seed, base, bot, (c, s) => {
      st0 = s;
      const ev = c.kind === 'event' && byId.get(c.id);
      if (ev && ev.choices.some((x) => x.gate)) {
        // ตัวเลือกครบตามเนื้อหา (ลำดับไม่เลื่อน) · ซ่อน = ล็อกด้วยเสมอ · ซ่อนตรงสถานะประตู
        const shut = ev.choices.map((x) => !!x.gate && ![x.gate].flat().some((id) => lifeGateOpen(s, id)));
        if (c.choices.length !== ev.choices.length || shut.some((h, k) => h !== !!c.hidden?.[k] || (h && !c.locked?.[k]))) wrong++;
      }
      if (/^office_/.test(c.id ?? '') && !s.office) { invites++; if (!lifeGateOpen(s, OFFICE_GATE)) invitesClosed++; }
      if (c.id === 'biz_politics_invite_01') invited = true;
    });
    if (st.flags.own_business && !(st.tree?.done?.r5 !== undefined)) { bizLives++; if (invited) bizInvite++; }
  }
  check('ใบ 04 ตัวเลือกบนการ์ดติดป้าย: ครบตามเนื้อหา · ซ่อน+ล็อกตรงสถานะประตู (ทั้งกอง)', wrong === 0, `ไม่ตรง ${wrong}`);
  check('ใบ 04 การ์ดชวนลงสมัครออกเฉพาะประตูการเมืองเปิด', invitesClosed === 0 && invites > 0, `ชวน ${invites} · ประตูปิดแต่ออก ${invitesClosed}`);
  check('ใบ 04 นักธุรกิจที่ไม่โฟกัสการเมืองถูกชวนลงการเมือง > 0', bizInvite > 0, `${bizInvite}/${bizLives}`);
}

// ใบ 05a: อาชีพต่างโลกนับปีเต็มด้วยกติกากลาง — สคริปต์บังคับโฟกัสทีละตา ไม่ใช้บอท
{
  const I = await import('../src/engine/isekai.mjs');
  const base = loadContent();
  // plan = [[โฟกัส, ตา], ...] นับตาตั้งแต่ตาที่เปลี่ยนเข้า (ตานั้นไม่นับปีเต็ม) · โฟกัสยังไม่เปิดในวัยนี้ = พักผ่อนรอ ไม่นับตา
  // เหตุการณ์กดตัวเลือกแรก · การ์ดเตือนกดฝืนต่อ ⇒ โฟกัสไม่ถูกเปลี่ยนนอกแผน
  // ใบทางแยก (06c-1): opt.seen เก็บใบที่ผ่าน · opt.go = เลือกแคว้นแรก (ไม่ส่ง = อยู่ที่เดิม) · opt.legacy = ชาติเก่ามีบทบาท
  const planned = (seed, plan, opt = {}) => {
    const isk = I.startIsekai({ seed, legacy: !!opt.legacy });
    let seg = 0, left = plan[0][1];
    const want = () => plan[seg][0];
    const hold = (c) => I.chooseIsekai(isk, isk.focusOffers.includes(want()) ? isk.focusOffers.indexOf(want()) : isk.focusOffers.indexOf('rest'));
    for (let g = 0; g < 3000 && seg < plan.length; g++) {
      const c = I.nextIsekaiCard(isk);
      if (c.step === 'end') return null;
      if (c.step === 'move') {
        opt.seen?.push(c);
        I.chooseIsekai(isk, opt.go ? 0 : c.choices.length - 1);
      } else if (c.step === 'world' || c.step === 'skill' || c.step === 'event') I.chooseIsekai(isk, 0);
      else if (c.step === 'warn') I.chooseIsekai(isk, 1);
      else if (c.step === 'focus') hold(c);
      else if (c.step === 'tick') {
        if (c.years !== 1) return null;
        if (isk.focus === want() && --left === 0 && ++seg < plan.length) left = plan[seg][1];
        if (seg < plan.length && isk.focus !== want()) hold(c);
      }
    }
    return isk;
  };
  // ชาติแรกที่รอดครบแผน (สคริปต์ไม่หนีความตาย) — หาไม่เจอใน 50 seed = โยนให้ด่านพัง (ข้อ "ไม่ได้อาชีพ" จะผ่านลอย ๆ ไม่ได้)
  const run = (plan) => {
    for (let s = 1; s <= 50; s++) {
      const isk = planned(s, plan);
      if (isk) return isk.careers ?? [];
    }
    throw new Error(`ใบ 05a ไม่มีชาติรอดครบแผน ${JSON.stringify(plan)}`);
  };
  const has = (plan, c) => run(plan).includes(c);
  check('ใบ 05a ปีอาชีพต่างโลก = ค่าของโลกต่างโลกเอง (จำนวนเต็ม ≥ 1)', Number.isInteger(I.ISEKAI_CAREER_T.years) && I.ISEKAI_CAREER_T.years >= 1, `${I.ISEKAI_CAREER_T.years}`);
  check('ใบ 05a ปีที่เปลี่ยน + 2 ปีเต็ม = ยังไม่ได้อาชีพ', !has([['sword', 3]], 'swordsman'), run([['sword', 3]]).join(' · '));
  check('ใบ 05a ปีที่เปลี่ยน + 3 ปีเต็ม = นักดาบ', has([['sword', 4]], 'swordsman'));
  check('ใบ 05a สะสมไม่ติดกันครบ 3 = นักดาบ', has([['sword', 3], ['rest', 2], ['sword', 2]], 'swordsman'));
  check('ใบ 05a สลับไปกลับแต่ปีเต็มไม่ครบ = ยังไม่ได้', !has([['sword', 2], ['rest', 2], ['sword', 2]], 'swordsman'));
  const five = [['magic', 'mage'], ['work', 'merchant'], ['explore', 'adventurer'], ['alms', 'priest']];
  check('ใบ 05a อาชีพอื่นครบ 3 ปีเต็มได้ทุกตัว', five.every(([f, c]) => has([[f, 4]], c)), five.filter(([f, c]) => !has([[f, 4]], c)).map(([, c]) => c).join(' · ') || 'ครบ');
  check('ใบ 05a ต้นทางรวมกัน (ทำงาน 2 + เดินทาง 2 ไม่ใช่สายเดียวกัน) ไม่ได้', !has([['work', 3], ['roam', 3]], 'merchant') && !has([['work', 3], ['roam', 3]], 'adventurer'));
  // ตัวควบคุมฝั่งตก: เกณฑ์ปี ∞ ⇒ ไม่มีใครได้อาชีพ (ด่านข้างบนจับได้)
  const keep = I.ISEKAI_CAREER_T.years;
  I.ISEKAI_CAREER_T.years = Infinity;
  const inf = run([['sword', 20]]);
  I.ISEKAI_CAREER_T.years = keep;
  check('ใบ 05a ตัวควบคุม: เกณฑ์ ∞ = 0 อาชีพ', inf.length === 0, inf.join(' · '));

  const C = await import('../src/engine/continent.mjs');
  // ใบ 06c-1 ย้ายแคว้น: ใบทางแยกมาหลังตาที่สำรวจครบปีเต็ม ⇒ ดูการ์ดต่อจนถึงใบตาถัดไป · แผนนับตาที่เปลี่ยนเข้าด้วย (ปีเต็ม = ตา − 1)
  const moved = (plan, opt = {}) => {
    for (let s = 1; s <= 50; s++) {
      const seen = [];
      const isk = planned(s, plan, { ...opt, seen });
      if (!isk) continue;
      for (let g = 0; g < 10; g++) {
        const c = I.nextIsekaiCard(isk);
        if (c.step === 'tick' || c.step === 'end') break;
        if (c.step === 'move') {
          seen.push(c);
          I.chooseIsekai(isk, opt.go ? 0 : c.choices.length - 1);
        } else I.chooseIsekai(isk, c.step === 'warn' ? 1 : 0);
      }
      return { isk, seen };
    }
    throw new Error(`ใบ 06c-1 ไม่มีชาติรอดครบแผน ${JSON.stringify(plan)}`);
  };
  const M = I.CONT_MOVE;
  const one = moved([[M.focus, M.years]]);
  check(`ใบ 06c-1 สำรวจ ${M.years - 1} ปีเต็ม = ยังไม่มีทางแยก`, one.seen.length === 0, `${one.seen.length} ใบ`);
  const two = moved([[M.focus, M.years + 1]]);
  const card = two.seen[0];
  check(`ใบ 06c-1 สำรวจ ${M.years} ปีเต็ม = ใบทางแยก 1 ใบ · แคว้นติดกัน ≤ ${M.offers} + อยู่ที่เดิม`, two.seen.length === 1 && card.choices.length >= 2 && card.choices.length <= M.offers + 1 && !two.isk.moves, `${two.seen.length} ใบ · ${card?.choices.join(' / ')}`);
  const born = two.isk.region;
  const go = moved([[M.focus, M.years + 1]], { go: true });
  const m = go.isk.moves?.[0];
  check('ใบ 06c-1 เลือกแคว้น = ย้ายไปแคว้นติดกัน · หน้าต่างสถานะเห็นแคว้นใหม่', !!m && m.from === born && C.contNeighbors(born).includes(m.to) && go.isk.region === m.to && I.isekaiStatus(go.isk).world.endsWith(C.CONT_REGIONS[m.to].name), JSON.stringify(m ?? null));
  // ไม่ย้าย = นับใหม่: สำรวจต่ออีก years − 1 ปีเต็มยังไม่มาซ้ำ · ครบ years ปีเต็มมาอีกใบ
  const stayShort = moved([[M.focus, M.years + 1], [M.focus, M.years - 1]]);
  const stayFull = moved([[M.focus, M.years + 1], [M.focus, M.years]]);
  check('ใบ 06c-1 อยู่ที่เดิม = ตัวนับเริ่มใหม่ (ไม่ยื่นซ้ำทุกปี)', stayShort.seen.length === 1 && stayFull.seen.length === 2, `${stayShort.seen.length} · ${stayFull.seen.length} ใบ`);
  const rest = moved([['rest', M.years + 6]]);
  check('ใบ 06c-1 ไม่สำรวจ = ไม่มีใบทางแยก', rest.seen.length === 0, `${rest.seen.length} ใบ`);
  const old = moved([[M.focus, M.years + 6]], { legacy: true });
  check('ใบ 06c-1 ชาติเก่า (มีบทบาท) ไม่มีใบทางแยก', !!old.isk.role && old.seen.length === 0, `${old.seen.length} ใบ`);
  // ตัวควบคุมฝั่งตก: เกณฑ์ปี ∞ ⇒ ไม่มีใบทางแยก (ด่าน 2 ปีเต็มข้างบนจับได้)
  const keepM = M.years;
  M.years = Infinity;
  const never = moved([[M.focus, keepM + 6]]);
  M.years = keepM;
  check('ใบ 06c-1 ตัวควบคุม: เกณฑ์ ∞ = 0 ใบทางแยก', never.seen.length === 0, `${never.seen.length} ใบ`);

  // ใบ 06c-2 กองทวีป: ด่าน contDeckWrong (harness/continent.mjs · ตัวเดียวกับ harness/isekai) ต้องจับตัวกรองแกนที่เปิดทิ้ง
  // เล่นกดตัวเลือกแรกที่ไม่ล็อกทุกใบ (ทางแยก = ย้าย ⇒ แคว้นเปลี่ยนกลางชาติ) · ตัดสินด้วยแคว้นตอนที่การ์ดออก
  const { contDeckWrong } = await import('../harness/continent.mjs');
  const deckRun = (legacy = false, n = 400) => {
    let wrong = 0, seen = 0;
    for (let s = 1; s <= n; s++) {
      const isk = I.startIsekai({ seed: s, legacy });
      for (let g = 0; g < 400; g++) {
        const c = I.nextIsekaiCard(isk);
        if (c.step === 'end') break;
        const ev = c.step === 'event' && I.ISEKAI_EVENTS.find((e) => e.id === c.id);
        if (ev && (ev.regions || ev.dispute || ev.power)) {
          seen++;
          if (contDeckWrong(isk, ev, isk.region)) wrong++;
        }
        if (c.choices.length) I.chooseIsekai(isk, c.step === 'warn' ? 1 : Math.max(0, (c.locked ?? []).findIndex((x) => !x)));
      }
    }
    return { wrong, seen };
  };
  const deckReal = deckRun();
  check('ใบ 06c-2 กองทวีปมาถูกแคว้น/ชาติ', deckReal.seen > 0 && deckReal.wrong === 0, `เห็น ${deckReal.seen} · ผิดที่ ${deckReal.wrong}`);
  const deckOld = deckRun(true);
  check('ใบ 06c-2 ชาติเก่า (มีบทบาท) ไม่เห็นกองทวีป', deckOld.seen === 0, `${deckOld.seen} ใบ`);
  // ตัวควบคุมฝั่งตก: เปิดตัวกรองทีละกอง ⇒ การ์ดกองนั้นออกผิดที่ ด่านข้างบนต้องเห็น
  for (const k of Object.keys(I.CONT_DECK)) {
    const keepFit = I.CONT_DECK[k].fit;
    I.CONT_DECK[k].fit = () => true;
    const open = deckRun();
    I.CONT_DECK[k].fit = keepFit;
    check(`ใบ 06c-2 ตัวควบคุม: เปิดตัวกรอง ${k} ⇒ ผิดที่ > 0`, open.wrong > 0, `ผิดที่ ${open.wrong}`);
  }
}

// B41 ทายาทได้นิสัยเดียวกับพ่อแม่ ≤ 50% (ใบ: สืบทอดโอกาสเล็กน้อย ไม่ใช่ได้แน่) · นับเฉพาะทายาทที่พ่อแม่มีนิสัยและถึงอายุล็อก
// ตัวควบคุม heir_nature 0 (คืนใน ft15): ทายาทรับแต้มนิสัยพ่อแม่ตอนเกิด (heir.nature × heir_nature) · seed เดียวกัน ปิดแต้ม ⇒ ทายาทนิสัยเดียวกันลดลง
{
  const content = loadContent();
  const heirs = (n) => {
    let same = 0, all = 0;
    for (const bot of Object.values(BOTS)) {
      for (let i = 0; i < n; i++) {
        const seed = mixSeed(1, i * 7919);
        const { state: parent } = playLife(seed, content, bot);
        if (!parent.nature) continue;
        let seen;
        playLife(mixSeed(1, i * 7919 + 1), content, bot, (card) => {
          if (card.kind === 'result' && 'nature' in card) seen = card.nature ?? null;
        }, nextLife(playAfterlife(parent, bot)));
        if (seen === undefined) continue;
        all++;
        if (seen === parent.nature) same++;
      }
    }
    return { same, all, pct: all ? (same / all) * 100 : 0 };
  };
  const real = heirs(160);
  check('B41 ทายาทได้นิสัยเดียวกับพ่อแม่ ≤ 50%', real.all >= 50 && real.pct <= 50, `${real.same}/${real.all} = ${f2(real.pct)}%`);
  const keep = content.nature.heir_nature;
  content.nature.heir_nature = 0;
  const zero = heirs(160);
  content.nature.heir_nature = keep;
  check('B41 ตัวควบคุม: heir_nature 0 ⇒ ทายาทนิสัยเดียวกันลดลง', zero.all === real.all && zero.same < real.same, `${zero.same}/${zero.all} = ${f2(zero.pct)}% · จริง ${real.same}`);
}

// ใบ 06a: ด่านทวีปจับตัวสุ่ม/แผนที่ที่พังได้ (ตัวควบคุม) — ป้อนของพังเข้า contChecks ตรง ๆ ไม่แก้ข้อมูลจริง
{
  const { contChecks } = await import('../harness/continent.mjs');
  const C = await import('../src/engine/continent.mjs');
  const failed = (o, label) => contChecks({ n: 300, ...o }).some((r) => !r.ok && r.label.startsWith(label));
  const real = contChecks({ n: 3000 }).filter((r) => !r.ok);
  check('ใบ 06a ข้อมูลจริงผ่านทุกด่าน (n3000 · n300 ข้อพิพาท ±2 จุดแกว่งเกิน)', real.length === 0, real.map((r) => r.label).join(' · '));
  check('ใบ 06a ตัวควบคุม: เส้นทางหายหนึ่งทิศ → ด่านสมมาตรตก', failed({ near: (id) => (id === 'coralis' ? [] : C.contNeighbors(id)) }, 'แผนที่สมมาตร'));
  check('ใบ 06a ตัวควบคุม: ไม่มีมหาอำนาจ → ด่านขั้วอำนาจตก', failed({ nation: (s) => { const x = C.contNation(s); return { ...x, powers: { ...x.powers, major: undefined } }; } }, 'ขั้วอำนาจ'));
  check('ใบ 06a ตัวควบคุม: เผ่านอกรายการแคว้น → ด่านเกิดตก', failed({ birth: (rng) => ({ ...C.contBirth(rng), race: 'dragonkin' }) }, 'เกิดได้ทุกแคว้น'));
}

// ค่าซ้อนทับ (โลกซ้อนทับ ใบ 08): เกิดกลับหลังชาติต่างโลก +1 · ทริปกลับบ้าน +1 · ไม่ข้ามโลก/เริ่มตระกูลใหม่ = 0 และไม่มีช่องในสถานะ
{
  const E = await import('../src/engine/index.mjs');
  const content = loadContent();
  const fresh = newLife(mixSeed(1, 801), content);
  const o = {};
  E.overlapStep(o);
  E.overlapStep(o);
  check('ค่าซ้อนทับ: ตระกูลใหม่ = 0 ไม่มีช่อง · ขึ้นทีละ 1', E.overlapOf(fresh) === 0 && !('overlap' in fresh) && E.overlapOf(null) === 0 && o.overlap === 2);
  const P = (id) => E.PATHS.findIndex((p) => p.id === id);
  // ทางเกิด: ชาติไทยเลือก want · กลับจากต่างโลกเลือกเกิดใหม่โลกเดิม · การ์ดอื่นกดตัวเปิดตัวแรก
  const walk = (st, want) => E.playAfterlife(st, (card, rng, af) => (card.kind === 'path' ? (af.from ? P('reborn') : want) : Math.max(0, (card.locked ?? []).findIndex((x) => !x))));
  const { state } = playLife(mixSeed(1, 802), content, BOTS.สุ่ม);
  const stay = walk(state, P('reborn'));
  const away = walk(playLife(mixSeed(1, 802), content, BOTS.สุ่ม).state, P('isekai'));
  const back = E.nextLife(away);
  const backV = back.overlap;
  const again = walk(playLife(back.seed, content, BOTS.สุ่ม, null, back).state, P('isekai'));
  // รอบสอง: เข้าต่างโลกซ้ำหลังเคยออก +1 แล้วเกิดกลับอีก +1 ⇒ 1 + 2
  check('ค่าซ้อนทับ: เกิดกลับหลังชาติต่างโลก +1 ส่งต่อทายาท · เข้าต่างโลกซ้ำ +1 · เกิดในโลกปกติต่อกันไม่มีช่อง', !('overlap' in stay.heir) && !('overlap' in E.nextLife(stay)) && away.heir.overlap === 1 && backV === 1 && again.heir.overlap === 3, `${E.overlapOf(stay.heir)} · ${away.heir.overlap} · ${again.heir.overlap}`);
  const tripBot = Object.assign((card, rng, h) => (card.entry ? E.ENTRY.accept : BOTS.สุ่ม(card, rng, h)), { isekai: true, trip: (card, rng) => card.choices.map((_, k) => k).filter((k) => !card.locked?.[k])[0] });
  // ค่าที่ควรได้ = ทริปกลับบ้าน + ทริปที่เริ่มหลังเคยกลับบ้านแล้ว (เข้าต่างโลกซ้ำ) · ทริปหลงไม่ได้กลับ
  const want = (trips) => trips.reduce((a, t) => ({ v: a.v + (a.left ? 1 : 0) + (t.home ? 1 : 0), left: a.left || !!t.home }), { v: 0, left: false }).v;
  let tHome = null, tLost = null, tAgain = null;
  for (let i = 0; i < 300 && !(tHome && tLost && tAgain); i++) {
    const r = playLife(mixSeed(1, 9000 + i), content, tripBot).state;
    const t = r.trips ?? [];
    const got = [want(t), E.overlapOf(r)];
    if (t.some((x) => x.home) && !tHome) tHome = got;
    if (r.tripLost && !tLost) tLost = got;
    if (t.findIndex((x) => x.home) >= 0 && t.findIndex((x) => x.home) < t.length - 1 && !tAgain) tAgain = got;
  }
  const same = (x) => !!x && x[0] === x[1];
  check('ค่าซ้อนทับ: ทริปกลับบ้าน +1 · ทริปหลงไม่นับ · ทริปหลังเคยกลับ (เข้าซ้ำ) +1', same(tHome) && same(tLost) && same(tAgain), `กลับ ${tHome ?? 'ไม่เจอ'} · หลง ${tLost ?? 'ไม่เจอ'} · เข้าซ้ำ ${tAgain ?? 'ไม่เจอ'}`);
}

// ขั้นค่าซ้อนทับ (ใบ 09): การ์ดอ่านขั้น ไม่อ่านค่าดิบ · ขั้น 1 = ค่า 1 · ขึ้นขั้นกลางชีวิตแล้วเงื่อนไขเห็นทันที · ตัวคูณยกกำลังตามขั้น
{
  const E = await import('../src/engine/index.mjs');
  const st = newLife(mixSeed(1, 803), loadContent());
  const rumor = { overlap_stage: [1, 2] };
  const before = [E.overlapStageOf(st), E.whenOk(st, rumor), E.poolMultiplier(st, { overlap_stage: 3 })];
  E.overlapStep(st);
  const after = [E.overlapStageOf(st), E.whenOk(st, rumor), E.poolMultiplier(st, { overlap_stage: 3 }), E.poolMultiplier(st, { overlap_stage: 0 })];
  check('ขั้นค่าซ้อนทับ: ค่า 0 = ขั้น 0 การ์ดขั้น 1 ไม่ออก ตัวคูณ ×1', before.join() === '0,false,1', before.join());
  check('ขั้นค่าซ้อนทับ: ขึ้นค่ากลางชีวิต → ขั้น 1 การ์ดออกได้ทันที ตัวคูณ ×3 · ตัวคูณ 0 ปิดการ์ด', after.join() === '1,true,3,0', after.join());
  st.overlap = 1e6;
  const edge = [0, 1, 2, 5, 6, 11, 12].map((v) => { st.overlap = v; return E.overlapStageOf(st); });
  st.overlap = 1e6;
  check('ขั้นค่าซ้อนทับ: เกณฑ์ใบ 16 [0,1,2,6,12] ขอบแต่ละขั้นถูก · ค่าสูงมาก = ขั้น 4', E.OVERLAP_STAGE_MIN.join() === '0,1,2,6,12' && edge.join() === '0,1,2,2,3,3,4' && E.overlapStageOf(st) === 4, `${edge.join()} · ${E.overlapStageOf(st)}`);
}

// ใบตามเกตที่ปล่อยไว้: นัดจากทาง pass ไม่ติดป้ายตารางซ้อน ⇒ ทอยตารางใหม่ไม่ล้าง ไม่กินโควตาซ้อน · ถึงคิวกินโควตาปี 1 · ขั้นไม่ใช่ 3–4 ตอนถึงคิว = ไม่ออก
{
  const E = await import('../src/engine/index.mjs');
  const content = loadContent();
  const BREACH = 'dungeon_breach_01';
  const gate = content.events.find((e) => e.id === 'overlap_dungeon_01');
  const pass = gate.choices.findIndex((c) => c.id === 'pass');
  const keep = [...E.OVERLAP_STAGE_MIN];
  [2, 3, 4].forEach((i) => { E.OVERLAP_STAGE_MIN[i] = i; });
  try {
    const gaps = new Set();
    let row;
    for (let i = 0; i < 40; i++) {
      const st = newLife(mixSeed(1, 4000 + i), content);
      st.flags.hunter = true;
      st.age = 30;
      st.overlap = 3;
      st.pending = gate;
      E.choose(st, pass);
      row = st.scheduled.find((x) => x.event === BREACH);
      gaps.add(row ? row.age - 30 : -1);
      if (i === 0) {
        E.overlapPlan(st, 1);
        check('ใบตามเกต: ทอยตารางซ้อนใหม่ไม่ล้างนัด · นัดไม่ติดป้ายโควตาซ้อน · id ไม่ขึ้น overlap_', st.scheduled.some((x) => x.event === BREACH) && !row?.overlap && !BREACH.startsWith(E.OVERLAP_PLAN.prefix));
      }
    }
    check('ใบตามเกต: pass นัด 1–2 ปี ออกครบทั้งสองค่า', [...gaps].sort().join() === '1,2', [...gaps].sort().join());
    const due = (overlap) => {
      const st = newLife(mixSeed(1, 4100), content);
      st.flags.hunter = true;
      st.age = 30;
      st.overlap = overlap;
      st.scheduled = [{ event: BREACH, age: 30, from: 29, pick: 'x' }];
      // การ์ดเปิดชีวิตค้างใน due จะออกก่อนและบังนัด
      st.due = [];
      st.advance = false;
      const owed = st.poolOwed ?? 0;
      const card = E.nextCard(st);
      return { id: card.id, owed: (st.poolOwed ?? 0) - owed, done: Boolean(st.done[BREACH]) };
    };
    const at = [1, 2, 3, 4].map(due);
    check('ใบตามเกต: ถึงคิวขั้น 3–4 ออก กินโควตาปี 1', at.slice(2).every((x) => x.id === BREACH && x.owed === 1), JSON.stringify(at.slice(2)));
    check('ใบตามเกต: ถึงคิวขั้น 1–2 ไม่ออก ไม่กินโควตา', at.slice(0, 2).every((x) => x.id !== BREACH && x.owed === 0 && !x.done), JSON.stringify(at.slice(0, 2)));
  } finally {
    keep.forEach((v, i) => { E.OVERLAP_STAGE_MIN[i] = v; });
  }
}

// การ์ดจากโค้ดมีครบ 4 ปุ่ม และปุ่มที่เติมต่อท้าย: การ์ดชวนข้ามโลกกดปุ่มใหม่แล้วชีวิตเดินต่อเหมือนปฏิเสธ
{
  const E = await import('../src/engine/index.mjs');
  const content = loadContent();
  const entries = Object.entries(E.ENTRY_EVENTS);
  check('ปุ่มการ์ดโค้ด: การ์ดชวนข้ามโลกทุกแบบมี 4 ปุ่ม', entries.every(([, e]) => e.choices.length === 4), entries.map(([k, e]) => `${k}:${e.choices.length}`).join(' '));
  const st = newLife(mixSeed(1, 4300), content);
  st.age = 20;
  const [id, e] = entries[0];
  st.pending = { entry: id, choices: e.choices.map((text) => ({ text })) };
  E.choose(st, 3);
  check('ปุ่มการ์ดโค้ด: ปุ่มที่เติมไม่พาข้ามโลก', !st.dead && !st.trip && !st.flags.isekai_call);
}

// ไอเทมติดตัว (B78): ห้องบอสให้ชิ้นแรกที่ยังไม่มี · ช่องชนิดตรงว่างก่อน แล้วเป้ · เป้เต็มขาย · ครบแล้วไม่ได้เพิ่ม · ชีวิต/เซฟที่ไม่เคยได้ของไม่มีช่อง
{
  const E = await import('../src/engine/index.mjs');
  const content = loadContent();
  const byId = (id) => content.events.find((e) => e.id === id);
  // ตัดทางไม่ ok ออก ⇒ ผลแน่นอนโดยไม่แตะ rng ของเทส
  const sure = (ev) => ({ ...ev, choices: ev.choices.map((c) => ({ ...c, ...(c.outcomes && { outcomes: c.outcomes.filter((o) => o.ok) }) })) });
  const boss = sure(byId('dungeon_hunt_boss_01'));
  const out = byId('dungeon_pull_out_01');
  const keep = out.choices.findIndex((c) => c.id === 'bag_keep');
  const st = newLife(mixSeed(1, 2323), content);
  st.flags.hunter = true;
  st.age = 30;
  const empty = E.itemsOf(st);
  check('ไอเทม: ชีวิตที่ไม่เคยได้ของไม่มี state items · itemsOf ได้ 3 ช่องว่าง เป้ 0/3', !('items' in st) && Object.values(empty.wear).every((x) => x === null) && Object.keys(empty.wear).join() === 'charm,weapon,outfit' && empty.bag.length === 0 && empty.cap === 3);
  const keepStage = E.OVERLAP_STAGE_MIN[3];
  E.OVERLAP_STAGE_MIN[3] = 3;
  const hidden = E.itemsVisible(st);
  st.overlap = 3;
  const byStage = E.itemsVisible(st);
  st.overlap = 0;
  E.OVERLAP_STAGE_MIN[3] = keepStage;
  check('ไอเทม: ช่องไอเทมซ่อนเมื่อขั้นซ้อนทับ < 3 และไม่มีของ · ขั้น 3 โชว์ (ยืมเกณฑ์ขั้น 3 ชั่วคราว)', !hidden && byStage, `${hidden} → ${byStage}`);
  const texts = [];
  for (let i = 0; i < 5; i++) {
    st.health = 100;
    st.queue = [];
    st.pending = boss;
    E.choose(st, 0);
    texts.push(st.queue.find((x) => x.kind === 'result')?.text ?? '');
  }
  const it = st.items;
  check('ไอเทม: ได้ของชิ้นแรกแล้วช่องไอเทมโชว์ แม้ขั้นซ้อนทับ < 3', E.overlapStageOf(st) < 3 && E.itemsVisible(st));
  check('ไอเทม: บอส 4 รอบ → ตะกรุด/มีด/เสื้อกั๊กลงช่อง เขี้ยวเข้าเป้ (ช่องเครื่องรางเต็ม)', it.wear.charm === 'dg_takrut' && it.wear.weapon === 'dg_knife' && it.wear.outfit === 'dg_vest' && it.bag.join() === 'dg_fang', JSON.stringify(it));
  check('ไอเทม: การ์ดผลต่อท้ายชื่อของ+ช่อง · รอบที่ 5 ครบแล้วไม่ได้เพิ่ม', texts[0].includes('ได้ตะกรุดผลึกม่วง ใส่ช่องเครื่องราง') && texts[3].includes('ได้เขี้ยวบอสเลี่ยมทอง เก็บเข้าเป้') && !texts[4].includes(' · ได้'), texts.map((t) => t.slice(-30)).join(' | '));
  st.items.cap = 2;
  const money = st.money;
  const run = () => {
    st.queue = [];
    st.pending = out;
    E.choose(st, keep);
    return st.queue[0];
  };
  const a = run();
  const b = run();
  const sold = st.money - money - 2 * E.moneyValue(st, out.choices[keep].effects.money);
  check('ไอเทม: เป้ที่ทางออก → หน้าไม้เข้าเป้ (ช่องอาวุธเต็ม) · ปลอกแขนเจอเป้เต็มขายได้เงิน · เล่าเป็นการ์ดผลใบแรก', st.items.bag.join() === 'dg_fang,dg_crossbow' && a?.kind === 'result' && a.text.includes('เก็บเข้าเป้') && !!b?.text.includes('เป้เต็ม') && near(sold, E.moneyValue(st, content.items.list.dg_armband.sell), 1e-6), `${st.items.bag.join()} · ขายได้ ${sold.toFixed(0)}`);
  const old = E.restore(E.snapshot({ st: newLife(mixSeed(1, 2324), content) }, content), content).st;
  check('ไอเทม: เซฟก่อนมีระบบโหลดได้ ช่องว่าง', !!old && !('items' in old) && Object.values(E.itemsOf(old).wear).every((x) => x === null));
}

// ใบ B99a ประตูทางมืด: ใบ fixture dark_gate ในกองจริง · สายบาปที่จนต้องถูกชวน · ทุกครั้งที่ออกต้องเงินตึง + เลือกบาปเองถึงเกณฑ์
// ตัวควบคุม: ถอด dark_gate จากใบเดียวกัน ⇒ ต้องออกกับคนที่ประตูปิดด้วย ไม่งั้นข้อ "ทุกครั้งประตูเปิด" ผ่านเพราะใบไม่ออกเลย
{
  const base = loadContent();
  const dark = loadEvents('content-fixtures/good/').filter((e) => e.when?.dark_gate);
  // ไม่เปราะ (เจ้าของเคาะ 2026-11-06): เดิมสุ่มทุกชั้น ออกแค่ 0–3 ชีวิต เนื้อหาใหม่เลื่อนเลขสุ่มแล้วตกเป็น 0
  // ⇒ ใช้ชีวิตที่เกิดมาจน (4 ชั้นล่าง · เงินตึงจริง) และหนุนน้ำหนักใบ fixture ×100 ให้จั่วถึงตอนประตูเปิด (วัดแล้ว 7–12/150 ทุก salt)
  // ประตูยังเป็นตัวตัดสินเหมือนเดิม — ตัวควบคุมใช้น้ำหนักเดียวกัน
  const POOR = CLASSES.slice(0, 4);
  const seeds = [];
  for (let i = 0; seeds.length < 150; i++) if (POOR.includes(newLife(mixSeed(0xb99a, i), base).cls)) seeds.push(mixSeed(0xb99a, i));
  const run = (events, botName, n) => {
    const content = { ...base, events: [...base.events, ...events.map((e) => ({ ...e, weight: e.weight * 100 }))] };
    const ids = new Set(events.map((e) => e.id));
    let lives = 0, shown = 0, closed = 0;
    for (let i = 0; i < n; i++) {
      let hit = false;
      playLife(seeds[i], content, BOTS[botName], (card, st) => {
        if (card.kind !== 'event' || !ids.has(card.id)) return;
        shown++;
        hit = true;
        if (!(moneyTight(st) && sinPicks(st) >= DARK_GATE.picks)) closed++;
      });
      if (hit) lives++;
    }
    return { lives, shown, closed };
  };
  // ใบนี้ออกราว 1% ของชีวิตสายบาป ตัวอย่างเล็กได้ 0 เพราะ seed เลื่อนเมื่อกองเปลี่ยน
  const sin = run(dark, 'สายบาป', 600);
  const merit = run(dark, 'สายบุญ', 150);
  const open = run(dark.map((e) => ({ ...e, when: { ...e.when, dark_gate: undefined } })), 'สายบุญ', 150);
  check('ใบ B99a สายบาปจนถูกชวนทำผิด', sin.lives > 0, `${sin.lives}/150 ชีวิต`);
  check('ใบ B99a ทุกครั้งที่ใบออก ประตูเปิด', sin.closed + merit.closed === 0, `ออก ${sin.shown + merit.shown} · ประตูปิด ${sin.closed + merit.closed}`);
  check('ใบ B99a สายบุญถูกชวนน้อยกว่าสายบาปมาก', merit.lives * 5 <= sin.lives, `${merit.lives} vs ${sin.lives}`);
  check('ใบ B99a ตัวควบคุม: ถอดประตู ⇒ ออกกับคนที่ประตูปิด', open.closed > 0, `ประตูปิด ${open.closed}`);
}

// วงปรโลก (ใบ 107): ทางเป็นลูก/เกิดใหม่เข้าวง เล่นครบปีหรือชีวิตทิพย์หมด แล้วการ์ดส่งต่อ · ถูกเรียกตัวข้ามวง
// · เซฟกลางวงโหลดแล้วเดินต่อได้ผลเดิม · เซฟเก่า (steps ไม่มี loop) เล่นแบบเดิม · วงไม่แตะทายาท
{
  const E = await import('../src/engine/index.mjs');
  const { snapshot, restore } = await import('../src/engine/save.mjs');
  const content = loadContent();
  const P = (id) => E.PATHS.findIndex((p) => p.id === id);
  const first = (card) => Math.max(0, (card.locked ?? []).findIndex((x) => !x));
  const life = (k, tweak) => {
    const { state } = playLife(mixSeed(1, 1070 + k), content, BOTS.สุ่ม);
    tweak?.(state);
    return state;
  };
  // เดินระหว่างชาติด้วยมือ: old = ตัดขั้นวงแบบเซฟก่อนมีวง · stop = หยุดแล้วคืน af ค้างพร้อมการ์ดบนจอ
  const drive = (af, { stop, card: shown } = {}) => {
    const loop = [];
    let card = shown ?? E.nextAfterCard(af);
    for (;;) {
      if (card.loop) loop.push(card);
      if (stop?.(card, af)) return { af, card, loop };
      if (card.choices?.length) E.chooseAfter(af, card.kind === 'path' ? P('reborn') : first(card));
      if (card.done) return { af, card, loop };
      card = E.nextAfterCard(af);
    }
  };
  const begin = (st, old) => {
    const af = E.startAfterlife(st);
    if (old) af.steps = af.steps.filter((s) => s !== 'loop');
    return af;
  };
  const skip = (k, v) => (k === 'content' ? undefined : v);
  const heirOf = (af) => JSON.stringify(af.heir, skip);

  const a = drive(begin(life(0)));
  const l = a.af.loop;
  const years = a.loop.filter((c) => c.kind === 'scene');
  const start = years[0]?.loop;
  const want = E.LOOP.start[l?.realm] ?? {};
  check('วงปรโลก: ทางเกิดใหม่เข้าวง ปีละการ์ด · ปีทิพย์ = 3 + |สุทธิ|÷2 · จบแล้วการ์ดส่งต่อ', !!l && l.years === E.loopYears(a.af.verdict.net) && years.length === l.year && a.loop.at(-1).kind === 'loopEnd' && a.card.kind === 'carry', l ? `${l.realm} ${l.year}/${l.years} ปี · จบ ${l.end}` : 'ไม่เข้าวง');
  check('วงปรโลก: ค่าเริ่มตามภูมิ · ปัญญาธรรม/ผูกพัน = ครึ่งความรู้/ความสัมพันธ์ตอนตาย', !!start && start.health === want.health && start.happiness === want.happiness && start.knowledge === Math.round(a.af.st.knowledge * E.LOOP.inherit) && start.relations === Math.round(a.af.st.relations * E.LOOP.inherit), start ? `${start.health}/${start.happiness}/${start.knowledge}/${start.relations}` : '');

  // บาปหนัก = นรก 30 ปี ชีวิตทิพย์เริ่ม 30 ลดปีละ 2 ⇒ หมดก่อนครบ · ตัวควบคุม: ไม่ลดเอง + เริ่มเต็ม ⇒ อยู่ครบ (การ์ดบางใบหักชีวิตทิพย์เองด้วย)
  const heavy = (st) => { st.ledger.sin += 200; };
  const h = drive(begin(life(1, heavy))).af.loop;
  check('วงปรโลก: ชีวิตทิพย์หมดก่อนครบปี = ไปเกิดเร็วขึ้น', h?.realm === 'hell' && h.end === 'spent' && h.year < h.years, h ? `${h.realm} ${h.year}/${h.years}` : 'ไม่เข้าวง');
  const [drain, hp] = [E.LOOP.drain, E.LOOP.start.hell.health];
  Object.assign(E.LOOP, { drain: 0 });
  E.LOOP.start.hell.health = 100;
  const hc = drive(begin(life(1, heavy))).af.loop;
  Object.assign(E.LOOP, { drain });
  E.LOOP.start.hell.health = hp;
  check('วงปรโลก ตัวควบคุม: ไม่ลดเอง + เริ่มเต็ม ⇒ ด่านเห็นคนอยู่ครบ', hc?.end === 'served', hc ? `${hc.year}/${hc.years}` : '');

  const called = drive(begin(life(2, (st) => { st.flags.isekai_call = true; }))).af;
  check('วงปรโลก: ถูกเรียกตัว (isekai_call) ไม่เข้าวง', called.loop === null && called.isekaiLives.length > 0 && called.steps.indexOf('loop') < 0, `ทาง ${called.path}`);

  // ปุ่มผู้สืบสายเลือด (B76 · ทายาทอายุจริง) ข้ามวงเหมือนถูกเรียกตัว — หาชีวิตที่มีรายชื่อ แล้วกดปุ่มนั้นด้วย id คนแรก
  let blood = null;
  for (let k = 10; k < 2000 && !blood; k++) {
    const st = life(k);
    if (!E.heirCandidates(st).length) continue;
    const af = E.startAfterlife(st);
    for (let card = E.nextAfterCard(af); !card.done; card = E.nextAfterCard(af)) {
      if (card.kind === 'path') E.chooseAfter(af, P('blood'), card.heirs[0].id);
      else if (card.choices?.length) E.chooseAfter(af, first(card));
      if (card.loop) af.sawLoop = true;
    }
    blood = af;
  }
  check('วงปรโลก: ปุ่มผู้สืบสายเลือด (ทายาทอายุจริง) ไม่เข้าวง', blood?.path === 'blood' && blood.loop === null && !blood.sawLoop, blood ? `ทาง ${blood.path}` : 'หาชีวิตที่มีรายชื่อไม่เจอ');

  // วงไม่ดึงเลขสุ่มของปรโลก/ไม่แตะบัญชี ⇒ ทายาทเท่าการเล่นแบบไม่มีวงทุกไบต์
  const old = drive(begin(life(0), true));
  check('วงปรโลก: ทายาทเท่าการเล่นแบบไม่มีวง · เซฟเก่า (steps เดิม) ไม่เข้าวง', heirOf(old.af) === heirOf(a.af) && old.af.loop === null && old.loop.length === 0);

  // เซฟกลางวงปีที่ 3 → ภาพถ่าย → โหลด → เล่นต่อ ได้ทายาท/ปีเท่าเล่นรวด · เซฟเก่ากลางฉาก 6 ขั้นโหลดแล้วไม่เข้าวง
  const mid = drive(begin(life(0)), { stop: (c) => c.loop?.year === 3 && c.kind === 'scene' });
  const back = (x) => restore(snapshot({ st: x.af.st, af: x.af, card: x.card, ui: {} }, content), content);
  const r = back(mid);
  const done = drive(r.af, { card: r.card });
  check('วงปรโลก: เซฟกลางวง (ปีที่ 3) โหลดแล้วเล่นต่อได้ผลเดิม', mid.card.loop?.year === 3 && done.af.loop.year === l?.year && heirOf(done.af) === heirOf(a.af), `ปี ${done.af.loop?.year}/${l?.year}`);
  const oldMid = drive(begin(life(0), true), { stop: (c) => c.kind === 'path' });
  const ro = back(oldMid);
  const oldDone = drive(ro.af, { card: ro.card });
  check('วงปรโลก: เซฟเก่ากลางฉากระหว่างชาติโหลดแล้วเล่นแบบเดิมจนเกิด', oldDone.af.loop === null && oldDone.loop.length === 0 && heirOf(oldDone.af) === heirOf(a.af));
}

// ใบ 159 ความจำข้ามชาติ + พรสวรรค์ติดชาติ: ทุกชีวิตที่ 2 มีความจำครบช่อง · ชีวิตแรกไม่มีช่อง · เงื่อนไขการ์ดอ่านได้
// · พรสวรรค์วัดบนทายาทคนเดียวกันต่างแค่ความจำ (ตัวควบคุม: ไม่มีชาติก่อน · งานอื่น · ทำไม่นานพอ ต้องได้ 1 เท่าเดิม) · เซฟเก่าไม่มีช่องโหลดได้
{
  const content = loadContent();
  const bot = BOTS.สายบุญ;
  const KEYS = ['lives', 'province', 'job', 'jobYears', 'cause', 'realm', 'realms', 'jobs', 'treasures', 'wish', 'barami'];
  let first = 0, second = 0, full = 0, talent = 0, heir;
  const N = 60;
  for (let i = 0; i < N; i++) {
    const { state } = playLife(mixSeed(159, i), content, bot);
    if ('past' in state || 'talent' in state) first++;
    const af = playAfterlife(state, bot);
    heir ??= af.heir;
    const st2 = nextLife(af);
    if (st2.past) second++;
    if (st2.past && KEYS.every((k) => k in st2.past) && st2.past.province === state.province && st2.past.lives === 1) full++;
    if (st2.talent) talent++;
  }
  check('ใบ 159 ชีวิตแรกไม่มีความจำ/พรสวรรค์', first === 0, `${first}/${N}`);
  check('ใบ 159 ชีวิตที่ 2 มีความจำครบทุกช่อง', second === N && full === N, `มี ${second} · ครบ ${full}/${N}`);
  check('ใบ 159 พรสวรรค์เกิดในชีวิตที่ 2 บางส่วน', talent > 0, `${talent}/${N}`);
  const mk = (past) => newLife(heir.seed, content, { ...heir, past });
  const take = (st, job) => {
    st.age = 22;
    st.school = null;
    st.pending = { id: 'past_job_test', type: 'A', stage: 'ทำงาน', category: 'work', text: 'งาน', choices: [{ text: 'รับงาน', effects: { job } }] };
    choose(st, 0);
    return monthlyIncome(st);
  };
  const craft = { ...heir.past, job: 'craft', jobYears: PAST_TALENT.years };
  const base = take(mk(undefined), 'craft');
  const gift = take(mk(craft), 'craft');
  check('ใบ 159 ชาติก่อนเป็นช่างนาน ได้งานช่างรายได้เริ่ม ×1.1', near(gift / base, PAST_TALENT.mul, 1e-9), f2(gift / base));
  check('ใบ 159 ตัวควบคุม: งานอื่น ไม่มีพรสวรรค์', near(take(mk(craft), 'clerk') / take(mk(undefined), 'clerk'), 1), '');
  check('ใบ 159 ตัวควบคุม: ทำไม่นานพอ ไม่มีพรสวรรค์', near(take(mk({ ...craft, jobYears: PAST_TALENT.years - 1 }), 'craft') / base, 1), '');
  const s2 = mk(craft), s1 = newLife(mixSeed(159, 0), content);
  s2.province = craft.province;
  const ok = (st, w) => whenOk(st, { past_life: w });
  check('ใบ 159 เงื่อนไข past_life อ่านชาติก่อน', ok(s2, { any: true }) && ok(s2, { job: ['craft'], province: 'same', talent: true }) && !ok(s2, { job: ['farmer'] }) && !ok(s2, { any: false }));
  check('ใบ 159 เงื่อนไข past_life ชีวิตแรก', ok(s1, { any: false }) && !ok(s1, { any: true }) && !ok(s1, { realm: ['human'] }));
  // เซฟเก่า: ภาพถ่ายชีวิตที่ 2 ที่ถอดช่องความจำออก → โหลดแล้วได้ความจำจากผังตระกูล ไม่มีอาชีพ ไม่มีพรสวรรค์ · ชีวิตแรกยังไม่มีช่อง
  const old = (st) => {
    const raw = JSON.parse(snapshot(st, content));
    delete raw.root.past;
    delete raw.root.talent;
    const back = restore(JSON.stringify(raw), content);
    repairLife(back, null);
    return back;
  };
  const o2 = old(mk(craft)), o1 = old(s1);
  check('ใบ 159 เซฟเก่าชีวิตที่ 2 โหลดได้ มีความจำจากผังตระกูล', o2.past?.lives === heir.lineage.filter((l) => !l.isekai).length && o2.past.job === null && !o2.talent && KEYS.every((k) => k in o2.past), JSON.stringify(o2.past));
  check('ใบ 159 เซฟเก่าชีวิตแรกไม่มีช่องความจำ', !('past' in o1));
}

// ป้ายหมวดการ์ดผล (ui-redo 60): ทุกการ์ดผลทุกแหล่งมีป้ายในรายการ · หมวดกลาง ≤ ครึ่ง · ผลตัวเลือกพกเหตุการณ์ต้นทาง
// เซฟเก่า (การ์ดค้างไม่มีป้าย) โหลดได้ และจออ่านเป็นหมวดกลาง
{
  const E = await import('../src/engine/index.mjs');
  const content = loadContent();
  const n = {};
  let bad = 0, total = 0, noEv = 0, snap = null;
  const see = (c, st) => {
    if (c.kind !== 'result') return;
    total++;
    if (!E.RESULT_TAGS.includes(c.tag)) bad++;
    else n[c.tag] = (n[c.tag] ?? 0) + 1;
    // เสี่ยงของโฟกัสได้ทิศจากผลค่าด้วย แต่ไม่ได้มาจากการ์ดเลือก จึงไม่มีต้นทาง
    if (['good', 'bad', E.TAG_MID, 'loot'].includes(c.tag) && !c.focusRisk && !c.evId) noEv++;
    // เซฟแบบก่อนใบนี้: ลบป้ายจากภาพถ่ายทั้งก้อน — ถ่ายตอนยังมีการ์ดผลรอในคิว
    if (!snap && st?.queue?.some((x) => x.kind === 'result')) snap = JSON.stringify(JSON.parse(E.snapshot({ st }, content)), (k, v) => (k === 'tag' || k === 'evId' ? undefined : v));
  };
  for (let i = 0; i < 60; i++) {
    const { state } = playLife(mixSeed(60, i), content, BOTS.สุ่ม, see);
    playAfterlife(state, BOTS.สุ่ม, (c) => see(c));
  }
  const mid = n[E.TAG_MID] ?? 0;
  const top = Object.entries(n).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
  check('ป้ายหมวดการ์ดผล: ทุกใบมีป้ายในรายการ', total > 0 && bad === 0, `${total} ใบ · ไม่มีป้าย ${bad}`);
  check('ป้ายหมวดการ์ดผล: หมวดกลาง ≤ ครึ่ง', mid * 2 <= total, `กลาง ${mid}/${total} · ${top}`);
  check('ป้ายหมวดการ์ดผล: ผลตัวเลือกพก evId', noEv === 0, `ขาด ${noEv}`);
  check('ป้ายหมวดการ์ดผล: ทิศนับเฉพาะค่าที่ไม่ซ่อน', E.fxTag({ health: -2, network: 3 }) === 'bad' && E.fxTag({ health: -2 }, ['health']) === E.TAG_MID && E.fxTag({ happiness: 1, money: -3 }) === 'good');
  let oldOk = false, oldDetail = 'ไม่มีชีวิตที่มีการ์ดผลค้างคิว';
  if (snap) {
    const back = E.restore(snap, content).st;
    const held = back.queue.filter((x) => x.kind === 'result');
    const { age } = playLife(back.seed, content, BOTS.สุ่ม, null, back);
    oldOk = held.length > 0 && held.every((x) => x.tag === undefined && E.resultTag(x) === E.TAG_MID) && age > 0;
    oldDetail = `ค้าง ${held.length} ใบ · เล่นต่อจบอายุ ${age}`;
  }
  check('ป้ายหมวดการ์ดผล: เซฟเก่าโหลดได้ การ์ดค้างตกหมวดกลาง', oldOk, oldDetail);
}

// ใบ 133 การ์ดบรรยากาศ (ambient): เลือกแล้วต้องไม่เข้าแกนแบบชีวิต (picksAfter) · ชีวิตเดียวกันเล่นทั้งสองชุด
// ตัวควบคุม: ถอด ambient ⇒ ตัวเลือกของการ์ดชุดเดียวกันต้องโผล่ใน picksAfter ไม่งั้นข้อแรกผ่านเพราะการ์ดไม่ออก
{
  const base = loadContent();
  const ids = new Set(base.events.filter((e) => e.ambient).map((e) => e.id));
  const bare = { ...base, events: base.events.map((e) => (e.ambient ? { ...e, ambient: undefined } : e)) };
  let seen = 0, kept = 0, ctl = 0;
  for (let i = 0; i < 60; i++) {
    const s = mixSeed(0x133a, i);
    const a = playLife(s, base, random).state;
    seen += a.log.filter((l) => ids.has(l.id)).length;
    kept += picksAfter(a, 0).filter((p) => ids.has(p.ev?.id)).length;
    ctl += picksAfter(playLife(s, bare, random).state, 0).filter((p) => ids.has(p.ev?.id)).length;
  }
  check('ใบ 133 การ์ด ambient ไม่ถูกนับในแบบชีวิต', ids.size > 0 && seen > 0 && kept === 0, `${ids.size} ใบ · เลือก ${seen} ครั้ง · นับเข้า ${kept}`);
  check('ใบ 133 ตัวควบคุม: ถอด ambient ⇒ นับเข้าแบบชีวิต', ctl > 0, `นับเข้า ${ctl}`);
}

// ใบ 278 ทางเลือกทายาทด้วยมือ (ปุ่มสายเลือด): เลือกคนไหนต้องได้คนนั้นหลัง snapshot/restore · บอทไม่กดปุ่มนี้ (manual) ⇒ ไม่มีด่านบอทตัวไหนครอบ
// ผู้สืบสายเลือด ≥ 2 คนเกิดน้อย (~1% ของชีวิตบอทสายครอบครัว) ⇒ เติมลูกวัยรับมรดกเองหลังตาย ให้เคสนิ่งและเร็ว
// ตัวควบคุม: เลือกคนแรกต้องได้คนแรก (ตัววัดแยกคนได้) · ไม่ส่ง heirId ต้อง throw (ไม่ใช่ได้คนแรกเงียบ)
// ไม่ครอบ: เซฟแบบลำดับปุ่มของหน้าเว็บ (bloodPick ใน src/ui/app.mjs ผูก DOM)
{
  const { startAfterlife, nextAfterCard, chooseAfter, heirCandidates, HEIR_AGE } = await import('../src/engine/index.mjs');
  const { addMember } = await import('../src/engine/family.mjs');
  const content = loadContent();
  const bot = BOTS['สายครอบครัว'];
  const died = () => {
    for (let i = 0; i < 50; i++) {
      const { state } = playLife(mixSeed(0x278, i), content, bot);
      if (state.kin && !state.tripLost) return state;
    }
    return null;
  };
  const toPath = (af) => {
    for (let g = 0; g < 400; g++) {
      const card = nextAfterCard(af);
      if (af.pending?.path) return card;
      if (card.done) return null;
      if (card.choices?.length) chooseAfter(af, bot(card, af.botRng, af));
    }
    return null;
  };
  const pick = (which) => {
    const st = died();
    if (!st) return { err: 'ไม่มีชีวิตที่มีครอบครัว' };
    const year = st.birthYear + st.age;
    for (let k = heirCandidates(st).length; k < 2; k++) addMember(st, 'child', { born: year - HEIR_AGE[0] - k });
    const heirs = heirCandidates(st);
    const af = startAfterlife(st);
    const card = toPath(af);
    const b = (card?.manual ?? []).findIndex(Boolean);
    if (b < 0) return { err: 'การ์ดทางเกิดไม่มีปุ่มสายเลือด', heirs };
    let threw = false;
    try {
      chooseAfter(af, b);
    } catch {
      threw = true;
    }
    const want = which === 'last' ? heirs.at(-1) : heirs[0];
    chooseAfter(af, b, want.id);
    const back = restore(snapshot({ st: af.st, af }, content), content).af;
    for (let g = 0; g < 400 && !back.heir; g++) {
      const c = nextAfterCard(back);
      if (c.done) break;
      if (c.choices?.length) chooseAfter(back, bot(c, back.botRng, back));
    }
    if (!back.heir) return { err: 'ไม่ถึงการ์ดส่งต่อ', heirs };
    return { heirs, threw, want, got: nextLife(back).name };
  };
  const last = pick('last'), first = pick('first');
  const ok = (r) => !r.err && r.heirs.length >= 2;
  check('ใบ 278 ปุ่มสายเลือดเลือกคนสุดท้าย หลังเซฟ/โหลดได้คนที่เลือก', ok(last) && last.got === last.want.name && last.got !== last.heirs[0].name, last.err ?? `${last.heirs.length} คน · เลือก ${last.want.name} · ได้ ${last.got}`);
  check('ใบ 278 ตัวควบคุม: เลือกคนแรกได้คนแรก', ok(first) && first.got === first.heirs[0].name, first.err ?? `ได้ ${first.got}`);
  check('ใบ 278 ตัวควบคุม: ไม่ส่ง heirId ⇒ throw', ok(last) && last.threw);
}

// เฟส 3 เตรียมทหาร ช่วง 2 (เจ้าของสั่ง "เริ่มสร้าง" 2026-11-16): ตายระหว่างฝึก = สาเหตุ training ผ่านด่านตายเดียว
// การ์ดฉากสุดท้ายที่รอในคิวต้องเล่าก่อนงานศพ · สัญญารอดตายยังกันได้ · คำบนการ์ดตายต้องมี
{
  const content = loadContent();
  const st = newLife(7, content);
  st.age = 16;
  const last = { kind: 'result', type: 'A', age: st.age, text: 'ฉากสุดท้าย' };
  st.queue = [last];
  const fate = dieMidYear(st, 'training');
  check('เฟส 3 ตายระหว่างฝึก: ตายด้วยสาเหตุ training', fate === 'dead' && st.dead && st.cause === 'training', `${fate} · ${st.cause}`);
  check('เฟส 3 ตายระหว่างฝึก: การ์ดฉากสุดท้ายเล่าก่อนงานศพ', st.queue[0] === last && st.queue.length > 1, `คิว ${st.queue.length} ใบ`);
  check('เฟส 3 ตายระหว่างฝึก: มีคำบนการ์ดตาย', (causeWords('training', 16) ?? []).join('') === 'ระหว่างการฝึกในโรงเรียนเตรียมทหาร');
  const sv = newLife(7, content);
  sv.age = 16;
  sv.pact = { survive: true };
  const f2v = dieMidYear(sv, 'training');
  check('เฟส 3 ตายระหว่างฝึก: สัญญารอดตายยังกันได้', f2v === 'survive' && !sv.dead && sv.pact.survive === 'used' && sv.queue.at(-1)?.tag === 'survive', f2v);
}

// เฟส 3 ช่วง 3 (เจ้าของสั่ง "เริ่มสร้าง" 2026-11-16): ชีวิตในโรงเรียนปี 1 เดินจากการ์ดรายงานตัวจนจบด้วยบอทสุ่ม
// ฉากขึ้นแน่ครบ · ไม่มีวงเล็บค้าง · นตท. ตั้งแต่ SB-27b · ลาออกแล้วกลับ ม.ปลาย ไม่มีคำนำหน้า · บ้านจนลาออก = หนี้ลาออก ไม่ใช่หนี้ค่าติว
{
  const content = loadContent();
  const parents = [{ sex: 'ชาย', alive: true }, { sex: 'หญิง', alive: true }];
  const mk = (seed, cls) => ({ seed, age: 16, birthYear: 2550 - 16, sex: 'ชาย', region: 'กลาง', flags: {}, parents, parentFlags: {}, content, queue: [], due: [], scheduled: [], done: {}, fired: {},
    cls, name: 'ภูมิ', health: 90, healthNatural: 90, knowledge: 80, happiness: 50, relations: 50, network: 50, money: 0, log: [], ledger: newLedger(), cadetInfo: { tries: 1, order: ['army'] },
    cadet: { steps: [['p2']], cur: null, p2: { branches: ['army'], written: { army: true }, reason: {}, body: { army: true }, final: ['army'], chosen: 'army', scores: { army: 20 }, askNs: {}, steps: [['arrive', 'army']] } } });
  const play = (st, rng, resign) => {
    const seen = new Set();
    let raw = 0, titleAt = null;
    for (let g = 0; g < 400 && !st.dead; g++) {
      const c = cadetCard(st);
      if (!c) { if (st.cadet?.waitAge > st.age) { st.age++; continue; } break; }
      if (/\{[^}]*\}/.test([c.title, c.text, ...(c.choices ?? [])].join(' '))) raw++;
      if (c.kind === 'result') continue;
      const id = String(c.id).replace('cadet:school:', '');
      seen.add(id);
      if (id === 'SB-27b') titleAt = st.title;
      const open = c.choices.map((_, k) => k).filter((k) => !c.locked[k]);
      const quit = c.choices.findIndex((x) => /ยื่นลาออก/.test(x));
      const stay = open.filter((k) => k !== quit);
      chooseCadet(st, resign && quit >= 0 ? quit : stay[Math.floor(rng() * stay.length)] ?? open[0]);
    }
    return { seen, raw, titleAt };
  };
  const fixed = [...(content.cadet.school.order.year1 ?? []), ...(content.cadet.school.order.year2 ?? [])].filter((x) => !/^[@#]/.test(x));
  let raw = 0, missing = new Set(), badTitle = 0, alive = 0, dead = 0, badDead = 0, med = 0, badMed = 0;
  for (let i = 0; i < 120; i++) {
    const st = mk(mixSeed(0x5c01, i), 'ชนชั้นกลาง'), R = makeRng(i), r = play(st, () => R.next(), false);
    raw += r.raw;
    if (st.dead) { dead++; if (st.cause !== 'training') badDead++; continue; }
    if (st.flags.cadet_medical_out) { med++; if (st.title || st.cadet || st.school !== 'upper') badMed++; continue; }
    alive++;
    for (const id of fixed) if (!r.seen.has(id)) missing.add(id);
    if (r.titleAt !== 'นตท.') badTitle++;
  }
  check('เฟส 3 ปี 1–2: ฉากขึ้นแน่ครบทุกชีวิตที่เรียนจบ', missing.size === 0, missing.size ? [...missing].join(' ') : `${alive} ชีวิต`);
  check('เฟส 3 ตายในโรงเรียน = สาเหตุ training', dead > 0 && badDead === 0, `ตาย ${dead} · ผิด ${badDead}`);
  check('เฟส 3 ออกเพราะบาดเจ็บ: กลับ ม.ปลาย ไม่มีคำนำหน้า', badMed === 0, `ออก ${med} · ผิด ${badMed}`);
  check('เฟส 3 ปี 1: ไม่มีวงเล็บค้างบนจอ', raw === 0, `${raw}`);
  check('เฟส 3 ปี 1: เป็น นตท. ตั้งแต่ SB-27b', badTitle === 0, `${badTitle}`);
  const poor = mk(7, 'ยากจน'), rich = mk(8, 'มั่งคั่ง');
  play(poor, () => 0.5, true);
  play(rich, () => 0.5, true);
  check('เฟส 3 ลาออก: กลับ ม.ปลาย ไม่มีคำนำหน้า', poor.school === 'upper' && !poor.title && !poor.cadet, `${poor.school} · ${poor.title}`);
  check('เฟส 3 ลาออก: บ้านจน = หนี้ลาออก ไม่ใช่หนี้ค่าติว · บ้านรวยไม่มีหนี้', !!poor.flags.cadet_resign_debt && !poor.flags.family_debt && !rich.flags.cadet_resign_debt);
}

// เฟส 3 ช่วง 5: ปี 2 ต้องเริ่มจริงเมื่อเดินผ่านลูปขึ้นปีของเกม (บั๊กที่เจอตอนวัดในเกมจริง 2026-11-16: กองปกติปิด → ปีที่รอไม่มีการ์ด → เกมข้ามปีจนพ้นช่วงเรียน)
{
  const content = loadContent();
  let reached = 0, alive = 0;
  for (let i = 0; i < 40; i++) {
    const st = newLife(mixSeed(0x5c05, i), content);
    Object.assign(st, { age: 16, sex: 'ชาย', health: 95, cadetInfo: { tries: 1, order: ['army'] },
      cadet: { steps: [['p2']], cur: null, p2: { branches: ['army'], written: { army: true }, reason: {}, body: { army: true }, final: ['army'], chosen: 'army', scores: { army: 20 }, askNs: {}, steps: [['arrive', 'army']] } } });
    const R = makeRng(i);
    let y2 = false;
    for (let g = 0; g < 500 && !st.dead && st.age <= 18; g++) {
      const c = nextCard(st);
      if (c.kind === 'death') break;
      if (c.id === 'cadet:school:SB-16') y2 = true;
      if (y2 || st.trip || st.court) break;
      const open = c.choices?.length ? openChoices(c).filter((k) => !/ยื่นลาออก/.test(c.choices[k])) : [];   // ไม่ลาออก (วัดทางเรียนต่อ)
      if (open.length) choose(st, open[R.int(0, open.length - 1)]);
    }
    if (st.dead || st.trip || st.court || st.flags.cadet_medical_out || st.school === 'upper') continue;
    alive++;
    if (y2) reached++;
  }
  check('เฟส 3 ปี 2 เริ่มจริงหลังขึ้นปี (เดินผ่านลูปขึ้นปีของเกม)', alive > 0 && reached === alive, `${reached}/${alive}`);
}

// ผีบรรพบุรุษ (ใบ 18): แถวชาติไทยล่าสุดในผัง ข้ามชาติต่างโลก/แถวไม่มีชื่อ · ไม่มีแถวไทย = เงื่อนไขไม่ผ่าน · ช่องแทนค่าอ่านจากแถวนั้น
{
  const E = await import('../src/engine/index.mjs');
  const st = newLife(mixSeed(1, 1801), loadContent());
  const want = { ancestor: true };
  const seen = [];
  const got = (lineage) => {
    st.lineage = lineage;
    return [E.whenOk(st, want), E.ancestorOf(st)?.name ?? '-'];
  };
  seen.push(got([]), got([{ isekai: true, name: 'ไรนา', world: 'x' }]), got([{ name: 'ก้อย', sex: 'หญิง', province: 'น่าน', age: 71 }, { name: 'ต้น', sex: 'ชาย', province: 'กรุงเทพมหานคร', age: 40 }, { name: null, sex: 'ชาย', age: 9 }, { isekai: true, name: 'ไรนา', world: 'x' }]));
  check('ผีบรรพบุรุษ: ผังว่าง/มีแต่ต่างโลก = ไม่ออก · เลือกแถวไทยล่าสุดที่มีชื่อ', seen.map((r) => r.join(':')).join() === 'false:-,false:-,true:ต้น', seen.map((r) => r.join(':')).join());
  const text = E.fill('{บรรพบุรุษ}|{ชื่อบรรพบุรุษ}|{จังหวัดบรรพบุรุษ}|{อายุตายบรรพบุรุษ}', st);
  st.lineage = [{ name: 'ก้อย', sex: 'หญิง', province: 'น่าน', age: 71 }];
  const old = E.fill('{บรรพบุรุษ}|{จังหวัดบรรพบุรุษ}', st);
  check('ผีบรรพบุรุษ: ช่องแทนค่า = เพศ/ชื่อ/จังหวัด/อายุตายของแถว', text === 'ผู้ชาย|ต้น|กรุงเทพมหานคร|40' && old === 'หญิงชรา|จ.น่าน', `${text} · ${old}`);
}

// ใบ 08 ตัวเร่ง/ชะลอการปลด: ความเร็วต่อปีคิดถูกบนตัวอย่างมือ · ปิดตัวเร่ง/ไม่มีค่า = 1 เป๊ะ · ปีเศษส่วนทำให้โหนด 5 ปีปลดเร็วขึ้นจริง
{
  const cfg = { age_end: 75, age_end_mul: 0.6, teacher: 1.25, learn: 1.15, class_step: 0.02, class_mid: 4.5 };
  const only = (o) => Object.assign(treePaceCtl, { teacher: false, cls: false, learn: false, age: false }, o);
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  try {
    only({ age: true });
    check('ใบ 08 ยิ่งแก่ยิ่งช้า: อายุ 0 = 1 · 75 = 0.6 · เกิน 75 คงที่', near(treePace({}, cfg, 0), 1) && near(treePace({}, cfg, 75), 0.6) && near(treePace({}, cfg, 120), 0.6) && treePace({}, cfg, 40) < treePace({}, cfg, 20), `${treePace({}, cfg, 0)} · ${treePace({}, cfg, 75)}`);
    only({ teacher: true, learn: true });
    check('ใบ 08 ครูธง ×1.25 · ใฝ่รู้ ×1.15 · ไม่มี = 1', near(treePace({ flags: { tree_teacher: true } }, cfg, 5), 1.25) && near(treePace({ nature: 'learn' }, cfg, 5), 1.15) && treePace({ flags: {}, nature: 'duty' }, cfg, 5) === 1);
    only({ cls: true });
    check('ใบ 08 ฐานะตอนเกิด: กลาง 4.5 = 1 · สูงกว่าเร็วกว่า · ไม่มีฐานะ = 1', near(treePace({ standing: [{ cls: 9 }] }, cfg, 5), 1.09) && near(treePace({ standing: [{ cls: 0 }] }, cfg, 5), 0.91) && treePace({}, cfg, 5) === 1);
    only({});
    check('ตัวควบคุม ใบ 08: ปิดทุกตัวเร่ง หรือไม่ส่งค่า = 1 เป๊ะ', treePace({ flags: { tree_teacher: true }, nature: 'learn', standing: [{ cls: 9 }] }, cfg, 60) === 1 && treePace({}, null, 60) === 1);
    only({ teacher: true });
    const defs = { a: { years: 5, cards: 0, cat: [], stages: ['เด็ก'] } };
    const ticks = (pace, flags) => {
      const h = { flags };
      treeInvest(h, defs, 'a', 'เด็ก');
      let n = 0;
      for (; n < 20; ) { n++; if (treeYearEnd(h, defs, 'เด็ก', 5 + n, pace)?.unlocked) break; }
      return n;
    };
    const ticks3 = (flags) => {
      const d3 = { a: { years: 3, cards: 0, cat: [], stages: ['เด็ก'] }, b: { years: 3, cards: 0, cat: [], stages: ['เด็ก'] } };
      const h = { flags };
      treeInvest(h, d3, 'a', 'เด็ก');
      const out = [];
      for (let y = 1; y <= 12 && out.length < 2; y++) {
        const r = treeYearEnd(h, d3, 'เด็ก', y, cfg);
        if (r?.unlocked) out.push(y);
      }
      return out;
    };
    check('ใบ 08 เศษทบ: 2 โหนด 3 ปี มีครู ×1.25 ปลดปีที่ 3 และ 5 (ไม่มีครู 3 และ 6)', JSON.stringify(ticks3({ tree_teacher: true })) === '[3,5]' && JSON.stringify(ticks3({})) === '[3,6]', `${JSON.stringify(ticks3({ tree_teacher: true }))} · ${JSON.stringify(ticks3({}))}`);
    check('ใบ 08 โหนด 5 ปี: มีครู ×1.25 ปลดที่ปีที่ 4 · ไม่มีครูปีที่ 5', (() => { const a = ticks(cfg, { tree_teacher: true }), b = ticks(cfg, {}); return a === 4 && b === 5; })());
  } finally {
    Object.assign(treePaceCtl, { teacher: true, cls: true, learn: true, age: true });
  }
}

// ใบ 237 สถานะอยู่นอกบ้าน: ใบ fixture ในกองจริง · บอทเลือกตัวแรก ยกเว้นการ์ดโทรมาบอกที่กดปุ่มกลับบ้าน (ตัวท้าย) เมื่อ back = true
// ตัวควบคุม: ไม่เข้าสถานะ ⇒ ใบติดป้ายต้องออกอายุเดิม และสถานะไม่เกิด
{
  const base = loadContent();
  const ch = (extra = {}) => ({ text: 'ตัวเลือก', merit: [{ cat: 'neutral' }], ...extra });
  const card = (id, at_age, extra = {}, first = {}) => ({ id, type: 'A', category: 'family', stage: 'หนุ่มสาว', years: [2400, 2700], age: at_age, text: 'ข้อความ', choices: [ch(first), ch(), ch(), ch()], ...extra });
  const run = (enter, back) => {
    const events = [
      card('t237_enter', 20, {}, enter ? { effects: { away_enter: 'abroad' } } : {}),
      card('t237_block', 22, { away_block: ['abroad'] }),
      card('t237_call', 24, { away_call: { text: 'สายจากบ้าน' } }),
    ];
    // ตัดสายที่เข้าสถานะจริงออก ใบ fixture จะได้เป็นทางเข้าเดียว
    const content = { ...base, events: [...base.events.filter((e) => !e.id.startsWith('abroad_') && !e.id.startsWith('pali_')), ...events] };
    const pick = (c) => (c.kind === 'event' && c.id === 't237_call' && back && c.choices.length === 5 ? 4 : openChoices(c)[0]);
    const r = { block: [], call: [], lives: 0, awayAfterCall: [], paid: 0, moneyBack: 0 };
    for (let i = 0; i < 400 && r.lives < 40; i++) {
      let reached = false, before = null, after = null;
      playLife(mixSeed(0x237, i), content, pick, (c, st) => {
        if (before !== null && after === null && c.kind === 'event') { after = st.money; r.awayAfterCall.push(!!st.outside); if (back) r.moneyBack += before - after; }
        if (c.kind !== 'event') return;
        if (c.id === 't237_block') r.block.push(c.age);
        if (c.id === 't237_call') { reached = true; before = st.money; r.call.push({ text: c.text, n: c.choices.length, age: c.age }); }
      });
      if (reached) r.lives++;
    }
    return r;
  };
  const stay = run(true, false), back = run(true, true), none = run(false, false);
  const callOk = (r) => r.lives > 0 && r.call.every((c) => c.text === 'สายจากบ้าน' && c.n === 5);
  check('ใบ 237 นอกบ้าน: ใบติดป้ายไม่ออกอายุเดิม และไม่ออกตลอดช่วงที่ยังไม่กลับ', stay.lives > 0 && stay.block.length === 0, `lives ${stay.lives} ออก ${stay.block.length}`);
  check('ใบ 237 โทรมาบอก: ใช้คำแทนและมีปุ่มกลับบ้านต่อท้าย', callOk(stay), `lives ${stay.lives}`);
  check('ใบ 237 กดกลับบ้าน: จบสถานะ', back.lives > 0 && back.awayAfterCall.length > 0 && back.awayAfterCall.every((a) => !a), `n ${back.awayAfterCall.length}`);
  check('ใบ 237 ใบที่เลื่อนออกปีแรกหลังกลับ (อายุ 25)', back.block.length > 0 && back.block.every((a) => a === 25), `อายุ ${[...new Set(back.block)]}`);
  check('ใบ 237 ตัวควบคุม: ไม่เข้าสถานะ ใบติดป้ายออกอายุเดิม 22 การ์ดโทรไม่แปลงร่าง', none.block.length > 0 && none.block.every((a) => a === 22) && none.call.every((c) => c.n === 4 && c.text === 'ข้อความ'), `อายุ ${[...new Set(none.block)]}`);
}

// ระดับใช้จ่าย (B29 · ใบ 52): ตัวคูณมีผลแค่เงินเก็บที่เข้ากระเป๋า — ราคาการ์ด income_x (ได้ · จ่าย · ค่าใช้จ่าย) ต้องเท่ากันทุกระดับ
// บอทที่ประกาศนโยบายเลือกต่างกันจริง · บอทที่ไม่ประกาศไม่เคยแตะแถว (ตัวควบคุม: ไม่งั้นด่าน lifehash 0 ไม่ได้พิสูจน์อะไร)
{
  const content = loadContent();
  const st = newLife(mixSeed(52, 1), content);
  st.age = 30;
  const price = () => [{ unit: 'income_x', amount: 2 }, { unit: 'income_x', amount: -1 }].flatMap((m) => [moneyValue(st, m), moneyValue(st, m, true)]);
  const prices = ['frugal', 'normal', 'luxury'].map((id) => ((st.spendLevel = id), JSON.stringify(price())));
  check('ใบ 52 ราคาการ์ด income_x เท่ากันทุกระดับใช้จ่าย', prices.every((p) => p === prices[0]) && JSON.parse(prices[0]).some((v) => v !== 0), prices[0]);
  const levels = (bot) => Array.from({ length: 40 }, (_, i) => playLife(mixSeed(52, i), content, bot).state.spendLevel);
  const rich = levels(withSpend(BOTS.สายเงิน, SPEND_WAY.สายเงิน));
  const care = levels(withSpend(BOTS.สายสุขภาพ, SPEND_WAY.สายสุขภาพ));
  check('ใบ 52 บอทสายเงินกับสายสุขภาพเลือกระดับต่างกัน', rich.includes('frugal') && care.includes('luxury') && !rich.includes('luxury') && !care.includes('frugal'), `เงิน ${rich.filter(Boolean).length}/40 · สุขภาพ ${care.filter(Boolean).length}/40`);
  check('ใบ 52 ตัวควบคุม: บอทที่ไม่ประกาศนโยบายไม่แตะระดับใช้จ่าย', levels(BOTS.สายเงิน).every((l) => l === undefined));
  let threw = false;
  try {
    chooseSpend(newLife(mixSeed(52, 2), content), 'frugal');
  } catch {
    threw = true;
  }
  check('ใบ 52 เลือกระดับนอกการ์ดทบทวนเงินไม่ได้', threw);
}
// สถานะบนตัวคู่ (ใบ 89 B114 ข้อ 145 164): แยกทาง = ยังมีคู่ · หย่า = ไม่นับในงานศพ/จดหมาย/สูญเสีย · คู่ปัจจุบันตามสถานะ · เซฟเก่าไม่มีช่อง = อยู่ด้วยกัน
{
  const content = loadContent();
  const wedding = content.events.find((e) => e.id === 'young_wedding_01');
  const fresh = () => {
    const st = newLife(7, content);
    st.age = 30;
    applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
    return st;
  };
  const wedOk = (st) => whenOk(st, wedding.when);
  const a = fresh();
  const was = wedOk({ ...a, age: 25 });
  applyFamily(a, { family: [{ separate: 'spouse' }] });
  const sp = a.kin.find((m) => m.role === 'spouse');
  check('ใบ 89 แยกทาง: สถานะ apart · ออกจากบ้านแต่ธง married ไม่หาย', sp.status === 'apart' && sp.left === true && a.flags.married === true && spouseOf(a) === sp);
  check('ใบ 89 แยกทาง: การ์ดขอแต่งงานไม่ขึ้น (ธง married ยังอยู่) · ก่อนแยกก็ไม่ขึ้นเพราะมีคู่', wedOk({ ...a, age: 25 }) === false && was === false);
  applyFamily(a, { sets_flags: ['married'] });
  check('ใบ 89 แยกทาง: แต่งซ้ำไม่เพิ่มคู่คนที่สอง', a.kin.filter((m) => m.role === 'spouse').length === 1);
  const b = fresh();
  applyFamily(b, { family: [{ divorce: 'spouse' }] });
  const sb = b.kin.find((m) => m.role === 'spouse');
  check('ใบ 89 หย่า: สถานะ divorced · ธง married หาย · ธง divorced ติด · ไม่มีคู่ปัจจุบัน', sb.status === 'divorced' && !b.flags.married && b.flags.divorced === true && spouseOf(b) === null);
  check('ใบ 89 หย่า: การ์ดขอแต่งงานขึ้นได้อีก', wedOk({ ...b, age: 25 }) === true);
  const after = (st, m) => { m.born = st.birthYear - 112; for (let y = 0; y < 6 && m.alive; y++) ageKin(st, st.birthYear + st.age + y); return m.alive; };
  const stillB = after(b, sb);
  check('ใบ 89 หย่าแล้วตาย: ไม่ลงบันทึกสูญเสียคู่ · ไม่เข้าช่วงไว้ทุกข์ (when.loss)', !stillB && !(b.kinLoss ?? []).some((l) => l.role === 'spouse') && !lossOk(b, { roles: ['spouse'], within: 3 }), `alive ${stillB}`);
  const c = fresh();
  applyFamily(c, { family: [{ separate: 'spouse' }] });
  const sc = c.kin.find((m) => m.role === 'spouse');
  const stillC = after(c, sc);
  check('ใบ 89 แยกทางแล้วตาย: ลงสูญเสียคู่ (ยังเป็นคู่ตามกฎหมาย)', !stillC && (c.kinLoss ?? []).some((l) => l.role === 'spouse'), `alive ${stillC}`);
  const d = fresh();
  d.kin.find((m) => m.role === 'spouse').bond = 90;
  check('ใบ 89 งานศพ/จดหมาย: คู่ที่ยังอยู่นับ', !!funeralWho(d, 0)?.text?.includes('คู่ชีวิต') && letterTo(d)?.role === 'spouse');
  applyFamily(d, { family: [{ divorce: 'spouse' }] });
  check('ใบ 89 งานศพ/จดหมาย: คู่ที่หย่าไม่นับ', funeralWho(d, 0) === null && letterTo(d) === null);
  const e = fresh();
  const old = e.kin.find((m) => m.role === 'spouse');
  applyFamily(e, { family: [{ divorce: 'spouse' }] });
  applyFamily(e, { sets_flags: ['married'] });
  const rows2 = e.kin.filter((m) => m.role === 'spouse');
  check('ใบ 89 หย่าแล้วแต่งใหม่: คู่ปัจจุบัน = คนใหม่ ไม่ใช่คู่ที่หย่าไป (หยิบเป็นพ่อ/แม่ทายาท)', rows2.length === 2 && spouseOf(e) === rows2[1] && spouseOf(e) !== old);
  const g = fresh();
  applyFamily(g, { family: [{ leave: 'spouse' }] });
  check('ใบ 89 ตัวควบคุม: op leave เดิม (ไม่ใช่แยกทาง) ธง married หาย → การ์ดขอแต่งงานขึ้นได้ · ต่างจากแยกทาง', !g.flags.married && wedOk({ ...g, age: 25 }) === true);
  const f = fresh();
  delete f.kin.find((m) => m.role === 'spouse').status;
  check('ใบ 89 เซฟเก่าไม่มีช่อง status = อยู่ด้วยกัน', spouseStatus(f.kin.find((m) => m.role === 'spouse')) === 'together' && spouseOf(f) === f.kin.find((m) => m.role === 'spouse'));
}

// บทแฟน (ใบ 90 B114 ข้อ 146 165): แฟนเป็นคนมีชื่อในบ้าน · แต่งกับแฟน = คนเดิมเป็นคู่ · เลิกได้สองฝ่าย ชื่อยังอ้างได้ · เลิกแล้วตายไม่ลงสูญเสีย
{
  const content = loadContent();
  const fresh = () => {
    const st = newLife(7, content);
    st.age = 22;
    applyFamily(st, { family: [{ add: 'partner' }] });
    return st;
  };
  const a = fresh();
  const pa = a.kin.find((m) => m.role === 'partner');
  const panel = familyOf(a).find((m) => m.role === 'partner');
  check('ใบ 90 แฟนเป็นคนมีชื่อในบ้าน: familyOk · แผงครอบครัวเห็นพร้อมชื่อ · เพศแบบคู่ · ไม่ตั้งธง married', familyOk(a, { role: 'partner', alive: true }) && panel?.name === pa.name && !!pa.name && pa.sex === a.kin[0].sex && !a.flags.married);
  check('ใบ 90 แฟน: ปีเกิดใกล้ผู้เล่น (ไม่ใช่ปีนี้)', Math.abs(pa.born - a.birthYear) <= 12 && pa.born !== a.birthYear + a.age);
  applyFamily(a, { sets_flags: ['married'] });
  const sa = a.kin.filter((m) => m.role === 'spouse');
  check('ใบ 90 แต่งแล้ว (ธง married): แฟนคนเดิมเป็นคู่ id/ชื่อเดิม · ไม่เพิ่มคนที่สอง · ไม่เหลือแฟน', sa.length === 1 && sa[0].id === pa.id && sa[0].name === pa.name && a.kin.every((m) => m.role !== 'partner') && a.flags.married === true && sa[0].since === 22);
  const b = fresh();
  const pb = b.kin[0];
  applyFamily(b, { family: [{ marry: 'partner' }] });
  check('ใบ 90 op marry: แฟนคนเดิมเป็นคู่ · ธง married ตามสมาชิก', b.kin.length === 1 && b.kin[0].role === 'spouse' && b.kin[0].id === pb.id && b.flags.married === true);
  const c = fresh();
  const pc = c.kin[0];
  applyFamily(c, { family: [{ breakup: 'partner', by: 'them' }] });
  check('ใบ 90 เลิก (เขาบอกเลิก): ออกจากบ้าน · ไม่นับเป็นแฟนอยู่ · ชื่อแฟนเก่ายังอ้างได้ · ไม่ใช่คู่', pc.status === 'ex' && pc.endedBy === 'them' && !familyOk(c, { role: 'partner', alive: true }) && exPartnerOf(c)?.name === pc.name && !c.flags.married);
  const d = fresh();
  applyFamily(d, { family: [{ breakup: 'partner' }] });
  check('ใบ 90 เลิก (เราบอกเลิก = ค่าตั้งต้น)', d.kin[0].endedBy === 'us' && d.kin[0].status === 'ex');
  const old = (st, m) => { m.born = st.birthYear - 112; for (let y = 0; y < 6 && m.alive; y++) ageKin(st, st.birthYear + st.age + y); return m.alive; };
  const stillC = old(c, pc);
  check('ใบ 90 แฟนเก่าตาย: ไม่ลงบันทึกสูญเสีย', !stillC && (c.kinLoss ?? []).length === 0, `alive ${stillC}`);
  const e = fresh();
  const stillE = old(e, e.kin[0]);
  check('ใบ 90 แฟนที่ยังคบอยู่ตาย: ลงสูญเสียบท แฟน + ข้อความเรียกแฟน', !stillE && e.kinLoss.some((l) => l.role === 'partner') && lossText(e.kinLoss.at(-1)).startsWith('แฟน'), `alive ${stillE}`);
  const f = fresh();
  applyFamily(f, { family: [{ breakup: 'partner' }] });
  applyFamily(f, { sets_flags: ['married'] });
  check('ใบ 90 เลิกแล้วแต่งใหม่: คู่เป็นคนใหม่ (id ไม่ใช่แฟนเก่า) · แฟนเก่ายังเป็นแฟนเก่า', f.kin.filter((m) => m.role === 'spouse').length === 1 && f.kin.find((m) => m.role === 'spouse').id !== f.kin[0].id && f.kin[0].status === 'ex');
  const g = newLife(7, content);
  g.age = 30;
  applyFamily(g, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
  applyFamily(g, { family: [{ add: 'partner' }] });
  // แฟนเข้ากลางชีวิตไม่ขยับลำดับสุ่ม/ชื่อของคนที่มาทีหลัง (172 K3): กับ/ไม่มีแฟน คนถัดไปและทอยของ kinRng ต้องเท่ากัน · ตัวควบคุม: คู่ (ใช้สายเดียวกัน) ต้องขยับ
  const track = (role) => {
    const st = newLife(7, content);
    st.age = 22;
    if (role) applyFamily(st, { family: [{ add: role }] });
    applyFamily(st, { family: [{ add: 'child' }, { add: 'child' }] });
    const kids = st.kin.filter((m) => m.role === 'child').map((m) => [m.id, m.name, m.sex, m.born].join('|'));
    for (let y = 0; y < 12; y++) ageKin(st, st.birthYear + 23 + y);
    return { kids, next: st.kinRng.next(), alive: st.kin.filter((m) => m.role === 'child').map((m) => m.alive).join() };
  };
  const base = track(null), withP = track('partner'), withS = track('spouse');
  check('ใบ 90 แฟนไม่แตะ kinSeq/kinRng: ลูกที่ตามมา (id ชื่อ เพศ ปีเกิด) + ผลตายราย 12 ปี + เลขสุ่มถัดไป เท่าชีวิตที่ไม่มีแฟน', JSON.stringify(withP) === JSON.stringify(base), JSON.stringify([base, withP]));
  check('ใบ 90 ตัวควบคุม: เพิ่มคู่ (ใช้สายสุ่มเดิม) แล้วลูกที่ตามมา/เลขสุ่มต่าง · สคริปต์วัดจับความต่างได้', JSON.stringify(withS) !== JSON.stringify(base));
  const h = newLife(7, content);
  h.age = 24;
  applyFamily(h, { family: [{ add: 'peer' }] });
  const peer = h.kin.find((m) => m.role === 'peer');
  const was = [peer.id, peer.name, peer.born, peer.sex].join('|');
  const moved = becomePartner(h, peer);
  check('ใบ 90 becomePartner: คนนอกบ้าน (peer) ย้ายเข้าเป็นแฟน id/ชื่อ/ปีเกิด/เพศเดิม · เริ่มนับปีคบ · แต่งต่อเป็นคู่ได้', moved === peer && peer.role === 'partner' && [peer.id, peer.name, peer.born, peer.sex].join('|') === was && peer.since === 24 && (applyFamily(h, { sets_flags: ['married'] }), h.kin.find((m) => m.id === peer.id).role === 'spouse'));
  check('ใบ 90 becomePartner: คู่/แฟนอยู่แล้ว = ไม่ทำอะไร (null)', becomePartner(h, peer) === null && becomePartner(h, null) === null);
  check('ใบ 90 ชีวิตไม่มีแฟน: แต่งตามเดิม (ธง married เพิ่มคู่ ไม่ผ่านทางแปลงบท)', g.kin.filter((m) => m.role === 'spouse').length === 1 && g.kin.some((m) => m.role === 'partner'));
}

// จดพ่อ/แม่บนตัวลูก (ใบ 91 B114 ข้อ 149 154 166): ลูกจด by = คู่ปัจจุบันตอนเกิด · พ่อ/แม่ของลูกคือคู่คนนั้นแม้หย่าไปแล้ว · เซฟเก่าไม่มี by คิดย้อนจากปีเกิด
{
  const content = loadContent();
  const st = newLife(7, content);
  st.age = 22;
  applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
  const A = st.kin.find((m) => m.role === 'spouse');
  st.age = 24;
  applyFamily(st, { family: [{ add: 'child' }] });
  const c1 = st.kin.filter((m) => m.role === 'child').at(-1);
  st.age = 30;
  applyFamily(st, { family: [{ divorce: 'spouse' }] });
  st.age = 40;
  applyFamily(st, { sets_flags: ['married'] });
  const B = st.kin.filter((m) => m.role === 'spouse').at(-1);
  st.age = 42;
  applyFamily(st, { family: [{ add: 'child' }] });
  const c2 = st.kin.filter((m) => m.role === 'child').at(-1);
  check('ใบ 91 ลูกจดคู่ที่เป็นพ่อ/แม่ตอนเกิด: ลูกคนแรก = คู่แรก (หย่าไปแล้ว) · ลูกคนหลังแต่งใหม่ = คู่ใหม่', A.id !== B.id && c1.by === A.id && c2.by === B.id, `${c1.by} ${c2.by} ${A.id} ${B.id}`);
  check('ใบ 91 parentSpouseOf: ลูกคู่แรกได้คู่แรกแม้หย่าแล้ว (ไม่ใช่คู่ล่าสุด) · spouseOf ปัจจุบัน = คู่ใหม่', parentSpouseOf(st, c1) === A && parentSpouseOf(st, c2) === B && spouseOf(st) === B);
  delete c1.by;
  delete c2.by;
  check('ใบ 91 เซฟเก่า (ไม่มี by): คิดย้อนจากปีเกิด — ลูกเกิดตอนอายุ 24 = คู่ที่ since ไม่เกิน 24 · ลูกอายุ 42 = คู่ใหม่', parentSpouseOf(st, c1) === A && parentSpouseOf(st, c2) === B);
  const s = newLife(7, content);
  s.age = 25;
  applyFamily(s, { family: [{ add: 'child' }] });
  const kid = s.kin.find((m) => m.role === 'child');
  check('ใบ 91 พ่อ/แม่เลี้ยงเดี่ยว (ไม่มีคู่ตอนลูกเกิด): by = null → parentSpouseOf null', kid.by === null && parentSpouseOf(s, kid) === null);
  const o = newLife(7, content);
  o.age = 30;
  applyFamily(o, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
  applyFamily(o, { family: [{ add: 'child' }] });
  const ok = o.kin.find((m) => m.role === 'child');
  delete ok.by;
  check('ใบ 91 เซฟเก่าแต่งครั้งเดียว: ลูกไม่มี by ได้คู่คนเดียวนั้น (เท่าฐาน)', parentSpouseOf(o, ok) === o.kin.find((m) => m.role === 'spouse'));
}

// แยกทาง → คืนดี | หย่า (ใบ 92 B114 ข้อ 145 153 154 162): when.spouse · คืนดี · bond ลดไม่ทะลุพื้น · หย่าแบ่งสินสมรสครึ่ง · ลูกเล็กเลือกอยู่กับใคร (ยังเป็นทายาท)
{
  const content = loadContent();
  const fresh = (age = 25) => {
    const st = newLife(7, content);
    st.age = age;
    applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
    return st;
  };
  const sp = (st) => st.kin.find((m) => m.role === 'spouse');
  const a = fresh();
  a.age = 30;
  sp(a).bond = 40;
  check('ใบ 92 when.spouse: คู่อยู่ด้วยกัน 5 ปี bond 40 ผ่าน [38,48]/[3,99] · bond 60 ตก · อยู่ด้วยกันไม่ถึง 3 ปีตก', spouseOk(a, { status: 'together', bond: [38, 48], together: [3, 99] }) && (sp(a).bond = 60, !spouseOk(a, { bond: [38, 48] })) && (sp(a).bond = 40, !spouseOk({ ...a, age: 26 }, { together: [3, 99] })));
  const sepCard = content.events.find((e) => e.id === 'fam_separate_work_01');
  check('ใบ 92 การ์ดแยกทางด้วยผูกพันต่ำ: ขึ้นเมื่อ bond 40 อยู่ด้วยกันนาน · ไม่ขึ้นเมื่อ bond 70', whenOk(a, sepCard.when) === true && (sp(a).bond = 70, whenOk(a, sepCard.when) === false));
  check('ใบ 93 when.spouse wed: ปีแต่ง = birthYear + since ผ่านเฉพาะช่วง · ไม่มี since ตก', spouseOk(a, { wed: [a.birthYear + a.age - 20, a.birthYear + a.age] }) && !spouseOk(a, { wed: [a.birthYear - 50, a.birthYear + a.age - 6] }) && (delete sp(a).since, !spouseOk(a, { wed: [2400, 2700] })) && (sp(a).since = a.age - 5, true));
  sp(a).bond = 40;
  applyFamily(a, { family: [{ separate: 'spouse' }] });
  check('ใบ 92 when.spouse apart: ปีที่แยกทางมาแล้ว 0 ไม่ผ่าน [1,6] · 2 ปีผ่าน · status together ตก', !spouseOk(a, { status: 'apart', apart: [1, 6] }) && spouseOk({ ...a, age: 32 }, { status: 'apart', apart: [1, 6] }) && !spouseOk({ ...a, age: 32 }, { status: 'together' }));
  check('ใบ 92 แยกทางแล้ว: การ์ดแยกทางไม่ขึ้นซ้ำ (สถานะไม่ใช่ together)', whenOk({ ...a, age: 32 }, sepCard.when) === false);
  const b = fresh(30);
  sp(b).bond = 40;
  applyFamily(b, { family: [{ separate: 'spouse' }] });
  b.age = 32;
  applyFamily(b, { family: [{ reconcile: 'spouse' }, { bond: 'spouse', d: 12 }] });
  const sb = sp(b);
  check('ใบ 92 คืนดี: กลับเป็น together · กลับเข้าบ้าน (left false · ไม่มี leftAge) · ธง married คง · bond +12', sb.status === 'together' && sb.left === false && sb.leftAge === undefined && b.flags.married === true && sb.bond === 52 && b.kin.filter((x) => x.role === 'spouse' && x.alive && !x.left).length === 1, `${sb.status} ${sb.left} ${sb.bond}`);
  const c = fresh(30);
  sp(c).bond = 40;
  applyFamily(c, { family: [{ bond: 'spouse', d: -10 }] });
  const lo = sp(c).bond;
  sp(c).bond = 70;
  applyFamily(c, { family: [{ bond: 'spouse', d: -10 }] });
  check('ใบ 92 op bond ลบ: ไม่ทะลุพื้น 38 (40−10 → 38) · ที่สูงกว่าลดตรง ๆ (70−10 → 60)', lo === BOND_FLOOR && sp(c).bond === 60, `${lo} ${sp(c).bond}`);
  const m = fresh(28);
  m.trail = [{ year: m.birthYear + 28, money: 100000 }];
  m.money = 300000;
  m.age = 40;
  applyFamily(m, { family: [{ separate: 'spouse' }] });
  m.age = 42;
  applyFamily(m, { family: [{ divorce: 'spouse' }] });
  check('ใบ 92 หย่าแบ่งสินสมรส: เงินงอก 200000 หลังเริ่มอยู่ด้วยกัน เสียครึ่ง → เหลือ 200000', DIVORCE_SPLIT === 0.5 && m.money === 200000, `${m.money}`);
  const flat = fresh(28);
  flat.trail = [{ year: flat.birthYear + 28, money: 300000 }];
  flat.money = 250000;
  applyFamily(flat, { family: [{ divorce: 'spouse' }] });
  const debt = fresh(28);
  debt.trail = [{ year: debt.birthYear + 28, money: 100000 }];
  debt.money = -50000;
  applyFamily(debt, { family: [{ divorce: 'spouse' }] });
  const oldSave = fresh(28);
  oldSave.money = 400000;
  delete sp(oldSave).since;
  applyFamily(oldSave, { family: [{ divorce: 'spouse' }] });
  check('ใบ 92 หย่าไม่แบ่ง: เงินไม่งอก · ติดลบ · เซฟเก่าไม่มี since = เงินเท่าเดิม', flat.money === 250000 && debt.money === -50000 && oldSave.money === 400000, `${flat.money} ${debt.money} ${oldSave.money}`);
  // ลูกเล็กหลังหย่า
  const k = fresh(30);
  applyFamily(k, { family: [{ add: 'child' }] });
  const kid = k.kin.find((x) => x.role === 'child');
  k.age = 36;
  applyFamily(k, { family: [{ separate: 'spouse' }, { custody: 'other' }] });
  const beforeDivorce = kid.custody;
  k.age = 38;
  applyFamily(k, { family: [{ divorce: 'spouse' }, { custody: 'other' }] });
  check('ใบ 92 ลูกเล็ก: ยังไม่หย่า (แยกทาง) op custody ไม่จด · หย่าแล้วจด other · ลูกยังเป็นทายาท (ไม่ left · ยังอยู่ในบ้าน)', beforeDivorce === undefined && kid.custody === 'other' && !kid.left && kid.alive && parentSpouseOf(k, kid) === sp(k) && sp(k).status === 'divorced');
  const grown = fresh(30);
  applyFamily(grown, { family: [{ add: 'child' }] });
  const big = grown.kin.find((x) => x.role === 'child');
  grown.age = 50;
  applyFamily(grown, { family: [{ divorce: 'spouse' }, { custody: 'self' }] });
  check('ใบ 92 ลูกโตแล้ว (≥ 18): custody ไม่จด', big.custody === undefined);
  const decay = (way) => {
    const st = fresh(30);
    applyFamily(st, { family: [{ add: 'child' }] });
    const ch = st.kin.find((x) => x.role === 'child');
    st.age = 36;
    applyFamily(st, { family: [{ divorce: 'spouse' }, { custody: way }] });
    ch.bond = 80;
    for (let y = 0; y < 3; y++) ageKin(st, st.birthYear + st.age + y);
    return ch.alive ? ch.bond : null;
  };
  const other = decay('other');
  const self = decay('self');
  check('ใบ 92 ลูกอยู่กับอีกฝ่าย: ผูกพันจางเร็วกว่าเราเลี้ยงเอง 3 ปี (ต่างกัน KIN_CUSTODY.decay × 3) · ไม่ต่ำกว่าพื้น', other !== null && self !== null && self - other === KIN_CUSTODY.decay * 3 && other >= BOND_FLOOR, `other ${other} self ${self}`);
  const kidsCard = content.events.find((e) => e.id === 'fam_divorce_kids_01');
  const noKidCard = content.events.find((e) => e.id === 'fam_divorce_01');
  const j = fresh(30);
  applyFamily(j, { family: [{ separate: 'spouse' }] });
  j.age = 33;
  const noKids = [whenOk(j, kidsCard.when), whenOk(j, noKidCard.when)];
  applyFamily(j, { family: [{ add: 'child' }] });
  const withKid = [whenOk(j, kidsCard.when), whenOk(j, noKidCard.when)];
  j.age = 40;
  j.kin.find((x) => x.role === 'child').born = j.birthYear + 20;
  const grownKid = [whenOk(j, kidsCard.when), whenOk(j, noKidCard.when)];
  check('ใบ 92 การ์ดหย่า: ไม่มีลูกเล็ก = การ์ดไม่มีลูก · มีลูกเล็ก = การ์ดเลือกผู้ปกครอง · ลูกโตแล้ว = การ์ดไม่มีลูก (ไม่ซ้อนกัน)', !noKids[0] && noKids[1] && withKid[0] && !withKid[1] && !grownKid[0] && grownKid[1], `${noKids} ${withKid} ${grownKid}`);
}

// ลูกไม่ใช่ลูก (ใบ 95 B114 ข้อ 149 166): ทอยตอนลูกเกิดช่วงคู่นอกใจ · ผู้เล่นชายเท่านั้น · when.child_not_mine · op paternity keep/cut
{
  const content = loadContent();
  const born = (seed, { sex = 'ชาย', flag = true, at = 28, age = 29 } = {}) => {
    const st = newLife(seed, content);
    st.sex = sex;
    st.age = 25;
    applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
    if (flag) {
      st.flags.spouse_cheated = true;
      st.flagAge.spouse_cheated = at;
    }
    st.age = age;
    applyFamily(st, { family: [{ add: 'child' }] });
    return st;
  };
  const rate = (opt) => {
    let n = 0;
    const N = 400;
    for (let i = 0; i < N; i++) if (born(9000 + i, opt).kin.find((m) => m.role === 'child').notMine) n++;
    return n / N;
  };
  const r = rate({});
  check('ใบ 95 ลูกเกิดช่วงคู่นอกใจ (ผู้เล่นชาย): สัดส่วนไม่ใช่ลูกเราใกล้ NOT_MINE.p', Math.abs(r - NOT_MINE.p) < 0.08, `${r}`);
  check('ใบ 95 ไม่นับ: ผู้เล่นหญิง · ไม่มีธง spouse_cheated · ลูกเกิดนอกช่วง (ก่อน 2 ปี / หลัง 5 ปี)', rate({ sex: 'หญิง' }) === 0 && rate({ flag: false }) === 0 && rate({ age: 26 }) === 0 && rate({ age: 33 }) === 0);
  const seed = Array.from({ length: 400 }, (_, i) => 9000 + i).find((x) => born(x).kin.find((m) => m.role === 'child').notMine);
  const card = content.events.find((e) => e.id === 'fam_not_mine_mid_01');
  const st = born(seed);
  const kid = st.kin.find((m) => m.role === 'child');
  st.birthYear = 2500;
  kid.born = st.birthYear + 29;
  st.age = 49;
  check('ใบ 95 การ์ดเปิดความลับ: ออกเมื่อลูกโต 18+ และเป็นผู้ชาย · ผู้เล่นหญิงไม่ออก', whenOk(st, card.when) === true && (st.sex = 'หญิง', whenOk(st, card.when) === false));
  st.sex = 'ชาย';
  kid.bond = 80;
  st.kinFocus = { child: kid.id };
  applyFamily(st, { family: [{ paternity: 'keep' }] });
  const kept = kid.bond;
  check('ใบ 95 keep: จด kept · ผูกพันขึ้น NOT_MINE.keepBond · ลูกยังเป็นทายาท (alive ไม่ left) · การ์ดไม่ซ้ำ', kid.paternity === 'kept' && kept === 80 + NOT_MINE.keepBond && kid.alive && !kid.left && whenOk(st, card.when) === false);
  const st2 = born(seed);
  const kid2 = st2.kin.find((m) => m.role === 'child');
  kid2.bond = 90;
  applyFamily(st2, { family: [{ paternity: 'cut' }] });
  check('ใบ 95 cut: จด cut · ผูกพันตกเหลือไม่เกิน NOT_MINE.cutTo · ตัดซ้ำไม่ขยับ', kid2.paternity === 'cut' && kid2.bond <= NOT_MINE.cutTo && (applyFamily(st2, { family: [{ paternity: 'keep' }] }), kid2.paternity === 'cut'));
  // ทายาทสายเลือดที่เป็นลูกไม่ใช่ลูกเรา: ผู้เล่นตายด้วยโรคถ่ายทอด (มะเร็ง) → ลูกปกติได้ประวัติโรค · ลูกไม่ใช่ลูกไม่ได้ (seed ที่มีลูกให้เลือกทางสายเลือด)
  const E = await import('../src/engine/index.mjs');
  const heirHeredity = (notMine) => {
    // ชีวิตแรกจาก seed 5314 ขึ้นไปที่ตายแล้วมีลูกเป็นทายาท — การ์ดใหม่ขยับลำดับสุ่ม ฝัง seed เดียวแล้วไม่มีลูกได้
    let p, c;
    for (let k = 0; !c; k++) {
      if (k >= 200) throw new Error('heirHeredity: 200 seed แรกจาก 5314 ไม่มีชีวิตที่ตายแล้วมีลูกเป็นทายาท — ลำดับสุ่มขยับ ดูการ์ดที่เพิ่งเพิ่ม');
      ({ state: p } = playLife(mixSeed(1, 5314 + k), content, BOTS.สุ่ม));
      c = E.heirCandidates(p).find((m) => m.role === 'child');
    }
    p.cause = 'cancer';
    if (notMine) p.kin.find((m) => m.id === c.id).notMine = true;
    const af = E.startAfterlife(p);
    const P = E.PATHS.findIndex((x) => x.id === 'blood');
    for (let card = E.nextAfterCard(af); !card.done; card = E.nextAfterCard(af)) {
      if (card.kind === 'path') E.chooseAfter(af, P, c.id);
      else if (card.choices?.length) E.chooseAfter(af, Math.max(0, (card.locked ?? []).findIndex((x) => !x)));
    }
    return E.nextLife(af).heredity;
  };
  const hn = heirHeredity(false), hy = heirHeredity(true);
  check('ใบ 95 ทายาทจากลูกไม่ใช่ลูกเรา: ไม่ได้ประวัติโรคกรรมพันธุ์ของผู้ตาย (ลูกปกติ seed เดียวกันได้ cancer)', hn.includes('cancer') && !hy.includes('cancer'), `ปกติ ${hn} · ไม่ใช่ลูก ${hy}`);
  const pt = JSON.parse(readFileSync('data/paternity-test.json', 'utf8'));
  const ev95 = (id) => content.events.find((e) => e.id === id);
  check('ใบ 95 ปีตรวจพ่อ 2 ช่วง: การ์ดฐาน years[0] = pt.common · สำเนาหายาก years[0] = pt.from จบก่อน common และจำกัด กทม.', ['fam_not_mine_mid_01', 'fam_not_mine_old_01'].every((id) => ev95(id).years[0] === pt.common) && ['fam_not_mine_mid_rare_01', 'fam_not_mine_old_rare_01'].every((id) => ev95(id).years[0] === pt.from && ev95(id).years[1] === pt.common - 1 && ev95(id).when.province?.join() === 'กรุงเทพมหานคร') && pt.from < pt.common);
}

// รับบุตรบุญธรรม (ใบ 99 B114 ข้อ 147 160): op add child + adopted + age · เด็กเข้าบ้านเป็น child ทายาทเหมือนลูกทั่วไป · การ์ดขึ้นเฉพาะ ≥30 ไม่มีลูก เงินไม่ตึง
{
  const content = loadContent();
  const E = await import('../src/engine/index.mjs');
  const adopt = (seed, age, { married = false, sex = 'ชาย' } = {}) => {
    const st = newLife(seed, content);
    st.sex = sex;
    st.age = 25;
    if (married) applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
    // ธงคู่นอกใจเปิดไว้ — ลูกที่เกิดช่วงนี้ถูกทอยว่าไม่ใช่ลูกเรา · ลูกบุญธรรมต้องไม่ถูกทอย
    st.flags.spouse_cheated = true;
    st.flagAge.spouse_cheated = 34;
    st.age = 35;
    applyFamily(st, { sets_flags: ['has_kids'], family: [{ add: 'child', adopted: true, age }] });
    return st;
  };
  const stA = adopt(9100, 9, { married: true });
  const kidA = stA.kin.find((m) => m.role === 'child');
  check('ใบ 99 รับเด็กโต: เข้าบ้านเป็น child อายุตามที่เลือก · จด adopted/adoptAge · by = คู่ตอนรับ', !!kidA && kidA.adopted === true && kidA.adoptAge === 9 && E.memberAge(stA, kidA) === 9 && kidA.by === E.spouseOf(stA).id);
  check('ใบ 99 ลูกบุญธรรมไม่ผ่านการทอยลูกคนอื่น (ธงคู่นอกใจเปิด) · ธง has_kids ติด · นับเป็นลูกที่ยังอยู่ 1', kidA.notMine === undefined && stA.flags.has_kids === true && E.livingChildren(stA) === 1);
  const stB = adopt(9101, 2);
  const kidB = stB.kin.find((m) => m.role === 'child');
  check('ใบ 99 รับเด็กเล็กตอนโสด: อายุ 2 · by = null (ไม่มีคู่) · ไม่มีคู่ในบ้าน', E.memberAge(stB, kidB) === 2 && kidB.by === null && !stB.kin.some((m) => m.role === 'spouse'));
  // ทายาท: เด็กโตรับตอน 35 อายุ 9 → ตอนเรา 44 เด็กอายุ 18 อยู่ในช่วง HEIR_AGE ให้เลือกเล่นต่อสายเลือดได้
  stA.age = 44;
  const heirs = E.heirCandidates(stA);
  check('ใบ 99 ลูกบุญธรรมเป็นทายาท: เด็กอายุ 18 อยู่ในรายชื่อทายาทสายเลือด', heirs.length === 1 && heirs[0].id === kidA.id && heirs[0].age === 18);
  const single = content.events.find((e) => e.id === 'fam_adopt_single_01');
  const couple = content.events.find((e) => e.id === 'fam_adopt_couple_01');
  const base = (over = {}, married = false) => {
    const st = newLife(9102, content);
    st.age = 35;
    st.money = 1e8;
    if (married) applyFamily(st, { sets_flags: ['married'], family: [{ add: 'spouse' }] });
    return Object.assign(st, over);
  };
  const gate = (e, st) => whenOk(st, e.when);
  check('ใบ 99 การ์ดโสด: ออกที่ 35 ไม่มีลูก เงินพอ · ไม่ออกเมื่ออายุ 29 · มีลูกแล้ว · ติดหนี้ · เงินตึง · มีคู่',
    gate(single, base()) === true && gate(single, base({ age: 29 })) === false && gate(single, (() => { const s = base(); s.flags.has_kids = true; return s; })()) === false
      && gate(single, (() => { const s = base(); s.flags.in_debt = true; return s; })()) === false && gate(single, base({ money: 0 })) === false && gate(single, base({}, true)) === false);
  check('ใบ 99 การ์ดมีคู่: ออกเมื่อคู่อยู่ด้วยกัน · ไม่ออกเมื่อไม่มีคู่ · แยกทาง',
    gate(couple, base({}, true)) === true && gate(couple, base()) === false && gate(couple, (() => { const s = base({}, true); s.kin.find((m) => m.role === 'spouse').status = 'apart'; return s; })()) === false);
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [a, b] of rows) console.log(`${a.padEnd(w)}  ${b}`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`ไม่ผ่าน ${fails.length} ข้อ`);
  process.exitCode = 1;
} else console.log(`ผ่านทั้งหมด ${rows.length} ข้อ`);
