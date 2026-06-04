require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { sendBookingConfirmation } = require('./src/services/emailService');

sendBookingConfirmation({
  bookingNumber: 'BK-TEST-001',
  serviceName: 'Transfert Aéroport Marrakech (Standard)',
  pickup: 'Aéroport Marrakech Menara',
  destination: 'Hôtel La Mamounia',
  date: '2025-02-15',
  time: '14:30',
  passengers: 2,
  price: 150,
  name: 'Test Client',
  phone: '+212600000000',
  email: process.argv[2] || process.env.SMTP_USER,
  flight_number: 'AT204',
  notes: 'Siège bébé requis',
}).then(() => {
  console.log('✅ Test terminé — vérifiez votre boîte email');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
