// Analisa Doktor, Market Watch, dan Webinar bulanan (halaman member + CRM admin).
const express = require('express');
const db = require('../db');
const auth = require('../auth');
const { esc, md, flash, csrfField, fmtDate, slugify, SITE } = require('../views');
const memberPage = require('./member').page;
const adminPage = require('./admin').page;

const router = express.Router();
const M = auth.requireApproved;
const A = auth.requireAdmin;

const nowWib = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const fmtWib = (s) => {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return esc(s);
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][Number(m[2]) - 1];
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`).getUTCDay()];
  return `${hari}, ${Number(m[3])} ${bulan} ${m[1]} · ${m[4]}.${m[5]} WIB`;
};
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u).slice(0, 400) : '');

// ================= ANALISA DOKTOR =================
const ILLUS = '<span class="pill gray">Ilustrasi edukasi · bukan data harga riil</span>';
const VERDICT = { entry: ['Setup diambil', 'ok'], skip: ['Setup dilewati', 'bad'] };
// Video Analisa Harian XAUUSD: content/analisa-videos.json = [{ "date": "YYYY-MM-DD", "title": "...", "url": "https://www.instagram.com/reel/<code>/" }]
// Ditulis oleh scheduled task "XAUUSD daily plan + video Short" setelah video terposting. Hanya link postingan IG
// (videonya tetap di Instagram, tidak disimpan di VPS). Terbaru di atas.
const fs = require('fs');
const path = require('path');
const ANALISA_VIDEOS = path.join(__dirname, '..', '..', 'content', 'analisa-videos.json');
function analisaVideos() {
  try {
    const list = JSON.parse(fs.readFileSync(ANALISA_VIDEOS, 'utf8'));
    return Array.isArray(list) ? list.filter((v) => v && safeUrl(v.url)).sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
  } catch (e) { return []; }
}
const ytId = (u) => (String(u || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/) || [])[1];
function videoBlock() {
  const vids = analisaVideos();
  if (!vids.length) return '';
  const top = vids[0];
  const id = ytId(top.url);
  const ig = (String(top.url).match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/) || [])[1];
  const player = ig
    ? `<iframe src="https://www.instagram.com/reel/${ig}/embed" title="${esc(top.title || 'Video analisa harian')}" loading="lazy" allowtransparency="true" style="width:100%;max-width:400px;height:720px;border:0;border-radius:14px;background:#fff"></iframe><p style="margin-top:10px"><a class="btn ghost sm" href="${esc(safeUrl(top.url))}" target="_blank" rel="noopener">Buka di Instagram ↗</a></p>`
    : id
    ? `<div style="position:relative;max-width:360px;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(top.title || 'Video analisa harian')}" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>`
    : `<a class="btn sm" href="${esc(safeUrl(top.url))}" target="_blank" rel="noopener">Tonton video ↗</a>`;
  const more = vids.slice(1, 15).map((v) => `<li><a href="${esc(safeUrl(v.url))}" target="_blank" rel="noopener">${esc(v.date)} · ${esc(v.title || 'Analisa XAUUSD')}</a></li>`).join('');
  return `<h2 style="margin-top:22px">Video Analisa Harian XAUUSD</h2>
<p class="dim">Cara Dr. Dhiraj menyusun trading plan hari kerja: tren H1, entry M5, SL/TP, RR, dan risiko per trade. Edukasi, bukan ajakan trading.</p>
<div class="card" style="margin-top:12px"><div class="dim" style="margin-bottom:10px">${esc(top.date)} · ${esc(top.title || '')}</div>${player}
${more ? `<h3 style="margin-top:18px;font-size:17px">Video sebelumnya</h3><ul>${more}</ul>` : ''}</div>`;
}
const verdictPill = (v) => `<span class="pill ${(VERDICT[v] || VERDICT.entry)[1]}">${(VERDICT[v] || VERDICT.entry)[0]}</span>`;

router.get('/member/analisa', M, (req, res) => {
  const rows = db.all('SELECT * FROM case_studies WHERE published = 1 ORDER BY id DESC');
  memberPage(req, res, {
    title: 'Analisa Doktor', active: 'analisa',
    body: `<h1>Analisa Doktor</h1>
