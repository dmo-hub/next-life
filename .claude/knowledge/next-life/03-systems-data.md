# 03 · Game systems + data (finance · merit · belief · afterlife · titles · data/)

Snapshot: v0.6.31. Line numbers drift, so grep the symbol before you quote one. The return series are only for simulating the game world. They are not investment advice.

## 1. Finance (`src/engine/finance.mjs` + parts of life/era/birth)

### Assets
- `ASSETS`: cash, deposit, stock (`system:'stock'`), gold, land, savings_lottery (`system:'savings_lottery'`).
  - savings_lottery's system is closed, and `assetReturn` has no case for it. Using it would throw.
- `DISCLAIMER = 'เกม ไม่ใช่คำแนะนำการลงทุน'`.
- `assetOpen`: an asset with no system is always open. Otherwise it needs `status==='open'` and `from ≤ year ≤ to`.

### `assetReturn(asset, y)`
Returns are fractions. y is the **proto year**.

| Asset | Return |
|---|---|
| cash | 0 |
| deposit | `deposit/100` |
| stock | SET close(y)/close(y-1) − 1 + dividend/100 |
| gold | gold_usd×fx ratio |
| land | BKK house index; before the BIS series it uses `(cpi+housePremium 4)/100` |

- `lendingRate` = lending/100.
- All returns are nominal. "Real" value only comes from `st.price` inflating alongside them.

### Future years ("ปีต้นแบบ", `era.mjs` `protoYear`)
- Each game year borrows one whole real year, picked by a hash of seed⊕year. Every series reads that same proto year, so cross-series correlation is kept.
- `load.mjs` builds `future = {from: sampleFrom 2520, recent: futureFrom 2543, to: min(last of every series)}`.
- Years after `to` sample only from 2543 onward (BoT inflation-targeting era, `finance.json rules.future.futureNote`). This stops prices ballooning.
- No world RNG is used.

### Wages
- `minWage` starts from the BKK min wage in refYear 2561. It compounds using the **growth ratio** of each year's proto year, not its level.
- `monthlyWage = o.wage (ILOSTAT 2561) × minWage(y)/minWage(2561) × regionRatio`.
- `pickOccupation` uses its own stream (`seed^0x2c1b3c6d`). Weights come from `occByClass` (bell curve, spread 2, floor .02).

The 9 occupations (baht/month, 2561):

| Occupation | Wage |
|---|---|
| farmer | 5,994.56 |
| labor | 7,824.41 |
| factory | 12,641.38 |
| craft | 11,357.28 |
| service | 12,800.03 |
| clerk | 15,813.39 |
| technician | 22,381.04 |
| professional | 28,936.34 |
| manager | 31,890.08 |

### Allocation cards
- `ALLOC={from:20, every:5, to:70}`.
- `allocOptions` gives at least 6 options:
  - all deposit
  - all cash
  - gold 50 / deposit 50
  - land 50 / deposit 50
  - stock 50 / deposit 50 (only when stock is open, from 2518)
  - equal split
  - keep as before
- `portfolioReturn` rebalances every year. A closed asset is treated as deposit.
- `periodReturns` reports the real returns **afterwards**.
- ⚠ `titles.mjs` reads alloc options by index. Changing the option order changes past lives' titles.

### SES
- `CLASSES` has 10 levels (deciles).
- Cut points come from `birthplace.json` (lognormal fitted to quintile shares).

### Debt (`DEBTS`, `data/debt.json`)

| Kind | Rate | Term | Notes |
|---|---|---|---|
| student_loan (system) | 1% | 15y | grace 2 |
| mortgage | float = lending | 25y | |
| car | lending + 3% | 5y | |
| informal | 304% simple | — | 20%/24 days; interest only |
| credit_card | — | 3y | system closed |
| bank_loan | lending + 3% | 5y | limit 3 |
| coop | 6% | 3y | from 2544 |

