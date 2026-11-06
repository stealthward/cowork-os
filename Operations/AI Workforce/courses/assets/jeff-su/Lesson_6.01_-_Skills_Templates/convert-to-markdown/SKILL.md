---
name: convert-to-markdown
description: >
  Decompose any PDF or image attachment into token-optimized markdown text
  and separate image files. Use this skill whenever you attach a PDF, screenshot,
  or image and say "convert this," "convert to markdown," "extract this,"
  "optimize this," "markdown this," "pull the text out," or "make this readable."
  Also trigger when you attach a PDF (email thread, newsletter, webpage,
  report, or any document) without explicit instructions: the default assumption
  is that you want the content extracted for efficient AI processing.
  Trigger on any attachment where the likely next step is feeding the content
  to an AI tool. Do NOT trigger for PDF form filling (that's the pdf skill),
  spreadsheet data extraction (that's xlsx), or when you explicitly ask
  to summarize or act on the content without wanting the raw extraction.
---

# Convert to Markdown

## Context Loading

Context is loaded *after* extraction, not before, because the routing decision
depends on understanding what the content contains.

After the extraction script runs:
1. Root `CLAUDE.md` - routing map to match extracted content to a workstation
2. Root `MEMORY.md` - active projects to match content against

These are only needed for Phase 3 (Route). The extraction itself is stateless.

## Workflow

### Phase 1: Extract

Run the bundled extraction script against each attachment. The script handles
input type detection automatically (email thread, single email, webpage, document,
or image).

```bash
python3 <skill-path>/scripts/extract.py \
  <file1> [file2] [file3] ... \
  <output-dir>
```

**Output directory convention:** The output directory name depends on single
vs. batch mode:
- **Single file:** `98_Temp/<temp-name>/` where `<temp-name>` is derived from
  the source filename. The script writes content.md, manifest.md, and images
  directly into this folder (no subfolder). After Phase 2 analysis, rename
  the folder to `YYYYMMDD <Descriptive Name>` (see Phase 2 naming step).
- **Batch (multiple files):** `98_Temp/<temp-name>/` with a subfolder per
  input file. Same rename convention applies to the parent folder.

**Dependency note:** The script requires `pymupdf` (imported as `fitz`). For image
OCR, `pytesseract` and `Pillow` are also needed, and `tesseract` must be available
as a system binary. If a dependency is missing, ask before installing it and prefer
the current environment's normal package flow or a temporary local environment.
Do not force system-package overrides unless you explicitly approve.

After the script runs, read the JSON output it prints to stdout. This contains
the extraction results: type detected, word count, image count, and file paths.

### Phase 2: Analyze

Read the extracted `content.md` file(s). Identify:
- **Who** - sender(s), recipient(s), author, organization
- **What** - subject matter, key topics, action items
- **When** - dates, deadlines, time-sensitive content
- **Content type** - email thread, newsletter, report, article, correspondence

For email threads: note the participants, date range, and key topics discussed.
For webpages: note the source URL and content category.
For documents: note the title, author, and subject domain.

**Naming step:** After analyzing the content, rename the output folder from its
temp name to `YYYYMMDD <Descriptive Name>`, where YYYYMMDD is the extraction
date. The descriptive name should be short (3 to 8 words) and capture the
content's identity at a glance. Naming patterns by content type:
- Email threads: `YYYYMMDD <Organization> <Subject> - Email Thread`
- Documents: `YYYYMMDD <Title or Subject>`
- Webpages: `YYYYMMDD <Site> <Page Title>`
- Images: `YYYYMMDD <Description> - OCR Extract`

Cap the descriptive portion at 80 characters to avoid filesystem path issues.
Use `mv` to rename (safe even with hidden system files inside).

### Phase 3: Route

Load root CLAUDE.md (routing map) and root MEMORY.md (active projects). Match
the analyzed content against:

1. **Active projects** - Does this content relate to a project in the Active
   Projects dashboard? If so, which one?
2. **Workstation** - Which workstation owns this domain? Use the routing map
   to determine the best fit.
3. **Actionability** - Is there something to act on (reply needed, task to
   capture, information to file), or is this purely reference material?

Present a brief routing proposal:
- What the content is (one sentence)
- Which project or workstation it maps to (if any)
- One or two suggested next actions (specific, not generic)

**Examples of good routing proposals:**
- "This is a 26-message email thread about a vendor onboarding. Maps to your
  Vendors workstation. Want me to extract action items and update the project
  notes?"
- "This is a conference logistics email with shuttle times and badge pickup
  details. Maps to an active Travel project. Want me to update the project
  MEMORY.md with the new logistics details?"
- "This is a landing page saved as PDF. It appears to be reference material,
  but I don't see an active project or workstation that clearly owns it.
  Leave it in 98_Temp, or tell me where it belongs?"
- "I don't recognize the domain for this content. Here's what it contains:
  [brief summary]. Which workstation should I route it to?"

### Phase 4: Act

Execute whatever you approve. This could be:
- Loading a workstation and processing the content further
- Updating a project MEMORY.md with extracted information
- Filing the markdown in a specific location
- Simply leaving the files in `98_Temp/` for manual use
- Nothing: you just wanted the extraction

Do not act without confirmation. The extraction outputs are always produced
regardless of whether you want further action.

## Output Format

**Single file** - files sit directly in the named folder (one level):

```
98_Temp/YYYYMMDD <Descriptive Name>/
+-- content.md        - Full text as clean markdown
+-- image-01.png      - Extracted images (if any)
+-- manifest.md       - Stats: type, pages, words, images, token savings
```

**Multiple files** - one subfolder per input file:

```
98_Temp/YYYYMMDD <Batch Description>/
+-- <source-name>/
|   +-- content.md
|   +-- manifest.md
+-- <source-name-2>/
|   +-- ...
+-- summary.md            - Batch overview
```

**Email threads** get special formatting: each message becomes an H3 block
with sender, date, To/Cc metadata, and body. Messages appear in chronological
order. Email footer artifacts and `[Quoted text hidden]` markers are stripped.

**After extraction, present:**
1. One-line summary per file: type detected, word count, image count
2. Token savings estimate (from the manifest)
3. Routing proposal (Phase 3)

Keep the presentation concise. The manifest holds the details.

## Constraints

- **Never skip extraction to go straight to summarization.** The purpose of
  this skill is to produce the markdown files. Analysis and routing are
  secondary. Even if the ultimate goal is to act on the content, the
  extraction step always runs first.
- **Preserve all text.** The markdown output must contain every word from
  the original. This is a lossless conversion, not a summary. The only
  content removed is PDF rendering artifacts (page footers, browser chrome,
  `[Quoted text hidden]` markers).
- **Image filtering.** Skip images smaller than 80x80px or under 10,000px squared
  total area: these are typically spacer GIFs, tracking pixels, social
  media icons, or email signature buttons. Deduplicate identical images
  that appear on multiple pages.
- **Batch processing.** When multiple files are attached, process all of them
  in a single script invocation. The script handles batch output structure
  automatically.
- **File placement.** Extraction outputs always land in `98_Temp/`. Only move
  files elsewhere if you explicitly approve during Phase 4.
- **Password-protected PDFs.** Report the error and skip. Do not attempt to
  crack or bypass PDF passwords.

## Edge Cases

- **Scanned or image-only PDFs** - The script falls back to OCR via tesseract.
  Quality depends on scan quality. Warn that OCR output may need manual review.
- **PDFs with no extractable images** - This is normal (text-only documents).
  The manifest will show 0 images. No special handling needed.
- **Mixed attachment types** - A batch can include PDFs and images together.
  Each gets routed to the appropriate extraction path.
- **Very large PDFs (50+ pages)** - The script handles these fine, but
  the resulting markdown may be very long. Note the word count in the
  summary so you can decide whether to split it.
- **Non-English PDFs** - Text extraction works for any language PyMuPDF
  supports (which is most). OCR requires the appropriate tesseract
  language pack. Flag if OCR is needed for a non-English image.
- **Corrupted or unreadable files** - The script reports errors per file
  and continues processing the rest of the batch. Surface the error.
- **No attachments provided** - Ask what to convert. Don't run the skill with
  no input.
- **You want to act on content without extraction** - If you say
  "summarize this PDF" or "what does this email say" without asking for
  conversion, do NOT trigger this skill. Just answer the question directly
  using the PDF content already visible in context.

## Resources

| Resource | When to read | What it contains |
|---|---|---|
| `scripts/extract.py` | Executed during Phase 1 | Python extraction script: type detection, text extraction (PyMuPDF), image extraction, OCR fallback, email thread parsing, manifest generation |

---

_Origin: Jeff Su's [Cowork Academy](https://coworkacademy.ai/) AI Command Center template._
