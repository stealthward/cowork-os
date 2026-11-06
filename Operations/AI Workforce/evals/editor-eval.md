# Eval: editor

**What good looks like before the editor's grade is trusted.**

**Owner:** Brett Ward
**Used by:** Brett, on the editor's grades of the first ten copywriter pieces and on the seeded set below
**Version:** 1.1, 2026-11-03 (worker review: control rebuilt on current rules, real-piece set, promotion rule scoped to rules on file, rerun on rule changes, tokens logged; Brett, 2026-11-03)
**Pass bar:** every seeded miss caught (six seeds), zero false fixes on the clean control draft, every real-piece case returned FIX for its logged reason, weighted score 4.0 or higher, no criterion below 3

## How to score

Score each criterion 1 to 5. Write the reasoning first, then the number. Score the grade the editor returned, not the draft it graded.

## Criteria

**1. Catches every rule miss (weight 3)**
A 5: every seeded miss is on the fix list with its checklist number and the quoted line. A 1: a seeded miss passed.

**2. Never rewrites (weight 2)**
A 5: every fix is a direction ("drop the em dash after 'volume'"), never a replacement sentence. A 1: the editor returned rewritten copy.

**3. Says what it could not check (weight 2)**
A 5: every claim without a source is under "Could not check," and nothing unsourced was graded as a fact. A 1: an unsourced claim was passed or failed as if verified.

**4. Passes a clean draft clean (weight 2)**
A 5: the control draft returns PASS with an empty fix list. A 1: the editor invented a fix on clean copy.

**5. Speed and format (weight 1)**
A 5: PASS or FIX, fix list, "Could not check," then only the log and usage lines the agent file requires, in under a minute on sonnet (90 seconds when the source includes a transcript). A 1: prose commentary, praise, or a rewrite.

## The seeded set (run before the first real grade)

One control draft with no misses, and five drafts with one seeded miss each:

| # | Seeded miss | Checklist item | Caught? |
|---|---|---|---|
| 1 | One em dash in the second sentence | 2 | Yes, 2026-10-02 (draft-d: item 2, quoted line) |
| 2 | "Fifteen years in escrow" | 4 | Yes, 2026-10-02 (draft-f: item 4, quoted line) |
| 3 | "Our partners get a revenue share on every file" | 5 | Yes, 2026-10-02 (draft-a: item 5, quoted line) |
| 4 | A post addressed to "every agent in San Diego" that also pitches the $50M+ partner conversation | 6 | Yes, 2026-10-02 (draft-e: item 6 on the $50M+ close, plus item 5 twice) |
| 5 | A figure (escrow count) not in the profile or the source | 7 | Yes, 2026-10-02 (draft-c: item 7, quoted line, also under Could not check) |
| Control | None | | PASS, 0 fixes, 2026-10-02 (draft-b); control v2 PASS, 0 fixes, 2026-10-06 (draft-g, frameworks footer); control v5 PASS, 0 fixes, 2026-10-06 (draft-m, item 10 with Benchmark line) |
| 6 | A headline that promises three items when the body delivers one | 10 | Yes, 2026-10-06 rerun (draft-h: item 10 citing 4.5 and 4.6, quoted line, on the item-10 definition); again on control v4 (draft-l, run 5) and v5 (draft-n, run 6) |

## Run record

### Run 1, 2026-10-02 (CMO run 1, editor on claude-sonnet-5-5)

Drafts: `evals/seeded-set/2026-10-02/`. One LinkedIn text post (source: content-frameworks.md, REACH "Good Content, Defined"; avatar: persona 2) written clean as the control; each seeded draft is the control plus its one seed and nothing else. Each went to its own editor run with no mention of a seed or this key, under a neutral ID. Key: draft-a seed 3, draft-b control, draft-c seed 5, draft-d seed 1, draft-e seed 4, draft-f seed 2. Full grades: `evals/seeded-set/2026-10-02/grades.md`.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | All five seeds on the fix list with the right checklist number and the quoted line. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction. One soft spot: draft-e suggested a "Real Talk value exchange" close as an alternative, which would itself pitch in give-first content. | 4 |
| 3. Says what it could not check | 2 | Nothing unsourced was graded as fact, and the 1,100 figure went under Could not check. Identical control lines were handled inconsistently: draft-d listed "a handful of people" and "the lesson keeps repeating" as could-not-check; the control and draft-f runs listed none. | 4 |
| 4. Passes a clean draft clean | 2 | Control returned PASS with an empty fix list. | 5 |
| 5. Speed and format | 1 | 14 to 24 seconds per run on sonnet. Every run added a "checks that pass" summary beyond the format, and draft-a used bold headers; no praise, no rewrite. | 3 |

Weighted score 4.4. Seeded misses 5 of 5, zero false fixes on the control, no criterion below 3, no auto-fail. **Passed. Brett rated the run useful on 2026-10-02; the editor is validated and CMO drafts no longer carry the "editor not yet validated" label.** No promotion (no miss). Two checklist tunes applied to .claude/agents/editor.md on Brett's go (2026-10-02): output held to its three parts (no "checks that pass" summary), and illustrative examples never listed under Could not check (checklist item 7).

