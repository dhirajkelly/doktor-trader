---
title: Cara Backtest Strategi Trading Manual, Lengkap dengan Contoh
slug: cara-backtest-strategi-trading
meta_title: Cara Backtest Strategi Trading Manual | Doktor Trader
meta_description: "Cara backtest strategi trading secara manual: tulis aturan, catat hasil dalam R, hitung ekspektansi dan biaya spread, lalu baca hasilnya dengan jujur."
focus_keyword: cara backtest strategi trading
category: Panduan Pemula
tags: [backtest, trading plan, jurnal trading, ekspektansi, pemula]
excerpt: Langkah demi langkah cara backtest strategi trading secara manual, lengkap dengan contoh hitungan ekspektansi, biaya spread, dan batas ukuran sampel.
---

Dulu saya memakai sebuah strategi hanya karena beberapa contoh chart terlihat meyakinkan. Saya tidak pernah menghitung bagaimana aturan itu bekerja pada puluhan situasi sebelumnya, termasuk yang gagal. Ketika uang sungguhan dipertaruhkan, kelemahannya baru terlihat, dan harganya mahal. Karena itu, memahami **cara backtest strategi trading** adalah salah satu kebiasaan paling penting sebelum Anda mempertaruhkan modal.

Backtest berarti menguji aturan trading pada data harga masa lalu, seolah-olah Anda menjalankannya saat itu. Artikel ini membahas backtest manual (tanpa robot atau pemrograman): cara menyiapkan aturan, mencatat hasil, menghitung ekspektansi, memasukkan biaya spread, dan membaca hasilnya tanpa menipu diri sendiri. Semua angka di sini adalah contoh ilustrasi untuk belajar, bukan hasil strategi nyata dan bukan rekomendasi transaksi.

## Apa itu backtest dan apa yang bisa (dan tidak bisa) dibuktikan

Backtest menjawab satu pertanyaan sederhana: *jika aturan ini diikuti secara konsisten di masa lalu, seperti apa hasil dan rangkaian kerugiannya?* Jawaban itu berguna untuk tiga hal:

- **Menguji apakah aturan Anda cukup jelas.** Kalau Anda ragu apakah suatu candle "memenuhi syarat", aturannya belum siap dipakai.
- **Melihat karakter strategi.** Berapa panjang rentetan rugi yang pernah terjadi, seberapa dalam penurunan saldonya, seberapa sering setup muncul.
- **Menyaring ide yang jelas tidak layak** sebelum Anda membayar "uang sekolah" di akun real.

Yang tidak bisa dibuktikan backtest: bahwa strategi akan memberi hasil yang sama di masa depan. Pasar berubah, dan backtest manual rawan bias karena Anda sudah melihat apa yang terjadi setelahnya. Anggap backtest sebagai saringan awal, bukan jaminan.

## Langkah 1: Tulis aturan yang bisa diuji

Backtest hanya sebaik aturan yang diuji. Sebelum membuka chart, tuliskan aturan Anda sejelas mungkin, idealnya bagian dari [trading plan tertulis](/artikel/cara-membuat-trading-plan). Minimal mencakup:

1. **Instrumen dan timeframe**, misalnya XAUUSD H1.
2. **Kondisi entry** yang bisa dicek ya/tidak, misalnya "harga menutup candle di atas resistance terakhir setelah tren naik di H4".
3. **Letak stop loss**, misalnya di bawah swing low terakhir.
4. **Letak take profit atau aturan keluar**, misalnya target 2 kali jarak stop loss (2R).
5. **Jam yang boleh dan tidak boleh trading**, termasuk menghindari rilis data besar.
6. **Aturan risiko per posisi**, misalnya 1% dari ekuitas.

Tes sederhananya: jika orang lain membaca aturan Anda, apakah ia akan mengambil keputusan yang sama di chart yang sama? Jika tidak, perjelas dulu.

## Langkah 2: Siapkan data dan cara mencatat

