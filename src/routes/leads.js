// Pipeline lead sales di admin: daftar + filter, edit oleh tim sales, import CSV (dedupe by WA), akun tim sales.
const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const auth = require('../auth');
const L = require('../leads');
const { layout, esc, flash, csrfField, sideNav, fmtDate } = require('../views');
const admin = require('./admin');

const router = express.Router();
router.use('/admin/lead', auth.requireStaff);
const adminOnly = (req, res, next) => (req.user.role === 'admin' ? next() : res.status(403).send('Khusus admin.'));

const SALES_NAV = [['/admin/lead', 'Pipeline Lead', 'lead']];
function page(req, res, { title, body }) {
  if (req.user.role === 'admin') return admin.page(req, res, { title, active: 'lead', body });
  res.send(layout({
    title: 'Sales · ' + title, noindex: true, user: req.user, active: 'admin',
    body: `<section class="wrap" style="padding:32px 20px;max-width:1240px"><div class="side">${sideNav(SALES_NAV, 'lead')}<div style="min-width:0">${body}</div></div></section>`,
  }));
}

const actor = (req) => req.user.name || req.user.email;
const label = Object.fromEntries(L.FIELDS.map(([k, l]) => [k, l]));
const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);   // WIB
const waLink = (d) => (d ? `https://wa.me/${d}` : '#');
const PRIO_RANK = `CASE
  WHEN lower(prioritas) LIKE 'hot%' OR lower(prioritas) IN ('tinggi','high','p1','1','a') THEN 1
  WHEN lower(prioritas) LIKE 'warm%' OR lower(prioritas) IN ('sedang','medium','p2','2','b') THEN 2
  WHEN lower(prioritas) LIKE 'cold%' OR lower(prioritas) IN ('rendah','low','p3','3','c') THEN 3
  WHEN prioritas = '' THEN 9 ELSE 4 END`;
const SORTS = {
  fu: ["Tgl FU terdekat", "CASE WHEN tgl_fu = '' THEN 1 ELSE 0 END, tgl_fu, id DESC"],
  prioritas: ['Prioritas', `${PRIO_RANK}, CASE WHEN tgl_fu = '' THEN 1 ELSE 0 END, tgl_fu, id DESC`],
  baru: ['Terbaru diimport', 'id DESC'],
  update: ['Terakhir diubah', 'updated_at DESC, id DESC'],
};
const distinct = (col) => db.all(`SELECT ${col} v, COUNT(*) n FROM leads GROUP BY ${col} ORDER BY ${col} = '', ${col}`);
const prioPill = (p) => {
  const s = String(p || '').toLowerCase();
  const cls = /^(hot|tinggi|high)|^(p1|1|a)$/.test(s) ? 'bad' : /^(warm|sedang|medium)|^(p2|2|b)$/.test(s) ? '' : 'gray';
  return p ? `<span class="pill ${cls}">${esc(p)}</span>` : '';
};
const fuCell = (d) => {
  if (!d) return '<span class="dim">-</span>';
  const t = today();
  const cls = /^\d{4}-\d{2}-\d{2}$/.test(d) ? (d < t ? 'bad' : d === t ? '' : 'gray') : 'gray';
  return `<span class="pill ${cls}" title="${d < t ? 'Lewat jadwal' : ''}">${esc(d)}</span>`;
};

