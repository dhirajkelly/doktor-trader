# Artikel SEO harian — eraintegrityindonesia.com

Folder ini milik website agen properti Era Integrity Indonesia (WordPress 4.7 di platform BuatWebProperty), bukan aplikasi Doktor Trader. Admin website tidak punya akses plugin, jadi `wp-plugin/` TIDAK dipakai. Artikel diposting oleh scheduled task kedua (±05.13 WIB) yang berjalan di komputer pemilik: browser bawaan Claude desktop app membuka `/kelolah/post-new.php` dan menjalankan `post-classic.js`, yang mengambil data dari `index.json` dan menjadwalkan tayangnya.

## Tugas harian (scheduled task, sekali sehari sekitar 04.47 WIB)

Tulis **3 artikel baru** untuk hari ini (tanggal Asia/Jakarta), jam tayang **07:00, 12:00, 17:00 WIB**:

- `articles/YYYY-MM-DD-0700-<slug>.md`
- `articles/YYYY-MM-DD-1200-<slug>.md`
- `articles/YYYY-MM-DD-1700-<slug>.md`

Lalu `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/era-integrity/build.py`. Build harus lolos. Commit hanya perubahan di `content/era-integrity/` ke `main` dengan pesan `era: 3 artikel YYYY-MM-DD`, lalu push. Jika file untuk hari ini sudah ada, jangan tulis ulang; lengkapi yang kurang saja.

## Pemilihan topik

1. Baca `existing-posts.txt` (153 artikel lama; judul tersirat dari slug) dan frontmatter semua file di `articles/`. Jangan ulangi topik, slug, atau focus keyword. Topik yang sudah sangat banyak dibahas: legalitas sertifikat (SHM/HGB/girik, sertipikat elektronik), BPHTB/PPh, KPR ditolak, Whoosh/TOD, inspeksi rumah bekas, PKKPR. Hindari kecuali sudut pandangnya benar-benar baru.
2. Tiga artikel per hari harus beda niat pencarian:
   - **07:00 — komersial/lokal** (orang yang siap sewa/beli/jual): mis. sewa rumah dekat kawasan industri tertentu, gudang disewakan di Karawang Timur, ruko dijual di Galuh Mas, rumah dijual di perumahan/kecamatan tertentu, sewa rumah untuk ekspatriat di Cikarang, kontrakan petakan untuk karyawan.
   - **12:00 — panduan/edukasi** (proses & cara): titip jual ke agen, perjanjian sewa, cara menaksir harga, take over KPR, renovasi sebelum dijual, cara negosiasi, checklist serah terima rumah sewa.
   - **17:00 — investasi/analisis/area**: profil kawasan (Telukjambe, Klari, Cikampek, Purwasari, Kotabaru, Rengasdengklok, Cikarang), yield kos/kontrakan/gudang, prospek infrastruktur, perbandingan area.
3. Prioritaskan long-tail keyword berbahasa Indonesia untuk Karawang dan sekitarnya (Bekasi, Cikarang, Purwakarta, Subang, Cianjur). Variasikan lokasi dan tipe properti (rumah, tanah, ruko, gudang, apartemen, kos/kontrakan).

## Gaya & struktur

- Bahasa Indonesia santai-profesional seperti artikel lama: sapaan "Anda", kalimat pendek, pembuka bercerita atau pertanyaan yang relatable. Suara "kami" = tim Era Integrity Indonesia. Tanpa klaim superlatif dan tanpa janji keuntungan.
- Cerita/contoh kasus boleh, tetapi tandai sebagai ilustrasi ("misalnya", "ilustrasi"). Jangan mengarang klien nyata, testimoni, jumlah transaksi, penghargaan, atau sertifikasi.
- 1.300–2.000 kata. Mulai dengan epigraf satu kalimat sebagai blockquote (`> ...`), lalu intro yang memuat focus keyword (ditebalkan sekali) dalam 100 kata pertama.
- 5–8 subjudul `##` (boleh `###`), minimal satu daftar, dan minimal satu tabel atau simulasi angka bila relevan. Jangan pakai `#` (H1).
- Tutup dengan `## Kesimpulan` + ajakan halus menghubungi Era Integrity Indonesia. Kotak kontak dan FAQ ditambahkan otomatis oleh build — jangan tulis nomor/alamat di isi.
- Internal link: 2–3 link ke artikel lama (URL lengkap dari `existing-posts.txt`, atau kolom `url` di `index.json` untuk artikel yang jam tayangnya sudah lewat), plus 1 link ke halaman listing yang relevan: `/property-type/rumah`, `/property-type/tanah`, `/property-type/gudang`, `/property-type/kantor-ruko`, `/property-type/apartemen`, `/status/for-sale/`, `/status/for-rent/`, atau `/list-property/` (semua dengan domain `https://www.eraintegrityindonesia.com`).
- Harga, aturan, pajak, suku bunga, dan data pasar wajib dicek dengan web search dan ditulis sebagai kisaran indikatif dengan catatan bahwa harga final tergantung kondisi properti. Kalau tidak bisa diverifikasi, jangan ditulis. Jangan menjelekkan agen/portal lain.

## Frontmatter (semua wajib)

```yaml
---
title: "<40–75 karakter, memuat focus keyword>"
slug: <kebab-case, sama dengan akhir nama file>
publish_at: "YYYY-MM-DD HH:MM"   # WIB: 07:00 / 12:00 / 17:00
meta_title: "<maks 60 karakter>"
meta_description: "<130–160 karakter, memuat focus keyword>"
focus_keyword: <keyword huruf kecil>
categories: [<1–3 dari daftar di bawah>]
tags: [tag1, tag2, tag3, tag4]
excerpt: "<satu kalimat, maks 160 karakter>"
image_alt: "Gambar sampul artikel Era Integrity Indonesia tentang <topik>"
faq:
  - q: "<pertanyaan>"
    a: "<jawaban 1–3 kalimat>"
  # 3–6 item
---
```

Kategori yang boleh dipakai (sudah ada di WordPress): Area & Kawasan · Jual • Beli • Sewa · Listing Properti · Investasi & Analisis · Tren & Wawasan Pasar · Layanan & Konsultasi ERA · Panduan & Edukasi Agen. (Tulis "Jual • Beli • Sewa" persis dengan karakter •.)

Selalu beri tanda kutip pada nilai yang mengandung titik dua.
