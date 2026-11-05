---
name: blueprint
description: "Branding Blueprint entry skill: runs a real estate agent's Branding Blueprint engagement end to end and tracks where each client stands. Opens the intake and client folder, runs blueprint-audit, stops for Brett's manual analysis, delivers the RTM Digital Brand Analysis, stops for Brett to send it and hold the discovery meeting, drafts the discovery summary from his dictation or the Plaud recording, runs blueprint-strategy, then blueprint-portal-bio and blueprint-website-copy as Phase 1, and closes the engagement. Run by the CMO. Use when Brett says 'CMO, start a Branding Blueprint for <agent>', 'new Blueprint client', 'Blueprint status', 'where is <agent>'s Blueprint', 'next step for <agent>', 'resume the Blueprint for <agent>', or 'discovery is done for <agent>'. Do not use to run one component alone when Brett names it (blueprint-audit, blueprint-portal-bio, blueprint-website-copy, blueprint-strategy), for Brett's own content or profiles (copywriter), for Real Talk or Five Star company marketing, or for prospect research before an agent signs (research-sidekick)."
---

# blueprint

_Branding Blueprint entry skill, over the four component skills. Built 2026-11-03 from the approved scope (Operations/AI Workforce/drafts/2026-10-14-branding-blueprint-scope.md), after blueprint-audit, blueprint-portal-bio, blueprint-website-copy, and blueprint-strategy each passed their evals on Jim McInerney. Personal Layer while Brett runs it; method is a Shared Core candidate. Model: inherits the caller (the CMO seat, opus tier); each component skill and worker runs on its own tier._

This skill does no writing of its own beyond the intake, the discovery summary draft, and status. It decides which stage a client is in, runs the component skill that stage needs, stops where Brett owns the next move, and records it. The component skills hold the method; never restate or override their steps here.

## Read first

From `.claude/blueprint/reference/`: process.md (the spine and deliverable names), integrity.md, intake-template.md, discovery-summary-template.md. Each component skill names its own reading when it runs.

## Folders

| Run | Client folder |
|---|---|
| Engagement (a signed client) | `Business Development/Branding Blueprint/<client>/` (lowercase, hyphenated agent name) |
| Test | `Operations/AI Workforce/evals/blueprint/<YYYY-MM-DD>-<client>/` |

Every component skill runs in this one folder; the entry skill passes the path. A test never proposes Asana tasks, never touches Business Development files, and nothing from it goes to a client.

**First engagement only.** `Business Development/Branding Blueprint/` does not exist until the first signed client. When this skill creates it, stage two edits for Brett with a diff, in the same session (root CLAUDE.md, OS Maintenance): a line in `Business Development/MEMORY.md` naming the folder and the client, and the folder in the File Map of `00_Resources/cowork-os-guide.md` (bump its Last updated date). Every later client adds one line to Business Development MEMORY.md, also staged.

## status.md (the only tracker)

Every client folder has one `status.md`. It is the record Brett and the chief of staff read; nothing else tracks the engagement (no separate roster, no MEMORY.md copy).

```
# Branding Blueprint: <Agent name>

| Field | Value |
|---|---|
| Run | engagement or test |
| Stage | <stage number and name from the table below> |
| Next step | <one line, who does it> |
| Waiting on | Brett, client, CMO, or none |
| Last updated | YYYY-MM-DD |
| Apify cost to date | <dollars, from the audit logs> |

## Deliverables

| Deliverable | File | _Outbox/ path | Approved | Sent by Brett |
|---|---|---|---|---|

## Stage log

| Date | Stage | Event |
|---|---|---|
```

The component skills also update `status.md` at their own stops; this skill reads it on every load and writes the stage change, the next step, and a Stage log row at every stop.

## Stages

| # | Stage | Runs | Ends when | Then waits on |
|---|---|---|---|---|
| 1 | Intake | This skill | `intake.md` has the four start fields | none |
| 2 | Audit | blueprint-audit Stages A, A2, B | `internal-brand-audit.md` fact-checked | Brett: manual analysis |
| 3 | Manual analysis | Brett | `manual-analysis.md` saved verbatim, or "none" | none |
| 4 | Analysis | blueprint-audit Stage C | Brett approves the three documents; Analysis .docx in `_Outbox/` | Brett: send the Analysis, book discovery |
| 5 | Discovery | Brett (sends the Analysis, holds the meeting) | Brett says discovery is done | none |
| 6 | Discovery summary | This skill | Brett approves `discovery-summary.md` with C1 to C6 answered | none |
| 7 | Blueprint | blueprint-strategy | Brett approves the Blueprint; .docx in `_Outbox/` | Brett: send the Blueprint |
| 8 | Phase 1: portal bios | blueprint-portal-bio | Brett approves the bios; .docx in `_Outbox/` | none |
| 9 | Phase 1: website copy | blueprint-website-copy | Brett approves the copy; .docx in `_Outbox/` | Brett: send the Phase 1 copy |
| 10 | Delivered | This skill (closeout) | Closeout written | none |

