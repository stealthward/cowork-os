# Workspace Templates - Projects

_Template contracts for creating project subfolders, project `CLAUDE.md`/`MEMORY.md` files, and project Resources folders. Read this file when creating, auditing, or converting a project-level structure inside a workstation. Does not contain workstation, SOP, skill, scheduled-task, source-index, or generic markdown-reference templates; use the sibling `Workspace Templates - ...` files for those._

---

## Project Subfolder Requirements

A project is a time-bound initiative that lives inside a workstation: a trip, an apartment search, a single content piece, a launch campaign. When a piece of work has a clear start, a clear "done," and its own working files, it earns a project subfolder rather than living loose in the workstation.

Every project subfolder contains exactly three things:

- `CLAUDE.md` (project-specific constraints)
- `MEMORY.md` (project status, sources, decisions)
- `[Project Name] Resources/` (project-scoped reference material and working files)

**Structural contract.** Any folder inside a workstation that is not `[Workstation Name] Resources/` or the workstation's `Archive/` is treated as a project subfolder and must hold those three items. Working files, drafts, trackers, and exports belong inside the project's Resources folder, never as loose folders inside the workstation.

**Discovery contract.** Do not conclude a project subfolder is absent from a single name search. List the parent workstation directory, since folder names may be shorter than the full project title.

---

## Project Creation Checklist

When you ask Cowork to create a new project inside an existing workstation, it follows this checklist:

1. Create `[Workstation Name]/[Project Name]/CLAUDE.md` using the **Project CLAUDE.md Template** below. Project folder names start with the current `YYQ#`, then use a simple descriptive name that identifies the effort from a folder listing. Calculate the prefix from today's date: `YY` is the year's last two digits, and the quarter is `Q1` for January-March, `Q2` for April-June, `Q3` for July-September, or `Q4` for October-December. Never copy the prefix from an example project. In examples such as `YYQ# Job Search`, `YYQ# Apartment Search in Central`, or `YYQ# 193 LinkedIn Post`, `YYQ#` is a literal placeholder that must be replaced with the current calculated prefix. For lightweight recurring deliverables, a stable piece number can be the clearest descriptor, but still name the object.
2. Create `[Workstation Name]/[Project Name]/MEMORY.md` using the **Project MEMORY.md Template** below.
3. Create `[Workstation Name]/[Project Name]/[Project Name] Resources/` (empty until populated). The folder name matches the project name plus ` Resources`.
4. Add a pointer to root `MEMORY.md` under **Active Projects & Work** with the project name, parent workstation, one-line status, and last-active date. The project `MEMORY.md` remains the source of truth; the root entry is only a routing dashboard pointer.
5. **Verify before declaring it scaffolded:**
   - All three items exist (an empty Resources folder counts; an absent one does not).
   - The `MEMORY.md` H1 matches the folder name and all four standard H2s are present.
   - The Sources of Truth table exists with at least one row, or a clear placeholder line.
   - Root `MEMORY.md` contains the matching Active Projects pointer.

Fix any gap before moving on.

---

## Project CLAUDE.md Template

Every project `CLAUDE.md` captures instructions specific to this one initiative that do not generalize to the parent workstation.

The distinction: **workstation `CLAUDE.md` owns reusable methodology** (workflows, principles that apply to all work in that domain). **Project `CLAUDE.md` owns project-specific constraints** (decisions and rules that only matter for this initiative). If a principle was discovered during a project but applies to future work in the domain, it belongs in the workstation `CLAUDE.md`, not here. Keep this file short. Most projects only need a Goal and one or two rules.

```
# [Project Name]

_Parent workstation: [Workstation Name]_

## Goal
<!-- One sentence: what does "done" look like for this project? This is the
     scope anchor. Cowork reads it every session to keep recommendations on-target. -->

## Project-Specific Workflow
<!-- How to work on this project beyond the parent workstation's workflow. -->
<!-- For simple projects: "No project-specific workflow. Follow [Workstation] CLAUDE.md." -->

## Project-Specific Rules
<!-- Constraints, conventions, or format rules that only apply here. When a session
     settles a deliverable format (a tracker layout, section labels, a naming pattern),
     capture it here with enough detail that a fresh session can reproduce it without
     seeing prior work. -->
<!-- For simple projects: "No project-specific rules. Inherit from [Workstation] CLAUDE.md." -->
```

---

## Project MEMORY.md Template

Every project `MEMORY.md` uses the same four H2s in this exact order: Sources of Truth, Working Essentials, Pending Updates, and Key Decisions. Keep all four even when empty, each with a placeholder sentence explaining what belongs there. When a section has real content, remove its placeholder line. Project-specific content lives as bullets or H3s under one of the four anchors, usually under Working Essentials.

This is a project shell, not a copy of the workstation `MEMORY.md` shell. Project memory does two jobs workstation memory does not: (1) it maps the project's source surfaces (links, folders, trackers, external pages) so a future session can find everything, and (2) it preserves enough working context for a time-bound initiative to resume cleanly. Do not add workstation-only H2s such as Contacts or Current State to a project `MEMORY.md` by default.

The Sources of Truth table tracks every canonical surface created for the project: working files, external links, folders, trackers. Add rows when surfaces are created; remove them when retired. If Cowork does not know a surface exists at session start, it cannot factor it into recommendations.

```
# [Project Name]

_Parent workstation: [Workstation Name]_
_Created: [YYYY-MM-DD]_
_Target completion: [date or TBD]_

## Sources of Truth

| Resource | Type | Location | Status |
|---|---|---|---|
| <!-- Add as resources are created --> | | | |

## Working Essentials

_None currently. Use this for lightweight project context Cowork reads at session
start: status, scope, key constraints, dates, and enough orientation to work without
re-reading every source. Details go in the project Resources folder._

## Pending Updates

_None currently. Use this for unresolved edits, parity checks, or follow-up items a
future session must revisit._

## Key Decisions

_None currently. Use this for durable project decisions, rationale, and settled choices
future sessions should preserve._
```

---

## Project Resource Folders

Every project gets a `[Project Name] Resources/` subfolder, matching the workstation convention. The level is preserved by nesting: project Resources live inside the project subfolder, workstation Resources live at the workstation root.

What goes where:

- **Project-scoped material** (a trip itinerary, a candidate-apartment comparison, a campaign's two-email plan) lives in the project's Resources folder.
- **Domain-scoped material** that applies across many projects (a reusable framework, a packing list you reuse on every trip) lives in the workstation's Resources folder.

The test: would this file still be useful after this project closes? If yes, it is a candidate for the workstation Resources folder.

---

## Completion Handling

When a project finishes, review its Resources folder. Migrate anything with lasting cross-project value (a reusable SOP, a calibration example, a process you will repeat) up to the parent workstation's Resources folder. Then archive the project subfolder so the workstation listing stays clean. In synced folders, follow `File Creation Rules.md`: copy the project to the parent workstation's `Archive/`, verify the destination, then delete the original. Do not use the root `99_Root Archive/` for workstation projects.

The payoff: the next time you run a similar project, the question "what did we do last time" has an answer. The completed project's SOP or notes are already sitting in the workstation Resources folder, ready to load.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._

[2026-07-17] Clarified project naming so Cowork calculates the current `YYQ#` from today's date and never copies an example prefix.
