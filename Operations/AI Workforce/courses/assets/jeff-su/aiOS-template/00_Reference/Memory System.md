# Memory System

_How memory works in this workspace. The core rules (read `MEMORY.md`, writes need your approval, flag contradictions) live in root `CLAUDE.md`. This file holds the detailed mechanics. Does not contain voice rules (see `Voice Principles.md`) or file-placement rules (see `File Creation Rules.md`)._

---

**Bookkeeping exemption.** Three kinds of `MEMORY.md` writes do not need your approval, because they are routine bookkeeping rather than personal memories: changelog entries (written to `ARCHIVE.md`), Active Projects updates, and Scheduled Tasks updates. Write these as part of the normal workflow when the triggering event happens.

---

## Workspace Changelog

The changelog is a permanent, append-only log of milestones and completed work. Entries go directly in `ARCHIVE.md`, not root `MEMORY.md`, organized by month and week, most recent first. `ARCHIVE.md` is read only on demand, never at session start.

**Format:** `## [Month Year]`, then `### Week of [Month Day]`, then entries. Each entry is two sentences max: what changed, and optionally why it matters.

**Add an entry when:** a project completes, you set up a new workflow or scheduled task, or you make a structural change to the workspace.

---

## Capturing a memory

When something memory-worthy happens, propose the target `MEMORY.md` and exact entry. Never write without confirmation. Phrases like "remember this," "make a note," "save this," or "keep track of this" trigger the memory workflow; they count as approval to write only when the destination and content are unambiguous. If the request could belong in more than one `MEMORY.md`, contains high-stakes personal data, or is just a choice inside another workflow, ask before writing. Route area-specific facts to that workstation's `MEMORY.md`; route general "how I work" preferences to root. Once confirmed, write immediately and report what changed.

Memory cleanup is not the same as rule pruning. Preserve current project context, source mappings, durable decisions, and rationale a future session still needs. Compress or archive only under the rules below.

**Triggers:**

1. **Correction.** You adjust or reject something. Capture the underlying principle, not the incident.
2. **New convention.** You set a naming pattern, file structure, or repeatable process.
3. **New recurring contact.** Someone with an ongoing role comes up and is not already in memory.
4. **Preference signal.** You say "always," "never," "from now on," or "I prefer."
5. **Structural change.** You add a folder, reorganize, or add a scheduled task.

**Entry format:** one or two sentences, with the date as `[YYYY-MM-DD]`. Write the principle and its reason, not a description of the moment. If a new entry contradicts an old one, flag it and propose a replacement.

**Do not capture:** one-off task details, things already in memory, temporary states, or anything you call a one-time exception.

---

## Root MEMORY.md: the two living sections

Root `MEMORY.md` has two sections that need upkeep, so you get instant situational awareness at session start.

**Active Projects & Work** is a dashboard, not a source of truth. Each entry is a pointer: project name, workstation, one-line status, last-active date. The real detail lives in the project's own `MEMORY.md`. Cap each entry at two sentences. If you need more context to orient, it belongs in the project file, not here.

**Scheduled Tasks** lists your automated recurring tasks, grouped by status: Active, Paused, Retired. Update it when a task is created, changed, or retired. Keep each entry to a lean line: owner, cadence, mode, purpose, dates.

---

## Archiving and size

Memory files are read at session start, so every line costs context. Without limits, they grow until they slow things down.

- **One `ARCHIVE.md` per `MEMORY.md`.** When you archive, older entries move to an `ARCHIVE.md` in the same folder. Create it on the first archive; do not pre-create empty ones.
- **Rolling windows.** Root `MEMORY.md`: archive entries older than 30 days. Workstation and project `MEMORY.md`: 90 days. `ARCHIVE.md` has no window.
- **What never archives:** current-state content (contacts, active projects, key links, working conventions). Test: if removing it would lose awareness of something still true, it stays.
- **Leave a pointer** where you archive: `<!-- Entries before [DATE] archived to ARCHIVE.md. -->`.
- **Size ceilings:** root `MEMORY.md` 150 lines, workstation `MEMORY.md` 200 lines, `ARCHIVE.md` none. When a ceiling is hit, the fix is compression and archiving, never raising the ceiling.

A monthly cleanup pass, a scheduled task you set up later, handles archiving and compression automatically.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
