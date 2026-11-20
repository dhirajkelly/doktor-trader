/* Doktor Trader · Command Center · UI member (Chart AI, Strategy Builder, Backtest, Risk Manager, Jurnal). */
(function () {
  'use strict';
  var ROOT = document.getElementById('cc');
  if (!ROOT) return;
  var CSRF = ROOT.dataset.csrf, BASE = ROOT.dataset.base;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (n, d) { if (!isFinite(n)) return n > 0 ? '∞' : '–'; return Number(n).toLocaleString('id-ID', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); };
  var usd = function (n) { return (n < 0 ? '−$' : '$') + fmt(Math.abs(n)); };
  var pct = function (n, d) { return fmt(n * 100, d == null ? 1 : d) + '%'; };
  var cls = function (n) { return n > 0 ? 'cc-pos' : n < 0 ? 'cc-neg' : ''; };
  var json = function (id) { var el = document.getElementById(id); try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; } };
  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-csrf-token': CSRF }, body: JSON.stringify(body || {}), credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { error: 'Respon server tidak valid (' + r.status + ').' }; }).then(function (j) { if (!r.ok && !j.error) j.error = 'Gagal (' + r.status + ').'; return j; }); })
      .catch(function () { return { error: 'Koneksi terputus. Coba lagi.' }; });
  }
  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/csv' })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function csvCell(v) { v = v == null ? '' : String(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function wib(ts) { var d = new Date((ts + 7 * 3600) * 1000); return d.toISOString().slice(0, 16).replace('T', ' '); }

  // Kurva sederhana di canvas
  function lineChart(canvas, pts, opt) {
    opt = opt || {};
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    var g = canvas.getContext('2d'); g.scale(dpr, dpr); g.clearRect(0, 0, W, H);
    if (pts.length < 2) { g.fillStyle = '#8C9AB5'; g.font = '13px sans-serif'; g.fillText('Belum ada data untuk digambar.', 12, 24); return; }
    var ys = pts.map(function (p) { return p[1]; }), mn = Math.min.apply(null, ys), mx = Math.max.apply(null, ys);
    if (opt.base != null) { mn = Math.min(mn, opt.base); mx = Math.max(mx, opt.base); }
    if (mx === mn) { mx += 1; mn -= 1; }
    var L = 62, R = 10, T = 12, B = 22, x = function (i) { return L + (W - L - R) * i / (pts.length - 1); }, y = function (v) { return T + (H - T - B) * (1 - (v - mn) / (mx - mn)); };
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.fillStyle = '#8C9AB5'; g.font = '11px sans-serif'; g.lineWidth = 1;
    for (var k = 0; k <= 4; k++) { var v = mn + (mx - mn) * k / 4, yy = y(v); g.beginPath(); g.moveTo(L, yy); g.lineTo(W - R, yy); g.stroke(); g.fillText((opt.fmt || fmt)(v), 4, yy + 4); }
    if (opt.base != null) { g.strokeStyle = 'rgba(233,196,106,.5)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(L, y(opt.base)); g.lineTo(W - R, y(opt.base)); g.stroke(); g.setLineDash([]); }
    if (opt.splitIdx != null) { g.strokeStyle = 'rgba(91,227,238,.5)'; g.setLineDash([3, 5]); g.beginPath(); g.moveTo(x(opt.splitIdx), T); g.lineTo(x(opt.splitIdx), H - B); g.stroke(); g.setLineDash([]); g.fillStyle = '#5BE3EE'; g.fillText('out-of-sample →', Math.min(x(opt.splitIdx) + 4, W - 110), H - 6); }
    g.strokeStyle = '#E9C46A'; g.lineWidth = 2; g.beginPath();
    pts.forEach(function (p, i) { if (i) g.lineTo(x(i), y(p[1])); else g.moveTo(x(i), y(p[1])); }); g.stroke();
  }

  // ======================= AI CHART ANALYSIS =======================
  var caFile = $('#ca-file');
  if (caFile) {
    var dataUrl = null;
    caFile.addEventListener('change', function () {
      var f = caFile.files[0]; if (!f) return;
      var img = new Image(), url = URL.createObjectURL(f);
      img.onload = function () {
        var s = Math.min(1, 1568 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        dataUrl = cv.toDataURL('image/jpeg', 0.85);
        var p = $('#ca-prev'); p.src = dataUrl; p.hidden = false; URL.revokeObjectURL(url);
      };
      img.onerror = function () { $('#ca-st').textContent = 'Gambar tidak bisa dibaca.'; };
      img.src = url;
    });
    $('#ca-go').addEventListener('click', function () {
      var st = $('#ca-st'), out = $('#ca-out'), btn = this;
      if (!dataUrl) { st.textContent = 'Pilih screenshot chart dulu.'; return; }
      btn.disabled = true; st.textContent = 'Asisten AI sedang membedah chart… (±20–40 detik)';
      post(BASE + '/chart-ai/analyze', { image: dataUrl, note: $('#ca-note').value }).then(function (j) {
        btn.disabled = false;
        if (j.status === 'off') { st.textContent = 'Analisa AI sedang tidak aktif. Pakai checklist di bawah.'; return; }
        if (j.error) { st.textContent = j.error; return; }
        st.textContent = ''; out.hidden = false; out.innerHTML = j.html; out.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if ($('#left') && j.left != null) { $('#left').textContent = j.left; if (!j.left) btn.disabled = true; }
      });
    });
  }

  // ======================= FORM STRATEGI (dipakai Builder) =======================
  var E = window.CCE;
  function opt(v, label, cur) { return '<option value="' + v + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + label + '</option>'; }
  function hours(cur, max) { var s = ''; for (var i = 0; i <= max; i++) if (i < 24 || max === 24) s += opt(i, (i < 10 ? '0' : '') + i + '.00', cur); return s; }
  function field(k, label, val, show, attrs) { return '<div' + (show ? ' data-show="' + show + '"' : '') + '><label>' + label + '</label><input data-k="' + k + '" type="number" step="any" value="' + esc(val) + '"' + (attrs || '') + '></div>'; }
  function strategyForm(r, name) {
    r = E.normalize(r);
    return '<div class="cc-form">' +
      '<div class="full"><label>Nama strategi</label><input data-k="name" maxlength="80" value="' + esc(name || '') + '" placeholder="Mis. Pullback EMA 9 sesi London"></div>' +
      '<div><label>Timeframe</label><select data-k="tf">' + opt('M5', 'M5', r.tf) + opt('M15', 'M15', r.tf) + opt('H1', 'H1', r.tf) + '</select></div>' +
      '<div><label>Arah</label><select data-k="direction">' + opt('both', 'Buy & sell', r.direction) + opt('long', 'Buy saja', r.direction) + opt('short', 'Sell saja', r.direction) + '</select></div>' +
      '<div class="full"><h3 style="margin:8px 0 0">1. Filter tren</h3></div>' +
      '<div><label>Jenis filter</label><select data-k="trend.type">' + opt('none', 'Tanpa filter', r.trend.type) + opt('ema_vwap', 'EMA + VWAP harian', r.trend.type) + opt('ema_cross', 'EMA cepat vs EMA lambat', r.trend.type) + opt('price_ema', 'Harga vs EMA panjang', r.trend.type) + '</select></div>' +
      field('trend.fast', 'EMA cepat', r.trend.fast, 'trend.type=ema_vwap,ema_cross', ' min="2"') + field('trend.slow', 'EMA lambat', r.trend.slow, 'trend.type=ema_cross', ' min="3"') + field('trend.len', 'Periode EMA', r.trend.len, 'trend.type=price_ema', ' min="5"') +
      '<div class="full"><h3 style="margin:8px 0 0">2. Pemicu entry</h3></div>' +
      '<div><label>Pemicu</label><select data-k="entry.type">' + opt('ema_cross', 'Cross EMA', r.entry.type) + opt('pullback', 'Pullback ke EMA', r.entry.type) + opt('vwap_reclaim', 'Reclaim VWAP', r.entry.type) + opt('breakout', 'Breakout high/low N candle', r.entry.type) + opt('rsi', 'Reversal RSI', r.entry.type) + '</select></div>' +
      field('entry.fast', 'EMA cepat', r.entry.fast, 'entry.type=ema_cross') + field('entry.slow', 'EMA lambat', r.entry.slow, 'entry.type=ema_cross') + field('entry.emaLen', 'Periode EMA', r.entry.emaLen, 'entry.type=pullback') +
      field('entry.n', 'Jumlah candle (N)', r.entry.n, 'entry.type=breakout') + field('entry.rsiLen', 'Periode RSI', r.entry.rsiLen, 'entry.type=rsi') + field('entry.rsiLow', 'Batas bawah (oversold)', r.entry.rsiLow, 'entry.type=rsi') + field('entry.rsiHigh', 'Batas atas (overbought)', r.entry.rsiHigh, 'entry.type=rsi') +
      '<div class="full"><h3 style="margin:8px 0 0">3. Stop loss &amp; target</h3></div>' +
      '<div><label>Metode stop loss</label><select data-k="sl.type">' + opt('atr', 'Kelipatan ATR', r.sl.type) + opt('swing', 'Di balik swing N candle', r.sl.type) + opt('fixed', 'Jarak tetap', r.sl.type) + '</select></div>' +
      field('sl.atrLen', 'Periode ATR', r.sl.atrLen, 'sl.type=atr') + field('sl.mult', 'Kelipatan ATR', r.sl.mult, 'sl.type=atr') + field('sl.n', 'Swing N candle', r.sl.n, 'sl.type=swing') + field('sl.buffer', 'Buffer (harga)', r.sl.buffer, 'sl.type=swing') + field('sl.fixed', 'Jarak SL (harga)', r.sl.fixed, 'sl.type=fixed') +
      field('rr', 'Risk-reward (1 : x)', r.rr, '', ' min="0.2"') +
      '<div class="full"><h3 style="margin:8px 0 0">4. Sesi &amp; disiplin</h3></div>' +
      '<div><label>Mulai (WIB)</label><select data-k="session.from">' + hours(r.session.from, 23) + '</select></div>' +
      '<div><label>Sampai (WIB)</label><select data-k="session.to">' + hours(r.session.to, 24) + '</select></div>' +
      field('maxPerDay', 'Maks trade per hari', r.maxPerDay, '', ' min="1"') + '</div>';
  }
  function readForm(box) {
    var r = { trend: {}, entry: {}, sl: {}, session: {} }, name = '';
    $$('[data-k]', box).forEach(function (el) {
      var k = el.dataset.k, v = el.tagName === 'SELECT' && isNaN(+el.value) ? el.value : (el.type === 'number' || el.tagName === 'SELECT' ? (isNaN(+el.value) ? el.value : +el.value) : el.value);
      if (k === 'name') { name = el.value; return; }
      var p = k.split('.'); if (p.length === 2) r[p[0]][p[1]] = v; else r[k] = v;
    });
    return { name: name, rules: E.normalize(r) };
  }
  function syncShow(box) {
    $$('[data-show]', box).forEach(function (el) {
      var m = el.dataset.show.split('='), sel = $('[data-k="' + m[0] + '"]', box);
      el.hidden = !sel || m[1].split(',').indexOf(sel.value) < 0;
    });
  }

  // ======================= STRATEGY BUILDER =======================
  var sb = $('#sb');
  if (sb && E) {
    var list = json('cc-strats') || [], editId = 0;
    sb.innerHTML = '<div class="row" style="margin-bottom:12px"><span class="dim">Mulai dari contoh:</span>' + E.PRESETS.map(function (p, i) { return '<button type="button" class="btn sm ghost" data-pre="' + i + '">' + esc(p.name) + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div id="sb-form"></div><div class="cc-sum" id="sb-sum" style="margin-top:16px"></div>' +
      '<div class="row" style="margin-top:14px"><button class="btn" type="button" id="sb-save">Simpan strategi</button><button class="btn ghost" type="button" id="sb-test">Simpan &amp; uji di Backtest</button><button class="btn ghost sm" type="button" id="sb-new" hidden>Buat baru</button><span class="dim" id="sb-st" aria-live="polite"></span></div></div>' +
      '<div class="cc-sec"><h2>Strategi tersimpan</h2><div id="sb-list"></div></div>';
    var form = $('#sb-form');
    var load = function (rules, name, id) { editId = id || 0; form.innerHTML = strategyForm(rules, name); syncShow(form); upd(); $('#sb-save').textContent = editId ? 'Simpan perubahan' : 'Simpan strategi'; $('#sb-new').hidden = !editId; };
    var upd = function () { syncShow(form); $('#sb-sum').innerHTML = E.describe(readForm(form).rules); };
    form.addEventListener('input', upd); form.addEventListener('change', upd);
    $$('[data-pre]', sb).forEach(function (b) { b.addEventListener('click', function () { var p = E.PRESETS[+b.dataset.pre]; load(p.rules, p.name, 0); }); });
    var renderList = function () {
      $('#sb-list').innerHTML = list.length ? '<div class="grid g2">' + list.map(function (s) {
        return '<div class="card"><div class="spread"><b>' + esc(s.name) + '</b><span class="pill gray">' + esc(E.normalize(s.rules).tf) + '</span></div><div class="dim" style="margin:6px 0 10px">Diubah ' + esc(String(s.updated_at || '').slice(0, 16)) + ' UTC</div>' +
          '<div class="row"><a class="btn sm" href="' + BASE + '/backtest?s=' + s.id + '">Uji</a><button class="btn sm ghost" type="button" data-edit="' + s.id + '">Edit</button><button class="cc-x" type="button" data-del="' + s.id + '">Hapus</button></div></div>';
      }).join('') + '</div>' : '<p class="muted">Belum ada. Pilih contoh di atas atau susun sendiri, lalu simpan.</p>';
      $$('[data-edit]', sb).forEach(function (b) { b.addEventListener('click', function () { var s = list.find(function (x) { return x.id === +b.dataset.edit; }); load(s.rules, s.name, s.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }); });
      $$('[data-del]', sb).forEach(function (b) { b.addEventListener('click', function () { if (!confirm('Hapus strategi ini?')) return; post(BASE + '/strategi/api/' + b.dataset.del + '/hapus').then(function (j) { if (j.list) { list = j.list; if (editId === +b.dataset.del) load(E.DEF, '', 0); renderList(); } }); }); });
    };
    var save = function (go) {
      var f = readForm(form), st = $('#sb-st'); st.textContent = 'Menyimpan…';
      post(BASE + '/strategi/api/save', { id: editId, name: f.name, rules: f.rules }).then(function (j) {
        if (j.error) { st.textContent = j.error; return; }
        list = j.list; editId = j.id; renderList(); st.textContent = 'Tersimpan.'; $('#sb-save').textContent = 'Simpan perubahan'; $('#sb-new').hidden = false;
        if (go) location.href = BASE + '/backtest?s=' + j.id;
      });
    };
    $('#sb-save').addEventListener('click', function () { save(false); });
    $('#sb-test').addEventListener('click', function () { save(true); });
    $('#sb-new').addEventListener('click', function () { load(E.DEF, '', 0); });
    var q = new URLSearchParams(location.search).get('edit'), s0 = q && list.find(function (x) { return x.id === +q; });
    if (s0) load(s0.rules, s0.name, s0.id); else load(E.PRESETS[0].rules, E.PRESETS[0].name, 0);
    renderList();
  }

  // ======================= BACKTEST =======================
  var bt = $('#bt');
  if (bt && E) {
    var strats = json('cc-strats') || [], cache = {}, myBars = null;
    var sel0 = new URLSearchParams(location.search).get('s');
    bt.innerHTML = '<div class="card"><div class="cc-form">' +
      '<div class="full"><label for="bt-s">Strategi</label><select id="bt-s">' +
      (strats.length ? '<optgroup label="Strategi saya">' + strats.map(function (s) { return '<option value="u' + s.id + '"' + (String(s.id) === sel0 ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('') + '</optgroup>' : '') +
      '<optgroup label="Contoh">' + E.PRESETS.map(function (p, i) { return '<option value="p' + i + '">' + esc(p.name) + '</option>'; }).join('') + '</optgroup></select></div>' +
      '<div class="full cc-sum" id="bt-sum"></div>' +
      '<div class="full"><label>Data</label><div class="cc-tags"><label><input type="radio" name="bt-d" value="sample" checked> Contoh XAUUSD (Feb–Mei 2026)</label><label><input type="radio" name="bt-d" value="mine"> Data saya (CSV dari MT5)</label></div></div>' +
      '<div class="full" id="bt-mine" hidden><input type="file" id="bt-file" accept=".csv,.txt,text/csv"><div class="dim" id="bt-fst" style="margin-top:6px">Timeframe mengikuti file. Isi selisih jam server broker dari UTC di bawah supaya filter sesi WIB tepat.</div></div>' +
      '<div><label for="bt-bal">Modal awal ($)</label><input id="bt-bal" type="number" step="any" value="10000"></div>' +
      '<div><label for="bt-risk">Risiko per trade (%)</label><input id="bt-risk" type="number" step="0.1" value="1"></div>' +
      '<div><label for="bt-spr">Spread (harga)</label><input id="bt-spr" type="number" step="0.01" value="0.30"></div>' +
      '<div><label for="bt-com">Komisi per lot ($)</label><input id="bt-com" type="number" step="any" value="0"></div>' +
      '<div><label for="bt-cs">Ukuran kontrak per lot</label><input id="bt-cs" type="number" step="any" value="100"></div>' +
      '<div><label for="bt-tz">Jam data vs UTC</label><input id="bt-tz" type="number" step="1" value="0"></div>' +
      '</div><div class="row" style="margin-top:14px"><button class="btn" type="button" id="bt-run">Jalankan backtest</button><a class="btn ghost sm" id="bt-edit" href="' + BASE + '/strategi">Ubah aturan di Builder</a><span class="dim" id="bt-st" aria-live="polite"></span></div></div>' +
      '<div id="bt-out"></div>';
    var cur = function () { var v = $('#bt-s').value; if (v[0] === 'u') { var s = strats.find(function (x) { return 'u' + x.id === v; }); return { name: s.name, rules: s.rules, id: s.id }; } var p = E.PRESETS[+v.slice(1)]; return { name: p.name, rules: p.rules }; };
    var showSum = function () { var c = cur(); $('#bt-sum').innerHTML = E.describe(c.rules); $('#bt-edit').href = BASE + '/strategi' + (c.id ? '?edit=' + c.id : ''); };
    $('#bt-s').addEventListener('change', showSum); showSum();
    $$('[name="bt-d"]').forEach(function (r) { r.addEventListener('change', function () { var mine = $('[name="bt-d"]:checked').value === 'mine'; $('#bt-mine').hidden = !mine; if (!mine) $('#bt-tz').value = 0; }); });
    $('#bt-file').addEventListener('change', function () {
      var f = this.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () { try { myBars = E.parseBars(rd.result); var step = Math.round((myBars[myBars.length - 1][0] - myBars[0][0]) / (myBars.length - 1) / 60); $('#bt-fst').textContent = myBars.length.toLocaleString('id-ID') + ' candle terbaca · ' + wib(myBars[0][0] - 7 * 3600).slice(0, 10) + ' s/d ' + wib(myBars[myBars.length - 1][0] - 7 * 3600).slice(0, 10) + ' (jam file). Isi "Jam data vs UTC" dengan zona server broker (mis. 2 atau 3).'; } catch (e) { myBars = null; $('#bt-fst').textContent = 'Gagal membaca: ' + e.message; } };
      rd.readAsText(f);
    });
    var getSample = function (tf) {
      var file = tf === 'H1' ? 'xauusd-h1.json' : 'xauusd-m5.json';
      if (cache[file]) return Promise.resolve(cache[file]);
      return fetch(BASE + '/data/' + file, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (j) { cache[file] = j.bars; return j.bars; });
    };
    $('#bt-run').addEventListener('click', function () {
      var st = $('#bt-st'), c = cur(), mine = $('[name="bt-d"]:checked').value === 'mine', tf = E.normalize(c.rules).tf;
      if (mine && !myBars) { st.textContent = 'Unggah CSV data dulu.'; return; }
      st.textContent = 'Menghitung…';
      (mine ? Promise.resolve(myBars) : getSample(tf).then(function (b) { return tf === 'M15' ? E.resample(b, 900) : b; })).then(function (bars) {
        setTimeout(function () {
          var o = { balance: +$('#bt-bal').value || 10000, riskPct: +$('#bt-risk').value || 1, spread: +$('#bt-spr').value || 0, commission: +$('#bt-com').value || 0, contract: +$('#bt-cs').value || 100, tz: +$('#bt-tz').value || 0 };
          var res = E.run(c.rules, bars, o); st.textContent = ''; renderBt(res, c.name, mine ? 'Data saya' : 'Contoh XAUUSD ' + tf);
        }, 20);
      }).catch(function (e) { st.textContent = 'Gagal memuat data: ' + e.message; });
    });
    function renderBt(res, name, dataLabel) {
      var a = res.all, out = $('#bt-out');
      var card = function (k, v, c) { return '<div class="card"><div class="dim">' + k + '</div><div class="v ' + (c || '') + '">' + v + '</div></div>'; };
      var row = function (lbl, s) { return '<tr><td>' + lbl + '</td><td class="n">' + s.n + '</td><td class="n">' + (s.n ? pct(s.winRate) : '–') + '</td><td class="n">' + (s.n ? fmt(s.pf) : '–') + '</td><td class="n ' + cls(s.avgR) + '">' + (s.n ? fmt(s.avgR) + 'R' : '–') + '</td><td class="n ' + cls(s.sumR) + '">' + fmt(s.sumR, 1) + 'R</td></tr>'; };
      var verdict;
      if (a.n < 30) verdict = '<div class="alert">Baru <b>' + a.n + ' trade</b>. Sampel di bawah 30 trade terlalu kecil untuk menyimpulkan apa pun. Uji dengan data yang lebih panjang (ekspor dari MT5).</div>';
      else if (res.is.n && res.oos.n && res.oos.avgR < res.is.avgR - 0.25) verdict = '<div class="alert bad">Hasil out-of-sample (' + fmt(res.oos.avgR) + 'R per trade) jauh lebih buruk dari in-sample (' + fmt(res.is.avgR) + 'R). Tanda kuat aturan ini terlalu pas dengan data lama.</div>';
      else if (a.avgR <= 0) verdict = '<div class="alert bad">Rata-rata per trade negatif setelah biaya. Dalam bentuk ini aturannya belum punya keunggulan di data ini.</div>';
      else verdict = '<div class="alert ok">Rata-rata per trade positif dan out-of-sample tidak memburuk tajam. Langkah berikutnya: uji di data yang lebih panjang dan di akun demo sebelum memakai uang sungguhan.</div>';
      var months = {}; res.trades.forEach(function (t) { var m = wib(t.xt - res.opt.tz * 3600).slice(0, 7); months[m] = months[m] || { n: 0, pnl: 0, r: 0 }; months[m].n++; months[m].pnl += t.pnl; months[m].r += t.r; });
      var curve = res.curve, splitIdx = null; for (var i = 0; i < curve.length; i++) if (curve[i][0] >= res.splitT) { splitIdx = i; break; }
      out.innerHTML = '<div class="cc-sec"><div class="spread"><h2 style="margin:0">Hasil: ' + esc(name) + '</h2><span class="pill gray">' + esc(dataLabel) + ' · ' + res.bars.toLocaleString('id-ID') + ' candle</span></div>' +
        '<p class="dim">' + wib(res.from - res.opt.tz * 3600) + ' s/d ' + wib(res.to - res.opt.tz * 3600) + ' WIB. Simulasi masa lalu, bukan jaminan hasil.</p>' + verdict +
        '<div class="cc-stats">' + card('Jumlah trade', a.n) + card('Win rate', a.n ? pct(a.winRate) : '–') + card('Profit factor', a.n ? fmt(a.pf) : '–') + card('Rata-rata per trade', a.n ? fmt(a.avgR) + 'R' : '–', cls(a.avgR)) +
        card('Net P/L', usd(a.net), cls(a.net)) + card('Return', pct(a.ret), cls(a.ret)) + card('Max drawdown', pct(a.maxDD), 'cc-neg') + card('Loss beruntun terpanjang', a.worstStreak) + '</div>' +
        (res.skipped ? '<p class="dim">' + res.skipped + ' sinyal dilewati karena lot minimum 0,01 sudah melebihi risiko yang diizinkan (modal terlalu kecil untuk jarak SL itu).</p>' : '') +
        '<div class="card cc-sec"><h3>Kurva ekuitas</h3><canvas class="cc-canvas" id="bt-cv"></canvas></div>' +
        '<div class="card cc-sec"><h3>In-sample vs out-of-sample</h3><div class="tablewrap"><table class="cc-tbl"><tr><th>Bagian</th><th class="n">Trade</th><th class="n">Win rate</th><th class="n">PF</th><th class="n">Rata-rata</th><th class="n">Total R</th></tr>' +
        row('In-sample (70% awal)', res.is) + row('Out-of-sample (30% akhir)', res.oos) + row('Semua', a) + '</table></div><p class="dim">R = kelipatan risiko. 1R = rugi sebesar risiko per trade; +2R = untung dua kali risiko.</p></div>' +
        '<div class="card cc-sec"><h3>Per bulan</h3><div class="tablewrap"><table class="cc-tbl"><tr><th>Bulan</th><th class="n">Trade</th><th class="n">Total R</th><th class="n">P/L</th></tr>' +
        Object.keys(months).sort().map(function (m) { var x = months[m]; return '<tr><td>' + m + '</td><td class="n">' + x.n + '</td><td class="n ' + cls(x.r) + '">' + fmt(x.r, 1) + 'R</td><td class="n ' + cls(x.pnl) + '">' + usd(x.pnl) + '</td></tr>'; }).join('') + '</table></div></div>' +
        '<div class="card cc-sec"><div class="spread"><h3 style="margin:0">Daftar trade</h3><button class="btn sm ghost" type="button" id="bt-csv">Unduh CSV</button></div><div class="tablewrap" style="margin-top:10px;max-height:480px;overflow-y:auto"><table class="cc-tbl"><tr><th>Masuk (WIB)</th><th>Arah</th><th class="n">Lot</th><th class="n">Entry</th><th class="n">SL</th><th class="n">TP</th><th class="n">Keluar</th><th>Hasil</th><th class="n">R</th><th class="n">P/L</th></tr>' +
        res.trades.slice().reverse().map(function (t) { return '<tr><td>' + wib(t.t - res.opt.tz * 3600) + '</td><td>' + (t.dir > 0 ? 'Buy' : 'Sell') + '</td><td class="n">' + fmt(t.lot) + '</td><td class="n">' + fmt(t.entry) + '</td><td class="n">' + fmt(t.sl) + '</td><td class="n">' + fmt(t.tp) + '</td><td class="n">' + fmt(t.exit) + '</td><td>' + t.why + '</td><td class="n ' + cls(t.r) + '">' + fmt(t.r) + '</td><td class="n ' + cls(t.pnl) + '">' + usd(t.pnl) + '</td></tr>'; }).join('') + '</table></div></div></div>';
      lineChart($('#bt-cv'), curve, { base: res.opt.balance, splitIdx: splitIdx, fmt: function (v) { return '$' + fmt(v, 0); } });
      $('#bt-csv').addEventListener('click', function () {
        download('backtest-' + name.replace(/[^\w]+/g, '-').toLowerCase() + '.csv', 'masuk_wib,keluar_wib,arah,lot,entry,sl,tp,keluar,hasil,r,pnl\n' + res.trades.map(function (t) { return [wib(t.t - res.opt.tz * 3600), wib(t.xt - res.opt.tz * 3600), t.dir > 0 ? 'buy' : 'sell', t.lot, t.entry.toFixed(2), t.sl.toFixed(2), t.tp.toFixed(2), t.exit.toFixed(2), t.why, t.r.toFixed(2), t.pnl.toFixed(2)].map(csvCell).join(','); }).join('\n'));
      });
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ======================= RISK MANAGER =======================
  var rm = $('#rm');
  if (rm) {
    var INST = { XAUUSD: { c: 100, u: 'harga ($)', step: 0.01 }, XAGUSD: { c: 5000, u: 'harga ($)', step: 0.001 }, FX: { c: 100000, u: 'pips', pip: 0.0001 } };
    var D = { mode: 'pribadi', initial: 10000, dayStart: 10000, equity: 10000, dlim: 3, dbasis: 'day', mlim: 10, rpt: 1, maxTrades: 3, tradesToday: 0, lossStreak: 0, stopAfter: 2, inst: 'XAUUSD', slDist: 5, rr: 2, open: [] };
    var P = Object.assign({}, D, json('cc-risk') || {});
    var PRE = { pribadi: { mode: 'pribadi', dlim: 3, dbasis: 'day', mlim: 20, rpt: 1, maxTrades: 3, stopAfter: 2 }, prop5: { mode: 'prop', dlim: 5, dbasis: 'initial', mlim: 10, rpt: 0.5, maxTrades: 3, stopAfter: 2 }, prop4: { mode: 'prop', dlim: 4, dbasis: 'initial', mlim: 8, rpt: 0.5, maxTrades: 2, stopAfter: 2 } };
    var nf = function (k, label, step) { return '<div><label for="rm-' + k + '">' + label + '</label><input id="rm-' + k + '" data-r="' + k + '" type="number" step="' + (step || 'any') + '" value="' + esc(P[k]) + '"></div>'; };
    rm.innerHTML = '<div class="row" style="margin-bottom:12px"><span class="dim">Preset aturan:</span><button class="btn sm ghost" data-rp="pribadi" type="button">Akun pribadi (1%/trade, rugi harian 3%)</button><button class="btn sm ghost" data-rp="prop5" type="button">Prop firm 5% / 10%</button><button class="btn sm ghost" data-rp="prop4" type="button">Prop firm 4% / 8%</button></div>' +
      '<div id="rm-light"></div>' +
      '<div class="grid g2 cc-sec"><div class="card"><h3>Aturan akun</h3><div class="cc-form">' +
      '<div><label for="rm-mode">Jenis akun</label><select id="rm-mode" data-r="mode">' + opt('pribadi', 'Akun pribadi', P.mode) + opt('prop', 'Prop firm', P.mode) + '</select></div>' +
      nf('initial', 'Saldo awal akun ($)') + nf('dlim', 'Batas rugi harian (%)', '0.1') +
      '<div><label for="rm-dbasis">Dasar batas harian</label><select id="rm-dbasis" data-r="dbasis">' + opt('day', 'Saldo awal hari ini', P.dbasis) + opt('initial', 'Saldo awal akun', P.dbasis) + '</select></div>' +
      nf('mlim', 'Batas rugi maksimal (%)', '0.1') + nf('rpt', 'Risiko per trade (%)', '0.1') + nf('maxTrades', 'Maks trade per hari', '1') + nf('stopAfter', 'Stop setelah loss beruntun', '1') + '</div></div>' +
      '<div class="card"><h3>Kondisi hari ini</h3><div class="cc-form">' + nf('dayStart', 'Saldo awal hari ini ($)') + nf('equity', 'Equity sekarang ($)') + nf('tradesToday', 'Trade yang sudah diambil', '1') + nf('lossStreak', 'Loss beruntun hari ini', '1') + '</div>' +
      '<h3 style="margin-top:18px">Rencana trade berikutnya</h3><div class="cc-form"><div><label for="rm-inst">Instrumen</label><select id="rm-inst" data-r="inst">' + opt('XAUUSD', 'XAUUSD (emas)', P.inst) + opt('XAGUSD', 'XAGUSD (perak)', P.inst) + opt('FX', 'Forex xxx/USD', P.inst) + '</select></div>' +
      '<div><label for="rm-slDist" id="rm-slLbl">Jarak SL</label><input id="rm-slDist" data-r="slDist" type="number" step="any" value="' + esc(P.slDist) + '"></div>' + nf('rr', 'Target RR (1 : x)', '0.1') + '</div></div></div>' +
      '<div class="card cc-sec"><div class="spread"><h3 style="margin:0">Posisi masih terbuka</h3><button class="btn sm ghost" type="button" id="rm-add">+ Tambah posisi</button></div><div class="tablewrap" style="margin-top:10px"><table class="cc-tbl" id="rm-open"></table></div><p class="dim">Risiko posisi = jarak entry ke SL × lot × kontrak. Posisi tanpa SL dihitung sebagai bahaya.</p></div>' +
      '<div class="row cc-sec"><button class="btn" type="button" id="rm-save">Simpan profil</button><span class="dim" id="rm-st" aria-live="polite"></span></div>';
    var openRows = function () {
      var t = $('#rm-open');
      t.innerHTML = '<tr><th>Instrumen</th><th>Arah</th><th class="n">Lot</th><th class="n">Entry</th><th class="n">SL</th><th class="n">Risiko</th><th></th></tr>' + (P.open.length ? P.open.map(function (p, i) {
        return '<tr><td><select data-o="' + i + '" data-f="inst" style="min-height:36px">' + opt('XAUUSD', 'XAUUSD', p.inst) + opt('XAGUSD', 'XAGUSD', p.inst) + opt('FX', 'Forex xxx/USD', p.inst) + '</select></td><td><select data-o="' + i + '" data-f="side" style="min-height:36px">' + opt('buy', 'Buy', p.side) + opt('sell', 'Sell', p.side) + '</select></td>' +
          ['lot', 'entry', 'sl'].map(function (f) { return '<td class="n"><input data-o="' + i + '" data-f="' + f + '" type="number" step="any" value="' + esc(p[f]) + '" style="min-height:36px;width:110px"></td>'; }).join('') + '<td class="n" data-risk="' + i + '"></td><td><button class="cc-x" type="button" data-orm="' + i + '">Hapus</button></td></tr>';
      }).join('') : '<tr><td colspan="7" class="dim">Tidak ada posisi terbuka.</td></tr>');
      $$('[data-orm]', t).forEach(function (b) { b.addEventListener('click', function () { P.open.splice(+b.dataset.orm, 1); openRows(); calc(); }); });
    };
    var posRisk = function (p) {
      var I = INST[p.inst] || INST.XAUUSD, lot = +p.lot || 0, e = +p.entry, s = +p.sl;
      if (!s) return { usd: NaN, noSL: true };
      var dist = (p.side === 'sell' ? s - e : e - s); // jarak ke SL searah rugi
      return { usd: Math.max(0, dist) * lot * I.c, noSL: false, locked: dist <= 0 };
    };
    function calc() {
      var I = INST[P.inst] || INST.XAUUSD;
      $('#rm-slLbl').textContent = 'Jarak SL (' + I.u + ')';
      var openRisk = 0, noSL = 0;
      P.open.forEach(function (p, i) { var r = posRisk(p), cell = $('[data-risk="' + i + '"]'); if (r.noSL) { noSL++; if (cell) cell.innerHTML = '<span class="cc-neg">TANPA SL</span>'; } else { openRisk += r.usd; if (cell) cell.innerHTML = r.locked ? '<span class="cc-pos">SL sudah aman</span>' : usd(r.usd); } });
      var basis = P.dbasis === 'initial' ? +P.initial : +P.dayStart;
      var dLimit = basis * P.dlim / 100, lossToday = Math.max(0, P.dayStart - P.equity);
      var dailyRoom = dLimit - lossToday - openRisk;
      var floor = P.initial * (1 - P.mlim / 100), overallRoom = P.equity - floor - openRisk;
      var room = Math.min(dailyRoom, overallRoom), riskWant = P.equity * P.rpt / 100, allowed = Math.max(0, Math.min(riskWant, room));
      var distPrice = P.inst === 'FX' ? P.slDist * I.pip : P.slDist, lot = distPrice > 0 ? Math.floor(allowed / (distPrice * I.c) / 0.01 + 1e-9) * 0.01 : 0;
      var lotRisk = lot * distPrice * I.c, reasons = [];
      if (noSL) reasons.push(noSL + ' posisi terbuka tanpa stop loss. Pasang SL dulu.');
      if (dailyRoom <= 0) reasons.push('Batas rugi harian sudah habis (termasuk risiko posisi terbuka).');
      if (overallRoom <= 0) reasons.push('Equity sudah di atau dekat batas rugi maksimal akun.');
      if (P.tradesToday >= P.maxTrades) reasons.push('Jatah ' + P.maxTrades + ' trade hari ini sudah terpakai.');
      if (P.lossStreak >= P.stopAfter) reasons.push(P.lossStreak + ' loss beruntun. Aturanmu: berhenti setelah ' + P.stopAfter + '.');
      var state, title;
      if (reasons.length || lot < 0.01) { state = 'stop'; title = 'STOP. Jangan buka posisi baru hari ini'; if (!reasons.length) reasons.push('Dengan jarak SL ini, lot minimum 0,01 sudah melebihi risiko yang diizinkan. Perkecil jarak SL atau lewati setup ini.'); }
      else if (allowed < riskWant - 0.005) { state = 'warn'; title = 'Boleh, tapi kurangi ukuran'; reasons.push('Sisa ruang rugi lebih kecil dari risiko normalmu, jadi lot dikecilkan otomatis.'); }
      else { state = 'go'; title = 'Boleh trade sesuai rencana'; }
      var dUsed = dLimit > 0 ? Math.min(1, (lossToday + openRisk) / dLimit) : 1, mUsed = P.initial * P.mlim / 100 > 0 ? Math.min(1, Math.max(0, (P.initial - P.equity + openRisk) / (P.initial * P.mlim / 100))) : 1;
      var tpDist = P.slDist * P.rr;
      $('#rm-light').innerHTML = '<div class="cc-light ' + state + '"><div style="flex:1"><b>' + title + '</b>' + (reasons.length ? '<ul style="margin:6px 0 0;padding-left:18px">' + reasons.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') + '</div></div>' +
        '<div class="cc-stats cc-sec"><div class="card"><div class="dim">Lot trade berikutnya</div><div class="v">' + (state === 'stop' ? '0,00' : fmt(lot)) + '</div><div class="dim">Risiko ' + usd(state === 'stop' ? 0 : lotRisk) + (P.equity > 0 ? ' (' + fmt((state === 'stop' ? 0 : lotRisk) / P.equity * 100) + '%)' : '') + '</div></div>' +
        '<div class="card"><div class="dim">Target TP</div><div class="v">' + fmt(tpDist) + ' <span style="font-size:14px">' + (P.inst === 'FX' ? 'pips' : '$') + '</span></div><div class="dim">Potensi ' + usd(state === 'stop' ? 0 : lotRisk * P.rr) + ' · RR 1:' + fmt(P.rr, 1) + '</div></div>' +
        '<div class="card"><div class="dim">Sisa jatah rugi harian</div><div class="v ' + cls(dailyRoom) + '">' + usd(dailyRoom) + '</div><div class="cc-meter"><i class="' + (dUsed > 0.75 ? 'hot' : '') + '" style="width:' + (dUsed * 100).toFixed(0) + '%"></i></div><div class="dim">Terpakai ' + pct(dUsed, 0) + ' dari ' + usd(dLimit) + '</div></div>' +
        '<div class="card"><div class="dim">Jarak ke batas rugi maksimal</div><div class="v ' + cls(overallRoom) + '">' + usd(overallRoom) + '</div><div class="cc-meter"><i class="' + (mUsed > 0.75 ? 'hot' : '') + '" style="width:' + (mUsed * 100).toFixed(0) + '%"></i></div><div class="dim">Batas equity ' + usd(floor) + '</div></div>' +
        '<div class="card"><div class="dim">Risiko posisi terbuka</div><div class="v">' + usd(openRisk) + '</div><div class="dim">' + P.open.length + ' posisi' + (noSL ? ' · ' + noSL + ' tanpa SL' : '') + '</div></div></div>';
    }
    var onEdit = function (e) {
      var el = e.target;
      if (el.dataset.r) P[el.dataset.r] = el.tagName === 'SELECT' ? el.value : (+el.value || 0);
      if (el.dataset.o != null && P.open[+el.dataset.o]) P.open[+el.dataset.o][el.dataset.f] = el.value;
      calc();
    };
    rm.addEventListener('input', onEdit);
    rm.addEventListener('change', onEdit);
    $$('[data-rp]', rm).forEach(function (b) { b.addEventListener('click', function () { Object.assign(P, PRE[b.dataset.rp]); Object.keys(PRE[b.dataset.rp]).forEach(function (k) { var el = $('[data-r="' + k + '"]', rm); if (el) el.value = P[k]; }); calc(); }); });
    $('#rm-add').addEventListener('click', function () { P.open.push({ inst: P.inst, side: 'buy', lot: 0.01, entry: '', sl: '' }); openRows(); calc(); });
    $('#rm-save').addEventListener('click', function () { var st = $('#rm-st'); st.textContent = 'Menyimpan…'; post(BASE + '/risk/api/save', P).then(function (j) { st.textContent = j.error || 'Tersimpan di akunmu.'; }); });
    openRows(); calc();
  }

  // ======================= JURNAL =======================
  var jr = $('#jr');
  if (jr) {
    var T = json('cc-trades') || [], stratNames = json('cc-strats') || [], AI_ON = jr.dataset.ai === '1';
    var MISTAKES = ['FOMO / entry terlambat', 'Entry tanpa konfirmasi', 'Tanpa stop loss', 'SL digeser menjauh', 'Lot terlalu besar', 'Revenge trade', 'Exit terlalu cepat', 'Melanggar batas harian', 'Trading saat berita besar', 'Di luar rencana/setup'];
    var EMO = ['Tenang', 'Ragu', 'Takut', 'Serakah', 'Kesal/emosi', 'Bosan'];
    var CONTRACT = function (sym) { sym = String(sym || '').toUpperCase(); return /XAU/.test(sym) ? 100 : /XAG/.test(sym) ? 5000 : 100000; };
    var R = function (t) { if (t.sl == null || t.entry == null || t.exit_price == null || t.sl === t.entry) return null; var d = t.side === 'sell' ? -1 : 1; return d * (t.exit_price - t.entry) / Math.abs(t.entry - t.sl); };
    var filt = { period: 'all', sym: '' };

    jr.innerHTML = '<div class="row" style="margin-bottom:14px"><button class="btn" type="button" id="jr-new">+ Catat trade</button><label class="btn ghost" style="cursor:pointer">Impor dari MT5 (HTML)<input type="file" id="jr-mt5" accept=".htm,.html" hidden></label><label class="btn ghost sm" style="cursor:pointer">Impor CSV<input type="file" id="jr-csv" accept=".csv,text/csv" hidden></label><button class="btn ghost sm" type="button" id="jr-tpl">Template CSV</button><button class="btn ghost sm" type="button" id="jr-exp">Ekspor CSV</button><span class="dim" id="jr-st" aria-live="polite"></span></div>' +
      '<div class="row" style="margin-bottom:14px"><select id="jr-period" style="width:auto"><option value="all">Semua waktu</option><option value="90">90 hari</option><option value="30">30 hari</option><option value="7">7 hari</option></select><select id="jr-sym" style="width:auto"></select></div>' +
      '<div id="jr-stats"></div>' +
      '<div class="card cc-sec"><div class="spread"><h3 style="margin:0">Review AI atas kebiasaanmu</h3><button class="btn sm" type="button" id="jr-ai"' + (AI_ON ? '' : ' disabled') + '>Minta review</button></div><p class="dim" style="margin:8px 0 0">' + (AI_ON ? 'AI membaca ringkasan statistik jurnal (bukan data pribadimu) lalu memberi 3 aturan perbaikan. Maks 5 kali per 24 jam.' : 'Review AI sedang tidak aktif. Statistik di atas tetap bisa kamu baca sendiri.') + '</p><div id="jr-aiout" class="prose" style="font-size:16px;margin-top:10px"></div></div>' +
      '<div class="card cc-sec"><h3>Daftar trade</h3><div class="tablewrap" style="max-height:560px;overflow-y:auto"><table class="cc-tbl" id="jr-tbl"></table></div></div>' +
      '<dialog class="cc-dlg" id="jr-dlg"><form method="dialog" id="jr-form"></form></dialog>';

    var dlg = $('#jr-dlg'), frm = $('#jr-form');
    function tagBoxes(sel) { sel = String(sel || '').split('|'); return '<div class="cc-tags">' + MISTAKES.map(function (m) { return '<label><input type="checkbox" name="mis" value="' + esc(m) + '"' + (sel.indexOf(m) >= 0 ? ' checked' : '') + '> ' + esc(m) + '</label>'; }).join('') + '</div>'; }
    function labelFields(t) {
      return '<div class="full"><label>Setup</label><input name="setup" list="jr-setups" maxlength="80" value="' + esc(t.setup || '') + '" placeholder="Mis. Pullback EMA 9 London"><datalist id="jr-setups">' + uniq(stratNames.concat(T.map(function (x) { return x.setup; }))).map(function (s) { return '<option value="' + esc(s) + '">'; }).join('') + '</datalist></div>' +
        '<div class="full"><label>Kesalahan (kalau ada)</label>' + tagBoxes(t.mistakes) + '</div>' +
        '<div><label>Emosi saat entry</label><select name="emotion"><option value="">–</option>' + EMO.map(function (e) { return opt(e, e, t.emotion); }).join('') + '</select></div>' +
        '<div class="full"><label>Catatan</label><textarea name="notes" maxlength="1000" style="min-height:70px">' + esc(t.notes || '') + '</textarea></div>';
    }
    function uniq(a) { var s = {}; return a.filter(function (x) { x = String(x || '').trim(); if (!x || s[x]) return false; s[x] = 1; return true; }); }
    function readLabels() { var f = new FormData(frm); return { setup: f.get('setup') || '', mistakes: f.getAll('mis').join('|'), emotion: f.get('emotion') || '', notes: f.get('notes') || '' }; }
    function openNew() {
      var now = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16);
      frm.innerHTML = '<h3 style="margin-top:0">Catat trade</h3><div class="cc-form">' +
        '<div><label>Waktu buka (WIB)</label><input name="opened_at" type="datetime-local" value="' + now + '" required></div><div><label>Waktu tutup</label><input name="closed_at" type="datetime-local" value="' + now + '"></div>' +
        '<div><label>Simbol</label><input name="symbol" value="XAUUSD" maxlength="20"></div><div><label>Arah</label><select name="side"><option value="buy">Buy</option><option value="sell">Sell</option></select></div>' +
        '<div><label>Lot</label><input name="lot" type="number" step="0.01" value="0.01"></div><div><label>Entry</label><input name="entry" type="number" step="any"></div>' +
        '<div><label>Stop loss</label><input name="sl" type="number" step="any"></div><div><label>Take profit</label><input name="tp" type="number" step="any"></div>' +
        '<div><label>Harga keluar</label><input name="exit_price" type="number" step="any"></div><div><label>P/L ($)</label><input name="pnl" type="number" step="any" placeholder="Otomatis bila kosong"></div>' +
        labelFields({}) + '</div><div class="row" style="margin-top:14px"><button class="btn" value="ok">Simpan</button><button class="btn ghost" value="cancel" formnovalidate>Batal</button><span class="dim" id="jr-fst"></span></div>';
      frm.onsubmit = function (e) {
        if (e.submitter && e.submitter.value === 'cancel') return;
        e.preventDefault();
        var f = new FormData(frm), t = { opened_at: (f.get('opened_at') || '').replace('T', ' '), closed_at: (f.get('closed_at') || '').replace('T', ' '), symbol: f.get('symbol'), side: f.get('side') };
        ['lot', 'entry', 'sl', 'tp', 'exit_price', 'pnl'].forEach(function (k) { var v = f.get(k); t[k] = v === '' || v == null ? null : +v; });
        if (t.pnl == null && t.entry != null && t.exit_price != null && t.lot) { t.pnl = +((t.side === 'sell' ? -1 : 1) * (t.exit_price - t.entry) * t.lot * CONTRACT(t.symbol)).toFixed(2); if (CONTRACT(t.symbol) === 100000) { $('#jr-fst').textContent = 'Untuk forex, isi P/L dalam $ secara manual (nilai pip tergantung pair).'; if (!/USD$/i.test(t.symbol)) return; } }
        if (t.pnl == null) { $('#jr-fst').textContent = 'Isi P/L, atau entry + harga keluar + lot.'; return; }
        Object.assign(t, readLabels());
        post(BASE + '/jurnal/api/add', t).then(function (j) { if (j.error) { $('#jr-fst').textContent = j.error; return; } T = j.trades; dlg.close(); render(); });
      };
      dlg.showModal();
    }
    function openLabel(id) {
      var t = T.find(function (x) { return x.id === id; });
      frm.innerHTML = '<h3 style="margin-top:0">Label trade · ' + esc(t.symbol) + ' ' + esc(t.side) + ' · ' + esc(String(t.opened_at).slice(0, 16)) + '</h3><div class="cc-form">' + labelFields(t) + '</div><div class="row" style="margin-top:14px"><button class="btn" value="ok">Simpan</button><button class="btn ghost" value="cancel" formnovalidate>Batal</button></div>';
      frm.onsubmit = function (e) { if (e.submitter && e.submitter.value === 'cancel') return; e.preventDefault(); post(BASE + '/jurnal/api/' + id + '/label', readLabels()).then(function (j) { if (j.trades) { T = j.trades; dlg.close(); render(); } }); };
      dlg.showModal();
    }
    function filtered() {
      var cut = filt.period === 'all' ? '' : new Date(Date.now() - (+filt.period) * 864e5 + 7 * 3600e3).toISOString().slice(0, 19).replace('T', ' ');
      return T.filter(function (t) { return (!cut || String(t.closed_at || t.opened_at) >= cut) && (!filt.sym || t.symbol === filt.sym); });
    }
    function group(list, keyFn) {
      var g = {}; list.forEach(function (t) { [].concat(keyFn(t)).forEach(function (k) { if (!k) return; g[k] = g[k] || { n: 0, w: 0, pnl: 0, rs: 0, rn: 0 }; var x = g[k]; x.n++; if (t.pnl > 0) x.w++; x.pnl += t.pnl || 0; var r = R(t); if (r != null) { x.rs += r; x.rn++; } }); });
      return Object.keys(g).map(function (k) { return Object.assign({ k: k }, g[k]); });
    }
    function gtable(title, rows, note) {
      if (!rows.length) return '';
      return '<div class="card"><h3>' + title + '</h3><div class="tablewrap"><table class="cc-tbl"><tr><th></th><th class="n">Trade</th><th class="n">Win</th><th class="n">Rata R</th><th class="n">P/L</th></tr>' +
        rows.map(function (x) { return '<tr><td style="white-space:normal">' + esc(x.k) + '</td><td class="n">' + x.n + '</td><td class="n">' + pct(x.w / x.n, 0) + '</td><td class="n ' + cls(x.rs) + '">' + (x.rn ? fmt(x.rs / x.rn) : '–') + '</td><td class="n ' + cls(x.pnl) + '">' + usd(x.pnl) + '</td></tr>'; }).join('') + '</table></div>' + (note ? '<p class="dim">' + note + '</p>' : '') + '</div>';
    }
    var DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var lastSummary = '';
    function render() {
      var syms = uniq(T.map(function (t) { return t.symbol; })), ss = $('#jr-sym');
      ss.innerHTML = '<option value="">Semua simbol</option>' + syms.map(function (s) { return opt(s, s, filt.sym); }).join('');
      var L = filtered(), chron = L.slice().reverse(), n = L.length, w = 0, gp = 0, gl = 0, rs = 0, rn = 0, streak = 0, worst = 0, cum = 0, pts = [];
      chron.forEach(function (t) { var p = t.pnl || 0; if (p > 0) { w++; gp += p; streak = 0; } else { gl -= p; streak++; worst = Math.max(worst, streak); } var r = R(t); if (r != null) { rs += r; rn++; } cum += p; pts.push([0, cum]); });
      var net = gp - gl, mis = group(L, function (t) { return String(t.mistakes || '').split('|'); }).sort(function (a, b) { return a.pnl - b.pnl; });
      var misCost = L.filter(function (t) { return t.mistakes; }).reduce(function (a, t) { return a + (t.pnl || 0); }, 0);
      var clean = L.filter(function (t) { return !t.mistakes; }), cleanNet = clean.reduce(function (a, t) { return a + (t.pnl || 0); }, 0);
      var bySetup = group(L, function (t) { return t.setup || '(tanpa label)'; }).sort(function (a, b) { return b.pnl - a.pnl; });
      var byEmo = group(L, function (t) { return t.emotion; }).sort(function (a, b) { return a.pnl - b.pnl; });
      var byDay = group(L, function (t) { var d = new Date(String(t.opened_at).replace(' ', 'T') + 'Z'); return isNaN(d) ? '' : DAYS[d.getUTCDay()]; }).sort(function (a, b) { return DAYS.indexOf(a.k) - DAYS.indexOf(b.k); });
      var byHour = group(L, function (t) { var h = String(t.opened_at).slice(11, 13); return h ? h + '.00–' + h + '.59' : ''; }).sort(function (a, b) { return a.k < b.k ? -1 : 1; });
      var card = function (k, v, c) { return '<div class="card"><div class="dim">' + k + '</div><div class="v ' + (c || '') + '">' + v + '</div></div>'; };
      $('#jr-stats').innerHTML = !n ? '<div class="alert">Belum ada trade' + (T.length ? ' di filter ini' : '') + '. Catat trade pertamamu atau impor riwayat dari MT5 (panduan di <a href="' + BASE + '/broker">Broker &amp; MT5</a>).</div>' :
        '<div class="cc-stats">' + card('Trade', n) + card('Net P/L', usd(net), cls(net)) + card('Win rate', pct(w / n)) + card('Profit factor', gl > 0 ? fmt(gp / gl) : '–') + card('Rata-rata R', rn ? fmt(rs / rn) + 'R' : '–', cls(rs)) +
        card('Rata untung / rugi', (w ? usd(gp / w) : '–') + ' / ' + (n - w ? usd(gl / (n - w)) : '–')) + card('Loss beruntun terpanjang', worst) + card('P/L trade berlabel kesalahan', usd(misCost), cls(misCost)) + '</div>' +
        (n < 20 ? '<p class="dim">Sampel masih ' + n + ' trade. Pola baru mulai bisa dipercaya setelah puluhan trade.</p>' : '') +
        '<div class="card cc-sec"><h3>Kurva P/L kumulatif</h3><canvas class="cc-canvas" id="jr-cv"></canvas></div>' +
        '<div class="grid g2 cc-sec">' + gtable('Per setup', bySetup, 'Setup dengan P/L dan rata-rata R terbaik adalah kandidat untuk difokuskan.') +
        gtable('Kesalahan termahal', mis, mis.length ? 'Trade tanpa label kesalahan: ' + clean.length + ' trade, net ' + usd(cleanNet) + '. Bandingkan dengan trade berlabel kesalahan.' : '') +
        gtable('Emosi saat entry', byEmo) + gtable('Hari', byDay) + gtable('Jam buka (sesuai waktu tercatat)', byHour) + '</div>';
      if (n) lineChart($('#jr-cv'), [[0, 0]].concat(pts), { base: 0, fmt: function (v) { return '$' + fmt(v, 0); } });
      $('#jr-tbl').innerHTML = '<tr><th>Buka</th><th>Simbol</th><th>Arah</th><th class="n">Lot</th><th class="n">P/L</th><th class="n">R</th><th>Setup</th><th>Label</th><th></th></tr>' + (L.length ? L.map(function (t) {
        var r = R(t), lab = [t.mistakes ? '<span class="pill bad">' + t.mistakes.split('|').length + ' kesalahan</span>' : '', t.emotion ? '<span class="pill gray">' + esc(t.emotion) + '</span>' : ''].join(' ');
        return '<tr><td>' + esc(String(t.opened_at || '').slice(0, 16)) + '</td><td>' + esc(t.symbol) + '</td><td>' + (t.side === 'sell' ? 'Sell' : 'Buy') + '</td><td class="n">' + (t.lot != null ? fmt(t.lot) : '–') + '</td><td class="n ' + cls(t.pnl) + '">' + usd(t.pnl || 0) + '</td><td class="n ' + cls(r) + '">' + (r != null ? fmt(r) : '–') + '</td><td style="white-space:normal;min-width:120px">' + esc(t.setup || '') + '</td><td>' + lab + '</td>' +
          '<td><button class="cc-x" type="button" data-lab="' + t.id + '">Label</button> <button class="cc-x" type="button" data-jdel="' + t.id + '">Hapus</button></td></tr>';
      }).join('') : '<tr><td colspan="9" class="dim">Kosong.</td></tr>');
      $$('[data-lab]').forEach(function (b) { b.onclick = function () { openLabel(+b.dataset.lab); }; });
      $$('[data-jdel]').forEach(function (b) { b.onclick = function () { if (confirm('Hapus trade ini dari jurnal?')) post(BASE + '/jurnal/api/' + b.dataset.jdel + '/hapus').then(function (j) { if (j.trades) { T = j.trades; render(); } }); }; });
      lastSummary = !n ? '' : ['Periode filter: ' + (filt.period === 'all' ? 'semua' : filt.period + ' hari') + (filt.sym ? ', simbol ' + filt.sym : ''),
        'Jumlah trade: ' + n + ', win rate ' + pct(w / n) + ', net P/L ' + usd(net) + ', profit factor ' + (gl > 0 ? fmt(gp / gl) : '-') + ', rata-rata R ' + (rn ? fmt(rs / rn) : '-') + ' (dari ' + rn + ' trade ber-SL), loss beruntun terpanjang ' + worst,
        'Rata untung ' + (w ? usd(gp / w) : '-') + ', rata rugi ' + (n - w ? usd(gl / (n - w)) : '-'),
        'Per setup: ' + bySetup.map(function (x) { return x.k + ' (' + x.n + ' trade, win ' + pct(x.w / x.n, 0) + ', P/L ' + usd(x.pnl) + ')'; }).join('; '),
        'Kesalahan: ' + (mis.length ? mis.map(function (x) { return x.k + ' (' + x.n + 'x, P/L ' + usd(x.pnl) + ')'; }).join('; ') : 'belum ada label') + '. Trade tanpa kesalahan: ' + clean.length + ' trade, P/L ' + usd(cleanNet),
        'Emosi: ' + (byEmo.length ? byEmo.map(function (x) { return x.k + ' (' + x.n + 'x, P/L ' + usd(x.pnl) + ')'; }).join('; ') : 'belum ada label'),
        'Hari: ' + byDay.map(function (x) { return x.k + ' ' + x.n + 'x ' + usd(x.pnl); }).join('; '),
        'Jam buka: ' + byHour.map(function (x) { return x.k + ' ' + x.n + 'x ' + usd(x.pnl); }).join('; ')].join('\n');
    }
    // ---- Impor MT5 (laporan HTML dari Toolbox → History → Report) ----
    function decode(buf) { var b = new Uint8Array(buf); if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(buf); if (b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder('utf-16be').decode(buf); return new TextDecoder('utf-8').decode(buf); }
    function num(s) { s = String(s == null ? '' : s).replace(/[\s ]/g, ''); if (s === '') return null; var v = +s; return isFinite(v) ? v : null; }
    function parseMT5(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'), rows = $$('tr', doc), on = false, out = [];
      rows.forEach(function (tr) {
        var cells = $$('td,th', tr).filter(function (c) { return !/hidden/.test(c.className); }).map(function (c) { return c.textContent.trim(); }), txt = cells.join(' ').trim();
        if (/^(Positions|Posisi)$/i.test(txt)) { on = true; return; }
        if (/^(Orders|Deals|Order|Transaksi)$/i.test(txt)) { on = false; return; }
        if (!on) return;
        var k = -1; for (var i = 0; i < cells.length; i++) if (/^(buy|sell)$/i.test(cells[i])) { k = i; break; }
        if (k < 3 || cells.length < k + 10) return;
        var profit = num(cells[k + 9]), swap = num(cells[k + 8]) || 0, comm = num(cells[k + 7]) || 0;
        if (profit == null) return;
        out.push({ opened_at: cells[k - 3], ext_id: 'mt5:' + cells[k - 2], symbol: cells[k - 1], side: cells[k].toLowerCase(), lot: num(cells[k + 1]), entry: num(cells[k + 2]), sl: num(cells[k + 3]) || null, tp: num(cells[k + 4]) || null, closed_at: cells[k + 5], exit_price: num(cells[k + 6]), pnl: +(profit + swap + comm).toFixed(2), source: 'mt5' });
      });
      return out;
    }
    function parseCSV(text) {
      var lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(function (x) { return x.trim(); }), delim = lines[0].split(';').length > lines[0].split(',').length ? ';' : ',';
      var split = function (line) { var o = [], cur = '', q = false; for (var i = 0; i < line.length; i++) { var ch = line[i]; if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; } else if (ch === '"') q = true; else if (ch === delim) { o.push(cur); cur = ''; } else cur += ch; } o.push(cur); return o; };
      var head = split(lines[0]).map(function (h) { return h.trim().toLowerCase(); });
      return lines.slice(1).map(function (l) { var p = split(l), t = { source: 'csv' }; head.forEach(function (h, i) { t[h] = p[i]; }); ['lot', 'entry', 'sl', 'tp', 'exit_price', 'pnl'].forEach(function (k) { t[k] = num(t[k]); }); return t; });
    }
    function doImport(list, label) {
      var st = $('#jr-st');
      if (!list.length) { st.textContent = 'Tidak ada trade yang terbaca dari ' + label + '. Pastikan memakai laporan History (Report → HTML) dari MT5 desktop.'; return; }
      st.textContent = 'Mengimpor ' + list.length + ' trade…';
      post(BASE + '/jurnal/api/import', { trades: list }).then(function (j) { if (j.error) { st.textContent = j.error; return; } T = j.trades; render(); st.textContent = j.added + ' trade ditambahkan' + (j.dup ? ', ' + j.dup + ' sudah ada (dilewati)' : '') + (j.bad ? ', ' + j.bad + ' baris tidak lengkap' : '') + '. Beri label setup & kesalahan supaya polanya terbaca.'; });
    }
    $('#jr-mt5').addEventListener('change', function () { var f = this.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { try { doImport(parseMT5(decode(rd.result)), 'file ini'); } catch (e) { $('#jr-st').textContent = 'Gagal membaca file: ' + e.message; } }; rd.readAsArrayBuffer(f); this.value = ''; });
    $('#jr-csv').addEventListener('change', function () { var f = this.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { try { doImport(parseCSV(rd.result), 'CSV'); } catch (e) { $('#jr-st').textContent = 'Gagal membaca CSV: ' + e.message; } }; rd.readAsText(f); this.value = ''; });
    var COLS = ['opened_at', 'closed_at', 'symbol', 'side', 'lot', 'entry', 'sl', 'tp', 'exit_price', 'pnl', 'setup', 'mistakes', 'emotion', 'notes'];
    $('#jr-tpl').addEventListener('click', function () { download('template-jurnal-doktor-trader.csv', COLS.join(',') + '\n2026-11-20 15:30,2026-11-20 16:10,XAUUSD,buy,0.05,4100.50,4095.50,4110.50,4110.50,50,Pullback EMA 9,,Tenang,Contoh baris - hapus sebelum impor\n'); });
    $('#jr-exp').addEventListener('click', function () { download('jurnal-doktor-trader.csv', COLS.join(',') + '\n' + T.map(function (t) { return COLS.map(function (c) { return csvCell(t[c]); }).join(','); }).join('\n')); });
    $('#jr-new').addEventListener('click', openNew);
    $('#jr-period').addEventListener('change', function () { filt.period = this.value; render(); });
    $('#jr-sym').addEventListener('change', function () { filt.sym = this.value; render(); });
    $('#jr-ai').addEventListener('click', function () {
      var out = $('#jr-aiout'), b = this; if (!lastSummary) { out.textContent = 'Jurnal masih kosong.'; return; }
      b.disabled = true; out.textContent = 'AI sedang membaca polamu…';
      post(BASE + '/jurnal/api/review', { summary: lastSummary }).then(function (j) { b.disabled = false; out.innerHTML = j.status === 'ok' ? j.html : esc(j.error || 'Review AI sedang tidak aktif.'); });
    });
    render();
  }
})();
