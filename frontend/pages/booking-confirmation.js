import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const OWNER_PHONE = '+212662100714'; // Ton numéro WhatsApp
const PAYPAL_ME = 'https://www.paypal.me/khalidboidane';

const getPayPalUrl = (price) => {
  const amount = Number(price || 0);
  return amount > 0 ? `${PAYPAL_ME}/${amount}` : PAYPAL_ME;
};

export default function BookingConfirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bookingData');
    if (!stored) { router.push('/'); return; }

    const data = JSON.parse(stored);
    const b = {
      id: 'BK-' + Date.now(),
      serviceName: data.serviceName || 'Service',
      pickup: data.pickup || '',
      destination: data.destination || '',
      date: data.date || '',
      time: data.time || '',
      passengers: data.passengers || 1,
      price: data.price || 0,
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      flight_number: data.flight_number || '',
      notes: data.notes || '',
    };

    // Sauvegarder en backend
    fetch('/backend/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
    }).catch(() => {});

    localStorage.removeItem('bookingData');
    setBooking(b);

    // Envoi automatique WhatsApp après 1 seconde
    setTimeout(() => sendWhatsApp(b), 1000);
  }, []);

  const sendWhatsApp = (b) => {
    if (sent) return;

    const clientMsg = encodeURIComponent(
`🎉 Booking Confirmed / Réservation Confirmée!

📋 #${b.id}
🚗 ${b.service}
📅 ${b.date} ${b.time}
👥 ${b.passengers} pax
💰 $${b.price}
${b.flight_number ? `✈️ Vol: ${b.flight_number}` : ''}
${b.notes ? `📝 ${b.notes}` : ''}

Trendy Travel — +212662100714`
    );

    const ownerMsg = encodeURIComponent(
`🔔 Nouvelle Réservation!

📋 #${b.id}
👤 ${b.name}
📞 ${b.phone}
${b.email ? `📧 ${b.email}` : ''}
🚗 ${b.service}
📅 ${b.date} à ${b.time}
👥 ${b.passengers} personne(s)
💰 $${b.price}
${b.flight_number ? `✈️ Vol: ${b.flight_number}` : ''}
${b.notes ? `📝 ${b.notes}` : ''}

⚡ Action requise: Assigner chauffeur`
    );

    // Ouvrir WhatsApp pour le client
    if (b.phone) {
      const phone = b.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${clientMsg}`, '_blank');
    }

    // Ouvrir WhatsApp pour l'opérateur (toi)
    setTimeout(() => {
      window.open(`https://wa.me/${OWNER_PHONE.replace(/\D/g, '')}?text=${ownerMsg}`, '_blank');
    }, 1500);

    setSent(true);
  };

  if (!booking) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-24">
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Réservation Confirmée !</h1>
            <p className="text-slate-400">#{booking.id}</p>
          </div>

          {/* Détails */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6 space-y-3">
            {[
              { label: 'Service', value: booking.service },
              { label: 'Date & Heure', value: `${booking.date} à ${booking.time}` },
              { label: 'Passagers', value: `${booking.passengers} personne(s)` },
              { label: 'Client', value: booking.name },
              { label: 'Téléphone', value: booking.phone },
              booking.flight_number && { label: 'Vol', value: booking.flight_number },
              booking.notes && { label: 'Notes', value: booking.notes },
              { label: 'Prix total', value: `$${booking.price}`, highlight: true },
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">{item.label}</span>
                <span className={`font-semibold text-sm ${item.highlight ? 'text-green-400 text-lg' : 'text-white'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* WhatsApp status */}
          <div className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${sent ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
            <svg className={`w-6 h-6 flex-shrink-0 ${sent ? 'text-green-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <div>
              <p className={`font-semibold text-sm ${sent ? 'text-green-400' : 'text-yellow-400'}`}>
                {sent ? 'WhatsApp envoyé au client et à l\'opérateur ✓' : 'Envoi WhatsApp en cours...'}
              </p>
              <p className="text-slate-500 text-xs">
                {sent ? `Client: ${booking.phone} · Opérateur: ${OWNER_PHONE}` : 'Veuillez autoriser les popups'}
              </p>
            </div>
          </div>

          {/* Renvoyer si besoin */}
          {sent && (
            <button onClick={() => sendWhatsApp(booking)}
              className="w-full mb-4 py-3 rounded-2xl font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Renvoyer WhatsApp
            </button>
          )}

          {/* Conditions d'annulation */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Conditions d'annulation</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pour les réservations déjà payées :
            </p>
            <ul className="mt-4 space-y-2 text-slate-400 text-sm list-disc list-inside">
              <li>Annulation possible jusqu'à 24h avant le départ.</li>
              <li>Après ce délai, le montant n'est pas remboursable.</li>
              <li>Contactez-nous rapidement pour toute demande d'annulation.</li>
            </ul>
            <p className="mt-4 text-slate-500 text-xs">
              Nous vous recommandons de conserver cette page et de nous joindre via WhatsApp pour une réponse rapide.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a href={getPayPalUrl(booking.price)} target="_blank" rel="noreferrer"
              className="w-full py-3 rounded-2xl font-bold bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-center transition">
              Payer avec PayPal
            </a>
            <div className="flex gap-3">
              <button onClick={() => router.push('/')}
                className="flex-1 py-3 rounded-2xl font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
                Accueil
              </button>
              <button onClick={() => router.push('/transfert')}
                className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 transition">
                Nouvelle réservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
