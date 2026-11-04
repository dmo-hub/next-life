// หน้าเฉลยส่วนเส้นทางงาน (ui-redo ใบ 21): ต่อสาย → อาชีพในสาย → ทางเข้า · การ์ดระหว่างงาน · ทางออก
// โครงสาย/อาชีพ/ทางเข้าดึงจาก careers.json + การ์ด (when.occupation · when.ladder · effects.job/ladder) · % อ่านจากไฟล์ผลจำลองเท่านั้น
// การ์ดที่ไม่มีในไฟล์ผล (ใหม่กว่าผลจำลอง) ขึ้นว่ายังไม่มีผลจำลอง ไม่เดาเลข · สร้างไฟล์ผลด้วย node harness/career-sim.mjs
import { existsSync, readFileSync } from 'node:fs';
import { esc, text } from './catalog.mjs';

export const OFFICE_UNIT = 'office';
export const unitKey = (ladder, occ) => `${ladder}|${occ}`;
export const SIM_FILE = 'data/career-sim.json';
// การ์ดเลือกที่แกนสร้างตอนอยู่ในงาน — ไม่อยู่ใน content จึงนับจาก prefix ของ id
const ENGINE_CARD = /^(promo_|office_|recruit_gov$|early_retire$)/;
export const isCareerCard = (id) => ENGINE_CARD.test(id);
// ต่ำกว่านี้รวบเป็นบรรทัดเดียว — การ์ดเกี่ยวกับงานมีหลายสิบใบต่ออาชีพ ใบที่แทบไม่มีใครเจอดันใบหลักตกจอ
export const RARE_PCT = 1;

const nodes = (e) => (e.choices ?? []).flatMap((c) => [c, ...(c.outcomes ?? [])]);
const jobFx = (e) => nodes(e).flatMap((x) => (x.effects?.job || x.effects?.ladder ? [x.effects] : []));

// การ์ดเนื้อหาที่ผูกกับงาน: กั้นด้วยอาชีพ/สาย · โอกาสออกขึ้นกับอาชีพ · หรือมีทางที่ได้งาน/เข้าสาย
export function careerCardIds(content) {
  return new Set(content.events.filter((e) => e.when?.occupation || e.when?.ladder || e.multipliers?.occupation || jobFx(e).length).map((e) => e.id));
}

let cached;
export function careerSim(root = new URL('../../', import.meta.url)) {
  const file = new URL(SIM_FILE, root);
  if (cached?.href === file.href) return cached.sim;
  const sim = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  cached = { href: file.href, sim };
  return sim;
}

// ชุดการ์ดในกองไม่ตรงไฟล์ผล = ผลจำลองค้าง (การ์ดเพิ่ม/ลบ/เปลี่ยน id) — site:check เตือน ไม่ตก
export function simDrift(content, sim = careerSim()) {
  if (!sim) return { missing: [...careerCardIds(content)], gone: [], noFile: true };
  const now = careerCardIds(content);
  const then = new Set(sim.cards ?? []);
  return { missing: [...now].filter((id) => !then.has(id)).sort(), gone: [...then].filter((id) => !now.has(id)).sort(), noFile: false };
}

// สายที่อาชีพเปลี่ยนตามขั้น (ราชการ ทหาร ตำรวจ) ไล่อาชีพจากขั้น · สายเอกชน/สายอาชีพอ่านรายการอาชีพของสาย
function ladderOccs(ladder) {
  if (ladder.occs) return ladder.occs;
  return [...new Set(ladder.steps.map((s) => s.occ).filter(Boolean))];
}
const stepNames = (ladder, occ) => (ladder.occs ? [] : ladder.steps.filter((s) => s.occ === occ).map((s) => s.name));

