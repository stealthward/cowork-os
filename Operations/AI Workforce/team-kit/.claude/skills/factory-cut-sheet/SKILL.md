---
name: factory-cut-sheet
description: "Build a Factory episode reel cut sheet end to end on this machine: pull the recording and transcript from Plaud through the connector, time it locally with WhisperX, author reels under the reel-cut-sheet engine, verify, run the blind judge, format the landscape .docx, and deliver it. Use when the user says 'cut sheet for Factory episode N', 'build the E5 cut sheet', 'run the cut sheet pipeline', or names a Plaud recording. Also the entry point for the scheduled run."
---

# Factory cut sheet (Code pipeline)

_Shared Core (team kit copy, scrubbed 2026-10-30)._

The engine is `Content & Authority/Reel Cut Sheet System/engine/SKILL.md`. Read it in full first; it governs selection, cutting, scoring, output, and the advisory review. This skill only wires the inputs and outputs around it on this machine. Show facts come from `Content & Authority/Reel Cut Sheet System/show-contexts/factory.md` (everything below the PASTE marker). The content rules the engine cites (Hook 4.3, 5P section 5, captions section 9) come from `00_Resources/content-frameworks.md`; read those sections with the engine, plus the gold reels in `engine/references/gold-reels.md` (Brett's own cuts, the standard to cut to).

Working folder: the session scratchpad, one subfolder per episode (`e<N>/`). Nothing per-episode is stored in the OS.

## 1. Inputs from Plaud (connector, no downloads by hand)

1. `list_files` with query "Factory" and find the recording named `Factory E<N> <YYYY-MM-DD>` (or the closest match; confirm with the user if two candidates).
2. `get_file` for the recording. The result is large and lands in a tool-results file; extract `presigned_url` from it with grep and `curl -L` the MP3 to `e<N>/episode.mp3`. The link expires in one hour; re-fetch if needed.
3. `get_transcript` with `limit` 500. Save the `segments` array as `e<N>/plaud.json` (fields: start_time, end_time in ms, speaker, content). Confirm the three speaker names are real names, not "Speaker 1".

## 2. Timing (WhisperX, local GPU)

```
python "<OS>/Content & Authority/Reel Cut Sheet System/pipeline/align_transcript.py" large-v2 e<N>/episode.mp3
```
Run it from any folder: it reads `plaud.json` beside the audio and writes `words.json`, `aligned.txt`, `aligned_full.tsv` into the audio's folder (`e<N>/`). No need to copy the script. About five minutes on a CUDA GPU (check the machine has one before the first run). Run it in the background and author reels while it runs. If CUDA reports false, stop and tell the user; do not fall back to CPU silently.

The authoring transcript is `aligned.txt` (Timestamp / Speaker / Dialogue, one sentence per row) unless the user supplies a different transcript file; whichever file the reels are authored from is the file the verifier runs against.

## 3. Author, verify, judge, format

Follow the engine exactly. Author rows by transcript line number using `pipeline/build_reels_from_rows.py` as the pattern (strikes inside a line by exact phrase, `>>phrase` to strike to the end of the line, `#2:phrase` for a later occurrence; it checks every row against the transcript before the verifier runs), write reels to disk as you go, then:

```
python "<engine>/verify_cut_sheet.py" reels.json aligned.txt
python "<pipeline>/retime.py"            # only when authored from a non-WhisperX transcript
```

Advisory review (engine section 11): spawn a general-purpose subagent with only the engine's sections 3 to 6 and 11, `engine/references/gold-reels.md`, content-frameworks.md sections 4.3 and 5, the Factory show context, and a packet of each reel's kept words (struck text removed), hook line, and takeaway (no scores, no concepts). It returns scores and flags as JSON. Fix the flags by cutting, take the lower total, never remove a reel, re-verify, then:

```
python "<engine>/build_cut_sheet_doc.py" reels.json "The-Factory-E<N>-Reel-Cut-Sheet.docx"
```

## 4. Deliver

- Copy the .docx to `_Outbox/<YYYY-MM-DD>-The-Factory-E<N>-Reel-Cut-Sheet.docx` and send it with SendUserFile for the reviewer. After his marks are applied, write the final as `The-Factory-E<N>-Reel-Cut-Sheet.docx` into the episode's Finished Reels folder through the machine's synced Drive path (set at install): `<synced Drive>\RTM Factory\Factory - Ep <N> - <M D YY>\Finished Reels\` (Drive names use spaces where the web shows slashes; list the RTM Factory folder to get the exact episode folder name). If the path is missing, the shortcut has not synced; say so and leave the file in _Outbox.
- Never push the file through a Google Drive connector.
- Report: reel count by tier, candidates listed, judge demotions and fixes, verbatim result, Approval and Rights flags, transcription errors noted for the editor.
- Do not change the Asana Editing Status; the reviewer flips it after review.

## 5. The reviewer's review marks

When the reviewer returns a marked-up .docx: strikethrough on black or blue runs means remove (apply as `~~tildes~~` or a soft cut), highlight in the full-transcript block means restore. Read the marks with python-docx, apply, re-verify, rebuild, and add what he changed to the calibration section of the system MEMORY.md. Change the engine only when a mark repeats across episodes.


## Usage log

Before returning, append one line to `Operations/AI Workforce/logs/usage-log.md`: `YYYY-MM-DD | factory-cut-sheet | model that ran | one-line summary`. The systems registry page reads this to show when the skill last ran.
