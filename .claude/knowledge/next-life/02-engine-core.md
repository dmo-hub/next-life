# 02 · Engine core loop (src/engine/)

Snapshot: v0.6.31 (2026-11-03). Line numbers drift. Grep the symbol name before quoting a line.

## 0. Module map
- `index.mjs` re-exports every engine module. The engine is pure functions over a mutable state object `st`. It has no DOM access. `src/node/load.mjs` builds `content` (events, era, focus, nearHints).
- Import order avoids cycles:
  - `warn.mjs` is separate because both isekai and life use it.
  - `memory.mjs` does not import life; callers pass `stageOf` in.
  - `rank.mjs` duplicates `RETIRE_AT = 60`.
- build.mjs concatenates modules in this exact order: rng, era, birth, family, finance, merit, career, rank, pace, death, court, warn, focus, memory, life, goal, belief, continent, isekai, afterlife, intro, titles, save, then ui art, shelfart, labels, app.

## 1. RNG and determinism (the most important rule)
- `rng.mjs` `makeRng(seed)` is mulberry32. It provides `next()`, `int(lo,hi)` (inclusive) and `pick(arr)`. Its `state` getter lets save.mjs restore a stream at its exact position. `mixSeed(seed,i) = imul(seed,1000003)+imul(i+1,2654435761)`.
- **World stream** `st.rng = makeRng(seed)` is used for: birth year, sex, region, class, one death roll per year, the pool chance and pick, outcome picks, `schedules` offsets, prelude chance, and the funeral grand/chant_7 coin flip.
- **Separate streams** are XOR salts of the seed:

  | Stream | Salt |
  |---|---|
  | province | `^0xa54ff53a` |
  | stat jitter | `^0x6a09e667` |
  | parents / famRng | `^0x3c6ef372` |
  | causeRng | `^0x9b05688c` |
  | kinCauseRng | `^0xc1059ed8` |
  | kinRng | `^0x510e527f` |
  | real name | `^0x2c4e1a77` |
  | pets | `^0x7e7f1a2b` |
  | jobCard | `^0x1f83d9ab^imul(age+1,0x9e3779b1)` |
  | rankRng | `^0x1f83d9ab^0x5be0cd19` |
  | court / near-death | `^0x7f4a7c15` |
  | focus risk | `mixSeed(seed^0x6f0c5a17, age*8+i)` |
  | bot | `^0x5bd1e995` |

- **Invariant: "ไม่ดึงเลขสุ่มของโลก" (no extra draws from the world stream).** A new feature must use its own salted stream. Reordering draws also breaks determinism. These cases draw nothing:
  - a pool round with an empty pool
  - a "flow" life (no focus)
  - warn cards
  - memory cards
- **lifehash** (`harness/lifehash.mjs`, `npm run lifehash -- --base <sha>`):
  - Hashes every card, each bot return value and the death state.
  - Compares a `git archive` baseline against the working tree, each in its own process.
  - A control run flips one bot choice at call #10 (`CTL_AT`); at least 90% of lives must differ.
  - Worlds covered: life, isekai, chain (3 generations).
  - Use it on every refactor that should not change the game.
- `era.mjs` `protoYear(era, seed, year)` makes each game year borrow one whole real year. The year comes from a hash of seed and year, not from an RNG stream. CPI, stocks, wages and mortality are all read from that same proto year. Years after `era.future.to` borrow from `era.future.recent`.

## 2. Life start: `life.mjs` `newLife(seed, content, heir)`
- World-stream draws, in this fixed order:
  1. `pickBirthYear`, weighted by `era.births.w`.
  2. `rng.pick(SEXES)`.
  3. `pickRegion`.
  4. class = `weighted(CLASSES, classOdds(...).p)`. `classOdds` uses a lognormal shifted by the region/national income ratio, cut at `birth.cutZ`.
