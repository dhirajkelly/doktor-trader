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

// Section untuk homepage (gaya landing di public/index.html).
function landingSection() {
  const card = 'style="padding:10px;border:1px solid rgba(255,255,255,0.08);background:#071A33;border-radius:12px"';
  return `<section id="market" style="max-width:1180px;margin:0 auto;padding:72px 24px 24px">
<span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#5BE3EE;letter-spacing:0.16em">MARKET WATCH · LIVE</span>
<h2 style="margin:14px 0 12px;font-family:'Fira Sans',sans-serif;text-transform:uppercase;font-size:clamp(24px,2.6vw,32px);line-height:1.12;font-weight:800">Pantau market langsung dari sini</h2>
<p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#9DB0C8;max-width:720px">Emas, pair forex utama, indeks saham, dan kalender ekonomi dalam satu layar. Ganti simbol di chart untuk instrumen favoritmu. Data dari TradingView dan bisa tertunda; bukan sinyal transaksi.</p>
${widgets(card, 'style="padding:6px 6px 2px;font-size:14px;color:#8C9AB5"')}
<p style="margin:12px 0 0;font-size:14px;color:#8C9AB5">Widget pasar oleh <a href="https://id.tradingview.com/" target="_blank" rel="noopener nofollow" style="color:#5BE3EE">TradingView</a>.</p>
</section>`;
}

module.exports = { tvWidget, TV_CSS, widgets, landingSection };
