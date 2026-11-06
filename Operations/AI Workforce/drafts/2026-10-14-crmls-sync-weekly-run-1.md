# CRMLS to Zoho sync check: weekly run 1

_COO, 2026-10-14. Asana: "Weekly run 1: CRMLS to Zoho sync check" (1219474421231076), under "Agent review and report: CRMLS to Zoho sync" (1219044492585867), AI Workforce, COO section. Scope: drafts/2026-10-13-crmls-sync-review-scope.md. Status: comment posted 2026-10-14 on Brett's go; operations map updated._

## Sources

| Side | What was read |
|---|---|
| CRMLS | Matrix saved search "COO Weekly Sync Check" (Brett's profile, built-in browser), read 2026-10-14 about 10:45 AM PT. Range stored as Original Entry Timestamp "1-7" (relative), so it rolls forward. 587 listings. Agent Full detail read for 40 missing listings and 20 stale samples |
| Zoho | Listings (`List_It_Live`) by COQL: Name in the 546 whitelisted MLS numbers (11 batches); zoho-specialist (sonnet) for stale counts, creates since 10/7, and status drift. COO re-ran 2 of its counts (both matched) |
| Rules | "MLS Data Sync Blacklist" doc (Drive, last edited 2025-07-09); operations map CRMLS row |

## 1. Missing listings

587 in CRMLS. 41 have blacklisted prefixes (correct skips). Of the 546 whitelisted, 506 are in Zoho and 40 are not.

| Group | Count | Finding | Action |
|---|---|---|---|
| Residential Income | 26 of 26 | No Residential Income listing reached Zoho. 18 went on market 10/7 to 10/12 from offices not on the blacklist, all $899K to $6.8M; 8 went on market 10/13 or 10/14 (under 24 hours, recheck next run). Consistent with 260013942SD (in Zoho since 2026-06-28, never synced) and the open July Aether thread on the residential-income change | Elizabeth emails Aether: the 2026-07 residential-income change is not syncing any listings |
| Redfin | 7 | 260024737SD, 260024749SD, 260024394SD, 260024638SD, 260024486SD, 260024490SD, 260024350SD | None. Redfin is a blacklisted broker |
| Shea Advantage (new construction) | 4 | NDP2609479, NDP2609468, NDP2609485, NDP2609467 (the 4 NDP listings from the 10/13 proof read) | None. Blacklisted broker |
| KB Home Sales (new construction) | 3 | NDP2609402, NDP2609326, NDP2609337 | None. Blacklisted broker |

Residential Income listings not in Zoho (on market date, listing office):

| MLS # | On market | Office | Price |
|---|---|---|---|
| 260024357SD | 10/07 | Starker West, Inc. | $1,297,000 |
| NDP2609324 | 10/07 | Golden Key Properties, Inc. | $1,895,000 |
| 260024419SD | 10/08 | Keller Williams La Jolla | $1,299,000 |
| 260024480SD | 10/08 | LPT Realty, Inc | $1,299,000 |
| 260024519SD | 10/09 | CCG RE Investment Services Inc | $1,499,000 |
| 260024524SD | 10/09 | CCG RE Investment Services Inc | $1,399,000 |
| 260024586SD | 10/09 | TXR Homes, Inc. | $900,000 |
| 260024573SD | 10/09 | AppleTree Real Estate Inc | $6,795,000 |
| 260024631SD | 10/10 | CURB | $2,599,999 |
| 260024297SD | 10/10 | Berkshire Hathaway HomeServices California Properties | $3,400,000 |
| 260024670SD | 10/11 | Terrence Michael Pirtle, Broker | $899,000 |
| 260024491SD | 10/12 | eXp Realty of Southern CA | $999,000 |
| 260024682SD | 10/12 | Palma Commercial | $1,875,000 |
| 260024687SD | 10/12 | Starker West, Inc. | $1,625,000 |
| 260024684SD | 10/12 | Starker West, Inc. | $1,625,000 |
| 260023593SD | 10/12 | Coldwell Banker Realty | $2,475,000 |
| 260024692SD | 10/12 | Coldwell Banker Realty | $1,249,000 |
| 260024714SD | 10/12 | Goat & Dime | $1,000,000 |
| 260024731SD | 10/13 | Bluxen, Inc. | $995,000 |
| 260024786SD | 10/13 | Whitewater CRE Inc | $2,795,000 |
| 260024782SD | 10/13 | Bridgepoint Realty Inc | $1,995,000 |
| PTP2607694 | 10/13 | eXp Realty of California, Inc. | $1,099,999 |
| 260024775SD | 10/13 | AARE | $2,200,000 |
| PTP2607644 | 10/14 | Keller Williams Realty | $1,100,000 |
| 260024798SD | 10/14 | Real Broker | $1,249,000 |
| 260024802SD | 10/14 | South Coast Commercial, Inc. | $1,500,000 |

## 2. Stale Active listings (Brett's first concern)

| Cut (Zoho, Property_Status Active) | 10/13 | 10/14 | Change |
|---|---|---|---|
| Active total | 9,069 | 9,050 | -19 |
| Not synced before 9/13 | 4,355 | 4,335 | -20 |
| Not synced before 2025-10-14 | 1,183 | 1,183 | 0 |
| Never synced | 879 | 879 | 0 |

CRMLS lookup of 20 samples across the age bands (17 found; PTP2304629, 230024280SD, 230009669 not returned by Matrix):

| Result | Count | Listings |
|---|---|---|
| Correct: still Active, nothing changed since the last sync | 6 | PTP2605085, 260016342SD, 250036439SD, 260015902SD, NDP2607458, PTP2606015 |
| Wrong in Zoho: Closed, Expired, or Canceled in CRMLS, Active in Zoho | 9 | NDP2606315 (Expired 9/15), 260019466SD (Closed 9/04), NDP2308604 (Closed 2024-02), PTP2304340 (Expired 2025-01), 180038420, 180037542, 180030269, 180041960, 180042578 (2018 to 2020, never synced) |
| Out of date: still Active, but CRMLS modified after the last sync | 2 | 260019552SD (modified 9/19, last synced 8/14), 250039915SD (modified 10/04, last synced 8/13) |

So the stale count mixes two things: listings that are simply unchanged (correctly not re-synced), and status changes the sync missed. The 9/04 and 9/15 status changes should have been caught by the 30-minute "updated in the past week" pass. The 2018-era never-synced records look like pre-sync imports that no process will ever close.

## 3. Should not be there (created since 10/7)

504 created: 490 by the sync user, all inside the whitelist; 14 by a Zoho user named "Dayrit" (not in the OS files). Ten have non-MLS names (15621-BH, 15647-BH, 15653-BH, 15655-SR, 15658-BH, 15664-BH, 15644-BH, 15672-BH, 15668-BH, 15656-BH) with no status or price. Four have MLS-style names and never synced: 260023530SD ($400,000), 260024428SD ($499,000), NDP2609199 ($459,000), 260023624SD ($999,000).

## 4. Status drift

No new `Property_Status` values from the sync since 10/7. Legacy values outside the known set: Off Market 262, RENTED 62, CONTINGENT 38, BACK ON MARKET 8, For Sale 1, "Coming Soon - listed on personal site" 1, blank 2,411.

## Run notes

1. Matrix logout: signed in about 13:00 PT 10/13, signed out at the morning read 10/14. Each weekly run needs Brett's sign-in.
2. Saved search range is relative ("1-7"), confirmed rolling forward.
3. The page wrote to the clipboard once during a synthetic click (Matrix copy handler); nothing was copied on purpose.

## Staged: comment for Elizabeth

On "Review MLS Data Sync Findings" (1219198050204242). Comments addressed to a person wait for Brett's go.

> This is the COO. Weekly CRMLS to Zoho check, run 1 (listings entered 10/7 to 10/13; read 10/14).
>
> 1. Residential Income is not syncing. None of the 26 Residential Income listings in the week reached Zoho; 18 are more than a day old and from offices not on the blacklist (for example 260024357SD, 260024519SD, 260024297SD, 260024573SD). 260013942SD has the same problem since June. Can you send these to Aether as a defect in the July residential-income change? Full list: Operations/AI Workforce/drafts/2026-10-14-crmls-sync-weekly-run-1.md.
> 2. Missed status changes. Of 20 stale Active listings I looked up in CRMLS, 9 are Closed, Expired, or Canceled there but still Active in Zoho. Two recent ones: NDP2606315 (Expired 9/15) and 260019466SD (Closed 9/04). Worth adding to the same Aether email: why the weekly re-check missed them.
> 3. Five 2018 listings (180038420, 180037542, 180030269, 180041960, 180042578) are Active in Zoho, never synced, and long closed or expired in CRMLS. There are 879 never-synced Active records like these. Do you want them left as they are, or a cleanup proposed?
> 4. Who is the Zoho user "Dayrit"? They created 14 Listings this week, ten with names like 15621-BH and no status, and three MLS-style ones under $500K (260023530SD, 260024428SD, NDP2609199). Are these intended?
>
> Everything else checked out: the other 14 missing listings are Redfin, Shea Advantage, and KB Home (blacklisted), and the sync created nothing outside the whitelist.

## Update 2026-10-14 (Brett's review)

Correction: the 879 never-synced Active records are not mostly from 2018 (that came from the 5 oldest samples). By Listing Date: 2019 to 2022, 313; 2023 to 2024, 445; 2025, 18; 2026, 43; blank, 60. Creators: sync user 439, Elizabeth 354, Dayrit 54, others 32.

Stale Active (not synced since 9/14), 4,344 by Listing Date: before 2023, 1; 2023, 77; 2024, 844; Jan to Jun 2025, 286; Jul to Dec 2025, 351; Jan to Mar 2026, 872; Apr to Jun 2026, 1,527; Jul 2026, 226; Aug 2026, 131; Sep to Oct 2026, 28; blank, 1. 2,784 (64%) were listed in 2026.

Brett decided: clean up everything listed before 2025 (1,681: 758 never synced plus 923 stale); the 121 recent or undated never-synced records get a one-by-one check. Elizabeth's report (_Outbox/2026-10-14-crmls-zoho-weekly-check-run-1.docx) section 3 carries the Zoho filters for each set.
