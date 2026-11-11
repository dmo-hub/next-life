# 04 · Content pipeline, YAML schema, lint, isekai

Snapshot: v0.6.31. Line numbers drift; grep the symbol name before quoting a line.

## 1. Loading (`src/node/load.mjs`)

### `loadContent()`
- Returns `{events, era, heir, nearHints, focus, isekai}`.
- `build.mjs` embeds the result as `const CONTENT = …` in play.html.
- The harness calls the same function, so the game and the harness share one data source.

### `loadEvents(dir='content/')`
- Reads only the top-level `*.yaml` files, sorted. Subfolders are skipped: `content/isekai/` and `content/rules/` are loaded by their own loaders.
- Steps:
  1. Runs `checkMeritTable`.
  2. Runs `lintDocs`.
  3. If any check fails, it throws `เนื้อหาไม่ผ่านด่าน N ข้อ` plus the problem lines, and the build stops.
  4. Flattens `events.map(normalize)`.

### `normalize`
- `label` becomes `text`.
- `cost:{unit,amount}` becomes `effects.money` with the amount negated.
- `at_age` becomes `age`.

### `loadEra()`
Builds the era object from `data/*.json`:
- births/CBR
- the CPI series (years must be consecutive)
- finance, debt, careers, system-starts
- mortality (Brass logit per sex)
- habits, death causes, era-events
- names (`checkNames`: a name must fit the `{ชื่อ}` slot of 20 chars)
- birthplace
- `SOURCE_HOSTS`

### Other loaders

| Loader | What it loads or checks |
|---|---|
| `loadHeir` | `heir:` in flags.yaml |
| `loadNearHints` | Every level (dark2, dark1, even, bright1, bright2) needs at least 2 strings of ≤240 chars, with no "บุญ/บาป + digit" |
| `loadFocus` | Runs `checkFocus` |
| `loadIsekaiCards` | Runs `lintIsekai`, then `useIsekaiCards` pushes the cards into `ISEKAI_EVENTS` |

## 2. Event YAML schema (`src/node/lint/shape.mjs`, `vocab.mjs`)

A file must be exactly `{events: [...]}`. Any other top-level key fails `doc-shape`.

### Event fields

| Field | Rule |
|---|---|
| `id` | **Required.** `^[a-z][a-z0-9_]*$`, unique across all files |
| `type` | **Required.** `A` (ทะเบียนราษฎร์, real life) or `B` (ลายรดน้ำ, belief/fantasy/afterlife) |
| `stage` | **Required.** เด็ก / วัยรุ่น / หนุ่มสาว / ทำงาน / กลางคน / ชรา / ระหว่างชาติ |
| `years` | **Required.** `[from,to]` in พ.ศ., integers 2400–2700 |
| `text` | **Required** |
| `choices` | **Required.** `[]` means a narrative card |
| `category` | study / work_money / family / health / belief / society |
| `title` | Optional |
| `at_age` | Milestone age; must fall inside the stage |
| `when` | Spawn conditions (below) |
| `weight` | > 0 |
| `multipliers` | Weight multipliers (below) |
| `hidden` | Subset of the stats plus `money` |
| `lore_ref` | `"<file in docs/spec>#<heading>"` |
| `fact` | `true` |
| `systems` | ids from system-starts |
| `belief` | Belief block |
| `era` | Era-event id |
| `repeat` | `{gap 1–100, max 2–20}`; deck cards only |
| `scene`, `realm` | Afterlife cards only |
| `prelude` | `{before: exam, chance}` |
| `near` | Near-death court cards only |
| `first_of` | Ladder id |
| `herald_of` | Era id |
| `focus` | Focus tags |

### Choice fields
`id`, `text` | `label` (exactly one), `effects`, `cost`, `outcomes`, `merit`, `sets_flags`, `clears_flags`, `schedules`, `hidden`, `pair_id`, `intent`, `redeem`, `requires`, `ticket`, `family`, `hint`, `pact`, `filial`, `gate`, `letter`.

### Outcome fields
- `weight` (required), `ok` (`true` only), `text`, `effects`, `merit`, `sets_flags`, `schedules`, `multipliers`, `next`, `family`.
- An outcomes list needs at least 2 entries.

