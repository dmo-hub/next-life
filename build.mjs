import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent } from './src/node/load.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

const content = loadContent();

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const code = ['rng', 'era', 'life'].map((m) => strip(read(`./src/engine/${m}.mjs`))).join('\n') + strip(read('./src/ui/app.mjs'));
const data = `const CONTENT = ${JSON.stringify(content).replace(/</g, '\\u003c')};\n`;
const script = `(() => {\n${data}${code}\n})();`.replace(/<\/script/gi, '<\\/script');

writeFileSync(new URL('./docs/play.html', import.meta.url), read('./src/ui/template.html').replace('/*__SCRIPT__*/', () => script));
console.log(`docs/play.html: ${content.events.length} เหตุการณ์ · ข้อมูลยุค ${JSON.stringify(content.era).length.toLocaleString('en-US')} ตัวอักษร`);
