# Workspace Templates - SOPs

_Template contract for operational SOP files. Read before creating or materially modifying an SOP in `00_Reference/` or an owning workstation's Resources folder. Does not contain reference-file, workstation, or project templates; those live in sibling Workspace Templates files._

_See also: the sibling `00_Reference/Workspace Templates - Reference Files.md` and `00_Reference/Workspace Templates - Workstations.md` | `00_Reference/File Creation Rules.md` (SOP routing and approval gate)._

---

## SOP File Template

Use this template for any operational SOP. An SOP is a repeatable procedure with a trigger, ordered steps, verification, and a defined output. Workstation SOPs live as standalone `[Process Name] SOP.md` files in the owning workstation's Resources folder. Cross-workstation SOPs live as standalone `[Process Name] SOP.md` files in `00_Reference/`.

### File-Level Structure

```
# [Process Name] SOP

_[Domain] SOP for [procedure]. Read when [trigger]. Does not contain [out-of-scope content and where it lives]._

_See also: `[Sibling File.md]` (optional, only when directly useful)._

---

## Purpose

[One sentence on what problem this procedure solves.]

---

## Trigger

[Specific event, request, cadence, or source signal that starts the procedure.]

---

## Scope

**Includes:**
- [What this SOP covers.]

**Does not include:**
- [What belongs elsewhere, with file pointer.]

---

## Inputs

- [Source material, access, files, account, or data needed.]

---

## Preconditions

- [What must be true before starting.]

---

## Steps

1. [Step with link if applicable]
2. ...

---

## Verification

- [Check that proves the procedure worked.]

---

## Outputs

- [Created, updated, sent, filed, or resolved artifact/state.]

---

## Exceptions

- [What to do when access, source data, platform state, or approval is missing.]

---

## Related Files

- `[Relevant file path]`

---

## Changelog

- [YYYY-MM-DD] File created.

---
```

### Conventions

- **File name = process name plus SOP.** Use `[Process Name] SOP.md`. Include platform, product, or qualifier in parentheses when it prevents ambiguity, e.g. `Run a Quarterly Email Campaign SOP.md`.
- **Title = process name plus SOP.** The H1 matches the file name without the `.md` extension. If the SOP is not final, prefix the H1 with `DRAFT:` and include the blocker under Preconditions.
- **Classify before creating.** If the artifact is context, standards, examples, reference data, or a loose checklist without verification and output, it is a Resource file, not an SOP.
- **H2 headings are the SOP contract.** Use only the H2 headings listed in File-Level Structure. Process phases, checklists, templates, or internal groupings belong as H3/H4 sections under the nearest required H2, usually Steps or Verification.
- **Provenance belongs in Changelog.** Dated migration notes, source-history notes, and old-path references belong only under `## Changelog`. Do not place dated history blocks between required SOP sections.
- **Steps are self-contained.** Someone following the SOP should not need to open another tool or page to complete the procedure. External parity pages are related files, not dependencies.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
