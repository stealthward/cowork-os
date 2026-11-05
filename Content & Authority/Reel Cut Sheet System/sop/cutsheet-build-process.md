# Cutsheet Build Process (pointer and synced copy)

Canonical: the "Cutsheet Build Process" Google Doc, https://docs.google.com/document/d/1Ub0gwOFtPv3h0ChX_pRS4gk_v4k_6gqkcPWeDoEImGo/edit
Edit it there. This file is a read-only copy for Claude to read; refresh it from the Doc at the start of any session that touches the process.
Version below: v3 (2026-09-22) with the engine v5 edits of 2026-10-20 (all 9 approved line changes). STATUS: synced 2026-10-20 from the Doc. Refresh from the Doc before relying on it.

---- SYNCED COPY BELOW (tab 1: Reel Cutsheet SOP) ----

# Reel Cutsheet SOP

Engine v5 (cut-first), 2026-10-20.

Turns a recorded episode into an editor-ready reel cut sheet. Three stages.

## The deliverable

One landscape Word document (.docx), saved to the episode's **Finished Reels** folder:

- **Contents page**: one row per reel with priority, score out of 20, category, speakers, and length, linked to its section.
- **One section per reel**: concept, takeaway, hook, thumbnail, caption, notes, the timecoded script, then the full word-for-word transcript of that reel's span with the kept lines in bold.
- **Ranking**: reels are listed strongest first; B reels are still built and sit at the bottom.
- **Candidates not built**: moments that never reached a landing, one line each with the reason.

Reading the script:

| Mark | Means |
|---|---|
| Black text | Keep. |
| Grey strikethrough inside a line | Words to drop, from filler to a whole clause. Keep the rest. A green 'cutaway' tag marks a mid-sentence join that needs b-roll or a reaction shot. |
| Whole line struck, tagged EDITOR'S CALL | The editor decides. Reason given. The reel plays without it. Used only when the footage decides it, such as a laugh or a reaction. |
| Red TRIM block | Passage removed. Backchannel, tangent, dead air, or everything between two pieces of a compacted reel. |
| "N lines struck" | A run of cuts collapsed into one line. The full text is in the transcript block under the script. |
| Green tag | Editing direction. Take it or leave it. |
| Score H/P/I/T | Hook, 5P completeness, Interaction (Hold for a single-speaker reel: strong start to finish), Takeaway, each out of 5. Scores rank the reels; they do not decide what gets built. |

## Stage 1: Upload the recording (Brett)

1. Export the MP3 from the video file, or use the Plaud recording from the shoot.
2. In Plaud: import, generate the transcript with the **Podcast Episode Summarization** template, identify the speakers by name.
3. Rename: **Factory E\<N\> \<YYYY-MM-DD\>** (recording date). Example: **Factory E4 2026-09-17**.
4. Move it to the **Media** folder.

That is the whole stage. No Gemini, no transcript export, no download.

## Stage 2: Build the cut sheet (Brett, Claude Code)

1. Open Claude Code in the Cowork OS and say: **"Cut sheet for Factory episode \<N\>."**
2. Claude pulls the audio and transcript from Plaud, times it locally, cuts each reel to its point and ranks the set, verifies every line against the transcript, runs a review against the gold reels (Brett's saved example cuts; nothing new needed each episode), and sends the .docx. About 15 to 25 minutes.
3. The report must state **VERBATIM CHECK PASSED** and what the review flagged and fixed. If either is missing, reply: *Run the verification and the review pass and report both before delivering.*
4. Review in Word: **strike through** anything to remove (words or whole lines); **highlight** anything in the transcript block to bring back. Close the file and tell Claude "done."
5. Claude applies the marks, re-verifies, and sends the final version. Claude places it in the episode's **Finished Reels** folder.
6. Change the Asana Editing Status to **Review Cut Sheet**.

### Team fallback (claude.ai)

If Brett is unavailable, the same engine runs in the **Factory project** in claude.ai from a transcript file:

1. Get a transcript as a tab-separated .txt (Timestamp, Speaker, Dialogue; one sentence per row). Plaud's SRT export converted, or any sentence-level transcript.
2. New chat in the Factory project, attach the transcript, paste: *Using the engine instructions and the Factory Show Context, build the reel cut sheet from the attached transcript.*
3. The build must state VERBATIM CHECK PASSED and the review result. Download the .docx to Finished Reels. Never move it through a Google Drive connector.

## Stage 3: Review and hand off

The Reels Editing SOP (next tab) takes over at Mark's review. Until output is consistent, Brett's Word review in Stage 2 comes first and Alyza's curating pass stays as written.

## Appendix: Show Context template (new shows only)

One block per show, stored in that show's project instructions alongside the skill. Facts only: no build instructions, no example reels. Blank field = engine default.

> [SHOW NAME] Show Context
>
> - Hosts / participants: [names + one-line role each]
> - Authority domains: [what each host is credible on]
> - Audience(s): [who it serves; for multi-host, which host serves whom]
> - Optimization target: [credibility | authority | reach | education | lead-gen]
> - Host priority: [whose authority the content serves, or "none"]
> - Guardrails: [per-person off-limits topics, claim limits, sensitivities]
> - Capture: [multicam with per-person ISOs | single-cam]
> - Segment structure / theme: [defined segments or throughline, or "continuous"; say if the contrast between hosts is the show]

---- tab 2: Reels Editing SOP (unchanged except folder names: "Rough Cuts Folder" becomes "Finished Reels Folder" in Stages 1, 2, and 3) ----
