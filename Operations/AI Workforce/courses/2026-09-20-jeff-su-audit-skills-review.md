# Jeff Su's nine skill templates against what the OS already runs

_Written 2026-09-20. Source: the nine skill folders in `courses/assets/jeff-su/Lesson_6.01_-_Skills_Templates`, harvested 2026-09-17 with Brett's blanket permission. Compared against `starter-session-audit`, the account skill Brett runs today. Nothing was installed. Every recommendation carries the pros and cons for Brett's situation, per the rule in root CLAUDE.md._

## What Brett runs today

`starter-session-audit` is a lightweight end-of-session sweep. It does two things and says so out loud: it scans the conversation for corrections, stated preferences, decisions, and new facts, then proposes where each one should be saved, file and section, with exact wording for Brett to approve or skip. It finds the workspace root dynamically, reads whatever CLAUDE.md and MEMORY.md files were touched, filters findings against what is already written, and never writes without approval. It explicitly does no file reorganization, no cleanup, and no progress tracking.

That is the write-back mechanism the OS depends on. `00_Resources/users-guide.md` builds habits around it: audit every working session, audit mid-session on long threads, always audit before archiving, never defer. The guide's own standard is that a healthy audit comes back nearly empty, because capture happens in the moment with "remember this" and "add a rule."

## The structural problem with all nine

Jeff's skills are written for his AI Command Center layout: `00_Reference/` for governance files, `97_Skills/` for canonical skill sources, `98_Temp/` for scratch. They reference specific files by name: `Governance Rules - Codification.md`, `Governance Rules - Verification.md`, `Governance Rules - Communication.md`, `Memory System.md`, `Workspace Templates - Workstations.md`, `Skill Conventions.md`. None of those files exist in Brett's OS. His equivalents are `00_Resources/`, root CLAUDE.md, `voice-principles.md`, `cowork-os-guide.md`, and `workstation-project-setup.md`, and they are organized differently on purpose.

So none of these installs clean. Every adopt below means a rewrite against Brett's file names and conventions, not a copy. That is consistent with the decision already on record from 2026-09-17: harvest Jeff's files, do not reinstall his template as a new root.

## The nine

### 1. session-audit

**What it does.** The heavy version of what Brett already runs. Five scan categories instead of four: uncodified principles, a review of rules written during the session, a pruning pass over every instruction surface touched, artifact cleanup, and progress tracker sync. Three gates before any correction becomes a finding: existing coverage, materiality (name the concrete cost of not writing the rule, or drop it), and routing and ripeness. Splits output into Input Needed and Approval-Exempt, and applies the approval-exempt items autonomously. Ends by checking root MEMORY.md against a 150-line ceiling and compressing on the spot if over.

**Does the OS have it.** Partly. `starter-session-audit` covers the scan and the proposal. It does not prune, does not clean up artifacts, does not sync trackers, and does not check the MEMORY.md line count. Brett's root CLAUDE.md sets the same 150-line ceiling and the same compress-then-archive rule, so the rule exists and nothing enforces it.

**Verdict: adapt.** Take three pieces and leave the rest. The materiality gate ("name the concrete cost of not changing the instruction surface, or drop the candidate") is the single best idea in the file and it directly serves the users-guide standard that a healthy audit comes back nearly empty. The delete-replace-tighten-before-add pruning pass is the antidote to a rules file that only ever grows. The root MEMORY.md line count check enforces a rule Brett already wrote. Leave the Input Needed and Approval-Exempt split alone for now, and leave the autonomous apply behavior alone entirely.

**Pros.** Brett's root MEMORY.md is already near 150 lines and nothing is watching it. The audit is the one habit that runs on every session, so improving it improves everything. The gates make the audit more selective, not more verbose.

**Cons.** Jeff's version is roughly three times the length of Brett's and reads like a compliance procedure. Every session pays that cost. The approval-exempt category lets the skill write to files without asking, which conflicts with Brett's standing rule to show a change before overwriting. The five context-loading references all point at files that do not exist here.

**Recommendation: yes, as a rewrite, and keep it short.** Add the materiality gate, the pruning pass, and the line count check to Brett's existing skill. Do not adopt the approval-exempt auto-apply. Expect the file to roughly double, not triple.

