---
name: workstation-audit
description: "Deep-dive structural audit of a single workstation in your workspace. Use this skill whenever you say 'audit this workstation,' 'workstation audit,' 'audit [workstation name],' 'clean up this workstation,' 'optimize this workstation,' or 'streamline [workstation name].' Also trigger when you ask to check a workstation for redundancies, bloat, stale content, duplicate rules, or overlapping instructions, or say something like 'we've made a lot of changes to X, let's make sure it's clean' or 'X workstation feels messy.' This is a single-workstation deep dive, not a workspace-wide sweep."
---

# Workstation Audit

## Context Loading

Read the target workstation and its audit criteria before analyzing.

Workstation files:

1. The workstation's `CLAUDE.md`.
2. The workstation's `MEMORY.md`.
3. Every file in the workstation's Resources subfolder.
4. Every active project subfolder's `CLAUDE.md` and `MEMORY.md`, if any exist.

Governance and reference files:

5. Root `CLAUDE.md` for ownership, routing, and hierarchy rules.
6. `00_Reference/Governance Rules - Codification.md` for section ordering, rule routing, and reduction standards.
7. `00_Reference/Workspace Templates - Workstations.md` for the six-H2 workstation `CLAUDE.md` and four-H2 workstation `MEMORY.md` template rules.
8. `00_Reference/Workspace Templates - Projects.md` when the workstation contains project subfolders.
9. `00_Reference/Voice Principles.md` to check for duplicated universal voice rules.
10. `00_Reference/File Creation Rules.md` for file routing rules.
11. Any cross-cutting workstation `CLAUDE.md` files referenced by the target workstation.

After loading, state which files were read so you can catch missed context before analysis begins.

## Workflow

### Phase 1: Confirm Workstation Structure

Derive the current workstation set from root `CLAUDE.md` and `00_Reference/Workspace Structure Tree.md` at runtime. Do not hardcode an older workstation baseline.

Check the workstation `CLAUDE.md` against this exact six-H2 order: `Identity`, `Scope & Routing`, `References & Resources`, `Workflow`, `Operating Rules`, `Output Rules`.

Audit checks:

- Type metadata exists as a `<!-- Type: ... -->` comment.
- All six required H2s are present in the exact order.
- No extra H2 headings exist beyond the six required H2s.
- No renamed required H2 remains (for example, `## Editorial Rules` in place of `## Output Rules`).
- `## Scope & Routing` states the partition dimension explicitly and uses the exact routing-table header from `Workspace Templates - Workstations.md`: `| Request or trigger | Route | Load / handoff rule |`.
- `## References & Resources` follows `Workspace Templates - Workstations.md`: a Resource Files table is required; external or live-source reference tables appear only when such references exist; H3 subheads are used when more than one table appears.
- `## Workflow` starts with `### Default Session Sequence`.
- `## Output Rules` opens with the exact `00_Reference/Voice Principles.md` pointer and has at least three nonblank lines.
- `## Operating Rules` has at least one rule.

Check the workstation `MEMORY.md` shell:

- Exact H2s in order: `## Pending Updates`, `## Contacts`, `## Current State`, `## Key Decisions`.
- All four H2s exist even when empty, with placeholder text in empty sections.
- Flag custom H2s such as `## Rules`, `## Workflow`, or `## Conventions`; prescriptive behavior belongs in `CLAUDE.md` or a Resource file.

Check each project `MEMORY.md` shell against the project template in `Workspace Templates - Projects.md`:

- Exact H2s are present in order: `## Sources of Truth`, `## Working Essentials`, `## Pending Updates`, `## Key Decisions`.
- `## Sources of Truth` has at least one row or a clear placeholder line.
- Empty sections have placeholder text.
- No workstation-only H2s leaked into the project shell.

### Phase 2: Run Four Analysis Passes

**Pass 1: MECE violations.** Check for duplicated or overlapping rules between the workstation and root files, between `CLAUDE.md` and resource files, across resource files, and between `CLAUDE.md` and `MEMORY.md`. Apply the governance routing tests: rules belong in `CLAUDE.md` or Resources; changeable facts belong in `MEMORY.md`.

