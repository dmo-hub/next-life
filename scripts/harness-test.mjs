// ทดสอบตัว harness เอง (ไม่ใช่เนื้อหา): ด่านต้องตกเมื่อควรตก · ตัวชี้ต้นเหตุคิดถูกบนตัวอย่างมือ · ตัวเทียบฐานจับของที่แย่ลง
// · บอทอ่านป้ายถูก กดเฉพาะตัวที่เปิด และเล่นซ้ำได้ผลเดิม — ใครแก้ harness/gates.mjs หรือ bots.mjs จนด่านผ่านง่ายเกิน ไฟล์นี้ตก
import { playLife, newLife, mixSeed, makeRng, openChoices, familyOk, lifeGateOpen, GATE_FLAG, OFFICE_GATE } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
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
  const planned = (seed, plan) => {
    const isk = I.startIsekai({ seed });
    let seg = 0, left = plan[0][1];
    const want = () => plan[seg][0];
    const hold = (c) => I.chooseIsekai(isk, isk.focusOffers.includes(want()) ? isk.focusOffers.indexOf(want()) : isk.focusOffers.indexOf('rest'));
    for (let g = 0; g < 3000 && seg < plan.length; g++) {
      const c = I.nextIsekaiCard(isk);
      if (c.step === 'end') return null;
      if (c.step === 'world' || c.step === 'skill' || c.step === 'event') I.chooseIsekai(isk, 0);
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

const w = Math.max(...rows.map((r) => r[0].length));
for (const [a, b] of rows) console.log(`${a.padEnd(w)}  ${b}`);
if (fails.length) {
  for (const f of fails) console.log(`  ✗ ${f}`);
  console.log(`ไม่ผ่าน ${fails.length} ข้อ`);
  process.exitCode = 1;
} else console.log(`ผ่านทั้งหมด ${rows.length} ข้อ`);
