const path = require('path');
const express = require('express');
const db = require('../db');
const auth = require('../auth');
const { layout, esc, md, flash, csrfField, sideNav, fmtDate, SITE } = require('../views');

const router = express.Router();

const NAV = [
  ['/member', 'Dashboard', 'home'],
  ['/member/academy', 'Academy', 'academy'],
  ['/member/tanya', 'Tanya Doktor', 'tanya'],
  ['/member/tools', 'EA · Signals · Copy Trade', 'tools'],
  ['/member/akun', 'Akun', 'akun'],
];

function page(req, res, { title, active, body }) {
  res.send(layout({
    title, noindex: true, user: req.user, active: 'member',
    body: `<section class="wrap" style="padding:32px 20px"><div class="side">${sideNav(NAV, active)}<div>${body}</div></div></section>`,
  }));
}

function embed(url) {
  if (!url) return '';
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return `<div style="position:relative;padding-top:56.25%;border-radius:14px;overflow:hidden;margin:0 0 20px;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Video materi" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>`;
  if (/^https?:\/\//.test(url)) return `<p><a class="btn ghost sm" href="${esc(url)}" target="_blank" rel="noopener">Buka video materi ↗</a></p>`;
  return '';
}

function courseProgress(userId) {
  return db.all(`SELECT c.*, (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.published = 1) AS total,
    (SELECT COUNT(*) FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = ? AND l.course_id = c.id AND l.published = 1) AS done
    FROM courses c WHERE c.published = 1 ORDER BY c.position, c.id`, [userId]);
}

router.get('/member/menunggu', auth.requireLogin, (req, res) => {
  const u = req.user;
  if (u.role === 'admin' || u.status === 'approved') return res.redirect('/member');
  const msg = u.status === 'rejected'
    ? `Maaf, akun ${SITE.brokerName}-mu belum bisa kami verifikasi. Pastikan akun dibuka lewat link resmi Doktor Trader, lalu hubungi tim kami.`
    : u.status === 'suspended' ? 'Akses akunmu sedang dinonaktifkan. Hubungi tim kami untuk info lebih lanjut.'
      : `Pendaftaran diterima. Tim kami sedang mengecek akun ${SITE.brokerName}-mu (${esc(u.vantage_email || u.email)}). Akun yang sudah terverifikasi di ${SITE.brokerName} biasanya disetujui otomatis dalam ±1 jam. Kalau akun ${SITE.brokerName}-mu belum selesai verifikasi (KYC), selesaikan dulu di aplikasi ${SITE.brokerName}. Halaman member terbuka otomatis setelah disetujui.`;
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Halo Tim Doktor Trader, saya sudah daftar member.\n\nNama: ${u.name}\nEmail: ${u.email}\nEmail ${SITE.brokerName}: ${u.vantage_email || u.email}\nNo. akun: ${u.vantage_account || '-'}`)}`;
  res.send(layout({
    title: 'Menunggu verifikasi', noindex: true, user: u,
    body: `<section class="narrow" style="padding:56px 20px">
<span class="pill ${u.status === 'pending' ? '' : 'bad'}">${u.status === 'pending' ? 'Menunggu verifikasi' : u.status === 'rejected' ? 'Belum terverifikasi' : 'Dinonaktifkan'}</span>
<h1 style="margin-top:12px">Halo, ${esc(u.name.split(' ')[0])}</h1><p class="muted" style="font-size:17px">${msg}</p>
<div class="row" style="margin-top:20px"><a class="btn" href="${wa}" target="_blank" rel="noopener">Percepat via WhatsApp</a>
<a class="btn ghost" href="${esc(SITE.brokerUrl)}" target="_blank" rel="noopener">Buka akun ${SITE.brokerName}</a><a class="btn ghost" href="/artikel">Baca artikel gratis</a></div>
</section>`,
  }));
});

router.use('/member', auth.requireApproved);

router.get('/member', (req, res) => {
  const courses = courseProgress(req.user.id);
  const total = courses.reduce((a, c) => a + c.total, 0);
  const done = courses.reduce((a, c) => a + c.done, 0);
  const qs = db.all('SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC LIMIT 3', [req.user.id]);
  const next = db.get(`SELECT l.*, c.slug AS cslug, c.title AS ctitle FROM lessons l JOIN courses c ON c.id = l.course_id
    WHERE l.published = 1 AND c.published = 1 AND l.id NOT IN (SELECT lesson_id FROM progress WHERE user_id = ?)
    ORDER BY c.position, c.id, l.position, l.id LIMIT 1`, [req.user.id]);
  page(req, res, {
    title: 'Dashboard member', active: 'home',
    body: `<h1>Selamat datang, ${esc(req.user.name.split(' ')[0])}</h1>
<div class="grid g3" style="margin:20px 0">
<div class="card"><div class="dim">Progress Academy</div><div class="stat">${done}/${total}</div><div class="bar"><i style="width:${total ? Math.round((done / total) * 100) : 0}%"></i></div></div>
<div class="card"><div class="dim">Pertanyaan ke Doktor</div><div class="stat">${qs.length ? db.get('SELECT COUNT(*) n FROM questions WHERE user_id=?', [req.user.id]).n : 0}</div><a href="/member/tanya">Tanya sekarang →</a></div>
<div class="card"><div class="dim">Status</div><div class="stat" style="font-size:20px;margin:6px 0"><span class="pill ok">Member terverifikasi</span></div><a href="/member/tools">Buka EA, Signals &amp; Copy Trade →</a></div>
</div>
${next ? `<div class="card spread"><div><div class="dim">Lanjutkan belajar</div><strong>${esc(next.ctitle)} · ${esc(next.title)}</strong></div><a class="btn" href="/member/academy/${esc(next.cslug)}/${esc(next.slug)}">Mulai materi</a></div>` : (total ? '<div class="alert ok">Semua materi Academy sudah selesai. Mantap!</div>' : '')}
${qs.length ? `<h2 style="margin-top:28px">Pertanyaan terakhirmu</h2>${qs.map((q) => `<div class="card" style="margin-bottom:10px"><div class="spread"><strong>${esc(q.topic || 'Pertanyaan')}</strong>${q.answer ? '<span class="pill ok">Dijawab</span>' : '<span class="pill gray">Menunggu jawaban</span>'}</div><p class="muted" style="margin:6px 0 0">${esc(q.body.slice(0, 180))}</p></div>`).join('')}` : ''}`,
  });
});

router.get('/member/academy', (req, res) => {
  const courses = courseProgress(req.user.id);
  page(req, res, {
    title: 'Academy', active: 'academy',
    body: `<h1>Academy</h1><p class="muted">Kurikulum bertahap dari dasar sampai evaluasi. Tandai materi yang sudah selesai untuk melacak progresmu.</p>
${courses.length ? `<div class="grid g2" style="margin-top:18px">${courses.map((c) => `<a class="card" href="/member/academy/${esc(c.slug)}" style="text-decoration:none;color:inherit">
<span class="pill">${esc(c.level)}</span><h3 style="margin:10px 0 6px">${esc(c.title)}</h3><p class="muted" style="margin:0 0 12px">${esc(c.summary || '')}</p>
<div class="spread dim"><span>${c.done}/${c.total} materi</span><span>${c.total ? Math.round((c.done / c.total) * 100) : 0}%</span></div><div class="bar"><i style="width:${c.total ? Math.round((c.done / c.total) * 100) : 0}%"></i></div></a>`).join('')}</div>` : '<div class="alert">Materi Academy sedang disiapkan.</div>'}`,
  });
});

router.get('/member/academy/:course', (req, res, next) => {
  const c = db.get('SELECT * FROM courses WHERE slug = ? AND published = 1', [req.params.course]);
  if (!c) return next();
  const lessons = db.all(`SELECT l.*, (SELECT 1 FROM progress p WHERE p.user_id = ? AND p.lesson_id = l.id) AS done
    FROM lessons l WHERE l.course_id = ? AND l.published = 1 ORDER BY l.position, l.id`, [req.user.id, c.id]);
  page(req, res, {
    title: c.title, active: 'academy',
    body: `<a href="/member/academy" class="dim">← Semua kelas</a><h1 style="margin-top:8px">${esc(c.title)}</h1><p class="muted">${esc(c.summary || '')}</p>
<div class="card" style="padding:6px 18px">${lessons.map((l, i) => `<a href="/member/academy/${esc(c.slug)}/${esc(l.slug)}" class="spread" style="padding:14px 0;border-bottom:1px solid var(--line);text-decoration:none;color:inherit">
<span><span class="dim">${String(i + 1).padStart(2, '0')}</span>&nbsp; ${esc(l.title)}</span><span class="row">${l.duration_min ? `<span class="dim">${l.duration_min} mnt</span>` : ''}${l.done ? '<span class="pill ok">Selesai</span>' : ''}</span></a>`).join('') || '<p class="muted">Belum ada materi.</p>'}</div>`,
  });
});

router.get('/member/academy/:course/:lesson', (req, res, next) => {
  const c = db.get('SELECT * FROM courses WHERE slug = ? AND published = 1', [req.params.course]);
  if (!c) return next();
  const lessons = db.all('SELECT id, slug, title FROM lessons WHERE course_id = ? AND published = 1 ORDER BY position, id', [c.id]);
  const idx = lessons.findIndex((l) => l.slug === req.params.lesson);
  if (idx < 0) return next();
  const l = db.get('SELECT * FROM lessons WHERE id = ?', [lessons[idx].id]);
  const done = db.get('SELECT 1 AS d FROM progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, l.id]);
  const prev = lessons[idx - 1];
  const nxt = lessons[idx + 1];
  page(req, res, {
    title: l.title, active: 'academy',
    body: `<a href="/member/academy/${esc(c.slug)}" class="dim">← ${esc(c.title)}</a>
<h1 style="margin-top:8px">${esc(l.title)}</h1>${embed(l.video_url)}
<div class="prose">${md(l.body_md)}</div>
<div class="spread" style="margin-top:28px">
<form method="post" action="/member/academy/${esc(c.slug)}/${esc(l.slug)}/selesai">${csrfField(req.csrf)}<button class="btn ${done ? 'ghost' : ''}" type="submit">${done ? '✓ Sudah selesai (batalkan)' : 'Tandai selesai'}</button></form>
<div class="row">${prev ? `<a class="btn ghost sm" href="/member/academy/${esc(c.slug)}/${esc(prev.slug)}">← Sebelumnya</a>` : ''}${nxt ? `<a class="btn sm" href="/member/academy/${esc(c.slug)}/${esc(nxt.slug)}">Berikutnya →</a>` : ''}</div></div>`,
  });
});

router.post('/member/academy/:course/:lesson/selesai', (req, res, next) => {
  const l = db.get(`SELECT l.id FROM lessons l JOIN courses c ON c.id = l.course_id WHERE c.slug = ? AND l.slug = ?`, [req.params.course, req.params.lesson]);
  if (!l) return next();
  const done = db.get('SELECT 1 AS d FROM progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, l.id]);
  if (done) db.run('DELETE FROM progress WHERE user_id = ? AND lesson_id = ?', [req.user.id, l.id]);
  else db.run('INSERT INTO progress(user_id, lesson_id) VALUES(?, ?)', [req.user.id, l.id]);
  res.redirect(`/member/academy/${req.params.course}/${req.params.lesson}`);
});

router.get('/member/tanya', (req, res) => {
  const mine = db.all('SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
  const pub = db.all('SELECT * FROM questions WHERE is_public = 1 AND answer IS NOT NULL AND user_id != ? ORDER BY answered_at DESC LIMIT 15', [req.user.id]);
  const qcard = (q, mineFlag) => `<div class="card" style="margin-bottom:12px"><div class="spread"><strong>${esc(q.topic || 'Pertanyaan')}</strong><span class="dim">${fmtDate(q.created_at)}</span></div>
<p style="white-space:pre-wrap;margin:8px 0">${esc(q.body)}</p>
${q.answer ? `<div style="border-left:3px solid var(--gold);padding:4px 14px;margin-top:10px"><div class="dim">Jawaban Doktor · ${fmtDate(q.answered_at)}</div><div class="prose" style="font-size:15px">${md(q.answer)}</div></div>` : (mineFlag ? '<span class="pill gray">Menunggu jawaban</span>' : '')}</div>`;
  page(req, res, {
    title: 'Tanya Doktor', active: 'tanya',
    body: `<h1>Tanya Doktor</h1><p class="muted">Tanyakan apa saja seputar belajar trading, manajemen risiko, atau evaluasi jurnalmu. Jawaban bersifat edukasi, bukan rekomendasi transaksi.</p>
${flash(req.query.ok ? 'Pertanyaan terkirim. Kamu akan melihat jawabannya di halaman ini.' : '', 'ok')}
<form class="f card" method="post" action="/member/tanya" style="margin-bottom:28px">${csrfField(req.csrf)}
<label for="topic">Topik</label><select id="topic" name="topic"><option>Dasar trading</option><option>Manajemen risiko</option><option>Psikologi</option><option>Analisa teknikal</option><option>Akun &amp; platform</option><option>Lainnya</option></select>
<label for="body">Pertanyaan</label><textarea id="body" name="body" required maxlength="3000" placeholder="Ceritakan konteksnya: instrumen, timeframe, kondisi akun, apa yang sudah dicoba..."></textarea>
<button class="btn" type="submit">Kirim pertanyaan</button></form>
${mine.length ? `<h2>Pertanyaanmu</h2>${mine.map((q) => qcard(q, true)).join('')}` : ''}
${pub.length ? `<h2 style="margin-top:28px">Tanya jawab member lain</h2>${pub.map((q) => qcard(q, false)).join('')}` : ''}`,
  });
});

router.post('/member/tanya', (req, res) => {
  const body = String((req.body || {}).body || '').trim().slice(0, 3000);
  const topic = String((req.body || {}).topic || '').slice(0, 60);
  if (body.length < 5) return res.redirect('/member/tanya');
  if (!auth.rateLimit('q:' + req.user.id, 10, 86400e3)) return res.status(429).send('Batas 10 pertanyaan per hari.');
  db.run('INSERT INTO questions(user_id, topic, body) VALUES(?, ?, ?)', [req.user.id, topic, body]);
  db.log(req.user.id, 'question', topic);
  res.redirect('/member/tanya?ok=1');
});


const DOWNLOADS = path.join(__dirname, '..', '..', 'downloads');
const FILES = ['DT_RiskGuard.mq5', 'DT_RiskGuard.mq4', 'DT_SmartSignal.mq5', 'DT_SmartSignal.mq4', 'PIPTRACKER_GoMart_V1R_SAFE_10k_XAUUSD.set'];
router.get('/member/unduh/:file', (req, res, next) => {
  const f = req.params.file;
  if (!FILES.includes(f)) return next();
  db.log(req.user.id, 'download', f);
  res.download(path.join(DOWNLOADS, f), f);
});

const LOT_CALC = `<h2 style="margin-top:28px">Kalkulator lot</h2>
<div class="card"><p class="muted" style="margin-top:0">Hitung ukuran lot dari modal, persentase risiko, dan jarak stop loss. Untuk XAUUSD akun standar, 1 lot = 100 oz (gerak $1 = $100 per lot).</p>
<div class="grid g3 f" id="lotcalc">
<div><label for="lc-bal">Modal ($)</label><input id="lc-bal" type="number" min="0" step="any" value="1000"></div>
<div><label for="lc-risk">Risiko per posisi (%)</label><input id="lc-risk" type="number" min="0" step="0.1" value="1"></div>
<div><label for="lc-sl">Jarak SL (dalam $ harga)</label><input id="lc-sl" type="number" min="0" step="any" value="5"></div>
<div><label for="lc-cs">Ukuran kontrak (oz per lot)</label><input id="lc-cs" type="number" min="0" step="any" value="100"></div>
<div><label for="lc-rr">Target risk-reward (1 : x)</label><input id="lc-rr" type="number" min="0" step="0.1" value="2"></div>
<div><label for="lc-min">Lot minimum</label><input id="lc-min" type="number" min="0" step="0.01" value="0.01"></div>
</div>
<div class="card" style="margin-top:14px;background:rgba(233,196,106,.06)" id="lc-out" aria-live="polite"></div></div>
<script>(function(){var $=function(i){return parseFloat(document.getElementById(i).value)||0};
function calc(){var bal=$('lc-bal'),risk=$('lc-risk'),sl=$('lc-sl'),cs=$('lc-cs'),rr=$('lc-rr'),mn=$('lc-min')||0.01;
var out=document.getElementById('lc-out');if(!bal||!risk||!sl||!cs){out.innerHTML='Isi semua kolom.';return;}
var riskUsd=bal*risk/100,raw=riskUsd/(sl*cs),lot=Math.floor(raw/mn+1e-9)*mn;
var actual=lot*sl*cs,pct=actual/bal*100;
var h='<div class="stat">'+(lot>0?lot.toFixed(2):'0')+' lot</div><p style="margin:6px 0 0">Risiko maksimal: <b>$'+riskUsd.toFixed(2)+'</b> ('+risk+'%). Dengan '+lot.toFixed(2)+' lot, kena SL = rugi <b>$'+actual.toFixed(2)+'</b> ('+pct.toFixed(2)+'%).';
if(rr>0)h+=' Target TP berjarak <b>$'+(sl*rr).toFixed(2)+'</b> = potensi <b>$'+(actual*rr).toFixed(2)+'</b>.';
h+='</p>';if(lot<=0)h='<div class="stat" style="color:var(--red)">Terlalu besar</div><p style="margin:6px 0 0">Lot minimum '+mn+' sudah merisikokan $'+(mn*sl*cs).toFixed(2)+' ('+(mn*sl*cs/bal*100).toFixed(2)+'%). Pilih SL lebih dekat, atau tambah modal.</p>';
out.innerHTML=h;}
document.getElementById('lotcalc').addEventListener('input',calc);calc();})();</script>`;

const KINDS = { ea: 'EA Trading', signal: 'AI Signals Premium', copytrade: 'Copy Trade' };
router.get('/member/tools', (req, res) => {
  const tools = db.all('SELECT * FROM tools WHERE published = 1 ORDER BY kind, position, id');
  page(req, res, {
    title: 'EA, AI Signals & Copy Trade', active: 'tools',
    body: `<h1>EA · AI Signals · Copy Trade</h1>
<div class="alert">Semua tools di bawah adalah alat bantu. Selalu uji di akun demo dulu, gunakan ukuran posisi kecil, dan pahami bahwa kinerja masa lalu tidak menjamin hasil di masa depan.</div>
${Object.entries(KINDS).map(([k, label]) => {
    const list = tools.filter((t) => t.kind === k);
    return `<h2 style="margin-top:24px">${label}</h2>${list.length ? `<div class="grid g2">${list.map((t) => `<div class="card"><h3>${esc(t.title)}</h3><div class="prose" style="font-size:15px">${md(t.description)}</div>
${t.risk_note ? `<p class="dim">Karakter risiko: ${esc(t.risk_note)}</p>` : ''}${t.link_url ? `<a class="btn sm" href="${esc(t.link_url)}"${t.link_url.startsWith('/') ? '' : ' target="_blank" rel="noopener"'}>${esc(t.link_label || 'Buka')}</a>` : ''}</div>`).join('')}</div>` : '<p class="muted">Segera hadir.</p>'}`;
  }).join('')}${LOT_CALC}`,
  });
});

router.get('/member/akun', (req, res) => {
  const u = req.user;
  page(req, res, {
    title: 'Akun', active: 'akun',
    body: `<h1>Akun</h1>${flash(req.query.ok ? 'Password berhasil diganti.' : req.query.e ? 'Password lama salah atau password baru kurang dari 8 karakter.' : '', req.query.ok ? 'ok' : 'bad')}
<div class="card" style="margin-bottom:18px"><table><tr><th>Nama</th><td>${esc(u.name)}</td></tr><tr><th>Email</th><td>${esc(u.email)}</td></tr><tr><th>WhatsApp</th><td>${esc(u.whatsapp)}</td></tr><tr><th>Akun ${SITE.brokerName}</th><td>${esc(u.vantage_email || '')} ${u.vantage_account ? '· ' + esc(u.vantage_account) : ''}</td></tr></table></div>
<form class="f card" method="post" action="/member/akun/password">${csrfField(req.csrf)}<h3>Ganti password</h3>
<label for="old">Password lama</label><input id="old" type="password" name="old" required autocomplete="current-password">
<label for="new">Password baru</label><input id="new" type="password" name="new" required minlength="8" autocomplete="new-password">
<button class="btn" type="submit">Simpan</button></form>`,
  });
});

router.post('/member/akun/password', (req, res) => {
  const b = req.body || {};
  if (!auth.checkPassword(String(b.old || ''), req.user.password_hash) || String(b.new || '').length < 8) return res.redirect('/member/akun?e=1');
  db.run('UPDATE users SET password_hash = ? WHERE id = ?', [auth.hashPassword(String(b.new)), req.user.id]);
  res.redirect('/member/akun?ok=1');
});

module.exports = router;
