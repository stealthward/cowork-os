# Investor Registry — Phone Backfill Handoff
Date: 2026-09-25 | Owner: Jordan | Source of record: San Diego Investor Registry (Google Sheet)

## Where this stands
- 360 entities in the registry. 101 have been run through CA Secretary of State.
- Automated enrichment is now STOPPED. The state's site blocks scripted access; the scheduled task was deleted 2026-09-25.
- 92 entities remain with a named contact but no phone. Worklist: `2026-09-25-remaining-92-need-phone.csv`

## What was already done for you
For the 101 completed entities, principals were pulled from CA SOS Statements of Information and phones
from Tracerfy. Those contacts carry the flag `Principals from CA SOS: verify` — the name and role are
primary-source public record; the phone is third-party data and should be confirmed on first contact.

## Worklist columns
| Column | Meaning |
|---|---|
| Entity | LLC / corporation as it appears in the registry |
| Known contact(s) | Person already on file — this is who you need a phone for |
| Title | Role, where known |
| Email | Often present; use it when the phone search fails |

## Lookup order (fastest first)
1. **Email search.** Most rows have one. Search the email address itself — it often surfaces a signature block, listing page or agent profile with a direct line.
2. **CRMLS / agent profile.** If the contact is a licensed agent, the MLS roster has a phone.
3. **CA SOS Statement of Information.** bizfileonline.sos.ca.gov → search the entity → History → most recent Statement of Information (PDF). Gives principal names and a mailing address. Free. Manual use is fine; only automated access is blocked.
4. **County recorder / grant deed.** The vesting deed names the signer and sometimes a mailing address.
5. **BeenVerified or similar,** using the name plus the address from step 3.

## Recording rules
- Enter the phone on the existing contact record. Do not create a duplicate contact.
- No data beats questionable data. If the match is not clearly the same person — surname differs, wrong city, record looks like a relative — leave the phone blank and note what you found.
- Note the source and date in the contact's notes field, e.g. `Phone from SOI 6/16/2026, confirmed by call 2026-09-26`.
- Mark the entity done in your own tracking so the list stays accurate.

## Known traps
- Registered-agent addresses (a recurring one is 2108 N St, Sacramento) are not the principal's address and will not skip-trace.
- Older scanned Statements of Information parse badly; read the PDF rather than trusting a copy/paste.
- Some entities have no Statement of Information filed at all, and a few have no state record under that name. Mark those "no state record" and move on rather than hunting.
