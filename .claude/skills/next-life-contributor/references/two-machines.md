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
       "env": {
         "ANTHROPIC_BASE_URL": "https://gateway.9arm.co",
         "ANTHROPIC_AUTH_TOKEN": "<token>"
       }
     }
     ```

   - bash/zsh: `alias claude-9arm='claude --settings ~/.claude-9arm.json'` ใน `.bashrc` / `.zshrc`
   - PowerShell: ใส่ใน `$PROFILE`

     ```powershell
     function claude-9arm { claude --settings "$HOME\.claude-9arm.json" @args }
     ```

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
- ผู้รวมงานตีกลับใน PR = เปิด session ใหม่ที่ worktree เดิม อ่าน comment ใน PR ก่อนแก้

### เก็บกวาดหลัง merge

- PR merge แล้ว: เช็ก `git -C <wt> status --short` ว่างก่อน แล้ว `git -C next-life worktree remove ../nl-home-<ชื่อใบ>` · ไม่ต้องลบ branch
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

### แยกก่อนว่า error มาจากไหน

| เซสชันเปิดด้วย | error มาจาก | ทำอะไรได้ |
|---|---|---|
| `claude` | Anthropic API | รอ · ดู status.claude.com · แก้ฝั่งเราไม่ได้ |
| `claude-9arm` | gateway 9arm (LiteLLM) | เช็คด้วย `claude-9arm-check` แล้วแก้ตามตารางล่าง |

### `claude-9arm-check` (ยิง gateway ตรง ไม่ผ่าน Claude Code · ไม่พิมพ์ token)

วางที่ `~/.local/bin/claude-9arm-check` (ต้องอยู่ใน PATH) · อ่านค่าจาก `~/.claude-9arm/settings.json` · ถ้าเครื่องเก็บ config ไว้ที่อื่น แก้บรรทัด `CFG`

```bash
#!/usr/bin/env bash
set -u
CFG="$HOME/.claude-9arm/settings.json"
field() { python -I -c "import json,sys;s=json.load(open(sys.argv[1],encoding='utf-8'));e=s['env'];v={'base':e['ANTHROPIC_BASE_URL'].rstrip('/'),'token':e['ANTHROPIC_AUTH_TOKEN'],'model':s['model']}[sys.argv[2]];sys.stdout.write(v)" "$CFG" "$1"; }
BASE=$(field base); TOKEN=$(field token); MODEL=$(field model)
OUT=$(mktemp); HDR=$(mktemp)
CODE=$(curl -s -o "$OUT" -D "$HDR" -w '%{http_code} %{time_total}s' --max-time 120 \
  -H "Authorization: Bearer $TOKEN" -H "content-type: application/json" -H "anthropic-version: 2023-06-01" \
  -d "{\"model\":\"$MODEL\",\"max_tokens\":8,\"messages\":[{\"role\":\"user\",\"content\":\"reply ok\"}]}" \
  "$BASE/v1/messages")
