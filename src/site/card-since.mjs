// ทะเบียนเวอร์ชันที่การ์ดเข้าเกม (id → เวอร์ชัน) — อยู่ใต้ src/site เพราะ gate.mjs ไม่นับ hash ส่วนนี้ ทะเบียนเปลี่ยนแล้วแคชด่านไม่หาย
// rel.mjs เติม id ใหม่ตอนปล่อย ⇒ ระหว่างทำงานการ์ดใหม่ยังไม่มีป้าย ด่านนับเป็นรอปล่อย
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('./card-since.json', import.meta.url);
export const readSince = () => JSON.parse(readFileSync(FILE, 'utf8'));
const since = readSince();

// อยู่นอก sp-front ⇒ กดดูผลแล้วป้ายยังอยู่
export const sinceTag = (id, map = since) => (map[id] ? `<p class="ver"><a href="whatsnew.html#${map[id]}">เพิ่มใน ${map[id]}</a></p>` : '');

// นำเข้าตอนเรียก: หน้าเว็บที่ใช้แค่ sinceTag ไม่ต้องลากตัวโหลดเนื้อหา
export async function cardIds() {
  const { loadContent } = await import('../node/load.mjs');
  const { ISEKAI_EVENTS } = await import('../engine/isekai.mjs');
  const { events } = loadContent();
  return [...events, ...ISEKAI_EVENTS].map((e) => e.id);
}

// บรรทัดละใบ เรียงตาม id ⇒ diff ตอนปล่อยเห็นเฉพาะการ์ดใหม่
export const sinceJson = (map) => `{\n${Object.entries(map).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',\n')}\n}\n`;

export async function addNewCards(ver, { write = true } = {}) {
  const map = readSince();
  const added = (await cardIds()).filter((id) => !map[id]);
  for (const id of added) map[id] = ver;
  if (write && added.length) writeFileSync(FILE, sinceJson(map));
  return added;
}
