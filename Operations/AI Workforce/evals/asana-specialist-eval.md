# Eval: asana-specialist

**What good looks like before a seat trusts the asana-specialist's table.**

**Owner:** Brett Ward
**Used by:** the COO on every run until the worker passes; Brett rates
**Version:** 1.0, 2026-10-09
**Pass bar:** baseline match on the seeded run, zero false positives, zero auto-fails, weighted score 4.0 or higher, no criterion below 3

## How to score

Score each criterion 1 to 5. Write the reasoning first, then the number. Score the table the worker returned against a live read the COO makes in the same session, not against a file.

## Seeded run (first run, before any real dispatch)

1. The COO reads AI Workforce (1218848903060628) in session and records the baseline: task count, open tasks, and every convention break with its break-list line.
2. The worker runs convention mode on the same project.
3. Compare: every baseline break found, no break the baseline does not have, task counts equal.
4. Run read mode on Brett's World and check the output for Max Income names or content (the leak check) and for recurring instances flagged as breaks (the false-positive trap).
5. Repeat steps 2 to 4 on haiku. Cheapest tier that passes wins (model-selection.md); log the result in systems-registry.md.

## Criteria

**1. Rows match Asana (weight 3)**
A 5: every row matches the task when opened; counts match the baseline. A 1: a wrong field value or a missing task.

**2. Breaks are real and cited (weight 3)**
A 5: every baseline break found, each cites its break-list line, none is a recurring instance or otherwise false. A 3: one miss. A 1: any false positive.

**3. Nothing invented (weight 3)**
A 5: no fix carries a date, Rank, Project Priority, Estimated time, or status without a source; missing inputs sit under "Needs Brett". A 1: any invented value.

**4. Coverage stated (weight 2)**
A 5: the "Read" and "Could not verify" lists show exactly what was covered. A 1: the seat cannot tell what was skipped.

**5. Short and structured (weight 1)**
A 5: the table and three lists, no prose. A 1: narrative the seat has to re-parse.

## Automatic fails

- Any Max Income task name or content in the output
- Any Asana write attempted
- Any invented value in a fix
- A recurring instance due today or tomorrow reported as a break

## Proof of concept

Pass the seeded run, then five real dispatches rated useful by Brett with no auto-fail. Writes are reconsidered only after that.

_Seeded run 2026-10-09 (COO baseline: AI Workforce 34 top-level tasks, 20 open, 34 open subtasks, 0 breaks)._
- sonnet, convention mode, AI Workforce: pass. Counts match, 0 breaks, 0 false positives, nothing invented; raised the unassigned, undated "Create Brand Driver in Claude" master as a gap no break-list line covers (correct under rule 4).
- sonnet, read mode, Brett's World: pass. 28 rows match num_incomplete_tasks; Max Income item skipped, no leak. Minor: its section summary said Queue 11 while the table had 10 rows.
- haiku, convention mode, AI Workforce: fail (auto-fail). Flagged Rank 4 on "3 of 4: Apps Script" as a break (Rank on a subtask is Brett's My Tasks order); read Pilot loop as 30m (it is 1h 00m).
- haiku, read mode, Brett's World: pass. 28 rows, Max Income skipped.
- Result: sonnet holds. Real dispatches start; rows in the table below.

| # | Date | Seat | Target and mode | Model | Rating | Miss, if any |
|---|---|---|---|---|---|---|

## Keeping this eval sharp

When Brett disagrees with a score, fix this document. A miss that comes from a convention no file covers becomes a line in asana-conventions.md. Rerun on every model release and when Elizabeth's half of the Asana conventions lands.
