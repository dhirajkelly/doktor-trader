---
title: "Risiko Trading Saat News: Cara Atur Lot dan Stop Loss XAUUSD"
slug: risiko-trading-saat-news
meta_title: Risiko Trading Saat News High Impact | Doktor Trader
meta_description: "Trading saat news seperti NFP dan CPI bisa membuat spread melebar dan stop loss tereksekusi lebih jauh. Pelajari cara hitung lot dari skenario terburuk."
focus_keyword: trading saat news
category: Manajemen Risiko
tags: [trading saat news, nfp, manajemen risiko, xauusd, slippage]
excerpt: Saat news besar, risiko Anda bisa melebihi angka yang tertulis di rencana. Pelajari cara menghitung lot dari skenario terburuk sebelum rilis data.
---

Salah satu pelajaran termahal saya datang dari satu malam rilis data tenaga kerja Amerika. Stop loss sudah terpasang, ukuran lot terasa wajar, dan saya yakin kerugian maksimal sudah terkunci. Ternyata harga emas melompat, posisi tertutup jauh dari level stop loss, dan kerugian hari itu hampir dua kali lipat dari rencana. Sejak itu saya memperlakukan **trading saat news** sebagai situasi risiko yang berbeda, bukan sekadar "volatilitas sedikit lebih tinggi".

Artikel ini membahas apa yang terjadi di pasar ketika data berdampak tinggi dirilis, kenapa stop loss tidak selalu tereksekusi tepat di levelnya, dan cara menghitung ukuran lot dari skenario terburuk. Semua angka di sini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi dan bukan sinyal.

## Apa yang terjadi di pasar saat news berdampak tinggi

Rilis data besar seperti Non-Farm Payrolls (NFP), inflasi CPI, atau keputusan suku bunga The Fed bisa mengubah ekspektasi pasar dalam hitungan detik. Dampaknya ke posisi Anda biasanya datang dari empat hal:

- **Likuiditas menipis menjelang rilis.** Penyedia likuiditas bisa menarik penawaran sesaat sebelum angka keluar, sehingga harga yang tersedia menjadi lebih sedikit.
- **Spread melebar.** Selisih harga bid dan ask bisa beberapa kali lebih lebar dari biasanya. Akibatnya biaya masuk dan keluar ikut membesar.
- **Slippage.** Order dieksekusi di harga berikutnya yang tersedia, bukan di harga yang Anda minta. Ini berlaku juga untuk stop loss, yang pada dasarnya adalah order pasar yang aktif ketika levelnya tersentuh. Penjelasan lengkapnya ada di [apa itu slippage dalam trading](/artikel/apa-itu-slippage-dalam-trading).
- **Whipsaw.** Harga bisa bergerak tajam ke satu arah, lalu berbalik dalam beberapa menit. Stop loss kena, kemudian harga kembali ke arah analisa Anda.

Poin pentingnya: stop loss membatasi risiko dalam kondisi normal, tetapi tidak menjamin harga eksekusi saat pasar melompat.

### Kenapa posisi sell lebih sensitif terhadap spread

Di MT4 dan MT5, chart umumnya menampilkan harga bid. Posisi buy ditutup di harga bid, sedangkan posisi sell ditutup di harga ask. Ketika spread melebar tajam, harga ask bisa menyentuh stop loss posisi sell walaupun garis bid di chart belum sampai ke level tersebut. Inilah yang sering membuat trader merasa "stop loss saya kena padahal harga tidak sampai", padahal penyebabnya spread yang melebar.

## Data yang perlu Anda tandai di kalender

Tidak semua berita perlu diperlakukan sama. Untuk XAUUSD dan pair dolar AS, data berikut termasuk yang paling sering memicu pergerakan besar:

| Data | Penerbit | Catatan jadwal |
|---|---|---|
| Non-Farm Payrolls (laporan tenaga kerja) | Bureau of Labor Statistics AS | Umumnya Jumat pertama setiap bulan, pukul 08.30 waktu New York |
| Inflasi CPI | Bureau of Labor Statistics AS | Pertengahan bulan, pukul 08.30 waktu New York |
| Keputusan suku bunga FOMC | The Federal Reserve | Delapan kali setahun, sesuai kalender The Fed |

