---
name: blueprint-strategy
description: "Branding Blueprint component skill 4: writes the Real Estate Branding Blueprint (the client-facing strategy for a signed real estate agent: Report Objective, Executive Snapshot, Brand Diagnosis, Brand Direction, Channel Strategy, Visibility Strategy, Phased Action Plan, Closing Direction) and its Cover Email, from the audit and Brett's discovery summary, then runs the QA pass. Run by the CMO, which writes in one pass from the full Blueprint Playbook standard; the editor checks hard rules, the fact-checker checks every fact. Use when Brett says 'CMO, write the Blueprint for <agent>', 'Branding Blueprint for', 'run blueprint-strategy', 'strategy phase for', 'here is the discovery summary for', or when the blueprint entry skill reaches the strategy stage. Do not use for the audit, the RTM Digital Brand Analysis, or the Discovery Meeting Agenda (blueprint-audit), portal bios (blueprint-portal-bio), website copy (blueprint-website-copy), Brett's own content strategy or a Real Talk or Five Star campaign (cmo content plan), technical SEO, or a content calendar."
---

# blueprint-strategy

_Branding Blueprint component skill 4 of 4. Built 2026-11-03 from the approved scope (Operations/AI Workforce/drafts/2026-10-14-branding-blueprint-scope.md) with the portal-bio and website-copy lessons applied from the start: the full Playbook is the standard (blueprint-structure.md, read in full, not a summary), the CMO writes in one pass, and every fact goes through the fact-checker. The GPT-era Blueprints are light examples only, never models (Brett, 2026-11-03). Personal Layer while Brett runs it; method is a Shared Core candidate. Model: inherits the caller (the CMO seat, opus tier), which writes the Blueprint; the editor runs on sonnet, the fact-checker on opus._

## Read first

