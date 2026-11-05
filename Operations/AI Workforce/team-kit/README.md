# Cowork OS Team Kit

_Shared Core. Built 2026-10-30 by the COO from the approved split (Operations/AI Workforce/drafts/2026-10-14-shared-core-split.md). Copy this whole folder to become a new person's Cowork OS root; never edit this master copy for one person._

## Install

1. Copy this folder to the new person's machine (skip the Windows `desktop.ini` files) and rename the copy `Cowork OS`.
2. In the Claude desktop app, open the Code tab on that folder (agents and folder skills only run in Code).
3. Fill in `00_Resources/voice-principles.md` and the "My preferences" section of `CLAUDE.md` in the first session.
4. Set the owner line ("The kit owner (set at install)") in each `.claude/agents/` file.
5. Check the connector tool names in `.claude/settings.json` and the agent files match the new account (connector IDs can differ per account).
6. For cut sheet builds only: set the synced Drive path in `.claude/skills/factory-cut-sheet/SKILL.md` and confirm the machine has a CUDA GPU.

## What is in it

| Area | Contents |
|---|---|
| Root | CLAUDE.md (company rules template), empty MEMORY.md and ARCHIVE.md, _Outbox, _Archive |
| 00_Resources | Brand kit and summary, product library, personas, content frameworks, acronyms, the five conventions files, OS guide, users guide, Cowork vs Code, workstation setup, blank voice-principles template |
| .claude | autonomy-boundaries.md, settings.json (read-only allow list), agents (asana-specialist, zoho-specialist, smartsheet-specialist, editor, fact-checker, research-sidekick), skills (handoff, reconcile, session-audit, factory-cut-sheet) |
| Workstations | Operations, Email HQ, Business Development, Content & Authority: scrubbed CLAUDE.md, empty MEMORY.md, empty Resources folder |
| Reel Cut Sheet System | The full system (engine, pipeline, show context, SOP pointer, calibration MEMORY.md) in Content & Authority |

## Not in it (Personal Layer)

Seats (chief of staff, COO, CMO), the copywriter, os-curator, alignment-check, blueprint-audit and .claude/blueprint/, the registry-guard hooks, operations-map.md, every personal profile, strategy, initiative, and email-register file, and every MEMORY.md with live content.

## Known gaps

- Agent files point their logs and evals at `Operations/AI Workforce/`, which the kit does not ship. Runs still work; logging needs a folder or a pointer change before the pilot.
- Fixes found in the pilot go into this master copy, so the next person never hits them.
