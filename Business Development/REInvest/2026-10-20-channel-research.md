# REInvest channel research: Instagram benchmarks, posting accounts, registry email reach

_Research Sidekick for the CMO, 2026-10-20. Read-only: no one contacted, no Zoho writes. Serves the whisper and tease plan (2026-10-20-reinvest-whisper-tease-plan.md)._

## Summary

1. Instagram benchmark is real but thin: the only SD investor events with posts are ARV and VREV co-hosted socials (9/16, 9/24, 9/26, 10/21) and ARV's announce posts ran 7 to 10 days out, as single images with date, time, place, and one RSVP line; the best one drew 88 likes and 14 comments.
2. Recaps ran 1 to 4 days after on VREV (carousel 78 likes, reel 2,728 plays) and 13 days after on Five Star. No collab (co-author) posts were found; partners were @-tagged or named in captions instead.
3. Posting accounts are small: Real Talk Media (@realtalkmediaproductions) 2,169 followers, average 7.9 interactions per post over the last 12; Five Star Escrow (@fivestarescrow) 662 followers, average 3.8. ARV (1,757) and VREV (1,014) are not bigger, but their event posts out-draw ours.
4. Items 3 and 4 are NOT done: the Drive connector returns only a 9-row sample per tab of Investor_Registry_DB, and this session has no way to run a script on the full tabs. Tab sizes and the 2026-09-02 snapshot figures are given; exact counts and the 50-entity Instagram sample need the tabs exported as CSV (see Decision).
5. Instagram "top channel" is consistent with the data but not proven: no attendance or RSVP source was available, so channel-to-attendance is unverified.

## 1. Benchmarks: VREV and ARV Instagram

### Accounts (handles confirmed 2026-10-20)

| Company | Handle | Followers | Confirmation | Source |
|---|---|---|---|---|
| ARV Finance | @arv.finance (ARV Finance Inc.) | 1,757 | Bio: "founded by local investor Neil Dutta"; Linktree ARVfinancesd; arvfinance.com names Neil Dutta, La Jolla. The handle @arvfinance is a different person (not ARV). arvfinance.com itself shows no Instagram link, so confirmation is by bio | Apify profile run EVdh3nFL185BD8cxv |
| Vertigo Real Estate Ventures | @vertigo_rev | 1,014 | Bio lists Denver, Raleigh, West Palm Beach, San Diego; link careers.vertigorev.com. Related accounts seen in the data: @vertigo_revsandiego (San Diego, posts reels, e.g. 4,233 plays on 10/16) and @vertigo_raleigh. Not profiled | same run |

Method: apify/instagram-post-scraper, posts newer than 2026-04-20, limit 100 per account. Coverage caveat: @arv.finance posts almost daily, so the 100-post limit reached back only to about 2026-07-24 for ARV (about 3 months, not 6). @vertigo_rev posts less often and reached back to 2026-04-21. The scraper also returned posts by other accounts that tag these two (listed as third-party below). Captions were returned in full. Story highlights are not returned by the actor, so none are reported. Format key: single image = "feed", carousel = "carousel_container", reel = "clips".

### Event posts found

Event dates come from the captions. "Days before" counts from post date to event date.

