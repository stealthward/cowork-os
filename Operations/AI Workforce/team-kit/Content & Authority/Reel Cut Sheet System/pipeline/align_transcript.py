"""Local alignment test: WhisperX word timestamps + Plaud speaker labels.

Usage:   python align_transcript.py [model] [path/to/episode.mp3]
Inputs:  the audio (default ./episode.mp3) and plaud.json in the audio's folder
         (list of {start_time, end_time, speaker, content} in ms)
Outputs: words.json (word-level), aligned.txt (Timestamp\tSpeaker\tDialogue, one sentence per row),
         aligned_full.tsv, all written to the audio's folder
"""
import json, os, sys, re, time
os.environ["PATH"] = os.path.expanduser("~/ffmpeg-bin") + os.pathsep + os.environ["PATH"]
import torch, whisperx

AUDIO = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "episode.mp3")
HERE = os.path.dirname(AUDIO)  # episode folder: plaud.json in, outputs out
if not os.path.exists(os.path.join(HERE, "plaud.json")):
    sys.exit(f"plaud.json not found beside the audio in {HERE}")
device = "cuda" if torch.cuda.is_available() else "cpu"
compute = "float16" if device == "cuda" else "int8"
model_name = sys.argv[1] if len(sys.argv) > 1 else ("large-v2" if device == "cuda" else "medium")
print(f"device={device} model={model_name}", flush=True)

t0 = time.time()
audio = whisperx.load_audio(AUDIO)
model = whisperx.load_model(model_name, device, compute_type=compute, language="en")
result = model.transcribe(audio, batch_size=8 if device == "cuda" else 4)
print(f"transcribed in {time.time()-t0:.0f}s, {len(result['segments'])} segments", flush=True)

align_model, meta = whisperx.load_align_model(language_code="en", device=device)
result = whisperx.align(result["segments"], align_model, meta, audio, device, return_char_alignments=False)
print(f"aligned in {time.time()-t0:.0f}s", flush=True)

words = []
for seg in result["segments"]:
    for w in seg.get("words", []):
        if "start" in w:
            words.append({"w": w["word"], "s": round(w["start"], 2), "e": round(w["end"], 2)})
json.dump(words, open(os.path.join(HERE, "words.json"), "w"), indent=0)

# speaker from Plaud by midpoint overlap
plaud = json.load(open(os.path.join(HERE, "plaud.json")))
def speaker_at(t):
    ms = t * 1000
    best, bd = None, 1e18
    for p in plaud:
        if p["start_time"] <= ms <= p["end_time"]:
            return p["speaker"]
        d = min(abs(ms - p["start_time"]), abs(ms - p["end_time"]))
        if d < bd:
            best, bd = p["speaker"], d
    return best

def ts(sec):
    sec = int(sec)
    return f"{sec//3600:02d}:{(sec%3600)//60:02d}:{sec%60:02d}"

rows, cur = [], []
for w in words:
    cur.append(w)
    if re.search(r"[.?!]$", w["w"].strip()):
        rows.append(cur); cur = []
if cur:
    rows.append(cur)

# split a sentence when the speaker changes mid-way, so rows stay single-speaker
out = []
for r in rows:
    spk = speaker_at((r[0]["s"] + r[0]["e"]) / 2)
    buf = [r[0]]
    for w in r[1:]:
        s2 = speaker_at((w["s"] + w["e"]) / 2)
        if s2 != spk:
            out.append((buf[0]["s"], buf[-1]["e"], spk, " ".join(x["w"].strip() for x in buf)))
            buf, spk = [w], s2
        else:
            buf.append(w)
    out.append((buf[0]["s"], buf[-1]["e"], spk, " ".join(x["w"].strip() for x in buf)))

with open(os.path.join(HERE, "aligned.txt"), "w", encoding="utf-8") as f:
    f.write("Timestamp\tSpeaker\tDialogue\n")
    for s, e, spk, txt in out:
        f.write(f"{ts(s)}\t{spk}\t{txt}\n")
with open(os.path.join(HERE, "aligned_full.tsv"), "w", encoding="utf-8") as f:
    f.write("start\tend\tspeaker\ttext\n")
    for s, e, spk, txt in out:
        f.write(f"{s:.2f}\t{e:.2f}\t{spk}\t{txt}\n")
print(f"done in {time.time()-t0:.0f}s: {len(words)} words, {len(out)} rows", flush=True)
