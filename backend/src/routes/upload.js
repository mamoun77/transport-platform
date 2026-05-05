const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const getFolder = (routePath) => {
  if (routePath.includes('circuit')) return 'circuits';
  if (routePath.includes('service')) return 'services';
  if (routePath.includes('destination')) return 'destinations';
  if (routePath.includes('blog')) return 'blog';
  return 'misc';
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolder(req.path);
    const uploadPath = path.join(__dirname, `../../../frontend/public/uploads/${folder}`);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const prefix = getFolder(req.path).slice(0, -1); // retire le 's' final
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Seules les images sont autorisées (jpg, png, gif, webp)'));
  }
});

const handleUpload = (folder) => [
  authenticateToken,
  upload.single('image'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'Aucune image fournie' });
    res.json({ success: true, imageUrl: `/uploads/${folder}/${req.file.filename}` });
  }
];

const handleMultiUpload = (folder) => [
  authenticateToken,
  upload.array('images', 20),
  (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'Aucune image fournie' });
    const imageUrls = req.files.map(f => `/uploads/${folder}/${f.filename}`);
    res.json({ success: true, imageUrls });
  }
];

router.post('/service-image',      ...handleUpload('services'));
router.post('/destination-image',  ...handleUpload('destinations'));
router.post('/circuit-image',      ...handleUpload('circuits'));
router.post('/blog-image',         ...handleUpload('blog'));
router.post('/service-images',     ...handleMultiUpload('services'));
router.post('/activity-images',    ...handleMultiUpload('services'));
router.post('/excursion-images',   ...handleMultiUpload('destinations'));
router.post('/destination-images', ...handleMultiUpload('destinations'));
router.post('/circuit-images',     ...handleMultiUpload('circuits'));

// Gestion erreur multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `Erreur upload: ${err.message}` });
  }
  if (err) return res.status(400).json({ success: false, error: err.message });
  next();
});

module.exports = router;
