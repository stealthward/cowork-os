# Reel Cut Sheet System

_Shared Core: the whole reel cut sheet process (Brett, 2026-10-14; see Operations/AI Workforce/drafts/2026-10-14-shared-core-split.md)._

## Identity

Standing system folder for the reel cut sheet pipeline: the engine (the reel-cut-sheet skill), each show's context module, the local Code pipeline, and the pointer to the team SOP. This is a system folder, not a time-bound project; it does not close.

Owned by the COO seat (Brett, 2026-10-05). The content rules the engine scores against (hook, 5P, takeaway, caption voice) live in 00_Resources/content-frameworks.md and voice-principles.md; the engine keeps no copy of its own (wiring follows the CMO's frameworks step 4).

## What is canonical where

| Thing | Canonical location | Deployed copies |
|---|---|---|
| Engine (SKILL.md + verify + formatter) | engine/ in this folder | Account-level skill "reel-cut-sheet" in claude.ai (team fallback builds). Package as a .skill (zip of a reel-cut-sheet/ folder, Python zipfile, forward slashes) to _Outbox with a dated filename; Brett replaces it under Customize > Skills (no per-project toggle exists; an installed skill is available in every project) |
| Show contexts | show-contexts/\<show\>.md | That show's claude.ai project instructions: copy everything below the PASTE marker over the full instructions |
| Team SOP | The "Cutsheet Build Process" Google Doc (Brett and the team edit it there) | sop/cutsheet-build-process.md is a pointer plus a read-only synced copy; refresh it from the Doc at the start of any session that touches the process, never edit the copy |
| Code pipeline | pipeline/ in this folder, plus the Code skill at the OS root `.claude/skills/factory-cut-sheet` | None |

## Rules

- Structure lives only in the engine. Show contexts carry facts (hosts, authority domains, audiences, guardrails, capture, segments), never structural instruction and never worked examples.
- engine/ stays byte-identical to the deployed skill package, plus references/content-frameworks.md, which packaging copies from 00_Resources (never edited in the package). engine/references/gold-reels.md is canonical here and ships in the package; a reel is added only when Brett marks it a keeper. A rulebook change means a same-day repackage and redeploy. Versions and change notes live in MEMORY.md's change log, not inside the engine files.
- Brett's production builds run in Claude Code on this machine through the factory-cut-sheet skill (Plaud connector in, WhisperX timing, verify, advisory review, format). The claude.ai show projects are the team's manual fallback and run the same engine. The Reel Cut Sheet Lab is the QA test bench.
- The Google Drive connector is never used to move a .docx. Review copies go to _Outbox; the final goes into the episode's Finished Reels folder through the synced shortcut (path in the factory-cut-sheet skill).
- Per-episode cut sheets are team production output. They live in the show's Drive episode folders and are never stored in the OS. The marked-up review copy from Brett may sit in _Outbox until its calibration notes are logged.
- Brett reviews every cut sheet in Word before handoff until output is consistent: strikethrough removes, highlight restores. Read the marks from the .docx, apply them, log what he changed in MEMORY.md's calibration section, and change the engine only when a mark repeats across episodes.
- Every engine change is logged in MEMORY.md (decision log and change log) with the date, along with the deployment record.

## Audit workflow

1. Read this folder (engine, show contexts, pipeline, SOP pointer) plus MEMORY.md before anything else. Refresh the SOP copy from the Doc.
2. Trust the change log for deployed state; compare against a deployed copy only if drift is suspected.
3. Make changes here, get Brett's approval, then deploy per the table above.
4. Log the change and the deployment in MEMORY.md, and update the root MEMORY.md open items if they moved.