Untuk backtest manual, Anda cukup memakai chart historis di platform trading dan sebuah spreadsheet. Beberapa platform chart punya fitur replay yang menampilkan candle satu per satu, sehingga Anda tidak "mengintip" masa depan. Jika tidak ada, tutup bagian kanan chart dengan jendela lain dan geser maju satu candle setiap kali.

Catat setiap setup yang memenuhi aturan, termasuk yang Anda rasa "jelek". Kolom yang disarankan:

| Kolom | Contoh isi |
|---|---|
| Tanggal dan jam | 2025-03-12 14:00 |
| Arah | Buy |
| Harga entry | 2.915,40 (contoh) |
| Stop loss / jarak | 2.909,40 / 6,00 |
| Take profit | 2.927,40 (2R) |
| Hasil dalam R | +2 atau −1 |
| Catatan | Ada rilis data 30 menit kemudian |

Mencatat hasil dalam **R** (kelipatan risiko) lebih berguna daripada dalam dolar. Rugi penuh di stop loss = −1R, kena target 2R = +2R. Dengan begitu, hasil tidak tergantung ukuran lot dan bisa dibandingkan antar periode. Format ini sama dengan yang Anda pakai di [jurnal trading](/artikel/cara-membuat-jurnal-trading), sehingga hasil backtest nanti mudah dibandingkan dengan hasil live.

## Langkah 3: Hitung ekspektansi dan masukkan biaya

Setelah sampel terkumpul, hitung **ekspektansi**: rata-rata hasil per posisi dalam R.

> Ekspektansi = total hasil dalam R ÷ jumlah posisi

### Contoh hitungan (ilustrasi)

Misalkan backtest fiktif pada XAUUSD H1 menghasilkan 40 setup: 15 mencapai target (+2R) dan 25 terkena stop loss (−1R).

- Total untung: 15 × 2R = +30R
- Total rugi: 25 × (−1R) = −25R
- Hasil bersih: +30R − 25R = **+5R**
- Ekspektansi: 5R ÷ 40 = **+0,125R per posisi**

Angka itu belum termasuk biaya. Anggap spread contoh 0,30 dolar per ons dan rata-rata jarak stop loss 6,00 dolar. Biaya spread per posisi = 0,30 ÷ 6,00 = **0,05R**. Untuk 40 posisi: 40 × 0,05R = 2R. Hasil bersih turun menjadi +3R, dan ekspektansi menjadi 3R ÷ 40 = **+0,075R**, hampir setengahnya hilang hanya karena spread. Slippage dan swap bisa menggerusnya lebih jauh.

### Titik impas strategi

Dengan target 2R dan biaya 0,05R, posisi untung bersih +1,95R dan posisi rugi −1,05R. Proporsi posisi yang harus mencapai target agar impas adalah 1,05 ÷ (1,95 + 1,05) = **35%**. Dalam contoh, 15 dari 40 setup berarti 37,5%, hanya tipis di atas titik impas. Selisih setipis itu mudah hilang oleh satu kebiasaan buruk, misalnya menggeser stop loss.

Jika Anda ingin mengubah hasil dalam R menjadi ukuran lot nyata, gunakan [kalkulator lot gratis](/alat/kalkulator-lot) dengan risiko per posisi yang sudah Anda tetapkan.

## Langkah 4: Lihat rentetan rugi dan drawdown, bukan hanya hasil akhir

Hasil bersih positif belum cukup. Periksa juga:

- **Rentetan rugi terpanjang.** Misalkan dalam sampel ada 6 kali rugi berturut-turut. Dengan risiko 1% per posisi, ekuitas turun sekitar 1 − 0,99⁶ ≈ **5,85%**. Pertanyaannya: apakah Anda sanggup tetap disiplin setelah enam kali kalah?
- **Drawdown maksimum dalam R**, yaitu penurunan terdalam dari puncak kurva hasil. Cara menghitungnya ada di artikel [rumus drawdown trading](/artikel/rumus-drawdown-trading).
- **Sebaran waktu.** Apakah hasil positif hanya datang dari satu bulan tertentu? Jika ya, kemungkinan strategi cocok untuk satu kondisi pasar saja.

