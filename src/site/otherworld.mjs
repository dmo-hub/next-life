// ส่วนต่างโลกของหน้ารวมการ์ดและหน้าเฉลย (B88b): สร้างจากโมดูลต่างโลกในเอนจินทุกครั้งที่ build — การ์ดต่างโลกใบใหม่ขึ้นหน้าเว็บเอง
// หน้ารวมการ์ดได้แค่สิ่งที่จอแสดง (ชื่อโลก/สกิลพร้อมคำอธิบาย · ข้อความเหตุการณ์ · ตัวเลือก) · หน้าเฉลยได้ความยาก ผลสำเร็จ/พลาด ค่าที่ขยับ ธง และตอนจบ
// ชาติใหม่เกิดในทวีป (06d): ส่วนหลักพูดถึงแฟ้มเกิด/เผ่า/แคว้น · บทบาท 4 โลกกับการ์ดเฉพาะโลกย้ายไปกลุ่มพับ "ชาติเก่า" (ยังเล่นถึงจากเซฟ)
import { ISEKAI, ISEKAI_TIME, ISEKAI_STAGES, ISEKAI_STAT, ISEKAI_FX, ISEKAI_SKILLS, ISEKAI_WORLDS, ISEKAI_ROLES, ISEKAI_DEATH, ISEKAI_EVENTS, ISEKAI_MERIT, ISEKAI_KNOW, ISEKAI_KNOW_T, ISEKAI_LORE, ISEKAI_FAME, ISEKAI_POTION, ISEKAI_FOCUS, ISEKAI_CAREERS, ISEKAI_CAREER_T, GODDESS, GODDESS_VOWS, PATHS, CONT_LIFE, CONT_END, CONT_REGIONS, CONT_RACES, CONT_TIER, CONT_DISPUTES, contRaceStart, meritName, roleInfo } from '../engine/index.mjs';
import { esc, text as rawText } from './catalog.mjs';

// เหตุการณ์ตำนาน (B68i) เรียกชื่อคนต่างโลกรุ่นก่อนตอนเล่น — หน้าเว็บแสดงเป็นช่องชื่อแบบเดียวกับ {ชื่อชาติก่อน}
// site-check เทียบหน้ารวมการ์ดด้วยตัวนี้ตัวเดียวกัน ข้อความที่มีช่องชื่อจึงตรงกับที่หน้าแสดง
export const text = (s) => rawText(s.replaceAll('{legend}', '{ชื่อคนในตำนาน}'));

