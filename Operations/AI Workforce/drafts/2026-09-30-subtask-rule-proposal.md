# Subtask rule: flexible version (proposed)

_COO, 2026-09-30. Answers the chief of staff handoff of 2026-09-29. Staged; nothing applied._

## Current wording (root CLAUDE.md, asana-conventions.md)

Subtasks are never assigned automatically when their master task is created. A subtask is assigned individually when it goes on a day or is scheduled in a campaign plan with Brett; the master task stays unassigned in its project and Brett clears it when every subtask is done.

## Proposed wording

A subtask gets an assignee and a due date only through one of three triggers:

1. **Day plan:** it goes on a specific day in Brett's day plan (chief of staff builds it, Brett approves).
2. **Campaign plan:** Brett approves a dated campaign plan in which every date is counted back from a sourced milestone (the REInvest pattern). Assignees and dates are set together in that approval, never one without the other.
3. **Status automation:** a project rule creates the subtask when a status changes and assigns it on creation (the Discover La Jolla v2 pattern). The rule is the approval; the conventions file lists which projects run one.

Otherwise a subtask has no assignee and no due date. The master stays unassigned; Brett clears it when every subtask is done.

## What changes

- Names the automation case, which the current wording does not cover and DLJ v2 already uses.
- Ties assignee and date together in campaign plans, matching "never assigned without a due date".
