const express = require('express');
const db = require('../db');
const { layout, esc, md, fmtDate, plain, SITE, DISCLOSURE, authorBox, TG_ICON } = require('../views');
const og = require('../og');

const router = express.Router();
const PER_PAGE = 12;

const isoDate = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toISOString() : new Date().toISOString());
const readMin = (t) => Math.max(1, Math.round(String(t || '').split(/\s+/).length / 200));

function cta() {
  return `<div class="card" style="margin:36px 0;border-color:rgba(233,196,106,.35)"><h3 style="margin:0 0 6px">Belajar lebih terarah, gratis</h3>
<p class="muted" style="margin:0 0 14px">Academy, Tanya Doktor (asisten AI), Analisa Doktor, Market Watch, EA, AI Signals, materi Copy Trade, dan webinar bulanan gratis untuk pemilik akun ${SITE.brokerName} yang dibuka lewat link resmi Doktor Trader. Tanpa biaya langganan; syaratnya membuka dan memverifikasi akun trading di ${SITE.brokerName}.</p>
<div class="row"><a class="btn" href="/daftar">Daftar member gratis</a><a class="btn ghost" href="${esc(SITE.brokerUrl)}" target="_blank" rel="noopener sponsored">Buka akun ${SITE.brokerName}</a></div>
<p class="dim" style="margin:12px 0 0;font-size:12px">${DISCLOSURE} ${SITE.brokerEntity}: ${SITE.brokerLicense}. Trading berisiko tinggi.</p></div>`;
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
    noindex: false, user: req.user, active: 'artikel',
    head: `<meta property="og:type" content="website"><meta property="og:title" content="Artikel Edukasi Trading | Doktor Trader"><meta property="og:url" content="${SITE.url}/artikel">
<meta property="og:image" content="${og.available() ? SITE.url + '/og/page/artikel.png' : SITE.url + '/doktor-portrait.webp'}"><meta name="twitter:card" content="summary_large_image">`,
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
  // Related: same category and shared tags/title words score highest.
  const words = (t) => new Set(String(t || '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3));
  const aw = words(a.title + ' ' + a.tags + ' ' + a.focus_keyword);
  const related = db.all(`SELECT slug, title, category, tags, focus_keyword FROM articles WHERE status='published' AND published_at <= datetime('now') AND id != ?
    ORDER BY published_at DESC LIMIT 80`, [a.id])
    .map((r) => ({ ...r, score: (r.category === a.category ? 3 : 0) + [...words(r.title + ' ' + r.tags + ' ' + r.focus_keyword)].filter((w) => aw.has(w)).length }))
    .sort((x, y) => y.score - x.score).slice(0, 4);
  const url = `${SITE.url}/artikel/${a.slug}`;
  const ogImg = og.available() ? `${SITE.url}/og/artikel/${a.slug}.png?v=${a.src_rev || 1}` : SITE.url + '/doktor-portrait.webp';
  const desc = a.meta_description || a.excerpt || plain(a.body_md, 155);
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: desc, inLanguage: 'id-ID',
    datePublished: isoDate(a.published_at), dateModified: isoDate(a.updated_at), mainEntityOfPage: url,
    author: { '@type': 'Person', '@id': SITE.url + '/#dhiraj', name: 'Dhiraj Kelly Sawlani', alternateName: SITE.author, url: SITE.url + '/#tentang',
      sameAs: ['https://www.linkedin.com/in/dhirajkelly', 'https://www.instagram.com/dhirajkelly', 'https://www.tiktok.com/@dhirajkelly', 'https://www.youtube.com/@dhirajkelly', SITE.telegram],
      hasCredential: { '@type': 'EducationalOccupationalCredential', name: SITE.cert.title, credentialCategory: 'Sertifikat Kompetensi', identifier: SITE.cert.reg,
        recognizedBy: { '@type': 'Organization', name: 'Badan Nasional Sertifikasi Profesi (BNSP)' } } },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url, logo: { '@type': 'ImageObject', url: SITE.url + '/logo-512.png' }, sameAs: [SITE.telegram] },
    image: ogImg, keywords: [a.focus_keyword, a.tags].filter(Boolean).join(', '),
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Artikel', item: SITE.url + '/artikel' },
      { '@type': 'ListItem', position: 3, name: a.title, item: url }],
  }];
  const head = `<meta property="og:type" content="article"><meta property="og:title" content="${esc(a.meta_title || a.title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(ogImg)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(a.title)}"><meta name="twitter:card" content="summary_large_image">
<meta property="article:published_time" content="${isoDate(a.published_at)}"><meta property="article:modified_time" content="${isoDate(a.updated_at)}"><meta property="article:author" content="${SITE.author}"><meta property="article:section" content="${esc(a.category)}">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`;
  res.send(layout({
    title: a.meta_title || a.title, description: desc, canonical: url, head, user: req.user, active: 'artikel',
    body: `<article class="narrow" style="padding:40px 20px">
<nav class="dim" aria-label="breadcrumb"><a href="/">Beranda</a> › <a href="/artikel">Artikel</a> › <a href="/artikel?kategori=${encodeURIComponent(a.category)}">${esc(a.category)}</a></nav>
<h1 style="margin-top:12px">${esc(a.title)}</h1>
<p class="dim">Oleh <a href="#penulis">${SITE.author}</a> · ${fmtDate(a.published_at)}${a.updated_at && fmtDate(a.updated_at) !== fmtDate(a.published_at) && a.updated_at > a.published_at ? ` · diperbarui ${fmtDate(a.updated_at)}` : ''} · ${readMin(a.body_md)} menit baca</p>
<div class="prose">${md(a.body_md)}</div>
<div class="alert" style="margin-top:28px;font-size:14px">Artikel ini bersifat edukasi, bukan ajakan atau rekomendasi transaksi. Trading memiliki risiko tinggi; gunakan hanya dana yang siap Anda tanggung risikonya.</div>
${cta()}
<p class="tgline">${TG_ICON(16)} Dapat XAUUSD plan harian di Telegram: <a href="${SITE.telegram}" target="_blank" rel="noopener" data-track="telegram"><strong>t.me/doktortrader_id</strong></a></p>
<div id="penulis">${authorBox()}</div>
${related.length ? `<h2>Baca juga</h2><ul>${related.map((r) => `<li><a href="/artikel/${esc(r.slug)}">${esc(r.title)}</a></li>`).join('')}</ul>` : ''}
</article>`,
  }));
});

