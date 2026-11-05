# Roster Proposal: Content Operations Lane (superseded 2026-09-23)

_Superseded 2026-09-23: Brett decided that nothing is built for other users until Team Edition, and the first lane is his own work instead. This roster is kept as the starting point for the team phase; the discovery findings and Elizabeth's answers in it still hold. Original header follows._

_Approved by Brett on 2026-09-21 (evening), every decision answered by multiple choice; the record is in "What Brett decided" below. This passes the Phase 2 gate: the agent and skill files may now be written to `.claude/`. Version 2.1, updated 2026-09-21 after Brett and Elizabeth completed the interview together (nineteen of twenty answered). Version 2 was written 2026-09-20 from Elizabeth Eidbo's interview answers and A/B/C sort (Google Doc, last edited 2026-09-19), her markup of the flow map, and a fresh discovery pass over the OS and Asana. Version 1 from 2026-09-17 is preserved at `2026-09-17-roster-proposal-superseded.md`. Every change from version 1 is marked and reasoned in "What changed from version 1" at the end. This is still the Phase 2 gate: nothing in `.claude/` gets written until Brett approves this roster._

## What discovery found

- **The work.** Three content lines run every week: the studio shows (List It Live and Market Movers), the podcasts (six shows, one project per record date), and the social calendars for RTM and Five Star. Premiere weeks are not uniform: Discover La Jolla runs four, Discover East County and Discover Ramona run two.
- **The people.** Elizabeth runs operations and the VAs. Cassie owns guests, QC, and delivery. Michelle owns booking, decks, List It Live captions, and Zoho records. Alyza owns thumbnails, reel QC, posting, the monthly content map, and captions for everything except List It Live. Mark produces and uploads. Editors and designers execute. Jen does the final Five Star review on some pieces, which version 1 missed.
- **Where AI already sits, corrected.** Alyza is the heavy user of the ChatGPT captions project, not Michelle. She runs it for FSE, RTM, Discover Ramona, Discover East County, and Market Movers, and she edits nothing after the output comes back. Michelle runs it for List It Live only and edits the property and agent details from a template.
- **The one stall.** Elizabeth named the RTM Social Review, which carries three review layers in sequence: Mark and Elizabeth confirm what to prep, Elizabeth reviews for edits before reassigning, then Brett approves.
- **The pure tool-to-tool work.** Her answer, unprompted: Michelle's prep tasks and the podcast asset delivery tasks, on close to every project.
- **The quality bar.** A bad caption misses audience relevancy and repeats the content it is attached to. Brett catches it on RTM, Cassie or Jen on FSE.
- **The switching cost.** Asked what would make the team abandon a replacement, Elizabeth said speed, extra steps, and output that needs more editing. All three. Alyza edits nothing today, so a replacement that needs one editing pass is a downgrade.
- **What stays with people.** Filming, editing, design, guest relationships, posting to platforms that need a logged-in human, scheduling and content-type judgment, and Brett's final approval on RTM.

## The roster

One director, four sidekicks, one skill. No chief of staff yet; that arrives in Phase 3 when a second lane exists to route between.

