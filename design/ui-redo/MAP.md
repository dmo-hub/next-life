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
- (2026-11-05 16:45) JSON 47 → [../ui-redo-decisions.md](../ui-redo-decisions.md) 161–166 · หัวการ์ดไม่มีเกจทั้งสองโลก (ฐานะเป็นคำ · ทองเป็นตัวเลข) · เมนูไอคอน+ป้าย · แท็บโฟกัสรายการเดียว · ต่างโลกเปลี่ยนโฟกัสในแท็บ (ทับ 70) · 47 ✅ · 49 none · 50 ←49 · 51 ←50 83 · 80 ห้ามจ่ายพร้อม 49
- (2026-11-05 17:40 · เจ้าของผ่าน integrator) ใบ 40 ชื่อฉายาอ่านยาก → ข้อ 183 · [95 พื้นรองใต้ชื่อฉายา](tickets/95-title-name-backing.md) ←49 เลน omen

- (2026-11-04 18:28–18:32 · คิว integrator 18:3x) ภาพแรกเกิดพื้นหลังจาง + ภาพหมวดการ์ดผล → [../ui-redo-decisions.md](../ui-redo-decisions.md) 79–93 (ผู้ค้าน opus @efc61dc Weakened 79 80 82–85) · ใบ [58 tweak](tickets/58-card-art-tweak.md) → [59 hitl](tickets/59-card-art-hitl.md) → [61 แรกเกิด](tickets/61-birth-bg-apply.md) · [60 engine ป้ายหมวด](tickets/60-result-card-category-tag.md) + 59 → [62 การ์ดผล](tickets/62-result-card-art-apply.md)

