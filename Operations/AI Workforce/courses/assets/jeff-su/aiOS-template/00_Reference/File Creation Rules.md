# File Creation Rules

_Where new files go in this workspace, and when to ask before creating one. Read before creating any new file. Does not contain skill packaging or scheduled-task setup (see `Skill Conventions.md` and `Scheduled Task Conventions.md`)._

---

## Rules

### Core placement

1. **Route to a workstation, never to the root.** New files belong in a workstation folder, a project folder, `00_Reference/`, `97_Skills/`, or `98_Temp/`, never loose at the workspace root. Before every write, check that the path includes one of those. If nothing fits, ask.
2. **Temporary files go in `98_Temp/`; real files go straight to their home.** The test: does this file have a known permanent destination? If no, use `98_Temp/`. If yes, write it there directly, even if it is incomplete (mark it "DRAFT:" with a one-line note on what is unfinished).
3. **Give temp files a lifecycle header.** Every `98_Temp/` file starts with three lines: Purpose, Trigger (when to act on it), and Delete condition. If a future session needs to find it on its own, add a one-line pointer in the relevant `MEMORY.md` too.
4. **Ask before creating, and keep only what lasts.** Propose the file, its purpose, and where it lives, then get a yes. If something is a throwaway draft or one-time scratch, keep it in the conversation, not the workspace.

### Permanent homes

5. **Reference vs memory.** Reference material that does not change goes in a workstation's Resources folder. Context that accumulates (decisions, learnings, contacts) goes in `MEMORY.md`. Material used across the whole workspace goes in `00_Reference/`.
6. **Cross-workstation material goes in `00_Reference/`.** If three or more workstations would load a file, it is cross-cutting and belongs in `00_Reference/`. Below that, keep it in the main workstation's Resources folder, with pointers from the others.
7. **Group many sources behind a source index.** When one area collects several reference files for the same lookup, or a single source file gets very long, make a short "[Topic] Source Index" in that Resources folder that maps "for this question, read that file." It saves you from reloading everything to answer one thing. Build the index before piling on more raw files.
8. **SOPs are standalone files named `[Process Name] SOP.md`.** When a repeatable procedure has a clear trigger, ordered steps, and a defined result, save it as its own SOP file in the relevant workstation's Resources folder. Do not bundle several procedures into one file.

### Reference-file quality

9. **Reference files follow the template.** When creating or editing a reference file, follow `00_Reference/Workspace Templates - Reference Files.md`: scope statement with purpose, read trigger, and out-of-scope boundary; separators between sections; and a footer. Use separate Purpose or Trigger sections only when the file has an active workflow or future action that needs them.
10. **Make new reference files findable.** A read trigger inside a new reference file is not enough by itself. Before calling the file complete, confirm a future session can find it from root `CLAUDE.md`, the owning workstation's `CLAUDE.md`, or another existing clear trigger. If the file is a topical or recurring-use resource inside a workstation, add or update the smallest `CLAUDE.md` routing or Resources pointer that names when to read it.
11. **No open questions inside reference files.** Reference files are clean references. If something needs your input, ask in the chat; do not leave "TBD" or "for review" sections in the file.
12. **Name files so a listing alone identifies them.** A filename should tell you the file's area and contents without opening it. Rename a file when its content outgrows its name, and fix inbound pointers in the same pass.

### Project lifecycle

13. **Projects are time-bound.** When a project finishes: move anything with lasting value to the parent workstation's Resources folder, carry any open items into the workstation `MEMORY.md`, then move the project folder into that workstation's `Archive/` folder, not the root `99_Root Archive/`. On a synced drive, archive with copy-verify-delete: copy to the destination, confirm it landed, then delete the original.
14. **Keep durable project data in the project's Resources folder.** Data you will reuse across sessions (a spreadsheet, an export, a survey result) belongs in the project's Resources folder, not `98_Temp/`. Name it for what it is, and note the date when you refresh it.
15. **Replace an old file when a newer version arrives.** When you save a newer version of a file you already have, confirm the new file saved correctly, delete the old one, and fix any pointers to it. Do not leave two versions to drift apart.

### Sharing and archiving

16. **No personal info in files you would share.** Any file someone could download or copy into their own tools (templates, shared prompts) must contain zero real names, emails, phone numbers, addresses, or account details. Use realistic but fictional examples instead.
17. **Pull in documents your projects depend on.** When a file matters to an active project but lives somewhere you cannot read on demand (an email attachment, a file not synced locally), ask to save a copy into the project's Resources folder so future sessions can use it.
18. **Name archived files clearly.** Keep the original name and append `(archived YYYY-MM-DD, reason)` before the extension, so it stays findable and explains why it was archived.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[2026-07-06] Added Rule 10 requiring new reference files to be discoverable from the owning CLAUDE.md or another clear trigger before they are complete.`_
