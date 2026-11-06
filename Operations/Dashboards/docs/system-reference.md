# Dashboards System Reference

Brett Ward (brett@brettward.net) · Five Star Escrow / Real Talk Media · San Diego.
This folder is the durable home for the four Google Apps Script dashboard web apps that
were previously built and maintained entirely inside Claude chat threads.

## Standing rules (read first)

1. **Files in this folder are canonical.** The `src/` sources here mirror the LIVE deployed
   Apps Script projects. Never regenerate a dashboard from scratch in chat. Edit these files.
2. **Log every change in `CHANGELOG.md`**, date, dashboard, what changed, why.
3. **Never invent IDs.** Sheet IDs, folder IDs, and script IDs below are verified. If an ID
   is missing it is marked TODO, ask Brett, don't guess.
4. **Confirm the plan before writing code.** Brett's explicit instruction (2026-07-15):
   "Rather than writing the code every time, by default, confirm your plan first."
5. Brett is not a developer and does not hand-edit these files. Claude runs the editor and
   deploy steps end to end per 00_Resources/apps-script-conventions.md (Shipping a change);
   saving is not deploying.

## The four dashboards

### 1. FIVE STAR FINANCE DASHBOARD (filing console, not a metrics dashboard)
- **Purpose:** the finance department's single console for filing documents into the
  Five Star Escrow Finance Drive tree. Drop a PDF → Claude reads the document (not the
  filename) → proposes canonical name + destination → human confirms → filed. Also:
  QC (Needs a name, Check the folders spot-check, Fix one file, System health, Recently
  filed) and Settings (vendors, filing rules, accounts, setup & repair).
- **Audience:** Felicia Ward (Director of Finance), Brooke (bookkeeper, uses a workspace
  account). Brett for admin. Nobody opens Apps Script.
- **GAS project:** `FIVE STAR FINANCE DASHBOARD`, script ID
  `15lOREdjlkdC2zxZ8nCzUD5nWTzlMNTqtwCIywfNvpQeXZOX2ccjgDUt-`
  Editor: https://script.google.com/d/15lOREdjlkdC2zxZ8nCzUD5nWTzlMNTqtwCIywfNvpQeXZOX2ccjgDUt-/edit
  Files: `Code.gs` + `Index.html`. Deployed (displays as "FSE Finance Dashboard"):
  https://script.google.com/a/macros/brettward.net/s/AKfycbyJiJnBJuUcyUyn20ZKsGFqSHFPFqIo8zkSvkTP1F-i0aN4hz35FWRF6_1syKMLyodL1g/exec
- **Data sources / dependencies:**
  - **Finance Filing Rules sheet** (source of truth for routing):
    `1v90dN7akcuirp6E0ynqZhfpMzOsNH7_pNAxN6Rtm3Ds`, tabs Rules / Vendors / Accounts / Read Me.
    The dashboard is the only sanctioned way to edit it (Settings tab writes to it with
    validation). Sheet edits take effect immediately, no deploy needed.
  - **Finance root folder:** `1B31ALr30hdpYme255GiMuPbSDl8upuLU`
    (top-level folder inside the 5 Star Ownership Shared Drive).
  - **Anthropic API**, model `claude-sonnet-4-6`, key in Script Property `ANTHROPIC_API_KEY`.
  - **Drive advanced service v3** must be enabled (Services → Drive API), shortcuts need it.
- **Key behaviors:** reads the document, never the filename; refuses rather than guesses;
  non-PDFs refused; nothing written without an explicit human click; preview never writes;
  statements live once in 01/02 and get a shortcut in 04 (trust excluded, reconciled in 06);
  byte-identical re-uploads are skipped, not duplicated; Replace existing keeps file ID
  (shortcut + version history survive); only year/month folders are auto-created, a missing
  named folder is treated as a misconfigured rule and fails loudly.

### 2. Five Star Company Dashboard (displays as "Five Star Revenue Dashboard")
- **Purpose:** company-wide revenue view, Projected Fees (company + per team), Closed/Opened
  MTD, Opened Today/Yesterday tables, Gross Fees by Month stacked chart, MTD daily opens,
  Top 20 Clients, Client Lookup.
- **Audience:** Brett / leadership; linked from The Hub (FSE Hub project), which replaced the Google Sites
  portal at cutover 2026-09-23.
