const express = require('express');
const db = require('../db');
const auth = require('../auth');
const { layout, esc, flash, csrfField, SITE } = require('../views');

const router = express.Router();

function registerPage(res, req, { error = '', values = {} } = {}) {
  const v = (k) => esc(values[k] || '');
  const levels = ['Baru mulai / belum pernah', 'Kurang dari 1 tahun', 'Lebih dari 1 tahun'];
  res.send(layout({
    title: 'Daftar Member', noindex: true, user: req.user, active: 'masuk',
    body: `<section class="narrow" style="padding:48px 20px">
<h1>Daftar member Doktor Trader</h1>
<p class="muted">Akses semua fitur gratis untuk pemilik akun ${SITE.brokerName} yang dibuka lewat link resmi Doktor Trader. Setelah daftar, tim kami mengecek akun ${SITE.brokerName}-mu lalu mengaktifkan login member.</p>
<p class="dim">Belum punya akun ${SITE.brokerName}? <a href="${esc(SITE.brokerUrl)}" target="_blank" rel="noopener">Buka akun dulu di sini</a>.</p>
${flash(error, 'bad')}
<form class="f card" method="post" action="/daftar">${csrfField(req.csrf)}
<label for="name">Nama lengkap</label><input id="name" name="name" required maxlength="80" value="${v('name')}">
<label for="whatsapp">Nomor WhatsApp</label><input id="whatsapp" name="whatsapp" required type="tel" placeholder="08xx" maxlength="20" value="${v('whatsapp')}">
<label for="email">Email (untuk login)</label><input id="email" name="email" required type="email" maxlength="120" value="${v('email')}">
<label for="vantage_email">Email terdaftar di ${SITE.brokerName} <span class="dim">(kosongkan jika sama)</span></label><input id="vantage_email" name="vantage_email" type="email" maxlength="120" value="${v('vantage_email')}">
<label for="vantage_account">Nomor akun ${SITE.brokerName} <span class="dim">(opsional, mempercepat verifikasi)</span></label><input id="vantage_account" name="vantage_account" maxlength="40" value="${v('vantage_account')}">
<label for="experience">Pengalaman trading</label><select id="experience" name="experience">${levels.map((l) => `<option${values.experience === l ? ' selected' : ''}>${l}</option>`).join('')}</select>
<label for="password">Password <span class="dim">(min. 8 karakter)</span></label><input id="password" name="password" type="password" required minlength="8" autocomplete="new-password">
<label class="row" style="font-weight:500"><input type="checkbox" name="agree" value="1" required style="width:auto;min-height:auto"> Saya memahami trading berisiko tinggi dan konten Doktor Trader bersifat edukasi.</label>
<button class="btn" type="submit">Daftar &amp; minta verifikasi</button>
<span class="dim">Sudah punya akun? <a href="/masuk">Masuk</a></span>
</form></section>`,
  }));
}

router.get('/daftar', (req, res) => {
  if (req.user) return res.redirect('/member');
  const q = req.query;
  registerPage(res, req, { values: { name: q.nama, whatsapp: q.wa, email: q.email, vantage_email: q.email, experience: q.level } });
});

router.post('/daftar', (req, res) => {
  const b = req.body || {};
  const values = b;
  const ip = req.ip;
  if (!auth.rateLimit('reg:' + ip, 8, 3600e3)) return registerPage(res, req, { error: 'Terlalu banyak percobaan. Coba lagi nanti.', values });
  const name = String(b.name || '').trim().slice(0, 80);
  const email = String(b.email || '').trim().toLowerCase().slice(0, 120);
  const whatsapp = String(b.whatsapp || '').replace(/[^\d+]/g, '').slice(0, 20);
  const vEmail = String(b.vantage_email || '').trim().toLowerCase().slice(0, 120) || email;
  const vAcc = String(b.vantage_account || '').trim().slice(0, 40);
  const exp = String(b.experience || '').slice(0, 60);
  const pw = String(b.password || '');
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || whatsapp.length < 8) return registerPage(res, req, { error: 'Lengkapi nama, email, dan nomor WhatsApp yang valid.', values });
  if (pw.length < 8) return registerPage(res, req, { error: 'Password minimal 8 karakter.', values });
  if (!b.agree) return registerPage(res, req, { error: 'Centang pernyataan risiko untuk melanjutkan.', values });
  if (db.get('SELECT id FROM users WHERE email = ?', [email])) return registerPage(res, req, { error: 'Email ini sudah terdaftar. Silakan masuk.', values });
  const r = db.run(
    'INSERT INTO users(name, email, whatsapp, vantage_email, vantage_account, experience, password_hash, source) VALUES(?,?,?,?,?,?,?,?)',
    [name, email, whatsapp, vEmail, vAcc, exp, auth.hashPassword(pw), String(b.source || 'website').slice(0, 40)],
  );
  db.log(r.lastInsertRowid, 'register', email);
  auth.createSession(res, r.lastInsertRowid);
  res.redirect('/member/menunggu');
});

router.get('/masuk', (req, res) => {
  if (req.user) return res.redirect(req.user.role === 'admin' ? '/admin' : '/member');
  res.send(layout({
    title: 'Masuk', noindex: true, active: 'masuk',
    body: `<section class="narrow" style="padding:56px 20px;max-width:460px">
<h1>Masuk</h1>${flash(req.query.e ? 'Email atau password salah.' : '', 'bad')}
<form class="f card" method="post" action="/masuk">${csrfField(req.csrf)}
<input type="hidden" name="next" value="${esc(req.query.next || '')}">
<label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="username">
<label for="password">Password</label><input id="password" name="password" type="password" required autocomplete="current-password">
<button class="btn" type="submit">Masuk</button>
<span class="dim">Belum punya akun? <a href="/daftar">Daftar gratis</a>. Lupa password? <a href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Halo Tim Doktor Trader, saya lupa password akun member.')}" target="_blank" rel="noopener">Hubungi tim via WhatsApp</a>.</span>
</form></section>`,
  }));
});

router.post('/masuk', (req, res) => {
  const email = String((req.body || {}).email || '').trim().toLowerCase();
  const pw = String((req.body || {}).password || '');
  if (!auth.rateLimit('login:' + req.ip, 15, 900e3)) return res.status(429).send('Terlalu banyak percobaan. Tunggu 15 menit.');
  const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !auth.checkPassword(pw, user.password_hash)) return res.redirect('/masuk?e=1');
  auth.createSession(res, user.id);
  db.run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", [user.id]);
  db.log(user.id, 'login');
  let next = String((req.body || {}).next || '');
  if (!next.startsWith('/') || next.startsWith('//')) next = '';
  res.redirect(next || (user.role === 'admin' ? '/admin' : '/member'));
});

router.post('/keluar', (req, res) => {
  auth.destroySession(req, res);
  res.redirect('/');
});

module.exports = router;
