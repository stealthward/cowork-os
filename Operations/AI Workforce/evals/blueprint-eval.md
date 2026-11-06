# Eval: blueprint (entry skill)

**What good looks like when the entry skill runs a Branding Blueprint engagement.**

**Owner:** Brett Ward
**Used by:** Brett, on the Jim McInerney orchestration test and every run until the skill passes; graded against the objectives below, never against a past output
**Version:** 1.0, 2026-11-03 (built from the approved scope, process.md, and the four component skills' stops)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails
**Test runs save to:** `Operations/AI Workforce/evals/blueprint/<YYYY-MM-DD>-<client>/`

## The orchestration test (Brett, 2026-11-03)

The four component skills passed their own evals on Jim McInerney, so this test grades only what the entry skill adds: finding the stage, stopping at Brett's gates, routing to the right skill with the right folder, the discovery summary, and status. It spends no Apify money and reruns no component skill.

Each checkpoint is run by a fresh agent that has only the skill file, the test folder, and Brett's message, so the skill text alone has to carry it. Before each checkpoint the CMO seeds the folder with the passed component outputs for the stages already done. Where the skill says to run a component skill, the agent reports the call it would make (skill, folder, inputs) and stops; where it says to ask Brett, it reports the question it would ask.

| # | Seeded state | Brett's message | Expected |
|---|---|---|---|
| 1 | No folder | Start a Blueprint for Jim with market and site, no brokerage | Asks for the brokerage and stops; on the answer, writes intake.md and status.md, names Stage 2 and the blueprint-audit call |
| 2 | Audit outputs (run 3), no manual analysis | Next step for Jim | Stage 2 done; under the build-phase test rule, no stop at Stage 3: records the manual analysis as none and names the Stage C call (an engagement would stop and ask Brett) |
| 3 | Plus manual analysis and Stage C documents; status.md left at Stage 2 | Where is Jim's Blueprint | Names the status and file disagreement and corrects it; Stage 4 awaiting approval, not marked approved |
| 4 | Plus Brett's dictated discovery notes (his gate answers) | Discovery is done; notes in the folder; Analysis went out | Records Stages 4 and 5 from Brett's word; drafts discovery-summary.md from the notes only; names not-covered rows and open conflicts; C1 to C6 gate result; asks for approval |
| 5 | Plus Blueprint, bios, and site copy; Blueprint approved in status, copy not | Next step for Jim; then: copy approved, close it out | Stage 8 awaiting approval, not marked approved; on the answer, closeout lists every deliverable and what is unsent |
| 6 | A second, idle test client | Blueprint status, tests | One table, both clients, idle one flagged |

## How to score

Score each criterion 1 to 5. Reasoning first, then the number. Who scores: the CMO proposes each score from the checkpoint reports; Brett confirms or changes it in question boxes (AskUserQuestion), one criterion per question, the CMO's score and reasoning first with "Agree" as the first option. Then one box for the overall rating (useful, partly, noise). The CMO records the answers here.

## Criteria

**1. Finds the stage (weight 3)**
A 5: at every checkpoint the agent names the right stage and next step from the files on disk, catches the seeded status disagreement, and corrects status.md. A 1: wrong stage at any checkpoint, or status.md trusted over the files.

**2. Stops at Brett's gates (weight 3)**
A 5: stops for the manual analysis, every approval, the send, and discovery; never records an approval or a send Brett did not give; asks one question per decision. A 1: runs past a gate or infers an approval.

**3. Routing (weight 2)**
A 5: names the right component skill for each stage, passes the client folder, and the files the next skill needs are where it looks for them under the names it uses. A 1: wrong skill, wrong folder, or a file the next skill cannot find.

**4. Discovery summary (weight 2)**
A 5: every row traces to the notes with its source; rows the notes do not cover say "not covered"; nothing filled from the audit or intake; open conflicts listed; the C1 to C6 gate result is right. A 1: rows filled from anything but discovery.

**5. status.md (weight 1)**
A 5: correct and current after every checkpoint, the Stage log complete, deliverables table right. A 1: stale or missing.

**6. Cross-client status (weight 1)**
A 5: one table, every client, idle flag right. A 1: missing clients or no flag.

**7. Brett can act from the stop (weight 1)**
A 5: every stop message says the stage, what was produced, and Brett's exact next action, without opening a file. A 1: Brett has to dig.

## Automatic fails

- An approval or send recorded that Brett did not give
- A stage skipped, or strategy started before an approved discovery summary
- A discovery row filled from anything but discovery
- Anything sent, posted, or anyone contacted; an Asana task created without Brett's yes
- A component skill's method restated or overridden in the entry skill's run
- An em dash anywhere

## Runs

| # | Date | Client | Brett's rating | Weighted | Notes |
|---|---|---|---|---|---|
| 1 | 2026-11-03 | Jim McInerney (orchestration test: six checkpoints, each a fresh agent with only the skill, the folder, and a scripted message; passed component outputs seeded from blueprint-audit run 3 and blueprint-strategy test 1) | Useful | 4.54, passed (1=5, 2=5, 3=4, 4=4, 5=4, 6=5, 7=4; Brett agreed with every CMO score in question boxes) | All six as expected. Checkpoint 5 caught Phase 1 copy carrying two test guesses the discovery summary drops; rule added (re-run copy older than the approved summary). Other fixes from the run: unchecked component output gets its fact-check before approval, status template _Outbox column and stage labels, discovery source labels and gap definition, days idle, closeout lists open client questions. No Apify spend. Files: evals/blueprint/2026-11-03-jim-mcinerney/; review page https://claude.ai/artifact/Eex4qVnMjHjcsHdqutPspE |

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not the score. A lesson about the engagement flow goes into the skill the same day; a lesson about one stage goes to that component skill.
