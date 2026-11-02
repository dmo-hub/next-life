// หน้าโฟกัสชีวิต: รายการโฟกัส ช่วงวัย เงื่อนไข และป้ายบนปุ่มอ่านจากชุดเดียวกับที่เกมใช้ — โฟกัสเพิ่ม/เปลี่ยน หน้านี้เปลี่ยนตามตอน build
// ระดับคู่มือ ไม่ใช่เฉลย: ผลบอกเป็นคำเดียวกับป้ายบนปุ่มในเกม ไม่มีขนาดผล โอกาสเสี่ยง น้ำหนักการ์ด หรือบุญบาป
import { STAGES, STAT_LABELS, focusWords, FOCUS_FLOW_NAME, ISEKAI_FOCUS, ISEKAI_STAGES, ISEKAI_KNOW, ISEKAI_CAREERS, ISEKAI_CAREER_T, ISEKAI_ROLES, CONT_MOVE, TRIP_QUEST, roleInfo, isekaiFocusFx } from '../engine/index.mjs';
import { esc, CATEGORY } from './catalog.mjs';

// หมวดโฟกัสโลกนี้ (group ใน content/rules/focus.yaml) — หมวดใหม่ที่ไม่มีชื่อที่นี่ build หยุด
export const FOCUS_GROUPS = { work: 'งานและเงิน', people: 'คนและครอบครัว', body: 'กายและใจ', gate: 'ประตูเข้าสาย' };
// need = สถานะที่ต้องมีก่อนโฟกัสโผล่ (FOCUS_NEEDS ในแกน) เป็นภาษาคน — site-check เทียบ key กับแกน
export const NEED_TEXT = {
  working: 'มีงานทำ',
  single: 'ยังไม่มีคู่ และไม่อยู่ในช่วงไว้ทุกข์คู่',
  partnered_or_kids: 'มีคู่หรือมีลูก',
  has_kids: 'มีลูก',
  kids_or_grandkids: 'มีลูกหรือหลาน',
  old_parent: 'พ่อหรือแม่อายุ 60 ขึ้นไปยังอยู่',
  savings_or_credit: 'มีเงินเก็บหรือมีงานทำ',
};
// when ของโฟกัสใช้ได้แค่ key ที่เขียนคำไว้ที่นี่ — key ใหม่ build หยุดแทนการตัดเงื่อนไขทิ้งเงียบ
const WHEN_TEXT = {
  school: (v) => (v.includes('primary') ? 'ยังเรียนอยู่' : 'เรียนตั้งแต่มัธยมขึ้นไป'),
  age: ([lo]) => `อายุ ${lo} ปีขึ้นไป`,
};
const whenText = (w = {}) => Object.entries(w).map(([k, v]) => {
  if (!WHEN_TEXT[k]) throw new Error(`หน้าโฟกัสยังไม่รู้จักเงื่อนไข when.${k} — เติมคำใน WHEN_TEXT (src/site/focus.mjs)`);
  return WHEN_TEXT[k](v);
});

const stageOrder = (names) => STAGES.filter((s) => names.includes(s.name)).map((s) => s.name);
const span = (names) => (names.length === STAGES.length ? 'ทุกช่วงวัย' : names.join(' · '));
const iskSpan = (ids) => (!ids ? 'ทุกช่วงวัย' : ISEKAI_STAGES.filter((s) => ids.includes(s.id)).map((s) => s.name).join(' · '));
const fxCell = (s) => (s ? `<span class="fx">${esc(s)}</span>` : '<small>ไม่มีป้าย</small>');
// จอแคบตารางกลายเป็นการ์ดเรียงลง — ทุกช่องพกชื่อหัวคอลัมน์ไว้ใน data-k ให้ CSS ขึ้นนำหน้า
const table = (head, rows) => {
  const cells = rows.map((r) => {
    let i = 0;
    return r.replace(/<td>/g, () => `<td data-k="${head[i++]}">`);
  });
  return `<div class="tw"><table class="ft"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${cells.join('')}</tbody></table></div>`;
};