| Event (date) | Post (account, date) | Format | Hook (paraphrased) | Likes | Comments | Views | Days before / after |
|---|---|---|---|---|---|---|---|
| BrewRE at Hideaway Pacific Beach (9/16, ARV with two agent-education partners) | @arv.finance 9/7 | single image | "BrewRE is taking over Pacific Beach on Sept 16th" | 4 | 0 | n/a | 9 before |
| same | @arv.finance 9/14 | single image | Cold brews, hot deals, cheat codes; time and place | 11 | 0 | n/a | 2 before |
| Fit Social, Ocean Front Walk (9/24, VREV + ARV + Five Star) | @arv.finance 9/15 | single image | Ocean views, good food, real opportunity; names all three hosts, time, place | 68 | 3 | n/a | 9 before |
| same | @vertigo_rev 9/25 | carousel | "A night of connection, conversation, and big ideas" (investor meetup recap) | 78 | 3 | n/a | 1 after |
| same (inferred same event: caption names Fit Social) | @vertigo_rev 9/28 | reel | Real connections, meaningful conversations; thank-you | 60 | 0 | 2,728 plays | 4 after |
| same | @fivestarescrow 10/7 | reel | Escrow happens at the desk, relationships go beyond it; @-tags VREV and ARV | 20 | 0 | 605 plays | 13 after |
| Enduro Property Group + ARV, La Jolla (9/26) | @arv.finance 9/16 | single image | "Unlock your next premium opportunity in La Jolla"; date, time, address, RSVP | 88 | 14 | n/a | 10 before |
| Free online investing call (9/23, ARV segment plus two others) | @realtyentrepreneur 9/20 (third party) | reel | Invites to a free Zoom with the ARV team first | 28 | 0 | 2,490 plays | 3 before |
| same | @recheatcodes 9/21 (third party) | single image | Names the three speakers; free, RSVP link in bio | 58 | 6 | n/a | 2 before |
| BrewRE October Bash, Fit Social (10/21) | @arv.finance 10/14 | single image | Cold brews, warm networking, $250 costume prize; date, time, place | 12 | 0 | n/a | 7 before (event not yet held; no reminder seen as of 10/20) |
| ARV client night at Petco Park (date not stated) | @arv.finance 7/28 | carousel | Suite views and baseball with the best clients | 86 | 1 | n/a | recap, days not determinable |
| same | @arv.finance 8/4 | carousel | "Round 2" of photos | 39 | 0 | n/a | recap |

Not counted: VREV Florida's Boca Bash (4/28, Florida) and the VREV Leadership Summit (6/11, internal); neither is a San Diego investor event. @recheatcodes 8/17 promoted BrewRE on 8/19 (31 likes, 1 comment) but the caption does not name ARV, so ARV involvement is not confirmed. @arv.finance 6/9 "Where deals get done, see you at the next one" (carousel, 54 likes) reads as a recap but names no event, so it is not verified.

### Pattern (inferred from the rows above; sample is 4 events with a promo, 1 with a clear recap pair)

- Cadence before an event: one announce post 7 to 10 days out (all four ARV events), plus a reminder 2 days out on one of them (9/16). Nothing seen inside the final 24 hours.
- Cadence after: VREV recaps the next day and again at day 4; Five Star recaps at day 13.
- Format: every announce post is a single image or flyer-style post carrying date, time, place, and an RSVP line. Every recap is a carousel or reel. ARV's own reels are educational (investor tips, 1,000 to 4,000 plays) and are not used to promote events.
- Engagement: the highest event post is the Enduro single image with full detail (88 likes, 14 comments). The 9/15 three-host post (68 and 3) and the VREV recap carousel (78 and 3) follow. The bare-hashtag and "taking over" teasers drew 4 and 11 likes, so an announce with concrete detail out-drew a name-only teaser (inferred).
- Collabs: the co-author field returned no value on any post from either account, so no Instagram collab posts were used. Co-hosts were named in captions or @-tagged.
- Third-party reach: two community accounts (@recheatcodes, @realtyentrepreneur) carried the 9/23 call, and a contractor account (@officialcarlosmanzo, 10/5) carried a 61-like post about Neil Dutta. Partner and community accounts appear to do part of the reach.

## 2. Posting accounts

| Account | Handle | Followers | Posts in last 90 days | Avg per post, last 12 posts |
|---|---|---|---|---|
| Real Talk Media | @realtalkmediaproductions | 2,169 | at least 30 (scrape capped at 30; they span 9/22 to 10/20, about daily; total not determined) | 88 likes + 7 comments over 12 posts = 7.3 likes and 0.6 comments, 7.9 interactions (calculation) |
| Five Star Escrow | @fivestarescrow | 662 (366 posts all time) | at least 30 (capped at 30; they span 9/9 to 10/20) | 45 likes + 1 comment over 12 posts = 3.75 likes and 0.08 comments, 3.8 interactions (calculation) |

