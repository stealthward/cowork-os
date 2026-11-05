# Data Dictionary

Every metric each dashboard displays, its definition, and its upstream source.
Grounded in the live GAS sources (`gas/*/Code.gs`) as of 2026-08-18. Items that could not
be verified are marked TODO.

## Shared row model (revenue dashboards)

All three revenue dashboards read the same five team Smartsheets
(JD Unit `6403198558359428`, Team 3 `339384860993412`, Team 5 `8144815540987780`,
Team 7 `307047045588868`, Team 9 `2609780876437380`; Teams 5 and 9 added 2026-08-28)
and derive per-file fields from these columns:

| Field | Column | Notes |
|---|---|---|
| account / client | `Directing Customer` | blank → `(none)` / `(No Directing Customer)` |
| fees | `Escrow Fees` | the only fee column on the sheets; `$`/commas stripped; **= gross fees** |
| openDate | `Open Date` | ISO date or '' |
| closeDate / coe | `Actual COE` | ISO date or ''; text typed into old rows is discarded by `validDate`/`parseDate_` |
| projDate | `Projected COE` | ISO date or '' |
| status | `File Status` | picklist |
| escrowNo | `Escrow #` | unique per file across sheets, except a number reused after its earlier file was Canceled (Hub Version 64, 2026-10-26); count a reused number once per non-Canceled file |
| address | `Property Address` | |
| rep | `Sales Rep` | displayed nowhere currently (removed by request) |
| type | `Type` | Equity / Short / Refi / Note etc.; not currently displayed |

Derived flags (the load-bearing definitions):

- **closed** = `Actual COE` holds a valid date. NOT `File Status = "Closed"`, that filter
  was tried and rejected (it dropped Funded/Recorded/blank-status closes, a 64% undercount
  in testing; see decisions 2026-07-03).
- **canceled** = `File Status` equals "Canceled". Per-team dashboard compares **exact case**
  (`status === 'Canceled'`); company and client-stats dashboards compare lowercased
  (`'canceled'`). Functionally equivalent while the picklist value is `Canceled`;
  TODO: unify to case-insensitive if the picklist ever changes.
- **open (in escrow)** = no Actual COE and not canceled. Live snapshot, not windowed.
- Money is displayed in whole dollars, never cents (per Brett, 2026-06-25).

Date windows:
- **MTD** = 1st of current month → today. **thisMonth** = full current calendar month.
- **lastMonth** = full previous calendar month.
- **t12m / Last 12 Months** = same calendar day 12 months back → today (month math, not
  "365 days", chosen so all dashboards reconcile 1:1; see decisions 2026-07-06).
- **YTD** = Jan 1 current year → today. **next7** = today → today+7.
- Timezone: `America/Los_Angeles` (script timezone).

---

## FSE Hub dashboard views (`?team=jd|team3|team5|team7|team9`; GAS project renamed 2026-09-15, was Per Team Revenue Dashboard)

