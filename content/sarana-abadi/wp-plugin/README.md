# SAR Auto Articles (plugin WordPress)

1. Zip folder `sar-auto-articles/` (atau pakai `sar-auto-articles.zip`).
2. wp-admin → Plugins → Add New → Upload Plugin → pilih zip → Install → Activate.
3. Buka Tools → SAR Auto Articles → klik **Sinkron sekarang**. Artikel hari ini akan muncul berstatus "Terjadwal".

Plugin mengecek `index.json` setiap jam (WP-Cron + fallback saat ada pengunjung), mengimpor artikel baru lengkap dengan kategori, tag, gambar sampul + alt, meta title/description/focus keyword (Yoast & Rank Math), dan schema FAQ. Artikel yang Anda hapus tidak akan diimpor ulang. Centang "Hentikan sementara" untuk menjeda.
