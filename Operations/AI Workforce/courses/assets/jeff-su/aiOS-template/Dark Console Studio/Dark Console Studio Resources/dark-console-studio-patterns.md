# Dark Console Studio Patterns

_The single source of truth for Dark Console Studio visual production. Read first for any Dark Console visual._

**Contains:** the prompt-writing playbook, the voiceover default, design principles, the full visual system spec (color, typography, components, layout, motion), the technique library and selection process, visual argument principles, code requirements, conflict resolution, the Concept Card, the Quality Checklist, and worked examples.
**When to read:** before producing or workshopping any Dark Console static visual or animated B-roll.
**Does NOT contain:** prose voice rules (those live in `00_Reference/Voice Principles.md`) or hook theory (that lives in `00_Reference/Hook Psychology Meta-Patterns.md`).

This file is built so you can hand Claude a one-line prompt, "here's a segment and the dimensions, go", and get an on-brand dark-style visual back. Everything below either teaches Claude how to turn that segment into a visual, or defines what "on-brand" means.

---

## Prompt Structure

Every Dark Console visual prompt follows this template:

```
[Dimensions] [static or animated].
Segment: [paste the exact text segment the visual must communicate]
Context: [paste the broader argument or a one-line summary of what surrounds this segment]

[Technique label]. [One-sentence description of the visual concept.]
[Detailed visual spec: what elements appear, how they're arranged, what they represent.]
[The structural element that IS the argument, stated explicitly.]

Sequence: [step-by-step reveal order using arrows]   (animated only)
Colors: [semantic color assignments, what each color represents]
```

### Template components

- **Header (always the same):** dimensions + format + segment + context. The segment is the exact text. The context tells Claude enough to design the right metaphor.
- **Technique label:** a short descriptive name for the layout/motion approach (reframe, flow diagram, comparison, constraint enactment, etc.), ideally from the Technique Library below.
- **Abstract metaphor description:** the visual is not a literal illustration of the words. It is a structural metaphor for the *argument* the segment makes. Describe what the viewer should *feel*, not what the words say.
- **"The X is the argument" statement:** name the structural element that carries the persuasive weight. This forces the visual to communicate through form, not labels.
- **Sequence block (animated):** step-by-step reveal order using arrows. Each step maps to one animation beat an editor can sync to narration.
- **Color semantics:** colors map to concepts, not decoration. State what each color means, and keep it consistent across a series.

Only the header is required from you. Everything after it is optional steering; when you skip it, Claude derives the technique, spec, sequence, and colors from the segment using the selection process below.

---

## The Voiceover Default

Dark Console visuals are built to run under narration or beside surrounding content (a video voiceover, a blog paragraph, a post caption). The words live there; the visual carries the structure. This is the built-in default for every output, static or animated. There is no mode to select and nothing to add to the prompt.

What the default means in practice:

- **No headlines, no bottom verdict taglines, no explanatory paragraphs on the canvas.** Keep only structural labels (card titles like "TOOL A," badges like "12/12," stage labels like "DRAFT 1") and short descriptive detail lines inside cards.
- **The mute test:** if the narration were muted and someone just watched, they should still understand the argument from the structure alone. If not, the structure isn't doing enough work.
- **Zero sentences inside the visual.** Labels, keywords, and values only. If you find yourself writing a sentence as image content, redesign it as a visual element. (Exception: short Inter detail lines inside cards, one phrase each.)
- **Exception path:** if a specific visual must self-explain (a standalone social graphic with no caption, a poster), say so in the prompt. That is creative direction, and it overrides the default for that piece. In that case the headline must convey the insight, not just label the topic: "Simple Commands → Better Results" works; "One-Word Commands" is just a topic label.

### On-screen text budget

| Element | Max length | Font |
|---|---|---|
| Labels | 1–3 words | Space Mono, uppercase |
| Value indicators | Numbers, percentages, short ratings | Space Mono |
| Scale endpoints | Short labels | Space Mono, muted |
| Verdict badges | 1–2 words | Space Mono, bold |
| Source attributions | Small muted text | Space Mono, 9px, `#888888` |
| Detail / description lines | 1 short phrase | Inter, 12px, `#999999` |

### Content sourcing

- **Target-segment text is the only text that may appear on screen.** Use exact phrasing for labels and verdicts.
- **The broader context is for understanding only.** Never pull content from it onto the screen.
- **Do not invent content.** If the segment has no examples, do not create examples. Include an attribution only if the segment itself credits someone.
- **Match the visual's abstraction level to the segment's abstraction level.** A conceptual segment ("outcome-first language") gets abstract bars and shapes. A concrete segment ("rename 15 photos from Tokyo") gets concrete content. Do not borrow concrete details from elsewhere in the context to flesh out a conceptual segment.
- **Remove non-contributing labels.** Generic labels like "APPROACH," "METHOD," "TYPE" that add no information get cut. Test every text element: "If I removed this, would the viewer lose understanding?" If no, remove it.
- **No vertical or rotated text, ever.** Find horizontal solutions: shared labels, connector bars, badges, footnotes.

---

## Design Principles

### Structure is the argument

The visual form carries the meaning, not text labels. "Back-and-forth = manual effort" is communicated through repetitive request/response pairs, not a label saying "manual." Ask: "If I muted the voiceover and just watched, would I still understand the argument?" If not, the structure isn't doing enough work.

### Argument before layout

Before designing, extract the one-sentence argument from the source text. The layout illustrates that sentence and nothing else. Map the argument to the visual form before choosing details: comparison → parallel cards, process → flow, before/after → split or stacked panels, constraint → a container filling or hitting a boundary, and categorization → grouped cards or rows.

If a visual looks polished but cannot be explained by the one-sentence argument, the concept is wrong. If the argument is right but spacing, balance, or scale feels off, revise the composition instead of starting over.

### Abstract over literal

Default to abstract representations (bars, blocks, progress indicators) rather than literal UI mockups. When a segment describes a concept, use abstract bars with no text. When a segment quotes verbatim text, those exact words appear as content inside the abstract structure.

### One argument per visual

Each visual makes exactly one structural point. If a segment contains two ideas, decide whether they need two visuals or whether one is the primary argument and the other is context.

### Series consistency

When several visuals form a comparison or progression, they must share a visual format so structural differences read instantly: same header layout, card sizing, font stack, spacing, and easing. The second piece's prompt should reference the first ("mirrors the header format of the previous card for series consistency"). Lock the frame structure, accent color mapping, and motion feel in piece 1; let the visualization concept vary per segment.

