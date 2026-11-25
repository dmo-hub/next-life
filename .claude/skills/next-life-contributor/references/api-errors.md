# เซสชันเจอ API Error

อ่านเมื่อเซสชันเจอ API error เท่านั้น ส่วนอื่นของเครื่อง qwen อยู่ที่ `two-machines.md`


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
ALIVE=$(curl -s -o /dev/null -w '%{http_code} %{time_total}s' --max-time 20 -H "Authorization: Bearer $TOKEN" "$BASE/v1/models")
echo "models=$ALIVE"
case "$ALIVE" in 200*) ;; *) exit 1 ;; esac
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

สองจังหวะ: `GET /v1/models` (~0.15 วิ · ไม่เข้าคิว GPU · ไม่กิน slot) ไม่ได้ `200` = gateway ล่มหรือ token เสีย หยุดตรงนั้น · ผ่านแล้วค่อยยิง `/v1/messages` จริงซึ่งเข้าคิว GPU (ช่วงคนเยอะ 5–20 วิ) และกิน 1 slot ระหว่างรอ — ใช้ก่อนเปิด session ใหม่หรือเริ่ม batch เท่านั้น ห้ามยิงก่อนทุกงาน

บรรทัด `budget:` อ่านจาก header ของ gateway (`x-litellm-key-*`) · งบหมด = ทุก session ที่ใช้ key นี้พังพร้อมกัน · key นี้ไม่ส่ง `x-ratelimit-*` (ลองทั้ง `Authorization: Bearer` และ `x-api-key` แล้ว) อย่าเขียนเกณฑ์จาก header ชุดนั้นจนกว่าจะเห็นจริงใน output

- ใช้ `sys.stdout.write` ไม่ใช่ `print` เพราะ python บน Windows ต่อท้ายด้วย `\r` แล้ว gateway ตอบ `400 Invalid JSON payload: unexpected control character`
- ตั้งเสร็จลองครั้งแรกต้องได้ `200` · ลองเปลี่ยน token เป็นค่ามั่วชั่วคราวต้องได้ `401` (ไม่ได้ = ตัวเช็คใช้ไม่ได้) แล้วคืนค่าจริง

### อ่านผล

| ผล | สาเหตุ | แก้ |
|---|---|---|
| `models=401` | token ผิด | เหมือนแถว `401` ล่าง |
| `models=000` · `5xx` | gateway ล่ม / เน็ตเราหลุด | รอ 5–10 นาที |
| `models=200` แต่ `/v1/messages` ได้ `503` หรือช้า | gateway ปกติ คิว GPU เต็ม | รอแล้วเช็คใหม่ · ไม่ใช่ปัญหา config |
| `401 token_not_found` | token ผิด · หมดอายุ · ถูก revoke | ขอ token ใหม่จาก 9arm ใส่ใน settings |
| `400` เรื่อง effort / reasoning | ไม่ได้ตั้ง `effortLevel` → ใช้ xhigh แล้วโดนปฏิเสธ | ตั้ง `"effortLevel": "medium"` · เช็คว่าเซสชันไม่ได้สั่ง `/effort` ทับ |
| `400` / `404` เรื่อง model | gateway เปลี่ยนชื่อโมเดล | ถาม 9arm ชื่อใหม่ แก้ทุกจุดใน settings (`model` + `ANTHROPIC_DEFAULT_*_MODEL`) |
| `429` | ยิงเกินโควตาหรือถี่เกิน | รอ · ลดจำนวน session qwen ที่รันพร้อมกัน |
| `5xx` · `524` · timeout | gateway ล่มหรือคิวยาว (`524` = Cloudflare `origin_response_timeout` · ราว 100–120 วิ ตามที่เห็น ยังไม่ได้ตรวจค่าจริงของ proxy · body บอก `retry_after 120`) | รอ 5–10 นาทีแล้วเช็คใหม่ · ห้าม retry รัว |
| `200` แต่เซสชันยังพัง | gateway ปกติ ปัญหาอยู่ที่เซสชัน | มักเป็น context เต็มหรือคำขอยาว → ซอยใบให้เล็กลง |

`200` ที่ใช้เวลาหลายสิบวินาทีสำหรับคำตอบ 8 token = คิว gateway ยาว · งานยาวเสี่ยง `524` ช่วงนั้น

