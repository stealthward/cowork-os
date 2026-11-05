# Scheduled Task (Weekly root CLAUDE.md Audit)

_A weekly report-only scheduled-task example for checking root `CLAUDE.md` for misplaced rules, stale pointers, and bloat. Use it to keep the always-loaded instruction file lean; it does not edit root `CLAUDE.md` directly._

---

## Setup

**Cadence:** Weekly (suggested: Monday morning, before your work week starts).

**Execution mode:** Report-only. It never edits root `CLAUDE.md`; it hands any approved fix off to a regular working session.

To install, open the scheduled-tasks interface, create a new task, set the name and description fields, and paste the prompt body below (starting at `## Context Loading`) into the prompt.

---

## Prompt

```markdown
## Context Loading

Discover the workspace root dynamically rather than hardcoding a path.

Read these files before proceeding:
1. Root `CLAUDE.md` - the file under audit: routing map, governance ownership table, reference index
2. `00_Reference/Governance Rules - Codification.md` - section ordering, root size cap, CLAUDE.md vs MEMORY.md routing, codification gates
3. `00_Reference/Governance Rules - Communication.md` - output standards and the findings format

This list is the floor, not the ceiling: triggered reads from root CLAUDE.md
still fire mid-run.

## Role and Scope

Weekly structural audit of root `CLAUDE.md` only. Report-only: present findings and
wait for approval before any change is made. Does not touch any workstation file,
any `00_Reference/` file, `MEMORY.md`, or `ARCHIVE.md`. Any approved edit to root
`CLAUDE.md` is handed off to a regular working session, never executed from this run.

## Steps

1. Confirm root `CLAUDE.md` loaded and the two governance reference files are readable. If any cannot be read, stop and report the limitation.
2. **Misplaced-rule scan.** Read root `CLAUDE.md` top to bottom and classify every instruction by scope before moving on. Root may own workspace-wide identity, session workflow, hierarchy, routing, governance, reference triggers, and high-risk guardrails. A domain-specific routing trigger may stay at root, but a domain-specific production rule belongs in the matching workstation `CLAUDE.md`; this includes output rules about hooks, formatting, subject lines, channels, or platform-specific content. Also flag changing context that belongs in `MEMORY.md` and detailed cross-workspace procedures that belong in `00_Reference/`. Do not assume a rule belongs at root because it appears inside a root-owned section.
3. **Stale-pointer scan.** For every pointer in the Reference Index and Routing Map, confirm the target file or workstation still exists at the path named. Flag any pointer to a file or folder that is missing or renamed.
4. **Bloat scan.** Flag duplicated rules (the same rule stated in two places, a MECE violation), rules that restate a `00_Reference/` file instead of pointing to it, and any section that has grown past a quick scan and should be compressed to a pointer.
5. **Size check.** Note the file's current length against the root size cap in the codification governance file. If it exceeds or approaches the cap, flag it.
6. Compile findings. Do not edit. Present the report and stop.

## Output Format

Open with a one-line summary (for example, "3 action items, 1 informational finding").
Then list findings grouped by type (Misplaced rules, Stale pointers, Bloat, Size),
using one continuous number sequence across the whole output.

**[Number]. [Action-first headline]**
- **Context:** [1-3 sentences, name the exact line or section and why it's flagged]
- **Proposed action:** [the specific move, compression, or repoint, and where it should land]

Informational findings (no action needed) use the same numbered headline plus
Context, and omit Proposed action. If nothing is flagged, say the file is clean and stop.

## Constraints

- Never hardcode a session-specific path; discover the workspace root at run time.
- Report-only. Do not edit root `CLAUDE.md`. Because root `CLAUDE.md` is a high-risk surface, hand every approved fix to a regular working session rather than executing it from this unattended run.
- Do not invent findings to fill the report. A clean file is a valid result.
- Finish every scan before compiling the report. A finding in one scan does not replace or end the other scans.
- If a pointer target cannot be verified (path unreadable), mark that item as blocked rather than asserting it is broken.
- Run a final voice-and-formatting check before output.
```

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._

_[2026-07-14] Strengthened the misplaced-rule scan to distinguish root routing triggers from workstation production rules and require every scan to finish before reporting._
