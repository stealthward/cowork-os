# Spending Tracker Maintenance

_Build-and-maintenance reference for `Master Spending Tracker.xlsx`. Read before rebuilding dashboards, importing card statements, or updating the tracker helper scripts. Does not contain current financial results or classifier history; those live in `Personal Finances/MEMORY.md` and the workbook itself._

_See also: `Personal Finances/CLAUDE.md` for the Statement Import workflow and tracker rules | `Personal Finances/MEMORY.md` for current tracker state and classifier history._

---

## Tabs

The workbook has eight tabs, all formula-driven off one ledger:

- **Transactions**: the single master ledger. Every card and every year live here, one row per transaction. Columns: Date, Month, Year, Card, Merchant, Original Amount, Currency, Home-Currency Equivalent, Category, Subcategory, Service, Flag, Notes. Month, Year, and Flag are formulas. Keep it sorted ascending by Date.
- **Snapshot**: headline dashboard for the last full month plus a "This month so far" line.
- **Monthly History**: month-by-month totals.
- **Trends**: rolling multi-month view.
- **Subscriptions**: recurring charges surfaced by keyword.
- **Cards**: per-card totals; the grand total here is the reconciliation check.
- **Category Taxonomy**: the category and subcategory list every transaction maps to.
- **FX Rates**: static conversion rates by currency pair.

You only ever add data by appending rows to **Transactions** and recalculating. The dashboards rebuild themselves from formulas.

---

## Helper scripts (optional)

If you automate imports, two small scripts can help:

- A **build script** that regenerates all eight dashboard tabs from the `Transactions` ledger with Numbers-safe formulas. It is self-contained and idempotent: it reads the ledger straight from the workbook and rewrites the dashboards. It also holds the category taxonomy and the subscription keyword list. When a command-line spreadsheet calculation engine is available, it re-saves the output so formula caches are populated for previews. If no calculation engine is available, it saves a draft and exits with a warning; open and save that draft in Numbers, Excel, or LibreOffice before delivery.
- An **append/parse script** that turns statement text into new ledger rows, reconciles each statement to its printed Purchases total, dedups against the current ledger, and classifies category/subcategory. Adapt its CONFIG block (statement folder, file list, ledger path) per import and re-verify the reconciliation before trusting it.

Both scripts require Python 3 and the `openpyxl` package. If `openpyxl` is missing, ask Cowork to install it in the current environment or a virtual environment before running the scripts; do not override system package protections.

These are conveniences, not requirements. You can maintain the tracker entirely by hand by following the monthly run below.

---

## Snapshot headlines the last full month

Statements close mid-month, so the most recent data month is always partial. After transactions exist, the Snapshot headline (total, vs prior month, vs 6-month average, by-card, top categories, largest transactions) points at the **last full month**, computed as one month before the latest data month (`EDATE(MAX(month), -1)`). In a fresh template with an empty ledger, date, year, and quarter labels stay blank instead of displaying spreadsheet epoch dates or formula errors. The current partial month is shown on its own "This month so far" line and as a flagged column in the trend. YTD stays cumulative (includes the partial month); Avg/month and Annualized use complete months only.

---

## Monthly run (matches Personal Finances CLAUDE.md > Statement Import)

1. Convert statement PDFs to text: `for f in *.pdf; do pdftotext -layout "$f" "$f.txt"; done`
2. Parse each statement (by hand or with the append script): pull date, merchant, original amount, currency, and home-currency amount per line. Review any flagged low-confidence rows.
3. Append the reviewed rows to the `Transactions` tab, kept sorted ascending by Date.
4. Recalculate and save the workbook in a spreadsheet calculation engine before delivery (open and save in Numbers, Excel, or LibreOffice, or rebuild with the build script when LibreOffice/`soffice` is available). Confirm zero formula errors, that the Cards grand total moved by exactly the imported sum, and that Quick Look/preview shows computed values rather than zeros or Dec 1899 dates.
5. Back up the prior version before swapping in the updated file.

---

## Preview-safe delivery

Apple Numbers can recalculate formulas when it opens the file, but preview tools such as macOS Quick Look often read only the cached formula values saved inside the `.xlsx`. A workbook saved by `openpyxl` alone can therefore look correct in Numbers and still preview as zeros or Dec 1899 dates.

Before delivery, make the workbook both:

- **Numbers-safe:** it opens in Apple Numbers with no formula errors.
- **Preview-safe:** it has been recalculated and saved by a spreadsheet calculation engine so previews show computed values.

For the empty starter workbook, also confirm Snapshot, Monthly History, and Trends show no January 1900, December 1899, impossible years, or formula errors before any transactions are imported.

If the helper script cannot find LibreOffice/`soffice`, treat the generated file as a draft. Open it in Numbers, Excel, or LibreOffice, wait for formulas to calculate, save it, then check the preview before calling it final.

---

## Ledger rules

Identify each card by a consistent card label you choose (for example "Primary Card" or "Foreign Card"), and reuse the same label everywhere: the Card column in the ledger, the import file map, and the build script. Last four digits are optional: add them to the label only if you want a way to tell similar cards apart (they are never required). Convert foreign-currency charges at the rate in the FX Rates tab. Exclude card payments and bank fees (foreign-transaction, DCC); keep merchant refunds as negatives. Reconcile parsed purchases to the printed Purchases total to the cent; dedup by (card label, date, home-currency equivalent). Preserve the defined Transactions structure exactly: columns A:M only, with no hidden helper columns added to the ledger.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._

_[2026-07-19] Added empty-ledger guards so starter dashboards keep date, year, and quarter labels blank until the first transaction import._
