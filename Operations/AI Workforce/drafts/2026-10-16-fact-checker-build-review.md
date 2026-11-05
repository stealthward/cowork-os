# Fact-checker build: files for review

_CMO, 2026-10-16. Every new or changed file from the fact-checker build, with the exact change. Personal Layer review note; the agent itself is tagged Shared Core candidate._

## New files

| File | What it is |
|---|---|
| `.claude/agents/fact-checker.md` | The worker (v1.4 after your row 14 ruling: a judgment count is never Wrong). Opus, Read/Grep/Glob, no web. Two sweeps (comparison words; every search position against the query table), then every claim. Five verdicts. One table out; never rewrites. |
| `Operations/AI Workforce/evals/fact-checker-eval.md` | Eval v1.0: pass bar, five criteria, the 14-seed set, run record for runs 1 to 4. |
| `Operations/AI Workforce/evals/fact-checker/2026-10-15-test/` | Seeded copies of the audit and Analysis, the two unchanged Stage C documents, and copies of the sources. The run folder was not edited. |
| `Operations/AI Workforce/evals/fact-checker/2026-10-15-test/run-4-findings.md` | Both run 4 tables, seeds marked. |
| `Operations/AI Workforce/logs/fact-checker-log.md` | The worker's log (written by the dispatching session). |

## Seeded test result

| Run | Agent file | Seeds right | False Wrongs | Result |
|---|---|---|---|---|
| 1 | v1.0 | 11 of 14 (missed 3 and 6; seed 4 wrong verdict) | 0 | Fail |
| 2 | v1.1 | 12 of 14 (missed 3; seed 4 wrong verdict) | 0 | Fail |
| 3 | v1.2 | 14 of 14 | 1 (hashtag recount by Grep: 8 against a true 14) | Fail |
| 4 | v1.3 | 14 of 14 | 0 proven; 1 borderline | Pass, pending your ruling, weighted 4.64 |

Borderline item (Stage B row 14): the audit says "Ten captions describe Jim's marketing strategy in the third person." The fact-checker marked it Wrong and listed 11 third-person captions. I read all 11: some (DcvnPnUiNUu, DbqFriAD3Jw) are third person but not about marketing strategy, so "ten" is a classification the source does not contradict. The better verdict was "estimate or opinion stated as fact."

What the brief changed between runs: the comparison and position sweeps; summary sections are checked on their own; a claim about a partly read set is No source; rule files are always read; a Wrong based on its own recount must list every item counted.

Beyond the seed: about 45 more real errors across both stages, mostly recomputed social counts and metric labels in the audit and claims about agents in general in the Analysis. They are still in the current run 2 documents.

## Changed files

**`.claude/skills/blueprint-audit/SKILL.md`**
- Model line: adds "and the fact-checker on opus."
- New block before the Stage B stop: dispatch the fact-checker on internal-brand-audit.md with gather-pack.md, portals.md, intake.md, ai-search/, social-pull/ as its only sources; the CMO fixes every row, re-runs once, sends anything still flagged to you as an open item; appends its log lines.
- Stage B stop: the return now includes "the fact-check result in one line (claims checked, flagged on the first run, open after the re-run)."
- New block before the Stage C return: dispatch the fact-checker on all three Stage C documents, with the fact-checked audit (derived source), manual-analysis.md, and the same primary sources; fix, re-run once, carry open items to you. "The writer's own QA does not replace this step."
- Stage C return: the QA line now includes the fact-check result.
- Logs: cmo-log records fact-check results per stage; the CMO appends the fact-checker's printed log lines.

**`.claude/skills/cmo/SKILL.md`**
- Description: "dispatches the copywriter, editor, fact-checker, and research-sidekick."
- Dispatch loop step 3 adds: "A draft that cites a figure then goes to the fact-checker with its sources; flagged rows go back to the copywriter once, and anything still open goes to Brett named."
- Workers: new 3a, fact-checker. It runs on every client-facing deliverable that states facts (every Branding Blueprint document; blueprint-audit at the end of Stage B and Stage C) and on every copywriter draft that cites a figure, after the editor. The CMO fixes, re-runs once, reports claims checked, flagged, and open. "A writer's own check never replaces it."

**`.claude/agents/editor.md`** (description only)
- Was: "to fact-check research briefs (the research-sidekick sources its own work)"
- Now: "to fact-check a deliverable against its sources (that is the fact-checker, .claude/agents/fact-checker.md)"

**`Operations/AI Workforce/systems-registry.md`**
- New row: fact-checker (Agent, opus, None (OS files only), Reports to CMO, Shared Core candidate, status with the run 4 result).
- cmo row: description and workers list name the fact-checker.
- Page re-rendered and republished: https://claude.ai/artifact/UPN37pzpwruFFJhFzr8Kr4 (version 44).

**Logs and memory (appended):** `logs/cmo-log.md` (build entry), `logs/usage-log.md` (eight fact-checker lines, one cmo line), `memory/cmo-memory.md` (one entry: a writer's own check is not a fact-check).

## Asana

Subtask "Review the fact-checker worker build" under "2 of 6: blueprint-audit skill" (AI Workforce, CMO section): Lead Brett, 20m, unassigned and undated like its siblings. https://app.asana.com/1/459051476492004/project/459051478393766/task/1219567014420802. It is completed only on your approval.
