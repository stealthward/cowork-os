# Workspace Templates - Scheduled Tasks

_The structural contract for a scheduled-task prompt body. Read this before creating or materially modifying a scheduled-task prompt. Does not contain scheduled-task execution modes, lifecycle, or triage rules (see `Scheduled Task Conventions.md`), skill structure (see `Workspace Templates - Skills.md`), or the workflow for any specific task (that lives in each task's own prompt)._

---

## Scheduled Task Prompt Template

Every scheduled-task prompt follows the same six-section structure, in order. All six sections are required. The value of the standard is consistency: any task can be understood by reading the same six sections in the same order.

### 1. Frontmatter

YAML frontmatter with a `name` and a `description`.

```yaml
---
name: task-id
description: One-sentence summary of what the task does.
---
```

Note: when you edit a task through the scheduled-tasks interface, the prompt body you write starts at `## Context Loading`; the interface supplies the name and description from the task's own fields. Set the name and description in those fields rather than pasting a frontmatter block into the prompt body, or the task can end up with the frontmatter twice.

### 2. Context Loading

Which workspace files to read before doing anything, using dynamic path discovery. This section ensures every run loads its workspace context the same way.

Required elements:

- Dynamic workspace-root discovery. Never hardcode a session-specific path.
- An ordered list of files to read: the owning workstation's `CLAUDE.md`, its `MEMORY.md`, and any reference files the task depends on.
- A closing "floor, not ceiling" line, so the run knows the listed files are the minimum and that root `CLAUDE.md` triggered reads still apply mid-run (for example, the codification governance file before proposing any rule or memory change, and the owning workstation's files for any item routed through it).

Example:

```markdown
## Context Loading

Discover the workspace root dynamically rather than hardcoding a path.

Read these files before proceeding:
1. `[Workstation]/CLAUDE.md` - identity, workflow, and domain rules
2. `[Workstation]/MEMORY.md` - accumulated context and current state
3. `[Workstation]/[Workstation] Resources/[Resource].md` - task-specific reference

This list is the floor, not the ceiling: triggered reads from root CLAUDE.md
still fire mid-run.
```

### 3. Role and Scope

One to three sentences covering what the task does, its execution mode (`direct execution` or `report-only`), and what it explicitly does not touch.

Example:

```markdown
## Role and Scope

Weekly structural check of all workstation CLAUDE.md and MEMORY.md files.
Report-only: present findings and wait for approval before making any change.
Does not touch root CLAUDE.md or the governance files.
```

### 4. Steps

Numbered, sequential steps. Each step has a clear verb and a defined output or decision point. Group parallel operations explicitly.

Checklist:

- Start with context-loading and source-verification checks.
- Name every source, workspace file, or tool the task must inspect.
- State what the task changes directly and what it only reports.
- If the task can lead to edits on a high-risk surface (root files, reference files, skills, or scheduled-task prompts), include the post-approval caution from `Scheduled Task Conventions.md` so those edits hand off rather than execute unattended.

### 5. Output Format

What you see when the task completes. Default to the standard findings format for any task that surfaces findings, recommendations, changes, or status.

Embed the format inline, since the task runs in isolation with no other context:

```markdown
**[Number]. [Action-first headline]**
- **Context:** [1-3 sentences, concrete and specific]
- **Proposed action:** [forward-looking specifics]
```

When findings are grouped into sections, use one continuous number sequence across the whole output; do not restart numbering inside each group.

A task that does not surface findings may use a task-specific format, but document that format explicitly here. For a task that writes to a destination, name the destination and the append method here.

### 6. Constraints

Guardrails, edge cases, and things the task must never do. Include any pre-output verification checks.

Common constraints:

- Never hardcode a session-specific path.
- Never imply a live fetch happened unless the task actually fetched the source.
- Do not edit high-risk files after report-only approval; hand those off instead.
- If a source cannot be verified, state the limitation and mark the affected item as blocked or report-only.
- Run a final voice-and-formatting check before output if the task presents prose.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
