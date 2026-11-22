# EMA 9 + VWAP + Fibonacci — Cara Pakai

**Kategori:** Tools / Indikator TradingView
**Platform:** TradingView (gratis, akun Basic cukup)
**File:** `DoktorTrader_EMA9_VWAP_Fibo.pine` (Pine Script v6)

---

## Apa ini?

Indikator yang menampilkan tiga alat di chart:

- **EMA 9 (kuning)**: rata-rata harga 9 candle terakhir, bereaksi cepat terhadap pergerakan harga.
- **VWAP (teal)**: harga rata-rata tertimbang volume sejak awal sesi. Sering dipakai sebagai "harga wajar" hari itu.

- **Fibonacci retracement 0.69 / 0.79 / 0.89 (ungu)**: digambar otomatis dari swing high dan swing low terakhir. Area antara 0.69 dan 0.89 diarsir sebagai zona retracement dalam.

Indikator ini memberi label **BUY** saat EMA 9 memotong VWAP ke atas dan **SELL** saat memotong ke bawah.

> Label BUY/SELL adalah penanda teknikal untuk bahan belajar, **bukan rekomendasi transaksi**.

---

## Cara Pasang (5 menit)

1. Klik **Copy kode** di halaman ini (atau download file `.pine`, buka dengan Notepad, lalu copy semua isinya).
2. Buka **tradingview.com** lalu buka chart (misalnya `OANDA:XAUUSD`).
3. Klik **Pine Editor** di bagian bawah layar.
4. Hapus semua kode default, **paste** kode tadi.
5. Klik **Save** (beri nama "EMA9 VWAP"), lalu **Add to chart**.

Indikator sekarang tersimpan di **Indicators → My Scripts**, jadi bisa dipasang ke chart lain kapan saja.

> **Penting untuk XAUUSD:** VWAP butuh data volume. Pakai feed **OANDA:XAUUSD** atau **FOREXCOM:XAUUSD** (tick volume), atau **GC1!** untuk volume futures COMEX. Kalau feed tidak punya volume, muncul kotak merah di pojok kanan atas.

---

## Pengaturan (ikon ⚙️ di nama indikator)

| Setting | Default | Fungsi |
|---|---|---|
| EMA Length | 9 | Panjang EMA |
| VWAP Anchor | D | Reset VWAP: D = harian, W = mingguan, M = bulanan |
| Tampilkan VWAP Band | On | Band standar deviasi di atas/bawah VWAP |
| Band Multiplier | 1.0 | Lebar band (1.0 / 2.0 umum dipakai) |
| Filter close searah cross | On | Label hanya muncul kalau candle close di sisi yang sama dengan arah cross. Mengurangi sinyal palsu. |
| Warnai background | Off | Hijau = EMA di atas VWAP, merah = di bawah |
| Tampilkan Fibonacci | On | Menyalakan/mematikan garis Fibonacci |
| Lookback swing | 100 | Jumlah candle ke belakang untuk mencari swing high & low |
| Level 1 / 2 / 3 | 0.69 / 0.79 / 0.89 | Level retracement, bisa diganti |
| Level 0 & 1 | On | Garis abu-abu di swing high dan swing low |
| Arsir zona | On | Arsiran antara Level 1 dan Level 3 |

---

## Cara Membaca

- **EMA 9 di atas VWAP** → momentum intraday cenderung bullish.
- **EMA 9 di bawah VWAP** → momentum intraday cenderung bearish.
- **Harga jauh di luar band** → harga sudah "melar" dari rata-rata. Hati-hati kejar harga.
- **Garis saling silang berkali-kali** → market sideways. Cross di kondisi ini sering palsu.

### Fibonacci 0.69 / 0.79 / 0.89

- Indikator mencari **high tertinggi dan low terendah** dalam jumlah candle *Lookback*.
- Kalau high terjadi **setelah** low → swing naik. Level diukur turun dari high, jadi zona ungu adalah area koreksi dalam untuk dipantau saat cari **buy**.
- Kalau low terjadi **setelah** high → swing turun. Level diukur naik dari low, jadi zona ungu adalah area pullback untuk dipantau saat cari **sell**.
- Garis Fibonacci **ikut bergeser** setiap kali muncul high/low baru dalam lookback. Ini normal, bukan error.
- Kalau swing yang terdeteksi bukan swing yang Anda maksud, ubah **Lookback** (kecilkan untuk swing pendek, besarkan untuk swing besar).
- Retracement sampai 0.89 adalah koreksi yang sangat dalam. Kalau candle close **melewati level 1** (swing low/high), struktur swing itu batal.

**Contoh kombinasi (ilustrasi, bukan sinyal):** swing naik, harga koreksi masuk zona 0.69–0.89, lalu EMA 9 kembali cross ke atas VWAP. Itu tanda momentum mulai pulih di area koreksi. Stop loss bisa ditaruh di bawah level 1 (swing low), lalu lot dihitung dari jarak SL itu.

**Timeframe yang cocok:** M5–M15 untuk intraday. VWAP harian kurang bermakna di H4 ke atas.

---

## Pasang Alert

1. Klik **Alert** (ikon jam) di toolbar atas.
2. **Condition:** pilih `EMA9+VWAP`, lalu `EMA9 cross UP VWAP` atau `EMA9 cross DOWN VWAP`.
3. **Trigger:** pilih **Once Per Bar Close** supaya sinyal tidak berubah-ubah di tengah candle.
4. Atur notifikasi (app, email), lalu **Create**.

Ada juga alert **"Harga masuk zona Fibo"**, yang berbunyi saat close candle masuk ke zona 0.69–0.89.

---

## Checklist Sebelum Entry

Jangan entry hanya karena ada label. Cek dulu:

1. **Struktur market** searah? (higher high/higher low untuk buy)
2. **Jadwal berita**: hindari 15–30 menit sebelum/sesudah rilis besar (NFP, CPI, FOMC).
3. **Stop loss** sudah ditentukan. Misalnya di balik swing terdekat atau di sisi lain VWAP.
4. **Lot** sesuai risiko: maksimal 1–2% modal per posisi. Pakai [kalkulator lot](/alat/kalkulator-lot).
5. **Risk:Reward** minimal 1:1.5.

---

## Keterbatasan

- Sinyal cross adalah indikator **lagging** (terlambat), apalagi di market sideways (sering whipsaw di sesi Asia).
- Fibonacci otomatis hanya membaca high/low tertinggi dalam lookback. Indikator ini tidak tahu konteks struktur yang lebih besar.
- VWAP di spot gold memakai **tick volume** broker, jadi garisnya bisa sedikit beda antar feed.
- Belum ada indikator yang akurat 100%. Selalu backtest/demo dulu sebelum pakai uang riil.

---

*Materi edukasi Doktor Trader. Bukan ajakan atau rekomendasi transaksi. Trading forex, emas, dan derivatif memiliki risiko tinggi dan dapat menyebabkan kehilangan seluruh modal.*
