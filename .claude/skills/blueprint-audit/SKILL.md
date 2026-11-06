---
name: blueprint-audit
description: "Branding Blueprint step 1: audits a real estate agent's public footprint and produces the Internal Brand Audit (with the mandatory post-level social content audit through Apify), then, after Brett's manual analysis, the client-facing RTM Digital Brand Analysis, the Discovery Meeting Agenda, and the Cover Email. Run by the CMO; the research-sidekick gathers. Use when Brett says 'CMO, run the blueprint audit for <agent>', 'brand audit for', 'internal brand audit', 'RTM Digital Brand Analysis for', or when the blueprint entry skill reaches the audit stage. Do not use for the Real Estate Branding Blueprint itself (blueprint-strategy), portal bios (blueprint-portal-bio), website copy (blueprint-website-copy), Brett's own content or profiles (copywriter), or Real Talk and Five Star company marketing."
---

# blueprint-audit

_Branding Blueprint component skill 1 of 4. Built 2026-10-14 from the approved scope (Operations/AI Workforce/drafts/2026-10-14-branding-blueprint-scope.md). Personal Layer while Brett runs it; method is a Shared Core candidate. Model: inherits the caller (the CMO seat, opus tier); the sidekick runs on its own tier (sonnet) and the fact-checker on opus._

## Read first

From `.claude/blueprint/reference/`: process.md, integrity.md, intake-template.md, search-visibility.md, social-audit.md and the platform files in social/ (instagram, linkedin, facebook, youtube), portal-standard.md (audit framework), website-standard.md (audit framework), content-standard.md (audit framework). From `00_Resources/content-frameworks.md`: sections 4.3 (headline components) and 11.1 (Three Spheres). The integrity rules bind every step.

## Inputs

The client's intake.md, in `Business Development/Branding Blueprint/<client>/` for an engagement or `Operations/AI Workforce/evals/blueprint-audit/<YYYY-MM-DD>-<client>/` for a test. If none exists, build it from intake-template.md with what Brett gives in the thread. Required to start: agent name, brokerage, primary market, website URL. Missing any of the four: ask in one message and stop.

A blind test (the Jim McInerney eval) uses only the agent's name, market, and public URLs; nothing Brett knows about the agent goes into the intake. Test runs skip Brett's manual analysis: after Stage B, go straight to Stage C, record `manual-analysis.md` as "None (test run)" unless the folder already holds Brett's notes, and return all of Stage C before asking for the rating (Brett, 2026-10-15; kept for all tests 2026-11-03). Engagements keep the Stage B stop.

## Stage A: gather (research-sidekick)

Dispatch the research-sidekick with the brief below, filled in. It returns a gather pack; it does not write the audit.

> Branding Blueprint gather for <agent>, <brokerage>, <market>. Intake: <path>. Read `.claude/blueprint/reference/integrity.md`, `search-visibility.md` (Google queries and the AI search check), `social-audit.md` section 1, and the Pull section of each platform file in `social/` first.
> 1. **Discover.** Find every public asset not in the intake (website service pages, Zillow, Realtor.com, Homes.com, brokerage profile, Google Business Profile, Instagram, Facebook, YouTube, LinkedIn, podcast; for TikTok note only the handle and last post date). List each URL as supplied or discovered, with how you confirmed it is the same agent.
> 2. **Read.** Fetch every website page in the main navigation, the GBP, and every other non-portal asset found in step 1 (press, interviews, directories, review sites, magazines, listing pages); a search snippet is never a read. Read every review the GBP pull returns in full. Expand every "Read more", "See all", "Show more", and "Show all" before capturing. For each: the full bio or hero copy as displayed (quote it), proof shown (years, volume, transactions, reviews with count and latest date), service and geography language, CTA, capture date. Portals (Zillow, Realtor.com, Homes.com) and the brokerage profile: list the confirmed URLs only; the CMO reads them in the browser. A non-portal page that blocks a fetch goes through Apify (official actor first, per social-audit.md section 1) before you call it inaccessible.
> 3. **Search.** Run the Google queries in search-visibility.md. Record each query, date, what appeared, and where the agent appeared.
> 3a. **AI search check.** Fill the five prompts in search-visibility.md from what steps 1 to 3 found (narrowest market, stated specialty, portal price band) and run them on apify/chatgpt-search-scraper and apify/gemini-search-scraper (official Apify actors only; never a third-party substitute). Save each surface's answers verbatim to <folder>/ai-search/<surface>-apify-<date>.md with run ID, dataset ID, prompt fill, sources, and cost.
> 4. **Social pull.** For every active platform in scope (Instagram, LinkedIn, Facebook, YouTube), run the Apify actors in its platform file over the window in social-audit.md. Read each actor's input schema first. Estimate the cost before running (a labeled calculation); stay under 5 dollars for the whole audit or cut the window and say so. Do not save or retype any dataset (you have no shell, and typed copies are not raw); the CMO saves them. For every Apify run in the gather (social, GBP, Google search, AI check, page actors), log the actor, run ID, dataset ID, items charged, and cost. An inactive or private account: say so with the evidence.
> 5. **Return** the gather pack: asset table (URL, supplied or discovered, accessible yes or no, capture date); copy and proof per asset; search and AI results; social pull summary per platform (handle, posts pulled, window, run ID, dataset ID, actual cost); conflicts between sources; "Could not verify". No analysis, no recommendations.

