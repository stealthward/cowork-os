---
name: blueprint-website-copy
description: "Branding Blueprint component skill 3: audits a real estate agent's homepage and service pages and writes new ones (homepage plus one service page per confirmed service focus, each with an SEO title and meta description) on StoryBrand, with the client as hero and the agent as guide, in the client's voice, from a sourced facts sheet. Run by the CMO, which writes the copy in one pass from the Website StoryBrand Playbook standard and the Christa Foss example; the editor checks hard rules, the fact-checker checks every fact. Use when Brett says 'CMO, write website copy for <agent>', 'homepage copy for', 'service page for', 'rewrite the website for', 'blueprint website copy', or when the blueprint entry skill reaches Phase 1 execution. Do not use for the audit or the RTM Digital Brand Analysis (blueprint-audit), portal bios (blueprint-portal-bio), the Real Estate Branding Blueprint (blueprint-strategy), Brett's own site or profiles (copywriter, brett-profile.md), technical SEO, site design or build, or Real Talk and Five Star company copy."
---

# blueprint-website-copy

_Branding Blueprint component skill 3 of 4. Built 2026-11-02 from the approved scope (Operations/AI Workforce/drafts/2026-10-14-branding-blueprint-scope.md), with the portal-bio rebuild lessons applied from the start: the CMO writes in one pass (Brett, 2026-11-02, replacing the scope's copywriter draft), the full Playbook is the standard, and one finished example sets the bar. Personal Layer while Brett runs it; method is a Shared Core candidate. Model: inherits the caller (the CMO seat, opus tier), which writes the copy; the editor runs on sonnet, the fact-checker on opus._

## Read first

From `.claude/blueprint/reference/`: website-standard.md (all of it), examples/website-christa-foss.md (the model of finished work: read it right before writing), integrity.md, process.md (deliverable names, tone), intake-template.md. The integrity rules bind every step. StoryBrand SB7 and the copywriting rules are cited from `00_Resources/content-frameworks.md` (sections 3.1, 7, 12), never copied here.

## Modes

| Mode | When | Produces |
|---|---|---|
| Audit | The agent has a live site and no audit of it exists, or Brett asks for an audit only | Site audit table and findings (website-standard.md audit framework A to G) |
| Rewrite | After the audit, when the agent has a site | Homepage and service page copy, each with an SEO title and meta description, saved as `site-copy.md` |
| Create | The agent has no site, or a page that does not exist yet (a new service page) | Same as rewrite, from the facts sheet alone |

An engagement runs audit then rewrite, and the copy comes after Brett's discovery call: no `discovery-summary.md` or `blueprint.md` means stop and ask whether discovery has happened. A standalone request or a test runs both once the facts gate passes, with Brett answering the gate in place of discovery.

## Inputs

The client folder: `Business Development/Branding Blueprint/<client>/` for an engagement, `Operations/AI Workforce/evals/blueprint-website-copy/<YYYY-MM-DD>-<client>/` for a test. Read, in this order, whichever exist:

1. `blueprint.md` (positioning, Brand Platform, audience, website direction; it wins over everything below on positioning)
2. `discovery-summary.md` (it wins on business model, differentiators, ideal client, risk reducer, workflow)
3. `intake.md`
4. `bio-facts.md` and `bios.md` (the portal facts and the approved bios; the site must agree with them)
5. `internal-brand-audit.md` (the website findings and section 10 conflicts)
6. `site.md` (each current page verbatim, with URL and capture date)

No `site.md`, or one older than 30 days: read the site yourself in the built-in browser (homepage, every service, buyer, seller, and about page in the main navigation; expand every control per integrity.md) and save a fresh `site.md`. A page that will not load: try apify/website-content-crawler, then name it as not read.

Test runs never wait on client answers: where discovery would supply an input, Brett answers the facts gate or the CMO makes a best guess, labeled Inferred (test); for proof in conflict, the most conservative figure the sources show. Nothing from a test goes to a client.

Required to start: agent name, brokerage, primary market, and the website URL or a statement that the agent has none. Missing any: ask in one message and stop.

## Step 1: facts sheet (CMO)

Write `site-facts.md`. When `bio-facts.md` exists, start from it: carry every row with its source and status, then add the rows the site needs that the bios did not. Never re-decide a row Brett already answered.

Same statuses as blueprint-portal-bio (Confirmed; Portal-computed, used only as a range or floor; Client claim, unconfirmed, not used; Conflict, not used). Cover every creation input in website-standard.md, plus three the site needs and the bios do not:

- **Service focuses** to give their own page (each must be Confirmed)
- **The agent's real workflow**, in their order, for the three-step process
- **Primary CTA**, and the CTA for each service page

Below the table, list the gaps, the conflicts, and the pages the run will produce.

**Facts gate.** Market, service focuses, business model, primary audience, one concrete differentiator, a true risk reducer, the real workflow, and the primary CTA are core inputs: if any is missing or in conflict, ask Brett with the question tool (one question per gap or conflict, the best-sourced value first as the recommended option, "Ask the client" as an option) and stop until he answers. A proof gap is minor: the copy runs with confirmed proof and names the gap. Never fill a core input from inference (integrity.md).

## Step 2: site audit (CMO)

When `internal-brand-audit.md` has a website section under 30 days old, carry it forward and add only what changed. Otherwise audit each page against website-standard.md A to G, one table row per area per page, then: what is weak, vague, or missing; the clarity, authority, differentiation, and conversion gaps; where the site contradicts the portals or Google Business Profile; what to fix first. Save it as the first section of `site-copy.md`. Blunt, internal, every finding cites `site.md`.

## Step 3: write (CMO, one pass)

Read `examples/website-christa-foss.md` and the Writing standard in website-standard.md, then write the homepage and one service page per confirmed service focus yourself, in one pass, from `site-facts.md` (Confirmed rows, Portal-computed rows as a range or floor, and in a test the Inferred (test) rows).

- **Shape.** The standard's seven homepage sections (hero, problem, authority, process, differentiation, risk reduction, closing) are the default, not a requirement: use fewer, merge, or reorder when the page reads better for this agent, as the example does. The hero and one clear next step are always there; any section left out is named, with the reason, in the return. Service pages follow the service page list and are more specific than the homepage.
- **Format.** Each page is a copy deck: the SEO title and meta description first, then each section labeled by its purpose (Hero, Problem, and so on), with H1 and H2 marked, body copy, button text, and where a testimonial or proof element goes. Testimonials are placed only from reviews in the facts sheet, quoted exactly with the source; otherwise mark "[testimonial: client to supply]".
- **Voice.** The agent in first person ("I" for a solo agent, "my team and I" or "we" for a team), matched to the intake's voice reference or, without one, the tone band for the business model. Never Brett's voice.
- **Hero.** Market, service, the client's problem, and the outcome, above one button. No slogan.
- **Problem.** The client's real stakes in this market, ideally as the questions they ask themselves (the example's late-night questions). No fear tactics.
- **Process.** Three steps from the agent's real workflow, named in their words. Never "clarity, strategy, execution".
- **Client's side first.** Open every section on the client's situation, question, or goal, never on the agent's résumé (website-standard.md). The guide section runs empathy, then the one detail only this agent has (let it explain how they work), then proof.
- **Search and AI.** Service plus geography in every H1 and SEO title, repeated naturally in the body. An FAQ only when it answers a real question from confirmed facts. Never mention search or AI mechanics.
- **Consistency.** Every fact matches `bios.md` when it exists.
- Read each page aloud before moving on. If a section would not hold up beside the example, rewrite it.

