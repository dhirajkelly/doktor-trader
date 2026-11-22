---
title: "Cara Menghitung Pip Forex untuk Pemula, Lengkap Contoh Hitungan"
slug: cara-menghitung-pip-forex
meta_title: Cara Menghitung Pip Forex untuk Pemula | Doktor Trader
meta_description: "Cara menghitung pip forex untuk pemula: beda pip dan point di MT5, nilai pip per lot di EURUSD, USDJPY, dan pair silang, plus contoh hitungan lot dari risiko."
focus_keyword: cara menghitung pip forex
category: Panduan Pemula
tags: [pip, istilah trading, panduan pemula, lot, mt5]
excerpt: Pip adalah satuan gerak harga di forex. Pelajari cara menghitungnya, nilai pip per lot, dan cara memakainya untuk menentukan lot dari risiko.
---

Waktu baru belajar trading, saya pernah memasang stop loss yang saya kira "25 pip". Ternyata yang saya ketik adalah 25 point, sepersepuluh dari jarak yang saya maksud. Lot saya hitung dari angka yang salah, sehingga risiko sebenarnya sepuluh kali lebih besar dari rencana. Kesalahan kecil seperti ini adalah alasan saya menganggap **cara menghitung pip forex** sebagai pelajaran pertama yang wajib dikuasai sebelum membuka posisi apa pun. Pip adalah bahasa dasar untuk mengukur jarak harga, stop loss, target, spread, dan akhirnya ukuran lot.

Artikel ini membahas apa itu pip, bedanya dengan point di MT4/MT5, cara menghitung jumlah pip, cara menghitung nilai pip dalam dolar, dan cara memakainya untuk menentukan lot dari risiko per posisi.

Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi atau prediksi arah pasar.

## Apa itu pip dalam forex

Pip adalah satuan standar perubahan harga pada pasangan mata uang. Ketentuan yang umum dipakai:

- **Sebagian besar pair** (EURUSD, GBPUSD, AUDUSD, EURGBP, dan sejenisnya): 1 pip = **0,0001**, yaitu angka keempat di belakang koma.
- **Pair dengan yen Jepang** (USDJPY, EURJPY, GBPJPY): 1 pip = **0,01**, yaitu angka kedua di belakang koma.

Contohnya, jika EURUSD bergerak dari 1,0850 ke 1,0851, harga naik 1 pip. Jika USDJPY bergerak dari 150,20 ke 150,21, harga juga naik 1 pip.

### Pip, pipette, dan point di MT5

Kebanyakan platform sekarang menampilkan harga dengan satu digit tambahan, misalnya EURUSD 1,08503 (lima digit) dan USDJPY 150,203 (tiga digit). Digit terakhir itu disebut **pipette**, yaitu sepersepuluh pip.

Di MT4/MT5, ada istilah **point**, yaitu kenaikan harga terkecil yang ditampilkan platform. Pada kuotasi lima digit, 1 point = 0,00001, sehingga:

**1 pip = 10 point**

Inilah sumber kesalahan saya di awal. Kolom jarak di beberapa pengaturan MT5, seperti trailing stop, memakai satuan point, bukan pip. Selalu cek satuan sebelum mengetik angka.

## Cara menghitung jumlah pip

Rumusnya sederhana:

**Jumlah pip = Selisih harga ÷ Ukuran 1 pip**

### Contoh pair biasa (EURUSD)

Contoh: entry buy EURUSD di 1,08500, harga bergerak ke 1,08750.

- Selisih harga: 1,08750 − 1,08500 = 0,00250
- Jumlah pip: 0,00250 ÷ 0,0001 = **25 pip**

### Contoh pair yen (USDJPY)

Contoh: entry sell USDJPY di 150,200, harga turun ke 149,850.

- Selisih harga: 150,200 − 149,850 = 0,350
- Jumlah pip: 0,350 ÷ 0,01 = **35 pip**

Trik cepatnya: untuk pair biasa, geser koma empat angka ke kanan; untuk pair yen, geser dua angka ke kanan. Digit kelima (atau ketiga pada pair yen) menjadi desimal pip.

## Cara menghitung nilai pip dalam dolar

Jumlah pip baru berguna setelah Anda tahu nilainya dalam uang. Nilai pip bergantung pada tiga hal: ukuran lot, ukuran 1 pip, dan mata uang kuotasi (mata uang kedua di pair).

Di kebanyakan akun standar, **1 lot = 100.000 unit** mata uang dasar. Rumus umumnya:

**Nilai pip = Ukuran 1 pip × Ukuran kontrak × Lot** (hasilnya dalam mata uang kuotasi)

### Pair dengan USD di belakang (EURUSD, GBPUSD, AUDUSD)

Mata uang kuotasinya sudah USD, jadi hasilnya langsung dolar:

0,0001 × 100.000 × 1 lot = **$10 per pip per lot**

| Ukuran lot | Nilai 1 pip (EURUSD) |
|---|---|
| 1,00 lot | $10 |
| 0,10 lot | $1 |
| 0,01 lot | $0,10 |

### Pair dengan USD di depan (USDJPY)

Hasil rumus masih dalam yen, jadi perlu dikonversi dengan membagi kurs USDJPY:

0,01 × 100.000 = 1.000 yen per pip per lot

Contoh dengan kurs ilustrasi USDJPY 150,00: 1.000 ÷ 150 = **sekitar $6,67 per pip per lot**. Nilai ini berubah mengikuti kurs. Saat USDJPY naik, nilai pip dalam dolar turun, dan sebaliknya.

