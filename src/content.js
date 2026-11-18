// Imports markdown articles dropped into content/articles/ (the daily auto-writer
// commits them there) into the database. Each file is imported once, keyed by slug;
// after import the CMS is the source of truth, so edits in the admin are never overwritten.
const fs = require('fs');
const path = require('path');
const db = require('./db');
const { slugify, plain } = require('./views');

const INBOX = process.env.CONTENT_DIR || path.join(__dirname, '..', 'content', 'articles');

function parseFrontmatter(src) {
  const m = String(src).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: String(src) };
  const data = {};
  m[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(':');
    if (i < 1) return;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean).join(', ');
    data[k] = v;
  });
  return { data, body: m[2] };
}

// Compliance gate. An article that trips a hard rule is imported as a DRAFT with the reasons
// in review_notes, so it never goes live without an admin reading it first.
const COMPETITORS = ['vantage', 'exness', 'octafx', 'octa fx', 'hfm', 'hotforex', 'xm.com', 'fbs', 'ic markets', 'icmarkets', 'pepperstone', 'fxtm', 'tickmill', 'fxpro', 'monex', 'valbury', 'didimax', 'mifx', 'finex', 'xtb', 'avatrade', 'roboforex', 'justmarkets', 'headway'];
const HARD_RULES = [
  [/\b(pasti|dijamin|garansi)\s+(profit|untung|cuan|menang)\b/i, 'janji profit ("pasti/dijamin profit")'],
  [/\b(win\s*rate|tingkat kemenangan|akurasi)\s*(sinyal|signal|ea)?\s*(mencapai|hingga|sampai|sebesar)?\s*\d{2,3}\s*%/i, 'menyebut win rate/akurasi dalam persen'],
  [/\b(buy|sell|beli|jual|entry|open)\s+(xauusd|emas|gold|eurusd|gbpusd|usdjpy)?\s*(sekarang|hari ini juga|segera)\b/i, 'ajakan transaksi spesifik ("buy/sell sekarang")'],
  [/\b(profit|return|keuntungan|hasil)\s+(rata-rata\s+)?\d+(,\d+)?\s*%\s*(per|tiap|setiap)\s*(hari|minggu|bulan)\b(?![^.]*\b(tanda bahaya|waspada|bodong|penipuan|janji|tawaran|klaim)\b)/i, 'menyebut return per periode tanpa konteks peringatan'],
  [/\bdari pertanyaan member\b|\bmayoritas member\b|\bbanyak member (kami|saya)\b/i, 'klaim pengalaman member tanpa data'],
];
function wordCount(t) { return String(t || '').replace(/[#*_`>|\-]/g, ' ').split(/\s+/).filter(Boolean).length; }
function review(data, body) {
  const notes = [];
  const text = `${data.title || ''}\n${data.meta_description || ''}\n${body}`;
  const lower = text.toLowerCase();
  const comp = COMPETITORS.filter((c) => new RegExp(`(^|[^a-z])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(lower));
  if (comp.length) notes.push('menyebut broker lain: ' + comp.join(', '));
  for (const [re, why] of HARD_RULES) if (re.test(text)) notes.push(why);
  const wc = wordCount(body);
  if (wc < 700) notes.push(`terlalu pendek (${wc} kata, minimal 700)`);
  for (const k of ['title', 'meta_description', 'focus_keyword', 'category']) if (!data[k]) notes.push(`frontmatter ${k} kosong`);
  return notes;
}

function syncInbox() {
  if (!fs.existsSync(INBOX)) return 0;
  let added = 0;
  const files = fs.readdirSync(INBOX).filter((f) => f.endsWith('.md')).sort();
  for (const f of files) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(INBOX, f), 'utf8'));
    if (!data.title || body.trim().length < 200) continue;
    const slug = slugify(data.slug || data.title);
    const rev = Math.max(1, parseInt(data.revision, 10) || 1);
    const existing = db.get('SELECT id, src_rev, edited_in_cms, source FROM articles WHERE slug = ?', [slug]);
    if (existing) {
      // A corrected file (revision: N in frontmatter) updates the live article, unless it was edited in the admin.
      if (existing.source === 'auto' && !existing.edited_in_cms && rev > (existing.src_rev || 1)) {
        const notes = review(data, body);
        db.run(`UPDATE articles SET title=?, meta_title=?, meta_description=?, focus_keyword=?, excerpt=?, body_md=?, category=?, tags=?, src_rev=?,
          status = CASE WHEN ? != '' THEN 'draft' WHEN COALESCE(review_notes, '') != '' THEN 'published' ELSE status END,
          published_at = CASE WHEN ? = '' AND COALESCE(review_notes, '') != '' THEN COALESCE(published_at, datetime('now')) ELSE published_at END,
          review_notes=?, updated_at=datetime('now') WHERE id=?`, [
          data.title.slice(0, 140), (data.meta_title || '').slice(0, 80), (data.meta_description || '').slice(0, 200), (data.focus_keyword || '').slice(0, 80),
          (data.excerpt || plain(body, 200)).slice(0, 400), body, (data.category || 'Edukasi').slice(0, 40), (data.tags || '').slice(0, 200), rev,
          notes.join('; '), notes.join('; '), notes.join('; '), existing.id]);
        db.log(null, 'content-update', `${slug} → rev ${rev}${notes.length ? ' (ditahan: ' + notes.join('; ') + ')' : ''}`);
        added++;
      }
      continue;
    }
    const notes = review(data, body);
    const dateFromName = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
    const publishAt = data.date || dateFromName || new Date().toISOString().slice(0, 10);
    const status = data.status === 'draft' || notes.length ? 'draft' : 'published';
    // Goes live at 07:00 WIB (00:00 UTC) on its date. If that moment has passed and the file is
    // dated today, use the import time so several articles on one day keep their real order.
    const nowUtc = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let publishTs = publishAt + ' 00:00:00';
    if (publishTs < nowUtc && publishAt === nowUtc.slice(0, 10)) publishTs = nowUtc;
    if (notes.length) db.log(null, 'content-hold', `${slug}: ${notes.join('; ')}`);
    db.run(`INSERT INTO articles(slug, title, meta_title, meta_description, focus_keyword, excerpt, body_md, category, tags, status, source, published_at, src_rev, review_notes)
      VALUES(?,?,?,?,?,?,?,?,?,?, 'auto', ?, ?, ?)`, [
      slug, data.title.slice(0, 140), (data.meta_title || '').slice(0, 80), (data.meta_description || data.description || '').slice(0, 200),
      (data.focus_keyword || data.keyword || '').slice(0, 80), (data.excerpt || plain(body, 200)).slice(0, 400), body,
      (data.category || 'Edukasi').slice(0, 40), (data.tags || '').slice(0, 200), status, status === 'published' ? publishTs : null, rev, notes.join('; '),
    ]);
    added++;
  }
  if (added) db.log(null, 'content-sync', `${added} artikel diimpor`);
  return added;
}

module.exports = { syncInbox, parseFrontmatter, review, INBOX };
