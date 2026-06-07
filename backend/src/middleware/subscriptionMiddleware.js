const db = require('../config/database');

async function subscriptionMiddleware(req, res, next) {
  try {
    const config = await db.query('SELECT is_free_for_all FROM admin_config LIMIT 1');
    if (config.rows[0]?.is_free_for_all) return next();

    const clinic = await db.query(
      'SELECT subscription_status, subscription_expiry FROM clinics WHERE id = $1',
      [req.user.id]
    );
    const c = clinic.rows[0];
    if (!c) return res.status(404).json({ error: 'Clinic not found.' });

    if (c.subscription_status === 'free') return next();

    if (c.subscription_status === 'active' && new Date(c.subscription_expiry) >= new Date()) {
      return next();
    }

    return res.status(403).json({ error: 'Subscription expired. Please contact admin.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking subscription.' });
  }
}

module.exports = { subscriptionMiddleware };
