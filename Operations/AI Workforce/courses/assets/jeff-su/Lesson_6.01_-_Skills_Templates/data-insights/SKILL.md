---
name: data-insights
description: >
  Analyze any structured dataset and present findings as an interactive live
  artifact (show_widget). Use this skill whenever you upload a CSV, spreadsheet
  export, survey responses, analytics data, financial data, or any tabular dataset
  and ask to "analyze this," "surface insights," "what does this data tell us,"
  "go through the responses," "break this down," "show me patterns," or "present
  findings." Also trigger when you share raw data and ask for a dashboard,
  report, or visual summary, even if you don't say "analyze." Do NOT trigger
  for spreadsheet creation or editing (.xlsx manipulation): that's the xlsx
  skill. Do NOT trigger for chart-only requests with no underlying dataset to
  explore.
---

# Data Insights

## Context Loading

Read these files before proceeding:
1. Root `MEMORY.md` - check Active Projects for context on what this data relates to
2. The relevant workstation's `CLAUDE.md` and `MEMORY.md` if the data clearly belongs to a domain (for example, survey data for a speaking engagement loads that workstation's context)
3. `00_Reference/Voice Principles.md` - insights and narrative framing are written in your voice

If the data's domain is ambiguous, ask which project or workstation it connects to.
Context changes interpretation: the same satisfaction score means different things
for a new product vs. an established one.

## Workflow

### Phase 0: Assemble the data

When the analysis requires data from multiple sources, assemble before analyzing:

1. **Identify all data sources.** The analysis may require combining structured files (CSV, XLSX), screenshots of dashboards or platform UIs, existing spreadsheets with historical data, and accumulated context from MEMORY.md or project files. List every source and what it contributes.
2. **Extract from each source.** For CSVs: read or parse with bash or Python. For screenshots: extract the tabular data visible in the image into structured form. For existing spreadsheets or dashboards: note the current values as the baseline. For MEMORY.md: pull historical benchmarks or prior review numbers.
3. **Reconcile overlapping data.** When two sources report the same metric with different values (for example, a snapshot taken last week vs. a live dashboard today), identify which is more current and note the discrepancy. Trailing metrics (email opens that accumulate over time) naturally diverge between snapshots.
4. **State the assembled dataset.** Before proceeding to Phase 1, confirm what data you have, from which sources, and any gaps that require additional exports.

Skip Phase 0 when a single structured file contains everything needed.

### Phase 1: Understand the dataset

Before any analysis, orient yourself:

