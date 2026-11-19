---
title: "Cara Menghitung Fibonacci Retracement: Rumus dan Contoh XAUUSD"
slug: cara-menghitung-fibonacci-retracement
meta_title: Cara Menghitung Fibonacci Retracement | Doktor Trader
meta_description: Cara menghitung Fibonacci retracement secara manual - rumus level 38,2%, 50%, 61,8%, contoh hitungan XAUUSD naik dan turun, dan cara memakainya untuk risiko.
focus_keyword: cara menghitung fibonacci retracement
category: Analisa Teknikal
tags: [fibonacci retracement, analisa teknikal, xauusd, istilah trading]
excerpt: Fibonacci retracement hanyalah perhitungan persentase dari satu ayunan harga. Pelajari rumusnya, contoh XAUUSD, dan cara memakainya dengan manajemen risiko.
---

Waktu pertama kali melihat garis-garis Fibonacci di grafik, saya mengira itu semacam peta rahasia yang menunjukkan di mana harga pasti berbalik. Saya menarik garis di mana saja, masuk di level 61,8% tanpa stop loss yang jelas, dan heran kenapa harga menembusnya begitu saja. Masalahnya, saya tidak benar-benar paham apa yang sedang saya gambar. Setelah belajar **cara menghitung Fibonacci retracement** secara manual, saya sadar alat ini sebenarnya sederhana: ia hanya membagi satu ayunan harga menjadi beberapa persentase.

Di artikel ini kita bahas asal angka-angka Fibonacci, rumus menghitung level untuk tren naik dan tren turun, contoh hitungan pada XAUUSD, cara memasangnya di MT4/MT5, dan yang paling penting: bagaimana memakai level tersebut bersama stop loss dan ukuran lot. Semua harga di bawah adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu Fibonacci retracement?

Fibonacci retracement adalah alat analisa teknikal yang menandai area di mana harga *mungkin* berhenti sementara saat mengoreksi sebagian dari pergerakan sebelumnya. Kata kuncinya adalah "retracement", yaitu koreksi atau tarikan balik. Jika emas naik dari satu titik rendah ke titik tinggi, lalu turun sebagian, Fibonacci membantu Anda mengukur seberapa dalam koreksi itu dalam persentase.

Level yang paling umum dipakai:

- **23,6%**
- **38,2%**
- **50%**
- **61,8%**
- **78,6%**

Platform biasanya juga menampilkan 0% dan 100% sebagai titik awal dan akhir ayunan.

### Dari mana angka-angka ini berasal?

Deret Fibonacci adalah 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, dan seterusnya; setiap angka adalah jumlah dua angka sebelumnya. Semakin besar angkanya, perbandingan satu angka dengan angka sesudahnya semakin mendekati 0,618 (misalnya 55 ÷ 89 ≈ 0,618). Dari situ diturunkan rasio lain:

- 0,382 = 1 − 0,618
- 0,236 ≈ 0,382 × 0,618
- 0,786 ≈ akar kuadrat dari 0,618

Level 50% sebenarnya **bukan** rasio Fibonacci. Ia dimasukkan karena banyak trader memperhatikan koreksi "setengah jalan". Ini penting dipahami: angka-angka ini tidak punya kekuatan magis. Level tersebut diperhatikan karena banyak pelaku pasar melihat area yang sama, dan tetap bisa ditembus kapan saja.

## Rumus cara menghitung Fibonacci retracement

Langkah pertama selalu sama: tentukan satu ayunan harga yang jelas, yaitu **swing low** (titik terendah) dan **swing high** (titik tertinggi). Lalu hitung jaraknya:

**Range = Swing High − Swing Low**

Setelah itu rumusnya tergantung arah tren.

### Tren naik (mengukur koreksi turun)

**Level = Swing High − (Range × Rasio)**

Logikanya, harga sudah naik dan Anda ingin tahu sampai mana koreksi turunnya bisa terjadi, dihitung dari puncak.

### Tren turun (mengukur koreksi naik)

