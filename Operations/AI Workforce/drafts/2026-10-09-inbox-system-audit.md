# Inbox system audit (2026-10-09)

COO, Email HQ as a system. Read only in Gmail. Findings 2, 5, 6 applied 2026-10-09 on Brett's go; 3 confirmed intended; 4 closed (Brett archived Stride; Equifax is in the Updates tab); 7 kept (case open); 1 not filter-caused. Filters F1 and F3 applied 2026-10-09 on Brett's go; the F2 filter was then deleted on his go after a volume check (3 inbound threads in 6 months, nearly all real).

## Scope

- **System:** Gmail triage for brett@brettward.net: the morning-inbox-triage Cowork task (C:\Users\brett\Documents\Claude\Scheduled\morning-inbox-triage\SKILL.md), its state file and run log (Email HQ/Email HQ Resources), the sender rules in 00_Resources/email-register.md, Gmail labels, Gmail filters, and SaneBox's @Sane labels.
- **Done when:** every part is checked against its spec, each finding has a fix Brett can approve from this page, and what could not be checked is named.
- **Specialist:** none (inbox-specialist not built). COO did it in session.

## What is working

| Check | Result |
|---|---|
| Runs fire | Every 7 / 11 / 3 slot from 9/28 to 10/9 logged (10/1 3 PM ran 14:30, 10/3 11 AM ran 12:35) |
| Solicitations label | Label_1464299517091022942 is @Sane/Solicitations, 6 threads |
| State file | Valid JSON, 143 seen entries, oldest 9/25 (14-day prune working), 1 carryForward with its threadId |
| Inbox | 9 threads in scope, 20 more in Promotions/Social (out of scope by design) |
| Labels | Hierarchy clean (FSE, Financial, Personal, Tech & Tools, Authors & Coaches, @Sane). Empty parents are structure, not clutter |

## Findings

| # | Finding | Evidence | Proposed fix |
|---|---|---|---|
| 1 | Alias mail that skips the inbox is never triaged. Spec and Email HQ MEMORY say searches must include it; the task searches `in:inbox` only | Today's Zoho Analytics limits notice and the Zoho CRM bounce reports to brett@realtalkmedia.com: unread, no label, not in the inbox | Read the filters first (blocked, see below), then either fix the filter or add an alias search to the task |
| 2 | Spec and task disagree | Spec: seven categories, Compliance/IRS/Legal never archived and listed first, "Primary tab only". Task: three classes, no compliance rule, query includes Updates and Forums | Rewrite gmail-triage-system.md to match the task (the task is what runs and what Brett has tuned). Add one rule to the task: Compliance/IRS/Legal is never archived and is listed first in a digest |
| 3 | @SaneBlackHole holds mail that may matter. Triage never looks in @Sane labels | Last 7 days: Chase statements (2 cards), Schwab eStatements, Capital One "virtual cards expiring", Nyla Family Link new-device sign-ins (triage surfaced Nyla Google sign-in alerts as response-worthy on 9/14 and 10/2), Smartsheet "Cancelled Report- Weekly", CRMLS mail | Brett confirms these senders belong in BlackHole; any that do not, he drags out in SaneBox |
| 4 | Repeat "ambiguous" senders with no rule | Healthpeak Stride tenant portal invites flagged 9/28 and 10/8, both still in the inbox; Equifax alerts flagged ambiguous | Add a sender rule to email-register.md per Brett's answer |
| 5 | Task breaks its own em dash rule | Digest heading "Inbox triage — [date], [time]" | Heading becomes "Inbox triage: [date], [time]" |
| 6 | Run log and state are hard to audit | Four timestamp formats and mixed Type casing in the log; rows from 9/8 survive the 30-day trim; state classification is free text (over 100 distinct values) | Fix the log row format (`YYYY-MM-DD HH:MM PT`, `Rollup` or `Delta`), trim rows dated more than 30 days back, and classification limited to RESPONSE-WORTHY, FYI, SOLICITATION, AMBIGUOUS, RULE-KEPT with detail in a separate `note` field |
| 7 | The RJS Law rule says remove it when the Barmaksezian case closes | Rule in email-register.md; label FSE/Legal/IRS-Paul Barmaksezian has 1 unread | Brett confirms the case is still open; if closed, the rule comes out |

## Could not verify

- **Gmail filters:** the built-in browser is signed out of Google again (signed in 10/8). The connector cannot list filters. Needed for finding 1.
- **Task schedule:** the Cowork task does not appear in the desktop scheduled-tasks list; the schedule is inferred from the run log.
- **Why mail to jcasarietti@realtalkmedia.com (CRMLS) lands in Brett's mailbox.**
- **Whether @Sane labels are applied by SaneBox or by Gmail filters** (filters will show).

## Not a defect

Two read threads sit in the inbox outside the 3-day window (Elizabeth 8/20, Insperity 6/22). The read rule keeps them out of every digest by design; clearing them is Brett's call.

## Filters (read 2026-10-09 after Brett signed in)

31 filters, about 300 blocked senders. Read only.

| # | Finding | Evidence | Proposed fix |
|---|---|---|---|
| F1 | The `list:(<bward.realtalkmedia.com>)` filter (Skip Inbox, @Sane/Solicitations) catches CRMLS REcore login codes, breaking the register rule that verification codes stay in the inbox | Two REcore codes for OCWARDBRE on 10/5 landed unread in @Sane/Solicitations | Edit the filter to `list:(<bward.realtalkmedia.com>) -from:(crmls.org)` |
| F2 | `to:(brett@fivestarescrow.com)` sends every message to that alias to @Sane/Solicitations, so legal or regulator mail sent there would never reach triage | Lagerlof (FSE legal invoices) wrote to that alias in August; DFPI senders have Never-spam filters but no inbox protection | Add `-from:(dfpi.ca.gov OR crmls.org OR lagerlof.com)` to the filter |
| F3 | Leila Hormozi's beehiiv newsletter is labeled Authors & Coaches/Alex Hormozi | Filter `from:(leila-hormozi@mail.beehiiv.com)` | Change the label to Authors & Coaches/Leila Hormozi |
| F4 | Finding 1 (unlabeled alias mail outside the inbox) is not caused by a filter | No filter matches brett@realtalkmedia.com | Left as is: SaneBox or a manual archive, unverified |

Not changed: the forwards (Igoe and Uber to Felicia, OnlineJobs.ph to Mark), the two Delete-it filters, and the blocked list are Brett's own choices.