### Fill the canvas

Use the whole capture area. Do not cluster small elements in the middle of an empty frame. In cards and panels, scale rows, bars, padding, and type up until the frame feels intentionally filled. If one side of a comparison has less content, give it larger structure or stronger emphasis so the difference reads as meaning, not accidental whitespace.

**Fill containers, not just the canvas.** When a card has spare room, its child elements must scale up (larger fonts, more padding, taller rows) to fill it. The test: if you can increase font size, row height, or padding by 30%+ without overflow, the elements are too small.

---

## Visual System

These are the canonical Dark Console values. Use them exactly; consistency across every visual you produce is what makes the system read as one brand. (You can swap in your own palette and fonts later; if you do, replace the values here once so every future visual inherits the change.)

### Color

**Surfaces and text:**

| Role | Hex | Usage |
|---|---|---|
| `bg-root` | `#0D0D0D` | Root background for all outputs (also the letterbox bars) |
| `bg-surface` | `#1A1A1A` | Cards, containers, elevated surfaces |
| `border-default` | `#2A2A2A` | Card borders, dividers |
| `track` | `#333333` | Slider tracks, progress bar backgrounds |
| `text-primary` | `#E8E8E8` | Verdicts, active labels |
| `text-muted` | `#888888` | Section sub-headers, scale endpoints, attributions |
| `text-dimmed` | `#555555` | Pre-animation placeholder state, abstract content default |
| `text-descriptive` | `#999999` | Descriptive detail lines (Inter) |

**Accent colors (max 5 per artifact, assign one concept each):**

| Name | Hex | Semantic usage |
|---|---|---|
| Amber | `#F59E0B` | Key insight, featured element, the "active" subject |
| Blue | `#60A5FA` | Information, input, a source, a content stream |
| Purple | `#A78BFA` | Creative, abstract, a second distinct subject |
| Green | `#4ADE80` | Positive, completion, the recommended option |
| Red | `#F87171` | Negative, loss, risk, the discouraged option |
| Yellow | `#FBBF24` | Rating, emphasis, callout |
| Teal | `#2DD4BF` | Technical, data-specific, a third distinct subject |
| Pink | `#F472B6` | People, emotion, relationship |

**Accent opacity scale** (append the suffix to any accent hex):

| Suffix | ~Opacity | Use case |
|---|---|---|
| `22` | 13% | Subtle background tint on badges |
| `44` | 27% | Badge borders, faint card backgrounds |
| `55` | 33% | Active card borders, hover states |
| `88` | 53% | Glow rings |

**Color rules:**

- **Never decorate with color.** Each accent must stand for something the viewer can name. Write the argument in one sentence first, then assign colors that reinforce it.
- **Map colors to the argument's structure, not the layout's structure.** A unified progression (A → B → C) shares one accent. Independent alternatives each get their own.
- **Use a single accent when possible.** Add colors only because the content demands categorical distinction, never because the layout "looks too plain."
- **Good vs. bad uses green and red.** Universal, needs no explanation. Neutral comparisons use two equally weighted colors (e.g., blue and amber), never green/red.
- **Abstract content defaults to neutral gray** (`#555555` for abstract content and pre-animation placeholders). Reserve `#333333` for tracks and progress backgrounds, and reserve accents for elements where the color means something.
- **Never let color contradict the message.** Conceptually linked elements share an accent; unrelated elements must not.
- **Phase contrast:** amber for work-in-progress or teaching states, green for automated or running states. The color shift between two passes of the same process signals "something changed."
- **No off-palette colors.** Every hex must trace back to this file.

### Typography

Two fonts only, imported inside the artifact's `<style>` tag:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');
```

**The font selection test: "Is this text naming something or explaining something?"**

- **Space Mono** names or identifies: card titles, category labels, badges, numbers, section headers, verdicts, attributions. Always uppercase, tracked out (`0.04em`–`0.15em`). Weight 400 for secondary labels, 700 for primary labels and verdicts.
- **Inter** describes or explains: detail lines inside cards, query text, summaries. Sentence case, weight 400–500, color `#999999` or `#888888`.

Never use Inter for labels or identifiers. Never use Space Mono for descriptive phrases.

**Type scale:**

| Role | Font | Weight | Size | Case |
|---|---|---|---|---|
| Large verdict / dramatic stat | Space Mono | 700 | 24–64px | UPPERCASE |
| Labels / badges / card titles | Space Mono | 400 or 700 | 11–14px | UPPERCASE |
| Section sub-headers ("RESULT") | Space Mono | 400 | 10px | UPPERCASE, `#888888` |
| Source attributions | Space Mono | 400 | 9px | UPPERCASE, `#888888` |
| Descriptive detail lines | Inter | 400–500 | 12–14px | Sentence case |
| Value indicators | Space Mono | 700 | 13px | — |

**Floor: 10px.** No text below 10px anywhere; labels 11px minimum. In 9:16, increase text sizes ~15–20% over 16:9 because the narrow frame shrinks apparent size. All text on `#0D0D0D` or `#1A1A1A` must stay readable; `#555555` is for pre-animation states only, never for final-state body text.

### Components

Use a small set of consistent Dark Console components instead of inventing new shapes for every visual:

- **Cards and panels:** `#1A1A1A` background, `1px solid #2A2A2A` border (`1px solid {accent}55` when active), border radius `16px`, padding `24px 20px`. Restrained glow only when the card is active or selected.
- **Badges and pills:** Space Mono 13px bold, `{accent}22` background, `1px solid {accent}44` border, radius `6px`, padding `2px 10px`. Show `"—"` when a value is unset.
- **Buttons / selectable cards:** default `#1A1A1A` + `#2A2A2A` border; active `{accent}18` + `{accent}55` border. Radius `10px`, padding `6px 14px`.
- **Abstract content bars:** neutral gray by default; accent only when the bar represents the argument.
- **Meters and progress lines:** track `#333333`, height 5px, radius 3px; fill is a gradient from `{accent}55` to `{accent}`. Use when the argument is about effort, progress, cost, limits, or completion.
- **Dividers:** `1px` `#2A2A2A`; vertical dividers use `alignSelf: "stretch"`, never a fixed height.
- **Arrows and connectors:** use sparingly; they must touch their intended elements with no gaps or overlaps. See the connector patterns below for the three standard options.
- **App or browser wireframes:** stylized, not screenshot-faithful. Just enough chrome, panels, and abstract bars for the viewer to recognize the tool type.
- **Icons: use standard emoji, never custom SVG icons.** Emoji are universally readable and consistent. Size 20–28px via `fontSize` on a span, placed left of labels or centered above card titles.

