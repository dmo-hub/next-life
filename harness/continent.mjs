// ด่านทวีป (06a): แผนที่ · ขั้วอำนาจ · ข้อพิพาท · เกิด · ดันเจียนลับ · seed เดิมผลเดิม
// contChecks รับตัวสุ่มเป็นพารามิเตอร์ ⇒ harness-test ป้อนตัวที่พังเพื่อพิสูจน์ว่าด่านจับได้ (ตัวควบคุม)
// node harness/continent.mjs [--n 10000] [--seed 1]
import { pathToFileURL } from 'url';
import { makeRng, mixSeed, CONT_REGIONS, CONT_RACES, CONT_DISPUTES, CONT_SECRET, CONT_TIER, contNeighbors, contSecret, contNation, contBirth } from '../src/engine/index.mjs';

const pct = (x, n) => `${((100 * x) / n).toFixed(1)}%`;

export function contChecks({ n = 10000, seed = 1, nation = contNation, birth = contBirth, near = contNeighbors } = {}) {
  const out = [];
  const check = (label, ok, detail = '') => out.push({ label, ok: !!ok, detail });
  const ids = Object.keys(CONT_REGIONS);

  // แผนที่: ทุกเส้นมีสองทิศ · ชื่อมีจริง · BFS จากแคว้นแรกถึงครบ
  const bad = ids.flatMap((a) => near(a).filter((b) => !CONT_REGIONS[b] || !near(b).includes(a)).map((b) => `${a}→${b}`));
  check('แผนที่สมมาตร + ชื่อแคว้นมีจริง', bad.length === 0, bad.length ? bad.slice(0, 3).join(' · ') : `${ids.reduce((s, a) => s + near(a).length, 0) / 2} เส้น`);
  const seen = new Set([ids[0]]), q = [ids[0]];
  while (q.length) for (const b of near(q.shift())) if (!seen.has(b)) (seen.add(b), q.push(b));
  check('เดินถึงกันครบทุกแคว้น', seen.size === ids.length, `${seen.size}/${ids.length}`);
  const sBad = CONT_SECRET.filter(([a, b]) => !CONT_REGIONS[a] || !CONT_REGIONS[b] || near(a).includes(b));
  const sSym = ids.every((a) => contSecret(a).every((b) => contSecret(b).includes(a)));
  check('ทางลับ: แคว้นมีจริง · ไม่ติดกันตรง · สองทิศ', sBad.length === 0 && sSym, sBad.map((p) => p.join('↔')).join(' · ') || `${CONT_SECRET.length} เส้น`);

  // ต่อชาติ
  const ruled = ids.filter((id) => CONT_REGIONS[id].ruler);
  const majors = {}, disputes = {}, dung = {};
  let powBad = 0, dispBad = 0, dungBad = 0, again = 0;
  for (let i = 0; i < n; i++) {
    const s = mixSeed(seed, i);
    const x = nation(s);
    const p = x.powers;
    const all = [p.major, ...p.falling, ...p.rising].filter((v) => v !== undefined);
    if (!p.major || p.falling.length < 1 || p.falling.length > 2 || p.rising.length < 1 || p.rising.length > 2 || new Set(all).size !== all.length || all.some((r) => !ruled.includes(r))) powBad++;
    majors[p.major] = (majors[p.major] ?? 0) + 1;
    if (!CONT_DISPUTES[x.dispute]) dispBad++;
    disputes[x.dispute] = (disputes[x.dispute] ?? 0) + 1;
    if (x.dungeons.length < 3 || x.dungeons.length > 4 || new Set(x.dungeons).size !== x.dungeons.length) dungBad++;
    for (const d of x.dungeons) dung[d] = (dung[d] ?? 0) + 1;
    if (i < 200 && JSON.stringify(nation(s)) !== JSON.stringify(x)) again++;
  }
  check('ขั้วอำนาจ: มหาอำนาจ 1 · ขาลง/มาแรง 1–2 · ไม่ซ้ำ · มีผู้ปกครองทุกตัว', powBad === 0, `ผิด ${powBad}/${n}`);
  const noMajor = ruled.filter((r) => !majors[r]);
  check('ทุกแคว้นที่มีผู้ปกครองได้เป็นมหาอำนาจ', noMajor.length === 0, noMajor.join(' · ') || `${ruled.length} แคว้น`);
  const ds = Object.keys(CONT_DISPUTES), wSum = ds.reduce((s, d) => s + CONT_DISPUTES[d].w, 0);
  const off = ds.filter((d) => Math.abs((disputes[d] ?? 0) / n - CONT_DISPUTES[d].w / wSum) > 0.02);
  check('ข้อพิพาท 1 ข้อทุกชาติ · ครบ 8 · สัดส่วนตามน้ำหนัก ±2 จุด', dispBad === 0 && off.length === 0 && ds.every((d) => disputes[d]), off.map((d) => `${d} ${pct(disputes[d] ?? 0, n)}`).join(' · ') || ds.map((d) => pct(disputes[d] ?? 0, n)).join(' '));
  const dAvg = (f) => { const g = ids.filter(f); return g.reduce((s, id) => s + (dung[id] ?? 0), 0) / g.length; };
  const ratio = dAvg((id) => CONT_REGIONS[id].danger) / dAvg((id) => !CONT_REGIONS[id].danger);
  check('ดันเจียน 3–4 จุด · แคว้นละไม่เกิน 1 · แคว้นอันตรายถี่กว่า (×2–4)', dungBad === 0 && ratio >= 2 && ratio <= 4, `ผิด ${dungBad} · อันตราย/ปกติ ×${ratio.toFixed(2)}`);
  check('seed เดิมผลเดิม', again === 0, `ต่าง ${again}/200`);

  // เกิด
  const rng = makeRng(mixSeed(seed ^ 0xb127, 0));
  const reg = {}, race = {};
  let outside = 0;
  for (let i = 0; i < n; i++) {
    const b = birth(rng);
    reg[b.region] = (reg[b.region] ?? 0) + 1;
    race[b.race] = (race[b.race] ?? 0) + 1;
    if (!CONT_REGIONS[b.region]?.races.includes(b.race)) outside++;
  }
  const noReg = ids.filter((id) => !reg[id]), noRace = Object.keys(CONT_RACES).filter((r) => !race[r]);
  check('เกิดได้ทุกแคว้น ทุกเผ่า · ไม่มีเผ่านอกรายการแคว้น', !noReg.length && !noRace.length && outside === 0, [noReg.join(' '), noRace.join(' '), outside && `นอกรายการ ${outside}`].filter(Boolean).join(' · ') || Object.keys(CONT_RACES).map((r) => `${CONT_RACES[r].name} ${pct(race[r], n)}`).join(' · '));
  const tiers = Object.keys(CONT_TIER).sort((a, b) => CONT_TIER[b] - CONT_TIER[a]);
  const tAvg = tiers.map((t) => { const g = ids.filter((id) => CONT_REGIONS[id].tier === t); return g.reduce((s, id) => s + (reg[id] ?? 0), 0) / g.length; });
  check('ความถี่เกิดเรียงตามระดับโอกาส (ค่าเฉลี่ยกลุ่ม)', tAvg.every((v, i) => i === 0 || v < tAvg[i - 1]), tiers.map((t, i) => `${t} ${pct(tAvg[i], n)}`).join(' > '));
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
  const n = arg('--n', 10000), seed = arg('--seed', 1);
  const rows = contChecks({ n, seed });
  console.log(`ทวีป ${n} ชาติ · seed ${seed}`);
  for (const r of rows) console.log(`${r.label}: ${r.ok ? 'ผ่าน' : 'ตก'}${r.detail ? ` · ${r.detail}` : ''}`);
  const fails = rows.filter((r) => !r.ok).length;
  console.log(fails ? `ตก ${fails} ข้อ` : 'ผ่านทุกด่าน');
  process.exitCode = fails ? 1 : 0;
}
