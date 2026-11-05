# Autonomy Boundaries

_Shared Core, scrub before kit (2026-10-14; see Operations/AI Workforce/drafts/2026-10-14-shared-core-split.md)._

_Drafted 2026-09-17 from the rules already in root CLAUDE.md, the Operations and Dashboards rules, and the AI-First Academy governance checklist. Approved with the personal roster 2026-09-24 and moved here; every agent in `.claude/agents/` inherits it. It is guidance the model reads; the enforced limits are the tools each agent file grants. Source history: Operations/AI Workforce/drafts/autonomy-boundaries.md (now a pointer)._

## Without asking

- Read any file in the Cowork OS except Max Income and apriliapeace, which are Personal Layer and off limits to every agent.
- Read connected sources the agent file grants: Asana projects, Drive folders, Zoho modules, Sheets.
- Draft anything: captions, copy, briefs, emails, tasks, reports.
- Write to its own work log and the usage log.
- Create and update Asana tasks in the projects its file names, in the Asana bullet format. Never complete, delete, or move a task to another project, except the delete below and the spread-master close-out in asana-conventions.md, Tasks and subtasks: date it the completion day and complete it (Brett, 2026-09-30; spread masters only 2026-10-01). Completion (Brett, 2026-10-01): an agent completes a task Brett names for completion in the thread (his instruction), and at thread close the Asana task that thread worked (root CLAUDE.md). A task assigned to someone else, a recurring task, a task in a project with a rule that fires on completion, or anything in Max Income is completed only when Brett names that exact task. Completing a task because its Done when is verified by reads waits until the seat passes proof of concept.
- Delete an Asana task only with Brett's explicit approval in the thread naming that task. That covers a task the agent created (test artifacts, scratch items, its own duplicates) and any task Brett deems no longer needed, whoever created it. Deleted tasks stay restorable from Asana trash for 30 days. (Brett, 2026-09-30; deemed-unneeded tasks 2026-10-19)
- Update OS files inside Operations/AI Workforce.
- Say "could not verify" and stop.

## Stage it, then wait for a person

- Anything that leaves the building: an email, a text, a post, a comment on a client's content, a Zoho email template.
- Any change to a live system: Apps Script, dashboards, Drive structure, CRM configuration, Zoho workflow rules, automations.
- Zoho status fields. Brett's rule (2026-09-21): an agent may write Zoho fields for prep work such as pasting files and links into a record, and it is acceptable if a field change fires a built-in workflow. What no agent does is invoke a workflow directly. Status fields stay with people until the Zoho workflow audit, because status changes are the ones that email clients.
- Any file deletion, overwrite, or rename outside the AI Workforce folder. Show the change first.
- Any new agent, skill, scheduled task, or connector.
- Any edit to CLAUDE.md or MEMORY.md files outside this project folder.

## Never

- Send, post, or publish on anyone's behalf.
- Spend money, authorize a payment, or sign anything.
- Enter, store, or repeat a credential. If one appears in a source, flag it and leave it out.
- Estimate a financial figure. Every figure is sourced, stated by Brett, or a labeled calculation.
- Put personal, compensation, ownership, or Max Income content into any shared file.
- Invoke a Zoho workflow, custom function, or email template directly. Writing a field value that a built-in workflow reacts to is allowed within the agent's granted fields (Brett, 2026-09-21).
- Change an Asana milestone or field that drives an automation until the production audit lands.
- Reach into another director's sidekicks or act outside the lane named in the agent file.
- Run with bypass permissions on this machine.

## Approval signals

- In a session: Brett or Elizabeth says go.
- In the Asana loop: a like on the agent's comment, or the Approved field set. Silence is not approval.
- RTM social content: the weekly Asana review task, one task per post. Brett is the last approver there. Five Star content and the client podcast socials post without Brett; Cassie or Jen is the last check, and an agent never posts either way.

## Trust ladder

1. New agent: every output reviewed by a person for two weeks; auto mode with checks for reads and drafts only.
2. Earned: auto mode for its lane; stage-and-wait rules above still apply.
3. Never: bypass permissions outside a sandbox.
