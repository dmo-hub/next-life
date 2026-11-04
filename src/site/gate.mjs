// กล่องถามรหัสหน้าฉาก (ui-redo 72): บังหน้าเว็บนอกตัวเกมด้วย JS — เนื้อยังอยู่ใน HTML (view-source อ่านได้ เจ้าของรับรู้ ไม่ใช่กันจริง)
// เก็บแค่ SHA-256 ของรหัสใน gate.json · รหัสจริงไม่ลง repo · เจ้าของตั้งผ่าน npm run site:password แล้ว build
// build ฉีดบล็อกระหว่าง marker ต่อจาก <head> ทุกหน้า docs/ ที่ติดรหัส · หน้าไม่มี marker = build แทรกให้ครั้งแรก ส่วนนอก marker ไม่แตะ
import { readFileSync, readdirSync } from 'node:fs';
import { MOVED_MARK } from './nav.mjs';

export const GATE_START = '<!--GATE:START-->';
export const GATE_END = '<!--GATE:END-->';
// ผ่านแล้วจำค่า hash ไว้ใน sessionStorage — เปลี่ยนรหัสแล้วแท็บเดิมต้องใส่ใหม่ · ปิดแท็บ = ถามใหม่
export const GATE_KEY = 'next-life-gate';
export const GATE_CONFIG = new URL('./gate.json', import.meta.url);
// หน้าที่ไม่ติดรหัส: หน้าแรก + ตัวเกม (ข้อ 106) · หน้าส่งต่อพาไปหน้าที่ติดรหัสอยู่แล้ว จึงไม่ต้องบังซ้ำ
export const GATE_OPEN = ['index.html', 'play.html'];

export const readGateHash = (file = GATE_CONFIG) => {
  const { sha256 } = JSON.parse(readFileSync(file, 'utf8'));
  if (sha256 !== null && !/^[0-9a-f]{64}$/.test(sha256)) throw new Error('src/site/gate.json: sha256 ต้องเป็น hex 64 ตัวหรือ null');
  return sha256;
};

// file = path ใต้ docs/ · html ใช้แยกหน้าส่งต่อ
export const isGated = (file, html) => !GATE_OPEN.includes(file) && !html.includes(MOVED_MARK);

// หน้าทั้งหมดใต้ docs/ ที่ติดรหัส (path ใต้ docs/)
export function gatedFiles(docs) {
  const out = [];
  const walk = (dir) => {
    for (const d of readdirSync(new URL(dir, docs), { withFileTypes: true })) {
      const p = `${dir}${d.name}`;
      if (d.isDirectory()) walk(`${p}/`);
      else if (p.endsWith('.html') && isGated(p, readFileSync(new URL(p, docs), 'utf8'))) out.push(p);
    }
  };
  walk('');
  return out.sort();
}

// ปิด JS: ไม่มีอะไรเติม class ⇒ เนื้อซ่อน เหลือข้อความ ::before · เปิด JS: สคริปต์ใน <head> ตั้ง class ก่อนวาดหน้าแรก จึงไม่เห็นเนื้อแวบ
// ข้อความใน content: เขียน escape เพราะเครื่องมือบางตัวเขียน CSS กลับแล้วอักษรไทยเพี้ยน
const NOJS = 'ต้องเปิด JavaScript จึงจะเปิดหน้านี้ได้';
const cssText = (s) => [...s].map((c) => (c.charCodeAt(0) > 126 ? `\\${c.charCodeAt(0).toString(16).toUpperCase()} ` : c)).join('');
const GATE_CSS = `html:not(.nl-open) body>*:not(#nl-gate){display:none!important}
html:not(.nl-open):not(.nl-js) body::before{content:"${cssText(NOJS)}";display:block;padding:48px 24px;font:16px/1.6 Sarabun,"Noto Sans Thai",sans-serif;text-align:center}
#nl-gate{box-sizing:border-box;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#17110D;color:#F4EFE3;font:16px/1.6 Sarabun,"Noto Sans Thai",sans-serif}
#nl-gate *{box-sizing:border-box}
#nl-gate form{width:100%;max-width:360px;display:flex;flex-direction:column;gap:12px}
#nl-gate h1{margin:0;font-size:22px;color:#F0D78C}
#nl-gate p{margin:0}
#nl-gate input{min-height:44px;padding:8px 12px;font:inherit;color:#17110D;background:#F4EFE3;border:1px solid #5A4630;border-radius:6px}
#nl-gate button{min-height:44px;padding:0 16px;font:inherit;font-weight:700;color:#17110D;background:#F0D78C;border:0;border-radius:6px;cursor:pointer}
#nl-gate input:focus-visible,#nl-gate button:focus-visible,#nl-gate a:focus-visible{outline:3px solid #F0D78C;outline-offset:2px}
#nl-gate .err{min-height:1.6em;color:#F2A38F}
#nl-gate nav{display:flex;flex-wrap:wrap;gap:4px 16px}
#nl-gate a{color:#E3DDD0;display:inline-block;line-height:44px}`;

