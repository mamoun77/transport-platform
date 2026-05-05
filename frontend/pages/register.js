import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation(['common', 'auth']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>{t('nav.register')} — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-extrabold text-white mb-2">𝕋𝕣𝖊𝖓𝖉𝖞 𝕋𝖗𝖆𝖛𝖊𝖑</Link>
            <p className="text-slate-400 text-sm">{t('auth:register.subtitle')}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white mb-6">{t('auth:register.title')}</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:register.first_name')}</label>
                  <input type="text" required placeholder={t('auth:register.first_name_placeholder')}
                    value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:register.last_name')}</label>
                  <input type="text" required placeholder={t('auth:register.last_name_placeholder')}
                    value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:register.email')}</label>
                <input type="email" required placeholder={t('auth:register.email_placeholder')}
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:register.phone')}</label>
                <input type="tel" placeholder={t('auth:register.phone_placeholder')}
                  value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:register.password')}</label>
                <input type="password" required minLength={6} placeholder={t('auth:register.password_placeholder')}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-transform disabled:opacity-50 mt-2">
                {loading ? t('auth:register.registering') : t('auth:register.register_button')}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              {t('auth:register.already_account')}{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                {t('auth:register.login_here')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common', 'auth'])) } };
}
