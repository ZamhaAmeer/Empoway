const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, reportController.createReport);
router.get('/place/:placeId', authenticateToken, reportController.getReportsForPlace);

module.exports = router;

