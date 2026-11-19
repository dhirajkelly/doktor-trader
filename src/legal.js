// Privacy policy and terms. Plain HTML so the operator can read and amend them in one place.
const { SITE } = require('./views');

const wa = `<a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp ${SITE.whatsapp.replace(/^62/, '0')}</a>`;

function privacy() {
  return {
    slug: 'kebijakan-privasi',
    title: 'Kebijakan Privasi',
    description: 'Bagaimana Doktor Trader (dhirajkelly.id) mengumpulkan, memakai, menyimpan, dan melindungi data pribadi Anda sesuai UU Pelindungan Data Pribadi.',
    html: `
<p>Kebijakan ini menjelaskan bagaimana Doktor Trader di <strong>dhirajkelly.id</strong> ("kami") memproses data pribadi Anda. Pengendali data adalah ${SITE.author} (Dhiraj Kelly Sawlani) selaku pengelola Doktor Trader. Kami memproses data pribadi dengan mengacu pada Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p>

<h2>1. Data yang kami kumpulkan</h2>
<ul>
<li><strong>Data pendaftaran member</strong>: nama, nomor WhatsApp, email untuk login, email dan nomor akun yang terdaftar di ${SITE.brokerName}, serta pengalaman trading yang Anda pilih.</li>
<li><strong>Password</strong>: disimpan dalam bentuk hash (bcrypt). Kami tidak dapat melihat password asli Anda.</li>
<li><strong>Aktivitas member</strong>: pertanyaan yang Anda kirim lewat Tanya Doktor, progres materi Academy, unduhan alat, dan waktu login.</li>
<li><strong>Data teknis</strong>: cookie sesi (<code>dt_sid</code>) dan cookie keamanan formulir (<code>dt_csrf</code>), alamat IP yang dipakai sementara untuk pembatasan percobaan login/daftar, serta catatan server standar.</li>
<li><strong>Statistik klik anonim</strong>: saat Anda mengklik tombol buka akun ${SITE.brokerName}, WhatsApp, atau daftar, kami mencatat jenis klik dan halaman asalnya saja, tanpa nama, email, atau identitas lain.</li>
</ul>
<p>Kami tidak memakai cookie iklan atau pelacak pihak ketiga.</p>

<h2>2. Tujuan pemrosesan</h2>
<ul>
<li>Memverifikasi bahwa akun ${SITE.brokerName} Anda dibuka melalui link referral Doktor Trader, lalu mengaktifkan akses member.</li>
<li>Menyediakan layanan member: Academy, Tanya Doktor, Analisa Doktor, Market Watch, unduhan alat, dan pendaftaran webinar.</li>
<li>Menghubungi Anda lewat WhatsApp atau email terkait akun dan layanan member.</li>
<li>Menjaga keamanan situs dan mencegah penyalahgunaan.</li>
<li>Mengukur halaman mana yang membantu pengunjung, secara agregat.</li>
</ul>
<p>Dasar pemrosesan adalah persetujuan Anda saat mendaftar dan kebutuhan untuk menjalankan layanan yang Anda minta.</p>

<h2>3. Berbagi data dengan pihak lain</h2>
<p>Kami <strong>tidak menjual</strong> data pribadi Anda. Data hanya dibagikan atau dicocokkan dalam keadaan berikut:</p>
<ul>
<li><strong>${SITE.brokerEntity}</strong>: kami mencocokkan email atau nomor akun yang Anda berikan dengan data referral yang tersedia bagi kami sebagai mitra, semata untuk verifikasi keanggotaan.</li>
<li><strong>Penyedia infrastruktur</strong>: situs dihosting di server virtual milik penyedia cloud di Indonesia. Halaman memuat font dari Google Fonts dan video materi dari YouTube (mode privasi ditingkatkan), sehingga alamat IP Anda dapat terlihat oleh penyedia tersebut saat halaman dimuat.</li>
<li><strong>Penyedia AI (Anthropic)</strong>: teks pertanyaan yang Anda kirim di Tanya Doktor diproses oleh layanan AI Anthropic untuk menghasilkan jawaban otomatis. Nama, email, dan nomor WhatsApp Anda tidak ikut dikirim. Jangan menulis data pribadi atau data akun di pertanyaan.</li>
<li><strong>TradingView</strong>: halaman Market Watch memuat widget pasar dari TradingView, sehingga alamat IP Anda dapat terlihat oleh TradingView saat halaman itu dibuka.</li>
<li><strong>Kewajiban hukum</strong>: bila diminta oleh otoritas yang berwenang sesuai peraturan perundang-undangan.</li>
</ul>

<h2>4. Penyimpanan dan keamanan</h2>
<p>Data disimpan selama akun member Anda aktif. Jika Anda meminta penghapusan atau akun tidak aktif lebih dari 24 bulan, data akan dihapus atau dianonimkan, kecuali yang wajib disimpan menurut hukum. Kami melindungi data dengan koneksi terenkripsi (HTTPS), password yang di-hash, akses admin terbatas, dan cookie <em>HttpOnly</em>.</p>

<h2>5. Hak Anda</h2>
<p>Sesuai UU PDP, Anda berhak untuk:</p>
<ul>
<li>mendapat informasi tentang pemrosesan data Anda;</li>
<li>mengakses dan memperoleh salinan data Anda;</li>
<li>memperbaiki data yang tidak akurat;</li>
<li>menarik persetujuan dan meminta penghapusan data;</li>
<li>mengajukan keberatan atas pemrosesan tertentu.</li>
</ul>
<p>Ajukan permintaan lewat ${wa}. Kami akan menanggapi dalam waktu paling lambat 3 x 24 jam sejak permintaan diterima dan identitas Anda terverifikasi.</p>

<h2>6. Pemberitahuan kegagalan pelindungan data</h2>
<p>Jika terjadi kegagalan pelindungan data yang memengaruhi data Anda, kami akan memberi tahu Anda dan pihak terkait sesuai ketentuan UU PDP.</p>

<h2>7. Anak di bawah umur</h2>
<p>Layanan Doktor Trader ditujukan untuk pengguna berusia 18 tahun ke atas. Kami tidak dengan sengaja mengumpulkan data anak.</p>

<h2>8. Perubahan kebijakan</h2>
<p>Kebijakan ini dapat diperbarui. Tanggal pembaruan terakhir tercantum di atas. Perubahan penting akan kami umumkan di situs ini.</p>

<h2>9. Kontak</h2>
<p>Pertanyaan tentang privasi: ${wa}.</p>`,
  };
}

