---
name: alignment-check
description: "Monthly check that the Cowork OS files on disk match what is configured in Brett's claude.ai account: account instructions vs root CLAUDE.md rules, connected connectors vs the MEMORY.md tools list and the guide connector table, claude.ai projects vs the registry's satellite rows, installed Cowork plugins vs the expected set, and scheduled tasks vs the registry's Scheduled tasks section. Reports only differences, each with a recommended fix, applies local fixes on approval, and hands Brett the account-side clicks in one list. Use when Brett says 'alignment check', 'run the alignment check', 'are my systems aligned', 'check claude.ai against the OS', or when the COO flags on load that 'Last alignment check' in MEMORY.md is over 30 days old. Code only: it needs the built-in browser signed in as Brett and the local files. Do not use for the quarterly OS audit (folder hygiene) or the end-of-session audit (session-audit)."
---

# Alignment Check

Source of truth: `.claude/skills/alignment-check/SKILL.md` in the Cowork OS. Created 2026-09-23 after the CRMLS priority cleanup, when a retired priority survived in five places because nothing compared the account side against the files.

Nothing in this skill changes a file or an account setting without Brett's approval. The output is a difference list, not a status report: if everything matches, say so in one line and update the date.

## What to read first

1. Root `CLAUDE.md`, root `MEMORY.md` (Scheduled Tasks and Satellites pointer, Local Windows and Notes, Tools & Systems, System Maintenance), and `Operations/AI Workforce/systems-registry.md` (Scheduled tasks, Tools and data, Workspaces). Since 2026-10-30 the registry is the only list of scheduled tasks and satellites; root MEMORY.md names only the two Aprilia Peace tasks, which stay off the registry.
2. `00_Resources/cowork-os-guide.md`, the Connected Tools table and the File Map.
3. The Claude Code memory file `claude-ai-account-context-map.md` for where each account-side item lives and the browser quirks.

## The five comparisons

Run all five. For each, capture the account-side state first, then the file-side state, then list only the lines that differ.

| # | Account side (source) | File side (must match) | Typical drift |
|---|---|---|---|
| 1 | Instructions for Claude, claude.ai Settings > Profile (one textarea; read its value with JavaScript, page text skips it) | Root `CLAUDE.md` rules and the Standing Priorities in root `MEMORY.md` | A priority or system named in one place and retired in the other; a writing rule present in one only |
| 2 | Settings > Connectors, the "Yours" list with status | Root `MEMORY.md` Tools & Systems, the guide's Connected Tools table, the Connected Systems line in the account instructions | A connector added or disconnected and not recorded; a connector showing Reconnect |
| 3 | claude.ai/projects, active and archived | The root-pinned Cowork windows line in root `MEMORY.md`, and the satellite rows in the Workspaces and Tools and data sections of `Operations/AI Workforce/systems-registry.md` | A satellite retired in memory but still live, or created and never registered; a project archived on claude.ai while its registry row says Active. Then ask Brett "still needed?" for each Workspaces row, and re-render and republish the registry page after any change |
| 4 | Installed plugins: `AppData/Local/Claude-Data/<id>/rpm/<org>/<user>/manifest.json` (moved from AppData/Roaming by 2026-10-28; account skills are in `local-agent-mode-sessions/skills-plugin/.../manifest.json` beside it) | Expected set: customized productivity (plugin_01EmqWEkxmQa9GnV2RFbdbrK), cowork-plugin-management, small-business, Apify (added 2026-10-05) | Duplicate plugin names; a stock copy installed beside the customized one |
| 5 | Cowork scheduled tasks (the scheduled-tasks connector list) and Code routines | The Scheduled tasks section of `Operations/AI Workforce/systems-registry.md` (cadence in `registry-page/links.json`), the two Aprilia Peace tasks named in root `MEMORY.md`, and the Browser Routing rule in root `CLAUDE.md` | A task created, renamed, or retired without a registry update (re-render and republish the page after the fix); a task prompt that uses a browser without naming the built-in browser or a specific device ID |

Also compare the customized productivity plugin's start skill (People, Active Projects, Tools tables) against root `MEMORY.md`. It is a pre-seeded copy and drifts silently.

## Browser notes

- Use the built-in browser (signed in as Brett on this machine, per the Browser Routing rule in root `CLAUDE.md`). Do not use Claude in Chrome for this skill; if the built-in browser is signed out, ask Brett to sign in there rather than switching.
- Connectors now live at `claude.ai/customize/connectors`; click the "Yours" radio for the connected list and status. Projects, including archived ones, read fastest from `/api/organizations/<org>/projects?include_archived=true` in a signed-in tab. The session's connector status tool is a cross-check.
- In the settings modal, the Customize pages (Connectors, Plugins) rendered only on the first click of a session. If a click does not render, reopen the modal from `claude.ai/settings/profile` and click once; if it still fails, read what can be read and mark the item "not verified" rather than guessing.
- Close every tab the skill opened before reporting.

## Report format

One table, differences only, ordered by risk (a wrong priority or rule first, a missing description last):

| Item | Account side says | Files say | Recommended fix | Who applies |
|---|---|---|---|---|

"Who applies" is Claude (local file edit, or an account-side edit Claude can make through Chrome with approval) or Brett (plugin install or removal, connector reconnect, anything behind an OAuth consent).

Then two lists: the local edits Claude will make on "go", and Brett's clicks. Restate both in full in the message that asks for approval.

## After approval

1. Apply the local edits. Follow the root `CLAUDE.md` rules: show the guide diff before saving it, bump the guide's "Last updated" date, keep root `MEMORY.md` under 150 lines.
2. Apply approved account-side edits in the built-in browser (set the textarea with the native value setter, dispatch an input event, JS-click the exact 'Save changes' button), reload, and re-read the value to confirm the save.
3. Set "Last alignment check" in root `MEMORY.md` to today's date.
4. List every file created or modified with its location, and the account-side items that remain on Brett.

## Cadence

Monthly. Root `CLAUDE.md` prompts when the date is over 30 days old. Run it as the first task of a Code session, not mid-task, and not as an unattended schedule until the settings modal is reliable under automation.


## Usage log

Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`: `YYYY-MM-DD | alignment-check | model that ran | one-line summary`. The systems registry page reads this to show when the skill last ran.
