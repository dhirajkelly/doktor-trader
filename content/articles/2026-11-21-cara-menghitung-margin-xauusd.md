---
title: Cara Menghitung Margin XAUUSD dan Pengaruh Leverage pada Akun
slug: cara-menghitung-margin-xauusd
meta_title: Cara Menghitung Margin XAUUSD & Leverage | Doktor Trader
meta_description: Cara menghitung margin XAUUSD dengan rumus sederhana, arti free margin dan margin level, plus contoh hitungan kenapa leverage tinggi bisa menjebak.
focus_keyword: cara menghitung margin xauusd
category: Manajemen Risiko
tags: [margin, leverage, xauusd, manajemen risiko]
excerpt: Margin bukan biaya, tapi dana jaminan. Pahami rumusnya, arti margin level, dan kenapa leverage besar tidak mengubah risiko per dolar.
---

Waktu akun saya terkena margin call bertahun-tahun lalu, saya sebenarnya tidak paham angka-angka di bagian bawah terminal: margin, free margin, margin level. Saya hanya melihat saldo, lalu kaget ketika posisi ditutup paksa. Artikel ini membahas **cara menghitung margin XAUUSD** dengan rumus sederhana, cara membaca free margin dan margin level, serta hal yang sering disalahpahami: leverage tinggi tidak membuat satu posisi lebih aman, tetapi membuat lot besar lebih mudah dibuka.

Semua harga, leverage, dan level stop out di artikel ini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi. Spesifikasi kontrak dan aturan margin berbeda antar akun, jadi selalu cek spesifikasi di akun Anda sendiri.

## Apa itu margin dalam trading emas

Margin adalah sebagian dana di akun yang "dikunci" sebagai jaminan selama posisi terbuka. Margin **bukan biaya** dan tidak hilang begitu saja. Saat posisi ditutup, margin itu kembali bebas. Yang mengubah saldo adalah untung atau rugi dari pergerakan harga, ditambah biaya seperti spread, komisi, dan swap.

Leverage menentukan seberapa kecil jaminan yang diminta. Dengan leverage 1:100, Anda menjaminkan sekitar 1/100 dari nilai kontrak. Dengan 1:500, jaminannya 1/500.

Di MT4 maupun MT5, Anda akan melihat beberapa istilah ini di tab Trade:

- **Balance**: saldo akun tanpa menghitung posisi yang masih terbuka.
- **Equity**: balance ditambah atau dikurangi floating profit/loss saat ini.
- **Margin**: total dana jaminan yang sedang dipakai posisi terbuka.
- **Free margin**: equity dikurangi margin, yaitu dana yang masih bisa dipakai.
- **Margin level**: equity dibagi margin, dikali 100%.

## Rumus menghitung margin XAUUSD

Pada banyak akun, 1 lot standar XAUUSD setara 100 troy ounce. Karena harga emas dikutip dalam dolar AS per ounce, rumusnya untuk akun berdenominasi USD adalah:

**Margin = lot × ukuran kontrak × harga ÷ leverage**

Langkahnya:

1. Cek ukuran kontrak di akun Anda. Di MT5, klik kanan simbol di Market Watch lalu pilih *Specification*.
2. Kalikan lot dengan ukuran kontrak untuk mendapat jumlah ounce.
3. Kalikan dengan harga untuk mendapat nilai kontrak.
4. Bagi dengan leverage akun.

Contoh: harga emas (contoh) 4.000, posisi 0,10 lot, leverage 1:100.

- Jumlah ounce: 0,10 × 100 = 10 oz
- Nilai kontrak: 10 × 4.000 = $40.000
- Margin: $40.000 ÷ 100 = **$400**

Untuk pembanding, pasangan mata uang seperti EURUSD memakai ukuran kontrak 100.000 unit per lot. Dengan harga contoh 1,0800, 0,10 lot di leverage 1:100 membutuhkan margin 0,10 × 100.000 × 1,08 ÷ 100 = **$108**. Emas biasanya meminta margin lebih besar per lot karena nilai kontraknya lebih besar.

### Tabel margin XAUUSD pada harga contoh 4.000

| Leverage | 0,01 lot | 0,05 lot | 0,10 lot |
|---|---|---|---|
| 1:100 | $40 | $200 | $400 |
| 1:200 | $20 | $100 | $200 |
| 1:500 | $8 | $40 | $80 |
| 1:1000 | $4 | $20 | $40 |

Perhatikan bahwa margin ikut berubah mengikuti harga. Kalau harga emas naik, margin untuk lot yang sama juga naik.

## Free margin dan margin level: angka yang perlu Anda pantau

Rumus margin di atas baru setengah cerita. Yang menentukan apakah posisi Anda bisa ditutup paksa adalah **margin level**.

**Margin level = equity ÷ margin terpakai × 100%**

Setiap akun punya batas margin call dan stop out. Saat margin level turun ke batas stop out, sistem mulai menutup posisi secara otomatis, biasanya dimulai dari posisi dengan kerugian terbesar. Angka batas ini berbeda antar broker dan jenis akun, jadi cek di halaman spesifikasi akun Anda. Penjelasan lengkap tentang mekanismenya ada di artikel [margin call: penyebab dan cara menghindarinya](/artikel/margin-call-penyebab-dan-cara-menghindari).

### Contoh: akun dengan risiko terukur

- Modal: $1.000
- Risiko per posisi: 1% = $10
- Stop loss: $5 dari entry
- Lot: $10 ÷ ($5 × 100) = 0,02 lot
- Leverage: 1:500, harga contoh 4.000

