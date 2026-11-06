# ร่วมทำ next-life

ขอบคุณที่มาช่วยทำเกม ไฟล์นี้คือกติกาสำหรับทุกคนที่ส่งงานเข้า repo นี้

## ใครตัดสินอะไร

- **เจ้าของเกม** ตัดสินเรื่องดีไซน์ ตัวเลขสมดุล และเนื้อหาการ์ดทั้งหมด
- **ผู้รวมงาน** เป็นคนเดียวที่ merge เข้า `main` และเป็นคนรันด่านหนัก (full n2000) bump เวอร์ชัน เขียน whatsnew และติด tag
- **ผู้ร่วมทำ** (คุณ) ทำทีละใบงานใน branch ของตัวเองแล้วส่งเป็น Pull Request

ถ้าไม่แน่ใจ ให้ถามใน issue หรือ PR อย่าเดา

## อ่านก่อนเริ่ม

- `.claude/skills/next-life-contributor/SKILL.md` — ขั้นตอนส่งงานสำหรับคนที่ใช้ AI ช่วยทำ `CLAUDE.md` สั่งให้ Claude Code อ่านไฟล์นี้เอง
- `GDD.md` — เอกสารออกแบบเกม (กติกาแต่ละระบบอยู่หน้า `docs/about.html` · `worlds.html` · `otherworld.html`)
- `design/<เรื่อง>/decisions.md` — ข้อที่เจ้าของเคาะแล้ว ห้ามทำขัด
- `design/<เรื่อง>/MAP.md` — ใบงานในเรื่องนั้นและลำดับ
- `design/lore/` — ข้อมูลอ้างอิงตอนเขียนเนื้อหาและตัวเลข

`design/` เป็นสำเนาอ่านอย่างเดียว อย่าแก้ในนั้น (ถูกคัดลอกทับทุกครั้งที่ปล่อยเวอร์ชัน)

## ข้อห้าม

- ห้ามแก้ตัวเลขสมดุลที่เจ้าของเคาะไว้ (ค่าใน `content/*.yaml`, `data/*.json` และค่าคงที่ใน `src/engine`) ถ้าคิดว่าควรเปลี่ยน ให้เขียนข้อเสนอพร้อมตัวเลขไว้ใน PR หรือ issue แล้วรอเจ้าของเคาะ
- ทำแค่โจทย์ในใบงาน ไอเดียนอกใบให้เปิด issue ใหม่ แล้วกลับมาทำงานเดิม
- ห้าม push เข้า `main` ตรง ๆ และห้าม force push branch ของคนอื่น
- ใน PR ห้าม bump เวอร์ชัน · ห้ามแก้ whatsnew · ห้ามติด tag · ห้ามรัน `keep --save` (ผู้รวมงานทำหลัง merge)

## ขั้นตอนต่อหนึ่งใบงาน

1. รับใบงานจาก issue ที่ assign ให้คุณ (1 issue = 1 ใบ = 1 PR)
2. สร้าง branch จาก `main` ล่าสุด

   ```bash
   git fetch origin
   git switch -c lane-<ชื่อคุณ>/<ชื่อใบ> origin/main
   npm ci
   ```

3. แก้งาน · ตัวเลขเกมเก็บใน `content/*.yaml` ไม่ฝังลงในหน้าจอ · ถ้าเพิ่มไฟล์ใน `src/engine` ให้เติมชื่อไฟล์ใน `files` ของ `build.mjs` ด้วย
4. build แล้วเปิดเกมจริง

   ```bash
   node build.mjs
   ```

   เปิด `docs/play.html` ในเบราว์เซอร์ เล่นส่วนที่แก้ให้เห็นกับตา และ console error ต้องเป็น 0
5. รันด่านเร็ว (CI จะรันซ้ำให้ทุก PR)

   ```bash
   npm run lint:test
   npm run harness:test
   npm run site:check
   npm run check:data
   ```

   ถ้าใบงานแตะ engine ให้รันด่านที่ใบงานระบุเพิ่ม (เช่น `npm run titles`, `npm run isekai`)

   ⚠️ harness อ่าน argument ตัวแรกที่เจอ ⇒ `npm run titles -- --n 500` **ไม่มีผล** (ได้ค่าใน package.json) ถ้าต้องเปลี่ยน n/seed ให้เรียกตรง เช่น `node harness/titles.mjs --n 500 --gens 3 --seed 1`
6. ก่อนเปิด PR ให้ rebase บน `main` ล่าสุด แล้วรัน `node build.mjs` อีกรอบ — `docs/*.html` ใน PR ต้องตรงกับผล build
7. `git push -u origin lane-<ชื่อคุณ>/<ชื่อใบ>` แล้วเปิด PR เข้า `main` ตามแม่แบบ
8. ผู้รวมงานรันด่านหนักแล้ว merge ให้ ถ้าด่านตกจะส่งกลับมาใน PR พร้อมบรรทัดที่ตก

## ชื่อ branch และ commit

- branch: `lane-<ชื่อคุณ>/<ชื่อใบ>` เช่น `lane-mint/menu-money`
- commit: Conventional Commits ภาษาอังกฤษ เช่น `feat(engine): ...` · `fix(ui): ...` · `content: ...` · `build: ...`
- ไม่ต้องลบ branch หลัง merge

## ไฟล์ที่ชนกันบ่อย

- `docs/*.html` สร้างจาก `node build.mjs` ถ้าชนให้ build ใหม่ อย่าแก้มือ ยกเว้นส่วนที่เขียนมือใน `docs/gdd.html` และ `docs/index.html` (ห้ามแก้ระหว่าง `<!--SPEC:START-->` … `<!--SPEC:END-->`)
- `package.json` (scripts) และรายชื่อ key ใน `src/node/lint/shape.mjs` มักโดนเติมพร้อมกันหลายใบ ถ้าชนให้เก็บของทั้งสองฝั่ง