export const ISEKAI_SECTION = 'ต่างโลก';
const sgn = (n) => (n > 0 ? `+${n}` : String(n).replace('-', '−'));
// เหตุการณ์เฉพาะบทบาทใช้ id บทบาทใน worlds — roleInfo ตอบได้ทั้งโลกเดิมและบทบาทที่ไม่มีเนื้อเรื่องของโลก
const worldName = (id) => roleInfo(id).name;
// ชั้นเหตุการณ์ (ch) เป็นของภายใน — ผู้อ่านเห็นเป็นช่วงวัยที่สุ่มใบนั้นได้ (เจ้าของเคาะ) · ฉากสุดท้ายมาตามอายุของบทบาท ไม่ผูกช่วงวัย
const stageSpan = (ch) => {
  const s = ISEKAI_STAGES.filter((g) => g.ch.some((c) => ch.includes(c)));
  return s.length ? (s.length > 1 ? `${s[0].name}–${s.at(-1).name}` : s[0].name) : 'ตามอายุของบทบาท';
};
// การ์ดที่ไม่มี worlds มาได้ทั้งชาติทวีปและชาติเก่า (isekaiFitsRole) — ไม่ต้องติดป้ายโลก
const where = (e) => (e.worlds ? e.worlds.map(worldName).join(' · ') : null);
// ฉากเปิดและฉากสุดท้ายของแต่ละโลกอยู่ต้นและท้ายเสมอ — จัดไว้หัวกลุ่มให้อ่านตามลำดับเล่น
const groups = (old) => {
  const evs = ISEKAI_EVENTS.filter((e) => !!e.worlds === old);
  return [...new Set(evs.map((e) => e.ch[0]))].sort((a, b) => a - b).map((c) => ({
    label: stageSpan([c]),
    events: evs.filter((e) => e.ch[0] === c).sort((a, b) => Number(!!b.finale) - Number(!!a.finale) || Number(isIntro(b)) - Number(isIntro(a))),
  }));
};
const isIntro = (e) => Object.values(ISEKAI_WORLDS).some((w) => w.intro === e.id);
const tags = (e) => [where(e), e.finale ? null : stageSpan(e.ch), isIntro(e) ? 'ฉากเปิด' : null, e.finale ? 'ฉากสุดท้าย' : null].filter(Boolean);
const tagLine = (xs) => `<p class="tags">${xs.map((t) => `<span>${esc(t)}</span>`).join('')}</p>`;
// ใบเลือกก่อนเริ่มชาติ 3 ใบ: แฟ้มเกิด · สกิล · บทบาท (ชาติเก่า)
export const isekaiCardCount = () => ISEKAI_EVENTS.length + 3;
export const ISEKAI_OLD = 'ชาติเก่า (เซฟก่อนมีทวีป)';
const groupHtml = (gs, draw) => gs.map((g) => `<h3>${esc(g.label)} <small>${g.events.length} ใบ</small></h3><div class="grid">${g.events.map(draw).join('')}</div>`).join('');
// กลุ่มพับท้ายส่วนต่างโลก — site-check ตัดส่วนนี้ออกก่อนตรวจว่าหน้าไม่พูดถึงบทบาทแล้ว
const oldHtml = (pick, draw) => {
  const gs = groups(true);
  const n = gs.reduce((s, g) => s + g.events.length, 0) + 1;
  return `<details class="old" id="isk-old"><summary>${esc(ISEKAI_OLD)} <small>${n} ใบ</small></summary><p class="lead">ชาติต่างโลกที่เริ่มก่อนมีทวีปเลือกบทบาทจาก 4 โลก เซฟเดิมยังเล่นต่อได้จนจบชาติ ชาติใหม่ไม่เจอการ์ดกลุ่มนี้</p><h3>ก่อนเริ่มชาติ</h3><div class="grid">${pick}</div>${groupHtml(gs, draw)}</details>`;
};

// catalog.mjs กับไฟล์นี้ import กันไปมา — ห้ามเรียก esc/text ตอนโหลดโมดูล ต้องเรียกตอนสร้างหน้า
const lead = () => `<p class="lead">เลือก "${esc(PATHS.find((p) => p.id === 'isekai').text)}" ที่ปรโลก แล้วใช้ชีวิตหนึ่งชาติในโลกแฟนตาซีที่เวลาเดินเอง ก่อนกลับไปให้ปรโลกตัดสิน · การ์ดสีม่วงคือการ์ดต่างโลก</p>`;

function section(n, body) {
  return `<details id="s${n}"><summary>${ISEKAI_SECTION} <small>${isekaiCardCount()} ใบ</small></summary>${lead()}${body}</details>`;
}
export const isekaiNav = (n) => `<a href="#s${n}">${ISEKAI_SECTION} <small>${isekaiCardCount()}</small></a>`;

// ─── หน้ารวมการ์ด: สิ่งที่จอแสดงเท่านั้น ───
function pickCard(title, body, items) {
  return `<article class="c x"><h4>${esc(title)}</h4>${tagLine(['ก่อนเริ่มชาติ'])}<p>${esc(body)}</p><ul>${items.join('')}</ul></article>`;
}
const raceNames = (ids) => ids.map((r) => CONT_RACES[r].name).join(' · ');
const ruler = (g) => (g.ruler ? `ผู้ปกครอง: ${g.ruler}` : 'ไม่มีผู้ปกครอง');
// แฟ้มเกิดบนจอบอกเผ่า · แคว้น · แนวของแคว้น — หน้ารวมการ์ดบอกเท่านั้นพร้อมเผ่าที่เกิดได้ · น้ำหนักโอกาสเกิดอยู่หน้าเฉลย
const birthPick = (desc) =>
  pickCard('ห้องสีขาว', `เทพธิดายื่นแฟ้มเกิด ${CONT_LIFE.offers} ใบให้เลือก แต่ละใบบอกเผ่ากับแคว้นที่จะไปเกิดในทวีป${CONT_LIFE.name} (${Object.keys(CONT_REGIONS).length} แคว้น · ${Object.keys(CONT_RACES).length} เผ่า)`, Object.entries(CONT_REGIONS).map(([id, g]) => `<li><b>${esc(g.name)}</b> — ${esc(g.about)} · ${esc(ruler(g))} · เผ่าที่เกิดได้: ${esc(raceNames(g.races))}${desc(id, g)}</li>`));
