# Branding Blueprint skills: scope

_CMO run, 2026-10-14. Asana: "1 of 6: Scope the Branding Blueprint skills" (master "Build the Branding Blueprint skills", AI Workforce, CMO section). Initiative 9. Personal Layer while Brett runs it; method is a Shared Core candidate. Approved by Brett 2026-10-14 with the social audit and the rename; nothing built yet._

## Goal

Replace the Brand Driver GPT, which did everything in one place, with a set of Claude skills organized around the product they make: the Real Estate Branding Blueprint for signed $50M+ clients (growth-strategy.md: delivered strategy, not a closer). Ready before the REACH funnel opens. Less copy-dense than the GPT version.

## Naming (Brett, 2026-10-14)

The system is named after the product, not the old tool: **Branding Blueprint**. "Brand Driver" survives only as the name of the retired GPT (assets/gpts/brand-driver-instructions.md). Every skill carries the `blueprint` prefix, which groups them and avoids collisions (the small-business plugin already has a `content-strategy` skill). At Team Edition the whole set is packaged as one plugin so the team installs the product in one step; until then it lives in `.claude/`. Whether the desktop app loads a local project plugin is not yet verified.

## Sources read

_Archive/branding-blueprint-system.md (spec); assets/gpts/brand-driver-instructions.md (GPT export); the four Drive playbooks (Real Estate Branding Blueprint, Portal Optimization, Website StoryBrand, Content Authority & Social Media); initiatives.md 9; growth-strategy.md; content-frameworks.md section 12; model-selection.md; drafts/2026-10-12-brand-driver-replan.md; Asana master and subtasks; research-sidekick-eval.md; copywriter-log.md; Apify Store listings (2026-10-14).

## The skills

