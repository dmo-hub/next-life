// ทดสอบตัว harness เอง (ไม่ใช่เนื้อหา): ด่านต้องตกเมื่อควรตก · ตัวชี้ต้นเหตุคิดถูกบนตัวอย่างมือ · ตัวเทียบฐานจับของที่แย่ลง
// · บอทอ่านป้ายถูก กดเฉพาะตัวที่เปิด และเล่นซ้ำได้ผลเดิม — ใครแก้ harness/gates.mjs หรือ bots.mjs จนด่านผ่านง่ายเกิน ไฟล์นี้ตก
import { playLife, newLife, mixSeed, makeRng, openChoices, familyOk, lifeGateOpen, GATE_FLAG, OFFICE_GATE, moneyTight, sinPicks, DARK_GATE, nextLife, playAfterlife, whenOk, choose, monthlyIncome, snapshot, restore, repairLife, PAST_TALENT, picksAfter } from '../src/engine/index.mjs';
import { loadContent, loadEvents } from '../src/node/load.mjs';
import { gate3b, gate4, blame, compareBaseline, gate3bTol, GATE3B_Z, splitDeadChoices, MIN_EXPECTED_PICKS, MIN_LIVES, AGE_TOL, CARD_MIN, CARD_MAX } from '../harness/gates.mjs';
import { BOTS, readFx, random, botFlows, FOCUS_FLOW_SHARE } from '../harness/bots.mjs';
import { kinGaps, kinDeadRefs, familyLockShort } from '../harness/kin.mjs';

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
  const run = (parentFlags) => {
    const seen = [];
    const p = newLife(5, content);
    playLife(5, content, pick, (c) => seen.push(c), newLife(5, content, { birthYear: p.birthYear, sex: p.sex, region: { name: p.region, ses: p.ses }, cls: p.cls, bonus: {}, parentFlags }));
    return { probe: seen.filter((c) => c.id === 'pf_probe'), keyed: seen.filter((c) => 'parentFrom' in c) };
  };
  const none = run({}), smoker = run({ smoker: 1 }), other = run({ heavy_drinker: 1 });
  check('B159 ไม่มีธงพ่อแม่ = การ์ดอ่านธงไม่ออก · ไม่มีช่อง parentFrom', !none.probe.length && !none.keyed.length && !other.probe.length && !other.keyed.length);
  check('B159 ถือธงตรง = การ์ดออก ป้าย [{flag, tier}] เฉพาะใบนั้น', smoker.probe.length > 0 && smoker.keyed.length === smoker.probe.length && JSON.stringify(smoker.probe[0].parentFrom) === '[{"flag":"smoker","tier":1}]');
}

