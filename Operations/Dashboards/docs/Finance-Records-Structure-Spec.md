# Finance Records Structure & Naming Spec
**Owner:** Felicia Ward (Director of Finance) · **Scope:** Corporate books only (FSE + RTM). Escrow deal/transaction files excluded.
**Location:** Finance tree lives as a top-level folder inside the existing **5 Star Ownership** and **Real Talk Media Ownership** Shared Drives (already permission-based). No new Shared Drives.
**Status:** v1, naming pattern LOCKED. Blueprint governing the Drive cleanup and the filing Skill.

---

## 1. Canonical naming convention (universal, both entities)

**One pattern. No exceptions. If a file doesn't match it, it doesn't get uploaded.**

```
YYYY-MM_[ENTITY]_[TYPE]_[Descriptor]            ← monthly records
YYYY-MM-DD_[ENTITY]_[TYPE]_[Descriptor]         ← dated documents (invoices, checks)
```

**Three hard rules:**
1. **ISO dates always**, `YYYY-MM` or `YYYY-MM-DD`. Never `MM-YY`, never `04-26`, never a written month.
2. **Team-created files are named canonically at the source** (invoices, commission reports, recs). **Bank + CC statements are filed into the correct account folder under their native name and renamed by script**, never hand-renamed (see §6).
3. **Underscores between fields, hyphens inside a field, no spaces, ever.**

**Fixed tokens:**

| Field | Allowed values |
|---|---|
| ENTITY | `FSE`, `RTM` |
| TYPE | `BANK`, `CC`, `AP`, `AR`, `REC`, `REG`, `FIN`, `COMM`, `PAY`, `TAX`, `AUDIT`, `GOV` |

**Examples (these replace every current format):**

| Record | Old naming | New naming |
|---|---|---|
| Operating bank stmt | (bank default) | `2026-01_FSE_BANK_CBT-Operating_Statement.pdf` |
| Chase CC stmt | `Chase 04-26` | `2026-01_FSE_CC_Chase-Sapphire_Statement.pdf` |
| Capital One stmt | `Cap One 04-26` | `2026-01_FSE_CC_CapitalOne_Statement.pdf` |
| Vendor invoice | `MM YYYY Invoices` (folder) | `2026-01-14_FSE_AP_Adobe_INV3391.pdf` |
| Check copy | (none) | `2026-01-14_FSE_AP_Adobe_CHK1042.pdf` |
| Sales commission | `MM-YY Sales Commission Report` | `2026-01_RTM_COMM_Sales.pdf` |
| WeRevive recon | `WeRevive Closed (MM-YY)` | `2026-01_FSE_COMM_WeRevive.pdf` |
| RTM invoice to FSE (a vendor bill) | (varies) | `2026-01-01_FSE_AP_RealTalkMedia_INV0142.pdf` |
| Landmark financials | (varies) | `2026-01_FSE_FIN_Compilation.pdf` |

---

## 2. FSE folder tree, `Five Star Escrow, Finance` (Shared Drive)

Year folders nest **inside** each record type. Account is the primary axis for statements.

```
/00 Reference/                      ← this spec, folder map, links to governing SOPs
/01 Bank Statements/
    /CBT-Operating/2026/
    /CBT-Savings-2274/2026/
    /CBT-Savings-0678/2026/
    /CBT-Trust/2026/
/02 Credit Card Statements/
    /Chase-Sapphire/2026/
    /CapitalOne/2026/
/03 AP - Invoices & Checks/
    /2026/[MM]/                     ← vendor invoices + matching check copies (RTM's monthly invoice to FSE files here as a vendor bill)
/04 Recs & Registers/
    /2026/[MM]/                     ← bank recs, check registers, payroll registers
/05 Financial Statements/
    /2026/                          ← Landmark monthly compilations
/06 Commissions/
    /2026/                          ← escrow (Team 3/7/JD) + partner (WeRevive)
/07 Payroll Reports/
    /2026/
/08 Tax/
    /Property-Tax/
    /Returns/
    /Audit/2026/
/09 Entity & Governance/            ← Statements of Information, shareholder minutes, insurance, licenses
/99 Archive (pre-2026)/
```

## 3. RTM folder tree, `Real Talk Media, Finance` (Shared Drive)

Deliberately lighter, no checks, no AR branch. RTM's monthly invoice to FSE files under **FSE `/03 AP`** (it's an FSE vendor bill), so it doesn't live here. In practice RTM is bank + CC statements plus a little.