// Free position-size calculator (linkable asset for SEO). Runs fully client-side.
router.get('/alat/kalkulator-lot', (req, res) => {
  const url = `${SITE.url}/alat/kalkulator-lot`;
  const desc = 'Kalkulator lot gratis untuk XAUUSD, EURUSD, GBPUSD, dan USDJPY: hitung ukuran posisi dari modal, persentase risiko, dan jarak stop loss.';
  const jsonld = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Kalkulator Lot Doktor Trader', url, description: desc,
    applicationCategory: 'FinanceApplication', operatingSystem: 'Any', inLanguage: 'id-ID', offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
    author: { '@type': 'Person', name: SITE.author, url: SITE.url } };
  const head = `<meta property="og:type" content="website"><meta property="og:title" content="Kalkulator Lot Trading Gratis"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${og.available() ? SITE.url + '/og/page/kalkulator-lot.png' : SITE.url + '/doktor-portrait.webp'}"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`;
  const dd = [10, 20, 30, 40, 50, 60, 75, 90];
  res.send(layout({
    title: 'Kalkulator Lot Trading Gratis (XAUUSD & Forex)', description: desc, canonical: url, head, user: req.user, active: 'alat',
    body: `<section class="narrow" style="padding:40px 20px">
<nav class="dim" aria-label="breadcrumb"><a href="/">Beranda</a> › Alat › Kalkulator Lot</nav>
<h1 style="margin-top:12px">Kalkulator lot trading</h1>
<p class="muted">Tentukan ukuran posisi dari risiko, bukan dari perasaan. Masukkan modal, persentase risiko per posisi, dan jarak stop loss; kalkulator menghitung lot maksimal agar kerugian tidak melewati batas yang Anda tetapkan.</p>
<form class="card f" id="calc" onsubmit="return false" style="margin:20px 0">
<div class="grid g2">
<div><label for="sym">Instrumen</label><select id="sym"><option value="XAUUSD">XAUUSD (emas)</option><option value="EURUSD">EURUSD</option><option value="GBPUSD">GBPUSD</option><option value="USDJPY">USDJPY</option></select></div>
<div><label for="bal">Modal akun (USD)</label><input id="bal" type="number" min="0" step="any" value="1000" inputmode="decimal"></div>
<div><label for="risk">Risiko per posisi (%)</label><input id="risk" type="number" min="0" max="100" step="0.1" value="1" inputmode="decimal"></div>
<div><label for="sl" id="sllab">Jarak stop loss (USD per ons)</label><input id="sl" type="number" min="0" step="any" value="5" inputmode="decimal"></div>
<div id="pxwrap" hidden><label for="px">Harga USDJPY saat ini</label><input id="px" type="number" min="0" step="any" value="150" inputmode="decimal"></div>
</div>
<div class="card" style="background:var(--bg2);margin-top:6px" aria-live="polite">
<div class="spread"><span class="muted">Risiko dalam dolar</span><span class="stat" id="oRisk">-</span></div>
<div class="spread"><span class="muted">Ukuran lot maksimal</span><span class="stat" style="color:var(--gold)" id="oLot">-</span></div>
<div class="spread"><span class="muted">Rugi jika stop loss kena</span><span id="oLoss">-</span></div>
<p class="dim" id="oNote" style="margin:8px 0 0"></p>
</div>
</form>
<div class="prose">
<h2>Cara kerja kalkulator</h2>
<p><strong>Lot = Risiko dalam dolar ÷ (Jarak stop loss × Nilai per lot)</strong>. Hasil dibulatkan ke bawah ke 0,01 lot agar risiko tidak melebihi batas.</p>
<ul><li>XAUUSD: 1 lot standar = 100 ons, jadi pergerakan $1 = $100 per lot.</li><li>EURUSD dan GBPUSD: 1 pip = $10 per lot standar.</li><li>USDJPY: nilai 1 pip per lot ≈ 1.000 ÷ harga USDJPY (dalam USD).</li></ul>
<p>Spesifikasi kontrak bisa berbeda antar jenis akun. Selalu cek contract size di MT4/MT5 Anda. Penjelasan lengkapnya ada di artikel <a href="/artikel/cara-menghitung-lot-xauusd">cara menghitung lot XAUUSD</a>.</p>
<h2>Tabel pemulihan drawdown</h2>
<p>Semakin besar risiko per posisi, semakin dalam drawdown saat kalah beruntun, dan semakin berat jalan pulangnya.</p>
<div class="tablewrap"><table><thead><tr><th>Drawdown</th><th>Kenaikan untuk balik modal</th></tr></thead><tbody>${dd.map((d) => `<tr><td>${d}%</td><td>${(d / (100 - d) * 100).toFixed(1).replace('.', ',').replace(',0', '')}%</td></tr>`).join('')}</tbody></table></div>
<p>Baca juga: <a href="/artikel/rumus-drawdown-trading">rumus drawdown trading</a>.</p>
</div>
<div class="alert" style="margin-top:28px;font-size:14px">Kalkulator ini alat bantu edukasi, bukan rekomendasi transaksi. Hasil bisa berbeda karena spread, slippage, dan spesifikasi kontrak pialang Anda.</div>
${cta()}
</section>
<script>
(function(){var $=function(i){return document.getElementById(i)};
function fmt(n,d){return n.toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d})}
function calc(){var s=$('sym').value,bal=+$('bal').value,r=+$('risk').value,sl=+$('sl').value,px=+$('px').value;
$('pxwrap').hidden=s!=='USDJPY';$('sllab').textContent=s==='XAUUSD'?'Jarak stop loss (USD per ons)':'Jarak stop loss (pip)';
var per=s==='XAUUSD'?100:s==='USDJPY'?(px>0?1000/px:0):10;var risk=bal*r/100;
if(!(bal>0&&r>0&&sl>0&&per>0)){$('oRisk').textContent='-';$('oLot').textContent='-';$('oLoss').textContent='-';$('oNote').textContent='Isi semua kolom dengan angka lebih dari nol.';return}
var lot=Math.floor(risk/(sl*per)*100+1e-9)/100;$('oRisk').textContent='$'+fmt(risk,2);$('oLot').textContent=fmt(lot,2)+' lot';
$('oLoss').textContent='$'+fmt(lot*sl*per,2);$('oNote').textContent=lot<0.01?'Lot di bawah 0,01: perlebar modal, kecilkan jarak SL dengan alasan teknikal yang valid, atau lewati trade ini.':(r>2?'Risiko di atas 2% per posisi membuat drawdown cepat dalam saat kalah beruntun.':'');}
['sym','bal','risk','sl','px'].forEach(function(i){$(i).addEventListener('input',calc)});calc();})();
</script>`,
  }));
});

