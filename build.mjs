import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './src/node/load.mjs';
import { buildSite, toLf } from './src/site/build.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const content = loadContent();

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const files = [...['rng', 'era', 'birth', 'family', 'finance', 'merit', 'career', 'rank', 'pace', 'death', 'court', 'warn', 'focus', 'memory', 'life', 'goal', 'belief', 'continent', 'isekai', 'afterlife', 'intro', 'titles', 'save'].map((m) => `./src/engine/${m}.mjs`), './src/ui/art.mjs', './src/ui/shelfart.mjs', './src/ui/labels.mjs', './src/ui/app.mjs'];
// ต่อทุกโมดูลไว้ scope เดียว: function ชื่อซ้ำไม่ error แต่ตัวหลังทับตัวแรกเงียบ ๆ — ชื่อชั้นบนสุดซ้ำข้ามไฟล์ต้องหยุด build
const owner = new Map();
for (const f of files) {
  for (const [, name] of read(f).matchAll(/^(?:export )?(?:async )?(?:function\*? |const |let |class )([A-Za-z_$][\w$]*)/gm)) {
    if (owner.has(name)) throw new Error(`ชื่อ ${name} ซ้ำใน ${owner.get(name)} กับ ${f} — ต่อเป็นสคริปต์เดียวแล้วตัวหลังจะทับ`);
    owner.set(name, f);
  }
}
const code = files.map((f) => strip(read(f))).join('\n');
const data = `const CONTENT = ${JSON.stringify(content).replace(/</g, '\\u003c')};\n`;
const script = `(() => {\n${data}${code}\n})();`.replace(/<\/script/gi, '<\\/script');

// ฟอนต์ฝังในไฟล์ให้เกมเปิดออฟไลน์ได้ และภาพแชร์ (canvas) ได้ Srisakdi จริงไม่ตกไปฟอนต์สำรอง
// ไฟล์ใน src/ui/fonts ตัดเหลือไทยทั้งบล็อก + ASCII + เครื่องหมายที่เกมใช้ (ชื่อสุ่ม/ข้อความประกอบไม่ตายตัว จึงไม่ตัดตามตัวที่ปรากฏ)
// Srisakdi มีแค่ 700: ทุกที่ที่ใช้เป็นตัวหนา (font-weight 700 หรือ <b>)
const PLAY_FONTS = [['Pridi', 400, 'Pridi-Regular'], ['Pridi', 600, 'Pridi-SemiBold'], ['Sarabun', 400, 'Sarabun-Regular'], ['Sarabun', 600, 'Sarabun-SemiBold'], ['Srisakdi', 700, 'Srisakdi-Bold']];
const fonts = PLAY_FONTS.map(([family, weight, file]) => {
  const b64 = readFileSync(new URL(`./src/ui/fonts/${file}.woff2`, import.meta.url)).toString('base64');
  return `@font-face { font-family:${family}; font-weight:${weight}; font-style:normal; font-display:swap; src:url(data:font/woff2;base64,${b64}) format('woff2'); }`;
}).join('\n');

writeFileSync(new URL('./docs/play.html', import.meta.url), toLf(read('./src/ui/template.html').replace('/*__FONTS__*/', () => fonts).replace('/*__SCRIPT__*/', () => script)));
console.log(`docs/play.html: ${content.events.length} เหตุการณ์ · ข้อมูลยุค ${JSON.stringify(content.era).length.toLocaleString('en-US')} ตัวอักษร`);
const site = buildSite(content);
console.log(`docs/ หน้าเว็บ: ${site.pages.join(' · ')} · ${site.facts.version}`);
