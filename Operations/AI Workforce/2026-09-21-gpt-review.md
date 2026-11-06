# Brand Driver and Page Conversion: keep-or-drop review

_Read 2026-09-21 from the GPT editor on Brett's account and the two Drive folders he linked. Verbatim exports in assets/gpts/. This is the pre-migration review Brett asked for: what each GPT actually holds, what is carrying weight, what is bloat, and what the Claude version should be. Brett's answers (same day, two rounds) are folded in; every question is closed. Decisions are listed near the end. Tag: Shared Core._

## What is on the account

Three custom GPTs, not two:

| GPT | What it says it is | Sharing | Last edited | Instructions | Files |
|---|---|---|---|---|---|
| Brand Driver | Real Estate Marketing Intelligence Engine | Only me | Jun 9 | 7,115 chars | 9 PDFs (44 MB) |
| Page Conversion | Copywriter for Real Talk, Five Star and Realtor Clients | Anyone at Real Stars with the link, 37 chats | Jun 23 | 6,228 chars | 7 files (about 30 MB) |
| Real Talk Agent Magnet | "High-volume, research-backed strategist applying Hormozi + Storybrand + avatar targeting to attract top-producing agents" | Only me | not opened | not read | not read |

Brett named the first two. The third was not mentioned and was not opened. A Drive doc titled "RTMagnet entire thread (error)" from August 2025 suggests it was an earlier attempt that broke.

## Brett's answers, 2026-09-21

- **Brand Driver was built for Brett**, with the option of team members owning parts of the process later. The Real Estate Branding Blueprint is the deliverable that mattered; the output was strong and is worth building on. It is high value to clients and prospects, but only top producers. The tool is meant to produce the Blueprint and ad hoc content for that kind of client.
- **Brand Driver has not been used for several months.** The process is on hold. It stays important for the future: attracting and retaining top producers.
- **Page Conversion is the in-house senior marketing copywriter who writes as Brett.** The instructions are the objective.
- **Reference example:** the Henish Pulickal Blueprint (March 2026), an example of the form rather than a gold standard (Brett, later the same day). Other client and prospect Blueprints are in Drive under "real estate branding blueprint".
- **Page Conversion's early win was building the cut sheet process.** Its chats are the record.

What those answers settle: Brand Driver is a Business Development lane asset, not Phase 2; the Blueprint is the first skill and the only one that needs an eval before it ships; Page Conversion is the copywriter agent; and "where does it run first" (question 14) is moot until the BD lane opens.

## Brand Driver

**What it is.** A four-deliverable client engagement engine (Brand Driver Analysis, RTM Digital Brand Analysis plus Discovery Meeting Agenda and Cover Email, Real Estate Branding Blueprint) with standalone modes for portal bios, website copy, content strategy, and reel cut sheets. The SOP doc runs it as a three-prompt sequence with Brett's own manual analysis pasted between steps. His "SOP-Custom GPTs" doc adds the operator loop: Step 1 digital footprint analysis from asset links, Step 2 Brett's own audit of Facebook, Instagram, and the website dictated to Plaud and uploaded, Step 3 the report emailed to the client as a PDF, Step 4 the discovery call.

**The instructions are not the bloat.** They are tight: purpose, scope, intent detection, universal standards, a playbook hierarchy, one rule per output type, data integrity, guardrails. Two small defects: the "Reel Cut Sheets" intent line is empty, and the governing Blueprint playbook is named but does not appear in the file list.

**The knowledge is the bloat.** Nine PDFs, and they sort into four kinds:

