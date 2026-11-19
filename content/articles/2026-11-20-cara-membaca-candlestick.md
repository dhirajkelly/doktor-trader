---
title: "Cara Membaca Candlestick untuk Pemula: Body, Sumbu, dan Range"
slug: cara-membaca-candlestick
meta_title: Cara Membaca Candlestick untuk Pemula | Doktor Trader
meta_description: Cara membaca candlestick untuk pemula - arti open, high, low, close, cara menghitung body dan sumbu, contoh hitungan XAUUSD, dan kaitannya dengan stop loss.
focus_keyword: cara membaca candlestick
category: Panduan Pemula
tags: [candlestick, panduan pemula, analisa teknikal, xauusd]
excerpt: Satu candle menyimpan empat harga. Pelajari cara membaca candlestick dari body, sumbu, dan range, lengkap dengan contoh hitungan XAUUSD.
---

Saat pertama membuka MT4, saya melihat deretan batang hijau dan merah dan langsung merasa "paham": hijau berarti naik, merah berarti turun, selesai. Pemahaman setengah jadi itu membuat saya sering masuk posisi hanya karena satu candle besar, tanpa melihat sumbunya, tanpa tahu di mana harga sempat ditolak. **Cara membaca candlestick** yang benar sebenarnya tidak rumit, tetapi perlu dibaca seperti membaca angka, bukan seperti menebak warna.

Di artikel ini kita bahas empat harga yang ada di setiap candle, cara menghitung body dan sumbu, contoh hitungan dengan angka XAUUSD, bentuk-bentuk candle yang perlu Anda kenali, dan bagaimana informasi candle dipakai untuk menentukan stop loss dan ukuran lot. Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu candlestick dan empat harga di dalamnya

Candlestick (lilin) adalah cara menampilkan pergerakan harga dalam satu periode waktu. Jika Anda membuka grafik H1, setiap candle mewakili satu jam. Di grafik D1, setiap candle mewakili satu hari perdagangan.

Setiap candle selalu berisi empat harga, yang sering disingkat **OHLC**:

- **Open**: harga pertama saat periode dimulai.
- **High**: harga tertinggi yang tercapai selama periode itu.
- **Low**: harga terendah yang tercapai selama periode itu.
- **Close**: harga terakhir saat periode berakhir.

Dari empat angka ini terbentuk dua bagian visual:

1. **Body (badan)**: kotak di antara open dan close.
2. **Sumbu (wick atau shadow)**: garis tipis di atas dan di bawah body, yang menunjukkan harga sempat bergerak sampai high dan low, tetapi tidak bertahan di sana sampai candle ditutup.

### Warna candle

Warna hanya memberi tahu arah open ke close. Jika close lebih tinggi dari open, candle disebut **bullish** (di banyak platform berwarna hijau atau putih). Jika close lebih rendah dari open, candle disebut **bearish** (merah atau hitam). Warna bisa diubah di pengaturan grafik, jadi jangan menghafal warnanya; hafalkan logikanya.

Satu hal yang sering terlewat: candle yang masih berjalan belum punya close yang final. Bentuknya bisa berubah total sampai periode selesai. Membaca candle yang belum ditutup sama saja dengan membaca kalimat yang belum selesai ditulis.

## Rumus body, sumbu, dan range

Agar pembacaan Anda objektif, ukur setiap bagian candle dengan angka. Ini rumus yang saya pakai:

- **Body** = |Close − Open|
- **Sumbu atas** = High − nilai terbesar antara Open dan Close
- **Sumbu bawah** = nilai terkecil antara Open dan Close − Low
- **Range** = High − Low
- **Porsi body** = Body ÷ Range × 100%

Perbedaan antara **body** dan **range** ini penting. Banyak pemula menyebut sebuah candle "besar" hanya karena body-nya panjang, padahal candle dengan body kecil bisa saja punya range yang lebar karena sumbunya panjang. Range menunjukkan seberapa jauh harga bergerak; body menunjukkan seberapa jauh harga *bertahan* bergerak sampai periode ditutup.