Pukul 08.30 waktu New York setara 20.30 WIB ketika AS memakai waktu standar (sekitar November sampai Maret) dan 19.30 WIB ketika AS memakai waktu musim panas. Jadwal bisa bergeser, jadi selalu cek tanggal dan jam di kalender ekonomi minggu itu. Cara membacanya ada di artikel [cara membaca kalender ekonomi](/artikel/cara-membaca-kalender-ekonomi).

## Tiga sikap yang bisa Anda pilih sebelum rilis

Sebelum data keluar, putuskan sikap Anda dengan kepala dingin, bukan saat harga sudah bergerak. Ada tiga pilihan yang masuk akal:

1. **Tidak membuka posisi baru.** Anda cukup menunggu setelah rilis sampai spread kembali ke kisaran normalnya. Ini pilihan paling sederhana, terutama untuk pemula.
2. **Tetap trading, tetapi lot diperkecil.** Ukuran lot dihitung dari skenario terburuk, bukan dari jarak stop loss saja. Caranya ada di bagian berikutnya.
3. **Mengamankan posisi yang sudah terbuka.** Pilihannya bisa menutup sebagian, menutup seluruhnya, atau memindahkan stop loss ke titik impas jika posisi sudah cukup jauh dalam keadaan untung. Pastikan aturan ini sudah tertulis di trading plan Anda.

Yang perlu dihindari adalah pilihan keempat yang tidak tertulis: tetap memegang posisi besar tanpa rencana sambil berharap data sesuai keinginan Anda.

## Contoh hitungan: lot dari skenario terburuk

Misalkan (contoh ilustrasi) saldo akun Anda $1.000 dan Anda memakai [aturan risiko 1 persen](/artikel/aturan-risiko-1-persen), jadi batas rugi per transaksi adalah $10. Pada XAUUSD dengan ukuran kontrak umum 100 oz per lot, pergerakan harga $1 bernilai $100 untuk 1 lot, atau $1 untuk 0,01 lot. Selalu cek spesifikasi kontrak di akun Anda sendiri.

Rencana Anda memakai stop loss sejauh $5 dari harga entry. Dalam kondisi normal:

**Lot = risiko ($) ÷ (jarak SL × 100) = 10 ÷ (5 × 100) = 0,02 lot**

Sekarang bayangkan rilis NFP. Stop loss bisa tereksekusi lebih jauh dari levelnya karena spread melebar dan slippage. Berikut perbandingan kerugian untuk 0,02 lot dan 0,01 lot:

| Skenario (contoh) | Jarak keluar efektif | Rugi 0,02 lot | Rugi 0,01 lot |
|---|---|---|---|
| Normal, SL tereksekusi tepat | $5,00 | $10,00 (1,0%) | $5,00 (0,5%) |
| Eksekusi meleset ringan +$1,20 | $6,20 | $12,40 (1,24%) | $6,20 (0,62%) |
| Eksekusi meleset berat +$4,20 | $9,20 | $18,40 (1,84%) | $9,20 (0,92%) |
| Lonjakan ekstrem +$15,00 | $20,00 | $40,00 (4,0%) | $20,00 (2,0%) |

Dengan 0,02 lot, risiko yang di atas kertas 1% bisa menjadi hampir 2%, atau bahkan 4% jika harga melompat jauh. Itu yang terjadi pada saya dulu.

### Rumus lot berbasis skenario terburuk

Jika Anda tetap ingin trading saat news, tambahkan perkiraan eksekusi meleset ke jarak stop loss:

**Lot = risiko ($) ÷ ((jarak SL + perkiraan meleset) × 100)**

Dengan perkiraan meleset $4,20: 10 ÷ ((5 + 4,20) × 100) = 0,0109 lot. Karena lot minimum biasanya 0,01, bulatkan ke bawah menjadi 0,01 lot. Hasilnya, skenario berat masih berada di bawah $10.

