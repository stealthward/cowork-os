---
name: reel-cut-sheet
description: "Build editor-ready short-form reel cut sheets from long-form podcast or interview transcripts, delivered as a single landscape Word document. Use whenever the user wants to turn a transcript, episode, or recording into short-form clips, reels, shorts, or an editor cut sheet: finding the strongest moments, compressing each one to its point by striking words, clauses, and passages, writing the hook, takeaway, thumbnail, caption, and sparse edit direction, and ranking the set. Trigger even when the user only says 'make reels from this transcript' or 'build a cut sheet' without naming the format."
---


# Reel Cut Sheet Engine

You turn a long-form transcript into an editor-ready cut sheet: one Word document with a contents page and one section per reel, ranked. You do the editorial work: find the moments, cut each one down to its point, and write the direction. A formatter script lays out the document.

**Workflow:** read these instructions, the Show Context, and the gold reels (references/gold-reels.md). Find every moment that makes a point. Cut each one down. Write the reels to `reels.json`, verify, run the advisory review, then format:

```
python verify_cut_sheet.py reels.json <transcript file>
python build_cut_sheet_doc.py reels.json "<Show>-E<Episode>-Reel-Cut-Sheet.docx"
```

The verifier is mandatory. It checks every line, struck words included, word for word against the transcript. Fix every flagged line by re-copying it from the transcript and re-run until it prints VERBATIM CHECK PASSED.

Deliver the `.docx` as a download. Never push it through a Google Drive connector.

## 1. Purpose

Turn long-form moments into short reels that make one point a viewer can repeat or act on. The model of the job is an editor with a red pen: keep the speaker's own words, strike everything that does not carry the point, and make every join sound like natural speech. Quality leads; count follows. When in doubt, build the reel and let the ranking and Brett's review decide.

## 2. Show Context (project-supplied)

The project supplies a Show Context block: show name and episode, hosts, authority domains, audiences, optimization target, host priority, guardrails, capture, and segment structure. Use it to choose and rank moments. A named off-limits topic is a don't-build. When a field is missing, use the neutral default and keep going.

## 3. What protects the reel (non-negotiable)

- **Your words only.** Every kept word is the speaker's own, in the order spoken. Never add, swap, reorder, or smooth a word. Striking is unlimited: any word, clause, sentence, or passage can be struck. A transcription error stays as written, and the note tells the editor what the audio says.
- **Real timecodes.** Every line carries its real start and end from the transcript.
- **End on the landing.** The out-point is where the point lands, not where the topic ends. Trim a late entrant who does not land it and a payoff that restates one already landed.
- **Approval and rights** (Section 9).

## 4. Find and cut

Sweep the whole transcript and list every distinct moment that makes a point. A moment qualifies when it has a landing and you can write its takeaway in one sentence (Section 6). Build every one that qualifies. Do not build a moment the show owner has ruled out, and do not build self-praise with no lesson in it ("our competitors are not doing this").

**Cut first, then score.** For each moment:
- **Open on the line that starts the thought**, often a co-host's question. Strike the question's warm-up and keep only the part that sets up the answer.
- **Compress inside sentences.** Strike clauses, restatements, second examples, lists that run past three items, hedges, and setup that the next line makes obvious. Joining the front of one sentence to the back of another is allowed when the result is one natural spoken sentence ("with a team that you have to keep motivated").
- **Keep proof.** A number, a date, a credential, or a transaction count stays.
- **Keep conviction.** A speaker stating what he believes ("motivation is core to who I've always been") is not chest-thumping; self-praise with no lesson is.
- **Every join must read as natural speech.** Read the kept words aloud. If a join leaves a broken sentence ("people that have their own dial goes up to a ten"), restore a few words or move the join. Put `dir: "cutaway to cover the jump"` on any line where a join falls mid-sentence.
- **One point per reel.** Supports under one point are one reel. A thesis can be compacted from several minutes of transcript into one run; when neighboring moments make the same point, build one reel, not pieces.
- **Target 60 to 100 seconds of kept speech.** Up to two minutes when the point needs it.

The gold reels file shows the standard. Cut to it.

## 5. Score and rank (advisory)

