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

- 2 เครื่องไม่เห็น session ของกันและกัน (SendMessage ข้ามเครื่องไม่ได้) และไฟล์งานของเจ้าของ (backlog · LANES) มีแค่บนเครื่องเจ้าของ
- ใบงาน = issue · คำถาม ผลด่าน และข้อเสนอ = comment ใน PR หรือ issue
- ห้าม copy `~/.claude` ข้ามเครื่อง ของที่ทั้งสองเครื่องต้องใช้ให้อยู่ใน `.claude/skills/` ของ repo นี้

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

## qwen เริ่มหลุด

- ทำซ้ำ อ่านไฟล์เดิมซ้ำ หรือลืมข้อสั่งท้าย ๆ = context เต็ม ให้ซอยใบให้เล็กลง ไม่ใช่สั่งซ้ำ
- description ของทุก skill ใน `.claude/skills/` ถูกโหลดเข้า context ทุกครั้ง ถ้ายังหลุดบ่อยให้ดูจุดนี้
