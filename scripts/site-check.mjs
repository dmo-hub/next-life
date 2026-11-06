// ด่านหน้าเว็บ (B65): ตัวเลขบนหน้าเท่าค่าจริง · build ใหม่แล้วเลขเปลี่ยนตามข้อมูล (ตัวควบคุม) · ลิงก์ในเว็บไม่ตาย
// · หน้ารวมการ์ดไม่มีผล/บุญบาป/น้ำหนัก · ทุกการ์ดใน content อยู่บนหน้ารวมการ์ด
// · ส่วนต่างโลก (B88b) ทั้งสองหน้าครบทุกการ์ด · หน้ารวมการ์ดไม่มีผลสำเร็จ/พลาด ความยาก หรือตอนจบ
// · หน้าเฉลย (B88) ครบทุกการ์ด/ตัวเลือก/ผลสุ่ม และเฉลยจริง — กฎ "ไม่หลุดบุญบาป" ของหน้ารวมการ์ดไม่ใช้กับหน้านี้
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { loadContent } from '../src/node/load.mjs';
import { siteFacts, injectFacts, readVersion, versionLines, releaseLog, notesLines, NOTE_CUT } from '../src/site/facts.mjs';
import { catalogHtml } from '../src/site/catalog.mjs';
import { FACT_PAGES, GEN_PAGES, toLf } from '../src/site/build.mjs';
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
import { uiPage, designMoved, tweakPages, tweakMoved, tweakStatus, cssVars, liveMoved, UI_PAGE, UI_MOVED_FROM, UI_LIVE_ID, UI_LIVE_FROM, UI_LIVE_TITLE } from '../src/site/ui.mjs';
import { soonCats, roadmapHtml, ROAD_START, ROAD_END } from '../src/site/roadmap.mjs';
import { sceneArt, ART_SCENE_IDS } from '../src/ui/art.mjs';
import { GAME_CSS_PAGES, gameCss, gameCssBlock } from '../src/site/game-css.mjs';
import { gatedFiles, gateBlock, gateBlockOf, injectGate, readGateHash, GATE_OPEN, GATE_OFF, PUBLIC_HIDE } from '../src/site/gate.mjs';
import { SITE, SEO_START, SEO_END, OG_IMAGE, OG_W, OG_H, FAVICON_SVG, FAVICON_PNG, TOUCH_ICON, SITEMAP, seoBlock, pageMeta, sitemapXml } from '../src/site/seo.mjs';
import { DOCS_TWEAK_PAGE, DOCS_TWEAK_START, docsTweakData, docsTweakBlock, injectDocsLayout, injectDocsTweak, pageKind } from '../src/site/docs-tweak.mjs';
import { CARD_ART_PAGE, cardArtData, cardArtBlock, CAT_ART } from '../src/site/card-art-tweak.mjs';
import { CARD_SPOIL_PAGE, cardSpoilData, cardSpoilBlock } from '../src/site/card-spoil-tweak.mjs';
import { FONTS, FONT_DIR, FONT_CSS, PLAY_FACES, fontsCss, playFonts } from '../src/site/fonts.mjs';
import { PLAY_FILES, playAssets, playScripts, swJs } from '../src/site/play-files.mjs';

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
// ฉายาย้ายจากหน้าแรกไปกลไกในเกม (ui-redo 69) · เลขการ์ดเหลือแค่หน้ารวมการ์ดหลังหน้าแรกเหลือแค่หัว (ui-redo 105) ⇒ ตรวจหลายหน้ารวมกัน
const probe = ['index.html', 'about.html', 'catalog.html'].map((p) => injectFacts(read(p), f2)).join('');
const moved = ['cards', 'titles'].every((k) => probe.includes(`data-fact="${k}">${f2[k]}<`) && f2[k] !== facts[k]);
check('ตัวควบคุม: ข้อมูลเปลี่ยนแล้วเลขบนหน้าเปลี่ยนตาม', !moved, ` (การ์ด ${facts.cards} → ${f2.cards} · ฉายา ${facts.titles} → ${f2.titles})`);