### Effects
- Stats (health / happiness / knowledge / relations / network) take integer levels **±1..±3, never 0**. The engine converts them through `LEVELS {1:5, 2:12, 3:20}`.
- `money: {unit: income_x | fixed_baht, amount, ref_year?, grey?}`.
- `cost` must be > 0. A node cannot have both `cost` and `effects.money`.
- Other keys:
  - `invest {asset, share}`
  - `income_mult` in [0.1, 5], not 1
  - `chronic {stat: ±1..3}`
  - `job`, `school`
  - `debt {kind, amount}`, `settle`, `complain`, `severance`
  - `grey_seize`, `grey_launder` (`grey_launder` is not allowed inside an outcome)

### `when` keys
- `age [lo,hi]`
- `year`: must overlap `years`
- `class`: subset of the 10 classes
- `region`, `sex` (ชาย/หญิง)
- `stats {k:{min,max}}`
- `flags {has, not}`
- `family: [{role: parent|spouse|child|grandchild|pet|herd|peer, sex, age, alive, count}]`
- `occupation`, `school`, `ladder`
- `loss {roles, within, after}`
- `illness`, `kin_illness`, `heredity`, `filial`
- `parent_flags`
- `money_x`, `income_x`, `debt_x` as `{min, max}`

### `multipliers` keys
class, sex, stats, karma, family_fame, wish, flags, parent_flags, occupation, rank, money ratios `{min, max, v}`. All values must be > 0.

### `requires` (locks a choice)
- Keys: money / stats / flags / edu / family / age.
- A lock on flags needs a `reason` the player can read.
- **At least one choice per card must have no lock.**

### `merit` (every choice must have one)
- Format: `{cat, level 1–3}`.
- `neutral` has no level and must be the only entry.
- `vow_broken` uses `level: flag`.
- Category lists are in `vocab.mjs`. Thai category names are accepted.

### `schedules` and `next`
- `schedules: [{event, after_years:[lo,hi]}]`.
- `next` (on an outcome) must point to a card in the same stage that has no `at_age`, `weight` or `era`.
  - The outcome must have `text`.
  - Chains cannot form a cycle.

### Text limits
Measured after each placeholder is filled with its longest value (rule `text-length`):

| Text | Max chars |
|---|---|
| title | 30 |
| text / outcome text | 240 |
| choice | 32 |
| hint | 50 |

### Placeholders
- The set is closed: `{ชื่อ} {อายุ} {จังหวัด} {ภาค} {เงิน} {ชื่อลูก} {ชื่อคู่} {ชื่อหลาน} {ชื่อผู้จากไป} {ชื่อคู่เก่า} {ปีคู่เก่า} {ชื่อสัตว์} {ชนิดสัตว์} {ชื่อฝูง} {ครับ} {ผม} {ลูกดูแลแบบเรา} {พ่อแม่ที่ป่วย} {ผู้รับซอง} {ผู้ฝาก} {เหตุผู้ฝาก} {ผู้ยื่นซอง}`.
- There is **no `{ปี}`**, because the year is hidden from the player.
- `{ครับ}` and `{ผม}` follow the character's sex.
- Placeholders that read the ledger are banned.

### Choice count
- `MIN_CHOICES = 4` (rule `choice-count`).
- Narrative cards use `[]` and are exempt. The near-death court card must use `[]`.

### Card kinds by field

| Field | Kind |
|---|---|
| `weight` | Random deck card |
| `at_age` | Milestone |
| `era` | Era card |
| no weight | Scheduled or `next` target only |
| `prelude` | Prelude |
| `first_of` | First card of a career |
| `herald_of` | Herald one year before an era event |

### Working examples
- `content-fixtures/good/full-schema.yaml` uses almost every field.
- `content/young.yaml` shows `ok` outcomes, `next`, `requires.flags` with `reason`, and `multipliers.flags`.
- `content/era_herald.yaml` shows `herald_of` and `braced:`.
- `content/dilemmas.yaml` shows filial, systems, lore_ref, and mixed merit/sin.

## 3. Lint gates (`src/node/lint/`, 86 rule ids)

### How it runs
- `RULES` = shape + merit + flags + systems + lore + belief + afterlife + kin + focus.
- `lintContext()` loads everything the rules need: regions, systems, lore headings from `docs/spec/lore-*`, eras, occupations, ladders, the flag registry, death causes, and focus tags.
- Every problem is reported; the run does not stop at the first.
- The error format is a contract: `` `${file} · ${id}${path} · ${rule}: ${msg}` ``
  - Example: `content/young.yaml · young_x_01.choices[2].hint · choice-hint: hint ห้ามมีตัวเลข…`

### Shape rules (36)

