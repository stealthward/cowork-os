# Content Structuring: Principles and Frameworks

_Read when: starting any Clarity Partner session. This is the detailed reference for all content structuring methodology._

This document captures how to think about, structure, and refine content. It applies across formats: videos, training sessions, workshops, newsletters, social posts, short-form video, or anything else. The principles are constant regardless of the output format.

**Voice rules:** This file covers content structuring methodology only. For tone, punctuation, and style rules, see `00_Reference/Voice Principles.md`.

---

## 1. The end goal

You start with raw, unfiltered thoughts: half-formed ideas, rough phrasings, questions about facts, structural uncertainty. The deliverable is structured text in a nested bullet-point format, ready to be transferred into whatever tool or format comes next (a note, slides, a script outline, and so on).

The underlying structure always follows a vertical flow, sometimes called the Minto Pyramid, where each level supports the level above it. The top is the main point. Everything below it exists to support, prove, or illustrate that point.

---

## 2. The vertical flow framework

### 2.1 The constant principle

Every piece of content follows this logic:

- **Top-level point** (a takeaway, insight, claim, or outcome, one or two sentences)
  - **Supporting detail** (evidence, explanation, or example that proves the top-level point)
  - **Supporting detail**
  - **Supporting detail** (only if it earns its place)

This is the skeleton. What hangs on it varies by topic and format.

### 2.2 The elements are flexible

Depending on the content, the supporting layer might include any combination of: sub-points with bold labels and proof text, use cases with specific examples, pro tips, a single illustrative example, a log line or one-sentence summary, or a decision rule or heuristic.

There is no fixed template. The vertical flow is the principle; the specific elements are chosen based on what the content needs.

### 2.3 Maximum three supporting points per level

Any single point should have no more than three supporting details beneath it. If there are more than three, either the top-level point is too broad and needs to be split, or some supporting points are not pulling their weight.

---

_Workflow: see Clarity Partner CLAUDE.md. This file covers structuring methodology only._

---

## 3. Content structuring principles

### 3.1 Every mechanism needs its implication, and the implication comes first

Two failure modes, in order of severity: (1) describing a mechanism without any implication (the audience must infer why it matters), and (2) putting the mechanism before the implication (the audience gets the "why" but too late). Both fail.

Every component, feature, or structural element presented to the audience must include a "so what" that explains why it exists or what the audience gains from it. Then lead with that implication. When describing a multi-part structure or system, this applies to EACH component individually, not just the system as a whole. A list of components without per-component implications is a feature list, not teaching.

**Before (mechanism only, no per-component implication):**
> My memory file has four sections: Active Projects, Scheduled Tasks, a knowledge index, and accumulated context.

**After (each component earns its place):**
> My memory file has four sections. Active Projects is a two-sentence dashboard so the assistant immediately knows what you are working on without loading every project file. Scheduled Tasks tracks your automated jobs so the assistant does not accidentally create duplicates or miss a recurring task. [and so on]

**Before (mechanism first):**
> There is a per-file size cap and a file-count limit per conversation in the web app. This means you cannot upload a very large file directly.

**After (implication first):**
> You cannot upload a very large file onto the web app because of a per-file size cap and a file-count limit per conversation, but the assistant can access and read that same large file when it lives in your local folder.

### 3.2 Cut anything that fails the practical test

Every supporting point must pass this test: would the audience do something different, or understand something differently, because of this point? If removing it does not lose actionable information, cut it.

### 3.3 Use contrast as a teaching structure

Anchor new concepts against something the audience already knows. For content about a new tool, compare it to the tool they currently use. For content about a new idea, compare it to the assumption they currently hold.

**Pattern:** "In [the thing they know], X. In [the new thing], Y."

### 3.4 Name things by what the audience experiences, not what the technology does

Headlines and labels should describe a felt difference, not a feature or specification.