## Contoh cara membaca candlestick pada XAUUSD

Berikut empat candle H1 dengan angka ilustrasi. Semua hasil sudah saya cek dengan perhitungan kode dan dibulatkan ke dua desimal.

| Candle | Open | High | Low | Close | Arah | Body | Sumbu atas | Sumbu bawah | Range | Porsi body |
|---|---|---|---|---|---|---|---|---|---|---|
| A | 2.650,00 | 2.668,40 | 2.647,20 | 2.665,80 | Bullish | 15,80 | 2,60 | 2,80 | 21,20 | 74,5% |
| B | 2.665,80 | 2.667,10 | 2.652,30 | 2.654,60 | Bearish | 11,20 | 1,30 | 2,30 | 14,80 | 75,7% |
| C | 2.654,60 | 2.657,90 | 2.641,00 | 2.656,90 | Bullish | 2,30 | 1,00 | 13,60 | 16,90 | 13,6% |
| D | 2.656,90 | 2.671,50 | 2.655,80 | 2.657,40 | Bullish | 0,50 | 14,10 | 1,10 | 15,70 | 3,2% |

Cara membacanya:

- **Candle A**: body mengisi sekitar tiga perempat range dan sumbunya pendek. Selama jam itu, harga bergerak naik dan sebagian besar kenaikan bertahan sampai penutupan.
- **Candle B**: kebalikannya. Body bearish mengisi 75,7% range, artinya penurunan bertahan sampai akhir jam.
- **Candle C**: harga sempat turun sampai 2.641,00, tetapi ditutup di 2.656,90, dekat dengan open. Sumbu bawahnya (13,60) hampir enam kali panjang body. Ini menunjukkan harga rendah sempat ditolak dalam periode itu.
- **Candle D**: harga sempat naik sampai 2.671,50 tetapi kembali ke dekat open. Sumbu atas 14,10 dengan body hanya 0,50. Harga tinggi ditolak.

Perhatikan bahwa candle C dan D sama-sama "hijau", tetapi ceritanya sangat berbeda. Inilah alasan warna saja tidak cukup.

## Bentuk candle yang perlu dikenali pemula

Nama-nama pola candlestick jumlahnya puluhan. Untuk tahap awal, cukup kenali beberapa bentuk dasar ini berdasarkan proporsinya:

### Candle dengan body dominan

Body mengisi sebagian besar range, seperti candle A dan B. Sering disebut *marubozu* bila sumbunya hampir tidak ada. Bentuk ini menunjukkan satu sisi pasar menguasai periode tersebut.

### Doji

Body sangat kecil dibanding range, sehingga open dan close hampir sama. Doji menggambarkan keraguan: harga bergerak, tetapi akhirnya kembali ke titik awal.

### Hammer dan shooting star

- **Hammer**: sumbu bawah panjang (umumnya minimal dua kali body), body kecil di bagian atas range, sumbu atas pendek. Candle C memenuhi bentuk ini.
- **Shooting star**: kebalikannya, sumbu atas panjang dengan body kecil di bagian bawah range. Candle D mendekati bentuk ini, bahkan dengan body yang hampir seperti doji.

Penting: bentuk candle hanya *menggambarkan* apa yang terjadi selama satu periode. Ia bukan ramalan. Hammer yang muncul di tengah tren turun yang kuat bisa saja diikuti candle bearish berikutnya. Karena itu, baca candle bersama konteksnya: posisi terhadap level penting seperti [pivot point](/artikel/cara-menghitung-pivot-point), timeframe yang lebih besar, dan jadwal berita.

## Kesalahan umum saat membaca candlestick

Berikut kesalahan yang dulu juga saya lakukan:

1. **Memutuskan dari candle yang belum ditutup.** Tunggu periode selesai sebelum menilai bentuknya.
2. **Membaca satu candle tanpa konteks.** Satu candle adalah satu kalimat; Anda perlu membaca paragrafnya.
3. **Mengabaikan timeframe.** Candle M5 dan candle D1 dengan bentuk sama memiliki bobot informasi yang berbeda. Range candle M5 jauh lebih kecil sehingga lebih mudah dipengaruhi spread.
4. **Mengabaikan jam dan berita.** Candle di sekitar rilis data penting bisa memiliki sumbu sangat panjang dalam hitungan detik. Cek jadwal dengan [kalender ekonomi](/artikel/cara-membaca-kalender-ekonomi) sebelum menafsirkan candle yang tidak biasa.
5. **Menganggap nama pola sebagai sinyal.** Nama pola memudahkan komunikasi, bukan menjamin arah harga berikutnya.

## Dari membaca candle ke merencanakan risiko

Manfaat paling praktis dari membaca candle bagi saya adalah menentukan **di mana ide trading dianggap salah**. Sumbu panjang menandai harga yang sudah dicoba dan ditolak, sehingga sering dipakai sebagai acuan stop loss.

Contoh latihan dengan candle C (bukan sinyal):

- Entry ilustrasi di close candle C: **2.656,90**
- Stop loss di bawah low candle C dengan penyangga $1,50: 2.641,00 − 1,50 = **2.639,50**
- Jarak stop loss = 2.656,90 − 2.639,50 = **$17,40**

Pada kontrak XAUUSD standar, 1 lot = 100 troy ons, sehingga pergerakan $1 bernilai sekitar $100 per lot (selalu cek spesifikasi kontrak di platform Anda).

- Modal contoh $5.000, risiko 1% = **$50**
- Lot = 50 ÷ (17,40 × 100) = 0,0287 → dibulatkan **ke bawah** menjadi **0,02 lot**
- Risiko aktual = 0,02 × 17,40 × 100 = **$34,80**

Perhatikan: sumbu panjang membuat jarak stop loss lebar, sehingga lot harus lebih kecil. Ini sering dilupakan pemula yang tetap memakai lot yang sama di setiap posisi. Pembahasan lebih dalam ada di artikel [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd), dan Anda bisa menghitung lot dengan cepat memakai [kalkulator lot gratis](/alat/kalkulator-lot).

## Kesimpulan

Cara membaca candlestick dimulai dari empat harga: open, high, low, dan close. Dari situ Anda bisa menghitung body, sumbu atas, sumbu bawah, dan range, lalu melihat seberapa besar porsi body dibanding range. Angka-angka ini jauh lebih jujur daripada sekadar melihat warna hijau atau merah.

Gunakan candle untuk memahami apa yang sudah terjadi dan untuk menentukan di mana rencana Anda gagal, bukan untuk meramal harga. Gabungkan dengan konteks, tunggu candle ditutup, dan sesuaikan lot dengan jarak stop loss. Jika Anda ingin belajar analisa teknikal dan manajemen risiko secara bertahap dari dasar, silakan ikuti Academy gratis di Doktor Trader dengan [mendaftar di sini](/daftar).

## Pertanyaan yang sering diajukan

### Timeframe apa yang paling baik untuk belajar membaca candlestick?

Untuk belajar, mulai dari H1, H4, atau D1. Candle di timeframe ini memiliki range lebih lebar sehingga bentuknya lebih mudah dibaca dan tidak terlalu dipengaruhi spread dibanding M1 atau M5.

### Apakah sumbu candle lebih penting daripada body?

Keduanya saling melengkapi. Body menunjukkan pergerakan yang bertahan sampai penutupan, sedangkan sumbu menunjukkan area harga yang sempat dicapai lalu ditolak. Membaca keduanya bersama range memberi gambaran paling lengkap.

### Apakah candlestick bisa dipakai di semua instrumen?

Bisa. Logika OHLC sama untuk forex, emas, indeks, maupun saham. Yang berbeda adalah ukuran pergerakan dan nilai per poin, jadi hitungan lot harus disesuaikan dengan spesifikasi kontrak masing-masing instrumen.
