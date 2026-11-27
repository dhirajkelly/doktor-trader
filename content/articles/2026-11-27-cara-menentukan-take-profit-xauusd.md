---
title: "Cara Menentukan Take Profit XAUUSD: 4 Metode dan Contoh Hitungan"
slug: cara-menentukan-take-profit-xauusd
meta_title: Cara Menentukan Take Profit XAUUSD | Doktor Trader
meta_description: "Cara menentukan take profit XAUUSD dengan struktur harga, kelipatan R, cek rentang harian, dan TP bertahap, lengkap dengan contoh hitungan yang mudah diikuti."
focus_keyword: cara menentukan take profit xauusd
category: Strategi Emas
tags: [take profit, xauusd, risk reward, manajemen posisi]
excerpt: Take profit bukan angka favorit. Pelajari empat cara menentukan target XAUUSD dari chart, kelipatan R, rentang harian, dan TP bertahap, plus contoh hitungan.
---

Dulu saya menaruh take profit dengan cara yang sangat sederhana: angka bulat yang "enak dilihat", atau target sejauh mungkin karena saya ingin satu posisi menutup kerugian minggu sebelumnya. Hasilnya, harga sering berbalik tepat sebelum target, lalu posisi yang tadinya untung berakhir rugi. Dari pengalaman itu saya belajar bahwa **cara menentukan take profit XAUUSD** sama pentingnya dengan cara menentukan stop loss. Target yang asal pasang membuat rencana trading Anda tidak bisa diukur.

Artikel ini membahas empat metode yang saling melengkapi: target dari struktur harga, target dari kelipatan risiko (R), pengecekan rentang harian, dan take profit bertahap. Semua harga di sini adalah contoh ilustrasi untuk belajar, bukan rekomendasi transaksi dan bukan sinyal.

## Kenapa take profit harus ditentukan sebelum entry

Take profit (TP) adalah order untuk menutup posisi secara otomatis ketika harga mencapai level tertentu yang menguntungkan. Ada tiga alasan TP sebaiknya sudah ada sebelum Anda menekan tombol order:

- **Risk reward bisa dihitung.** Tanpa target, Anda tidak tahu apakah setup itu layak diambil. Rumus dan contohnya saya bahas di artikel [cara menghitung risk reward ratio](/artikel/cara-menghitung-risk-reward-ratio).
- **Keputusan dibuat saat tenang.** Saat posisi sedang untung, emosi mudah mengambil alih: takut keuntungan hilang, atau serakah ingin lebih.
- **Hasilnya bisa dievaluasi.** Target yang tertulis di jurnal bisa dibandingkan dengan apa yang benar-benar terjadi, sehingga Anda tahu apakah metode target Anda realistis.

Satu hal teknis yang perlu diingat: posisi buy ditutup pada harga Bid, sedangkan posisi sell ditutup pada harga Ask. Chart di MetaTrader biasanya menampilkan harga Bid, jadi TP posisi sell baru tersentuh ketika harga Ask (Bid ditambah spread) mencapai level itu. Karena itu, ada baiknya menaruh TP sedikit sebelum level target di chart, bukan tepat di atasnya.

## Metode 1: take profit dari struktur harga

Metode paling dasar adalah melihat di mana harga kemungkinan besar akan bertemu hambatan. Untuk posisi buy, hambatan itu adalah resistance terdekat. Untuk posisi sell, support terdekat. Cara menggambar zonanya saya jelaskan di artikel [cara menentukan support resistance XAUUSD](/artikel/cara-menentukan-support-resistance-xauusd).

Langkahnya:

1. Tandai zona support atau resistance di timeframe entry dan satu timeframe di atasnya.
2. Pilih zona **terdekat** yang searah dengan posisi, bukan zona yang paling Anda harapkan.
3. Taruh TP sedikit sebelum batas dekat zona itu, sehingga order punya peluang tereksekusi walaupun harga hanya menyentuh tepi zona.
4. Hitung risk reward. Jika target terdekat terlalu dekat dibanding stop loss, lebih baik lewati setup tersebut daripada memaksa target yang lebih jauh.

### Contoh hitungan

