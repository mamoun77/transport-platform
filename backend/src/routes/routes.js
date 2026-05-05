const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques
router.get('/', routeController.getRoutes);
router.post('/calculate-price', routeController.calculatePrice);

// Routes admin
router.post('/', authenticateToken, requireAdmin, routeController.createRoute);
router.put('/:id', authenticateToken, requireAdmin, routeController.updateRoute);
router.delete('/:id', authenticateToken, requireAdmin, routeController.deleteRoute);

module.exports = router;