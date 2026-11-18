# Artikel SEO harian — eraintegrityindonesia.com

Folder ini milik website agen properti Era Integrity Indonesia (WordPress 4.7 di platform BuatWebProperty), bukan aplikasi Doktor Trader. Admin website tidak punya akses plugin, jadi `wp-plugin/` TIDAK dipakai. Artikel diposting oleh scheduled task kedua (±05.13 WIB) yang berjalan di komputer pemilik: browser bawaan Claude desktop app membuka `/kelolah/post-new.php` dan menjalankan `post-classic.js`, yang mengambil data dari `index.json` dan menjadwalkan tayangnya.

## Tugas harian (2 scheduled task per hari: Batch A dan Batch B)

Target **10 artikel baru per hari** (tanggal Asia/Jakarta), dibagi dua batch supaya kualitas tiap artikel tetap terjaga. Jam tayang dan jenis artikel tetap (A = komersial/lokal, B = panduan/edukasi, C = investasi/analisis/area; lihat bagian Pemilihan topik):

| Batch | File | Tayang (WIB) | Jenis |
|---|---|---|---|
| A | `articles/YYYY-MM-DD-0600-<slug>.md` | 06:00 | A |
| A | `articles/YYYY-MM-DD-0730-<slug>.md` | 07:30 | B |
| A | `articles/YYYY-MM-DD-0900-<slug>.md` | 09:00 | C |
| A | `articles/YYYY-MM-DD-1030-<slug>.md` | 10:30 | A |
| A | `articles/YYYY-MM-DD-1200-<slug>.md` | 12:00 | B |
| B | `articles/YYYY-MM-DD-1330-<slug>.md` | 13:30 | C |
| B | `articles/YYYY-MM-DD-1500-<slug>.md` | 15:00 | A |
| B | `articles/YYYY-MM-DD-1630-<slug>.md` | 16:30 | B |
| B | `articles/YYYY-MM-DD-1800-<slug>.md` | 18:00 | C |
| B | `articles/YYYY-MM-DD-1930-<slug>.md` | 19:30 | A |

- Batch A menulis 5 slot pertama, Batch B 5 slot terakhir. `git pull` dulu sebelum mulai. Kalau Batch B mendapati slot Batch A hari ini belum ada, tulis juga slot itu (tetap 10 total, jangan lebih).
- Jangan tulis ulang file yang sudah ada untuk slot itu; lengkapi yang kurang saja. Satu slot = satu artikel.
- Commit setiap kali 2–3 artikel lolos build (jangan tunggu kelimanya), supaya kalau sesi terputus artikel yang sudah jadi tetap terkirim.
- Build: `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/era-integrity/build.py`. Build harus lolos. Commit hanya perubahan di `content/era-integrity/` ke `main` dengan pesan `era: artikel YYYY-MM-DD batch A|B (n)`, lalu push (`git pull --rebase` dulu bila ditolak).
- Posting ke WordPress dilakukan scheduled task browser (±05.13 WIB) untuk semua artikel hari ini; Batch A ±03.17 WIB dan Batch B ±04.17 WIB harus selesai sebelum itu.

## Pemilihan topik

1. Baca `existing-posts.txt` (153 artikel lama; judul tersirat dari slug) dan frontmatter semua file di `articles/`. Jangan ulangi topik, slug, atau focus keyword. Topik yang sudah sangat banyak dibahas: legalitas sertifikat (SHM/HGB/girik, sertipikat elektronik), BPHTB/PPh, KPR ditolak, Whoosh/TOD, inspeksi rumah bekas, PKKPR. Hindari kecuali sudut pandangnya benar-benar baru.
2. Sepuluh artikel per hari harus beda niat pencarian, beda topik, dan beda lokasi/tipe sebisa mungkin. Dalam satu hari, jangan ada dua artikel yang focus keyword-nya hanya beda lokasi (mis. "X Karawang" dan "X Bekasi"). Jenis artikel per slot (lihat tabel):
   - **A — komersial/lokal**: (orang yang siap sewa/beli/jual): mis. sewa rumah dekat kawasan industri tertentu, gudang disewakan di Karawang Timur, ruko dijual di Galuh Mas, rumah dijual di perumahan/kecamatan tertentu, sewa rumah untuk ekspatriat di Cikarang, kontrakan petakan untuk karyawan.
   - **B — panduan/edukasi**: (proses & cara): titip jual ke agen, perjanjian sewa, cara menaksir harga, take over KPR, renovasi sebelum dijual, cara negosiasi, checklist serah terima rumah sewa.
   - **C — investasi/analisis/area**: profil kawasan (Telukjambe, Klari, Cikampek, Purwasari, Kotabaru, Rengasdengklok, Cikarang), yield kos/kontrakan/gudang, prospek infrastruktur, perbandingan area.
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
