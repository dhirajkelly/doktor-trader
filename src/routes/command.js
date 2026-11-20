// Trading Command Center (member): Market Scanner, AI Chart Analysis, Strategy Builder,
// Backtesting Engine, Risk Manager, Broker & MT5, AI Trading Journal.
// Hitungan berat (backtest, statistik jurnal) jalan di browser member (public/cc/*.js);
// server hanya menyimpan data member dan meneruskan permintaan AI.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const db = require('../db');
const auth = require('../auth');
const ai = require('../ai');
const { esc, md, SITE } = require('../views');
const { tvWidget } = require('../market');
const memberPage = require('./member').page;

const router = express.Router();
const BASE = '/member/command-center';
const DATA = path.join(__dirname, '..', '..', 'content', 'command-center');
const PUB = path.join(__dirname, '..', '..', 'public', 'cc');

// Versi aset statis (cache-busting): hash isi file saat server start.
const ver = (f) => { try { return crypto.createHash('md5').update(fs.readFileSync(path.join(PUB, f))).digest('hex').slice(0, 8); } catch { return '1'; } };
const V = { engine: ver('engine.js'), app: ver('app.js'), css: ver('cc.css') };

const TOOLS = [
  ['scanner', 'Market Scanner', 'Rating teknikal multi-timeframe untuk emas, perak, dan pair utama, plus screener forex.', 'Live'],
  ['chart-ai', 'AI Chart Analysis', 'Unggah screenshot chart. AI membedah struktur, area penting, skenario dua sisi, dan titik batalnya.', 'Live'],
  ['strategi', 'Strategy Builder', 'Ubah ide trading jadi aturan yang jelas: filter tren, pemicu entry, stop loss, RR, sesi, dan batas harian.', 'Live'],
  ['backtest', 'Backtesting Engine', 'Uji strategi ke data historis XAUUSD (contoh 3 bulan) atau data MT5-mu sendiri, lengkap dengan cek in-sample vs out-of-sample.', 'Live'],
  ['risk', 'Risk Manager', 'Ukuran lot, sisa jatah rugi harian, batas max loss (akun pribadi atau prop firm), dan total risiko posisi terbuka.', 'Live'],
  ['broker', 'Broker & MT5', 'Hubungkan alur kerja ke MT5: EA RiskGuard, impor riwayat MT5 ke jurnal, ekspor data bar untuk backtest.', 'Sebagian'],
  ['jurnal', 'AI Trading Journal', 'Catat atau impor trade, lihat pola kesalahan dan setup terbaik, lalu minta AI mereview kebiasaanmu.', 'Live'],
];
const ICON = {
  scanner: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  'chart-ai': '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  strategi: '<path d="M4 6h16M4 12h10M4 18h6"/>',
  backtest: '<path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/>',
  risk: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
  broker: '<path d="M9 7H6a4 4 0 0 0 0 8h3M15 7h3a4 4 0 0 1 0 8h-3M8 11h8"/>',
  jurnal: '<path d="M5 4h11l3 3v13H5z"/><path d="M9 10h6M9 14h6"/>',
};
const svg = (k, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

function page(req, res, key, body, { scripts = [] } = {}) {
  const t = TOOLS.find((x) => x[0] === key);
  const tabs = `<nav class="cc-tabs" aria-label="Tools Command Center"><a href="${BASE}"${key ? '' : ' class="on"'}>Semua tools</a>${TOOLS.map(([k, n]) => `<a href="${BASE}/${k}"${k === key ? ' class="on"' : ''}>${n}</a>`).join('')}</nav>`;
  const js = scripts.map((s) => `<script src="/cc/${s}.js?v=${V[s]}"></script>`).join('');
  memberPage(req, res, {
    title: t ? `${t[1]} · Command Center` : 'Trading Command Center', active: 'cc',
    body: `<link rel="stylesheet" href="/cc/cc.css?v=${V.css}">${tabs}<div id="cc" data-csrf="${esc(req.csrf)}" data-base="${BASE}">${body}</div>
<p class="dim" style="margin-top:28px">Semua tools di Command Center adalah alat bantu belajar dan disiplin, bukan sinyal atau rekomendasi transaksi. Hasil backtest adalah simulasi data masa lalu dan tidak menjamin hasil di masa depan.</p>${js}`,
  });
}

router.use(BASE, auth.requireApproved, express.json({ limit: '6mb' }));

const uid = (req) => req.user.id;
const num = (v) => { const n = Number(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : null; };
const str = (v, n = 200) => String(v ?? '').slice(0, n);
const countToday = (userId, action) => db.get("SELECT COUNT(*) n FROM activity WHERE user_id = ? AND action = ? AND created_at >= datetime('now', '-1 day')", [userId, action]).n;
const safeMd = (t) => md(String(t || '').replace(/</g, '&lt;'));

// ================= HUB =================
router.get(BASE, (req, res) => {
  const nT = db.get('SELECT COUNT(*) n FROM cc_journal WHERE user_id = ?', [uid(req)]).n;
  const nS = db.get('SELECT COUNT(*) n FROM cc_strategies WHERE user_id = ?', [uid(req)]).n;
  page(req, res, '', `<h1>Trading Command Center</h1>
<p class="muted" style="max-width:760px">Tujuh alat yang saling terhubung: <b>pindai</b> market, <b>bedah</b> chart, <b>rumuskan</b> strategi, <b>uji</b> ke data historis, <b>jaga</b> risiko, <b>sambungkan</b> ke MT5, lalu <b>catat dan evaluasi</b> di jurnal. Mulai dari satu alur dulu, uji, perbaiki, baru tambah.</p>
<div class="grid g3" style="margin:12px 0 20px">
<div class="card"><div class="dim">Strategi tersimpan</div><div class="stat">${nS}</div><a href="${BASE}/strategi">Buat strategi →</a></div>
<div class="card"><div class="dim">Trade di jurnal</div><div class="stat">${nT}</div><a href="${BASE}/jurnal">Buka jurnal →</a></div>
<div class="card"><div class="dim">Alur yang disarankan</div><div style="font-weight:700;margin:8px 0">Strategi → Backtest → Risk → Jurnal</div><a href="${BASE}/strategi">Mulai dari langkah 1 →</a></div></div>
<div class="grid g2">${TOOLS.map(([k, n, d, s], i) => `<a class="card cc-tool" href="${BASE}/${k}"><div class="spread"><span class="cc-ico">${svg(k)}</span><span class="pill ${s === 'Live' ? 'ok' : 'gray'}">${s === 'Live' ? 'Aktif' : 'Sebagian aktif'}</span></div>
<h3 style="margin:12px 0 6px">${i + 1}. ${n}</h3><p class="muted" style="margin:0">${d}</p></a>`).join('')}</div>`);
});

// ================= 1. MARKET SCANNER =================
const SCAN = [
  ['OANDA:XAUUSD', 'Emas · XAUUSD'], ['OANDA:XAGUSD', 'Perak · XAGUSD'], ['TVC:DXY', 'Indeks Dolar · DXY'], ['FX:EURUSD', 'EUR/USD'],
  ['FX:GBPUSD', 'GBP/USD'], ['FX:USDJPY', 'USD/JPY'], ['FX:AUDUSD', 'AUD/USD'], ['TVC:USOIL', 'Minyak WTI'],
];
router.get(`${BASE}/scanner`, (req, res) => {
  page(req, res, 'scanner', `<h1>Market Scanner</h1>
<p class="muted">Rating teknikal ringkas (rangkuman moving average dan oscillator dari TradingView) untuk instrumen yang sering dipantau trader emas. Pakai untuk <b>menyaring</b> mana yang sedang trending atau ranging, lalu bedah sendiri di chart. Ini bukan sinyal.</p>
<div class="row" role="group" aria-label="Pilih timeframe" style="margin:14px 0">${['15m', '1h', '4h', '1D'].map((t) => `<button type="button" class="btn sm ${t === '1h' ? '' : 'ghost'}" data-tf="${t}">${t === '1D' ? 'D1' : t.replace('m', 'M').replace(/^(\d+)h$/, 'H$1')}</button>`).join('')}</div>
<div class="cc-scan" id="scan">${SCAN.map(([s, n]) => `<div class="card" style="padding:12px"><div style="font-weight:800;margin:2px 4px 6px">${esc(n)}</div><div class="cc-tv" data-sym="${esc(s)}"></div></div>`).join('')}</div>
<h2 style="margin-top:28px">Screener forex</h2>
<p class="muted">Peringkat teknikal semua pair forex. Klik judul kolom untuk mengurutkan.</p>
<div class="card" style="padding:10px">${tvWidget('screener', { width: '100%', height: 560, defaultColumn: 'overview', defaultScreen: 'general', market: 'forex', showToolbar: true, colorTheme: 'dark', locale: 'id', isTransparent: true })}</div>
<p class="dim">Widget oleh <a href="https://id.tradingview.com/" target="_blank" rel="noopener nofollow">TradingView</a>. Data bisa tertunda. Rating "beli/jual" di widget adalah rangkuman indikator otomatis milik TradingView, bukan rekomendasi Doktor Trader.</p>
<script>(function(){function render(tf){document.querySelectorAll('#scan .cc-tv').forEach(function(el){el.innerHTML='';var w=document.createElement('div');w.className='tradingview-widget-container';w.innerHTML='<div class="tradingview-widget-container__widget"></div>';var s=document.createElement('script');s.src='https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';s.async=true;s.text=JSON.stringify({interval:tf,width:'100%',isTransparent:true,height:380,symbol:el.dataset.sym,showIntervalTabs:false,displayMode:'single',locale:'id',colorTheme:'dark'});w.appendChild(s);el.appendChild(w);});}
document.querySelectorAll('[data-tf]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('[data-tf]').forEach(function(x){x.classList.add('ghost')});b.classList.remove('ghost');render(b.dataset.tf);});});render('1h');})();</script>`);
});

// ================= 2. AI CHART ANALYSIS =================
const CHART_LIMIT = 10;
router.get(`${BASE}/chart-ai`, (req, res) => {
  const left = Math.max(0, CHART_LIMIT - countToday(uid(req), 'chart_ai'));
  page(req, res, 'chart-ai', `<h1>AI Chart Analysis</h1>
<p class="muted">Unggah screenshot chart (MT5, TradingView, dll.). Asisten AI membedah struktur tren, area support/resistance, gap/FVG yang tampak, skenario bullish <i>dan</i> bearish beserta titik batalnya, lalu checklist risiko. Tujuannya melatih caramu membaca chart, bukan memberi sinyal.</p>
${ai.enabled() ? `<div class="alert">Jatah analisa: <b id="left">${left}</b> dari ${CHART_LIMIT} per 24 jam.</div>` : '<div class="alert">Analisa AI otomatis sedang tidak aktif. Kamu tetap bisa memakai checklist bedah chart di bawah.</div>'}
<div class="card f">
<label for="ca-file">Screenshot chart (JPG/PNG)</label><input id="ca-file" type="file" accept="image/png,image/jpeg,image/webp">
<img id="ca-prev" alt="Pratinjau chart" hidden style="width:100%;border-radius:12px;border:1px solid var(--line)">
<label for="ca-note">Catatan (opsional)</label><textarea id="ca-note" maxlength="800" style="min-height:80px" placeholder="Contoh: XAUUSD M15, saya pakai EMA 9 dan VWAP. Saya melihat FVG di sekitar area bawah, apa yang perlu saya perhatikan?"></textarea>
<div class="row"><button class="btn" id="ca-go" type="button"${ai.enabled() && left ? '' : ' disabled'}>Bedah chart ini</button><span class="dim" id="ca-st" aria-live="polite"></span></div></div>
<div id="ca-out" class="card prose" hidden style="margin-top:16px;font-size:16px"></div>
<h2 style="margin-top:28px">Checklist bedah chart mandiri</h2>
<div class="card"><ol class="cc-check">
<li><b>Konteks:</b> instrumen, timeframe, sesi (Asia/London/New York), dan ada rilis berita besar hari ini?</li>
<li><b>Tren:</b> higher high/higher low atau lower high/lower low? Harga di atas atau di bawah EMA/VWAP?</li>
<li><b>Area:</b> tandai swing high/low terakhir, zona support/resistance, dan gap/FVG yang belum terisi.</li>
<li><b>Skenario A dan B:</b> konfirmasi apa yang kamu tunggu di masing-masing sisi?</li>
<li><b>Titik batal:</b> di harga berapa ide itu salah? Di situlah stop loss, bukan di angka acak.</li>
<li><b>Risiko:</b> jarak SL → ukuran lot di <a href="${BASE}/risk">Risk Manager</a>. RR minimal 1:2? Risiko ≤1% modal?</li>
<li><b>Catat:</b> simpan rencana dan hasilnya di <a href="${BASE}/jurnal">Jurnal</a>.</li></ol></div>`, { scripts: ['app'] });
});

router.post(`${BASE}/chart-ai/analyze`, async (req, res) => {
  const b = req.body || {};
  const m = String(b.image || '').match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return res.status(400).json({ error: 'Format gambar tidak dikenali.' });
  if (m[2].length > 5.5e6) return res.status(413).json({ error: 'Gambar terlalu besar.' });
  if (!ai.enabled()) return res.json({ status: 'off' });
  if (countToday(uid(req), 'chart_ai') >= CHART_LIMIT) return res.status(429).json({ error: `Jatah ${CHART_LIMIT} analisa per 24 jam sudah habis. Coba lagi besok.` });
  if (!auth.rateLimit(`chartai:${uid(req)}`, 3, 60e3)) return res.status(429).json({ error: 'Terlalu cepat. Tunggu sebentar.' });
  db.log(uid(req), 'chart_ai', '');
  const r = await ai.analyzeChart(m[2], m[1], b.note);
  if (r.status !== 'ok') return res.status(502).json({ error: 'Asisten AI sedang sibuk. Coba lagi beberapa menit lagi.' });
  res.json({ status: 'ok', html: safeMd(r.text), left: Math.max(0, CHART_LIMIT - countToday(uid(req), 'chart_ai')) });
});

// ================= 3. STRATEGY BUILDER =================
const strategies = (userId) => db.all('SELECT id, name, rules_json, updated_at FROM cc_strategies WHERE user_id = ? ORDER BY updated_at DESC', [userId])
  .map((r) => { try { return { id: r.id, name: r.name, rules: JSON.parse(r.rules_json), updated_at: r.updated_at }; } catch { return null; } }).filter(Boolean);
const jsonScript = (id, v) => `<script type="application/json" id="${id}">${JSON.stringify(v).replace(/</g, '\\u003c')}</script>`;

router.get(`${BASE}/strategi`, (req, res) => {
  page(req, res, 'strategi', `<h1>Strategy Builder</h1>
<p class="muted">Tulis ide tradingmu sebagai aturan yang bisa diuji: kapan boleh buy/sell (filter tren), apa pemicunya, di mana stop loss, berapa RR, jam berapa saja, dan berapa trade per hari. Simpan, lalu uji di <a href="${BASE}/backtest">Backtesting Engine</a>.</p>
<div class="alert">Builder ini hanya bisa mengotomatiskan aturan yang terukur (EMA, VWAP, breakout, RSI, ATR). Konsep diskresioner seperti order block, FVG, atau CHoCH belum bisa diuji otomatis di sini. Uji bagian yang terukur dulu, sisanya catat di jurnal.</div>
${jsonScript('cc-strats', strategies(uid(req)))}
<div id="sb"></div>`, { scripts: ['engine', 'app'] });
});

function cleanRules(r) {
  // Simpan apa adanya tapi batasi ukuran; validasi detail dilakukan engine saat dijalankan.
  const s = JSON.stringify(r || {});
  if (s.length > 4000) throw new Error('too big');
  return s;
}
router.post(`${BASE}/strategi/api/save`, (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 80).trim() || 'Strategi tanpa nama';
  let rules; try { rules = cleanRules(b.rules); } catch { return res.status(400).json({ error: 'Aturan tidak valid.' }); }
  const id = Number(b.id) || 0;
  if (id) {
    const r = db.run("UPDATE cc_strategies SET name = ?, rules_json = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [name, rules, id, uid(req)]);
    if (!r.changes) return res.status(404).json({ error: 'Strategi tidak ditemukan.' });
    return res.json({ ok: true, id, list: strategies(uid(req)) });
  }
  if (db.get('SELECT COUNT(*) n FROM cc_strategies WHERE user_id = ?', [uid(req)]).n >= 30) return res.status(400).json({ error: 'Maksimal 30 strategi. Hapus yang tidak dipakai.' });
  const r = db.run('INSERT INTO cc_strategies(user_id, name, rules_json) VALUES(?, ?, ?)', [uid(req), name, rules]);
  db.log(uid(req), 'cc_strategy', name);
  res.json({ ok: true, id: r.lastInsertRowid, list: strategies(uid(req)) });
});
router.post(`${BASE}/strategi/api/:id/hapus`, (req, res) => {
  db.run('DELETE FROM cc_strategies WHERE id = ? AND user_id = ?', [Number(req.params.id) || 0, uid(req)]);
  res.json({ ok: true, list: strategies(uid(req)) });
});

// ================= 4. BACKTESTING ENGINE =================
router.get(`${BASE}/backtest`, (req, res) => {
  page(req, res, 'backtest', `<h1>Backtesting Engine</h1>
<p class="muted">Uji strategi ke data historis. Mesin ini masuk di open candle berikutnya setelah sinyal, memotong biaya spread, menghitung lot dari persentase risiko, dan bila SL dan TP tersentuh di candle yang sama ia menganggap SL kena dulu (asumsi konservatif). Hasil dibagi dua: <b>in-sample</b> (70% data awal) dan <b>out-of-sample</b> (30% akhir). Kalau hasil 30% akhir jauh lebih buruk, kemungkinan strategimu terlalu pas dengan masa lalu (overfit).</p>
${jsonScript('cc-strats', strategies(uid(req)))}
<div id="bt"></div>
<p class="dim">Data contoh: XAUUSD 25 Feb – 26 Mei 2026 (M5 dan H1, waktu UTC, harga tengah/mid tanpa spread) dari <a href="https://github.com/Sai310421/xauusd-data" target="_blank" rel="noopener nofollow">xauusd-data</a> (lisensi MIT). Untuk hasil yang lebih mewakili akunmu, ekspor data bar dari MT5 broker-mu sendiri (panduan di <a href="${BASE}/broker">Broker &amp; MT5</a>).</p>`, { scripts: ['engine', 'app'] });
});
router.get(`${BASE}/data/:file`, (req, res, next) => {
  const f = req.params.file;
  if (!['xauusd-h1.json', 'xauusd-m5.json'].includes(f)) return next();
  res.set('Cache-Control', 'private, max-age=86400');
  res.sendFile(path.join(DATA, f));
});

// ================= 5. RISK MANAGER =================
router.get(`${BASE}/risk`, (req, res) => {
  const row = db.get('SELECT json FROM cc_risk WHERE user_id = ?', [uid(req)]);
  let saved = null; try { saved = row ? JSON.parse(row.json) : null; } catch { saved = null; }
  page(req, res, 'risk', `<h1>Risk Manager</h1>
<p class="muted">Satu layar untuk menjawab: <b>boleh trade lagi atau tidak hari ini, dan berapa lot?</b> Isi aturan akunmu (pribadi atau prop firm), saldo awal hari, dan posisi yang masih terbuka. Profil tersimpan di akunmu.</p>
${jsonScript('cc-risk', saved)}
<div id="rm"></div>
<p class="dim">Ingin batasnya ditegakkan otomatis di MT5? Pasang <a href="${BASE}/broker">EA DT RiskGuard</a>. Kontrak dihitung standar: XAUUSD 1 lot = 100 oz, XAGUSD 1 lot = 5.000 oz, forex 1 lot = 100.000 unit (cek spesifikasi kontrak di broker-mu).</p>`, { scripts: ['app'] });
});
router.post(`${BASE}/risk/api/save`, (req, res) => {
  const s = JSON.stringify(req.body || {});
  if (s.length > 8000) return res.status(400).json({ error: 'Data terlalu besar.' });
  db.run("INSERT INTO cc_risk(user_id, json, updated_at) VALUES(?, ?, datetime('now')) ON CONFLICT(user_id) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at", [uid(req), s]);
  res.json({ ok: true });
});

// ================= 6. BROKER & MT5 =================
router.get(`${BASE}/broker`, (req, res) => {
  const st = (s) => (s === 'live' ? '<span class="pill ok">Aktif</span>' : '<span class="pill gray">Segera</span>');
  page(req, res, 'broker', `<h1>Broker &amp; MT5</h1>
<p class="muted">Cara menyambungkan Command Center dengan akun MT5-mu. Kami <b>tidak pernah meminta password MT5</b> atau akses trading ke akunmu. Semua koneksi di bawah berjalan dari sisimu.</p>
<div class="grid g2" style="margin-top:12px">
<div class="card"><div class="spread"><h3 style="margin:0">1. Akun trading ${esc(SITE.brokerName)}</h3>${st('live')}</div>
<p class="muted">Akun MT5 di ${esc(SITE.brokerEntity)} (${esc(SITE.brokerLicense)}). Coba di akun demo dulu sebelum memakai uang sungguhan.</p>
<a class="btn sm" href="${esc(SITE.brokerUrl)}" target="_blank" rel="noopener sponsored">Buka akun ${esc(SITE.brokerName)}</a></div>
<div class="card"><div class="spread"><h3 style="margin:0">2. EA DT RiskGuard di MT5</h3>${st('live')}</div>
<p class="muted">Menegakkan aturan Risk Manager langsung di terminal: auto SL/TP, break-even, trailing, dan batas rugi harian. Pasang di chart mana saja lalu aktifkan Algo Trading.</p>
<div class="row"><a class="btn sm" href="/member/unduh/DT_RiskGuard.mq5">Unduh .mq5 (MT5)</a><a class="btn sm ghost" href="/member/unduh/DT_RiskGuard.mq4">.mq4 (MT4)</a></div></div>
<div class="card"><div class="spread"><h3 style="margin:0">3. Impor riwayat MT5 → Jurnal</h3>${st('live')}</div>
<ol class="cc-check"><li>Di MT5 desktop buka <b>Toolbox → History</b>.</li><li>Klik kanan → <b>Report → HTML</b>, pilih periode, simpan.</li><li>Unggah file itu di <a href="${BASE}/jurnal">Jurnal</a> → "Impor dari MT5". Posisi yang sudah pernah diimpor tidak akan dobel.</li></ol></div>
<div class="card"><div class="spread"><h3 style="margin:0">4. Ekspor data bar → Backtest</h3>${st('live')}</div>
<ol class="cc-check"><li>Di MT5 buka <b>View → Symbols</b> (Ctrl+U) → tab <b>Bars</b>.</li><li>Pilih simbol (mis. XAUUSD) dan timeframe, isi rentang tanggal, klik <b>Request</b>, lalu <b>Export Bars</b> (.csv).</li><li>Unggah CSV itu di <a href="${BASE}/backtest">Backtesting Engine</a> → "Data saya". Waktu di file mengikuti jam server broker.</li></ol></div>
<div class="card"><div class="spread"><h3 style="margin:0">5. Sinkron otomatis lewat API</h3>${st('soon')}</div>
<p class="muted">Jurnal yang terisi sendiri dari akun MT5 tanpa impor manual. Belum tersedia karena butuh koneksi API resmi yang aman (tanpa menitipkan password). Sementara itu, pakai impor HTML di langkah 3.</p></div>
<div class="card"><div class="spread"><h3 style="margin:0">6. Eksekusi order dari web</h3>${st('soon')}</div>
<p class="muted">Sengaja tidak disediakan. Keputusan dan eksekusi tetap di tanganmu di MT5. Command Center fokus ke analisa, uji strategi, dan disiplin risiko.</p></div>
</div>`);
});

// ================= 7. AI TRADING JOURNAL =================
const JOURNAL_COLS = 'id, opened_at, closed_at, symbol, side, lot, entry, sl, tp, exit_price, pnl, setup, mistakes, emotion, notes, source';
const trades = (userId) => db.all(`SELECT ${JOURNAL_COLS} FROM cc_journal WHERE user_id = ? ORDER BY COALESCE(closed_at, opened_at) DESC, id DESC LIMIT 5000`, [userId]);
const dt = (v) => { const m = String(v || '').trim().replace(/\./g, '-').match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/); return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4] || '00'}:${m[5] || '00'}:${m[6] || '00'}` : null; };
function cleanTrade(t) {
  const side = /^s/i.test(String(t.side || '')) ? 'sell' : 'buy';
  return [dt(t.opened_at), dt(t.closed_at), str(t.symbol, 20).toUpperCase().trim() || 'XAUUSD', side, num(t.lot), num(t.entry), num(t.sl), num(t.tp), num(t.exit_price), num(t.pnl),
    str(t.setup, 80).trim(), str(t.mistakes, 300), str(t.emotion, 30), str(t.notes, 1000), t.source === 'mt5' ? 'mt5' : t.source === 'csv' ? 'csv' : 'manual', t.ext_id ? str(t.ext_id, 40) : null];
}
const INS = 'INSERT INTO cc_journal(opened_at, closed_at, symbol, side, lot, entry, sl, tp, exit_price, pnl, setup, mistakes, emotion, notes, source, ext_id, user_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

router.get(`${BASE}/jurnal`, (req, res) => {
  page(req, res, 'jurnal', `<h1>AI Trading Journal</h1>
