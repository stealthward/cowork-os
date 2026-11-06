# Course Intake: How to AI (Ruben Hassid)

_Reviewed 2026-09-17. Ruben's paid community at home.how-to-ai.co (Circle) plus the linked Substack essays. The Learn section holds both a library and courses. Library: a Knowledge Vault of essays by topic and level, a Prompt Library, a Cheat Sheet Gallery, a Resources space. Courses (Brett's correction, 2026-09-17): Claude Cowork in 15 Minutes (14 lessons), Claude Skills (12 lessons in six sections: why skills beat other context, build one with skill-creator, makemyskill.com, the plugin store, seven hacks, where skills fall short), Claude in Excel, Slides, Nano Banana (image generation). His separate "The AI Course" community is the beginners course and is out of scope per Brett. This intake is scoped to what bears on the build: team rollout, skills and prompts, model guidance, Cowork onboarding material, and writing voice. Summarized in my own words._

## Source

- Instructor: Ruben Hassid
- Platform and access: home.how-to-ai.co (Circle), Brett's paid membership, signed in on the course Chrome profile; essays on ruben.substack.com, paid
- Date reviewed: 2026-09-17
- Covered: Start Here, Knowledge Vault (Team/Org, AI for Business and Work, Advanced listings), Cheat Sheet Gallery ("7 Days to Set Up Claude for Your Entire Team," "Claude Model Tree"), Prompt Library (.md Files, Claude Cowork Prompts), the "Claude for teams" essay in full, the Cowork mini-course outline.
- Claude Skills course: all 12 lessons read 2026-09-17; see the section at the end of this file. Next: the Cowork in 15 Minutes course as team on-ramp material, when the team course roadmap starts.
- Not yet covered: Claude in Excel, Slides, Nano Banana (off-goal for this build), LinkedIn Growth vault (authority content; belongs to the Business Development lane later), the 14 Cowork lessons themselves, the remaining cheat sheets ("How to Build Your First Claude Skill," "Claude Prompt vs. Project vs. Skills," "8 Steps to Duplicate Your Brain Into AI," "How to Master Claude in One Week"), the .md file downloads (Dropbox transfer links with passwords; see assets note).

## Their recommended buildout

Ruben does not teach an agent architecture. He teaches adoption. For an individual: put your context in .md files (a voice profile, brand rules, past work, briefs), open Cowork with that folder, start every prompt with "read this file first," and let Claude prompt you back with clarifying questions. For a team: one shared claude.ai Project per recurring deliverable, loaded with one gold-standard example, the relevant background doc, and the current template; generated instructions per Project; a one-sentence prompt template with a single [INPUT] field so a teammate pastes their notes and hits enter; a before-and-after "wow" from one real task; convert one drowning colleague in a 15-minute session using their own work; then roll out to the whole team in a short casual message and seed two or three people by direct message. His line: adoption is a sales problem, not a training problem.

## By topic

| Topic | What they recommend | Fits our OS? | Notes |
|---|---|---|---|
| Agent structure | None. Projects for teams, Cowork for individuals, skills as saved instruction sets. | Not applicable | Allie owns this row. |
| Model assignment and cost | A decision tree: quick answer with no files goes to the fast everyday model; lightweight, token-saving work to the smallest; reasoning with files to the largest, in Cowork with extended thinking. Token habits: edit the message rather than follow up, batch tasks, say "no commentary," convert PDFs to .md, new topic means new chat, files under 2,000 words. | Partly | The tree names models that predate Fable 5.1, which is exactly the version-pin risk Brett flagged; the shape (route by task weight and by whether files are involved) matches model-selection.md. The token habits are worth a line in the team onboarding SOP. |
| Management surface | None beyond "one Project per deliverable" as the organizing unit. | Not applicable | |
| Memory and context | .md files as the context layer: voice profile, anti-AI writing style, copywriting playbooks, prompting cookbook. "Read [file] first, then [task]." Only the right context per Project, nothing extra. | Built | Our voice-principles.md and content-frameworks.md are these files. His anti-AI writing style file and voice profile shape are worth comparing against voice-principles.md once downloaded. |
| Evals, judges, safety gates | A self-critique test prompt after setup ("produce a sample, then critique it against our standards"), and a "brutal peer review" prompt. No evals. | Partly | The self-critique test is a lightweight eval for a Project; our editor and eval files go further. |
| Team rollout and permissions | The five-day playbook: Monday Projects, Tuesday prompt templates, Wednesday the wow, Thursday convert one person (not the enthusiast, not the skeptic, the one drowning in work), Friday roll out with a message that leads with one result and lists three things to do right now, then seed by DM and collect feedback the same day. Team plan, shared Projects, premium seats for daily users. | Yes, for Phase 5 | This is the most concrete rollout sequence in any course so far. It assumes claude.ai Projects rather than our shared OS, so it maps to the VA-facing surface, not to the agent layer. |
| Tooling assumptions | Claude Team plan and claude.ai Projects for teams; Cowork desktop for individuals; Wispr Flow dictation; Granola for meetings; Gamma for slides; Dropbox for file handoff. | Mostly | Team plan is already the plan. Gamma and Granola are optional. |

