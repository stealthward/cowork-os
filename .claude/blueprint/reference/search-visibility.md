# Branding Blueprint: Google and AI search visibility

_Shared reference. Source: Real Estate Branding Blueprint Playbook section 7, plus the Google Business Profile rule from the Brand Driver GPT. Built 2026-10-14. Public brand impression analysis, never technical SEO._

## Review areas

Google results for the agent's name and market; Google Business Profile; Zillow, Realtor.com, Homes.com, and brokerage profiles; other public profiles or directory summaries; recommendation-style AI answers.

## Google queries (a reasonable sample; skip any that do not fit)

1. [Agent Name] real estate
2. [Agent Name] Realtor
3. [Agent Name] [City] real estate agent
4. [Agent Name] [Brokerage]
5. [Agent Name] Zillow / Realtor.com / Homes.com
6. [Agent Name] reviews
7. real estate agent in [City]
8. [Specialty] real estate agent in [City]

Record per query: date, the top results seen (title and URL), whether the agent appears and where, and what the result set says about them. Queries 7 and 8 report only whether the agent appears on the page captured; they are a snapshot, not a ranking.

## AI search check (research-sidekick, Apify official actors; Brett, 2026-10-15)

Run by the research-sidekick inside the gather, after discovery and the Google queries, so the prompts are filled from what the gather found, never from the intake or an unconfirmed lead. No browser and no personal account is involved, so any auditor gets the same check. The same five prompts on each surface, 10 answers per audit:

| # | Prompt | Tests |
|---|---|---|
| 1 | Who are the best real estate agents in [narrowest market] for [stated specialty]? | Category recommendation |
| 2 | I'm [selling or buying] a [property type] in [market] around [price band from the portals]. Which agent should I hire? | Realistic consumer ask |
| 3 | What is [Agent Name] known for in real estate? | Entity clarity, no anchor |
| 4 | Is [Agent Name] a real estate agent in [market]? | Identity check |
| 5 | Summarize [Agent Name], [market] real estate agent, as a professional. | Anchored summary |

Fill rule: [narrowest market] is the city or community the agent's own site names first (La Jolla, not San Diego); [stated specialty] is the agent's own words from the site or bios; [price band] is the portal sold range or average, rounded. Record the fill in each saved file.

| Surface | Actor (official Apify only) | Input |
|---|---|---|
| ChatGPT | apify/chatgpt-search-scraper | `queries` (one prompt per line), `countryCode` us |
| Gemini | apify/gemini-search-scraper | `queries` (one prompt per line), `countryCode` us |

Use only actors published by Apify itself (developer "apify"), never a third-party actor (Brett, 2026-10-15). If an official actor is gone or fails twice, name the surface as not run with the reason and tell the CMO; do not substitute a third-party actor. Cost: $0.005 per answer at the BRONZE tier (10 answers is about $0.05, a calculation); the Gemini actor requires a run cap (maxTotalChargeUsd) of at least $0.50, which bills actual use only. Log each run ID and cost with the social pull.

Not used: Brett's or any team member's own ChatGPT, Gemini, or claude.ai accounts, which apply memory, account instructions, and connectors (Jim McInerney run 1, 2026-10-14); the Gemini and OpenAI APIs (scoped 2026-10-15, kept as the fallback if the official actors stop working); claude.ai (optional per client only, by the same actor rule if Apify publishes one).

**Each run:** one run per surface with all five prompts. Save the dataset answers verbatim with surface, actor, run ID, dataset ID, date, the prompt fill, and the sources returned to `ai-search/<surface>-apify-<YYYY-MM-DD>.md` in the client or test folder. Never retype, summarize, or simulate an answer. Note anything in the answer that points at the wrong person (for example, an image of another agent with the same name). The actors do not report the model used or their sign-in state; say so in the file.

**Read across the 10 (CMO, in the audit):** does each surface identify the agent (right person, brokerage, market, and image); what each says they are known for; whether the agent is named in prompts 1 and 2, and who is named instead; which sources each surface leaned on (website, portals, GBP, press, social); where the surfaces disagree with each other or with the agent's own profiles. Read alongside the Google AI Overviews from the gather. Answers are indicators of public perception, not fact; one run per prompt is a snapshot. Client-facing wording names the tools checked ("ChatGPT, Gemini, and Google's AI Overviews"), never "all AI tools".

Also capture any Google AI Overview that appears on the Google queries above, verbatim with the date.

## Google Business Profile

Assess category clarity, name consistency with the website and portals, market and service clarity, review impression (count and recency as displayed), photo and post relevance, and alignment with the other profiles. Do not interpret Google policy.

## Evaluation criteria (the section's subsections)

1. Current Google Impression
2. Entity Clarity (is this clearly one identifiable agent, brand, and brokerage)
3. Service Plus Geography Clarity
4. Portal and Profile Consistency
5. Google Business Profile Clarity
6. Authority and Proof Visibility
7. AI Recommendation-Readiness
8. Gaps and Risks
9. Recommended Fixes (Internal Brand Audit only; the RTM Digital Brand Analysis stays diagnostic)

## Standards

No technical SEO claims; no ranking claims unless directly observed; never fabricate what a search, AI tool, portal, or summary says; AI output is not a verified fact; state the limitation when access is partial and say so when findings are inconclusive.
