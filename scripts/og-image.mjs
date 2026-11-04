// ภาพแชร์หน้าแรก 1200×630 + ไอคอน PNG 32/180 (ui-redo 68): ศิลป์ฉากเดิมของเกม (src/ui/art.mjs) + ชื่อเกมไทย/อังกฤษ ถ่ายด้วย Chromium ลง docs/
// รันเมื่อศิลป์/ชื่อเกมเปลี่ยน แล้ว commit ภาพ — build ไม่สร้างภาพเพราะต้องมีเบราว์เซอร์ · ใช้: PW_CORE=<โฟลเดอร์ playwright-core> npm run og
import { createRequire } from 'node:module';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ART_INK, sceneArt, ERA_ART_W, ERA_ART_H } from '../src/ui/art.mjs';
import { OG_IMAGE, OG_W, OG_H, FAVICON_PNG, TOUCH_ICON, faviconSvg } from '../src/site/seo.mjs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require(process.env.PW_CORE ?? 'playwright-core');
} catch {
  console.error('ไม่พบ playwright-core — ตั้ง PW_CORE (ดูหัวไฟล์ scripts/shots.mjs)');
  process.exit(2);
}
const docs = new URL('../docs/', import.meta.url);
const font = (file, family, weight) => `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(new URL(`../src/ui/fonts/${file}.woff2`, import.meta.url)).toString('base64')}) format('woff2')}`;
const path = (p) => `<path d="${p.d}" fill="${p.fill ?? 'none'}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.w ?? 1}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`;
// ฉากเกิด: ชื่อเกมพูดถึงการเกิดใหม่ · ภาพไม่มีคำต่างโลก (ข้อ 104)
const scene = sceneArt('birth_mid');
const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ERA_ART_W} ${ERA_ART_H}" width="900" height="${(900 * ERA_ART_H) / ERA_ART_W}">${scene.parts.map(path).join('')}</svg>`;
const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><style>
${font('Srisakdi-Bold', 'Srisakdi', 700)}${font('NotoSansThai-SemiBold', 'Noto Sans Thai', 600)}
html,body{margin:0;width:${OG_W}px;height:${OG_H}px;background:${ART_INK.lacquer};overflow:hidden}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;font-family:"Noto Sans Thai",sans-serif}
h1{margin:0;font:700 76px/1.15 Srisakdi,serif;color:${ART_INK.gold2};text-align:center}
p{margin:0;font-size:34px;letter-spacing:6px;color:${ART_INK.cream}}
</style></head><body>${art}<h1>เกิดใหม่ทั้งที ชาตินี้ขอชิงมาเกิด</h1><p>NEXT LIFE · ชีวิตคนไทยหลายรุ่น</p></body></html>`;

const browser = await pw.chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});
const shot = async (content, w, h, file, clear = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(content);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL(file, docs)), omitBackground: clear });
  await page.close();
  console.log(`docs/${file} ${w}×${h} · ${Math.round(statSync(new URL(file, docs)).size / 1024)}KB`);
};
await shot(html, OG_W, OG_H, OG_IMAGE);
const icon = (n) => `<!doctype html><html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(faviconSvg(ART_INK)).toString('base64')}" width="${n}" height="${n}" style="display:block"></body></html>`;
await shot(icon(32), 32, 32, FAVICON_PNG, true);
await shot(icon(180), 180, 180, TOUCH_ICON, true);
await browser.close();
