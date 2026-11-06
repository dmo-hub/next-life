# 05 · Build, harness, UI, site

Snapshot: v0.6.31. All scripts live in `scripts/` and `harness/`.

## 1. Build (`build.mjs`, 39 lines, no bundler)

1. Call `loadContent()`. A content lint failure throws and the build stops.
2. `strip()` deletes `import …;` and `export * from` lines and removes the `export ` prefix.
3. The `files` array lists files in concat order. Order matters: everything shares one scope, so TDZ applies. The list is the engine files (rng → … → save), then ui art, shelfart, labels, app. `index.mjs` is not in the list; only Node and the harness use it.
4. **Duplicate-name guard:** every top-level `function`, `const`, `let` or `class` name must be unique across all files. A clash throws `ชื่อ X ซ้ำใน A กับ B`.
   - `APP_VERSION` and `APP_BUILD` are reserved for `src/version.json`.
   - Every top-level name in `art.mjs` must start with `ART` or `art`.
5. Output: `const CONTENT = <JSON>` (with `<` escaped), wrapped in an IIFE with `</script` escaped.
6. Five fonts are embedded as base64 woff2: Noto Sans Thai 400/600, Sarabun 400/600, Srisakdi 700.
7. `src/ui/template.html` has the placeholders `/*__FONTS__*/` and `/*__SCRIPT__*/`. The result is written to `docs/play.html`.
8. Call `buildSite(content)`.

**New engine file:** add it to `files` in dependency order, and to `src/engine/index.mjs` if Node or the harness needs it.

### Versioning
- `src/version.json` (`{"version":"v0.6.31","build":"2026-11-03"}`) is the only place the version lives. site-check 9a fails if any file in `src/` writes the version string or `APP_VERSION =`.
- `npm run bump` bumps patch (v0.6.31 → v0.6.32). `npm run bump -- minor` gives v0.7.00. It uses the local date and builds automatically afterwards. **Only the integrator bumps.**
- The only dependency is `yaml 2.8.1`. Playwright is installed outside package.json.

## 2. npm scripts (all default to seed 1)

