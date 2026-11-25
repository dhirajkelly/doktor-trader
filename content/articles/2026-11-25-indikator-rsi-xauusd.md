---
title: "Indikator RSI XAUUSD: Cara Membaca, Menghitung, dan Memakainya"
slug: indikator-rsi-xauusd
meta_title: Indikator RSI XAUUSD untuk Trader Emas | Doktor Trader
meta_description: "Indikator RSI XAUUSD dijelaskan dari rumus, contoh hitungan, arti overbought dan oversold, divergensi, hingga cara memakainya bersama tren dan stop loss."
focus_keyword: indikator rsi xauusd
category: Analisa Teknikal
tags: [rsi, xauusd, analisa teknikal, indikator, divergensi]
excerpt: RSI bukan tombol beli dan jual. Pahami rumusnya, arti angka 70 dan 30 di grafik emas, dan cara memakainya dengan tren serta stop loss.
---

Dulu saya mengira RSI di atas 70 berarti emas "pasti turun". Saya membuka posisi berlawanan dengan tren, lalu menonton RSI bertahan di atas 70 selama berjam-jam sementara posisi saya makin merah. Pengalaman itu mengajarkan bahwa **indikator RSI XAUUSD** bukan alat untuk menebak puncak, melainkan alat untuk mengukur seberapa kuat dorongan harga. Begitu Anda paham cara RSI dihitung, Anda juga akan paham kapan angkanya bermakna dan kapan menyesatkan.

Artikel ini membahas rumus RSI, contoh hitungan, arti level 70, 50, dan 30, divergensi, serta cara memakainya bersama tren dan stop loss. Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu RSI dan dari mana asalnya

RSI (*Relative Strength Index*) adalah indikator momentum yang diperkenalkan J. Welles Wilder Jr. pada 1978 dalam bukunya *New Concepts in Technical Trading Systems*. Nilainya bergerak antara 0 dan 100. Pengaturan bawaan yang disarankan Wilder adalah 14 periode, dan level acuan klasiknya 70 (overbought) serta 30 (oversold).

Yang perlu diingat: RSI tidak membaca berita dan tidak tahu arah tren besar. RSI hanya membandingkan rata-rata kenaikan penutupan dengan rata-rata penurunan penutupan dalam periode tertentu. Itu saja.

### Rumus RSI

Rumusnya terdiri dari dua bagian:

- **RS** = rata-rata kenaikan ÷ rata-rata penurunan (dalam N periode)
- **RSI** = 100 − (100 ÷ (1 + RS))

Kenaikan dihitung dari selisih harga penutupan candle sekarang dengan candle sebelumnya, hanya jika naik. Penurunan dihitung dengan cara yang sama, hanya jika turun (ditulis sebagai angka positif). Setelah rata-rata pertama, Wilder memakai penghalusan: rata-rata baru = (rata-rata lama × (N − 1) + nilai terbaru) ÷ N.

## Contoh hitungan RSI langkah demi langkah

Agar mudah diikuti, contoh ini memakai RSI 5 periode, bukan 14. Logikanya sama persis. Harga penutupan berikut adalah contoh ilustrasi XAUUSD di timeframe H1.

| Candle | Close (contoh) | Perubahan | Kenaikan | Penurunan |
|---|---|---|---|---|
| 1 | 2.650,0 | – | – | – |
| 2 | 2.654,0 | +4,0 | 4,0 | 0 |
| 3 | 2.651,5 | −2,5 | 0 | 2,5 |
| 4 | 2.657,0 | +5,5 | 5,5 | 0 |
| 5 | 2.660,5 | +3,5 | 3,5 | 0 |
| 6 | 2.658,0 | −2,5 | 0 | 2,5 |

**Langkah 1: rata-rata pertama.** Total kenaikan 4,0 + 5,5 + 3,5 = 13,0, dibagi 5 = **2,6**. Total penurunan 2,5 + 2,5 = 5,0, dibagi 5 = **1,0**.

**Langkah 2: RS dan RSI.** RS = 2,6 ÷ 1,0 = 2,6. RSI = 100 − (100 ÷ 3,6) = **72,22**.

