# Apps Script conventions

_Shared Core. This file explains how Google Apps Script is built, shipped, and run at Five Star Escrow. It is written so an agent can change a live script without breaking a URL the team uses, losing a secret, or shipping code that differs from the mirror. The COO drafted it 2026-10-09 from the live mirrors in Operations/Dashboards/src (manifests and code read the same day), Operations/Dashboards/CLAUDE.md, MEMORY.md, CHANGELOG.md, and docs (system-reference.md, dashboard-inventory.md, decisions.md), Operations/Portal Rebuild/MEMORY.md, the operations map, and the systems registry. Approved by Brett and promoted to 00_Resources/ 2026-10-09. When a live script and this file disagree, ask, then update this file. Read it before creating, changing, deploying, running, or auditing any Apps Script project._

## The rule in one line

Edit the mirror, never the live editor first; ship only on Brett's go by New version on the existing deployment, verified by deployment ID tail; log it in CHANGELOG.md the same session. Saving is not deploying, and a new deployment breaks every link the team has.

## The projects

All team scripts live in Shared Drives > Operations > Apps Scripts. Moving a file there does not change its script ID, deployments, or /exec URL. The script.google.com home page shows zero projects because it does not index shared drives; open projects from the editor URLs in Operations/Dashboards/docs/dashboard-inventory.md.

| Project (editor title) | Displays as | Mirror | Users | Deployments |
|---|---|---|---|---|
| FIVE STAR FINANCE DASHBOARD | FSE Finance Dashboard | src/five-star-finance-dashboard (Code.gs, Index.html) | Felicia, Brooke daily; Molly reads | One (production); a test deployment is added the next time it is touched (Brett, 2026-10-09) |
| Five Star Company Dashboard | Five Star Revenue Dashboard | src/five-star-company-dashboard | Brett, leadership | One (production) |
| Client Stats Dashboard | FSE Client & Revenue Dashboard | src/client-stats-dashboard | Brett, internal domain | One (production) |
| FSE Hub | The Hub and Unit Dashboards | src/fse-hub (Dashboards.gs, Portal.gs) | All Five Star staff | Production ...T1znbArm and test ...mzVCIQl0 |
| BW Daily Brief | Daily Brief | Not mirrored (mirror when next touched) | Brett | One; URL carries an access key, never recorded |
| Finance utility scripts | n/a | tools/ (11 files) | Brett | None. Records of completed one-off work |

IDs, /exec URLs, and sheet and folder IDs live in dashboard-inventory.md and system-reference.md. Never invent one; a missing ID is asked for.

## Standard build

Every web app project matches this unless a row above says otherwise.

| Setting | Value |
|---|---|
| Runtime | V8 |
| Time zone | America/Los_Angeles |
| Web app | executeAs USER_DEPLOYING, access DOMAIN. brettward.net Workspace sign-in is the only gate: no in-app keys or email checks on team apps |
| Logging | exceptionLogging STACKDRIVER |
| Advanced services | Only what the code needs (Finance: Drive v3) |
| Secrets | Script Properties only, never in code, the mirror, a log, or chat. Current names: SMARTSHEET_TOKEN (Revenue, Client Stats, Hub; same token), ANTHROPIC_API_KEY (Finance), CONTENT_SHEET_ID (Hub). The name has the underscore |
| One surface per project | Each dashboard is its own project. RTM gets its own filing dashboard when built, siloed from FSE |

## Writing code

