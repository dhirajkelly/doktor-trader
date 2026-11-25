const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const auth = require('../auth');
const { layout, esc, md, flash, csrfField, sideNav, fmtDate, slugify, plain, firstName, SITE } = require('../views');
const { syncInbox } = require('../content');

const router = express.Router();
router.use('/admin', auth.requireAdmin);

const NAV = [
  ['/admin', 'Ringkasan', 'home'],
  ['/admin/member', 'CRM Member', 'member'],
  ['/admin/lead', 'Pipeline Lead', 'lead'],
  ['/admin/artikel', 'Artikel SEO', 'artikel'],
  ['/admin/academy', 'Academy', 'academy'],
  ['/admin/tanya', 'Tanya Doktor', 'tanya'],
  ['/admin/tools', 'EA · Signals · Copy', 'tools'],
  ['/admin/analisa', 'Analisa Doktor', 'analisa'],
  ['/admin/webinar', 'Webinar', 'webinar'],
];

function page(req, res, { title, active, body }) {
  res.send(layout({
    title: 'Admin · ' + title, noindex: true, user: req.user, active: 'admin',
    body: `<section class="wrap" style="padding:32px 20px;max-width:1240px"><div class="side">${sideNav(NAV, active)}<div style="min-width:0">${body}</div></div></section>`,
  }));
}

