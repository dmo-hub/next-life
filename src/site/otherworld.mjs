// ส่วนต่างโลกของหน้ารวมการ์ดและหน้าเฉลย (B88b): สร้างจากโมดูลต่างโลกในเอนจินทุกครั้งที่ build — การ์ดต่างโลกใบใหม่ขึ้นหน้าเว็บเอง
// หน้ารวมการ์ดได้แค่สิ่งที่จอแสดง (ชื่อโลก/สกิลพร้อมคำอธิบาย · ข้อความเหตุการณ์ · ตัวเลือก) · หน้าเฉลยได้ความยาก ผลสำเร็จ/พลาด ค่าที่ขยับ ธง และตอนจบ
import { ISEKAI, ISEKAI_TIME, ISEKAI_STAGES, ISEKAI_STAT, ISEKAI_FX, ISEKAI_SKILLS, ISEKAI_WORLDS, ISEKAI_DEATH, ISEKAI_EVENTS, ISEKAI_MERIT, GODDESS, GODDESS_VOWS, PATHS, meritName } from '../engine/index.mjs';
import { esc, text } from './catalog.mjs';

export const ISEKAI_SECTION = 'ต่างโลก';
const CHAPTERS = 4;
const sgn = (n) => (n > 0 ? `+${n}` : String(n).replace('-', '−'));
const worldName = (id) => ISEKAI_WORLDS[id].name;
const chLabel = (ch) => `บทที่ ${ch.length > 1 ? `${ch[0]}–${ch[ch.length - 1]}` : ch[0]}`;
const where = (e) => (e.worlds ? e.worlds.map(worldName).join(' · ') : 'ทุกโลก');
// ฉากเปิดและฉากสุดท้ายของแต่ละโลกอยู่ต้นและท้ายเสมอ (isekaiQueue) — จัดไว้หัวกลุ่มบทของมันให้อ่านตามลำดับเล่น
const groups = () =>
  Array.from({ length: CHAPTERS }, (_, i) => i + 1).map((c) => ({
    ch: c,
    events: ISEKAI_EVENTS.filter((e) => e.ch[0] === c).sort((a, b) => Number(!!b.finale) - Number(!!a.finale) || Number(isIntro(b)) - Number(isIntro(a))),
  }));
const isIntro = (e) => Object.values(ISEKAI_WORLDS).some((w) => w.intro === e.id);
const tags = (e) => [where(e), chLabel(e.ch), isIntro(e) ? 'ฉากเปิด' : null, e.finale ? 'ฉากสุดท้าย' : null].filter(Boolean);
const tagLine = (xs) => `<p class="tags">${xs.map((t) => `<span>${esc(t)}</span>`).join('')}</p>`;
export const isekaiCardCount = () => ISEKAI_EVENTS.length + 2;

// catalog.mjs กับไฟล์นี้ import กันไปมา — ห้ามเรียก esc/text ตอนโหลดโมดูล ต้องเรียกตอนสร้างหน้า
const lead = () => `<p class="lead">เลือก "${esc(PATHS.find((p) => p.id === 'isekai').text)}" ที่ปรโลก แล้วใช้ชีวิตหนึ่งชาติในโลกแฟนตาซี ${CHAPTERS} บท ก่อนกลับไปให้ปรโลกตัดสิน · การ์ดสีม่วงคือการ์ดต่างโลก</p>`;

function section(n, body) {
  return `<details id="s${n}"><summary>${ISEKAI_SECTION} <small>${isekaiCardCount()} ใบ</small></summary>${lead()}${body}</details>`;
}
export const isekaiNav = (n) => `<a href="#s${n}">${ISEKAI_SECTION} <small>${isekaiCardCount()}</small></a>`;

// ─── หน้ารวมการ์ด: สิ่งที่จอแสดงเท่านั้น ───
function pickCard(title, body, items) {
  return `<article class="c x"><h4>${esc(title)}</h4>${tagLine(['ก่อนเริ่มชาติ'])}<p>${esc(body)}</p><ul>${items.join('')}</ul></article>`;
}
const worldPick = (desc) => pickCard('ห้องสีขาว', `เทพธิดาเสนอโลกให้เลือก ${ISEKAI.worlds} จาก ${Object.keys(ISEKAI_WORLDS).length} โลก`, Object.entries(ISEKAI_WORLDS).map(([id, w]) => `<li><b>${esc(w.name)}</b> — ${esc(w.pitch)}${desc(id, w)}</li>`));
const skillPick = (desc) => pickCard('ของขวัญจากเทพธิดา', `เลือกสกิลโกง 1 อย่างจาก ${ISEKAI.skills} อย่างที่สุ่มมา`, Object.entries(ISEKAI_SKILLS).map(([id, s]) => `<li><b>${esc(s.name)}</b> — ${esc(s.desc)}${desc(id, s)}</li>`));

