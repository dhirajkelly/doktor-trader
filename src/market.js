// Market Watch: widget gratis TradingView, dipakai bersama oleh /member/market dan homepage.
// Data bisa tertunda; tidak menyimpan data pengunjung.
// Ukuran widget: market-overview & events memakai tinggi piksel di config (widget menghitung tata letaknya sendiri,
// tidak terpotong oleh container). Advanced chart memakai autosize di container dengan tinggi responsif (.tv-chart).
const tvWidget = (name, cfg, cls = '') => `<div class="tradingview-widget-container ${cls}" style="width:100%;border-radius:12px;overflow:hidden${typeof cfg.height === 'number' ? `;min-height:${cfg.height}px` : ''}"><div class="tradingview-widget-container__widget" style="width:100%;height:100%"></div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-${name}.js" async>${JSON.stringify(cfg)}</script></div>`;
const TV_CSS = '<style>.tv-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start;margin-top:16px}.tv-chart{height:clamp(420px,70vh,640px)}</style>';

const overview = {
  colorTheme: 'dark', dateRange: '1D', showChart: true, locale: 'id', isTransparent: true, showSymbolLogo: true, showFloatingTooltip: false, width: '100%', height: 660,
  tabs: [
    { title: 'Emas & Komoditas', symbols: [{ s: 'OANDA:XAUUSD', d: 'Emas (XAUUSD)' }, { s: 'OANDA:XAGUSD', d: 'Perak (XAGUSD)' }, { s: 'TVC:USOIL', d: 'Minyak WTI' }] },
    { title: 'Forex', symbols: [{ s: 'FX:EURUSD', d: 'EUR/USD' }, { s: 'FX:GBPUSD', d: 'GBP/USD' }, { s: 'FX:USDJPY', d: 'USD/JPY' }, { s: 'FX_IDC:USDIDR', d: 'USD/IDR' }, { s: 'TVC:DXY', d: 'Indeks Dolar (DXY)' }] },
    { title: 'Indeks Saham', symbols: [{ s: 'IDX:COMPOSITE', d: 'IHSG' }, { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' }, { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' }, { s: 'INDEX:NKY', d: 'Nikkei 225' }] },
  ],
};
const chart = { autosize: true, symbol: 'OANDA:XAUUSD', interval: '60', timezone: 'Asia/Jakarta', theme: 'dark', style: '1', locale: 'id', allow_symbol_change: true, hide_side_toolbar: false, support_host: 'https://www.tradingview.com' };
const cal = { colorTheme: 'dark', isTransparent: true, width: '100%', height: 600, locale: 'id', importanceFilter: '0,1', countryFilter: 'us,eu,gb,jp,cn,id' };

// cardStyle: gaya kartu pembungkus (member area pakai class .card; homepage pakai inline style landing).
function widgets(cardAttr = 'class="card" style="padding:10px"', calNoteAttr = 'class="dim" style="padding:6px 6px 2px"') {
  const chartAttr = cardAttr.replace(/style="/, 'style="margin-top:18px;');
  return `${TV_CSS}<div class="tv-grid"><div ${cardAttr}>${tvWidget('market-overview', overview)}</div>
<div ${cardAttr}>${tvWidget('events', cal)}<div ${calNoteAttr}>Kalender ekonomi (dampak sedang–tinggi). Hati-hati posisi saat rilis data besar.</div></div></div>
<div ${chartAttr}>${tvWidget('advanced-chart', chart, 'tv-chart')}</div>`;
}

// Section untuk homepage (gaya landing di public/index.html): cuplikan chart XAUUSD saja,
// Market Watch lengkap (ringkasan market + kalender ekonomi + chart) tetap khusus member di /member/market.
function landingSection() {
  const teaser = { ...chart, allow_symbol_change: false, hide_side_toolbar: true };
  const lock = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
  return `<section id="market" style="max-width:1200px;margin:0 auto;padding:96px 24px 24px">
${TV_CSS}<span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#5FD3A6;letter-spacing:0.14em">MARKET WATCH · CUPLIKAN</span>
<h2 style="margin:14px 0 12px;font-size:clamp(30px,3.6vw,46px);line-height:1.12;font-weight:800;letter-spacing:-0.01em">Chart emas (XAUUSD) langsung dari sini.</h2>
<p style="margin:0 0 20px;font-size:17px;line-height:1.6;color:#A9B6CC;max-width:720px">Ini cuplikan Market Watch Doktor Trader. Data dari TradingView dan bisa tertunda; bukan sinyal transaksi.</p>
<div style="padding:10px;border:1px solid rgba(255,255,255,0.08);background:#0C1730;border-radius:22px">${tvWidget('advanced-chart', teaser, 'tv-chart')}</div>
<div style="margin-top:18px;padding:24px;border:1px solid rgba(233,196,106,0.25);background:linear-gradient(180deg,#14203F,#0C1730);border-radius:22px;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between">
<div style="max-width:640px"><span style="display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:800;letter-spacing:0.12em;color:#E9C46A">${lock} KHUSUS MEMBER</span>
<p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#C5CFE0">Market Watch lengkap: ringkasan emas, perak, minyak, pair forex utama, DXY, IHSG &amp; indeks global, kalender ekonomi dampak sedang–tinggi, dan chart yang simbolnya bisa kamu ganti sendiri.</p></div>
<div style="display:flex;flex-wrap:wrap;gap:10px"><a href="/member/market" style="display:inline-block;padding:13px 20px;border-radius:12px;background:#E9C46A;color:#070F1E;font-weight:800;text-decoration:none">Buka Market Watch lengkap</a>
<a href="/daftar" style="display:inline-block;padding:13px 20px;border-radius:12px;border:1px solid rgba(255,255,255,0.18);color:#E7ECF5;font-weight:700;text-decoration:none">Belum member? Daftar gratis</a></div></div>
<p style="margin:12px 0 0;font-size:14px;color:#8C9AB5">Widget chart oleh <a href="https://id.tradingview.com/" target="_blank" rel="noopener nofollow" style="color:#E9C46A">TradingView</a>.</p>
</section>`;
}

module.exports = { tvWidget, TV_CSS, widgets, landingSection };
