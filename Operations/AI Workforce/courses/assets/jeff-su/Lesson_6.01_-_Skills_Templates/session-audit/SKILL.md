---
name: session-audit
description: "End-of-session audit that checks for uncodified principles, reviews the quality of rules written during the session, cleans up leftover artifacts, and syncs progress trackers across your workspace. Use this skill whenever you say 'audit this session,' 'session audit,' 'wrap up,' 'before we wrap,' 'end of session check,' '1% improvement,' or 'what did we miss.' Also trigger when you say 'let's close out' at the end of a working session (not mid-task). This is a housekeeping skill that should run at the end of every substantive session."
---

# Session Audit

## Context Loading

Read these files to understand what is already written down:

1. Root `CLAUDE.md`, if not already in context.
2. Root `MEMORY.md`.
3. Any workstation `CLAUDE.md` and `MEMORY.md` files used during the session.
4. Any project `CLAUDE.md`, project `MEMORY.md`, or resource files materially used during the session.
5. `00_Reference/Governance Rules - Codification.md` for rule placement, reduction, and memory routing checks.
6. `00_Reference/Governance Rules - Verification.md` for fetch-first and tracker verification rules.
7. `00_Reference/Governance Rules - Communication.md` and `00_Reference/Voice Principles.md` before presenting findings.
8. `00_Reference/Memory System.md` before writing a Workspace Changelog entry or checking root `MEMORY.md` size.
9. `00_Reference/Scheduled Task Conventions.md` and `00_Reference/Skill Conventions.md` before surfacing any scheduled-task or skill update.

For compacted or very long sessions, work from what is available: the compaction summary, files modified, and the remaining transcript. The audit's role is verification, not rediscovery. The primary safety net is immediate codification during the session. If principles were discussed before compaction but are not reflected in any file, flag this explicitly so you can fill the gap.

## Workflow

### Phase 1: Scan the Conversation

Check five categories.

**A. Uncodified principles.** Scan only for corrections and explicit directives such as "always," "never," "from now on," or "I prefer." Positive reinforcement, process reactions, handoff notes, and new references should have been captured in the moment during the session, not re-litigated here.

Treat each as a candidate, not a finding. A correction is a signal that a rule might be worth writing, not proof that it is. Run every candidate through three gates:

1. **Existing coverage and disposition:** Search loaded files for a rule covering the same principle. If one exists, classify whether it was correctly covered and applied, covered but under-applied, weakly worded, duplicated, misplaced, stale, or conflicting. Written once in the right place is done only when the entry is current, visible, and operationally sufficient.
2. **Materiality:** Apply the cost-benefit check in `Governance Rules - Codification.md` > Writing a good rule. Name the concrete cost of not changing the instruction surface. If you cannot name the cost, drop the candidate.
3. **Routing and ripeness:** Apply the `CLAUDE.md` vs `MEMORY.md` tests. Prescriptive language routes to a `CLAUDE.md` or reference file; changeable facts route to `MEMORY.md`; ideas route to the project, database, or working surface where the work happens. Single-instance content-craft signals stage silently to an existing calibration or examples file when one exists. A staged signal becomes Input Needed only when the destination's promotion bar is met.

A candidate that clears all three gates and is ripe for a permanent home becomes an Input Needed finding, framed as a rule with reasoning, not a description of the incident. Everything else drops or stages silently.

**B. Rules written this session.** Review every rule, principle, or structured entry added to a workspace file during this session. Check precision, file placement, and position within the file. If a rule is vague, misplaced, duplicated, or conflicts with a neighbor, surface the specific problem and proposed fix.

**C. Touched-file pruning pass.** Check every instruction surface touched this session for Delete, Replace, and Tighten opportunities before Add. Keep the pass scoped to touched `CLAUDE.md`, rule-like or misplaced `MEMORY.md` content, reference, skill, and scheduled-task prompt files. For each reduction, name the function-preservation note: which remaining entry holds the behavior, where it moved, or why it is no longer needed. Normal `MEMORY.md` capture, compression, and archiving follow `00_Reference/Memory System.md`; do not remove durable decisions, source mappings, current project context, or rationale as pruning cleanup.

**D. Artifact cleanup.** Scan `98_Temp/` and session-created artifacts for deletion, migration, or retention. Transit artifacts created during the session require checking whether you have completed the recipient action (uploaded, emailed, pasted elsewhere) before deletion. Context snapshots are keep-by-default insurance and should not be surfaced as deletion decisions unless you asked for cleanup, the files are malformed or duplicated, or a separate temp-cleanup workflow flagged them by age.

**E. Progress tracker sync.** List everything completed or meaningfully advanced during the session. For each possible tracker update, read the relevant page or file first and confirm the item exists before proposing an update. If you keep a project tracker (a task board, a spreadsheet, or a project `MEMORY.md`), sync it; if you do not maintain one, skip this check. Use "verified via fetch" only when the source was actually fetched in this session.

