---
title: "Aturan Risiko 1 Persen dalam Trading: Rumus, Contoh, dan Batasnya"
slug: aturan-risiko-1-persen
meta_title: Aturan Risiko 1 Persen: Rumus dan Contoh | Doktor Trader
meta_description: "Aturan risiko 1 persen dijelaskan: rumus lot dari stop loss, contoh hitungan XAUUSD dan EURUSD, dampak loss beruntun, dan kapan aturan ini tidak cukup."
focus_keyword: aturan risiko 1 persen
category: Manajemen Risiko
tags: [manajemen risiko, lot, stop loss, xauusd, risiko per trade]
excerpt: Aturan risiko 1 persen membatasi kerugian per posisi. Pelajari rumusnya, contoh hitungan lot, dampaknya saat loss beruntun, dan batas-batasnya.
---

Sebelum akun saya terkena margin call, saya tidak pernah bertanya "kalau posisi ini salah, saya rugi berapa?". Saya hanya bertanya "kalau benar, saya untung berapa?". Lot saya tentukan dari perasaan, dan ketika beberapa posisi salah berturut-turut, akun habis jauh lebih cepat dari yang saya bayangkan. **Aturan risiko 1 persen** adalah jawaban paling sederhana untuk kesalahan itu: setiap posisi hanya boleh merugikan paling banyak 1% dari ekuitas akun jika stop loss tersentuh.

Artikel ini membahas apa sebenarnya aturan risiko 1 persen, rumus mengubahnya menjadi ukuran lot, contoh hitungan XAUUSD dan EURUSD, mengapa angka kecil ini sangat berpengaruh saat loss beruntun, serta situasi ketika aturan ini tidak cukup. Semua harga dan angka di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi.

## Apa itu aturan risiko 1 persen

Aturan risiko 1 persen berarti jarak antara harga entry dan stop loss, dikalikan ukuran lot, tidak boleh menghasilkan kerugian lebih dari 1% ekuitas. Ada tiga hal yang sering disalahpahami:

- **Yang dibatasi adalah kerugian di stop loss, bukan modal yang dipakai.** Margin yang terpakai untuk membuka posisi bisa jauh lebih besar atau lebih kecil dari 1%. Yang diukur adalah berapa uang yang hilang jika analisa Anda salah.
- **Tanpa stop loss, aturan ini tidak berlaku.** Kalau tidak ada titik keluar, kerugian maksimal tidak bisa dihitung, sehingga "risiko 1%" hanya angka di kepala.
- **Dasarnya ekuitas saat ini, bukan modal awal.** Saat akun turun, nominal risiko ikut mengecil. Saat akun naik, nominalnya ikut membesar. Inilah yang membuat aturan ini melindungi akun secara otomatis.

Angka 1% sendiri bukan hukum alam. Sebagian trader memakai 0,5%, sebagian lain 2%. Yang penting adalah angkanya kecil, tertulis di trading plan, dan dijalankan di setiap posisi tanpa kecuali.

## Rumus mengubah 1 persen menjadi ukuran lot

Rumusnya hanya satu baris:

**Lot = (Ekuitas × 1%) ÷ (Jarak stop loss × Nilai per satuan gerak per 1 lot)**

Nilai per satuan gerak berbeda untuk tiap instrumen. Pada kontrak XAUUSD yang umum (1 lot = 100 troy ounce), pergerakan harga $1 bernilai $100 per 1 lot. Pada EURUSD dengan akun dolar, 1 pip bernilai sekitar $10 per 1 lot standar. Selalu cek spesifikasi kontrak di platform Anda, karena ukuran kontrak bisa berbeda antar akun. Pembahasan detailnya ada di artikel [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd).

### Contoh 1: XAUUSD

- Ekuitas: $2.000
- Risiko 1%: $20
- Entry contoh 2.400,00, stop loss 2.395,00, jarak $5
- Nilai gerak $5 untuk 1 lot: $5 × 100 = $500

