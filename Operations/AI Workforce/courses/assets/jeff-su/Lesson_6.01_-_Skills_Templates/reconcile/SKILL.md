---
name: reconcile
description: >
  Compare the draft your assistant produced against the final you actually used, and propose the
  smallest useful instruction-surface change: delete, merge, move, rewrite, stage, or add as a last resort.
  Trigger whenever you say "reconcile," "what did I change," "diff this against the draft," or
  "here's what I actually sent," or share a final version alongside a draft from earlier in the
  session. Also trigger when you paste or screenshot a sent message (email, DM, post) after your
  assistant drafted it, even without saying "reconcile." Do NOT trigger for general editing
  or tightening, end-of-session sweeps (session-audit), or first-draft production.
---

# Reconcile

## Context Loading

Read these before proceeding:

1. `00_Reference/Voice Principles.md` - the universal voice rules your edits may be enforcing, contradicting, or making redundant.
2. The owning workstation's `CLAUDE.md` - the domain output rules the draft was (or should have been) following. Identify the workstation from the draft's context (an email routes to your comms workstation, a post to your content workstation, and so on). If the draft was cross-workstation, load both `CLAUDE.md` files.
3. `00_Reference/Governance Rules - Codification.md` - the delete-replace-add gate and "Writing a good rule" rules. The gate already orders delete before rewrite before add; this skill applies it, not a parallel model.

Load only when a delta calls for it:

4. The owning workstation's calibration file in its Resources folder (one per deliverable category, if one exists) - read only when a delta is a stage candidate, so the signal lands in the right place. Do not create one if none exists.
5. A pattern library or style guide - read only when the edit is a craft-level pattern (sentence mechanics, formatting device) that such a file owns.

## The Minimal Sufficient Precision Gate

Every proposed change must pass one gate: make the surface only precise enough to prevent the observed miss, and no more. This is the operational form of "Delete or rewrite before you add" in `00_Reference/Governance Rules - Codification.md` > Writing a good rule.

Run the gate in this order and stop at the first option that prevents the miss:

1. **Delete.** Does a rule now contradict the edit or sit superseded? Remove it.
2. **Rewrite or tighten.** Is a rule right but too vague, broad, or weak to have fired? Sharpen its wording so it would have blocked the miss.
3. **Move.** Is a rule right but buried or too far from the step where it must fire? Relocate it nearer the firing moment.
4. **Merge.** Do two rules cover the same behavior, and the edit exposes the redundancy? Fold them into one.
5. **Stage.** Is this a single-instance craft signal? Log it to a calibration file to watch for recurrence; do not codify yet.
6. **Add (last resort).** Only when nothing existing can be deleted, rewritten, moved, or merged to carry the case, and the preference is recurring and named.

A current rule that seems to cover the miss is not automatically a no-change outcome. Before dismissing it as "already covered," test whether the rule is close enough to the firing moment, concrete enough to block the observed miss, and reinforced by the workflow or final scan. If any answer fails, assign move, merge, rewrite/tighten, or delete. No file change is allowed only with a one-line proof that the current rule is visible, operationally sufficient, and the miss is a true one-off.

A change that does not prevent a concrete, observed miss does not pass the gate.

## Workflow

### Phase 1: Census and Triage

1. **Locate the draft.** Find your assistant's draft from earlier in the conversation. If the session was compacted and the draft is not available, ask for it to be pasted.
2. **Locate the final.** Read the final from the paste, screenshot, or linked content. For screenshots, zoom into text regions if needed for accuracy.
3. **Census every change, terse.** One line each: draft text to final text, change type (structure, tone, word choice, addition, deletion, punctuation). Full coverage so nothing is skipped. No analysis yet.
4. **Mark material vs trivial.** Trivial = autocorrect, punctuation, formatting, or a synonym swap that reveals no preference. Material = changes meaning, structure, voice, or a recurring craft pattern. Only material deltas proceed.

### Phase 2: Diagnose and Assign a Disposition

For each material delta, name what the edit reveals (the principle, not your state of mind), then grep the target surface(s) for every rule the edit bears on, both directions (does a rule now become wrong or redundant? is there a rule that should have fired?). Assign exactly one disposition:

- **Under-applied, provisional.** An existing rule appears to cover this but failed to shape the draft. Run the prevention test in the Minimal Sufficient Precision Gate before assigning no file change.
- **Delete.** A rule now contradicts the edit, is fully superseded, or should not exist.
- **Rewrite or tighten.** A rule is right but too vague, broad, narrow, or weak to have fired.
- **Move or relocate.** A rule is right but buried or too far from the step where it must fire.
- **Merge.** Two rules cover the same behavior and the edit exposes the redundancy.
- **Stage.** A low-confidence or single-instance craft signal belongs in an existing calibration or examples file for recurrence tracking, not in permanent rules yet.
- **Add, last resort.** A recurring, named preference has no existing owner, and no existing rule can be deleted, moved, merged, or rewritten to carry it.
- **Dismiss.** The edit is a one-off, trivial, or clearly makes the content worse.

Absorb deltas that point to the same principle into one disposition with several pieces of evidence, never one per row.

