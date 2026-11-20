// Asisten AI untuk Tanya Doktor (dan Bedah Setup).
// Aktif bila ANTHROPIC_API_KEY ada di /etc/doktor-trader.env. Tanpa kunci, Tanya Doktor tetap
// menjawab instan dari materi Academy (pencarian) dan meneruskan pertanyaan ke Doktor.
const db = require('./db');

const KEY = () => process.env.ANTHROPIC_API_KEY || '';
const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const enabled = () => Boolean(KEY());

const STOP = new Set('yang dan atau di ke dari untuk pada dengan ini itu apa bagaimana kenapa saya aku gue gua lo kamu anda adalah akan bisa kalau jika juga sudah belum tidak nggak ga tapi karena dalam sebuah seperti agar supaya mau ingin harus lagi masih cara tentang'.split(' '));
const words = (t) => String(t || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

// Materi Academy yang paling relevan dengan pertanyaan (skor = kata yang cocok di judul x3 + isi).
function relatedLessons(question, n = 3) {
  const q = [...new Set(words(question))];
  if (!q.length) return [];
  const rows = db.all(`SELECT l.title, l.slug, l.body_md, c.slug AS cslug, c.title AS ctitle FROM lessons l JOIN courses c ON c.id = l.course_id
    WHERE l.published = 1 AND c.published = 1`);
  return rows.map((r) => {
    const t = r.title.toLowerCase();
    const b = String(r.body_md || '').toLowerCase();
    const score = q.reduce((a, w) => a + (t.includes(w) ? 3 : 0) + (b.includes(w) ? 1 : 0), 0);
    return { ...r, score };
  }).filter((r) => r.score >= 2).sort((a, b) => b.score - a.score).slice(0, n);
}

const SYSTEM = `Kamu adalah "Asisten AI Doktor Trader", asisten belajar di platform edukasi trading Doktor Trader (dhirajkelly.id) yang diasuh Dr. Dhiraj Kelly Sawlani, edukator manajemen risiko.

Tugas: menjawab pertanyaan member seputar istilah trading, konsep, manajemen risiko, psikologi, analisa teknikal/fundamental, dan membedah skenario risiko atau setup yang mereka ceritakan. Jawab dalam Bahasa Indonesia yang santai tapi rapi (sapa "kamu"), ringkas (maksimal ±250 kata), pakai Markdown sederhana (paragraf pendek, daftar bila perlu, hitungan bila relevan).

Aturan wajib:
- Edukasi saja. JANGAN memberi sinyal, ajakan buy/sell, prediksi arah harga, target harga, atau rekomendasi transaksi pribadi. Kalau diminta, tolak singkat dan alihkan ke cara menilai setup sendiri (alasan entry, letak stop loss, kapan setup batal, risk-reward, ukuran lot).
- Untuk "bedah setup": nilai prosesnya (apakah ada alasan entry yang jelas, SL di titik yang membatalkan ide, R:R, risiko per posisi ≤1–2% modal, event berita), bukan apakah harga akan naik/turun.
- Jangan menjanjikan profit, win rate, atau hasil. Jangan menyarankan deposit, menambah modal, atau broker tertentu. Dupoin (mitra broker) boleh disebut netral bila ditanya.
- Jangan mengaku sebagai Dr. Dhiraj Kelly pribadi; kamu asisten AI yang memakai materi Academy-nya.
- Untuk hitungan lot: XAUUSD akun standar 1 lot = 100 oz (gerak $1 = $100/lot); forex 1 lot = 100.000 unit. Sebut bahwa kontrak bisa berbeda per broker/akun. Arahkan ke kalkulator lot /alat/kalkulator-lot bila relevan.
- Kalau tidak yakin atau fakta bisa berubah (regulasi, jadwal rilis, spesifikasi broker), katakan terus terang dan sarankan cek sumber resmi.
- Kalau pertanyaan di luar trading/keuangan, jawab singkat bahwa kamu khusus untuk belajar trading.
- Kalau member menunjukkan tekanan berat (rugi besar, utang, putus asa), jawab dengan empati, sarankan berhenti trading sementara dan bicara dengan orang terdekat atau profesional.
- Tutup dengan satu kalimat pendek: "Ini edukasi, bukan rekomendasi transaksi."`;

async function answer(question, topic) {
  const lessons = relatedLessons(question + ' ' + (topic || ''));
  if (!enabled()) return { status: 'off', text: null, lessons };
  const ctx = lessons.map((l) => `### ${l.ctitle} · ${l.title} (/member/academy/${l.cslug}/${l.slug})\n${String(l.body_md || '').slice(0, 1800)}`).join('\n\n');
  const user = `${ctx ? `Materi Academy yang relevan (pakai sebagai acuan; sebutkan judul + link materinya bila membantu):\n\n${ctx}\n\n---\n\n` : ''}Topik: ${topic || '-'}\nPertanyaan member:\n${question}`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 45000);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': KEY(), 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL(), max_tokens: 900, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
    if (!text) throw new Error('empty');
    return { status: 'ok', text, lessons };
  } catch (e) {
    console.error('[ai]', e.message);
    return { status: 'error', text: null, lessons };
  } finally {
    clearTimeout(timer);
  }
}


