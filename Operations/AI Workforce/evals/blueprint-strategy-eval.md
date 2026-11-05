# Eval: blueprint-strategy

**What good looks like before a Real Estate Branding Blueprint reaches Brett.**

**Owner:** Brett Ward
**Used by:** Brett, on the Jim McInerney test and every run until the skill passes; graded against the objectives below, never against a past output (the GPT-era Blueprints are light examples, not the bar)
**Version:** 1.0, 2026-11-03 (built from the Real Estate Branding Blueprint Playbook checklist in `.claude/blueprint/reference/blueprint-structure.md`, integrity.md, the approved scope, and the blueprint-portal-bio and blueprint-website-copy evals)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails
**Test runs save to:** `Operations/AI Workforce/evals/blueprint-strategy/<YYYY-MM-DD>-<client>/`

## How to score

Score each criterion 1 to 5. Reasoning first, then the number. If `strategy-facts.md` is missing or cites no sources, mark "cannot assess" and send it back.

Who scores: criterion 1 is scored by the CMO from the fact-checker's result; Brett scores criteria 2 to 8. The CMO asks them in question boxes (AskUserQuestion), one criterion per question, in order: each states the CMO's score and reasoning and offers "Agree" first, then other scores. Then one box for the overall rating (useful, partly, noise). The CMO records the answers here; Brett never opens this file to score.

## Criteria

**1. Every fact sourced (weight 3)**
A 5: every figure, credential, review, roster, and business-model claim traces to a `strategy-facts.md` row marked Confirmed (or Inferred (test) in a test, labeled), or to a Portal-computed row stated as a range or floor; every open conflict appears as a Phase 1 action, not a chosen value; the fact-checker's re-run is clean. A 1: any fact with no row, a conflict resolved by picking, or a differentiator invented.

**2. Strategy is right for this agent (weight 3)**
A 5: the positioning, ideal client, primary brand, and differentiators follow from the discovery inputs and the audit, and Brett would stand behind them in front of the agent; the Brand Platform is something the agent could approve and judge future work against. A 1: a generic position that could fit any agent in the market, or one that ignores what discovery said.

**3. Structure and assets (weight 2)**
A 5: all eight sections in order with their required sub-parts; Snapshot near the front; positioning table, Brand Platform, Channel Role Matrix, Visibility Flywheel, and Roadmap Overview used where they add clarity; each phase has narrative, ordered Priority Actions, and an Intended Outcome; Closing Direction developed; Recommended Next Step present. A 1: missing sections, a prose memo, or a bullet worksheet.

**4. Density and redundancy (weight 2)**
A 5: tables and callouts lead; each core idea defined once and then applied; no section re-argues the strategy; reads leaner than the GPT Blueprints without losing substance. A 1: the same positioning rationale restated in three or more sections, or long prose where a table would do.

**5. Actionable Phase 1 (weight 2)**
A 5: Phase 1 is the most visible, highest-leverage, easiest work, in order: contact stack and conflicts, portal bios (named as ready when approved), Google Business Profile, service plus geography standardization, homepage headline; the agent could start Monday. A 1: Phase 1 is vague, starts with a website rebuild, or leaves conflicts unaddressed.

**6. Channels, social, and visibility (weight 1)**
A 5: each channel's role comes from the audit and the agent's stated priorities; the social direction uses the post-level audit (75/25, Three Spheres, referral and retention) and says what to retire; visibility covers Google, portals, and AI readiness with a service plus geography standard; no technical SEO, no ranking claims; Real Talk named as the strategic content partner (continuity, frequency, consistency) without pricing or sales language. A 1: generic platform advice, technical SEO, or a content calendar.

**7. Tone (weight 1)**
A 5: confident advisory voice; direct assertion with no contrast constructions; no over-explaining or hedging phrases; varied sentences; no em dashes; the cover email sounds like Brett. A 1: instructional, academic, or hedged; repeated "It is not X. It is Y."

**8. Ready for the client (weight 1)**
A 5: Brett would send it after a light pass; the client finishes clearer and motivated to act; the delivered layout (cover, Snapshot tiles, numbered sections) holds up. A 1: Brett would rewrite.

## Automatic fails

- Any fabricated fact: a figure, credential, award, ranking, review, testimonial, roster, differentiator, or outcome not in a source
- A conflict resolved by picking a value instead of making it an action or asking
- A core input (business model, growth goal, ideal client and market, differentiator, primary brand, channel priorities) filled by inference in an engagement
- Strategy re-argued in every section (the Phased Action Plan or Closing Direction restating the diagnosis in full)
- A fact that contradicts the approved bios or site copy
- Technical SEO, legal or financial advice, or a ranking claim not observed
- Brett's voice in the Blueprint body, Real Talk pricing or sales language inside it, or "revenue share"
- Anything sent, posted, or anyone contacted
- An em dash anywhere

## Runs

| # | Date | Client | Brett's rating | Weighted | Notes |
|---|---|---|---|---|---|
| 1 | 2026-11-03 | Jim McInerney (from blueprint-audit run 3 plus the approved bios and site copy; Brett answered a seven-box discovery gate: Jim leads, goal 75 to 100 million dollars in new listings from the client, Instagram plus Discover La Jolla, perception in his wording, lead sources best guess, Real Talk as strategic content partner, listings lead) | Useful | 4.07, passed (1=4 CMO from fact-check, 2=4, 3=5, 4=4, 5=4, 6=4, 7=4, 8=3; Brett agreed with every CMO score in question boxes) | CMO one pass. Editor FIX 7, applied. Fact-check 59 claims, 19 flagged (team-listing reviews, engagement leaders, AI recommendation pattern, bios and site mismatches), fixed; re-run 58 supported, 1 no source, reworded as a role. Weak spots: Channel Strategy prose restates matrix rows; referral engine is a list, not a mechanism; bios and site copy need the listings-first lead and new wording. Files: evals/blueprint-strategy/2026-11-03-jim-mcinerney/; review page https://claude.ai/artifact/LiB4u5hYGvZf6a99iVdGkB |

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not the score. A writing lesson goes into blueprint-structure.md the same day; a fact the Blueprint got wrong becomes a line under criterion 1 with the source type that failed.