| Role | File name | Tier | Lane and job | Tools (least privilege) | Trigger |
|---|---|---|---|---|---|
| Director | `content-ops-director` | sonnet | Owns the content lane. Reads the three calendars and the flow map, breaks a request into sidekick tasks, passes each sidekick only what it needs, reports back. Never posts, never sends. | Asana read and write on the content projects, Drive read, file read and write inside the OS | On request from Brett or Elizabeth; weekly calendar review on a schedule |
| Sidekick | `copywriter` | sonnet | Drafts captions, carousel copy, newsletter copy, and REACH promotion copy from a transcript, cut sheet, MLS description, or topic. Reads voice-principles.md, content-frameworks.md, and the Brand Driver skill. Delivers social work in Brett's stated format: post copy, post type, approved caption, in one document. | File read, Drive read | Called by the director |
| Sidekick | `editor` | sonnet, opus on a miss | Grades every draft on the two things it can actually see: audience relevancy and non-repetition against the asset the caption is attached to (Elizabeth's definition of a bad caption), plus facts against source, voice, frameworks, and platform rules. Reports what it could not check. | File read | Called by the director on every draft |
| Sidekick | `calendar-coordinator` | haiku for reads, sonnet for briefs | Reads the RTM and FSE calendars, the Podcasts projects, and the LIL/MM project. Reports gaps, stalls, and unassigned pieces, and specifically where a piece is sitting in the three-layer RTM Social Review. Writes VA briefs and tasks in the Asana bullet format. Never completes or deletes a task. | Asana read and write on the content projects | Weekday morning schedule |
| Sidekick | `podcast-prep` | haiku | Michelle's tool-to-tool work: creates the podcast Drive folder tree for a show date and writes the resulting links into the fields on the Asana editing tasks. Michelle triggers it and QCs the result. Never creates or edits a Zoho record. | Drive read and write inside the show trees, Asana read and write on the show project | Fired by Michelle at project creation |
| Skill | `captions` | inherits | The ChatGPT migration for client assets: LIL property captions, MM reel and post captions, List Kit captions (property description in two-line sections, three copy variations, just-sold version), FSE closing captions, podcast highlight captions, and titles (segment, reel thumbnail, episode) as three options for a person to pick. The review checklist is built in, and it includes the fact check against the caption sheet row and the source record. Emojis follow the brand line rule in voice-principles.md. | none (a skill, not an agent) | Called by name, by Alyza, Michelle, Cassie, or the copywriter |
| Skill | `rtm-social` | inherits | Real Talk Media's own social captions, Realtor-facing: three modes from the three ChatGPT projects (podcast promotion, products and services, agent influencer sandwich format), three variations each with a mentions block and five episode titles, tone rule value-adding not salesy. Shares the checklist and the voice file with `captions`. | none (a skill, not an agent) | Called by name, by Alyza or the copywriter |

**Deferred until the first build earns its keep** (the usage log decides at 90 days): a standalone reel fact checker, a link hygiene sidekick, a pre-show brief researcher, a monthly content mapper, a review packager that assembles the weekly Social Content Review task, and Brett's two custom GPTs (Brand Driver: agent online-footprint research, copywriting, and content strategy, likely several skills; Page Conversion: in-house copywriting and content) once each is reviewed for what to keep and what to drop. Next month's Drive folders and booking sheet tabs for the studio shows stay an Apps Script job, not an agent, and the Zoho record half of that task is now in scope for an agent under gate 5 (pasting links and files, no workflow calls).

## Sidekicks that are deliberately specific

Generic sidekicks get overridden by direct prompting and never earn their keep. Each of these owns one question:

- copywriter: "What does this say in Brett's voice, on this platform, from this source?"
- editor: "Is this relevant to the audience, does it repeat the asset, and does every fact match the source?"
- calendar-coordinator: "What is late, missing, unowned, or stuck in review across the calendars this morning?"
- podcast-prep: "Does this show date have its folder tree, and is every link in the right Asana field?"

## The acceptance test the captions skill has to pass

Elizabeth said three things would make the team stop using a replacement: it is slower, it adds steps, or the output needs more editing. Alyza edits nothing today. So the skill ships only when it clears all three against the current ChatGPT project on the same inputs:

1. Same or fewer steps from source to caption sheet.
2. No editing pass required on the output Alyza uses.
3. Every caption passes the bad-caption test: relevant to the audience, and not a restatement of the asset it sits on.

If it fails any of the three, it does not replace the ChatGPT project. It sits beside it until it passes.

## Lane discipline

The director may call only the four sidekicks above. Business Development sidekicks (none yet) are off limits; when REACH promotion or the FSE Partner Campaign crosses into BD, the handoff is logged in the AI Workforce folder and routed to Brett until a BD director exists. Sidekicks answer only to the director, except `podcast-prep`, which Michelle fires directly. No sidekick spawns another agent.

## Where things live

```
Cowork OS/
├── .claude/
│   ├── agents/
│   │   ├── content-ops-director.md
│   │   ├── copywriter.md
│   │   ├── editor.md
│   │   ├── calendar-coordinator.md
│   │   └── podcast-prep.md
│   ├── skills/
│   │   └── captions/SKILL.md
│   └── autonomy-boundaries.md
└── Operations/AI Workforce/
    ├── evals/                 (one eval per agent, same name)
    ├── logs/usage-log.md      (one line per run, every agent)
    └── logs/<agent>-log.md    (work logs)
```

Shared Core: everything under `.claude/` and the evals. Personal: nothing in this lane, by design.

## Approval gates inside the lane

1. Every draft passes the editor before a person sees it.
2. RTM pieces still go through the weekly RTM Social Content Review task. Brett remains the last approver there.
3. FSE content does not reach Brett. Cassie or Jen is the last check, except for the AI-built design prompt and caption docs, which Brett reviews. No agent changes that.
4. No agent posts, sends, or changes a Zoho status field. Those stay with Cassie, Michelle, and Alyza.
5. Zoho writes are allowed for prep work, not for workflows. Brett's clarification (2026-09-21 evening): an agent may paste files and links into Zoho fields for Michelle's prep tasks, and it is fine if a field change fires a built-in workflow. No agent invokes a workflow directly. Status fields stay with people until the Zoho workflow audit, which now sits after the pilot alongside Elizabeth's Asana automation audit rather than blocking the build. This reopens the Zoho half of Michelle's prep for `podcast-prep` and the Apps Script folder job.
6. The calendar-coordinator creates and updates tasks; it never completes or deletes one.

## What Brett decided, 2026-09-21 (roster approved)

1. **First users:** Michelle runs `podcast-prep` and List It Live captions; Alyza runs `captions` for everything else and `rtm-social`. Editors are not touched in the pilot.
2. **Cuts approved:** the reel fact checker folds into the captions checklist, link hygiene goes to the deferred list, `podcast-prep` is added on Haiku.
3. **Editor tier:** Sonnet first, Opus on a miss, promotion logged with the eval result that forced it.
4. **Naming:** functional names as shown.
5. **Coordinator's Asana scope:** create and update tasks in the RTM Social Calendar and the FSE Social Calendar only. Never complete or delete. The studio show project and the Podcasts projects stay read-only until the pilot review.
6. **Captions scope:** the List Kit mode is in. Titles mode (segment, reel thumbnail, episode) is in.
7. **Two skills:** `captions` for client assets and `rtm-social` for RTM's own pages, sharing the checklist and voice-principles.md.
8. **Zoho** (earlier the same day): field writes for prep work are allowed, no agent invokes a workflow, status fields stay with people until the audit.

## Discovery notes

_Added 2026-09-20. What changed since the 2026-09-17 pass, read from root MEMORY.md, every workstation MEMORY.md, systems-registry.md, and Asana (Brett's World, BW AI, List It Live / Market Movers Recurring)._

**Priorities moved in Brett's World, and the roadmap's premise moved with them.** Active Projects now holds three items: Review Production Processes, BW AI, and REInvest. REACH and the FSE Partner Campaign dropped to Queue. REbuild launch sits in Hold. roadmap.md still justifies the content lane by saying it "serves the top of Brett's World (REInvest, REACH as the lead magnet, REbuild launch, the FSE Partner Campaign)." Two of those four are no longer at the top. The lane choice still holds, and for a better reason than the one written down: Review Production Processes is now the highest item in Active Projects, and that is Elizabeth's redo, which is the same work this roster serves. roadmap.md should be corrected to say so.

**Nothing new in BW AI.** No task has been touched since 2026-09-17. Still open: Create master/context prompt (the Martell master prompt), Create Brand Driver in Claude, ScoreApp onboarding, and the five education tasks. No new content work appeared anywhere in Asana over the weekend.

**The LIL/MM project confirms the flow map and surfaces two rows we have not accounted for.** "Update MM Doc with Current Examples" is a recurring Cassie task that keeps the Market Movers reference doc fresh, and it is the kind of source-of-truth maintenance an agent could draft. "Review and Engage: Show Guest Socials" is recurring engagement work that is deliberately human. Neither changes the roster; both belong in the 90-day review. A third, "Review WeRevive and Hawthorn and Albatross Listing Sheets for LIL Invites," sits in a section called On Hold for New Roles, which is worth knowing before anyone builds against the booking step.

**Two workstation memories are stale enough to mislead an agent that reads them.** Operations/MEMORY.md was last updated 2026-08-19. It still lists the IRS FIRPTA appeal with its 2026-08-14 deadline as a current priority, and it does not mention the AI Workforce project at all. Content & Authority/MEMORY.md was last updated 2026-08-21 and has one-line placeholder entries for List It Live and SDMM, with no mention of Market Movers or either social calendar. The content lane's agents will read that workstation as their context. Both files need a pass before any agent ships.

**A naming question worth settling.** Root CLAUDE.md and Content & Authority both call the show SDMM (San Diego Market Makers). Asana and the flow map call it Market Movers. If they are the same show under two names, the OS should pick one; if they are two shows, Content & Authority is missing one.

**Duda is an unregistered tool.** Elizabeth lists it sixth in the tools she lives in, ahead of Zoho. It appears nowhere in the flow map, the systems registry, or the connectors table. Someone should find out what runs on it before the registry claims to be complete.

**Nothing argues for a new roster row beyond `podcast-prep`.** The podcast lane is the underserved one: Elizabeth named podcast asset delivery as pure tool-to-tool work, her only volunteered addition was the podcast folder job, and the roster in version 1 was built almost entirely around the studio shows. `podcast-prep` is the correction.

## What changed from version 1

| Change | Reason |
|---|---|
| Cut `reel-qc-checker` as a standalone sidekick; folded the fact check into the captions skill's checklist | Elizabeth sorted it A but wrote "not really saving too much time, but slightly one less thing." An agent nobody is excited about does not earn a file and a model line. The check itself is cheap inside a skill that is already reading the caption sheet. |
| Cut `link-hygiene` to the deferred list | Her sort was A/B with the reason that "links are usually done right after posting, so human would be sitting right there as it's happening." A background agent inserts a handoff into a step that has none. It comes back if she answers what input a person would have to give it. |
| Added `podcast-prep` (haiku) | Her only volunteered addition, sorted A: "Easy something Michelle can trigger and QC after." It is also the answer to her question-2 response, which named podcast asset delivery as pure tool-to-tool work. Her pick for first agent user is Michelle, and this is Michelle's job. |
| Segment titles stay inside the captions skill and produce three options rather than a title | She sorted them B, not A, "due to the format of how the titles are used." B means a person finishes. |
| Editor's definition of good rewritten around audience relevancy and non-repetition | Version 1 graded against voice, frameworks, facts, and a stakeholder persona check. Elizabeth gave a sharper and narrower bar in one sentence, and she is the one whose team lives with the output. The stakeholder check stays; it is no longer the headline. |
| Editor's scope explicitly narrowed, with a note that it cannot see most of what Brett rejects | She said Brett's rejections are usually flow of information on the reel, thumbnail titles, and occasionally the caption. Two of three are visual. Claiming the editor prevents Brett's rework would be overselling it. |
| Added the three-part acceptance test for the captions skill | She said speed, extra steps, and more editing would all make the team drop a replacement, and Alyza edits nothing today. Without a written bar, we would ship something that is better on paper and worse at the desk. |
| Approval gates now separate RTM from FSE, and name Jen | Version 1 said every piece goes through the weekly Social Content Review with Brett as last approver. Her edits say that task is RTM only, and that FSE content posts without Brett, with Cassie or Jen as the last check. |
| Added a hard gate: no Zoho write access until question 19 is answered (relaxed 2026-09-21 evening, see gate 5) | She left blank the question about which Zoho workflow rules fire on status changes. Those rules email clients. Writing to Zoho without that answer risks firing a client-facing email by accident. |
| Copywriter now delivers social work as post copy, post type, and approved caption in one document | That is the format she said the team needs from Brett on front-end work. The agent should produce what the team already knows how to consume. |
| Calendar-coordinator now watches the three-layer RTM Social Review specifically | It is the only stall she named. |
| Owners corrected throughout: Alyza owns captions for everything but List It Live; Jen added; premiere weeks split by show | Her flow map edits and interview answer 10. |
| Added the Discovery notes section | Step 3 of the 2026-09-20 run. |

## Two wins outside the roster, from the 2026-09-21 session

- **The Factory reels cut sheet.** Elizabeth named it the second stall: it waits on Brett to run the cut sheet skill and hand it to a VA. The skill already exists (Content & Authority/Reel Cut Sheet System, deployed to the claude.ai show projects, validated on Episode 3). The fix is not a new agent. It is moving the run from Brett to a VA under the existing SOP, and putting the engine backlog item (tab-separated transcript parsing) through. Brett's decision 2026-09-21: Alyza takes over the cut sheet run as soon as the skill produces consistent results, and once Team Edition is set up Brett removes himself from the front end of the process entirely. This is a Content & Authority item and belongs in that workstation's memory, not this roster.
- **Shared staff credentials.** Resolved by Brett and Elizabeth outside this roster (2026-09-21). The logins come out of the Asana task descriptions.

## What still waits

Nothing from the interview. Question 12 closed 2026-09-21: Claude read all seventeen projects on the shared login. The LIL and MM project has no instructions; five other projects do, and they are exported to assets/chatgpt/ as the migration source. Two things the sweep adds to this roster for Brett's approval: the `captions` skill gains a List Kit mode (twenty agent-by-agent chats, a product line the flow map missed), and RTM's three promotional projects become one `rtm-social` skill with three modes rather than a second copy of `captions`. Details in 2026-09-21-chatgpt-workspace-inventory.md.
