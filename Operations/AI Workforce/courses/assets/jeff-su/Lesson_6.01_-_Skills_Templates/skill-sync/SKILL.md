---
name: skill-sync
description: >
  Compare installed skills against canonical sources in 97_Skills/ and package
  any that are outdated or missing for installation in the current account. Use this skill whenever
  you say 'sync skills,' 'update skills,' 'check for outdated skills,'
  'install missing skills,' 'skill sync,' 'are my skills up to date,' or
  'which skills need updating.' Also trigger when you switch between
  accounts and want to ensure both have the latest versions, or say 'install
  the latest skills.' Do NOT trigger for creating a brand-new skill or for
  editing a skill's SKILL.md content (draft or edit the `97_Skills/` source
  directly, then install it through the Save-skill flow). This skill only syncs
  already-written skills; it does not author or edit their content.
---

# Skill Sync

## Context Loading

No workstation-specific context needed. This skill operates at the workspace root level.

Read these files before proceeding:
1. `00_Reference/Skill Conventions.md` - Canonical Source, Installing a Skill, and Two-Account Note sections for source direction, packaging, delivery, and multi-account conventions
2. `00_Reference/Workspace Templates - Skills.md` - required only when a skill source appears malformed or missing required SKILL.md structure

## Workflow

### Phase 1: Scan and Compare

1. **List canonical sources.** Read all subdirectories in `97_Skills/` that contain a `SKILL.md` file. Each subdirectory name is a skill name. Exclude any `.skill` zip files, `.DS_Store`, hidden system files, `deprecated.txt`, or non-directory items.

2. **List installed skills for the current account.** Locate the installed skills directory available in the current Cowork environment and read all subdirectories that contain a `SKILL.md` file. If the installed directory is not readable in this run, mark the runtime comparison as blocked and continue using `97_Skills/` as the canonical source list.

3. **Categorize each canonical skill** by comparing against installed skills. Categorize each as:
   - **Up to date:** Installed and content is identical to the `97_Skills/` source (verified by `diff`, not timestamps, since cloud sync can touch timestamps without changing content).
   - **Outdated:** Installed but content differs from the `97_Skills/` source.
   - **Missing:** Exists in `97_Skills/` but not installed in this account.

4. **Identify Claude-provided skills.** Skills that are installed but have no corresponding `97_Skills/` entry are Claude-provided (for example, docx, pptx, pdf, xlsx, skill-creator, theme-factory, canvas-design, setup-cowork, schedule, weekly-report, consolidate-memory). These are managed externally and excluded from the sync check entirely; do not flag them as orphaned or suggest any action. **Exception:** before classifying a skill as Claude-provided, check the deprecated list (step 6). A skill that appears in `deprecated.txt` is a superseded self-built skill, not a Claude-provided one.

5. **Scan for stale `.skill` artifacts.** List all `.skill` zip files in `97_Skills/`. For each one, extract the skill name (filename minus the `.skill` extension) and check whether the corresponding skill is already installed and up to date. Categorize each artifact:
   - **Stale:** The skill is installed and its content matches the `97_Skills/` source. The zip served its purpose and should be deleted.
   - **Pending install:** The skill is either not installed or outdated. The zip may still be needed, include it in the report so you know it's available.
   - **Orphaned:** The zip has no corresponding `97_Skills/<name>/SKILL.md` source folder. Flag for deletion.

6. **Check for deprecated skills.** Read `97_Skills/deprecated.txt` if it exists. For each entry (format: `old-name -> new-name (date)`), check whether the old skill is still installed. If it is, flag it for removal. This catches superseded skills that were renamed or replaced, they have no `97_Skills/` source (it was deleted when the replacement was created), so without this check they'd be silently ignored as Claude-provided.

### Phase 2: Report and Package

Present findings using the standard findings format (Governance Rules - Communication > Output Standards), then proceed immediately to packaging.

**Report structure:**

Open with a header block:
```
## Skill Sync Report

**Account:** [which account this is, if determinable]
**Canonical source:** 97_Skills/ ([N] skills)
**Installed:** [N] self-built skills + [N] Claude-provided skills
```

**Needs Update** items use the standard findings format, one numbered entry per skill:

**[N]. [Skill name] - [Outdated / Missing]**
- **Context:** For outdated skills, a brief summary of what changed in the canonical source (for example, "Root-Level File Check updated: added ARCHIVE.md exclusion, corrected File Creation Rule references"). For missing skills, a one-sentence description of what the skill does.
- **Proposed action:** Package and present for installation.

**Up to Date** items are listed as a single comma-separated line (no findings format needed, nothing actionable).

**Deprecated (Still Installed)** items use the standard findings format if any exist:

**[N]. [Skill name] - Deprecated**
- **Context:** Superseded by [new-skill-name] on [date].
- **Proposed action:** Uninstall manually from the skill list.

**Stale Artifacts** use the standard findings format if any exist:

**[N]. [filename] - [Stale / Orphaned]**
- **Context:** Why this artifact is no longer needed.
- **Proposed action:** Delete from 97_Skills/.

Use one continuous number sequence across Needs Update, Deprecated (Still Installed), and Stale Artifacts. Up to Date stays unnumbered because it is a non-actionable summary line.

If the installed-skills directory was not readable, replace the installed count with: `Installed: runtime comparison blocked in this account`. Then list every canonical skill as a refresh candidate instead of claiming outdated or missing status.

**If everything is up to date, no deprecated skills are installed, and no stale artifacts exist**, say so and stop. No packaging or cleanup needed.

**After presenting the report, proceed immediately to the cleanup proposal and packaging phases without waiting for you to choose which skills to update.** Packaging and presenting .skill files is not an irreversible action, the "Save skill" button is the real approval gate. Cleanup deletion is different: stale or newly created `.skill` files are deleted only after explicit approval. Pause for confirmation if the report surfaces something unexpected (for example, a skill that appears outdated due to a direct edit to the installed copy rather than a canonical source update).

