import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import axios from 'axios';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySwitcher from '../../components/CurrencySwitcher';
import ImageGallery from '../../components/ImageGallery';

const FALLBACK_SERVICES = {
  default: {
    name: 'Service de Transport',
    description: 'Service premium avec véhicules Mercedes de luxe. Ponctualité garantie et confort optimal pour tous vos déplacements.',
    price_from: 250,
    image: '/images/mercedes-fleet.png',
    duration: '30-60 min',
    capacity: 4,
    features: ['Chauffeur professionnel certifié', 'Véhicule Mercedes climatisé', 'Suivi GPS en temps réel', 'Wi-Fi gratuit', 'Eau et rafraîchissements', 'Service 24h/24'],
  }
};

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, comment: 'Service exceptionnel ! Véhicule impeccable et chauffeur très professionnel.', date: 'Jan 2024' },
  { name: 'Ahmed K.', rating: 5, comment: 'Parfait pour nos transferts. Ponctuel et confortable, je recommande vivement.', date: 'Fév 2024' },
  { name: 'Marie L.', rating: 4, comment: 'Très bonne expérience, chauffeur sympathique et véhicule propre.', date: 'Mar 2024' },
];

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [formData, setFormData] = useState({ routeId: '', date: '', time: '', passengers: 1, name: '', phone: '', flightNumber: '', remarks: '' });
  const [activeTab, setActiveTab] = useState('details');
  const { format, currency, convert } = useCurrency();

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/services`)
      .then(r => {
        const found = r.data.services?.find(s => String(s.id) === String(id));
        setService(found || FALLBACK_SERVICES.default);
      })
      .catch(() => setService(FALLBACK_SERVICES.default));

    axios.get('/api/routes')
      .then(r => setRoutes(Array.isArray(r.data) ? r.data : r.data.routes || []))
      .catch(() => {});
  }, [id]);

  const calculatePrice = async (routeId, passengers) => {
    if (!routeId || !passengers) return;
    try {
      const r = await axios.post('/api/routes/calculate-price', { routeId, passengers: parseInt(passengers) });
      setCalculatedPrice(r.data);
    } catch { setCalculatedPrice(null); }
  };

  const handleRouteChange = (routeId) => {
    const route = routes.find(r => String(r.id) === String(routeId));
    setSelectedRoute(route || null);
    setFormData(p => ({ ...p, routeId }));
    if (route) calculatePrice(routeId, formData.passengers);
  };

  const handlePassengersChange = (val) => {
    setFormData(p => ({ ...p, passengers: val }));
    if (selectedRoute) calculatePrice(selectedRoute.id, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = calculatedPrice?.total_price || service?.price_from || 0;
    localStorage.setItem('bookingData', JSON.stringify({
      serviceName: service?.name,
      pickup: selectedRoute?.departure_location || 'Non précisé',
      destination: selectedRoute?.arrival_location || 'Non précisé',
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
      price,
      phone: formData.phone,
      name: formData.name,
    }));
    router.push('/booking-confirmation');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const displayPrice = calculatedPrice?.total_price || service.price_from;

  return (
    <>
      <Head>
        <title>{service.name} — Transport Premium</title>
        <meta name="description" content={service.description} />
      </Head>

      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />

        {/* ── HERO ── */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <img
            src={(service.images && service.images[activePhoto]) || service.image || '/images/mercedes-fleet.png'}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-500"
            style={{ filter: 'brightness(0.35)' }}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/60 via-transparent to-[#080d1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/80 via-transparent to-transparent" />

          {/* floating orbs */}
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative h-full flex flex-col justify-end pb-16 px-6 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs font-semibold tracking-widest uppercase bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Service Premium
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                {service.name}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 line-clamp-2">
                {service.short_description || service.description}
              </p>

              {/* stats row */}
              <div className="flex flex-wrap gap-4 mb-6">
                {service.price_from > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-2xl font-extrabold text-white">{service.price_from}</span>
                    <span className="text-slate-400 text-sm">MAD</span>
                  </div>
                )}
                {service.duration && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>
                    <span className="text-slate-300 text-sm">{service.duration}</span>
                  </div>
                )}
                {service.capacity && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
                    <span className="text-slate-300 text-sm">jusqu'à {service.capacity} pers.</span>
                  </div>
                )}
              </div>

              {/* Miniatures galerie */}
              {service.images && service.images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {service.images.map((img, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)}
                      className={`w-14 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                        activePhoto === i ? 'border-blue-400 scale-110' : 'border-white/20 hover:border-white/50'
                      }`}>
                      <img src={img} alt={`photo ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* LEFT — details */}
            <div className="lg:col-span-3 space-y-8">

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
                {['details', 'avis'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'details' ? 'Détails' : 'Avis clients'}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <>
                  {/* Description */}
                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
                    <h2 className="text-xl font-bold text-white mb-4">À propos de ce service</h2>
                    <p className="text-slate-400 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
                      <h2 className="text-xl font-bold text-white mb-6">Ce qui est inclus</h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-slate-300 text-sm font-medium">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guarantees */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: '🛡️', label: 'Annulation gratuite', sub: '24h avant' },
                      { icon: '⚡', label: 'Confirmation', sub: 'Instantanée' },
                      { icon: '🎧', label: 'Support', sub: '24h/24 7j/7' },
                    ].map((g, i) => (
                      <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl border border-white/8 bg-white/[0.03]">
                        <span className="text-2xl mb-2">{g.icon}</span>
                        <span className="text-white text-xs font-semibold">{g.label}</span>
                        <span className="text-slate-500 text-xs mt-0.5">{g.sub}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'avis' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-6 rounded-3xl border border-white/8 bg-white/[0.03]">
                    <div className="text-5xl font-extrabold text-white">4.8</div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-slate-400 text-sm">Basé sur {REVIEWS.length} avis vérifiés</p>
                    </div>
                  </div>
                  {REVIEWS.map((r, i) => (
                    <div key={i} className="p-6 rounded-3xl border border-white/8 bg-white/[0.03]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
                            {r.name[0]}
                          </div>
                          <span className="font-semibold text-white">{r.name}</span>
                        </div>
                        <span className="text-slate-500 text-xs">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(r.rating)].map((_, j) => (
                          <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — booking form sticky */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">

                  {/* price header */}
                  <div className="p-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/8">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-white">
                          {displayPrice ? format(displayPrice) : '—'}
                        </span>
                      </div>
                      <CurrencySwitcher />
                    </div>
                    <p className="text-slate-400 text-sm">
                      {calculatedPrice ? `Total pour ${formData.passengers} passager${formData.passengers > 1 ? 's' : ''}` : 'Prix de base · sélectionnez un trajet'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Nom & Téléphone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nom *</label>
                        <input
                          type="text" required placeholder="Votre nom"
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Téléphone *</label>
                        <input
                          type="tel" required placeholder="+212..."
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Trajet */}
                    {routes.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Trajet</label>
                        <select
                          value={formData.routeId}
                          onChange={e => handleRouteChange(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                        >
                          <option value="" className="bg-[#0f172a]">Sélectionner un trajet</option>
                          {routes.map(r => (
                            <option key={r.id} value={r.id} className="bg-[#0f172a]">
                              {r.departure_location} → {r.arrival_location}
                            </option>
                          ))}
                        </select>
                        {selectedRoute && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-blue-400 px-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {selectedRoute.distance_km && `${selectedRoute.distance_km} km · `}{selectedRoute.estimated_duration && `~${selectedRoute.estimated_duration} min`}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date & Heure */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date *</label>
                        <input
                          type="date" required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date}
                          onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Heure *</label>
                        <input
                          type="time" required
                          value={formData.time}
                          onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Passagers */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Passagers</label>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => handlePassengersChange(Math.max(1, formData.passengers - 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center">−</button>
                        <span className="flex-1 text-center text-white font-bold text-lg">{formData.passengers}</span>
                        <button type="button" onClick={() => handlePassengersChange(Math.min(20, formData.passengers + 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center">+</button>
                      </div>
                    </div>

                    {/* Vol (optionnel) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">N° de vol <span className="normal-case font-normal text-slate-600">(optionnel)</span></label>
                      <input
                        type="text" placeholder="Ex: AT123"
                        value={formData.flightNumber}
                        onChange={e => setFormData(p => ({ ...p, flightNumber: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
                      />
                    </div>

                    {/* Remarques */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Remarques <span className="normal-case font-normal text-slate-600">(optionnel)</span></label>
                      <textarea
                        rows={2} placeholder="Demandes spécifiques..."
                        value={formData.remarks}
                        onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all resize-none"
                      />
                    </div>

                    {/* Prix récap */}
                    {calculatedPrice && (
                      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm space-y-1">
                        <div className="flex justify-between text-slate-400"><span>Prix de base</span><span>{format(calculatedPrice.base_price)}</span></div>
                        {calculatedPrice.passengers > 1 && <div className="flex justify-between text-slate-400"><span>+{calculatedPrice.passengers - 1} passager(s)</span><span>{format((calculatedPrice.passengers - 1) * calculatedPrice.price_per_passenger)}</span></div>}
                        <div className="flex justify-between text-white font-bold pt-1 border-t border-white/10"><span>Total</span><span>{format(calculatedPrice.total_price)}</span></div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 text-base"
                    >
                      Confirmer la réservation
                    </button>

                    <div className="flex justify-center gap-6 text-xs text-slate-500">
                      <span>✓ Annulation gratuite</span>
                      <span>✓ Confirmation immédiate</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
