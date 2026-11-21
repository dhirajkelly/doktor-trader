// Pipeline lead sales: parsing CSV, normalisasi nomor WA / tanggal, dan import dengan dedupe by WhatsApp.
const db = require('./db');

// [kolom DB, label di admin, alias header CSV (sudah dinormalisasi: huruf kecil, tanpa spasi/tanda baca)]
const FIELDS = [
  ['prioritas', 'Prioritas', ['prioritas', 'priority', 'prio']],
  ['nama', 'Nama', ['nama', 'name', 'namalengkap']],
  ['whatsapp', 'WhatsApp', ['whatsapp', 'wa', 'nowa', 'nomorwa', 'nowhatsapp', 'nomorwhatsapp', 'nohp', 'hp', 'telepon']],
  ['langkah_berikut', 'Langkah berikut', ['langkahberikut', 'langkahselanjutnya', 'nextstep']],
  ['pic_sales', 'PIC Sales', ['picsales', 'pic']],
  ['status_fu', 'Status FU', ['statusfu', 'status']],
  ['tgl_fu', 'Tgl FU', ['tglfu', 'tanggalfu']],
  ['hasil_fu', 'Hasil FU', ['hasilfu']],
  ['akun_dupoin', 'Akun Dupoin', ['akundupoin']],
  ['email', 'Email', ['email']],
  ['kota', 'Kota', ['kota', 'city', 'domisili']],
  ['level_trading', 'Level trading', ['leveltrading', 'level', 'pengalaman']],
  ['minat', 'Minat', ['minat']],
  ['sumber', 'Sumber', ['sumber']],
  ['asal_iklan', 'Asal iklan', ['asaliklan']],
  ['tgl_masuk', 'Tgl masuk', ['tglmasuk', 'tanggalmasuk']],
  ['pic_lama', 'PIC lama', ['piclama']],
  ['akun_kvb_form', 'Akun KVB (form)', ['akunkvbform', 'akunkvb']],
  ['akun_kvb_lama', 'Akun KVB lama', ['akunkvblama']],
  ['webinar', 'Webinar', ['webinar']],
  ['riwayat_fu_lama', 'Riwayat FU lama', ['riwayatfulama', 'riwayatfu']],
];
const KEYS = FIELDS.map((f) => f[0]);
const DATE_KEYS = new Set(['tgl_fu', 'tgl_masuk']);
const DEFAULT_SOURCE = 'web-lama-kvb';

const normHeader = (h) => String(h || '').replace(/^﻿/, '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');

