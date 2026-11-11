// หน้าดีไซน์ UI ในห้องผู้พัฒนา (ui-redo 44): สี ตัวอักษร ชิ้นส่วนตัวอย่าง คำตัดสิน UI ช่องภาพจอเกม — โครงเนื้อครบ ยังไม่จัดสวย (หน้าตาเป็นงานใบ 32/35)
// สีและฟอนต์อ่านจาก CSS ของเกม (src/ui/template.html) ตอน build ⇒ แก้ค่าในเกมที่เดียว หน้านี้เปลี่ยนตามเมื่อ build ใหม่
// ชิ้นส่วนตัวอย่างใช้ CSS ของเกมจริง + markup เขียนเองแบบเดโมการ์ด (ข้อ 49) · วางใน iframe sandbox ไม่มี allow-scripts/allow-same-origin
// ⇒ ไม่มีสคริปต์ และเข้า localStorage ของเว็บไม่ได้ เซฟที่เล่นค้างไว้ไม่โดนแตะ · CSS ของเกมไม่รั่วมาทับหน้าเอกสาร
import { readFileSync, existsSync } from 'node:fs';
import { esc } from './catalog.mjs';
import { demoCard } from './demo.mjs';
import { STAT_LABELS } from '../engine/life.mjs';
import { SHOWN_STATS, BTN } from '../ui/labels.mjs';
import { movedHtml } from './nav.mjs';
import { DESIGN_AT } from './design.mjs';
import { PUBLIC_HIDE } from './gate.mjs';
import { FONT_DIR, fontsCss, playFonts } from './fonts.mjs';

export const UI_PAGE = 'dev/ui.html';
// หน้าที่ย้ายมาหน้านี้ — design.html เดิมคือดีไซน์ UI ตามคำเจ้าของ (ข้อ 42 · 57) ไม่ใช่สารบัญคำตัดสินเกม
export const UI_MOVED_FROM = 'design.html';
export const UI_TITLE = 'ดีไซน์ UI';
// ช่องภาพจอเกม: ใบ 45 (npm run shots) เขียนไฟล์ตามชื่อนี้ · ยังไม่มีไฟล์ = ช่องว่างบอกว่ารอภาพ
export const UI_SHOTS_AT = 'dev/shots/';
export const UI_SHOTS = [['start', 'เริ่มชีวิต'], ['mid', 'กลางชีวิต'], ['death', 'ตาย']];
export const UI_SHOT_W = [390, 1280];

const TEMPLATE = new URL('../ui/template.html', import.meta.url);
const APP = new URL('../ui/app.mjs', import.meta.url);

// CSS ทั้งก้อนในแท็ก style แรกของหน้าเล่น · ช่องฟอนต์ใส่ฟอนต์จริงของเกม
export function gameCss(tpl = readFileSync(TEMPLATE, 'utf8')) {
  const m = tpl.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error('src/ui/template.html: ไม่มี <style>');
  return m[1].replace('/*__FONTS__*/', () => fontFaces());
}

// ฟอนต์ที่หน้าเล่นใช้ จากตารางกลาง (src/site/fonts.mjs) — ไม่อ่านจากโฟลเดอร์ เพราะโฟลเดอร์มีฟอนต์ของหน้าอื่นด้วย (ui-redo 96)
export function gameFonts() {
  return playFonts().map(([family, weight, file]) => ({ file: `${file}.woff2`, family, weight }));
}
// หน้านี้อยู่ docs/dev/ · iframe srcdoc ใช้ที่อยู่ของหน้าแม่ ⇒ ชี้ ../fonts/ ไฟล์ชุดเดียวกับหน้าเล่น
const fontFaces = () => fontsCss(playFonts(), `../${FONT_DIR}`).trimEnd();

