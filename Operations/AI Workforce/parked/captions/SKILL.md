---
name: captions
description: "Writes social captions and titles for client assets from a property description, a transcript, a closings list, or a cut sheet: List It Live property captions, Market Movers reel and post captions, List Kit copy, Five Star closing post captions, client podcast show captions (Discover La Jolla, Discover Ramona, Discover East County and the other client shows), and titles for segments, reel thumbnails, and episodes as three options a person picks from. Use when someone says 'captions', 'LIL captions', 'MM captions', 'List Kit captions', 'closing post caption', 'caption this reel', 'segment title', 'thumbnail headline', or 'episode title'. Do not use for Real Talk Media's own pages or anything that sells RTM (that is rtm-social), for email, carousel, newsletter, or REACH promotion copy (that is the copywriter), for transcript summaries or cut sheets (that is reel-cut-sheet), or to post, schedule, or write to a caption sheet or Zoho (a person does that)."
---

# Captions

Source of truth: `.claude/skills/captions/SKILL.md` in the Cowork OS. Any copy installed on the claude.ai account is a deployment of this file. Built 2026-09-23 from the team's ChatGPT captions system: the thread prompts in the Asset: LIL & MM Captions project, the Asana task descriptions on the List It Live / Market Movers Recurring project, and the exported instructions in `Operations/AI Workforce/assets/chatgpt/`. The team's process does not change: same inputs, same outputs, same caption sheets, same review. Only the tool changed. Tag: Shared Core.

This skill drafts. It never posts, never schedules, never writes to a caption sheet, and never creates or edits a Zoho record. The person copies the output into the sheet exactly as they do today.

## What to read first

1. `00_Resources/voice-principles.md`. Tone and the banned-word list live there, not here. Read the "Emojis by brand line" section: client show socials and Five Star social use emojis, Brett's own voice does not.
2. `.claude/skills/captions/san-diego-place-names.md` when the source is a transcript. Transcripts mangle local names; the list carries the correct spellings and the abbreviations to expand.
3. The source the person supplied. Nothing else. A caption written from memory of a previous run is a failed caption.

## Pick the mode

Ask for the mode only when the input does not make it obvious. An MLS description is LIL or List Kit; a reel transcript with an agent name is Market Movers; a closings list is FSE closing; a podcast reel transcript with a show name is podcast show; a request for a title is titles.

| Mode | Input | Output |
|---|---|---|
| LIL property | MLS property description, pasted or read from the List It Live property list | Two Instagram-ready versions: one of exactly two sentences, one of exactly four sentences |
| MM reel and post | Reel transcript, plus the full segment transcript when supplied | One Instagram reel caption and one Facebook post caption |
| List Kit | MLS property description, agent name, and whether the listing is active or just sold | Property description in two-line sections, three social copy variations, and a just-sold version when asked |
| FSE closing post | The week's closings list: agent names and addresses | Three short Instagram captions congratulating the Realtor clients (or the number requested) |
| Podcast show social | Show name, episode number, host, guest, and the reel transcript or cut sheet | Three caption variations in the show's framing |
| Titles | Transcript or reel transcript, the agent's or guest's full name, and which kind: segment, reel thumbnail, or episode | Three title options. The person picks one and renames the file or segment |

## Rules per mode

### LIL property

- Facts come only from the description. Beds, baths, square footage, price, features, neighborhood, and the agent's name appear only if the description states them.
- Sentence counts are exact: two sentences in the first version, four in the second. Count them before returning.
- No emojis unless the person asks; the caption sheet carries those today.
- Label the outputs: the two-sentence version is **IG Reel** and **FB Reel**; the four-sentence version is **FB Segment**.

### MM reel and post

- Instagram reel caption: short, punchy, mobile-first, light relevant emojis, a light call to action.
- Facebook post caption: mid-length, informative, conversational, lightly persuasive, emojis sparingly, a light call to action.
- Clean up spelling, clarity, and any timestamps carried over from the transcript. Dollar signs on every dollar amount. San Diego place names spelled per the place-name file.
- The caption has to say something the reel does not. A caption that restates the transcript fails Elizabeth's bad-caption test. Lead with why a viewer should care, then point at the reel.
- Label the outputs **IG Reel** and **FB Post**.

### List Kit

- Property description in two-line sections: each section is two short lines, one feature per section, in the order a buyer would walk the home. Facts only from the description.
- Three social copy variations for the agent's own pages, each with a different angle (the neighborhood, the standout feature, the lifestyle). Agent name as supplied. Luxury listings get a calmer register: fewer exclamation points, no hype words.
- Just-sold version when asked: same facts, past tense, congratulates the agent's clients without naming the buyer or seller.
- Label the outputs **Description**, **Copy 1**, **Copy 2**, **Copy 3**, and **Just Sold**.

