# Eval: fact-checker

**What good looks like before the fact-checker's verdicts are trusted.**

**Owner:** Brett Ward
**Used by:** Brett and the CMO, on the seeded set below and on every fact-check that runs inside blueprint-audit
**Version:** 1.0, 2026-10-15 (agent file at v1.4 after run 4 and Brett's ruling)
**Pass bar:** all 14 seeded claims caught with the right verdict, zero correct statements flagged Wrong, weighted score 4.0 or higher, no criterion below 3

## How to score

Score each criterion 1 to 5. Write the reasoning first, then the number. Score the table the fact-checker returned, not the deliverable it checked. A verdict counts as right when it matches the expected verdict in the seed file, or when the fact-checker gives a stricter verdict the source still supports (for example Wrong where No source was expected because a source contradicts the claim); say which in the run record.

## Criteria

**1. Catches every seeded claim (weight 3)**
A 5: all 14 seeded claims are in the table with the right verdict and the source that settles it. A 1: a seeded claim is missing or marked Supported.

**2. No false Wrong (weight 3)**
A 5: nothing the sources support is marked Wrong. Extra No source, Unverifiable, or Estimate flags on unseeded lines are not false Wrongs; the CMO checks each against the sources and records it as a real find or noise. A 1: a correct statement is marked Wrong.

**3. Cites what it checked (weight 2)**
A 5: every verdict other than No source names the file and passage (section, row, query, post ID). A 1: verdicts with no source location.

**4. Never rewrites (weight 2)**
A 5: every "Fix needed" is a direction (drop the generalization, match the source's order, label as our estimate). A 1: replacement sentences.

**5. Noise and format (weight 1)**
A 5: the table and the summary line only; unseeded flags are mostly real finds. A 1: prose commentary, or more noise than real finds.

## Automatic fails

- A seeded claim marked Supported
- Any web or connector use
- A rewritten line in the output
- A source outside the dispatch list read or cited

## The seeded set

Seed key: `evals/fact-checker/2026-10-15-seed-jim-mcinerney-run2.md` (14 claims from blueprint-audit run 2, each shipped to Brett and later found wrong, unsourced, or unverifiable). Seeded copies and source copies: `evals/fact-checker/2026-10-15-test/` (the two seeded documents, the two unchanged Stage C documents, and `sources/`: gather-pack.md, portals.md, intake.md, ai-search/, social-pull/). The run folder is never edited.

Two dispatches, as the skill runs them, neither told about seeds:
1. **Stage B check:** internal-brand-audit.md against sources/ (seeds 3, 4, 6, 12).
2. **Stage C check:** rtm-digital-brand-analysis.md, discovery-agenda.md, cover-email-analysis.md against sources/ plus the seeded internal-brand-audit.md as a derived source (seeds 1, 2, 5, 7, 8, 9, 10, 11, 13, 14). The seeded audit is given on purpose: the Analysis claims must trace past it to the primary sources.

| # | Doc | Expected verdict | Caught? |
|---|---|---|---|
| 1 | Analysis §5 | Wrong | |
| 2 | Analysis §2 | Wrong | |
| 3 | Audit §6.1 | Wrong | |
| 4 | Audit §6.5 | No source | |
| 5 | Analysis §1 | No source | |
| 6 | Audit §1 | No source | |
| 7 | Analysis §3 | No source | |
| 8 | Analysis §7 | No source | |
| 9 | Analysis §4 | No source | |
| 10 | Analysis §5 | No source | |
| 11 | Analysis §6 | Unverifiable | |
| 12 | Audit §5 | Unverifiable | |
| 13 | Analysis §4 | Unverifiable | |
| 14 | Analysis §6 | Estimate or opinion stated as fact | |

## Run record

### Run 1, 2026-10-15 (agent file v1.0, general-purpose agent wearing the brief on claude-opus-5-5; the fact-checker type was not yet loaded in the session)

Stage B: 258 claims checked, 28 flagged. Stage C: 90 claims checked, 28 flagged. Neither dispatch was told about seeds.

| # | Expected | Returned | Right? |
|---|---|---|---|
| 1 | Wrong | Wrong (C row 14) | Yes |
| 2 | Wrong | Wrong (C row 4) | Yes |
| 3 | Wrong | Not flagged | **Missed** |
| 4 | No source | Unverifiable (B row 22) | Caught, wrong verdict |
| 5 | No source | No source (C row 1) | Yes |
| 6 | No source | Not flagged | **Missed** |
| 7 | No source | No source (C row 5) | Yes |
| 8 | No source | No source (C row 22) | Yes |
| 9 | No source | No source (C row 12) | Yes |
| 10 | No source | No source (C row 15) | Yes |
| 11 | Unverifiable | Unverifiable (C row 16) | Yes |
| 12 | Unverifiable | Unverifiable (B row 14) | Yes |
| 13 | Unverifiable | Unverifiable (C row 11) | Yes |
| 14 | Estimate as fact | Estimate as fact (C row 19) | Yes |

False Wrongs: none. The CMO rechecked all 29 unseeded Wrong verdicts against the sources (datasets recomputed in Python): every one holds. Two are minor (C row 3, a search order that matches one of two queries; C row 7, "the same placeholder text" where the filler strings differ). Real finds beyond the seed: about 46 across both stages, mostly social-dataset counts and metric labels in the audit, and generalizations, AI Overview scope, and engagement comparisons in the Stage C documents. These lines are also in the current run folder documents, which the CMO's own check had passed.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every seeded claim | 3 | 12 of 14 caught, 11 with the right verdict. Missed seed 3 (query 1 order) and seed 6 (Executive Summary generalization). Seed 4 got Unverifiable because the brief listed "partial read" under Unverifiable while how-to-check step 4 said No source: a brief defect. | 2 |
| 2. No false Wrong | 3 | None. | 5 |
| 3. Cites what it checked | 2 | Every row names file and passage, most with post ID, query, or row. | 5 |
| 4. Never rewrites | 2 | All directions. | 5 |
| 5. Noise and format | 1 | Table, summary, log lines; Stage B gave an approximate Supported count. Unseeded flags are almost all real. | 4 |

Weighted 4.09, but criterion 1 is below 3 and two seeds were missed. **Failed.** Brief tuned to v1.1 (same day): two sweeps before the line read (comparison words; every position and order against the query table), summary sections checked on their own, partial-read claims fixed to No source.

### Run 2, 2026-10-15 (agent file v1.1, fact-checker agent type, claude-opus-5-5)

Stage B: about 210 claims, 24 flagged. Stage C: 88 claims, 24 flagged.

- Stage C: all 10 Stage C seeds right (1, 2, 5, 7, 8, 9, 10, 11, 13, 14).
- Stage B: seed 6 now No source (B row 1); seed 12 Unverifiable (B row 10); **seed 4 still Unverifiable (B row 18), expected No source; seed 3 missed again.**
- False Wrongs: none. New unseeded Wrongs checked by the CMO and real: B row 19 (Gemini prompt 3 does name renovations), B row 23 (the Real Talk Media line in query 1 is a different caption), B row 24 ("whatever the portals say is what AI repeats": Gemini cites the site).
- Neither run read integrity.md: the dispatch said "only these files". Brief now says rule files are always read.

13 of 14 caught, 12 with the right verdict. **Failed.** Seed 3 check by the CMO: query 1 has one Facebook reel at 1, authorized.company at 2, Real Talk Media at 3 and 5, so "Facebook reels ... lead" changes a count and compresses positions: a real but subtle miss. Brief tuned to v1.2: sweep 2 writes out the source row for each query and compares every noun and number (plural, counts, which positions "lead" covers); the verdict table now states that a claim about a partly read set is No source, never Unverifiable.

### Run 3, 2026-10-15 (agent file v1.2, fact-checker agent type, claude-opus-5-5)

Stage B: about 184 claims, 34 flagged. Stage C: 98 claims, 28 flagged. Both read integrity.md.

- All 14 seeds right: seed 3 Wrong (B row 25, positions matched one by one), seed 4 No source (B row 27), seed 6 No source (B row 1), seed 12 Unverifiable (B row 13); Stage C seeds 10 of 10.
- **One false Wrong:** B row 15 said 8 of 68 window captions carry ten or more hashtags; the CMO's Python count of instagram-posts gives 14, as the audit states. The agent has Read, Grep, and Glob only and recounted by Grep. Run 1 (with Python) had no count errors.
- New real finds checked by the CMO: B row 16 (the LinkedIn dataset post of 2025-11-15 does not carry "jimrealestate.com"; the gather pack and the audit are both wrong, and the primary wins), B row 19 (the audit pairs the all-post median of 25 with a window-only top three; on the all-post basis 167 is second), C row 15 (the $2M to $5M band is a CMO inference).

14 of 14, one false Wrong. **Failed on criterion 2.** Brief tuned to v1.3: a Wrong that rests on the fact-checker's own recount must list every counted item; otherwise Unverifiable, "recount needed".

### Run 4, 2026-10-15 (agent file v1.3, fact-checker agent type, claude-opus-5-5)

Stage B: 165 claims, 31 flagged. Stage C: 97 claims, 27 flagged. Both read integrity.md. Tables: `evals/fact-checker/2026-10-15-test/run-4-findings.md`.

| # | Expected | Returned | Right? |
|---|---|---|---|
| 1 | Wrong | Wrong (C 14) | Yes |
| 2 | Wrong | Wrong (C 4) | Yes |
| 3 | Wrong | Wrong (B 22) | Yes |
| 4 | No source | No source (B 24) | Yes |
| 5 | No source | No source (C 1) | Yes |
| 6 | No source | No source (B 1) | Yes |
| 7 | No source | No source (C 5) | Yes |
| 8 | No source | No source (C 22) | Yes |
| 9 | No source | No source (C 12) | Yes |
| 10 | No source | No source (C 15) | Yes |
| 11 | Unverifiable | Unverifiable (C 16) | Yes |
| 12 | Unverifiable | Unverifiable (B 13) | Yes |
| 13 | Unverifiable | Unverifiable (C 11) | Yes |
| 14 | Estimate as fact | Estimate as fact (C 19) | Yes |

False Wrongs: none the sources prove. The hashtag line from run 3 is no longer flagged. **One borderline verdict for Brett:** B row 14 marks Wrong "Ten captions describe Jim's marketing strategy in the third person" and lists 11 third-person captions; the CMO read all 11, and some (DcvnPnUiNUu, DbqFriAD3Jw) are third person but not about marketing strategy, so the audit's ten is a classification the source does not contradict. Better verdict: Estimate or opinion stated as fact. Also, the agent marked the hashtag count Supported while saying it could not finish the count; v1.3 says Unverifiable in that case. New real finds: B 11 (hidden-likes posts ranked in the bottom five), B 18 (0.18 per week is since the 2022 first upload, not channel life since 2013), B 29 (2 of 10 visible Zillow reviews are team reviews).

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every seeded claim | 3 | 14 of 14, all with the right verdict and the settling source. | 5 |
| 2. No false Wrong | 3 | None proven; one Wrong on a judgment count (B 14) that should have been Estimate. | 4 |
| 3. Cites what it checked | 2 | Every row names file and passage; recounts list post IDs. | 5 |
| 4. Never rewrites | 2 | All directions. | 5 |
| 5. Noise and format | 1 | Table, summary, log lines. One Supported where v1.3 says Unverifiable (hashtag count). | 4 |

Weighted 4.64, no criterion below 3, 14 of 14, no auto-fail. **Passed.** Brett (2026-10-16) ruled B row 14 a false Wrong on a judgment count and kept run 4 as a pass on the 14 seeds with the rule added: v1.4 says a count whose criterion is a judgment is never Wrong, only Estimate or opinion stated as fact. **Rated useful by Brett, 2026-10-16. The fact-checker is validated.** Caution: four runs tuned on one seed set. The brief changes are general rules, not seed-specific answers, but the first live run (blueprint-audit run 3) is the real test. New seeds come from what Brett catches there.

## Keeping this eval sharp

When Brett disagrees with a verdict or a score, fix this document, not that one score. Every claim Brett catches that the fact-checker marked Supported becomes a seed in the next version. Rerun the whole set on every model release.
