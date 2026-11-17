# Doktor Trader

Express + sql.js app for dhirajkelly.id: public landing, SEO blog, member area (Academy, Tanya Doktor, EA/AI Signals/Copy Trade), and admin CRM/CMS. Production pulls `main` every 10 minutes (deploy/update.sh). Anything pushed to `main` goes live.

## Daily SEO article (scheduled task)

Write ONE new article per run as `content/articles/YYYY-MM-DD-<slug>.md` (date = today in Asia/Jakarta). The app imports it automatically; it goes live at 07:00 WIB on that date.

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
- Compliance (mandatory): education only. Never promise profit, never give a specific "buy/sell now" call, never quote win rates or returns, never claim regulation facts you have not verified. Market data in examples must be clearly illustrative ("contoh"). Don't name competitor brokers. Vantage may be mentioned neutrally.
- Facts that change (rates, regulations, dates of events) must be checked with web search, or left out.
- Commit only the new markdown file to `main` with message `artikel: <title>` and push. Do not touch code.
