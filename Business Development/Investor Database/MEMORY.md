# Investor Database Memory

_Last updated: 2026-09-02_

## Portal (current direction, 2026-09-02)

- Google Sheet "Investor_Registry_DB" (id 11GI8XQWUkc_pyvUDzn6NRVvVU1Dp2vjeEOL56ouS4SE) + bound Apps Script "San Diego Investor Registry" (project 1hMFpWJXoFOFzkKLO8s9OmJSQSyBz95AXK2JULCt2PAGMsW5YzczXsts4). LIVE 2026-09-02, deployment v4, Execute as Me, Anyone with Google account. Portal URL: https://script.google.com/macros/s/AKfycbyIi93aLUkGPGbkblnGqyru8qIlOS6Y1XjIM54yqAxoOKdePBh71sPOss58nfoZ63EJ/exec — each person uses URL?key=<access_key> (keys on the Partners tab; admin_key in Config; all listed in portal/2026-09-02-portal-deployment-steps.md). Brett's own keyed link is required (Google does not expose the viewer email to this app, so the no-key admin path does not work). Sheet is never shared. Files in portal/: Code.gs, Index.html (v3, deployed as version 5 on 2026-09-02), deployment steps; Investor Registry DB.xlsx is the original v2 seed only, the live Sheet is authoritative. Schema v3: Contacts = one row per person (id, name, title, email, phone, notes); ContactLinks = contact_id/entity_id/role (many-to-many); Deleted = archive of deleted entities/contacts with reason and JSON snapshot (admin can restore from the Activity log dialog); Contacts_v2_backup = pre-migration copy. Title = person's title; role = affiliation on that entity link. Deletions require a reason; partners may delete contacts, only admin deletes entities. Ticking a partner box auto-clears that partner's 'Confirm … relationship' flag. Migration merged 33 exact-name duplicate contacts (330 rows -> 288 people); 1 contact flagged 'Verify merged contact'; 4 seed records with bad ids (blank, -2, -3, -4) were re-keyed on 2026-09-02. Data loads go straight into Sheet tabs (no redeploy); code changes need Deploy > Manage deployments > New version. Claude artifact pages are retired.
- Roles: admin (Config admin_emails, or admin_key) edits everything; a partner (key in link) ticks only their own column; anyone shared can edit details, contacts, add notes. Every write logged to Activity with the user's email.
- Future data loads write directly to the Sheet tabs (Entities, Contacts, Relationships, Notes); the JSON/template pipeline is retired once the Sheet is the source of truth.

## Artifact (superseded)

- San Diego Investor Registry: https://claude.ai/code/artifact/d12b85c5-c9f9-4fbe-a786-8ed53117af9e (private to Brett until shared; page carries its own data and republishes on edit)

## Project Status

**Phase 1: seed and clean (done 2026-09-02)**
- Seeded from Greg Ives' SDTT Investors 8.20.2026.xlsx: 115 source rows, 110 entities after 5 merges (see 2026-09-02-investor-registry-cleaned.xlsx, Merge log sheet)
- Cleaned: principals split out, added-by and added-date extracted, addresses normalized, FA internal notes dropped

**Phase 2: profiles and relationship model (done 2026-09-02)**
- Page rebuilt: entity profiles (contacts with role, email, phone; address; family with sibling links; notes), Contacts tab, per-partner relationship checkboxes, Shared-by count and filters
- Single-property LLCs (4384 Mississippi St LLC, Monroe Street LLC) and two individuals converted to contact records with Company missing flag
- Canonical source files in this folder: registry-data.json, registry-template.html (rebuild = inject JSON at __DATA__, republish to the artifact URL)

**Phase 3: populate (in progress)**
- 2026-09-02 cross-reference of Zoho and Smartsheet done: 173 entities; Brett Yes on 19, Greg Yes on 110, Vertigo (Jakob Hedger) Yes on 70. 62 Vertigo counterparties and Three Arch Capital added from FSE Team 3 records, all flagged for entity-name check and contacts.
- 38 entities carry a "Confirm Five Star relationship" flag: named on Five Star files but directing customer not confirmed. Brett to review.
- 2026-09-02 ARV Finance Flip Reports loaded (Neil Dutta, six monthly reports Oct 2024 to Jan 2026, 435 flip sales): 276 entities total, 153 with flip activity, 103 entities added with owner contacts. Flip counts show on the page (Flips column, Active flipper filter) and in the workbook. No relationships marked from this source.
- 2026-09-02 Five Star escrow export loaded (109 closed files, Nov 2025 to Sep 2026, nearly all SD VREV resales): 301 entities; buyer contact name, email, phone added (87 contacts with email); 25 records added. Partner Neil Dutta (ARV Finance) added; ARV = Yes where ARV is the lender (46), Vertigo = Yes where seller is SD VREV (94 total).
- Remaining partners still to add (names pending). Status Investments is no longer active; not added.
- Share the page with partners and confirm edit vs. view access