Angka $4,20 di sini hanya contoh. Perkiraan yang lebih jujur bisa Anda ambil dari catatan sendiri: berapa jauh stop loss Anda meleset pada rilis data sebelumnya. Untuk menghitung lot dengan cepat, gunakan [kalkulator lot gratis](/alat/kalkulator-lot) dan masukkan jarak stop loss yang sudah ditambah perkiraan meleset.

## Checklist sebelum rilis news

Simpan checklist ini dan jalankan sekitar satu jam sebelum data berdampak tinggi:

- Cek kalender ekonomi: data apa, jam berapa dalam WIB, dan dampaknya ke mata uang apa.
- Hitung total risiko semua posisi terbuka, bukan hanya posisi terakhir.
- Pastikan setiap posisi punya stop loss. Posisi tanpa stop loss saat news adalah risiko tanpa batas yang jelas.
- Cek margin level. Lonjakan harga ditambah spread melebar bisa mendekatkan akun ke margin call. Sisakan ruang margin yang cukup.
- Putuskan sikap: tidak trading, lot diperkecil, atau amankan posisi. Tulis di jurnal sebelum rilis.
- Hindari memasang pending order yang terlalu dekat dengan harga sesaat sebelum rilis, karena bisa terpicu oleh lonjakan sesaat lalu langsung berbalik.

## Kesalahan yang sering terjadi saat trading news

Beberapa pola ini pernah saya alami sendiri:

- **Menganggap stop loss sebagai jaminan harga.** Stop loss adalah instruksi, bukan garansi eksekusi.
- **Menebak angka data.** Arah harga setelah rilis tidak hanya ditentukan oleh angka utama, tetapi juga revisi data sebelumnya, komponen lain, dan ekspektasi pasar. Data yang "bagus" tidak otomatis membuat harga bergerak ke arah yang Anda bayangkan.
- **Masuk karena takut ketinggalan.** Candle panjang setelah rilis memancing keinginan untuk ikut. Masuk di tengah spread lebar berarti biaya masuk Anda juga besar.
- **Menambah posisi setelah kena stop loss.** Setelah whipsaw, dorongan untuk "membalas" pasar sangat kuat. Batas kerugian harian membantu menghentikan siklus ini.

**Tonton juga:** [Bukan Untung Berapa, Tapi Rugi Berapa? 3 Pertanyaan Sebelum Entry Trading](https://www.youtube.com/watch?v=BcpsX3VNVrU)

## Kesimpulan

Trading saat news bukan larangan mutlak, tetapi situasi dengan aturan risiko yang berbeda. Spread bisa melebar, slippage bisa terjadi, dan stop loss bisa tereksekusi lebih jauh dari levelnya. Karena itu, ukuran lot sebaiknya dihitung dari skenario terburuk, bukan dari jarak stop loss saja. Jika ragu, pilihan paling aman adalah menunggu sampai spread kembali normal.

Kalau Anda ingin membangun kebiasaan manajemen risiko ini secara bertahap, mulai dari menghitung lot sampai menyusun rencana trading, pelajari modul gratis di Academy Doktor Trader. Anda bisa [daftar gratis di sini](/daftar) dan belajar dengan tempo Anda sendiri.

## Pertanyaan yang sering diajukan

### Apakah sebaiknya tidak trading sama sekali saat news?

Tidak ada aturan tunggal. Untuk pemula, tidak membuka posisi baru menjelang dan sesaat setelah rilis data besar adalah pilihan paling sederhana. Trader yang tetap aktif sebaiknya memperkecil lot dan menghitung risiko dari skenario terburuk.

### Berapa lama spread biasanya kembali normal setelah rilis?

Tidak ada angka pasti karena tergantung kondisi pasar dan akun. Cara paling jujur adalah mengamati spread langsung di terminal Anda: tunggu sampai kembali ke kisaran biasanya sebelum membuka posisi.

### Apakah pending order aman dipasang sebelum news?

Pending order tetap dieksekusi sebagai order pasar ketika terpicu, sehingga bisa terkena slippage. Jika tetap dipakai, pastikan ukuran lot sudah memperhitungkan kemungkinan eksekusi meleset.
