const express = require('express');
const db = require('../db');
const { layout, esc, md, fmtDate, plain, SITE } = require('../views');

const router = express.Router();
const PER_PAGE = 12;

const isoDate = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toISOString() : new Date().toISOString());
const readMin = (t) => Math.max(1, Math.round(String(t || '').split(/\s+/).length / 200));

function cta() {
  return `<div class="card" style="margin:36px 0;border-color:rgba(233,196,106,.35)"><h3 style="margin:0 0 6px">Belajar lebih terarah, gratis</h3>
<p class="muted" style="margin:0 0 14px">Academy, Tanya Doktor, EA, AI Signals, dan Copy Trade terbuka gratis untuk pemilik akun ${SITE.brokerName} yang dibuka lewat link resmi Doktor Trader.</p>
<div class="row"><a class="btn" href="/daftar">Daftar member gratis</a><a class="btn ghost" href="${esc(SITE.brokerUrl)}" target="_blank" rel="noopener sponsored">Buka akun ${SITE.brokerName}</a></div></div>`;
}

router.get('/artikel', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const cat = String(req.query.kategori || '');
  const where = "status = 'published' AND published_at <= datetime('now')" + (cat ? ' AND category = ?' : '');
  const params = cat ? [cat] : [];
  const total = db.get(`SELECT COUNT(*) n FROM articles WHERE ${where}`, params).n;
  const rows = db.all(`SELECT slug, title, excerpt, category, published_at, body_md FROM articles WHERE ${where} ORDER BY published_at DESC LIMIT ? OFFSET ?`, [...params, PER_PAGE, (page - 1) * PER_PAGE]);
  const cats = db.all("SELECT category, COUNT(*) n FROM articles WHERE status='published' GROUP BY category ORDER BY n DESC");
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const qs = (p) => `/artikel?${cat ? 'kategori=' + encodeURIComponent(cat) + '&' : ''}page=${p}`;
  res.send(layout({
    title: cat ? `Artikel ${cat}` : 'Artikel Edukasi Trading',
    description: 'Artikel edukasi trading forex dan emas dari Doktor Trader: manajemen risiko, analisa teknikal, psikologi trading, dan panduan untuk pemula.',
    canonical: SITE.url + (page > 1 || cat ? qs(page) : '/artikel'),
    noindex: page > 1 && false, user: req.user, active: 'artikel',
    body: `<section class="wrap" style="padding:40px 20px">
<h1>Artikel edukasi trading</h1><p class="muted" style="max-width:720px">Belajar trading dengan pengetahuan, bukan harapan instan. Artikel baru setiap hari seputar manajemen risiko, analisa, dan psikologi trading.</p>
<div class="row" style="margin:16px 0 24px"><a class="pill ${cat ? 'gray' : ''}" href="/artikel">Semua</a>${cats.map((c) => `<a class="pill ${cat === c.category ? '' : 'gray'}" href="/artikel?kategori=${encodeURIComponent(c.category)}">${esc(c.category)} (${c.n})</a>`).join('')}</div>
${rows.length ? `<div class="grid g3">${rows.map((a) => `<article class="card"><span class="pill">${esc(a.category)}</span>
<h2 style="font-size:19px;margin:12px 0 8px"><a href="/artikel/${esc(a.slug)}" style="color:var(--text);text-decoration:none">${esc(a.title)}</a></h2>
<p class="muted" style="font-size:15px;margin:0 0 10px">${esc(a.excerpt || plain(a.body_md, 150))}</p><span class="dim">${fmtDate(a.published_at)} · ${readMin(a.body_md)} menit baca</span></article>`).join('')}</div>` : '<p class="muted">Artikel segera hadir.</p>'}
${pages > 1 ? `<div class="row" style="margin-top:28px;justify-content:center">${page > 1 ? `<a class="btn ghost sm" href="${qs(page - 1)}" rel="prev">← Sebelumnya</a>` : ''}<span class="dim">Halaman ${page} dari ${pages}</span>${page < pages ? `<a class="btn ghost sm" href="${qs(page + 1)}" rel="next">Berikutnya →</a>` : ''}</div>` : ''}
${cta()}</section>`,
  }));
});

