---
title: "Apa Itu Swap dalam Trading? Arti, Cara Hitung, dan Contohnya"
slug: apa-itu-swap-dalam-trading
meta_title: Apa Itu Swap dalam Trading? Cara Hitung | Doktor Trader
meta_description: "Apa itu swap dalam trading: biaya atau kredit menginap posisi, cara membacanya di MT5, contoh hitungan XAUUSD, dan kapan swap mulai menggerus hasil Anda."
focus_keyword: apa itu swap dalam trading
category: Fundamental
tags: [swap, biaya trading, istilah trading, xauusd, mt5]
excerpt: Swap adalah biaya atau kredit untuk posisi yang menginap. Pelajari cara membacanya di MT5 dan menghitungnya sebelum menahan posisi berhari-hari.
---

Dulu saya pernah menahan posisi emas hampir dua minggu karena yakin harga akan berbalik. Harga memang akhirnya kembali ke titik masuk, tetapi saldo saya tetap berkurang. Penyebabnya bukan spread, bukan juga komisi, melainkan baris kecil di riwayat transaksi bernama **swap**. Kalau Anda masih bertanya **apa itu swap dalam trading**, artikel ini menjawabnya secara praktis: apa artinya, dari mana asalnya, cara membacanya di MT5, dan cara menghitungnya sebelum Anda memutuskan menahan posisi lebih dari satu hari.

Swap jarang dibahas di materi pemula, padahal untuk trader yang suka menahan posisi, biaya ini bisa lebih besar daripada spread.

## Apa itu swap dalam trading

Swap (sering juga disebut *rollover* atau biaya menginap) adalah penyesuaian yang dikenakan pada posisi yang **masih terbuka saat melewati waktu rollover harian** di server broker. Kalau posisi Anda ditutup sebelum waktu itu, tidak ada swap sama sekali.

Swap bisa bernilai:

- **Negatif**: saldo Anda dipotong.
- **Positif**: saldo Anda mendapat kredit.
- **Nol**: pada instrumen atau jenis akun tertentu.

Nilainya berbeda untuk posisi buy (*swap long*) dan posisi sell (*swap short*), dan bisa berubah dari waktu ke waktu. Karena itu, angka swap yang saya pakai di artikel ini semuanya **contoh**, bukan angka aktual instrumen mana pun.

## Dari mana swap berasal

Di pasar forex, setiap posisi pada dasarnya berarti meminjam satu mata uang untuk membeli mata uang lain. Masing-masing mata uang punya tingkat suku bunga. Selisih suku bunga kedua mata uang itulah dasar perhitungan swap, lalu broker menambahkan biaya administrasinya sendiri.

Logikanya sederhana:

- Jika Anda membeli mata uang dengan bunga lebih tinggi dan menjual mata uang dengan bunga lebih rendah, swap **cenderung** lebih menguntungkan.
- Jika sebaliknya, swap cenderung negatif.
- Karena ada biaya broker, sangat mungkin kedua arah (buy maupun sell) sama-sama negatif.

Untuk **XAUUSD**, emas tidak memberikan bunga seperti mata uang. Swap-nya dipengaruhi biaya pendanaan dolar dan faktor pasar emas, ditambah biaya broker. Hasilnya tidak bisa ditebak dari teori saja. Satu-satunya cara yang benar adalah melihat spesifikasi kontrak di akun Anda sendiri.

Inilah alasan swap masuk ke ranah fundamental: ketika suku bunga bank sentral berubah, besaran swap ikut bisa berubah. Kalau Anda belum terbiasa memantau jadwal keputusan suku bunga, baca dulu [cara membaca kalender ekonomi](/artikel/cara-membaca-kalender-ekonomi).

## Cara melihat swap di MT5

Anda tidak perlu menebak. MT5 menampilkan angka swap untuk setiap instrumen:

1. Buka jendela **Market Watch**.
2. Klik kanan simbol, misalnya XAUUSD, lalu pilih **Specification**.
3. Cari baris **Swap type**, **Swap long**, **Swap short**, dan hari pengenaan swap tiga kali lipat (*3-days swap*).

Yang perlu diperhatikan:

- **Swap type** menentukan satuan angkanya. Yang paling umum adalah *in points* (dalam poin). Ada juga yang dalam mata uang deposit atau dalam persen per tahun.
- **Swap long** berlaku untuk posisi buy, **swap short** untuk posisi sell.
- **Hari swap tiga kali lipat** ada karena pasar tutup di akhir pekan, tetapi posisi tetap "menginap" selama Sabtu dan Minggu. Biaya akhir pekan itu ditagihkan sekaligus pada satu hari kerja. Pada banyak instrumen hari itu adalah Rabu, tetapi selalu cek di spesifikasi akun Anda.

Setelah posisi melewati rollover, swap juga terlihat di kolom **Swap** pada tab Trade dan di riwayat transaksi.

## Cara menghitung swap: rumus dan contoh

Untuk swap tipe poin, rumusnya:

**Swap per rollover = nilai swap (poin) × nilai 1 poin per lot × ukuran lot**

### Contoh 1: XAUUSD

Asumsi (semua contoh):

- Ukuran kontrak 100 ons per 1 lot.
- 1 poin = 0,01 harga. Maka 1 poin pada 1 lot = 100 × 0,01 = **$1**.
- Swap long contoh: **−40 poin**.
- Ukuran posisi: **0,10 lot**.

Swap per rollover = −40 × $1 × 0,10 = **−$4**.

Kalau posisi menginap lebih lama, biaya ini bertambah. Ingat bahwa satu rollover dalam seminggu dihitung tiga kali.

