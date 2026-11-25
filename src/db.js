// SQLite via sql.js (pure WebAssembly, no native build needed on the server).
// The whole DB lives in memory and is flushed to disk shortly after every write.
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'doktor-trader.sqlite');

let db = null;
let saveTimer = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT,
  vantage_email TEXT,
  vantage_account TEXT,
  experience TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',          -- member | admin
  status TEXT NOT NULL DEFAULT 'pending',       -- pending | approved | rejected | suspended
  source TEXT,
  tags TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved_at TEXT,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  csrf TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  excerpt TEXT,
  body_md TEXT NOT NULL,
  category TEXT DEFAULT 'Edukasi',
  tags TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',         -- draft | published
  source TEXT DEFAULT 'cms',                    -- cms | auto
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  level TEXT DEFAULT 'Pemula',
  summary TEXT,
  position INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT,
  body_md TEXT DEFAULT '',
  duration_min INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  UNIQUE(course_id, slug)
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(user_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  topic TEXT,
  body TEXT NOT NULL,
  answer TEXT,
  answered_at TEXT,
  is_public INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,                           -- ea | signal | copytrade
  title TEXT NOT NULL,
  description TEXT,
  risk_note TEXT,
  link_url TEXT,
  link_label TEXT DEFAULT 'Buka',
  position INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,            -- broker_click | wa_click | daftar_click | telegram
  path TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  instrument TEXT DEFAULT 'XAUUSD',
  timeframe TEXT DEFAULT 'H1',
  verdict TEXT DEFAULT 'entry',                 -- entry | skip
  context_md TEXT,                              -- kondisi pasar
  entry_md TEXT,                                -- kenapa entry (atau kenapa tidak)
  sl_md TEXT,                                   -- di mana stop loss dan kenapa
  tp_md TEXT,                                   -- target dan risk-reward
  invalid_md TEXT,                              -- kapan setup batal
  lesson_md TEXT,                               -- pelajaran
  image_url TEXT,
  is_illustration INTEGER DEFAULT 1,            -- 1 = ilustrasi edukasi, bukan data harga riil
  published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS webinars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  starts_at TEXT NOT NULL,                      -- waktu WIB, format YYYY-MM-DD HH:MM
  description TEXT,
  join_url TEXT,
  replay_url TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS webinar_regs (
  webinar_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (webinar_id, user_id)
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE TABLE IF NOT EXISTS cc_strategies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  rules_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS cc_journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  opened_at TEXT,
  closed_at TEXT,
  symbol TEXT,
  side TEXT,
  lot REAL,
  entry REAL,
  sl REAL,
  tp REAL,
  exit_price REAL,
  pnl REAL,
  setup TEXT DEFAULT '',
  mistakes TEXT DEFAULT '',
  emotion TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  source TEXT DEFAULT 'manual',
  ext_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cc_journal_user ON cc_journal(user_id, opened_at);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  whatsapp TEXT NOT NULL UNIQUE,                -- format 62xxx, kunci dedupe
  prioritas TEXT DEFAULT '',
  nama TEXT DEFAULT '',
  langkah_berikut TEXT DEFAULT '',
  pic_sales TEXT DEFAULT '',
  status_fu TEXT DEFAULT '',
  tgl_fu TEXT DEFAULT '',                       -- YYYY-MM-DD bila bisa dikenali
  hasil_fu TEXT DEFAULT '',
  akun_dupoin TEXT DEFAULT '',
  email TEXT DEFAULT '',
  kota TEXT DEFAULT '',
  level_trading TEXT DEFAULT '',
  minat TEXT DEFAULT '',
  sumber TEXT DEFAULT '',
  asal_iklan TEXT DEFAULT '',
  tgl_masuk TEXT DEFAULT '',
  pic_lama TEXT DEFAULT '',
  akun_kvb_form TEXT DEFAULT '',
  akun_kvb_lama TEXT DEFAULT '',
  webinar TEXT DEFAULT '',
  riwayat_fu_lama TEXT DEFAULT '',
  catatan TEXT DEFAULT '',
  source TEXT DEFAULT 'web-lama-kvb',           -- asal data import, mis. web-lama-kvb
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_leads_pic ON leads(pic_sales);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_fu);
CREATE TABLE IF NOT EXISTS lead_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  actor TEXT DEFAULT '',
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lead_log_lead ON lead_log(lead_id);
CREATE TABLE IF NOT EXISTS cc_risk (
  user_id INTEGER PRIMARY KEY,
  json TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
`;

async function init() {
  const SQL = await initSqlJs();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    db = new SQL.Database(fs.readFileSync(DB_FILE));
  } else {
    db = new SQL.Database();
  }
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  migrate();
  saveNow();
  return db;
}

// Additive column migrations for databases created before a column existed.
function migrate() {
  const cols = (t) => { const r = db.exec(`PRAGMA table_info(${t})`); return r.length ? r[0].values.map((v) => v[1]) : []; };
  const add = (t, c, def) => { if (!cols(t).includes(c)) db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} ${def}`); };
  add('articles', 'src_rev', 'INTEGER DEFAULT 1');          // revision of the markdown file last imported
  if (!cols('articles').includes('edited_in_cms')) {
    add('articles', 'edited_in_cms', 'INTEGER DEFAULT 0');  // 1 = changed in admin, never overwritten by file updates
    // Articles whose updated_at moved after import were edited in the admin before this column existed.
    db.exec("UPDATE articles SET edited_in_cms = 1 WHERE updated_at > datetime(created_at, '+2 minutes')");
  }
  add('articles', 'review_notes', "TEXT DEFAULT ''");        // why the compliance gate held it as draft
  db.exec('CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at)');
  add('users', 'dupoin_uid', 'INTEGER');                   // UID in the Dupoin partner portal, once matched
  add('users', 'dupoin_check', "TEXT DEFAULT ''");         // last result of the referral check, shown in admin
  add('users', 'dupoin_checked_at', 'TEXT');
  add('questions', 'ai_answer', 'TEXT');                   // jawaban otomatis asisten AI
  add('questions', 'ai_status', "TEXT DEFAULT ''");        // ok | off | error
  add('questions', 'ai_at', 'TEXT');
}

function saveNow() {
  if (!db) return;
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, Buffer.from(db.export()));
  fs.renameSync(tmp, DB_FILE);
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 200);
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    return rows;
  } finally {
    stmt.free();
  }
}

function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  const id = get('SELECT last_insert_rowid() AS id').id;
  const changes = db.getRowsModified();
  scheduleSave();
  return { lastInsertRowid: id, changes };
}

function setting(key, fallback = '') {
  const row = get('SELECT value FROM settings WHERE key = ?', [key]);
  return row ? row.value : fallback;
}

function setSetting(key, value) {
  run('INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, value]);
}

function log(userId, action, detail = '') {
  run('INSERT INTO activity(user_id, action, detail) VALUES(?, ?, ?)', [userId || null, action, String(detail).slice(0, 500)]);
}

process.on('exit', saveNow);
['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => { saveNow(); process.exit(0); }));

module.exports = { init, all, get, run, setting, setSetting, log, saveNow, DATA_DIR };
