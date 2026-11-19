---
title: "Cara Menghitung Risk Reward Ratio Trading: Rumus dan Contoh"
slug: cara-menghitung-risk-reward-ratio
meta_title: Cara Menghitung Risk Reward Ratio | Doktor Trader
meta_description: Cara menghitung risk reward ratio dalam trading forex dan emas, lengkap dengan rumus, contoh hitungan XAUUSD, efek spread, dan tabel persentase impas.
focus_keyword: cara menghitung risk reward ratio
category: Manajemen Risiko
tags: [risk reward ratio, manajemen risiko, xauusd, stop loss]
excerpt: Risk reward ratio membandingkan potensi rugi dan potensi untung sebelum entry. Pelajari rumus, contoh XAUUSD, efek spread, dan batasannya.
---

Dulu saya sering membuka posisi hanya karena "feeling" arah harga, lalu baru memikirkan stop loss dan target setelah posisi berjalan. Hasilnya, kerugian saya sering lebih besar daripada keuntungan, walaupun cukup sering tebakan arahnya benar. Salah satu kebiasaan yang membantu saya keluar dari pola itu adalah memahami **cara menghitung risk reward ratio** sebelum menekan tombol order.

Risk reward ratio (sering disingkat RR atau R:R) bukan alat untuk menebak arah pasar. Ia adalah alat ukur: berapa yang siap Anda pertaruhkan, dan berapa yang secara wajar bisa Anda harapkan dari satu posisi. Di artikel ini kita bahas rumusnya, contoh hitungan pada XAUUSD, pengaruh spread, tabel persentase impas, dan kesalahan yang sering terjadi saat memakainya.

## Apa itu risk reward ratio?

Risk reward ratio adalah perbandingan antara **jarak ke stop loss** (risiko) dan **jarak ke take profit** (potensi hasil) dari titik entry. Jika Anda mempertaruhkan $10 untuk peluang mendapatkan $20, rasionya 1:2.

Ada dua cara penulisan yang beredar, dan keduanya sering membingungkan pemula:

- **Risk : Reward** (misalnya 1:2) — angka pertama risiko, angka kedua potensi hasil.
- **Reward ÷ Risk** (misalnya "R = 2") — satu angka yang menunjukkan berapa kali lipat potensi hasil dibanding risiko.

Di artikel ini saya memakai format 1:R, dengan R = reward ÷ risk. Jadi 1:2 berarti R = 2, dan 1:0,5 berarti potensi hasil hanya setengah dari risiko.

## Rumus risk reward ratio

Rumusnya sederhana. Untuk posisi **buy**:

- Risiko = harga entry − harga stop loss
- Potensi hasil = harga take profit − harga entry
- R = potensi hasil ÷ risiko

Untuk posisi **sell**, arahnya terbalik:

- Risiko = harga stop loss − harga entry
- Potensi hasil = harga entry − harga take profit
- R = potensi hasil ÷ risiko

Perhatikan bahwa rumus ini memakai **jarak harga**, bukan ukuran lot. Ukuran lot memengaruhi berapa dolar yang dipertaruhkan, tetapi rasionya tetap sama karena lot mengalikan risiko dan potensi hasil dengan angka yang sama.

## Contoh menghitung risk reward ratio pada XAUUSD

Semua angka di bawah ini adalah **contoh ilustrasi**, bukan rekomendasi transaksi. Asumsikan spesifikasi kontrak yang umum dipakai, yaitu 1 lot XAUUSD = 100 troy ounce, sehingga pergerakan $1 bernilai $100 per 1 lot atau $1 per 0,01 lot. Selalu cek spesifikasi kontrak di platform Anda sendiri.

### Contoh posisi buy

- Entry: 4.000,00
- Stop loss: 3.992,00
- Take profit: 4.016,00

Hitungannya:

1. Risiko = 4.000,00 − 3.992,00 = $8
2. Potensi hasil = 4.016,00 − 4.000,00 = $16
3. R = 16 ÷ 8 = 2, jadi rasionya **1:2**

Sekarang hubungkan dengan modal. Misalkan modal $1.000 dan Anda membatasi risiko 1% per posisi, yaitu $10. Ukuran lot ideal = $10 ÷ ($8 × 100) = 0,0125 lot. Karena lot minimum biasanya bertingkat 0,01, bulatkan **ke bawah** menjadi 0,01 lot. Dengan 0,01 lot, risiko riilnya $8 dan potensi hasilnya $16. Rasio tetap 1:2. Untuk hitungan lot yang lebih detail, baca [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd) atau gunakan [kalkulator lot gratis](/alat/kalkulator-lot).

### Contoh posisi sell

- Entry: 4.050,00
- Stop loss: 4.056,00
- Take profit: 4.038,00

Risiko = 4.056,00 − 4.050,00 = $6. Potensi hasil = 4.050,00 − 4.038,00 = $12. R = 12 ÷ 6 = 2, juga **1:2**.

## Jangan lupa efek spread

Hitungan risk reward di grafik bisa terlihat rapi, tetapi sering melupakan satu biaya nyata: spread. Pada posisi buy, Anda membeli di harga ask dan posisi ditutup di harga bid. Jika level stop loss dan take profit Anda tentukan dari grafik bid, maka harga entry riil Anda lebih tinggi sebesar spread.

Pakai contoh posisi buy di atas dengan spread ilustrasi $0,30:

| Komponen | Tanpa spread | Dengan spread $0,30 |
|---|---|---|
| Risiko per ounce | $8,00 | $8,30 |
| Potensi hasil per ounce | $16,00 | $15,70 |
| R (hasil ÷ risiko) | 2,00 | ±1,89 |

