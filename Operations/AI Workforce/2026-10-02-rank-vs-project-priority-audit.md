# Rank vs Project Priority audit

_COO, 2026-10-02. Read-only. Personal Layer._

**Brett's model (2026-10-02):** Rank is a person's priority. It lives on every World and on My Tasks. Project Priority orders tasks inside a project. AI Workforce was given Rank by mistake.

**Sources:** project field settings for every active project in the workspace (get_projects), My Tasks field settings, open tasks with Rank set in 17 non-World projects, and the OS files that mention Rank. Max Income was skipped by rule; only its field list came back in the bulk read.

## 1. Project field setup

| Group | Projects | Matches the model? |
|---|---|---|
| Worlds with Rank | Brett's, EE's, Mark's, Gerald's, Patrick's, Michelle's, Alyza's, Cassie's, Princess', Krasny's, Dani's | Yes |
| World without Rank | Felicia's World (Link only) | Gap |
| My Tasks | Rank, Priority, Link, Estimated time, plus Priority Today (built today) | Rank already exists here, so Priority Today duplicates it |
| Rank, no Project Priority | **AI Workforce, REACH** (both built with Claude) | **No** |
| Rank, no Project Priority (team) | Finance Dept; 10 episode projects (Discover Ramona x2, Discover East County x3, The Factory x2, Devore Connection, Aging Parent Podcast; Discover La Jolla x2 have neither) | No, but these tasks are multi-homed into team Worlds, and the episode template is frozen until the production process audit lands |
| Both fields | REInvest, FSE Partner Campaign, FAQ Videos Phase 2, List It Live 3.0, Podcast Product Launch, Five Star Branding & Talent Plan, REbuild Podcast Build Out, Real Stars SOP Buildout, Escrow Operations Tests, Production Process Audit, Production Task Overview, Design P&T, Operations P&T, List It Live / Market Movers Recurring | Yes, if Project Priority holds the project order |
| Project Priority only | Task Force WOW, Support Tickets, New Hire Checklist (Isabella), Escrow Learning & Development | Yes |

## 2. Task values that contradict the model

| Project | What was found |
|---|---|
| AI Workforce | All 17 open tasks are ordered by Rank. No Project Priority field. Includes the four Rank values I restored today |
| REACH | 4 open tasks ordered by Rank (Draft the remaining chapters 1, Full manuscript read-through 2, Export 3; ScoreApp Config Rank 1 and Project Priority 2) |
| REInvest | Brian Daly ask: Rank 4, Project Priority blank (Rank written by chief of staff day plans) |
| FSE Partner Campaign | Devore questions and Tucci escrow revenue research: Rank 1, Project Priority blank. Partner prospect escrow fee calculation: Rank 2 vs Project Priority 3. Partner prospect database: Rank 5 vs Project Priority 2 |
| Production Process Audit | Review Production Processes: Rank 3, Project Priority blank |
| FAQ Videos Phase 2 | Two tasks with Rank 1 and Project Priority 1 (no conflict) |
| Finance Dept | One task carries Rank 1 (field setup only; content not read) |

Tasks multi-homed into a World (List It Live Recurring, Ops P&T, Design P&T, episode tasks) carry Rank as the person's priority and Project Priority as the project order. That matches the model.

## 3. OS files that contradict the model

- asana-conventions.md: Rank row ("in any other project, orders tasks within each section"); "Every new project gets the Lead, Rank, Estimated time, and Link fields"; Daily planning "then by Rank within each project's section"; the Priority Today row, step 1, and today's change-log lines. Project Priority is not documented (named only in Elizabeth's pending half).
- Chief of staff brief: Day order step 3 ("by section, Rank, and due date"), Day plan ("by project Rank and task Rank"), and today's Priority Today paragraph, top-three, and output edits.
- Memory: chief-of-staff-memory.md (9/28 day-plan line, 10/2 Priority Today line); coo-memory.md (10/2 Priority Today line).
- Historical drafts and logs: left as the record.

## 4. Could not verify

- Fields inside project templates (TEMPLATE: New Project - List Format, Department Projects & Tasks, Discover templates). The API does not return template fields; the new-project template likely carries both fields, since projects made from it do.
- Project Priority's option list and colors (to confirm it matches Rank before copying values).

## 5. Applied (2026-10-02, Brett's go)

| Item | Result |
|---|---|
| AI Workforce | Project Priority added from the library; 19 tasks copied from Rank; Rank cleared and removed from the project |
| REACH | Project Priority added; 3 tasks copied from Rank (ScoreApp Config kept its Project Priority 2); Rank cleared and removed from the project |
| Brian Daly ask, Devore questions, Tucci escrow revenue research, Review Production Processes | Project Priority copied from Rank (4, 1, 1, 3) |
| Priority Today | Deleted; Rank is Brett's My Tasks day order |
| Felicia's World | Rank added from the library |
| Episode projects, Finance Dept | No Project Priority by Brett's decision |
| Rules | Chief of staff brief, asana-conventions.md, both memory files updated |