const rolePick = (desc) => pickCard('ห้องสีขาว (ชาติเก่า)', `เทพธิดายื่นบทบาทให้เลือก ${ISEKAI.worlds} จาก ${Object.keys(ISEKAI_ROLES).length} บทบาท`, Object.keys(ISEKAI_ROLES).map((id) => [id, roleInfo(id)]).map(([id, r]) => `<li><b>${esc(r.name)}</b> — ${esc(r.pitch)}${desc(id, r)}</li>`));
const skillPick = (desc) => pickCard('ของขวัญจากเทพธิดา', `เลือกสกิลโกง 1 อย่างจาก ${ISEKAI.skills} อย่างที่สุ่มมา`, Object.entries(ISEKAI_SKILLS).map(([id, s]) => `<li><b>${esc(s.name)}</b> — ${esc(s.desc)}${desc(id, s)}</li>`));

function plainEvent(e) {
  return [`<article class="c x">`, `<h4>${esc(e.title)}</h4>`, tagLine(tags(e)), `<p>${text(e.text)}</p>`, `<ul>${e.choices.map((c) => `<li>${text(c.t)}</li>`).join('')}</ul>`, '</article>'].join('');
}

export function isekaiCatalogHtml(n) {
  const body = [`<h3>ก่อนเริ่มชาติ</h3><div class="grid">${birthPick(() => '')}${skillPick(() => '')}</div>`, groupHtml(groups(false), plainEvent), oldHtml(rolePick(() => ''), plainEvent)].join('');
  return section(n, body);
}

// ─── หน้าเฉลย ───
// ธงต่างโลกเป็นของชาตินั้น ไม่มีชื่อไทยในทะเบียนธง — บอกว่าได้มาจากการ์ดไหนแทน ผู้อ่านกระโดดไปดูทางที่ปูไว้ได้
function flagSources() {
  const src = new Map();
  const add = (f, e) => f && (src.get(f) ?? src.set(f, new Set()).get(f)).add(e.id);
  for (const e of ISEKAI_EVENTS) for (const c of e.choices) for (const o of [c, c.win, c.lose]) if (o) [o.flag, o.flag2].forEach((f) => add(f, e));
  return src;
}
const byId = new Map(ISEKAI_EVENTS.map((e) => [e.id, e]));
const ref = (id) => `<a href="#isk-${esc(id)}">${esc(byId.get(id).title)}</a>`;
const flag = (f) => `<span class="fl" title="${esc(f)}">ธง ${esc(f)}</span>`;

// know = ความรู้หมวดของเรื่องนี้ (ค่าซ่อน · หน้าเฉลยบอกได้)
function fxLine(fx, goalName) {
  const out = Object.entries(fx ?? {}).filter(([, v]) => v).map(([k, v]) => `${k === 'goal' ? goalName : k === 'know' ? 'ความรู้หมวดนี้' : ISEKAI_FX[k] ?? k} ${sgn(v)}`);
  return out.map(esc);
}

// เงื่อนไขของเรื่องความรู้โลกเดิม (B68h) — หน้ารวมการ์ดไม่บอก เพราะจอไม่บอก
const knowTags = (e) => [e.know && `ความรู้${ISEKAI_KNOW[e.know.cat].name}${e.know.min ? ` ถึง ${e.know.min}` : ''}`, e.adult && 'วัยผู้ใหญ่ขึ้นไป', e.loreOf && `ไม่มาในโลกที่จำ${ISEKAI_LORE[e.loreOf]}แล้ว`, e.legend && `มาเฉพาะโลกที่จำคนต่างโลกรุ่นก่อนเป็น${e.legend === 'dark' ? 'คนร้าย' : 'วีรบุรุษ'}`, e.bless && 'มาเฉพาะคนที่กรรมเป็นบวกหรือเทพธิดาอารมณ์ดี', e.trip === 'quest' && 'มาเมื่อตามหาทางกลับบ้านครบปี (เฉพาะคนที่ข้ามมาทั้งตัว)', e.trip === 'event' && 'มาเฉพาะคนที่ข้ามมาทั้งตัว หลังอยู่ครบปีที่บ้านผ่านไป'].filter(Boolean);

