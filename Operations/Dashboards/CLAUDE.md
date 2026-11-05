# Dashboards

## Project Identity

This folder is the canonical home for the Google Apps Script dashboard systems serving Five Star Escrow: the FSE Finance Dashboard (document filing console used daily by Felicia and Brooke) and the three revenue dashboards (Five Star Revenue Dashboard, FSE Client & Revenue Dashboard, and the FSE Hub project, which serves both the Unit Dashboards views and The Hub portal). It belongs to the Operations workstation. Unlike a standard OS project, this folder is evergreen: it has no end state and never archives. It replaced the Dashboards claude.ai satellite project as the maintenance surface on 2026-08-19. External runtime: the deployed Apps Script projects in Google Drive under Shared Drives > Operations > Apps Scripts.

## Workflow

1. Read 00_Resources/apps-script-conventions.md (build standard, ship path, what an agent may touch), then MEMORY.md in this folder for current state and open items.
2. Read docs/system-reference.md before touching any dashboard. For metric questions, read docs/data-dictionary.md. For why-is-it-this-way questions, read docs/decisions.md.
3. Make changes by editing the mirror in src/. Never regenerate a dashboard from scratch in chat.
4. Ship: Claude applies the mirror change to the live editor (SHA-256-verified splice; editor URLs in docs/dashboard-inventory.md), saves, then Deploy > Manage deployments > edit pencil > New version > Deploy, verifying the deployment ID tail in the dialog before deploying. This preserves the /exec URL. Saving without deploying changes nothing for users. Production deploys: see 00_Resources/apps-script-conventions.md, Shipping a change.
5. Log every change in CHANGELOG.md in the same session: date, dashboard, what, why. Update MEMORY.md if state or open items changed.

## Project Rules

- src/ mirrors the LIVE deployed code. If a change ships to Apps Script, the mirror updates in the same session, and vice versa. If mirror and live code are suspected to differ, pull the live source and reconcile before editing.
- Never invent IDs. Sheet IDs, folder IDs, and script IDs live in docs/dashboard-inventory.md and docs/system-reference.md and are verified. Missing ID: ask Brett.
- Confirm the plan before writing code (Brett's standing instruction, 2026-07-15).
- Brett does not hand-edit these files. Claude executes editor and deploy steps end to end and reports what shipped, including the version and which deployment serves it.
- A Hub search or lookup gets one type-ahead field per searchable column, with selectable previews as the person types and no Search button, so a common word narrows to the right column; previews list names that start with the typed text first, then names with a word that starts with it (Brett, 2026-10-19; order 2026-10-30).
- In a Hub view with both search fields and filters (team, status, column filters, date ranges), every one applies together; a search never widens past the filters. When a search also matches rows the filters hide, say how many and which filter to change. (Brett, 2026-11-03)
- archive/ is historical reference only. Never edit it, never deploy from it.
- tools/ holds one-off finance Drive utility scripts (migrations, audits, renames). They are records of completed work, not live systems; check with Brett before rerunning any of them.
- The Finance Filing Rules sheet is edited only through the Finance Dashboard Settings tab, never directly.
