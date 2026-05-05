const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques
router.get('/', blogController.getBlogs);
router.get('/categories', blogController.getCategories);
router.get('/:slug', blogController.getBlogBySlug);

// Routes admin (protégées)
router.get('/admin/all', authenticateToken, requireAdmin, blogController.getAllBlogs);
router.post('/admin', authenticateToken, requireAdmin, blogController.createBlog);
router.get('/admin/:id', authenticateToken, requireAdmin, blogController.getBlogById);
router.put('/admin/:id', authenticateToken, requireAdmin, blogController.updateBlog);
router.delete('/admin/:id', authenticateToken, requireAdmin, blogController.deleteBlog);

module.exports = router;