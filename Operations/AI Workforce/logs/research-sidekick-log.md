# Research sidekick log

One entry per run: question, sources tried, sources that failed, paid lookups used, Zoho records created or updated, what it could not verify. Tag: Personal Layer.

## 2026-10-14 | Branding Blueprint gather, Jim McInerney (blind eval run 1)

- Question: discover, read, search, and pull social for Jim McInerney, San Diego, brokerage unknown. Output: gather-pack.md and social-pull JSON in Operations/AI Workforce/evals/blueprint-audit/2026-10-14-jim-mcinerney/.
- Sources tried and read: jimmcinerney.com (10 pages), California DRE public record, Zillow, Realtor.com, Homes.com, Google Business Profile, Yelp, authorized.company, SDVoyager, Times of San Diego, LinkedIn profile, Instagram, Facebook (Page and public personal profile), YouTube (two channels), Google results for 15 queries.
- Sources that failed or blocked (and what was done): Zillow, Homes.com, Yelp, LoopNet WebFetch 403 (read through Apify portal actors, LoopNet snippet only); Realtor.com WebFetch blocked (Apify actor); LinkedIn fetch HTTP 999 (Apify actor); Instagram login wall, TikTok empty page, Facebook title only (Apify platform actors; TikTok not recovered); Bankrate HTTP 410; Apify key-value store transcript records HTTP 403 (two of three transcripts not retrieved); Instagram post actor stopped at 12 items on two runs.
- Paid lookups: Apify only, about $2.25 calculated (social pull $1.08, transcripts up to $0.92, discovery and portals about $0.25). Under the $5 cap. No Tracerfy.
- Zoho: no reads, no writes.
- Could not verify: see gather-pack.md section 7 (license status conflict, brokerage license number, production figures, awards, review dates on Zillow, TikTok, Instagram feed beyond 12 posts, two transcripts).
- Note: the saved instagram-2026-10-14.json has one caption (DbtNEO0HHBk) with a sidekick-added parenthetical; flagged in gather-pack.md section 4.

## 2026-10-15 | REInvest investor brief, Brian Daly (founding-table candidate)