- When `heir` is given, these values are overwritten afterwards. The draws still happen, so the stream position matches a first life.
- `CLASSES` has 10 levels, from ยากไร้ to มั่งคั่ง. The old 3-level names sit at indices 3, 6 and 9.
- `START_ANCHORS` gives starting stats at class idx 2 `{h55,hap50,k30,rel60,net20}`, idx 5 `{65,55,45,60,40}` and idx 8 `{75,60,60,55,65}`. Other indices interpolate between them. Then ±`START_JITTER=8`, plus `heir.bonus`, clamped to 0–100.
- Parents use famRng: motherAge `int(18,40)` and father = mother + `int(0,8)`. Starting bond is 70.
- Occupation: `pickOccupation(era, seed, cls)` picks the family's job. Starting money = `era.birth.startMoney[clsIdx] * yearlySaving(st)`.
- Province, name and horoscope:
  - The province draw lives in `birth.mjs`. `placeName` drops "จ." for Bangkok.
  - `pickName` chooses by birth-year era and avoids names already in the lineage.
  - `intro.mjs` `introCard` is a narrative card with no choices.
  - `horoscope` is flavour text only.

## 3. State shape (main `st` fields)
- **Identity:** `rng`, `seed`, `content`, `birthYear`, `sex`, `name`, `realName`, `region`, `province`, `ses`, `cls`.
- **Work:** `occupation`, `occupationName`, `familyOcc`, `workFrom`, `ladder`, `office`, `pension`.
- **School:** `school`, `edu`, `needJob`.
- **Money:** `alloc{deposit:1}`, `lastAllocYear`, `estate`, `money`, `debts[]`, `debtYears`, `bankruptcies`, `retireBase`.
- **Stats:** `age`, `health`, `happiness`, `knowledge`, `relations`, `network`, `healthNatural`, `lowWarned`.
- **Karma and lineage:** `ledger` (hidden; must never appear in any card), `deeds[]`, `gen`, `fame` (0–3), `lineage[]`, `legacy`, `letter`.
- **Flags:** `flags{}`, `flagAge{}`, `parentFlags{}`, `omenTone`, `omenAge`.
- **Scheduling and flow:** `scheduled[]`, `due[]`, `queue[]`, `done{}`, `fired{id:{n,age}}`, `pending`, `advance`, `poolAge`, `poolOwed`, `poolLeft`, `poolDry`.
- **Misc:** `baseHappiness`, `price` (price multiple vs birth year), `trail[]`, `statTrail[]`, `standing[]`, `log[]`, `incomeMult`, `chronic{}`.
- **Family and death:** `parents`, `famRng`, `causeRng`, `terminal`, `cause`, `heredity[]`, `kin[]`, `kinRng`, `kinSeq`, `kinFocus{}`, `kinLoss[]`.
- **Lazy fields** (created only when used, so untouched lives stay byte-identical): `focus*`, `gates`, `grey`, `pact`, `court`, `nearDeath`, `trip`, `away`, `rankRng`, `netRng`, `echoes`, `funeral`, `filial`, `officeTop`, `recruited`.

## 4. Stages, constants, stat math
- `STAGES` (start age): เด็ก 0 · วัยรุ่น 13 · หนุ่มสาว 19 · ทำงาน 31 · กลางคน 46 · ชรา 60. After death comes `AFTERLIFE_STAGE = 'ระหว่างชาติ'`.
- `STAT_KEYS`: health (shown as "ชีวิต"), happiness, knowledge, relations, network (shown as "เส้นสาย"). **Only health affects death.**
- Level and curve constants:
  - `LEVELS = {1:5, 2:12, 3:20}` is the central table for effect levels ±1..±3. `levelValue` throws outside that range.
  - `STAT_CURVE = {mid:50, span:20, cap:2, okMin:.05, okMax:.95}`; `statMul(v,x) = v^clamp((x-50)/20, ±2)`.
  - `MOOD = [[15,.5],[30,.7]]` (low happiness hurts study/work odds and knowledge gain).
