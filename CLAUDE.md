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

## Dupoin auto-approval (scheduled task)

Pending members are approved automatically by an hourly scheduled task that runs in the admin's built-in browser (logged in to both dhirajkelly.id admin and portal.dupoin.co.id): GET `/admin/api/dupoin/pending` → run `scripts/dupoin-portal-check.js` in the portal tab → POST the result to `/admin/api/dupoin/results` with header `x-csrf-token`. The server approves only a single match that is KYC-verified and has ≥1 trading account, and never reuses a Dupoin UID already tied to another approved member. Everything else stays pending with a note in admin.
