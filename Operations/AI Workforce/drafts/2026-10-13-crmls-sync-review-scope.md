# Scope: agent review and report for the CRMLS to Zoho sync

_Personal Layer while it runs for Brett; the method is a Shared Core candidate. COO, 2026-10-13. Asana: "Agent review and report: CRMLS to Zoho sync (replaces Michelle's monthly check)", AI Workforce, COO section (1219044492585867). Status: awaiting Brett's two decisions, then Elizabeth's review._

## What it replaces

Michelle's monthly "Compare CRMLS Data w/ Zoho Listings" (Operations Projects & Tasks and Michelle's World, next due 2026-11-02). For about eight spot-check dates per month she exports the CRMLS Matrix saved search "Zoho Listing Data Comparison" for one day's new listings, lays it beside a Zoho Listings view filtered to the same MLS Date, color-codes rows (red missing, blue found by search, yellow out-of-area or blacklisted per the "MLS Data Sync Blacklist" doc), and comments on the task. Elizabeth's "Review MLS Data Sync Findings" (due 2026-11-03) follows it.

## What the COO found before scoping (read-only)

| Check | Result |
|---|---|
| Michelle's 9/6 sheet: 7 listings marked "Not yet in Zoho" at her 6:01 PM export | 6 were created in Zoho at 7:16 PM the same evening (one sync batch). The 7th, PT26195489, has a "PT" prefix, outside the whitelist, so the sync correctly skipped it |
| Same sheet: 3 listings flagged for out-of-area agents (San Ramon, Newark, Laguna Beach) | All 3 are in Zoho; the sync has no agent-location filter |
| Zoho alone | Cannot show a listing CRMLS has and Zoho lacks. The missing-listing check needs a CRMLS-side list; every other check reads Zoho's Bridge fields |
| Stale Active (2026-10-13) | 9,069 Active; 2,231 synced in the past week; 4,355 not since 9/13; 4,032 not since 8/13 (1,183 not since 2025-10-13); 879 never synced. A smooth tail by age, no single cutoff date. Whether they are still active in CRMLS: could not verify from Zoho |

So the September check found no real gaps; its red rows were export timing. The agent compares at least 24 hours after entry.

## The system

| Item | Answer |
|---|---|
| Users | Elizabeth (owner, acts on gaps), Michelle (current checker, compares the side-by-side run) |
| Source of truth | CRMLS (Trestle feed) for what should exist; Zoho Listings (`List_It_Live`) for what synced |
| Platform | Zoho through the connector (read-only), CRMLS through the source Brett picks below |
| Worker | zoho-specialist, CRMLS mode (read-only, sonnet). This is its first real dispatch. The worker has no browser: the COO reads the CRMLS saved search in the built-in browser and supplies the list |
| May touch | Reads only. No Zoho write, no sync button, no Aether contact. A confirmed gap is reported to Elizabeth |

## What the report compares (weekly until stable, then monthly; Brett, 2026-10-13)

0. **Stale Active first (Brett's concern):** count and trend each run; the first run looks up 20 listings across the age bands in CRMLS to tell a sync defect (for Aether) from listings that are legitimately unchanged.
1. **Missing:** listings CRMLS entered in the week that pass the sync filters (whitelist prefixes, blacklist brokers, price and property type) but are not in Zoho 24+ hours later. New construction listings count as expected skips (Brett's working assumption, 2026-10-13; Elizabeth can correct it); the run checks New Construction on each missing listing.
2. **Should not be there:** Zoho listings created in the week with a blacklisted prefix or broker.
3. **Status drift:** new `Property_Status` spellings since the last run (read-side only; fix is "ask Aether").

## Report format and where it lands

Emailed by the COO to Elizabeth and Michelle (Brett is the sender) in the "CRMLS to Zoho check: weekly agent review" thread, with the report attached as Word. Each finding carries a classification and an owner (for example, Redfin | Expected Exclusion | no action). A week with no meaningful discrepancies is a brief confirmation with the report attached (Elizabeth, 2026-10-16).

## Definition of done (proposed)

1. Weekly runs start once the Matrix login and CRMLS terms are confirmed.
2. Michelle runs her 11/2 check as usual and compares it with the agent's reports for the same period: every real gap she finds is in them, and no agent row is false.
3. Weekly drops to monthly after two consecutive weeks with no real gaps and the stale Active count explained or fixed.
4. Elizabeth approves retiring Michelle's task; the COO closes it on her yes and the run moves to a schedule.

## Questions for Elizabeth (only what needs her knowledge)

1. Out-of-area agents: should those listings be in Zoho, and what do you do with a yellow row today?
2. Is the "MLS Data Sync Blacklist" doc current? The operations map also lists a $500K price floor, local office keys, and residential plus residential income from 2026-07.
3. Who besides you should see the monthly report?

## Decisions (Brett, 2026-10-13)

1. CRMLS-side source: the agent reads the "Zoho Listing Data Comparison" saved search results in the built-in browser, no export. Uses Brett's own Matrix login in the built-in browser; compliance confirmed by Brett 2026-10-13. The COO records how often the session logs out (signed in about 13:00 PT 2026-10-13). Weekly search: "COO Weekly Sync Check" on Brett's Matrix profile (created 2026-10-13: Residential and Residential Income, San Diego County, $500K+, Original Entry Timestamp 1 to 7 days ago; 596 listings on creation). New Construction is read on missing listings only. Proof read 2026-10-13: 57 listings, 49 in Zoho, 4 correctly skipped by prefix, 4 new-construction NDP listings from one agent not in Zoho (cause unverified).
2. Scope goes to Elizabeth by email from the COO, sent on Brett's yes to the draft. The email opens "This is the COO" with no reference to Brett (Brett, 2026-10-13).
3. Weekly, not monthly, until errors drop; the 4,000+ stale Active listings are the first concern (Brett, 2026-10-13).