echo "model=$MODEL status=$CODE"
tr -d '\r' < "$HDR" | awk -F': ' 'tolower($1)=="x-litellm-key-spend"{s=$2} tolower($1)=="x-litellm-key-max-budget"{b=$2} tolower($1)=="x-litellm-key-tpm-limit"{t=$2} END{if(b!="") printf "budget: spent $%.2f of $%s (%.0f%%) · tpm-limit=%s\n", s, b, 100*s/b, t}'
head -c 300 "$OUT"; echo
rm -f "$OUT" "$HDR"
```

บรรทัด `budget:` อ่านจาก header ของ gateway (`x-litellm-key-*`) · งบหมด = ทุก session ที่ใช้ key นี้พังพร้อมกัน

- ใช้ `sys.stdout.write` ไม่ใช่ `print` เพราะ python บน Windows ต่อท้ายด้วย `\r` แล้ว gateway ตอบ `400 Invalid JSON payload: unexpected control character`
- ตั้งเสร็จลองครั้งแรกต้องได้ `200` · ลองเปลี่ยน token เป็นค่ามั่วชั่วคราวต้องได้ `401` (ไม่ได้ = ตัวเช็คใช้ไม่ได้) แล้วคืนค่าจริง

### อ่านผล

| ผล | สาเหตุ | แก้ |
|---|---|---|
| `401 token_not_found` | token ผิด · หมดอายุ · ถูก revoke | ขอ token ใหม่จาก 9arm ใส่ใน settings |
| `400` เรื่อง effort / reasoning | ไม่ได้ตั้ง `effortLevel` → ใช้ xhigh แล้วโดนปฏิเสธ | ตั้ง `"effortLevel": "medium"` · เช็คว่าเซสชันไม่ได้สั่ง `/effort` ทับ |
| `400` / `404` เรื่อง model | gateway เปลี่ยนชื่อโมเดล | ถาม 9arm ชื่อใหม่ แก้ทุกจุดใน settings (`model` + `ANTHROPIC_DEFAULT_*_MODEL`) |
| `429` | ยิงเกินโควตาหรือถี่เกิน | รอ · ลดจำนวน session qwen ที่รันพร้อมกัน |
| `5xx` · `524` · timeout | gateway ล่มหรือคิวยาว (`524` = คำขอเกิน 100 วิ) | รอ 5–10 นาทีแล้วเช็คใหม่ · ห้าม retry รัว |
| `200` แต่เซสชันยังพัง | gateway ปกติ ปัญหาอยู่ที่เซสชัน | มักเป็น context เต็มหรือคำขอยาว → ซอยใบให้เล็กลง |

`200` ที่ใช้เวลาหลายสิบวินาทีสำหรับคำตอบ 8 token = คิว gateway ยาว · งานยาวเสี่ยง `524` ช่วงนั้น

### กัน 429 / 5xx

เพดานของ key อ่านจาก header: **TPM 1,000,000 token/นาที** (ไม่มี rpm limit) + **งบรวม** (`x-litellm-key-max-budget`) · ทุก session ที่ใช้ token เดียวกันแบ่งโควตาเดียว

ทำไม 429 เกิด: แต่ละคำขอส่ง context ทั้งก้อน (system prompt + CLAUDE.md + ประวัติแชต) · session ละ ~60k × หลายคำขอ/นาที × หลาย session = ชน 1M ง่าย · session ที่โหลด `~/.claude/CLAUDE.md` ของเครื่องเจ้าของ (หลายร้อย KB) ชนเร็วกว่ามาก

| เรื่อง | กติกา |
|---|---|
| จำนวน session | qwen พร้อมกัน **ไม่เกิน 2** · ด่านหนักยังทีละ 1 ตามหัว "ด่านกับ CPU/RAM" |
| config | qwen ใช้ config dir แยก (`CLAUDE_CONFIG_DIR=~/.claude-9arm`) เท่านั้น · ห้ามใส่ env ของ gateway ใน `~/.claude/settings.json` — ทุก session ใน `~/.claude` จะกลายเป็น qwen ที่โหลด CLAUDE.md ตัวใหญ่ |
| ขนาด context | `autoCompactWindow 60000` · session ที่บวม (log หลาย MB) ห้ามใช้ต่อ เปิดใหม่ด้วย handoff |
| ปลุก session | ห้าม SendMessage หาหลาย session พร้อมกัน — ทุกตัวยิง gateway ทันที |
| ก่อนเปิด session ใหม่ | `claude-9arm-check` · ตอบช้าเกิน 20 วิ = คิวยาว รอ |
| retry | `"CLAUDE_CODE_MAX_RETRIES": "15"` ใน `env` · ช่วยผ่าน 503/429 ช่วงสั้น ไม่ช่วยตอนล่มนาน |
| 5xx | ฝั่งเราแก้ไม่ได้ · ล่มนาน = รอ หรือให้เครื่องเจ้าของทำแทน |

**hook เตือนตอนเปิด session ที่ 3** — วาง `~/.claude-9arm/hooks/concurrency.py` แล้วผูกใน `~/.claude-9arm/settings.json` · นับ transcript ใน `~/.claude-9arm/projects` ที่เขียนภายใน 5 นาที (ไม่นับตัวเอง) · เตือนอย่างเดียว ไม่บล็อก

```python
import glob, json, os, sys, time

ACTIVE_WINDOW_SEC = 300
MAX_OTHERS = 1

try:
    sid = json.load(sys.stdin).get("session_id", "")
except Exception:
    sid = ""