function resultLine(kind, o, goalName) {
  const ex = [...fxLine(o.fx, goalName)];
  if (o.lore) ex.push(esc(`โลกจำ${ISEKAI_LORE[o.lore]}ถ้าชื่อเสียงถึง ${ISEKAI_KNOW_T.loreFame}`));
  for (const f of [o.flag, o.flag2]) if (f) ex.push(f === 'won' ? 'ชนะฉากสุดท้าย' : `ติด${flag(f)}`);
  if (o.skill) ex.push('ได้สกิลสุ่ม 1 อย่างที่ยังไม่มี');
  if (o.home) ex.push('กลับบ้าน ชีวิตเดิมเดินต่อ');
  if (o.potion) ex.push(esc(`ดื่มยาต่ออายุทันที อายุขัย +${ISEKAI_POTION.years} ปี (รวมไม่เกิน ${ISEKAI_POTION.cap} ปีต่อชาติ) · ขวดที่ ${ISEKAI_POTION.free + 1} ขึ้นไปลงบาป${meritName('against_nature')}`));
  return `<li><p><b class="rk">${kind}</b> ${text(o.text)}</p>${ex.length ? `<p class="fx">${ex.join(' · ')}</p>` : ''}</li>`;
}

function rollLine(c, src) {
  const out = [c.know ? `ทอยความรู้${ISEKAI_KNOW[c.know].name} (+ความรู้ทั่วไปครึ่งหนึ่ง) ความยาก ${c.dc}` : `ทอย${ISEKAI_STAT[c.stat]} ความยาก ${c.dc}`];
  const skills = Object.values(ISEKAI_SKILLS).filter((s) => s.tag && s.tag === c.tag);
  if (skills.length) out.push(`สกิล${skills.map((s) => `${esc(s.name)} +${s.add ?? 20}%`).join(' หรือ ')}`);
  for (const b of [c.bonus, c.bonus2]) if (b) out.push(`+${b.add}% ถ้ามี${flag(b.flag)}${src.has(b.flag) ? ` (ได้จาก ${[...src.get(b.flag)].map(ref).join(', ')})` : ''}`);
  if (c.stat === 'cha') out.push(esc(`+1% ต่อชื่อเสียงทุก ${ISEKAI_FAME.chaPer} (สูงสุด +${ISEKAI_FAME.chaCap}%) · −${ISEKAI_FAME.dark}% ในโลกที่จำคนร้ายมากกว่าวีรบุรุษ`));
  return out;
}

// ป้ายบุญบาปผูกเจตนาของตัวเลือก ไม่ผูกผลทอย จึงอยู่ระดับตัวเลือกบรรทัดเดียว · ตัวเลือกไม่มีป้าย = ไม่ลงบัญชี
function spoilEvent(e, src, meritTags) {
  const goalName = e.worlds?.length === 1 ? `ความคืบหน้า${roleInfo(e.worlds[0]).goal}` : 'ความคืบหน้าเป้าหมายของโลก';
  const choices = e.choices
    .map((c, i) => {
      const lock = c.need ? `<p class="lock">ต้องมีทอง ${c.need.gold} ถึงกดได้</p>` : '';
      const rolled = c.stat || c.know;
      const res = rolled ? resultLine('สำเร็จ', c.win, goalName) + resultLine('พลาด', c.lose, goalName) : resultLine('ผล', c, goalName);
      const m = meritTags(ISEKAI_MERIT[e.id]?.[i]);
      const merit = m.length ? `<p class="fx">${m.join(' · ')}</p>` : '<p class="nm">ไม่มีบุญบาป ไม่ว่าผลออกทางไหน</p>';
      return `<li><p class="ch">${text(c.t)}</p>${lock}${merit}${rolled ? `<p class="mul">${rollLine(c, src).join(' · ')}</p>` : '<p class="mul">ไม่ต้องทอย ได้ผลนี้ทุกครั้ง</p>'}<ol class="out">${res}</ol></li>`;
    })
    .join('');
  return [`<article class="c x" id="isk-${esc(e.id)}">`, `<h4>${esc(e.title)}</h4>`, tagLine([...tags(e), ...knowTags(e)]), `<p>${text(e.text)}</p>`, `<ol class="chs">${choices}</ol>`, '</article>'].join('');
}