**Pass 2: Misplaced rules.** Check whether each rule, principle, and reference item lives at the right hierarchy level and file type. Domain-specific rules belong in the workstation; universal rules belong at root or in `00_Reference/`; craft-level reference material belongs in Resources; project-specific rules belong in project subfolders.

**Pass 3: Bloat and structural issues.** Check stale content, stale handoff language, section numbering, stale cross-references, file size, section order, and pointer hygiene. Flag resource files over 500 lines as split candidates and `CLAUDE.md` files over the 300-line soft cap as relocation candidates.

**Pass 4: Incompleteness and ambiguity.** Check undocumented workflows, missing resources, ambiguous identity statements, weak resource triggers, workflows that defer entirely to external sources, unnecessary fetch loops, duplicate sync mechanisms, and small source-side fixes that would reduce recurring friction.

### Phase 3: Present Findings

Present findings and stop for approval. Do not edit files yet.

### Phase 4: Execute Approved Changes

Apply only what you approved. Work file by file:

1. Make the approved edit.
2. Add a pointer at the old location when moving or consolidating a rule.
3. If a change becomes more complex than the approved finding, pause and flag it.
4. Link each changed file for review.

### Phase 5: Verify

Re-read every modified file. Confirm relocated rules have pointers, cross-references still resolve, section numbering is continuous, no new MECE violations were introduced, and every approved finding was resolved.

### Phase 6: Second-Pass Audit

Structural changes create residue. Re-read all modified files from scratch and run the four analysis passes again, scoped only to modified files. Look for stale intro paragraphs, numbering gaps, residual duplication, stale identity or status lines, and pointer chains. Present second-pass findings and wait for approval if further changes are needed.

If the second pass is clean, report that and stop. A third pass is only warranted if the second pass required substantial structural changes.

## Output Format

Start with a Bottom Line Up Front section using bullets only. It should state the workstation's health, the number and actionability spread of findings, and the net recommendation.

Then group findings by actionability:

### Input Required

Findings needing your decision before execution. If none, state that no decisions are required.

### Approval-Exempt Changes

Straightforward structural fixes that can be executed after you approve the bucket. If none, state that no approval-exempt changes were found.

### Noted

Optional. Include only when something looked like a problem but is not actionable.

Number findings continuously across all groups. Use this format:

**[Number]. [Action-first headline]**
- **Context:** What is wrong, what category it belongs to, and where exactly it appears.
- **Proposed action:** The specific edit or option, with enough detail to decide.
- **Decision needed:** Include only for Input Required findings.

For any finding that changes an instruction surface, include:

- **Instruction-surface disposition:** delete, merge, move, rewrite, stage, dismiss, or add as last resort.
- **Smallest useful change:** The least change that preserves function.
- **Function-preservation note:** Which remaining entry holds the behavior, where it moved, or why it is no longer needed.

End the report after the findings sections. Do not add a redundant summary, file inventory, or time estimate.

## Constraints

- Never edit before you approve the action plan.
- Do not apply legacy workstation criteria. Use the current six-H2 `CLAUDE.md` standard and current memory-shell templates.
- Do not invent workflow documentation for gaps that require production experience. Flag these as known gaps instead.
- Do not treat stable numbering as a reason to bypass structural compliance. Try H3 grouping or another local fix first.
- Do not audit archived project folders unless the target question explicitly includes archive state.
- Read live primary sources before claiming a project, tracker, or deliverable state is stale.
- Keep the audit scoped to one workstation. Cross-workstation issues can be noted, but broad workspace remediation belongs to a workspace-wide audit.

## Edge Cases

- **Cross-cutting workstation references:** Load referenced workstation `CLAUDE.md` files so duplicated boundaries can be checked.
- **High-impact workstation:** After Phase 6, consider recommending a fresh full-read audit if the workstation has scheduled tasks, heavy cross-cutting references, or daily use.
- **Unexpected missing resource:** Verify the file path directly before flagging it as missing.
- **Approved edit expands in scope:** Stop and ask for approval before expanding the edit set.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
