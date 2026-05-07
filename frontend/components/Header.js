import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcherCompact from './LanguageSwitcherCompact';

export default function Header() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [router.pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/transfert', label: t('nav.transfert') },
    { href: '/excursions', label: t('nav.excursions') },
    { href: '/circuits', label: t('nav.circuits') },
    { href: '/activites', label: t('nav.activites') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#080d1a] border-b border-white/8 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img src="/logo.png" alt="Trendy Travel Marrakech" className="h-12 w-auto" style={{ mixBlendMode: 'screen' }} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(href) && href !== '/'
                      ? 'text-white bg-white/10'
                      : href === '/' && router.pathname === '/'
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/8'
                  }`}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right — desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcherCompact />
              {user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="text-slate-300 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/8 transition-all">
                    {user.role === 'admin' ? t('nav.admin') : t('nav.dashboard')}
                  </Link>
                  <button onClick={logout}
                    className="text-sm font-medium px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="text-slate-300 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/8 transition-all">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register"
                    className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>

            {/* Burger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#080d1a]" style={{ top: '64px' }}>
          <nav className="flex flex-col px-6 py-6 gap-2 overflow-y-auto h-full">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-4 py-4 rounded-2xl text-base font-semibold transition-all ${
                  isActive(href) && (href !== '/' || router.pathname === '/')
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/8'
                }`}>
                {label}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-2">
              {/* Langue + Devise */}
              <div className="flex items-center gap-3 px-2 pb-2">
                <LanguageSwitcherCompact />
              </div>

              {user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="px-4 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all">
                    {user.role === 'admin' ? t('nav.admin') : t('nav.dashboard')}
                  </Link>
                  <button onClick={logout}
                    className="text-left px-4 py-4 rounded-2xl text-base font-semibold text-red-400 hover:bg-red-500/10 transition-all">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="px-4 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register"
                    className="px-4 py-4 rounded-2xl text-base font-semibold text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
