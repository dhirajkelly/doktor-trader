// Kelas Academy "Beruang Rules": setup SELL dari kombinasi SBR (Support Become Resistance) + Fibonacci retracement.
// Aturan owner (28 Nov 2026): entry sell limit di Fib 0.79, SL di atas level RBS (maks. 0.89), TP tetap RR 1:4.
// DRAFT untuk dicek owner. Belum dipasang di seed.js, jadi belum tampil di Academy.

const COURSE = {
  title: 'Beruang Rules',
  level: 'Menengah',
  summary: 'Setup sell XAUUSD dari support yang patah lalu menjadi resistance (SBR), dengan konfluensi Fibonacci 0.69–0.79. Entry sell limit di Fib 0.79, SL di atas level RBS terdekat (maksimal 0.89), TP tetap di RR 1:4, risiko 0,5% per trade.',
};

const DISCLAIMER = `\n\n---\n\n*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Semua harga dalam contoh adalah ilustrasi. Trading emas, forex, dan derivatif berisiko tinggi dan dapat menghabiskan seluruh modal.*`;

const LESSONS = [
  ['Apa itu Beruang Rules', 8, `**Beruang Rules** adalah aturan untuk satu jenis setup saja: **sell setelah support patah lalu diuji ulang dari bawah**. "Beruang" (bear) dipakai karena setup ini hanya mencari posisi jual.

Idenya sederhana. Support yang sudah ditembus sering berganti peran menjadi resistance. Ini disebut **SBR (Support Become Resistance)**. Kalau zona SBR itu bertumpuk dengan **area Fibonacci 0.69–0.79**, kita pasang **sell limit di level 0.79**. Stop loss ditaruh di atas **level RBS** terdekat, dan target selalu **4 kali jarak SL**.

## Peta Beruang Rules

| Bagian | Letak |
|---|---|
| **Swing high** | Fib 1 |
| **Batas SL** | Fib 0.89. SL tidak boleh di atasnya |
| **Stop loss** | Di atas **level RBS** terdekat di atas 0.79, ditambah buffer |
| **Entry** | **Sell limit di Fib 0.79** |
| **Area konfluensi** | Fib 0.69–0.79, harus bertumpuk dengan zona SBR |
| **Take profit** | **Entry − 4R** (RR 1:4) |
| **Swing low** | Fib 0 |

R = jarak dari entry ke SL.

## Lima aturan

| # | Aturan | Timeframe | Pertanyaan yang dijawab |
|---|---|---|---|
| 1 | Struktur turun dan zona support yang valid | H4 → H1 | Boleh cari sell? Zonanya di mana? |
| 2 | Breakdown dengan close body, lalu tarik Fibonacci | H1 | Support benar-benar patah? |
| 3 | Konfluensi SBR + Fib 0.69–0.79, sell limit di 0.79 | H1 | Di mana masuk? |
| 4 | SL di atas RBS (maks. 0.89), TP di 1:4 | H1 | Di mana keluar? |
| 5 | Lot dari jarak SL, risiko 0,5%, filter pembatal | - | Berapa lot? Kapan tidak boleh? |

Batas yang tidak boleh ditawar:
- **Entry hanya di 0.79.** Tidak mengejar harga kalau order belum terisi.
- **Tidak ada level RBS di antara 0.79 dan 0.89, tidak ada trade.**
- **TP selalu 1:4.** Tidak dipindah lebih dekat karena takut, tidak diperjauh karena serakah.
- **Risiko 0,5% per trade**, lot dihitung dari jarak SL.
- **Maksimal 2 percobaan per zona.**

## Kenapa disusun seperti ini

Semua angka sudah bisa dihitung **sebelum** harga sampai ke area entry: entry di 0.79, SL di atas RBS, TP di 4R. Jadi saat order terisi, tidak ada lagi keputusan yang diambil di bawah tekanan. Level RBS dipakai untuk SL karena level itu adalah atap struktur. Kalau harga kembali close di atasnya, ide bahwa harga akan lanjut turun sudah terbukti salah.

> Beruang Rules tidak membuat Anda selalu benar. Aturan ini membuat Anda hanya masuk di tempat yang sudah ditentukan, dengan kerugian yang sudah diukur sebelum order dipasang.

## Alat yang dipakai

- Chart XAUUSD di TradingView atau MT5.
- Alat gambar **rectangle** untuk zona SBR dan level RBS.
- **Fibonacci retracement** dengan level **1, 0.89, 0.79, 0.69, 0**. Level 0.69, 0.79, dan 0.89 bukan level bawaan. Tambahkan sendiri di pengaturan alat Fibonacci (di TradingView: klik dua kali garis Fibonacci, buka tab level, lalu ubah angkanya). Simpan sebagai template supaya tidak perlu diatur ulang.
- Alat **Short Position** di TradingView untuk melihat entry, SL, TP, dan RR sekaligus.
- [Kalkulator lot](/alat/kalkulator-lot) untuk aturan 5.
- Kalender ekonomi untuk filter berita.

**Tugas:** atur template Fibonacci dengan level di atas, lalu cari satu contoh di chart H4 XAUUSD ketika support patah lalu diuji ulang dari bawah. Belum perlu trading.${DISCLAIMER}`],

  ['Aturan 1: Struktur turun dan zona support yang valid', 9, `Aturan pertama menjawab dua hal: **apakah hari ini boleh mencari sell**, dan **zona mana yang akan dipantau**.

## Cek struktur di H4

| Kondisi di H4 | Keputusan |
|---|---|
| *Lower high* dan *lower low* | Boleh mencari setup Beruang |
| *Higher high* dan *higher low* | **Tidak** memakai Beruang Rules |
| Sideways tanpa arah jelas | Boleh, tapi hanya jika zona sangat jelas. Kalau ragu, lewati |

Patokannya swing yang sudah terbentuk, bukan perasaan bahwa "harga sudah terlalu tinggi". Struktur naik yang belum patah tetap struktur naik.

## Menandai zona support di H1

Zona support yang layak dipantau harus:
1. Sudah **disentuh minimal 2 kali** dan harga memantul dari sana.
2. Ditandai sebagai **zona**, bukan satu garis. Ambil dari area body sampai ekor candle yang memantul.
3. Tebal zona wajar. Zona yang terlalu tebal biasanya melewati area 0.69–0.79 dan sulit dinilai konfluensinya.

### Contoh (ilustrasi)
Harga memantul tiga kali di area **2.374–2.380**. Ekor candle turun sampai 2.374, body-body candle tertahan di sekitar 2.380. Zona yang ditandai: **2.374–2.380**.

## Kesalahan yang sering terjadi
- Menggambar zona dari satu sentuhan saja.
- Memakai garis tipis, lalu menganggap setup gagal karena harga lewat 50 sen.
- Memaksakan setup sell saat struktur H4 jelas sedang naik.

**Tugas:** tandai dua zona support di chart H1 XAUUSD minggu ini. Catat berapa kali masing-masing disentuh.${DISCLAIMER}`],

  ['Aturan 2: Breakdown yang sah dan cara menarik Fibonacci', 10, `Zona support baru bisa menjadi resistance kalau benar-benar **patah**. Setelah itu, Fibonacci ditarik di dorongan turun yang mematahkannya.

## Breakdown yang sah

| Yang terjadi di H1 | Status |
|---|---|
| Candle **body** ditutup di bawah zona | ✅ Breakdown sah |
| Hanya **ekor** yang tembus, body kembali di dalam atau di atas zona | ❌ Belum patah |
| Body tembus, tapi candle berikutnya langsung ditutup kembali di atas zona | ❌ Kemungkinan *false breakdown*, lewati |

Setelah breakdown, tunggu harga membentuk **swing low** baru. Fibonacci baru bisa ditarik setelah swing low itu jelas, yaitu ada candle yang mulai naik dan tidak membuat low baru.

## Menarik Fibonacci retracement

Untuk setup sell, tarik dari **atas ke bawah**:
- **Titik 1 (level 1):** swing high, tempat dorongan turun dimulai.
- **Titik 2 (level 0):** swing low setelah breakdown.

| Level | Fungsi di Beruang Rules |
|---|---|
| 1 | Swing high |
| 0.89 | **Batas SL.** Kalau harga close di atasnya, setup batal |
| 0.79 | **Entry** (sell limit) |
| 0.69 | Batas bawah area konfluensi |
| 0 | Swing low |

### Rumus (untuk dicek manual)
Jarak impuls = swing high − swing low

Level retracement = swing low + (jarak × level)

### Contoh (ilustrasi)
Swing high **2.400**, swing low **2.300**, jarak **100**.

| Level | Hitungan | Harga |
|---|---|---|
| 0.89 | 2.300 + 89 | 2.389 |
| 0.79 | 2.300 + 79 | 2.379 |
| 0.69 | 2.300 + 69 | 2.369 |
| 0 | swing low | 2.300 |

Rumus yang sama berlaku di timeframe apa pun. Kalau Anda menarik Fibonacci di chart H4 atau Daily, cara hitungnya tetap sama. Yang berubah hanya jarak SL dalam dolar, sehingga lotnya juga harus menyesuaikan.

**Tugas:** cari satu breakdown sah di chart H1, tarik Fibonacci dari swing high ke swing low, lalu cocokkan level 0.69, 0.79, dan 0.89 dengan hitungan manual.${DISCLAIMER}`],

  ['Aturan 3: Konfluensi SBR + Fibonacci dan entry di 0.79', 10, `Ini inti Beruang Rules. Kita hanya memasang sell di tempat **zona SBR bertumpuk dengan area Fibonacci 0.69–0.79**, dan entry-nya selalu di **level 0.79**.

## Menilai konfluensi

| Posisi zona SBR | Status | Yang dilakukan |
|---|---|---|
| Bertumpuk dengan **0.69–0.79** | ✅ Setup utama | Siapkan sell limit di 0.79 |
| Seluruhnya di bawah **0.69** | ⚠️ Tidak ada konfluensi | Jangan pasang order. Lewati |
| Seluruhnya di antara **0.79 dan 0.89** | ❌ Terlalu dekat batas 0.89 | Lewati |
| Harga sudah close di atas **0.89** | ❌ Batal | Hapus setup, tunggu struktur baru |

Pada contoh sebelumnya, zona **2.374–2.380** bertumpuk dengan area 0.69 (2.369) sampai 0.79 (2.379). Konfluensinya valid.

## Entry: sell limit di 0.79

- Pasang **sell limit** tepat di harga level **0.79**. Pada contoh: **2.379**.
- SL dan TP dipasang **bersamaan** dengan order (aturan 4), jadi kalau order terisi saat Anda tidak di depan layar, posisinya sudah terlindungi.
- Order hanya dipasang **setelah** konfluensi valid dan SL di atas RBS lolos aturan 4.

### Kapan order dibatalkan sebelum terisi
- Harga turun dan membuat **low baru di bawah Fib 0** sebelum menyentuh 0.79. Swing low berubah, jadi Fibonacci harus ditarik ulang dan semua angka dihitung lagi.
- Ada rilis berita berdampak tinggi dalam **±30 menit** (aturan 5).
- Ada candle H1 yang body-nya close di atas **0.89** sebelum order terisi.

Harga yang naik melewati zona SBR menuju 0.79 **tidak** membatalkan order. Itu justru jalan harga menuju entry, karena 0.79 sering berada di atas zona.

## Yang tidak dilakukan
- Mengejar harga dengan sell market kalau harga berbalik turun sebelum sampai 0.79.
- Memindahkan entry ke 0.69 atau 0.5 karena takut ketinggalan.
- Memasang order tanpa SL.

> Kadang harga berbalik turun sebelum menyentuh 0.79, dan order tidak pernah terisi. Itu bukan kerugian. Itu bagian dari harga sebuah aturan yang jelas.

**Tugas:** dari dua setup yang Anda temukan di aturan 2, catat apakah zonanya bertumpuk dengan 0.69–0.79, lalu tulis di jurnal di harga berapa sell limit akan dipasang.${DISCLAIMER}`],

  ['Aturan 4: Stop loss di atas RBS dan TP 1:4', 9, `SL dan TP sudah harus dihitung **sebelum** order dipasang. Kalau SL tidak lolos aturan, order tidak dipasang.

## Apa itu level RBS di sini

**RBS (Resistance Become Support)** adalah level horizontal di sisi kiri chart yang dulu menjadi **resistance**, lalu ditembus naik dan sempat menahan harga sebagai **support**, sebelum dorongan turun terjadi.

Untuk Beruang Rules, yang dicari adalah **level RBS terdekat di atas entry (0.79)**. Level ini adalah atap struktur. Kalau harga naik lagi dan close di atasnya, ide sell sudah terbukti salah.

## Stop loss

1. Cari level RBS terdekat **di atas 0.79**.
2. SL = **batas atas level RBS + buffer kecil**. Buffer = spread saat itu ditambah sedikit ruang, karena posisi sell ditutup di harga *ask*. Contoh di materi ini memakai buffer 1 dolar.
3. **SL harus di bawah level 0.89.**

| Kondisi | Keputusan |
|---|---|
| Ada RBS di antara 0.79 dan 0.89 | ✅ SL di atas RBS + buffer |
| RBS terdekat ada di atas 0.89 | ❌ Lewati |
| Tidak ada level RBS yang jelas di atas 0.79 | ❌ Lewati |

SL tidak digeser menjauh setelah order terisi.

## Take profit: RR 1:4

R = SL − entry

**TP = entry − (4 × R)**

Seluruh posisi ditutup di TP. Karena entry selalu di 0.79 dan SL paling jauh di 0.89, TP 1:4 umumnya masih di atas Fib 0. Kalau karena buffer yang besar TP ternyata melewati Fib 0, catat di jurnal dan tetap pakai 4R.

### Contoh (ilustrasi)
- Fibonacci: swing high 2.400, swing low 2.300
- Entry: sell limit di 0.79 = **2.379**
- Level RBS terdekat di atas entry: **2.383–2.385** (di bawah 0.89 = 2.389 ✓)
- SL = 2.385 + 1 = **2.386**
- R = 2.386 − 2.379 = **7 dolar**
- **TP = 2.379 − (4 × 7) = 2.351** (RR 1:4)

### Contoh setup dilewati (ilustrasi)
- Fibonacci dan entry sama, tetapi level RBS terdekat di atas 0.79 ada di **2.391–2.394**.
- Level itu di atas 0.89 (2.389). **Lewati.** Tidak ada SL yang sesuai aturan.

**Tugas:** untuk setiap setup yang lolos aturan 3, tandai level RBS di atas 0.79, lalu hitung SL, R, dan TP di jurnal sebelum memasang order.${DISCLAIMER}`],

  ['Aturan 5: Lot, batas risiko, dan filter pembatal', 9, `Setup yang bagus tetap bisa kalah. Aturan kelima memastikan satu kekalahan tidak berarti banyak bagi akun.

## Menghitung lot

1. Risiko per trade = **0,5% × saldo**.
2. Jarak SL dalam dolar harga (contoh: 7 dolar).
3. Untuk XAUUSD, **0,01 lot ≈ 1 dolar per 1 dolar pergerakan harga** (1 lot = 100 oz). Cek spesifikasi kontrak di broker Anda, karena bisa berbeda.
4. Lot = risiko ÷ (jarak SL × nilai per 0,01 lot) × 0,01, lalu **bulatkan ke bawah**.

Atau cukup pakai [kalkulator lot](/alat/kalkulator-lot).

### Contoh (ilustrasi, jarak SL 7 dolar)
| Saldo | Risiko 0,5% | Risiko per 0,01 lot | Lot |
|---|---|---|---|
| $1.000 | $5 | $7 | **Tidak trading.** 0,01 lot pun sudah melebihi batas |
| $2.000 | $10 | $7 | **0,01** ($7) |
| $5.000 | $25 | $7 | **0,03** ($21) |
| $10.000 | $50 | $7 | **0,07** ($49) |

Kalau lot terkecil saja sudah melewati batas risiko, jawabannya **tidak trading**, bukan menaikkan risiko atau memindahkan SL ke bawah level RBS.

## Batas yang mengikat
- **Maksimal 2 percobaan per zona.** Dua kali kena SL di zona yang sama berarti zona itu sudah tidak dihormati pasar.
- Tidak menambah posisi (averaging) kalau harga bergerak melawan.
- Tidak memindahkan SL menjauh.

## Filter pembatal

Order tidak dipasang, atau dibatalkan kalau sudah terpasang, ketika:
- Ada rilis berita berdampak tinggi dalam **30 menit sebelum sampai 30 menit sesudah** harga diperkirakan sampai ke 0.79. Cek kalender ekonomi setiap pagi.
- Spread melebar tidak wajar dibanding biasanya.
- Harga close di atas **0.89**.
- Harga membuat low baru di bawah Fib 0 sebelum menyentuh 0.79.

**Tugas:** tulis filter ini di bagian atas jurnal Anda, lalu centang satu per satu sebelum memasang sell limit.${DISCLAIMER}`],

  ['Checklist Beruang Rules dan contoh lengkap', 10, `Materi ini merangkum semua aturan dalam satu checklist, lalu memakainya pada dua contoh: satu yang diambil dan satu yang dilewati.

## Checklist sebelum memasang sell limit

| # | Pertanyaan | Ya / Tidak |
|---|---|---|
| 1 | Struktur H4 sedang turun (*lower high*, *lower low*)? | |
| 2 | Zona support disentuh minimal 2 kali? | |
| 3 | Zona patah dengan **close body** di H1? | |
| 4 | Fibonacci ditarik dari swing high (1) ke swing low (0) impuls? | |
| 5 | Zona SBR bertumpuk dengan Fib **0.69–0.79**? | |
| 6 | Entry sell limit tepat di **0.79**? | |
| 7 | Ada level **RBS** di atas 0.79, dan SL (RBS + buffer) **di bawah 0.89**? | |
| 8 | TP di **entry − 4R**? | |
| 9 | Lot dihitung untuk risiko maksimal **0,5%**? | |
| 10 | Tidak ada berita besar dalam rentang ±30 menit, spread wajar? | |
| 11 | Ini percobaan ke-1 atau ke-2 di zona ini? | |

**Satu jawaban "tidak" = order tidak dipasang.**

## Contoh 1: setup diambil (ilustrasi)

- **H4:** lower high dan lower low ✓
- **Zona support H1:** 2.374–2.380, disentuh 3 kali ✓
- **Breakdown:** candle H1 close di 2.362 ✓
- **Impuls:** swing high 2.400 → swing low 2.300 (jarak 100)
- **Fibonacci:** 0.69 = 2.369 · 0.79 = 2.379 · 0.89 = 2.389
- **Konfluensi:** zona 2.374–2.380 bertumpuk dengan 0.69–0.79 ✓
- **Entry:** sell limit **2.379** (0.79) ✓
- **RBS:** 2.383–2.385 → **SL 2.386** (di bawah 0.89 ✓) · **R = 7**
- **TP:** 2.379 − 28 = **2.351** (RR 1:4) ✓
- **Lot:** saldo $5.000, risiko $25 → **0,03 lot** (risiko $21) ✓
- **Berita:** tidak ada rilis besar dalam ±30 menit ✓

Order: sell limit 2.379, SL 2.386, TP 2.351, 0,03 lot. Setelah terisi, posisi ditutup di TP atau SL. Tidak ada yang diubah di tengah jalan.

## Contoh 2: setup dilewati (ilustrasi)

- Struktur, zona, dan Fibonacci sama seperti contoh 1.
- Level RBS terdekat di atas 0.79 ternyata di **2.391–2.394**, di atas 0.89 (2.389). Poin 7 = **tidak**.
- Order tidak dipasang, walaupun konfluensinya bagus.

Melewati setup seperti ini bukan peluang yang hilang. Ini aturan yang sedang bekerja.

## Jurnal

Catat setiap setup, termasuk yang dilewati dan order yang tidak terisi: tanggal, struktur H4, zona SBR, titik Fibonacci, entry 0.79, level RBS, SL, R, TP, lot, hasil, dan **apakah semua aturan diikuti**. Setelah 20–30 setup, evaluasi dari jurnal, bukan dari ingatan.

Ada setup yang ragu? Bawa ke menu **Tanya Doktor** atau **Bedah Setup AI** untuk dicek prosesnya.

**Tugas:** jalankan Beruang Rules di akun demo minimal 20 trade dengan checklist ini sebelum memakai uang sungguhan.${DISCLAIMER}`],
];

module.exports = { COURSE, LESSONS };