- `payDebt`: during grace, interest capitalises. `simple` loans pay interest only. Others pay an annuity.
- `complainDebt` drops informal to `complaint_rate .15`.
- Bankruptcy:
  - Trigger: `debt.bankrupt{k:4,n:4}`, i.e. net debt > 4× annual income for 4 years in a row.
  - Effect: debts cleared, money = 0, alloc = deposit, flag `bankrupt`, happiness −12, relations −5.
- Retirement: `retire_spend .02`, `retire_floor .13`.

### Grey money (`GREY={seize:.5, fee:.3}`)
- `st.grey` is a separate bag, created lazily. Standing, estate and fame ignore it, and it disappears at death.
- Content routes money in with `money:{…, grey:true}`.
- `grey_seize: share` takes a share. The first `caught_fraud` automatically seizes 50%.
- `grey_launder: share` costs a 30% fee and works once per year. It is locked when the bag is empty or already laundered this year.

### Lottery (`LOTTERY_PRIZES`)
- per 1,000,000 tickets, price 80.
- Big prizes:
  - first 1×6,000,000
  - near_first 2×100,000
  - second 5×200,000
  - third 10×80,000
  - fourth 50×40,000
  - fifth 100×20,000
- Small prizes: front3 2,000×4,000 · last3 2,000×4,000 · last2 10,000×2,000.
- Total win rate 1.4168%. The table is exposed as `PRIZE_TABLES['finance.lottery']`.

### Investing from content
- `invest:{asset, share}` moves `share` of the whole allocation into one asset. It throws if the asset is not open.

### `systems` lint (`src/node/lint/systems.mjs`)
- `system-unknown` · `system-closed` · `system-before-start` · `system-after-end`
- `asset-system`: investing in stock must declare `systems:[stock]`.
- `debt-system`: student_loan and credit_card must be declared.
- `system-undeclared`: words like "หุ้น", "กยศ" or "บัตรเครดิต" in the text force a declaration.
- `lore-required`: any event with systems, belief or `fact` needs a `lore_ref`.

## 2. Merit/karma (`src/engine/merit.mjs`)

### Ledger and weights
- `newLedger()` = `{merit, sin, byCat, broken}`. The ledger is hidden. Players only see omens; the full reveal happens in ปรโลก.
- `MERIT_LEVELS={1:1, 2:2.5, 3:4}`.
- `MERIT_WEIGHTS`:

| Category | Weight |
|---|---|
| 8 canonical sins (Phra Malai): greed_harm, disturb_monk, abuse_elders, unjust_judgment, adultery, love_charm, oppress_subjects, intoxicants | 1 each |
| vow_broken | .5 |
| merits: dana, sila, bhavana, care_parents, help_others | 1 each |
| isekai: kill_for_gain | 1 |
| isekai: cheat_exploit | .5 |
| isekai: keep_goddess_vow (merit) | .5 |
| forbidden_knowledge, against_nature, mara_pact | .5 each |

- Category lists:
  - `SIN_CATS` (14)
  - `FLAG_CATS=['vow_broken']`
  - `GAME_CATS` (categories the game invented, outside the scriptures)
- The `TH` map lets content use Thai names. `neutral` ("กลาง") is skipped.

### Recording
- `recordMerit`: flag categories have no level and are recorded once per key. Other value = w × level. An unknown category throws.
- `addMerit`: for values the engine computes, such as merit from funeral guests.

### Effect on death and omens
- `KARMA={ref:10, sinMax:2, meritMin:.75}`. `ledgerLevel=clamp(net/10,±1)`.
  - `karmaMultiplier`: x<0 gives up to ×2.0; x>0 gives down to ×0.75. It multiplies cause hazards.
- `OMEN={at:.5, gap:5}`: a new omen only when the tone changes and at least 5 years have passed.
  - `OMEN_TEXT` has 3 lines per tone, with no numbers. They are picked by hash, not RNG.

