# CMO verification and calculations: Jim McInerney (run 3)

_Written by the CMO on 2026-10-16, after the gather. It records (1) checks the CMO ran itself in the built-in browser, (2) calculations from the raw Apify datasets, and (3) the CMO's post-by-post 75/25 classification. Items in (3) are the CMO's judgment, labeled as such; everything else is observed or calculated._

## 1. Raw datasets (replaces the sidekick's typed projections as the source of record)

The sidekick had no shell, so its social-pull JSON files are typed projections. On 2026-10-16 the CMO re-fetched each dataset with mcp__Apify__get-dataset-items (limit 200) and saved the complete responses unchanged. Item counts were checked on parse.

| File | Apify dataset | Items |
|---|---|---|
| social-pull/instagram-posts-raw-2026-10-16.json | pQm96XWzF9ugUjIBn | 67 |
| social-pull/instagram-reels-raw-2026-10-16.json | InRHGg5mhchDVgSGB | 60 |
| social-pull/instagram-reels-transcripts-raw-2026-10-16.json | d8BNShfs1VT4kkUzO | 3 |
| social-pull/facebook-page-50-raw-2026-10-16.json | UPsE6E5vjbdsJoLN8 | 50 |
| social-pull/facebook-personal-50-raw-2026-10-16.json | oGOGdb5Io3qsM85Wr | 50 |
| social-pull/linkedin-posts-raw-2026-10-16.json | ap1DQe7kPFr1aBuU3 | 50 |
| social-pull/linkedin-profile-raw-2026-10-16.json | SCHsVipbucOkdFIhH | 1 |
| social-pull/youtube-raw-2026-10-16.json | ehsCktH06qxN69of8 | 43 |
| gbp-reviews-raw-2026-10-16.json | wUtKQldSBAKTh6aeS | 73 |
| gbp-place-raw-2026-10-16.json | JtpJWVDrTaQndGOOO | 1 |
| google-serp-raw-2026-10-16.json | TxuqVbvUrl5ERAiFB | 8 |

The ChatGPT (ApQKRBBaiI7bZQai2) and Gemini (sJRBNSENGKNSgwOO5) datasets were also re-fetched; the CMO compared them with the sidekick's ai-search files for the passages the audit quotes (the Potomac image alt text, "more than $365 million", "No. 54", "Over $500 million in career sales", "He has also been associated with Compass", the names in prompts 1 and 2). They match. Those two raw responses were small enough to return inline and were not saved as separate files.

Metrics below come from social-pull/social-metrics-2026-10-16.txt, produced by social-pull/social-metrics-script.py on the raw files. Window: capture date 2026-10-16, 90 days back to 2026-07-18; if fewer than 50 posts fall in the window, the latest 50 are used.

## 2. Live site checks (built-in browser, 2026-10-16)

- Homepage https://jimmcinerney.com/ (page text after scrolling the full page): six feature blocks "High Quality Products", "Green Environment", "Comprehensive Amenities", "Professional Services", "Humanitarian Community", "Absolute Security", each followed by the placeholder "Magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet sed quia". Blog block: three posts dated February 13, 2023 by "blackxmarketing". Confirmed.
- About page https://jimmcinerney.com/about-us/: the awards carousel shows "Golden Globe Tiger Awards / Property of the Year", "ET Now Real Estate Awards / Most Promising Delivery", "BAM Awards Real Best / Creative builder", "Design & Development Awards / Ideal Project Design" and others; "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores" appears 12 times on the page. The counter block reads "Years Of Experience", "under construction", "Projects Completed"; the displayed numbers are not confirmed.
- About page team block, as displayed: Jim McInerney (REALTOR®, DRE 01334502); Karen Roque (REALTOR®, DRE 02077953); Marshall McInerney (Director of Marketing); Jennifer Kim (Accounting & Finances); Rick Saavedra (Photography and Video); Mark Eidbo (Production and Content). This corrects gather-pack section 8: the three names the sidekick listed as unconfirmed are on the page.

