# Subject Line Strategy

_This file contains the full strategy for generating your newsletter subject lines: the principles, the format, angle rotation, the generation process, and a structured prompt template. Read it whenever you generate subject lines for an edition. It does NOT contain edition structure or voice rules (those live in `Newsletter HQ/Newsletter HQ Resources/Newsletter Style Guide.md`) or your universal voice rules (those live in `00_Reference/Voice Principles.md`, which is always the real tone reference)._

_See also: `00_Reference/Hook Psychology Meta-Patterns.md` for the hook and curiosity mechanics behind the angles below; load it alongside this file when you want to sharpen the hook in a subject line._

---

## Core Principles

1. **Content-grounded when it helps.** When the finalized edition body is available, feed it into the generation process. The best hooks are often already in the body copy. Topic-based generation is also fine when the content is not finalized yet, or when the topic alone is enough to work with.
2. **Specificity over cleverness.** Lead with a specific, concrete benefit or outcome. Create curiosity through specificity, not a vague tease. A subject grounded in something concrete from the edition beats a clever-but-empty line.
3. **Anti-patterns.** Avoid all caps, excessive punctuation, emoji, and generic phrases like "tips and tricks" or "you need to know." Use natural, conversational language: not clickbait, not corporate.

---

## Format

`[Topic]: [Hook]`, the topic always front-loaded, 40 to 60 characters, never over 60. Topic naming rules live in `Newsletter HQ/Newsletter HQ Resources/Newsletter Style Guide.md`.

---

## Angle Rotation

Never use the same persuasion angle in consecutive editions. Available angles include: Social proof, Curiosity gap, Personal story, Emotional/benefit, Benefit/clear, Question/problem, Regret prevention, Personal proof, Radical simplification, and Counterintuitive reframe. Check your edition log in `Newsletter HQ/MEMORY.md` before generating, and deprioritize any angle you used in the last 2 to 3 editions. Angles and the specific criteria (lead with a concrete benefit, curiosity through specificity) work together, not either/or.

---

## Generation Process

Use the structured prompt below. When the edition body is finalized, append it at the end of the template. Generate 5 options, each with Subject, Character Count, Score (/10), Angle, and Rationale. End with a recommendation.

The "Good Examples" section in the prompt is hypothetical, for tone calibration only. The real voice reference is always your voice principles (`00_Reference/Voice Principles.md`) and your actual past editions.

---

## Prompt Template

Append the finalized edition body where indicated when you have it.

```
# ROLE
You are a senior email copywriter specializing in high-open-rate subject lines for educational newsletters.

# CONTEXT
You are writing subject lines for my newsletter, which teaches one specific topic per edition. The audience is mid-career professionals who want to work faster and smarter.

# TASK
Given the newsletter content below, generate 5 subject line options. Then recommend your top pick and explain why in one sentence.

# SUBJECT LINE CRITERIA
* Front-load the topic, for example "Topic: xx"
* Length: 40 to 60 characters (optimize for mobile preview)
* Lead with the specific, concrete benefit or outcome the reader will get
* Use natural, conversational language (not clickbait, not corporate)
* Create curiosity or urgency through specificity, not a vague tease
* Avoid: all caps, excessive punctuation, emoji, generic phrases like "tips and tricks" or "you need to know"

# GOOD EXAMPLES (for tone and structure reference only)
* "The one setting that kills reply-all chaos"
* "Sort your data in 3 clicks, not 30"
* "The shortcut hiding in your address bar"

# OUTPUT FORMAT
For each option, provide:
1. The subject line
2. Character count
3. Score (/10)
4. Rationale (one sentence)

Then state your top recommendation with a one-sentence rationale.

# NEWSLETTER CONTENT
[Append finalized newsletter body here when available]
```

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
