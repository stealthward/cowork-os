# Gmail Triage System Reference

_Last updated 2026-10-16. Harvested 2026-08-12 from the Brett OS claude.ai project (retired). The production triage runs as a Cowork scheduled task (7 AM, 11 AM, 3 PM daily) whose task file is C:\Users\brett\Documents\Claude\Scheduled\morning-inbox-triage\SKILL.md. The task carries its own instructions, so it fires from anywhere in Cowork._

## What It Is

An inbox triage workflow run through Cowork with the Gmail connector via the `morning-inbox-triage` scheduled task. Runs 3x daily (7 AM, 11 AM, 3 PM) plus on demand.

## Cleaning vs Reporting (2026-08-17 restructure)

Cleaning and reporting are separate operations. Cleaning runs every time so the inbox stays clear through the day. Reporting only fires when something changed.

- **State file:** `triage-state.json` in this folder. Keyed on Gmail threadId, storing lastMessageId per thread. Matching lastMessageId means already handled and suppressed. A changed lastMessageId means a reply landed, so the thread re-surfaces as new.
- **Run types:** the first run of each calendar day is a ROLLUP (delta plus a full open-items countdown). All later runs are DELTA (new items only).
- **Silent runs:** a delta run with nothing new outputs `[no change]` and nothing else. No digest, no restatement of open items.
- **Audit trail:** every run appends to `triage-run-log.md` in this folder. Because silent runs produce no digest, the log is how a run is confirmed to have fired.
- **Search window:** `newer_than:3d`, deliberately wider than the run interval. The state file suppresses repeats, so a wide window costs nothing and covers a missed or failed run.
- **Carry-forward:** items with real deadlines or decisions parked on Brett live in the state file's `carryForward` array, each tied to its Gmail threadId(s), and appear as one-line countdowns in the rollup, never as re-explained table rows.
- **Inbox membership rule (2026-08-19):** an open item exists only while its thread is in the inbox. Every run checks each carryForward entry's threads for the INBOX label; if none carry it, Brett has addressed it and the entry is dropped silently. Nothing is ever reported as open unless its thread is currently in the inbox.
- **Ad-hoc rollup requests (2026-09-28):** the inbox membership rule applies here too. When Brett asks for a rollup covering a date range, check current inbox membership for every thread before including it. If a thread already left the inbox (archived, handled, or addressed outside this system), leave it out entirely. Do not mention that it used to be open or that it is now gone. It is done, full stop.

- **Read rule (2026-09-29):** a thread in the inbox whose latest message has been read (no UNREAD label) is never mentioned in any triage output (new items, ambiguous, Deadline watch, Still open), in every category including Compliance/IRS/Legal. Cleaning still runs on it and its state entry stays. A new unread message on the thread surfaces it again.

## Report-once-daily rule (2026-10-16, Brett's go)

Brett only reads triage first thing in the morning. Cleaning still runs at 7 AM, 11 AM, and 3 PM, but reporting happens once a day.

