---
title: "Cara Pasang Stop Loss di MT5: Langkah Lengkap untuk Pemula"
slug: cara-pasang-stop-loss-di-mt5
meta_title: Cara Pasang Stop Loss di MT5 untuk Pemula | Doktor Trader
meta_description: "Cara pasang stop loss di MT5: lewat jendela order, ubah posisi terbuka, dan geser garis di chart, plus arti Stops level dan contoh hitungan lot XAUUSD."
focus_keyword: cara pasang stop loss di mt5
category: Panduan Pemula
tags: [stop loss, mt5, panduan pemula, xauusd]
excerpt: Stop loss hanya melindungi akun kalau benar-benar terpasang. Pelajari tiga cara memasangnya di MT5 dan kenapa kadang muncul Invalid stops.
---

Salah satu posisi terburuk yang pernah saya ambil sebenarnya sudah punya rencana stop loss. Masalahnya, rencana itu hanya ada di kepala saya, tidak pernah saya ketik di platform. Saat harga bergerak cepat, saya ragu, menunda, dan akhirnya kerugian jauh melewati angka yang saya rencanakan. Sejak itu saya pegang satu prinsip: stop loss yang tidak terpasang sama dengan tidak punya stop loss. Artikel ini membahas **cara pasang stop loss di MT5** langkah demi langkah, dari jendela order sampai garis di chart, termasuk penyebab pesan *Invalid stops* yang sering membingungkan pemula.

Semua harga dan angka di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi. Tampilan menu bisa sedikit berbeda antara versi desktop, web, dan aplikasi ponsel.

## Kenapa stop loss harus dipasang di platform, bukan di kepala

Stop loss (SL) adalah perintah untuk menutup posisi secara otomatis ketika harga mencapai level tertentu yang merugikan. Fungsinya sederhana: membatasi kerugian satu posisi sesuai angka yang sudah Anda putuskan saat pikiran masih tenang.

Ada tiga alasan kenapa SL sebaiknya selalu terpasang di MT5, bukan hanya dicatat:

- **Anda tidak selalu di depan layar.** Koneksi putus, ponsel mati, atau Anda tertidur. Perintah SL yang terpasang tercatat pada posisi dan dieksekusi sesuai ketentuan pialang, tanpa menunggu Anda.
- **Emosi bekerja melawan Anda.** Saat posisi minus, otak cenderung mencari alasan untuk menunggu. Keputusan yang sudah diketik sebelumnya memotong perdebatan itu.
- **Ukuran lot bergantung pada SL.** Lot yang aman hanya bisa dihitung kalau jarak SL sudah pasti. Tanpa SL, Anda sebenarnya tidak tahu berapa yang sedang dipertaruhkan.

Satu catatan jujur: SL bukan jaminan harga keluar persis di level itu. Saat pasar bergerak sangat cepat atau membuka dengan gap, posisi bisa tertutup di harga yang lebih buruk (*slippage*). SL tetap jauh lebih baik daripada tanpa SL, tetapi jangan menganggapnya pagar yang mustahil ditembus.

Kalau Anda belum yakin di mana level SL yang masuk akal, baca dulu [cara menentukan stop loss XAUUSD](/artikel/cara-menentukan-stop-loss-xauusd). Artikel ini fokus pada sisi teknis memasangnya.

## Cara 1: Pasang stop loss saat membuka order baru

Ini cara paling aman karena posisi langsung terlindungi sejak detik pertama.

1. Buka chart simbol yang ingin Anda transaksikan, misalnya XAUUSD.
2. Tekan **F9** atau klik **New Order** di toolbar untuk membuka jendela order.
3. Pilih jenis eksekusi (Market Execution atau pending order) dan isi **Volume** (ukuran lot).
4. Isi kolom **Stop Loss** dengan harga level SL Anda. Kolom **Take Profit** boleh diisi juga bila Anda punya target.
5. Periksa sekali lagi: untuk posisi **buy**, SL harus di **bawah** harga masuk; untuk posisi **sell**, SL harus di **atas** harga masuk.
6. Klik **Buy** atau **Sell**.