Contoh ilustrasi: modal $4.000, risiko 1% per posisi = $40.

- Entry buy: 4.000,0
- Stop loss: 3.990,0 (jarak $10)
- Lot = $40 ÷ ($10 × 100 ons) = **0,04 lot**
- Resistance terdekat mulai di 4.016,0, jadi TP ditaruh di 4.014,0
- Jarak TP = $14, sehingga risk reward = 14 ÷ 10 = **1,4R**

Jika Anda memaksakan target 2R, TP harus berada di 4.020,0, yaitu di dalam zona resistance. Secara angka terlihat lebih menarik, tetapi harga harus menembus hambatan dulu. Untuk menghitung lot dari jarak stop loss tanpa repot, Anda bisa memakai [kalkulator lot gratis](/alat/kalkulator-lot).

## Metode 2: take profit dari kelipatan R

Metode kedua memakai jarak stop loss sebagai satuan. Satu R adalah jarak dari entry ke stop loss. Target 2R berarti jarak TP dua kali jarak SL. Kelebihan metode ini adalah konsisten dan mudah diuji, karena aturan target sama di setiap posisi.

Yang perlu Anda pahami adalah hubungan antara besar target dan seberapa sering posisi harus mencapai target agar impas. Secara matematis, persentase posisi untung yang dibutuhkan untuk impas (sebelum biaya) adalah 1 ÷ (1 + R):

| Target | Persentase posisi untung agar impas (sebelum biaya) |
|---|---|
| 1R | 50,0% |
| 1,4R | 41,7% |
| 2R | 33,3% |
| 2,5R | 28,6% |

Tabel ini bukan target performa dan bukan gambaran hasil strategi mana pun. Tabel ini hanya menunjukkan bahwa target yang lebih jauh menurunkan angka impas, tetapi biasanya juga lebih jarang tersentuh. Tidak ada kelipatan yang otomatis lebih baik. Cara jujur untuk memilihnya adalah menguji aturan Anda di data masa lalu dan mencatat hasilnya dalam satuan R.

Kombinasi yang sering lebih masuk akal adalah memakai kelipatan R sebagai syarat minimum, lalu struktur harga sebagai batas. Contohnya: "ambil setup hanya jika resistance terdekat berjarak minimal 1,5R".

## Metode 3: cek apakah target realistis dengan rentang harian

Target yang benar secara struktur bisa tetap tidak realistis jika harga sudah bergerak jauh hari itu. Indikator ATR (Average True Range) di timeframe D1 memberi gambaran lebar pergerakan harian rata-rata dalam periode tertentu.

Contoh ilustrasi: ATR(14) D1 sebesar $40. Hari ini harga sudah bergerak $32 dari low ke high. Setup Anda butuh tambahan $25 untuk mencapai target. Artinya, target itu menuntut rentang hari ini mencapai sekitar $57 atau lebih, jauh di atas rata-ratanya. Bukan mustahil, terutama saat ada rilis data penting, tetapi Anda sebaiknya sadar bahwa target tersebut menuntut hari yang tidak biasa.

Pilihan yang bisa Anda ambil dalam situasi seperti ini:

- Pakai target yang lebih dekat dan terima risk reward yang lebih kecil, selama masih memenuhi syarat minimum Anda.
- Tunggu setup berikutnya saat rentang harian belum banyak terpakai.
- Biarkan posisi berjalan lebih dari satu hari, dengan memperhitungkan biaya swap dan risiko gap.

## Metode 4: take profit bertahap

Take profit bertahap berarti menutup sebagian posisi di target pertama, lalu membiarkan sisanya menuju target kedua. Cara paling sederhana di MT5 adalah membuka dua posisi dengan lot sama dan TP berbeda. Di akun hedging, Anda juga bisa menutup sebagian volume posisi secara manual. Ingat bahwa lot minimum umumnya 0,01, jadi posisi harus cukup besar untuk dibagi.

### Contoh skenario

Masih dengan modal $4.000, risiko $40, entry 4.000,0, SL 3.990,0, total 0,04 lot dibagi dua:

