---
name: session-audit
description: "End-of-session write-back for the Cowork OS. Finds corrections, stated preferences, decisions, and new facts that live only in this thread, runs each through three gates, prunes before it adds, and checks root MEMORY.md against its 150-line ceiling. Use when Brett says 'audit this session', 'audit this thread', 'session audit', 'wrap up', 'before we close', or 'what did we miss'. The handoff skill runs this first, so 'handoff' alone also triggers it. Do not use mid-task, for a pure question-and-answer session, or when Brett asks for a handoff without an audit (that is the handoff skill)."
---

# Session Audit

_Shared Core, scrub before kit (2026-10-14; see Operations/AI Workforce/drafts/2026-10-14-shared-core-split.md)._

Source of truth: `.claude/skills/session-audit/SKILL.md` in the Cowork OS. The copy installed on the claude.ai account is a deployment of this file. Adapted 2026-09-21 from Brett's original starter audit plus three pieces of Jeff Su's session-audit template (the materiality gate, the pruning pass, the memory line check). Nothing in this skill writes to a file without Brett's approval.

## What to read first

1. Root `CLAUDE.md` and root `MEMORY.md`, if not already in context.
2. Every workstation or project `CLAUDE.md` and `MEMORY.md` touched this session.
3. `00_Resources/users-guide.md`, section Audit Best Practices, for the standard: a healthy audit comes back nearly empty.

If the session was compacted, work from the summary, the modified-file list, and what remains of the transcript. Say plainly when something discussed before compaction cannot be verified.

## Step 1: Scan the thread for candidates

Look only for these four kinds of signal:

- **Corrections.** Brett changed, rejected, or redirected something Claude did.
- **Directives.** "Always", "never", "from now on", "add a rule", "remember this".
- **Decisions.** A choice Brett made that a future session would otherwise have to re-ask.
- **New facts.** A contact, a date, a status, a tool, a link that changes what the next session does.

Everything Brett said "remember this" or "add a rule" about should already be on disk. Check that it is. If it is not, that is the first finding.

## Step 2: Run every candidate through three gates

A candidate is not a finding until it clears all three.

1. **Already covered?** Search the loaded files for a rule or entry that carries the same principle. If one exists, decide whether it was applied, under-applied, weakly worded, duplicated, misplaced, stale, or in conflict. "Already written" only counts when the entry is current and specific enough to change behavior.
2. **Material?** Name the concrete cost of not writing it: what a future session would do wrong, and what that costs Brett in time, money, or trust. If the cost cannot be named in one sentence, drop the candidate.
3. **Where, and is it ripe?** Behavior ("always", "never", "before X do Y") goes to the relevant `CLAUDE.md`. Facts that can change (status, contacts, decisions) go to the relevant `MEMORY.md`. Working ideas go to the project file where the work happens. A one-off craft preference (how Brett reworded one draft) is not ripe: note it once in the project MEMORY.md and promote it only if it happens again.

## Step 3: Prune before you add

For every file the session touched, look for a Delete, Replace, or Tighten before proposing an Add:

- Two entries that say the same thing: keep the sharper one.
- A rule superseded by a decision this session: rewrite it, do not stack a new one beside it.
- A memory entry about something finished: move it to `ARCHIVE.md`.
- A rule sitting in the wrong file (a behavior rule in MEMORY.md, a project fact in root): move it and leave a one-line pointer at the old spot.

Every reduction names where the behavior now lives, or why it is no longer needed. Never prune a decision, a source pointer, or a rationale as cleanup.

## Step 4: Check root MEMORY.md against the ceiling

Count the lines. The ceiling is 150 (root `CLAUDE.md`, Memory section). If over: enforce two sentences per entry, move completed or outdated entries to `ARCHIVE.md`, and if still over, propose which entries to compress. Report the count either way.

## Step 5: Present findings and wait

Lead with one line: `Session was clean. No findings.` or `[N] findings need your call.`

Then number every finding:

**[N]. [The change, stated as the conclusion]**
- **Why:** the concrete cost of not doing it, one sentence.
- **Where:** exact file and section.
- **Proposed text:** the exact wording, ready to approve or edit.

Group prunes (delete, replace, tighten, move) before adds. Brett approves, edits, or skips each by number. Apply only what he approves, then confirm what changed and where.

## Constraints

- Never write to a file without approval. There is no approval-exempt category in this OS.
- Do not maximize capture. The audit protects future sessions; it does not turn every detail into a rule.
- Do not propose tracker or Asana updates without reading the live source first.
- Do not create new files during an audit. Propose them as a finding.
- Do not run on "wrap up" if Brett is clearly mid-task; ask whether he means close out.
- No em dashes in anything written to a file.

## Edge cases

- **Compacted session:** flag likely uncodified items that cannot be verified, rather than guessing.
- **No findings:** say so, then list the exact next action for the next session in one line.
- **Brett asked for a handoff:** run this first unless he said "just the handoff", then hand to the handoff skill.


## Usage log

Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`: `YYYY-MM-DD | session-audit | model that ran | one-line summary`. The systems registry page reads this to show when the skill last ran.