const STATUS = { pending: ['Menunggu', ''], approved: ['Disetujui', 'ok'], rejected: ['Ditolak', 'bad'], suspended: ['Nonaktif', 'gray'] };
const statusPill = (s) => `<span class="pill ${(STATUS[s] || ['', 'gray'])[1]}">${(STATUS[s] || [s])[0]}</span>`;
const waLink = (n, text = '') => {
  let d = String(n || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d ? `https://wa.me/${d}${text ? '?text=' + encodeURIComponent(text) : ''}` : '#';
};

// ---------- Ringkasan ----------
router.get('/admin', (req, res) => {
  const c = (sql, p = []) => db.get(sql, p).n;
  const pending = db.all("SELECT * FROM users WHERE role = 'member' AND status = 'pending' ORDER BY id DESC LIMIT 8");
  const openQ = c('SELECT COUNT(*) n FROM questions WHERE answer IS NULL AND ai_answer IS NULL');
  const ev = (name, days = 30) => c(`SELECT COUNT(*) n FROM events WHERE name = ? AND created_at >= datetime('now', ?)`, [name, `-${days} days`]);
  const topPages = db.all("SELECT path, COUNT(*) n FROM events WHERE name='broker_click' AND created_at >= datetime('now','-30 days') GROUP BY path ORDER BY n DESC LIMIT 8");
  const held = db.all("SELECT id, title, review_notes FROM articles WHERE status='draft' AND COALESCE(review_notes,'') != '' ORDER BY id DESC LIMIT 20");
  // Janji di video/landing vs yang benar-benar tersedia di website.
  const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const lessonsN = c('SELECT COUNT(*) n FROM lessons l JOIN courses k ON k.id = l.course_id WHERE l.published = 1 AND k.published = 1');
  const casesN = c('SELECT COUNT(*) n FROM case_studies WHERE published = 1');
  const lastCase = (db.get('SELECT MAX(created_at) m FROM case_studies WHERE published = 1') || {}).m;
  const nextWeb = db.get('SELECT title, starts_at FROM webinars WHERE published = 1 AND starts_at >= ? ORDER BY starts_at LIMIT 1', [today]);
  const lastWeb = (db.get('SELECT MAX(starts_at) m FROM webinars WHERE published = 1 AND starts_at < ?', [today]) || {}).m;
  const copyLive = c("SELECT COUNT(*) n FROM tools WHERE kind = 'copytrade' AND published = 1 AND COALESCE(link_url,'') != ''");
  const aiOn = require('../ai').enabled();
  const P = [
    ['Tanya Doktor = asisten AI, bisa ditanya kapan saja', aiOn, aiOn ? 'AI aktif' : 'ANTHROPIC_API_KEY belum diisi di server', '/admin/tanya'],
    ['Doktor Academy 30 modul', lessonsN >= 30, `${lessonsN} materi tayang`, '/admin/academy'],
    ['Analisa Doktor: studi kasus entry, SL, kapan batal', casesN > 0, `${casesN} studi kasus${lastCase ? ', terbaru ' + fmtDate(lastCase) : ''}`, '/admin/analisa'],
    ['Webinar rutin (sebulan sekali)', Boolean(nextWeb), nextWeb ? 'Berikutnya: ' + esc(nextWeb.title) + ' · ' + esc(nextWeb.starts_at) + ' WIB' : 'Belum ada jadwal mendatang' + (lastWeb ? ' (terakhir ' + esc(lastWeb.slice(0, 10)) + ')' : ''), '/admin/webinar'],
    ['Market Watch', true, 'Widget TradingView aktif', '/member/market'],
    ['Copy Trade', true, copyLive ? 'Link copy strategi aktif' : 'Materi edukasi tersedia; copy strategi ditandai "segera" (sesuai janji)', '/admin/tools'],
  ];
  page(req, res, {
    title: 'Ringkasan', active: 'home',
    body: `<h1>Ringkasan</h1>
<h2 style="font-size:18px;margin-top:14px">Janji di video &amp; landing</h2>
<div class="tablewrap card" style="padding:6px 14px;margin-bottom:8px"><table><tbody>${P.map(([k, ok, d, href]) => `<tr><td>${ok ? '<span class="pill ok">Terpenuhi</span>' : '<span class="pill bad">Belum</span>'}</td><td><strong>${k}</strong><div class="dim">${d}</div></td><td><a href="${href}">Kelola →</a></td></tr>`).join('')}</tbody></table></div>
<div class="grid g3" style="margin:18px 0">
<div class="card"><div class="dim">Member menunggu verifikasi</div><div class="stat">${c("SELECT COUNT(*) n FROM users WHERE role='member' AND status='pending'")}</div><a href="/admin/member?status=pending">Proses →</a></div>
<div class="card"><div class="dim">Member aktif</div><div class="stat">${c("SELECT COUNT(*) n FROM users WHERE role='member' AND status='approved'")}</div><span class="dim">${c("SELECT COUNT(*) n FROM users WHERE role='member' AND created_at >= datetime('now','-7 days')")} daftar 7 hari terakhir</span></div>
<div class="card"><div class="dim">Pertanyaan belum dijawab</div><div class="stat">${openQ}</div><a href="/admin/tanya">Jawab →</a></div>
<div class="card"><div class="dim">Artikel tayang</div><div class="stat">${c("SELECT COUNT(*) n FROM articles WHERE status='published'")}</div><span class="dim">${c("SELECT COUNT(*) n FROM articles WHERE source='auto'")} dari otomatis harian</span></div>
<div class="card"><div class="dim">Materi Academy</div><div class="stat">${c('SELECT COUNT(*) n FROM lessons')}</div><span class="dim">${c('SELECT COUNT(*) n FROM courses')} kelas</span></div>
<div class="card"><div class="dim">Materi diselesaikan member</div><div class="stat">${c('SELECT COUNT(*) n FROM progress')}</div></div>
<div class="card"><div class="dim">Sinkron referral ${SITE.brokerName}</div><div class="stat" style="font-size:20px">${esc(db.setting('dupoin_last_sync') ? fmtDate(db.setting('dupoin_last_sync')) + ' ' + db.setting('dupoin_last_sync').slice(11, 16) + ' UTC' : 'Belum pernah')}</div><span class="dim">${esc(db.setting('dupoin_last_summary', ''))}</span></div>
<div class="card"><div class="dim">Artikel ditahan (cek kepatuhan)</div><div class="stat">${held.length}</div><a href="/admin/artikel">Tinjau →</a></div>
</div>
<h2>Konversi 30 hari terakhir</h2>
<div class="grid g3" style="margin:12px 0 18px">
<div class="card"><div class="dim">Klik buka akun ${SITE.brokerName}</div><div class="stat">${ev('broker_click')}</div><span class="dim">${ev('broker_click', 7)} dalam 7 hari</span></div>
<div class="card"><div class="dim">Klik WhatsApp</div><div class="stat">${ev('wa_click')}</div><span class="dim">${ev('wa_click', 7)} dalam 7 hari</span></div>
<div class="card"><div class="dim">Klik channel Telegram</div><div class="stat">${ev('telegram')}</div><span class="dim">${ev('telegram', 7)} dalam 7 hari</span></div>
<div class="card"><div class="dim">Klik daftar → member baru</div><div class="stat">${ev('daftar_click')} → ${c("SELECT COUNT(*) n FROM users WHERE role='member' AND created_at >= datetime('now','-30 days')")}</div><span class="dim">klik tombol daftar → akun terdaftar</span></div>
</div>
${topPages.length ? `<div class="tablewrap card" style="padding:6px 14px;margin-bottom:24px"><table><thead><tr><th>Halaman asal klik ${SITE.brokerName}</th><th>Klik (30 hari)</th></tr></thead><tbody>${topPages.map((r) => `<tr><td>${esc(r.path)}</td><td>${r.n}</td></tr>`).join('')}</tbody></table></div>` : ''}
${held.length ? `<h2>Artikel ditahan gerbang kepatuhan</h2><div class="tablewrap card" style="padding:6px 14px;margin-bottom:24px"><table><thead><tr><th>Judul</th><th>Alasan</th></tr></thead><tbody>${held.map((a) => `<tr><td><a href="/admin/artikel/${a.id}">${esc(a.title)}</a></td><td class="dim">${esc(a.review_notes)}</td></tr>`).join('')}</tbody></table></div>` : ''}
<h2>Menunggu verifikasi</h2>${pending.length ? memberTable(req, pending) : '<p class="muted">Tidak ada antrean.</p>'}`,
  });
});

function memberTable(req, rows) {
  return `<div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Nama</th><th>Kontak</th><th>Akun ${SITE.brokerName}</th><th>Status</th><th>Daftar</th><th></th></tr></thead><tbody>
${rows.map((u) => `<tr><td><a href="/admin/member/${u.id}"><strong>${esc(u.name)}</strong></a><div class="dim">${esc(u.experience || '')}</div></td>
<td>${esc(u.email)}<div><a href="${waLink(u.whatsapp)}" target="_blank" rel="noopener">${esc(u.whatsapp || '')}</a></div></td>
<td>${esc(u.vantage_email || '')}<div class="dim">${esc(u.vantage_account || '')}</div></td>
<td>${statusPill(u.status)}${u.dupoin_check ? `<div class="dim" style="font-size:12px">${esc(u.dupoin_check)}</div>` : ''}${u.tags ? `<div class="dim">${esc(u.tags)}</div>` : ''}</td><td class="dim">${fmtDate(u.created_at)}</td>
<td>${u.status !== 'approved' ? `<form method="post" action="/admin/member/${u.id}/status">${csrfField(req.csrf)}<input type="hidden" name="status" value="approved"><button class="btn sm green">Approve</button></form>` : ''}</td></tr>`).join('')}
</tbody></table></div>`;
}

// ---------- CRM Member ----------
router.get('/admin/member', (req, res) => {
  const status = String(req.query.status || '');
  const q = String(req.query.q || '').trim();
  const where = ["role = 'member'"];
  const p = [];
  if (STATUS[status]) { where.push('status = ?'); p.push(status); }
  if (q) { where.push('(name LIKE ? OR email LIKE ? OR whatsapp LIKE ? OR vantage_email LIKE ? OR vantage_account LIKE ? OR tags LIKE ?)'); for (let i = 0; i < 6; i++) p.push('%' + q + '%'); }
  const rows = db.all(`SELECT * FROM users WHERE ${where.join(' AND ')} ORDER BY id DESC LIMIT 500`, p);
  const counts = Object.fromEntries(db.all("SELECT status, COUNT(*) n FROM users WHERE role='member' GROUP BY status").map((r) => [r.status, r.n]));
  page(req, res, {
    title: 'CRM Member', active: 'member',
    body: `<div class="spread"><h1>CRM Member</h1><a class="btn ghost sm" href="/admin/member.csv">Export CSV</a></div>
<div class="row" style="margin:10px 0 16px"><a class="pill ${status ? 'gray' : ''}" href="/admin/member">Semua</a>
${Object.entries(STATUS).map(([k, [l]]) => `<a class="pill ${status === k ? '' : 'gray'}" href="/admin/member?status=${k}">${l} (${counts[k] || 0})</a>`).join('')}</div>
<form method="get" class="row" style="margin-bottom:16px"><input type="hidden" name="status" value="${esc(status)}"><input name="q" value="${esc(q)}" placeholder="Cari nama, email, WA, no. akun, tag…" style="max-width:420px"><button class="btn sm">Cari</button></form>
${rows.length ? memberTable(req, rows) : '<p class="muted">Belum ada member.</p>'}`,
  });
});

router.get('/admin/member.csv', (req, res) => {
  const rows = db.all("SELECT id,name,email,whatsapp,vantage_email,vantage_account,experience,status,tags,notes,created_at,approved_at,last_login_at FROM users WHERE role='member' ORDER BY id");
  const cols = Object.keys(rows[0] || { id: 0 });
  const cell = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="member-doktor-trader.csv"');
  res.send('﻿' + [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n'));
});

router.get('/admin/member/:id', (req, res, next) => {
  const u = db.get("SELECT * FROM users WHERE id = ? AND role = 'member'", [req.params.id]);
  if (!u) return next();
  const done = db.get('SELECT COUNT(*) n FROM progress WHERE user_id = ?', [u.id]).n;
  const qs = db.get('SELECT COUNT(*) n FROM questions WHERE user_id = ?', [u.id]).n;
  const acts = db.all('SELECT * FROM activity WHERE user_id = ? ORDER BY id DESC LIMIT 15', [u.id]);
  const temp = req.query.temp ? String(req.query.temp) : '';
  const approveMsg = `Halo ${firstName(u.name)}, akun member Doktor Trader kamu sudah aktif. Silakan masuk di ${SITE.url}/masuk dengan email ${u.email}. Selamat belajar!`;
  page(req, res, {
    title: u.name, active: 'member',
    body: `<a class="dim" href="/admin/member">← CRM Member</a>
<div class="spread" style="margin:8px 0 16px"><h1 style="margin:0">${esc(u.name)}</h1>${statusPill(u.status)}</div>
${temp ? `<div class="alert ok">Password sementara: <strong>${esc(temp)}</strong> — kirim ke member lewat WhatsApp, minta segera diganti di menu Akun.</div>` : ''}
<div class="grid g2">
<div class="card"><table>
<tr><th>Email login</th><td>${esc(u.email)}</td></tr>
<tr><th>WhatsApp</th><td><a href="${waLink(u.whatsapp)}" target="_blank" rel="noopener">${esc(u.whatsapp)}</a></td></tr>
<tr><th>Email ${SITE.brokerName}</th><td>${esc(u.vantage_email)}</td></tr>
<tr><th>No. akun ${SITE.brokerName}</th><td>${esc(u.vantage_account || '-')}</td></tr>
<tr><th>Cek referral ${SITE.brokerName}</th><td>${esc(u.dupoin_check || 'Belum dicek')}${u.dupoin_uid ? ` · UID ${u.dupoin_uid}` : ''}${u.dupoin_checked_at ? `<div class="dim">${fmtDate(u.dupoin_checked_at)}</div>` : ''}</td></tr>
<tr><th>Pengalaman</th><td>${esc(u.experience || '-')}</td></tr>
<tr><th>Sumber</th><td>${esc(u.source || '-')}</td></tr>
<tr><th>Daftar</th><td>${fmtDate(u.created_at)}</td></tr>
<tr><th>Disetujui</th><td>${fmtDate(u.approved_at) || '-'}</td></tr>
<tr><th>Login terakhir</th><td>${fmtDate(u.last_login_at) || '-'}</td></tr>
<tr><th>Aktivitas</th><td>${done} materi selesai · ${qs} pertanyaan</td></tr></table></div>
<div class="card"><h3>Verifikasi</h3><p class="dim">Cek email/no. akun di portal IB ${SITE.brokerName}, lalu ubah status.</p>
<div class="row">${['approved', 'pending', 'rejected', 'suspended'].map((s) => `<form method="post" action="/admin/member/${u.id}/status">${csrfField(req.csrf)}<input type="hidden" name="status" value="${s}"><button class="btn sm ${s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'ghost'}" ${u.status === s ? 'disabled' : ''}>${STATUS[s][0]}</button></form>`).join('')}</div>
${u.status === 'approved' ? `<p style="margin-top:14px"><a class="btn sm ghost" href="${waLink(u.whatsapp, approveMsg)}" target="_blank" rel="noopener">Kabari via WhatsApp</a></p>` : ''}
<form class="f" method="post" action="/admin/member/${u.id}/catatan" style="margin-top:16px">${csrfField(req.csrf)}
<label>Tag <span class="dim">(pisahkan koma, mis. VIP, aktif, follow-up)</span></label><input name="tags" value="${esc(u.tags || '')}">
<label>Catatan CRM</label><textarea name="notes" style="min-height:100px">${esc(u.notes || '')}</textarea>
<button class="btn sm">Simpan catatan</button></form>
<div class="row" style="margin-top:16px"><form method="post" action="/admin/member/${u.id}/reset">${csrfField(req.csrf)}<button class="btn sm ghost">Buat password sementara</button></form>
<form method="post" action="/admin/member/${u.id}/hapus" onsubmit="return confirm('Hapus member ini permanen?')">${csrfField(req.csrf)}<button class="btn sm red">Hapus</button></form></div></div></div>
<h2 style="margin-top:24px">Aktivitas terakhir</h2><div class="card" style="padding:6px 14px"><table>${acts.map((a) => `<tr><td class="dim">${esc(a.created_at)}</td><td>${esc(a.action)}</td><td class="dim">${esc(a.detail || '')}</td></tr>`).join('') || '<tr><td class="muted">Belum ada.</td></tr>'}</table></div>`,
  });
});

router.post('/admin/member/:id/status', (req, res) => {
  const s = String((req.body || {}).status);
  if (!STATUS[s]) return res.redirect('/admin/member');
  db.run(`UPDATE users SET status = ?${s === 'approved' ? ", approved_at = COALESCE(approved_at, datetime('now'))" : ''} WHERE id = ? AND role = 'member'`, [s, req.params.id]);
  db.log(Number(req.params.id), 'status:' + s, 'oleh ' + req.user.email);
  res.redirect(req.get('referer') && req.get('referer').includes('/admin') ? req.get('referer') : '/admin/member/' + req.params.id);
});

// ---------- Dupoin referral auto-approval ----------
// The Dupoin partner portal has no API key; it is checked from the admin's logged-in browser by a scheduled task:
// 1) GET pending list here, 2) search each member in the portal (email / account), 3) POST the matches back here.
router.get('/admin/api/dupoin/pending', (req, res) => {
  const members = db.all("SELECT id, name, email, vantage_email, vantage_account, created_at FROM users WHERE role='member' AND status='pending' ORDER BY id");
  res.set('Cache-Control', 'no-store').json({ csrf: req.csrf, members });
});

router.post('/admin/api/dupoin/results', express.json({ limit: '200kb' }), (req, res) => {
  const results = Array.isArray(req.body && req.body.results) ? req.body.results.slice(0, 500) : [];
  let approved = 0, waiting = 0, notFound = 0, ambiguous = 0;
  const out = [];
  for (const r of results) {
    const u = db.get("SELECT id, name, status FROM users WHERE id = ? AND role='member'", [Number(r.id)]);
    if (!u || u.status !== 'pending') continue;
    const seen = new Map();
    for (const m of Array.isArray(r.matches) ? r.matches : []) if (Number(m.uid)) seen.set(Number(m.uid), m);
    const matches = [...seen.values()];
    let check, uid = null, approve = false;
    if (!matches.length) { check = 'Tidak ditemukan di referral Dupoin'; notFound++; }
    else if (matches.length > 1) { check = `Ditemukan ${matches.length} akun referral, cek manual`; ambiguous++; }
    else {
      const m = matches[0]; uid = Number(m.uid);
      const claimed = db.get("SELECT id FROM users WHERE dupoin_uid = ? AND id != ? AND status = 'approved'", [uid, u.id]);
      if (claimed) { check = `UID ${uid} sudah dipakai member #${claimed.id}, cek manual`; ambiguous++; uid = null; }
      else if (m.verified && Number(m.accounts) > 0) { check = `Terverifikasi di referral Dupoin (via ${String(m.by || 'pencarian').slice(0, 20)})`; approve = true; }
      else { check = m.verified ? 'Referral terverifikasi, belum punya akun trading' : 'Terdaftar di referral, belum verifikasi KYC'; waiting++; }
    }
    if (approve) {
      db.run("UPDATE users SET status='approved', approved_at=COALESCE(approved_at, datetime('now')), dupoin_uid=?, dupoin_check=?, dupoin_checked_at=datetime('now') WHERE id=?", [uid, check, u.id]);
      db.log(u.id, 'status:approved', `otomatis: Dupoin UID ${uid}`);
      approved++;
    } else {
      db.run("UPDATE users SET dupoin_uid=COALESCE(?, dupoin_uid), dupoin_check=?, dupoin_checked_at=datetime('now') WHERE id=?", [uid, check, u.id]);
    }
    out.push({ id: u.id, name: u.name, approved: approve, check });
  }
  const summary = `${approved} disetujui, ${waiting} menunggu KYC/akun, ${notFound} tidak ditemukan, ${ambiguous} cek manual`;
  db.setSetting('dupoin_last_sync', new Date().toISOString().replace('T', ' ').slice(0, 19));
  db.setSetting('dupoin_last_summary', summary);
  if (results.length) db.log(null, 'dupoin-sync', summary);
  res.json({ ok: true, summary, results: out });
});

router.post('/admin/member/:id/catatan', (req, res) => {
  const b = req.body || {};
  db.run('UPDATE users SET tags = ?, notes = ? WHERE id = ?', [String(b.tags || '').slice(0, 200), String(b.notes || '').slice(0, 5000), req.params.id]);
  res.redirect('/admin/member/' + req.params.id);
});

router.post('/admin/member/:id/reset', (req, res) => {
  const temp = 'DT-' + crypto.randomBytes(4).toString('hex');
  db.run("UPDATE users SET password_hash = ? WHERE id = ? AND role = 'member'", [auth.hashPassword(temp), req.params.id]);
  db.run('DELETE FROM sessions WHERE user_id = ?', [req.params.id]);
  db.log(Number(req.params.id), 'password-reset', 'oleh ' + req.user.email);
  res.redirect(`/admin/member/${req.params.id}?temp=${temp}`);
});

router.post('/admin/member/:id/hapus', (req, res) => {
  const id = req.params.id;
  ['progress', 'questions', 'sessions', 'activity'].forEach((t) => db.run(`DELETE FROM ${t} WHERE user_id = ?`, [id]));
  db.run("DELETE FROM users WHERE id = ? AND role = 'member'", [id]);
  res.redirect('/admin/member');
});

// ---------- Artikel SEO ----------
router.get('/admin/artikel', (req, res) => {
  const synced = req.query.sync ? `Sinkronisasi selesai: ${req.query.sync} artikel baru diimpor.` : '';
  const rows = db.all('SELECT id, slug, title, status, source, focus_keyword, published_at, updated_at FROM articles ORDER BY COALESCE(published_at, created_at) DESC LIMIT 300');
  page(req, res, {
    title: 'Artikel SEO', active: 'artikel',
    body: `<div class="spread"><h1>Artikel SEO</h1><div class="row"><form method="post" action="/admin/artikel/sync">${csrfField(req.csrf)}<button class="btn sm ghost">Impor artikel otomatis</button></form><a class="btn sm" href="/admin/artikel/baru">+ Artikel baru</a></div></div>
${flash(synced, 'ok')}<p class="dim">Artikel otomatis harian masuk dari repo dan langsung tayang. Semua artikel bisa diedit atau ditarik ke draft di sini.</p>
<div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Judul</th><th>Keyword</th><th>Status</th><th>Tanggal</th><th></th></tr></thead><tbody>
${rows.map((a) => `<tr><td><a href="/admin/artikel/${a.id}"><strong>${esc(a.title)}</strong></a><div class="dim">/artikel/${esc(a.slug)}${a.source === 'auto' ? ' · otomatis' : ''}</div></td><td class="dim">${esc(a.focus_keyword || '')}</td>
<td>${a.status === 'published' ? '<span class="pill ok">Tayang</span>' : '<span class="pill gray">Draft</span>'}</td><td class="dim">${fmtDate(a.published_at || a.updated_at)}</td>
<td>${a.status === 'published' ? `<a href="/artikel/${esc(a.slug)}" target="_blank">Lihat</a>` : ''}</td></tr>`).join('') || '<tr><td class="muted">Belum ada artikel.</td></tr>'}
</tbody></table></div>`,
  });
});

router.post('/admin/artikel/sync', (req, res) => {
  const n = syncInbox();
  res.redirect('/admin/artikel?sync=' + n);
});

function articleForm(req, res, a = {}, error = '') {
  const v = (k) => esc(a[k] || '');
  const isNew = !a.id;
  page(req, res, {
    title: isNew ? 'Artikel baru' : 'Edit artikel', active: 'artikel',
    body: `<a class="dim" href="/admin/artikel">← Artikel</a><h1 style="margin-top:8px">${isNew ? 'Artikel baru' : 'Edit artikel'}</h1>${flash(error, 'bad')}${flash(req.query.ok ? 'Tersimpan.' : '', 'ok')}
<form class="f" method="post" action="${isNew ? '/admin/artikel/baru' : '/admin/artikel/' + a.id}">${csrfField(req.csrf)}
<div class="grid g2"><div class="f">
<label>Judul (H1)</label><input name="title" required maxlength="140" value="${v('title')}">
<label>Slug URL <span class="dim">(kosongkan = otomatis dari judul)</span></label><input name="slug" maxlength="90" value="${v('slug')}">
<label>Focus keyword</label><input name="focus_keyword" maxlength="80" value="${v('focus_keyword')}" placeholder="mis. cara menghitung lot forex">
</div><div class="f">
<label>Meta title <span class="dim">(≤ 60 karakter)</span></label><input name="meta_title" maxlength="80" value="${v('meta_title')}">
<label>Meta description <span class="dim">(120–160 karakter)</span></label><textarea name="meta_description" maxlength="200" style="min-height:90px">${v('meta_description')}</textarea>
<div class="grid g2"><div><label>Kategori</label><input name="category" maxlength="40" value="${esc(a.category || 'Edukasi')}"></div><div><label>Tag</label><input name="tags" maxlength="200" value="${v('tags')}" placeholder="forex, emas, risiko"></div></div>
</div></div>
<label>Ringkasan / excerpt</label><textarea name="excerpt" maxlength="400" style="min-height:70px">${v('excerpt')}</textarea>
<label>Isi artikel (Markdown: ## Subjudul, **tebal**, - daftar, [link](/artikel/...))</label><textarea class="code" name="body_md" required>${v('body_md')}</textarea>
<div class="row"><label style="font-weight:500">Status</label><select name="status" style="width:auto"><option value="draft"${a.status !== 'published' ? ' selected' : ''}>Draft</option><option value="published"${a.status === 'published' ? ' selected' : ''}>Tayang</option></select>
<button class="btn" type="submit">Simpan</button>${!isNew && a.status === 'published' ? `<a class="btn ghost" href="/artikel/${esc(a.slug)}" target="_blank">Lihat</a>` : ''}</div>
</form>
${!isNew ? `<form method="post" action="/admin/artikel/${a.id}/hapus" onsubmit="return confirm('Hapus artikel ini permanen?')" style="margin-top:20px">${csrfField(req.csrf)}<button class="btn sm red">Hapus artikel</button></form>` : ''}`,
  });
}

function saveArticle(req, id) {
  const b = req.body || {};
  const title = String(b.title || '').trim().slice(0, 140);
  const body = String(b.body_md || '');
  if (!title || body.trim().length < 50) return { error: 'Judul wajib diisi dan isi artikel minimal 50 karakter.' };
  let slug = slugify(b.slug || title);
  const clash = db.get('SELECT id FROM articles WHERE slug = ? AND id != ?', [slug, id || 0]);
  if (clash) slug = slug + '-' + Date.now().toString(36).slice(-4);
  const status = b.status === 'published' ? 'published' : 'draft';
  const fields = [title, slug, String(b.meta_title || '').slice(0, 80), String(b.meta_description || '').slice(0, 200), String(b.focus_keyword || '').slice(0, 80),
    String(b.excerpt || '').slice(0, 400) || plain(body, 200), body, String(b.category || 'Edukasi').slice(0, 40), String(b.tags || '').slice(0, 200), status];
  if (id) {
    db.run(`UPDATE articles SET title=?, slug=?, meta_title=?, meta_description=?, focus_keyword=?, excerpt=?, body_md=?, category=?, tags=?, status=?,
      published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, datetime('now')) ELSE published_at END, updated_at = datetime('now'), edited_in_cms = 1, review_notes = '' WHERE id = ?`, [...fields, status, id]);
    return { id };
  }
  const r = db.run(`INSERT INTO articles(title, slug, meta_title, meta_description, focus_keyword, excerpt, body_md, category, tags, status, published_at, source)
    VALUES(?,?,?,?,?,?,?,?,?,?, CASE WHEN ? = 'published' THEN datetime('now') END, 'cms')`, [...fields, status]);
  return { id: r.lastInsertRowid };
}

router.get('/admin/artikel/baru', (req, res) => articleForm(req, res));
router.post('/admin/artikel/baru', (req, res) => {
  const r = saveArticle(req, null);
  if (r.error) return articleForm(req, res, req.body, r.error);
  res.redirect(`/admin/artikel/${r.id}?ok=1`);
});
router.get('/admin/artikel/:id', (req, res, next) => {
  const a = db.get('SELECT * FROM articles WHERE id = ?', [req.params.id]);
  if (!a) return next();
  articleForm(req, res, a);
});
router.post('/admin/artikel/:id', (req, res) => {
  const r = saveArticle(req, Number(req.params.id));
  if (r.error) return articleForm(req, res, { ...req.body, id: req.params.id }, r.error);
  res.redirect(`/admin/artikel/${req.params.id}?ok=1`);
});
router.post('/admin/artikel/:id/hapus', (req, res) => {
  db.run('DELETE FROM articles WHERE id = ?', [req.params.id]);
  res.redirect('/admin/artikel');
});

// ---------- Academy ----------
router.get('/admin/academy', (req, res) => {
  const courses = db.all('SELECT c.*, (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) n FROM courses c ORDER BY position, id');
  page(req, res, {
    title: 'Academy', active: 'academy',
    body: `<div class="spread"><h1>Academy</h1><a class="btn sm" href="/admin/academy/kelas/baru">+ Kelas baru</a></div>
<div class="card" style="padding:6px 14px"><table><thead><tr><th>#</th><th>Kelas</th><th>Level</th><th>Materi</th><th>Status</th></tr></thead><tbody>
${courses.map((c) => `<tr><td class="dim">${c.position}</td><td><a href="/admin/academy/kelas/${c.id}"><strong>${esc(c.title)}</strong></a></td><td>${esc(c.level)}</td><td>${c.n}</td><td>${c.published ? '<span class="pill ok">Tayang</span>' : '<span class="pill gray">Disembunyikan</span>'}</td></tr>`).join('') || '<tr><td class="muted">Belum ada kelas.</td></tr>'}
</tbody></table></div>`,
  });
});

function courseForm(req, res, c = {}) {
  const lessons = c.id ? db.all('SELECT * FROM lessons WHERE course_id = ? ORDER BY position, id', [c.id]) : [];
  page(req, res, {
    title: c.id ? c.title : 'Kelas baru', active: 'academy',
    body: `<a class="dim" href="/admin/academy">← Academy</a><h1 style="margin-top:8px">${c.id ? 'Edit kelas' : 'Kelas baru'}</h1>${flash(req.query.ok ? 'Tersimpan.' : '', 'ok')}
<form class="f card" method="post" action="/admin/academy/kelas/${c.id || 'baru'}">${csrfField(req.csrf)}
<div class="grid g2"><div><label>Judul kelas</label><input name="title" required value="${esc(c.title || '')}"></div><div><label>Level</label><select name="level">${['Pemula', 'Menengah', 'Lanjutan'].map((l) => `<option${c.level === l ? ' selected' : ''}>${l}</option>`).join('')}</select></div></div>
<label>Ringkasan</label><textarea name="summary" style="min-height:80px">${esc(c.summary || '')}</textarea>
<div class="grid g2"><div><label>Urutan</label><input name="position" type="number" value="${esc(c.position || 0)}"></div><div><label>Status</label><select name="published"><option value="1"${c.published !== 0 ? ' selected' : ''}>Tayang</option><option value="0"${c.published === 0 ? ' selected' : ''}>Disembunyikan</option></select></div></div>
<button class="btn">Simpan kelas</button></form>
${c.id ? `<div class="spread" style="margin-top:26px"><h2>Materi</h2><a class="btn sm" href="/admin/academy/materi/baru?course=${c.id}">+ Materi baru</a></div>
<div class="card" style="padding:6px 14px"><table>${lessons.map((l) => `<tr><td class="dim">${l.position}</td><td><a href="/admin/academy/materi/${l.id}">${esc(l.title)}</a></td><td class="dim">${l.video_url ? 'video · ' : ''}${l.duration_min || 0} mnt</td><td>${l.published ? '' : '<span class="pill gray">Disembunyikan</span>'}</td></tr>`).join('') || '<tr><td class="muted">Belum ada materi.</td></tr>'}</table></div>
<form method="post" action="/admin/academy/kelas/${c.id}/hapus" onsubmit="return confirm('Hapus kelas beserta semua materinya?')" style="margin-top:20px">${csrfField(req.csrf)}<button class="btn sm red">Hapus kelas</button></form>` : ''}`,
  });
}

router.get('/admin/academy/kelas/baru', (req, res) => courseForm(req, res));
router.get('/admin/academy/kelas/:id', (req, res, next) => {
  const c = db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
  if (!c) return next();
  courseForm(req, res, c);
});
router.post('/admin/academy/kelas/:id', (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim().slice(0, 120) || 'Kelas';
  const vals = [title, String(b.level || 'Pemula'), String(b.summary || '').slice(0, 600), Number(b.position) || 0, b.published === '0' ? 0 : 1];
  let id = req.params.id;
  if (id === 'baru') {
    let slug = slugify(title);
    if (db.get('SELECT id FROM courses WHERE slug = ?', [slug])) slug += '-' + Date.now().toString(36).slice(-4);
    id = db.run('INSERT INTO courses(title, level, summary, position, published, slug) VALUES(?,?,?,?,?,?)', [...vals, slug]).lastInsertRowid;
  } else {
    db.run('UPDATE courses SET title=?, level=?, summary=?, position=?, published=? WHERE id = ?', [...vals, id]);
  }
  res.redirect(`/admin/academy/kelas/${id}?ok=1`);
});
router.post('/admin/academy/kelas/:id/hapus', (req, res) => {
  db.run('DELETE FROM progress WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = ?)', [req.params.id]);
  db.run('DELETE FROM lessons WHERE course_id = ?', [req.params.id]);
  db.run('DELETE FROM courses WHERE id = ?', [req.params.id]);
  res.redirect('/admin/academy');
});

function lessonForm(req, res, l) {
  const courses = db.all('SELECT id, title FROM courses ORDER BY position, id');
  page(req, res, {
    title: l.id ? l.title : 'Materi baru', active: 'academy',
    body: `<a class="dim" href="/admin/academy/kelas/${l.course_id}">← Kembali ke kelas</a><h1 style="margin-top:8px">${l.id ? 'Edit materi' : 'Materi baru'}</h1>${flash(req.query.ok ? 'Tersimpan.' : '', 'ok')}
<form class="f" method="post" action="/admin/academy/materi/${l.id || 'baru'}">${csrfField(req.csrf)}
<div class="grid g2"><div><label>Judul materi</label><input name="title" required value="${esc(l.title || '')}"></div><div><label>Kelas</label><select name="course_id">${courses.map((c) => `<option value="${c.id}"${Number(l.course_id) === c.id ? ' selected' : ''}>${esc(c.title)}</option>`).join('')}</select></div></div>
<div class="grid g3"><div><label>Link video (YouTube/unlisted)</label><input name="video_url" value="${esc(l.video_url || '')}"></div><div><label>Durasi (menit)</label><input name="duration_min" type="number" value="${esc(l.duration_min || 0)}"></div><div><label>Urutan</label><input name="position" type="number" value="${esc(l.position || 0)}"></div></div>
<label>Isi materi (Markdown)</label><textarea class="code" name="body_md">${esc(l.body_md || '')}</textarea>
<div class="row"><select name="published" style="width:auto"><option value="1"${l.published !== 0 ? ' selected' : ''}>Tayang</option><option value="0"${l.published === 0 ? ' selected' : ''}>Disembunyikan</option></select><button class="btn">Simpan materi</button></div></form>
${l.id ? `<form method="post" action="/admin/academy/materi/${l.id}/hapus" onsubmit="return confirm('Hapus materi ini?')" style="margin-top:20px">${csrfField(req.csrf)}<button class="btn sm red">Hapus materi</button></form>` : ''}`,
  });
}

router.get('/admin/academy/materi/baru', (req, res) => lessonForm(req, res, { course_id: Number(req.query.course) || 0, published: 1 }));
router.get('/admin/academy/materi/:id', (req, res, next) => {
  const l = db.get('SELECT * FROM lessons WHERE id = ?', [req.params.id]);
  if (!l) return next();
  lessonForm(req, res, l);
});
router.post('/admin/academy/materi/:id', (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim().slice(0, 140) || 'Materi';
  const courseId = Number(b.course_id);
  const vals = [courseId, title, String(b.video_url || '').slice(0, 300), String(b.body_md || ''), Number(b.duration_min) || 0, Number(b.position) || 0, b.published === '0' ? 0 : 1];
  let id = req.params.id;
  if (id === 'baru') {
    let slug = slugify(title);
    if (db.get('SELECT id FROM lessons WHERE course_id = ? AND slug = ?', [courseId, slug])) slug += '-' + Date.now().toString(36).slice(-4);
    id = db.run('INSERT INTO lessons(course_id, title, video_url, body_md, duration_min, position, published, slug) VALUES(?,?,?,?,?,?,?,?)', [...vals, slug]).lastInsertRowid;
  } else {
    db.run('UPDATE lessons SET course_id=?, title=?, video_url=?, body_md=?, duration_min=?, position=?, published=? WHERE id = ?', [...vals, id]);
  }
  res.redirect(`/admin/academy/materi/${id}?ok=1`);
});
router.post('/admin/academy/materi/:id/hapus', (req, res) => {
  const l = db.get('SELECT course_id FROM lessons WHERE id = ?', [req.params.id]);
  db.run('DELETE FROM progress WHERE lesson_id = ?', [req.params.id]);
  db.run('DELETE FROM lessons WHERE id = ?', [req.params.id]);
  res.redirect(l ? `/admin/academy/kelas/${l.course_id}` : '/admin/academy');
});

// ---------- Tanya Doktor ----------
router.get('/admin/tanya', (req, res) => {
  const filter = req.query.semua ? '' : 'WHERE q.answer IS NULL AND q.ai_answer IS NULL';
  const rows = db.all(`SELECT q.*, u.name, u.whatsapp FROM questions q JOIN users u ON u.id = q.user_id ${filter} ORDER BY q.id DESC LIMIT 200`);
  const aiOn = require('../ai').enabled();
  const st = (db.get("SELECT SUM(ai_status='ok') ok, SUM(ai_status='error') err, SUM(ai_status='off') off FROM questions WHERE created_at >= datetime('now','-30 days')") || {});
  page(req, res, {
    title: 'Tanya Doktor', active: 'tanya',
    body: `<div class="spread"><h1>Tanya Doktor</h1><a class="pill ${req.query.semua ? '' : 'gray'}" href="/admin/tanya${req.query.semua ? '' : '?semua=1'}">${req.query.semua ? 'Hanya yang perlu dijawab' : 'Tampilkan semua (tinjau jawaban AI)'}</a></div>
${aiOn ? `<div class="alert ok">Asisten AI aktif. 30 hari terakhir: ${st.ok || 0} dijawab AI, ${st.err || 0} gagal (gagal = perlu dijawab manual).</div>`
    : '<div class="alert bad">Asisten AI belum aktif: ANTHROPIC_API_KEY belum diisi di /etc/doktor-trader.env. Selama itu, setiap pertanyaan harus dijawab manual di sini, padahal landing & video menyebut Tanya Doktor sebagai asisten AI yang bisa ditanya kapan saja.</div>'}
<p class="dim">Default: pertanyaan yang belum punya jawaban sama sekali. Jawaban AI bisa ditambah "Catatan Doktor" (koreksi/penegasan); catatan tampil di bawah jawaban AI.</p>
${rows.map((q) => `<div class="card" style="margin-bottom:14px"><div class="spread"><strong>${esc(q.topic || 'Pertanyaan')} · ${esc(q.name)}</strong><span class="dim">${fmtDate(q.created_at)}</span></div>
<p style="white-space:pre-wrap">${esc(q.body)}</p>
${q.ai_answer ? `<details style="margin:8px 0"><summary class="dim" style="cursor:pointer">Jawaban AI (${fmtDate(q.ai_at)})</summary><div class="prose" style="font-size:15px;border-left:3px solid #7FA6FF;padding-left:12px">${md(q.ai_answer)}</div></details>` : `<p class="dim">${q.ai_status === 'error' ? 'AI gagal menjawab.' : 'Tanpa jawaban AI.'}</p>`}
<form class="f" method="post" action="/admin/tanya/${q.id}">${csrfField(req.csrf)}<label>Catatan / jawaban Doktor (Markdown)</label><textarea name="answer" required>${esc(q.answer || '')}</textarea>
<div class="row"><label class="row" style="font-weight:500"><input type="checkbox" name="is_public" value="1" ${q.is_public ? 'checked' : ''} style="width:auto;min-height:auto"> Tampilkan ke member lain (tanpa nama)</label><button class="btn sm">Simpan</button></div></form></div>`).join('') || '<p class="muted">Tidak ada pertanyaan yang menunggu.</p>'}`,
  });
});
router.post('/admin/tanya/:id', (req, res) => {
  const b = req.body || {};
  db.run("UPDATE questions SET answer = ?, is_public = ?, answered_at = datetime('now') WHERE id = ?", [String(b.answer || '').slice(0, 6000), b.is_public ? 1 : 0, req.params.id]);
  res.redirect('/admin/tanya');
});

// ---------- Tools ----------
const KINDS = { ea: 'EA Trading', signal: 'AI Signals', copytrade: 'Copy Trade' };
router.get('/admin/tools', (req, res) => {
  const rows = db.all('SELECT * FROM tools ORDER BY kind, position, id');
  const form = (t = {}) => `<form class="f" method="post" action="/admin/tools/${t.id || 'baru'}">${csrfField(req.csrf)}
<div class="grid g3"><div><label>Jenis</label><select name="kind">${Object.entries(KINDS).map(([k, l]) => `<option value="${k}"${t.kind === k ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
<div><label>Nama</label><input name="title" required value="${esc(t.title || '')}"></div><div><label>Urutan</label><input name="position" type="number" value="${esc(t.position || 0)}"></div></div>
<label>Deskripsi (Markdown)</label><textarea name="description" style="min-height:90px">${esc(t.description || '')}</textarea>
<div class="grid g3"><div><label>Karakter risiko</label><input name="risk_note" value="${esc(t.risk_note || '')}" placeholder="mis. Sedang, max DD 15%"></div><div><label>Link (download/join)</label><input name="link_url" value="${esc(t.link_url || '')}"></div><div><label>Label tombol</label><input name="link_label" value="${esc(t.link_label || 'Buka')}"></div></div>
<div class="row"><select name="published" style="width:auto"><option value="1"${t.published !== 0 ? ' selected' : ''}>Tayang</option><option value="0"${t.published === 0 ? ' selected' : ''}>Disembunyikan</option></select><button class="btn sm">${t.id ? 'Simpan' : 'Tambah'}</button></div></form>
${t.id ? `<form method="post" action="/admin/tools/${t.id}/hapus" onsubmit="return confirm('Hapus?')" style="margin-top:8px">${csrfField(req.csrf)}<button class="btn sm red">Hapus</button></form>` : ''}`;
  page(req, res, {
    title: 'Tools', active: 'tools',
    body: `<h1>EA · AI Signals · Copy Trade</h1><p class="dim">Hanya terlihat oleh member terverifikasi.</p>
<details class="card" style="margin-bottom:18px"><summary style="cursor:pointer;font-weight:800">+ Tambah tools</summary><div style="margin-top:14px">${form()}</div></details>
${rows.map((t) => `<details class="card" style="margin-bottom:10px"><summary style="cursor:pointer"><span class="pill">${KINDS[t.kind] || t.kind}</span> <strong>${esc(t.title)}</strong> ${t.published ? '' : '<span class="pill gray">Disembunyikan</span>'}</summary><div style="margin-top:14px">${form(t)}</div></details>`).join('')}`,
  });
});
router.post('/admin/tools/:id', (req, res) => {
  const b = req.body || {};
  const vals = [KINDS[b.kind] ? b.kind : 'ea', String(b.title || '').slice(0, 120) || 'Tools', String(b.description || '').slice(0, 3000), String(b.risk_note || '').slice(0, 200),
    String(b.link_url || '').slice(0, 400), String(b.link_label || 'Buka').slice(0, 40), Number(b.position) || 0, b.published === '0' ? 0 : 1];
  if (req.params.id === 'baru') db.run('INSERT INTO tools(kind, title, description, risk_note, link_url, link_label, position, published) VALUES(?,?,?,?,?,?,?,?)', vals);
  else db.run('UPDATE tools SET kind=?, title=?, description=?, risk_note=?, link_url=?, link_label=?, position=?, published=? WHERE id = ?', [...vals, req.params.id]);
  res.redirect('/admin/tools');
});
router.post('/admin/tools/:id/hapus', (req, res) => {
  db.run('DELETE FROM tools WHERE id = ?', [req.params.id]);
  res.redirect('/admin/tools');
});

router.page = page;
router.NAV = NAV;
module.exports = router;