<p class="muted">Jurnal yang jujur adalah alat edukasi paling murah. Catat setiap trade (atau impor dari MT5), beri label setup, kesalahan, dan emosi, lalu lihat polanya: setup mana yang benar-benar bekerja, kesalahan mana yang paling mahal, dan jam berapa kamu paling sering rugi.</p>
${jsonScript('cc-trades', trades(uid(req)))}${jsonScript('cc-strats', strategies(uid(req)).map((s) => s.name))}
<div id="jr" data-ai="${ai.enabled() ? 1 : 0}"></div>`, { scripts: ['app'] });
});
router.post(`${BASE}/jurnal/api/add`, (req, res) => {
  if (db.get('SELECT COUNT(*) n FROM cc_journal WHERE user_id = ?', [uid(req)]).n >= 5000) return res.status(400).json({ error: 'Jurnal penuh (maks 5.000 trade).' });
  const v = cleanTrade(req.body || {});
  if (!v[0] || v[9] === null) return res.status(400).json({ error: 'Tanggal buka dan P/L wajib diisi.' });
  db.run(INS, [...v, uid(req)]);
  res.json({ ok: true, trades: trades(uid(req)) });
});
router.post(`${BASE}/jurnal/api/:id/hapus`, (req, res) => {
  db.run('DELETE FROM cc_journal WHERE id = ? AND user_id = ?', [Number(req.params.id) || 0, uid(req)]);
  res.json({ ok: true, trades: trades(uid(req)) });
});
router.post(`${BASE}/jurnal/api/:id/label`, (req, res) => {
  const b = req.body || {};
  db.run('UPDATE cc_journal SET setup = ?, mistakes = ?, emotion = ?, notes = ? WHERE id = ? AND user_id = ?',
    [str(b.setup, 80).trim(), str(b.mistakes, 300), str(b.emotion, 30), str(b.notes, 1000), Number(req.params.id) || 0, uid(req)]);
  res.json({ ok: true, trades: trades(uid(req)) });
});
router.post(`${BASE}/jurnal/api/import`, (req, res) => {
  const list = Array.isArray((req.body || {}).trades) ? req.body.trades.slice(0, 2000) : [];
  const have = db.get('SELECT COUNT(*) n FROM cc_journal WHERE user_id = ?', [uid(req)]).n;
  let added = 0, dup = 0, bad = 0;
  for (const t of list) {
    if (have + added >= 5000) break;
    const v = cleanTrade(t);
    if (!v[0] || v[9] === null) { bad++; continue; }
    if (v[15] && db.get('SELECT 1 x FROM cc_journal WHERE user_id = ? AND ext_id = ?', [uid(req), v[15]])) { dup++; continue; }
    db.run(INS, [...v, uid(req)]); added++;
  }
  db.log(uid(req), 'cc_import', `${added}`);
  res.json({ ok: true, added, dup, bad, trades: trades(uid(req)) });
});
const REVIEW_LIMIT = 5;
router.post(`${BASE}/jurnal/api/review`, async (req, res) => {
  if (!ai.enabled()) return res.json({ status: 'off' });
  if (countToday(uid(req), 'journal_ai') >= REVIEW_LIMIT) return res.status(429).json({ error: `Jatah ${REVIEW_LIMIT} review per 24 jam sudah habis.` });
  const summary = str((req.body || {}).summary, 6000);
  if (summary.length < 40) return res.status(400).json({ error: 'Jurnal masih kosong.' });
  db.log(uid(req), 'journal_ai', '');
  const r = await ai.reviewJournal(summary);
  if (r.status !== 'ok') return res.status(502).json({ error: 'Asisten AI sedang sibuk. Coba lagi nanti.' });
  res.json({ status: 'ok', html: safeMd(r.text) });
});

router.TOOLS = TOOLS;
module.exports = router;