1. **Read the full dataset.** Don't sample. For files under 500 rows, read everything. For larger files, read the full file but note if you're working with a subset.
2. **Inventory the columns.** Categorize each as: categorical (finite set of values), numeric (continuous or discrete), free-text (open-ended responses), or temporal (dates, timestamps). This categorization drives which analytical techniques apply.
3. **Check data quality.** Note: duplicate rows (and whether they're true duplicates or repeat submissions), missing values, inconsistent formatting (for example, "ChatGPT" vs "chatGPT"), outliers. Fix what you can silently (trimming whitespace, normalizing case). Flag what requires a judgment call.
4. **Count the real N.** Deduplicate if needed. State the final respondent or record count and how you arrived at it. If you removed records, say which and why.

### Phase 2: Choose the analytical approach

The data type determines what to look for. Apply the relevant lens:

**Survey or questionnaire data:**
- Distribution analysis on every structured field (comfort level, role, multi-select)
- Theme clustering on open-ended responses (group by intent, not keywords). Apply the same clustering order as Customer feedback: dissatisfied first, then check echoes in satisfied, then identify positive-only differentiators.
- Cross-tabulation between structured fields and themes (do beginners want different things than power users?)
- Standout respondents worth calling out individually

**Financial or metric data:**
- Summary statistics (totals, averages, medians, ranges)
- Time-series trends (growth rates, inflection points, seasonality)
- Composition breakdowns (what percentage does each category contribute?)
- Anomaly detection (which data points break the pattern?)

**Customer feedback or reviews:**
- Sentiment distribution
- Theme clustering by complaint or praise category. **Clustering order:** start with dissatisfied or negative responses, these surface the highest-leverage fixes. Then check if the same themes appear in satisfied responses (indicating the theme is universal, not just a pain point). Finally, identify themes that only appear in positive responses (these are differentiators to protect).
- Severity and frequency matrix (what's both common AND painful?)
- Verbatim quotes that crystallize each theme

**Content analytics or performance data:**
- Distribution of performance metrics
- Top and bottom performers with hypotheses for why
- Correlation analysis (does X predict Y?)
- Trend lines with context for inflection points

**General tabular data:**
- Start with distributions of every categorical column
- Cross-tabulate the two most interesting dimensions
- Look for the 80/20: which small group accounts for a disproportionate share?
- Surface the most surprising finding, the thing that contradicts the obvious assumption

**Temporal pattern mining (any data type with timestamps):** When the dataset includes dates or timestamps spanning multiple weeks or months, segment by time period and compare. Check: did satisfaction shift after a specific date? Do recent responses cluster around different themes than older ones? Are there inflection points that correlate with known events (product updates, launches, seasonal changes)? Report temporal patterns as a dedicated section or insight callout, not buried in other findings.

For any data type, always ask: "What would I change based on this finding?" If the answer is "nothing," the finding doesn't earn a place in the artifact.

### Phase 3: Build the live artifact

Use the `show_widget` tool (mcp__visualize__show_widget) to create an interactive
HTML widget. Call `read_me` first with the appropriate modules (typically
`["chart", "interactive", "data_viz"]`).

**Artifact structure, use tabs to separate analytical lenses:**

Tab 1 is always the overview: summary metric cards plus the single most important
distribution chart. This tab answers "what am I looking at?" in under 5 seconds.
If Phase 1 found data quality issues (template placeholders, duplicates removed,
missing values, inconsistent formatting), include a data quality callout on Tab 1
using an insight-box with a warning icon. State what was found and how it was
handled (for example, "12 responses contained template placeholders, excluded from
email-based analysis"). This surfaces data hygiene to the reader instead of hiding
it in the chat narrative.

Subsequent tabs go deeper into specific dimensions. Typical patterns:
- Tab 2: Theme or category deep-dive (clusters, verbatim quotes, sub-distributions)
- Tab 3: Cross-tabulation or tool/channel breakdown
- Tab 4: Mapping findings to actions (how insights connect to decisions)

Not every dataset needs four tabs. Two is fine for simple data. The test: would
removing a tab lose information the reader needs? If not, cut it.

**Component selection guide:**

| Data pattern | Component | When to use |
|---|---|---|
| Single summary number | Metric card | Always lead with these. 2 to 4 per row. |
| Category distribution | Horizontal bar chart | When comparing sizes across 3 to 15 categories |
| Proportion of whole | Metric cards with percentages | Prefer over pie charts (more scannable) |
| Open-ended text themes | Theme cards with quote excerpts | Group by intent, show count plus representative quotes |
| Time series | Line chart (Chart.js) | 5+ time points with a meaningful trend |
| Comparison across groups | Side-by-side metric cards or grouped bars | When cross-tabulating two dimensions |
| Key narrative insight | Insight callout (left-border accent box) | 1 to 2 per tab max. The "so what" of the data. |
| Mapping to actions | Section cards with highlight tags | When connecting findings to specific decisions |
| Benchmark comparison | Side-by-side cards with old/new/delta | When comparing current data against a historical reference point |

**Design patterns (codified from the visualize tool's design system):**

Metric cards:
```html
<div class="metric">
  <p class="metric-label">[13px, secondary color]</p>
  <p class="metric-value">[24px, font-weight 500]</p>
  <p class="metric-sub">[12px, secondary color, optional context]</p>
</div>
```

Horizontal bar charts (CSS, not Chart.js, better for categorical data under 15 items):
```html
<div class="bar-row">
  <span class="bar-label">[category name, right-aligned, ~180px]</span>
  <div class="bar-track">[background track]
    <div class="bar-fill" style="width:[pct]%;background:[color]">[count]</div>
  </div>
  <span class="bar-count">[percentage]</span>
</div>
```

Insight callouts:
```html
<div class="insight-box">
  <p><i class="ti ti-[icon]"></i> [Insight text, one to three sentences max]</p>
</div>
```

Theme cards (for clustered open-ended responses):
```html
<div class="theme-card">
  <p class="theme-title"><i class="ti ti-[icon]"></i> [Theme name] <span class="highlight">[N mentions]</span></p>
  <p class="theme-quotes"><em>"[verbatim 1]"</em> ... <em>"[verbatim 2]"</em></p>
</div>
```

**CSS conventions:**
- All colors via CSS variables (--color-text-primary, --color-background-secondary, etc.) or the visualize palette ramps
- Use the primary accent ramp consistently for the main category color
- Use teal, coral, blue as secondary category colors
- Tabs for navigation between analytical lenses (JS-driven show/hide post-streaming)
- No gradients, shadows, or decorative effects
- Font sizes: labels 13px, body 14px, metric values 24px, section headers 15px weight 500
- All text uses CSS variable colors for dark mode compatibility
- Include `<h2 class="sr-only">` at the top for screen reader accessibility

**Tab implementation pattern:**
```html
<div class="tabs">
  <button class="tab active" onclick="showTab('overview')">Overview</button>
  <button class="tab" onclick="showTab('details')">Details</button>
</div>
<div id="overview" class="section active">...</div>
<div id="details" class="section">...</div>
<script>
function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}
</script>
```

### Phase 4: Surface narrative insights

After building the artifact, write a concise narrative summary in the chat
response (outside the widget). This is where the analytical value lives.

Structure the narrative as:
1. **Lead with the most important finding.** The single insight that should change what you do next. One to two sentences.
2. **Supporting findings.** Two to four additional insights, each one to two sentences. Order by actionability, not by how interesting they are.
3. **Gaps or caveats.** What the data doesn't tell us. What would need a different dataset to answer.

The narrative should feel like a smart analyst briefing a decision-maker, not like
a report describing charts. Every sentence should pass the "so what" test.

## Output Format

The skill produces two outputs:

1. **Live artifact** (via show_widget) - the interactive dashboard described in Phase 3. Title should be descriptive and snake_case (for example, `survey_analysis`, `q2_revenue_breakdown`, `feedback_clusters`).

2. **Chat narrative** - the analytical summary described in Phase 4. Follows your voice principles: answer first (Minto Pyramid), 150 to 400 words for complex analysis, no hype, no formatting beyond what's needed. Include a "gap to address" callout if findings reveal unserved needs or unanswered questions.

## Constraints

**Accuracy over speed.** Count everything manually from the source data. Do not estimate distributions, compute them. If a percentage doesn't add to 100%, find the error before publishing.

**Verbatim quotes are verbatim.** When displaying respondent quotes in theme cards, use the exact text from the dataset. Trim for length if needed (use "..." for omissions), but never paraphrase or clean up grammar. The authenticity matters.

**Don't describe the chart.** The narrative summary should add interpretation the artifact can't show on its own. "33% of respondents are daily users" is visible in the chart. "The daily-user cohort skews heavily toward engineering roles, which means the technical demos will land with a third of the room" is analysis.

**Respect the visualize tool's design system.** Always call `read_me` before the first `show_widget` call. Use CSS variables for colors. No gradients, shadows, or dark backgrounds on outer containers. Keep `<style>` blocks lean. Scripts execute after streaming.

**Round every displayed number.** Use Math.round(), .toFixed(n), or Intl.NumberFormat. No floating point artifacts on screen.

**Multi-select fields need special handling.** When a column contains comma-separated values (for example, "ChatGPT, Claude, Gemini"), split and count each value individually. The total mentions will exceed the respondent count, state both numbers clearly (for example, "56 respondents, 179 tool mentions").

## Edge Cases

**Small datasets (under 10 rows):** Skip the live artifact. Present findings as structured text in the chat response. A dashboard for 6 data points is theater.

**No numeric columns:** Default to theme clustering and distribution analysis on categorical fields. The artifact leans on theme cards and bar charts rather than metric cards with computed values.

**Dirty or inconsistent data:** Fix silently where the intent is unambiguous (whitespace, case normalization, obvious typos in categorical fields). Flag anything ambiguous before proceeding: "I found 3 entries with [issue]. Should I treat them as [interpretation A] or [interpretation B]?"

**Dataset with no clear "question":** If you upload data without specifying what to look for, start with distributions of every column and surface the most surprising finding. Lead the narrative with: "Here's what jumped out, [finding]. Want me to dig deeper into any of these dimensions?"

**Very large datasets (500+ rows):** Use Chart.js for visualizations instead of CSS bar charts (they handle large category counts better). Consider sampling for theme clustering on open-ended text, but compute distributions on the full dataset.

**Repeat analysis on updated data:** If this skill has run before on a similar dataset (for example, monthly analytics), reference the previous analysis in the narrative. Highlight what changed, not just what is.

**Benchmark comparison:** When analyzing a dataset that has a historical reference point from a different source (for example, current campaign CSV vs. previous campaign data in a spreadsheet, this quarter's metrics vs. last quarter's from a dashboard), include a dedicated "vs benchmark" tab or section in the artifact. Use side-by-side comparison cards with old value, new value, and delta (with directional color: green for improvement, coral for decline, gray for neutral or expected). Always contextualize whether deltas are meaningful or expected: a 72% volume decline when price increased 41% is a different story than the same decline at constant pricing. When the benchmark comes from a different source than the primary dataset, note this in the data quality callout so the reader knows the comparison isn't apples-to-apples on methodology.

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