### Table gate (`checkMeritTable`, called by loadEvents and lint:test)
- Every category has a weight, and Thai names round-trip.
- Levels are positive and strictly increasing.
- **Every GAME_CATS weight must be below the minimum level-1 weight of the canonical categories** (now .5 < 1).
- Karma bounds are valid.

## 3. Belief / สายมู (`src/engine/belief.mjs`, `content/belief.yaml`)

### Activities and lint
- The 6 kinds:
  - fortune (ดูดวง)
  - auspicious_time (ฤกษ์)
  - lottery_numen (หวยสายมู)
  - vow (บนบาน/แก้บน)
  - amulet (เครื่องราง/สักยันต์)
  - merit_wish (ทำบุญเสริมดวง)
- Each card also has `tradition` (พุทธ/ผี/พราหมณ์/ผสม) and `outside_canon`.
- Lint: non-lottery cards may only affect happiness, relations, money spent, flags and merit tags. **Only lottery_numen may read the ledger.**

### lottery_numen
- Config (YAML anchor `&lottery`):
  - `trigger:{money_state:tight}`, `cap_per_life:5`, `prize_table: finance.lottery`
  - `stake:{fixed_baht 80, ref_year 2560}`
  - `odds_modifier:{source: merit_ledger.net, formula: mult_up_only, max_mult:4, prize_scope: small}`
- `TIGHT={months:3}`: net worth below 3 months of income. Someone with no income yet is never tight.
- `smallPrizeMult m = 1 + 3×clamp(net/ref, 0, 1)`. It only goes up; heavy sin means the real odds.
  - Big prizes are never adjusted.
  - The draw uses the **world RNG**, because the player chose to buy.
- Baht amounts are shown only from 2560 onward.

### Other belief mechanics
- **merit_wish**: `sincere` vs `wish_for_gain` choices. The wish gives dana one level lower and sets `hope_set:<id>`.
  - If wealth hasn't risen, a follow-up card costs −1 happiness level.
- **vow**: refusing at the second due card sets `vow_broken (level: flag)`.
  - The option "แก้ตามกำลัง" costs ≤ .05 income_x, so poverty doesn't turn into sin.
  - `bel_vow_exam` is a prelude before uni_exam (chance .5).
- `beliefActs()` counts belief acts. It feeds titles axis ④ (ทางโลก↔ทางธรรม).

## 4. Afterlife (`src/engine/afterlife.mjs`, `content/afterlife.yaml`)

### Steps and scenes
- Steps: `transfer → devaduta → verdict → path → scene → carry`.
  - Own streams: `seed^0x1b873593`; bot `^0x2545f491`.
- Scenes:
  - transfer (ส่วนบุญ/อนุโมทนา): 7, including regional festivals
  - devaduta (เทวทูต 5): 6
  - realm: 2 per realm
  - ancestor (ผีบรรพบุรุษ): 5
- Scene effects become starting bonuses for the next life, capped by `FATE.bonusCap 12`.
- Choosing merit before the verdict changes the verdict. Choosing it after changes what carries over.

### Verdict
- `VERDICT_REF=30` (separate from KARMA.ref 10). x = clamp(net/30).
- `REALMS` by upper bound:

| Realm | Upper bound of x |
|---|---|
| hell | ≤ −.5 |
| peta (เปรต) | ≤ −.2 |
| beast | ≤ −.01 |
| human | ≤ 2/3 |
| deva | above that |

- Net 0 = human.
- Term = `round(|net|×10)` realm-years (0 for human).
- The ledger shows only here (`reckoning`).

### Path
- `PATHS`:
  - child: locked if no child or grandchild is alive
  - reborn
  - isekai
- The `isekai_call` flag sends the soul to isekai automatically.
- The child path shows the ancestor scene. Other paths show the realm scene.

