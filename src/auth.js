const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('./db');

const COOKIE = 'dt_sid';
const SESSION_DAYS = 30;
const SECURE = process.env.NODE_ENV === 'production';

function parseCookies(header = '') {
  const out = {};
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function hashPassword(pw) {
  return bcrypt.hashSync(pw, 10);
}

function checkPassword(pw, hash) {
  try { return bcrypt.compareSync(pw, hash); } catch { return false; }
}

function createSession(res, userId) {
  const id = crypto.randomBytes(32).toString('hex');
  const csrf = crypto.randomBytes(16).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  db.run('INSERT INTO sessions(id, user_id, csrf, expires_at) VALUES(?, ?, ?, ?)', [id, userId, csrf, expires.toISOString()]);
  res.setHeader('Set-Cookie', `${COOKIE}=${id}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${SECURE ? '; Secure' : ''}`);
}

function destroySession(req, res) {
  if (req.sessionId) db.run('DELETE FROM sessions WHERE id = ?', [req.sessionId]);
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${SECURE ? '; Secure' : ''}`);
}

// Attaches req.user, req.csrf. Anonymous visitors get a csrf token from a lightweight cookie.
function loadSession(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  req.cookies = cookies;
  const sid = cookies[COOKIE];
  if (sid) {
    const s = db.get('SELECT * FROM sessions WHERE id = ?', [sid]);
    if (s && new Date(s.expires_at) > new Date()) {
      const user = db.get('SELECT * FROM users WHERE id = ?', [s.user_id]);
      if (user) {
        req.user = user;
        req.sessionId = sid;
        req.csrf = s.csrf;
        user._csrf = s.csrf;
      }
    }
  }
  if (!req.csrf) {
    let anon = cookies.dt_csrf;
    if (!anon || !/^[a-f0-9]{32}$/.test(anon)) {
      anon = crypto.randomBytes(16).toString('hex');
      res.append('Set-Cookie', `dt_csrf=${anon}; Path=/; HttpOnly; SameSite=Lax${SECURE ? '; Secure' : ''}`);
    }
    req.csrf = anon;
  }
  res.locals.user = req.user || null;
  res.locals.csrf = req.csrf;
  next();
}

function verifyCsrf(req, res, next) {
  if (req.method !== 'POST') return next();
  const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
  if (!token || token !== req.csrf) {
    return res.status(403).send('Sesi kedaluwarsa. Muat ulang halaman lalu coba lagi.');
  }
  next();
}

function requireLogin(req, res, next) {
  if (!req.user) return res.redirect('/masuk?next=' + encodeURIComponent(req.originalUrl));
  next();
}

function requireApproved(req, res, next) {
  if (!req.user) return res.redirect('/masuk?next=' + encodeURIComponent(req.originalUrl));
  if (req.user.role === 'admin' || req.user.status === 'approved') return next();
  return res.redirect('/member/menunggu');
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.redirect('/masuk?next=' + encodeURIComponent(req.originalUrl));
  if (req.user.role !== 'admin') return res.status(403).send('Khusus admin.');
  next();
}

// Very small in-memory limiter for login/register brute force.
const hits = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length <= max;
}

module.exports = {
  hashPassword, checkPassword, createSession, destroySession, loadSession,
  verifyCsrf, requireLogin, requireApproved, requireAdmin, rateLimit,
};
