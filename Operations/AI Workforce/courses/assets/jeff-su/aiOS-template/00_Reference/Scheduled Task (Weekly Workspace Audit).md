# Scheduled Task (Weekly Workspace Audit)

_A weekly report-only scheduled-task example for checking workspace structure, routing, and memory health. Use it as the standard scheduled-task skeleton; it does not edit files or replace a deeper manual audit._

---

## Setup

**Cadence:** Weekly for an active workspace, monthly for a quieter one. Pick one and set it in the task's schedule.

**Execution mode:** Report-only. It surfaces findings and waits for approval; it never restructures the workspace on its own.

To install, open the scheduled-tasks interface, create a new task, set the name and description fields, and paste the prompt body below (starting at `## Context Loading`) into the prompt.

---

## Prompt

```markdown
## Context Loading

Discover the workspace root dynamically rather than hardcoding a path.

Read these files before proceeding:
1. Root `CLAUDE.md` - routing map and governance ownership table (the map you check reality against)
2. Root `MEMORY.md` - Active Projects dashboard and scheduled-task register
3. `00_Reference/Memory System.md` - capture triggers, entry format, archiving rules, size ceilings
4. `00_Reference/File Creation Rules.md` - where files are allowed to live and the temp-folder rule
5. `00_Reference/Governance Rules - Communication.md` - output standards and the findings format

This list is the floor, not the ceiling: triggered reads from root CLAUDE.md
still fire mid-run.

## Role and Scope

Recurring structural health check across the whole workspace: file hygiene, routing
sync, and memory governance. Report-only: present findings and wait for approval before
any change is made. Does not edit any file. Any approved fix that touches a high-risk
surface (root `CLAUDE.md`, root `MEMORY.md`, a `00_Reference/` file, a skill, or a
scheduled-task prompt) is handed off to a regular working session rather than executed
from this run.

## Steps

1. Confirm the workspace root resolved and all Context Loading files are readable. If any cannot be read, stop and report the limitation.
2. **File hygiene.** List the workspace tree one level deep per workstation. Flag: files sitting in `98_Temp/` older than a reasonable window (stale temp artifacts), files that violate File Creation Rules placement (a deliverable parked at root, a reference file outside `00_Reference/` or a workstation Resources folder), and any workstation missing its `CLAUDE.md` or `MEMORY.md`.
3. **Routing sync.** Cross-check the Routing Map in root `CLAUDE.md` against the actual workstation folders. Flag: a routing entry pointing to a workstation that no longer exists, and a workstation folder with no routing entry. Then cross-check the Active Projects dashboard in root `MEMORY.md` against project subfolders: flag any Active Projects entry with no matching project subfolder, and any project subfolder not represented in Active Projects.
4. **Memory governance.** Read root `MEMORY.md` and each workstation `MEMORY.md`. Flag against `Memory System.md`: entries past the rolling window that should move to `ARCHIVE.md`, duplicated entries (the same fact in two MEMORY.md files, a MECE violation), entries that are actually rules and belong in a `CLAUDE.md`, and any `MEMORY.md` approaching its size ceiling.
5. **Scheduled-task register check.** Confirm every task in the register in root `MEMORY.md` corresponds to a live task, and flag any live task missing from the register.
6. Compile findings. Do not edit. Present the report and stop.

## Output Format

Open with a one-line summary (for example, "5 action items, 2 informational findings").
Then group findings by section (File hygiene, Routing sync, Memory governance,
Scheduled-task register), using one continuous number sequence across the whole output;
do not restart numbering inside each group.

**[Number]. [Action-first headline]**
- **Context:** [1-3 sentences, concrete and specific: name the exact file, entry, or routing line]
- **Proposed action:** [forward-looking specifics: the move, archive, merge, or repoint, and where it lands]

Informational findings (no action needed) use the same numbered headline plus Context,
and omit Proposed action. If the workspace is clean across all four sections, say so and stop.

## Constraints

- Never hardcode a session-specific path; discover the workspace root at run time.
- Report-only. Do not edit any file. After approval, small single-file cleanups (for example, moving one stale temp file) may execute, but any fix touching root files, a `00_Reference/` file, a skill, or a scheduled-task prompt is handed off to a working session.
- Do not imply a live check happened on a source you could not actually read; if a folder or file is unreadable, mark the affected item as blocked.
- Triage by recency where possible: prefer last-modified signals to find what changed, rather than deep-reading every file on every run.
- Do not invent findings to fill the report. A clean workspace is a valid result.
- Run a final voice-and-formatting check before output.
```

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
