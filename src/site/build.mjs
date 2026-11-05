// หน้าเว็บนอกตัวเกม (B65): ฉีดตัวเลขลงหน้าที่เขียนมือ + สร้างหน้ารวมการ์ดและหน้าเฉลยจากแม่แบบ · เรียกจาก build.mjs ทุกครั้ง
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { siteFacts, injectFacts } from './facts.mjs';
import { catalogHtml } from './catalog.mjs';
import { spoilersHtml } from './spoilers.mjs';
import { injectSpec, SPEC_PAGE } from './spec.mjs';
import { guideHtml } from './guide.mjs';
import { demoHtml } from './demo.mjs';
import { designPages, designHtml, DESIGN_AT } from './design.mjs';
import { injectNav } from './nav.mjs';
import { uiPage, designMoved, liveMoved, tweakPages, tweakMoved, UI_PAGE, UI_LIVE_FROM } from './ui.mjs';
import { soonCats, soonIds, injectRoadmap } from './roadmap.mjs';
import { GAME_CSS_PAGES, gameCss, injectGameCss } from './game-css.mjs';
import { gatedFiles, injectGate, readGateHash } from './gate.mjs';
import { injectSeo, sitemapXml, faviconSvg, SITEMAP, FAVICON_SVG } from './seo.mjs';
import { ART_INK } from '../ui/art.mjs';
import { DOCS_TWEAK_PAGE, docsTweakData, injectDocsTweak } from './docs-tweak.mjs';
import { CARD_ART_PAGE, cardArtData, injectCardArt } from './card-art-tweak.mjs';
import { CARD_SPOIL_PAGE, cardSpoilData, injectCardSpoil } from './card-spoil-tweak.mjs';

// หน้าที่เขียนมือแต่มีตัวเลขจาก data — play.html (build สร้าง) · whatsnew.html (ผู้รวมงานเขียน) ไม่อยู่ในนี้
export const FACT_PAGES = ['index', 'about', 'otherworld', 'worlds'];
// หน้าเขียนมือที่ไม่มีตัวเลขจาก data แต่ต้องมีแถบบนชุดเดียวกัน — ไฟล์อยู่ใต้ docs/
export const NAV_PAGES = ['whatsnew.html', 'spec/lore-finance-series.html'];
// หน้าที่ build สร้างทั้งหน้าจากแม่แบบ src/site/<ชื่อ>.html — หน้าเฉลย (B88) แยกจากหน้ารวมการ์ดเพราะหน้ารวมการ์ดห้ามเผยผล/บุญบาป
export const GEN_PAGES = [
  // เดโมการ์ดเล่นได้ (B121) อยู่หน้ารวมการ์ด ไม่ใช่หน้าแรก
  ['catalog', '<!--__CATALOG__-->', (content) => catalogHtml(content, demoHtml(content))],
  ['spoilers', '<!--__SPOILERS__-->', spoilersHtml],
  // คู่มือสั้น (B121) ป้ายปุ่มดึงจาก src/ui/labels.mjs ที่เกมใช้
  ['guide', '<!--__GUIDE__-->', guideHtml],
];

// ไฟล์ที่ build เขียนเป็น LF ล้วนเสมอ: แม่แบบ/โมดูลที่ checkout บน Windows เป็น CRLF จะทำให้ผลออกมาปนสองแบบ
// git จึงเห็นว่าแก้ทั้งที่เนื้อเท่าเดิม แล้ว checkout/stash ไม่ยอม (คู่กับ eol=lf ใน .gitattributes)
export const toLf = (text) => text.replace(/\r\n/g, '\n');
// เขียนหน้าใต้ docs/ ทุกหน้าผ่านตัวนี้ — LF ล้วน · ส่ง old (เนื้อที่อ่านมา) = เขียนเฉพาะเมื่อต่าง ไฟล์ CRLF ที่เนื้อเท่าเดิมก็ถูกเขียนเป็น LF
const put = (url, text, old = null) => {
  const next = toLf(text);
  if (next !== old) writeFileSync(url, next);
};

