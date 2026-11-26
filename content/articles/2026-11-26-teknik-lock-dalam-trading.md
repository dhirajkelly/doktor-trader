---
title: "Teknik Lock dalam Trading: Cara Kerja, Biaya, dan Risikonya"
slug: teknik-lock-dalam-trading
meta_title: Apa Itu Teknik Lock dalam Trading | Doktor Trader
meta_description: "Teknik lock dalam trading membekukan floating loss, bukan menghapusnya. Pahami cara kerjanya, biaya spread dan swap, plus contoh hitungan sebelum memakainya."
focus_keyword: teknik lock dalam trading
category: Fundamental
tags: [istilah trading, teknik lock, hedging, manajemen risiko]
excerpt: Lock terasa seperti menyelamatkan akun, padahal rugi hanya dibekukan dan keputusan ditunda. Ini hitungan jujurnya.
---

Salah satu kebiasaan yang ikut mengantar akun saya ke margin call adalah "mengunci" posisi yang sedang rugi. Rasanya aman: floating loss berhenti bertambah, dan saya tidak perlu menekan tombol cut loss. **Teknik lock dalam trading** adalah membuka posisi berlawanan dengan ukuran lot yang sama pada instrumen yang sama, misalnya posisi buy XAUUSD 0,10 lot dikunci dengan sell XAUUSD 0,10 lot. Istilah lainnya adalah hedging atau posisi terkunci.

Masalahnya, lock tidak menghapus kerugian. Lock hanya membekukannya, menambah biaya, dan menunda keputusan yang sebenarnya harus Anda ambil sekarang. Artikel ini membahas cara kerja lock, biaya yang sering terlupakan, contoh hitungan yang sudah dicek, dan kapan sebaiknya Anda memilih cut loss saja. Semua harga, spread, dan swap di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu teknik lock dan bagaimana cara kerjanya

Saat posisi buy dan sell dengan lot yang sama terbuka bersamaan pada satu instrumen, eksposur bersih Anda menjadi nol. Setiap dolar kenaikan harga menambah untung di posisi buy dan menambah rugi di posisi sell dengan jumlah yang sama. Hasilnya, total floating profit/loss praktis tidak bergerak lagi.

Ada syarat teknis yang perlu Anda ketahui:

- **Jenis akun di MT5.** MetaTrader 5 punya dua sistem pencatatan posisi yang ditetapkan per akun oleh pialang: *netting* dan *hedging*. Di akun netting hanya ada satu posisi per simbol, jadi order sell 0,10 lot terhadap buy 0,10 lot akan menutup posisi, bukan menguncinya. Lock hanya mungkin di akun hedging.
- **Margin posisi terkunci.** Di spesifikasi kontrak MT5 ada kolom *hedged margin*. Nilainya diatur pialang: ada yang tidak menarik margin tambahan untuk volume yang terkunci, ada yang menariknya sebagian atau penuh. Cek spesifikasi simbol di akun Anda sendiri sebelum berasumsi.
- **Masing-masing posisi tetap berdiri sendiri.** Kedua posisi punya stop loss, take profit, dan swap masing-masing.

Kalau Anda belum yakin perbedaan jenis order dan cara membuka posisi, pelajari dulu dasar-dasarnya sebelum memikirkan lock.

## Contoh hitungan: rugi yang dibekukan, bukan dihapus

Mari pakai contoh sederhana. Pada XAUUSD, 0,10 lot setara 10 troy ounce, sehingga setiap pergerakan $1 bernilai $10.

1. Anda buy 0,10 lot di harga 2.000,00 (contoh).
2. Harga turun ke 1.980,00 (bid). Floating loss posisi buy: (1.980 − 2.000) × 10 = **−$200**.
3. Anda membuka sell 0,10 lot di 1.980,00 untuk mengunci. Dengan spread contoh $0,30, posisi sell langsung minus $0,30 × 10 = **−$3**.
4. Total kerugian yang terkunci: **−$203**.

Sekarang lihat apa yang terjadi pada total posisi di berbagai harga selama lock masih terbuka:

| Harga bid (contoh) | P/L posisi buy | P/L posisi sell | Total |
|---|---|---|---|
| 1.950 | −$500 | +$297 | −$203 |
| 1.970 | −$300 | +$97 | −$203 |
| 1.980 | −$200 | −$3 | −$203 |
| 1.990 | −$100 | −$103 | −$203 |
| 2.010 | +$100 | −$303 | −$203 |

Totalnya tetap −$203 ke mana pun harga bergerak. Secara angka, kondisi ini hampir sama dengan cut loss di 1.980. Bedanya, cut loss selesai di situ, sedangkan lock masih terus memakan biaya.

### Biaya yang terus berjalan: swap

Swap dikenakan pada setiap posisi yang dibawa melewati pergantian hari, dan besarnya bisa berbeda untuk sisi buy dan sell. Dalam contoh ini anggap swap buy −$2,50 per malam dan swap sell −$1,00 per malam untuk 0,10 lot. Dalam kondisi seperti ini, kedua sisi sama-sama dibebani biaya. Setelah 10 malam, swap yang terkumpul (−$2,50 − $1,00) × 10 = **−$35**, sehingga total kerugian menjadi **−$238**, padahal harga sama sekali tidak memengaruhi hasil. Nilai swap sebenarnya berubah-ubah dan bisa positif di salah satu sisi, jadi selalu cek di spesifikasi akun. Penjelasan lengkapnya ada di [apa itu swap dalam trading](/artikel/apa-itu-swap-dalam-trading).

## Bagian tersulit: membuka kunci

