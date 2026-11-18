---
title: Cara Menghitung Lot XAUUSD agar Risiko Tetap 1% per Posisi
slug: cara-menghitung-lot-xauusd
meta_title: Cara Menghitung Lot XAUUSD (Emas) dengan Risiko 1% | Doktor Trader
meta_description: Panduan menghitung ukuran lot XAUUSD dari jarak stop loss dan persentase risiko, lengkap dengan contoh modal $500 sampai $5.000.
focus_keyword: cara menghitung lot xauusd
category: Manajemen Risiko
tags: [lot, xauusd, manajemen risiko, emas]
excerpt: Rumus sederhana menghitung lot emas dari jarak stop loss, plus tabel contoh agar setiap posisi hanya merisikokan 1% modal.
revision: 2
---

Salah satu penyebab terbesar akun emas habis bukanlah analisa yang salah, melainkan **ukuran lot yang terlalu besar**. Artikel ini menjelaskan **cara menghitung lot XAUUSD** supaya setiap posisi hanya merisikokan persentase kecil dari modal, misalnya 1%.

## Mengapa ukuran lot lebih penting daripada entry

Entry yang bagus dengan lot yang terlalu besar tetap bisa menghabiskan akun saat terjadi kekalahan beruntun. Sebaliknya, entry yang biasa saja dengan lot yang tepat memberi Anda waktu untuk belajar. Dalam manajemen risiko, lot adalah "rem" utama Anda.

## Nilai pergerakan emas per lot

Di kebanyakan pialang, **1 lot XAUUSD = 100 troy ounce**. Artinya:

- Harga emas bergerak $1 → **$100** untuk 1 lot
- Harga emas bergerak $1 → **$10** untuk 0,10 lot
- Harga emas bergerak $1 → **$1** untuk 0,01 lot

Selalu cek spesifikasi kontrak di platform MT4/MT5 Anda, karena jenis akun tertentu bisa berbeda.

## Rumus menghitung lot XAUUSD

**Lot = Risiko dalam dolar ÷ (Jarak stop loss dalam dolar × 100)**

Langkahnya:

1. Tentukan risiko per posisi, misalnya 1% dari modal.
2. Tentukan letak stop loss berdasarkan analisa (bukan angka asal).
3. Hitung jarak antara entry dan stop loss dalam dolar.
4. Masukkan ke rumus, lalu bulatkan **ke bawah**.

## Contoh perhitungan

Modal $1.000, risiko 1% = $10. Entry buy di 2.650, stop loss di 2.645 (jarak $5).

Lot = 10 ÷ (5 × 100) = **0,02 lot**

Jika stop loss lebih lebar, misalnya $10, lot menjadi 0,01. Semakin lebar stop loss, semakin kecil lot yang boleh dipakai.

Contoh kedua untuk posisi sell: modal $3.000, risiko 1% = $30. Entry sell di 2.640, stop loss di 2.648 (jarak $8).

Lot = 30 ÷ (8 × 100) = 0,0375 → dibulatkan ke bawah menjadi **0,03 lot**. Risiko sebenarnya menjadi $24 (0,8% modal), sedikit di bawah batas. Membulatkan ke bawah selalu lebih aman daripada ke atas.

Ingat, posisi sell ditutup oleh harga ask. Saat spread melebar, stop loss posisi sell bisa tersentuh sebelum harga bid menyentuhnya. Tambahkan sedikit ruang untuk spread saat menentukan jarak stop loss.

## Tabel cepat risiko 1%

| Modal | Risiko 1% | SL $3 | SL $5 | SL $10 |
|---|---|---|---|---|
| $500 | $5 | 0,01 | 0,01 | terlalu besar* |
| $1.000 | $10 | 0,03 | 0,02 | 0,01 |
| $2.000 | $20 | 0,06 | 0,04 | 0,02 |
| $5.000 | $50 | 0,16 | 0,10 | 0,05 |

*Dengan modal $500 dan SL $10, lot minimum 0,01 sudah merisikokan 2%. Pilih setup dengan SL lebih dekat, atau terima risiko 2% secara sadar.

## Kenapa 1%, bukan 5%?

Persentase risiko menentukan seberapa dalam akun turun saat Anda mengalami kekalahan beruntun, yang pasti terjadi pada strategi apa pun. Contoh ilustratif berikut menunjukkan sisa modal setelah 10 kali rugi berturut-turut:

| Risiko per posisi | Sisa modal setelah 10 kali rugi | Kenaikan untuk balik modal |
|---|---|---|
| 1% | ±90,4% | ±10,6% |
| 2% | ±81,7% | ±22,4% |
| 5% | ±59,9% | ±67,0% |
| 10% | ±34,9% | ±186,8% |

Dengan risiko 1%, kekalahan beruntun masih bisa dipulihkan. Dengan risiko 10%, akun butuh hampir tiga kali lipat hanya untuk kembali ke awal. Penjelasan lengkap soal ini ada di artikel [rumus drawdown trading](/artikel/rumus-drawdown-trading).

## Pakai kalkulator agar tidak salah hitung

Menghitung manual itu bagus untuk memahami logikanya. Tetapi saat pasar bergerak cepat, salah ketik satu angka bisa membuat lot sepuluh kali lebih besar. Anda bisa memakai [kalkulator lot Doktor Trader](/alat/kalkulator-lot) yang gratis: masukkan modal, persentase risiko, dan jarak stop loss, lalu kalkulator menghitung lot maksimal dan membulatkannya ke bawah.

## Kesalahan yang sering terjadi

- **Menghitung lot dari sisa margin**, bukan dari jarak stop loss.
- **Memperbesar lot setelah rugi** untuk "balik modal".
- **Tidak memasang stop loss**, sehingga risiko sebenarnya tidak terbatas.
- **Lupa spread**: saat volatil, spread emas bisa melebar dan membuat SL tersentuh lebih cepat.

## Pertanyaan yang sering diajukan

### Bagaimana jika lot hasil hitungan di bawah 0,01?
Artinya modal terlalu kecil untuk jarak stop loss tersebut. Pilihannya: cari setup dengan stop loss lebih dekat yang tetap masuk akal secara teknikal, tambah modal, atau lewati trade itu. Memaksa 0,01 lot berarti menerima risiko di atas batas yang Anda tetapkan.

### Apakah rumus ini berlaku untuk akun cent?
Logikanya sama, tetapi ukuran kontrak dan satuan saldo akun cent berbeda. Cek spesifikasi kontrak di MT4/MT5 (klik kanan simbol, lalu Specification) sebelum menghitung.

### Apakah risiko 1% harus dipakai di setiap posisi?
Batas 1% adalah titik awal yang baik untuk pemula. Yang terpenting adalah konsisten dan memperhitungkan total risiko jika ada beberapa posisi terbuka sekaligus.

## Kesimpulan

Menghitung lot XAUUSD hanya butuh tiga angka: modal, persentase risiko, dan jarak stop loss. Biasakan menghitungnya sebelum setiap posisi. Jika ingin latihan lebih terarah, materi lengkapnya ada di kelas **Manajemen Risiko** di Academy member Doktor Trader.