- Other constants:
  - `INCOME_MULT=[0.1,5]` · `CHRONIC_MAX=3` · `CHRONIC_FADE=5`
  - `RISK = [[2,'เสี่ยงต่ำ'],[5,'เสี่ยงกลาง'],[∞,'เสี่ยงสูง']]`, the spread of outcome scores, shown as a label
  - `PCT_STEP=5`: shown success % is rounded to steps of 5 and clamped to 5–95. Outcomes with a karma/wish multiplier show "สำเร็จ ?".
  - `PACT={luck:1.5, maxYears:10}` · `GREY={seize:.5, fee:.3}` · `RETIRE_AGE=60` · `LOAN_AGE=20` · `ERA_GAP=3`
  - `DEBT_LOAD={pay:.4, net:2, payOff:.3, netOff:1.5}`
- **Natural drift**, applied each year in `stepYear`:
  - health: `*= 1-healthDecay(age)`. Decay is 0 up to age 30, 0.005 up to 60, then `0.005+0.0007*(age-60)`. `healthNatural` decays the same way.
  - happiness: pulled toward `baseHappiness` by `HAPPY_PULL = 1-0.5^(1/3)` (3-year half-life).
  - knowledge: `+= gain*mood*(100-k)/100`. gain is 3 up to age 12, 2.5 up to 18, 1 up to 30, 0.4 up to 60, then 0.
  - relations: `*= 0.993`.

## 5. Year loop: `nextCard(st)`
Priority order:
1. Court trip.
2. Isekai trip (`st.trip`).
3. Throw if `pending`.
4. Dead with an empty queue: a gone-search card or `deathCard`.
5. Pop from `queue`. An era news card merges with the next eraEvent of the same era. Era events re-check `when` on pop.
6. Otherwise loop:
   - If `advance`: do the death roll first, then `stepYear`, then the low-health warn check.
   - Offer isekai entry.
   - Move `due` into `queue`; time does not advance.
   - Fire milestones and scheduled events for this age (`dueAt`), in content order, if they pass `!done`, `inYears`, `whenOk` and `beliefOk`. A scheduled echo takes quota.
   - Pool: once per age, `poolLeft = POOL_ROUNDS[stage]`. Each round calls `drawPool`. If `poolOwed>0`, the drawn card is discarded and the debt drops by one.
   - A fired card is marked `done` and `fired`, and returned with `advance=false`, so the same age is searched again.

Pool and pacing:
- `drawPool` (pool = events with `weight`, no `age`, no `era`):
  - An empty eligible pool counts into `poolDry[stage]` and draws no number.
  - Otherwise `rng.next() < POOL_CHANCE[stage]`, then a weighted pick.
  - Weight = `weight × poolMultiplier × (type B ? poolEffectScale : 1) × lifeFocusMul`.
  - `repeat.max` and `repeat.gap` allow a card to repeat.
- `POOL_CHANCE`: เด็ก .30 · วัยรุ่น .50 · หนุ่มสาว .45 · ทำงาน .35 · กลางคน .35 · ชรา .30. The owner approved these values on 2026-10-23.
- `POOL_ROUNDS` (`pace.mjs`): 1 / 2 / 2 / 3 / 3 / 1 per stage. The harness uses `POOL_ROUNDS_OFF` (all 1) and `setPoolRounds`.
- `PACE = {effectDamp:1, statDamp:0.25}`. Pool-card money, income_mult and loans scale by `rounds^-1`, and stats by `rounds^-0.25`.
- **`takeYearQuota(st)`** does `poolOwed++`. That cancels the next pool card, so follow-ups don't make lives longer. Unused quota carries over to later years.
  - Called by: `next` follow-ups, scheduled echoes, `first_of` ladder cards, heralds at age ≥ 18, and budget/office cards while in office.
  - Not called by: promo cards, the first office invite, or `schedules` with 0 years.

