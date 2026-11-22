#!/usr/bin/env bash
# Render the daily XAUUSD trading-plan Short.
# Usage: tools/xau-daily-video/render.sh WORKDIR
# WORKDIR must contain: data.json, cues.json, words.json (ElevenLabs scribe words of the RAW voice),
#                       vo_raw.mp3 (ElevenLabs voice W5rRYzRkTBXRQ6jGNWPR, eleven_v4), host_raw.mp4 (avatar clip)
# Output: WORKDIR/final.mp4 (1080x1920, -14 LUFS) + WORKDIR/check_*.png frames for QC.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; W="$(cd "$1" && pwd)"
cd "$D"
[ -d node_modules ] || npm ci --silent --no-audit --no-fund
CHROME=""; for c in /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser; do [ -x "$c" ] && CHROME="--browser-executable=$c" && break; done
CORES=$(nproc); [ "$CORES" -gt 4 ] && CORES=4
# 1) voice: -1 semitone, bass boost, 1.1x tempo (approved filter "C")
ffmpeg -y -loglevel error -i "$W/vo_raw.mp3" -af "aresample=44100,asetrate=41625,aresample=44100,atempo=1.1654,bass=g=5:f=110:w=0.6,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -b:a 192k public/vo.mp3
cp "$W/data.json" public/data.json
# 2) captions + scene cues + synthesized SFX (timestamps / 1.1 tempo)
python3 tools/build_timing.py "$W/words.json" "$W/cues.json" public
TOTAL=$(python3 -c "import json;print(json.load(open('public/timing.json'))['total'])")
# 3) self-made music bed (synth pad, no third-party audio)
ffmpeg -y -loglevel error -f lavfi -i "sine=f=110:d=$TOTAL" -f lavfi -i "sine=f=164.81:d=$TOTAL" -f lavfi -i "sine=f=220:d=$TOTAL" -f lavfi -i "anoisesrc=d=$TOTAL:c=pink:a=0.02" -filter_complex "[0]volume=0.5[a];[1]volume=0.3[b];[2]volume=0.2[c];[a][b][c][3]amix=inputs=4:normalize=0,tremolo=f=0.25:d=0.4,lowpass=f=900,afade=t=in:d=2,loudnorm=I=-24[o]" -map "[o]" -ar 44100 public/bed.mp3
# 4) render
npx remotion render src/index.tsx XauPlan "$W/base.mp4" $CHROME --concurrency=$CORES --crf=20 --log=error
# 5) host avatar: ping-pong loop, remove only border-connected white background
rm -rf "$W/hf" "$W/ha"; mkdir -p "$W/hf"
ffmpeg -y -loglevel error -i "$W/host_raw.mp4" -filter_complex "[0:v]fps=30,scale=1280:720,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,crop=960:720:120:0,scale=760:-2" "$W/hf/%04d.png"
python3 tools/host_alpha.py "$W/hf" "$W/ha"
EN=$(python3 -c "import json;h=json.load(open('public/timing.json'))['host'];print('+'.join(f'between(t,{a},{b})' for a,b in h))")
ffmpeg -y -loglevel error -i "$W/base.mp4" -framerate 30 -stream_loop -1 -i "$W/ha/%04d.png" -filter_complex "[1:v]format=rgba[h];[0:v][h]overlay=x=-20:y=H-h+8:shortest=1:enable='$EN'[v]" -map "[v]" -map 0:a -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1.5:LRA=11 -movflags +faststart "$W/final.mp4"
# 6) QC frames: hook, each scene, disclaimer
python3 - "$W" <<'PY'
import json,subprocess,sys
W=sys.argv[1];t=json.load(open('public/timing.json'))
pts={'hook':2,'trend':t['s1']+5,'entry':t['cues'].get('entry',t['s2']+5)+1.5,'sltp':t['s4']-1,'risk':t['rule']-0.8,'rule':t['rule']+3,'disc':t['total']-1}
for k,v in pts.items(): subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(max(0,v)),'-i',f'{W}/final.mp4','-frames:v','1','-vf','scale=540:-1',f'{W}/check_{k}.png'],check=True)
PY
ffprobe -v error -show_entries format=duration -of csv=p=0 "$W/final.mp4"
