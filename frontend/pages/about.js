import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';

const VALUES = [
  { icon: '🏆', title: 'Excellence', desc: 'Nous visons la perfection dans chaque prestation, du véhicule au service client.', gradient: 'from-blue-500 to-indigo-600' },
  { icon: '✅', title: 'Fiabilité', desc: 'Ponctualité et professionnalisme garantis pour chaque mission.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: '💎', title: 'Authenticité', desc: 'Une expérience marocaine authentique, portée par des locaux passionnés.', gradient: 'from-violet-500 to-purple-600' },
];

const FLEET = [
  { name: 'Berlines Premium', desc: 'Mercedes Classe E, BMW Série 5 — jusqu\'à 4 passagers', gradient: 'from-sky-500 to-blue-600' },
  { name: 'SUV Luxe', desc: 'Mercedes GLE, BMW X5 — jusqu\'à 6 passagers', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Minibus', desc: 'Mercedes Sprinter, Ford Transit — jusqu\'à 15 passagers', gradient: 'from-violet-500 to-purple-600' },
];

export default function About() {
  const { t } = useTranslation(['common', 'about']);

  return (
    <>
      <Head><title>À propos — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/30 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">À propos</span>
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
              𝕋𝕣𝖊𝖓𝖉𝖞 𝕋𝖗𝖆𝖛𝖊𝖑
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t('about:subtitle')}</p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 pb-24 space-y-24">

          {/* Notre histoire */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Notre histoire</span>
              <h2 className="text-4xl font-extrabold text-white mb-6">{t('about:our_story.title')}</h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>{t('about:our_story.paragraph1')}</p>
                <p>{t('about:our_story.paragraph2')}</p>
                <p>{t('about:our_story.paragraph3')}</p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/8 h-80">
              <img src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80" alt="Marrakech" className="w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/60 to-transparent" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[['10+', 'Années d\'expérience'], ['50+', 'Véhicules premium'], ['10K+', 'Clients satisfaits'], ['24/7', 'Service disponible']].map(([v, l], i) => (
              <div key={i} className="text-center p-6 rounded-3xl border border-white/8 bg-white/[0.03]">
                <div className="text-4xl font-extrabold text-white mb-1">{v}</div>
                <div className="text-slate-400 text-sm">{l}</div>
              </div>
            ))}
          </div>

          {/* Valeurs */}
          <div>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Nos valeurs</span>
              <h2 className="text-4xl font-extrabold text-white">{t('about:values.title')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {VALUES.map((v, i) => (
                <div key={i} className="p-8 rounded-3xl border border-white/8 bg-white/[0.03] text-center hover:border-blue-500/30 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center text-2xl mx-auto mb-5 shadow-lg`}>{v.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flotte */}
          <div>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Notre flotte</span>
              <h2 className="text-4xl font-extrabold text-white">{t('about:fleet.title')}</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
              <div className="relative rounded-3xl overflow-hidden border border-white/8 h-64">
                <img src="/images/mercedes-fleet.png" alt="Flotte" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/40 to-transparent" />
              </div>
              <div className="space-y-4">
                {FLEET.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.03]">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center flex-shrink-0`}>🚗</div>
                    <div>
                      <p className="font-bold text-white text-sm">{f.name}</p>
                      <p className="text-slate-400 text-xs">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-12 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl font-extrabold text-white mb-4">{t('about:cta.title')}</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">{t('about:cta.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:scale-105 transition-transform">
                    {t('about:cta.contact_us')}
                  </span>
                </Link>
                <Link href="/services">
                  <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/8 transition-colors">
                    {t('about:cta.view_services')}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'about'])) } };
}
