const { marked } = require('marked');

const SITE = {
  name: 'Doktor Trader',
  url: (process.env.SITE_URL || 'https://dhirajkelly.id').replace(/\/$/, ''),
  author: 'Dr. Dhiraj Kelly',
  brokerName: 'Dupoin',
  brokerUrl: process.env.BROKER_URL || 'https://i.dupoin.vip/gSgaysBeR',
  whatsapp: process.env.WHATSAPP || '628111282991',
  // Partner broker's legal entity (verified on dupoin.co.id/about-us/licenses, Nov 2026)
  brokerEntity: 'PT Dupoin Futures Indonesia',
  brokerLicense: 'Izin Bappebti No. 423/BAPPEBTI/SI/VII/2004 · Anggota JFX No. SPAB-064/BBJ/04/04',
  // Author's competency certificate (BNSP). This is a competency certificate, not a Bappebti business licence.
  cert: {
    title: 'Sertifikat Kompetensi BNSP: Wakil Penasihat Berjangka',
    field: 'Perdagangan Berjangka Komoditi',
    number: '66173 1120 6 0001519 2025',
    reg: 'WPA.002.00073 2025',
    issuer: 'LSP Perdagangan Berjangka Komoditi (LSP PBK)',
    issued: '30 September 2025',
    validUntil: 'September 2028',
  },
  // Other credentials shown on the landing page (Tentang Doktor).
  credentials: [
    'Izin Wakil Manajer Investasi (WMI) OJK No. KEP-570/PM.112/WMI/TTE/2026, berlaku s.d. 31 Mei 2029',
    'Sertifikat Kompetensi BNSP Certified Technical Analyst (CTA), LSP Pasar Modal, No. 66123 2413 0027687 2026',
    'Sertifikat Kompetensi BNSP Jenjang 5 Pasar Modal, Pengelolaan Investasi, No. 66301 2412 5 0028048 2026',
  ],
};