### Phase 3: Propose Stale Artifact Cleanup

Before packaging new updates, identify any stale `.skill` zip files from Phase 1. These are artifacts from previous sync runs where the skill has already been installed successfully.

1. **Show the proposed cleanup list.** Separate stale, orphaned, and pending-install `.skill` files.
2. **Ask for explicit cleanup approval before deleting.** Never delete the source skill folders, and leave pending-install `.skill` artifacts in place.
3. **If approved, delete only the approved stale or orphaned `.skill` files** from `97_Skills/` using the available file-removal method. If deletion is blocked (for example, "Operation not permitted"), report the block before retrying.
4. **Report what was cleaned.** List the deleted files so you have a record.

If there are pending-install artifacts (zips for skills that still need installation), leave those in place, they can be used directly without repackaging.

### Phase 4: Package and Install

Proceed here immediately after the Phase 2 report and any approved Phase 3 cleanup. No pre-packaging confirmation needed, packaging is reversible and the "Save skill" button is the approval gate.

1. **Skip repackaging if a `.skill` file already exists.** If a pending-install artifact from a previous run is still present for a skill that needs updating, use it directly rather than repackaging. Only package skills that don't already have a `.skill` file.

2. **Package remaining skills with Skill Creator.** Use the default Skill Creator capability to package each existing skill folder into a `.skill` file and prepare it for the Save-skill flow. This is packaging for account sync, not authoring a new skill. If Skill Creator cannot package or present in the current environment, stop and ask whether to use a manual recovery path for this run.

3. **Present for installation.** Present each `.skill` file to you (a Save-skill card or a link) so you can install it. If automatic presentation isn't available, point you to the `.skill` file on disk so you can open it manually.

4. **Wait for confirmation.** Install each skill via the "Save skill" button (or by opening the `.skill` file manually).

### Phase 5: Post-Install Clean Up

After you confirm all skills are installed:

1. **Ask for approval to delete the newly created `.skill` zip files** from `97_Skills/`. The SKILL.md source files stay permanently.
2. **Verify installation** by re-running the diff check on the updated skills to confirm the installed versions now match the source.

## Output Format

The primary output is the Skill Sync Report (Phase 2), using the standard findings format for each Needs Update and Stale Artifact item. Up to Date items are a single comma-separated line. The report flows directly into a cleanup proposal and packaging; deletion waits for explicit approval.

For the packaging phase, present all the `.skill` files in one block (Save-skill cards or links) rather than packaging and presenting one at a time.

## Constraints

- **Never modify source files.** This skill only reads from `97_Skills/` and packages from it. It never edits SKILL.md content. Content changes are made by editing the `97_Skills/` source directly (see `Skill Conventions.md` > Creating and Updating Skills).
- **Content diff, not timestamps.** Cloud Drive sync can update file modification times without changing content. Always compare file content using `diff`, never rely on `stat` or modification dates.
- **Respect the canonical source direction.** `97_Skills/` -> installed, never the reverse. If an installed skill has been modified directly (which shouldn't happen per convention), the `97_Skills/` version is still authoritative. Flag the discrepancy in the report but still treat `97_Skills/` as the source of truth.
- **Don't package Claude-provided skills.** These are managed externally and don't have `97_Skills/` sources. Exclude them silently.
- **Clean up after installation with approval.** The `.skill` zip files are transient packaging artifacts. After you confirm installation, ask before deleting them to keep `97_Skills/` clean (only SKILL.md source folders should persist there).

## Edge Cases

- **`97_Skills/` contains a skill with no SKILL.md:** Skip it and warn, likely an incomplete or malformed skill directory.
- **Installed skill has extra files not in `97_Skills/` (scripts, references, assets):** Compare only the SKILL.md. Bundled resources in the installed copy may come from the packaging process and aren't meaningful to diff.
- **Skill Creator cannot package or present:** Stop and ask whether to use a manual recovery path for this run. Do not treat plain `.skill` packaging as the default install method.
- **Installed skills directory is unavailable:** Report that the runtime comparison is blocked in the current environment, skip installed-vs-source status labels, and treat every canonical skill in `97_Skills/` as a refresh candidate for the Save-skill flow. This is account-sync behavior, not skill creation.
- **Automatic presentation fails:** Fall back to pointing you to each `.skill` file on disk so you can open and install it manually. This is the expected fallback per Skill Conventions.
- **Leftover `.skill` zip files from a previous run:** Handled by Phase 3 (stale artifact cleanup proposal). Pending-install artifacts are preserved and reused in Phase 4 to avoid redundant packaging.
- **A skill exists in `97_Skills/` with a different directory name than its `name:` frontmatter field:** Use the directory name for comparison (that's what the installed skills directory uses), but flag the mismatch.
- **`skill-sync` itself shows as missing on first run:** This is expected, the skill is being invoked from the source before it's installed. Include it in the packaging batch like any other missing skill.
- **A self-built skill predates the `97_Skills/` migration and has no source:** It appears in the Claude-provided list because it has no `97_Skills/` entry. If the skill is still wanted, don't treat it as orphaned (you can add it to `97_Skills/` separately). If the skill has been retired, add it to `deprecated.txt` so the deprecated-skills check (step 6) flags the installed copy for removal; retired self-built skills are not exempt from removal flagging.
- **`deprecated.txt` doesn't exist:** Skip the deprecated skills check entirely. This file is created when a skill is first renamed or superseded. Its absence means no skills have been deprecated yet.
- **A deprecated skill is not installed:** No action needed, the old skill was already cleaned up on this account. Skip it silently.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
