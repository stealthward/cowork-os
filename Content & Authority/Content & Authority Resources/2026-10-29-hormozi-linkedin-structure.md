# How Alex Hormozi builds a LinkedIn post: structure study

_Personal Layer. Research-sidekick, 2026-10-29, for Brett. Purpose: see how Alex actually builds a post, especially one posted with video, before the next round of reel captions is written._

## Header: data, method, limits

**Data.** 100 recent posts each from Alex Hormozi, Leila Hormozi, and Dan Martell (Alex and Leila 2026-09-10 to 2026-10-29, Dan 2026-09-10 to 2026-10-29), pulled with Apify on 2026-10-29. Source file: `C:\Users\brett\AppData\Local\Temp\claude\C--Users-brett--claude-spares-spare-X8mrNO\ba7241b3-b6c2-42cf-bebf-4954fb1b3004\scratchpad\hormozi-martell-posts.md`. Each post carries date, media type, caption word count, ratio to that author's median engagement (reactions plus comments plus shares), and URL. Alex's median is 3,215, Leila's 971, Dan's 744.

**Method.** Read all 300 captions. Tallied by hand (no code execution was available in this session), so counts are exact where the numbers are small and marked "about" where they depended on a judgment call. Structure names are mine. Percentages for Alex's structures are shares of his 55 posts that have caption text; the other 45 posts have no caption at all. I opened two post URLs.