Save the pack as `gather-pack.md` in the client or test folder. Check it before Stage B: every intake URL accounted for, every active platform pulled or its gap named, the 10 AI answers saved verbatim with the prompt fill (or a surface named as not run), total Apify cost logged. A gap the sidekick could fix goes back once; a second miss is named in the audit.

**Raw save and metrics (CMO, after the pack is in).** For every dataset ID the pack lists, call get-dataset-items with a limit above its item count and save the response unchanged: social datasets to `social-pull/<name>-raw-<date>.json` (names: instagram-profile, instagram-posts, instagram-reels, instagram-reels-transcripts, facebook-page, facebook-personal, linkedin-profile, linkedin-posts, youtube), the rest to the folder root (gbp-place, gbp-reviews, google-serp, chatgpt, gemini). The harness writes a large response to a tool-results file and returns its path: copy that file. A small response returns inline: write it unchanged. Confirm each file parses and its item count matches the pack. Then run `python -I .claude/blueprint/scripts/social-metrics.py <folder> <capture date>` and save the output as `social-pull/social-metrics-<date>.txt`. Section 5 figures come from that file, and any 75/25 classification is written into `cmo-verification.md` as labeled CMO judgment. Both files are fact-checker sources.

## Stage A2: portal read (CMO, while the sidekick gathers)

Open each portal URL the sidekick confirms (Zillow, Realtor.com, Homes.com, brokerage profile) in the built-in browser, expand every "Read more", "See all", "Show more", and "Show all" first (integrity.md, Read the whole page), and capture, for each: name and brokerage as displayed, bio verbatim, proof shown (years, sales, volume, price range, reviews with count and latest date), service areas, license as shown, capture date. Save to `portals.md` in the client or test folder. A page that shows a sign-in wall or a bot check: stop, name it, never bypass it; Brett can open it himself. The built-in browser refuses realtor.com; read it in Claude in Chrome on the profile root CLAUDE.md names for the machine Brett is on, and close the tab after (Jim McInerney run 2, 2026-10-15).

## Stage B: Internal Brand Audit (CMO)

Write `internal-brand-audit.md` from the gather pack, `portals.md`, and the pulled datasets. Internal, blunt, operator-grade, substantial; every finding cites a URL, post, or file. Structure:

1. Executive Summary
2. Strongest Visible Brand Signals
3. Website and Messaging Observations (website-standard.md audit framework A to G)
4. Portal and Profile Observations (portal-standard.md audit framework A to F, one table row per portal, then findings)
5. Social Content Audit (per platform: the shared-core checks in social-audit.md section 2 and the platform file's checks; on every active platform, not only Instagram, a top five and bottom five with URLs and a hook score table for the top ten; then the section 3 output table and the cross-platform findings; content-standard.md audit framework A to H where the pull does not already answer it)
6. Google and AI Search Visibility (search-visibility.md criteria 1 to 9, with the AI check read across ChatGPT, Gemini, and the Google AI Overviews: who identifies the agent, who recommends them, what each says they are known for, which sources each leaned on)
7. Brand Clarity Gaps
8. Differentiation Gaps
9. Proof and Authority Gaps
10. Conflicts and Could Not Verify (source conflicts flagged for verification; inaccessible assets with the reason)
11. Manual Review Priorities (what Brett should look at himself, specific)
12. Next Input Request

Diagnosis only. Tactical notes for Brett are allowed in sections 5, 6, and 11; no positioning direction, no rewrites, no blueprint.

**Fact-check (fact-checker, before Stage B returns).** Dispatch the fact-checker (`.claude/agents/fact-checker.md`) with `internal-brand-audit.md` as the deliverable and, as its only sources, `gather-pack.md`, `portals.md`, `intake.md`, `cmo-verification.md`, the raw files in the folder root, and every file in `ai-search/` and `social-pull/`. The CMO fixes every row it returns (correct the line, cut it, label it as our estimate, or move it to section 10), then re-runs the fact-checker once on the fixed file. Anything still flagged after the re-run goes to Brett as an open item, never silently. Append the fact-checker's log lines (fact-checker-log.md, usage-log.md).

**Stop.** Return to Brett: the Executive Summary, the section 5 table, the Manual Review Priorities, total Apify cost, the fact-check result in one line (claims checked, flagged on the first run, open after the re-run), and the ask: "Add your manual analysis (website, social, transcripts, search, anything the first pass missed), or say 'none' to go straight to the client analysis."

## Stage C: RTM Digital Brand Analysis, Discovery Meeting Agenda, Cover Email (CMO)

Inputs: the Internal Brand Audit plus Brett's manual analysis (saved verbatim as `manual-analysis.md`). Where his observations conflict with the audit, his wins unless a cited source says otherwise; flag that case to him.

**RTM Digital Brand Analysis** (`rtm-digital-brand-analysis.md`): client-facing, third person about the agent, professional and non-abrasive, primarily narrative prose (each section opens with developed paragraphs; bullets only after the narrative to group examples). Sections:

1. Executive Diagnosis
2. Current Digital Brand Impression
3. Website and Messaging Clarity
4. Portal, Profile, and Public Search Consistency
5. Google and AI Search Visibility (restrained: easy to identify, market and service clear, profiles agree, proof visible, enough for an AI tool to recommend; no ranking or algorithm talk)
6. Social Presence and Content Themes (the client-facing reading of the social audit: cadence, mix, balance, what lands, consistency; cites posts sparingly)
7. Authority, Proof, and Differentiation
8. Key Gaps and Misalignments
9. Discovery Priorities

Copy examples only to prove a flaw or contrast weak with stronger language, never as rewrites. No recommendations, positioning, roadmap, or blueprint language. Internal tactical notes from the audit do not carry over.

**Discovery Meeting Agenda** (`discovery-agenda.md`): internal, short, conversation-friendly prompts on business model, differentiators, ideal client, 12 to 24 month goals, other media and channels, lead sources and referral dynamics, desired market perception, the visibility issues that need clarifying, and any issue unique to this agent.

**Cover Email** (`cover-email-analysis.md`): a draft for Brett to send from his own account. Read voice-principles.md first. Frames the document as a diagnostic, makes the next step clear, positions the discovery meeting as necessary before strategy is final, overstates nothing. Brett edits and sends; if he changes it, run reconcile on what he sent.

**QA before returning** (playbook 13 items that apply to this step): correct deliverable names; the audit is substantial enough to be useful; the Analysis is substantial enough to impress the client; nothing drifts into strategy; search section is not technical SEO; copy examples restrained; no assumption made where an input was missing; every fact traceable to the gather pack, a dataset, or Brett; no em dashes.

**Fact-check (fact-checker, before Stage C returns).** Dispatch the fact-checker with all three documents (`rtm-digital-brand-analysis.md`, `discovery-agenda.md`, `cover-email-analysis.md`) as deliverables and, as its sources, the fact-checked `internal-brand-audit.md` (a derived source: the fact-checker traces past it to the primary files), `manual-analysis.md`, `gather-pack.md`, `portals.md`, `intake.md`, and every file in `ai-search/` and `social-pull/`. The CMO fixes every row it returns, re-runs it once on the fixed files, and carries anything still flagged to Brett as an open item. The writer's own QA does not replace this step.

**Return** to Brett: the three documents in full (or the Analysis in full and the other two below it), the QA result in one line (including the fact-check: claims checked, flagged on the first run, open after the re-run), open conflicts for him to verify, and the ask to approve. On his approval, render the RTM Digital Brand Analysis as a formatted .docx (docx skill) to `_Outbox/YYYY-MM-DD-<client>-rtm-digital-brand-analysis.docx`; Real Talk report styling waits for brand-kit.md (built with blueprint-strategy), so until then use the docx defaults and say so.

## Status

For an engagement, update `status.md` in the client folder at each stop: stage, next step, what waits on Brett, Apify cost to date.

## Never

Send, post, schedule, or contact anyone; state a figure, ranking, review count, or fact the gather pack or Brett did not supply; run a paid pull over the 5-dollar cap without Brett's go; write a recommendation into the RTM Digital Brand Analysis; skip the post-level social audit without naming each platform and the reason.

## Logs

The CMO's usual run log (cmo-log.md: request, sources, sidekick result, fact-check results per stage, Apify cost, what went to Brett, could not verify) and usage-log line. The sidekick and the fact-checker print their log lines; the CMO appends them (the sidekick cannot append without reading the log, which on a blind run can carry notes on the agent).

Editing this file: write money without a dollar sign followed by a digit ("5 dollars"). The skill loader reads that pattern as an argument slot and swaps in a word of Brett's request (Jim McInerney run 3, 2026-10-16: the five-dollar cap loaded as "Diego.").

## Eval

`Operations/AI Workforce/evals/blueprint-audit-eval.md`. First test: Jim McInerney, blind. Passing it completes "2 of 6: blueprint-audit skill" in AI Workforce (CMO section).
