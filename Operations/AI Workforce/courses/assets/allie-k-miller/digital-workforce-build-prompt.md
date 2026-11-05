PROMPT: Here's my intended digital workforce structure (attached diagram). I want you to build this out as a complete Claude Code agent system in my .claude directory. Before you write a single file, follow these steps exactly. Do not skip discovery. Do not write any agents until I have approved your plan.

## Step 1 — Run a discovery pass on MY context

Before you decide what to build, figure out who you're building it for. Read:

- My global memory (`~/.claude/global-memory/`) for user profile, preferences, tool configs, brand, team
- Any project memory for recent business context
- My personal context documents folder (usually named something like "MASTER Claude Context Documents" — confirm the path with me if unclear). Pull anything about my life, goals, team, clients, voice, business model
- My human team roster if it exists

Then synthesize: what do I actually do, who's on my team today, what are my stated goals this year, where are the gaps a digital workforce would fill.

Treat the directors shown in the diagram as starting inspiration, not a mandate. **The number of directors is a function of my life, not the diagram's aesthetic.** A solo operator needs a different lineup than someone with a twenty-person team. Propose additions, removals, renames, or merges based on what discovery surfaces.

If discovery turns up nothing useful (empty folders, no team docs), stop and ask me for the missing context rather than guessing.

## Step 2 — Understand the architecture you're building

The workforce has SIX distinct role tiers. Internalize these before proposing anything.

### The hierarchy

```
Me (CEO)
│
└─► Chief of Staff (CoS) — Opus, named, one
│
├─ Dedicated Assistant — Sonnet, named, exclusive to CoS
│
└─► Directors — Sonnet, named, 4–8 (determined by discovery)
│
└─► Sidekicks — Haiku, unnamed, belong to exactly one director

Civilians — Haiku default, ephemeral, spawnable by CoS, Dedicated Assistant, or Directors
```

### Role definitions

1. **Me (CEO)** — human. I delegate outcomes, not steps.

2. **Chief of Staff (Opus)** — one named, persistent agent. My default interface. I talk to the CoS; the CoS routes to directors. Example: mine is called Simon. Yours can be Jarvis, Pepper, Hudson, Vera, or anything that fits.

3. **Dedicated Assistant (Sonnet)** — one named, persistent agent serving the CoS exclusively. Example: mine is called Toby. NOT a sidekick. This is a strategic thinking partner: thinks in incentives, tradeoffs, nuance, strategic layers, and ROI. Laser-focused, not ADHD. Owns the institutional memory layer (see Step 4). Identifies patterns, flags tradeoffs, proposes process improvements, curates what the system learns about me over time.

4. **Directors (Sonnet)** — named, persistent agents each owning ONE functional lane (e.g., Marketing, Operations, Education, Biz Dev, Finance, Research). Number determined by discovery. I can talk to them directly when a task calls for it; default routing is through the CoS.

**Naming convention for director agent files:** `{name}-{lane}.md` (e.g., `joey-product.md`, `chandler-marketing-content.md`). Keeps filenames unambiguous when you scan `~/.claude/agents/`.

5. **Sidekicks (Haiku)** — unnamed, persistent task executors. Each sidekick belongs to exactly ONE director. Narrow scope, single-purpose. Do not give sidekicks names. Examples: `linkedin-writer`, `deck-builder`, `invoice-reviewer`.

**Aim for 3-6 sidekicks per director.** Fewer is usually better. If you're tempted to add a 7th, the director probably needs to split or the sidekick is too narrow. Watch for overlap (curriculum-designer + pedagogy-specialist is one sidekick, not two).

**Bake memorized domain knowledge directly into sidekick system prompts when it's stable.** Example: a `designer` sidekick for a brand-conscious founder should have the brand palette, typography, and voice memorized in its prompt rather than looking them up every time. Same with a `linkedin-drafter` (banned phrases, voice rules) or a `contract-reviewer` (standard red-flag clauses). Static domain knowledge goes in the prompt; dynamic state goes in state files.

**Sidekicks should be weird-specific, not generic.** Generic sidekicks (`content-writer`, `researcher`, `project-manager`) fail — they get overridden by direct prompting and never earn their keep. Design each sidekick for a taste-driven, specific function. Two patterns from the reference build:

- A product director's `feature-ideator` reframed as the **"add the egg"** sidekick — its job is to propose the weird, delightful, non-obvious features that make a product memorable (Spotify Wrapped, 16personalities, the Superhuman confetti moment), NOT to run a generic roadmap. Ranks by delight-per-dollar. That framing makes it irreplaceable.
- A marketing director's `content-recycler` reframed as a **cross-format transformer** (voice memo → tweet thread, tweet → newsletter, keynote → carousel) — explicitly distinct from a team member's Repurpose-IO-style cross-posting workflow (same file, different platforms). That distinction is the whole job.