### Spacing & layout

**Two-layer viewport architecture (required for every output):**

Global reset inside the `<style>` tag: `html, body { margin: 0; padding: 0; overflow: hidden; }`

1. **Viewport wrapper (Layer 1):** `width: 100vw`, `height: 100vh`, background `#0D0D0D`, flex centering, `position: relative`, `overflow: hidden`. The replay control attaches here.
2. **Content box (Layer 2):** the actual visual. `aspect-ratio` set to the target ratio, `max-width: 100%`, `max-height: 100%`, `box-sizing: border-box`, `overflow: hidden`, and **one primary dimension set to `100%`**: `width` for landscape, `height` for square and portrait. Without a primary dimension the box collapses to its children; `aspect-ratio` alone establishes a ratio, not a size.

The dark bars around the content box (letterboxing for landscape, pillarboxing for portrait) are intentional and expected.

Apply glows via `box-shadow` on the content box or cards, never on the wrapper, and never put `overflow: hidden` on an element whose children need a visible glow (it clips the glow).

**Dimension-specific layout.** Each ratio gets its own design. Never scale or shrink a 16:9 layout into another ratio; redesign from scratch.

| Ratio | Padding | Primary dimension | Columns | Max distinct elements |
|---|---|---|---|---|
| 16:9 (default) | `12px 16px` | `width: 100%` | Two-column permitted | No hard limit |
| 9:16 (vertical) | `28px 20px` | `height: 100%` | Single-column only, never side-by-side | 4 |
| 1:1 (square) | `20px 24px` | `height: 100%` | Single-column preferred | 3 |
| 4:5 (portrait) | `24px 24px` | `height: 100%` | Single-column only | 4 |

If the content needs more elements or more columns than the ratio allows, the ratio is wrong for the content: suggest 16:9 or split into multiple visuals.

**9:16 locked frame spec:** inside the content box, add an inner content wrapper at `width: 100%`, `maxWidth: 380px`, centered, column direction, default gap `28px`. Usable card inner width = 380 − 40px padding = 340px; add that calculation as a code comment when sizing rows or grids. Narrow frames amplify overflow and connector-gap errors, so double-check edge alignment.

**16:9 wireframes go full-frame.** Let a wireframe fill the recordable area; do not impose an arbitrary max-width cap, and do not center a narrow column in a wide frame.

**Alignment rules:**

- Equal card widths via `flex: 1` on every card in a row; equal heights via `alignItems: "stretch"` on the container.
- Stacked cards in a vertical flow must all set `width: 100%` and `box-sizing: border-box` so left and right edges align. Never let a row of chips sit centered at content width while full-width cards sit below it.
- Keep wireframes as direct children of the content box; intermediate flex wrappers can shrink them unexpectedly.
- In multi-zone flows (input → filter → output), pull zone labels into their own row above the content, and make the label row replicate the content row's flex structure exactly (same ratios, spacers, gaps) so labels sit directly above their columns. The content row uses `align-items: stretch`.
- Inside parallel cards, corresponding elements (icon, title, description) must align horizontally across cards; force matching section heights with `minHeight` and verify the baselines match.
- Card header rows with a label and a badge need `gap: 16px` minimum.

**Width budget verification.** Before writing any multi-column layout, calculate: sum of element widths + spacer/arrow widths, compared against usable width (content box minus padding). Comment the math in the code (e.g., `<!-- Width budget: 3×400 + 2×40 = 1280 < 1440 usable -->`). This catches overflow before it renders.

### Static preview fit

Every static screenshot, thumbnail, and social graphic must be capturable in one screenshot with no scrolling at normal zoom, using the two-layer structure above with these primary dimensions:

| Ratio | Primary dimension | Layout default |
|---|---|---|
| 16:9 landscape | `width: 100%` | Two-column permitted |
| 1:1 square | `height: 100%` | Single-column preferred |
| 4:5 portrait | `height: 100%` | Single-column only |
| 9:16 vertical | `height: 100%` | Single-column only |

If a 4:5 or 9:16 static needs side-by-side cards or a dense multi-column layout, redesign it as a vertical composition or split it into multiple visuals. Never deliver a static visual that requires scrolling, zooming out, or cropping to capture the full canvas.

### Motion

Motion is deliberate and meaningful; every animation encodes information. Nothing moves for decoration.

**Pre-animation state:** all structural elements visible but muted before the animation fires: opacity `0.35`, text color `#555555`, `translateY(10px)`.

**Default easing:** `cubic-bezier(0.4, 0, 0.2, 1)`, stored as a const at the top of the file. For a small "settle" bounce on fills: `cubic-bezier(0.34, 1.4, 0.64, 1)`.

**Timing tokens:**

| Token | Value | Usage |
|---|---|---|
| step-delay | `1200ms` | Between sequential animation steps |
| section-pause | `1800–2400ms` | Between major conceptual sections |
| sub-stagger | `300–500ms` | Between sub-elements within a single card |
| micro-stagger | `80–120ms` | Per item inside grids and rows |
| total-target | `7–12s` | Full sequence for a typical 5–7 step artifact |

**Transition durations:** element reveals 0.8–1.0s; progress/width fills 1.2s with the bouncy curve; SVG path draws 1.2–1.8s for functional connectors and 2.0–3.0s for dramatic narrative paths; color/border transitions 0.8s; opacity-only 0.9s. **Nothing under 0.8s** except stagger delays. Technique-specific durations in the library override these tokens.

**Motion rules:**

- **Never use `transition: all`.** Specify exact properties (`opacity 1.0s ${ease}, transform 1.0s ${ease}`). `transition: all` interpolates every property on every frame and produces laggy, glitchy motion.
- **Never use CSS keyframe animations for temporary emphasis** (active-card glow, focus highlight); keyframes snap on and off. Use a transitioning `boxShadow` with a fully transparent off-state so the glow fades smoothly in and out. Keyframes are fine for persistent loops (a dot that pulses forever).
- Reveal elements in the sequence order so an editor has a sync point per beat; drive steps with `setTimeout` chains that are stored and cleared on replay.
- **Final resting state must be fully readable:** every element at opacity 0.85+, no permanently dim text. Emphasis contrast comes from color and scale, not unreadability.
- **Static images:** de-emphasized elements keep minimum opacity 0.6 on text and 0.5 on cards; hierarchy comes from color, scale, and border weight. Never leave any text below opacity 0.5 in a final visible state, and never use opacity as the sole good-vs-bad differentiator.

