# Captions Skill Spec (draft)

_Drafted 2026-09-17 from the prompts embedded in the LIL/MM recurring tasks, the FSE closing post task, and the highlight reel tasks on the RTM Social Calendar. This is the ChatGPT captions project rewritten as one skill. The team's process does not change: same inputs, same outputs, same caption sheets, same review. Only the tool changes. Validate with Elizabeth and the people who run it (Michelle, Alyza, Cassie) before it ships._

## Name and trigger

- Name: `captions`
- Description for the skill file: writes social captions and titles for List It Live, Market Movers, Five Star closing posts, and podcast highlight reels from a property description, a transcript, or a closings list. Use when someone says "captions," "LIL captions," "MM captions," "segment title," or "closing post caption." Do NOT use for email copy, carousel or newsletter copy, or REACH promotion copy; those belong to the copywriter.
- Voice lives in voice-principles.md, not in this skill. The skill carries the process and the checklist and points at the voice file for tone (Ruben's stacking rule, 2026-09-17).

## Five modes

| Mode | Input | Output | Rules carried over from today |
|---|---|---|---|
| LIL property | The MLS property description (pasted or read from the LIL property list) | Two Instagram-ready versions: one of two short sentences, one of four short sentences | Exact sentence counts. No em dashes. Facts only from the description. The two-sentence version goes to IG Reel and FB Reel; the four-sentence version to FB Segment. |
| MM reel and post | The reel transcript, plus the full segment transcript when available | An Instagram reel caption (short, punchy, mobile-first, light relevant emojis) and a Facebook post caption (mid-length, informative, conversational, lightly persuasive, emojis sparingly). Each with a light CTA and platform hashtags | Clean up spelling, clarity, and timestamps. No em dashes. Dollar signs on dollar amounts. San Diego place names spelled per the local guide. |
| MM segment title | The segment transcript and the agent's full name | Three concise, punchy title options | The person picks one and renames the segment. |
| FSE closing post | The week's closings list (agent names and addresses) | Three short Instagram captions congratulating Realtor clients on their closings | Hashtags in the current style (#JustClosed, #RealtorSuccess). Agent tagging is done by the person in the post, not in the caption. |
| Podcast highlight | Episode number, show, host, guest, and the reel transcript or cut sheet | One caption in the current highlight format: the lesson in the first line, the episode context, the takeaway for agents, then show, host, and guest handles and five hashtags | Matches the pattern on the RTM Social Calendar. Verify with Elizabeth who writes these today and whether the format is fixed. |

## The checklist the skill runs before handing anything back

1. Every name, address, phone number, DRE number, and price appears in the source. Anything not in the source is left out and flagged.
2. No em dashes anywhere.
3. No banned words or openers from voice-principles.md. No filler phrases.
4. Sentence counts match the mode.
5. Emojis follow the platform rule for the mode. None in titles.
6. Hashtags: five or fewer, relevant to the show and the topic, no generic real-estate spam.
7. San Diego names checked against the local pronunciation and abbreviation guide.
8. Output is labeled by destination (IG Reel, FB Reel, FB Segment, FB Post) so it drops straight into the caption sheets.

## Where it runs and who runs it

- Today: Brett or Elizabeth on the Cowork tab or Code tab, with the Drive connector reading transcripts from the show folders.
- After Team Edition: Michelle, Alyza, and Cassie run it by name from their own sessions with the same skill file. The shared ChatGPT login retires.
- The skill never posts, never writes to the caption sheets, and never touches Zoho. The person copies the output into the sheet exactly as they do now.

## What changes for the team

Nothing in the order of work. One tool swap, one login retired, one checklist that used to live in three people's heads now runs every time.

## Acceptance test before it ships

1. Ask a fresh session "When would you use the captions skill?" and check the answer against the description. Fix the description until the answer matches.
2. Five phrasings that should fire it ("captions for this LIL property," "write the MM captions from this transcript," "segment title for Rich's interview," "closing post caption for this week," "caption this DLJ highlight reel") and three that should not ("draft the partner campaign email," "write the REACH carousel," "summarize this transcript"). Five fire, three stay quiet.
3. Ten real captions the team approved and ten they rejected, run through the skill and the editor, with the eval scoring them.

## What the ChatGPT workspace showed (2026-09-21)

The LIL and MM captions project has no project instructions; the prompts in the threads are the whole system, and they match the task descriptions. Two more patterns live in that project: List It Live and Market Movers thumbnail headlines. Five other projects carry real instructions (podcast captions and headlines, podcast social captions, RTM products and services, agent influencer captions, the video playbook). See 2026-09-21-chatgpt-workspace-inventory.md. Consequences for this spec: add a titles mode for reel thumbnail headlines (three options, a person picks); treat RTM's own social captions as a second skill with a different voice; use the exported project instructions in assets/chatgpt/ as the source for per-line rules and examples. Full inventory, including who uses which project, in 2026-09-21-chatgpt-workspace-inventory.md.

## Open items before it ships

- Done 2026-09-21: the LIL and MM project carries no instructions. The five projects that do are exported verbatim to assets/chatgpt/ with the Sources listed; the per-line rules are written from those files. Add a List Kit mode (property description in two-line sections, three copy variations, just-sold version) and an image-quotes pattern (five direct quotes from a transcript) to the scope decision.
- Confirm the podcast highlight format and who owns it.
- Confirm hashtag conventions per brand (RTM, FSE, each show).
- Move the ChatGPT and Instagram logins out of the task descriptions and into 1Password before any agent reads those tasks.
- Build the eval: ten real captions the team approved, ten they rejected, and what separated them.
