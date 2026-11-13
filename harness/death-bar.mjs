// harness แกนกติกาตาย (ใบ 190): ตายเมื่อหลอดสุขภาพหมดเท่านั้น · ตารางชีพไม่ฆ่าตรงแล้ว แต่อัตราตายต้องยังตรงตาราง
// ด่าน: (1) ทุกชีวิตที่ตาย หลอดสุขภาพ = 0 ที่การ์ดตาย  (2) อัตราตายทารกจากบอทเทียบ qx อายุ 0 ของตาราง ±4σ
//       (3) ทุกชีวิตที่ตายมีสาเหตุ (st.cause ไม่ว่าง) — การเลิกทอยตรงต้องไม่ทำให้สาเหตุหาย
// ตัวควบคุม: --ctl ⇒ คาดหลอดตอนตาย = 1 แทน 0 ต้องตกทุกชีวิต (พิสูจน์ว่าด่าน (1) จับได้จริง)
// ไม่รันตัวเกมจนจบชาติ — เล่นชีวิตเดียวต่อ seed ด้วยบอทสุ่ม
import { playLife, mixSeed, qx, protoYear } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { random } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 4000);
const seed = opt('seed', 1);
const ctl = args.includes('--ctl');
const content = loadContent();

let dead = 0, notZero = 0, noCause = 0, infants = 0, expectInfants = 0, varInfants = 0;
let worst = null;
for (let i = 0; i < n; i++) {
  const r = playLife(mixSeed(seed, i), content, random, (card, st) => {
    if (card.kind !== 'death') return;
    dead++;
    const want = ctl ? 1 : 0;
    if (st.health !== want) {
      notZero++;
      worst ??= { i, age: st.age, health: st.health, cause: st.cause };
    }
    if (!st.cause) noCause++;
  });
  const st = r.state;
  // เกมยืมปีต้นแบบ (protoYear) ของแต่ละชีวิตมาอ่านตาราง ไม่ใช่ปีเกิดจริง — ค่าคาดต้องอ่านปีเดียวกับที่เกมใช้ตัดสินตาย
  const p = qx(content.era, st.sex, protoYear(content.era, st.seed, st.birthYear), 0);
  expectInfants += p;
  varInfants += p * (1 - p);
  if (r.age < 1) infants++;
}

let fail = 0;
const check = (name, ok, detail) => {
  if (!ok) fail++;
  console.log(`${ok ? 'ผ่าน' : 'ตก  '} ${name} · ${detail}`);
};
console.log(`[death-bar] n ${n} seed ${seed}${ctl ? ' · ตัวควบคุม' : ''}`);
check('ทุกชีวิตที่ตาย หลอดสุขภาพ = 0 ที่การ์ดตาย', dead === n && notZero === 0, `ตาย ${dead}/${n} · หลอดไม่ใช่ ${ctl ? 1 : 0} ${notZero}${worst ? ` · ตัวอย่าง ${JSON.stringify(worst)}` : ''}`);
check('ทุกชีวิตที่ตายมีสาเหตุ', noCause === 0, `ไม่มีสาเหตุ ${noCause}`);
const sigma = Math.sqrt(varInfants);
check('อัตราตายทารกตรงตาราง ±4σ', Math.abs(infants - expectInfants) <= 4 * sigma, `จริง ${infants} · คาด ${expectInfants.toFixed(1)} ± ${(4 * sigma).toFixed(1)} (4σ)`);
console.log(fail ? `ตก ${fail} ข้อ` : 'ผ่านทั้งหมด');
process.exit(fail ? 1 : 0);
