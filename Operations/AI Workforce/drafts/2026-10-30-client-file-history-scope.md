# Scope: complete file history on the client profile (approved 2026-10-30, revised the same day)

Asana: "Client profile: show complete file history" (AI Workforce > COO).

## What it is
Click a client in the FSE Client & Revenue Dashboard to open a file history panel that works like the unit dashboards' Reports section. It covers every file for that client across all five teams and all history.

## Where (Brett, 2026-10-30)
- **FSE Client & Revenue Dashboard only** (Client Stats project). Its detail panel lists only the closed files in the selected window today; that list becomes the file history panel.
- The Unit Dashboards Client Lookup is out of scope.

## Controls (Brett, 2026-10-30: operate like the Reports section)
- **Client:** a type-ahead that switches clients without going back to the table. It merges spellings and lists names starting with the typed text first.
- **Report:** All files, Closed (by Actual COE), Closing (open files by Projected COE), or Opened (by Open Date). All files is the default.
- **From and To:** blank means all history. On All files, the range filters by Open Date, falling back to Actual COE when Open Date is blank.
- **Quick picks:** All history, This month, Last month, This year.
- **Team:** All teams, or one of the five.
- **Show canceled:** a checkbox, off by default. Canceled files are listed with status Canceled, and their fees never count in the total.

## Table
Date (the report's date), Escrow #, Property, Team, Sales Rep, Status, Close Date, Fee. Sorted by date, newest first. The footer gives the file count and total fees; on All files, the total counts closed fees only. The panel opens on All files, all history, all teams, with canceled files hidden.

## Page size
No change to page load. The history loads only when a client is picked: one server call returns that client's rows from a cached all-files index (about 11,000 files, built from the five team sheets). After that, the filters run in the page. With the cache warm, a pick takes about 1 to 2 seconds; when it is cold, about 10 seconds.

## Source of truth
The five team sheets, read with the dashboards' rules: Closed means Actual COE holds a date, and Canceled means File Status Canceled. Client spellings are merged by the Client Merges tab.

## Done when
Picking a client shows every file with all eight columns, and every control works. Closed for the dashboard's selected window ties to the client's Escrow Fees in the table. Brett reviews the live version.

## Plan
1. Client Stats: the all-files index, a clientFiles(name) server call, and the panel with its controls. Mirror, stub test, then a live splice. This project has no test deployment, so it ships straight to production per apps-script-conventions.md and is checked live with a click-through on two clients.
2. Docs: CHANGELOG, data-dictionary, system-reference, and Dashboards MEMORY.

No specialist exists for this work (dashboard-builder is not built), so the COO does it in session.