| Lama menahan posisi (contoh) | Jumlah hari swap | Total swap 0,10 lot |
|---|---|---|
| 1 rollover biasa | 1 | −$4 |
| 1 rollover di hari swap tiga kali lipat | 3 | −$12 |
| 4 rollover, satu di antaranya tiga kali lipat | 6 | −$24 |
| 8 rollover, dua di antaranya tiga kali lipat | 12 | −$48 |

Sekarang bandingkan dengan rencana risiko. Misalkan modal $1.000 dan Anda membatasi risiko 2% per posisi, yaitu $20. Menahan posisi 0,10 lot selama sekitar dua minggu dengan swap contoh di atas memakan $48, lebih dari dua kali risiko yang Anda rencanakan, **bahkan kalau harga tidak bergerak sama sekali**. Itulah yang terjadi pada saya dulu.

### Contoh 2: EURUSD

Asumsi (contoh):

- 1 lot = 100.000 unit, harga 5 digit, 1 poin = 0,00001. Maka 1 poin pada 1 lot = **$1**.
- Swap long contoh: **−6,5 poin**.
- Ukuran posisi: **0,50 lot**.

Swap per rollover = −6,5 × $1 × 0,50 = **−$3,25**.

Perhatikan bahwa nilai 1 poin per lot berbeda antar instrumen. Kalau Anda ragu, cek di spesifikasi kontrak atau gunakan [kalkulator lot gratis](/alat/kalkulator-lot) untuk melihat nilai pergerakan harga pada ukuran lot Anda.

## Kapan swap mulai menjadi masalah

Swap kecil per malam terasa sepele. Masalah muncul pada situasi berikut:

- **Posisi rugi yang terus ditahan.** Ini kombinasi paling berbahaya: kerugian harga ditambah swap yang menumpuk setiap hari. Kalau kebiasaan ini disertai menambah posisi, risikonya berlipat. Saya membahasnya di [bahaya averaging down](/artikel/bahaya-averaging-down-trading).
- **Lot besar.** Swap berbanding lurus dengan lot. Lot dua kali lipat berarti swap dua kali lipat.
- **Target kecil dengan waktu tahan lama.** Kalau target Anda hanya beberapa dolar tetapi posisi bisa menginap seminggu, swap bisa menghabiskan sebagian besar hasilnya.
- **Tidak dicatat.** Banyak trader hanya mencatat harga masuk dan keluar, sehingga tidak sadar berapa total swap yang sudah dibayar dalam sebulan.

## Langkah praktis mengelola swap

Swap bukan sesuatu yang perlu ditakuti, tetapi perlu dihitung. Berikut kebiasaan yang saya pakai:

1. **Tentukan gaya trading Anda.** Jika Anda trader intraday yang menutup posisi sebelum rollover, swap hampir tidak relevan. Jika Anda swing trader, swap adalah bagian dari biaya.
2. **Cek spesifikasi sebelum entry**, bukan setelah posisi terbuka. Lihat swap long, swap short, dan hari swap tiga kali lipat.
3. **Hitung perkiraan swap untuk rencana lama tahan.** Masukkan ke rencana trading bersama spread dan komisi.
4. **Bandingkan dengan risiko per posisi.** Jika perkiraan swap sudah mendekati jumlah yang Anda siap rugikan, pertimbangkan ulang lot atau rencana tahan posisi.
5. **Waspadai hari swap tiga kali lipat** jika posisi tidak perlu dibawa melewati hari itu.
6. **Catat swap di jurnal.** Tambahkan kolom swap agar hasil bersih Anda terlihat jujur. Formatnya bisa mengikuti panduan [cara membuat jurnal trading](/artikel/cara-membuat-jurnal-trading).

## Pertanyaan yang sering diajukan

### Apakah swap dikenakan kalau saya menutup posisi di hari yang sama?

Tidak, selama posisi ditutup sebelum waktu rollover server broker. Swap hanya dikenakan pada posisi yang masih terbuka saat rollover terjadi.

### Kenapa swap buy dan swap sell keduanya negatif?

Karena selain selisih suku bunga, ada biaya yang ditambahkan broker. Pada banyak instrumen, biaya ini membuat kedua arah sama-sama negatif. Angka pastinya selalu ada di spesifikasi kontrak.

### Apakah swap bisa berubah?

Bisa. Swap mengikuti kondisi suku bunga dan kebijakan broker, jadi angka yang Anda lihat bulan lalu belum tentu sama dengan hari ini. Biasakan mengecek ulang sebelum merencanakan posisi jangka lebih panjang.

## Kesimpulan

Jadi, **apa itu swap dalam trading**? Swap adalah biaya atau kredit untuk posisi yang menginap melewati rollover, dihitung dari selisih suku bunga ditambah biaya broker. Angkanya bisa dilihat di spesifikasi MT5 dan dihitung dengan rumus sederhana: nilai swap × nilai poin × lot. Swap bukan alasan untuk tidak menahan posisi, tetapi harus masuk ke rencana risiko Anda, terutama jika Anda cenderung menahan posisi rugi.

Kalau Anda ingin belajar menghitung seluruh biaya dan risiko trading secara terstruktur, mulai dari lot, stop loss, sampai jurnal, ikuti Academy gratis di Doktor Trader. Anda bisa [daftar di sini](/daftar) dan mulai dari modul pertama.

*Artikel ini bersifat edukasi, bukan ajakan untuk membuka atau menutup posisi tertentu. Trading forex dan emas memiliki risiko tinggi.*
