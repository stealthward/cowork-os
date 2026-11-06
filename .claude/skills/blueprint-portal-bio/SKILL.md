---
name: blueprint-portal-bio
description: "Branding Blueprint component skill 2: audits a real estate agent's portal bios and writes new ones for Zillow, Realtor.com, Homes.com, and the brokerage profile (same facts and positioning on every portal, varied phrasing), in the client's voice, from a sourced facts sheet. Run by the CMO, who writes the bios in one pass from the Portal Optimization Playbook standard and the Woody Henderson example; the editor checks hard rules, the fact-checker checks every fact. Use when Brett says 'CMO, write portal bios for <agent>', 'portal bio for', 'rewrite the Zillow bio for', 'blueprint portal bios', or when the blueprint entry skill reaches Phase 1 execution. Do not use for the audit or the RTM Digital Brand Analysis (blueprint-audit), website copy (blueprint-website-copy), the Real Estate Branding Blueprint (blueprint-strategy), Brett's own bios or profiles (copywriter, brett-profile.md), or Real Talk and Five Star company copy."
---

# blueprint-portal-bio

_Branding Blueprint component skill 2 of 4. Built 2026-10-30 from the approved scope (Operations/AI Workforce/drafts/2026-10-14-branding-blueprint-scope.md). Personal Layer while Brett runs it; method is a Shared Core candidate. Model: inherits the caller (the CMO seat, opus tier), which writes the bios; the editor runs on sonnet, the fact-checker on opus. Rebuilt 2026-10-30 after Brett rejected test 1 ("terrible"): the copywriter loop, a strict no-repeat variance rule, a literal six-beat StoryBrand order, and thin proof made the copy stiff (Brett: CMO on Opus, one pass)._

## Read first

From `.claude/blueprint/reference/`: portal-standard.md (all of it), examples/portal-bios-woody-henderson.md (the model of finished work: read it right before drafting), integrity.md, process.md (deliverable names, tone), intake-template.md. The integrity rules bind every step. Frameworks are cited from `00_Resources/content-frameworks.md`, never copied here.

## Modes

| Mode | When | Produces |
|---|---|---|
| Audit | The agent has live portal bios and no audit of them exists, or Brett asks for an audit only | Portal audit table and findings (portal-standard.md audit framework A to F) |
| Rewrite | Always after the audit, and for any portal with no bio (a create is a rewrite from nothing) | One bio per portal (Playbook opening, StoryBrand body), saved as `bios.md` |

An engagement runs both, and the rewrite comes after Brett's discovery call: no `discovery-summary.md` or `blueprint.md` means stop and ask whether discovery has happened (Brett, 2026-10-30). A standalone request ("portal bio for an existing client without a full Blueprint") or a test runs both once the facts gate passes, with Brett answering the gate in place of discovery.

## Inputs

The client folder: `Business Development/Branding Blueprint/<client>/` for an engagement, `Operations/AI Workforce/evals/blueprint-portal-bio/<YYYY-MM-DD>-<client>/` for a test. Read, in this order, whichever exist:

1. `blueprint.md` (positioning, Brand Platform, audience; it wins over everything below on positioning)
2. `discovery-summary.md` (Brett's summary of the discovery meeting; it wins on business model, differentiators, ideal client, risk reducer)
3. `intake.md`
4. `internal-brand-audit.md` section 4 and section 10 (the portal findings and the conflicts)
5. `portals.md` (each portal's bio verbatim, proof as displayed, capture date)

No `portals.md`, or one older than 30 days: read the portals yourself as blueprint-audit Stage A2 does (built-in browser, expand every control, Realtor.com in Claude in Chrome on the profile root CLAUDE.md names for Brett's machine, never bypass a bot check) and save a fresh `portals.md`.

Test runs never wait on client answers: where discovery would supply an input, Brett answers the facts gate or the CMO makes a best guess, labeled Inferred (test). For proof in conflict, the best guess is the most conservative figure the sources show (Brett, 2026-10-30). Nothing from a test goes to a client.

Required to start: agent name, brokerage, primary market, and at least one portal URL or a statement that the agent has none. Missing any: ask in one message and stop.

## Step 1: facts sheet (CMO)

Write `bio-facts.md`: one row per fact the bios may use, each with its value, its source (file and line, or "Brett" or "client" with the date), and a status.

| Status | Means | May a bio use it? |
|---|---|---|
| Confirmed | From the Blueprint, the discovery summary, Brett, or the client | Yes |
| Portal-computed | A figure the portal calculates (sales count, price range, review count and rating) as displayed on the capture date | Only as a range or floor ("more than", "hundreds of"), never an exact figure that dates, unless the client approves the exact figure |
| Client claim, unconfirmed | A figure or credential in the agent's own existing copy (an old bio, the website) | No, until Brett or the client confirms it |
| Conflict | Two sources disagree (years of experience, career volume, brokerage, team roster) | No, until resolved |

Cover every creation input in portal-standard.md: markets, transaction focus, business model, differentiators, proof points, risk reducer, audience or niche to emphasize, voice reference. Below the table, list the gaps and the conflicts.

**Facts gate.** Market, transaction focus, business model, one concrete differentiator, and a true risk reducer are core inputs: if any is missing or in conflict, ask Brett with the question tool (one question per gap or conflict, the best-sourced value first as the recommended option, "Ask the client" as an option) and stop until he answers. A proof gap is minor: the bios run with the proof that is confirmed and the gap is named in the return. Never fill a core input from inference (integrity.md).

## Step 2: portal audit (CMO)

When `internal-brand-audit.md` section 4 exists and is under 30 days old, carry it forward and add only what changed since. Otherwise audit each live bio against portal-standard.md audit framework A to F, one table row per portal, then: what is weak, inconsistent, generic, or underused; where proof is missing or buried; where profiles contradict each other (name, brokerage, team, years, volume); what to fix first. Save it as the first section of `bios.md`. Blunt, internal, every finding cites `portals.md`.

## Step 3: write (CMO, one pass)

Read the example in `examples/portal-bios-woody-henderson.md` and the Writing standard in portal-standard.md, then write one bio per portal (Zillow, Realtor.com, Homes.com, and the brokerage profile only where the agent has or will have one) yourself, in one pass, from `bio-facts.md`: rows marked Confirmed, Portal-computed rows as a range or floor, and in a test the rows marked Inferred (test).

- Shape: the four paragraphs in the Writing standard (Playbook opening, the client's side, how it works, soft close), 175 to 200 words.
- Voice: the agent in first person ("I" for a solo agent, "my team and I" for a team), matched to the intake's voice reference or, without one, the tone band for the business model. Never Brett's voice.
- Lead with the one detail only this agent has (the example's Navy pilot line); that is what keeps a bio from reading like a template.
- Write the Zillow version first, then derive the others by the Playbook's allowed variance methods only. The versions should read as the same bio.
- Read each bio aloud before moving on. If a sentence would not appear in the example, rewrite it.

Save the bios to `bios.md` under the audit, with word counts by script.

## Step 4: hard-rule check (editor, client-voice mode)

Dispatch the editor on `bios.md` with `bio-facts.md` as the source, client-voice mode, hard rules only: no em dashes, no hashtags, no banned phrases or generic realtor language, 175 to 200 words, the business model wording, facts against the facts sheet. Style and flow are not the editor's call on client bios; Brett judges those. The CMO fixes what it flags.

## Step 5: fact-check (fact-checker)

Dispatch the fact-checker (`.claude/agents/fact-checker.md`) with the bios section of `bios.md` as the deliverable and, as its only sources, `bio-facts.md`, `portals.md`, `intake.md`, and whichever of `blueprint.md`, `discovery-summary.md`, and `internal-brand-audit.md` exist. It also checks that every fact matches across the portal versions. The CMO fixes every row it returns in one pass (correct the line, soften it to a labeled inference, or cut it, keeping the sentence natural), re-runs the fact-checker once, and carries anything still flagged to Brett as an open item.

## Step 6: CMO check

Run these yourself before returning; none is a judgment the editor already made:
- Word count per bio by script (`python -I -c` on `bios.md`), never by eye.
- No em dash anywhere (grep).
- Variance: list the facts each version states; every version states the same set with the same values.
- Business model: team or solo wording matches the profile type on each portal (a team profile speaks as the team).
- Compliance: anything touching license display, team-name advertising, or brokerage identification is named with its governing body (for California, the DRE) and sent to broker review; never interpret the rule (integrity.md).

## Return

To Brett, in the message: the audit table and the fix-first line; each bio in full under its portal name with its word count; the editor's grade; the fact-check result in one line (claims checked, flagged on the first run, open after the re-run); the facts the client must confirm before the bios post; anything still open. Then ask for approval with the question tool. On approval, render `bios.md` (bios only, no audit) as a formatted .docx (docx skill) to `_Outbox/YYYY-MM-DD-<client>-portal-bios.docx`. Brett or the team posts; the skill never does.

If Brett edits a bio before it goes to the client, run reconcile on his version; the lesson goes to portal-standard.md (a writing-standard rule) or cmo-memory.md (anything else).

## Status

For an engagement, update `status.md` in the client folder at each stop: stage, next step, what waits on Brett or the client.

## Never

Send, post, or update a portal; use a figure or credential the facts sheet does not mark Confirmed (or a Portal-computed figure as anything but a range or floor); resolve a conflict by picking a value; state a fact in one portal's bio that another version contradicts; write Brett's voice into a client's bio.

## Logs

The CMO's run log (cmo-log.md: request, sources, facts gate result, editor hard-rule result, fact-check result, what went to Brett, could not verify) and the usage-log line. The editor and fact-checker print their log lines; the CMO appends them.

Editing this file: write money without a dollar sign followed by a digit ("5 dollars"); the skill loader reads that pattern as an argument slot.

## Eval

`Operations/AI Workforce/evals/blueprint-portal-bio-eval.md`. First test: Jim McInerney, from the blueprint-audit run 3 folder. Passing it completes "3 of 6: blueprint-portal-bio skill" in AI Workforce (CMO section).
