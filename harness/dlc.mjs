// ด่านสวิตช์ DLC (dlc-split 02): สองสถานะด้วยตัวเลือกเดียว (NL_DLC) · ด่านนี้ตั้งสถานะเองทั้งสองฝั่งแล้วเทียบกัน
// ล็อก = ไม่มีชีวิตไหนเจอการ์ดชวนต่างโลก ทางเกิดที่ 3 ทริป ค่าซ้อนทับ การ์ดนัดซ้อนทับ/เพี้ยน · เลขลำดับปุ่มทางเกิดไม่เลื่อน · ทายาทรับสถานะล็อกต่อ
// ปลดหมด = ตัวควบคุม: ต้องเจอของพวกนั้นจริง ไม่งั้นตัวนับในฝั่งล็อกที่ได้ 0 พิสูจน์อะไรไม่ได้
// ผลเท่าเดิมของฝั่งปลดหมดเทียบ sha ฐานอยู่ที่ npm run lifehash (ไม่ซ้ำที่นี่)
import { playLife, playAfterlife, nextLife, setDlcDefault, setDlcFrozen, dlcOpen, DLC_KEYS, DLC_LOCKED, DLC_OPEN, overlapOf, snapshot, restore, mixSeed, makeRng, PATHS } from '../src/engine/index.mjs';
import { loadContent } from '../src/node/load.mjs';
import { BOTS } from './bots.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const n = opt('n', 40);
const seed = opt('seed', 1);
const GENS = 3;
const content = loadContent();
const ISEKAI_ID = PATHS.findIndex((p) => p.id === 'isekai');
const SCHEDULED = /^(overlap_|drift_|cp_overlap_|isekai_)/;
const OVERLAP_CARD = /^(overlap_|drift_)/;

// เดินตระกูลละ GENS ชาติผ่านปรโลกจริง · เก็บตัวนับต่อสถานะ
function walk(dlc) {
  // ชุดล็อกต้องล็อกจริง ไม่ปลดเองตามเงื่อนไข (ชุดปลดตามเงื่อนไขอยู่ท้ายไฟล์)
  setDlcFrozen(true);
  setDlcDefault(dlc);
  const c = { lives: 0, entry: 0, trip: 0, sched: 0, ovCards: 0, overlapRaw: 0, overlapMax: 0, trips: 0, isekaiPathOpen: 0, isekaiPathHidden: 0, isekaiLives: 0, blessedText: 0, stampBad: 0, heirBad: 0, pathCards: 0, pathLen: new Set(), pathIdx: [] };
  for (const [name, bot] of Object.entries(BOTS)) {
    for (let i = 0; i < n; i++) {
      let st = null;
      for (let g = 0; g < GENS; g++) {
        const sd = mixSeed(seed, i * 7 + g);
        const run = playLife(sd, content, bot, (card) => {
          if (card.entry) c.entry++;
          if (card.trip) c.trip++;
          if (SCHEDULED.test(card.id ?? '')) c.sched++;
          if (OVERLAP_CARD.test(card.id ?? '')) c.ovCards++;
        }, st ?? undefined);
        c.lives++;
        const s = run.state;
        c.overlapMax = Math.max(c.overlapMax, s.overlap ?? 0, overlapOf(s));
        c.trips += s.trips?.length ?? 0;
        const wantStamp = dlc.isekai === false;
        if (wantStamp ? JSON.stringify(s.dlc) !== JSON.stringify(DLC_LOCKED) : 'dlc' in s) c.stampBad++;
        const af = playAfterlife(s, bot, (card, a) => {
          if (card.kind !== 'path') return;
          c.pathCards++;
          c.pathLen.add(card.choices.length);
          if (a.from) return;
          c.pathIdx.push(card.choices.map((t) => t.slice(0, 6)).join('|'));
          if (card.hidden?.[ISEKAI_ID]) c.isekaiPathHidden++;
          else if (!card.locked?.[ISEKAI_ID]) c.isekaiPathOpen++;
          if (/เทพธิดา/.test(card.text)) c.blessedText++;
        });
        c.isekaiLives += af.isekaiLives.length;
        // ช่องดิบ ไม่ผ่าน overlapOf — ล็อกแล้วต้องไม่ถูกเขียนเลย ไม่ใช่แค่อ่านได้ 0
        c.overlapRaw = Math.max(c.overlapRaw, s.overlap ?? 0, af.heir?.overlap ?? 0);
        if (!af.heir) break;
        if (dlc.isekai === false ? JSON.stringify(af.heir.dlc) !== JSON.stringify(DLC_LOCKED) : af.heir.dlc !== DLC_OPEN && JSON.stringify(af.heir.dlc) !== JSON.stringify(DLC_OPEN)) c.heirBad++;
        st = nextLife(af);
        if (dlc.isekai === false ? JSON.stringify(st.dlc) !== JSON.stringify(DLC_LOCKED) : 'dlc' in st) c.stampBad++;
      }
    }
    void name;
  }
  return c;
}

const fails = [];
const check = (name, ok, detail = '') => {
  console.log(`${name}: ${ok ? 'ผ่าน' : 'ตก'}${detail ? ` · ${detail}` : ''}`);
  if (!ok) fails.push(name);
};

