---
name: next-life-contributor
model: sonnet
description: ขั้นตอนส่งงานเข้า next-life สำหรับผู้ร่วมทำ ตั้งแต่รับใบงาน ทำ branch รันด่าน จนเปิด PR ที่ผ่านการตรวจ ใช้เมื่อจะเริ่มใบงาน เพิ่มเนื้อหา/ระบบ แก้ engine content หรือหน้าเว็บ commit push เปิดหรือแก้ PR แก้ conflict กับ main PR ถูกตีกลับ หรือเซสชัน AI พังกลางใบงาน (API error · context เต็ม) แล้วต้องกู้งานต่อ
---

# ส่งงานเข้า next-life

กติกาหลักอยู่ที่ `CONTRIBUTING.md` อ่านไฟล์นั้นก่อนเริ่ม ไฟล์นี้เติมจุดที่พลาดบ่อย
`CLAUDE.md` อ้างไฟล์ backlog และ LANES บนเครื่องเจ้าของ ซึ่งไม่มีในเครื่องผู้ร่วมทำ ข้อที่ต้องถามหรือจดไว้ให้ส่งผ่าน issue หรือ PR แทน

## ก่อนลงมือ

ไฟล์นี้พอสำหรับใบทั่วไป อ่าน `references/process.md` เฉพาะใบปรับหน้าจอ (หน้า tweak) ใบที่แตะ `src/engine` หรือ `content` (ด่านเพิ่ม) และใบย้ายโค้ดที่ต้องพิสูจน์ด้วย lifehash

เครื่อง qwen (gateway 9arm) อ่าน `references/two-machines.md` ตามหัวที่ต้องใช้ ไม่อ่านทั้งไฟล์: "เตรียมเครื่อง qwen" ครั้งแรกครั้งเดียว · "ทำหลายใบขนาน" เมื่อเปิดมากกว่า 1 session · เจอ API error อ่าน `references/api-errors.md`


1. ต้องมี issue ที่ assign ให้ (1 issue = 1 ใบ = 1 PR) ไอเดียใหม่ที่ไม่มีใบ เปิด issue ด้วยฟอร์ม "เสนอสายหรือระบบใหม่" ก่อน รอเจ้าของเคาะ แล้วค่อยเขียน ระบบใหม่ทั้งสายไม่เริ่มจาก PR
2. เจ้าของตัดสินดีไซน์ ตัวเลขสมดุล และเนื้อการ์ด AI เสนอได้ ห้ามตัดสินแทน ห้ามเขียนว่า "เจ้าของเคาะแล้ว" ถ้าไม่มีข้อใน `design/<เรื่อง>/decisions.md` หรือคำตอบใน issue รองรับ
3. เริ่มจาก main ล่าสุดทุกครั้ง branch ชื่อ `lane-<ชื่อคุณ>/<ชื่อใบ>`

   ```bash
   git fetch origin
   git switch -c lane-<ชื่อคุณ>/<ชื่อใบ> origin/main
   npm ci
   npm run setup:git
   ```

## อะไรเข้า PR ได้

เข้าได้เฉพาะไฟล์ที่เกมหรือเว็บใช้จริงตามโจทย์ในใบ ก่อน commit ดู `git status --short` แล้วใช้ `git add <path>` ทีละไฟล์ ห้าม `git add .`

ห้ามเข้า PR:

- `.claude/` (agent · ความรู้ · บันทึกค้นคว้า · เดโม) และ `.vscode/` เก็บไว้ในเครื่อง repo ตั้ง ignore ให้แล้ว
- ไฟล์บีบอัดหรือไบนารีที่เกมไม่ได้ใช้ (`.rar` `.zip`)
- เลขเวอร์ชัน whatsnew tag และ `keep --save` ผู้รวมงานทำตอนปล่อย
- `design/` เป็นสำเนาอ่านอย่างเดียว

## ลงงาน

- ตัวเลขเกมอยู่ใน `content/*.yaml` ไม่ฝังในหน้าจอ
- เพิ่มไฟล์ใน `src/engine` ต้องเติมชื่อใน `files` ของ `build.mjs`
- `docs/*.html` มาจาก `node build.mjs` ไม่แก้มือ ถ้าชนให้ build ใหม่
- แตะการ์ดหรือเงื่อนไขของเดิม บอกใน PR ว่าแตะอะไร เพราะผลต่อเกมเดิมต้องวัด

