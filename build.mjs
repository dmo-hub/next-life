import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { loadContent } from './src/node/load.mjs';
import { buildSite, toLf } from './src/site/build.mjs';
import { readVersion, versionLines, releaseLog, notesLines } from './src/site/facts.mjs';
import { FONTS, FONT_DIR, FONT_CSS, fontsCss, playFonts } from './src/site/fonts.mjs';
import { PLAY_FILES, ART_FILES, artFile, playScripts, swJs } from './src/site/play-files.mjs';
import { loadCardPics, cardArtBuild } from './src/site/card-art.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const content = loadContent();

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const files = [...['rng', 'dlc', 'era', 'birth', 'family', 'finance', 'merit', 'career', 'rank', 'pace', 'death', 'court', 'cadet', 'warn', 'focus', 'tree', 'memory', 'past', 'jobwords', 'life', 'goal', 'belief', 'continent', 'isekai', 'afterlife', 'intro', 'titles', 'save'].map((m) => `./src/engine/${m}.mjs`), './src/ui/art.mjs', './src/ui/shelfart.mjs', './src/ui/labels.mjs', './src/ui/treeview.mjs', './src/ui/app.mjs'];
// โมดูลที่ถูก import แต่ไม่อยู่ในลิสต์ = ไม่ถูกต่อเข้า play.js ⇒ ReferenceError ในเบราว์เซอร์ (node รันผ่านเพราะ import จริง) — ต้องหยุด build
// barrel (มีแต่ export * from) ไม่มีโค้ดให้ต่อ จึงยกเว้น
const bundled = new Set(files.map((f) => new URL(f, import.meta.url).href));
const isBarrel = (href) => read(href).split('\n').every((l) => /^(|\/\/.*|export \* from .*)$/.test(l.trim()));
for (const f of files) {
  for (const [, spec] of read(f).matchAll(/^import .*? from '(\.[^']+)';/gm)) {
    const dep = new URL(spec, new URL(f, import.meta.url)).href;
    if (!bundled.has(dep) && !isBarrel(dep)) throw new Error(`${f} import ${spec} แต่ไม่อยู่ในลิสต์ files ของ build.mjs — play.js จะไม่มีโมดูลนี้`);
  }
}
// ต่อทุกโมดูลไว้ scope เดียว: function ชื่อซ้ำไม่ error แต่ตัวหลังทับตัวแรกเงียบ ๆ — ชื่อชั้นบนสุดซ้ำข้ามไฟล์ต้องหยุด build
// เลขเวอร์ชันจองชื่อไว้ก่อน: โมดูลไหนประกาศเลขเองอีก = มีซอร์สถือเลขสองที่ build หยุด
const owner = new Map([['APP_VERSION', 'src/version.json'], ['APP_BUILD', 'src/version.json'], ['RELEASE_NOTES', 'docs/whatsnew.html'], ['ART_SRC', 'src/ui/cardpics']]);
for (const f of files) {
  for (const [, name] of read(f).matchAll(/^(?:export )?(?:async )?(?:function\*? |const |let |class )([A-Za-z_$][\w$]*)/gm)) {
    if (owner.has(name)) throw new Error(`ชื่อ ${name} ซ้ำใน ${owner.get(name)} กับ ${f} — ต่อเป็นสคริปต์เดียวแล้วตัวหลังจะทับ`);
    owner.set(name, f);
  }
}
const code = files.map((f) => strip(read(f))).join('\n');
// รุ่นปัจจุบันไม่มีโน้ต (bump ของเลน) = เตือนเฉย ๆ ไม่หยุด build · แผ่นในเกมใช้รุ่นล่าสุดที่มีโน้ต
const ver = readVersion();
const notes = releaseLog(read('./docs/whatsnew.html'));
if (notes[0]?.v !== ver.version) console.warn(`⚠ ${ver.version} ไม่มีข้อในแพตช์โน้ต — แผ่นแจ้งอัปเดตในเกมใช้ ${notes[0]?.v ?? '(ไม่มีรุ่นไหนมีโน้ต)'}`);
// หน้าเล่นแยกไฟล์ (ui-redo 96 · ข้อ 192 203 204): HTML เหลือ CSS + โครงหน้าเปิด · ข้อมูลเกม/สคริปต์เป็นไฟล์ชื่อคงที่ต่อ ?v=เลขรุ่น ให้เบราว์เซอร์แคชได้
// ข้อมูลอยู่ไฟล์แยกจากโค้ด: เนื้อหาเปลี่ยนบ่อยกว่าโค้ด และไฟล์ข้อมูลใหญ่กว่าโค้ดหลายเท่า
const out = (rel, text) => {
  const url = new URL(`./docs/${rel}`, import.meta.url);
  const next = toLf(text);
  if (!existsSync(url) || readFileSync(url, 'utf8') !== next) writeFileSync(url, next);
};
out(PLAY_FILES.data, `self.NL_CONTENT = ${JSON.stringify(content).replace(/</g, '\\u003c')};\n`);
// ภาพการ์ด (ใบ 210 · ข้อ 494): ไฟล์แยกตามวัย · play.js รู้แค่วัย → ชื่อไฟล์ + hash · ไฟล์ภาพชื่ออื่นที่ค้างใน docs/ (play-art.js ก่อนแบ่ง) ลบทิ้ง
const art = cardArtBuild(await loadCardPics(), [...content.events, ...content.isekai]);
for (const g of art.groups) out(artFile(g.id), g.text);
for (const f of readdirSync(new URL('./docs/', import.meta.url))) if (/^play-art.*\.js$/.test(f) && !ART_FILES.includes(f)) rmSync(new URL(`./docs/${f}`, import.meta.url));
const artHash = art.hash;
out(PLAY_FILES.app, `(() => {\n${versionLines(ver)}${notesLines(notes)}const ART_SRC = ${JSON.stringify(art.srcByStage)};\nconst CONTENT = self.NL_CONTENT;\n${code}\n})();\n`);

