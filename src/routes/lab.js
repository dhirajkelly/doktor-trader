// AI Strategy Lab — member page that shows the latest offline research run (content/ai-lab/results.json)
// produced by the XAU Lab Python kit (downloads/DoktorTrader_AI_Strategy_Lab.zip).
// The heavy research runs OUTSIDE this server; pushing a new results.json is enough (read on mtime change).
const fs = require('fs');
const path = require('path');
const express = require('express');
const auth = require('../auth');
const db = require('../db');
const { esc } = require('../views');
const member = require('./member');

const router = express.Router();
const DIR = path.join(__dirname, '..', '..', 'content', 'ai-lab');
const RESULTS = path.join(DIR, 'results.json');
const REPORT = path.join(DIR, 'report.html');

let cache = { mtime: 0, data: null };
function load() {
  try {
    const st = fs.statSync(RESULTS);
    if (st.mtimeMs !== cache.mtime) cache = { mtime: st.mtimeMs, data: JSON.parse(fs.readFileSync(RESULTS, 'utf8')) };
    return cache.data;
  } catch (e) { return null; }
}

const num = (x, d = 2) => (x === null || x === undefined || !isFinite(x) ? '–' : Number(x).toFixed(d));
const pct = (x, d = 1) => (x === null || x === undefined || !isFinite(x) ? '–' : (x * 100).toFixed(d) + '%');
const fmtD = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const GATES = [
  ['G1_oos', 'Out-of-sample', 'Tetap untung di data 2024–2025 yang tidak dipakai saat riset'],
  ['G2_dsr', 'Deflated Sharpe', 'Hasilnya lebih baik dari yang bisa didapat dari kebetulan, mengingat jumlah ide yang dicoba'],
  ['G3_pbo', 'PBO', 'Peluang seluruh pencarian ini overfit di bawah 50%'],
  ['G4_stress', 'Stress biaya', 'Masih positif bila spread ×1,5 dan slippage ×2'],
  ['G5_stability', 'Stabilitas', 'Parameter di sekitarnya juga untung, bukan titik kebetulan'],
  ['G6_holdout', 'Holdout', 'Data paling baru yang dikunci, dibuka sekali di akhir'],
];