Setelah posisi terbuka, lihat tab **Trade** di jendela Toolbox (tekan Ctrl+T bila belum tampil). Kolom S/L harus menunjukkan angka yang Anda isi. Kalau kosong, berarti SL belum terpasang.

## Cara 2: Tambah atau ubah stop loss pada posisi yang sudah terbuka

Kalau posisi terlanjur terbuka tanpa SL, atau Anda perlu menyesuaikan level:

1. Buka tab **Trade** di Toolbox.
2. Klik kanan posisi yang dimaksud, lalu pilih **Modify or Delete**. Klik dua kali pada posisi juga membuka jendela yang sama.
3. Isi harga baru di kolom **Stop Loss** (dan **Take Profit** bila perlu).
4. Klik tombol **Modify**.

Menurut panduan resmi MetaTrader 5, tombol Modify tetap tidak aktif sampai nilai SL dan TP memenuhi syarat. Syarat jarak ini ditentukan pialang dan tercantum di spesifikasi simbol, yang akan kita bahas di bagian berikutnya.

### Kebiasaan yang perlu dihindari

Fitur ubah posisi memudahkan Anda memindahkan SL. Kemudahan ini juga jebakan. Menggeser SL **menjauh** dari harga masuk saat posisi sedang minus berarti menaikkan risiko di tengah jalan, keputusan yang hampir selalu diambil karena emosi. Aturan sederhana yang saya pakai: SL hanya boleh digeser ke arah yang mengurangi risiko, tidak pernah sebaliknya.

## Cara 3: Geser garis stop loss langsung di chart

MT5 bisa menampilkan garis harga masuk, SL, dan TP di chart. Garis SL dapat diklik lalu diseret (drag) ke level baru, kemudian jendela modifikasi muncul agar Anda bisa memasukkan angka yang lebih presisi.

Agar fitur ini berjalan:

- Aktifkan opsi **Show trade levels** di menu **Tools → Options → Charts**.
- Pastikan opsi **Disable dragging of trade levels** tidak dicentang, karena opsi itu mematikan fitur seret garis.

Alternatif lain: klik kanan di chart pada level harga yang diinginkan, buka submenu **Trade**, lalu pilih perintah pasang Stop Loss yang muncul untuk posisi Anda. Cara chart ini praktis, tetapi rawan salah geser saat terburu-buru. Selalu cek angka akhirnya di tab Trade.

## Arti "Stops level" dan kenapa muncul Invalid stops

Pesan *Invalid stops* atau tombol Modify yang tidak bisa diklik biasanya punya satu dari beberapa penyebab berikut:

| Penyebab | Contoh | Solusi |
|---|---|---|
| Arah SL terbalik | Buy di 4.000,00 tetapi SL diisi 4.005,00 | Untuk buy, SL di bawah harga; untuk sell, di atas |
| Terlalu dekat dengan harga | Stops level 50 point, SL hanya 30 point dari harga | Jauhkan SL minimal sejauh Stops level |
| Format angka keliru | Mengetik 4000.5 pada simbol dua desimal sebagai 400050 | Ikuti jumlah digit yang tampil di harga |

**Stops level** adalah jarak minimum antara harga saat ini dan level SL/TP, dinyatakan dalam *point*. Pada XAUUSD dengan dua angka desimal, 1 point = 0,01, sehingga Stops level 50 point berarti jarak minimal $0,50. Nilainya berbeda di tiap pialang dan jenis akun, bahkan bisa 0. Cek di **Market Watch → klik kanan simbol → Specification**, pada baris *Stops level*.

Satu hal lagi yang sering terlewat: posisi buy ditutup di harga **Bid**, sedangkan posisi sell ditutup di harga **Ask**. Artinya SL posisi sell tersentuh ketika Ask mencapai level SL. Dengan spread contoh $0,30, SL sell di 4.006,00 tersentuh saat Bid yang Anda lihat di chart baru sekitar 4.005,70. Pembahasan lengkapnya ada di artikel [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).

