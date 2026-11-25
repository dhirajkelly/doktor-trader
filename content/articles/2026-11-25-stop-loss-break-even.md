---
title: "Stop Loss Break Even: Kapan Dipindah dan Cara Menghitungnya"
slug: stop-loss-break-even
meta_title: "Stop Loss Break Even: Kapan Dipindah | Doktor Trader"
meta_description: "Stop loss break even bukan sekadar geser SL ke harga entry. Pelajari kapan memindahkannya, cara hitung komisi, contoh XAUUSD, dan langkahnya di MT5."
focus_keyword: stop loss break even
category: Manajemen Risiko
tags: [stop loss, break even, manajemen risiko, xauusd, mt5]
excerpt: Memindahkan stop loss ke break even terasa aman, tetapi ada biayanya. Pelajari kapan melakukannya, cara menghitung titik impas, dan contoh XAUUSD.
---

Dulu, setiap kali posisi saya untung beberapa dolar, tangan saya langsung menggeser stop loss ke harga entry. Rasanya lega: "Sekarang saya tidak mungkin rugi." Yang tidak saya sadari, kebiasaan itu juga membuat banyak posisi saya tertutup di nol tepat sebelum harga melanjutkan arah yang saya analisa. **Stop loss break even** adalah alat manajemen risiko yang berguna, tetapi hanya jika dipakai dengan aturan, bukan dengan rasa cemas.

Artikel ini membahas apa itu stop loss break even, kenapa titik impas sebenarnya tidak selalu sama dengan harga entry, kapan sebaiknya dipindahkan, biaya tersembunyi jika dipindah terlalu cepat, dan cara melakukannya di MT5. Semua harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu stop loss break even

Stop loss break even (sering disingkat BE) adalah tindakan memindahkan stop loss dari posisi awalnya ke sekitar harga pembukaan posisi. Tujuannya: jika harga berbalik, posisi tertutup tanpa rugi berarti.

Contoh sederhana: Anda membuka buy XAUUSD di 4.000,00 dengan stop loss di 3.990,00. Setelah harga naik ke 4.010,00, Anda menggeser stop loss ke 4.000,00. Risiko awal $10 per ounce kini menjadi sekitar nol.

Perlu dipahami, break even mengubah **risiko**, bukan **arah pasar**. Harga tidak peduli di mana stop loss Anda berada. Yang berubah hanyalah apa yang terjadi pada akun Anda jika harga kembali ke entry.

## Titik impas sebenarnya: hitung komisi dan swap

Banyak orang mengira stop loss di harga entry berarti hasilnya tepat nol. Untuk harga saja, itu benar. Pada posisi buy, hasil dihitung dari harga bid saat ditutup dikurangi harga pembukaan. Jika stop loss ada di harga pembukaan, selisihnya nol. Spread sudah Anda bayar saat posisi dibuka, sehingga tidak menambah kerugian lagi di titik ini.

Namun ada dua biaya lain yang tidak ikut terhitung di harga:

- **Komisi**, pada jenis akun yang mengenakan komisi per lot.
- **Swap**, jika posisi menginap melewati pergantian hari.

Rumus untuk mencari titik impas yang sudah menutup biaya (posisi buy):

**SL impas = harga entry + (total biaya ÷ (lot × ukuran kontrak))**

Untuk posisi sell, tanda plus diganti minus. Pada banyak akun, 1 lot XAUUSD setara 100 troy ounce, tetapi selalu cek spesifikasi simbol di MT5 Anda.

### Contoh hitungan

Misalkan posisi buy 0,02 lot di 4.000,00, dan akun contoh mengenakan komisi $7 per lot pulang-pergi.

| Komponen | Hitungan | Hasil |
|---|---|---|
| Komisi posisi | 0,02 × $7 | $0,14 |
| Nilai $1 pergerakan | 0,02 × 100 oz | $2 |
| Geser yang dibutuhkan | $0,14 ÷ $2 | $0,07 |
| SL impas | 4.000,00 + 0,07 | 4.000,07 |