function plainEvent(e) {
  return [`<article class="c x">`, `<h4>${esc(e.title)}</h4>`, tagLine(tags(e)), `<p>${text(e.text)}</p>`, `<ul>${e.choices.map((c) => `<li>${text(c.t)}</li>`).join('')}</ul>`, '</article>'].join('');
}

export function isekaiCatalogHtml(n) {
  const body = [
    `<h3>ก่อนเริ่มชาติ</h3><div class="grid">${worldPick(() => '')}${skillPick(() => '')}</div>`,
    ...groups().map((g) => `<h3>บทที่ ${g.ch} <small>${g.events.length} ใบ</small></h3><div class="grid">${g.events.map(plainEvent).join('')}</div>`),
  ].join('');
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

function fxLine(fx, goalName) {
  const out = Object.entries(fx ?? {}).filter(([, v]) => v).map(([k, v]) => `${k === 'goal' ? goalName : ISEKAI_FX[k] ?? k} ${sgn(v)}`);
  return out.map(esc);
}

function resultLine(kind, o, goalName) {
  const ex = [...fxLine(o.fx, goalName)];
  for (const f of [o.flag, o.flag2]) if (f) ex.push(f === 'won' ? 'ชนะฉากสุดท้าย' : `ติด${flag(f)}`);
  if (o.skill) ex.push('ได้สกิลสุ่ม 1 อย่างที่ยังไม่มี');
  return `<li><p><b class="rk">${kind}</b> ${text(o.text)}</p>${ex.length ? `<p class="fx">${ex.join(' · ')}</p>` : ''}</li>`;
}

function rollLine(c, src) {
  const out = [`ทอย${ISEKAI_STAT[c.stat]} ความยาก ${c.dc}`];
  const skills = Object.values(ISEKAI_SKILLS).filter((s) => s.tag && s.tag === c.tag);
  if (skills.length) out.push(`สกิล${skills.map((s) => `${esc(s.name)} +${s.add ?? 20}%`).join(' หรือ ')}`);
  for (const b of [c.bonus, c.bonus2]) if (b) out.push(`+${b.add}% ถ้ามี${flag(b.flag)}${src.has(b.flag) ? ` (ได้จาก ${[...src.get(b.flag)].map(ref).join(', ')})` : ''}`);
  return out;
}

// ป้ายบุญบาปผูกเจตนาของตัวเลือก ไม่ผูกผลทอย จึงอยู่ระดับตัวเลือกบรรทัดเดียว · ตัวเลือกไม่มีป้าย = ไม่ลงบัญชี
function spoilEvent(e, src, meritTags) {
  const goalName = e.worlds?.length === 1 ? `ความคืบหน้า${ISEKAI_WORLDS[e.worlds[0]].goal}` : 'ความคืบหน้าเป้าหมายของโลก';
  const choices = e.choices
    .map((c, i) => {
      const lock = c.need ? `<p class="lock">ต้องมีทอง ${c.need.gold} ถึงกดได้</p>` : '';
      const res = c.stat ? resultLine('สำเร็จ', c.win, goalName) + resultLine('พลาด', c.lose, goalName) : resultLine('ผล', c, goalName);
      const m = meritTags(ISEKAI_MERIT[e.id]?.[i]);
      const merit = m.length ? `<p class="fx">${m.join(' · ')}</p>` : '<p class="nm">ไม่มีบุญบาป ไม่ว่าผลออกทางไหน</p>';
      return `<li><p class="ch">${text(c.t)}</p>${lock}${merit}${c.stat ? `<p class="mul">${rollLine(c, src).join(' · ')}</p>` : '<p class="mul">ไม่ต้องทอย ได้ผลนี้ทุกครั้ง</p>'}<ol class="out">${res}</ol></li>`;
    })
    .join('');
  return [`<article class="c x" id="isk-${esc(e.id)}">`, `<h4>${esc(e.title)}</h4>`, tagLine(tags(e)), `<p>${text(e.text)}</p>`, `<ol class="chs">${choices}</ol>`, '</article>'].join('');
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

function worldSpoil(id, w) {
  const start = Object.entries(ISEKAI_STAT).map(([k, n]) => `${n} ${w.start[k]}`).concat(`ทอง ${w.start.gold}`).join(' · ');
  return `<p class="fx">ค่าเริ่ม: ${esc(start)} · เป้าหมาย: ${esc(w.goal)}</p><p class="ex">ชื่อที่ได้: ${w.names.map((s) => text(s.replace('{p}', '{ชื่อชาติก่อน}'))).join(' / ')}</p>${endings(id, w)}`;
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
    `ทางเกิดที่ 3 เปิดทุกชาติ · เทพธิดาอารมณ์ดีมายืนรอข้างทาง โอกาสตามกรรมจากปรโลก: บุญเต็ม ${at(1)} · กลาง ${at(0)} · บาปเต็ม ${at(-1)} (ไม่ต่ำกว่า ${pct(GODDESS.chanceMin)}) = ได้เลือกโลกเพิ่ม 1 และสกิลเพิ่ม 1 (เฉพาะรอบแรกที่ไป) และฝากคำสัญญา 1 ข้อ`,
    `ชีวิตที่รับการ์ดชวนข้ามโลกระหว่างมีชีวิต (ตายหรือหายตัว) เจอเทพธิดาแน่นอน และได้โชคเพิ่ม ${GODDESS.fatedLuck}`,
    `คำสัญญา (ชีวิตละข้อเดียว เทพธิดาเลือกให้):${GODDESS_VOWS.map(vowRule).join(' · ')} — รักษาได้ ${keep} · ผิด ${broke} (เฉลยที่ปรโลก)`,
    `อยู่ต่างโลกต่อติดกันได้ ${k.stay} รอบ แล้วต้องกลับโลกเดิมตามกรรม`,
    `กรรมจากปรโลก (−1 ถึง 1): ค่าเริ่มทุกตัวขยับ กรรม × ${k.karmaStat} (ปัดเศษ) · กรรม ≥ ${k.karmaSkill} ได้สกิลให้เลือกเพิ่ม 1 · ≤ −${k.karmaSkill} ลดลง 1 · บาปทำให้ทุกด่านยากขึ้นสูงสุด ${k.karmaDc}`,
    'โอกาสสำเร็จ = 50 + (ค่าที่ทอย − ความยาก) × 4 + สกิลตรงสาย + ธงที่ปูไว้ แล้วตัดให้อยู่ระหว่าง 5% ถึง 95%',
    `เวลาเดินเองตาละ ${t.step} ปี (วัยชราตาละ ${t.oldStep} ปี) · ทุกตามีโอกาส ${Math.round(t.eventP * 100)}% ที่จะมีเหตุการณ์ให้ตัดสิน เรื่องสายเดียวกับที่ทุ่มเทอยู่โผล่บ่อยกว่า 3 เท่า · ฉากเปิดมาก่อนตาแรก ฉากสุดท้ายมาเมื่อถึงอายุของบทบาท`,
    `วัยชราเริ่มอายุ ${ISEKAI_STAGES.at(-1).from} · หลังจากนั้นร่างกายเสื่อมทุกปีแรงขึ้นเรื่อย ๆ จนสิ้นอายุ ความสุขดีทำให้แก่ช้า`,
    `HP หมด = ${esc(ISEKAI_DEATH[0])} (เว้นมีสกิล${esc(ISEKAI_SKILLS.rbd.name)} ฟื้นได้ครั้งเดียว) · ค่าสถานะที่สูงสุดตอนจบติดตัวไปชาติต่างโลกถัดไป +${k.memory}`,
  ].map((s) => `<li>${s}</li>`).join('')}</ul>`;
}

// meritTags = ตัววาดป้ายบุญบาปของหน้าเฉลยไทย — ส่งเข้ามาแทน import กลับ เพื่อให้ป้ายสองโลกหน้าตา/แต้มเดียวกัน
export function isekaiSpoilersHtml(n, meritTags) {
  const src = flagSources();
  const body = [
    rules(meritTags),
    `<h3>ก่อนเริ่มชาติ</h3><div class="grid">${worldPick(worldSpoil)}${skillPick(skillSpoil)}</div>`,
    ...groups().map((g) => `<h3>บทที่ ${g.ch} <small>${g.events.length} ใบ</small></h3><div class="grid">${g.events.map((e) => spoilEvent(e, src, meritTags)).join('')}</div>`),
    `<p class="ex">ตอนจบแบบตาย: <b>${esc(ISEKAI_DEATH[0])}</b> — ${esc(ISEKAI_DEATH[1])}</p>`,
  ].join('');
  return section(n, body);
}
