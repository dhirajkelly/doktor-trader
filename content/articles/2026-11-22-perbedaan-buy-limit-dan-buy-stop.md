---
title: "Perbedaan Buy Limit dan Buy Stop: Panduan Pending Order MT5"
slug: perbedaan-buy-limit-dan-buy-stop
meta_title: Perbedaan Buy Limit dan Buy Stop di MT5 | Doktor Trader
meta_description: "Perbedaan buy limit dan buy stop di MT5: kapan dipakai, harga Ask atau Bid yang memicunya, dan contoh hitungan lot XAUUSD agar order tidak salah pasang."
focus_keyword: perbedaan buy limit dan buy stop
category: Panduan Pemula
tags: [pending order, buy limit, buy stop, mt5, panduan pemula]
excerpt: Buy limit menunggu harga turun, buy stop menunggu harga naik. Pahami bedanya, harga pemicunya, dan cara menghitung lot sebelum memasang pending order.
---

Salah satu kesalahan pertama saya di MT5 terlihat sepele. Saya ingin membeli emas kalau harga turun ke area support, jadi saya memasang order di bawah harga, tetapi memilih jenis yang salah. Platform menolak, saya bingung, lalu akhirnya membuka posisi langsung di harga pasar, jauh dari rencana. Sejak itu saya paham bahwa memahami **perbedaan buy limit dan buy stop** bukan sekadar hafalan istilah. Jenis pending order menentukan kapan dan di mana Anda masuk pasar, dan itu langsung memengaruhi jarak stop loss serta ukuran lot.

Artikel ini membahas empat jenis pending order dasar di MT5, harga pemicunya, kesalahan umum, dan contoh hitungan XAUUSD.

Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi atau prediksi arah emas.

## Apa itu pending order dan kenapa penting untuk pemula

Pending order adalah perintah untuk membuka posisi nanti, ketika harga mencapai level yang Anda tentukan. Berbeda dengan market order yang langsung dieksekusi di harga saat itu, pending order "menunggu" sampai syaratnya terpenuhi.

Bagi pemula, pending order punya tiga manfaat praktis:

- **Rencana dibuat saat tenang.** Level masuk, stop loss, dan take profit ditentukan sebelum harga bergerak, bukan di tengah gejolak.
- **Tidak perlu menatap layar terus.** Kalau harga tidak sampai ke level rencana, order tidak tereksekusi dan Anda tidak rugi apa-apa.
- **Lot bisa dihitung dengan pasti.** Karena harga masuk sudah diketahui, jarak ke stop loss juga pasti, sehingga ukuran lot bisa dihitung dari batas risiko.

## Perbedaan buy limit dan buy stop secara sederhana

Cara paling mudah mengingatnya: **limit** berarti Anda ingin harga yang lebih baik dari sekarang, **stop** berarti Anda menunggu konfirmasi bahwa harga sudah bergerak ke arah tertentu.

- **Buy Limit** dipasang **di bawah** harga saat ini. Anda ingin membeli lebih murah, misalnya saat harga turun kembali ke area support.
- **Buy Stop** dipasang **di atas** harga saat ini. Anda baru ingin membeli kalau harga naik menembus level tertentu, misalnya resistance.

Logika yang sama berlaku untuk sisi jual:

- **Sell Limit** dipasang **di atas** harga saat ini. Anda ingin menjual lebih mahal, misalnya saat harga naik ke area resistance.
- **Sell Stop** dipasang **di bawah** harga saat ini. Anda baru ingin menjual kalau harga turun menembus level tertentu.

| Jenis order | Posisi terhadap harga saat ini | Ide dasarnya | Contoh situasi |
|---|---|---|---|
| Buy Limit | Di bawah | Beli lebih murah | Menunggu harga kembali ke support |
| Buy Stop | Di atas | Beli setelah harga menembus ke atas | Menunggu breakout resistance |
| Sell Limit | Di atas | Jual lebih mahal | Menunggu harga naik ke resistance |
| Sell Stop | Di bawah | Jual setelah harga menembus ke bawah | Menunggu breakdown support |

