# Editor seeded set, run 7 (2026-11-03): worker review, grades as returned (condensed)

Key in key.md. Seeds 1 to 5 rebuilt on control v5 (2026-10-06 draft-m), one seed each (diff checked); seed 6 is the 2026-10-06 draft-n. draft-v is a real piece: reel narrative 9 caption v2, editor PASS 2026-10-29, rejected by Brett the same day as forced. Each graded blind under its neutral ID, editor on sonnet (claude-sonnet-5-5); draft-p and draft-v also on opus (model override). Tokens and time from each Agent result.

| Draft | Seed | Model | Grade | Fixes | Seed caught | Could not check | Tokens | Seconds |
|---|---|---|---|---|---|---|---|---|
| o | 3 revenue share | sonnet | FIX | 7 | Yes, item 5, quoted | Tom Ferry benchmark figures | 51,768 | 38 |
| p | control v5 | sonnet | FIX | 5 | n/a | none | 58,139 | 44 |
| q | 5 unsourced 1,100 | sonnet | FIX | 6 | Yes, item 7, quoted, also under Could not check | 1,100; "almost every one"; benchmark | 56,443 | 55 |
| r | 1 em dash | sonnet | FIX | 4 | Yes, item 2, quoted | benchmark | 55,792 | 38 |
| s | 6 three promised, one delivered | sonnet | FIX | 6 | Yes, item 10 (4.3a, 4.5, 4.6), quoted | benchmark | 58,129 | 53 |
| t | 2 fifteen years | sonnet | FIX | 4 | Yes, item 4, quoted | benchmark | 54,484 | 34 |
| u | 4 persona conflation | sonnet | FIX | 6 | Yes, item 6 plus item 5, quoted | benchmark | 48,100 | 27 |
| v | real piece | sonnet | FIX | 5 | Brett's 10/29 objection caught: answers slotted into beats (cites the map row and his rejection) | none | 61,029 | 69 |
| p | control v5 | opus | FIX | 3 | n/a | benchmark | 55,369 | 45 |
| v | real piece | opus | FIX | 6 | Same objection caught; adds hook components, newsletter overstated, persona | none | 57,573 | 70 |

## Control v5 fixes (sonnet), each checked against the current rule
1. Contractions: voice-principles.md line 18, "Always use contractions" (rebuild 2026-10-13). Fair.
2. Paragraph layout: content-frameworks.md section 7 item 9, one or two sentences (Brett, 2026-10-29). Fair.
3. No bold: voice-principles.md Formatting Defaults, keep bold in the draft (Brett, 2026-10-19). Fair.
4. Footer lacks 4.3a lane, pattern, awareness, meat (4.3a, 2026-10-28). Fair.
5. Footer names no 4.2 topic category (section 7 item 1). Fair, minor.
Opus raised 1, 2, 4 and missed 3 and 5. No false fix on either model; control v5 predates four rules and is no longer clean.

## draft-v (real piece)
Sonnet: length 82 vs the row's 20 to 60; Q3, Q2, Q1 slotted into beats, which Brett rejected as forced; Q1 referent changed to past clients; walk-away question never asked; footer names 4.5. Opus: length; several points and slotted beats; line 1 has one component; newsletter line overstates Q2; landing line scope and walk-away; persona mismatch. The forced-beats rule entered the map row on 2026-10-30, after the 10/29 PASS.

# Run 8 (2026-11-03): control v6 and seeds rebuilt on it, editor on sonnet

Control v6 (control-v6.md, draft-w) brings v5 up to the current rules: contractions, one or two sentences per paragraph, bold on the turn and close, a new hook (line 1 Call Out, line 2 value) with the 4.3a line in the footer, and a 4.2 category. Brett's trust words kept ("standard", "they trust"). Seeds in v6/, key in v6/key.md.

| Draft | Seed | Grade | Fixes | Seed caught | Spillover onto control lines | Tokens | Seconds |
|---|---|---|---|---|---|---|---|
| w | control v6 | PASS | 0 | n/a | n/a | 56,561 | 49 |
| aa | 3 revenue share | FIX | 3 | Yes, item 5 | none | 56,315 | 45 |
| bb | 1 em dash | FIX | 4 | Yes, item 2 | 3 ("Post for them" command, "standard" sentence, one idea) | 56,534 | 47 |
| cc | 6 three promised | FIX | 5 | Yes, item 10 (4.3a, 4.5, 4.6) | none (fixes 3 and 4 follow from the seeded line) | 60,498 | 77 |
| dd | 2 fifteen years | FIX | 1 | Yes, item 4 | none | 54,664 | 36 |
| ee | 5 unsourced 1,100 | FIX | 2 | Yes, item 7 and Could not check | 1 ("Post for them" command) | 56,293 | 46 |
| ff | 4 persona conflation | FIX | 6 | Yes, items 5 and 6 | 1 ("standard" sentence) | 55,893 | 40 |

Control clean, six of six caught. Open for the next rerun: two control lines draw fixes in seeded runs that the control run passed ("Post for them, and you're the agent they call when they are." as a command; "overdeliver on everything, and make that my standard." against Brett's gerund wording). Revise both in control v7 before run 9.
