# Zoho conventions

_Shared Core. How Zoho CRM is used at Real Talk Media and Five Star, written so an agent can read the org and write to it without tripping a workflow, emailing a client, or fighting the CRMLS sync. Drafted by the COO 2026-10-08 from a live read-only sweep of the org (counts as of that day), the 2026-09-21 Zoho rule in `.claude/autonomy-boundaries.md`, the production flow map, and the Investor Database rules. Approved by Brett and promoted to 00_Resources/ 2026-10-08. Elizabeth's half was confirmed 2026-10-12. When Zoho and this file disagree, ask, then update this file. Read before creating, updating, reading, or auditing anything in Zoho._

## The rule in one line

Agents read anything, append and update prep fields (links, files, notes, tags, enrichment), and never touch a status field, an Action field, a workflow, a template, or a delete. A built-in workflow that fires because of a permitted field write is acceptable (Brett, 2026-09-21).

## The org

Five active users: Brett (Administrator, CEO role), Elizabeth, Michelle, Cassie (Administrator profile, Manager role), Alyza (Standard profile, Manager role, Manila time zone). Elizabeth is first contact for any Zoho question and is reconfiguring it in and out of projects.

| Module (API name) | What it holds | Records | State |
|---|---|---|---|
| Listings (`List_It_Live`) | Every CRMLS listing plus List It Live booking and asset links | 155,034 | Live; 137,692 written by the CRMLS sync |
| Appearances (`Appearances`) | One record per guest or host appearance on a show | 3,028 | Live |
| Contacts (`Contacts`) | Agents, clients, guests; 2,946 created by the sync | 17,919 | Live |
| Shows (`Radio_Shows`) | The 19 shows, all Active | 19 | Reference |
| Deals (`Deals`) | Guest appearance requests only | 21 | Light use |
| Frontend Listings (`Frontend_Listings`) | Former website listing feed, all "ACT" | 304 | Dead (Brett, 2026-10-12); no website reads it; on the cleanup list |
| WES Logs (`bludata__BluData_Logs`) | WES/BluRoot extension log | 339,688 | Extension-owned |
| Accounts, Leads, Brokers | Defined, empty (0 records) | 0 | Stay empty (Brett and Elizabeth, 2026-10-12); do not create records here |
| Video Library | Two records from 2021 | 2 | Dormant |

How the modules connect: Appearance `Related_Listing` to Listings and `Show_Name` to Shows; Listing `Listing_Agent`, `Buyer_Agent`, `Presenting_Agent` (labeled Co-Listing Agent), `Marketing_Manager` to Contacts. Contacts link to nothing (Accounts is empty), so a contact's company lives in the contact record.

## Who writes what

| Writer | Writes | Agent rule |
|---|---|---|
| CRMLS sync (Aether) | Listings MLS fields and the Bridge fields; creates Contacts | Never write a sync-owned field; the next sync overwrites it |
| WES/BluRoot extension | WES Logs (`bludata__` prefix) | Read only |
| The team | Status fields, Action fields, booking and asset links | Status and Action stay with people |
| Agents | research-sidekick writes prep and enrichment fields; zoho-specialist reads and proposes writes, which the COO applies | Prep fields only, below; every write listed in the run log |

**Who sets each status field** (record history and Brett with Elizabeth, 2026-10-12):

| Field | Set by |
|---|---|
| Listings `List_It_Live_Status` | Cassie (invitations, Property Submitted) |
| Listings `Escrow_Status` (Five Star Status) | Michelle, from the Escrow Status Change Report |
| Listings `Pick_List_14` (List Kit Asset Status) | Michelle, sometimes Cassie |
| Contacts `List_Kit_Client_Status_New` | Cassie, as the List Kit Onboarder (Send Onboarding Email, Create Client Template, Template Pending Approval, Request and Confirm - Template Approved); "Auto" values by workflow |
| Appearances `Appearance_Status` | Michelle (Scheduled, Complete, Episode Live on the studio shows); Elizabeth sets Complete on Market Movers |
| Deals `Stage` | Zoho Forms on create ("Appearance Requested"); no one moves it after |

