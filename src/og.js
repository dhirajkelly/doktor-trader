// Open Graph images (1200x630 PNG) rendered from SVG with resvg. One image per article,
// cached in memory; falls back to null when resvg is unavailable so callers can use a static image.
const path = require('path');
const fs = require('fs');

let Resvg = null;
try { ({ Resvg } = require('@resvg/resvg-js')); } catch (e) { console.warn('[og] resvg not available:', e.message); }

const FONT_DIR = path.join(__dirname, '..', 'assets', 'fonts');
const FONT_FILES = fs.existsSync(FONT_DIR) ? fs.readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f)) : [];
const cache = new Map();
const MAX_CACHE = 300;

const x = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Greedy word wrap by approximate character width.
function wrap(text, maxChars, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

function svgCard({ title, kicker = '', footer = 'dhirajkelly.id' }) {
  const long = String(title).length > 60;
  const size = long ? 58 : 66;
  const lines = wrap(title, long ? 30 : 26, 4);
  const lh = size * 1.18;
  const startY = 315 - ((lines.length - 1) * lh) / 2 + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g" cx="80%" cy="10%" r="75%"><stop offset="0" stop-color="#2B5BD7" stop-opacity="0.45"/><stop offset="1" stop-color="#070F1E" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#070F1E"/><rect width="1200" height="630" fill="url(#g)"/>
<rect x="0" y="0" width="14" height="630" fill="#E9C46A"/>
<g transform="translate(80,70)"><rect width="52" height="52" rx="14" fill="#1C3B78"/>
<path d="M12 36l10-10 8 8 12-12" fill="none" stroke="#E9C46A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="70" y="24" font-family="Plus Jakarta Sans" font-weight="800" font-size="24" letter-spacing="2" fill="#E7ECF5">DOKTOR TRADER</text>
<text x="70" y="48" font-family="Plus Jakarta Sans" font-weight="500" font-size="18" fill="#9AA8C2">by Dr. Dhiraj Kelly</text></g>
${kicker ? `<text x="80" y="${startY - lh + 6}" font-family="Plus Jakarta Sans" font-weight="700" font-size="24" letter-spacing="3" fill="#E9C46A">${x(String(kicker).toUpperCase())}</text>` : ''}
${lines.map((l, i) => `<text x="80" y="${startY + i * lh + 30}" font-family="Plus Jakarta Sans" font-weight="800" font-size="${size}" fill="#F1F4FA">${x(l)}</text>`).join('\n')}
<text x="80" y="575" font-family="Plus Jakarta Sans" font-weight="500" font-size="22" fill="#8C9AB5">Edukasi trading &amp; manajemen risiko · ${x(footer)}</text>
</svg>`;
}

function render(key, opts) {
  if (!Resvg) return null;
  if (cache.has(key)) return cache.get(key);
  const png = new Resvg(svgCard(opts), {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Plus Jakarta Sans' },
  }).render().asPng();
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(key, png);
  return png;
}

module.exports = { render, svgCard, available: () => !!Resvg };
