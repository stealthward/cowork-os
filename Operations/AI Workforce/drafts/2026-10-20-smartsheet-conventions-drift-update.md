# Staged: smartsheet-conventions.md drift update (2026-10-20)

_Personal Layer staging file. Source: smartsheet-specialist seeded run and COO verification reads, 2026-10-20. Applied to 00_Resources/smartsheet-conventions.md only on Brett's go._

## Edits

1. **What depends on these sheets, Status workflow row:** "File Status changes to Purchase Contract, Closed, or Canceled" becomes "A row is added or changed with File Status Purchase Contract, Closed, or Canceled". The workflows fire on added rows too (Team 5 and Team 9 triggers, read 2026-10-20), so a Hub New Escrow write with Purchase Contract copies to the queue.
2. **Reading the data, new bullet:** "A real file row has an Escrow #. Section rows have none and count as (blank) in aggregates; filter Escrow # not blank before counting blanks. Never count with find_in_sheet (it returned 9 of 40+ Insert rows on JD)."
3. **Known drift 7 (Blank File Status):** "JD 42, Team 9 55" becomes "Real files (Escrow # present), 2026-10-20: JD 0; Team 9 1 (row 403, 15581-VJ, also blank Type, Open Date, fees). The earlier counts were section rows. Team 1 and Team 8 not rechecked." Fix: "Vickie confirms 15581-VJ (Brett routes)."
4. **New Known drift rows (fix for each: no agent write; Brett routes to the team):**

| # | Where | What | Proposed fix |
|---|---|---|---|
| 14 | Team 7 dates | Row 1214, 5982-JD: Open Date 2106-06-13 (COEs 2016-08-01; -JD suffix on Team 7). Row 4771, 13788-MR: Actual COE 4913-10-01, no Open Date | Team corrects both dates; both are excluded from period figures meanwhile |
| 15 | JD rows outside month sections | Rows 309 to 313 (14588, 14662, 14663, 14664, 14892-JD): open Refinance, $650 each, Open Dates 2025-08 to 2025-12, no COE, below DECEMBER 2026. They make the 2026 year row $3,250 more than its months | Team confirms whether they are open and which month they belong in; the COO moves them on Brett's go |
| 16 | JD repeated Escrow # | 14098-JD (rows 38, 336), 14594-JD (187, 328), 14662-JD (172, 310), 15156-JD (251, 322), 15054-JD (257, 324); 15152-BH sits on JD | Team confirms which row is real; no agent delete (rule 6). Same class as 12 |
| 17 | JD Insert rows | MARCH 2025 and APRIL 2025 have no "Insert new files above" row (rows 94 and 103 are blank); row 132 carries Escrow Fees 0.0 | COO labels rows 94 and 103 and clears 132 on Brett's go |
| 18 | Rollover | No 2027 section on JD; the New Year Unit Template is labeled 2026 and has no CANCELED row; NEW OPENS exists on neither | Before Elizabeth's November rollover: relabel the template to 2027 and add CANCELED (Brett's go); Brett decides whether NEW OPENS stays in the standard |

5. **Change log line:** "2026-10-20: Drift 7 corrected (section rows, not files); drift 14 to 18 added; status workflow trigger includes added rows; reading rule for section rows (smartsheet-specialist seeded run)."
