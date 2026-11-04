// เซฟแบบภาพถ่ายสถานะ (B128): เก็บสถานะชีวิตจริงแทน seed + ลำดับปุ่ม — อัปเดตเนื้อหาแล้วชีวิตที่ค้างยังเล่นต่อได้
// เดินทั้งก้อนครั้งเดียว: เนื้อหาเกมไม่เก็บ (ผูกกลับตอนโหลด) · การ์ดเนื้อหาเก็บแค่ id · ตัวสุ่มเก็บสถานะภายใน
// object ที่ถูกอ้างหลายที่ (af.st = st · kinLoss ชี้คนใน kin · thaiVerdict) เก็บครั้งเดียวแล้วอ้างด้วยเลข — ต่อกลับเป็นตัวเดียวกัน
import { makeRng } from './rng.mjs';
import { pickRealName } from './birth.mjs';
import { OFFICE_V1 } from './rank.mjs';

export const SNAP_V = 1;
// o = รุ่นเลขขั้นการเมืองในภาพถ่าย · ภาพถ่ายไม่มี o = เลขขั้นก่อนรวบผู้ใหญ่บ้าน/กำนัน (05a) — แปลงตอนโหลด ไม่ขึ้น SNAP_V เพราะโครงภาพถ่ายเหมือนเดิม
export const OFFICE_SCHEME = 2;
const OFFICE_V1_SUB = ['ผู้ใหญ่บ้าน', 'กำนัน'];
const isRng = (v) => typeof v.next === 'function' && typeof v.int === 'function';

export function snapshot(root, content) {
  const events = new Set(content.events);
  const seen = new Map();
  const count = (v) => {
    if (v === null || typeof v !== 'object' || v === content || events.has(v) || isRng(v)) return;
    const n = seen.get(v) ?? 0;
    seen.set(v, n + 1);
    if (n) return;
    for (const x of Array.isArray(v) ? v : Object.values(v)) count(x);
  };
  count(root);
  const ids = new Map();
  const enc = (v) => {
    if (v === null || typeof v !== 'object') return v;
    if (v === content) return { $c: 1 };
    if (events.has(v)) return { $ev: v.id };
    if (isRng(v)) return { $rng: v.state };
    if (ids.has(v)) return { $ref: ids.get(v) };
    const shared = seen.get(v) > 1;
    if (shared) ids.set(v, ids.size);
    const body = Array.isArray(v) ? v.map(enc) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)]));
    return shared ? { $id: ids.get(v), $v: body } : body;
  };
  return JSON.stringify({ v: SNAP_V, o: OFFICE_SCHEME, root: enc(root) });
}

// การ์ดเนื้อหาที่ id หายจากเนื้อหาใหม่ = null (ผู้เรียกทิ้งแล้วจั่วใหม่) · ตัวสุ่มคืนเป็นตัวใหม่ที่เดินต่อจากเลขเดิม
export function restore(text, content) {
  const snap = JSON.parse(text);
  if (snap?.v !== SNAP_V) throw new Error('เซฟรูปแบบอื่น');
  const byId = new Map(content.events.map((e) => [e.id, e]));
  const table = [];
  const dec = (v) => {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(dec);
    if (v.$c) return content;
    if ('$ev' in v) return byId.get(v.$ev) ?? null;
    if ('$rng' in v) return makeRng(v.$rng);
    if ('$ref' in v) return table[v.$ref];
    if ('$id' in v) {
      // จองช่องก่อนถอดตัวใน — ลูกที่อ้างกลับมาหาพ่อ (วน) ได้ตัวเดียวกัน
      const out = Array.isArray(v.$v) ? [] : {};
      table[v.$id] = out;
      if (Array.isArray(out)) out.push(...v.$v.map(dec));
      else for (const [k, x] of Object.entries(v.$v)) out[k] = dec(x);
      return out;
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dec(x)]));
  };
  const root = dec(snap.root);
  if (snap.o !== OFFICE_SCHEME) officeV1(root, content);
  return root;
}