// ===== Command Center: AI Chart Analysis (vision) & review jurnal =====
const CHART_SYSTEM = `Kamu "Asisten AI Doktor Trader" yang membantu member BELAJAR membaca chart. Member mengunggah screenshot chart. Jawab dalam Bahasa Indonesia (sapa "kamu"), Markdown, maksimal ±300 kata, dengan bagian berikut:
1. **Apa yang terlihat** — instrumen, timeframe, dan indikator bila terbaca di gambar (kalau tidak terbaca, katakan).
2. **Struktur & tren** — higher high/higher low atau sebaliknya, fase (trending/ranging), posisi harga terhadap MA/VWAP bila ada.
3. **Area penting** — zona support/resistance, swing high/low, gap/FVG atau order block yang tampak, sebut sebagai zona harga perkiraan dari gambar.
4. **Skenario yang perlu dipantau** — minimal dua sisi (bullish dan bearish), masing-masing: konfirmasi apa yang ditunggu dan di mana ide itu batal.
5. **Checklist risiko** — di mana stop loss logis untuk tiap skenario, cek jarak SL vs risk-reward minimal 1:2, risiko ≤1% modal, dan event berita.
Aturan wajib: edukasi saja. JANGAN memberi sinyal buy/sell, rekomendasi masuk sekarang, target "pasti", atau prediksi arah. Angka harga dari gambar adalah perkiraan visual dan bisa meleset; minta member memverifikasi di platformnya. Jangan menjanjikan profit. Kalau gambar bukan chart trading, katakan singkat. Tutup dengan: "Ini edukasi, bukan rekomendasi transaksi."`;

const JOURNAL_SYSTEM = `Kamu "Asisten AI Doktor Trader" yang mereview jurnal trading member dari ringkasan statistik (bukan data mentah). Bahasa Indonesia, sapa "kamu", Markdown, maksimal ±280 kata. Isi: 3 pola terkuat dari data (sebut angkanya), 2 kebiasaan yang paling mahal (kesalahan/emosi/jam/setup dengan P/L terburuk), dan 3 aturan perbaikan konkret untuk 20 trade berikutnya (mis. batas trade per hari, berhenti setelah 2 loss, hanya setup X). Jangan memberi sinyal atau prediksi harga, jangan menyarankan menambah modal atau deposit. Bila sampel <20 trade, ingatkan bahwa sampel kecil. Kalau data menunjukkan rugi besar beruntun, sarankan jeda trading dengan empati. Tutup: "Ini edukasi, bukan rekomendasi transaksi."`;

async function callClaude(system, content, maxTokens = 1000) {
  if (!enabled()) return { status: 'off', text: null };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 60000);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': KEY(), 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL(), max_tokens: maxTokens, system, messages: [{ role: 'user', content }] }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
    if (!text) throw new Error('empty');
    return { status: 'ok', text };
  } catch (e) {
    console.error('[ai]', e.message);
    return { status: 'error', text: null };
  } finally { clearTimeout(timer); }
}

function analyzeChart(base64, mediaType, note) {
  return callClaude(CHART_SYSTEM, [
    { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
    { type: 'text', text: `Catatan member: ${String(note || '-').slice(0, 800)}\nBedah chart ini sesuai format.` },
  ], 1100);
}

function reviewJournal(summary) {
  return callClaude(JOURNAL_SYSTEM, [{ type: 'text', text: `Ringkasan jurnal member:\n${String(summary).slice(0, 6000)}` }], 900);
}

module.exports = { enabled, answer, relatedLessons, analyzeChart, reviewJournal };
