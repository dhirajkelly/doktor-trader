# XAUUSD daily trading-plan Short (9:16)

Used by the scheduled task "XAUUSD daily plan + video" (weekdays). One command renders the video:

```bash
tools/xau-daily-video/render.sh WORKDIR
```

WORKDIR needs:

| File | What |
|---|---|
| `data.json` | Chart data + plan. Shape: `example/data.json`. H1 = last 60 bars of OANDA:XAUUSD with `ema200`, `swings`, `invalidation`, `yRange`; M5 = last 72 bars with `ema9`, `vwap`, `keyLevel`, `yRange`, `yRangePlan`. `plan` = `null` on NO TRADE days (then fill `noTradeReason`). `plan.path` = projected scenario as `[barsAfterLastCandle, price]`. `risk.equity` = live FundedNext equity. |
| `cues.json` | Phrases from the narration that time each scene (`example/cues.json`). `s3` (SL/TP scene) may be `null` on NO TRADE days. `replace` turns spoken numbers into digits in captions. |
| `vo_raw.mp3` | ElevenLabs voice `W5rRYzRkTBXRQ6jGNWPR` (Dhiraj-Professional), model `eleven_v4`, one take. |
| `words.json` | ElevenLabs scribe word timestamps of `vo_raw.mp3`. |
| `host_raw.mp4` | Avatar clip, ElevenLabs flow `czfFlIlCur8n3RiG8RGi`, generation `yLfhsLCYAFuHK3GtjdX5` (fresh URL each run). |

Output: `WORKDIR/final.mp4` (1080x1920, 30 fps, -14 LUFS) and `WORKDIR/check_*.png` QC frames.
Voice filter: -1 semitone, bass boost, 1.1x tempo; caption/scene timing = raw timestamps / 1.1.
Audio is all self-made (synth pad + synthesized SFX), no third-party music.
Render takes about 8 minutes on 2 cores.

After posting, add ONLY the Instagram post link to `content/analisa-videos.json` (newest first; no video file on the VPS):
`{ "date": "YYYY-MM-DD", "title": "...", "url": "https://www.instagram.com/reel/<code>/" }`.
It shows on the member page `/member/analisa` ("Video Analisa Harian XAUUSD").
