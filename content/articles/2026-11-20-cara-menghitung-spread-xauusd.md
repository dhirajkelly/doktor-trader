---
title: "Cara Menghitung Spread XAUUSD: Rumus, Biaya per Lot, dan Contoh"
slug: cara-menghitung-spread-xauusd
meta_title: Cara Menghitung Spread XAUUSD | Doktor Trader
meta_description: Cara menghitung spread XAUUSD dari harga bid dan ask, mengubahnya jadi biaya dolar per lot, dan melihat dampaknya pada stop loss, lengkap dengan contoh.
focus_keyword: cara menghitung spread xauusd
category: Panduan Pemula
tags: [spread, xauusd, biaya trading, istilah trading]
excerpt: Spread adalah biaya yang Anda bayar di setiap posisi. Pelajari rumusnya, biaya per lot, dan pengaruhnya pada stop loss emas.
---

Waktu pertama kali trading emas, saya heran kenapa setiap posisi yang baru dibuka langsung minus, padahal harga di chart belum bergerak. Saya baru paham belakangan: itu spread, biaya yang dibayar di depan pada setiap transaksi. Spread memang kecil per posisi, tetapi kalau tidak dihitung, ia diam-diam menggerus akun dan membuat stop loss tersentuh lebih cepat dari perkiraan. Artikel ini membahas **cara menghitung spread XAUUSD** langkah demi langkah: dari harga bid dan ask, ke biaya dolar per lot, sampai dampaknya pada rencana risiko Anda.

Semua harga dan angka di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi. Spesifikasi kontrak dan besar spread berbeda di tiap pialang dan jenis akun, jadi selalu cek spesifikasi simbol di akun Anda sendiri.

## Apa itu spread, bid, dan ask

Di platform MT4 atau MT5, setiap simbol punya dua harga:

- **Bid**: harga saat Anda **menjual**. Posisi buy ditutup di harga bid.
- **Ask**: harga saat Anda **membeli**. Posisi sell ditutup di harga ask.
- **Spread**: selisih keduanya, yaitu ask dikurangi bid.

Ask selalu lebih tinggi daripada bid. Karena itu, saat Anda membuka buy di ask lalu langsung menutupnya di bid, Anda rugi sebesar spread. Inilah alasan posisi baru selalu dimulai dari angka minus kecil.

Satu hal yang sering terlewat: chart di MT4/MT5 secara bawaan menampilkan harga **bid**. Harga ask tidak terlihat di candle kecuali Anda mengaktifkan garis ask di pengaturan chart.

## Rumus menghitung spread XAUUSD

Rumus dasarnya sederhana:

**Spread (dalam harga) = Ask − Bid**

Lalu, untuk mengubahnya menjadi biaya dalam dolar:

**Biaya spread ($) = Spread (harga) × ukuran kontrak × lot**

Banyak pialang memakai ukuran kontrak 100 ons per 1 lot XAUUSD, sehingga setiap pergerakan harga $1 bernilai $100 per lot. Namun ini tidak seragam, jadi pastikan lewat menu spesifikasi simbol (klik kanan simbol di Market Watch, lalu pilih Specification/Spesifikasi).

### Soal "point" dan "pip"

MT4/MT5 menampilkan spread dalam **point**, yaitu kenaikan harga terkecil. Pada XAUUSD dengan dua angka desimal, 1 point = 0,01. Jadi spread "25" di Market Watch berarti 0,25 dalam harga.

Istilah "pip" untuk emas tidak seragam. Ada yang menyebut 1 pip = 0,10, ada pula yang menyebut 0,01. Supaya tidak salah hitung, biasakan berpikir dalam **selisih harga dan dolar**, bukan pip.

## Contoh hitungan biaya spread per lot

Misalkan harga contoh XAUUSD: bid 2.650,10 dan ask 2.650,35, dengan kontrak 100 ons per lot.

1. Spread = 2.650,35 − 2.650,10 = **0,25** (atau 25 point).
2. Biaya per 1 lot = 0,25 × 100 × 1 = **$25**.
3. Biaya untuk lot lain mengikuti proporsinya.

| Ukuran lot | Biaya spread (spread 0,25) |
|---|---|
| 1,00 lot | $25,00 |
| 0,10 lot | $2,50 |
| 0,05 lot | $1,25 |
| 0,02 lot | $0,50 |
| 0,01 lot | $0,25 |

Artinya, setiap kali Anda membuka posisi 0,05 lot, harga harus bergerak 0,25 ke arah Anda hanya untuk kembali ke titik impas. Jika akun Anda juga dikenai komisi, tambahkan komisinya. Misalnya, dengan contoh komisi $6 per lot pulang-pergi, posisi 0,05 lot menambah $0,30, sehingga total biaya masuk menjadi $1,55.

## Kenapa spread lebih terasa pada stop loss yang sempit

Bagian ini yang paling penting untuk manajemen risiko. Biaya spread tidak bergantung pada jarak stop loss, tetapi besar risiko Anda bergantung padanya. Akibatnya, semakin sempit stop loss, semakin besar porsi spread terhadap risiko.

Contoh: modal $1.000, risiko 1% per posisi ($10), spread 0,25, kontrak 100 ons. Lot dihitung dari jarak stop loss, seperti yang dibahas di artikel [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd).