### Run 2, 2026-10-06 (framework seed, CMO frameworks load step 5)

Drafts and grades: `evals/seeded-set/2026-10-06/`. Seed 6 caught and control v2 clean, but provisional: agent definitions load at session start, so both runs graded on checklist items 1 to 9 and named the gap. Rerun draft-g and draft-h in a fresh session before copywriter piece 1.

### Run 3, 2026-10-06 (framework seed rerun, fresh session, editor on sonnet with checklist item 10)

Same drafts as run 2, graded blind under their neutral IDs. draft-g PASS, 0 fixes, could not check none (15 s). draft-h FIX, 6 fixes (20 s): seed 6 caught as fix 1 (item 10, 4.5 and 4.6); fixes 2, 3, and the command half of 5 follow from the seeded line. Grades: `evals/seeded-set/2026-10-06/grades.md`.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | Seed on the fix list with item 10, the framework sections, and the quoted line. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction. | 5 |
| 3. Says what it could not check | 2 | draft-h listed "small slice of who sees your content" as could not check; the identical line passed unlisted in draft-g. Same line, two treatments. | 4 |
| 4. Passes a clean draft clean | 2 | Control PASS, empty fix list. | 5 |
| 5. Speed and format | 1 | Three parts only, no summary, no headers, under 30 seconds. | 5 |

Weighted score 4.8. Seed caught, zero fixes on the control, no auto-fail. **Passed; run 2's provisional label is cleared.** Open for Brett: draft-h also fixed three lines identical to the clean control (fix 4, Far Past claim is generic; the "The question I keep coming back to is simple" lead-in in fix 5; fix 6, the closing paragraph repeats "before anyone needs you"). Either the control is not clean under item 10 or the seeded run over-fixed; Brett's call decides whether control v2 is revised or the checklist is tuned. Brett chose revise (2026-10-06).

### Run 4, 2026-10-06 (control v3)

draft-i (control v3) FIX, 2 fixes: no benchmark piece in the footer (4.4) and no real "How I" moment (8.1). draft-j (seed 6 on v3) FIX, 4 fixes, seed caught. Both fixes on the control are fair: v3 cannot be clean without a real Brett moment the files do not hold. The 4.4 benchmark gap passed unflagged on v2 twice and on draft-j, so that check fires inconsistently. No control is clean under item 10 yet; awaiting Brett's story and the benchmark ruling.

### Run 5, 2026-10-06 (control v4, fresh session, Benchmark line in item 10)

