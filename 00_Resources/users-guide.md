# Cowork OS User's Guide

_Shared Core, scrub before kit (2026-10-14; see Operations/AI Workforce/drafts/2026-10-14-shared-core-split.md)._

_Brett's day-to-day operating reference. The architecture lives in cowork-os-guide.md; this is how to drive. Written 2026-08-13, after the great cleanup._

---

## The One Rule

**Nothing durable lives in a chat.** Threads share nothing with each other except what is written to disk. If a decision, correction, or asset matters past the current conversation, it must land in a file in Cowork OS before the thread ends. Everything else in this guide is a consequence of this rule.

---

## Starting Work

1. Open a thread inside an app Project that pins the Cowork OS root (Cowork Config, Content & Authority, REACH, or any new one you create).
2. Name the workstation in your first message: "Working in Operations." Routing does the rest.
3. System work (rules, structure, context builds, skills) goes in a Cowork Config thread. Business work goes anywhere root-pinned.

## Where Files Go

Ask in order. First yes wins.

1. Is it a system file (CLAUDE.md, MEMORY.md, guide)? Its defined spot in the OS.
2. Will I pull from it months from now? The workstation's Resources folder (or 00_Resources if shared).
3. Is it part of active multi-session work with an end state? That project's folder.
4. None of the above? **_Outbox/.** One-offs never go in the OS proper.

## The Phrases

| Say | What happens |
|---|---|
| "Working in [workstation]" | Loads that workstation's rules and memory |
| "Remember this: ..." | Writes a fact to the right MEMORY.md immediately |
| "Add a rule: ..." | Writes a behavior rule to the right CLAUDE.md immediately |
| "Audit this session" | Sweeps the thread for unsaved decisions, corrections, preferences; proposes where to save each, prunes before it adds, and reports the root MEMORY.md line count |
| "Reconcile this" plus the version you actually sent | Diffs your final against Claude's draft and proposes the smallest rule change that would have prevented the miss; one-offs go to a calibration log and become rules only on a second occurrence |
| "Handoff" | Runs the audit, then writes what is still in flight (open approvals, next action, files touched) into the project MEMORY.md Session Plan so the next session starts without scrolling back |
| "Run the triage" | Fires the inbox triage (or use Run now on the scheduled task) |

## Ending Work

End any session that decided something with **"audit this session."** That is the write-back mechanism; skipping it strands the decision in chat history where no future session can see it. If the work is not finished, follow it with **"handoff"** so the next session starts from the project file.

## When a thread is done

A thread is a workspace, not a project. It is done when one of these is true, whichever comes first:

1. **The deliverable shipped.** The file, doc, or task the thread was opened for exists and Brett has it. Audit, then close.
2. **The topic changed.** The next thing to do belongs to a different workstation or a different project. Audit, handoff, and open a new thread there. One thread per job keeps the routing clean and the context small.
3. **It got long.** Claude starts summarizing earlier context, answers slow down, or Brett notices repeats. Audit, handoff, and start fresh. Nothing is lost: the durable parts are in the files and the in-flight parts are in the Session Plan.
4. **A usage limit or the day ends.** Same as above. Handoff before stopping, not after.

A thread that "feels like it could go on for a long time" is the signal itself. Long is not a problem; long without a handoff is. Rule of thumb: audit at every phase boundary, handoff whenever you would not want to explain the thread to a new session from memory, and never carry more than one project in one thread.

## Audit Best Practices

The audit is the safety net, not the primary capture. Capture in the moment with "remember this" and "add a rule"; the audit sweeps up what slipped through. A healthy audit comes back nearly empty.

Timing:

1. Every real work session, at the end, before closing. Skip only pure Q&A sessions.
2. Long sessions get mid-session audits at phase boundaries or every couple hours of dense work. Very long threads compress, and early decisions can fall out of reach by the end; an end-only audit can miss them.
3. Always audit before archiving anything.
4. Audit before a thread pivots to a different domain.
5. Never defer an audit to later. Later does not happen.

Approving: filter every proposed item with "would a future session act differently knowing this?" If no, skip it. A lean MEMORY.md beats a complete one; the 150-line ceiling is there for a reason.

---

## Projects: The Three Meanings

- **App Project**: a thread grouping in the Claude app. Organizes conversations, pins a context folder, stores no work.
- **OS project**: a time-bound folder inside a workstation (Real Talk Factory, 60-Day build). Has CLAUDE.md and MEMORY.md.
- **Satellite**: a deliberate claude.ai project (Finance Tools, Dashboards, The Factory). Registered in root MEMORY.md. Work there does not write back to the OS, so anything durable gets pushed to the OS deliberately.

## Creating New Things

- **New app Project**: pin the Cowork OS root at creation. The context folder is locked once created; a mispinned project gets recreated, not edited. Instructions stay thin: one or two lines of routing.
- **New OS project or workstation**: in the same session it is created, it gets registered: row in the Active OS Projects table in root MEMORY.md, entry in the guide's File Map. Say "create a project called X in [workstation]" and Claude scaffolds and registers it.
- **New satellite**: register it in root MEMORY.md's satellite table the day it exists. An unregistered satellite is invisible to the whole system.

---

## The Mistakes That Caused the Cleanup

1. **Pinning a subfolder** instead of the OS root. The session runs blind: no rules, no memory, no registry.
2. **Rules and facts in app Project instructions.** They belong in CLAUDE.md and MEMORY.md, where every session reads them. Instructions are for routing only.
3. **Unregistered satellites.** Months of work invisible to the rest of the system.
4. **Structure without registration.** A project folder existed on disk that no session knew about.
5. **Archiving before auditing.** Decisions locked in unreachable chat history. Always audit first, then archive.
6. **Parking durable files in _Outbox or one-offs in Resources.** Each dilutes what the other is for.

## What Runs Itself

- **Quarterly audit**: the first session more than 90 days after the last audit stamp will prompt you. It flags stale projects, unmapped files, and _Outbox items over 90 days. You confirm everything before anything moves.
- **_Outbox purge**: part of the quarterly audit. Anything older than 90 days is presumed deletable.
- **Current state**: never trust this guide for what is active; check root MEMORY.md (Active OS Projects, Business Priorities) and the systems registry (scheduled tasks, satellites). This guide is habits, not status.

---

_When in doubt: name the workstation, write it to disk, audit before you close._
