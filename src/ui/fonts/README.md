# ฟอนต์ฝังของเกม (docs/play.html)

build.mjs อ่าน `*.woff2` ในโฟลเดอร์นี้แล้วฝังเป็น `@font-face` แบบ base64 — เกมเปิดออฟไลน์ได้ และภาพแชร์ได้ Srisakdi จริง
หน้าเว็บอื่น (index · about · catalog ฯลฯ) ยังดึง Google Fonts ตามเดิม

- ต้นทาง: Google Fonts `github.com/google/fonts` → `ofl/notosansthai` · `ofl/sarabun` · `ofl/srisakdi` (TTF) · สัญญาอนุญาต SIL OFL 1.1 (`*-OFL.txt`)
- ใช้ 5 แบบ: Noto Sans Thai 400/600 (หัวและเนื้อของหน้าเล่น) · Sarabun 400/600 (ภาพแชร์และภาพชั้นสมุดที่วาดลง canvas) · Srisakdi 700 (Srisakdi 400 ไม่มีที่ใช้ — ทุกจุดเป็นตัวหนา)
- ตัดด้วย fonttools (ไม่อยู่ใน package.json — รันครั้งเดียวนอกเกม: `pip install --user fonttools brotli`)
- Noto Sans Thai ต้นทางเป็นฟอนต์แปรผัน (`NotoSansThai[wdth,wght].ttf`) — ตรึงน้ำหนักก่อนตัด: `python -m fontTools.varLib.instancer NotoSansThai[wdth,wght].ttf wght=400 wdth=100 -o i400.ttf` (600 เหมือนกัน)

```
pyftsubset <ไฟล์>.ttf --flavor=woff2 --output-file=<ชื่อ>.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0E00-0E7F,U+2010-2027,U+2030-203A,U+2190-2194,U+21D2,U+2212,U+2248,U+2264-2265,U+2460-2463"
```

ช่วงตัวอักษร = ไทยทั้งบล็อก + ASCII + เครื่องหมายที่เกมใช้ · ไม่ตัดตามตัวที่ปรากฏในเนื้อหา เพราะชื่อสุ่มและข้อความประกอบตอนเล่นไม่ตายตัว
เพิ่มเครื่องหมายใหม่ในเนื้อหาแล้วฟอนต์ไม่มี = ตกไปฟอนต์สำรองเฉพาะตัวนั้น → ตัดใหม่ด้วยช่วงที่เพิ่ม
