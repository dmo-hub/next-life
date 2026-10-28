// วัดค่าเฉลี่ยตัวคูณปัจจัยเสี่ยงการตาย (B110) ของคนที่ยังมีชีวิต ต่อเพศ×ช่วงอายุ×สาเหตุ แล้วเขียนทับบล็อก norm ใน data/death-causes.json
// รันใหม่เมื่อเนื้อหาเปลี่ยนอัตราติดธงเสี่ยง (smoker heavy_drinker sporty) — ไม่งั้นค่าเฉลี่ยประชากรเลื่อนออกจากตารางชีพ (ด่าน 3b)
// ใช้: node scripts/death-norm.mjs [--n 6000] [--seed 7]
import { readFileSync, writeFileSync } from 'node:fs';
import { playLife, mixSeed, causeBand, riskOf, DEATH_RISK } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random } from '../harness/bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 6000);
const seed = opt('seed', 7);
const content = loadContent();
const era = content.era;
const keys = [...new Set(Object.values(DEATH_RISK).flatMap(Object.keys))];
const sexes = ['ชาย', 'หญิง'];
const acc = Object.fromEntries(sexes.map((s) => [s, Object.fromEntries(keys.map((k) => [k, era.causes.ages.map(() => [0, 0])]))]));
for (let i = 0; i < n; i++) {
  let last = -1;
  playLife(mixSeed(seed, i), content, random, (card, st) => {
    if (st.age === last || st.dead) return;
    last = st.age;
    const b = causeBand(era, st.age);
    for (const k of keys) {
      acc[st.sex][k][b][0] += riskOf(st, k);
      acc[st.sex][k][b][1]++;
    }
  });
}
const file = new URL('../data/death-causes.json', import.meta.url);
let text = readFileSync(file, 'utf8');
const nl = text.includes('\r\n') ? '\r\n' : '\n';
const note = 'ค่าเฉลี่ยตัวคูณปัจจัยเสี่ยง (DEATH_RISK) ของคนที่ยังมีชีวิตในเพศ×ช่วงอายุนั้น วัดจากบอทสุ่มของ harness — หารตัวคูณรายคนด้วยค่านี้ ทั้งประชากรจึงตายตามตารางชีพเท่าเดิม · เนื้อหาเปลี่ยนอัตราติดธงเมื่อไรต้องวัดใหม่ (scripts/death-norm.mjs)';
const lines = [' "norm": {', `  "note": "${note}",`, '  "assumption": true,'];
sexes.forEach((s, i) => {
  lines.push(`  "${s}": {`);
  keys.forEach((k, j) => lines.push(`   "${k}": [${acc[s][k].map(([x, c]) => (c ? Number((x / c).toFixed(3)) : 1)).join(', ')}]${j < keys.length - 1 ? ',' : ''}`));
  lines.push(`  }${i < sexes.length - 1 ? ',' : ''}`);
});
lines.push(' },');
text = text.replace(/ "norm": \{[\s\S]*?\r?\n \},\r?\n/, '');
text = text.replace(/ "rules": \{/, lines.join(nl) + nl + ' "rules": {');
writeFileSync(file, text);
console.log(`เขียน norm จาก ${n} ชีวิต · seed ${seed}`);
