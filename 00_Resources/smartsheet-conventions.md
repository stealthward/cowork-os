# Smartsheet conventions

_Shared Core. This file explains how Smartsheet is used at Five Star Escrow. It is written so an agent can read the escrow data without misreading it and never breaks the dashboards, the status workflows, or the Zoho status queue. The COO drafted it 2026-10-08 from a live read-only sweep of the account (counts as of that day), Operations/Dashboards docs (system-reference.md, data-dictionary.md, decisions.md, sop-new-team-setup.md), the operations map, and Elizabeth's "Update Unit Smartsheets for Next Year" task. Approved by Brett and promoted to 00_Resources/ 2026-10-08. Elizabeth answered 2026-10-12. When Smartsheet and this file disagree, ask, then update this file. Read it before creating, updating, reading, or auditing anything in Smartsheet._

## The rule in one line

Agents read anything except compensation sheets and stage every write. The team sheets feed four live dashboards, a status workflow, and the Zoho status queue, so a renamed column or a changed File Status breaks something downstream.

## The account

Brett owns all four workspaces and, since the 2026-11-02 move into Escrow Team Sheets, every team sheet. Every Smartsheet question goes to Brett first; he redirects it to the right person case by case (Brett, 2026-10-14).

| Workspace | Folder | Holds |
|---|---|---|
| Escrow Team Sheets | (root) | The seven team sheets (JD Unit, Teams 1, 3, 5, 7, 8, 9), moved here 2026-11-02 so the team can be view-only on them |
| Five Star | Reports | Gross Fees Report, the status-change pair, New Year Unit Template, 18 reports |
| Five Star | Operations | Company Call Log, Company Directory, Net Sheet, Office Favorites (old and NEW), FSE PTO Requests, FSE Support, FSE Web Contact Form, Escrow Recruiting, Vendor Finance Support |
| Five Star | (root) | Two retired All Escrows reports |
| Media | Operations | RTM PTO Requests, RTM/Sales Support, Social Media Accounts, VA Pay Adjustments |
| Archive | BW, FSE (REeBroker), RTM (Show Production) | Archived in 2025-12. The modified date is the move date, not activity |

There are no Smartsheet dashboards. The dashboards are Apps Script (operations map, section 2).

## The team sheets

| Sheet | ID | Rows | Owner | State |
|---|---|---|---|---|
| FSE Unit JD | 6403198558359428 | 335 | Brett | Active, in dashboards |
| FSE Team 3 | 339384860993412 | 5,068 | Brett | Active, in dashboards, history to 2015 |
| FSE Team 5 | 8144815540987780 | 492 | Brett | Active, in dashboards since 2026-08-28 |
| FSE Team 7 | 307047045588868 | 5,815 | Brett | Active, in dashboards, history to 2013 |
| FSE Team 9 | 2609780876437380 | 405 | Brett | Active, in dashboards since 2026-08-28 |
| FSE Team 1 | 5174048184395652 | 786 | Brett | Dormant (last edit 2026-05-27), excluded from dashboards |
| FSE Team 8 | 8734754691409796 | 87 | Brett | Dormant, excluded |
| FSE Unit HB | 8221233964705668 | 92 | Brett | Dormant since 2025-06, excluded |
| FSE Unit Terra | 5467918034069380 | 40 | Brett | Dormant since 2019, excluded |

**Active teams are the five in dashboard config:** JD Unit, Team 3, Team 5, Team 7, Team 9. Company total always equals their sum (system-reference.md). A team is added only through docs/sop-new-team-setup.md.

**Team leads (Brett, 2026-10-07):** Sydney is Team 7, Charli is Team 5, Vickie is Team 9. Assign a file to a team by the sheet it sits on.

**Standard (Brett, 2026-10-16: total uniformity on the five active sheets and the New Year Unit Template).** The same 21 columns in this order on all six: Wholesale?, Escrow # (primary; unique across sheets, except a number reused after its earlier file was Canceled, per the Hub's 2026-10-26 rule), Property Address, Seller/Borrower, Type, Directing Customer, Listing Agent or Loan Officer, Buyer Agent, Buyer Agent Phone #, Sales Rep, Title Company, Title Rep, Open Date, Projected COE, Actual COE, File Status, Escrow Fees, plus the four system columns. Lead EO and 1st Escrow were deleted 2026-10-16 (Brett). Lists, all restricted to the list:
- Type: Equity Sale, Short Sale, Note Sale, Refinance.
- Sales Rep: Brett W., Breana H., Cassie P., Charli M., Heather B., Jen D., Sydney R., Vickie J., Media.
- Title Company: American Coast, California Title, Chicago, Consumer Title, Corinthian, Equity Title, Fidelity, First American, First Integrity, Homelight Title, Lawyers, North American Title, Old Republic, Orange Coast, Pacific Coast, Stewart Title, Ticor, Title 365, Title Resources, Timios Title, Trinity County Title, Western Resources, WFG, Other.
- File Status: Refinance, Listing- Confirmed, Listing- NOT Confirmed, Listing- Wait to Open, Listing- NOT FSE (Deselect), Listing- No Response, Purchase Contract, SS Negotiation, SS Approval, Closed, Canceled.
- Wholesale?, Open Date, Projected COE, and Actual COE are restricted to their type.