| File | Kind | Weight | Recommendation |
|---|---|---|---|
| Real Estate Branding Blueprint Playbook (the governing doc, 70 KB) | Brett's own operating rules | Carries the whole engagement. Very long: fourteen sections, four "rule" layers on tone alone, a 30-line validation checklist | Keep, and cut by half. Most of sections 6 and 13 are restatements of each other |
| Portal Optimization, Website StoryBrand, Content Authority and Social Media Playbooks | Brett's own rules, one per output | Each carries real, specific rules (175 to 200 word bios, three-step process rule, 75/25 ratio, Three Spheres). Each also repeats the same skeleton: purpose, three modes, principles, required inputs, audit framework, output standards, tone, data integrity, implementation bias, checklist | Keep the unique rules. Move the shared skeleton into one shared reference file |
| Reel Cut Sheet Playbook | Brett's own rules | Already a Claude skill in Content & Authority, validated on Episode 3 | Drop from Brand Driver. One home |
| REACH Knowledge Base Excerpts | Brett's manuscript | The philosophy source for everything above. The file is a working draft: editorial notes in parentheses, "(Pie chart here)", a "Gemini breakdown" of the client journey, and a pasted ChatGPT answer ending in "Do you want me to mock up a sample 30-day content calendar" plus two share links | Keep the manuscript, but clean it first. As uploaded it teaches Claude to write like a draft with notes in it |
| 5P Content Framework, Hook Retain Reward | Distilled third-party frameworks, one page each | Useful, cheap, and already restated inside the Content Authority playbook and the reel cut sheet playbook | Keep one copy in a shared frameworks file |
| Building a StoryBrand 2.0 (full book, 5.4 MB) | Copyrighted book | The Website StoryBrand Playbook already distills the seven parts into rules | Drop |
| Real Talk Media Brand Kit (34 MB) | Visual brand kit | A language model gets almost nothing from a 34 MB design PDF | Replace with a one-page text extract: colors, fonts, taglines, logo rules, tone words |

**The Blueprint output, read against the playbook.** The Henish Blueprint is 16 pages in narrative prose with the eight-section structure the playbook requires, no tables, no em dashes, and a Closing Direction that reads like a conclusion rather than a summary. It was produced in March 2026, before the playbook's May revision added the structured report assets (Executive Snapshot, Brand Platform table, Channel Role Matrix, Visibility Flywheel, Roadmap Overview). So the example Brett points to is the prose version, and the current playbook asks for a more tabular one. The eval has to pick one. Recommendation: the prose version with an Executive Snapshot on page one, because that is the output Brett says was strong.

**Example material in Drive** (all Google Docs): Real Estate Branding Blueprint: Henish Pulickal (2026-03-11, the reference); John Lieber (three versions, 2026-04-30 to 05-02); Sean Zanganeh (Digital Audit 2026-04-17, draft Blueprint 04-24, full Blueprint 04-24). Three clients, two stages each. Per Brett, these are examples of the form; the eval grades against objectives and desired outputs, not against any of them.

**What it becomes in Claude.** Not one skill. The intent list is the skill list:

1. `brand-audit`: the three-stage engagement (analysis, diagnosis, blueprint) with the SOP's stage gates built in and Brett's manual-analysis step as an explicit input. This is the paid deliverable and the sales tool, and the only Brand Driver skill built first.
2. `portal-bio`, `website-copy`, `content-strategy`: standalone modes, built when a client engagement needs them, not before.
3. A shared reference folder: data integrity rules, tone, the three modes (audit, blueprint, standalone), naming conventions, the frameworks page. Every skill reads it. Nothing is repeated four times.

The Google and AI search visibility protocol needs a browser or web search. In the Code tab that is WebSearch and WebFetch inside the skill; in a claude.ai Project it is web search turned on. Either way the skill has to say what it could not access, which the current instructions already require.

