# Cowork OS Guide

_Shared Core (team kit copy, scrubbed 2026-10-30)._

_Last updated: 2026-10-30_
_Owner: Brett Ward_

This document explains how the Cowork OS system is built, how to use it, and how to extend it. It is written for Brett and for any team member who needs to understand or operate within this system.

---

## What Is Cowork?

Cowork is a desktop application that connects Claude (Anthropic's AI) to your local files and external tools. Unlike a standard chatbot, Cowork has persistent memory — it reads files from your computer at the start of every session so it always knows who you are, how you work, and what's in progress.

The result is an AI that gets smarter the longer you use it. Every correction, decision, and preference that gets saved to a file carries forward automatically into every future session.

Cowork also connects to external tools via connectors: Gmail, Google Drive, Asana, Zoho CRM, and others. This means Claude can read your emails, check your Asana projects, and pull from Drive documents without you copying and pasting anything.

---

## The Three-Level Hierarchy

Everything in Cowork is organized in three levels. Think of it as concentric circles — each level adds more specific context on top of the one above it.

### Level 1: Root (Cowork OS Folder)

The root level applies to every session, no matter what you're working on. It contains:

- **CLAUDE.md** — the master rules file. Tells Claude how to behave, how to format responses, what never to do, and how to route tasks to the right workstation.
- **MEMORY.md** — the master facts file. Tracks who Brett is, the business model, the team, active projects, tools, and AI priorities. Capped at 150 lines.
- **ARCHIVE.md** — historical reference only. Not read at session start. Stores completed projects, inactive pipeline, and outdated entries moved from MEMORY.md. No size ceiling.
- **00_Resources/** — shared reference files that any workstation can pull from. Contains voice-principles.md, content-frameworks.md, workstation-project-setup.md, and this guide.
- **_Outbox/**: the default save location for one-off deliverables. Never read at session start. Purged on the quarterly audit: anything older than 90 days is deletable.
- **_Archive/**: completed project folders move here. Never read at session start; pulled up only when asked about historical work.

### Level 2: Workstations (Subfolders of Cowork OS)

Workstations are permanent domains — one per major area of work. Each one loads automatically when you're working in that domain. Each workstation contains:

- **CLAUDE.md** — workstation-specific rules, workflow, and editorial guidelines that layer on top of the root rules
- **MEMORY.md** — workstation-specific contacts, decisions, and context
- **[Workstation Name] Resources/** — reference files specific to that domain (SOPs, templates, playbooks, etc.)

Currently active workstations:

| Workstation | What It Covers |
|---|---|
| Email HQ | All email drafting, replying, reviewing, and organizing |
| Business Development | Prospects, pipeline, branding blueprints, show topics, BD strategy |
| Content & Authority | The Factory show, Rebuild podcast, reels, content planning, RTM client content strategy |
| Operations | Escrow team tooling, dashboards, Apps Script systems, finance Drive structure, CRM data integrity, client operational matters |

### Level 3: Projects (Subfolders of a Workstation)

Projects are time-bound initiatives that live inside a workstation. They have their own CLAUDE.md and MEMORY.md. When a project ends, the folder moves to _Archive/ at the OS root and the parent workstation keeps everything it learned.

**The test for creating a project:** Does it have a clear end state, and will you work on it across multiple sessions? Yes to both — create a project. Otherwise, just work in the workstation.

Currently active projects:

| Project | Workstation | End State |
|---|---|---|
| Real Talk Factory | Content & Authority | All Asana build-out tasks complete |
| REACH (Content Handbook) | Content & Authority | Complete, edited manuscript ready for publication |
| Rebuild | Content & Authority | Brett hosting, with format, production rhythm, and guest pipeline running from the workstation |

---

## How the Memory System Works

The memory system is the most important concept to understand. There are two types of files, and they serve different purposes.

**CLAUDE.md files contain rules** — instructions that prescribe behavior. Look for words like "always," "never," "before doing X do Y." These tell Claude how to act. If you want Claude to always do something a certain way, it belongs in a CLAUDE.md.

**MEMORY.md files contain facts** — information about the world that changes over time. Contact details, project status, decisions made, things Brett has asked Claude to remember. If it's a fact that could be outdated next month, it belongs in a MEMORY.md.

**The two trigger phrases:**

- **"Add a rule"** — use this when you want Claude to always or never do something. Goes to CLAUDE.md. Example: "Add a rule: default to Word docs for anything outside the OS folder."
- **"Remember this"** — use this when you want to save a fact, contact, decision, or status update. Goes to MEMORY.md. Example: "Remember this: Henish's transaction closed 2026-05-20."

When in doubt: if the sentence contains "always," "never," or "before doing X do Y," it's a rule. If it could be outdated next month, it's a memory.

**Memory rules (enforced automatically):**
- Each memory entry is two sentences max.
- Root MEMORY.md stays under 150 lines. When it hits the ceiling, compress verbose entries first, then archive older items.
- Current-state content (active projects, contact info, working conventions) stays in MEMORY.md regardless of age.
- When a project completes or an entry becomes outdated, it moves from MEMORY.md to ARCHIVE.md automatically.

**Session audits:** At the end of any session, say "audit this session." Claude will scan for corrections, preferences, and decisions that came up during the session but weren't saved yet, and propose where to write them. You approve or skip each one.

---

## How to Start a Session Correctly

This is the single most common point of failure. If you skip these steps, Claude won't have access to your files.

There are two ways to connect, and they both require the same rule: the connected context must be the Cowork OS root folder, never a subfolder.

**Option A — Quick thread (one-off work):**

1. Open Cowork, start a new thread
2. Connect it to the Cowork OS root folder
3. Open by naming the workstation or project you're working in

**Option B — Cowork Project (recommended for ongoing efforts):**

Cowork's native Projects (left nav) group related threads into one workspace so you can bounce between them without scrolling the side panel.

1. Left nav, Projects, "+", then "Use an existing folder"
2. Set the Project's Context folder to the Cowork OS ROOT folder, not the subfolder. The root contains every workstation and project, so one context folder loads your root CLAUDE.md, MEMORY.md, 00_Resources, and the project files together. Pinning a subfolder instead would drop your root context.
3. Keep a single context folder (the root) to avoid the "choose which folder" picker selecting the wrong scope.
4. Start each thread inside the Project and name the workstation/chapter in your opener so routing loads the right files.

Verified pattern: the REACH Book project groups all chapter threads, with its Context folder set to the Cowork OS root.

Known constraint (verified 2026-08-12): a project's context folder is effectively fixed at creation. The picker will not switch an existing project to a different folder. To fix a mispinned project, create a new project with the correct folder (the Cowork OS root), rename the old one, and retire it after auditing any threads that held real work.

Example openers:
- "Working in Business Development today."
- "Content and Authority, Real Talk Factory project — let's review the Asana tasks."
- "Email HQ — here's an email I need to clean up."

The folder connection persists for the life of that thread. You do not need to reconnect mid-session. For ongoing work in one domain, keep a single thread open rather than starting new ones — this preserves context and reduces setup friction.

---

## The Routing System

The routing table in root CLAUDE.md tells Claude which workstation to load based on what you're working on. When you mention email, it loads Email HQ. When you mention a prospect or the show, it loads the right workstation.

You never need to manually manage this. The routing happens automatically based on what you say. If you want to be explicit, just name the workstation at the start of your message.

Above the workstations sit seats: briefs the session wears when you address one (chief of staff, COO, CMO). A seat talks to you and dispatches workers, which are subagents that run separately and report back. The seat table in root CLAUDE.md sits above the workstation table.

Current routing table:

| Workstation | Loads when you... |
|---|---|
| Email HQ | ...need to draft, reply to, review, or organize any email |
| Business Development | ...work on prospects, pipeline, partner outreach, strategic partnerships, or BD strategy |
| Content & Authority | ...work on any show (The Factory, Rebuild, SDMM, List It Live), reels, transcripts, show topics, guest research, content planning, or RTM client content |
| Operations | ...work on team tooling, dashboards, Apps Scripts, finance Drive structure, CRM data integrity, or client operational matters |

---

## How Context Flows

Threads share nothing with each other except what is written to disk. A thread gets exactly two inputs at start: the connected folder (always the Cowork OS root) and its app Project's instructions. There is no other channel between sessions.

Three layers, three jobs:

- **The OS folder on disk** is the single source of truth. Permanent, shared by every session.
- **Threads** are working sessions. Chat history is invisible to every other thread.
- **App Projects** (desktop or claude.ai) are thread organizers. They pin a context folder and carry short instructions. They store no work.

Rules that keep the system coherent:

1. Every Cowork app Project pins the OS root as its context folder. Never a subfolder.
2. App Project instructions stay thin: one or two lines of routing. Rules live in CLAUDE.md files; facts live in MEMORY.md.
3. Nothing durable dies with a thread. End working sessions with "audit this session" so learnings write back to disk.
4. Structure registers at creation time: new workstations and OS project folders get their MEMORY.md registry row and File Map entry in the same session that creates them.

Claude.ai projects cannot connect the OS folder. Deliberate ones are satellites: registered in root MEMORY.md, with context authored in the OS and pushed one way into the satellite's project knowledge. An unregistered satellite is a drift risk, because work done there never reaches the rest of the system.

---

## Connected Tools (Connectors)

Connectors give Claude access to external tools and platforms. Once connected, Claude can read from and write to these tools without you copying and pasting.

Currently connected:

| Connector | What It Does |
|---|---|
| Gmail | Search threads, read emails, draft replies |
| Google Calendar | Read and create events |
| Google Drive | Search files, read documents and spreadsheets |
| Asana | Read projects, check task status, update tasks |
| Zoho CRM | Read and update CRM records |
| Smartsheet | Read escrow team sheets that feed the revenue dashboards |
| Plaud | Pull show recordings and transcripts for cut sheets |
| Tracerfy | Skip tracing and property owner lookups |
| Apify | Web scraping actors for research |
| Canva | Read and create designs; all brand kits, logos, and RTM-produced assets for FSE and RTM live here |
| Claude Docs | Create and edit living documents from Claude |
| Miro | Production process maps and per-show boards |

To use a connector in a session, just reference the tool naturally ("check my Asana project" or "search Gmail for the thread with Henish"). Claude will pull the tool it needs.

---

## What Each Workstation Tracks

Each workstation's MEMORY.md and Resources folder hold the current contents. This section describes the categories, what kind of thing lives where. The specifics live in MEMORY.md.

### Email HQ
- Key contacts organized by relationship type
- Greeting and sign-off conventions
- Format rules by recipient type
- CC and routing protocols

### Business Development
- Active prospects and pipeline
- Referral partners and key relationships
- Show details and production cadence
- BD editorial rules
- Brand assets and brand reference materials

### Content & Authority
- Workflows for each show and content type
- Frameworks applied to RTM client content (see content-frameworks.md)
- Links to live trackers and reference documents

### Operations
- Systems inventory: dashboards, Apps Scripts, Drive structures, CRM sync
- Process documentation and SOPs
- Client operational matters

### Projects (inside a workstation)
- Current task structure and assignments
- Decisions made during the project
- Link to live source of truth (Asana, etc.) when one exists

---

## Extending the System

### Adding a Workstation

When you need a new domain, ask Claude: "Create a [Name] workstation." Claude will build the CLAUDE.md, MEMORY.md, and Resources folder, then add a row to the routing table automatically. The workstation follows the same pattern as all existing ones.

### Adding a Project

When a piece of work has a clear end state and spans multiple sessions, ask Claude to create a project inside the relevant workstation. Claude will build the CLAUDE.md and MEMORY.md, and you provide the Asana link if one exists.

### Adding a Resource File

When you have a document, framework, or reference that should be available to a workstation, drop the file into that workstation's Resources folder and add a row to the workstation's CLAUDE.md resource table. Examples: SOPs, playbooks, brand guides, template scripts.

---

## Deploying Cowork to Team Members

This is a future-state capability. The architecture is designed for it, but each person needs their own setup.

What gets shared: the folder structure, CLAUDE.md templates, and this guide. What stays personal: each person's own MEMORY.md files, contacts, and accumulated context.

The deployment model is a franchise: same system and architecture, personalized per user. When ready to deploy to a team member, the process will be:

1. Create a copy of the folder structure with empty MEMORY.md files
2. Run a context interview for that person to populate their files
3. Connect their tools (Gmail, Asana, etc.)
4. Walk them through the session startup process

---

## Terminology Glossary

| Term | What It Means |
|---|---|
| Cowork OS | The name for the entire folder system that lives on your computer |
| CLAUDE.md | A rules file. Tells Claude how to behave. Lives at root, workstation, and project levels. |
| MEMORY.md | A facts file. Stores context that can change over time. Lives at root, workstation, and project levels. |
| Workstation | A permanent folder for one domain of work (Email HQ, Business Development, etc.) |
| Project (OS project) | A time-bound folder inside a workstation for a specific initiative with a clear end date |
| App Project | A thread grouping in the Claude app (desktop or claude.ai). Organizes threads and pins a context folder; stores no files. Not the same as an OS project folder. |
| Satellite | A deliberate claude.ai project registered in root MEMORY.md. Its context is authored in the OS and pushed to the satellite one way. |
| Connector | An integration that gives Claude access to an external tool (Gmail, Drive, Asana, Zoho) |
| Routing | The system that automatically loads the right workstation based on what you're working on |
| Session audit | End-of-session review that finds uncaptured learnings and proposes saving them |
| Skill | An installable capability that adds a specific behavior (e.g., the session audit skill) |
| Seat | An executive brief in .claude/skills/ that the session wears; talks to you and dispatches workers |
| Worker | A subagent in .claude/agents/ under a seat; separate context, restricted tools, reports back |
| Artifact | A live, persistent HTML page that pulls fresh data from connectors each time it's opened |
| "Add a rule" | A trigger phrase that immediately saves a behavioral instruction to the appropriate CLAUDE.md |
| "Remember this" | A trigger phrase that immediately saves a fact or update to the appropriate MEMORY.md |
| ARCHIVE.md | Historical reference file at root. Not loaded at session start. Stores completed projects and outdated entries. |
| 00_Resources | A shared folder at the root level for reference files used across all workstations |

---

## File Map

```
Cowork OS/
├── CLAUDE.md                              (root rules)
├── MEMORY.md                              (root facts — 150-line ceiling)
├── ARCHIVE.md                             (historical reference — not loaded at session start)
├── .claude/skills/                        (Code-only skills; Cowork reads the account-level copies)
│   ├── session-audit/SKILL.md             (end-of-session write-back)
│   ├── handoff/SKILL.md                   (writes in-flight state to the project Session Plan)
│   ├── reconcile/SKILL.md                 (draft vs sent diff, smallest rule change)
│   ├── factory-cut-sheet/SKILL.md         (Factory episode cut sheet pipeline)
├── _Outbox/                               (default save location for one-off deliverables, purged quarterly)
├── _Archive/                              (completed and shelved material, not loaded at session start)
│   ├── 60-Day Offshore Design Build/      (archived 2026-10-30: 8/12 Instagram builds, rollout plan)
│   └── branding-blueprint-system.md       (shelved BD offering spec)
├── 00_Resources/
│   ├── voice-principles.md                (how you write and sound; starts as a blank template)
│   ├── acronyms.md                        (Shared Core: internal shorthand, show codes, team nicknames, tool names)
│   ├── audience-personas.md               (Shared Core: the three avatars, segment and person profile each)
│   ├── rtm-product-library.md             (Shared Core: the products, retention versus acquisition, funnel stage fit)
│   ├── asana-conventions.md               (Shared Core: sections, fields, dates, subtasks, what an agent may do in Asana)
│   ├── zoho-conventions.md                (Shared Core: Zoho modules, who writes what, field classes, what an agent may do in Zoho)
│   ├── smartsheet-conventions.md          (Shared Core: team sheets, what depends on them, reading rules, what an agent may do in Smartsheet)
│   ├── apps-script-conventions.md         (Shared Core: projects, standard build, ship path, triggers and secrets, what an agent may do in Apps Script)
│   ├── drive-conventions.md               (Shared Core: where files go, naming, reading rules, decluttering, what an agent may do in Drive)
│   ├── content-frameworks.md              (REACH + StoryBrand principles)
│   ├── workstation-project-setup.md       (scaffold instructions for new workstations/projects)
│   ├── five-star-brand-summary.md         (Five Star colors, fonts, values)
│   ├── 2026-Five-Star-Escrow-Brand-Kit.pdf (Five Star full brand reference)
│   ├── users-guide.md                     (Brett's day-to-day operating reference)
│   ├── cowork-vs-code.md                  (which tasks run in Cowork vs the Code tab)
│   └── cowork-os-guide.md                 (this document)
├── Email HQ/
│   ├── CLAUDE.md
│   ├── MEMORY.md
│   └── Email HQ Resources/
│       ├── gmail-triage-system.md         (triage system spec, harvested 2026-08-12)
│       ├── triage-state.json              (triage dedup state, written by the scheduled task)
│       └── triage-run-log.md              (triage run audit trail)
├── Business Development/
│   ├── CLAUDE.md
│   ├── MEMORY.md
│   ├── Business Development Resources/    (empty; brand assets moved to 00_Resources 2026-08-12)
│   ├── Investor Database/                 (active project: shared investor registry, canonical source files and workbook exports)
│   │   ├── CLAUDE.md
│   │   └── MEMORY.md
│   └── REInvest/                          (active project: quarterly investor workshop series, partner materials and deck master)
│       ├── CLAUDE.md
│       └── MEMORY.md
├── Content & Authority/
│   ├── CLAUDE.md
│   ├── MEMORY.md
│   ├── Content & Authority Resources/
│   ├── Real Talk Factory/
│   │   ├── CLAUDE.md
│   │   └── MEMORY.md
│   ├── Rebuild/                          (active project: show build-out, guest briefs)
│   │   ├── CLAUDE.md
│   │   └── MEMORY.md
│   └── REACH - Content Handbook/
│       ├── CLAUDE.md
│       ├── MEMORY.md
│       ├── 00-book-bible.md
│       ├── 01-outline.md
│       ├── 02-audience-positioning.md
│       ├── 03-frameworks-and-style.md
│       ├── manuscript/          (per-chapter .md drafts: 00-raw-notes, 01–09)
│       └── source-material/
└── Operations/
    ├── CLAUDE.md
    ├── MEMORY.md
    ├── Dashboards/                        (evergreen system folder: canonical Apps Script sources, system docs, changelog)
│   │   ├── CLAUDE.md
│   │   ├── MEMORY.md
│   │   ├── CHANGELOG.md
│   │   ├── docs/                          (system reference, dashboard inventory, data dictionary, decision log)
│   │   ├── src/                           (mirrors of the deployed Apps Script projects)
│   │   ├── tools/                         (one-off finance Drive utility scripts, records of completed work)
│   │   └── archive/                       (historical versions, never deployed from)
│   ├── Portal Rebuild/                    (active project: replace the Google Sites portal with a config-driven Apps Script web app)
│   │   ├── CLAUDE.md
│   │   ├── MEMORY.md
│   │   └── portal-inventory.md            (page-by-page map of the current Sites portal)
│   ├── AI Workforce/                      (active project: agent workforce, model rules, systems registry, team rollout kit)
│   │   ├── CLAUDE.md
│   │   ├── MEMORY.md
│   │   ├── roadmap.md                     (phased plan with approval gates)
│   │   ├── model-selection.md             (model tiers, pricing, contingency rules, model map)
│   │   ├── systems-registry.md            (every system and workspace; source for the registry page)
│   │   ├── registry-page/                 (render.py, template, links.json, activity-snapshot.json; builds the live registry page)
│   │   ├── production-flow-map.md         (draft of the content production flow from Asana, validated with Elizabeth)
│   │   ├── courses/                       (one intake file per course, comparison matrix, assets/ per course)
│   │   ├── assets/chatgpt/                (verbatim exports of the team's ChatGPT project instructions, migration source)
│   │   ├── assets/gpts/                   (verbatim exports of Brett's custom GPT instructions, migration source)
│   │   ├── drafts/                        (roster proposal, captions skill spec, autonomy boundaries, awaiting approval)
│   │   └── templates/                     (agent file and eval templates)
    └── Operations Resources/
        └── finance-system-reference.md    (FSE finance dashboard system)
```