Angkanya kecil, tetapi jika Anda sering menutup posisi di "BE", biaya kecil yang tidak tertutup akan menumpuk. Satu hal lagi: stop loss dieksekusi sebagai order pasar. Saat harga melompat, misalnya ketika rilis data atau setelah pasar dibuka kembali, eksekusi bisa terjadi di harga yang lebih buruk. Ini dibahas lebih jauh di artikel tentang risiko gap.

## Kapan sebaiknya memindahkan stop loss ke break even

Tidak ada satu aturan yang benar untuk semua orang. Yang penting, aturannya ditulis sebelum posisi dibuka. Berikut beberapa pilihan aturan yang bisa Anda uji di akun demo.

### 1. Berdasarkan kelipatan risiko (R)

R adalah jarak dari entry ke stop loss awal. Contoh aturan: "Pindahkan ke BE setelah harga bergerak +1R." Jika stop loss awal berjarak $10, BE dilakukan saat harga sudah $10 di atas entry. Aturan ini mudah diukur dan mudah dicatat di jurnal. Jika Anda belum terbiasa berpikir dalam R, baca dulu [cara menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio).

### 2. Berdasarkan struktur harga

Pada posisi buy, tunggu sampai terbentuk *higher low* baru di atas harga entry, lalu letakkan stop loss sedikit di bawah titik rendah itu. Kelebihannya, stop loss mengikuti logika chart, bukan angka acak. Kadang posisi stop loss yang baru justru sudah di atas entry, sehingga posisi terkunci sedikit untung.

### 3. Setelah partial close

Anda menutup sebagian posisi di target pertama, lalu menggeser stop loss sisa posisi ke BE. Cara ini dibahas dengan contoh angka di bagian berikutnya.

### Kapan sebaiknya *tidak* dipindah

- Saat harga baru bergerak sedikit, masih dalam jarak gerak normal candle di timeframe Anda.
- Hanya karena Anda gugup atau melihat satu candle merah.
- Ketika aturan di trading plan tidak menyebutkannya.

## Biaya tersembunyi: memindahkan terlalu cepat

Break even mengubah sebagian posisi rugi menjadi nol, tetapi juga mengubah sebagian posisi yang seharusnya untung menjadi nol. Tabel berikut memakai empat jalur harga **rekaan** untuk memperlihatkan pertukaran itu. Ini bukan statistik, hanya ilustrasi logika.

Asumsi: buy 0,04 lot di 4.000,00, stop loss awal 3.990,00 (risiko $40), target 4.020,00 (+2R, potensi $80). Hasil dihitung sebelum biaya.

| Jalur harga (contoh) | BE di +0,5R (4.005) | BE di +1R (4.010) | Tidak pindah BE |
|---|---|---|---|
| Naik ke 4.005, turun ke 4.000, lalu ke 4.020 | $0 | +$80 | +$80 |
| Naik ke 4.012, turun ke 4.000, lalu ke 4.020 | $0 | $0 | +$80 |
| Naik ke 4.006, lalu turun ke 3.990 | $0 | −$40 | −$40 |
| Naik ke 4.011, lalu turun ke 3.990 | $0 | $0 | −$40 |

Perhatikan: semakin cepat BE dipasang, semakin sering hasilnya nol, baik pada posisi yang akan rugi maupun yang akan untung. Mana yang lebih baik untuk Anda hanya bisa dijawab dengan mencatat hasil aturan Anda sendiri di jurnal, bukan dengan perasaan.

## Kombinasi partial close dan break even

Cara ini bertujuan menyeimbangkan rasa aman dan ruang gerak harga. Contoh dengan modal $4.000 dan risiko 1% ($40):

1. Buy 0,04 lot di 4.000,00, stop loss 3.990,00, target 4.020,00. Ukuran lot ini didapat dari $40 ÷ ($10 × 100 oz). Anda bisa mengeceknya dengan [kalkulator lot gratis](/alat/kalkulator-lot).
2. Harga mencapai 4.010,00 (+1R). Tutup 0,02 lot: untung $10 × 0,02 × 100 = **$20**.
3. Geser stop loss sisa 0,02 lot ke titik impas (misalnya 4.000,07 jika ada komisi seperti contoh di atas).