| Build order | Skill | Runs on | Mode(s) | Produces | Reads from the client folder |
|---|---|---|---|---|---|
| 1 | blueprint-audit | research-sidekick (gathers and cites, runs the Apify social pull), CMO assembles | Audit | Internal Brand Audit (internal), including the mandatory social content audit; RTM Digital Brand Analysis; Discovery Meeting Agenda; Cover Email | intake.md |
| 2 | blueprint-portal-bio | CMO writes in one pass, editor checks hard rules, fact-checker (changed from copywriter drafts, Brett, 2026-10-30) | Audit, rewrite | Zillow, Realtor.com, Homes.com, brokerage bios (175 to 200 words, first person, same facts, varied phrasing) | intake.md, audit, Blueprint if it exists |
| 3 | blueprint-website-copy | CMO writes in one pass, editor checks hard rules, fact-checker (changed from copywriter drafts, Brett, 2026-11-02) | Audit, rewrite, create | Homepage and service page copy (StoryBrand: client as hero, agent as guide, three-step process from the agent's real workflow) | intake.md, audit, Blueprint if it exists |
| 4 | blueprint-strategy | CMO | Strategy, QA | Real Estate Branding Blueprint plus Cover Email, then the QA pass | everything above plus Brett's discovery summary |
| 5 | blueprint (entry skill) | CMO | Engagement | Runs an engagement end to end and tracks where each client stands | the whole client folder |

The entry skill is the front door: "CMO, start a Branding Blueprint for <agent>" opens the intake, runs blueprint-audit, stops for Brett's discovery meeting, runs blueprint-strategy, then blueprint-portal-bio and blueprint-website-copy as Phase 1 execution. It keeps a status line per client (stage, next step, what is waiting on Brett). It is built last because it calls the other four. Each component skill also runs alone once its intake is complete (a portal bio for an existing client without a full Blueprint).

## Social content audit (mandatory, Brett 2026-10-14)

Social is the content Real Talk produces for agents, so every blueprint-audit runs a post-level audit, not just the profile check. This replaces the Blueprint Playbook's "Social Review Boundary", which limited the first pass to bios and high-level themes.

**Pull (research-sidekick, Apify).** Checked 2026-10-14 against the Apify Store; Apify is the right tool because it returns each post's text, format, date, and engagement without a login, which the web fetch and the built-in browser cannot do at this volume.

| Platform | Actor | Listed price, free tier |
|---|---|---|
| Instagram profile | apify/instagram-profile-scraper (official) | $0.0026 per profile |
| Instagram posts and reels | apify/instagram-post-scraper, apify/instagram-reel-scraper (official) | $0.0017 per post; $0.0026 per reel |
| Facebook page | apify/facebook-posts-scraper (official) | $0.005 per post |
| YouTube channel | streamers/youtube-scraper | $0.004 per video |
| LinkedIn profile posts | harvestapi/linkedin-profile-posts (no cookies) | $0.002 per post |

Proposed window (CMO, to confirm on the Jim McInerney test): each active platform, the last 90 days or 50 posts, whichever is larger. Calculation from the listed prices: 4 platforms at 50 posts is under $1 per audit (Instagram reels 50 x $0.0026 = $0.13, Facebook 50 x $0.005 = $0.25, YouTube 50 x $0.004 = $0.20, LinkedIn 50 x $0.002 = $0.10; $0.68 plus profile pulls); transcripts are an add-on ($0.048 per minute) used only on top-performing videos. The sidekick logs the actual cost per run. Spend authority (Brett, 2026-10-14): the pull runs without staging up to $5 per audit; anything over stages and waits (recorded in research-sidekick.md).

**Structure and AI check (Brett, 2026-10-14, at the build).** One social audit inside blueprint-audit with one reference file per platform (`social/instagram.md`, `linkedin.md`, `facebook.md`, `youtube.md`) over a shared core; TikTok out of scope for now. The AI search check runs the five prompts on claude.ai, Gemini, and ChatGPT in clean private chats, answers saved verbatim, run by the CMO in the browser. Superseded 2026-10-15 (Brett): the research-sidekick runs the five prompts on ChatGPT and Gemini through Apify's official actors inside the gather; personal accounts and third-party actors are not used.

**Analysis (CMO, from the pull).** Cadence and consistency; format mix (reels, long-form, static, text); engagement per post with the top and bottom five; the 75/25 audience-to-real-estate balance; Three Spheres coverage; authority anchor; hooks scored against content-frameworks.md section 4; video quality and on-camera presence; referral and retention content; consistency with the website, portals, and Google. Every finding cites the post. Engagement is reported as observed, never as reach or ranking.

**Where it lands.** Internal Brand Audit section 5 carries the full audit; the RTM Digital Brand Analysis gets the client-facing diagnosis; the Blueprint's Channel Strategy and Phased Action Plan build on it, including where Real Talk's video work fits.

## Shared reference folder

Location: `.claude/blueprint/reference/` (runs from the Code tab; not a skill, so it never loads on its own). Every skill names the files it reads.

| File | Holds | From |
|---|---|---|
| process.md | The three-phase spine, what each step may and may not contain (diagnosis never drifts into strategy), deliverable names | Blueprint Playbook 2, 4, 5; spec |
| blueprint-structure.md | The eight required sections, structured assets (Executive Snapshot, Positioning table, Brand Platform, Channel Role Matrix, Visibility Flywheel, Phased Roadmap), redesign notes from each test run, QA checklist | Blueprint Playbook 5, 6, 13; SOP prompt 5 |
| search-visibility.md | Google and AI visibility protocol: queries, AI prompts, evaluation criteria, no ranking claims, limits stated | Blueprint Playbook 7 |
| portal-standard.md | Required inputs, audit framework, opening paragraph model, proof hierarchy, risk reducers, variance rules, checklist | Portal Optimization Playbook |
| website-standard.md | Required inputs, audit framework, homepage and service page structure, checklist | Website StoryBrand Playbook |
| content-standard.md | Content roadmap model, channel roles, referral and retention engine, checklist | Content Authority & Social Media Playbook |
| social-audit.md | The mandatory social content audit: Apify actors and inputs per platform, window, analysis checklist, output table | Content Authority & Social Media Playbook 8 and 18A; this scope |
| integrity.md | Never fabricate (metrics, proof, rankings, testimonials, differentiators, outcomes); compliance: name the body, no legal reading, broker review; out of scope list | All four playbooks, GPT guardrails |
| intake-template.md | One client fact block: markets, transaction focus, business model, audience, differentiators, proof, risk reducer, CTA, voice reference, asset URLs | Union of the playbooks' required inputs |
| brand-kit.md | Real Talk report styling as text (colors, fonts, logo use) for the Blueprint file | RTM Brand Kit PDF (text extract) |

Frameworks do not live here. StoryBrand SB7, Three Spheres, the 75/25 ratio, and REACH principles are cited from content-frameworks.md (one rulebook rule); the COO adds any missing ones to section 12 and renames its "Brand Driver" lane. REACH source stays the R.E.A.C.H. Draft Google Doc. Reel Cut Sheet Playbook is out (COO system). Full books are out (decided 2026-09-21).

Engagement files: `Business Development/Branding Blueprint/<client>/` (intake, audit, discovery summary, Blueprint, bios, site copy, status). Created with the first real engagement; that session updates MEMORY.md and the OS guide File Map.

## What changes in existing files (staged with each skill build)

1. copywriter.md and editor.md: a "client voice" mode used only when a Branding Blueprint skill calls them. Voice comes from the client's intake, not voice-principles.md; the no em dash, no fabrication, and no generic realtor language rules still bind. Today both agents exclude client content, so blueprint-portal-bio and blueprint-website-copy cannot run without this.
2. research-sidekick.md: the audit's gather step (read every URL, run the search and AI queries, run the Apify social pull on every active platform, cite each finding, log Apify cost). Apify also for portals that block a plain fetch. research-sidekick-eval.md gains a criterion: every active platform pulled, or the gap named.
3. model-selection.md row: skills inherit the calling agent's model (renamed to Branding Blueprint 2026-10-14).
4. systems-registry.md and the registry page: one row per skill as each is built.

## Evals (one per skill, graded against objectives, never past output)

Each skill gets `evals/<skill>-eval.md` built from its playbook checklist, plus three auto-fails: any fabricated fact, a blueprint-audit with no post-level social audit (or no stated reason a platform could not be pulled), and diagnosis drifting into strategy (audit) or strategy re-argued in every section (Blueprint). The entry skill's eval runs one full engagement on the test agent (changed at the build to an orchestration test that feeds in the passed component outputs, Brett 2026-11-03). First test: Jim McInerney's live public footprint, run blind. Passing the eval completes that skill's subtask.

## Who does what

| Brett | Workers | Team (later) |
|---|---|---|
| Approves this scope; runs the discovery meeting; sends every client deliverable | sidekick gathers; CMO writes bios and site copy (copywriter until 2026-10-30 and 2026-11-02); editor checks hard rules; fact-checker checks facts; CMO assembles audit and Blueprint, runs QA, and runs the entry skill | Executes Phase 1 actions for signed clients after Team Edition |

## Subtasks and prerequisites

| Subtask | Due | Prerequisite | Status |
|---|---|---|---|
| 1 of 6 Scope the Branding Blueprint skills | 10/14 | none | Complete 2026-10-14 |
| 2 of 6 blueprint-audit skill | 10/14 | Sidekick brief 1 rated useful | Met 10/13 (Dean Aguilar brief) |
| 3 of 6 blueprint-portal-bio skill | 10/19 | none | Complete 2026-10-30 (eval 4.0, Useful) |
| 4 of 6 blueprint-website-copy skill | 10/20 | 3 of 6 complete | Complete 2026-11-02 (eval 4.0, Useful) |
| 5 of 6 blueprint-strategy skill | 10/21 | 2 of 6 complete | Complete 2026-11-03 (eval 4.07, Useful) |
| 6 of 6 blueprint entry skill | 10/22 (calculation: the day after 5 of 6, inside the master's 10/23 due date) | 2 to 5 complete | Complete 2026-11-03 (orchestration test, eval 4.54, Useful) |

## Decisions (Brett, 2026-10-14)

1. Client-facing diagnostic keeps "RTM Digital Brand Analysis" (clients received it). The internal pass is "Internal Brand Audit".
2. Blueprint density: no fixed limit. Tables and callouts lead, and the right amount of narrative is found by trial on the test runs. blueprint-structure.md records what each run teaches; the playbook's anti-compression rule is not carried over as a rule.
3. Test agent for every eval: Jim McInerney, run blind on his live public footprint (changed from Gregg Whitney at the blueprint-audit build: Jim is a longtime client and friend who will give feedback and has a large social presence; Gregg is a prospect and a candidate for the first real Blueprint once the skills work).
4. portal-bio prerequisite dropped: a third-party bio uses the client's intake for voice, not Brett's, so copywriter piece 1 does not prove or disprove the skill. The gate is the client-voice mode working and blueprint-portal-bio passing its own eval.
5. Post-level social audit is mandatory in every audit, pulled with Apify.
6. Renamed from Brand Driver to Branding Blueprint, with an entry skill over four `blueprint-` component skills.
7. Apify social pull: up to $5 per audit without staging.
