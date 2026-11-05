<!--
SESSION-START ESSENTIALS (loaded every fresh chat)
- Read root MEMORY.md first.
- Route by subject ownership before task type.
- Read the owning workstation's CLAUDE.md and MEMORY.md in full.
- Read the active project's CLAUDE.md and MEMORY.md when a project applies.
- Load every triggered reference file before acting.
- Read Voice Principles before any output meant for you or your audience.
- State what you loaded and which rules govern the output before starting.
-->

# [NAME]'s Cowork Hub

This is your main Claude Cowork workspace, the central hub for all your projects, planning, and work sessions. It is organized into workstations, one for each area of your work and life, and each workstation has its own identity, workflow, and memory.

**In this file, the only thing you need to change is `[NAME]` in the title above.** Nothing else here needs editing; other files in the package will ask you to fill in more.

---

## Session Gate

**Before responding to any task:**

1. **Read the root `MEMORY.md`** so you start with current context.
2. **Identify the owner before routing.** Does the request name or imply an active project, area, or recurring workstream? Check the Active Projects list in root `MEMORY.md` first. Subject ownership beats keyword matching.
3. **Route through the owning workstation.** Read its `CLAUDE.md` and `MEMORY.md` in full. If the output format belongs to a different workstation, load the owning workstation for the "what" and "why" and apply the format workstation's rules for the "how."
4. **Load the active project** if one applies. Read both its `CLAUDE.md` and `MEMORY.md` before producing output. The root `MEMORY.md` entry is a pointer, not enough working context on its own.
5. **Load any triggered reference file, and scan the workstation's and project's Resources folders** for anything that could improve the output, before you draft, advise, or report.
6. **Read `00_Reference/Voice Principles.md` in full before any output meant for you or your audience** (drafts, briefings, analysis, and conversational explanations). Time pressure, quick prep, or remembered preferences are not exceptions: load it and run its rules as the final check.
7. **State which files you loaded and which rules govern the output** before you start.

**No blind truncation.** When you read a file for the first time in a session, read it in full. Only set a line limit when you already read the file earlier in the same session, or when you are targeting a specific section of a file you know is very long.

---

## Memory System

- Use what you find in memory to inform the work. Do not announce it, just be informed by it.
- **Memory writes need your approval.** Propose the target `MEMORY.md` and exact entry when something memory-worthy happens, but never write without confirmation. Phrases like "remember this," "make a note," "save this," or "keep track of this" trigger the memory workflow; they count as approval to write only when the destination and content are unambiguous. For high-stakes personal data, including health, financial, legal, identity, or safety information, state the target `MEMORY.md` and exact entry before writing, even if the destination and content seem obvious. Choosing an option, continuing a workflow, or giving new facts is not approval to edit memory. Once approved, write it immediately and confirm.
- **Memory is not deleted.** Entries stay until you ask to remove or change them, or until they age out into `ARCHIVE.md`.
- **Flag contradictions.** If a new memory conflicts with an existing one, do not silently overwrite it. Flag the conflict and ask how to reconcile it.
- Full memory rules (what to capture, the entry format, archiving) live in `00_Reference/Memory System.md`.

---

## Workspace Hierarchy

The workspace has three levels. Each has its own `CLAUDE.md` (instructions), `MEMORY.md` (accumulated context), and Resources folder. Rules and context flow downward: projects inherit from workstations, and workstations inherit from root.

- **Root** (this level) owns universal rules (routing and governance) and cross-cutting context. Root `MEMORY.md` holds your active projects, recurring tasks, and durable facts about you. `ARCHIVE.md` holds the changelog. `00_Reference/` holds reference material used across workstations.
- **Workstation** owns the reusable methodology for one area: its workflows, principles, and rules. Its `MEMORY.md` holds that area's accumulated decisions and learnings. Its Resources folder holds that area's reference material.
- **Project** owns the constraints that only matter for one time-bound effort. Its `MEMORY.md` holds project status, sources of truth, and working essentials. Its Resources folder holds project reference material.

