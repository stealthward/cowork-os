# Fact-checker run 4 findings (agent file v1.3, 2026-10-15)

_The fact-checker's tables as returned, on the seeded copies in this folder. Seeded rows are marked [seed N]. Every unseeded row also applies to the current run 2 documents in `evals/blueprint-audit/2026-10-15-jim-mcinerney/`, which still carry those lines. The CMO verified the Wrong verdicts against the sources (see fact-checker-eval.md, runs 1 to 4); B 14 is borderline (a judgment count)._

## Stage B: internal-brand-audit.md (165 claims; 134 supported)

| # | Claim (short) | Section | Verdict | Source checked | Fix needed |
|---|---|---|---|---|---|
| 1 | "a real and unusual asset most agents never build" [seed 6] | 1 | No source | none | Drop the generalization about other agents |
| 2 | "four experience figures (18, 22, 25, 28 years)" | 1 | Unverifiable | GP 1 row 35, 2 Bankrate: name-only match | Mark 22 as unconfirmed or leave it out |
| 3 | "24 YouTube episodes in the window at 0.85 per week" | 2 | Wrong | youtube-discoverlajolla: 24 pulled from 2026-03-30; 11 in window; GP 4 "Newest 24 of 42" | Match the source scope |
| 4 | Proof "on the bio page ($500M, 25 years) and nowhere else" | 3C | Wrong | GP 2 About Us: "more than 25 years" | 25 years also on About |
| 5 | "six steps ... that any agent could claim" | 3D | No source | none | Drop or label as judgment |
| 6 | "It is three clicks deep" | 3E | Wrong | GP 2 homepage CTA to /about-us/; GP 1 row 2 main nav | One click |
| 7 | "five North County cities" | 4 table, 7 | No source | portals.md Zillow service areas, no regional label | Drop "North County" |
| 8 | Homes.com quote "very thorough in providing constant communication." | 4D | No source | portals.md Homes.com: phrase absent | Quote only captured text |
| 9 | "ChatGPT and Gemini both pull Zillow, Realtor.com, RealTrends, and authorized.company" | 4F | Wrong | chatgpt P4, P5: no RealTrends; gemini P4, P5: no Realtor.com | Split by tool |
| 10 | "$365 million" from "LinkedIn and LoopNet-style profiles" | 4F | Unverifiable | chatgpt P3: loopnet chip "+1"; LinkedIn chip on another sentence | LoopNet plus one unnamed, or unverified |
| 11 | Bottom five #3 to #5 (DdWx-dIEV2T, DbWCE79CDCB, DbOTjOnAVDf) | 5 Instagram | Wrong | instagram-posts likesCount -1 (hidden); lowest visible: DbmLfzBTEWi 5, DbLu1-Ljvxr 5, Dccy7LWjsea 6, DcvnPnUiNUu 7, DbT-QI3z5Xh 7 | Leave hidden-like posts out |
| 12 | "Reels median 19 likes vs carousels 46 and images 23" | 5 | Wrong | instagram-posts: likes plus comments; likes only 18/43/22 | Label the metric |
| 13 | "the top four posts all feature him or his band" [seed 12] | 5 | Unverifiable | captions only; DeKZkVDOZRx "this rendering" | Mark unverified |
| 14 | "Ten captions describe Jim's marketing strategy in the third person" | 5 | Wrong (borderline: a classification) | 11 third-person captions listed | Match the count, or label as our classification |
| 15 | "Comments were not in the saved file" | 5 FB Page | Wrong | facebook-page: comment counts on 7 records | Counts present, text not |
| 16 | "Median 2.5 likes plus shares" | 5 FB Page | Wrong | facebook-page: 3 over the 37 window posts | Recalculate |
| 17 | "Every post since 2023 is family, travel, surf, music" | 5 FB personal | Unverifiable | 11 posts with no text; 2025-12-09 Christmas Parade | Drop "every" |
| 18 | "0.18 across channel life" | 5 table | Wrong | channel joined 2013; first upload 2022-03-21 | Name the base |
| 19 | "gaps of 495, 327, and 250 days" | 5 YouTube | Wrong | youtube: 496, 328, 301, 250 | Full list |
| 20 | "about one episode in ten" | 5 Discover La Jolla | Wrong | 4 of 24 pulled | Match the count |
| 21 | "one Google review reply in the GBP data" | 5 | No source | GP 2: 5 of 73 pulled | Limit to the five |
| 22 | "Facebook reels, authorized.company, and two Real Talk Media posts lead (query 1)" [seed 3] | 6.1 | Wrong | GP 3 q1: 1 FB reel, 2 authorized, 3 RTM FB, 4 IG, 5 RTM YouTube | Match positions |
| 23 | "other McInerneys fill the page (query 4)" | 6.1 | Wrong | GP 3 q4: agent at 3 (Global Luxury Listings) | He appears at 3 |
| 24 | "Reviews do not mention remodels or development in the five pulled" [seed 4] | 6.5 | No source | GP 2: one review in full | Limit to the one read |
| 25 | "Gemini shows no images" | 6.7 | Unverifiable | actor returns text and sources only | Say the actor returns no images |
| 26 | "Listing marketing ... is distinctive" | 8 | No source | competitors not read | Drop or label |
| 27 | "Years: ... 22 (Bankrate 2024)" | 9 | Unverifiable | GP 1 row 35 name-only | Mark unconfirmed |
| 28 | "RealTrends city volume rank 20 (P) is the only third-party rank seen" | 9 | Wrong | GP 5: Real Producers #54; chatgpt P3 | Name the other rank |
| 29 | "Zillow's visible reviews are not about Jim" | 9 | Wrong | portals.md: 2 of 10 are team reviews | 8 of 10 for Cade or Patrick |
| 30 | "reels with Jim on camera (DeKZkVDOZRx ...)" | 11.4 | Unverifiable | captions only | Phrase as reels to check |
| 31 | "Real Talk Media posts the same line" | 11.7 | Wrong | GP 3 q1 and gemini P3 source 4 carry other lines | Quote the lines matched |