// RFC 4180-ish parser: kutip ganda, "" di dalam kutip, baris baru di dalam sel, CRLF. Delimiter dideteksi dari baris pertama.
function parseCsv(text) {
  text = String(text || '').replace(/^﻿/, '');
  const first = text.slice(0, text.search(/\r?\n|$/));
  const delim = [',', ';', '\t'].map((d) => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"' && cell === '') q = true;
    else if (ch === delim) { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

// Nomor WA → format 62xxx. Mengembalikan '' kalau tidak valid.
function normalizeWa(v) {
  const s = String(v || '').trim();
  if (!s || /e\+?\d/i.test(s)) return '';                // notasi ilmiah dari Excel: digit sudah hilang
  let d = s.split(/[\/,;|]|\batau\b/i)[0].trim().replace(/\.0+$/, '').replace(/\D/g, '');   // "81234.0" dari Excel
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (d.startsWith('8')) d = '62' + d;
  if (d.startsWith('620')) d = '62' + d.slice(3);
  return /^62\d{8,13}$/.test(d) ? d : '';
}

const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
const iso = (y, m, d) => {
  y = Number(y); m = Number(m); d = Number(d);
  if (y < 100) y += 2000;
  if (!(y >= 2000 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return '';
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};
// Tanggal → YYYY-MM-DD bila bisa dikenali (format Indonesia d/m/y, ISO, nama bulan, serial Excel); kalau tidak, teks asli.
function normalizeDate(v) {
  const s = String(v || '').trim();
  if (!s) return '';
  let m;
  if ((m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) return iso(m[1], m[2], m[3]) || s;
  if ((m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})\b/))) return iso(m[3], m[2], m[1]) || s;
  if ((m = s.match(/^(\d{1,2})[\s-]+([a-z]{3})[a-z]*\.?[\s-]+(\d{2,4})\b/i)) && BULAN[m[2].toLowerCase()]) return iso(m[3], BULAN[m[2].toLowerCase()], m[1]) || s;
  if (/^\d{5}(\.\d+)?$/.test(s) && Number(s) > 36000 && Number(s) < 60000) {
    return new Date(Date.UTC(1899, 11, 30) + Math.floor(Number(s)) * 864e5).toISOString().slice(0, 10);
  }
  return s;
}

function cleanValue(key, v) {
  let s = String(v == null ? '' : v).trim();
  if (key === 'whatsapp') return normalizeWa(s);
  if (DATE_KEYS.has(key)) return normalizeDate(s);
  if (key === 'email') s = s.toLowerCase();
  return s.slice(0, key === 'riwayat_fu_lama' || key === 'hasil_fu' ? 10000 : 1000);
}

// Membaca CSV dan menggabungkan duplikat di dalam file. Tidak menulis ke DB.
function analyze(text) {
  const rows = parseCsv(text);
  if (!rows.length) return { error: 'File kosong.' };
  const header = rows[0].map(normHeader);
  const colOf = {};
  const unknown = [];
  header.forEach((h, i) => {
    const f = FIELDS.find(([k, , alias]) => alias.includes(h) || normHeader(k) === h);
    if (f && colOf[f[0]] == null) colOf[f[0]] = i;
    else if (h) unknown.push(rows[0][i].trim());
  });
  if (colOf.whatsapp == null) return { error: 'Kolom WhatsApp tidak ditemukan di baris header.' };
  const byWa = new Map();
  const invalid = [];
  let dupInFile = 0;
  rows.slice(1).forEach((r, idx) => {
    const lead = {};
    for (const k of KEYS) lead[k] = colOf[k] == null ? '' : cleanValue(k, r[colOf[k]]);
    if (!lead.whatsapp) {
      invalid.push({ line: idx + 2, nama: lead.nama, wa: String(r[colOf.whatsapp] || '').trim() });
      return;
    }
    const prev = byWa.get(lead.whatsapp);
    if (!prev) { byWa.set(lead.whatsapp, lead); return; }
    dupInFile++;
    for (const k of KEYS) {
      if (!prev[k] && lead[k]) prev[k] = lead[k];
      else if (k === 'riwayat_fu_lama' && lead[k] && !prev[k].includes(lead[k])) prev[k] += '\n' + lead[k];
    }
  });
  return { leads: [...byWa.values()], invalid, dupInFile, unknown, mapped: Object.keys(colOf), total: rows.length - 1 };
}

// Lead yang sudah ada (WA sama) tidak ditimpa: hanya kolom yang masih kosong yang diisi dari CSV,
// supaya hasil edit tim sales tetap aman saat file yang sama di-import ulang.
function importLeads(text, { source = DEFAULT_SOURCE, actor = '', dry = false } = {}) {
  const a = analyze(text);
  if (a.error) return a;
  let inserted = 0, updated = 0, unchanged = 0;
  for (const lead of a.leads) {
    const ex = db.get('SELECT * FROM leads WHERE whatsapp = ?', [lead.whatsapp]);
    if (!ex) {
      inserted++;
      if (!dry) {
        const r = db.run(`INSERT INTO leads(${KEYS.join(',')}, source, updated_by) VALUES(${KEYS.map(() => '?').join(',')}, ?, ?)`,
          [...KEYS.map((k) => lead[k]), source, actor]);
        logLead(r.lastInsertRowid, actor, `Import CSV (${source})`);
      }
      continue;
    }
    const fill = KEYS.filter((k) => k !== 'whatsapp' && lead[k] && !String(ex[k] || '').trim());
    if (!fill.length) { unchanged++; continue; }
    updated++;
    if (!dry) {
      db.run(`UPDATE leads SET ${fill.map((k) => k + ' = ?').join(', ')}, updated_at = datetime('now'), updated_by = ? WHERE id = ?`,
        [...fill.map((k) => lead[k]), actor, ex.id]);
      logLead(ex.id, actor, `Import CSV (${source}) mengisi: ${fill.join(', ')}`);
    }
  }
  if (!dry) db.log(null, 'lead-import', `${source}: ${inserted} baru, ${updated} dilengkapi, ${unchanged} sudah ada, ${a.dupInFile} duplikat di file, ${a.invalid.length} WA tidak valid (oleh ${actor})`);
  return { ...a, leads: undefined, unique: a.leads.length, inserted, updated, unchanged, dry };
}

function logLead(leadId, actor, detail) {
  db.run('INSERT INTO lead_log(lead_id, actor, detail) VALUES(?, ?, ?)', [leadId, actor || '', String(detail).slice(0, 2000)]);
}

module.exports = { FIELDS, KEYS, DATE_KEYS, DEFAULT_SOURCE, parseCsv, normalizeWa, normalizeDate, cleanValue, analyze, importLeads, logLead };
