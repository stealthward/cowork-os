#!/usr/bin/env python3
"""verify_cut_sheet.py: scripted verbatim check for reel cut sheets.

Compares every line in reels.json (kept lines, soft cuts AND trims) word-for-word against
the source transcript. A line passes only if its exact word sequence appears in
the transcript's dialogue. Also flags any "..." abbreviation in line text and
any hook_line not copied from its own reel's lines.

Usage:  python verify_cut_sheet.py reels.json <transcript.txt|.md|.pdf>

Exit 0 and "VERBATIM CHECK PASSED" when clean; exit 1 with a flag list when not.
Fix flagged lines by re-copying them from the transcript, never by paraphrasing,
then re-run. This script only checks; it never edits.
"""
import json, re, sys, unicodedata

# ---------------- normalization ----------------

def norm_words(text):
    """Lowercase word tokens, curly quotes straightened, punctuation dropped."""
    t = unicodedata.normalize("NFKC", str(text))
    t = t.replace("’", "'").replace("‘", "'")
    t = t.replace("“", '"').replace("”", '"')
    return re.findall(r"[a-z0-9']+", t.lower())

# ---------------- transcript loading ----------------

TIME_RE = re.compile(r"^\[?\(?\d{1,2}:\d{2}(?::\d{2})?\)?\]?[\s\-–—.]*")
SPKR_RE = re.compile(r"^([A-Z][\w .'\-]{0,40}):\s*(.*)$")

def load_transcript(path):
    if path.lower().endswith(".pdf"):
        try:
            from pypdf import PdfReader
        except ImportError:
            sys.exit("Transcript is a PDF but pypdf is not installed. "
                     "Extract it to plain text first (do not retype it), then re-run.")
        raw = "\n".join((p.extract_text() or "") for p in PdfReader(path).pages)
    else:
        with open(path, encoding="utf-8", errors="replace") as f:
            raw = f.read()

    dialogue = []
    for ln in raw.splitlines():
        s = ln.strip()
        if not s:
            continue
        if "\t" in s:  # tab-separated row: Timestamp / Speaker / Dialogue
            cells = [c.strip() for c in s.split("\t")]
            if cells[0].lower() in ("timestamp", "time", "timecode", "start"):
                continue  # header row
            dialogue.append(cells[-1])  # dialogue is always the last column
            continue
        if s.startswith("|"):  # markdown table row
            cells = [c.strip() for c in s.strip("|").split("|")]
            if not cells:
                continue
            head = cells[0].lower()
            if head in ("timestamp", "time", "timecode"):
                continue  # header row
            if all(re.fullmatch(r"[:\-\s]*", c) for c in cells):
                continue  # separator row
            dialogue.append(cells[-1])
            continue
        t = TIME_RE.sub("", s)          # strip a leading timestamp
        m = SPKR_RE.match(t)
        if m:
            t = m.group(2)              # strip a leading "Speaker:" label
        dialogue.append(t)
    return norm_words(" ".join(dialogue))

# ---------------- sequence search ----------------

def find_seq(hay, needle):
    if not needle:
        return True
    n, first = len(needle), needle[0]
    limit = len(hay) - n
    i = 0
    while i <= limit:
        if hay[i] == first and hay[i:i + n] == needle:
            return True
        i += 1
    return False

def divergence(hay, needle):
    """Longest prefix of needle that appears in hay; returns (k, next_word)."""
    lo, hi = 0, len(needle)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if find_seq(hay, needle[:mid]):
            lo = mid
        else:
            hi = mid - 1
    nxt = needle[lo] if lo < len(needle) else ""
    return lo, nxt

# ---------------- checks ----------------

def line_words(text):
    """Words as spoken: tilde markers removed, the words inside them kept."""
    return norm_words(str(text).replace("~~", " "))

def main():
    if len(sys.argv) < 3:
        sys.exit("Usage: python verify_cut_sheet.py reels.json <transcript file>")
    with open(sys.argv[1], encoding="utf-8") as f:
        data = json.load(f)
    transcript = load_transcript(sys.argv[2])
    if len(transcript) < 50:
        sys.exit(f"Transcript parsed to only {len(transcript)} words. "
                 "Wrong file or unreadable format; fix the input and re-run.")

    flags, warnings, total = [], [], 0
    for reel in data.get("reels", []):
        rid = reel.get("reel_id", "R?")
        reel_stream = []
        for idx, l in enumerate(reel.get("lines", []), 1):
            raw = str(l.get("text", ""))
            words = line_words(raw)
            if not words:
                continue
            total += 1
            kind = "TRIM" if l.get("trim") else ("SOFT" if l.get("soft") else "line")
            tc = f"{l.get('start','?')}-{l.get('end','?')}"
            if "..." in raw or "…" in raw:
                flags.append((rid, idx, tc, kind,
                              "contains '...': abbreviated passage; carry the full verbatim text",
                              raw))
                continue
            if not find_seq(transcript, words):
                k, nxt = divergence(transcript, words)
                why = (f"not verbatim: matches transcript for {k} of {len(words)} words, "
                       f"breaks at '{nxt}'")
                flags.append((rid, idx, tc, kind, why, raw))
            if not l.get("trim") and not l.get("soft"):
                reel_stream.extend(words)
        hook = norm_words(str(reel.get("hook_line", "")).replace("~~", " "))
        if hook and not find_seq(reel_stream, hook):
            warnings.append((rid, "hook_line is not copied from this reel's own kept lines"))

    for rid, idx, tc, kind, why, raw in flags[:60]:
        snip = raw if len(raw) <= 110 else raw[:107] + "..."
        print(f"FLAG  {rid} {kind} {idx} [{tc}]  {why}\n      > {snip}")
    if len(flags) > 60:
        print(f"...and {len(flags) - 60} more flags.")
    for rid, why in warnings:
        print(f"WARN  {rid}  {why}")

    if flags:
        print(f"\nVERBATIM CHECK FAILED: {len(flags)} of {total} lines flagged "
              f"across {len(data.get('reels', []))} reels. Fix each flagged line by "
              "re-copying it from the transcript, then re-run.")
        sys.exit(1)
    print(f"\nVERBATIM CHECK PASSED: all {total} lines across "
          f"{len(data.get('reels', []))} reels match the transcript."
          + (f" ({len(warnings)} warning(s) above.)" if warnings else ""))

if __name__ == "__main__":
    main()