// 3) ลิงก์ภายในเว็บไม่ตาย (ไฟล์ · รูป · ที่มาจากหน้าใน docs/ และ docs/spec/ ที่หน้าเว็บลิงก์ถึง)
const all = [...pages, 'dev/tweak/cards', 'whatsnew', 'archive/cards-v1', 'archive/overview-v1', 'dev/index', 'dev/spec'];
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
// หน้าที่ build เขียนได้กล่องรหัสต่อท้ายเสมอ (ui-redo 72) ⇒ ของคาดหวังต้องผ่าน injectGate ชุดเดียวกัน
const gateHash = readGateHash();
const gated = (html, file) => injectGate(injectDocsLayout(html, pageKind(file), file), gateHash, file);
// หน้าอยู่ใต้ DESIGN_AT · ที่เดิมใต้ docs/ ต้องเป็นหน้าส่งต่อไปหน้าใหม่ (ui-redo 43) — หน้าส่งต่อไม่นับเป็น "เกิน"
const readOr = (p) => (existsSync(new URL(p, docs)) ? read(p) : null);
const designGap = (out, readPage, readOld = readOr) => [
  ...designFiles().filter((f) => !readPage(designPage(f))?.includes(`<details class="doc" id="${docId(f)}"`)).map((f) => `ไม่มี ${f}`),
  ...out.filter(([f, pg]) => lf(readPage(f)) !== lf(gated(designHtml(designTpl, pg, f), DESIGN_AT + f))).map(([f]) => `ค้าง ${f}`),
  ...out.filter(([f, pg]) => lf(readOld(f)) !== designMoved(f, pg.title)).map(([f]) => `ไม่มีหน้าส่งต่อ ${f}`),
  // หน้าเรื่องที่ถูกรวม/ลบแล้วยังค้าง ทั้งที่ใหม่และที่เดิม
  ...readdirSync(new URL(DESIGN_AT, docs)).filter((n) => /^design-.+\.html$/.test(n) && !out.some(([f]) => f === n)).map((n) => `เกิน ${DESIGN_AT}${n}`),
  ...readdirSync(docs).filter((n) => /^design-.+\.html$/.test(n) && !out.some(([f]) => f === n)).map((n) => `เกิน ${n}`),
];
const designMiss = designGap(designOut, (f) => readOr(DESIGN_AT + f));
const cutFirst = designOut.map(([f, pg], i) => [f, i ? pg : { ...pg, body: pg.body.replace(/<details class="doc"[\s\S]*?<\/details>/, '') }]);
const designCtl = designGap(designOut, (f) => gated(designHtml(designTpl, cutFirst.find(([x]) => x === f)[1], f), DESIGN_AT + f)).length >= 2;
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
const uiBuilt = (tpl) => gated(designHtml(designTpl, uiPage(content, docs, tpl), UI_PAGE.slice(DESIGN_AT.length)), UI_PAGE);
const uiNow = uiBuilt(uiTpl);
const uiHtml = readOr(UI_PAGE) ?? '';
const uiColors = cssVars(uiTpl.match(/<style>([\s\S]*?)<\/style>/)[1]).flatMap((g) => g.vars).filter(([, v]) => /^(#|rgba?\(|hsla?\()/i.test(v));
const uiTweaks = tweakPages(docs);
// หน้า tweak เป็นหัวในหน้านี้ (ui-redo 79): ทุกหน้าใต้ dev/tweak/ มีลิงก์ในสารบัญ · หัว · กรอบที่ชี้ไฟล์และไม่มี sandbox (คีย์ localStorage เดิม) · ที่เดิมเป็นหน้าส่งต่อมาหัว
const uiTweakGap = (html) => {
  const box = html.match(/<ul id="ui-tweaks">([\s\S]*?)<\/ul>/)?.[1] ?? '';
  const frame = (f) => html.match(new RegExp(`<iframe[^>]* src="${f.slice(4)}"[^>]*>`))?.[0];
  return uiTweaks.flatMap((t) => {
    const [f, , id, from] = t;
    return [
      ...(box.includes(`href="#${id}"`) ? [] : [`ขาดลิงก์ ${id}`]),
      ...(html.includes(`<h2 id="${id}">`) ? [] : [`ขาดหัว ${id}`]),
      ...(!frame(f) ? [`ขาดกรอบ ${f}`] : /sandbox/.test(frame(f)) ? [`กรอบมี sandbox ${f}`] : []),
      ...(lf(readOr(from)) !== tweakMoved(t) ? [`${from} ไม่ส่งต่อมา #${id}`] : []),
    ];
  });
};
// แถวในสารบัญห้องผู้พัฒนาที่ชี้หัว tweak (ui.html#ui-t-*) ต้องมีหน้าจริงใต้ dev/tweak/ — ลบหน้า tweak ที่ลงเกมแล้วต้องเอาแถวออกด้วย ไม่งั้นลิงก์ไปหัวที่ไม่มี
const devRowGap = (indexHtml) => Object.keys(tweakStatus(docs, indexHtml)).filter((id) => id.startsWith('ui-t-') && !uiTweaks.some((t) => t[2] === id)).map((id) => `dev/index ชี้หัวที่ไม่มีหน้า #${id}`);
const uiFrameBad = (html) => {
  // กรอบต้นแบบปรับสด (7e2) และกรอบหน้า tweak (src=) ตั้งใจรันสคริปต์ — ด่านนี้ดูแค่ชิ้นส่วนตัวอย่าง
  const frames = [...html.matchAll(/<iframe[^>]*>/g)].map((m) => m[0]).filter((f) => !f.includes(`title="${UI_LIVE_TITLE}"`) && !f.includes(' src="'));
  return !frames.length || frames.some((f) => !/ sandbox=""/.test(f) || /&lt;script|<script/i.test(f));
};
const uiMiss = [
  ...(lf(uiHtml) !== lf(uiNow) ? [`ค้าง ${UI_PAGE}`] : []),
  ...(lf(readOr(UI_MOVED_FROM)) !== designMoved(UI_MOVED_FROM, '') ? [`${UI_MOVED_FROM} ไม่ส่งต่อมา ${UI_PAGE}`] : []),
  ...uiColors.filter(([, v]) => !uiHtml.includes(`background:${v}`)).map(([k]) => `ไม่มีสี ${k}`),
  ...uiTweakGap(uiHtml),
  ...devRowGap(),
  ...(uiFrameBad(uiHtml) ? ['iframe ไม่ปิดสคริปต์'] : []),
];
const [uiK, uiV] = uiColors[0] ?? ['', ''];
const uiRecolor = uiBuilt(uiTpl.replace(`${uiK}:${uiV}`, `${uiK}:#010203`));
const uiCtl =
  uiRecolor !== uiNow && uiRecolor.includes('background:#010203') &&
  (uiTweaks.length === 0 || uiTweakGap(uiHtml.replace(`<h2 id="${uiTweaks[0][2]}">`, '<h2>')).length === 1) &&
  uiFrameBad(uiHtml.replace(' sandbox=""', ' sandbox="allow-scripts"')) &&
  devRowGap((readOr('dev/index.html') ?? '').replace('<ul', '<ul><li><a href="ui.html#ui-t-gone">x</a></li>')).length === 1;
check('หน้าดีไซน์ UI ตรงของที่ build สีจากเกมครบ ลิงก์ tweak ครบ ตัวอย่างไม่รันสคริปต์', uiMiss.length || !uiCtl, ` สี ${uiColors.length} · tweak ${uiTweaks.length}${uiMiss.length ? ` · ${uiMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${uiCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7e2) ต้นแบบปรับสด (ui-redo 76): หัวในหน้าดีไซน์ UI มีกรอบที่รันสคริปต์ได้และไม่มี sandbox (sandbox ไม่มี allow-same-origin ⇒ localStorage throw ค่าที่เจ้าของปรับไว้หาย)
// · สคริปต์ยังจำค่าใต้คีย์เดิมและคัดลอกลง clipboard · tweak.html เดิมเป็นหน้าส่งต่อมาหัวนี้ · ไม่มีลิงก์/แท็บชี้ tweak.html เดิมเหลือ
// ตัวควบคุม: ถอดหัวออก ⇒ ต้องตก · ใส่ sandbox="allow-scripts" ⇒ ต้องตก
const liveBad = (html) => {
  const h = html.indexOf(`<h2 id="${UI_LIVE_ID}">`);
  const open = `<iframe title="${UI_LIVE_TITLE}"`;
  const a = h < 0 ? -1 : html.indexOf(open, h);
  const s = a < 0 ? -1 : html.indexOf(' srcdoc="', a);
  if (s < 0) return ['ไม่มีหัวต้นแบบปรับสด'];
  const doc = html.slice(s + 9, html.indexOf('"', s + 9)).replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  return [
    ...(html.slice(a, s).includes('sandbox') ? ['กรอบต้นแบบมี sandbox'] : []),
    ...(doc.includes("const KEY = 'uiredo02-tweak'") ? [] : ['คีย์ localStorage เปลี่ยน']),
    ...(doc.includes('navigator.clipboard.writeText') ? [] : ['ไม่มีคัดลอก']),
  ];
};
const liveLinks = [...devFiles, ...readdirSync(docs).filter((n) => n.endsWith('.html'))].filter((f) => !read(f).includes(MOVED_MARK) && [UI_LIVE_FROM, ...uiTweaks.map((t) => t[3])].some((o) => read(f).includes(o.startsWith('dev/') ? `${o.slice(4)}"` : `"${'../'.repeat(f.split('/').length - 1)}${o}"`)));
const liveMiss = [
  ...liveBad(uiHtml),
  ...(lf(readOr(UI_LIVE_FROM)) !== liveMoved() ? [`${UI_LIVE_FROM} ไม่ส่งต่อมา ${UI_PAGE}#${UI_LIVE_ID}`] : []),
  ...liveLinks.map((f) => `${f} ยังลิงก์หน้า tweak ที่เดิม`),
  ...(DEV_TABS.some(([h]) => h === UI_LIVE_FROM) ? ['แท็บ dev ยังมี tweak.html'] : []),
];
const liveCtl =
  liveBad(uiHtml.replace(`<h2 id="${UI_LIVE_ID}">`, '<h2>')).length > 0 &&
  liveBad(uiHtml.replace(`<iframe title="${UI_LIVE_TITLE}"`, `<iframe title="${UI_LIVE_TITLE}" sandbox="allow-scripts"`)).includes('กรอบต้นแบบมี sandbox');
check('ต้นแบบปรับสดอยู่ในหน้าดีไซน์ UI รันสคริปต์ จำค่าคีย์เดิม คัดลอกได้ ที่เดิมส่งต่อ', liveMiss.length || !liveCtl, `${liveMiss.length ? ` ${liveMiss.slice(0, 4).join(' | ')} ·` : ''} ตัวควบคุม${liveCtl ? 'จับได้' : 'จับไม่ได้'}`);
check('หน้าห้องผู้พัฒนามีแท็บครบชุดเดียวกัน', devMiss.length || !devCtl || !devCur, ` ${devFiles.length} หน้า${devMiss.length ? ` · ${devMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${devCtl ? 'จับได้' : 'จับไม่ได้'}`);
check('ทุกหน้ามีแถบบนชุดเดียวและชี้หน้าปัจจุบัน', navMiss.length || !navCtl || !curOk, ` ${navFiles.length} หน้า${navMiss.length ? ` · ${navMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${navCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7c3) หน้า tweak ที่ใช้ CSS เกม (thai-life-deep 185): บล็อกในหน้า = CSS ของ template.html ตอนนี้ — แก้ CSS เกมแล้วลืม build = หน้า tweak โชว์หน้าตาเก่า
// ตัวควบคุม: CSS ที่ต่างไป 1 ตัวอักษรต้องไม่ผ่าน
const liveCss = toLf(gameCss(readFileSync(new URL('../src/ui/template.html', import.meta.url), 'utf8')));
const cssMiss = GAME_CSS_PAGES.filter((f) => gameCssBlock(read(f)) !== liveCss);
const cssCtl = gameCssBlock(read(GAME_CSS_PAGES[0])) !== `${liveCss} `;
check('หน้า tweak ใช้ CSS เกมชุดปัจจุบัน', cssMiss.length || !cssCtl, ` ${GAME_CSS_PAGES.length} หน้า${cssMiss.length ? ` · เก่า ${cssMiss.join(' ')}` : ''} · ตัวควบคุม${cssCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7c4) หน้า tweak เว็บเอกสาร (ui-redo 32): รายการในหน้า = ขอบเขตที่คิดจาก docs/ ตอนนี้ + :root หน้าเล่นตอนนี้ · ไม่มีหน้านอกขอบเขต (ตัวเกม คลังเก่า หน้า tweak หน้าส่งต่อ) · ทุกหน้ามีไฟล์จริง
// ตัวควบคุม: ถอดหน้า 1 หน้าจากบล็อก ⇒ ต้องไม่ตรง · ขอบเขตที่คิดได้ต้องมีครบชุดหลักที่ใบงานระบุ
const dtHtml = readOr(DOCS_TWEAK_PAGE) ?? '';
const dtNow = docsTweakData(docs, uiTpl);
const dtBlock = docsTweakBlock(dtHtml);
const dtFiles = dtNow.pages.map((p) => p.f);
const dtMust = ['index.html', 'guide.html', 'whatsnew.html', 'about.html', 'worlds.html', 'otherworld.html', 'catalog.html', 'spoilers.html', 'spec/lore-finance-series.html', 'dev/ui.html', 'dev/design.html', 'dev/index.html', 'dev/plan.html', 'dev/spec.html', 'dev/maps/politics.html', 'dev/archive/index.html'];
const dtOut = (f) => f === 'play.html' || f.startsWith('archive/') || f.startsWith('dev/ui-redo/') || /tweak/.test(f) || read(f).includes(MOVED_MARK);
const dtMiss = [
  ...(JSON.stringify(dtBlock) !== JSON.stringify(dtNow) ? [`ค้าง ${DOCS_TWEAK_PAGE} (build ใหม่)`] : []),
  ...dtNow.pages.filter((p) => lf(read(p.f)) !== lf(injectDocsLayout(read(p.f), p.k, p.f)) || !read(p.f).includes('DOCS-LAYOUT:START')).map((p) => `เลย์เอาต์ค้าง ${p.f} (build ใหม่)`),
  ...dtMust.filter((f) => !dtFiles.includes(f)).map((f) => `ขาด ${f}`),
  ...dtFiles.filter((f) => !existsSync(new URL(f, docs)) || dtOut(f)).map((f) => `เกิน ${f}`),
  ...(dtNow.pages.filter((p) => p.k === 'map').length !== dtFiles.filter((f) => f.startsWith('dev/maps/')).length ? ['dev/maps ไม่ได้ชนิดแผนที่'] : []),
];
const dtCtl = dtBlock && JSON.stringify({ ...dtBlock, pages: dtBlock.pages.slice(1) }) !== JSON.stringify(dtNow) && !injectDocsTweak(dtHtml, dtNow, 'ctl').includes(`${DOCS_TWEAK_START}null`);
check('หน้า tweak เว็บเอกสารมีทุกหน้าในขอบเขต', dtMiss.length || !dtCtl, ` ${dtFiles.length} หน้า${dtMiss.length ? ` · ${dtMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${dtCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7c5) หน้า tweak ภาพบนการ์ด (ui-redo 58): บล็อกในหน้า = รูปทรงจาก art.mjs + ตัวเลขหมวดในไฟล์ของ harness ตอนนี้ · ทุกหมวดมีภาพ · หมวดกลาง ≤ ครึ่ง (ข้อ 92)
// ตัวควบคุม: ถอดหมวดแรกจากบล็อก ⇒ ต้องไม่ตรง
const caBlock = cardArtBlock(readOr(CARD_ART_PAGE) ?? '');
const caNow = cardArtData();
const caCats = caNow.counts.cats;
const caMid = caCats.find((c) => c.k === 'mid');
const caMiss = [
  ...(JSON.stringify(caBlock) !== JSON.stringify(caNow) ? [`ค้าง ${CARD_ART_PAGE} (build ใหม่)`] : []),
  ...(!caMid ? ['ไม่มีหมวดกลาง mid'] : caMid.n * 2 > caNow.counts.total - caNow.counts.skipped ? [`หมวดกลางเกินครึ่ง ${caMid.n}`] : []),
  ...Object.keys(CAT_ART).filter((k) => !caCats.some((c) => c.k === k)).map((k) => `ภาพเกิน ${k}`),
  ...caCats.filter((c) => !c.samples.length && c.n).map((c) => `ไม่มีข้อความตัวอย่าง ${c.k}`),
];
const caCtl = caBlock && JSON.stringify({ ...caBlock, counts: { ...caBlock.counts, cats: caBlock.counts.cats.slice(1) } }) !== JSON.stringify(caNow);
check('หน้า tweak ภาพบนการ์ดใช้ภาพ+ตัวเลขหมวดชุดปัจจุบัน', caMiss.length || !caCtl, ` ${caCats.length} หมวด${caMiss.length ? ` · ${caMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${caCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7c6) หน้า tweak T14 หน้าการ์ดรวม (ui-redo 126): บล็อกในหน้า = CSS หน้ารวมการ์ด/หน้าเฉลย + token + การ์ดจริงตอนนี้ · นอกบล็อกไม่มีเนื้อเฉลย (Ctrl+F ไม่เจอก่อนกด ข้อ 187)
// ตัวควบคุม: CSS หน้ารวมการ์ดต่างไป 1 ตัวอักษร ⇒ ต้องไม่ตรง · ย้ายเฉลยการ์ดแรกออกนอกบล็อก ⇒ ต้องถูกจับ
const csHtml = readOr(CARD_SPOIL_PAGE) ?? '';
const csBlock = cardSpoilBlock(csHtml);
const csNow = cardSpoilData(content);
const csOutside = (html) => {
  const b = cardSpoilBlock(html);
  const rest = html.replace(/<script type="application\/json" id="csd">[\s\S]*?<\/script>/, '');
  return (b?.cards ?? []).filter((c) => (c.spoil.match(/<b class="pct">[^<]*<\/b>/g) ?? []).some((m) => rest.includes(m))).map((c) => c.id);
};
const csMiss = [
  ...(!csBlock ? [`ไม่มีบล็อก ${CARD_SPOIL_PAGE}`] : JSON.stringify(csBlock) !== JSON.stringify(csNow) ? [`ค้าง ${CARD_SPOIL_PAGE} (build ใหม่)`] : []),
  ...csOutside(csHtml).map((id) => `เฉลยนอกบล็อก ${id}`),
];
const csCtl = !!csBlock && JSON.stringify({ ...csBlock, css: { ...csBlock.css, catalog: `${csBlock.css.catalog} ` } }) !== JSON.stringify(csNow) && csOutside(csHtml.replace('</body>', `${csBlock.cards[0].spoil}</body>`)).length > 0;
check('หน้า tweak T14 ใช้ CSS+การ์ดหน้าการ์ดรวมชุดปัจจุบัน เฉลยไม่อยู่นอกบล็อก', csMiss.length || !csCtl, ` ${csNow.cards.length} ใบ${csMiss.length ? ` · ${csMiss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${csCtl ? 'จับได้' : 'จับไม่ได้'}`);

// 7d) แผนงาน (ui-redo 23 · ย้ายไป whatsnew ui-redo 69): แถวหมวดใต้หัวกำลังทำ = ชื่อหมวดของหัว "กำลังทำ" ใน whatsnew ตามลำดับ ไม่มีตัวเลข · ทุกลิงก์มี id ปลายทางในหน้า whatsnew
// · rel.mjs ยังเห็นว่าหัวกำลังทำแบ่งหมวด (หัวมี id แล้ว — guard ที่หาแค่ <h3> เปล่าจะหลุด)
// ตัวควบคุม: เติมหมวดใหม่ 1 หมวดใน whatsnew ⇒ กล่องที่คาดต้องเปลี่ยน · ถอด id หัวแรก ⇒ ลิงก์ต้องหาปลายทางไม่เจอ
const wn = read('whatsnew.html');
const roadCats = soonCats(wn);
const roadIn = (html) => { const a = html.indexOf(ROAD_START); const b = html.indexOf(ROAD_END); return a < 0 || b < a ? null : html.slice(a + ROAD_START.length, b); };
const roadNow = roadIn(wn);
// หน้าแรกเหลือแค่หัว + ปุ่มเล่น (ui-redo 105 · ข้อ 220) — กล่องแผนงาน/ระบบหลักกลับมา = ตก
const homeLeftIn = (html) => ['ROADMAP:START', 'class="road"', 'class="sys"', '>ระบบหลัก<', 'class="footnote"'].filter((s) => html.includes(s));
const homeLeft = homeLeftIn(read('index.html'));
const homeCtl = homeLeftIn(read('index.html').replace('</div></header>', '<details class="sys"><summary><h2>ระบบหลัก</h2></summary></details>\n</div></header>')).length === 2;
const coreAbout = read('about.html').includes('<h2 id="core">ระบบหลัก</h2>');
const roadNoId = (w) => soonCats(w).filter((c) => !w.includes(`id="${c.id}"`)).map((c) => c.name);
const relSrc = readFileSync(new URL('../scripts/rel.mjs', import.meta.url), 'utf8');
const relSees = /\/<h3\[\\s>\]\//.test(relSrc);
const wnMore = wn.replace('<h2>แพตช์โน้ต</h2>', '<h3>หมวดทดสอบ</h3>\n  <ul>\n    <li>x</li>\n  </ul>\n\n  <h2>แพตช์โน้ต</h2>');
const roadCtl = roadmapHtml(soonCats(wnMore)) !== roadNow && roadNoId(wn.replace(`<h3 id="${roadCats[0]?.id}">`, '<h3>')).length === 1;
const roadBad = [!roadCats.length && 'whatsnew ไม่มีหมวดใต้กำลังทำ', roadNow !== roadmapHtml(roadCats) && 'แถวหมวดใน whatsnew ไม่ตรงหัวกำลังทำ (build ใหม่)', homeLeft.length && `หน้าแรกยังมี ${homeLeft.join(' ')}`, !coreAbout && 'about ไม่มีหัวระบบหลัก', roadNoId(wn).length && `หัวไม่มี id: ${roadNoId(wn).join(' ')}`, !relSees && 'rel.mjs guard ไม่เห็นหัวที่มี id', /\d/.test((roadNow ?? '').replace(/<[^>]+>/g, '')) && 'แถวมีตัวเลข'].filter(Boolean);
check('แถวหมวดใต้หัวกำลังทำใน whatsnew ตรงหมวดและลิงก์ถึงหัวหมวด · หน้าแรกไม่มีแผนงาน/ระบบหลัก · about มีระบบหลัก', roadBad.length || !roadCtl || !homeCtl, ` ${roadCats.length} หมวด${roadBad.length ? ` · ${roadBad.join(' | ')}` : ''} · ตัวควบคุม${roadCtl && homeCtl ? 'จับได้' : 'จับไม่ได้'}`);

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
// หน้าเล่นแยกไฟล์ (ui-redo 96): เลขรุ่น/โน้ต/โค้ดอยู่ใน play.js · ด่านที่อ่าน "ตัวเกม" อ่าน HTML + สคริปต์รวมกัน
const play = `${read('play.html')}\n${read(PLAY_FILES.app)}`;
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

// 9b) ฟอนต์ไฟล์ในเว็บชุดเดียวทุกหน้า (ui-redo 96 · ข้อ 205): หน้าเล่นมี @font-face ครบทุกแบบที่ใช้ ชี้ fonts/*.woff2 ที่มีจริงและตรงต้นฉบับ src/ui/fonts
// · fonts.css ตรงตาราง FONTS · ทุกไฟล์ใต้ docs/ (html/js/css) ไม่ดึง Google Fonts
// ตัวควบคุม: ถอด @font-face หนึ่งแบบ · เติม <link> Google Fonts ในหน้าเอกสาร · ลบไฟล์ฟอนต์หนึ่งไฟล์ ⇒ ต้องถูกจับทุกแบบ
{
  const srcFont = (f) => readFileSync(new URL(`../src/ui/fonts/${f}.woff2`, import.meta.url));
  const has = (f) => existsSync(new URL(`${FONT_DIR}${f}.woff2`, docs)) && readFileSync(new URL(`${FONT_DIR}${f}.woff2`, docs)).equals(srcFont(f));
  const playGap = (html, ok = has) => playFonts().filter(([fam, w, f]) => !html.includes(`@font-face { font-family:"${fam}"; font-weight:${w}; font-style:normal; font-display:swap; src:url(${FONT_DIR}${f}.woff2) format('woff2'); }`) || !ok(f)).map(([fam, w]) => `${fam} ${w}`);
  const webFiles = (dir = '') => readdirSync(new URL(dir, docs), { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? webFiles(`${dir}${d.name}/`) : /\.(html|js|css)$/.test(d.name) ? [`${dir}${d.name}`] : []));
  const GOOGLE = /fonts\.(googleapis|gstatic)\.com/;
  const googleIn = (rd) => webFiles().filter((f) => GOOGLE.test(rd(f)));
  const cssOk = existsSync(new URL(FONT_CSS, docs)) && toLf(read(FONT_CSS)) === fontsCss(FONTS, '');
  const fileMiss = FONTS.filter(([, , f]) => !has(f)).map(([, , f]) => f);
  const miss = [...playGap(read('play.html')).map((x) => `หน้าเล่นขาด ${x}`), ...googleIn(read).map((f) => `ดึง Google Fonts ${f}`), ...fileMiss.map((f) => `ไม่มี/ไม่ตรง ${FONT_DIR}${f}.woff2`), ...(cssOk ? [] : [`${FONT_CSS} ไม่ตรงตาราง`])];
  const [f0] = playFonts();
  const ctl = {
    'ถอด @font-face': playGap(read('play.html').replace(`font-family:"${f0[0]}"; font-weight:${f0[1]};`, '')).length > 0,
    'Google Fonts ในหน้าเอกสาร': googleIn((f) => (f === 'guide.html' ? read(f).replace('</head>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pridi"></head>') : read(f))).includes('guide.html'),
    'ไฟล์ฟอนต์หาย': playGap(read('play.html'), (f) => f !== f0[2] && has(f)).length > 0,
  };
  const ctlBad = Object.entries(ctl).filter(([, v]) => !v).map(([k]) => k);
  check('ฟอนต์ไฟล์ในเว็บชุดเดียว: หน้าเล่นครบทุกแบบ · ไฟล์ตรงต้นฉบับ · fonts.css ตรงตาราง · ไม่มีไฟล์ไหนดึง Google Fonts', miss.length || ctlBad.length, ` หน้าเล่น ${PLAY_FACES.length} แบบ · ไฟล์ ${FONTS.length - fileMiss.length}/${FONTS.length} · ตรวจ ${webFiles().length} ไฟล์${miss.length ? ` · ${miss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${ctlBad.length ? `จับไม่ได้: ${ctlBad.join(' ')}` : 'จับได้'}`);
}

// 9b2) หน้าเล่นแยกไฟล์ (ui-redo 96 · ข้อ 192 203 204): HTML ≤ 100 KB · สคริปต์ชื่อคงที่ต่อ ?v=เลขรุ่น defer ข้อมูลก่อนโค้ด · service worker เก็บชุดเดียวกัน
// · โครงหน้าเปิด (หัว + ปุ่มเริ่ม) อยู่ใน HTML ก่อนสคริปต์ · boot() ล้างโครงก่อนวาดจอจริง
// ตัวควบคุม: หน้าแบบเดิม (ฝังสคริปต์) เกินเพดาน · สลับลำดับสคริปต์ · เลขรุ่นอื่น · ตัดโครงหน้าเปิด ⇒ ต้องถูกจับทุกแบบ
{
  const PLAY_MAX = 100 * 1024;
  const html = read('play.html');
  const bytes = (s) => Buffer.byteLength(s, 'utf8');
  const fontFiles = playFonts().map(([, , f]) => `${FONT_DIR}${f}.woff2`);
  const shellOf = (h) => h.match(/<main id="app">([\s\S]*?)<\/main>/)?.[1] ?? '';
  const splitGap = (h, v = ver.version, sw = read(PLAY_FILES.sw)) => [
    ...(bytes(h) > PLAY_MAX ? [`play.html ${bytes(h).toLocaleString('en-US')} B เกิน`] : []),
    ...(!h.includes(playScripts(v)) ? ['สคริปต์ไม่ตรงชุด (ลำดับ/ ?v= / defer)'] : []),
    ...(h.indexOf(playAssets(v)[0]) > h.indexOf(playAssets(v)[1]) ? ['ข้อมูลมาหลังโค้ด'] : []),
    ...(toLf(sw) !== swJs(v, fontFiles) ? ['sw.js ไม่ตรงรุ่น/ชุดไฟล์'] : []),
    ...(!/<header class="logo">/.test(h.slice(0, h.indexOf('<script'))) || !/<button[^>]*>[^<]+<\/button>/.test(shellOf(h)) ? ['ไม่มีหัว/ปุ่มเริ่มก่อนสคริปต์'] : []),
  ];
  const bootClears = /function boot\(\) \{\s*(?:\/\/[^\n]*\n\s*)*root\.replaceChildren\(\);/.test(appSrc);
  const miss = [...splitGap(html), ...(bootClears ? [] : ['boot() ไม่ล้างโครงหน้าเปิด'])];
  const ctl = {
    'หน้าแบบฝังสคริปต์': splitGap(`${html}<script>${read(PLAY_FILES.data)}${read(PLAY_FILES.app)}</script>`).length > 0,
    'สลับลำดับ': splitGap(html.replace(playScripts(ver.version), playScripts(ver.version).split('\n').slice(0, 2).reverse().join('\n') + '\n' + playScripts(ver.version).split('\n')[2])).length > 0,
    'เลขรุ่นอื่น': splitGap(html, 'v0.0.00').length > 0 && splitGap(html, ver.version, swJs('v0.0.00', fontFiles)).length > 0,
    'ตัดโครงหน้าเปิด': splitGap(html.replace(/(<main id="app">)[\s\S]*?(<\/main>)/, '$1$2')).length > 0,
  };
  const ctlBad = Object.entries(ctl).filter(([, v]) => !v).map(([k]) => k);
  check('หน้าเล่นแยกไฟล์: HTML ≤ 100 KB · สคริปต์ ?v=เลขรุ่น ข้อมูลก่อนโค้ด · service worker ชุดเดียวกัน · หัว + ปุ่มเริ่มขึ้นก่อนสคริปต์', miss.length || ctlBad.length, ` play.html ${bytes(html).toLocaleString('en-US')} B · ${PLAY_FILES.data} ${bytes(read(PLAY_FILES.data)).toLocaleString('en-US')} B · ${PLAY_FILES.app} ${bytes(read(PLAY_FILES.app)).toLocaleString('en-US')} B${miss.length ? ` · ${miss.join(' | ')}` : ''} · ตัวควบคุม${ctlBad.length ? `จับไม่ได้: ${ctlBad.join(' ')}` : 'จับได้'}`);
}

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

// merge=build เก็บไฟล์ฝั่งตัวเองตอน merge — ใส่กับหน้าเขียนมือ = เนื้อที่อีก branch เขียนหายเงียบ · หน้าสร้างใหม่ที่ไม่ได้ใส่ = ชนทุก merge
const attrs = readFileSync(new URL('../.gitattributes', import.meta.url), 'utf8').split(/\r?\n/).map((l) => l.trim().split(/\s+/));
const mergeBuild = (lines) => new Set(lines.filter(([p, ...w]) => !p.startsWith('#') && w.includes('merge=build')).map(([p]) => p));
const wantBuild = [...['play', ...GEN_PAGES.map(([name]) => name)].map((n) => `docs/${n}.html`), ...[...Object.values(PLAY_FILES), FONT_CSS].map((f) => `docs/${f}`)];
const sameSet = (got) => got.size === wantBuild.length && wantBuild.every((p) => got.has(p));
const gotBuild = mergeBuild(attrs);
const handBuild = FACT_PAGES.filter((n) => gotBuild.has(`docs/${n}.html`));
// ตัวควบคุม: เติมหน้าเขียนมือเข้ารายการแล้วต้องตก
const ctlCaught = !sameSet(mergeBuild([...attrs, [`docs/${FACT_PAGES[0]}.html`, 'merge=build']]));
// eol=lf ต้องครอบโฟลเดอร์ย่อย (docs/dev · docs/spec ฯลฯ) — `docs/*.html` ไม่ข้าม / ⇒ หน้าย่อยออกเป็น CRLF แล้วขึ้น M ทุก build
// ตัวควบคุม: ถอดบรรทัด eol ⇒ ต้องตก
const lfOf = (lines) => lines.some(([p, ...w]) => p === 'docs/**/*.html' && w.includes('eol=lf'));
const lfAttr = lfOf(attrs);
const lfCtl = !lfOf(attrs.filter(([, ...w]) => !w.includes('eol=lf')));
const allHtml = (dir) => readdirSync(new URL(dir, docs), { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? allHtml(`${dir}${d.name}/`) : d.name.endsWith('.html') ? [`${dir}${d.name}`] : []));
const htmlAll = [...allHtml(''), ...Object.values(PLAY_FILES), FONT_CSS];
const crPages = htmlAll.filter((f) => read(f).includes('\r'));
check('.gitattributes merge=build ครบหน้าที่ build สร้าง ไม่มีหน้าเขียนมือ · docs/** eol=lf · html ทุกโฟลเดอร์ไม่มี CR', !sameSet(gotBuild) || handBuild.length || !ctlCaught || !lfAttr || !lfCtl || crPages.length,
  ` merge=build ${gotBuild.size}/${wantBuild.length}${handBuild.length ? ` หน้ามือ ${handBuild.join(',')}` : ''} · eol=lf ${lfAttr ? 'มี' : 'ไม่มี'} · มี CR ${crPages.length}/${htmlAll.length} หน้า${crPages.length ? ` (${crPages.slice(0, 5).join(',')})` : ''} · ตัวควบคุม merge=build ${ctlCaught ? 'จับได้' : 'จับไม่ได้'} · ถอด eol ${lfCtl ? 'จับได้' : 'จับไม่ได้'}`);

// กล่องรหัส (ui-redo 72): ทุกหน้า docs/ ที่ไม่ใช่หน้าแรก/ตัวเกม/หน้าส่งต่อ มีบล็อกชุดเดียวใน <head> ตรง hash ปัจจุบัน + noindex · หน้าแรก/ตัวเกมไม่มี
// ตัวควบคุม: ถอดบล็อก · hash อื่น · ย้ายไปท้าย body · ใส่บล็อกให้หน้าแรก ⇒ ต้องถูกจับทุกแบบ
{
  const BLOCK = /<!--GATE:START-->[\s\S]*?<!--GATE:END-->/;
  const gateGap = (files, readPage) => [
    ...files.flatMap((f) => {
      const html = readPage(f);
      const blk = gateBlockOf(html);
      if (!blk) return [`ไม่มีกล่องรหัส ${f}`];
      const head = html.search(/<\/head>/i);
      return [
        ...(blk.count !== 1 ? [`กล่องรหัสซ้ำ ${f}`] : []),
        ...(blk.body !== gateBlock(gateHash, f) ? [`กล่องรหัสไม่ตรง hash ปัจจุบัน ${f}`] : []),
        ...(head < 0 || html.search(BLOCK) > head ? [`กล่องรหัสไม่อยู่ใน <head> ${f}`] : []),
        ...(!blk.body.includes('<meta name="robots" content="noindex">') ? [`ไม่มี noindex ${f}`] : []),
      ];
    }),
    ...GATE_OPEN.filter((f) => gateBlockOf(readPage(f))).map((f) => `หน้าไม่ติดรหัสมีกล่อง ${f}`),
  ];
  const files = gatedFiles(docs);
  const miss = gateGap(files, read);
  const [g0, g1] = files;
  const other = gateHash === 'f'.repeat(64) ? 'e'.repeat(64) : 'f'.repeat(64);
  const only = (want, fn) => (f) => (f === want ? fn(read(f), f) : read(f));
  const ctl = {
    ถอดบล็อก: only(g0, (h) => h.replace(BLOCK, '')),
    // ปิดชั่วคราว: บล็อกไม่มี hash ⇒ ตัวควบคุม hash อื่นใช้ไม่ได้ · ใช้บล็อกตอนเปิดแทน
    ...(GATE_OFF ? { 'บล็อกตอนเปิด': only(g0, (h) => h.replace(BLOCK, `<!--GATE:START-->${gateBlock(other, g0, false)}<!--GATE:END-->`)) } : { 'hash อื่น': only(g0, (h, f) => injectGate(h, other, f)) }),
    'ท้าย body': only(g1, (h) => { const b = h.match(BLOCK)[0]; return h.replace(BLOCK, '').replace(/<\/body>/i, `${b}</body>`); }),
    หน้าแรกติด: only('index.html', (h, f) => injectGate(h, gateHash, f)),
  };
  const ctlBad = Object.entries(ctl).filter(([, rp]) => !gateGap(files, rp).length).map(([k]) => k);
  check('หน้าเว็บติดรหัสครบ (กล่องใน head · hash ปัจจุบัน · noindex) หน้าแรก/ตัวเกมไม่ติด', miss.length || ctlBad.length || files.length < 20, ` ${files.length} หน้า · hash ${GATE_OFF ? 'ปิดชั่วคราว (เหลือ noindex)' : gateHash ? 'ตั้งแล้ว' : 'ยังไม่ตั้ง (กล่องบอกว่ายังเปิดไม่ได้)'}${miss.length ? ` · ${miss.slice(0, 4).join(' | ')}` : ''} · ตัวควบคุม${ctlBad.length ? `จับไม่ได้: ${ctlBad.join(', ')}` : 'จับได้'}`);
}

// ซ่อนโลกที่สามบนหน้าไม่ติดรหัส (ui-redo 70): หน้าแรก · หน้าส่งต่อทั้งหน้า และ <head> ของ play.html (ตัวเกมใน body ไม่นับ)
// นับข้อความที่เห็น + title + ค่าในแอตทริบิวต์ที่คนหรือเครื่องอ่าน (content · alt · title · aria-label) — คอมเมนต์/CSS/สคริปต์ไม่นับ
// ตัวควบคุม: ใส่คำกลับในย่อหน้าหน้าแรก · ใน description · ใน title ของ play · ในชื่อหน้าส่งต่อ ⇒ ต้องถูกจับทุกแบบ
{
  const seen = (html) => {
    const h = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
    const attrs = [...h.matchAll(/\s(?:content|alt|title|aria-label)="([^"]*)"/gi)].map((m) => m[1]);
    return `${h.replace(/<[^>]+>/g, ' ')} ${attrs.join(' ')}`;
  };
  const headOf = (html) => html.slice(0, html.search(/<\/head>/i));
  const moved = [];
  const walk = (dir) => {
    for (const d of readdirSync(new URL(dir, docs), { withFileTypes: true })) {
      const f = `${dir}${d.name}`;
      if (d.isDirectory()) walk(`${f}/`);
      else if (f.endsWith('.html') && read(f).includes(MOVED_MARK)) moved.push(f);
    }
  };
  walk('');
  const pages = (rd) => [['index.html', seen(rd('index.html'))], ['play.html <head>', seen(headOf(rd('play.html')))], ...moved.map((f) => [f, seen(rd(f))])];
  const hits = (rd) => pages(rd).filter(([, t]) => PUBLIC_HIDE.test(t)).map(([f, t]) => `${f}: "${t.match(PUBLIC_HIDE)[0]}"`);
  const miss = hits(read);
  const swap = (want, fn) => (f) => (f === want ? fn(read(f)) : read(f));
  const ctl = {
    'ย่อหน้าหน้าแรก': swap('index.html', (h) => h.replace('</p>\n  <a class="play big"', ' ต่างโลก</p>\n  <a class="play big"')),
    description: swap('index.html', (h) => h.replace('<meta name="description" content="', '<meta name="description" content="isekai ')),
    'title play': swap('play.html', (h) => h.replace('</title>', ' ต่างโลก</title>')),
    'หน้าส่งต่อ': swap(moved[0], (h) => h.replace('</title>', ' ต่างโลก</title>')),
  };
  const ctlBad = Object.entries(ctl).filter(([, rd]) => !hits(rd).length).map(([k]) => k);
  // ตัวเกมยังพาไปต่างโลกได้ — คำต้องยังอยู่ใน body ของ play.html (ไม่ได้ตัดตัวเกม)
  const gameKeeps = PUBLIC_HIDE.test(`${read('play.html').slice(headOf(read('play.html')).length)}${read(PLAY_FILES.app)}`);
  check('หน้าไม่ติดรหัส (หน้าแรก · head ของ play · หน้าส่งต่อ) ไม่มีคำต่างโลก ตัวเกมคงเดิม', miss.length || ctlBad.length || !moved.length || !gameKeeps, ` ${pages(read).length} หน้า (ส่งต่อ ${moved.length})${miss.length ? ` · เจอ ${miss.join(' | ')}` : ''}${gameKeeps ? '' : ' · ตัวเกมไม่มีคำ (ตัดเกิน)'} · ตัวควบคุม${ctlBad.length ? `จับไม่ได้: ${ctlBad.join(', ')}` : 'จับได้'}`);
}

// SEO หน้าแรก + sitemap (ui-redo 68 · ข้อ 102): canonical · og:image ไฟล์จริง 1200×630 < 300KB · JSON-LD parse ได้ มี VideoGame + WebSite ไม่มีคำซ่อน
// · บล็อกตรงของที่ build จาก title/description ปัจจุบัน · head ของ play มี description + canonical · sitemap ทุก URL มีไฟล์จริง ไม่ติดรหัส ไม่ noindex
// ตัวควบคุม: ถอด canonical · JSON-LD พัง · ภาพผิดขนาด · ใส่หน้าติดรหัสใน sitemap ⇒ ต้องถูกจับทุกแบบ
{
  const pngSize = (buf) => (buf?.length > 24 && buf.toString('latin1', 12, 16) === 'IHDR' ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : null);
  const fileOf = (url) => (url.startsWith(SITE) ? decodeURIComponent(url.slice(SITE.length)) || 'index.html' : null);
  const bin = (f) => (existsSync(new URL(f, docs)) ? readFileSync(new URL(f, docs)) : null);
  const seoGap = ({ index, play, sitemap, png }) => {
    const out = [];
    const a = index.indexOf(SEO_START);
    const b = index.indexOf(SEO_END);
    const blk = a < 0 || b < a ? '' : index.slice(a + SEO_START.length, b);
    if (!blk) return ['หน้าแรกไม่มีบล็อก SEO'];
    if (blk.trim() !== seoBlock(pageMeta(index, 'docs/index.html'))) out.push('บล็อก SEO ไม่ตรง title/description ปัจจุบัน (build ใหม่)');
    if (!blk.includes(`<link rel="canonical" href="${SITE}">`)) out.push('ไม่มี canonical');
    const img = blk.match(/<meta property="og:image" content="([^"]+)">/)?.[1];
    const dim = pngSize(png);
    if (img !== SITE + OG_IMAGE || !png) out.push(`og:image ไม่มีไฟล์ ${img}`);
    else if (dim?.[0] !== OG_W || dim?.[1] !== OG_H || png.length >= 300 * 1024) out.push(`og:image ${dim?.join('×')} ${Math.round(png.length / 1024)}KB`);
    let ld = null;
    try { ld = JSON.parse(blk.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? ''); } catch {}
    const types = Array.isArray(ld) ? ld.map((x) => x['@type']) : [];
    if (!types.includes('VideoGame') || !types.includes('WebSite')) out.push(`JSON-LD ${ld ? `ได้ ${types.join(',')}` : 'parse ไม่ได้'}`);
    if (PUBLIC_HIDE.test(blk)) out.push('บล็อก SEO มีคำซ่อน');
    for (const f of [FAVICON_SVG, FAVICON_PNG, TOUCH_ICON]) if (!existsSync(new URL(f, docs))) out.push(`ไม่มี ${f}`);
    const head = play.slice(0, play.search(/<\/head>/i));
    if (!/<meta name="description" content="[^"]+">/.test(head) || !head.includes(`<link rel="canonical" href="${SITE}play.html">`)) out.push('head ของ play ไม่มี description/canonical');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (lf(sitemap) !== sitemapXml()) out.push('sitemap ไม่ตรงของที่ build');
    for (const u of locs) {
      const f = fileOf(u);
      const html = f && existsSync(new URL(f, docs)) ? (f === 'index.html' ? index : read(f)) : null;
      if (!html) out.push(`sitemap ลิงก์ตาย ${u}`);
      else if (gateBlockOf(html) || /<meta name="robots" content="[^"]*noindex/.test(html)) out.push(`sitemap มีหน้า noindex ${u}`);
    }
    return out;
  };
  const now = { index: read('index.html'), play: read('play.html'), sitemap: read(SITEMAP), png: bin(OG_IMAGE) };
  const miss = seoGap(now);
  const fakePng = Buffer.from(now.png ?? Buffer.alloc(32));
  fakePng.writeUInt32BE(OG_W - 1, 16);
  const ctl = {
    'ถอด canonical': { ...now, index: now.index.replace(/<link rel="canonical"[^>]*>\n/, '') },
    'JSON-LD พัง': { ...now, index: now.index.replace('<script type="application/ld+json">[', '<script type="application/ld+json">[,') },
    'ภาพผิดขนาด': { ...now, png: fakePng },
    'sitemap มีหน้าติดรหัส': { ...now, sitemap: now.sitemap.replace('</urlset>', `  <url><loc>${SITE}about.html</loc></url>\n</urlset>`) },
  };
  const ctlBad = Object.entries(ctl).filter(([, v]) => !seoGap(v).length).map(([k]) => k);
  check('SEO หน้าแรก (canonical · og:image จริง · JSON-LD) · play มี description/canonical · sitemap ทุก URL ไฟล์จริงไม่ noindex', miss.length || ctlBad.length, ` sitemap ${[...now.sitemap.matchAll(/<loc>/g)].length} URL${miss.length ? ` · ${miss.join(' | ')}` : ''} · ตัวควบคุม${ctlBad.length ? `จับไม่ได้: ${ctlBad.join(', ')}` : 'จับได้'}`);
}

console.log(fail ? `ไม่ผ่าน ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
