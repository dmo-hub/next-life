# ทำงาน 2 เครื่อง: เครื่องเจ้าของ + เครื่อง qwen

ใช้เมื่อเจ้าของทำงานจาก 2 เครื่อง เครื่องหนึ่งใช้โมเดล Claude ตัวเต็ม อีกเครื่องใช้ Claude Code ต่อ gateway 9arm (โมเดล Qwen · context 128k) ไฟล์นี้บอกว่าแต่ละเครื่องทำอะไร และเครื่อง qwen ต้องเตรียมอะไรก่อนรับใบงานแรก

## แบ่งบทบาท

| | เครื่องเจ้าของ (Claude ตัวเต็ม) | เครื่อง qwen (RAM มากกว่า) |
|---|---|---|
| บทบาท | เจ้าของ + ผู้รวมงาน | ผู้ร่วมทำ |
| ทำ | grill · spec · ตัดใบงาน · design-challenger · รีวิว PR · merge · bump · whatsnew · tag | ทำใบงานที่ spec ชัดแล้ว · build · ด่านเร็ว · ด่านหนัก n2000 · เล่นทดสอบ `docs/play.html` |
| ไม่ทำ | ด่านหนักบ่อย ๆ | ตัดสินดีไซน์ ตัวเลขสมดุล หรือเนื้อการ์ด |

เหตุผล: งานคิดและงานจับผิดต้องใช้โมเดลที่แรงกว่า งานทำตามคำสั่งชัด ๆ และงานกิน RAM ให้เครื่อง qwen

## ช่องทางเดียวระหว่างเครื่อง = GitHub

- 2 เครื่องไม่เห็น session ของกันและกัน (SendMessage ข้ามเครื่องไม่ได้)
- ใบงาน = issue · คำถาม ผลด่าน และข้อเสนอ = comment ใน PR หรือ issue
- ของที่ qwen ต้องใช้ให้อยู่ใน `.claude/skills/` ของ repo นี้ · ไฟล์งานของเจ้าของ (backlog · LANES) sync ผ่าน repo แยกตามหัว "sync ไฟล์งานของเจ้าของ" ไม่ใช่ช่องทางสั่งงาน qwen

## ใบงานสำหรับเครื่อง qwen ต้องจบในตัว

qwen ไม่รู้อะไรจากแชตของเจ้าของ และทำตามตัวอักษร issue ที่ส่งมาต้องมี:

- path ไฟล์ที่ต้องแตะ และไฟล์ที่ห้ามแตะ
- ค่าที่เจ้าของเคาะแล้ว (ยกมาเลย หรือชี้ข้อใน `design/<เรื่อง>/decisions.md`)
- หัวข้อที่ต้องอ่าน ห้ามสั่งให้อ่าน `GDD.md` ทั้งไฟล์ (33 KB)
- ด่านที่ต้องผ่าน และเกณฑ์ว่าเสร็จคืออะไร
- ขนาดที่ใส่ 128k ได้: ใบที่ต้องอ่าน `content/*.yaml` หลายไฟล์ให้ซอยเป็นทีละไฟล์

## เตรียมเครื่อง qwen (ทำครั้งเดียว)

