import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

export default function BookingConfirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Envoyer au backend
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: storedData,
      }).catch(err => console.error('Erreur envoi réservation:', err));

      setBooking({
        id: 'BK-' + Date.now(),
        service: data.serviceName || 'Service de transport',
        pickup: data.pickup,
        destination: data.destination,
        date: data.date,
        time: data.time,
        passengers: data.passengers,
        vehicle: 'Mercedes Classe E',
        price: data.price || 250,
        customerName: data.name || 'Client',
        customerPhone: data.phone || '',
        customerEmail: data.email || '',
        flight_number: data.flight_number || '',
        notes: data.notes || '',
      });
      localStorage.removeItem('bookingData');
    } else {
      // Données par défaut si pas de données stockées
      const bookingData = {
        id: 'BK-' + Date.now(),
        service: 'Transfert Aéroport',
        pickup: 'Aéroport Mohammed V',
        destination: 'Hôtel Marriott Casablanca',
        date: '2024-01-15',
        time: '14:30',
        passengers: 2,
        vehicle: 'Mercedes Classe E',
        price: 250,
        customerName: 'Client',
        customerPhone: '+212612345678',
        customerEmail: 'client@example.com'
      };
      setBooking(bookingData);
    }
  }, []);

  const sendWhatsAppMessage = (recipient, message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${recipient}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendMessages = () => {
    if (!booking) return;

    // Message pour le client
    const clientMessage = `🎉 Réservation confirmée!
    
📋 Détails:
• Réservation: ${booking.id}
• Service: ${booking.service}
• Date: ${booking.date} à ${booking.time}
• Départ: ${booking.pickup}
• Destination: ${booking.destination}
• Véhicule: ${booking.vehicle}
• Prix: ${booking.price} MAD

Merci pour votre confiance! 🚗`;

    // Message pour l'opérateur
    const ownerMessage = `🔔 Nouvelle réservation!
    
📋 Détails:
• ID: ${booking.id}
• Client: ${booking.customerName}
• Téléphone: ${booking.customerPhone}
• Service: ${booking.service}
• Date: ${booking.date} à ${booking.time}
• Départ: ${booking.pickup}
• Destination: ${booking.destination}
• Passagers: ${booking.passengers}
• Prix: ${booking.price} MAD

Action requise: Assigner chauffeur`;

    // Envoyer les messages
    sendWhatsAppMessage(booking.customerPhone, clientMessage);
    sendWhatsAppMessage('+212661234567', ownerMessage); // Numéro de l'opérateur
    
    setMessageSent(true);
  };

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* En-tête de confirmation */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservation Confirmée!</h1>
            <p className="text-gray-600">Votre réservation a été enregistrée avec succès</p>
          </div>

          {/* Détails de la réservation */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Détails de la réservation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Numéro de réservation</p>
                <p className="font-semibold">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold">{booking.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date et heure</p>
                <p className="font-semibold">{booking.date} à {booking.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Passagers</p>
                <p className="font-semibold">{booking.passengers} personne(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Point de départ</p>
                <p className="font-semibold">{booking.pickup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold">{booking.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Véhicule</p>
                <p className="font-semibold">{booking.vehicle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prix total</p>
                <p className="font-semibold text-green-600">{booking.price} MAD</p>
              </div>
            </div>
          </div>

          {/* Actions WhatsApp */}
          <div className="space-y-4">
            <button
              onClick={handleSendMessages}
              disabled={messageSent}
              className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
                messageSent 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>{messageSent ? 'Messages envoyés' : 'Envoyer confirmations WhatsApp'}</span>
            </button>

            {messageSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="text-green-800">Messages de confirmation envoyés avec succès!</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions supplémentaires */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Voir mes réservations
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Nouvelle réservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}