## Adopt

- **The five-day rollout sequence for Phase 5**, one role at a time: Projects (or shared skills) per recurring deliverable, one-sentence templates, a wow moment from real work, convert one person, roll out with a short message and seeded DMs, collect feedback the same day. Lands in roadmap.md Phase 5.
- **One-sentence prompt template with one [INPUT] field** for every skill the team touches. The captions skill ships with these: "Captions for this LIL property: [MLS description]." Lands in Phase 2 with the captions skill.
- **The wow moment as a deliverable.** Before Elizabeth's pilot, record one real caption run side by side with the ChatGPT version and keep the screenshots. Lands in Phase 4.
- **"Convert one person" as the pilot rule.** Elizabeth is the champion; the next person is whoever is drowning in caption work, not the most technical VA. Confirms Phase 4.
- **Pros and cons of claude.ai Team Projects as the VA-facing surface.** Pros: nothing to install, one Project per deliverable, instructions and gold examples travel with it, the team already knows chat interfaces, no folder mounting, no permissions to explain. Cons: a Project is a copy of our skill and context, so it drifts from the OS unless someone pushes updates; no connectors to Zoho or Drive inside the Project without extra setup; no agent layer, so no editor gate before a person sees output; it is what Jeff calls the inferior version of the system. Recommendation: use Team Projects for the VAs' captions work in Phase 4 as the on-ramp, with the skill file in the OS as the source of truth and a rule that the Project instructions are regenerated from the skill, never edited by hand. Revisit once Team Edition lets the VAs run skills directly.
- **Token habits** into the onboarding SOP: one task per chat, edit the prompt instead of piling follow-ups, convert PDFs to Markdown before uploading, keep context files short.
- **Self-critique test prompt** as the first check on any new skill or Project before the eval exists.
- **Anti-AI writing style and voice profile files** as comparison material for voice-principles.md and the copywriter's banned-phrase list, once downloaded.

## Reject or defer

- **His model tree as written.** Names specific models from before Fable 5.1. Use the shape, not the labels; our model map governs.
- **The Cowork in 15 Minutes mini-course as team training.** Defer until the team course roadmap (Phase 5). It may serve as the individual on-ramp for Elizabeth and the VAs who get Cowork; review the 14 lessons then.
- **LinkedIn Growth vault.** Defer to the Business Development lane and Brett's authority-content push. Not part of the Operations first lane.
- **Gamma, Granola, Wispr Flow.** Tool recommendations, not architecture. Brett dictates already; the rest are optional.
- **The generic skills in the Cowork prompt library** (infographic builder, research synthesizer, hook generator). Thin and generic, the kind Allie warns against. The deck-builder template prompt is the one worth keeping as a shape.

## Open questions for Brett

1. Team Projects for the VAs in Phase 4 (fast on-ramp, drifts from the OS) versus waiting for Team Edition skills (slower, one source of truth)? My recommendation is above; your call.
2. The .md file downloads sit behind Dropbox transfer links (the bundle at dropbox.com/t/TGg7Bn7DcEKGYZBb; the anti-AI style file at dropbox.com/t/0j0h6pZCDqmM7hbU, password posted in the community as howtoai). Automated download did not complete on 2026-09-17; two clicks by hand in your course browser, then drop the files into courses/assets/ruben-hassid/. Worth it for the voice profile and anti-AI style comparison; skip if not.
3. Do you want the LinkedIn Growth vault read now for your authority-content push, or when the Business Development lane opens?

## Addendum 2026-09-17: the Claude Skills course (12 lessons)

_Read in full. Last updated by Ruben April 2026, so the model names (Opus 4.6) predate Fable 5.1; the mechanics hold._

