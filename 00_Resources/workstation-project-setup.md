# Workstation and Project Setup

_Read this file when creating a new workstation or project._

---

## What Goes Where

Every file produced in a workstation session belongs in one of three places. Choose based on lifespan and reuse.

**Workstation Resources folder — permanent reference only.**
Material you'll pull from across many sessions. Describes how the domain works or what it uses. Examples: brand kits, positioning docs, outreach templates, pipeline frameworks, pricing sheets, capabilities one-pagers, contact intel for top targets. If it would be useful in a session six months from now, it belongs here.

**Project subfolder — time-bound, multi-session work.**
Work with a clear end state that spans multiple sessions. Spin up a project folder (with CLAUDE.md and MEMORY.md) inside the relevant workstation. Examples: a named pursuit you're actively working across multiple touches, a specific campaign, an event you're preparing for over weeks.

**_Outbox/ (OS root): one-off deliverables.**
Single-use outputs. Meeting briefs, one-time research, a single email draft. These do not belong in Resources or project folders. Those should only accumulate durable material. One-offs in Resources bloat the folder and dilute the signal of what's actually a reference. _Outbox/ is never read at session start and is purged on the quarterly audit (anything older than 90 days is deletable).

Before filing a one-off, check whether anything learned from it belongs in the workstation's MEMORY.md. Capture the durable insight, then put the file in _Outbox/. If you keep reaching for an _Outbox/ file across sessions, it was misrouted: promote it to the right Resources folder.

---

## Creating New Projects

When Brett asks to create a new project, create a subfolder inside the relevant workstation and add two items:

1. **CLAUDE.md** with these sections:
   - **Project Identity** — one paragraph: what this project is, what workstation it belongs to, what the end state looks like, and a link to any external project tracker (Asana, etc.)
   - **Workflow** — numbered steps for how to work inside this project across sessions
   - **Project Rules** — any rules specific to this initiative that layer on top of the workstation and root rules

2. **MEMORY.md** with this structure:
   - **Project Status** — task list organized by section or phase, updated as work progresses
   - **Key Decisions** — reasoning behind choices made during the project

Projects are time-bound. When complete, move the folder to _Archive/ at the OS root. The parent workstation keeps everything it learned.

**The test for creating a project:** Does the work have a clear end state or deliverable, and will it span multiple sessions? Yes to both — create a project. Otherwise, work directly in the workstation.

---

## Creating New Workstations

When Brett asks to create a new workstation, create a subfolder with the workstation name and add these three items inside:

1. **CLAUDE.md** with these sections in this order:
   - **Identity** — One paragraph: who you are in this workstation, what routes here, what doesn't.
   - **Resources** — Table with "Resource" and "Read when..." columns. Start empty.
   - **Workflow** — Numbered steps for the primary task. Start simple; refine over time.
   - **Editorial Rules** — Always opens with: "Follow my voice principles in 00_Resources (voice-principles.md)." Then add domain-specific writing rules that layer on top.

2. **MEMORY.md** with this structure:
   - Header: "[Workstation Name] Memory"
   - Sections: Contacts (people relevant to this domain) and Key Decisions (reasoning behind choices).
   - Populate over time as work progresses. Brett does not write this manually.

3. **[Workstation Name] Resources/** — Empty folder. This is where reference files for this domain go.

After creating the workstation, add a new row to the Routing Map in root CLAUDE.md so future sessions load it automatically.