A list change is made on all six sheets the same day, never on one. Old file values stay as typed (Brett, 2026-10-16); an off-list value on a restricted column shows flagged and is kept.

**Sections:** a year row, then month parents labeled "MONTH YYYY" in capitals, each with an "Insert new files above" child; then PRE-OPENS (files opened before there is an offer; replaced NEW OPENS 2026-10-20, Brett) directly above CANCELED. Every file under PRE-OPENS and CANCELED is an indented child of its section row, so both sections collapse; the Hub adds a canceled file as the last child of CANCELED. The New Year Unit Template carries both section rows. Each month parent's Escrow Fees is =SUM(CHILDREN()) with a cell link to the Gross Fees Report, so a file added as a child counts in the subtotal. Team 1, HB, and Terra (dormant) keep their legacy names "Primary Customer", "Directing Agent or Loan Officer", and "First Closing?".

**Annual rollover:** Elizabeth's recurring task "Update Unit Smartsheets for Next Year" (EE's World, due each November) copies the New Year Unit Template rows into each unit sheet. The template's columns and lists are stale (see Known drift), so check it against the live sheets before each rollover.

## What depends on these sheets

| Dependent | Reads | Breaks if |
|---|---|---|
| Five Star Revenue Dashboard, FSE Client & Revenue Dashboard, FSE Hub (Apps Script, SMARTSHEET_TOKEN) | The five active sheets in full, columns matched by title | A key column is renamed (Escrow #, Directing Customer, Open Date, Actual COE, Projected COE, File Status, Escrow Fees, Property Address, Sales Rep, Type), a sheet is replaced with a new ID, or "Canceled" is respelled |
| FSE Hub intake (New Escrow since 2026-10-19; Escrow Lookup, Phase 2, since 2026-10-19; Operations/Dashboards/docs/system-reference.md) | Writes new file rows to the five team sheets under their Projected COE month; updates every column but Escrow # on existing rows (since Version 72, 2026-11-02; File Status through its own rules, and since Version 73 an open status on a closed file clears Actual COE, so the file reopens) and moves a row to its new month section or under CANCELED; adds a pre-open as the last child of PRE-OPENS and moves it to its month on Open it (2026-10-20); Brett's token; logs each write to the Hub Log tab | A month section, its "Insert new files above" row, or the CANCELED row is missing or relabeled, a list column loses an option the Hub offers, or Property Address stops holding the section labels |
| Status workflow on each team sheet | A row is added or changed with File Status Purchase Contract, Closed, or Canceled (so a Hub New Escrow write with Purchase Contract fires it), Listing Agent or Loan Officer is not blank, and Type is Equity, Note, or Short Sale. The row is copied to Escrow Status Change Report | File Status, Type, or that column is renamed, or a status is set by mistake (it copies a row into the Zoho queue) |
| Escrow Status Change Report (sheet 2387246146971524) | The queue of status changes to enter in Zoho. Checking "Updated in Zoho" moves the row to Escrow Status Changes Completed (357710890854276). Michelle's "Update Escrow Statuses In Zoho" works this queue | Anyone but the person who made the Zoho entry checks the box |
| Gross Fees Report (3780278582830980) | Month by team grid. The team columns are fed by cell links from each team sheet (Dashboards MEMORY.md) | A cell link is overwritten with a typed value |
| fse-client-attribution-weekly (paused 2026-10-09; replaced by the dashboard lookup, which reads the five team sheets) | Client Report 2801773113724804 | Nothing while paused |
| Brett's weekly "Fees Report" task | Report linked on the task | Its sources change |

## Reading the data

- **Use full-sheet pulls for totals.** Apps Script pulls of the five team sheets are the authority. The connector is for schema discovery and spot checks. Never total from a Smartsheet report: the reports carry different team sets and month-scoped reports bled prior months (decisions.md, July 2026). One exception (Brett, 2026-10-20): the weekly figure on Brett's "Fees Report" task is the Weekly Open Report's own total (3342653090752388, openings in the previous 7 days across the team sheets); read it as is, with no rebuild from the sheets.
- **Section rows are not files.** A real file row has an Escrow #. Year, month, "Insert new files above", and CANCELED rows have none and count as "(blank)" in aggregates, so filter Escrow # not blank before counting blanks. Never count with find_in_sheet: it returned 9 of the 40+ Insert rows on JD (2026-10-20).
- **Closed means Actual COE holds a valid date.** It never means File Status = Closed (that filter undercounted by 64%). Canceled means File Status = "Canceled". Open means no Actual COE and not canceled. Gross fees means Escrow Fees, the only fee column (data-dictionary.md).
- **Share lists lag.** After a share change made in the Smartsheet UI, the share list can return the old list for a minute or more, in the connector's list_shares and in Smartsheet's own page; wait and re-read before redoing anything.
- **Match columns by title, never by position.** Team 3 and Team 7 carry extra columns.
- **Paging:** decide by rows returned versus totalRowCount. Never decide by totalPages, which Smartsheet omits; that once dropped Team 7's newest rows. Team 3 and Team 7 are too large for one connector aggregate, so filter by Open Date.
- **IDs:** the hash in a Smartsheet URL is not the numeric API ID. Take IDs from File > Properties or from this file.
- **History is dirty.** Files typed before 2026-10-16 carry File Status, Type, Sales Rep, and Title Company values outside today's lists, in varied spellings ("Jess", "Jes", "jess"), and blanks are common. Normalize in the read, never in the sheet, and report the variants instead of guessing what they mean.
- **Gross Fees Report rows are not in date order** and the month labels mix formats ("JANUARY 2013", "JAN 2019", year rows stored as "2013.0"). Parse the label, never trust the row order. A small gap between the annual total and the sum of the months is normal (files with fees but no Projected COE).
- **Never read** VA Pay Adjustments or any payroll or compensation sheet. Name it only.
- **Never assume a figure.** Every number in a report cites its sheet and the date it was read (root CLAUDE.md Data and Finance).

## Writing

1. Every Smartsheet write is staged and applied only on Brett's go (operations map; autonomy-boundaries.md "any change to a live system").
2. Never write File Status, Type, Listing Agent or Loan Officer, or "Updated in Zoho". Each one drives a workflow or the Zoho queue.
3. Never rename, delete, hide, reorder, or retype a column on a team sheet, the Gross Fees Report, or the Client Report. Never replace a team sheet with a copy, because the dashboards hold its ID. Column changes go through Brett and Elizabeth, and the Dashboards docs update in the same session.
4. Never overwrite a cell link or formula with a typed value on the Gross Fees Report.
5. Never create, edit, or disable an automation or report source. Change a share only when Brett asks for that exact change in the thread; make it in the Smartsheet Share dialog (the connector cannot write shares), then confirm it in Manage access. Otherwise report what you find.
6. No row deletes and no moves between sheets. A bulk edit runs only on Brett's go for that job: one column, never a column in rule 2, a full row list first (sheet, Escrow #, old value, new value), a check that no workflow fires on that column, a three-row supervised test, then the batch, logged per rule 7. First use: Directing Customer cleanup from the Client Merges tab (Brett, 2026-10-12).
7. Every run log lists sheet, row (Escrow #), column, old value, and new value for each write that was applied.
8. Whenever possible, build every sheet to eliminate user error: lock columns people should not type, restrict pick lists to their values, and route new rows through the Hub. A new team sheet column is locked or list-restricted by default (Brett, 2026-10-19).

## Sharing (read 2026-10-08; Escrow Team Sheets 2026-11-02)

**Escrow Team Sheets (workspace 5719210161661828):** Brett Owner, Elizabeth Admin, everyone else Viewer (Heather, Jen, Cassie Pellegrini, jpriebe, Breana Harris, cmedellin, Sydney Rohlfs, Vickie Jamison, Nat Hyman, Lizbeth Ruiz, Felicia, FSE Admin, Michelle Dayrit, cassandra@realtalkmedia.com, John Casarietti at john@rsmsocial.com). No direct sheet shares: a direct Editor share overrides workspace Viewer, so none is added. Every edit to a team sheet goes through the Hub, which writes with Brett's token and logs the person in the Hub Log (Brett, 2026-11-02).

**Five Star:**
The Five Star workspace has seven Admins (Elizabeth, John Casarietti (john@rsmsocial.com; jcasarietti@fivestarescrow.com is a dead address), Heather Bayes, Jen Decker, FSE Admin front desk, a personal Gmail for Felicia) and about ten editors. Direct shares on single sheets add Nat Hyman, Lizbeth Ruiz, and mnasello. Share changes follow Writing rule 5. Findings go to Known drift and Brett decides.

## Known drift (no change now; each fix staged for Brett or Elizabeth)

| # | Where | What | Proposed fix |
|---|---|---|---|
| 1 | Client Report, All Escrows (365, YTD, base) | Sources omit Teams 5 and 9. This is why the attribution job shows no Team 5 or 9 rows (operations map drift 1) | No change: the job retires into the dashboards, which read all five teams (Brett, 2026-10-08; his task "Fold client attribution into the team dashboards and the FSE Client & Revenue Dashboard as a lookup") |
| 2 | Cancelled Report- Weekly | Sources omit JD Unit | Add JD Unit |
| 3 | Lead EO, all sheets | Stale dropdowns, notes in the column | Closed 2026-10-16: column deleted from the five active sheets and the template (Brett). Still on dormant Teams 1 and 8 |
| 4 | Sales Rep, Title Company | Free-text variants | Closed 2026-10-16: one list on all sheets, restricted; history left as typed (Brett) |
| 5 | Team 9 File Status | "Listing - Confirmed" spacing | Closed 2026-10-16: options aligned (no file values used it) |
| 6 | Team 7 Type | No "Note Sale" option | Closed 2026-10-16: added |
| 7 | Blank File Status | Real files (Escrow # present), 2026-10-20: JD 0; Team 9 1 (row 403, 15581-VJ, also blank Type, Open Date, and fees). The earlier JD 42 and Team 9 55 were section rows. Team 1 and Team 8 not rechecked | 15581-VJ is a pre-open (Brett, 2026-10-20): handled with the pre-open section and Hub change (see drift 18) |
| 8 | New Year Unit Template | No title columns, stale rep and EO lists | Closed 2026-10-16: matches the standard; its sections are still labeled 2026, so the rollover relabels them |
| 9 | Gross Fees Report | Mixed month labels, rows out of order, hidden legacy columns, "JC's Unit" after the system columns | Leave as is unless Brett wants it rebuilt (the dashboards no longer read it) |
| 10 | Workflows | Team 5 and Team 9 workflows are "Untitled Workflow". Team 8's last ran 2022. The Company Call Log email workflow is disabled by the system and has never run | Team 5 and Team 9 named "Copy Changes to Escrow Status Change Report" 2026-10-20 (Brett), matching JD, Team 3, and Team 7; logic unchanged. Company Call Log alert deleted 2026-10-12 (Brett and Elizabeth) |
| 11 | Sharing | A personal Gmail holds Admin on the workspace and the Gross Fees Report. A Call Log share goes to "fivestarsescrow.com" (extra s) | Felicia moves to her Five Star email once she accepts Elizabeth's pending invite; then her Gmail Admin is removed (Brett, 2026-10-12). Elizabeth removed the misspelled kcummings share |
| 12 | Duplicate Escrow # | Team 7 has two rows with Escrow # 14361-MR (rows 5449 and 5452, both Canceled) (found 2026-10-12). A number may repeat when an earlier file was Canceled (Hub rule, 2026-10-26); both rows here are Canceled, so the team confirms whether one is a reuse | Team confirms which row is real; no agent delete (rule 6) |
| 12 | Stale assets | Unit Terra (2019), old Office Favorites (2022), Social Media Accounts (2023), New Year Gross Fees Template (2024), one person-named report (2024), Unit HB, Daily Open and Close Report, Web Contact Form, FSE PTO Requests (2025) | Archive (move to the Archive workspace; rows kept): Unit Terra, Unit HB, the Melissa Tucci report, Daily Open and Close Report, Web Contact Form, FSE PTO Requests, New Year Gross Fees Report Template. Keep both Office Favorites sheets (different people's info) and Social Media Accounts (reference for the new Drive doc) (Brett with Elizabeth, 2026-10-12). Done 2026-10-12: all seven moved to Archive > FSE Archive |
| 13 | Overlap | Daily, Today's, and Yesterday's Open Fees reports, plus three All Escrows variants | Archived all three Open Fees reports to Archive > FSE Archive 2026-10-12; no dashboard reads a Smartsheet report (Brett). All Escrows variants: no change |
| 14 | Team 7 dates | Row 1214, 5982-JD: Open Date 2106-06-13 (both COEs 2016-08-01; -JD suffix on Team 7). Row 4771, 13788-MR: Actual COE 4913-10-01, no Open Date | Closed 2026-10-20: fixed by the team; re-read shows 5982-JD Open Date 2016-06-13 and 13788-MR Actual COE 2024-10-10 |
| 15 | JD rows outside month sections | Rows 309 to 313 (14588, 14662, 14663, 14664, 14892-JD): open Refinance, $650 each, Open Dates 2025-08 to 2025-12, no COE, below DECEMBER 2026. They put the 2026 year row $3,250 above its months | Closed 2026-10-20: Brett called them stale pre-opens and the five rows were deleted (JD 342 to 337 rows; 2026 year row now equals its months, $338,883.27). The aging rule for pre-opens comes with drift 18 |
| 16 | JD repeated Escrow # | Re-read 2026-10-20: 14098-JD (rows 38, 331, different properties), 14594-JD (187, 323), 15054-JD (257, 319), 15156-JD (251, 317, different properties); 15152-BH is on JD row 247 and on Team 3 row 3554, so its $650 counts twice. 14662-JD cleared when the pre-open rows were deleted | Mostly closed 2026-10-20: Jen removed the four canceled copies (rows 331, 323, 319, 317), so each JD number now has one row. 15152-BH is still on both JD row 247 and Team 3 (COO email to Jen, thread 1a15b78e8d12a117; recheck on her reply). Same class as 12 |
| 17 | JD Insert rows | MARCH 2025 and APRIL 2025 have no "Insert new files above" row (rows 94 and 103 are blank); row 132 carries Escrow Fees 0.0 | Closed 2026-10-20 (Brett's go): rows 94 and 103 labeled, 132 cleared; JD has 36 Insert rows, 12 per year |
| 18 | Rollover and PRE-OPENS | Before 2026-10-20: no 2027 section on JD; template labeled 2026 with no PRE-OPENS or CANCELED; NEW OPENS above CANCELED only on Teams 3, 5, 7 | Closed 2026-10-20 (Brett's go): PRE-OPENS directly above CANCELED on all five sheets (relabeled on Teams 3, 5, 7; added on JD and Team 9); Team 9's two legacy NEW OPENS rows deleted; every file under PRE-OPENS and CANCELED indented as a child (children: JD 0 and 22, Team 3 1 and 966 files, Team 5 1 and 3, Team 7 3 and 478, Team 9 1 and 1); PRE-OPENS and CANCELED added to the template. Still open: the 2027 relabel (Elizabeth), the pre-open aging rule and Hub routing (pre-open thread) |
| 19 | Team 3 CANCELED | 13 files under CANCELED are not canceled: 12 "Listing- NOT FSE (Deselect)" (5331-RA, 5427-RA, 5626-RA, 5833-RA, 5957-RA, 5876-RA, 6276-RA, 6594-RA, 6930-RA, 6950-RA, 6441-RA, 6777-RA; 2016 to 2017) and CB-1577-BH (Purchase Contract, opened 2022-06-21). About 329 address-only legacy rows with no Escrow # also sit there | Team sets the right status or removes them (Brett routes); no agent write on File Status |

## Elizabeth's half (answered by Brett 2026-10-12; cleanup with Elizabeth)

Elizabeth answered 2026-10-12 (comment on her task); Brett ruled where they differed. Owners and Admins may edit columns; column changes still go through Brett and Elizabeth (Writing rule 3). Team 9 is active, led by Vickie (Brett, 2026-10-12); Teams 1 and 8 are former teams.

### Earlier note

1. Who may edit each team sheet's columns and dropdowns, and who owns the template?
2. What is Lead EO for now: keep, fix, or drop?
3. Is the Company Call Log email alert wanted?
4. Which stale sheets and overlapping reports can be archived?
5. Is the misspelled Call Log share a person who still needs access?
6. Can Felicia's workspace Admin move from her personal Gmail to her company account (Brett's preference)?

Her answers get merged here and this file's date bumps.

## Change log

- 2026-11-02 (Brett): team sheets made view-only. Brett moved the seven team sheets (IDs unchanged) into the new Escrow Team Sheets workspace; the COO added 12 Viewers (no Smartsheet notification) and removed the direct Editor shares on JD (Heather, Jen, Lizbeth), Team 5 (Heather, Lizbeth), Team 3 and Team 7 (Nat, Lizbeth). jcasarietti@ is no longer valid and was not added. Replaces the 2026-10-19 column-lock plan. Same day: Escrow Lookup made every column but Escrow # editable (Hub Version 72). Team announced 2026-11-03. Trimming Five Star Admins dropped (Brett, 2026-11-03): the team sheets no longer live there.
- 2026-10-27 (Brett): Escrow # may repeat when an earlier file was Canceled (the Hub's 2026-10-26 reuse rule); the column standard and drift 12 say so, and the smartsheet-specialist flags a duplicate only when more than one row is not Canceled. Prompted by Team 7 15693-SR, a valid reuse the client name check flagged.
- 2026-10-20: From the smartsheet-specialist seeded run (Brett approved): drift 7 corrected (section rows, not files); drift 14 to 18 added; status workflow fires on added rows too; section-row reading rule; the weekly Fees Report figure is the Weekly Open Report's own total (Brett). Same day, on Brett's go, drift 17 fixed on FSE Unit JD: row 94 (MARCH 2025) and row 103 (APRIL 2025), Property Address blank to "Insert new files above"; row 132 (JULY 2025 Insert row), Escrow Fees 0.0 to blank. No workflow watches either column; month and year subtotals unchanged on re-read. Later the same day (Brett): Team 5 and Team 9 workflows renamed (drift 10 closed); drift 14 and 15 closed (team fixes, pre-open rows deleted); drift 16 re-read; NEW OPENS becomes a PRE-OPENS section above CANCELED on all five sheets (drift 18); 15581-VJ is a pre-open. Then, on Brett's go: PRE-OPENS built above CANCELED on all five sheets and both sections indented (drift 18 closed), Team 9's legacy NEW OPENS rows deleted, template given PRE-OPENS and CANCELED, drift 19 added (Team 3 strays under CANCELED), drift 16 mostly closed by Jen. Hierarchy checks used a temporary =COUNT(CHILDREN()) or =PARENT() formula in an empty section-row cell, cleared after the read (the connector does not return parentId). The move API takes one location per call; moves do not fire the status workflow (Escrow Status Change Report stayed at 7 rows).

- 2026-10-14: Smartsheet questions go to Brett first, who redirects them case by case; Elizabeth is no longer first contact (Brett).
- 2026-10-19: FSE Hub Escrow Lookup (Phase 2) in production (Version 56): updates and moves rows on the five sheets; dependents row widened.
- 2026-10-19: FSE Hub intake (New Escrow) live in production; added to What depends on these sheets. The escrow team opens files in the Hub instead of typing into the sheets.
- 2026-10-16: Team sheet uniformity (Brett): Lead EO and 1st Escrow deleted; JD gained Title Company and Title Rep; Team 7's unhidden; one restricted list each for Type, Sales Rep, Title Company, File Status on the five active sheets and the New Year Unit Template; section labels in capitals and "CANCELED" (32 rows). Known drift 3, 4, 5, 6, 8 closed. Run log: Operations/AI Workforce/logs/2026-10-16-team-sheet-uniformity-run-log.md.
- 2026-10-12: Rule 6 amended (Brett): bulk edits allowed per job on Brett's go with a row list, a workflow check, a three-row test, and a run log. All five team-sheet status workflows trigger only on a File Status change (read 2026-10-12), so a Directing Customer edit does not copy rows to the Escrow Status Change Report. First use the same day: 2,711 Directing Customer cells corrected across the five team sheets (run logs in the FSE Portal Content sheet); duplicate Escrow # 14361-MR added to Known drift.

- 2026-10-12: Elizabeth's answers and Brett's rulings: delete the Call Log alert; keep Lead EO; archive Terra, HB, Melissa Tucci, Daily Open and Close, Web Contact Form, PTO Requests, New Year Gross Fees Template, and the three Open Fees reports; keep both Office Favorites and Social Media Accounts; Felicia to her Five Star email once she accepts. Cleanup is Elizabeth's.
- 2026-10-08: drafted by the COO from a live read-only sweep and the Dashboards docs; promoted to 00_Resources/ (Brett). Client Report gap left to retire with the attribution job; Gmail Admin kept pending Elizabeth.
- 2026-10-19: Writing rule 8 added (eliminate user error whenever possible; Brett). Team sheet lockdown planned: lock every column but Projected COE, Actual COE, File Status, and Escrow Fees, lock section rows, and trim workspace Admins to Brett and Elizabeth, after Jen and Heather review (AI Workforce > COO task).