```
/00 Reference/
/01 Bank Statements/
    /WellsFargo/2026/
/02 Credit Card Statements/
    /AmazonChase/2026/
/03 Recs/
    /2026/
/04 Commissions/
    /2026/                          ← sales commission reports
/05 Billing - Stripe/
    /2026/                          ← retainer billing recon, credit-tracker exports
/06 Tax & Governance/               ← Statement of Information, returns
/99 Archive (pre-2026)/
```

---

## 4. Migration map (current folder → target)

**Migration method, reorganize in place to preserve links.** The SOPs contain many hyperlinks to these folders. A folder's URL is tied to its permanent Drive ID, and **moving or renaming a folder keeps that ID**, so existing SOP links keep working. Migrate by *moving and renaming the existing folders* into the new hierarchy, never by building a fresh tree and abandoning the originals. Create new folders only where one doesn't exist yet (e.g., per-account bank subfolders under the preserved "Bank Statements" parent). Only links to folders we *eliminate* (merges) break; a link-inventory script extracts every hyperlink in the SOP doc so that break-set is known, not guessed, and those few are relinked.

| Record type | Current folder (Drive ID) | Target |
|---|---|---|
| Vendor invoices + checks | Invoices `1t3S7iWxyZI...` | FSE `/03 AP` |
| 2025 invoices | `1DftV48jE...` (nearly empty) | FSE `/99 Archive` then merge |
| RTM invoices to FSE | Real Talk Invoices for Five Star `1tjO3tL2...` | FSE `/03 AP` (vendor bill) |
| Monthly financials | Landmark Five Star Financials `1bY39-A...` | FSE `/05` |
| Property tax | Unsecured Property Tax `1gXxaEIr...` | FSE `/08 Tax/Property-Tax` |
| Bank statements | Bank Statements `1QYRrHPD...` | FSE `/01` (split by account) |
| Chase CC | Chase CC Statements `1Rfh21to...` | FSE `/02/Chase-Sapphire` |
| Capital One CC | Capital One CC `15YRVvbb...` | FSE `/02/CapitalOne` |
| Recs & registers | FSE Bank Recs and Registers `11HitwRh...` | FSE `/04` |
| Sales commissions | Sales Commission Reports `17wW9La...` | RTM `/04` |
| WeRevive recon | WeRevive Closed `1kZQ8BmJ...` | FSE `/06` |

**Open items to resolve during cleanup (flagged in your own audit notes):**
- **Prior-year invoices physical-only / offsite ("Brooke has them at her house").** Digitize and file to `/99 Archive`. This is an audit exposure, not housekeeping, treat as required.
- **Check filing**, checks now live inside `/03 AP` alongside invoices, named `..._CHK[####]`. No separate checks folder.
- **Escrow commission reports**, need an explicit home; landing them in FSE `/06` (the SOP never specified one).

---

## 5. SOPs whose save/name steps must be edited to match this spec

Editing one convention means touching every save-step it's threaded through. These are the SOPs to update in step 3:

1. **Accounts Payable**, invoice + check save location and naming
2. **DOF Monthly Document Submission**, bank stmt save; `Chase 04-26` / `Cap One 04-26` → canonical
3. **Bookkeeper Monthly Document Submission**, recs/registers save
4. **RTM Monthly Invoicing**, invoice save + naming
5. **RTM Commissions**, `MM-YY Sales Commission Report` → canonical; folder
6. **WeRevive recon**, `(MM-YY)` → canonical; folder
7. **Bank Reconciliation / Credit Card Reconciliation**, where recon reports are saved
8. **Landmark financials storage step**, save to FSE `/05`

Profit First is a live Google Sheet, not a filed document, no change.

---

## 6. Statement rename automation (bank + CC only)

Bank and credit-card statements arrive with source names you don't control (`eStmt(3).pdf`, `Chase_1234_202601.pdf`). **Do not hand-rename** and **do not rely on folder-only organization**, these files leave Drive (Landmark ShareFile, annual audit) and lose all context the moment they're separated from their folder path.

Rule for statements:
- The downloader drops the file (any name) into the correct **account folder**, which already encodes ENTITY + account + TYPE.
- A monthly Apps Script sweeps each account folder, finds anything not yet canonical, and renames it `YYYY-MM_ENTITY_TYPE_Account_Statement` using a folder→token lookup plus the month selected at run time.
- Felicia runs it once after filing. **No PDF-content parsing** (fragile, breaks when bank formats change), the rename is deterministic and folder-driven.

Applies **only** to externally-generated statements. Everything the team creates is named correctly at the source and needs no automation.
