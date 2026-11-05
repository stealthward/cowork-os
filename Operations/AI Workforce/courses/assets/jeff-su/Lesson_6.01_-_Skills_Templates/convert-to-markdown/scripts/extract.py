#!/usr/bin/env python3
"""
convert-to-markdown extraction script.

Takes a PDF or image file and produces:
  - content.md: clean markdown with all text
  - image-NN.ext: extracted images (if any)
  - manifest.md: stats summary

Usage:
  python3 extract.py <input_file> <output_dir>

Supports:
  - Gmail email thread PDFs (multi-message, chronological)
  - Gmail single-email PDFs
  - Webpage PDFs (browser "Save as PDF")
  - General document PDFs
  - Image files (OCR via tesseract)
"""

import sys
import os
import re
import json
from pathlib import Path
from datetime import datetime

# ---------------------------------------------------------------------------
# Input type detection
# ---------------------------------------------------------------------------

def detect_input_type(file_path: str) -> str:
    """Classify the input file into a processing category."""
    ext = Path(file_path).suffix.lower()
    if ext in ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'):
        return 'image'
    if ext != '.pdf':
        return 'unknown'

    import fitz
    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()

    # Gmail email export detection
    # Gmail exports start with: Sender <email>\nSubject\nN messages\n
    # The "N messages" line may be 1-3 lines below the email address
    has_email_headers = bool(re.search(r'\w+\s+<[\w.+-]+@[\w.-]+>\s*\n\w{3}, \w{3} \d+, \d{4}', full_text))
    msg_count_match = re.search(r'(\d+)\s+messages?', full_text[:500])

    if msg_count_match and has_email_headers:
        count = int(msg_count_match.group(1))
        if count > 1:
            return 'email_thread'
        return 'email_single'
    if has_email_headers:
        return 'email_single'

    # Webpage detection: browser print footers with URLs
    webpage_pattern = r'\d+/\d+/\d+,\s+\d+:\d+\s+[AP]M\n.+\nhttps?://'
    if re.search(webpage_pattern, full_text):
        return 'webpage'

    return 'document'


# ---------------------------------------------------------------------------
# Text cleaning utilities
# ---------------------------------------------------------------------------

def strip_browser_footers(text: str) -> str:
    """Remove browser-generated page headers/footers from Save-as-PDF output.

    Matches patterns like:
      5/15/26, 11:49 AM
      Page Title | Site Name
      https://www.example.com/path
      2/3
    """
    # Pattern: date/time line, then title line, then URL line, then page number
    pattern = r'\n?\d{1,2}/\d{1,2}/\d{2,4},\s+\d{1,2}:\d{2}\s+[AP]M\n[^\n]+\nhttps?://[^\n]+\n\d+/\d+\n?'
    return re.sub(pattern, '\n', text)


def strip_gmail_footers(text: str) -> str:
    """Remove Gmail print footers from email PDF exports.

    Same pattern as browser footers but specific to Gmail URLs.
    """
    return strip_browser_footers(text)


def clean_quoted_text_markers(text: str) -> str:
    """Replace [Quoted text hidden] with a cleaner marker."""
    return re.sub(r'\[Quoted text hidden\]', '', text)


def normalize_whitespace(text: str) -> str:
    """Collapse excessive blank lines to max 2."""
    return re.sub(r'\n{4,}', '\n\n\n', text)


# ---------------------------------------------------------------------------
# Email thread parsing
# ---------------------------------------------------------------------------

