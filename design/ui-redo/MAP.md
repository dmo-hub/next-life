# MAP: หน้าจอใหม่ทั้งเกม (ui-redo)

repos: next-life · ตั้งเมื่อ 2026-11-03 (ใบ 01–16 มีมาก่อน · สเปก [SPEC.md](SPEC.md) · คำตัดสิน `../ui-redo-decisions.md`)

## Destination

หน้าจอเกมทุกโลกและเว็บเอกสารอยู่บนโครงใหม่ (แถบสถานะ · เมนูล่าง · แผง · การ์ดตาย) ตาม SPEC.md เข้า main ครบ ไม่มี branch UI ค้าง

## Notes

- ทำในเลน C · ส่งตรวจผ่านผู้รวมงาน · 390/1280 ล้น 0
- ⚠ ป้าย `claimed:` ในใบ 01–04 ยังเป็น `no` แต่ 03/04 มี branch แล้ว (lane-c/shell-statusbar · lane-c/menu-life) และงานต่อยอดอยู่ใน train65 — ตรวจตอนปิดใบ ไม่ใช่ว่าไม่ได้ทำ
- ขบวน 65 (เข้า main แล้ว — ผู้ค้าน 2026-11-04 ยืนยัน template.html มีค่าใบ 02): ใบ 03–12 + หน้าแรก ผ่าน lane-c/train65 → death-share c0430d5 · ใบ 13 3c13223 · ใบ 14 a74ee72
- จอช่องไอเทม B78 (world-overlap ใบ 23 · engine 944d08a) = งานเลน C ต่อจากใบ 14 — คำตัดสินอยู่ world-overlap decisions 101/105

## Decisions so far

- ใบ 01–14 ดูสถานะในแต่ละใบ (ไม่ย้าย) · ใบ 13 ธีมกรมท่า · ใบ 14 contrast `--dg #FF8A8A` (popup 2026-11-03)
- (2026-11-03 · popup เจ้าของ) ตั้งแผนที่นี้ + รับ backlog UI 3 ข้อเป็นใบ 17–19 + ใบตัดสิน branch ค้าง 20 · B12 หน้าตรวจเนื้อหามาที่นี่ (fog)
- [แผงพับ 3 อันเป็นแถบแท็บ](tickets/17-collapse-panels-to-tabs.md): แทนโดยใบ 06/11 · ไม่ทำแท็บในแผงครอบครัว
- [แยกบรรทัดฐานะกับเงิน](tickets/18-split-status-money-line.md): แทนโดยใบ 03/07 · ปิด
- [ตัดสิน branch UI ค้าง](tickets/20-stale-ui-branches.md): ลบ 15 ตัวหลังขบวน 65 เข้า main · focus-page เก็บ (rebase) · site-map/ui-proto ทิ้ง · nav เดียวไปใบ 16
- [หน้าเฉลยแยกตามงาน](tickets/21-spoilers-by-career.md): (2026-11-04 · เจ้าของผ่าน integrator + popup planner) ทางเข้า → การ์ดระหว่างงาน → ทางออก · % = ชีวิตที่เคยทำงานนี้เจอ · สายยศ 6 หัว + อาชีพหัวย่อย · ไฟล์ผลจำลองใน data/ รันแยก + site:check เตือนค้าง · ยังไม่มีเลน

- [หน้าจอ 10 ข้อ](../ui-redo-decisions.md) (2026-11-04 · เจ้าของสั่ง "หน้าจอและเว็บเป็นลำดับแรก" ผ่าน integrator · ข้อ 1–4 เจ้าของกด · 5–11 🌙 planner เลือกแทน รอเคาะเช้า · ยังไม่ผ่านผู้ค้าน): ใบ 22 แจ้งอัปเดตในเกม · 23 แผนงานหน้าแรก · 24 ป้ายเตือนพัก · 25 คำเตือนเนื้อหา · 26 กันกดพลาด · 27 รวมข่าวรายปี · 28 ขีดฆ่าชื่อ · 30 คู่ชีวิตที่ผ่านมา+ปีอยู่ด้วยกัน (none ทั้งหมด · 29 ยุบเข้า 30) · ใบ 15 ปรโลก รอ thai-life-deep 107 · 31 ภาพประกอบฉากสำคัญ (none) · ข้อ 5–12 เจ้าของยืนยันแล้ว 12:53