## 3. Calculations from the raw datasets

### Instagram (@jimmcinerney_realestate, posts and reels merged by shortcode)
- 67 items dated 2026-07-20 to 2026-10-13 (all inside the 90-day window); 5.21 per week over 90 days.
- No gap over 14 days.
- Format: 47 reels, 13 carousels, 7 static.
- Owner: 39 owned by @jimmcinerney_realestate; 28 by collaborators (discover.lajolla 12, realtalkmediaproductions 11, sandiegomusicgroup 2, list.kit 2, birdstockfestival 1).
- Median observed likes plus comments: 22. Median observed plays on the 47 reels: 608.
- Profile: 5,069 followers, 5,466 following, 1,583 posts (instagram-profile dataset ffWawSsV7QrnMNJHn, read 2026-10-16).

### Facebook Page (JimMcInerneyRealEstateTeam)
- Latest 50 posts, 2026-05-07 to 2026-10-13; 37 inside 90 days (2.88 per week). Gaps over 14 days: 27 days (2026-05-07 to 2026-06-04) and 22 days (2026-06-04 to 2026-06-26).
- Format as returned: 24 video (reels), 8 photo, 18 other media.
- Median observed reactions plus shares: 2 (the Page dataset returns no comment counts). Median plays on the 24 videos: 103.5.
- 48 of 50 posted by the Page; 2 by "Rick Saa".

### Facebook personal profile (mcinerney92037)
- Latest 50 posts, 2022-08-28 to 2026-10-13; 9 inside 90 days (0.70 per week). Gaps of 443 days (2023-01-23 to 2024-04-10) and 478 days (2024-08-17 to 2025-12-09).
- Median observed reactions plus comments plus shares: 25; the top post (220) is a family post of 2026-08-18.
- The 9 posts in the window are family, travel, music, and friends; none is a listing or sale (CMO read of the post text).

### LinkedIn (mcinerney1)
- 50 posts, 2023-04-22 to 2025-11-15; none after 2025-11-15 (335 days before capture). Inactive by the 180-day rule.
- All 50 are type "post" authored by Jim McInerney (not reposts): 40 with images, 6 with video, 4 text only.
- Median observed likes plus comments plus shares: 6.5; highest 23 (2023-08-07 "JUST LISTED!" 14740 Willow Rd, Lakeside).
- Profile: headline "Realtor & Luxury Home Rehabilitation Specialist"; 2,107 followers; 1,882 connections; 0 received recommendations. Experience as listed: Publisher and Host, Discover La Jolla (Jun 2024 to Present); Licensed Real Estate Agent, eXp Realty (Mar 2024 to Present); Realtor, Compass (Jan 2020 to Apr 2024); REALTOR, eXp Realty (Apr 2020 to Jan 2021); REALTOR®, Pacific Sotheby's International Realty (Feb 2001 to Jan 2020).

### YouTube (@jimmcinerneyrealestate)
- 43 videos, 2022-03-21 to 2026-08-10; 14 inside 90 days, all uploaded 2026-07-23 to 2026-08-10; none after 2026-08-10.
- Format: 23 long-form videos, 20 Shorts. Longest: "La Jolla Sky Show - Full Show 2026" (14:32).
- Median views 50; median likes plus comments 1. Highest views: Short "Support La Jolla High Baseball Team with Jim McInerney" (2,033), Short "Why eXp Realty with Jim McInerney" (1,882), Short "HELOCs - Orange Bridge" (1,481).
- The 14 uploads since 2026-07-23 have 8 to 71 views each.

### Second license number in captions
"DRE #01334648" appears in 4 Instagram posts (DeQILNqowXh 2026-10-08, DdEv_N-gdUg 2026-09-09, Dc34VrFkxSt 2026-09-04, DctadmSDdsp 2026-08-31) and 5 Facebook Page posts (reels 4487233164883076, 1408788934786999, 27469630086044977, 2304770087003738, and the 2026-08-31 photo post). Jim's license on every profile is 01334502.