- **GAS project:** `Five Star Company Dashboard`, script ID
  `1gs662p5b3KSJlnIUMU5Kxcph1dtAKXL-bdA2CyzQv1VnaGFQ9XciXHXP`
  Editor: https://script.google.com/d/1gs662p5b3KSJlnIUMU5Kxcph1dtAKXL-bdA2CyzQv1VnaGFQ9XciXHXP/edit
  Deployed: https://script.google.com/a/macros/brettward.net/s/AKfycbwJXN0A-8eJuoMu95mqx-FNfmRxYqxfqWxu_Hq5JePPzU6RAuH1piT6fBjUwoQ_YH2q0Q/exec
  (`?format=json` returns a raw summary).
- **Data sources:** the five team Smartsheets (below), fetched full-sheet with no
  pagination params. Script Property `SMARTSHEET_TOKEN`.

### 3. Client Stats Dashboard (displays as "FSE Client & Revenue Dashboard")
- **Purpose:** client revenue ranking, replaced the old quarterly Excel-export →
  ChatGPT → Drive workbook workflow. Windows: Last 12 Months / YTD; scope Top 20 / All;
  sortable table (Rank · Directing Customer · Team · Sales Rep · Escrow Fees · % of Revenue),
  search box that doubles as the client attribution lookup ("Who owns it": every client,
  all history, Team · Sales Rep · Last Open; replaced the weekly fse-client-attribution job
  2026-10-09), per-client file history panel (every file, all teams and history, with
  report, date range, quick picks, team, Show canceled, and a client switch; rows load on pick
  through `getClientFiles()` from a CacheService copy; since 2026-10-30), CSV export.
- **Audience:** Brett; shared internally (access: anyone within brettward.net).
- **GAS project:** `Client Stats Dashboard`, script ID
  `1Cs-qWIWx1xhfakyX-ZBrhBr_syUPKCRmXfK7I1bP49q7nAn0bRZGX8rM`
  Editor: https://script.google.com/d/1Cs-qWIWx1xhfakyX-ZBrhBr_syUPKCRmXfK7I1bP49q7nAn0bRZGX8rM/edit
  Deployed (displays as "FSE Client & Revenue Dashboard"):
  https://script.google.com/a/macros/brettward.net/s/AKfycbwQbuSyct_NL-9ge4SMGZSEJ8jZo03JrzHir1HP_Rd-FBYIdOe0tC64p-hH5Ai579i0/exec
  Live build stamp: `BUILD = '2026-10-30 file history'` (Version 16).
- **Data sources:** the five team Smartsheets, `SMARTSHEET_TOKEN`; the Client Merges tab of
  the FSE Portal Content sheet (`CONFIG.contentSheetId`), read on every load for the name
  merge (2026-10-12). The manifest lists oauthScopes explicitly (external_request,
  spreadsheets, container.ui); a new Google service needs its scope added there and Brett's
  Allow on the next editor Run.
- **Debug:** `<exec-url>?debug=<ClientName>` returns JSON straight from the deployed code
  (build, per-sheet row counts, mergeRows, mergeError, that client's owner and other
  spellings, figures). `<exec-url>?files=<ClientName>` returns that client's file history rows.
  `diagRevenue()` in the editor logs per-team / per-month totals for
  reconciling to the Gross Fees report; `diagMerges()` logs the Client Merges row count or
  the read error.