`stepYear` order:
1. Focus year end; retirement base and pension at age 60.
2. `age++`; `price *= 1+CPI`.
3. Drift and chronic flow.
4. Parents aging and kin deaths; kin loss and illness news; pets.
5. Terminal-illness tell.
6. Portfolio return (lending rate if money < 0); savings, or retirement spending minus pension.
7. Debt payments and `homePays`; legacy and letter.
8. `checkBankrupt`, `debtLoad`, `informalFlag`; omen (`OMEN={at:.5, gap:5}`).
9. **Stage change**: a stage card with `stageRecap`.
10. School track end: gate, `jobCard` or ladder.
11. Rank and promo; office end at 60; budget card; office card (needs the gate `politics_base`); recruit; early retirement.
12. `allocCard` (`ALLOC={from:20, every:5, to:70}`).
13. National era events (gap ≥ `ERA_GAP`, one response card per era id).
14. `heraldNextYear` (`HERALD_MIN_AGE=18`; the `braced:` flag expires after 1 year).

Income:
- `yearlySaving = monthlyIncome*12*era.birth.saveRate`.
- `monthlyIncome = jobWage*incomeMult` plus office pay.

## 6. Choices and effects
`choose(st, idx, loan)`:
1. Dispatch court, trip, alloc, search, warn, memory or entry cards to their own handlers.
2. For a content card: `borrowFor`, then `lockReason`, then `fill` the text.
3. `applyEffects`.
4. `applyChoice`:
   - merit → ledger via `noteDeed`
   - `sets_flags` → `raiseFlag`; `clears_flags`
   - `applyFamily`
   - `schedules` with offset `rng.int(after_years)`
5. **outcomes**: `weighted()` on multiplier × mood × pact luck, rescaled so P(ok) ∈ [.05, .95].
   - A bad outcome can be halved (`KIN_AID.scale=.5`):
     - kinAid: bond ≥ 60, chance `(bond-50)/120`
     - netAid: network ≥ 60, health/era/job-loss cards only
   - `o.next` queues a follow-up and takes quota.

Effects and money:
- `applyEffects` keys: stats (levels), `money` (incl. `grey`), `grey_seize`, `grey_launder`, `severance`, `retire`, `invest{asset,share}`, `debt`, `settle`, `complain`, `income_mult` (multiplies, clamped), `school` (`'none'` → needJob), `job`, `ladder` (+`first_of` card), `promote`, `office`, `chronic` (±3).
- **Money units** (`moneyValue`):
  - a bare number = baht in the current year
  - `{unit:'income_x', amount}` = a multiple of `yearlySaving`. Costs use `spendBase` = min(saving, 10× min-wage saving floor).
  - `{unit:'fixed_baht', ref_year}` = adjusted by CPI.

Conditions and multipliers:
- `whenOk` keys: family, loss, illness, kin_illness, filial, heredity, age, year, class (`classNow`), region, sex, stats, occupation (only once working), school, ladder, money_x / income_x / debt_x, parent_flags, flags{has,not}.
- `poolMultiplier` keys: class, sex, stats, karma (`^sign(net)`), wish (`^ledgerLevel`), family_fame, flags, parent_flags, occupation, rank, money ratio `{min,max,v}`.
- `lockReason` checks, in order:
  1. funeral pick
  2. gate ("ยังไม่เคยทุ่มเทกับทางนี้")
  3. grey launder
  4. letter
  5. `requires` (age, money, stats min/max, flags, edu, family)
  - A content `reason` overrides the default text.
  - **Gated choices are hidden, not removed**, so choice indices stay stable.

Flags:
- The registry is `content/rules/flags.yaml`. Every content flag must be listed (lint `flag-registry`).
- Engine-set flags: `in_debt`, `informal_debt`, `bankrupt`, `vow_broken`, `isekai_call`, `cheat_death`.
- Prefixes: `vow_open:`, `hope_set:`, `has_amulet:`, `braced:`, `gate:`.
- Section `heir:` lists flags passed to children via `parentFlags`, with tier 1 (child) or 2 (grandchild) and an optional `from_age`.
- The first `caught_fraud` seizes 50% of grey money.

