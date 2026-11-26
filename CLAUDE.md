# Doktor Trader

Express + sql.js app for dhirajkelly.id: public landing, SEO blog, member area (Academy, Tanya Doktor, EA/AI Signals/Copy Trade), and admin CRM/CMS. Production pulls `main` every 10 minutes (deploy/update.sh). Anything pushed to `main` goes live.

## Daily SEO article (scheduled task)

The task runs three times a day (about 05:40, 11:40 and 17:40 WIB). Write ONE new article per run as `content/articles/YYYY-MM-DD-<slug>.md` (date = today in Asia/Jakarta). The app imports it automatically: the morning article goes live at 07:00 WIB, later ones within about 15 minutes of the push.

Topic spread: check the files already dated today and pick a different category and search intent from them, so the three daily articles cover different angles (for example one beginner guide, one risk-management or strategy piece, one psychology/fundamental/term-explainer).

Rules:
- Read the existing files in `content/articles/` first. Never repeat a focus keyword or slug that already exists; pick a new long-tail keyword Indonesian traders search for (forex, emas/XAUUSD, manajemen risiko, analisa teknikal, psikologi trading, istilah trading, MT4/MT5, kalender ekonomi, pemula).
- Language: Bahasa Indonesia, sapaan "Anda", voice of Dr. Dhiraj Kelly: a margin-call survivor turned risk-management educator. Calm, practical, no hype.
- 900–1,400 words. Structure: intro that contains the focus keyword in the first 100 words, 4–7 `##` sections (some `###`), at least one list, a table or worked example when it fits, and a `## Kesimpulan` that mentions the free Academy at Doktor Trader.
- Internal links: 1–3 links to other existing articles as `/artikel/<slug>`, plus at most one link to `/daftar`.
- YouTube: insert exactly one line `**Tonton juga:** [judul](https://www.youtube.com/watch?v=<id>)` right before `## Kesimpulan`, linking a video relevant to the topic from https://www.youtube.com/@dhirajkelly/videos. Get the list with Nimble `nimble_extract` on that URL and use only real video IDs from that result (never invent or guess an ID); use the video's title without hashtags.
- Frontmatter (all required):
  ```
  ---
  title: <55–65 chars, contains the keyword>
  slug: <kebab-case keyword-based slug>
  meta_title: <≤60 chars> | Doktor Trader
  meta_description: <140–158 chars, contains the keyword>
  focus_keyword: <keyword>
  category: <Manajemen Risiko | Analisa Teknikal | Psikologi Trading | Fundamental | Panduan Pemula | Strategi Emas>
  tags: [tag1, tag2, tag3]
  excerpt: <one sentence, ≤160 chars>
  ---
  ```
  Quote any value that contains a colon.
- Compliance (mandatory): education only. Never promise profit, never give a specific "buy/sell now" call, never quote win rates or returns, never claim regulation facts you have not verified. Market data in examples must be clearly illustrative ("contoh"). Don't name competitor brokers. Dupoin (the partner broker) may be mentioned neutrally.
- Facts that change (rates, regulations, dates of events) must be checked with web search, or left out.
- No unsupported claims: don't write "dari pertanyaan member", "banyak kasus", "mayoritas trader" or similar without a real source. Use precise terms (e.g. candle body vs high–low range) and double-check every number in examples.
- Where it fits, end with a short `## Pertanyaan yang sering diajukan` section (2–3 `###` questions), and link the free lot calculator `/alat/kalkulator-lot` in articles about lot, stop loss or risk.
- Compliance gate: the importer (`src/content.js` → `review()`) holds an article as a DRAFT instead of publishing it if it names another broker, promises profit, quotes a win rate or a return per day/week/month outside a warning context, gives a "buy/sell sekarang" call, claims member experience without data, is under 700 words, or misses frontmatter. Run `node -e "const c=require('./src/content');const f=process.argv[1];const {data,body}=c.parseFrontmatter(require('fs').readFileSync(f,'utf8'));console.log(c.review(data,body))" content/articles/<file>.md` before committing; it must print `[]`.
- Commit only the new markdown file to `main` with message `artikel: <title>` and push. Do not touch code.

## Correcting a published article

Edit its markdown file and add or increase `revision: N` in the frontmatter (first file is revision 1). The app re-imports the file when the revision goes up, unless the article was edited in the admin (the admin copy wins). Commit with message `artikel(revisi): <title>`.

## Dupoin member approval (manual)

Pending members are approved manually by the admin in `/admin`. The hourly auto-approval scheduled task ("Doktor Trader: approval member via referral Dupoin") was paused on 2026-11-19 at the owner's request; don't re-enable it or approve members from a scheduled run unless the owner asks.

The auto-approval flow, kept for reference if it is turned back on: it runs in the admin's built-in browser (logged in to both dhirajkelly.id admin and portal.dupoin.co.id): GET `/admin/api/dupoin/pending` → run `scripts/dupoin-portal-check.js` in the portal tab → POST the result to `/admin/api/dupoin/results` with header `x-csrf-token`. The server approves only a single match that is KYC-verified and has ≥1 trading account, and never reuses a Dupoin UID already tied to another approved member. Everything else stays pending with a note in admin.

## Academy module videos (scheduled task)

Each of the 30 Academy lessons gets a faceless YouTube video (one per day). Since 2026-11-26 new lesson videos go only to the Doktor Trader YouTube channel (@doktortraderid, via Metricool blogId 7054057), never to @dhirajkelly; links already in the JSON stay as they are. After the video is uploaded, add its link to `content/academy-videos.json` as `"<course-slug>/<lesson-slug>": "https://youtu.be/<id>"` and push to `main` with message `academy(video): <lesson title>`. The importer (`src/content.js` → `syncAcademyVideos()`, run with the 5-minute content sync) sets the lesson's `video_url`, which the member page embeds. It never overwrites a link the admin changed by hand. Slugs are `slugify(title)` of the course and lesson in `scripts/seed.js`. Touch only the JSON file in that task.

## Temporary media hosting (scheduled tasks)

`src/media.js` hosts files for tools that need a public URL (e.g. Metricool posting a video when Tebar's YouTube quota is used up). Upload: `curl --fail -X POST --data-binary @video.mp4 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/octet-stream" "https://dhirajkelly.id/media/upload?ext=mp4"` (ext: mp4, mov, jpg, jpeg, png; max 1 GiB) → `{ url, name, bytes, expires_at }`. The URL is public, `noindex`, and the file is deleted automatically after 7 days (or with `DELETE /media/<name>` and the same token). Only the token's SHA-256 is in the code (override with env `MEDIA_UPLOAD_TOKEN_SHA256`); the token itself is kept with the scheduled task, never in the repo.

## Pipeline lead sales (`/admin/lead`)

Table `leads` (dedupe key `whatsapp`, format 62xxx) + `lead_log`. Import CSV at `/admin/lead/import` (admin only, preview first); existing leads are never overwritten, only empty fields are filled. Role `sales` (accounts made in `/admin/lead/tim`) can only view/edit the pipeline. Code: `src/leads.js`, `src/routes/leads.js`. The repo is public: never commit lead CSVs or any lead data; import only through the admin page.
