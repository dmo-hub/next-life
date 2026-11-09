// เส้นเตรียมทหาร (B-cadet): สนามสอบเฟส 2 + ฉากรอบสมัคร/ปีสอบซ้ำ เป็นทริปของตัวเองแบบเดียวกับทริปศาล (court.mjs)
// st.cadet = ลำดับขั้นที่กำลังเล่น (null = ไม่มี) · st.cadetInfo = ความจำข้ามปี (สอบกี่ครั้ง · ตกเพราะอะไร · ใบสมัคร)
// ทุกค่าใน state เป็นข้อมูลล้วน (เซฟได้) · สุ่มจาก stream ของตัวเอง (seed ^ SALT + ตัวนับ) ไม่แตะ rng ของโลก
// เนื้อหา/ตัวเลข: content/rules/cadet.yaml (ที่มา: demo ที่เจ้าของเคาะ 2026-11-05) · fx ในไฟล์นั้นเป็นหน่วย demo (×numbers.fx_unit แต้ม)
import { STAT_KEYS, fill, stageOf, fxTag, TAG_MID, whenOk } from './life.mjs';

// ทั้งไฟล์อยู่ใน scope เดียว — build ต่อทุกไฟล์เป็นสคริปต์เดียว ชื่อภายในจึงต้องไม่หลุดไปชนไฟล์อื่น
const CADET = (() => {
  const SALT = 0x5eedcade;
  const BR = ['army', 'navy', 'airforce', 'police'];
  const POOR = ['ยากไร้', 'ยากจนมาก', 'ยากจน', 'ค่อนข้างจน'];
  const RICH = ['ชนชั้นกลางบน', 'มีอันจะกิน', 'มั่งคั่ง', 'ร่ำรวย'];
  const TH_NUM = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่'];

  // ---------- helpers ----------
  const D = (st) => st.content.cadet ?? {};
  const N = (st) => D(st).numbers ?? {};
  // ปีจากรายงานตัวถึงติดยศ = เตรียมทหาร + โรงเรียนเหล่า (numbers.prep_years + academy_years) · ติดยศที่อายุสอบติด + ค่านี้
  const commissionYears = (st, b) => (N(st).prep_years ?? 2) + (N(st).academy_years?.[b] ?? 5);
  const BT = (st, b) => (D(st).branches ?? {})[b] ?? b;
  const info = (st) => (st.cadetInfo ??= { tries: 0 });
  function rand(st) {
    const I = info(st);
    let t = ((st.seed ^ SALT) + Math.imul((I.n = (I.n ?? 0) + 1), 0x9e3779b1)) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const pickOne = (st, a) => a[Math.floor(rand(st) * a.length)];
  const shuffle = (st, a) => a.map((x) => [rand(st), x]).sort((p, q) => p[0] - q[0]).map((x) => x[1]);
  const year = (st) => st.birthYear + st.age;
  const has = (st, f) => !!st.flags[f];
  const hasPrefix = (st, p) => Object.keys(st.flags).some((k) => k.startsWith(p) && st.flags[k]);
  const clsGroup = (st) => (POOR.includes(st.cls) ? 'poor' : RICH.includes(st.cls) ? 'rich' : 'mid');
  function family(st) {
    const m = st.parents?.find((p) => p.sex === 'หญิง')?.alive, f = st.parents?.find((p) => p.sex === 'ชาย')?.alive;
    return m && f ? 'both' : m ? 'mother' : f ? 'fatherOnly' : 'none';
  }
  const heirOf = (st) => (st.parentFlags?.army_family ? 'army' : st.parentFlags?.police_family ? 'police' : null);
  const elder = (st) => ({ both: 'แม่', mother: 'แม่', fatherOnly: 'พ่อ' })[family(st)] ?? 'ป้า';
  const secretNow = (st) => has(st, 'cadet_family_secret');
  const checker = (st) => (secretNow(st) ? 'เพื่อนสนิท' : elder(st));
  // หมวกใบเก่าของพ่อ/แม่ที่เป็นทหาร/ตำรวจ (D3 บท S1 รอบ 2 · เจ้าของรับ 2026-11-06): ทายาทมาจากพ่อหรือแม่ (parents[].ancestor) ไม่ใช่ตา
  // ไม่รู้ว่าใคร (ทายาทจากสุ่มตอนเกิด) = ถือว่าพ่อ
  function heirHat(st, heir) {
    const hat = heir === 'police' ? 'ตำรวจ' : 'ทหาร', ps = st.parents ?? [];
    const hp = ps.find((p) => p.ancestor) ?? ps.find((p) => p.sex === 'ชาย') ?? { sex: 'ชาย' }, dad = hp.sex === 'ชาย';
    const who = dad ? 'พ่อ' : 'แม่', young = dad ? 'ตอนหนุ่ม ๆ' : 'ตอนสาว ๆ', other = ps.find((p) => p !== hp && p.alive);
    if (hp.alive) return `${who}หยิบหมวก${hat}ใบเก่าออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือน${who}${young}"`;
    if (other) return `${other.sex === 'ชาย' ? 'พ่อ' : 'แม่'}หยิบหมวกใบเก่าของ${who}ออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือน${who}${young}"`;
    return `ป้าหยิบหมวก${hat}ใบเก่าของ${who}ออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือน${who}เอ็ง${young}"`;
  }
  // ที่ตั้งโรงเรียนตามปี (numbers.campus_*) — แทน "นครนายก" ที่เคยเขียนตายทุกยุค
  const campus = (st) => (year(st) < (N(st).campus_nayok_year ?? 2543) ? 'กรุงเทพฯ' : 'นครนายก');
  // การ์ดผิดหวัง (G4 · เจ้าของสั่ง 2026-11-06): คนเก็บหมวกกลับเข้าตู้ใช้หลักเดียวกับ heirHat — พ่อ/แม่ที่รับราชการถ้ายังอยู่ · ไม่งั้นอีกคน · ไม่มีพ่อแม่ = ป้า
  function heirHatBack(st, heir) {
    const hat = heir === 'police' ? 'ตำรวจ' : 'ทหาร', ps = st.parents ?? [];
    const hp = ps.find((p) => p.ancestor) ?? ps.find((p) => p.sex === 'ชาย') ?? { sex: 'ชาย' }, who = hp.sex === 'ชาย' ? 'พ่อ' : 'แม่';
    const other = ps.find((p) => p !== hp && p.alive);
    if (hp.alive) return `${who}เก็บหมวก${hat}ใบเก่ากลับเข้าตู้ ไม่ได้พูดถึงอีก`;
    return `${other ? (other.sex === 'ชาย' ? 'พ่อ' : 'แม่') : 'ป้า'}เก็บหมวก${hat}ใบเก่าของ${who}กลับเข้าตู้ ไม่ได้พูดถึงอีก`;
  }
  const txt = (v) => (typeof v === 'string' ? v : v?.text ?? '');

  // ปีเริ่มยุคอ้างชื่อค่าใน numbers ได้ (เช่น yearFrom: mobile_year) แทนเลขฝัง
  const yearOf = (st, v) => (typeof v === 'string' ? N(st)[v] : v);
  // เงื่อนไขในไฟล์เนื้อหา (สคีมา demo) · คีย์ที่ไม่รู้จักถือว่าผ่าน เหมือน demo
  function condOk(st, c) {
    if (!c) return true;
    const fam = family(st), heir = heirOf(st);
    if (c.sex && c.sex !== st.sex) return false;
    if (c.regions?.length && !c.regions.includes(st.region)) return false;
    if (c.notRegions?.includes(st.region)) return false;
    if (c.heir && heir !== c.heir) return false;
    if (c.notHeir && [].concat(c.notHeir).includes(heir)) return false;
    if (c.classes?.length && !c.classes.includes(clsGroup(st)) && !c.classes.includes(st.cls)) return false;
    if (c.anyFlags && !c.anyFlags.some((f) => has(st, f))) return false;
    if (c.yearMin && year(st) < c.yearMin) return false;
    if (c.yearMax && year(st) > c.yearMax) return false;
    if (c.yearFrom && year(st) < yearOf(st, c.yearFrom)) return false;
    if (c.yearBefore && year(st) >= yearOf(st, c.yearBefore)) return false;
    if (c.school?.length && !c.school.includes(st.school)) return false;
    if (c.flagsHas?.some((f) => (f.endsWith(':') ? !hasPrefix(st, f) : !has(st, f)))) return false;
    if (c.flagsNot?.some((f) => (f.endsWith(':') ? hasPrefix(st, f) : has(st, f)))) return false;
    if (c.flagsHasPrefix && !hasPrefix(st, c.flagsHasPrefix)) return false;
    if (c.family === 'mother' && !(fam === 'both' || fam === 'mother')) return false;
    if (c.family === 'fatherOnly' && fam !== 'fatherOnly') return false;
    if (c.noParents && fam !== 'none') return false;
    if (c.poor === true && clsGroup(st) !== 'poor') return false;
    if (c.poor === false && clsGroup(st) === 'poor') return false;
    return true;
  }
  // requires ของตัวเลือก: คีย์ rival* ล็อกไว้จนกว่าจะมีระบบเพื่อนคู่แข่ง (เจ้าของเคาะ 2026-11-06) · ที่เหลือใช้ condOk
  const reqOk = (st, r) => !Object.keys(r).some((k) => k.startsWith('rival')) && condOk(st, r);
  const lockOf = (st, o) => o.lock ?? (o.requires && !reqOk(st, o.requires) ? fill(o.lockReason ?? 'ยังเลือกไม่ได้', st) : null);
  const firstOk = (st, list) => [].concat(list ?? []).find((c) => !c.cond || condOk(st, c.cond)) ?? [].concat(list ?? [])[0];

  // fx หน่วย demo → แต้มจริง (เงินไม่ใช้ — หน่วยเงินของ demo ไม่ใช่บาท)
  function applyFx(st, fx) {
    if (!fx) return;
    const u = N(st).fx_unit ?? 5;
    for (const k of STAT_KEYS) if (fx[k]) st[k] = Math.max(0, Math.min(100, st[k] + fx[k] * u));
  }
  const setFlags = (st, o) => {
    for (const f of o.setFlags ?? []) st.flags[f] = true;
    for (const f of o.clearFlags ?? []) delete st.flags[f];
  };

  // ---------- card shapes ----------
  const C = (id, title, text, options, extra = {}) => ({ id, title, text, options, ...extra });
  const status = (title, text) => C('cadet_status', title, text, [{ label: 'ต่อ' }]);
  function render(st, c) {
    let text = fill(c.text ?? '', st);
    const hit = (c.contextLines ?? []).find((x) => condOk(st, x.when));
    if (hit) text += ' ' + fill(hit.line, st);
    // ล็อกปุ่ม (เจ้าของเคาะ 2026-11-06): requires ไม่ผ่าน = ล็อก พร้อม lockReason จากเนื้อหา · ล็อกครบทุกปุ่ม = ปลดปุ่มสุดท้าย กันเกมค้าง
    const options = (c.options?.length ? c.options : [{ label: 'ต่อ' }]).map((o) => ({ ...o, lock: lockOf(st, o) }));
    if (options.every((o) => o.lock)) options[options.length - 1].lock = null;
    st.cadet.cur = options;
    st.cadet.curId = c.id;
    return {
      kind: 'event', cadet: true, id: `cadet:${c.id}`, type: 'A', national: false, funeral: false,
      age: st.age, stage: stageOf(st.age), title: c.title ? fill(c.title, st) : null, text,
      choices: options.map((o) => fill(o.label, st)),
      hints: options.map((o) => (o.hint ? fill(o.hint, st) : null)),
      fx: options.map(() => ''),
      locked: options.map((o) => o.lock ?? null),
    };
  }

  // ---------- entry points (called from life.mjs) ----------
  // เปิดลำดับใหม่ (ทับลำดับเดิมไม่ได้ — ต่อท้ายแทน)
  function start(st, steps, extra = {}) {
    if (st.cadet) st.cadet.steps.push(...steps);
    else st.cadet = { steps: [...steps], cur: null, ...extra };
  }
  const _cadetActive = (st) => !!st.cadet && !(st.cadet.afterQueue && st.queue.length) && !(st.cadet.waitAge > st.age);

  // หลังเลือกตัวเลือกของการ์ดเนื้อหาปกติ: ตั้งใจสอบครั้งแรก · ยื่นใบสมัคร · เช้าวันสอบ
  function _cadetAfterChoice(st, ev, c, flagsBefore) {
    if (st.sex !== 'ชาย') return;
    const nowDream = has(st, 'cadet_dream');
    const applies = (c.schedules ?? []).some((s) => /^cadet_exam_night/.test(s.event));
    // ยังไม่เคยแตะเส้นนี้ = ไม่สร้าง cadetInfo (ไม่ให้ค่าค้างในเซฟของชายทุกคน)
    if (!st.cadetInfo && !nowDream && !applies && ev.id !== 'cadet_exam_morning') return;
    const I = info(st);
    if (nowDream && !flagsBefore.cadet_dream && !I.criteria) {
      I.criteria = true;
      start(st, [['criteria']]);
    }
    if (applies) {
      // ยื่นใบสมัคร = เลือกเหล่าตอนนี้ (ไม่ใช่เช้าวันสอบ) · ปีสอบซ้ำ: แผ่นเกณฑ์ → ติวอีกรอบไหม → ติว/รอ → คืนก่อนสอบแบบปีที่สอง
      I.order = [];
      if (I.tries > 0) {
        st.scheduled = st.scheduled.filter((x) => !/^cadet_exam_(night|morning)/.test(x.event));
        start(st, [['apply'], ['crit2'], ['reprep']]);
      } else start(st, [['apply']]);
    }
    if (ev.id === 'cadet_exam_morning') start(st, [['exam']]);
  }

  // การ์ดใบถัดไปของลำดับ · null = จบลำดับ (life.mjs ปิดให้)
  function _cadetCard(st) {
    const K = st.cadet;
    while (K.steps.length) {
      const [name, ...a] = K.steps.shift();
      const c = STEP[name]?.(st, ...a);
      if (c === 'END') break;
      if (c === 'HOLD') return null;   // ลำดับยังอยู่ รอปีหน้า (st.cadet.waitAge)
      if (c) return c.kind === 'result' ? c : render(st, c);
    }
    st.cadet = null;
    return null;
  }

  function _chooseCadet(st, idx) {
    const K = st.cadet, o = K?.cur?.[idx];
    if (!o) throw new Error('ตัวเลือกไม่ถูกต้อง');
    if (o.lock) throw new Error('ตัวเลือกนี้ล็อกอยู่');
    K.cur = null;
    const I = info(st), P = K.p2;
    applyFx(st, o.fx);
    setFlags(st, o);
    let result = o.result;
    // ป้ายหมวดการ์ดผล (ui-redo 60): ทิศจากผลค่ารวมของตัวเลือก + ผลสุ่ม · ต้นทาง = การ์ดเส้นเตรียมทหารที่เพิ่งเลือก
    const fxSum = { ...o.fx };
    const evId = `cadet:${K.curId}`;
    // ผลสุ่มของตัวเลือก (outcomes: p + fx + result)
    const outs = (o.outcomes ?? []).filter((x) => !x.whenFlag || has(st, x.whenFlag));
    if (outs.length) {
      const tot = outs.reduce((s, x) => s + (x.p ?? 1), 0);
      let r = rand(st) * tot, pick = outs.at(-1);
      for (const x of outs) if ((r -= x.p ?? 1) <= 0) { pick = x; break; }
      result = pick.result ?? result;
      applyFx(st, pick.fx);
      for (const [k, v] of Object.entries(pick.fx ?? {})) fxSum[k] = (fxSum[k] ?? 0) + v;
      for (const f of pick.setFlags ?? []) st.flags[f] = true;
      if (pick._injure && P) P.steps = [['injury'], ['failed']];
    }
    // ----- actions -----
    if (o._toggle) { I.order.push(o._toggle); K.steps.unshift(['apply']); }
    if (o._submit) st.log?.push({ id: 'cadet_apply', age: st.age, text: I.order.map((b) => BT(st, b)).join(' · ') });
    if (o._score != null) { P.scores[o._branch] = (P.scores[o._branch] ?? 0) + o._score; return; }
    if (o._iv != null) { P.iv = (P.iv ?? 0) + o._iv; if (!result) return; }
    if (o._how && P) P.how = o._how;
    if (o._fold) I.folded = true;
    if (o._phys === 'wait' && P) {
      const r = o._round ?? 'phys';
      P.askNs[r] = (P.askNs[r] ?? 0) + 1;
      P.steps.unshift(P.askNs[r] >= (N(st).ask_max ?? 5) ? ['noShow', r] : ['physAsk', r]);
    }
    if (o._reprep === 'again') reprepAgain(st);
    if (o._reprep === 'skip') K.steps.push(['wait1'], ['wait2'], ['e9r'], ['mornr'], ['exam']);
    if (o._pick) P.steps = o._pick === 'none' ? [['declineAll']] : [['pack', o._pick]];
    if (o._report === 'go') P.steps = [['arrive', P.chosen]];
    if (o._report === 'wait') P.steps = [['extraDays'], ['reportAsk', 1]];
    if (o._report === 'no') P.steps = [['noReport'], ['letDown', 'report'], ['failed']];
    if (result) K.steps.unshift(['res', result, fxTag(fxSum), evId]);
  }

  // ปีสอบซ้ำ "ติวอีกรอบ": ใบเลือกวิธีติวของเนื้อหาเดิมกลับมา + ใบความตั้งใจ/ฝึกพละ แล้วคืนก่อนสอบแบบปีที่สอง
  function reprepAgain(st) {
    for (const f of ['cadet_prep_camp', 'cadet_prep_group', 'cadet_prep_self', 'cadet_prep_senior']) delete st.flags[f];
    const evs = st.content.events;
    const choice = evs.find((e) => e.id === 'cadet_prep_choice');
    st.cadet.afterQueue = true;
    // retake = ใบที่ปีสอบซ้ำดึงกลับมาเอง ไม่ได้มาจาก schedules ด่าน continuity จึงไม่เทียบกับปีที่นัด
    st.cadet.retake = [];
    if (choice) requeue(st, choice);
    st.cadet.steps.push(['reprepCards'], ['e9r'], ['mornr'], ['exam']);
  }
  function requeue(st, e) {
    delete st.done[e.id];
    st.cadet.retake.push(e.id);
    st.queue.push({ kind: 'eraEvent', ev: e, age: st.age });
  }

  // ---------- steps ----------
  const S = {};
  const STEP = S;
  // เซฟเก่าที่ค้างขั้น ['res', text] ไม่มีป้าย = หมวดกลาง (ตามกติกา resultTag)
  S.res = (st, text, tag = TAG_MID, evId) => ({ kind: 'result', cadet: true, type: 'A', age: st.age, stage: stageOf(st.age), text: fill(text, st), tag, ...(evId && { evId }) });

  const bodyRule = (st) => { const b = N(st).body_min; return `ชีวิต ตร. ${b.police} · ทร. ${b.navy} · ทอ. ${b.airforce} · ทบ. ${b.army} ขึ้นไป (รวมว่ายน้ำ 50 เมตร)`; };
  // list = เหล่าที่จะเทียบ (ค่าเริ่ม = ทั้งสี่เหล่า · near_exam ส่งเฉพาะเหล่าที่ยังอยู่ในสนาม)
  function bodyReach(st, h = Math.round(st.health), list = BR) {
    const b = N(st).body_min;
    const ok = list.filter((x) => h >= b[x]), next = list.filter((x) => h < b[x]).sort((p, q) => b[p] - b[q])[0];
    return `ชีวิต ${h} → ${ok.length ? 'ถึง ' + ok.map((x) => BT(st, x)).join(' ') : 'ยังไม่ถึงสักเหล่า'}${next ? ` · ขาดอีก ${b[next] - h} ถึง ${BT(st, next)}` : ''}`;
  }
  function knowLine(st) {
    const k = Math.round(st.knowledge), m = N(st).know_min;
    return `ความรู้ ${k} ${k >= m ? '✓' : '✗'}${k < m ? ` (ขาดอีก ${m - k})` : ''}`;
  }
  S.criteria = (st, retry = false) => C(retry ? 'crit2' : 'criteria', retry ? 'เกณฑ์สอบปีนี้' : 'แผ่นเกณฑ์รับสมัครสี่เหล่า',
    (retry ? 'ยื่นใบสมัครแล้ว แนบมากับบัตรสอบคือแผ่นเกณฑ์ปีนี้ เหมือนปีก่อนทุกข้อ\n\n' : 'ครูแนะแนวยื่นกระดาษแผ่นหนึ่งให้ เป็นเกณฑ์ที่เหมือนกันทั้งสี่เหล่า ทบ. ทร. ทอ. ตร.\n\n') +
    `• ผู้สมัคร: ชาย อายุ 16–18 ปี เรียน ม.ปลาย หรือ ปวช. · สอบได้ปีละครั้ง\n` +
    `• ข้อเขียน: แบบวัดความพร้อมของแต่ละเหล่า ได้อย่างน้อย ${N(st).written_min} จาก 25 และความรู้ ${N(st).know_min} ขึ้นไป\n` +
    `• พลศึกษาและตรวจร่างกาย (สอบวันเดียวกัน): ${bodyRule(st)}\n• สัมภาษณ์\n• สมัครได้หลายเหล่า แต่ละเหล่าสอบคนละวัน ติดหลายเหล่าเลือกได้เหล่าเดียว\n\n` +
    `ตอนนี้ {ชื่อ}: ${knowLine(st)} · ${bodyReach(st)}`,
    retry ? [
      { label: 'ไล่ดูทีละข้อ เทียบกับตัวเอง', result: 'ข้อไหนถึงแล้ว ข้อไหนยังขาด เห็นชัดกว่าปีก่อน' },
      { label: 'ติดไว้ข้างโต๊ะเหมือนเดิม', fx: { knowledge: 1 }, result: 'ติดทับรอยเทปเก่าของปีก่อน' },
      { label: 'วงข้อที่ปีก่อนพลาดไว้', result: 'วงปากกาแดงไว้ข้อเดียว แล้ววงซ้ำอีกรอบ' },
      { label: 'พับใส่กระเป๋าไว้กับบัตรสอบ', result: 'บัตรสอบกับแผ่นเกณฑ์อยู่ในซองเดียวกัน' }]
    : [
      { label: 'จดเกณฑ์ไว้ ตั้งเป้าทำความรู้ให้ถึง', fx: { knowledge: 1 }, result: 'ติดกระดาษไว้ข้างโต๊ะ เขียนเลขเป้าหมายตัวโตไว้มุมบน' },
      { label: 'เริ่มวิ่งตอนเช้าให้ร่างกายพร้อม', fx: { health: 1 }, result: 'ตั้งนาฬิกาปลุกตีห้า พรุ่งนี้เริ่มวิ่งรอบหมู่บ้าน' },
      { label: 'ถามครูว่าเตรียมตัวยังไงดี', fx: { network: 1 }, setFlags: ['cadet_tips'], result: 'ครูเล่าว่ารุ่นพี่ที่ติด เริ่มอ่านจริงจังก่อนสอบสองปี' },
      { label: 'พับเก็บไว้ ยังมีเวลาอีกหลายปี', _fold: true, result: 'กระดาษถูกพับสี่ทบ เก็บไว้ในกระเป๋านักเรียน' }]);
  S.crit2 = (st) => S.criteria(st, true);

  const LASTFAIL = { written: 'ปีก่อนตกตั้งแต่ข้อเขียน', land: 'ปีก่อนพลาดที่สนามพลศึกษา', injury: 'ปีก่อนซ้อมหนักจนเจ็บก่อนวันสอบพละ',
    interview: 'ปีก่อนตกรอบสัมภาษณ์', noshow: 'ปีก่อนผ่านข้อเขียน แต่ไม่ได้ไปสอบพลศึกษา', noshow_iv: 'ปีก่อนผ่านถึงรอบสัมภาษณ์ แต่ไม่ได้ไปสัมภาษณ์', noreport: 'ปีก่อนติดแล้ว แต่ไม่ไปรายงานตัว' };
  S.season = (st) => C('season', 'ฤดูสอบวนกลับมา',
    `ใบปลิวกวดวิชาเตรียมทหารเริ่มติดเต็มบอร์ดหน้าโรงเรียนอีกครั้ง เหลืออีกไม่กี่เดือนก็ถึงวันสอบ\n${LASTFAIL[info(st).lastFail] ?? 'ปีก่อนยังไม่ติด'}\n\nตอนนี้ {ชื่อ}: ${knowLine(st)} · ${bodyReach(st)}`, [
      { label: 'ทบทวนบทที่อ่อนใหม่ตั้งแต่ต้น', fx: { knowledge: 1 }, result: 'เปิดสมุดเล่มปีก่อน รอยปากกาแดงยังอยู่ทุกหน้า' },
      { label: 'เริ่มวิ่งตอนเช้าอีกครั้ง', fx: { health: 1 }, result: 'รองเท้าคู่เดิมยังใส่ได้ แต่วิ่งรอบแรกเหนื่อยกว่าที่คิด' },
      { label: 'ไปหัดว่ายน้ำที่สระเทศบาล', fx: { health: 1 }, setFlags: ['can_swim'], result: 'สมัครสระรายเดือน ไปทุกเย็นวันเสาร์' },
      { label: 'ยังไม่อยากคิดเรื่องสอบตอนนี้', fx: { happiness: 1 }, result: 'เดินผ่านบอร์ดไปเฉย ๆ แต่ยังจำวันสอบได้' }]);

  // ใบสมัคร: ติ๊กทีละช่อง (ลำดับที่ติ๊ก = ลำดับวันสอบ) แล้วส่ง
  S.apply = (st) => {
    const ap = firstOk(st, D(st).apply) ?? {}, I = info(st);
    const left = BR.filter((b) => !I.order.includes(b));
    const tog = (b) => (ap.toggles ?? []).find((t) => t.branch === b) ?? { label: `ติ๊กช่อง ${BT(st, b)}` };
    const picked = I.order.length ? `\n\nติ๊กแล้ว: ${I.order.map((b) => BT(st, b)).join(' → ')} (ลำดับนี้คือลำดับวันสอบ)` : '\n\nติ๊กตามลำดับที่อยากสอบ แต่ละเหล่าสอบคนละวัน';
    return C('apply', ap.title ?? 'ช่องเหล่าในใบสมัคร', (ap.text ?? 'เลือกเหล่าที่จะสมัครสอบ') + picked, [
      ...left.map((b) => ({ label: tog(b).label, hint: tog(b).hint, _toggle: b })),
      { label: `ส่งใบสมัคร${I.order.length ? ` (${I.order.length} เหล่า)` : ''}`, _submit: true, lock: I.order.length ? null : ap.submit?.lockReason ?? 'ยังไม่ได้ติ๊กสักช่อง' }], { contextLines: ap.contextLines });
  };

  S.reprep = (st) => {
    const k = Math.round(st.knowledge), ready = k >= N(st).know_min && st.health >= N(st).body_min.army;
    return C('reprep', 'ติวอีกรอบไหม', `เหลือเวลาก่อนวันสอบอีกไม่กี่เดือน ปีก่อนติวมาแล้วหนึ่งรอบ\n${knowLine(st)} · ${bodyReach(st)}\n${ready ? 'ถึงเกณฑ์ทุกข้อของทุกเหล่าแล้ว' : 'ยังมีข้อที่ไม่ถึงเกณฑ์ของบางเหล่า'}`, [
      { label: 'ติวอีกรอบ เลือกวิธีใหม่', hint: 'หาที่ติวใหม่ แล้วติวไปจนถึงวันสอบ', _reprep: 'again', result: 'หยิบใบปลิวกวดวิชาที่เก็บไว้ขึ้นมาดูอีกครั้ง' },
      { label: 'ไม่ติวแล้ว อ่านทวนเองเบา ๆ', _reprep: 'skip', fx: { knowledge: 1 }, result: 'อ่านวันละบท ไม่เร่ง ไม่หยุด' },
      { label: 'ไม่ติวแล้ว ฝึกร่างกายอย่างเดียว', _reprep: 'skip', fx: { health: 1 }, result: 'ความรู้ว่าพอแล้ว ที่เหลือคือขากับปอด' },
      { label: 'ไม่ติวแล้ว ใช้ชีวิตตามปกติรอวันสอบ', _reprep: 'skip', fx: { happiness: 1 }, result: 'ปีนี้ไม่มีใบปลิวติดข้างโต๊ะ' }]);
  };
  // จับหลังเลือกวิธีติวแล้ว ธงวิธีติวใหม่จึงตัดใบค่าย/ใบบ้านที่ไม่ตรงทางออก · การ์ดในคิวต้องออกก่อนขั้นถัดไป จึง HOLD
  S.reprepCards = (st) => {
    const pool = st.content.events.filter((e) => /^cadet_(slack|friends_call|chores|pt\d|train)/.test(e.id) && whenOk(st, e.when));
    const picks = shuffle(st, pool).slice(0, 4);
    for (const e of picks) requeue(st, e);
    return picks.length ? 'HOLD' : null;
  };
  S.wait1 = (st) => C('wait1', 'เดือนที่เหลือ', 'ไม่มีค่ายติว ไม่มีตารางอ่าน วันธรรมดากลับมาเป็นวันธรรมดา แต่ปฏิทินบนผนังมีวันหนึ่งที่วงไว้', [
    { label: 'ช่วยงานที่บ้านเต็มที่', fx: { relations: 1 }, result: `${elder(st)}บอกว่าปีนี้ดูใจเย็นกว่าปีก่อน` },
    { label: 'ไปเที่ยวกับเพื่อนสักวัน', fx: { happiness: 1 }, result: 'ทั้งวันไม่มีใครพูดเรื่องสอบ' },
    { label: 'ซ้อมว่ายน้ำสัปดาห์ละครั้ง', fx: { health: 1 }, result: 'ว่ายสบายขึ้นทุกสัปดาห์' },
    { label: 'เปิดข้อสอบเก่าดูเล่นก่อนนอน', fx: { knowledge: 1 }, result: 'ข้อที่ปีก่อนตอบผิด ปีนี้ตอบได้' }]);
  S.wait2 = (st) => C('wait2', 'อีกสัปดาห์เดียว', 'อีกเจ็ดวันถึงวันสอบ บัตรสอบวางอยู่บนโต๊ะ ปีนี้ไม่ต้องรีบอ่านอะไร มีแค่ต้องรอ', [
    { label: 'นอนให้ตรงเวลาทุกคืน', fx: { health: 1 }, result: 'ตื่นตีห้าได้โดยไม่ต้องตั้งนาฬิกา' },
    { label: 'ไปไหว้พระ', fx: { happiness: 1 }, result: 'ขอให้ใจนิ่งเหมือนเดิม ไม่ได้ขอให้ติด' },
    { label: 'คุยกับเพื่อนที่สอบปีนี้ด้วยกัน', fx: { network: 1 }, result: 'นัดเจอกันหน้าสนามสอบ' },
    { label: 'เตรียมของสอบไว้แต่เนิ่น ๆ', result: 'ดินสอ ยางลบ บัตรประชาชน วางเรียงไว้ครบ' }]);
  S.e9r = (st) => {
    const last = st.age >= (N(st).last_age ?? 18);
    return C('e9r', last ? 'คืนก่อนสอบ ครั้งสุดท้าย' : 'คืนก่อนสอบ ปีที่สอง',
      `ปีนี้ไม่ต้องถามทางไปสนามสอบแล้ว รู้ว่ารถเที่ยวไหนถึงก่อน ร้านข้าวไหนเปิดดึก ห้องน้ำตรงไหนคิวสั้น\nบัตรสอบใบใหม่วางทับใบของปีก่อน ${LASTFAIL[info(st).lastFail] ?? 'ปีก่อนยังไม่ติด'}${last ? ' ปีนี้คือครั้งสุดท้ายที่อายุยังสมัครได้' : ''}`, [
        { label: 'เปิดสมุดจดจุดที่พลาดปีก่อน', fx: { knowledge: 1 }, result: 'อ่านจนจบหน้า แล้วขีดเส้นใต้บรรทัดเดียว "อย่าพลาดซ้ำ"' },
        { label: 'โทรหาบ้าน', fx: { relations: 1 }, result: 'ปลายสายบอกว่าปีนี้ไม่ต้องรีบ ทำเท่าที่ทำได้' },
        { label: 'ทักเด็กที่มาสอบครั้งแรก', fx: { network: 1 }, result: 'เด็กคนนั้นถามทางไปห้องสอบ เหมือนที่ตัวเองเคยถามเมื่อปีก่อน' },
        { label: 'เข้านอนตั้งแต่สองทุ่ม', fx: { health: 1 }, result: 'ปีนี้หลับได้ก่อนเที่ยงคืน' }]);
  };
  S.mornr = (st) => C('mornr', 'เช้าวันสอบ', 'แถวหน้าประตูสนามยาวเหมือนเดิม แต่ปีนี้ {ชื่อ} ไม่ต้องเขย่งมองหาป้าย รู้ว่าแถวไหนคือแถวของตัวเอง\nเด็กหน้าใหม่ข้าง ๆ กำบัตรสอบแน่นจนกระดาษยับ เหมือนตัวเองเมื่อปีก่อน', [
    { label: 'สูดหายใจลึก แล้วเดินเข้าไป', fx: { happiness: 1 } }, { label: 'ทวนสูตรในใจจนถึงประตู', fx: { knowledge: 1 } },
    { label: 'หันไปมองคนที่มาส่งอีกที', fx: { relations: 1 } }, { label: 'นับคู่แข่งในแถวไปเรื่อย ๆ' }]);

  // ---------- บล็อกคะแนน · คะแนนรวม · ลำดับที่ (เจ้าของเคาะ B/C1–C4 2026-11-06 · research cadet-titles-scores-ranks.md) ----------
  // บล็อกตัวเลขแยกใต้บล็อกผลทุกรอบ ทั้งติดและไม่ติด · ของจริงไม่ประกาศคะแนน/ลำดับ = เล่าแบบเกม
  // ลำดับ = ตัวเลขเล่าเรื่องให้สอดคล้องกับเส้นเดิม ไม่แตะสมดุล (C2 ก) · สุ่มจาก stream ของเส้นนี้ ไม่แตะ rng ของโลก
  // เหตุตกคิดจากตัวเลขจริง ไม่อ่าน P.reason — บรรทัดตัวเลขจะไม่ขัดกับตัวมันเอง · ตกเพราะความรู้ = โชว์เลขความรู้ตรง ๆ (Q-S1)
  function writtenScoreLine(st, b) {
    const P = st.cadet.p2, n = N(st), sc = P.scores[b] ?? 0, k = P.know?.[b] ?? Math.round(st.knowledge);
    const q = sc < n.written_min, kn = k < n.know_min;
    if (q && kn) return `${BT(st, b)} แบบวัด ${sc}/25 · ความรู้ ${k} ไม่ถึงเกณฑ์ทั้งคู่ (เส้น ${n.written_min} · ${n.know_min})`;
    if (kn) return `${BT(st, b)} แบบวัด ${sc}/25 ผ่านเส้น · ความรู้ ${k} เกณฑ์ ${n.know_min} ขาดอีก ${n.know_min - k}`;
    if (q) return `${BT(st, b)} ได้ ${sc}/25 ขาดอีก ${n.written_min - sc} ถึงเส้น ${n.written_min} · ความรู้ ${k}`;
    return `${BT(st, b)} ได้ ${sc}/25 (เส้น ${n.written_min}) · ความรู้ ${k} (เกณฑ์ ${n.know_min})`;
  }
  const bodyScoreLine = (st, live) => `ชีวิตวันสอบ ${st.cadet.p2.bodyH} · ` + live.map((b) => `${BT(st, b)} เกณฑ์ ${N(st).body_min[b]} ${st.cadet.p2.body?.[b] ? 'ผ่าน' : 'ไม่ผ่าน'}`).join(' · ');
  const ivScoreLine = (st) => `สัมภาษณ์ ${st.cadet.p2.iv ?? 0}/25 (เส้น ${N(st).iv_min ?? 13})`;
  function totalOf(st, b) {
    const P = st.cadet.p2, d = N(st).total_div ?? { know: 4, body: 4 };
    return (P.scores[b] ?? 0) + Math.round((P.know?.[b] ?? st.knowledge) / d.know) + Math.round(P.bodyH / d.body) + (P.iv ?? 0);
  }
  // ลำดับรายเหล่าของคนที่ถึงรอบสุดท้าย · จำใน P.ranks ให้ฉากหลังใช้ต่อ (บทปากคน)
  function finalRank(st, b, passed) {
    const P = st.cadet.p2, n = N(st), seats = n.seats?.[b] ?? 100, resMax = Math.floor(seats * (n.reserve_share ?? 0.4)), gap = n.reserve_gap ?? 2;
    const total = totalOf(st, b), short = (n.iv_min ?? 13) - (P.iv ?? 0);
    let rank, kind;
    if (passed) { kind = 'pass'; rank = Math.max(1, Math.min(seats, Math.round(seats * Math.min(1, Math.max(0.02, (100 - total) / 50)) * (0.85 + 0.3 * rand(st))))); }
    else if (short <= gap) { kind = 'reserve'; rank = seats + Math.max(1, Math.min(resMax, Math.ceil(resMax * (short / gap) * (0.4 + 0.6 * rand(st))))); }
    else { kind = 'out'; rank = seats + resMax + 1 + Math.floor(rand(st) * seats); }
    return ((P.ranks ??= {})[b] = { total, rank, seats, kind, reserveNo: kind === 'reserve' ? rank - seats : null });
  }
  function finalScoreLine(st, b, r) {
    const head = `${BT(st, b)} รวม ${r.total}/100 · ลำดับที่ ${r.rank}`;
    if (r.kind === 'pass') return `${head} จาก ${r.seats} ที่นั่ง · ตัวจริง`;
    if (r.kind === 'reserve') return `${head} · ที่นั่งมี ${r.seats} · ตัวสำรองลำดับที่ ${r.reserveNo} ปีนี้ชื่อไม่ถูกเรียก (ไม่ติด)`;
    return `${head} · ที่นั่งมี ${r.seats} · ไม่ติด`;
  }

  // ---------- phase 2: inside the exam ----------
  // P = st.cadet.p2 · P.steps = ขั้นในสนามสอบ (ลำดับย่อยที่ขั้นต่าง ๆ เขียนทับได้)
  S.exam = (st) => {
    const I = info(st), K = st.cadet;
    K.afterQueue = false;
    delete st.flags.cadet_dream;
    st.flags.cadet_exam_door = true;
    I.tries = (I.tries ?? 0) + 1;
    I.lastFail = null;
    const order = I.order?.length ? I.order : [pickOne(st, BR)];
    const P = (K.p2 = { branches: [...order], scores: {}, written: {}, reason: {}, askNs: {}, steps: [] });
    order.forEach((b, i) => {
      if (i > 0) P.steps.push(['interlude', i + 1]);
      P.steps.push(['day', b, i + 1]);
      (D(st).quiz?.[b] ?? []).forEach((_, k) => P.steps.push(['q', b, k]));
      P.steps.push(['judgeWritten', b]);
    });
    P.steps.push(['waitDay'], ['announce', 'written'], ['board']);
    K.steps.unshift(['p2']);
    return null;
  };
  // ตัวเดินขั้นในสนามสอบ: ดึงขั้นถัดไปของ P มาเล่น แล้ววนกลับมาที่ p2 จนกว่าจะหมด
  S.p2 = (st) => {
    const K = st.cadet, P = K.p2;
    while (P && P.steps.length) {
      const [name, ...a] = P.steps.shift();
      const r = S[name](st, ...a);
      if (r === 'END') { K.steps = []; return 'END'; }
      if (r === 'HOLD') return 'HOLD';
      if (r) { K.steps.unshift(['p2']); return r; }
    }
    return null;
  };
  S.day = (st, b, n) => C(`day_${b}`, `วันสอบ ${BT(st, b)} · วันที่ ${n}`,
    [txt(D(st).dayHeader?.[b]), txt(D(st).dayIntro?.[b])].filter(Boolean).join(' ') || `วันสอบข้อเขียนของ ${BT(st, b)}`,
    [{ label: 'เข้าห้องสอบ', result: 'แจกข้อสอบแล้ว ห้องเงียบจนได้ยินเสียงพัดลม' }]);
  S.q = (st, b, k) => {
    const q = D(st).quiz[b][k];
    return C(`q_${b}_${k + 1}`, `ข้อสอบ ${BT(st, b)} · ข้อ ${k + 1}/5`, q.q, shuffle(st, q.options.map((o) => ({ label: o.label, _score: o.score, _branch: b }))));
  };
  S.judgeWritten = (st, b) => {
    const P = st.cadet.p2, sc = P.scores[b] ?? 0, n = N(st), k = st.knowledge;
    const ok = sc >= n.written_min && k >= n.know_min;
    P.written[b] = ok;
    P.reason[b] = ok ? null : sc < n.written_min && k < n.know_min ? 'both' : sc < n.written_min ? 'quiz' : 'knowledge';
    P.lastScore = sc;
    (P.know ??= {})[b] = Math.round(k);   // ความรู้ ณ วันสอบเหล่านี้ — บล็อกคะแนนกับคะแนนรวมใช้ค่านี้ (เจ้าของเคาะ B)
    return null;
  };
  S.interlude = (st, dayNo) => {
    const P = st.cadet.p2, mood = P.lastScore == null ? null : P.lastScore >= N(st).written_min ? 'good' : 'bad';
    const list = (D(st).interludes ?? []).filter((c) => (!c.cond?.mood || c.cond.mood === mood) && (!c.cond || condOk(st, { ...c.cond, mood: undefined, moneyMax: undefined })) && !(P.seenI ?? []).includes(c.id));
    if (!list.length) return null;
    const c = pickOne(st, list);
    (P.seenI ??= []).push(c.id);
    return { ...c, options: (c.options ?? []).map((o) => ({ ...o, fx: { ...o.fx, money: 0 } })), text: (c.text ?? '').replaceAll('{วัน}', TH_NUM[dayNo] ?? String(dayNo)) };
  };
  S.waitDay = (st) => C('waitday', 'วันว่างก่อนประกาศผล', `สอบครบ ${st.cadet.p2.branches.length} เหล่าแล้ว ผลทุกสนามจะออกพร้อมกันพรุ่งนี้ วันนี้ไม่มีอะไรต้องทำ`, [
    { label: 'นอนให้เต็มอิ่ม', fx: { health: 1 }, result: 'หลับยาวถึงเที่ยง' },
    { label: 'นั่งนึกคำตอบทีละข้อ', result: 'บางข้อมั่นใจ บางข้อไม่แน่ใจ' },
    { label: 'ช่วยงานที่บ้าน', fx: { happiness: 1 }, result: 'ทั้งวันมีงานให้มือทำ ใจเลยไม่ค่อยวิ่งไปที่ผลสอบ' },
    { label: 'โทรคุยกับเพื่อนที่สอบด้วยกัน', fx: { network: 1 }, result: 'คุยกันเรื่องข้อที่ตอบไม่ตรงกัน แล้วก็เลิกคุยเรื่องนี้' }]);

  S.announce = (st, round) => {
    const n = N(st), web = year(st) >= n.web_year, P = st.cadet.p2, I = info(st), who = checker(st);
    P.examNo ??= 10000 + Math.floor(rand(st) * 9000);
    const how = (self) => [self, { label: `ให้${who}ดูให้`, fx: { relations: 1 }, _how: 'elder', result: `${who}เดินเข้าไปก่อน หันกลับมาโดยยังไม่พูดอะไร` },
      { label: 'รอให้คนซาก่อนค่อยดู', fx: { health: 1 }, _how: 'wait', result: 'นั่งรอใต้ต้นไม้จนสาย ไม่ต้องเบียดใคร' },
      { label: 'แวะไหว้พระก่อน แล้วค่อยไปดู', fx: { happiness: 1 }, _how: 'pray', result: 'จุดธูปขอให้ใจนิ่ง ไม่ได้ขอให้ติด' }];
    const self = web ? { label: 'นั่งกดรีเฟรชหน้าเว็บที่ล่มอยู่', fx: { health: -1 }, _how: 'self', result: 'เว็บค้างไปครึ่งชั่วโมง พอหน้าโหลดขึ้น นิ้วก็สั่น' }
      : { label: 'ไปเบียดดูหน้าป้ายเอง', fx: { network: 1 }, _how: 'self', result: 'เบียดอยู่กลางคนเป็นร้อย ได้คุยกับคนที่มาดูผลเหมือนกัน' };
    if (round === 'final') return C('announce_final', 'บ่ายวันประกาศผลสุดท้าย',
      `กินข้าวกลางวันไม่ลง ${web ? 'ผลจะขึ้นเว็บตอนบ่ายสาม' : 'ป้ายสุดท้ายจะติดตอนบ่ายสาม'} ${secretNow(st) ? 'เพื่อนสนิทนั่งรอเป็นเพื่อน' : elder(st) + 'นั่งรออยู่ด้วย'}\nรอบนี้ไม่มีรอบหน้าแล้ว ติดคือติด`, how(self));
    const body = round === 'body';
    return C(body ? 'announce_body' : 'announce', body ? 'เช้าวันประกาศผลพลศึกษา' : 'เช้าวันประกาศผล',
      `${I.tries > 1 ? 'ปีก่อนก็ตื่นแต่เช้าแบบนี้ ' : ''}ตื่นตั้งแต่ตีห้าครึ่ง ${web ? 'ผลจะขึ้นเว็บตอนเก้าโมง' : 'ป้ายจะติดหน้ากองสอบตอนเก้าโมง'} ${elder(st)}ตื่นมาหุงข้าวก่อนเวลา ไม่มีใครพูดเรื่องผลสอบ\n` +
      (body ? `รอบนี้คือผลพลศึกษาและตรวจร่างกาย ผ่านแล้วเหลือแค่สัมภาษณ์\nเลขประจำตัวสอบ ${P.examNo} เลขเดิม` : `เลขประจำตัวสอบ ${P.examNo} จำได้ขึ้นใจตั้งแต่วันสมัคร`), how(self));
  };
  function headLine(st, none, kind) {
    const P = st.cadet.p2, no = P.examNo, who = checker(st), web = year(st) >= N(st).web_year;
    return ({
      self: web ? `หน้าเว็บโหลดขึ้นมาทีละบรรทัด ไล่หาเลข ${no}${kind === 'written' ? ' ทีละเหล่า' : ''}` : `นิ้วไล่ลงตามรายชื่อบนป้าย หาเลข ${no}${kind === 'written' ? ' ทีละเหล่า' : ''}`,
      elder: none ? `${who}เดินกลับมาช้า ๆ ไม่พูดอะไร` : `${who}หันกลับมา ยิ้มก่อนจะพูด แล้วยื่นกระดาษที่จดไว้ให้ดู`,
      wait: `หน้าป้ายเหลือคนไม่กี่คน ไล่หาเลข ${no} ได้ช้า ๆ`,
      pray: `กลิ่นธูปยังติดมือ ยืนนิ่งหน้าป้าย แล้วค่อย ๆ ไล่หาเลข ${no}`,
    })[P.how] ?? `ไล่หาเลข ${no}`;
  }
  function reactOpts(st, none, last) {
    const P = st.cadet.p2, who = checker(st), elderHere = P.how === 'elder' && !secretNow(st);
    if (none) return [{ label: 'อ่านซ้ำอีกรอบ เผื่อมองข้าม', result: 'ไล่ดูอีกสองรอบ เลขนั้นไม่มีจริง ๆ' },
      { label: `เดินกลับไปหา${who}`, fx: { relations: 1 }, result: `${who}จับไหล่ไว้ ไม่ถามอะไรสักคำ` },
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งอยู่ใต้ต้นไม้จนคนกลับกันหมด' },
      st.age < (N(st).last_age ?? 18) ? { label: 'จำหน้าป้ายนี้ไว้ ปีหน้าจะกลับมา', fx: { knowledge: 1 }, result: 'คืนนั้นหยิบหนังสือเล่มเดิมขึ้นมาเปิดอีกครั้ง' }
        : { label: 'เก็บบัตรสอบใบนี้ไว้', fx: { happiness: 1 }, result: 'ปีสุดท้ายแล้ว แต่ได้ลองจนสุดทาง' }];
    return [year(st) >= N(st).photo_year ? { label: 'ถ่ายรูปป้ายเก็บไว้', fx: { happiness: 1 }, result: 'ซูมจนเห็นเลขตัวเองชัด ๆ' } : { label: 'จดเลขลำดับไว้ในสมุด', fx: { happiness: 1 }, result: 'เขียนตัวโต ๆ แล้ววงไว้สองรอบ' },
      elderHere ? { label: `หันไปกอด${who}`, fx: { relations: 1 }, result: `${who}กอดตอบแน่นกว่าที่คิด` } : { label: 'โทรบอกที่บ้านทันที', fx: { relations: 1 }, result: 'ปลายสายเงียบไปครู่หนึ่ง แล้วเสียงก็ดังขึ้น' },
      { label: 'ไล่ดูอีกรอบให้แน่ใจ', result: 'อ่านเลขทีละตัว ตรงทุกตัว' },
      last ? { label: 'ยิ้มกว้างจนแก้มตึง', fx: { happiness: 1 }, result: 'เหลืออีกรอบเดียว ยิ้มได้ก่อนก็ไม่เสียหาย' } : { label: 'ยิ้มอยู่คนเดียว ยังไม่บอกใคร', fx: { happiness: 1 }, result: 'เก็บไว้ในใจก่อน รอบหน้ายังมีอีกหลายด่าน' }];
  }
  S.board = (st) => {
    const P = st.cadet.p2, n = N(st), c = firstOk(st, D(st).board) ?? {};
    const pass = P.branches.filter((b) => P.written[b]), fail = P.branches.filter((b) => !P.written[b]), none = !pass.length;
    const lf = c.listFormat ?? { pass: '{เหล่า} ผ่าน', fail: '{เหล่า} ไม่ผ่าน' };
    const lines = P.branches.map((b) => (P.written[b] ? lf.pass.replaceAll('{เหล่า}', BT(st, b)).replaceAll('{ลำดับ}', 20 + (25 - (P.scores[b] ?? 0)) * 30 + Math.floor(rand(st) * 29))
      : lf.fail.replaceAll('{เหล่า}', BT(st, b)) + (c.failReasons?.[P.reason[b]] ? ` (${c.failReasons[P.reason[b]]})` : '')));
    let text = `${headLine(st, none, 'written')}\n\n${lines.join('\n')}`;
    if (rand(st) < 0.4 && !none) text += `\nเกือบใจหายเพราะเลข ${P.examNo - 6} อยู่บรรทัดบน ต้องอ่านซ้ำอีกที`;
    if (c.eraLine && year(st) >= (c.eraLine.yearMin ?? 0)) text += '\n' + c.eraLine.line;
    const rl = info(st).tries <= 1 && (year(st) < n.web_year || P.how !== 'self') ? (c.rivalLines ?? []).find((r) => condOk(st, r.when)) : null;
    if (rl) text += '\n' + rl.line;
    text += `\n\n${!fail.length ? 'ผ่านครบทุกเหล่าที่สมัคร' : none ? 'ไม่ผ่านเลยสักเหล่า' : `ผ่าน ${pass.length} จาก ${P.branches.length} เหล่า`}\n\n${P.branches.map((b) => writtenScoreLine(st, b)).join('\n')}`;   // บล็อกคะแนน (เจ้าของเคาะ B) แทนบรรทัดเกณฑ์เดิม
    P.steps = none ? [['failed']] : [['cheer', 'phys'], ['physAsk', 'phys'], ['nearExam'], ['bodyDay'], ['judgeBody'], ['bodyWait'], ['announce', 'body'], ['bodyBoard']];
    return C('board', 'ประกาศผลรอบแรก', text, reactOpts(st, none, false));
  };

  S.cheer = (st, round) => {
    const P = st.cadet.p2, iv = round === 'iv', fin = round === 'final', fam = family(st), who = elder(st), L = [];
    const live = fin ? P.final : iv ? P.branches.filter((b) => P.body?.[b]) : P.branches.filter((b) => P.written[b]);
    const gone = P.branches.filter((b) => (iv ? P.written[b] : !fin) && !live.includes(b));
    if (secretNow(st)) {
      L.push(`ที่บ้านเพิ่งรู้วันนี้ว่าไปสอบมา ${who}ตกใจอยู่ครู่หนึ่ง แล้วถึงค่อยยิ้ม`);
      delete st.flags.cadet_family_secret;
      st.flags.cadet_family_told = true;
    } else if (!fin) L.push((iv ? { both: 'แม่โทรบอกญาติทีละคน พ่อแอบไปซื้อเสื้อเชิ้ตตัวใหม่มาวางไว้หน้าห้อง', mother: 'แม่จุดธูปบอกปู่ย่าที่หิ้งพระ ขอให้ผ่านอีกรอบเดียว', fatherOnly: 'พ่อเล่าเรื่องสมัยหนุ่มที่ไม่เคยเล่า แล้วบอกว่าสัมภาษณ์ให้พูดความจริง' }
      : { both: 'แม่ยิ้มทั้งวัน พ่อบอกว่าอย่าเพิ่งดีใจ ยังมีอีกสองรอบ', mother: 'แม่ทำกับข้าวจานโปรดให้ แล้วถามว่ารอบหน้าสอบอะไร', fatherOnly: 'พ่อพยักหน้า บอกว่า "ดี" แล้วถามว่าวิ่งไหวไหม' })[fam]
      ?? (iv ? 'ป้าซื้อเสื้อเชิ้ตตัวใหม่มาให้ใส่ไปสัมภาษณ์' : 'ป้าเอาเรื่องไปเล่าให้ข้างบ้านฟังตั้งแต่ยังไม่ค่ำ'));
    else L.push({ both: 'แม่ปล่อยโฮออกมาก่อนใคร พ่อยืนนิ่งอยู่นาน แล้วเดินมาตบไหล่สองที', mother: 'แม่กอดไว้นานจนข้าวที่ตั้งไว้ไหม้ แล้วก็หัวเราะทั้งน้ำตา', fatherOnly: 'พ่อหยิบโทรศัพท์โทรหาทุกคนในสมุดเบอร์ เสียงดังกว่าที่เคยได้ยิน' }[fam]
      ?? 'ป้าเอารูปเก่าออกจากกรอบ บอกว่าจะเก็บกรอบนี้ไว้ใส่รูปเครื่องแบบ');
    const heir = heirOf(st);
    if (heir && fin) L.push(heirHat(st, heir));
    if (!iv && !fin && (has(st, 'cadet_prep_group') || has(st, 'cadet_bond_a'))) L.push(year(st) >= N(st).photo_year ? 'เพื่อนติวส่งรูปป้ายมา วงเลขของทั้งคู่ไว้' : 'เพื่อนติวปั่นจักรยานมาถึงหน้าบ้าน ตะโกนว่า "เราติดทั้งคู่"');
    if (has(st, 'cadet_senior_tutor') || has(st, 'knows_senior')) L.push(fin ? `รุ่นพี่บอกสั้น ๆ ว่า "ยินดีต้อนรับ น้องใหม่ เจอกันที่${campus(st)}"` : iv ? 'รุ่นพี่บอกสั้น ๆ ว่า "สัมภาษณ์ตอบตามจริง อย่าท่องมา"' : 'รุ่นพี่บอกสั้น ๆ ว่า "ดีใจด้วย แต่รอบพลศึกษาหนักกว่านี้นะ"');
    const g = clsGroup(st);
    if (fin) L.push(g === 'poor' ? 'ข้างบ้านเอาขนมมาฝาก คนทั้งซอยรู้ข่าวก่อนค่ำ' : g === 'rich' ? 'ที่บ้านจองโต๊ะร้านอาหาร ญาติโทรมาแสดงความยินดีไม่ขาดสาย' : 'ป้าข้างบ้านตะโกนถามข้ามรั้ว พอรู้ข่าวก็ยกนิ้วให้');
    if (gone.length) L.push(fin ? `${gone.map((b) => BT(st, b)).join(' ')} ไม่ติด แต่ติด ${live.map((b) => BT(st, b)).join(' ')} แล้ว` : `${gone.map((b) => BT(st, b)).join(' ')} ไม่ผ่านก็จริง แต่ยังเหลือ ${live.map((b) => BT(st, b)).join(' ')} ให้ไปต่อ`);
    return C(`cheer_${round}`, fin ? 'คืนที่บ้านไม่มีใครนอน' : iv ? 'เย็นวันประกาศผลพลศึกษา' : 'เย็นวันประกาศผล',
      `${L.join('\n')}\n\n${fin ? 'ติดเตรียมทหารแล้ว' : iv ? 'เหลือรอบเดียว คือสัมภาษณ์' : 'อีกไม่กี่วันจะสอบพลศึกษาและว่ายน้ำ'}`, [
        { label: 'ยกมือไหว้ขอบคุณทุกคน', fx: { relations: 1 }, result: 'ทุกคนยิ้ม แต่ไม่มีใครถามเรื่องรอบหน้า' },
        { label: 'กินข้าวเย็นกับที่บ้านให้นานกว่าทุกวัน', fx: { happiness: 1 }, result: 'คืนนั้นหลับง่ายกว่าทุกคืน' },
        fin ? { label: 'บอกทุกคนว่าจะตั้งใจเรียน', result: 'พูดออกไปแล้ว ทุกคนปรบมือ' } : { label: 'บอกทุกคนว่ายังไม่จบ ยังมีอีกรอบ', result: 'พูดออกไปแล้ว ใจก็กลับมานิ่ง' },
        { label: 'ขอตัวเข้านอนเร็ว', fx: { health: 1 }, result: 'นอนเต็มอิ่มเป็นคืนแรกในรอบหลายเดือน' }]);
  };

  S.physAsk = (st, round = 'phys') => {
    const P = st.cadet.p2, iv = round === 'iv', max = N(st).ask_max ?? 5, n = P.askNs[round] ?? 0, left = max - n;
    const place = iv ? 'ห้องสัมภาษณ์' : 'สนามพลศึกษา';
    const text = n === 0 ? (iv ? `ห้องสัมภาษณ์รอบสุดท้ายเปิดให้ผู้ผ่านพลศึกษาเข้าได้ภายใน ${max} วัน ขอคิวได้วันไหนก็ได้ในช่วงนี้`
      : `สนามพลศึกษาเปิดให้ผู้ผ่านข้อเขียนเข้าสอบได้ภายใน ${max} วัน ไปวันไหนก็ได้ในช่วงนี้\nดึงข้อ ลุกนั่ง วิ่ง แล้วว่ายน้ำ 50 เมตร`)
      : `ผ่านไปอีกวัน ${place}ยังเปิดอยู่ เหลืออีก ${left} วัน${left === 1 ? ' วันนี้เป็นวันสุดท้าย' : ''}`;
    const waitRes = left === 1 ? (iv ? 'วันสุดท้ายผ่านไป ห้องสัมภาษณ์ปิดรับคิว' : 'วันสุดท้ายผ่านไป สนามปิดประตูตอนห้าโมงเย็น')
      : iv ? 'ซ้อมพูดหน้ากระจกแล้วก็เลื่อนไปอีกวัน' : ['นอนมองเพดาน บอกตัวเองว่าพรุ่งนี้ค่อยไป', 'ออกไปวิ่งเหยาะ ๆ แล้วกลับมานอนต่อ', 'หยิบรองเท้าวิ่งขึ้นมาดู แล้ววางลงที่เดิม'][n % 3];
    return C(iv ? 'ivask' : 'physask', n === 0 ? `${place}เปิดแล้ว` : `${place} · เหลือ ${left} วัน`, text, iv
      ? [{ label: 'ไปสอบสัมภาษณ์เลย', _phys: 'go', _round: round, result: 'ยื่นชื่อขอคิว ได้คิวสัมภาษณ์วันมะรืน' }, { label: 'ยังไม่ไป ขอเตรียมตัวอีกวัน', _phys: 'wait', _round: round, result: waitRes }]
      : [{ label: 'ไปสอบพรุ่งนี้', _phys: 'go', _round: round, result: 'วงวันพรุ่งนี้ไว้ในปฏิทิน เตรียมชุดกีฬาไว้ข้างเตียง' }, { label: 'ขอพักอีกวัน ค่อยไป', _phys: 'wait', _round: round, result: waitRes }]);
  };
  S.noShow = (st, round = 'phys') => {
    const P = st.cadet.p2, iv = round === 'iv', max = N(st).ask_max ?? 5;
    P.failStage = iv ? 'noshow_iv' : 'noshow';
    P.steps = [['letDown', round], ['failed']];
    return status(iv ? 'ไม่ได้เข้าสัมภาษณ์' : 'ไม่ได้เข้าสอบพลศึกษา', iv ? `ครบ ${max} วันแล้ว ไม่ได้ไปขอคิวสัมภาษณ์เลยสักวัน\nชื่อในรอบสุดท้ายถูกขีดออก ปีนี้ถือว่าสอบตก`
      : `ครบ ${max} วันแล้ว ไม่ได้ไปสนามพลศึกษาเลยสักวัน\nชื่อในรายชื่อรอบสองถูกขีดออก ปีนี้ถือว่าสอบตก`);
  };
  // ครอบครัวผิดหวัง: ความสุข/ความสัมพันธ์ลดตาม numbers.letdown ไม่ว่าเลือกทางไหน (เจ้าของเคาะ)
  S.letDown = (st, round = 'phys') => {
    const who = elder(st), d = (N(st).letdown ?? -20) / (N(st).fx_unit ?? 5), fx = { happiness: d, relations: d }, why = round === 'report' ? 'ติดแล้ว' : 'ผ่านมาแล้ว';
    const head = secretNow(st) ? `ญาติที่รู้จักคนคุมสนามเอาเรื่องมาเล่าที่บ้าน ${who}เพิ่งรู้ทีเดียวทั้งสองเรื่อง ว่าไปสอบมา และผ่าน${round === 'iv' ? 'มาถึงรอบสุดท้าย' : 'ข้อเขียน'}แล้วแต่ไม่ไปสอบต่อ`
      : ({ both: `พ่อวางช้อนลงกลางมื้อเย็น แม่ถามซ้ำว่าทำไมไม่ไป ทั้งที่${why}`, mother: `แม่ถามซ้ำว่าทำไมไม่ไป ทั้งที่${why} แล้วก็เงียบไปทั้งคืน`, fatherOnly: 'พ่อไม่ได้ดุสักคำ แค่ลุกไปนั่งสูบบุหรี่หน้าบ้านจนดึก' })[family(st)]
        ?? 'ป้าไม่ถามอะไร แต่เก็บรูปป้ายประกาศที่ติดตู้เย็นลงไปไว้ในลิ้นชัก';
    return C('letdown', 'ความเงียบที่บ้าน', head + (heirOf(st) ? `\n${heirHatBack(st, heirOf(st))}` : ''), [
      { label: 'ขอโทษ', fx, result: `${who}พยักหน้า แต่ไม่ได้มองหน้า` }, { label: 'อธิบายว่ายังไม่พร้อม', fx, result: 'พูดจบแล้วห้องก็เงียบเหมือนเดิม' },
      { label: 'ไม่พูดอะไร เข้าห้องไป', fx, result: 'ได้ยินเสียงล้างจานนานกว่าทุกวัน' }, { label: 'ออกไปนั่งข้างนอกคนเดียว', fx, result: 'กลับเข้าบ้านตอนไฟดับหมดแล้ว' }]);
  };
  S.nearExam = (st) => C('near_exam', 'วันก่อนสอบพละ', `พรุ่งนี้เช้าคือวันพลศึกษาและตรวจร่างกาย ร่างกายตอนนี้ ${bodyReach(st, undefined, st.cadet.p2.branches.filter((b) => st.cadet.p2.written[b]))}\nเหลือวันนี้วันเดียว จะใช้มันยังไง`, [
    { label: 'ซ้อมพละต่อแบบหนัก', hint: 'ได้ชีวิตเพิ่ม แต่อาจเจ็บจนสอบไม่ไหว',
      outcomes: [{ p: 1 - (N(st).exam_injury ?? 0.15), result: 'ซ้อมหนักอีกรอบ วิ่งพันเมตรเร็วที่สุดตั้งแต่เคยจับเวลา', fx: { health: 2 } },
        { p: N(st).exam_injury ?? 0.15, result: 'ข้อเท้าพลิกตอนกระโดดไกล ตกค่ำบวมจนลงน้ำหนักไม่ได้', _injure: true }] },
    { label: 'ออกกำลังกายเบา ๆ', fx: { health: 0.4 }, result: 'วิ่งเหยาะ ๆ กับยืดเส้น ตัวเบาแต่ไม่ล้า' },
    { label: 'พักเตรียมร่างกาย', fx: { happiness: 1 }, result: 'นอนให้พอ กินให้ครบ ไม่ฝืนอะไร' },
    { label: 'ไปเดินดูสนามสอบล่วงหน้า', fx: { network: 1 }, result: 'นับระยะลู่วิ่งกับขอบสระไว้ในหัว' }]);
  S.injury = (st) => { st.cadet.p2.failStage = 'injury'; return status('สอบพละไม่ไหว', 'เช้าวันสอบไปถึงสนามทั้งที่ข้อเท้ายังพันผ้า ครูคุมสอบให้ลองวิ่งแค่สิบเมตรก็เห็นว่าไม่ไหว\nปีนี้จึงถือว่าไม่ผ่านรอบพลศึกษา'); };
  S.bodyDay = (st) => {
    const c = firstOk(st, D(st).physical) ?? {};
    return { ...c, id: 'body_day', title: 'วันพลศึกษาและตรวจร่างกาย', text: `${c.text ?? 'สนามพลศึกษาเริ่มเจ็ดโมงเช้า'}\nบ่ายลงสระว่ายน้ำห้าสิบเมตร ต่อด้วยห้องตรวจร่างกายห้าห้อง จบในวันเดียว`,
      options: (c.options?.length ? c.options : [{ label: 'เข้าแถวรอเรียกชื่อ', result: 'ได้ป้ายหมายเลขติดหน้าอก' }]).map((o) => ({ ...o, fx: { ...o.fx, money: 0 } })) };
  };
  S.judgeBody = (st) => {
    const P = st.cadet.p2, h = Math.round(st.health), b = N(st).body_min;
    P.body = {};
    const live = P.branches.filter((x) => P.written[x]);
    live.forEach((x) => (P.body[x] = h >= b[x]));
    const any = live.some((x) => P.body[x]);
    if (!any) P.failStage = 'land';
    st.flags.cadet_body_seen = true;
    P.bodyH = h;
    P.bodyHead = any ? (live.every((x) => P.body[x]) ? 'ผ่านทุกสถานี ห้องตรวจสุดท้ายประทับตราให้' : 'บางสถานีทำได้ไม่ถึงเกณฑ์ของบางเหล่า') : 'วิ่งพันเมตรเข้าเส้นช้ากว่าเวลาที่กำหนด';
    return null;
  };
  S.bodyWait = (st) => C('body_wait', 'วันหลังสอบพละ', 'ตื่นมาเมื่อยไปทั้งตัว ขึ้นบันไดทีละขั้นยังต้องจับราว ผลจะประกาศพรุ่งนี้', [
    { label: 'นอนพักทั้งวัน', fx: { health: 1 }, result: 'หลับ ๆ ตื่น ๆ จนเย็น ขาเริ่มกลับมาเป็นของตัวเอง' },
    { label: 'นั่งนึกทบทวนทีละสถานี', result: 'ดึงข้อได้ตามเป้า วิ่งพันเมตรช้ากว่าที่ซ้อมนิดหน่อย' },
    { label: `ช่วย${elder(st)}ทำงานบ้านเบา ๆ`, fx: { relations: 1 }, result: `${elder(st)}ไม่ถามเรื่องสอบ แค่ยื่นยาหม่องมาให้` },
    { label: 'ไปนั่งเล่นกับเพื่อนที่สอบด้วยกัน', fx: { happiness: 1 }, result: 'เทียบกันว่าใครเมื่อยตรงไหน แล้วหัวเราะกันทั้งวง' }]);
  S.bodyBoard = (st) => {
    const P = st.cadet.p2, b = N(st).body_min, live = P.branches.filter((x) => P.written[x]);
    const pass = live.filter((x) => P.body[x]), fail = live.filter((x) => !P.body[x]), none = !pass.length;
    const lines = live.map((x) => `${BT(st, x)} (เกณฑ์ชีวิต ${b[x]}) ${P.body[x] ? 'ผ่าน' : 'ไม่ผ่าน'}`);
    const text = `${headLine(st, none, 'body')}\n${P.bodyHead}\n\n${lines.join('\n')}\n\n${!fail.length ? 'ผ่านพลศึกษาและตรวจร่างกายครบทุกเหล่า' : none ? 'ไม่ผ่านพลศึกษาสักเหล่า' : `ผ่าน ${pass.length} จาก ${live.length} เหล่า`}\n\n${bodyScoreLine(st, live)}`;   // บล็อกคะแนน (เจ้าของเคาะ B)
    P.steps = none ? [['failed']] : [['cheer', 'iv'], ['physAsk', 'iv'], ['ivEve'], ['ivIntro'], ['interview']];
    return C('body_board', 'ประกาศผลพลศึกษาและตรวจร่างกาย', text, none ? [
      { label: 'อ่านซ้ำอีกรอบ', result: 'ไล่ดูอีกสองรอบ เลขนั้นไม่มีจริง ๆ' }, { label: `เดินกลับไปหา${checker(st)}`, fx: { relations: 1 }, result: `${checker(st)}จับไหล่ไว้ ไม่ถามอะไรสักคำ` },
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งอยู่ใต้ต้นไม้จนคนกลับกันหมด' },
      { label: 'บอกตัวเองว่าปีหน้าจะซ้อมให้หนักกว่านี้', fx: { health: 1 }, result: 'เย็นนั้นออกไปวิ่งรอบหมู่บ้านทั้งที่ยังเมื่อย' }] : reactOpts(st, false, true));
  };
  S.ivEve = (st) => C('iv_eve', 'วันก่อนสัมภาษณ์', 'พรุ่งนี้คือรอบสุดท้าย ไม่มีวิ่ง ไม่มีข้อสอบ มีแค่โต๊ะตัวเดียวกับกรรมการสามคน', [
    { label: `ให้${elder(st)}ช่วยถามซ้อม`, fx: { relations: 1 }, result: `${elder(st)}ถามข้อแรกว่า "ทำไมอยากเป็น" แล้วฟังจนจบ` },
    { label: 'ตัดผม รีดเสื้อ ขัดรองเท้า', fx: { happiness: 1 }, result: 'ชุดนักเรียนแขวนรอไว้หน้าตู้ เรียบจนไม่กล้านั่ง' },
    { label: 'อ่านประวัติเหล่าที่สมัครไว้', fx: { knowledge: 1 }, result: 'จำชื่อสถาบันกับปีที่ก่อตั้งได้ขึ้นใจ' },
    { label: 'นอนเร็วกว่าทุกวัน', fx: { health: 1 }, result: 'หลับไปก่อนคิดคำตอบเสร็จ' }]);
  S.ivIntro = (st) => C('iv_intro', 'ห้องสัมภาษณ์', 'ห้องสัมภาษณ์มีโต๊ะยาวตัวเดียว กรรมการสามคน ผู้กององอาจนั่งกลาง เสียงดังกว่าพัดลม จ่าขมลมโชยนั่งซ้าย หน้านิ่ง ผู้กองบูรพานั่งขวา ยิ้มให้ก่อน\n"นั่ง" ผู้กององอาจชี้เก้าอี้ "ห้าข้อ ตอบตามจริง"',
    [{ label: 'นั่งตัวตรง วางมือบนเข่า', result: 'เก้าอี้ดังเอี๊ยด ทั้งห้องเงียบ' }]);
  // สัมภาษณ์: 4 ข้อจริงจัง (สุ่มจากคลัง ผู้กองสองคนผลัดกันถาม) + ข้อตลกของจ่าขมลมโชยเป็นข้อ 3 หรือ 4 (ได้เต็มเสมอ) · ผ่าน ≥ iv_min
  S.interview = (st) => {
    const P = st.cadet.p2, pool = shuffle(st, (D(st).interviewQs ?? [])).slice(0, 4);
    const slots = [...pool.map((_, i) => ['ivq', i])];
    slots.splice(2 + Math.floor(rand(st) * 2), 0, ['ivf']);
    P.ivPool = pool.map((q) => D(st).interviewQs.indexOf(q));
    P.iv = 0;
    P.steps = [...slots.map((s, i) => [...s, i + 1]), ['judgeIv']];
    return null;
  };
  const IV_PANEL = ['ผู้กององอาจ', 'ผู้กองบูรพา'];
  S.ivq = (st, i, no) => {
    const P = st.cadet.p2, q = D(st).interviewQs[P.ivPool[i]], who = IV_PANEL[(no - 1) % 2];
    const question = q.q.replaceAll('{เหล่า}', BT(st, P.branches.find((b) => P.body?.[b]) ?? P.branches[0]));
    const qq = q.qSecret && secretNow(st) ? q.qSecret : question;
    return C(`ivq${no}`, `${who} · ข้อ ${no}/5`, `${who}ถาม: "${qq}"`, shuffle(st, q.a.map(([label, sc]) => ({ label, _iv: sc }))));
  };
  S.ivf = (st, no) => {
    const f = pickOne(st, D(st).interviewFunny ?? []);
    return C('ivf', `จ่าขมลมโชย · ข้อ ${no}/5`, f.text, f.a.map(([label, react]) => ({ label, _iv: 5, result: react })));
  };
  S.judgeIv = (st) => {
    const P = st.cadet.p2, ok = (P.iv ?? 0) >= (N(st).iv_min ?? 13);
    P.ivOk = ok;
    if (!ok) P.failStage = 'interview';
    P.steps = [['announce', 'final'], ['finalBoard']];
    return status('จบการสัมภาษณ์', 'ผู้กององอาจปิดแฟ้ม บอกว่าผลรอบสุดท้ายประกาศบ่ายนี้ จ่าขมลมโชยยังหน้านิ่งเหมือนเดิม ผู้กองบูรพาจดบรรทัดสุดท้ายแล้ววางปากกา');
  };
  S.finalBoard = (st) => {
    const P = st.cadet.p2, pass = P.ivOk ? P.branches.filter((b) => P.written[b] && P.body?.[b]) : [], none = !pass.length, who = checker(st);
    const why = (b) => (!P.written[b] ? 'ไม่ผ่านข้อเขียน' : !P.body?.[b] ? 'ไม่ผ่านพลศึกษา' : 'ไม่ผ่านสัมภาษณ์');
    const web = year(st) >= N(st).web_year, no = P.examNo;
    const head = ({ self: web ? `หน้าเว็บโหลดขึ้นมา รายชื่อสั้นจนเลื่อนไม่สุดนิ้ว ไล่หาเลข ${no}` : `ป้ายแผ่นสุดท้าย รายชื่อสั้นจนอ่านจบในครั้งเดียว ไล่หาเลข ${no}`,
      elder: none ? `${who}เดินกลับมาช้า ๆ ไม่พูดอะไร` : `${who}ยังเดินไม่ถึงป้ายดี ก็หันกลับมาตะโกนเรียกชื่อ`, wait: `หน้าป้ายเหลือคนสองคน ไล่หาเลข ${no} ได้ช้า ๆ`, pray: `มือยังพนมค้างอยู่ตอนอ่านเลข ${no}` })[P.how] ?? `ไล่หาเลข ${no}`;
    const lines = P.branches.map((b) => (pass.includes(b) ? `${BT(st, b)} ติด` : `${BT(st, b)} ไม่ติด (${why(b)})`));
    P.final = pass;
    P.steps = none ? [['failed']] : [['cheer', 'final'], ['chooseOrPack']];
    // บล็อกคะแนน + รวม + ลำดับ (เจ้าของเคาะ B · C1–C4): ทุกเหล่าที่ถึงรอบสุดท้าย (ผ่านข้อเขียนและพละ)
    const reached = P.branches.filter((b) => P.written[b] && P.body?.[b]);
    const scores = reached.length ? `\n\n${[ivScoreLine(st), ...reached.map((b) => finalScoreLine(st, b, finalRank(st, b, pass.includes(b))))].join('\n')}` : '';
    return C('final_board', 'ประกาศผลรอบสุดท้าย', `${head}\n\n${lines.join('\n')}\n\n${none ? 'ปีนี้ไม่ติดสักเหล่า' : pass.length === P.branches.length ? 'ติดครบทุกเหล่าที่สมัคร' : `ติด ${pass.length} จาก ${P.branches.length} เหล่า`}${scores}`, none ? [
      { label: 'อ่านซ้ำอีกรอบ', result: 'มาถึงรอบสุดท้ายแล้ว แต่เลขนั้นไม่มีจริง ๆ' }, { label: `เดินกลับไปหา${who}`, fx: { relations: 1 }, result: `${who}บอกว่ามาถึงตรงนี้ก็เก่งแล้ว` },
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งจนป้ายถูกปลดลง' },
      st.age < (N(st).last_age ?? 18) ? { label: 'จดเลขคนที่ติดไว้ ปีหน้าจะมาใหม่', fx: { knowledge: 1 }, result: 'เขียนไว้หลังบัตรสอบ' } : { label: 'เก็บบัตรสอบใบนี้ไว้', fx: { happiness: 1 }, result: 'ปีสุดท้ายแล้ว แต่มาถึงรอบสุดท้ายได้ก็ไม่เสียใจ' }] : [
      { label: 'กระโดดกอดคนข้าง ๆ', fx: { happiness: 1 }, result: 'กอดไปแล้วถึงรู้ว่าไม่รู้จักกัน เขาก็ติดเหมือนกัน' },
      !secretNow(st) ? { label: `หันไปกอด${elder(st)}`, fx: { relations: 1 }, result: `${elder(st)}ร้องไห้ก่อนจะพูดอะไรออกมาได้` } : { label: 'โทรบอกที่บ้านทันที', fx: { relations: 1 }, result: 'ยังไม่ทันพูดจบ ปลายสายก็ร้องไห้' },
      { label: 'อ่านเลขซ้ำห้ารอบ', result: 'ตรงทุกรอบ' }, { label: 'ยืนนิ่ง ๆ ให้ใจตามทัน', fx: { health: 1 }, result: 'หายใจเข้าลึก ๆ สามครั้ง แล้วยิ้มออกมาเอง' }]);
  };
  S.chooseOrPack = (st) => {
    const P = st.cadet.p2;
    if (P.final.length === 1) return S.pack(st, P.final[0]);
    const c = firstOk(st, D(st).chooseBranch) ?? { title: 'ติดหลายเหล่า', text: 'เลือกได้เหล่าเดียว' };
    return { ...c, id: 'choose_branch', options: [...P.final.map((b) => ({ label: `เลือก ${BT(st, b)}`, _pick: b })), { label: 'สละสิทธิ์ทั้งหมด', _pick: 'none' }] };
  };
  // สละสิทธิ์ทุกเหล่า (งาน a · เจ้าของเคาะ 2026-11-06 · บท cadet-voice-joy-pass.md ท้ายไฟล์): การ์ด "ใบแจ้งที่ไม่ได้ใช้" แทนการ์ดตก
  // Q-A1: ปีหน้ายังสอบใหม่ได้ถ้าอายุไม่เกิน → ห้ามตั้ง cadet_let_go · ตั้ง cadet_declined_seat + ล้างธงฝัน
  // ผล: ไม่มีการ์ดเตือนฤดูสอบ (ไม่ HOLD) แต่การ์ดเชิญปีถัดไปออกได้ตามเงื่อนไขเดิม
  S.declineAll = (st) => {
    const P = st.cadet.p2, I = info(st);
    P.failStage = 'declined';
    I.lastFail = 'declined';
    delete st.flags.cadet_dream;
    delete st.flags.cadet_exam_door;
    st.flags.cadet_declined_seat = true;
    // Q-A1 (ก): ปีหน้าอายุยังสมัครได้ = การ์ดเชิญรอบใหม่ "ใบประกาศปีที่สอง" (ลำดับค้างข้ามปี แบบฤดูสอบ) · เกินอายุ = จบเส้น
    P.steps = st.age + 1 <= (N(st).last_age ?? 18) ? [['returnHold']] : [['end']];
    const home = secretNow(st) ? 'ที่บ้านไม่รู้ด้วยซ้ำว่าเคยติด' : `${elder(st)}ถามซ้ำสองรอบว่าแน่ใจแล้วนะ แล้วก็ไม่ถามอีก`;
    return C('declined', 'ใบแจ้งที่ไม่ได้ใช้', `ชื่อ {ชื่อ} อยู่บนป้ายของ ${P.final.map((b) => BT(st, b)).join(' ')} แต่ตัดสินใจแล้วว่าปีนี้จะไม่ไปรายงานตัว ใบแจ้งผลพับเก็บไว้ในลิ้นชัก\n${home}`, [
      { label: 'เก็บใบแจ้งไว้เป็นที่ระลึก', fx: { happiness: 1 }, result: 'บางคืนยังหยิบขึ้นมาอ่าน แล้วก็พับเก็บที่เดิม' },
      { label: 'กลับไปเรียนต่อตามเดิม', fx: { knowledge: 1 }, result: 'เปิดเทอมแรกเพื่อนถามว่าไม่ไปแล้วเหรอ ตอบว่าปีนี้ยังไม่ไป' },
      // บท: help_others 1 · การ์ดเส้นนี้ยังไม่บันทึกบุญบาป (_chooseCadet ไม่อ่าน merit) — ใส่ไว้ให้ครบตามบท
      { label: 'ยกหนังสือติวให้รุ่นน้อง', fx: { relations: 1 }, merit: { help_others: 1 }, result: 'รุ่นน้องรับไปด้วยมือสองข้าง ถามว่าพี่ติดแล้วทำไมไม่ไป' },
      { label: 'ไม่อยากคิดถึงมันอีก', fx: { happiness: -1 }, result: 'ใบแจ้งยัดไว้ใต้กองหนังสือ ไม่หยิบออกมาอีก อย่างน้อยก็ปีนี้' }]);
  };
  S.returnHold = (st) => {
    st.cadet.p2 = null;
    st.cadet.steps = [['returnInvite']];
    st.cadet.waitAge = st.age + 1;
    return 'HOLD';
  };
  // การ์ดเชิญรอบใหม่หลังสละสิทธิ์ (บท S1 · cadet_invite_return_01 / เดโม INV-R) · ทุกทางล้าง cadet_declined_seat
  // สมัคร = ตั้งธงฝัน กลับเข้าเส้นปกติ (การ์ดสิทธิสอบ/ใบสมัครตามอายุ) · ไม่สอบ = cadet_let_go
  S.returnInvite = (st) => {
    const last = st.age >= (N(st).last_age ?? 18);
    const lines = [secretNow(st) ? 'ปีก่อนที่บ้านไม่รู้ ปีนี้ก็ยังไม่มีใครรู้' : `${elder(st)}เห็นแล้วไม่พูดอะไร แค่วางใบประกาศไว้บนโต๊ะกินข้าว`, last ? 'ปีนี้คือปีสุดท้ายที่อายุยังสมัครได้' : ''].filter(Boolean);
    const clear = ['cadet_declined_seat'];
    return C('return_invite', 'ใบประกาศปีที่สอง', `ปีก่อนติดแล้วไม่ไป ปีนี้ใบประกาศกลับมาติดบอร์ดอีก หัวกระดาษเหมือนเดิมทุกตัว ใบแจ้งผลปีก่อนยังพับอยู่ในลิ้นชัก {ชื่อ} ยืนอ่านอยู่นานกว่าใคร\n${lines.join('\n')}`, [
      { label: 'สมัครอีกรอบ คราวนี้ไปให้ถึง', fx: { happiness: 1 }, setFlags: ['cadet_dream'], clearFlags: clear, result: 'หยิบใบแจ้งปีก่อนออกมาวางข้างใบสมัครใหม่' },
      { label: 'สมัคร คราวนี้เลือกเหล่าให้ตรงใจ', fx: { knowledge: 1 }, setFlags: ['cadet_dream'], clearFlags: clear, result: 'กางรายชื่อสี่เหล่าบนโต๊ะ ปีนี้รู้แล้วว่าใจอยู่ตรงไหน' },
      { label: 'ไม่สอบ ทางที่เลือกไว้ดีแล้ว', fx: { happiness: 1 }, setFlags: ['cadet_let_go'], clearFlags: clear, result: 'ฉีกใบประกาศเป็นสองท่อน แล้วก็ไม่ได้คิดถึงมันอีก' },
      { label: 'ไปถามครูแนะแนวก่อนตัดสินใจ', fx: { network: 1 }, clearFlags: clear,
        outcomes: [{ p: 2, setFlags: ['cadet_dream'], result: 'ครูบอกว่า "ติดมาแล้วครั้งหนึ่ง ปีนี้ก็ติดได้ ลองอีกทีเถอะ"' },
          { p: 1, setFlags: ['cadet_let_go'], result: 'ครูถามกลับว่าปีก่อนทำไมไม่ไป ตอบไม่ได้ เลยตัดสินใจไม่สมัคร' }] }]);
  };
  S.pack = (st, b) => {
    const P = st.cadet.p2, d = N(st).report_days ?? 2;
    P.chosen = b;
    P.steps = [['farewellSchool'], ['farewellFriends'], ['reportAsk', 0]];
    return status('หนังสือแจ้งรายงานตัว', `โรงเรียนเตรียมทหาร (ต่อ ${BT(st, b)}) เปิดรับรายงานตัวที่${campus(st)} ${d * 2} วัน ใช้ ${d} วันแรกเก็บของและบอกลาได้\nเตรียมเสื้อผ้าตามรายการ ตัดผมสั้นเกรียน เอาบัตรประชาชนกับหนังสือแจ้งฉบับนี้มาด้วย`);
  };
  S.farewellSchool = (st) => C('farewell_school', 'วันที่ 1 · โรงเรียนเก่า', 'ไปยื่นเรื่องลาออกที่ห้องธุรการ ครูประจำชั้นเซ็นให้แล้วถามว่า "จะไปแล้วเหรอ"', [
    { label: 'ไปกราบลาครูประจำชั้น', fx: { relations: 1 }, result: 'ครูลูบหัวที่เพิ่งตัดเกรียน บอกว่ากลับมาเยี่ยมด้วยนะ' },
    { label: 'แวะลาครูพละที่สนาม', fx: { health: 1 }, result: 'ครูให้วิ่งรอบสนามรอบสุดท้าย "เอาไว้อวดรุ่นน้อง"' },
    { label: 'ไปคืนหนังสือห้องสมุดที่ค้างไว้', fx: { knowledge: 1 }, result: 'บรรณารักษ์ยกเลิกค่าปรับให้ เป็นของขวัญ' },
    { label: 'เดินดูห้องเรียนเดิมเป็นครั้งสุดท้าย', fx: { happiness: 1 }, result: 'โต๊ะตัวเดิมยังมีรอยปากกาที่เขียนไว้ตอน ม.ต้น' }]);
  S.farewellFriends = (st) => C('farewell_friends', 'วันที่ 2 · บอกลา', `พรุ่งนี้ต้องไปแล้ว กระเป๋าใบใหญ่ตั้งอยู่กลางห้อง ${elder(st)}พับเสื้อให้ทีละตัว`, [
    { label: 'นัดเพื่อนกินข้าวมื้อสุดท้าย', fx: { relations: 1 }, result: 'เพื่อนจ่ายให้ทั้งโต๊ะ บอกว่าไว้ติดยศแล้วค่อยเลี้ยงคืน' },
    { label: `อยู่ช่วย${elder(st)}จัดกระเป๋า`, fx: { relations: 1 }, result: `${elder(st)}แอบใส่ขนมไว้ก้นกระเป๋า ทั้งที่รายการบอกว่าห้ามนำมา` },
    { label: 'ไปไหว้พระขอพร', fx: { happiness: 1 }, result: 'ขอให้ตัวเองอดทนได้ ไม่ได้ขออะไรมากกว่านั้น' },
    { label: 'นอนเร็ว เก็บแรงไว้', fx: { health: 1 }, result: 'นอนไม่หลับอยู่นาน แต่ก็หลับไปเอง' }]);
  S.reportAsk = (st, n) => {
    const last = n > 0, d = N(st).report_days ?? 2;
    return C(last ? 'report_last' : 'report_ask', last ? 'วันสุดท้ายของการรายงานตัว' : 'ครบสองวันแล้ว',
      last ? 'วันนี้เป็นวันสุดท้ายที่โรงเรียนเตรียมทหารรับรายงานตัว ไม่ไปวันนี้ สิทธิ์จะหลุดไปถึงตัวสำรอง' : `ครบ ${d} วันแล้ว กระเป๋าพร้อม หนังสือแจ้งอยู่ในซอง จะออกเดินทางไป${campus(st)}เลยไหม`, [
        { label: 'ไปเลย', _report: 'go', result: 'ยกกระเป๋าขึ้นรถ ไม่หันกลับไปมองบ้าน กลัวจะไม่อยากไป' },
        { label: last ? 'ไม่ไป' : 'ขออีกสองวัน', _report: last ? 'no' : 'wait', result: last ? 'นั่งดูนาฬิกาจนเลยเวลาปิดรับรายงานตัว' : 'วางกระเป๋าไว้ที่เดิม บอกตัวเองว่าขอเวลาอีกนิด' }]);
  };
  S.extraDays = (st) => C('extra_days', 'สองวันที่ขอไว้', 'กระเป๋ายังตั้งอยู่กลางห้อง ไม่มีใครในบ้านพูดถึงมัน ทุกคนเดินอ้อม', [
    { label: 'นั่งคิดว่ากลัวอะไรอยู่', result: 'กลัวคิดถึงบ้าน กลัวสู้รุ่นพี่ไม่ได้ กลัวทุกอย่างพร้อมกัน' },
    { label: `คุยกับ${elder(st)}ตรง ๆ`, fx: { relations: 1 }, result: `${elder(st)}ฟังจนจบ แล้วบอกว่าตัดสินใจเองนะ ไม่ว่าทางไหนก็ยังเป็นลูก` },
    { label: 'โทรหารุ่นพี่ที่เคยผ่าน', fx: { network: 1 }, result: 'รุ่นพี่บอกว่าคืนแรกทุกคนร้องไห้ คืนที่สามจะหลับเป็นตาย' },
    { label: 'ออกไปเดินเล่นให้หัวโล่ง', fx: { happiness: 1 }, result: 'เดินจนมืด กลับมากระเป๋ายังอยู่ที่เดิม' }]);
  S.noReport = (st) => { st.cadet.p2.failStage = 'noreport'; return status('ไม่มารายงานตัว', 'เลยกำหนดรายงานตัวแล้ว สิทธิ์ถูกส่งต่อให้ตัวสำรองลำดับถัดไป\nปีนี้ถือว่าสอบตก เพราะไม่มารายงานตัว'); };
  // รายงานตัว = จบเส้นสอบ · ธงบอกเหล่าและปีติดยศให้เนื้อหาต่อไป (ชีวิตใน รร.เตรียมทหาร/บันไดยศ = งานถัดไป)
  S.arrive = (st, b) => {
    st.title = 'นตท.';   // คำนำหน้าเริ่มวันรายงานตัวตามของจริง (เจ้าของเคาะ A 2026-11-06) · โชว์ที่หัวจอ/สายตระกูล ไม่ใส่ใน {ชื่อ} · เฟส 3 เปลี่ยนเป็น นนร./นนอ./นรต.
    st.flags.cadet_passed = true;
    st.flags[`cadet_branch:${b}`] = true;
    info(st).passAge = st.age;
    info(st).commissionAge = st.age + commissionYears(st, b);   // บันไดยศเริ่มที่อายุนี้ (ตร. 6 ปี · เหล่าอื่น 7 ปี)
    info(st).branch = b;
    // ⚠ ชั่วคราว จนกว่าเปิดเฟส 3 (เจ้าของเคาะ 2026-11-06): เข้า track โรงเรียนนายร้อยเดิมของ career.mjs
    // กันการ์ดสอบมหาวิทยาลัย/ด่านเลือกทางเรียน/หางานหลังสอบติด · track นี้ให้วุฒิ + เข้าบันไดยศเองที่อายุ until
    // ข้อจำกัดที่เจ้าของรับไว้: (ก) ติดยศที่ 22 ตายตัว ยังไม่ตาม commissionAge (ข) ทร./ทอ. เข้าบันได army (ค) ช่วงเรียนใช้กองปกติ
    st.school = b === 'police' ? 'police_cadet' : 'cadet';
    st.needJob = false;
    st.cadet.p2.steps = [['end']];
    // ฉากหน้าประตูตามที่ตั้งจริงของปีนั้น (บท S1): กรุงเทพฯ = รถเมล์ + ถนน · นครนายก = ข้อความเดิม
    const y = year(st), gate = y >= (N(st).campus_nayok_year ?? 2543) ? 'รถจอดหน้าประตูโรงเรียนเตรียมทหารตอนเช้ามืด รุ่นพี่ในชุดฝึกยืนเรียงรับ'
      : `รถเมล์จอดหน้าประตูโรงเรียนเตรียมทหารริมถนน${y < (N(st).campus_rama4_year ?? 2504) ? 'ราชดำเนิน' : 'พระรามที่ 4'} ตอนเช้ามืด รถเริ่มติดตั้งแต่ฟ้ายังไม่สว่าง รุ่นพี่ในชุดฝึกยืนเรียงรับ`;
    return status(`รายงานตัวที่${campus(st)}`, `${gate}\nเขียนชื่อลงสมุดรายงานตัว ช่องเหล่าเขียนว่า ${BT(st, b)} อีกหลายปีจะได้ติดยศ`);   // ⚠ ชั่วคราว: ไม่ระบุจำนวนปีจนเปิดเฟส 3 (ตอนนี้ติดยศที่ 22 ตายตัว ไม่ตรง commissionYears)
  };
  S.end = () => 'END';

  // ไม่ติด: การ์ดจากเนื้อหา (ตามอายุ) + เหตุที่ตก · อายุยังไม่เกินและไม่ได้เลิก = ปีหน้ายังอยู่ในเส้น
  S.failed = (st) => {
    const P = st.cadet.p2, I = info(st), list = [].concat(D(st).failed ?? []), last = st.age >= (N(st).last_age ?? 18);
    let c = list.find((x) => (last ? /18/.test(x.id ?? '') || (x.cond?.ageMin ?? x.ageMin ?? 0) >= 18 : !/18/.test(x.id ?? '') && !((x.cond?.ageMin ?? x.ageMin ?? 0) >= 18))) ?? list[0] ?? { title: 'ไม่ติด', text: 'ปีนี้ยังไม่ติด', options: [{ label: 'ต่อ' }] };
    const writtenNone = !P.branches.some((b) => P.written[b]);
    const why = writtenNone ? c.reasonLines?.[P.reason[P.branches[0]]] ?? c.reasonLines?.written ?? ''
      : ({ noshow: 'ผ่านข้อเขียนแล้ว แต่ไม่ไปสอบพลศึกษาภายในกำหนด', injury: 'ผ่านข้อเขียนแล้ว แต่เจ็บก่อนวันสอบพละจนสอบไม่ไหว', noreport: 'สอบติดแล้ว แต่ไม่ไปรายงานตัวภายในกำหนด',
        interview: 'ผ่านพลศึกษาแล้ว แต่คะแนนสัมภาษณ์ยังไม่ถึงเกณฑ์', noshow_iv: 'ผ่านมาถึงรอบสุดท้ายแล้ว แต่ไม่ไปสัมภาษณ์ภายในกำหนด', declined: 'ติดแล้ว แต่สละสิทธิ์ทุกเหล่า' })[P.failStage]
        ?? (c.reasonLines?.land ?? 'ตกรอบพลศึกษา').replaceAll('{สถานี}', 'รอบพลศึกษา เพราะร่างกายยังไม่ถึงเกณฑ์ของเหล่าที่สมัคร');
    I.lastFail = writtenNone ? 'written' : P.failStage ?? 'land';
    I.everFailed = true;
    const nTh = TH_NUM[I.tries] ?? 'สาม';
    const retryRes = { written: 'ซื้อข้อสอบเก่าชุดใหม่มาอ่านตั้งแต่สัปดาห์แรก', land: 'เริ่มวิ่งตอนเช้าตั้งแต่วันจันทร์ถัดมา', injury: 'พักข้อเท้าให้หาย แล้วค่อยกลับไปวิ่ง', interview: 'ซ้อมตอบคำถามหน้ากระจกทุกคืน' }[I.lastFail] ?? 'บอกตัวเองว่าปีหน้าจะไม่หนีอีก';
    c = { ...c, id: 'failed', text: (c.text ?? '').replaceAll('{เหตุ}', why), options: (c.options ?? [{ label: 'ต่อ' }]).map((o) => ({ ...o, fx: { ...(o.fxByReason?.[I.lastFail] ?? o.fx), money: 0 },
      label: (o.label ?? '').replaceAll('ทั้งสามใบ', `ทั้ง${nTh}ใบ`), hint: o.hintByAge?.[st.age] ?? o.hint,
      result: o.label === 'สอบใหม่ แก้จุดที่พลาด' ? retryRes : o.result })) };
    P.steps = [['endYear']];
    return c;
  };
  S.endYear = (st) => {
    const last = st.age >= (N(st).last_age ?? 18);
    delete st.flags.cadet_exam_door;
    if (!last && !has(st, 'cadet_let_go')) {
      st.flags.cadet_dream = true;
      st.flags.cadet_retry = true;
      // ฤดูสอบวนกลับมา: ต้นปีหน้า (ก่อนใบแจ้งสิทธิสอบ)
      st.cadet.p2 = null;
      st.cadet.steps = [['season']];
      st.cadet.waitAge = st.age + 1;
      return 'HOLD';
    }
    return 'END';
  };
  const _cadetHolding = (st) => !!st.cadet && st.cadet.waitAge > st.age;

  return { cadetActive: _cadetActive, cadetAfterChoice: _cadetAfterChoice, cadetCard: _cadetCard, chooseCadet: _chooseCadet, cadetHolding: _cadetHolding };
})();
// ธงที่แกนเส้นนี้ตั้งเอง (ไม่มีตัวเลือกในเนื้อหาตั้ง) — lint flag-unset ยอมให้การ์ดอ้างได้
export const CADET_SET_FLAGS = ['cadet_passed', 'cadet_retry', 'cadet_body_seen', 'cadet_declined_seat'];
export const cadetActive = CADET.cadetActive;
export const cadetAfterChoice = CADET.cadetAfterChoice;
export const cadetCard = CADET.cadetCard;
export const chooseCadet = CADET.chooseCadet;
export const cadetHolding = CADET.cadetHolding;