router.get('/artikel/rss.xml', (req, res) => {
  const rows = db.all("SELECT slug, title, excerpt, published_at FROM articles WHERE status='published' AND published_at <= datetime('now') ORDER BY published_at DESC LIMIT 30");
  const x = (s) => esc(s);
  res.type('application/rss+xml').send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Artikel ${SITE.name}</title><link>${SITE.url}/artikel</link><description>Edukasi trading dari ${SITE.author}</description><language>id</language>
${rows.map((a) => `<item><title>${x(a.title)}</title><link>${SITE.url}/artikel/${a.slug}</link><guid>${SITE.url}/artikel/${a.slug}</guid><pubDate>${new Date(isoDate(a.published_at)).toUTCString()}</pubDate><description>${x(a.excerpt || '')}</description></item>`).join('')}
</channel></rss>`);
});

router.get('/artikel/:slug', (req, res, next) => {
  const a = db.get("SELECT * FROM articles WHERE slug = ? AND status = 'published' AND published_at <= datetime('now')", [req.params.slug]);
  if (!a) return next();
  const related = db.all(`SELECT slug, title FROM articles WHERE status='published' AND published_at <= datetime('now') AND id != ?
    ORDER BY (category = ?) DESC, published_at DESC LIMIT 4`, [a.id, a.category]);
  const url = `${SITE.url}/artikel/${a.slug}`;
  const desc = a.meta_description || a.excerpt || plain(a.body_md, 155);
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: desc, inLanguage: 'id-ID',
    datePublished: isoDate(a.published_at), dateModified: isoDate(a.updated_at), mainEntityOfPage: url,
    author: { '@type': 'Person', name: SITE.author, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url, logo: { '@type': 'ImageObject', url: SITE.url + '/doktor-portrait.webp' } },
    image: SITE.url + '/doktor-portrait.webp', keywords: [a.focus_keyword, a.tags].filter(Boolean).join(', '),
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Artikel', item: SITE.url + '/artikel' },
      { '@type': 'ListItem', position: 3, name: a.title, item: url }],
  }];
  const head = `<meta property="og:type" content="article"><meta property="og:title" content="${esc(a.meta_title || a.title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${SITE.url}/doktor-portrait.webp"><meta property="og:locale" content="id_ID"><meta name="twitter:card" content="summary_large_image">
<meta property="article:published_time" content="${isoDate(a.published_at)}"><meta property="article:section" content="${esc(a.category)}">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`;
  res.send(layout({
    title: a.meta_title || a.title, description: desc, canonical: url, head, user: req.user, active: 'artikel',
    body: `<article class="narrow" style="padding:40px 20px">
<nav class="dim" aria-label="breadcrumb"><a href="/">Beranda</a> › <a href="/artikel">Artikel</a> › <a href="/artikel?kategori=${encodeURIComponent(a.category)}">${esc(a.category)}</a></nav>
<h1 style="margin-top:12px">${esc(a.title)}</h1>
<p class="dim">Oleh ${SITE.author} · ${fmtDate(a.published_at)} · ${readMin(a.body_md)} menit baca</p>
<div class="prose">${md(a.body_md)}</div>
<div class="alert" style="margin-top:28px;font-size:14px">Artikel ini bersifat edukasi, bukan ajakan atau rekomendasi transaksi. Trading memiliki risiko tinggi; gunakan hanya dana yang siap Anda tanggung risikonya.</div>
${cta()}
${related.length ? `<h2>Baca juga</h2><ul>${related.map((r) => `<li><a href="/artikel/${esc(r.slug)}">${esc(r.title)}</a></li>`).join('')}</ul>` : ''}
</article>`,
  }));
});

router.get('/sitemap.xml', (req, res) => {
  const rows = db.all("SELECT slug, updated_at, published_at FROM articles WHERE status='published' AND published_at <= datetime('now') ORDER BY published_at DESC");
  const urls = [
    { loc: SITE.url + '/', pri: '1.0', freq: 'weekly' },
    { loc: SITE.url + '/artikel', pri: '0.9', freq: 'daily' },
    { loc: SITE.url + '/daftar', pri: '0.5', freq: 'monthly' },
    ...rows.map((a) => ({ loc: `${SITE.url}/artikel/${a.slug}`, mod: isoDate(a.updated_at || a.published_at).slice(0, 10), pri: '0.7', freq: 'monthly' })),
  ];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${esc(u.loc)}</loc>${u.mod ? `<lastmod>${u.mod}</lastmod>` : ''}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}\n</urlset>`);
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /member\nDisallow: /masuk\nDisallow: /keluar\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
});

module.exports = router;