Last 12 posts by date. Real Talk Media, 10/9 through 10/20: likes 3, 2, 1, 0, 20, 0, 2, 11, 0, 34, 15, 0; comments 1, 0, 0, 0, 2, 0, 0, 0, 0, 4, 0, 0. Five Star Escrow, 10/6 through 10/20: likes 1, 2, 5, 1, 1, 1, 5, 4, 1, 20, 1, 3; comments 0 except one on 10/12. Median likes: RTM 2.5, Five Star 1.5 (calculation), so a few posts carry the averages: Five Star's average is lifted by the 20-like event recap, RTM's by two reels (34 and 20 likes).

Interaction rate per follower (calculation): RTM 7.9 / 2,169 = 0.37%; Five Star 3.8 / 662 = 0.58%. For comparison, the ARV 9/16 event post is 102 interactions on 1,757 followers = 5.8% (calculation).

Handle confirmation: @fivestarescrow is confirmed by its own 10/7 caption (Five Star Escrow team, alongside @vertigo_rev and @arv.finance). @realtalkmediaproductions is confirmed by content (Real Talk Media hashtags, Cashflow Podcast and Revive & Reveal episode posts, Linktree of the same name) and by search; Brett should confirm it is the account he posts from. The handle @realtalkmedia is a different, unrelated account (8 followers). RTM's reel plays run 40 to 2,400 (mostly 150 to 950), Five Star's 12 to 605.

## 3. Email reach: San Diego Investor Registry (NOT COMPLETE)

**What blocked it.** The Drive connector returns the sheet as a 9-row sample per tab; a CSV export returns HTTP 401; the local registry-data.json is a single-line 2026-09-02 snapshot (about 100,000 tokens) that cannot be read or counted with the tools in this session. Counts below are what the connector shows or the project record states. Nothing is estimated.

| Figure | Value | Source and date |
|---|---|---|
| Entity rows (Entities tab) | 360 | Tab range A1:R361, read 2026-10-20; matches the 2026-09-25 handoff note |
| Contact rows (Contacts tab) | 406 | Tab range A1:H407, read 2026-10-20 |
| Contact-to-entity links (ContactLinks tab) | 462 | Tab range A1:E463 |
| Contacts with an email, live | 169 of 406 | CMO count, 2026-10-20, live sheet read in the built-in browser (counted in page; no contact details exported) |
| Entities with an emailable contact, live | 182 of 360 | same |
| Entities with flips_count > 0 and an emailable contact, live | 84 of 153 (87 emailable contacts at those entities) | same |

