# Workspace Templates - Workstations

_Template contracts for creating AI Command Center workstations. Read this file when creating a workstation or checking a workstation's `CLAUDE.md`/`MEMORY.md` structure. Does not contain project, SOP, or reference-file templates; see the sibling `Workspace Templates` files for those._

---

## Workstation Types

Every workstation is one of five types. The type determines what CLAUDE.md additions and the kind of context likely to appear under the four MEMORY.md anchors. It does not change the required top-level structure: all workstations use the same six-H2 CLAUDE.md and four-H2 MEMORY.md shells.

| Type | Description | Example workstations |
|---|---|---|
| **Production** | Multi-phase content production lifecycles with editorial rules and resource libraries | LinkedIn HQ, Newsletter HQ, Dark Console Studio |
| **System** | Infrastructure, conventions, and cross-workstation standards | A Business Ops or workspace-operations workstation you build as needed |
| **Lifecycle** | Project lifecycles from intake through delivery | A campaign or event workstation you build as needed |
| **Communication** | Specialized voice/tone engines for written communication | Comms HQ |
| **Lightweight** | Personal or low-activity domains that accumulate context over time | Personal Finances, Health, Housing, Travel, Friends & Family, Clarity Partner |

Special case: Clarity Partner fits the Lightweight template with a custom Workflow section.

---

## Workstation Creation Checklist

When you ask Claude to create a new workstation subfolder, follow this checklist so nothing is missed:

1. Create `[Workstation Name]/CLAUDE.md` using the **Workstation CLAUDE.md Template** below.
2. Create `[Workstation Name]/MEMORY.md` using the **Workstation MEMORY.md Template** below.
3. Create `[Workstation Name]/[Workstation Name] Resources/` (empty, inside the workstation folder). It follows the naming convention `[Workstation Name] Resources/`. Do not create placeholder files.
4. Update the **Routing Map** table in root CLAUDE.md with the new workstation entry.
5. Add at least one **Cross-workstation tasks** example in root CLAUDE.md's Routing Rules showing how the new workstation interacts with an existing one.
6. Update the **Workstation Types** table at the top of this file with the new workstation in the correct type row.
7. **Post-creation verification (before declaring the workstation complete).** Re-read the new workstation's CLAUDE.md and MEMORY.md. Confirm the CLAUDE.md six-H2 structure, the MEMORY.md four-H2 structure, the `<!-- Type: ... -->` metadata comment in CLAUDE.md, and the Resources folder. Confirm the root Routing Map row, one useful cross-workstation routing example, and this file's Workstation Types row all landed.

To retire or change the type of a workstation later, follow the same logic in reverse: update the workstation's CLAUDE.md and MEMORY.md to the new shape, then update every wiring surface above (Routing Map, cross-workstation routing examples, and Workstation Types table). Keep the change to a single, well-scoped edit.

---

## Workstation CLAUDE.md Template

### Quick-Start Template

Use this for fast workstation creation. The Full Reference below has the detailed rules and type-specific additions.

```
# [Workstation Name]

<!-- Type: Production | System | Lifecycle | Communication | Lightweight -->

## Identity
<!-- Stable role and purpose. Who is Claude in this workstation? 1-2 paragraphs.
     Third person. No status, no changing facts. -->

## Scope & Routing
<!-- What belongs here, what does not, cross-workstation handoffs, and this
     workstation's partition dimension (channel, content type, framework,
     relationship pattern, or other) used to decide which Resources file to load. -->

Partition dimension: [channel / content type / workflow stage / relationship pattern / other].

| Request or trigger | Route | Load / handoff rule |
|---|---|---|
| Core [workstation] work | Stay in [Workstation Name] | Load the default workflow and relevant Resource Files below. |
| [Cross-workstation trigger] | [Other Workstation] | [When to hand off, and whether to return here afterward.] |

## References & Resources
<!-- Resource Files table (below) is required. Add `### External References` for
     Google Docs, Sheets, Drive folders, platform URLs, or dashboards. See
     Section Rules for when H3 subheads are required. -->

### Resource Files

| Resource | When to read | What it contains |
|---|---|---|
| _(none yet)_ | n/a | n/a |

## Workflow
<!-- Default working sequence: what to do first, what to load, when to branch,
     where detailed workflows live. Start with `### Default Session Sequence`.
     Add specialized workflow H3s afterward when needed. -->

### Default Session Sequence

1. [First action.]
2. [Load or verify the relevant source.]
3. [Proceed through the default workflow or route to the relevant specialized workflow.]

## Operating Rules
<!-- Domain decision rules, constraints, behavior rules, high-risk guardrails. -->

## Output Rules
<!-- Opens with: "Follow your voice principles in `00_Reference/Voice Principles.md`."
     Then domain-specific formatting, drafting, review, presentation, or delivery rules.
     Minimum 3 lines. -->
```

### Full Reference: Universal Section Order

Every workstation CLAUDE.md follows this section order. All six H2s are required; depth (H3, H4) flexes by workstation complexity.

```
# [Workstation Name]