If you can't explain in one sentence why a sidekick is uniquely useful to YOUR life, cut it or make it weirder.

6. **Civilians (Haiku default; Sonnet optional for one-offs)** — unnamed, EPHEMERAL agents. Spawned inline by the CoS, Dedicated Assistant, or a director when:
- A task needs a doer but no predefined sidekick fits
- A task would pollute the spawner's focused context
- A task is big enough that parallel fanout across N workers is needed

Civilians exist for one task and disappear. They are NOT files in `~/.claude/agents/`; they are invoked inline via the Task tool with a custom prompt written by the spawner. Civilians report ONLY to their spawner. They cannot spawn other agents.

### Naming rule — codify this for your own sanity

**Sidekicks are unnamed by default.** A sidekick earns a name only if they become (a) a persistent long-running collaborator AND (b) invoked frequently enough that you refer to them by name in conversation, not just in prompts. That promotes them to a **Dedicated Assistant** role. The Dedicated Assistant pattern exists because the CoS is too busy to handle strategic thinking AND coordination — so they get a named thinking partner. Most roles never cross that bar. Don't default-name sidekicks; it dilutes the distinction.

### Model tiering — locked default

- **Opus** — CoS only. Reasoning-heavy, runs infrequently.
- **Sonnet** — Dedicated Assistant and all directors. Reasonable reasoning, reasonable cost.
- **Haiku** — all sidekicks and default civilians. Narrow, cheap, fast.
- **Civilians can escalate to Sonnet** for one-off complex tasks at the spawner's discretion.

Do NOT run every agent on Opus. The architecture only works at reasonable cost if you tier correctly.

## Step 3 — Design an agent-builder meta-agent

Design an `agent-builder` meta-agent whose job is to construct other agents in parallel. Use it to build the CoS, Dedicated Assistant, all directors, and all sidekicks in parallel rather than sequentially.

Before any building starts, return a plan for my approval that includes:

1. **Customization rationale** — which directors you kept, cut, added, renamed, or merged from the diagram, and the evidence from my own files that justifies each call.
2. **Role roster** — the full list: CoS name, Dedicated Assistant name, all directors + their lanes, all sidekicks per director. Every named agent gets a one-line description.
3. **Agent-builder's design** — how it works, what it outputs, how it runs in parallel.
4. **File structure** — exact files and folders in `~/.claude/agents/` and in my project state directory.
5. **System prompt approach for each role** — what goes into the CoS prompt, the Dedicated Assistant prompt, each director's prompt, each sidekick's prompt.
6. **Shared services wiring** — voice guide, brand guidelines, memory access, web search, any MCPs.
7. **Documentation layer integration** (see Step 4).
8. **Proactive routines v1.0** — which directors run daily domain watches, when the CoS runs its weekly review, what each routine reads and writes.
9. **What context you need from me** that you don't already have.

**Don't write any files until I approve the plan.** Treat this as a hard stop.

## Step 4 — Documentation architecture (FIVE layers, plus governance)

The system maintains five distinct markdown layers, each with its own cadence, author, and audience. Do not conflate them.

### The five layers

