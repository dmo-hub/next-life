// เดโมการ์ดใบเดียวบนหน้าแรก (B121): การ์ดจริงจากแกนเกมตอน build — ป้ายผลและข้อความผลมาจากการเล่นจริง ไม่เขียนมือ
// หน้าแรกไม่โหลดตัวเกม ไม่แตะ localStorage ⇒ เซฟของคนที่กำลังเล่นอยู่ไม่โดนทับ
// ผลที่มีเรื่องต่อ (B133) เล่นต่อเป็นสายเหมือนในเกม — ต้นไม้ของสายคำนวณตอน build ทั้งหมด หน้าแค่เปิด/ปิดขั้น
import { playLife } from '../engine/index.mjs';
import { esc } from './catalog.mjs';

// ชีวิตและการ์ดที่ใช้ — เลือกการ์ดที่ทุกทางไม่ล็อก และมีอย่างน้อยหนึ่งทางที่ผลมีเรื่องต่อ (เจ้าของอยากให้ลองเล่นต่อเป็นสายได้)
// หาไม่เจอ (เนื้อหาเปลี่ยน) ตกไปการ์ดแรกที่เข้าเกณฑ์
export const DEMO = { seed: 4, id: 'biz_grocery_01' };
export const DEMO_START = '<!--demo-->';
export const DEMO_END = '<!--/demo-->';
// สายยาวกว่านี้หน้าแรกยืดเกินไป — ขั้นที่ลึกกว่าจบที่การ์ดผลแล้วชวนไปเล่นทั้งชีวิต
export const DEMO_DEPTH = 3;
const STOP = {};
// บอทเลือกทางที่ไม่ล็อกแบบสุ่มจาก rng ของแกน — seed เดิมได้ทางเดิมทุก build
const pick = (c, bot) => {
  const ok = c.choices.map((_, i) => i).filter((i) => !c.locked?.[i]);
  return ok[bot.int(0, ok.length - 1)];
};
const fits = (c) => c.kind === 'event' && c.type === 'A' && c.title && !c.national && c.choices.length >= 3 && c.choices.length <= 4 && !c.locked.some(Boolean);

// เล่นซ้ำชีวิตเดิม บังคับทางตาม path ที่การ์ดเลือกใบที่ nth, nth+1, … แล้วเก็บการ์ดหลังทางสุดท้ายจนถึงการ์ดเลือกใบถัดไป
// การ์ดเรื่องต่อเข้าหัวคิวตามหลังการ์ดผลทันที ⇒ ถ้ามี จะเป็นการ์ดเลือกใบถัดไปเสมอ
function replay(content, seed, nth, path) {
  let k = 0;
  let last = false;
  const seen = [];
  try {
    playLife(seed, content, (c, bot) => {
      const p = pick(c, bot);
      const j = k++ - nth;
      if (j < 0 || j >= path.length) return p;
      last = j === path.length - 1;
      return path[j];
    }, (c) => {
      if (!last) return;
      seen.push(c);
      if (c.choices?.length || c.kind === 'death') throw STOP;
    });
  } catch (e) {
    if (e !== STOP) throw e;
  }
  return seen;
}

// การ์ดผลไม่บอกว่ามาจากใบไหน จึงรับเฉพาะข้อความที่ตรงผลของทางนั้นในเนื้อหา (การ์ดผลของเรื่องอื่นปีเดียวกัน เช่นสัตว์เลี้ยงตาย ไม่นับ)
// ผลร้ายที่มีญาติ/เพื่อนมาช่วย แกนต่อหาง " · …มาช่วยประคอง" ท้ายข้อความ — ยังนับเป็นผลของทางนั้น
// เรื่องต่อนับเฉพาะการ์ดที่ตามมาทันทีและเป็นใบที่ผลนั้นชี้ — เงื่อนไขปี/when ไม่ผ่าน แกนจบที่การ์ดผล เดโมก็จบตาม
function outcomeOf(content, card, i, seen) {
  const out = seen[0];
  if (out?.kind !== 'result') return { text: null, follow: null };
  const ev = content.events.find((e) => e.id === card.id);
  const same = (t) => new RegExp(`^${t.split(/\{[^{}]*\}/).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}(?: · .*)?$`).test(out.text);
  const o = (ev?.choices[i]?.outcomes ?? []).find((x) => x.text && same(x.text));
  if (!o) return { text: null, follow: null };
  const nx = seen[1];
  return { text: out.text, follow: o.next && nx?.kind === 'event' && nx.id === o.next && nx.choices?.length ? nx : null };
}

// ขั้นหนึ่งของสาย: การ์ด + ผลของแต่ละทาง (ทางที่ล็อกไม่มีผล) + ขั้นต่อไปของทางที่มีเรื่องต่อ
function stepOf(content, seed, nth, path, card, depth) {
  const next = card.choices.map((_, i) => {
    if (card.locked?.[i]) return { text: null, step: null };
    const r = outcomeOf(content, card, i, replay(content, seed, nth, [...path, i]));
    return { text: r.text, step: r.follow && depth < DEMO_DEPTH ? stepOf(content, seed, nth, [...path, i], r.follow, depth + 1) : null };
  });
  return { card, next };
}

const chained = (s) => s.next.some((n) => n.step);

