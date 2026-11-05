# Decision Log

Significant design/architecture/data decisions mined from the build threads, with the WHY.
Sources: per-team-revenue thread (Jun 24–25), client-revenue-redesign thread (Jul 2–6),
drive-rebuild-finance thread (Jul 7–Aug 10), finance-sop thread (Jul 16).

## Per Team Revenue Dashboard (GAS project renamed to FSE Hub, 2026-09-15)

- **2026-06-24, One GAS project, three teams via `?team=`.** Shared layout is a hard
  requirement; only the sheet ID differs per team. Access gated by Workspace SSO only, team param is a display filter, not a security boundary.
- **2026-06-24, Declarative module engine instead of a fixed layout.** Brett: metrics
  will change over time, "no ceiling on what I can pull." The `MODULES` array is the
  dashboard; add/remove/reorder = config edit, not code change. Rows keyed by column
  TITLE with tolerant lookup so schema drift across the three sheets (21 vs 23 columns)
  is absorbed, not fought.
- **2026-06-24, "Closed" = Actual COE holds a date.** Initially proposed, briefly
  switched to `File Status = Closed` after old canceled rows were found with free text in
  Actual COE, then reverted at Brett's direction: the date fields are locked to date-only
  now; the text was legacy. `validDate()` kept purely as a guard. Open Date stays out of
  close logic entirely.
- **2026-06-24, Projected This Month = Closed MTD + open non-canceled files with
  Projected COE in the current month ("C1").** Found by computing five candidate rules
  against the live sheets (`diagProjected`) and matching to the Gross Fees report figure.
  A brief version that fetched the number from the Gross Fees Report (`3780278582830980`)
  was built and then **rejected by Brett**: the report itself derives from the team sheet,
  so compute it single-source from the team sheet. The residual $7,839 discrepancy turned
  out to be a stale past-dated Projected COE on one open file, user error, fixed by
  process, not code.
- **2026-06-25, Team data rule (process, not code):** every active file must carry a
  Projected COE in the month it's expected to close; if it slips, move the date. Files with
  no Projected COE are excluded from the forecast. This killed any "roll overdue forward"
  logic and keeps the forecast honest (589 stale no-date Team 3 files would otherwise have
  added $19M of junk).
- **2026-06-25, Gross Fees by Month bucketing:** each non-canceled file lands in exactly
  one month, Actual COE month if closed, else Projected COE month. Mirrors the Smartsheet
  monthly roll-up (proven on real rows) while keeping raw dates for per-client slicing.
  Rendered as a stacked bar chart (banked vs projected), 12 trailing months + next month.
- **2026-06-24/25, Modules rejected or removed:** Stale-files worklist (offered twice,
  declined, "stale dates will never be an issue"); By Sales Rep, By Type, New vs Repeat,
  1st-Escrow flag (removed 06-25); Cancellation Rate by Client (added, then removed 06-25).
- **2026-06-25, Aesthetic restraint pass.** Brett asked for "cleaner, more elegant";
  reference = the Projected Fees card on the company dashboard. Rules adopted: uppercase
  small muted labels, semibold (not 800-weight) values, one calm accent green, no neon
  glow, color used sparingly. Dynamic month names ("June Projected", "May Closed")
  instead of "this/last month". Titles are "[Team Name] Dashboard".
- **Whole dollars everywhere, never cents** (2026-06-25).

## Client Stats Dashboard

- **2026-07-02, Replace the quarterly Excel→ChatGPT→Drive workbook entirely** with a
  live dashboard. The six old report tabs are really 2 windows × 1 scope filter × sorts,
  so: window toggle (Last 12 Months | YTD) + scope toggle (Top 20 | All) + sortable
  columns + typeahead search, instead of a 6-item dropdown.
- **2026-07-02, Universe locked to JD Unit + Team 3 + Team 7.** The old 365-day report
  spans 7 sheets, but the dormant ones (Team 1, Team 8, Unit Terra, Unit HB) carry no
  recent revenue and the Gross Fees sheet's Company Total = the three active columns
  (verified: Mar 2025 sums exactly). If a dormant unit revives, add one line to
  `CONFIG.teams`, and note Unit sheets use `Primary Customer` instead of
  `Directing Customer`.
