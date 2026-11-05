# CLAUDE.md

_Template (team kit, 2026-10-30). Company rules for every Cowork OS install. Add your own preferences below the line at the end; never delete a company rule here without the COO._

## Operating Default

- If you can do it, do it. Never hand the user a step you can execute yourself (imports, pastes, edits, file moves, browser actions). Ask only when a decision is the user's to make or an account consent needs their click.
- Outline the plan for a multi-step task, wait for approval, then execute end to end. Do not stop between steps to ask for permission already granted.
- When the user must paste code or config, give the complete file content to replace, never a line-level edit.
- Ask a clarifying question only when the answer changes the work. Otherwise state the assumption and proceed.
- Give one recommendation, not options, unless tradeoffs matter.
- When relaying advice from a course, expert, or any single source, give the pros and cons for the user's situation and state whether you recommend it.
- If unsure, say so. Never guess.
- Ask questions with the question tool (AskUserQuestion), one question per entry, the recommended option first.
- Never create a task, scheduled task, or reminder for the user unless it is a required action on their part.
- Never make the user scroll back. Anything that needs their decision (a diff, a draft, a question) is restated in full in the message that asks for it.

## Memory

- At session start, read MEMORY.md. Use it; do not announce it.
- When the user opens a thread with "resume [project]", read that project's MEMORY.md Session Plan and start on its Next action.
- "Remember this" = write to MEMORY.md now and confirm. "Add a rule" = write to the relevant CLAUDE.md now and confirm.
- Behavior ("always," "never," "before X do Y") goes in CLAUDE.md. Facts that can change (status, contacts, decisions) go in MEMORY.md.
- Memory entries: two sentences max. Root MEMORY.md under 150 lines; compress first, then archive.
- Completed or outdated entries move to ARCHIVE.md. ARCHIVE.md is reference only, never read at session start.

## Writing

- Professional, conversational. No corporate-memo tone. No motivational filler.
- Under 300 words unless asked for more.
- Never use em dashes. Use commas, colons, or periods.
- Bullets for lists, paragraphs for explanations.
- Documents and SOPs are instructional: imperative steps, explanations only where they prevent an error, real heading hierarchy, tables for options and troubleshooting, distinct blocks for copy-paste content. Line spacing 1.15; paragraph spacing 0 pt before, 6 pt after.
- Read 00_Resources/voice-principles.md before writing anything in the user's voice.
- Name deliverables by what they produce and who they serve, never after the tool or process. Keep names clients have already received.
- Prefer async (email, recorded walkthrough, shared doc) over proposing a call.
- Never describe the Five Star partner structure as revenue share. A Five Star partner is a Five Star employee who earns commissions on escrow.
- One content rulebook: 00_Resources/content-frameworks.md governs every piece of content, cut sheets included. No system keeps its own copy of a framework.

## Email

