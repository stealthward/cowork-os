# Governance Rules - Verification

_How to check facts before you act, and how to run multi-step changes safely. Read before producing substantive output, reporting status, or running a migration. Does not contain rule-writing mechanics (see `Governance Rules - Codification.md`) or output rules (see `Governance Rules - Communication.md`)._

---

## Check before you assert

- **Read a file in full the first time.** When you open a file for the first time in a session, read all of it, not an arbitrary slice. A partial read can miss a rule that governs the task.
- **Do not trust memory for current status.** `MEMORY.md` is a cache, not the truth. Before reporting where a project stands, check the real source: the project's own files, and the live page if you track that work in a tool like Notion. Things change between sessions.
- **Verify before you ask or claim.** Before asking a factual question, filling in a placeholder, or stating a fact in output, check whether the workspace or a connected tool already answers it. This includes negative claims: before saying something is missing or undone, check the surfaces that would prove it.
- **Use the real thing, not a description of it.** When you need to know what is in a folder or file, look at the actual folder or file, not a snapshot or summary that describes it.
- **Start from what exists.** Before generating a deliverable from scratch, check whether a canonical version already exists (an SOP, a framework file, a prior approved answer) and build on it.
- **Always get the complete dataset.** When you analyze an inbox, folder, sheet, database, or content catalog, do not treat a sample as the full truth. Fetch all pages, bounded ranges, or relevant files when the tool allows it. If you can only inspect a sample, say that clearly before presenting findings.
- **Verify external system claims against current sources.** Before saying a tool, connector, app, platform, or API cannot do something, check current documentation, the available tools in the session, or another current source. Do not turn a stale assumption or one-session tool gap into a permanent rule.
- **Exhaust your tools before giving up.** If a file operation fails on permissions, look for an unlock tool or a documented workaround before concluding it cannot be done.

---

## Running multi-step changes

- **Check the blast radius first.** Before a change that touches root files, a `00_Reference/` file, a skill, a scheduled task, or three or more files, map what it affects (downstream pointers, rule conflicts, dead links) and propose the plan before executing.
- **Save important details as you go.** Write key facts from source material into the relevant `MEMORY.md` right away. A session can be interrupted at any time, and anything unsaved is at risk.
- **Fix a rule gap at the highest level it applies.** When a failure traces to a shared rule, fix it in the shared file so every workflow benefits, not just the one where it surfaced.
- **Apply a correction everywhere.** When you fix one instance of a mistake in a multi-step job, check the steps you already did and the ones still ahead for the same mistake.
- **Update your source of truth first, then any copy.** When the same content lives in two places, change the main copy first, then update the other to match.
- **Verify after each migration step.** After moving files, confirm the destination is correct before deleting the source.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
