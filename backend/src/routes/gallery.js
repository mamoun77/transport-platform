const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const sequelize = require('../config/database');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'transport/gallery', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET / — photos publiques
router.get('/', async (req, res) => {
  try {
    const [photos] = await sequelize.query('SELECT * FROM gallery WHERE is_active = true ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, photos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /admin — toutes les photos (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const [photos] = await sequelize.query('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, photos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /admin — ajouter une photo
router.post('/admin', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Aucune image' });
    const { alt = '', sort_order = 0 } = req.body;
    const url = req.file.path;
    await sequelize.query(
      `INSERT INTO gallery (url, alt, sort_order, is_active, created_at) VALUES (:url, :alt, :sort_order, true, NOW())`,
      { replacements: { url, alt, sort_order: parseInt(sort_order) || 0 } }
    );
    res.status(201).json({ success: true, url });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /admin/:id
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM gallery WHERE id = :id', { replacements: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH /admin/:id — toggle actif / ordre
router.patch('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { is_active, sort_order, alt } = req.body;
    await sequelize.query(
      `UPDATE gallery SET is_active = COALESCE(:is_active, is_active), sort_order = COALESCE(:sort_order, sort_order), alt = COALESCE(:alt, alt) WHERE id = :id`,
      { replacements: { is_active: is_active ?? null, sort_order: sort_order ?? null, alt: alt ?? null, id: req.params.id } }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
