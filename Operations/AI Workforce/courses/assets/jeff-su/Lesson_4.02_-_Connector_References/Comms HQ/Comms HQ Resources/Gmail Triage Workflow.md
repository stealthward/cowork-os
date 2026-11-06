# Gmail Triage Workflow

_Comms HQ resource. The Gmail-specific inbox workflow: the two-phase triage, category rules, label taxonomy, draft-reply behavior, and triage output format. Read at session start whenever you say "let's go through my inbox" (or similar). It contains the inbox mechanics only. It does NOT contain cross-channel structure and decision rules (see `Comms HQ/CLAUDE.md` > Operating Rules), email formatting and tone (see `Comms HQ/Comms HQ Resources/Email Comms.md`), or your universal voice (see `00_Reference/Voice Principles.md`). Lesson 4.01 teaches how to connect Gmail; `00_Reference/Google Workspace Conventions.md` owns the durable operating behavior once Gmail is connected._

---

## The Two-Phase Workflow

Your email workflow has two phases. Phase 1 gets the inbox to zero by categorizing every message. Phase 2 is when you actually do the deeper work that some messages require.

### Phase 1: Inbox Triage (~10 minutes)

**Goal:** Get the inbox to zero. Every email gets categorized, and quick replies (under 2 minutes) are drafted on the spot for you to send.

**Trigger:** You say "let's go through my inbox" (or similar). Read every email in the inbox from oldest to newest (strict chronological order by date; the oldest email is always number 1 regardless of urgency), categorize each one, draft replies for anything that takes under 2 minutes, and present a triage summary.

**Approval boundary:** Even if you say "clear my inbox," treat that as a request to triage and recommend actions first. Do not archive, label, snooze, send, or create Gmail drafts until you approve the specific actions after reviewing the triage summary.

**Load project context before drafting.** Before categorizing or drafting a reply for any email, check whether it relates to an active project or commitment (match sender, subject, or topic against your workspace context). If it does, load that project's MEMORY.md first. Contact history alone is not enough: the project context holds existing commitments, deadlines, and dependencies that change what a correct triage looks like. When an email asks you to commit to future work (scheduling, availability, testing, advisory, beta participation, speaking, interviews), load your active commitments and any confirmed travel windows before drafting a "yes." The headline ask often hides the real cost: a one-line opt-in can carry setup, testing, and follow-up obligations. When the next few months are saturated, default to a polite decline with a specific re-engagement window, even when the opportunity is a good fit. A scheduling reply that ignores adjacent commitments is worse than no draft at all.

**Related-thread sweep.** When loading project context surfaces an active project for an inbox thread, search the inbox for other threads from the same people and topic. A single query may not surface all related correspondence. Triage related threads as a group so context carries across them.

**End state:** Inbox shows no new mail. Your label queues (Follow Up, Pending, Pinned) may have new entries. Those get handled in Phase 2.

### Phase 2: Dedicated Email Session (later, when you have time)

**Goal:** Work through the Follow Up and Pending queues.

- **Follow Up emails:** You take the actual action (review a doc, write a substantive reply, process a payment). Once done, remove the Follow Up label and archive.
- **Pending emails:** You check whether the other party has delivered. If not, send a follow-up nudge. When the item resolves, remove the label and archive.

The AI's role in Phase 2: draft substantive replies, surface context from your workspace files, and flag any Pending items that are overdue.

---

## The Two-Minute Rule

This is the core decision for every email during Phase 1. Before assigning a category, estimate whether the email can be fully processed (reply sent, action taken) in under 2 minutes.

- **Under 2 minutes:** Process it now. Draft the reply, you send it, archive. No label needed.
- **Over 2 minutes:** Apply the appropriate label (Follow Up or Pending) and archive. You handle it in Phase 2.

The triage output includes a time estimate so you can make this call at a glance.

---

## Label Taxonomy

### Workflow Labels

