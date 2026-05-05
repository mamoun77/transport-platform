const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { createDatabaseIfNotExists, setupTables } = require('./utils/dbSetup');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const paymentRoutes = require('./routes/payments');
const routeRoutes = require('./routes/routes');
const blogRoutes = require('./routes/blog');
const uploadRoutes = require('./routes/upload');
const servicesRoutes = require('./routes/services');
const destinationsRoutes = require('./routes/destinations');
const circuitsRoutes = require('./routes/circuits');
const activitiesRoutes = require('./routes/activities');

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;
console.log('🔌 PORT env:', process.env.PORT, '→ using:', PORT);

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:19006',
    ].filter(Boolean);
    // Allow any vercel.app domain
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // permissive for now
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/circuits', circuitsRoutes);
app.use('/api/activities', activitiesRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur avec configuration automatique de PostgreSQL
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log('🌐 API disponible sur: http://localhost:' + PORT);
  console.log('❤️  Santé du serveur: http://localhost:' + PORT + '/health');
  setTimeout(async () => {
    console.log('\n🔧 Configuration automatique de la base de données...');
    try {
      await setupTables();
      console.log('\n🎉 Base de données configurée!');
    } catch (error) {
      console.log('⚠️  DB setup error (non-fatal):', error.message);
    }
  }, 2000);
});