Lot = $20 ÷ $500 = **0,04 lot**. Jika stop loss tersentuh, kerugiannya 0,04 × 100 × $5 = $20, tepat 1% ekuitas (belum termasuk spread dan kemungkinan slippage).

### Contoh 2: EURUSD

- Ekuitas: $2.000, risiko 1% = $20
- Jarak stop loss: 25 pip
- Nilai 25 pip untuk 1 lot: 25 × $10 = $250

Lot = $20 ÷ $250 = **0,08 lot**.

Perhatikan bahwa lot ditentukan oleh jarak stop loss, bukan sebaliknya. Stop loss ditempatkan di level yang masuk akal secara teknikal, lalu lot menyesuaikan. Jika Anda tidak ingin menghitung manual, gunakan [kalkulator lot gratis](/alat/kalkulator-lot) di Doktor Trader.

## Kenapa angka sekecil itu sangat penting: hitungan loss beruntun

Banyak trader menganggap 1% terlalu kecil. Coba bandingkan apa yang terjadi pada akun $1.000 setelah 10 kali kalah berturut-turut, dengan risiko dihitung dari ekuitas terbaru setiap kali:

| Risiko per posisi | Sisa ekuitas setelah 10 kali kalah | Drawdown | Kenaikan yang dibutuhkan untuk kembali ke $1.000 |
|---|---|---|---|
| 1% | $904,38 | 9,6% | 10,6% |
| 2% | $817,07 | 18,3% | 22,4% |
| 5% | $598,74 | 40,1% | 67,0% |
| 10% | $348,68 | 65,1% | 186,8% |

Dua hal terlihat jelas. Pertama, dengan risiko 1%, sepuluh kali kalah beruntun masih menyisakan lebih dari 90% akun. Kedua, kenaikan yang dibutuhkan untuk pulih tumbuh jauh lebih cepat daripada drawdown-nya. Di risiko 10%, akun harus naik hampir tiga kali lipat dari sisanya hanya untuk kembali ke titik awal. Rumus lengkapnya dibahas di [rumus drawdown trading](/artikel/rumus-drawdown-trading).

Loss beruntun bukan kejadian langka. Strategi apa pun, sebaik apa pun, akan melewati periode kalah berkali-kali. Aturan 1% tidak mencegah periode itu, tetapi memastikan Anda masih punya akun ketika periode itu selesai. Cara menghadapinya secara mental ada di artikel [cara mengatasi loss beruntun](/artikel/cara-mengatasi-loss-beruntun).

## Persen tetap atau nominal tetap?

Ada dua cara menjalankan aturan ini, dan perbedaannya terasa saat akun turun.

### Nominal tetap

Anda menetapkan risiko $20 per posisi selamanya. Setelah lima kali kalah, akun $2.000 menjadi $1.900, tetapi Anda masih merisikokan $20. Persentase risikonya diam-diam naik menjadi sekitar 1,05%, dan terus naik jika akun terus turun.

### Persen tetap

Anda menghitung ulang 1% dari ekuitas terbaru sebelum setiap posisi. Setelah lima kali kalah dengan risiko 1% per posisi, ekuitas menjadi sekitar $1.901,98, sehingga risiko berikutnya sekitar $19,02. Dengan stop loss XAUUSD $5, lot idealnya 0,038. Karena lot biasanya naik per 0,01, **bulatkan ke bawah** menjadi 0,03 (risiko $15), bukan ke atas menjadi 0,04 (risiko $20, melebihi batas).

Persen tetap lebih protektif karena rem bekerja otomatis saat akun turun. Kelemahannya, pemulihan juga terasa lebih lambat. Sebagai ilustrasi, 10 kali kalah lalu 10 kali menang, masing-masing 1% dengan rasio risk reward 1:1, membuat akun $1.000 menjadi $999,00, bukan tepat $1.000. Selisih kecil ini wajar dan merupakan harga dari perlindungan tadi.

## Kapan aturan 1 persen tidak cukup

