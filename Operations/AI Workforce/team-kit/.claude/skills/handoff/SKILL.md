---
name: handoff
description: "Writes the state of an unfinished session into the project MEMORY.md Session Plan so the next session (or a scheduled task) can start without scrolling back. Use when the user says 'handoff', 'hand off', 'save this for next time', 'I need to continue this in a new session', or when a session is hitting its limits. 'Resume' and 'pick up where we left off' are the opposite direction (reading the Session Plan at the start of a new thread) and do not trigger this skill. Do not use for a finished piece of work with nothing to continue (the session audit alone covers that), and do not use to summarize a thread for a person."
---

# Handoff

_Shared Core (team kit copy, scrubbed 2026-10-30)._

Source of truth: `.claude/skills/handoff/SKILL.md` in the Cowork OS. Adapted 2026-09-21 from Jeff Su's handoff template with one change: the output is written to a file, not pasted into a chat. the user's rule is that he never scrolls back, and a chat block is something to scroll back to.

## What to read first

1. Root `CLAUDE.md` and root `MEMORY.md`.
2. The active workstation `CLAUDE.md` and `MEMORY.md`.
3. The active project `CLAUDE.md` and `MEMORY.md`, if the session worked inside a project.
4. Every file modified this session.

If the session was compacted, use the summary and the modified-file list. Never invent context that is not in the thread or the files.

## Step 1: Run the session audit first

Run `session-audit` unless the user said "just the handoff". The audit writes back the durable things (rules, facts, decisions) so the handoff only has to carry what is still in flight.

## Step 2: Find what still lives only in this thread

- Decisions made this session that are not yet in a file.
- Questions asked and not answered, or answers still pending from the user.
- Proposals shown to the user and not yet approved (restated in full, per the never-scroll-back rule).
- Files created or modified, with paths.
- The exact next action, specific enough to start on without asking.

Leave out anything already safely in a `CLAUDE.md`, `MEMORY.md`, or resource file, except as a one-line pointer to where it is.

## Step 3: Write the Session Plan

Destination, in this order of preference:

1. The active project's `MEMORY.md`, in a section headed `## Session Plan`. Replace the previous Session Plan; do not stack them. The old one is in the file history if ever needed.
2. If there is no project, the active workstation's `MEMORY.md`, same section.
3. If the work was root-level (OS maintenance), root `MEMORY.md` under Active OS Projects, two sentences, then a Session Plan section in `00_Resources/` is not created; instead put the next action in the relevant row.

Use this structure inside the section:

```
## Session Plan

_Handoff written [date] by the handoff skill. Resume from here._

**Where this picks up:** [workstation and project]
**Status:** Continuation required | Follow-up needed | Clean break, with one sentence why
**Done this session:** [one to three bullets]
**Decided, not yet applied:** [bullets, or "none"]
**Waiting on the user:** [each open approval restated in full, or "none"]
**Files touched:** [paths, or "No files were modified."]
**Next action:** [one or two bullets, specific enough to start immediately]
```

Show the user the section before saving. He approves, edits, or skips. Then save and confirm the path.

## Step 4: Verify

- The next action can be executed without reading the old thread.
- Every path is complete.
- Every open approval is restated in full, not referenced by number.
- Nothing in the plan duplicates what the audit already wrote elsewhere.

## Constraints

- Only what was explicitly discussed. No inferred decisions, no padding, no narrative recap.
- One to two sentences per bullet.
- Do not reference tool calls or thread positions the next session cannot see. Translate them into files, decisions, and actions.
- The Session Plan is the one place in-flight state lives. Never also paste it into chat as a block.
- No em dashes.

## Edge cases

- **the user says "just the handoff":** skip the audit, and put suspected unwritten rules or facts under "Decided, not yet applied" so the next audit catches them.
- **Session ended mid-task:** status Continuation required; the first next-action bullet is the exact task to resume.
- **Task finished, follow-up elsewhere:** status Follow-up needed; name the owner or destination (an Asana task, a person, a date).
- **Clean closeout:** status Clean break; next action is one low-friction item or "No immediate action."
- **A scheduled task will resume the work:** say so in the Session Plan and make sure the task's prompt points at this section.


## Usage log

Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`: `YYYY-MM-DD | handoff | model that ran | one-line summary`. The systems registry page reads this to show when the skill last ran.
