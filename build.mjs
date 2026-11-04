import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './src/node/load.mjs';
import { buildSite } from './src/site/build.mjs';
import { readVersion, versionLines, releaseLog, notesLines } from './src/site/facts.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const content = loadContent();

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const files = [...['rng', 'era', 'birth', 'family', 'finance', 'merit', 'career', 'rank', 'pace', 'death', 'court', 'warn', 'focus', 'memory', 'life', 'goal', 'belief', 'continent', 'isekai', 'afterlife', 'intro', 'titles', 'save'].map((m) => `./src/engine/${m}.mjs`), './src/ui/art.mjs', './src/ui/shelfart.mjs', './src/ui/labels.mjs', './src/ui/app.mjs'];
// ต่อทุกโมดูลไว้ scope เดียว: function ชื่อซ้ำไม่ error แต่ตัวหลังทับตัวแรกเงียบ ๆ — ชื่อชั้นบนสุดซ้ำข้ามไฟล์ต้องหยุด build
// เลขเวอร์ชันจองชื่อไว้ก่อน: โมดูลไหนประกาศเลขเองอีก = มีซอร์สถือเลขสองที่ build หยุด
const owner = new Map([['APP_VERSION', 'src/version.json'], ['APP_BUILD', 'src/version.json'], ['RELEASE_NOTES', 'docs/whatsnew.html']]);
for (const f of files) {
  for (const [, name] of read(f).matchAll(/^(?:export )?(?:async )?(?:function\*? |const |let |class )([A-Za-z_$][\w$]*)/gm)) {
    if (owner.has(name)) throw new Error(`ชื่อ ${name} ซ้ำใน ${owner.get(name)} กับ ${f} — ต่อเป็นสคริปต์เดียวแล้วตัวหลังจะทับ`);
    owner.set(name, f);
  }
}
const code = files.map((f) => strip(read(f))).join('\n');
const data = `const CONTENT = ${JSON.stringify(content).replace(/</g, '\\u003c')};\n`;
// รุ่นปัจจุบันไม่มีโน้ต (bump ของเลน) = เตือนเฉย ๆ ไม่หยุด build · แผ่นในเกมใช้รุ่นล่าสุดที่มีโน้ต
const ver = readVersion();
const notes = releaseLog(read('./docs/whatsnew.html'));
if (notes[0]?.v !== ver.version) console.warn(`⚠ ${ver.version} ไม่มีข้อในแพตช์โน้ต — แผ่นแจ้งอัปเดตในเกมใช้ ${notes[0]?.v ?? '(ไม่มีรุ่นไหนมีโน้ต)'}`);
const script = `(() => {\n${versionLines(ver)}${notesLines(notes)}${data}${code}\n})();`.replace(/<\/script/gi, '<\\/script');

// ฟอนต์ฝังในไฟล์ให้เกมเปิดออฟไลน์ได้ และภาพแชร์ (canvas) ได้ Srisakdi จริงไม่ตกไปฟอนต์สำรอง
// ไฟล์ใน src/ui/fonts ตัดเหลือไทยทั้งบล็อก + ASCII + เครื่องหมายที่เกมใช้ (ชื่อสุ่ม/ข้อความประกอบไม่ตายตัว จึงไม่ตัดตามตัวที่ปรากฏ)
// Srisakdi มีแค่ 700: ทุกที่ที่ใช้เป็นตัวหนา (font-weight 700 หรือ <b>) · Noto Sans Thai = ฟอนต์หน้าเล่น · Sarabun ยังใช้ในภาพแชร์และภาพชั้นสมุด (canvas)
const PLAY_FONTS = [['Noto Sans Thai', 400, 'NotoSansThai-Regular'], ['Noto Sans Thai', 600, 'NotoSansThai-SemiBold'], ['Sarabun', 400, 'Sarabun-Regular'], ['Sarabun', 600, 'Sarabun-SemiBold'], ['Srisakdi', 700, 'Srisakdi-Bold']];
const fonts = PLAY_FONTS.map(([family, weight, file]) => {
  const b64 = readFileSync(new URL(`./src/ui/fonts/${file}.woff2`, import.meta.url)).toString('base64');
  return `@font-face { font-family:"${family}"; font-weight:${weight}; font-style:normal; font-display:swap; src:url(data:font/woff2;base64,${b64}) format('woff2'); }`;
}).join('\n');

writeFileSync(new URL('./docs/play.html', import.meta.url), read('./src/ui/template.html').replace('/*__FONTS__*/', () => fonts).replace('/*__SCRIPT__*/', () => script));
// หน้า tweak ที่ต้องหน้าตาเกมจริง (ui-redo 46): ฉีด CSS ของ template + ฟอนต์หน้าเล่นตอน build — หน้าไม่ลอก CSS เอง แก้เกมแล้วต้นแบบตามทันที
const GAME_CSS = ['/*GAME-CSS:START*/', '/*GAME-CSS:END*/'];
const gameCss = read('./src/ui/template.html').match(/<style>([\s\S]*?)<\/style>/)[1].replace('/*__FONTS__*/', () => fonts.split('\n').filter((f) => f.includes('Noto Sans Thai')).join('\n'));
for (const page of ['./docs/dev/ui-redo/head-tweak.html']) {
  const html = read(page);
  const [a, b] = GAME_CSS.map((m) => html.indexOf(m));
  if (a < 0 || b < a) throw new Error(`${page}: ต้องมี ${GAME_CSS.join(' … ')}`);
  writeFileSync(new URL(page, import.meta.url), html.slice(0, a + GAME_CSS[0].length) + gameCss + html.slice(b));
}
console.log(`docs/play.html: ${content.events.length} เหตุการณ์ · ข้อมูลยุค ${JSON.stringify(content.era).length.toLocaleString('en-US')} ตัวอักษร`);
const site = buildSite(content);
console.log(`docs/ หน้าเว็บ: ${site.pages.join(' · ')} · ${site.facts.version}`);