Aturan 1% adalah batas per posisi. Ada beberapa situasi yang membuat risiko nyata Anda lebih besar dari angka itu:

1. **Beberapa posisi sekaligus.** Tiga posisi masing-masing 1% berarti risiko terbuka 3%, atau $60 pada akun $2.000. Jika ketiganya pada instrumen yang bergerak searah, misalnya beberapa pair yang sama-sama melawan dolar AS, praktis itu satu taruhan besar. Tetapkan juga batas total risiko terbuka.
2. **Slippage dan gap.** Stop loss bukan jaminan harga. Saat rilis berita besar atau pembukaan pasar setelah akhir pekan, posisi bisa tertutup lebih jauh dari stop loss, sehingga kerugian melebihi 1%.
3. **Lot minimum lebih besar dari lot ideal.** Pada akun kecil, 1% bisa menghasilkan lot di bawah 0,01. Membuka 0,01 lot berarti risiko Anda di atas 1%. Pilihannya adalah memperlebar jarak tanpa alasan teknikal (tidak disarankan), mencari setup dengan stop loss lebih dekat, atau melewatkan posisi itu.
4. **Tidak ada batas harian.** Sepuluh posisi 1% dalam satu hari tetap bisa menjadi kerugian 10%. Aturan per posisi perlu dipasangkan dengan batas kerugian harian.

## Langkah praktis menerapkannya mulai hari ini

- Tulis angka risiko per posisi (misalnya 1%) dan batas total risiko terbuka di trading plan.
- Sebelum setiap order, cek ekuitas terbaru, bukan saldo awal.
- Tentukan stop loss dari chart terlebih dahulu, baru hitung lot.
- Bulatkan lot ke bawah, tidak pernah ke atas.
- Catat di jurnal: risiko yang direncanakan versus kerugian nyata saat stop loss tersentuh, agar Anda tahu seberapa besar efek spread dan slippage.
- Latih seluruh alurnya di akun demo sampai menghitung lot terasa otomatis.

**Tonton juga:** [Aturan Risiko 1%: Kalah 10x, Sisa $904 vs $349](https://www.youtube.com/watch?v=iAD7IgsbMCU)

## Kesimpulan

Aturan risiko 1 persen bukan trik untuk mendapat profit. Fungsinya adalah memastikan satu kesalahan, atau sepuluh kesalahan berturut-turut, tidak menghapus akun Anda. Kuncinya ada pada tiga kebiasaan: stop loss ditentukan dulu, lot dihitung dari jarak stop loss dan ekuitas terbaru, dan total risiko terbuka ikut dibatasi. Seandainya saya menjalankan tiga kebiasaan ini sejak awal, margin call itu kemungkinan besar tidak pernah terjadi.

Jika Anda ingin mempelajari manajemen risiko secara berurutan, mulai dari hitungan lot sampai menyusun trading plan, ikuti Academy gratis di Doktor Trader. Anda bisa [mendaftar di sini](/daftar) dan belajar dengan tempo Anda sendiri.

## Pertanyaan yang sering diajukan

### Apakah aturan risiko 1 persen cocok untuk modal kecil?

Prinsipnya cocok, tetapi pada modal sangat kecil, lot minimum 0,01 sering membuat risiko nyata melebihi 1%. Dalam kasus itu, pilih setup dengan stop loss lebih dekat yang tetap masuk akal secara teknikal, atau lewati posisinya.

### Apakah 1 persen dihitung dari saldo atau ekuitas?

Lebih aman dari ekuitas, karena ekuitas sudah memperhitungkan posisi yang sedang terbuka. Jika tidak ada posisi terbuka, saldo dan ekuitas biasanya sama.

### Bolehkah menaikkan risiko menjadi 2 persen saat yakin?

Rasa yakin bukan data. Jika ingin mengubah angka risiko, ubahlah lewat evaluasi trading plan berdasarkan catatan jurnal, bukan di tengah sesi trading saat emosi sedang tinggi.
