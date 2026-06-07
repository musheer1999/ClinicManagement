const db = require('../config/database');

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM clinics WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    'SELECT id, name, owner_name, email, phone, address, logo_url, subscription_status, subscription_expiry, custom_price, created_at FROM clinics WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function create({ name, owner_name, email, phone, address, logo_url }) {
  const result = await db.query(
    `INSERT INTO clinics (name, owner_name, email, phone, address, logo_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, owner_name, email, phone, address, logo_url, subscription_status, subscription_expiry, created_at`,
    [name, owner_name, email, phone, address, logo_url]
  );
  return result.rows[0];
}

async function update(id, { name, owner_name, phone, address, logo_url }) {
  const result = await db.query(
    `UPDATE clinics SET name=$1, owner_name=$2, phone=$3, address=$4, logo_url=$5
     WHERE id=$6
     RETURNING id, name, owner_name, email, phone, address, logo_url, subscription_status, subscription_expiry`,
    [name, owner_name, phone, address, logo_url, id]
  );
  return result.rows[0];
}

async function findAll() {
  const result = await db.query(
    `SELECT c.id, c.name, c.owner_name, c.email, c.phone, c.address,
            c.subscription_status, c.subscription_expiry, c.custom_price, c.created_at,
            COUNT(p.id)::int AS patient_count
     FROM clinics c
     LEFT JOIN patients p ON p.clinic_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  );
  return result.rows;
}

async function updateSubscription(id, { subscription_status, subscription_expiry }) {
  const result = await db.query(
    `UPDATE clinics SET subscription_status=$1, subscription_expiry=$2 WHERE id=$3
     RETURNING id, name, subscription_status, subscription_expiry`,
    [subscription_status, subscription_expiry, id]
  );
  return result.rows[0];
}

async function updateCustomPrice(id, custom_price) {
  const result = await db.query(
    `UPDATE clinics SET custom_price = $1 WHERE id = $2
     RETURNING id, name, custom_price`,
    [custom_price, id]
  );
  return result.rows[0];
}

module.exports = { findByEmail, findById, create, update, findAll, updateSubscription, updateCustomPrice };