### Pair silang (EURGBP)

Hasil rumus dalam pound sterling (GBP), lalu dikonversi ke dolar memakai GBPUSD:

0,0001 × 100.000 = £10 per pip per lot

Contoh dengan kurs ilustrasi GBPUSD 1,2700: £10 × 1,27 = **sekitar $12,70 per pip per lot**.

Kesimpulannya, anggapan "1 pip selalu $10 per lot" hanya benar untuk pair yang mata uang kuotasinya USD.

### Bagaimana dengan emas (XAUUSD)?

Untuk emas, istilah pip tidak seragam antar platform. Ada yang menyebut 1 pip = 0,10, ada yang 0,01. Lebih aman berpikir dalam selisih harga dolar: di kebanyakan pialang, 1 lot XAUUSD = 100 troy ounce, sehingga gerak $1 bernilai $100 per lot. Penjelasan lengkapnya ada di [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd) dan [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

## Memakai pip untuk menentukan lot dari risiko

Di sinilah pip benar-benar berguna untuk manajemen risiko. Urutannya dibalik: Anda tidak memilih lot lalu berharap rugi kecil, tetapi menentukan risiko dulu, baru menghitung lot.

**Lot = Risiko dalam dolar ÷ (Jarak stop loss dalam pip × Nilai pip per 1 lot)**

Lalu bulatkan **ke bawah** ke kelipatan lot yang tersedia (umumnya 0,01).

### Contoh 1: EURUSD

Modal $1.000, risiko 1% = $10. Stop loss berjarak 25 pip.

Lot = 10 ÷ (25 × 10) = **0,04 lot**

Jika stop loss tersentuh, kerugian sekitar 25 × $0,40 = $10, belum termasuk spread dan komisi.

### Contoh 2: USDJPY

Modal $1.000, risiko 1% = $10. Stop loss berjarak 40 pip, nilai pip ilustrasi $6,67 per lot.

Lot = 10 ÷ (40 × 6,67) ≈ 0,0375 → dibulatkan ke bawah menjadi **0,03 lot**

Risiko sebenarnya: 0,03 × 40 × 6,67 ≈ $8, sedikit di bawah batas 1%.

### Contoh 3: akibat salah satuan

Kembali ke kesalahan saya di awal. Jika jarak 25 pip tertulis sebagai 25 point (2,5 pip), hitungannya menjadi:

Lot = 10 ÷ (2,5 × 10) = **0,40 lot**

Saat harga benar-benar bergerak 25 pip melawan posisi, kerugiannya 25 × $4 = **$100**, atau 10% modal, sepuluh kali dari rencana. Satu kebiasaan sederhana mencegahnya: sebelum menekan tombol, hitung ulang "kalau stop loss kena, saya rugi berapa dolar?"

Agar tidak salah hitung saat pasar bergerak cepat, Anda bisa memakai [kalkulator lot gratis Doktor Trader](/alat/kalkulator-lot).

## Kesalahan yang sering terjadi saat menghitung pip

- **Menyamakan pip dan point.** Di kuotasi lima digit, selisihnya 10 kali.
- **Menganggap semua pair bernilai $10 per pip per lot.** Pair yen dan pair silang berbeda dan berubah mengikuti kurs.
- **Lupa spread.** Spread juga diukur dalam pip. Spread 1,5 pip pada 0,10 lot EURUSD berarti biaya sekitar $1,50 sejak posisi dibuka.
- **Memakai jarak stop loss asal bulat.** Angka 20 atau 50 pip tidak otomatis cocok. Jarak stop loss sebaiknya mengikuti struktur harga, lalu lot yang menyesuaikan.
- **Tidak mengecek spesifikasi kontrak.** Ukuran kontrak bisa berbeda di jenis akun tertentu, misalnya akun mikro atau cent. Cek di MT5 lewat klik kanan simbol → Specification.

Setelah jarak stop loss dan target sama-sama dalam pip, Anda juga bisa menilai apakah posisi layak diambil dengan [menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio).

## Pertanyaan yang sering diajukan

### Berapa nilai 1 pip untuk lot 0,01?

Untuk pair dengan USD sebagai mata uang kuotasi, seperti EURUSD, nilainya sekitar $0,10 per pip. Untuk pair lain, hitung dengan rumus di atas karena nilainya bergantung pada kurs.

### Apakah pip di MT4 dan MT5 berbeda?

Definisi pip sama. Yang perlu diperhatikan adalah satuan point di platform. Pada kuotasi lima digit (atau tiga digit untuk pair yen), 1 pip sama dengan 10 point.

### Kenapa nilai pip USDJPY berubah-ubah?

Karena nilai pip awalnya dalam yen, lalu dikonversi ke dolar memakai kurs USDJPY saat itu. Ketika kurs berubah, nilai pip dalam dolar ikut berubah.

## Kesimpulan

Memahami cara menghitung pip forex berarti Anda bisa menerjemahkan jarak harga menjadi rupiah atau dolar yang dipertaruhkan. Ingat tiga hal: 1 pip = 0,0001 untuk sebagian besar pair dan 0,01 untuk pair yen; 1 pip = 10 point di kuotasi lima digit; dan nilai pip per lot bergantung pada mata uang kuotasi. Dengan itu, lot bisa dihitung dari risiko, bukan dari perasaan.

Jika Anda ingin belajar manajemen risiko secara bertahap dari dasar, mulai dari Academy gratis di Doktor Trader. Materinya disusun untuk pemula, dan Anda bisa [mendaftar di sini](/daftar).