- Posisi A: 0,02 lot, TP1 di 4.010,0 (1R)
- Posisi B: 0,02 lot, TP2 di 4.025,0 (2,5R)
- Setelah TP1 tersentuh, SL posisi B digeser ke harga entry

| Skenario | Hasil |
|---|---|
| SL tersentuh sebelum TP1 | −$40 (−1R) |
| TP1 tersentuh, lalu harga kembali ke entry | +$20 + $0 = +$20 (+0,5R) |
| TP1 dan TP2 tersentuh | +$20 + $50 = +$70 (+1,75R) |

Sebagai pembanding, satu posisi penuh 0,04 lot dengan TP 2,5R menghasilkan +$100 jika target tercapai, tetapi bisa berakhir −$40 jika harga sempat ke 4.010,0 lalu berbalik ke SL. TP bertahap mengurangi rasa sakit dari skenario kedua, dengan imbalan hasil maksimal yang lebih kecil. Ini pertukaran, bukan keunggulan. Jika ingin mengikuti tren lebih jauh untuk posisi B, Anda bisa memakai [trailing stop](/artikel/cara-menggunakan-trailing-stop-xauusd) alih-alih TP tetap.

Jangan lupa biaya. Dengan spread contoh $0,30, posisi 0,04 lot menanggung biaya sekitar 0,04 × 100 × 0,30 = $1,20 per transaksi. Kecil per posisi, tetapi terasa jika target Anda dekat.

## Kesalahan umum saat memasang take profit

- **Memilih angka karena keinginan, bukan karena chart.** Target "biar balik modal" tidak ada hubungannya dengan perilaku harga.
- **Menggeser TP menjauh saat posisi sudah untung.** Ini mengubah rencana tanpa analisa baru, dan sering berakhir dengan keuntungan yang hilang.
- **Menaruh TP tepat di garis resistance atau support.** Harga sering berbalik di tepi zona, tidak harus menyentuh garis yang Anda gambar.
- **Lupa spread pada posisi sell.** TP sell tersentuh oleh harga Ask, bukan harga yang terlihat di chart Bid.
- **Tidak mencatat.** Tanpa jurnal, Anda tidak tahu apakah target Anda terlalu dekat, terlalu jauh, atau sudah sesuai.

**Tonton juga:** [Stop Loss & Take Profit dari Chart: RR yang Jujur](https://www.youtube.com/watch?v=d32QNIRBbfk)

## Kesimpulan

Cara menentukan take profit XAUUSD yang sehat dimulai dari chart: cari hambatan terdekat, hitung risk reward terhadap stop loss, lalu periksa apakah target itu masuk akal dibanding rentang harian. Kelipatan R memberi konsistensi, sedangkan TP bertahap membantu mengelola emosi dengan imbalan hasil maksimal yang lebih kecil. Semua metode ini tidak menjamin hasil apa pun. Gunanya adalah membuat setiap posisi punya rencana yang bisa diukur dan dievaluasi.

Jika Anda ingin belajar menyusun stop loss, take profit, dan ukuran lot secara bertahap, ikuti Academy gratis di Doktor Trader. Anda bisa [mendaftar di sini](/daftar) dan mulai dari modul pertama.

## Pertanyaan yang sering diajukan

### Apakah wajib memasang take profit?

Tidak wajib, tetapi target sebaiknya selalu ada dalam rencana. Jika Anda memilih keluar dengan trailing stop atau aturan lain, tuliskan aturan itu sebelum entry agar keputusan keluar tidak diambil berdasarkan emosi.

### Berapa risk reward minimum yang sebaiknya dipakai?

Tidak ada angka yang cocok untuk semua orang. Anda bisa menetapkan syarat minimum, misalnya 1,5R, lalu mengujinya di akun demo dan jurnal. Yang penting adalah syarat itu konsisten dan diuji, bukan diganti-ganti setelah melihat hasil.

### Bolehkah menutup posisi sebelum take profit tersentuh?

Boleh, jika alasan keluarnya sudah tertulis di rencana, misalnya rilis data penting akan keluar atau struktur harga berubah. Menutup posisi hanya karena takut, tanpa aturan, adalah kebiasaan yang sebaiknya dicatat dan dievaluasi.