const SITE_UPDATED = '2026-11-18';   // bump when static pages change
const LEGAL_UPDATED = '2026-11-18';

// ---------- Open Graph images ----------
const PAGE_OG = {
  home: { title: 'Belajar Trading & Manajemen Risiko Gratis bersama Dr. Dhiraj Kelly', kicker: 'Doktor Trader' },
  'kalkulator-lot': { title: 'Kalkulator Lot Trading Gratis untuk XAUUSD & Forex', kicker: 'Alat gratis' },
  artikel: { title: 'Artikel Edukasi Trading: Risiko, Analisa, Psikologi', kicker: 'Artikel' },
};
function sendPng(res, png) {
  if (!png) return res.redirect(302, '/doktor-portrait.webp');
  res.set('Cache-Control', 'public, max-age=86400').type('png').send(png);
}
router.get('/og/page/:key.png', (req, res, next) => {
  const p = PAGE_OG[req.params.key];
  if (!p) return next();
  sendPng(res, og.render('page:' + req.params.key, p));
});
router.get('/og/artikel/:slug.png', (req, res, next) => {
  const a = db.get("SELECT slug, title, category, src_rev, updated_at FROM articles WHERE slug = ? AND status='published'", [req.params.slug]);
  if (!a) return next();
  sendPng(res, og.render(`a:${a.slug}:${a.updated_at}`, { title: a.title, kicker: a.category }));
});

