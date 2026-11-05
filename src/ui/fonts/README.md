# ฟอนต์ของทั้งเว็บ (ต้นฉบับ)

build.mjs คัดลอก `*.woff2` ที่อยู่ในตาราง `FONTS` (src/site/fonts.mjs) ไป `docs/fonts/` และเขียน `docs/fonts/fonts.css` — ทุกหน้าใช้ไฟล์ชุดเดียวกัน ไม่ดึง Google Fonts (ui-redo 96 · ข้อ 205)
หน้าเล่นฝัง `@font-face` ของ 4 แบบที่ใช้ใน `<style>` ชี้ `fonts/*.woff2` · service worker เก็บไว้ให้เปิดออฟไลน์ · ภาพแชร์ (canvas) รอ `document.fonts.load` ก่อนวาดจึงได้ Srisakdi จริง

- ต้นทาง: Google Fonts `github.com/google/fonts` → `ofl/<ตระกูล>` (TTF) · สัญญาอนุญาต SIL OFL 1.1 (`*-OFL.txt`)
- หน้าเล่นใช้ 4 แบบ: Sarabun 400/600 (เนื้อ + ภาพแชร์และภาพชั้นสมุดที่วาดลง canvas) · Maitree 600 (หัว) · Srisakdi 700 — Noto Sans Thai ถอดแล้ว (ui-redo 105 · ข้อ 216)
- Sarabun มีแค่ 400/600 (ข้อ 216 · หน้าที่ขอ 700/ตัวเอียงได้ 600 แทน)
- หน้าเอกสาร: Maitree 500/600 (หัว) + Sarabun 400/600 (เนื้อ) · Srisakdi 700 ชื่อเกมหัวหน้าแรก · หน้า tweak/ต้นแบบ/แผนที่ dev: Noto Sans Thai · Srisakdi 400 · Pridi · Mitr · Mali · IBM Plex Sans Thai · Noto Serif Thai
- เพิ่มแบบใหม่: ตัดไฟล์ตามข้างล่าง วางในโฟลเดอร์นี้ แล้วเติมแถวในตาราง `FONTS` (site-check ตรวจว่าไฟล์ใน docs/fonts ตรงต้นฉบับและ fonts.css ตรงตาราง)
- ตัดด้วย fonttools (ไม่อยู่ใน package.json — รันครั้งเดียวนอกเกม: `pip install --user fonttools brotli`)
- Noto Sans Thai / Noto Serif Thai ต้นทางเป็นฟอนต์แปรผัน (`NotoSansThai[wdth,wght].ttf`) — ตรึงน้ำหนักก่อนตัด: `python -m fontTools.varLib.instancer NotoSansThai[wdth,wght].ttf wght=400 wdth=100 -o i400.ttf` (600/700 เหมือนกัน)

```
pyftsubset <ไฟล์>.ttf --flavor=woff2 --output-file=<ชื่อ>.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0E00-0E7F,U+2010-2027,U+2030-203A,U+2190-2194,U+21D2,U+2212,U+2248,U+2264-2265,U+2460-2463"
```

ช่วงตัวอักษร = ไทยทั้งบล็อก + ASCII + เครื่องหมายที่เกมใช้ · ไม่ตัดตามตัวที่ปรากฏในเนื้อหา เพราะชื่อสุ่มและข้อความประกอบตอนเล่นไม่ตายตัว
เพิ่มเครื่องหมายใหม่ในเนื้อหาแล้วฟอนต์ไม่มี = ตกไปฟอนต์สำรองเฉพาะตัวนั้น → ตัดใหม่ด้วยช่วงที่เพิ่ม