const ENGINE_LABEL = {
  first_job: 'การ์ดหางานแรก',
  recruit_gov: 'การ์ดชวนรับราชการ',
  early_retire: 'การ์ดเกษียณก่อนกำหนด',
};
const ENGINE_REASON = { promote: 'เลื่อนขั้นในสาย', cadet: 'จบโรงเรียนนายร้อย ติดยศเข้าสาย', other: 'เปลี่ยนตามวัยหรือกติกาของเกม ไม่ผ่านตัวเลือก' };
function engineCard(id) {
  if (ENGINE_LABEL[id]) return ENGINE_LABEL[id];
  if (id.startsWith('school_gate_')) return 'การ์ดเรียนจบ เลือกทางต่อ';
  if (id.startsWith('promo_')) return 'การ์ดเลื่อนขั้น';
  if (id.startsWith('office_budget_')) return 'การ์ดงบประจำตำแหน่ง';
  if (id.startsWith('office_')) return 'การ์ดชวนลงสมัคร';
  return id;
}

function cardName(id, byId) {
  const e = byId.get(id);
  if (!e) return esc(engineCard(id));
  const name = e.title ?? `${[...e.text].slice(0, 24).join('')}…`;
  return `<a href="#${esc(id)}">${text(name)}</a>`;
}
const viaHtml = (v, byId) => (v.engine ? esc(ENGINE_REASON[v.engine] ?? v.engine) : `${cardName(v.id, byId)}${v.text ? ` — ${text(v.text)}` : ''}`);
const pct = (k, lives) => (lives ? (k / lives) * 100 : 0);
const simPct = (p) => `<b class="sim" title="ชีวิตที่เจอ ÷ ชีวิตที่เคยทำงานนี้">${p.toFixed(1)}%</b>`;

function unitName(key, L) {
  if (key === OFFICE_UNIT) return L.office.name;
  const [lad, occ] = key.split('|');
  return `${L.occ(occ)} (${L.ladder(lad)})`;
}

function exitHtml(x, byId, L) {
  if (x.kind === 'death') return 'ตายระหว่างทำงาน';
  if (x.kind === 'retire') return 'เกษียณเมื่ออายุครบ';
  if (x.kind === 'early_retire') return 'เกษียณก่อนกำหนด';
  if (x.kind === 'move') return `ย้ายไป${esc(unitName(x.to, L))} · ผ่าน ${viaHtml(x, byId)}`;
  return `ออกจากงาน · ผ่าน ${viaHtml(x, byId)}`;
}

function pctList(rows, lives, draw) {
  const main = rows.filter((r) => pct(r.n, lives) >= RARE_PCT);
  const rare = rows.filter((r) => pct(r.n, lives) < RARE_PCT);
  const li = main.map((r) => `<li>${simPct(pct(r.n, lives))} ${draw(r)}</li>`).join('');
  return [li ? `<ul class="sl">${li}</ul>` : '', rare.length ? `<p class="rare">เจอไม่ถึง ${RARE_PCT}% (${rare.length}): ${rare.map(draw).join(' · ')}</p>` : ''].join('');
}

// ใบที่ข้อมูลบอกว่าผูกกับงานนี้แต่ไม่มีในไฟล์ผล — ขึ้นชื่อโดยไม่มีเลข
const noSim = (ids, byId) => (ids.length ? `<p class="rare">ยังไม่มีผลจำลอง: ${ids.map((id) => cardName(id, byId)).join(' · ')}</p>` : '');

function unitHtml(key, title, sub, staticIn, staticCards, sim, byId, L) {
  const u = sim?.units?.[key];
  const simCards = new Set(sim?.cards ?? []);
  const head = `<h4>${esc(title)}${sub ? ` <small>${esc(sub)}</small>` : ''}</h4>`;
  if (!u || !u.lives) {
    return `<div class="job">${head}<p class="rare">ยังไม่มีผลจำลอง${sim ? ' — ไม่มีชีวิตจำลองไหนเคยทำงานนี้' : ''}</p>${noSim([...new Set([...staticIn, ...staticCards])].sort(), byId)}</div>`;
  }
  const seenIn = new Set(u.entries.map((r) => r.id).filter(Boolean));
  const seenCards = new Set(u.cards.map((r) => r.id));
  return [
    `<div class="job">${head}`,
    `<p class="lives">เคยทำงานนี้ ${u.lives.toLocaleString('en-US')} จาก ${sim.lives.toLocaleString('en-US')} ชีวิตจำลอง</p>`,
    `<p class="sub">ทางเข้า</p>`,
    pctList(u.entries, u.lives, (r) => viaHtml(r, byId)),
    noSim(staticIn.filter((id) => !seenIn.has(id) && !simCards.has(id)), byId),
    `<p class="sub">การ์ดที่เจอระหว่างทำงานนี้</p>`,
    pctList(u.cards, u.lives, (r) => cardName(r.id, byId)) || '<p class="rare">ไม่มีการ์ดเฉพาะงานนี้</p>',
    noSim(staticCards.filter((id) => !seenCards.has(id) && !simCards.has(id)), byId),
    `<p class="sub">ทางออก</p>`,
    pctList(u.exits, u.lives, (r) => exitHtml(r, byId, L)) || '<p class="rare">ไม่มีชีวิตจำลองที่ออกจากงานนี้</p>',
    '</div>',
  ].join('');
}

