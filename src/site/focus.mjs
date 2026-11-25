// หน้าโฟกัสชีวิต: รายการโฟกัส ช่วงวัย เงื่อนไข และป้ายบนปุ่มอ่านจากชุดเดียวกับที่เกมใช้ — โฟกัสเพิ่ม/เปลี่ยน หน้านี้เปลี่ยนตามตอน build
// ระดับคู่มือ ไม่ใช่เฉลย: ผลบอกเป็นคำเดียวกับป้ายบนปุ่มในเกม ไม่มีขนาดผล โอกาสเสี่ยง น้ำหนักการ์ด หรือบุญบาป
import { STAGES, STAT_LABELS, focusWords, FOCUS_FLOW_NAME, ISEKAI_FOCUS, ISEKAI_STAGES, ISEKAI_KNOW, ISEKAI_CAREERS, ISEKAI_CAREER_T, ISEKAI_ROLES, CONT_MOVE, TRIP_QUEST, roleInfo, isekaiFocusFx } from '../engine/index.mjs';
import { esc } from './catalog.mjs';
import { treeViewSvg, treeViewBranches, TREE_VIEW_BRANCH } from '../ui/treeview.mjs';

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

// ต้นไม้โฟกัส (ใบ 12): ผังเดียวกับในแอป ดูอย่างเดียว ไม่มีสถานะผู้เล่น · ป้ายผลบอกเป็นคำเหมือนปุ่มในเกม ไม่บอกปี จำนวนการ์ด หรือขนาดผล
function treeHtml(c) {
  const defs = c.tree?.nodes;
  if (!defs) return '';
  for (const b of treeViewBranches(defs)) if (!TREE_VIEW_BRANCH[b]) throw new Error(`หน้าโฟกัสยังไม่รู้จักแขนง ${b} — เติมชื่อกับสีใน TREE_VIEW_BRANCH (src/ui/treeview.mjs)`);
  const rows = Object.entries(defs).filter(([, d]) => !d.hidden).map(([id, d]) => {
    const fx = focusWords({ fx: d.fx }, STAT_LABELS);
    const cost = d.keystone ? `<br><small>ข้อเสีย: ${esc(d.warn)}</small>` : '';
    return `<tr id="t-${esc(id)}"><td><b>${esc(d.name)}</b>${cost}</td><td>${esc(TREE_VIEW_BRANCH[d.branch].name)}</td><td>${esc(span(stageOrder(d.stages)))}</td><td>${fxCell(fx)}</td></tr>`;
  });
  return `<section id="tree"><h2>ต้นไม้โฟกัส</h2>
<p>ทุ่มเทเป็นโหนดบนต้นไม้ · แต่ละแขนงรวมกันเป็นกลุ่ม ทุ่มโหนดไหนปีเต็มเข้าโหนดนั้น ปลดแล้วเหลือผลเบาติดตัวถาวร · โหนดกลางต้องปลดโหนดต้นทางครบ · โหนดรูปข้าวหลามตัดคือจุดหักเห เลือกแล้วย้อนไม่ได้ และบอกข้อเสียก่อนทุ่มเสมอ · ช่อง <b>?</b> คือโหนดที่ยังซ่อนอยู่ ไม่บอกว่าเป็นอะไรจนกว่าจะปลดต้นทาง</p>
${treeViewSvg(defs, { interactive: false }).svg}
<p><small>แตะแขนงในเกมเพื่อดูทีละกลุ่ม หรือดูต้นเต็มแล้วซูม/ลากได้</small></p>
${table(['โหนด', 'แขนง', 'ทุ่มได้ช่วง', 'ป้ายระหว่างทุ่ม'], rows)}</section>`;
}

const iskName = (id) => (id.startsWith('k:') ? ISEKAI_KNOW[id.slice(2)].focus.name : ISEKAI_FOCUS[id].name);