- Question: who is Brian Daly, and is he a founding-table candidate for REInvest. Output: Business Development/REInvest/2026-10-15-brian-daly-reinvest-founding-table-brief.md.
- Sources read: growth-strategy.md, audience-personas.md, initiatives.md, BD MEMORY.md, REInvest MEMORY.md and CLAUDE.md, Investor Database MEMORY.md and CLAUDE.md, ARV flip JSON, Email HQ triage log and state, AI Workforce logs; Zoho Contacts, Leads, Accounts; Asana task search; web (werevive.com, Business Lunch ep. 197, Local Leverage ep. 30 via search snippet).
- Sources that failed: Amazon Music episode page rendered empty (text taken from search result); werevive.com/about-us 404; one broad web search returned nothing relevant; Asana full-text search output too large to read in full (used targeted search_objects instead).
- Paid lookups: none. No Tracerfy, no Apify.
- Zoho: reads only. Contact 1575093000008196219 (Brian Daly). No writes.
- Could not verify: what Brian committed to, meaning of "DNC" on his Zoho relationship field, track-record claims, whether the Lykos Holdings and 2020 Business Lunch Brian Dalys are the same person, newsletter size, CA SOS record.
- Rating: pending Brett (brief 2 of 3, rated test)
- Rating: Partly (Brett, 2026-10-15). Missed Gmail (Brian's reply to the ask, relationship history) and Smartsheet/Hub escrow volume; WeRevive is Five Star's second-biggest client. Eval criterion 1 updated.
2026-10-15 | Jim McInerney blind eval run 2 gather | sources tried: jimmcinerney.com (10 pages), Google SERP (11 queries), Google Maps GBP, Audible, DRE record, IG/FB/LinkedIn/YouTube via Apify, ChatGPT and Gemini via official actors | failed: LinkedIn profile page (blocked), Zillow/Realtor.com/Homes.com and eXp page (not fetched by rule or not found), YouTube transcript retrieval (KVS 403) | paid: about $1.59 Apify, third-party actors harvestapi/linkedin-profile-posts, streamers/youtube-scraper, compass/crawler-google-places | Zoho: none | could not verify: see gather-pack.md section 7 (appended by the CMO; sidekick had no append tool)
2026-10-16 | Jim McInerney blind eval run 3 gather | sources tried: jimmcinerney.com (nav pages, listing pages), GBP (place + 73 reviews), Google SERP (14 queries, AI Overviews), ChatGPT and Gemini via official actors, IG/FB Page/FB personal/LinkedIn/YouTube x2 via Apify, SDVoyager, Birdeye, authorized.company, TikTok profile | failed: LinkedIn plain fetch, Yelp, LoopNet, /content/, about-us first fetch (500) | paid: about $1.76 Apify (labeled calculation), third-party harvestapi and streamers actors logged | Zoho: none | could not verify: gather-pack.md section 8 (appended by the CMO; sidekick had no append tool; it also could not save raw JSON, CMO re-fetched and saved raw)

## 2026-10-16 | Partner campaign brief, one $50M+ list-side producer (Greg Noonan)

- Question: pick the single strongest $50M+ list-side producer for the partner campaign, excluding clients, partners, and open conversations. Output: Business Development/2026-10-16-greg-noonan-brief.md.
- Sources read: growth-strategy.md, audience-personas.md, initiatives.md, zoho-conventions.md, BD MEMORY.md and CLAUDE.md; Zoho Contacts (List_Sides_12_months searches, records for Shafran, Noonan, McKelvey, Neuman, Barry, Fontana, Schultz) and Listings (Listing_Agent rows since 2025-10-16, summed by hand because COQL aggregates would not run); Gmail, Smartsheet, Asana searches; lajollahomes.com.
- Sources that failed: COQL sum/count with group by (syntax rejected); Apify rag-web-browser for Noonan ranking (0 pages scraped); Gmail "Noonan" and "Shafran" searches returned unrelated threads; Smartsheet search is name-only (Directing Customer column not read).
- Paid lookups: two Apify rag-web-browser runs, about $0.04 (labeled calculation). No Tracerfy.
- Zoho: reads only. Contact 1575093000007541870 (Greg Noonan). No writes.
- Could not verify: meaning of "FSE Partner" tag (not defined in zoho-conventions.md either), Zoho listing completeness, closed price vs list price, team attribution, public ranking figure, Smartsheet Directing Customer count.
- Rating: pending Brett (brief 3 of 3, rated test). Logged by the session; the sidekick had no append tool.
- Rating: Useful (Brett, 2026-10-16). "FSE Partner" tag clarified: it marks prospects, so Noonan stays eligible; added to zoho-conventions.md.

## 2026-10-20: REInvest channel research (for the CMO; appended by the CMO)
- **Question:** which channels reach San Diego investors for the REInvest whisper and tease campaign.
- **Sources tried:** Drive sheet connector (9-row samples only), CSV export (401), local registry-data.json (unreadable single line), Apify official Instagram actors, rag-web-browser. Failed: full-sheet read, CSV export.
- **Paid lookups:** Apify runs listed in Business Development/REInvest/2026-10-20-channel-research.md (about $0.32 plus under $0.10, calculation).
- **Zoho:** none. **Could not verify:** see the brief's list; items 3 and 4 incomplete.

## 2026-10-20: REInvest item 4, top-50 flipper Instagram sample (appended by the CMO)
- **Sources:** apify/google-search-scraper (50 queries), apify/instagram-profile-scraper (23 handles, two runs), WebFetch renovatesandiego.com. Failed: six guessed handles do not exist; post data missing for several profiles.
- **Result:** 7 of 49 confirmed (Opendoor separate); brief at Business Development/REInvest/2026-10-20-channel-research-item4.md. Paid: about $0.18 expected, $0.28 upper bound (calculation). Zoho: none.
- **Could not verify:** follows of the four brand handles; @cthomesllc vs CT Dream Realty; @ljpcompanies vs La Jolla Pacific Consultants.
2026-10-28 | Question: how to open a LinkedIn text-plus-video post (fold size, first-line patterns, video title and headline, video-specific points, LinkedIn's own guidance) for Brett's audience of top-producing agents. | Sources tried: eden.so, Supergrow preview tool, linkedinpreview.com, MagicPost, AuthoredUp, dev.to (two posts), Tim Queen, LinkedIn help a7486279, Lindsey Gamble, OpusClip, Socialinsider, The State of Brand, writtenlyhub summary of van der Blom 2025, web searches (Taplio, Search Engine Journal, Buffer). | Failed: Vista Social help (403); van der Blom 2026 report; named-creator posts. | Paid lookups: none. | Zoho: none. | Could not verify: official fold number, native video title field, 2026 van der Blom hook data, Buffer/Hootsuite/Social Insider hook studies, Gamble article year.
2026-10-29 | Question: build LinkedIn hook swipe file (50 hooks) plus post-length research | Sources tried: LinkedIn public post pages via web search and page reader (about 110 fetches), Hootsuite, Supergrow, AuthoredUp, LinkedIn Help (search result only) | Failed: LinkedIn feeds behind login; 3 Dan Martell URLs 404 | Paid lookups: none | Zoho: none | Could not verify: reposts, media type, true top posts, 2025 posts, exact character counts
2026-10-29 | Question: refresh swipe file with Apify data | Sources: apify/linkedin-profile-posts run pBQaIEkwGFZgCyjkq, dataset lGHcUlDqEFdg3REEh | Failed: no code execution in the sidekick session (CMO ran the stats) | Paid lookups: one Apify run, 1,000 posts, about $2.00 (calculation) | Zoho: none | Could not verify: billed cost
2026-10-29 | Question: structure and flow of Alex Hormozi's LinkedIn posts (Leila, Dan comparison) | Sources: Apify scratchpad file (300 posts), WebFetch of two Alex URLs | Failed: image content behind login | Paid lookups: none | Zoho: none | Could not verify: caption-less image content, caption-to-video relationship