function thaiRows(defs, ids, chain) {
  return ids.map((id) => {
    const d = defs[id];
    const cond = [...(d.after ? [`ทุ่มเท${defs[d.after].name}ครบ ${chain} ปีเต็มแล้ว โผล่ตั้งแต่ช่วงวัยถัดไป`] : []), ...whenText(d.when), ...(d.need ?? []).map((k) => {
      if (!NEED_TEXT[k]) throw new Error(`หน้าโฟกัสยังไม่รู้จักเงื่อนไข need.${k} — เติมคำใน NEED_TEXT (src/site/focus.mjs)`);
      return NEED_TEXT[k];
    })];
    const cards = [...new Set(d.cards.map((t) => CATEGORY[t] ?? t))].join(' · ');
    return `<tr id="f-${esc(id)}"><td><b>${esc(d.name)}</b></td><td>${esc(span(stageOrder(d.stages ?? STAGES.map((s) => s.name))))}</td><td>${cond.length ? esc(cond.join(' · ')) : '<small>—</small>'}</td><td>${fxCell(focusWords(d, STAT_LABELS))}</td><td>${esc(cards)}</td></tr>`;
  });
}

function thaiHtml(c) {
  const defs = c.focuses;
  const ids = Object.keys(defs);
  for (const id of ids) if (!FOCUS_GROUPS[defs[id].group]) throw new Error(`หน้าโฟกัสยังไม่รู้จักหมวด ${defs[id].group} (${id}) — เติมชื่อใน FOCUS_GROUPS`);
  const head = ['โฟกัส', 'เลือกได้ช่วง', 'ต้องมีก่อน', 'ป้ายบนปุ่ม', 'การ์ดที่ออกบ่อยขึ้น'];
  const groups = Object.entries(FOCUS_GROUPS).map(([g, name]) => {
    const mine = ids.filter((id) => defs[id].group === g);
    return mine.length ? `<h3 id="g-${g}">${esc(name)} <small>${mine.length} โฟกัส</small></h3>${table(head, thaiRows(defs, mine, c.chain_years))}` : '';
  }).join('');
  const chains = ids.filter((id) => defs[id].after).map((id) => `<li>${esc(defs[defs[id].after].name)} → <b>${esc(defs[id].name)}</b></li>`).join('');
  const gates = ids.filter((id) => defs[id].group === 'gate').map((id) => esc(defs[id].name)).join(' · ');
  const kids = [...new Set(ids.map((id) => defs[id].kid).filter(Boolean))].map((k) => `<li>${ids.filter((id) => defs[id].kid === k).map((id) => esc(defs[id].name)).join(' · ')} → <b>${esc(defs[k].name)}</b></li>`).join('');
  return `<section id="thai"><h2>โลกนี้ <small>${ids.length} โฟกัส</small></h2>
<p>ปุ่มโฟกัสอยู่ใต้ค่าสถานะบนการ์ด กดแล้วกางรายการที่เลือกได้ตอนนี้ เลือกได้ทุกเมื่อโดยไม่ต้องรอการ์ด และตอบการ์ดไปพร้อมกันได้ · ตัวแรกในรายการคือ <b>${esc(FOCUS_FLOW_NAME)}</b></p>
<p>ตารางนี้มีทุกโฟกัสในเกม ตอนเล่นจะเห็นเฉพาะตัวที่ช่วงวัยและเงื่อนไขตรงในปีนั้น</p>
${groups}
<h3 id="chain">ปลายสาย</h3>
<p>บางโฟกัสซ่อนอยู่จนกว่าจะทุ่มเทกับตัวต้นสายครบ ${c.chain_years} ปีเต็ม แล้วจึงโผล่ตั้งแต่ช่วงวัยถัดไป ไม่ใช่ช่วงวัยที่เพิ่งครบ</p><ul>${chains}</ul>
<h3 id="gate">ประตูเข้าสาย</h3>
<p>โฟกัสหมวดประตู (${gates}) ทุ่มเทครบ ${c.chain_years} ปีเต็มแล้วจึงเปิดตัวเลือกของสายนั้นบนการ์ด เช่น เปิดกิจการ หรือลงสมัคร · ก่อนนั้นตัวเลือกพวกนี้ไม่ขึ้นบนการ์ด การ์ดยังออกด้วยตัวเลือกที่เหลือ · บางการ์ดชวนเข้าสายเองได้โดยไม่ต้องทุ่มเท</p>
<h3 id="risk">โฟกัสที่มีเสี่ยง</h3>
<p>ป้าย <span class="fx">มีเสี่ยง</span> บนปุ่มบอกว่าปีที่ทุ่มเทเรื่องนี้อาจมีเรื่องร้ายตามมา ไม่บอกว่าเรื่องอะไรหรือบ่อยแค่ไหน · เสี่ยงบางอย่างถึงตาย แต่ครั้งแรกจะมาเป็นการ์ดเตือนก่อนเสมอ ไม่มีใครตายจากโฟกัสโดยไม่เคยเห็นสัญญาณ</p>
<h3 id="heir">ทายาทในตระกูล</h3>
<p>ไปเกิดเป็นลูกหลานในตระกูลเดิม ชีวิตใหม่เริ่มด้วยโฟกัสวัยเด็กตามโฟกัสหลักของรุ่นก่อน (ตัวที่ทุ่มเทครบปีมากที่สุด) และรับประตูเข้าสายที่รุ่นก่อนเปิดไว้ · ถ้าโฟกัสวัยเด็กนั้นยังเลือกไม่ได้ เช่นยังไม่เข้าเรียน เกมรอจนเปิดได้ · เปลี่ยนเองได้ทันทีเหมือนโฟกัสอื่น · เกิดที่อื่นหรือรุ่นก่อนไม่เคยทุ่มเทอะไร เริ่มแบบตามน้ำ</p>
<p>โฟกัสหลักของรุ่นก่อน → โฟกัสที่ทายาทเริ่ม · ตัวที่ไม่อยู่ในรายการ ทายาทเริ่มแบบตามน้ำ</p>
<ul>${kids}</ul></section>`;
}