The test for levels 2 and 3: if something you learned applies to all future work in an area, it belongs in the workstation; if it only makes sense for this one effort, it belongs in the project. Every active project gets its own subfolder with a `CLAUDE.md`, `MEMORY.md`, and Resources folder (see `00_Reference/Workspace Templates - Projects.md`).

---

## Routing

**Root is for cross-workspace context only.** Anything specific to one area lives in that workstation, not at root.

**Project status doubles as a label.** A project is **Not Started** (scaffolded for future ideas, no active work yet), **WIP** (one person can do it themselves), or **Focus** (bigger, may involve multiple people or streams).

**Two kinds of reference material.** Files in `00_Reference/` apply to the whole workspace. Files in a workstation's Resources folder apply only to that area. When you add a new reference file, put it at the level where it is used.

### Routing Map

Use this map to pick the workstation for any task. These are the pre-built workstations; keep the ones that fit your work, and rename or remove the rest.

| Workstation | Route here when you... |
|---|---|
| **Comms HQ** | ...draft, reply to, review an external message, or triage your inbox: email, WhatsApp, LinkedIn DMs, and similar. |
| **LinkedIn HQ** | ...write native LinkedIn posts: hooks, formatting, and comment replies. |
| **Newsletter HQ** | ...produce an edition of your newsletter. |
| **Dark Console Studio** | ...produce visual content in a dark, technical style, such as animations or static graphics. |
| **Personal Finances** | ...handle personal money: budgeting, spending, savings, investments, insurance premiums or claims, coverage decisions, or personal tax. |
| **Health** | ...work on health and wellness: fitness, sleep, checkups, doctor visits, health records, or health insurance cards used during care. |
| **Housing** | ...handle property matters: mortgage, maintenance, property insurance, or apartment admin. |
| **Travel** | ...plan or book a trip: flights, hotels, and itineraries. |
| **Friends & Family** | ...handle friends and family: visits, gatherings, occasions, and milestones. |
| **Clarity Partner** | ...need a thinking partner to structure ideas, outline, or organize complex thoughts. |

### Routing Rules

- **Route by subject, then by action.** If the request names a project or area you have set up, route to its owner before matching on the type of task.
- **Cross-workstation tasks.** Load the workstation that owns the context (the what and why) and apply the rules of the workstation that owns the format (the how). For example, a LinkedIn post that needs a matching graphic loads LinkedIn HQ for the post and Dark Console Studio for the visual.
- **No workstation fits?** Use the closest one, or create a new workstation from `00_Reference/Workspace Templates - Workstations.md`.
- **Capture at the point of use, not the point of discovery.** When you create a reusable artifact, note, prompt, template, checklist, reference file, or resource, put the main copy where it will be acted on next. Project resources go in the project Resources folder, area resources go in the workstation Resources folder, and cross-workspace resources go in `00_Reference/`. The test: if you would not think to look there when doing the task later, it is in the wrong place.
- **Save memory at the right level.** Cross-cutting facts go in the root `MEMORY.md`, area facts go in the workstation's `MEMORY.md`, and project facts go in the project's `MEMORY.md`.
- **Temporary or scratch files** go in `98_Temp/`, never inside a workstation folder.

### High-Risk Routing Guardrails

These triggers are mandatory, not suggestions:

- **Gmail or inbox triage:** Load `Comms HQ/CLAUDE.md` and `Comms HQ/Comms HQ Resources/Gmail Triage Workflow.md` before reading Gmail, labeling, archiving, drafting replies, or summarizing inbox actions.
- **Google Calendar, Drive, Docs, Sheets, or Gmail connector work:** Load `00_Reference/Google Workspace Conventions.md` before using the connector or writing to the surface.
- **File or folder organization:** Load `00_Reference/File Creation Rules.md`. When organizing an existing file system or mounted Drive folder, also load `00_Reference/Area-First PARA Framework.md` before proposing destinations.
- **Notion operations:** Load `00_Reference/Notion Conventions.md` first, without exception, before any Notion search, read, write, or rule capture.
- **Outbound messages:** Load `Comms HQ/CLAUDE.md` before drafting, replying to, reviewing, or transforming any 1:1 message. Load the channel-specific resource too when known: `Comms HQ/Comms HQ Resources/Email Comms.md` for email, and `Comms HQ/Comms HQ Resources/WhatsApp Comms.md` for WhatsApp or short-bubble DMs. For declines, deflections, or other recurring message types, also load any topical Comms HQ reference file you have added for that pattern. Draft in chat by default. Do not create Gmail drafts, send messages, or apply labels unless you explicitly ask for that action.
- **Drafting anything a person will read:** Load `00_Reference/Voice Principles.md` in full before writing the first line of any email, message, reply, status update, post, summary, script, or document text, and run its Core Rules as the final check before delivering. This applies even when the task looks small enough to answer directly. If a draft was produced without loading it, stop, load it, and redraft before delivering.