**Level = Swing Low + (Range × Rasio)**

Di sini harga sudah turun, dan Anda mengukur seberapa tinggi pantulannya, dihitung dari dasar.

## Contoh hitungan Fibonacci pada XAUUSD

Berikut dua contoh dengan angka ilustrasi. Semua hasil sudah saya cek ulang dengan perhitungan kode dan dibulatkan ke dua desimal.

### Contoh 1: tren naik

Misalkan pada grafik H1, XAUUSD naik dari swing low $2.600,00 ke swing high $2.660,00.

- Range = 2.660,00 − 2.600,00 = **$60,00**

| Level | Perhitungan | Harga level |
|---|---|---|
| 23,6% | 2.660 − (60 × 0,236) | $2.645,84 |
| 38,2% | 2.660 − (60 × 0,382) | $2.637,08 |
| 50% | 2.660 − (60 × 0,5) | $2.630,00 |
| 61,8% | 2.660 − (60 × 0,618) | $2.622,92 |
| 78,6% | 2.660 − (60 × 0,786) | $2.612,84 |

Artinya, jika harga terkoreksi dari $2.660, area $2.637 sampai $2.623 (38,2% sampai 61,8%) adalah zona yang sering diamati trader. "Diamati" bukan berarti harga pasti memantul di sana.

### Contoh 2: tren turun

Misalkan XAUUSD turun dari swing high $2.720,00 ke swing low $2.675,00.

- Range = 2.720,00 − 2.675,00 = **$45,00**

| Level | Perhitungan | Harga level |
|---|---|---|
| 23,6% | 2.675 + (45 × 0,236) | $2.685,62 |
| 38,2% | 2.675 + (45 × 0,382) | $2.692,19 |
| 50% | 2.675 + (45 × 0,5) | $2.697,50 |
| 61,8% | 2.675 + (45 × 0,618) | $2.702,81 |
| 78,6% | 2.675 + (45 × 0,786) | $2.710,37 |

Dengan rumus ini Anda bisa memeriksa apakah garis yang digambar platform sudah benar, atau menghitung level di kertas sebelum sesi trading dimulai.

## Cara memasang Fibonacci retracement di MT4 dan MT5

Di MT4 maupun MT5, alat Fibonacci retracement ada di menu **Insert**, di bagian objek Fibonacci, atau lewat ikon di toolbar garis. Cara menariknya:

1. **Tren naik:** klik di swing low, tahan, lalu tarik ke swing high.
2. **Tren turun:** klik di swing high, tahan, lalu tarik ke swing low.
3. Klik dua kali pada objek, buka **Properties**, lalu periksa tab level Fibonacci. Tambahkan 78,6% jika belum ada, dan hapus level yang tidak Anda pakai agar grafik tetap bersih.

Kesalahan paling sering adalah menarik dari titik yang salah. Pakai **ujung sumbu (wick)** atau **harga penutupan**, lalu konsisten. Jika hari ini Anda memakai wick dan besok memakai body candle, hasil jurnal Anda tidak bisa dibandingkan.

### Memilih swing yang tepat

Pilih ayunan yang jelas terlihat di timeframe tempat Anda mengambil keputusan. Ayunan kecil di M5 akan menghasilkan level yang sangat rapat dan mudah ditembus noise. Konsep ini mirip dengan cara menghitung level pada [pivot point](/artikel/cara-menghitung-pivot-point): angkanya objektif, tetapi pemilihan data masukannya menentukan kualitas hasil.

## Memakai level Fibonacci bersama manajemen risiko

Bagi saya, nilai terbesar Fibonacci bukan pada menemukan titik entry, melainkan pada **merencanakan risiko**: di mana ide trading Anda dianggap salah, dan berapa lot yang pantas.

Lanjutkan Contoh 1 (tren naik). Anggap Anda merencanakan skenario beli di sekitar level 61,8% dengan syarat ada konfirmasi tambahan dari price action. Ini contoh latihan, bukan sinyal.