const open = walk({ ...DLC_OPEN });
const locked = walk({ ...DLC_LOCKED });
// ต่างโลกเปิดแต่ซ้อนทับล็อก: ชาติต่างโลกยังเกิดได้ ค่าซ้อนทับต้องไม่ขยับ (ปลดทีละก้อน)
const half = walk({ ...DLC_OPEN, overlap: false, dungeon: false });
console.log(`DLC สวิตช์ · ${Object.keys(BOTS).length} บอท × ${n} ตระกูล × ${GENS} ชาติ · seed ${seed} (ชีวิต ปลดหมด ${open.lives} · ล็อก ${locked.lives})`);

// ตัวควบคุม: ฝั่งปลดหมดต้องเจอของที่ฝั่งล็อกถูกบอกว่าไม่มี — ไม่เจอ = ตัวนับตาบอด
check('ตัวควบคุม ปลดหมด: เจอการ์ดชวน · ทางเกิดต่างโลกกดได้ · ชาติต่างโลก · ค่าซ้อนทับ', open.entry > 0 && open.isekaiPathOpen > 0 && open.isekaiLives > 0 && open.overlapMax > 0,
  `ชวน ${open.entry} · ปุ่มเปิด ${open.isekaiPathOpen} · ชาติต่างโลก ${open.isekaiLives} · ซ้อนทับสูงสุด ${open.overlapMax}`);
check('ปลดหมด: ไม่มีช่อง dlc บนชีวิตและทายาท (ไบต์เท่าเดิม)', open.stampBad === 0 && open.heirBad === 0, `stamp ${open.stampBad} · heir ${open.heirBad}`);

check('ล็อก: การ์ดชวน/ทริปต่างโลก = 0', locked.entry === 0 && locked.trip === 0 && locked.trips === 0, `ชวน ${locked.entry} · ทริป ${locked.trip}/${locked.trips}`);
check('ล็อก: ค่าซ้อนทับ = 0 ทุกชีวิต (ค่าอ่าน+ช่องดิบ)', locked.overlapMax === 0 && locked.overlapRaw === 0, `อ่าน ${locked.overlapMax} · ดิบ ${locked.overlapRaw}`);
check('ล็อก: การ์ดนัดซ้อนทับ/เพี้ยน/ต่างโลก = 0', locked.sched === 0, `${locked.sched}`);
check('ล็อก: ชีวิตเข้าต่างโลก = 0', locked.isekaiLives === 0, `${locked.isekaiLives} ชาติ`);
check('ล็อก: ทางเกิดที่ 3 ซ่อน+กดไม่ได้ทุกใบ · ไม่มีคำเทพธิดา', locked.isekaiPathOpen === 0 && locked.isekaiPathHidden === locked.pathIdx.length && locked.blessedText === 0,
  `ใบทางเกิด ${locked.pathIdx.length} · ซ่อน ${locked.isekaiPathHidden} · เปิด ${locked.isekaiPathOpen} · มีคำเทพธิดา ${locked.blessedText}`);
// เลขลำดับปุ่มไม่เลื่อน: จำนวนปุ่มและข้อความปุ่มชุดเดียวกับตอนปลด (ปุ่มที่ซ่อนยังอยู่ในแถว)
check('ล็อก: แถวปุ่มทางเกิดเท่าตอนปลด (เลขลำดับในเซฟไม่เลื่อน)', [...locked.pathLen].every((l) => open.pathLen.has(l)) && locked.pathCards > 0 && new Set(locked.pathIdx).size === new Set(open.pathIdx).size,
  `จำนวนปุ่มล็อก ${[...locked.pathLen]} · ปลด ${[...open.pathLen]} · ใบ ${locked.pathCards}`);
check('ตัวควบคุม ต่างโลกเปิด+ซ้อนทับล็อก: ยังเข้าต่างโลกได้', half.isekaiLives > 0 && open.ovCards > 0, `ชาติต่างโลก ${half.isekaiLives} · การ์ดซ้อนทับ/เพี้ยนฝั่งปลดหมด ${open.ovCards}`);
check('ต่างโลกเปิด+ซ้อนทับล็อก: ค่าซ้อนทับ = 0 · ไม่มีการ์ดนัดซ้อนทับ/เพี้ยน', half.overlapMax === 0 && half.overlapRaw === 0 && half.ovCards === 0, `ซ้อนทับอ่าน ${half.overlapMax} · ดิบ ${half.overlapRaw} · การ์ด ${half.ovCards}`);
check('ล็อก: ชีวิตและทายาททุกรุ่นถือสถานะล็อก', locked.stampBad === 0 && locked.heirBad === 0, `stamp ${locked.stampBad} · heir ${locked.heirBad}`);