| Metric | Definition | Source |
|---|---|---|
| **[Month] Projected** (KPI) | Closed MTD (fees, by Actual COE) + open non-canceled files with Projected COE in the current month. Sub-line shows the split ("$X closed + $Y to close"). | Team sheet only. Matches the Gross Fees report's rule ("C1"), verified by elimination 2026-06-24. |
| **Opened MTD** (KPI) | Sum of fees (count in sub) of non-canceled files with Open Date in MTD. | Open Date |
| **Closed MTD** (KPI) | Sum of fees of files with Actual COE in MTD. | Actual COE |
| **[LastMonth] Closed** (KPI) | Sum of fees of files with Actual COE in the previous calendar month. | Actual COE |
| **Last 12 Months, Opened** | Fees (count sub) of non-canceled files opened in t12m. | Open Date |
| **Last 12 Months, Closed** | Fees (count sub) of files closed in t12m. | Actual COE |
| **Avg Fee / Closed** | Closed-t12m fees ÷ closed-t12m count. | derived |
| **Avg Days to Close** | Mean of (Actual COE − Open Date) in days across closed-t12m files with both dates; negatives excluded. | derived |
| **Gross Fees by Month** (chart) | Each non-canceled file lands in exactly ONE month: Actual COE month if closed, else Projected COE month if open. Open files with no Projected COE are NOT counted (team rule: an active file must carry a Projected COE in its expected close month). 12 trailing months + next month (forecast). Green = Closed (banked), indigo = Open (projected). | Actual COE / Projected COE |
| **Reports** (since 2026-10-30; replaced Closing, Next 7 Days) | One table, picked by report type and a From to To date range (inclusive), optionally one client. Closing = open, non-canceled files (no Actual COE) by Projected COE. Closed = non-canceled files by Actual COE. Opened = non-canceled files by Open Date (pre-opens have none, so never appear). Canceled files are left out of every report. Client filter matches every spelling of a merged client (Client Merges tab). Sorted by the report's date; footer gives file count and total Escrow Fees to the cent. Opens on Closing, today to today+7. Quick picks (Next 7 days, This month, Last month) sit under From and To, and the one in use is highlighted (since Version 70). | Projected COE / Actual COE / Open Date |
| **Top 10 Clients (12 mo)** | Group by Directing Customer; ranked by closed fees in t12m. Columns: Closed Fees (t12m), Opened (t12m count), In Escrow (live open count), Closed (t12m count). | all fields |
| **Client Lookup** | Typeahead over every client on all five team sheets (attribution index, same rule and name merge as the Client & Revenue Dashboard, other spellings searchable; built with the company pulse and refreshed by portalWarm). This team's figures add up every spelling of the client. Owner (Team, flagged "another team" when not this team), Sales Rep, Last Open; then this team's figures when the client has activity here: Opened (t12m, non-canceled), In Escrow (live), Closed (t12m), Cancelled (canceled files with Open Date in t12m), Closed Fees (12 mo), Avg Fee/Closed. Was "Client Lookup (12 mo)", own team only, until 2026-10-09. | all fields |

## Five Star Company Dashboard ("Five Star Revenue Dashboard")

Aggregates all five team sheets in code ("company = JD + Team 3 + Team 5 + Team 7 +
Team 9" since 2026-08-28; dormant teams, Team 1, Team 8, Unit Terra, Unit HB,
deliberately excluded; reconciles against the Gross Fees summary sheet's active team
columns).

| Metric | Definition | Source |
|---|---|---|
| **Projected Fees** card (Company / one tile per team) | Same rule as team dashboards: banked (Actual COE this month) + open pipeline (Projected COE this month), canceled excluded. Computed from the same records as the chart so tiles and chart always agree. | team sheets |
| **Closed MTD / Opened MTD** (KPIs) | Fees + counts, Actual COE resp. Open Date in current month (opens exclude canceled). | Actual COE / Open Date |
| **Opened Today / Opened Yesterday** (KPIs + tables) | Non-canceled files with Open Date = today / yesterday; table: File, Property, Fees, Team, Client, sorted fees desc. Portal links to the matching fivestarportal pages. | Open Date |
| **Gross Fees by Month** (chart) | Identical bucketing to per-team chart, across all teams; trailing 12 + next month. | Actual/Projected COE |
| **MTD Daily Opens** (chart) | Per-day fee totals + counts of MTD opens. | Open Date |
| **Top 20 Clients** | By Directing Customer, ranked by closed fees in t12m; Opened (t12m), In Escrow (live), Closed (t12m); Team column = the single team on the account, or "Multiple". | all fields |
| **Client Lookup** | Same fields as per-team lookup + Team column. | all fields |

## Client Stats Dashboard ("FSE Client & Revenue Dashboard")

