# Model Selection for Agents

_Written 2026-09-16. Prices from the Claude API reference cached 2026-06-24, first-party API rates per million tokens. Re-check before quoting a budget._

## The models

| Model | Input | Output | Use it for |
|---|---|---|---|
| Haiku 4.5 | $1 | $5 | Volume and narrow jobs: triage, classification, extraction, log parsing, data validation checks, first-pass filters |
| Sonnet 5 | $2 | $10 | The default worker: drafting, connector work, code edits, scheduled reports, most skills |
| Opus 5 | $5 | $25 | Planning, orchestration (a chief of staff that routes across lanes), judging and QA, anything touching money, legal exposure, or a client-facing decision |
| Fable 5.1 | $10 | $50 | The hardest reasoning only, at the top of a chain, when Opus failed the check. Never a default for an agent |

Output tokens cost five times input on every tier, so agents that write a lot cost more than agents that read a lot. Design workers to write short, structured output (a table, a JSON block, an exceptions list) and let a reporter agent turn it into prose only when a person will read it.

## The rules

1. **Cheapest model that passes the check wins.** Every agent gets a written check (an eval) before it gets a model upgrade. If Haiku passes, Haiku runs.
2. **Judge cost per completed task, not per call.** A cheap model that needs three retries is not cheap. Log tokens per run in the registry.
3. **Try effort before model.** Lower effort on a newer model often beats higher effort on an older one. For an agent that is too slow or too expensive on Sonnet, try lower effort before dropping to Haiku.
4. **Worker plus judge.** Put a cheap worker on the job and a more expensive judge on the output. The judge reads a small result, so it is cheap even on Opus.
5. **One model per lane where memory matters.** Prompt caching is model-scoped. An agent that re-reads the same big context every run should stay on one model.
6. **Money, legal, client-facing: Opus minimum.** Finance dashboards, escrow data that reaches a client, anything Felicia or Brooke acts on.
7. **Log the choice.** Every agent's model goes in systems-registry.md with the reason. Changing a model is a registry edit plus a Key Decisions line.

## Model contingency: never pin an agent to one model

Brett's rule (2026-09-17): every agent runs on the best model for its job at any given time, and nothing in the system depends on one model staying current. Courses are written against whatever was current when they were recorded (the AI-First Academy predates Fable 5.1). Their tiering is a shape, not a version.

1. **Agents name a tier, not a model.** Agent files use the aliases haiku, sonnet, opus, or inherit. The aliases resolve to the current generation, so a model release updates every agent without an edit. Fable sits above opus and is named only where an eval proved opus insufficient.
2. **One model map.** A short table in this file (below) records which model each tier resolves to today and when it was last checked. It is the only place a model name appears.
3. **Every model release triggers a review, not a migration.** Rerun the evals for every agent on the new generation. Promote, demote, or hold based on the result. Rerun the A/B/C task sort for each lane, because tasks that were "work alongside" may become "hand it off."
4. **The eval is the contract, not the model.** An agent is defined by its definition of good and its eval file. Any model that passes the eval at the lowest cost can run it.
5. **Log the model per run.** The usage log records the model that actually ran, so cost and quality changes after a release are visible, not guessed.
6. **Effort is the second dial.** Before moving an agent up a tier, try higher effort on the current tier; before moving down, try lower effort on the current one.
7. **No agent is load-bearing for another's model.** Prompt caching is model-scoped, so keep agents that share large context on the same tier, but never make one agent's correctness depend on which model another used.

### Model map

| Tier | Resolves to today | Checked |
|---|---|---|
| haiku | Claude Haiku 5.5 | 2026-10-13 (zoho-specialist seeded run) |
| sonnet | Claude Sonnet 5.5 | 2026-10-13 (zoho-specialist seeded run) |
| opus | Claude Opus 5.5 (session model; alias not tested) | 2026-10-13 |
| fable | Claude Fable 5.1 | 2026-10-13 |

Prices in "The models" are the 2026-06-24 rates for the prior generation; re-check before quoting a 5.5 budget.

## Where the model is set

- **Subagents:** the `model` field in the agent file's frontmatter in `.claude/agents/`. Options: haiku, sonnet, opus, fable, or inherit (uses the session's model).
- **Your own session:** the model picker in the desktop app. The session model is what "inherit" resolves to.
- **Scheduled runs and routines:** set in the task or routine configuration; default to Sonnet unless the job is a judge.

## Starting assignments (to be tested in Phase 2)

| Agent role | Model | Why |
|---|---|---|
| Copywriter (captions, carousels, newsletter, REACH promo) | Sonnet | Drafting in a defined voice with frameworks loaded; output is short |
| Content ops coordinator (Asana calendars, gaps, VA briefs) | Sonnet for briefs, Haiku for the read-only calendar checks | Connector work plus structured output; the checks run often |
| Editor (grades drafts against voice and frameworks) | Opus | Reads a short draft; a bad pass reaches clients and the team |
| Branding Blueprint skills (renamed from Brand Driver 2026-10-14; skills, not agents) | Inherits the calling agent | Context, not compute |
| Chief of staff (routes across lanes, later) | Opus | Planning and delegation |
| Inbox triage (already exists as a Cowork task) | Haiku or Sonnet if moved to an agent | Volume, classification |
