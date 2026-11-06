# 06 · Workflow, roles, roadmap, next steps

Snapshot: v0.6.31 (2026-11-03). **Warning:** `~/.claude/work/thai-life-sim/build/` (LANES.md, backlog.md, WORK.md, B*-plan.md, gate.mjs) is not on this machine. The content below comes from CLAUDE.md, git history, gdd.html#tech and CONTRIBUTING on `origin/integrator/contrib`. Points marked "inferred" should be confirmed with the integrator.

## 1. Roles and rules (CLAUDE.md, mandatory)

| Role | Does | Must not / notes |
|---|---|---|
| **Owner** | Decides everything: design, balance numbers, card text | AI proposes, asks, and drafts only |
| **Integrator** (session `next-life-integrator`) | The only one who merges to main. Runs the heavy harness, bumps, writes whatsnew, tags, runs `keep --save` | Questions that need an owner decision go through the integrator |
| **Lane / contributor** | Works one ticket per branch named `lane-<x>/<ticket-name>`. Sends "พร้อมตรวจ" to the integrator when done | Never commit or bump in the main worktree. No bump, no whatsnew edit, no tag, no `keep --save` |

Working rules:
- **Do not edit the GDD or balance numbers the owner set.** If you think one should change, propose it first.
- **Do only what the ticket asks.** Write off-ticket ideas as one line in `~/.claude/work/thai-life-sim/build/backlog.md`, then carry on.
- Game numbers live in `content/*.yaml` and engine constants. Never hard-code them in a screen.
- After editing, run `node build.mjs`, open `docs/play.html` for real, and confirm **0 console errors**.
- When unsure, ask. Don't guess.

## 2. Lanes (inferred from 55 remote branches)

| Lane | Area | Example branches |
|---|---|---|
| `lane-a/` | content + engine features | af1-herald, af3-letter, isk08-protect, ov14-schedule, ov21-dungeon, ov23-items |
| `lane-b/` | rules + harness infrastructure | draw-rules, stable-gates, dynasty-3-4, 06s-skills, gs2-echo-chance |
| `lane-c/` (old spelling `lanec/`) | UI + website | death-share, death-tabs, desktop, focus-page, gdd-release-flow, menu-* |
| `lane-omen/` | omens | omc, herald-cap, overlap-* |

- `integrator/contrib` is the integrator's branch (CONTRIBUTING, PR template, CI).
- Ticket ids look like `Bxxx`, `ใบ NN`, `06c-1`, `gs-1`, `omc-2`, `af1`, `ov14`.

## 3. Release train (gdd#tech + git)
1. A lane finishes and sends "พร้อมตรวจ" with test results (and lifehash if the change claims no gameplay effect).
2. The integrator merges branches with `--no-ff` into a train branch `rel/N` (rel/61–64 seen; train 65).
3. The integrator runs the gates once: `npm run full`, which must not be worse than the baseline (`-- --save` when accepted), then `npm run keep`.
4. `npm run bump` (rebuilds) → write the whatsnew `<h3>vX <small>date</small></h3>` → `npm run keep -- --save` → `npm run site:check` → `npm run shots`.
5. Fast-forward main, push, tag `vX.Y.NN` (v0.6.22–v0.6.31 exist).
6. **The owner plays it.** Each phase closes when the owner has played it, before the next phase starts.
7. Before a real release: `npm run full:release` (100k per bot, zero dead items).