**Pros and cons of splitting.** Pro: one skill, one job (Ruben's rule), so "write a portal bio" never drags the full blueprint in, and each skill can be evaluated on its own outputs. Con: Brett's operator habit is one GPT that infers intent; separate skills means naming the one you want. Recommendation: split, and give each skill a description with the trigger words from the current intent detection block, so Claude picks the right one from a plain request the way the GPT did.

## Page Conversion

**What it is.** Brett's in-house copywriter: writes as Brett, Real Talk Media by default, five asset types with fixed output shapes, a framework selector, up to three clarifying questions, compliance rules.

**What it was actually used for** (28 chat titles visible, February to June 2026): FSE website home update, escrow bio rewrite, team page header and copy, Elizabeth Eidbo bio, LinkedIn bio and company description, StoryBrand LinkedIn profile, compelling homepage headlines, show page updates, guest content package, podcast tagline ideas, media credit options, email rewrites, REInvest deck and brand usage analysis, transaction volume growth, escrow rep job changes, investor networking ideas, luxury lease deal analysis, a complaint email, and the cut sheet work: Reel Cut Sheet Guide, Reel Enhancement Framework, Cutsheet SOP, May 7 cutsheet. Three Brand Driver chats also ran here (Brand Driver Analysis, Blueprint - Sean Zanganeh, John Lieber Blueprint, "Instruction, Playbook, Prompt Rewrites"), which means the Blueprint work was not confined to the Brand Driver GPT.

Two things that list says. First, the copywriter's real workload is web copy, bios, and LinkedIn for RTM and FSE, plus email. The five asset shapes in the instructions cover sales email, campaign, landing page, social post, and video script; bios and LinkedIn profiles are not among them and should be. Second, the cut sheet process was designed here and then moved to Claude, which is the migration pattern working as intended.

**The instructions are good and nearly ready.** They match voice-principles.md on every rule that overlaps (no em dashes, no filler openers, no cliches, short lines, specifics). The asset-type output specs are the most reusable thing on either GPT. Defects: twelve leftover `:contentReference[oaicite]` citation tags, which say the text was generated in ChatGPT and pasted in without a read-through; and the framework selector cites the two Hormozi books by name so the model reaches for them.

**The knowledge is three full books plus three small files.**

| File | Recommendation |
|---|---|
| $100M Offers, $100M Leads, Building a StoryBrand (full books) | Drop. The instructions already encode what the copywriter uses from each: the value equation, the core four, SB7. Copyrighted books as retrieval knowledge also invite the model to quote them |
| 5P, Hook Retain Reward | Keep in the shared frameworks file, same copy Brand Driver uses |
| Real Talk Media Tone Doc | Retire. It is word for word the same as "BW Tone Doc", and voice-principles.md in the OS is the newer version with the AI Tells section. One voice file |
| StoryBrand Website That Works Wireframe | Keep if it is the RTM wireframe; drop if it is the generic template |

**What it becomes in Claude.** This is the `copywriter` sidekick from roster v2.1, almost line for line: Brett's voice, RTM default, finished copy with no commentary, asset-type shapes. Recommendation: Page Conversion's instructions become the copywriter agent file, and the output shapes (plus bio and LinkedIn profile) become a `copy-formats` reference the agent and the captions skill both read. It does not need to be a separate skill.

**One conflict to settle.** Page Conversion bans emojis unless asked. The team's caption projects require emojis and ten hashtags on client show socials. Both are right for their audience. The rule belongs per brand line in the voice file, not in the agent.

## Brett's GPT build SOP, and whether to keep it

The "SOP-Custom GPTs" doc (2026-02 to 05) is a five-phase build loop: spec the instructions outside the project, paste them in, run a Builder Mode prompt that makes the GPT restate its purpose and list ambiguities, run a Diagnostic prompt that makes it describe what it will and will not do, then go live and return to Builder Mode when behavior drifts. Plus a thirteen-field instruction template and a pre-launch checklist ending in "you would be comfortable with its answers being forwarded verbatim."

Pros for Brett's situation: it is his own tested process, it maps almost one to one onto Ruben's "when would you use this skill" debug question and the eval template already in this project, and the pre-launch checklist is a better definition-of-done than anything in the courses. Cons: it tests instructions by asking the model about itself, which is weaker than testing on real inputs, and it was written for a single GPT rather than a roster. Recommendation: adopt the checklist and the Builder Mode question set into templates/eval-template.md as the pre-ship step for every agent and skill, and keep the real-input eval as the gate.

## Overlap between the two

Both carry 5P, Hook Retain Reward, and the StoryBrand book. Both write social content and website copy. The split that holds: Brand Driver is for a client's brand (agents), Page Conversion is for our brands (RTM, FSE). In Claude that is the difference between the client-facing skills and the in-house copywriter agent, sharing one frameworks file and one voice file.

## What this changes in the roster

- `copywriter` gets its definition from Page Conversion instead of being written fresh, with bios and LinkedIn profiles added to its output shapes.
- Brand Driver is not a Phase 2 item. It is a Business Development lane asset (top-producer engagements, REACH promotion) and lands when that lane opens, with `brand-audit` first because it is the paid deliverable. Brett confirmed it is on hold.
- The deferred list in roster v2.1 changes from "Brand Driver as a second skill" to "brand-audit plus a shared reference folder, then the standalone modes as engagements need them."
- The eval template gains Brett's pre-launch checklist and Builder Mode questions.

## Decisions, 2026-09-21 evening (answered by multiple choice)

- **Reel cut sheets:** the Claude skill in Content & Authority is current. The Brand Driver playbook copy retires.
- **REACH source:** the newer manuscript is the Google Doc "R.E.A.C.H. Draft" (id 1D--1gbrfclxfKtsVDcwxz-HfEIyzq6ti5dq2Q04Jas8, 224 KB, last edited 2026-08-20). It replaces the 2-11-26 excerpts as the reference. It is a draft, so it gets the same cleaning pass before it becomes a context file.
- **Full books:** drop all three. A shared frameworks file carries, in my own words and one page each: 5P, Hook Retain Reward, StoryBrand SB7, the value equation from $100M Offers, the core four from $100M Leads, and REACH's Three Spheres and 75/25 ratio.
- **The playbooks are ChatGPT-era context files, not gospel.** Brett's clarification: anything named Playbook was written while working with ChatGPT and is structured like a skill's context file. Assume most of it is superseded; review each for anything worth carrying into a skill rather than migrating it whole.
- **Brand Kit:** a one-page text extract (colors, fonts, taglines, logo rules) replaces the 34 MB PDF.
- **Blueprint format:** prose plus an Executive Snapshot for now, provisional. Brand Driver is on hold; when it is revisited the format is chosen by desired results, not by the old playbook.
- **Voice file:** voice-principles.md is the single voice file. BW Tone Doc and Real Talk Media Tone Doc are retired (renamed SUPERSEDED in Drive, not deleted). Other marketing voices get their own agents or skills when needed.
- **FSE defaults:** the copywriter gets a Five Star Escrow defaults block beside the RTM block.
- **Real Talk Agent Magnet:** abandoned. Out of the migration.
- **Page Conversion Drive folder:** empty. The GPT's files are the only copies; sources are located elsewhere in Drive (see the export).
- **Emojis:** RTM social and client shows yes, Brett's voice no, FSE yes. Written into voice-principles.md as a per-brand-line rule.
- **Report Formatting Playbook:** does not matter. The link drops when the SOP migrates.
- **No gold standard.** Brett does not want any past output treated as the gold standard. The eval is built from the objectives and desired outputs as guidelines, with the Henish, Lieber, and Zanganeh docs as examples of the form, not the target.

Every punch list question is closed.

## Files

- assets/gpts/brand-driver-instructions.md and assets/gpts/page-conversion-instructions.md: verbatim exports with file inventories.
- Drive sources of record: Brand Driver folder (SOP doc plus Knowledge Docs), SOP-Custom GPTs (Brett's build SOP), RTM-Documents/Real Talk Media Tone Doc, the playbook Google Docs listed in the Brand Driver export, and the client Blueprints listed under eval material.