### 4. FSE Hub (GAS project renamed from "Per Team Revenue Dashboard" 2026-09-15)
- **Purpose:** one web app, one view per team via `?team=jd|team3|team5|team7|team9` (default `jd`).
  Since 2026-08-28 it also serves the Portal Rebuild pages from a second file, `Portal.gs`:
  `?page=resources` (Team Resources hub; cards generated from TEAMS, which now carries each
  team's Smartsheet permalink as `link`) and `?page=calc` (shared Escrow Fee Calculator from
  the single-formula `CALC` schedule in Portal.gs). IN PRODUCTION since 2026-08-28 evening:
  the production deployment serves Version 16, so `?page=calc` and `?page=resources` are live
  on the production /exec URL, and the Sites Hub's "Calculate Escrow Fees" button links to
  `?page=calc`. Mirror: `src/fse-hub/` (Dashboards.gs + Portal.gs; renamed 2026-09-15 from
  `src/per-team-revenue-dashboard/` with Code.gs, matching the live file rename).
  Phase 2 pages, IN PRODUCTION since 2026-09-11 (production deployment on Version 19):
  `?page=home`, `?page=team&t=key` (team pages off the FSE Portal Content sheet, script
  property CONTENT_SHEET_ID), `?page=forms&f=take|support`, `?page=calendars&cal=key`,
  `?page=directory`. Never use `c` as a query parameter on /exec: Google reserves it and
  serves a Drive error page before doGet runs.
  Hub intake Phase 1, IN PRODUCTION since 2026-10-19 (production and TEST Version 47, one
  form, see CHANGELOG), third file `Intake.gs`: `?page=open&t=key` (New
  Escrow: adds a row to a team sheet as a child of its Projected COE month, above that
  month's "Insert new files above" row). One form since Version 47: `?page=client` and
  `?page=agent` are retired and open New Escrow. Rules: Directing Customer must be on the
  Clients tab and Listing Agent or Loan Officer on the Agents tab of the FSE Portal Content
  sheet (known misspellings resolve through Client Merges and Agent Merges; a co-listing is
  "Agent A / Agent B"), or be confirmed as new on the form: an unlisted name stops the save
  with its closest matches and an "Add it" checkbox, and ticked names are appended to the
  list after the row is written; Escrow # is refused if it exists on
  any of the five sheets except a number found only on Canceled files, which is reused and logged (Version 64, 2026-10-26); a month with no section is refused; pick lists come live from
  the target sheet's options. Everyone signed in opens and updates files for every team
  (Version 61, 2026-10-21); New Escrow starts on the person's People tab TeamKey team with the others as buttons.
  Every write is logged to the Hub Log tab, because Smartsheet's Modified By shows Brett
  (the token's owner). `&scratch=1` sends writes to `INTAKE.scratch[team]`, empty in
  production; every test log row ends "(test)" and goes to the Hub Log (test) tab, never the Hub Log (Version 58), and a test never appends to Clients or Agents (Version 57, 2026-10-20). The duplicate check reads four columns of all five sheets in one round trip (`intakeSearchGrids`; 1.4 s on 2026-11-03, was 2.5 s through `portalFetchGrids`). Hub intake Phase 2, IN PRODUCTION since 2026-10-19 (production and TEST Version 66): `?page=file` has one type-ahead field per
  column (Escrow #, address, seller or borrower, client, agent or loan officer, buyer agent) over a cached index of every
  file on the five sheets (`intakeFileIndex`; since Version 75, 2026-11-03, cached 6 hours, rebuilt by portalWarm every 10 minutes through `intakeIndexWarm`, and patched one row at a time by each Hub write through `intakeIndexPatch`; the page reads it as JSON text through `intakeFileIndexJson`); `&t=key&r=rowId` opens a file.
  Escrow Lookup grid (Version 75, 2026-11-03, `intakeGridClient`, `intakeGridCss`): every file in a sheet-style table under the search fields, the 17 file-page columns plus Team; opens on the person's team, open files, by Projected COE; team switch, Open / Pre-opens / Closed / Canceled boxes, Projected COE Today / This week / This month and a From / To range (Version 76), heading sort, a filter per column; sort and filters kept per person in the browser (localStorage `hubGrid1`). The search fields, Team, status boxes, and filters apply together; the count says how many more matches the Team or status boxes hide (Version 76). A cell edit saves one field through `intakeSaveFile` (same checks and Hub Log) and follows the file page's state rules; closed or canceled files over 365 days old show search fields only and are edited on the file page. Editable: Property Address (every state, never blank; Version 62), Projected COE, Escrow Fees,
  Buyer Agent, Buyer Agent Phone #, File Status (open statuses); Close sets Closed + Actual COE, Cancel moves the row under
  CANCELED, a canceled file reopens by picking a status. A closed file reopens the same way (Version 73, 2026-11-03): picking an open File Status clears Actual COE and moves the row back under its Projected COE month, logged as "reopen". Since Version 72 (2026-11-02, team sheets view-only) every column but Escrow # is editable: Seller/Borrower, Type, Directing Customer, Listing Agent or Loan Officer, Sales Rep, Title Company, Title Rep, Wholesale? in every state, Open Date except on a pre-open; names go through `intakeNamesCheck` (New Escrow's list rule). The row is re-read before saving (stale edits refused); a month
  change moves the row above the new month's "Insert new files above" row. Every changed field logs to Hub Log with its old value.
  Prefill client info (Version 65, 2026-10-26): with the box ticked, a Directing Customer pick fills Type, Sales Rep, Title Company, and Title Rep from that customer's newest file (an agent pick, while the customer is empty, also fills Directing Customer); only empty fields, never fees (`intakePrefill`). Pre-opens (2026-10-20): New Escrow's Pre-open box adds the row under PRE-OPENS with no Open Date, Projected COE,
  File Status, or fees; Escrow Lookup's Open it sets them and moves the row to its month, Remove deletes it; team pages list
  pre-opens 60+ days old (`intakeStalePreopens`, `intakeStaleCard`). On a pre-open, a blank Open Date, Projected COE, File Status, or Escrow Fees reads "Set it in Open it below" (Version 66, 2026-10-27). Production and TEST Version 76 since 2026-11-03 (see CHANGELOG).
  Declarative module engine, the `MODULES` array IS the dashboard: KPI row (Projected /
  Opened MTD / Closed MTD / last-month Closed with dynamic month names), Last 12 Months
  stat block, Gross Fees by Month stacked SVG chart (+ next-month forecast bar),
  Reports (Closing, Closed, or Opened files by date range and client, with a fee total;
  replaced Closing Next 7 Days 2026-10-30, Version 68), Top 10 Clients, Client Lookup (searches all five teams through the
  attribution index `attrIndex()`, built from the company pulse fetch and cached in 90K
  chunks; since 2026-10-09; client names merged by `clientKey` and the Client Merges tab,
  read by `clientMerges()`, since 2026-10-12).
- **Audience:** the escrow teams (JD Unit, Team 3, Team 5, Team 7, Team 9); teams open
  their view via per-team buttons on the Five Star portal's Team Links & Resources page
  (no per-team embed pages; corrected 2026-08-28).
- **GAS project:** `FSE Hub` (renamed 2026-09-15; was `Per Team Revenue Dashboard`), script ID
  `1TKvw5jf6W7ntp93AF1wopB4MkS5PE_10AsA7CAz12iDLYUaAm5qM7ZUq`
  Editor: https://script.google.com/d/1TKvw5jf6W7ntp93AF1wopB4MkS5PE_10AsA7CAz12iDLYUaAm5qM7ZUq/edit
  Active deployments: PRODUCTION (tail T1znbArm) and TEST (tail mzVCIQl0). The labels show
  as "Untitled" (descriptions clear on deploy) and the most recently updated one is listed
  first, so identify each by its Deployment ID tail, never by name or position.
  Deployed (displays as "Unit Dashboards"):
  https://script.google.com/a/macros/brettward.net/s/AKfycbxwMCVe12dhORCNIE3A2-nJeJTtDEq3iuybdHL24Nbuj-e-hw0C6_DI8H3eT1znbArm/exec
  `&format=json` returns the raw model.
- **Data sources:** one team Smartsheet per view, `SMARTSHEET_TOKEN`.
- **Diagnostics in editor:** `diag` (columns + projected breakdown per team),
  `diagProjected` (candidate projected-rule totals), `diagSummary` (sheet summary fields).

## Shared Smartsheet sources (revenue dashboards)

| Sheet | Smartsheet ID | Notes |
|---|---|---|
| FSE Unit JD ("JD Unit") | `6403198558359428` | 21 cols; ~338 rows (Oct 2026) |
| FSE Team 3 | `339384860993412` | 21 cols; ~5,083 rows, history to 2015 |
| FSE Team 5 | `8144815540987780` | 21 cols; ~493 rows; lead Charli; added to dashboards 2026-08-28, no closings in the 12 months prior so it counts from new activity forward |
| FSE Team 7 | `307047045588868` | 21 cols; ~5,821 rows, history to 2013 |
| FSE Team 9 | `2609780876437380` | 21 cols; ~405 rows; lead Vickie; added to dashboards 2026-08-28, no closings in the 12 months prior so it counts from new activity forward |

All five carry the same 21 columns, order, and restricted lists since 2026-10-16 (standard in 00_Resources/smartsheet-conventions.md; Lead EO and 1st Escrow deleted).

Key columns (identical across the five sheets): `Escrow #`, `Property Address`,
`Directing Customer`, `Sales Rep`, `Type`, `Open Date`, `Actual COE`, `Projected COE`,
`File Status`, `Escrow Fees` (the ONLY fee column, it IS gross fees).

Reference-only (not read by any dashboard code):
- **Gross Fees monthly summary sheet** (reconciliation target; month × team grid):
  https://app.smartsheet.com/sheets/QXJR8vHQrqp7jqMCHQ9wFCRW28MqQH5GMQFVw7G1
  Company Total = JD Unit + Team 3 + Team 5 + Team 7 + Team 9 as of 2026-08-28
  (remaining team columns dormant; Team 5/9 columns may need reactivating in that sheet).
  A related "Gross Fees Report" ID `3780278582830980` was briefly wired into the per-team
  dashboard and deliberately removed (2026-06-24), do not reintroduce the dependency.
- Retired Smartsheet reports from the pre-dashboard workflow: All Escrows 365-day
  (`Rfr5FJvccRGqW4wf7fQ3JM6Q4fph3M2M8qfhVpm1`), All Escrows YTD
  (`786hXFphCrJWX8cq7Rf4Q9wWJvxmh99QxqPqRG71`), span 7 sheets incl. dormant teams;
  superseded by the Client Stats Dashboard.

## Deploy flow (all four dashboards)

_Superseded 2026-10-09 by 00_Resources/apps-script-conventions.md, Shipping a change (Claude ships, SHA-256-verified splice, ID tail check, test first where a test deployment exists). Kept below for reference._

1. Edit the file(s) in this folder (`src/<dashboard>/Code.gs`, plus `Index.html` for finance).
2. Open the project's editor URL → select all in the target file → paste the new content → Save.
3. **Deploy → Manage deployments → pencil (edit) → Version: "New version" → Deploy.**
   This is the step that matters: saving does NOT change what `/exec` serves, and creating a
   brand-new deployment changes the URL and breaks every Sites embed. Always "New version"
   on the existing deployment.
4. Hard-refresh the dashboard (Sites embeds cache, reload the Sites page, not just the iframe).
5. Update the file here and add a CHANGELOG entry.

Script Properties (Project Settings → Script properties), set once per project:
- Finance: `ANTHROPIC_API_KEY`
- Company / Client Stats / Per Team: `SMARTSHEET_TOKEN` (same token in all three)

Manifest for all four: V8 runtime, timezone `America/Los_Angeles`, web app
`executeAs: USER_DEPLOYING`, `access: DOMAIN` (brettward.net Workspace SSO is the only
gate, no in-app keys or email checks). Finance additionally enables Drive advanced
service v3.

## Design rules & conventions observed in the code

- **Config block at the top of every file.** `TEAMS`/`TEAM_SHEETS`/`CONFIG`, a `COL` map of
  column titles (the single place to retitle if a sheet header changes), and constants
  (`RULES_SHEET_ID`, `FINANCE_ROOT`, `MODEL`, `MIN_YEAR`, `STATUS_CANCELED`). Behavior
  changes should be config edits where possible, code edits second, never scattered literals.
- **Module engine pattern (per-team dashboard).** `MODULES` is a declarative array; each
  entry names a `type` with a matching entry in `RENDERERS`. Add a data point = add a line;
  reorder = move a line; remove = delete a line. Shared aggregation primitives
  (`eventRows(event, window)`, `windowBounds`, `sumFees`, `groupBy`), event decides the
  driving date column (opened→Open Date, closed→Actual COE, projected→Projected COE) and
  the eligibility rule; window is `mtd|thisMonth|lastMonth|t12m|next7`.
- **Shared Smartsheet plumbing**, reused verbatim across the revenue dashboards:
  `safeFetchGrid` / `fetchSheet` → `columnMap` → `rowObj` ({v,d} cells keyed by column
  title), tolerant `lookup` (exact → case-insensitive → contains), `num`, `validDate`.
  Fetch full sheet with NO pagination params; if paging is ever needed, decide by row count
  vs `totalRowCount`, never by `totalPages` (Smartsheet omits it; it silently truncated
  Team 7 once).
- **Styling:** server-rendered HTML strings + one `css()` block per project. Dark default
  with light toggle persisted in `localStorage` (`briefTheme` / `fseTheme`). CSS custom
  properties for theming; shared classes `.wrap .card .kpi .shead .pill .money .hint`.
  Restraint over weight: uppercase small muted labels, semibold (700) values, one calm
  accent green (`--money`/`--accent`), color used sparingly. Star ★ + title in header,
  Refresh button, footer "Live from Smartsheet · N files · updated …". Charts are inline
  SVG stacked bars: green = Closed (banked), indigo = Open (projected), ● marks current
  month, last bar = next month forecast. Whole dollars everywhere, never cents.
- **Fail visibly, never guess.** The finance dashboard refuses what it cannot read; missing
  config surfaces as an on-screen error; extraction retries on 429/529/5xx with backoff.
- **Preview/Apply everywhere destructive** (sweeps, organize04, refile): `apply=false`
  writes nothing; files are trashed, never deleted.
- **Evergreen, no hardcoded years.** Anything with a year in it computes from today
  (spot-check window = current year + previous, floored at `MIN_YEAR = 2026`).
- **One thread/project = one surface.** Each dashboard is its own standalone GAS project.
  RTM will get its own separate filing dashboard when built (deliberately siloed from FSE).

## Finance naming convention (locked)

`YYYY-MM_[FSE|RTM]_[TYPE]_[Descriptor]` (day-level `YYYY-MM-DD` for dated docs).
Underscores between fields, hyphens inside a field, no spaces, no `.pdf` extension.
Types (closed vocabulary in code): `BANK CC EXP AR REC REG FIN COMM PAY TAX AUDIT CORP CPA LOAN`.
See `docs/data-dictionary.md` for descriptor rules per type and the account register
(closed set: CBT-General-5427, CBT-Trust-7355, CBT-Savings-2274, CBT-Savings-0678,
Chase-Sapphire-0083, Capital-One-1210, same token in QuickBooks, the Drive folder, and
the filename).

## Related assets (not in this folder)

- SOP doc "SOP - Five Star Finance": Google Doc `1C6nchwkLnOsL3MWwTm2EVy6tsIRnWPzHR14wkNdWALs`
  (contains the dashboard user guide + naming-conventions tab).
- Finance-Records-Structure-Spec.md and Dashboard-Guide-for-SOP.md, copies in
  `../recovered/drive-rebuild-finance/` (spec's `AP`/`GOV` tokens are superseded by `EXP`
  and the current TYPES list).
- The Five Star Daily Brief (separate GAS project, not part of this migration): TODO, pull its source into this folder if/when it's next touched.


## Operational Rules (merged 2026-08-19 from dashboards-system-reference.md, harvested 2026-08-12)

- Revenue dashboards are gated by brettward.net Workspace SSO and linked from The Hub (the Google Sites portal was retired at cutover 2026-09-23).
- Redeploy without breaking the /exec URLs The Hub and bookmarks use: Manage deployments > edit pencil > New version > Deploy. This preserves the /exec URL.
- Column parsing is title-keyed, never index-based (Team 3 and Team 7 carry two extra columns).
- The hash in a Smartsheet URL is never the numeric API ID; get sheet IDs from File > Properties in Smartsheet.
- Full-sheet pulls via Apps Script are authoritative for totals; the Smartsheet MCP connector is for schema discovery and spot checks only.
- Pull from team sheets directly, never month-scoped reports (prior-month bleed bug, fixed July 2026).
- Team attribution uses the most recently opened file's sheet. Company Total always equals the sum of the team sheets in config (JD Unit + Team 3 + Team 5 + Team 7 + Team 9 as of 2026-08-28).
- Revenue rule: a file counts as closed revenue when it has an Actual COE date and is not Canceled. No File Status filter, no deduplication, raw Directing Customer grouping.
- Projected fees: banked (Actual COE this month) + open pipeline (Projected COE in current month). Blank or slipped Projected COE dates are excluded.
- Smartsheet API token lives in script property SMARTSHEET_TOKEN (the harvested reference said SMARTSHEETTOKEN; code ground truth has the underscore).
- BW Daily Brief (personal Calendar + Asana brief) is a separate Apps Script project, not part of the dashboard system; its file lives in Shared Drives > Operations > Apps Scripts.