1. ติดตั้ง Git · `gh` · Chrome · Claude Code · **Node 22.17.0** (ตรง `heavy-gates.yml`)
2. `gh auth login` ด้วยบัญชีที่มีสิทธิ์ repo · ตั้ง `git config --global user.name` / `user.email` เป็นบัญชีส่วนตัว
3. ตั้ง `claude-9arm`
   - สร้าง `~/.claude-9arm.json` (นอก repo เสมอ ห้าม commit token)

     ```json
     {
       "model": "<ชื่อโมเดลจาก gateway>",
       "disableClaudeAiConnectors": true,
       "autoCompactWindow": 60000,
       "effortLevel": "medium",
       "env": {
         "ANTHROPIC_BASE_URL": "https://gateway.9arm.co",
         "ANTHROPIC_AUTH_TOKEN": "<token>",
         "ANTHROPIC_DEFAULT_OPUS_MODEL": "<ชื่อโมเดลเดียวกับ model>",
         "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<ชื่อโมเดลเดียวกับ model>",
         "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "128000",
         "CLAUDE_CODE_DISABLE_ADVISOR_TOOL": "1"
       }
     }
     ```

   - bash/zsh: `alias claude-9arm='claude --settings ~/.claude-9arm.json'` ใน `.bashrc` / `.zshrc`
   - PowerShell: ใส่ใน `$PROFILE`

     ```powershell
     function claude-9arm { claude --settings "$HOME\.claude-9arm.json" @args }
     ```

   - OPUS/HAIKU ตั้งชื่อเดียวกับ `model` กันงานย่อยที่ขอโมเดลอื่นพัง
   - `effortLevel` ต้องมี ไม่ตั้ง = Claude Code ส่ง reasoning ระดับ xhigh แล้ว gateway ตอบ `400`
   - `autoCompactWindow 60000` กันคำขอบวมจนชน TPM ของ key (ดู `api-errors.md` หัว "กัน 429 / 5xx")
   - ชื่อโมเดลในคลิปกับใน skill `qwen-agent` ไม่ตรงกัน ให้เช็กกับรายชื่อของ gateway แล้วลอง `claude-9arm -p "ตอบคำว่า ok"` ต้องได้ ok
4. `~/.claude` เริ่มจากโล่ง
   - CLAUDE.md global สั้นที่สุด (ภาษาที่ตอบ + "ทำตาม CONTRIBUTING.md") เพราะทุกบรรทัดกิน 128k
   - ลง skill `qwenchance` ที่ `~/.claude/skills/qwenchance/SKILL.md` (กันวนลูปและ context เต็ม) ต้นฉบับ: https://github.com/thananon/9arm-skills/blob/main/skills/productivity/qwenchance/SKILL.md
   - ไม่ต้องลง `qwen-agent` บนเครื่องนี้ สกิลนั้นมีไว้ให้ Claude ตัวเต็มสั่ง qwen
5. clone แล้วรันบน `main` ให้ผ่านก่อนรับใบแรก ถ้าตกตรงนี้คือเครื่องยังตั้งไม่ครบ ไม่ใช่ปัญหาของใบงาน

   ```bash
   git clone https://github.com/dmo-hub/next-life.git
   cd next-life
   npm ci
   npm run setup:git
   node build.mjs
   npm run lint:test && npm run harness:test && npm run site:check && npm run check:data
   ```

   hook `.claude/hooks/contributor-guard.mjs` มากับ repo ไม่ต้องตั้งเอง
6. ลองด่านหนัก 1 รอบบน `main` จดเวลาและ RAM สูงสุด เทียบกับผล CI (`heavy-gates.yml`) ถ้าไหว เครื่องนี้รับหน้าที่รันด่านหนักแทนเครื่องเจ้าของ และแปะผล (บรรทัดที่ตก + seed) เป็น comment ใน PR
7. ใบแรกเลือกใบเล็กที่ไม่แตะตัวเลขสมดุล วิ่งครบ issue → branch → PR → รีวิว เพื่อดูว่า qwen ทำตามกติกาครบ (`git add` ทีละไฟล์ · ไม่ bump · ไม่แก้ `design/`)

## ชื่อ branch

เครื่อง qwen ใช้ lane ของตัวเอง เช่น `lane-home/<ชื่อใบ>` ไม่ชนกับ lane ของ session บนเครื่องเจ้าของ

## ทำหลายใบขนาน (หลาย session บนเครื่อง qwen)

**1 session = 1 ใบ = 1 worktree = 1 branch = 1 PR** · จบใบ (เปิด PR แล้ว) = ปิด session · ใบถัดไปเปิด session ใหม่ (context 128k ไม่พอสะสมหลายใบ)

### โฟลเดอร์