---

## Governance

Every rule lives in exactly one place, with no duplication across files. This is what keeps rules from scattering or contradicting each other.

- **Root `CLAUDE.md`** owns universal rules and routing.
- **Root `MEMORY.md`** owns cross-cutting context, never rules.
- **Workstation `CLAUDE.md`** files own their area's rules.
- **`00_Reference/`** files own detailed how-to material, loaded only when triggered.

When you add a new rule, put it at the level where it applies. If you are unsure where it belongs, ask. When you move a rule, leave a one-line pointer at the old spot so the trail is clear. How to write and place rules is covered in `00_Reference/Governance Rules - Codification.md`.

---

## Reference Index

These references live in `00_Reference/` as shipped files or lesson-built outputs. Their "read when" triggers are mandatory routing, not suggestions.

**Voice & identity**
- `Voice Principles.md`: how your writing should sound. Read before any output meant for you or your audience.
- `Personal Profile.md`: your locale defaults, contact details, booking link, and bios. Read before output that needs them, including any time you ask Cowork to add your booking or scheduling link to a message.
- `Audience Persona.md`: who your content is for. Read before audience-facing or campaign content.

**Copywriting**
- `Edwards Copywriting Frameworks.md`: feature-to-benefit and sales-letter frameworks. Read when writing sales, launch, or campaign copy.
- `Hook Psychology Meta-Patterns.md`: title, subject-line, and hook patterns. Read when writing any hook, title, or subject line.

**Memory & governance**
- `Memory System.md`: what to capture, the entry format, and archiving.
- `File Creation Rules.md`: where new files go, and when to ask before creating one.
- `Governance Rules - Codification.md`: how to write and place new rules.
- `Governance Rules - Verification.md`: checking sources and canonical surfaces before generating.
- `Governance Rules - Communication.md`: output standards, handoffs, and approval gates.

**Conventions & templates**
- `Workspace Templates - Reference Files.md`: the contract for writing a new reference file.
- `Workspace Templates - Workstations.md`: the workstation `CLAUDE.md` and `MEMORY.md` pattern.
- `Workspace Templates - Projects.md`: the project subfolder pattern.
- `Workspace Templates - SOPs.md`: the contract for writing a standard operating procedure.
- `Workspace Templates - Skills.md`: the `SKILL.md` template.
- `Workspace Templates - Scheduled Tasks.md`: the scheduled-task prompt skeleton.
- `Workspace Templates - Source Indexes.md`: the source-index pattern. (Bonus.)
- `Skill Conventions.md`: how skills install and behave.
- `Scheduled Task Conventions.md`: how scheduled tasks are designed and run.

**System & connectors**
- `Area-First PARA Framework.md`: how to organize files and folders. When this file exists, load it for Drive placement and cleanup work; its source is `00_Reference/Source PDFs/PARA for Google Drive by Jeff Su.pdf`.
- `Google Workspace Conventions.md`: working with Gmail, Drive, Calendar, Docs, and Sheets.
- `Notion Conventions.md`: working with Notion pages and databases.
- `Workspace Structure Tree.md`: what the finished workspace looks like.
- `00_Reference/Source PDFs/` folder: reference PDFs you own go here; read `00_Reference/Source PDFs/How to use Source PDFs.md` for the extract-don't-load pattern. Your own PDFs stay local and are not redistributed.

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
