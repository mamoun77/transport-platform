import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const { t } = useTranslation(['common', 'contact']);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Head><title>Contact — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/30 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Contact</span>
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
              {t('contact:heading')}
            </h1>
            <p className="text-slate-400 text-lg">Notre équipe vous répond dans les plus brefs délais.</p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Info */}
            <div className="space-y-5">
              {[
                { icon: '📞', label: t('contact:phone'), value: '+212 6 62 10 07 14', sub: 'Disponible 24h/24' },
                { icon: '✉️', label: t('contact:email'), value: 'contact@trendytravel.ma', sub: 'Réponse sous 2h' },
                { icon: '📍', label: 'Adresse', value: 'Marrakech, Maroc', sub: 'Médina, Guéliz' },
                { icon: '💬', label: 'WhatsApp', value: '+212 6 62 10 07 14', sub: 'Réponse instantanée' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-blue-500/30 transition-colors">
                  <span className="text-2xl w-10 text-center flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-bold text-white">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message envoyé !</h3>
                  <p className="text-slate-400 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-6">Envoyer un message</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nom *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Téléphone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-transform">
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'contact'])) } };
}