---

## Choosing the Technique

### Step 0: Identify the rhetorical move

Before scanning for structural signals, ask: what is this insight trying to do?

| Path | The insight's move | Primary candidates |
|---|---|---|
| A — Insight vs. status quo | Challenges the current default | A1, A2, H2 |
| B — Insight vs. competing ideas | Positioned against alternatives | A4, A3, A5, F5 |
| C — 2-part breakdown | Decomposes into two components | E6, E4, B6 |
| D — 3+ part breakdown | Decomposes into three or more parts | E3, J3, C3, C1 |
| E — Sequential process | Step-by-step method | B1, G4, B5 |

Pick the path serving the primary argument, use its candidates as the shortlist, and prefer the default pool. If no path fits (single statistic, quote, pure data), go straight to Step 1.

### Step 1: Identify content structures

| Structure | Signal phrases |
|---|---|
| Numeric variables → outcome | "depends on," "based on" |
| Named framework | "framework," "model," named stages |
| Statistical claims | Numbers, percentages, "study found" |
| Before/after contrast | "instead of," "from X to Y" |
| Sequential process | "first," "then," "step 1" |
| Concrete scenarios | 2+ named examples with details |
| Tradeoff or spectrum | "ranges from," "between X and Y" |
| Taxonomy | "types of," "categories," "three kinds" |
| Cause-and-effect | "leads to," "causes," "results in" |
| Cycle / feedback loop | "cycle," "loop," "reinforces" |
| Hierarchy / ranking | "most important," "foundation" |
| Part-to-whole | "makes up," "portion," percentages |
| Single dramatic statistic | One number carrying the segment |
| Reframe | "actually," "what if instead," "rethink" |

### Step 2: Match to technique

| Structure | Top techniques |
|---|---|
| Numeric variables → outcome | F1 |
| Named framework | E1, E2 |
| Statistical claims | D1, F3 |
| Before/after contrast | A1, A2 |
| Sequential process | B1, B5 |
| Concrete scenarios | I1, I2 |
| Tradeoff or spectrum | A5 |
| Taxonomy | E3 |
| Cause-and-effect | B5, B6 |
| Cycle / feedback loop | B6 |
| Hierarchy / ranking | C3, C4 |
| Part-to-whole | C1, C2 |
| Single dramatic statistic | F3, F4 |
| Reframe | H2, H1 |

### Step 3: Evaluate and combine

Choose the technique serving the primary insight; use secondary techniques as supporting elements (a framework with clickable scenario presets, a stat where the "before" number animates first).

### Step 4: Verify value

**"Does this visualization show something sequential text structurally cannot?"** Text cannot show two things at different visual weights simultaneously, proportion through scale, direction through motion, hierarchy through opacity and position, or the shape of a curve, cycle, or network. If the chosen technique only restates the words in card form, choose differently.

### Semantic animation principle

Every animated element must visually represent the concept it accompanies. Pick the primitive from the metaphor: SVG path drawing for journeys and connections, element-by-element reveals for frameworks, width/height transitions for quantities, position transitions for items changing state, staggered opacity for ordered sequences, glow transfer for attention. **Mental test: hide all text labels. If the animation could represent anything, redesign it.** Never use as the sole animation: a plain bar filling with no meaning, a bare fade-in, a border color change, or a progress bar that maps to nothing.

### Demonstrate, don't label

When a segment describes an action or capability ("it can create, edit, and organize files"), the visual must depict the action happening, not display the action's name in a card. **The failure test:** if the visual is a set of cards whose only content is the words the narration is already saying, it fails; the viewer gains nothing from reading the word they're hearing.

Common failure patterns: three cards labeled "CREATE," "EDIT," "ORGANIZE" with icons (a slide, not a visualization); a flow diagram where every element is a labeled box (a flowchart, not a demonstration); a grid of feature names with emoji (a list rendered as cards).

Instead, find the physical metaphor: "create" → a file shape materializes; "edit" → content bars visibly change width; "organize" → scattered elements slide into order; "cross-reference" → two sources dim as a third element brightens. The animation primitive enacts the verb.

---

## Technique Library

Techniques are grouped by communication goal. **Default pool (12):** these cover ~80% of segments; start here. **Specialist techniques:** use only when the content structure maps unambiguously to one and no default serves the primary insight as well.

### Category A: Comparison

- **A1. Before/After Split** *(default)* — Two versions of the same thing contrasted. Two-column layout in a shared row; left "BEFORE," right "AFTER"; red accent for worse, green for better. Animate left, pause, then right; final state shows both.
- **A2. Dimmed Contrast** *(default)* — Two options, one clearly recommended. Side-by-side cards sharing structure; recommended side full opacity with green/amber accent, discouraged side reduced via color and scale (never unreadable). Animate discouraged first, then recommended; the brightness contrast IS the argument. **Static override:** in static images opacity dimming is nearly invisible, so use small header badges (e.g., "LEGACY" / "EMERGING") with both cards at full opacity, differentiated by accent color.
- **A3. Toggle Comparison** — 2–3 modes compared one at a time. Tab buttons on top, content crossfades between states (0.5s); replay auto-cycles at 2400ms per state.
- **A4. Side-by-Side Scorecard** — Two items scored on the same criteria. Two cards with matching progress-bar rows; animate criteria rows one at a time, filling both sides simultaneously.
- **A5. Spectrum Positioning** — Items placed along a range. Horizontal bar with labeled endpoints; markers slide to final positions with stagger; add labeled zones if the segment defines categories.

### Category B: Process and Flow

