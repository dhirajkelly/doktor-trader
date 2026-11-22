---
title: "Cara Menggunakan Trailing Stop XAUUSD di MT5, Lengkap Contohnya"
slug: cara-menggunakan-trailing-stop-xauusd
meta_title: Cara Menggunakan Trailing Stop XAUUSD | Doktor Trader
meta_description: "Cara menggunakan trailing stop XAUUSD di MT5: cara kerjanya, langkah memasang, memilih jarak dalam point, dan simulasi hitungan agar stop loss ikut bergerak."
focus_keyword: cara menggunakan trailing stop xauusd
category: Strategi Emas
tags: [trailing stop, xauusd, mt5, stop loss, strategi emas]
excerpt: Trailing stop menggeser stop loss mengikuti harga. Pelajari cara kerjanya di MT5, memilih jarak yang masuk akal, dan simulasi hitungan pada emas.
---

Setelah akun saya terkena margin call bertahun-tahun lalu, saya belajar memasang stop loss di setiap posisi. Masalah berikutnya muncul tidak lama kemudian: posisi emas sudah bergerak jauh sesuai rencana, lalu berbalik penuh dan menyentuh stop loss awal. Untung di atas kertas berubah menjadi rugi. Dari situ saya mulai mempelajari **cara menggunakan trailing stop XAUUSD** dengan benar, yaitu menggeser stop loss mengikuti harga secara otomatis, tanpa harus duduk di depan layar sepanjang waktu.

Artikel ini membahas cara kerjanya di MT5, langkah memasang, memilih jarak, dan simulasi hitungan.

Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi atau prediksi arah emas.

## Apa itu trailing stop dan bedanya dengan stop loss biasa

Stop loss biasa diam di satu level sampai Anda memindahkannya sendiri. Trailing stop adalah stop loss yang **bergerak mengikuti harga** ke arah yang menguntungkan, dengan jarak tetap yang Anda tentukan. Kalau harga berbalik, trailing stop tidak ikut mundur. Ia tetap di level terakhirnya, sehingga sebagian pergerakan yang sudah terjadi tetap terkunci.

Perbandingan singkatnya:

| Aspek | Stop loss biasa | Trailing stop |
|---|---|---|
| Posisi level | Tetap, digeser manual | Bergeser otomatis mengikuti harga |
| Arah gerak | Bebas, tergantung Anda | Hanya ke arah yang menguntungkan |
| Tujuan utama | Membatasi kerugian awal | Melindungi pergerakan yang sudah terjadi |
| Butuh terminal menyala | Tidak | Ya, untuk trailing bawaan MT5 |

Penting dipahami: trailing stop **bukan pengganti** stop loss awal. Stop loss awal tetap harus ada sejak posisi dibuka, karena trailing stop bawaan MT5 baru mulai menggeser level setelah posisi bergerak cukup jauh dalam keadaan untung. Kalau Anda belum yakin cara menentukan level awalnya, baca dulu [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd).

## Cara kerja trailing stop di MT5

Trailing stop di MT5 diukur dalam **point**. Pada XAUUSD dengan dua angka desimal, 1 point = 0,01, sehingga:

- 200 point = pergerakan harga $2
- 500 point = pergerakan harga $5
- 1.000 point = pergerakan harga $10

Cara kerjanya untuk posisi buy:

1. Anda memilih jarak trailing, misalnya 500 point.
2. Selama untung posisi belum melebihi 500 point, trailing stop belum melakukan apa pun. Stop loss awal yang berlaku.
3. Begitu untung melebihi 500 point, MT5 memindahkan stop loss ke harga Bid dikurangi 500 point.
4. Setiap kali harga membuat level tertinggi baru, stop loss ikut naik dengan jarak yang sama.
5. Kalau harga turun, stop loss diam. Jika harga menyentuhnya, posisi ditutup.

Untuk posisi sell, logikanya terbalik: stop loss mengikuti harga Ask ke bawah dan tidak pernah naik kembali.

### Batasan yang wajib Anda tahu