Also found in run 3, not repeated in run 4: the LinkedIn dataset post of 2025-11-15 has no "jimrealestate.com" (sections 5 check 10 and 10); the audit pairs the all-post personal median of 25 with a window-only top three.

## Stage C: rtm-digital-brand-analysis.md, discovery-agenda.md, cover-email-analysis.md (97 claims; 70 supported)

| # | Claim (short) | Location | Verdict | Source checked | Fix needed |
|---|---|---|---|---|---|
| 1 | "built something few agents ever do" [seed 5] | Analysis 1 | No source | none | Drop |
| 2 | specialty "is not what search tools or AI assistants associate with his name" | Analysis 1 | Wrong | gemini P3, P5 (builds, renovations); chatgpt P5 | Say AI does not recommend him for it (P1, P2) |
| 3 | "website appears first, followed by his Instagram, LinkedIn, Zillow, and Realtor.com" | Analysis 2 | Wrong | GP 3 q2 and q3 orders differ | Tie to one query |
| 4 | "other McInerneys ahead of Jim's own website" [seed 2] | Analysis 2 | Wrong | GP 3 q4: site not on page 1 | Say not on page 1 |
| 5 | "rare among agents" [seed 7] | Analysis 3 | No source | none | Drop |
| 6 | "three clicks from the homepage" | Analysis 3 | Wrong | GP 2 CTA, GP 1 row 2 nav | One click |
| 7 | "the same placeholder text" | Analysis 3 | Wrong | GP 2: different filler strings | Drop "the same" |
| 8 | "most of the agents he competes with" | Analysis 3 | No source | IBA 8: competitors not read | Drop |
| 9 | "Portals are often where a prospective client forms a first opinion" | Analysis 4 | No source | none | Drop or label |
| 10 | "65 five-star reviews" | Analysis 4 | No source | portals.md: 65 reviews, 5.0; 10 visible | 65 reviews, 5.0 average |
| 11 | "and two earlier firms" [seed 13] | Analysis 4 | Unverifiable | GP 1 row 35: Prudential name-only | Mark unconfirmed |
| 12 | "None of these inconsistencies is unusual for an agent" [seed 9] | Analysis 4 | No source | none | Drop |
| 13 | "asked ChatGPT, Gemini, and Google's AI Overviews the same questions" | Analysis 5, header | Wrong | GP 3, 3a: one AI Overview on q8; prompts to ChatGPT and Gemini only | Say so |
| 14 | "Both drew on his website, Zillow, Realtor.com, and his LinkedIn profile" [seed 1] | Analysis 5 | Wrong | gemini P3 to P5 sources | List per tool |
| 15 | competitors' "public profiles state a specialty plainly" [seed 10] | Analysis 5 | No source | IBA 8 | Drop or limit to AI answers |
| 16 | "Jim appears on camera often" [seed 11] | Analysis 6 | Unverifiable | captions only | Mark unverified |
| 17 | strongest posts "community moments with Jim at the center" incl. Fairway tour | Analysis 6 | Wrong | IBA 5 top five; DeKZkVDOZRx rendering | Match the top five |
| 18 | "Listing announcements and podcast promotions drew the lightest response" | Analysis 6 | Wrong | Clemson listing reel third overall | Match the bottom five |
| 19 | "roughly half of recent posts falling on each side" [seed 14] | Analysis 6 | Estimate as fact | IBA 5: CMO classification | Label it |
| 20 | "family and his music drew more than 100 reactions each" | Analysis 6 | Wrong | facebook-personal: music 80, 47 | Drop "music" |
| 21 | "the portal biographies ... do not mention it" | Analysis 7 | Wrong | portals.md Homes.com: "Developer Services" | Acknowledge Homes.com |
| 22 | "Very few agents can speak credibly about entitlement" [seed 8] | Analysis 7 | No source | none | Drop |
| 23 | "authority that most competitors cannot match" | Analysis 7 | No source | none | Drop |
| 24 | "A specialty that search tools do not attach to his name" | Analysis 8 | Wrong | gemini P3, P5 | Match the bullet text |
| 25 | "personal Facebook gets more engagement than every business account combined" | Agenda | Wrong | facebook-personal total vs instagram-posts total | Per-post comparison |
| 26 | "band and Birdstock posts outperform your listings" | Agenda | Wrong | Fairway 192, Clemson 90 beat most Birdstock posts | Match the ranking |
| 27 | "you've built more than most agents ever do" | Cover email | No source | none | Drop |

Also found in run 3 Stage C: the "$2M to $5M ... consistent with his portal history" band is a CMO inference stated as fact (Analysis 5); "Reviews and biography text on two portals center on agents who are not part of his current website team" rests on 10 of 65 Zillow reviews (Analysis 8).