## ก่อนเปิด PR

```bash
git fetch origin
git merge origin/main
node build.mjs
npm run lint:test
npm run harness:test
npm run site:check
npm run check:data
```

จากนั้นเปิด `docs/play.html` เล่นส่วนที่แก้จนเห็นกับตา console error ต้องเป็น 0

- `npm run <ด่าน> -- --n 500` ไม่มีผล ถ้าต้องเปลี่ยน n หรือ seed ให้เรียก `node harness/<ด่าน>.mjs --n 500` ตรง ๆ
- ใบแตะ engine รันด่านที่ใบระบุด้วย แล้วจดตัวเลขลง PR
- ด่านตก บอกตามจริงใน PR ว่าตกบรรทัดไหน อย่าติ๊กผ่าน

## เนื้อ PR

กรอกแม่แบบให้ครบทุกหัว ห้ามปล่อยว่าง

- ใบงาน: `Closes #<เลข issue>`
- ทำอะไร: ผู้เล่นเห็นอะไรเปลี่ยน และไฟล์เดิมที่แตะ
- ด่านที่รัน: ติ๊กเฉพาะที่รันจริง พร้อมตัวเลขด่านเพิ่ม
- ร่างโน้ต whatsnew: 1–3 บรรทัด ภาษาผู้เล่น
- ต้องให้เจ้าของเคาะ: ตัวเลขหรือดีไซน์ที่ตีความเอง

PR ควรเล็กพอให้อ่านจบ ระบบใหญ่แบ่งเป็นหลายใบหลาย PR

## ด่านที่กันให้อัตโนมัติ

- **`pr guard` ใน CI** ตกเมื่อ PR มีไฟล์ต้องห้ามหรือเนื้อ PR ไม่ได้กรอก บรรทัด `ตก` บอกชื่อไฟล์หรือข้อที่ต้องแก้ แก้เนื้อ PR แล้วด่านรันใหม่เอง
- PR ไม่มี check ขึ้นเลย แปลว่า PR ยังชน main ให้ merge main แล้วแก้ชนก่อน GitHub จึงรันด่าน
- **hook ในเครื่องคุณ** (`.claude/hooks/contributor-guard.mjs`) บล็อก `git add .` `git add -A` `git commit -a` การ commit หรือ push บน main และคำสั่งปล่อยเวอร์ชัน ถ้าโดนบล็อกให้ทำตามข้อความ อย่าหาทางเลี่ยง
- **agent `design-challenger`** ใช้ค้านข้อเสนอก่อนส่งเจ้าของ ให้ชี้ไฟล์คำตัดสินใน `design/` และ sha ที่จะอ่าน

## PR ถูกตีกลับหรือปนของนอกใบ

เช็กผลตรวจ = ดูทั้ง `gh pr view <pr> --comments` **และ** `gh issue view <issue> --comments` · คำสั่งแก้ของเจ้าของหรือผู้รวมงาน (ขึ้นต้น `# เจ้าของ`) มักอยู่ใน issue ของใบ ไม่ใช่ใน PR · PR ที่ `reviews: []` ไม่ได้แปลว่ายังไม่มีคนตรวจ

ผู้รวมงานสั่งย้ายฐาน (ทิ้ง commit build แล้ว build ใหม่เป็น commit ท้าย) ไม่ต้อง `reset --hard` หรือ `rebase -i`:

```bash
git fetch origin
git rebase --onto <sha main ที่ผู้รวมงานสั่ง> <sha ฐานเดิม>
# commit source ย้ายผ่าน · ชนที่ commit build (docs/*) → ทิ้ง commit นั้น
git rebase --skip
node build.mjs
git add -- docs/<ไฟล์ที่ build เปลี่ยน>
git commit -m "build(docs): rebuild หลังย้ายฐาน"
```

ถ้า commit source ชนจริง rebase หยุดให้เห็นตรงนั้น แก้ชนแล้ว `git rebase --continue` · ห้าม `--skip` commit source

อย่าแก้ทับบน branch เก่าที่ห่าง main มาก ให้ยกเฉพาะไฟล์งานขึ้น branch ใหม่

