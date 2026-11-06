# Eval: blueprint-website-copy

**What good looks like before a set of website pages reaches Brett.**

**Owner:** Brett Ward
**Used by:** Brett, on the Jim McInerney test and every run until the skill passes; graded against the objectives below, never against a past output
**Version:** 1.1, 2026-11-02 (1.1: client's side first, criterion 2; 1.0 built from the Website StoryBrand Playbook checklist in `.claude/blueprint/reference/website-standard.md`, integrity.md, the approved scope, and the blueprint-portal-bio eval's lessons)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails
**Test runs save to:** `Operations/AI Workforce/evals/blueprint-website-copy/<YYYY-MM-DD>-<client>/`

## How to score

Score each criterion 1 to 5. Reasoning first, then the number. If `site-facts.md` is missing or cites no sources, mark "cannot assess" and send it back.

Who scores: criterion 1 is scored by the CMO from the fact-checker's result; Brett scores criteria 2 to 8. The CMO asks them in question boxes (AskUserQuestion), one criterion per question, in order: each states the CMO's score and reasoning and offers "Agree" first, then other scores. Then one box for the overall rating (useful, partly, noise). The CMO records the answers here; Brett never opens this file to score.

## Criteria

**1. Every fact sourced (weight 3)**
A 5: every fact on every page traces to a `site-facts.md` row marked Confirmed, or to a Portal-computed row stated as a range or floor; every testimonial is quoted exactly from a review in the facts sheet; the fact-checker's re-run is clean. A 1: any fact with no row, an unconfirmed claim or conflicted figure used, or a testimonial invented or paraphrased as a quote.

**2. StoryBrand and flow (weight 3)**
A 5: the client is the hero and the agent the guide; the problem comes before the solution, in the client's own terms; empathy before proof; the homepage uses the sections this agent needs from the seven (the hero and one clear next step always), and any left out is named with a reason that holds up; short blocks that read as natural copy, on a par with the Christa Foss example (reference/examples/). A 1: the agent's résumé as a homepage, the seven sections filled in like a form, or copy Brett would call stiff. Every section opens on the client's side; a section that opens on the agent's résumé caps this criterion at 3 (seen in test 1, 2026-11-02: every guide section opened on Jim's résumé).

**3. Hero clarity (weight 2)**
A 5: the hero names the market, the service, the client's problem, and the outcome above one clear button; no slogan, no empty adjective. A 1: a slogan or a headline that could sit on any agent's site.

**4. Specific, not generic (weight 2)**
A 5: the three steps are the agent's real workflow in their words; the differentiator is concrete, from one of the five categories, and would hold up beside a competitor; risk reducers are specific and true; none of the banned phrases or their cousins. A 1: "clarity, strategy, execution" or copy that could describe any agent in the market.

**5. Service pages (weight 2)**
A 5: one page per confirmed service focus and none for an unconfirmed one; each pairs service plus geography, names its audience and problem, outlines the process, carries proof and a CTA matched to its intent, and is more specific than the homepage. A 1: a missing page, an invented service, or a page that repeats the homepage.

**6. Search, AI, and consistency (weight 1)**
A 5: service plus geography in every H1 and SEO title and repeated naturally in the body; titles 60 characters or fewer and metas 155 or fewer, counted by script; no search or AI mechanics in the copy; every fact matches the portal bios and Google Business Profile. A 1: geography missing from the headings, lengths over, or a fact the bios contradict.

**7. Audit useful (weight 1)**
A 5: the audit scores each page against A to G, names the clarity, authority, differentiation, and conversion gaps and the contradictions with the portals, and says what to fix first, each citing `site.md`; the facts the client must confirm are listed. A 1: no audit, or findings without citations.

**8. Ready for the client (weight 1)**
A 5: Brett would send the copy deck to the client or their web designer after a light pass; first person as briefed; tone fits the band (luxury understated, team structured, community warmer); sections labeled so a designer can build from it. A 1: Brett would rewrite.

## Automatic fails

- Any fabricated fact: a figure, credential, award, review, testimonial, roster, or outcome not in a source
- A fact that differs between two pages, or between the site and the approved bios
- A conflict resolved by picking a value instead of asking
- A core input (market, service focuses, business model, audience, differentiator, risk reducer, workflow, primary CTA) filled by inference instead of the facts gate
- Brett's voice or Brett's facts in a client's site
- A live site changed, anything sent, or anyone contacted
- An em dash anywhere in the copy

## Runs

| # | Date | Client | Brett's rating | Weighted | Notes |
|---|---|---|---|---|---|
| 1 | 2026-11-02 | Jim McInerney (from blueprint-portal-bio test 1; site-facts carried bio-facts forward; Brett answered the site gate: three pages, best-guess workflow, schedule a consultation, audience sellers, buyers, and developers of luxury properties) | Useful | 4.0, passed (1=4 CMO from fact-check, 2=4, 3=4, 4=4, 5=4, 6=5, 7=4, 8=3; Brett agreed with every CMO score in question boxes) | CMO one pass. Editor FIX, 4 items (years and volume vs the gate, footer facts, redevelopment hero) plus two unsourced communication promises, all applied. Fact-check 57 claims, 7 flagged, fixed; re-run 56 claims, 1 flagged (office address), marked client to confirm. Weak spot (criterion 2): guide sections open on Jim's résumé rather than the client's side; the example leads with empathy. Copy: evals/blueprint-website-copy/2026-11-02-jim-mcinerney/site-copy.md; review page https://claude.ai/artifact/JfANCSkmr8QbRtCtHVfwRx |

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not the score. A writing lesson goes into website-standard.md the same day; a fact the copy got wrong becomes a line under criterion 1 with the source type that failed.