function filters(q) {
  const where = [];
  const p = [];
  const f = { prioritas: q.prioritas, pic: q.pic, status: q.status, source: q.source, q: String(q.q || '').trim(), jatuh: q.jatuh };
  // '(kosong)' memfilter baris yang kolomnya belum diisi.
  const eq = (col, v) => { if (v == null || v === '') return; where.push(`${col} = ?`); p.push(v === '(kosong)' ? '' : String(v)); };
  eq('prioritas', f.prioritas); eq('pic_sales', f.pic); eq('status_fu', f.status); eq('source', f.source);
  if (f.jatuh === '1') { where.push("tgl_fu != '' AND tgl_fu <= ?"); p.push(today()); }
  if (f.q) {
    const cols = ['nama', 'whatsapp', 'email', 'kota', 'hasil_fu', 'langkah_berikut', 'akun_dupoin', 'akun_kvb_form', 'akun_kvb_lama', 'catatan'];
    where.push('(' + cols.map((c) => `${c} LIKE ?`).join(' OR ') + ')');
    const like = '%' + f.q.replace(/^\+/, '').replace(/^0(?=8)/, '62') + '%';
    cols.forEach((c) => p.push(c === 'whatsapp' ? like : '%' + f.q + '%'));
  }
  return { f, sql: where.length ? 'WHERE ' + where.join(' AND ') : '', p };
}

const qs = (o) => Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