| Rule | Checks |
|---|---|
| `unknown-key` | Keys outside the schema; catches typos |
| `required` | Required fields are present |
| `choice-count` | At least 4 choices unless `[]` |
| `choice-hint` | No digits and no บุญ/บาป/กุศล. Exception: the price tag "ราคา: บาปเบา/บาปหนัก/บาปหนักมาก", which must match the choice's sin level |
| `pact-shape` | Needs `mara_pact` level 3 |
| `id-format`, `id-duplicate`, `choice-id-duplicate` | Id rules |
| `type-value`, `stage-value`, `years-range`, `at-age-stage` | Basic field values |
| `when-shape`, `weight-shape` | `when` and weights |
| `effect-level` | Stat levels |
| `money-unit`, `debt-shape`, `grey-shape`, `invest-shape` | Money effects |
| `outcomes-shape` | Outcome lists |
| `text-placeholder` | Placeholders in the closed set |
| `era-ref`, `repeat-shape`, `prelude-shape`, `first-of-shape`, `herald-of-shape` | Special card kinds |
| `choice-lock` | `requires` rules |
| `career-shape` | Not every outcome may be ok |
| `ok-direction` | The ok outcome must not score worse than a non-ok one |
| `rank-shape` | Career rank fields |
| `family-ops` | `self_harm` cause is forbidden |
| `family-system` | `when.family` may not use health/relations |
| `illness`, `kin-illness`, `filial`, `heredity` | Their `when` blocks |

### Other rule groups

| Group | Rules |
|---|---|
| merit | `merit-missing`, `merit-category`, `merit-level`, `merit-neutral-alone` |
| flags | `flag-format` (`^[a-z][a-z0-9_]*(:[a-z0-9_]+)?$`); `flag-unset` (every flag read must be set somewhere or be an engine flag); `flag-registry` (must be in `content/rules/flags.yaml` under flags or prefixes); `schedule-target`, `next-target`, `next-cycle`; `parent-flag-registry`, `parent-flag-shape`, `parent-flag-age` |
| systems | `system-unknown`, `system-closed`, `system-before-start`, `system-after-end`, `asset-system`, `debt-system`, `system-undeclared` |
| lore | `lore-required`, `lore-ref` (the heading must really exist in docs/spec), `text-length` |
| belief (17) | `belief-shape`, `belief-category`, `outside-canon`, `belief-effects`, `lottery-*` (9 rules), `ledger-read`, `ledger-text`, `pair-match`, `vow-light` |
| afterlife | `afterlife-shape` (stage ระหว่างชาติ needs scene, `type: B`, effects only on stats); `afterlife-coverage` (every scene × realm has a card with no `when`); `court-shape` |
| kin | `kin-unguarded`: text that mentions แม่ / พ่อ / คู่ / ลูก / สัตว์เลี้ยง needs a `when.family` or `requires.family` guard |
| focus | `focus-tag` (`tags: {}` is empty, so only the 6 categories are valid); `focus-gate` (gate ids must be politics_base / ordain / business / occult / shortcut_money, and not every choice may be gated) |

### `npm run lint:test` (`scripts/lint-test.mjs`)
Fixture checks:
- Each `content-fixtures/bad/<rule>.yaml` (86 files) must fail **exactly that one rule**, and every rule needs a bad file.
- `good/*.yaml` must pass with no problems.

Other checks:
- The merit table passes, and 7 broken control tables fail.
- Omen texts pass.
- Placeholders are filled for both sexes.
- Names pass.
- Era cards fall inside `era.future`.
- Alloc cards for 2500–2700 have at least 4 options and no stock before 2518.
- Job and school-gate cards built by the engine pass.
- The flag registry has no stale entries.
- `heir:` entries are valid and every one is read by some card.
- The real `loadEvents()` passes.
- `content-fixtures/isekai-bad/` (7 rules) each fail their own rule.

`content-fixtures/harness/` holds test-only content for `npm run merit` and `npm run pact`. It never ships in the game.

## 4. Content inventory (about 447 events)