Save the copy to `site-copy.md` under the audit.

## Step 4: hard-rule check (editor, client-voice mode)

Dispatch the editor on `site-copy.md` with `site-facts.md` as the source, client-voice mode, hard rules only: no em dashes, no hashtags, no banned phrases or generic realtor language ("client-focused", "dedicated service", "committed to excellence", and their cousins), no slogan in a hero, no urgency manipulation, the business model wording, facts against the facts sheet. Style and flow are Brett's call. The CMO fixes what it flags.

## Step 5: fact-check (fact-checker)

Dispatch the fact-checker (`.claude/agents/fact-checker.md`) with the copy section of `site-copy.md` as the deliverable and, as its only sources, `site-facts.md`, `site.md`, `intake.md`, and whichever of `bio-facts.md`, `bios.md`, `blueprint.md`, `discovery-summary.md`, and `internal-brand-audit.md` exist. It also checks that every fact matches across the pages and against `bios.md`. The CMO fixes every row it returns in one pass (correct the line, soften it to a labeled inference, or cut it, keeping the copy natural), re-runs the fact-checker once, and carries anything still flagged to Brett as an open item.

## Step 6: CMO check

Run these yourself before returning:
- Title and meta length per page by script (`python -I -c` on `site-copy.md`): titles 60 characters or fewer, metas 155 or fewer.
- No em dash anywhere (grep).
- Service plus geography in every H1 and every SEO title (list them).
- One service page per confirmed service focus, none for an unconfirmed one.
- The three process steps match the workflow row in `site-facts.md`.
- Consistency: list the facts the site states; each matches `bios.md` and the facts sheet.
- Compliance: anything touching license display, team-name advertising, brokerage identification, or fair housing language is named with its governing body (for California, the DRE) and sent to broker review; never interpret the rule (integrity.md).

## Return

To Brett as a private Artifact page (root CLAUDE.md: anything longer than a chat message), linked in the message: the audit table and the fix-first line; each page's copy deck in full; the editor's result; the fact-check result in one line (claims checked, flagged on the first run, open after the re-run); the facts the client must confirm before the copy goes live; anything still open. In the message itself: the link, the fix-first line, the open items, and the approval through the question tool. On approval, render `site-copy.md` (copy only, no audit) as a formatted .docx (docx skill) to `_Outbox/YYYY-MM-DD-<client>-website-copy.docx`. Brett or the team publishes; the skill never does.

If Brett edits the copy before it goes to the client, run reconcile on his version; the lesson goes to website-standard.md (a writing-standard rule) or cmo-memory.md (anything else).

## Status

For an engagement, update `status.md` in the client folder at each stop: stage, next step, what waits on Brett or the client.

## Never

Publish, post, or change a live site; use a figure, review, or credential the facts sheet does not mark Confirmed (or a Portal-computed figure as anything but a range or floor); invent a testimonial or paraphrase one as a quote; resolve a conflict by picking a value; state a fact the bios contradict; write a service page for an unconfirmed service; give technical SEO advice (integrity.md out of scope); write Brett's voice into a client's site.

## Logs

The CMO's run log (cmo-log.md: request, sources, facts gate result, pages produced, editor hard-rule result, fact-check result, what went to Brett, could not verify) and the usage-log line. The editor and fact-checker print their log lines; the CMO appends them.

Editing this file: write money without a dollar sign followed by a digit ("5 dollars"); the skill loader reads that pattern as an argument slot.

## Eval

`Operations/AI Workforce/evals/blueprint-website-copy-eval.md`. First test: Jim McInerney, from the blueprint-portal-bio test 1 folder (its `bio-facts.md` and `bios.md` carry forward). Passing it completes "4 of 6: blueprint-website-copy skill" in AI Workforce (CMO section).
