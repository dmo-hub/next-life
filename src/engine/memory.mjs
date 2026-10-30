// ตายสงบย้อนความทรงจำ (B168): ตายตอนขึ้นปีด้วยวัยชราหรือโรคเรื้อรังที่หมอบอกไว้ อายุ 60 ขึ้นไป → การ์ดย้อนชีวิตใบเดียวก่อนคำสั่งเสีย
// คัดแบบกำหนดได้จาก log/ญาติของชีวิตนั้น ไม่ดึงเลขสุ่ม ไม่ตั้งธง ไม่ให้ผลค่า ⇒ บอทและผลเกมเดินเท่าเดิม ต่างแค่การ์ดหนึ่งใบกับบรรทัดบนมรณบัตร
// ไม่ import life.mjs (life.mjs import ไฟล์นี้) — ผู้เรียกส่ง stageOf มาเอง
import { CHRONIC } from './death.mjs';

export const MEMORY = {
  from: 60,
  stories: 3,
  min: 2,
  // ช่วงที่เรื่องของตัวเองชัดที่สุด เมื่อไม่มีตัวเลือกที่ส่งผลต่อ
  prime: ['หนุ่มสาว', 'ทำงาน'],
  text: 'ภาพเก่า ๆ ค่อย ๆ ผุดขึ้นมาทีละภาพ ภาพไหนที่คุณอยากเก็บไว้เป็นภาพสุดท้าย',
};

const PARENT_WORD = (p) => (p.sex === 'หญิง' ? 'แม่' : 'พ่อ');

// ธงที่การ์ดใบอื่นอ่าน (when.flags · ตัวคูณตามธง) — ตัวเลือกที่ตั้งธงพวกนี้แล้วธงยังติดตัวอยู่ = ทางที่ส่งผลต่อจริง
const readCache = new WeakMap();
function flagsRead(content) {
  let set = readCache.get(content);
  if (set) return set;
  set = new Set();
  const walk = (x, key) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) return x.forEach((v) => walk(v));
    if (key === 'flags') {
      for (const k of [...(x.has ?? []), ...(x.not ?? [])]) set.add(k);
      if (!x.has && !x.not) Object.keys(x).forEach((k) => set.add(k));
      return;
    }
    for (const [k, v] of Object.entries(x)) if (k !== 'sets_flags' && k !== 'clears_flags') walk(v, k);
  };
  for (const ev of content.events) walk(ev);
  readCache.set(content, set);
  return set;
}

export function memoryEligible(st, isGone) {
  if (!st.dead || st.age < MEMORY.from || isGone(st)) return false;
  return st.cause === 'other' || (!!st.terminal && CHRONIC.includes(st.cause) && st.terminal.cause === st.cause && st.age >= st.terminal.age);
}

function weight(st, c, read) {
  const flags = [...(c.sets_flags ?? []), ...(c.outcomes ?? []).flatMap((o) => o.sets_flags ?? [])];
  if (flags.some((f) => st.flags[f] && read.has(f))) return 2;
  if ((c.schedules ?? []).some((s) => st.fired[s.event])) return 2;
  return 1;
}

// ช่วงวัยละไม่เกินหนึ่งเรื่อง · เรื่องที่ส่งผลต่อมาก่อน ช่วงหนุ่มสาว/ทำงานรองลงมา · เท่ากันเอาเรื่องแรกของช่วง
export function memoryStories(st, stageOf) {
  const read = flagsRead(st.content);
  const byId = new Map(st.content.events.map((e) => [e.id, e]));
  const best = new Map();
  for (const l of st.log) {
    const ev = byId.get(l.id);
    const c = ev?.choices?.[l.choice];
    if (!c || /[{}]/.test(l.text)) continue;
    const stage = stageOf(l.age);
    const w = weight(st, c, read);
    if (w < 2 && !MEMORY.prime.includes(stage)) continue;
    if ((best.get(stage)?.w ?? 0) < w) best.set(stage, { w, age: l.age, text: `ตอนอายุ ${l.age} คุณ${l.text}` });
  }
  return [...best.values()].sort((a, b) => b.w - a.w || a.age - b.age).slice(0, MEMORY.stories).sort((a, b) => a.age - b.age).map((x) => x.text);
}

// คนในชีวิต 1–2 บรรทัด: พ่อแม่ที่จากไป (อายุของเราตอนนั้น) · คู่ชีวิตกับลูกหลานที่ยังอยู่
export function memoryPeople(st) {
  const lines = [];
  const gone = st.parents.filter((p) => !p.alive && p.diedAtYou !== undefined && !p.gone);
  if (gone.length) lines.push(gone.map((p) => `${PARENT_WORD(p)}จากไป${p.diedAtYou ? `ตอนคุณอายุ ${p.diedAtYou}` : 'ตั้งแต่คุณยังไม่ทันจำความ'}`).join(' · '));
  const live = (role) => (st.kin ?? []).filter((m) => m.role === role && m.alive && !m.left);
  const spouse = live('spouse').at(-1);
  const lost = (st.kinLoss ?? []).findLast((l) => l.role === 'spouse');
  const parts = [];
  // ชื่อเล่นไทยอ่านติดกริยาได้ ("เฟซบุ๊กจากไป") จึงเว้นวรรคหลังชื่อ
  const who = (m) => `คู่ชีวิต${m.name ? `${m.name} ` : ''}`;
  if (spouse) parts.push(`${who(spouse)}ยังอยู่ข้าง ๆ`);
  else if (lost) parts.push(`${who(lost)}จากไปก่อนตอนคุณอายุ ${lost.year - st.birthYear}`);
  const kids = live('child').length, grand = live('grandchild').length;
  if (kids) parts.push(`ลูก ${kids} คน${grand ? ` หลาน ${grand} คน` : ''}ยังอยู่`);
  if (parts.length) lines.push(parts.join(' · '));
  return lines;
}

// null = เรื่องไม่พอให้เลือก — ไม่ออกการ์ด
export function memoryCard(st, stageOf) {
  const choices = memoryStories(st, stageOf);
  if (choices.length < MEMORY.min) return null;
  return { kind: 'memory', age: st.age, stage: stageOf(st.age), text: MEMORY.text, items: memoryPeople(st), choices, fx: choices.map(() => ''), locked: choices.map(() => null) };
}
