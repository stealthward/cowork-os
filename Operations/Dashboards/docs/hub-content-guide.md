# The Hub content guide for Operations

Last updated 2026-09-28. Owner: Elizabeth Eidbo. Questions go to Brett.

## What this covers

The Hub reads its people, team pages, links, and office contact block from one Google Sheet called **FSE Portal Content**. Edit the sheet and the site updates itself within about 10 minutes. No deploy and no code are involved. This guide covers what you can change in that sheet, how each tab works, and the handful of changes that still need Brett.

The Hub: https://script.google.com/a/macros/brettward.net/s/AKfycbxwMCVe12dhORCNIE3A2-nJeJTtDEq3iuybdHL24Nbuj-e-hw0C6_DI8H3eT1znbArm/exec?page=home

FSE Portal Content sheet: https://docs.google.com/spreadsheets/d/1i59Xa138I7evQRt2vygVTv2eLvp1J69_LcwVr3YQwho/edit

## Ground rules

1. Edit values only. Never rename, reorder, or delete the header row or the tabs (People, TeamContent, Links, Contact). The Hub finds data by tab name and column position.
2. Saves happen automatically. Wait up to 10 minutes, then reload the page (Ctrl+Shift+R) to see the change.
3. Blank means hide. An empty URL hides that link. An empty contact value hides that line.
4. If a page looks wrong after an edit, undo the edit (Ctrl+Z, or File > Version history), wait 10 minutes, and check again before trying anything else.

## The tabs at a glance

| **Tab** | **What it drives on The Hub** | **Typical edit** |
|---|---|---|
| People | Team rosters, profile cards, the Directory | New hire, departure, extension change, headshot, fun fact |
| TeamContent | Team page motto, accent color, announcement, team mailbox | Post or clear a team announcement |
| Links | Every link on Home (Staff Resources), Team Resources, and Admin | Changed login page, new vendor, retired tool |
| Contact | Contact & Office Details card and map on Home | Phone, hours, socials, address |
| Clients | The approved client list New Escrow offers for Directing Customer (since 2026-10-19) | Remove a name that is not a client; the team adds new ones from New Escrow (an "Add it" box appears under a name that is not on the list) |
| Agents | The approved list for Listing Agent or Loan Officer (since 2026-10-19) | Remove a retired name; the team adds new ones from New Escrow the same way |
| Agent Merges | Known misspellings of an agent (Spelling, Show as), so a typed misspelling saves the right name | Add a row when a new misspelling shows up |
| Hub Log | Every file the Hub opens or updates and every name added, with who, when, and the old value of each change | Read only. Never edit or delete rows |

## People tab

One row per person per team. Columns, left to right: Group, TeamKey, Name, Role, Ext, Email, Cell, HeadshotUrl, FunFact, SortOrder.

| **Column** | **What it does** | **Rule** |
|---|---|---|
| Group | Directory section header (Management, Support, Team 3, HR / Finance, Property Management) | Spelling makes the section. "Team 3" and "Team 3 " with a trailing space are two sections. |
| TeamKey | Which team page shows this person in the roster | One of `jd` (JD Unit), `team3`, `team5`, `team7`, `team9`. Leave blank for staff who are not on an escrow team. A person on two teams gets two rows. |
| Name, Role | Shown on the roster, profile card, and Directory | First name only appears under the roster photo. |
| Ext, Email, Cell | Profile card and Directory columns | Email and cell become tap-to-email and tap-to-call. Leave a cell blank rather than typing a placeholder. |
| HeadshotUrl | Roster circle and profile photo | Exact format below. Blank shows initials. |
| FunFact | Italic line at the bottom of the profile card | One or two sentences. Optional. |
| SortOrder | Order within the Directory and rosters | Whole numbers. Sections appear in the order of their first person. Leave gaps of 10 so you can insert later. |

### Add a person

1. Insert a row anywhere below the header (right-click a row number > Insert 1 row below).
2. Fill Group, Name, Role, Ext, Email, and Cell. Set TeamKey only for escrow team members.
3. Give SortOrder a number that places them where you want them inside their Group.
4. Add the headshot when you have it (next section). Initials show until then.

### Remove a person

Delete their row (right-click the row number > Delete row). Do not clear the cells and leave the row, because a row with a Name still renders.

### Add or replace a headshot

1. Crop the photo to a square, shoulders up, and upload it to the Square Headshots folder in the Five Star Team shared drive.
Square Headshots folder: https://drive.google.com/drive/folders/1Qm4pk29C4Wy9HMNoq_0gdwJNuGu3sSa4

2. Right-click the file > Share > Copy link. The file ID is the long string between `/d/` and `/view` in that link.
3. Build the URL in this exact form and paste it into HeadshotUrl:

```
https://lh3.googleusercontent.com/d/<fileId>=w400
```

Only this form renders inside The Hub. Drive share links and thumbnail links do not. Keep the folder shared with the JABB group (anyone in the group with the link can view); a photo in a private folder shows as a broken image for staff.

## TeamContent tab

One row per escrow team. Columns: TeamKey, TeamEmail, Motto, Accent, Announcement.

