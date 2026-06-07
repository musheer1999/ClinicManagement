const db = require('../config/database');

async function findAdminByEmail(email) {
  const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function getConfig() {
  const result = await db.query('SELECT * FROM admin_config LIMIT 1');
  return result.rows[0];
}

async function updateConfig({ subscription_price, is_free_for_all }) {
  const result = await db.query(
    `UPDATE admin_config SET subscription_price=$1, is_free_for_all=$2, updated_at=NOW()
     WHERE id=1 RETURNING *`,
    [subscription_price, is_free_for_all]
  );
  return result.rows[0];
}

module.exports = { findAdminByEmail, getConfig, updateConfig };
