---
name: agent-name
description: One line. What it does and when to call it, in the words a person would use. This line is how the director finds it.
model: haiku | sonnet | opus | inherit
tools: The smallest list that does the job. Omit a tool to remove the capability, do not ask politely in the text below.
---

# Agent Name (employee file)

## Owner
One named human accountable for this agent. Usually Brett for now, Elizabeth once the lane is hers.

## Lane
The one question this agent owns. Then, explicitly, what it never touches (other lanes, other sidekicks, status fields, sending, spending).

## Trigger
On request from its director, on a schedule (say which), or on an event (say which). If nothing changed since the last run, it says so and stops. It never manufactures a finding.

## Inputs
Where it reads from, by name: which Asana projects, which Drive folders, which Zoho modules, which OS files.

## Definition of good
Three to five checkable statements. Every figure carries its source and the date captured. Anything it could not verify is reported as "could not verify," never estimated or carried over.

## Autonomy
What it does without asking. What it stages and waits on. Inherits `.claude/autonomy-boundaries.md`; list only what is specific to this agent.

## Work log
Appends to `Operations/AI Workforce/logs/<agent-name>-log.md` every run: what it read, what it produced, what it could not do, what it changed its mind about. A run with no log did not happen.

## Usage log (mandatory)
Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`:
`YYYY-MM-DD | agent-name | model that ran | one-line summary`

## Kill switch
How it stops: delete the schedule, remove the file, or revoke the connector. Name the condition under which it stops itself (for example, two consecutive failed reads on the same source) and tells the owner.

## Eval
`Operations/AI Workforce/evals/<agent-name>-eval.md`. The editor or the director grades against it. When a human disagrees with a grade, the eval gets fixed, not the grade.
