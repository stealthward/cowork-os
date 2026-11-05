# COO run 4: handoff fixes (staged 2026-10-09)

## 1. research-sidekick missing from the Agent tool (CMO, 2026-10-02)

Finding: still missing on 2026-10-09 (copywriter and editor load). The 10/8 hypothesis (unquoted ": " in the description) is incomplete: copywriter.md has the same unquoted colon and loads. research-sidekick.md is the only agent file with both invalid YAML and CRLF line endings (editor.md is CRLF but valid YAML; copywriter.md is invalid YAML but LF). Likely cause: the loader's fallback for invalid YAML fails on CRLF. Not provable without a new session.

Fix (both files, frontmatter only, body untouched):
- research-sidekick.md: wrap the description value in single quotes; convert CRLF to LF.
- copywriter.md: wrap the description value in single quotes (Brett's becomes Brett''s, YAML escaping), so it no longer depends on the fallback.
- Verify: both parse with a strict YAML parser now; research-sidekick appears in the agent list in the next new session.

## 2. Cut sheet engine points at the one rulebook (CMO, 2026-10-06)

File: Content & Authority/Reel Cut Sheet System/engine/SKILL.md

Section 4, Hook, replace:
> scored against the seven headline components: recency, relevancy, celebrity (a recognizable name, or a credential such as a start date, a transaction count, or a dollar figure), proximity, conflict, unusual (odd, rare, unexpected), ongoing (a story still unfolding).

with:
> scored against the seven headline components in content-frameworks.md section 4.3 (the Celebrity component now includes a recognizable industry figure).

Section 4, 5P, replace:
> The 5P framework (Proof, Pain, Promise, Plan, Picture) is a set of concepts woven through a moment, not a fixed sequence. Proof earns the right to speak, Pain names the problem, Promise says what they get, Plan shows how, Picture lets them see it. Any order works; the more Ps a moment carries clearly, the higher it scores:

with:
> Score against 5P as defined in content-frameworks.md section 5 (Proof, Pain, Promise, Plan, Picture, any order). The more Ps a moment carries clearly, the higher it scores:

Section 10, reel fields, replace `caption` (2-5 sentences) with `caption` (per content-frameworks.md section 9).

The 1 to 5 scoring scales stay in the engine: they are engine structure, not content rules.

Deployment gap: the claude.ai skill (team fallback) cannot read 00_Resources. Recommended: the skill package carries references/content-frameworks.md, copied from 00_Resources at packaging time and never edited; the engine cites that path. The CLAUDE.md rule "engine/ stays byte-identical to the deployed skill package" gains "plus references/content-frameworks.md, copied at packaging". Every rulebook change then triggers a repackage the same day (already the COO's rulebook duty). Brett replaces the skill under Customize > Skills.

## 3. Direct-to-Camera repoint

File: Content & Authority/CLAUDE.md, "Direct-to-Camera Content". Replace the five steps with:
> Follow the direct-to-camera outline in 00_Resources/content-frameworks.md section 6.