// ---------- Daftar pipeline ----------
router.get('/admin/lead', (req, res) => {
  const { f, sql, p } = filters(req.query);
  const sort = SORTS[req.query.sort] ? String(req.query.sort) : 'fu';
  const per = 100;
  const pg = Math.max(1, parseInt(req.query.page, 10) || 1);
  const total = db.get(`SELECT COUNT(*) n FROM leads ${sql}`, p).n;
  const all = db.get('SELECT COUNT(*) n FROM leads').n;
  const rows = db.all(`SELECT * FROM leads ${sql} ORDER BY ${SORTS[sort][1]} LIMIT ${per} OFFSET ${(pg - 1) * per}`, p);
  const due = db.get("SELECT COUNT(*) n FROM leads WHERE tgl_fu != '' AND tgl_fu <= ?", [today()]).n;
  const opt = (rowsD, cur) => rowsD.map((r) => { const v = r.v === '' ? '(kosong)' : r.v; return `<option value="${esc(v)}"${cur === v ? ' selected' : ''}>${esc(v)} (${r.n})</option>`; }).join('');
  const sel = (name, title, rowsD, cur) => `<label class="dim" style="display:flex;flex-direction:column;gap:4px;font-size:12px">${title}<select name="${name}" onchange="this.form.submit()"><option value="">Semua</option>${opt(rowsD, cur)}</select></label>`;
  const sources = distinct('source');
  const base = { prioritas: f.prioritas, pic: f.pic, status: f.status, source: f.source, q: f.q, jatuh: f.jatuh, sort };
  const pages = Math.ceil(total / per);
  page(req, res, {
    title: 'Pipeline Lead',
    body: `<div class="spread"><h1>Pipeline Lead</h1><div class="row">
<a class="btn ghost sm" href="/admin/lead/export.csv?${qs(base)}">Export CSV</a>
${req.user.role === 'admin' ? '<a class="btn ghost sm" href="/admin/lead/tim">Tim sales</a><a class="btn sm" href="/admin/lead/import">Import CSV</a>' : ''}</div></div>
${flash(req.query.ok ? 'Perubahan tersimpan.' : '', 'ok')}${flash(req.query.del ? 'Lead dihapus.' : '', 'ok')}
<p class="dim" style="margin:6px 0 14px">${all} lead · <a href="/admin/lead?${qs({ jatuh: '1', sort: 'fu' })}">${due} jadwal FU hari ini / terlewat</a></p>
<form method="get" class="card" style="display:flex;flex-wrap:wrap;gap:12px;align-items:end;margin-bottom:16px;padding:14px">
${sel('prioritas', 'Prioritas', distinct('prioritas'), f.prioritas)}
${sel('pic', 'PIC Sales', distinct('pic_sales'), f.pic)}
${sel('status', 'Status FU', distinct('status_fu'), f.status)}
${sources.length > 1 ? sel('source', 'Sumber data', sources, f.source) : ''}
<label class="dim" style="display:flex;flex-direction:column;gap:4px;font-size:12px">Urutkan<select name="sort" onchange="this.form.submit()">${Object.entries(SORTS).map(([k, [l]]) => `<option value="${k}"${k === sort ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
<label class="dim" style="display:flex;flex-direction:column;gap:4px;font-size:12px;flex:1;min-width:200px">Cari<input name="q" value="${esc(f.q)}" placeholder="Nama, WA, email, kota, hasil FU…"></label>
${f.jatuh ? '<input type="hidden" name="jatuh" value="1">' : ''}
<button class="btn sm">Terapkan</button><a class="dim" href="/admin/lead">Reset</a></form>
${f.jatuh ? '<p><span class="pill bad">Hanya jadwal FU hari ini / terlewat</span> <a class="dim" href="/admin/lead">hapus filter</a></p>' : ''}
${rows.length ? `<div class="tablewrap card" style="padding:6px 14px"><table><thead><tr><th>Prioritas</th><th>Nama</th><th>WhatsApp</th><th>Status FU</th><th>Tgl FU</th><th>Langkah berikut</th><th>PIC</th><th>Hasil FU</th><th></th></tr></thead><tbody>
${rows.map((r) => `<tr><td>${prioPill(r.prioritas)}</td>
<td><a href="/admin/lead/${r.id}"><strong>${esc(r.nama || '(tanpa nama)')}</strong></a><div class="dim" style="font-size:12px">${esc([r.kota, r.level_trading].filter(Boolean).join(' · '))}</div></td>
<td><a href="${waLink(r.whatsapp)}" target="_blank" rel="noopener">${esc(r.whatsapp)}</a></td>
<td>${esc(r.status_fu || '-')}</td><td>${fuCell(r.tgl_fu)}</td>
<td style="max-width:220px">${esc(r.langkah_berikut)}</td><td>${esc(r.pic_sales || '-')}</td>
<td style="max-width:260px" class="dim">${esc(String(r.hasil_fu || '').slice(0, 140))}</td>
<td><a class="btn sm ghost" href="/admin/lead/${r.id}">Edit</a></td></tr>`).join('')}
</tbody></table></div>
<div class="row" style="margin-top:12px"><span class="dim">${total} lead cocok · halaman ${pg} dari ${pages}</span>
${pg > 1 ? `<a class="btn sm ghost" href="/admin/lead?${qs({ ...base, page: pg - 1 })}">← Sebelumnya</a>` : ''}
${pg < pages ? `<a class="btn sm ghost" href="/admin/lead?${qs({ ...base, page: pg + 1 })}">Berikutnya →</a>` : ''}</div>`
    : `<p class="muted">${all ? 'Tidak ada lead yang cocok dengan filter.' : 'Belum ada lead. ' + (req.user.role === 'admin' ? '<a href="/admin/lead/import">Import CSV</a>.' : '')}</p>`}`,
  });
});

router.get('/admin/lead/export.csv', (req, res) => {
  const { sql, p } = filters(req.query);
  const rows = db.all(`SELECT * FROM leads ${sql} ORDER BY id`, p);
  const cols = [...L.KEYS, 'catatan', 'source', 'created_at', 'updated_at', 'updated_by'];
  const head = cols.map((c) => label[c] || c);
  const cell = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="pipeline-lead-${today()}.csv"`);
  res.send('﻿' + [head.map(cell).join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n'));
});

// ---------- Import CSV (khusus admin) ----------
router.get('/admin/lead/import', adminOnly, (req, res) => {
  page(req, res, {
    title: 'Import Lead',
    body: `<a class="dim" href="/admin/lead">← Pipeline Lead</a><h1>Import lead dari CSV</h1>
<div class="card" style="margin-bottom:16px"><p>Baris pertama harus header. Kolom yang dikenali:</p>
<p class="dim" style="font-size:13px">${L.FIELDS.map(([, l]) => esc(l)).join(' · ')}</p>
<ul class="dim" style="font-size:13px">
<li>Nomor WhatsApp dinormalkan ke format <strong>62xxx</strong> (0812… / +62 812… / 812… → 62812…) dan dipakai sebagai kunci dedupe. Baris tanpa nomor valid dilewati dan ditampilkan di laporan.</li>
<li>Nomor yang sudah ada di pipeline <strong>tidak ditimpa</strong>: hanya kolom yang masih kosong yang dilengkapi, jadi hasil edit tim sales aman.</li>
<li>Nomor yang muncul lebih dari sekali di file digabung jadi satu lead (riwayat FU lama disambung).</li>
<li>Tanggal (Tgl FU, Tgl masuk) diubah ke YYYY-MM-DD bila formatnya dikenali (21/11/2026, 2026-11-21, 21 Nov 2026).</li>
<li>Delimiter koma, titik koma, atau tab dikenali otomatis. Simpan dari Google Sheets / Excel sebagai CSV UTF-8.</li></ul></div>
<div class="card f">
<label>File CSV</label><input type="file" id="file" accept=".csv,text/csv,text/plain">
<label>Tandai sumber data (source)</label><input id="source" value="${esc(L.DEFAULT_SOURCE)}" maxlength="40" pattern="[a-z0-9-]+">
<div class="row"><button class="btn sm ghost" type="button" id="preview">Cek dulu (tanpa menyimpan)</button><button class="btn sm" type="button" id="go" disabled>Import sekarang</button></div>
<div id="out" style="margin-top:14px"></div></div>
<script>
(function(){
  var csrf = ${JSON.stringify(req.csrf)}, text = null, $ = function(id){ return document.getElementById(id); };
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  $('file').onchange = function(){ var f = this.files[0]; text = null; $('go').disabled = true; $('out').innerHTML = '';
    if (!f) return; var r = new FileReader(); r.onload = function(){ text = r.result; send(true); }; r.readAsText(f, 'utf-8'); };
  $('preview').onclick = function(){ if (text) send(true); else $('out').innerHTML = '<div class="alert bad">Pilih file CSV dulu.</div>'; };
  $('go').onclick = function(){ if (text && confirm('Import lead ke pipeline sekarang?')) send(false); };
  function send(dry){
    $('out').innerHTML = '<p class="dim">Memproses…</p>';
    fetch('/admin/lead/import?dry=' + (dry ? 1 : 0) + '&source=' + encodeURIComponent($('source').value), { method: 'POST', headers: { 'Content-Type': 'text/csv; charset=utf-8', 'x-csrf-token': csrf }, body: text, credentials: 'same-origin' })
      .then(function(r){ return r.json(); }).then(function(d){
        if (d.error) { $('out').innerHTML = '<div class="alert bad">' + esc(d.error) + '</div>'; return; }
        var h = '<div class="alert ' + (dry ? '' : 'ok') + '">' + (dry ? '<strong>Pratinjau</strong> (belum disimpan): ' : '<strong>Import selesai</strong>: ') +
          d.total + ' baris data → ' + d.unique + ' nomor WA unik. <strong>' + d.inserted + '</strong> lead baru, <strong>' + d.updated + '</strong> lead lama dilengkapi, ' + d.unchanged + ' sudah ada tanpa perubahan, ' + d.dupInFile + ' baris duplikat di file digabung, ' + d.invalid.length + ' baris WA tidak valid dilewati.</div>';
        if (d.unknown.length) h += '<p class="dim">Kolom tidak dikenali (diabaikan): ' + d.unknown.map(esc).join(', ') + '</p>';
        if (d.invalid.length) h += '<details><summary>' + d.invalid.length + ' baris dilewati (WA kosong/tidak valid)</summary><table><tr><th>Baris</th><th>Nama</th><th>Isi kolom WA</th></tr>' + d.invalid.slice(0, 500).map(function(x){ return '<tr><td>' + x.line + '</td><td>' + esc(x.nama) + '</td><td>' + esc(x.wa) + '</td></tr>'; }).join('') + '</table></details>';
        if (!dry) h += '<p><a class="btn sm" href="/admin/lead">Buka pipeline →</a></p>';
        $('out').innerHTML = h; $('go').disabled = !dry;
      }).catch(function(e){ $('out').innerHTML = '<div class="alert bad">Gagal: ' + esc(e.message) + '</div>'; });
  }
})();
</script>`,
  });
});

router.post('/admin/lead/import', adminOnly, express.text({ type: () => true, limit: '20mb' }), (req, res) => {
  const source = String(req.query.source || L.DEFAULT_SOURCE).toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || L.DEFAULT_SOURCE;
  const r = L.importLeads(typeof req.body === 'string' ? req.body : '', { source, actor: actor(req), dry: req.query.dry === '1' });
  res.set('Cache-Control', 'no-store').json(r);
});

// ---------- Tim sales (khusus admin) ----------
router.get('/admin/lead/tim', adminOnly, (req, res) => {
  const rows = db.all("SELECT id, name, email, whatsapp, last_login_at FROM users WHERE role = 'sales' ORDER BY name");
  const temp = req.query.temp ? String(req.query.temp) : '';
  page(req, res, {
    title: 'Tim Sales',
    body: `<a class="dim" href="/admin/lead">← Pipeline Lead</a><h1>Tim sales</h1>
<p class="dim">Akun tim sales hanya bisa membuka dan mengedit Pipeline Lead (tidak bisa membuka CRM member, artikel, atau pengaturan lain).</p>
${temp ? `<div class="alert ok">Akun ${esc(req.query.email || '')} siap. Password sementara: <strong>${esc(temp)}</strong> — kirim lewat WhatsApp, minta diganti di menu Akun setelah masuk di /masuk.</div>` : ''}
${flash(req.query.e === 'admin' ? 'Email itu milik akun admin, tidak diubah.' : req.query.e ? 'Nama dan email wajib diisi.' : '', 'bad')}
<div class="tablewrap card" style="padding:6px 14px;margin-bottom:16px"><table><thead><tr><th>Nama</th><th>Email</th><th>Login terakhir</th><th></th></tr></thead><tbody>
${rows.map((u) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td class="dim">${fmtDate(u.last_login_at) || '-'}</td>
<td class="row"><form method="post" action="/admin/lead/tim/${u.id}/reset">${csrfField(req.csrf)}<button class="btn sm ghost">Password baru</button></form>
<form method="post" action="/admin/lead/tim/${u.id}/hapus" onsubmit="return confirm('Cabut akses sales ini?')">${csrfField(req.csrf)}<button class="btn sm red">Cabut akses</button></form></td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada akun sales.</td></tr>'}
</tbody></table></div>
<form class="f card" method="post" action="/admin/lead/tim">${csrfField(req.csrf)}<h3>Tambah akun sales</h3>
<label>Nama (dipakai sebagai PIC Sales)</label><input name="name" required maxlength="80">
<label>Email</label><input name="email" type="email" required maxlength="120">
<button class="btn sm">Buat akun</button></form>`,
  });
});

router.post('/admin/lead/tim', adminOnly, (req, res) => {
  const name = String((req.body || {}).name || '').trim().slice(0, 80);
  const email = String((req.body || {}).email || '').trim().toLowerCase().slice(0, 120);
  if (!name || !email) return res.redirect('/admin/lead/tim?e=1');
  const temp = 'DT-' + crypto.randomBytes(5).toString('hex');
  const ex = db.get('SELECT id, role FROM users WHERE email = ?', [email]);
  if (ex && ex.role === 'admin') return res.redirect('/admin/lead/tim?e=admin');
  if (ex) {
    db.run("UPDATE users SET role = 'sales', status = 'approved', name = ?, password_hash = ? WHERE id = ?", [name, auth.hashPassword(temp), ex.id]);
    db.run('DELETE FROM sessions WHERE user_id = ?', [ex.id]);
  } else {
    db.run("INSERT INTO users(name, email, whatsapp, password_hash, role, status, source, approved_at) VALUES(?, ?, '', ?, 'sales', 'approved', 'admin-sales', datetime('now'))", [name, email, auth.hashPassword(temp)]);
  }
  db.log(null, 'sales-account', `${email} oleh ${req.user.email}`);
  res.redirect(`/admin/lead/tim?temp=${temp}&email=${encodeURIComponent(email)}`);
});

router.post('/admin/lead/tim/:id/reset', adminOnly, (req, res) => {
  const u = db.get("SELECT id, email FROM users WHERE id = ? AND role = 'sales'", [req.params.id]);
  if (!u) return res.redirect('/admin/lead/tim');
  const temp = 'DT-' + crypto.randomBytes(5).toString('hex');
  db.run('UPDATE users SET password_hash = ? WHERE id = ?', [auth.hashPassword(temp), u.id]);
  db.run('DELETE FROM sessions WHERE user_id = ?', [u.id]);
  res.redirect(`/admin/lead/tim?temp=${temp}&email=${encodeURIComponent(u.email)}`);
});

router.post('/admin/lead/tim/:id/hapus', adminOnly, (req, res) => {
  const u = db.get("SELECT id, email FROM users WHERE id = ? AND role = 'sales'", [req.params.id]);
  if (u) {
    db.run('DELETE FROM sessions WHERE user_id = ?', [u.id]);
    db.run('DELETE FROM activity WHERE user_id = ?', [u.id]);
    db.run('DELETE FROM users WHERE id = ?', [u.id]);
    db.log(null, 'sales-account-removed', `${u.email} oleh ${req.user.email}`);
  }
  res.redirect('/admin/lead/tim');
});

// ---------- Detail & edit satu lead ----------
const EDIT_KEYS = [...L.KEYS, 'catatan'];
router.get('/admin/lead/:id', (req, res, next) => {
  const r = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
  if (!r) return next();
  const logs = db.all('SELECT * FROM lead_log WHERE lead_id = ? ORDER BY id DESC LIMIT 50', [r.id]);
  const dl = (id, col) => `<datalist id="${id}">${db.all(`SELECT DISTINCT ${col} v FROM leads WHERE ${col} != '' ORDER BY ${col} LIMIT 200`).map((x) => `<option value="${esc(x.v)}">`).join('')}</datalist>`;
  const picNames = db.all("SELECT name v FROM users WHERE role = 'sales' UNION SELECT DISTINCT pic_sales FROM leads WHERE pic_sales != '' ORDER BY 1").map((x) => `<option value="${esc(x.v)}">`).join('');
  const input = (k, extra = '') => {
    const v = r[k] || '';
    if (k === 'tgl_fu' && (!v || /^\d{4}-\d{2}-\d{2}$/.test(v))) return `<input type="date" name="${k}" value="${esc(v)}">`;
    if (['hasil_fu', 'riwayat_fu_lama', 'catatan', 'langkah_berikut'].includes(k)) return `<textarea name="${k}" style="min-height:${k === 'riwayat_fu_lama' ? 140 : 80}px">${esc(v)}</textarea>`;
    return `<input name="${k}" value="${esc(v)}" ${extra}>`;
  };
  const fld = (k, extra) => `<label>${esc(label[k] || 'Catatan internal')}</label>${input(k, extra)}`;
  const err = req.query.e === 'wa' ? 'Nomor WhatsApp tidak valid (harus nomor Indonesia, format 62xxx).' : req.query.e === 'dup' ? 'Nomor WhatsApp itu sudah dipakai lead lain.' : '';
  page(req, res, {
    title: r.nama || r.whatsapp,
    body: `<a class="dim" href="/admin/lead">← Pipeline Lead</a>
<div class="spread" style="margin:8px 0 16px"><h1 style="margin:0">${esc(r.nama || '(tanpa nama)')}</h1><div class="row">${prioPill(r.prioritas)}<a class="btn sm green" href="${waLink(r.whatsapp)}" target="_blank" rel="noopener">Chat WhatsApp</a></div></div>
${flash(err, 'bad')}${flash(req.query.ok ? 'Perubahan tersimpan.' : '', 'ok')}
<form class="f" method="post" action="/admin/lead/${r.id}">${csrfField(req.csrf)}
<div class="grid g2">
<div class="card"><h3>Follow-up</h3>
${fld('prioritas', 'list="dl-prio"')}${dl('dl-prio', 'prioritas')}
${fld('status_fu', 'list="dl-status"')}${dl('dl-status', 'status_fu')}
${fld('pic_sales', 'list="dl-pic"')}<datalist id="dl-pic">${picNames}</datalist>
${fld('tgl_fu')}${fld('langkah_berikut')}${fld('hasil_fu')}${fld('catatan')}</div>
<div class="card"><h3>Data lead</h3>
${fld('nama')}${fld('whatsapp', 'required inputmode="tel"')}${fld('email', 'type="email"')}${fld('kota')}${fld('level_trading')}${fld('minat')}
${fld('akun_dupoin')}${fld('akun_kvb_form')}${fld('akun_kvb_lama')}${fld('webinar')}</div>
<div class="card"><h3>Asal &amp; riwayat lama</h3>
${fld('sumber')}${fld('asal_iklan')}${fld('tgl_masuk')}${fld('pic_lama')}${fld('riwayat_fu_lama')}
<p class="dim" style="font-size:13px">Source: <strong>${esc(r.source)}</strong> · masuk pipeline ${fmtDate(r.created_at)} · diubah ${esc(r.updated_at)} UTC${r.updated_by ? ' oleh ' + esc(r.updated_by) : ''}</p></div>
<div class="card"><h3>Log perubahan</h3><table>${logs.map((x) => `<tr><td class="dim" style="white-space:nowrap">${esc(x.created_at)}</td><td>${esc(x.actor)}</td><td class="dim" style="white-space:pre-wrap">${esc(x.detail)}</td></tr>`).join('') || '<tr><td class="muted">Belum ada.</td></tr>'}</table></div>
</div>
<div class="row" style="margin-top:14px"><button class="btn">Simpan perubahan</button></div></form>
${req.user.role === 'admin' ? `<form method="post" action="/admin/lead/${r.id}/hapus" onsubmit="return confirm('Hapus lead ini permanen?')" style="margin-top:14px">${csrfField(req.csrf)}<button class="btn sm red">Hapus lead</button></form>` : ''}`,
  });
});

router.post('/admin/lead/:id', (req, res, next) => {
  const r = db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
  if (!r) return next();
  const b = req.body || {};
  const v = {};
  for (const k of EDIT_KEYS) v[k] = b[k] === undefined ? r[k] : (k === 'catatan' ? String(b[k]).trim().slice(0, 10000) : L.cleanValue(k, b[k]));
  if (!v.whatsapp) return res.redirect(`/admin/lead/${r.id}?e=wa`);
  if (v.whatsapp !== r.whatsapp && db.get('SELECT id FROM leads WHERE whatsapp = ? AND id != ?', [v.whatsapp, r.id])) return res.redirect(`/admin/lead/${r.id}?e=dup`);
  const changed = EDIT_KEYS.filter((k) => String(v[k] || '') !== String(r[k] || ''));
  if (changed.length) {
    db.run(`UPDATE leads SET ${changed.map((k) => k + ' = ?').join(', ')}, updated_at = datetime('now'), updated_by = ? WHERE id = ?`, [...changed.map((k) => v[k]), actor(req), r.id]);
    const short = (s) => { s = String(s || ''); return s.length > 120 ? s.slice(0, 117) + '…' : s; };
    L.logLead(r.id, actor(req), changed.map((k) => `${label[k] || 'Catatan'}: ${short(r[k]) || '(kosong)'} → ${short(v[k]) || '(kosong)'}`).join('\n'));
  }
  res.redirect(`/admin/lead/${r.id}?ok=1`);
});

router.post('/admin/lead/:id/hapus', adminOnly, (req, res) => {
  db.run('DELETE FROM lead_log WHERE lead_id = ?', [req.params.id]);
  db.run('DELETE FROM leads WHERE id = ?', [req.params.id]);
  db.log(null, 'lead-delete', `#${req.params.id} oleh ${req.user.email}`);
  res.redirect('/admin/lead?del=1');
});

module.exports = router;