// L: occ(id) → ชื่ออาชีพ · ladder(id) → "สาย…" (ตัวเดียวกับหน้าเฉลยส่วนการ์ด)
export function careerHtml(content, L, sim = careerSim()) {
  const careers = content.era.careers;
  if (!careers?.ladders) return '';
  const byId = new Map(content.events.map((e) => [e.id, e]));
  const occOfLadder = (lad) => (careers.ladders[lad].occs ? null : careers.ladders[lad].steps[0].occ);
  // ทางเข้าตามข้อมูล: ผล effects.job (อาชีพของสายเอกชน/สายอาชีพ) · effects.ladder (เข้าสายที่ขั้นแรก)
  const entersTo = (e, lad, occ) =>
    jobFx(e).some((fx) => (fx.ladder ? fx.ladder === lad && occOfLadder(lad) === occ : careers.ladders[lad].occs?.includes(fx.job) && fx.job === occ));
  const during = (e, lad, occ) => (e.when?.occupation?.includes(occ) && (!e.when?.ladder || e.when.ladder.includes(lad))) || (e.when?.ladder?.includes(lad) && !e.when?.occupation) || !!e.multipliers?.occupation?.[occ];
  const L2 = { ...L, office: careers.office };
  const sections = Object.entries(careers.ladders).map(([lad, ladder]) => {
    const occs = ladderOccs(ladder);
    const body = occs
      .map((occ) => {
        const steps = stepNames(ladder, occ);
        const staticIn = content.events.filter((e) => entersTo(e, lad, occ)).map((e) => e.id);
        const staticCards = content.events.filter((e) => during(e, lad, occ)).map((e) => e.id);
        return unitHtml(unitKey(lad, occ), L.occ(occ), steps.length ? `ขั้น ${steps.join(' · ')}` : '', staticIn, staticCards, sim, byId, L2);
      })
      .join('');
    return `<h3>${esc(L.ladder(lad))} <small>${occs.length} อาชีพ</small></h3><div class="jobs">${body}</div>`;
  });
  const office = careers.office;
  if (office) sections.push(`<h3>${esc(office.name)} <small>ทำควบงานเดิมได้ถึงระดับท้องถิ่น</small></h3><div class="jobs">${unitHtml(OFFICE_UNIT, office.name, `ขั้น ${office.steps.map((s) => s.name).join(' · ')}`, [], [], sim, byId, L2)}</div>`);
  const lead = sim
    ? `ผลจำลอง ${sim.lives.toLocaleString('en-US')} ชีวิต (บอท ${sim.bots.length} แบบ แบบละ ${sim.perBot.toLocaleString('en-US')} ชีวิต · เกมรุ่น ${esc(sim.sha)}) · <b class="sim">%</b> สีนี้ = ชีวิตที่เจอ ÷ ชีวิตที่เคยทำงานนั้น เจอกี่ครั้งก็นับครั้งเดียว ไม่ใช่โอกาสของผลสุ่มบนการ์ด`
    : 'ยังไม่มีไฟล์ผลจำลอง — รายการด้านล่างมาจากข้อมูลการ์ดอย่างเดียว ไม่มีเลข';
  return `<details id="career"><summary>เส้นทางงาน <small>${Object.keys(careers.ladders).length + (office ? 1 : 0)} สาย · ผลจำลอง</small></summary><p class="lead">${lead}</p>${sections.join('')}</details>`;
}
