---
title: "Cara Open Posisi di MT5 untuk Pemula: Langkah, Cek Risiko, Close"
slug: cara-open-posisi-di-mt5
meta_title: Cara Open Posisi di MT5 untuk Pemula | Doktor Trader
meta_description: "Cara open posisi di MT5 langkah demi langkah: jendela New Order, harga bid dan ask, cek risiko sebelum klik, contoh hitungan XAUUSD, hingga close sebagian."
focus_keyword: cara open posisi di mt5
category: Panduan Pemula
tags: [mt5, pemula, order, xauusd, manajemen risiko]
excerpt: Membuka posisi di MT5 hanya butuh beberapa klik. Pelajari langkahnya, arti bid dan ask, cek risiko sebelum klik, dan cara menutup posisi dengan benar.
---

Order pertama saya di MetaTrader dulu terjadi karena salah klik. Saya ingin melihat-lihat jendela order, menekan tombol yang salah, dan tiba-tiba ada posisi terbuka tanpa stop loss dengan lot yang tidak pernah saya hitung. Untungnya kerugiannya kecil, tetapi pelajarannya besar: **cara open posisi di MT5** itu sendiri mudah, yang sulit adalah memastikan setiap angka di jendela order sudah Anda putuskan sebelum jari menekan tombol.

Artikel ini membahas langkah membuka posisi di MT5 versi desktop, arti harga bid dan ask, daftar cek risiko sebelum klik, contoh hitungan XAUUSD yang bisa Anda periksa ulang, dan cara menutup posisi penuh maupun sebagian. Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi. Sebaiknya latih semua langkah ini di akun demo terlebih dahulu.

## Sebelum membuka posisi: pahami bid, ask, dan spread

Di Market Watch MT5, setiap simbol menampilkan dua harga:

- **Bid**: harga ketika Anda menjual. Posisi sell dibuka di bid, dan posisi buy ditutup di bid.
- **Ask**: harga ketika Anda membeli. Posisi buy dibuka di ask, dan posisi sell ditutup di ask.
- **Spread**: selisih ask dan bid. Inilah alasan posisi baru langsung terlihat minus sedikit begitu dibuka.

Contoh: bid XAUUSD 4.000,00 dan ask 4.000,30 (contoh). Spread-nya 0,30. Kalau Anda membuka buy 0,02 lot di 4.000,30, posisi itu dinilai dengan harga bid, sehingga floating awalnya sekitar −0,30 × 100 × 0,02 = **−$0,60**. Itu bukan kesalahan platform, melainkan biaya spread. Pembahasan lengkapnya ada di artikel [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

Satu hal yang sering terlewat: grafik MT5 secara bawaan menampilkan harga bid. Garis ask bisa ditampilkan lewat pengaturan chart (Properties, lalu centang opsi untuk menampilkan garis ask). Ini penting karena stop loss posisi sell dipicu oleh harga ask, bukan bid.

## Langkah membuka posisi di MT5 desktop

Berikut alur paling dasar memakai jendela New Order.

1. **Pilih simbol** di Market Watch, misalnya XAUUSD. Nama simbol bisa sedikit berbeda antar akun, jadi pastikan Anda memilih yang benar.
2. **Buka jendela order** dengan klik kanan pada simbol lalu pilih *New Order*, atau tekan tombol F9.
3. **Isi Volume** sesuai lot yang sudah Anda hitung, bukan angka bawaan yang muncul di kolom.
4. **Isi Stop Loss dan Take Profit** dalam bentuk harga. Jangan biarkan kolom stop loss kosong.
5. **Periksa tipe eksekusi.** Untuk eksekusi langsung, tipe yang muncul biasanya *Market Execution* atau *Instant Execution*, tergantung pengaturan akun. Jika Anda ingin masuk di harga tertentu yang belum tersentuh, gunakan pending order. Bedanya dijelaskan di [perbedaan buy limit dan buy stop](/artikel/perbedaan-buy-limit-dan-buy-stop).
6. **Klik Buy atau Sell** sesuai rencana yang sudah tertulis, lalu periksa tab *Trade* di jendela Toolbox untuk memastikan posisi, lot, stop loss, dan take profit tercatat dengan benar.

### Bagaimana dengan One Click Trading?

MT5 juga menyediakan panel One Click Trading di pojok chart. Fitur ini memang cepat, tetapi justru karena cepat, ia rawan salah klik seperti pengalaman saya di atas. Untuk pemula, saya menyarankan tetap memakai jendela New Order sampai Anda benar-benar terbiasa, karena jendela itu memaksa Anda melihat lot dan stop loss sebelum eksekusi.

## Cek risiko sebelum klik: contoh hitungan XAUUSD

Lot seharusnya berasal dari jarak stop loss dan batas risiko, bukan dari perasaan. Rumus dasarnya untuk XAUUSD dengan ukuran kontrak 100 ounce per lot (cek spesifikasi di akun Anda):

**Lot = risiko dalam dolar ÷ (jarak stop loss × 100)**

Contoh berikut memakai angka ilustrasi:

| Komponen | Nilai contoh |
|---|---|
| Modal | $1.000 |
| Risiko per posisi | 1% = $10 |
| Jarak stop loss | 4,00 |
| Lot hasil rumus | 10 ÷ (4 × 100) = 0,025 |
| Lot yang dipakai (dibulatkan ke bawah) | 0,02 |
| Risiko aktual di stop loss | 4 × 100 × 0,02 = $8 |
| Target 8,00 dari entry | 8 × 100 × 0,02 = $16 |

Kenapa dibulatkan ke bawah? Karena membulatkan ke atas (0,03 lot) membuat risiko menjadi $12, melewati batas 1% yang sudah Anda tetapkan. Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot) untuk mengecek hitungan ini, dan penjelasan rumusnya ada di [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd).

