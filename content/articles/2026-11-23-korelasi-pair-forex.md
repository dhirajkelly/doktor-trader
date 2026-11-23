---
title: "Korelasi Pair Forex: Cara Menghindari Risiko Ganda Tanpa Sadar"
slug: korelasi-pair-forex
meta_title: Korelasi Pair Forex dan Risiko Ganda | Doktor Trader
meta_description: "Korelasi pair forex bisa membuat risiko Anda berlipat tanpa terasa. Pelajari cara membaca koefisien korelasi, contoh hitungan, dan cara membagi lot."
focus_keyword: korelasi pair forex
category: Manajemen Risiko
tags: [korelasi, manajemen risiko, forex, lot, eksposur]
excerpt: Dua posisi di pair yang berkorelasi bisa berarti satu taruhan yang sama dengan risiko dua kali lipat. Ini cara menghitung dan mengendalikannya.
---

Salah satu hari terburuk saya sebelum margin call bukan karena satu posisi besar, melainkan karena tiga posisi "kecil" yang saya kira terpisah. Saya membuka buy di EURUSD, buy di GBPUSD, dan sell di USDCHF, masing-masing dengan risiko yang menurut saya wajar. Ketika dolar AS menguat tajam, ketiganya bergerak melawan saya bersamaan. Di atas kertas saya punya tiga posisi, tetapi pada kenyataannya saya hanya punya satu taruhan: dolar akan melemah. Pelajaran itulah inti dari **korelasi pair forex**, yaitu memahami bahwa beberapa pair sering bergerak searah atau berlawanan, sehingga risiko total Anda bisa jauh lebih besar dari yang Anda kira.

Artikel ini membahas cara membaca dan menghitung korelasi, contoh risiko ganda, dan aturan praktis membagi lot.

Semua angka harga dan perubahan harga di artikel ini adalah contoh ilustrasi untuk belajar, bukan data pasar sebenarnya dan bukan rekomendasi transaksi.

## Apa itu korelasi pair forex

Korelasi adalah ukuran statistik seberapa mirip arah pergerakan dua instrumen dalam periode tertentu. Di forex, korelasi muncul secara alami karena setiap pair terdiri dari dua mata uang, dan banyak pair berbagi mata uang yang sama. EURUSD dan GBPUSD sama-sama memakai USD sebagai mata uang kutipan. Kalau dolar AS menguat terhadap banyak mata uang sekaligus, kedua pair ini cenderung turun bersama.

Korelasi biasanya dinyatakan dengan **koefisien korelasi** (sering ditulis *r*), dengan rentang dari -1 sampai +1:

| Nilai koefisien | Arti | Dampak jika posisi searah |
|---|---|---|
| Mendekati +1 | Kedua pair cenderung bergerak searah | Buy di keduanya ≈ menggandakan risiko |
| Sekitar 0 | Tidak ada hubungan arah yang jelas | Risiko relatif terpisah |
| Mendekati -1 | Kedua pair cenderung bergerak berlawanan | Buy di keduanya ≈ saling meniadakan |

Ada dua hal yang perlu diingat sejak awal:

1. **Korelasi bukan sebab-akibat.** Dua pair bergerak mirip karena dipengaruhi faktor yang sama, bukan karena yang satu menggerakkan yang lain.
2. **Korelasi berubah dari waktu ke waktu.** Hubungan yang kuat dalam tiga bulan terakhir bisa melemah atau bahkan berbalik ketika kondisi ekonomi berubah. Jadi, hitung atau cek ulang secara berkala.

## Mengapa korelasi penting untuk manajemen risiko

Banyak trader sudah disiplin memakai risiko per posisi, misalnya 1% dari ekuitas. Masalahnya, aturan itu hanya berlaku untuk satu posisi. Ketika dua posisi berkorelasi kuat dan searah, keduanya cenderung kena stop loss pada waktu yang hampir sama. Risiko 1% + 1% secara praktis menjadi satu taruhan 2%.

Ini juga terjadi pada arah yang tampak berlawanan: buy EURUSD dan sell USDCHF sama-sama berarti "menjual dolar AS".

