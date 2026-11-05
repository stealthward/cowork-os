# The Hub: Portal Page Inventory

Surveyed 2026-08-28 from the published site (sites.google.com/brettward.net/fivestarportal). Access: brettward.net domain accounts. Site file: `1e0-0GYClYn3m6CdClBVlmuJDLrvglq6b`.

## Pages in navigation

### 1. HOME
The densest page. Sections:
- **Quick Actions**: Take a Message, Request Support, Calculate Escrow Fees (links to the calculators Drive folder), Team Fee Sheets / Team Smartsheets / Team Dashboards (all three link to Team Links & Resources)
- **Start by Role**: role-based link groups
- **Additional Resources**: large external-links library. Categories observed: FSE Client Attribution (Drive), Escrow Training Handbook (Drive), Outlook Web Portal, FD Asana Tasks, Company Call Log (Smartsheet), Banking / FTB Scans (Drive), TrustLink Daily Banking + Recon Reports, Food Orders / Snack Requests (Docs), Unishippers, Rapid Delivery, FDA SOPs / FSE Ops SOPs / Resources (Drive), PM Tenant Portal, PTO Calendars, Vendor Directory (Sheets), Emergency Contacts (Smartsheet), Intermedia Portal, iSolved, Paid Holidays 2026 (Doc), Employee Handbook (Drive), 2026 FSE Photoshoot (Drive), Insurance Portal (Ease), 401k Portal (401go)
- **Additional Resources** is three collapsible groups: Human Resources, Company Calendars, Fee Reports; the link library lives inside them. The Fee Reports group holds the links to the four hidden dashboard pages (Opened/Closed views), below its icon
- **Stay Up to Date**: a button linking to a Google Drive folder (confirmed by Brett 2026-08-28)
- **Upcoming Holidays**: embedded Google Calendar (confirmed by Brett 2026-08-28)
- **Contact & Office Details**: static text plus a Google Maps embed of the office
- Migration complexity: **high** (most content, most link rot risk)

### 2. Take a Message
Single embedded **Smartsheet form** feeding the **Company Call Log** Smartsheet (confirmed by Brett 2026-08-28). Exact form URL: pull from Sites editor at build time. Complexity: **low**.

### 3. Support Request
Single embedded **Asana form** (confirmed visually 2026-08-28: Asana form styling with Terms/Privacy footer; fields include Description of Issue, File Upload, Urgency). Likely feeds the FD Asana Tasks project. Exact form URL: pull from Sites editor at build time. Complexity: **low**.

### 4. Team Links & Resources
Three button columns (Smartsheets, Fee Calculators, Dashboards), five teams each, plus an Escrow, Title & County Links section. Fully documented in the Dashboards project. Complexity: **low, and phase 1** since it becomes config-driven.

### 5. Company Calendars
Four embedded Google Calendars: FSE Main (Signings/Paid Holidays), FSE PTO, RTM Shoots & Shows, RTM PTO. Complexity: **low** (calendar embeds are stable iframes).

### 6. Company Directory
Single embed rendering a branded "FSE Company Directory" with a Management & Key Contacts table (name, extension, email, cell). Embedded Doc or published page; exact source in editor. Complexity: **low**.

### 7. Revenue Dashboard
Single Apps Script iframe embed (the Revenue Dashboard deployment). Complexity: **trivial**, already our code.

## Hidden pages (not in nav, reachable by URL)

All four are single Apps Script dashboard embeds, matching the Opened/Closed dashboard projects. They are reached from the home page's Fee Reports group in Additional Resources (links below the icon), which is why they're hidden from the nav:

| Page | URL slug |
|---|---|
| Opened: Today | /opened-today |
| Opened: Yesterday | /opened-yesterday |
| Opened: Month to Date | /opened-month-to-date |
| Closed: Last Month | /closed-last-month |

**Decision (Brett, 2026-08-28): do not migrate.** These and any embedded Smartsheet views are superseded by the Unit Dashboards and Revenue Dashboard. The new portal's Fee Reports group points at the dashboards.

## Notes

- The Sites editor page tree showed one additional page with a truncated name ("Home - ..."). Verify what it is before cutover.
- Redacted embeds (home page x2, both forms, directory) must be read from the Sites editor during phase 0 before anything is rebuilt.