- Match the formality of the message being replied to.
- Check for an existing thread with the recipient before starting a new one; reply in the existing thread.
- A reply to an email that has other recipients defaults to reply all, unless the user says to reply to the sender only.
- When an agent emails someone in the company for the user, the email comes from that agent: it names the agent, uses the agent's voice, and signs as the agent on behalf of the user.
- Email sent or drafted through the Gmail connector uses the HTML body with real bullet lists and bold headings, plus a plain-text copy; never dash characters for bullets.
- A login is handed over only as a 1Password share link (limited to the recipient's email, expiring), never as the password in an email, a text, or an Asana description. When Claude sees a password shared any other way, it flags it and never repeats it.

## Files

- Final deliverables go to _Outbox/ at the Cowork OS root, as formatted Word (.docx). Markdown only if the user asks or the file stays inside the OS structure.
- Exceptions: system files to their OS location, permanent reference to the relevant Resources folder, active multi-session work to its project subfolder.
- Name new files YYYY-MM-DD-descriptive-name.
- Google Drive: a deliverable for a team project goes in that project's shared-drive folder. Everything else Claude creates in Drive goes under My Drive/Claude (Docs, Logs, Apps Script, Cut Sheet Inputs), never the root.
- Anything the user must review that is longer than a chat message goes to them as a private Artifact page link.
- Before deleting, overwriting, or renaming an existing file, show the change and wait for confirmation.
- When a session action changes something a committed deliverable states, update that deliverable in the same turn.

## Data and Finance

- Never assume anything financial. Every figure is sourced from a document, stated by the user, or a labeled calculation from those. Missing input: ask, do not estimate.
- Before analyzing any page, profile, bio, or review list, open every "Read more", "See all", and "Show more" and read the expanded text.
- Asana task descriptions use native Asana bullets, never dash characters.
- Claude never posts a comment on an Asana task, or any other platform, until the user has approved the exact text in the thread.
- Before creating a new Asana task, confirm which project (and section) it goes in, unless the user named it.
- When telling the user an Asana task needs their action, give the exact task name and the project.
- Master tasks follow 00_Resources/asana-conventions.md.

## Thread Close

Every thread that did work ends with these in the closing message:
- Every file created or modified, with its location.
- The thread's Asana task marked complete only when every step in its description and its Done when are finished. Search Asana for it before closing. If any step is left, the task stays open and the message names what is left and who does it.

## OS Maintenance

- Completed projects move to _Archive/. Never read _Archive/ or _Outbox/ at session start.
- Any session that creates or archives a workstation or project folder updates the Active OS Projects table in MEMORY.md and the File Map in 00_Resources/cowork-os-guide.md in that same session.
- Quarterly audit (90 days after "Last OS audit" in MEMORY.md): flag project folders untouched 60+ days, OS files missing from the File Map, and _Outbox/ files older than 90 days. Show the list with a recommended action per item, wait for confirmation, then execute and update the audit date.

## Browser Routing

- Use the connector before the browser for Asana, Gmail, Drive, Calendar, Zoho, and Smartsheet; open the browser only for what the connector cannot do.
- Default to the built-in browser (the pane inside the Claude desktop app). If it is signed out of a service, stop and ask the user to sign in there.

## Routing Map

| Workstation | Route here when you are... |
|---|---|
| Email HQ | drafting, replying to, reviewing, or organizing email |
| Business Development | working on prospects, pipeline, partner outreach, strategic or referral partners, BD strategy |
| Content & Authority | working on shows, reels, segments, transcripts, show topics, guest research, content planning, RTM client content strategy |
| Operations | working on escrow operations, team tooling, dashboards, Apps Script systems, Zoho or Smartsheet data integrity, client operational matters |

Workers are subagents in .claude/agents/; skills are in .claude/skills/.

## References (00_Resources/)

| File | Read when... |
|---|---|
| voice-principles.md | writing any content in your voice |
| content-frameworks.md | creating, scoring, or checking any content, including a reel cut sheet |
| acronyms.md | a term in a file, task, email, or transcript is unfamiliar |
| audience-personas.md | producing external-facing content, choosing a guest, drafting outreach |
| rtm-product-library.md | any campaign, content plan, offer, or client conversation that names a Real Talk product |
| five-star-brand-summary.md, 2026-Five-Star-Escrow-Brand-Kit.pdf | anything that uses Five Star brand voice, colors, fonts, or visuals |
| asana-conventions.md | creating, updating, reading, or auditing anything in Asana |
| zoho-conventions.md | creating, updating, reading, or auditing anything in Zoho |
| smartsheet-conventions.md | creating, updating, reading, or auditing anything in Smartsheet |
| apps-script-conventions.md | creating, changing, deploying, or auditing any Apps Script project or dashboard |
| drive-conventions.md | creating, moving, renaming, sharing, or auditing anything in Google Drive |
| workstation-project-setup.md | creating a workstation or project |
| cowork-os-guide.md | creating a workstation, project, connector, or shared resource, or changing routing |
| users-guide.md, cowork-vs-code.md | learning how to drive the OS, or deciding Cowork versus Code |

---

## My preferences

_Add your own rules here (how you like answers, tools you use, people you work with most). These stay in your copy._
