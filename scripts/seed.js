// Seeds default Academy, tools and settings the first time the database is empty.
const db = require('../src/db');
const { slugify } = require('../src/views');


const COURSES = [
  { title: 'Fondasi Trading', level: 'Pemula', summary: 'Kenali pasar forex dan emas, cara kerja broker, dan cara membaca chart sebelum menyentuh uang sungguhan.', lessons: [
    ['Apa itu trading forex dan emas', 8, `Trading forex dan emas (XAUUSD) adalah aktivitas memperdagangkan **selisih harga** sebuah pasangan mata uang atau komoditas. Anda tidak membeli emas fisik; Anda membuka posisi yang untung atau rugi mengikuti pergerakan harga.

**Yang perlu dipahami sejak awal:**
- **Buy (long)** untung jika harga naik, **Sell (short)** untung jika harga turun.
- Pasar buka 24 jam, Senin sampai Jumat, terbagi dalam sesi Asia, Eropa (London), dan Amerika (New York).
- Emas adalah instrumen yang sangat volatil. Bergerak 20–40 dolar dalam sehari bukan hal aneh.

> Trading bukan cara cepat kaya. Tujuan pertama Anda adalah **bertahan**, bukan menang besar.

**Tugas:** buka akun demo, amati chart XAUUSD selama satu sesi London tanpa membuka posisi, dan catat kapan harga paling aktif bergerak.`],
    ['Broker, spread, leverage, dan margin', 10, `Broker adalah perantara yang mengeksekusi order Anda. Ada beberapa istilah yang **wajib** dipahami:

- **Spread**: selisih harga beli dan jual. Ini biaya yang Anda bayar setiap membuka posisi.
- **Leverage**: pinjaman daya beli dari broker. Leverage 1:500 artinya modal $100 bisa membuka posisi senilai $50.000. Leverage memperbesar untung **dan** rugi.
- **Margin**: dana yang "dikunci" broker untuk menahan posisi terbuka.
- **Free margin & margin level**: saat margin level turun ke batas tertentu, broker menutup posisi Anda secara paksa (**stop out / margin call**).

Leverage tinggi bukan masalah. Yang menjadi masalah adalah **ukuran lot yang terlalu besar** dibanding modal. Kita bahas hitungannya di kelas Manajemen Risiko.`],
    ['Membaca chart candlestick', 12, `Satu candlestick menunjukkan empat harga dalam satu periode: **open, high, low, close**.

- Badan hijau/putih: close lebih tinggi dari open (harga naik).
- Badan merah/hitam: close lebih rendah dari open (harga turun).
- Sumbu (wick) menunjukkan harga tertinggi dan terendah yang sempat disentuh.

**Timeframe**: M1, M5, M15, H1, H4, D1. Pemula sebaiknya mulai dari **H1 dan H4** karena lebih sedikit "noise".

Jangan menghafal puluhan pola candle. Fokus pada konteks: **di mana** candle itu terbentuk (dekat support/resistance?) jauh lebih penting daripada bentuknya.`],
    ['Jenis order: market, limit, stop', 8, `- **Market order**: masuk sekarang di harga berjalan.
- **Buy limit / Sell limit**: masuk di harga yang lebih baik dari harga sekarang (menunggu pullback).
- **Buy stop / Sell stop**: masuk saat harga menembus level tertentu (mengikuti breakout).
- **Stop loss (SL)**: batas rugi otomatis. **Wajib** di setiap posisi.
- **Take profit (TP)**: target untung otomatis.

Kebiasaan sehat: tentukan entry, SL, dan TP **sebelum** menekan tombol, bukan setelah posisi berjalan.`],
    ['Menyiapkan MT4/MT5 dan akun Vantage', 10, `1. Buka akun Vantage lewat link resmi Doktor Trader (agar akses member Anda bisa diverifikasi).
2. Unduh MetaTrader 4 atau 5 di HP atau laptop, lalu login dengan nomor akun dan server dari email Vantage.
3. Tambahkan simbol **XAUUSD** di Market Watch.
4. Mulai dari **akun demo** sampai Anda konsisten mengikuti rencana trading minimal 1 bulan.
5. Saat beralih ke akun live, mulai dengan modal yang benar-benar siap Anda tanggung risikonya.

Butuh bantuan setup? Kirim pertanyaan di menu **Tanya Doktor**.`],
  ] },
  { title: 'Manajemen Risiko', level: 'Inti', summary: 'Bagian terpenting: ukuran lot, stop loss, risk-reward, dan cara agar akun tidak pernah margin call lagi.', lessons: [
    ['Aturan risiko 1% per posisi', 10, `Aturan paling sederhana yang menyelamatkan akun: **jangan pernah merisikokan lebih dari 1–2% modal dalam satu posisi.**

Contoh: modal $1.000, risiko 1% = **$10 per posisi**. Kalah 10 kali berturut-turut, Anda masih punya sekitar $904. Bandingkan dengan risiko 10% per posisi: setelah 10 kekalahan, modal tinggal sekitar $349.

Kekalahan beruntun **pasti** terjadi, bahkan pada strategi yang bagus. Risiko kecil memberi Anda waktu untuk belajar dan memperbaiki diri.`],
    ['Menghitung ukuran lot', 12, `Rumus dasarnya:

**Lot = Risiko dalam $ ÷ (Jarak SL × Nilai per poin per lot)**

Untuk XAUUSD di kebanyakan broker, 1 lot = 100 oz, sehingga pergerakan $1 pada harga emas = **$100 per 1 lot** (atau $1 per 0,01 lot).

Contoh: modal $1.000, risiko 1% = $10, SL berjarak $5 dari entry.
Lot = 10 ÷ (5 × 100) = **0,02 lot**.

Selalu hitung lot dari **jarak SL**, bukan dari "feeling" atau sisa margin. Cek ulang spesifikasi kontrak di platform Anda karena bisa berbeda antar akun.`],
    ['Stop loss, take profit, dan risk-reward', 10, `**Risk-reward (RR)** adalah perbandingan potensi rugi dan potensi untung. RR 1:2 berarti merisikokan $10 untuk target $20.

Dengan RR 1:2, Anda hanya perlu menang **sekitar 34%** dari total trade untuk impas (sebelum biaya). Ini sebabnya trader profesional bisa sering kalah tetapi tetap bertumbuh.

Prinsip:
- Letakkan SL di tempat yang **membatalkan analisa** Anda (misalnya di balik support), bukan sekadar angka bulat.
- Jangan menggeser SL menjauh saat harga mendekatinya.
- Boleh menggeser SL ke break-even setelah harga bergerak sesuai rencana.`],
    ['Drawdown dan anatomi margin call', 12, `Drawdown adalah penurunan modal dari titik tertinggi. Semakin dalam drawdown, semakin berat untuk pulih:

| Turun | Perlu naik untuk kembali |
|---|---|
| 10% | 11% |
| 25% | 33% |
| 50% | 100% |
| 75% | 300% |

Margin call hampir selalu berasal dari kombinasi yang sama: **lot terlalu besar, tanpa SL, averaging posisi rugi, dan menolak menerima kerugian kecil.** Hindari keempatnya, dan risiko margin call turun drastis.`],
    ['Jurnal trading', 8, `Jurnal trading adalah alat belajar paling murah. Catat untuk setiap posisi:
- Tanggal, pair, buy/sell, lot, entry, SL, TP
- Alasan masuk (setup apa?)
- Hasil dan RR yang tercapai
- Kondisi emosi saat masuk dan keluar
- Screenshot chart sebelum dan sesudah

Setiap akhir pekan, tinjau 10–20 trade terakhir. Cari pola: setup mana yang paling sering untung, jam berapa Anda paling sering salah, dan kesalahan apa yang berulang.`],
  ] },
  { title: 'Strategi XAUUSD', level: 'Menengah', summary: 'Kerangka analisa emas: struktur pasar, support-resistance, sesi trading, dan menyusun rencana trading.', lessons: [
    ['Karakter pergerakan emas', 10, `Emas dipengaruhi oleh **dolar AS, suku bunga riil, inflasi, dan sentimen risiko global**. Data besar seperti NFP, CPI, dan keputusan suku bunga The Fed sering membuat harga bergerak sangat cepat.

Kebiasaan aman:
- Cek kalender ekonomi setiap pagi.
- Hindari membuka posisi baru beberapa menit sebelum rilis data berdampak tinggi.
- Saat volatilitas tinggi, perkecil lot agar risiko dalam dolar tetap sama.`],
    ['Support, resistance, dan zona', 12, `Support adalah area di mana harga cenderung berhenti turun; resistance adalah area di mana harga cenderung berhenti naik. Gunakan **zona**, bukan garis tipis, karena harga jarang berbalik di angka yang persis sama.

Cara menggambar:
1. Mulai dari timeframe besar (D1, H4).
2. Tandai area yang disentuh berkali-kali atau tempat harga berbalik tajam.
3. Turun ke H1 untuk mencari timing entry di sekitar zona tersebut.

Level yang sudah ditembus sering berganti peran: support yang patah bisa menjadi resistance.`],
    ['Tren dan struktur pasar', 12, `**Uptrend**: higher high dan higher low. **Downtrend**: lower high dan lower low. **Sideways**: harga bergerak di antara dua batas.

Aturan sederhana untuk pemula: **ikuti arah tren timeframe besar.** Jika H4 sedang uptrend, prioritaskan mencari peluang buy di area pullback, bukan menebak puncak.

Perubahan struktur (misalnya uptrend yang gagal membuat higher high lalu menembus higher low terakhir) adalah peringatan awal bahwa tren bisa berubah.`],
    ['Sesi trading dan waktu terbaik', 8, `Dalam waktu WIB (perkiraan, bergeser saat musim panas di Eropa/AS):
- **Sesi Asia**: sekitar 06.00–14.00, biasanya lebih tenang.
- **Sesi London**: sekitar 14.00–23.00, volatilitas meningkat.
- **Sesi New York**: sekitar 19.00–04.00, overlap dengan London sering menjadi periode paling aktif.

Pilih satu atau dua sesi yang sesuai dengan jadwal Anda dan fokus di sana. Konsistensi waktu membantu Anda mengenal "ritme" pasar.`],
    ['Menyusun rencana trading', 10, `Rencana trading tertulis menjawab pertanyaan ini **sebelum** pasar buka:
1. Instrumen dan timeframe apa yang saya tradingkan?
2. Setup apa yang boleh saya ambil (syarat masuk yang jelas)?
3. Berapa risiko per posisi dan batas rugi harian (misalnya 3%)?
4. Di mana SL dan TP diletakkan?
5. Kapan saya berhenti trading hari ini?

Jika sebuah posisi tidak sesuai rencana, jangan dibuka. Rencana yang biasa saja tetapi dijalankan dengan disiplin jauh lebih baik daripada strategi hebat yang dijalankan sesuka hati.`],
  ] },
  { title: 'Psikologi Trading', level: 'Semua level', summary: 'Mengelola FOMO, revenge trading, dan ekspektasi agar keputusan tetap rasional.', lessons: [
    ['FOMO dan overtrading', 8, `FOMO (fear of missing out) membuat kita masuk terlambat, tanpa setup, karena takut ketinggalan pergerakan. Hasilnya: entry buruk, SL lebar, dan lot asal.

Penangkalnya:
- Ingat bahwa peluang selalu datang lagi. Pasar buka setiap hari.
- Tetapkan batas jumlah trade per hari.
- Jika harga sudah lari jauh dari zona, **lepaskan**. Tunggu setup berikutnya.`],
    ['Revenge trading setelah rugi', 8, `Setelah kalah, muncul dorongan untuk "balas dendam" ke pasar dengan lot lebih besar. Inilah jalan tercepat menuju margin call.

Aturan pribadi yang bisa Anda pakai:
- Setelah 2 kali kalah berturut-turut, berhenti trading hari itu.
- Setelah mencapai batas rugi harian, tutup platform.
- Jangan pernah menaikkan lot untuk menutup kerugian.

Kerugian kecil adalah biaya bisnis. Kerugian besar biasanya lahir dari reaksi emosional terhadap kerugian kecil.`],
    ['Ekspektasi yang sehat', 8, `Banyak trader berhenti karena ekspektasi yang tidak realistis: menggandakan akun dalam sebulan, atau tidak pernah rugi.

Ekspektasi sehat:
- Bulan rugi akan terjadi.
- Fokus pada **proses** (disiplin mengikuti rencana), bukan hasil harian.
- Ukur kemajuan dalam hitungan bulan, dari jurnal Anda.

Tujuan Doktor Trader adalah membantu Anda menjadi trader yang **disiplin dan bertahan lama**, bukan menjanjikan hasil tertentu.`],
  ] },
];

