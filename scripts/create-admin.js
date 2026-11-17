// Usage: node scripts/create-admin.js <email> "<Nama>" [password]
// Creates (or promotes) an approved admin. Prints a generated password if none given.
const crypto = require('crypto');
const db = require('../src/db');
const { hashPassword } = require('../src/auth');

(async () => {
  const [email, name = 'Admin', pw] = process.argv.slice(2);
  if (!email) { console.error('Usage: node scripts/create-admin.js <email> "<Nama>" [password]'); process.exit(1); }
  await db.init();
  const password = pw || 'DT-' + crypto.randomBytes(6).toString('base64url');
  const hash = await hashPassword(password);
  const e = email.trim().toLowerCase();
  const u = db.get('SELECT id FROM users WHERE email = ?', [e]);
  if (u) db.run("UPDATE users SET role='admin', status='approved', password_hash=?, approved_at=COALESCE(approved_at, datetime('now')) WHERE id=?", [hash, u.id]);
  else db.run("INSERT INTO users(name, email, whatsapp, password_hash, role, status, source, approved_at) VALUES(?,?,?,?, 'admin','approved','cli', datetime('now'))", [name, e, '', hash]);
  db.saveNow();
  console.log(`Admin siap: ${e}\nPassword: ${password}\n(Ganti password setelah login di /member/akun)`);
  process.exit(0);
})();
