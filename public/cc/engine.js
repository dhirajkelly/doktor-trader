/* Doktor Trader · Command Center · mesin strategi & backtest (berjalan di browser).
   Bar: [waktu_unix_detik, open, high, low, close]. */
(function (root) {
  'use strict';

  // ---------- Indikator ----------
  function ema(src, n) {
    var out = new Array(src.length).fill(NaN), k = 2 / (n + 1), sum = 0;
    for (var i = 0; i < src.length; i++) {
      if (i < n - 1) { sum += src[i]; continue; }
      if (i === n - 1) { sum += src[i]; out[i] = sum / n; continue; }
      out[i] = src[i] * k + out[i - 1] * (1 - k);
    }
    return out;
  }
  function rsi(c, n) {
    var out = new Array(c.length).fill(NaN), g = 0, l = 0;
    for (var i = 1; i < c.length; i++) {
      var d = c[i] - c[i - 1], up = d > 0 ? d : 0, dn = d < 0 ? -d : 0;
      if (i <= n) { g += up; l += dn; if (i === n) { g /= n; l /= n; out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); } continue; }
      g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n;
      out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
    }
    return out;
  }
  function atr(h, l, c, n) {
    var out = new Array(c.length).fill(NaN), a = 0;
    for (var i = 1; i < c.length; i++) {
      var tr = Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1]));
      if (i <= n) { a += tr; if (i === n) { a /= n; out[i] = a; } continue; }
      a = (a * (n - 1) + tr) / n; out[i] = a;
    }
    return out;
  }
  // VWAP harian dengan bobot sama per candle (data forex/CFD tidak punya volume riil). Reset tiap hari kalender data.
  function vwap(t, h, l, c) {
    var out = new Array(c.length), day = -1, s = 0, k = 0;
    for (var i = 0; i < c.length; i++) {
      var d = Math.floor(t[i] / 86400);
      if (d !== day) { day = d; s = 0; k = 0; }
      s += (h[i] + l[i] + c[i]) / 3; k++;
      out[i] = s / k;
    }
    return out;
  }

  function resample(bars, sec) {
    var out = [], cur = null;
    for (var i = 0; i < bars.length; i++) {
      var b = bars[i], k = Math.floor(b[0] / sec) * sec;
      if (!cur || cur[0] !== k) { if (cur) out.push(cur); cur = [k, b[1], b[2], b[3], b[4]]; }
      else { cur[2] = Math.max(cur[2], b[2]); cur[3] = Math.min(cur[3], b[3]); cur[4] = b[4]; }
    }
    if (cur) out.push(cur);
    return out;
  }

  // ---------- Default & preset ----------
  var DEF = {
    tf: 'M15', direction: 'both',
    trend: { type: 'none', fast: 9, slow: 21, len: 200 },
    entry: { type: 'ema_cross', fast: 9, slow: 21, n: 20, rsiLen: 14, rsiLow: 30, rsiHigh: 70, emaLen: 21 },
    sl: { type: 'atr', atrLen: 14, mult: 1.5, n: 10, buffer: 0.5, fixed: 5 },
    rr: 2, session: { from: 0, to: 24 }, maxPerDay: 1,
  };
  var PRESETS = [
    { name: 'Tren EMA 9 + VWAP · pullback (M5)', rules: { tf: 'M5', direction: 'both', trend: { type: 'ema_vwap', fast: 9 }, entry: { type: 'pullback', emaLen: 9 }, sl: { type: 'swing', n: 6, buffer: 1 }, rr: 2, session: { from: 14, to: 23 }, maxPerDay: 1 } },
    { name: 'Reclaim VWAP searah tren EMA 9 (M15)', rules: { tf: 'M15', direction: 'both', trend: { type: 'ema_vwap', fast: 9 }, entry: { type: 'vwap_reclaim' }, sl: { type: 'atr', atrLen: 14, mult: 1.5 }, rr: 2, session: { from: 14, to: 23 }, maxPerDay: 1 } },
    { name: 'Breakout 20 candle + filter EMA 200 (M15)', rules: { tf: 'M15', direction: 'both', trend: { type: 'price_ema', len: 200 }, entry: { type: 'breakout', n: 20 }, sl: { type: 'atr', atrLen: 14, mult: 1.5 }, rr: 2, session: { from: 14, to: 19 }, maxPerDay: 1 } },
    { name: 'Cross EMA 9/21 + filter EMA 200 (H1)', rules: { tf: 'H1', direction: 'both', trend: { type: 'price_ema', len: 200 }, entry: { type: 'ema_cross', fast: 9, slow: 21 }, sl: { type: 'atr', atrLen: 14, mult: 2 }, rr: 2, session: { from: 0, to: 24 }, maxPerDay: 2 } },
    { name: 'Reversal RSI 30/70 (H1)', rules: { tf: 'H1', direction: 'both', trend: { type: 'none' }, entry: { type: 'rsi', rsiLen: 14, rsiLow: 30, rsiHigh: 70 }, sl: { type: 'atr', atrLen: 14, mult: 2 }, rr: 1.5, session: { from: 0, to: 24 }, maxPerDay: 2 } },
  ];

  function clampInt(v, a, b, d) { v = Math.round(Number(v)); return Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : d; }
  function clampNum(v, a, b, d) { v = Number(v); return Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : d; }
  function normalize(r) {
    r = r || {};
    var t = Object.assign({}, DEF.trend, r.trend), e = Object.assign({}, DEF.entry, r.entry), s = Object.assign({}, DEF.sl, r.sl), se = Object.assign({}, DEF.session, r.session);
    var out = {
      tf: ['M5', 'M15', 'H1'].indexOf(r.tf) >= 0 ? r.tf : DEF.tf,
      direction: ['both', 'long', 'short'].indexOf(r.direction) >= 0 ? r.direction : 'both',
      trend: { type: ['none', 'ema_vwap', 'ema_cross', 'price_ema'].indexOf(t.type) >= 0 ? t.type : 'none', fast: clampInt(t.fast, 2, 300, 9), slow: clampInt(t.slow, 3, 500, 21), len: clampInt(t.len, 5, 500, 200) },
      entry: { type: ['ema_cross', 'breakout', 'rsi', 'pullback', 'vwap_reclaim'].indexOf(e.type) >= 0 ? e.type : 'ema_cross', fast: clampInt(e.fast, 2, 300, 9), slow: clampInt(e.slow, 3, 500, 21), n: clampInt(e.n, 2, 300, 20), rsiLen: clampInt(e.rsiLen, 2, 100, 14), rsiLow: clampNum(e.rsiLow, 1, 50, 30), rsiHigh: clampNum(e.rsiHigh, 50, 99, 70), emaLen: clampInt(e.emaLen, 2, 300, 21) },
      sl: { type: ['atr', 'swing', 'fixed'].indexOf(s.type) >= 0 ? s.type : 'atr', atrLen: clampInt(s.atrLen, 2, 200, 14), mult: clampNum(s.mult, 0.1, 20, 1.5), n: clampInt(s.n, 2, 200, 10), buffer: clampNum(s.buffer, 0, 1000, 0.5), fixed: clampNum(s.fixed, 0.01, 100000, 5) },
      rr: clampNum(r.rr, 0.2, 20, 2),
      session: { from: clampInt(se.from, 0, 23, 0), to: clampInt(se.to, 1, 24, 24) },
      maxPerDay: clampInt(r.maxPerDay, 1, 50, 1),
    };
    if (out.trend.type === 'ema_cross' && out.trend.fast >= out.trend.slow) out.trend.slow = out.trend.fast + 1;
    if (out.entry.type === 'ema_cross' && out.entry.fast >= out.entry.slow) out.entry.slow = out.entry.fast + 1;
    return out;
  }

  var TF_LABEL = { M5: 'M5 (5 menit)', M15: 'M15 (15 menit)', H1: 'H1 (1 jam)' };
  function describe(r) {
    r = normalize(r);
    var d = { both: 'buy dan sell', long: 'buy saja', short: 'sell saja' }[r.direction];
    var tr = {
      none: 'Tanpa filter tren.',
      ema_vwap: 'Buy hanya bila close di atas EMA ' + r.trend.fast + ' <i>dan</i> di atas VWAP harian; sell hanya bila di bawah keduanya.',
      ema_cross: 'Buy hanya bila EMA ' + r.trend.fast + ' di atas EMA ' + r.trend.slow + '; sell bila di bawahnya.',
      price_ema: 'Buy hanya bila close di atas EMA ' + r.trend.len + '; sell bila di bawahnya.',
    }[r.trend.type];
    var en = {
      ema_cross: 'EMA ' + r.entry.fast + ' memotong EMA ' + r.entry.slow + ' (ke atas = buy, ke bawah = sell).',
      breakout: 'Close menembus high tertinggi ' + r.entry.n + ' candle sebelumnya (buy) atau low terendahnya (sell).',
      rsi: 'RSI ' + r.entry.rsiLen + ' naik kembali melewati ' + r.entry.rsiLow + ' (buy) atau turun kembali melewati ' + r.entry.rsiHigh + ' (sell).',
      pullback: 'Harga menyentuh EMA ' + r.entry.emaLen + ' lalu candle ditutup kembali searah tren (candle bullish di atas EMA untuk buy, bearish di bawah EMA untuk sell).',
      vwap_reclaim: 'Close kembali melewati VWAP harian (dari bawah ke atas = buy, dari atas ke bawah = sell).',
    }[r.entry.type];
    var sl = {
      atr: r.sl.mult + '× ATR ' + r.sl.atrLen + ' dari harga entry.',
      swing: 'Di luar low/high terendah-tertinggi ' + r.sl.n + ' candle terakhir, ditambah buffer ' + r.sl.buffer + ' (satuan harga).',
      fixed: 'Tetap ' + r.sl.fixed + ' (satuan harga, mis. $' + r.sl.fixed + ' untuk XAUUSD).',
    }[r.sl.type];
    var ses = (r.session.from === 0 && r.session.to === 24) ? 'Sepanjang hari' : 'Pukul ' + pad(r.session.from) + '.00–' + pad(r.session.to % 24) + '.00 WIB';
    return '<b>Timeframe:</b> ' + TF_LABEL[r.tf] + ' · arah ' + d + '<ul>' +
      '<li><b>Filter tren:</b> ' + tr + '</li><li><b>Pemicu entry:</b> ' + en + ' Entry di open candle berikutnya.</li>' +
      '<li><b>Stop loss:</b> ' + sl + '</li><li><b>Take profit:</b> RR 1:' + r.rr + ' dari jarak stop loss.</li>' +
      '<li><b>Sesi:</b> ' + ses + ' · maksimal ' + r.maxPerDay + ' trade per hari · satu posisi dalam satu waktu.</li></ul>';
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // ---------- Backtest ----------
  // opt: { balance, riskPct, spread, commission (per lot round-trip), contract, tz (jam offset data dari UTC), minLot }
  function run(rulesIn, bars, opt) {
    var r = normalize(rulesIn);
    opt = Object.assign({ balance: 10000, riskPct: 1, spread: 0.3, commission: 0, contract: 100, tz: 0, minLot: 0.01, maxLot: 100 }, opt || {});
    var n = bars.length, t = [], o = [], h = [], l = [], c = [];
    for (var i = 0; i < n; i++) { t.push(bars[i][0]); o.push(bars[i][1]); h.push(bars[i][2]); l.push(bars[i][3]); c.push(bars[i][4]); }
    var need = { };
    var trF = r.trend.type === 'ema_vwap' || r.trend.type === 'ema_cross' ? ema(c, r.trend.fast) : null;
    var trS = r.trend.type === 'ema_cross' ? ema(c, r.trend.slow) : null;
    var trL = r.trend.type === 'price_ema' ? ema(c, r.trend.len) : null;
    var vw = (r.trend.type === 'ema_vwap' || r.entry.type === 'vwap_reclaim') ? vwap(t, h, l, c) : null;
    var enF = r.entry.type === 'ema_cross' ? ema(c, r.entry.fast) : null;
    var enS = r.entry.type === 'ema_cross' ? ema(c, r.entry.slow) : null;
    var enE = r.entry.type === 'pullback' ? ema(c, r.entry.emaLen) : null;
    var rs = r.entry.type === 'rsi' ? rsi(c, r.entry.rsiLen) : null;
    var at = r.sl.type === 'atr' ? atr(h, l, c, r.sl.atrLen) : null;
    var half = opt.spread / 2, eq = opt.balance, peak = eq, maxDD = 0;
    var trades = [], pos = null, pending = 0, perDay = {}, skipped = 0, curve = [[t[0], eq]];

    function wibHour(ts) { return (((Math.floor(ts / 3600) - opt.tz + 7) % 24) + 24) % 24; }
    function inSession(ts) { var hh = wibHour(ts), a = r.session.from, b = r.session.to; if (a === 0 && b === 24) return true; return a < b ? (hh >= a && hh < b) : (hh >= a || hh < b); }
    function dayKey(ts) { return Math.floor((ts - opt.tz * 3600 + 7 * 3600) / 86400); } // hari kalender WIB
    function ok(a) { return Number.isFinite(a); }

    function trendAllows(i) {
      switch (r.trend.type) {
        case 'none': return [true, true];
        case 'ema_vwap': return ok(trF[i]) ? [c[i] > trF[i] && c[i] > vw[i], c[i] < trF[i] && c[i] < vw[i]] : [false, false];
        case 'ema_cross': return ok(trS[i]) ? [trF[i] > trS[i], trF[i] < trS[i]] : [false, false];
        case 'price_ema': return ok(trL[i]) ? [c[i] > trL[i], c[i] < trL[i]] : [false, false];
      }
      return [false, false];
    }
    function trigger(i) {
      if (i < 1) return 0;
      switch (r.entry.type) {
        case 'ema_cross': if (!ok(enS[i - 1])) return 0; if (enF[i] > enS[i] && enF[i - 1] <= enS[i - 1]) return 1; if (enF[i] < enS[i] && enF[i - 1] >= enS[i - 1]) return -1; return 0;
        case 'breakout': { var N = r.entry.n; if (i < N) return 0; var hi = -Infinity, lo = Infinity; for (var j = i - N; j < i; j++) { if (h[j] > hi) hi = h[j]; if (l[j] < lo) lo = l[j]; } return c[i] > hi ? 1 : c[i] < lo ? -1 : 0; }
        case 'rsi': if (!ok(rs[i - 1])) return 0; if (rs[i - 1] < r.entry.rsiLow && rs[i] >= r.entry.rsiLow) return 1; if (rs[i - 1] > r.entry.rsiHigh && rs[i] <= r.entry.rsiHigh) return -1; return 0;
        case 'pullback': if (!ok(enE[i])) return 0; if (l[i] <= enE[i] && c[i] > enE[i] && c[i] > o[i]) return 1; if (h[i] >= enE[i] && c[i] < enE[i] && c[i] < o[i]) return -1; return 0;
        case 'vwap_reclaim': if (Math.floor(t[i] / 86400) !== Math.floor(t[i - 1] / 86400)) return 0; if (c[i - 1] <= vw[i - 1] && c[i] > vw[i]) return 1; if (c[i - 1] >= vw[i - 1] && c[i] < vw[i]) return -1; return 0;
      }
      return 0;
    }
    function close(i, price, why) {
      var gross = pos.dir * (price - pos.entry) * pos.lot * opt.contract;
      var pnl = gross - opt.commission * pos.lot;
      eq += pnl;
      trades.push({ dir: pos.dir, ti: pos.ti, xi: i, t: t[pos.ti], xt: t[i], entry: pos.entry, sl: pos.sl, tp: pos.tp, exit: price, lot: pos.lot, pnl: pnl, r: pnl / (pos.risk * pos.lot * opt.contract), why: why });
      curve.push([t[i], eq]);
      if (eq > peak) peak = eq;
      var dd = (peak - eq) / peak; if (dd > maxDD) maxDD = dd;
      pos = null;
    }

    for (i = 1; i < n; i++) {
      // 1) Eksekusi sinyal dari candle sebelumnya di open candle ini
      if (!pos && pending && eq > 0) {
        var dir = pending, si = i - 1, entry = o[i] + dir * half, sl;
        if (r.sl.type === 'atr') sl = ok(at[si]) ? entry - dir * r.sl.mult * at[si] : NaN;
        else if (r.sl.type === 'fixed') sl = entry - dir * r.sl.fixed;
        else { var ext = dir > 0 ? Infinity : -Infinity; for (var k = Math.max(0, si - r.sl.n + 1); k <= si; k++) ext = dir > 0 ? Math.min(ext, l[k]) : Math.max(ext, h[k]); sl = ext - dir * r.sl.buffer; }
        var dist = dir * (entry - sl);
        if (ok(dist) && dist > 0) {
          var lot = Math.floor((eq * opt.riskPct / 100) / (dist * opt.contract) / opt.minLot + 1e-9) * opt.minLot;
          lot = Math.min(lot, opt.maxLot);
          if (lot >= opt.minLot - 1e-9) {
            pos = { dir: dir, ti: i, entry: entry, sl: sl, tp: entry + dir * r.rr * dist, lot: +lot.toFixed(2), risk: dist };
            var dk = dayKey(t[i]); perDay[dk] = (perDay[dk] || 0) + 1;
          } else skipped++;
        }
        pending = 0;
      }
      // 2) Kelola posisi terbuka (harga data = mid; buy keluar di bid, sell keluar di ask)
      if (pos) {
        var d0 = pos.dir;
        if (i > pos.ti) { // gap di open
          var ox = o[i] - d0 * half;
          if (d0 * (ox - pos.sl) <= 0) { close(i, ox, 'SL (gap)'); }
          else if (d0 * (ox - pos.tp) >= 0) { close(i, ox, 'TP (gap)'); }
        }
        if (pos) {
          var hitSL = d0 > 0 ? (l[i] - half <= pos.sl) : (h[i] + half >= pos.sl);
          var hitTP = d0 > 0 ? (h[i] - half >= pos.tp) : (l[i] + half <= pos.tp);
          if (hitSL) close(i, pos.sl, 'SL'); else if (hitTP) close(i, pos.tp, 'TP');
        }
      }
      // 3) Cari sinyal di close candle ini
      if (!pos && i < n - 1 && inSession(t[i]) && (perDay[dayKey(t[i + 1])] || 0) < r.maxPerDay) {
        var g = trigger(i);
        if (g) {
          var al = trendAllows(i);
          if ((g > 0 && al[0] && r.direction !== 'short') || (g < 0 && al[1] && r.direction !== 'long')) pending = g;
        }
      }
    }
    if (pos) close(n - 1, c[n - 1] - pos.dir * half, 'Akhir data');
    var split = Math.floor(n * 0.7);
    return {
      rules: r, opt: opt, trades: trades, curve: curve, skipped: skipped, bars: n, from: t[0], to: t[n - 1], splitT: t[split],
      all: stats(trades, opt.balance, maxDD, eq),
      is: stats(trades.filter(function (x) { return x.ti < split; })),
      oos: stats(trades.filter(function (x) { return x.ti >= split; })),
    };
  }

  function stats(tr, start, maxDD, end) {
    var n = tr.length, w = 0, gp = 0, gl = 0, sr = 0, streak = 0, worst = 0, longs = 0;
    tr.forEach(function (x) {
      if (x.pnl > 0) { w++; gp += x.pnl; streak = 0; } else { gl -= x.pnl; streak++; if (streak > worst) worst = streak; }
      sr += x.r; if (x.dir > 0) longs++;
    });
    var s = { n: n, wins: w, winRate: n ? w / n : 0, pf: gl > 0 ? gp / gl : (gp > 0 ? Infinity : 0), avgR: n ? sr / n : 0, sumR: sr, worstStreak: worst, longs: longs, shorts: n - longs, avgWin: w ? gp / w : 0, avgLoss: n - w ? gl / (n - w) : 0 };
    if (start != null) { s.net = end - start; s.ret = (end - start) / start; s.maxDD = maxDD; s.end = end; }
    return s;
  }

  // ---------- Parser CSV data bar (MT5 Export Bars, atau datetime,open,high,low,close) ----------
  function parseBars(text) {
    var lines = String(text).replace(/^﻿/, '').split(/\r?\n/).filter(function (x) { return x.trim(); });
    if (lines.length < 3) throw new Error('File terlalu pendek.');
    var head = lines[0], delim = head.indexOf('\t') >= 0 ? '\t' : (head.split(';').length > head.split(',').length ? ';' : ',');
    var cols = head.split(delim).map(function (x) { return x.replace(/[<>"]/g, '').trim().toLowerCase(); });
    var hasHeader = cols.some(function (x) { return /open|close|date|time/.test(x); });
    var idx = function (re) { for (var k = 0; k < cols.length; k++) if (re.test(cols[k])) return k; return -1; };
    var iD, iT, iO, iH, iL, iC;
    if (hasHeader) { iD = idx(/^(date|datetime|time|timestamp|gmt time|local time)$/); iT = idx(/^time$/); if (iT === iD) iT = -1; iO = idx(/^open/); iH = idx(/^high/); iL = idx(/^low/); iC = idx(/^close/); }
    else { iD = 0; iT = -1; iO = 1; iH = 2; iL = 3; iC = 4; }
    if ([iD, iO, iH, iL, iC].some(function (x) { return x < 0; })) throw new Error('Kolom tanggal/open/high/low/close tidak ditemukan.');
    var out = [];
    for (var j = hasHeader ? 1 : 0; j < lines.length; j++) {
      var p = lines[j].split(delim);
      var ds = (p[iD] || '').trim() + (iT >= 0 ? ' ' + (p[iT] || '').trim() : '');
      var m = ds.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})[ T]*(\d{1,2})?:?(\d{2})?:?(\d{2})?/);
      if (!m) continue;
      var ts = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) / 1000;
      var b = [ts, +p[iO], +p[iH], +p[iL], +p[iC]];
      if (b.slice(1).every(Number.isFinite)) out.push(b);
    }
    out.sort(function (a, b) { return a[0] - b[0]; });
    if (out.length < 50) throw new Error('Data terbaca kurang dari 50 candle.');
    return out;
  }

  root.CCE = { ema: ema, rsi: rsi, atr: atr, vwap: vwap, resample: resample, normalize: normalize, describe: describe, run: run, stats: stats, parseBars: parseBars, PRESETS: PRESETS, DEF: DEF };
})(typeof window !== 'undefined' ? window : module.exports);