- **B1. Step-by-Step Sequence** *(default)* — Ordered workflow. Numbered step cards with connecting arrows; card fades in → arrow draws → next card, 1200ms between groups. Label arrows with short badges when the transition carries meaning (see Labeled Arrow Connectors).
- **B2. Funnel Cascade** — Filtering or narrowing. Vertically stacked bars, each shorter; colors warm as it narrows (blue → amber → green); animate top-down.
- **B3. Branching Decision Tree** — A decision leading to different outcomes. Root node branches to children via SVG paths; branches draw, then children fade in.
- **B4. Pipeline Tracks** — Parallel processes. Horizontal lanes stacked vertically, each with an accent; lanes draw left-to-right (2s), staggered 500ms.
- **B5. Cause-and-Effect Chain** — Causal sequence. Nodes connected by directional arrows, animated sequentially; colors shift from cause (blue/amber) to effect (green/red). Label arrows when the mechanism matters.
- **B6. Cycle Loop** — Self-reinforcing process. Circular layout with curved SVG arrows animated around the loop; pause before the final arrow closes the cycle. **Static HTML caveat:** curved SVG paths don't reliably align with positioned nodes in static HTML, so for cycles in statics use a linear alternative (B1 with an outbound row and a return row).

### Category C: Hierarchy and Part-to-Whole

- **C1. Stacked Proportion Bars** — How a whole divides. One horizontal bar with colored segments animating left-to-right.
- **C2. Nested Containment** — Scope relationships. Concentric containers; boundary draws, then inner elements fade in.
- **C3. Pyramid / Tiered Stack** — Hierarchy on a foundation. Centered tiers, widest at bottom, built bottom-up so construction order enacts the dependency.
- **C4. Weighted Ranking** — Items ranked by magnitude. Horizontal bars sorted by length, animated top-down.
- **C5. Orbit Diagram** — Central concept with related elements. Center node first, then connections, then surrounding nodes.

### Category D: Transformation and Change

- **D1. Animated Data Reveal** *(default)* — Statistics that land harder with motion. Counters, bar fills, percentage reveals; for drama, animate the first number, pause, then the second.
- **D2. Growth Curve** — Compounding growth. SVG path drawing inside an axis frame (2s) with a "today" marker or highlighted region.
- **D3. Erosion / Depletion** — Something being used up. A filled container drains; color fades green → amber → red over 2–3s.
- **D4. Accumulation Stack** — Small actions adding up. Blocks stack with 300ms stagger; a bracket or total label lands last.
- **D5. State Transition** — Transformation where the change itself is the point. One visual area transitions between states; the motion carries meaning (up = improvement, splitting = decomposition).
- **D6. Timeline Progression** — Events at time points. Timeline bar draws first, then markers appear left-to-right at proportional positions.

### Category E: Framework and Structure

- **E1. Framework Mapper** — Named framework with labeled parts. Layout matches the framework's shape (linear → horizontal sequence, parallel → grid, layered → nested); animate in logical order.
- **E2. Matrix / Quadrant** — Two evaluation dimensions. 2×2 grid with labeled axes; grid, then labels, then items.
- **E3. Taxonomy Cards** *(default)* — Items sorted into categories. 2–4 labeled category cards with item chips inside; cards animate one at a time with glow transfer, internal items sub-stagger.
- **E4. Venn Overlap** — Shared and distinct properties. Overlapping translucent SVG circles; the overlap zone highlights last.
- **E5. Narrative Arc** — Story or tension pattern. An SVG arc with labeled points against a flat reference line.
- **E6. Equation / Formula** *(default)* — Factors combining into a result. Factor cards with operator symbols between them, result card visually distinct, animated left-to-right with glow transfer.

### Category F: Data and Quantitative

- **F1. Slider Calculator** — 2–4 variables producing a result. Sliders on the left (~55%), result card on the right; replay demos example positions.
- **F2. Progress Dashboard** — Multiple metrics. Grid of metric cards with progress bars filling simultaneously with sub-stagger.
- **F3. Counter Reveal** *(default)* — One dramatic statistic. Large centered Space Mono number (48–64px) counting up over 2s, label below.
- **F4. Gauge / Dial** — A measurement within zones. SVG semicircular arc with zones; needle sweeps to target.
- **F5. Grouped Bar Comparison** *(default)* — Quantities across categories. Grouped bars; groups appear one at a time, bars sub-stagger.

### Category G: Spatial and Relational

- **G1. Connection Map** — Relationships between entities. Nodes appear, then connection lines draw between them.
- **G2. Proximity Cluster** — Relatedness as distance. Central label with items at varying distances, animated center-outward.
- **G3. Spatial Metaphor Map** — An extended metaphor as a landscape. SVG landscape draws, then labeled markers appear.
- **G4. Flow Diagram** *(default)* — Structural transformation (splitting, merging, feeding into). Old structure → connectors → new structure; label the connectors when the transformation agent matters. In vertical layouts, use the Vertical Dot Flow connector.

### Category H: Emphasis and Framing

- **H1. Spotlight Isolation** — One item matters most. All items display, then non-focal items dim while the focal item brightens and scales up slightly.
- **H2. Reframe / Perspective Shift** *(default)* — Old belief replaced. Two states share the same position; state A (red/muted) transitions to state B (green/bright) with toggling labels.
- **H3. Scale Shock** — Surprising magnitude difference. Two elements at true proportional sizes; the small one appears first, then the large one expands.
- **H4. Annotation Overlay** — Callouts on an existing visual. Base visual at 80% opacity; SVG callout lines and badges appear one at a time.
- **H5. Directional Indicators** — Trends. Arrows or sparklines next to metrics; up-arrows slide up, down-arrows slide down.

### Category I: Scenarios and Presets

- **I1. Scenario Selector** — The segment contains 2+ concrete examples with specific values. Main visualization plus clickable preset cards ("TRY AN EXAMPLE"). Only build if the segment actually contains concrete scenarios.
- **I2. Case Study Cards** — 2–4 real examples with distinct outcomes. Equal cards in a row: title, one-line scenario (Inter), verdict badge; animated left-to-right with glow transfer.

### Category J: Miscellaneous

- **J1. Scorecard / Dashboard** — One item scored across criteria. Item card, then criteria rows with bars, verdict last.
- **J2. Quote / Callout Highlight** — One impactful sentence. Centered Space Mono text (24–32px) with accent-colored key words and a thin accent line; negative space is the point.
- **J3. Icon Grid / Feature List** *(default)* — 3–8 parallel items without hierarchy. Grid of small cards (icon, label, optional description), animated row by row.
- **J4. Countdown / Sequence Reveal** — Building to a punchline. Setup elements in muted text, long pause (2400ms), then the payoff element lands with scale and brightness.
- **J5. App Wireframe** *(default)* — A workflow inside a specific tool where the interface structure adds context. Minimal chrome shell (header bar with a colored dot + app name in Space Mono) over labeled panels matching the tool's real layout; panel contents stay abstract (gray bars, colored strips, grids). Stylized wireframe, not a screenshot. See App Wireframe Construction below.

