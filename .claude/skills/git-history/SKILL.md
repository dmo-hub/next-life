---
name: git-history
description: "กับดัก git ที่ทำงานหายเงียบใน next-life ใช้ก่อน merge rebase cherry-pick stash แก้ conflict สลับ branch หรือเมื่อ commit หาไม่เจอ"
---

# กับดัก git

## branch ห่าง main มาก

ไฟล์ที่ branch ไม่ได้แก้แต่ main แก้ไปแล้ว อาจถูกย้อนถ้า checkout ทับ อย่า `git checkout <branch เก่า> -- <ไฟล์เดิม>` กับไฟล์ที่สองฝั่งแก้ ยกเฉพาะไฟล์ใหม่ ไฟล์เดิมให้เติมบรรทัดเอง

ก่อน merge ดูว่ากระทบอะไร

```bash
git merge-tree --write-tree --name-only origin/main HEAD
git diff --stat origin/main...HEAD
```

merge-tree ไม่ชนไม่ได้แปลว่ารวมแล้วถูก อ่าน diff สองฝั่งของไฟล์เดียวกันหาตัวแปรที่อีกฝั่งเปลี่ยนความหมาย

## แก้ conflict

- ชนใน `docs/` ที่มาจาก build เอาฝั่งใดก็ได้ แล้ว `node build.mjs` ทับ อย่าแก้มือ ตั้ง `npm run setup:git` ไว้ก่อน
- ชนซอร์สที่ทั้งสองฝั่งเติมของ ปกติต้องเก็บทั้งสองฝั่ง ไม่เลือกฝั่งเดียว
- หลังแก้ ไล่ด้วย `git diff --check` แล้วรันด่าน ไม่มีเครื่องหมายชนเหลือไม่ได้แปลว่าถูก
- ชนในตรรกะที่คำตัดสินขัดกัน ถามใน PR อย่าตัดสินเอง

## stash

- `git stash -u` กับ pathspec เก็บ untracked ไว้ส่วนแยก `stash show --stat` ไม่แสดง ใช้ `--include-untracked` ตอนดู
- stash ใช้ร่วมทุก worktree เลี่ยงโดย commit ลง branch ชั่วคราวแทน

## commit หาย

```bash
git reflog
git branch --contains <sha>
git merge-base --is-ancestor <sha> origin/main
```

- commit ที่สร้างตอน detached HEAD หายจากสายตาเมื่อสลับ branch ใช้ reflog หา แล้วสร้าง branch ชี้
- ถูกยกด้วย cherry-pick จะได้ sha ใหม่ `--is-ancestor` ตกทั้งที่เนื้อเข้าแล้ว ให้เทียบด้วย `git diff <sha เดิม> <sha ใหม่>`

## ก่อนคำสั่งย้อนกลับไม่ได้

`reset --hard` `clean -f` `checkout --` `branch -D` และ force push ลบของจริง ดู `git status --short -uall` ก่อน และถามผู้ใช้ทุกครั้ง

ลบ worktree ที่ `node_modules` เป็น junction หรือ symlink ต้องถอดลิงก์ก่อน ไม่งั้นลบทะลุไปของจริง
