# 01 · Project overview: next-life

Snapshot: v0.6.31 (2026-11-03) · repo `D:\dev\g` · remote `dmo-hub/next-life` · site https://dmo-hub.github.io/next-life/ (GitHub Pages served from `docs/`)

## What it is
- **Thai name:** "เกิดใหม่ทั้งที ชาตินี้ขอชิงมาเกิด". **English name:** Next Life. The Thai name changed on 2026-10-27; it was "ชาติหน้า" before. The English name, links and file names stayed the same.
- **Genre:**
  - The project's own docs call it "เกมจำลองชีวิตคนไทยหลายรุ่น มีแฟนตาซีคติไทย" (a multi-generational Thai life sim with Thai folk-belief fantasy).
  - It plays as a text/card-based life sim with a generational roguelite structure. Each life is narrative-driven, and the setting is historical Thailand.
- **Loop:**
  1. Birth is random, using real statistics from 2500–2569 BE.
  2. A life takes 15–20 minutes, about 100–180 cards.
  3. Death leads to ปรโลก (the afterlife), where the merit/sin ledger is revealed.
  4. The player continues as a descendant, is reborn by karma, or goes to another world (ต่างโลก).
  5. There is no ending and no nirvana.
- **Tech:**
  - One HTML file with no backend, saved in localStorage.
  - Plain JS ES modules, no bundler. build.mjs concatenates the modules.
  - The only dependency is `yaml`.
- **Who decides:** the owner makes every decision. AI proposes and drafts content; the owner selects and edits.

## Design pillars (from MAP.md + gdd.html)
1. **Real statistics where it matters.**
   - Birth: province and wealth.
   - Mortality: real yearly life tables.
   - Money: inflation, asset returns and wages by real year.
   - Real economic and disaster events are included. Politics and the monarchy are never touched.
2. **The fantasy has real game effects.**
   - Karma is strong. It affects death rates (×0.75–×2.0) and wealth in the next life.
   - สายลี้ลับ (folk-belief practices) only affect comfort and social stats. The exception is the mu-lottery.
3. **Choices show direction only (↑/↓), never numbers**, so a script can't easily play the game.
4. **The family is the long story:** wealth, fame, inheritance and karma pass to the next generation.
5. **Nothing in the game reads like real investment advice.** Every finance page carries "เกม ไม่ใช่คำแนะนำการลงทุน" (game, not investment advice).
6. **Sensitive topics:** monks and Buddha images are never made into jokes. Ghost-accusation stories (ปอบ/ผีกะ) must show the harm of accusing. Text never says a result happened "because they were born in region X".

## Main systems (detailed files in brackets)

| System | Summary | File |
|---|---|---|
| Birth + life stages | 6 life stages, 5 stats (4 shown + เส้นสาย/network hidden), natural drift, pool + milestones + echoes | 02 |
| Life focus | 30 focuses in 4 groups; 3 full years open the entry to 5 special paths | 02 |
| Careers | Education tracks, 5 career ladders, elections | 02 |
| Death | Life table × health × karma; near-death; court; funeral | 02 |
| Finance | 6 assets, real returns, real wages, 7 debt types, bankruptcy, grey money | 03 |
| Merit/sin | Hidden ledger; 8 Phra Malai sins + vow_broken + game categories; omens | 03 |
| สายลี้ลับ | 6 activities; mu-lottery capped at 5 per life | 03 |
| Afterlife + lineage | transfer → devaduta → verdict → path → scene → carry; 30–70% carried; inheritance; fame | 03 |
| Titles | 4 axes → 17 patterns; 29 titles; 7 family titles | 03 |
| Content + lint | ~447 YAML events, 86 lint rules | 04 |
| Isekai | Aethergard continent: 20 regions, 8 races, careers from focus | 04 |
| Build/harness/UI/site | See file 05 | 05 |
| Workflow + roadmap | See file 06 | 06 |

## Repo map

| Path | Contents |
|---|---|
| `src/engine/*.mjs` | 24 engine modules (pure functions over `st`) |
| `src/ui/` | app.mjs, art, shelfart, labels, template.html, fonts |
| `src/node/load.mjs` · `src/node/lint/` | Content loading + lint gates |
| `src/site/` | Builds the site pages + data-fact injection |
| `content/*.yaml` | Main-world events |
| `content/isekai/` | Isekai cards |
| `content/rules/` | flags, focus, near-hints |
| `content-fixtures/` | bad/good lint test fixtures + harness-only content (never shipped) |
| `data/*.json` | Real era data; every number needs a source or an assumption |
| `harness/` | Bots + gates for simulating lives |
| `scripts/` | fetch, check-data, lint-test, harness-test, site-check, shots, bump |
| `docs/` | Website + play.html (built). `docs/spec/` is a copy of the design map; edit it at its source, not here |

## Key documents in the repo
- `README.md`: repo layout + every command (long version).
- `docs/gdd.html`: GDD matching the current code, 22+ sections:
  - overview, pillars, loop, life, choice, career, family, money, death, merit, belief, titles, afterlife, isekai, loops, content, art, tech, scope
  - gaps (docs vs code), open (awaiting owner), plan (roadmap phases 4–20)
- `docs/spec/MAP.md`: owner decisions since the spec phase (the 14 tickets closed 2026-10-22).
- `docs/spec/tickets/01–14`: one decision ticket per topic.
- `docs/spec/lore-*.md`: research with sources (afterlife, era data, finance/belief).
- `docs/whatsnew.html`: patch notes, newest first, plus "กำลังทำ" (in progress).
- `CLAUDE.md`: working rules (see 06).