// ตอนจบตามกติกา isekaiEnding ในเอนจิน · เกณฑ์ 50 และข้อยกเว้นของกลืนกินเขียนตามโค้ดนั้น
function endings(id, w) {
  const [sf, key] = w.special;
  const won = `ชนะ${ref(w.finale)}`;
  const rule = {
    best: `${won} และ${esc(w.goal)} ≥ 50`,
    good: `${won} หรือ${esc(w.goal)} ≥ 50 อย่างใดอย่างหนึ่ง`,
    bad: 'ไม่ชนะฉากสุดท้าย และ' + esc(w.goal) + ' ต่ำกว่า 50',
    [key]: sf === 'devour' ? `${won}ด้วยทางที่ติด${flag(sf)}` : `ได้ตอนจบดีที่สุด และมี${flag(sf)}`,
  };
  const order = ['best', key, 'good', 'bad'].filter((k, i, a) => a.indexOf(k) === i);
  return `<ul class="ends">${order.map((k) => `<li class="end"><b>${esc(w.end[k][0])}</b> — ${rule[k]}<br><small>${esc(w.end[k][1])}</small></li>`).join('')}</ul>`;
}

// โอกาสที่บทบาทอยู่ในชุดที่ยื่น ตอนกรรมเป็นกลาง — ไล่ทุกลำดับการจับแบบไม่คืน (11×10×9 ทาง) ตามกติกาใน isekaiRoleOffers
// รวมการแทนใบสุดท้ายด้วยชาวบ้านมีอาชีพเมื่อชุดไม่มี จึงตรงกับเกมไม่ใช่แค่สัดส่วนน้ำหนัก
let offerOdds = null;
function roleOdds() {
  if (offerOdds) return offerOdds;
  const ids = Object.keys(ISEKAI_ROLES);
  const hit = Object.fromEntries(ids.map((id) => [id, 0]));
  const walk = (left, got, p) => {
    if (got.length === ISEKAI.worlds || !left.length) {
      const out = got.includes('commoner') ? got : [...got.slice(0, -1), 'commoner'];
      for (const id of out) hit[id] += p;
      return;
    }
    const sum = left.reduce((s, id) => s + ISEKAI_ROLES[id].p, 0);
    for (const id of left) walk(left.filter((x) => x !== id), [...got, id], (p * ISEKAI_ROLES[id].p) / sum);
  };
  walk(ids, [], 1);
  return (offerOdds = hit);
}
const LEAN = { 1: 'บุญมากเจอบ่อยขึ้น', '-1': 'บาปมากเจอบ่อยขึ้น' };
// บทบาทที่ไม่มีฉากสุดท้ายตัดสินตอนสิ้นอายุจากเป้าหมายกับชื่อเสียง (isekaiEnding)
function roleEndings(w) {
  const rule = { best: `${esc(w.goal)} ≥ 80 หรือ ${esc(w.goal)} ≥ 60 กับชื่อเสียง ≥ 30`, good: `${esc(w.goal)} ≥ 40 หรือชื่อเสียง ≥ 30`, bad: 'ไม่ถึงทั้งสองเกณฑ์' };
  return `<ul class="ends">${['best', 'good', 'bad'].map((k) => `<li class="end"><b>${esc(w.end[k][0])}</b> — ${rule[k]}<br><small>${esc(w.end[k][1])}</small></li>`).join('')}</ul>`;
}
function worldSpoil(id, w) {
  const r = ISEKAI_ROLES[id];
  const pct = Math.round(roleOdds()[id] * 100);
  const facts = [id === 'commoner' ? 'อยู่ในชุดที่ยื่นเสมอ' : `โอกาสถูกยื่น ${pct}% (กรรมกลาง)`, LEAN[r.lean], r.pace > 1 ? `อายุเดิน ×${r.pace}` : null, `เริ่มอายุ ${r.startAge}`, r.finaleAge ? `ฉากสุดท้ายอายุ ${r.finaleAge}` : null, r.like ? `ยืมเหตุการณ์ของ${roleInfo(r.like).name}` : null].filter(Boolean);
  const start = Object.entries(ISEKAI_STAT).map(([k, n]) => `${n} ${w.stat[k]}`).concat(`ทอง ${w.stat.gold}`).join(' · ');
  return `<p class="fx">${esc(facts.join(' · '))}</p><p class="fx">ค่าเริ่ม: ${esc(start)} · เป้าหมาย: ${esc(w.goal)} · ทุ่มเทของบทบาท: ${esc(w.focus.name)}</p><p class="ex">ชื่อที่ได้: ${w.names.map((s) => text(s.replace('{p}', '{ชื่อชาติก่อน}'))).join(' / ')}</p>${w.special ? endings(r.world, w) : roleEndings(w)}`;
}