Kalau Anda belum yakin cara menentukan area support dan resistance yang dipakai sebagai level order, baca dulu [cara menentukan support resistance XAUUSD](/artikel/cara-menentukan-support-resistance-xauusd).

### Bagaimana dengan Buy Stop Limit dan Sell Stop Limit?

MT5 juga punya dua jenis gabungan. Menurut panduan resmi MetaTrader 5, **Buy Stop Limit** bekerja dalam dua tahap: ketika harga Ask mencapai level stop (kolom *Price*), platform memasang Buy Limit di harga *Stop Limit* yang berada di bawah level stop tersebut. **Sell Stop Limit** adalah kebalikannya untuk sisi jual. Untuk pemula, kuasai dulu empat jenis dasar di atas.

## Harga Ask atau Bid: mana yang memicu order Anda

Bagian ini sering terlewat. Panduan resmi MetaTrader 5 menjelaskan bahwa order beli (Buy Limit, Buy Stop, Buy Stop Limit) dikaitkan dengan harga **Ask**, sedangkan order jual (Sell Limit, Sell Stop, Sell Stop Limit) dikaitkan dengan harga **Bid**.

Masalahnya, grafik di MT5 secara bawaan menampilkan harga Bid. Akibatnya:

- Buy Limit Anda bisa tereksekusi **sebelum** garis harga di chart menyentuh level order, karena yang menyentuh level itu adalah Ask.
- Sebaliknya, Anda bisa melihat chart "hampir" menyentuh level Buy Stop tetapi order belum terpicu karena Ask belum sampai.