### Contoh pengisian untuk posisi buy dan sell

Dengan bid 4.000,00 dan ask 4.000,30 (contoh):

- **Buy**: entry di ask 4.000,30. Stop loss 3.996,30 dan take profit 4.008,30. Stop loss terpicu saat harga **bid** turun ke 3.996,30.
- **Sell**: entry di bid 4.000,00. Stop loss 4.004,00 dan take profit 3.992,00. Stop loss terpicu saat harga **ask** naik ke 4.004,00.

Pada kedua contoh, kerugian di stop loss adalah sekitar $8 dan target sekitar $16, belum termasuk slippage, komisi, dan swap. Perhatikan bahwa pada posisi sell, spread yang melebar bisa membuat ask menyentuh stop loss meskipun garis bid di chart belum sampai ke sana.

## Daftar cek lima detik sebelum menekan tombol

Saya menempelkan daftar ini di samping layar selama bertahun-tahun setelah margin call:

- Apakah simbol yang dipilih sudah benar?
- Apakah volume sama dengan lot hasil hitungan, bukan angka bawaan?
- Apakah stop loss sudah terisi, dan berada di sisi yang benar (di bawah entry untuk buy, di atas entry untuk sell)?
- Apakah total risiko semua posisi terbuka masih dalam batas harian Anda?
- Apakah ada rilis data berdampak besar dalam waktu dekat yang bisa melebarkan spread?

Jika satu saja jawabannya "belum yakin", jangan klik dulu. Tidak membuka posisi adalah keputusan yang sah.

## Cara menutup posisi: penuh dan sebagian

Posisi yang terbuka tampil di tab *Trade* pada Toolbox. Untuk menutupnya:

1. **Tutup penuh**: klik ikon silang di ujung baris posisi, atau klik dua kali baris posisi untuk membuka jendela order lalu pilih tombol close.
2. **Tutup sebagian**: klik dua kali baris posisi, ubah kolom volume menjadi lot yang ingin ditutup, lalu tekan tombol close. Sisa lot tetap terbuka dengan stop loss dan take profit yang sama.

Contoh tutup sebagian: posisi buy 0,02 lot dari 4.000,30, dan bid sekarang 4.005,30 (contoh). Menutup 0,01 lot mengunci hasil sekitar (4.005,30 − 4.000,30) × 100 × 0,01 = **$5**. Sisa 0,01 lot masih berjalan. Jika stop loss awal belum digeser, risiko sisa posisi menjadi 4 × 100 × 0,01 = $4.

### Kesalahan yang sering terjadi saat close

- Menekan tombol yang membuka posisi baru berlawanan arah, bukan menutup posisi lama. Pada akun hedging, ini justru menambah posisi dan biaya.
- Lupa bahwa posisi buy ditutup di bid dan posisi sell ditutup di ask, sehingga hasil akhir sedikit berbeda dari yang terlihat di chart.
- Menggeser stop loss menjauh saat harga mendekatinya. Kebiasaan ini mengubah risiko $8 menjadi angka yang tidak pernah Anda rencanakan.

**Tonton juga:** [Setup MT5 dari Nol: 5 Setting Sebelum Order Pertama](https://www.youtube.com/watch?v=-WPkPWB0JUY)

## Kesimpulan

Cara open posisi di MT5 secara teknis hanya beberapa klik: pilih simbol, buka New Order, isi volume, stop loss, dan take profit, lalu eksekusi. Nilai sebenarnya ada pada apa yang terjadi sebelum klik, yaitu memahami bid dan ask, menghitung lot dari jarak stop loss, dan memeriksa bahwa risiko masih dalam batas. Latih alur ini di akun demo sampai terasa membosankan, karena membosankan berarti Anda tidak lagi bergantung pada perasaan.

Jika Anda ingin belajar dasar-dasarnya secara berurutan, mulai dari platform sampai manajemen risiko, Academy di Doktor Trader bisa Anda ikuti gratis. Anda bisa [mendaftar di sini](/daftar).

## Pertanyaan yang sering diajukan

### Kenapa posisi saya langsung minus begitu dibuka?

Karena posisi buy dibuka di ask tetapi dinilai di bid, dan sebaliknya untuk sell. Selisihnya adalah spread. Floating minus kecil di awal itu normal dan besarnya bisa dihitung dari spread dikali ukuran posisi.

### Apakah boleh membuka posisi tanpa stop loss lalu memasangnya nanti?

Secara teknis bisa, tetapi selama stop loss belum terpasang, risiko posisi tidak terbatas. Lebih aman mengisi stop loss langsung di jendela New Order. Jika Anda menemui pesan *Invalid stops*, periksa jarak minimum stop loss di spesifikasi simbol pada akun Anda.

### Berapa lot yang cocok untuk order pertama?

Tidak ada angka yang cocok untuk semua orang. Lot ditentukan dari modal, persentase risiko yang Anda pilih, dan jarak stop loss. Hitung dengan rumus di atas atau kalkulator lot, dan untuk awal latihlah di akun demo.
