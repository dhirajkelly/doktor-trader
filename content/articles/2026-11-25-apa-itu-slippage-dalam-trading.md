---
title: "Apa Itu Slippage dalam Trading: Penyebab dan Contoh Hitungan"
slug: apa-itu-slippage-dalam-trading
meta_title: "Apa Itu Slippage dalam Trading? | Doktor Trader"
meta_description: "Apa itu slippage dalam trading? Pelajari penyebabnya, dampaknya ke stop loss dan risk reward, contoh hitungan XAUUSD, dan cara mengendalikannya di MT5."
focus_keyword: apa itu slippage dalam trading
category: Fundamental
tags: [slippage, istilah trading, xauusd, manajemen risiko, mt5]
excerpt: Slippage adalah selisih harga order dan harga eksekusi. Pahami penyebabnya, hitung dampaknya ke risiko, dan cara mengendalikannya.
---

Saya masih ingat pertama kali melihat posisi emas saya tertutup beberapa dolar di bawah stop loss yang sudah saya pasang. Reaksi pertama saya: "Platformnya curang." Ternyata bukan. Saya baru saja berkenalan dengan slippage, dan saya belum pernah memasukkannya ke dalam hitungan risiko. Kalau Anda bertanya **apa itu slippage dalam trading**, jawaban singkatnya: selisih antara harga yang Anda minta dan harga yang benar-benar Anda dapat saat order dieksekusi.

Artikel ini membahas kenapa slippage terjadi, bagaimana ia mengubah risiko dan risk reward Anda (dengan hitungan XAUUSD yang bisa dicek ulang), serta langkah praktis untuk mengendalikannya. Semua harga di sini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu slippage dan kenapa bisa terjadi

Slippage adalah perbedaan antara harga order dan harga eksekusi. Jika Anda membeli di harga yang lebih tinggi dari yang direncanakan, atau menjual di harga yang lebih rendah, itu disebut **slippage negatif**. Sebaliknya, jika eksekusi lebih baik dari harga order, itu **slippage positif**.

Slippage bukan kesalahan teknis. Ia muncul karena harga bergerak dalam jeda antara saat order dikirim dan saat order diisi. Beberapa penyebab yang paling sering:

- **Pergerakan cepat saat rilis data ekonomi.** Menjelang dan sesaat setelah data penting, harga emas bisa melompat beberapa dolar dalam hitungan detik.
- **Likuiditas tipis.** Di jam sepi, jumlah penawaran di setiap level harga lebih sedikit, sehingga order bisa terisi di level berikutnya.
- **Gap harga.** Saat pasar dibuka kembali setelah tutup, harga pembukaan bisa jauh dari harga penutupan sebelumnya. Stop loss yang berada di dalam gap akan terisi di harga pertama yang tersedia.
- **Koneksi dan latensi.** Jeda dari perangkat Anda ke server menambah waktu tunggu, meskipun biasanya pengaruhnya lebih kecil dibanding tiga faktor di atas.