// ไม่มี crypto.subtle (เปิดผ่าน http ที่ไม่ใช่ localhost) = เทียบรหัสไม่ได้ ⇒ บอกตรง ๆ ไม่ปล่อยผ่าน
const gateScript = (hash, up) => `(()=>{const K=${JSON.stringify(GATE_KEY)},H=${JSON.stringify(hash)},d=document.documentElement;
try{if(sessionStorage.getItem(K)===String(H)){d.classList.add('nl-open');return}}catch(e){}
d.classList.add('nl-js');
addEventListener('DOMContentLoaded',()=>{const g=document.createElement('div');g.id='nl-gate';
g.innerHTML='<form role="dialog" aria-modal="true" aria-labelledby="nl-gate-h"><h1 id="nl-gate-h">หน้านี้ต้องใส่รหัส</h1><p>หน้าเอกสารของเกมเปิดเฉพาะคนที่มีรหัส · ตัวเกมเล่นได้เลยไม่ต้องใส่</p><label for="nl-gate-pw">รหัส</label><input id="nl-gate-pw" type="password" autocomplete="current-password" required><button type="submit">เข้า</button><p class="err" role="alert"></p><nav aria-label="หน้าที่ไม่ต้องใส่รหัส"><a href="${up}index.html">หน้าแรก</a><a href="${up}play.html">เล่นเกม</a></nav></form>';
document.body.prepend(g);const f=g.querySelector('form'),i=g.querySelector('input'),e=g.querySelector('.err');i.focus();
if(!H){e.textContent='ยังไม่ได้ตั้งรหัส หน้านี้จึงยังเปิดไม่ได้';i.disabled=true;g.querySelector('button').disabled=true;return}
f.addEventListener('submit',async(ev)=>{ev.preventDefault();e.textContent='';
if(!(window.crypto&&crypto.subtle)){e.textContent='เบราว์เซอร์นี้ตรวจรหัสไม่ได้ (ต้องเปิดผ่าน https)';return}
const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(i.value));
const x=[...new Uint8Array(b)].map((n)=>n.toString(16).padStart(2,'0')).join('');
if(x!==H){e.textContent='รหัสไม่ถูก ลองใหม่อีกครั้ง';i.select();i.focus();return}
try{sessionStorage.setItem(K,H)}catch(e){}g.remove();d.classList.add('nl-open');d.classList.remove('nl-js')})})})()`;

// noindex อยู่ในบล็อกเสมอ (ข้อ 106) — หน้าที่มี noindex ของตัวเองอยู่แล้วได้ซ้ำ ค่าเดียวกัน ไม่ขัดกัน
export function gateBlock(hash, file) {
  const up = '../'.repeat(file.split('/').length - 1);
  return `<meta name="robots" content="noindex"><style>${GATE_CSS}</style><script>${gateScript(hash, up).replace(/<\/script/gi, '<\\/script')}</script>`;
}

export function injectGate(html, hash, file) {
  const body = gateBlock(hash, file);
  const a = html.indexOf(GATE_START);
  const b = html.indexOf(GATE_END);
  if (a < 0 && b < 0) {
    const head = html.match(/<head[^>]*>/i);
    if (!head) throw new Error(`docs/${file}: ไม่มี <head> ให้แทรกกล่องรหัส`);
    const at = head.index + head[0].length;
    return `${html.slice(0, at)}\n${GATE_START}${body}${GATE_END}${html.slice(at)}`;
  }
  if (a < 0 || b < a || html.indexOf(GATE_START, a + 1) >= 0) throw new Error(`docs/${file}: ต้องมี ${GATE_START} … ${GATE_END} ชุดเดียว`);
  return html.slice(0, a + GATE_START.length) + body + html.slice(b);
}

// ส่วนระหว่าง marker — ใช้ในด่าน · null = ไม่มีบล็อก
export function gateBlockOf(html) {
  const a = html.indexOf(GATE_START);
  const b = html.indexOf(GATE_END);
  return a < 0 || b < a ? null : { body: html.slice(a + GATE_START.length, b), count: html.split(GATE_START).length - 1 };
}