const EA_DESC = `EA pendamping yang **tidak membuka posisi**. Ia hanya menjaga posisi yang Anda buka sendiri:
- **Auto SL/TP**: memasang SL dan TP otomatis pada posisi yang belum punya SL/TP
- **Break-even**: memindahkan SL ke harga entry setelah profit mencapai jarak tertentu
- **Trailing stop**: SL ikut bergerak mengunci profit
- **Batas rugi harian**: jika rugi hari ini mencapai X% (default 3%), semua posisi ditutup dan posisi baru langsung ditutup sampai besok

**Cara pasang (MT5):** unduh file, buka MetaTrader → File → Open Data Folder → MQL5 → Experts, tempel file, lalu klik kanan Navigator → Refresh. Tarik **DT_RiskGuard** ke chart XAUUSD, centang *Allow Algo Trading*, dan aktifkan tombol **Algo Trading**. Atur angka SL/TP di tab Inputs (dalam point; untuk XAUUSD 2 digit, 100 point = $1).

Pakai MT4? [Unduh versi MT4](/member/unduh/DT_RiskGuard.mq4) (taruh di MQL4 → Experts).`;

const SIGNAL_DESC = `Indikator sinyal berbasis aturan yang menandai peluang searah tren di chart:
- **Panah hijau (BUY)**: harga dan EMA 50 di atas EMA 200, lalu RSI naik kembali melewati 40 (pullback selesai)
- **Panah merah (SELL)**: kebalikannya, RSI turun melewati 60 saat downtrend
- Menampilkan **saran SL dan TP** dari ATR (SL 1,5× ATR, TP 3× ATR) di pojok chart
- Alert dan notifikasi HP (MetaTrader mobile) saat sinyal baru muncul
- Hanya membaca candle yang sudah tutup, jadi panah tidak berubah setelah muncul

**Cara pasang (MT5):** taruh file di MQL5 → Indicators, Refresh, lalu tarik **DT_SmartSignal** ke chart. Cocok dipakai di H1/H4. Gabungkan dengan **DT Risk Guard** dan kalkulator lot di bawah.

Pakai MT4? [Unduh versi MT4](/member/unduh/DT_SmartSignal.mq4) (taruh di MQL4 → Indicators).`;

