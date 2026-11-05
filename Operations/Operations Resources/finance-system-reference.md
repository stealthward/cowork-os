# Finance System Reference (FSE Finance Dashboard)

_Harvested 2026-08-12 from the Finance Tools claude.ai project. That project was retired 2026-08-19; this document exists so the OS knows the system, its owners, and its design rules. For current build state, check Operations/Dashboards/MEMORY.md._

## What It Is

An automated Google Apps Script finance dashboard for Five Star Escrow: document filing system, folder validation tooling, vendor management, and a matching SOP. Built so Brooke can operate entirely through the dashboard UI with no manual file manipulation and no direct editing of backend sheets. A separate parallel system exists for Real Talk Media (separate team, Drive root, Apps Script project, and rules sheet).

## People

- **Felicia Ward**: Director of Finance. Owns invoices and storage (took over from Brooke in the 2026 migration).
- **Brooke Lenander**: Primary bookkeeper and dashboard user. FSE only; must never see RTM.
- **Molly (Landmark)**: CPA. External document access via the Finance Dashboard.
- Billing@FiveStarEscrow.com converted from a distribution list to a full Google Workspace account (2026).

## Load-Bearing Design Principles

1. No manual asset manipulation. Every supported operation must be doable through the UI. Brett rejects any workflow requiring direct edits to backend sheets or manual file moves.
2. Content-reading over name-matching. Folder validation reads document content (account numbers, dates), not file names.
3. FSE and RTM never merge: separate teams, Drive roots, Apps Script projects, rules sheets. No shared code libraries.
4. Audit live state before proposing changes.
5. The dashboard runs on the /exec URL, so every code change needs a deploy.

## Key Identifiers

- FSE Finance Drive root folder ID: 1B31ALr30hdpYme255GiMuPbSDl8upuLU
- SOP doc: "SOP - Five Star Finance", Doc ID 1C6nchwkLnOsL3MWwTm2EVy6tsIRnWPzHR14wkNdWALs
- Canonical system spec: Finance-System-Reference.md in the Finance Tools project knowledge (naming conventions, account register, folder structure, workflow)
- Bank accounts in system: CBT General-5427, CBT Trust-7355, CBT Savings-2274 (5801542274), CBT Savings-0678 (5802420678), Chase Sapphire-0083, Capital One-1210

## Naming Conventions (summary)

- Universal: date + FSE + EXP + Vendor + Invoice
- First American exception: First-American[account#][invoice#] (two service accounts)
- All other vendors: invoice number only
- Folder 03 covers any real bill or statement from any payee (government, regulatory, tax, legal, utilities), not just vendor expenses
- Mileage reimbursements: YYYY-MM + FSE + EXP + Mileage-[Name], filed to folder 03

## Where Work Happens

All development and maintenance happen in Operations/Dashboards/ (source mirror in src/five-star-finance-dashboard, rules in Dashboards/CLAUDE.md, history in CHANGELOG.md). The Finance Tools claude.ai project was retired 2026-08-19. Update this reference when the system design changes materially.