**Langkah 3: candle berikutnya dengan penghalusan Wilder.** Candle 7 ditutup di 2.663,0 (naik 5,0).

- Rata-rata kenaikan = (2,6 × 4 + 5,0) ÷ 5 = 3,08
- Rata-rata penurunan = (1,0 × 4 + 0) ÷ 5 = 0,80
- RS = 3,85, RSI = **79,38**

**Langkah 4: satu candle turun tajam.** Candle 8 ditutup di 2.655,0 (turun 8,0).

- Rata-rata kenaikan = (3,08 × 4 + 0) ÷ 5 = 2,464
- Rata-rata penurunan = (0,80 × 4 + 8,0) ÷ 5 = 2,24
- RS = 1,10, RSI = **52,38**

Perhatikan apa yang terjadi: satu candle turun $8 menjatuhkan RSI dari 79 ke 52. Dengan periode pendek, RSI sangat sensitif. Dengan RSI 14, perubahannya lebih halus karena setiap candle baru hanya berbobot 1/14. Angka di MT4 atau MT5 Anda bisa sedikit berbeda dari hitungan manual karena platform memulai rata-rata dari data yang lebih panjang.

## Arti level 70, 50, dan 30 pada grafik emas

Kesalahan yang dulu sering saya lakukan adalah membaca 70 sebagai "jual" dan 30 sebagai "beli". Berikut cara membaca yang lebih jujur:

- **Di atas 70:** dorongan naik sedang kuat. Dalam tren naik yang sehat, RSI bisa bertahan di area ini cukup lama. Overbought berarti harga naik cepat, bukan berarti harga sudah terlalu mahal.
- **Sekitar 50:** garis tengah. RSI yang konsisten di atas 50 menandakan kenaikan penutupan rata-rata lebih besar dari penurunannya, dan sebaliknya.
- **Di bawah 30:** dorongan turun sedang kuat. Dalam tren turun, RSI bisa menempel di bawah 30 sementara harga terus turun.

Ada pandangan dalam literatur analisa teknikal bahwa dalam tren naik, RSI cenderung bertahan di area 40–50 saat koreksi, sedangkan dalam tren turun RSI sering tertahan di area 50–60 saat harga memantul. Ini bukan aturan pasti, tetapi cara pandang ini membantu Anda memakai RSI sebagai alat konfirmasi tren, bukan alat melawan tren.

### Kenapa XAUUSD butuh perhatian khusus

Emas bisa bergerak sangat cepat saat rilis data ekonomi Amerika Serikat atau pernyataan bank sentral. Dalam kondisi seperti itu, RSI di timeframe kecil bisa melompat dari 50 ke atas 80 dalam satu atau dua candle. Membuka posisi berlawanan hanya karena angka RSI "ekstrem" di tengah rilis berita adalah cara cepat terkena stop loss. Cek jadwal rilis di kalender ekonomi sebelum mengambil keputusan.

## Divergensi RSI: sinyal peringatan, bukan perintah

Divergensi terjadi saat arah harga dan arah RSI tidak sejalan.

1. **Bearish divergence:** harga membuat high lebih tinggi, tetapi RSI membuat high lebih rendah. Contoh: high pertama 2.672,0 dengan RSI 74, high kedua 2.678,5 dengan RSI 66. Harga naik, tetapi dorongannya melemah.
2. **Bullish divergence:** harga membuat low lebih rendah, tetapi RSI membuat low lebih tinggi. Penurunan masih terjadi, tetapi tenaganya berkurang.

Divergensi bisa muncul berulang kali sebelum harga berbalik, atau tidak diikuti pembalikan sama sekali. Perlakukan divergensi sebagai alasan untuk lebih waspada atau menunggu konfirmasi struktur harga, bukan alasan langsung membuka posisi berlawanan.

## Cara memakai RSI bersama tren dan stop loss

RSI paling berguna jika menjadi bagian dari proses, bukan satu-satunya alasan. Berikut kerangka yang bisa Anda uji di akun demo:

1. **Tentukan tren di timeframe besar.** Misalnya H4 atau D1, dengan struktur high–low atau bantuan [moving average pada XAUUSD](/artikel/cara-menggunakan-moving-average-xauusd). Pendekatan berlapis ini dibahas di artikel [analisa multi timeframe XAUUSD](/artikel/analisa-multi-timeframe-xauusd).
2. **Pakai RSI untuk membaca koreksi di timeframe entry.** Dalam tren naik, perhatikan apakah RSI turun ke area 40–50 lalu kembali naik, alih-alih menunggu RSI di bawah 30.
3. **Tentukan stop loss dari struktur harga,** bukan dari angka RSI. Cara memberi jarak yang masuk akal ada di artikel [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd).
4. **Hitung lot dari jarak stop loss.**
5. **Catat setiap transaksi di jurnal,** termasuk nilai RSI saat entry, agar Anda bisa menilai apakah RSI benar-benar menambah nilai pada sistem Anda.

### Contoh hitungan lot setelah stop loss ditentukan

Misalkan modal $1.000 dan risiko per transaksi 1%, berarti batas rugi $10. Stop loss berjarak $8 dari harga entry (contoh). Untuk XAUUSD dengan ukuran kontrak umum 100 oz per lot, pergerakan $1 bernilai $100 per 1 lot, jadi jarak $8 bernilai $800 per lot.

- Lot maksimal = $10 ÷ $800 = 0,0125 lot
- Dibulatkan ke bawah menjadi **0,01 lot**, sehingga risiko aktual $8

Ukuran kontrak bisa berbeda antar akun, jadi cek spesifikasi simbol di platform Anda. Untuk menghitung lebih cepat, gunakan [kalkulator lot gratis](/alat/kalkulator-lot).

## Memasang RSI di MT4 dan MT5

Di MT4 maupun MT5, buka menu **Insert → Indicators → Oscillators → Relative Strength Index**. Biarkan periode 14 dan *Apply to: Close*, lalu pada tab **Levels** pastikan level 70 dan 30 ada. Anda bisa menambahkan level 50 sebagai garis tengah. Klik OK, dan RSI akan muncul di jendela terpisah di bawah grafik.

Satu hal yang penting: nilai RSI pada candle yang masih berjalan terus berubah sampai candle ditutup. Jika aturan Anda memakai RSI, putuskan berdasarkan candle yang sudah ditutup agar tidak terjebak sinyal yang hilang.

**Tonton juga:** [Dari Candlestick Sampai AI: Semua Cuma Teori?](https://www.youtube.com/watch?v=CeqFQwye0qI)

## Kesimpulan

Indikator RSI XAUUSD mengukur kekuatan dorongan harga, bukan memprediksi puncak atau dasar. Pahami rumusnya, baca level 70 dan 30 sebagai tanda momentum kuat, gunakan divergensi sebagai peringatan, dan selalu letakkan RSI di bawah keputusan yang lebih penting: arah tren, stop loss dari struktur harga, dan ukuran lot yang sesuai risiko. Uji aturan Anda di akun demo dan catat hasilnya sebelum memakai uang sungguhan.

Jika Anda ingin belajar analisa teknikal dan manajemen risiko secara berurutan, Academy di Doktor Trader bisa diakses gratis. Anda cukup [mendaftar di sini](/daftar).

## Pertanyaan yang sering diajukan

### Berapa setting RSI terbaik untuk XAUUSD?

Tidak ada setting yang terbaik untuk semua orang. Periode 14 adalah bawaan yang disarankan Wilder, sehingga mudah dibandingkan dengan referensi lain. Periode lebih pendek membuat RSI lebih sensitif dan lebih sering menyentuh level ekstrem. Apa pun pilihannya, gunakan secara konsisten dan uji di akun demo.

### Apakah RSI di bawah 30 berarti emas sudah murah?

Tidak. RSI di bawah 30 hanya berarti penurunan penutupan rata-rata jauh lebih besar dari kenaikannya dalam periode tersebut. Dalam tren turun yang kuat, kondisi ini bisa bertahan lama.