- clone หลัก (`next-life/`) อยู่บน `main` เสมอ ใช้แค่ `git fetch` / `git pull --ff-only` และแตก worktree · ห้ามแก้ไฟล์หรือ commit ที่นี่
- แต่ละใบ: worktree ข้าง clone หลัก แล้วติดตั้งแยก

  ```bash
  git -C next-life fetch origin
  git -C next-life worktree add ../nl-home-<ชื่อใบ> -b lane-home/<ชื่อใบ> origin/main
  cd ../nl-home-<ชื่อใบ>
  npm ci
  ```

- `node_modules` ต้องเป็นของ worktree นั้นเอง ห้ามทำ junction/symlink ไปที่ clone หลัก (ลบ worktree ทีหลังแล้วลบทะลุไปของ clone หลัก)
- session ทำงานเฉพาะใน worktree ของใบตัวเอง ห้ามแตะ worktree ของ session อื่น

### จองใบ กันสอง session ทำใบเดียวกัน

- **หยิบเฉพาะ issue ที่ติดป้าย `lane-home`** (`gh issue list --label lane-home --state open`) · issue ไม่มีป้าย = ของคนอื่นหรือยังไม่ได้ตัดให้เครื่องนี้ ห้ามหยิบแม้เป็นใบเดียวที่เปิดอยู่ · ไม่มีใบ = ปิด session รอ
- ก่อนเริ่ม comment ใน issue: `กำลังทำ · lane-home/<ชื่อใบ> · ฐาน <sha ของ origin/main>`
- issue ที่มี comment นี้แล้วและยังไม่มี PR = มีคนทำอยู่ ห้ามหยิบ

### ก่อนเปิดใบที่สองขึ้นไป: เทียบไฟล์

- เขียนรายการไฟล์ต้นฉบับที่ใบใหม่จะแตะ เทียบกับใบที่เปิดค้าง (`git -C <wt> diff --stat origin/main`)
- ไม่ซ้อน = ขนานได้
- ซ้อน (ไฟล์ต้นฉบับเดียวกัน) = ห้ามขนาน รอใบแรกเข้า main ก่อน หรือแตกใบหลังจาก branch ใบแรก แล้วเขียนใน PR ว่า "ต่อบน <sha>"
- ชนแค่ไฟล์ build (`docs/*.html` ที่ build สร้าง) ไม่นับ ผู้รวมงาน build ทับเอง
- `package.json` (scripts) กับ `src/node/lint/shape.mjs` โดนเติมพร้อมกันบ่อย ขนานได้ แต่ตอน rebase ต้องเก็บของทั้งสองฝั่ง

### ด่านกับ CPU/RAM

- ด่านเร็ว (`lint:test` · `harness:test` · `site:check` · `check:data` · `node build.mjs`) ขนานได้
- **ด่านหนัก (`harness/full.mjs` · `titles` · `isekai` · `keep` และด่านที่ใบสั่ง n เต็ม) รันได้ทีละ 1 ตัวทั้งเครื่อง** · ก่อนรันดูว่ามี `node harness/` ของ session อื่นรันอยู่ไหม มี = รอ · ระหว่างรอทำงานอื่นของใบได้
- รอบจูนใช้ n เล็ก (เรียก `node harness/<ด่าน>.mjs --n <เล็ก>` ตรง ๆ) · n เต็มเฉพาะรอบสุดท้ายก่อนเปิด PR
- ก่อนรันด่านหนัก `git fetch` ดูว่า main ขยับไฟล์ engine หรือยัง (`git diff --stat HEAD origin/main -- src/engine content data`) ถ้าขยับ rebase ก่อน ไม่งั้นต้องรันใหม่

### ส่งงาน

