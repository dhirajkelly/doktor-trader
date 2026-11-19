# Artikel SEO harian — transsuma.com

Folder ini milik website PT Transsuma Lestari Sejahtera (jasa pengangkutan limbah B3 di Karawang; WordPress), bukan aplikasi Doktor Trader. Aplikasi Doktor Trader tidak membaca folder ini. Plugin WordPress `TLS Auto Articles` (lihat `wp-plugin/`) membaca `index.json` dari GitHub setiap jam, mengimpor artikel baru, dan menjadwalkannya tayang.

## Tugas harian (scheduled task, sekali sehari dini hari)

Target **3 artikel baru per hari** (tanggal Asia/Jakarta). Jam tayang dan jenis artikel tetap (A, B, C; lihat bagian Pemilihan topik):

| File | Tayang (WIB) | Jenis |
|---|---|---|
| `articles/YYYY-MM-DD-0700-<slug>.md` | 07:00 | A |
| `articles/YYYY-MM-DD-1200-<slug>.md` | 12:00 | B |
| `articles/YYYY-MM-DD-1700-<slug>.md` | 17:00 | C |

- `git pull` dulu sebelum mulai. Jangan tulis ulang file yang sudah ada untuk hari ini; lengkapi yang kurang saja. Satu slot = satu artikel, maksimal 3 per hari.
- Commit setiap kali artikel lolos build (jangan tunggu ketiganya), supaya kalau sesi terputus artikel yang sudah jadi tetap terkirim.
- Build: `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/transsuma/build.py`. Build harus lolos. Commit hanya perubahan di `content/transsuma/` ke `main` dengan pesan `tls: artikel YYYY-MM-DD (n)`, lalu push (`git pull --rebase` dulu bila ditolak).
- Plugin `TLS Auto Articles` mengimpor dari `index.json` setiap jam, jadi artikel tayang otomatis sesuai jamnya.

## Pemilihan topik

1. Baca dulu `existing-posts.txt` (artikel lama; topik tersirat dari slug) dan semua frontmatter di `articles/`. Jangan ulangi topik, slug, atau focus keyword yang sudah ada. Banyak artikel lama punya versi ganda (akhiran -2, -3): anggap topik itu sudah habis.
2. Tiga artikel per hari harus beda niat pencarian, beda topik, dan beda lokasi/tipe sebisa mungkin. Dalam satu hari, jangan ada dua artikel yang focus keyword-nya hanya beda lokasi. Jenis artikel per slot (lihat tabel):
   - **A — jasa/komersial lokal** (niat mencari transporter limbah B3): mis. jasa angkut limbah B3 Karawang, transporter limbah medis Bekasi, jasa angkut oli bekas pabrik Cikarang, jasa angkut limbah B3 bengkel, jasa angkut aki bekas, jasa angkut sludge IPAL Purwakarta.
   - **B — panduan/how-to pengelolaan limbah B3 di fasilitas** (yang dikerjakan penghasil limbah): mis. cara mengisi manifest elektronik (Festronik), cara menyimpan limbah B3 di TPS, simbol dan label limbah B3, cara memilih kemasan limbah B3, cara menghitung neraca limbah B3, cara menyusun logbook limbah.
   - **C — regulasi, jenis limbah, atau K3 & tanggap darurat**: mis. isi PP 22/2021 tentang limbah B3, kode limbah dan kategori bahaya, perbedaan limbah B3 dan non-B3, masa simpan limbah B3, tanggap darurat tumpahan saat pengangkutan, kewajiban pelaporan ke instansi lingkungan hidup.
3. Prioritaskan long-tail keyword berbahasa Indonesia yang dicari staf EHS/HSE, manajer pabrik, bengkel, klinik/rumah sakit, dan pengelola kawasan industri di Karawang, Bekasi, Cikarang, Purwakarta, dan Jabodetabek. Situs ini baru punya 3 artikel umum tentang jasa pengangkutan limbah B3; mulai dari topik dasar yang paling banyak dicari, lalu makin spesifik per jenis limbah dan per industri.

## Gaya & struktur

- Bahasa Indonesia baku tapi luwes, sapaan "Anda", suara perusahaan "kami" (PT Transsuma Lestari Sejahtera, jasa pengangkutan limbah B3 di Karawang). Praktis untuk staf EHS/HSE, manajer pabrik, pengelola fasilitas kesehatan, dan bagian pengadaan. Tanpa klaim superlatif ("terbaik", "nomor 1").
- 1.300–2.000 kata. Mulai dengan epigraf satu kalimat sebagai blockquote (`> ...`, tanpa nama tokoh), lalu intro yang memuat focus keyword (ditebalkan sekali) dalam 100 kata pertama.
- 5–8 subjudul `##` (boleh `###`), minimal satu daftar, dan minimal satu tabel atau contoh perhitungan bila relevan. Jangan pakai `#` (H1).
- Akhiri dengan `## Kesimpulan` yang merangkum dan menutup dengan ajakan halus berkonsultasi dengan PT Transsuma Lestari Sejahtera. Kotak penutup dan FAQ ditambahkan otomatis oleh build.
- Internal link: 2–3 link ke artikel lain dengan URL lengkap dari `existing-posts.txt` atau kolom `url` di `index.json` (hanya artikel yang jam tayangnya sudah lewat). Boleh 0–2 link eksternal ke sumber resmi.
- Regulasi limbah B3 (PP 22/2021, peraturan menteri tentang pengelolaan dan pengangkutan limbah B3, manifest elektronik, izin/rekomendasi pengangkutan dari kementerian lingkungan hidup dan kementerian perhubungan), kode limbah, dan masa simpan WAJIB dicek dengan web search ke sumber resmi (JDIH kementerian LH, peraturan.bpk.go.id, Kemenhub). Nomenklatur kementerian berubah sejak akhir 2024 (KLHK dipecah); pakai nama instansi yang berlaku sekarang. Kalau tidak bisa diverifikasi, jangan ditulis.
- Jangan mengklaim izin, nomor rekomendasi, jenis limbah yang boleh diangkut, armada, sertifikasi, lama pengalaman, atau klien perusahaan. Jangan klaim superlatif. Jangan menjelekkan transporter lain. Jangan memberi saran yang melanggar aturan (mis. membuang, mencampur, atau mengangkut limbah tanpa transporter berizin).
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
image_alt: "Gambar sampul artikel PT Transsuma Lestari Sejahtera tentang <topik>"
faq:
  - q: "<pertanyaan>"
    a: "<jawaban 1–3 kalimat>"
  # 3–6 item
---
```

Kategori yang boleh dipakai (sudah ada di WordPress): Regulasi Limbah B3 · Pengangkutan & Manifest · Jenis & Karakteristik Limbah B3 · K3 & Tanggap Darurat · Panduan Pengelolaan Limbah untuk Industri · Jasa Pengangkutan Limbah B3.

Selalu beri tanda kutip pada nilai yang mengandung titik dua.
