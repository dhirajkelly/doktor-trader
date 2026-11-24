---
title: "Cara Menghitung Profit Trading Emas: Rumus, Biaya, dan Contoh"
slug: cara-menghitung-profit-trading-emas
meta_title: Cara Menghitung Profit Trading Emas | Doktor Trader
meta_description: "Cara menghitung profit trading emas (XAUUSD) untuk posisi buy dan sell, termasuk spread, komisi, swap, titik impas, dan konversi ke rupiah dengan contoh."
focus_keyword: cara menghitung profit trading emas
category: Strategi Emas
tags: [profit loss, xauusd, kalkulator trading, swap, komisi]
excerpt: Rumus sederhana untuk menghitung untung-rugi posisi XAUUSD, lengkap dengan biaya spread, komisi, swap, dan contoh hitungan yang bisa Anda ulangi sendiri.
---

Dulu saya sering menutup posisi emas dengan perasaan "lumayan untung", lalu bingung ketika saldo yang bertambah lebih kecil dari perkiraan. Ternyata saya hanya menghitung selisih harga, tanpa memasukkan komisi dan swap. Artikel ini membahas **cara menghitung profit trading emas** secara utuh: rumus dasar untuk posisi buy dan sell, biaya yang memotong hasil, titik impas, sampai konversi ke rupiah.

Tujuannya bukan mengejar angka besar, melainkan membuat Anda tahu persis berapa yang dipertaruhkan dan berapa yang benar-benar diterima. Semua harga, biaya, dan kurs di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Dasar hitungan: ukuran kontrak XAUUSD

Sebelum masuk ke rumus, pahami satu angka kunci: ukuran kontrak. Pada umumnya, 1 lot XAUUSD setara 100 troy ounce emas. Artinya, setiap pergerakan harga $1 bernilai sekitar $100 untuk 1 lot. Ukuran kontrak bisa berbeda di jenis akun tertentu, jadi selalu cek spesifikasi simbol di terminal Anda (klik kanan simbol, lalu pilih *Specification*).

Dengan ukuran kontrak 100, nilai pergerakan per lot menjadi seperti ini:

| Lot | Nilai per pergerakan $1 | Nilai per pergerakan $5 |
|---|---|---|
| 0,01 | $1 | $5 |
| 0,05 | $5 | $25 |
| 0,10 | $10 | $50 |
| 0,50 | $50 | $250 |
| 1,00 | $100 | $500 |

Tabel ini juga menjelaskan kenapa ukuran lot jauh lebih menentukan daripada titik entry. Pergerakan yang sama bisa bernilai $5 atau $500, tergantung lot yang Anda pilih. Pembahasan lengkapnya ada di artikel [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd).

## Rumus profit untuk posisi buy dan sell

Rumus dasarnya hanya dua, tergantung arah posisi.

**Posisi buy:**
Profit/Loss = (harga tutup − harga buka) × lot × ukuran kontrak

**Posisi sell:**
Profit/Loss = (harga buka − harga tutup) × lot × ukuran kontrak

Hasil positif berarti untung, hasil negatif berarti rugi. Perhatikan bahwa yang dipakai adalah selisih harga dalam dolar, bukan dalam pip atau point, sehingga Anda tidak perlu bingung soal desimal.

### Contoh 1: posisi buy

- Buka buy 0,10 lot di harga 4.000,00 (contoh)
- Tutup di harga 4.012,50
- Selisih: 4.012,50 − 4.000,00 = 12,50
- Profit kotor: 12,50 × 0,10 × 100 = **$125**

### Contoh 2: posisi sell yang rugi

- Buka sell 0,05 lot di harga 4.020,00 (contoh)
- Harga naik, posisi ditutup di 4.026,40
- Selisih: 4.020,00 − 4.026,40 = −6,40
- Hasil: −6,40 × 0,05 × 100 = **−$32**

Kalau Anda membiasakan diri menghitung seperti ini sebelum membuka posisi, angka di terminal tidak akan lagi terasa mengejutkan.

## Biaya yang memotong hasil: spread, komisi, dan swap

Angka $125 di contoh pertama adalah profit kotor dari selisih harga. Yang masuk ke saldo bisa lebih kecil karena tiga komponen biaya.

### Spread sudah masuk ke harga

