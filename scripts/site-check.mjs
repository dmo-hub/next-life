// ด่านหน้าเว็บ (B65): ตัวเลขบนหน้าเท่าค่าจริง · build ใหม่แล้วเลขเปลี่ยนตามข้อมูล (ตัวควบคุม) · ลิงก์ในเว็บไม่ตาย
// · หน้ารวมการ์ดไม่มีผล/บุญบาป/น้ำหนัก · ทุกการ์ดใน content อยู่บนหน้ารวมการ์ด
// · ส่วนต่างโลก (B88b) ทั้งสองหน้าครบทุกการ์ด · หน้ารวมการ์ดไม่มีผลสำเร็จ/พลาด ความยาก หรือตอนจบ
// · หน้าเฉลย (B88) ครบทุกการ์ด/ตัวเลือก/ผลสุ่ม และเฉลยจริง — กฎ "ไม่หลุดบุญบาป" ของหน้ารวมการ์ดไม่ใช้กับหน้านี้
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { loadContent } from '../src/node/load.mjs';
import { siteFacts, injectFacts, readVersion, versionLines, releaseLog, notesLines, NOTE_CUT } from '../src/site/facts.mjs';
import { catalogHtml } from '../src/site/catalog.mjs';
import { FACT_PAGES, GEN_PAGES } from '../src/site/build.mjs';
import { meritName, meritId, MERIT_WEIGHTS, ISEKAI_EVENTS, ISEKAI_ROLES, roleInfo, ISEKAI_SKILLS, ISEKAI_CAREERS, CONT_REGIONS, CONT_RACES, CONT_END, contBirth, makeRng } from '../src/engine/index.mjs';
import { isekaiCardCount, ISEKAI_SECTION, contEndTitles, text as isekaiText } from '../src/site/otherworld.mjs';
import { specFiles, specHtmlFiles, bareUrls, docId, SPEC_DIR, SPEC_START, SPEC_END } from '../src/site/spec.mjs';
import { BTN } from '../src/ui/labels.mjs';
import { BTN_HELP } from '../src/site/guide.mjs';
import { demoHtml, DEMO_START, DEMO_END } from '../src/site/demo.mjs';
import { spoilersHtml, flagNames, systemNames } from '../src/site/spoilers.mjs';
import { simDrift, careerSim, SIM_FILE } from '../src/site/career.mjs';
import { designFiles, designPage, designPages, designHtml, DESIGN_AT } from '../src/site/design.mjs';
import { navHtml, navBlocks, NAV_CSS, devNavHtml, DEV_TABS, MOVED_MARK, movedHtml } from '../src/site/nav.mjs';
import { uiPage, designMoved, tweakPages, cssVars, UI_PAGE, UI_MOVED_FROM } from '../src/site/ui.mjs';
import { soonCats, roadmapHtml, ROAD_START, ROAD_END } from '../src/site/roadmap.mjs';
import { sceneArt, ART_SCENE_IDS } from '../src/ui/art.mjs';

const docs = new URL('../docs/', import.meta.url);
const read = (p) => readFileSync(new URL(p, docs), 'utf8');
const content = loadContent();
const facts = siteFacts(content);
let fail = 0;
const check = (name, bad, extra = '') => {
  console.log(`${name}${extra} → ${bad ? 'ตก' : 'ผ่าน'}`);
  if (bad) fail++;
};

// 1) ตัวเลขบนหน้า = ค่าที่คิดจากข้อมูลตอนนี้ (หน้าที่ยังไม่ได้ build ใหม่หลังแก้ข้อมูล = ตก)
const designOut = designPages();
const pages = [...FACT_PAGES, ...GEN_PAGES.map(([name]) => name), ...designOut.map(([f]) => DESIGN_AT + f.replace(/\.html$/, ''))];
let seen = 0;
const wrong = [];
for (const p of pages) {
  for (const [, key, val] of read(`${p}.html`).matchAll(/data-fact="([^"]+)"[^>]*>([^<]*)</g)) {
    seen++;
    if (facts[key] !== val) wrong.push(`${p}.html ${key}: หน้า "${val}" ค่าจริง "${facts[key]}"`);
  }
}
check('ตัวเลขบนหน้าเท่าค่าจริง', wrong.length || !seen, ` ${seen} จุด ใน ${pages.length} หน้า${wrong.length ? ` · ผิด ${wrong.length}: ${wrong.slice(0, 5).join(' | ')}` : ''}`);

// 2) ตัวควบคุม: ข้อมูลเปลี่ยน (ตัดการ์ดออก 1 ใบ · ฉายาหาย 1 ตัว) ⇒ เลขที่ฉีดต้องเปลี่ยนตาม — ไม่งั้นข้อ 1 ผ่านเพราะเขียนเลขมือตรงกันพอดี
const less = { ...content, events: content.events.slice(1) };
const f2 = { ...siteFacts(less), titles: String(Number(facts.titles) - 1) };
const probe = injectFacts(read('index.html'), f2);
const moved = ['cards', 'titles'].every((k) => probe.includes(`data-fact="${k}">${f2[k]}<`) && f2[k] !== facts[k]);
check('ตัวควบคุม: ข้อมูลเปลี่ยนแล้วเลขบนหน้าเปลี่ยนตาม', !moved, ` (การ์ด ${facts.cards} → ${f2.cards} · ฉายา ${facts.titles} → ${f2.titles})`);

// 3) ลิงก์ภายในเว็บไม่ตาย (ไฟล์ · รูป · ที่มาจากหน้าใน docs/ และ docs/spec/ ที่หน้าเว็บลิงก์ถึง)
const all = [...pages, 'cards', 'whatsnew', 'archive/cards-v1', 'archive/overview-v1', 'dev/index', 'dev/spec'];
const dead = [];
for (const p of all) {
  const html = read(`${p}.html`);
  const base = new URL(`${p}.html`, docs);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    if (!existsSync(new URL(ref, base))) dead.push(`${p}.html → ${ref}`);
  }
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${id}"`)) dead.push(`${p}.html → #${id}`);
}
check('ลิงก์ภายในไม่ตาย', dead.length, ` ${all.length} หน้า${dead.length ? ` · ตาย ${dead.length}: ${dead.slice(0, 6).join(' | ')}` : ''}`);

