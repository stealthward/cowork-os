# Branding Blueprint: social content audit (mandatory)

_Shared reference. Source: Content Authority & Social Media Playbook sections 6, 7, 8, 12, 14, 15, 16, 18A (Drive 19pl2jU5SHXDdkNNjRPSF32QB4kUx4bX6HFQ1DUw_xcU); scope drafts/2026-10-14-branding-blueprint-scope.md; content-frameworks.md section 4. Built 2026-10-14._

Social is the content Real Talk produces for agents, so every blueprint-audit runs a post-level audit on every active platform (Brett, 2026-10-14). This replaces the Blueprint Playbook's "Social Review Boundary" (profile and themes only). A platform that cannot be pulled is named with the reason; it is never silently skipped.

## Structure (Brett, 2026-10-14)

One social audit inside blueprint-audit, with one file per platform in `social/`. This file holds the shared core every platform uses (window, cost, the eleven common checks, the output table); each platform file holds its actors, its role, and what to look for on that platform. Cross-platform findings (75/25 across the whole feed, one story everywhere, which channel does what) are written once, in section 5 of the Internal Brand Audit.

| Platform | File | In scope |
|---|---|---|
| Instagram | social/instagram.md | Yes |
| LinkedIn | social/linkedin.md | Yes |
| Facebook | social/facebook.md | Yes |
| YouTube | social/youtube.md | Yes |
| TikTok | none | No (Brett, 2026-10-14): not audited or pulled for now; if the agent has an account, note the handle and last post date only |

## 1. Pull (research-sidekick, Apify)

Actors are listed in each platform file (checked against the Apify Store on 2026-10-14). Before each run, read the actor's input schema (fetch-actor-details); actor names and prices change. Use Apify's official actors (developer "apify") first (Brett, 2026-10-15). Where no official actor covers a source, use the highest-usage third-party actor, log it as third-party with its monthly users, and name it in the gather pack. Portals (Zillow, Realtor.com, Homes.com, the brokerage profile) are never pulled through Apify: the CMO reads them directly in the built-in browser (Brett, 2026-10-15). A GBP or other page that blocks a plain fetch: an actor chosen by the same rule, logged.

**Window:** per active platform, the last 90 days or the last 50 posts, whichever is larger (CMO proposal, to confirm on the Jim McInerney test). "Active" means at least one post in the last 180 days; an inactive account is reported as inactive with its last post date, not pulled in full.

**Transcripts:** add-on (listed $0.048 per minute), only for the top three videos by observed engagement, and only while the run stays under the cap.

**Cost:** runs without staging up to $5 per audit (Brett, 2026-10-14). Before running, estimate (posts in window x listed price, labeled a calculation); if the estimate is over $5, cut the window to fit and stage the remainder for Brett. Log the cost per run: the run record from the connector shows events and compute units but no dollar figure (test run 2026-10-14), so log items charged x the tier price fetch-actor-details shows, labeled a calculation, plus the run ID; the exact charge is in Apify Console > Runs.

**Save:** the CMO, not the sidekick, saves each dataset raw and complete (the get-dataset-items response unchanged) in the engagement's `social-pull/` folder (or the eval folder), named `<name>-raw-<YYYY-MM-DD>.json`, then runs `.claude/blueprint/scripts/social-metrics.py` over them (blueprint-audit SKILL.md, Raw save and metrics). The sidekick returns run and dataset IDs only; it has no shell, and a typed copy is not raw (Jim McInerney run 3, 2026-10-16).

**Per post, keep:** URL, date, format (reel, short, long-form video, static, carousel, text, live), caption or title text, duration for video, observed likes, comments, views, shares as displayed, capture date.

## 2. Analysis (CMO, from the pull): shared core

Run these eleven checks on every platform, then the platform file's own checks. Every finding cites the post URL. Engagement is reported as observed, never as reach or ranking.

| # | Check | What to record |
|---|---|---|
| 1 | Cadence and consistency | Posts per week per platform across the window; gaps over two weeks |
| 2 | Format mix | Share of reels or shorts, long-form, static, carousel, text; native to each platform or cross-posted |
| 3 | Engagement | Per-post observed engagement; top five and bottom five per platform with what they have in common |
| 4 | 75/25 balance | Share of audience-building (lifestyle, community, local, homeowner education) vs professional real estate (listings, results, market, process). Target 75 to 80 / 20 to 25 unless the business model justifies otherwise |
| 5 | Three Spheres coverage | Which posts protect the Sphere of Influence, build association with the Sphere of Recognition, expand into the Sphere of Proximity (content-frameworks.md 11.1) |
| 6 | Authority anchor | Is one anchor visible (local authority, luxury strategist, negotiation specialist, data-driven advisor, community connector, investor operator, relocation, move-up, downsizing) and does professional content reinforce it |
| 7 | Hooks | Score the top ten posts' opening line or first three seconds against the seven headline components (content-frameworks.md 4.3: Recency, Relevancy, Celebrity, Proximity, Conflict, Unusual, Ongoing); at least two is the bar |
| 8 | Video quality and on-camera presence | Who is on camera, audio and lighting, captions, length vs platform norm; observed, not graded on taste |
| 9 | Referral and retention content | Client recognition, home anniversaries, homeowner tips, story-based referral language |
| 10 | Consistency with the footprint | Do bios and content repeat the same service plus geography pairing, brand name, and proof as the website, portals, and Google |
| 11 | Memorability | Is the agent easy to remember for a category, market, or audience; what a stranger would say they are known for |

Judge each platform against its role in its platform file, not against Instagram's norms.

## 3. Output table (Internal Brand Audit section 5)

| Platform | Handle | Active | Posts in window | Posts per week | Format mix | Median observed engagement | 75/25 split | Spheres covered | Anchor visible | Pull cost |
|---|---|---|---|---|---|---|---|---|---|---|

Then, per platform: top and bottom five (URL, date, format, observed engagement, one line on why), hook scores for the top ten, and the platform file's checks with post citations. Then the cross-platform findings for checks 4, 5, 6, 10, and 11 in prose. Close with "What should be fixed first" (internal only).

The RTM Digital Brand Analysis gets the client-facing diagnosis of this (section 6, narrative, no fixes). The Blueprint's Channel Strategy and Phased Action Plan build on it, including where Real Talk's video work fits.
