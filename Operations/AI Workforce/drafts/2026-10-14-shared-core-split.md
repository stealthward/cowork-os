# Shared Core split: every OS file classified

_COO, 2026-10-14. Personal Layer (names what is personal). Staged for Brett's approval; nothing moved or edited. Feeds "Build the team kit folder" (due 10/28)._

## Rules applied

- **Shared Core:** travels to the team kit as is.
- **Shared Core, scrub:** travels after the listed lines are removed or generalized in the kit copy. Brett's original stays untouched.
- **Template:** the structure travels, the content does not. The kit gets an empty or generic version.
- **Personal Layer:** never enters the kit.
- Test used: the AI Workforce rule that Shared Core never references Max Income, compensation, ownership percentages, or personal matters (apriliapeace, 2212), plus the roadmap Phase 4 personal list (every MEMORY.md, credentials, Business Development pipeline detail). A file that only names Max Income as off limits still counts as a reference and gets a scrub.
- Excluded from the kit, no label: every `desktop.ini` (Windows system file).

Scope per the task's Done when: the OS root, `00_Resources/`, and `.claude/`. Root folders get a folder-level row at the end so the kit build has the whole picture.

## OS root

| File | Class | Why | Scrub or template note |
|---|---|---|---|
| CLAUDE.md | Template | Most rules are company-wide (writing, files, Asana, email from agents), but it carries Brett's browser device IDs, the Aprilia Peace profile, the Max Income routing row, and his personal preferences | Kit copy drops the Browser Routing table and profile IDs, the Aprilia Peace lines, the Max Income routing row and K-1 wording, and rules about Brett personally; keeps writing, files, email, Asana, and OS maintenance rules with "the user" in place of Brett |
| MEMORY.md | Template | Brett's active state, compensation references, apriliapeace, pipeline | Kit gets an empty MEMORY.md with the same headings |
| ARCHIVE.md | Template | Past pipeline contacts (names, emails, phone numbers) | Kit gets an empty ARCHIVE.md |

## 00_Resources/

| File | Class | Why | Scrub note |
|---|---|---|---|
| 2026-Five-Star-Escrow-Brand-Kit.pdf | Shared Core | Company brand kit | |
| five-star-brand-summary.md | Shared Core | Company brand summary | |
| rtm-product-library.md | Shared Core | Tagged Shared Core; company products | |
| audience-personas.md | Shared Core | Tagged Shared Core; company avatars | |
| zoho-conventions.md | Shared Core | Tagged Shared Core; no personal lines found | |
| smartsheet-conventions.md | Shared Core | Tagged Shared Core; names compensation sheets only as never-read | |
| apps-script-conventions.md | Shared Core | Tagged Shared Core; 1Password line is the credential rule | |
| workstation-project-setup.md | Shared Core | How to set up a workstation or project | |
| content-frameworks.md | Shared Core | The one content rulebook; frameworks, not Brett's data | Untagged today; add the tag |
| acronyms.md | Shared Core, scrub | Tagged Shared Core but carries personal rows | Remove AP (Aprilia Peace), 2212, SDMC row's Aprilia/2212 reference, and the K-1 "Max Income territory" row |
| asana-conventions.md | Shared Core, scrub | Tagged Shared Core; six Max Income lines | Replace Max Income lines with "a Personal Layer project" wording |
| drive-conventions.md | Shared Core, scrub | Tagged Shared Core; Never read line names Max Income, apriliapeace, the Max Income Console script | Generalize to "Personal Layer folders and files" |
| cowork-vs-code.md | Shared Core, scrub | Useful to everyone; uses Max Income as its worked example | Swap the Max Income example and folder tree for an Operations example |
| cowork-os-guide.md | Shared Core, scrub | The architecture and franchise model the kit is built on | Remove the Max Income workstation rows, section, and folder tree; the apriliapeace and 2212 line; the Personal Layer File Map rows |
| users-guide.md | Shared Core, scrub | How to drive the OS; written for Brett | Replace "Brett's" with "your"; drop the app Project names that are his |
| operations-map.md | Personal Layer | Says so itself: names Brett's accounts and personal scripts | A scrubbed team version is a later decision (see Decisions) |
| brett-profile.md | Personal Layer | Identity, bios, how Brett works; never enters a shared root (Brett, 2026-09-23) | |
| growth-strategy.md | Personal Layer | Tagged Personal; Brett's growth thesis | |
| initiatives.md | Personal Layer | Tagged Personal; Brett's initiatives and ownership | |
| voice-principles.md | Personal Layer | Brett's voice; each person gets their own | Kit gets a blank voice-principles template (see Decisions) |
| email-register.md | Personal Layer | Brett's email voice calibrated on his sent mail | |

## .claude/

