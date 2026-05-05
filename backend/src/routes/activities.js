const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', activityController.getActivities);
router.get('/admin/all', authenticateToken, requireAdmin, activityController.getAllActivities);
router.post('/admin', authenticateToken, requireAdmin, activityController.createActivity);
router.put('/admin/:id', authenticateToken, requireAdmin, activityController.updateActivity);
router.delete('/admin/:id', authenticateToken, requireAdmin, activityController.deleteActivity);
router.get('/:slug', activityController.getActivityBySlug);

module.exports = router;
