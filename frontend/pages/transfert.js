import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import { useCurrency } from '../hooks/useCurrency';
import { useTranslateContent } from '../hooks/useTranslateContent';
import ImageGallery from '../components/ImageGallery';

const GRADIENTS = [
  'from-sky-500 to-blue-600', 'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600', 'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600', 'from-cyan-500 to-indigo-600',
];

const TYPE_CONFIG = {
  transfer:     { label: 'Transfert',  color: 'bg-sky-500/20 border-sky-500/40 text-sky-400' },
  excursion:    { label: 'Excursion',  color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' },
  private_tour: { label: 'Privé',      color: 'bg-violet-500/20 border-violet-500/40 text-violet-400' },
  shuttle:      { label: 'Navette',    color: 'bg-orange-500/20 border-orange-500/40 text-orange-400' },
};

export default function Transfert() {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [detail, setDetail]         = useState(null);
  const [form, setForm]             = useState({ name: '', phone: '', email: '', date: '', time: '', passengers: 1, type: 'standard', flight_number: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const { format } = useCurrency();
  const translatedServices = useTranslateContent(services);
  const { t } = useTranslation(['common', 'pages']);
  const router = useRouter();

  const calcPrice = (basePrice, passengers) => {
    if (!basePrice || passengers <= 3) return basePrice;
    const supplement = Math.round(basePrice * 0.25);
    return basePrice + (passengers - 3) * supplement;
  };
  const supplement = (basePrice) => Math.round(basePrice * 0.25);

  useEffect(() => {
    fetch('/backend/services')
      .then(r => r.json())
      .then(d => { if (d.success) setServices(d.services.map((s, i) => ({
        ...s,
        gradient: GRADIENTS[i % GRADIENTS.length],
        program: Array.isArray(s.program) ? s.program : (typeof s.program === 'string' ? JSON.parse(s.program || '[]') : []),
        included: Array.isArray(s.included) ? s.included : (typeof s.included === 'string' ? JSON.parse(s.included || '[]') : []),
        not_included: Array.isArray(s.not_included) ? s.not_included : (typeof s.not_included === 'string' ? JSON.parse(s.not_included || '[]') : []),
        luxury_advantages: Array.isArray(s.luxury_advantages) ? s.luxury_advantages : (typeof s.luxury_advantages === 'string' ? JSON.parse(s.luxury_advantages || '[]') : []),
        images: Array.isArray(s.images) ? s.images : (typeof s.images === 'string' ? JSON.parse(s.images || '[]') : []),
      }))); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const basePrice = form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : (selected.price_from || selected.price);
    const price = calcPrice(basePrice, form.passengers);
    localStorage.setItem('bookingData', JSON.stringify({
      serviceName: `${selected.name} (${form.type === 'luxury' ? t('pages:booking.luxury') : t('pages:booking.standard')})`,
      pickup: selected.departure_point || 'Non précisé',
      destination: selected.name,
      date: form.date, time: form.time, passengers: form.passengers,
      price, phone: form.phone, email: form.email, name: form.name,
      flight_number: form.flight_number, notes: form.notes,
    }));
    setSubmitting(false); setSelected(null);
    router.push('/booking-confirmation');
  };

  if (loading) return (
    <><Header />
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <Head><title>Transfert — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/20 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              {t('pages:transfert.badge')}
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
              {t('pages:transfert.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">{t('pages:transfert.subtitle')}</p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 pb-24">
          {services.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl mb-2">{t('pages:transfert.empty')}</p>
              <p className="text-sm">{t('pages:transfert.empty_sub')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {translatedServices.map(s => {
                const cfg = TYPE_CONFIG[s.type] ?? { label: s.type, color: 'bg-slate-500/20 border-slate-500/40 text-slate-400' };
                return (
                  <div key={s.id} className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img src={(s.images && s.images[0]) || s.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                        alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/20 to-transparent" />
                      {s.type && <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>{cfg.label}</span>}
                      {(s.price_from || s.price) > 0 && <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 backdrop-blur-sm">dès {format(s.price_from || s.price)}</span>}
                      {s.is_featured && <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 border border-yellow-400/40 text-yellow-300">⭐ {t('pages:booking.vedette')}</span>}
                      {(s.images && s.images.length > 1) && <span className="absolute bottom-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">📷 {s.images.length}</span>}
                    </div>
                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{s.name}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{s.short_description || s.description}</p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {s.duration && <span className="flex items-center gap-1 text-xs text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2"/></svg>{s.duration}</span>}
                          {s.departure_point && <span className="flex items-center gap-1 text-xs text-slate-400">📍 {s.departure_point}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <div className="text-lg font-extrabold text-white">
                            {(s.price_from || s.price) > 0
                              ? <span>{format(s.price_from || s.price)}</span>
                              : <span className="text-sm text-slate-400">{t('common:common.on_request')}</span>}
                          </div>
                          {s.price_luxury > 0 && <div className="text-sm font-bold text-yellow-400">{format(s.price_luxury)} <span className="text-xs font-normal text-yellow-600">{t('pages:booking.luxe')}</span></div>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setDetail(s)} className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:bg-white/8 transition">{t('pages:booking.details')}</button>
                          <button onClick={() => setSelected(s)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${s.gradient} shadow-lg hover:scale-105 transition-transform`}>
                            {t('pages:booking.reserve')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  {(detail.price_from || detail.price) > 0 && (
                    <div className="flex gap-3 flex-wrap mt-1">
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold">Privé : {format(detail.price_from || detail.price)}</span>
                      {detail.price_luxury > 0 && <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold">✨ {t('pages:booking.luxury')} : {format(detail.price_luxury)} {t('common:common.per_person')}</span>}
                    </div>
                  )}
                </div>
                <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                {detail.duration && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">⏱ {detail.duration}</span>}
                {detail.capacity && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">👥 jusqu'à 3 pers.</span>}
                {detail.departure_point && <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-300">🚌 {detail.departure_point}</span>}
                {detail.type && <span className={`px-3 py-1 rounded-full text-xs border ${TYPE_CONFIG[detail.type]?.color || 'bg-slate-500/20 border-slate-500/40 text-slate-400'}`}>{TYPE_CONFIG[detail.type]?.label || detail.type}</span>}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{detail.description}</p>
              {detail.program?.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-bold text-white mb-3">{t('pages:detail_modal.program')}</h3>
                  <div className="space-y-2">{detail.program.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-400">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>{step}
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
                className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${detail.gradient || 'from-sky-500 to-blue-600'} hover:scale-[1.02] transition-transform`}>
                {t('pages:transfert.reserve_btn')}
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
                <p className="text-blue-400 text-sm">{selected.name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            {selected.price_luxury > 0 && (
              <div className="mb-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm(p => ({ ...p, type: 'standard' }))}
                  className={`p-3 rounded-2xl border text-sm font-bold transition-all ${form.type === 'standard' ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'}`}>
                  <div>{t('pages:booking.standard')}</div>
                  <div className="text-lg">{format(selected.price_from || selected.price)}</div>
                  <div className="text-xs font-normal text-slate-400">{t('pages:booking.included_1_3')}</div>
                </button>
                <button type="button" onClick={() => setForm(p => ({ ...p, type: 'luxury' }))}
                  className={`p-3 rounded-2xl border text-sm font-bold transition-all ${form.type === 'luxury' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'}`}>
                  <div>{t('pages:booking.luxury')}</div>
                  <div className="text-lg">{format(selected.price_luxury)}</div>
                  <div className="text-xs font-normal text-slate-400">{t('pages:booking.included_1_3')}</div>
                </button>
              </div>
            )}
            {!selected.price_luxury && (
              <div className="mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-sm">{t('pages:booking.fixed_price')}</span>
                  <p className="text-xs text-slate-500">{t('pages:booking.included_1_3')}</p>
                </div>
                <span className="text-2xl font-extrabold text-white">{(selected.price_from || selected.price) > 0 ? format(selected.price_from || selected.price) : t('pages:booking.on_request')}</span>
              </div>
            )}
            <form onSubmit={handleBooking} className="space-y-4">
              <input type="text" placeholder={t('pages:booking.full_name')} required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
              <input type="tel" placeholder={t('pages:booking.phone')} required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
              <input type="email" placeholder={t('pages:booking.email')} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition" />
                <input type="time" required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-slate-400 text-sm">{t('pages:booking.passengers')}</label>
                <button type="button" onClick={() => setForm(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center justify-center">−</button>
                <span className="w-8 text-center text-white font-bold">{form.passengers}</span>
                <button type="button" onClick={() => setForm(p => ({ ...p, passengers: Math.min(selected.capacity || 20, p.passengers + 1) }))} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center justify-center">+</button>
              </div>
              {(selected.price_from || selected.price) > 0 && (() => {
                const base = form.type === 'luxury' && selected.price_luxury > 0 ? selected.price_luxury : (selected.price_from || selected.price);
                const total = calcPrice(base, form.passengers);
                return (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>{t('pages:booking.base_price_1_3')}</span>
                      <span className="text-white font-semibold">{format(base)}</span>
                    </div>
                    {form.passengers > 3 && (
                      <div className="flex justify-between text-orange-400">
                        <span>+{form.passengers - 3} {t('pages:booking.extra_persons')}</span>
                        <span className="font-semibold">+{format((form.passengers - 3) * supplement(base))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1">
                      <span>{t('pages:booking.total')}</span>
                      <span>{format(total)}</span>
                    </div>
                  </div>
                );
              })()}
              <input type="text" placeholder={t('pages:booking.flight_number')} value={form.flight_number} onChange={e => setForm(p => ({ ...p, flight_number: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
              <textarea placeholder={t('pages:booking.notes')} rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition resize-none" />
              <button type="submit" disabled={submitting} className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${selected.gradient || 'from-sky-500 to-blue-600'} hover:scale-[1.02] transition-transform disabled:opacity-50`}>
                {submitting ? t('pages:booking.processing') : t('pages:booking.confirm')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'pages'])) } };
}
