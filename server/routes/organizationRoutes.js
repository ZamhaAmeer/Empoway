const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { authenticateToken } = require('../middleware/auth');

// Middleware to restrict access only to registered organisations or admins
const requireOrganization = (req, res, next) => {
  if (!req.user || (req.user.role !== 'organization' && req.user.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. The Organization Portal is reserved for accredited institutions (hospitals, universities, banks, and government agencies).'
    });
  }
  next();
};

router.use(authenticateToken, requireOrganization);

// Get organization venue profile
router.get('/my-venue', organizationController.getMyVenue);

// Update venue details and features
router.put('/venues/:id', organizationController.updateMyVenue);

// Respond to an accessibility report or barrier
router.post('/reports/:reportId/respond', organizationController.respondToReport);

module.exports = router;

