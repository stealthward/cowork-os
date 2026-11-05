# Jeff Su's audit skills, explained against what you run today

_Written 2026-09-21 at Brett's request for a deeper understanding before he decides. Source: Jeff Su's Cowork Academy, Lesson 6.01 (Skills Templates, nine skill folders harvested 2026-09-17) and the governance lessons that feed them (2.02 codification, 6.02 and 6.03 audits). Brett has not taken the course yet, so this starts from what he already has. The line-by-line technical review is courses/2026-09-20-jeff-su-audit-skills-review.md; this document is the why. Pros and cons per the root rule. Tag: Shared Core._

## Start with what you already have

Your OS has one maintenance habit: at the end of a session you say "audit this session." A small skill on your claude.ai account (its file name is starter-session-audit) reads the conversation, finds anything that should survive the thread (a correction you made, a preference you stated, a decision, a new fact), and proposes where to save each one, with the exact wording. You approve or skip. It never writes on its own.

That is the whole maintenance layer today. It catches new things. It does not look at what is already written. So three things drift with nobody watching:

1. **Rules files only grow.** Every correction adds a line. Nothing asks whether an older line should be deleted or rewritten instead. Root CLAUDE.md and voice-principles.md both gained rules this week.
2. **Memory files go stale.** Operations/MEMORY.md still lists an August deadline as a current priority and does not mention this project. Content & Authority/MEMORY.md has placeholder lines for two live shows. Nothing in the OS would ever notice.
3. **State dies with a thread.** When a session ends mid-project, the next session starts from whatever happened to be written down. This project survived the Sunday usage reset because I hand-wrote a Session Plan section into MEMORY.md. That was improvised.

Jeff's course treats those three as the main risks of a file-based system, and his nine skills are his answers. Three of them fix the three problems above. The rest solve problems you do not have.

## The three I recommend adopting now

### 1. A stronger session audit (his "session-audit")

**What Jeff adds to what you have.** Three gates before a finding is allowed to become a rule. First, is it already covered somewhere? Second, materiality: name the concrete cost of not writing this rule, or drop it. Third, where does it belong and is it ripe, or is it a one-off? Then a pruning pass: before adding anything, look for an existing rule to delete, rewrite, or tighten. And at the end, count the lines in root MEMORY.md against the 150-line ceiling you already set, and compress if over.

**What stays out.** His version also cleans up artifacts, syncs progress trackers, and applies "approval-exempt" changes on its own. That last part conflicts with your rule to show a change before overwriting, so it does not come across. His skill is also three times the length of yours and reads like a compliance procedure.

**Pros for you.** The audit runs every session, so improving it improves everything. The materiality gate makes audits shorter, not longer, which matches the users-guide standard that a healthy audit comes back nearly empty. The line count enforces a rule you wrote and nothing enforces.

**Cons.** Your skill roughly doubles in length. Every session pays a few more seconds. It has to be rewritten against your file names, because Jeff's references files that do not exist here.

**Recommend:** yes.

### 2. A handoff skill (his "handoff")

**What it does.** At the end of a session, after the audit, it captures what still lives only in the conversation: decisions made but not yet written, open questions, files touched, proposals awaiting approval, and the exact next action. Jeff's version prints that as a block you paste into the next chat.

**What I would change.** Write it into the project's MEMORY.md Session Plan section instead of a chat block. That is where this project already keeps it, and it is what a scheduled task can read at 7 am on a Sunday.

**Pros for you.** This is the skill your way of working needs most: long multi-session projects, usage limits that force stops, and the never-scroll-back rule. It formalizes the thing I improvised.

**Cons.** It depends on the audit running first. If the destination is a chat block instead of a file, you get two places where state lives, which is worse than one.

**Recommend:** yes, with the file destination.

### 3. A reconcile skill (his "reconcile")

**What it does.** When Claude drafts something and you send a different version, you paste back what you actually sent. The skill diffs the two and proposes the smallest change to the rules that would have prevented the miss, in a strict order: delete an existing rule, rewrite or tighten one, move one, merge two, stage the signal for later, and only as a last resort add a new rule. One-off preferences get staged in a calibration file and promoted only if they happen twice.

**Pros for you.** This is the engine that makes voice-principles.md better instead of longer. It is the only skill on the list that improves writing rather than housekeeping. It matches the rule already adopted from Ruben: voice lives in the file, not the skill.

**Cons.** It only works if you remember to paste back the final version, which is a new habit. It needs one calibration file to stage signals in, which you do not have yet. If drafts are landing, it sits idle, which is fine.

**Recommend:** yes, with one calibration file for content drafts in Content & Authority Resources.

## The two to build later, after the content lane ships

### 4. Workstation audit

A sit-down review of one workstation: duplicated rules, rules at the wrong level (a project rule sitting in root, or the reverse), stale cross-references, and gaps. Then a second pass, because structural changes leave residue. This is the skill that would have caught the stale Operations and Content & Authority memories. Jeff's version also enforces an exact heading order on every file, which your files do not follow and should not have to. Keep the four passes and the second pass, drop the heading contract, run it once per workstation per quarter alongside your existing quarterly audit.

### 5. Reference-file audit

The same idea for a single reference file: is it in scope, does it duplicate another file, do its links still point somewhere. Useful, but you have eight reference files, not a library. Fold its three good checks into the workstation audit as a fifth pass over that workstation's Resources folder instead of building a separate skill.

## The four to leave alone

- **Folder cataloger.** Renames a pile of files to a convention and writes an index. Renaming is the most dangerous action on the list and conflicts with your show-before-rename rule. Worth revisiting in Phase 5 when VAs are dropping files into shared folders.
- **Skill sync.** Keeps installed skills in step with a canonical source folder. Good principle, but it depends on a folder structure you do not have, and Phase 2 puts your skills in a different place. Take one idea from it: every account skill gets a source-of-truth path in the systems registry.
- **Convert to markdown.** Turns PDFs into text and routes them. Claude's built-in PDF handling and your routing map already do this.
- **Data insights.** Ad hoc spreadsheet analysis. Your data lives in Smartsheet and dashboards that already run. It would have no owner and no trigger.

## What changes if you approve, in plain terms

- Your "audit this session" gets pickier and shorter, and it tells you when MEMORY.md is over the line.
- Sessions end with the next step written into the project file, not remembered.
- When you rewrite my draft, you paste the final back and the voice file gets one precise edit instead of one more bullet.
- Nothing installs as a copy. Each is a rewrite against your file names, needs its own approval, and gets a row in the systems registry when it lands.

## The decision, in the order I would take it

1. Approve the three now, or hold until you reach Lesson 6 yourself.
2. If approving now: session audit first (it changes a habit you already have), then handoff, then reconcile once the calibration file exists.
3. Workstation audit after the content lane ships. The stale memories are its first two targets.