| Jarak stop loss | Lot (risiko $10) | Biaya spread | Spread terhadap risiko |
|---|---|---|---|
| 1,00 | 0,10 | $2,50 | 25% |
| 2,00 | 0,05 | $1,25 | 12,5% |
| 5,00 | 0,02 | $0,50 | 5% |
| 10,00 | 0,01 | $0,25 | 2,5% |

Dengan stop loss 1,00, seperempat dari risiko Anda sudah habis untuk spread sebelum harga bergerak. Dengan stop loss 10,00, biaya yang sama hanya 2,5%. Ini bukan berarti stop loss lebar selalu lebih baik. Stop loss tetap harus mengikuti struktur pasar. Tetapi Anda perlu sadar bahwa gaya trading dengan target dan stop yang sangat sempit menanggung biaya relatif yang jauh lebih berat. Untuk menghitung lot dengan cepat, gunakan [kalkulator lot gratis](/alat/kalkulator-lot).

## Biaya spread dalam sebulan

Biaya kecil yang berulang akan menumpuk. Contoh ilustrasi: Anda membuka 3 posisi per hari, 20 hari trading sebulan, masing-masing 0,05 lot dengan spread 0,25.

- Biaya per posisi: $1,25
- Jumlah posisi sebulan: 3 × 20 = 60
- Total biaya spread: 60 × $1,25 = **$75**, atau 7,5% dari modal $1.000

Angka ini belum termasuk komisi dan swap. Jadi sebelum menambah frekuensi trading, tanyakan ke diri sendiri apakah setiap posisi tambahan benar-benar sesuai rencana, atau hanya karena ingin "ada posisi".

## Saat spread melebar

Spread XAUUSD tidak selalu tetap. Pada banyak jenis akun, spread bisa melebar saat likuiditas tipis, misalnya sekitar pergantian hari (rollover) dan saat rilis data ekonomi penting. Penjelasan tentang sesi dan likuiditas emas ada di artikel [jam trading emas terbaik](/artikel/jam-trading-emas-terbaik), sedangkan cara mengenali jadwal berita penting ada di [cara membaca kalender ekonomi](/artikel/cara-membaca-kalender-ekonomi).

Contoh ilustrasi: jika spread melebar dari 0,25 menjadi 0,80, biaya posisi 0,05 lot naik dari $1,25 menjadi $4,00. Dampaknya bukan hanya biaya. Ada dua hal teknis yang perlu dipahami:

1. **Stop loss posisi sell dipicu oleh harga ask.** Karena chart menampilkan bid, stop loss sell bisa tersentuh walaupun candle bid di chart belum menyentuh level tersebut. Spread yang melebar memperbesar kemungkinan ini.
2. **Stop loss posisi buy dipicu oleh harga bid**, sehingga lebih sesuai dengan apa yang Anda lihat di chart.

Langkah praktisnya:

- Untuk posisi sell, beri jarak tambahan setidaknya sebesar spread normal di atas level stop loss yang Anda rencanakan.
- Hindari membuka posisi baru beberapa menit menjelang rilis berita berdampak tinggi jika rencana Anda tidak dirancang untuk kondisi itu.
- Cek spread di Market Watch sebelum entry. Jika jauh di atas biasanya, menunggu adalah keputusan yang sah.

## Langkah cepat sebelum entry

Agar spread masuk ke perhitungan Anda, jalankan urutan ini setiap kali akan membuka posisi:

1. Lihat spread saat ini di Market Watch (dalam point), lalu ubah ke harga: point × 0,01.
2. Hitung lot dari jarak stop loss dan risiko maksimal Anda.
3. Hitung biaya spread: spread × 100 × lot (sesuaikan dengan ukuran kontrak akun Anda).
4. Bandingkan dengan risiko. Jika spread memakan porsi besar dari risiko, pertimbangkan ulang setup tersebut.
5. Catat biaya spread dan komisi di jurnal agar Anda tahu total biaya trading per bulan.

## Pertanyaan yang sering diajukan

### Apakah spread dipotong dua kali, saat buka dan tutup posisi?

Tidak. Spread dibayar satu kali karena Anda membeli di ask dan menjual di bid. Selisih itu muncul sekali per transaksi pulang-pergi, bukan di setiap sisi.

### Apakah spread kecil berarti biaya trading pasti murah?

Belum tentu. Beberapa jenis akun menawarkan spread kecil tetapi mengenakan komisi per lot. Bandingkan total biaya, yaitu spread ditambah komisi, dan perhatikan juga swap jika Anda menahan posisi melewati pergantian hari.

### Di mana melihat swap XAUUSD?

Di spesifikasi simbol pada MT4/MT5. Nilai swap ditentukan pialang dan dapat berubah, jadi cek langsung di akun Anda, bukan dari angka di internet.

## Kesimpulan

Cara menghitung spread XAUUSD cukup tiga langkah: kurangi ask dengan bid, kalikan dengan ukuran kontrak, lalu kalikan dengan lot. Yang membuatnya penting bukan rumusnya, melainkan kebiasaan memasukkan biaya ini ke rencana risiko: spread memakan porsi lebih besar saat stop loss sempit, menumpuk saat frekuensi trading tinggi, dan bisa melebar saat berita. Trader yang bertahan lama biasanya tahu persis berapa biaya yang ia bayar untuk setiap posisi.

Jika Anda ingin memahami biaya trading, ukuran lot, dan manajemen risiko secara runtut, materinya tersedia gratis di Academy Doktor Trader. Anda bisa [mendaftar sebagai member](/daftar) dan mulai dari modul dasar.