- (2026-11-05 17:0x · session next-life-design-map · popup เจ้าของ 3 รอบ · ยังไม่ผ่านผู้ค้าน) **รื้อ UI ทั้งเว็บด้วยสกิลออกแบบชุดใหม่** — คำเจ้าของ = [../ui-redo-decisions.md](../ui-redo-decisions.md) ข้อ 167–175 (ที่มา [design-skills-map.md](design-skills-map.md) · ยังไม่ผ่านผู้ค้าน — รันก่อนใบ 94): ทั้งเว็บรวม dev · เปิดทิศสไตล์ใหม่ 4 โทนเทียบใบ 02 · ปลายทาง = `design-skills/SPEC.md` สเปกรื้อทั้งชุด · ตัดได้ถึงระดับหน้า (URL เดิมส่งต่อ) · ห้อง dev ตามสไตล์ใหม่ · ต้นแบบทำใน `design-skills/prototypes/` → integrator นำเข้า dev/ui.html · ใบ 49 50 51 80 83 เดินต่อ · ใบ 86–94 (none: 86 87 88 89 · 90 ←86 87 · 91 ←88 89 · 93 ←91 · 92 ←91 93 · 94 ←90 92)
  - สกิล (อ่านจาก repo `.claude/skills/`): ตั้งโทน frontend-design · palette/ฟอนต์ ui-ux-pro-max (อ้างอิงเท่านั้น) · ออกแบบ/redesign design-taste-frontend (ระวัง WebGL/glass) · แผงปรับสด tweaks · ตรวจ web-design-guidelines + accessibility-auditor + web-performance-optimization · แพตช์โน้ต changelog-generator · theme-factory ไม่ใช้
  - [86 ทะเบียนหน้า](tickets/86-page-section-inventory.md): 19 กลุ่มหน้า · กว้าง 6 ค่า · cards.html กำพร้า · ผู้สมัครรวม 9 กลุ่ม · ตัด/รวมหน้าต้องแก้ marker/data-fact/site-check
  - [87 ผลตรวจสกิล](tickets/87-skill-audit-current.md): 16 finding · โครง = play.html ไฟล์เดียว 2.6 MB + สองระบบดีไซน์ · ต้องมี token โฟกัส/press/เป้าแตะ 44 · อักษรไทย ≥12–13px · design-taste ห้าม WebGL
  - [88 ข้อกำหนดที่ต้องรักษา](tickets/88-locked-constraints.md): A ~25 ข้อรักษาทุกสไตล์ · B ค่าหน้าตาทับได้ · C ก้ำกึ่ง 14 ข้อ (ราวซ้าย/แผงค้าง · หัวการ์ดไม่มีเกจ ฯลฯ) → ตัดสินใน 92
  - [89 palette+ฟอนต์ 4 โทน](tickets/89-tone-palette-font.md): ไทยร่วมสมัย Maitree · สมุด Mali+Sarabun · สดใส Mitr · มินิมอล Plex+Noto Serif Thai · contrast ≥ 4.83 ทุกคู่ (วัด subagent)
  - [90 ตัด/รวมหน้า](tickets/90-page-cut-merge-add.md) (popup เจ้าของ 2 รอบ ~17:18–17:20 · decisions 176–182): about#ต่างโลก → หน้าโลก · catalog+spoilers รวมหน้าเดียวเปิดเฉลยต่อใบ (ทับ 21) · guide+about รวมที่ guide.html · cards → dev/ui · dev/plan → whatsnew · dev/maps หน้าเดียวสลับผัง · ยังไม่เพิ่มหน้า (รอ 91) · URL เดิม = หน้าส่งต่อ (กลไก 43) · ยังไม่ผ่านผู้ค้าน
  - [91 ต้นแบบ 4 ทิศ](tickets/91-style-prototypes.md) (17:29): `design-skills/prototypes/style-tones.html` 5 ทิศ × 6 ฉาก · 390/1280 · แผงปรับสด KEY `next-life-style-tweak-v1` · วัด ล้น 0 · ปุ่ม ≥44 · contrast ≥4.51 · → 93 integrator นำเข้า
  - (17:40) ผู้ค้าน 167–182 → popup เจ้าของ 2 รอบ = decisions 184–191: รวม catalog+spoilers จริง (187) · dev/plan เข้า whatsnew เขียนใหม่ (188) · ตัด about#ต่างโลก (186) · ผังห่อแยก (189) · รื้อ archive (184) · แดง=ติดลบ (185) · หน้าส่งต่อไม่มี # (191) → ใบ 94 พร้อมเมื่อ 92 จบ
  - (17:45) ข้อ 192 คง vanilla JS/HTML ไม่ย้าย framework · ใบ 94 แยกไฟล์ส่ง play.html แทน
  - (17:55) [93 นำเข้า](tickets/93-ui-html-import.md) 10378be `dev/ui.html#ui-t-style-tones` · [92 เลือกสไตล์](tickets/92-owner-style-pick.md) decisions 193–198: ทิศหลัก 1 ไทยร่วมสมัย · รอง 2 · สีเน้นคราม #1B2A4A (ชาดเป็นลาย) · กลุ่ม B ทับทั้งสีและรูปทรง (ต้องมี tweak) · C คง 13 · C12 หัวหน้าแรกเปิดรื้อ → frontier: ใบ 94 SPEC
  - (18:20) [94 SPEC](design-skills/SPEC.md) ผ่านผู้ค้าน + decisions 200–207 · /to-tickets → ใบ **96–127**: โครง 96–101 · tweak T1–T3 102–104 → ลงรวม 105 · คู่ tweak→ลง T4–T13 106–125 · T14 126 → รวมหน้าการ์ด 127 · frontier ตอนนี้: 96 99 100 101 102 (97 ←82 · 98 ←50 · 127 ←21)

## Not yet specified

- (design-skills) ค่าที่เคาะแล้วรอดแค่ไหนเมื่อเปลี่ยนสไตล์ · ธีมต่างโลก/ปรโลก/ลายรดน้ำบนสไตล์ใหม่ · dev/maps พื้นมืด · ลำดับปล่อย (ทีละชิ้นข้อ 13 หรือทั้งชุด) + SEO หน้าที่ยุบ (ใบ 68) · งบความเร็วฟอนต์ไทยเพิ่ม
- ใบ 15 ปรโลกบนโครงใหม่ — รอเกมในปรโลก (three-worlds) ชัดก่อน
- คำใบ้ค่าซ้อนในแผงตัวฉัน (world-overlap decisions 102/103 ม่านบาง/ขาด/พัง) — แผงตัวฉันชาติไทยยังไม่มี
- B12 หน้าตรวจเนื้อหา (ร่างเฟส 5 เก่า · เฟส v2 "ท้าย")

## Out of scope

- (design-skills) ลงโค้ดก่อน SPEC จบ · หน้าตั้งค่า (ข้อ 10) · กลไก/เนื้อหาเกม · docs/archive/*
  - (18:32) ผู้รวมงานจ่าย frontier: 99 101 → เลน A · 100 → เลน C (หลัง 128) · 96 → เลน B (หลัง dynasty/204) · 102 omen ถืออยู่