Same three sheets, combined into one company dataset. Curation is deliberately matched
to the company dashboard so the two reconcile to the dollar (proven on WeRevive:
$355,814 / Team 7):

- Revenue basis: **any non-canceled row with a valid Actual COE**. No File Status filter,
  no de-duplication, grouped by the **raw** Directing Customer string.
- Only the attribution lookup (and the table's Team and Sales Rep) merges client names;
  revenue groups by the raw Directing Customer string (header comment corrected 2026-10-12).

| Metric | Definition | Source |
|---|---|---|
| **Gross Escrow Fees** (KPI) | Sum of fees of closed records with Actual COE in the window (Last 12 Months / YTD). | Actual COE, Escrow Fees |
| **Clients** (KPI) | Count of distinct Directing Customer values with closed revenue in window. | derived |
| **Files Closed** (KPI) | Count of closed records in window. | derived |
| **Top Client** (KPI) | #1 client by fees; sub shows its % of window revenue. | derived |
| **Escrow Fees** (table column) | Client's closed fees in window. | derived |
| **% of Revenue** | Client fees ÷ window total. | derived |
| **Team** | The client's attribution team (below): the team of the client's **most recently OPENED** file across every file, not most recent close, so a moved account (e.g. WeRevive JD→Team 7) can't flip back when a straggler old-unit file closes late. Since 2026-10-09 open and canceled files count too. | attribution |
| **Sales Rep** (table column) | Sales Rep on the client's most recently opened file ("Unassigned" when blank). | attribution |
| **Who owns it** (search panel) | Shown while the search box has text: every client on the five sheets, all history, matching the text or any other spelling of the client: Client, Team, Sales Rep, Last Open. Up to 10 rows. Replaced the weekly fse-client-attribution job (2026-10-09). | attribution |
| **Attribution rule** | Every file on the five team sheets, all history, canceled and open included. Team = the sheet holding the client's most recently opened file across all its spellings (Actual COE stands in when Open Date is blank); Sales Rep and Last Open come from that file. Skipped: blank, NA, n/a, Previous Buyer, FSBO (Michael Libutti Prev Seller), file-number values. | Directing Customer, Sales Rep, Open Date, Actual COE | Open Date + sheet |
| **Name merge** | Since 2026-10-12: spellings are one client when they match after lowercasing, "&" = "and", dropping punctuation and spaces, and dropping a trailing Inc/LLC/Corp/Co; or when the **Client Merges** tab of the FSE Portal Content sheet (Spelling, Show as) maps a spelling to a "Show as" name, which is the name displayed. Add a row there to merge a new misspelling; it applies on the next page load (Hub: within 10 minutes). ?debug= shows mergeRows and mergeError. | Client Merges tab | |
| **Client detail / file history** (since 2026-10-30) | Owner line (Team, Sales Rep, Last Open) and, when the client is in the window, its rank badge. Below that is every file for the client on the five sheets, all history and all spellings (Client Merges), filtered in the page. Reports: All files (dated by Open Date, else Actual COE, else Projected COE), Closed (Actual COE, not canceled), Closing (no Actual COE, has Projected COE), Opened (Open Date), Canceled (File Status Canceled, dated by Open Date, else Projected COE; the sheets have no cancel date). Blank From and To mean all history; a dated range leaves out undated files. Team filter. Show canceled is off by default and adds canceled files to the other reports. Summary cards over the listed files (since Version 15; they replaced the window stats and the footer total): Files (with the report, range, and team), Closed fees (Actual COE, not canceled), In escrow (no Actual COE, not canceled; count and fees), Canceled (count and fees not earned, or "hidden" while Show canceled is off). Only the RANK badge reflects the table's window. Columns: report date, Escrow #, Property, Team, Sales Rep, Status, Close Date, Fee (cents). Was the closed files in window only until 2026-10-30. | all fields |
| **Export view (CSV)** | Current filtered/sorted view, with Sales Rep and Last Open columns. | derived |

## FSE Hub intake (writes; `?page=open`, since 2026-10-19)

| Item | Rule | Source |
|---|---|---|
| **Approved clients** | Directing Customer on a new file must match the Clients tab (seeded 2026-10-16 from the attribution index, 871 names after 5 non-clients were removed). Matching ignores case, punctuation, spaces, "&"/"and", trailing Inc/LLC/Corp/Co, and resolves Client Merges spellings; the listed spelling is what is saved | Clients, Client Merges tabs |
| **Approved agents** | Listing Agent or Loan Officer must match the Agents tab (441 names seeded 2026-10-16 from files opened since 2024, spellings checked against Zoho Contacts; FSBO and N/A are entries). Agent Merges (80 rows) maps known misspellings to the listed name. A co-listing is "Agent A / Agent B" | Agents, Agent Merges tabs |
| **New names** | A name not on its list stops the save and shows up to 5 close matches plus an "Add it" checkbox under the field. A ticked name is appended to Clients or Agents (Name, Added by, Added on) only after the file's row is written, and logged as "new client" or "new agent" (one form since Version 47, 2026-10-19; the New Customer and New Agent pages are retired). In test (`&scratch=1`) nothing is appended and the rows read "new client (test)" / "new agent (test)" (Version 57, 2026-10-20) and are written to the Hub Log (test) tab (Version 58) | Clients, Agents, Hub Log tabs |
| **Placement** | A new row goes under the month parent matching its Projected COE ("MONTH YYYY" in Property Address), above that month's "Insert new files above" row, so the month's =SUM(CHILDREN()) subtotal includes it | Team sheet sections |
| **Hub Log** | One row per field written: When, Who (sign-in email), Action, Team, Sheet ID, Row ID, Escrow #, Field, Value, Old value (Old value added for Phase 2 updates). IDs and update values are stored as text | Hub Log tab |
| **Escrow Lookup search** (Phase 2) | Six fields: Escrow #, Property Address, Seller/Borrower, Directing Customer, Listing Agent or Loan Officer, Buyer Agent. A field matches when the typed text is in the value (case, spaces, punctuation ignored); a value picked from a dropdown matches exactly (each name of an "A / B" co-listing counts). Filled fields combine (all must match). Since Version 75 (2026-11-03) the matches show in the Escrow Lookup grid, sorted and filtered by the grid's settings (up to 500 rows); since Version 76 the grid's Team and status boxes narrow the search too, and the count names how many more they hide | `intakeFileIndex` cache of the five team sheets |
| **Pre-opens** (since 2026-10-20) | A file opened before there is an offer. New Escrow's Pre-open box writes no Open Date, Projected COE, File Status, or Escrow Fees, so a pre-open is not an opening in any count or in the Weekly Open Report. It sits as a child of PRE-OPENS (directly above CANCELED). Escrow Lookup's Open it sets those four fields and moves it under its Projected COE month; Remove deletes the row. A pre-open 60+ days old (from Open Date, else the row's created date) is listed on its team page | Intake.gs, Brett 2026-10-20 |
| **Find and update** (`?page=file`, Phase 2) | Editable: Projected COE, Escrow Fees (> 0), Buyer Agent, Buyer Agent Phone #, File Status (open statuses only). Close = File Status Closed + Actual COE (not after today). Cancel = Canceled. A closed file (valid Actual COE) or a canceled file reopens by picking an open status; on a closed file that clears Actual COE (Version 73). Placement after a save: CANCELED if canceled, else the month of Actual COE, else Projected COE; the row moves only when the save changes that month. Actions logged: update, close, cancel, reopen, and a Section row for each move | Team sheets, Hub Log tab |

## FIVE STAR FINANCE DASHBOARD (filing console)

No metrics; its "data dictionary" is the naming convention and routing vocabulary.

**Filename:** `YYYY-MM_[ENTITY]_[TYPE]_[Descriptor]` (`YYYY-MM-DD` where day matters).
ENTITY: `FSE` | `RTM`. No spaces, no `.pdf`. A file only gets a name if a real `YYYY-MM`
month can be read (a fiscal-year range like "2026-2027" yields none → Needs a name).

**Types and descriptor rules** (from `mergeAi`/`vendorToken`/`payPeriod` in Code.gs):

| TYPE | Meaning | Descriptor rule | Filed to (Rules-sheet Depth Pattern) |
|---|---|---|---|
| BANK | Bank statement | Account token from the **closed account set**, matched on last-4 / alias phrases, never the bank name, never invented | `01 Bank Statements/[ACCT]/[YYYY]` + shortcut in 04 month folder |
| CC | Credit-card statement | Account token (closed set). Statement month = cycle **closing** month | `02 Credit Card Statements/[ACCT]/[YYYY]` + shortcut in 04 |
| EXP | Invoice / bill / vendor statement / mileage report, paid or unpaid (rule broadened 2026-08-07) | `Vendor_InvoiceNo` when the document has exactly ONE invoice number; no number (or several) = a statement → vendor + month only, `_2` on collision. **First American exception:** `First-American_<CustomerNo>_<InvoiceNo>` (two accounts: 21219, 22067). Mileage: `Mileage-<Name>` | `03 EXP - Invoices & Statements/[YYYY]/[YYYY-MM]` |
| REC | Reconciliation | `<Account>_Detail` or `_Summary`; **trust recon has no suffix** (one artifact, DFPI compliance record) | non-trust → `04 Recs & Registers/[YYYY]/[YYYY-MM]`; trust (rule `FIXED:Trust`) → `06 Trust Recons/[YYYY]` |
| REG | QuickBooks transaction register | Account token | `04/[YYYY]/[YYYY-MM]` |
| PAY | Payroll report | Pay-period day span read from the document (`01-15`, `16-30`, Feb `16-28`), named by PERIOD COVERED, never check date | `04/[YYYY]/[YYYY-MM]` |
| FIN | Landmark monthly compilation (balance sheet + P&L) |, | `05 Financial Statements/Landmark Financials/[YYYY]` |
| COMM | Commission report (spreadsheets) |, | Depth Pattern `*` → filed BY HAND; dashboard refuses |
| AR / TAX / AUDIT / CORP / CPA / LOAN | In the type vocabulary; rules inactive or hand-filed |, | TODO: confirm current Rules-sheet state per type |

**Account register (closed set, token must match QuickBooks name, Drive folder, and filename):**

| Token | Last 4 | Notes |
|---|---|---|
| CBT-General-5427 | 5427 | Operating; the bank calls it "General Account" |
| CBT-Trust-7355 | 7355 | Escrow trust; never matched on the word "trust" alone |
| CBT-Savings-2274 | 2274 | Savings |
| CBT-Savings-0678 | 0678 | Savings |
| Chase-Sapphire-0083 | 0083 | Credit card |
| Capital-One-1210 | 1210 | Credit card |

Institution name is deliberately excluded from matching (four accounts share "California
Bank & Trust"). Match order: last-4 vs Accounts tab → last-4 in folder name → alias phrase
(most specific wins; ties refuse).

**Classifier doc_types** (Claude prompt) → TYPE mapping: expense_invoice / vendor_statement /
mileage_report → EXP; bank_statement → BANK; credit_card_statement → CC; register → REG;
recon_summary / recon_detail → REC; payroll_report → PAY; financial_statement → FIN;
commission_report → COMM; `other` (quotes, estimates, proposals, engagement letters,
notices) → refused. Definition anchor: "a document stating a specific amount owed to or
by a named payee."

**Month source overrides:** a file sitting in a 03/04 month folder takes the folder's
month over the document's date (Fix one file + spot check, added 2026-08-10). Payroll
month = pay-period start month. Statements = cycle close month.