To tell a person's change from a workflow's, read the record's history (timeline): `source` crm_ui is a person, workflow or custom_function is automation, and a workflow email's `done_by` is the person whose edit fired it. The List Kit and production Miro boards show each status step.

**Telling a sync edit from a person's.** The sync writes as Brett's user, so `Modified_By` cannot tell them apart (7,496 of the Listings edits since 10/1 were that user). Use `Bridge_Last_Synced_Time` (Listings) or `Last_Synced_Time` (Contacts, Deals): when it equals `Modified_Time`, the sync made the edit.

**Sync-owned fields (never write):** Listings `Name` (MLS Number), `Property_Status`, every `MLS_` field, `Is_Bridge_Data`, `Bridge_Listing_Key`, `Bridge_Raw_Data`, `Bridge_Last_Synced_Time`, `BridgeModificationTimestamp`, `Sync_Data_to_Listing`, `Show_Hidden_System_Fields`; Contacts `Created_from_Bridge`, `Last_Synced_Time`, `Raw_Data_from_Listing`, `Sync_Data_to_Contact`, `Sync_Contact_to_Other_Modules`; Deals `Last_Synced_Time`, `Sync_Data_to_Deal`, `Sync_Data_to_Other_Modules`. The `Sync_Data_to_` fields are triggers; writing one runs the sync.

## Field classes

| Class | Fields | Agent may |
|---|---|---|
| Status (emails clients) | Listings `List_It_Live_Status`, `Escrow_Status` (Five Star Status), `Pick_List_14` (List Kit Asset Status), `List_Kit_Client_Status`; Appearances `Appearance_Status`; Contacts `List_Kit_Client_Status_New`; Deals `Stage`, `Appearance_Status`; Shows `Show_Status` | Read only. Example: Cassie setting Appearance Complete emails the agent their assets |
| Action (workflow triggers) | `Action` on Listings, Contacts, Deals, Accounts, Leads; Deals `Action1` | Never. Each value ("Create Appearance - Paid Retainer", "DELETE", "Purge Request") runs a workflow, so writing one is invoking it |
| Relationship | `Five_Star_Relationship` (Listings, Appearances, Contacts), Contacts `NDC`, `Blacklist_Reason`, the DNC tags | Read only: they drive client and do-not-contact decisions and may fire workflows (Brett, 2026-10-08) |
| Sync-owned | Listed above | Never |
| System | `Record_Status__s`, `Locked__s`, `Enrich_Status__s`, IDs, created and modified stamps | Never |
| Prep (links and files) | Listings: `Property_Deck`, `Video_Segment`, `Youtube_Link`, `Facebook_Link`, `Property_Photos_Link`, `Instagram_Link`, `Listing_Reel_IG_Link`, `Full_Episode_Link`, `Prop_Folder_Link_Drive`, the New Listing, In Escrow, Just Sold source file and IG link fields, `Head_Shot`, `In_Video_Property_Description`. Appearances: every Video, Reel, Segment, Podcast, `LIL_Full_Episode`, `BTS_Link` field. Contacts: `LinkedIn`, `Facebook`, `Instagram`, `Youtube`, `Website1`, `List_Kit_Folder_Link`, `List_Kit_Template_Link`, `Record_Image` | Append and update. Fill an empty field freely; overwrite a filled one only when the run log names the old value |
| Enrichment | Contact email, phone, mailing address, social profiles, notes | Append and update; every fact carries its source and date in the note |

## Reading the data

