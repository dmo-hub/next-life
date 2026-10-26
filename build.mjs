import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './src/node/load.mjs';
import { buildSite } from './src/site/build.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const content = loadContent();

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const files = [...['rng', 'era', 'birth', 'family', 'finance', 'merit', 'career', 'pace', 'life', 'belief', 'afterlife', 'intro', 'titles'].map((m) => `./src/engine/${m}.mjs`), './src/ui/app.mjs'];
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

writeFileSync(new URL('./docs/play.html', import.meta.url), read('./src/ui/template.html').replace('/*__SCRIPT__*/', () => script));
console.log(`docs/play.html: ${content.events.length} เหตุการณ์ · ข้อมูลยุค ${JSON.stringify(content.era).length.toLocaleString('en-US')} ตัวอักษร`);
const site = buildSite(content);
console.log(`docs/ หน้าเว็บ: ${site.pages.join(' · ')} · ${site.facts.version}`);
