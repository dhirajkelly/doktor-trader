"""Build timing.json (captions + scene cues) and sfx.wav from ElevenLabs word timestamps.
Usage: python3 build_timing.py words.json cues.json out_dir [tempo=1.0999]
cues.json maps cue name -> word phrase (lowercase, no punctuation) whose first occurrence sets the cue.
"""
import json, re, sys, wave
import numpy as np

words_path, cues_path, out_dir = sys.argv[1:4]
raw = json.load(open(words_path))["words"]
cfg = json.load(open(cues_path))
import subprocess
dur = float(cfg.get("audio_duration") or subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"{out_dir}/vo.mp3"]).decode().strip())
tempo = float(cfg.get("tempo", 1.0999))
W = [w for w in raw if w.get("type", "word") == "word"]
norm = lambda s: re.sub(r"[^\w\-]", "", s.lower())
toks = [norm(w["text"]) for w in W]

def find(phrase, after=0):
    p = phrase.split()
    for i in range(after, len(toks) - len(p) + 1):
        if toks[i:i + len(p)] == p:
            return i
    raise SystemExit(f"cue phrase not found: {phrase}")

# caption tokens with number phrases collapsed
repl = cfg.get("replace", {})
out = []
i = 0
while i < len(W):
    hit = None
    for ph, disp in sorted(repl.items(), key=lambda kv: -len(kv[0].split())):
        p = ph.split()
        if toks[i:i + len(p)] == p:
            hit = (len(p), disp)
            break
    if hit:
        n, disp = hit
        tail = re.findall(r"[.,:!?]+$", W[i + n - 1]["text"])
        out.append({"w": disp + (tail[0] if tail else ""), "s": W[i]["start"] / tempo, "e": W[i + n - 1]["end"] / tempo})
        i += n
    else:
        out.append({"w": W[i]["text"], "s": W[i]["start"] / tempo, "e": W[i]["end"] / tempo})
        i += 1

cue_t = {}
last = 0
for name, ph in cfg["cues"].items():
    if not ph:
        continue
    idx = find(ph)
    cue_t[name] = round(W[idx]["start"] / tempo, 3)
# NO TRADE days: no SL/TP scene -> s3 = s4 (scene skipped)
if "s3" not in cue_t:
    cue_t["s3"] = cue_t["s4"]

total = round(dur + 1.2, 2)
timing = {
    "total": total,
    "s1": cue_t.pop("s1"), "s2": cue_t.pop("s2"), "s3": cue_t.pop("s3"), "s4": cue_t.pop("s4"),
    "rule": cue_t.pop("rule"), "disc": cue_t.pop("disc"),
    "cues": cue_t, "words": out,
}
timing["host"] = [[0, min(4.5, timing["s1"] - 0.2)], [timing["rule"], timing["disc"] - 0.1], [cue_t.get("cta", timing["disc"] + 5), total]]
json.dump(timing, open(f"{out_dir}/timing.json", "w"), ensure_ascii=False)

# --- SFX (synthesised, no third-party samples) ---
sr = 44100
buf = np.zeros(int(sr * (total + 1)))
rng = np.random.default_rng(7)
def whoosh(t):
    n = int(sr * 0.45); x = rng.standard_normal(n)
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    # crude band sweep: moving average of decreasing width
    y = np.convolve(x, np.ones(9) / 9, mode="same") * env * 0.35
    s = int(t * sr); buf[s:s + n] += y[: len(buf) - s]
def pop(t, f0=880):
    n = int(sr * 0.12); tt = np.arange(n) / sr
    y = np.sin(2 * np.pi * (f0 + 600 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 35) * 0.4
    s = int(t * sr); buf[s:s + n] += y[: len(buf) - s]
for k in ["s1", "s2", "s3", "s4", "rule", "disc"]:
    whoosh(max(0, timing[k] - 0.2))
for k, t in cue_t.items():
    pop(t, 1000 if k in ("bias", "lot", "batal", "rr") else 760)
pop(0.1, 660)
buf = np.clip(buf, -1, 1)
with wave.open(f"{out_dir}/sfx.wav", "w") as wf:
    wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(sr)
    wf.writeframes((buf * 32767).astype(np.int16).tobytes())
print(json.dumps({k: v for k, v in timing.items() if k not in ("words",)}, indent=1))