**Emailable entities by added_by (CMO count; added_by is the entity's source, not necessarily where the email came from):** FSE Smartsheet 51 of 63; ARV flip report 46 of 103; Greg 26 of 44, plus Greg & Samantha 1 and the SDTT import 2026-09-15 2 of 59 (the founding-partner seed lineage, 29 total); Five Star escrow export 25 of 25; blank 18 of 42; DD 7 of 8; Noelle 2, Crystal 1, Crystal & Samantha 1, Jordan 1, RV 1, Audrey 0. Total 182.

Older snapshot for scale only (Investor Database MEMORY.md, 2026-09-02, before the 9/15 SDTT import and the CA SOS enrichment): 193 of 330 contact rows had an email; 174 of 301 entities had a reachable contact (email or phone, not email only); 153 entities had flip activity.

**Source of emails (what can be said).** The Contacts tab has no source column, so the source per emailable contact cannot be determined from the data. The Activity tab (2026-09-02) records where emails came from, in loads that overlap and cannot be added together:
- Five Star escrow export (109 files): 87 contacts with email.
- Zoho and Smartsheet pass: 106 emails added to existing contacts (107 Zoho name matches), plus 2 from Smartsheet Buyer Agent fields.
- SDTT Investors 8.20.2026 seed: the original 110 entities; email count at seed not recorded in the Activity detail that was visible.
- ARV flip report: 103 entities added with owner contacts; whether those contacts carry emails is not recorded.
- CA SOS enrichment (9/15 onward, 101 entities): the SosLog columns count people and phones only, so it appears to add phones, not emails (inferred).
Entities' added_by values seen in the sample: DD, Greg, Greg & Samantha, blank, and Brett Ward (SOS edits); several are blank, so source cannot be determined for those rows.

**Open from the plan (2a):** no contact opted in to marketing email; Brett must rule on which sources may be emailed and on unsubscribe before the first send.

## 4. Instagram presence of the 50 most active flippers (NOT DONE)

Blocked by the same limit: the top 50 by flips_count cannot be ranked without the full Entities tab, and the 9-row sample shows flips_count of only 0 to 3 on entities it contains. No Instagram searches were run for entities, so no counts, ranges, or tag overlap are reported. The appendix table is intentionally empty.

| Entity | Handle | Followers | Follows or tags VREV, ARV, RTM, Five Star |
|---|---|---|---|
| (none run) | | | |

One adjacent finding from item 1: third-party investor and agent accounts that appear around ARV events (@recheatcodes, @realtyentrepreneur, @karissashadoan, @alex_dadley of ARV, @tj_miller, @ccg.rea) tag or name ARV, so ARV's reach into investor accounts runs through community and agent accounts as well as flippers.

## Decision for Brett

To finish items 3 and 4, one of: (a) save the Entities, Contacts, and ContactLinks tabs as CSV into Drive (Business Development folder) and the sidekick reads them; or (b) run this task in a Code session with Python. Recommendation: (a), five minutes, and the 50-entity Apify spend stays near $0.40.

## Could not verify

- Live-sheet counts for item 3 and the entire item 4 (see above).
- That Instagram was the top attendance channel for the VREV and ARV events: no RSVP or attendance data; only post engagement.
- Event dates other than those printed in captions; the Petco Park night and the 6/9 ARV recap have no date or named event.
- ARV coverage before about 2026-07-24 (100-post cap); VREV San Diego sub-account (@vertigo_revsandiego) and Raleigh account were not profiled.
- Posts in the last 90 days for Five Star and Real Talk Media beyond the 30 returned.
- @realtalkmediaproductions as Brett's posting account (confirmed by content, not by Brett).
- Whether the scraper counts all posts by these accounts, and hidden like counts (a few third-party posts return -1).
- Story highlights, Stories, and Instagram collab invitations not exposed by the actors.

## Run and cost log

| Run | Actor | ID | Dataset ID | Output |
|---|---|---|---|---|
| Search VREV | apify/rag-web-browser | eUQOG59UXx4shiLih | TAJQFllSgg4wavtrH | 3 pages |
| Search ARV | apify/rag-web-browser | DPcPosH7Eb50NnJoT | sRZQiyhBvmI036gCX | 3 items |
| Search ARV Instagram | apify/rag-web-browser | dPd5L3ORoiN1Y1uQ2 | JUtnIkUDGNBOLCFPN | 4 items |
| Search Real Talk Media | apify/rag-web-browser | Xd1GxicLslMeNWcZr | 0g5vLH6kgbbzfdp4s | 4 items |
| Profile check, 8 guessed handles | apify/instagram-profile-scraper | RdZqw8LL9CdhSHaid | xxAq9AMzWDYOxEEpG | 6 profiles, 2 wrong accounts rejected |
| Single reel owner check | apify/instagram-scraper | vQRrz2vNXmvn0VmxI | JT1EBAWFmzMm9ikrC | 1 item |
| Posts: vertigo_rev, arv.finance | apify/instagram-post-scraper | wBQs6stP8IMQGFLhU | EnanmKQ6IVdRgRDYl | 139 items |
| Posts: fivestarescrow, realtalkmediaproductions | apify/instagram-post-scraper | Tgu9Er7rIunDtUqY6 | rxaJ7hMAyGz541b1Z | 57 items |
| Profiles, 4 confirmed handles | apify/instagram-profile-scraper | EVdh3nFL185BD8cxv | tid0e8blTznaTmNNw | 3 reported, 4 returned |

Cost (calculation from list prices, not read from the Apify bill): post scraper 196 items x $0.0015 = $0.294; profile scraper 9 items x $0.0023 = $0.021; instagram-scraper 1 item x $0.0023 = $0.002; subtotal about $0.32. The four rag-web-browser runs are priced per compute and result and were not itemized; compute units reported were 0.0247, 0.0138, 0.0312 (and one unreported), inferred under $0.10 combined. Estimated total under $0.50, well inside the $1 to $3 target and $5 cap. Only apify/ official actors were used for Instagram data.

Zoho writes: none. Tracerfy: none. Gmail, Asana, Smartsheet: not read.
