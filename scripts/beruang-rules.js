// Kelas Academy "Beruang Rules": setup SELL dari kombinasi SBR (Support Become Resistance) + Fibonacci retracement.
// Level Fibonacci khusus: area entry 0.69–0.79, SL di 0.89, TP di 0 (sesuai chart owner, 28 Nov 2026).
// DRAFT untuk dicek owner. Belum dipasang di seed.js, jadi belum tampil di Academy.

const COURSE = {
  title: 'Beruang Rules',
  level: 'Menengah',
  summary: 'Setup sell XAUUSD dari support yang patah lalu menjadi resistance (SBR), dikonfirmasi Fibonacci retracement 0.69–0.79 dan candle penolakan. SL di level 0.89, TP di swing low (Fib 0) dan ekstensi -0.272, RR minimal 1:1,5, risiko 0,5% per trade.',
};

const DISCLAIMER = `\n\n---\n\n*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Semua harga dalam contoh adalah ilustrasi. Trading emas, forex, dan derivatif berisiko tinggi dan dapat menghabiskan seluruh modal.*`;

const LESSONS = [
  ['Apa itu Beruang Rules', 8, `**Beruang Rules** adalah aturan untuk satu jenis setup saja: **sell setelah support patah lalu diuji ulang dari bawah**. "Beruang" (bear) dipakai karena setup ini hanya mencari posisi jual.

Idenya sederhana. Support yang sudah ditembus sering berganti peran menjadi resistance. Ini disebut **SBR (Support Become Resistance)**. Saat harga naik lagi ke zona itu, kita tidak langsung sell. Kita menunggu dua konfirmasi tambahan: zona itu harus bertumpuk dengan **area Fibonacci 0.69–0.79**, dan harus muncul **candle penolakan bearish**.

## Peta Fibonacci Beruang Rules

| Level | Peran |
|---|---|
| **1** | Swing high, awal dorongan turun |
| **0.89** | **Stop loss** |
| **0.79 – 0.69** | **Area entry** (harus bertumpuk dengan zona SBR) |
| **0** | Swing low, **TP1** |
| **-0.272** | **TP2** |

## Lima aturan

| # | Aturan | Timeframe | Pertanyaan yang dijawab |
|---|---|---|---|
| 1 | Struktur turun dan zona support yang valid | H4 → H1 | Boleh cari sell? Zonanya di mana? |
| 2 | Breakdown dengan close body, lalu tarik Fibonacci | H1 | Support benar-benar patah? |
| 3 | Konfluensi SBR + Fib 0.69–0.79, lalu candle penolakan | H1 / M15 | Kapan masuk? |
| 4 | SL di 0.89, TP di 0 dan -0.272 | H1 | Di mana keluar? |
| 5 | Lot dari jarak SL, risiko 0,5%, filter pembatal | - | Berapa lot? Kapan tidak boleh? |

Batas yang tidak boleh ditawar:
- **RR ke TP1 minimal 1:1,5.** Kalau kurang, setup dilewati.
- **Risiko 0,5% per trade**, lot dihitung dari jarak SL.
- **Maksimal 2 percobaan per zona.** Dua kali kena SL berarti zona itu sudah rusak.
- **Tidak ada candle penolakan, tidak ada entry.** Harga menyentuh zona saja belum cukup.

## Kenapa konfluensi?

Zona SBR saja sering ditembus lagi. Fibonacci saja hanyalah garis hasil hitungan. Saat keduanya bertumpuk di area yang sama dan pasar menunjukkan penolakan, alasan untuk sell menjadi lebih kuat. Titik di mana ide itu terbukti salah juga sudah jelas sejak awal: level 0.89.

> Beruang Rules tidak membuat Anda selalu benar. Aturan ini membuat Anda hanya masuk di tempat yang sudah ditentukan, dengan kerugian yang sudah diukur sebelum klik sell.

## Alat yang dipakai

- Chart XAUUSD di TradingView atau MT5.
- Alat gambar **rectangle** untuk zona.
- **Fibonacci retracement** dengan level **1, 0.89, 0.79, 0.69, 0, -0.272** (dan -0.618 kalau perlu). Level 0.69, 0.79, dan 0.89 bukan level bawaan. Tambahkan sendiri di pengaturan alat Fibonacci (di TradingView: klik dua kali garis Fibonacci, buka tab level, lalu ubah angkanya). Simpan sebagai template supaya tidak perlu diatur ulang.
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
Harga memantul tiga kali di area **2.370–2.376**. Ekor candle turun sampai 2.370, body-body candle tertahan di sekitar 2.376. Zona yang ditandai: **2.370–2.376**.

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
| 0.89 | **Stop loss.** Kalau harga close di atasnya, setup batal |
| 0.79 – 0.69 | **Area entry** |
| 0 | Swing low, **TP1** |
| -0.272 | **TP2** |
| -0.618 | Target opsional (TP3) |

### Rumus (untuk dicek manual)
Jarak impuls = swing high − swing low

Level retracement = swing low + (jarak × level)

Level ekstensi = swing low − (jarak × level ekstensi)

### Contoh (ilustrasi)
Swing high **2.400**, swing low **2.300**, jarak **100**.

| Level | Hitungan | Harga |
|---|---|---|
| 0.89 | 2.300 + 89 | 2.389 |
| 0.79 | 2.300 + 79 | 2.379 |
| 0.69 | 2.300 + 69 | 2.369 |
| 0 | swing low | 2.300 |
| -0.272 | 2.300 − 27,2 | 2.272,8 |
| -0.618 | 2.300 − 61,8 | 2.238,2 |

Rumus yang sama berlaku di timeframe apa pun. Kalau Anda menarik Fibonacci di chart H4 atau Weekly, cara hitungnya tetap sama. Yang berubah hanya besar jarak SL, sehingga lotnya juga harus menyesuaikan.

**Tugas:** cari satu breakdown sah di chart H1, tarik Fibonacci dari swing high ke swing low, lalu cocokkan level 0.69, 0.79, dan 0.89 dengan hitungan manual.${DISCLAIMER}`],

  ['Aturan 3: Konfluensi SBR + Fibonacci dan candle penolakan', 10, `Ini inti Beruang Rules. Kita hanya mencari sell di tempat **zona SBR bertumpuk dengan area Fibonacci 0.69–0.79**, dan hanya setelah pasar menunjukkan **penolakan**.

## Menilai konfluensi

| Posisi zona SBR | Status | Yang dilakukan |
|---|---|---|
| Bertumpuk dengan **0.69–0.79** | ✅ Setup utama | Tunggu candle penolakan |
| Di bawah **0.69** | ⚠️ Belum masuk area | Jangan sell di sini. Tunggu, atau lewati |
| Di antara **0.79 dan 0.89** | ❌ Terlalu dekat SL | Lewati |
| Harga sudah close di atas **0.89** | ❌ Batal | Hapus setup, tunggu struktur baru |

Pada contoh sebelumnya, zona **2.370–2.376** berada di antara 0.69 (2.369) dan 0.79 (2.379). Konfluensinya valid.

## Trigger entry: candle penolakan

Saat harga masuk area konfluensi, tunggu **salah satu** candle berikut di H1 (atau M15 untuk entry yang lebih rapat):

1. **Pin bar bearish:** ekor atas panjang (minimal sekitar dua kali panjang body), body ditutup di bawah zona.
2. **Bearish engulfing:** body candle merah menutupi body candle hijau sebelumnya, dan ditutup di bawah zona.

Syarat untuk keduanya:
- **Candle harus sudah close**, dan **close-nya di bawah zona SBR**. Candle yang masih berjalan belum dihitung.
- **High candle tidak boleh melewati 0.89.** Kalau ekornya sudah menembus 0.89, SL di 0.89 sudah tersentuh di candle itu juga, jadi setupnya dilewati.

Entry dilakukan di harga close candle trigger, atau di pembukaan candle berikutnya.

## Yang bukan trigger
- Harga hanya menyentuh zona lalu bergerak sideways.
- Candle merah biasa yang close-nya masih di dalam atau di atas zona.
- Pin bar yang ekornya menembus 0.89.

> Menunggu candle penolakan memang membuat sebagian pergerakan terlewat. Itu biaya yang dibayar supaya tidak sell di zona yang sedang ditembus.

**Tugas:** dari dua setup yang Anda temukan di aturan 2, catat apakah zonanya bertumpuk dengan 0.69–0.79 dan apakah muncul candle penolakan. Tulis jawabannya ya atau tidak.${DISCLAIMER}`],

  ['Aturan 4: Stop loss, take profit, dan break-even', 9, `Di Beruang Rules, SL dan TP sudah ditentukan oleh Fibonacci **sebelum** harga sampai ke area entry. Tugas Anda hanya memastikan RR-nya masuk aturan.

## Stop loss

- SL di **level 0.89 + buffer kecil**.
- Buffer = spread saat itu ditambah sedikit ruang. Posisi sell ditutup di harga *ask*, jadi tanpa buffer SL bisa tersentuh sebelum harga *bid* di chart benar-benar sampai 0.89. Contoh di materi ini memakai buffer 1 dolar.
- SL tidak digeser menjauh setelah entry.

## Take profit

| Target | Letak | Tindakan |
|---|---|---|
| **TP1** | Swing low (Fib **0**) | Tutup **50%** posisi, geser SL ke harga entry (*break-even*) |
| **TP2** | Ekstensi **-0.272** | Tutup sisa posisi |
| **TP3** (opsional) | Ekstensi **-0.618** | Hanya kalau Anda sudah memutuskannya sebelum entry |

## Syarat RR

RR ke TP1 = (entry − TP1) ÷ (SL − entry)

**RR ke TP1 minimal 1:1,5.** Biasanya syarat ini terpenuhi kalau entry ada di area 0.69–0.79. Tapi kalau candle trigger close jauh di bawah zona, entry jadi lebih rendah dan RR mengecil. Karena itu tetap dihitung setiap kali.

### Contoh (ilustrasi)
- Fibonacci: swing high 2.400, swing low 2.300
- Entry: **2.368** (close candle bearish engulfing, di bawah zona 2.370–2.376)
- SL: 0.89 (2.389) + buffer 1 = **2.390**
- Jarak SL: 2.390 − 2.368 = **22 dolar**
- TP1: **2.300** (Fib 0) → jarak 68 → RR = 68 ÷ 22 ≈ **1:3,1** ✓
- TP2: **2.272,8** (-0.272) → jarak 95,2 → RR ≈ **1:4,3**

## Setelah TP1 tercapai
SL sisa posisi dipindah ke **2.368** (harga entry). Dari titik ini, sisa posisi tidak lagi menambah risiko kerugian dari pergerakan harga biasa. Gap dan slippage tetap bisa terjadi.

**Tugas:** untuk setiap setup yang lolos aturan 3, hitung SL, TP1, TP2, dan RR di jurnal sebelum mengecek bagaimana harga bergerak sesudahnya.${DISCLAIMER}`],

  ['Aturan 5: Lot, batas risiko, dan filter pembatal', 9, `Setup yang bagus tetap bisa kalah. Aturan kelima memastikan satu kekalahan tidak berarti banyak bagi akun.

## Menghitung lot

1. Risiko per trade = **0,5% × saldo**.
2. Jarak SL dalam dolar harga (contoh: 22 dolar).
3. Untuk XAUUSD, **0,01 lot ≈ 1 dolar per 1 dolar pergerakan harga** (1 lot = 100 oz). Cek spesifikasi kontrak di broker Anda, karena bisa berbeda.
4. Lot = risiko ÷ (jarak SL × nilai per 0,01 lot) × 0,01, lalu **bulatkan ke bawah**.

Atau cukup pakai [kalkulator lot](/alat/kalkulator-lot).

### Contoh (ilustrasi)
| Saldo | Risiko 0,5% | Jarak SL | Risiko per 0,01 lot | Lot |
|---|---|---|---|---|
| $2.000 | $10 | 22 | $22 | **Tidak trading.** 0,01 lot pun sudah melebihi batas |
| $5.000 | $25 | 22 | $22 | **0,01** |
| $10.000 | $50 | 22 | $22 | **0,02** ($44) |

Baris pertama sengaja ditampilkan. Karena SL ada di 0.89, jaraknya bisa cukup lebar. Kalau lot terkecil saja sudah melewati batas risiko, jawabannya **tidak trading**, bukan menaikkan risiko atau memindahkan SL lebih dekat.

## Batas yang mengikat
- **Maksimal 2 percobaan per zona.** Dua kali kena SL di zona yang sama berarti zona itu sudah tidak dihormati pasar.
- Tidak menambah posisi (averaging) kalau harga bergerak melawan.
- Tidak memindahkan SL menjauh.

## Filter pembatal

Setup dibatalkan, atau entry ditunda, kalau:
- Ada rilis berita berdampak tinggi dalam **30 menit sebelum sampai 30 menit sesudah** waktu entry. Cek kalender ekonomi setiap pagi.
- Spread melebar tidak wajar dibanding biasanya.
- Ada candle H1 yang **body**-nya close **di atas zona SBR**. Zona itu sudah kembali ditembus.
- Harga close di atas **0.89**.

**Tugas:** tulis ketiga filter ini di bagian atas jurnal Anda, lalu centang satu per satu sebelum setiap entry.${DISCLAIMER}`],

  ['Checklist Beruang Rules dan contoh lengkap', 10, `Materi ini merangkum semua aturan dalam satu checklist, lalu memakainya pada dua contoh: satu yang diambil dan satu yang dilewati.

## Checklist sebelum klik sell

| # | Pertanyaan | Ya / Tidak |
|---|---|---|
| 1 | Struktur H4 sedang turun (*lower high*, *lower low*)? | |
| 2 | Zona support disentuh minimal 2 kali? | |
| 3 | Zona patah dengan **close body** di H1? | |
| 4 | Fibonacci ditarik dari swing high (1) ke swing low (0) impuls? | |
| 5 | Zona SBR bertumpuk dengan Fib **0.69–0.79**? | |
| 6 | Ada candle penolakan bearish yang **close di bawah zona**, dan high-nya **di bawah 0.89**? | |
| 7 | SL di **0.89 + buffer**? | |
| 8 | RR ke TP1 (Fib 0) minimal **1:1,5**? | |
| 9 | Lot dihitung untuk risiko maksimal **0,5%**? | |
| 10 | Tidak ada berita besar dalam rentang ±30 menit, spread wajar? | |
| 11 | Ini percobaan ke-1 atau ke-2 di zona ini? | |

**Satu jawaban "tidak" = tidak ada trade.**

## Contoh 1: setup diambil (ilustrasi)

- **H4:** lower high dan lower low ✓
- **Zona support H1:** 2.370–2.376, disentuh 3 kali ✓
- **Breakdown:** candle H1 close di 2.362 ✓
- **Impuls:** swing high 2.400 → swing low 2.300 (jarak 100)
- **Fibonacci:** 0.69 = 2.369 · 0.79 = 2.379 · 0.89 = 2.389
- **Konfluensi:** zona 2.370–2.376 berada di 0.69–0.79 ✓
- **Trigger:** bearish engulfing, high 2.378 (di bawah 0.89 ✓), close 2.368 ✓
- **Entry:** 2.368 · **SL:** 2.390 (0.89 + buffer 1, jarak 22) ✓
- **TP1:** 2.300 (RR ≈ 1:3,1) ✓ · **TP2:** 2.272,8 (RR ≈ 1:4,3)
- **Lot:** saldo $5.000, risiko $25 → **0,01 lot** (risiko $22) ✓
- **Berita:** tidak ada rilis besar dalam ±30 menit ✓

Rencana keluar: di 2.300, tutup 50% dan geser SL ke 2.368. Sisa posisi ditutup di 2.272,8 atau di 2.368 kalau harga berbalik.

## Contoh 2: setup dilewati (ilustrasi)

- Struktur dan Fibonacci sama seperti contoh 1, tetapi zona support lama ada di **2.345–2.352**, sekitar level 0.5.
- Zona itu **di bawah 0.69**, belum masuk area entry. Poin 5 = **tidak**.
- Harga menembus zona, naik sampai 2.395, lalu close di atas **0.89 (2.389)**. Setup **batal**.

Melewati setup seperti ini bukan peluang yang hilang. Ini aturan yang sedang bekerja.

## Jurnal

Catat setiap setup, termasuk yang dilewati: tanggal, struktur H4, zona, titik Fibonacci, konfluensi, trigger, entry, SL, TP1, TP2, RR, lot, hasil, dan **apakah semua aturan diikuti**. Setelah 20–30 setup, evaluasi dari jurnal, bukan dari ingatan.

Ada setup yang ragu? Bawa ke menu **Tanya Doktor** atau **Bedah Setup AI** untuk dicek prosesnya.

**Tugas:** jalankan Beruang Rules di akun demo minimal 20 trade dengan checklist ini sebelum memakai uang sungguhan.${DISCLAIMER}`],
];

module.exports = { COURSE, LESSONS };