// บล็อกที่มีแต่ตัวแปร (:root · ธีมต่างโลก) → [{sel, vars:[[ชื่อ, ค่า]]}] · คอมเมนต์ตัดทิ้งก่อน
export function cssVars(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  for (const [, sel, body] of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decl = body.split(';').map((s) => s.trim()).filter(Boolean);
    if (!decl.length || !decl.every((d) => d.startsWith('--'))) continue;
    out.push({ sel: sel.trim().replace(/^@media[^{]*/, ''), vars: decl.map((d) => [d.slice(0, d.indexOf(':')).trim(), d.slice(d.indexOf(':') + 1).trim()]) });
  }
  return out;
}
const isColor = (v) => /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(v);

// ป้ายเมนูล่างของเกม — app.mjs ไม่ export อะไร (ต่อเป็นสคริปต์เดียว) จึงอ่านจากซอร์ส
export function menuLabels(name, src = readFileSync(APP, 'utf8')) {
  const m = src.match(new RegExp(`const ${name} = \\[([^\\n]*)\\];`));
  if (!m) throw new Error(`src/ui/app.mjs: ไม่พบ ${name}`);
  return [...m[1].matchAll(/\['[^']*', '([^']*)'\]/g)].map((x) => x[1]);
}

const meter = (k, v, d) =>
  `<li${v <= 20 ? ' class="low"' : ''}><span class="mh"><span class="mk">${esc(STAT_LABELS[k])}</span><b class="num">${v}</b>${d ? `<em${d < 0 ? ' class="dn"' : ''}><span aria-hidden="true">${d > 0 ? '▲' : '▼'}</span>${Math.abs(d)}</em>` : ''}</span><span class="br"><i style="width:${v}%"></i></span></li>`;
const choice = (n, text, fx, off) =>
  `<button class="choice" type="button"${off ? ' disabled' : ''}>${n ? `<kbd>${n}</kbd>` : ''}<span>${esc(text)}</span>${fx ? `<span class="fx"><span>${esc(fx)}</span></span>` : ''}</button>`;

// ตัวอย่างคงที่ (ไม่มีสุ่ม): ค่าสถานะ/ชื่อเป็นค่าตัวอย่าง · เนื้อการ์ดชีวิตเป็นการ์ดจริงตัวเดียวกับเดโมหน้ารวมการ์ด
function specimens(content, src) {
  const { card } = demoCard(content);
  const vals = [72, 58, 41, 18];
  const deltas = [3, -2, 0, -5];
  const sb = `<header class="sb"><div class="sb-r1"><span class="sb-who"><b>สมชาย ใจดี</b><small>ขอนแก่น · ช่วง${esc(card.stage)}</small><small class="hd-job">พนักงานบริษัท</small></span><span class="sb-age"><b>${card.age}</b><small> ปี</small></span></div><div class="hd-row"><span class="mk">ฐานะ</span><span class="hd-word">ชนชั้นกลาง</span><span class="hd-cash red"><span class="mk">เงินสด</span><b>1.2 แสน</b><span class="lw">มีกู้</span></span></div><ul class="sb-m">${SHOWN_STATS.map((k, i) => meter(k, vals[i], deltas[i])).join('')}</ul></header>`;
  const life = `<article class="card a">${sb}<div class="body"><span class="kicker">ช่วง${esc(card.stage)} · อายุ ${card.age}</span><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></div><div class="choices">${card.choices.map((t, i) => choice(i + 1, t, card.fx[i])).join('')}${choice(0, 'ทางที่ยังไม่เปิด', 'ล็อก · ต้องมีความรู้ 60', true)}</div></article>`;
  const nav = (labels) => `<nav class="mnav" aria-label="เมนู">${labels.map((l, i) => `<button type="button"${i ? '' : ' aria-expanded="true"'}><span>${esc(l)}</span></button>`).join('')}</nav>`;
  const after = `<article class="card b af"><div class="top"><b>ระหว่างชาติ</b><small>สมชาย ใจดี · จากไปอายุ 78</small></div><div class="body"><span class="kicker">ทางเกิด</span><h3 class="lead">ตัวอย่างการ์ดลายรดน้ำ (ธีม B)</h3></div><div class="choices">${choice(1, BTN.rebirth, 'ตามบุญที่ทำมา')}${choice(2, BTN.newFamily, null)}</div></article>`;
  const isekai = `<article class="card i"><div class="top"><b>ต่างโลก</b><small>ตัวอย่างธีมต่างโลก</small></div><div class="body"><span class="kicker">ปีแรก</span><h3>ตัวอย่างการ์ดต่างโลก</h3><p>สีพื้นและสีตัวอักษรสลับตามตัวแปรธีมต่างโลกของเกม</p></div><div class="choices">${choice(1, BTN.next, null)}</div></article>`;
  // ธีมต่างโลกสลับสีทั้ง body (body:has(#app > .card.i)) ⇒ ต้องอยู่กรอบของตัวเอง · ชีวิตนี้กับระหว่างชาติใช้คลาสการ์ด อยู่กรอบเดียวกันได้
  return [
    [['การ์ดเหตุการณ์ + แถบสถานะ + ปุ่ม + แถบเมนูล่าง (ชีวิตนี้)', life + nav(menuLabels('LIFE_MENU', src))], ['การ์ดระหว่างชาติ (ธีม B)', after]],
    [['การ์ดต่างโลก + แถบเมนูต่างโลก', isekai + nav(menuLabels('ISEKAI_MENU', src))]],
  ];
}

// srcdoc ของ iframe: CSS เกม (ฟอนต์ฝังอยู่ในนั้น ⇒ กรอบละราวสองร้อย KB จึงรวมให้น้อยกรอบ) + แก้ให้ตัวอย่างไม่สูงเต็มจอ (การ์ดจริงสูงตามจอ)
// เมนูล่างในเกมติดก้นจอ — ในกรอบที่มีหลายชิ้นจะทับชิ้นอื่น จึงวางต่อท้ายการ์ดแทน
const frame = (css, title, parts, h) => {
  const body = parts.map(([t, b]) => `<h4 style="margin:16px 0 6px;font:600 14px var(--ft)">${esc(t)}</h4>${b}`).join('');
  const doc = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}\n#app{padding:0 12px 12px}.card{min-height:0}.mnav{position:static;margin-top:8px}body:has(.mnav){padding-bottom:0}</style></head><body><div id="app">${body}</div></body></html>`;
  return `<figure class="ui-spec"><figcaption>${esc(title)}</figcaption><iframe title="${esc(title)}" sandbox="" style="width:100%;height:${h}px;border:1px solid var(--line);background:var(--surface)" srcdoc="${doc.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></iframe></figure>`;
};

// tpl ส่งเข้าได้ให้ด่านลองแก้สีในเกมแล้วดูว่าหน้านี้เปลี่ยนตาม
export function uiPage(content, docs, tpl = readFileSync(TEMPLATE, 'utf8')) {
  const css = gameCss(tpl);
  const src = readFileSync(APP, 'utf8');
  const groups = cssVars(tpl.match(/<style>([\s\S]*?)<\/style>/)[1]);
  const colors = groups.map((g) => [g.sel, g.vars.filter(([, v]) => isColor(v))]).filter(([, v]) => v.length);
  const others = groups.flatMap((g) => g.vars.filter(([, v]) => !isColor(v)).map(([k, v]) => [g.sel, k, v]));
  const sw = ([k, v]) => `<li><span class="sw" style="background:${esc(v)}"></span><code>${esc(k)}</code> <small>${esc(v)}</small></li>`;
  const parts = specimens(content, src);
  const shot = ([id, name]) =>
    `<div><h3>${esc(name)}</h3>${UI_SHOT_W.map((w) => {
      const f = `${UI_SHOTS_AT}${id}-${w}.png`;
      return existsSync(new URL(f, docs)) ? `<p><img src="shots/${id}-${w}.png" alt="จอ${esc(name)} กว้าง ${w}" loading="lazy" style="max-width:100%;height:auto"></p>` : `<p class="wait">${w} px — ยังไม่มีภาพ (<code>${f}</code>)</p>`;
    }).join('')}</div>`;
  const body = [
    '<style>.sws{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px 12px}.sws li{display:flex;align-items:center;gap:8px;margin:0;min-width:0}.sws small{overflow-wrap:anywhere}.sw{flex:none;width:28px;height:28px;border:1px solid var(--ink)}.ui-spec{margin:0 0 16px}.ui-spec figcaption{font-size:14px;font-weight:600;margin:0 0 4px}.fspec{margin:0 0 12px;overflow-wrap:anywhere}.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.wait{color:var(--muted);font-size:14px}.st{display:inline-block;font-size:12px;font-weight:600;padding:0 6px;border:1px solid currentColor;margin-left:6px;white-space:nowrap;line-height:1.5}.st.done{color:var(--good)}.st.pick{color:var(--accent2)}.st.wait{color:var(--ink)}.ui-live{width:min(1400px,calc(100vw - 32px));margin:0 0 16px calc(50% - min(700px,calc(50vw - 16px)))}.ui-live iframe{display:block;width:100%;height:min(900px,calc(100vh - 24px));min-height:560px;border:1px solid var(--line);background:var(--bg)}</style>',
    '<h2 id="ui-decisions">คำตัดสิน UI</h2>',
    `<p>หน้าเล่นใช้การ์ดใบเดียวกลางจอ แถบสถานะสองแถวบนการ์ด แถบเมนูล่าง · ธีมการ์ดสามแบบ: กระดาษ (ชีวิตนี้) · ลายรดน้ำ (ระหว่างชาติ) · ต่างโลก · งานปรับหน้าตาทุกชิ้นมีหน้า tweak ให้เจ้าของเลือกก่อนลงจริง · คำตัดสินเต็ม: <a href="design-ui-redo.html">คำตัดสินเกม เรื่อง ui-redo</a></p>`,
    '<h2 id="ui-colors">สี</h2>',
    '<p>อ่านจากตัวแปร CSS ของหน้าเล่น (<code>src/ui/template.html</code>) ตอน build</p>',
    ...colors.map(([sel, vars]) => `<h3><code>${esc(sel)}</code></h3><ul class="sws">${vars.map(sw).join('')}</ul>`),
    others.length ? `<h3>ค่าอื่น</h3><table><tr><th>ที่</th><th>ตัวแปร</th><th>ค่า</th></tr>${others.map(([s, k, v]) => `<tr><td><code>${esc(s)}</code></td><td><code>${esc(k)}</code></td><td>${esc(v)}</td></tr>`).join('')}</table>` : '',
    '<h2 id="ui-fonts">ตัวอักษร</h2>',
    `<p>ฟอนต์ที่ฝังในหน้าเล่น (<code>src/ui/fonts</code>) — ตัวอย่างวาดด้วยฟอนต์จริงของเกมอยู่ต้นกรอบแรกในหัวชิ้นส่วนตัวอย่าง</p>`,
    `<ul>${gameFonts().map((f) => `<li>${esc(f.family)} ${f.weight} <small>${esc(f.file)}</small></li>`).join('')}</ul>`,
    '<h2 id="ui-parts">ชิ้นส่วนตัวอย่าง</h2>',
    '<p>CSS ของเกมจริง markup เขียนเองตอน build · กรอบไม่รันสคริปต์และไม่แตะเซฟในเครื่อง · หน้าจอเกมเปลี่ยนแล้วตัวอย่างอาจไม่ตรง ดูภาพจอด้านล่างประกอบ</p>',
    frame(css, 'ฟอนต์ · ชีวิตนี้ · ระหว่างชาติ', [['ตัวอย่างฟอนต์', gameFonts().map((f) => `<p class="fspec" style="font-family:'${f.family}';font-weight:${f.weight};font-size:20px;margin:0 0 8px">${esc(f.family)} ${f.weight} — เกิดใหม่ทั้งที ชาตินี้ขอชิงมาเกิด 0123456789</p>`).join('')], ...parts[0]], 1500),
    frame(css, 'ต่างโลก', parts[1], 480),
    '<h2 id="ui-shots">ภาพจอเกม 390 / 1280</h2>',
    '<p>ภาพจาก <code>npm run shots</code> (ใบ 45) — เลนที่แก้จอเกมรันแล้ว commit ภาพ</p>',
    `<div class="shots">${UI_SHOTS.map(shot).join('')}</div>`,
  ].join('\n');
  return { title: UI_TITLE, lead: 'สี ตัวอักษร ชิ้นส่วนของหน้าเล่น และคำตัดสิน UI · โครงหน้า เนื้อครบ ยังไม่จัดสวย', body };
}


// หน้าส่งต่อของที่เดิมใต้ docs/ ของหน้าคำตัดสินเกม — design.html ไปหน้านี้ ที่เหลือไปหน้าเดิมใต้ dev/
// หน้าส่งต่อไม่ติดรหัส (ui-redo 70) ⇒ ชื่อเรื่องที่มีคำซ่อนใช้ชื่อกลาง
export const designMoved = (file, title) => (file === UI_MOVED_FROM ? movedHtml(file, UI_PAGE, UI_TITLE) : movedHtml(file, DESIGN_AT + file, PUBLIC_HIDE.test(title) ? 'คำตัดสินเกม' : title));
