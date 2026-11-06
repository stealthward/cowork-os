# AI Workforce Roadmap

_Written 2026-09-16, Phase 2 rewritten 2026-09-24 for the top-down build. Status lives in MEMORY.md; this file is the plan._

## Where you are

The Cowork OS is a solid single-operator system: workstations, rules, memory, routing, three scheduled tasks, four Apps Script systems, a handful of account skills, and four claude.ai satellites. What it does not have yet is an agent layer (no agents or skills stored in the OS), a single view of everything that runs, or a physical split between what the team can see and what stays yours. The sprawl you feel is the cost of building fast without a registry.

## Where you need to be

Five layers, each one standing on the one below it.

| Layer | What it is | Status |
|---|---|---|
| Knowledge | CLAUDE.md, MEMORY.md, Resources, routing | Built. Keep it. |
| Workforce | Agents and skills in `.claude/` at the OS root, each with its own model and tools | Not started |
| Automation | Scheduled tasks, routines, Apps Scripts, connector jobs | Partly built, unregistered |
| Control tower | One registry on disk and one live page rendered from it: every system, where it runs, model, owner, status, link | Step 1 live 2026-10-07 (page rendered from the registry) |
| Distribution | Shared Core versus Personal Layer, role kits, onboarding SOP, pilot then team | Designed in principle, not built |

## The phases

Each phase ends at a gate. The gate is evidence Brett can check, not a feeling that it is done.

### Phase 0: Foundation (this week)

1. Create this folder and register it. Done 2026-09-16.
2. Seed the systems registry from what MEMORY.md already knows. Brett verifies it.
3. Confirm the operating decisions: Code tab is the build surface, `.claude/` at the root is the runtime, this folder is the workshop.

**Gate:** registry verified, roadmap approved.

### Phase 1: Course intake (rolling)

1. For each course Brett shares, write one intake file from the template in courses/.
2. Fill courses/comparison.md: one row per topic (agent structure, model assignment, management surface, team rollout, evals and safety), one column per course, and a final column with the decision for this OS.
3. Log each adoption decision in MEMORY.md with the course that drove it.

**Gate:** comparison matrix has a decision in every row that matters for Phase 2.

Intake runs in parallel with everything below. Do not wait for all courses before building the first lane. Courses refine the build; they do not gate it.

### Phase 2: Three seats under Brett (reset 2026-09-24, settled 2026-09-25)

_Brett's decision: build top-down, around him, the way he runs the company: one point of contact per department. Three peer seats sit directly under him: chief of staff (his day and week), COO (Operations and Email HQ as systems), CMO (Content & Authority and Business Development). Each seat is a brief the session wears, because a seat has to talk to Brett and dispatch workers, and a subagent can do neither. Workers are subagents under each seat. Every seat and worker follows Brett's method, define it, do it, document it, delegate it: Brett states what the role owns and what good looks like; runs the role with the brief alongside, report-first; the work log, eval, and memory capture it; autonomy widens on evidence. Gates are events, never dates (Brett, 2026-09-25): proof of concept for a seat is ten rated runs with no auto-fail and at most two "noise"; a worker is built when its seat has a real task for it. Finance and tax stay Max Income sessions. The bottom-up first lane (copywriter, editor, research-sidekick) is on disk and re-parents under the CMO; its runs wait until the CMO seat is approved and the editor's seeded set is done (Brett, 2026-09-30)._

1. **Asana conventions capture.** Brett's half done 2026-09-25 (`00_Resources/asana-conventions.md`); Elizabeth's half through her Asana task. The COO owns the file from here.
2. **Chief of staff.** Brett's day and week: top three, needs-Brett, collisions as questions, the Friday report, OS maintenance flags, interference. Default seat when no seat is named. Workers: asana-specialist (shared with the COO), os-curator (first). Defined 2026-09-25; Brett reviews the brief, then it takes real tasks.
3. **COO.** Operations and Email HQ as systems: build, audit, streamline, conventions. Request protocol: scope, plan, execute report-first, verify, document, log. First jobs: operations map, AI Workforce re-plan, whole-workspace Asana audit. Workers in order: asana-specialist, zoho-specialist, smartsheet-specialist, dashboard-builder, drive-organizer, inbox-specialist. Defined 2026-09-25; Brett reviews the brief, then it takes real tasks.
4. **CMO.** Content & Authority and Business Development: Brett's Q4 personal content plan, the client marketing framework, the REACH funnel, REInvest and Rebuild marketing, the product campaigns, content-driven BD. Workers: copywriter, editor, research-sidekick, with evals rerun against the CMO's definition of good; the Branding Blueprint skills (renamed from Brand Driver 2026-10-14): a blueprint entry skill over blueprint-audit, blueprint-portal-bio, blueprint-website-copy, and blueprint-strategy, with a shared reference folder. Defined and approved 2026-09-30 (.claude/skills/cmo/SKILL.md).
5. **Knowledge before workers.** The operations map and the per-platform conventions files (Zoho, Smartsheet, Apps Script, Drive) are the COO's first real work, because a seat knows only what is in files. This is the step most likely to stall; it is the one that sets the COO's ceiling.
6. **Governance and cost.** Autonomy boundaries at the root (done 2026-09-24), usage log on every run, a memory file per seat, the handoff queue between seats (`logs/handoffs.md`), models per model-selection.md.

**Gate:** conventions file confirmed by Brett and Elizabeth; the AI Workforce Asana project rebuilt to it; three seat briefs approved and each past proof of concept; workers re-parented with evals rerun; the operations map confirmed; a written build method a second person could follow.