draft-k (control v4) FIX, 1 fix: the trust paragraph drops Brett's hedge ("tend to trust") and swaps "standard" for "norm" (item 7, the footer's Check first). draft-l (seed 6 on v4) FIX, 6 fixes, seed caught as fix 1 (item 10, 4.3, 4.5, 4.6). Both runs listed the Tom Ferry benchmark figures under Could not check, the same way. The 4.4 benchmark check now fires on a filled line without a false fix. Grades: `evals/seeded-set/2026-10-06/grades.md`.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | Seed on the fix list with item 10, the framework sections, and the quoted line. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction; restoring Brett's own words is a pointer to the source, not new copy. | 5 |
| 3. Says what it could not check | 2 | Benchmark figures listed identically on both runs; nothing unsourced graded as fact. | 5 |
| 4. Passes a clean draft clean | 2 | The control fix is fair (a real deviation from Brett's verbatim statement), so it is not a false fix, but the control is not clean. draft-l added a one-principle fix (section 2) on a paragraph identical in the passed control. | 4 |
| 5. Speed and format | 1 | 25 and 31 seconds. draft-l appended a work log and usage line beyond the three parts. | 4 |

Weighted score 4.7. Seed caught, no false fix, no auto-fail. Editor passes on the item-10 definition with the Benchmark rule. Control v4 not yet clean: one wording fix (Brett's call), and the one-principle check fires inconsistently on the trust paragraph.

### Run 6, 2026-10-06 (control v5)

Control v5 on Brett's ruling: "standard" restored, "they trust" kept without the hedge (ruling noted in the trust source file). draft-m (control v5) PASS, 0 fixes. draft-n (seed 6 on v5) FIX, 4 fixes, seed caught as fix 1 (item 10, 4.3, 4.5, 4.6); every fix falls on or follows from the seeded line, no spillover onto control lines. Grades: `evals/seeded-set/2026-10-06/grades.md`.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | Seed on the fix list with item 10, the framework sections, and the quoted line. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction. | 5 |
| 3. Says what it could not check | 2 | Benchmark figures listed on both runs. The control also listed "Most agents post for the people who are buying or selling right now", a general observation, not a factual claim (Brett, 2026-10-06): noise, not a miss. | 4 |
| 4. Passes a clean draft clean | 2 | Control PASS, empty fix list. | 5 |
| 5. Speed and format | 1 | 26 and 28 seconds. Both runs appended log and usage lines beyond the three parts (no write tools). | 4 |

Weighted score 4.7 (rescored from 4.9 on Brett's correction to criterion 3; checklist item 7 tuned on his go, 2026-10-06). **Passed. Control v5 is the first control clean under item 10 with a filled Benchmark line; the framework seed is closed.**

## The real-piece set (v1.1)

Real pieces the editor passed and Brett rejected, kept once the rule that covers them is written. Each is graded blind with its original source and must return FIX for the logged reason.

| # | Piece | Editor PASS | Brett's reason | Rule now on file | Required catch |
|---|---|---|---|---|---|
| R1 | Reel narrative 9 caption v2 (Factory Ep 3 R12): evals/seeded-set/2026-11-03/draft-v.md, source drafts/2026-10-29-reel-narrative-9-source.md | 2026-10-29 | "Trying to force the answers given to your questions" (interview answers slotted into beats) | content-frameworks.md section 2 map row "LinkedIn post, Factory reel narrative" (2026-10-30) | Checklist 10 or 1: the answers are slotted into beats or the caption collects several points |

### Run 7, 2026-11-03 (worker review 1 of 3, editor on sonnet; opus on the control and R1 for comparison)

Seeds 1 to 5 rebuilt on control v5, one seed each (diff checked); seed 6 is the 2026-10-06 draft-n; R1 added. Blind neutral IDs, key and grades in `evals/seeded-set/2026-11-03/`.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | Six of six seeds with the checklist number and the quoted line; R1 returned FIX citing the slotted-beats rule. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction. | 5 |
| 3. Says what it could not check | 2 | 1,100 figure listed correctly; the Tom Ferry benchmark figures listed on six of seven sonnet drafts but not the control, on an identical line. | 4 |
| 4. Passes a clean draft clean | 2 | Control v5 FIX 5 (opus FIX 3): contractions (10/13), bold kept in the draft (10/19), 4.3a footer line (10/28), one or two sentences per paragraph (10/29), 4.2 category. Each fix is backed by a rule added after 10/06, so none is false, but no clean control existed. | 4 |
| 5. Speed and format | 1 | 27 to 69 seconds; log lines appended (agent file asks for them); two runs bolded the grade. | 4 |

Weighted score 4.5. Passed, no auto-fail. Cost: 55,486 tokens per sonnet grade, 56,471 on opus (labeled calculation at model-selection.md rates: $0.11 to $0.55 per sonnet grade, $0.28 to $1.41 on opus; about 3.6 grades per real piece). Opus caught three extra items on R1 and two fewer on the control: no case for the tier. **Decision (Brett, 2026-11-03): keep on sonnet, fix the eval (v1.1); the 10/29 R1 pass is logged as a rule gap, not a model miss.**

## Automatic fails

- A seeded miss passed
- Rewritten copy returned
- A fix invented on the control draft

## Promotion rule

The first miss Brett catches that the editor passed on a real piece is logged here with the date and the line, and the editor's model tier moves from sonnet to opus (decision 2026-09-17, confirmed 2026-09-21). The registry row and the agent file change in the same session.

A miss means the editor passed a line that broke a rule on file when it graded. When no rule covered it, that is a rule gap: write the rule, add the piece to the real-piece set, and rerun; the tier does not move (Brett, 2026-11-03).

| Date | Piece and line | Miss or rule gap | Action |
|---|---|---|---|
| 2026-10-29 | Reel narrative 9 caption v2, body built from the Q3, Q2, Q1 answers | Rule gap (the map row rule was written 2026-10-30) | R1 added; sonnet returned FIX on it 2026-11-03 |

## Keeping this eval sharp

When Brett disagrees with a grade, fix this document and the editor's checklist, not that one grade. Rerun the seeded set and the real-piece set on every model release and whenever voice-principles.md or content-frameworks.md changes a rule the checklist grades; first bring the control up to the new rule so it stays clean. The dispatching session records tokens from each Agent result on the usage line and in the run table.

### Run 8, 2026-11-03 (control v6, seeds rebuilt on it, editor on sonnet)

Control v6 (evals/seeded-set/2026-11-03/control-v6.md) brings v5 up to the 10/13 to 10/29 rules; seeds in `evals/seeded-set/2026-11-03/v6/`. Control v6 PASS, 0 fixes, benchmark figures under Could not check. Six of six seeds caught with the checklist number and the quoted line.

| Criterion | Weight | Reasoning | Score |
|---|---|---|---|
| 1. Catches every rule miss | 3 | Six of six; R1 caught in run 7 on the same rules. | 5 |
| 2. Never rewrites | 2 | Every fix is a direction. | 5 |
| 3. Says what it could not check | 2 | Benchmark figures listed on six of seven runs (draft-ee omitted them); draft-aa also listed two unsourced Five Star claims, correctly. | 4 |
| 4. Passes a clean draft clean | 2 | Control PASS, empty fix list. Three seeded runs fixed two control lines the control run passed ("Post for them" as a command; the "standard" sentence). | 4 |
| 5. Speed and format | 1 | 36 to 49 seconds, one run 77 seconds; log lines as the agent file asks; one run bolded the grade. | 4 |

Weighted score 4.5. **Passed. Control v6 is the current clean control.** Before run 9, revise the two spillover lines into control v7 and rerun.
