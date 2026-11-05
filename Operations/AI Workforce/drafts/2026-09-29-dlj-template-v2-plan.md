# Discover La Jolla template v2: scope and plan

_Status 2026-10-02: live; Miro board updated. Email sent 2026-10-02. Open: Elizabeth's answer on the QC Reels to Manager Review arrow._

## Revision 2 (Brett, 2026-09-29), supersedes the per-episode table below
- Parent task per episode deliverable keeps Editing Status. The reassign rule is removed; each status change runs a rule that creates the next person's subtask, assigned, with a due-date offset. Completed completes the parent.
- Estimated time: 60 min placeholder per subtask until Mark and Elizabeth set it.
- Offsets, the step list, Mark's reels review, Worlds coverage for subtasks, the 10/02/26 additions, and Editing Status dependencies go to Elizabeth; she replies with what to build.
- Verify on the scratch copy: rule-created subtasks keep assignee and relative date through Save as template.

## Scope
- System: Asana project template "Discover La Jolla MM/DD/YY" (1207669495602552, Production team). Users: Mark, Alyza, Patrick, Gerald, Michelle, Elizabeth.
- Process of record: Miro "Discover La Jolla Production Process" (uXjVHpFIGFs=), plus the task descriptions.
- Change: each shared task handed around by the Editing Status reassign rule becomes separate per-person tasks. Each is assigned when the project is created, with a dependency on the step before, and with a built-in Revisions task.
- Baseline: the current template (Brett, 2026-09-29). The old template stays untouched for comparison.
- Done when: a template "Discover La Jolla MM/DD/YY v2" exists, a test project created from it shows the split tasks with the right assignees, dependencies and descriptions, the Worlds and Production Task Overview rules still fire, and the old template is unchanged.

## Per episode (x4)

| # | Task | Assignee | Blocked by |
|---|---|---|---|
| R1 | Set up DLJ Ep. # Reels brief | Mark | none |
| R2 | Curate DLJ Ep. # Reels | Alyza | R1 |
| R3 | Cut + Edit DLJ Ep. # Reels | Patrick | R2 |
| R4 | QC DLJ Ep. # Reels | Alyza | R3 |
| R5 | Revise DLJ Ep. # Reels (complete if none) | Patrick | R4 |
| R6 | Manager Review DLJ Ep. # Reels | Mark | R5 |
| F1 | Set up DLJ Ep. # Full Episode brief | Mark | none |
| F2 | Edit DLJ Ep. # Full Episode | Gerald | F1 |
| F3 | Manager Review DLJ Ep. # Full Episode | Mark | F2 |
| F4 | Revise DLJ Ep. # Full Episode (complete if none) | Gerald | F3 |

40 tasks replace today's 8. They stay top-level tasks because rules (Add to Worlds, Production Task Overview) do not fire on subtasks. The existing 8 are rewritten as R3 and F2, so nothing is deleted.

## Build steps
1. Connector: create a scratch project from the current template (Production team).
2. Connector: rewrite the 8 existing tasks and create the other 32. Descriptions use the conventions format (Prerequisite, Done when, numbered steps), taken from today's text.
3. Connector: set assignees and dependencies (verify dependencies survive Save as template).
4. BW Office Chrome, on Brett's go: turn off the Editing Status reassign rule in the scratch project. Keep the other two rules.
5. BW Office Chrome: Save as template "Discover La Jolla MM/DD/YY v2" in Production.
6. Verify: create a test project from v2 and check the done criteria. Brett deletes the scratch and test projects (the agent never deletes).
7. Document: update production-flow-map.md; Miro board update is for Elizabeth.

## Fixes found along the way
- The reels description says Curating moves the due date +1 day; the rule does not.
- The Full Episode description says "Long Form Editing"; the option is "Editing Long Form".
- The Miro reels path has no Mark manager review; the rule and description do.
- Elizabeth's 10/02/26 project has FB/YT upload tasks and Premiere Week 4 and Wrap Up tasks that the template lacks (kept out of v2 per Brett).

## Open questions
See the thread: relative due dates, estimate split, Editing Status field, Elizabeth's review.
