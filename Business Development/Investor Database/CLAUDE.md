# Investor Database

## What This Is

Master registry of San Diego County investor entities, their contacts, and which partners (Five Star Escrow, First American Title, Vertigo Real Estate Ventures, ARV Finance) have a relationship with each. The live surface is the Investor Registry portal: a Google Sheet database plus an Apps Script web app. This folder holds source files, the portal code (portal/), and decision history. Belongs to Business Development.

## Workflow

1. Read MEMORY.md in this folder for status, IDs, links, and decisions.
2. The Google Sheet is the database. Partners edit through the portal; every write lands on the Sheet and is logged on the Activity tab.
3. Data loads (partner exports, flip reports, Zoho or Smartsheet pulls): write directly into the Sheet tabs. No redeploy. Log each new source list in MEMORY.md as a merge log (source rows, kept entity, reason).
4. Portal code changes: edit Code.gs or Index.html in portal/, push to the Apps Script project, deploy a new version. Links never change.
5. Do every step of a load or deployment yourself through the available tools. Brett is only involved for a Google consent click.
6. Record every model or field change in MEMORY.md Key Decisions.

## Rules

- Partners only ever get their portal link. Never share the Sheet, Zoho, or Smartsheet. Data moves to and from Zoho and Smartsheet from our side.
- A Five Star client is one that directs escrows to Five Star. "Client of an investor client" tags in Zoho are not Five Star clients.
- An ARV relationship means ARV was the lender on a file.
- Single-property LLCs are never entities. A contact whose only entity is a single-property LLC is a contact record flagged Company missing.
- Entity names are canonical. Former names and misspellings go in Also Known As, never as separate records.
- Entity family tags related entities sharing principals or ownership. It never merges records.
- Relationship data is per partner and boolean. No attribution or credit language.
- No partner-internal notes (order numbers, credit splits, approvals) and no pricing or financial figures in the registry.
- CA Secretary of State (bizfileonline) lookups run in the built-in browser pane, never in a Chrome profile. The site shows an Imperva "I am human" check on a fresh session; Claude never clicks it. Stop, tell Brett the check is up in the pane, wait for him to click it there, then continue. Imperva remembers the pane afterward, so this is usually once per session. The ~80 queries/day rate limit still applies.