- [เว็บเอกสารเลย์เอาต์มาตรฐานเดียว](../ui-redo-decisions.md) (2026-11-04 15:29/15:35 · เจ้าของสั่งตรง + popup 3 รอบ · ผู้ค้าน opus Weakened 5 Stands 1 · ข้อ 25–36 · แทนใบ 16): ใบ [32 หน้า tweak](tickets/32-docs-layout-tweak.md) → 33 เจ้าของเคาะ → 34 CSS กลาง+ด่าน+หน้าผู้เล่น → 35 design / 36 dev · กฎถาวร: ปรับหน้า/เลย์เอาต์ทุกงานต้องมีหน้า tweak ก่อน

- [รวมหน้า "โลก"](tickets/42-worlds-merge-page.md) (2026-11-04 16:2x เจ้าของผ่านผู้รวมงาน · ข้อ 41): โครงหน้าอยู่ใน tweak ใบ 32 · ลงจริงใบ 42 ←33
- [UI 3 ข้อจากเจ้าของ](../ui-redo-decisions.md) (2026-11-04 16:0x ผ่านผู้รวมงาน · ข้อ 38–40): [37 พลิกการ์ด B เส้นทอง](tickets/37-flip-gold-trace.md) (ทับ B-fx A) · 38 tweak ฉายาหายาก/ตำนาน → 39 เจ้าของเลือก → 40 ลงเกม · [41 ภาพบ้านเมือง ข แถบภาพย่อ](tickets/41-town-tab-thumb-strip.md) (ทับ B176 ก)
- [design.html → ดีไซน์ UI](../ui-redo-decisions.md) (2026-11-04 16:25–16:40 · grill + ผู้ค้าน opus @ec9b3ac · ข้อ 42–57): หน้า UI = dev/ui.html · คำตัดสินเกม → dev/design*.html · เมนูการออกแบบเข้าห้อง dev · URL เดิม = หน้าส่งต่อจาก build · ใบ [43](tickets/43-design-move-to-dev.md) → [44](tickets/44-ui-page-skeleton.md) → [45](tickets/45-shots-capture-game-screens.md) · แก้ 32 (←44) 35 (= หน้า UI) 36 (+7 หน้า) 42 (←43)
- (2026-11-04 · คิว integrator) เกจฐานะ + เงินสด + อาชีพบนหัวการ์ด → [../ui-redo-decisions.md](../ui-redo-decisions.md) 58–64 (ผู้ค้าน @6ad9e6c Weakened 58–60) · ใบ 46 tweak (none) → 47 hitl · 48 แกนย่อเงินไทย/เกษียณ/สเกลทอง (none) → 49 ลงจริง (←47 48)

- (2026-11-04 18:28–18:32 · คิว integrator 18:3x) ภาพแรกเกิดพื้นหลังจาง + ภาพหมวดการ์ดผล → [../ui-redo-decisions.md](../ui-redo-decisions.md) 79–93 (ผู้ค้าน opus @efc61dc Weakened 79 80 82–85) · ใบ [58 tweak](tickets/58-card-art-tweak.md) → [59 hitl](tickets/59-card-art-hitl.md) → [61 แรกเกิด](tickets/61-birth-bg-apply.md) · [60 engine ป้ายหมวด](tickets/60-result-card-category-tag.md) + 59 → [62 การ์ดผล](tickets/62-result-card-art-apply.md)

## Not yet specified

- ใบ 15 ปรโลกบนโครงใหม่ — รอเกมในปรโลก (three-worlds) ชัดก่อน
- คำใบ้ค่าซ้อนในแผงตัวฉัน (world-overlap decisions 102/103 ม่านบาง/ขาด/พัง) — แผงตัวฉันชาติไทยยังไม่มี
- B12 หน้าตรวจเนื้อหา (ร่างเฟส 5 เก่า · เฟส v2 "ท้าย")

## Out of scope

- (ยังไม่มี)