Margin = 0,02 × 100 × 4.000 ÷ 500 = **$16**. Free margin = $1.000 − $16 = $984. Margin level = $1.000 ÷ $16 × 100% = **6.250%**.

Kalau stop loss tersentuh, equity menjadi $990 dan posisi tertutup dengan rugi $10 (belum termasuk spread dan biaya). Margin level tidak pernah mendekati zona bahaya, karena ukuran lot dihitung dari stop loss, bukan dari free margin. Cara menghitung lot ini dibahas rinci di [cara menghitung lot XAUUSD](/artikel/cara-menghitung-lot-xauusd), atau Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot).

## Leverage tinggi tidak mengubah risiko per dolar

Ini bagian yang dulu paling saya salah pahami. Untuk lot yang sama, leverage **tidak mengubah** nilai untung atau rugi per pergerakan harga. Posisi 0,10 lot XAUUSD tetap bernilai sekitar $10 per pergerakan $1, entah leverage-nya 1:100 atau 1:1000. Leverage hanya mengubah berapa margin yang dikunci.

Mari bandingkan modal $1.000, posisi 0,10 lot di harga contoh 4.000, dengan contoh batas stop out 50%:

| Leverage | Margin | Margin level awal | Equity saat stop out | Ruang gerak melawan posisi |
|---|---|---|---|---|
| 1:100 | $400 | 250% | $200 | sekitar $80 |
| 1:500 | $80 | 1.250% | $40 | sekitar $96 |

Sekilas leverage 1:500 terlihat "lebih aman" karena ruang geraknya lebih lebar. Tetapi lihat apa yang terjadi jika ruang itu dipakai untuk membuka lot lebih besar.

### Jebakan: membuka lot berdasarkan free margin

Dengan modal $1.000 dan leverage 1:500, lot maksimal yang bisa dibuka sampai seluruh dana terkunci sebagai margin adalah:

$1.000 × 500 ÷ (100 × 4.000) = **1,25 lot**

Pada 1,25 lot, setiap pergerakan $1 bernilai $125. Margin level awal sudah 100%. Dengan contoh stop out 50%, akun hanya punya ruang sekitar **$4** sebelum posisi ditutup paksa dengan kerugian sekitar separuh modal. Di leverage 1:1000 dengan cara yang sama, lot maksimalnya 2,5 lot dan ruang geraknya tinggal sekitar $2. Pergerakan sebesar itu bisa terjadi dalam hitungan menit, terutama saat rilis data ekonomi.

Jadi masalahnya bukan leverage itu sendiri, melainkan kebiasaan menentukan lot dari "berapa yang masih bisa dibuka" alih-alih "berapa yang boleh saya rugikan".

## Langkah praktis mengelola margin

Berikut kebiasaan yang saya pakai dan ajarkan:

1. **Hitung lot dari stop loss dan persentase risiko**, bukan dari free margin.
2. **Cek margin sebelum entry.** Jendela order di MT5 menampilkan perkiraan margin. Pastikan angkanya kecil dibanding equity.
3. **Pantau margin level, bukan hanya balance.** Balance tidak berubah selama posisi masih terbuka, sedangkan equity dan margin level bergerak setiap detik.
4. **Hitung total margin semua posisi.** Tiga posisi kecil di arah yang sama bisa sama berisikonya dengan satu posisi besar.
5. **Hati-hati menjelang rilis berita.** Spread bisa melebar dan harga bisa melompat, sehingga equity turun lebih cepat. Lihat juga [cara menghitung spread XAUUSD](/artikel/cara-menghitung-spread-xauusd).
6. **Ingat bahwa margin bisa berubah.** Sebagian broker menyesuaikan leverage atau margin pada kondisi tertentu, misalnya menjelang akhir pekan atau saat volatilitas tinggi. Baca ketentuan akun Anda.

## Pertanyaan yang sering diajukan

### Apakah margin yang terpakai berarti uang saya hilang?

Tidak. Margin hanya dikunci sebagai jaminan selama posisi terbuka dan kembali menjadi free margin saat posisi ditutup. Yang mengurangi saldo adalah kerugian dari pergerakan harga dan biaya transaksi.

### Leverage berapa yang sebaiknya dipakai pemula?

Tidak ada satu angka yang cocok untuk semua orang. Yang lebih penting adalah ukuran lot dihitung dari risiko per posisi. Dengan lot yang terukur, margin level akan tetap tinggi pada leverage yang umum dipakai. Leverage tinggi baru berbahaya ketika dipakai untuk membuka lot di luar rencana.

### Kenapa margin di akun saya berbeda dengan hasil rumus?

Ukuran kontrak, mata uang akun, dan metode perhitungan margin bisa berbeda antar akun. Sebagian akun juga memakai harga ask untuk posisi buy dan bid untuk posisi sell. Cek menu *Specification* di platform atau tanyakan ke broker Anda.

## Kesimpulan

**Cara menghitung margin XAUUSD** sebenarnya sederhana: lot × ukuran kontrak × harga ÷ leverage. Yang lebih penting adalah memahami apa yang dikatakan angka itu. Margin adalah jaminan, margin level adalah alarm, dan leverage hanya menentukan berapa besar jaminan yang diminta, bukan seberapa besar risiko per dolar. Akun saya dulu habis bukan karena leverage, tetapi karena saya membuka lot sebesar yang diizinkan free margin.

Kalau Anda ingin belajar manajemen risiko secara bertahap, dari menghitung lot sampai menyusun aturan trading pribadi, ikuti Academy gratis di Doktor Trader. Anda bisa mulai dengan [mendaftar di sini](/daftar).
