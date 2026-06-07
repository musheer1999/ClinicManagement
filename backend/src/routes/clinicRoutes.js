const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/clinicController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