| Technical name | Audience-facing name |
|---|---|
| Larger context window | Can handle way more of your information |
| Local file system access | Delivers finished files, not just replies |
| Agentic architecture | Needs an outcome, not a task |

### 3.5 Close sections with a decision rule, not a summary

Do not restate what was just covered. Instead, give the audience a practical heuristic they can apply.

### 3.6 Bold labels must work as standalone claims

When a supporting point has a bold label, the label alone should communicate the core claim. The text that follows is the proof, not the point.

### 3.7 One vivid example beats multiple listed examples

A single concrete, specific illustration does more work than two or three parallel examples serving the same point. A second example should serve a different structural purpose (expanding scope, teasing a future section), not reinforcing the same point.

### 3.8 If the implication is clearer than the headline, promote it

When a concept is abstract but its downstream consequence is immediately intuitive, lead with the consequence. "The assistant runs multi-step tasks autonomously" is the mechanism; "the assistant needs an outcome, not a task" is what the audience experiences. Lead with what the audience experiences.

---

## 4. Language and phrasing principles

### 4.1 Replace jargon with plain equivalents

| Jargon | Plain version |
|---|---|
| Ingest | Handle, work with |
| Auto-compaction | Manages its own memory |
| Context window | Working memory |
| Agentic architecture | Works independently |

Use the technical term only when the audience needs to learn it as vocabulary, and define it immediately.

### 4.2 Make vague language specific

When listing capabilities or deliverables, name the exact thing. "Formatted documents" becomes "spreadsheets with working formulas, slide presentations, word-processor documents, and PDF reports."

### 4.3 Test terminology for reuse

When choosing a label word (like "capability" or "difference"), it must work in three contexts: (1) as a label, (2) as a counter ("The first ___ is..."), and (3) as a back-reference ("This is downstream from ___ #1").

**Words that pass:** capability, difference
**Words that fail:** way, principle, building block, pillar, category

---

## 5. Section header and labeling principles

### 5.1 Headers describe what is coming, not a spoken explanation

**Good:** "4 Key Capabilities"
**Bad:** "4 categories of work this tool is uniquely positioned to do"

The first is a label. The second is a sentence pretending to be a label.

### 5.2 Separate what is written from what is spoken

Some phrasing works as a visual header or label. Other phrasing is meant to be spoken as a transition. Do not conflate the two.

### 5.3 Avoid words that invite scrutiny

Words like "unique," "revolutionary," or "best" invite the audience to challenge the claim. Prefer neutral, accurate words.

### 5.4 Section headers are descriptive, not branded

"Best for Multi-Modality" over "The Multimodal Powerhouse." Plain language that tells the reader what the section does. No marketing-sounding taglines.

---

## 6. Research and fact-checking principles

### 6.1 Always verify product-specific claims

Never rely on training data for feature details, pricing, file limits, or platform capabilities. Search the web and cite the source.

### 6.2 When uncertain, say so

If a source cannot be confirmed or the information is contested, say so explicitly. Do not present uncertain claims as facts.

### 6.3 Filter before presenting

Do not dump raw search results. Apply the quality heuristics from Section 8 to pre-screen every finding. Only present findings that pass the relevant filter. If a finding is borderline (interesting but does not fully pass), flag it explicitly rather than including it silently.

---

## 7. Content type output templates

When you specify what you are working on, use the corresponding output template below. These determine how you structure and format your findings.

### 7.1 Video outline

**Output format:** Hierarchical bullet points. Never prose.

Specify the segment structure for the current video. Common structures:
- **Beginner tool tutorial:** "in plain English" one-liner, then use cases (show do not tell), then pro tips woven in
- **"What this means, then in practice, then example"** for comparison or difference sections
- **Custom structures** decided per section based on purpose

**When researching for a video outline:**
- Pre-format each finding as an outline bullet, not a paragraph summary
- Include the specific detail (stat, feature name, product behavior) alongside why it matters to the viewer
- If researching use cases: provide one vivid, specific example per use case, not a vague category

