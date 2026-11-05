# Eval: captions

**What good looks like before a caption reaches the caption sheet.**

**Owner:** Brett until the lane is Elizabeth's. Day-to-day users: Alyza (everything but List It Live), Michelle (List It Live).
**Used by:** the editor agent on every output once it exists; until then, whoever runs the skill scores the first ten runs by hand.
**Version:** 1.0, 2026-09-23
**Pass bar:** weighted score of 4.0 or higher, no criterion below 3, zero auto-fails, and all three acceptance tests cleared.

## How to score

Score each criterion 1 to 5. Write the reasoning first, then the number. If the work is missing what you need to judge it (no source pasted, no mode named), mark "cannot assess" and send it back to the person who ran it. Score against the bar, not against how much you like the draft.

## Criteria

**1. Facts match the source (weight 3)**
A 5: every name, address, phone number, DRE number, price, date, and dollar figure appears in the description, transcript, or closings list the person supplied, and the Checked block says what it was checked against. A 1: anything invented, estimated, or carried over from a previous run.

**2. Relevant and not a restatement (weight 3)**
Elizabeth's definition of a bad caption: it misses the audience, or it repeats the content it is attached to. A 5: the caption says something the reel or listing does not, in words the show's audience would use. A 1: a summary of the transcript with a call to action bolted on the end.

**3. Fit for the destination (weight 2)**
A 5: exact sentence counts on LIL, the right length and emoji register for IG versus FB, no hashtags, place names spelled correctly, no em dashes, no banned words. A 1: needs reformatting before it can go in the sheet.

**4. No editing pass needed (weight 2)**
Alyza edits nothing today. A 5: the person copies the output into the sheet as is. A 3: one word changed. A 1: the person rewrote a sentence or reran the prompt.

**5. Complete and labeled (weight 1)**
A 5: every output the mode promises is present and labeled by destination (IG Reel, FB Reel, FB Segment, FB Post, Copy 1 to 3, Title 1 to 3). A 1: pieces missing or unlabeled.

**6. Trigger accuracy (weight 1, scored on the description, not the output)**
A 5: fires on all five phrasings that should trigger it and stays quiet on all three that should not. See the trigger test below. A 1: misses two or more.

## Automatic fails

- Any fact not traceable to the supplied source
- Any em dash
- Any hashtag (Brett, 2026-09-23)
- Anything posted, scheduled, or written to a caption sheet, Zoho, or a social platform by the skill itself
- Any Real Talk Media sales language in a client-asset caption (that is rtm-social's job)
- Personal, compensation, or credential content in any output

## Acceptance tests (all three must pass before the skill replaces the ChatGPT project)

Run on the same inputs the team used in ChatGPT that week, side by side.

| Test | Pass condition | Result | Date |
|---|---|---|---|
| Same or fewer steps from source to caption sheet | Count the steps in both tools from "I have the transcript" to "it is in the sheet." Claude is equal or lower. | | |
| No editing pass on Alyza's output | Alyza copies the output into the sheet without changing a word, on at least four of five runs. | | |
| Bad-caption test on every variation | Every caption is relevant to the audience and does not restate the asset, judged by Alyza and one of Cassie, Jen, or Brett. | | |

If any test fails, the skill sits beside the ChatGPT project until it passes. Fix this file and the skill, then rerun.

## Trigger test

**Should fire:**
1. "captions for this LIL property"
2. "write the MM captions from this transcript"
3. "segment title for Rich's interview"
4. "closing post caption for this week"
5. "caption this DLJ highlight reel"

**Should stay quiet:**
1. "draft the partner campaign email"
2. "write the REACH carousel"
3. "summarize this transcript"

**Run log:**

| Date | Method | Fired (of 5) | Quiet (of 3) | Notes |
|---|---|---|---|---|
| 2026-09-23 | Sonnet subagent given only the six installed skill descriptions and the eight phrasings | 5 | 3 | First run, before Brett saw the skill. The "when would you use this" answer matched the description. Borderline checks: "thumbnail headline for the Rebuild episode" fires (titles mode, correct); "update the caption sheet in Zoho" stays quiet (correct); "title card for our RTM YouTube upload" stays quiet and routes to rtm-social (correct) |

## Approved and rejected set

The scoring set is ten captions the team approved and ten they rejected, with one line each on what separated them. Not yet collected. Source: the RTM and FSE caption sheets and the weekly RTM Social Content Review comments in Asana. Alyza and Cassie supply the rejected ones; Brett's review comments supply the reason.

| # | Approved or rejected | Mode | Caption (or link) | What separated it |
|---|---|---|---|---|
| 1 | | | | |

## When a human steps in

Escalate before the caption goes in the sheet if any criterion scores below 3, an auto-fail triggers, or the caption is for a show or agent the skill has no framing for and the person is unsure.

## Keeping this eval sharp

When Alyza, Cassie, Jen, or Brett disagrees with a score, fix this document, not that one score. Every miss becomes a line in the next version. Rerun the whole eval on every model release, and log the model that ran in `Operations/AI Workforce/logs/usage-log.md`.