Score every built reel 1 to 5 on four dimensions, against 00_Resources/content-frameworks.md (shipped as references/content-frameworks.md):
- **Hook:** the strongest kept line against the seven headline components in section 4.3 and the hook rule in section 4.3a (core items 1 to 8, and item 14 for short-form video: the first three seconds carry the hook, and the caption's first line, the thumbnail, and those seconds say one thing).
- **5P:** how many of Proof, Pain, Promise, Plan, Picture the kept lines carry clearly (section 5). Name them in `ps_present` and the dominant one as `concept_category`.
- **Third dimension, by shape.** A reel with more than one real voice scores **Interaction** (5 = a question or pushback that changes the answer; 1 = a co-host only nods). A single-speaker reel scores **Hold** (5 = strong start to finish, every kept line moves the point; 1 = meanders). A monologue is never penalized for being a monologue.
- **Takeaway:** 5 = the viewer can repeat it in one sentence and act on it or feel it.

Scores rank the set; they do not gate it. Priority is the tier label: A+ is the strongest five at 17 or higher, A is 14 or higher, and anything lower is still built and labelled B, at the bottom of the contents. Candidates are only moments you could not cut to a landing; list each with the reason.

## 6. Takeaway

One sentence in plain words that the viewer leaves with, written from the kept lines. Read the kept lines alone: if the sentence is not in there, the out-point is wrong.

## 7. Marks on the sheet

Two marks, plus a rare third:
- **Strike** (`~~tildes~~`) inside a line: any word or clause the editor drops. The words stay on the sheet, grey and struck.
- **Trim** (`"trim": true` with a short reason): a whole passage removed in position (backchannel, crosstalk, a tangent, everything between two pieces of a compacted thesis). Consecutive trimmed lines merge into one red block. Carry the full verbatim text; never abbreviate with "...".
- **Editor's call** (`"soft": true` with a reason): use only when the footage could genuinely decide it, such as a laugh or a reaction shot. Not for every doubtful line.

## 8. Edit direction

Sparse, at the end of the line it applies to: a cutback to a reacting host, a b-roll overlay, an on-screen number or list, an emphasis, a pacing beat, a punch-in, and a cutaway at every mid-sentence join. Most lines carry none.

## 9. Approval, risk, rights

- Add ` - Approval Needed` to Priority for personal grief, private or client details, a live or identifiable transaction, a minor, a legal claim about a named or identifiable person or company, a brand partnership or a host promoting his own business, and any guardrail in the Show Context. Build it and start the note with "Approval".
- A passing mention of a brand, platform, or product is a rights note (generic b-roll), starting with "Rights".
- A moment that puts an identifiable non-participant in an unfavorable light is not built unless the identifying words can be struck.

## 10. Output

Write reels to `reels.json` as you go, two at a time; never print reel content into chat. Do not build other tooling or your own formatter.

**JSON shape.** Top level: `show`, `episode`, `reels`, `candidates`. Each reel: `reel_id`, `priority`, `scores` (`hook`, `five_p`, `interaction`, `takeaway`, `total`), `ps_present`, `concept_category`, `final_reel_concept`, `takeaway`, `primary_speaker`, `secondary_speakers`, `primary_start`, `primary_end`, `hook_line` (copied from kept words), `thumbnail_text` (4 to 7 words), `caption` (content-frameworks.md section 9), `notes` (audience first; say "Hold" when the third score is Hold; "Approval" or "Rights" flags), optional `b_roll_direction`, and `lines`. Each line: `start`, `end`, `speaker`, `text` (verbatim, strikes in tildes), optional `dir`, `trim` with `trim_reason`, or `soft` with `soft_reason`. Each candidate: `id`, `start`, `end`, `concept`, `scores`, `why_not`.

## 11. Advisory review

After the verifier passes, a reviewer who has not seen your reasoning reads each reel's kept words, hook, and takeaway (a separate agent where subagents exist; otherwise a fresh read with scores hidden). It flags: a broken join, a slow open, an out-point past the landing, a second point, a takeaway the kept lines do not support, and a lower score where it disagrees. You fix the flags by cutting, never by rewriting the takeaway, and you take the lower of the two totals. The review never removes a reel; removing a reel is the show owner's call in review. Record what it flagged and what you fixed.

## 12. QC before delivering

- The verifier passed on the final `reels.json`; the review ran and its flags are fixed or noted.
- Read every reel's kept words aloud: one point, natural joins, ends on the landing, inside the length target.
- The set is ranked honestly; A+ is capped at five.
- Approval, rights, and transcription errors are in Notes.
