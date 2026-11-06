# Operations Map

_Built by the COO seat 2026-09-30 (run 2). Every platform and system behind Five Star Escrow and Real Talk Media operations: what it does, who owns and uses it, where its truth lives, whether Claude can reach it, which conventions file governs it, and what an agent may touch. Built from the OS files and a live read-only connector sweep on 2026-09-30; confirmed by Brett and promoted to 00_Resources/ 2026-09-30. Personal Layer while it runs for Brett alone (it names personal scripts and Brett's accounts). The COO keeps it current: any session that adds, retires, or changes a system updates its row. Agents, skills, and scheduled tasks are inventoried in `Operations/AI Workforce/systems-registry.md`; this map points to it rather than repeating it._

## How to read it

- **Connector** is the live status on 2026-09-30. "None" means no connector exists; Claude reaches it only through a browser, if at all.
- **Agent may touch** applies `.claude/autonomy-boundaries.md`. "Stage" means draft the change and wait for a person's go.
- **Conventions:** `00_Resources/asana-conventions.md`, `00_Resources/zoho-conventions.md`, `00_Resources/smartsheet-conventions.md`, `00_Resources/apps-script-conventions.md`, and `00_Resources/drive-conventions.md` exist. Every "missing" is a file still to write.
- A cell that no source supports says "could not verify" and is listed at the bottom.
- **Elizabeth on every platform (Brett, 2026-09-30):** she understands every platform here at a high level, steps in when needed, and directs the team members who use them. Treat her as a user and first contact on every row, even where she is not named.

## 1. Core platforms

| System | What it does | Owner / users | Source of truth | Connector | Conventions | Agent may touch |
|---|---|---|---|---|---|---|
| Google Workspace (brettward.net domain) | Identity, email, calendar, Drive for both companies | Admins: Brett and Elizabeth (Brett, 2026-09-30); all staff | Google admin console | Gmail, Calendar, Drive connected | Drive: drive-conventions.md | Per the rows below |
| Google Drive | Document storage across a shared drive per department (BW Lab holds Operations, including Apps Scripts) plus Brett's My Drive; runtime home for Apps Script; finance records tree. Auditing and cleaning up the shared drives and Brett's My Drive is a major Operations project (Brett, 2026-09-30) | Brett; Felicia owns finance storage; Brooke, Molly (CPA) use the finance tree | Shared Drives > Operations > Apps Scripts (9 script files, verified); finance root `1B31ALr30hdpYme255GiMuPbSDl8upuLU` in the 5 Star Ownership shared drive; Claude's own files under My Drive/Claude | Connected | drive-conventions.md (2026-10-12); the drive-organizer worker's first job is its Known drift 1 to 6 | Read; create files under My Drive/Claude; any restructure, move, or rename is staged |
| Google Calendar | Company calendars and shoot schedule | Brett; team | FSE Main, Real Talk Shoots & Shows, fda@fivestarescrow.com, staff calendars (verified in the calendar list); FSE PTO and RTM PTO are not in Brett's list | Connected | Missing | Read; events are staged (they send invites) |
| Asana | Primary tracker: priorities (Brett's World), projects, production templates and rules, support-request form | Brett; Elizabeth runs production projects and automations; whole team | Workspace 459051476492004; Brett's World for priority order | Connected | asana-conventions.md exists; Elizabeth's half pending | Seat-initiated creates and updates wait for proof of concept; Brett-directed writes now; never complete or move; delete only tasks the agent created, per task, with Brett's go; never touch automation-driving fields or templates without Brett |
| Zoho CRM (with WES and BluRoot extensions) | Client, agent, and listing records; escrow operations through WES/BluRoot; List It Live, Radio Shows, Brokers, Video Library, Frontend Listings, Appearances custom modules | Brett; Elizabeth (heavy user, in and out for projects and reconfiguration; expect considerable future involvement); Cassie (client follow-up); escrow teams | Zoho CRM org; modules verified 2026-09-30 | Connected | zoho-conventions.md | Append and update prep fields; never status fields, workflows, templates, or deletes |
| CRMLS to Zoho sync | One-way listing sync from CRMLS (CoreLogic Trestle: IDX Plus WebAPI, plus the REcore Back Office feed for Expired and Withdrawn since 2025-08-04) into the Zoho Listings module (API name List_It_Live). Works through CRMLS changes in batches with a three-day look-back, never re-checks listings dated over 12 months ago, and creates only listings dated within the last 12 months (Andrew, 2026-10-20); hourly pulls the 500 newest. Filters: PTP, NDP, ND prefixes or SD suffix, price over $500K, local office keys, residential plus residential income (from 2026-07). Excludes Opendoor, which the blacklist doc omits; the final broker list is pending Elizabeth. Manual "sync listing" button in Zoho | Built and maintained by Aether Automation (Andrew Simpson, the only developer who knows the code; David Shih for billing). Silver SLA cancelled 2026-06-26 at Brett's request; support is ad hoc by email. Elizabeth runs it day to day; Michelle spot-checks monthly (Asana "Compare CRMLS Data w/ Zoho Listings") until an agent review takes over: scoped 2026-10-13, weekly until two clean weeks, then monthly (Brett); findings go by email to Elizabeth, Michelle, and Brett. Residential Income fixed 2026-10-20 (the feed sends "ResidentialIncome"); 31 of 33 synced the following week (weekly run 2). About 4,300 Active listings not synced since mid-September: in a 17-listing CRMLS sample, 6 were simply unchanged, 9 were Closed, Expired, or Canceled in CRMLS but still Active in Zoho (missed status changes, plus 2018-era records that never synced), 2 were modified after their last sync. Aether is testing a fix in parallel (2026-10-20) | Aether's code; where it runs (Zoho functions or Aether's server) could not be determined. Running: records modified 2026-09-30 11:16, Expired and Withdrawn still updating | Through Zoho (read) | zoho-conventions.md (sync-owned fields) | Read only; never touch the sync functions or schedules |
| Smartsheet | Escrow team sheets (JD Unit, Teams 3, 5, 7, 9), Gross Fees Report, Company Call Log, Client Report | Escrow teams; Brett; leadership | Workspaces Five Star (team sheets, reports), Media (RTM PTO Requests and RTM/Sales Support, both active; Social Media Accounts, untouched since 2023-06; VA Pay Adjustments, compensation, not opened), Archive; sheet IDs in Operations/Dashboards/docs/dashboard-inventory.md | Connected | smartsheet-conventions.md (Elizabeth answered 2026-10-12) | Read; every write staged |
| Canva | All brand kits, logos, RTM-produced assets for FSE and RTM | Brett; offshore designers (Princess, Krasny) | Canva brand kits (FSE Brand Kit kAGQTQCeLNk) | Connected | Missing | Read; design edits staged; never publish |
| Duda | Real Talk Media website builder | Elizabeth drives it; Brett; designers build | Duda account | None | Missing | Nothing (no access) |
| Miro | Production process maps, process of record until SOPs are consolidated | Elizabeth drives; Brett approves | Boards uXjVH5BBYTQ= (flow chart), uXjVHpFO4nI= (process), per-show boards | Connected (claude.ai connector); boards also readable in BW Office Chrome | Missing | Read in BW Office Chrome only |
| Plaud | Recordings and transcripts: Brett's account feeds the cut sheets; Elizabeth's separate account (Mark uses it on occasion) captures meetings and feeds her Friday weekly operations brief to Brett | Brett (his account); Elizabeth (her account) | Two separate Plaud accounts | Connected to Brett's account only | Missing | Read Brett's account (COO: cut sheet pipeline) |
| Tracerfy | Skip tracing and property owner lookups (billed per hit) | Brett; research-sidekick | Tracerfy account | Connected | Missing | Keep, dormant: prepaid credits (1,670 left on 2026-09-30; one $40 purchase 2026-09-15, no recurring charge found in email); used for the investor database. One lookup per named person (research-sidekick brief) |
| Apify | Web scraping actors | Brett; research-sidekick | Apify account set up 2026-10-14; the connector shows the paid BRONZE tier (actor pricing read 2026-10-15), so estimates use BRONZE prices | Connected (desktop extension) | Missing | Research runs per the sidekick brief |
| Claude Docs | Living documents created from Claude | Brett | claude.ai | Connected | Missing | Create and edit docs Brett asks for |
| ScoreApp | REACH funnel scorecard | Brett | ScoreApp account (set up, Brett 2026-09-30) | None | Missing | Nothing |
| 1Password | Ownership and upper-management logins | Brett, upper management | 1Password | None | n/a | Never (credential rule) |

## 2. Apps Script systems (Five Star)

All four web apps run from Shared Drives > Operations > Apps Scripts, mirrored in `Operations/Dashboards/src`; ship path and rules in `Operations/Dashboards/CLAUDE.md`.

| System | What it does | Owner / users | Source of truth | Connector | Conventions | Agent may touch |
|---|---|---|---|---|---|---|
| FSE Finance Dashboard | Filing console: reads each PDF, proposes name and folder, files on a human click; QC and settings | Brett admin; Felicia, Brooke daily; Molly reads | `src/five-star-finance-dashboard`; Finance Filing Rules sheet `1v90dN7a...` edited only through the dashboard; last build 2026-08-10 | Script via Drive and the built-in browser; calls the Anthropic API (claude-sonnet-4-6) | apps-script-conventions.md | Code change staged, shipped only on Brett's go; never edit the rules sheet directly |
| Five Star Revenue Dashboard | Company revenue: projected fees, opened and closed MTD, gross fees by month, top 20 clients | Brett, leadership | `src/five-star-company-dashboard`; five team Smartsheets | Same | apps-script-conventions.md | Staged |
| FSE Client & Revenue Dashboard | Client revenue ranking, 12-month and YTD, CSV export, and a per-client file history panel (every file, all teams and history, report, date, team, and canceled filters) | Brett; internal domain | `src/client-stats-dashboard`; Version 16 (2026-10-30) | Same | apps-script-conventions.md | Staged |
| FSE Hub (The Hub + Unit Dashboards) | Staff portal (home, team pages, calculator, forms, calendars, directory), per-team dashboards, and the escrow team's front end to the five team Smartsheets (New Escrow opens files; Escrow Lookup finds and updates them); replaced the Google Sites portal 2026-09-23 | Brett builds; Elizabeth edits content through the FSE Portal Content sheet; all Five Star staff | `src/fse-hub`; Version 76 on test and production (2026-11-03: Escrow Lookup grid with sort, filter, and edit in place; Version 73 the same day: anyone reopens a closed file by picking an open File Status; 2026-11-02: Escrow Lookup edits every column but Escrow # now that the team sheets are view-only; earlier: unit dashboard Reports: Closing, Closed, Opened by date range and client with fee totals; earlier: Prefill client info, any-team opens and updates, Property Address editable, Escrow # reuse after a cancellation); content sheet `1i59Xa13...` | Same | apps-script-conventions.md; Elizabeth's content guide in docs/hub-content-guide.md | Staged; content sheet is Elizabeth's |
| BW Daily Brief | Personal brief from Calendar (next 7 days) and Asana tasks, served as the Daily Brief web app Brett reviews every morning, separate from email triage; the ?key parameter is the script's SHARED_KEY (verified live 2026-09-30) | Brett | Script file in BW Lab > Operations > Apps Scripts, not mirrored; last modified 2026-06-12; web app deployment ...P61PGKkW3oX38ovA (URL carries an access key parameter, not recorded here) | Drive | apps-script-conventions.md | Live (Brett, 2026-09-30; retirement reversed). Mirror into Operations/Dashboards/src when next touched |
| Finance utility scripts (Build Filing Rules Sheet, Finance Records Structure Spec v2, Finance SOP Link Inventory) | One-off finance Drive migrations and audits | Brett | Drive script files; code in `Operations/Dashboards/tools` | Drive | apps-script-conventions.md | Never rerun without Brett |

## 3. Email HQ machinery (inbox as a system)

| System | What it does | Owner / users | Source of truth | Connector | Conventions | Agent may touch |
|---|---|---|---|---|---|---|
| morning-inbox-triage | Cleans and reports on the Primary inbox 7 AM, 11 AM, 3 PM daily; last run 2026-09-30 07:16 | Brett; COO owns the machinery, chief of staff owns what the mail says | Spec `Email HQ Resources/gmail-triage-system.md`; task file `C:\Users\brett\Documents\Claude\Scheduled\morning-inbox-triage\SKILL.md`; state and log in Email HQ Resources | Gmail connected (draft-only) | The spec plus email-register.md sender rules | Archives solicitations only; any rule or task change staged |
| Gmail labels and filters | Folder structure (FSE, Financial, Personal, Tech & Tools, Authors & Coaches) and alias filters | Brett | Gmail settings; filters that touch triage listed in gmail-triage-system.md (read 2026-10-09) | Connected | Missing | Labels and filters read 2026-10-09; changes staged for Brett's go (Gmail label purge is on Hold) |
| SaneBox (@Sane labels) | Third-party sender sorting: Brett drags a sender into an @Sane label once and future mail from that sender files there (@SaneNews, @SaneNoReplies, @SanePurchases, @SaneBlackHole); the triage task's Solicitations label sits under @Sane | Brett (active, keep; Brett 2026-09-30) | SaneBox account | None | gmail-triage-system.md (Related systems) | Nothing; never move mail out of @Sane labels |
| Email aliases | bward@ and brett@realtalkmedia.com, brett@fivestarescrow.com forward to brett@brettward.net | Brett | Email HQ MEMORY.md | Gmail | email-register.md | Read |

## 4. Reporting jobs and the Claude layer

| System | What it does | Owner / users | Source of truth | Connector | Conventions | Agent may touch |
|---|---|---|---|---|---|---|
| fse-client-attribution-weekly | Replaced 2026-10-09 by the client attribution lookup in the FSE Client & Revenue Dashboard (production) and the Unit Dashboards team pages (FSE Hub); paused in the Cowork tab by Brett 2026-10-09 (delete after 2026-10-16 if no one asks for the CSVs), past CSVs kept. When it ran, Fridays 6 PM: pulls Smartsheet Client Report 2801773113724804, dedupes customers, writes a dated CSV to Drive folder 1DxeT0nvWZYK3t3vk1JXMjagsk_Aaxf5g | Brett | Task file `C:\Users\brett\Documents\Claude\Scheduled\fse-client-attribution-weekly\SKILL.md` (last edited 2026-05-27) | Smartsheet, Drive | Missing | Task change staged |
| Reel cut sheet system | Factory reel cut sheets: Plaud recording and transcript in, WhisperX timing, engine, verify, blind judge, editor-ready landscape .docx; team fallback through the reel-cut-sheet account skill and show projects | COO (Brett, 2026-10-05); Mark and the editors use the output | `Content & Authority/Reel Cut Sheet System`; team SOP Google Doc "Cutsheet Build Process" | Plaud (Brett's account) | content-frameworks.md, voice-principles.md, engine/SKILL.md | Engine and show-context edits staged; deploy on Brett's go |
| Seats, workers, skills, scheduled tasks, satellites | The AI Workforce | Brett | systems-registry.md | n/a | autonomy-boundaries.md | Per each brief |
| Branding Blueprint skills | Client branding work run by the CMO: the blueprint entry skill (runs an engagement end to end and tracks each client in status.md, built 2026-11-03) over blueprint-audit (Internal Brand Audit and client documents, 2026-10-14), blueprint-portal-bio (2026-10-30), blueprint-website-copy (2026-11-02), and blueprint-strategy (2026-11-03); all five passed on Jim McInerney | CMO runs; Brett reviews | `.claude/skills/blueprint-*`, shared reference `.claude/blueprint/reference/` | Web, Apify, Google Drive | content-frameworks.md (SB7, Three Spheres 11.1, 75/25 ratio 11.4) | Drafts only; nothing sent to a client without Brett |
| pilot-loop-check (Ask the Workforce) | Every 30 min on weekdays, answers asks in the Asana project Ask the Workforce as the owning seat; changes wait for a like or Approved. Built 2026-10-30 for Elizabeth's pilot | COO owns; Elizabeth and Brett ask and approve | `.claude/skills/pilot-loop/SKILL.md`; task file `~/.claude/scheduled-tasks/pilot-loop-check/SKILL.md`; state and logs in `Operations/AI Workforce/logs/pilot-loop-*` | Asana connected | The pilot-loop skill and its four rules | Comments in Ask the Workforce post without per-comment approval (Brett, 2026-10-30); every other write waits for a like or Approved |
| Registry hooks (registry-guard) | Enforce the registry rule in Code tab sessions: block a new `.claude/agents` or `.claude/skills` file until it has a registry row, re-render the registry page when systems-registry.md or links.json is saved, record each publish in `registry-page/.last-publish`, and stop a session from ending while the page is unpublished. Built and tested 2026-10-15 | COO maintains; runs in every Cowork OS Code tab session | `.claude/settings.json` hooks running `.claude/hooks/registry_guard.py` | n/a (local Python) | AI Workforce CLAUDE.md Workflow step 5 | Hook changes staged; never bypass a block |

## 5. Team platforms (not agent-managed)

Carried so the map shows the whole stack. No connector, no conventions file, no agent access. Purpose per Brett, 2026-09-30.

| System | What it does | Owner | Agent may touch |
|---|---|---|---|
| iSolved | HR portal (payroll, benefits) | Felicia | Nothing |
| Intermedia | Email service provider for Five Star Escrow mailboxes | Elizabeth | Nothing |
| Elevate | VOIP phones and internal chat | Elizabeth | Nothing |
| TrustLink | Escrow banking compliance (daily banking and recon reports) | Heather and Jen | Nothing |
| Outlook Web Portal, Unishippers, Rapid Delivery, Ease, 401go, Healthpeak Stride | Hub-linked staff tools (webmail, shipping, insurance, 401k, tenant portal) | Elizabeth | Nothing |
| Shared ChatGPT workspace | 17 team projects; Brett's own GPTs stop after December 11 | Elizabeth (pilot user) | Nothing |

## 6. Drift found (recommended fix per item)

| # | Where | What is wrong | Fix / status |
|---|---|---|---| 
| 1 | fse-client-attribution-weekly task file | Team mapping knows only BH, MR, JD, BC, EC; Teams 5 and 9 (added 2026-08-28) fall into UNKNOWN every Friday. Current codes read from the team sheets 2026-09-30: CM (Team 5, Charli) and VJ (Team 9, Vickie). The same sheets also carry older codes JM, JC, KC (CB- prefix), HB, MR | Applied 2026-09-30: CM to Team 5, VJ to Team 9; legacy codes stay UNKNOWN (Brett). Not resolved: the 2026-10-02 output has no Team 5 or 9 rows and shows Sydney Rolfs as a team (Sydney is Team 7, Brett 2026-10-07); carried to the dashboard lookup task, and the job retires there. Cause found 2026-10-08: the Smartsheet Client Report omits Teams 5 and 9 as sources (smartsheet-conventions.md drift 1); no change, the job retires into the dashboards. Resolved 2026-10-09: the dashboard lookup reads the five team sheets and assigns team by sheet, so Teams 5 and 9 show and "Sydney Rolfs" (a Sales Rep value) no longer reads as a team |
| 2 | Operations Resources/finance-system-reference.md | Says the Finance Tools claude.ai project is the active working surface; it was retired 2026-08-19 and work happens in Operations/Dashboards | Applied 2026-09-30 |
| 3 | systems-registry.md | Hub listed as Version 30; live is Version 33 | Applied 2026-09-30 |
| 4 | Dashboards/docs/system-reference.md | Revenue Dashboard described as embedded in the Google Sites portal, retired at cutover 2026-09-23 | Applied 2026-09-30 |
| 5 | Operations/MEMORY.md | Calls triage "on-demand"; it runs three times daily. Also still lists IRS Matter under Systems Inventory | Applied 2026-09-30 |
| 6 | gmail-triage-system.md | Says runtime files live in the Scheduled folder and each run writes triage-dashboard.html; only SKILL.md is there, state and log are in Email HQ Resources, and no triage-dashboard.html exists | Applied 2026-09-30 |
| 7 | Operations Apps Script shared folder | Holds "Aprilia Peace Form", a personal script, among team systems | Applied 2026-09-30: moved to Brett's My Drive in the built-in browser (Brett now owner; script ID unchanged) |
| 8 | Operations/Portal Rebuild/MEMORY.md | Says phase 2 is on hold while logging the Links tabs shipped 2026-09-28 | Applied 2026-09-30 |
| 9 | OS guide Connectors table | Omits Apify, which is connected | Add the row | Applied 2026-09-30 |
| 10 | Operations/MEMORY.md and root MEMORY.md | Call the CRMLS sync "stable, no active work"; it changed in 2026-07, has no SLA, and has open items (section 7). Root MEMORY.md also still calls triage "on-demand" | Applied 2026-09-30 |
| 11 | Zoho Listings module | Property Status holds variant spellings (CANCELED and CANCELLED, ActiveUnderContract and Active Under Contract, ComingSoon and Coming Soon) | Recorded in zoho-conventions.md Known drift (2026-10-08); read-side mapping, zoho-specialist hygiene pass; no change now |

## 7. Answers and open items

Answered by Brett 2026-09-30: Workspace admins are Brett and Elizabeth; SaneBox is active and stays; Apify and Tracerfy are in use; ScoreApp is set up; Team 5 and 9 codes looked up (drift item 1); Hub platforms described (section 5).

Verified 2026-09-30: apriliapeace-nextdoor-watch is live (daily desktop task); the fse-client-attribution-weekly spec is in the Scheduled folder (section 4); BW Daily Brief sent no email in 60 days; the six account skills (setup-claude, consolidate-memory, import-memory, explain-usage, morning, schedule) were never invoked in any Code or Cowork session on this machine (claude.ai web chats not checked), and none can feed a dashboard, since the dashboards are Apps Script and never call Claude skills. starter-session-audit, which the registry says to switch off, was invoked 8 times in Cowork sessions.

CRMLS trace (Aether email history, read 2026-09-30; live Zoho check the same day): the sync is running. The three items below that email left unconfirmed are resolved (Brett, 2026-09-30): the API-credit reduction Aether promised (Zoho allows 55K free credits a day, overage billed) has no confirmed outcome since 2026-05-11; listing 260013942SD never synced after the residential-income change (last email 2026-07-10); the Trestle API address change announced for before 2025-12-31 has no confirmation; MLS feed and CRM Plus credentials were sent in plain email three times (2025-07-30, 2025-12-18, 2026-04-15; thread IDs in coo-log, values never copied). The sync depends on one developer with no SLA.

Still open:
1. Shared-login handling: resolved (1Password share links, 2026-09-30).
2. Aprilia Peace Form script: resolved, moved to Brett's My Drive 2026-09-30. The BW Daily Brief stays in BW Lab > Operations > Apps Scripts.
3. Account skills: resolved, none active on the claude.ai account (Brett, 2026-09-30).
4. IRS Matter satellite stays until the IRS decides.
5. Attribution lookup: shipped 2026-10-09 (Brett's World task 1219044576941159). Client name merge shipped 2026-10-12 (Client Merges tab in the FSE Portal Content sheet). Follow-ons in AI Workforce, COO section (Brett, 2026-10-12: prerequisites for the platform workers): "Client profile: show complete file history", "Smartsheet intake: scope forms for new customers and new escrows" (the dropdown task is on hold behind it). Names fixed at the source 2026-10-12 (2,711 cells); biweekly client name check in root CLAUDE.md. Agent CRMLS review: AI Workforce task 1219044492585867.
6. BW Daily Brief: resolved 2026-10-13, no fold (Brett's World task 1219046154482243). Brett keeps the three morning surfaces separate: the BW Daily Brief dashboard (both calendars for 7 days, team tasks due today, completed yesterday), the chief of staff Daily (his own day), and the 7 AM triage rollup (inbox). No change to the triage spec.
7. Tracerfy: kept as prepaid and dormant pending Brett's confirmation that there is no recurring cost.

## 8. Conventions files

| Platform | File | Status |
|---|---|---|
| Asana | 00_Resources/asana-conventions.md | Exists; Elizabeth's half: two questions open (2026-10-12) |
| Zoho | 00_Resources/zoho-conventions.md | Exists (2026-10-08); Elizabeth's half confirmed 2026-10-12 |
| Smartsheet | 00_Resources/smartsheet-conventions.md | Exists (2026-10-08); Elizabeth answered 2026-10-12 |
| Apps Script and dashboards | 00_Resources/apps-script-conventions.md | Exists (2026-10-09) |
| Drive | 00_Resources/drive-conventions.md | Exists (2026-10-12) |
| Gmail | gmail-triage-system.md plus email-register.md | Partial (inbox-specialist) |
| Canva | none | Missing |

## Excluded

Max Income systems and apriliapeace are Personal Layer and outside the COO lane; they are not mapped here beyond this line.