### FSE closing post

- One caption per closing or one caption covering the week, whichever the person asks for. Default: three variations covering the list.
- Congratulate the Realtor client by name. Addresses only when the person includes them; some agents do not want the street published.
- Emojis allowed, per the Five Star brand line.
- Do not write @handles into the caption. The person tags agents in the post.
- Label the outputs **IG Post 1**, **IG Post 2**, **IG Post 3**.

### Podcast show social

- Voice is the show's, aimed at the show's local audience. This is not Real Talk Media's voice and it does not sell RTM; that is `rtm-social`.
- Three variations. Informative, engaging, and value adding, with emojis. Each variation names the guest, what they do, and one concrete thing they said, then points at the episode by number and show name.
- Per-show framing:
  - **Discover La Jolla.** Hosted by La Jolla native Realtor Jim McInerney. Features business owners, leaders, and prominent individuals from La Jolla. The link-in-bio call to action names @discover.lajolla.
  - **Discover Ramona.** Hosts Jan Ryan and Valli Lopez spotlight the people, places, and businesses of Ramona. Multi-day premiere copy runs as a sequence: day one introduces the guest, day two goes deeper on one topic, day three carries the guest's advice.
  - **Discover East County, Aging Parents, Senior Spaces, Cashflow, and any other client show.** No written framing yet. Use the host and guest names the person supplies, match the tone of the two shows above, and say in the output that the framing came from the request, not from a rule.
- Label the outputs **Caption 1**, **Caption 2**, **Caption 3**.

### Titles

- Three options, concise and punchy, in sentence case. No emojis, no colons doing the work of a verb.
- **Segment title:** the agent's full name appears in at least one option; the title says what the segment is about, not that it is an interview.
- **Reel thumbnail headline:** six words or fewer; readable at phone size; carries the hook, not the summary.
- **Episode title:** the guest's name or business plus the one idea the episode is about.
- Label the outputs **Title 1**, **Title 2**, **Title 3**.

## The checklist, run before anything is returned

Run every line and fix the draft before handing it back. Report what could not be checked.

1. **Facts.** Every name, address, phone number, DRE number, price, date, and dollar figure appears in the source the person supplied. Anything not in the source is left out and flagged in one line under the output. When the person also pastes the Zoho record or the caption sheet row, check the caption against it and say which fields matched. When they do not, say "checked against the description only" so QC knows what is still open.
2. **No em dashes.** Anywhere, in any mode. Use commas, colons, or periods.
3. **No banned words, openers, or filler** from voice-principles.md. No "dive into", no "game-changing", no "In today's market", no "It's worth noting".
4. **Sentence counts** match the mode. Count the LIL versions out loud.
5. **Emojis** follow the mode's rule. None in titles. None in LIL property captions unless asked.
6. **No hashtags.** None, in any mode, on any brand line, even if the source examples or the ChatGPT instructions carry them. Brett's decision 2026-09-23. If the person asks for hashtags, say the rule and return the caption without them.
7. **Place names** match `san-diego-place-names.md`. Abbreviations the transcript used (RSF, PB, OB, PQ) are spelled out.
8. **Audience and non-repetition.** The caption is relevant to the people who will see it, and it does not restate the asset it sits on. This is the test Elizabeth uses to call a caption bad; run it on every variation.
9. **Labels.** Every output is labeled by destination so it drops straight into the caption sheet.

## Output shape

Return the labeled outputs, then one short block headed **Checked** with two or three lines: what the facts were checked against, anything left out because it was not in the source, and anything the person still has to confirm. No preamble, no explanation of the caption, no offer to revise.

## Constraints

- Never post, schedule, or write to Zoho Social, Meta Business Suite, a caption sheet, or a Zoho record. Say so if asked, and return the copy instead.
- Never invent a fact to fill a gap. Leave it out and flag it.
- Never add a credential, login, or link the person did not supply.
- One run, one asset. A request for several properties or several reels gets one labeled block per asset, in the order supplied.
- Nothing about Real Talk Media's services in any caption. If the request is for RTM's own pages, say so and point at `rtm-social`.
- When the run is on the Code tab, append one line to `Operations/AI Workforce/logs/usage-log.md` in the form `YYYY-MM-DD | captions | model that ran | mode and asset`. On claude.ai the log is skipped; say nothing about it.

## Ships when it passes

`Operations/AI Workforce/evals/captions-eval.md` holds the bar: the three-part acceptance test against the ChatGPT project on the same inputs (same or fewer steps, no editing pass on Alyza's output, every caption passes the bad-caption test), the five-fire three-quiet trigger test, and the scored criteria. Until it passes, this skill sits beside the ChatGPT project and does not replace it.
