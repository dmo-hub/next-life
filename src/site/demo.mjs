// เดโมการ์ดใบเดียวบนหน้าแรก (B121): การ์ดจริงจากแกนเกมตอน build — ป้ายผลและข้อความผลมาจากการเล่นจริง ไม่เขียนมือ
// หน้าแรกไม่โหลดตัวเกม ไม่แตะ localStorage ⇒ เซฟของคนที่กำลังเล่นอยู่ไม่โดนทับ
import { playLife } from '../engine/index.mjs';
import { esc } from './catalog.mjs';

// ชีวิตและการ์ดที่ใช้ — เลือกการ์ดที่ทุกทางไม่ล็อก และผลไม่มีเรื่องตาย/บาดเจ็บ · หาไม่เจอ (เนื้อหาเปลี่ยน) ตกไปการ์ดแรกที่เข้าเกณฑ์
export const DEMO = { seed: 10, id: 'teen_part_time_01' };
export const DEMO_START = '<!--demo-->';
export const DEMO_END = '<!--/demo-->';
const STOP = {};
// บอทเลือกทางที่ไม่ล็อกแบบสุ่มจาก rng ของแกน — seed เดิมได้ทางเดิมทุก build
const pick = (c, bot) => {
  const ok = c.choices.map((_, i) => i).filter((i) => !c.locked?.[i]);
  return ok[bot.int(0, ok.length - 1)];
};
const fits = (c) => c.kind === 'event' && c.type === 'A' && c.title && !c.national && c.choices.length >= 3 && c.choices.length <= 4 && !c.locked.some(Boolean);

function findCard(content) {
  const scan = (seed, want) => {
    let k = 0;
    let hit = null;
    try {
      playLife(seed, content, pick, (card) => {
        // การ์ดชวนไปต่างโลก (B68d) playLife ปฏิเสธเองโดยไม่เรียกบอท — ไม่นับ ไม่งั้นลำดับไม่ตรงกับตอนเล่นซ้ำ
        if (!card.choices?.length || card.entry) return;
        const nth = k++;
        if (fits(card) && (!want || card.id === want)) {
          hit = { seed, nth, card };
          throw STOP;
        }
      });
    } catch (e) {
      if (e !== STOP) throw e;
    }
    return hit;
  };
  const hit = scan(DEMO.seed, DEMO.id);
  if (hit) return hit;
  for (let seed = 1; seed <= 30; seed++) {
    const h = scan(seed, null);
    if (h) return h;
  }
  throw new Error('เดโมหน้าแรก: ไม่พบการ์ดที่เข้าเกณฑ์');
}

// เล่นซ้ำชีวิตเดิมแต่บังคับทาง i ที่การ์ดเดโม แล้วอ่านการ์ดถัดไป — การ์ดผลไม่บอกว่ามาจากใบไหน
// จึงรับเฉพาะข้อความที่ตรงผลของทางนั้นในเนื้อหา (การ์ดผลของเรื่องอื่นปีเดียวกัน เช่นสัตว์เลี้ยงตาย ไม่นับ)
function resultOf(content, { seed, nth, card }, i) {
  let k = 0;
  let at = false;
  let out = null;
  try {
    playLife(seed, content, (c, bot) => {
      const p = pick(c, bot);
      if (k++ === nth) {
        at = true;
        return i;
      }
      return p;
    }, (c) => {
      if (at) {
        out = c;
        throw STOP;
      }
    });
  } catch (e) {
    if (e !== STOP) throw e;
  }
  if (out?.kind !== 'result') return null;
  const ev = content.events.find((e) => e.id === card.id);
  const texts = (ev?.choices[i]?.outcomes ?? []).map((o) => o.text).filter(Boolean);
  const same = (t) => new RegExp(`^${t.split(/\{[^{}]*\}/).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`).test(out.text);
  return texts.some(same) ? out.text : null;
}

export function demoCard(content) {
  const hit = findCard(content);
  const { card } = hit;
  return { ...hit, results: card.choices.map((_, i) => resultOf(content, hit, i)) };
}

export function demoHtml(content) {
  const { card, results } = demoCard(content);
  const buttons = card.choices
    .map((t, i) => {
      const res = results[i] ?? `ผลลงที่ค่าสถานะทันที (${card.fx[i]}) แล้วชีวิตเดินต่อไปการ์ดถัดไป`;
      return `<button type="button" data-res="${esc(res)}"><span>${esc(t)}</span>${card.fx[i] ? `<span class="fx">${esc(card.fx[i])}</span>` : ''}</button>`;
    })
    .join('');
  return [
    DEMO_START,
    '<section class="try" aria-labelledby="try-h">',
    '<h2 id="try-h">ลองการ์ดหนึ่งใบ</h2>',
    '<p class="lead">การ์ดจริงจากเกม กดเลือกได้เลย หน้านี้ไม่บันทึกอะไรในเครื่อง ชีวิตที่เล่นค้างไว้ไม่หาย · ป้ายด้านขวาของแต่ละทางบอกแค่ทิศทางหรือโอกาสสำเร็จ เหมือนในเกม</p>',
    '<div class="tcard">',
    `<p class="kick">ช่วง${esc(card.stage)} · อายุ ${card.age}</p>`,
    `<h3>${esc(card.title)}</h3>`,
    `<p>${esc(card.text)}</p>`,
    `<div class="tch">${buttons}</div>`,
    '<p class="tres" aria-live="polite" hidden></p>',
    '<p class="tact" hidden><a href="play.html">เล่นทั้งชีวิต →</a> <button type="button" class="again">ลองทางอื่น</button></p>',
    '</div>',
    '</section>',
    // สคริปต์สั้นในหน้า: แสดงผลของทางที่กด ไม่มี storage ไม่มี network
    '<script>(() => { const box = document.querySelector(".tcard"); if (!box) return; const res = box.querySelector(".tres"); const act = box.querySelector(".tact"); const bs = [...box.querySelectorAll(".tch button")];',
    'bs.forEach((b) => b.addEventListener("click", () => { bs.forEach((x) => { x.disabled = true; x.classList.toggle("on", x === b); }); res.textContent = b.dataset.res; res.hidden = false; act.hidden = false; act.querySelector("a").focus(); }));',
    'box.querySelector(".again").addEventListener("click", () => { bs.forEach((x) => { x.disabled = false; x.classList.remove("on"); }); res.hidden = true; act.hidden = true; bs[0].focus(); }); })();</script>',
    DEMO_END,
  ].join('\n');
}

// แทนก้อนเดโมเดิมในหน้าแรกด้วยก้อนใหม่ — ตัวคั่นต้องมีคู่เดียว ไม่งั้นหยุด build ดีกว่าเขียนหน้าเพี้ยน
export function injectDemo(html, content, where = 'docs/index.html') {
  const a = html.indexOf(DEMO_START);
  const b = html.indexOf(DEMO_END);
  if (a < 0 || b < a || html.indexOf(DEMO_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${DEMO_START} … ${DEMO_END} คู่เดียว`);
  // ตามตัวขึ้นบรรทัดของไฟล์ ไม่งั้น build บน Windows ทิ้ง diff แค่ CRLF ไว้ทุกรอบ
  const block = html.includes('\r\n') ? demoHtml(content).replace(/\n/g, '\r\n') : demoHtml(content);
  return html.slice(0, a) + block + html.slice(b + DEMO_END.length);
}