### กัน 429 / 5xx

เพดานของ key อ่านจาก header: **TPM 1,000,000 token/นาที** (ไม่มี rpm limit) + **งบรวม** (`x-litellm-key-max-budget`) · ทุก session ที่ใช้ token เดียวกันแบ่งโควตาเดียว · ฝั่ง 9arm แจ้งว่า key จำกัด **คำขอพร้อมกัน 3** ด้วย (header ไม่บอก ยืนยันเองไม่ได้) — เกิน = `429` แม้ TPM ยังเหลือ

ทำไม 429 เกิด: แต่ละคำขอส่ง context ทั้งก้อน (system prompt + CLAUDE.md + ประวัติแชต) · session ละ ~60k × หลายคำขอ/นาที × หลาย session = ชน 1M ง่าย · session ที่โหลด `~/.claude/CLAUDE.md` ของเครื่องเจ้าของ (หลายร้อย KB) ชนเร็วกว่ามาก

| เรื่อง | กติกา |
|---|---|
| จำนวน session | qwen พร้อมกัน **ไม่เกิน 2** — เหลือ 1 slot จาก 3 ไว้ให้งานย่อย `claude-9arm -p` / ตัวเช็ค · ด่านหนักยังทีละ 1 ตามหัว "ด่านกับ CPU/RAM" |
| config | qwen ใช้ config dir แยก (`CLAUDE_CONFIG_DIR=~/.claude-9arm`) เท่านั้น · ห้ามใส่ env ของ gateway ใน `~/.claude/settings.json` — ทุก session ใน `~/.claude` จะกลายเป็น qwen ที่โหลด CLAUDE.md ตัวใหญ่ |
| ขนาด context | `autoCompactWindow 60000` · session ที่บวม (log หลาย MB) ห้ามใช้ต่อ เปิดใหม่ด้วย handoff |
| ปลุก session | ห้าม SendMessage หาหลาย session พร้อมกัน — ทุกตัวยิง gateway ทันที |
| ก่อนเปิด session ใหม่ | `claude-9arm-check` · ตอบช้าเกิน 20 วิ = คิวยาว รอ · แค่อยากรู้ว่า gateway เปิดไหม = `GET /v1/models` พอ |
| retry | `"CLAUDE_CODE_MAX_RETRIES": "15"` ใน `env` · ช่วยผ่าน 503/429 ช่วงสั้น ไม่ช่วยตอนล่มนาน |
| 5xx | ฝั่งเราแก้ไม่ได้ · ล่มนาน = รอ หรือให้เครื่องเจ้าของทำแทน |

#### รอบอัตโนมัติ (`claude -p` ที่ Task Scheduler เรียกเป็นรอบ · ไม่มีคนเฝ้า)

ตารางข้างบนเขียนให้ session ที่มีคนนั่งดู · รอบอัตโนมัติไม่มีใครเห็น error ตอนเกิด

| อาการใน log ของสคริปต์รอบ (`rounds.log`) | ความหมาย |
|---|---|
| `FAILED (exit 1)` + `API Error: 524` | รอบนั้นค้างรอ gateway จนหมดเวลา · เคยเห็นค้าง ~25 นาทีก่อนจบ (ยังไม่รู้ว่าทำไมนานกว่า timeout ต่อคำขอ) |
| `SKIP: gateway status 503` | สคริปต์เช็ค gateway ก่อนเริ่มแล้วข้ามรอบ · ทำงานตามที่ออกแบบ |
| `START` ไม่มีบรรทัดจบ | รอบหายเงียบ · ยังไม่รู้ว่าเกี่ยวกับ gateway หรือไม่ |

- ดูผลจาก log ของสคริปต์รอบเท่านั้น · Task Scheduler ขึ้น `Ready` + ผล `0` แม้รอบนั้น `FAILED`
- `FAILED`/`SKIP 503` รอบเดียวแล้วรอบถัดไปผ่าน = ไม่ต้องทำอะไร รอบหน้าลองเอง
- ล้มติดกัน 2 รอบ = เรียกคน
- เพดานเวลาต่อ `claude -p` และการแจ้งเตือนเมื่อล้มซ้ำเป็นงานของสคริปต์รอบ ไม่ใช่ของเอกสารนี้

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