## 7. Death
- `healthMultiplier`: with `d = health - healthNatural`, the result is `1-d/50` if d < 0, else `max(.6, 1-d/150)`. A life with no events therefore matches the real life table.
- `karmaMultiplier` (`merit.mjs`, `KARMA={ref:10, sinMax:2, meritMin:.75}`): ledgerLevel −1 gives ×2.0, +1 gives ×0.75.
- `qx` (`era.mjs`): a Brass-logit life table per sex and year. `MAX_AGE=120` (qx = 1 there). It uses **body age** = age + `st.away` (years spent in isekai).
- Per-year death check, in order:
  1. `deathRoll` draws `u` from the world stream exactly once per year, **before** the terminal-illness check.
  2. A due terminal illness kills.
  3. Otherwise sum `causeHazards` = qx × k × share × riskOf/norm. If `u < sum`, death, with the cause picked by causeRng.
  4. Otherwise `nearMiss`, then `scheduleIllness` (chronic death 1–3 years ahead, `ILL_YEARS=[1,3]`).
- `death.mjs` constants:
  - `CHRONIC` = heart, stroke, cancer, diabetes_kidney, liver, chronic_resp
  - `HEREDITARY` = heart, diabetes_kidney, cancer (`HEREDITY_RISK=1.3`)
  - `DEATH_RISK`: smoker ×1.8, heavy_drinker ×1.6, sporty ×0.8 · `DEATH_RISK_CAP=2`
  - `self_harm` shows hotline 1323; content may not kill with it.
- `faceDeath`, in order:
  1. pact survive (once)
  2. flag `cheat_death`: summoned to court, then death in the same year
  3. otherwise dead
  - Health ≤ 0 after a card also kills in the same year (`healthCause`).
- Funeral (age ≥ 13): cards `funeral_wishes_01` and `funeral_rite_01`.
  - `FUNERAL.love {high:70, low:40}`, `guestMerit {ref:500, cap:1}`.
  - `pickRite`: `wish_body` → body; no heirs → temple; otherwise by relations, with one coin flip between grand and chant_7.
- A peaceful death at age ≥ 60 gives a memory card (`MEMORY {from:60, stories:3, min:2}`) and draws no RNG.
- Near-death and court (`court.mjs`):
  - `NEAR_DEATH={band:1, minAge:15, causes:[road,accident]}`, once per life.
  - Steps: near → visit → hint (`content/rules/near-hints.yaml`). Hint levels: dark2 ≤ −.5, dark1 ≤ −.01, even ≤ .2, bright1 ≤ 2/3, else bright2.
- Warning: `WARN={human:20, isekai:25, ignore:'ช่างมัน'}`. It fires once on each downward crossing. It is a system card that takes no quota.

## 8. Focus (`focus.mjs`, `life.mjs` lifeFocus*, `content/rules/focus.yaml`)
- YAML globals: `year_scale: .25` (yearly effect = ¼ of a card at the same level), `spend_scale: .25`, `card_mul: 2` (matching pool cards ×2), `chain_years: 3`.
- Groups: work / people / body / gate. `FOCUS_FLOW='flow'` ("ใช้ชีวิตตามน้ำ") has no effect and draws no RNG.
- Focus list:
  - child/teen: play_friends, study_hard, house_chores, run_wild
  - teen/young: follow_dream, party_friends (road risk .015)
  - work: work_hard, side_income, save_money
  - people: find_partner, family_care, parent_care, teach_kids
  - body: health_care, rest_travel, make_merit
  - **gate**: politics_base, ordain, business, occult, shortcut_money (`caught_fraud` .05, assault .015)
