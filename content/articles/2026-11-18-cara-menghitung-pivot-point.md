---
title: Cara Menghitung Pivot Point Harian untuk Trading Emas dan Forex
slug: cara-menghitung-pivot-point
meta_title: Cara Menghitung Pivot Point (Rumus & Contoh) | Doktor Trader
meta_description: Cara menghitung pivot point harian dengan rumus klasik dan Fibonacci, lengkap contoh hitungan XAUUSD, cara membacanya, dan kesalahan umum trader pemula.
focus_keyword: cara menghitung pivot point
category: Analisa Teknikal
tags: [pivot point, support resistance, analisa teknikal, xauusd]
excerpt: Pivot point hanya butuh tiga angka dari candle kemarin. Pelajari rumusnya, contoh hitungan emas, dan cara memakainya tanpa menebak arah.
---

Banyak trader pemula menggambar support dan resistance dengan perasaan: garis ditarik di tempat yang "kelihatannya" penting, lalu dipindah-pindah ketika harga menembusnya. Ada cara yang jauh lebih objektif, yaitu **pivot point**. Artikel ini menjelaskan **cara menghitung pivot point** harian langkah demi langkah, dari rumus klasik sampai versi Fibonacci, lengkap dengan contoh hitungan emas (XAUUSD) dan cara memakainya tanpa berubah menjadi tebak-tebakan arah.

Saya suka pivot point karena angkanya sama untuk semua orang yang memakai data yang sama. Tidak ada ruang untuk "menyesuaikan" garis agar cocok dengan keinginan, pelajaran yang saya bayar mahal sebelum margin call.

## Apa itu pivot point

Pivot point adalah level harga yang dihitung dari **High, Low, dan Close** periode sebelumnya. Untuk trading harian, periode yang dipakai adalah candle harian kemarin. Dari satu titik pusat (P), dihitung beberapa level di atasnya (resistance: R1, R2, R3) dan di bawahnya (support: S1, S2, S3).

Logikanya sederhana. Rata-rata dari High, Low, dan Close kemarin menggambarkan "harga keseimbangan" sesi sebelumnya. Ketika harga hari ini bergerak jauh di atas atau di bawah titik itu, banyak pelaku pasar memperhatikan level yang sama, sehingga level itu sering menjadi area reaksi, meski tidak selalu.

Satu hal penting sejak awal: **pivot point bukan sinyal beli atau jual.** Ia adalah peta. Peta memberi tahu di mana jalan bercabang, bukan ke mana Anda harus pergi.

## Rumus pivot point klasik

Versi klasik (sering disebut *floor pivot*) adalah yang paling banyak dipakai. Berikut rumusnya:

| Level | Rumus |
|---|---|
| Pivot (P) | (High + Low + Close) ÷ 3 |
| R1 | (2 × P) − Low |
| S1 | (2 × P) − High |
| R2 | P + (High − Low) |
| S2 | P − (High − Low) |
| R3 | High + 2 × (P − Low) |
| S3 | Low − 2 × (High − P) |

Hanya butuh tiga angka dan kalkulator.

### Contoh hitungan pivot point XAUUSD

Misalkan candle harian XAUUSD kemarin memiliki data berikut. Ini **contoh ilustrasi** untuk belajar, bukan data pasar sebenarnya:

- High: 2.680,00
- Low: 2.650,00
- Close: 2.671,00

Langkah perhitungannya:

1. **P** = (2.680 + 2.650 + 2.671) ÷ 3 = 8.001 ÷ 3 = **2.667,00**
2. **Range** kemarin = 2.680 − 2.650 = **30,00**
3. **R1** = (2 × 2.667) − 2.650 = **2.684,00**
4. **S1** = (2 × 2.667) − 2.680 = **2.654,00**
5. **R2** = 2.667 + 30 = **2.697,00**
6. **S2** = 2.667 − 30 = **2.637,00**
7. **R3** = 2.680 + 2 × (2.667 − 2.650) = 2.680 + 34 = **2.714,00**
8. **S3** = 2.650 − 2 × (2.680 − 2.667) = 2.650 − 26 = **2.624,00**

Hasilnya, peta hari ini dalam contoh ini: S3 2.624 – S2 2.637 – S1 2.654 – **P 2.667** – R1 2.684 – R2 2.697 – R3 2.714.

Perhatikan bahwa jarak antarlevel tidak sama. Jarak P ke R1 adalah 17, sedangkan P ke S1 adalah 13. Ini terjadi karena Close kemarin (2.671) berada di atas titik tengah range. Pivot point "mengingat" di mana pasar menutup harinya.

## Pivot point Fibonacci sebagai alternatif

Sebagian trader memakai versi Fibonacci. Titik P-nya sama, tetapi level support dan resistance dihitung dari persentase range kemarin:

- R1 = P + 0,382 × Range, S1 = P − 0,382 × Range
- R2 = P + 0,618 × Range, S2 = P − 0,618 × Range
- R3 = P + 1,000 × Range, S3 = P − 1,000 × Range

Dengan data contoh yang sama (P 2.667, Range 30), hasilnya:

| Level | Klasik | Fibonacci |
|---|---|---|
| R3 | 2.714,00 | 2.697,00 |
| R2 | 2.697,00 | 2.685,54 |
| R1 | 2.684,00 | 2.678,46 |
| P | 2.667,00 | 2.667,00 |
| S1 | 2.654,00 | 2.655,54 |
| S2 | 2.637,00 | 2.648,46 |
| S3 | 2.624,00 | 2.637,00 |

Versi Fibonacci simetris di sekitar P dan levelnya lebih rapat. Tidak ada yang "lebih benar". Yang penting, **pilih satu versi dan pakai secara konsisten** agar catatan jurnal Anda bisa dibandingkan dari minggu ke minggu.