### CI (`.github/workflows/ci.yml`, on the contrib branch, Node 22)
`npm ci` → `lint:test` → `harness:test` → `site:check` → `check:data` → `node build.mjs` → `git diff --exit-code -- docs` (fails if the committed docs don't match the build).

### Commit conventions
- English Conventional Commits: `feat(engine|content|ui|isekai|site)`, `fix(...)`, `test(harness)`, `docs`, `chore(build)`.
- Bump commit format: `chore(ui): bump demo version vX for <summary>`.
- Merge message formats: `Merge branch 'lane-a/x' into rel/64` or `merge lane-a/<b> <sha>: <summary>`.

## 4. Lane checklist before sending "พร้อมตรวจ"
1. Branch off the latest main as `lane-<x>/<ticket>`.
2. Edit:
   - Numbers go in content YAML or engine constants.
   - A new engine file must be added to `build.mjs` `files` and to `index.mjs`.
   - A new lint rule needs `content-fixtures/bad/<rule>.yaml`.
3. `node build.mjs`, then open play.html and play the changed part. Console errors must be 0.
4. Quick gates: `npm run lint:test && npm run harness:test && npm run site:check && npm run check:data`.
5. Run the harness the ticket touches: titles, isekai, lineage, continuity, belief, finance, density and so on.
6. If the change claims no gameplay effect: `npm run lifehash -- --base <sha>` (use all three worlds where relevant).
7. Rebase on main and rebuild so docs match. **Resolve conflicts in docs/*.html by rebuilding, not by hand-merging.** Keep both sides in conflicts on `package.json` scripts and `shape.mjs` key lists.
8. Push the branch and send "พร้อมตรวจ" to the integrator.

## 5. Roadmap (gdd.html section 22, phase order set 2026-10-30)

### Shipped
- Phase 3 complete.
- Most of phase 4.
- Parts of phase 5: grey money v0.6.24, debt cards v0.6.19.
- Parts of phases 14–15: continent v0.6.22, isekai focus v0.6.20, region moves v0.6.26, decks with one card each v0.6.29.
- Extras outside the phases: cause-and-effect strip on the death card, embedded fonts, time capsule, risky shortcuts, preparation, FX.

### Phases 4–12 · deeper life in this world

| Phase | Topic | Remaining |
|---|---|---|
| **4** | Quality gates (rest) | Card pools must never get stuck · per-life flags cleared when the generation changes · cap on follow-up stories per life |
| **5** | Record + debt | Permanent flags for court cases, blacklist and firing, read by job / loan / election cards · undetected wrongdoing dug up 3–15 years later · bankruptcy blocks loans · silent risk meter with warnings before jail or fleeing debt · loan offers as the entry gate to the debt path · 4 ways out of crushing debt · bad habits that build up |
| **6** | People around you | Story threads per person (≤1 per year) · rivals with a backstory, passed to their kids · favours owed per person · relationships fade when you don't meet · spouse with a hidden true self · friends with roles · paying to repair relationships · card cooldowns |
| **7** | Across generations | Family debt inherited up to a cap (**changes the rule "หนี้ไม่ตกถึงลูก"**) · heir starts mid-story · inheritance with a floor · heir keeps half and the world remembers · starting stats from the child's path + both parents · 1 heirloom · several heirs |
| **8** | 8-path milestones | study · civil service/rank · politics · business · dhamma/mu · family · wealth · shortcuts · 3–5 milestones each · remove the next-goal label · ending names up to 3 furthest paths · end of a path = fame +1 and merit-shop points · stage themes · no long quiet stretches · time-skip page |
| **9** | Politics ladder | Village head → อบต. chief → MP → party leader → PM · real terms (4 years, PM ≤ 8 years total) · elections can be lost · 8 fictional parties · budget fraud blows up 2–8 years later · honest play pays off · "shame awards" |
| **10** | Market + money | Permanent market button with 10 long-lived items that expire · regional cost of living · prices shown in months of household income · credit cards · online selling · care costs · wear |
| **11** | Effects + hints | "Good/bad because…" labels · omens instead of numbers · meditation gives karma hints · illness warning signs · prophecies with deadlines · end-of-stage report in words · extreme stats have a cost · decision-point hints |
| **12** | Marriage + children | Having children decided with your partner, plus adoption · break-up/divorce + mourning · eloping · child not yours · child moves away and returns with grandchildren · real in-laws · memorial scene |

### Phase 13 · playable afterlife
- Stay `3 + |net merit| ÷ 2` divine years (max 30), one card per year.
- "ชีวิตทิพย์" (divine life) starts at hell 30 · peta 40 · animal 50 · human 60 · deva 100.
- Two more stats:
  - ปัญญาธรรม (wisdom) = half of knowledge at death
  - ความผูกพัน (bond) = half of relations
- Per-realm decks and 5 afterlife focuses. A "ปล่อยวาง" (let go) button skips ahead to rebirth.
- **Merit shop** (before rebirth): 6 one-life blessings and 6 birth choices (region, sex, wealth ±1, original family). Milestone points can be spent here.

### Phases 14–15 · isekai, Aethergard continent (remaining)
- Full region / dispute / power decks (currently one card each).
- Unlimited cards until death; settling the 4 unruled regions; rule-a-realm and guild gates.
- Ending by furthest path, plus an endings book.
- Gold shop with 18 items.
- Secret dungeons: 3–4 per life, 5–10 floors + boss.
- Secret routes in 3 tiers (`CONT_SECRET` has data but nothing calls it yet).

### Phases 16–20 · polish
- UI: update notice, break reminder, content warnings, mis-tap guard, SVG scenes, yearly summary, and more.
- Needs owner decisions first: risk numbers on choices, 2-level choices, item slots, "higher stats get harder".

### Open owner decisions (gdd#open)
- Is the mu-lottery using more than half of the fantasy quota? (warn line 2.5 per life)
- Final names for patterns and titles (AI placeholders for now).
- Share image layout and text.
- Should real-world mu raise success odds? (conflicts with design pillar 3)
- Numbers to be set at each gate: party founding money, race starting stats, region birth weights, merit-shop points, afterlife deck size, dungeon depth rewards, secret map price, chance of getting lost, and others.

### Out of scope
Backend · online memorial · multiple countries · real time · monetization.

## 6. Where to start developing
1. **Phase 4 (rest).** Small, lays the base for later phases, mostly harness work (lane-b style): stuck pools, clearing flags when the generation changes, cap on follow-ups.
2. **Phase 5.** Continues from grey money and the debt cards; engine + content (lane-a).
3. **Parallel track that doesn't touch the main phases:** write the full isekai continent decks in `content/isekai/*.yaml`. The system is ready; only content is missing. The owner must approve the content.
4. **Refactor (outside the plan, propose first):** `app.mjs` (~3,000 lines), `life.mjs` (~2,000), `isekai.mjs` (~2,300). Prove with lifehash that nothing changes.

Known bugs and debt found while reading the code. Raise them through the integrator or write them in backlog:
- `fetch-finance.mjs` doesn't write `futureFrom: 2543`, so re-fetching breaks load.
- `lottery.yaml` sets its own odds instead of using `finance.lottery`.
- Car loan `cap` is never applied.
- `inflation.json` future note is stale.
- README points to `docs/overview.html`, which moved to `archive/`.
- MAP.md is stale on the theme button and the `proto/` path.
- CONTRIBUTING says full n2000, but package.json says 20000.