// โอกาสต่อแฟ้ม = น้ำหนักระดับ ÷ น้ำหนักรวม ตามกติกา contBirth (แฟ้มที่ซ้ำคู่เผ่า+แคว้นถูกสุ่มใหม่ จึงเพี้ยนจากนี้ไม่ถึงจุด)
// เผ่าแบ่งเท่าในแคว้น ⇒ โอกาสเผ่า = ผลรวมของแคว้นที่เผ่านั้นเกิดได้ ÷ จำนวนเผ่าในแคว้น
const TIER_NAME = { very: 'บ่อยมาก', often: 'บ่อย', mid: 'ปานกลาง', few: 'น้อย', rare: 'หายาก' };
const tierSum = () => Object.values(CONT_REGIONS).reduce((s, g) => s + CONT_TIER[g.tier], 0);
const regionOdds = (id) => CONT_TIER[CONT_REGIONS[id].tier] / tierSum();
const raceOdds = (r) => Object.keys(CONT_REGIONS).filter((id) => CONT_REGIONS[id].races.includes(r)).reduce((s, id) => s + regionOdds(id) / CONT_REGIONS[id].races.length, 0);
const birthSpoil = (id, g) => `<p class="fx">โอกาสต่อแฟ้ม <span class="od" data-reg="${esc(id)}">${Math.round(regionOdds(id) * 100)}</span>% (${esc(TIER_NAME[g.tier])})${g.danger ? ' · แคว้นอันตราย ดันเจียนลับลงบ่อยกว่า' : ''}</p>`;

const FILL = (s) => s.replaceAll('{job}', '{อาชีพ}').replaceAll('{land}', '{แคว้น}');
export const contEndTitles = () => Object.values(CONT_END).map(([t]) => FILL(t));
const STAT4 = ['str', 'mag', 'cha', 'luk'];
function contSpoil() {
  const gold = roleInfo(CONT_LIFE.like).stat.gold;
  const oldAt = ISEKAI_STAGES.at(-1).from;
  const races = Object.entries(CONT_RACES).map(([r, x]) => {
    const st = contRaceStart(r);
    const lands = Object.values(CONT_REGIONS).filter((g) => g.races.includes(r)).map((g) => g.name);
    const facts = [`ค่าเริ่ม ${STAT4.map((k) => `${ISEKAI_STAT[k]} ${st[k]}`).join(' · ')} · ทอง ${gold}`, `อายุเดิน ×${x.pace} (วัยชราเริ่มอายุ ${Math.floor(oldAt * x.pace)})`, `โอกาสต่อแฟ้ม ${Math.round(raceOdds(r) * 100)}%`, `เกิดได้ใน ${lands.join(' · ')}`];
    return `<li><b>${esc(x.name)}</b> — ${esc(facts.join(' · '))}</li>`;
  });
  const src = (f) => (f.startsWith('k:') ? `${ISEKAI_KNOW[f.slice(2)].focus.name} (ทางลัดความรู้${ISEKAI_KNOW[f.slice(2)].name})` : ISEKAI_FOCUS[f].name);
  const jobs = Object.values(ISEKAI_CAREERS).map((c) => `<li><b>${esc(c.name)}</b> — ทุ่มเท ${esc(c.from.map(src).join(' หรือ '))} รวมครบ ${ISEKAI_CAREER_T.years} ปี · ต่อปี ${fxLine(c.gain).join(' · ')}</li>`);
  const fame = CONT_LIFE.fame;
  const rule = { best: `ชื่อเสียง ≥ ${fame} และมีอาชีพ`, good: `ชื่อเสียง ≥ ${fame} หรือมีอาชีพ อย่างใดอย่างหนึ่ง (ไม่มีอาชีพ {อาชีพ} = คนดัง)`, bad: 'ไม่ถึงทั้งสองข้อ' };
  const ends = Object.entries(CONT_END).map(([k, [t, s]]) => `<li class="end"><b>${esc(FILL(t))}</b> — ${esc(rule[k])}<br><small>${esc(FILL(s))}</small></li>`);
  return `<h3>เผ่า <small>${races.length} เผ่า</small></h3><ul class="rules">${races.join('')}</ul><h3>อาชีพ <small>${jobs.length} อาชีพ</small></h3><ul class="rules">${jobs.join('')}</ul><h3>ตอนจบชาติทวีป</h3><p class="ex">{อาชีพ} = อาชีพแรกที่ได้ · {แคว้น} = แคว้นที่เกิด</p><ul class="ends">${ends.join('')}</ul>`;
}