Perlu dibedakan juga antara slippage dan spread. Spread adalah selisih harga Bid dan Ask yang Anda bayar di setiap transaksi, dan bisa Anda lihat sebelum entry. Slippage baru terlihat setelah order tereksekusi. Keduanya sering melebar bersamaan saat pasar bergejolak. Penjelasan spread ada di artikel [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

## Jenis order mana yang bisa terkena slippage

Tidak semua order punya peluang slippage yang sama. Menurut dokumentasi MetaTrader 5, Buy Limit dieksekusi pada harga Ask yang sama atau lebih rendah dari harga order, sedangkan Buy Stop dieksekusi pada harga Ask yang sama atau lebih tinggi. Artinya:

| Jenis order | Perilaku harga eksekusi | Risiko slippage negatif |
|---|---|---|
| Market order (Buy/Sell langsung) | Diisi di harga pasar saat order diterima | Ada |
| Buy Stop / Sell Stop | Sama atau lebih buruk dari harga order | Ada, terutama saat harga melompat |
| Buy Limit / Sell Limit | Sama atau lebih baik dari harga order | Kecil, tetapi order bisa tidak terisi |
| Stop Loss | Posisi ditutup otomatis saat level tersentuh | Ada, terutama saat berita atau gap |
| Take Profit | Posisi ditutup saat level tersentuh | Umumnya kecil |

Mode eksekusi juga berperan. MT5 mengenal beberapa mode, antara lain Instant Execution dan Market Execution. Pada Instant Execution, jika harga yang Anda minta tidak diterima, server mengirim *requote* (penawaran harga baru). Pada Market Execution, mengirim order berarti Anda setuju dieksekusi di harga yang ditentukan saat itu, sehingga slippage bisa terjadi tanpa konfirmasi tambahan. Mode mana yang berlaku ditentukan pialang untuk setiap instrumen, jadi cek spesifikasi akun Anda.

Perbedaan perilaku Buy Limit dan Buy Stop dibahas lebih rinci di [perbedaan buy limit dan buy stop](/artikel/perbedaan-buy-limit-dan-buy-stop).

## Contoh hitungan: slippage pada stop loss XAUUSD

Mari pakai satu skenario sederhana. Untuk XAUUSD, ukuran kontrak umumnya 100 troy ounce per 1 lot, sehingga pergerakan $1 bernilai $100 per lot. Cek spesifikasi kontrak di akun Anda, karena bisa berbeda.

- Modal: $2.000
- Risiko per posisi: 1% = $20
- Jarak stop loss: $5
- Lot = $20 ÷ ($5 × 100) = **0,04 lot**, artinya setiap $1 pergerakan bernilai $4

Sekarang lihat apa yang terjadi jika stop loss terisi lebih buruk dari levelnya:

| Slippage pada SL | Kerugian aktual | % dari modal |
|---|---|---|
| $0 | $20,00 | 1,00% |
| $0,30 | $21,20 | 1,06% |
| $1,00 | $24,00 | 1,20% |
| $3,00 | $32,00 | 1,60% |
| $8,00 (misalnya gap) | $52,00 | 2,60% |

Slippage kecil hampir tidak terasa dalam satu transaksi. Tetapi slippage besar saat berita atau gap bisa membuat "risiko 1%" Anda menjadi lebih dari dua kali lipat. Inilah alasan saya selalu bilang: stop loss membatasi risiko, tetapi tidak menjamin harga keluar yang persis sama.

### Slippage juga menggerus risk reward

Slippage tidak hanya terjadi di stop loss. Misalkan Anda memasang Buy Stop di 4.000,00 (contoh) dengan stop loss 3.995,00 dan take profit 4.010,00. Rencananya risk reward 1:2. Karena harga bergerak cepat, order terisi di 4.000,80.

- Risiko berubah dari $5,00 menjadi $5,80 per ounce → $23,20 untuk 0,04 lot
- Potensi hasil berubah dari $10,00 menjadi $9,20 → $36,80
- Risk reward turun dari **1:2,00** menjadi **1:1,59**

Slippage $0,80 di entry mengubah kualitas setup cukup jauh. Jika ini terjadi berulang, ekspektasi sistem Anda pun ikut berubah, meskipun analisanya tidak salah.

## Cara memasukkan slippage ke dalam hitungan lot

Cara paling jujur adalah menambahkan cadangan slippage ke jarak stop loss saat menghitung lot:

**Lot = Risiko dalam dolar ÷ ((jarak SL + cadangan slippage) × 100)**

Dengan contoh di atas dan cadangan $1:

- Lot = $20 ÷ (($5 + $1) × 100) = 0,0333 → dibulatkan **ke bawah** menjadi 0,03 lot
- Jika SL terisi normal: rugi $15 (0,75%)
- Jika SL terisi dengan slippage $1: rugi $18 (0,90%)

Kedua skenario tetap di bawah batas 1%. Memang ukuran posisi jadi lebih kecil, tetapi itu harga yang wajar untuk risiko yang benar-benar terkendali. Selalu bulatkan lot ke bawah, jangan ke atas. Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot) lalu menambahkan cadangan slippage ke jarak stop loss sebelum memasukkannya.

