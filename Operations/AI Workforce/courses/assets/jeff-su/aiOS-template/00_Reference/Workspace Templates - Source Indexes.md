# Workspace Templates - Source Indexes

_Template contract for source index files in `00_Reference/`, workstation Resources folders, and project Resources folders. Read before creating or materially modifying a source index. Does not contain source-index creation triggers, general reference-file guardrails, or file-routing approval rules; those live in `00_Reference/File Creation Rules.md` and `00_Reference/Workspace Templates - Reference Files.md`._

_See also: `00_Reference/Workspace Templates - Reference Files.md` (general reference-file structural guardrails inherited by source indexes) | `00_Reference/File Creation Rules.md` (routing and approval rules for new files)._

---

## Scope

A source index is a lookup map that helps a future session choose among raw source files before answering, drafting, benchmarking, or auditing. Use one when you have several raw sources on a topic (transcripts, PDFs, exports, long reference files) and need a single surface that says "for this question, load this source first."

Source indexes are a specialized subtype of markdown reference file. They inherit all required structural elements from the reference-file template: scope statement, section separators, an entry-format declaration when needed, a sub-header trigger, a footer, and actionable-first body ordering. This template specifies the body layout that the general reference-file template leaves flexible.

---

## Source Index File Template

```markdown
# [Domain] Source Index

_[Domain or workflow] source index for [source family]. Read when [recurring lookup workflow or decision moment]. Does not contain [out-of-scope content and where it lives]._

_See also: `[Sibling File.md]` (optional, only when directly useful)._

---

## Scope

[One to three short paragraphs explaining what recurring lookup workflow this index supports, what source family it covers, and what it does not replace.]

---

## Entry Format

[Declare the shape for source coverage entries and use-case map entries before the first table.]

---

## Source Priority

1. [First source to check.]
2. [Second source to check.]
3. [Raw or external source to verify when needed.]
4. [Escalation rule when sources conflict or are missing.]

---

## Source Coverage

| Field | Details |
|---|---|
| Domain, product, source family, or artifact set | [Name.] |
| Source status | [Local available, connector fetch required, missing, future, archived, or superseded.] |
| First source to check | [Lookup surface before opening raw files.] |
| Raw source path | [Exact local path, connector-backed source, or external source note.] |
| Use when | [Decision moments that should load this source.] |
| Known traps | [Mistakes to avoid when answering from this source.] |

---

## Use-Case Map

| Use case | Start with | Then check | Avoid |
|---|---|---|---|
| [What you, a reader, or a workflow is asking about.] | [First source file and section anchor.] | [Secondary source for synthesis, if needed.] | [Fabrication, stale assumption, over-scoping, or wrong-source trap.] |

---

## Known Traps

- [Trap future sessions should avoid.]
- [Trap future sessions should avoid.]

---

## Related Files

- `[Relevant file path]`

---

## Changelog

- [YYYY-MM-DD] File created.
```

---

## Conventions

- **File name = domain plus Source Index.** Use `[Domain] Source Index.md`, where the domain names the recurring lookup workflow, not merely the first source that exposed the need.
- **Scope by lookup workflow.** A source index should answer "which source should I load for this question?" If the file only summarizes one source, it is a reference file, not a source index.
- **Do not duplicate raw source content.** The index maps sources, section anchors, source priority, and known traps. Raw scripts, transcripts, PDFs, exports, and long source files stay in their source locations.
- **Name source availability clearly.** Each source-coverage entry states whether the source is local, connector-backed, missing, future, archived, or superseded. If verification needs a connector or external account, say so.
- **Use stable anchors.** When a raw source file is long, point to stable H2 or H3 headings, module names, lesson names, or table sections. Do not rely on fragile line numbers unless the source format is stable.
- **Record traps as prevention, not commentary.** A known trap should name the wrong answer pattern and the source check that prevents it.
- **Update the index when the source set changes.** Adding, removing, renaming, archiving, or superseding raw source files triggers a source-index update in the same workflow.

---

## Template-Worthiness Rule

Source indexes justify a standalone template because they have repeatable structure beyond the general reference-file template: source priority, source coverage, use-case routing, and known traps. Do not use this precedent to create a new template for every Resources subtype. New standalone templates need the codification gate in `00_Reference/Governance Rules - Codification.md`.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
