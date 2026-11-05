# Skill Conventions

_How skills behave, install, and stay maintainable in your workspace. Read this before creating or modifying any skill (the Pre-Creation Overlap Gate is required reading before creating a new skill). Does not contain the SKILL.md structural template (see `Workspace Templates - Skills.md`), scheduled-task behavior (see `Scheduled Task Conventions.md`), or workflow definitions for specific skills (those live inside each skill's own SKILL.md)._

---

## Canonical Source: `97_Skills/`

All of your custom skill source files live in `97_Skills/<skill-name>/SKILL.md`. This is the canonical, editable copy and the single source of truth for a skill.

The version your assistant actually runs (the installed copy) is a runtime artifact, not the source. When you update a skill, always edit the `97_Skills/` copy first, then re-install so the runtime matches. Never edit an installed copy as if it were the source: that change is invisible to `97_Skills/` and silently drifts from the canonical version on the next update.

---

## Installing a Skill

Skills install through the Save-skill flow, not by writing files directly into the installed-skills directory. A SKILL.md placed there by hand will not reliably register or appear in the app.

The install flow has three steps:

1. **Package.** Use the default Skill Creator capability to package the finished skill folder in `97_Skills/<skill-name>/` into an installable `.skill` file.
2. **Present.** Skill Creator presents the `.skill` file to you as a card with a Save skill button.
3. **Save.** You click Save skill to install it. The file must still exist on disk when you click, so the `.skill` zip is only cleaned up after you confirm the skill is saved.

After you confirm installation, approve cleanup of the temporary `.skill` zip from `97_Skills/`. The SKILL.md source stays permanently: it is the canonical copy that gets backed up with the rest of your workspace.

If Skill Creator cannot package or present the skill in a specific environment, stop and choose a recovery path. Manual `.skill` packaging is only a fallback when you explicitly choose it for that run. The Skill Creator path is the default.

---

## Pre-Creation Overlap Gate

Before you create a new skill, check whether an existing skill already covers the use case or could be extended to cover it. Skill sprawl (many near-duplicate skills) makes triggering unreliable and maintenance expensive, so each skill should have a distinct purpose.

The check: read every installed SKILL.md, compare each against the proposed skill's trigger phrases and output format, and judge the overlap as none, partial, or full.

- **Full overlap.** An existing skill already does this. Use it; do not create a new one.
- **Partial overlap.** An existing skill is close. Extend it (add trigger phrases or a workflow branch) rather than creating a sibling that will compete for the same triggers.
- **No overlap.** Nothing existing can reasonably carry the behavior. Create the new skill.

Only create a new skill when no existing skill can be reasonably extended.

---

## Creating and Updating Skills

**Create a new skill** by drafting its SKILL.md from the template in `Workspace Templates - Skills.md` and writing it to `97_Skills/<skill-name>/SKILL.md` (the canonical copy). Test it on a few real inputs, then install it through the Save-skill flow: use Skill Creator to package, validate, and present the `.skill` file for you to save. If Skill Creator cannot package or present in a specific environment, stop and choose a recovery path rather than treating manual packaging as the default.

**Update an existing skill** as a single, complete workflow, because an edit that is never re-installed is invisible to the running assistant:

1. Edit `97_Skills/<skill-name>/SKILL.md` directly. This is the canonical source; there is no need to copy from the installed location first.
2. Re-package and re-install through the Save-skill flow so the runtime copy matches the updated source.
3. Confirm the skill is saved, then approve cleanup of the temporary `.skill` zip. The SKILL.md source stays.

Do not treat an edit to the source as "done." Until you re-install, your assistant is still running the old version.

**Verify before packaging.** Before re-installing, read the SKILL.md against the reference files relevant to the skill's domain (root `CLAUDE.md` for routing, the governance files for codification and verification rules, `Voice Principles.md` if the skill produces content, and the owning workstation's `CLAUDE.md` for domain rules). Fix gaps before packaging. This catches missing conventions while they are cheap to fix.

---

## Two-Account Note

If you run more than one assistant account against the same workspace folder (for example, a personal and a work account), the skills stored in `97_Skills/` are visible to both, but each account has its own installed copies. To keep both current, install the latest version in each account separately.

To label which account a skill belongs to, prefix its name: `personal-` for a personal-account skill, `work-` for a work-account skill, and no prefix for a skill shared across both. The prefix is a naming convention for your own clarity; it does not enforce any access restriction.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
