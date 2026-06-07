const express = require('express');
const router = express.Router();
const { getDashboard, getTodayVisits, getVisit, createVisit, downloadPdf, updateVisit } = require('../controllers/visitController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { subscriptionMiddleware } = require('../middleware/subscriptionMiddleware');

router.use(authMiddleware);
router.use(subscriptionMiddleware);

router.get('/dashboard', getDashboard);
router.get('/today', getTodayVisits);
router.post('/', createVisit);
router.get('/:id', getVisit);
router.get('/:id/pdf', downloadPdf);
router.put('/:id', updateVisit);

module.exports = router;