- **2026-07-02, Team attribution follows the most recently OPENED file**, not the most
  recent close. Opening is the assignment signal; a straggler old-unit file closing late
  must not flip a moved account's label (WeRevive: owned by Team 7, old JD files still
  closing). Fees still roll up across units, historical fee credit is NOT re-attributed
  to the new unit (re-crediting would rewrite past per-unit performance).
- **2026-07-02→06, Revenue basis converged to the company dashboard's rule:** any
  non-canceled row with an Actual COE. The stricter `File Status = "Closed"` filter was
  tried and proven wrong (dropped Funded/Recorded/blank-status closes, a 64% undercount
  in the parity test). De-duplication and name normalization were also removed to match
  the company dashboard exactly (grouping by the raw Directing Customer string).
  Reconciliation target: WeRevive t12m = $355,814 / Team 7, matched to the dollar.
- **2026-07-06, Window = exact month math (same day, 12 months back), labeled
  "Last 12 Months"**, not "365 days", so every client figure reconciles 1:1 with the
  company dashboard. YTD stays as a clearly-labeled second toggle.
- **2026-07-06, Fetch full sheet with no pagination params; never trust `totalPages`.**
  Two real truncation bugs: v1's `pageSize=5000` vs Team 7's 5,746 rows; then a paged
  fetch whose loop trusted `totalPages`, which Smartsheet's Get Sheet omits → stopped
  after page 1 and dropped the newest rows (the $92K/JD-Unit WeRevive bug). Fallback
  paging decides by rows returned vs `totalRowCount`.
- **2026-07-06, Build stamp + `?debug=<client>` endpoint.** Added to break the
  "is it the code or the deployment?" loop (classic Apps Script trap: saving doesn't
  change `/exec`; a new version must be published). Visible build stamp and Basis line
  were removed from the header once verified; the invisible debug endpoint stays.
- **2026-07-02, Blank Directing Customer surfaces as `(No Directing Customer)`**
  instead of vanishing into NaN, data hygiene made visible.

## FIVE STAR FINANCE DASHBOARD & Drive rebuild

- **2026-07-07, Build in-house on Claude + Apps Script** rather than hiring a
  consultant/VA. Felicia (Director of Finance) owns the system; Brett wants himself out
  of the loop. Finance tree lives inside the existing permission-based 5 Star Ownership
  Shared Drive, no new Shared Drives.
- **2026-07-07, Reorganize in place, never rebuild.** Folder URLs are tied to permanent
  Drive IDs; moving/renaming preserves them, so the many SOP hyperlinks keep working.
  A link-inventory script (118 occurrences, 13 unique targets) made the break-set known,
  not guessed.
- **2026-07-07, Full-tree crawl before advising.** A shallow "audit" missed misfiled
  folders one level down (401k, audits inside Meetings); lesson institutionalized: crawl
  the whole tree to a Sheet, then advise. Never present a partial pass as an audit.
- **2026-07-08, Naming convention locked:** `YYYY-MM_ENTITY_TYPE_Descriptor`, ISO dates
  always, underscores between fields / hyphens within, as short as possible without
  losing context ("Statement" word dropped; `.pdf` extension dropped, Drive re-adds it
  on download). Rename backfill scoped to **2026 only** (continuity for the CPA); older
  files keep their names.
