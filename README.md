# Doktor Trader — dhirajkelly.id

Platform edukasi trading Dr. Dhiraj Kelly.

- **Publik:** landing (`public/index.html`), blog SEO `/artikel`, `/sitemap.xml`, `/robots.txt`, `/artikel/rss.xml`.
- **Member** (login setelah di-approve admin): `/member` dashboard, Academy, Tanya Doktor, EA · AI Signals · Copy Trade, akun.
- **Admin:** `/admin` ringkasan, CRM member (approve/tolak/nonaktif, tag, catatan, export CSV, reset password), CMS artikel SEO, kelola Academy, jawab pertanyaan, kelola tools.
- **Artikel otomatis:** file markdown di `content/articles/` diimpor otomatis (lihat `CLAUDE.md`).

## Jalankan lokal
```
npm install
node scripts/create-admin.js admin@contoh.id "Nama Admin" passwordku
npm start   # http://127.0.0.1:4300
```
Env: `PORT`, `DATA_DIR` (lokasi database), `SITE_URL`, `NODE_ENV=production` (cookie Secure), `WHATSAPP`, `BROKER_URL`.

## Server
`deploy/install.sh` (sekali), lalu `doktor-trader-pull.timer` menarik `main` tiap 10 menit lewat deploy key.
Data: `/var/lib/doktor-trader/doktor-trader.sqlite` (backup file ini).
