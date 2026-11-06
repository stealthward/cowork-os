# Roster Proposal: Content Operations Lane (draft for approval)

_Drafted 2026-09-17 from the OS files, Asana (Brett's World, BW AI, the LIL/MM recurring project, the Discover La Jolla template, both social calendars), and the AI-First Academy intake. This is the Phase 2 gate: nothing in `.claude/` gets written until Brett approves this roster. Expect the Elizabeth interview to change the sidekick list._

## What discovery found

- **The work.** Three content lines run every week: the studio shows (List It Live and Market Movers), the podcasts (six shows, one project per record date), and the social calendars for RTM and Five Star. Brett is the last approver through the weekly Social Content Review task. The team already uses AI for captions and titles through a shared ChatGPT project.
- **The people.** Elizabeth runs operations and the VAs. Cassie owns guests, QC, and delivery. Michelle owns booking, decks, captions, and Zoho records. Alyza owns thumbnails, reel QC, posting, and the monthly content map. Mark produces and uploads. Editors and designers execute.
- **The gaps agents would fill.** Copy drafted from source in one voice instead of three prompts and a shared login. Facts checked against Zoho and the caption sheets before a person opens a video. Links collected and written to Zoho without hand-shortening. Gaps and stalls on the three calendars surfaced without anyone reading every task. A written bar applied to every draft before Brett sees it.
- **What stays with people.** Filming, editing, design, guest relationships, posting to platforms that need a logged-in human, and Brett's final approval.

## The roster

One director, five sidekicks, one skill, no chief of staff yet. The chief of staff arrives in Phase 3 when a second lane exists to route between.

| Role | File name | Tier | Lane and job | Tools (least privilege) | Trigger |
|---|---|---|---|---|---|
| Director | `content-ops-director` | sonnet | Owns the content lane. Reads the three calendars and the flow map, breaks a request into sidekick tasks, passes each sidekick only what it needs, reports back. Never posts, never sends. | Asana read and write on the content projects, Drive read, file read and write inside the OS | On request from Brett or Elizabeth; weekly calendar review on a schedule |
| Sidekick | `copywriter` | sonnet | Drafts captions, carousel copy, newsletter copy, and REACH promotion copy from a transcript, cut sheet, MLS description, or topic. Reads voice-principles.md, content-frameworks.md, and the Brand Driver skill. | File read, Drive read | Called by the director |
| Sidekick | `editor` | sonnet, opus on a miss | Grades every draft against the eval: voice, frameworks, facts against source, platform rules, and a stakeholder check (the $50M+ list-side producer, the brokerage owner, Elizabeth as operator). Approves or returns with fixes. | File read | Called by the director on every draft |
| Sidekick | `calendar-coordinator` | haiku for reads, sonnet for briefs | Reads the RTM, FSE, and Podcasts calendars and the LIL/MM project. Reports gaps, stalls, and unassigned pieces. Writes VA briefs and tasks in the Asana bullet format. Never completes or deletes a task. | Asana read and write on the content projects | Weekday morning schedule |
| Sidekick | `reel-qc-checker` | haiku | Before Alyza opens a video: compares the caption sheet row, the Zoho listing or appearance record, and the transcript. Flags name, address, phone, DRE, price, and spelling mismatches with the source for each. Reports "could not verify" rather than guessing. | Zoho read, Drive read, Sheets read | When a reel folder is marked finished, or on request |
| Sidekick | `link-hygiene` | haiku | After posting: collects the published Facebook, YouTube, Instagram, and Drive links, shortens them, and writes them to the right Zoho fields on the listing or appearance record. Never changes a status field. | Zoho read and write on link fields only, web fetch for the shortener | On request after a posting run |
| Skill | `captions` | inherits | The ChatGPT migration: LIL property captions, MM reel and post captions, MM segment titles, FSE closing captions, podcast highlight captions, with the review checklist built in. Used by the copywriter and directly by the team. | none (a skill, not an agent) | Called by name |

Deferred until the first five earn their keep (usage log decides at 90 days): a pre-show brief researcher, a monthly content mapper, a review packager that assembles the weekly Social Content Review task, and the Brand Driver as a second skill once the RECE GPT is exported.

## Sidekicks that are deliberately specific

Generic sidekicks get overridden by direct prompting and never earn their keep. Each of these owns one question:

- copywriter: "What does this say in Brett's voice, on this platform, from this source?"
- editor: "Would Brett approve this as is, and if not, what exactly changes?"
- calendar-coordinator: "What is late, missing, or unowned on the three calendars this morning?"
- reel-qc-checker: "Does every fact in this caption match the record it came from?"
- link-hygiene: "Is every published link in the right Zoho field, shortened, and working?"

## Lane discipline

The director may call only the five sidekicks above. Business Development sidekicks (none yet) are off limits; when REACH promotion or the FSE Partner Campaign crosses into BD, the handoff is logged in the AI Workforce folder and routed to Brett until a BD director exists. Sidekicks answer only to the director. No sidekick spawns another agent.

## Where things live

```
Cowork OS/
├── .claude/
│   ├── agents/
│   │   ├── content-ops-director.md
│   │   ├── copywriter.md
│   │   ├── editor.md
│   │   ├── calendar-coordinator.md
│   │   ├── reel-qc-checker.md
│   │   └── link-hygiene.md
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
2. Every piece still goes through the weekly Social Content Review task. Brett remains the last approver.
3. No agent posts, sends, or changes a Zoho status field. Those stay with Cassie, Michelle, and Alyza.
4. The calendar-coordinator creates and updates tasks; it never completes or deletes one.

## What Brett decides before build

1. Approve, cut, or rename any row in the roster.
2. Naming: functional names as shown, or named directors in the course's style.
3. Editor tier: start on Sonnet with promotion on a miss (recommended), or Opus from day one.
4. Which Asana projects the coordinator may write to.
5. Whether the reel-qc-checker may read Zoho in the pilot, or starts on the caption sheets only.

## What the Elizabeth interview settles

The A/B/C sort of every recurring task, which sidekicks the VAs touch first, the loop channel design, and the corrections to production-flow-map.md.