**Limits, read these first.**
1. **The biggest finding is a data limit.** 45 of Alex's 100 posts are images with zero caption text. The LinkedIn URL slugs for those posts contain no words (just "activity-" and an ID), which fits a truly empty caption, not a dropped one. The content sits in the image (a quote card or graphic), which this data does not contain. The page fetch of the #1 post (ratio 5.90) returned only counts (17,103 reactions, 852 comments) and a login wall, not the image. So Alex's best-performing format cannot be studied line by line from this data.
2. Only 55 Alex posts have caption text: 35 video, 16 image with text, 4 text-only. The video structures below rest on 35 captions.
3. I never saw a video. Statements about what a caption does relative to its video are inferred from the caption wording and the URL slug, not from watching the clip. One fetched video post (#35) showed no video content.
4. Ratio is relative to the author's own median. It says what beat his usual, not what beats Dan's or Leila's. Reach, audience size, and LinkedIn's image or video treatment all feed engagement; this study cannot separate caption quality from format.
5. I did not read the existing `linkedin-hook-swipe-file.md` or `content-calibration.md` in this folder, so this file does not reconcile with them.
6. Quotes are short fragments. URLs are in the source file by post number (Alex #N).

---

## 1. Anatomy of Alex's posts

### What the 100 posts are

| Type | Posts | With caption text | Median ratio |
|---|---|---|---|
| Image | 61 | 16 | caption-less images mostly above 1.0 (40 of 45 at 1.0 or higher); captioned images about 0.61 |
| Video | 35 | 35 | about 0.60 (range 0.23 to 1.40) |
| Text only | 4 | 4 | about 0.54 |

**Top 22 posts by ratio are all caption-less images.** The first post with any text is #23 (rank 23, ratio 1.77). No video ranks above #35 (ratio 1.40). Alex's engagement is driven by the image format, and the caption barely appears in his best work.

### Five recurring caption structures (55 captioned posts)

| # | Name | Share of captioned posts | What it is | Short quote |
|---|---|---|---|---|
| S1 | One-line thesis | 15 of 55, 27% | A single claim, one or two lines, no setup, no ending. Reads like the line he says in the video. | "The best way to retain a customer is to sell them something else." (#56) |
| S2 | Label headline | 11 of 55, 20% | Names the topic or promises a payoff and says nothing else. Usually video. Sometimes ends in an emoji. | "10 years of business advice in 60 seconds" (#55) |
| S3 | Conditional setup plus payoff | 9 of 55, 16% | "If you [situation]..." then one to three lines of payoff. | "If you want your team and employees to deliver results, instead of telling them what to do..." then "Create a persona of who they should become." (#67) |
| S4 | Stacked lines with a kicker | 10 of 55, 18% | A thesis, two to four short follow-up lines that escalate or explain, a last line that lands. Sometimes signed "- Alex". 20 to 125 words. | "Anything you start, you will suck at first. / You will be embarrassed. / But you will survive." (#71) |
| S5 | Numbered list | 10 of 55, 18% | A one-line setup, three to nine numbered items, an optional closing line. | "Beating 99% of people is simple but not easy." then nine items (#43) |

Hand counts; a few posts fit two structures and I placed each in the closest one. Posts: S1 are #52, 56, 58, 60, 64, 66, 69, 75, 76, 77, 82, 85, 86, 97, 26. S2 are #35, 45, 46, 55, 59, 78, 79, 89, 90, 98, 99. S3 are #63, 67, 68, 70, 84, 91, 92, 93, 100. S4 are #40, 54, 62, 65, 71, 72, 74, 87, 88, 95. S5 are #23, 27, 43, 49, 50, 61, 73, 80, 81, 94.

### Line by line

- **Line 1 opens with the claim or the situation, never with a greeting, context, or a question.** Examples: "Most people don't change." (#62), "Hard times at work don't last forever." (#74), "Fear only exists in the vague, not the specific." (#95). The exceptions are the S2 labels ("How to give feedback without burning bridges") and the S3 conditionals.
- **Line 2 either finishes the idea or flips it.** In S4 it is the escalation ("You will be embarrassed.") or the specific ("They live the same 8-12 months of their lives many times in a row.", #62). In S3 it is the payoff after the "If" clause. In S5 it is item 1.
- **Movement is steady and short.** Each line adds one thing. Almost no connective words ("Furthermore", "So", "Because" are rare in the short posts).
- **Endings land on a short, final sentence and stop.** Examples: "Just win." (#26, #61), "Then you will realize that looking like a fool lasts a moment, being one that never started lasts a lifetime." (#71), "That thing you're stressed about at work doesn't matter." (#87). 6 of 55 close with a signature, "- Alex" or "- alex" (about 11%), always on the reflective text-first posts (#27, 65, 66, 87, 88, 95).
- **No hashtags seen in any of his 55 captions. No calls to action** except: #43 ends "What would you add to this list?", #70 ends "Try it and let me know.", #99 announces a YouTube finale, and #49 lists his own book among 13. That is 4 of 55 with any ask or plug.

### Top 20 versus bottom 20 by ratio

| | Top 20 (#1 to 20) | Bottom 20 (#81 to 100) |
|---|---|---|
| Media | 20 images, all with zero caption | 11 video, 7 image (2 with no caption, 5 with text), 2 text |
| Caption text | none | all but two have caption text |
| What it says | n/a (the content is in the image) | Mostly S2 labels and S1 theses attached to video; a few lists |
| Ratio range | 5.90 down to 1.89 | 0.52 down to 0.23 |

Takeaway: in this sample, the caption is not what separates his best posts from his worst. The format is. Among posts that do have a caption, the highest ratios are short numbered lists (#23, 1.77; #27, 1.69), a three-word-ish victory line (#26, 1.75), and the story teaser on video #35 (1.40). The lowest are long numbered pieces (#94, 171 words, 0.29), announcements (#99), and how-to labels on video (#98, #90, #89).

---

## 2. Video posts specifically

35 Alex video captions. **Median length 16 words.** 21 of 35 are 19 words or fewer (60%). Only 5 are 50 words or more (#49 at 90, #50 at 53, #70 at 55, #80 at 74, #73 at 173).

### What the caption does relative to the video

Inferred from wording, not from watching the clips.

| Structure | Share of 35 video captions | What it does relative to the video | Examples |
|---|---|---|---|
| V1. Label (names the topic, promises a payoff) | 11, 31% | **Tease.** Says what the clip is about, gives nothing away. Often with an emoji. | "Secret habit to become a morning person and waking up at 4 AM" (#78); "Eminem Created a Genius SALES HACK" (#45) |
| V2. Stated thesis | 10, 29% | **Restate.** The caption is the clip's takeaway as a single sentence, which reads like the line he says on camera. | "As we progress, our problems don't get easier, we just have more resources to solve them." (#58); "Focus + Discipline + Time = Wealth" (#97) |
| V3. Conditional setup plus payoff | 5, 14% | **Restate, with a reader to point at.** Names who the clip is for, then gives the one-line conclusion. | "If you want to be exceptional, then you often have to be the exception." (#69); "Use this to sell more expensive ticket items." then "No matter how rich someone is, 'expensive' always means expensive." (#92) |
| V4. Headline plus short payoff | 5, 14% | **Tease plus restate.** A topic line, then two or three lines that give the point. | "How to give feedback without burning bridges." then "Failure is feedback, not judgment." (#93); "Blame shows you who is steering your life." with four more lines (#65) |
| V5. List in the caption | 4, 11% | **Add.** The list is the content; the video is the talk about it. | 13 business books (#49); four ways to change behavior (#50); the quit-your-job list (#73) |

(Counts add to 35: V1 11 + V2 10 + V3 5 + V4 5 + V5 4.)

### Does the caption ask a question? No.

Of 35 Alex video captions, none ends in a question the viewer is asked to answer. Question marks appear only inside a quote ("How do I get more US clients?" is the video's setup, then the caption answers it, #60) or in one image caption (#43). Leila and Dan use questions on video much more (section 4).

### A second voice sits in the first comment

The one video post I could fetch (#35, "I took the biggest risk of my life but then I lost everything.. twice.", 4,115 reactions, 330 comments) showed that Alex's own first comment is a one-line thesis, "Extraordinary outcomes follow extraordinary work, not extraordinary people." That is a single data point, so do not generalize it. It does suggest the caption can stay a teaser while the argument sits elsewhere.

### His best video caption, by ratio

#35 (1.40): a first-person stakes line with a twist, 14 words. #45 and #46 (1.07 each): short labels. #49 and #50 (1.02): the two list captions. So even among videos, nothing above 1.4.

---

## 3. Rhythm and craft

Estimates are hand counts across the 55 captioned posts.

- **Sentence length.** Most lines run 5 to 14 words. Longer sentences appear only in S4 closers and in the long list items (#94, #73).
- **Line breaks.** Nearly every sentence is its own line in S1, S3, S4. Prose paragraphs of two to three sentences appear only in the longer posts (#62, #72, #74). The list posts use a blank line between a header line and the items, not between items.
- **One-line paragraphs.** Common. The closing line of S4 posts is almost always alone.
- **Contrast pairs.** About 15 of 55 use one. Examples: "Not hard. Boring." (#72), "Listen to the people closest to your goals." against "Don't listen to the people closest to you." (#88), "consistency not complexity" (#82), "Failure is feedback, not judgment." (#93). His default way to state an opinion is a claim and its inverse.
- **Numbers.** Used for effect in the personal-stakes posts: "$3,000,000 per year... $17,000,000" (#79), "87 years. 2 paragraphs." (#87). Lists use whole numbers. Round numbers dominate; nothing hedged.
- **"You" versus "I".** Mostly "you" or impersonal (about 30 of 55 address the reader directly). "I" shows up in about 8 posts, always a short anchoring detail ("I read a family friend's obituary today", #87; "No rule has been truer in my life", #77). He rarely tells a long story in the caption; the longest first-person pieces are Leila's and Dan's.
- **How he states an opinion.** Flat declaration, no hedge words, no "I think", no "in my opinion". Often prefaced only by "Hot take that should not be one." (#86, #76) or "Brutal truth" (#27) as a label.
- **Emoji.** Used on about 10 of 55, usually at the end of a how-to label or the sign-off.
- **Hashtags.** None in any caption.

### Why it reads as written rather than assembled

This is inference from the structure, flagged as such.

1. **One idea per post.** No caption carries more than a thesis and its support. Nothing in a caption is bridging two ideas.
2. **No scaffolding.** No hook, no beats, no landing line as separate parts. The first line is the claim and the last line is the same claim said better.
3. **The caption does not summarize the media.** The video or image carries the argument; the caption is the claim, the label, or the audience, not a recap.
4. **A single voice register.** The same casual, flat declarative tone appears in a 6-word label and a 170-word list.
5. **Restraint.** 60% of video captions are under 20 words. A caption that explains the video competes with it.

Brett's rejected captions (hook, beats, landing, built from interview answers) are the opposite of items 1, 2, and 5. That is the likely cause, not a certain one.

---

## 4. Leila and Dan versus Alex, for persona 1

### Leila Hormozi

- About 46 of her 100 posts are caption-less images, the same pattern as Alex.
- **Leadership and people-management topics.** Onboarding, retaining A players, delegation stages, the "6-inch putt" (#6, #42, #88, #90, #92). This is the closest topic match to persona 1's team leaders.
- **Her long personal-story posts do not outperform her short ones.** The 466-word rock-bottom story (#57) is at 0.95. The 205-word capacity story (#55) is at 0.98. Her top captioned posts are 9 to 31 words (#2 at 3.25, #3 at 2.68).
- **She asks the reader more.** "Which one do you chose daily?" (#48), "Agree?" (#72, #79), "Who is the most punctual person you know?" (#29), "Tell me below" (#81). Her question-ending posts rate between 0.74 and 1.33, none in her top 15.
- **Sign-off "- Leila" with an emoji** on her reflective posts.
- **Structure she uses that Alex does not:** the "Six years ago, I..." story with a lesson stated in a friend's or manager's words (#10, #40, #55). Dialogue as the turn: she quotes a manager or a friend, then states what it taught her.

### Dan Martell

- **Highest peaks.** His top six are all short signed images ("-DM") with ratios 4.2 to 7.5, beating Alex's top of 5.9. Example: "Winners fail." (#2, 6.91).
- **He sells.** 9 posts have a tracked link and an offer (#15, 29, 38, 39, 67, 68, 71, 72, 73), plus one "Follow for more" (#35). None of these sit in his top 10. Their ratios run 0.68 to 2.11, and most are under 1.4. A post that opens as value and ends in "click this link" does not appear to be a higher performer for him.
- **Video captions are one line, often a question or a colon with nothing after it.** "10 things to avoid if you want to be wealthy:" (#12), "How do you become an effective CEO?" (#36), "Which AI user are you?" (#41). Roughly a quarter of his video captions are questions.
- **The most Brett-compatible structure is his named-case post.** #4 (4.74, 149 words): a thesis, then a specific person ("a founder named Joe"), a number ("lose about 27% of his customers and still break even"), an outcome, then a question to reflect on, signed. That is a real client example with a number inside a short post. It is the only structure in all 300 that does what persona 1 needs: a peer sharing a specific case.
- **Format.** One-sentence paragraphs with blank lines, "→" bullets, "I know because I did it too." as a pivot, "Remember," before the closer, "-DM". Heavily formatted, which reads more produced than Alex's.

### What matters for Brett

| Difference | Why it matters |
|---|---|
| Alex rarely asks, rarely sells; Dan sells in about 10% of posts and it doesn't lift them; Leila asks questions | Matches Brett's give-first rule. The best-performing behavior is no ask. |
| Alex's audience is broad and aspirational; Dan and Leila write for operators and managers | Persona 1 is an operator. Leila's and Dan's topics (delegation, team standards, fixing leaks in a system) are closer than Alex's mindset lines. |
| Alex and Leila win with caption-less images; Dan wins with short signed images | For Brett's reels the video is the equivalent of the image. The caption can be short. |
| Dan's named-case post (#4) uses a real person, a number, an outcome | The only pattern that carries proof, which a $50M+ producer values. Requires a sourced figure from Brett's world. |
| Scale | These authors have audiences of hundreds of thousands. Ratios say what works against an author's own norm, not that it works for a peer-to-peer audience of agents. |

---

## 5. Implications for Brett's reel captions

### The rules to design against

Brett's give-first rules: no ask, no hashtags, no Labels. I read "Labels" as the "Label: text" pattern (Alex's "Brutal truth:", "Hot take:", Dan's "Mistake: / Instead:"), and I did not find a definition, so confirm.

### Where Alex's craft collides with `voice-principles.md`

`voice-principles.md` forbids fragments for effect, staccato runs of three short sentences, and "It's not X, it's Y". Alex's contrast pairs are mostly complete sentences ("Failure is feedback, not judgment." has subject and verb), but "Not hard. Boring." is a fragment pair and his S4 runs ("You will be embarrassed. / But you will survive.") sit close to the staccato line. Borrow the structure, not the clipped delivery. Use complete sentences and keep any contrast to one per caption.

### What a caption built on Alex's structures looks like

Three structures fit. All run 10 to 40 words, one idea, no summary of the video, no ask, no hashtag, no label.

**A. Thesis caption (from S1 / V2).** One or two complete sentences stating the reel's single claim in the way Brett would say it to a peer.
- Template: `[Claim, one complete sentence, in the agent's world: a listing, an escrow, a team.] [Optional second sentence: the reason or the cost, one clause.]`
- Fill-in checks: the claim is something Brett said on camera; it names a concrete thing (a listing appointment, a team member, an escrow), not a mindset; nothing in it summarizes the video.

**B. Conditional caption (from S3 / V3).** Names who the reel is for, then gives the conclusion.
- Template: `If [the situation a $50M+ producer or team leader is in], [the one move, or what it costs not to make it].`
- Fill-in checks: the "if" is a real situation from the interview, not a category; the second half is a sentence with a verb; no "you need to".

**C. Stakes line (from S2 #35, #79, and Dan #4).** One factual line with a number or a named situation from the interview, that the video then explains.
- Template: `[Specific, sourced fact or number from Brett's world.] [One sentence on what it changed or what happened next.]`
- Fill-in checks: the number is from a document or from Brett, never estimated; if the number cannot be sourced, use A or B instead.

Optional on A and B: a sign-off, as Alex uses on 6 of 55 reflective posts. Brett's call; the sign-off is not needed.

### Closing list: structures ranked by fit for Brett's reel captions

| Rank | Structure | Fit and reason |
|---|---|---|
| 1 | **S1 / V2 One-line thesis** (Template A) | Best fit. 27% of Alex's captions and 29% of his video captions; 10 to 20 words; no ask; it is the reverse of "assembled from interview answers" because the line is the claim Brett already said. Risk: it must be a real claim, not a restated hook. |
| 2 | **S3 / V3 Conditional setup plus payoff** (Template B) | Strong fit. Addresses persona 1 directly without pitching; complete sentences; fits a video that gives one piece of advice. Risk: "If you want to be exceptional" tone drifts to motivational; keep it operational. |
| 3 | **Stakes line with a specific number or case** (Template C; Alex #35/#79, Dan #4) | Strong fit when a real, sourced number exists. It is the only structure that carries proof. Needs Brett to supply the figure. |
| 4 | **S4 Stacked lines with a kicker** | Medium fit. Works for a short reflective reel; closest to Brett's "isolate a key sentence" rule. Risk: staccato and fragment drift; limit to three full sentences. |
| 5 | **V4 Headline plus short payoff** | Medium to low fit. The headline half is a label and the payoff half usually repeats the video. Use only if the headline is a full sentence. |
| 6 | **S2 / V1 Label headline** | Low fit. Alex's lowest-performing video captions (bottom 20 holds #89, #90, #98) and it reads like a title card. Brett's rules also steer against labels. |
| 7 | **S5 Numbered list** | Lowest fit for a reel caption. It restates what the video covers, runs long, and is the "assembled" shape Brett rejected. Fine for a document post, not a reel. |

### Decision for Brett

None required to proceed. One open item that would change the next draft: confirm what "Labels" means in your rule (a colon-style "Label: text" line, or any headline-style opener), because it moves structures 5 and 6.

### Could not verify

- What the 45 caption-less Alex images say, or why they outperform.
- How any caption relates to its video (no video watched).
- Whether Alex's first-comment thesis is a pattern (one post observed).
- Whether engagement ratios transfer to a peer-to-peer audience of San Diego agents.