- **Delta runs (11 AM, 3 PM):** clean per the rules, append every new thread to `pendingReport` in `triage-state.json` (from, subject, classification, whatItIs, myRead, actionTaken, runAt), and output `[no change]`. No digest. One exception: a same-day deadline or time-sensitive item (due today or within 12 hours) sends a single push notification; it is still recorded in `pendingReport`.
- **Rollup (first run of the day):** reports everything since the last rollup (pendingReport plus the run's own new threads, in arrival order, with an Action taken column and a Run column), cleaned-up counts split by run, then clears `pendingReport`. The "Still open" section sweeps the inbox for every response-worthy thread still there, de-duplicated with carryForward, not only carryForward items.
- The inbox membership rule still applies: a pendingReport entry whose thread Brett handled and removed from the inbox himself is omitted. Mail the system archived or routed still shows in the report as an action taken.
- The task prompt (cloud scheduled task trig_01Bbnww9H97tiPQVoPF8BpDq) was rewritten to match. Note the local task file named at the top of this doc (Documents\Claude\Scheduled\...\SKILL.md) is outside the Cowork OS folder and was not edited; if it is still in use, update it to match.

## Rules

_Rewritten 2026-10-09 (COO inbox audit, Brett's go) to match the running task. The task file is what runs; when the two disagree, fix this spec._

- Scope: `in:inbox newer_than:3d -category:promotions -category:social`. Primary, Updates, and Forums are all in scope; Promotions and Social are never touched. Inbox mail in the Updates tab does not show in Brett's Primary view, so triage is the only thing watching it.
- Never-auto-archive rules live in `00_Resources/email-register.md` under Sender-specific triage rules. They are binding and override run-time judgment.
- Classes (state file `classification`, exactly one): RESPONSE-WORTHY, FYI, SOLICITATION, AMBIGUOUS, COMPLIANCE, RULE-KEPT. Detail goes in `note`.
- Actions: SOLICITATION gets @Sane/Solicitations (Label_1464299517091022942) and leaves the inbox. FYI is archived unless a register rule keeps it. RESPONSE-WORTHY, AMBIGUOUS, and COMPLIANCE stay in the inbox.
- COMPLIANCE (tax authority, regulator including DFPI, court, attorney, auditor, or a legal or tax deadline) is never archived and is listed first in a digest. The read rule still applies to it.
- Run log rows: `| YYYY-MM-DD HH:MM PT | Rollup or Delta | new | archived | routed | Digest (one short line) or Silent |`, newest at top, rows over 30 days deleted every run. Rows before 2026-10-09 use older timestamp formats until they age out.
- Drafting is on-demand only; the task never drafts or sends.
- Archiving in Gmail removes the INBOX label only; threads remain in All Mail.
- Gmail thread URL format for links: https://mail.google.com/mail/u/0/#all/THREADID

## Canonical Files

This document is the OS-side spec. The task file (SKILL.md) lives in C:\Users\brett\Documents\Claude\Scheduled\morning-inbox-triage; the state file (triage-state.json) and run log (triage-run-log.md) live in this folder. No triage dashboard file exists (checked 2026-09-30). If the task is ever rebuilt, rebuild it from this spec.

## Gmail Filters That Touch Triage

Filters live in Gmail Settings > Filters and Blocked Addresses (the connector cannot read them). The ones that keep mail away from triage:

| Filter | Action | Note |
|---|---|---|
| `list:(<bward.realtalkmedia.com>) -from:(crmls.org)` | Skip Inbox, @Sane/Solicitations | CRMLS excluded 2026-10-09 so REcore login codes reach the inbox |
| (deleted 2026-10-09) `to:(brett@fivestarescrow.com)` | was Skip Inbox, @Sane/Solicitations | Deleted on Brett's go: that address gets little mail and nearly all of it is real (legal, lenders, regulators), so triage handles it |
| `to:(brett@realtalksandiego.com)` | Skip Inbox, @Sane/Solicitations | |
| Author newsletters (Hormozi, Leila Hormozi, StoryBrand, Allie Miller, Jeff Su, Claude) | Skip Inbox, Authors & Coaches or Tech & Tools label | Leila Hormozi beehiiv moved to her own label 2026-10-09 |
| `noreply@goigoe.com`, `noreply@uber.com` | Skip Inbox, forward to Felicia | |
| `subject:(quick question Brett)` | Delete | |

## Alias Note

Alias-delivered mail (bward@realtalkmedia.com, brett@realtalkmedia.com, brett@fivestarescrow.com) that never reaches the inbox is not triaged: the task searches `in:inbox` only. The 2026-10-09 audit found alias mail outside the inbox with no label (Zoho Analytics and Zoho CRM notices); no Gmail filter causes it (filters read the same day), so SaneBox or a manual archive is the likely cause, unverified.

## Related Systems

- **SaneBox (active, Brett 2026-09-30):** third-party sender sorting. Brett drags a sender into an @Sane label once (@SaneNews, @SaneNoReplies, @SanePurchases, @SaneBlackHole) and future mail from that sender files there, outside the inbox. The Solicitations label the triage task archives into sits under @Sane. Triage never moves mail out of @Sane labels and never searches them. Brett confirmed (2026-10-09) that @SaneBlackHole is meant to hold bank and card statements, Capital One card notices, Nyla Family Link sign-in alerts, the Smartsheet Cancelled Report, and CRMLS mail.