| File | Events | Covers |
|---|---|---|
| afterlife | 28 | Between-lives scenes |
| belief | 22 | สายมู |
| business | 14 | Era-appropriate business |
| career_first | 15 | `first_of` cards |
| child_family | 10 | Childhood, family |
| child_health | 10 | Childhood health |
| childhood_echoes | 6 | Childhood choices that echo in adulthood |
| corruption | 15 | Fraud/bribery, ages 31–59 |
| court | 9 | Court trip while alive |
| debt | 20 | กยศ., home loans, informal-loan collectors |
| debt_invest | 3 | Borrowing to invest |
| dilemmas | 4 | Every option has merit and sin |
| echoes | 6 | Echoes |
| echoes_debt / echoes_family / echoes_health | 7 / 10 / 7 | Echoes 3–35 years later, no weight |
| era_disaster | 16 | 5 disasters |
| era_econ | 13 | 3 economic crises |
| era_herald | 8 | Omen cards a year before |
| funeral | 10 | Funeral cards (the engine calls them) |
| grey_money | 5 | Grey money |
| heir | 9 | Cards that read `parent_flags` |
| lottery | 8 | Ordinary lottery |
| mid / mid_health | 15 / 13 | Middle age |
| milestones / milestones_stages | 2 / 4 | Milestones |
| old_family / old_health | 16 / 15 | Old age |
| pets | 19 | Pets and herds |
| prepared | 1 | Annual check-up |
| remarry | 6 | New love |
| risky_cases | 9 | Risky shortcuts that pay off or come back later |
| scholarship_bond | 1 | Scholarship bond |
| sex_roles | 5 | Sex roles |
| stats_extremes | 5 | Extreme stats |
| teen | 17 | Teen years |
| time_capsule | 5 | Time capsule |
| work_career | 12 | Changing jobs |
| work_health | 8 | Work health |
| work_money | 12 | Work and money |
| work_service | 9 | Civil service, military, police |
| young | 13 | Young adulthood |

Registries in `content/rules/`:
- `flags.yaml`: `flags:`, `prefixes:`, `heir:`
- `focus.yaml`
- `near-hints.yaml`

## 5. Isekai (`src/engine/isekai.mjs`, `continent.mjs`)

### Old role worlds (legacy)
- `ISEKAI_WORLDS`: hero, noble, monster, villainess, slowlife.
- `ISEKAI_ROLES` adds commoner, merchant, elf, dwarf, goblin and demonchild. They borrow stories through `like`.
- New lives no longer use these. They run only with `startIsekai({legacy:true})` (harness) or for old saves that hold a `role`.

### New continent (Aether-card)
- `CONT_RACES`, 8 races: human, elf, dwarf, beastkin, halfling, orc, demon, dragonkin. Each has stat offsets and an aging `pace` (elf 3, dragonkin 3, demon 2.5, orc .8).
- `CONT_REGIONS`, 20 regions: name, about, ruler (4 regions have none), races, spawn tier, danger.
- `CONT_ROADS`: 31 road pairs.
- `CONT_SECRET`: 6 secret paths. **Nothing calls them yet.**
- `CONT_DISPUTES`, 8: throne_war, trade_route, witch_hunt, plague, dungeon_surge, demon_lord, peasant_revolt, frost_exodus.
- `CONT_TIER`: very 8 / often 5 / mid 3 / few 2 / rare 1.

### Per-life setup
- `contNation(seed)` uses its own stream. Each life gets:
  - 1 major power, 1–2 falling, 1–2 rising
  - 1 dispute
  - 3–4 secret dungeons, weighted ×3 toward danger regions
- Birth dossier:
  - `CONT_LIFE.offers=3` (+1 if blessed) → the white-room card ("<race> · <region>").
  - Then pick skills: `ISEKAI.skills 3`, ±1 by karma ±.3, +1 if blessed.

### Year loop and focus
- Ticks are 1 year (5 years in old age) × race pace.
- `ISEKAI_FOCUS` has 14: play, sword, magic, people, roam, study, work, rest, fame, mate, kin, alms, explore, plus `k:<cat>` (unlocks at know ≥ 20). `home` exists only during a trip.
- `ISEKAI_CAREERS`: swordsman, mage, merchant, adventurer, priest.
  - A career is earned when the source focuses add up to 3 full years. Several careers can be held at once.

### Moving region
- `CONT_MOVE {focus:'explore', years:2, offers:3}`: after 2 explore years, offer up to 3 neighbouring regions or "stay".

### Continent deck
`CONT_DECK` gives each card exactly one binding:

| Binding | Weight | Shown when |
|---|---|---|
| `regions` | 2 | The player is in one of the listed regions |
| `dispute` | 2 | It matches this life's dispute |
| `power` | 1 | That power is the player's region or a neighbour |

- Continent lives see world-agnostic cards plus the cards that fit.
- Placeholders: `{land} {major} {falling} {rising} {dispute}`.

### Isekai card format (`content/isekai/*.yaml`; different from main-world events)
- File: `{cards:[...]}`.
- Card: `id`, `ch` (tier 1–3 by stage), `title`, `text`, `choices` (2–3), optional `minFame` / `adult` / `follow`, plus one binding key.
- Choice:
  - `t` = button text
  - rolled choice: `stat` (str / mag / cha / luk) + `dc` 1–40 + `win` / `lose` `{fx, text, flag, next}`, optional focus `tag`
  - plain choice: `fx` + `text`
  - optional: `need:{gold}`, `merit`