Trailing stop bawaan MT5 dijalankan oleh **terminal di komputer Anda**, bukan oleh server. Artinya, pergeseran stop loss hanya terjadi selama terminal terbuka dan terhubung ke server. Jika laptop dimatikan atau internet putus, stop loss tetap berada di level terakhir yang sempat dikirim, tetapi tidak bergerak lagi. Kalau Anda ingin trailing tetap berjalan tanpa laptop menyala, pilihannya adalah menjalankan terminal di VPS, atau menggeser stop loss secara manual sesuai rencana.

Selain itu, jarak trailing tidak bisa lebih kecil dari *Stops level* yang ditetapkan untuk simbol tersebut. Nilainya berbeda di tiap akun dan bisa dicek di Market Watch, klik kanan simbol, lalu Specification.

## Langkah memasang trailing stop XAUUSD di MT5

Pastikan posisi sudah terbuka dan sudah punya stop loss awal. Lalu:

1. Buka jendela **Toolbox** (Ctrl+T) dan masuk ke tab **Trade**.
2. Klik kanan pada posisi XAUUSD yang ingin diberi trailing stop.
3. Pilih menu **Trailing Stop**.
4. Pilih salah satu nilai yang tersedia, atau pilih **Custom** untuk mengetik jarak sendiri dalam point, misalnya 500.
5. Periksa kolom posisi. Setelah untung melewati jarak trailing, angka di kolom S/L akan mulai berubah.

Untuk mematikan, klik kanan posisi yang sama, pilih Trailing Stop, lalu **None**. Jika Anda belum terbiasa dengan kolom S/L di MT5, panduan [cara pasang stop loss di MT5](/artikel/cara-pasang-stop-loss-di-mt5) membahas langkah dasarnya.

## Memilih jarak trailing yang masuk akal

Jarak trailing adalah kompromi. Terlalu dekat, posisi mudah tertutup oleh fluktuasi normal emas. Terlalu jauh, sebagian besar pergerakan bisa hilang sebelum stop tersentuh. Tidak ada angka yang benar untuk semua kondisi, tetapi ada beberapa pedoman praktis:

- **Samakan dengan logika stop loss awal.** Jika stop loss awal Anda $5 karena struktur grafik, jarak trailing di sekitar angka itu biasanya lebih konsisten daripada angka acak.
- **Sesuaikan dengan volatilitas.** Gunakan indikator ATR pada timeframe yang Anda pakai sebagai gambaran besar gerak harga per candle. Jarak trailing yang jauh lebih kecil dari ATR akan sering tersentuh oleh gerakan biasa.
- **Perhitungkan spread.** Spread XAUUSD bisa melebar saat rilis data atau pergantian sesi. Trailing yang terlalu rapat bisa tersentuh hanya karena spread melebar.
- **Pilih sebelum entry.** Tentukan jarak trailing di rencana trading, bukan saat posisi sudah berjalan dan emosi sedang naik.

## Simulasi hitungan: tiga jarak trailing, dua skenario

Asumsi contoh:

- Modal $1.000, risiko 1% = $10
- Buy XAUUSD di 3.000,00, stop loss awal 2.995,00 (jarak $5)
- Ukuran lot: $10 ÷ ($5 × 100) = **0,02 lot**, dengan asumsi 1 lot = 100 troy ounce, sehingga setiap $1 pergerakan bernilai $2 pada 0,02 lot
- Spread, komisi, dan slippage diabaikan agar hitungan mudah diikuti

Hitungan lot seperti ini bisa Anda cek cepat dengan [kalkulator lot gratis](/alat/kalkulator-lot).

### Skenario A: harga naik bertahap dengan koreksi

Urutan harga contoh: 3.000 → 3.004 → 3.002,5 → 3.010 → 3.006 → 3.015 → 3.009 → 3.020.

| Jarak trailing | Stop loss terakhir | Hasil | Selisih per 0,02 lot |
|---|---|---|---|
| 200 point ($2) | 3.008,00 | Tertutup saat harga turun ke 3.006 | +$16 |
| 500 point ($5) | 3.010,00 | Tertutup saat harga turun ke 3.009 | +$20 |
| 800 point ($8) | 3.012,00 | Masih terbuka di 3.020 | Belum terealisasi |

