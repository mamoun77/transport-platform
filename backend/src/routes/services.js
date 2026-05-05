const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques
router.get('/', serviceController.getServices);
router.get('/:slug', serviceController.getServiceBySlug);

// Routes admin
router.get('/admin/all', authenticateToken, requireAdmin, serviceController.getAllServices);
router.post('/admin', authenticateToken, requireAdmin, serviceController.createService);
router.put('/admin/:id', authenticateToken, requireAdmin, serviceController.updateService);
router.delete('/admin/:id', authenticateToken, requireAdmin, serviceController.deleteService);

module.exports = router;