From `.claude/blueprint/reference/`: blueprint-structure.md (all of it: the standard, Brett's changes, QA checklist, delivered layout), integrity.md, process.md (the spine; strategy never appears before this step), content-standard.md (roadmap model, platform roles, referral and retention engine), search-visibility.md (what the visibility findings mean and their limits). Skim portal-standard.md and website-standard.md only to point Phase 1 and the Channel Strategy at them. StoryBrand SB7, Three Spheres, and the 75/25 ratio are cited from `00_Resources/content-frameworks.md` (sections 11 and 12), never copied here.

## Inputs

The client folder: `Business Development/Branding Blueprint/<client>/` for an engagement, `Operations/AI Workforce/evals/blueprint-strategy/<YYYY-MM-DD>-<client>/` for a test. Read, in this order, whichever exist:

1. `discovery-summary.md` (Brett's discovery meeting summary; it wins on business model, goals, ideal client, differentiators, channel priorities, lead sources, desired perception)
2. `internal-brand-audit.md` and `manual-analysis.md` (the blunt findings, the social content audit, Brett's notes)
3. `rtm-digital-brand-analysis.md` (what the client has already been told; the Blueprint must not contradict it without saying why)
4. `discovery-agenda.md` (the open questions; each should be answered by the summary or named as open)
5. `intake.md`
6. `bio-facts.md`, `bios.md`, `site-facts.md`, `site-copy.md` (when they exist, the Blueprint agrees with them, and Phase 1 names them as ready)
7. `gather-pack.md`, `portals.md`, the AI search and social pull files (only to source a fact the audit cites)

**Required to start:** the Internal Brand Audit and the discovery summary. No audit: stop and route to blueprint-audit. No discovery summary in an engagement: stop and ask Brett whether discovery has happened (process.md: never introduce strategy before discovery).

**Test runs** never wait on client answers (Brett, 2026-10-30). Brett answers the discovery gate (Step 2) in place of the meeting; where he leaves an input to the CMO, the CMO writes a best guess from Confirmed facts, labeled Inferred (test). Nothing from a test goes to a client.

## Step 1: strategy facts sheet (CMO)

Write `strategy-facts.md`. When `site-facts.md` or `bio-facts.md` exists, start from it and carry every row with its source and status; never re-decide a row Brett already answered. Statuses as in blueprint-portal-bio: Confirmed; Portal-computed (range or floor only); Client claim, unconfirmed (not used); Conflict (not used); Inferred (test) in tests only.

Add the rows the Blueprint needs that the copy skills did not:

| Row | Feeds |
|---|---|
| Business model (solo, team, brokerage; who does what) | Diagnosis, Brand Architecture |
| Growth goal, 12 to 24 months (as stated, never a computed target) | Diagnosis, Phased Action Plan |
| Desired business mix (listings vs buyers vs other lines) | Snapshot, Positioning |
| Ideal client and primary market; adjacent markets | Snapshot, Brand Platform |
| Concrete differentiators (each with its source) | Brand Direction |
| Primary brand and supporting identities (agent, team, brokerage, side brands) | Brand Architecture |
| Lead sources and referral dynamics | Visibility, Phased Action Plan |
| Channel priorities: what the agent enjoys, will maintain, will drop | Channel Strategy |
| Desired market perception (in the agent's words) | Brand Direction, Closing |
| Real Talk's role, if any (what Real Talk produces or would produce) | Channel Strategy, Phase plan |
| Open conflicts from the audit (figures, roster, license, contact stack) | Phase 1 actions, Cover Email |

Below the table, list the gaps and conflicts and the audit's top findings that the Blueprint must answer.

## Step 2: discovery gate

Business model, growth goal, ideal client and primary market, at least one concrete differentiator, primary brand, and channel priorities are core inputs. In an engagement they come from `discovery-summary.md`; any that is missing or in conflict goes to Brett with the question tool (one question per gap, the best-sourced value first as the recommended option, "Ask the client" as an option), and the run stops until he answers. In a test, Brett answers these as the gate (one question each, the CMO's best guess from the audit, bios, and site gate first). A proof gap is minor: the Blueprint runs with Confirmed proof and Phase 1 names the gap as an action. Never fill a core input from inference outside a test (integrity.md).

## Step 3: write (CMO, one pass)

Read blueprint-structure.md again right before writing, then write `blueprint.md` yourself in one pass from `strategy-facts.md` and the audit findings.

- **Structure.** The eight required sections in order, each with its required sub-parts and the structured assets the standard names where they add clarity: Report Objective callout, Executive Snapshot table, Current vs Recommended Positioning table, Core Problem and Primary Opportunity callouts, Brand Platform table, Channel Role Matrix, Visibility Flywheel, Service Plus Geography table, Roadmap Overview, then per phase the Strategic Narrative, numbered Priority Actions (primary moves first), and Intended Outcome; Closing Direction as developed narrative; Recommended Next Step callout.
- **Density.** Tables and callouts lead; narrative carries only the strategy and its logic. Define each core idea once (Snapshot, positioning table, Brand Platform) and afterward reference it briefly and apply it. No fixed length; record what the run teaches under Run notes in blueprint-structure.md.
- **Diagnosis from evidence.** Every diagnosis line rests on an audit finding; cite the finding in `strategy-facts.md` or the audit, not in the client copy. Engagement is reported as observed, never as reach or ranking.
- **Phase 1.** Highest-leverage, most visible, easiest first: canonical contact stack, conflict resolution, portal bios (name `bios.md` as ready when it exists), Google Business Profile, service plus geography standardization, homepage headline (name `site-copy.md` as ready when it exists). Each open conflict from Step 1 becomes a Phase 1 action ("confirm which career volume figure is current"), never a value the Blueprint picks.
- **Social and content.** Channel roles from content-standard.md and the post-level social audit: the 75/25 balance, Three Spheres, the referral and retention engine, what to retire.
- **Real Talk's role.** The Blueprint is provided by Real Talk Media, so name Real Talk as the agent's strategic content partner: the partner that gives the platforms continuity, frequency, and consistency (Brett, 2026-11-03). State the role in Channel Strategy and the content phase; no pricing, packages, or sales language.
- **Potential, not becoming.** For every agent, say "potential" or "maximize the potential", never "what a property can become", and never "what the rules allow". Only when the agent's edge depends on what can be built (redevelopment, land, new construction), name the constraint as "zoning and local ordinances"; otherwise leave zoning out (Brett, 2026-11-03).
- **Voice.** Real Talk Media writing to the agent: third person about the agent, advisory, conclusive. Direct assertion, no contrast constructions, no "this matters because", no hedging verbs, varied sentences, no em dashes, no generic realtor adjectives, never "revenue share".
- **Compliance.** Team-name advertising, license display, brokerage identification, fair housing: name the governing body (for California, the DRE), recommend broker review, never interpret.
- Read each section aloud. If it re-argues something already established, cut it back to the application.

Then write `cover-email-blueprint.md` in Brett's voice (voice-principles.md), short, per blueprint-structure.md.

## Step 4: hard-rule check (editor)

Dispatch the editor on `blueprint.md` and the cover email: "Client-voice mode, blueprint-strategy", reference checklist = blueprint-structure.md (Tone section and QA checklist), facts file = `strategy-facts.md`. Hard rules only: no em dashes, no contrast constructions, no over-explaining phrases, no hedging verbs, no generic realtor language, no hashtags, never "revenue share", no technical SEO, every fact against the facts file. The cover email is also graded against voice-principles.md, since Brett sends it. Style and strategy are Brett's call. The CMO fixes what it flags.

## Step 5: fact-check (fact-checker)

Dispatch the fact-checker (`.claude/agents/fact-checker.md`) with `blueprint.md` and the cover email as the deliverable and, as its only sources, `strategy-facts.md`, `discovery-summary.md` (or the gate answers saved in `strategy-facts.md` for a test), the audit files, `intake.md`, and whichever of `bio-facts.md`, `bios.md`, `site-facts.md`, `site-copy.md` exist. It also checks that the Blueprint agrees with the bios and site copy. The CMO fixes every row it returns in one pass (correct the line, soften to a labeled inference, or cut), re-runs once, and carries anything still flagged to Brett as an open item.

## Step 6: QA pass (CMO)

Run the QA checklist in blueprint-structure.md item by item and record pass or fix for each in `qa.md`. Then, by script (`python -I` on `blueprint.md`):
- No em dash (count).
- Contrast constructions: grep for "is not", "isn't", "does not mean", "rather than" and read each hit.
- Over-explaining phrases: "this matters", "this is important", "this helps", "this allows", "this suggests", "this indicates".
- All eight section headings present, in order; Recommended Next Step present.
- Repetition: the five most repeated three-word phrases outside tables; any core phrase used more than four times gets cut back.
Fix, then re-run the script.

## Return

To Brett as a private Artifact page (root CLAUDE.md), linked in the message: the Blueprint in full, rendered in the delivered layout (cover, Snapshot tiles, numbered sections, tables, callouts); the cover email; the QA result; the editor's result; the fact-check result in one line (claims checked, flagged on the first run, open after the re-run); the facts the client must confirm before delivery; anything open. In the message: the link, the Recommended Next Step, the open items, and the approval through the question tool. On approval, render `blueprint.md` as a formatted .docx (docx skill) in the delivered layout to `_Outbox/YYYY-MM-DD-<client>-real-estate-branding-blueprint.docx`. Brett sends it; the skill never does.

If Brett edits the Blueprint before it goes to the client, run reconcile on his version; a writing lesson goes to blueprint-structure.md, anything else to cmo-memory.md.

## Status

For an engagement, update `status.md` in the client folder at each stop: stage, next step, what waits on Brett or the client. After approval, the next stage is Phase 1 execution (blueprint-portal-bio and blueprint-website-copy, if not already run).

## Never

Send, post, or contact anyone; write strategy before the discovery summary in an engagement; fill a core input from inference outside a test; use a figure, ranking, award, review, or credential not marked Confirmed (or a Portal-computed figure as anything but a range or floor); resolve a conflict by picking a value; contradict the approved bios or site copy; give technical SEO, legal, or financial advice; write a content calendar; put pricing, packages, or a sales pitch for Real Talk inside the Blueprint; write Brett's voice into the Blueprint (only the cover email is his).

## Logs

The CMO's run log (cmo-log.md: request, sources, gate result, sections produced, QA result, editor result, fact-check result, what went to Brett, could not verify) and the usage-log line. The editor and fact-checker print their log lines; the CMO appends them.

Editing this file: write money without a dollar sign followed by a digit ("50 million dollars"); the skill loader reads that pattern as an argument slot.

## Eval

`Operations/AI Workforce/evals/blueprint-strategy-eval.md`. First test: Jim McInerney, from the blueprint-audit run 3 folder (2026-10-16) plus the approved bios and site copy (blueprint-website-copy test 1), with Brett answering the discovery gate. Passing it completes "5 of 6: blueprint-strategy skill" in AI Workforce (CMO section).
