# MEMORY.md

_Last updated: 2026-10-30_

## System Maintenance

- Last OS audit: 2026-08-12. The COO offers it on load when this date is more than 90 days old.
- Last alignment check: 2026-10-28 (local files vs claude.ai account: instructions, connectors, projects, plugins, scheduled tasks). The COO offers it on load when over 30 days old; run the alignment-check skill from Code.

- Last client name check: 2026-10-27 (near-duplicate client names in the dashboards' client list; approved ones go into the Client Merges tab of the FSE Portal Content sheet). The COO offers it on load when this is more than 14 days old.

## Scheduled Tasks and Satellites

Scheduled tasks and the claude.ai satellite projects are listed only in Operations/AI Workforce/systems-registry.md (live page https://claude.ai/artifact/UPN37pzpwruFFJhFzr8Kr4). Aprilia Peace stays off the registry: its two scheduled tasks are apriliapeace-daily-instagram (7:45 AM daily) and apriliapeace-nextdoor-watch (8:30 AM daily).

---

## Active OS Projects

Time-bound project folders inside workstations (not app Projects). Update this table when OS projects are created, completed, or archived.

| Project | Workstation | Status | Tracker |
|---|---|---|---|
| Portal Rebuild | Operations | Phase 1 complete: cut over and adopted by the team (2026-09-23). Phase 2 (added functionality) on hold, to be revisited soon; folder stays active | (none) |
| AI Workforce | Operations | Active: three seats under Brett (chief of staff, COO, CMO) and eight live workers (asana-specialist, os-curator, zoho-specialist, smartsheet-specialist, copywriter, editor, fact-checker, research-sidekick); Rank 1 in Brett's World. Team launch on hold 2026-11-05 until the setup scenarios are vetted; launch seats Elizabeth and workforce only; full roster on the registry page | [Asana AI Workforce](https://app.asana.com/1/459051476492004/project/1218848903060628) |
| Real Talk Factory | Content & Authority | Active — 2 of 15 tasks complete | [Asana](https://app.asana.com/1/459051476492004/project/1214560093184793) |
| REACH (Content Handbook) | Content & Authority | Active: chapter process set 2026-11-04; eleven chapter subtasks in run order (Ch 2 first, Ch 1 last), undated; Ch 6 parked at v4.2. | Google Doc |
| Rebuild | Content & Authority | Active: folder created 2026-10-14; hosting target 2027-03-01; first guest brief (Dean Aguilar) kept 2026-10-13, nothing booked | [Asana](https://app.asana.com/1/459051476492004/project/1214006405857881) |
| Investor Database | Business Development | Active as a component of REInvest (folded 2026-09-23): phases 1 (seed/clean) and 2 (profiles and relationship model) done 2026-09-02; phase 3 populate in progress (Brett confirmed 2026-10-30) | [Artifact](https://claude.ai/code/artifact/d12b85c5-c9f9-4fbe-a786-8ed53117af9e) |
| REInvest | Business Development | Active: launch 2027-02-18 as REInvest: Find the Deal; campaign re-planned and dated in Asana 2026-09-29 (whisper and tease plan due 10/13, invitations 1/7); both decks republished for February 2027; event page on the RTM Duda site (copy 12/3, build 12/17) | [Asana](https://app.asana.com/1/459051476492004/project/1218246612327620) |
| Aprilia Peace | (root, standalone) | Active: site is delmarterrace.net since 2026-10-27 (apriliapeace.com redirects); IG queue refilled through 2026-11-05; YouTube links updated 2026-10-28; Nextdoor run by Brett. The 2212 Issues claude.ai project was migrated to apriliapeace/reference/claude-ai/ and legal/, and archived 2026-10-02. | (none) |

## Local Windows and Notes

Root-pinned Cowork windows (local app projects): Cowork Config, Content & Authority, REACH.

Local note: the production inbox triage runs 7 AM, 11 AM, 3 PM daily as a Cowork scheduled task out of C:\Users\brett\Documents\Claude\Scheduled (spec: Email HQ Resources/gmail-triage-system.md). The BW Daily Brief scheduled task in that folder is deprecated; the BW Daily Brief Apps Script is live and feeds the dashboard Brett reviews every morning.

## Reel Cut Sheet System

As of 2026-09-22: Content & Authority/Reel Cut Sheet System/ is canonical for the engine (v5.1 (cut-first plus hook rule 4.3a), live on the claude.ai account 2026-10-30; cites content-frameworks.md, which ships inside the skill), show contexts, and the local Code pipeline; the team SOP is canonical in the "Cutsheet Build Process" Google Doc. Brett's builds run in Claude Code via the factory-cut-sheet skill (Plaud connector in, WhisperX timing, Gemini and the Drive connector dropped); the claude.ai Factory project is the team fallback. Episode 4 delivered from this pipeline (v6, signed off). Open: the Asana project template still carries the old Cut Sheet Instructions (seen on the Episode 5 task 2026-10-05; deliberate, the team is finishing DLJ first), and the scheduled run waits on one manual Episode 5 build.

## Business Priorities

The growth strategy (two phases, two channels, three avatars, the content ladder from The Factory to Rebuild) lives in 00_Resources/growth-strategy.md; Brett's 12-month initiatives (owners, finish lines, status, the Friday review rhythm, the tie-break rule) live in 00_Resources/initiatives.md. Both Personal Layer. Read them before any BD, content, show, or prioritization work. Headlines: process audit done 2026-11-01 (Elizabeth drives), three AI Workforce agents in Q4 2026 (personal content plan deferred to 2027; interim Factory reel narratives on LinkedIn), REACH manuscript by end of Q1 2027, REInvest launch February 2027, Five Star at 120 to 150 escrows a month within 12 months.

- **Cowork Setup**: Operational as of the 2026-08-12 overhaul, still building out. Ongoing courses and direction from Jeff Su, Allie K. Miller, Remy Gaskell, Ruben Hassid, and others. Next: deeper context builds for Operations, Business Development, and Content & Authority strategies.
- **Team Deployment** — Claude Team, with the Shared Core kit synced to members from a private GitHub repo that Brett and Elizabeth maintain, seats by tier (Builder, Daily user, Asker), and Max Income, compensation, and every MEMORY.md kept out of the kit. Plan in Operations/AI Workforce/roadmap.md Phase 4 (re-planned 2026-11-04).
- **Authority Content Build** — Brett out in front as an operator who built a multimillion-dollar company and executed 10,000+ videos through Real Talk, giving value to producers, partners, and investors so they come to him. The Factory is the reps; Rebuild (hosting by 2027-03-01) is the destination; his own LinkedIn runs on Factory reel narratives until a 2027 campaign (initiative 4).
- **GPT to Claude Migration** — Three custom GPTs (Brand Driver, Page Conversion, Real Talk Agent Magnet), all exported to Operations/AI Workforce/assets/gpts/. OpenAI's editor says GPTs not migrated to plugins stop working after December 11 (notice seen 2026-09-24), and Brett no longer uses them (2026-09-24), so the Claude rebuilds are the migration and the exports are the source of record.
- **AI Content Platform** — Building AI-powered content systems to serve both Real Talk Media clients and internal team at scale. Clear vision exists; execution is constrained by Brett's personal bandwidth.
- **Five Star Scale** — Escrow volume and revenue targets are in brett-profile.md. Targeting $50M+ list-side producers, large teams, investors, and brokerages.

## Brett's Profile

Who Brett is, business model, compensation, revenue goals, staffing, locale defaults, bios, headshot, and how he works (what he hands off, what he keeps) live in 00_Resources/brett-profile.md. Personal Layer: it is never copied into anything shared. Read it before bios, locale-sensitive output, or any roster or autonomy decision.

## Team

**Real Talk Media / Shared**
- **Elizabeth Eidbo** — Director of Operations for both Real Talk and Five Star. Manages all VAs except editors. Email her at elizabeth@realtalkmedia.com, always, for either company (Brett, 2026-09-28); admin@fivestarescrow.com is the Five Star admin mailbox she also monitors, not her address.
- **Mark Eidbo** — Head of Production, Real Talk. Manages the two video editors.
- **Cassie Pellegrini** — Director of Client Success across both companies. Handles show guests and Five Star client follow-up and outreach.

**Offshore VA Team (Philippines)**
- 2 video editors (managed by Mark)
- 2 designers
- 1 content curator
- 1 operational assistant
(All except editors managed by Elizabeth)
- The offshore team works opposite US hours and completes work overnight; a task handed over during Brett's day comes back by his next morning (Brett, 2026-09-28). Princess Non is one of the designers. Princess moves design tasks into Design Team Projects and completes the original on transfer; another designer (e.g., Krasny) may do the work, so check the copy in Design Team Projects for delivery.

**Five Star Escrow**
- **Heather Bayes**: Partner, 10% owner. Prefers credit shared with the team: feature her alongside the team in content, never as solo praise (Brett, 2026-10-27).
- **Jen Decker** — Branch Manager.
- **Felicia Ward**: Director of Finance for both companies (Brett's wife). Owns invoices and document storage. Asana account: Felicia C Ward, feliciacward@gmail.com.
- **Brooke Lenander**: Primary bookkeeper, Five Star only; operates the finance dashboard.
- **Sydney Rohlfs** — Escrow team lead. Taking on operational scaling role for Five Star due to deep workflow knowledge and tech aptitude. Brett's point person for capacity growth.
- Two additional escrow teams beyond Sydney's.
- Former staff, never named in content: Eddie Chance, Molly O'Dell, Kris Cummings, Daniela Mendoza (Brett, 2026-10-27).

## Tools & Systems

- Every platform and system (owner, source of truth, connector, what an agent may touch): 00_Resources/operations-map.md. Agents, skills, scheduled tasks, and workspaces: Operations/AI Workforce/systems-registry.md, live page https://claude.ai/artifact/UPN37pzpwruFFJhFzr8Kr4.
- **Email aliases that forward into Brett's inbox:** bward@realtalkmedia.com, brett@realtalkmedia.com, brett@fivestarescrow.com. Triage searches the inbox only; alias filters are listed in Email HQ Resources/gmail-triage-system.md.
