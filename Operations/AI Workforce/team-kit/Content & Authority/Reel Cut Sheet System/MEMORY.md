# Reel Cut Sheet System Memory

_Last updated: 2026-10-27_

## Deployed state

| Component | Version in this folder | Deployed? |
|---|---|---|
| Engine (skill) | 2026-10-29 v5.1, hook rule 4.3a in Hook scoring (references/: content-frameworks.md copied at packaging, gold-reels.md canonical here) | Live: Brett installed v5.1 in claude.ai 2026-10-30 (claude.ai labels it v6, its own upload counter; 4.3a confirmed in SKILL.md). Local Code builds read engine/ directly |
| Factory show context | 2026-08-21 (worked examples removed) | Deployed; unchanged this cycle |
| SOP | Google Doc is canonical as of 2026-09-22 (decision below). sop/cutsheet-build-process.md is the pointer plus synced copy | v3 pasted to the Doc 2026-09-22, both tabs current |
| Code pipeline (this machine) | pipeline/ + .claude/skills/factory-cut-sheet | Ran by hand on Episode 4; first full skill run on Episode 5 (2026-10-05). Scheduled run not yet created |

## Decision log

**2026-09-22 (Episode 4 rebuild session):**
- Brett's cut sheet builds run in Claude Code on this machine (Plaud connector in, WhisperX timing, G: or _Outbox out). The claude.ai Factory project stays as the team's manual fallback. Reverses the 2026-08-21 "never in Cowork" rule; the reason was canonical ambiguity, and the OS folder plus change log resolves it.
- Gemini is dropped from Stage 1. Plaud's connector supplies text and speaker names; WhisperX (large-v2, GPU, about 5 min per episode) supplies word-level timing. Evidence: on E4, Gemini drifted 5 to 10 s through minutes 26 to 29 and jumped backwards four times; WhisperX had neither.
- Google Drive connector is out of the pipeline entirely. Files move by G: sync or _Outbox.
- The SOP's source of truth is the team Google Doc (Brett and the team edit it there). The OS folder stays canonical for the engine and show contexts only. sop/ keeps the Doc URL and a read-only synced copy.
- Cut sheets land in the episode's **Finished Reels** folder (matches the Asana template; the Doc's "Rough Cuts" wording is wrong and gets fixed).
- Alyza's line-by-line filler pass stays until two consecutive episodes need no rework after Brett's review; then it reduces to reel selection, hook check, editor's-call decisions.
- Brett reviews every cut sheet before it goes to Mark until output is consistent. Reviewing in Word with strikes (remove) and highlights (restore) is the reconcile signal; Claude reads the marks from the .docx.
- Approval flags are not applied to general lending or pricing advice in a host's own licensed field; the curator catches compliance concerns.
- Brett is the only Plaud account holder; Alyza will own the trigger later, so the human step must stay "upload the recording with the standard name," nothing more.

**2026-10-20 (E6, engine v5 approved by Brett):**
- The engine is cut-first: any word, clause, or passage may be struck as long as every join reads as natural speech and keeps Brett's meaning; scores rank the set and never gate it; the advisory review flags but never removes a reel; whole-line cuts are trims, editor's call only where the footage decides.
- Brett's own cuts are the standard (engine/references/gold-reels.md). A reel enters the gold file only when Brett marks it a keeper; an example he shares is an exercise until he says otherwise (his E6 Example #2 was reverted from the gold file on 2026-10-20).

**2026-08-24 and earlier:** see ARCHIVE section at the end of this file.

## Calibration (from Brett's Episode 4 review)