def parse_email_messages(text: str) -> list:
    """Parse Gmail thread text into individual messages.

    Gmail exports have a consistent pattern:
      Sender Name <email@domain.com>
      Day, Mon DD, YYYY at HH:MM AM/PM
      To: ...
      [Cc: ...]

      Message body...
    """
    # Split on the sender + date pattern
    # This regex matches: Name <email>\nDay, Month DD, YYYY at HH:MM AM/PM
    # [^\n<>]+ prevents matching across newlines (the key fix: \s includes \n)
    msg_pattern = r'([^\n<>]+<[\w.+-]+@[\w.-]+>)\s*\n(\w{3}, \w{3} \d{1,2}, \d{4} at \d{1,2}:\d{2}\s+[AP]M)'

    splits = list(re.finditer(msg_pattern, text))

    if not splits:
        return [{'sender': 'Unknown', 'date': '', 'body': text}]

    messages = []
    for i, match in enumerate(splits):
        sender = match.group(1).strip()
        date_str = match.group(2).strip()

        start = match.end()
        end = splits[i + 1].start() if i + 1 < len(splits) else len(text)

        body = text[start:end].strip()

        # Extract To/Cc lines from body start
        to_line = ""
        cc_line = ""
        body_lines = body.split('\n')
        clean_start = 0
        for j, line in enumerate(body_lines):
            if line.startswith('To: '):
                to_line = line
                clean_start = j + 1
            elif line.startswith('Cc: '):
                cc_line = line
                clean_start = j + 1
            elif line.strip() == '':
                continue
            else:
                if clean_start == 0:
                    clean_start = j
                break

        body = '\n'.join(body_lines[clean_start:]).strip()
        body = clean_quoted_text_markers(body)
        body = normalize_whitespace(body)

        messages.append({
            'sender': sender,
            'date': date_str,
            'to': to_line,
            'cc': cc_line,
            'body': body,
        })

    return messages


def extract_sender_name(sender_full: str) -> str:
    """Extract just the name from 'Name <email>' format."""
    match = re.match(r'([^<]+)<', sender_full)
    if match:
        return match.group(1).strip()
    return sender_full.strip()


def format_email_thread_md(messages: list, subject: str = "") -> str:
    """Format parsed email messages into clean markdown.

    Structure principle: each message is a top-level section (H1) with a
    numbered identifier, making it easy to scan, reference, and navigate.
    Metadata (sender email, recipients) sits in a compact block below the
    header. Body text follows after a blank line.
    """
    lines = []
    if subject:
        lines.append(f"# {subject}")
        lines.append("")
        lines.append(f"*{len(messages)} messages*")
        lines.append("")

    for i, msg in enumerate(messages, 1):
        sender_name = extract_sender_name(msg['sender'])

        # H1 header: Message N - Sender Name (Date)
        lines.append("---")
        lines.append("")
        lines.append(f"# Message {i}: {sender_name}")
        lines.append("")
        lines.append(f"**Date:** {msg['date']}")
        lines.append(f"**From:** {msg['sender']}")
        if msg.get('to'):
            lines.append(f"**{msg['to']}**")
        if msg.get('cc'):
            lines.append(f"**{msg['cc']}**")
        lines.append("")

        # Body
        lines.append(msg['body'])
        lines.append("")

    return '\n'.join(lines)


# ---------------------------------------------------------------------------
# Image extraction
# ---------------------------------------------------------------------------

MIN_IMAGE_DIMENSION = 80  # Skip tiny images (icons, spacers, tracking pixels, social buttons)
MIN_IMAGE_AREA = 10000    # Skip images smaller than ~100x100

def extract_images(file_path: str, output_dir: str) -> list:
    """Extract meaningful images from a PDF. Returns list of saved image paths."""
    import fitz

    doc = fitz.open(file_path)
    saved = []
    seen_digests = set()  # Deduplicate identical images
    img_counter = 0

    for page_num in range(doc.page_count):
        page = doc[page_num]
        images = page.get_images(full=True)

        for img_info in images:
            xref = img_info[0]

            try:
                pix = fitz.Pixmap(doc, xref)
            except Exception:
                continue

            # Skip tiny images (spacers, tracking pixels, bullets)
            if pix.width < MIN_IMAGE_DIMENSION or pix.height < MIN_IMAGE_DIMENSION:
                continue
            if pix.width * pix.height < MIN_IMAGE_AREA:
                continue

            # Convert CMYK to RGB if needed
            if pix.n > 4:
                pix = fitz.Pixmap(fitz.csRGB, pix)

            # Deduplicate
            digest = pix.digest
            if digest in seen_digests:
                continue
            seen_digests.add(digest)

            img_counter += 1
            ext = "png"
            fname = f"image-{img_counter:02d}.{ext}"
            out_path = os.path.join(output_dir, fname)
            pix.save(out_path)

            saved.append({
                'filename': fname,
                'width': pix.width,
                'height': pix.height,
                'page': page_num + 1,
            })

    doc.close()
    return saved


