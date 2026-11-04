// หน้าการออกแบบ: แปลง design/*.md (สำเนาคำตัดสินของเจ้าของเกม) เป็นหน้าเว็บ · ใช้ตัวแปลงเดียวกับภาคผนวก GDD
// แยกหน้าตามเรื่อง — รวมทุกไฟล์หน้าเดียวยาวเกินอ่านบนมือถือ · สารบัญ = design.html
import { readFileSync, readdirSync } from 'node:fs';
import { esc } from './catalog.mjs';
import { renderDoc, docId, SPEC_OPEN } from './spec.mjs';

export const DESIGN_DIR = new URL('../../design/', import.meta.url);
export const LORE = 'lore';
const LORE_TITLE = 'ข้อมูลอ้างอิง (lore)';
// ในหน้าเรื่อง แผนที่ใบงานขึ้นก่อนคำตัดสิน · ไฟล์อื่นต่อท้ายเรียงชื่อ
const RANK = (f) => (f.endsWith('/MAP.md') ? 0 : f.endsWith('/decisions.md') ? 1 : 2);

export function designFiles(dir = DESIGN_DIR) {
  return readdirSync(dir, { recursive: true })
    .map((f) => f.replace(/\\/g, '/'))
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

// ไฟล์ชั้นบนสุด → design.html · lore/ → design-lore.html · <เรื่อง>/ → design-<เรื่อง>.html
export const designPage = (f) => (f.includes('/') ? `design-${f.split('/')[0]}.html` : 'design.html');

export function designDocs(dir = DESIGN_DIR) {
  const files = designFiles(dir);
  const known = new Set(files);
  return files.map((f) => {
    const page = designPage(f);
    // ลิงก์ไปไฟล์นอก design/ (โค้ด · ใบงานนอก repo) ไม่มีหน้าให้ไป ⇒ เป็นข้อความ
    const link = { doc: (p) => (designPage(p) === page ? '' : designPage(p)) + `#${docId(p)}`, asset: () => null };
    return { ...renderDoc(f, readFileSync(new URL(f, dir), 'utf8'), known, link), page };
  });
}

const titleOf = (d) => d.title.replace(/^(MAP|decisions):\s*/i, '').replace(/\s*—\s*decisions$/i, '');
const subToc = (d) => d.heads.filter((x) => x.level === 2).map((x) => `<a href="#${x.id}">${esc(x.text)}</a>`).join('');
const docBlock = (d, open) =>
  `<details class="doc" id="${d.id}"${open ? ' open' : ''}><summary>${esc(d.title)}</summary><p class="src">ไฟล์ต้นฉบับ design/${esc(d.file)} · <a href="#design-toc">กลับสารบัญ</a></p>\n${d.html}\n</details>`;

// คืน [[ชื่อไฟล์, { title, lead, body }]] ต่อหน้า — แม่แบบ src/site/design.html ห่อหัว/ท้าย
export function designPages(dir = DESIGN_DIR) {
  const docs = designDocs(dir);
  const byPage = new Map();
  for (const d of docs) byPage.set(d.page, [...(byPage.get(d.page) ?? []), d]);
  const topics = [...byPage.keys()].filter((p) => p !== 'design.html' && p !== `design-${LORE}.html`).sort();
  const lead = (p) => [...byPage.get(p)].sort((a, b) => RANK(a.file) - RANK(b.file))[0];
  const pageTitle = (p) => (p === `design-${LORE}.html` ? LORE_TITLE : titleOf(lead(p)));
  const card = (p, note) => `<li><a href="${p}">${esc(pageTitle(p))}</a> <small>${note}</small></li>`;

  const out = [];
  const top = byPage.get('design.html') ?? [];
  const index = [
    `<nav class="spec-toc" id="design-toc" aria-label="สารบัญการออกแบบ">`,
    `<div><h3>เรื่องที่ออกแบบ</h3><ol>${topics.map((p) => card(p, [...byPage.get(p)].sort((a, b) => RANK(a.file) - RANK(b.file)).map((d) => d.file.split('/')[1].replace(/\.md$/, '')).join(' · '))).join('')}</ol></div>`,
    byPage.has(`design-${LORE}.html`) ? `<div><h3>ข้อมูลอ้างอิง</h3><ol>${card(`design-${LORE}.html`, `${byPage.get(`design-${LORE}.html`).length} ไฟล์`)}</ol></div>` : '',
    `<div><h3>ในหน้านี้</h3><ol>${top.map((d) => `<li><a href="#${d.id}">${esc(d.title)}</a></li>`).join('')}</ol></div>`,
    `</nav>`,
  ].join('');
  out.push(['design.html', { title: 'การออกแบบ', lead: 'คำตัดสินของเจ้าของเกมแยกตามเรื่อง ตามสำเนาใน design/ ของ repo · อ่านอย่างเดียว', body: `${index}\n${top.map((d) => docBlock(d, true)).join('\n')}` }]);

  for (const p of [...topics, `design-${LORE}.html`].filter((x) => byPage.has(x))) {
    const ds = byPage.get(p).sort((a, b) => RANK(a.file) - RANK(b.file) || a.file.localeCompare(b.file));
    const lore = p === `design-${LORE}.html`;
    const toc = `<nav class="spec-toc" id="design-toc" aria-label="สารบัญหน้านี้"><div><h3>ในหน้านี้</h3><ol>${ds
      .map((d) => {
        const sub = lore ? '' : subToc(d);
        return `<li><a href="#${d.id}">${esc(d.title)}</a>${sub ? `<div class="sub">${sub}</div>` : ''}</li>`;
      })
      .join('')}</ol></div></nav>`;
    // lore ยาวรวมกันหลายเท่าของหน้าเรื่อง — พับรายไฟล์ ลิงก์จากสารบัญกางให้เอง · หน้าเรื่องมี 1–2 ไฟล์ กางไว้เลย
    out.push([p, { title: pageTitle(p), lead: lore ? 'ข้อมูลที่ใช้ตอนเขียนเนื้อหาและตัวเลข แหล่งที่มาอยู่ในแต่ละไฟล์' : `เรื่อง ${p.slice(7, -5)} · แผนที่ใบงานและคำตัดสิน`, body: `${toc}\n${ds.map((d) => docBlock(d, !lore)).join('\n')}\n${SPEC_OPEN}` }]);
  }
  return out;
}

export function designHtml(tpl, page) {
  return tpl
    .replace(/<!--__TITLE__-->/g, () => esc(page.title))
    .replace('<!--__LEAD__-->', () => esc(page.lead))
    .replace('<!--__DESIGN__-->', () => page.body);
}
