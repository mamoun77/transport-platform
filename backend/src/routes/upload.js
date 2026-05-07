const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);

const getFolder = (routePath) => {
  if (routePath.includes('circuit')) return 'circuits';
  if (routePath.includes('service') || routePath.includes('activity')) return 'services';
  if (routePath.includes('destination') || routePath.includes('excursion')) return 'destinations';
  if (routePath.includes('blog')) return 'blog';
  return 'misc';
};

// Storage Cloudinary
const cloudinaryStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: { folder: `transport/${folder}`, allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
});

// Storage local (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolder(req.path);
    const uploadPath = path.join(__dirname, `../../../frontend/public/uploads/${folder}`);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const prefix = getFolder(req.path).slice(0, -1);
    cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const makeUpload = (folder) => multer({
  storage: useCloudinary ? cloudinaryStorage(folder) : localStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Seules les images sont autorisées'));
  }
});

const getUrl = (req, file) => {
  if (useCloudinary) return file.path;
  const folder = getFolder(req.path);
  return `/uploads/${folder}/${file.filename}`;
};

const handleUpload = (folder) => [
  authenticateToken,
  makeUpload(folder).single('image'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'Aucune image fournie' });
    res.json({ success: true, imageUrl: getUrl(req, req.file) });
  }
];

const handleMultiUpload = (folder) => [
  authenticateToken,
  makeUpload(folder).array('images', 20),
  (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'Aucune image fournie' });
    const imageUrls = req.files.map(f => getUrl(req, f));
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
