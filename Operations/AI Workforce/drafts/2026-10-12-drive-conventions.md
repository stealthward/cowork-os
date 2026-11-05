# Drive conventions

_Shared Core. This file explains how Google Drive is used across Five Star Escrow and Real Talk Media. It is written so an agent can find, read, and file things in Drive without breaking a live system, losing a file, or putting a file where no one will find it. The COO drafted it 2026-10-12 from a live read-only connector sweep of Brett's My Drive, the My Drive/Claude tree, and the Operations shared drive (counts as of that day), root CLAUDE.md (Files), autonomy-boundaries.md, the operations map, apps-script-conventions.md, finance-system-reference.md, Operations/Dashboards/CLAUDE.md, and coo-memory. Staged for Brett's approval; when approved it is promoted to 00_Resources/drive-conventions.md. Brett and Elizabeth are the Workspace admins and first contacts for any Drive question. When Drive and this file disagree, ask, then update this file. Read it before creating, moving, renaming, sharing, reading in bulk, or auditing anything in Drive._

## The rule in one line

Agents read what the job needs, create only in the two places Claude may file (My Drive/Claude and a team project's shared-drive folder), and stage every move, rename, trash, and sharing change. Scripts, dashboards, and the Hub hold files by ID, and the finance tree is filed only by the Finance Dashboard, so a hand move in the wrong place breaks something downstream.

## The account

| Area | Holds | Owner | Agent may |
|---|---|---|---|
| Brett's My Drive, root | 13 folders and about 70 loose files from 2016 to 2026, including the FSE Portal Content sheet and four Google Sites | Brett | Read by name; open a file only when the job names it |
| My Drive/Claude (1FLdrRrqT1TLDoV1MtAjE415vv9eagWSW) | Everything Claude creates outside a team project: Docs, Logs, Apps Script, Cut Sheet Inputs | Brett | Create, update its own files |
| My Drive/.../Cowork OS (1FTgM7W8Wm0kXPw4wr1fYuJJUEzdDJBuq) | The Drive sync copy of the local Cowork OS folder | Brett | Read to get a Drive link for an OS file; never edit (the local file is canonical) |
| My Drive/Personal, Milo, family and legacy folders | Brett's personal files | Brett | Name only; never open unless Brett asks |
| Operations shared drive folder (1KWZDdo_ylhHMG0gxGVss5m52RVP-8urN) | Apps Scripts (the team Apps Script projects), RTM Production Process Review | Brett and Elizabeth | Read; Apps Script rules in apps-script-conventions.md |
| Five Star Finance (1B31ALr30hdpYme255GiMuPbSDl8upuLU), in its own shared drive | The FSE finance records tree | Felicia owns storage; Brooke files; Molly (CPA) reads | Read only when a finance system job needs it; never file, move, or rename by hand |
| RTM finance tree | Separate Drive root for Real Talk Media finance | Felicia | Same as Five Star Finance. FSE and RTM never merge (finance-system-reference.md) |

The connector shows every shared drive's name as "Drive", so the shared-drive list, names, and members could not be read on 2026-10-12 (Known drift 9).

**Never read:** Max Income (any folder or file with that name, including the one inside the Cowork OS sync copy and the Max Income Console script in Claude/Apps Script), apriliapeace material, payroll or compensation files, and anything under _Archive/ or _Outbox/ in the sync copy. Name it only.

## Where a new file goes

| What | Where | Rule |
|---|---|---|
| A deliverable for a team project | That project's shared-drive folder | Root CLAUDE.md Files. Ask which folder if the project has none |
| A document or sheet Claude made for Brett | My Drive/Claude/Docs | Never the My Drive root |
| A script run log, audit, or inventory | My Drive/Claude/Logs | One log sheet per job, appended each run, never one file per run (Known drift 4) |
| A standalone Apps Script project | My Drive/Claude/Apps Script (personal) or Shared Drives > Operations > Apps Scripts (team) | apps-script-conventions.md "New project" |
| A transcript for a cut sheet | My Drive/Claude/Cut Sheet Inputs | factory-cut-sheet pipeline |
| A finance record (invoice, statement, bill) | Only through the FSE Finance Dashboard | Never by hand or by connector |
| Something that fits none of these | A new subfolder under My Drive/Claude | Name it for what it holds; never the root |
| A final Word deliverable | _Outbox/ in the local OS, not Drive | Root CLAUDE.md Files |

## Naming

- New files: `YYYY-MM-DD-descriptive-name`, named for what the file produces and who it serves (root CLAUDE.md Files and Writing).
- Keep a name a client or the team has already received.
- Finance file names follow the Finance Filing Rules sheet, which only the Finance Dashboard edits.
- Log sheets: `<Job> Log` with the run time inside the sheet, not in the file name.
- Update a file in place rather than saving a new copy. Google files keep version history, so "v2", "final", "with answers", and "Copy of" copies are never created (Known drift 5).

## Reading

- **Connector first.** Use the Drive connector for search, metadata, and file reads; open the built-in browser only for what it cannot do (shared-drive list, moves out of a shared drive, sharing dialogs) and say which gap it fills.
- **Search pages are small.** The connector returns about five results per page whatever pageSize asks for. Follow nextPageToken until it is gone before saying a folder holds N files or that a file is missing.
- **List a folder with `parentId = '<id>'`; My Drive root is `parentId = 'root'`.** Shared-drive root IDs start with 0A and return the title "Drive".
- **IDs over names.** Names repeat across the account (four "Finance" folders, two "Operations", two "FSE Client Attribution" sheets). Record and pass file and folder IDs, never a path alone.
- **Moving a file never changes its ID.** Scripts, the Hub, and Asana links keep working after a move inside My Drive or between shared folders. A copy gets a new ID and breaks every link to the original.
- **Link OS files by their Drive copy.** Task descriptions link an OS file by the Drive view URL of its sync copy, found with the connector search (coo-memory 2026-09-28).
- **Never assume a figure.** A count in a report cites the folder ID and the date it was read.

## Writing

1. **Create and update** only in My Drive/Claude, a team project's shared-drive folder Brett named, or a file Claude created. Everything else is staged.
2. **Move, rename, or trash** any existing file only after showing the change and getting Brett's go (root CLAUDE.md Files; autonomy-boundaries.md "Drive structure"). List each file by name, ID, from, and to.
3. **Never permanently delete.** Trash only, on Brett's go, so it can be restored for 30 days. Emptying trash is Brett's.
4. **Never file in the finance trees.** The Finance Dashboard files on a human click; no direct moves, renames, or edits to the Finance Filing Rules sheet (finance-system-reference.md).
5. **Never change sharing.** Adding, removing, or changing a share, link setting, or shared-drive member is staged for Brett. Credentials never go in a Drive file; use a 1Password share link (root CLAUDE.md Email).
6. **Check dependents before a move.** Before staging a move or rename of a sheet or folder, search the Dashboards src mirror, the Hub Links tab, and Asana for its ID or URL, and list what reads it.
7. **The connector cannot move a file out of a shared drive** ("caller does not have permission"). Those moves are done in the built-in browser on Brett's go, with the Drive window visible (coo-memory 2026-09-30).
8. **Log every applied change** in the run log: file name, ID, action, from, to.

## Known drift (no change now; each fix staged for Brett)

| # | Where | What | Proposed fix |
|---|---|---|---|
| 1 | My Drive root | About 70 loose files, 2016 to 2026. Duplicates: two "FSE Client Attribution" sheets (2026-05-27), two "20260826reinvestfoundingpartnerdeck", two copies of 20260217_162941.jpg, four "Brett RTSD Signature.png", two "LiL Sign-IN.xlsx", two "List It Live" exports, a Doc and a JPG both named "Nyla and Santa" | First job for the drive-organizer worker (Brett's World "Purge Google Drive", Hold): a keep, file, or trash list per item for Brett's go |
| 2 | My Drive root | FSE Portal Content (1i59Xa138I7evQRt2vygVTv2eLvp1J69_LcwVr3YQwho), which the Hub reads, sits in the root (apps-script-conventions.md drift 8) | Move into the Operations shared drive folder; ID unchanged, so the Hub keeps reading it; verify the Hub after |
| 3 | My Drive root | Four Google Sites: The Hub (retired 2026-09-23 when the Apps Script Hub replaced it), Portal, Project, and Help Center (all 2026-02-27) | Confirm each is unpublished, then trash on Brett's go |
| 4 | My Drive/Claude/Logs | 43 one-run log sheets from 2026-07-07 to 07-09 (32 "Filing Engine Log" files, one per hourly run, plus Migration, Statement Rename, Normalize, and Cleanup dry and live runs) | Rule above: one log sheet per job from now on. Move the July finance-migration logs into a Logs/2026-07 Finance Migration subfolder; keep them (records of completed work) |
| 5 | My Drive/Claude/Docs | Three versions of "Brand Driver and Page Conversion keep-or-drop review" (2026-09-21), two Plaud Recording Index sheets, and a personal gym plan; a second personal doc (2026-09-25 diet plan) sits in the root | Trash the superseded versions; move personal files to My Drive/Personal |
| 6 | My Drive root and Cowork OS sync copy | Claude-era files outside My Drive/Claude: Investor_Registry_DB (root, 2026-09-02; creator could not be verified), a "claude-ai" folder, and "MD FILES FOR CLAUDE" nested inside itself | Brett confirms which are Claude's, then file under My Drive/Claude or the owning project |
| 7 | Docs vs Drive | The team script folder is named "Apps Scripts" (plural) in Drive; apps-script-conventions.md, Operations/Dashboards/CLAUDE.md, and the operations map say "Apps Script" | Correct the docs to the live name; no Drive change |
| 8 | Operations shared drive folder | Holds only Apps Scripts and one review Doc; Operations deliverables otherwise live in the OS and My Drive/Claude | No change until the shared-drive inventory (item 9) shows where team Operations files are meant to live |
| 9 | Shared drives | Names, purposes, and members could not be read through the connector | One read-only pass in the built-in browser (Shared drives list and each drive's Manage members), recorded in this file's Account table |

## Questions for Brett

1. One log sheet per job from now on (recommended), or keep one file per run?
2. Personal files and folders in My Drive: agents name them only and never open them unless you ask (recommended)?
3. Known drift 1 to 6: hand to the drive-organizer worker as its first job (recommended), or fix the small items (2, 5, 7) now?

## Change log

- 2026-10-12: drafted by the COO from a live read-only connector sweep (My Drive root, My Drive/Claude, the Operations shared drive folder) and the OS docs. Staged for Brett.