### Google reviews (73, raw dataset wUtKQldSBAKTh6aeS)
- By year: 2019: 11; 2020: 4; 2021: 11; 2022: 21; 2023: 15; 2024: 7; 2025: 0; 2026: 4. Latest before 2026: 2024-11-21. 2026 reviews: 2026-06-02, 2026-06-05, 2026-06-13, 2026-08-12.
- 66 of 73 review texts contain "Jim". Words in review text (count of reviews): "sell" 22, "buy" 23, "communicat" 14, "responsive" 10, "negotiat" 4, "marketing" 4, "construction" 2, "renovat" 1, "remodel" 0, "developer" 0.
- 17 of 73 carry an owner response.
- Reviews written by other agents include Woody Henderson 2026-06-02 ("I was the buyer's agent"), Realtor Joe Foty 2024-03-28, Chris Remsen 2024-08-31, and Cade Silva 2024-11-21.

## 4. 75/25 classification (CMO judgment, from the caption text in the raw datasets)

Rule used: A (audience-building) = community, events, local businesses, lifestyle, local tips, personal and family. P (professional) = listings, open houses, caravans, sales, escrow, the agent's own projects, brand and credential posts, how-to-pick-an-agent, office rental.

### Instagram, 67 items
A (31): DeIeeagCE4r, DeHKPapic4g, Dd91zkKNDCr, DdtvezxIxnk, Ddtb8UVEv60, DdrAlT7CjqH, DdkCm2-knhg, DdWx-dIEV2T, DdUaKDvD0e5, DdRFelvk3Co, Dc_D6PiDTAU, Dcwsc2KyBbU, DcwXNISoYE4, DcwXTIEx8Qx, DcrLiboRSSh, DcqpmvGmo1A, DceITNaj8dC, DcbAyD-kTHK, DcMGq_kjoK2, Db8Zaw7qngh, Db8HPttDv1l, DbyoSnohSt5, Dbi5_A7khJ3, DbgRkfCDxJn, DbWCE79CDCB, DbVfUeBDg4T, DbLu1-Ljvxr, DbJKHlIiSx-, DbGK9n5DinW, DbEAX_wnJox, DbBoeZYDexs.
P (36): all other items in the 67.
- All 67: 31 A / 36 P (46 / 54).
- The 39 owned by @jimmcinerney_realestate: 10 A (DeIeeagCE4r, Dd91zkKNDCr, DdrAlT7CjqH, DdkCm2-knhg, DdUaKDvD0e5, DcwXTIEx8Qx, DcqpmvGmo1A, DbyoSnohSt5, DbLu1-Ljvxr, DbEAX_wnJox) / 29 P (26 / 74).
- The 28 collaborator items: 21 A / 7 P. The A side of the feed comes mostly from Discover La Jolla and Real Talk Media collaborator posts.

### Facebook Page, latest 50
A (11): Birdstock posts of 2026-10-06, 2026-10-01 (two, one by "Rick Saa"), 2026-09-21, 2026-09-15; Discover La Jolla 100th-episode post 2026-09-24; Ashen Salon episode 2026-09-01; birthday 2026-08-08; La Jolla vs Del Mar 2026-07-21; Fourth of July 2026-07-14 ("Rick Saa"); Sky Show 2026-07-04. P (39): the rest. 22 / 78.

### YouTube, 43
A (12): La Jolla Sky Show (3 uploads, 2026), Concours d'Elegance (4 uploads: 2026 Short, Lotus Short, 2025 Sunday, 2025 Private Event), Fourth of July drone show (2 uploads, 2025), La Jolla High Baseball Short, Discover La Jolla magazine Short, "La Jolla, CA - The Jewel of San Diego" (2022). P (31): listings, property projects, agent introductions, and Shorts on eXp, HELOCs, Bitcoin, land. 28 / 72.

### Facebook personal, 9 in window
All 9 A (family, friends, music, travel).