```bash
git fetch origin
git switch -c lane-<ชื่อคุณ>/<ชื่อใบ> origin/main
git checkout <branch เก่า> -- <ไฟล์งานที่เพิ่มใหม่>
```

ไฟล์เดิมที่ทั้งสองฝั่งแก้ (`build.mjs` `src/engine/life.mjs` `src/node/load.mjs`) ห้าม checkout ทับ เพราะจะลบงานใน main ทิ้ง ให้เติมบรรทัดของงานเองทีละจุด แล้ว build และรันด่านใหม่ทั้งชุด ปิด PR เก่าแล้วเปิดใหม่ หรือ force push branch ของตัวเอง

## หลัง PR ปิด

ผู้รวมงานเอางานลง main ได้ทั้ง merge และ cherry-pick · ลงด้วย cherry-pick แล้วปิด PR สถานะจะเป็น `CLOSED` ไม่ใช่ `MERGED` · ห้ามดูแค่ `state` แล้วสรุปว่างานไม่ลง (เปิด PR ซ้ำ) หรือลงแล้ว (ลบ branch)

1. อ่านคอมเมนต์ปิดใน PR และ issue ของใบ
2. เช็กว่าลงครบ:

   ```bash
   git fetch origin
   git cherry origin/main <head PR> <ฐาน PR>
   ```

   ทุก commit source ต้องขึ้น `-` (patch เดียวกับบน main) · commit build ขึ้น `+` ได้ เพราะ main build ใหม่เอง
3. ลงด้วย cherry-pick แล้ว `git branch -d` ไม่ผ่าน (commit ไม่ใช่ ancestor ของ main) · ห้ามใช้ `-D` เอง รอผู้รวมงานสั่งลบ

## เซสชัน AI พังกลางใบงาน (API error · context เต็ม · เครื่องดับ)

state ของใบงานอ่านจาก git ได้ทุกจุด เช็คก่อนกู้:

```bash
git branch --show-current   # ต้องเป็น lane-<ชื่อคุณ>/<ชื่อใบ>
git status --short          # ไฟล์ค้างกี่ตัว
git log --oneline -3        # commit ไหนค้างบน branch
```

กู้ตาม stage:

- **ยังไม่ commit** — ไฟล์ค้างใน working tree ยังอยู่ครบ ทำงานต่อได้เลย
- **commit บางส่วน** — ดู `git log` ว่าถึงขั้นไหนของขั้นตอนใน `CONTRIBUTING.md` แล้วต่อตรง
- **commit ครบ ยังไม่ push** — push ตามขั้นตอนได้ งานไม่หาย
- **push แล้ว PR เปิดอยู่** — เซสชันพังไม่กระทบ งานอยู่บน remote แล้ว

ถ้าเซสชันเดิมกู้ไม่ได้ เปิดเซสชันใหม่แล้วส่ง handoff ที่ผูกกับใบงาน:

```
ใบงาน: issue #<n> — <ชื่อใบ>
branch: lane-<ชื่อคุณ>/<ชื่อใบ> (commit ล่าสุด: <sha>)
ขั้นที่ทำแล้ว: <เช่น build ผ่าน · ผ่าน lint:test + harness:test · ยังไม่ site:check>
ด่านที่ต้องรันเพิ่ม: <ด่านที่ใบงานระบุ>
```

ผล verify ที่ claim จากเซสชันที่พังเชื่อถือไม่ได้ — เซสชันใหม่ต้องรันด่านซ้ำทุกด่านที่ claim ว่าผ่าน และก่อนเปิด PR ต้อง merge main + `node build.mjs` ใหม่เสมอ เพราะ main อาจขยับระหว่างที่เซสชันพัง

กันใบงานค้างกลางทาง:

- commit ตาม milestone บน lane branch ของตัวเอง (ไม่ใช่ push) — ใบที่แตะหลายไฟล์ commit แยกตามระบบ (`content:` · `fix(ui):` · `feat(engine):`)
- ห้ามค้าง uncommitted นาน — context เสียได้ แต่ commit แล้วไม่เสีย
- ใบใหญ่เกิน session เดียว แบ่ง commit ตามระบบแล้ว handoff ระหว่างเซสชัน
