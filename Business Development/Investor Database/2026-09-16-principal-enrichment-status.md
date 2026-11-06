# Principal Enrichment — Status 2026-09-16

## Objective
Replace Jordan Smith's manual BeenVerified lookups: for each registry entity, find the people behind the LLC and a phone number. Email not required. Outreach is B2B; DNC flags not stored or shown.

## Sources tested

| Source | Result | Decision |
|---|---|---|
| PropertyRadar (web app sample, 20 entities) | Principal + phone/email on 6 of 20; LLC-only on 8; no match on 6. API not in trial; Solo $119/mo. | Dropped. |
| Tracerfy person lookup (MCP connector, 5 credits/hit = $0.10) | Phone on ~60% of principals with a residential address. Misses on newer LLC operators and business/mail-drop addresses. | Keep for phones. 1,915 credits remain. |
| CA Secretary of State (bizfileonline, Statement of Information PDF) | Principal names on ~75% of matched entities. Free. Site rate-limits at ~80 queries/day (HTTP 429). | Works for small batches only. Bulk pass failed overnight (11 done, 67 rate-limit hits). |
| FastAppend Business Trace (Tracerfy sister product) | Company name + state → principals, roles, phones. $0.20/match, misses free. $200 minimum purchase. | Recommended for the remaining ~170 entities and all future prospect batches. |
| BeenVerified | Manual only, same data as Tracerfy, ToS forbids commercial use / account sharing. | No. |
| Tracerfy Appending credits ($0.10) | Duplicates Tracerfy person lookup. | No. |
| PropStream corporate skip trace | Returns company contact info, not principals. | No. |
| BatchData | Pierces LLCs; $2,000/mo minimum. | No. |

## Written to the registry (2026-09-15)
- 23 entities, 30 principals, 18 with phone. Tracerfy spend: 85 credits ($1.70).
- Contacts: 14 added, 19 updated (title/notes; phone only if blank). 17 new links.
- Every affected entity flagged `Principals from CA SOS: verify`. Contact notes carry SOI date, role, address, alt phone.
- Existing phones never overwritten. Ryan White (Ryno LLC): Tracerfy match was age 82, likely a relative; flagged in note.
- `importPrincipals(payload)` added to Apps Script Code.gs (saved; no redeploy needed).

## Remaining
- 51 entities with no contact; ~120 with a name but no phone.
- Options: (a) FastAppend $200 Business credits, run in minutes; (b) manual SOS at ~80/day; (c) partial delivery — list of 51 for Greg's team to fill.

## Repeatable process (once FastAppend is funded)
1. Export entities lacking a contact or phone from the Sheet.
2. FastAppend Business Trace (name + CA) → principals + phones.
3. Tracerfy for phones on any principal FastAppend returns without one.
4. `importPrincipals` via Apps Script → contacts, links, flag, Activity log.
5. Report counts and spend.

## Files
- Session workspace: `sos/principals_2026-09-15.json` (all principals + phones found), `sos/sos_inject.js` (SOS lookup script for the bizfileonline tab), `portal/Code.gs` (with importPrincipals).
