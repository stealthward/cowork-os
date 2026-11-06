# Workspace Templates - Skills

_The structural contract for a skill's SKILL.md. Read this before creating or materially modifying a skill. Does not contain skill install, packaging, or maintenance behavior (see `Skill Conventions.md`) or scheduled-task structure (see `Workspace Templates - Scheduled Tasks.md`)._

---

## Skill Creation Checklist

When you build a new skill, work through these steps in order:

1. Draft the SKILL.md using the template below. Write the source file to `97_Skills/<skill-name>/SKILL.md` (the canonical copy).
2. Include all six required sections. Add conditional sections based on what the skill does (see the table below).
3. Test the skill before installing: run a few real example inputs through it and confirm it triggers and produces the right output.
4. Package and install it through the Save-skill flow, per `Skill Conventions.md` > Installing a Skill.
5. Log the new skill in your records.

---

## Skill SKILL.md Template

```markdown
---
name: skill-name
description: >
  [What the skill does in one sentence. Then list specific trigger phrases,
  contexts, and casual phrasings that should activate it. Descriptions should
  lean slightly pushy to combat undertriggering: include phrases you might say
  even when you do not name the skill explicitly.]
---

# [Skill Title]

## Context Loading

[Which workspace files to read before doing anything, listed in loading order
with a one-line reason for each.]

Read these files before proceeding:
1. `[Workstation]/CLAUDE.md` - [what it provides: identity, workflow rules, editorial rules]
2. `[Workstation]/MEMORY.md` - [what it provides: accumulated context, logs]
3. `[Additional files]` - [reason]

## Workflow

[The core execution sequence as phases or numbered steps. Each step has a
clear verb, a defined input, and a defined output or decision point. Group
parallel operations explicitly.]

### Phase 1: [Gather / Analyze / Orient]
[Steps that collect information and assess the situation.]

### Phase 2: [Propose / Plan]
[Steps that present a plan for approval. This is the approval gate:
no changes happen until you confirm.]

### Phase 3: [Execute]
[Steps that apply the approved changes.]

### Phase 4: [Verify]
[Steps that confirm the changes landed correctly. Any skill that modifies
files should include a verification pass.]

## Output Format

[Define the exact structure of what you see when the skill runs. Include a
template or example. Specify section order, bullet format, and any labeling.
If the output is a file, specify the file type and naming convention.

For any skill that produces findings, recommendations, or a report, embed the
standard findings format directly here so the skill is self-contained:

Lead with a one-line summary (for example, "X action items, Y informational
findings"). Then present findings grouped by actionability, not severity.
Each finding uses this structure:

**[Number]. [Action-first headline: the conclusion or answer, not the problem]**

**Context:** One to three sentences grounding the finding.
**Proposed action:** One to three sentences describing the specific change.

The skeleton is constant (headline, then grounding, then forward-looking
specifics); the sub-labels flex by purpose:
- Default (audit, recommendation, diagnosis): Context, then Proposed action
- Plan walkthrough or preview: Context, then Expected outcome, then Key steps
- Tradeoff or options analysis: Context, then Options, then Recommendation

Informational findings (no action needed) use the same numbered headline plus
Context, but omit Proposed action.

When findings are grouped into sections, use one continuous number sequence
across the whole output; never restart numbering inside each group.]

## Constraints

[Concise, testable guardrails and things the skill must never do. Include
rationale only when it changes how the assistant should resolve an ambiguity
or tradeoff. Include any pre-output checks.]

## Edge Cases

[What to do when inputs are missing, ambiguous, or fall outside the normal
workflow. Each edge case: condition, then action.]
```

---

## Required and Conditional Sections

Every skill includes these six sections: **Frontmatter** (name plus description), **Context Loading**, **Workflow**, **Output Format**, **Constraints**, and **Edge Cases**.

Add these sections based on what the skill does:

| Condition | Add section |
|---|---|
| Skill modifies workspace files | **Approval gate** (an explicit phase between proposal and execution) |
| Skill produces content in your voice | **Voice reference** (pointer to `Voice Principles.md` and the owning workstation's editorial rules) |
| Skill operates within one workstation's domain | **Routing** (which workstation to load, stated in Context Loading) |
| Skill has bundled scripts or reference files | **Resources** table (file path plus a "read when" trigger) |

---

## Description Writing Guide

The description field is the primary triggering mechanism. Follow these rules:

1. **Lead with what, then when.** First sentence: what the skill does. Remaining sentences: when to trigger, including casual phrasings and edge cases.
2. **Be pushy.** Skills tend to undertrigger by default. Include trigger phrases you might say even without naming the skill (for example, "Also trigger when I just got off a call or share a transcript, even without saying 'meeting recap.'").
3. **Include negative triggers.** State what the skill does NOT handle and where to route instead (for example, "Do NOT trigger for meeting prep, or for scheduling meetings.").
4. **Keep it under 100 words.** A longer description dilutes the trigger signal, and every skill's description sits in context all the time.

---

## Structural Principles

**Keep only execution-critical rationale.** Omit course context, setup coaching, provenance, and user education from the skill body. A rationale earns space only when it changes an execution decision, ambiguity, or tradeoff.

**Approval gates go between analysis and execution.** The reliable pattern: gather information, present a plan, wait for approval, then execute. Never modify files without showing the plan first, unless the skill explicitly declares direct-execution mode.

**Verification is not optional for write-path skills.** Any skill that creates or changes files should re-read or re-check them afterward to confirm the change landed. This catches silent failures (dropped fields, partial writes) before they cause problems.

**Edge cases prevent the most expensive failures.** The skills that perform best in practice have the most explicit edge-case handling. Common categories: missing inputs, ambiguous routing, failed fetches, stale data, and cross-workstation dependencies.

**Context loading order matters.** Load the owning workstation's files first (identity and domain rules), then any cross-referenced files (for example, the Notion operations file before any Notion work), then project-specific files. This mirrors the workspace hierarchy: workstation context frames the work, cross-references add capability, project context narrows scope.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