Anggap rentetan rugi di backtest sebagai batas bawah, bukan batas atas. Di masa depan, rentetan yang lebih panjang tetap mungkin terjadi.

## Langkah 5: Jangan percaya sampel kecil

Ini kesalahan yang paling sering terlewat. Dari contoh 40 posisi di atas (sebelum biaya), simpangan baku hasil per posisi sekitar 1,47R, sehingga galat baku ekspektansi sekitar 1,47 ÷ √40 ≈ 0,23R. Rentang kasar ekspektansi (±2 galat baku) adalah **−0,34R sampai +0,59R**. Artinya, dari 40 sampel saja, Anda belum bisa memastikan strategi ini positif atau negatif.

Dengan statistik yang sama tetapi 200 sampel, galat bakunya mengecil menjadi sekitar 0,10R dan rentangnya menjadi kira-kira −0,08R sampai +0,33R. Lebih sempit, tetapi masih menyentuh angka negatif. Pelajaran praktisnya:

- Kumpulkan sampel sebanyak yang wajar, dari kondisi pasar yang berbeda (tren, sideways, volatil).
- Jangan mengubah aturan setiap kali menemukan beberapa kerugian, lalu mengulang tes di data yang sama. Itu namanya mencocok-cocokkan aturan dengan masa lalu (*curve fitting*).
- Sisihkan sebagian data yang belum pernah Anda lihat untuk tes akhir.

## Kesalahan umum saat backtest manual

1. **Melewatkan setup yang "terlihat jelek".** Jika memenuhi aturan, wajib dicatat.
2. **Melihat candle ke depan.** Gunakan replay atau tutup bagian kanan chart.
3. **Mengabaikan spread, slippage, dan jam berita.** Hasil terlihat lebih bagus dari kenyataan.
4. **Mengubah aturan di tengah tes.** Mulai ulang dari awal jika aturan berubah.
5. **Langsung pindah ke akun real.** Setelah backtest, uji dulu secara forward di [akun demo](/artikel/cara-menggunakan-akun-demo-trading) untuk melihat apakah Anda sanggup menjalankannya secara real time.

**Tonton juga:** [Dari Candlestick Sampai AI: Semua Cuma Teori?](https://www.youtube.com/watch?v=CeqFQwye0qI)

## Kesimpulan

Cara backtest strategi trading secara manual pada dasarnya sederhana: tulis aturan yang bisa diuji, catat semua setup tanpa pilih-pilih dalam satuan R, hitung ekspektansi setelah biaya, periksa rentetan rugi dan drawdown, lalu akui bahwa sampel kecil belum membuktikan apa pun. Backtest tidak menjamin hasil apa pun di masa depan, tetapi membantu Anda menghindari strategi yang sejak awal tidak layak dan menyiapkan mental untuk kerugian yang wajar.

Jika Anda ingin belajar manajemen risiko, menghitung lot, dan menyusun trading plan secara bertahap, ikuti Academy gratis di Doktor Trader. Anda bisa [mendaftar di sini](/daftar) dan mulai dari modul pertama.

## Pertanyaan yang sering diajukan

### Berapa banyak sampel yang dibutuhkan untuk backtest?

Tidak ada angka ajaib. Seperti contoh di atas, 40 sampel masih menyisakan ketidakpastian yang sangat lebar. Semakin banyak sampel dari kondisi pasar yang beragam, semakin berarti hasilnya, tetapi tetap bukan jaminan untuk masa depan.

### Apakah backtest manual masih berguna kalau ada strategy tester otomatis?

Ya. Backtest manual memaksa Anda memahami setiap setup dan menguji aturan yang sulit diprogram. Strategy tester otomatis berguna untuk aturan yang sepenuhnya mekanis, dengan catatan biaya dan kualitas data harus diatur dengan benar.

### Kalau hasil backtest negatif, apa yang harus dilakukan?

Jangan langsung mengutak-atik aturan sampai hasilnya positif di data yang sama. Tinjau apakah ide dasarnya masuk akal, ubah satu hal saja jika perlu, lalu uji ulang di data yang belum pernah Anda pakai.
