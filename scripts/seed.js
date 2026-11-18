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
    ['Menyiapkan MT4/MT5 dan akun Dupoin', 10, `1. Buka akun Dupoin lewat link resmi Doktor Trader (agar akses member Anda bisa diverifikasi).
2. Unduh MetaTrader 4 atau 5 di HP atau laptop, lalu login dengan nomor akun dan server dari email Dupoin.
3. Tambahkan simbol **XAUUSD** di Market Watch.
4. Mulai dari **akun demo** sampai Anda konsisten mengikuti rencana trading minimal 1 bulan.
5. Saat beralih ke akun live, mulai dengan modal yang benar-benar siap Anda tanggung risikonya.

Butuh bantuan setup? Kirim pertanyaan di menu **Tanya Doktor**.`],
    ['Pip, point, dan nilai kontrak', 10, `Sebelum menghitung lot, Anda perlu tahu **berapa dolar** nilai setiap pergerakan harga.

- **Point**: perubahan harga terkecil yang ditampilkan platform. Pada XAUUSD dengan 2 digit desimal, 1 point = $0,01.
- **Pip**: satuan yang lebih umum di forex. Pada EURUSD, 1 pip = 0,0001 (= 10 point pada broker 5 digit).
- **Ukuran kontrak**: 1 lot XAUUSD umumnya 100 oz; 1 lot EURUSD umumnya 100.000 unit mata uang dasar.

**Contoh (ilustrasi):** emas bergerak dari 2.000,00 ke 2.003,00 = $3 = 300 point. Dengan 0,01 lot (1 oz), hasilnya $3. Dengan 0,10 lot, $30.

Cara mengecek di MT4/MT5: klik kanan simbol di Market Watch → **Specification**. Lihat *contract size* dan *digits*. Spesifikasi bisa berbeda antar jenis akun, jadi selalu cek sendiri sebelum trading live.`, 2],
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
    ['Batas rugi harian dan mingguan', 8, `Aturan 1% per posisi melindungi Anda dari satu trade buruk. **Batas rugi harian** melindungi Anda dari satu hari buruk.

Contoh kerangka yang bisa disesuaikan:
- Rugi harian maksimal **3%** dari modal → berhenti trading sampai besok.
- Rugi mingguan maksimal **6%** → berhenti sampai minggu depan dan evaluasi jurnal.
- Setelah mencapai batas, **tutup platform**. Jangan "sekadar memantau" karena itu pintu menuju revenge trading.

Batas ini harus ditulis **sebelum** pasar buka, bukan diputuskan saat sedang rugi. Jika Anda sering melewati batas, gunakan EA **DT Risk Guard** di menu Tools: fitur batas rugi harian akan menutup posisi otomatis saat batas tercapai.

Ingat: hari-hari terburuk dalam riwayat akun hampir selalu terjadi saat trader terus menekan tombol setelah seharusnya berhenti.`, 2],
    ['Risiko tersembunyi: posisi ganda dan korelasi', 10, `Membuka tiga posisi dengan risiko 1% masing-masing **bukan** berarti risiko Anda 1%. Jika ketiganya bergerak searah, risiko sebenarnya mendekati 3%.

Contoh situasi yang sering tidak disadari:
- Buy XAUUSD dan sell USDJPY bersamaan: keduanya sama-sama bertaruh dolar AS melemah.
- Buy XAUUSD tiga kali di harga berbeda karena "harga makin murah" (averaging). Ini menumpuk risiko di satu arah.
- Buy EURUSD dan GBPUSD bersamaan saat keduanya sering bergerak mirip.

Aturan praktis:
1. Hitung **total risiko terbuka** dari semua posisi, bukan per posisi saja.
2. Batasi total risiko terbuka, misalnya maksimal 2–3% dari modal.
3. Jangan menambah posisi pada trade yang sedang rugi.

Menambah posisi pada trade yang sudah untung dan SL-nya sudah di break-even masih bisa dipertimbangkan, selama total risiko tetap dalam batas.`, 2],
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
    ['Konfirmasi price action di zona', 12, `Zona support-resistance memberi tahu Anda **di mana** mencari peluang. Price action memberi petunjuk **kapan** masuk.

Beberapa konfirmasi sederhana di sekitar zona:
- **Pin bar / rejection**: sumbu panjang yang menembus zona lalu harga kembali, tanda penolakan.
- **Engulfing**: candle yang menelan badan candle sebelumnya ke arah berlawanan.
- **Break of structure kecil**: di timeframe lebih rendah (M15/H1), harga mulai membentuk higher low di support atau lower high di resistance.

Cara memakai:
1. Tandai zona di H4.
2. Tunggu harga masuk ke zona; jangan pasang order hanya karena "sudah dekat".
3. Cari satu konfirmasi di H1 atau M15.
4. Letakkan SL di balik zona atau di balik sumbu candle konfirmasi, lalu hitung lot dari jarak SL itu.

Konfirmasi tidak menjamin harga berbalik. Fungsinya mengurangi entry asal-asalan dan membuat SL lebih logis.`, 2],
    ['Breakout atau pullback?', 10, `Dua cara masuk yang paling umum:

| | Breakout | Pullback |
|---|---|---|
| Masuk saat | Harga menembus level | Harga kembali ke level setelah menembus |
| Kelebihan | Tidak ketinggalan pergerakan | Entry lebih baik, SL lebih dekat |
| Kekurangan | Sering terjadi *false breakout* | Kadang harga tidak kembali |

Emas cukup sering membuat **false breakout**: menembus level sebentar, lalu berbalik tajam. Karena itu banyak trader pemula lebih nyaman memakai pola **break and retest**: tunggu penembusan dengan candle yang tutup di luar level, lalu cari entry saat harga menguji ulang level tersebut.

Apa pun pilihan Anda, tulis di rencana trading **satu** gaya entry dan uji di akun demo. Berganti-ganti gaya setiap kali kalah membuat Anda tidak pernah tahu mana yang sebenarnya berhasil.`, 2],
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
    ['Rutinitas dan disiplin harian', 8, `Disiplin bukan soal tekad, tetapi soal **sistem yang mengurangi keputusan impulsif**.

Contoh rutinitas sederhana:
- **Sebelum sesi**: cek kalender ekonomi, tandai zona di H4, tulis skenario buy dan sell.
- **Saat sesi**: hanya ambil setup yang ada di rencana. Pasang SL bersamaan dengan entry.
- **Setelah sesi**: isi jurnal, ambil screenshot, beri nilai 1–5 untuk kepatuhan Anda pada rencana (bukan untuk profitnya).

Hal kecil yang besar dampaknya:
- Trading di jam yang sama setiap hari.
- Matikan notifikasi grup sinyal saat sedang menganalisa sendiri.
- Jangan trading saat lelah, marah, atau sedang butuh uang dengan cepat.

Nilai kepatuhan yang konsisten tinggi selama berminggu-minggu adalah tanda kemajuan yang lebih jujur daripada saldo satu hari.`, 2],
    ['Bangkit setelah drawdown besar', 10, `Saya pernah mengalami margin call. Pelajaran terbesarnya: **masalahnya bukan pasar, tetapi cara saya mengelola risiko.** Jika Anda sedang di titik itu, ini langkah yang bisa membantu.

1. **Berhenti dulu.** Ambil jeda beberapa hari sampai minggu. Jangan menyetor ulang untuk "balas dendam".
2. **Audit jujur.** Buka riwayat trade, cari penyebabnya: lot terlalu besar, tanpa SL, averaging, atau trading di luar rencana.
3. **Tulis aturan baru** yang langsung menjawab penyebab tersebut, misalnya risiko maksimal 1% dan wajib SL.
4. **Kembali ke demo** sampai aturan baru dijalankan konsisten minimal satu bulan.
5. **Mulai live dengan modal kecil** yang benar-benar siap hilang, dan naikkan pelan-pelan hanya jika disiplin terjaga.

Kerugian masa lalu tidak harus dikejar. Tujuan Anda sekarang adalah menjadi trader yang tidak mengulangi kesalahan yang sama.`, 2],
  ] },
  { title: 'Fundamental & Berita', level: 'Menengah', since: 2, summary: 'Memahami kalender ekonomi dan data besar yang menggerakkan emas, serta cara aman menghadapi rilis berita.', lessons: [
    ['Membaca kalender ekonomi', 10, `Kalender ekonomi berisi jadwal rilis data dan pidato pejabat bank sentral. Untuk trader emas, ini **wajib dicek setiap pagi**.

Kolom yang perlu dipahami:
- **Waktu**: atur zona waktu kalender ke WIB.
- **Dampak**: biasanya ditandai rendah, sedang, tinggi. Fokus pada yang **tinggi**, terutama data AS (USD).
- **Previous, forecast, actual**: data sebelumnya, perkiraan analis, dan hasil yang dirilis.

Pasar sering bereaksi pada **selisih actual dibanding forecast**, bukan pada angkanya saja. Data bagus yang sudah diperkirakan bisa tidak menggerakkan harga, sementara kejutan kecil bisa membuat lonjakan besar.

**Rutinitas:** setiap pagi, catat 1–3 rilis berdampak tinggi hari itu beserta jamnya di rencana trading Anda.`],
    ['Data AS yang paling menggerakkan emas', 12, `Emas dihargai dalam dolar AS, sehingga data ekonomi AS sering memicu pergerakan besar. Beberapa yang paling diperhatikan:

- **NFP (Non-Farm Payrolls)**: data tenaga kerja, umumnya dirilis bulanan.
- **CPI**: data inflasi. Inflasi memengaruhi ekspektasi suku bunga.
- **Keputusan suku bunga dan konferensi pers The Fed (FOMC)**.
- **PCE, GDP, dan klaim pengangguran mingguan**.

Hubungan yang **sering** (tidak selalu) terjadi: ekspektasi suku bunga AS naik atau dolar menguat cenderung menekan emas; ekspektasi suku bunga turun atau dolar melemah cenderung mendukung emas. Sentimen risiko global juga berperan.

Jangan memakai hubungan ini sebagai rumus pasti. Gunakan untuk memahami **mengapa** harga bergerak liar di jam tertentu, dan untuk menyesuaikan risiko Anda. Jadwal rilis selalu cek di kalender ekonomi yang terbaru.`],
    ['Trading saat rilis berita: aturan aman', 8, `Saat rilis data berdampak tinggi, emas bisa bergerak puluhan dolar dalam hitungan menit. Risikonya:
- **Spread melebar** jauh dari biasanya.
- **Slippage**: order tereksekusi di harga lebih buruk dari SL atau entry yang Anda pasang.
- Harga bisa naik-turun tajam dua arah dan menyentuh SL keduanya.

Aturan aman untuk pemula:
1. Tidak membuka posisi baru sekitar 15–30 menit sebelum dan sesudah rilis berdampak tinggi.
2. Jika sudah punya posisi, pertimbangkan mengamankan sebagian profit atau memindahkan SL ke break-even sebelum rilis.
3. Jika tetap ingin trading setelah berita, tunggu candle M15 pertama tutup dan spread normal kembali, lalu gunakan lot lebih kecil.

Melewatkan satu pergerakan berita jauh lebih murah daripada satu slippage besar di akun Anda.`],
  ] },
  { title: 'Evaluasi & Naik Level', level: 'Menengah', since: 2, summary: 'Menguji strategi dengan benar dan beralih dari akun demo ke live secara bertahap.', lessons: [
    ['Backtest dan forward test', 12, `Sebelum memakai uang sungguhan, sebuah strategi perlu diuji.

- **Backtest**: menguji aturan pada data masa lalu. Bisa manual (geser chart ke belakang, catat setiap setup) atau memakai Strategy Tester di MT4/MT5 untuk EA.
- **Forward test**: menjalankan strategi di akun demo secara real-time, sesuai aturan, tanpa mengubah apa pun.

Langkah sederhana:
1. Tulis aturan entry, SL, TP, dan risiko yang jelas. Jika aturan masih "tergantung feeling", belum bisa diuji.
2. Kumpulkan minimal 50–100 contoh trade.
3. Catat: jumlah trade, rata-rata RR, drawdown terdalam, dan kekalahan beruntun terpanjang.
4. Bandingkan hasil backtest dengan forward test. Jika jauh berbeda, cari penyebabnya.

Hasil pengujian masa lalu **tidak menjamin** hasil masa depan. Fungsinya membuat Anda paham karakter strategi, termasuk seberapa dalam drawdown yang harus siap Anda hadapi.`],
    ['Dari akun demo ke live secara bertahap', 10, `Banyak trader konsisten di demo tetapi berantakan di live karena emosi berubah saat uangnya nyata. Karena itu, lakukan transisi bertahap.

**Syarat sebelum live (contoh):**
- Minimal satu bulan mengikuti rencana trading di demo dengan nilai kepatuhan tinggi.
- Tidak pernah melanggar batas rugi harian selama periode itu.
- Jurnal terisi lengkap.

**Tahapan:**
1. Mulai live dengan modal kecil yang siap Anda tanggung risikonya, risiko 0,5–1% per posisi.
2. Pertahankan aturan yang sama persis seperti di demo.
3. Evaluasi setiap bulan. Tambah modal hanya jika disiplin terjaga, bukan karena sedang untung besar.
4. Jika melanggar aturan berulang kali, kembali ke demo tanpa merasa gagal.

Butuh bantuan menilai kesiapan Anda? Ceritakan hasil jurnal Anda di menu **Tanya Doktor**.`],
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
  ['copytrade', 'Copy Trade Doktor Trader', 'Ikuti posisi strategi Doktor Trader secara otomatis melalui fitur copy trading Dupoin, dengan pengaturan risiko yang bisa Anda tentukan sendiri. Link strategi segera tersedia di sini.', 'Copy trade tetap berisiko dan dapat mengalami drawdown. Gunakan dana yang siap Anda tanggung risikonya.', '', ''],
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
  // Academy v2: 18 -> 30 materi. One-time: add the new courses (since: 2) and lessons tagged 2 to an
  // existing database, without touching lessons the admin has edited, reordered or removed.
  if (db.setting('academy_v2') !== '1') {
    let added = 0;
    COURSES.forEach((c) => {
      const cslug = slugify(c.title);
      let course = db.get('SELECT id FROM courses WHERE slug = ?', [cslug]);
      if (!course) {
        if (c.since !== 2) return;
        const pos = (db.get('SELECT MAX(position) m FROM courses') || {}).m || 0;
        course = { id: db.run('INSERT INTO courses(slug, title, level, summary, position, published) VALUES(?,?,?,?,?,1)', [cslug, c.title, c.level, c.summary, pos + 1]).lastInsertRowid };
      }
      c.lessons.forEach(([title, dur, body, ver]) => {
        if (ver !== 2 && c.since !== 2) return;
        const lslug = slugify(title);
        if (db.get('SELECT id FROM lessons WHERE course_id = ? AND slug = ?', [course.id, lslug])) return;
        const pos = (db.get('SELECT MAX(position) m FROM lessons WHERE course_id = ?', [course.id]) || {}).m || 0;
        db.run('INSERT INTO lessons(course_id, slug, title, video_url, body_md, duration_min, position, published) VALUES(?,?,?,?,?,?,?,1)', [course.id, lslug, title, '', body, dur, pos + 1]);
        added++;
      });
    });
    db.setSetting('academy_v2', '1');
    console.log(`[seed] academy v2 (+${added} materi)`);
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
  // Set file aman (cut loss aktif) untuk EA PIPTRACKER PRO GO-MART V1R
  if (db.setting('tool_piptracker_safe') !== '1') {
    const desc = [
      'File setting (.set) versi risiko lebih terkendali untuk EA **PIPTRACKER PRO GO-MART CUSTOM V1R** di XAUUSD, modal acuan $10.000, lot awal 0,02.',
      '',
      'Perubahan dari set bawaan "medium risk":',
      '- Cut loss aktif: equity stop 25% (`UseCutLoss=true`, `CutLossMode=1`, `CutLossPercent=25`)',
      '- Maksimal 12 layer per sisi (sebelumnya 999)',
      '- Lot per layer maksimal 1,0 (sebelumnya 100)',
      '',
      'File ini hanya setting. EA dan lisensinya tidak disertakan. Cek dulu apakah harga emas di broker Anda 2 atau 3 digit: step 277 point dirancang untuk 2 digit, jadi untuk 3 digit naikkan step sekitar 10 kali.',
    ].join('\n');
    const pos = (db.get("SELECT MAX(position) AS m FROM tools WHERE kind = 'ea'") || {}).m || 0;
    db.run('INSERT INTO tools(kind, title, description, risk_note, link_url, link_label, position, published) VALUES(?,?,?,?,?,?,?,1)', ['ea', 'Set PIPTRACKER GO-MART V1R: versi cut loss 25%', desc, 'Tinggi. Grid martingale dua arah; cut loss 25% artinya satu kejadian bisa memotong seperempat modal. Bukan jaminan profit. Uji di akun demo/cent dulu.', '/member/unduh/PIPTRACKER_GoMart_V1R_SAFE_10k_XAUUSD.set', 'Unduh set (.set)', pos + 1]);
    db.setSetting('tool_piptracker_safe', '1');
    console.log('[seed] tool piptracker safe set');
  }
  // Broker switch Vantage -> Dupoin (one-time rename in existing academy/tool texts)
  if (db.setting('broker_dupoin') !== '1') {
    db.run("UPDATE lessons SET title = REPLACE(title, 'Vantage', 'Dupoin'), body_md = REPLACE(body_md, 'Vantage', 'Dupoin') WHERE title LIKE '%Vantage%' OR body_md LIKE '%Vantage%'");
    db.run("UPDATE tools SET title = REPLACE(title, 'Vantage', 'Dupoin'), description = REPLACE(description, 'Vantage', 'Dupoin'), risk_note = REPLACE(risk_note, 'Vantage', 'Dupoin') WHERE title LIKE '%Vantage%' OR description LIKE '%Vantage%' OR risk_note LIKE '%Vantage%'");
    db.setSetting('broker_dupoin', '1');
    console.log('[seed] broker -> Dupoin');
  }
}

module.exports = { seed };