| File | Class | Why | Scrub note |
|---|---|---|---|
| autonomy-boundaries.md | Shared Core, scrub | The agent rules every seat inherits | Generalize the Max Income and apriliapeace lines to "Personal Layer folders" |
| agents/zoho-specialist.md | Shared Core, scrub | Tagged Shared Core candidate; read-only Zoho method | Replace "Brett Ward" owner line with the kit owner |
| agents/asana-specialist.md | Shared Core, scrub | Tagged Shared Core candidate | Remove the Brett's World and Max Income lines; keep the convention-check mode |
| agents/editor.md | Shared Core, scrub | Tagged Shared Core candidate (checklist travels) | Point at the user's own voice and profile files, not brett-profile.md and growth-strategy.md |
| agents/research-sidekick.md | Shared Core, scrub | Tagged Shared Core candidate (method travels) | Remove Brett's campaign targets from the description and the Max Income and apriliapeace line |
| skills/handoff/SKILL.md | Shared Core, scrub | Generic method | Replace "Brett" with "the user" (8 mentions) |
| skills/reconcile/SKILL.md | Shared Core, scrub | Generic method | Replace "Brett" with "the user" (8 mentions) |
| skills/session-audit/SKILL.md | Shared Core, scrub | Generic method | Replace "Brett" with "the user" (10 mentions) |
| skills/factory-cut-sheet/SKILL.md | Shared Core, scrub | Part of the reel cut sheet process, which is Shared Core (Brett, 2026-10-14); the Code wrapper around the engine for Factory episodes | Generalize the machine-specific lines: the Plaud account, the RTX 3050 GPU check, the G: Drive shortcut path, and "Brett's review marks" (the reviewer) |
| settings.local.json | Template | Brett's machine paths, an apriliapeace path, one-off permissions | Kit gets a clean settings.json with the standard allow list only |
| agents/copywriter.md | Personal Layer | Tagged Personal; writes in Brett's voice | |
| skills/chief-of-staff/SKILL.md | Personal Layer | Tagged Personal while it runs for Brett; method is a candidate | Seat template is a later build, not this kit |
| skills/cmo/SKILL.md | Personal Layer | Tagged Personal; reads Brett's pipeline and voice | Same |
| skills/coo/SKILL.md | Personal Layer | Tagged Personal while it runs for Brett alone | Same |
| skills/alignment-check/SKILL.md | Personal Layer | Checks Brett's claude.ai account against his root files | |

## Content & Authority/Reel Cut Sheet System/ (Shared Core, Brett 2026-10-14)

The whole reel cut sheet process is Shared Core. The engine (the reel-cut-sheet skill) and the factory-cut-sheet Code skill are separate layers: the engine runs every show's cut sheet; factory-cut-sheet only wires Factory inputs and outputs around it.

| File | Class | Note |
|---|---|---|
| CLAUDE.md | Shared Core | System brief |
| engine/SKILL.md, build_cut_sheet_doc.py, verify_cut_sheet.py | Shared Core | Not retagged: engine/ stays byte-identical to the deployed skill package |
| pipeline/align_transcript.py, build_reels_from_rows.py, retime.py | Shared Core | |
| show-contexts/factory.md | Shared Core | Show facts |
| sop/cutsheet-build-process.md | Shared Core | Pointer to the team SOP Google Doc |
| MEMORY.md | Shared Core, scrub | Exception to "every MEMORY.md is Personal": its calibration and change logs are the system's record. Scrub line 73 (root Drive rule naming the Max Income Console) |

## Root folders (folder level, for the kit build)

| Folder | Class | Note |
|---|---|---|
| Operations, Email HQ, Content & Authority, Business Development | Template | Folder structure and CLAUDE.md files travel after a scrub (the Reel Cut Sheet System is Shared Core, above); every MEMORY.md, Business Development pipeline detail, and Email HQ contact detail stay Personal |
| Max Income | Personal Layer | |
| apriliapeace | Personal Layer | |
| .obsidian | Personal Layer | Brett's note-app config |
| _Archive, _Outbox, _to_delete, Claude outputs | Excluded | Not OS architecture |

## Totals

In-scope files: 39 (excluding 13 desktop.ini). Shared Core 9, Shared Core scrub 15, Template 4, Personal Layer 11. Plus the Reel Cut Sheet System's 10 files: Shared Core 9, Shared Core scrub 1.

## Decisions for Brett

1. Approve the split as written.
2. voice-principles.md: Personal Layer with a blank template in the kit (recommended), or share it so the production team can write in Brett's voice.
3. operations-map.md: stays Personal for the pilot (recommended), or ship a scrubbed team copy, since Elizabeth is first contact on every system.
4. Retag the files whose tag changes (content-frameworks.md gains Shared Core; acronyms, asana, drive conventions gain "scrub before kit") in the same go.

## Apply log

- 2026-10-14, Brett's go in the thread: split approved as written; voice-principles.md stays Personal with a blank template in the kit; operations-map.md stays Personal for the pilot (revisit after 11/20); retag now.
- Retagged, tag lines only, no content change: content-frameworks.md gains "Shared Core"; the 14 scrub files carry "Shared Core, scrub before kit" (acronyms, asana-conventions, drive-conventions, cowork-vs-code, cowork-os-guide, users-guide, autonomy-boundaries, handoff, reconcile, session-audit, and the four agent files' owner lines). Verified by re-read.
- 2026-10-14, Brett: the whole cut sheet process is Shared Core. factory-cut-sheet moved from Personal Layer to Shared Core scrub; the Reel Cut Sheet System section was added; factory-cut-sheet SKILL.md and the system CLAUDE.md retagged (engine files untouched).
- 2026-10-30, kit built (team-kit/, COO): every row above applied; leak check clean after 7 fixes (logs/coo-log.md 2026-10-30). Brett's go in the thread on files built after the split: fact-checker and smartsheet-specialist are Shared Core, scrub (added to the kit, scrubbed, rechecked); os-curator, blueprint-audit with .claude/blueprint/, and the registry-guard hooks (.claude/hooks/, .claude/settings.json) stay Personal Layer for the pilot. Recheck also generalized two more lines (acronyms SDTT investor name, apps-script personal My Drive).
