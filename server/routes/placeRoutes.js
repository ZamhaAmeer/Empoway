const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Categories (Public Preview for homepage)
router.get('/categories', placeController.getCategories);

// Organisations Directory List (Public / Authenticated)
router.get('/organizations', optionalAuth, placeController.getOrganizations);

// Colombo District Areas Directory List (Public / Authenticated)
router.get('/areas', optionalAuth, placeController.getAreas);

// Limited Sample Places Preview (Public Preview for homepage)
router.get('/preview', placeController.getSamplePreviewPlaces);

// Complete Places Exploration & Advanced Search (Requires Authentication)
router.get('/', authenticateToken, placeController.getPlaces);

// Side-by-Side Place Comparison (Requires Authentication)
router.get('/compare', authenticateToken, placeController.comparePlaces);

// Complete Place Accessibility Profile & Auditor Notes (Requires Authentication)
router.get('/:id', authenticateToken, placeController.getPlaceById);

// Personal Accessibility Match Checker (Requires Authentication)
router.get('/:id/personal-match', authenticateToken, placeController.getPersonalMatch);

// Accessible Transport Connection Checker (Requires Authentication)
router.get('/:id/transport-connections', authenticateToken, placeController.getTransportConnections);

// Submit new place (requires authenticated user)
router.post('/', authenticateToken, upload.array('photos', 5), placeController.submitPlace);

// Upload photos for a place (requires authenticated user)
router.post('/:id/photos', authenticateToken, upload.array('photos', 5), placeController.uploadPlacePhotos);

module.exports = router;