### 2. workstation-audit

**What it does.** A deep structural audit of one workstation. Checks the workstation CLAUDE.md against an exact six-heading order, the workstation MEMORY.md against an exact four-heading order, and project MEMORY.md files against a four-heading project template. Then four analysis passes: duplicated and overlapping rules, rules at the wrong hierarchy level, bloat and stale cross-references, and gaps. Presents findings, waits, executes, verifies, then runs a second pass because structural changes leave residue.

**Does the OS have it.** No. Brett's quarterly audit in root CLAUDE.md is a different animal: it flags stale project folders, files missing from the File Map, and old _Outbox items. It never looks inside a CLAUDE.md or MEMORY.md for duplicated or misplaced rules.

**Verdict: adapt.** The four analysis passes are the valuable part and they transfer cleanly. The heading-template enforcement does not: Brett's workstation files do not follow Jeff's six-heading contract and there is no reason to force them to. Operations/CLAUDE.md uses Identity, Resources, Workflow, Editorial Rules. That works.

**Pros.** The discovery pass for this very roster found the problem this skill exists to catch: Operations/MEMORY.md still lists an August deadline as a current priority and does not mention the project running inside it, and Content & Authority/MEMORY.md has placeholder entries for two active shows. Nothing in the OS is looking for that today. The second-pass step is genuinely smart and most audit tools skip it.

**Cons.** It is long, and it is a sit-down job, not something to run casually. Rewriting it to drop the template enforcement takes real work. Run too often, it turns structure into a hobby.

**Recommendation: yes, but build it after the content lane ships.** Strip the heading contract, keep the four passes and the second pass, and run it once per workstation per quarter alongside the existing quarterly audit. This is the one skill on the list that solves a problem already visible in Brett's files.

### 3. reference-file-audit

**What it does.** The file-level version of the above, for a single reference file. Two modes, structural-only and precision. Eight checks: line and section measurement, structural integrity, scope compliance, internal and external duplicate detection, grouping quality, internal cross-reference validation, external pointer integrity, and growth trajectory.

**Does the OS have it.** No. The quarterly audit checks whether a file is in the File Map, not whether its contents are sound.

**Verdict: adapt, later.** The relevant checks are scope compliance, duplicate detection, and external reference integrity. `voice-principles.md` is the obvious first target: it gained an AI Tells section on 2026-09-17 and now has some overlap with the earlier Words and Phrases to Avoid section.

**Pros.** Brett has eight files in 00_Resources and they are referenced from root CLAUDE.md, workstation files, and skills. A broken pointer is silent until something reads it. The mode split is well designed; reorganizing and cutting are different jobs and most tools conflate them.

**Cons.** This is the lowest-yield of the three audits at Brett's current file count. Eight reference files is not a library. The checks assume a Reference Index in root CLAUDE.md, which Brett has as a References table, so the pointer logic needs rewriting.

**Recommendation: adopt the checks, skip the skill.** Fold scope compliance, duplicate detection, and pointer integrity into the workstation audit as a fifth pass over that workstation's Resources folder. One skill instead of two. Revisit a standalone version when 00_Resources passes fifteen files.

### 4. skill-sync

**What it does.** Compares skills installed in the account against canonical sources in `97_Skills/`, using content diffs rather than timestamps, and packages anything outdated or missing for install. Handles stale `.skill` zip artifacts, a deprecated.txt rename ledger, and multiple accounts.

**Does the OS have it.** No, and the OS does not have the structure it depends on. Brett's skills live in the claude.ai account with no canonical source folder. The systems registry already flags this: `reel-cut-sheet` is the only account skill with a recorded source of truth, in Content & Authority/Reel Cut Sheet System. The others have no owner and no source location.

**Verdict: skip the skill, adopt the principle.** The principle is that every skill has a canonical source on disk and the installed copy is a deployment. That is already the OS's stated pattern for the reel cut sheet system, and it is already the plan for the captions skill. The skill itself automates a sync across a folder structure Brett does not have and may not want.

**Pros.** The content-diff-not-timestamp rule is a real insight; cloud sync touches timestamps constantly. If Brett ever runs more than a handful of self-built skills across two accounts, this becomes worth having.