Lock terasa nyaman sampai Anda harus membukanya. Untuk keluar dari lock, Anda harus menutup salah satu posisi, dan saat itu Anda kembali memegang posisi searah dengan risiko penuh. Artinya, Anda sekarang harus menebak arah dua kali: kapan menutup sisi pertama dan kapan menutup sisi kedua.

Lanjutkan contoh di atas. Setelah 10 malam harga berada di 1.970 (bid). Anda merasa harga sudah di dasar, lalu menutup posisi sell di harga ask 1.970,30. Hasil yang direalisasikan dari posisi sell: (1.980,00 − 1.970,30) × 10 = **+$97**. Posisi buy tetap terbuka.

- **Skenario A, harga lanjut turun ke 1.950.** Floating posisi buy menjadi −$500. Total: −$500 + $97 − $35 = **−$438**. Kerugian lebih dari dua kali lipat dibanding cut loss awal.
- **Skenario B, harga naik ke 1.990.** Floating posisi buy menjadi −$100. Total: −$100 + $97 − $35 = **−$38**.

Skenario B terlihat menarik, tetapi perhatikan: hasil itu datang dari tebakan arah yang kebetulan benar, bukan dari lock-nya. Lock sendiri tidak memperbaiki apa pun. Ia hanya mengubah satu keputusan sulit menjadi dua keputusan sulit, ditambah biaya selama menunggu. Pola ini mirip dengan jebakan [averaging down](/artikel/bahaya-averaging-down-trading): sama-sama menunda pengakuan bahwa analisa awal salah.

## Kenapa lock terasa menarik secara psikologis

Lock populer bukan karena hitungannya bagus, tetapi karena ia menghindarkan rasa sakit merealisasikan kerugian. Selama posisi masih terbuka, otak bisa berkata "belum rugi, masih bisa balik". Beberapa tanda bahwa Anda memakai lock untuk menghindari cut loss:

- Anda tidak punya rencana tertulis kapan dan di harga berapa lock akan dibuka.
- Anda membuka lock karena "feeling" harga sudah memantul, bukan karena aturan di trading plan.
- Anda tidak tahu berapa total swap yang sudah dibayar selama posisi terkunci.
- Posisi awal dibuka tanpa stop loss, sehingga lock menjadi pengganti stop loss.

Kalau beberapa tanda di atas terasa akrab, masalah utamanya ada di keengganan menerima rugi. Artikel [cara mengatasi takut cut loss](/artikel/cara-mengatasi-takut-cut-loss) membahas langkah praktis untuk itu.

## Alternatif yang lebih jujur daripada lock

Daripada mengunci posisi yang salah, susun proses yang membuat lock tidak dibutuhkan:

1. **Tentukan stop loss sebelum entry.** Stop loss menjawab pertanyaan "di harga berapa analisa saya terbukti salah". Kerugian di titik itu sudah Anda terima sejak awal.
2. **Hitung lot dari jarak stop loss.** Dengan risiko misalnya 1% dari modal per transaksi, kerugian saat stop loss tersentuh tetap kecil dan tidak perlu diselamatkan. Gunakan [kalkulator lot gratis](/alat/kalkulator-lot) agar hitungannya tidak meleset.
3. **Kalau ingin berbalik arah, tutup dulu posisi lama.** Membuka posisi baru berlawanan setelah cut loss adalah keputusan baru dengan analisa baru, stop loss baru, dan ukuran lot yang dihitung ulang.
4. **Kalau terpaksa sudah terkunci, buat aturan keluar tertulis.** Tentukan batas waktu dan level harga untuk menutup kedua posisi. Di akun hedging MT5 ada fungsi *Close By* yang menutup dua posisi berlawanan sekaligus sehingga Anda hanya membayar satu spread, bukan dua.

**Tonton juga:** [Margin Call Itu Bisa Dihitung: Anatomi Drawdown](https://www.youtube.com/watch?v=EtjOiYTds6U)

## Kesimpulan

Teknik lock dalam trading membekukan floating loss, bukan menghapusnya. Selama terkunci, Anda tetap membayar spread dan swap, mungkin menahan margin tambahan, dan pada akhirnya harus menebak arah dua kali untuk keluar. Dalam contoh di atas, kerugian yang bisa diselesaikan di −$203 berubah menjadi −$238 hanya karena waktu, dan bisa membesar menjadi −$438 kalau kunci dibuka di saat yang salah. Bagi kebanyakan situasi, cut loss di level yang sudah direncanakan adalah keputusan yang lebih sederhana dan lebih murah.

Kalau Anda ingin membangun kebiasaan stop loss, ukuran lot, dan batas risiko dari dasar, pelajari modul gratis di Academy Doktor Trader. Semua materinya edukasi, tanpa sinyal dan tanpa janji profit.

## Pertanyaan yang sering diajukan

### Apakah teknik lock sama dengan hedging?

Dalam percakapan trader ritel di Indonesia, lock biasanya berarti hedging pada instrumen yang sama dengan lot yang sama. Istilah hedging secara umum lebih luas, misalnya melindungi aset dengan instrumen lain yang berkorelasi.

### Apakah lock bisa mencegah margin call?

Lock dapat memperlambat penurunan equity karena floating loss berhenti bertambah, tetapi swap tetap menggerus equity dan margin yang ditahan tergantung aturan hedged margin pialang. Lock tidak memperbaiki penyebabnya, yaitu ukuran lot yang terlalu besar dibanding modal.

### Kapan lock masih masuk akal?

Untuk trader ritel dengan satu akun dan satu instrumen, hampir selalu lebih jelas menutup posisi lalu menyusun rencana baru. Jika Anda tetap memakai lock, pastikan ada aturan tertulis untuk membukanya dan hitung biaya swap hariannya sejak awal.
