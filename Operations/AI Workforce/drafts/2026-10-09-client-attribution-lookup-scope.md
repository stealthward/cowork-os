# Client attribution lookup: scope and plan

_COO, 2026-10-09. Personal Layer. Asana: "Fold client attribution into the team dashboards and the FSE Client & Revenue Dashboard as a lookup" (Brett's World, Active Tasks, 1219044576941159). Status: awaiting Brett's approval._

## Scope

| Item | Answer |
|---|---|
| System | fse-client-attribution-weekly (Cowork scheduled task, Fridays 6 PM) is replaced by a client lookup in two Apps Script dashboards: the Unit Dashboards team pages (FSE Hub project) and the FSE Client & Revenue Dashboard (Client Stats project). |
| Who uses it | Sales reps and escrow teams (the Hub's "Client Attribution" link points at the job's Drive folder); Brett. |
| Question it answers | "Whose client is this?": Team, Sales Rep, Last Open for any Directing Customer. |
| Source of truth | The five team Smartsheets (JD Unit, Team 3, Team 5, Team 7, Team 9), read directly. Not the Smartsheet Client Report the job reads, which omits Teams 5 and 9. |
| Team logic | Team is the sheet that holds the client's most recently opened file (the dashboards' 2026-07-02 rule). No suffix codes and no lead names, so Teams 5 and 9 appear and Sydney's clients show as Team 7 by construction. Sales Rep and Last Open come from that same file. |
| Name merge | The dashboards' rule: case and whitespace insensitive. The job's fuzzy merge is dropped; the typeahead shows near-variants side by side. The job's junk-name filter (blank, NA, Previous Buyer, file-number pattern) is kept. |
| What exists today | Client Stats lookup lists only clients with a closing in the window and shows no Sales Rep or Last Open. Hub lookup searches one team's sheet only (12 months). |
| Platform | Google Apps Script, shipped per 00_Resources/apps-script-conventions.md in the built-in browser. Hub: test deployment first. Client Stats: straight to production, checked live with ?debug=. |
| May touch | src/client-stats-dashboard/Code.gs, src/fse-hub/Dashboards.gs (and Portal.gs for the link fallback), both live projects, the scheduled task (retire on Brett's go). Not touched: revenue rules, Five Star Revenue Dashboard, the Smartsheet Client Report, the FSE Portal Content sheet (Elizabeth's). |
| Specialist | dashboard-builder not built. No specialist: COO does it in session and logs the gap; this is the worker's first candidate task. |

## Definition of done (proposed)

1. On both dashboards, typing any Directing Customer from any of the five team sheets returns Team (as a team number), Sales Rep, Last Open.
2. Spot check of 10 clients against the team sheets (read through the Smartsheet connector) matches, including at least one Team 5, one Team 9, and one Sydney client showing Team 7.
3. Revenue figures unchanged: Client Stats ?debug= and Hub &format=json totals match the pre-change baseline.
4. Hub team pages load with no visible slowdown (timed before and after).
5. The Hub's "Client Attribution" link points at the new lookup, the weekly job is off, its Drive folder of past sheets is kept, and every doc below is updated.

## Plan

| # | Step | Who | Staged or done |
|---|---|---|---|
| 1 | Baseline: confirm mirrors match live, capture ?debug and &format=json, time a Hub team page, size the client index (count of distinct clients across five sheets) | COO in session | Done (read-only) |
| 2 | Shared index builder in both projects: one row per client with team, rep, last open, built from all five sheets, all history | COO | Mirror edit |
| 3 | Client Stats: lookup searches the full index; detail opens with Team, Sales Rep, Last Open; revenue detail shows when the client closed in the window | COO | Ship to production, live check |
| 4 | Hub: lookup adds a cross-team attribution line (team, rep, last open) from an index cached by the existing 10-minute portalWarm trigger; own-team 12-month stats unchanged | COO | Ship to test (...mzVCIQl0) |
| 5 | Brett reviews the test deployment | Brett, 15 min | His review |
| 6 | Hub production deploy (...T1znbArm) | COO | On Brett's go |
| 7 | Repoint the Hub "Client Attribution" link to the Client Dashboard: Portal.gs fallback constant, plus the Links tab row in the FSE Portal Content sheet (Elizabeth's) | COO drafts the request to Elizabeth from the COO | On Brett's go |
| 8 | Retire fse-client-attribution-weekly; keep Drive folder 1DxeT0nvWZYK3t3vk1JXMjagsk_Aaxf5g | COO; Brett if the Cowork tab is the only switch | On Brett's go |
| 9 | Docs: Dashboards CHANGELOG, MEMORY, system-reference, data-dictionary; operations-map section 4 and drift 1; smartsheet-conventions consumer row; systems-registry, links.json, render and republish; root MEMORY.md Scheduled Tasks row | COO | Same session as each change (edits outside AI Workforce staged per the brief) |

## Risks and unknowns

- Hub load: team pages fetch one sheet today; cross-team needs all five (about 12,000 rows). The cached index avoids a five-sheet fetch per page view. Cache entries cap at 100 KB, so the index may need to be split across keys; step 1 sizes it.
- Not verified: how a Cowork scheduled task is switched off from Code (it does not appear in the desktop scheduled-tasks list). Checked at step 8.
- Not verified: whether reps rely on the Drive CSVs for anything beyond lookup (sorting, export). Client Stats already has CSV export; it will include Sales Rep and Last Open.

## Decisions for Brett

1. Team pages search all five teams (recommended) or own team only. Cross-team shows only Team, Sales Rep, Last Open for other teams' clients, never fees.
2. History window: all history with Last Open shown (recommended), or last 24 months.
3. Hub link: repoint "Client Attribution" to the Client Dashboard (recommended) or remove it.
4. Target date: test review Tue 10/13, done Wed 10/14 (proposed; the chief of staff fits it into the day plan).
