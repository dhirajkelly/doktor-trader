# SLF Auto Articles (plugin WordPress)

1. Pakai `slf-auto-articles.zip` (atau zip folder `slf-auto-articles/`).
2. wp-admin → Plugins → Add New → Upload Plugin → pilih zip → Install → Activate.
3. Buka Tools → SLF Auto Articles → klik **Sinkron sekarang**. Artikel hari ini akan muncul berstatus "Terjadwal".

Plugin mengecek `index.json` setiap jam (WP-Cron + fallback saat ada pengunjung), mengimpor artikel baru lengkap dengan kategori, tag, gambar sampul + alt, meta title/description/focus keyword (Yoast & Rank Math), dan schema FAQ. Artikel yang Anda hapus tidak akan diimpor ulang. Centang "Hentikan sementara" untuk menjeda.
