---
name: folder-cataloger
description: >
  Analyze a folder of files, propose a standardized naming convention, rename files, and generate
  an INDEX.md with metadata (descriptions, tags, suggested use cases). Use this skill whenever
  you say "catalog this folder," "catalog these," "name these files," "rename this folder,"
  "organize these files," "index this folder," or drop new files into an asset folder
  and want them named consistently. Also trigger when you share a batch of downloaded files
  (illustrations, templates, stock photos, icons, screenshots) and ask to clean them up or
  make them searchable. This skill applies to any folder with 3+ files that need consistent
  naming, not just illustration libraries.
---

# Folder Cataloger

## Context Loading

Before proposing changes, read or inspect:

1. The target folder listing, including file count, file types, current names, and existing subfolders.
2. Any existing `INDEX.md` in the target folder.
3. Existing filename patterns in the target folder.
4. The owning workstation `CLAUDE.md` and `MEMORY.md`, if the folder sits inside a workstation or project.
5. The owning project `CLAUDE.md` and `MEMORY.md`, if the folder sits inside a project.
6. `00_Reference/File Creation Rules.md` before creating or modifying files.
7. `00_Reference/Governance Rules - Communication.md` and `00_Reference/Voice Principles.md` before presenting the proposal.

If the folder is outside the workspace or in a synced external file system (cloud-synced drive), follow the synced-folder safety rules: copy then verify then delete for migrations, and no destructive action without explicit approval.

## Workflow

### Phase 1: Scan and Assess

1. List all files in the target folder.
2. Note file types, count, and current naming patterns.
3. Check for an existing `INDEX.md`.
4. If an `INDEX.md` exists, treat the task as an append operation and use the existing naming convention unless you ask to redesign it.
5. If files already follow a consistent format, propose reusing that format for new additions.

### Phase 2: Propose Naming Convention

The default goal is a convention that makes files browsable by description when sorted alphabetically, while preserving source attribution.

Default format:

```text
[description]--[source].[ext]
```

Rules:

- **Description first:** Use lowercase, hyphen-separated words. The description should pass the test: could someone find this file without knowing the original name?
- **Specific but not bloated:** Aim for 2 to 5 words before the source suffix.
- **Source suffix:** Use the double hyphen `--` to separate description from source metadata, such as `undraw`, `storyset`, `canva`, `screenshot`, or `unsplash`.
- **No hashes, default export names, or dates:** Leave version numbers and dates for `INDEX.md` metadata unless the content is inherently versioned.

Adapt the convention to the content type when needed:

| Content type | Format | Example |
|---|---|---|
| Illustrations or icons | `[description]--[source].svg` | `person-reading-book--undraw.svg` |
| Templates | `[topic]--[format]--[source].png` | `ai-tips--carousel--canva.png` |
| Screenshots | `[app]-[feature]--screenshot.png` | `notion-database-view--screenshot.png` |
| Stock photos | `[subject]-[mood]--[source].jpg` | `office-workspace-minimal--unsplash.jpg` |

Present the proposed convention in a table with 5 to 6 example renames before executing. Wait for approval.

If you give a naming preference, apply it. The convention should serve your browsing habits, not a theoretical ideal.

### Phase 3: Rename Files

After approval, rename files in a controlled batch. Verify the count before and after matches.

For large folders, batch the renames in groups of 20 and pause between batches if you want to spot-check.

### Phase 4: Create or Update INDEX.md

For new folders with no existing `INDEX.md`, create an `INDEX.md` at the folder root:

```markdown
# [Folder Name] Index

_Last updated: [date]_

**Source:** [where files came from, with URL if applicable]
**Naming convention:** `[the convention used]`
**[Any other relevant metadata about the collection]**

---

## Library

| Filename | Visual Description | Tags | Suggested Contexts |
|---|---|---|---|
| `filename.ext` | One-sentence description of what the file shows or contains | `tag1`, `tag2`, `tag3` | When you might use this file |

---

## Naming Convention Reference

[Document the convention so future additions stay consistent. Include format, rules, and examples.]
```

Column guidance:

- **Visual Description:** One sentence describing what someone would see. For non-visual files, describe the content instead.
- **Tags:** 3 to 5 lowercase, hyphenated keywords optimized for search.
- **Suggested Contexts:** Practical use cases tied to your work, such as a LinkedIn carousel, newsletter header, video visual, or reference lookup.

For existing folders with an `INDEX.md`:

1. Read the existing index.
2. Identify files not yet indexed.
3. Rename only new files using the existing convention.
4. Append new entries to the Library table in the same format.
5. Update the Last updated date.
6. Do not modify existing entries unless you ask.

### Phase 5: Add Read Trigger for New Folders

For new reusable folders, add a one-line pointer in the appropriate `CLAUDE.md` so the index gets loaded automatically in future sessions.

Pointer format:

```markdown
- **[Library Name]** -> `[path/to/INDEX.md]`. **Read when [trigger context].** Contains: [count] [file type] with [what the index provides].
```

Destination:

- If the folder is in a workstation Resources directory, add the pointer to that workstation's `CLAUDE.md`.
- If the folder is in a project Resources directory, add the pointer to the project `CLAUDE.md` or project `MEMORY.md` Sources of Truth, depending on how the project loads resources.
- If the folder is cross-workstation and belongs in `00_Reference/`, get explicit approval before adding or changing a root `CLAUDE.md` pointer, then re-read the edited pointer to verify it landed correctly.
- If unsure, ask.

For existing folders with an active read trigger, skip this step.

### Phase 6: Confirm

Summarize the number of files renamed, whether `INDEX.md` was created or updated, whether a read trigger was added, and the naming convention used.

## Output Format

Before execution, present:

**Proposed naming convention**
- **Format:** `[description]--[source].[ext]` or the adapted format.
- **Why this works:** One sentence tied to browsing and future reuse.
- **Example renames:** A table with current name and proposed name for 5 to 6 representative files.
- **Approval needed:** State that no renaming happens until you approve.

After execution, present:

**Folder catalog complete**
- **Files renamed:** [count]
- **INDEX.md:** Created or updated at `[path]`
- **Read trigger:** Added, skipped because it already exists, or not applicable
- **Naming convention:** `[format]`
- **Verification:** Count before and after, plus any skipped or unresolved files

## Constraints

- Do not rename files before you approve the convention.
- Do not auto-delete duplicates. Flag duplicate-looking files for you to decide.
- Do not invent visual descriptions for files that cannot be inspected.
- Do not replace an existing naming convention unless you approve the redesign.
- Do not modify existing `INDEX.md` entries in append mode unless you specifically ask.
- Do not use destructive move or delete operations in synced folders without copy-verify-delete and explicit confirmation.
- Do not add root `CLAUDE.md` pointers without explicit approval and post-edit verification.

## Edge Cases

- **Mixed file types:** Apply one convention unless file types need clearly different structures. File extensions already differentiate most types.
- **Files that cannot be analyzed:** Ask for descriptions rather than guessing.
- **Very large folder:** Propose the convention with examples, then rename in batches of 20.
- **Duplicate content:** Flag duplicates. Do not delete.
- **Existing index with stale format:** Flag the mismatch and recommend either append-only cleanup or a separate redesign pass.
- **Folder has fewer than three files:** Do not force this skill. A simple rename may be enough.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
