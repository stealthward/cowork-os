# Google Workspace Conventions

_Rules for how Cowork works inside your connected Google tools (Gmail, Google Drive, Google Calendar, Docs, Sheets). Read when a task touches any of these surfaces. It contains only conventions: the durable rules Cowork follows when reading, writing, or naming things in these tools. It does NOT contain connector setup steps (taught in the course), your inbox triage workflow (see `Comms HQ/Comms HQ Resources/Gmail Triage Workflow.md`), Notion conventions (see `00_Reference/Notion Conventions.md`), or your file-organization framework (see `00_Reference/Area-First PARA Framework.md`)._

_Product behavior changes. Before relying on connector limits or write behavior, check the current Cowork account settings and run a small test in the current session. Treat the conventions below as operating defaults, not a guarantee that the current UI is unchanged._

---

## Connector Basics

- **Connect only the live tools you actually use.** If the work lives in a platform you log into (Gmail, Calendar, Drive), Cowork needs a connector to reach it. If the work is a supported local file (a document, spreadsheet, or slide deck), Cowork can usually create or edit it directly. Do not connect tools just because they exist.
- **Default to one primary Google account.** Cowork connects to one Google account at a time, so Gmail means one connected inbox. Drive and Calendar are more flexible: the connected account can use shared folders and shared calendars it has permission to access. If files or calendars live in another account, share them with the connected account instead of scattering the workspace across multiple disconnected accounts.
- **Markdown files stay the source of truth.** Keep durable rules, working notes, and judgment in your `.md` files. Use connectors to read live surfaces and push only the useful slice (an event, a reply draft, a file) to the tool where it needs to be seen or used.

---

## Google Calendar

- **Use a calendar you can write to; don't stall on the choice.** For reads (availability, conflict checks), pull from every connected calendar. For writes, create events in a calendar you control. If you have more than one connected, put work events on your work calendar and personal events on your personal one; if only one is connected, just use it.
- **Give events specific, scannable names.** Lead recurring routines with a cadence tag in square brackets (`[Weekly]`, `[Monthly]`, `[Quarterly]`), use status markers when needed (`[Placeholder]` until the time is confirmed, `(Proposed)` for un-ticketed travel blocks or other option-comparison events, `[HOLD]` for tentative blocks), and name the person, event, or project plus the purpose (e.g., `Sam x Alex | Catch up`). Fill in the location when known and include any conferencing link or relevant URL.
- **Descriptions: up to five scannable bullets, context before logistics.** Write the description as a short bulleted or numbered list, five bullets maximum, so you can act without hunting through email: lead with the objective or context (what this is, why, who), then logistics (address, meeting link, agenda, prep notes, contact). A bold `Objective:` line plus a short numbered agenda is the standard shape for meetings; one or two bullets is enough for simple personal events. Use real line breaks (or a simple HTML list when writing through the connector), never literal `\n` characters, and after creating an event check that the description renders as separate lines. Never put information a guest already knows about themselves, or private reasoning, into a guest-visible description. On personal events with no guests (a birthday, a reminder), useful private notes are welcome; the description is for you.
- **Enable "Modify event" for guests.** When you add guests, turn on the "Modify event" permission so the other party can adjust the time without a back-and-forth.
- **Reminders work well as calendar events.** When you want a time-based nudge, a calendar event (with a scannable title, the date and time, and a one-line reason in the description) is usually more reliable than a buried task.

---

## Google Drive

