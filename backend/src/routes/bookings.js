const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const sequelize = require('../config/database');
const { sendBookingConfirmation } = require('../services/emailService');

async function sendWhatsAppNotification(booking) {
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = `🔔 *Nouvelle Réservation!*

📋 N°: ${booking.bookingNumber}
🚗 Service: ${booking.serviceName}
👤 Client: ${booking.name}
📞 Tél: ${booking.phone}
📅 Date: ${booking.date} à ${booking.time}
👥 Passagers: ${booking.passengers}
📍 Départ: ${booking.pickup}
📍 Arrivée: ${booking.destination}
💰 Prix: ${booking.price} MAD`;

    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+212662100714',
      body: msg
    });
    console.log('✅ WhatsApp notification sent');
  } catch (e) {
    console.log('⚠️ WhatsApp error:', e.message);
  }
}

// Créer une réservation
router.post('/', async (req, res) => {
  try {
    const { serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes } = req.body;
    const bookingNumber = 'BK' + Date.now();

    await sequelize.query(
      `INSERT INTO bookings (booking_number, service_name, pickup_location, dropoff_location, pickup_date, pickup_time, passengers, total_price, client_name, client_phone, client_email, flight_number, notes, status, created_at)
       VALUES (:bookingNumber,:serviceName,:pickup,:destination,:date,:time,:passengers,:price,:name,:phone,:email,:flight_number,:notes,'pending',NOW())`,
      { replacements: { bookingNumber, serviceName, pickup, destination, date, time, passengers, price: price || 0, name, phone, email, flight_number: flight_number || null, notes: notes || null } }
    );

    // Envoyer email de confirmation
    sendBookingConfirmation({ bookingNumber, serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes });

    // Envoyer WhatsApp à l'admin
    sendWhatsAppNotification({ bookingNumber, serviceName, pickup, destination, date, time, passengers, price, name, phone });

    res.status(201).json({ success: true, message: 'Réservation créée avec succès', bookingNumber });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Toutes les réservations (admin)
router.get('/', async (req, res) => {
  try {
    const [bookings] = await sequelize.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Mettre à jour le statut
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await sequelize.query('UPDATE bookings SET status=:status WHERE id=:id', { replacements: { status, id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    await sequelize.query('DELETE FROM bookings WHERE id=:id', { replacements: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Annuler
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    await sequelize.query("UPDATE bookings SET status='cancelled' WHERE id=:id", { replacements: { id: req.params.id } });
    res.json({ success: true, message: 'Réservation annulée avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'annulation" });
  }
});

module.exports = router;

// Créer une réservation (sans auth obligatoire)
router.post('/', async (req, res) => {
  try {
    const { serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes, serviceType } = req.body;
    const bookingNumber = 'BK' + Date.now();

    await db.query(
      `INSERT INTO bookings (booking_number, service_name, pickup_location, dropoff_location, pickup_date, pickup_time, passengers, total_price, client_name, client_phone, client_email, flight_number, notes, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending',NOW())`,
      [bookingNumber, serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number || null, notes || null]
    );

    res.status(201).json({ success: true, message: 'Réservation créée avec succès', bookingNumber });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Toutes les réservations (admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Mettre à jour le statut
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE bookings SET status=$1 WHERE id=$2', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Annuler
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    await db.query("UPDATE bookings SET status='cancelled' WHERE id=$1", [req.params.id]);
    res.json({ success: true, message: 'Réservation annulée avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'annulation" });
  }
});

module.exports = router;