export function buildSite(content, root = new URL('../../', import.meta.url), facts = siteFacts(content)) {
  const at = (p) => new URL(p, root);
  const out = [];
  for (const name of FACT_PAGES) {
    const file = at(`docs/${name}.html`);
    const raw = readFileSync(file, 'utf8');
    const html = toLf(raw);
    const filled = injectFacts(html, facts, `docs/${name}.html`);
    // SEO หน้าแรก (ui-redo 68) อ่าน title/description หลังฉีดเลขแล้ว
    put(file, injectNav(name === 'index' ? injectSeo(filled, 'docs/index.html') : filled, `${name}.html`), raw);
    out.push(name);
  }
  // ภาคผนวกสเปกจาก docs/spec — สร้างใหม่ทุก build · หน้าห้องผู้พัฒนามีแถบของตัวเอง ไม่ฉีดแถบบน
  const specFile = at(SPEC_PAGE);
  const specOld = readFileSync(specFile, 'utf8');
  const specNext = injectSpec(specOld);
  put(specFile, specNext, specOld);
  out.push('dev/spec');
  for (const [name, slot, html] of GEN_PAGES) {
    const page = injectFacts(readFileSync(at(`src/site/${name}.html`), 'utf8'), facts, `src/site/${name}.html`).replace(slot, () => html(content));
    put(at(`docs/${name}.html`), injectNav(page, `${name}.html`));
    out.push(name);
  }
  // หน้าคำตัดสินเกมหลายหน้าจากแม่แบบเดียว — จำนวนหน้าตามโฟลเดอร์ใน design/ · ที่อยู่เดิมใต้ docs/ เขียนเป็นหน้าส่งต่อทุกรอบ (ลิงก์ภายนอกยังเปิดได้)
  const designTpl = injectFacts(readFileSync(at('src/site/design.html'), 'utf8'), facts, 'src/site/design.html');
  const designOut = designPages(new URL('design/', root));
  for (const [file, page] of designOut) {
    put(at(`docs/${DESIGN_AT}${file}`), designHtml(designTpl, page, file));
    put(at(`docs/${file}`), designMoved(file, page.title));
    out.push(DESIGN_AT + file.replace(/\.html$/, ''));
  }
  // หน้าดีไซน์ UI (ui-redo 44) ใช้แม่แบบเดียวกับหน้าคำตัดสินเกม ⇒ แถบห้องผู้พัฒนา + noindex ชุดเดียวกัน
  put(at(`docs/${UI_PAGE}`), designHtml(designTpl, uiPage(content, at('docs/')), UI_PAGE.slice(DESIGN_AT.length)));
  out.push(UI_PAGE.replace(/\.html$/, ''));
  put(at(`docs/${UI_LIVE_FROM}`), liveMoved());
  for (const t of tweakPages(at('docs/'))) put(at(`docs/${t[3]}`), tweakMoved(t));
  // เรื่องที่ถูกรวม/ลบออกจาก design/ ทิ้งหน้าเก่าไว้ = ลิงก์ค้างที่ไม่ตรงต้นฉบับ · ที่เดิมที่เป็นหน้าเนื้อ (ไม่ใช่หน้าส่งต่อ) ก็ลบ
  const made = new Set(designOut.map(([f]) => f));
  for (const dir of ['docs/', `docs/${DESIGN_AT}`]) for (const f of readdirSync(at(dir)).filter((n) => /^design-.+\.html$/.test(n) && !made.has(n))) unlinkSync(at(`${dir}${f}`));
  const css = gameCss(readFileSync(at('src/ui/template.html'), 'utf8'));
  for (const file of GAME_CSS_PAGES) {
    const html = readFileSync(at(`docs/${file}`), 'utf8');
    const next = injectGameCss(html, css, `docs/${file}`);
    put(at(`docs/${file}`), next, html);
    out.push(file.replace(/\.html$/, ''));
  }
  for (const file of NAV_PAGES) {
    const html = readFileSync(at(`docs/${file}`), 'utf8');
    // แถวหมวดแผนงานใต้หัวกำลังทำ (ui-redo 69) อ่านหมวดจากหน้าเดียวกัน
    const next = injectNav(file === 'whatsnew.html' ? injectRoadmap(soonIds(html), soonCats(html), 'docs/whatsnew.html') : html, file);
    put(at(`docs/${file}`), next, html);
  }
  // หน้า tweak เว็บเอกสาร (ui-redo 32): รายการหน้าคิดหลังทุกหน้าข้างบนเขียนเสร็จ ⇒ หน้าที่เพิ่ง build ใหม่อยู่ในรายการด้วย
  const dt = readFileSync(at(`docs/${DOCS_TWEAK_PAGE}`), 'utf8');
  const dtNext = injectDocsTweak(dt, docsTweakData(at('docs/'), readFileSync(at('src/ui/template.html'), 'utf8')), `docs/${DOCS_TWEAK_PAGE}`);
  put(at(`docs/${DOCS_TWEAK_PAGE}`), dtNext, dt);
  out.push(DOCS_TWEAK_PAGE.replace(/\.html$/, ''));
  // หน้า tweak ภาพบนการ์ด (ui-redo 58): รูปทรงจาก art.mjs + ตัวเลขหมวดที่ harness/result-cats.mjs เขียนไว้
  const ca = readFileSync(at(`docs/${CARD_ART_PAGE}`), 'utf8');
  const caNext = injectCardArt(ca, cardArtData(), `docs/${CARD_ART_PAGE}`);
  put(at(`docs/${CARD_ART_PAGE}`), caNext, ca);
  // หน้า tweak T14 หน้าการ์ดรวม (ui-redo 126): CSS หน้ารวมการ์ด/หน้าเฉลย + token + การ์ดจริงทั้งสองแบบ
  const cs = readFileSync(at(`docs/${CARD_SPOIL_PAGE}`), 'utf8');
  put(at(`docs/${CARD_SPOIL_PAGE}`), injectCardSpoil(cs, cardSpoilData(content, root), `docs/${CARD_SPOIL_PAGE}`), cs);
  out.push(CARD_SPOIL_PAGE.replace(/\.html$/, ''));
  // กล่องรหัส (ui-redo 72) ฉีดท้ายสุด — หน้าที่ build สร้างใหม่ข้างบนต้องได้บล็อกด้วย · play.html (build.mjs เขียน) ไม่ติดรหัสอยู่แล้ว
  const hash = readGateHash();
  for (const file of gatedFiles(at('docs/'))) {
    const html = readFileSync(at(`docs/${file}`), 'utf8');
    const next = injectGate(html, hash, file);
    put(at(`docs/${file}`), next, html);
  }
  for (const [file, body] of [[SITEMAP, sitemapXml()], [FAVICON_SVG, faviconSvg(ART_INK)]]) if (!existsSync(at(`docs/${file}`)) || readFileSync(at(`docs/${file}`), 'utf8').replace(/\r\n/g, '\n') !== body) put(at(`docs/${file}`), body);
  return { facts, pages: out };
}