Posisi buy dibuka di harga *ask* dan ditutup di harga *bid*. Posisi sell sebaliknya. Karena itu, spread sudah tercermin di harga buka dan tutup yang Anda lihat di riwayat transaksi. Anda tidak perlu menguranginya dua kali. Yang perlu diingat: begitu posisi dibuka, posisi langsung tercatat minus sebesar spread. Cara menghitungnya ada di artikel [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

### Komisi

Sebagian jenis akun mengenakan komisi per lot, biasanya dihitung per sisi (buka dan tutup). Misalnya komisi contoh $3,50 per lot per sisi. Untuk 0,10 lot, biaya buka-tutup adalah 3,50 × 2 × 0,10 = **$0,70**.

### Swap

Swap dikenakan atau diberikan ketika posisi dibawa melewati pergantian hari server. Nilainya bisa negatif atau positif, tergantung arah posisi dan ketentuan akun. Misalnya swap contoh −$2,10 per malam untuk 0,10 lot, dan posisi ditahan dua malam: total **−$4,20**. Penjelasan lebih detail ada di artikel [apa itu swap dalam trading](/artikel/apa-itu-swap-dalam-trading).

### Profit bersih contoh 1

| Komponen | Nilai |
|---|---|
| Profit kotor dari selisih harga | $125,00 |
| Komisi buka-tutup | −$0,70 |
| Swap dua malam | −$4,20 |
| **Profit bersih** | **$120,10** |

Selisih $4,90 terlihat kecil di satu transaksi. Tetapi kalau Anda sering menahan posisi berhari-hari atau sering membuka-tutup posisi, biaya ini menumpuk dan perlu dicatat di jurnal.

## Menghitung titik impas (break even)

Titik impas adalah harga di mana posisi tidak untung dan tidak rugi setelah semua biaya. Ini berguna sebelum Anda memindahkan stop loss ke "harga entry", karena entry belum tentu impas.

Rumusnya untuk posisi buy:

**Pergerakan impas = spread + (komisi total ÷ (lot × ukuran kontrak))**

Dengan spread contoh 0,25 dan komisi $0,70 pada 0,10 lot:

- Komisi dalam satuan harga: 0,70 ÷ (0,10 × 100) = 0,07
- Pergerakan impas: 0,25 + 0,07 = **0,32**

Artinya, harga bid perlu naik sekitar 0,32 dari harga ask saat Anda membuka posisi agar biaya spread dan komisi tertutup. Swap belum dihitung di sini; kalau posisi dibawa menginap, titik impasnya bergeser lagi.

## Ubah profit menjadi R dan rupiah

Angka dolar saja belum cukup untuk menilai sebuah transaksi. Ada dua cara pandang yang lebih berguna.

### Dalam kelipatan risiko (R)

Misalnya di contoh 1 stop loss dipasang di 3.992,00, berjarak 8,00 dari entry. Risiko yang direncanakan: 8,00 × 0,10 × 100 = $80. Profit bersih $120,10 ÷ $80 = sekitar **1,5R**. Dengan cara ini, Anda menilai hasil berdasarkan risiko yang diambil, bukan berdasarkan besar kecilnya angka. Konsep ini dibahas di artikel [cara menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio).

### Dalam rupiah

Kalau akun Anda dalam dolar, kalikan dengan kurs yang berlaku saat penarikan dana. Dengan kurs contoh Rp16.000 per dolar: $120,10 × 16.000 = **Rp1.921.600**. Kurs sebenarnya berubah setiap hari dan bisa berbeda antara kurs acuan dan kurs yang dipakai saat deposit atau penarikan, jadi anggap angka rupiah sebagai perkiraan.

## Kasus khusus: tutup sebagian posisi

Banyak trader menutup sebagian posisi lebih dulu. Hitung setiap bagian secara terpisah, lalu jumlahkan.

Contoh: buy 0,10 lot di 4.000,00 (contoh).

1. Tutup 0,05 lot di 4.006,00 → 6,00 × 0,05 × 100 = $30
2. Tutup 0,05 lot sisanya di 4.012,50 → 12,50 × 0,05 × 100 = $62,50
3. Total profit kotor: **$92,50**

Rata-rata harga tutupnya 4.009,25. Jika dibandingkan dengan menutup semuanya di 4.012,50 ($125), hasilnya memang lebih kecil, tetapi sebagian profit sudah terkunci lebih awal. Tidak ada pilihan yang selalu benar; yang penting Anda tahu konsekuensi angkanya sebelum memutuskan.

## Kesalahan yang sering terjadi saat menghitung profit

- **Lupa ukuran kontrak.** Menganggap pergerakan $1 bernilai $1 untuk 1 lot membuat perhitungan meleset 100 kali.
- **Mengurangi spread dua kali.** Spread sudah ada di harga buka dan tutup.
- **Mengabaikan swap.** Posisi yang ditahan lama bisa kehilangan sebagian profit karena swap negatif.
- **Menilai hasil dari dolar, bukan dari risiko.** Profit $50 dengan risiko $200 berbeda kualitasnya dengan profit $50 dengan risiko $25.
- **Tidak mencatat.** Tanpa jurnal, Anda tidak akan tahu berapa total biaya yang dibayar dalam sebulan.

Untuk menghitung lot dari risiko sebelum entry, Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot) di Doktor Trader.

## Pertanyaan yang sering diajukan

### Apakah profit di terminal MT5 sudah bersih?

Kolom *Profit* pada posisi terbuka biasanya hanya menunjukkan selisih harga. Komisi dan swap ditampilkan di kolom terpisah. Lihat riwayat transaksi untuk melihat total bersihnya.

### Bagaimana menghitung profit di akun cent?

Rumusnya sama, tetapi saldo ditampilkan dalam sen. Hasil hitungan dalam satuan akun perlu dibagi 100 untuk mendapatkan nilai dolar. Cek spesifikasi simbol di akun cent karena ukuran kontraknya bisa berbeda.

### Kenapa hasil hitungan saya sedikit berbeda dengan riwayat transaksi?

Biasanya karena harga eksekusi berbeda dari harga yang Anda rencanakan (slippage), ada komisi atau swap yang terlewat, atau ukuran kontrak akun Anda tidak 100 ounce per lot.

## Kesimpulan

Cara menghitung profit trading emas sebenarnya sederhana: selisih harga dikali lot dikali ukuran kontrak, lalu dikurangi komisi dan swap. Yang membuat hitungan ini berguna adalah kebiasaan melakukannya sebelum dan sesudah setiap transaksi, mengukurnya dalam R, dan mencatatnya di jurnal. Dengan begitu Anda menilai keputusan, bukan hanya angka.

Kalau Anda ingin belajar manajemen risiko dan perhitungan trading secara bertahap, materi Academy di Doktor Trader bisa diakses gratis. Silakan [daftar di sini](/daftar) untuk mulai belajar.
