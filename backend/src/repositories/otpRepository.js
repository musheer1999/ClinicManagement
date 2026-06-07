const db = require('../config/database');

async function saveOtp(email, otp) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await db.query(
    'INSERT INTO otp_tokens (email, otp, expires_at) VALUES ($1, $2, $3)',
    [email, otp, expiresAt]
  );
}

async function findValidOtp(email, otp) {
  const result = await db.query(
    `SELECT * FROM otp_tokens
     WHERE email = $1 AND otp = $2 AND used = false AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp]
  );
  return result.rows[0] || null;
}

async function markOtpUsed(id) {
  await db.query('UPDATE otp_tokens SET used = true WHERE id = $1', [id]);
}

async function cleanExpiredOtps() {
  await db.query('DELETE FROM otp_tokens WHERE expires_at < NOW()');
}

module.exports = { saveOtp, findValidOtp, markOtpUsed, cleanExpiredOtps };