- **Chain ends** (shown from the *next* stage once the parent focus has 3 full years):
  - scholarship ← study_hard
  - gang_lead ← play_friends
  - family_trade ← house_chores
  - sport ← run_wild
  - dream_job ← follow_dream
  - exec_climb ← work_hard
  - invest_long ← save_money
  - raise_kids ← family_care
  - temple_pillar ← make_merit
- `FOCUS_NEEDS`: working, single, partnered_or_kids, has_kids, kids_or_grandkids, old_parent, savings_or_credit.
- Mechanics:
  - The year you switch focus does not count (`focusAt < age`).
  - Money applies only while working. Spending is capped at `FOCUS_SPEND_CAP=.1` × savings.
  - Button text uses words only ("ขึ้น/ลด/มาก/มีเสี่ยง"), never numbers.
- Risk uses its own stream:
  - with a `cause`: the first hit is a warn card; the second hit sets `focusDoom`, which means death at the next year.
- **Gates (ประตู)**: `lifeGateOpen` is true when any of these hold:
  - `focusYears[id] ≥ 3`
  - id is in `st.gates` (inherited)
  - flag `gate:<id>` is set (an invitation card)
  - `OFFICE_GATE='politics_base'`.
- Heir: `lifeFocusKid` takes the `kid` of the parent's main focus (most full years).

## 9. Careers (`career.mjs`, `rank.mjs`)
- `EDU` = ประถม / มัธยม / อาชีวะ / อุดมศึกษา. `SCHOOL_FROM=6`.
- `TRACKS`: primary→12 (gate) · lower→15 · upper→18 (gate, uni_exam) · voc→18 · hvoc→20 · uni→22 · cadet/police_cadet→22 (straight into the ladder).
- `schoolGate` and `jobCard` are engine-built cards. `JOB_OFFERS=4` (+1 at network ≥ 70). `JOB_OPEN_MIN=2`. Graduates can take the ก.พ. exam into the `gov` ladder.
- `PROMO` holds years, need and odds per ladder (gov/army/private/trade/police).
- `OFFICE={net:-.25, campaign:1.5, term:4, entry:.2, minNet:45, ageFrom:25, ageTo:59, keep:2.5, fame:.5, odds:[2,1.2,.8,.5,.018]}`.
- `RECRUIT {22–35, .07, max 2}` · `EARLY {50–58, .06}`.

## 10. Save (`save.mjs`) + localStorage (`src/ui/app.mjs`)
- `SNAP_V=1`. `snapshot(root, content)` writes content as `{$c:1}`, events as `{$ev:id}`, RNGs as `{$rng:state}` and shared objects as `{$id,$v}`/`{$ref}`.
- `restore` throws on a version mismatch. Missing event ids become null.
- `repairLife` drops a stale pending card, removes null queue entries and back-fills missing fields.
- localStorage keys:
  - `next-life-save-v1` (legacy seed + replay log; rewritten as v2 on load)
  - `next-life-save-v2` (`{v, snap}`, XOR-obfuscated with key `[0x6e,0x6c,0x69,0x66,0x65,0x32,0x38]` to hide the ledger; this is not encryption)
  - others: `next-life-book-v1`, `-memorial-v1`, `-memorial-seen-v1`, `-pics-v1`, `-whisper-v1`, `-isekai-speed-v1`
  - **`harness/keep.mjs` guards that these key names never change.**

## 11. Goal line
- `goal.mjs` `nextGoal` builds read-only header text. Priority: school > full-time office > ladder > local office.

## 12. Gotchas
- Never add draws to `st.rng`. Use a salted stream. Even a reorder breaks lifehash.
- The death roll for age N happens before stepping to N+1, so infants can die in year 0.
- `done` blocks repeats for the whole life unless `repeat` is set. Era response cards fire once per era id.
- Cards must never show ledger values. The harness checks for leaks.
- Before the first job, `occupation` is the family job. It drives `income_x`, but it does not satisfy `when.occupation`.
- `fill` leaves unknown `{placeholders}` raw.
- Smoker and drinker multipliers are divided by the population norm, so a risk-free life lives longer than average.
