# Naskah + spesifikasi scene. "vo" = teks yang diucapkan (angka ditulis biar TTS bacanya benar).
# "sub" (opsional) = versi teks untuk subtitle kalau beda dari vo.
TITLE = "Cara Entry XAUUSD Step by Step: VWAP, Order Block, FVG & CHoCH"

SCENES = [
 dict(id="s01_hook", chapter="Hook", visual="hook", vo=(
  "Kebanyakan trader gold nggak rugi karena analisanya salah. "
  "Mereka rugi karena masuk di tempat yang salah, di waktu yang salah. "
  "Harga udah lari jauh, baru ikut buy. Harga baru mau balik arah, malah buka posisi. "
  "Di video ini gue bongkar cara gue nentuin entry XAUUSD dari nol. "
  "Arah trend, area entry, konfirmasi, sampai di mana stop loss dan target ditaruh. "
  "Empat langkah, satu chart, dan di akhir ada checklist yang bisa lo pakai sebelum klik buy atau sell. "
  "Kalau lo lewatin, lo bakal terus nebak-nebak entry. Dan nebak itu mahal.")),
 dict(id="s02_setup", chapter="Hook", visual="roadmap", vo=(
  "Sebelum mulai, satu hal. Semua chart di video ini simulasi buat edukasi, bukan sinyal. "
  "Tujuannya biar lo ngerti logikanya, bukan nyalin levelnya. "
  "Konsep yang dipakai juga bukan barang baru: VWAP, EMA, order block, fair value gap, dan change of character. "
  "Yang bikin beda adalah urutannya. Kalau urutannya jelas, keputusan lo nggak lagi tergantung perasaan.")),
 dict(id="s03_trend", chapter="Langkah 1 · Arah trend", visual="trend", vo=(
  "Langkah pertama, tentuin arah. Gue pakai timeframe lima belas menit dengan dua alat: VWAP dan EMA sembilan. "
  "VWAP itu harga rata-rata yang ditimbang pakai volume sejak sesi dimulai. Anggap aja ini garis harga wajar hari itu. "
  "EMA sembilan itu rata-rata sembilan candle terakhir. Dia cepat, jadi nunjukin momentum sekarang. "
  "Aturannya simpel. Harga dan EMA sembilan ada di atas VWAP, gue cuma cari buy. "
  "Harga dan EMA sembilan ada di bawah VWAP, gue cuma cari sell. "
  "Kalau harga bolak-balik nyilang VWAP dan EMA-nya mendatar, itu pasar tanpa arah. Gue nggak trading. "
  "Langkah ini kelihatan sepele, tapi ini yang nyelametin lo dari kebiasaan paling mahal: ngelawan arus.")),
 dict(id="s04_area", chapter="Langkah 2 · Area entry", visual="area", vo=(
  "Langkah kedua, cari area. Masih di lima belas menit, gue cari dua hal. "
  "Pertama, order block. Ini candle terakhir yang berlawanan arah sebelum harga bergerak kuat. "
  "Kalau trend naik, berarti candle merah terakhir sebelum harga lompat ke atas. "
  "Kedua, fair value gap atau FVG. Ini celah di antara tiga candle, waktu harga gerak terlalu cepat sampai ada bagian yang nggak sempat ditransaksikan. "
  "Area terbaik itu tempat order block dan FVG saling tumpang tindih. "
  "Satu catatan: pilih area yang masih segar, yang belum pernah disentuh lagi sejak terbentuk. Area yang udah berkali-kali dites biasanya makin lemah. "
  "Terus yang paling penting: lo nunggu harga balik ke area itu. Lo nggak ngejar. "
  "Kalau harga nggak balik, ya udah. Lo nggak rugi apa-apa karena lo memang nggak masuk.")),
 dict(id="s05_confirm", chapter="Langkah 3 · Konfirmasi", visual="confirm", vo=(
  "Langkah ketiga, konfirmasi. Ini yang paling sering dilewatin. "
  "Harga nyentuh area bukan berarti langsung entry. Area itu cuma tempat lo mulai memperhatikan. "
  "Begitu harga masuk area, gue turun ke timeframe satu atau tiga menit. "
  "Di situ biasanya harga masih turun, bikin high yang makin rendah. "
  "Gue nunggu harga nembus high terakhir itu. Itu yang disebut change of character, atau CHoCH. "
  "Artinya tekanan jual mulai kalah. "
  "Syarat tambahannya, gerakan yang nembus itu harus ninggalin FVG kecil. Entry gue ada di FVG itu, waktu harga balik ngetes. "
  "Nggak ada CHoCH, nggak ada entry. Sesederhana itu.")),
 dict(id="s06_sltp", chapter="Langkah 4 · Stop loss & target", visual="sltp", vo=(
  "Langkah keempat, stop loss dan target. Stop loss gue taruh di bawah low yang bikin CHoCH tadi, ditambah buffer lima pips. "
  "Buffer ini biar posisi lo nggak kena cuma karena spread melebar sedikit. "
  "Target gue dua kali jarak stop loss. Risk reward satu banding dua. "
  "Kenapa dua? Coba itung. Sepuluh trade, menang cuma empat. Empat kali dua R sama dengan delapan R. "
  "Kalah enam, minus enam R. Hasilnya masih plus dua R, sebelum biaya. "
  "Jadi lo nggak harus sering benar. Lo cuma harus disiplin sama rasio ini.")),
 dict(id="s07_lot", chapter="Ukuran posisi", visual="lot", vo=(
  "Sekarang bagian yang bikin semua langkah tadi ada artinya: ukuran posisi. "
  "Banyak orang ngajarin cara nyari profit. Gue lebih tertarik ngajarin cara ngebangun modal tanpa ngancurin modal itu. "
  "Contoh simulasi. Modal sepuluh ribu dolar. Risiko satu persen per trade, berarti seratus dolar. "
  "Jarak stop loss lima dolar. Di XAUUSD, satu lot itu seratus ons, jadi tiap harga gerak satu dolar, nilainya seratus dolar per lot. "
  "Stop lima dolar berarti lima ratus dolar per lot. Seratus dibagi lima ratus, ketemu nol koma dua lot. "
  "Urutannya: risiko dulu, jarak stop kedua, lot terakhir. "
  "Jangan dibalik. Lot yang ditentuin dari perasaan itu jalan tercepat ke margin call.")),
 dict(id="s08_example", chapter="Contoh lengkap", visual="example", vo=(
  "Biar kebayang, kita jalanin satu contoh simulasi dari awal. "
  "Di lima belas menit, harga dan EMA sembilan ada di atas VWAP. Berarti cuma cari buy. "
  "Harga turun ke area di mana order block dan FVG tumpang tindih. Gue belum entry. "
  "Gue turun ke satu menit. Harga nembus high terakhir, CHoCH terbentuk, dan ninggalin FVG kecil. "
  "Harga balik ngetes FVG itu di empat ribu empat ratus dua belas koma lima. Di situ entry. "
  "Stop loss di empat ribu empat ratus tujuh koma lima, lima dolar di bawah. "
  "Target di empat ribu empat ratus dua puluh dua koma lima, sepuluh dolar di atas. "
  "Lot nol koma dua, risiko seratus dolar, potensi dua ratus dolar. "
  "Kalau harga balik turun dan kena stop, rugi sekitar seratus dolar, bisa sedikit lebih kalau ada slippage. Dan angka itu sudah diterima sebelum klik buy.")),
 dict(id="s08b_loss", chapter="Contoh yang gagal", visual="loss", vo=(
  "Sekarang contoh kedua, dan yang ini gagal. Gue sengaja tunjukin, karena video trading yang isinya menang semua itu nggak jujur. "
  "Semua syarat terpenuhi. Trend naik di atas VWAP, harga balik ke area, CHoCH muncul di satu menit, entry di FVG. "
  "Lima belas menit kemudian, harga turun nembus low dan kena stop loss. Rugi sekitar seratus dolar, satu R. "
  "Apa yang salah? Bisa jadi nggak ada yang salah. Setup yang bagus tetap bisa kalah. "
  "Itu sebabnya risiko per trade dibatasi satu persen. Satu kekalahan cuma satu R, bukan setengah akun. "
  "Yang perlu lo cek setelah loss cuma satu: apakah semua aturan diikutin. Kalau iya, itu biaya bisnis. Kalau nggak, itu pelajaran.")),
 dict(id="s09_skip", chapter="Kapan nggak entry", visual="skip", vo=(
  "Sama pentingnya: kapan gue nggak entry. "
  "Satu, harga bolak-balik di sekitar VWAP. Dua, area sudah dites berkali-kali, jadi kekuatannya udah kepakai. "
  "Tiga, ada berita besar kayak NFP, CPI, atau FOMC dalam waktu dekat. "
  "Empat, CHoCH nggak muncul. Lima, target dua R ketutup level lain, jadi rasionya nggak masuk. "
  "Skip itu juga keputusan. Kadang keputusan terbaik hari itu adalah nggak ngapa-ngapain.")),
 dict(id="s10_checklist", chapter="Checklist", visual="checklist", vo=(
  "Ini checklist-nya. Screenshot atau simpan. "
  "Satu, arah trend jelas di lima belas menit, harga dan EMA sembilan di sisi yang sama dari VWAP. "
  "Dua, harga balik ke area order block plus FVG. "
  "Tiga, ada CHoCH di satu atau tiga menit, dan ninggalin FVG. "
  "Empat, stop loss di bawah low plus buffer, target minimal dua R. "
  "Lima, lot dihitung dari risiko satu persen. "
  "Kalau satu aja nggak terpenuhi, nggak usah entry.")),
 dict(id="s11_cta", chapter="Penutup", visual="cta", vo=(
  "Ini edukasi umum. Trading pakai leverage bisa bikin lo rugi dan kehilangan modal. "
  "Kalau lo mau latihan nandain area dan CHoCH bareng trader lain, join komunitas trading di dhirajkelly dot i d. "
  "Dan tulis di komentar: dari lima langkah tadi, mana yang paling sering lo langgar? "
  "Gue Dhiraj Kelly. Manage risk, protect capital, trade smarter.")),
]