Berapa cadangan yang pantas? Jangan menebak. Ambil dari data Anda sendiri, seperti dijelaskan di bagian berikut.

## Langkah praktis mengendalikan slippage

Slippage tidak bisa dihilangkan, tetapi bisa dikelola. Berikut langkah yang saya pakai:

1. **Catat harga rencana dan harga eksekusi.** Di jurnal, tulis harga yang Anda incar, lalu bandingkan dengan harga eksekusi di tab History MT5. Selisihnya adalah slippage Anda.
2. **Hitung rata-rata dan nilai terburuknya.** Setelah 20–30 transaksi, Anda punya gambaran nyata. Pakai nilai yang mendekati terburuk (bukan rata-rata) sebagai cadangan di rumus lot.
3. **Hindari entry di menit-menit rilis data besar.** Cek jadwalnya lebih dulu dengan panduan [cara membaca kalender ekonomi](/artikel/cara-membaca-kalender-ekonomi). Jika tetap ingin bertransaksi, kecilkan lot.
4. **Pilih jenis order sesuai tujuan.** Jika Anda ingin harga tertentu atau lebih baik, Limit lebih cocok. Jika Anda butuh kepastian masuk saat breakout, Stop atau market order lebih cocok, dengan konsekuensi slippage.
5. **Waspadai posisi yang dibiarkan saat pasar tutup.** Stop loss tidak melindungi dari gap. Kurangi ukuran posisi atau tutup sebelum akhir pekan jika risiko gap tidak sesuai rencana Anda.
6. **Perhatikan stabilitas koneksi.** Koneksi yang putus-putus menambah jeda eksekusi, terutama bagi yang sering entry dari ponsel.

### Kesalahan yang sering terjadi

- Menganggap slippage sebagai "kecurangan" lalu berpindah-pindah strategi, padahal masalahnya ada di ukuran lot dan waktu entry.
- Memasang stop loss sangat ketat di XAUUSD tanpa memperhitungkan spread dan slippage, sehingga posisi sering tertutup oleh gerakan kecil.
- Hanya menghitung risiko dari jarak stop loss di atas kertas, bukan dari kerugian aktual di riwayat transaksi.

## Pertanyaan yang sering diajukan

### Apakah slippage selalu merugikan?

Tidak. Slippage bisa positif, yaitu eksekusi di harga yang lebih baik dari order. Namun untuk perencanaan risiko, yang perlu Anda siapkan adalah skenario negatifnya.

### Apakah stop loss menjamin kerugian tidak melebihi rencana?

Tidak sepenuhnya. Stop loss menutup posisi saat level tersentuh, tetapi saat harga melompat atau terjadi gap, posisi ditutup di harga pertama yang tersedia. Karena itu cadangan slippage perlu masuk ke hitungan lot.

### Bagaimana cara tahu berapa slippage yang saya alami?

Bandingkan harga yang Anda rencanakan dengan harga eksekusi di riwayat transaksi MT5, lalu catat selisihnya di jurnal. Dari data itu Anda bisa menentukan cadangan yang realistis.

**Tonton juga:** [Buy Limit vs Buy Stop: Salah Pilih, SL Kena Duluan](https://www.youtube.com/watch?v=qMVXyrzgkoQ)

## Kesimpulan

Memahami **apa itu slippage dalam trading** membuat Anda berhenti menyalahkan platform dan mulai mengelola hal yang bisa dikendalikan: ukuran lot, waktu entry, dan jenis order. Slippage kecil tidak berarti banyak dalam satu transaksi, tetapi slippage besar saat berita atau gap bisa melipatgandakan risiko yang Anda kira sudah dibatasi. Masukkan cadangan slippage ke rumus lot, ukur slippage dari riwayat Anda sendiri, dan hindari menit-menit paling liar di pasar.

Jika Anda ingin mempelajari manajemen risiko dari dasar secara terstruktur, ikuti Academy gratis di Doktor Trader. Materinya membahas hitungan lot, stop loss, dan cara menjaga modal, langkah demi langkah. Anda bisa mulai dengan [mendaftar di sini](/daftar).
