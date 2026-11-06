# CRMLS to Zoho sync check: weekly run 2

_COO, 2026-10-21. Asana: "Weekly run 2: CRMLS to Zoho sync check" (1219516089009000), under "Agent review and report: CRMLS to Zoho sync" (1219044492585867), AI Workforce, COO section. Scope: drafts/2026-10-13-crmls-sync-review-scope.md. Status: emailed to Elizabeth and Michelle 2026-10-21 11:43 AM PT on Brett's go, report attached (_Outbox/2026-10-21-crmls-zoho-weekly-check-run-2.docx). Run 2 task complete.

## Sources

| Side | What was read |
|---|---|
| CRMLS | Matrix saved search "COO Weekly Sync Check" (John Casarietti's profile, built-in browser), read 2026-10-21 about 11:00 AM PT. Criteria: Residential and Residential Income, San Diego County, $500K+, Original Entry 10/14 to 10/20. 635 listings; 634 read (one row on page 4 did not parse and was not identified). Agent Full detail read for the 12 missing listings |
| Zoho | Listings (`List_It_Live`) by COQL, COO in session: all 792 created since 10/13, then Name lookups for the 23 not in that set and for the week's 33 Residential Income listings; stale counts; creates by user and status. No specialist dispatched |
| Rules | "MLS Data Sync Blacklist" doc (Drive, last edited 2025-07-09): whitelist PTP, NDP, ND, SD; 27 blacklisted prefixes; 9 blacklisted brokers |
| Asana | "Review MLS Data Sync Findings" (1219198050204242): no reply from Elizabeth to the 10/14 comment |

## 1. Missing listings

634 read. 27 have prefixes outside the whitelist (CV, IV, OC, PF, PT, SR, SW, WS, and one CLAW number): correct skips. 607 whitelisted (605 SD, NDP, PTP plus 2 ND). 595 are in Zoho (584 created this week, 11 created earlier as Coming Soon). 12 are not.

| Group | Count | Listings | Finding | Action |
|---|---|---|---|---|
| Redfin | 7 | 260025117SD, NDP2609597, 260025076SD, 260024903SD, 260024907SD, 260024905SD, 260024987SD | Blacklisted broker | None |
| On market today | 2 | 260025333SD (The Agency, $2,100,000), 260025329SD (Serhant California, $610,000) | On Market Date 10/21; under 24 hours | Recheck next run |
| Opendoor | 1 | 260025128SD (Opendoor Brokerage Inc., $675,000, on market 10/17, townhouse) | Expected exclusion: Andrew (Aether, 10/20) says the sync excludes Opendoor, which the blacklist doc omits | Elizabeth confirms the final broker list for Andrew |
| Residential Income | 2 | NDP2609529 (CPM Realty, $3,950,000, on market 10/14), 260024859SD (LPT Realty, $799,000, on market 10/14) | Potential sync issue: the other 31 this week are in Zoho. Andrew's 10/20 backfill covered the 30 in Elizabeth's attachment, and the sync looks back only three days, so listings last changed before about 10/17 may have been missed (inference, not verified) | Elizabeth asks Andrew to pull both |

## 2. Residential Income (run 1 finding)

Fixed as of 10/20. All 26 run 1 listings are now in Zoho (25 created 10/20 9:27 to 9:29 AM PT). 31 of this week's 33 Residential Income listings are in Zoho, every one created on 10/20 between 9:10 AM and 11:11 PM across the normal sync runs, none before 10/20. 260013942SD (stuck since June) synced 10/20 and is now Closed. Who made the 10/20 change: could not verify from Zoho.

## 3. Stale Active

| Cut (Zoho, Property_Status Active) | 10/13 | 10/14 | 10/21 | Change since 10/14 |
|---|---|---|---|---|
| Active total | 9,069 | 9,050 | 9,211 | +161 |
| Not synced before 9/13 | 4,355 | 4,335 | 4,203 | -132 |
| Not synced before 2025-10-14 | 1,183 | 1,183 | 1,183 | 0 |
| Never synced | 879 | 879 | 878 | -1 |

Missed status changes from run 1 are unchanged: NDP2606315 (Expired 9/15 in CRMLS) and 260019466SD (Closed 9/04) are still Active in Zoho, last synced 8/13 and 8/12. 260019552SD and 250039915SD still last synced 8/14 and 8/13. The 1,183 and 878 counts have not moved. Andrew (10/20) explains why: the sync looks back three days, falls behind, and never re-checks listings dated over 12 months ago. Aether is running a fix alongside the current sync, then proposes a one-time refresh by MLS number of every Active record; Elizabeth (10/16) asked that no historical changes be made yet. So Brett's 10/14 pre-2025 cleanup now waits on that refresh and on Elizabeth's two answers to Andrew.

Of the 758 never-synced Active records listed before 2025 (Andrew's second question): 429 created by the Ward user (shared by the sync and Brett, so they cannot be told apart), 304 by Elizabeth, 25 by three other users.

Zoho also created about 60 older listings on 10/20 (MLS numbers from 2026-01 to 2026-09, for example 260003693SD, 260013283SD, PTP2601938), alongside the Residential Income batch. Consistent with a backfill on 10/20; cause not verified.

## 4. Created since 10/14

720 Listings: 705 by the sync user, 15 by Dayrit. Of Dayrit's, 11 have escrow-number names with no status (15676-SR, 15678-BH, 15681-SR, 15620-BH, 15572-BH, 15682-BH, 15683-BH, 15684-BH, 15687-JD, 15685-JD, 15689-BH); 15687-JD matches the JD file opened in the Hub 10/19. Four are MLS-style: 260024041SD and NDP2609200 (Active, never synced), PTP2607694 and 260024972SD (since synced).

## 5. Status drift

Creates since 10/14 use only Active, ComingSoon, Pending, Hold, Closed, Expired, Canceled, Withdrawn, and blank (11, all Dayrit escrow records). No new values.

## Run notes

1. CRMLS entry: https://member.recenterhub.com (redirects to signin.crmls.org). REcore Workspace > Matrix opens matrix.crmls.org in a new tab, which the pane blocks from Claude's click; navigate to https://matrix.crmls.org/Matrix/Default.aspx instead. crmls.mlsmatrix.com fails.
2. Saved search runs from My Matrix > Saved Searches > expand row > Results (/Matrix/SavedSearches/Run?id=14489891). The HotSearches run URL errors for non-favorites.
3. Speed bar keeps the last shorthand ("cross $500000+"); clear it before typing MLS numbers.

## Context from email (read 2026-10-21)

1. Elizabeth, 10/16 ("CRMLS to Zoho check: weekly agent review"): weekly findings go by email to Brett, Michelle, and her; a high-level summary with a classification and owner per finding; Dayrit is Michelle Dayrit, who creates listings for escrow files by hand (expected, not sync failures); no historical changes yet.
2. Michelle, 10/19: her "Zoho Listing Data Comparison" search is Residential only, all statuses, San Diego County, $500K+. Ours adds Residential Income. Goes into the consolidated rules list.
3. Andrew (Aether), 10/20 ("Listing Missing in Zoho (& CRMLS searches)"): Residential Income fixed 10/20 (feed sends "ResidentialIncome"); status-change fix in a parallel run; one-time refresh proposed after it, with two questions to Elizabeth; the sync excludes Opendoor, does not yet exclude Finest City Homes & Loans or Reefpoint; the sync only creates listings dated within the last 12 months.

## Sent: email for Elizabeth and Michelle

Sent 2026-10-21 as a reply in "CRMLS to Zoho check: weekly agent review" (message 1a15fc6e30ee1fd8), to Elizabeth and Michelle, report attached.

> This is the COO. Weekly CRMLS to Zoho check, run 2 (listings entered 10/14 to 10/20, read 10/21). Full report attached.
>
> Needs attention
> 1. Residential Income | Potential Sync Issue | Elizabeth to ask Andrew. His 10/20 fix worked: all 26 from last week and 31 of this week's 33 are in Zoho. Two are still missing: NDP2609529 and 260024859SD (both on market 10/14). They may have fallen outside the sync's three-day look-back before the fix.
> 2. Broker blacklist | Decision Needed | Elizabeth. Andrew confirmed the sync excludes Opendoor, which is not on our blacklist doc, and does not yet exclude Finest City Homes & Loans or Reefpoint. 260025128SD (Opendoor) was skipped this week for that reason. Once you confirm the final list, I will update the doc and the rules list.
>
> Tracking
> 3. Status changes | Known Issue, Aether fixing | Aether. NDP2606315 (Expired 9/15) and 260019466SD (Closed 9/04) are still Active in Zoho; I will use them to confirm the fix when it goes live. Active listings not synced since 9/13: 4,335 last week, 4,203 now.
> 4. Older records | Waiting on Andrew's two questions | Elizabeth. For his second question: of the 758 never-synced Active records listed before 2025, 304 were created by you, 429 by the Ward user (the sync and Brett share it, so I cannot separate them), and 25 by other users.
>
> No action needed
> 5. Redfin | Expected Exclusion | 7 listings correctly excluded.
> 6. New listings | Still Processing | 2 went on market today; I will recheck next week.
> 7. Michelle's escrow records | Expected | 11 created this week, as you described.
>
> COO