| Command | What it does | Default n |
|---|---|---|
| `build` | `node build.mjs` | |
| `sim` / `gate` | `harness/run.mjs`: stats in 0–100, money finite, sector leak, gates 4 / 3a / 3b | 1,000 / 20,000 |
| `merit` | Merit and sin bots end with clearly separate ledgers; `vow_broken` can be set; no ledger values on cards; control `--no-karma` | 20,000 |
| `finance` | Net worth at death ordered by birth class and by region; control switches off birthplace effects | 50,000 (~3 min) |
| `lineage` | 3 personalities × 3 generations: phase 7 has 6–10 cards; ledger revealed once; carry 30–70%; debt not inherited; every scene reachable | 2,000 families |
| `isekai` | Determinism including mid-run save/load; ending within card cap; no merit leak; return/stay flow | 4,000 |
| `titles` | Every pattern, title and family title ≥ 0.1%; prints the axis medians | 2,000 × 3 gens |
| `belief` | Gate 6 (mu-lottery small prize ×4 at full merit, heavy sin = base, big prizes unchanged); gate 7 (belief doesn't shift average age) | 20,000 |
| `omen-ctl` | Patterns and titles with vs without omen cards | 2,000 |
| `save` | snapshot → restore → continue equals a straight run | 120 |
| `stats` | `successPct` changes smoothly | 2,000 |
| `family` | Number of children; family deaths follow the life table; flags match family members | 5,000 |
| `causes` | Every death has a cause; cause mix by age band near the data | 20,000 |
| `near` | At most one near-death per life; `cheat_death` | 20,000 |
| `pact` | Mara pact | 2,000 |
| `grey` | Grey money stays in its own bag | 500 |
| `density` | Share of cards with ≥2 open choices | 2,000 |
| `repeat` | Repeat cards p95; echo hit rate | 2,000 |
| `passive` | Passive bot must not beat random | 2,000 |
| `botdiff` | Personality bots choose differently from the random bot | 200 |
| `continent` | Map symmetry, powers, disputes, births, dungeons | 10,000 |
| `continuity` | `next` and echoes reach players (`--min-next 80 --min-echo 28`) | 4,000 |
| `lifehash` | Refactor proof: every life byte-identical (`-- --base <sha> [--world life\|isekai\|chain] [--quick]`) | |
| `keep` | Updates don't wipe player collections or saves | |
| `full` | Full harness, ~10 min on 12 cores | 20,000/bot |
| `full:release` | 100,000/bot; zero dead items allowed | |
| `lint:test` | Every fixture and lint rule | |
| `harness:test` | Tests the harness itself, ~5 s | |
| `check:data` | Every number in `data/` has a `source` or an `assumption` | |
| `site:check` | Checks all site pages | |
| `shots` | Playwright: no overflow at 390 / 1280, 0 console errors on the site pages | |
| `fetch:data` / `fetch:finance` | Re-download data (needs internet) | |

## 3. Harness core

### `harness/gates.mjs`

| Gate | Checks | Threshold |
|---|---|---|
| 4 | Lives that die after 60 have 100–180 cards (`CARD_MIN/MAX`) | ≥ `CARD_SHARE 0.9` of them |
| 3a | Life table the game uses vs real e0 / IMR, per year (no randomness) | `E0_TOL .05`, `IMR_TOL .5/1000` |
| 3b | Random bot's mean age per birth decade × sex vs the age the data predicts along that life path | `AGE_TOL 3` years; groups under `MIN_LIVES 500` not judged |

- **Dead choices:** `MIN_EXPECTED_PICKS 10`. A choice is judged dead only when random-bot encounters ÷ number of choices ≥ 10. Below that it prints ⚠ and does not fail.
- `heirChain()` finds items that only an heir can reach (proven in lineage).
- `blame()` names suspect event ids (`MIN_SIDE 30`).
- **`compareBaseline` fails when** any of these happen:
  - a new dead event, choice or flag
  - `statBad` rises
  - `gate4Share` drops more than `SLACK .005`
  - `gate3bWorst` rises more than `1.96 × √(SE²prev + SE²now)`
- Also: `stuckCard`, `oneOpen` (exempt: funeral_rite_01 / funeral_wishes_01), `unfilledIn`.

### `harness/bots.mjs`: 6 personalities
**Rule: bots read only the labels the player sees (`card.fx`) and press only open choices.**

| Bot | How it chooses |
|---|---|
| สุ่ม | Uniform random |
| สายบุญ / สายบาป | Score merit tags (`MERIT_WEIGHTS × LEVELS`). This is the one allowed exception. They still never read the ledger |
| สายเงิน | Weights money 2, income 3, grey 1, plus risk tags. On allocation cards: stocks > land > gold > equal split |
| สายครอบครัว | relations 3, happiness 1 |
| สายสุขภาพ | health 3, happiness 1 |

- `readFx` splits labels on ` · ` into `"<label> ↑/↓"` pairs. `ระยะยาว` doubles the weight.
- Helper bots: `isekaiBot` accepts the call to another world (the main bots refuse it without drawing rng). `passive` picks the smallest change.
- `botFocus`: 1/3 of lives go with the flow. The rest pick the focus that raises their main stat.

### `harness/full.mjs` (`npm run full`)
- 6 bots × [seed 1, random seed2] × n, split across workers (`sweep-worker.mjs`).
- Side processes: merit, lineage, finance, titles, belief. `--solo` skips them.
- **Gate 2:** no event, choice or flag that nobody can reach.
  - Exemptions, each proven elsewhere: heir-only (lineage), court-only (near), focus-gated (forced-focus check), `isekai_call`.
  - Env: `FULL_HEIR_CHAIN=off`, `FULL_FOCUS_DROP=<id>`.
  - During a train, only items that newly go dead fail. With `--release` or no baseline, any dead item fails.
- Gates 3b and 4 are judged on the random bot for both seeds.
- **Reports (don't fail):**
  - thin content cells (stage × category with fewer than 3 cards)
  - fantasy/mu cards per life, target 5–8
  - mu-lottery above 2.5 tickets per life is flagged "ยกให้เจ้าของเคาะ"
- `-- --save` writes `harness/baseline.json` only when nothing failed. `--force` overrides.
- Rerun with the same seed2: `npm run full -- --seed2 N`.

Current baseline (2026-10-29, n 20000): dead [] · statBad 0 · gate4Share .9317 · gate3bWorst 1.653 (SE .688). Mean death age by bot:

| Bot | Mean age |
|---|---|
| สุ่ม | 72.09 |
| สายบุญ | 76.54 |
| สายบาป | 57.55 |
| สายเงิน | 60.57 |
| สายครอบครัว | 71.15 |
| สายสุขภาพ | 81.74 |

### `lifehash` (refactor proof)
- Hashes every card, bot return, age, card count and death state.
- Compares `git archive <sha>` (unpacked under `.cache/`) with the working tree, including uncommitted changes.
- Default n: life 300, isekai 300, chain 50. `--quick` runs n/3.
- Control: changing the pick at decision 10 must change ≥ 90% of lives, otherwise exit 2.
- Lanes paste the result into their "พร้อมตรวจ" message.

### `keep` (collection and save protection)
- (ก) ids referenced by saved collections still exist (titles, patterns, family titles, picture slots, era events, cards).
- (ข) localStorage key names have not disappeared.
- (ค) 16 save snapshots from the base version (`harness/fixtures/keep-snaps.json`) load through restore → repairLife and play to the end with 0 crashes.
- `--save` is **integrator-only** after a bump. The files are `harness/keep-ids.json` and `harness/fixtures/keep-snaps.json`.

### `scripts/harness-test.mjs`
Tests the harness itself:
- `blame` on hand-built cases
- gate 4 passes at 95% and fails at 85%
- 3b tolerance
- `compareBaseline`
- `readFx`
- bots are deterministic and press only open choices
- kin rules, focus gates, isekai careers, region moves

**Run it after editing `gates.mjs` or `bots.mjs`.**

## 4. UI (`src/ui/`)

### `app.mjs` (~3,025 lines)
- **Boot (`boot()`):**
  1. `?seed=` (link seed)
  2. snapshot save
  3. legacy save, or `staleSave` ("เกมอัปเดตแล้ว")
  4. `home(card)`
  5. If there is no save, `start()`.
  - Also: `startDay()` (ชาติประจำวัน, daily life), `reroll()`, `confirmNew()`.
- **Rendering:** `render(card)` draws the life card. `renderIsekai` and `renderAfter` draw the other worlds.
- **Move tokens** (`T`, replayed by `step()`):

| Token | Meaning |
|---|---|
| `.` | next |
| `>` | afterlife |
| `,` | afterNext |
| `+` | rebirth |
| `0-9a-z` | choose (life) |
| `A-Z` | choose (afterlife) |
| `~` | loan |

- **Menus:**
  - `LIFE_MENU`: ตัวฉัน / ครอบครัว / เงิน / สมุด / เพิ่มเติม
  - `ISEKAI_MENU`: ตัวฉัน / สกิล / ความเร็ว / สมุด / เพิ่มเติม
  - Mobile uses a bottom bar (`.mnav`) and `openSheet()`. Desktop and landscape use a left rail with a drawer from the right.
  - Shelf tabs: อนุสรณ์ / ฉายา / ภาพบ้านเมือง.
- **Keyboard:**
  - `Esc` closes a panel.
  - `Enter` presses `[data-enter]`.
  - `1-9` press `[data-key=N]`.
  - Hidden and inert buttons are skipped. Key repeat and IME composition are ignored.
- **Styles:**

| World | Class | Look |
|---|---|---|
| Life | `card a` | ทะเบียนราษฎร์ (paper) |
| Death | `a mem` | Funeral book (Srisakdi) |
| Afterlife | `card b af` | Black lacquer and gold |
| Isekai | `card i` | Navy `#161A3A` |

  - MAP.md still mentions a light / old-paper theme button. The code now has one style per world, so MAP is stale on this point.
- **Death card:** a short certificate plus one button, then tabs (`DEATH_TABS`): สรุป / ชีวิตนี้ / ครอบครัว / ตระกูล / ฉายา / อนุสรณ์ (ARIA tablist).
- **Share:**
  - `shareBlob` draws a 1080×1920 canvas (Srisakdi / Sarabun) and wraps Thai text by cluster.
  - `shareButtons` renders the image ahead of time, because Safari only allows share right after a tap.
    - Uses `navigator.share({files})`. If that fails, it opens the image or downloads it.
    - The save button is always there (`next-life-age-N.png`).
  - `SHARE_URL` = dmo-hub.github.io/next-life.
- **Rule:** never write a button label inline in app.mjs. Use `BTN.*` from `labels.mjs`; site-check #8 greps for this.

### Other UI files
- **`labels.mjs`** must not touch `document` or `window`, because `guide.mjs` also uses it. It holds `BTN`, the `HELP` hotlines (1323, 1413, 1441, 1111 กด 79), `SHOWN_STATS`, `STAT_HELP` (direction only, no numbers) and the icons.
- **`art.mjs` / `shelfart.mjs`:** path data shared by SVG and canvas Path2D.
- **Fonts** (`src/ui/fonts/README.md`): subset with `pyftsubset` to the Thai block, ASCII and the game's symbols. **Using a new symbol in content means re-subsetting the fonts.** play.html must not use Google Fonts (site-check 9b).

## 5. Site (`src/site/`)

### Pages

| Kind | Pages |
|---|---|
| Generated (don't edit) | `docs/play.html`, `catalog.html` (template `src/site/catalog.html`), `spoilers.html`, `guide.html` |
| Hand-written + `data-fact` injection | `index`, `about`, `otherworld`, `gdd` |
| Hand-written, static | `whatsnew.html` (integrator only), `cards.html` (prototype v2), `archive/`, `img/*.webp` |

- In `gdd.html`, never edit by hand between `<!--SPEC:START-->` and `<!--SPEC:END-->`. That part is generated from `docs/spec/**/*.md`.

### Modules
- **`facts.mjs` `siteFacts()`:** computes ~50 values from content and engine constants. `injectFacts` replaces `<tag data-fact="k">`. **An unknown key throws and stops the build.** No per-life ledger values.
- **`catalog.mjs`:** shows only what the player sees. No outcomes, weights or merit.
- **`spoilers.mjs`:** shows everything, including merit. The owner allowed this exception for the spoiler page only.
- **`demo.mjs`:** one demo card, `DEMO={seed:4, id:'biz_grocery_01'}`, between `<!--demo-->` markers.
- **`guide.mjs`:** every `BTN` must have a `BTN_HELP` entry.

### `site:check` sections
1. Every `data-fact` equals the computed value.
2. Control: dropping a card or title must change the numbers.
3. No dead links or anchors.
4. Catalog has every card and leaks no weights or merit.
5. Spoilers counts match content.
6. Isekai sections are complete; catalog doesn't reveal results; continent birth odds within ±1 point.
7. Spec appendix complete.
8. Guide has every BTN; no literal labels in app.mjs.
9. Version link and h3.
   - 9a. Version lives only in version.json.
   - 9b. All 5 fonts embedded; no Google Fonts.
10. Demo works.
11. Spoilers covers every `when` / `multipliers` / `requires` key.

### `shots`
- Needs `playwright-core` + Chromium installed globally, or env `PW_CORE` / `PW_EXE`. Exits 2 if missing.
- Freezes `Math.random` and `Date`, opens the site pages at widths 390 and 1280, and fails on overflow or a console error.
- Despite the name, it no longer takes screenshots.
- **It does not test play.html.** Checking the game page stays manual: open it and confirm 0 console errors.