**Cons.** It requires standing up `97_Skills/` as a new root folder, which cuts against the decision not to reinstall Jeff's template structure. Phase 2 puts the OS's skills in `.claude/skills/` at the OS root, which is a different location with different mechanics. Building this now means building it against a structure that is about to change.

**Recommendation: no, not now.** Revisit after Phase 3, once `.claude/skills/` has real contents and the registry knows what is deployed where. The one thing to take today is the registry column: add a source-of-truth path for every account skill, which the registry already flags as a gap.

### 5. handoff

**What it does.** Generates a copy-paste session handoff for a new session. Runs the full session audit first, then captures what still lives only in the conversation: mid-session decisions not yet written, open questions, modified files, proposed-but-unapproved changes, and the exact next action. Output is one markdown code block with a fixed section order.

**Does the OS have it.** No, and this gap has a cost Brett has already paid. The AI Workforce MEMORY.md carries a Session Plan section written by hand on 2026-09-17 to survive a usage limit reset. This scheduled task exists because of it.

**Verdict: adopt.** This is the highest-value skill on the list for how Brett actually works: long multi-session projects, usage limits that force stops, and a rule in root CLAUDE.md that Brett must never have to scroll back.

**Pros.** Directly serves the never-scroll-back rule. The distinction it draws is the right one: only capture what is not already safely in a file, plus the pointer to where to look. It composes with the audit instead of duplicating it.

**Cons.** It depends on the session audit running first, so it inherits whatever the audit misses. Its context loading names files that do not exist here. There is real overlap with the project MEMORY.md Session Plan pattern Brett already improvised, so it needs to write to that section rather than to a chat block, or it will create a second place where state lives.

**Recommendation: yes, and rewrite the output target.** Jeff's version produces a code block to paste into a new chat. Brett's version should write to the project's MEMORY.md Session Plan section, which is where the AI Workforce project already keeps this and where a scheduled task can read it. Same logic, durable destination.

### 6. reconcile

**What it does.** Compares the draft Claude produced against the final Brett actually sent, and proposes the smallest sufficient change to the rules. A six-step gate in strict order: delete, rewrite or tighten, move, merge, stage, and add only as a last resort, with a written one-line proof that nothing existing could carry the case. Every proposal has to prevent a concrete, observed miss.

**Does the OS have it.** No. The closest thing is the audit's correction scan, which catches that Brett changed something but does not diff the draft against the final or reason about which rule should have fired.

**Verdict: adopt.** This is the quality engine behind Brett's voice files, and it is the one skill here that makes the OS better at writing rather than better at housekeeping.

**Pros.** Brett's voice-principles.md is the most edited file in the OS and it grew again on 2026-09-17. The prune-first gate is the discipline that keeps it from becoming an unreadable list of every correction ever made. The stage disposition, log a single-instance signal and promote it at the second occurrence, is exactly right for craft preferences that may be one-offs. It aligns with the rule already adopted from Ruben's course: voice lives in the file, not in the skill.

**Cons.** It only fires when Brett remembers to paste back what he actually sent, and that is a new habit. Its value scales with how often Brett rewrites Claude's drafts; if the drafts are landing, it sits idle. The calibration-file concept requires a file per deliverable category that Brett does not have, so either those get created or the stage disposition has nowhere to go.

**Recommendation: yes, and pair it with one calibration file.** Start with a single calibration file for content drafts in Content & Authority Resources. Without a staging destination, every signal either gets dropped or promoted too early, which is the failure mode the gate exists to prevent.

### 7. convert-to-markdown

**What it does.** Runs a bundled Python script to decompose a PDF, screenshot, or image into token-optimized markdown plus separate image files, then reads root CLAUDE.md and MEMORY.md to route the extracted content to the right workstation, and acts on it.

**Does the OS have it.** Partly, and from a better source. Claude's own `pdf` skill handles extraction. The account already has it.

**Verdict: skip.** The extraction half is covered. The routing half is what root CLAUDE.md's routing map already does on every session, without a skill.

**Pros.** The token-optimization argument is real for large PDFs, and the routing step is a nice touch. Brett handles brand kits, tax documents, and CPA statements as PDFs.