Stages 8 and 9 start on Brett's approval of the Blueprint, not on the client's reply; they run in this order because website copy starts from `bio-facts.md`. If the client later changes the positioning, re-run whichever of 8 and 9 the change touches and log it.

## On load: find the stage

1. "Blueprint status" (no client named): read every `status.md` under `Business Development/Branding Blueprint/` and return one table (client, stage, next step, waiting on, last updated, days idle). Days idle is today minus Last updated; flag any engagement idle 14 days or more. Where a client's files on disk show a later stage than its status.md, mark the row "check" without correcting it (the correction happens when that client is loaded). Then stop. "Blueprint status, tests" reads `Operations/AI Workforce/evals/blueprint/` the same way.
2. A client named: find its folder. None, and Brett said "start": go to Stage 1. None otherwise: ask whether to start one.
3. Read `status.md`, then check it against the files on disk with this map (the latest stage whose evidence exists is the true stage):

| Evidence on disk | Stage reached |
|---|---|
| `intake.md` with the four start fields | 1 done |
| `internal-brand-audit.md` (its fact-check result goes in the Stage log when blueprint-audit returns; if absent, look for it in `logs/cmo-log.md` and name the gap) | 2 done |
| `manual-analysis.md` | 3 done |
| `rtm-digital-brand-analysis.md`, `discovery-agenda.md`, `cover-email-analysis.md`, approval in status.md | 4 done |
| Brett's word that discovery happened (status.md row) | 5 done |
| `discovery-summary.md` with "Approved by Brett" dated | 6 done |
| `blueprint.md`, `qa.md`, approval in status.md | 7 done |
| `bios.md` with approval in status.md | 8 done |
| `site-copy.md` with approval in status.md | 9 done |

If status.md and the files disagree, name the difference to Brett in one line and correct status.md to what the files show, adding a correction row to the Stage log (earlier rows stay as written).

A component's output on disk with no return recorded (its fact-check result is in neither the Stage log nor `logs/cmo-log.md`): run that component's own fact-check step on the files before asking Brett to approve them; never ask him to approve an unchecked client-facing document. Approval of an internal document (the Discovery Meeting Agenda) goes in the Stage log. The component skill renders its .docx on approval; a test skips the .docx unless Brett asks. Never infer an approval or a send from a file existing; those come only from Brett.

4. Tell Brett the stage and the next step in two lines, then run it (Stages 1, 2, 4, 6 to 10) or ask for what he owes (Stages 3 and 5).

## Stage 1: intake