function isekaiHtml() {
  const head = ['ทุ่มเท', 'เลือกได้ช่วง', 'ป้ายบนปุ่ม'];
  const base = Object.entries(ISEKAI_FOCUS).map(([id, f]) => `<tr id="i-${esc(id)}"><td><b>${esc(f.name)}</b></td><td>${esc(iskSpan(f.stages))}</td><td>${fxCell(isekaiFocusFx({}, id))}</td></tr>`);
  const know = Object.entries(ISEKAI_KNOW).map(([k, x]) => `<tr><td><b>${esc(x.focus.name)}</b></td><td>${esc(x.name)}</td><td>${esc(iskSpan(x.stages))}</td><td>${fxCell(isekaiFocusFx({}, `k:${k}`))}</td></tr>`);
  const careers = Object.values(ISEKAI_CAREERS).map((c) => `<li><b>${esc(c.name)}</b> ← ${c.from.map((id) => esc(iskName(id))).join(' หรือ ')}</li>`).join('');
  const roles = Object.keys(ISEKAI_ROLES).map(roleInfo).filter((r) => r.focus).map((r) => `<li>${esc(r.name)}: <b>${esc(r.focus.name)}</b></li>`).join('');
  return `<section id="isekai"><h2>ต่างโลก <small>${Object.keys(ISEKAI_FOCUS).length} ทุ่มเท + ทางลัด ${Object.keys(ISEKAI_KNOW).length}</small></h2>
<p>ชาติต่างโลกเวลาเดินเอง เปลี่ยนเรื่องที่ทุ่มเทได้ทุกเมื่อที่แท็บ <b>โฟกัส</b> ไม่มีการ์ดหยุดถาม · รายการเปลี่ยนตามช่วงวัย เข้าช่วงวัยที่เรื่องเดิมเลือกไม่ได้แล้ว เกมเปลี่ยนกลับเป็นตามน้ำเองแล้วบอกบนใบถัดไป</p>
<p>เรื่องที่ทุ่มเทค้างข้ามปีจนกว่าจะเปลี่ยน แต่ละปีได้ค่าตามป้ายบนปุ่ม และเหตุการณ์สายเดียวกันโผล่บ่อยขึ้น · ป้ายบอกเฉพาะค่าบนจอที่ขึ้น บางเรื่องจึงไม่มีป้าย แต่ยังมีผล</p>
${table(head, base)}
<h3 id="i-near">ใกล้ตาย</h3>
<p>ชีวิตตกถึงขีดใกล้ตาย การ์ด "ใกล้ตาย" ให้เลือก "เปลี่ยนโฟกัส" ซึ่งเปิดใบเลือกโฟกัสกลางช่วงวัยและติดป้ายแนะนำที่ <b>${esc(ISEKAI_FOCUS.rest.name)}</b></p>
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
  // ตัวอย่างป้ายหยิบจากโฟกัสจริงตัวแรกที่มีทั้งขึ้นมากและลด — ป้ายในเกมเปลี่ยนคำ ตัวอย่างเปลี่ยนตาม
  const ex = Object.values(content.tree?.nodes ?? {}).map((d) => focusWords({ fx: d.fx }, STAT_LABELS)).find((w) => w.includes('ขึ้นมาก') && w.includes('ลด') && !w.includes('มีเสี่ยง'));
  return `
<nav class="toc" aria-label="สารบัญ"><a href="#what">โฟกัสคืออะไร</a><a href="#year">นับปียังไง</a><a href="#tree">ต้นไม้</a><a href="#isekai">ต่างโลก</a><a href="#afterlife">ปรโลก</a></nav>
<section id="what"><h2>โฟกัสคืออะไร</h2>
<p>โฟกัสคือสิ่งที่ชีวิตนั้นทุ่มเทในแต่ละปี นอกจากตัวเลือกบนการ์ด เช่น ตั้งใจเรียน ทุ่มงาน หรือดูแลครอบครัว · ทุ่มเทเรื่องไหน ค่าสถานะขยับตามเรื่องนั้นทีละน้อยทุกปี และการ์ดเรื่องเดียวกันออกบ่อยขึ้น</p>
<ul>
<li>ป้ายบนปุ่มบอกแค่ค่าไหนขึ้นหรือลง เช่น <span class="fx">${esc(ex)}</span> ไม่บอกตัวเลข · <span class="fx">มาก</span> คือขยับแรงกว่าตัวอื่น</li>
<li>ไม่ตั้งอะไรเลยคือ <b>${esc(FOCUS_FLOW_NAME)}</b> ไม่มีผล ไม่ถ่วงการ์ด ชีวิตเดินแบบเดียวกับไม่มีปุ่มนี้</li>
<li>ผลเรื่องเงินคิดเฉพาะปีที่มีรายได้ของตัวเอง ค่าใช้จ่ายของโฟกัสหักจากเงินเก็บได้แค่ส่วนหนึ่งต่อปี ไม่กู้มาทุ่ม</li>
<li>บางโหนดเปิดทางใหม่: ตัวเลือกของสายอาชีพบนการ์ด (ประตูเข้าสาย) และเป้าชีวิตที่ปลายแขนง</li>
</ul></section>
<section id="year"><h2>นับปียังไง</h2><ul>
<li>ผลทั้งปีคิดตามโฟกัสที่ถืออยู่ตอนสิ้นปี ตัวเดียว · เปลี่ยนกลางปีกี่ครั้งก็ได้</li>
<li>ปีที่เปลี่ยนโฟกัสไม่นับเป็น <b>ปีเต็ม</b> ของโฟกัสไหน · ประตูเข้าสาย อาชีพต่างโลก และย้ายแคว้น นับเฉพาะปีเต็ม จึงต้องทุ่มเทต่อเนื่อง</li>
<li>เข้าช่วงวัยที่โฟกัสนั้นเลือกไม่ได้แล้ว หรือเงื่อนไขหมดไป เช่น เลิกงาน เกมเปลี่ยนกลับเป็นตามน้ำเอง ปีที่สะสมไว้ไม่หาย</li>
</ul></section>
${treeHtml(content)}
${isekaiHtml()}
<section id="afterlife"><h2>ปรโลก</h2>
<p>ปรโลกมีแท็บ <b>โฟกัส</b> ไว้ดูว่าชาติที่แล้วทุ่มเทเรื่องไหน แต่เลือกใหม่ไม่ได้ ช่วงระหว่างชาติเดินด้วยการ์ดอย่างเดียว · สิ่งที่ปรโลกทำกับโฟกัสคือส่งต่อ: เกิดเป็นลูกหลานในตระกูลเดิมได้ต้นแขนงหลักกับประตูเข้าสายจากรุ่นก่อน</p></section>`;
}