// ---------- Legal pages ----------
function legalPage(req, res, { slug, title, description, html }) {
  res.send(layout({ title, description, canonical: `${SITE.url}/${slug}`, user: req.user,
    body: `<article class="narrow" style="padding:40px 20px"><nav class="dim" aria-label="breadcrumb"><a href="/">Beranda</a> › ${esc(title)}</nav>
<h1 style="margin-top:12px">${esc(title)}</h1><p class="dim">Berlaku sejak 18 November 2026 · terakhir diperbarui ${fmtDate(LEGAL_UPDATED)}</p><div class="prose">${html}</div></article>` }));
}
router.get('/kebijakan-privasi', (req, res) => legalPage(req, res, require('../legal').privacy()));
router.get('/syarat-ketentuan', (req, res) => legalPage(req, res, require('../legal').terms()));

router.get('/sitemap.xml', (req, res) => {
  const rows = db.all("SELECT slug, updated_at, published_at FROM articles WHERE status='published' AND published_at <= datetime('now') ORDER BY published_at DESC");
  const latest = rows.length ? isoDate(rows[0].published_at).slice(0, 10) : SITE_UPDATED;
  const urls = [
    { loc: SITE.url + '/', mod: latest, pri: '1.0', freq: 'daily' },
    { loc: SITE.url + '/artikel', mod: latest, pri: '0.9', freq: 'daily' },
    { loc: SITE.url + '/alat/kalkulator-lot', mod: SITE_UPDATED, pri: '0.8', freq: 'monthly' },
    { loc: SITE.url + '/syarat-ketentuan', mod: LEGAL_UPDATED, pri: '0.3', freq: 'yearly' },
    { loc: SITE.url + '/kebijakan-privasi', mod: LEGAL_UPDATED, pri: '0.3', freq: 'yearly' },
    ...rows.map((a) => ({ loc: `${SITE.url}/artikel/${a.slug}`, mod: isoDate(a.updated_at || a.published_at).slice(0, 10), pri: '0.7', freq: 'monthly' })),
  ];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${esc(u.loc)}</loc>${u.mod ? `<lastmod>${u.mod}</lastmod>` : ''}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}\n</urlset>`);
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /member\nDisallow: /masuk\nDisallow: /keluar\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
});

module.exports = router;