- 22 reels all labelled A/A+ is not reality. Scores must be earned and shown; A+ capped.
- Reels that end where the topic ends, not where the point lands, fall flat. Every reel carries a takeaway written from kept lines.
- Monologues are the failure mode on a three-host show; interaction is scored and weighted.
- A long "rant" with one claim and several supports is one thesis reel, compacted, not two or three partial reels. Brett would rather cut a 4.5-minute span to two minutes than have the pieces.
- Strike runs of struck lines are unreadable for editors; collapse them and put the full span transcript under each reel with kept lines in bold.
- Brett strikes line openers ("Well, so", "And then", "And so,") and mid-line redundancy ("with me", "again is what", "and all that") every time. He restores proof that carries a number or credential (15 years, since 2008, 20,000 sides) every time.
- Captions: he tightens to a parallel list ("how they behave, how they market, and how they spend their time").
- Keepers from v2: Danny's "walk away" and "Setting Expectations" reels. Killers: Pain-only reels (forever renters), stories buried in detail (Cardiff fixer, first cut).

## Calibration (from Brett's Episode 5 review, 2026-10-05)

- Brett called E5 the cleanest run and best output so far. Engine v3 with the blind judge (it demoted 3 of 15) needed light marks only.
- Repeats from E4 (engine rule holds): struck line openers ("And where", "Well, and what happens over time?").
- New, watch for a repeat on E6: he strikes trailing tags and qualifiers at the end of a line ("all over the place", "again", "at."), compresses a range to its endpoint ("grow from decent size to massive" to "grow massive"), and cuts a setup clause before a landing line.
- He removed a co-host's one-line question ("For these corporations?") even though it raised interaction; a backchannel question that adds nothing is not interaction.
- He added Danny's "win, win, win" line as the R12 opener: an affirming setup line before a numbers argument.
- Do Not Produce, flip margins (15% to 4%): too thin a thought for viewer value (Pain and Proof, no Plan), and the figures are unverified against what Brett sees across investor clients. Repeats E4's "Pain-only reels" killer. Proposed no-Plan rule (no Plan = B unless Takeaway 5): Brett chose to watch one more episode, decide after E6. Unverified market figures from a host: first occurrence, watch.
- Do Not Produce, lowball offers: no audience for the spam complaint, and it drifted into a second claim (good companies treat agents right). The judge had flagged it as close to two claims; Claude rewrote the takeaway instead of acting on the flag.

## Calibration (from Brett's Episode 6 review, 2026-10-20)

