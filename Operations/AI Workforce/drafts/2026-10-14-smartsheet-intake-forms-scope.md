# Scope: the FSE Hub as the escrow team's front end to Smartsheet

_COO, 2026-10-14. Personal Layer. Asana: "Smartsheet intake: scope forms for new customers and new escrows" (AI Workforce, COO, 1219427071234809). Status: go from Brett 2026-10-14, two phases. Revised the same day: Brett set the goal that the escrow team never works in Smartsheet, or as little as possible, and confirmed that each month block is a parent row._

Sources read 2026-10-14: columns on FSE Team 9 (2609780876437380) and FSE Unit JD (6403198558359428); Team 9 rows and section markers; the Team 9 status workflow; 00_Resources/smartsheet-conventions.md; Dashboards system-reference.md (FSE Hub, deployment settings) and data-dictionary.md; the 2026-10-09 client name merge list.

## Goal

The escrow team opens, finds, and updates files in the FSE Hub. Smartsheet stays the database behind the dashboards, the Gross Fees Report, and the Zoho queue, but the team stops typing into it.

## What the live read showed

| Finding | Why it matters |
|---|---|
| Team sheets are grouped by year and month. Each month is a parent row ("OCTOBER 2026", carrying the month's fee subtotal) with the files and an "Insert new files above" row as its children. "NEW OPENS" and "CANCELED" sections sit apart | The Hub has to add a file as a child of the right month and move it when its month changes. The Smartsheet API supports both (parentId and siblingId placement on add and on update) |
| Directing Customer is a free-text column on every sheet | Nothing at entry stops a new misspelling. That is where the 2,711 bad cells came from |
| Team 9 has Escrow # 15535-VJ on two different files: Greg Robertson (row 383) and Eduardo Ortega (row 394) | Nothing at entry checks for a duplicate number. This is a second case after Team 7's 14361-MR |
| Sales Rep lists differ by sheet. Team 9 restricts entries to its list; JD does not and lacks Team 5 and Team 8 | The Hub needs one shared list, or a value can be refused on one sheet |
| File Status spelling differs: "Listing - Confirmed" (Team 9) vs "Listing- Confirmed" (JD) | The Hub writes each sheet's own spelling |
| The Team 9 status workflow fires when a row is added or changed and File Status becomes Purchase Contract, Closed, or Canceled | A file added or updated through the Hub reaches the Zoho queue the same way a typed one does. Only Team 9's workflow was read |
| The FSE Hub has a view for each team, the Smartsheet token, and the client list with the merge rule. It runs as Brett and is open to the brettward.net domain | The Hub can read and write all five sheets today. It can also tell which signed-in team member made each change |

## What the Hub would do

**1. New escrow** (?page=open, opened from a team's view)
1. Fields: Escrow #, Property Address, Seller/Borrower, Type, Directing Customer, Listing Agent or Loan Officer, Buyer Agent, Buyer Agent Phone #, Sales Rep, Title Company and Title Rep (left off for JD), Open Date (defaults to today), Projected COE, File Status (opening statuses only), Escrow Fees, 1st Escrow, Wholesale?. Lead EO and Actual COE are left off.
2. Directing Customer is a type-ahead on the approved client list. A name that is not on the list goes to the new-customer form. Free text is never accepted.
3. Sales Rep and Title Company are pick lists from one shared list.
4. On submit, the Hub refuses an Escrow # that already exists on any of the five sheets. It then adds the row as a child of the right month, above "Insert new files above", in that sheet's own File Status spelling.

**2. New customer** (?page=client)
1. The Hub runs the dashboards' match rule and shows close names ("Did you mean Big Block Realty?") before saving.
2. It saves to a new Clients tab in the FSE Portal Content sheet, seeded with today's 876 clean names. Both forms and both dashboards read from this one approved list.

**3. Find and update a file** (?page=file)
1. Search by Escrow #, address, seller or borrower, or client. Results come from all five sheets. Edits are limited by the access rule Brett picks.
2. The file opens with these fields editable (Jen Decker and Brett, 2026-10-14): Projected COE (closing moved up or extended), Escrow Fees (sales price change, escrow credits), and Buyer Agent with Buyer Agent Phone #. Closing and canceling stay available as actions (File Status, Actual COE), because without them the team would still go into the sheet. Everything else is shown read-only. On save, only the changed cells are written.
3. When Projected COE or Actual COE moves the file to a different month, the Hub moves the row under that month's parent. A canceled file moves under CANCELED (Brett, 2026-10-14).
4. A File Status change writes the same value a person would type, so the status workflow and the Zoho queue run unchanged.

**4. Change log.** Every write is recorded in a Hub Log tab in FSE Portal Content: who, when, sheet, Escrow #, field, old value, new value. Smartsheet's Modified By will show Brett for every Hub edit because the Hub writes with his token. The log keeps the real name without changing any team sheet column.

## What still happens in Smartsheet

| Item | Who | Later |
|---|---|---|
| Michelle's Zoho queue ("Updated in Zoho" on Escrow Status Change Report) | Michelle | Could become a Hub page in a later phase |
| Annual rollover (new year's month sections, each November) | Elizabeth | Could be scripted later. Until the new year's sections exist, the Hub refuses a file whose month has no section and says why |
| Viewing the sheets | Anyone | Sharing can stay as it is |

## Risks

1. **One token.** Every Hub write runs on Brett's Smartsheet token. If the token is revoked or Brett's license changes, opens and updates stop until it is replaced. The Hub would show a plain error and the team could fall back to typing in Smartsheet.
2. **Two places to edit.** Until the team stops using Smartsheet, someone could edit the same file in both places. The Hub reads the row fresh before every save, which keeps the risk small.
3. **Live sheets.** Writes go to the sheets that feed four dashboards. Each phase is tested on a scratch copy of a team sheet first, and nothing is deployed to production without Brett's go.

## Decisions (Brett, 2026-10-14)

1. Go, in two phases: new escrow and new customer first, then find and update.
2. Edit access: each person edits their own team's files by default; Brett, Elizabeth, Jen Decker, and Heather Bayes edit every team's files. All users can look up every team's files. Each person's team comes from the People tab (TeamKey, Email) the Hub already reads, so no new access tab is needed.
4. A new file goes under its Projected COE month. A canceled file moves under CANCELED.
3. Yes to a Clients tab in FSE Portal Content as the one approved client list.

## Open questions (each comment posted only with Brett's approval of the text)

1. Resolved (Jen Decker, 2026-10-14): the teams change Projected COE and Escrow Fees after opening, and Brett added the buyer field (Buyer Agent and Buyer Agent Phone #, confirmed by Brett). No one uses row comments or attachments on the team sheets.
2. Resolved: the Eduardo Ortega row on Team 9 was mistyped as 15535-VJ; Brett confirmed with Vickie and it now reads 15577-VJ (verified 2026-10-14).
3. Which account Elizabeth signs in to the Hub with: the People tab lists admin@fivestarescrow.com. Confirm in the Phase 1 test.

## Plan on go

| Step | Who | Staged or done |
|---|---|---|
| 1. Put the questions to Jen Decker or Brett | COO | Comment text approved by Brett before posting |
| 2. Seed the Clients tab from the dashboards' client list | COO | Staged: row count and file shown first |
| 3. Phase 1: new escrow and new customer pages in src/fse-hub, test deployment, three test rows on a scratch copy of a team sheet (placement, subtotal, Zoho workflow) | COO (no dashboard-builder worker yet; gap logged) | Done in test |
| 4. Production deploy for Phase 1 | Brett, two clicks | Brett's go |
| 5. Phase 2: find and update, the same test steps, then a production deploy | COO, then Brett | Brett's go |
| 6. Update system-reference.md, data-dictionary.md, smartsheet-conventions.md, and the Hub resource links | COO | Same session as each deploy |

Out of scope: aligning the Sales Rep lists and File Status spellings across sheets (Known drift 4 and 5). The Hub works around both.