- `fx` keys: hp, str, mag, cha, luk, gold, fame.
- Lint has 7 rules: `isekai-shape`, `isekai-id`, `isekai-deck`, `isekai-roll`, `isekai-fill`, `isekai-merit`, `isekai-next`.
  - Error format: `${file} · ${id} · ${rule}: ${msg}`.
  - Ids must not collide with JS cards.
- `deck-sample.yaml` has 3 cards: `cr_helvard_window`, `cd_throne_war_levy`, `cp_major_envoy`.
- **The full regional decks are the main remaining content work.**

### Ending
`CONT_END`:

| Result | Condition |
|---|---|
| best | fame ≥ 30 and has a job ("{job}ผู้เลื่องชื่อแห่ง{land}") |
| good | either one |
| bad | neither |

Fame ≥ 20 records a legend. It is marked dark if more than half of the fame came from sinful choices.

### Getting there
1. The path card in the afterlife ("ตามเทพธิดาต่างโลก") runs `sendToIsekai`.
2. The goddess appears with chance .2×(1+ledger level), minimum .05. Being blessed gives an extra dossier and skill, plus a vow.
3. Entry cards during life (`ENTRY`):
   - circle, puzzle, rescue, overwork, dream, truck, door
   - age bands 13–18 (p 1), 25–45 and 50–75 (p .5); the player can refuse
   - Accepting ends the Thai life: it becomes a death or a disappearance, and the flag `isekai_call` is set.
   - `door` instead starts a mid-life trip (`TRIP`) to a random region, as a human.

### Coming back
- During a trip:
  - The `home` focus builds `seek`. When it reaches `trip.years` (3–12), the `trip_quest` card appears.
  - Choosing to go back runs `tripBack`. Stats and money are written back to the Thai life, and fame/knowledge carry over as network/knowledge. Dying in the other world means going missing.
- After a full isekai life: `closeIsekai` returns to the verdict and path cards. The child path is locked, and isekai can be repeated until `ISEKAI.stay=4`.

### Save compatibility
- `??` fallbacks are used throughout.
- New options are always **appended to the end of a list**, so indices never shift.
- The continent and trip use separate salts.

## 6. Recipe: adding a main-world event card
1. Pick the file that matches the stage and theme, e.g. `content/young.yaml` for ages 19–30. A new file needs only `events:` and is loaded automatically.
2. Write the card:
```yaml
  - id: young_side_gig_01
    type: A
    category: work_money
    stage: หนุ่มสาว
    years: [2500, 2650]
    weight: 2
    when: {age: [20, 28]}
    title: "งานเสริมหลังเลิกงาน"          # ≤30
    text: "…{ชื่อ}…"                    # ≤240
    choices:                            # ≥4
      - id: take_gig
        text: "รับงานกลางคืน"            # ≤32
        hint: "ได้เงินเพิ่ม แต่ร่างกายอาจทรุด"  # ≤50, no digits, no บุญ/บาป
        effects: {money: {unit: income_x, amount: 0.5}, health: -1}
        merit: [{cat: neutral}]
      # …3 more
```
3. Rules that fail most often:
   - `required`, `choice-count`, `merit-missing`, `text-length`, `text-placeholder`, `effect-level`, `money-unit`
   - `unknown-key` (typos)
   - `kin-unguarded`: if the text mentions family, add `when.family`
   - `flag-registry`: add new flags to flags.yaml
   - `flag-unset`
   - `choice-lock`: a flag lock needs `reason`, and at least one choice must stay unlocked
   - `lore-required`, `system-undeclared`
   - `ok-direction`
   - `next-target`, `next-cycle`, `schedule-target`
4. Run:
   - `npm run lint:test`
   - `node build.mjs`, then open `docs/play.html` and check the console has **0 errors**
   - If it touches balance: `npm run gate`, `npm run continuity`, `npm run density`, or `npm run full`
5. If you add a new lint rule, you must also add `content-fixtures/bad/<rule>.yaml` that fails only that rule.

Recipe for an isekai continent card:
- Add it to `content/isekai/*.yaml` with exactly one of `regions` / `dispute` / `power`.
- Give it `ch` and 2–3 choices. A rolled choice needs `stat` + `dc` + `win` + `lose`.
- Use only the placeholders `{land} {major} {falling} {rising} {dispute}`.
- Run `npm run lint:test`.