- **2026-07-08, Rules move from code to the "Finance Filing Rules" Sheet**
  (`1v90dN7akcuirp6E0ynqZhfpMzOsNH7_pNAxN6Rtm3Ds`): one source of truth read live by
  every tool. Folder renumbering done by hand by Brett (loans → 14, "will never be
  touched"; rarely-used folders get high numbers).
- **2026-07-09, Dashboard over watcher.** The upload dashboard can read INSIDE the
  document (Claude API) and puts human confirmation exactly where the risk is; the
  watcher only knew a file by the folder it was dropped in. Brett wanted "fewer moving
  parts" → dashboard is the single filing path; the watcher's hourly trigger was removed
  and the sweep became a Preview/Apply button. Nothing is written without a human click.
- **2026-07-09, `AP` → `EXP`.** Everything in folder 03 was (then) already paid, so
  nothing there is an accounts-payable liability, they're expense records. Type token,
  Rules sheet, spec, and ~30 already-renamed files all updated together. (Scope later
  broadened, see 2026-08-07.)
- **2026-07-09, `_Statement` suffix dropped.** Invoice vs statement of the same paid
  charge is a distinction nobody acts on; collisions get `_1`/`_2` unless the vendor
  provides a stable key (First American account numbers). Statements are kept at all, they're annual-audit evidence.
- **2026-07-09, Settings tab is the only sanctioned way to edit the Rules sheet.**
  Option "just edit the spreadsheet" rejected: the failure mode is the system accepting
  bad input silently (a folder-ID typo files documents into nothing). Guardrails: folder
  picker not IDs, closed type vocabulary, vendor-token collision checks, nothing
  destructive without confirmation, a validate-configuration health check.
- **2026-07-09, No email digests; QC lives in the dashboard.** Brett checks in via the
  QC tab on his own interval.
- **2026-07-09, No in-app email gate.** Access is governed by Google Workspace (the
  Shared Drive controls files; the web-app deployment controls who opens the page).
  An earlier email-allowlist idea was dropped as redundant. (2026-07-23/08-03: Brooke
  gets a workspace account rather than building a login gateway.)
- **2026-07-14, Statements live once; 04 gets shortcuts.** Bank/CC statements file to
  01/02; the accountants' month folders in 04 hold Drive shortcuts, so a record never
  exists twice. Trust is excluded, reconciled in 06 (DFPI compliance), not 04.
  Shortcuts require the Drive advanced service (DriveApp can't create them).
- **2026-07-14/15, Accounts are a CLOSED SET matched from the document.** No dropdown
  ("opens up too many chances for errors"), no invention. The account token is identical
  in three places, QuickBooks account name, Drive folder name, filename, so they can
  never drift; every account carries its last-4 (Brett: future-proofing, cards included).
  QuickBooks accounts renamed to match (Brooke, directive email sent 2026-07-15; the
  operating account is "General Account" per the bank). Institution names excluded from
  matching, four accounts share "California Bank & Trust".
- **2026-07-14, Payroll named by pay period, not check date.** A check dated 7/5 for
  16–30 June belongs to June's books; end-day read from the document so short months are
  automatically right.
- **2026-07-15, Bulk upload + "File all".** Brett rejected per-folder drops: the tool
  must eliminate seeking out folders, and behavior must be identical whoever operates it.
  Accuracy over speed accepted.
- **2026-07-15/16, Statement month = billing-cycle CLOSING month** (a May 15–Jun 13
  Capital One cycle is the June statement). `MIN_YEAR = 2026` floor: reconciliations
  began January 2026 (Landmark onboarding), so 04 gets Jan–Mar 2026 folders built ahead
  of use ("prefer folders created that are not being used yet" over homeless shortcuts)
  but nothing earlier.
- **2026-07-16, Routing reads the Depth Pattern from the Sheet, not hardcoded paths.**
  Every hardcoded route drifted when Drive was reorganized; the sheet-driven ones didn't.
  Pattern tokens: `[YYYY]`, `[YYYY-MM]` (date folders, created on demand), `[ACCT]`
  (closed set, never created), `*` (human files by hand, commissions/WeRevive
  spreadsheets), literal names (must already exist, a missing named folder = a
  misconfigured rule, fail loudly rather than quietly building a second home).
- **2026-07-16, Non-PDFs refused.** A spreadsheet or image would fall back to
  filename-guessing, exactly what mislabels records. Commission/WeRevive folders
  (spreadsheets only) are user-managed.
- **2026-07-16, Rules 09, 10, 11, 12, 14 deactivated; rule 05 path corrected to
  `Landmark Financials/[YYYY]`** (the `[YYYY]`-only pattern would have created a second
  home). Encoded in the idempotent `applyRecommendedConfig()` repair button.
- **2026-07-20, Verification reads the document, not just the name.** The name-only
  folder check couldn't catch a correctly-formatted-but-wrong name (a General-account
  statement filed in the Trust folder). Replaced by the spot check: pick a folder/year,
  re-derive every PDF's name from its contents, propose fixes. Old name-only sweep
  retired entirely. Check window is rolling: current year + previous only.
- **2026-07-20, "Fix one file" (paste a Drive link):** reads the document, renames,
  moves it home, repairs the 04 shortcut, least possible user work for a misfiled file.
- **2026-07-20, Trust recon carries no `_Detail`/`_Summary` suffix**, it's one
  artifact; the suffixes exist to distinguish the two bank-recon documents.
- **2026-07-23, "Replace existing"** for reissued/corrected documents: contents swapped
  in place via Drive API so the file ID, its 04 shortcut, and version history survive
  (rollback, not loss). An earlier preview-time behavior that renamed the existing file
  was removed, **preview never writes**.
- **2026-08-06, Missing-shortcut bug fixed;** `maybeShortcut` reports failure to the
  screen rather than failing quietly ("the person should know the pointer is missing,
  not discover it at month end").
- **2026-08-07, Folder 03 rule broadened: paid AND unpaid bills.** QuickBooks + the
  bank own payment status; the folder just holds documents. Classifier anchored to
  "a document stating a specific amount owed to or by a named payee", quotes,
  estimates, proposals, engagement letters, notices still refuse (keeps fail-loud
  alive). Mileage-report doc type added (`Mileage-<Name>`, anyone can submit).
- **2026-08-10, "Add vendor and use it" bug + duplicate guard.** The pre-filled name
  included the invoice number, baking it into the vendor token (`Real-Talk-Media_526`,
  `DFPI_ES26344`) and doubling on the next file. Fixed: pre-fill company name only; and
  commit now skips byte-identical files already at the destination ("already on file,
  not duplicated") and keep-both-renames genuinely different same-named files, nothing
  slips through silently.
- **2026-08-10, Vendor & account editing moved fully into Settings** (Edit/Remove/Add
  with validation). Brett: "I don't ever wanna have to manipulate an asset that I've got
  no experience with. I want to avoid one-offs at all costs." Nobody edits the Rules
  sheet by hand.
- **2026-08-10, Invoice-number rule settled.** Date-stamping does NOT make names unique
  within a month (two Canons, two Unishippers, four First Americans in one July). Rule:
  include the invoice number when the document has exactly one, it's the unique key and
  the QuickBooks match key; none-or-several = a statement, no number. First American is
  the one documented exception: `First-American_<CustomerNo>_<InvoiceNo>` (two real
  service-line accounts, 21219 / 22067).
- **2026-08-10, Folder month wins for 03/04 checks** (a document in `2026-04` stays
  April even if it reads May), with fallback to the document date for broken folders
  (the `2026-20` incident).
- **2026-08-10, Taught vendors vs auto-cleaned names.** Untaught payees still file
  (name cleaned from the document) but can drift between wordings; recurring vendors get
  taught so the token is pinned. Rule of thumb: teach the regulars, leave one-offs.

## Cross-cutting

- **2026-07-16, RTM gets its own separate filing dashboard** when built. Two entities,
  deliberately siloed; Brooke has nothing to do with RTM.
- **Redeploy discipline** (recurring, first bitten 2026-07-06 and 2026-07-09): pasting +
  saving changes nothing on `/exec`; publish a New version on the EXISTING deployment
  (new deployments change the URL and break Sites embeds). Instructions to Brett must
  include the redeploy step every time.
- **Evergreen tooling** (2026-07-14): nothing labeled with a year; checks default to the
  current year and roll automatically.
- **Everything triggered from the dashboard** (2026-07-09): no manual Apps Script runs,
  no time-based triggers in production.
- **2026-08-28, Revenue universe expanded to five team sheets.** Two new escrow units
  went live, so Team 5 (`8144815540987780`, Lead EO Charli) and Team 9
  (`2609780876437380`, Lead EO Vickie) were added to all three revenue dashboards,
  superseding the 2026-07-02 "universe locked to JD + Team 3 + Team 7" decision. Both
  sheets carry dormant pre-2019 history but zero closings in the trailing 12 months, so
  no existing windowed figure changed; they count from new activity forward. Team 1,
  Team 8, Unit Terra, and Unit HB remain excluded as dormant. In the same change the
  Per Team dashboard's "Canceled" match was unified to trimmed + lowercased, matching
  the other two dashboards.
