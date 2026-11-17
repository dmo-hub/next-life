// ด่านผีญาติ (โลกซ้อนทับ ใบ 26): ตระกูลจริงไปถึงแค่ขั้น 1 ⇒ บังคับขั้นที่ทายาท (heir.overlap) แล้วนับการ์ดที่ออก
// สร้างตระกูลสั้น 2 รุ่น: รุ่น 1 เล่นจนตายและผ่านปรโลกตามปกติ → ตั้ง heir.overlap/deadKin เหมือนที่ปรโลกส่งต่อตระกูลค่า > 0 → รุ่น 2 เล่นเต็ม
// ด่าน (ตก = exit 1):
//   (1) ขั้น 0 = 0: นับจากขั้น ณ ตอนการ์ดออก (บอทสุ่มข้ามโลกจริงได้ ขั้นตอนเกิดไม่ใช่ตัวตัดสิน) · ชุดขั้น 0 ที่ไม่ข้ามโลกมีพ่อแม่ตายแล้วก็ต้องไม่ออก
//   (2) ขั้น 1 ออก > 0 ทั้งชีวิตไทยและปรโลก · ชีวิตไทยออกเฉพาะสีหน้าที่ตรงกับ pickKinGhost ของรายชื่อตอนนั้น
//   (3) รุ่นของผีที่ถูกเลือก: ส่วนใหญ่ห่างไม่เกิน 2 รุ่น (พิมพ์สัดส่วน) · ผีไม่มีชื่อ/สัตว์/self_harm = 0
//   (4) ปรโลกไม่ยาวขึ้น: จำนวนการ์ดปรโลกเฉลี่ยของทางลูก (ancestor) ที่ได้ฉากผีญาติ เทียบกับที่ไม่ได้ ต่างกันไม่เกิน 1 ใบ
//   (5) pickKinGhost ไม่ดึง st.rng: เรียกซ้ำแล้ว state.rng ไม่ขยับ · ผลเท่ากันทุกครั้ง
import { playLife, playAfterlife, nextLife, mixSeed, overlapStageOf, PATHS } from '../src/engine/index.mjs';
import { pickKinGhost, deadKinOf } from '../src/engine/family.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 200);
const seed = opt('seed', 1);
const content = loadContent();
const LIFE_IDS = new Set(content.events.filter((e) => e.when?.kin_ghost && e.stage !== 'ระหว่างชาติ').map((e) => e.id));
const AFTER_IDS = new Set(content.events.filter((e) => e.when?.kin_ghost && e.stage === 'ระหว่างชาติ').map((e) => e.id));
if (!LIFE_IDS.size || !AFTER_IDS.size) {
  console.log('ไม่มีการ์ดที่ติด when.kin_ghost ในเนื้อหา');
  process.exit(1);
}
const P_CHILD = PATHS.findIndex((p) => p.id === 'child');
const kidPath = (bot) => (card, rng, h) => (card.kind === 'path' && !card.locked?.[P_CHILD] && P_CHILD < card.choices.length ? P_CHILD : bot(card, rng, h));