const TOOLS = [
  ['ea', 'DT Risk Guard: auto SL/TP, break-even, trailing', EA_DESC, 'Alat bantu disiplin, bukan jaminan profit. Uji di akun demo dulu dan cek kembali pengaturan point sesuai simbol Anda.', '/member/unduh/DT_RiskGuard.mq5', 'Unduh EA (MT5)'],
  ['signal', 'DT Smart Signal: indikator sinyal XAUUSD', SIGNAL_DESC, 'Sinyal berbasis aturan teknikal, bukan ramalan dan bukan rekomendasi. Sinyal bisa salah; selalu pakai SL dan aturan risiko 1%.', '/member/unduh/DT_SmartSignal.mq5', 'Unduh indikator (MT5)'],
  ['copytrade', 'Copy Trade Doktor Trader', 'Ikuti posisi strategi Doktor Trader secara otomatis melalui fitur copy trading Vantage, dengan pengaturan risiko yang bisa Anda tentukan sendiri. Link strategi segera tersedia di sini.', 'Copy trade tetap berisiko dan dapat mengalami drawdown. Gunakan dana yang siap Anda tanggung risikonya.', '', ''],
];

function seed() {
  if (!db.get('SELECT id FROM courses LIMIT 1')) {
    COURSES.forEach((c, ci) => {
      const cid = db.run('INSERT INTO courses(slug, title, level, summary, position, published) VALUES(?,?,?,?,?,1)', [slugify(c.title), c.title, c.level, c.summary, ci + 1]).lastInsertRowid;
      c.lessons.forEach(([title, dur, body], li) => {
        db.run('INSERT INTO lessons(course_id, slug, title, video_url, body_md, duration_min, position, published) VALUES(?,?,?,?,?,?,?,1)', [cid, slugify(title), title, '', body, dur, li + 1]);
      });
    });
    console.log('[seed] academy');
  }
  if (!db.get('SELECT id FROM tools LIMIT 1')) {
    TOOLS.forEach((t, i) => db.run('INSERT INTO tools(kind, title, description, risk_note, link_url, link_label, position, published) VALUES(?,?,?,?,?,?,?,1)', [...t, i + 1]));
    console.log('[seed] tools');
  }
  // v2: direct downloads instead of WhatsApp links (one-time update of the default tool cards)
  if (db.setting('tools_v2') !== '1') {
    for (const [kind, title, desc, risk, url, label] of TOOLS) {
      const row = db.get("SELECT id FROM tools WHERE kind = ? AND link_url LIKE 'https://wa.me/%' ORDER BY position, id LIMIT 1", [kind]);
      if (row) db.run('UPDATE tools SET title=?, description=?, risk_note=?, link_url=?, link_label=? WHERE id=?', [title, desc, risk, url, label, row.id]);
    }
    db.setSetting('tools_v2', '1');
    console.log('[seed] tools v2');
  }
}

module.exports = { seed };
