const authService = require('../services/authService');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    const result = await authService.requestOtp(email);
    res.json({ message: result.message });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.cookie('cd_token', result.token, COOKIE_OPTIONS);
    res.json({ message: 'Login successful', user: result.user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function register(req, res) {
  try {
    const result = await authService.registerClinic(req.body);
    res.status(201).json({ message: result.message, clinic: result.clinic });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function logout(req, res) {
  res.clearCookie('cd_token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully.' });
}

async function getMe(req, res) {
  try {
    const { id, role } = req.user;
    if (role === 'admin') {
      return res.json({ user: { id, role, email: req.user.email } });
    }
    const clinicService = require('../services/clinicService');
    const clinic = await clinicService.getClinic(id);
    res.json({ user: { ...clinic, role: 'clinic' } });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { requestOtp, verifyOtp, register, logout, getMe };