## Cara membaca pivot point di grafik

Setelah level dihitung, tandai dengan garis horizontal di MT4 atau MT5. Beberapa cara membacanya yang umum dipakai:

1. **Posisi harga terhadap P.** Harga yang bertahan di atas P sering dibaca sebagai suasana pasar yang condong naik pada hari itu, dan sebaliknya. Ini konteks, bukan perintah entry.
2. **Level sebagai area, bukan garis tipis.** Emas jarang berhenti tepat di satu angka. Anggap setiap level sebagai zona beberapa dolar di sekitarnya.
3. **Konfluensi.** Level pivot yang berdekatan dengan swing high/low sebelumnya atau angka bulat lebih layak diperhatikan daripada level yang berdiri sendiri.
4. **Reaksi lebih penting daripada sentuhan.** Tunggu bagaimana harga bereaksi di level: apakah muncul penolakan yang jelas, atau harga menembus dengan mudah. Keputusan diambil dari reaksi itu sesuai rencana trading Anda.

### Jam server menentukan angka Anda

Candle harian di platform mengikuti **jam server broker**, bukan jam WIB. Dua broker dengan jam server berbeda bisa menghasilkan High, Low, dan Close harian yang berbeda, sehingga pivot point-nya juga berbeda. Pastikan Anda selalu mengambil data dari platform yang sama dengan tempat Anda trading, dan jangan mencampur angka dari sumber lain.

## Pivot point dan manajemen risiko

Di sinilah pivot point benar-benar berguna bagi saya: ia membantu menentukan **di mana ide trading batal**, sehingga jarak stop loss dan ukuran lot bisa dihitung sebelum masuk.

Contoh ilustrasi: modal $2.000 dengan risiko maksimal 1% per posisi, artinya $20. Misalkan rencana Anda adalah mempertimbangkan posisi buy di sekitar S1 (2.654) setelah ada reaksi penolakan, dengan entry di 2.662. Jika harga turun sampai menembus S2 (2.637), alasan setup jelas sudah tidak berlaku. Anda menaruh stop loss sedikit di atas S2, misalnya di 2.647, dengan pertimbangan area di antara S1 dan S2 sudah merupakan wilayah batal.

- Jarak stop loss = 2.662 − 2.647 = **15 dolar**
- Lot = $20 ÷ (15 × 100) = **0,013 lot**, dibulatkan **ke bawah** menjadi **0,01 lot**
- Risiko aktual = 15 × 100 × 0,01 = **$15**, masih di bawah batas $20

Angka 100 berasal dari asumsi 1 lot XAUUSD = 100 troy ounce, yang umum di akun standar. Cek spesifikasi kontrak di platform Anda. Penjelasan rumus lot lebih lengkap ada di artikel [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd), dan cara memberi penyangga berbasis ATR agar stop loss tidak mudah tersentuh noise saya bahas di [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd).

Perhatikan urutannya: level pivot → titik batal → jarak SL → lot. Bukan sebaliknya. Jika lot hasil hitungan di bawah lot minimum, lewati setup itu. Jangan mempersempit stop loss hanya agar bisa masuk.

## Kesalahan umum saat memakai pivot point

- **Menganggap setiap level pasti memantul.** Pada hari dengan rilis data besar di kalender ekonomi, harga bisa menembus beberapa level sekaligus. Pivot point dihitung dari kemarin, ia tidak tahu berita hari ini.
- **Entry otomatis di setiap sentuhan.** Tanpa konfirmasi dan tanpa rencana, pivot point berubah menjadi alasan untuk overtrading.
- **Memakai banyak versi sekaligus.** Klasik, Fibonacci, Camarilla, Woodie, semua di satu grafik. Hasilnya garis di mana-mana dan selalu ada "alasan" untuk masuk.
- **Lupa memperbarui setiap hari.** Level kemarin tidak berlaku untuk hari ini. Jadikan menghitung pivot bagian dari rutinitas pagi.
- **Mengabaikan ukuran posisi.** Level yang bagus tidak menyelamatkan akun jika lot terlalu besar. Kerugian beruntun dengan lot besar adalah jalan cepat menuju [margin call](/artikel/margin-call-penyebab-dan-cara-menghindari).

### Latihan sederhana minggu ini

Hitung pivot point klasik setiap pagi selama lima hari di akun demo. Catat di jurnal: di level mana harga bereaksi, di level mana harga menembus, dan apakah ada berita besar hari itu. Setelah lima hari, Anda punya gambaran nyata, bukan sekadar teori, tentang bagaimana level ini berperilaku di instrumen yang Anda trading.

## Kesimpulan

**Cara menghitung pivot point** sangat sederhana: ambil High, Low, dan Close kemarin, hitung P, lalu turunkan R1–R3 dan S1–S3 dengan rumus klasik atau Fibonacci. Nilainya bukan pada kemampuan menebak arah, melainkan pada objektivitas: Anda punya peta level yang sama setiap hari, yang bisa dipakai untuk menentukan titik batal, jarak stop loss, dan ukuran lot sebelum menekan tombol.

Pakai satu versi secara konsisten, perlakukan level sebagai area, dan selalu dahulukan manajemen risiko. Jika Anda ingin belajar membaca support-resistance, menyusun rencana trading, dan menghitung risiko secara terstruktur, materi lengkapnya tersedia gratis di Academy Doktor Trader. Anda bisa mulai dengan [mendaftar di sini](/daftar).

*Artikel ini untuk edukasi. Semua angka adalah contoh ilustrasi, bukan rekomendasi transaksi. Trading forex dan emas memiliki risiko tinggi dan dapat menyebabkan kehilangan seluruh modal.*