const fails = [];
const fail = (m) => fails.push(m);
const rows = [];
// ขั้นสูงสุดที่ตระกูลจริงไปถึงคือขั้น 1 (OVERLAP_STAGE_MIN ขั้น 2+ = Infinity) ⇒ ค่าที่ตั้งได้มีแค่ 0 กับ ≥ 1
const stages = [0, 1];
for (const [name, base] of Object.entries(BOTS)) {
  const bot = kidPath(base);
  const r = { name, by: stages.map(() => ({ lives: 0, life: 0, after: 0, afterLives: 0 })), gap: [0, 0, 0, 0], mood: { haunt: 0, warn: 0 }, bad: 0, zero: 0, rngMoved: 0, unstable: 0, afCards: { with: [], without: [] } };
  rows.push(r);
  for (let i = 0; i < n; i++) {
    const s = mixSeed(seed, i * 7919);
    const g1 = playLife(s, content, bot);
    const af1 = playAfterlife(g1.state, bot);
    if (!af1.heir) continue;
    for (const stage of stages) {
      // ส่งต่อตามปกติ แล้วตั้งค่าที่ตระกูลค่า > 0 จะได้จากปรโลก (afterlife.mjs) — ขั้น 0 ไม่มีทั้ง overlap และ deadKin
      const heirKin = [...(g1.state.deadKin ?? []), ...deadKinOf(g1.state)];
      const af = { ...af1, heir: { ...af1.heir, ...(stage && { overlap: stage }), ...(stage && heirKin.length && { deadKin: heirKin }) } };
      const st = nextLife(af);
      const seen = [];
      const g2 = playLife(mixSeed(s, 99), content, bot, (card, cur) => {
        if (LIFE_IDS.has(card.id)) {
          seen.push(card.id);
          if (overlapStageOf(cur) < 1) r.zero++;
          const g = pickKinGhost(cur);
          if (!g) r.bad++;
          else {
            r.mood[g.mood]++;
            const want = cur.content.events.find((e) => e.id === card.id)?.when.kin_ghost ?? [];
            if (!want.includes(g.mood)) r.bad++;
            const d = Math.max(0, (cur.gen ?? 1) - g.gen);
            r.gap[Math.min(d, 3)]++;
            if (!g.name || g.role === 'pet' || g.role === 'herd') r.bad++;
          }
        }
      }, st);
      const b = r.by[stage];
      b.lives++;
      b.life += seen.length;
      const state = g2.state;
      // ชีวิตเดินเท่าเดิม: เรียกซ้ำไม่ขยับ rng และผลคงที่
      const before = JSON.stringify(state.rng);
      const a = JSON.stringify(pickKinGhost(state));
      for (let k = 0; k < 3; k++) if (JSON.stringify(pickKinGhost(state)) !== a) r.unstable++;
      if (JSON.stringify(state.rng) !== before) r.rngMoved++;
      let got = 0;
      const af2 = playAfterlife(state, bot, (card, a2) => {
        if (AFTER_IDS.has(card.id)) {
          got++;
          if (overlapStageOf(a2.st) < 1) r.zero++;
          const g = pickKinGhost(a2.st);
          const want = card.id.includes('haunt') ? 'haunt' : 'warn';
          if (!g || g.mood !== want) r.bad++;
        }
      });
      b.after += got;
      b.afterLives++;
      if (af2.path === 'child' && stage === 1) (got ? r.afCards.with : r.afCards.without).push(af2.cards);
    }
  }
}

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const lines = [];
for (const r of rows) {
  const t = (k) => r.by.reduce((s, b) => s + b[k], 0);
  lines.push(`${r.name.padEnd(10)} ชีวิต: ${r.by.map((b, k) => `ขั้น${k}=${b.life}/${b.lives}`).join(' ')} · ปรโลก: ${r.by.map((b, k) => `ขั้น${k}=${b.after}/${b.afterLives}`).join(' ')}`);
  lines.push(`           ผี ทวง ${r.mood.haunt} เตือน ${r.mood.warn} · ห่างรุ่น 0/1/2/3+ = ${r.gap.join('/')} · ปรโลกทางลูกขั้น1 ใบเฉลี่ย มีฉากผี ${mean(r.afCards.with).toFixed(2)} (${r.afCards.with.length}) ไม่มี ${mean(r.afCards.without).toFixed(2)} (${r.afCards.without.length})`);
  if (r.zero) fail(`${r.name}: การ์ดผีญาติออกตอนขั้นซ้อนทับ 0 จำนวน ${r.zero}`);
  for (const k of [1]) {
    if (!r.by[k].life) fail(`${r.name}: ขั้น ${k} ชีวิตไม่ออกผีญาติเลย`);
    if (!r.by[k].after) fail(`${r.name}: ขั้น ${k} ปรโลกไม่ออกฉากผีญาติเลย`);
  }
  if (r.bad) fail(`${r.name}: การ์ดผีญาติผิดเงื่อนไข ${r.bad}`);
  if (r.rngMoved) fail(`${r.name}: pickKinGhost ขยับ st.rng ${r.rngMoved}`);
  if (r.unstable) fail(`${r.name}: pickKinGhost ผลไม่คงที่ ${r.unstable}`);
  const near = r.gap[0] + r.gap[1] + r.gap[2];
  if (near < (near + r.gap[3]) * 0.5) fail(`${r.name}: ผีส่วนใหญ่ไม่ได้ห่างไม่เกิน 2 รุ่น`);
  if (r.afCards.with.length && r.afCards.without.length && Math.abs(mean(r.afCards.with) - mean(r.afCards.without)) > 1) fail(`${r.name}: ปรโลกยาวขึ้น/สั้นลงเกิน 1 ใบเมื่อมีฉากผี`);
}
console.log(lines.join('\n'));
console.log(fails.length ? `ตก ${fails.length} ข้อ\n${fails.join('\n')}` : 'ผ่านทุกด่าน');
process.exit(fails.length ? 1 : 0);
