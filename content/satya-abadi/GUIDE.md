# Artikel SEO harian — satya-abadi.co.id

Folder ini milik website PT Satya Abadi Raya (engineering, machining, fabrication, automation, serta mold & dies di Karawang; WordPress), bukan aplikasi Doktor Trader. Aplikasi Doktor Trader tidak membaca folder ini. Plugin WordPress `SAT Auto Articles` (lihat `wp-plugin/`) membaca `index.json` dari GitHub setiap jam, mengimpor artikel baru, dan menjadwalkannya tayang.

## Tugas harian (scheduled task, sekali sehari dini hari)

Target **3 artikel baru per hari** (tanggal Asia/Jakarta). Jam tayang dan jenis artikel tetap (A, B, C; lihat bagian Pemilihan topik):

| File | Tayang (WIB) | Jenis |
|---|---|---|
| `articles/YYYY-MM-DD-0700-<slug>.md` | 07:00 | A |
| `articles/YYYY-MM-DD-1200-<slug>.md` | 12:00 | B |
| `articles/YYYY-MM-DD-1700-<slug>.md` | 17:00 | C |

- `git pull` dulu sebelum mulai. Jangan tulis ulang file yang sudah ada untuk hari ini; lengkapi yang kurang saja. Satu slot = satu artikel, maksimal 3 per hari.
- Commit setiap kali artikel lolos build (jangan tunggu ketiganya), supaya kalau sesi terputus artikel yang sudah jadi tetap terkirim.
- Build: `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/satya-abadi/build.py`. Build harus lolos. Commit hanya perubahan di `content/satya-abadi/` ke `main` dengan pesan `sat: artikel YYYY-MM-DD (n)`, lalu push (`git pull --rebase` dulu bila ditolak).
- Plugin `SAT Auto Articles` mengimpor dari `index.json` setiap jam, jadi artikel tayang otomatis sesuai jamnya.

## Pemilihan topik

1. Baca dulu `existing-posts.txt` (artikel lama; topik tersirat dari slug) dan semua frontmatter di `articles/`. Jangan ulangi topik, slug, atau focus keyword yang sudah ada. Banyak artikel lama punya versi ganda (akhiran -2, -3): anggap topik itu sudah habis.
2. Tiga artikel per hari harus beda niat pencarian, beda topik, dan beda lokasi/tipe sebisa mungkin. Dalam satu hari, jangan ada dua artikel yang focus keyword-nya hanya beda lokasi. Jenis artikel per slot (lihat tabel):
   - **A — jasa/komersial lokal** (niat mencari vendor): mis. jasa CNC machining Karawang, bengkel bubut presisi Cikarang, jasa pembuatan jig & fixture Bekasi, jasa fabrikasi stainless food grade, jasa pembuatan mold injection Karawang, jasa panel otomasi PLC, jasa reverse engineering spare part.
   - **B — teknis/how-to** (machining, material, desain, otomasi, mold): mis. toleransi ISO 286, cara memilih end mill, perlakuan panas baja S45C, hardness HRC vs HB, desain sanitary food equipment, sizing motor & gearbox conveyor, cara membaca gambar teknik GD&T.
   - **C — mutu, K3, standar, atau manajemen produksi**: mis. PPAP & FAI, inspeksi CMM, SMK3 di workshop, LOTO mesin, kalibrasi alat ukur, TKDN komponen, studi kasus industri otomotif/makanan di Karawang (tanpa nama klien).
3. Prioritaskan long-tail keyword berbahasa Indonesia yang dicari engineer, purchasing, maintenance, dan manajer produksi pabrik di Karawang, Bekasi, Cikarang, Purwakarta, dan Jabodetabek. Banyak artikel lama sudah membahas OEE, SMED, FAT/SAT, OPC UA, CIP, ISO 9001, dan TKDN: cari sudut lain yang lebih spesifik dan praktis.

## Gaya & struktur

- Bahasa Indonesia baku tapi luwes, sapaan "Anda", suara perusahaan "kami" (PT Satya Abadi Raya, engineering & manufaktur di Karawang). Teknis, presisi, praktis untuk engineer, buyer, dan manajer produksi. Tanpa klaim superlatif ("terbaik", "nomor 1").
- 1.300–2.000 kata. Mulai dengan epigraf satu kalimat sebagai blockquote (`> ...`, tanpa nama tokoh), lalu intro yang memuat focus keyword (ditebalkan sekali) dalam 100 kata pertama.
- 5–8 subjudul `##` (boleh `###`), minimal satu daftar, dan minimal satu tabel atau contoh perhitungan bila relevan. Jangan pakai `#` (H1).
- Akhiri dengan `## Kesimpulan` yang merangkum dan menutup dengan ajakan halus berkonsultasi dengan tim engineering PT Satya Abadi Raya. Kotak penutup dan FAQ ditambahkan otomatis oleh build.
- Internal link: 2–3 link ke artikel lain dengan URL lengkap dari `existing-posts.txt` atau kolom `url` di `index.json` (hanya artikel yang jam tayangnya sudah lewat). Boleh 0–2 link eksternal ke sumber resmi.
- Angka harga hanya bila sudah dicek lewat web search, sebagai kisaran indikatif dengan catatan bahwa harga final bergantung gambar, material, jumlah, dan toleransi. Standar (ISO, JIS, SNI), peraturan (Permenperin, Permenaker), dan data teknis wajib dicek dengan web search; kalau tidak yakin, jangan ditulis.
- Jangan sebut nama klien, jangan mengarang proyek, sertifikasi, kapasitas mesin, atau angka pengalaman perusahaan. Jangan klaim superlatif. Jangan menjelekkan vendor lain.
- Kotak kontak ditambahkan otomatis oleh build: jangan tulis alamat/telepon di isi.

## Frontmatter (semua wajib)

```yaml
---
title: "<40–75 karakter, memuat focus keyword>"
slug: <kebab-case, berbasis keyword, sama dengan akhir nama file>
publish_at: "YYYY-MM-DD HH:MM"   # WIB: 07:00 / 12:00 / 17:00
meta_title: "<maks 60 karakter>"
meta_description: "<130–160 karakter, memuat focus keyword>"
focus_keyword: <keyword huruf kecil>
categories: [<1–3 dari daftar di bawah>]
tags: [tag1, tag2, tag3, tag4]
excerpt: "<satu kalimat, maks 160 karakter>"
image_alt: "Gambar sampul artikel PT Satya Abadi Raya tentang <topik>"
faq:
  - q: "<pertanyaan>"
    a: "<jawaban 1–3 kalimat>"
  # 3–6 item
---
```

Kategori yang boleh dipakai (sudah ada di WordPress): Berita & Proyek (News/Case Studies) · Engineering & Desain · Fabrication & Construction · Food Industry Solutions · Industrial Automation · Mold & Dies · Mutu, K3 & Lingkungan (QHSE) · Precision Machining.

Selalu beri tanda kutip pada nilai yang mengandung titik dua.
