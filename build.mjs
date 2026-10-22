import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

// รวม content/*.yaml ทุกไฟล์ (events ต่อกัน) แล้วฝังเป็น JSON
const events = [];
for (const f of readdirSync(new URL('./content/', import.meta.url)).filter((n) => n.endsWith('.yaml')).sort()) {
  const doc = parse(read(`./content/${f}`));
  for (const e of doc.events ?? []) {
    if (!e.id || typeof e.age !== 'number' || !Array.isArray(e.choices) || !e.choices.length) {
      throw new Error(`${f}: เหตุการณ์ ${e.id ?? '?'} ขาดฟิลด์บังคับ (id/age/choices)`);
    }
    events.push(e);
  }
}
const ids = new Set();
for (const e of events) {
  if (ids.has(e.id)) throw new Error(`id ซ้ำ: ${e.id}`);
  ids.add(e.id);
}

// ไม่มี bundler: ตัด import/export ออกแล้วต่อโมดูลตามลำดับ dependency ให้เป็นสคริปต์เดียว
const strip = (src) =>
  src.replace(/^import .*?;\s*$/gm, '').replace(/^export \* from .*$/gm, '').replace(/^export /gm, '');
const code = ['rng', 'life'].map((m) => strip(read(`./src/engine/${m}.mjs`))).join('\n') + strip(read('./src/ui/app.mjs'));
const data = `const CONTENT = ${JSON.stringify({ events }).replace(/</g, '\\u003c')};\n`;
const script = `(() => {\n${data}${code}\n})();`.replace(/<\/script/gi, '<\\/script');

writeFileSync(new URL('./docs/play.html', import.meta.url), read('./src/ui/template.html').replace('/*__SCRIPT__*/', () => script));
console.log(`docs/play.html: ${events.length} เหตุการณ์`);