### 7.2 Social post

**Output format:** Match your post category structure.

Common post categories: Quick Tactical Tip, Framework Explainer, Concept Explainer, Personal Story or Milestone, Career Advice. Each has a distinct structural template. Specify which category, or propose one based on the content.

**When researching for a social post:**
- Condense findings into one or two killer data points, not comprehensive summaries
- The hook line matters most: find the surprising stat, the counterintuitive insight, or the specific credential that makes the reader stop scrolling

### 7.3 Newsletter

**Output format:** Tip-based structure.

Each tip: bold label (standalone claim), then a two-to-three sentence explanation, then an action step the reader can do immediately.

**When researching for a newsletter:**
- Map each finding to one tip
- Make the action step specific enough that the reader could do it in under two minutes

### 7.4 Training or workshop

**Output format:** Slide-ready bullet points.

One key message per slide. Supporting details as sub-bullets (max three). Speaker notes as a separate layer below each slide's content.

**When researching for a training:**
- Ground findings in real workplace scenarios the audience recognizes
- Include the "why this matters for your team" angle, not just the "what it does" angle
- Stats and benchmarks are especially valuable here (credibility with corporate audiences)

### 7.5 General research

**Output format:** Vertical flow. Key finding first, supporting evidence below. Cite all sources.

Use this when no content type is specified, or when the research is exploratory (not yet tied to a specific deliverable).

---

## 8. Quality heuristics by content type

Apply these filters BEFORE presenting findings. They determine what is worth including versus what gets cut.

### 8.1 Video use cases and examples

A use case passes the quality filter if it meets ALL of these:
- **The viewer can try it.** The use case involves tools or workflows your audience actually uses (email, docs, spreadsheets, presentations, PDFs, calendars, project management). Not niche developer workflows.
- **The before-and-after is visible.** The transformation is obvious enough to show on screen. "Before: messy folder. After: organized subfolders" works. "Before: slow workflow. After: faster workflow" does not, because speed is invisible.
- **It genuinely requires AI.** The task cannot be done more easily with existing tools. If a formula, a simple rename, or drag-and-drop solves it, the use case fails. The test: does the task require the AI to understand content in order to complete it?
- **It is relatable at the job level.** The viewer should think "I literally did this last week" or "my colleague asked me to do this yesterday." Not aspirational, not edge-case.

### 8.2 Social data points and examples

A finding passes if:
- **It is specific enough to be surprising.** "AI is growing fast" fails. "73% of marketing managers use AI daily but only 12% have integrated it into their actual workflow" passes.
- **It supports a personal take.** Do not just share facts. Every fact anchors a perspective. If the finding does not naturally lead to a "here is what I think about this" follow-up, it is not useful for a social post.
- **The source is credible and citable.** Social audiences scrutinize claims. The source must be nameable (a known research firm, a reputable publication, first-party data).

### 8.3 Training or workshop evidence

A finding passes if:
- **It is grounded in a real workplace scenario.** Abstract capabilities do not land in corporate training. "You can use AI to process documents" fails. "When your legal team sends you a 200-page contract and needs a summary by end of day" passes.
- **It includes a benchmark or comparison.** Corporate audiences respond to "X% faster" or "reduces from three hours to 15 minutes." Quantify when possible.
- **It is tool-agnostic enough to survive the room.** If the audience uses different tools than you, the principle should still apply. Lead with the workflow, not the specific product.

### 8.4 Newsletter tips

A finding passes if:
- **It is immediately actionable.** The reader should be able to do the thing within two minutes of reading the tip.
- **It is specific to one tool or feature.** "Use AI for email" fails. "In your email client, open the AI assist panel next to the reply button and type 'draft a polite decline'" passes.
- **It has a "most people do not know" quality.** Not obscure, but not obvious either. The sweet spot: features that exist in plain sight but most users have not discovered.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
