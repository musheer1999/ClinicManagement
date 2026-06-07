// authRoutes.js
const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, register, logout, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
