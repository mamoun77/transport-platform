import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';

const STATS = [
  { value: '10+', label: 'Années d\'expérience' },
  { value: '50+', label: 'Véhicules premium' },
  { value: '10K+', label: 'Clients satisfaits' },
  { value: '24/7', label: 'Support disponible' },
];

const DESTINATIONS = [
  { name: 'Marrakech', desc: 'Ville impériale aux mille couleurs', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80', gradient: 'from-rose-500 to-pink-600' },
  { name: 'Essaouira', desc: 'Cité portuaire de l\'Atlantique', image: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=800&q=80', gradient: 'from-sky-500 to-blue-600' },
  { name: 'Fès', desc: 'Capitale spirituelle du Maroc', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Agadir', desc: 'Perle du Souss', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80', gradient: 'from-emerald-500 to-teal-600' },
];

const REVIEWS = [
  { name: 'Sarah M.', flag: '🇫🇷', rating: 5, comment: 'Service exceptionnel ! Véhicule impeccable et chauffeur très professionnel. Je recommande vivement.' },
  { name: 'Ahmed K.', flag: '🇲🇦', rating: 5, comment: 'Parfait pour nos transferts. Ponctuel et confortable, Trendy Travel est notre référence.' },
  { name: 'Maria J.', flag: '🇪🇸', rating: 5, comment: 'Excursion fantastique dans l\'Atlas ! Guide compétent et véhicule confortable. Inoubliable.' },
];

export default function Home() {
  const [services, setServices]     = useState([]);
  const [circuits, setCircuits]     = useState([]);
  const [excursions, setExcursions] = useState([]);
  const [activities, setActivities] = useState([]);
  const router = useRouter();
  const { t } = useTranslation(['common', 'home']);

  useEffect(() => {
    fetch('/backend/services').then(r => r.json()).then(d => { if (d.success) setServices(d.services.slice(0, 4)); }).catch(() => {});
    fetch('/backend/circuits').then(r => r.json()).then(d => { if (d.success) setCircuits(d.circuits.slice(0, 4)); }).catch(() => {});
    fetch('/backend/destinations').then(r => r.json()).then(d => { if (d.success) setExcursions(d.destinations.slice(0, 4)); }).catch(() => {});
    fetch('/backend/activities').then(r => r.json()).then(d => { if (d.success) setActivities(d.activities.slice(0, 4)); }).catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Trendy Travel — Transport Premium au Maroc</title>
        <meta name="description" content="Réservez vos transferts et excursions touristiques en ligne" />
      </Head>

      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <img src="/images/mercedes-fleet.png" alt="hero" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.25)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/40 via-transparent to-[#080d1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/70 via-transparent to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-semibold tracking-widest uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Transport Premium au Maroc
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                𝕋𝕣𝖊𝖓𝖉𝖞 𝕋𝖗𝖆𝖛𝖊𝖑
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-xl">
                {t('home:hero.subtitle')}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                {['✓ Réservation instantanée', '✓ Annulation gratuite', '✓ Support 24h/24'].map(b => (
                  <span key={b} className="flex items-center gap-1">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">Nos Transferts</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent mb-4">Transfert Premium</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, i) => (
                <a key={s.id} href="/transfert" className="group flex flex-col rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10">dès {s.price_from} $/pers.</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">{s.name}</h3>
                    <p className="text-slate-400 text-xs flex-1">{s.short_description || s.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400">Réserver →</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/transfert" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg hover:scale-105 transition-transform">Voir tous les transferts →</a>
            </div>
          </div>
        </section>

        {/* ── CIRCUITS ── */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">Circuits</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent mb-4">Circuits & Aventures</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {circuits.map((c, i) => (
                <a key={c.id} href="/circuits" className="group flex flex-col rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={c.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                    {c.price > 0 && <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10">{c.price} $/pers.</span>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">{c.name}</h3>
                    <p className="text-slate-400 text-xs flex-1">{c.short_description || c.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400">Réserver →</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/circuits" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:scale-105 transition-transform">Voir tous les circuits →</a>
            </div>
          </div>
        </section>

        {/* ── EXCURSIONS ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Excursions</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent mb-4">Explorez le Maroc</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {excursions.map((e, i) => (
                <a key={e.id} href="/excursions" className="group flex flex-col rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={e.image || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80'} alt={e.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                    {e.price > 0 && <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10">{e.price} $/pers.</span>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{e.name}</h3>
                    <p className="text-slate-400 text-xs flex-1">{e.short_description || e.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">Réserver →</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/excursions" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg hover:scale-105 transition-transform">Voir toutes les excursions →</a>
            </div>
          </div>
        </section>

        {/* ── ACTIVITÉS ── */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400">Activités</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent mb-4">Vivez l’aventure</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((a) => (
                <a key={a.id} href="/activites" className="group flex flex-col rounded-3xl overflow-hidden border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={a.image || 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=80'} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                    {a.price > 0 && <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10">{a.price} $/pers.</span>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{a.name}</h3>
                    <p className="text-slate-400 text-xs flex-1">{a.short_description || a.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-400">Réserver →</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/activites" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg hover:scale-105 transition-transform">Voir toutes les activités →</a>
            </div>
          </div>
        </section>

        {/* ── DESTINATIONS ── */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Destinations</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-4">
                {t('home:destinations.title')}
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">{t('home:destinations.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DESTINATIONS.map((d, i) => (
                <Link key={i} href="/destinations">
                  <div className="group relative rounded-3xl overflow-hidden border border-white/8 cursor-pointer h-64">
                    <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: 'brightness(0.5)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${d.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1">{d.name}</h3>
                      <p className="text-slate-300 text-sm">{d.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/destinations">
                <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                  Voir toutes les destinations
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Pourquoi nous choisir</span>
                <h2 className="text-4xl font-extrabold text-white mb-8">{t('home:why_choose.title')}</h2>
                <div className="space-y-6">
                  {[
                    { icon: '🛡️', title: t('home:why_choose.reliable_service.title'), desc: t('home:why_choose.reliable_service.description') },
                    { icon: '⭐', title: t('home:why_choose.premium_quality.title'), desc: t('home:why_choose.premium_quality.description') },
                    { icon: '🎧', title: t('home:why_choose.support.title'), desc: t('home:why_choose.support.description') },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-blue-500/30 transition-colors">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-white/8">
                <img src="/images/mercedes-fleet.png" alt="fleet" className="w-full h-80 object-cover" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{t('home:why_choose.book_now')}</h3>
                  <p className="text-slate-300 text-sm mb-5">{t('home:why_choose.get_quote')}</p>
                  <Link href="/services">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:scale-105 transition-transform text-sm">
                      {t('home:why_choose.request_quote')}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Avis clients</span>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">{t('home:testimonials.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {REVIEWS.map((r, i) => (
                <div key={i} className="p-6 rounded-3xl border border-white/8 bg-white/[0.03]">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(r.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{r.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold">{r.name[0]}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{r.name} {r.flag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a href="https://www.tripadvisor.ca/Attraction_Review-g293734-d13530271-Reviews-Trendy_Travel-Marrakech_Marrakech_Safi.html" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] transition text-sm">
                {t('home:testimonials.view_all')} →
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="relative py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center p-6 rounded-3xl bg-white/[0.03] border border-white/8">
                  <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
                  <div className="text-slate-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT CTA ── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <h2 className="text-4xl font-extrabold text-white mb-4">{t('home:contact.title')}</h2>
                <p className="text-slate-300 mb-10 max-w-xl mx-auto">{t('home:contact.subtitle')}</p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-2xl">📞</span>
                    <div className="text-left">
                      <p className="text-xs text-slate-400">{t('home:contact.call_us')}</p>
                      <p className="font-bold text-white">+212662100714</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-2xl">✉️</span>
                    <div className="text-left">
                      <p className="text-xs text-slate-400">{t('home:contact.write_us')}</p>
                      <p className="font-bold text-white text-sm">contact@trendytravel.ma</p>
                    </div>
                  </div>
                </div>
                <Link href="/services">
                  <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:scale-105 transition-transform">
                    {t('home:contact.book_now')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/8 py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <span className="font-bold text-white">𝕋𝕣𝖊𝖓𝖉𝖞 𝕋𝖗𝖆𝖛𝖊𝖑</span>
            <span>© {new Date().getFullYear()} Trendy Travel. Tous droits réservés.</span>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-white transition">À propos</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'home'])) } };
}