// 4) หน้ารวมการ์ด: ครบทุกใบ และไม่มีค่าที่ผู้เล่นไม่เห็นบนจอ
// ส่วนต่างโลกต่อท้ายหน้า (otherworld.mjs) — แยกนับที่หัวข้อนั้น ไม่ให้เลขการ์ดชาติไทยปนการ์ดต่างโลก
const cut = (html) => {
  const i = html.indexOf(`<summary>${ISEKAI_SECTION} `);
  return i < 0 ? [html, ''] : [html.slice(0, i), html.slice(i)];
};
const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cards = read('catalog.html');
const [cardsTh, cardsIsk] = cut(cards);
const shown = (cardsTh.match(/<article class="c /g) ?? []).length;
check('หน้ารวมการ์ดมีครบทุกใบ', shown !== content.events.length, ` ${shown}/${content.events.length}`);
const cats = Object.keys(MERIT_WEIGHTS).flatMap((id) => [id, meritName(id)]).filter((s) => s && s !== 'neutral' && s.length > 1);
const leak = [/"weight"|multipliers|"merit"|outcomes/, /บัญชีบุญบาป\s*[-+]?\d/, /[+-]\d+\s*(?:สุขภาพ|ความสุข|ความรู้|ความสัมพันธ์|คอนเน็คชั่น)/];
const leaks = leak.filter((re) => re.test(catalogHtml(content))).map(String);
// ชื่อหมวดบุญบาปภาษาไทยอาจเป็นคำธรรมดาในข้อความการ์ด — นับเฉพาะ id อังกฤษของหมวด
const ids = cats.filter((s) => /^[a-z_]+$/.test(s) && new RegExp(`\\b${s}\\b`).test(cards));
check('หน้ารวมการ์ดไม่มีผล/น้ำหนัก/ป้ายบุญบาป', leaks.length || ids.length, leaks.length || ids.length ? ` · เจอ ${[...leaks, ...ids].join(' ')}` : '');

// 5) หน้าเฉลย: นับชิ้นบนหน้าเทียบ content ตรง ๆ — ตัวสร้างทำตกหล่นสักทาง (ตัวเลือกซ่อน · ผลสุ่ม · ป้ายบุญบาป) เลขจะไม่เท่า
const spoil = read('spoilers.html');
const [spoilTh, spoilIsk] = cut(spoil);
const nodes = content.events.flatMap((e) => e.choices.flatMap((c) => [c, ...(c.outcomes ?? [])]));
const want = {
  การ์ด: content.events.length,
  ตัวเลือก: content.events.reduce((s, e) => s + e.choices.length, 0),
  ผลสุ่ม: nodes.filter((n) => n.weight !== undefined).length,
  ป้ายบุญบาป: nodes.flatMap((n) => n.merit ?? []).filter((t) => meritId(t.cat) !== 'neutral').length,
};
const got = {
  การ์ด: (spoilTh.match(/<article class="c /g) ?? []).length,
  ตัวเลือก: (spoilTh.match(/<p class="ch">/g) ?? []).length,
  ผลสุ่ม: (spoilTh.match(/<b class="pct">/g) ?? []).length,
  ป้ายบุญบาป: (spoilTh.match(/<span class="m (?:good|sin)">/g) ?? []).length,
};
const off = Object.keys(want).filter((k) => want[k] !== got[k] || !want[k]);
check('หน้าเฉลยครบทุกการ์ด ตัวเลือก ผลสุ่ม ป้ายบุญบาป', off.length, ` ${Object.keys(want).map((k) => `${k} ${got[k]}/${want[k]}`).join(' · ')}`);
// 6) ส่วนต่างโลก: นับเทียบโมดูลในเอนจินตรง ๆ · หน้ารวมการ์ดห้ามมีข้อความผลสำเร็จ/พลาด ชื่อตอนจบ หรือความยาก
const ISEKAI_ROLE_INFO = Object.keys(ISEKAI_ROLES).map(roleInfo);
const iskWant = {
  การ์ด: isekaiCardCount(),
  ตัวเลือก: ISEKAI_EVENTS.reduce((s, e) => s + e.choices.length, 0),
  ผล: ISEKAI_EVENTS.reduce((s, e) => s + e.choices.reduce((n, c) => n + (c.stat || c.know ? 2 : 1), 0), 0),
  // บทบาทที่ไม่มีเนื้อเรื่องของโลกมีแค่ 3 ตอนจบ ไม่มีตอนจบพิเศษ
  // + ตอนจบชาติทวีป (06d)
  ตอนจบ: ISEKAI_ROLE_INFO.reduce((s, w) => s + new Set(['best', 'good', 'bad', w.special?.[1] ?? 'best']).size, 0) + Object.keys(CONT_END).length,
  บทบาท: ISEKAI_ROLE_INFO.length,
  สกิล: Object.keys(ISEKAI_SKILLS).length,
};
const iskGot = {
  การ์ด: (spoilIsk.match(/<article class="c x"/g) ?? []).length,
  ตัวเลือก: (spoilIsk.match(/<p class="ch">/g) ?? []).length,
  ผล: (spoilIsk.match(/<b class="rk">/g) ?? []).length,
  ตอนจบ: (spoilIsk.match(/<li class="end">/g) ?? []).length,
  บทบาท: ISEKAI_ROLE_INFO.filter((w) => spoilIsk.includes(`<b>${escHtml(w.name)}</b>`)).length,
  สกิล: Object.values(ISEKAI_SKILLS).filter((x) => spoilIsk.includes(`<b>${escHtml(x.name)}</b>`)).length,
};
const iskOff = Object.keys(iskWant).filter((k) => iskWant[k] !== iskGot[k] || !iskWant[k]);
check('หน้าเฉลยส่วนต่างโลกครบ', iskOff.length, ` ${Object.keys(iskWant).map((k) => `${k} ${iskGot[k]}/${iskWant[k]}`).join(' · ')}`);
const catIsk = (cardsIsk.match(/<article class="c x"/g) ?? []).length;
const catFull = ISEKAI_EVENTS.filter((e) => cardsIsk.includes(`<h4>${escHtml(e.title)}</h4>`) && e.choices.every((c) => cardsIsk.includes(`<li>${isekaiText(c.t)}</li>`))).length;
check('หน้ารวมการ์ดมีส่วนต่างโลกครบ', catIsk !== isekaiCardCount() || catFull !== ISEKAI_EVENTS.length, ` การ์ด ${catIsk}/${isekaiCardCount()} · เหตุการณ์ที่ชื่อและตัวเลือกครบ ${catFull}/${ISEKAI_EVENTS.length}`);
const hidden = [
  // ตัวเลือกความรู้โลกเดิม (B68h · c.know) ทอยเหมือนตัวเลือกค่าสถานะ
  ...ISEKAI_EVENTS.flatMap((e) => e.choices.flatMap((c) => (c.stat || c.know ? [c.win.text, c.lose.text] : [c.text]))),
  ...ISEKAI_ROLE_INFO.flatMap((w) => Object.values(w.end).map(([title]) => title)),
  ...contEndTitles(),
];
const iskLeak = hidden.filter((t) => cards.includes(escHtml(t)));
if (/ความยาก|class="rk"/.test(cardsIsk)) iskLeak.push('ความยาก/ผล');
check('หน้ารวมการ์ดส่วนต่างโลกไม่เฉลยผลหรือตอนจบ', iskLeak.length || !cardsIsk, iskLeak.length ? ` · เจอ ${iskLeak.slice(0, 3).join(' | ')}` : ` (ตรวจ ${hidden.length} ข้อความ)`);
check('หน้ารวมการ์ดลิงก์ไปหน้าเฉลย และหน้าเฉลยมีป้ายเตือนสปอยล์', !cards.includes('href="spoilers.html"') || !spoil.includes('class="warn"'));
// 5b) เส้นทางงาน (ui-redo ใบ 21): ทุกอาชีพในทุกสายของ careers.json + การเมือง มีกล่องบนหน้า
// ผลจำลองค้าง (การ์ดเพิ่ม/ลบ/เปลี่ยน id หลังรันจำลอง) = เตือน ไม่ตก — จำลองรันสั่งแยก ไม่ผูก build
const occsOf = (l) => (l.occs ? l.occs.length : new Set(l.steps.map((x) => x.occ)).size);
const jobWant = Object.values(content.era.careers.ladders).reduce((s, l) => s + occsOf(l), 0) + (content.era.careers.office ? 1 : 0);
const jobGot = (spoilTh.match(/<div class="job">/g) ?? []).length;
check('หน้าเฉลยมีเส้นทางงานครบทุกอาชีพในทุกสาย', jobGot !== jobWant || !spoilTh.includes('id="career"'), ` ${jobGot}/${jobWant}`);
const drift = simDrift(content);
if (drift.noFile) console.log(`⚠ เตือน: ไม่มี ${SIM_FILE} — หน้าเฉลยส่วนเส้นทางงานไม่มีเลข · รัน npm run career:sim`);
else if (drift.missing.length || drift.gone.length)
  console.log(`⚠ เตือน: ผลจำลองเส้นทางงานค้าง — การ์ดใหม่ไม่มีผล ${drift.missing.length} (${drift.missing.slice(0, 5).join(', ')}) · การ์ดที่หายจากกอง ${drift.gone.length} (${drift.gone.slice(0, 5).join(', ')}) · รัน npm run career:sim แล้ว build`);
else console.log(`ผลจำลองเส้นทางงานตรงชุดการ์ดในกอง (${careerSim().cards.length} ใบ · เกมรุ่น ${careerSim().sha})`);

// 6b) ชาติใหม่เกิดในทวีป (06d): ส่วนหลักของหน้าเฉลยมีครบทุกแคว้น เผ่า อาชีพ · หน้าที่ผู้เล่นใหม่อ่านไม่พูดถึงการเลือกบทบาท (กลุ่มพับชาติเก่ายกเว้น)
// · โอกาสต่อแฟ้มบนหน้าเท่าที่ contBirth สุ่มจริง ±1 จุด
const noOld = (html) => html.replace(/<details class="old"[\s\S]*?<\/details>/, '');
const contMiss = (html) => {
  const has = (name) => html.includes(`<b>${escHtml(name)}</b>`);
  return [...Object.values(CONT_REGIONS), ...Object.values(CONT_RACES), ...Object.values(ISEKAI_CAREERS)].filter((x) => !has(x.name)).map((x) => x.name);
};
const ROLE_TALK = /เทพธิดายื่นบทบาท|เลือกบทบาท|บทบาทตอนเกิด/;
const newPages = { 'catalog ต่างโลก': noOld(cardsIsk), 'spoilers ต่างโลก': noOld(spoilIsk), otherworld: read('otherworld.html'), index: read('index.html'), about: read('about.html') };
const roleLeft = Object.entries(newPages).filter(([, h]) => ROLE_TALK.test(h)).map(([p]) => p);
// หน้าต่างโลก (กติกาต่างโลกทั้งหมด ย้ายจากหน้า GDD เดิม) เล่าตอนจบชาติทวีปด้วยเกณฑ์ชื่อเสียงจากโค้ด — ไม่งั้นเหลือแค่ระดับตอนจบของบทบาท 4 โลกเดิม
const endTalk = (html) => html.includes('data-fact="contFame"');
if (!endTalk(newPages.otherworld)) roleLeft.push('otherworld (ตอนจบชาติทวีป)');
const spoilNew = noOld(spoilIsk);
const contGone = contMiss(spoilNew);
const regGone = Object.values(CONT_REGIONS).filter((g) => !noOld(cardsIsk).includes(`<b>${escHtml(g.name)}</b>`)).map((g) => g.name);
// ตัวควบคุม: ใส่คำเลือกบทบาทกลับในส่วนใหม่ · ตัดแคว้นแรกออกจากหน้าเฉลย ⇒ ทั้งคู่ต้องถูกจับ
const firstReg = Object.values(CONT_REGIONS)[0].name;
const ctl = ROLE_TALK.test(`${spoilNew}<p>เทพธิดายื่นบทบาทให้เลือก</p>`) && !endTalk(newPages.otherworld.replaceAll('data-fact="contFame"', '')) && contMiss(spoilNew.replaceAll(`<b>${escHtml(firstReg)}</b>`, '')).includes(firstReg);
check('ส่วนต่างโลกพูดถึงทวีปแทนบทบาท: ครบทุกแคว้น เผ่า อาชีพ · ไม่มีคำเลือกบทบาทนอกกลุ่มชาติเก่า', contGone.length || regGone.length || roleLeft.length || !ctl, ` แคว้น ${Object.keys(CONT_REGIONS).length} · เผ่า ${Object.keys(CONT_RACES).length} · อาชีพ ${Object.keys(ISEKAI_CAREERS).length}${contGone.length ? ` · หน้าเฉลยขาด ${contGone.join(' ')}` : ''}${regGone.length ? ` · หน้ารวมการ์ดขาด ${regGone.join(' ')}` : ''}${roleLeft.length ? ` · ยังพูดถึงบทบาท: ${roleLeft.join(' ')}` : ''} · ตัวควบคุม${ctl ? 'จับได้' : 'จับไม่ได้'}`);
const N_BIRTH = 10000;
const brng = makeRng(0xb127);
const born = {};
for (let i = 0; i < N_BIRTH; i++) {
  const b = contBirth(brng);
  born[b.region] = (born[b.region] ?? 0) + 1;
}
const odds = Object.fromEntries([...spoilNew.matchAll(/data-reg="([^"]+)">(\d+)</g)].map((m) => [m[1], Number(m[2])]));
const oddOff = Object.keys(CONT_REGIONS).filter((id) => odds[id] === undefined || Math.abs(odds[id] - (100 * (born[id] ?? 0)) / N_BIRTH) > 1);
check('โอกาสต่อแฟ้มบนหน้าเฉลยตรงที่เกมสุ่ม ±1 จุด', oddOff.length, ` ${Object.keys(odds).length}/${Object.keys(CONT_REGIONS).length} แคว้น · สุ่ม ${N_BIRTH} ครั้ง${oddOff.length ? ` · เพี้ยน ${oddOff.map((id) => `${id} หน้า ${odds[id]}% เกม ${((100 * (born[id] ?? 0)) / N_BIRTH).toFixed(1)}%`).join(' | ')}` : ''}`);

// 7) ภาคผนวกสเปกใน GDD (B115): ทุกไฟล์ .md ใน docs/spec มีหัวข้อบนหน้า · URL อ้างอิงทุกตัวในต้นฉบับกดได้ · หน้าเว็บไม่พาไปหน้า tree/blob บน GitHub อีก
const specPage = read('dev/spec.html');
const spec = specPage.slice(specPage.indexOf(SPEC_START), specPage.indexOf(SPEC_END));
const specHref = new Set([...spec.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')));
const urlsIn = (hrefs) => specFiles().flatMap((f) => bareUrls(readFileSync(new URL(f, SPEC_DIR), 'utf8')).filter((u) => !hrefs.has(u)).map((u) => `${f} ${u}`));
const noDoc = specFiles().filter((f) => !spec.includes(`<details class="doc" id="${docId(f)}">`));
const noHtml = specHtmlFiles().filter((f) => !specHref.has(`../spec/${f}`));
const unlinked = urlsIn(specHref);
// ตัวควบคุม: ตัด URL อ้างอิงตัวแรกออกจากชุด href แล้วด่านต้องจับได้ — กันด่านที่ผ่านเพราะนับไม่เจออะไรเลย
const firstUrl = specFiles().flatMap((f) => bareUrls(readFileSync(new URL(f, SPEC_DIR), 'utf8')))[0];
const caught = firstUrl && urlsIn(new Set([...specHref].filter((h) => h !== firstUrl))).length > 0;
check('ภาคผนวกสเปกใน GDD ครบทุกไฟล์และลิงก์อ้างอิงกดได้', noDoc.length || noHtml.length || unlinked.length || !caught, ` ไฟล์ ${specFiles().length - noDoc.length}/${specFiles().length} · URL ไม่เป็นลิงก์ ${unlinked.length}${unlinked.length ? `: ${unlinked.slice(0, 3).join(' | ')}` : ''}${noHtml.length ? ` · ไม่มีลิงก์ ${noHtml.join(' ')}` : ''} · ตัวควบคุม${caught ? 'จับได้' : 'จับไม่ได้'}`);
const gh = all.flatMap((p) => [...read(`${p}.html`).matchAll(/https?:\/\/github\.com\/[^"\s]*\/(?:tree|blob)\/[^"\s]*/g)].map((m) => `${p}.html → ${m[0]}`));
check('หน้าเว็บไม่ลิงก์ไปหน้า tree/blob บน GitHub', gh.length, ` ${all.length} หน้า${gh.length ? ` · เจอ ${gh.slice(0, 3).join(' | ')}` : ''}`);

// 7b) หน้าคำตัดสินเกม: ทุกไฟล์ใน design/ มีหัวข้อบนหน้าของเรื่องนั้น · หน้าใน docs/dev/ ตรงกับที่ build จาก design/ ตอนนี้ (sync สำเนาใหม่แล้วลืม build = ตก · git checkout ได้ CRLF ไม่นับ)
// CRLF ตัดทั้งสองฝั่ง: checkout แบบ core.autocrlf=true ได้แม่แบบ src/site/design.html + design/*.md เป็น CRLF ⇒ ของที่ build ในด่านก็ CRLF
// ตัวควบคุม: ถอดเอกสารแรกออกจากหน้าสารบัญ ⇒ ต้องถูกจับว่าไม่ครบ และไม่ตรงของที่ build
const designTpl = injectFacts(readFileSync(new URL('../src/site/design.html', import.meta.url), 'utf8'), facts);
const lf = (s) => s?.replace(/\r\n/g, '\n');
// หน้าอยู่ใต้ DESIGN_AT · ที่เดิมใต้ docs/ ต้องเป็นหน้าส่งต่อไปหน้าใหม่ (ui-redo 43) — หน้าส่งต่อไม่นับเป็น "เกิน"
const readOr = (p) => (existsSync(new URL(p, docs)) ? read(p) : null);
const designGap = (out, readPage, readOld = readOr) => [
  ...designFiles().filter((f) => !readPage(designPage(f))?.includes(`<details class="doc" id="${docId(f)}"`)).map((f) => `ไม่มี ${f}`),
  ...out.filter(([f, pg]) => lf(readPage(f)) !== lf(designHtml(designTpl, pg, f))).map(([f]) => `ค้าง ${f}`),
  ...out.filter(([f, pg]) => lf(readOld(f)) !== designMoved(f, pg.title)).map(([f]) => `ไม่มีหน้าส่งต่อ ${f}`),
  // หน้าเรื่องที่ถูกรวม/ลบแล้วยังค้าง ทั้งที่ใหม่และที่เดิม
  ...readdirSync(new URL(DESIGN_AT, docs)).filter((n) => /^design-.+\.html$/.test(n) && !out.some(([f]) => f === n)).map((n) => `เกิน ${DESIGN_AT}${n}`),
  ...readdirSync(docs).filter((n) => /^design-.+\.html$/.test(n) && !out.some(([f]) => f === n)).map((n) => `เกิน ${n}`),
];
const designMiss = designGap(designOut, (f) => readOr(DESIGN_AT + f));
const cutFirst = designOut.map(([f, pg], i) => [f, i ? pg : { ...pg, body: pg.body.replace(/<details class="doc"[\s\S]*?<\/details>/, '') }]);
const designCtl = designGap(designOut, (f) => designHtml(designTpl, cutFirst.find(([x]) => x === f)[1], f)).length >= 2;
// ตัวควบคุมหน้าส่งต่อ: ลบหน้าส่งต่อ 1 ไฟล์ ⇒ ต้องถูกจับ
const movedCtl = designGap(designOut, (f) => readOr(DESIGN_AT + f), (f) => (f === designOut[0][0] ? null : readOr(f))).some((x) => x.startsWith('ไม่มีหน้าส่งต่อ'));
check('หน้าคำตัดสินเกมใต้ dev/ ครบทุกไฟล์ใน design/ ตรงของที่ build และที่เดิมเป็นหน้าส่งต่อ', designMiss.length || !designCtl || !movedCtl, ` ไฟล์ ${designFiles().length} · ${designOut.length} หน้า${designMiss.length ? ` · ${designMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${designCtl && movedCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7c) แถบบนชุดเดียวทุกหน้า: ทุกหน้าใต้ docs/ และ docs/spec/ (ยกเว้น play.html · archive/) มี marker ชุดเดียว เนื้อ = ที่ nav.mjs สร้างให้หน้านั้น (ชี้หน้าปัจจุบันถูก) · ไม่มีแถบเก่าค้าง
// อ่านรายชื่อหน้าจากโฟลเดอร์ ⇒ หน้าใหม่ที่ลืมวาง marker ตกเอง · ตัวควบคุม: ถอด marker · แถบของหน้าอื่น · แถบเก่าซ้อน ⇒ ต้องถูกจับทั้งสาม
const navFiles = [...readdirSync(docs).filter((n) => n.endsWith('.html') && n !== 'play.html' && !read(n).includes(MOVED_MARK)), ...readdirSync(new URL('spec/', docs)).filter((n) => n.endsWith('.html')).map((n) => `spec/${n}`)];
const navBad = (file, raw) => {
  const html = raw.replace(/\r\n/g, '\n');
  const b = navBlocks(html);
  if (b.count !== 1 || b.nav === null || b.css === null) return 'ไม่มีแถบ';
  if (b.nav !== navHtml(file) || b.css !== NAV_CSS) return 'แถบไม่ตรง';
  if (html.split('<nav class="top"').length !== 2 || /<nav class="site"/.test(html)) return 'แถบซ้อน';
  return '';
};
const navMiss = navFiles.map((f) => [f, navBad(f, read(f))]).filter(([, why]) => why).map(([f, why]) => `${f} ${why}`);
const navCtl =
  navBad('index.html', read('index.html').replace(/<!--NAV:START-->[\s\S]*?<!--NAV:END-->/, '')) === 'ไม่มีแถบ' &&
  navBad('worlds.html', read('about.html')) === 'แถบไม่ตรง' &&
  navBad('about.html', read('about.html').replace('<header>', '<nav class="top"><a href="index.html">หน้าแรก</a></nav><header>')) === 'แถบซ้อน';
const curOk = navHtml('catalog.html').includes('href="catalog.html" aria-current="page"') && !navHtml('index.html').includes('design') && navHtml('spec/lore-finance-series.html').includes('href="../play.html"');

// 7c2) แถบห้องผู้พัฒนา: หน้าเขียนมือใต้ docs/dev/ ที่มีแถบแท็บ มีครบทุกแท็บใน DEV_TABS (หน้าที่ build สร้างใช้ devNavHtml) · หน้าเรื่องคำตัดสินเกมชี้แท็บนั้น
// ตัวควบคุม: ถอดแท็บคำตัดสินเกมออกจากหน้าแรกของห้อง ⇒ ต้องถูกจับ
const devFiles = readdirSync(new URL('dev/', docs), { recursive: true }).map((f) => `dev/${f.replace(/\\/g, '/')}`).filter((f) => f.endsWith('.html'));
// อ่านเฉพาะบล็อกแท็บ — เนื้อหน้าสารบัญมีลิงก์ชื่อเดียวกันอยู่ด้วย
const devTabMiss = (html) => {
  const tabs = html.match(/<div class="nl-tabs"[\s\S]*?<\/div><\/div>/)?.[0] ?? '';
  return DEV_TABS.filter(([, t]) => !tabs.includes(`>${t}</a>`)).map(([, t]) => t);
};
const devMiss = devFiles.map((f) => [f, read(f)]).filter(([, h]) => h.includes('class="nl-tabs"')).map(([f, h]) => [f, devTabMiss(h)]).filter(([, m]) => m.length).map(([f, m]) => `${f} ขาด ${m.join(' ')}`);
const devCtl = devTabMiss(read('dev/index.html').replace(/<a href="[^"]*dev\/design\.html"[^>]*>คำตัดสินเกม<\/a>/, '')).length === 1;
const devCur = devNavHtml('dev/design-lore.html').includes('href="../dev/design.html" aria-current="true"') && devNavHtml('dev/design.html').includes('href="../dev/design.html" aria-current="page"');
// 7e) หน้าดีไซน์ UI (ui-redo 44): ตรงของที่ build ตอนนี้ · design.html เดิมส่งต่อมาที่นี่ · สีทุกตัวแปรในเกมขึ้นหน้า · ลิงก์ tweak ครบทุกหน้า tweak และปลายทางมีจริง
// · ชิ้นส่วนตัวอย่างอยู่ใน iframe sandbox ว่าง (ไม่มีสคริปต์ ไม่มี same-origin ⇒ แตะ localStorage ไม่ได้) และ srcdoc ไม่มี <script
// ตัวควบคุม: แก้สีในเกม 1 ค่า ⇒ หน้าที่ build ต้องเปลี่ยนและมีค่าใหม่ · ถอดลิงก์ tweak 1 ลิงก์ ⇒ ต้องนับขาด · เติม allow-scripts ⇒ ต้องถูกจับ
const uiTpl = readFileSync(new URL('../src/ui/template.html', import.meta.url), 'utf8');
const uiBuilt = (tpl) => designHtml(designTpl, uiPage(content, docs, tpl), UI_PAGE.slice(DESIGN_AT.length));
const uiNow = uiBuilt(uiTpl);
const uiHtml = readOr(UI_PAGE) ?? '';
const uiColors = cssVars(uiTpl.match(/<style>([\s\S]*?)<\/style>/)[1]).flatMap((g) => g.vars).filter(([, v]) => /^(#|rgba?\(|hsla?\()/i.test(v));
const uiTweaks = tweakPages(docs);
const uiTweakGap = (html) => {
  const box = html.match(/<ul id="ui-tweaks">([\s\S]*?)<\/ul>/)?.[1] ?? '';
  const hrefs = [...box.matchAll(/href="([^"]+)"/g)].map((m) => `dev/${m[1]}`);
  return [...uiTweaks.filter(([f]) => !hrefs.includes(f)).map(([f]) => `ขาดลิงก์ ${f}`), ...hrefs.filter((h) => !existsSync(new URL(h, docs))).map((h) => `ลิงก์ตาย ${h}`)];
};
const uiFrameBad = (html) => {
  const frames = [...html.matchAll(/<iframe[^>]*>/g)].map((m) => m[0]);
  return !frames.length || frames.some((f) => !/ sandbox=""/.test(f) || /&lt;script|<script/i.test(f));
};
const uiMiss = [
  ...(lf(uiHtml) !== lf(uiNow) ? [`ค้าง ${UI_PAGE}`] : []),
  ...(lf(readOr(UI_MOVED_FROM)) !== designMoved(UI_MOVED_FROM, '') ? [`${UI_MOVED_FROM} ไม่ส่งต่อมา ${UI_PAGE}`] : []),
  ...uiColors.filter(([, v]) => !uiHtml.includes(`background:${v}`)).map(([k]) => `ไม่มีสี ${k}`),
  ...uiTweakGap(uiHtml),
  ...(uiFrameBad(uiHtml) ? ['iframe ไม่ปิดสคริปต์'] : []),
];
const [uiK, uiV] = uiColors[0] ?? ['', ''];
const uiRecolor = uiBuilt(uiTpl.replace(`${uiK}:${uiV}`, `${uiK}:#010203`));
const uiCtl =
  uiRecolor !== uiNow && uiRecolor.includes('background:#010203') &&
  (uiTweaks.length === 0 || uiTweakGap(uiHtml.replace(/(<ul id="ui-tweaks">)<li>[\s\S]*?<\/li>/, '$1')).length === 1) &&
  uiFrameBad(uiHtml.replace(' sandbox=""', ' sandbox="allow-scripts"'));
check('หน้าดีไซน์ UI ตรงของที่ build สีจากเกมครบ ลิงก์ tweak ครบ ตัวอย่างไม่รันสคริปต์', uiMiss.length || !uiCtl, ` สี ${uiColors.length} · tweak ${uiTweaks.length}${uiMiss.length ? ` · ${uiMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${uiCtl ? 'จับได้' : 'จับไม่ได้'}`);
check('หน้าห้องผู้พัฒนามีแท็บครบชุดเดียวกัน', devMiss.length || !devCtl || !devCur, ` ${devFiles.length} หน้า${devMiss.length ? ` · ${devMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${devCtl ? 'จับได้' : 'จับไม่ได้'}`);
check('ทุกหน้ามีแถบบนชุดเดียวและชี้หน้าปัจจุบัน', navMiss.length || !navCtl || !curOk, ` ${navFiles.length} หน้า${navMiss.length ? ` · ${navMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${navCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7d) แผนงานหน้าแรก (ui-redo 23): แถวหมวดบน index = ชื่อหมวดของหัว "กำลังทำ" ใน whatsnew ตามลำดับ ไม่มีตัวเลข · ทุกลิงก์มี id ปลายทางในหน้า whatsnew
// · rel.mjs ยังเห็นว่าหัวกำลังทำแบ่งหมวด (หัวมี id แล้ว — guard ที่หาแค่ <h3> เปล่าจะหลุด)
// ตัวควบคุม: เติมหมวดใหม่ 1 หมวดใน whatsnew ⇒ กล่องที่คาดต้องเปลี่ยน · ถอด id หัวแรก ⇒ ลิงก์ต้องหาปลายทางไม่เจอ
const wn = read('whatsnew.html');
const roadCats = soonCats(wn);
const roadIn = (html) => { const a = html.indexOf(ROAD_START); const b = html.indexOf(ROAD_END); return a < 0 || b < a ? null : html.slice(a + ROAD_START.length, b); };
const roadNow = roadIn(read('index.html'));
const roadNoId = (w) => soonCats(w).filter((c) => !w.includes(`id="${c.id}"`)).map((c) => c.name);
const relSrc = readFileSync(new URL('../scripts/rel.mjs', import.meta.url), 'utf8');
const relSees = /\/<h3\[\\s>\]\//.test(relSrc);
const wnMore = wn.replace('<h2>แพตช์โน้ต</h2>', '<h3>หมวดทดสอบ</h3>\n  <ul>\n    <li>x</li>\n  </ul>\n\n  <h2>แพตช์โน้ต</h2>');
const roadCtl = roadmapHtml(soonCats(wnMore)) !== roadNow && roadNoId(wn.replace(`<h3 id="${roadCats[0]?.id}">`, '<h3>')).length === 1;
const roadBad = [!roadCats.length && 'whatsnew ไม่มีหมวดใต้กำลังทำ', roadNow !== roadmapHtml(roadCats) && 'กล่องบน index ไม่ตรง whatsnew (build ใหม่)', roadNoId(wn).length && `หัวไม่มี id: ${roadNoId(wn).join(' ')}`, !relSees && 'rel.mjs guard ไม่เห็นหัวที่มี id', /\d/.test((roadNow ?? '').replace(/<[^>]+>/g, '')) && 'แถวมีตัวเลข'].filter(Boolean);
check('แผนงานหน้าแรกตรงหมวดกำลังทำใน whatsnew และลิงก์ถึงหัวหมวด', roadBad.length || !roadCtl, ` ${roadCats.length} หมวด${roadBad.length ? ` · ${roadBad.join(' | ')}` : ''} · ตัวควบคุม${roadCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7d) หน้าโลกที่เล่นได้ (three-worlds 08): บอกแค่ทางที่ผู้เล่นเห็นบนจอเสมอ — ทางลับที่เป็นเหตุสุ่ม (ทริปศาลทั้งตัว court.mjs) ห้ามมีแม้แต่คำ
// · ทางเกิดครบทุกทางจาก PATHS · แผนภาพ 3 กล่องไม่มีป้ายบนลูกศร (svg มีแค่ <text> ชื่อฉาก) · ลิงก์ไปหน้าต่างโลก
// ตัวควบคุม: เติมคำทางลับ 1 คำ · ป้ายบนลูกศร 1 ป้าย ⇒ ต้องถูกจับ
const SECRET_TALK = /เฉียดตาย|เกือบตาย|เรียกตัว|ศาลยม|ผู้ลงทัณฑ์|โกงความตาย/;
const WORLD_NAMES = ['ชาตินี้', 'ปรโลก', 'ต่างโลก'];
const worldsBad = (html) => {
  const why = [];
  if (SECRET_TALK.test(html)) why.push(`คำทางลับ "${html.match(SECRET_TALK)[0]}"`);
  const svg = html.match(/<svg[\s\S]*?<\/svg>/)?.[0] ?? '';
  const labels = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  if (labels.length !== 3 || !WORLD_NAMES.every((n) => labels.includes(n))) why.push(`แผนภาพ: ${labels.join(' ') || 'ไม่มี'}`);
  const pathsMiss = Object.keys(facts).filter((k) => /^path[A-Z]/.test(k) && !html.includes(`data-fact="${k}"`));
  if (pathsMiss.length) why.push(`ทางเกิดขาด ${pathsMiss.join(' ')}`);
  if (!html.includes('href="otherworld.html')) why.push('ไม่ลิงก์หน้าต่างโลก');
  return why;
};
const worldsHtml = read('worlds.html');
const worldsMiss = worldsBad(worldsHtml);
const worldsCtl = worldsBad(worldsHtml.replace('</main>', '<p>เฉียดตาย</p></main>')).length === 1 && worldsBad(worldsHtml.replace('</svg>', '<text>ตาย</text></svg>')).length === 1;
check('หน้าโลกที่เล่นได้: ไม่มีคำทางลับ · แผนภาพ 3 กล่องไม่มีป้ายลูกศร · ทางเกิดครบ · ลิงก์ต่างโลก', worldsMiss.length || !worldsCtl, `${worldsMiss.length ? ` · ${worldsMiss.join(' | ')}` : ''} · ตัวควบคุม${worldsCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 8) คู่มือ (B121): ป้ายปุ่มทุกตัวในค่ากลางขึ้นคู่มือพร้อมคำอธิบาย · หน้าจอเกมไม่เขียนป้ายเหล่านั้นตรงซ้ำ (ไม่งั้นแก้ค่ากลางแล้วเกมไม่ตาม)
const guide = read('guide.html');
const appSrc = readFileSync(new URL('../src/ui/app.mjs', import.meta.url), 'utf8');
const literal = (src) => Object.values(BTN).filter((v) => src.includes(`button('${v}'`));
const noGuide = Object.entries(BTN).filter(([k, v]) => !guide.includes(`<b class="btn">${v}</b>`) || !BTN_HELP[k]);
// ตัวควบคุม: ซอร์สที่เขียนป้ายตรงต้องถูกจับ
const litCaught = literal(`button('${BTN.next}', null, f)`).length === 1;
check('คู่มือมีป้ายปุ่มจากค่ากลางครบ และเกมไม่เขียนป้ายซ้ำ', noGuide.length || literal(appSrc).length || !litCaught, ` ปุ่ม ${Object.keys(BTN).length - noGuide.length}/${Object.keys(BTN).length}${literal(appSrc).length ? ` · เขียนตรง: ${literal(appSrc).join(' ')}` : ''} · ตัวควบคุม${litCaught ? 'จับได้' : 'จับไม่ได้'}`);

// 9) เลขรุ่นในเกมลิงก์แพตช์โน้ต (B121): text fragment เลื่อนไปที่คำแรกที่ตรง ⇒ เลขรุ่นแต่ละตัวต้องโผล่ครั้งแรกที่หัวข้อของรุ่นนั้น
const play = read('play.html');
const notes = read('whatsnew.html');
const vers = [...notes.matchAll(/<h3>(v\d+\.\d+\.\d+)/g)].map((m) => [m[1], m.index + 4]);
const early = vers.filter(([v, at]) => notes.search(new RegExp(`${v.replace(/\./g, '\\.')}(?!\\d)`)) !== at).map(([v]) => v);
check('เลขรุ่นในเกมเป็นลิงก์แพตช์โน้ต และหัวข้อแต่ละรุ่นเป็นจุดแรกที่เลขนั้นโผล่', !play.includes('whatsnew.html#:~:text=') || !play.includes('<a id="appVer"') || !vers.length || early.length, ` ${vers.length} รุ่น${early.length ? ` · โผล่ก่อนหัวข้อ: ${early.slice(0, 5).join(' ')}` : ''}`);

// 9a) เลขเวอร์ชันมีที่เดียว (src/version.json): ซอร์สอื่นใต้ src/ ไม่ถือเลข ไม่งั้น bump ต้องแก้หลายไฟล์และชนกันตอน merge · เกมที่ build แล้วใช้เลขจากไฟล์นั้น
// ตัวควบคุม: ใส่บรรทัดเลขกลับใน app.mjs · เกมที่ build จากเลขอื่น ⇒ ต้องถูกจับทั้งคู่
const ver = readVersion();
const verRe = new RegExp(`APP_(?:VERSION|BUILD)\\s*=\\s*['"\`]|${ver.version.replace(/\./g, '\\.')}(?!\\d)`);
const srcRoot = new URL('../src/', import.meta.url);
const srcFiles = readdirSync(srcRoot, { recursive: true }).map((f) => f.replace(/\\/g, '/')).filter((f) => /\.(mjs|html)$/.test(f));
const verHeld = (files) => files.filter(([, text]) => verRe.test(text)).map(([f]) => f);
const srcTexts = srcFiles.map((f) => [f, readFileSync(new URL(f, srcRoot), 'utf8')]);
const held = verHeld(srcTexts);
const playVer = (html, v) => html.includes(versionLines(v));
const verCtl = verHeld([['ui/app.mjs', `${appSrc}\nconst APP_VERSION = '${ver.version}';`]]).length > 0 && !playVer(play, { ...ver, version: 'v0.0.00' });
check('เลขเวอร์ชันอยู่ที่ src/version.json ที่เดียว และเกมใช้เลขนั้น', held.length || !playVer(play, ver) || !verCtl, ` ${ver.version} · ${ver.build} · ซอร์ส ${srcTexts.length} ไฟล์${held.length ? ` · ถือเลขเอง: ${held.join(' ')}` : ''}${playVer(play, ver) ? '' : ' · play.html ไม่ได้ build จากเลขนี้'} · ตัวควบคุม${verCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 9c) แจ้งอัปเดตในเกม (ui-redo 22): เกมที่ build แล้วฝังรุ่นที่มีโน้ตชุดเดียวกับแพตช์โน้ต · ข้อความไม่มีแท็ก/entity หลุด และไม่ยาวเกินเพดานตัด
// รุ่นปัจจุบันไม่มีโน้ต (bump ของเลน) = เตือน ไม่ตก — แผ่นใช้รุ่นล่าสุดที่มีโน้ต
// ตัวควบคุม: ล้างข้อของรุ่นบนสุดใน whatsnew ⇒ รุ่นนั้นต้องหลุดจากชุด และชุดที่ได้ต้องไม่ตรงที่ฝัง
const wnNow = read('whatsnew.html');
const notesLog = releaseLog(wnNow);
const notesIn = (html, log) => html.includes(notesLines(log));
const notesDirty = notesLog.flatMap((r) => r.items).filter((t) => /[<>]|&[#\w]+;/.test(t) || t.length > NOTE_CUT);
const topV = notesLog[0]?.v;
const wnEmptied = topV ? wnNow.replace(new RegExp(`(<h3>${topV.replace(/\./g, '\\.')} <small>[^<]*</small></h3>\\s*<ul>)[\\s\\S]*?(</ul>)`), '$1$2') : wnNow;
const cutLog = releaseLog(wnEmptied);
const notesCtl = !!topV && cutLog[0]?.v !== topV && !notesIn(play, cutLog);
if (topV !== ver.version) console.log(`  ⚠ ${ver.version} ไม่มีข้อในแพตช์โน้ต — แผ่นแจ้งอัปเดตใช้ ${topV ?? '(ไม่มีรุ่นไหนมีโน้ต)'} (เตือน ไม่ตก)`);
check('แจ้งอัปเดตในเกม: เกมฝังรุ่นที่มีโน้ตชุดเดียวกับแพตช์โน้ต ข้อความล้วนไม่เกินเพดาน', !notesLog.length || !notesIn(play, notesLog) || notesDirty.length || !notesCtl, ` ${notesLog.length} รุ่น · ล่าสุด ${topV} ${notesLog[0]?.items.length ?? 0} ข้อ${notesIn(play, notesLog) ? '' : ' · play.html ไม่ได้ build จากแพตช์โน้ตนี้'}${notesDirty.length ? ` · ข้อความไม่สะอาด ${notesDirty.length}: ${notesDirty[0].slice(0, 60)}` : ''} · ตัวควบคุม${notesCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 9a2) ภาพฉากสำคัญ (ui-redo 31): ทุกชิ้นของทุกฉากเป็น path จริง (ลืม ... กับตัวช่วยที่คืนหลายชิ้น = ชิ้นนั้นหายจากภาพเงียบ ๆ) · การ์ดที่ผูกใน SCENE_OF มีอยู่จริง · ฉากที่ผูกมีภาพ
// ตัวควบคุม: id การ์ดปลอม 1 ตัว · ชิ้นภาพซ้อน array 1 ชิ้น ⇒ ต้องถูกจับ
const sceneMap = [...(appSrc.match(/const SCENE_OF = new Map\(\[([\s\S]*?)\]\);/)?.[1] ?? '').matchAll(/\['([\w-]+)', '([\w-]+)'\]/g)].map((m) => [m[1], m[2]]);
const sceneUsed = [...sceneMap.map(([, v]) => v), ...(appSrc.match(/const BIRTH_SCENE = \[([^\]]*)\]/)?.[1] ?? '').match(/[\w-]+/g) ?? [], ...[...appSrc.matchAll(/sceneSvg\(gone \? '([\w-]+)' : '([\w-]+)'/g)].flatMap((m) => [m[1], m[2]])];
const ENGINE_CARDS = ['early_retire'];
const sceneBadParts = (ids, get) => ids.filter((id) => !get(id) || get(id).parts.some((x) => !x || typeof x.d !== 'string'));
const sceneNoCard = (pairs, evs) => pairs.filter(([id]) => !evs.has(id) && !ENGINE_CARDS.includes(id)).map(([id]) => id);
const evIds = new Set(content.events.map((e) => e.id));
const sceneMiss = [...sceneBadParts([...new Set(sceneUsed)], sceneArt).map((id) => `ภาพ ${id} พัง/ไม่มี`), ...sceneNoCard(sceneMap, evIds).map((id) => `ไม่มีการ์ด ${id}`)];
const sceneCtl = sceneNoCard([...sceneMap, ['no_such_card', 'death']], evIds).includes('no_such_card') && sceneBadParts(['death'], () => ({ parts: [...sceneArt('death').parts, [sceneArt('death').parts[0]]] })).length === 1;
check('ภาพฉากสำคัญ: ทุกชิ้นวาดได้ · การ์ดที่ผูกมีจริง', sceneMiss.length || sceneMap.length < 5 || !sceneCtl, ` ${ART_SCENE_IDS.length} ภาพ · ผูก ${sceneMap.length} การ์ด + แรกเกิด + การ์ดตาย${sceneMiss.length ? ` · ${sceneMiss.join(' | ')}` : ''} · ตัวควบคุม${sceneCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 9b) เกมเปิดออฟไลน์ได้: ฟอนต์ฝังครบทุกแบบที่หน้าใช้ ไม่ดึงจากเว็บอื่น · ตัวควบคุม: หน้าที่ยังมี <link> Google Fonts ต้องถูกจับ
const PLAY_FACES = ['Noto Sans Thai 400', 'Noto Sans Thai 600', 'Sarabun 400', 'Sarabun 600', 'Srisakdi 700'];
const fontGap = (html) => [
  ...PLAY_FACES.filter((f) => { const [, fam, w] = /^(.+) (\d+)$/.exec(f); return !new RegExp(`@font-face \\{ font-family:"${fam}"; font-weight:${w};[^}]*src:url\\(data:font/woff2;base64,[A-Za-z0-9+/]{1000}`).test(html); }),
  ...(/fonts\.(googleapis|gstatic)\.com/.test(html) ? ['ดึง Google Fonts'] : []),
];
const fontMiss = fontGap(play);
const fontCtl = fontGap(play.replace('<style>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sarabun"><style>')).length > 0;
check('เกมฝังฟอนต์ไทยครบ ไม่ดึงฟอนต์จากเว็บอื่น', fontMiss.length || !fontCtl, ` ${PLAY_FACES.length - fontMiss.filter((x) => PLAY_FACES.includes(x)).length}/${PLAY_FACES.length} แบบ${fontMiss.length ? ` · ขาด ${fontMiss.join(' ')}` : ''} · ตัวควบคุม${fontCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 10) เดโมการ์ดบนหน้ารวมการ์ด (B121): ทุกทางมีผลให้อ่าน มีข้อความผลจริงอย่างน้อยหนึ่งทาง ไม่แตะ storage/network · build ซ้ำได้หน้าเดิม
const demo = cards.slice(cards.indexOf(DEMO_START), cards.indexOf(DEMO_END));
const res = [...demo.matchAll(/data-res="([^"]*)"/g)].map((m) => m[1]);
const real = res.filter((r) => !r.startsWith('ผลลงที่ค่าสถานะ')).length;
const touches = /localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest/.test(demo);
const same = cards.includes(demoHtml(content));
// B133 สายเรื่องต่อ: ทุกขั้นมีทางที่กดได้และทุกทางมีผล · ปลายทางของทุกปุ่มมีขั้นนั้นจริง · ทุกขั้นที่ซ่อนมีปุ่มพาไปถึง · มีเรื่องต่ออย่างน้อยหนึ่งทาง
const steps = [...demo.matchAll(/<div class="tstep" data-step="(\d+)"[^>]*>([\s\S]*?)<p class="tres"/g)].map((m) => ({ id: m[1], btns: [...m[2].matchAll(/<button [^>]*>/g)].map((b) => b[0]) }));
const live = (s) => s.btns.filter((b) => !b.includes('data-lock'));
const gos = steps.flatMap((s) => live(s).map((b) => b.match(/data-go="(\d+)"/)?.[1]).filter(Boolean));
const stepIds = new Set(steps.map((s) => s.id));
const broken = [
  ...steps.filter((s) => !live(s).length || live(s).some((b) => !/data-res="[^"]+"/.test(b))).map((s) => `ขั้น ${s.id} มีทางไม่มีผล`),
  ...gos.filter((g) => !stepIds.has(g)).map((g) => `ชี้ขั้น ${g} ที่ไม่มี`),
  ...steps.slice(1).filter((s) => !gos.includes(s.id)).map((s) => `ขั้น ${s.id} ไปไม่ถึง`),
];
check('เดโมการ์ดหน้ารวมการ์ดกดได้ครบทุกทาง ไม่แตะเซฟ', res.length < 3 || res.some((r) => !r) || !real || touches || !same || !steps.length || live(steps[0]).length < 3, ` ทาง ${res.length} · ข้อความผลจริง ${real}${touches ? ' · แตะ storage/network' : ''}${same ? '' : ' · build ใหม่แล้วหน้าเปลี่ยน (ยังไม่ได้ build?)'}`);
check('เดโมการ์ดหน้ารวมการ์ดมีเรื่องต่อ และกดไปได้ถึงทุกขั้น', !gos.length || broken.length, ` ขั้น ${steps.length} · ทางที่มีเรื่องต่อ ${gos.length}${broken.length ? ` · ${broken.slice(0, 3).join(' · ')}` : ''}`);

// 11) หน้าเฉลยไม่ตัดเงื่อนไขทิ้งเงียบ: ถอด key ใน when / multipliers / requires ที่ content ใช้จริงออกทีละตัว ⇒ การ์ดบนหน้าเฉลยต้องเปลี่ยน
// วัดจากผลวาดแทนรายการชื่อ key — รายการเขียนมือจะไม่ตามตัวสร้าง · key ที่ตั้งใจไม่เฉลยใส่ SPOILER_SKIP พร้อมเหตุผล
const SPOILER_SKIP = new Set([]);
const fNames = flagNames();
const sNames = systemNames();
const drawn = (e) => {
  try {
    const html = spoilersHtml({ ...content, events: [e] }, fNames, sNames);
    return html.slice(html.indexOf('<article'), html.indexOf('</article>'));
  } catch (err) {
    return `throw ${err.message}`;
  }
};
const without = (obj, path) => {
  const out = structuredClone(obj);
  const parent = path.slice(0, -1).reduce((o, k) => o[k], out);
  if (Array.isArray(parent)) parent.splice(path.at(-1), 1);
  else delete parent[path.at(-1)];
  return out;
};
// เส้นทางที่ถอดได้: key ชั้นแรกของ when / multipliers / requires + key ย่อยของ flags · family[] · loss · stats ที่ตัวสร้างต้องแยกวาด
const probes = (e) => {
  const out = [];
  const walk = (node, at, label, deep) => {
    for (const [k, v] of Object.entries(node ?? {})) {
      out.push([[...at, k], `${label}.${k}`]);
      if (!deep.includes(k) || !v || typeof v !== 'object') continue;
      if (Array.isArray(v)) v.forEach((x, i) => Object.keys(x).forEach((kk) => out.push([[...at, k, i, kk], `${label}.${k}[].${kk}`])));
      else if (k === 'stats') Object.entries(v).forEach(([s, b]) => typeof b === 'object' && Object.keys(b).forEach((kk) => out.push([[...at, k, s, kk], `${label}.${k}.*.${kk}`])));
      else Object.keys(v).forEach((kk) => out.push([[...at, k, kk], `${label}.${k}.${kk}`]));
    }
  };
  walk(e.when, ['when'], 'when', ['flags', 'family', 'loss', 'stats']);
  walk(e.multipliers, ['multipliers'], 'multipliers(การ์ด)', []);
  e.choices.forEach((c, i) => {
    walk(c.requires, ['choices', i, 'requires'], 'requires', ['flags', 'family', 'stats']);
    walk(c.multipliers, ['choices', i, 'multipliers'], 'multipliers(ตัวเลือก)', []);
    (c.outcomes ?? []).forEach((o, j) => walk(o.multipliers, ['choices', i, 'outcomes', j, 'multipliers'], 'multipliers(ผล)', []));
  });
  return out;
};
const silent = (events) => {
  const miss = new Map();
  for (const e of events) {
    const base = drawn(e);
    for (const [path, label] of probes(e)) {
      if (SPOILER_SKIP.has(label) || drawn(without(e, path)) !== base) continue;
      if (!miss.has(label)) miss.set(label, new Set());
      miss.get(label).add(e.id);
    }
  }
  return miss;
};
const missing = silent(content.events);
// ตัวควบคุม: key ปลอมทุกชั้นต้องถูกจับ — กันด่านที่ผ่านเพราะไม่ได้ถอดอะไรเลย
const fake = structuredClone(content.events.find((e) => e.choices.some((c) => c.outcomes?.length)));
const fc = fake.choices.find((c) => c.outcomes?.length);
fake.when = { ...fake.when, zz_fake: 1 };
fake.multipliers = { ...fake.multipliers, zz_fake: 2 };
fc.requires = { ...fc.requires, zz_fake: 1 };
fc.outcomes[0].multipliers = { ...fc.outcomes[0].multipliers, zz_fake: 2 };
const fakeMiss = silent([fake]);
const fakeCaught = ['when.zz_fake', 'multipliers(การ์ด).zz_fake', 'requires.zz_fake', 'multipliers(ผล).zz_fake'].every((k) => fakeMiss.has(k));
const missLines = [...missing].map(([k, ids]) => `${k} ${ids.size} ใบ เช่น ${[...ids].slice(0, 3).join(',')}`);
check('หน้าเฉลยวาดทุกเงื่อนไขและตัวคูณที่การ์ดใช้', missing.size || !fakeCaught, ` key ไม่ขึ้นหน้า ${missing.size}${missLines.length ? `: ${missLines.join(' | ')}` : ''} · ตัวควบคุม${fakeCaught ? 'จับได้' : 'จับไม่ได้'}`);

console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
