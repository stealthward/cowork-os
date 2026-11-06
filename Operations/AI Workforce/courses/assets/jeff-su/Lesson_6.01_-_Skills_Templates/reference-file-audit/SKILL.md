---
name: reference-file-audit
description: "Deep-dive structural and content audit of a single reference file. Use this skill whenever you say 'audit this file,' 'audit [filename],' 'reference file audit,' 'clean up [filename],' 'optimize [filename],' or 'this file feels bloated.' Also trigger when another audit (workspace audit or workstation audit) flags a specific reference file as needing deeper review. Applies to any standalone .md reference file in the workspace, primarily files in `00_Reference/` but also workstation resource files (for example, a file in a workstation's Resources folder). This is the file-level deep dive counterpart to workstation-audit (workstation-level). Do NOT trigger for CLAUDE.md or MEMORY.md files (those are covered by workstation-audit)."
---

# Reference File Audit

## Context Loading

Load the ecosystem around the target file before analyzing.

1. Read the target file in full.
2. Read root `CLAUDE.md` to find the Reference Index pointer and trigger for the file.
3. Grep the workspace for all active references to the file. Check workstation `CLAUDE.md` files, other reference files, skill files, and scheduled-task prompts.
4. Read sibling files that share scope boundaries with the target. For example, when auditing `Voice Principles.md`, also read `Governance Rules - Communication.md`; when auditing a PARA operational reference, read the parent `Area-First PARA Framework.md`.
5. Read `00_Reference/Workspace Templates - Reference Files.md` for the reference-file structure contract.
6. Read `00_Reference/Governance Rules - Codification.md` for reduction and placement rules.
7. Read `00_Reference/Governance Rules - Communication.md` and `00_Reference/Voice Principles.md` before presenting findings.

Summarize what was loaded before the analysis so you can catch missed context early.

## Workflow

### Phase 1: Choose Operating Mode

State the active mode before analysis.

**Structural-only mode:** Pure reorganization. Add H3 subheaders, merge thin sections, or move entries within or across files. Preserve every entry verbatim and conserve total rule count. Default when the trigger is "reorganize," "restructure," or "add subheaders."

**Precision / content-reduction mode:** Delete superseded entries, merge variants into one broader rule, retire self-evident entries, and compress verbose entries. Default when the trigger is "clean up," "bloated," "optimize," "tighten," or when another audit flags the file for consolidation. Precision mode proposes cuts; it never auto-cuts.

When the mode is ambiguous, default to precision mode and present the specific cut list for approval.

### Phase 2: Run the Eight Checks

Each check produces one of three verdicts: clean, finding, or note.

**Check 1: Current state measurement.** Report total line count, H2/H3 section inventory, rule or entry count per section, and largest-section to smallest-section ratio.

**Check 2: Structural integrity.** Check for orphaned headers, inconsistent heading levels, section ordering, formatting inconsistencies, missing separators, and reference-file template compliance.

**Check 3: Scope compliance.** Quote the file's scope statement before judging entries against it. Flag entries that belong in a workstation `CLAUDE.md`, a Governance Rules file, `MEMORY.md`, or another reference file.

**Check 4: Duplicate detection.** Run an internal pass for restated rules inside the file and an external pass across workspace files for rules that express the same constraint elsewhere. Determine the canonical owner before recommending removal.

**Check 5: Grouping quality.** Flag catch-all sections, thin sections, and misplaced entries. When a governing template requires grouping, first propose the smallest compliant change. Treat exemptions as last-resort findings with a no-compliance proof.

**Check 6: Internal cross-reference validation.** Confirm every pointer inside the file resolves to the correct section or destination.

**Check 7: External reference integrity.** Confirm all active pointers to this file are accurate. If the audit proposes section moves or renames, include external pointer repairs in the proposal.

**Check 8: Growth trajectory.** Use timestamps and recent-entry clustering to identify sections trending toward catch-all status and recommend preemptive grouping only when the benefit is clear.

### Phase 3: Propose

Lead with a bottom-line summary, then present findings by actionability. Stop for your approval before executing.

### Phase 4: Execute Approved Changes

Execute all approved changes in one pass. Group related changes such as relocating rules, adding pointers, and updating external references.

When relocating entries, add a relocation pointer at the old location with the date and destination. In structural-only mode, preserve every entry. In precision mode, execute only approved deletions, merges, retirements, and compressions, and confirm every removed behavior is still covered by a remaining entry.

### Phase 5: Verify

Verify coverage, cross-references, single-place-for-each-rule integrity, and section balance.

- In structural-only mode, total entries should stay the same.
- In precision mode, entry count can fall, but every removed behavior must be covered by a remaining entry.
- Re-run internal and external pointer checks.
- Confirm no new duplication was introduced.
- Confirm catch-all fixes resolved the imbalance.

Write a Workspace Changelog entry to root `ARCHIVE.md` after completing an approved audit if it hit a changelog trigger in `00_Reference/Memory System.md`.

## Output Format

Start with a 2-3 sentence bottom line: overall file health, the biggest structural issue, and total finding count.

Then include a summary: one bullet per finding with a short label and one-line proposed fix.

Then use two actionability buckets:

### Items Requiring Your Input

Findings where the action depends on a judgment call. Include a recommendation unless the tradeoffs are genuinely balanced. If empty, state that nothing requires your input.

### Changes To Execute

Clear-cut findings where the action is straightforward after you approve the bucket. If empty, state that there are no clear-cut changes to execute.

In precision mode, open the findings with **Instruction Surface Reductions**, grouped in this order: Delete candidates, Replace candidates, Tighten candidates, Add candidates. Every Delete, Replace, and Tighten item needs a function-preservation note. Add is last resort and requires proof that no existing entry can be moved, merged, or rewritten to carry the case.

Number findings continuously across all sections. Use the standard findings format:

**[Number]. [Action-first headline]**
- **Context:** What was found, why it matters, and where it appears.
- **Proposed action:** The exact edit or decision.

For instruction-surface changes, add:

- **Instruction-surface disposition:** delete, merge, move, rewrite, compress, stage, dismiss, or add as last resort.
- **Smallest useful change:** The least change that preserves function.

For exemptions from a governing template, add:

- **No-compliance proof:** The compliant fix considered, why it fails, and why no narrower local fix works.

## Constraints

- Audit one target file per invocation.
- Do not audit `CLAUDE.md` or `MEMORY.md` files with this skill.
- Structural-only mode preserves content and count. Precision mode reduces only with approved function preservation.
- Prune before adding. An addition requires proof that no existing entry can be deleted into, merged, moved, or rewritten.
- Precision-mode cuts are never automatic.
- Do not treat stable numbering or external citations as enough reason to avoid a compliant structure.
- Do not fix sibling-file issues in the same pass unless the fix is a simple pointer update required by the target file's audit.
- Link every changed file after execution.

## Edge Cases

- **File path is ambiguous:** Resolve by searching workspace files first. If multiple plausible targets remain, ask which one to audit.
- **Target has no root pointer:** Continue the audit, but flag the missing trigger chain as a finding.
- **Grep returns many references:** Group references by file type and inspect active surfaces first. Exclude archives and temp files from active-remediation requirements unless the target audit explicitly includes history.
- **Credential-looking content appears in search:** Do not print values. Record only the path and route the issue separately if relevant.
- **Audit reveals a broader workspace issue:** Note it as a follow-up, but keep execution scoped to the single target file.
- **Post-edit verification fails:** Fix failures covered by the approved scope before closing. If the fix expands scope, stop for approval.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
