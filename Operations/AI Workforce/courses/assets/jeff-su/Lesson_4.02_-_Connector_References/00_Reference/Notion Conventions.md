# Notion Conventions

_Practical reference for working with Notion pages and databases inside Cowork. Read before any Notion search, read, write, or rule-capture task. It contains universal Notion handling rules: inspect before acting, draft before writing, use the right page surface, preserve formatting, and verify after changes. It does NOT contain private workspace architecture or prompts for teaching Cowork a specific database; database-specific conventions you generate with Cowork live in their own clearly labeled section at the end of this file, or in a dedicated reference file._

_Not every workspace uses Notion. Treat this file as optional connector guidance: use it only when Notion is part of your actual setup._

---

## Before Working In Notion

- **Confirm Notion is the right destination.** If the work belongs in a local workspace file first, draft or update the local file before pushing the useful slice to Notion.
- **Inspect the current page or database before changing it.** Fetch the relevant page, database, properties, templates, and views before creating or updating anything. Do not rely on memory or guessed property names.
- **Separate generic conventions from database-specific rules.** This file tells Cowork how to behave in Notion generally. Rules for a specific notes database, project database, CRM, or content calendar are generated after Cowork inspects that database, and they live in their own clearly labeled database-specific section at the end of this file, or in the owning workstation or a dedicated reference file for heavier setups.
- **Use safe test surfaces for experiments.** When trying a new Notion workflow, use a duplicated page, test database, or disposable workspace before touching important live pages.

---

## Database And Page Rules

- **Fetch the schema before every database create or property update.** Exact property names and option values vary by database. A page fetch can hide empty properties, so inspect the database schema before setting properties.
- **Use templates when they exist.** If a database has templates, choose the closest matching template before creating a page. If no template fits and the page structure matters, ask before creating from scratch.
- **Wait for templates to populate before editing body content.** Template-backed pages can populate asynchronously. Create the page, fetch it after the template lands, then replace or add content.
- **Set meaningful properties.** Status, type, owner, dates, and other select properties should not be left empty when the correct value can be determined. If the right value is unclear, ask instead of guessing.
- **Never overwrite a date or scheduling property the user already set.** If a date, publish, or scheduling property already has a value, leave it alone during page setup and workflow updates. If it looks wrong, ask instead of changing it. Change it only when the user explicitly asks.
- **Use page body for working content.** Do not use Notion comments for notes, logs, or durable working content. Comments are for collaborator review threads.

---

## Formatting And Linking

- **Draft before writing.** Before adding or changing Notion page content, produce the complete draft in chat and wait for approval. State the intended page, section, and placement.
- **Keep page structure scannable.** Use headings, dividers, callouts, bullets, and short sections so the page can be understood quickly. Do not dump long paragraphs into a database page when a structured layout would be easier to review.
- **Use page mentions for internal Notion links.** Prefer Notion page mentions over pasted local file paths or bare page IDs. Local workspace paths usually render as plain text in Notion.
- **Avoid bare filenames in prose when possible.** Notion may auto-link filenames with dots. Use a plain-English label, or wrap the filename in backticks when the exact name matters.
- **Preserve existing formatting patterns.** Match the page's current heading level, list style, and section rhythm unless the task is explicitly to redesign the page.

---

## Verification

- **Re-fetch after writes.** A successful write response does not prove the page looks right. Re-fetch the edited page or database row and verify the content, properties, relations, and formatting.
- **Verify relations and links.** Relations can fail silently when the target comes from a different workspace or incompatible database. Re-fetch after setting relation properties.
- **Spot-check bulk work.** After batch creates, migrations, or property updates, verify a few representative pages from the database view you actually use.
- **Report setup limits plainly.** If Notion is not connected, the database is unavailable, or Cowork cannot see templates or views, label the work as blocked or ask for a pasted/exported source. Do not imply live Notion access happened.

---

## Changelog

- [2026-07-10] Database-specific rules generated with Cowork may now live in a clearly labeled section at the end of this file, matching the Lesson 4.02 demo; a dedicated reference file remains fine for heavier setups.
- [2026-07-10] Added the never-overwrite-user-set-dates rule, propagated from Jeff's live workspace conventions.
- [2026-07-05] Created as the optional Notion connection reference for Module 4. Database-specific convention prompts stay in course demo resources, not in this shipped template file.
- _Add your dated notes here as you adapt this file._

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