const iskName = (id) => (id.startsWith('k:') ? ISEKAI_KNOW[id.slice(2)].focus.name : ISEKAI_FOCUS[id].name);

function isekaiHtml() {
  const head = ['ทุ่มเท', 'เลือกได้ช่วง', 'ป้ายบนปุ่ม'];
  const base = Object.entries(ISEKAI_FOCUS).map(([id, f]) => `<tr id="i-${esc(id)}"><td><b>${esc(f.name)}</b></td><td>${esc(iskSpan(f.stages))}</td><td>${fxCell(isekaiFocusFx({}, id))}</td></tr>`);
  const know = Object.entries(ISEKAI_KNOW).map(([k, x]) => `<tr><td><b>${esc(x.focus.name)}</b></td><td>${esc(x.name)}</td><td>${esc(iskSpan(x.stages))}</td><td>${fxCell(isekaiFocusFx({}, `k:${k}`))}</td></tr>`);
  const careers = Object.values(ISEKAI_CAREERS).map((c) => `<li><b>${esc(c.name)}</b> ← ${c.from.map((id) => esc(iskName(id))).join(' หรือ ')}</li>`).join('');
  const roles = Object.keys(ISEKAI_ROLES).map(roleInfo).filter((r) => r.focus).map((r) => `<li>${esc(r.name)}: <b>${esc(r.focus.name)}</b></li>`).join('');
  return `<section id="isekai"><h2>ต่างโลก <small>${Object.keys(ISEKAI_FOCUS).length} ทุ่มเท + ทางลัด ${Object.keys(ISEKAI_KNOW).length}</small></h2>
<p>ชาติต่างโลกเวลาเดินเอง ต้นทุกช่วงวัยมีใบ <b>เลือกสิ่งที่ทุ่มเท</b> ให้เลือกหนึ่งอย่าง ใบนี้ไม่มีตัวเลือกตามน้ำ · ระหว่างช่วงวัย แถบโฟกัสบนใบจดหมายเหตุกดเปลี่ยนได้โดยเวลาไม่หยุด</p>
<p>เรื่องที่ทุ่มเทค้างข้ามปีจนกว่าจะเปลี่ยน แต่ละปีได้ค่าตามป้ายบนปุ่ม และเหตุการณ์สายเดียวกันโผล่บ่อยขึ้น · ป้ายบอกเฉพาะค่าบนจอที่ขึ้น บางเรื่องจึงไม่มีป้าย แต่ยังมีผล</p>
${table(head, base)}
<h3 id="i-near">ใกล้ตาย</h3>
<p>ชีวิตตกถึงขีดใกล้ตาย การ์ด "ใกล้ตาย" ให้เลือก "เปลี่ยนโฟกัส" ซึ่งเปิดใบทุ่มเทกลางช่วงวัยและติดป้ายแนะนำที่ <b>${esc(ISEKAI_FOCUS.rest.name)}</b></p>
<h3 id="i-move">ย้ายแคว้น</h3>
<p>ทุ่มเท <b>${esc(ISEKAI_FOCUS[CONT_MOVE.focus].name)}</b> ครบ ${CONT_MOVE.years} ปีเต็มนับจากเกิดหรือย้ายครั้งก่อน ได้การ์ดทางแยกให้ย้ายไปแคว้นที่มีถนนติดกัน หรืออยู่ที่เดิมแล้วเริ่มนับใหม่</p>
<h3 id="i-career">อาชีพจากสิ่งที่ทุ่มเท</h3>
<p>ทุ่มเทเรื่องต้นทางรวมกันครบ ${ISEKAI_CAREER_T.years} ปีเต็มได้อาชีพนั้นติดตัวทั้งชาติ มีหลายอาชีพพร้อมกันได้ และผลของอาชีพซ้อนกับเรื่องที่ทุ่มเทอยู่</p><ul>${careers}</ul>
<h3 id="i-know">ทางลัดจากความรู้โลกเดิม</h3>
<p>คนที่ข้ามมาจากโลกนี้จำเรื่องจากบ้านเกิดได้ ความรู้หมวดไหนสะสมมากพอ (จากเหตุการณ์ของหมวดนั้นและการ${esc(ISEKAI_FOCUS.study.name)}) ทางลัดของหมวดนั้นต่อท้ายรายการทุ่มเท · ทุ่มเททางลัดแล้วเหตุการณ์หมวดนั้นโผล่บ่อยขึ้น</p>
${table(['ทางลัด', 'หมวดความรู้', 'เลือกได้ช่วง', 'ป้ายบนปุ่ม'], know)}
<h3 id="i-home">หายตัวข้ามไปทั้งตัว</h3>
<p>ชาติที่หลุดไปต่างโลกทั้งตัว (ไม่ได้ตายก่อน) มี <b>${esc(TRIP_QUEST.focus.name)}</b> ต่อท้ายรายการทุกช่วงวัย ป้ายบนปุ่ม <span class="fx">${esc(isekaiFocusFx({}, TRIP_QUEST.id))}</span> · ปีที่ใช้ตามหาคือปีที่ไม่ได้ฝึกอย่างอื่น</p>
<details class="old"><summary>ชาติเก่า (เซฟก่อนมีทวีป)</summary><p>ชาติที่เริ่มก่อนมีทวีปมีเรื่องทุ่มเทของบทบาทเป็นตัวแรกในรายการเพิ่มอีกหนึ่งตัว ชาติใหม่ไม่มีรายการนี้</p><ul>${roles}</ul></details></section>`;
}

