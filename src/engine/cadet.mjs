// เส้นเตรียมทหาร (B-cadet): สนามสอบเฟส 2 + ฉากรอบสมัคร/ปีสอบซ้ำ เป็นทริปของตัวเองแบบเดียวกับทริปศาล (court.mjs)
// st.cadet = ลำดับขั้นที่กำลังเล่น (null = ไม่มี) · st.cadetInfo = ความจำข้ามปี (สอบกี่ครั้ง · ตกเพราะอะไร · ใบสมัคร)
// ทุกค่าใน state เป็นข้อมูลล้วน (เซฟได้) · สุ่มจาก stream ของตัวเอง (seed ^ SALT + ตัวนับ) ไม่แตะ rng ของโลก
// เนื้อหา/ตัวเลข: content/rules/cadet.yaml (ที่มา: demo ที่เจ้าของเคาะ 2026-11-05) · fx ในไฟล์นั้นเป็นหน่วย demo (×numbers.fx_unit แต้ม)
import { STAT_KEYS, fill, stageOf, fxTag, TAG_MID, whenOk, heirCase, campusName, parentAlive } from './life.mjs';

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
  // B3 แอบสอบ (ยกจาก Demo e0829772/6260c876 · เจ้าของรับ 2026-11-09): เพื่อนสนิทที่มาด้วยได้จริง = มีธงผูกพันเพื่อน a/c
  // ไม่มี = ปุ่มที่ต้องมีเพื่อนสนิทอยู่ข้าง ๆ ล็อกพร้อมเหตุ (ไม่ใช่เพื่อนลอย ๆ ที่โผล่มาเอง)
  const closeBond = (st) => has(st, 'cadet_bond_a') || has(st, 'cadet_bond_c');
  const BOND_REQ = { anyFlags: ['cadet_bond_a', 'cadet_bond_c'] };
  const needBond = (st, why) => (secretNow(st) ? { requires: BOND_REQ, lockReason: why } : {});
  // B3 แอบสอบ: ปุ่ม "โทรบอกที่บ้าน" ทั้ง 3 รอบประกาศผล = โทรสารภาพ ที่บ้านรู้ทันที ล้างธงลับ (เจ้าของเคาะ 2026-11-09 · Demo revealCall)
  // merit ใส่ตามบท แต่ _chooseCadet ยังไม่อ่าน merit (เหมือนการ์ดสละสิทธิ์)
  const revealCall = (result) => ({ label: 'โทรบอกที่บ้านว่าแอบไปสอบมา', hint: 'ที่บ้านจะรู้ทุกอย่างตอนนี้', fx: { relations: 1 }, merit: { sila: 1 },
    clearFlags: ['cadet_family_secret'], setFlags: ['cadet_family_told'], result });

  // ---------- B4 ตัวช่วยฉากประกาศผล (ยกจาก Demo cadet-full-demo.html 12104–12269 · เจ้าของสั่ง "เริ่มสร้าง" 2026-11-10) ----------
  // ข้อความทั้งหมดอยู่ที่ content/rules/cadet.yaml → announce · ตัวเลขอยู่ที่ numbers (ไม่ฝังในโค้ด)
  const A = (st) => D(st).announce ?? {};
  // ยุคดูผล: ก = ก่อน web_year (ป้าย/หนังสือพิมพ์) · ข = ก่อน phone_result_year (ร้านเน็ต/โทรศัพท์บ้าน) · ค = ไฟล์ในเพจ/กลุ่มแชต
  const eraR = (st) => (year(st) < N(st).web_year ? 'ก' : year(st) < (N(st).phone_result_year ?? 2567) ? 'ข' : 'ค');
  // บ้านไกลสนาม (ทาง B · เจ้าของ 2026-11-06): ธง cadet_exam_far หรือเกิดในภาคที่ announce.farRegions ระบุ = ต้องนั่งรถกลับบ้านหลังสอบ
  const examFar = (st) => has(st, 'cadet_exam_far') || (A(st).farRegions ?? []).includes(st.region);
  // {คน} (Demo kinWord §7.2): แอบสอบ = เพื่อน · ไม่งั้นคนในบ้าน · ไม่มีพ่อแม่ = ผู้ใหญ่ที่มาด้วย
  const kinWord = (st) => { const k = A(st).kin ?? {}; return (secretNow(st) ? k.secret : k[family(st)] ?? k.none) ?? 'ผู้ใหญ่ที่มาด้วย'; };
  // ตัวแทนเฉพาะฉาก ({เลข} {มึง} ฯลฯ) แทนก่อน fill — ไม่เพิ่มคีย์ใน FILL ของทั้งเกม
  const sub = (s, map) => Object.entries(map).reduce((t, [k, v]) => t.replaceAll(`{${k}}`, String(v)), String(s ?? ''));
  // Q-V3: มึง/กู เฉพาะเพื่อนสนิท (cadet_bond_a · cadet_bond_c · กลุ่มติว) · เพื่อนทั่วไปใช้ นาย/เรา
  const buddy = (st) => (['cadet_bond_a', 'cadet_bond_c', 'cadet_prep_group'].some((f) => has(st, f)) ? { มึง: 'มึง', กู: 'กู' } : { มึง: 'นาย', กู: 'เรา' });
  // ข้อ 4 ปากคน: ตัวเลขเป็นคำอ่าน (สิบแปด · หกสิบสาม) · roughTh = ปัดลงหลักสิบ + "กว่า" (63 → หกสิบกว่า)
  const TH_DIGIT = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  function numTh(n) {
    n = Math.round(n);
    if (!n) return 'ศูนย์';
    const th = Math.floor(n / 1000) % 10, h = Math.floor(n / 100) % 10, t = Math.floor(n / 10) % 10, u = n % 10;
    return (th ? TH_DIGIT[th] + 'พัน' : '') + (h ? TH_DIGIT[h] + 'ร้อย' : '') + (t ? (t === 1 ? '' : t === 2 ? 'ยี่' : TH_DIGIT[t]) + 'สิบ' : '')
      + (u ? (u === 1 && t ? 'เอ็ด' : TH_DIGIT[u]) : '');
  }
  const roughTh = (n) => (n % 10 ? numTh(n - (n % 10)) + 'กว่า' : numTh(n));
  // waitMood (Q2): คะแนนแบบวัดดีสุดทุกเหล่าที่สอบ ≥ wait_mood_good = good · ≥ written_min = mid · ต่ำกว่า = bad (ไม่ดูความรู้)
  function waitMood(st) {
    const P = st.cadet.p2, best = Math.max(0, ...P.branches.map((b) => P.scores[b] ?? 0));
    return best >= (N(st).wait_mood_good ?? 20) ? 'good' : best >= N(st).written_min ? 'mid' : 'bad';
  }
  // ผลสุ่มสองทาง (Demo rnd · V6 = numbers.outcome_split_p) · showIf/hideIf ในเนื้อหาจัดที่ render
  const rndOpt = (st, o) => {
    if (!o.rnd) return o;
    const p = N(st).outcome_split_p ?? 0.5, { rnd, ...rest } = o;
    return { ...rest, outcomes: rnd.map((x, i) => ({ ...x, p: i === 0 ? p : 1 - p })) };
  };
  // ยุค ก: หนังสือพิมพ์ลงรายชื่อ = ทางดูผลที่ 5 ทุกรอบประกาศ (Q5 · S1 g-32 2026-11-06) · afternoon = รอบสุดท้ายประกาศบ่าย
  const paperOpt = (st, afternoon) => ({ ...(A(st).paper ?? {})[afternoon ? 'afternoon' : 'morning'], fx: { knowledge: 1 }, _how: 'paper' });
  // บรรทัดผลจากหนังสือพิมพ์ · "บางเหล่า" มีเฉพาะรอบข้อเขียน (Demo paperLine)
  const paperLine = (st, sum, written) => (sum === 'some' && !written ? '' : A(st).paper?.lines?.[sum] ?? '');
  const paperHead = (st, sum, written) => [A(st).paper?.head, paperLine(st, sum, written)].filter(Boolean).join('\n');
  // ร้านกาแฟตัดหน้าหนังสือพิมพ์: ยุค ก + ที่บ้านรู้ · ออกครั้งเดียวต่อปี (จำใน p2 ซึ่งล้างทุกปีสอบ · เกลี่ย S3 ข้อ 14)
  function paperCheer(st) {
    const P = st.cadet.p2;
    if (eraR(st) !== 'ก' || secretNow(st) || P.paperCheered) return '';
    P.paperCheered = true;
    return A(st).paper?.cheer ?? '';
  }
  // หมวกใบเก่าของพ่อ/แม่ที่เป็นทหาร/ตำรวจ (D3 บท S1 รอบ 2 · เจ้าของรับ 2026-11-06)
  // B5 (เจ้าของเคาะ 2026-11-09 · R2): คนที่เคยรับราชการมาจาก heirCase (ครอบครัวชาตินี้) ไม่ใช้ parents[].ancestor
  // father = พ่อยังอยู่ · mother = มีแต่แม่ (แม่รับราชการเอง) · lateFather = พ่อที่เสียแล้ว → แม่ที่ยังอยู่หรือป้าเป็นคนหยิบหมวกของพ่อ
  const heirHatOwner = (st) => {
    const hc = heirCase(st), dad = hc !== 'mother';
    return { hc, who: dad ? 'พ่อ' : 'แม่', young: dad ? 'ตอนหนุ่ม ๆ' : 'ตอนสาว ๆ', keeper: hc === 'lateFather' ? (parentAlive(st, 'หญิง') ? 'แม่' : 'ป้า') : null };
  };
  function heirHat(st, heir) {
    const hat = heir === 'police' ? 'ตำรวจ' : 'ทหาร', { who, young, keeper } = heirHatOwner(st);
    if (!keeper) return `${who}หยิบหมวก${hat}ใบเก่าออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือน${who}${young}"`;
    if (keeper === 'แม่') return `แม่หยิบหมวก${hat}ใบเก่าของพ่อออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือนพ่อ${young}"`;
    return `ป้าหยิบหมวก${hat}ใบเก่าของพ่อออกจากตู้มาสวมให้ "พอดีหัวเลย เหมือนพ่อเอ็ง${young}"`;
  }
  // ที่ตั้งโรงเรียนตามปี (numbers.campus_*) — แทน "นครนายก" ที่เคยเขียนตายทุกยุค
  const campus = (st) => campusName(st);   // ตัวเดียวกับ {ที่ตั้ง} ใน fill (life.mjs) · B1
  // การ์ดผิดหวัง (G4 · เจ้าของสั่ง 2026-11-06): คนเก็บหมวกกลับเข้าตู้ใช้หลักเดียวกับ heirHat — พ่อ/แม่ที่รับราชการถ้ายังอยู่ · ไม่งั้นอีกคน · ไม่มีพ่อแม่ = ป้า
  // B5: ใช้ heirHatOwner เดียวกับ heirHat (heirCase · ไม่ใช้ ancestor)
  function heirHatBack(st, heir) {
    const hat = heir === 'police' ? 'ตำรวจ' : 'ทหาร', { who, keeper } = heirHatOwner(st);
    if (!keeper) return `${who}เก็บหมวก${hat}ใบเก่ากลับเข้าตู้ ไม่ได้พูดถึงอีก`;
    return `${keeper}เก็บหมวก${hat}ใบเก่าของพ่อกลับเข้าตู้ ไม่ได้พูดถึงอีก`;
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
    // B5: heir รับค่าเดียวหรือรายการ (X9-ค = [army, police] ทายาทสายไหนก็ได้)
    if (c.heir && ![].concat(c.heir).includes(heir)) return false;
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
    // B1 (ยกจาก Demo condOk): family 'father' = พ่อยังอยู่ · heirAlive = คนที่เคยรับราชการยังอยู่ในบ้าน (ไม่ใช่พ่อที่เสียแล้ว)
    if (c.family === 'father' && !(fam === 'both' || fam === 'fatherOnly')) return false;
    if (c.heirAlive && heirCase(st) === 'lateFather') return false;
    if (c.family === 'fatherOnly' && fam !== 'fatherOnly') return false;
    if (c.noParents && fam !== 'none') return false;
    if (c.poor === true && clsGroup(st) !== 'poor') return false;
    if (c.poor === false && clsGroup(st) === 'poor') return false;
    // B4 (ยกจาก Demo x2wCard W3 · last = S.age >= 18): lastTry true = ปีสุดท้ายที่อายุยังสมัครได้ · false = ยังมีปีหน้า
    if (c.lastTry != null && (st.age >= (N(st).last_age ?? 18)) !== c.lastTry) return false;
    return true;
  }
  // requires ของตัวเลือก: คีย์ rival* ล็อกไว้จนกว่าจะมีระบบเพื่อนคู่แข่ง (เจ้าของเคาะ 2026-11-06) · ที่เหลือใช้ condOk
  const reqOk = (st, r) => !Object.keys(r).some((k) => k.startsWith('rival')) && condOk(st, r);
  // requires.reasons (B1): เหตุล็อกแยกตามข้อ — ข้อแรกที่ไม่ผ่านและมีเหตุเขียนไว้ · ไม่มี = lockReason รวม
  function lockOf(st, o) {
    if (o.lock) return o.lock;
    const r = o.requires;
    if (!r || reqOk(st, r)) return null;
    // R3 (เจ้าของเคาะ 2026-11-09): เหตุเรื่องเล่าก่อนเหตุเงิน
    const keys = Object.keys(r.reasons ?? {}).sort((a, b) => (a === 'money') - (b === 'money'));
    const own = keys.find((k) => k in r && !reqOk(st, { [k]: r[k] }));
    return fill(own ? r.reasons[own] : o.lockReason ?? 'ยังเลือกไม่ได้', st);
  }
  // show_if / hide_if (B1 · เดโมเขียน showIf/hideIf): เงื่อนไขแบบ condOk · ไม่ตรง = ตัดตัวเลือกออก (ไม่โชว์ล็อก)
  // การ์ดแกนเก็บรายการที่แสดงจริงไว้ใน st.cadet.cur ตัวเลขที่กดจึงชี้ตัวที่เห็นเสมอ
  const visible = (st, o) => {
    const s = o.show_if ?? o.showIf, h = o.hide_if ?? o.hideIf;
    return (!s || condOk(st, s)) && (!h || !condOk(st, h));
  };
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
  // B4: {คน} (Demo kinWord) ไม่มีใน FILL ของ life.mjs — แทนในเส้นนี้ก่อนส่งเข้า fill ทุกครั้ง (ข้อความ · ปุ่ม · คำใบ้ · การ์ดผล)
  const fillK = (s, st) => fill(String(s ?? '').replaceAll('{คน}', kinWord(st)), st);
  function render(st, c) {
    let text = fillK(c.text ?? '', st);
    const hit = (c.contextLines ?? []).find((x) => condOk(st, x.when));
    if (hit) text += ' ' + fillK(hit.line, st);
    // ล็อกปุ่ม (เจ้าของเคาะ 2026-11-06): requires ไม่ผ่าน = ล็อก พร้อม lockReason จากเนื้อหา · ล็อกครบทุกปุ่ม = ปลดปุ่มสุดท้าย กันเกมค้าง
    const options = (c.options?.length ? c.options : [{ label: 'ต่อ' }]).filter((o) => visible(st, o)).map((o) => ({ ...o, lock: lockOf(st, o) }));
    if (options.every((o) => o.lock)) options[options.length - 1].lock = null;
    st.cadet.cur = options;
    st.cadet.curId = c.id;
    return {
      kind: 'event', cadet: true, id: `cadet:${c.id}`, type: 'A', national: false, funeral: false,
      age: st.age, stage: stageOf(st.age), title: c.title ? fillK(c.title, st) : null, text,
      choices: options.map((o) => fillK(o.label, st)),
      hints: options.map((o) => (o.hint ? fillK(o.hint, st) : null)),
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
    // B4 (Demo _flow): ค่าที่ฉากถัดไปอ่าน เช่น rehearsed = ซ้อมคำพูดไว้แล้ว (X2w-W5 → X3b / การ์ดตก) · จำใน P ซึ่งล้างทุกปีสอบ
    if (o._flow && P) Object.assign(P, o._flow);
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
  S.res = (st, text, tag = TAG_MID, evId) => ({ kind: 'result', cadet: true, type: 'A', age: st.age, stage: stageOf(st.age), text: fillK(text, st), tag, ...(evId && { evId }) });

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
        // B3 แอบสอบ (Demo retryEveCard d6efcd16): โทรหาบ้านแบบลับ บอกว่าค้างบ้านเพื่อน
        secretNow(st) ? { label: 'โทรหาบ้าน บอกว่าค้างบ้านเพื่อน', fx: { happiness: -1 }, result: 'ปลายสายถามว่ากินข้าวหรือยัง ไม่มีใครถามเรื่องสอบ เพราะไม่มีใครรู้' }
          : { label: 'โทรหาบ้าน', fx: { relations: 1 }, result: 'ปลายสายบอกว่าปีนี้ไม่ต้องรีบ ทำเท่าที่ทำได้' },
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
    // B4 (Demo 12061–12064 · เจ้าของสั่ง "เริ่มสร้าง" 2026-11-10): วันว่าง X2w → เช้าวันประกาศ X3a → ผลทุกสนาม X3 (→ X3b ถ้าผ่านอย่างน้อยหนึ่ง)
    // แทน waitDay → announce written → board เดิม · ขั้นเดิมยังอยู่ให้เซฟเก่าที่ค้างกลางทางเล่นต่อได้
    P.steps.push(['x2w'], ['x3a'], ['x3']);
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
    // B3 แอบสอบ (Demo announceCard · e0829772): ยุคเว็บ เพื่อนสนิทเปิดเว็บดูแล้วโทร/ส่งข้อความมาบอกตามยุค ไม่ได้เดินไปดูป้าย
    // ปุ่มนี้ตอนแอบสอบต้องมีเพื่อนสนิทจริง (cadet_bond_a/c) ไม่งั้นล็อก "มาคนเดียว ไม่มีใครดูแทน"
    const sec = secretNow(st);
    const friendWeb = year(st) >= (n.line_year ?? 2555) ? 'เพื่อนสนิทรับปากว่าจะเปิดเว็บดูให้ แล้วข้อความก็เงียบไปนาน ก่อนจะเด้งเข้ามาหนึ่งบรรทัด'
      : 'เพื่อนสนิทรับปากว่าจะเปิดเว็บดูให้ ไม่ถึงชั่วโมงโทรศัพท์ก็ดังขึ้น';
    const how = (self) => [self, { label: `ให้${who}ดูให้`, fx: { relations: 1 }, _how: 'elder',
      result: sec && web ? friendWeb : `${who}เดินเข้าไปก่อน หันกลับมาโดยยังไม่พูดอะไร`, ...needBond(st, 'มาคนเดียว ไม่มีใครดูแทน') },
      // S3 (g-b7 สั่ง 2026-11-10): ยุคเว็บ = รอเว็บโหลด · รอบสุดท้ายประกาศบ่ายสาม รอถึงบ่ายสี่ ไม่ใช่ "จนสาย" (ตาม Demo)
      web ? { label: 'รอให้เว็บโหลดได้ก่อน', fx: { health: 1 }, _how: 'wait', result: 'กดโหลดใหม่ทีละนาที จนหน้าเว็บยอมขึ้น' }
        : { label: 'รอให้คนซาก่อนค่อยดู', fx: { health: 1 }, _how: 'wait', result: round === 'final' ? 'นั่งนับมดบนโต๊ะจนบ่ายสี่ ไม่ต้องเบียดใคร' : 'นั่งรอใต้ต้นไม้จนสาย ไม่ต้องเบียดใคร' },
      { label: 'แวะไหว้พระก่อน แล้วค่อยไปดู', fx: { happiness: 1 }, _how: 'pray', result: 'จุดธูปขอให้ใจนิ่ง ไม่ได้ขอให้ติด' },
      // B4 (Demo announceCard): ยุค ก มีหนังสือพิมพ์เป็นทางดูผลที่ 5 ทุกรอบ · รอบสุดท้ายประกาศบ่าย = ฉบับบ่าย
      ...(web ? [] : [paperOpt(st, round === 'final')])];
    const self = web ? { label: 'นั่งกดรีเฟรชหน้าเว็บที่ล่มอยู่', fx: { health: -1 }, _how: 'self', result: 'เว็บค้างไปครึ่งชั่วโมง พอหน้าโหลดขึ้น นิ้วก็สั่น' }
      : { label: 'ไปเบียดดูหน้าป้ายเอง', fx: { network: 1 }, _how: 'self', result: 'เบียดอยู่กลางคนเป็นร้อย ได้คุยกับคนที่มาดูผลเหมือนกัน' };
    if (round === 'final') return C('announce_final', 'บ่ายวันประกาศผลสุดท้าย',
      `กินข้าวกลางวันไม่ลง ${web ? 'ผลจะขึ้นเว็บตอนบ่ายสาม' : 'ป้ายสุดท้ายจะติดตอนบ่ายสาม'} ${sec ? (closeBond(st) ? 'เพื่อนสนิทนั่งรอเป็นเพื่อน' : '') : elder(st) + 'นั่งรออยู่ด้วย'}\nรอบนี้ไม่มีรอบหน้าแล้ว ติดคือติด`, how(self));   // B3: ไม่มีเพื่อนสนิท = ไม่มีบรรทัดเพื่อนนั่งรอ
    const body = round === 'body';
    return C(body ? 'announce_body' : 'announce', body ? 'เช้าวันประกาศผลพลศึกษา' : 'เช้าวันประกาศผล',
      `${I.tries > 1 ? 'ปีก่อนก็ตื่นแต่เช้าแบบนี้ ' : ''}ตื่นตั้งแต่ตีห้าครึ่ง ${web ? 'ผลจะขึ้นเว็บตอนเก้าโมง' : 'ป้ายจะติดหน้ากองสอบตอนเก้าโมง'} ${sec
        // B3 แอบสอบ (Demo announceCard B1): ที่บ้านไม่รู้ว่ามีวันประกาศผล ไม่ใช่ "ไม่มีใครพูดเรื่องผลสอบ"
        ? `ที่บ้านยังหลับกันอยู่ ไม่มีใครรู้ว่าวันนี้มีอะไร ${web ? 'ต้องเปิดจอหรี่ไฟไว้ใต้ผ้าห่ม' : 'ต้องย่องออกจากบ้านให้เงียบที่สุด'}`
        : elder(st) + 'ตื่นมาหุงข้าวก่อนเวลา ไม่มีใครพูดเรื่องผลสอบ'}\n` +
      (body ? `รอบนี้คือผลพลศึกษาและตรวจร่างกาย ผ่านแล้วเหลือแค่สัมภาษณ์\nเลขประจำตัวสอบ ${P.examNo} เลขเดิม` : `เลขประจำตัวสอบ ${P.examNo} จำได้ขึ้นใจตั้งแต่วันสมัคร`), how(self));
  };
  // B3 แอบสอบยุคเว็บ ให้เพื่อนสนิทดูแทน (Demo x3Card open.ข/ring · e0829772): รอผลทางมือถือที่ศาลาท้ายซอย ไม่ใช่โทรศัพท์บ้าน
  // เพื่อนโทร/ส่งข้อความมาตามยุค (line_year) ไม่ได้เดินไปดูป้าย · ไม่มีพ่อแม่ก็ใช้ได้เหมือนกัน
  function secretWebHead(st, none) {
    const msg = year(st) >= (N(st).line_year ?? 2555);
    return `ถือโทรศัพท์มือถือออกไปนั่งรอที่ศาลาท้ายซอย ไม่ให้คนในบ้านได้ยิน\n${msg ? 'ข้อความจากเพื่อนสนิทเด้งขึ้นมา' : 'โทรศัพท์ในมือสั่นขึ้น เพื่อนสนิทอยู่ปลายสาย'} ${none ? (msg ? 'ว่าไม่เจอเลขของเรา' : 'เงียบไปนานก่อนจะบอกว่าไม่เจอ') : (msg ? 'เป็นรูปหน้าเว็บ วงเลขของเราไว้' : 'อ่านเลขให้ฟังทีละบรรทัด')}`;
  }
  const secretWeb = (st) => secretNow(st) && st.cadet.p2.how === 'elder' && year(st) >= N(st).web_year;
  function headLine(st, none, kind, all = false) {
    const P = st.cadet.p2, no = P.examNo, who = checker(st), web = year(st) >= N(st).web_year;
    if (secretWeb(st)) return secretWebHead(st, none);
    // B4 (Demo bodyBoard 12627): ดูจากหนังสือพิมพ์ (ยุค ก) = หัวหนังสือพิมพ์ + บรรทัดผล
    if (P.how === 'paper') return paperHead(st, none ? 'none' : all ? 'all' : 'some', kind === 'written');
    return ({
      self: web ? `หน้าเว็บโหลดขึ้นมาทีละบรรทัด ไล่หาเลข ${no}${kind === 'written' ? ' ทีละเหล่า' : ''}` : `นิ้วไล่ลงตามรายชื่อบนป้าย หาเลข ${no}${kind === 'written' ? ' ทีละเหล่า' : ''}`,
      elder: none ? `${who}เดินกลับมาช้า ๆ ไม่พูดอะไร` : `${who}หันกลับมา ยิ้มก่อนจะพูด แล้วยื่นกระดาษที่จดไว้ให้ดู`,
      wait: `หน้าป้ายเหลือคนไม่กี่คน ไล่หาเลข ${no} ได้ช้า ๆ`,
      pray: `กลิ่นธูปยังติดมือ ยืนนิ่งหน้าป้าย แล้วค่อย ๆ ไล่หาเลข ${no}`,
    })[P.how] ?? `ไล่หาเลข ${no}`;
  }
  function reactOpts(st, none, last) {
    const P = st.cadet.p2, who = checker(st), elderHere = P.how === 'elder' && !secretNow(st);
    // B3: แอบสอบ = "กลับไปหาเพื่อนสนิท" ต้องมีเพื่อนสนิทมาด้วยจริง (Demo bodyBoard/finalBoard · เจ้าของรับ 2026-11-09)
    if (none) return [{ label: 'อ่านซ้ำอีกรอบ เผื่อมองข้าม', result: 'ไล่ดูอีกสองรอบ เลขนั้นไม่มีจริง ๆ' },
      { label: `เดินกลับไปหา${who}`, fx: { relations: 1 }, result: `${who}จับไหล่ไว้ ไม่ถามอะไรสักคำ`, ...needBond(st, 'มาคนเดียว ไม่มีใครรออยู่') },
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งอยู่ใต้ต้นไม้จนคนกลับกันหมด' },
      st.age < (N(st).last_age ?? 18) ? { label: 'จำหน้าป้ายนี้ไว้ ปีหน้าจะกลับมา', fx: { knowledge: 1 }, result: 'คืนนั้นหยิบหนังสือเล่มเดิมขึ้นมาเปิดอีกครั้ง' }
        : { label: 'เก็บบัตรสอบใบนี้ไว้', fx: { happiness: 1 }, result: 'ปีสุดท้ายแล้ว แต่ได้ลองจนสุดทาง' }];
    return [year(st) >= N(st).photo_year ? { label: 'ถ่ายรูปป้ายเก็บไว้', fx: { happiness: 1 }, result: 'ซูมจนเห็นเลขตัวเองชัด ๆ' } : { label: 'จดเลขลำดับไว้ในสมุด', fx: { happiness: 1 }, result: 'เขียนตัวโต ๆ แล้ววงไว้สองรอบ' },
      // B3: แอบสอบ = โทรสารภาพ (Demo board 12234 / bodyBoard 12641) · ที่บ้านรู้ทันที ล้างธงลับ
      elderHere ? { label: `หันไปกอด${who}`, fx: { relations: 1 }, result: `${who}กอดตอบแน่นกว่าที่คิด` }
        : secretNow(st) ? revealCall(last ? 'ปลายสายถามซ้ำสามรอบว่าไปสอบมาตั้งแต่เมื่อไร แล้วบอกว่ากลับบ้านมาเล่าให้ฟังให้หมด'
          : '{ผู้ใหญ่}เงียบไปนาน "ไปสอบเตรียมทหารมาเหรอ แล้วผ่านด้วย?" แล้วก็หัวเราะทั้งที่ยังงง')
        : { label: 'โทรบอกที่บ้านทันที', fx: { relations: 1 }, result: 'ปลายสายเงียบไปครู่หนึ่ง แล้วเสียงก็ดังขึ้น' },
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

  // ---------- B4 · X2w วันว่างก่อนประกาศ (Demo x2wCard 12271 · §7.1) ----------
  // การ์ดตามสถานะ: แอบสอบ → บ้านลำบากที่บ้านไม่ได้ออกค่าติว → อารมณ์จากคะแนนแบบวัด · บรรทัดบริบท ≤ 2 (ที่พัก → บ้าน/ทายาท → ติว → ปีซ้ำ)
  // แอบสอบไม่มีบรรทัดที่บอกว่าบ้านรู้ (B3)
  S.x2w = (st) => {
    const a = A(st).wait ?? {}, secret = secretNow(st), web = year(st) >= N(st).web_year, fam = family(st);
    const ctx = [examFar(st) ? (web ? a.farWeb : a.farBeforeWeb) : a.near];   // ทาง B (เจ้าของ 2026-11-06): บ้านไกล = นั่งรถกลับบ้านเมื่อคืน
    const hl = heirOf(st) && !secret ? (a.heirLines ?? []).find((x) => condOk(st, x.when)) : null;
    if (hl) ctx.push(hl.line);
    else if (!secret && a.famLine?.[fam]) ctx.push(a.famLine[fam]);
    const pr = a.prep ?? {};
    if (has(st, 'cadet_prep_camp') && web) ctx.push(pr.campWeb);
    else if (has(st, 'cadet_prep_group')) ctx.push(pr.group);
    else if (has(st, 'cadet_prep_self')) ctx.push(pr.self);
    else if (has(st, 'cadet_prep_senior')) ctx.push(pr.senior);
    if (has(st, 'cadet_retry')) ctx.push(a.retry);
    const key = secret ? 'secret' : clsGroup(st) === 'poor' && !has(st, 'cadet_family_support') ? 'poor' : waitMood(st);
    const c = a.cards?.[key] ?? { text: '', options: [] };
    const text = (c.text ?? '') + (key === 'mid' && web ? c.textWeb ?? '' : '');
    // S3 (g-b7 2026-11-10): resultWeb = ผลของตัวเลือกในยุคเว็บ (ไม่ต้องนั่งรถไปดูป้าย)
    return C(`x2w_${key}`, a.title ?? 'วันว่างก่อนประกาศผล', `${a.open ?? ''}\n${text}\n${ctx.filter(Boolean).slice(0, 2).join(' ')}`, (c.options ?? []).map((o) => rndOpt(st, web && o.resultWeb ? { ...o, result: o.resultWeb } : o)));
  };

  // ---------- B4 · X3a เช้าวันประกาศ · วิธีดูผล (Demo x3aCard 12330 · §7.2) ----------
  // ผลของตัวเลือกไม่มีการ์ดคั่น — X3 เปิดด้วยบรรทัดตามวิธีดูเอง · ยุค ก มีทางที่ 5 หนังสือพิมพ์
  S.x3a = (st) => {
    const a = A(st).morning ?? {}, e = eraR(st), P = st.cadet.p2, secret = secretNow(st), O = a.options ?? {};
    P.examNo ??= 10000 + Math.floor(rand(st) * 9000);
    const L = (v) => (v && typeof v === 'object' ? v[e] : v);
    const hl = heirOf(st) ? (a.heirLines ?? []).find((x) => condOk(st, x.when)) : null;
    // บรรทัดบริบท: ปีซ้ำ → แอบสอบ (B3 ที่เลื่อนมา B4: "มากับเพื่อนสนิทคนเดียวที่รู้" ต้องมีธงผูกพันจริง) → ทายาท
    const ctx = has(st, 'cadet_retry') ? a.retry : secret ? (closeBond(st) ? a.secretBond : a.secretAlone) : hl ? hl.line : '';
    const options = [
      { label: L(O.self?.label), hint: L(O.self?.hint), fx: e === 'ข' ? { money: -1 } : { health: -1 }, _how: 'self' },
      // B3: แอบสอบ = ให้เพื่อนดู ต้องมีเพื่อนสนิทมาด้วยจริง (needBond)
      { label: O.elder?.label ?? 'ให้{คน}ดูให้', fx: { relations: 1 }, _how: 'elder', ...needBond(st, O.elder?.lockReason ?? 'มาคนเดียว ไม่มีใครดูแทน') },
      { label: L(O.wait?.label), hint: O.wait?.hint, fx: { network: 1 }, _how: 'wait' },
      { label: L(O.pray?.label), fx: { happiness: 1 }, merit: { bhavana: 1 }, _how: 'pray' },
      ...(e === 'ก' ? [{ ...paperOpt(st, false), result: undefined }] : [])];
    return C(`x3a_${e}`, a.title ?? 'เช้าวันประกาศผล', `${L(a.text) ?? ''}${ctx ? '\n' + ctx : ''}\n${sub(a.examNo ?? 'เลขประจำตัวสอบ {เลขสอบ}', { เลขสอบ: P.examNo })}`, options);
  };

  // ---------- B4 · X3 ผลทุกสนาม ใบเดียว (Demo x3Card 12387 · §7.3) ----------
  // บล็อกคะแนนใต้ผล (writtenScoreLine · เจ้าของเคาะ B) คงเดิม · แอบสอบยุค ข ให้เพื่อนดู = ถือมือถือไปรอที่ศาลา (แทน secretWebHead ในใบนี้ ตามที่เจ้าของรับ)
  S.x3 = (st) => {
    const a = A(st).results ?? {}, P = st.cadet.p2, e = eraR(st), how = P.how ?? 'self', secret = secretNow(st);
    const pass = P.branches.filter((b) => P.written[b]), fail = P.branches.filter((b) => !P.written[b]);
    const all = !fail.length, none = !pass.length, sum = all ? 'all' : none ? 'none' : 'some';
    const fr = (firstOk(st, D(st).board) ?? {}).failReasons ?? {};
    const home = e === 'ข' && how === 'elder';   // ยุค ข ให้คนอื่นดู = รออยู่ข้างโทรศัพท์บ้าน · แอบสอบ = ถือมือถือออกไปรอนอกบ้าน
    const kw = home && !secret ? elder(st) : kinWord(st);   // อยู่บ้าน = คนในบ้านจริง (ไม่มีพ่อแม่ = ป้า)
    const ring = secret ? a.ringSecret : a.ringHome;
    const op = a.open?.[how] ?? {};
    let open = how === 'paper' ? `${paperOpt(st, false).result}\n${A(st).paper?.head ?? ''}${a.paperTail ?? ''}` : op[e] ?? op.ก ?? '';
    if (home && secret) open = a.openHomeSecret;
    const block = P.branches.map((b) => (P.written[b]
      ? sub(a.passRow, { เหล่า: BT(st, b), ลำดับ: 20 + (25 - (P.scores[b] ?? 0)) * 30 + Math.floor(rand(st) * 29) })   // G1 รอบ 2: ลำดับตามคะแนน (สูตรเดียวกับป้ายเดิม)
      : sub(a.failRow, { เหล่า: BT(st, b) }) + (fr[P.reason?.[b]] ? `\n   ${fr[P.reason[b]]}` : '')));
    if (!none && fail.some((b) => has(st, 'cadet_lean:' + b))) block.push(a.lean);
    const sm = a.summary ?? {};
    const summary = all ? (P.branches.length > 1 ? sm.allMany : sm.allOne) : none ? sm.none : sub(sm.some, { ผ่าน: pass.length, ทั้งหมด: P.branches.length });
    const R = a.react ?? {};
    let react = how === 'paper' ? paperLine(st, sum, true) : R[how]?.[sum] ?? '';
    if (e === 'ค' && how === 'wait') react = sub(none ? R.waitค?.none : R.waitค?.pass, buddy(st));   // Q-V3
    if (e === 'ข' && how === 'wait') react = R.waitข?.[sum] ?? react;
    if (e === 'ค' && how === 'elder') react = R.elderค?.[sum] ?? react;
    if (home) react = sub(R.home?.[sum], { เสียง: ring });
    // Q3 เจ้าของไม่รับ (g-b7 2026-11-10): คืนบรรทัดคู่แข่งเดิม board.rivalLines (เพื่อนห้องสาม · เด็กผิวคล้ำแดด) ให้ขึ้นได้ตามเงื่อนไขเดิม
    // บรรทัดลูกนายพล (rivalCamp/rivalAll · ข้อ general ใน rivalLines) = บรรทัดนาน ๆ ขึ้น ใช้ rare_line_p · คู่แข่งกับลูกนายพลไม่ซ้อนในใบเดียว
    // เห็นคู่แข่งได้ต้องยืนอยู่หน้าป้าย: ปีแรก · ไม่ใช่ดูเว็บเอง (เงื่อนไขเดิม) · ไม่ใช่อยู่บ้านรอโทรศัพท์ · ไม่ใช่อ่านหนังสือพิมพ์
    const camp = has(st, 'cadet_prep_camp'), ek = e === 'ค' ? 'ค' : 'else', n = N(st);
    const atBoard = info(st).tries <= 1 && (year(st) < n.web_year || how !== 'self') && !home && how !== 'paper';
    const rv = atBoard ? ((firstOk(st, D(st).board) ?? {}).rivalLines ?? []).filter((r) => !r.general).find((r) => condOk(st, r.when)) : null;
    const rl = [];
    if (rv) rl.push(rv.line);
    else if (rand(st) < (n.rare_line_p ?? 0.25)) rl.push(home ? (camp ? a.homeCamp : null) : camp ? a.rivalCamp?.[ek] : a.rivalAll?.[ek]);   // อยู่บ้าน ไม่เห็นป้าย ได้ยินจากที่ติวเท่านั้น
    if (!home && rand(st) < (n.rare_line_p ?? 0.25)) rl.push(a.rare);   // V7 บรรทัดหายากคนนามสกุลซ้ำ (ไม่ใช่คู่แข่ง)
    const text = `${open}\n\n${block.join('\n')}\n\n${summary}\n${react}\n${rl.filter(Boolean).slice(0, 2).join(' ')}`.replaceAll('{คน}', kw);
    const last = st.age >= (N(st).last_age ?? 18);
    // ตัวเลือก (Demo x3Card): ตก = แยกตามวิธีที่ดู (อยู่บ้าน/ให้คนดู/ดูเอง) · B3 ที่เลื่อนมา B4 · ผ่าน = ตามยุค
    const opts = none ? [
      home ? { label: `ขอให้${kw}ดูซ้ำอีกรอบ`, fx: { happiness: -1 }, result: `${kw}เงียบไปพักหนึ่ง แล้วบอกว่าดูสามรอบแล้ว ไม่มีจริง ๆ` }
        : { label: 'ไล่ดูอีกรอบ เผื่อตาฝาด', fx: { happiness: -1 }, result: 'รอบที่สามช้ากว่ารอบแรก แต่ตัวเลขก็ยังเหมือนเดิม' },
      { label: 'ดูว่าขาดไปตรงไหน', hint: 'เจ็บ แต่รู้ว่าปีหน้าต้องแก้อะไร', fx: { knowledge: 1 },
        result: last ? 'จดบรรทัดเหตุไว้ ไม่ใช่เพื่อปีหน้า แต่เพื่อไม่ลืม' : 'จดบรรทัดเหตุไว้หลังบัตรสอบ ตัวหนังสือเล็กจนแทบอ่านไม่ออก' },
      secret ? { label: 'เก็บไว้คนเดียวก่อน', fx: { happiness: -1 }, result: 'บัตรสอบพับเก็บไว้ลึกสุดของกระเป๋า' }
        : home ? { label: `คุยกับ${kw}ต่อในสาย`, fx: { relations: 1 }, result: `${kw}บอกว่าไม่เป็นไร เดี๋ยวกลับถึงบ้านแล้วค่อยคุยกัน` }
        : how === 'elder' ? { label: `คุยกับ${kw}ตรง ๆ`, fx: { relations: 1 }, result: `${kw}จับไหล่ไว้ บอกว่าไม่เป็นไร กลับบ้านไปกินข้าวกันก่อน` }
        : { label: 'บอกที่บ้านเองก่อนใคร', fx: { relations: 1 }, result: 'ปลายทางเงียบไปนิดหนึ่ง แล้วบอกว่าไม่เป็นไร คืนนี้กินข้าวด้วยกัน' },
      home ? { label: 'วางสายแล้วนั่งเงียบ ๆ', result: secret ? 'นั่งอยู่ที่ศาลาจนมืด แล้วค่อยเดินกลับบ้านเหมือนไม่มีอะไร' : 'นั่งข้างโทรศัพท์อยู่อย่างนั้นจนมืด' }
        : { label: 'เดินออกมาเงียบ ๆ', result: 'เดินผ่านเสียงดีใจของคนอื่น ไม่หันกลับไปมอง' }]
      : [
        { label: 'ร้องออกมาดัง ๆ', fx: { happiness: 1 }, result: home ? (secret ? 'ร้องดังจนคนที่เดินผ่านศาลาหันมามอง' : 'ร้องดังจนหมาข้างบ้านเห่าตาม') : all ? 'เสียงดังจนคนแปลกหน้าหันมาปรบมือให้' : 'ร้องได้ครึ่งเสียง แล้วนึกถึงอีกแผ่น' },
        e === 'ก' ? { label: 'จดเลขลำดับใส่ฝ่ามือ', fx: { happiness: 1 }, result: 'หมึกปากกาซึมลงลายมือ ไม่ยอมล้างจนถึงเย็น' }
          : home ? { label: `จดเลขลำดับที่${kw}อ่านให้ฟัง`, fx: { happiness: 1 }, result: secret ? 'เขียนตัวโต ๆ ไว้หลังบัตรสอบ แล้ววงไว้สองรอบ' : 'เขียนตัวโต ๆ บนปฏิทินข้างโทรศัพท์ แล้ววงไว้สองรอบ' }
          : e === 'ข' ? { label: 'สั่งพิมพ์หน้านั้นเก็บไว้', hint: 'ได้กระดาษเก็บ แต่เสียค่าพิมพ์', fx: { happiness: 1, money: -0.4 }, result: 'กระดาษยังอุ่นจากเครื่องพิมพ์ พับใส่กระเป๋าเสื้อ' }
          : { label: 'แคปหน้าจอเก็บไว้', fx: { happiness: 1 }, result: 'รูปเดียวกันถูกแคปซ้ำสามรอบ กลัวมันหาย' },
        home ? { label: `ขอให้${kw}ดูเลขของ${secret ? 'คนที่ติวด้วยกัน' : 'เพื่อน'}ให้ด้วย`, fx: { relations: 1 }, merit: { help_others: 1 }, result: `${kw}ไล่หาให้อีกรอบ จนเจอเลขของ${secret ? 'คนที่ติวด้วยกัน' : 'เพื่อน'}` }
          : { label: 'มองหาเลขของเพื่อนด้วย', fx: { relations: 1 }, merit: { help_others: 1 }, result: 'ไล่หาให้คนข้าง ๆ ที่หาไม่เจอ จนเขาเจอ' },
        { label: 'นิ่งไว้ รอบสองยังไม่จบ', hint: 'ใจไม่ฟุ้ง แต่ไม่ได้ฉลองเต็มที่', fx: { health: 1 }, result: 'พยักหน้าให้ตัวเองครั้งเดียว แล้วคิดถึงสระว่ายน้ำ' },
        // B3 แอบสอบ (เจ้าของเคาะ 2026-11-09): ปุ่มโทรสารภาพยังอยู่ในใบผลรอบแรก (Demo x3 ไม่มี — คงพฤติกรรม B3 ของเกมไว้ตามใบงาน)
        ...(secret ? [revealCall('{ผู้ใหญ่}เงียบไปนาน "ไปสอบเตรียมทหารมาเหรอ แล้วผ่านด้วย?" แล้วก็หัวเราะทั้งที่ยังงง')] : [])];
    P.steps = none ? [['failed']] : [['x3b'], ['physAsk', 'phys'], ['nearExam'], ['bodyDay'], ['judgeBody'], ['bodyWait'], ['announce', 'body'], ['bodyBoard']];
    return C(none ? 'x3_none' : 'x3_pass', a.title ?? 'ผลทุกสนาม', `${text}\n\n${P.branches.map((b) => writtenScoreLine(st, b)).join('\n')}`, opts);
  };

  // ---------- B4 · X3b คนรอบตัวฉลอง (Demo x3bCard 12453 · §7.4) · ตัวเลือก = 5 ทางเตรียมรอบสอง (board.options) ----------
  // แทน cheer('phys') เดิม · แอบสอบยังไม่มีบรรทัดดีใจของบ้าน (B3) ยกเว้น Q-N1 หนังสือพิมพ์ยุค ก เปิดความลับ
  function writtenMouth(st, pass) {
    const P = st.cadet.p2, best = Math.max(...pass.map((b) => P.scores[b] ?? 0));
    return sub(A(st).mouth?.written, { เลข: numTh(best) });
  }
  function friendScoreLine(st, pass) {
    const P = st.cadet.p2, n = N(st), mine = Math.max(...pass.map((b) => P.scores[b] ?? 0));
    const theirs = n.written_min + Math.floor(rand(st) * (25 - 1 - n.written_min + 1));   // เพื่อนติวก็ผ่านเส้น (Demo: เส้น..24)
    return sub(A(st).mouth?.friend, { ...buddy(st), เลข: numTh(mine), เลขเพื่อน: numTh(theirs) });
  }
  const friendWrittenLine = (st) => {
    const f = A(st).joy?.friendWritten ?? {}, y = year(st);
    return sub(y < (N(st).mobile_year ?? 2542) ? f.before : y < (N(st).line_year ?? 2555) ? f.phone : f.line, buddy(st));
  };
  S.x3b = (st) => {
    const a = A(st).celebrate ?? {}, pp = A(st).paper ?? {}, P = st.cadet.p2, fam = family(st);
    const pass = P.branches.filter((b) => P.written[b]), fail = P.branches.filter((b) => !P.written[b]);
    // Q-N1 (เจ้าของ 2026-11-06): แอบสอบ + ยุคหนังสือพิมพ์ + ผ่าน → ป้าข้างบ้านถือหนังสือพิมพ์มาเคาะประตู ที่บ้านรู้ทันที (ล้างธงลับ)
    let reveal = '';
    if (secretNow(st) && eraR(st) === 'ก') {
      reveal = `${pp.reveal}\n${sub(pp.revealHome, { บ้าน: pp.revealHomeWord?.[fam] ?? 'ผู้ใหญ่ที่ดูแล' })}${P.rehearsed ? pp.rehearsedUsed ?? '' : ''}\n`;
      delete st.flags.cadet_family_secret;
      st.flags.cadet_family_told = true;
    }
    const secret = secretNow(st), e = eraR(st), g = clsGroup(st), poorFar = g === 'poor' && examFar(st), J = A(st).joy?.written ?? {};
    // S3 (g-b7 2026-11-10): พ่อแม่ครบ ก่อนยุคมือถือหรือบ้านลำบาก = ปั่นจักรยานไปบอกเพื่อนบ้าน แทนโทรหาเพื่อนที่ทำงาน
    const noPhone = fam === 'both' && (year(st) < (N(st).mobile_year ?? 2542) || g === 'poor');
    const main = secret ? a.secretMain : (noPhone ? J.bothNoPhone : null) ?? J[fam] ?? J.none;
    // ข้อ 4 ปากคน: บ้านรู้ = คนในบ้านพูดคะแนน · แอบสอบ + เพื่อนติว = เพื่อนพูดคะแนน
    const friend = has(st, 'cadet_prep_group') || has(st, 'cadet_bond_a');
    const mouth = !secret && !reveal ? writtenMouth(st, pass) : secret && friend ? friendScoreLine(st, pass) : '';
    // บรรทัดบริบท ≤ 2 · ลำดับ: บางเหล่าไม่ผ่าน → แอบสอบ+ซ้อมคำพูด → แอบสอบ+เพื่อน → ทายาท → เพื่อนติว → ค่ายติว → รุ่นพี่ → ร้านกาแฟ/ฐานะ → ยุค → ปีซ้ำ
    const L = [];
    if (fail.length) L.push(a.someFail);
    if (secret && P.rehearsed) L.push(a.rehearsed);
    if (secret && closeBond(st)) L.push(a.secretBond);
    const hl = !secret && heirOf(st) ? (a.heirLines ?? []).find((x) => condOk(st, x.when)) : null;
    if (hl) L.push(hl.line);
    if (!secret && friend) L.push(friendWrittenLine(st));
    if (has(st, 'cadet_prep_camp')) {   // ตำแหน่งบนป้ายที่ติวตามคะแนน (numbers.camp_board_top/mid)
      const sc = Math.max(...pass.map((b) => P.scores[b] ?? 0)), n = N(st);
      L.push(sub(a.campBoard, { ที่: a.campSpot?.[sc >= (n.camp_board_top ?? 21) ? 'top' : sc >= (n.camp_board_mid ?? 17) ? 'mid' : 'low'] }));
    }
    if (has(st, 'cadet_prep_senior') || has(st, 'cadet_senior_tutor')) L.push(a.senior);
    // เกลี่ย S3 ข้อ 15/17/18: ร้านกาแฟนับในเพดาน 2 บรรทัด แทนบรรทัดฐานะ · ใบ Q-N1 ไม่ใส่ (หนังสือพิมพ์ซ้ำในใบเดียว)
    const pc = reveal ? '' : paperCheer(st);
    if (pc) L.push(pc);
    else if (!secret) {
      if (g === 'poor') L.push(poorFar && e !== 'ค' ? a.poorFar : a.poor);   // บ้านต่างจังหวัดลำบาก ยุค ก–ข ยังเป็นเสียงตามสาย
      else if (g === 'rich') L.push(year(st) >= (N(st).line_year ?? 2555) ? a.richLine : a.richPhone);
      else L.push(a.mid);
    }
    if (!secret) {
      if (e === 'ค') L.push(sub(a.eraค, { โพสต์: a.eraคWho?.[fam] ?? a.eraคWho?.else ?? 'แม่' }));
      if (e === 'ข') L.push(a.eraข);
    }
    if (has(st, 'cadet_retry')) L.push(a.retry);
    const tail = !secret && rand(st) < (N(st).rare_line_p ?? 0.25) ? `\n${a.rareYai}` : '';   // V7 บรรทัดหายาก
    if (pc && !L.slice(0, 2).includes(pc)) P.paperCheered = false;   // ถูกตัดออกจากเพดาน = ยังไม่นับว่าออก
    const prep = (firstOk(st, D(st).board) ?? {}).options ?? [{ label: 'ต่อ' }];
    return C('x3b', a.title ?? 'เย็นวันประกาศผล', `${reveal}${main}\n${mouth ? mouth + '\n' : ''}${L.filter(Boolean).slice(0, 2).join('\n')}${tail}\n\n${a.tail ?? ''}`, prep);
  };

  S.cheer = (st, round) => {
    const P = st.cadet.p2, iv = round === 'iv', fin = round === 'final', fam = family(st), who = elder(st), L = [];
    const live = fin ? P.final : iv ? P.branches.filter((b) => P.body?.[b]) : P.branches.filter((b) => P.written[b]);
    const gone = P.branches.filter((b) => (iv ? P.written[b] : !fin) && !live.includes(b));
    // B3 แอบสอบ (เจ้าของเคาะ 2026-11-09): ที่บ้านไม่รู้จนกว่าจะสารภาพเอง หรือจนติดรอบสุดท้าย
    // เดิมเย็นวันประกาศผลทุกรอบเผยความลับเอง = ผิดกติกาใหม่ · ข้อเขียน/พละผ่านแล้วยังเป็นความลับ ใช้คำว่า "ผ่าน" ไม่ใช่ "ติด" (Demo cheerCard)
    const wasSecret = secretNow(st), keepSecret = wasSecret && !fin;
    if (keepSecret) L.push(iv ? 'ผลพลศึกษาออกแล้ว ผ่าน แต่ที่บ้านยังไม่รู้ว่ามีอะไรให้ดีใจ {ชื่อ} กินข้าวเย็นเหมือนทุกวัน ยิ้มอยู่คนเดียว'
      : 'ผ่านข้อเขียนแล้ว แต่ที่บ้านยังไม่รู้ว่ามีอะไรให้ดีใจ {ชื่อ} กินข้าวเย็นเหมือนทุกวัน ยิ้มอยู่คนเดียว');
    else if (wasSecret) {
      // รอบสุดท้าย: ใบแจ้งรายงานตัวต้องให้ผู้ปกครองเซ็น ยื่นให้ดูตอนกินข้าวเย็น แล้วเป็นฉากตกใจปนดีใจตามคนในบ้าน (เจ้าของเคาะ 2026-11-09)
      L.push(`ใบแจ้งรายงานตัวต้องให้ผู้ปกครองเซ็น {ชื่อ}ยื่นใบนั้นให้${fam === 'both' ? 'พ่อกับแม่' : '{ผู้ใหญ่}'}ดูตอนกินข้าวเย็น`);
      L.push(fam === 'both' ? 'แม่อ่านแล้วตกใจจนพูดไม่ออก ตีแขนเบา ๆ "แอบไปสอบแล้วติดซะด้วยเนี่ยนะ!" พ่อหยิบใบไปอ่านซ้ำอีกสองรอบ แล้วทั้งบ้านก็หัวเราะลั่น'
        : '{ผู้ใหญ่}อ่านแล้วตกใจจนพูดไม่ออก ตีแขนเบา ๆ "แอบไปสอบแล้วติดซะด้วยเนี่ยนะ!" แล้วก็หัวเราะลั่นบ้าน');
      delete st.flags.cadet_family_secret;   // จากนี้ไม่ใช่ความลับแล้ว
      st.flags.cadet_family_told = true;
    } else {
      // B4 ฉากดีใจ (Demo cheerCard 12565 · cadet-voice-joy-pass.md ข้อ 3 · Q-L2): ตารางตามคนในบ้าน announce.joy.<รอบ> · ไม่มีพ่อแม่ = none (ป้า)
      const J = A(st).joy?.[fin ? 'final' : iv ? 'iv' : 'written'] ?? {};
      L.push(J[fam] ?? J.none ?? '');
    }
    const heir = heirOf(st);
    if (heir && fin) L.push(heirHat(st, heir));   // หมวกทายาท · B5: คนสวมหมวกให้ตาม heirCase
    if (!iv && !fin && (has(st, 'cadet_prep_group') || has(st, 'cadet_bond_a'))) L.push(friendWrittenLine(st));   // B4 เพื่อนติวตามยุค (ใช้กับเซฟเก่าที่ค้าง cheer phys)
    const sn = A(st).joy?.senior ?? {};
    if (has(st, 'cadet_senior_tutor') || has(st, 'knows_senior')) L.push(fin ? sn.final : iv ? sn.iv : sn.written);
    // B4 E2 · บรรทัดตามฐานะรอบสุดท้าย + ข้อ 4 ปากคน (ลำดับที่จาก P.ranks ที่ finalBoard จำไว้) รอบละ 1 บรรทัด
    const g = clsGroup(st), fc = A(st).joy?.finalClass ?? {}, M = A(st).mouth ?? {};
    const r = fin ? live.map((b) => P.ranks?.[b]).filter(Boolean).sort((p, q) => p.rank - q.rank)[0] : null;
    const speaker = fin && r && g === 'poor' && examFar(st) && eraR(st) !== 'ค';   // บ้านต่างจังหวัดลำบาก ยุค ก–ข ยังมีเสียงตามสาย
    if (fin && g === 'poor') L.push(speaker ? sub(fc.poorSpeaker, { เลข: numTh(r.rank) }) : fc.poor);
    else if (fin && g === 'rich') L.push(fc.rich);
    else if (fin) L.push(fc.mid);
    if (fin && r && !speaker) {
      const dad = fam === 'both' || fam === 'fatherOnly';
      if (dad && r.rank >= (N(st).rank_rough_from ?? 10)) L.push(sub(M.rankDad, { เลข: roughTh(r.rank) }));
      else if (g !== 'mid') L.push(sub(M.rankNeighbour, { เลข: numTh(r.rank) }));
    }
    const pcLine = paperCheer(st);   // ยุค ก หนังสือพิมพ์ · ออกครั้งเดียวต่อปี
    if (pcLine) L.push(pcLine);
    const sf = A(st).joy?.someFail ?? {}, names = (xs) => xs.map((b) => BT(st, b)).join(' ');
    if (gone.length) L.push(sub(fin ? sf.final : sf.other, { ไม่ติด: names(gone), ติด: names(live) }));
    const tl = A(st).joy?.tail ?? {};
    // B4 E1 (Demo cheerCard): ตัวเลือกรอบสุดท้ายแทนชุดเดิมทั้ง 4 (ตัด "ไม่มีใครถามเรื่องรอบหน้า") · รอบอื่น = ข้อ 3.4 · แอบสอบก่อนรอบสุดท้าย = ชุด B3 เดิม
    const finalOpts = (A(st).joy?.finalOptions ?? []).map((o, i) => (i === 0 && wasSecret
      // B3: ที่บ้านเพิ่งรู้จากใบเซ็น = ปุ่มแรกเป็นกอดคนที่เพิ่งรู้เรื่อง (Demo X6b)
      ? { label: 'กอด{ผู้ใหญ่}ที่เพิ่งรู้เรื่อง', fx: { relations: 1 }, result: '{ผู้ใหญ่}ตีหลังเบา ๆ สองที "คราวหน้าบอกกันก่อนนะ{ถิ่น}" แล้วกอดแน่นกว่าเดิม' } : o));
    return C(`cheer_${round}`, fin ? 'คืนที่บ้านไม่มีใครนอน' : iv ? 'เย็นวันประกาศผลพลศึกษา' : 'เย็นวันประกาศผล',
      `${L.filter(Boolean).join('\n')}\n\n${fin ? tl.final : iv ? tl.iv : tl.written}`, keepSecret ? [
        // B3 แอบสอบ ก่อนรอบสุดท้าย (Demo cheerCard · เจ้าของเคาะ 2026-11-09): เก็บไว้ต่อ หรือเล่าให้ที่บ้านฟังเอง (ความลับแตก)
        { label: 'เก็บไว้คนเดียวก่อน', fx: { happiness: 1 }, result: 'กินข้าวเย็นกับที่บ้านเหมือนทุกวัน ไม่มีใครรู้ว่าวันนี้ผ่านอะไรมา' },
        { label: 'เล่าให้ที่บ้านฟังตอนกินข้าวเย็น', hint: 'ที่บ้านจะรู้ทุกอย่างตอนนี้', fx: { relations: 1 }, merit: { sila: 1 },
          clearFlags: ['cadet_family_secret'], setFlags: ['cadet_family_told'],
          result: `{ผู้ใหญ่}วางช้อนลง "แอบไปสอบเตรียมทหารมาเหรอ แล้วผ่าน${iv ? 'พละ' : 'ข้อเขียน'}ด้วย?" แล้วก็หัวเราะทั้งที่ยังงง` },
        { label: 'ขอตัวเข้านอนเร็ว', fx: { health: 1 }, result: 'นอนเต็มอิ่มเป็นคืนแรกในรอบหลายเดือน' }] : fin ? finalOpts : (A(st).joy?.midOptions ?? []));
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
    // B3: บรรทัดทายาท (เก็บหมวกเข้าตู้) ไม่ขึ้นตอนแอบสอบ — ที่บ้านเพิ่งรู้เรื่อง ไม่เคยหยิบหมวกออกมา (Demo d6efcd16 · เจ้าของรับ 2026-11-09)
    return C('letdown', 'ความเงียบที่บ้าน', head + (heirOf(st) && !secretNow(st) ? `\n${heirHatBack(st, heirOf(st))}` : ''), [
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
    // B3 แอบสอบ (Demo bodyWaitCard B2): ที่บ้านไม่รู้ว่าไปสอบพละ = ตอบว่าเตะบอลมา
    { label: `ช่วย${elder(st)}ทำงานบ้านเบา ๆ`, fx: { relations: 1 }, result: secretNow(st) ? '{ผู้ใหญ่}ถามว่าทำไมเดินขาแข็ง ตอบไปว่าเตะบอลมา แล้วก็ได้ยาหม่องมาหนึ่งขวด' : `${elder(st)}ไม่ถามเรื่องสอบ แค่ยื่นยาหม่องมาให้` },
    { label: 'ไปนั่งเล่นกับเพื่อนที่สอบด้วยกัน', fx: { happiness: 1 }, result: 'เทียบกันว่าใครเมื่อยตรงไหน แล้วหัวเราะกันทั้งวง' }]);
  S.bodyBoard = (st) => {
    const P = st.cadet.p2, b = N(st).body_min, live = P.branches.filter((x) => P.written[x]);
    const pass = live.filter((x) => P.body[x]), fail = live.filter((x) => !P.body[x]), none = !pass.length;
    const lines = live.map((x) => `${BT(st, x)} (เกณฑ์ชีวิต ${b[x]}) ${P.body[x] ? 'ผ่าน' : 'ไม่ผ่าน'}`);
    const text = `${headLine(st, none, 'body', !fail.length)}\n${P.bodyHead}\n\n${lines.join('\n')}\n\n${!fail.length ? 'ผ่านพลศึกษาและตรวจร่างกายครบทุกเหล่า' : none ? 'ไม่ผ่านพลศึกษาสักเหล่า' : `ผ่าน ${pass.length} จาก ${live.length} เหล่า`}\n\n${bodyScoreLine(st, live)}`;   // บล็อกคะแนน (เจ้าของเคาะ B)
    P.steps = none ? [['failed']] : [['cheer', 'iv'], ['physAsk', 'iv'], ['ivEve'], ['ivIntro'], ['interview']];
    return C('body_board', 'ประกาศผลพลศึกษาและตรวจร่างกาย', text, none ? [
      { label: 'อ่านซ้ำอีกรอบ', result: 'ไล่ดูอีกสองรอบ เลขนั้นไม่มีจริง ๆ' }, { label: `เดินกลับไปหา${checker(st)}`, fx: { relations: 1 }, result: `${checker(st)}จับไหล่ไว้ ไม่ถามอะไรสักคำ`, ...needBond(st, 'มาคนเดียว ไม่มีใครรออยู่') },   // B3 เพื่อนสนิทต้องมาด้วยจริง
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งอยู่ใต้ต้นไม้จนคนกลับกันหมด' },
      { label: 'บอกตัวเองว่าปีหน้าจะซ้อมให้หนักกว่านี้', fx: { health: 1 }, result: 'เย็นนั้นออกไปวิ่งรอบหมู่บ้านทั้งที่ยังเมื่อย' }] : reactOpts(st, false, true));
  };
  S.ivEve = (st) => C('iv_eve', 'วันก่อนสัมภาษณ์', 'พรุ่งนี้คือรอบสุดท้าย ไม่มีวิ่ง ไม่มีข้อสอบ มีแค่โต๊ะตัวเดียวกับกรรมการสามคน', [
    // B3 แอบสอบ: ที่บ้านไม่รู้ = ซ้อมหน้ากระจกคนเดียว (Demo ivEveCard 6260c876 · เจ้าของรับ 2026-11-09)
    secretNow(st) ? { label: 'ซ้อมตอบหน้ากระจกคนเดียว', fx: { happiness: 1 }, result: 'ถามตัวเองว่า "ทำไมอยากเป็น" แล้วตอบหน้ากระจกจนจำได้ทุกคำ' }
      : { label: `ให้${elder(st)}ช่วยถามซ้อม`, fx: { relations: 1 }, result: `${elder(st)}ถามข้อแรกว่า "ทำไมอยากเป็น" แล้วฟังจนจบ` },
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
    const head = secretWeb(st) ? secretWebHead(st, none) : ({ self: web ? `หน้าเว็บโหลดขึ้นมา รายชื่อสั้นจนเลื่อนไม่สุดนิ้ว ไล่หาเลข ${no}` : `ป้ายแผ่นสุดท้าย รายชื่อสั้นจนอ่านจบในครั้งเดียว ไล่หาเลข ${no}`,
      elder: none ? `${who}เดินกลับมาช้า ๆ ไม่พูดอะไร` : `${who}ยังเดินไม่ถึงป้ายดี ก็หันกลับมาตะโกนเรียกชื่อ`, wait: `หน้าป้ายเหลือคนสองคน ไล่หาเลข ${no} ได้ช้า ๆ`, pray: `มือยังพนมค้างอยู่ตอนอ่านเลข ${no}`,
      // B4 (Demo finalBoard 12816): ยุค ก ดูจากหนังสือพิมพ์ฉบับบ่าย
      paper: paperHead(st, none ? 'none' : pass.length === P.branches.length ? 'all' : 'some', false) })[P.how] ?? `ไล่หาเลข ${no}`;
    const lines = P.branches.map((b) => (pass.includes(b) ? `${BT(st, b)} ติด` : `${BT(st, b)} ไม่ติด (${why(b)})`));
    P.final = pass;
    P.steps = none ? [['failed']] : [['cheer', 'final'], ['chooseOrPack']];
    // บล็อกคะแนน + รวม + ลำดับ (เจ้าของเคาะ B · C1–C4): ทุกเหล่าที่ถึงรอบสุดท้าย (ผ่านข้อเขียนและพละ)
    const reached = P.branches.filter((b) => P.written[b] && P.body?.[b]);
    const scores = reached.length ? `\n\n${[ivScoreLine(st), ...reached.map((b) => finalScoreLine(st, b, finalRank(st, b, pass.includes(b))))].join('\n')}` : '';
    return C('final_board', 'ประกาศผลรอบสุดท้าย', `${head}\n\n${lines.join('\n')}\n\n${none ? 'ปีนี้ไม่ติดสักเหล่า' : pass.length === P.branches.length ? 'ติดครบทุกเหล่าที่สมัคร' : `ติด ${pass.length} จาก ${P.branches.length} เหล่า`}${scores}`, none ? [
      { label: 'อ่านซ้ำอีกรอบ', result: 'มาถึงรอบสุดท้ายแล้ว แต่เลขนั้นไม่มีจริง ๆ' }, { label: `เดินกลับไปหา${who}`, fx: { relations: 1 }, result: `${who}บอกว่ามาถึงตรงนี้ก็เก่งแล้ว`, ...needBond(st, 'มาคนเดียว ไม่มีใครรออยู่') },   // B3 เพื่อนสนิทต้องมาด้วยจริง
      { label: 'ไปนั่งคนเดียวสักพัก', fx: { happiness: -1 }, result: 'นั่งจนป้ายถูกปลดลง' },
      st.age < (N(st).last_age ?? 18) ? { label: 'จดเลขคนที่ติดไว้ ปีหน้าจะมาใหม่', fx: { knowledge: 1 }, result: 'เขียนไว้หลังบัตรสอบ' } : { label: 'เก็บบัตรสอบใบนี้ไว้', fx: { happiness: 1 }, result: 'ปีสุดท้ายแล้ว แต่มาถึงรอบสุดท้ายได้ก็ไม่เสียใจ' }] : [
      { label: 'กระโดดกอดคนข้าง ๆ', fx: { happiness: 1 }, result: 'กอดไปแล้วถึงรู้ว่าไม่รู้จักกัน เขาก็ติดเหมือนกัน' },
      !secretNow(st) ? { label: `หันไปกอด${elder(st)}`, fx: { relations: 1 }, result: `${elder(st)}ร้องไห้ก่อนจะพูดอะไรออกมาได้` } : revealCall('{ผู้ใหญ่}เงียบไปพักใหญ่ แล้วร้องไห้ออกมา "แอบไปสอบจนติดเลยเหรอ"'),   // B3 โทรสารภาพ (Demo finalBoard 12835)
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
    // B4 (Demo arriveCard 12950 · บท S1): วันแรกที่ถูกเรียก นตท. · {ชื่อเต็ม} = ชื่อ (เกมยังไม่มีนามสกุล)
    return status(`รายงานตัวที่${campus(st)}`, `${gate}\nเขียนชื่อลงสมุดรายงานตัว ช่องเหล่าเขียนว่า ${BT(st, b)} อีกหลายปีจะได้ติดยศ\n${A(st).reportIn ?? ''}`);   // ⚠ ชั่วคราว: ไม่ระบุจำนวนปีจนเปิดเฟส 3 (ตอนนี้ติดยศที่ 22 ตายตัว ไม่ตรง commissionYears)
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
    // B4 (Demo failedCard 12978–12990): ซ้อมคำพูดไว้ตอนแอบสอบ (X2w-W5) แต่ไม่ได้ใช้
    const M = A(st).mouth ?? {}, n = N(st);
    if (P.rehearsed && secretNow(st)) c.text += `\n${M.unsaid}`;
    // g-b7 2026-11-10 (Demo failedCard stayedHome): ตกเพราะไม่ไปสอบพละ/สัมภาษณ์/รายงานตัว = วันนั้นไม่ได้ออกไปไหน ไม่มีทางกลับบ้าน
    if (['noreport', 'noshow', 'noshow_iv'].includes(P.failStage) && !writtenNone) c.text = c.text.replace('ทางกลับบ้านวันนั้นยาวกว่าขามา', 'วันนั้นทั้งวันไม่ได้ออกจากบ้าน');
    // ข้อ 4 ปากคน (บ้านรู้ · ยังมีปีหน้า): ตัวสำรอง = {ผู้ใหญ่} พูดว่าขาดไปกี่ที่ · ตกข้อเขียนทุกเหล่าเพราะความรู้ = พ่อ (ไม่มีพ่อ = {ผู้ใหญ่}) พูดว่าขาดกี่คะแนน
    if (!secretNow(st) && st.age < (n.last_age ?? 18)) {
      const res = Object.values(P.ranks ?? {}).filter((x) => x.kind === 'reserve').sort((p, q) => p.reserveNo - q.reserveNo)[0];
      const kb = P.branches.find((b) => !P.written[b] && (P.scores[b] ?? 0) >= n.written_min && (P.know?.[b] ?? st.knowledge) < n.know_min);
      const fam = family(st), dadSays = fam === 'both' || fam === 'fatherOnly' ? 'พ่อ' : elder(st);
      if (res) c.text += `\n${sub(M.reserve, { เลข: numTh(res.reserveNo) })}`;
      else if (kb && writtenNone) c.text += `\n${sub(M.knowGap, { พูด: dadSays, เลข: numTh(n.know_min - (P.know?.[kb] ?? Math.round(st.knowledge))) })}`;
    }
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