Contoh: Buy Limit di 4.001,00 dengan spread contoh $0,30. Order terpicu ketika Ask turun ke 4.001,00, yaitu saat Bid di chart sekitar 4.000,70. Untuk order jual, yang dipakai adalah Bid, jadi garis chart memang menggambarkan pemicunya. Cara menghitung dan membaca spread emas dibahas lengkap di [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

## Cara memasang pending order di MT5

Langkah dasarnya di versi desktop:

1. Buka chart simbol yang dimaksud, misalnya XAUUSD.
2. Tekan **F9** atau klik **New Order**.
3. Pada pilihan jenis order, pilih **Pending Order**, lalu tentukan tipe: Buy Limit, Sell Limit, Buy Stop, Sell Stop, atau jenis Stop Limit.
4. Isi **Volume** (lot), **Price** (level pemicu), **Stop Loss**, dan **Take Profit**.
5. Klik **Place**.

Setelah itu, order muncul di tab **Trade** pada Toolbox sebagai order yang belum aktif. Order bisa diubah atau dihapus lewat klik kanan, lalu **Modify or Delete**. Kalau MT5 menolak dengan pesan harga tidak valid, periksa dua hal: apakah jenis order sesuai posisinya terhadap harga (misalnya Buy Limit harus di bawah Ask), dan apakah jaraknya memenuhi batas minimum yang ditetapkan pialang di spesifikasi simbol. Panduan teknis mengisi kolom stop loss ada di [cara pasang stop loss di MT5](/artikel/cara-pasang-stop-loss-di-mt5).

### Kesalahan yang sering terjadi

- **Tertukar limit dan stop.** Ingin membeli di support (di bawah harga) tetapi memilih Buy Stop. Order ditolak, atau lebih buruk, Anda tergoda masuk langsung di harga pasar.
- **Lupa mengisi stop loss.** Pending order yang terpicu tanpa SL berarti posisi terbuka tanpa batas kerugian.
- **Membiarkan order lama.** Kondisi pasar berubah, tetapi order dari beberapa hari lalu masih menunggu. Hapus order yang alasannya sudah tidak berlaku.
- **Mengira harga eksekusi selalu persis.** Saat harga bergerak sangat cepat atau membuka dengan gap, terutama pada order stop, posisi bisa terisi di harga yang lebih buruk dari level order.

## Contoh hitungan: Buy Limit vs Buy Stop pada XAUUSD

Contoh berikut memakai asumsi umum 1 lot XAUUSD = 100 troy ounce, sehingga pergerakan $1 bernilai $100 per 1 lot. Cek spesifikasi kontrak di akun Anda sendiri.

Modal contoh $2.000, risiko per posisi 1% = **$20**. Harga saat ini 4.020,00.

**Skenario A: Buy Limit di area support**

- Level order: 4.001,00, stop loss: 3.994,00, jarak SL = $7
- Lot = $20 ÷ ($7 × 100) = 0,0286 lot, dibulatkan **ke bawah** menjadi **0,02 lot**
- Kerugian bila SL tersentuh: 0,02 × 100 × $7 = **$14**
- Take profit contoh 4.015,00: potensi hasil 0,02 × 100 × $14 = $28, rasio risk reward 1 : 2

**Skenario B: Buy Stop di atas resistance**

- Level order: 4.031,50, stop loss: 4.024,50, jarak SL = $7
- Lot dengan hitungan yang sama: **0,02 lot**, kerugian bila SL tersentuh **$14**
- Bila harga melompat dan order terisi di 4.033,00, jarak ke SL menjadi $8,50, sehingga kerugian bila SL tersentuh naik menjadi 0,02 × 100 × $8,50 = **$17**

| Skenario | Harga masuk | Jarak SL | Lot | Kerugian bila SL tersentuh |
|---|---|---|---|---|
| A. Buy Limit | 4.001,00 | $7,00 | 0,02 | $14 |
| B. Buy Stop (sesuai level) | 4.031,50 | $7,00 | 0,02 | $14 |
| B. Buy Stop (terisi lebih buruk) | 4.033,00 | $8,50 | 0,02 | $17 |

Pembulatan lot ke bawah memberi ruang cadangan: di skenario B, kerugian tetap di bawah batas $20 meski harga masuk lebih buruk $1,50. Untuk menghindari salah hitung, gunakan [kalkulator lot gratis](/alat/kalkulator-lot) sebelum menekan Place.

## Kapan memilih limit, kapan memilih stop

Tidak ada jenis yang lebih baik secara mutlak. Pilihan tergantung pada ide Anda terhadap pergerakan harga:

1. **Anda berharap harga memantul dari suatu area** → gunakan order limit. Risikonya, harga bisa menembus area itu dan langsung menyentuh SL.
2. **Anda menunggu harga membuktikan arahnya dengan menembus level** → gunakan order stop. Risikonya, breakout bisa gagal dan harga berbalik setelah order terpicu.
3. **Anda tidak punya alasan jelas** → jangan pasang order apa pun. Menunggu juga keputusan.

## Kesimpulan

Perbedaan buy limit dan buy stop terletak pada posisi dan niatnya: Buy Limit di bawah harga untuk membeli lebih murah, Buy Stop di atas harga untuk membeli setelah harga menembus ke atas. Order beli dipicu oleh Ask, order jual oleh Bid, dan karena chart menampilkan Bid, spread ikut menentukan kapan order Anda aktif. Yang paling penting, setiap pending order harus punya stop loss dan lot yang dihitung dari jarak SL, dengan pembulatan ke bawah sebagai cadangan.

Kalau Anda ingin belajar dasar-dasar ini secara berurutan, dari jenis order sampai manajemen risiko, ikuti Academy gratis di Doktor Trader. Materinya disusun untuk pemula dan bisa diakses setelah [mendaftar](/daftar).

## Pertanyaan yang sering diajukan

### Apakah pending order tetap berjalan kalau MT5 saya tutup?

Pending order tercatat di server pialang setelah dipasang, sehingga tidak bergantung pada platform Anda tetap terbuka. Pastikan order benar-benar muncul di tab Trade sebelum menutup MT5.

### Kenapa Buy Limit saya terpicu padahal chart belum menyentuh level?

Karena order beli dipicu oleh harga Ask, sedangkan chart menampilkan Bid. Selisihnya adalah spread. Anda bisa menampilkan garis Ask di chart lewat pengaturan chart agar lebih mudah memantaunya.

### Apakah pending order cocok untuk pemula?

Cocok, karena memaksa Anda menentukan level masuk, stop loss, dan lot sebelum harga bergerak. Latih dulu di akun demo.
