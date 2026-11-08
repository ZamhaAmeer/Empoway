const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get('/stats', adminController.getAdminStats);
router.get('/pending-places', adminController.getPendingSubmissions);
router.post('/places/:id/approve', adminController.approvePlaceSubmission);
router.post('/places/:id/reject', adminController.rejectPlaceSubmission);
router.post('/places/:id/verify', adminController.verifyPlace);
router.put('/places/:id', adminController.updatePlace);
router.delete('/places/:id', adminController.deletePlace);

// Colombo Directory: Organizations
router.get('/organizations', adminController.getOrganizations);
router.post('/organizations', adminController.createOrganization);
router.put('/organizations/:id', adminController.updateOrganization);
router.delete('/organizations/:id', adminController.deleteOrganization);

// Colombo Directory: Place Creation, CSV Bulk Import & Duplicate Check
router.post('/places', adminController.createPlace);
router.post('/places/csv-import', adminController.importCsvPlaces);
router.post('/places/csv-publish', adminController.publishCsvPlaces);
router.get('/places/duplicates', adminController.getDuplicatePlaces);

router.get('/reports', adminController.getAllReports);
router.post('/reports/:id/review', adminController.reviewReport);
router.post('/photographs/:id/verify', adminController.verifyPhotograph);

router.get('/logs', adminController.getModerationLogs);
router.get('/users', adminController.getUsers);

module.exports = router;