root = os.path.join(os.path.expanduser("~"), ".claude-9arm", "projects")
now = time.time()
others = [
    f for f in glob.glob(os.path.join(root, "*", "*.jsonl"))
    if now - os.path.getmtime(f) < ACTIVE_WINDOW_SEC and sid not in os.path.basename(f)
]

if len(others) > MAX_OTHERS:
    msg = (f"qwen: {len(others)} other sessions active on the same 9arm key (TPM 1M/min). "
           f"Running more than {MAX_OTHERS + 1} at once risks 429 - close idle ones first.")
    print(json.dumps({"systemMessage": msg}))
```

```json
"hooks": {
  "SessionStart": [
    { "hooks": [ { "type": "command", "command": "python -I <HOME>/.claude-9arm/hooks/concurrency.py" } ] }
  ]
}
```

- ข้อความเป็น ASCII เพราะ stdout ของ python บน Windows เป็น cp1252 · ข้อความไทยทำ hook ล้ม
- ตั้งเสร็จทดสอบ: ป้อน `{"session_id":"zzz"}` ตอนมี session อื่นรัน ≥2 ต้องได้ `systemMessage` · แก้ `ACTIVE_WINDOW_SEC` เป็น 1 ต้องเงียบ

**ใช้ qwen ในแผง Claude ของ VS Code** — `claudeCode.environmentVariables` เป็น scope `machine` ตั้งรายโฟลเดอร์ไม่ได้ (ตั้งใน VS Code หลัก = ทุกแผงเป็น qwen) · เปิด VS Code อีกอินสแตนซ์ที่ user settings แยก:

- `code --user-data-dir "<HOME>/.vscode-qwen" <repo>` (extension ใช้ชุดเดิม)
- `<HOME>/.vscode-qwen/User/settings.json`: `"claudeCode.environmentVariables": [{ "name": "CLAUDE_CONFIG_DIR", "value": "<HOME>/.claude-9arm" }]` + สี title bar ต่างจากหน้าต่างหลัก กันสับสน
- ยืนยันว่าเป็น qwen จริง: transcript ต้องไปขึ้น `~/.claude-9arm/projects` และ `message.model` ของคำตอบเป็นโมเดล qwen ไม่ใช่ `claude-*`

### กู้งาน

**Claude ส่งงานย่อยผ่าน `claude-9arm -p` แล้วพัง**

1. `claude-9arm-check`
2. ได้ `200` → retry ได้ 1 ครั้งด้วย prompt ที่เล็กลง (ทีละไฟล์)
3. พังซ้ำหรือได้ `5xx` → Claude ทำงานนั้นเอง ห้าม retry ครั้งที่ 3
4. ดู `git diff` ก่อนทำต่อเสมอ qwen อาจแก้ไฟล์ไปครึ่งทาง

**session qwen ที่ทำทั้งใบพัง**

1. ดู state จาก git ตามหัว "เซสชัน AI พังกลางใบงาน" ใน `SKILL.md`
2. `claude-9arm-check` · ไม่ได้ `200` = รอ อย่าเปิด session ใหม่ซ้ำ (เจอ error เดิม)
3. ได้ `200` → เปิด `claude-9arm` ใหม่ใน worktree เดิม ส่ง handoff ตามแม่แบบใน `SKILL.md`
4. ด่านที่ session เก่าบอกว่าผ่าน ต้องรันใหม่ทั้งหมด
5. เลิกทำใบนั้น → comment ปลดการจองใน issue ทันที (`ปลดจอง · <เหตุผล>`) ไม่งั้นไม่มี session ไหนหยิบต่อได้

**gateway ล่มนาน** qwen กู้เองไม่ได้ · ใบด่วนให้เครื่องเจ้าของทำแทน · ใบไม่ด่วนปลดจองแล้วรอ

## qwen เริ่มหลุด

- ทำซ้ำ อ่านไฟล์เดิมซ้ำ หรือลืมข้อสั่งท้าย ๆ = context เต็ม ให้ซอยใบให้เล็กลง ไม่ใช่สั่งซ้ำ
- description ของทุก skill ใน `.claude/skills/` ถูกโหลดเข้า context ทุกครั้ง ถ้ายังหลุดบ่อยให้ดูจุดนี้
