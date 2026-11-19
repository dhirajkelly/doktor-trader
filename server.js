const path = require('path');
const fs = require('fs');
const express = require('express');
const db = require('./src/db');
const auth = require('./src/auth');
const { syncInbox } = require('./src/content');
const { esc, fmtDate, layout } = require('./src/views');

const PORT = parseInt(process.env.PORT, 10) || 4300;
const PUBLIC = path.join(__dirname, 'public');

async function main() {
  await db.init();
  require('./scripts/seed').seed();
  const n = syncInbox();
  if (n) console.log(`[content] imported ${n} article(s)`);
  setInterval(() => { try { const k = syncInbox(); if (k) console.log(`[content] imported ${k}`); } catch (e) { console.error(e); } }, 5 * 60 * 1000);

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    next();
  });
  // First-party click events (sendBeacon). Before session/CSRF: carries no personal data and changes nothing but a counter.
  const EVENTS = new Set(['broker_click', 'wa_click', 'daftar_click']);
  const evHits = new Map();
  app.post('/t', express.json({ limit: '2kb', type: () => true }), (req, res) => {
    const b = req.body || {};
    const now = Date.now(), key = req.ip, h = evHits.get(key) || [];
    const recent = h.filter((t) => now - t < 60e3);
    if (EVENTS.has(b.e) && recent.length < 30) {
      recent.push(now); evHits.set(key, recent);
      if (evHits.size > 5000) evHits.clear();
      db.run('INSERT INTO events(name, path) VALUES(?, ?)', [b.e, String(b.p || '').slice(0, 200)]);
    }
    res.status(204).end();
  });
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(auth.loadSession);
  app.use(auth.verifyCsrf);

  // Landing page with the latest articles injected (internal links for on-page SEO)
  const landingTpl = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
  app.get(['/', '/index.html'], (req, res) => {
    const rows = db.all("SELECT slug, title, excerpt, published_at, category FROM articles WHERE status='published' AND published_at <= datetime('now') ORDER BY published_at DESC LIMIT 3");
    let html = landingTpl;
    if (rows.length) {
      const sec = `<section style="background:#070F1E;border-top:1px solid rgba(255,255,255,0.06)"><div style="max-width:1200px;margin:0 auto;padding:64px 24px">
<div style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:12px;margin-bottom:24px"><h2 style="margin:0;font-size:32px;font-weight:800">Artikel terbaru</h2><a href="/artikel" style="color:#E9C46A;font-weight:700;text-decoration:none">Lihat semua artikel →</a></div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">${rows.map((a) => `<a href="/artikel/${esc(a.slug)}" style="display:block;padding:22px;border-radius:18px;background:#0C1730;border:1px solid rgba(255,255,255,0.08);text-decoration:none;color:#E7ECF5">
<span style="font-size:12px;color:#E9C46A;font-weight:700;letter-spacing:.08em;text-transform:uppercase">${esc(a.category)}</span><h3 style="margin:10px 0 8px;font-size:19px;line-height:1.35">${esc(a.title)}</h3>
<p style="margin:0 0 10px;color:#A9B6CC;font-size:15px;line-height:1.6">${esc(a.excerpt || '')}</p><span style="font-size:13px;color:#8C9AB5">${fmtDate(a.published_at)}</span></a>`).join('')}</div></div></section>`;
      html = html.replace('<!-- FOOTER -->', sec + '\n  <!-- FOOTER -->');
    }
    res.type('html').send(html);
  });

  app.use(express.static(PUBLIC, { index: false, maxAge: '7d' }));
  app.use(require('./src/routes/public'));
  app.use(require('./src/routes/auth'));
  app.use(require('./src/routes/member'));
  app.use(require('./src/routes/admin'));
  app.use(require('./src/routes/features'));

  app.use((req, res) => res.status(404).send(layout({ title: 'Halaman tidak ditemukan', noindex: true, user: req.user,
    body: '<section class="narrow" style="padding:60px 20px;text-align:center"><h1>404</h1><p class="muted">Halaman tidak ditemukan.</p><a class="btn" href="/">Ke beranda</a> <a class="btn ghost" href="/artikel">Baca artikel</a></section>' })));
  app.use((err, req, res, next) => { console.error(err); res.status(500).send(layout({ title: 'Terjadi kesalahan', noindex: true, user: req.user,
    body: '<section class="narrow" style="padding:60px 20px"><h1>Maaf, terjadi kesalahan</h1><p class="muted">Silakan coba lagi sebentar.</p></section>' })); });

  app.listen(PORT, '127.0.0.1', () => console.log(`Doktor Trader listening on 127.0.0.1:${PORT}`));
  const bye = () => { db.saveNow(); process.exit(0); };
  process.on('SIGTERM', bye); process.on('SIGINT', bye);
}
main().catch((e) => { console.error(e); process.exit(1); });