---

## Reusable Component Patterns

Validated production patterns. Use them when the segment's structure matches.

### Series skeleton (number + divider + variable visual)

For scripts that walk through N parallel items where each gets its own visual inside a shared framework. Left side: a big numbered circle (72px, `#F59E0B18` background, `2px solid #F59E0B55` border) plus a stacked Space Mono label. A 1px vertical divider (`alignSelf: "stretch"`) separates the item-specific visual on the right (`flex: 1`). For items 2, 3, etc., swap only the right side.

### Active-card glow transfer

For sequential card reveals where attention should track the newest card. Each card gets a soft `boxShadow` glow while it is the most recent, and the glow fades (via transition, not keyframes) when the next card appears:

```javascript
boxShadow: isActive
  ? "0 0 24px rgba(245, 158, 11, 0.2), 0 0 48px rgba(245, 158, 11, 0.1)"
  : "0 0 24px rgba(245, 158, 11, 0), 0 0 48px rgba(245, 158, 11, 0)",
transition: `box-shadow 1.2s ${ease}`,
```

### Labeled arrow connectors

For arrows where the transition itself carries meaning (who or what does the work). A badge pill above the arrow line: `{color}18` background, `1px solid {color}44`, radius 6, padding `4px 10px`, Space Mono 9px bold label, optional emoji. Arrow is a 2px top border (solid = direct/automated, dashed = manual/indirect) with a CSS triangle arrowhead, and `padding: 0 10px` inside the connector container for breathing room.

### Timing-driven flow

For simple input → process → output movement where explicit arrows would add clutter. Zones sit left-to-right with 1px gradient traces between them (`width: 56px`, gradient `{color}66` to `{color}22`); the narrative comes from timing: sources appear first, then dim to 0.6 opacity as the processor brightens and glows, then the output appears from the processor's side. Use labeled arrows instead when the transition needs a label.

### Vertical dot flow connector

For directional flow between stacked elements in single-column layouts (9:16 especially), lighter than a full arrow. A column of 4px dots (gap 6, opacity starting 0.7 and decreasing 0.06 per dot) staggering in top-to-bottom at 100ms intervals, terminated by a CSS triangle arrowhead that arrives 500ms after the last dot.

### Mirrored container pattern

For two consecutive segments forming a deliberate A-vs-B pair across two separate visuals. Both share a pixel-identical header (icon box 40–48px + product name in Space Mono 13–14px bold + style badge pill) and identical sizing; only the content area below diverges, and accent colors differentiate the sides. The shared frame says "same kind of thing," the divergent content says "but they work differently."

### App wireframe construction

For J5 wireframes: header bar 32px, `#161616`, bottom border, colored dot or emoji + app name in Space Mono; body is a flex row of labeled panels matching the app's real layout; panel labels 10px `#888888`; panel contents are abstract bars, strips, and grids that animate independently. For browser tools, swap the app header for a chrome bar (traffic-light dots + URL bar).

### Verb-enacted parallel columns

For segments presenting action verbs as parallel items ("create, edit, organize"). Each column pairs an abstraction with a label, and each column's animation primitive performs its verb: materialize (fade + scale 0.92 → 1.0) for create, content-shift (bars change width/color) for edit, scatter-to-align (offsets and rotations resolve to zero) for organize. Failure test: if every column used the same fade-in, nothing would differentiate the verbs.

### SVG trace fan-out

For a hub connecting to multiple endpoints. SVG paths draw from the hub to each target with `strokeDashoffset`, sharing a horizontal trunk before branching at ~40–50% width (`M 0,midY L bendX,midY L svgW,targetY`); stroke at accent color, opacity 0.35, width 1.5, drawing 1.2s each in sequence with its target card. Keep `margin: 0 24px` around the SVG so traces never touch adjacent elements, and position hub sublabels absolutely so they don't push the hub off the trace axis.

### Capability badge accumulation

For "same base, plus more" superset comparisons. Cards share identical base structures (`alignItems: "stretch"` for equal height); the enhanced card adds a divider and capability badges (accent ✦ marker + Space Mono 9px label) staggering in at 500–600ms, while its border transitions to the accent with a glow. The visible empty space on the basic card IS the argument.

---

## Visual Argument Principles

These govern argument-based visuals (comparisons, capability demos, contrasts) on top of everything above.

1. **Argument-first design.** Extract the one-sentence argument before touching any code. The visual illustrates that sentence and nothing else. If you can't state the argument, you don't understand the segment well enough to design for it.
2. **Argument-to-layout mapping.** Map the argument's structure to a layout family before designing: binary comparison → side-by-side, multi-variable → matrix, process → flow, binary choice → fork, before/after → split or stacked panels.
3. **Fill the canvas.** No large empty areas in any card or panel. If one side of a comparison has less content, make that content expand (larger blocks, stronger emphasis) so the difference reads as meaning.
4. **Symmetric endpoints.** Both sides of a comparison must reach the same conclusion state (both "done," both produce an output). The argument is about *how* they get there, not *whether*. Asymmetric endpoints confuse the claim.
5. **Plural category labels.** When comparing one tool against a category, use the plural ("OTHER MODELS," not "OTHER MODEL"). The argument is about the category.
6. **Concept vs. composition errors.** Before iterating on a revision, diagnose the error type. Concept error = wrong argument illustrated; re-extract the argument. Composition error = right argument, wrong execution; iterate on layout only. Treating a concept error as a composition problem wastes cycles.
7. **Show the cause, not just the effect.** When the argument is "X causes Y," show both the mechanism and the result. Different outputs alone leave the viewer guessing why.
8. **Parallel internal structure for comparisons.** Compared panels share the same row count, element types, and hierarchy. The difference lives in content and color, never in organization, or the viewer compares layouts instead of arguments.
9. **Verify the concept before designing technical distinctions.** When the segment describes a technical distinction, state the distinction in your own words first. A misunderstood distinction is a concept error no layout iteration can fix.
10. **Match visual density to surrounding copy.** Inside text-heavy content, go more abstract and scannable; the visual counterbalances the copy. Reserve denser visuals for contexts where the visual stands alone.
11. **One dominant color per card.** A second accent inside a card disorients the viewer. For internal contrast, use opacity and brightness within one color family.
12. **Recognizable shapes at reduced scale.** For visuals viewed small (thumbnails, previews), use universally recognizable shapes (chat bubble, document, magnifier) over custom abstract metaphors. Test: "Would someone scrolling past at 50% zoom identify this shape in under one second?"
13. **Uniform complexity across parallel elements.** All elements in a set (icon grid, tool row) share the same stroke complexity. Mixing simple and intricate shapes makes the intricate ones look broken. Calibrate to the simplest.
14. **Match visual withholding to copy withholding.** If the surrounding copy uses a curiosity gap, the visual must preserve it: show differentiation abstractly without revealing the answer the copy is teasing.
15. **Abstraction over literal labeling at thumbnail scale.** At small sizes, labels duplicate the caption and kill curiosity. Abstract patterns (selective emphasis, structural contrast) make the viewer feel the concept before reading.
16. **Proportional canvas fill for thumbnail deployment.** When the visual renders small, distribute elements across both axes; a single row in 16:9 leaves the vertical axis dead at thumbnail size.
17. **Enact constraints, don't declare them.** For limits and finite resources (context windows, quotas, caps), show the container filling, the boundary being hit, and the consequence (displacement, rejection). The moment of violation IS the argument.
18. **Element-level stagger for editor flexibility.** (Animated.) Every visually distinct element gets its own animation step, not bundled with its section. More beats = more sync points an editor can align to narration. Governing question: "If the editor wanted to reveal this element at a different moment than its sibling, could they?"
19. **Single directional axis for bounded-vs-unbounded comparisons.** When comparing a capped resource against an unlimited one, both sides grow in the same direction; the bounded side stops short, the unbounded side keeps going. Same axis, different length.