Inilah kenapa korelasi sebaiknya dianggap bagian dari perencanaan risiko, sejajar dengan stop loss dan [batas kerugian harian trading](/artikel/batas-kerugian-harian-trading). Tanpa memperhitungkan korelasi, batas harian Anda bisa tersentuh dalam satu pergerakan saja.

### Tanda-tanda Anda sedang menumpuk eksposur yang sama

- Beberapa posisi terbuka memakai mata uang yang sama di sisi yang sama (misalnya semuanya "jual USD").
- Semua posisi Anda untung bersamaan dan rugi bersamaan.
- Floating loss melonjak jauh lebih cepat dari yang Anda bayangkan saat satu data ekonomi besar dirilis.

## Cara menghitung koefisien korelasi sendiri

Anda tidak perlu software khusus. Cukup data harga penutupan harian dua pair dan spreadsheet. Langkahnya:

1. Ambil harga penutupan harian kedua pair untuk periode yang sama, misalnya 20, 50, atau 100 hari terakhir.
2. Ubah harga menjadi **perubahan persentase harian**: (harga hari ini − harga kemarin) ÷ harga kemarin × 100.
3. Gunakan fungsi korelasi di spreadsheet. Di Excel atau Google Sheets, rumusnya `=CORREL(kolom_A; kolom_B)` (pemisah bisa koma atau titik koma, tergantung pengaturan bahasa).
4. Ulangi perhitungan setiap minggu atau setiap bulan, karena nilainya bergeser.

### Contoh hitungan dengan data ilustrasi

Misalkan berikut perubahan harian (dalam %) tiga pair selama enam hari. Angka ini dibuat untuk latihan, bukan data pasar nyata.

| Hari | Pair A | Pair B | Pair C |
|---|---|---|---|
| 1 | +0,42 | +0,38 | −0,40 |
| 2 | −0,31 | −0,22 | +0,28 |
| 3 | +0,18 | +0,25 | −0,12 |
| 4 | −0,55 | −0,47 | +0,50 |
| 5 | +0,27 | +0,15 | −0,30 |
| 6 | +0,10 | +0,05 | −0,02 |

Jika dihitung dengan rumus korelasi Pearson (sama dengan fungsi `CORREL`), hasilnya:

- Korelasi Pair A dan Pair B ≈ **+0,98**: hampir selalu bergerak searah.
- Korelasi Pair A dan Pair C ≈ **−0,99**: hampir selalu bergerak berlawanan.

Artinya, buy di Pair A dan buy di Pair B adalah taruhan yang hampir identik. Buy di Pair A dan sell di Pair C juga taruhan yang hampir identik. Sebaliknya, buy di Pair A dan buy di Pair C cenderung saling meniadakan, sehingga Anda membayar spread dua kali untuk hasil yang mendekati nol.

Enam hari terlalu sedikit untuk kesimpulan nyata; dalam praktik, gunakan minimal beberapa puluh data.

## Contoh hitungan risiko ganda

Sekarang kita lihat dampaknya dalam dolar. Misalkan:

- Ekuitas akun: $5.000
- Risiko per posisi: 1% = $50
- Stop loss: 30 pip untuk setiap posisi
- Nilai pip untuk pair dengan USD sebagai mata uang kutipan (seperti EURUSD dan GBPUSD): $10 per pip per 1 lot standar

Jika Anda belum yakin cara menghitung nilai pip, baca dulu panduan [cara menghitung pip forex](/artikel/cara-menghitung-pip-forex).

### Skenario 1: dua posisi searah, masing-masing 1%

Lot per posisi = $50 ÷ (30 pip × $10) = 0,166 lot, dibulatkan ke bawah menjadi **0,16 lot**.

Anda membuka buy di dua pair yang berkorelasi kuat. Jika keduanya kena stop loss:

Rugi total = 2 × 0,16 lot × 30 pip × $10 = **$96**, atau sekitar **1,92%** dari ekuitas.

Anda merasa sedang mengambil risiko 1%, padahal kenyataannya hampir 2% pada satu ide yang sama.

### Skenario 2: batas risiko per kelompok korelasi 1,5%

