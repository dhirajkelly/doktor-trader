// Kelas Academy "Doktor Rules": metode trading resmi Dr. Dhiraj Kelly (Nov 2026).
// Dipasang sekali lewat seed.js (setting academy_doktor_rules); materi yang diedit admin tidak ditimpa.

const COURSE = {
  title: 'Doktor Rules',
  level: 'Menengah',
  summary: 'Metode trading resmi Dr. Dhiraj Kelly: bias H1 dengan EMA 200, entry M5 dari cross EMA 9 dan VWAP, SL di swing M5 terakhir dan TP dua kali jarak SL (RR 1:2), risiko 0,5% per trade.',
};

const DISCLAIMER = `\n\n---\n\n*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Semua harga dalam contoh adalah ilustrasi. Trading emas, forex, dan derivatif berisiko tinggi dan dapat menghabiskan seluruh modal.*`;

const LESSONS = [
  ['Apa itu Doktor Rules', 8, `**Doktor Rules** adalah satu-satunya metode trading yang dipakai Dr. Dhiraj Kelly. Isinya hanya empat aturan. Sengaja dibuat sedikit supaya bisa dijalankan sama persis setiap hari, tanpa menebak-nebak.

## Empat aturan

| # | Aturan | Timeframe | Pertanyaan yang dijawab |
|---|---|---|---|
| 1 | Bias tren dengan **EMA 200** | H1 | Hari ini cari buy atau sell? |
| 2 | Entry saat **EMA 9 memotong VWAP**, setelah candle close | M5 | Kapan masuk? |
| 3 | SL di **swing terakhir**, TP **dua kali jarak SL** | M5 | Di mana keluar, untung atau rugi? |
| 4 | Lot dari jarak SL, **risiko 0,5% per trade** | - | Berapa lot? |

Ditambah dua batas yang tidak boleh ditawar:
- **RR selalu 1:2.** Target selalu dua kali jarak stop loss, jadi tidak ada target yang ditebak.
- **Maksimal 1–2 trade per hari.**

## Kenapa dibuat seperti ini

Banyak trader punya terlalu banyak alat: indikator, pola, zona, berita, semuanya dipakai sekaligus. Akibatnya setiap keputusan bisa dibenarkan, dan tidak ada yang bisa dievaluasi.

Doktor Rules dibangun dengan urutan **risiko dulu, baru peluang**:
- Risiko per trade dikunci di 0,5%, jadi kekalahan beruntun tidak menghancurkan akun.
- SL ditaruh di titik di mana ide trade terbukti salah (swing terakhir), dan TP dihitung dari jarak SL itu.
- Setiap aturan bisa dicek dengan **ya/tidak**. Kalau ada satu yang "tidak", tidak ada trade.

> Tujuan metode ini bukan menang setiap hari. Tujuannya membuat keputusan yang sama berulang-ulang, supaya hasilnya bisa diukur dan diperbaiki.

## Alat yang dipakai

- Chart XAUUSD di TradingView atau MT5.
- **EMA 200** di H1, **EMA 9** dan **VWAP** di M5. Indikator gratis *EMA 9 + VWAP + Fibonacci* di menu **Tools** member bisa dipakai untuk EMA 9 dan VWAP. Garis Fibonacci-nya tidak dipakai di Doktor Rules dan boleh dimatikan.
- [Kalkulator lot](/alat/kalkulator-lot) untuk aturan 4.

**Tugas:** pasang EMA 200 di chart H1 XAUUSD serta EMA 9 dan VWAP di chart M5. Jangan trading dulu. Cukup amati satu sesi.${DISCLAIMER}`],

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
- **Harga sudah terlalu jauh dari swing terakhir** saat candle close. Jarak SL jadi lebar, lot mengecil, dan sering lot minimum pun sudah melewati risiko 0,5% (dibahas di aturan 3 dan 4).
- **Dekat rilis berita besar** (misalnya NFP, CPI, FOMC). Hindari 15–30 menit sebelum dan sesudah rilis.
- **Kuota harian sudah habis** (1–2 trade).

## Catatan soal VWAP di emas

VWAP butuh data volume. Spot gold hanya punya *tick volume* dari broker atau feed, jadi garis VWAP bisa sedikit berbeda antar platform. Pakai satu feed yang sama setiap hari supaya konsisten.

**Tugas:** di akun demo atau lewat replay chart, cari 10 cross EMA 9/VWAP di M5. Tandai mana yang searah bias H1 dan mana yang terjadi saat sideways.${DISCLAIMER}`],

  ['Aturan 3: SL di swing terakhir, TP 2R', 10, `Aturan ketiga menentukan **di mana keluar**, baik saat salah maupun saat benar. SL ditaruh di **swing M5 terakhir**, dan TP dihitung dari jarak SL itu: **dua kali jarak SL** (disebut 2R).

## Menandai swing terakhir

Swing dicari di M5, di koreksi terakhir sebelum cross EMA 9 dan VWAP.

- **Swing low** (untuk buy): candle yang **low**-nya lebih rendah dari low 3 candle di kirinya dan 3 candle di kanannya. Ambil swing low terakhir sebelum cross.
- **Swing high** (untuk sell): candle yang **high**-nya lebih tinggi dari high 3 candle di kirinya dan 3 candle di kanannya. Ambil swing high terakhir sebelum cross.

Yang dipakai adalah **ujung sumbu** (low atau high candle), bukan body candle.

## Letak SL dan TP

| | Buy | Sell |
|---|---|---|
| **Stop loss** | Sedikit **di bawah swing low** + buffer | Sedikit **di atas swing high** + buffer + spread |
| **Take profit** | Entry + **2 × jarak SL** | Entry − **2 × jarak SL** |

Logikanya: kalau harga menembus swing terakhir, koreksi yang menjadi dasar entry sudah batal. Itu titik di mana ide trade terbukti salah, jadi SL ditaruh di sana. TP tidak ditebak dari struktur. TP selalu dua kali jarak SL, jadi satu trade yang kena TP menutup dua trade yang kena SL.

Buffer dipakai supaya SL tidak kena hanya karena spread atau sumbu kecil. Untuk XAUUSD, contoh di materi ini memakai buffer 0,50. Sesuaikan dengan spread di akun Anda.

## Kapan setup dilewati

- **Jarak SL terlalu kecil**, kurang dari 3 kali spread saat itu. SL sesempit ini mudah kena oleh gerakan acak.
- **Jarak SL terlalu lebar** sampai lot minimum 0,01 sudah berisiko lebih dari 0,5% modal (lihat aturan 4).
- **Swing tidak jelas**, misalnya koreksi terlalu dangkal sehingga tidak ada swing yang memenuhi syarat 3 candle kiri dan kanan.

## Catatan backtest

Versi awal Doktor Rules memakai Fibonacci retracement untuk SL dan TP. Di backtest internal kami (XAUUSD M5 Jan 2023–Okt 2025, ditambah beberapa pair forex), versi Fibonacci maupun versi swing dengan TP tetap **belum menunjukkan hasil yang konsisten**: bagus di satu periode atau pasar, buruk di yang lain. Fibonacci dibuang supaya aturannya lebih sederhana dan lebih mudah dicek, **bukan** karena versi ini terbukti lebih menguntungkan.

Jadi perlakukan Doktor Rules sebagai **kerangka disiplin** (bias jelas, entry setelah candle close, SL di titik ide trade batal, risiko 0,5%, target terukur), bukan sistem yang terbukti menghasilkan. Latih dan catat di akun demo dulu sebelum memakai uang sungguhan.

## Contoh (ilustrasi)

Bias H1 bullish. Di M5, swing low terakhir sebelum cross ada di **3.700,00**.
- EMA 9 cross ke atas VWAP, candle close. Entry buy di **3.703,50**.
- SL = 3.700,00 − 0,50 buffer = **3.699,50**. Jarak SL = 3.703,50 − 3.699,50 = **4,00**.
- TP = 3.703,50 + (2 × 4,00) = **3.711,50**.
- RR = 8,00 ÷ 4,00 = **1:2**.

Kalau cross baru muncul saat harga di 3.708,00, jarak SL menjadi 8,50 dan TP di 3.725,00. Hitungan tetap sama, tapi lot akan lebih kecil (aturan 4).

**Tugas:** ambil 10 setup dari latihan aturan 2. Tandai swing terakhirnya, hitung SL dan TP masing-masing, lalu coret yang jarak SL-nya kurang dari 3 kali spread.${DISCLAIMER}`],

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
- Untung jika TP kena = 8,00 × 100 × 0,12 = **$96,00**.

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
| 4 | Swing M5 terakhir sebelum cross sudah ditandai? | |
| 5 | SL di luar swing + buffer, dan jarak SL minimal 3 kali spread? | |
| 6 | TP = entry ± **2 × jarak SL** (RR 1:2)? | |
| 7 | Lot dihitung dari jarak SL dengan risiko **0,5%** dan dibulatkan ke bawah? | |
| 8 | Tidak ada berita besar dalam 30 menit ke depan? | |
| 9 | Kuota harian (1–2 trade) masih ada? | |

## Contoh lengkap (ilustrasi)

Modal $10.000.

1. **H1:** candle terakhir close di 3.709, EMA 200 di 3.688. Bias **bullish**, hanya cari buy.
2. **M5:** harga koreksi, swing low terakhir terbentuk di 3.700,00.
3. **Cross:** EMA 9 memotong VWAP ke atas. Candle close di 3.703,70, di atas VWAP. Entry buy di candle berikutnya, **3.703,50**.
4. **SL dan TP:** SL **3.699,50** (swing low 3.700,00 − buffer 0,50), jarak 4,00. Spread saat itu jauh di bawah 4,00 ÷ 3. TP = 3.703,50 + 2 × 4,00 = **3.711,50**.
5. **RR:** 8,00 ÷ 4,00 = **1:2**.
6. **Lot:** $50 ÷ (4,00 × 100) = 0,125 → **0,12 lot**. Risiko $48,00, potensi untung $96,00.
7. **Berita:** tidak ada rilis besar dalam 30 menit. Kuota: ini trade pertama hari ini.

Semua "ya". Order dipasang lengkap dengan SL dan TP, lalu dibiarkan. Hasilnya apa pun, trade dicatat di jurnal.

## Jurnal

Catat setiap trade dan setiap hari tanpa setup: tanggal, bias H1, jam cross, entry, SL, TP, RR, lot, hasil, dan **apakah semua aturan diikuti**. Setelah 20–30 trade, evaluasi dari jurnal, bukan dari ingatan. Pertanyaan utamanya: kerugian datang dari metode, atau dari aturan yang dilanggar?

Ada setup yang ragu? Ceritakan di menu **Tanya Doktor** atau **Bedah Setup AI** untuk dicek prosesnya.

**Tugas:** jalankan Doktor Rules di akun demo minimal 20 trade dengan checklist ini sebelum memakai uang sungguhan.${DISCLAIMER}`],
];

module.exports = { COURSE, LESSONS };
