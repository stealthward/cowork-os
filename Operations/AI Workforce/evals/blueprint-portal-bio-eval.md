# Eval: blueprint-portal-bio

**What good looks like before a set of portal bios reaches Brett.**

**Owner:** Brett Ward
**Used by:** Brett, on the Jim McInerney test and every run until the skill passes; graded against the objectives below, never against a past output
**Version:** 1.2, 2026-10-30 (1.2: criterion 2 is the Playbook opening with a StoryBrand body, judged against the Woody Henderson example; criterion 5 follows the Playbook's light variance; 1.1: StoryBrand) (built from the Portal Optimization Playbook checklist in `.claude/blueprint/reference/portal-standard.md`, integrity.md, and the approved scope)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails
**Test runs save to:** `Operations/AI Workforce/evals/blueprint-portal-bio/<YYYY-MM-DD>-<client>/`

## How to score

Score each criterion 1 to 5. Reasoning first, then the number. If `bio-facts.md` is missing or cites no sources, mark "cannot assess" and send it back.

Who scores: criterion 1 is scored by the CMO from the fact-checker's result; Brett scores criteria 2 to 7. The CMO asks them in question boxes (AskUserQuestion), one criterion per question, in order: each states the CMO's score and reasoning and offers "Agree" first, then other scores. Then one box for the overall rating (useful, partly, noise). The CMO records the answers here; Brett never opens this file to score.

## Criteria

**1. Every fact sourced (weight 3)**
A 5: every fact in every bio traces to a `bio-facts.md` row marked Confirmed, or to a Portal-computed row stated as a range or floor; the fact-checker's re-run is clean. A 1: any fact with no row, a client claim or conflicted figure used unconfirmed, or a Portal-computed figure stated exactly without approval.

**2. Opening, StoryBrand body, and flow (weight 3)**
A 5: sentence 1 states market, role, and focus; sentence 2 a concrete differentiator with proof; sentence 3 the service model; the body turns to the client (hero) with the agent as guide; short paragraphs that read as natural prose, on a par with the Woody Henderson example (reference/examples/). A 1: the agent's résumé stacked, a template filled in, or copy Brett would call stiff. Failures seen (test 1, 2026-10-30): versions 1 to 3 opened "I am a La Jolla real estate agent" with no StoryBrand ("nowhere close"); version 5 forced six StoryBrand beats into 180 words and read as a template ("terrible").

**3. Specific, not generic (weight 2)**
A 5: the differentiator is concrete and from one of the five categories (marketing, negotiation, data, network, process); the risk reducer is specific and true; none of the banned phrases ("client-focused", "dedicated to service", "committed to excellence") or their cousins. A 1: copy that could describe any agent in the market.

**4. Business model accurate (weight 2)**
A 5: solo or team wording matches the profile type on each portal; nothing assumes seller-first, hyperlocal, solo, team, a backstory, or media presence the facts sheet does not support; team members named only from a current, confirmed roster. A 1: a team profile written as a solo agent, or a stale roster repeated.

**5. Cross-portal variance (weight 2)**
A 5: the versions are recognizably the same bio, varied only by the Playbook's allowed methods (reorder proof, rhythm, process wording, a slightly varied close, emphasis); every fact identical. A 1: a fact that changes between versions, or versions reworded so hard they lose the flow. Shared phrasing is not a fault.

**6. Audit useful (weight 1)**
A 5: the audit names what is weak, generic, inconsistent, or buried on each portal, the contradictions across portals, and what to fix first, each citing `portals.md`; the facts the client must confirm are listed. A 1: no audit, or findings without citations.

**7. Ready to post (weight 1)**
A 5: Brett would send these to the client after a light pass; first person (or as briefed); within 175 to 200 words or the portal's verified field limit, counted by script; tone fits the band (luxury understated, team structured, community warmer). A 1: Brett would rewrite.

## Automatic fails

- Any fabricated fact: a figure, credential, award, review, roster, or outcome not in a source
- A fact that differs between two portal versions
- A conflict resolved by picking a value instead of asking
- A core input (market, transaction focus, business model, differentiator, risk reducer) filled by inference instead of the facts gate
- Brett's voice or Brett's facts in a client's bio
- Any portal updated, anything sent, or anyone contacted
- An em dash in any bio

## Runs

| # | Date | Client | Brett's rating | Weighted | Notes |
|---|---|---|---|---|---|
| 1 | 2026-10-30 | Jim McInerney (from blueprint-audit run 3; Brett answered the facts gate, best guesses labeled) | Useful | 4.0, passed (1=4 CMO from fact-check, 2=4, 3=4, 4=4, 5=4, 6=4, 7=4; Brett agreed 2 to 7 in question boxes) | Versions 1 to 3 (old opening model) and 5 (literal StoryBrand beats, copywriter loop) rejected by Brett as "nowhere close" and "terrible". Rebuilt on the full Playbook with the Woody Henderson example; version 6 written by the CMO in one pass: editor hard rules PASS; fact-check 42 claims, 9 flagged and fixed, re-check clean apart from the approved P1/P2 guesses. Client questions: brokerage, Spindrift sale, team vs solo profiles, $365M personal or team |

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not the score. A writing lesson goes into portal-standard.md the same day; a fact the bios got wrong becomes a line under criterion 1 with the source type that failed.