Copy intake-template.md to `intake.md` and create `status.md` (Stage "1 Intake"). Fill the four start fields (agent name, brokerage, primary market, website URL; the template's team or brand name row is optional) and anything else Brett gives in the thread, each with its source. Set the Engagement block (signed client or test, start date, stage). Missing a start field: record the stop in status.md, ask in one message (question tool), and stop; the audit's discovery never stands in for a start field. Do not research the agent here; the audit's gather does that.

Stage labels in status.md are the number and name from the table below ("2 Audit"), naming the stage now open (the one in progress or waiting). Apify cost comes from the gather pack's logged total. The Deliverables table lists client-facing deliverables only. Logs go to `Operations/AI Workforce/logs/cmo-log.md` and `logs/usage-log.md`, in a test too.

## Stage 2 to 4: audit and Analysis

Run blueprint-audit in the client folder. Its stops are this skill's stops: after Stage B, ask Brett for his manual analysis (Stage 3); after Stage C, ask for approval (Stage 4). A test follows blueprint-audit's test rule: no stop at Stage 3; blueprint-audit records `manual-analysis.md` as "None (test run)" unless the folder already holds Brett's notes, which are never overwritten.

On approval of Stage 4, record it in status.md and give Brett his next move in the message: send the RTM Digital Brand Analysis with `cover-email-analysis.md` from his own account and book the discovery meeting. In an engagement, offer one Asana task for that action through the question tool (task name, project and section to confirm, Brett as assignee); create it only on his yes. Then stop.

## Stage 5: discovery

Brett owns this stage. When he returns ("discovery is done for <agent>", a Plaud recording name, or a dictated summary), record the meeting date and that the Analysis was sent. If he has not said whether the Analysis went out, check Gmail sent mail (read only) for the cover email to the agent before asking.

## Stage 6: discovery summary

1. **Source.** A Plaud recording: find it through the Plaud connector (`list_files`, then `get_transcript`), save the transcript to `discovery-transcript.md` with speaker names and timestamps. Brett's dictation: save it verbatim to `discovery-notes.md`. Both: save both. A notes or transcript file already in the folder is the source; never overwrite it.
2. **Draft.** Copy discovery-summary-template.md to `discovery-summary.md` and fill each row from the source, quoting the agent where the words set a fact, with the timestamp. A row the meeting did not cover says "not covered". Never fill a row from the audit, the intake, or inference; the summary records what discovery said.
3. **Coverage.** List every `discovery-agenda.md` prompt the meeting did not answer, and every audit conflict still open.
4. **Gate.** C1 to C6 are required. Each gap goes to Brett in the question tool (one question per gap, the best-sourced value from the transcript first if there is one, "Ask the client" as an option). A core row is a gap when it has no usable value or misses a part its definition names (a goal with no time frame); a thinner row is noted under Agenda coverage, not blocked. Ask the gaps first; ask for approval only after they are answered. A gap Brett sends to the client stops the engagement at Stage 6, waiting on the client.
5. **Approve.** Return the summary in the message (it fits a chat message; otherwise as a private Artifact page) and ask Brett to approve it with the question tool. His edits go in as his. On approval, date the "Approved by Brett" field.

## Stage 7: Blueprint

Run blueprint-strategy in the client folder. Its inputs are now complete, so its discovery gate should pass from `discovery-summary.md`; any gap it still finds goes to Brett, never filled. On approval, record it and give Brett his next move: send the Blueprint .docx with `cover-email-blueprint.md`. In an engagement, offer the Asana task as in Stage 4. Then go straight to Stage 8 in the same run unless Brett says to wait.

## Stages 8 and 9: Phase 1 copy

Run blueprint-portal-bio, then blueprint-website-copy, in the client folder. Copy already on disk that was written before the approved discovery summary or Blueprint (a standalone run, a test) is never put up for approval as is: the component re-runs its facts sheet against `discovery-summary.md` and `blueprint.md`, and rewrites any line whose fact changed (Jim McInerney orchestration test, 2026-11-03: bios kept two test guesses the summary dropped). Each reads `blueprint.md` and `discovery-summary.md`, so their facts gates should pass; any gap goes to Brett. Each stops for its own approval. After both are approved, give Brett his next move: send the bios and website copy to the client (or hand them to whoever posts them), with the facts the client must confirm before anything goes live.

## Stage 10: closeout

1. List every deliverable with its `_Outbox/` path, approval date, and send date in status.md; any not yet sent stays named as open, and so does every client question still unanswered (discovery gaps, audit conflicts, the copy skills' confirm-before-live lists), so Brett has one list to close with the agent.
2. Run notes: what this engagement taught goes to the reference file that owns it (blueprint-structure.md Run notes, portal-standard.md, website-standard.md, social-audit.md) or cmo-memory.md; staged where the CMO brief says to stage.
3. Engagement: stage the Business Development MEMORY.md line update (client, delivered date, what Real Talk executes next). Phase 1 execution by the production team waits for Team Edition; name it as the next step, never schedule it.
4. Set Stage 10, Waiting on "none".

## Return at every stop

The stage reached, what was produced (files, with paths), the component skill's own return (its fact-check and QA lines), what waits on Brett with the exact action, and anything open. Anything longer than a chat message goes as a private Artifact page (the component skills say which). Decisions go through the question tool, one per question, recommended answer first.

## Never

Send, post, or contact the agent or anyone else; mark an approval or a send Brett did not give; skip a stage or run strategy before an approved discovery summary in an engagement; fill a discovery row from anything but discovery; create an Asana task without Brett's yes and a confirmed project; edit a CLAUDE.md, Business Development MEMORY.md, or the OS guide without showing the diff first; restate or override a component skill's method.

## Logs

The CMO's run log (cmo-log.md: request, client, stage on load and on exit, component skills run and their results, what went to Brett, what waits) and the usage-log line. Component skills log their own steps.

Editing this file: write money without a dollar sign followed by a digit ("5 dollars"); the skill loader reads that pattern as an argument slot.

## Eval

`Operations/AI Workforce/evals/blueprint-eval.md`. First test: Jim McInerney, an orchestration test (Brett, 2026-11-03): a fresh test folder, a cold-start intake, then the passed component outputs fed in stage by stage. Passing it completes "6 of 6: blueprint entry skill" in AI Workforce (CMO section).