### Phase 3: Propose, Prune-First

Present operations in this order: deletes, merges, moves, rewrites/tightens, stages, then additions. Every addition carries a one-line proof that no existing rule could be deleted, moved, merged, or rewritten to cover the case. For deletes, merges, moves, and rewrites/tightens, show the exact current wording and (except for a pure delete) the exact proposed wording, placed immediately after the most closely related existing rule. Wait for approval on each operation before writing anything.

### Phase 4: Execute and Verify

After you approve:

1. **Route high-blast-radius edits through the gate first.** An edit to `00_Reference/`, root `CLAUDE.md`, root `MEMORY.md`, a skill file, a scheduled-task prompt, a file with a root "Read when..." trigger, or any change touching three or more files triggers the impact-analysis rule in `Governance Rules - Verification.md`. For a single-file in-place rewrite in one of those files, show the exact diff and get explicit approval first.
2. **Write the approved operations.**
3. **Leave or update pointers.** A move leaves a pointer and updates inbound references. A delete or merge leaves a pointer only when the removed text was a named section or an active target of another file; otherwise delete cleanly.
4. **Grep for stale references** after relocating or merging, so no pointer lands on a rule that moved.
5. **Re-read each modified file** to confirm the change landed and the surrounding rules still group correctly.
6. If a workstation `CLAUDE.md` gained a durable pattern, note it in that workstation's `MEMORY.md` per the rule-vs-memory routing in `Governance Rules - Codification.md`.

## Output Format

**Bottom Line** (one sentence)
Lead with reductions. Count the material changes, then break them down by operation: deletes, merges, moves, rewrites/tightens, stages, adds, and no-change proofs.

**Material Deltas**
The material changes only, compact: draft to final, change type. Trivial changes from the census are omitted unless you ask for the full list.

**Findings** (prune-first order: deletes, merges, moves, rewrites/tightens, stages, then adds; one continuous number sequence)

Each finding uses the standard findings format from `00_Reference/Governance Rules - Communication.md` > Output standards, embedded here:

**[Number]. [Action-first headline: the change to make, not the problem]**

- **Context:** Which delta(s) this comes from, quoting the decisive before/after text, and which existing rule fired, failed to fire, or does not exist.
- **Proposed action:** The disposition in plain English, the target file and section, and the exact text. For deletes, merges, moves, and rewrites/tightens, quote the current wording and the full replacement wording ready to write (a pure delete quotes only what is removed). For an addition, include the one-line proof that no existing rule could be moved, merged, or rewritten to cover the case.

A staged item is a numbered finding like the rest. Its Proposed action must state in one line what staging means and what promotes it: "logged to [calibration file] to watch for recurrence; becomes a rule proposal at 2+ occurrences, nothing else changes now."

**Dismissed**
- Change N: one-line reason ("one-off" or "content made worse").

**Confirmation prompt**
If operations exist: the count per type, the target files, an impact-analysis flag if any edit hits `00_Reference/`, root, a skill file, or three or more files, and "Want me to apply these?"
If none: "No surface change needed after [N] no-change proofs. The rules that should have fired were visible, operationally sufficient, and the misses were one-offs."

## Constraints

- **Prune before you add.** The default outcome is deleting, merging, moving, or rewriting an existing rule. An addition is valid only after the one-line proof that no existing rule could carry the case. You invoking the skill is evidence that a surface change is warranted, not that a new rule is.
- **Scope guard.** Reconcile may only change rules the specific edit gives evidence about. Stale rules unrelated to this edit belong to `reference-file-audit` or `workstation-audit`, not here.
- **Never auto-write.** The skill proposes; you approve each operation before any file changes.
- **Attribute the pattern to the edit, not the person.** Explain what the edit reveals, not what you were thinking.
- **One principle per proposal.** Multiple deltas pointing to one principle become one proposal with several pieces of evidence. Do not inflate the count.
- **Cross-workstation placement.** When a pattern applies beyond the owning workstation, target `Voice Principles.md` or the right cross-cutting file, not the workstation `CLAUDE.md`.

## Edge Cases

- **Only trivial deltas.** If every change is autocorrect, punctuation, or formatting, say so and stop: "No material changes. Nothing to reconcile." Do not manufacture a proposal.
- **No calibration file exists.** If a delta should be staged but the workstation has no calibration file, flag it in the proposal and let the user decide whether to create one. Never auto-create it, and never silently drop the signal.
- **Draft not in current session.** If the conversation was compacted or the draft was in another session, ask for the original to be pasted. Do not reconstruct it from memory or a compaction summary.
- **Screenshot is unreadable.** If the final text cannot be reliably parsed, ask for it to be pasted. Do not guess at unclear characters.
- **No changes detected.** If the final matches the draft exactly, say so: "No changes. The draft went out as-is," which means the relevant rules are working.
- **Changes span multiple workstations' rules.** When one edit touches rules owned by different files, produce a separate proposal per target file. Do not bundle cross-file changes into one.
- **The content was made worse.** If a change clearly violates a rule the user wrote, dismiss it neutrally and do not propose codifying the violation.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