Cara yang lebih rapi adalah menetapkan **batas risiko per kelompok**. Pair yang berkorelasi kuat dan searah dihitung sebagai satu kelompok, misalnya dengan batas total 1,5% = $75. Jatah itu dibagi dua:

Lot per posisi = $37,50 ÷ (30 pip × $10) = 0,125 lot, dibulatkan ke bawah menjadi **0,12 lot**.

Jika keduanya kena stop loss: 2 × 0,12 × 30 × $10 = **$72**, atau **1,44%** dari ekuitas. Masih di bawah batas kelompok.

| Skenario | Lot per posisi | Rugi jika keduanya kena SL | % ekuitas |
|---|---|---|---|
| Tanpa memperhitungkan korelasi | 0,16 | $96 | 1,92% |
| Batas kelompok 1,5% | 0,12 | $72 | 1,44% |

Untuk menghitung lot dengan cepat dari risiko dan jarak stop loss, Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot) di Doktor Trader.

## Aturan praktis mengelola korelasi

Berikut kebiasaan sederhana yang bisa langsung Anda terapkan:

- **Petakan eksposur per mata uang, bukan per pair.** Sebelum membuka posisi, tulis apa arti posisi itu dalam mata uang: buy EURUSD = beli EUR, jual USD. Kalau tiga posisi semuanya "jual USD", Anda punya satu taruhan besar.
- **Tetapkan batas risiko per kelompok.** Misalnya 1% per posisi, tetapi maksimal 1,5% untuk semua posisi yang berkorelasi kuat dan searah.
- **Pilih setup terbaik, bukan semuanya.** Kalau EURUSD dan GBPUSD sama-sama memberi sinyal di strategi Anda, sering kali lebih bersih memilih satu dengan struktur paling jelas.
- **Jangan menganggap posisi berlawanan sebagai lindung nilai gratis.** Buy di dua pair yang berkorelasi negatif kuat cenderung saling meniadakan, sementara spread dan swap tetap dibayar. Baca juga [apa itu swap dalam trading](/artikel/apa-itu-swap-dalam-trading) agar biaya inap ikut terhitung.
- **Perbarui data korelasi secara berkala.** Jadwalkan pengecekan bulanan, dan catat hasilnya di jurnal trading Anda.

## Pertanyaan yang sering diajukan

### Berapa nilai korelasi yang dianggap kuat?
Tidak ada batas baku. Sebagai patokan kasar, Anda bisa menganggap nilai di atas +0,7 atau di bawah −0,7 sebagai kuat, dan nilai di antara −0,3 sampai +0,3 sebagai lemah.

### Apakah XAUUSD juga perlu dihitung korelasinya?
Perlu, karena XAUUSD juga dikutip dalam dolar AS. Pergerakan dolar sering ikut memengaruhi harga emas, tetapi hubungannya tidak tetap. Cara paling jujur adalah menghitung sendiri korelasi XAUUSD dengan pair lain yang Anda perdagangkan, dengan metode yang sama seperti di atas.

### Apakah boleh membuka posisi di dua pair yang berkorelasi?
Boleh, selama Anda sadar bahwa itu satu ide dan risikonya dihitung sebagai satu kelompok. Masalahnya bukan pada jumlah posisi, melainkan pada risiko total yang tidak terlihat.

## Kesimpulan

Korelasi pair forex adalah risiko yang sering tidak terasa sampai semuanya bergerak melawan Anda bersamaan. Koefisien mendekati +1 berarti dua pair cenderung bergerak searah, mendekati −1 berarti berlawanan, dan nilainya selalu berubah. Contoh hitungan di atas menunjukkan bahwa dua posisi 1% di pair yang berkorelasi kuat bisa menjadi hampir 2% risiko pada satu ide. Solusinya sederhana: petakan eksposur per mata uang, tetapkan batas risiko per kelompok, dan perbarui data korelasi secara rutin.

Kalau Anda ingin mempelajari manajemen risiko secara bertahap, dari risiko per posisi sampai jurnal trading, semua materinya tersedia gratis di Academy Doktor Trader. Anda bisa [mendaftar sebagai member](/daftar) dan mulai dari modul dasar.