Pada skenario ini, trailing yang rapat menutup posisi di koreksi pertama yang cukup dalam, sementara trailing yang lebih longgar memberi ruang bagi harga untuk bernapas.

### Skenario B: harga naik lalu berbalik tajam

Urutan harga contoh: 3.000 → 3.010 → 2.990.

| Jarak trailing | Stop loss terakhir | Hasil | Selisih per 0,02 lot |
|---|---|---|---|
| 200 point ($2) | 3.008,00 | Tertutup di 3.008 | +$16 |
| 500 point ($5) | 3.005,00 | Tertutup di 3.005 | +$10 |
| 800 point ($8) | 3.002,00 | Tertutup di 3.002 | +$4 |

Di sini hasilnya berbalik: trailing rapat justru mengunci lebih banyak. Pelajaran dari dua skenario ini sederhana. Tidak ada jarak trailing yang selalu unggul, karena hasilnya bergantung pada bentuk pergerakan harga yang tidak bisa diketahui sebelumnya. Yang bisa Anda kendalikan adalah konsistensi: jarak yang dipilih berdasarkan alasan yang jelas, lalu dicatat dan dievaluasi di jurnal.

Perhatikan juga bahwa di kedua skenario, risiko awal tetap $10. Trailing stop tidak mengubah risiko di awal posisi. Ia hanya mengubah apa yang terjadi setelah harga bergerak sesuai arah.

## Kesalahan umum saat memakai trailing stop

Beberapa kesalahan yang saya sendiri pernah alami:

1. **Membuka posisi tanpa stop loss awal** karena merasa "nanti ada trailing". Selama untung belum melewati jarak trailing, posisi tidak terlindungi sama sekali.
2. **Mematikan laptop** dan mengira trailing tetap berjalan. Stop loss berhenti di level terakhir.
3. **Mengganti jarak trailing di tengah jalan** karena takut untung hilang. Ini sering berakhir dengan posisi tertutup oleh fluktuasi kecil.
4. **Melupakan rasio risk reward.** Trailing stop bukan alasan untuk masuk di setup yang buruk. Hitung dulu potensi dan risikonya dengan panduan [cara menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio).

## Kesimpulan

Memahami cara menggunakan trailing stop XAUUSD membantu Anda melindungi pergerakan yang sudah terjadi tanpa harus memantau grafik terus-menerus. Kuncinya ada pada tiga hal: stop loss awal tetap wajib, jarak trailing dipilih berdasarkan struktur dan volatilitas, bukan perasaan, dan Anda paham bahwa trailing bawaan MT5 hanya bekerja selama terminal menyala. Simulasi di atas menunjukkan bahwa tidak ada jarak yang selalu terbaik, jadi catat dan evaluasi pilihan Anda secara konsisten.

Jika Anda ingin belajar manajemen risiko secara berurutan, dari ukuran lot sampai pengelolaan posisi, Academy di Doktor Trader bisa diakses gratis. Anda cukup [daftar di sini](/daftar) untuk mulai.

## Pertanyaan yang sering diajukan

### Apakah trailing stop MT5 tetap bekerja di aplikasi HP?

Trailing stop bawaan dijalankan oleh terminal yang memasangnya. Jika Anda memasangnya di terminal desktop lalu menutup terminal itu, pergeseran stop loss berhenti. Agar tetap berjalan saat komputer mati, gunakan terminal yang menyala terus, misalnya di VPS.

### Berapa jarak trailing stop yang ideal untuk emas?

Tidak ada angka yang ideal untuk semua kondisi. Gunakan jarak stop loss awal dan ATR sebagai acuan, perhitungkan spread, lalu uji di akun demo sebelum dipakai di akun riil.

### Apakah trailing stop membuat trading lebih aman?

Trailing stop membantu mengunci sebagian pergerakan, tetapi tidak menghilangkan risiko. Gap harga dan slippage tetap bisa membuat posisi tertutup di harga yang berbeda dari level stop loss.
