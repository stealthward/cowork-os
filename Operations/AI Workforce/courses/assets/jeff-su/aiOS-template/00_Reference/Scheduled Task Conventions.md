# Scheduled Task Conventions

_How scheduled tasks behave across your workspace: execution modes, prompt design, lifecycle, recency-first triage, and the no-duplicate-setups rule. Read this before creating or modifying any scheduled task. Does not contain the scheduled-task prompt skeleton (see `Workspace Templates - Scheduled Tasks.md`), skill behavior (see `Skill Conventions.md`), or the workflow for any specific task (that lives in each task's own prompt)._

---

## Execution Mode

Every scheduled task declares its execution mode when you create it. There are two.

- **Direct execution.** The task makes its updates autonomously and reports what it did. Use this for routine, reversible work: refreshing status text, syncing dates, updating a dashboard, triaging an inbox. If a task only ever does work that can be undone or corrected easily, there is no point making it ask first; it should just do the work and tell you.
- **Report-only.** The task presents findings and waits for your approval before changing anything. Use this for structural, governance, or irreversible work: archiving files, reorganizing the workspace, deleting content, consolidating records.

Declare the mode in the task's prompt. When in doubt, default to report-only.

**Post-approval caution for report-only tasks.** A report-only task shows you findings first. If you later approve a change that touches a high-risk surface (root `CLAUDE.md`, root `MEMORY.md`, a `00_Reference/` file, a skill, a scheduled-task prompt, or many files at once), the task should not silently execute it from inside an unattended run. It should hand that off to a regular working session where you can review the full edit. Approving "go ahead with all" approves the findings; it does not waive the review for high-risk edits. Small, single-file cleanups below that threshold can execute directly after approval.

---

## Prompt Design

Scheduled-task prompts run in isolation, with no memory of any earlier conversation. Design every prompt so it stands completely on its own.

- **Self-contained.** Put every file path, reference, and piece of logic the task needs directly in the prompt. Never write "the current conversation," "the above," or anything that points at context outside the prompt itself, because none of that context exists at run time.
- **Keep duplicated content in sync.** When a task prompt copies content from a reference file (a category list, an output format, a set of rules), the reference file is the source of truth and the task copy mirrors it. If you change one, change both in the same edit. Unsynced copies are how a task silently starts producing the wrong output.
- **Discover the workspace at run time.** Never hardcode a session-specific path. The folder where your workspace is mounted changes every run, so a path captured when you wrote the prompt will be wrong on every later execution. Have the prompt locate the workspace root dynamically at run time instead.
- **Declare scope and boundaries.** State plainly what the task updates and what it never touches. A clear boundary ("this task never modifies any file in folder X") prevents a routine run from doing something unexpected.
- **Handle edge cases.** Define what happens for new items (notify or auto-add), completed items (strike through or remove), and stale data (what to fall back to when a source is out of date).
- **Keep the full workflow inline.** A scheduled task carries its whole workflow in its own prompt rather than calling out to a skill. If you occasionally need an off-schedule run, trigger the task manually from the scheduled-tasks interface rather than keeping a parallel skill copy (see No Duplicate Setups).

For the section-by-section structure of a prompt body, see `Workspace Templates - Scheduled Tasks.md` > Scheduled Task Prompt Template.

---

## Lifecycle

A scheduled task moves through three states: active, paused, and retired. Manage state changes through the scheduled-tasks interface, and keep your records honest about what actually happened.

- **Change state in the tool, then document.** When you create, pause, or retire a task, make the change in the scheduled-tasks interface first, confirm it in the live task list, and only then note it in your records. Writing "retired" in a notes file is documentation, not action; the task keeps running until you actually stop it. If you cannot complete the change in the current session (for example, the interface does not expose a delete action), pause the task and leave a clear "pending: needs manual removal" note so the next session finishes the job.
- **Active.** The task runs on its schedule. Keep a one-line register entry for it (name, schedule, what it does, when it was created or last updated) so you always have a current inventory of what is running.
- **Paused.** The task is temporarily disabled but kept, for when you expect to resume it. Prefer pausing over deleting if there is any chance you will want it back.
- **Retired.** The task is no longer needed and is removed from the live list. Retire a task once its purpose is gone, rather than leaving dormant tasks accumulating.

---

## New and Completed Item Detection

When a scheduled task watches a set of items (projects, entries, pages):

- **New items: notify, do not auto-file.** The task flags new items in its output for you to review and classify. It does not silently add them to sections where you control the ordering or grouping.
- **Completed items: strike through, do not remove.** Completed items are struck through so you can see what changed. You remove them yourself when you are ready.

---

## Recency-First Triage

A task that iterates over a collection (projects, emails, pages, entries) should triage by recency before deep-reading any single item. Deep-reading every item on every run burns effort in proportion to the whole collection's size rather than to what actually changed, and on a long unattended run that can exhaust the working context with no one present to recover.

The pattern:

- Persist a small state file with a `last_run` timestamp.
- On each run, use lightweight signals first (file modification times, page last-edited times, date filters on a query) to find what changed since `last_run`.
- Deep-read only the items that changed. Leave unchanged items with their previous output as-is.
- Handle stale state: if `last_run` is missing or older than a sensible threshold (say, a week), do a full refresh instead.

This typically turns a routine run from "read everything" into "read the handful that changed," which is both faster and far less likely to run out of context.

---

## No Duplicate Setups

A given workflow lives in exactly one place: either a scheduled task or a skill, never both. Two copies of the same logic drift apart silently, and the divergence stays hidden until one of them produces wrong output.

The decision rule:

- If the workflow needs to run on a schedule, make it a scheduled task only. You can still trigger it manually from the scheduled-tasks interface when you need an off-schedule run, so a parallel skill copy is unnecessary.
- If the workflow only ever runs on demand, make it a skill only.

When you need both schedule-driven and ad-hoc runs, that is still one setup: a scheduled task with manual triggering.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