Three workflow labels. Follow Up and Pending are mutually exclusive (an email is one or the other, never both). Pinned is NOT mutually exclusive and can combine with either.

- **Follow Up** (red): Action required from you. You are responsible for doing something.
- **Pending** (yellow, equivalent to "Waiting"): Someone else needs to act, but you still own the outcome. Typically applied to sent emails. If an incoming email resolves a Pending item, flag it so you can remove the Pending label from the original.
- **Pinned** (blue): A thread that needs to stay visible for an extended period because it will be repeatedly relevant (an ongoing project thread you reference weekly, a plan you check against regularly).

### Topical Labels

Topical labels classify an email's domain. They stack with workflow labels (an email can be Follow Up + a topical label). Default to "None" when nothing fits; most emails won't get a topical label. Customize this set to match your own life and work. Common starting categories:

- **Finance / Records:** A payment notification, invoice, receipt, payout confirmation, or sale notification.
- **Network:** A warm professional contact reaching out for a catch-up, advice, or a non-paid collaboration.
- **Personal:** Email from or about friends, family, or personal accounts.
- **Vendor / Service:** A tool, subscription, or service provider you do business with.

Add, rename, or drop categories so the taxonomy reflects the domains you actually triage.

**Placement.** Surface the recommendation as an "Apply label: [Name]" bullet directly under the Action line, since applying the label is one of your actions during processing. Omit the bullet when the recommended label is None. The end-of-brief recap consolidates all label recommendations (skipping None) under a "Topical labels to apply" subheading for batch review.

**Recommendation-only by default.** The AI recommends; you apply the label manually after review. Once you trust the pattern, you can let the AI apply labels directly.

---

## Category Rules (apply in this order)

1. **Follow Up** (red): Requires action from you and will take more than 2 minutes. Examples: reviewing a document, writing a detailed reply, researching before responding. Label "Follow Up" and archive. The "action required" test applies to the thread's whole lifecycle, not just the latest message: if the latest message is an acknowledgment but the thread has open deliverables with upcoming deadlines, Follow Up is still correct so the thread stays visible as a reminder.
2. **Pending** (yellow): You sent an email where someone else needs to act, but you still own the outcome. A Pending item is resolved when the outcome is confirmed, not when the other party promises to act. A promise to pay, send, or deliver does not close the loop; keep Pending until you've verified the actual result, and snooze to the expected completion date as a checkpoint. When a Pending item resolves, trace back to the originating message to identify the action the thread was created to enable: that unblocked action is the real next step, not just removing the label.
3. **Pinned** (combines with Follow Up or Pending): A thread that stays relevant for an extended period. Recommend when a thread spans a whole project lifecycle.
4. **Snooze:** Requires action, but the deadline is far out or there's a specific future date when it becomes relevant. Examples: invoice notifications (snooze to the expected payment date), event reminders with distant deadlines. Recommend a specific snooze date with reasoning.
5. **Mute:** Reply-all or group-alias threads where you're CC'd, no action is needed, and the thread will keep generating noise. Archive and mute.
6. **Archive immediately:** No action needed, no reference value, no future relevance.
7. **Leave in inbox:** Notifications you want to read yourself before deciding. No draft, just a summary.

---

## Sender Overrides

Sender- or notification-specific rules that override the generic category rules above. This is where you teach the workflow how to handle the recurring senders in your own inbox. Two principles govern this section:

- **An override sets the category, not the owner.** The relevant workstation context still loads, and a contradiction between an override and that context gets flagged in the triage output, never silently applied.
- **Coverage defaults.** If someone else (an assistant, a team member, a service) covers a class of email, mark it as FYI-only: archive, no draft, no label, and flag to you only when it needs your input.

Build your override list over time. Example patterns to adapt:

- **Invoice / payment confirmations** (payment processors, billing services): Recommend Snooze to the expected payment date based on the terms (e.g., net 30), not "archive" or "leave in inbox."
- **Recurring vendor notifications** that map to a documented procedure: read the relevant SOP and present the steps directly in the triage output.
- **Receipts and billing confirmations** you keep for records: apply your Finance / Records label, then archive.
- **Automated weekly reports** you only skim: surface the headline number in the triage output, then archive. No reply, no label.

Each override entry stays lightweight: the email pattern, the category, and a pointer to any SOP that holds the full steps.

---

## Outreach Triage Ladder

Before drafting any reply, determine relationship status, then apply the matching posture:

1. Search your email for previous messages from the sender.
2. If your email returns nothing, check your contacts or people notes by name (not just email address): people change companies and email addresses, so the person is the relationship, not the address. If you find a match, treat it as an existing relationship regardless of the sending domain.

Then:

- **Cold sales or sponsorship outreach with no prior relationship:** Most are spam or low-value. Recommend archive (or block + spam for clearly fraudulent senders). No reply. The exception: requests relayed through your own public listing or opt-in marketplace are not cold outreach; review them in-platform rather than blocking.
- **General cold outreach** (non-sales, e.g., a collaboration ask): Friendly but clear no. Don't soft-commit or leave doors open that create follow-up obligations. Unsolicited applications for closed or inactive roles get no reply: archive silently, since replying only invites follow-up pitches.
- **Existing relationships** (prior history or a contact match): Respond positively based on your bandwidth. Use the history and context to inform tone.

---

## Multi-Party Thread Interpretation

When an email is addressed to multiple parties, read who the instructions are directed at before triaging. If the sender is giving directives to their own team and you're on the thread as an informed party, the action sits with the other team, not you. Categorize as Pending (awaiting their deliverable), not Follow Up. The test: are the verbs asking you to do something, or telling the sender's colleagues to do something? Misreading internal instructions as your action items creates phantom Follow Ups and premature replies.

---

## Thread Completeness Verification

Before triaging any thread, verify you have the complete content of the most recent messages. When a thread fetch returns a truncated result, recover the last few messages' full body before triaging. If the search snippet shows fewer messages than the thread actually contains, fetch the missing ones. Never triage from a partial view of a thread. If no method produces usable content, categorize as "incomplete, needs manual review" rather than guessing. Never tell yourself to "read the email manually" when a draft reply is expected; produce a tentative draft with explicit caveats about which content came from snippets versus full messages.

---

## Pinned Thread Handling

When a thread carries a Pinned label, it has ongoing significance by definition. Never recommend "Archive immediately" for a Pinned thread. Pinned threads often have recent activity that changes the correct category.

---

## Snooze Logic for Invoices and Payments

When an invoice or payment notification arrives, don't just recommend "archive." Calculate the expected payment date based on the terms (typically net 30) and recommend snoozing to that date, which turns the snooze into a payment-verification reminder. When reporting overdue status, measure the overdue period from the payment deadline (start date plus terms), not from the invoice submission date: these are different numbers, and conflating them misrepresents urgency.

---

## SOP-Based Triage

When a triage email maps to a documented procedure (a platform notification, a recurring maintenance task), read the relevant SOP file and present the steps directly in the triage output. If no SOP exists yet, propose creating one (file name, destination, contents) and get your approval before creating it. The sender-override entry stays lightweight; the full steps live in the SOP file, not inline in the triage rule.

---

## Triage Output Format

Present each email using this structure:

```
**[Number]. [Sender Name]** | [Email Subject]

**Category:** [Category name]

[One to two sentences on what the email is about and why this category.]

**Time estimate:** [Under / Over 2 minutes]

**Action:** [What you should do.]

- Apply label: [Topical label name]

**Draft reply:**

> [The full draft reply text, in a blockquote. Only include if a reply is needed.]

**What I drafted:** [One-sentence summary of the draft. Only if a draft was written above.]

**Action items beyond sending:**

- [Item 1]
- [Item 2]

**Proposed updates:**

- **[Target file > Section]:** [Exact content to write, self-contained.]
```

