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

function syncInbox() {
  if (!fs.existsSync(INBOX)) return 0;
  let added = 0;
  const files = fs.readdirSync(INBOX).filter((f) => f.endsWith('.md')).sort();
  for (const f of files) {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(INBOX, f), 'utf8'));
    if (!data.title || body.trim().length < 200) continue;
    const slug = slugify(data.slug || data.title);
    if (db.get('SELECT id FROM articles WHERE slug = ?', [slug])) continue;
    const dateFromName = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
    const publishAt = data.date || dateFromName || new Date().toISOString().slice(0, 10);
    const status = data.status === 'draft' ? 'draft' : 'published';
    db.run(`INSERT INTO articles(slug, title, meta_title, meta_description, focus_keyword, excerpt, body_md, category, tags, status, source, published_at)
      VALUES(?,?,?,?,?,?,?,?,?,?, 'auto', ?)`, [
      slug, data.title.slice(0, 140), (data.meta_title || '').slice(0, 80), (data.meta_description || data.description || '').slice(0, 200),
      (data.focus_keyword || data.keyword || '').slice(0, 80), (data.excerpt || plain(body, 200)).slice(0, 400), body,
      (data.category || 'Edukasi').slice(0, 40), (data.tags || '').slice(0, 200), status, status === 'published' ? publishAt + ' 00:00:00' : null,
    ]);
    added++;
  }
  if (added) db.log(null, 'content-sync', `${added} artikel diimpor`);
  return added;
}

module.exports = { syncInbox, parseFrontmatter, INBOX };