### Carry-over
- `CARRY={spend:.5, min:.3, max:.7}`.
- `carryLedger`:
  1. The side that decided the verdict loses .5×|net|.
  2. Everything is then multiplied by r ~ U(.3, .7).
  - broken vows do not carry.
  - `FULL_CARRY=['mara_pact']` carries in full.
- `KIN_TIERS` (ลูก/หลาน/เหลน): w 6/3/1, carry 1/.75/.5, kin 1/.6/.3, legacy 1/½/¼.

### Next-life status
- `FATE={sd:1.2, childStep:3, stat:10, bonusCap:12, kin:.3}`.
- Starting class:
  - reborn: class = `round(4.5+4.5x+gauss·1.2)`
  - child: parent class + wealth tier (`richUnits [10,40]`, −1 if in debt) + `round(3x)`
  - Both are then mixed 50/50 with the standing at death (`STAND_MIX .5`). Dying in debt = standing 0.
- Starting stats: `x·10` + scene bonus + kin term ((parent stat−50) × .3 × tier, ±12) + `fame×5` to network.

### Inheritance
- `LEGACY={kids:2, taxFrom:100e6, tax:.05, taxYear:2559, richUnits:[10,40], dispute:.1}`.
- The estate is split per living child. A dispute (reached a funeral, no will) costs 10%. From 2559, the part above 100M is taxed 5%.
- Amounts are kept in units of national annual household income and converted back to baht in the heir's year.
- **Debt does not pass to children** (ป.พ.พ. ม.1601). It does push the heir's class down by 1 and lowers fame.
  - Phase 7 plans to change this rule.

### Fame
- `FAME`: names ไร้ชื่อ / มีหน้ามีตา / ผู้มีบารมีในถิ่น / ตระกูลใหญ่; decay .5, rich 7, guests 300, network 5/level.
- Points come from office, wealth and 300+ funeral guests. Fraud, bankruptcy and dying in debt subtract.
- `nextFame = ceil(fame·.5 + pts − .5)`, plus 1 per new family goal met.

### Heir flags
- Section `heir:` of `content/rules/flags.yaml`:
  - tier 2: own_business, home_owner, wish_letter_*
  - tier 1: caught_fraud, loan_shark, guarantor, heavy_drinker, smoker, lottery_habit
- They are stored in `parentFlags`. Cards in `content/heir.yaml` read them through `when.parent_flags`.

## 5. Titles (`src/engine/titles.mjs`)
- `PATTERN_FROM=18`, `PATTERN_MIN_PICKS=3`. **Never read the ledger total**, only tags on choices the player actually picked.
- `AXES`: z = (raw/√picks − cut)/scale.

| Axis | Poles | cut | scale |
|---|---|---|---|
| work | ครอบครัว↔งาน (F↔W) | −.633 | .751 |
| away | บ้านเกิด↔ไปไกล (H↔A) | .186 | .386 |
| risk | มั่นคง↔เสี่ยง (S↔R) | 1.401 | .528 |
| dhamma | ทางโลก↔ทางธรรม (L↔D) | .316 | .371 |

- `NEAR=.3`, `HALF_AXES=3`.
- `npm run titles` prints the medians so AXES can be tuned.
- Summation order must not change: float rounding near an edge can flip a pattern.

### Patterns and titles
- **Patterns**: 16 four-letter ids plus HALF "น้ำครึ่งแก้ว" = 17.
  - Examples: FHSL "ต้นมะม่วงหน้าบ้าน", WARD "ว่าวจุฬากลางสนามหลวง".
  - Short lives use 5 more (K0, KHS, KHR, KOS, KOR), so `ALL_PATTERNS` = 22.
- **Conditional titles**: `TITLES` has 29.
  - Tiers ตำนาน (<1.5%) / หายาก (1.5–10%) / ทั่วไป (>10%).
  - **Each must be reached at least 0.1%** (checked by the harness).
  - Negative titles use sympathetic wording.
