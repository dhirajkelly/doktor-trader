# Artikel SEO harian — sarana-abadi.co.id

Folder ini milik website perusahaan PT Sarana Abadi Raya (WordPress), bukan aplikasi Doktor Trader. Aplikasi Doktor Trader tidak membaca folder ini. Plugin WordPress `SAR Auto Articles` (lihat `wp-plugin/`) membaca `index.json` dari GitHub setiap jam, mengimpor artikel baru, dan menjadwalkannya tayang.

## Tugas harian (2 scheduled task per hari: Batch A dan Batch B)

Target **10 artikel baru per hari** (tanggal Asia/Jakarta), dibagi dua batch supaya kualitas tiap artikel tetap terjaga. Jam tayang dan jenis artikel tetap (A = jasa/komersial lokal, B = teknis/how-to, C = regulasi, K3, mutu, manajemen proyek, atau studi kasus industri; lihat bagian Pemilihan topik):

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
- Build: `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/sarana-abadi/build.py`. Build harus lolos. Commit hanya perubahan di `content/sarana-abadi/` ke `main` dengan pesan `sar: artikel YYYY-MM-DD batch A|B (n)`, lalu push (`git pull --rebase` dulu bila ditolak).
- Plugin `SAR Auto Articles` mengimpor dari `index.json` setiap jam, jadi artikel tayang otomatis sesuai jamnya.

## Pemilihan topik

1. Baca dulu `existing-posts.txt` dan semua frontmatter di `articles/`. Jangan ulangi topik, slug, atau focus keyword yang sudah ada.
2. Sepuluh artikel per hari harus beda niat pencarian, beda topik, dan beda lokasi/tipe sebisa mungkin. Dalam satu hari, jangan ada dua artikel yang focus keyword-nya hanya beda lokasi (mis. "X Karawang" dan "X Bekasi"). Jenis artikel per slot (lihat tabel):
   - **A — jasa/komersial lokal**: (niat mencari kontraktor): mis. kontraktor gudang Bekasi, jasa renovasi pabrik Karawang, biaya cor lantai beton gudang, jasa fabrikasi baja Karawang, kontraktor interior kantor pabrik, jasa pemasangan atap spandek gudang, pembangunan kanopi loading dock.
   - **B — teknis/how-to**: (engineering, fabrikasi, sipil, MEP): mis. lantai beton floor hardener, struktur baja WF vs CNP, pondasi mesin, perhitungan kapasitas rak, sandwich panel cold storage, grounding & penangkal petir pabrik, epoxy lantai.
   - **C — regulasi, K3, mutu, manajemen proyek, atau studi kasus industri**: mis. SMK3, izin kerja panas, BAST & retensi, kurva S, addendum kontrak, TKDN, ISO 9001 di proyek konstruksi.
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