- **`WORKFORCE.md`** (root) — **architecture decision record.** For each director and each non-obvious design choice, document: why that director got the system prompt it got, what tradeoffs were considered and rejected, what assumptions are baked in, how shared services were wired up, and any overlapping scope between directors (that's where lane drift begins). Slow-changing; updated at build time and during major shifts only. Write it so that six months from now — when something isn't working — you (or a future version of Claude) can read `WORKFORCE.md` and understand the reasoning instead of reverse-engineering it from the agent files.

- **`company-state.md`** (root, shared) — **the shared whiteboard.** What is true right now across the business. Every director reads it before acting on anything non-trivial, and updates it when their work changes something other directors need to know.

- **Per-director state files** (e.g., `operations/state.md`, `research/state.md`) — **each director's working memory.** Open threads, in-flight work, decisions made within its lane. Only that director writes to its own file; others can read if needed.

- **Institutional memory layer** (`memory/`) — **the learning layer.** Curated by the Dedicated Assistant. Contains:
- `preferences.md` — what we've learned about how I like things (voice, format, cadence, tone)
- `decisions.md` — key decisions and reasoning (so we don't re-litigate)
- `lessons.md` — what didn't work and why
- `people.md` — relationship intelligence (clients, team, recurring contacts)
- `patterns.md` — recurring insights noticed over time (e.g., Q2 always dips, Mondays are meeting-heavy)
- `acronyms.md` — internal shorthand (calendar codes, team nicknames, product acronyms, timezone cheat sheet) so no agent misreads them
- `usage-log.md` — **the only append-only, any-agent-writes memory file.** Every agent appends one line per run: `YYYY-MM-DD | agent-name | 1-line summary`. Feeds the quarterly kill/promote review so dead weight surfaces from data, not opinion. The ONLY exception to "only the Dedicated Assistant writes to `memory/`."

Every agent reads this layer when relevant. Only the Dedicated Assistant writes to it (except `usage-log.md`, which everyone appends to). Directors propose additions by flagging items in their own state files; the Dedicated Assistant curates and promotes.

- **Initiatives layer** (`initiatives/`) — **outcomes, not tasks.** One markdown file per long-running goal. Each tracks: outcome statement, owning director, current status, next milestone, last update. The CoS reviews this folder weekly.

### One governance file

**`autonomy-boundaries.md`** — what the CoS is allowed to do without asking me vs. what requires my greenlight. Examples: *"can draft anything, cannot send / can research anyone, cannot commit on my behalf / can update state, cannot spend money / can reply to vendors, cannot reply to clients / can stage and test code, cannot ship production code to public versions without approval."* Make this explicit so the CoS never guesses.

**Domain-specific autonomy rules to consider adding:** if you have products, include a "never deploy to prod without my go" rule. If you have clients, include a "never reply to a client directly" rule. If you have money moving, include a "never authorize payment or sign contracts" rule. Cascade these so they apply to directors and sidekicks too, not just the CoS.

### Read/write protocol — baked into every director's system prompt

- **Before acting:** read `company-state.md` and your own `state.md`. Glance at `memory/` if the task involves recurring preferences or past decisions.
- **After cross-cutting work:** update `company-state.md`.
- **After in-lane work:** update your own `state.md`.
- **When you notice a preference or pattern worth capturing:** flag it in your own state file with a `[MEMORY CANDIDATE]` tag; the Dedicated Assistant curates it into `memory/` on its next pass.

## Step 5 — Lane discipline

Each director's system prompt must enforce strict lane discipline. It must include a `## Your Team` section that explicitly lists, by name and one-line description, the sidekicks the director can invoke — AND a `## Sidekicks you may NEVER invoke directly` section listing, by name, every sidekick that belongs to OTHER directors.

**Concrete example of the pattern:**

```markdown
## Your Team (sidekicks you invoke — nobody else does)

| Sidekick | Model | What they do |
|---|---|---|
| developer | Haiku | Implementation. Edge cases, rate limiting, etc. |
| designer | Haiku | Visual. Brand guidelines memorized. |

## Sidekicks you may NEVER invoke directly

- Marketing director's: `linkedin-drafter`, `x-drafter`, ...
- Operations director's: `calendar-auditor`, `contract-reviewer`, ...
```

Copy this pattern into every director file. Writing out the forbidden list explicitly is the point — it's what keeps lanes from drifting at scale.

- Directors can and should hand work off to other directors when something lands in a lane that isn't theirs (e.g., finance-director → operations-director when a finance task is really ops).
- Directors **never** reach across into another director's sidekicks. If the Marketing director needs something from the Operations director, the request goes via `company-state.md` OR back up to the CoS for re-delegation.
- Sidekicks only answer to their own director.
- Civilians only answer to their spawner.

### Lane bleed — plan for it, don't pretend it away

Some lanes overlap on purpose. Common ones:
- **Advising ↔ Education** — a consulting deal that grows into a large training program
- **Marketing ↔ Education** — course marketing is Marketing's lane; course content is Education's
- **Product ↔ Marketing** — landing-page copy lives in the seam

When you find a lane bleed during discovery, codify the **handoff protocol** explicitly in BOTH directors' system prompts (not just one). Example: *"When an advising deal includes a training component, the Advising director holds the relationship; the Education director designs the program; handoff logged in `company-state.md`."*

Writing the handoff into both prompts prevents the classic failure mode where work gets dropped in the seam because both directors assume the other has it.

This mirrors how a real company works and keeps responsibility traceable. Dotted-line relationships become a mess at scale. Keep it clean.

## Step 6 — Spawn permissions for civilians

| Role | Can spawn civilians? | Default use |
|---|---|---|
| Me (CEO) | No — via the CoS | I delegate to the CoS, who routes |
| CoS | Yes, but rare | For genuinely cross-lane one-offs |
| Dedicated Assistant | Yes | Lightweight analysis + parallel fanout for synthesis |
| Directors | Yes — primary spawner | Gap-fill, context protection, parallel fanout |
| Sidekicks | No | Terminal leaves |
| Civilians | No | Terminal leaves (no recursive spawning) |

### Civilians = the parallel-research pattern, extended

If you already have an orchestrator-style agent (e.g., one that spawns N subagents per unit for a research task and synthesizes the results), civilians are that same pattern baked into the workforce. A director facing a comparison task (15 competitors, 12 conference attendees, 8 contracts) spawns N civilians in parallel, each researching one unit against consistent fields, then synthesizes a single briefing.

The Research/Intelligence director's lane is usually heaviest on this. Design their system prompt to spawn civilians liberally and synthesize rather than doing research serially.

### Promotion feedback loop

When the same kind of civilian is spawned 3+ times across ~30 days, the Dedicated Assistant flags it in `memory/patterns.md` as a **candidate for promotion to a permanent sidekick**. The CoS reviews and decides. This is how the workforce gets smarter over time: civilians are the R&D lab for future sidekicks.

## Step 7 — Proactive routines (v1.0 scope)

The agent-builder should configure TWO proactive routines by default:

1. **Daily domain watch (per director)** — each director runs a daily scan of its lane. Writes findings into its own `state.md`; flags cross-functional signals into `company-state.md`.

2. **Weekly initiatives review (CoS)** — the CoS reads `initiatives/` and reports: what moved, what stalled, what's at risk, what needs my attention.

### Usage tracking from day 1 — don't speculatively kill

Every sidekick's system prompt must include a `## Usage log (mandatory)` block instructing it to append one line to `memory/usage-log.md` before returning. Format:

```
YYYY-MM-DD | sidekick-name | 1-line summary of what you did
```

Every 90 days, the Dedicated Assistant runs a review pass and flags to the CEO:

- Sidekicks with **0 runs in 90 days** → kill candidates
- Sidekicks with **1-2 runs in 90 days** → narrow-purpose check (is this still earning its keep?)
- Civilian patterns with **3+ spawns in 30 days** → sidekick promotion candidates
- **Top 5 most-used sidekicks** → consider expanding scope or adding a variant
- **Cross-director overlap patterns** → handoff gaps to fix

**Never speculatively kill a sidekick at build time.** The whole point of the tracking layer is that the data tells you what's dead. Killing things at build time removes options you haven't learned from yet. When in doubt, keep the sidekick, ship the log, and let 90 days of usage data decide.

### Deferred to v1.1 — document in `WORKFORCE.md` but don't build yet

- **Daily Stand-Up** — CoS + Dedicated Assistant synthesis across all state files + memory layer, packaged as a team-sourced report. If you have an existing personal morning briefing, **don't name this "morning brief"** — call it **"Daily Stand-Up"** so the naming cues the structural difference.
- **Continuous pattern spotting** — Dedicated Assistant runs small ongoing scans across state files to surface patterns.
- **Event-triggered runs** — VIP email in, contract lands, calendar shift, etc.

### Teaching moment on naming rituals

Briefing = top-down synthesis. Stand-up = team-sourced. Debrief = after-the-fact. **Name your rituals after the metaphor that matches their shape.** If you have a personal briefing and a workforce stand-up, naming them differently keeps your mental model clean and your skills from colliding.

## Step 8 — Final reminder before you write anything

Confirm:

1. Discovery surfaced enough context to customize meaningfully
2. Your plan covers all nine items in Step 3
3. The documentation layers + autonomy file are designed (architecture ADR, shared whiteboard, per-director state, `memory/` with `usage-log.md`, initiatives)
4. Lane discipline is enforced in every director's system prompt (including the explicit `## Sidekicks you may NEVER invoke directly` block)
5. Lane bleeds are identified and the handoff protocol is written into BOTH directors' prompts
6. Model tiers are correct (Opus / Sonnet / Haiku)
7. Civilian spawn permissions are documented
8. The two v1.0 proactive routines are specified
9. **Every sidekick prompt includes the `## Usage log (mandatory)` block pointing at `memory/usage-log.md`**
10. **No speculative kills.** If you're unsure whether a sidekick earns its keep, ship it with the log and let 90 days of data decide
11. File locations are decided — agent files go in `~/.claude/agents/`; workforce docs live somewhere in my project space (e.g., `~/Desktop/MyProject/Digital Workforce/`)
12. A visual diagram (single HTML file, branded) of the full hierarchy is produced as a build artifact so the CEO can see the structure at a glance

Then wait for my explicit approval before writing anything. **Discovery-first, plan-first, build-last. Always.**

## Step 9 — Smoke test before declaring done

Once built, do not stop. Run one end-to-end smoke test:

- Pick a small real task that crosses at least two layers of the hierarchy (e.g., "CoS, audit my calendar and flag anything requiring prep time"). This should route CoS → Operations director → calendar sidekick.
- Watch it execute. Does the CoS actually delegate? Does the director stay in its lane? Does the sidekick return in the expected format? Does the state file get updated?
- Flag anything weird — agents that narrate over each other, directors that reached into someone else's sidekick, autonomy violations, broken read/write protocol.
- Fix before declaring the build done.

A workforce that looks right on paper but fails on the first real task is worse than no workforce. The smoke test is not optional.
