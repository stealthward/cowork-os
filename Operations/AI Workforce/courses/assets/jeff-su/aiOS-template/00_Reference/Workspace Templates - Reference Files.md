# Workspace Templates - Reference Files

_The template for writing a new markdown reference file in `00_Reference/` or a workstation's Resources folder. Read before creating or editing a reference file. Does not contain SOP, skill, workstation, or project templates (see the sibling `Workspace Templates` files)._

---

## Reference File Template

Use this when creating any new reference file. Reference files vary in purpose, so this standardizes the structure, not the body. Every reference file includes the first five elements; the sixth is optional.

**1. Scope statement (top of file).**

```
# [File Title]

_[Three clauses: (1) Purpose: what this file contains, (2) Read trigger: when to read it, (3) Out of scope: what it does NOT contain, naming where that out-of-scope content lives.]_
```

The scope statement is the contract. During a later cleanup, every entry gets checked against it. Test: if a future session is unsure whether some content belongs here, can the scope statement alone settle it? If not, it is too vague, usually because the "does not contain" clause is missing.

The scope statement is the required purpose and trigger layer. Do not add separate `## Purpose` or `## Trigger` sections by default. Use them only when the file has an active workflow or future action that needs its own section.

**External discovery check.** The read trigger inside the file tells Cowork what to do after the file is already loaded. It does not prove a future session can find the file. Before calling a new reference file complete, confirm the trigger is discoverable from root `CLAUDE.md`, the owning workstation's `CLAUDE.md`, or another existing clear trigger. For topical or recurring-use workstation resources, add or update the smallest `CLAUDE.md` routing or Resources pointer that names when to read it.

**2. Section separators.** Use `---` between every H2 section so the file stays scannable.

**3. Entry format declaration.** When a section has three or more entries that share a shape (rules with dates, contacts with fields), declare the format once at the top of the section so new entries stay consistent.

**4. Sub-headers at eight entries.** When a section passes eight entries, add H3 sub-headers to group them. Add the grouping when the ninth entry arrives, not after the section becomes a catch-all. Numbered step-by-step lists are exempt.

**5. Footer.** Every reference file ends with one of: a relocation pointer (if content moved out), a provenance note (`[YYYY-MM-DD] Created. [YYYY-MM-DD] Last reviewed.`), or a `## Changelog` (for files that grow over time). The footer answers "when was this last touched, and what happened?"

**6. "See also" pointer (optional).** If the file has close siblings (files read together or sharing a boundary), add one italic line right after the scope statement pointing to them.

**Body order: actionable first.** When a file mixes things to act on with background and history, put the actionable content first and the background after a `---` near the end.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[2026-07-06] Added the external discovery check so new reference files are findable from the owning routing surface, not only internally triggered after load.`_