- 2026-09-02 Zoho contact pass: 107 registry contacts matched on first and last name; 106 emails, 94 phones, 53 mailing addresses added. Smartsheet Buyer Agent fields gave 2 more. Coverage now: 193 of 330 contacts have email, 175 have phone; 174 of 301 entities have a reachable contact. 127 entities still have no email or phone.
- 2026-10-29 live count (CMO, read in the built-in browser): 169 of 406 contacts have email, covering 182 of 360 entities and 84 of the 153 entities with flip activity. The Drive connector returns only a 9-row sample of this sheet, so count it in the browser or from a CSV export.
- Next: partner exports (Greg: First American files for his 110; Neil: ARV borrower list; Jakob: Vertigo buyer list) in the escrow-export format. Then CA SOS bizfile for entities still without a contact. LinkedIn and public-record scrapers rejected.

**Open review items**
- 18 records flagged Needs review (includes 4 Company missing and Improve Imperial LLC as a possible single-property LLC) (missing last names, spelling calls, alias conflicts)
- 5 Star Housing lists Redwood Holdings as an alternate entity; conflicts with the Wedgewood-owned Redwood Holdings record. Verify with Greg.
- Confirm whether outside partners can edit the shared page or only view it once shared

## Key Decisions

- Page-as-record model instead of a database-backed page: database-backed artifacts are restricted to Brett's claude.ai organization, so outside partners could not open them. (2026-09-02)
- Merge duplicates into one record per legal entity with aliases kept; entity family tags link related entities without merging. (Brett, 2026-09-02)
- Drop First American internal notes: order numbers, SDTT/SCTG/TEC splits, Ralph/Darth approvals. (Brett, 2026-09-02)
- No partner attribution. Track only whether each partner has a relationship with the client; one to four partners may share a client. (Brett, 2026-09-02)

- Single-property LLCs are not entities. A contact whose only entity is a single-property LLC is a contact record with Company missing. (Brett, 2026-09-02)
- Relationship model: per-partner checkbox plus a notes field; no strength or status levels. (Brett, 2026-09-02)
- Five Star relationship rule: an entity is a Five Star client only when it or its principal directs escrows to Five Star (Smartsheet Directing Customer, or Zoho Client: ACTIVE/INACTIVE). Zoho tags "Client: WeRevive / Dwell West / Vertigo / H&A" mark clients of investor clients, not Five Star clients. Past direct clients are Yes with a "past client" note. (Brett, 2026-09-02)
- Vertigo (Jakob Hedger, Vertigo Real Estate Ventures) is a registry partner. Its relationships are the entity-type counterparties on Vertigo-directed files in FSE Team 3. (Brett, 2026-09-02)
- Data sources: Zoho Contacts custom views 1575093000020616021 (Five Star active clients) and 1575093000176431198 (WeRevive agent clients); Smartsheet report "All Escrows (365 Day Lookback)" id 21579774775172; FSE Team 3 sheet id 339384860993412 holds the Vertigo book.
- ARV Flip Report = market data. It lists every flip resale in San Diego County by owner and entity; it is not ARV's client list. Use it for activity and for finding investors, never as relationship evidence. Gmail API returns the full body; no need to open clipped messages in a browser. (2026-09-02)
- Source message IDs for the flip reports: 19ca029b72bf83b1 (Jan 2026), 19bebd0aa14321b7 (Dec 2025), 19b2d41c2e69e20c (Nov 2025), 19aa3d88212e5875 (Oct 2025 via Jim McInerney), 195f7d7d3ac20930 (Jan 2025 via McInerney), 195f7d76d283a11d (Oct 2024 via McInerney). Parser: registry source folder, arv/parse_arv_flips.py in the Cowork workspace.
- Neil Dutta (ARV Finance) is a registry partner. ARV relationship evidence = ARV Finance as lender on a Five Star file. The flip report never marks relationships. (Brett, 2026-09-02)
- Vertigo aliases: SD VREV LLC, SDVREV, Vertigo Real Estate Investments. (Brett, 2026-09-02)
- Escrow export field map: Buyer Name (entity, strip legal suffix), Buyer Contact First/Last, Buyer Email, Buyer Work Phone, Seller Name, Lender Name, Title Company Name. Re-export from the escrow software periodically and rerun; the mapping lives in the Cowork workspace script apply_escrow.py (copy in this folder as fse-escrow-export-loader.py).
- Why the artifact pages were dropped: Brett's Claude org is single-person, so org-only sharing had nobody to share with, the public link was disabled by the page's runtime capabilities, and Team seats for partners were rejected. Partners must never get Zoho or Smartsheet access; the portal is their only surface, and Zoho/Smartsheet are pushed/pulled from Brett's side. (Brett, 2026-09-02)
- v1 deployed as "execute as user accessing" looped on Google's unverified-app consent screen for Brett. Switched to execute-as-me + access keys so no partner ever sees an OAuth prompt. Keep it that way. (2026-09-02)