export function focusHtml(content) {
  const c = content.focus;
  // ตัวอย่างป้ายหยิบจากโฟกัสจริงตัวแรกที่มีทั้งขึ้นมากและลด — ป้ายในเกมเปลี่ยนคำ ตัวอย่างเปลี่ยนตาม
  const ex = Object.values(c.focuses).map((d) => focusWords(d, STAT_LABELS)).find((w) => w.includes('ขึ้นมาก') && w.includes('ลด') && !w.includes('มีเสี่ยง'));
  return `
<nav class="toc" aria-label="สารบัญ"><a href="#what">โฟกัสคืออะไร</a><a href="#year">นับปียังไง</a><a href="#thai">โลกนี้</a><a href="#chain">ปลายสาย</a><a href="#gate">ประตูเข้าสาย</a><a href="#heir">ทายาท</a><a href="#isekai">ต่างโลก</a><a href="#afterlife">ปรโลก</a></nav>
<section id="what"><h2>โฟกัสคืออะไร</h2>
<p>โฟกัสคือสิ่งที่ชีวิตนั้นทุ่มเทในแต่ละปี นอกจากตัวเลือกบนการ์ด เช่น ตั้งใจเรียน ทุ่มงาน หรือดูแลครอบครัว · ทุ่มเทเรื่องไหน ค่าสถานะขยับตามเรื่องนั้นทีละน้อยทุกปี และการ์ดเรื่องเดียวกันออกบ่อยขึ้น</p>
<ul>
<li>ป้ายบนปุ่มบอกแค่ค่าไหนขึ้นหรือลง เช่น <span class="fx">${esc(ex)}</span> ไม่บอกตัวเลข · <span class="fx">มาก</span> คือขยับแรงกว่าตัวอื่น</li>
<li>ไม่ตั้งอะไรเลยคือ <b>${esc(FOCUS_FLOW_NAME)}</b> ไม่มีผล ไม่ถ่วงการ์ด ชีวิตเดินแบบเดียวกับไม่มีปุ่มนี้</li>
<li>ผลเรื่องเงินคิดเฉพาะปีที่มีรายได้ของตัวเอง ค่าใช้จ่ายของโฟกัสหักจากเงินเก็บได้แค่ส่วนหนึ่งต่อปี ไม่กู้มาทุ่ม</li>
<li>บางโฟกัสเปิดทางใหม่: ปลายสายที่ซ่อนอยู่ ตัวเลือกของสายอาชีพบนการ์ด และโฟกัสวัยเด็กของทายาท</li>
</ul></section>
<section id="year"><h2>นับปียังไง</h2><ul>
<li>ผลทั้งปีคิดตามโฟกัสที่ถืออยู่ตอนสิ้นปี ตัวเดียว · เปลี่ยนกลางปีกี่ครั้งก็ได้</li>
<li>ปีที่เปลี่ยนโฟกัสไม่นับเป็น <b>ปีเต็ม</b> ของโฟกัสไหน · ปลายสาย ประตูเข้าสาย อาชีพต่างโลก และย้ายแคว้น นับเฉพาะปีเต็ม จึงต้องทุ่มเทต่อเนื่อง</li>
<li>เข้าช่วงวัยที่โฟกัสนั้นเลือกไม่ได้แล้ว หรือเงื่อนไขหมดไป เช่น เลิกงาน เกมเปลี่ยนกลับเป็นตามน้ำเอง ปีที่สะสมไว้ไม่หาย</li>
</ul></section>
${thaiHtml(c)}
${isekaiHtml()}
<section id="afterlife"><h2>ปรโลก</h2>
<p>ปรโลกยังไม่มีโฟกัส ช่วงระหว่างชาติเดินด้วยการ์ดอย่างเดียว · สิ่งที่ปรโลกทำกับโฟกัสคือส่งต่อ: เกิดเป็นลูกหลานในตระกูลเดิมได้โฟกัสวัยเด็กกับประตูเข้าสายจากรุ่นก่อน (ดู<a href="#heir">ทายาทในตระกูล</a>)</p></section>`;
}
