# Artikel SEO harian — saranalawfirm.com

Folder ini milik website Sarana Law Firm (firma hukum di Karawang, Jawa Barat; WordPress), bukan aplikasi Doktor Trader. Aplikasi Doktor Trader tidak membaca folder ini. Plugin WordPress `SLF Auto Articles` (lihat `wp-plugin/`) membaca `index.json` dari GitHub setiap jam, mengimpor artikel baru, dan menjadwalkannya tayang.

## Tugas harian (scheduled task, sekali sehari dini hari)

Target **3 artikel baru per hari** (tanggal Asia/Jakarta). Jam tayang dan jenis artikel tetap (A, B, C; lihat bagian Pemilihan topik):

| File | Tayang (WIB) | Jenis |
|---|---|---|
| `articles/YYYY-MM-DD-0700-<slug>.md` | 07:00 | A |
| `articles/YYYY-MM-DD-1200-<slug>.md` | 12:00 | B |
| `articles/YYYY-MM-DD-1700-<slug>.md` | 17:00 | C |

- `git pull` dulu sebelum mulai. Jangan tulis ulang file yang sudah ada untuk hari ini; lengkapi yang kurang saja. Satu slot = satu artikel, maksimal 3 per hari.
- Commit setiap kali artikel lolos build (jangan tunggu ketiganya), supaya kalau sesi terputus artikel yang sudah jadi tetap terkirim.
- Build: `pip install -q markdown pyyaml pillow --break-system-packages` (bila perlu) dan `python3 content/sarana-law/build.py`. Build harus lolos. Commit hanya perubahan di `content/sarana-law/` ke `main` dengan pesan `slf: artikel YYYY-MM-DD (n)`, lalu push (`git pull --rebase` dulu bila ditolak).
- Plugin `SLF Auto Articles` mengimpor dari `index.json` setiap jam, jadi artikel tayang otomatis sesuai jamnya.

## Pemilihan topik

1. Baca dulu `existing-posts.txt` (artikel lama; topik tersirat dari slug) dan semua frontmatter di `articles/`. Jangan ulangi topik, slug, atau focus keyword yang sudah ada. Banyak artikel lama punya versi ganda (akhiran -2, -3): anggap topik itu sudah habis.
2. Tiga artikel per hari harus beda niat pencarian, beda topik, dan beda lokasi/tipe sebisa mungkin. Dalam satu hari, jangan ada dua artikel yang focus keyword-nya hanya beda lokasi. Jenis artikel per slot (lihat tabel):
   - **A — layanan/kebutuhan hukum lokal** (niat mencari bantuan hukum): mis. pengacara perceraian Karawang, jasa pendirian PT Karawang, pengacara sengketa tanah Bekasi, konsultan hukum ketenagakerjaan perusahaan, jasa legal audit perusahaan, pengacara waris Purwakarta.
   - **B — panduan prosedur/how-to** (langkah, syarat, dokumen, biaya resmi): mis. cara mengajukan gugatan sederhana, cara membuat surat kuasa, cara melaporkan penipuan online, cara mengurus akta waris, syarat pengesahan PT perorangan, cara mendaftarkan merek di DJKI.
   - **C — penjelasan aturan, istilah, atau putusan terbaru** (edukasi publik dan kepatuhan perusahaan): mis. isi pasal tertentu di KUHP/KUHAP baru, perbedaan istilah hukum, putusan MK terbaru, aturan OJK/Kemnaker/ATR-BPN terbaru, kewajiban perusahaan menurut UU PDP.
3. Prioritaskan long-tail keyword berbahasa Indonesia yang dicari warga, pemilik usaha, HR, dan direksi di Karawang, Bekasi, Purwakarta, Cikarang, dan Jawa Barat. Variasikan bidang hukum: keluarga & waris, korporasi, perdata & kontrak, pidana, ketenagakerjaan, properti & pertanahan.

## Gaya & struktur

- Bahasa Indonesia baku tapi mudah dipahami orang awam, sapaan "Anda", suara firma "kami" (Sarana Law Firm, firma hukum di Karawang). Tenang, jelas, tidak menakut-nakuti. Tanpa klaim superlatif ("terbaik", "nomor 1").
- 1.300–2.000 kata. Mulai dengan epigraf satu kalimat sebagai blockquote (`> ...`, tanpa nama tokoh), lalu intro yang memuat focus keyword (ditebalkan sekali) dalam 100 kata pertama.
- 5–8 subjudul `##` (boleh `###`), minimal satu daftar, dan minimal satu tabel atau contoh perhitungan bila relevan. Jangan pakai `#` (H1).
- Akhiri dengan `## Kesimpulan` yang merangkum dan menutup dengan ajakan halus berkonsultasi dengan Sarana Law Firm. Kotak penutup dan FAQ ditambahkan otomatis oleh build.
- Internal link: 2–3 link ke artikel lain dengan URL lengkap dari `existing-posts.txt` atau kolom `url` di `index.json` (hanya artikel yang jam tayangnya sudah lewat). Boleh 0–2 link eksternal ke sumber resmi.
- Ini konten hukum (YMYL): setiap nomor UU/PP/Permen/Perma/putusan, pasal, tenggat, biaya resmi (PNBP, panjar perkara), dan syarat administrasi WAJIB dicek dengan web search ke sumber resmi (peraturan.bpk.go.id, JDIH kementerian, mkri.id, mahkamahagung.go.id, OJK, ATR/BPN). Kalau tidak bisa diverifikasi, jangan ditulis. Sebutkan nama dan nomor aturan yang dikutip. Ingat KUHP Nasional (UU 1/2023) berlaku sejak 2 Januari 2026; cek juga status KUHAP terbaru sebelum mengutipnya.
- Etika advokat: jangan menjanjikan hasil perkara ("pasti menang", "dijamin bebas"), jangan klaim superlatif ("terbaik", "nomor 1", "termurah"), jangan sebut tarif jasa advokat, jangan menjelekkan advokat lain, jangan mengarang kasus, klien, testimoni, atau jumlah perkara yang ditangani.
- Jangan memberi nasihat untuk menghindari proses hukum atau menyembunyikan bukti. Untuk topik pidana, fokus pada hak, prosedur, dan cara melapor/mendampingi.
- Kotak penutup (disclaimer + kontak) ditambahkan otomatis oleh build: jangan tulis alamat/telepon/disclaimer di isi.

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
image_alt: "Gambar sampul artikel Sarana Law Firm tentang <topik>"
faq:
  - q: "<pertanyaan>"
    a: "<jawaban 1–3 kalimat>"
  # 3–6 item
---
```

Kategori yang boleh dipakai (sudah ada di WordPress): Hukum Keluarga & Waris · Hukum Korporasi & Kepatuhan (Compliance) · Hukum Perdata & Bisnis · Hukum Pidana · Ketenagakerjaan & Industri · Properti & Pertanahan · Tips Hukum & Edukasi Publik.

Selalu beri tanda kutip pada nilai yang mengandung titik dua.