**Cons.** It depends on a bundled `extract.py` and a `98_Temp/` folder that Brett does not have. It writes output to a temp folder structure that conflicts with the Files rules in root CLAUDE.md, which route deliverables to `_Outbox/` and reference material to Resources. Max Income documents are the highest-value PDFs in the OS, and this run is barred from touching that workstation, so the case for it has not even been examined there.

**Recommendation: no.** Revisit only if the `pdf` skill measurably struggles on a real document.

### 8. data-insights

**What it does.** Analyzes an uploaded structured dataset and presents it as an interactive live artifact, with a phase for choosing the analytical approach and a phase for surfacing narrative insights.

**Does the OS have it.** Partly, and better. The account has `xlsx` for spreadsheets, the `dataviz` skill governs any chart Claude builds, and Operations/Dashboards holds the four Apps Script systems that are the real answer to "show me the numbers" at Five Star.

**Verdict: skip.** Brett's data problem is not ad-hoc CSV analysis. It is Smartsheet feeding dashboards that already exist and already run.

**Pros.** Useful for a one-off: a survey export, a platform analytics dump, a client's spreadsheet. Phase 2 of the file, choosing the analytical approach before building anything, is good thinking.

**Cons.** It would sit unused. Every recurring data question at Five Star and RTM already has a dashboard, and Phase 3 of the roadmap gives those a skill. Installing this adds a name to the registry for something with no owner and no trigger.

**Recommendation: no.**

### 9. folder-cataloger

**What it does.** Scans a folder of three or more files, proposes a naming convention, renames the files, and writes an INDEX.md with descriptions, tags, and suggested uses. Adds a read trigger for the new folder.

**Does the OS have it.** Partly. Root CLAUDE.md already sets the naming convention, `YYYY-MM-DD-descriptive-name`, and the quarterly audit flags files missing from the File Map in `cowork-os-guide.md`. So the OS has the convention and a compliance check, but nothing that renames a pile of files or indexes a folder's contents.

**Verdict: adapt, narrowly.** The genuine gap is asset folders, not OS files. `courses/assets/` already holds three vendor folders with READMEs that were written by hand during the 2026-09-17 intake. Canva exports, brand assets, and course downloads are the folders where this would earn its keep.

**Pros.** It writes the index Brett's harvested course assets needed and got by hand. As the team grows and VAs drop files into shared folders, a consistent naming pass has real value in Phase 5.

**Cons.** It renames files, which is the single most dangerous thing on this list. Root CLAUDE.md requires showing the change and waiting before renaming any existing file, and this skill's default is to propose and then rename in a batch. It also writes a `Read when...` trigger into root CLAUDE.md, which touches the highest-blast-radius file in the OS. Any adoption has to gate both behaviors behind explicit approval per file.

**Recommendation: defer to Phase 5.** It is a team-rollout tool, not a solo-operator tool. Build it when VAs start putting files in shared folders, and build it with the rename gate wired to Brett's existing rule.

## Summary

| Skill | OS equivalent today | Verdict | When |
|---|---|---|---|
| session-audit | starter-session-audit, lighter | Adapt: take the materiality gate, the pruning pass, and the MEMORY.md line check | Now |
| handoff | None; improvised by hand in project MEMORY.md | Adopt, writing to the project MEMORY.md Session Plan instead of a chat block | Now |
| reconcile | None | Adopt, paired with one calibration file for content drafts | Now |
| workstation-audit | Quarterly audit, structure only | Adapt: keep the four passes and the second pass, drop the heading contract | After the content lane ships |
| reference-file-audit | None | Fold three checks into the workstation audit; no standalone skill | With the workstation audit |
| folder-cataloger | Naming convention and File Map check | Defer; gate the renames behind Brett's existing approval rule | Phase 5 |
| skill-sync | None; registry flags the gap | Skip the skill, add a source-of-truth column to the registry | Revisit after Phase 3 |
| convert-to-markdown | `pdf` skill | Skip | Not planned |
| data-insights | `xlsx`, `dataviz`, Operations/Dashboards | Skip | Not planned |

Three to build, two to build later, one to defer, three to leave alone. None of them installs as written, because all nine reference a governance file layout the OS does not use and should not adopt.

Nothing was installed. Each adopt above is a rewrite against Brett's file names and rules, and each one needs its own approval and a row in the systems registry when it lands.