- **File naming: date-first for point-in-time files, `Context - Descriptor` for living documents.** When creating, uploading, or saving any file to Drive, state the proposed filename as part of the placement proposal: point-in-time files (statements, receipts, invoices, exports, saved articles, scans) get `YYYY-MM-DD - Descriptor`, or `YYYY-MM - Descriptor` for month-scoped documents like statements; living documents (trackers, scripts, briefs) get `Context - Descriptor` with no date. Avoid vague version labels such as `final`, `new`, or `latest`; when distinct versions must coexist, use deliberate identifiers such as `v01`, `v02`, or an ISO date. Cowork can rename an attached file when saving or uploading it to Drive; include the proposed filename in the placement proposal and verify the saved result. An established folder-specific naming pattern overrides these defaults.
- **Folder naming and placement follow your file-organization framework.** Use `00_Reference/Area-First PARA Framework.md` to decide where files and folders live, and propose the destination before writing.
- **File-placement default.** If a verified Drive write path is available in the session and you approve the destination, the AI can place a file there and verify it before reporting done. If no write path is available, fall back to a handoff: the AI links you to the destination folder, links the local file, and tells you what to drop where.
- **Mounted Drive safety.** For writable mounted Drive folders, show the routing plan first, use copy/create by default, never move or delete without explicit approval after verification, then verify by re-listing the destination folder before reporting completion.
- **Use the right sheet path for precision.** If the current connector can read spreadsheet ranges directly, use a bounded range and verify row counts. If it cannot, export the sheet to `.xlsx` or `.csv` into a folder the AI can read, or paste the relevant rows into chat. Natural-language renders of large multi-tab sheets can silently drop or duplicate rows, so don't trust exact row counts from them; use a bounded range or single-tab CSV export for anything that needs precise numbers.

---

## Gmail

- **No Gmail drafts by default.** Keep email drafts in chat unless you explicitly ask for a Gmail draft. Recommend labels, snoozes, archives, and replies for review before applying them. The canonical guardrail lives in `00_Reference/Governance Rules - Communication.md` > Operational Guardrails > "No Gmail drafts by default." You confirm and send every outbound email.
- **Search by subject line, not just sender.** When you're looking for an ongoing thread, searching by subject (e.g., `subject:"Project Kickoff"`) is usually more reliable than a broad `from:` search, which can bury the thread you want below the results cutoff.
- **Meeting-notes summary emails are not transcripts.** Auto-generated meeting summary emails (from a notetaker bot) are compressed. The full transcript usually lives in a linked Google Doc. For real analysis, read the linked Doc, not the summary email, which loses tone, flow, and question quality.

---

## Google Docs

- **Markdown heading offset on paste.** When the AI produces markdown for you to paste into Google Docs, heading levels shift up by one: markdown `#` pastes as Heading 2, `##` pastes as Heading 3, `###` pastes as Heading 4. To land on the heading level you want in Google Docs, ask for one level higher in the markdown. So a document where Heading 2 = section dividers and Heading 3 = sub-points needs `#` and `##` in the markdown output.
- **Use the active write path, then verify.** Google Docs, Sheets, and Slides editing depends on the tools available in the current session. The Drive connector may only read or create files; Claude in Chrome or browser control may be able to edit a live Google app directly if it is connected and allowed for that site. Future connector updates may add more direct editing paths. For now, ask Cowork to check the available tools first. If it has a verified write path, tell it to make the edit and verify the file. If not, ask for paste-ready text, a new file, or mounted-Drive placement.

---

## Changelog

- [2026-07-10] Restructured the file to conventions only; added the Calendar line-break/render check, cross-platform Drive naming and attached-file rename handling, and the Area-First PARA pointer. The birthday rule is intentionally not shipped because Lesson 4.02 adds it live; guestless personal events may include useful private gift notes, while guest-visible descriptions still exclude private reasoning and redundant details.
- [2026-07-05] Repointed optional Notion handling to `00_Reference/Notion Conventions.md`.
- [2026-06-25] Clarified that Google Docs, Sheets, and Slides edits depend on the active write path, including connector writes, Claude in Chrome/browser control, mounted Drive placement, and paste-ready fallback.
- [2026-06-23] Tightened source-of-truth-to-surface behavior, mounted Drive copy/create safety, and Gmail review-before-action defaults.
- [2026-06-19] Renamed from Google Workspace Tips to Google Workspace Conventions; added the one-primary-account setup rule.
- [2026-06-16] Restored the no-Gmail-drafts pointer and removed "draft and queue" wording so this file matches the communication guardrail.
- _Add your dated notes here as you adapt this file._

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
