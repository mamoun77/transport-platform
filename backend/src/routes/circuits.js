const express = require('express');
const router = express.Router();
const circuitController = require('../controllers/circuitController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', circuitController.getCircuits);
router.get('/admin/all', authenticateToken, requireAdmin, circuitController.getAllCircuits);
router.post('/admin', authenticateToken, requireAdmin, circuitController.createCircuit);
router.put('/admin/:id', authenticateToken, requireAdmin, circuitController.updateCircuit);
router.delete('/admin/:id', authenticateToken, requireAdmin, circuitController.deleteCircuit);
router.get('/:slug', circuitController.getCircuitBySlug);

module.exports = router;
