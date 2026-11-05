# Team sheet uniformity: one standard for all five team Smartsheets

_COO, 2026-10-16. Personal Layer. Part of Asana "Hub intake Phase 1: new escrow and new customer" (AI Workforce > COO, 1219517386522847). Brett: "we need to have total uniformity for all of the team sheets." Status: staged, nothing changed._

Read 2026-10-16 (Smartsheet connector, read only): columns on all five active sheets (JD Unit 6403198558359428, Team 3 339384860993412, Team 5 8144815540987780, Team 7 307047045588868, Team 9 2609780876437380); value counts for File Status, Sales Rep, Type, Title Company, Lead EO (JD, Team 5, Team 9 all rows with an Escrow #; Team 3 opened since 2025-01-01; Team 7 opened since 2025-07-01); section rows on all five. Workflows were not re-read (last read 2026-10-12, smartsheet-conventions.md).

## What differs today

| # | Item | JD Unit | Team 3 | Team 5 | Team 7 | Team 9 |
|---|---|---|---|---|---|---|
| 1 | Columns | 21: no Title Company, no Title Rep | 23 | 23 | 23, Title Company and Title Rep hidden | 23 |
| 2 | Lead EO type | Text | Pick list (Heather, Breana) | Pick list (Charli) | Pick list (Syd) | Pick list (Vickie) |
| 3 | Type options | 4 | 4 | 4 | 3, no Note Sale (its workflow tests for Note Sale) | 4 |
| 4 | Sales Rep options | 14, no Team 5 or Team 8 | 16 | 16 | 14, no Team 5 or Team 8 | 16 |
| 5 | Sales Rep restricted to list | No | Yes | No | Yes | Yes |
| 6 | File Status spelling | "Listing- Confirmed" | same | same | same | "Listing - Confirmed" (no file uses a Listing status, so no cell changes) |
| 7 | Canceled section label | CANCELLED | CANCELLED | CANCELLED | Cancelled | CANCELED |
| 8 | Month labels | "April 2024", "April 2026" mixed case | not checked before 2026 | "April 2021" | uppercase in 2026 | "April 2022" |
| 9 | Checkbox and date "restrict" flags | 1st Escrow off, Open Date on | all on | Wholesale? off | all on | 1st Escrow off |
| 10 | 2026 month sections | Jan to Dec | Jan to Dec | Sep to Dec | Jan to Dec | Sep to Dec (team started Sep) |

"ReEbroker" is the option spelling on every sheet, but the Show as name Brett chose on 2026-10-12 is "REeBroker" (Team 5 has 102 files typed that way).

## Values outside the lists (history)

| Sheet | Column | Off-list values (count) |
|---|---|---|
| Team 5 | Sales Rep | Jess 268, REeBroker 102, Ashley 15, List It Live 4, Jes 3, List it Live 2, ashley 1, jess 1 |
| Team 5 | Title Company | WFG 11, Ticor Title 5, Orange Coast 1, Old Republic 1 |
| Team 5 | Lead EO | Jessica 391, Ashley 19, Ashely 2, ashley 1 |
| Team 9 | Sales Rep | Jen C. 225, Molly O. 23, Radio 5 |
| Team 9 | Type | HELOC 1, blank 1 |
| Team 9 | Title Company | WFG Title 1, Orange Coast 1, Consumer Title 1; 118 blank |
| Team 3 (2025 on) | Title Company | WFG 9, Consumer Title in six spellings 8, Homelight Title 2, First Integrity 3, 805 Title 1, California Best Title Company 1, Orange Coast 1, n/a 1 |
| Team 3 (2025 on) | Lead EO | Bre 1, "49000.0" 1 |
| Team 7 (Jul 2025 on) | Lead EO | Chali 1 |
| JD | Lead EO | Jd 1 |

File Status and Type history is clean on all five except the Team 9 HELOC row. Older Team 3 and Team 7 history was not counted (too large for one connector read); the Apps Script pull can count it if Brett wants history cleaned.

## Proposed standard

| Element | Standard |
|---|---|
| Columns | The 23 standard columns, same order and type on all five. Add Title Company and Title Rep to JD; unhide them on Team 7 |
| Type | Equity Sale, Short Sale, Note Sale, Refinance; restricted |
| File Status | Refinance, Listing- Confirmed, Listing- NOT Confirmed, Listing- Wait to Open, Listing- NOT FSE (Deselect), Listing- No Response, Purchase Contract, SS Negotiation, SS Approval, Closed, Canceled; restricted. Team 9 options respelled to match (no file values change) |
| Sales Rep | One list on all five (Brett picks the names, decision 1), "REeBroker" spelling; restricted |
| Title Company | One list on all five; restricted (decision 2 on WFG, Consumer Title, Orange Coast, Old Republic, Homelight) |
| Lead EO | Decision 3 |
| Sections | Year row, then month parents labeled "MONTH YYYY" in capitals, each with an "Insert new files above" child, then NEW OPENS and CANCELED |
| Checkbox and date flags | Same on all five |
| New Year Unit Template | Matches the standard before Elizabeth's November rollover, so 2027 sections come out the same everywhere |

## How it would be applied

1. Column and option changes through the Smartsheet API on Brett's go (rule 3 of smartsheet-conventions.md needs Brett and Elizabeth on column changes). No key column is renamed, so the dashboards and the Hub keep working; Hub pick lists read the sheet options live and become identical on their own.
2. Section label fixes (CANCELED, capital month names) are Property Address edits on section rows only, run as a rule 6 bulk edit: row list, three-row test, run log.
3. History cleanup only if Brett chooses it (decision 4). Sales Rep and Title Company cells follow rule 6. File Status and Type are rule 2 columns (they drive the Zoho workflow) and only the one Team 9 HELOC row is affected, so that one is left for the team.
4. Workflow names (Team 5 and Team 9 "Untitled Workflow") and the Team 7 Note Sale check stay with Elizabeth: agents never edit automations (rule 5).
5. Same session: smartsheet-conventions.md (standard columns, Known drift 4, 5, 6 closed), data-dictionary.md, system-reference.md.

Order: uniformity first, then the Hub Phase 1 test, so the test runs on the final lists.

## Decisions (Brett, 2026-10-16)

1. Sales Rep list on all five: Brett W., Breana H., Cassie P., Charli M., Heather B., Jen D., Sydney R., Vickie J., Media. Removed everywhere: Team 3, Team 5, Team 7, Team 8, John C., ReEbroker, Ryan Lipsey.
2. Title Company list: the 18 plus WFG, Consumer Title, Orange Coast, Homelight Title, First Integrity, Old Republic (24).
3. Lead EO: remove the column from all five sheets (reverses the 2026-10-12 keep). No dashboard, Hub page, report, or workflow reads it (searched src/ and docs 2026-10-16).
4. History: from now on only. Old file values stay as typed; off-list values on restricted columns show as flagged in Smartsheet but are kept.

## Final change list (awaiting Brett's go)

| # | Change | Sheets | How |
|---|---|---|---|
| 1 | (Dropped, Brett 2026-10-16: no backup; the Lead EO and 1st Escrow values will never be needed) | n/a | n/a |
| 2 | Delete Lead EO and 1st Escrow (Brett, 2026-10-16; nothing reads either, 1st Escrow left the dashboards 2026-06-25) | All five | Smartsheet API, column delete |
| 3 | Add Title Company (24-name pick list) and Title Rep after Sales Rep | JD | API, column add |
| 4 | Unhide Title Company and Title Rep | Team 7 | API |
| 5 | Type: Equity Sale, Short Sale, Note Sale, Refinance; restricted | All five (Team 7 gains Note Sale) | API |
| 6 | Sales Rep: the 9 names; restricted | All five | API |
| 7 | Title Company: 24 names including "Other" (already on the shared list; Brett confirmed it stays); restricted | All five | API |
| 8 | File Status: the 11 standard options, "Listing- " spelling; restricted | All five (Team 9 respelled; no file values change) | API |
| 9 | Checkbox and date restrict flags on for Wholesale?, Open Date, Projected COE, Actual COE | All five | API |
| 10 | Section labels: canceled section to "CANCELED"; month parents in capitals ("April 2024" to "APRIL 2024") | All five | Rule 6 bulk edit on section rows: row list, three-row test, run log |
| 11 | New Year Unit Template to the same standard | Template | API, before the November rollover |
| 12 | Docs: smartsheet-conventions.md (standard columns 21, Lead EO and 1st Escrow lines removed, Known drift 3, 4, 5, 6 closed), system-reference.md, sop-new-team-setup.md | n/a | Same session |

Not in this change: workflow names and checks (Elizabeth, rule 5); any history cell.
