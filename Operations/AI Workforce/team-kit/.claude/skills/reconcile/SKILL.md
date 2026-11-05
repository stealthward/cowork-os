---
name: reconcile
description: "Compares a draft Claude wrote against the version the user actually sent or posted, and proposes the smallest change to the rules that would have prevented the miss: delete, rewrite, move, merge, stage, or add as a last resort. Use when the user says 'reconcile', 'reconcile this', 'here is what I actually sent', 'what did I change', or pastes a sent email, caption, or post after Claude drafted it. Do not use for ordinary editing requests, for first drafts, or for the end-of-session sweep (that is session-audit)."
---

# Reconcile

_Shared Core (team kit copy, scrubbed 2026-10-30)._

Source of truth: `.claude/skills/reconcile/SKILL.md` in the Cowork OS. Adapted 2026-09-21 from Jeff Su's reconcile template against the user's file names. The skill proposes; the user approves each change before anything is written.

## What to read first

1. `00_Resources/voice-principles.md`, the rules the edit may be enforcing, contradicting, or making redundant.
2. The owning workstation's `CLAUDE.md` (an email routes to Email HQ, a caption or post to Content & Authority, a client-facing copy job to Business Development). Both if the draft crossed workstations.
3. The workstation's calibration file, only when a delta is a stage candidate. Today there is one: `Content & Authority/Content & Authority Resources/content-calibration.md`. Do not create a calibration file inside this skill; propose it as a finding.
4. The skill or agent file that produced the draft, when one did (for example `captions` or `rtm-social`), because the rule that should have fired may live there rather than in the voice file.

## The one gate

Every proposed change must be only as precise as needed to prevent the observed miss, and no more. Run these in order and stop at the first that prevents it:

1. **Delete.** A rule now contradicts the edit or is superseded.
2. **Rewrite or tighten.** A rule is right but too vague or weak to have fired.
3. **Move.** A rule is right but sits too far from the step where it must fire (a caption rule buried in the voice file instead of the captions skill).
4. **Merge.** Two rules cover the same behavior and the edit exposes the overlap.
5. **Stage.** A single-instance craft preference. Log it in the calibration file with the date and the evidence. It becomes a rule proposal at the second occurrence, nothing else changes now.
6. **Add.** Last resort, only with a one-line proof that nothing existing could be deleted, rewritten, moved, or merged to carry the case, and the preference is recurring and named.

"Already covered" is not automatically no change. Test whether the existing rule was close enough to the firing moment and concrete enough to have blocked the miss. If not, it gets rewritten or moved.

## Workflow

1. **Locate both versions.** The draft from this thread, the final from the user's paste. If the draft is not in this session (compacted, or another thread), ask for it. Never reconstruct it from memory.
2. **Census every change**, one terse line each: draft text to final text, type (structure, tone, word choice, addition, deletion, punctuation).
3. **Sort material from trivial.** Trivial is autocorrect, punctuation, formatting, or a synonym that reveals no preference. Only material deltas continue.
4. **Diagnose each material delta.** Name the principle the edit reveals, then search the loaded files for every rule it bears on, in both directions: a rule that should have fired, and a rule the edit now makes wrong. Assign one disposition from the gate. Deltas that point to the same principle collapse into one proposal with several pieces of evidence.
5. **Propose, prune first.** Deletes, merges, moves, rewrites, stages, then adds. For every change except a pure delete, show the current wording and the exact replacement, placed right after the most closely related existing rule. Wait for approval on each.
6. **Apply what the user approves.** Leave a one-line pointer where a rule moved. Re-read each modified file to confirm the change landed. If a rule changed in a skill file, note that the account copy needs redeploying.

## Output

**Bottom line**, one sentence: how many material changes, and the count by operation.

**Material deltas**, compact: draft to final, type.

**Findings**, numbered, prune-first order:

**[N]. [The change to make, stated as the conclusion]**
- **Evidence:** the decisive before and after text, and which rule fired, failed to fire, or does not exist.
- **Proposed action:** the disposition in plain English, the file and section, the exact text. For a stage: "logged to content-calibration.md; becomes a rule proposal at a second occurrence."
- **Why it prevents the miss:** one sentence.

**Dismissed:** one line each, "one-off" or "the change made it worse".

**Close:** the count per type and the files touched, then "Want me to apply these?" Or, if nothing: "No rule change needed. The rules that should have fired were visible and sufficient; the changes were one-offs."

## Constraints

- Prune before you add. the user invoking the skill is evidence a change may be warranted, not that a new rule is.
- Only rules the specific edit gives evidence about. Stale rules unrelated to this edit belong to the workstation audit.
- Never write without approval.
- Describe what the edit reveals, not what the user was thinking.
- A pattern that applies beyond one workstation targets `voice-principles.md`; a pattern specific to one output type targets the skill or agent that produces it.
- No em dashes in anything written to a file.

## Edge cases

- **Only trivial changes:** say "No material changes. Nothing to reconcile." Do not manufacture a finding.
- **The final matches the draft:** say so. The rules are working.
- **A change violates a rule the user wrote:** dismiss it neutrally and do not propose codifying the violation. Mention it once so the user can decide whether the rule or the edit was wrong.
- **The delta belongs to a brand line, not the user's voice** (an RTM social caption Alyza edited): target the skill's brand-line rule, not voice-principles.md.


## Usage log

Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`: `YYYY-MM-DD | reconcile | model that ran | one-line summary`. The systems registry page reads this to show when the skill last ran.
