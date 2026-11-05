"""Author reels.json from a timed transcript by line number (engine v5, cut-first).

Usage (from the episode folder): python build_reels_from_rows.py [reels_module] [transcript]
Defaults: reels_def.py and aligned.txt beside each other in the working folder.

The reels module defines SHOW, EPISODE, REELS, CANDIDATES. Each reel has "rows": entries made with
L(n, *strikes, **opts), where n is the 1-based line in the transcript (header = line 1).
Strikes are exact phrases from that line, wrapped in ~~tildes~~ in the output:
  "phrase"      strike the first occurrence not already struck
  ">>phrase"    strike from that phrase to the end of the line
  "#2:phrase"   strike the second occurrence
opts: trim="reason" (whole line removed, red block), soft="EC: reason" (editor's call, footage decides;
a soft reason without "EC:" becomes a trim), dir="edit direction", spk="Speaker" (fix a diarization slip).
Start = the row's timestamp; end = the next row's timestamp. Every row is checked against the transcript.
"""
import json, os, re, sys
HERE = os.getcwd()
REELS_MOD = sys.argv[1] if len(sys.argv) > 1 else "reels_def"
TRANSCRIPT = sys.argv[2] if len(sys.argv) > 2 else "aligned.txt"
rows = []
with open(os.path.join(HERE, TRANSCRIPT), encoding="utf-8") as f:
    for i, ln in enumerate(f, 1):
        if i == 1: continue
        ts, spk, txt = ln.rstrip("\n").split("\t", 2)
        rows.append((i, ts, spk, txt))
byline = {r[0]: r for r in rows}
order = [r[0] for r in rows]
errors = []

def secs(ts):
    h, m, s = [int(x) for x in ts.split(":")]
    return h*3600 + m*60 + s
def mmss(x):
    return f"{x//60}:{x%60:02d}"

def L(n, *fillers, **o):
    return (n, fillers, o)

def mark(n, src, fillers):
    spans = []
    for f in fillers:
        nth = 1
        if f.startswith("#") and ":" in f[:4]:
            nth, f = int(f[1:f.index(":")]), f[f.index(":")+1:]
        tail = f.startswith(">>"); key = f[2:] if tail else f
        i = 0
        while True:
            i = src.find(key, i)
            if i < 0: break
            if nth > 1:
                nth -= 1; i += 1; continue
            j = len(src) if tail else i + len(key)
            if not any(i < b2 and a2 < j for a2, b2 in spans): break
            i += 1
        if i < 0:
            errors.append(f"line {n}: filler not found: {f!r} in: {src}"); continue
        spans.append((i, j))
    out, last = "", 0
    for a, b2 in sorted(spans):
        out += src[last:a] + "~~" + src[a:b2].strip() + "~~" + (" " if src[a:b2].endswith(" ") else ""); last = b2
    out += src[last:]
    return re.sub(r"\s+", " ", out).strip()

sys.path.insert(0, HERE)
import importlib
_m = importlib.import_module(REELS_MOD)
REELS, CANDIDATES, SHOW, EPISODE = _m.REELS, _m.CANDIDATES, _m.SHOW, _m.EPISODE

out = {"show": SHOW, "episode": EPISODE, "reels": [], "candidates": CANDIDATES}
for reel in REELS:
    lines = []
    for n, fillers, o in reel["rows"]:
        _, ts, spk, src = byline[n]
        text = mark(n, src.replace("...", "."), fillers)  # WhisperX trailing ellipsis is punctuation, not an abbreviation
        idx = order.index(n)
        nxt = order[idx+1] if idx+1 < len(order) else n
        s, e = secs(ts), secs(byline[nxt][1])
        if e <= s: e = s + 1
        line = {"start": mmss(s), "end": mmss(e), "speaker": o.get("spk", spk), "text": text}
        if o.get("dir"): line["dir"] = o["dir"]
        if o.get("trim"):
            line["trim"] = True; line["trim_reason"] = o["trim"] if isinstance(o["trim"], str) else "cut"
        elif o.get("soft") and not str(o["soft"]).startswith("EC:"):  # v5: whole-line cuts are trims
            line["trim"] = True; line["trim_reason"] = o["soft"] if isinstance(o["soft"], str) else "cut"
        elif o.get("soft"):
            line["soft"] = True; line["soft_reason"] = str(o["soft"])[3:].strip()
        lines.append(line)
    r = {k: v for k, v in reel.items() if k != "rows"}
    kept = [l for l in lines if not l.get("trim") and not l.get("soft")]
    r["primary_start"] = kept[0]["start"]; r["primary_end"] = kept[-1]["end"]
    r["lines"] = lines
    out["reels"].append(r)

if errors:
    print("\n".join(errors)); sys.exit(1)
json.dump(out, open(os.path.join(HERE, "reels.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"wrote {len(out['reels'])} reels, {sum(len(r['lines']) for r in out['reels'])} lines")
