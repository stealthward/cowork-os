# Zoho workflow rule inventory (draft for Elizabeth to confirm)

_COO, 2026-10-08. Read only from Zoho Setup → Automation → Workflow Rules in the built-in browser (Brett's admin login); nothing was edited or saved. 78 rules. Feeds `00_Resources/zoho-conventions.md`. Completed 2026-10-12: every rule marked partly read, not read, or classified by name on 10/8 was read in full from the rule's own data (see "Full read, 2026-10-12" at the end); the partly-read notes below are superseded. Off as of 2026-10-12: WES Error Notification, Create Five Star Retainer Task, Producers Circle: Credit Notification, U: Update module image to Contact and Account, U: Sync Tags w/ Listings (the 10/8 count of 2 off was wrong)._

## What this means for agents

1. **Status fields send client email.** Confirmed: `List_It_Live_Status`, `Escrow_Status` (Five Star Status), `Pick_List_14` (List Kit Asset Status), `List_Kit_Client_Status` (Contacts), and `Appearance_Status`.
2. **`Action` fields send email, create records, and create tasks.** Confirmed on Listings, Contacts, and Tasks.
3. **Link fields are part of email triggers.** Most "asset delivery" and "episode live" emails fire when a status is already set and the last required link field gets filled. Example: on a Discover La Jolla guest appearance at Episode Live, filling the last of the five podcast links sends the guest email. Writing a link can send a client email.
4. **Contact edits run the Aether sync.** "AA - Sync Data to Contact - Edited" runs a function on every contact edit. "AA - Sync Contact to Other Modules - Edited" runs when fields in the Five Star or Contact & Relationship sections change. Agent enrichment writes trigger both.
5. **`NDC` is set by rules.** NDC means non-directing client, usually the buyer's agent (Brett, 2026-10-08). A listing's buyer agent is marked NDC ("U: NDC Contact"), and an NDC contact with an empty or Show Guest relationship gets NDC or NDC-Show Guest ("FSE: U-NDC Relationship"). DNC means do not contact.

## Rules that send email

| Rule | Module | Fires when | Sends |
|---|---|---|---|
| LiL: Invite Client | Listings | `Action` = EMAIL: LIL Invite (Client), Street Name and Listing Agent set, LiL Status empty | List It Live invite; sets LiL Status to Invitation Sent; tag; follow-up task |
| LiL: Appearance SCHEDULED | Listings | LiL Status = Property Selected, plus agent, email, company, MLS, price, show date and time | Property Selected email to LA or Co-LA; tags |
| LiL: Appearance COMPLETE | Listings | LiL Status changed to Appearance Complete and `Video_Segment` (Property Video) filled | Assets email to LA or Co-LA; contact updates; LiL- Appeared tag |
| LK: Asset Delivery | Listings | List Kit Asset Status = New Listing, In Escrow, or Sold - Delivered, plus that stage's source file (and IG link), LK client status set, no investor client | List Kit posted-asset email to the LA |
| LK: Investor Asset Delivery | Listings | Same, with List Kit Investor Client = Hawthorn & Albatross or WeRevive | Posted-asset email to the LA and the investor's marketing manager (condition 4 partly read) |
| LK: Onboarding Emails and Tasks | Contacts | List Kit Client Status = Send Onboarding Email; Template Pending Approval | Onboarding form email; proof ready email (Create Client Template makes a task; conditions 4 to 7 partly read) |
| Retainer: Shoot Request Email | Contacts | `Action` = Email: Paid Retainer Shoot Request | Paid Retainer shoot request |
| Action - Retainer Emails | Contacts | `Action` = Email: Schedule FS 2 Hr Retainer Shoot | FS Retainer: Schedule 2 Hr Shoot |
| RTM Paid Retainer: Billing Credit | Products | Product created with retainer type Paid Retainer or Podcast | Credit email notification; credit-tracker task |
| DR: Emails Triggered from Appearance Status | Appearances | Discover Ramona: guest Scheduled (with date, time, email); guest Complete (with premiere date); host Complete (with source file 1, episode number) | Confirmation; complete email; host asset delivery (condition 4 partly read) |
| DEC: Emails from Appearance Status | Appearances | Discover East County: same three patterns | Same three emails (condition 4 partly read) |
| DLJ: Email from Appearance Status | Appearances | Discover La Jolla: guest Episode Live with all five podcast links; host Complete with episode number | Episode Live email; host asset delivery |
| CF: Emails From Appearance Status | Appearances | Cashflow: host Complete with episode number; guest Episode Live with four podcast links and video source file 2 | Host asset delivery; Episode Live email |
| MM: Appearance Stages Emails and Tasks | Appearances | Market Movers: Appearance Complete with video source, Facebook, YouTube, reel source, reel Instagram filled, and no "Email Manually Sent" tag | MM Appearance Complete email |
| R and R, TBDC, SSP, APP, The Factory: Host Asset Delivery | Appearances | Host Appearance, that show, Appearance Complete, plus source file(s) or episode number | Host asset delivery email to the host |
| WES Error Notification | WES Logs | `bludata__Status` = Error and Email Sent | Error notification to client (extension-owned; the status is empty on every log). Deactivated 2026-10-12 (Brett and Elizabeth) |
| Producers Circle: Credit Notification | Appearances | Created with retainer type Producers Circle | Deactivated |

## Rules that create records or tasks

| Rule | Module | Fires when | Does |
|---|---|---|---|
| FSE: Escrow Touchpoints (42 actions) | Listings | Five Star Status changed to Escrow Opened, LA and buyer agent set; branches by relationship | Sets open dates; sets relationship to Client: Active (or keeps the investor value); creates Opened and Midpoint tasks to contact the LA and the NDC (later conditions partly read) |
| FSE: Escrow Touchpoints DNC (33 actions) | Listings | Same, for "- DNC" relationships | Same field updates; tasks for the NDC only |
| Retainer: Create Producers Circle Appearance Record | Listings | Five Star Status changed to Escrow Closed, retainer type Producers Circle | Creates an Appearance |
| Retainer: Create Paid Appearances | Contacts | `Action` = Create Appearance - Paid Retainer or Podcast Paid Retainer | Creates an Appearance |
| Retainer: New Client Task | Contacts | RTM Retainer Agreement set and type Paid Retainer; or `Action` = Create Task - New Five Star Retainer | Task to add the retainer client |
| LK: Investor Asset Tasks; LK: Asset Tasks | Listings | List Kit Asset Status = List Kit Ready for Review, or Escrow Closed, with investor client | Review and post tasks (LK: Asset Tasks not read) |
| Create Follow-up Task from Task Action | Tasks | Task `Action` changed (No Answer, Follow-up 1 or 2 days, seven more) | Follow-up task (conditions 4 to 10 partly read) |
| Select Outcome to Close Task | Tasks | Outcome filled | Closes the task |
| RTM: Create Product from Listing | Listings | Modified | Not read |
| Create Five Star Retainer Task | Appearances | Created | Deactivated |

## Rules that update or sync fields (no email)

| Rule group | Module | Does |
|---|---|---|
| AA - Sync Data to Contact, Deal; AA - Sync Contact, Deal to Other Modules; AA - Sync Listing (10 rules, created or edited) | Contacts, Deals, Listings | Aether sync: resets the Sync flag and runs the sync function |
| LiL: U-Property Submitted Selected; LiL: U-LiL Status Is Property Submitted; LiL: U-Appearance Complete | Listings | Property Submitted boxes and tags; on Appearance Complete, sets relationship to Show Guest if empty, and checks the LiL boxes and last appearance date |
| U: NDC Contact; FSE: U-NDC Relationship | Listings, Contacts | Marks buyer agents NDC; sets the relationship to NDC or NDC-Show Guest |
| onC and onE: Populate Contact info based on BRE; U: Sync Contact Fields On Create and On Field Update; U: Agent Info (two rules) | Listings, Contacts | Fill contact data from the DRE number and listing agent (functions) |
| U: Task Fields (Listing/Contacts, NDC, Deals, Social); FSE: U-Last Escrow Opened from Contact | Tasks | Copy listing and contact fields onto new tasks (bludata) |
| U: Sync Misc Fields (Contact, Listings, Deals); U: Sync Contact Fields to Deal; U: Appearance Fields from Contact Module; U: RTM Retainer Type; U: Sync Tags w/ Listings | All | Copy Marketing Manager, retainer type, relationship, and tags across modules |
| U: Last Action Date (Listings, Contacts, Deals); U: Last Report Date; U: Last Appearance (three rules); U: Last Escrow Opened in Listing | All | Date stamps |
| U: Change Appearance Status to Expired; U: Change Product Status to Expired | Appearances, Products | Sets status to Expired on the expiration date, 8 AM |
| Update module image (three rules); Update Status Field on WES Log | Accounts, Contacts, Listings, WES Logs | Images; WES log function |

## Not read in full

LK: Asset Tasks, RTM: Create Product from Listing, U: Agent Info (two), U: Sync Misc Contact Fields - Listings and - Deals, U: Sync Contact Fields to Deal, U: RTM Retainer Type, U: Sync Tags w/ Listings, U: Appearance Fields from Contact Module, U: Last Action Date (three), onE, and the collapsed later conditions noted above. Classified from their names and descriptions.

## Full read, 2026-10-12

Read from each rule's stored definition (conditions and actions in full). Last run dates come from Zoho.

| Rule | Fires when | Does | Last ran |
|---|---|---|---|
| LK: Investor Asset Delivery | List Kit Asset Status New Listing - Delivered or Sold - Delivered, that stage's source file and IG link filled, Investor Client = Hawthorn & Albatross (conditions 1, 2) or WeRevive (3, 4). No In Escrow condition | Posted-asset email per investor and stage | 2026-03-01 |
| LK: Asset Delivery | Same stages with no investor client and the listing's List Kit Client Status = Auto, Request, or Confirm LK Client; In Escrow needs only its source file | Posted-asset email to the LA | 2026-10-11 |
| LK: Asset Tasks | Client List Kit Ordered; List Kit Ready for Review; Escrow Opened or Closed with an LK client; Prep List Kit; **Pending LK Confirmation** | Tasks, and on Pending LK Confirmation the **"List Kit: Pending LK Confirmation Email"** (a client email the 10/8 list missed) | 2026-10-11 |
| LK: Investor Asset Tasks | Ready for Review or Escrow Closed with an investor client | Tasks only | 2026-03-01 |
| LK: Onboarding Emails and Tasks | Contacts List Kit Client Status = Send Onboarding Email; Create Client Template; Template Pending Approval; Auto, Request, or Confirm - Template Approved; Request/Confirm Prospect | Onboarding form email; template task; proof email; onboarding complete emails (Auto, Request, Confirm) that also set the status to Auto, Requested, or Confirm LK Client; List Kit info email | 2026-06-25 |
| DR: Emails Triggered from Appearance Status | Discover Ramona guest Scheduled (name, email, date, time); guest Complete (name, email, premiere date); host Complete (video source 1, episode number); guest Episode Live (episode number, Apple, Spotify, Amazon links) | Confirmation; complete; host asset delivery; Episode Live | 2026-10-08 |
| DEC: Emails from Appearance Status | Same four for Discover East County; host Complete also needs the appearance date; Episode Live needs name, email, Apple, Spotify, Amazon | Same four emails | 2026-10-08 |
| FSE: Escrow Touchpoints | Any change to Five Star Status, LA and buyer agent set. Opened, by relationship (non-investor, WeRevive, Hawthorne & Albatross, Status Inv., Dwell West); Closed (not DNC); Canceled | Opened and Midpoint tasks for LA and NDC, open dates, relationship set; Closed and Closed F/U tasks, closing date; Canceled close-tasks task. No email | 2026-10-11 |
| FSE: Escrow Touchpoints DNC | Same for each "- DNC" relationship | NDC tasks only, dates, DNC relationship kept. No email. Condition 6 sets "Client: NDC - DNC" by its action name; whether that matches the live "NDC - DNC" value is not verified | 2026-10-08 |
| RTM: Create Product from Listing | Five Star Status updated to Escrow Closed and RTM Retainer Type is a paid retainer or podcast type | Function creates a Retainer Credit Product, which fires RTM Paid Retainer: Billing Credit (credit email and task) | 2026-09-20 |
| Create Follow-up Task from Task Action | Task Action set (No Answer, Follow-up 1 to 6 days, 1 to 3 weeks) | Follow-up task | 2025-02-12 |
| U: Agent Info (two) | Contact sides, last report, DRE, or listing volume changes | Update Agent Info function | 2026-10-11, 2026-07-16 |
| U: Sync Misc Contact Fields - Listings | Any listing create or edit with an LA | Copies Marketing Manager, RTM Retainer Type, and **List Kit Client Status** from the LA contact | 2026-10-08 |
| U: Sync Misc Contact Fields - Deals; U: Sync Contact Fields to Deal | Deal create or edit with a contact | Copy Marketing Manager, retainer type, and contact fields | 2025-09-09 |
| U: RTM Retainer Type | Listing create or edit with an LA | Copies RTM Retainer Type from the LA contact | 2026-10-08 |
| U: Sync Tags w/ Listings | Contact create or edit (rule is off) | Tag sync function | 2025-03-12 |
| U: Appearance Fields from Contact Module | Appearance create or edit with an RTM contact | Copies relationship and contact info (including email) from the contact | 2026-10-08 |
| U: Last Action Date (Listings, Contacts, Deals) | Action field set | Last Action Date stamp | 2025-02-11, 2026-10-01, 2024-12-04 |
| onE: Populate Contact info based on BRE | Listing DRE number changes | Populate contact function | 2026-09-22 |

**Chains an agent must know.** A listing edit copies the LA contact's List Kit Client Status onto the listing, and an appearance edit copies the contact's email onto the appearance; both are conditions of client emails, so an edit can complete an email trigger without touching a status. Five Star Status to Escrow Closed on a retainer client creates a Product that sends a billing credit email.

**Not run in over a year:** LiL: Invite Client (2025-02-11), U: Last Action Date on Listings (2025-02-11), Create Follow-up Task from Task Action (2025-02-12), U: Last Action Date from Sales and Marketing Activities (2024-12-04), AA - Sync Deal to Other Modules - Updated (2024-09-09). Never run: Update Status Field on WES Log, Retainer: New Client Task. For Elizabeth's cleanup, no change now.
