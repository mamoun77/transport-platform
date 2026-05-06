import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import { useCurrency } from '../hooks/useCurrency';
import CurrencySwitcher from '../components/CurrencySwitcher';
import ImageGallery from '../components/ImageGallery';

const GRADIENTS = [
  'from-rose-500 to-pink-600', 'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600', 'from-cyan-500 to-indigo-600',
];

const DIFFICULTY_COLORS = {
  facile:    'bg-green-500/20 border-green-500/40 text-green-400',
  modere:    'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  difficile: 'bg-red-500/20 border-red-500/40 text-red-400',
};

export default function Excursions() {
  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [detail, setDetail]         = useState(null);
  const [form, setForm]             = useState({ name: '', phone: '', email: '', date: '', time: '', passengers: 1, type: 'standard' });
  const [submitting, setSubmitting] = useState(false);
  const { format } = useCurrency();
  const { t } = useTranslation(['common', 'pages']);
  const router = useRouter();

  // Prix fixe jusqu'à 3 personnes, supplément par personne à partir de la 4ème
  const calcPrice = (basePrice, passengers) => {
    if (!basePrice || passengers <= 3) return basePrice;
    const supplement = Math.round(basePrice * 0.25);
    return basePrice + (passengers - 3) * supplement;
  };

  const displaySupplement = (basePrice) => Math.round(basePrice * 0.25);

  useEffect(() => {
    fetch('/backend/destinations')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.destinations.length > 0)
          setExcursions(d.destinations.map((e, i) => ({ ...e, gradient: GRADIENTS[i % GRADIENTS.length] })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const basePrice = form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : selected.price;
    const price = calcPrice(basePrice, form.passengers);
    localStorage.setItem('bookingData', JSON.stringify({
      serviceName: `${selected.name} (${form.type === 'luxury' ? t('pages:booking.luxury') : t('pages:booking.standard')})`,
      pickup: selected.location || 'Non précisé',
      destination: selected.name,
      date: form.date, time: form.time, passengers: form.passengers,
      price, phone: form.phone, email: form.email, name: form.name,
    }));
    setSubmitting(false); setSelected(null);
    router.push('/booking-confirmation');
  };

  if (loading) return (
    <><Header />
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <Head><title>Excursions — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-teal-900/20 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {t('pages:excursions.badge')}
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              {t('pages:excursions.title')}<br />{t('pages:excursions.title2')}
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">{t('pages:excursions.subtitle')}</p>
            <div className="mt-4 flex justify-center"><CurrencySwitcher /></div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 pb-24">
          {excursions.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl mb-2">{t('pages:excursions.empty')}</p>
              <p className="text-sm">{t('pages:excursions.empty_sub')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {excursions.map(e => (
                <div key={e.id} className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={(e.images && e.images[0]) || e.image || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80'}
                      alt={e.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/20 to-transparent" />
                    {e.difficulty && <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${DIFFICULTY_COLORS[e.difficulty] || DIFFICULTY_COLORS.facile}`}>{e.difficulty}</span>}
                    {e.price > 0 && <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 backdrop-blur-sm">{format(e.price)}</span>}
                    {e.is_featured && <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 border border-yellow-400/40 text-yellow-300">⭐ {t('pages:booking.vedette')}</span>}
                    {(e.images && e.images.length > 1) && <span className="absolute bottom-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">📷 {e.images.length}</span>}
                  </div>
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{e.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{e.short_description || e.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {e.duration && <span className="flex items-center gap-1 text-xs text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>{e.duration}</span>}
                        {e.location && <span className="flex items-center gap-1 text-xs text-slate-400">📍 {e.location}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <div className="text-lg font-extrabold text-white">
                          {e.price > 0 ? <span>{format(e.price)} <span className="text-xs font-normal text-slate-400">{t('common:common.per_person')}</span></span> : <span className="text-sm text-slate-400">{t('common:common.on_request')}</span>}
                        </div>
                        {e.price_luxury > 0 && <div className="text-sm font-bold text-yellow-400">{format(e.price_luxury)} <span className="text-xs font-normal text-yellow-600">{t('pages:booking.luxe')}</span></div>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setDetail(e)} className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:bg-white/8 transition">{t('pages:booking.details')}</button>
                        <button onClick={() => setSelected(e)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${e.gradient} shadow-lg hover:scale-105 transition-transform`}>
                          {t('pages:booking.reserve')}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal détails */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl my-auto">
            <ImageGallery images={detail.images} mainImage={detail.image} alt={detail.name} height="h-64" />
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{detail.name}</h2>
                  {detail.price > 0 && (
                    <div className="flex gap-3 flex-wrap mt-1">
                      <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-white font-bold">{t('pages:booking.standard')} : {format(detail.price)} {t('common:common.per_person')}</span>
                      {detail.price_luxury > 0 && <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold">✨ {t('pages:booking.luxury')} : {format(detail.price_luxury)} {t('common:common.per_person')}</span>}
                    </div>
                  )}
                </div>
                <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                {detail.duration && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">⏱ {detail.duration}</span>}
                {detail.capacity && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">👥 max {detail.capacity} pers.</span>}
                {detail.location && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">📍 {detail.location}</span>}
                {detail.difficulty && <span className={`px-3 py-1 rounded-full text-xs border ${DIFFICULTY_COLORS[detail.difficulty]}`}>{detail.difficulty}</span>}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{detail.description}</p>
              {detail.program?.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-bold text-white mb-3">{t('pages:detail_modal.program')}</h3>
                  <div className="space-y-2">{detail.program.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-400">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>{step}
                    </div>
                  ))}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {detail.included?.length > 0 && <div><h3 className="font-bold text-white mb-2 text-sm">{t('pages:detail_modal.included')}</h3><ul className="space-y-1">{detail.included.map((x, i) => <li key={i} className="text-xs text-slate-400">• {x}</li>)}</ul></div>}
                {detail.not_included?.length > 0 && <div><h3 className="font-bold text-white mb-2 text-sm">{t('pages:detail_modal.not_included')}</h3><ul className="space-y-1">{detail.not_included.map((x, i) => <li key={i} className="text-xs text-slate-400">• {x}</li>)}</ul></div>}
              </div>
              {detail.luxury_advantages?.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                  <h3 className="font-bold text-yellow-400 mb-3 text-sm">{t('pages:detail_modal.luxury_advantages')}</h3>
                  <ul className="space-y-1">{detail.luxury_advantages.map((x, i) => <li key={i} className="text-xs text-yellow-300/80">• {x}</li>)}</ul>
                </div>
              )}
              <button onClick={() => { setDetail(null); setSelected(detail); }}
                className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${detail.gradient || 'from-emerald-500 to-teal-600'} hover:scale-[1.02] transition-transform`}>
                {t('pages:excursions.reserve_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal réservation */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{t('pages:booking.title')}</h2>
                <p className="text-emerald-400 text-sm">{selected.name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            {selected.price_luxury > 0 && (
              <div className="mb-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm(p => ({ ...p, type: 'standard' }))}
                  className={`p-3 rounded-2xl border text-sm font-bold transition-all ${form.type === 'standard' ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'}`}>
                  <div>{t('pages:booking.standard')}</div><div className="text-lg">{format(selected.price)}</div>
                </button>
                <button type="button" onClick={() => setForm(p => ({ ...p, type: 'luxury' }))}
                  className={`p-3 rounded-2xl border text-sm font-bold transition-all ${form.type === 'luxury' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'}`}>
                  <div>{t('pages:booking.luxury')}</div><div className="text-lg">{format(selected.price_luxury)}</div>
                </button>
              </div>
            )}
            {!selected.price_luxury && (
              <div className="mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-slate-400 text-sm">{t('pages:booking.price_per_person')}</span>
                <span className="text-2xl font-extrabold text-white">{selected.price > 0 ? format(selected.price) : t('pages:booking.on_request')}</span>
              </div>
            )}
            <form onSubmit={handleBooking} className="space-y-4">
              <input type="text" placeholder={t('pages:booking.full_name')} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition" />
              <input type="tel" placeholder={t('pages:booking.phone')} required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition" />
              <input type="email" placeholder={t('pages:booking.email')} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                <input type="time" required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-slate-400 text-sm">{t('pages:booking.passengers')}</label>
                <button type="button" onClick={() => setForm(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center justify-center">−</button>
                <span className="w-8 text-center text-white font-bold">{form.passengers}</span>
                <button type="button" onClick={() => setForm(p => ({ ...p, passengers: Math.min(selected.capacity || 20, p.passengers + 1) }))} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center justify-center">+</button>
              </div>
              {selected.price > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Prix fixe (1–3 pers.)</span>
                    <span className="text-white font-semibold">{format(form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : selected.price)}</span>
                  </div>
                  {form.passengers > 3 && (
                    <div className="flex justify-between text-orange-400">
                      <span>+{form.passengers - 3} pers. supplémentaire(s)</span>
                      <span className="font-semibold">+{format((form.passengers - 3) * displaySupplement(form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : selected.price))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1">
                    <span>{t('pages:booking.total')}</span>
                    <span>{format(calcPrice(form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : selected.price, form.passengers))}</span>
                  </div>
                </div>
              )}
              <button type="submit" disabled={submitting} className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${selected.gradient || 'from-emerald-500 to-teal-600'} hover:scale-[1.02] transition-transform disabled:opacity-50`}>
                {submitting ? t('pages:booking.processing') : t('pages:booking.confirm')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'pages'])) } };
}
