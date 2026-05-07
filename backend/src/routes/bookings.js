const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const sequelize = require('../config/database');

// POST / — Créer une réservation (public)
router.post('/', async (req, res) => {
  try {
    const { serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes } = req.body;
    const bookingNumber = 'BK' + Date.now();

    await sequelize.query(
      `INSERT INTO bookings (booking_number, service_name, pickup_location, dropoff_location, pickup_date, pickup_time, passengers, total_price, client_name, client_phone, client_email, flight_number, notes, status, created_at)
       VALUES (:bookingNumber,:serviceName,:pickup,:destination,:date,:time,:passengers,:price,:name,:phone,:email,:flight_number,:notes,'pending',NOW())`,
      {
        replacements: {
          bookingNumber, serviceName: serviceName || '', pickup: pickup || '',
          destination: destination || '', date: date || '', time: time || '',
          passengers: passengers || 1, price: price || 0,
          name: name || '', phone: phone || '', email: email || '',
          flight_number: flight_number || null, notes: notes || null
        }
      }
    );

    res.status(201).json({ success: true, bookingNumber });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// GET / — Toutes les réservations (admin)
router.get('/', async (req, res) => {
  try {
    const [bookings] = await sequelize.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur' });
  }
});

// GET /my-bookings — Réservations du client par téléphone/email (sans auth stricte)
router.get('/my-bookings', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let bookings = [];

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        // Chercher par email ou phone de l'utilisateur
        const [user] = await sequelize.query(
          'SELECT * FROM users WHERE id = :id LIMIT 1',
          { replacements: { id: decoded.userId || decoded.id } }
        );
        if (user && user[0]) {
          const u = user[0];
          const [rows] = await sequelize.query(
            `SELECT * FROM bookings WHERE client_email = :email OR client_phone = :phone ORDER BY created_at DESC`,
            { replacements: { email: u.email || '', phone: u.phone || '' } }
          );
          bookings = rows;
        }
      } catch (e) {
        // token invalide, retourner vide
      }
    }

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur' });
  }
});

// PATCH /:id/status — Mettre à jour le statut
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await sequelize.query('UPDATE bookings SET status=:status WHERE id=:id', {
      replacements: { status, id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// PATCH /:id/cancel
router.patch('/:id/cancel', async (req, res) => {
  try {
    await sequelize.query("UPDATE bookings SET status='cancelled' WHERE id=:id", {
      replacements: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await sequelize.query('DELETE FROM bookings WHERE id=:id', {
      replacements: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

module.exports = router;