### Phase 2: Build Findings

Classify each item as answerable fact, approval-gated action, or true judgment call.

- For answerable facts, run the fetch-first inspection using loaded files, mounted workspace files, connectors where available, and relevant `MEMORY.md` entries. Resolve the fact and remove it from Input Needed.
- For approval-gated actions, present the recommended action with the destination, source checked, and why approval is required.
- For true judgment calls, state the diligence already performed, the unresolved decision only you can make, and the recommended default.

### Phase 3: Apply Approved and Approval-Exempt Changes

Apply Input Needed items only after you approve or redirect them. Skip items you decline. For items you do not address, ask once whether you want them applied, deferred, or dropped.

Apply Approval-exempt items unless you vetoed specific numbers. Approval-exempt work includes routine reversible cleanup, deleting stale draft files, removing redundant pointers outside durable memory, moving clearly rule-like or misplaced `MEMORY.md` content to the right rule surface, silently staging a single-instance content-craft signal to an existing calibration file, codifying an already-approved rule into the right file, and the Workspace Changelog entry when the session hit a changelog trigger.

For any rule that moves between files, leave a one-line pointer at the old location.

### Phase 4: Workspace Changelog and Memory Size Check

Evaluate whether the session hit a Workspace Changelog trigger in `00_Reference/Memory System.md`: project completion, new workflow, new skill, new scheduled task, structural workspace change, or meaningful new system. If yes, write one entry to root `ARCHIVE.md` under the current month and week, most recent first, with the two-sentence cap.

Then count root `MEMORY.md` lines. The ceiling is 150 lines. If over, compress immediately: enforce the two-sentence cap on Active Projects entries, archive entries past the 30-day rolling window, then escalate if still over.

### Phase 5: Confirm

Summarize what changed and where. If any skills were modified, surface runtime sync as an actionable follow-up and follow `00_Reference/Skill Conventions.md` > Installing a Skill unless runtime sync was explicitly out of scope.

## Output Format

Lead with one sentence: `Session was clean. No findings.` or `[X] input needed, [Y] approval-exempt will auto-apply.`

Then use two sections in this order:

### Input Needed

Items that are not auto-reversible and are ripe for action now: a migration, rename, destructive or non-reversible change, or a rule that has met its promotion bar. Do not execute anything in this section until you respond. If empty, state that nothing requires your input.

### Approval-Exempt

Routine, reversible cleanup and auto-writes the skill executes autonomously unless you veto specific numbers. If empty, state that there are no approval-exempt changes.

Number findings continuously across both sections. Each finding uses the standard findings format:

**[Number]. [Action-first headline: the conclusion, not the problem]**
- **Context:** What was found, why it matters, and where exactly it lives.
- **Proposed action:** The specific change, destination, and approval state.

For Input Needed findings, frame the proposed action as "I'll do X unless you redirect." Only ask a direct question when you genuinely must supply missing information or judgment.

For Approval-exempt findings, include the exact file path and section where the change lands. For tracker syncs, include "verified via fetch" only when the fetch happened.

## Constraints

- Surface a finding only when its value clearly exceeds the cost of attention and permanent context; otherwise drop it or stage it silently.
- Do not maximize capture. The audit protects future work; it does not turn every session detail into a rule.
- Do not auto-cut non-trivial instruction surfaces. Route non-trivial deletion, replacement, or rewrite to Input Needed unless it was already explicitly approved and is trivially reversible.
- Do not propose tracker or status updates without reading the live source first. If the source cannot be read, say so instead of presenting the update as verified.
- Do not create new calibration files during this audit. Single-instance craft signals can stage only to an existing calibration file.
- Do not treat context snapshots as cleanup clutter by default.
- Do not write personal memories without explicit approval. Workspace Changelog entries, Active Projects updates, and Scheduled Tasks updates follow the bookkeeping exemption in `Memory System.md`.
- Do not package or install modified skills unless runtime sync is in scope for the current session.

## Edge Cases

- **Compacted session:** Use the compaction summary, modified-file list, and available transcript. Flag any likely uncodified principle that cannot be verified after compaction.
- **Mid-task trigger:** If you say "wrap up" mid-task without asking to close the session, do not run this skill unless the phrase clearly means session closeout.
- **No findings:** Say the session is clean and close with `## What's Next`.
- **Potential external-page write:** Before any connector-backed page update, load the relevant connector or workspace rules, show the substantive content in chat, and separate content verification from formatting verification.
- **Transit artifact:** If the artifact was created for you to upload, email, or paste elsewhere, ask whether that action is complete before deleting it.
- **Modified skill:** Confirm the canonical `97_Skills/<skill-name>/SKILL.md` changed, then flag runtime install state separately if runtime sync is out of scope.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