| **Column** | **What it does** | **Rule** |
|---|---|---|
| TeamKey | Matches the team page | Do not change. |
| TeamEmail | Team mailbox link under the roster | Full address. |
| Motto | Appears in quotes next to the page title | Short. Blank hides it. |
| Accent | Color of the announcement card edge and initials avatars | One of `navy`, `gold`, `silver`, `grey`. Anything else falls back to navy. |
| Announcement | Card at the top of the team page | Plain text, line breaks allowed. Clear the cell to remove the card. |

## Links tab

Every link on Home (Staff Resources), Team Resources, and Admin comes from this tab. One row per link. Columns: Page, Section, Group, Label, URL, SortOrder. Rows can sit anywhere in the tab; SortOrder decides the order on the page, and rows with the same SortOrder keep their sheet order.

**Page** is `home`, `resources`, or `admin`, in lowercase. **Section** must match the heading on the page. **Group** is the sub-heading inside a section. Use this table when adding a row:

| **Page** | **Section** | **Group** |
|---|---|---|
| home | Staff Resources | leave blank |
| resources | Resources | leave blank |
| resources | Title Links | the title company name (Chicago Title, Fidelity, First American, Lawyers, Ticor, WFG) |
| resources | Escrow Links | `Escrow Logins`, `Processing`, or `Other`. A new Group name adds a new column. |
| resources | Property Taxes | leave blank |
| admin | Front Desk & Admin | `Column 1`, `Column 2`, or `Column 3` |
| admin | Management | leave blank |

**Title Links is a grid.** Label must be `Rate Calculator`, `CPL`, or `Supplementals`, and Group is the company. A company with a blank URL in one column shows a dash there. To add a title company, add three rows with the company name in Group, one per Label.

### Change a link

1. Find the row (Ctrl+F on the Label text).
2. Paste the new address into URL. Edit Label only if the name on the page should change too.

### Add a link

1. Insert a row and fill Page, Section, and Group from the table above, then Label and URL.
2. Set SortOrder to place it. To put it between two existing links, pick a number between theirs.

### Retire a link

Delete the row. Clearing just the URL also hides it, which is handy when a tool is down temporarily and you expect it back.

### Do not

1. Rename a Section. The whole section disappears from the page until the name matches again.
2. Change the Page value to anything other than `home`, `resources`, or `admin`.
3. Delete every row or the header row. With no usable rows, The Hub falls back to the link list built into the code on cutover day and stops showing your edits.

## Contact tab

Two columns, Key and Value. Change the Value column only.

| **Key** | **Where it shows** |
|---|---|
| address1, address2, address3 | Three address lines on the contact card. Together they also position the map. |
| phone | Phone line, tap-to-call. Type it the way it should read, such as (858) 386-4811. |
| fax | Fax line |
| hours | Office hours line |
| taxId | Tax ID line |
| dbo | DBO License line |
| website | The FiveStarEscrow.com link |
| maps | Reference only; the map draws from the address lines |
| instagram, facebook, linkedin | The three social icons. A blank value removes that icon. |

## What still needs Brett

| **Change** | **Who handles it** |
|---|---|
| Anything on the People, TeamContent, Links, Contact, Clients, Agents, or Agent Merges tabs | You, in the sheet |
| A new escrow team (team page, dashboard view, roster key) | Brett or Claude, in the TEAMS code config |
| Fee calculator rates, standard or wholesale | Brett or Claude, in the CALC and CALCW code config |
| A new page, a new section on a page, the calendars, the Take a Message or Support forms | Brett or Claude, in code |

## Troubleshooting

| **Symptom** | **Likely cause** | **Fix** |
|---|---|---|
| Edit not showing after 10 minutes | Cached page, or the edit is on the wrong tab or column | Reload with Ctrl+Shift+R. Confirm the tab and column. For links, check Page and Section spelling against the table above. |
| One link vanished | URL or Label is blank | Fill both. |
| A whole section vanished | Section name changed, or every row in it lost its URL | Restore the exact Section name. |
| Page shows the original cutover links and none of your edits | Links tab has no usable rows, or the header row was changed | File > Version history and restore the last good version. |
| Photo shows initials or a broken image | HeadshotUrl is not in the lh3 form, or the file is not shared with JABB | Rebuild the URL from the file ID. Check the folder sharing. |
| Person missing from a team page | TeamKey misspelled | Use `jd`, `team3`, `team5`, `team7`, or `team9`. |
| Directory sections out of order or duplicated | SortOrder gaps or a Group spelled two ways | Renumber SortOrder. Make Group spelling identical. |

## How The Hub is built (reference)

One Apps Script project named **FSE Hub** holds two files. Dashboards.gs serves the team dashboards (`?team=`). Portal.gs serves every Hub page (`?page=`). One web address serves all of it.

There are two deployments of the same code: a test deployment (ID ends in `mzVCIQl0`) and the production deployment the team uses (ID ends in `T1znbArm`). Labels on deployments come and go, so the ID tail is the only reliable way to tell them apart. Both serve Version 33 as of 2026-09-28.

Code changes are Brett and Claude only. The path is: edit, save, Deploy > Manage deployments, pencil on the deployment, set Version to New version, confirm the ID tail in the dialog, Deploy. Saving without deploying changes nothing for the team.

Team dashboards, the fee calculator, calendars, and forms do not read the content sheet. Everything in this guide lives in the sheet; everything else lives in code.
