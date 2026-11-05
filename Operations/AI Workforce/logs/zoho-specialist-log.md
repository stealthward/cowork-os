# zoho-specialist work log

_Written by the COO for each dispatch. Started 2026-10-13._

## 2026-10-13 | Seeded run (COO)
- Targets: S1 Listings Property_Status drift; S2 Listings Active but not synced since 2026-09-13; S3 Contacts created since 2026-09-13 (baseline in evals/zoho-specialist-eval.md).
- sonnet (claude-sonnet-5-5, brief v1 through general-purpose, agent type not yet registered): pass, 4.3 weighted, no auto-fail. S2 exact (4,355; 1,183; PTP2304629; 879). S3 exact (0 email duplicates), plus 2 org-wide placeholder emails and 3 likely name duplicates, none merged. S1: small values exact, large ones as ranges only because COUNT failed for it. 96 tool calls, 168K tokens.
- haiku (claude-haiku-5-5, same setup): fail on criterion 1 (no counts for S1 or S2), no auto-fail. Traps passed; same 3 name pairs. Listed "For Sale" as valid. 98 tool calls, 203K tokens.
- Fix: brief rule 2 now gives the working COUNT(id) syntax and bans counting by paging. Haiku rerun on the registered agent type (tools enforced) below.
- Writes proposed: none. Writes applied: none.
- haiku rerun (claude-haiku-5-5, brief v1.1, registered zoho-specialist type, read-only tools enforced): fail, 3.7 weighted, no auto-fail. Paged instead of COUNT; SOLD, Closed, EXPIRED as lower bounds. Result: sonnet holds.

## 2026-10-14 | Weekly run 1, CRMLS mode (COO)
- Target: Listings, Zoho side of the weekly CRMLS check (stale Active trend, 20-listing stale sample, should-not-be-there since 10/7, Property_Status drift). No CRMLS list supplied.
- sonnet (registered type): 31 tool calls, 141K tokens. Two counts re-run by the COO matched (4,335; 504 with 490/14 split). Counted with COUNT(id); paged only to filter 504 names locally (COQL has no not-like).
- Writes proposed: none. Writes applied: none.