# ---------------------------------------------------------------------------
# OCR for image files
# ---------------------------------------------------------------------------

def ocr_image(file_path: str) -> str:
    """Extract text from an image file using tesseract OCR."""
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        return f"[OCR failed: {e}]"


# ---------------------------------------------------------------------------
# Main extraction logic per input type
# ---------------------------------------------------------------------------

def extract_email_thread(file_path: str, output_dir: str) -> dict:
    """Process a Gmail email thread PDF."""
    import fitz

    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()

    # Clean footers first
    full_text = strip_gmail_footers(full_text)

    # Extract subject from the first few lines
    first_lines = full_text[:500].split('\n')
    subject = ""
    for line in first_lines[1:5]:  # Skip sender line, look for subject
        line = line.strip()
        if line and not line.endswith('>') and 'message' not in line.lower():
            subject = line
            break

    # Parse messages
    messages = parse_email_messages(full_text)

    # Format as markdown
    md_content = format_email_thread_md(messages, subject)

    # Write markdown
    md_path = os.path.join(output_dir, "content.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    # Extract images
    images = extract_images(file_path, output_dir)

    word_count = len(md_content.split())

    return {
        'type': 'email_thread',
        'subject': subject,
        'message_count': len(messages),
        'word_count': word_count,
        'image_count': len(images),
        'images': images,
        'pages': fitz.open(file_path).page_count,
    }


def extract_email_single(file_path: str, output_dir: str) -> dict:
    """Process a single Gmail email PDF."""
    import fitz

    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    page_count = doc.page_count
    doc.close()

    full_text = strip_gmail_footers(full_text)
    full_text = clean_quoted_text_markers(full_text)
    full_text = normalize_whitespace(full_text)

    # Extract metadata from Gmail header lines.
    # Gmail export format: account owner → subject → "N message(s)" → actual sender → date
    # The first email address line is the account owner, NOT the sender.
    first_lines = full_text[:800].split('\n')
    account_owner = ""
    sender = ""
    subject = ""
    date_str = ""
    to_line = ""
    cc_line = ""
    reply_to = ""
    body_start_idx = 0
    found_msg_count = False

    for idx, line in enumerate(first_lines):
        line_s = line.strip()
        if not account_owner and re.match(r'.+<[\w.+-]+@[\w.-]+>', line_s):
            account_owner = line_s  # First email line = account owner
        elif not subject and account_owner and not found_msg_count and line_s and not re.match(r'\d+\s+messages?', line_s) and not re.match(r'.+<[\w.+-]+@[\w.-]+>', line_s):
            subject = line_s
        elif re.match(r'\d+\s+messages?', line_s):
            found_msg_count = True
        elif found_msg_count and not sender and re.match(r'.+<[\w.+-]+@[\w.-]+>', line_s):
            sender = line_s  # Email line after "N messages" = actual sender
        elif re.match(r'\w{3}, \w{3} \d{1,2}, \d{4} at', line_s):
            date_str = line_s
        elif line_s.startswith('Reply-To:'):
            reply_to = line_s
        elif line_s.startswith('To:'):
            to_line = line_s
        elif line_s.startswith('Cc:'):
            cc_line = line_s
        elif line_s.startswith('This email was sent to') or (date_str and line_s and not line_s.startswith(('To:', 'Cc:', 'Reply-To:'))):
            body_start_idx = idx
            break

    # Extract body (everything after the header metadata)
    body = '\n'.join(first_lines[body_start_idx:])
    # If body is short, the rest of the text continues beyond first_lines
    if len(full_text) > 800:
        remaining = full_text[800:]
        body = body + remaining
    body = body.strip()

    # Build structured markdown
    md_lines = []
    md_lines.append(f"# {subject}" if subject else "# Email")
    md_lines.append("")

    sender_name = extract_sender_name(sender) if sender else ""
    if sender:
        md_lines.append(f"**From:** {sender}")
    if date_str:
        md_lines.append(f"**Date:** {date_str}")
    if to_line:
        md_lines.append(f"**{to_line}**")
    if cc_line:
        md_lines.append(f"**{cc_line}**")
    if reply_to:
        md_lines.append(f"**{reply_to}**")
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("")
    md_lines.append(body)

    md_content = '\n'.join(md_lines)
    md_path = os.path.join(output_dir, "content.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    images = extract_images(file_path, output_dir)

    return {
        'type': 'email_single',
        'subject': subject,
        'word_count': len(md_content.split()),
        'image_count': len(images),
        'images': images,
        'pages': page_count,
    }


def extract_webpage(file_path: str, output_dir: str) -> dict:
    """Process a webpage saved as PDF."""
    import fitz

    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    page_count = doc.page_count
    doc.close()

    full_text = strip_browser_footers(full_text)
    full_text = normalize_whitespace(full_text)

    # Try to extract page title from first non-empty line
    title = ""
    for line in full_text.split('\n'):
        line = line.strip()
        if line:
            title = line
            break

    # Extract source URL from the original text (before stripping footers)
    doc = fitz.open(file_path)
    raw_text = doc[0].get_text()
    doc.close()
    url_match = re.search(r'https?://[^\s\n]+', raw_text)
    source_url = url_match.group(0) if url_match else ""

    md_lines = []
    if title:
        md_lines.append(f"# {title}")
        md_lines.append("")
    if source_url:
        md_lines.append(f"**Source:** {source_url}")
        md_lines.append("")
    md_lines.append("---")
    md_lines.append("")
    md_lines.append(full_text)

    md_content = '\n'.join(md_lines)
    md_path = os.path.join(output_dir, "content.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    images = extract_images(file_path, output_dir)

    return {
        'type': 'webpage',
        'title': title,
        'source_url': source_url,
        'word_count': len(md_content.split()),
        'image_count': len(images),
        'images': images,
        'pages': page_count,
    }


def extract_document(file_path: str, output_dir: str) -> dict:
    """Process a general document PDF."""
    import fitz

    doc = fitz.open(file_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    page_count = doc.page_count
    doc.close()

    full_text = strip_browser_footers(full_text)
    full_text = normalize_whitespace(full_text)

    title = ""
    for line in full_text.split('\n'):
        line = line.strip()
        if line:
            title = line
            break

    md_lines = []
    if title:
        md_lines.append(f"# {title}")
        md_lines.append("")
    md_lines.append(full_text)

    md_content = '\n'.join(md_lines)
    md_path = os.path.join(output_dir, "content.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    images = extract_images(file_path, output_dir)

    return {
        'type': 'document',
        'title': title,
        'word_count': len(md_content.split()),
        'image_count': len(images),
        'images': images,
        'pages': page_count,
    }


def extract_image_file(file_path: str, output_dir: str) -> dict:
    """Process an image file with OCR."""
    import shutil

    # Copy original image to output
    fname = Path(file_path).name
    dest = os.path.join(output_dir, fname)
    shutil.copy2(file_path, dest)

    # OCR
    text = ocr_image(file_path)

    md_lines = [
        f"# OCR Extract: {fname}",
        "",
        text,
    ]
    md_content = '\n'.join(md_lines)
    md_path = os.path.join(output_dir, "content.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

    return {
        'type': 'image_ocr',
        'original_file': fname,
        'word_count': len(text.split()),
        'image_count': 1,
        'images': [{'filename': fname, 'width': 0, 'height': 0, 'page': 0}],
        'pages': 0,
    }


# ---------------------------------------------------------------------------
# Manifest generation
# ---------------------------------------------------------------------------

def estimate_token_savings(word_count: int, page_count: int, image_count: int) -> dict:
    """Estimate token savings from markdown vs. PDF-as-images."""
    # Rough estimates:
    # - PDF page as image: ~1500-3000 tokens per page (depending on content density)
    # - Markdown text: ~1.3 tokens per word
    # - Standalone image: ~1000-2000 tokens each (only loaded when needed)

    pdf_tokens = page_count * 2200  # mid estimate per page
    md_tokens = int(word_count * 1.3)
    image_tokens = image_count * 1500  # only if user chooses to load them

    savings = pdf_tokens - md_tokens
    savings_pct = round((savings / pdf_tokens * 100), 1) if pdf_tokens > 0 else 0

    return {
        'pdf_estimated_tokens': pdf_tokens,
        'markdown_tokens': md_tokens,
        'image_tokens_if_loaded': image_tokens,
        'savings': savings,
        'savings_pct': savings_pct,
    }


def write_manifest(output_dir: str, result: dict, source_name: str):
    """Write a manifest.md summarizing the extraction."""
    tokens = estimate_token_savings(
        result.get('word_count', 0),
        result.get('pages', 0),
        result.get('image_count', 0),
    )

    lines = [
        f"# Extraction Manifest: {source_name}",
        "",
        f"**Input type:** {result['type']}",
        f"**Pages:** {result.get('pages', 'N/A')}",
        f"**Word count:** {result.get('word_count', 0):,}",
        f"**Images extracted:** {result.get('image_count', 0)}",
    ]

    if result['type'] == 'email_thread':
        lines.append(f"**Messages:** {result.get('message_count', 0)}")
        lines.append(f"**Subject:** {result.get('subject', 'N/A')}")
    elif result['type'] in ('email_single',):
        lines.append(f"**Subject:** {result.get('subject', 'N/A')}")
    elif result['type'] == 'webpage':
        lines.append(f"**Source URL:** {result.get('source_url', 'N/A')}")

    lines.extend([
        "",
        "## Token Savings Estimate",
        "",
        f"| Metric | Tokens |",
        f"|---|---|",
        f"| PDF as images (original) | ~{tokens['pdf_estimated_tokens']:,} |",
        f"| Markdown text | ~{tokens['markdown_tokens']:,} |",
        f"| Images (if loaded separately) | ~{tokens['image_tokens_if_loaded']:,} |",
        f"| **Estimated savings** | **~{tokens['savings']:,} ({tokens['savings_pct']}%)** |",
    ])

    if result.get('images'):
        lines.extend([
            "",
            "## Extracted Images",
            "",
            "| File | Dimensions | Source Page |",
            "|---|---|---|",
        ])
        for img in result['images']:
            lines.append(f"| {img['filename']} | {img['width']}x{img['height']} | {img['page']} |")

    manifest_path = os.path.join(output_dir, "manifest.md")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

EXTRACTORS = {
    'email_thread': extract_email_thread,
    'email_single': extract_email_single,
    'webpage': extract_webpage,
    'document': extract_document,
    'image': extract_image_file,
}

def process_file(file_path: str, output_dir: str, flat: bool = False) -> dict:
    """Process a single file and return results.

    Args:
        file_path: Path to the input file.
        output_dir: Directory to write output into.
        flat: If True, write files directly into output_dir (no per-file
              subfolder). Used for single-file extractions to avoid
              unnecessary nesting.
    """
    file_path = os.path.abspath(file_path)
    source_name = Path(file_path).stem

    if flat:
        # Single-file mode: write directly into output_dir
        file_output_dir = output_dir
    else:
        # Batch mode: create a per-file subdirectory
        safe_name = re.sub(r'[^\w\s-]', '', source_name)[:80].strip()
        safe_name = re.sub(r'\s+', '_', safe_name)
        file_output_dir = os.path.join(output_dir, safe_name)
    os.makedirs(file_output_dir, exist_ok=True)

    # Detect type
    input_type = detect_input_type(file_path)

    if input_type == 'unknown':
        return {
            'source': source_name,
            'error': f'Unsupported file type: {Path(file_path).suffix}',
            'output_dir': file_output_dir,
        }

    # Extract
    extractor = EXTRACTORS[input_type]
    result = extractor(file_path, file_output_dir)
    result['source'] = source_name
    result['output_dir'] = file_output_dir

    # Write manifest
    write_manifest(file_output_dir, result, source_name)

    return result


def _flatten_unicode(s: str) -> str:
    """Flatten a string for fuzzy filename matching.

    Handles two classes of mismatch that cause shell-passed filenames
    to fail os.path.exists():
      1. NFC/NFD normalization (macOS HFS+/APFS uses NFD)
      2. Unicode punctuation folded to ASCII by shells or terminals
         (e.g., curly apostrophe U+2019 -> straight quote U+0027)
    """
    import unicodedata
    # Normalize to NFC first
    s = unicodedata.normalize('NFC', s)
    # Map common Unicode punctuation to ASCII equivalents
    replacements = {
        '‘': "'",   # left single quote
        '’': "'",   # right single quote / curly apostrophe
        '“': '"',   # left double quote
        '”': '"',   # right double quote
        '\u2013': '-',   # en dash
        '\u2014': '-',   # em dash
        '…': '...', # ellipsis
        ' ': ' ',   # non-breaking space
    }
    for src, dst in replacements.items():
        s = s.replace(src, dst)
    return s


def resolve_unicode_path(path: str) -> str:
    """Resolve a file path that may have unicode encoding mismatches.

    When filenames contain unicode characters (emoji, curly quotes, accented
    letters), the path passed via shell args may not match the actual filename
    on disk due to normalization differences or character substitution.

    Falls back to scanning the parent directory for the closest match.
    """
    if os.path.exists(path):
        return path

    parent = os.path.dirname(path) or '.'
    target_name = os.path.basename(path)

    if not os.path.isdir(parent):
        return path  # Parent doesn't exist, can't resolve

    target_flat = _flatten_unicode(target_name)

    for entry in os.listdir(parent):
        if _flatten_unicode(entry) == target_flat:
            resolved = os.path.join(parent, entry)
            if os.path.exists(resolved):
                return resolved

    return path  # No match found, return original


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 extract.py <input_file_or_dir> <output_dir>")
        print("       python3 extract.py file1.pdf file2.pdf ... <output_dir>")
        sys.exit(1)

    output_dir = sys.argv[-1]
    input_paths = sys.argv[1:-1]

    os.makedirs(output_dir, exist_ok=True)

    results = []
    for path in input_paths:
        path = resolve_unicode_path(path)
        if os.path.isdir(path):
            # Process all PDFs and images in directory
            for f in sorted(os.listdir(path)):
                ext = Path(f).suffix.lower()
                if ext in ('.pdf', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'):
                    result = process_file(os.path.join(path, f), output_dir)
                    results.append(result)
                    print(f"  Processed: {f} -> {result.get('type', 'error')}")
        elif os.path.isfile(path):
            # Use flat mode when a single file is passed (no per-file subfolder)
            is_single_file = len(input_paths) == 1
            result = process_file(path, output_dir, flat=is_single_file)
            results.append(result)
            print(f"  Processed: {Path(path).name} -> {result.get('type', 'error')}")
        else:
            print(f"  Skipped (not found): {path}")

    # Write batch summary if multiple files
    if len(results) > 1:
        summary_lines = [
            "# Batch Extraction Summary",
            "",
            f"**Files processed:** {len(results)}",
            f"**Total words:** {sum(r.get('word_count', 0) for r in results):,}",
            f"**Total images:** {sum(r.get('image_count', 0) for r in results)}",
            "",
            "## Per-File Results",
            "",
            "| Source | Type | Words | Images | Pages |",
            "|---|---|---|---|---|",
        ]
        for r in results:
            summary_lines.append(
                f"| {r.get('source', '?')} | {r.get('type', 'error')} | "
                f"{r.get('word_count', 0):,} | {r.get('image_count', 0)} | "
                f"{r.get('pages', 'N/A')} |"
            )

        summary_path = os.path.join(output_dir, "summary.md")
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(summary_lines))

    # Output results as JSON for Claude to read
    print(json.dumps(results, indent=2, default=str))


if __name__ == '__main__':
    main()

# Origin: Jeff Su's Cowork Academy | https://coworkacademy.ai/