- **Config at the top.** Team lists, the COL map of column titles, IDs, model, and constants sit in one block. A behavior change is a config edit first, a code edit second, never a scattered literal.
- **Match columns by title, never by position.** Retitling a sheet header is a one-line COL edit.
- **Reuse the shared Smartsheet plumbing** (safeFetchGrid, fetchSheet, columnMap, rowObj, lookup, num, validDate) verbatim. Fetch the full sheet with no paging parameters; if paging is ever needed, decide by rows returned versus totalRowCount, never totalPages. Data rules (closed, canceled, gross fees, active teams) come from smartsheet-conventions.md and data-dictionary.md, not from memory.
- **Fail visibly, never guess.** Missing config shows an on-screen error. The Finance Dashboard refuses what it cannot read. External calls retry on 429, 529, and 5xx with backoff.
- **Destructive work has Preview and Apply.** apply=false writes nothing. Files are trashed (setTrashed), never deleted. Nothing is written without a human click.
- **Evergreen.** No hardcoded years; compute from today.
- **Edits through the system, not around it.** The Finance Filing Rules sheet changes only through the Finance Dashboard Settings tab. The FSE Portal Content sheet is edited by the COO when a system change needs it; the tabs exist so Elizabeth can make a change if she needs to, not as a gate (Brett, 2026-10-09). Code reads it through the cache and keeps constants as the fallback.
- **No framing.** Do not set XFrameOptionsMode ALLOWALL on a new project. It was there only for the Google Sites embeds, retired 2026-09-23; it comes off each existing project the next time that project ships (Brett, 2026-10-09).
- **Never use `c` as a query parameter on /exec.** Google reserves it and serves a Drive error page before doGet runs.
- **Style follows the house look:** server-rendered HTML, one css() block, dark default with a light toggle, whole dollars, one calm accent green. The Hub uses the FSE brand kit (navy #031356, images as data URIs because external images do not load in the sandbox).
- **Streamlined by default.** Fewest clicks; show only what someone acts on; every alert says what is wrong, the fix, and how it clears (COO Definition of good 6 and 7).

## Shipping a change

1. **Read first:** Dashboards MEMORY.md, system-reference.md, and the mirror. If mirror and live might differ, pull the live source and reconcile before editing.
2. **Plan and stage.** The plan goes to Brett before any code (his standing instruction, 2026-07-15). The change is staged; nothing ships without his go (autonomy-boundaries.md).
3. **Edit the mirror in src/.** Never regenerate a project from scratch in chat.
4. **Apply to the live editor** by a SHA-256-verified splice: confirm the target file in the DOM, replace its content, confirm the live hash equals the mirror hash, Save.
5. **Deploy:** Try the deploy in any session. Auto mode has blocked the Deploy menu (2026-10-09, 2026-10-20) and allowed it (2026-10-21, test and production); when it is blocked, Brett makes the two clicks or the work moves to a default-mode session. Deploy > Manage deployments > pencil on the existing deployment > Version: New version > Deploy. Verify the deployment ID tail in the dialog before clicking Deploy. Never create a new deployment for a live app, and never type a deployment description (it clears on every deploy; retyping it nearly overwrote Dashboards.gs twice).
6. **Projects with a test deployment** (the Hub: test ...mzVCIQl0, production ...T1znbArm; the Finance Dashboard once its test deployment exists): ship to test first, verify there, then bump production on Brett's go. Revenue and Client Stats ship straight to production and are checked live with ?format=json or ?debug= (Brett, 2026-10-09).
7. **Verify live:** load the /exec URL (or ?format=json, ?debug=) and check the change and one unchanged view. Report the version number and which deployment serves it. Reload the editor before reading a deployment's version in Manage deployments; the dialog can show the old version until a reload (2026-10-26).
8. **Document the same session:** CHANGELOG.md (date, project, what, why), MEMORY.md if state changed, the system docs if behavior changed, the registry and operations map if a system was added or retired.

Brett does not hand-edit these files. Claude runs the editor and deploy steps end to end in the built-in browser, signed in as brett@brettward.net; BW Office Chrome only when the built-in browser cannot do the step. On Brett's go, Claude makes the production deploy itself (Version to New version, then Deploy, after checking the deployment ID tail). Only when the session's auto-mode check blocks it does Brett make those two clicks. Claude then verifies the new version live, because a deploy without New version silently redeploys the old code.

## Triggers, properties, and consent

- A new trigger, a new OAuth scope, or a new advanced service needs Brett's consent click, so it is staged and named in the plan.
- Adding a Google service to a script: list every scope in appsscript.json `oauthScopes`. With the list left implicit, the editor never prompts for the new scope and the call fails silently. SpreadsheetApp.openById needs the full `spreadsheets` scope (readonly fails). A fail-soft read records its error where `?debug=` shows it. In Manage deployments, name a deployment by its ID tail, never its position or label (the latest-updated is listed first; labels read "Untitled"). (2026-10-12)
- Live trigger today: portalWarm, every 10 minutes, on the FSE Hub (refreshes the content caches).
- Never change or delete a Script Property value. Adding a new property is staged; the value is set by Brett or from a 1Password share, never pasted in chat.
- Never rerun a tools/ script or any one-off function without Brett. They move, rename, and trash finance files.

## Creating a new project

1. Scope it through the COO request protocol (scope, definition of done, plan).
2. Create it in Shared Drives > Operations > Apps Scripts (team) or Brett's My Drive (personal; never in the team folder).
3. Apply the standard build above, mirror it in src/<project-name>/, and record IDs and URLs in dashboard-inventory.md.
4. Add a row to systems-registry.md, the operations map section 2, and the CHANGELOG in the same session. A new team uses docs/sop-new-team-setup.md.

## What an agent may touch

| Action | Rule |
|---|---|
| Read the mirror, docs, live source, deployments, executions | Yes |
| Run a read-only diagnostic (diag, diagRevenue, ?debug=, ?format=json) | Yes, and say which one ran |
| Edit the mirror for a staged change | Yes; the change is a draft until Brett's go |
| Save or deploy live code | Only on Brett's go, by the ship steps above |
| New deployment, new trigger, new scope, new Script Property | Staged; Brett consents |
| Change a Script Property value, sharing, or access level | Never |
| Rerun a tools/ script or any function that writes | Never without Brett, per run |
| Edit the Finance Filing Rules sheet or FSE Portal Content sheet directly | Never (Finance: through the dashboard; content sheet: Elizabeth) |
| Edit archive/ or deploy from it | Never |

Until the dashboard-builder worker exists, the COO does this work in session and logs "no specialist".

## Known drift (no change now; each fix staged for Brett)

| # | Where | What | Proposed fix |
|---|---|---|---|
| 1 | system-reference.md Standing rule 5 and Deploy flow | Told Brett to paste code and redeploy; Brett does not hand-edit, Claude ships | Applied 2026-10-09: both point to this file's Shipping section |
| 2 | dashboard-inventory.md | Said sources are mirrored in ../gas/ (they are in src/) and called the Revenue Dashboard embedded in the retired Sites portal | Applied 2026-10-09 |
| 3 | Revenue, Client Stats, Hub (setXFrameOptionsMode ALLOWALL) | Framing allowed for the Google Sites embeds, retired 2026-09-23 | Remove from each project the next time it ships, not in a deploy of its own (Brett, 2026-10-09) |
| 4 | FSE Finance Dashboard MODEL | Pinned to claude-sonnet-4-6; newer models exist | Test a newer model on a set of real PDFs before any swap; Brett decides |
| 5 | Finance, Revenue, Client Stats | No test deployment, so a change ships straight to users | Finance gets a test deployment when next touched; Revenue and Client Stats stay direct with a live check (Brett, 2026-10-09) |
| 6 | BW Daily Brief | Not mirrored | Mirror when next touched (operations map) |
| 7 | tools/Finance-Filing-Watcher.gs | Describes a time-driven trigger; whether one is installed could not be verified | Check the project's Triggers page in the next Apps Script session |
| 8 | FSE Portal Content sheet | Sits in Brett's My Drive root (Portal Rebuild MEMORY) | Move to a shared Operations folder Elizabeth can edit; Brett's go |

## Change log

- 2026-10-26: Step 7: reload the editor before reading a deployment's version (Manage deployments showed Version 62 after the production deploy to 64 until a reload; Brett approved in the session audit).
- 2026-10-21: Step 5: try the deploy in any session; auto mode blocked it 10-09 and 10-20 but allowed it 10-21, so Brett clicks or a default-mode session takes over only when blocked. Consent bullet's out-of-auto-mode sentence removed (Brett approved in the session audit).
- 2026-10-20: Step 5: start a deploying thread in the default permission mode; auto mode blocks test and production deploys (Brett approved in the session audit).
- 2026-10-12: Consent bullet: explicit oauthScopes when adding a Google service, full spreadsheets scope for openById, fail-soft errors in ?debug, deployments named by ID tail, ships out of auto mode (session audit, Brett).
- 2026-10-09: FSE Portal Content sheet: the COO edits it for system changes; Elizabeth is not a gate (Brett).
- 2026-10-09: drafted by the COO from the live mirrors and the Dashboards docs; promoted to 00_Resources/ (Brett). Finance gets a test deployment when next touched; ALLOWALL framing comes off on each project's next ship.
