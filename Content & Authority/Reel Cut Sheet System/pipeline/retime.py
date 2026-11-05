"""Compare Gemini line timestamps against WhisperX word timings for every reel line,
and write reels_aligned.json with start/end replaced by the aligned times where the
line's words were found (fuzzy, since the two ASR passes differ slightly)."""
import json, os, re, sys
from difflib import SequenceMatcher
HERE = os.path.dirname(os.path.abspath(__file__))
words = json.load(open(os.path.join(HERE, "words.json")))
def norm(t): return re.findall(r"[a-z0-9']+", t.lower().replace("’","'").replace("$",""))
W = [norm(w["w"]) for w in words]
flat, idx = [], []
for i, ws in enumerate(W):
    for w in ws: flat.append(w); idx.append(i)

def secs(t):
    p = [int(x) for x in t.split(":")]
    return p[0]*60+p[1] if len(p)==2 else p[0]*3600+p[1]*60+p[2]
def mmss(x): x=int(round(x)); return f"{x//60}:{x%60:02d}"

def locate(line_words, hint_sec, window=90):
    """Find the best fuzzy match of line_words in the aligned word stream near hint_sec."""
    lo = max(0, next((k for k,i in enumerate(idx) if words[i]["s"] >= hint_sec - window), 0))
    hi = min(len(flat), next((k for k,i in enumerate(idx) if words[i]["s"] > hint_sec + window), len(flat)))
    n = len(line_words); best, bscore = None, 0
    for k in range(lo, max(lo, hi - n + 1)):
        seg = flat[k:k+n]
        r = SequenceMatcher(None, seg, line_words, autojunk=False).ratio()
        if r > bscore: bscore, best = r, k
    if best is None or bscore < 0.6: return None
    return words[idx[best]]["s"], words[idx[min(best+n-1, len(idx)-1)]]["e"], bscore

data = json.load(open(os.path.join(HERE, "reels.json"), encoding="utf-8"))
deltas, misses, total = [], 0, 0
for reel in data["reels"]:
    for l in reel["lines"]:
        lw = norm(l["text"].replace("~~"," "))
        if not lw: continue
        total += 1
        if len(lw) < 4: continue  # too short to locate reliably; keep transcript time
        hit = locate(lw, secs(l["start"]))
        if not hit: misses += 1; continue
        s, e, sc = hit
        deltas.append(secs(l["start"]) - s)
        l["gemini_start"] = l["start"]
        l["start"], l["end"] = mmss(s), mmss(e)
    # keep the timeline monotonic: a line never starts before the previous one ends
    prev_end = None
    for l in reel["lines"]:
        if prev_end is not None and secs(l["start"]) < prev_end:
            l["start"] = mmss(prev_end)
            if secs(l["end"]) < prev_end: l["end"] = mmss(prev_end + 1)
        prev_end = secs(l["end"])
    kept = [l for l in reel["lines"] if not l.get("trim") and not l.get("soft")]
    reel["primary_start"], reel["primary_end"] = kept[0]["start"], kept[-1]["end"]
json.dump(data, open(os.path.join(HERE, "reels_aligned.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
import statistics as st
ad = [abs(d) for d in deltas]
print(f"lines: {total}, matched: {len(deltas)}, unmatched: {misses}")
print(f"Gemini minus aligned start (s): mean {st.mean(deltas):+.2f}, median {st.median(deltas):+.2f}, "
      f"abs mean {st.mean(ad):.2f}, max abs {max(ad):.1f}")
print("abs delta buckets: <=1s %d, 1-2s %d, 2-5s %d, >5s %d" % (
    sum(a<=1 for a in ad), sum(1<a<=2 for a in ad), sum(2<a<=5 for a in ad), sum(a>5 for a in ad)))
