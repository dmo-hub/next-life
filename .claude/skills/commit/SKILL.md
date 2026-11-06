---
name: commit
description: "stage และ commit งานเข้า branch ของตัวเองใน next-life ให้มีแต่ของในใบ ใช้เมื่อขอ commit ร่าง commit message หรือจะ git add"
---

# commit งาน

commit และ push ได้เฉพาะ branch ของตัวเอง `lane-<ชื่อคุณ>/<ชื่อใบ>` ห้ามทำบน `main` ห้าม force push branch ของคนอื่น

## ขั้นตอน

1. ดูสถานะสด

   ```bash
   git branch --show-current
   git status --short -uall
   git diff --stat
   ```

2. อ่าน diff ทุกไฟล์ ของนอกใบไม่เข้า commit นี้
3. ลบโค้ดทดสอบ คำสั่ง debug และคอมเมนต์ที่เล่าว่าโค้ดทำอะไร คงคอมเมนต์ที่บอกเหตุผล
4. stage ทีละ path

   ```bash
   git add <path> <path>
   ```

   ห้าม `git add .` `git add -A` `git commit -a` ไฟล์เดียวมีงานปนกันใช้ `git add -p <path>`
5. เช็กของที่จะเข้า

   ```bash
   git diff --cached --stat
   git diff --cached --name-only
   ```

   ต้องไม่มี `.claude/` นอกสกิลเดิม `.vscode/` ไฟล์บีบอัด `src/version.json` `docs/whatsnew.html` `harness/keep-ids.json` `harness/fixtures/keep-snaps.json`
6. commit และ push branch ตัวเอง

   ```bash
   git commit -m "<message>"
   git push origin lane-<ชื่อคุณ>/<ชื่อใบ>
   ```

## message

Conventional Commits ภาษาอังกฤษ บรรทัดแรกไม่เกิน 72 ตัวอักษร

```
<type>(<scope>): <สิ่งที่เปลี่ยน>

<เหตุผล ถ้าอ่านจาก diff ไม่ออก>
```

type ที่ใช้: `feat` `fix` `docs` `chore` `refactor` `test` `ci`

ห้ามใส่บรรทัด `Co-Authored-By:`

## กับดัก

- commit แล้วไฟล์เปลี่ยนต่อ เลขด่านเดิมใช้ไม่ได้ ต้องวัดใหม่
- `node build.mjs` เปลี่ยน `docs/` ต้อง commit ผล build ด้วย CI เทียบ `docs/` กับผล build
- 1 commit 1 เรื่อง งานใหญ่แยกหลาย commit ด้วย pathspec
