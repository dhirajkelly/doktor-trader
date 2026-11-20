// Temporary public hosting for scheduled-task uploads (e.g. a rendered video that
// Metricool fetches by URL when Tebar's YouTube quota is used up).
//
//   POST   /media/upload?ext=mp4   Authorization: Bearer <token>   body = raw file bytes
//          -> 201 { url, name, bytes, expires_at }
//   GET    /media/<name>            public, supports Range (video players / fetchers)
//   DELETE /media/<name>            Authorization: Bearer <token>
//
// Only the SHA-256 of the token is stored here; the token itself lives with the
// scheduled task. Files are deleted automatically after RETENTION_DAYS.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const db = require('./db');

const TOKEN_SHA256 = (process.env.MEDIA_UPLOAD_TOKEN_SHA256 ||
  '7f6912dba0a310f617161b20aefa6de59c6e596736a7968a01bb2438b1e83cf3').toLowerCase();
const DIR = path.join(db.DATA_DIR, 'public-media');
const RETENTION_DAYS = 7;
const MAX_FILE = 1024 * 1024 * 1024; // 1 GiB per file
const MAX_TOTAL = 6 * 1024 * 1024 * 1024; // 6 GiB for the whole folder
const TYPES = { mp4: 'video/mp4', mov: 'video/quicktime', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
const NAME_RE = /^[a-f0-9]{32}\.(mp4|mov|jpg|jpeg|png)$/;
const SITE = (process.env.SITE_URL || 'https://dhirajkelly.id').replace(/\/$/, '');

function authorized(req) {
  const m = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  if (!m) return false;
  const got = crypto.createHash('sha256').update(m[1]).digest();
  const want = Buffer.from(TOKEN_SHA256, 'hex');
  return want.length === got.length && crypto.timingSafeEqual(got, want);
}

function listFiles() {
  try {
    return fs.readdirSync(DIR).filter((n) => NAME_RE.test(n) || n.endsWith('.part'))
      .map((n) => { const p = path.join(DIR, n); const s = fs.statSync(p); return { n, p, size: s.size, mtime: s.mtimeMs }; });
  } catch { return []; }
}

function cleanup() {
  const cutoff = Date.now() - RETENTION_DAYS * 86400e3;
  const partCutoff = Date.now() - 6 * 3600e3;
  let removed = 0;
  for (const f of listFiles()) {
    if (f.mtime < (f.n.endsWith('.part') ? partCutoff : cutoff)) { try { fs.unlinkSync(f.p); removed++; } catch {} }
  }
  if (removed) console.log(`[media] removed ${removed} expired file(s)`);
}

const router = express.Router();

router.post('/media/upload', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (!authorized(req)) return res.status(401).json({ error: 'unauthorized' });
  const ext = String(req.query.ext || 'mp4').toLowerCase();
  if (!TYPES[ext]) return res.status(400).json({ error: 'ext must be one of ' + Object.keys(TYPES).join(', ') });
  const declared = parseInt(req.headers['content-length'], 10);
  if (declared > MAX_FILE) return res.status(413).json({ error: 'file too large (max 1 GiB)' });
  const used = listFiles().reduce((a, f) => a + f.size, 0);
  if (used + (declared || 0) > MAX_TOTAL) return res.status(507).json({ error: 'storage full, try again after old files expire' });

  fs.mkdirSync(DIR, { recursive: true });
  const name = crypto.randomBytes(16).toString('hex') + '.' + ext;
  const final = path.join(DIR, name), part = final + '.part';
  const out = fs.createWriteStream(part, { flags: 'wx' });
  let bytes = 0, failed = false;
  const fail = (code, msg) => {
    if (failed) return; failed = true;
    out.destroy(); fs.unlink(part, () => {});
    if (!res.headersSent) res.status(code).json({ error: msg });
    req.destroy();
  };
  req.on('data', (chunk) => { bytes += chunk.length; if (bytes > MAX_FILE) fail(413, 'file too large (max 1 GiB)'); });
  req.on('aborted', () => fail(400, 'upload aborted'));
  out.on('error', (e) => { console.error('[media]', e); fail(500, 'write failed'); });
  out.on('finish', () => {
    if (failed) return;
    if (!bytes) { fs.unlink(part, () => {}); return res.status(400).json({ error: 'empty body' }); }
    if (declared && bytes !== declared) { fs.unlink(part, () => {}); return res.status(400).json({ error: 'incomplete upload' }); }
    fs.rename(part, final, (e) => {
      if (e) { console.error('[media]', e); return res.status(500).json({ error: 'write failed' }); }
      console.log(`[media] stored ${name} (${bytes} bytes)`);
      res.status(201).json({ url: `${SITE}/media/${name}`, name, bytes,
        expires_at: new Date(Date.now() + RETENTION_DAYS * 86400e3).toISOString() });
    });
  });
  req.pipe(out);
});

router.get('/media/:name', (req, res, next) => {
  if (!NAME_RE.test(req.params.name)) return next();
  const p = path.join(DIR, req.params.name);
  if (!fs.existsSync(p)) return next();
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'public, max-age=3600');
  res.type(TYPES[req.params.name.split('.').pop()]);
  res.sendFile(p, { dotfiles: 'deny' });
});

router.delete('/media/:name', (req, res) => {
  if (!authorized(req)) return res.status(401).json({ error: 'unauthorized' });
  if (!NAME_RE.test(req.params.name)) return res.status(400).json({ error: 'bad name' });
  fs.unlink(path.join(DIR, req.params.name), (e) => res.status(e ? 404 : 204).end());
});

function start() {
  cleanup();
  setInterval(cleanup, 3600e3).unref();
}

module.exports = { router, start };