function terms() {
  const c = SITE.cert;
  return {
    slug: 'syarat-ketentuan',
    title: 'Syarat dan Ketentuan',
    description: 'Syarat dan ketentuan penggunaan Doktor Trader (dhirajkelly.id): sifat edukasi, risiko trading, akses member gratis, hubungan referral Dupoin, dan batas tanggung jawab.',
    html: `
<p>Dengan memakai <strong>dhirajkelly.id</strong> dan layanan Doktor Trader, Anda menyetujui syarat berikut. Jika tidak setuju, mohon tidak menggunakan layanan ini.</p>

<h2>1. Sifat layanan: edukasi</h2>
<p>Seluruh konten Doktor Trader, termasuk artikel, Academy, Tanya Doktor, analisa, contoh entry/stop loss/take profit, kalkulator, EA, AI Signals, dan Copy Trade, disediakan <strong>untuk tujuan edukasi</strong>. Konten tersebut <strong>bukan</strong> nasihat investasi pribadi, ajakan, atau rekomendasi untuk membeli atau menjual instrumen apa pun. Keputusan transaksi sepenuhnya menjadi tanggung jawab Anda.</p>

<h2>2. Risiko trading</h2>
<p>Trading forex, emas, dan kontrak berjangka memakai leverage dan memiliki risiko tinggi. Anda dapat kehilangan sebagian atau seluruh dana. Kinerja masa lalu, hasil backtest, atau contoh hitungan tidak menjamin hasil di masa depan. Kami tidak menjanjikan keuntungan dalam bentuk apa pun. Gunakan hanya dana yang siap Anda tanggung risikonya.</p>

<h2>3. Akses member gratis dan syaratnya</h2>
<ul>
<li>Akses member tidak dipungut biaya langganan. Syaratnya, Anda membuka dan memverifikasi akun trading di ${SITE.brokerName} melalui link referral resmi Doktor Trader.</li>
<li>Akses diaktifkan setelah kami memverifikasi akun Anda secara manual. Kami dapat menolak, menangguhkan, atau mencabut akses bila data tidak sesuai atau terjadi pelanggaran syarat ini.</li>
<li>Fitur dan materi dapat berubah, ditambah, atau dihentikan sewaktu-waktu.</li>
<li>Anda wajib berusia minimal 18 tahun dan menjaga kerahasiaan akun Anda.</li>
</ul>

<h2>4. Hubungan dengan ${SITE.brokerName}</h2>
<p>Doktor Trader adalah mitra referral ${SITE.brokerName} (${SITE.brokerEntity}; ${SITE.brokerLicense}). Kami dapat menerima komisi dari ${SITE.brokerName} atas akun yang dibuka melalui link kami, tanpa biaya tambahan bagi Anda. Doktor Trader bukan pialang, tidak menerima atau mengelola dana nasabah, dan tidak menjalankan transaksi atas nama Anda. Pembukaan akun, penyetoran, penarikan, dan transaksi tunduk pada perjanjian Anda dengan ${SITE.brokerName} serta peraturan yang berlaku.</p>
<p><strong>Kami tidak pernah meminta Anda menitipkan atau mentransfer dana ke rekening pribadi siapa pun.</strong> Jika ada pihak yang mengatasnamakan Doktor Trader atau ${SITE.author} dan meminta hal tersebut, abaikan dan laporkan kepada kami.</p>

<h2>5. Kredensial penulis</h2>
<p>${SITE.author} memegang: ${SITE.credentials.join('; ')}; serta ${c.title} di bidang ${c.field} (No. Sertifikat ${c.number}, No. Reg. ${c.reg}) yang diterbitkan ${c.issuer} atas nama BNSP pada ${c.issued}, berlaku hingga ${c.validUntil}. Izin dan sertifikat tersebut melekat pada pribadi penulis. Doktor Trader adalah layanan edukasi, bukan manajer investasi, penasihat berjangka, atau jasa pengelolaan dana.</p>

<h2>6. EA, sinyal, dan Copy Trade</h2>
<p>Jawaban Tanya Doktor dibuat otomatis oleh asisten AI berdasarkan materi Academy. Jawaban AI bisa keliru atau tidak lengkap, bukan nasihat atau rekomendasi transaksi pribadi, dan dapat dilengkapi catatan dari tim Doktor. "AI Signals" terdiri dari indikator berbasis aturan teknikal dan fitur Bedah Setup oleh asisten AI; keduanya tidak memprediksi arah harga. Menu Copy Trade saat ini berisi materi belajar; akses menyalin strategi Doktor Trader belum tersedia dan akan diumumkan di menu tersebut.</p>
<p>Alat otomatis dan sinyal disediakan apa adanya untuk pembelajaran. Hasilnya dapat berbeda karena spread, slippage, latensi, dan spesifikasi akun. Uji terlebih dahulu di akun demo. Anda bertanggung jawab penuh atas penggunaannya di akun riil.</p>

<h2>7. Hak kekayaan intelektual</h2>
<p>Konten, materi Academy, dan alat Doktor Trader dilindungi hak cipta. Anda boleh memakainya untuk belajar pribadi, tetapi tidak boleh menjual, menyebarluaskan ulang, atau mengklaimnya sebagai milik Anda tanpa izin tertulis.</p>

<h2>8. Penggunaan yang dilarang</h2>
<p>Anda dilarang menyalahgunakan situs, mencoba mengakses area admin, membagikan akun member, atau memakai konten Doktor Trader untuk menawarkan pengelolaan dana, janji profit, atau skema investasi kepada orang lain.</p>

<h2>9. Batas tanggung jawab</h2>
<p>Sejauh diizinkan hukum, kami tidak bertanggung jawab atas kerugian trading, kehilangan dana, atau kerugian tidak langsung yang timbul dari penggunaan konten maupun alat di situs ini.</p>

<h2>10. Hukum yang berlaku</h2>
<p>Syarat ini tunduk pada hukum Republik Indonesia. Perselisihan diupayakan diselesaikan secara musyawarah terlebih dahulu.</p>

<h2>11. Perubahan dan kontak</h2>
<p>Syarat ini dapat diperbarui sewaktu-waktu; tanggal pembaruan tercantum di atas. Pertanyaan: ${wa}. Baca juga <a href="/kebijakan-privasi">Kebijakan Privasi</a>.</p>`,
  };
}

module.exports = { privacy, terms };
