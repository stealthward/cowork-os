# Eval: blueprint-audit

**What good looks like before an audit or analysis reaches Brett.**

**Owner:** Brett Ward
**Used by:** Brett, on the Jim McInerney blind test and every run until the skill passes; graded against the objectives below, never against a past output
**Version:** 1.3, 2026-10-15 (1.3: AI check run by the sidekick on official Apify actors for ChatGPT and Gemini; 1.2: prompts filled from the gather pack; 1.1: platform files, TikTok out) (built from the Real Estate Branding Blueprint Playbook section 13, the Portal, Website, and Content playbook checklists, and the approved scope)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails
**Test runs save to:** `Operations/AI Workforce/evals/blueprint-audit/<YYYY-MM-DD>-<client>/`

## How to score

Score each criterion 1 to 5. Reasoning first, then the number. If the outputs cite no sources, mark "cannot assess" and send it back.

Who scores (Brett, 2026-10-16): criterion 1 is scored by the CMO from the fact-checker's result (Brett does not cross-check sources himself); criterion 7 is pass or fail against the cost guideline, recorded by the CMO (5 = pass, 1 = fail). Brett scores criteria 2 to 6. The CMO asks them in question boxes (AskUserQuestion), one criterion per question, in order: each question states the CMO's score and reasoning and offers "Agree" first, then other scores. Then one box for the overall rating (useful, partly, noise). The CMO records the answers here; Brett never opens this file to score.

## Criteria

**1. Every finding sourced (weight 3)**
A 5: every observation in the audit cites a URL, post, dataset file, or Brett's manual analysis, with the capture date; quotes match the source. A 1: any claim with no source, or a source that does not say what the audit says.
Failure types seen (Jim McInerney run 2, 2026-10-15): an AI answer's source list misread (sources attributed to both surfaces when only one cited them); search positions overstated ("lead" for positions 3 and 5; "ahead of his website" when the site was not on page 1); a finding about review content drawn from reviews that were never read; general claims about agents as a group ("few agents," "rare among agents") with no source; on-camera presence asserted from captions alone; a CMO estimate stated as fact in the client Analysis; a directory listing matched on name only reported as a confirmed brokerage. Each costs the run a point on this criterion.

**2. Coverage of the footprint (weight 3)**
A 5: every intake URL and every discovered asset reviewed, or listed as inaccessible with the reason; website, each portal, brokerage profile, GBP, every active social platform, and search all present. A 1: an accessible asset skipped or pushed to manual review.

**3. Social content audit depth (weight 3)**
A 5: post-level pull on every active platform in scope (Instagram, LinkedIn, Facebook, YouTube) within the window; each platform judged on its own file's checks, not Instagram's norms; the output table complete; top and bottom five with URLs; hooks scored against content-frameworks.md 4.3; 75/25, Three Spheres, anchor, referral and retention, and footprint consistency each answered with post citations; engagement reported as observed only. A 1: profile-level comments only.

**4. Search and AI visibility done right (weight 2)**
A 5: Google queries recorded with dates; the five AI prompts filled from the gather and run by the sidekick on the official Apify actors (apify/chatgpt-search-scraper, apify/gemini-search-scraper), each answer saved verbatim with run ID, prompt fill, and sources (or a surface named as not run with the reason); the read-across names who identifies and who recommends the agent, alongside the Google AI Overviews, and flags any wrong-person signal; no ranking or algorithm claims. A 1: a simulated or paraphrased AI answer, a surface skipped silently, a third-party actor or a personal account used, a ranking claim, or technical SEO.

**5. Step separation (weight 2)**
A 5: the Internal Brand Audit is blunt and diagnostic; the RTM Digital Brand Analysis is narrative, client-facing, and holds no recommendations, positioning, or rewrites; the agenda is short prompts. A 1: strategy in the Analysis.

**6. Useful to Brett and impressive to the client (weight 2)**
A 5: Brett knows what to review manually and what to ask in discovery from the output alone; the Analysis reads as a professional diagnostic report a $50M+ agent would respect. A 1: thin, generic, or a bullet-point audit.

**7. Cost discipline (weight 1)**
A 5: estimate made before the pull, cost logged per run (items x tier price as a labeled calculation, with the run ID), total under $5 or the overage staged. A 1: cost unknown or over the cap without a go.

## Automatic fails

- Any fabricated fact: a metric, review count, ranking, credential, quote, outcome, or search or AI result not in a source
- No post-level social audit, or a platform missing with no stated reason
- An AI answer reported that is not in the saved verbatim file
- Diagnosis drifting into strategy (recommendations, positioning direction, or rewrites in the RTM Digital Brand Analysis)
- Any contact made or anything sent or posted
- An em dash in a client-facing deliverable

## Runs

| # | Date | Client | Brett's rating | Weighted | Apify cost | Notes |
|---|---|---|---|---|---|---|
| 1 | 2026-10-14 | Jim McInerney (blind) | | | about $2.28 | Stage B done. Not blind on any surface: Brett's Gemini has the Google Workspace connector on (reads Gmail and Drive); claude.ai applied account instructions and asked for Zoho twice; ChatGPT temporary chat reads memory. Method changed to official Apify actors (2026-10-15); AI check rerun saved as chatgpt-apify and gemini-apify (about $0.05) |
| 2 | 2026-10-15 | Jim McInerney (blind) | Useful | 3.75 (1=3, 2=3, 3=3, 4=4, 5=5, 6=5, 7=5; Brett confirmed 1, 5, 6) | about $1.59 | Below the 4.0 bar on coverage, social depth, and sourcing; 12 statements corrected after a fact-check Brett requested. Stages B and C done under v1.3 (no manual analysis, build phase) (official Apify actors for ChatGPT and Gemini; portals read by the CMO). Realtor.com unreadable in the built-in browser; read in BW Office Chrome on Brett's go. Saved datasets field-projected, not raw |
| 3 | 2026-10-16 | Jim McInerney (blind) | Useful | 4.19, passed (1=4 CMO from fact-check, 2=4, 3=4, 4=4, 5=5, 6=4, 7=5 pass; Brett agreed 2 to 6 in question boxes) | about $1.76 | Stages B and C under v1.3 with the fact-checker (B: 190 claims, 30 flagged, all fixed, 4 more fixed after re-run; C: 107 claims, 33 flagged, all fixed, 1 more fixed after re-run). Raw datasets re-fetched and saved by the CMO (sidekick has no shell). Realtor.com read in BW Office Chrome on Brett's confirmation |

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not the score. A fact the audit got wrong becomes a line under criterion 1 with the source type that failed. What the Jim McInerney run teaches about the window, actors, or AI method goes into social-audit.md or search-visibility.md the same day.