// ฟอนต์ไฟล์ในเว็บชุดเดียวทุกหน้า (ข้อ 205) · ต้นฉบับ src/ui/fonts ตัดเหลือไทยทั้งบล็อก + ASCII + เครื่องหมายที่เกมใช้ (src/ui/fonts/README.md)
// ภาพแชร์ (canvas) รอ document.fonts.load ก่อนวาด ⇒ ได้ Srisakdi จริงแม้ฟอนต์ไม่ได้ฝังในหน้าแล้ว
mkdirSync(new URL(`./docs/${FONT_DIR}`, import.meta.url), { recursive: true });
for (const [, , file] of FONTS) {
  const src = readFileSync(new URL(`./src/ui/fonts/${file}.woff2`, import.meta.url));
  const dst = new URL(`./docs/${FONT_DIR}${file}.woff2`, import.meta.url);
  if (!existsSync(dst) || !readFileSync(dst).equals(src)) writeFileSync(dst, src);
}
out(FONT_CSS, fontsCss(FONTS, ''));
const playFaces = fontsCss(playFonts(), FONT_DIR).trimEnd();
out(PLAY_FILES.sw, swJs(ver.version, playFonts().map(([, , f]) => `${FONT_DIR}${f}.woff2`), artHash));
writeFileSync(new URL('./docs/play.html', import.meta.url), toLf(read('./src/ui/template.html').replace('/*__FONTS__*/', () => playFaces).replace('<!--__SCRIPTS__-->', () => playScripts(ver.version))));
console.log(`docs/play.html: ${content.events.length} เหตุการณ์ · ข้อมูลยุค ${JSON.stringify(content.era).length.toLocaleString('en-US')} ตัวอักษร · ภาพการ์ด ${art.groups.map((g) => `${artFile(g.id)} ${g.count} ภาพ ${Buffer.byteLength(g.text).toLocaleString('en-US')} B`).join(' · ')}`);
const site = buildSite(content);
console.log(`docs/ หน้าเว็บ: ${site.pages.join(' · ')} · ${site.facts.version}`);
