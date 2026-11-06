# Five Star Finance, Cleanup Punch List
From a full-depth crawl of the entire tree. Grouped by priority. IDs included so execution is unambiguous.

---

## A. Fix first, duplication the migration created

**1. `01 Bank Statements` has every account twice (empty vs. real).**
The migration added four empty placeholders; real account folders with 2023–2026 statements already existed.

| Real folder (KEEP) | Has | Empty placeholder (DELETE) |
|---|---|---|
| General Account `1FMcIkB5nw_VpToJj7zE0p0kPzHmDKfz-` | 2023–2026 | CBT-Operating `1Kj9yqdiAuSeED2AwIIxOLYYwz4U_uLQ4` |
| Savings 2274 `1NtR67j82y5lK404bM94gvE4NKTJ81o6C` | 2023–2026 | CBT-Savings-2274 `1_9oGApEprBEYpvRsdgoFTLDRm62gCx18` |
| Savings 0678 `12VmVUlvob2oeaEebBuAAcOxoOHHTaejx` | 2024–2026 | CBT-Savings-0678 `1uyMGPJi-_BL0mnkHllRfY4AaUpAMldNy` |
| Trust Account `1S6zfG3upF_uA-4fawGWZ2p5WFMbozXv3` | 2023–2026 | CBT-Trust `1J81xGCpmv4NQ01JeGRcZ0Ab8gOR6TmJI` |

Action: delete the four empty placeholders (each contains only an empty `2026`). Optionally rename the four real folders to the `CBT-` convention afterward, delete the empties first to avoid a name clash.

---

## B. Duplicate folders to merge (pre-existing)

**2. Two 401k folders.**
- `07 Payroll & Benefits/Five Star 401k` `1W4rOgnl0pD9jQyHv8F9d-iLDwauOKRZT`, older setup/research
- `Five Star Finance Meetings/401K` `1qZVidgtjvm3PrKYF1mzFrcykeIiKbBjG`, current plan admin (13 files: plan doc, contributions, TPA census)
Action: move the Meetings `401K` contents into `07/Five Star 401k` (keep current docs at top, research in a subfolder). One 401k home.

**3. Two audit trees, divergent, merge carefully.**
- `08 Tax/Annual Audit` `1bvUQbJBZPMzwKPISlAIeY9-pAcL1opR2` → 2022(6), 2023(7), 2024(69), 2025(51)
- `Five Star Finance Meetings/Five Star Audits` `1er-uNQyxCWT-UdtmYahdvdt1T6i9rPlf` → 2021(13), 2022(6), 2023(8), 2024(73), 2025(38)
These overlap by year but the file counts differ (2024: 69 vs 73; 2025: 51 vs 38), so they are **not identical copies**, do not blind-delete either. Merge year-by-year into `08 Tax/Annual Audit`, keeping all unique files; the Meetings copy also adds a **2021 Audit** the Tax one lacks. This one needs a human eye per year.

---

## C. Top-level stragglers to file

**4. Real Talk Invoices for Five Star** `1tjO3tL2IRQLzy5ThCKCRcxrFOHQQGkQt` (2019–2026 by year) → into `03 AP - Invoices & Checks` (RTM vendor bills to FSE).

**5. Authorization to Release Financial Info** (doc) `1G1-2Bo1Nf0VUFouOcO33aGfUNCWjqLDT9PylQfx3q9A` → into `11 Corporate & Licenses`.

**6. Landmark Five Star Financials** `1bY39-A-mWQ4K0s5R3GB2WSn3mgJDRMn6` (7 loose compilation PDFs + Trust Accounting 2026) → merge into `05 Financial Statements`: loose PDFs into a `2026` folder, then retire the empty shell. Manual (loose files).

---

## D. Small misfiles / cleanups

**7. Delete** `04 Recs & Registers/FSE Bank Recs and Registers/this can be deleted` `1V_6JFEaogekU3FGiVNksjoiBFuZTgrXz`, literally named that; empty.

**8. PPP Loan Forgiveness PDF** currently loose in `08 Tax` (`PPP Loan Forgiveness - Five Star Escrow - 06-03-2021.pdf`) → move to `09 Loans & Financing/PPP Loan`.

**9. "Real Stars"** folder in `03 AP` `1SEyO4E2BdgcUFcyWdWjaaVs7zj7BQPxv` (1 file), odd for AP. Open and refile or delete.

**10. After #2 and #3**, `Five Star Finance Meetings` should contain only the meeting doc, as intended.

---

## E. Archive (low priority, cold storage)

**11. Bank of the West appears twice in `99 Archive`:** once at `Bank Statements/Bank of the West`, once nested at `Five Star Banking/Bank CDs/Bank of the West/FSE AFS` (47 files). Consolidate under `Bank Statements/Bank of the West` if you want a single BoW home.

**12. Silvergate year folders are oddly nested**, 2016/2017/2019/2020 sit *inside* the "2018" folder. Cosmetic; safe to leave, or flatten so all years are siblings.

---

## Notes on the working structure (no action, just confirmation)

- `03 AP` mixes check-number folders (`Invoices and Checks 7200-7299`), month folders (Jan–Oct 2026), and a `2025` folder. Not redundant, just inconsistent, the SOP/Skill can standardize going forward.
- `06 Commissions` (FSE Partners, Sales Commission Reports, We Revive) is clean.
- `02 Credit Card Statements` (Chase Sapphire, Capital One) is clean, no placeholder duplication.