Hasil yang mungkin dari titik ini (sebelum biaya):

| Skenario | Sisa 0,02 lot | Total | Dalam R |
|---|---|---|---|
| Harga kembali ke entry | $0 | +$20 | +0,5R |
| Harga mencapai 4.020,00 | +$40 | +$60 | +1,5R |
| Tanpa partial, langsung target | — | +$80 | +2R |
| Tanpa partial, kena stop awal | — | −$40 | −1R |

Partial close dan BE memotong potensi maksimal dari 2R menjadi 1,5R, sebagai ganti hasil minimal +0,5R setelah target pertama tercapai. Itu bukan lebih baik atau lebih buruk, melainkan pilihan yang perlu konsisten. Jika ingin stop loss terus mengikuti harga setelah BE, lanjutkan dengan [trailing stop](/artikel/cara-menggunakan-trailing-stop-xauusd).

## Cara memindahkan stop loss ke break even di MT5

Di MT5 desktop:

1. Buka jendela **Toolbox**, tab **Trade**.
2. Klik dua kali posisi yang ingin diubah, atau klik kanan lalu pilih **Modify or Delete**.
3. Isi kolom **Stop Loss** dengan harga impas yang sudah Anda hitung.
4. Klik tombol **Modify**.

Anda juga bisa menyeret garis SL langsung di chart, asalkan opsi tampilan level trading aktif. Di aplikasi MT5 ponsel, tekan lama posisi di tab Trade, pilih **Modify**, ubah stop loss, lalu konfirmasi. Panduan dasar memasang stop loss ada di artikel [cara pasang stop loss di MT5](/artikel/cara-pasang-stop-loss-di-mt5).

Kesalahan yang perlu dihindari:

- Salah ketik angka, sehingga stop loss justru menjauh dari harga.
- Lupa bahwa broker punya jarak minimal stop level; jika terlalu dekat dengan harga saat ini, perubahan akan ditolak.
- Memindahkan stop loss kembali ke bawah setelah BE karena "memberi ruang". Itu sama dengan menambah risiko di tengah jalan.

## Kesimpulan

Stop loss break even melindungi modal setelah harga bergerak sesuai analisa, tetapi bukan alat gratis. Hitung titik impas yang sudah menutup komisi dan swap, tentukan pemicunya (kelipatan R, struktur harga, atau partial close) sebelum entry, lalu catat hasilnya di jurnal agar Anda tahu dampaknya pada sistem Anda sendiri. Kedisiplinan pada aturan lebih penting daripada aturan mana yang dipilih.

Jika Anda ingin belajar manajemen risiko secara bertahap, mulai dari ukuran lot sampai pengelolaan posisi, Academy di Doktor Trader bisa diakses gratis. Anda cukup [mendaftar di sini](/daftar).

## Pertanyaan yang sering diajukan

### Apakah posisi di break even berarti tanpa risiko sama sekali?

Tidak sepenuhnya. Saat harga melompat (gap) atau terjadi slippage ketika volatilitas tinggi, stop loss bisa tereksekusi di harga yang lebih buruk dari level yang Anda pasang. Komisi dan swap juga tetap berlaku jika belum dihitung.

### Apakah sebaiknya selalu memindahkan stop loss ke break even?

Tergantung aturan dan gaya trading Anda. Memindahkan terlalu cepat bisa membuat posisi sering tertutup di nol. Uji aturan Anda di akun demo dan catat hasilnya sebelum memakainya di akun riil.

### Berapa jauh harga harus bergerak sebelum dipindah ke BE?

Tidak ada angka universal. Dua pilihan yang mudah diukur adalah setelah +1R atau setelah terbentuk struktur harga baru. Yang penting, angka itu tertulis di trading plan dan tidak berubah karena emosi.