- rebase บน `origin/main` ล่าสุด → `node build.mjs` → ด่าน → `git push -u origin lane-home/<ชื่อใบ>` → เปิด PR (ปิด issue ด้วย `Closes #<เลข>`)
- เปิด PR ทีละใบเมื่อเสร็จ ไม่รอรวมชุด
- ผู้รวมงานตีกลับใน PR = เปิด session ใหม่ที่ worktree เดิม อ่าน comment ทั้งใน PR และใน issue ของใบก่อนแก้ (คำสั่งแก้มักอยู่ใน issue)

### เก็บกวาดหลัง merge

- PR ปิดแล้ว (`MERGED` หรือ `CLOSED` เพราะลงด้วย cherry-pick) เช็กว่าลงครบตามหัว "หลัง PR ปิด" ใน `SKILL.md` · `git -C <wt> status --short` ต้องว่าง แล้ว `git -C next-life worktree remove ../nl-home-<ชื่อใบ>` · ไม่ต้องลบ branch
- `git -C next-life pull --ff-only` ให้ clone หลักตาม main

## sync ไฟล์งานของเจ้าของ (repo ไฟล์งาน next-life)

ไฟล์งานของเจ้าของ (backlog · LANES · ใบงาน · log ผู้รวมงาน) อยู่ใน repo private แยกของเจ้าของ (ชื่อ/URL อยู่ใน handoff ที่เจ้าของส่งให้ ไม่อยู่ในไฟล์นี้) · บนเครื่องเจ้าของ repo นี้อยู่ที่ `D:/Project/Mini Project/next-life-owner`

- **token ของเครื่อง qwen เห็นได้แค่ repo นี้** — fine-grained PAT เลือก repo เดียว (Contents: Read and write) · ห้ามใช้ token ที่เห็น repo อื่นของเจ้าของ
- **ห้าม clone ไปที่ `D:/Project/Mini Project/next-life-owner` ของเครื่อง qwen** — `CLAUDE.md` ของ repo นี้แยกบทบาทจาก path เต็มนั้น (ไม่ใช่ชื่อโฟลเดอร์) วางตรงนั้น = qwen ทำตัวเป็นเครื่องเจ้าของ อ่าน LANES ทั้งไฟล์ · clone ไปโฟลเดอร์แยก เช่น `~/next-life-owner`
- **เครื่อง qwen เขียนได้เฉพาะ `home/`** · ไฟล์อื่นอ่านอย่างเดียว (session บนเครื่องเจ้าของแก้ LANES · backlog อยู่ตลอด แก้ซ้อน = conflict) · ไอเดียใหม่จดใน `home/inbox.md` ให้เครื่องเจ้าของย้ายเข้า backlog
- qwen ไม่อ่านโฟลเดอร์นี้เอง เปิดให้อ่านเมื่อใบงานชี้ไฟล์ในนั้นเท่านั้น (LANES ยาวมาก กิน 128k)

### รอบ sync

| เครื่อง | ดึง | ส่ง |
|---|---|---|
| qwen | `git -C ~/next-life-owner pull --rebase origin main` | commit เฉพาะ `home/` → pull --rebase → `git -C ~/next-life-owner push origin main` |
| เจ้าของ | `git -C "D:/Project/Mini Project/next-life-owner" pull --no-rebase origin main` (working tree มีงาน session อื่นค้าง · ห้าม rebase/autostash) | `git -C "D:/Project/Mini Project/next-life-owner" push origin main` |

push แล้วขึ้น rejected (non-fast-forward) = อีกเครื่อง push ก่อน ให้ pull แล้ว push ใหม่ · ห้าม force

## เซสชันเจอ API Error

อยู่ที่ `api-errors.md` อ่านเมื่อเจอ error เท่านั้น

## qwen เริ่มหลุด

- ทำซ้ำ อ่านไฟล์เดิมซ้ำ หรือลืมข้อสั่งท้าย ๆ = context เต็ม ให้ซอยใบให้เล็กลง ไม่ใช่สั่งซ้ำ
- description ของทุก skill ใน `.claude/skills/` ถูกโหลดเข้า context ทุกครั้ง ถ้ายังหลุดบ่อยให้ดูจุดนี้