---

## Code Requirements

**Animated HTML (the default):**

- One self-contained `.html` file: complete document with `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
- `<meta charset="utf-8">` in `<head>` so labels, arrows, and glyphs render correctly.
- All CSS and JS inline. No external component libraries, no build step, no framework runtime. Google Fonts load via `@import` in the `<style>` block. No localStorage or sessionStorage.
- Animation driven by vanilla JS (timed class toggles or inline style changes) with CSS transitions; timers stored so replay clears and restarts them cleanly.
- Replay control lives outside the content box (a child of the viewport wrapper) so it never appears in a screen recording: absolute, bottom 8px, right 12px, `#1A1A1A` background, `#888888` text, `1px solid #2A2A2A`, radius 8px, padding `6px 16px`, Space Mono 11px, opacity 0.5 (0.9 on hover). Label it `PLAY`; use a CSS triangle for the play indicator rather than relying on the `▶` glyph unless UTF-8 rendering is verified.

**Static HTML:**

- Same self-contained structure and preview-fit rules. No JavaScript, no play button, no interactivity.

**JSX (only when the environment is known to render it):**

- One default-export React functional component, no required props; hooks limited to `useState`, `useRef`, `useCallback`, `useEffect`; inline style objects only (no Tailwind, no component libraries); fonts and keyframes in a `<style>` tag inside the return; all timeouts stored in a ref and cleared on re-trigger or unmount.

---

## Conflict Resolution

1. **Spec trumps aesthetic preferences.** If a request conflicts with this system (light backgrounds, 6+ accent colors, text below 10px), follow the spec and explain the constraint.
2. **Reduce content before shrinking text.** If content doesn't fit the ratio, remove lower-priority elements or split into multiple visuals. Never shrink below 10px or allow overflow.
3. **If no technique fits cleanly, default to E3 (Taxonomy Cards) or J3 (Icon Grid).** They handle miscellaneous content gracefully.
4. **If a segment is too complex for the requested dimensions, say so.** Suggest a different ratio or a split. Never silently compress.

---

## Concept Card

Before writing any file, present this and get approval:

1. **Argument**: the one-sentence claim the visual must make.
2. **Rhetorical intent**: the moment this is and what the viewer should feel.
3. **Technique selected and why**: chosen from *this* segment, not a prior piece.
4. **Layout plan**: composition for the target dimensions.
5. **On-screen text plan**: exact labels (target-segment text only).
6. **Format and dimensions**: e.g. animated HTML, 16:9.
7. **Known QA risks**: overflow, connector gaps, broken glyphs, and the guard for each.

For the rhetorical intent, keep two layers distinct: the *intent* (what this moment must accomplish and what the viewer should feel; this transfers to future segments of the same type) and the *implementation spec* (metaphor, sequence, constraints; disposable when the content changes). Stating intent first means a new segment of the same type reuses the reasoning even when the visual is rebuilt.

When a segment is ambiguous, frame the clarifying question as a choice between two interpretations ("emphasize the difference, or show how to get from A to B?"), or make a best-effort call and state the reasoning.

---

## Quality Checklist

**Tier 1 runs on every visual. Tier 2 runs on piece 1 of a new series only**; once verified there, those items are locked by the series spec and inherited by later pieces (and Tier 2 runs in full for every standalone visual).

### Tier 1 — always run

**Render verification (open and render the file; a file that compiles is not a file that renders):**

- [ ] The artifact actually opens and displays (not a blank frame or error).
- [ ] Frame matches the requested dimensions.
- [ ] No overflow; nothing clipped; no scrolling required.
- [ ] Replay control is outside the content box and visible (animated only).
- [ ] Connectors touch their intended elements with no gaps or overlaps.
- [ ] No garbled glyphs anywhere (labels, arrows, play control).
- [ ] Final resting state fully readable (every element at opacity 0.85+).
- [ ] Static deliverables fit one screen for capture at normal zoom, using the preview-fit structure.

**Visual communication:**

- [ ] Shows something sequential text structurally cannot.
- [ ] Core concept lands within 5 seconds of the animation completing.
- [ ] Every animated element is semantic (hide the labels and it still suggests the idea).
- [ ] Demonstrates the action, doesn't label it.
- [ ] One core metaphor; no mixed visual languages.

**Animation timing (animated only):**

- [ ] 1200ms between sequential steps; 1800–2400ms between major sections; 300–500ms sub-stagger.
- [ ] Total duration 7–12s; every element absorbed before the next appears.
- [ ] Default easing; nothing under 0.8s except stagger delays; glows via transitioning boxShadow, not keyframes.

**Content integrity:**