## Identity                  (required)
## Scope & Routing           (required)
## References & Resources    (required)
## Workflow                  (required)
## Operating Rules           (required)
## Output Rules              (required)
```

Output Rules is always last because it is the final quality gate. Identity through Workflow define what work is being done; Operating Rules governs decisions inside that work; Output Rules governs how the produced artifact looks.

### Full Reference: Section Rules

**Identity** (required). 1-2 paragraphs. States Claude's role, the workstation's stable purpose, and what makes this workstation distinct. Written in third person ("Claude operates as..."). Should NOT contain changeable facts like counts, names, or current project status. Those go in MEMORY.md.

**Scope & Routing** (required). Starts with a short scope sentence, states the partition dimension, then uses the required routing table. The partition dimension is the axis used to decide which Resources file to load (channel, edition type, content type, etc.). State the dimension explicitly so future sessions don't have to infer it. Cross-workstation handoffs name the workstations work commonly flows to or from, and what triggers the handoff. Lightweight workstations still use the table, even if the only route row says "No routine cross-workstation routing."

**References & Resources** (required). The Resource Files table is required. Add an `### External References` table only when the workstation depends on non-local live surfaces such as Google Docs, Google Sheets, Drive folders, or platform URLs. Use H3 subheads when more than one table is present. When only Resource Files is present, the H3 subhead may be omitted. Resource Files are local workspace files; use exact workspace-relative paths where possible. The "When to read" column states the trigger; "What it contains" gives a brief summary so Claude can decide whether to open the file.

**Workflow** (required). Starts with `### Default Session Sequence`, then numbered steps for the default working sequence: what to do first, what to load, when to branch. Specialized workflows use named H3 subsections after the default sequence. The workflow shell carries sequence logic; decision rules and guardrails belong in Operating Rules.

**Operating Rules** (required). Domain decision rules, constraints, behavior rules, and high-risk guardrails. Use H3 subheads to organize when this section has 3+ distinct rule groups. Minimum 1 rule.

**Output Rules** (required). Always last. The final quality gate. Opens with: "Follow your voice principles in `00_Reference/Voice Principles.md`." Then layer domain-specific formatting, drafting, review, presentation, or delivery rules. Minimum 3 lines even for Lightweight workstations.

### Workflow vs. Operating Rules: Boundary Test

When unsure where a rule belongs, apply this one-line test: if the rule answers "in what order," it goes in Workflow. If the rule answers "in situation X, do Y," it goes in Operating Rules.

### Lightweight Workstation Accommodation

Workstations with thin content (Health, Travel, Personal Finances, etc.) still use all six H2s but can populate each with minimal prose. The shape is mandatory; the depth is not. Acceptable examples:

- A Scope & Routing section with one sentence, a partition dimension line, and a one-row table: "No routine cross-workstation routing."
- A References & Resources section with only a single row in the Resource Files table.
- An Operating Rules with one or two rules.
- An Output Rules with the Voice Principles pointer plus two or three personal-context rules.

The check is for presence of all six H2s, not depth within each.

### What NOT to Standardize

The six-H2 contract is mandatory and uniform. Customization happens through H3+ depth inside the right H2, not through adding or renaming top-level H2s.

- **Allowed:** rich H3/H4 structure inside Workflow, Operating Rules, References & Resources, or Output Rules.
- **Allowed:** omitting `### External References` if the workstation has no external live surfaces.
- **Not allowed:** a custom H2 that doesn't appear in the Universal Section Order. If content doesn't fit any of the six H2s, the rule needs reframing, not a new section.
- **Not allowed:** renaming a required H2 (e.g., "Editorial Rules" instead of "Output Rules"). The structure check looks for exact heading text.

---

## Workstation MEMORY.md Template

### Quick-Start Template

```
# [Workstation Name] Memory

_Last updated: [YYYY-MM-DD]_

<!-- Accumulated context for [Workstation Name].
     Domain-specific decisions, learnings, contact info, and patterns go here.
     Do not duplicate rules that belong in CLAUDE.md. -->

## Pending Updates

_None currently. Use this for unresolved edits, external parity checks, or follow-up items a future session must revisit._

## Contacts

_None currently. Use this for people, organizations, account owners, or relationship context that matters to this workstation._

## Current State

_None currently. Use this for active projects, live links, status notes, and workstation-specific context._

## Key Decisions

_None currently. Use this for durable decisions, rationale, and settled choices future sessions should preserve._
```

### Full Reference: Universal MEMORY.md Structure

Every workstation MEMORY.md uses the same four H2s in the exact order above: Pending Updates, Contacts, Current State, Key Decisions. Keep all four H2s even when empty, because they are visual anchors for people and future sessions. If a section has real content, remove that section's placeholder line. Flexible workstation-specific content lives as H3s or bullets under one of the four standard H2s, usually under Current State.

Custom H2s are strongly discouraged. Keep one only if it is clearly a durable top-level domain category that cannot be cleanly nested under the four-section shell.

Do not add `Rules`, `Workflow`, or `Conventions` sections to MEMORY.md. Prescriptive behavior belongs in CLAUDE.md or a Resource file.

### Standard Contact Format

```markdown
- **Name**: Role/Org. email@example.com. One-line context. (added YYYY-MM-DD)
```

### Type-Specific MEMORY.md Nesting

Type-specific content nests under the four H2 anchors rather than becoming custom H2s.

- **Production context** such as a Production Log, Editorial Learnings, or Resource Lookup usually lives as H3s under Current State. Durable learnings may live under Key Decisions.
- **System context** such as Audit History or active convention rollout status usually lives under Current State.
- **Lifecycle context** such as Pipeline Context or project history usually lives under Current State. Durable deal learnings may live under Key Decisions.
- **Communication context** such as sender overrides or communication patterns usually lives under Current State unless it has matured into a rule, in which case it belongs in CLAUDE.md or a Resource file.
- **Lightweight context** such as loyalty programs, properties, or personal logistics usually lives under Current State.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
