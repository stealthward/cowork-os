# Dashboards Memory

_Last updated: 2026-11-02_

## Project Status

- Migration complete (2026-08-19): canonical folder built from live GAS sources plus history mined from the four original claude.ai threads. Drive copy retired; all nine standalone script files consolidated in Shared Drives > Operations > Apps Script.
- Live systems: FSE Finance Dashboard (last build 2026-08-10), Five Star Revenue Dashboard, FSE Client & Revenue Dashboard (build 2026-07-06d fullfetch), Unit Dashboards. All four /exec URLs verified working and recorded in docs/dashboard-inventory.md.
- 2026-08-28: Teams 5 (Charli) and 9 (Vickie) added to all three revenue dashboard mirrors, plus Canceled-match unification and the Client Stats header fix. Revenue universe is now five team sheets.

## Open Items

- Hub intake (2026-10-19): New Escrow and Escrow Lookup (`?page=open`, `?page=file`, Intake.gs) are live on production and TEST Version 65 (2026-10-26: Prefill client info and Escrow # reuse; 2026-10-22: Property Address editable; 2026-10-21: every signed-in user opens and updates files for any team; 2026-10-20, Version 58: test mode logs "(test)" to its own Hub Log (test) tab and never adds to the name lists), with scratch empty, and the team was told to stop using Smartsheet on 10/19. Watch the first real Hub close or Purchase Contract reach the Zoho queue. Next is the team sheet lockdown after Jen and Heather review it (AI Workforce > COO). The SCRATCH Hub intake test sheet stays for testing, and Elizabeth's tabs email is still in Brett's drafts.
- Team sheets view-only (2026-11-02): the team is Viewer on the Escrow Team Sheets workspace; every correction goes through Escrow Lookup, which edits every column but Escrow # since PRODUCTION and TEST Version 72. Watch the first real name edits and "Add it" rows in the Hub Log.
- Anyone on the team reopens a closed file in Escrow Lookup by picking an open File Status, which clears Actual COE (Brett, 2026-11-03; PRODUCTION and TEST Version 73). Watch the first "reopen" row in the Hub Log.
- Escrow Lookup grid (Joyce's ask, 2026-11-03; PRODUCTION and TEST Version 76): sort, filter, COE Today and date range, and edit in place for every team, settings kept per person. Watch the first grid edits in the Hub Log; a live cell save was not tested.
- Hub Escrow # reuse (2026-10-26): live on PRODUCTION and TEST Version 64. Watch the first real reuse land with its "reused Escrow #" Hub Log row.
- Hub pre-opens (2026-10-20): New Escrow pre-open, Escrow Lookup Open it and Remove, stale list on team pages; live on PRODUCTION and TEST since 2026-10-20, production and TEST Version 66 (Version 66 labels a pre-open's blank dates "Set it in Open it below"; label and normal New Escrow verified live; TEST-PRE-001 removed from the scratch sheet). Watch the first real pre-open land under PRE-OPENS.
- Unit dashboard Reports (2026-10-30): Closing, Closed, and Opened reports by date range and client with fee totals replaced Closing, Next 7 Days; production and TEST Version 70. Canceled files are out by Brett's call. Watch for the teams' first month-end reconciliation feedback.
- Client file history (2026-10-30): the FSE Client & Revenue Dashboard client panel shows every file across all teams and history with Reports-style filters and summary cards that follow them (Version 16). Brett signed off and the Asana task closed 2026-10-30.
- Hub team announcements go to the 8 escrow team members plus fda@fivestarescrow.com, cc Heather Bayes and elizabeth@realtalkmedia.com (Brett, 2026-10-19).

- Client attribution lookup (2026-10-09): live on Client Stats (Version 11) and FSE Hub test and production (production deploys: see apps-script-conventions.md, Shipping a change). fse-client-attribution-weekly paused 2026-10-09 (delete after 2026-10-16 if no one asks for the CSVs). Hub Links tab "Client Attribution" row now points at the Client Dashboard. Follow-on in AI Workforce (COO section): "Client profile: show complete file history".
- Client name merge (2026-10-12): live on Client Stats production and Hub production (Version 38; TEST 37). New misspellings are fixed by adding a row to the Client Merges tab of the FSE Portal Content sheet. Names fixed at the source the same day (2,711 Directing Customer cells; every client now has one spelling). New misspellings: add a Client Merges row, then run applyMergeRows in the Client Stats editor on Brett's go; the biweekly client name check in root CLAUDE.md finds them. Prevention is the intake forms task in AI Workforce (COO section).

- All three revenue dashboards deployed with Teams 5 and 9 and confirmed by Brett 2026-08-28; src/ mirrors and live code are back in sync.
- Gross Fees Report (Smartsheet 3780278582830980): Team 5/9 columns exist and are fed by live cell links from source sheets. Jan-Aug 2026 blanks are correct, both teams' first closings are SEP 2026 (confirmed by Brett 2026-08-28). No open items remain from the two-team addition.
- Gross Fees Report reconciliation rule: the annual roll-up row links to each team sheet's full-year booked fees, while month rows only capture files with a Projected COE. A file with fees but no estimated close date appears in the annual total and no month, so a small annual-vs-months gap is normal, not an error.
- FSE Hub, Links and Contact tabs SHIPPED 2026-09-28 (Version 33 on TEST and PRODUCTION): Home, Team Resources, and Admin links plus the contact block read from the Links (65 rows) and Contact (13 rows) tabs of the FSE Portal Content sheet, constants kept as fallback. src/fse-hub/Portal.gs mirrors live. The Hub content guide for Elizabeth (docs/hub-content-guide.md, .docx in _Outbox) covers all four sheet tabs; emailed to her 2026-09-28, change requests come back through Brett.
- The Hub is now the FSE Hub GAS project (Dashboards.gs + Portal.gs, one /exec URL); Google Sites cut over 2026-09-23. Build history in CHANGELOG.md; live state and open items in Operations/Portal Rebuild/MEMORY.md. Recurring maintenance threads live in the Hub+Dashboards sidebar group; one thread per visit, and every change is logged in CHANGELOG.md the same session. The old per-team fee calculator Sheets (Drive folder 1a1mfUZonFA9A93o0N14aGTjc1zZkzVMN) await archival, tracked in the Portal Rebuild MEMORY.
- BW Daily Brief GAS project is live (feeds the daily brief dashboard Brett reviews every morning) and not mirrored here; its scheduled-task predecessor is deprecated. Email triage stays out of it (Brett, 2026-10-13): the dashboard, the chief of staff Daily, and the 7 AM triage rollup remain three separate morning surfaces.
- Closed 2026-08-28: Client Stats stale header comment (rewritten) and inconsistent Canceled matching (Per Team now trims + lowercases like the other two).

## Key Decisions

- Canonical home is this folder inside Operations, not a standalone workstation and not Google Drive. Brett treats Operations as the systems tier. (2026-08-19)
- Finance Tools and Dashboards claude.ai satellites both retired. All dashboard and Apps Script work, new builds and modifications to existing systems, happens in Cowork against this folder. (2026-08-19)
- Drive's only role is runtime: deployed Apps Script projects in Shared Drives > Operations > Apps Script. Moving script files in Drive does not affect script IDs, deployments, or /exec URLs. (2026-08-19)
- The script.google.com dashboard shows zero projects and that is expected: it does not index shared-drive files, and all nine script files live in the shared drive. Open projects via Drive or the editor URLs in docs/dashboard-inventory.md; verified nothing missing 2026-08-28. (2026-08-28)
- Live GAS exports are the source of truth, not chat-thread reconstructions; the deployed code was substantially ahead of what the threads contained. (2026-08-18)
- Token property ground truth is SMARTSHEET_TOKEN (verified in code); the earlier harvested reference said SMARTSHEETTOKEN, which was wrong. (2026-08-19)
- Full decision history for the dashboards themselves (module engine, revenue rules, filing engine design) lives in docs/decisions.md.