**What he teaches.** Four levels of giving Claude context: a long prompt, a text file, a Project, a skill. A skill is the only one that fires on its own, because Claude reads the description and activates it without being asked. Build one with the skill-creator in Cowork: describe the task, answer the interview, let it generate the folder and SKILL.md, run the evaluation it offers, then save and install (claude.ai Settings, Capabilities, Skills, Upload). Skills stack with a voice file: the skill carries the process, the voice file carries the tone. Test with five phrasings that should fire it and three unrelated requests that should not. A skill produces a consistent 80 percent starting point, not a finished piece.

**Seven things he says most people miss**, with our read on each:

| His point | Fits our OS? | Pros and cons for us | Decision |
|---|---|---|---|
| Debug a skill by asking "When would you use the [name] skill?" Claude quotes the description back and the gap shows. | Yes | Pro: a ten-second check with no setup. Con: none. | Adopt as the first smoke test for every skill and agent description. |
| The "Do NOT use for" line in the description matters more than the "use when" line; it stops a skill hijacking unrelated chats. | Yes | Pro: our captions skill could otherwise fire on any mention of a caption or a listing. Con: too many negatives and it never fires; keep to three. | Adopt. Every skill and agent description gets a three-item negative trigger line. Added to the captions skill spec. |
| Skills stack with the voice file; process in the skill, tone in the file. | Already our design | Pro: one source of truth for voice, which is voice-principles.md. Con: if the skill duplicates voice rules, the two drift. | Adopt as a rule: no voice rules inside a skill body; the skill points at voice-principles.md. |
| Turn a good Cowork conversation into a skill from the chat menu. | Yes, later | Pro: the fastest way for the team to capture a workflow they already ran well. Con: captures the conversation's quirks along with the process; needs an edit pass and an eval. | Adopt for Phase 5 team capture, with the eval pass mandatory. |
| Only the three-line header of each installed skill loads until a task matches, so many small skills cost little context. | Yes | Pro: supports one skill per job instead of one giant skill. Con: none for us. | Confirms the "one skill, one job" rule already in the roadmap. |
| Claude sometimes cuts corners inside a skill; "take your time, quality over speed, do not skip steps" works better in the user prompt than inside the skill. | Partly | Pro: cheap fix when a run looks thin. Con: it is a prompt habit, not a system property; our editor and eval catch the same failure structurally. | Note in the onboarding SOP; do not rely on it. |
| Skills are an open standard and portable across platforms. | Yes | Pro: matches Brett's no-single-dependency rule. Con: portability is on paper until another platform ships support. | Noted. |

**Also in the course.** makemyskill.com, his team's free web tool that writes a skill from a description without the interview: reject, because it sends the workflow description to a third party and skips the interview and the eval that make a skill fit. The plugin store in the desktop app (Customize, Personal plugins, Browse): already in use here; the small-business and productivity plugins are installed. His five use-case families (content, analysis, communication, research, operations) map onto our lanes and add nothing new. His honest limits: a bad description never fires, a broad one hijacks, output still needs review, and usage still burns; consider the Max plan if Cowork runs daily.

**What changed in our plan because of this course.** Three lines in drafts/captions-skill-spec.md (negative triggers in the description, the "when would you use" smoke test, the five-and-three acceptance test) and one line in templates/eval-template.md (the acceptance test as a criterion for any skill). Nothing structural.

## AI 201: Set up, then ship (reviewed 2026-11-04)

Source: ai201-prompts.vercel.app (Brett shared 2026-11-04). Three parts: **Your tools** (Node.js, Git, GitHub, Vercel, Supabase, installed by one "setup prompt" in Claude Code or Codex), **Additional connectors** (optional: Drive, Gmail, Calendar, Outlook, Teams, Slack, Notion, Granola, Wispr Flow, Stripe, Apify, Vercel, Namecheap, Canva, Figma, Higgsfield), **Build something** (a "build prompt" that installs the third-party "one-shot protocol" (/oneshot, /reshot) via npx and ships a site to Vercel).

| Lesson | Fit for us | Verdict |
|---|---|---|
| Setup prompt guardrails (agent runs every command, one action at a time, never sudo, never a password in chat) | Matches our rules and the kit repo setup for maintainers | Adopt the pattern for the Builder machine setup (Git and GitHub CLI only) |
| Node, Vercel, Supabase stack | Our systems run on Apps Script, Duda, and Artifacts; a second hosting stack adds upkeep | Not now |
| Connector list | Most of ours are connected; Slack pending the media team decision; the rest are tools we don't use | Add only what a role needs |
| One-shot protocol (npx @dxyz/oneshot) | Third-party code that writes into ~/.claude and ships without stopping | Not for the team kit |
