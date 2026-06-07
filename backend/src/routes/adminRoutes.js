const express = require('express');
const router = express.Router();
const { getAllClinics, getClinic, updateSubscription, getConfig, updateConfig, updateCustomPrice } = require('../controllers/adminController');
const { adminMiddleware } = require('../middleware/authMiddleware');

router.use(adminMiddleware);

router.get('/clinics', getAllClinics);
router.get('/clinics/:id', getClinic);
router.put('/clinics/:id/subscription', updateSubscription);
router.put('/clinics/:id/price', updateCustomPrice);
router.get('/config', getConfig);
router.put('/config', updateConfig);

module.exports = router;
