const express = require('express');
const router = express.Router();
const { getPatients, getPatient, createPatient, updatePatient } = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { subscriptionMiddleware } = require('../middleware/subscriptionMiddleware');

router.use(authMiddleware);
router.use(subscriptionMiddleware);

router.get('/', getPatients);
router.post('/', createPatient);
router.get('/:id', getPatient);
router.put('/:id', updatePatient);

module.exports = router;