// การ์ดที่ให้สกิลสุ่มไม่สุ่มโชคเทพธิดา (chooseIsekai) — สกิลอื่นได้ระหว่างทางด้วย
const skillSpoil = (id) => (id === 'luck' ? '<p class="ex">ได้ตอนเลือกที่ห้องสีขาวเท่านั้น</p>' : '<p class="ex">ได้ระหว่างทางด้วย ถ้าการ์ดให้สกิลสุ่ม</p>');

// โอกาสเทพธิดาโผล่ตามกรรมสุทธิ (isekaiCalled) · คำสัญญาตัดสินด้วยป้ายบุญบาปของตัวเลือกที่กด (vowTrack/vowSettle)
const pct = (p) => `${Math.round(p * 100)}%`;
const vowRule = (v) =>`"${esc(v.text.replace(/^สัญญากันข้อเดียวนะ /, ''))}" ${v.breaks ? `ผิดทันทีที่กดตัวเลือกที่มีบาป${esc(meritName(v.breaks))}` : `ต้องกดตัวเลือกที่มีบุญ${esc(meritName(v.needs))}อย่างน้อยครั้งหนึ่งก่อนจบรอบ`}`;
function rules(meritTags) {
  const k = ISEKAI;
  const at = (lv) => pct(Math.max(GODDESS.chanceMin, k.chance * (1 + lv)));
  const keep = meritTags([{ cat: 'keep_goddess_vow', level: GODDESS.vowLevel }]).join('');
  const broke = meritTags([{ cat: 'vow_broken' }]).join('');
  const t = ISEKAI_TIME;
  return `<ul class="rules">${[
    `ชาติใหม่เกิดในทวีป${esc(CONT_LIFE.name)}: เทพธิดายื่นแฟ้มเกิด ${CONT_LIFE.offers} ใบ (เผ่า + แคว้น ไม่ซ้ำคู่กัน) สุ่มตามระดับโอกาสเกิดของแคว้น กรรมไม่ทำให้แฟ้มเอียง · ไม่มีเป้าหมาย ฉากเปิด หรือฉากสุดท้าย · คนที่ข้ามมาทั้งตัวเป็น${esc(CONT_RACES[CONT_LIFE.tripRace].name)} ลงแคว้นสุ่มที่${esc(CONT_RACES[CONT_LIFE.tripRace].name)}เกิดได้`,
    `เผ่าแก่ไม่เท่ากัน: อายุเริ่มช่วงวัย วัยชรา และปีที่นับเป็นอาชีพ คูณด้วยตัวคูณอายุของเผ่า · ทุ่มเทสายต้นทางของอาชีพรวมครบ ${ISEKAI_CAREER_T.years} ปี ได้อาชีพนั้นติดตัวทั้งชาติ ได้หลายอาชีพพร้อมกันได้`,
    `ทุกชาติทวีปสุ่มขั้วอำนาจ (มหาอำนาจ 1 · ขาลง 1–2 · มาแรง 1–2 จากแคว้นที่มีผู้ปกครอง) · ข้อพิพาทใหญ่ 1 จาก ${Object.keys(CONT_DISPUTES).length} เรื่อง · ดันเจียนลับ 3–4 จุด — ยังไม่มีการ์ดที่ใช้ จึงยังไม่มีผลกับชาตินั้น`,
    `ทางเกิดที่ 3 เปิดทุกชาติ · เทพธิดาอารมณ์ดีมายืนรอข้างทาง โอกาสตามกรรมจากปรโลก: บุญเต็ม ${at(1)} · กลาง ${at(0)} · บาปเต็ม ${at(-1)} (ไม่ต่ำกว่า ${pct(GODDESS.chanceMin)}) = ได้แฟ้มเกิดเพิ่ม 1 และสกิลเพิ่ม 1 (เฉพาะรอบแรกที่ไป) และฝากคำสัญญา 1 ข้อ`,
    `ชีวิตที่รับการ์ดชวนข้ามโลกระหว่างมีชีวิต (ตายหรือหายตัว) เจอเทพธิดาแน่นอน และได้โชคเพิ่ม ${GODDESS.fatedLuck}`,
    `คำสัญญา (ชีวิตละข้อเดียว เทพธิดาเลือกให้):${GODDESS_VOWS.map(vowRule).join(' · ')} — รักษาได้ ${keep} · ผิด ${broke} (เฉลยที่ปรโลก)`,
    `อยู่ต่างโลกต่อติดกันได้ ${k.stay} รอบ แล้วต้องกลับโลกเดิมตามกรรม`,
    `กรรมจากปรโลก (−1 ถึง 1): ค่าเริ่มทุกตัวขยับ กรรม × ${k.karmaStat} (ปัดเศษ) · กรรม ≥ ${k.karmaSkill} ได้สกิลให้เลือกเพิ่ม 1 · ≤ −${k.karmaSkill} ลดลง 1 · บาปทำให้ทุกด่านยากขึ้นสูงสุด ${k.karmaDc}`,
    'โอกาสสำเร็จ = 50 + (ค่าที่ทอย − ความยาก) × 4 + สกิลตรงสาย + ธงที่ปูไว้ แล้วตัดให้อยู่ระหว่าง 5% ถึง 95%',
    `เวลาเดินเองตาละ ${t.step} ปี (วัยชราตาละ ${t.oldStep} ปี) · ทุกตามีโอกาส ${Math.round(t.eventP * 100)}% ที่จะมีเหตุการณ์ให้ตัดสิน เรื่องสายเดียวกับที่ทุ่มเทอยู่โผล่บ่อยกว่า 3 เท่า · ชาติเก่า: ฉากเปิดมาก่อนตาแรก ฉากสุดท้ายมาเมื่อถึงอายุของบทบาท`,
    `วัยชราเริ่มอายุ ${ISEKAI_STAGES.at(-1).from} · หลังจากนั้นร่างกายเสื่อมทุกปีแรงขึ้นเรื่อย ๆ จนสิ้นอายุ ความสุขดีทำให้แก่ช้า`,
    `ชีวิต (HP) หมด = ${esc(ISEKAI_DEATH[0])} (เว้นมีสกิล${esc(ISEKAI_SKILLS.rbd.name)} ฟื้นได้ครั้งเดียว) · ค่าสถานะที่สูงสุดตอนจบติดตัวไปชาติต่างโลกถัดไป +${k.memory}`,
  ].map((s) => `<li>${s}</li>`).join('')}</ul>`;
}

// meritTags = ตัววาดป้ายบุญบาปของหน้าเฉลยไทย — ส่งเข้ามาแทน import กลับ เพื่อให้ป้ายสองโลกหน้าตา/แต้มเดียวกัน
export function isekaiSpoilersHtml(n, meritTags) {
  const src = flagSources();
  const body = [
    rules(meritTags),
    `<h3>ก่อนเริ่มชาติ</h3><div class="grid">${birthPick(birthSpoil)}${skillPick(skillSpoil)}</div>`,
    contSpoil(),
    groupHtml(groups(false), (e) => spoilEvent(e, src, meritTags)),
    `<p class="ex">ตอนจบแบบตาย: <b>${esc(ISEKAI_DEATH[0])}</b> — ${esc(ISEKAI_DEATH[1])}</p>`,
    oldHtml(rolePick(worldSpoil), (e) => spoilEvent(e, src, meritTags)),
  ].join('');
  return section(n, body);
}