- **Read live values, not the picklist definition.** Many options were renamed in the UI while the stored value kept the old text (Five Star Status "Verbal Commitment" is stored as "Pre-open"; Appearances `RTM_Retainer_Type` live values match none of the current options). Live data also holds values no longer in the definition ("NDC-Show Guest", "Website Form", "Host Appearance"). Before writing a picklist, take the value from a live COQL group-by.
- **A Five Star client** is a contact whose `Five_Star_Relationship` is Client: ACTIVE or Client: INACTIVE (and the INACTIVE 2+ yrs, DNC, and Status Inv. variants). "Client: WeRevive", "Dwell West", "Vertigo", "Hawthorne & Albatross" mark clients of investor clients, not Five Star clients (Investor Database rule).
- **NDC means non-directing client** (Brett, 2026-10-08): usually the buyer's agent on a Five Star escrow, since the seller's agent directs the escrow to Five Star. NDCs are tracked as prospects because they have seen Five Star's service. Workflow rules set it: a listing's buyer agent gets `NDC` checked ("U: NDC Contact"), and an NDC contact's relationship becomes NDC or NDC-Show Guest ("FSE: U-NDC Relationship"). NDC is never a do-not-contact flag.
- **DNC means do not contact.** Do not contact anyone whose relationship reads Do Not Contact or ends in "- DNC", or who carries the BLACKLIST or Touchpoint DNC tag. Exception: "Client: WeRevive - DNC" means Five Star's team does not call that contact about WeRevive's transactions; it does not bar Real Talk or REInvest outreach (Brett, 2026-10-15).
- **The FSE Partner tag marks prospects** for the FSE Partner Campaign, not current Five Star partners or open partner conversations (Brett, 2026-10-16).
- **Volume source:** the Smartsheet team sheets (by Directing Customer) for Five Star clients; Zoho for non-clients (Brett, 2026-10-16). An investor client can show List Sides 0 in Zoho while directing hundreds of escrows, because the listing agents are the investor's partners.
- **Property status variants mean the same thing:** CANCELED and CANCELLED; ActiveUnderContract and Active Under Contract; ComingSoon and Coming Soon; SOLD and Closed (Brett and Elizabeth, 2026-10-12: SOLD is the older value, and no listing created since July carries it). `Property_Status` is free text written by the sync, so normalize in the read, never in Zoho.
- **List It Live booking fields mix values.** `List_It_Live_Status` carries 89 "ACTIVE" and 6 "COMING SOON" records that are property statuses; report them, do not fix them.
- **COQL limits:** `MAX(Modified_Time)` and `Modified_By.full_name` fail; sort by `Modified_Time` and group by `Modified_By`. A group-by can return the same label twice (renamed options); add the counts. Contacts hold `List_Sides_12_months` (a count), not dollars. For list-side dollar volume, sum `List_Price` on Closed Listings rows by `Listing_Agent` (a labeled calculation). SUM and COUNT with group by failed in the 2026-10-16 run.

## Writing

1. Write only fields in the Prep or Enrichment class, in Listings, Appearances, or Contacts.
2. Never create a record in Accounts, Leads, or Brokers; they stay empty by design (Brett and Elizabeth, 2026-10-12).
3. Before creating a contact, search by email, then by first and last name; the sync creates contacts too. A likely duplicate is reported, never merged.
4. Link and file writes may set off a workflow, including a client email (Brett, 2026-10-08). Many asset-delivery and Episode Live emails fire when a status is already set and the last required link is filled (see the workflow inventory, Operations/AI Workforce/drafts/2026-10-08-zoho-workflow-inventory.md). Until a supervised test passes, a write that completes a trigger runs only with Brett or Elizabeth watching, one record first, and the run log names the rule expected to fire and whether it did. Two sync rules copy trigger fields indirectly: any listing edit copies the LA contact's List Kit Client Status onto the listing ("U: Sync Misc Contact Fields - Listings"), and any appearance edit copies the contact's email onto the appearance ("U: Appearance Fields from Contact Module"). List Kit Asset Status "Pending LK Confirmation" sends a client email ("LK: Asset Tasks").
5. No delete, merge, mass update, or tag removal. More than fifty records in one run is staged for Brett's go (research-sidekick rule, applied to every agent).
6. Every run log lists module, record ID, field, old value, and new value for each write.
7. Partners never get Zoho access; data moves in and out from our side (Investor Database rule).