const DISCLOSURE = `Pengungkapan: Doktor Trader adalah mitra referral ${SITE.brokerName} (${SITE.brokerEntity}). Jika Anda membuka akun lewat link kami, kami dapat menerima komisi dari ${SITE.brokerName} tanpa biaya tambahan untuk Anda.`;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Markdown → HTML. Raw HTML inside markdown is escaped, links get safe attributes.
const renderer = new marked.Renderer();
renderer.html = (token) => esc(typeof token === 'string' ? token : token.text || '');
renderer.link = function (token) {
  const href = typeof token === 'object' ? token.href : arguments[0];
  const title = typeof token === 'object' ? token.title : arguments[1];
  const text = typeof token === 'object' ? this.parser.parseInline(token.tokens) : arguments[2];
  if (!/^(https?:|\/|#|mailto:)/i.test(href || '')) return text;
  const ext = /^https?:/i.test(href) && !href.startsWith(SITE.url);
  return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' target="_blank" rel="noopener nofollow"' : ''}>${text}</a>`;
};
marked.use({ renderer, gfm: true, breaks: false });
function md(src) { return marked.parse(String(src || '')); }

function plain(mdText, n = 160) {
  const t = String(mdText || '').replace(/[#>*_`\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'artikel';
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T') + (iso.length <= 19 ? 'Z' : ''));
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
}

const CSS = `
:root{--bg:#070F1E;--bg2:#0B1630;--card:#0F1C38;--line:rgba(255,255,255,.09);--text:#E7ECF5;--muted:#A9B6CC;--dim:#8C9AB5;--gold:#E9C46A;--green:#5FD3A6;--red:#F08A7E}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',system-ui,sans-serif;line-height:1.6;font-size:16px}
a{color:var(--gold)}img{max-width:100%;height:auto}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
.narrow{max-width:760px;margin:0 auto;padding:0 20px}
header.top{position:sticky;top:0;z-index:20;background:rgba(7,15,30,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
header.top nav{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;max-width:1100px;margin:0 auto}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);font-weight:800;letter-spacing:.04em}
.brand b{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--gold);color:#0B1630;font-size:14px}
.navl{display:flex;gap:18px;align-items:center;font-size:14px;flex-wrap:wrap}
.navl a{color:var(--muted);text-decoration:none}.navl a:hover,.navl a.on{color:var(--text)}
.navl a.btn{color:#0B1630}@media(max-width:520px){.navl a.hs{display:none}}.navl a.btn:hover{color:#0B1630;filter:brightness(1.05)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;border-radius:12px;border:0;background:var(--gold);color:#0B1630;font-weight:800;font-size:15px;font-family:inherit;text-decoration:none;cursor:pointer}
.btn.ghost{background:transparent;border:1px solid rgba(233,196,106,.5);color:var(--gold)}
.btn.sm{min-height:34px;padding:0 12px;font-size:13px;border-radius:9px}
.btn.red{background:var(--red)}.btn.green{background:var(--green)}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px}
.grid{display:grid;gap:16px}.g2{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.g3{grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
h1,h2,h3{line-height:1.25;margin:0 0 .5em}h1{font-size:clamp(26px,4vw,40px)}h2{font-size:clamp(20px,3vw,28px)}
.muted{color:var(--muted)}.dim{color:var(--dim);font-size:14px}
.pill{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(233,196,106,.14);color:var(--gold)}
.pill.ok{background:rgba(95,211,166,.15);color:var(--green)}.pill.bad{background:rgba(240,138,126,.15);color:var(--red)}.pill.gray{background:rgba(255,255,255,.08);color:var(--muted)}
form.f{display:grid;gap:12px}
label{font-size:13px;font-weight:700;color:#C5CFE0}
input,select,textarea{width:100%;min-height:46px;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:var(--bg2);color:var(--text);font-size:15px;font-family:inherit}
textarea{min-height:140px;line-height:1.6}
textarea.code{font-family:ui-monospace,Menlo,monospace;font-size:14px;min-height:380px}
.alert{padding:12px 16px;border-radius:12px;background:rgba(233,196,106,.12);border:1px solid rgba(233,196,106,.35);margin:0 0 16px}
.alert.ok{background:rgba(95,211,166,.12);border-color:rgba(95,211,166,.4)}
.alert.bad{background:rgba(240,138,126,.12);border-color:rgba(240,138,126,.4)}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--dim);font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
.tablewrap{overflow-x:auto}
.prose{font-size:17px;line-height:1.8}.prose h2{margin-top:1.6em}.prose h3{margin-top:1.3em}
.prose p,.prose ul,.prose ol{margin:0 0 1em}.prose blockquote{margin:1em 0;padding:4px 18px;border-left:3px solid var(--gold);color:var(--muted)}
.prose table{margin:1em 0}.prose code{background:var(--bg2);padding:2px 6px;border-radius:6px}
.bar{height:8px;border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden}.bar i{display:block;height:100%;background:var(--gold)}
.side{display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:start}
.side aside a{display:block;padding:9px 12px;border-radius:10px;color:var(--muted);text-decoration:none;font-size:14px}
.side aside a.on,.side aside a:hover{background:var(--card);color:var(--text)}
@media(max-width:820px){.side{grid-template-columns:1fr}.side aside{display:flex;gap:6px;overflow-x:auto}.side aside a{white-space:nowrap}}
footer.bot{border-top:1px solid var(--line);margin-top:60px;padding:30px 0;color:var(--dim);font-size:12px;line-height:1.7}
.stat{font-size:28px;font-weight:800}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.spread{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
`;

const RISK = 'Peringatan risiko: Trading forex, emas, dan instrumen berjangka memiliki risiko tinggi dan dapat mengakibatkan kehilangan sebagian atau seluruh modal. Seluruh konten Doktor Trader bersifat edukasi, bukan ajakan atau rekomendasi transaksi. Kinerja masa lalu tidak menjamin hasil di masa depan.';

// First-party click tracking: broker links, WhatsApp links and anything with data-track.
// Sends only the event name and page path; no personal data, no cookies beyond the existing session.
const TRACK_JS = `(function(){function ev(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'',t=a.getAttribute('data-track');
if(!t){if(/dupoin\\./i.test(h))t='broker_click';else if(/wa\\.me\\//i.test(h))t='wa_click';else if(/^\\/daftar/.test(h))t='daftar_click';}
if(!t)return;try{navigator.sendBeacon('/t',new Blob([JSON.stringify({e:t,p:location.pathname})],{type:'application/json'}))}catch(_){}}
document.addEventListener('click',ev,true);})();`;

function authorBox() {
  const c = SITE.cert;
  return `<aside class="card" style="margin:32px 0;display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
<img src="/doktor-portrait.webp" alt="${SITE.author}" width="72" height="72" loading="lazy" style="width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:top;background:var(--bg2)">
<div style="flex:1;min-width:220px"><div class="dim">Ditulis oleh</div><strong>${SITE.author} (Dhiraj Kelly Sawlani)</strong>
<p class="muted" style="margin:6px 0;font-size:15px">Margin call survivor yang kini fokus mengajar manajemen risiko. Trader XAUUSD, pebisnis, dan akademisi (DRM BINUS, LL.M. IBLAM, kandidat doktor Unhan RI).</p>
<ul class="dim" style="margin:0;padding-left:18px">${SITE.credentials.map((x) => `<li>${x}</li>`).join('')}<li>${c.title} (${c.field}), No. ${c.number}, No. Reg. ${c.reg}, ${c.issuer}, ${c.issued}, berlaku hingga ${c.validUntil}</li></ul>
<p class="dim" style="margin:6px 0 0"><a href="/#tentang">Lihat dokumen sertifikat dan izin</a></p></div></aside>`;
}

function layout({ title, description = '', body, user = null, canonical = '', head = '', noindex = false, active = '' }) {
  const fullTitle = title ? (title.includes(SITE.name) ? title : `${title} | ${SITE.name}`) : `${SITE.name} — Belajar Trading Gratis bersama ${SITE.author}`;
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' class="on"' : ''}>${label}</a>`;
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
${description ? `<meta name="description" content="${esc(description)}">` : ''}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
${noindex ? '<meta name="robots" content="noindex,nofollow">' : ''}
<meta name="theme-color" content="#070F1E">
<meta property="og:site_name" content="${SITE.name}"><meta property="og:locale" content="id_ID">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="alternate" type="application/rss+xml" title="Artikel ${SITE.name}" href="/artikel/rss.xml">
<style>${CSS}</style>${head}</head><body>
<header class="top"><nav>
<a class="brand" href="/"><b>DT</b>DOKTOR TRADER</a>
<div class="navl">
${link('/artikel', 'Artikel', 'artikel')}
${link('/alat/kalkulator-lot', 'Kalkulator Lot', 'alat').replace('<a ', '<a class="hs" ').replace('class="hs" href="/alat/kalkulator-lot" class="on"', 'class="hs on" href="/alat/kalkulator-lot"')}
${user ? (user.role === 'admin' ? link('/admin', 'Admin', 'admin') : '') + link('/member', 'Member', 'member') : link('/masuk', 'Masuk', 'masuk')}
${user ? `<form method="post" action="/keluar" style="display:inline"><input type="hidden" name="_csrf" value="${esc(user._csrf || '')}"><button class="btn sm ghost" type="submit">Keluar</button></form>` : '<a class="btn sm" href="/daftar">Daftar Gratis</a>'}
</div></nav></header>
<main>${body}</main>
<footer class="bot"><div class="wrap"><p>${RISK} ${DISCLOSURE} Pembukaan akun dan transaksi tunduk pada syarat dan ketentuan ${SITE.brokerName} serta regulasi yang berlaku. ${SITE.brokerEntity}: ${SITE.brokerLicense}.</p>
<p>Penulis: ${SITE.author}, pemegang izin Wakil Manajer Investasi (WMI) OJK, sertifikat kompetensi BNSP CTA, dan ${SITE.cert.title} (No. Reg. ${SITE.cert.reg}). Doktor Trader adalah layanan edukasi; konten di situs ini bukan nasihat investasi pribadi atau jasa pengelolaan dana.</p>
<p>© ${new Date().getFullYear()} ${SITE.author} · <a href="/">dhirajkelly.id</a> · <a href="/artikel">Artikel</a> · <a href="/alat/kalkulator-lot">Kalkulator Lot</a> · <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a> · <a href="/kebijakan-privasi">Kebijakan Privasi</a> · <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" data-track="wa_click">WhatsApp</a></p></div></footer>
<script>${TRACK_JS}</script>
</body></html>`;
}

function sideNav(items, active) {
  return `<aside>${items.map(([href, label, key]) => `<a href="${href}"${key === active ? ' class="on"' : ''}>${label}</a>`).join('')}</aside>`;
}

function flash(msg, kind = '') {
  return msg ? `<div class="alert ${kind}">${esc(msg)}</div>` : '';
}

function csrfField(csrf) {
  return `<input type="hidden" name="_csrf" value="${esc(csrf)}">`;
}

module.exports = { SITE, DISCLOSURE, authorBox, esc, md, plain, slugify, fmtDate, layout, sideNav, flash, csrfField, RISK };