- Entry ilustrasi: **$2.622,92** (level 61,8%)
- Stop loss: di bawah level 78,6% ($2.612,84) dengan penyangga $2, yaitu **$2.610,84**
- Jarak SL = 2.622,92 − 2.610,84 = **$12,08**
- Target ilustrasi: swing high **$2.660,00**, jarak $37,08, sehingga rasio risk reward sekitar 1:3,07

Sekarang hitung lotnya. Pada kontrak XAUUSD standar, 1 lot = 100 troy ons, sehingga pergerakan $1 bernilai sekitar $100 per lot (cek spesifikasi kontrak di platform Anda).

- Modal contoh: $5.000, risiko 1% = **$50**
- Lot = 50 ÷ (12,08 × 100) = 0,0414 → dibulatkan **ke bawah** menjadi **0,04 lot**
- Risiko aktual = 0,04 × 12,08 × 100 = **$48,32**

Perhatikan urutannya: level Fibonacci menentukan jarak stop loss, lalu jarak itu menentukan lot. Bukan sebaliknya. Pembahasan lebih lengkap soal penyangga stop loss ada di artikel [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd), dan soal rasio target ada di [cara menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio). Jika tidak ingin menghitung manual, gunakan [kalkulator lot gratis](/alat/kalkulator-lot) kami.

### Kesalahan umum saat memakai Fibonacci

- **Menganggap level sebagai dinding.** Harga bisa menembus semua level dan melanjutkan koreksi lebih dalam.
- **Mengganti swing setelah harga bergerak.** Menarik ulang Fibonacci agar "pas" dengan harga setelah kejadian hanya menipu diri sendiri.
- **Entry hanya karena harga menyentuh level.** Fibonacci paling berguna sebagai area perhatian, lalu dikombinasikan dengan struktur harga atau konfirmasi lain.
- **Lupa spread dan berita.** Di sekitar rilis data penting, harga emas bisa melompati level tanpa berhenti.

## Kesimpulan

Cara menghitung Fibonacci retracement sebenarnya hanya tiga langkah: tentukan swing low dan swing high, hitung range-nya, lalu kalikan dengan rasio 23,6%, 38,2%, 50%, 61,8%, dan 78,6%. Untuk tren naik, kurangi dari swing high; untuk tren turun, tambahkan ke swing low. Setelah paham rumusnya, Anda tidak lagi bergantung pada garis di layar dan bisa menilai sendiri apakah level itu masuk akal.

Yang lebih penting, jadikan Fibonacci alat perencanaan risiko, bukan alat ramalan. Tentukan di mana skenario Anda gagal, hitung jarak stop loss, lalu sesuaikan lot agar kerugian tetap kecil jika harga tidak sesuai rencana. Jika Anda ingin mempelajari analisa teknikal dan manajemen risiko secara bertahap, silakan ikuti Academy gratis di Doktor Trader. Anda bisa mulai dengan [mendaftar di sini](/daftar).

## Pertanyaan yang sering diajukan

### Level Fibonacci mana yang paling penting?

Tidak ada level yang selalu paling kuat. Banyak trader memperhatikan zona 38,2% sampai 61,8% sebagai area koreksi yang wajar dalam tren, tetapi reaksi harga di setiap level berbeda-beda. Catat di jurnal level mana yang paling relevan untuk timeframe dan gaya trading Anda.

### Apakah Fibonacci retracement bisa dipakai di semua timeframe?

Bisa, karena rumusnya hanya persentase dari satu ayunan. Namun di timeframe kecil, range-nya sempit sehingga level-level menjadi sangat rapat dan lebih mudah ditembus oleh noise dan spread.

### Apa beda Fibonacci retracement dan Fibonacci extension?

Retracement mengukur koreksi di dalam ayunan (di bawah 100%), sedangkan extension memproyeksikan level di luar ayunan, misalnya 161,8%, yang sering dipakai sebagai area target. Prinsip hitungannya sama: range dikalikan rasio.