// เลขขั้นการเมืองของเซฟเก่าอยู่ 3 ที่: ตำแหน่งตอนนี้ (office.rank) · ตำแหน่งสูงสุด (officeTop) · ผังตระกูล/ผลการ์ดเลือกตั้งที่ค้าง (office เป็นเลข)
// เดินทั้งก้อนครั้งเดียว ข้ามเนื้อหาเกม — object ที่อ้างซ้ำ (af.st = st) แปลงครั้งเดียว · กำนัน/ผู้ใหญ่บ้านเดิมเก็บเป็นชื่อย่อยของผู้นำท้องถิ่น
function officeV1(root, content) {
  const skip = new Set([content, ...content.events]);
  const seen = new Set();
  const map = (r) => (r >= 0 ? OFFICE_V1[r] ?? r : r);
  const walk = (v) => {
    if (v === null || typeof v !== 'object' || skip.has(v) || seen.has(v) || typeof v.next === 'function') return;
    seen.add(v);
    if (typeof v.officeTop === 'number') v.officeTop = map(v.officeTop);
    if (typeof v.office === 'number') v.office = map(v.office);
    else if (typeof v.office?.rank === 'number' && !seen.has(v.office)) {
      seen.add(v.office);
      if (OFFICE_V1_SUB[v.office.rank]) v.office.sub = OFFICE_V1_SUB[v.office.rank];
      v.office.rank = map(v.office.rank);
    }
    for (const x of Array.isArray(v) ? v : Object.values(v)) walk(x);
  };
  walk(root);
}

// ซ่อมสถานะชีวิตหลังโหลดบนเนื้อหาใหม่: ของที่อ้าง id แล้ว id หาย ให้ทางปลอดภัยแทนการพัง
// card = การ์ดที่ค้างบนจอตอนเซฟ · คืน true = การ์ดนั้นใช้ไม่ได้แล้ว (การ์ดเนื้อหาหาย/จำนวนตัวเลือกเปลี่ยน) ผู้เรียกจั่วใบถัดไปใหม่
export function repairLife(st, card) {
  const ev = st.pending && !st.pending.alloc ? st.pending : null;
  // การ์ดทริปต่างโลก (B68m) ไม่ผ่าน st.pending — สถานะทั้งชาติอยู่ใน st.trip ที่ภาพถ่ายเก็บไว้แล้ว จั่วใหม่ = นับใบซ้ำ + ดึงเลขสุ่มเกิน
  // ทริปศาล (B153) เหมือนกัน: ใบที่รอเลือกอยู่ใน st.court
  const stale = !st.trip && !st.court &&!!card?.choices?.length && (!st.pending || (ev && ev.choices.length !== card.choices.length));
  if (stale) st.pending = null;
  const q = st.queue ?? [];
  st.queue = q.filter((c) => !('ev' in c) || c.ev);
  // เซฟก่อนมีชื่อจริง (names-fun) — สุ่มจาก seed เดิม โหลดกี่ครั้งก็ได้ชื่อเดียวกัน
  st.realName ??= pickRealName(st.seed, st.sex, st.birthYear, st.content.era.names);
  const occ = st.content.era.finance.occupations;
  if (st.occupation && !occ.some((o) => o.id === st.occupation)) st.occupation = occ[0].id;
  const ladders = st.content.era.careers?.ladders;
  if (st.ladder && ladders && !ladders[st.ladder.id]) st.ladder = null;
  // เซฟก่อนมีสาเหตุตาย (B110) — เริ่ม stream ใหม่จาก seed เหมือนชีวิตที่เกิดใหม่
  st.causeRng ??= makeRng(st.seed ^ 0x9b05688c);
  st.terminal ??= null;
  // เซฟก่อนญาติมีสาเหตุ (B110 ชิ้น 2) — ญาติที่จากไปแล้วไม่มีสาเหตุย้อนหลัง · คนที่ยังอยู่เริ่มนับจากนี้
  st.kinCauseRng ??= makeRng(st.seed ^ 0xc1059ed8);
  st.heredity ??= [];
  return stale;
}
