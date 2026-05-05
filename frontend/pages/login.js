import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation(['common', 'auth']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/backend/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
      } else {
        setError(data.error || t('auth:login.invalid_credentials'));
      }
    } catch {
      setError(t('auth:login.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>{t('nav.login')} — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-extrabold text-white mb-2">𝕋𝕣𝖊𝖓𝖉𝖞 𝕋𝖗𝖆𝖛𝖊𝖑</Link>
            <p className="text-slate-400 text-sm">{t('auth:login.subtitle')}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white mb-6">{t('auth:login.title')}</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:login.email')}</label>
                <input type="email" required placeholder={t('auth:login.email_placeholder')}
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('auth:login.password')}</label>
                <input type="password" required placeholder={t('auth:login.password_placeholder')}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-transform disabled:opacity-50 mt-2">
                {loading ? t('auth:login.logging_in') : t('auth:login.login_button')}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              {t('auth:login.no_account')}{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                {t('auth:login.create_account')}
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
