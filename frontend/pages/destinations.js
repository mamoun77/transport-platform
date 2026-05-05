import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import { useCurrency } from '../hooks/useCurrency';
import CurrencySwitcher from '../components/CurrencySwitcher';

const GRADIENTS = [
  'from-rose-500 to-pink-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-indigo-600',
];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', passengers: 1 });
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation(['common', 'destinations']);
  const { format } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/destinations')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.destinations.length > 0) {
          setDestinations(data.destinations.map((d, i) => ({ ...d, gradient: GRADIENTS[i % GRADIENTS.length] })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();
    setSubmitting(true);
    localStorage.setItem('bookingData', JSON.stringify({
      serviceName: selected.name,
      pickup: form.name ? `Client: ${form.name}` : 'Non précisé',
      destination: selected.location || selected.name,
      date: form.date,
      time: form.time,
      passengers: form.passengers,
      price: selected.price,
      phone: form.phone,
      email: form.email,
    }));
    setSubmitting(false);
    setSelected(null);
    router.push('/booking-confirmation');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t('destinations:title')}</title>
        <meta name="description" content={t('destinations:meta_description')} />
      </Head>

      <div className="min-h-screen bg-[#0a0f1e] text-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/30 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              Nos Destinations
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
              Explorez le Maroc<br />comme jamais
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Des destinations soigneusement sélectionnées pour vous offrir des expériences inoubliables — culture, nature et authenticité.
            </p>
            <div className="mt-4 flex justify-center"><CurrencySwitcher /></div>
          </div>
        </section>

        {/* Cards */}
        <main className="max-w-7xl mx-auto px-4 pb-24">
          {destinations.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl mb-2">Aucune destination disponible</p>
              <p className="text-sm">Ajoutez des destinations depuis le panneau admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <div key={destination.id} className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/30 h-full">

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={destination.image || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80'}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/30 to-transparent" />

                    {destination.location && (
                      <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${destination.gradient} shadow-lg`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {destination.location}
                      </span>
                    )}

                    {destination.price > 0 && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 backdrop-blur-sm">
                        dès {format(destination.price)}
                      </span>
                    )}

                    {destination.is_featured && (
                      <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 border border-yellow-400/40 text-yellow-300">
                        ⭐ Vedette
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {destination.short_description || destination.description}
                      </p>
                      {destination.attractions && destination.attractions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {destination.attractions.slice(0, 3).map((a, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                              {a}
                            </span>
                          ))}
                          {destination.attractions.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                              +{destination.attractions.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-2xl font-extrabold text-white">
                        {destination.price > 0 ? format(destination.price) : <span className="text-sm text-slate-400">Prix sur demande</span>}
                      </span>
                      <button
                        onClick={() => setSelected(destination)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${destination.gradient} shadow-lg hover:scale-105 transition-transform`}
                      >
                        Réserver
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${destination.gradient} blur-2xl -z-10 scale-95`} />
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('destinations:custom_destination.title')}
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                {t('destinations:custom_destination.description')}
              </p>
              <Link href="/contact">
                <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:scale-105 transition-transform">
                  {t('destinations:custom_destination.cta')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Modal réservation */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Réserver</h2>
                <p className="text-blue-400 text-sm">{selected.name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Prix par personne</span>
              <span className="text-2xl font-extrabold text-white">
                {selected.price > 0 ? format(selected.price) : 'Sur demande'}
              </span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <input
                type="text" placeholder="Votre nom complet *" required
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="tel" placeholder="Téléphone *" required
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="email" placeholder="Email"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date" required
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="time" required
                  value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-slate-400 text-sm whitespace-nowrap">Passagers :</label>
                <input
                  type="number" min="1" max="20"
                  value={form.passengers} onChange={e => setForm(p => ({ ...p, passengers: e.target.value }))}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                {selected.price > 0 && (
                  <span className="text-slate-400 text-sm ml-auto">
                    Total : <span className="text-white font-bold">{format(selected.price * form.passengers)}</span>
                  </span>
                )}
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {submitting ? 'Traitement...' : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'destinations'])),
    },
  };
}
