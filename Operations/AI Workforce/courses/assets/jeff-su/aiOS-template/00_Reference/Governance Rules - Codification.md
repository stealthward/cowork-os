# Governance Rules - Codification

_How to write and place rules in this workspace. The core idea, that every rule lives in exactly one place, is in root `CLAUDE.md`. This file holds the mechanics. Does not contain fact-checking rules (see `Governance Rules - Verification.md`) or output rules (see `Governance Rules - Communication.md`)._

---

## Where a rule goes

When a new rule comes up, place it with this quick check:

1. About how your writing should sound? Put it in `Voice Principles.md`.
2. About how to create or place files? `File Creation Rules.md`.
3. About how memory works? `Memory System.md`.
4. About how to maintain the system itself? The matching `Governance Rules` file.
5. Specific to one area? That workstation's `CLAUDE.md`.
6. A new cross-cutting topic? A new file in `00_Reference/`, with a one-line pointer in root `CLAUDE.md`.
7. Only if it changes routing or the workspace's identity? Root `CLAUDE.md`.

---

## Rule or memory?

Two quick tests, in order:

- **Does it tell you what to do?** Look for "always," "never," "before X do Y," "default to." If yes, it is a rule and goes in a `CLAUDE.md` or a governance or reference file. A rule is a rule even if you phrase it as "I prefer."
- **Does it describe something that could change?** Contact details, project status, a tool's current name. If yes, it is context and goes in `MEMORY.md`.

---

## Writing a good rule

- **Delete-replace-add gate.** Before writing a new rule, principle, section, or reusable structure, check in this order: (1) search for the existing content this addition relates to, (2) delete or rewrite that content if it can carry the behavior, and (3) add a new entry only when nothing existing can do the job cleanly.
- **Memory follows the Memory System.** Use the delete-replace-add gate for rules, principles, SOPs, skills, and reusable structures. Normal `MEMORY.md` updates follow `Memory System.md`: add useful context, keep it concise, and preserve durable decisions or current context instead of treating them as pruning cleanup.
- **Minimal sufficient precision.** Use the fewest words that still tell Cowork exactly when to act and what to do. Name the trigger, the required action, and the exception if there is one. Cut decorative words, avoid soft verbs like "consider" or "try" unless the step is genuinely optional, and keep only details that prevent ambiguity.
- **Date every rule.** End each rule with `[YYYY-MM-DD]`, and a short origin if it came from a specific moment. Append a new date when you update it.
- **Put new behavior on its own line.** If a rule asks for something new (a new step, a break from the usual flow), give it its own bold header so it does not get lost inside a paragraph.

---

## Keeping CLAUDE.md lean

A `CLAUDE.md` holds identity, routing, workflow, and high-risk guardrails. Everything else moves to a reference file with a "read when" trigger. That is why heavy rule sets (file creation, memory, governance, voice) live in `00_Reference/` and not in root `CLAUDE.md`: the root file should stay short enough to load every session without crowding out the task.

**Root `CLAUDE.md` size cap.** Keep root `CLAUDE.md` short, roughly 300 lines or less. Before adding to it, check whether the content really belongs in a workstation `CLAUDE.md` (area-specific), a `00_Reference/` file (reference material), or `MEMORY.md` (changing context). When you do add something to root, remove or compress something of similar length so it does not creep.

**Order sections by the loading sequence.** Within a `CLAUDE.md`, order sections the way you read them: first what to do every session (read memory), then what the workspace is, then how to route, then governance, then how to produce work. Place a new section in the spot that matches its job, not at the bottom by default.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
