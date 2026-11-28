// Kelas Academy "Beruang Rules": setup SELL dari kombinasi SBR (Support Become Resistance) + Fibonacci retracement.
// DRAFT untuk dicek owner. Belum dipasang di seed.js, jadi belum tampil di Academy.

const COURSE = {
  title: 'Beruang Rules',
  level: 'Menengah',
  summary: 'Setup sell XAUUSD dari support yang patah lalu menjadi resistance (SBR), dikonfirmasi Fibonacci retracement 0.5–0.618 dan candle penolakan. SL di bawah 0.786, TP di swing low dan ekstensi -0.272, RR minimal 1:1,5, risiko 0,5% per trade.',
};

const DISCLAIMER = `\n\n---\n\n*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Semua harga dalam contoh adalah ilustrasi. Trading emas, forex, dan derivatif berisiko tinggi dan dapat menghabiskan seluruh modal.*`;

const LESSONS = [
  ['Apa itu Beruang Rules', 8, `**Beruang Rules** adalah aturan untuk satu jenis setup saja: **sell setelah support patah lalu diuji ulang dari bawah**. "Beruang" (bear) dipakai karena setup ini hanya mencari posisi jual.

Idenya sederhana. Support yang sudah ditembus sering berganti peran menjadi resistance. Ini disebut **SBR (Support Become Resistance)**. Saat harga naik lagi ke zona itu, kita tidak langsung sell. Kita menunggu dua konfirmasi tambahan: zona itu harus bertumpuk dengan **Fibonacci retracement 0.5–0.618**, dan harus muncul **candle penolakan bearish**.

## Lima aturan

| # | Aturan | Timeframe | Pertanyaan yang dijawab |
|---|---|---|---|
| 1 | Struktur turun dan zona support yang valid | H4 → H1 | Boleh cari sell? Zonanya di mana? |
| 2 | Breakdown dengan close body, lalu tarik Fibonacci | H1 | Support benar-benar patah? |
| 3 | Konfluensi SBR + Fib 0.5–0.618, lalu candle penolakan | H1 / M15 | Kapan masuk? |
| 4 | SL di bawah 0.786, TP di swing low dan -0.272 | H1 | Di mana keluar? |
| 5 | Lot dari jarak SL, risiko 0,5%, filter pembatal | - | Berapa lot? Kapan tidak boleh? |

Batas yang tidak boleh ditawar:
- **RR ke TP1 minimal 1:1,5.** Kalau kurang, setup dilewati.
- **Risiko 0,5% per trade**, lot dihitung dari jarak SL.
- **Maksimal 2 percobaan per zona.** Dua kali kena SL berarti zona itu sudah rusak.
- **Tidak ada candle penolakan, tidak ada entry.** Harga menyentuh zona saja belum cukup.

## Kenapa konfluensi?

Zona SBR saja sering ditembus lagi. Fibonacci saja hanyalah garis hasil hitungan. Saat keduanya bertumpuk di area yang sama dan pasar menunjukkan penolakan, alasan untuk sell menjadi lebih kuat. Titik di mana ide itu terbukti salah juga jadi jelas: di atas candle penolakan, dan paling jauh di level 0.786.

> Beruang Rules tidak membuat Anda selalu benar. Aturan ini membuat Anda hanya masuk di tempat yang sudah ditentukan, dengan kerugian yang sudah diukur sebelum klik sell.

## Alat yang dipakai

- Chart XAUUSD di TradingView atau MT5.
- Alat gambar **rectangle** untuk zona dan **Fibonacci retracement** dengan level 0.382, 0.5, 0.618, 0.786, serta ekstensi -0.272 dan -0.618.
- [Kalkulator lot](/alat/kalkulator-lot) untuk aturan 5.
- Kalender ekonomi untuk filter berita.

**Tugas:** buka chart H4 XAUUSD dan cari satu contoh di masa lalu ketika support patah lalu diuji ulang dari bawah. Belum perlu trading.${DISCLAIMER}`],

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
3. Tebal zona wajar. Untuk XAUUSD di H1, umumnya beberapa dolar. Zona yang terlalu tebal membuat SL tidak masuk akal.

### Contoh (ilustrasi)
Harga memantul tiga kali di area **2.350–2.353**. Ekor candle turun sampai 2.350, body-body candle tertahan di sekitar 2.353. Zona yang ditandai: **2.350–2.353**.

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
- **Titik 1 (1.0):** swing high, tempat dorongan turun dimulai.
- **Titik 2 (0):** swing low setelah breakdown.

Level yang dipakai:

| Level | Fungsi di Beruang Rules |
|---|---|
| 0.382 | Retracement dangkal, konfluensi lemah |
| 0.5 – 0.618 | **Area utama** untuk mencari entry |
| 0.786 | Batas terakhir. Kalau ditembus, setup batal |
| -0.272 | Target kedua (TP2) |
| -0.618 | Target opsional (TP3) |

### Rumus (untuk dicek manual)
Jarak impuls = swing high − swing low

Level retracement = swing low + (jarak × level)

Level ekstensi = swing low − (jarak × level ekstensi)

### Contoh (ilustrasi)
Swing high **2.380**, swing low **2.320**, jarak **60**.

| Level | Hitungan | Harga |
|---|---|---|
| 0.382 | 2.320 + 22,92 | 2.342,92 |
| 0.5 | 2.320 + 30,00 | 2.350,00 |
| 0.618 | 2.320 + 37,08 | 2.357,08 |
| 0.786 | 2.320 + 47,16 | 2.367,16 |
| -0.272 | 2.320 − 16,32 | 2.303,68 |
| -0.618 | 2.320 − 37,08 | 2.282,92 |

**Tugas:** cari satu breakdown sah di chart H1, tarik Fibonacci dari swing high ke swing low, lalu cocokkan level 0.5 dan 0.618 dengan hitungan manual.${DISCLAIMER}`],

  ['Aturan 3: Konfluensi SBR + Fibonacci dan candle penolakan', 10, `Ini inti Beruang Rules. Kita hanya mencari sell di tempat **zona SBR bertumpuk dengan Fibonacci 0.5–0.618**, dan hanya setelah pasar menunjukkan **penolakan**.

## Menilai konfluensi

| Posisi zona SBR | Status | Yang dilakukan |
|---|---|---|
| Bertumpuk dengan **0.5–0.618** | ✅ Setup utama | Tunggu candle penolakan |
| Hanya menyentuh **0.382** | ⚠️ Lemah | Boleh dipantau, tapi jangan dipaksakan |
| Di atas **0.786** | ❌ Tidak valid | Lewati |
| Harga sudah close di atas 0.786 | ❌ Batal | Hapus setup, tunggu struktur baru |

Pada contoh sebelumnya, zona **2.350–2.353** berada di antara 0.5 (2.350) dan 0.618 (2.357,08). Konfluensinya valid.

## Trigger entry: candle penolakan

Saat harga masuk zona konfluensi, tunggu **salah satu** candle berikut di H1 (atau M15 untuk entry yang lebih rapat):

1. **Pin bar bearish:** ekor atas panjang (minimal sekitar dua kali panjang body), body ditutup di bawah zona.
2. **Bearish engulfing:** body candle merah menutupi body candle hijau sebelumnya, dan ditutup di bawah zona.

Syarat yang sama untuk keduanya: **candle harus sudah close**, dan **close-nya di bawah zona SBR**. Candle yang masih berjalan belum dihitung.

Entry dilakukan di harga close candle trigger, atau di pembukaan candle berikutnya.

## Yang bukan trigger
- Harga hanya menyentuh zona lalu bergerak sideways.
- Candle merah biasa yang close-nya masih di dalam atau di atas zona.
- Pin bar yang ekornya menembus 0.786. Struktur sudah terlalu rusak.

> Menunggu candle penolakan memang membuat sebagian pergerakan terlewat. Itu biaya yang dibayar supaya tidak sell di zona yang sedang ditembus.

**Tugas:** dari dua setup yang Anda temukan di aturan 2, catat apakah zonanya bertumpuk dengan 0.5–0.618 dan apakah muncul candle penolakan. Tulis jawabannya ya atau tidak.${DISCLAIMER}`],

  ['Aturan 4: Stop loss, take profit, dan break-even', 9, `Sebelum entry, tiga angka harus sudah tertulis: **SL, TP1, dan TP2**. Kalau salah satunya tidak masuk aturan, tidak ada trade.

## Stop loss

- SL di **atas high candle penolakan + buffer**.
- Buffer = spread saat itu + ruang kecil agar SL tidak tersentuh oleh ekor yang wajar. Untuk XAUUSD di H1, contoh di materi ini memakai 2 dolar.
- **SL harus di bawah level 0.786.** Kalau SL yang masuk akal ternyata di atas 0.786, setup dilewati.

## Take profit

| Target | Letak | Tindakan |
|---|---|---|
| **TP1** | Swing low (Fib 0) | Tutup **50%** posisi, geser SL ke harga entry (*break-even*) |
| **TP2** | Ekstensi **-0.272** | Tutup sisa posisi |
| **TP3** (opsional) | Ekstensi **-0.618** | Hanya kalau Anda sudah memutuskannya sebelum entry |

## Syarat RR

RR ke TP1 = (entry − TP1) ÷ (SL − entry)

**RR ke TP1 minimal 1:1,5.** Kalau kurang, lewati setup, walaupun konfluensinya bagus.

### Contoh (ilustrasi)
- Entry: **2.349** (close candle bearish engulfing)
- High candle penolakan: **2.356** → SL = 2.356 + 2 = **2.358** (masih di bawah 0.786 = 2.367,16 ✓)
- Jarak SL: 2.358 − 2.349 = **9 dolar**
- TP1: **2.320** → jarak 29 → RR = 29 ÷ 9 ≈ **1:3,2** ✓
- TP2: **2.303,68** → jarak 45,32 → RR ≈ **1:5,0**

## Setelah TP1 tercapai
SL sisa posisi dipindah ke **2.349** (harga entry). Dari titik ini, sisa posisi tidak lagi menambah risiko kerugian dari pergerakan harga biasa. Gap dan slippage tetap bisa terjadi.

**Tugas:** untuk setiap setup yang lolos aturan 3, hitung SL, TP1, TP2, dan RR di jurnal sebelum mengecek bagaimana harga bergerak sesudahnya.${DISCLAIMER}`],

  ['Aturan 5: Lot, batas risiko, dan filter pembatal', 9, `Setup yang bagus tetap bisa kalah. Aturan kelima memastikan satu kekalahan tidak berarti banyak bagi akun.

## Menghitung lot

1. Risiko per trade = **0,5% × saldo**.
2. Jarak SL dalam dolar harga (contoh: 9 dolar).
3. Untuk XAUUSD, **0,01 lot ≈ 1 dolar per 1 dolar pergerakan harga** (1 lot = 100 oz). Cek spesifikasi kontrak di broker Anda, karena bisa berbeda.
4. Lot = risiko ÷ (jarak SL × nilai per 0,01 lot) × 0,01, lalu **bulatkan ke bawah**.

Atau cukup pakai [kalkulator lot](/alat/kalkulator-lot).

### Contoh (ilustrasi)
| Saldo | Risiko 0,5% | Jarak SL | Risiko per 0,01 lot | Lot |
|---|---|---|---|---|
| $1.000 | $5 | 9 | $9 | **Tidak trading.** 0,01 lot pun sudah melebihi batas |
| $2.000 | $10 | 9 | $9 | **0,01** |
| $5.000 | $25 | 9 | $9 | **0,02** ($18) |

Baris pertama sengaja ditampilkan. Kalau lot terkecil saja sudah melewati batas risiko, jawabannya **tidak trading**, bukan menaikkan risiko.

## Batas yang mengikat
- **Maksimal 2 percobaan per zona.** Dua kali kena SL di zona yang sama berarti zona itu sudah tidak dihormati pasar.
- Tidak menambah posisi (averaging) kalau harga bergerak melawan.
- Tidak memindahkan SL menjauh.

## Filter pembatal

Setup dibatalkan, atau entry ditunda, kalau:
- Ada rilis berita berdampak tinggi dalam **30 menit sebelum sampai 30 menit sesudah** waktu entry. Cek kalender ekonomi setiap pagi.
- Spread melebar tidak wajar dibanding biasanya.
- Ada candle H1 yang **body**-nya close **di atas zona SBR**. Zona itu sudah kembali ditembus.
- Harga close di atas **0.786**.

**Tugas:** tulis ketiga filter ini di bagian atas jurnal Anda, lalu centang satu per satu sebelum setiap entry.${DISCLAIMER}`],

  ['Checklist Beruang Rules dan contoh lengkap', 10, `Materi ini merangkum semua aturan dalam satu checklist, lalu memakainya pada dua contoh: satu yang diambil dan satu yang dilewati.

## Checklist sebelum klik sell

| # | Pertanyaan | Ya / Tidak |
|---|---|---|
| 1 | Struktur H4 sedang turun (*lower high*, *lower low*)? | |
| 2 | Zona support disentuh minimal 2 kali? | |
| 3 | Zona patah dengan **close body** di H1? | |
| 4 | Fibonacci ditarik dari swing high ke swing low impuls? | |
| 5 | Zona SBR bertumpuk dengan Fib **0.5–0.618**? | |
| 6 | Ada candle penolakan bearish yang **close di bawah zona**? | |
| 7 | SL di atas candle penolakan + buffer, dan **di bawah 0.786**? | |
| 8 | RR ke TP1 minimal **1:1,5**? | |
| 9 | Lot dihitung untuk risiko maksimal **0,5%**? | |
| 10 | Tidak ada berita besar dalam rentang ±30 menit, spread wajar? | |
| 11 | Ini percobaan ke-1 atau ke-2 di zona ini? | |

**Satu jawaban "tidak" = tidak ada trade.**

## Contoh 1: setup diambil (ilustrasi)

- **H4:** lower high dan lower low ✓
- **Zona support H1:** 2.350–2.353, disentuh 3 kali ✓
- **Breakdown:** candle H1 close di 2.341 ✓
- **Impuls:** swing high 2.380 → swing low 2.320 (jarak 60)
- **Fibonacci:** 0.5 = 2.350,00 · 0.618 = 2.357,08 · 0.786 = 2.367,16
- **Konfluensi:** zona 2.350–2.353 berada di 0.5–0.618 ✓
- **Trigger:** bearish engulfing, high 2.356, close 2.349 ✓
- **Entry:** 2.349 · **SL:** 2.358 (jarak 9) ✓ di bawah 0.786
- **TP1:** 2.320 (RR ≈ 1:3,2) ✓ · **TP2:** 2.303,68 (RR ≈ 1:5,0)
- **Lot:** saldo $2.000, risiko $10 → **0,01 lot** (risiko $9) ✓
- **Berita:** tidak ada rilis besar dalam ±30 menit ✓

Rencana keluar: di 2.320, tutup 50% dan geser SL ke 2.349. Sisa posisi ditutup di 2.303,68 atau di 2.349 kalau harga berbalik.

## Contoh 2: setup dilewati (ilustrasi)

- Struktur dan breakdown sama seperti contoh 1, tetapi zona support lama ada di **2.341–2.344**.
- Zona itu hanya menyentuh **0.382 (2.342,92)**, tidak sampai 0.5–0.618. Konfluensi lemah, poin 5 = **tidak**.
- Harga menembus zona, naik sampai 2.369, lalu close di atas **0.786 (2.367,16)**. Setup **batal**.

Melewati setup seperti ini bukan peluang yang hilang. Ini aturan yang sedang bekerja.

## Jurnal

Catat setiap setup, termasuk yang dilewati: tanggal, struktur H4, zona, titik Fibonacci, konfluensi, trigger, entry, SL, TP1, TP2, RR, lot, hasil, dan **apakah semua aturan diikuti**. Setelah 20–30 setup, evaluasi dari jurnal, bukan dari ingatan.

Ada setup yang ragu? Bawa ke menu **Tanya Doktor** atau **Bedah Setup AI** untuk dicek prosesnya.

**Tugas:** jalankan Beruang Rules di akun demo minimal 20 trade dengan checklist ini sebelum memakai uang sungguhan.${DISCLAIMER}`],
];

module.exports = { COURSE, LESSONS };
