"""Align a script (scripts/script.py) to ElevenLabs Scribe word timings, cut per-scene VO, write timings.json.
Usage: python3 align_words.py <workdir with voA.mp3 voB.mp3 wordsA.json wordsB.json> <split_index>
Part A = scenes[:split], part B = scenes[split:]. Voice filter (rule C) applied to each cut."""
import difflib, json, re, subprocess, sys, os

W = sys.argv[1]; SPLIT = int(sys.argv[2])
HERE = os.path.dirname(os.path.abspath(__file__))
ns = {}; exec(open(os.path.join(HERE, 'script.py')).read(), ns)
SCENES, SUBMAP = ns['SCENES'], ns['SUBMAP']
PUB = os.path.join(HERE, '..', 'remotion', 'public')
os.makedirs(os.path.join(PUB, 'vo'), exist_ok=True)
FILTER = "rubberband=pitch=0.94387:formant=preserved,equalizer=f=110:t=q:w=0.9:g=4,equalizer=f=3500:t=q:w=1:g=1.5"

norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
def sents(vo): return [s for s in re.split(r'(?<=[.?!])\s+', vo.strip()) if s]
def sub(s):
    for a, b in sorted(SUBMAP, key=lambda x: -len(x[0])):
        s = s.replace(a, b)
    return s

out = []
for part, scenes in (('A', SCENES[:SPLIT]), ('B', SCENES[SPLIT:])):
    words = [w for w in json.load(open(f'{W}/words{part}.json'))['words'] if w.get('type', 'word') == 'word']
    wt = [norm(w['text']) for w in words]
    toks = []  # (scene_i, sent_i, token)
    for si, sc in enumerate(scenes):
        for ki, s in enumerate(sents(sc['vo'])):
            for t in s.replace('-', ' ').split():
                if norm(t): toks.append((si, ki, norm(t)))
    sm = difflib.SequenceMatcher(None, [t[2] for t in toks], wt, autojunk=False)
    m = {}
    for a, b, n in sm.get_matching_blocks():
        for j in range(n): m[a + j] = b + j
    print(part, 'matched', len(m), '/', len(toks), 'tokens;', len(wt), 'words')
    # sentence first/last matched token -> times
    span = {}
    for i, (si, ki, _) in enumerate(toks):
        if i in m:
            w = words[m[i]]
            k = (si, ki)
            if k not in span: span[k] = [w['start'], w['end']]
            span[k][1] = w['end']
    total = words[-1]['end']
    # scene cut points: midpoint of gap between scenes
    starts = []
    for si in range(len(scenes)):
        ks = sorted(k for k in span if k[0] == si)
        starts.append((span[ks[0]][0], span[ks[-1]][1]))
    cuts = []
    for si in range(len(scenes)):
        a = 0 if si == 0 else (starts[si - 1][1] + starts[si][0]) / 2
        b = total + 0.3 if si == len(scenes) - 1 else (starts[si][1] + starts[si + 1][0]) / 2
        cuts.append((max(0, a), b))
    for si, sc in enumerate(scenes):
        a, b = cuts[si]
        dst = os.path.join(PUB, 'vo', f"{sc['id']}.mp3")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', f'{W}/vo{part}.mp3', '-af', FILTER, '-ar', '44100', '-b:a', '192k', dst], check=True)
        ss = sents(sc['vo']); sl = []
        prev_end = 0.0
        for ki, s in enumerate(ss):
            st, en = span.get((si, ki), (None, None))
            if st is None:  # interpolate
                st = prev_end; en = prev_end + 0.4 * len(s.split())
            sl.append(dict(text=s, sub=sub(s), start=round(st - a, 3), end=round(en - a, 3)))
            prev_end = en
        dur = b - a
        out.append(dict(id=sc['id'], chapter=sc['chapter'], visual=sc['visual'], audioDur=round(dur, 3), duration=round(dur, 3), sentences=sl))
json.dump(out, open(os.path.join(PUB, 'timings.json'), 'w'), ensure_ascii=False, indent=1)
print('total audio', round(sum(s['audioDur'] for s in out), 1))
for s in out: print(s['id'], s['audioDur'], len(s['sentences']))
