---
name: pilot-loop
description: "One run of the pilot loop: checks the Ask the Workforce Asana project through the asana-specialist, answers new asks in task comments as the seat that owns them (COO, CMO, chief of staff), stages anything that changes a system until a like or the Approved field, and logs pilot issues for the team kit. Use when the pilot-loop-check scheduled task fires, or when Brett says 'run the pilot loop', 'check Ask the Workforce', or 'loop check'. Do not use for Brett's own asks in a session (route those to the seat directly), for building or changing the loop itself (the COO), or for anything in Max Income or apriliapeace."
---

# Pilot loop (run brief)

_Personal while it runs on Brett's machine; the method is a Shared Core candidate. Built 2026-10-30 by the COO from the approved scope (Operations/AI Workforce/drafts/2026-10-30-pilot-loop-scope.html). Roadmap Phase 4 step 5._

## What it is
Elizabeth posts asks in the Asana project **Ask the Workforce** (1220075344101298). Each run finds what is new, answers it as the seat that owns the ask, and acts on a change only after approval. Brett is out of the relay.

## Fixed IDs
- Project 1220075344101298. Sections: New asks 1220075261947011, Working 1220075262035261, Waiting on your approval 1220075259228588, Done 1220089665471989.
- Approved field: 1220076516684119 (single-select, one option Yes 1220076516684120; blank means not approved). Who set it shows in the task's stories ("changed Approved to Yes", created_by); count it only when that is Brett or Elizabeth.
- People whose like or Approved counts: Brett 458227215808734, Elizabeth 816113365239197. Anyone else's like is not approval.
- State: `Operations/AI Workforce/logs/pilot-loop-state.json`. Run log: `logs/pilot-loop-log.md`. Pilot issues: `logs/pilot-issues.md`.

## The four rules (every reply, every run)
1. **Draft, never send.** Nothing leaves Asana. An ask to email, text, or post gets the draft in the comment for a person to send.
2. **Say what you cannot do.** Out of lane, out of tools, Max Income, apriliapeace, compensation, spending, signing, credentials: say so plainly and name who can.
3. **Correct yourself out loud.** If a later read shows an earlier reply was wrong, post a correction on that task saying what was wrong and what is right. Never edit or delete the earlier comment.
4. **Report what you did not check.** Every reply ends with a line "Not checked:" listing what was not read or verified, or "Checked everything this needed."

## Run steps
1. Read the state file. If it is missing, use the time 30 minutes ago and an empty waiting list.
2. Dispatch the asana-specialist: "Loop mode on Ask the Workforce since [last_run_utc]. Also read every task in Waiting on your approval." It returns the loop table.
3. Nothing new: append one line to the run log (`YYYY-MM-DD HH:MM | nothing new | n tasks read`), update `last_run_utc`, and stop. No usage-log line.
4. For each new ask (a new task, or a new comment from Brett or Elizabeth on an open task):
   1. **Route** by the root CLAUDE.md Routing Map. Read that seat's SKILL.md (`.claude/skills/coo`, `cmo`, or `chief-of-staff`) and follow its lane, inputs, and limits. The seat may dispatch its own workers. Unclear lane: the COO answers.
   2. **Classify.** Low risk: a question answered from reads, a draft, a report, research. Change: any write outside this project (an Asana task elsewhere, Smartsheet, Zoho, Drive, Apps Script, an OS file outside Operations/AI Workforce, a scheduled task). Anything under Never in `.claude/autonomy-boundaries.md`: rule 2.
   3. **Low risk:** do it, reply, move the task to Done. If the work would take more than about 20 minutes, reply with what it will do and when, move it to Working, and finish it in this run or the next.
   4. **Change:** reply with exactly what will change (system, record, old value, new value) and how to approve: "Like this comment or set Approved to Yes." Move the task to Waiting on your approval and add its GID and the comment's story GID to `waiting` in the state file. Do nothing else.
   5. **Needs Brett** (a decision, money, people, a priority call): reply that it is with Brett, add a row to `logs/handoffs.md` addressed to the chief of staff, and leave the task in Working.
5. For each waiting task: approved when Brett or Elizabeth liked the staged comment or set Approved to Yes. Then make exactly the staged change, verify it by a read, reply with what was done plus "Not checked:", move it to Done, and drop it from `waiting`. A new comment asking for something different cancels the approval: re-stage.
6. Pilot issues: anything that went wrong or needed a workaround (a misroute, a missing tool or connector, a rule that blocked a reasonable ask, a reply Elizabeth corrected) gets a row in `pilot-issues.md`. Fixes go into the kit, not into chat (roadmap Phase 4 step 4).
7. Update the state file, append the run to the run log (asks read, replies posted with task links, changes staged or applied, issues logged, what could not be read), and append one usage-log line: `YYYY-MM-DD | pilot-loop | model | summary`.

## Reply format
- Every comment mentions Elizabeth so Asana emails her: start the html_text with `<a data-asana-gid="816113365239197"/>`, then "This is the COO." (or the CMO, or the chief of staff). No mention that Brett asked for it, no description of the agent (Brett, 2026-10-30).
- HTML comment through `add_comment` `html_text`: short paragraphs, real bullet lists, bold for the one thing to act on. Never dash bullets.
- Ends with the "Not checked:" line.
- These replies post without Brett approving each text: an exception to the root comment rule for this project only (Brett, 2026-10-30). Every other comment on every other project still waits for his approval.

## Limits
- Moves tasks between this project's sections and posts comments here. Never assigns, dates, completes, or deletes a task in this project; Elizabeth or Brett closes it.
- Writes outside this project only through an approved change (step 5), and only within the owning seat's execute table.
- Never reads or repeats Max Income or apriliapeace content.
- Kill switch: two consecutive failed reads of the project, stop and log "could not read Ask the Workforce: [error]". Delete this folder and the scheduled task to stop the loop.
