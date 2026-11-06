# Eval: research-sidekick

**What good looks like before a brief reaches Brett.**

**Owner:** Brett Ward
**Used by:** Brett on the first three briefs (done 2026-10-16); since then the CMO scores every brief's first draft before Brett sees it and records it in the run table. The editor does not grade research
**Version:** 1.1, 2026-11-03 (worker review under the CMO: keep on sonnet, fix the eval)
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails

## How to score

Score each criterion 1 to 5. Write the reasoning first, then the number. If the brief names no sources, mark "cannot assess" and send it back.

Score the first draft. A brief revised after Brett's review keeps its first-draft score; the revision gets its own row.

## Criteria

**1. Every fact sourced and dated (weight 3)**
A 5: every fact carries a URL, Zoho record, or file path and the date captured. A 1: any fact without a source, or a source that does not say what the brief says it says. Zoho writes count: a field written from an unsourced fact is a 1.
- Missed source (2026-10-15, Brian Daly): for anyone already in Brett's world, check Gmail for the relationship history and any reply to an open ask, and check Smartsheet and the Hub for Five Star escrow volume. Zoho alone understated a top client as "List Sides 0".

**2. Answers the one question first (weight 2)**
A 5: the first three lines say who this is, what they do, and why Brett would talk to them (or, for a topic, what is true and what the decision is). A 1: the answer is buried or missing.

**3. Nothing unverified stated as fact (weight 3)**
A 5: everything the sidekick could not confirm sits under "Could not verify." A 1: an inference presented as a fact, or a financial figure estimated.

**4. Right avatar, right door (weight 2)**
A 5: the person is placed in the correct avatar (a $50M+ list-side producer Brett pursues, a marketing-attracted 8+ list-side agent, or an investor) and the brief names the door (referral intro, Rebuild invitation, direct outreach) and the why-now. A 1: avatar wrong or conflated, or a Five Star pitch proposed.
For a topic or scope: a 5 names the decision, the initiative or plan it feeds, and what changes with each answer. Avatar and door are N/A.

**5. Brett can act without opening the sources (weight 2)**
A 5: one page or less (about 600 words; a Blueprint gather pack is exempt), a facts table, the door, one plain-words opener Brett can make his own. A 1: Brett has to read the sources to know what to do.

**6. Cost discipline (weight 1)**
A 5: Tracerfy only when Brett asked for contact data on a named person (one hit per person); Apify within the agent file (one small lookup without staging, a Blueprint gather up to $5, anything more staged); tokens and paid cost on the usage-log line. A 1: a paid run Brett did not approve, or cost not logged.

**7. Branding Blueprint gather coverage (weight 2, gathers only)**
A 5: every active platform pulled within the window, actual Apify cost logged per run, or the gap named with the reason. A 1: a platform skipped without a reason, or cost not logged.

## Automatic fails

- Any contact made, any outreach drafted
- A Zoho status field changed, a workflow invoked, or a record deleted
- A Zoho write not listed in the brief
- A financial figure estimated rather than sourced
- A brief saved outside `Business Development/` or `Content & Authority/`
- Compensation, ownership, or Max Income content in a brief

## The first three (run before the sidekick is trusted)

| # | Brief | Serves | Brett's rating | Cost |
|---|---|---|---|---|
| 1 | One Rebuild guest candidate from the four categories | Initiative 7a | Useful (2026-10-13): Dean Aguilar, Dean Aguilar Group; kept despite a prior RTSD radio invite | No paid lookups; about 96K subagent tokens, 42 tool calls |
| 2 | One REInvest investor (Neil ask prep, or a founding-table candidate) | Initiative 7 | Partly (2026-10-15): Brian Daly, WeRevive. Missed that WeRevive is Five Star's second-biggest client (volume in Smartsheet and the Hub), missed Brian's reply to the ask and the relationship history in Brett's Gmail | No paid lookups; about 134K subagent tokens, 38 tool calls |
| 3 | One $50M+ list-side producer for the partner campaign | Initiative 8 | Useful (2026-10-16): Greg Noonan, BHHS La Jolla, about $113.8M closed list price from Zoho listing rows | Two Apify rag-web-browser runs, about $0.04; about 223K subagent tokens, 65 tool calls |

## Run table (after the first three)

| Date | Brief | Type | CMO score | Brett's rating | Tokens | Paid |
|---|---|---|---|---|---|---|
| 2026-11-03 | Rescore of the first three (Dean Aguilar, Brian Daly as revised, Greg Noonan) | Person | 4.23 / 4.69 / 4.54, all pass | Useful / Partly / Useful | 96K / 134K / 223K | $0 / $0 / about $0.04 |

The Brian Daly rescore beat Brett's Partly because it scored the revised file; that gap is why first drafts are scored from v1.1. Review: Operations/AI Workforce/drafts/2026-11-03-research-sidekick-worker-review.html.

## Keeping this eval sharp

When Brett disagrees with a score, fix this document, not that one score. A fact the sidekick got wrong becomes a line under criterion 1 with the source type that failed. Rerun on every model release.