function findCard(content) {
  const scan = (seed, want) => {
    let k = 0;
    let hit = null;
    const cands = [];
    try {
      playLife(seed, content, pick, (card) => {
        // การ์ดชวนไปต่างโลก (B68d) playLife ปฏิเสธเองโดยไม่เรียกบอท — ไม่นับ ไม่งั้นลำดับไม่ตรงกับตอนเล่นซ้ำ
        if (!card.choices?.length || card.entry) return;
        const nth = k++;
        if (fits(card) && (!want || card.id === want)) {
          cands.push({ nth, card });
          if (want) throw STOP;
        }
      });
    } catch (e) {
      if (e !== STOP) throw e;
    }
    for (const { nth, card } of cands) {
      const root = stepOf(content, seed, nth, [], card, 1);
      if (chained(root)) {
        hit = { seed, nth, root };
        break;
      }
      hit ??= { seed, nth, root, plain: true };
    }
    return hit;
  };
  const hit = scan(DEMO.seed, DEMO.id);
  if (hit && !hit.plain) return hit;
  let plain = hit;
  for (let seed = 1; seed <= 30; seed++) {
    const h = scan(seed, null);
    if (h && !h.plain) return h;
    plain ??= h;
  }
  if (plain) return plain;
  throw new Error('เดโมหน้าแรก: ไม่พบการ์ดที่เข้าเกณฑ์');
}

export function demoCard(content) {
  const hit = findCard(content);
  return { ...hit, card: hit.root.card, results: hit.root.next.map((n) => n.text) };
}

// ทุกขั้นของสายเรียงต่อกันในการ์ดเดียว — ขั้นแรกเปิด ขั้นอื่นซ่อนไว้จนกดทางที่ชี้มา
function stepsHtml(root) {
  const out = [];
  const walk = (s) => {
    const at = out.length;
    out.push(null);
    const buttons = s.card.choices
      .map((t, i) => {
        const fx = s.card.locked?.[i] ? `ล็อก · ${s.card.locked[i]}` : s.card.fx[i];
        if (s.card.locked?.[i]) return `<button type="button" disabled data-lock><span>${esc(t)}</span><span class="fx">${esc(fx)}</span></button>`;
        const n = s.next[i];
        const res = n.text ?? `ผลลงที่ค่าสถานะทันที (${s.card.fx[i]}) แล้วชีวิตเดินต่อไปการ์ดถัดไป`;
        const go = n.step ? ` data-go="${walk(n.step)}"` : '';
        return `<button type="button" data-res="${esc(res)}"${go}><span>${esc(t)}</span>${fx ? `<span class="fx">${esc(fx)}</span>` : ''}</button>`;
      })
      .join('');
    out[at] = [
      `<div class="tstep" data-step="${at}"${at ? ' hidden' : ''}>`,
      `<p class="kick">${at ? 'เรื่องต่อ · ' : ''}ช่วง${esc(s.card.stage)} · อายุ ${s.card.age}</p>`,
      `<h3>${esc(s.card.title)}</h3>`,
      `<p>${esc(s.card.text)}</p>`,
      `<div class="tch">${buttons}</div>`,
      '<p class="tres" aria-live="polite" hidden></p>',
      '</div>',
    ].join('\n');
    return at;
  };
  walk(root);
  return out.join('\n');
}

export function demoHtml(content) {
  const { root } = findCard(content);
  return [
    DEMO_START,
    '<section class="try" aria-labelledby="try-h">',
    '<h2 id="try-h">ลองการ์ดหนึ่งใบ</h2>',
    '<p class="lead">การ์ดจริงจากเกม กดเลือกได้เลย หน้านี้ไม่บันทึกอะไรในเครื่อง ชีวิตที่เล่นค้างไว้ไม่หาย · ป้ายด้านขวาของแต่ละทางบอกแค่ทิศทางหรือโอกาสสำเร็จ เหมือนในเกม · บางทางมีเรื่องต่อให้เลือกอีก</p>',
    '<div class="tcard">',
    stepsHtml(root),
    '<p class="tact" hidden><a href="play.html">เล่นทั้งชีวิต →</a> <button type="button" class="again">ลองทางอื่น</button></p>',
    '</div>',
    '</section>',
    // สคริปต์สั้นในหน้า: แสดงผลของทางที่กด เปิดขั้นเรื่องต่อถ้ามี ไม่มี storage ไม่มี network
    '<script>(() => { const box = document.querySelector(".tcard"); if (!box) return; const act = box.querySelector(".tact"); const steps = [...box.querySelectorAll(".tstep")];',
    'box.querySelectorAll(".tch button:not([data-lock])").forEach((b) => b.addEventListener("click", () => { const st = b.closest(".tstep"); const res = st.querySelector(".tres"); st.querySelectorAll(".tch button").forEach((x) => { x.disabled = true; x.classList.toggle("on", x === b); }); res.textContent = b.dataset.res; res.hidden = false;',
    'const nx = b.dataset.go && steps.find((s) => s.dataset.step === b.dataset.go); if (nx) { nx.hidden = false; nx.querySelector(".tch button:not([data-lock])").focus(); } else { act.hidden = false; act.querySelector("a").focus(); } }));',
    'box.querySelector(".again").addEventListener("click", () => { steps.forEach((s, i) => { s.hidden = i > 0; s.querySelector(".tres").hidden = true; s.querySelectorAll(".tch button:not([data-lock])").forEach((x) => { x.disabled = false; x.classList.remove("on"); }); }); act.hidden = true; steps[0].querySelector(".tch button").focus(); }); })();</script>',
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