Omit sections that don't apply (no "What I drafted" for leave-in-inbox emails, no "Action items" if there are none, no "Proposed updates" if nothing new surfaced). Omit the "Apply label" bullet when the recommended topical label is None.

**End-of-brief recap.** After all emails are triaged, close with a consolidated recap listing every proposed action item and update, grouped by type, so you can approve or reject without scrolling back through individual emails.

---

## Draft Reply Behavior

- **Surface ambiguity, don't interpret it.** When an email contains a vague ask, the draft should ask the sender to clarify rather than assuming their intent. Frame it neutrally: "Could you clarify what you're asking here?"
- **Draft in chat by default.** A "draft reply" means text shown in the triage output for you to review, copy, and send. Do not create a Gmail draft unless you explicitly ask for one.
- **Under-2-minute emails:** Draft the reply in the triage output so you can copy, paste, and send during triage.
- **Over-2-minute emails that require action first:** Draft the reply as if you've already completed the action. Your workflow is: label Follow Up, complete the work, review the pre-drafted reply (now true), send. Never draft "acknowledgment" or "will do" placeholders; you don't reply until the work is done.
- **Over-2-minute FYI emails:** Just categorize, label, and archive.
- **Include a subject line for new emails, not replies.** For a brand-new email, include a proposed subject line above the body. For a reply within an existing thread, skip it, the subject is already set.
- **Resolve recipients before thread continuity.** For a reply, set `To` to the current external sender who owns the active request. Do not carry earlier `Cc` or `Bcc` recipients forward merely because they appear in thread metadata; include them only when the current request explicitly asks for them. Chat-only drafts omit recipient metadata unless requested. Before sending, show the final `To`, `Cc`, and `Bcc` list for approval. Then preserve the thread only when its subject and active decision still match; otherwise start a new thread with only the context the recipient needs.
- **One draft, not options.** Produce one version; you edit from there.
- **Surface action items for every email.** After the reply, list any actions beyond hitting send (saving an attachment, uploading a file, adding a contact, forwarding to someone, scheduling a follow-up). If there are none, say so. Only list actions that are safe to take right now, independent of unresolved questions; if an action depends on a pending reply, note it as a conditional next step ("Once [dependency] is confirmed: [action]") rather than an immediate action item.
- **Don't cite stale data back to the sender.** When a number came from the recipient in a prior message and can't be verified live, omit it rather than citing their own (possibly outdated) figure back to them. If it matters, ask them for an update.
- **Verify personal details before citing them.** When a draft references your own experiences (trips, events, places), confirm the details from your workspace files first rather than extrapolating. Adding a detail you didn't actually do is a fabrication error.
- **Flag if something feels off.** If a requested send seems out of character or could land badly, say so before drafting.
- **Codify new reply patterns where they belong.** When triage surfaces a new reply pattern for a specific domain, the pattern belongs in the workstation that owns that domain. Comms HQ keeps a lightweight triage sender rule pointing to it.

---

## Related Files

- `Comms HQ/CLAUDE.md` (cross-channel structure and decision rules)
- `Comms HQ/Comms HQ Resources/Email Comms.md` (email formatting and tone)
- Any topical Comms HQ reference file you have added for a recurring reply pattern, such as decline or deflection framing
- `00_Reference/Voice Principles.md` (universal voice)
- Lesson 4.01 (connecting Gmail)
- `00_Reference/Google Workspace Conventions.md` (operating behavior after Gmail is connected)

---

## Changelog

- [2026-07-27] Replaced thread-first drafting with recipient resolution before continuity so historical recipients never become implicit authorization.
- [2026-07-10] Clarified that Lesson 4.01 owns Gmail setup and Google Workspace Conventions owns operating behavior after connection.
- [2026-06-23] Added the approval boundary for "clear my inbox" requests and clarified that reply drafts stay in chat unless a Gmail draft is explicitly requested.
- _Add your dated notes here as you adapt this workflow._

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
