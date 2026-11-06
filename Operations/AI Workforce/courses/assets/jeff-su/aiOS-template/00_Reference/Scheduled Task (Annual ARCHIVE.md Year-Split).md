# Scheduled Task (Annual ARCHIVE.md Year-Split)

_A once-a-year scheduled-task example for moving prior-year changelog entries out of the active `ARCHIVE.md` and into `ARCHIVE-[year].md`. Use it as the simplest direct-execution model; it does not delete history or decide what should be archived._

---

## Setup

**Cadence:** Annually, on January 1.

**Execution mode:** Direct execution. It performs the move autonomously and reports what it did.

To install, open the scheduled-tasks interface, create a new task, set the name and description fields, and paste the prompt body below (starting at `## Context Loading`) into the prompt.

---

## Prompt

```markdown
## Context Loading

Discover the workspace root dynamically rather than hardcoding a path.

Read these files before proceeding:
1. `ARCHIVE.md` - the living changelog this task splits (at the workspace root)
2. `00_Reference/Memory System.md` - the Workspace Changelog convention and archiving rules
3. `00_Reference/File Creation Rules.md` - confirms where the year-split file is allowed to live

This list is the floor, not the ceiling: triggered reads from root CLAUDE.md
still fire mid-run.

## Role and Scope

Once-a-year split of `ARCHIVE.md`. Direct execution: it moves the prior year's
changelog entries into a dated year file and reports the result, without asking first,
because the operation is routine and reversible (entries are moved, not deleted). Touches
only `ARCHIVE.md` and the new `ARCHIVE-[year].md`. Does not touch root `CLAUDE.md`, root
`MEMORY.md`, any workstation file, or any `00_Reference/` file.

## Steps

1. Determine the prior year. The task runs on January 1, so the prior year is the calendar year that just ended. Confirm `ARCHIVE.md` loaded; if it is missing or empty, report that and stop (nothing to split).
2. Identify all changelog entries in `ARCHIVE.md` dated in the prior year. The changelog is organized by month and week per the Memory System convention; select every entry whose date falls in the prior year.
3. If a `ARCHIVE-[prior-year].md` file already exists, append to it rather than overwriting. Otherwise create it at the workspace root with a one-line header naming the year it covers.
4. Move the prior-year entries: copy them into `ARCHIVE-[prior-year].md` in the same month-and-week order, then verify the copy landed in full before removing them from `ARCHIVE.md`. Never delete from the source until the destination is confirmed written.
5. Leave current-year entries (and any undated standing notes) in `ARCHIVE.md` untouched.
6. Report what moved.

## Output Format

This task does not surface findings; it reports a completed action. Output a short
confirmation block:

- **Year split:** [prior year]
- **Entries moved:** [count]
- **Destination:** `ARCHIVE-[prior-year].md` (created new, or appended to existing)
- **Remaining in ARCHIVE.md:** [count of current-year and standing entries left in place]
- **Verification:** Confirm the destination entry count plus the remaining count equals the original total before the split.

If there were no prior-year entries to move, say so and report that no file was created.

## Constraints

- Never hardcode a session-specific path; discover the workspace root at run time.
- Move, never delete: copy entries to the destination and verify before removing them from `ARCHIVE.md`. A failed or partial write must leave `ARCHIVE.md` intact.
- Touch only `ARCHIVE.md` and the `ARCHIVE-[year].md` file. Do not edit any other file.
- Preserve entry text verbatim, including the month-and-week structure. This is a relocation, not a rewrite.
- If the count check in the verification step does not reconcile, do not finalize: report the discrepancy and leave `ARCHIVE.md` unchanged.
```

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