- Low-yield episode (Brett, in Asana: "we're going to get a low yield for this show"). Four sheet versions and two engine experiments went into it; Brett said it took a lot of time to turn a thin episode into something of value.
- He shipped V4 to the editing team and cut a handful of reels, especially those around 30 seconds: not strong enough to keep. Watch on E7: very short reels (under about 40 seconds of kept speech).
- His own cut ("I can't motivate anybody", 1:33, one compacted thesis) became gold reel 1. His AI Workforce exercise showed in-sentence joins and a result-first open work, but one three-minute piece was really two reels; V4 shipped it as two (about 1:28 and 1:58, the second opened on Danny's question).
- Monologues are not penalized (Hold), chest-thumping lines with no lesson stay out ("our competitors are not doing this"), and a conviction line stays ("motivation is core to who I've always been"). Repeat of E4/E5: line openers struck. No-Plan rule from E5: not adopted; v5 ranks instead of gating.

## Engine change log

- **2026-10-29, v5.1 hook rule (Brett's go: "Save 4.3A").** SKILL.md section 5 Hook scoring now cites content-frameworks.md 4.3a (core items 1 to 8, item 14 short-form video) beside 4.3. Rulebook saved the same day (4.3a subsection, section 1 step 2, the reel cut sheet and operator lesson map rows, 3.1 last bullet). Packaged to _Outbox/2026-10-29-reel-cut-sheet-v5.1.skill with the current rulebook (rebuilt the same day after Brett added the value levers, pattern templates, the swipe file start, and the reel narrative map row); awaiting Brett's install.
- **2026-10-20, v5 cut-first (Brett approved after E6).** SKILL.md rewritten: protects only verbatim words in order, real timecodes, the landing, and approval/rights; unlimited striking inside sentences with natural joins (cutaway tag at mid-sentence joins); every moment with a landing and a one-sentence takeaway is built; scores (Hook, 5P, Interaction or Hold, Takeaway) rank only, A+ strongest five at 17+, A 14+, B still built; advisory review flags joins, opens, out-points, second points, and looser-than-gold cuts, takes the lower total, never removes a reel; marks reduced to strike, trim, and rare editor's call; 60 to 100 s target, up to two minutes. New references/gold-reels.md (gold reel 1: Brett's E6 cut). factory-cut-sheet skill and pipeline/build_reels_from_rows.py updated to match (phrase strikes, '>>' to end of line, '#2:' later occurrence). Packaged to _Outbox/2026-10-20-reel-cut-sheet-v5.skill; supersedes the 2026-10-13 v4 package. v4 SKILL.md backed up in the session scratchpad only.
- **2026-10-05, v3.2 (Brett's go, E5 review).** SKILL.md section 11: a judge flag that a reel carries two claims is resolved by splitting or demoting, never by rewriting the takeaway (E5's lowball reel was rewritten instead and Brett cut it). Packaged to _Outbox/2026-10-05-reel-cut-sheet-v3.2.skill, which supersedes the v3.1 package; live on the claude.ai account (Brett; account copy matches engine/SKILL.md, verified 2026-10-07). Note: E5 was built on v3 (v3.1 landed mid-build), so v3.1 and v3.2 are first tested on E6.
- **2026-10-05, v3.1 (Brett's go, COO run).** SKILL.md section 4: 5P completeness rescored as interwoven concepts in any order (was an ordered sequence), per Brett's 2026-10-05 ruling in the CMO frameworks load; Hook scored against the seven headline components (adds unusual and ongoing; authority renamed celebrity and still covers credentials). Packaged to _Outbox/2026-10-05-reel-cut-sheet.skill; account skill replacement pending Brett. The Code pipeline reads engine/ directly, so local builds use it now. First test: the next Factory cut sheet.
- **2026-09-22, v3.** SKILL.md rewritten: four-dimension scoring (Hook, 5P completeness, Interaction, Takeaway) with tiers and an A+ cap; B candidates listed, not built; mandatory takeaway; landing rule for the out-point; interaction weighting from Show Context; thesis reel as a third shape with compaction; soft cuts (editor's call) as a third cut type; line-opener filler rule; proof-with-numbers kept rule; narrowed Approval rule; blind judge pass before formatting. build_cut_sheet_doc.py: UTF-8 read (Windows mojibake fix), Score column, Takeaway line, Ps in the identity line, soft-cut rendering, collapsed long trims, collapsed strike runs, per-reel full span transcript with kept lines bold, Candidates table. verify_cut_sheet.py: tab-separated transcript parsing (dialogue column only), soft cuts excluded from the hook check. Validated on The Factory Episode 4 (v6 signed off by Brett).
- **2026-08-21, verify build.** Added verify_cut_sheet.py. See archive.

## Pipeline (this machine)

`pipeline/align_transcript.py` pulls nothing itself; the session fetches the Plaud transcript and audio through the connector, then the script runs WhisperX and maps Plaud speakers onto the words. `pipeline/retime.py` replaces reel line timecodes with aligned ones (lines under four words keep transcript time; timeline forced monotonic). Requirements installed 2026-09-22: whisperx 3.8.6, torch 2.14 cu126, torchvision 0.29 cu126, torchaudio 2.11 cu126, ffmpeg via imageio-ffmpeg copied to ~/ffmpeg-bin. GPU: RTX 3050 8 GB.

## Change log

- **2026-10-27, align_transcript.py working folder (COO, Brett's go).** The script now reads plaud.json from the audio's folder and writes words.json, aligned.txt, and aligned_full.tsv there (was the script's own folder); it stops with a message if plaud.json is missing. factory-cut-sheet SKILL.md step 2 updated; copying the script into e<N>/ is no longer needed. Compile and path check passed; first full WhisperX run on the next episode.

- **2026-10-13, v4 rulebook refresh (session audit, Brett's go).** No engine change. content-frameworks.md changed in sections 2, 3.1, 4.4, 4.5, and 8.1 (none the engine scores on), so the package was rebuilt with the current rulebook per the same-day rule: _Outbox/2026-10-13-reel-cut-sheet.skill, supersedes 2026-10-09. Account replacement pending Brett.

- **2026-10-09, v4 (COO run 4, Brett's go).** Engine section 4 Hook and 5P and the section 10 caption field now cite 00_Resources/content-frameworks.md (4.3, 5, 9) instead of inline copies; Celebrity now includes a recognizable industry figure. Package bundles the rulebook as references/content-frameworks.md. factory-cut-sheet reads those sections and passes 4.3 and 5 to the judge.

## Deployment record (2026-09-22)

- Team Doc: tab 1 replaced with SOP v3 (typed via Docs with Enable Markdown on; headings, bold, lists intact, verified by export). Tab 2: three "Rough Cuts Folder" references changed to "Finished Reels Folder". One stray empty bullet at the end of tab 1, cosmetic.
- Asana: E4 "Cut & Edit Factory Ep 4 Reels" description rewritten (Plaud upload, Code build, Claude places the sheet in Finished Reels, EDITOR'S CALL note for Alyza). Elizabeth tagged in two comments to carry it into the project template.
- Drive: My Drive/Claude created with Docs, Logs, Cut Sheet Inputs; 45 Claude-created files moved out of the root (logs and audits to Logs, working docs and sheets to Docs, the two Factory transcripts to Cut Sheet Inputs). Nothing deleted.
- Skill package: _Outbox/2026-09-22-reel-cut-sheet.skill, installed by Brett 2026-09-22.
- Drive rule added to root CLAUDE.md: Claude-created files go under My Drive/Claude (Docs, Logs, Apps Script, Cut Sheet Inputs).

## Open items

1. Asana project template NOT updated as of 2026-10-05: the Episode 5 task ("Cut & Edit Factory Ep 5 Reels", The Factory 10/01/26, created 2026-09-29) carries the old text. Deliberate per Brett 2026-10-05: the team is finishing DLJ first; leave the task and template alone until he says. Elizabeth was tagged twice on the E4 task 2026-09-22.
2. Scheduled run (Plaud recording named per convention, cut sheet into Finished Reels, Asana status). E5 manual build done 2026-10-05 (15 built, judge demoted 3, Brett's review cut 2 more: 10 final). Final in _Outbox awaiting the Ep 5 Finished Reels folder on G:. Plaud name was "Factory Ep 5", not the convention, and no Ep 5 folder exists in RTM Factory on G: yet. E6 (2026-10-19 to 10-20): four versions; Brett shipped V4 to the editing team himself (Factory - Ep 6 - 10 15 26 folder) and completed the Create Cut Sheet subtask. Plaud diarization swapped Brett and Danny on E6; confirm speakers by content every run.
3. Engine backlog: caption style rule (parallel list) if Brett tightens a caption the same way again; judge as a scripted second agent in claude.ai is not possible, single-thread fallback only.

## ARCHIVE (pre-2026-09-22)

**2026-08-24:** Episode 3 test build passed clean on the verify engine. Plaud destination folder: Media. SOP v2 written and deployed. Stage 1 simplified to a Gemini tab-separated .txt.
**2026-08-21 (system audit):** skill is the single source of truth for structure; worked examples removed from show projects; backlog output out of scope; verbatim enforced by script; Plaud naming \<Show\>-E\<##\>-\<YYYY-MM-DD\>; this folder created as source, claude.ai as deployment.
**2026-08-11:** cut sheets run through claude.ai show projects; deliverable is a landscape .docx; .xlsx retired.
**Engine 2026-08-21, verify build:** verify_cut_sheet.py added; trims verbatim in full; hook-line warning. **Pre-2026-08-21:** baseline docx engine.
