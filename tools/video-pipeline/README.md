# Faceless long-form pipeline (@dhirajkelly)

Template used for the first faceless long video ("Cara Entry XAUUSD Step by Step", Nov 2026) and the daily
Academy-module videos. Nothing here is served by the app.

Output standard: 1920×1080, 30 fps, H.264 + AAC 48 kHz, ≥ 8:00 (mid-roll), navy–gold brand
(#0B1B33 / #C9A24A / #F4F1EA), Helvetica (Liberation Sans fallback) + Playfair Display + JetBrains Mono,
burned-in subtitles (max 2 lines, one gold keyword), "SIMULASI" label on every chart, spoken + on-screen
disclaimer before the CTA, CTA = "Join Komunitas Trading · dhirajkelly.id" (description: "Join Komunitas Trading: https://dhirajkelly.id"), 20 s end screen.
No third-party music (Content ID): only the self-generated `public/sfx/whoosh.wav`.

## Steps
1. Write `scripts/script.py` (same shape as `example_script_entry_xauusd.py`): `SCENES = [dict(id, chapter, visual, vo)]`.
   Gue/lo register, Brand Bible voice, numbers spelled out for TTS, compliance per
   `trading-content-compliance-id` (no profit promises, examples labelled simulasi, slippage caveat on SL).
   ~1,100–1,250 words ≈ 8 min.
2. Voiceover: ElevenLabs `creative_generate_speech`, voice **Dhiraj-Professional** `W5rRYzRkTBXRQ6jGNWPR`,
   model `eleven_v4`, `generations_count: 1`, one call per scene on one flow. Read the `content_url`s with one
   `creative_get_flow_run_status` call and `curl` them to `remotion/public/vo/<id>.mp3`
   (domains elevenlabsusercontent.com + storage.googleapis.com are allow-listed).
   Then apply voice filter B (Dhiraj, 20 Nov 2026: real voice is deeper; same filter as the short faceless series, but
   tempo unchanged) to every file before align.py:
   `for f in remotion/public/vo/*.mp3; do ffmpeg -y -loglevel error -i "$f" -af "aresample=44100,asetrate=41454,aresample=44100,atempo=1.0638,bass=g=4:f=120,equalizer=f=3500:t=q:w=1:g=-1.5,loudnorm=I=-14:TP=-1.5" -ar 44100 -b:a 192k "${f%.mp3}.b.mp3" && mv "${f%.mp3}.b.mp3" "$f"; done`
3. `python3 scripts/align.py` (run from this folder) → `remotion/public/timings.json` (sentence timings from VO pauses;
   SUBMAP turns spoken numbers into digits for subtitles).
4. Scenes: `remotion/src/Scenes.tsx` maps `visual` → component; each gets `b(k)` = frame where sentence k starts.
   Reuse `Chart`, `Zone`, `HLine`, `Tag`, `Card`, `Rule`, `ListScene`, `Hl`, `Appear`. Never call hooks conditionally.
   Chapter cards come from `CARD` in `Main.tsx`.
5. `cd remotion && npm i` then QC stills: `npx remotion still src/index.ts Main qc/fN.jpg --frame=N --browser-executable=/usr/bin/google-chrome`
   at the busiest moments (`scripts/frames.py` prints frames). Fix overlaps before the full render.
6. Render: `npx remotion render src/index.ts Main out/main.mp4 --browser-executable=/usr/bin/google-chrome --concurrency=2 --crf=18 --audio-codec=aac`
   (~3 fps on 2 cores), `End` comp (600 frames) → concat with ffmpeg; loudnorm to −14 LUFS / −1 dBTP.
   Thumbnail: `npx remotion still src/index.ts Thumb out/thumbnail.png` (gold bar + black bar, red "?").
7. Upload via Tebar: `create_upload_link` + curl (8 MB parts if > 95 MB) for video and thumbnail, then
   `create_post` to the YouTube account with `youtube: {title ≤100 incl. 4 hashtags incl #dhirajkelly, made_for_kids: false,
   privacy: public, contains_synthetic_media: true, cover_media_id}`; description = summary, timestamps, CTA, disclaimer, AI-voice note.
8. Academy module videos: add `"<course>/<lesson>": "https://youtu.be/<id>"` to `content/academy-videos.json`, push to main.
9. AE handoff: `python3 scripts/make_ae.py` → `out/ae/build_timeline.jsx` + `timeline.edl`; `out/subtitles_id.srt`.