## What an agent may do in Zoho

From `.claude/autonomy-boundaries.md`: read every module; append and update prep and enrichment fields within its granted modules; never write a status field until the Zoho workflow audit; never invoke a workflow, custom function, or email template; never delete. Email template design is the zoho-email-templates account skill; sending one is a person's click.

## Known drift (cleanup)

Elizabeth leads the cleanup and may bring in Michelle once she has the scope (Brett, 2026-10-12). Agents report drift; they do not fix it.

| Where | What | Proposed fix |
|---|---|---|
| Listings `Property_Status` | Three spelling pairs, plus "Delete" (107), "uinque1", "COMING SOON/EXPIRED?" | Ask Aether whether the sync can normalize; else read-side mapping only |
| Listings `List_It_Live_Status` | 95 property-status values in the booking field | Elizabeth's cleanup: correct, or confirm legacy |
| Picklists | Renamed options with stale stored values; placeholders "Option 1", "Option 2" (List Kit Asset Status, Segment_1/2, Video Library Category); duplicates "Indicated Interest1", "Verbal Commitment (1)" in Deals Stage; "11:00 AM1", "12:30 PM1" in Show_Time | Elizabeth's cleanup |
| Spelling | "Hawthorn" in `List_Kit_Investor_Client` vs "Hawthorne" elsewhere | Same |
| Deals labels | `Source_File_Link_4` labeled "Apple Link 4", `Reel_Link_4` "Spotify Link 4", `IG_Reel_Link_4` "Amazon Link 4" | Rename labels or API names |
| Appearances | 692 records with no Show | Elizabeth's cleanup: backfill, or confirm legacy |
| WES Logs | `bludata__Status` empty on all 339,688, so errors cannot be filtered, and the WES Error Notification rule can never fire | Ask WES support. WES Error Notification deactivated 2026-10-12 (Brett and Elizabeth) |
| Contacts tags | Seven tags with 0 records (DNC, Not Interested, Ask BW, others); all 12 Accounts tags empty | Delete in the audit |
| Frontend Listings | Dead module, untouched since 2025-02-13, no website reads it (Brett, 2026-10-12) | Elizabeth's cleanup: retire the module |

## Elizabeth's half (confirmed 2026-10-12)

The workflow rule inventory: which field changes fire which workflow, and what each sends. Also: who owns each status field and whether SOLD and Closed are one status. Answered 2026-10-12: Accounts, Leads, and Brokers stay empty; Elizabeth owns cleanup; Frontend Listings is dead; no client-email rule is retired; WES Error Notification is retired; the two switched-off rules (Producers Circle: Credit Notification, Create Five Star Retainer Task) stay off and are kept; SOLD and Closed are one status; status field owners are in the table under Who writes what. The partly read rule conditions stay for the COO to finish in the browser; the status rule stands as written.

## Change log

- 2026-10-13: zoho-specialist built read-only (proposes, the COO applies); Agents row moved back into the Who writes what table.
- 2026-10-12: every partly read or unread workflow rule read in full by the COO; Writing rule 4 names the two sync chains and the Pending LK Confirmation email.
- 2026-10-12: SOLD and Closed are one status; all client-email rules stay; WES Error Notification retired; the two off rules kept, not deleted; status field owners table added; Cassie is the List Kit Onboarder (Brett with Elizabeth). Answer whose-change questions from record history (timelines), not by asking.
- 2026-10-12: Accounts, Leads, and Brokers stay empty; Elizabeth leads cleanup (Michelle possibly); Frontend Listings is dead and on the cleanup list (Brett with Elizabeth).
- 2026-10-08: NDC defined as non-directing client, DNC as do not contact; link writes may set off workflows, supervised test first (Brett).
- 2026-10-08: created by the COO from a live read-only sweep and the standing rules; Five_Star_Relationship confirmed read only; promoted to 00_Resources/ (Brett).