### Phase 3: Control tower

1. Turn systems-registry.md into a live artifact: one page, every system, filterable, each row linking to where it runs.
2. Thread hygiene: one app Project per workstation on the Code tab, each pinned to the OS root; session openers name the workstation; every session ends with an audit.
3. Retire or register every stray thread, satellite, and script the registry surfaced.

**Gate:** Brett can find any system, its owner, and its status from one page in under a minute.

Phases 2 and 3 can overlap. The registry is the shared dependency, and it exists as of Phase 0.

### Phase 4: Team plan and pilot

_Re-planned 2026-11-04 (Brett). Replaces the copy-the-kit-folder model of 2026-10-08. Decisions and research: drafts/2026-11-04-team-setup-options.html; tasks: drafts/2026-11-04-team-launch-replan.html._

Decisions (Brett, 2026-11-04):
- Claude Team plan. Enterprise only if compliance later needs audit logs.
- The kit lives in one private GitHub repo that Claude syncs to every member (Organization settings, Plugins and skills). Brett and Elizabeth maintain it; members need no GitHub account. Personal MEMORY.md files never enter the repo.
- Three seat tiers, placed per person: Builder (desktop Code tab, full kit, workers, personal memory), Daily user (standard seat, chat and Cowork, only their role's skills), Asker (no seat, asks the workforce).
- The workforce runs in Anthropic's cloud under its own account (company email, Claude Team seat, Asana seat), so replies stop posting as Brett. Cloud scheduled tasks run at most hourly.
- Asks stay in Asana (Ask the Workforce) to start. Slack is under consideration for the media team only; the escrow team stays on Elevate, which is tied to the VoIP system. The 2026-09-17 "no Slack" basis was revisited 2026-11-04.
- The shared ChatGPT workspace is replaced role by role as each role moves to Claude.

Steps (AI Workforce, Team launch). On hold 2026-11-05 (Brett): no purchase and no dates until every scenario is vetted (your account in a Team org, duplicate skills, working from any computer); the dates below are the 11/4 plan, cleared in Asana.
1. Place each team member in a seat tier (done 11/5). Media team only at launch; the Five Star Escrow team gets no seat until its role rolls out (Brett, 2026-11-05). Builder: Brett, Elizabeth. Daily user: Mark, Michelle, Alyza, Princess, Krasny. Asker: Gerald, Patrick, Dani. 8 seats with the workforce seat.
2. Upgrade to Claude Team with Elizabeth's seat and the workforce seat only (11/5). The other tier seats wait until Brett is comfortable with the team setup (Brett, 2026-11-05).
3. Create the workforce account (11/6).
4. Move the team kit into a Claude-synced GitHub repo; its README is the maintainer method (11/6 to 11/10).
5. Move the pilot loop to an hourly cloud scheduled task (11/11).
6. Team launch go/no-go (11/12).
7. Elizabeth pilot on the synced kit, 11/16 to 11/25. Pilot issues log to a file; fixes go into the repo, never into chat.

**Gate:** pilot ran, every issue fixed in the repo, nothing personal leaked into the kit.

### Phase 5: Team rollout by role

1. Roll out one role at a time, media team first (Brett, 2026-11-05), escrow teams later, each with its own two-week check before the next starts. No seat is added until Brett is comfortable with the team setup after the Elizabeth pilot. Media team order (Brett, 2026-11-05): Mark Eidbo first; then Alyza Santos, Michelle Dayrit, Princess Non, and Krasny Magtira, with how to roll them out decided after Mark; then the Askers (Gerald, Patrick, Dani). No dates until Brett makes each call.
2. Per role: place its people in tiers, push only that role's skills, move that role's ChatGPT projects to Claude, onboarding SOP and async office hours.
2a. A course roadmap per team member, by role and experience (logged 2026-09-17 at Brett's request), drafted once the roles are set.
3. Before the media team rolls out: decide Slack with Claude for the media team (real-time asks instead of the hourly Asana loop).

**Gate:** every role live, registry shows owner per system, Brett is not the single point of failure.

## On the urgency

You can get Elizabeth in by the end of Phase 2 plus the Shared Core split from Phase 4. Everything else can follow. The one step that cannot be skipped is the split, because root MEMORY.md carries compensation and ownership data today, and the franchise model in the OS guide depends on it.

## Answers to the four questions

**Agent workforce.** Agents are markdown files in `.claude/agents/` with a name, a description of when to use them, the tools they get, and a model. Skills are repeatable procedures in `.claude/skills/`. Built top-down (Brett, 2026-09-24): two executive seats first, COO and CMO, then specialists under each, every one defined, done, documented, and delegated in that order. Lane order after content operations: business development (REInvest, investor database, partner campaign), then dashboards and Apps Script as a skill set, then escrow operations when Sydney's capacity work calls for it.

**Where the roadmap lives.** Brett's World in Asana is the priority order for Brett's work; the AI Workforce project is the tracker for this build. When the two disagree with this file, Asana wins and this file gets updated.

**Model per agent.** See model-selection.md. Short version: Haiku for volume and narrow checks, Sonnet as the default worker, Opus for planning and judging and anything with money or legal exposure, Fable only at the top of a chain when Opus fails the eval.

**Managing the systems.** Both, in this order: organization first (the registry on disk plus one app Project per workstation), then the dashboard rendered from the registry. The dashboard is Phase 3, not Phase 0, because it is only as good as the inventory under it.

**Deploying to the team.** Franchise model, already in the OS guide: same architecture, personal memory per person. Pilot with one, fix in the kit, then roll out by role. Do not share before the Shared Core split.
