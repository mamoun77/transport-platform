const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques
router.get('/', destinationController.getDestinations);
router.get('/:slug', destinationController.getDestinationBySlug);

// Routes admin
router.get('/admin/all', authenticateToken, requireAdmin, destinationController.getAllDestinations);
router.post('/admin', authenticateToken, requireAdmin, destinationController.createDestination);
router.put('/admin/:id', authenticateToken, requireAdmin, destinationController.updateDestination);
router.delete('/admin/:id', authenticateToken, requireAdmin, destinationController.deleteDestination);

module.exports = router;