Selisihnya terlihat kecil, tetapi semakin dekat stop loss Anda, semakin besar porsi spread terhadap risiko. Pada stop loss $2, spread $0,30 sudah 15% dari jarak risiko. Inilah alasan scalping dengan stop loss sangat sempit terasa jauh lebih berat daripada yang terlihat di atas kertas. Biaya lain seperti komisi dan swap juga sebaiknya dimasukkan jika berlaku di akun Anda.

## Hubungan risk reward dengan persentase posisi untung

Risk reward ratio tidak bisa dinilai sendirian. Ia selalu berpasangan dengan seberapa sering posisi Anda mencapai take profit. Secara matematis, persentase posisi untung minimum agar impas (sebelum biaya) adalah:

**Persentase impas = 1 ÷ (1 + R) × 100%**

| Rasio risk : reward | R | Persentase posisi untung minimum untuk impas |
|---|---|---|
| 1:0,5 | 0,5 | 66,7% |
| 1:1 | 1 | 50,0% |
| 1:1,5 | 1,5 | 40,0% |
| 1:2 | 2 | 33,3% |
| 1:3 | 3 | 25,0% |

Tabel ini hanya hitungan matematika, bukan gambaran hasil strategi apa pun. Contoh ilustrasi: andaikan dari 10 posisi dengan risiko $8 dan rasio 1:2, ada 4 yang mencapai take profit dan 6 yang kena stop loss. Hasil bersihnya 4 × $16 − 6 × $8 = +$16. Jika hanya 3 yang mencapai take profit, hasilnya 3 × $16 − 7 × $8 = −$8. Selisih satu posisi saja sudah mengubah hasil, sehingga mencatat hasil Anda sendiri di jurnal trading jauh lebih penting daripada mengejar rasio tertentu.

## Kesalahan umum saat memakai risk reward ratio

Beberapa kesalahan berikut membuat RR menjadi angka yang menipu. Sebagian pernah saya lakukan sendiri sebelum terkena margin call:

1. **Memasang take profit asal jauh demi rasio cantik.** Rasio 1:5 tidak berarti apa-apa jika target berada di balik level resisten kuat yang jarang tertembus. Target harus masuk akal secara teknikal.
2. **Menggeser stop loss setelah entry.** Begitu stop loss dijauhkan, risiko membesar dan rasio yang Anda hitung di awal tidak berlaku lagi.
3. **Menempatkan stop loss terlalu dekat agar R terlihat besar.** Stop loss yang tidak memberi ruang wajar untuk volatilitas lebih mudah tersentuh. Pelajari penempatan yang logis di [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd).
4. **Mengabaikan spread, komisi, dan slippage**, terutama di sekitar rilis data ekonomi.
5. **Menilai RR tanpa melihat drawdown.** Strategi dengan rasio besar bisa mengalami rangkaian kerugian beruntun yang panjang. Pahami dampaknya lewat [rumus drawdown trading](/artikel/rumus-drawdown-trading).

## Langkah praktis sebelum membuka posisi

Gunakan urutan sederhana ini setiap kali akan entry:

1. Tentukan level stop loss berdasarkan struktur harga, bukan berdasarkan berapa dolar yang ingin Anda pertaruhkan.
2. Tentukan target yang realistis, misalnya level support/resisten terdekat berikutnya.
3. Hitung R dengan rumus di atas, lalu kurangi dengan perkiraan spread.
4. Jika R terlalu kecil menurut aturan rencana trading Anda, lewati setup tersebut. Tidak membuka posisi juga sebuah keputusan.
5. Hitung ukuran lot dari batas risiko per posisi (misalnya 1% modal), bulatkan ke bawah.
6. Catat rencana itu di jurnal sebelum entry, lalu evaluasi setelah posisi selesai.

## Kesimpulan

Memahami cara menghitung risk reward ratio membantu Anda menilai setiap posisi secara jujur sebelum uang dipertaruhkan. Rumusnya mudah, yaitu potensi hasil dibagi risiko, tetapi nilainya baru berarti jika stop loss dan target ditempatkan secara logis, biaya seperti spread ikut dihitung, dan hasilnya dicatat untuk dievaluasi. RR bukan jaminan untung; ia adalah bagian dari sistem manajemen risiko yang utuh.

Jika Anda ingin belajar manajemen risiko secara bertahap, mulai dari ukuran lot sampai jurnal trading, Academy di Doktor Trader bisa Anda ikuti gratis. Silakan [daftar di sini](/daftar) untuk mulai belajar.

## Pertanyaan yang sering diajukan

### Berapa risk reward ratio yang ideal?

Tidak ada satu angka ideal untuk semua orang. Rasio harus dinilai bersama persentase posisi untung dari strategi Anda sendiri, yang hanya bisa diketahui dari catatan jurnal. Sebagian trader menetapkan batas minimal tertentu, misalnya 1:1,5, sebagai aturan pribadi, tetapi itu keputusan rencana trading, bukan rumus pasti.

### Apakah ukuran lot memengaruhi risk reward ratio?

Tidak. Lot mengalikan risiko dan potensi hasil dengan angka yang sama, jadi rasionya tetap. Yang berubah adalah nominal dolar yang dipertaruhkan, dan itu diatur lewat batas risiko per posisi.

### Bolehkah menggeser take profit saat posisi berjalan?

Boleh, asalkan keputusan itu mengikuti aturan yang sudah Anda tulis sebelumnya, bukan karena emosi. Menggeser take profit lebih jauh tanpa alasan teknikal sering berujung posisi kembali ke titik entry atau bahkan menyentuh stop loss.