// ---- tiny server-side SVG charts (no client JS needed) ----------------------------------------
function lineChart(series, { w = 680, h = 220, zero = true, fmtY = (v) => num(v, 1), xLabels = [] } = {}) {
  const all = series.flatMap((s) => s.values).filter((v) => isFinite(v));
  if (!all.length) return '';
  let lo = Math.min(...all), hi = Math.max(...all);
  if (zero) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  if (hi === lo) hi = lo + 1;
  const pl = 46, pr = 12, pt = 12, pb = 26, W = w - pl - pr, H = h - pt - pb;
  const n = Math.max(...series.map((s) => s.values.length));
  const X = (i) => pl + (n <= 1 ? 0 : (i / (n - 1)) * W);
  const Y = (v) => pt + (1 - (v - lo) / (hi - lo)) * H;
  const ticks = [lo, (lo + hi) / 2, hi];
  let g = ticks.map((t) => `<line x1="${pl}" x2="${w - pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="rgba(255,255,255,.07)"/><text x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="#8C9AB5">${esc(fmtY(t))}</text>`).join('');
  if (zero && lo < 0 && hi > 0) g += `<line x1="${pl}" x2="${w - pr}" y1="${Y(0)}" y2="${Y(0)}" stroke="rgba(255,255,255,.25)"/>`;
  xLabels.forEach(([i, t]) => { g += `<text x="${X(i)}" y="${h - 6}" text-anchor="${i === 0 ? 'start' : i >= n - 1 ? 'end' : 'middle'}" font-size="11" fill="#8C9AB5">${esc(t)}</text>`; });
  const lines = series.map((s) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('');
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>`;
  }).join('');
  const shade = series.shade ? series.shade.map(([a, b, label]) => `<rect x="${X(a)}" y="${pt}" width="${Math.max(X(b) - X(a), 1)}" height="${H}" fill="rgba(233,196,106,.07)"/><text x="${X(a) + 4}" y="${pt + 12}" font-size="10" fill="#8C9AB5">${esc(label)}</text>`).join('') : '';
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" style="display:block">${shade}${g}${lines}</svg>`;
}

function legend(items) {
  return `<div class="row" style="gap:16px;font-size:13px;color:var(--muted);margin:6px 0 0">${items.map(([c, t]) => `<span><i style="display:inline-block;width:14px;height:3px;background:${c};vertical-align:middle;margin-right:6px;border-radius:2px"></i>${esc(t)}</span>`).join('')}</div>`;
}

function equityChart(f, windows) {
  const pts = f.equity_weekly || [];
  if (pts.length < 2) return '';
  const values = pts.map((p) => (p[1] - 1) * 100);
  const idx = (d) => { const i = pts.findIndex((p) => p[0] >= d); return i < 0 ? pts.length - 1 : i; };
  const series = [{ values, color: '#E9C46A' }];
  series.shade = [[idx(windows.validation[0]), idx(windows.validation[1]), 'Validasi']];
  if (f.holdout) series.shade.push([idx(windows.holdout[0]), pts.length - 1, 'Holdout']);
  const years = [];
  let last = '';
  pts.forEach((p, i) => { const y = p[0].slice(0, 4); if (y !== last && i > 0 && (+y) % 2 === 0) years.push([i, y]); last = y; });
  return lineChart(series, { h: 170, fmtY: (v) => (v >= 0 ? '+' : '') + v.toFixed(0) + '%', xLabels: years });
}

// ---- page ---------------------------------------------------------------------------------------
router.get('/member/ai-lab', auth.requireApproved, (req, res) => {
  const r = load();
  const intro = `<h1>AI Strategy Lab</h1>
<p class="muted">Laboratorium riset otomatis untuk XAUUSD. Mesin ini terus mencoba ide strategi baru, mengujinya dengan biaya trading yang realistis, memperbaiki yang menjanjikan, lalu menyaringnya dengan 6 gate anti-overfitting. Tujuannya bukan mencari backtest paling cantik, tapi strategi yang <b>tahan banting</b> di data yang belum pernah dilihatnya.</p>
<div class="alert">Semua angka di halaman ini adalah <b>hasil backtest historis (hipotetis)</b>, bukan jaminan, bukan sinyal, dan bukan ajakan transaksi. Strategi yang lolos semua gate pun wajib diuji di akun demo dulu.</div>`;
  if (!r) {
    return member.page(req, res, { title: 'AI Strategy Lab', active: 'ailab', body: `${intro}<div class="card" style="margin-top:20px">Hasil riset pertama sedang disiapkan.</div>` });
  }
  const fins = r.finalists || [];
  const approved = fins.filter((f) => f.approved_for_paper);
  const passed = fins.filter((f) => f.passed_G1_G5);
  const prog = r.search.progress || [];
  const n = prog.length;
  const progSvg = lineChart([
    { values: prog.map((p) => p.best_score_ever), color: '#E9C46A' },
    { values: prog.map((p) => p.gen_median), color: '#6DA7EC' },
  ], { xLabels: [[0, 'Gen 1'], [Math.floor((n - 1) / 2), `Gen ${Math.floor((n - 1) / 2) + 1}`], [n - 1, `Gen ${n}`]] });

  const verdict = approved.length
    ? `<div class="alert ok"><b>${approved.length} strategi lolos semua gate</b> dan boleh masuk tahap paper trading (akun demo).</div>`
    : `<div class="alert bad"><b>Hasil run ini: belum ada strategi yang lolos semua gate.</b> Dari ${r.search.trials.toLocaleString('id-ID')} strategi yang dicoba, tidak satu pun cukup kuat untuk dipakai. Ini justru inti pelajarannya: membuat strategi itu gampang, menemukan yang benar-benar tahan di market nyata itu yang sulit. Holdout tetap tersegel untuk run berikutnya.</div>`;

  const gateHead = GATES.map(([, l]) => `<th style="text-align:center">${l}</th>`).join('');
  const rows = fins.map((f, i) => `<tr><td>${i + 1}</td><td style="min-width:220px">${esc(f.desc)}</td><td>${num(f.oos.sharpe)}</td><td>${num(f.oos.pf)}</td><td>${f.oos.trades}</td>
${GATES.map(([k]) => { const v = f.gates[k]; return `<td style="text-align:center;font-weight:800;color:${v === undefined ? 'var(--dim)' : v ? 'var(--green)' : 'var(--red)'}">${v === undefined ? '–' : v ? '✓' : '✗'}</td>`; }).join('')}</tr>`).join('');

  const cards = fins.map((f) => {
    const sc = f.setup_card || {};
    const hold = f.holdout ? `<tr><td>Holdout</td><td>${num(f.holdout.sharpe)}</td><td>${num(f.holdout.pf)}</td><td>${num(f.holdout.expectancy_R, 3)}</td><td>${pct(f.holdout.max_dd)}</td><td>${f.holdout.trades}</td></tr>` : '';
    return `<div class="card" style="margin-top:14px">
<div class="spread" style="gap:10px;flex-wrap:wrap"><strong style="font-size:15px">${esc(f.desc)}</strong>${f.approved_for_paper ? '<span class="pill ok">Lolos semua gate</span>' : '<span class="pill bad">Belum lolos</span>'}</div>
${f.hypothesis ? `<p class="dim" style="font-style:italic">Hipotesis agen AI: ${esc(f.hypothesis)}</p>` : ''}
<div style="margin:10px 0">${equityChart(f, r.windows)}</div>
<div class="tablewrap"><table style="font-size:14px"><tr><th></th><th>Sharpe</th><th>Profit factor</th><th>Rata-rata R</th><th>Max DD</th><th>Trade</th></tr>
<tr><td>Riset 2017–2023</td><td>${num(f.is.sharpe)}</td><td>${num(f.is.pf)}</td><td>${num(f.is.expectancy_R, 3)}</td><td>${pct(f.is.max_dd)}</td><td>${f.is.trades}</td></tr>
<tr><td>Validasi 2024–2025</td><td>${num(f.oos.sharpe)}</td><td>${num(f.oos.pf)}</td><td>${num(f.oos.expectancy_R, 3)}</td><td>${pct(f.oos.max_dd)}</td><td>${f.oos.trades}</td></tr>${hold}</table></div>
<p class="dim" style="margin:10px 0 0">Deflated Sharpe ${num(f.dsr.dsr)}: Sharpe riset ${num(f.dsr.sr_ann)} vs ambang "bisa karena kebetulan" ${num(f.dsr.sr0_ann)} · Stabilitas parameter ${pct(f.stability, 0)} · Simulasi Monte Carlo: drawdown terburuk 5% skenario ${pct(f.mc && f.mc.dd_p95)}, rentetan loss ${f.mc && f.mc.streak_p95}x</p>
<p class="dim" style="margin:6px 0 0"><b>Contoh hitungan ukuran posisi (bukan sinyal):</b> modal $${(sc.equity || 0).toLocaleString('en-US')}, risiko ${num(sc.risk_pct, 1)}% = $${num(sc.risk_usd, 0)} · SL rata-rata $${num(sc.sl_usd_per_oz)}/oz → <b>lot ${num(sc.lot)}</b> · TP $${num(sc.tp_usd_per_oz)}/oz → <b>RR ${esc(sc.rr || '')}</b></p>
</div>`;
  }).join('');

  const c = r.costs || {};
  const body = `${intro}
<div class="grid g3" style="margin:20px 0">
<div class="card"><div class="dim">Strategi diuji</div><div class="stat">${r.search.trials.toLocaleString('id-ID')}</div><div class="dim">${r.search.generations} generasi · ${(r.dsr_trials || {}).independent || '–'} ide independen</div></div>
<div class="card"><div class="dim">Lolos gate 1–5</div><div class="stat">${passed.length} / ${fins.length}</div><div class="dim">finalis terbaik di data riset</div></div>
<div class="card"><div class="dim">Siap paper trading</div><div class="stat" style="color:${approved.length ? 'var(--green)' : 'var(--red)'}">${approved.length}</div><div class="dim">PBO pencarian: ${num(r.pbo.pbo)}</div></div>
</div>
${verdict}
<h2 style="margin-top:28px">1. Loop yang memperbaiki diri</h2>
<p class="muted">Riset → bangun → uji → nilai → perbaiki → validasi ulang. Tiap generasi, strategi terbaik dipertahankan dan sisanya diganti variasi baru${r.search.llm_agent ? ' serta usulan agen AI (Claude)' : ''}. Skor = konsistensi Sharpe per tahun, bukan total profit.</p>
<div class="card">${progSvg}${legend([['#E9C46A', 'Skor terbaik sejauh ini'], ['#6DA7EC', 'Median tiap generasi']])}
<p class="dim" style="margin:10px 0 0">Hanya ${pct(r.search.positive_score_share, 0)} dari semua percobaan yang skornya positif di data riset. Setiap ide yang dicoba dicatat, dan makin banyak ide, makin tinggi ambang statistik yang harus dilewati.</p></div>

<h2 style="margin-top:28px">2. Enam gate anti-overfitting</h2>
<div class="grid g2">${GATES.map(([, l, d], i) => `<div class="card" style="padding:14px"><b>G${i + 1} · ${l}</b><div class="dim">${d}</div></div>`).join('')}</div>
<div class="card tablewrap" style="margin-top:14px"><table style="font-size:14px"><tr><th>#</th><th>Strategi</th><th>Sharpe OOS</th><th>PF OOS</th><th>Trade OOS</th>${gateHead}</tr>${rows}</table></div>

<h2 style="margin-top:28px">3. Detail finalis</h2>${cards}

<h2 style="margin-top:28px">4. Bangun lab-mu sendiri</h2>
<div class="card"><p style="margin-top:0">Kit Python lengkap yang dipakai untuk riset ini: data loader MT5, engine backtest dengan spread/slippage/swap, loop self-improvement, agen Claude opsional, semua gate validasi, laporan HTML, dan skrip paper trading dengan lot &amp; RR.</p>
<div class="row"><a class="btn" href="/member/unduh/DoktorTrader_AI_Strategy_Lab.zip">Unduh AI Strategy Lab (Python)</a><a class="btn ghost" href="/member/ai-lab/laporan" target="_blank" rel="noopener">Laporan teknis lengkap ↗</a></div>
<p class="dim" style="margin:10px 0 0">Butuh Python 3.11+ dan data M1 XAUUSD dari MT5 (skrip ekspor disertakan). Baca README di dalam zip.</p></div>

<p class="dim" style="margin-top:24px">Run terakhir: ${fmtD(r.generated_at)} · Data ${esc(r.data.source)}, ${esc(r.data.start)} s/d ${esc(r.data.end)} · Biaya: spread asli MT5 (minimum $${num(c.spread_floor_points * 0.001)}), slippage $${num(c.slippage_points * 0.001)}/sisi, swap long ${c.swap_long_per_lot} / short ${c.swap_short_per_lot} USD per lot per malam (asumsi) · Riset ${esc(r.windows.research.join(' – '))}, validasi ${esc(r.windows.validation.join(' – '))}, holdout ${esc(r.windows.holdout[0])} – sekarang.</p>`;
  member.page(req, res, { title: 'AI Strategy Lab', active: 'ailab', body });
});

router.get('/member/ai-lab/laporan', auth.requireApproved, (req, res, next) => {
  if (!fs.existsSync(REPORT)) return next();
  db.log(req.user.id, 'ai_lab_report', '');
  res.set('X-Robots-Tag', 'noindex');
  res.sendFile(REPORT);
});

module.exports = router;