- **Family titles**: `FAMILY_TITLES` has 7 (climb, no_hell, debt, long, guardian, wander, deva).
- **Family goals**: `FAMILY_GOALS` has 4 (rags-to-riches, service, politics, great). Each gives +1 fame once per family.

## 6. data/*.json

### Data rule (`scripts/check-data.mjs`)
- Every number must be covered by `source` (an https URL) or by `assumption: true` + `note` at some ancestor level. Keys `y` and `age` are exempt.
- Events need `from ≤ to` and non-empty `facts`.
- Provinces must sum to their region (77 provinces).

### Files

| File | Holds |
|---|---|
| birthplace.json | 7 regions; provinces (2566 registry); quintile shares [7.9, 11.9, 16.1, 22.6, 41.5], top10 26.1 (WB PIP); household income by region, 18 survey years 2524–2566; save_rate .1; start_money by class |
| births.json | CBR + population 2500–2569 (WB) → birth-year weights |
| inflation.json | CPI 2500–2568; before 2503 = 0% (assumption) |
| mortality.json | e0 / IMR by sex; Brass logit (HLD 1960 before 2543, WHO after); Gompertz tail from age 85 (death certain at 120) |
| death-causes.json | WHO GHE shares, 14 groups × age band × sex × year; `norm` block written by `scripts/death-norm.mjs` |
| finance.json | deposit, lending, fx, gold_usd, set_close (2518+), set_dividend (3% before 2553, assumption), house_bkk (BIS 2534+), min_wage_bkk (2516–2569), occupations, rules |
| debt.json | **Hand-tuned.** Target: 15–30% die in debt, 3–8% go bankrupt |
| careers.json | Ladders gov/army/police (pension) / private / trade; 5 office steps; severance per ม.118 |
| era-events.json | 9 events: oil ×2, typhoon Gay, Tom Yum Kung, SARS, tsunami, GFC, flood 2554, COVID |
| habits(.json, -survey.json) | Smoking, alcohol, exercise |
| names.json | AI-drafted names by era (assumption) |
| system-starts.json | **open**: min_wage 2516, stock 2518, fraud_loan_act 2527, social_security 2533, student_loan 2539, universal_health 2545, promptpay 2560, ssf 2563–2567. **closed** (start year unconfirmed, so content may not reference it): credit_card, provident_fund, elderly_allowance, savings_lottery, ltf_rmf, online_stock, mobile_banking |

### Fetch scripts (need internet)
- `fetch-data.mjs`: WB, WHO GHO, HLD.
- `fetch-finance.mjs`: WB, datahub gold, Wikipedia SET, SET annual reports, FRED BIS, min-wage URLs, ILO SDMX (sends `Accept-Language: en` to dodge an ILO bug).

## 7. Gotchas found by reading the code
1. **Running `fetch-finance.mjs` again will break loading.** Its `rules.future` does not write `futureFrom: 2543`, so load throws "futureFrom ใช้ไม่ได้". Patch the script first.
2. `inflation.json rules.future` text is stale ("sample from 2503"). The real behaviour follows finance sampleFrom 2520 / futureFrom 2543.
3. `lottery.yaml` (the ordinary lottery) hard-codes its own odds (weights 985/13/1, first prize about 1/999) instead of using `finance.lottery`. Lint doesn't catch it because it isn't a belief card.
4. The car `cap` is never used: debt.json car has no `cap` field.
5. **Two karma scales**: KARMA.ref 10 (death, omens) vs VERDICT_REF 30 (realm, next-life class). Changing one doesn't change the other.
6. The world RNG is avoided in belief, afterlife, occupation and omens, but the numen lottery draw uses it deliberately.
7. savings_lottery will crash if anything opens it.
8. Grey money disappears at death.
9. "17 patterns" = 16 + HALF; there are 22 including short-life patterns.
10. Reordering alloc options changes past titles.