## Contoh hitungan: dari level stop loss ke ukuran lot

Memasang SL tanpa menyesuaikan lot hanya separuh pekerjaan. Contoh berikut memakai asumsi umum 1 lot XAUUSD = 100 troy ounce, sehingga pergerakan $1 bernilai $100 per 1 lot. Cek spesifikasi kontrak di akun Anda sendiri.

**Contoh posisi buy**

- Modal: $1.000, risiko per posisi 1% = $10
- Harga masuk: 4.000,00, SL: 3.995,00, jarak SL = $5
- Lot = $10 ÷ ($5 × 100) = **0,02 lot**
- Kerugian bila SL tersentuh: 0,02 × 100 × $5 = **$10**

**Contoh posisi sell**

- Modal dan risiko sama: $10
- Harga masuk: 4.000,00, SL: 4.006,00, jarak SL = $6
- Lot hitungan = $10 ÷ ($6 × 100) = 0,0167 lot, dibulatkan **ke bawah** menjadi **0,01 lot**
- Kerugian bila SL tersentuh: 0,01 × 100 × $6 = **$6**, masih di bawah batas $10

Perhatikan aturan pembulatannya: selalu bulatkan lot ke bawah, karena membulatkan ke atas berarti risiko melewati batas yang Anda tetapkan. Rumus lengkapnya ada di [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd), atau pakai [kalkulator lot gratis](/alat/kalkulator-lot) agar tidak salah hitung.

## Checklist sebelum menekan Buy atau Sell

Biasakan memeriksa lima hal ini setiap kali membuka posisi:

1. Level SL sudah ditentukan dari struktur harga, bukan dari angka dolar yang "terasa nyaman".
2. Lot sudah dihitung dari jarak SL dan batas risiko per posisi.
3. Kolom Stop Loss di jendela order sudah terisi dengan arah yang benar.
4. Jarak SL memenuhi Stops level dan sudah memperhitungkan spread.
5. Setelah order masuk, kolom S/L di tab Trade menampilkan angka yang benar.

## Kesimpulan

Cara pasang stop loss di MT5 tidak sulit: isi kolom Stop Loss saat membuka order, ubah lewat **Modify or Delete** di tab Trade, atau seret garisnya di chart. Yang membuat SL benar-benar melindungi akun adalah kebiasaan di sekitarnya: menentukan level sebelum masuk, menghitung lot dari jarak SL, memeriksa Stops level dan spread, lalu tidak pernah menggeser SL menjauh saat posisi minus.

Kalau Anda ingin belajar manajemen risiko secara berurutan, dari ukuran lot sampai batas kerugian harian, ikuti Academy gratis di Doktor Trader. Materinya disusun untuk pemula dan bisa diakses setelah [mendaftar](/daftar).

## Pertanyaan yang sering diajukan

### Apakah cara pasang stop loss di MT5 versi ponsel sama?

Prinsipnya sama: kolom Stop Loss tersedia saat membuka order, dan posisi terbuka bisa diubah lewat menu modifikasi pada posisi tersebut. Letak tombolnya berbeda dengan versi desktop, jadi biasakan dulu di akun demo.

### Apakah stop loss tetap jalan kalau MT5 saya tutup?

Menurut panduan resmi MetaTrader 5, Stop Loss dijalankan di server, sehingga SL yang sudah tercatat pada posisi (terlihat di kolom S/L) tidak bergantung pada platform Anda tetap terbuka. Berbeda dengan trailing stop, yang dijalankan di platform Anda sendiri, sehingga hanya bekerja selama MT5 menyala dan terhubung.

### Berapa jarak stop loss yang ideal untuk emas?

Tidak ada satu angka yang cocok untuk semua kondisi. Jarak SL sebaiknya mengikuti struktur harga dan volatilitas, lalu lot yang menyesuaikan, bukan sebaliknya.