- [ ] All on-screen text comes from the target segment; nothing invented.
- [ ] Abstraction level matches the segment (no borrowed concrete details).
- [ ] Zero sentences on the canvas; labels, keywords, values only.
- [ ] No headlines or bottom taglines (unless the series pattern requires them or you explicitly asked).

**Code quality:**

- [ ] Self-contained file; UTF-8 meta tag; inline CSS/JS; no external dependencies.
- [ ] Replay resets cleanly; timers cleared on re-trigger.

### Tier 2 — piece 1 of a series (and standalone visuals)

- [ ] Only Dark Console colors; max 5 accents; accents semantically assigned; abstract content in neutral gray.
- [ ] Space Mono for names (uppercase), Inter for descriptions (sentence case); every text element passed the naming-or-explaining test; nothing below 10px.
- [ ] Two-layer viewport architecture with the global CSS reset; content box has its primary dimension at 100% and the correct aspect ratio.
- [ ] Ratio-specific structural rules met (element caps, single-column rules, padding).
- [ ] Full-width edge alignment in vertical flows; parallel cards internally aligned; header rows have gap 16+; dividers flex.
- [ ] Element sizing verified against container inner width (width budget commented).
- [ ] Pre-animation state correct (muted at 0.35 opacity).
- [ ] Series spec matched (frame, colors, easing) if one exists.
- [ ] The final resting state works as a standalone image.

---

## Worked Examples

Generic examples of the prompt structure in action. Build your own library here as you produce visuals; when a new pattern proves reusable, add it to the sections above.

### Example 1, Reframe (animated, 9:16)

```
9:16 vertical animation.
Segment: "Most people think this is a bad thing. It's not, it's the flip side of something you actually want."
Context: [paste the surrounding argument]

Reframe (H2). One card of abstract output bars is framed first as a negative,
then reframed as a positive, the same visual content under two labels.
One card with 6 abstract bars of varying width. Above it, a NEGATIVE label
appears first in red and the bars/border tint red. After a pause the red
lifts (label dims through three stages) and a POSITIVE label appears below
in amber; bars and border transition to amber. The unchanged bars are the
argument: the content is identical, only the frame changed.

Sequence: card + bars appear muted → NEGATIVE activates red → pause →
red lifts, label dims → POSITIVE appears, bars + border go amber with glow.
Colors: Red = negative frame, Amber = positive frame.
```

### Example 2, Comparison (animated, 9:16)

```
9:16 vertical animation.
Segment: "The better you do this, the less it costs, leaving you more headroom."
Context: [paste the surrounding argument]

Comparison (A2). Two rows in one card: the inefficient path (many segments, high
meter) vs. the efficient path (fewer segments, low meter). The top row dims
when the bottom row gets emphasis.
One card, two rows split by a divider. Top: 6 red segments, usage meter
fills to ~85%. Bottom: 3 green segments, meter fills to ~38%. The contrast
in count and fill IS the argument. No descriptive text.

Sequence: card appears → top row activates (red, meter to 85%) → bottom row
activates (green, meter to 38%) → top row dims, card border glows green.
Colors: Red = inefficient/high cost, Green = efficient/low cost.
```

### Example 3, Constraint enactment (animated, 9:16)

```
9:16 vertical animation.
Segment: "Think of it like a whiteboard. Every session has a fixed-size whiteboard,
and once it's full, nothing new fits without losing what came before."
Context: [paste the surrounding argument]

Constraint enactment (D3). A whiteboard card fills row by row until full, then
demonstrates displacement: new content forces old content out. Enacts the
constraint rather than labeling it.
A card labeled "WHITEBOARD" with 7 content rows (only 6 fit). Rows fill
sequentially as blue bars. After 6 rows, a FULL badge appears in amber. Then
displacement: row 1 becomes a red dashed ghost while row 7 appears in its
place. The card border phases blue → amber → red to track the narrative.
The moment of displacement IS the argument: the viewer sees what "losing
what came before" looks like.

Sequence: card appears → rows 1–6 fill (blue, 400ms stagger) → FULL badge
(amber) → pause → row 1 ghosts (red dashed), row 7 appears.
Colors: Blue = content filling the space, Amber = full warning, Red = loss.
```

### Example 4, Flow with dot connector (animated, 9:16)

```
9:16 vertical animation.
Segment: "Everything you love about the output, the writing, the ideas, flows
downstream from this one source. You can't have one without the other."
Context: [paste the surrounding argument]

Flow diagram (G4, vertical). A source card flows downstream to two output
cards through a vertical dot flow connector. Single amber accent throughout.
Top: a SOURCE card (✨ icon + amber label) with 4 abstract content bars.
Below it: a column of 5 amber dots with decreasing opacity ending in a CSS
triangle arrowhead. Bottom: two smaller output cards stacked (WRITING ✏️
and IDEAS 💡), each with 2 small bars that form as the flow reaches them.
The directional flow IS the argument: the source feeds everything below it.

Sequence: structure appears muted → SOURCE activates (bars form, border
glows amber) → dots draw downward with 100ms stagger → WRITING activates →
IDEAS activates.
Colors: Amber throughout (single source, single accent).
```

### Example 5, Static social graphic (static, 4:5)

```
4:5 static image, one accent color.
Segment: [paste the post or excerpt the visual must communicate]
Context: [paste the post's core argument in one line]

Weighted ranking (C4). The post's three points as horizontal bars of
decreasing weight inside a single card, so the hierarchy reads at a glance
without explanatory text.
One full-width card with three rows: each row has a Space Mono label
(1–3 words, from the post's own phrasing) and an abstract bar; bar lengths
descend to encode priority. The top row carries the amber accent and a
subtle glow; rows two and three stay neutral gray at full readability.
The descending bar lengths ARE the argument.

Colors: Amber = the featured point; neutral gray = supporting points.
(Static: full preview-fit structure, no JavaScript, no play control.)
```

---

[2026-07-07] Added argument-first layout selection, reusable component patterns, and exact static preview-fit rules for fixed-ratio outputs.
[2026-07-11] Voiceover behavior became the built-in default (mode selection removed from the prompt template and checklist), and the file was enriched to full parity with the source system: exact color/typography/component tokens, dimension-specific layout and motion specs, the complete technique library with the selection process, all 19 visual argument principles, nine reusable component patterns, code requirements, conflict resolution, the tiered Quality Checklist, and three new worked examples.

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
