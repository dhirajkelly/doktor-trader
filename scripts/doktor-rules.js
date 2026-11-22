// Kelas Academy "Doktor Rules": metode trading resmi Dr. Dhiraj Kelly (Nov 2026).
// Dipasang sekali lewat seed.js (setting academy_doktor_rules); materi yang diedit admin tidak ditimpa.

const COURSE = {
  title: 'Doktor Rules',
  level: 'Menengah',
  summary: 'Metode trading resmi Dr. Dhiraj Kelly: bias H1 dengan EMA 200, entry M5 dari cross EMA 9 dan VWAP, TP/SL dengan Fibonacci, risiko 0,5% per trade, RR minimal 1:2.',
};

const DISCLAIMER = `\n\n---\n\n*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Semua harga dalam contoh adalah ilustrasi. Trading emas, forex, dan derivatif berisiko tinggi dan dapat menghabiskan seluruh modal.*`;

const LESSONS = [
  ['Apa itu Doktor Rules', 8, `**Doktor Rules** adalah satu-satunya metode trading yang dipakai Dr. Dhiraj Kelly. Isinya hanya empat aturan. Sengaja dibuat sedikit supaya bisa dijalankan sama persis setiap hari, tanpa menebak-nebak.

## Empat aturan

| # | Aturan | Timeframe | Pertanyaan yang dijawab |
|---|---|---|---|
| 1 | Bias tren dengan **EMA 200** | H1 | Hari ini cari buy atau sell? |
| 2 | Entry saat **EMA 9 memotong VWAP**, setelah candle close | M5 | Kapan masuk? |
| 3 | TP dan SL dengan **Fibonacci retracement** | M5 | Di mana keluar, untung atau rugi? |
| 4 | Lot dari jarak SL, **risiko 0,5% per trade** | - | Berapa lot? |

Ditambah dua batas yang tidak boleh ditawar:
- **RR minimal 1:2.** Kalau jarak ke target kurang dari dua kali jarak stop loss, setup dilewati.
- **Maksimal 1–2 trade per hari.**

## Kenapa dibuat seperti ini

Banyak trader punya terlalu banyak alat: indikator, pola, zona, berita, semuanya dipakai sekaligus. Akibatnya setiap keputusan bisa dibenarkan, dan tidak ada yang bisa dievaluasi.

Doktor Rules dibangun dengan urutan **risiko dulu, baru peluang**:
- Risiko per trade dikunci di 0,5%, jadi kekalahan beruntun tidak menghancurkan akun.
- RR tidak dikunci. Target mengikuti struktur harga (Fibonacci), bukan angka yang dipaksakan.
- Setiap aturan bisa dicek dengan **ya/tidak**. Kalau ada satu yang "tidak", tidak ada trade.

> Tujuan metode ini bukan menang setiap hari. Tujuannya membuat keputusan yang sama berulang-ulang, supaya hasilnya bisa diukur dan diperbaiki.

## Alat yang dipakai

- Chart XAUUSD di TradingView atau MT5.
- **EMA 200** di H1, **EMA 9** dan **VWAP** di M5, plus **Fibonacci retracement**. Indikator gratis *EMA 9 + VWAP + Fibonacci* sudah tersedia di menu **Tools** member.
- [Kalkulator lot](/alat/kalkulator-lot) untuk aturan 4.

**Tugas:** pasang EMA 200 di chart H1 XAUUSD dan indikator EMA 9 + VWAP + Fibonacci di chart M5. Jangan trading dulu. Cukup amati satu sesi.${DISCLAIMER}`],

  ['Aturan 1: Bias tren H1 dengan EMA 200', 9, `Aturan pertama menentukan **arah yang boleh diambil hari ini**. Dicek di timeframe **H1**, sebelum membuka chart M5.

## Cara membaca

| Kondisi di H1 | Bias | Yang boleh dicari di M5 |
|---|---|---|
| Candle close **di atas** EMA 200 | Bullish | Hanya **buy** |
| Candle close **di bawah** EMA 200 | Bearish | Hanya **sell** |
| Harga menempel atau bolak-balik memotong EMA 200 | Tidak jelas | **Tidak trading** |

Patokannya **harga close candle H1 terakhir yang sudah selesai**, bukan candle yang masih berjalan.

## Kapan bias dianggap tidak jelas

- Dalam beberapa candle H1 terakhir, harga close bergantian di atas dan di bawah EMA 200.
- EMA 200 datar dan harga bergerak menyamping di sekitarnya.
- Harga baru saja menembus EMA 200 dengan satu candle besar saat rilis berita.

Dalam kondisi ini, aturan 2 akan sering memberi sinyal palsu. Lebih baik tidak ada trade.

## Kesalahan yang sering terjadi

- **Melawan bias karena sinyal M5 terlihat bagus.** Di Doktor Rules, sinyal M5 yang berlawanan dengan bias H1 bukan sinyal. Lewati.
- **Mengecek bias di timeframe lain.** Bias hanya dari H1. Kalau H4 atau D1 terlihat berbeda, catat sebagai konteks, tapi aturan tetap H1.
- **Mengubah bias di tengah hari tanpa candle H1 close.** Bias baru berlaku setelah candle H1 berikutnya close di sisi lain EMA 200.

**Tugas:** selama 5 hari, setiap pagi tulis bias H1 (bullish, bearish, atau tidak jelas) sebelum melihat M5. Di akhir hari, cek apakah arah dominan hari itu searah dengan catatan Anda.${DISCLAIMER}`],

  ['Aturan 2: Entry M5, cross EMA 9 dan VWAP', 10, `Setelah bias H1 jelas, pindah ke **M5**. Entry hanya diambil saat **EMA 9 memotong VWAP searah bias**, dan baru dieksekusi **setelah candle M5 close**.

## Syarat entry

**Buy** (bias H1 bullish):
1. EMA 9 memotong VWAP **ke atas**.
2. Candle M5 tempat cross terjadi sudah **close**, dan close-nya di atas VWAP.
3. Entry di candle berikutnya.

**Sell** (bias H1 bearish):
1. EMA 9 memotong VWAP **ke bawah**.
2. Candle M5 tempat cross terjadi sudah **close**, dan close-nya di bawah VWAP.
3. Entry di candle berikutnya.

Cross yang berlawanan dengan bias H1 **diabaikan**.

## Kenapa harus menunggu candle close

Di tengah candle, EMA 9 bisa terlihat sudah memotong VWAP, lalu kembali lagi sebelum candle selesai. Kalau masuk terlalu cepat, Anda masuk di sinyal yang akhirnya tidak pernah ada. Menunggu close memang membuat entry sedikit lebih telat, tapi sinyalnya sudah pasti.

Di TradingView, pasang alert dengan pilihan **Once Per Bar Close** supaya notifikasi hanya muncul untuk cross yang sudah terkonfirmasi.

## Kapan sinyal dilewati

- **Market sideways:** EMA 9 dan VWAP saling silang berkali-kali dalam waktu singkat. Cross di kondisi ini sering palsu.
- **Harga sudah terlalu jauh dari VWAP** saat candle close. Biasanya RR jadi di bawah 1:2 (dibahas di aturan 3 dan 4).
- **Dekat rilis berita besar** (misalnya NFP, CPI, FOMC). Hindari 15–30 menit sebelum dan sesudah rilis.
- **Kuota harian sudah habis** (1–2 trade).

## Catatan soal VWAP di emas

VWAP butuh data volume. Spot gold hanya punya *tick volume* dari broker atau feed, jadi garis VWAP bisa sedikit berbeda antar platform. Pakai satu feed yang sama setiap hari supaya konsisten.

**Tugas:** di akun demo atau lewat replay chart, cari 10 cross EMA 9/VWAP di M5. Tandai mana yang searah bias H1 dan mana yang terjadi saat sideways.${DISCLAIMER}`],

  ['Aturan 3: TP dan SL dengan Fibonacci retracement', 12, `Aturan ketiga menentukan **di mana keluar**, baik saat salah maupun saat benar. Keduanya diambil dari **Fibonacci retracement** yang ditarik di swing M5 terakhir yang searah bias.

## Cara menarik Fibonacci

**Untuk buy:** tarik dari **swing low** ke **swing high** terakhir.
- Level **1.0** = swing low.
- Level **0** = swing high.
- Level standar di antaranya (0.236, 0.382, 0.5, 0.618, 0.786) adalah area koreksi.

**Untuk sell:** tarik dari **swing high** ke **swing low** terakhir.
- Level **1.0** = swing high.
- Level **0** = swing low.

Indikator *EMA 9 + VWAP + Fibonacci* di menu Tools menggambar ini otomatis. Kalau swing yang terdeteksi bukan swing yang Anda maksud, ubah pengaturan *Lookback*.

## Letak SL dan TP

| | Buy | Sell |
|---|---|---|
| **Stop loss** | Sedikit **di bawah level 1.0** (swing low) + buffer spread | Sedikit **di atas level 1.0** (swing high) + buffer spread |
| **Take profit** | Di **level 0** (swing high) | Di **level 0** (swing low) |

Logikanya: kalau harga menembus level 1.0, swing yang menjadi dasar analisa sudah batal. Itu titik di mana ide trade terbukti salah, jadi SL ditaruh di sana. Target diambil di ujung swing, tempat harga pernah berhenti sebelumnya.

## RR mengikuti struktur, bukan dipaksakan

Di Doktor Rules, **RR tidak dikunci** di angka tertentu. RR adalah hasil dari tiga titik: entry, SL di level 1.0, dan TP di level 0.

- Entry dekat level 1.0 → SL pendek, target jauh → RR besar.
- Entry dekat level 0 → SL panjang, target dekat → RR kecil.

Yang dikunci hanya batas bawahnya: **RR minimal 1:2.** Kalau jarak ke TP kurang dari dua kali jarak ke SL, trade **tidak diambil**. Dengan RR 1:2, satu trade yang kena TP menutup dua trade yang kena SL, jadi akun tidak bergantung pada sering menang.

## Contoh (ilustrasi)

Bias H1 bullish. Swing M5 terakhir: low 3.700,00, high 3.712,00.
- Level 0.618 = 3.712,00 − (0,618 × 12,00) = **3.704,58**; level 0.786 = 3.712,00 − (0,786 × 12,00) = **3.702,57**.
- Harga koreksi sampai sekitar 3.703,5 (di antara 0.618 dan 0.786), lalu EMA 9 cross ke atas VWAP. Candle close, entry buy di **3.703,50**.
- SL = 3.700,00 − 0,50 buffer = **3.699,50** (jarak 4,00).
- TP = level 0 = **3.712,00** (jarak 8,50).
- RR = 8,50 ÷ 4,00 = **1:2,1**. Lolos.

Kalau cross baru muncul saat harga di 3.704,00: jarak SL 4,50, jarak TP 8,00, RR 1:1,78. Hampir, tapi di bawah 1:2. **Dilewati.**

Kalau cross baru muncul di 3.708,00: jarak SL 8,50, jarak TP 4,00, RR 1:0,47. **Dilewati.**

**Tugas:** ambil 10 setup dari latihan aturan 2. Tarik Fibonacci-nya, hitung RR masing-masing, lalu coret yang di bawah 1:2.${DISCLAIMER}`],

  ['Aturan 4: Lot dari jarak SL, risiko 0,5%', 10, `Aturan terakhir menjawab **berapa lot**. Lot tidak ditentukan dari feeling, sisa margin, atau keinginan cepat balik modal. Lot dihitung dari **jarak SL** dengan risiko tetap **0,5% modal per trade**.

## Rumus

**Lot = (Modal × 0,5%) ÷ (Jarak SL dalam $ × 100)**

Angka 100 berlaku untuk XAUUSD dengan ukuran kontrak 100 oz per lot: pergerakan harga $1 = $100 untuk 1 lot (atau $1 untuk 0,01 lot). Cek *Specification* di MT5 karena ukuran kontrak bisa berbeda antar jenis akun.

Selalu **bulatkan ke bawah** ke langkah lot terdekat (0,01), supaya risiko tidak melewati 0,5%.

## Contoh (lanjutan dari aturan 3)

- Modal $10.000 → risiko 0,5% = **$50**.
- Jarak SL = 3.703,50 − 3.699,50 = **4,00**.
- Lot = 50 ÷ (4,00 × 100) = 0,125 → dibulatkan ke bawah menjadi **0,12 lot**.
- Rugi jika SL kena = 4,00 × 100 × 0,12 = **$48,00**.
- Untung jika TP kena = 8,50 × 100 × 0,12 = **$102,00**.

| Modal | Risiko 0,5% | Jarak SL 4,00 | Jarak SL 8,00 |
|---|---|---|---|
| $1.000 | $5 | 0,01 lot | lewati (0,01 lot = $8) |
| $5.000 | $25 | 0,06 lot | 0,03 lot |
| $10.000 | $50 | 0,12 lot | 0,06 lot |

Perhatikan baris pertama: dengan modal $1.000 dan SL 8,00, lot terkecil 0,01 sudah berisiko $8 (0,8%). Kalau lot minimum sudah melebihi 0,5%, **setup dilewati**, bukan risikonya yang dinaikkan.

## Kenapa 0,5%

Kekalahan beruntun pasti terjadi, bahkan pada metode yang disiplin. Risiko kecil memberi ruang untuk bertahan.

| Kalah beruntun | Sisa modal (risiko 0,5%) | Sisa modal (risiko 5%) |
|---|---|---|
| 5 kali | sekitar 97,5% | sekitar 77,4% |
| 10 kali | sekitar 95,1% | sekitar 59,9% |

Dengan risiko 0,5% dan maksimal 2 trade per hari, kerugian terburuk dalam sehari sekitar **1% modal**. Angka ini juga masih jauh di bawah batas rugi harian yang umum dipakai akun prop firm.

**Tugas:** hitung lot untuk 10 setup dari latihan aturan 3 dengan modal Anda sendiri. Cocokkan hasilnya dengan [kalkulator lot](/alat/kalkulator-lot).${DISCLAIMER}`],

  ['Batas harian dan kapan tidak trading', 8, `Doktor Rules juga mengatur **kapan berhenti**. Bagian ini sering diremehkan, padahal di sinilah kebanyakan akun rusak: bukan di setup yang salah, tapi di trade tambahan setelah setup yang salah.

## Batas harian

- **Maksimal 1–2 trade per hari.** Setelah kuota habis, chart ditutup, apa pun yang terjadi.
- Kalau trade pertama kena SL, trade kedua **hanya** boleh diambil jika semua aturan terpenuhi dari awal. Bukan untuk "balas dendam".
- Tidak ada menambah posisi (averaging) di trade yang sedang rugi.
- SL tidak digeser menjauh setelah posisi berjalan.

## Hari atau jam tanpa trading

- Bias H1 **tidak jelas** (lihat aturan 1).
- **15–30 menit sebelum dan sesudah** rilis berita besar seperti NFP, CPI, dan keputusan suku bunga Fed.
- Spread melebar jauh dari biasanya (sering terjadi saat pergantian hari broker dan saat rilis berita).
- Anda sedang lelah, emosional, atau baru saja kalah dan ingin cepat balik modal.

## Tidak ada setup juga keputusan

Hari tanpa trade karena tidak ada setup yang lolos adalah hari yang **berhasil**: Anda menjalankan aturan. Catat di jurnal sebagai "tidak ada setup", sama pentingnya dengan mencatat trade.

**Tugas:** tulis batas harian Anda sendiri di kertas atau catatan HP (jumlah trade, jam trading, kondisi berhenti) dan letakkan di dekat layar.${DISCLAIMER}`],

  ['Checklist Doktor Rules dan contoh lengkap', 10, `Gunakan checklist ini **setiap kali** sebelum menekan tombol. Satu jawaban "tidak" berarti tidak ada trade.

## Checklist

| # | Pertanyaan | Ya / Tidak |
|---|---|---|
| 1 | Candle H1 terakhir close jelas di atas (buy) atau di bawah (sell) EMA 200? | |
| 2 | EMA 9 memotong VWAP di M5 **searah** bias H1? | |
| 3 | Candle M5 tempat cross terjadi **sudah close**? | |
| 4 | Fibonacci sudah ditarik di swing M5 terakhir yang searah bias? | |
| 5 | SL di luar level 1.0 + buffer, TP di level 0? | |
| 6 | RR **minimal 1:2**? | |
| 7 | Lot dihitung dari jarak SL dengan risiko **0,5%** dan dibulatkan ke bawah? | |
| 8 | Tidak ada berita besar dalam 30 menit ke depan? | |
| 9 | Kuota harian (1–2 trade) masih ada? | |

## Contoh lengkap (ilustrasi)

Modal $10.000.

1. **H1:** candle terakhir close di 3.709, EMA 200 di 3.688. Bias **bullish**, hanya cari buy.
2. **M5:** swing low 3.700,00, swing high 3.712,00. Harga koreksi ke area 3.703,5.
3. **Cross:** EMA 9 memotong VWAP ke atas. Candle close di 3.703,70, di atas VWAP. Entry buy di candle berikutnya, **3.703,50**.
4. **Fibonacci:** SL **3.699,50** (di bawah level 1.0 + buffer 0,50), TP **3.712,00** (level 0).
5. **RR:** 8,50 ÷ 4,00 = **1:2,1**. Lolos.
6. **Lot:** $50 ÷ (4,00 × 100) = 0,125 → **0,12 lot**. Risiko $48,00, potensi untung $102,00.
7. **Berita:** tidak ada rilis besar dalam 30 menit. Kuota: ini trade pertama hari ini.

Semua "ya". Order dipasang lengkap dengan SL dan TP, lalu dibiarkan. Hasilnya apa pun, trade dicatat di jurnal.

## Jurnal

Catat setiap trade dan setiap hari tanpa setup: tanggal, bias H1, jam cross, entry, SL, TP, RR, lot, hasil, dan **apakah semua aturan diikuti**. Setelah 20–30 trade, evaluasi dari jurnal, bukan dari ingatan. Pertanyaan utamanya: kerugian datang dari metode, atau dari aturan yang dilanggar?

Ada setup yang ragu? Ceritakan di menu **Tanya Doktor** atau **Bedah Setup AI** untuk dicek prosesnya.

**Tugas:** jalankan Doktor Rules di akun demo minimal 20 trade dengan checklist ini sebelum memakai uang sungguhan.${DISCLAIMER}`],
];

module.exports = { COURSE, LESSONS };