// เซฟภาพถ่ายเก็บสถานะ dlc ครบวงจร: เซฟตอนล็อก โหลดแล้วยังล็อก · เซฟเก่าไม่มีช่อง = ปลดหมด
{
  setDlcDefault(DLC_LOCKED);
  const { state } = playLife(mixSeed(seed, 77), content, BOTS.สุ่ม);
  const back = restore(snapshot({ st: state }, content), content).st;
  setDlcDefault(DLC_OPEN);
  const { state: old } = playLife(mixSeed(seed, 78), content, BOTS.สุ่ม);
  const oldBack = restore(snapshot({ st: old }, content), content).st;
  check('เซฟภาพถ่าย: ล็อกอยู่หลังโหลด · ชีวิตเก่าไม่มีช่อง = ปลดหมด', JSON.stringify(back.dlc) === JSON.stringify(DLC_LOCKED) && !('dlc' in oldBack));
}
void makeRng;

// ปลดตามเงื่อนไขจริง (ใบ 03): เริ่มล็อกหมด ไม่แช่แข็ง เดินตระกูลละ PGENS ชาติ แล้วรายงานสัดส่วนตระกูลที่ปลดแต่ละก้อนต่อชาติ
// ปลดระหว่างชีวิต/ปรโลก = มีผลชาติหน้า ชีวิตที่กำลังเล่นไม่ถูกแตะ
{
  const PGENS = opt('pgens', 8);
  setDlcFrozen(false);
  setDlcDefault(DLC_LOCKED);
  const openAt = DLC_KEYS.map(() => Array(PGENS).fill(0));
  const reached = Array(PGENS).fill(0);
  const bad = { firstGen: 0, chain: 0, backslide: 0, midLife: 0, overlapStart: 0 };
  let fams = 0;
  for (const bot of Object.values(BOTS)) {
    for (let i = 0; i < n; i++) {
      fams++;
      let st = null, prev = null;
      for (let g = 0; g < PGENS; g++) {
        const run = playLife(mixSeed(seed, 5000 + i * 11 + g), content, bot, null, st ?? undefined);
        const sl = run.state;
        reached[g]++;
        DLC_KEYS.forEach((k, ki) => {
          const o = dlcOpen(sl, k);
          if (o) openAt[ki][g]++;
          if (o && ki > 0 && !dlcOpen(sl, DLC_KEYS[ki - 1])) bad.chain++;
          if (prev?.[ki] && !o) bad.backslide++;
        });
        if (g === 0 && DLC_KEYS.some((k) => dlcOpen(sl, k))) bad.firstGen++;
        // ซ้อนทับเพิ่งปลดในชาตินี้ = ค่าเริ่ม 0
        if (dlcOpen(sl, 'overlap') && !prev?.[2] && (sl.overlap ?? 0) !== 0) bad.overlapStart++;
        const before = JSON.stringify(sl.dlc ?? null);
        const af = playAfterlife(sl, bot);
        if (JSON.stringify(sl.dlc ?? null) !== before) bad.midLife++;
        prev = DLC_KEYS.map((k) => dlcOpen(sl, k));
        if (!af.heir) break;
        st = nextLife(af);
      }
    }
  }
  const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(0)}%` : '-');
  console.log(`
ปลดตามเงื่อนไข · ${fams} ตระกูล × ${PGENS} ชาติ · สัดส่วนตระกูลที่ปลดแล้วตอนเริ่มชาติ (ปรโลก · ต่างโลก · โลกซ้อนทับ · ดันเจียน)`);
  for (let g = 0; g < PGENS; g++) console.log(`  ชาติ ${g + 1}: ${DLC_KEYS.map((_, ki) => pct(openAt[ki][g], reached[g]).padStart(4)).join(' · ')}  (ตระกูลถึงชาตินี้ ${reached[g]})`);
  check('ปลดตามเงื่อนไข: ชาติแรกล็อกหมด (ก่อนศาลครั้งแรก)', bad.firstGen === 0, `ผิด ${bad.firstGen}`);
  check('ปลดตามเงื่อนไข: ปรโลกปลดทุกตระกูลตั้งแต่ชาติที่ 2 (หลังศาลครั้งแรก)', PGENS < 2 || openAt[0][1] === reached[1], `${openAt[0][1]}/${reached[1]}`);
  check('ปลดตามเงื่อนไข: ก้อน N ปลดก่อนก้อน N-1 ไม่ได้ · ปลดแล้วไม่ถอย', bad.chain === 0 && bad.backslide === 0, `ข้ามลำดับ ${bad.chain} · ถอย ${bad.backslide}`);
  check('ปลดตามเงื่อนไข: ปลดระหว่างปรโลกมีผลชาติหน้า (ชีวิตที่เล่นอยู่ไม่เปลี่ยน)', bad.midLife === 0, `ผิด ${bad.midLife}`);
  check('ปลดตามเงื่อนไข: ค่าซ้อนทับเริ่ม 0 ตอนปลด', bad.overlapStart === 0, `ผิด ${bad.overlapStart}`);
  check('ปลดตามเงื่อนไข: ต่างโลกปลดได้จริงในบางตระกูล (ตัวควบคุมว่าเงื่อนไขไม่ตาย)', openAt[1].some((x) => x > 0), openAt[1].join('/'));
}

console.log(fails.length ? `\nตก ${fails.length} ด่าน` : '\nผ่านทุกด่าน');
process.exit(fails.length ? 1 : 0);
