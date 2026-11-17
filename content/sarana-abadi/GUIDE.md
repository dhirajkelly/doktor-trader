# Artikel SEO harian — sarana-abadi.co.id

Folder ini milik website perusahaan PT Sarana Abadi Raya (WordPress), bukan aplikasi Doktor Trader. Aplikasi Doktor Trader tidak membaca folder ini. Plugin WordPress `SAR Auto Articles` (lihat `wp-plugin/`) membaca `index.json` dari GitHub setiap jam, mengimpor artikel baru, dan menjadwalkannya tayang.

## Tugas harian (scheduled task, sekali sehari sekitar 04.47 WIB)

Tulis **3 artikel baru** untuk hari ini (tanggal Asia/Jakarta), jam tayang **07:00, 12:00, 17:00 WIB**:

- `articles/YYYY-MM-DD-0700-<slug>.md`
- `articles/YYYY-MM-DD-1200-<slug>.md`
- `articles/YYYY-MM-DD-1700-<slug>.md`

Lalu jalankan `pip install -q markdown pyyaml pillow --break-system-packages` (jika perlu) dan `python3 content/sarana-abadi/build.py`. Build harus lolos tanpa error (perbaiki artikel sampai lolos). Commit file baru di `content/sarana-abadi/` (articles, html, img, index.json) ke `main` dengan pesan `sar: 3 artikel YYYY-MM-DD` dan push. Jangan ubah file lain di repo. Jika file untuk tanggal hari ini sudah ada, jangan tulis ulang; cukup lengkapi yang kurang.

## Pemilihan topik

1. Baca dulu `existing-posts.txt` dan semua frontmatter di `articles/`. Jangan ulangi topik, slug, atau focus keyword yang sudah ada.
2. Tiga artikel per hari harus beda kategori dan beda niat pencarian. Pola yang disarankan:
   - **07:00 — jasa/komersial lokal** (niat mencari kontraktor): mis. kontraktor gudang Bekasi, jasa renovasi pabrik Karawang, biaya cor lantai beton gudang, jasa fabrikasi baja Karawang, kontraktor interior kantor pabrik, jasa pemasangan atap spandek gudang, pembangunan kanopi loading dock.
   - **12:00 — teknis/how-to** (engineering, fabrikasi, sipil, MEP): mis. lantai beton floor hardener, struktur baja WF vs CNP, pondasi mesin, perhitungan kapasitas rak, sandwich panel cold storage, grounding & penangkal petir pabrik, epoxy lantai.
   - **17:00 — regulasi, K3, mutu, manajemen proyek, atau studi kasus industri**: mis. SMK3, izin kerja panas, BAST & retensi, kurva S, addendum kontrak, TKDN, ISO 9001 di proyek konstruksi.
3. Prioritaskan long-tail keyword berbahasa Indonesia yang dicari pemilik/pengelola pabrik di Karawang, Bekasi, Purwakarta, Cikarang, Bandung, Jabodetabek. Variasikan lokasi.

## Gaya & struktur

- Bahasa Indonesia baku tapi luwes, sapaan "Anda", suara perusahaan "kami" (PT Sarana Abadi Raya, EPC & General Contractor, Karawang). Praktis, tidak lebay, tanpa klaim superlatif ("terbaik", "nomor 1").
- 1.300–2.000 kata. Mulai dengan epigraf satu kalimat sebagai blockquote (`> ...`, tanpa nama tokoh), lalu intro yang memuat focus keyword (ditebalkan sekali) dalam 100 kata pertama.
- 5–8 subjudul `##` (boleh `###`), minimal satu daftar, dan minimal satu tabel atau contoh perhitungan bila relevan. Jangan pakai `#` (H1).
- Akhiri dengan `## Kesimpulan` yang merangkum dan menutup dengan ajakan halus berkonsultasi dengan PT Sarana Abadi Raya. Kotak kontak dan FAQ ditambahkan otomatis oleh build — jangan tulis alamat/telepon di isi.
- Internal link: 2–3 link ke artikel lain dengan URL lengkap dari `existing-posts.txt` atau kolom `url` di `index.json` (hanya artikel yang jam tayangnya sudah lewat). Boleh 0–2 link eksternal ke sumber resmi (peraturan, kementerian, SNI).
- Angka harga: hanya bila sudah dicek lewat web search dan ditulis sebagai kisaran indikatif dengan catatan bahwa harga final bergantung BOQ dan lokasi. Peraturan, nomor PP/Permen, dan data yang bisa berubah wajib dicek dengan web search; kalau tidak yakin, jangan ditulis.
- Jangan sebut nama klien PT SAR, jangan mengarang proyek, sertifikasi, atau angka pengalaman perusahaan. Jangan menjelekkan kontraktor lain.

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
image_alt: "Gambar sampul artikel PT Sarana Abadi Raya tentang <topik>"
faq:
  - q: "<pertanyaan>"
    a: "<jawaban 1–3 kalimat>"
  # 3–6 item
---
```

Kategori yang boleh dipakai (sudah ada di WordPress): Construction Technology & Innovation · Engineering & Design · Industrial Projects & Case Studies · Fabrication & Construction · Safety, Health & Environment (SHE) · Corporate & Partnership · Quality & Standards · Jasa Kontraktor Karawang.

Selalu beri tanda kutip pada nilai yang mengandung titik dua.
