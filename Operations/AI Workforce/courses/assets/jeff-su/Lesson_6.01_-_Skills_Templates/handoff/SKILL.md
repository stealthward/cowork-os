---
name: handoff
description: >
  Generate a structured session handoff summary so context transfers cleanly into a new session.
  Use this skill whenever you type "handoff," "session handoff," "hand off," "pass the baton,"
  "context transfer," "pick up where we left off," or say anything like "I need to continue this
  in a new session." Also trigger when you say "wrap up" and follow it with a request to capture
  context for next time, or when a session is hitting its limits and context needs to be preserved.
  Even if you just say "save this for next time" or "don't lose this context," this is the skill to use.
---

# Session Handoff

## Context Loading

Before writing a handoff, load the context needed to avoid duplicating or losing state:

1. Root `CLAUDE.md` and root `MEMORY.md`.
2. The active workstation `CLAUDE.md` and `MEMORY.md`.
3. The active project `CLAUDE.md` and `MEMORY.md`, if the session worked inside a project.
4. Any files modified during the session.
5. `97_Skills/session-audit/SKILL.md`, unless you explicitly say to skip the audit.
6. `00_Reference/Governance Rules - Communication.md` for copy-paste payload format.
7. `00_Reference/Voice Principles.md` before presenting the handoff.

If the session is compacted, use the compaction summary plus the modified-file list. Do not invent missing context.

## Workflow

### Phase 1: Run the Session Audit

Run the full `session-audit` skill first, unless you explicitly say to skip it. The audit closes open loops: codifies approved principles, updates stale memory entries, syncs progress trackers, and cleans leftover artifacts.

If you say "just the handoff, no audit," skip this phase and note any suspected uncodified items in the handoff's Session-only decisions section.

### Phase 2: Confirm the Clean State

After the audit, identify what still exists only in the current conversation:

- Mid-session decisions not written to workspace files.
- Open questions or unresolved tradeoffs.
- Files modified during the session.
- Proposed-but-not-approved changes.
- The exact next action for the new session.

Do not include context that is already safely captured in loaded `CLAUDE.md`, `MEMORY.md`, or resource files unless the next session needs the pointer to know where to look.

### Phase 3: Generate the Handoff Prompt

Produce one markdown code block using the Output Format below. Include only what was explicitly discussed in the current session. Do not infer, assume, pad, or write a narrative recap.

### Phase 4: Verify Copy-Paste Readiness

Before sending, check that:

- The output starts with a code block and contains no text outside it.
- The handoff starts with `## Session Handoff - [Date]`.
- Every section from the template appears in order.
- Every workspace file path is complete enough for the next session to verify.
- Empty sections use the specified "none" or "no changes" phrasing.
- The next action is specific enough that the new session can start without asking where to begin.

## Output Format

When the handoff triggers, produce a single clean block in this exact structure:

```markdown
## Session Handoff - [Date]

### Routing
- **Workstation:** [The workstation where the next session should start working]
- **Project:** [Active project subfolder, or "none" if workstation-level work]
- **Cross-loaded:** [Any other workstation CLAUDE.md/MEMORY.md files read, or "none"]

### Urgency
- **[Continuation required / Follow-up needed / Clean break]:** [One sentence explaining why]

### Core context
- [1-3 bullets: goal, project, and what was accomplished]

### Session-only decisions
- [Agreements, preferences, or constraints not yet written to workspace files]

### Already codified
- [Decisions or context written to workspace files, each with full relative path]

### Workspace changes
- [Files created, modified, deleted, or proposed but not approved]

### Open questions
- [Unresolved ambiguities, tradeoffs, or decisions explicitly deferred]

### What's next
- [1-2 bullets: exact next action for the next session]
```

If a section has nothing to report, use the appropriate empty-state line:

- `none`
- `No workspace files were modified this session.`
- `No files were created or modified.`
- `No open questions.`

The entire handoff must be wrapped in a single fenced code block because you copy it directly into the next session's first message.

## Constraints

- Run session-audit first unless you explicitly say to skip it.
- Only include what was explicitly discussed. Do not hallucinate context, infer unstated decisions, or pad sections.
- Use bullet points only inside sections. No prose paragraphs and no nested subsections.
- Put Routing first so the next session knows what to load.
- Spend the most care on Session-only decisions. These are the items most likely to be lost without the handoff.
- Keep bullets concise: one to two sentences each.
- Do not include content outside the code block.
- Do not reference tool-call history the next session cannot see. Translate it into file paths, decisions, and next actions.

## Edge Cases

- **You ask to skip the audit:** Generate the handoff directly and mark suspected uncodified items in Session-only decisions.
- **No workspace files changed:** Say so explicitly in Already codified and Workspace changes.
- **Session ended mid-task:** Use `Continuation required` and make the first What's next bullet the exact task to resume.
- **Task completed but follow-up remains:** Use `Follow-up needed` and name the remaining owner or destination.
- **Clean closeout:** Use `Clean break` and keep What's next to one low-friction future action or `No immediate action.`
- **Multiple possible next workstations:** Choose the workstation that owns the ongoing work, not the output format used in the ending session.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