<p class="muted">Studi kasus untuk dipelajari: kenapa entry di situ (atau kenapa dilewati), di mana stop loss, berapa targetnya, dan kapan setup dianggap batal. Ini bahan belajar membaca proses, <b>bukan sinyal atau rekomendasi transaksi</b>.</p>
${videoBlock()}
${rows.length ? `<div class="grid g2" style="margin-top:18px">${rows.map((c) => `<a class="card" href="/member/analisa/${esc(c.slug)}" style="text-decoration:none;color:inherit">
<div class="row">${verdictPill(c.verdict)}<span class="pill gray">${esc(c.instrument)} · ${esc(c.timeframe)}</span></div>
<h3 style="margin:10px 0 6px">${esc(c.title)}</h3><p class="muted" style="margin:0">${esc(String(c.context_md || '').replace(/[#*_>`]/g, '').slice(0, 150))}…</p>
${c.is_illustration ? `<div class="dim" style="margin-top:10px">Ilustrasi edukasi</div>` : `<div class="dim" style="margin-top:10px">${fmtDate(c.created_at)}</div>`}</a>`).join('')}</div>` : '<div class="alert">Studi kasus pertama sedang disiapkan.</div>'}`,
  });
});

router.get('/member/analisa/:slug', M, (req, res, next) => {
  const c = db.get('SELECT * FROM case_studies WHERE slug = ? AND published = 1', [req.params.slug]);
  if (!c) return next();
  db.log(req.user.id, 'case_study', c.slug);
  const sec = (h, v) => (v ? `<h2 style="font-size:20px;margin-top:24px">${h}</h2><div class="prose">${md(v)}</div>` : '');
  memberPage(req, res, {
    title: c.title, active: 'analisa',
    body: `<a href="/member/analisa" class="dim">← Semua studi kasus</a>
<h1 style="margin-top:8px">${esc(c.title)}</h1>
<div class="row">${verdictPill(c.verdict)}<span class="pill gray">${esc(c.instrument)} · ${esc(c.timeframe)}</span>${c.is_illustration ? ILLUS : ''}</div>
${c.image_url ? `<img src="${esc(c.image_url)}" alt="Chart ${esc(c.title)}" style="width:100%;border-radius:14px;margin-top:18px">` : ''}
${sec('Kondisi pasar', c.context_md)}
${sec(c.verdict === 'skip' ? 'Kenapa tidak entry' : 'Kenapa entry di situ', c.entry_md)}
${sec('Di mana stop loss', c.sl_md)}
${sec('Target & risk-reward', c.tp_md)}
${sec('Kapan setup batal', c.invalid_md)}
${sec('Pelajaran', c.lesson_md)}
<div class="alert" style="margin-top:24px">Studi kasus ini edukasi, bukan sinyal atau ajakan transaksi. Hitung ukuran posisimu sendiri dengan <a href="/alat/kalkulator-lot">kalkulator lot</a>, atau <a href="/member/tanya?topik=Bedah%20setup">minta Asisten AI membedah setup-mu</a>.</div>`,
  });
});

const CS_FIELDS = [
  ['context_md', 'Kondisi pasar'], ['entry_md', 'Kenapa entry / kenapa dilewati'], ['sl_md', 'Di mana stop loss'],
  ['tp_md', 'Target & risk-reward'], ['invalid_md', 'Kapan setup batal'], ['lesson_md', 'Pelajaran'],
];
function caseForm(req, res, c = { published: 1, is_illustration: 1, instrument: 'XAUUSD', timeframe: 'H1', verdict: 'entry' }) {
  adminPage(req, res, {
    title: 'Analisa Doktor', active: 'analisa',
    body: `<a href="/admin/analisa" class="dim">← Semua studi kasus</a><h1>${c.id ? 'Edit' : 'Tambah'} studi kasus</h1>
<form class="f card" method="post" action="/admin/analisa/${c.id || 'baru'}">${csrfField(req.csrf)}
<label>Judul</label><input name="title" required value="${esc(c.title || '')}">
<div class="grid g3"><div><label>Instrumen</label><input name="instrument" value="${esc(c.instrument || '')}"></div><div><label>Timeframe</label><input name="timeframe" value="${esc(c.timeframe || '')}"></div>
<div><label>Keputusan</label><select name="verdict"><option value="entry"${c.verdict !== 'skip' ? ' selected' : ''}>Setup diambil</option><option value="skip"${c.verdict === 'skip' ? ' selected' : ''}>Setup dilewati</option></select></div></div>
<label>URL gambar chart (opsional)</label><input name="image_url" value="${esc(c.image_url || '')}" placeholder="https://… atau /nama-file.webp">
${CS_FIELDS.map(([k, l]) => `<label>${l} (Markdown)</label><textarea name="${k}" style="min-height:90px">${esc(c[k] || '')}</textarea>`).join('')}
<div class="row"><label class="row" style="font-weight:500"><input type="checkbox" name="is_illustration" value="1" ${c.is_illustration ? 'checked' : ''} style="width:auto;min-height:auto"> Ilustrasi (bukan data harga riil)</label>
<select name="published" style="width:auto"><option value="1"${c.published !== 0 ? ' selected' : ''}>Tayang</option><option value="0"${c.published === 0 ? ' selected' : ''}>Draft</option></select><button class="btn">Simpan</button></div>
<p class="dim">Wajib edukasi: jelaskan proses (alasan entry, SL, invalidasi). Jangan tulis ajakan buy/sell, target "pasti", atau klaim hasil. Kalau memakai chart riil, cantumkan tanggal dan sumber chart di "Kondisi pasar".</p></form>
${c.id ? `<form method="post" action="/admin/analisa/${c.id}/hapus" onsubmit="return confirm('Hapus studi kasus ini?')" style="margin-top:10px">${csrfField(req.csrf)}<button class="btn sm red">Hapus</button></form>` : ''}`,
  });
}
router.get('/admin/analisa', A, (req, res) => {
  const rows = db.all('SELECT * FROM case_studies ORDER BY id DESC');
  adminPage(req, res, {
    title: 'Analisa Doktor', active: 'analisa',
    body: `<div class="spread"><h1>Analisa Doktor</h1><a class="btn sm" href="/admin/analisa/baru">+ Tambah studi kasus</a></div>
<p class="dim">Tampil di menu member "Analisa Doktor". Klaim di video & landing: studi kasus berisi alasan entry, stop loss, dan kapan setup batal, jadi isi semua kolom itu. Usahakan rutin menambah studi kasus baru.</p>
<div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Judul</th><th>Keputusan</th><th>Status</th><th>Dibuat</th></tr></thead><tbody>
${rows.map((c) => `<tr><td><a href="/admin/analisa/${c.id}">${esc(c.title)}</a>${c.is_illustration ? ' <span class="pill gray">ilustrasi</span>' : ''}</td><td>${verdictPill(c.verdict)}</td><td>${c.published ? '<span class="pill ok">Tayang</span>' : '<span class="pill gray">Draft</span>'}</td><td>${fmtDate(c.created_at)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada studi kasus.</td></tr>'}
</tbody></table></div>`,
  });
});
router.get('/admin/analisa/baru', A, (req, res) => caseForm(req, res));
router.get('/admin/analisa/:id', A, (req, res, next) => {
  const c = db.get('SELECT * FROM case_studies WHERE id = ?', [req.params.id]);
  if (!c) return next();
  caseForm(req, res, c);
});
router.post('/admin/analisa/:id', A, (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').slice(0, 160) || 'Studi kasus';
  const img = String(b.image_url || '').trim();
  const vals = [title, String(b.instrument || 'XAUUSD').slice(0, 30), String(b.timeframe || 'H1').slice(0, 20), b.verdict === 'skip' ? 'skip' : 'entry',
    ...CS_FIELDS.map(([k]) => String(b[k] || '').slice(0, 6000)), (img.startsWith('/') || safeUrl(img)) ? img.slice(0, 400) : '', b.is_illustration ? 1 : 0, b.published === '0' ? 0 : 1];
  if (req.params.id === 'baru') {
    let slug = slugify(title);
    while (db.get('SELECT id FROM case_studies WHERE slug = ?', [slug])) slug += '-' + Math.floor(Math.random() * 900 + 100);
    const id = db.run(`INSERT INTO case_studies(title, instrument, timeframe, verdict, ${CS_FIELDS.map(([k]) => k).join(', ')}, image_url, is_illustration, published, slug)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [...vals, slug]).lastInsertRowid;
    return res.redirect('/admin/analisa/' + id);
  }
  db.run(`UPDATE case_studies SET title=?, instrument=?, timeframe=?, verdict=?, ${CS_FIELDS.map(([k]) => k + '=?').join(', ')}, image_url=?, is_illustration=?, published=? WHERE id = ?`, [...vals, req.params.id]);
  res.redirect('/admin/analisa/' + req.params.id);
});
router.post('/admin/analisa/:id/hapus', A, (req, res) => {
  db.run('DELETE FROM case_studies WHERE id = ?', [req.params.id]);
  res.redirect('/admin/analisa');
});

// ================= MARKET WATCH =================
// Widget TradingView: lihat src/market.js (dipakai juga di homepage).
const market = require('../market');
router.get('/member/market', M, (req, res) => {
  memberPage(req, res, {
    title: 'Market Watch', active: 'market',
    body: `<h1>Market Watch</h1><p class="muted">Pantau emas, pair forex utama, dan indeks saham dalam satu layar. Ganti simbol di chart untuk instrumen favoritmu. Data dari TradingView dan bisa tertunda; bukan sinyal transaksi.</p>
${market.widgets()}
<p class="dim" style="margin-top:10px">Widget pasar oleh <a href="https://id.tradingview.com/" target="_blank" rel="noopener nofollow">TradingView</a>.</p>`,
  });
});

// ================= WEBINAR BULANAN =================
router.get('/member/webinar', M, (req, res) => {
  const now = nowWib();
  const up = db.all("SELECT w.*, (SELECT 1 FROM webinar_regs r WHERE r.webinar_id = w.id AND r.user_id = ?) AS reg FROM webinars w WHERE published = 1 AND starts_at >= ? ORDER BY starts_at", [req.user.id, now.slice(0, 10)]);
  const past = db.all("SELECT * FROM webinars WHERE published = 1 AND starts_at < ? ORDER BY starts_at DESC LIMIT 12", [now.slice(0, 10)]);
  memberPage(req, res, {
    title: 'Webinar bulanan', active: 'webinar',
    body: `<h1>Webinar bulanan</h1><p class="muted">Webinar edukasi bersama Dr. Dhiraj Kelly diadakan <b>sebulan sekali</b>, gratis untuk member. Daftar di sini, link masuk muncul setelah kamu terdaftar. Rekaman diunggah di bagian bawah bila tersedia.</p>
${flash(req.query.ok ? 'Kamu sudah terdaftar. Link masuk tampil di kartu webinar.' : '', 'ok')}
<h2 style="margin-top:22px">Jadwal berikutnya</h2>
${up.length ? up.map((w) => `<div class="card" style="margin-bottom:12px"><div class="spread"><strong style="font-size:18px">${esc(w.title)}</strong>${w.reg ? '<span class="pill ok">Terdaftar</span>' : ''}</div>
<div class="dim" style="margin:6px 0">${fmtWib(w.starts_at)}</div><div class="prose" style="font-size:15px">${md(w.description || '')}</div>
${w.reg ? (w.join_url ? `<a class="btn sm" href="${esc(w.join_url)}" target="_blank" rel="noopener">Masuk webinar ↗</a>` : '<span class="dim">Link masuk dikirim menjelang acara dan muncul di sini.</span>')
    : `<form method="post" action="/member/webinar/${w.id}/daftar">${csrfField(req.csrf)}<button class="btn sm">Daftar gratis</button></form>`}</div>`).join('')
    : '<div class="alert">Jadwal webinar bulan ini sedang disiapkan dan akan diumumkan di sini serta di Instagram @dhirajkelly.</div>'}
${past.length ? `<h2 style="margin-top:28px">Webinar sebelumnya</h2>${past.map((w) => `<div class="card spread" style="margin-bottom:10px"><div><strong>${esc(w.title)}</strong><div class="dim">${fmtWib(w.starts_at)}</div></div>${w.replay_url ? `<a class="btn ghost sm" href="${esc(w.replay_url)}" target="_blank" rel="noopener">Tonton rekaman ↗</a>` : '<span class="dim">Rekaman tidak tersedia</span>'}</div>`).join('')}` : ''}`,
  });
});
router.post('/member/webinar/:id/daftar', M, (req, res, next) => {
  const w = db.get('SELECT id, title FROM webinars WHERE id = ? AND published = 1', [req.params.id]);
  if (!w) return next();
  if (!db.get('SELECT 1 AS x FROM webinar_regs WHERE webinar_id = ? AND user_id = ?', [w.id, req.user.id])) {
    db.run('INSERT INTO webinar_regs(webinar_id, user_id) VALUES(?, ?)', [w.id, req.user.id]);
    db.log(req.user.id, 'webinar_reg', w.title);
  }
  res.redirect('/member/webinar?ok=1');
});

function webinarForm(req, res, w = { published: 1 }) {
  const regs = w.id ? db.all('SELECT u.id, u.name, u.email, u.whatsapp, r.created_at FROM webinar_regs r JOIN users u ON u.id = r.user_id WHERE r.webinar_id = ? ORDER BY r.created_at', [w.id]) : [];
  const wa = (n) => { let d = String(n || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '62' + d.slice(1); return d ? `https://wa.me/${d}?text=${encodeURIComponent(`Halo, pengingat webinar Doktor Trader "${w.title}" ${fmtWib(w.starts_at)}.${w.join_url ? ' Link: ' + w.join_url : ''}`)}` : '#'; };
  adminPage(req, res, {
    title: 'Webinar', active: 'webinar',
    body: `<a href="/admin/webinar" class="dim">← Semua webinar</a><h1>${w.id ? 'Edit' : 'Jadwalkan'} webinar</h1>
<form class="f card" method="post" action="/admin/webinar/${w.id || 'baru'}">${csrfField(req.csrf)}
<label>Judul</label><input name="title" required value="${esc(w.title || '')}">
<div class="grid g2"><div><label>Tanggal & jam (WIB)</label><input name="starts_at" type="datetime-local" required value="${esc(String(w.starts_at || '').replace(' ', 'T'))}"></div>
<div><label>Status</label><select name="published"><option value="1"${w.published !== 0 ? ' selected' : ''}>Tayang</option><option value="0"${w.published === 0 ? ' selected' : ''}>Draft</option></select></div></div>
<label>Deskripsi / materi (Markdown)</label><textarea name="description">${esc(w.description || '')}</textarea>
<div class="grid g2"><div><label>Link masuk (Zoom/YouTube Live, hanya untuk yang daftar)</label><input name="join_url" value="${esc(w.join_url || '')}"></div><div><label>Link rekaman (setelah acara)</label><input name="replay_url" value="${esc(w.replay_url || '')}"></div></div>
<button class="btn">Simpan</button></form>
${w.id ? `<h2 style="margin-top:24px">Pendaftar (${regs.length})</h2><div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Daftar</th></tr></thead><tbody>
${regs.map((r) => `<tr><td><a href="/admin/member/${r.id}">${esc(r.name)}</a></td><td>${esc(r.email)}</td><td><a href="${wa(r.whatsapp)}" target="_blank" rel="noopener">${esc(r.whatsapp)}</a></td><td>${fmtDate(r.created_at)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada pendaftar.</td></tr>'}</tbody></table></div>
<form method="post" action="/admin/webinar/${w.id}/hapus" onsubmit="return confirm('Hapus webinar ini beserta daftar pendaftarnya?')" style="margin-top:12px">${csrfField(req.csrf)}<button class="btn sm red">Hapus webinar</button></form>` : ''}`,
  });
}
router.get('/admin/webinar', A, (req, res) => {
  const rows = db.all('SELECT w.*, (SELECT COUNT(*) FROM webinar_regs r WHERE r.webinar_id = w.id) AS n FROM webinars w ORDER BY starts_at DESC');
  const today = nowWib().slice(0, 10);
  const nextOne = rows.filter((w) => w.published && w.starts_at >= today).pop();
  adminPage(req, res, {
    title: 'Webinar', active: 'webinar',
    body: `<div class="spread"><h1>Webinar bulanan</h1><a class="btn sm" href="/admin/webinar/baru">+ Jadwalkan webinar</a></div>
${nextOne ? '' : '<div class="alert bad">Belum ada webinar terjadwal. Video & landing menjanjikan webinar rutin (sebulan sekali): jadwalkan webinar bulan ini.</div>'}
<div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Judul</th><th>Waktu</th><th>Pendaftar</th><th>Rekaman</th></tr></thead><tbody>
${rows.map((w) => `<tr><td><a href="/admin/webinar/${w.id}">${esc(w.title)}</a>${w.published ? '' : ' <span class="pill gray">Draft</span>'}</td><td>${fmtWib(w.starts_at)}</td><td>${w.n}</td><td>${w.replay_url ? '✓' : '-'}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada webinar.</td></tr>'}
</tbody></table></div>`,
  });
});
router.get('/admin/webinar/baru', A, (req, res) => webinarForm(req, res));
router.get('/admin/webinar/:id', A, (req, res, next) => {
  const w = db.get('SELECT * FROM webinars WHERE id = ?', [req.params.id]);
  if (!w) return next();
  webinarForm(req, res, w);
});
router.post('/admin/webinar/:id', A, (req, res) => {
  const b = req.body || {};
  const at = String(b.starts_at || '').replace('T', ' ').slice(0, 16);
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(at)) return res.redirect(req.params.id === 'baru' ? '/admin/webinar/baru' : '/admin/webinar/' + req.params.id);
  const vals = [String(b.title || '').slice(0, 160) || 'Webinar Doktor Trader', at, String(b.description || '').slice(0, 4000), safeUrl(b.join_url), safeUrl(b.replay_url), b.published === '0' ? 0 : 1];
  if (req.params.id === 'baru') return res.redirect('/admin/webinar/' + db.run('INSERT INTO webinars(title, starts_at, description, join_url, replay_url, published) VALUES(?,?,?,?,?,?)', vals).lastInsertRowid);
  db.run('UPDATE webinars SET title=?, starts_at=?, description=?, join_url=?, replay_url=?, published=? WHERE id = ?', [...vals, req.params.id]);
  res.redirect('/admin/webinar/' + req.params.id);
});
router.post('/admin/webinar/:id/hapus', A, (req, res) => {
  db.run('DELETE FROM webinar_regs WHERE webinar_id = ?', [req.params.id]);
  db.run('DELETE FROM webinars WHERE id = ?', [req.params.id]);
  res.redirect('/admin/webinar');
});

module.exports = router;