// ประตูเข้าสาย (โฟกัสใบ 04): ตัวเลือกติดป้าย gate ซ่อน (hidden + locked) จนประตูเปิด — ไม่ตัดออก เลขลำดับจึงตรงเนื้อหา · ประตูเปิดจากโฟกัสครบ chain_years · ทายาท · ธงชวน
// การ์ดชวนลงสมัครตอนยังไม่มีตำแหน่ง = ประตูการเมือง · บอทมีนโยบายโฟกัส ~1/3 ตามน้ำ
{
  const base = loadContent();
  const byId = new Map(base.events.map((e) => [e.id, e]));
  const gated = base.events.filter((e) => e.choices.some((c) => c.gate));
  const probe = { id: 'gate_probe', type: 'A', category: 'work_money', stage: 'ทำงาน', years: [2400, 2700], weight: 100000, text: 'probe', choices: [
    { id: 'open', text: 'เปิดกิจการ', gate: 'business', merit: [{ cat: 'neutral' }] }, ...[1, 2, 3].map((i) => ({ id: `n${i}`, text: `อื่น ${i}`, merit: [{ cat: 'neutral' }] })),
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
  check('ใบ 04 โฟกัสสะสมครบ chain_years = ตัวเลือกขึ้น', seen((st) => (st.focusYears = { business: base.focus.chain_years })) === 4);
  check('ใบ 04 โฟกัสสะสมไม่ครบ = ยังซ่อน', seen((st) => (st.focusYears = { business: base.focus.chain_years - 1 })) === 3);
  check('ใบ 04 ทายาทรับประตูที่รุ่นก่อนเปิด = ขึ้นโดยไม่ต้องสะสมเอง', seen((st) => (st.gates = ['business'])) === 4);
  check('ใบ 04 ธงชวน gate:<โฟกัส> = ขึ้น', seen((st) => (st.flags[GATE_FLAG + 'business'] = true)) === 4);

  // ชีวิตจริงทั้งกอง: จำนวนตัวเลือกบนการ์ดที่ติดป้าย = ตามสถานะประตูตอนการ์ดออก · ชีวิตตามน้ำ/ประตูปิดไม่เคยเห็นตัวเลือกประตู
  const N = 1200;
  let wrong = 0, flowLives = 0, flowGatedCards = 0, flowGateChoices = 0, invites = 0, invitesClosed = 0, bizLives = 0, bizInvite = 0, polFocus = 0, polOffice = 0;
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
        if (botFlows(s)) { flowGatedCards++; flowGateChoices += ev.choices.filter((x, k) => x.gate && !c.hidden?.[k]).length; }
      }
      if (/^office_/.test(c.id ?? '') && !s.office) { invites++; if (!lifeGateOpen(s, OFFICE_GATE)) invitesClosed++; }
      if (c.id === 'biz_politics_invite_01') invited = true;
    });
    if (botFlows(st)) flowLives++;
    if (st.flags.own_business && !(st.focusYears?.politics_base)) { bizLives++; if (invited) bizInvite++; }
    if ((st.focusYears?.politics_base ?? 0) >= base.focus.chain_years) { polFocus++; if ((st.officeTop ?? -1) >= 0) polOffice++; }
  }
  check('ใบ 04 ตัวเลือกบนการ์ดติดป้าย: ครบตามเนื้อหา · ซ่อน+ล็อกตรงสถานะประตู (ทั้งกอง)', wrong === 0, `ไม่ตรง ${wrong}`);
  check('ใบ 04 การ์ดชวนลงสมัครออกเฉพาะประตูการเมืองเปิด', invitesClosed === 0 && invites > 0, `ชวน ${invites} · ประตูปิดแต่ออก ${invitesClosed}`);
  const share = flowLives / N;
  check('ใบ 04 บอทตามน้ำราว 1/3', Math.abs(share - FOCUS_FLOW_SHARE) < 0.05, `${(share * 100).toFixed(1)}%`);
  check('ใบ 04 ชีวิตตามน้ำยังเจอการ์ดทั่วไปที่มีประตู แต่ไม่เห็นตัวเลือกประตู', flowGatedCards > 0 && flowGateChoices === 0, `การ์ด ${flowGatedCards} · ตัวเลือกประตูที่เห็น ${flowGateChoices}`);
  check('ใบ 04 นักธุรกิจที่ไม่โฟกัสการเมืองถูกชวนลงการเมือง > 0', bizInvite > 0, `${bizInvite}/${bizLives}`);
  check('ใบ 04 บอทที่โฟกัสการเมืองครบ ได้ตำแหน่ง > 0', polOffice > 0, `${polOffice}/${polFocus}`);
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
  check('ใบ 05a ปีอาชีพต่างโลก = chain_years โลกหลัก', I.ISEKAI_CAREER_T.years === base.focus.chain_years, `${I.ISEKAI_CAREER_T.years} · ${base.focus.chain_years}`);
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
// ตัวควบคุม heir_nature 0 (เจ้าของเคาะ): seed เดียวกัน ชีวิตแรกเดินเหมือนกันทุกหลัก และแต้มไม่มีผลก่อนล็อก
// ⇒ ทายาทรุ่นแรกต่างกันแค่แต้มทุ่มเทที่ได้จากพ่อแม่ — ทายาทที่ได้นิสัยเดียวกันต้องลดลง ไม่งั้นสายแต้มทายาทไม่ต่อ
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
  const real = heirs(40);
  check('B41 ทายาทได้นิสัยเดียวกับพ่อแม่ ≤ 50%', real.all >= 50 && real.pct <= 50, `${real.same}/${real.all} = ${f2(real.pct)}%`);
  const keep = content.focus.heir_nature;
  content.focus.heir_nature = 0;
  const zero = heirs(40);
  content.focus.heir_nature = keep;
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
  check('ขั้นค่าซ้อนทับ: ขั้น 2–4 ยังไปไม่ถึงจนใบ 16 ใส่เกณฑ์ (ค่าสูงแค่ไหนก็ขั้น 1)', E.OVERLAP_STAGE_MIN.length === 5 && E.OVERLAP_STAGE_MIN[1] === 1 && E.overlapStageOf(st) === 1, String(E.overlapStageOf(st)));
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
  const run = (events, botName, n) => {
    const content = { ...base, events: [...base.events, ...events] };
    const ids = new Set(events.map((e) => e.id));
    let lives = 0, shown = 0, closed = 0;
    for (let i = 0; i < n; i++) {
      let hit = false;
      playLife(mixSeed(0xb99a, i), content, BOTS[botName], (card, st) => {
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
  for (let k = 10; k < 400 && !blood; k++) {
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

const w = Math.max(...rows.map((r) => r[0].length));
for (const [a, b] of rows) console.log(`${a.padEnd(w)}  ${b}`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`ไม่ผ่าน ${fails.length} ข้อ`);
  process.exitCode = 1;
} else console.log(`ผ่านทั้งหมด ${rows.length} ข้อ`);
