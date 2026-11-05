# Course Intake: The Cowork Academy (Jeff Su)

_Reviewed 2026-09-17 from the lesson pages (key takeaways, resource prompts, and Jeff's answers in the comment threads). The videos have no on-page transcripts, so the video walkthroughs themselves were not read. Summarized in my own words. Brett has not started the paid course; he completed the free seven-day Cowork Toolkit in May 2026, and the Cowork OS is built on it._

## Source

- Instructor: Jeff Su
- Platform and access: academy.jeffsu.org, Kajabi, Brett's membership, signed in on the same Chrome profile as Allie's course
- Date reviewed: 2026-09-17
- Modules covered: all eight (23 lessons and progress checks). Downloads not fetched: the AI Command Center starter template, connector rulebooks, skills templates, Career HQ, Clarity Partner workstation, Business Ops prompts. Each is a zip behind a lesson download button and needs your go-ahead to pull down.

## Their recommended buildout

One folder, mounted at the root in Claude Cowork, that Cowork reads at the start of every session. Root CLAUDE.md holds standing rules, a session gate (load root files, route to the right workstation, load its files, state what loaded), a routing map, and a reference index with plain-English "read when" triggers. Root MEMORY.md is a live dashboard under 150 lines; ARCHIVE.md is the history. Workstations are permanent experts, one per ongoing area, each with CLAUDE.md, MEMORY.md, and Resources. Projects are temporary jobs inside a workstation with a finish line. Connected tools get a conventions file, not a workstation. Repeated work becomes a skill; time-triggered work becomes a scheduled task, run locally, report-only first; corrections become rules through a codification gate that prefers rewriting or deleting an old rule to adding a new one. Audit skills (session, reference file, workstation, root memory) keep the files clean. Migration is filtered, not wholesale. Everything is Cowork; Claude Code, agents, subagents, per-agent models, evals, and team rollout are out of scope by Jeff's own statement.

This is the system Brett already runs. The paid course is a more disciplined version of the free toolkit the OS was built from: same layers, more governance, more audits, and a migration method.

## By topic

| Topic | What they recommend | Fits our OS? | Notes |
|---|---|---|---|
| Agent structure | None. One Cowork session with the root mounted; workstations are the "experts." No agents, no subagents. Jeff says the file structure carries to Claude Code because it reads layered CLAUDE.md files, but connectors, permissions, skills, scheduled tasks, and demos do not transfer one to one. | Already built (knowledge layer) | Confirms the knowledge layer is sound. Silent on the workforce layer. Allie's course owns that row. |
| Model assignment and cost | Start on the latest Opus, high effort, thinking on; adjust down once you know which tasks need less. No per-task or per-agent model rules. | Partly | Matches our "try effort before model" rule for interactive sessions. Nothing for agents. |
| Management surface | Root MEMORY.md as the dashboard, a weekly report-only scheduled task that audits it (stale items, entries to archive, unregistered scheduled tasks, rules hiding in memory, missing source-of-truth pointers). A student built an HTML artifact of all projects and next steps, which Jeff endorsed. | Yes | Our Phase 3 dashboard and systems registry, with a maintenance regime we lack: scheduled audits of the files themselves. |
| Memory and context | Session gate and force-load prompt; reference index with read-when triggers; Source PDFs folder plus a lightweight Markdown extract one level up; numbered folders (00_Reference, 97_Skills, temp, retired); root CLAUDE.md under 300 lines; memory writes need approval except bookkeeping (active project status, scheduled task register, changelog); pause Claude's generated memory so the files stay the single source of truth; one chat per task; ask "which files did you load" as a backcheck. | Mostly built | Gaps: no force-load prompt in use, no Source PDF convention (the Five Star brand kit PDF sits raw in 00_Resources), no "which files loaded" backcheck habit, and generated memory is probably still on. |
| Evals, judges, safety gates | Governance gates for the files: delete-replace-add before adding a rule, minimal sufficient precision, codification gate ("propose rules to codify, smallest change, wait for approval"), report-only scheduled audits, run a task once to grant permissions. No output evals, no judge. | Partly | His gates protect the rule files; Allie's evals protect the outputs. Both belong. |
| Team rollout and permissions | Two separate roots when ownership or privacy differs (work root on the work account, personal root on the personal account), started from the same baseline template. Skills install per account. Legacy AI "Projects" (Claude, ChatGPT, Gemini) port into a workstation with a migration prompt that checks for an existing owner before creating one. | Yes, in principle | His two-root answer is our Shared Core versus Personal Layer, stated as a rule. The Legacy AI Setup method is the path for the Brand Driver GPT and the captions project. |
| Tooling assumptions | Cowork desktop app only; folder in iCloud or OneDrive; Obsidian to read and edit files; scheduled tasks set to "Only on this computer" (he has students turn cloud off); Notion optional with a conventions file. | Mostly | Brett builds on the Code tab; workstations stay readable by both. His local-only scheduled task advice conflicts with our cloud Routine plan for agents; resolve by surface (Cowork tasks local, Code Routines cloud), as cowork-vs-code.md already says. |

## Adopt

- **Conventions files per connected tool, not a workstation per tool.** Asana Conventions (native bullets, task and project rules, which projects agents may write to), Zoho Conventions (which modules and fields, never status), Drive Conventions (show folder trees, naming), Canva Conventions. Agents and sessions load them by trigger. Lands in Phase 2 in 00_Resources; the coordinator and link-hygiene sidekicks read them.
- **Weekly report-only audit of root MEMORY.md** as a scheduled task with his five checks, plus the scheduled-task register it keeps honest. Lands in Phase 3 as part of the control tower; the registry gains a "last audited" column.
- **Codification gate.** When a correction should improve future work: propose the smallest rule change, prefer rewrite or delete over add, name the file, wait for approval. Lands now as a line in root CLAUDE.md's memory rules; pairs with "audit this session."
- **Promotion rule.** Changing context goes to memory, durable judgment to a rule, repeatable on-demand work to a skill, time-triggered work to a scheduled task. Lands in the AI Workforce CLAUDE.md as the test for whether something is an agent, a skill, or a task.
- **Force-load prompt and the "which files did you load" backcheck** for high-stakes outputs. Lands in users-guide.md as a phrase.
- **Source PDF convention.** Original in a Source PDFs subfolder, lightweight Markdown extract one level up. Lands in 00_Resources for the Five Star brand kit and any course PDF.
- **Two-root rule for privacy boundaries.** Restates our Shared Core split as a hard rule: personal and compensation material never sits in the root the team gets. Lands in Phase 4 kit design.
- **Legacy AI Setup migration method** for porting Claude and ChatGPT Projects: copy instructions and memory into one Markdown file, keep knowledge files in original formats, check for an existing owner, enrich rather than duplicate. Lands in Phase 2 for the Brand Driver GPT and the captions project.
- **Pause Claude's generated memory** so the files stay the only durable context layer. Brett's call; lands as a checklist item in Phase 0.
- **Audit skills as a family.** Session audit exists; add reference-file, workstation, and root CLAUDE.md audits once the template files are harvested. Lands in Phase 3.

## Reject or defer

- **Installing the paid starter template as a new root.** Jeff's own filter says keep and harvest when the existing setup is customized and working. The OS is past the free toolkit: registry, routing, satellites, scheduled tasks, project scaffolds, and a year of decisions. Harvest specific files (audit skills, conventions templates, scheduled task conventions, codification gate wording) into the OS instead. Needs the template zip downloaded, which needs your go-ahead.
- **Cowork as the only surface.** Rejected for the workforce layer; kept for connector and document work, per cowork-vs-code.md.
- **Local-only scheduled tasks as a blanket rule.** Applies to Cowork tasks. Agent routines run in the cloud from the Code tab so they do not depend on the office machine being awake.
- **Obsidian.** Optional. Brett does not hand-edit files; Claude proposes and Brett approves.
- **Notion.** Not on the stack.
- **Numbered folder renames (00_Reference, 97_Skills).** Cosmetic. Our 00_Resources already plays the role; renaming would break every path in CLAUDE.md files and the guide for no gain.

## Open questions for Brett

1. May I download the starter template and the skills templates from the lesson pages (two zips) so I can harvest the audit skills and conventions files? Nothing gets installed; they land in the AI Workforce folder for comparison.
2. Is Claude's generated memory on in your desktop app? Jeff recommends pausing it so the files stay the single source of truth. Reversible.
3. Do you want the weekly root MEMORY.md audit set up now as a Cowork scheduled task, ahead of Phase 3? It is report-only and low risk.
