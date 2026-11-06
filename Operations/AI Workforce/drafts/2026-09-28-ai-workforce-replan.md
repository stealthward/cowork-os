# AI Workforce re-plan (staged)

_COO, 2026-09-28. Asana project AI Workforce (https://app.asana.com/1/459051476492004/project/1218848903060628) re-planned for the three-seat, top-down build against 00_Resources/asana-conventions.md, roadmap.md Phase 2, and the seat briefs. Nothing below is applied until Brett's go. No dates are set anywhere: none has a source._

Base URL for task links: `https://app.asana.com/1/459051476492004/project/1218848903060628/task/<id>`

## Findings

| # | Item | What is wrong | Source | Fix |
|---|---|---|---|---|
| 1 | Section "Phase 2: two-week run (gate 2026-10-09)" | Carries an invented date; gate is a date, not an event | asana-conventions.md Dates; gates are events (Brett, 2026-09-25) | Rename to "CMO" |
| 2 | Sections overall | Bottom-up shape (two-week run, follow-on agents after the gate, BD lane after the first three agents); no section per seat | roadmap.md Phase 2 | One section per seat, then Control tower, then Parked |
| 3 | "Untitled section" | Empty, sits first | none | Delete |
| 4 | Project description | Phase 2 gate still reads "ten pieces without a rewrite", the bottom-up gate | roadmap.md Phase 2 gate | Rewrite (below) |
| 5 | Missing tasks | No task for COO first jobs (operations map, whole-workspace Asana audit) or either seat's proof of concept | coo SKILL.md First jobs; both evals | Create four tasks |
| 6 | 1218849329334452 Asana conventions capture | Brett's half done 2026-09-25; task reads as not started; "No due date: Brett sets it" is an aside | asana-conventions.md Tasks | Rename and rewrite |
| 7 | 1218848906032471 Conventions files: Asana and Zoho | Asana file exists; list differs from the COO brief (Zoho, Smartsheet, Apps Script, Drive) | coo SKILL.md | Rename and rewrite |
| 8 | 1218849090920395 Build the zoho-contact-data agent | Now the zoho-specialist under the COO | coo SKILL.md Workers | Rename |
| 9 | 1218849294001610 Define the CMO agent | Says "defined after Brett reviews the first two seat briefs"; both approved 2026-09-25, so it is unblocked | AI Workforce MEMORY.md | Rewrite |
| 10 | 1214587754535164 Create Brand Driver in Claude | "Starts after the first three agents pass the Phase 2 gate" is the bottom-up gate; architecture is now four skills under the CMO | MEMORY.md 2026-09-24 Brand Driver decision | Rewrite |
| 11 | 1218848902670975 Phase 2 gate review | Named for the old gate; roadmap gate now also requires evals rerun against the CMO's definition of good | roadmap.md Phase 2 gate | Rename and rewrite |
| 12 | 1218885143911916, 1218885185380109, 1214587754535164 | Open master tasks with no assignee; every other open master is Brett's | asana-conventions.md: the master carries the assignee | Assign to Brett |
| 13 | 1218848800689636 Weekly report-only root MEMORY.md audit | Now OS maintenance, the chief of staff's lane, and the os-curator's first job | chief-of-staff SKILL.md; MEMORY.md 2026-09-25 | Decision for Brett (below) |

Clean: no subtask carries an assignee or a date (spot-checked Piece 1 and Brief 1; the rest show none in the listing); no legacy Priority set; no dash bullets.

## Target structure

Sections top to bottom. Tasks listed in build order within each.

**1. Chief of staff** (rename "Root maintenance")
- Define the chief of staff seat (completed, 1218885244391599): move here
- NEW: Chief of staff: proof of concept (ten rated runs)
- Build the os-curator worker (1218885185380109): move here, assign Brett
- Weekly report-only root MEMORY.md audit (1218848800689636): see decision

**2. COO** (rename "Follow-on agents (after the gate)")
- Define the COO agent (completed, 1218849329500299): move here
- NEW: COO: proof of concept (ten rated runs)
- NEW: Operations map (Operations/AI Workforce/operations-map.md)
- NEW: Whole-workspace Asana audit
- Asana conventions: merge Elizabeth's half (1218849329334452): rename, move here
- Conventions files: Zoho, Smartsheet, Apps Script, Drive (1218848906032471): rename, move here
- Verify the systems registry against reality (1218848903096180): move here, stays Brett's action
- Build the asana-specialist worker (1218885143911916): assign Brett
- Build the zoho-specialist worker (1218849090920395): rename
- Write build-method.md (1218848800686753): move here (process and SOP work is the COO's lane)

**3. CMO** (rename "Phase 2: two-week run (gate 2026-10-09)")
- Define the CMO seat (1218849294001610): rename, rewrite
- Editor: run the seeded set (1218848906015015): stays
- Copywriter: ten pieces without a rewrite (1218849090900482): stays, subtasks unchanged
- Research sidekick: first three briefs (1218848938460087): stays, subtasks unchanged
- Worker review under the CMO (1218848902670975): rename, rewrite
- Create Brand Driver in Claude (1214587754535164): move here, assign Brett, rewrite

**4. Control tower** (rename "Phase 3: control tower")
- Render the systems registry as one live page (1218849090938513): stays

**5. Parked until Team Edition**
- Content operations lane (1218848906048710): stays

Delete after the moves: "Untitled section" and "BD lane (after the first three agents)", both empty.

## Text changes

**Project description**
- What this is: the build tracker for Brett's agent workforce, the work that spans more than one Claude thread. Plans, decisions, and files live in Cowork OS/Operations/AI Workforce. BW AI stays the course tracker.
- Structure: three peer seats under Brett (chief of staff, COO, CMO), one section each. A worker sits in its seat's section and is built when the seat has a real task for it.
- Gates are events, never dates.
- Phase 2 gate: Asana conventions confirmed by Brett and Elizabeth; this project rebuilt to them; three seat briefs approved and each past proof of concept (ten rated runs, no auto-fail, at most two noise); workers re-parented under the CMO with evals rerun; operations map confirmed; build-method.md written.
- Phase 3: the systems registry rendered as one live page. Phases 4 and 5: gated on Team Edition.
- Subtasks under a master task are never assigned; the master carries the owner.

**NEW Chief of staff: proof of concept (ten rated runs)**, assignee Brett
- Eval and run table: Operations/AI Workforce/evals/chief-of-staff-eval.md
- Pass: ten rated runs, no auto-fail, at most two rated noise
- Run 1: 2026-09-28, partly rated
- On pass: first seat-initiated Asana writes, then the os-curator build

**NEW COO: proof of concept (ten rated runs)**, assignee Brett
- Eval and run table: Operations/AI Workforce/evals/coo-eval.md
- Pass: ten rated runs, no auto-fail, at most two rated noise
- Run 1: 2026-09-28, this re-plan
- On pass: Asana create and update in named projects only, then the asana-specialist build

**NEW Operations map**, assignee Brett
- File: Operations/AI Workforce/operations-map.md
- Per platform and system: what it does, owner and users, source of truth, connector status, conventions file (exists or missing), what an agent may touch
- Built from systems-registry.md, Operations and Email HQ MEMORY.md, Dashboards docs, the connectors
- Brett confirms; then promoted to 00_Resources/
- Covers the legwork for "Verify the systems registry against reality"

**NEW Whole-workspace Asana audit**, assignee Brett
- Every project against 00_Resources/asana-conventions.md: owner, purpose, last activity, sections, field use
- Output: report with keep, fix, archive, or delete per item, plus the proposed task list for Brett and Elizabeth
- Read-only; ties to initiative 10 and Operations/AI Workforce/2026-09-23-asana-audit-candidates.md
- Replaces "Asana audit: my archive and reorganize list" in Brett's World: https://app.asana.com/1/459051476492004/project/1194233924213542/task/1218848417563514

**Rename 1218849329334452 to "Asana conventions: merge Elizabeth's half"**
- Brett's half captured 2026-09-25 in 00_Resources/asana-conventions.md
- Elizabeth's task: https://app.asana.com/1/459051476492004/project/1203416244972577/task/1218849178962868
- Her answers merged into the file by the COO; Brett approves the edit

**Rename 1218848906032471 to "Conventions files: Zoho, Smartsheet, Apps Script, Drive"**
- One file each in 00_Resources/, same shape as asana-conventions.md
- Zoho first: agents append and update; never status fields, workflows, or deletes; every write listed (2026-09-21 rule)
- Each written when the COO has a real task on that platform

**Rename 1218849090920395 to "Build the zoho-specialist worker"**
- Description unchanged except the first line: Subagent under the COO at Cowork OS/.claude/agents/zoho-specialist.md (the planned zoho-contact-data agent)

**Rename 1218849294001610 to "Define the CMO seat (employee file and definition of good for Brett's approval)"**
- Seat under Brett, peer of the chief of staff and COO; owns Content & Authority and Business Development
- Brief: Cowork OS/.claude/skills/cmo/SKILL.md, same pattern as the other two seats
- Workers: copywriter, editor, research-sidekick, re-parented with evals rerun; Brand Driver as four stacked skills
- Unblocked: both other seat briefs approved 2026-09-25
- The three workers' runs do not wait for this brief (superseded 2026-09-30: runs wait for the approved CMO seat and the editor's seeded set)

**Rename 1218848902670975 to "Worker review under the CMO: cost per piece, eval rerun, promote or hold"**
- Read Operations/AI Workforce/logs/usage-log.md and the three eval tables
- Rerun each eval against the CMO's definition of good
- Per worker: keep on sonnet, promote (editor to opus on a logged miss), or fix the eval
- Update systems-registry.md and MEMORY.md Key Decisions in the same session

**1214587754535164 Create Brand Driver in Claude**
- Four stacked skills under the CMO over a shared reference folder: brand-audit (research-sidekick), portal-bio and website-copy (copywriter, editor grades), content-strategy (CMO)
- Produces the Real Estate Branding Blueprint, the content strategy delivered to signed $50M+ clients; redesign for quality and engagement, less copy-dense
- Built when the CMO has a real task for it; must be ready before the REACH funnel opens
- Spec: Cowork OS/_Archive/branding-blueprint-system.md; GPT export in Operations/AI Workforce/assets/gpts/

## Decision for Brett

The weekly report-only root MEMORY.md audit (1218848800689636) is now OS maintenance under the chief of staff and the natural first job for the os-curator. Recommended: add it as a line in the os-curator task and complete this task with a comment pointing there. Alternative: keep it as its own task in the Chief of staff section.

## Apply log

Brett's go 2026-09-28: apply as staged; fold the weekly MEMORY audit into the os-curator. All applied and verified by re-read the same day.
- Sections renamed in place so the order holds: Phase 2 to Chief of staff, Phase 3 to COO, Parked to CMO, Root maintenance to Control tower, Follow-on agents to Parked until Team Edition. Untitled section and BD lane deleted (empty).
- Project description rewritten.
- Created: Chief of staff: proof of concept (1218956492907488); COO: proof of concept (1218956529462596); Operations map (1218956482262553); Whole-workspace Asana audit (1218956492824517). All assigned Brett, no dates.
- Renamed and rewritten: 1218849329334452, 1218848906032471, 1218849090920395, 1218849294001610, 1218848902670975; rewritten 1214587754535164 and 1218885185380109 (weekly MEMORY audit added as first job).
- Assigned Brett: 1218885143911916, 1218885185380109, 1214587754535164.
- Completed 1218848800689636 with a comment linking the os-curator task.
- Every task moved to its target section; completed "Build the Friday report agent" moved to Chief of staff.
- Not done: task order within each section (the connector cannot reorder); drag in the UI if the build order matters to you.
- Superseded the same day (Brett, 2026-09-28): finding 12 was wrong. Project tasks are assigned only with a due date; all open tasks were unassigned, Lead set to Brett, Rank set in completion order. See logs/coo-log.md.
