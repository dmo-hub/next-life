// หน้าเว็บนอกตัวเกม (B65): ฉีดตัวเลขลงหน้าที่เขียนมือ + สร้างหน้ารวมการ์ดและหน้าเฉลยจากแม่แบบ · เรียกจาก build.mjs ทุกครั้ง
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { siteFacts, injectFacts } from './facts.mjs';
import { catalogHtml } from './catalog.mjs';
import { spoilersHtml } from './spoilers.mjs';
import { injectSpec, SPEC_PAGE } from './spec.mjs';
import { guideHtml } from './guide.mjs';
import { demoHtml } from './demo.mjs';
import { designPages, designHtml, DESIGN_AT } from './design.mjs';
import { injectNav } from './nav.mjs';
import { uiPage, designMoved, UI_PAGE } from './ui.mjs';
import { soonCats, soonIds, injectRoadmap } from './roadmap.mjs';
import { GAME_CSS_PAGES, gameCss, injectGameCss } from './game-css.mjs';

// หน้าที่เขียนมือแต่มีตัวเลขจาก data — play.html (build สร้าง) · whatsnew.html (ผู้รวมงานเขียน) ไม่อยู่ในนี้
export const FACT_PAGES = ['index', 'about', 'otherworld', 'worlds'];
// หน้าเขียนมือที่ไม่มีตัวเลขจาก data แต่ต้องมีแถบบนชุดเดียวกัน — ไฟล์อยู่ใต้ docs/
export const NAV_PAGES = ['whatsnew.html', 'cards.html', 'spec/lore-finance-series.html'];
// หน้าที่ build สร้างทั้งหน้าจากแม่แบบ src/site/<ชื่อ>.html — หน้าเฉลย (B88) แยกจากหน้ารวมการ์ดเพราะหน้ารวมการ์ดห้ามเผยผล/บุญบาป
export const GEN_PAGES = [
  // เดโมการ์ดเล่นได้ (B121) อยู่หน้ารวมการ์ด ไม่ใช่หน้าแรก
  ['catalog', '<!--__CATALOG__-->', (content) => catalogHtml(content, demoHtml(content))],
  ['spoilers', '<!--__SPOILERS__-->', spoilersHtml],
  // คู่มือสั้น (B121) ป้ายปุ่มดึงจาก src/ui/labels.mjs ที่เกมใช้
  ['guide', '<!--__GUIDE__-->', guideHtml],
];

export function buildSite(content, root = new URL('../../', import.meta.url), facts = siteFacts(content)) {
  const at = (p) => new URL(p, root);
  const out = [];
  // แผนงานหน้าแรกอ่านหมวดจาก whatsnew ก่อน (ui-redo 23)
  const cats = soonCats(readFileSync(at('docs/whatsnew.html'), 'utf8'));
  for (const name of FACT_PAGES) {
    const file = at(`docs/${name}.html`);
    const html = readFileSync(file, 'utf8');
    const filled = injectFacts(html, facts, `docs/${name}.html`);
    const next = injectNav(name === 'index' ? injectRoadmap(filled, cats, 'docs/index.html') : filled, `${name}.html`);
    if (next !== html) writeFileSync(file, next);
    out.push(name);
  }
  // ภาคผนวกสเปกจาก docs/spec — สร้างใหม่ทุก build · หน้าห้องผู้พัฒนามีแถบของตัวเอง ไม่ฉีดแถบบน
  const specFile = at(SPEC_PAGE);
  const specOld = readFileSync(specFile, 'utf8');
  const specNext = injectSpec(specOld);
  if (specNext !== specOld) writeFileSync(specFile, specNext);
  out.push('dev/spec');
  for (const [name, slot, html] of GEN_PAGES) {
    const page = injectFacts(readFileSync(at(`src/site/${name}.html`), 'utf8'), facts, `src/site/${name}.html`).replace(slot, () => html(content));
    writeFileSync(at(`docs/${name}.html`), injectNav(page, `${name}.html`));
    out.push(name);
  }
  // หน้าคำตัดสินเกมหลายหน้าจากแม่แบบเดียว — จำนวนหน้าตามโฟลเดอร์ใน design/ · ที่อยู่เดิมใต้ docs/ เขียนเป็นหน้าส่งต่อทุกรอบ (ลิงก์ภายนอกยังเปิดได้)
  const designTpl = injectFacts(readFileSync(at('src/site/design.html'), 'utf8'), facts, 'src/site/design.html');
  const designOut = designPages(new URL('design/', root));
  for (const [file, page] of designOut) {
    writeFileSync(at(`docs/${DESIGN_AT}${file}`), designHtml(designTpl, page, file));
    writeFileSync(at(`docs/${file}`), designMoved(file, page.title));
    out.push(DESIGN_AT + file.replace(/\.html$/, ''));
  }
  // หน้าดีไซน์ UI (ui-redo 44) ใช้แม่แบบเดียวกับหน้าคำตัดสินเกม ⇒ แถบห้องผู้พัฒนา + noindex ชุดเดียวกัน
  writeFileSync(at(`docs/${UI_PAGE}`), designHtml(designTpl, uiPage(content, at('docs/')), UI_PAGE.slice(DESIGN_AT.length)));
  out.push(UI_PAGE.replace(/\.html$/, ''));
  // เรื่องที่ถูกรวม/ลบออกจาก design/ ทิ้งหน้าเก่าไว้ = ลิงก์ค้างที่ไม่ตรงต้นฉบับ · ที่เดิมที่เป็นหน้าเนื้อ (ไม่ใช่หน้าส่งต่อ) ก็ลบ
  const made = new Set(designOut.map(([f]) => f));
  for (const dir of ['docs/', `docs/${DESIGN_AT}`]) for (const f of readdirSync(at(dir)).filter((n) => /^design-.+\.html$/.test(n) && !made.has(n))) unlinkSync(at(`${dir}${f}`));
  const css = gameCss(readFileSync(at('src/ui/template.html'), 'utf8'));
  for (const file of GAME_CSS_PAGES) {
    const html = readFileSync(at(`docs/${file}`), 'utf8');
    const next = injectGameCss(html, css, `docs/${file}`);
    if (next !== html) writeFileSync(at(`docs/${file}`), next);
    out.push(file.replace(/\.html$/, ''));
  }
  for (const file of NAV_PAGES) {
    const html = readFileSync(at(`docs/${file}`), 'utf8');
    const next = injectNav(file === 'whatsnew.html' ? soonIds(html) : html, file);
    if (next !== html) writeFileSync(at(`docs/${file}`), next);
  }
  return { facts, pages: out };
}
