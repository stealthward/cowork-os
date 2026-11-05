# SOP: Adding a New Escrow Team

Last updated: 2026-08-28. Written from the Team 5 / Team 9 addition.

> **Interim note:** Step 4 (portal buttons) covers the current Google Sites portal. A portal rebuild is planned (see the Portal Rebuild project). After cutover, Step 4 collapses into Step 2's config edit and Step 3 is retired entirely.

## Prerequisites

Confirm before starting:

| Item | Who provides it |
|---|---|
| Team number (e.g. "Team 11") | Brett |
| Team lead's name (for the People tab TeamKey) | Brett |
| FSE Team Smartsheet exists, in Five Star > Reports workspace, built from the New Year Unit Template | Operations |
| Smartsheet matches the standard in 00_Resources/smartsheet-conventions.md (same 21 columns, order, and restricted lists as the other team sheets) | Operations |

Get the new Smartsheet's permalink (Sheet menu > Properties, or `get_sheet_summary` returns it). You need it in Step 4.

## Step 1: Fee calculator

**Retired 2026-08-28.** The shared formula calculator on the Unit Dashboards web app (`?page=calc`) serves all teams; no per-team Sheet is created and no per-team portal button exists. Nothing to do in this step.

## Step 2: Unit Dashboard

1. In the Unit Dashboards Apps Script project (see `system-reference.md` in this folder for IDs), add the new team to the team config: key `team<n>`, display name, the team's Smartsheet source, and `link` (the Smartsheet permalink from Prerequisites). The `link` drives the team's card on the portal's Team Resources page (Portal.gs).
2. Push and redeploy per the project's standard flow (see `system-reference.md`).
3. Verify: open the deployment URL with `?team=team<n>&format=json` and confirm real rows return.

## Step 3: Gross Fees Report cell links

In the Gross Fees Report (Smartsheet `3780278582830980`):

1. Confirm a `Team <n>` column exists. Add it if not, positioned with the other team columns.
2. Create cell links from the team's source sheet into the report, matching the existing teams' pattern:
   - **Annual roll-up row**: links to the team's full-year booked fees.
   - **Monthly rows**: links to fees by Projected COE month.
3. Reconciliation rule: annual = all booked fees for the year; month rows only capture files with a Projected COE. A small annual-vs-months gap from undated files is normal.
4. **Financial rule applies:** never type fee figures by hand. Links only, or figures Brett approves.

## Step 4: Portal buttons (interim, current Google Sites portal)

On The Hub > Team Links & Resources page (edit at the Sites editor for site `1e0-0GYClYn3m6CdClBVlmuJDLrvglq6b`), add one button to each column, keeping team-number order:

| Column | Button name | Link |
|---|---|---|
| Team Smartsheets | `Team <n> - Smartsheet` | Smartsheet permalink from Prerequisites |
| Team Dashboards | `Team <n> - Dashboard` | Deployment URL + `?team=team<n>` |

(The Team Fee Calculators column was removed 2026-08-28; the shared calculator needs no per-team button.)

Method that works: select an existing button tile, **Duplicate**, then **Edit** the copy and set name + link. Publish requires Brett's approval. After publishing, verify all three links on the live page.

## Step 5: Verification checklist

- [ ] Dashboard JSON returns rows for `?team=team<n>`
- [ ] Both portal buttons (Smartsheet, Dashboard) resolve to the right targets on the **published** page
- [ ] Gross Fees Report annual and monthly links flowing
- [ ] New team's card appears on the portal's Team Resources page (`?page=resources`, generated from TEAMS config)

## Step 6: Closeout

- [ ] Update `system-reference.md` (team roster) and `dashboard-inventory.md`
- [ ] Add a `CHANGELOG.md` entry
- [ ] Update Dashboards `MEMORY.md` if any standing fact changed
