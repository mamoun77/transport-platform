import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 156,
    totalUsers: 89,
    totalVehicles: 12,
    totalRevenue: 15420
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setUser(user);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <>
      <Head>
        <title>Administration - Trendy Travel</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Administration</h1>
                  <p className="text-sm text-gray-600">Tableau de bord</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.firstName?.[0] ?? '?'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.firstName}</p>
                    <p className="text-xs text-gray-500">Administrateur</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Réservations</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalBookings}</p>
                  <p className="text-sm text-green-600 mt-1">+12% ce mois</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10Z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Utilisateurs</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600 mt-1">+8% ce mois</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8.5 4C10.4 4 12 5.6 12 7.5S10.4 11 8.5 11 5 9.4 5 7.5 6.6 4 8.5 4M8.5 13C11.5 13 14 14.2 14 15.7V17H3V15.7C3 14.2 5.5 13 8.5 13Z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Véhicules</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalVehicles}</p>
                  <p className="text-sm text-green-600 mt-1">+2 nouveaux</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Revenus</p>
                  <p className="text-4xl font-bold text-orange-600 mt-2">{stats.totalRevenue}€</p>
                  <p className="text-sm text-green-600 mt-1">+15% ce mois</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/bookings')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Réservations</h3>
                  <p className="text-gray-600 mt-1">Gérer toutes les réservations</p>
                </div>
              </div>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Voir tout</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/vehicles')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Véhicules</h3>
                  <p className="text-gray-600 mt-1">Gérer la flotte de véhicules</p>
                </div>
              </div>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Voir tout</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/services')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM12 4.5L11.5 7.5L8.5 8L11.5 8.5L12 11.5L12.5 8.5L15.5 8L12.5 7.5L12 4.5Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Transferts</h3>
                  <p className="text-gray-600 mt-1">Gérer les transferts offerts</p>
                </div>
              </div>
              <div className="flex items-center text-green-600 font-semibold">
                <span>Gérer transferts</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/activities')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-violet-600 transition-colors">Activités</h3>
                  <p className="text-gray-600 mt-1">Gérer les activités</p>
                </div>
              </div>
              <div className="flex items-center text-violet-600 font-semibold">
                <span>Gérer activités</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/circuits')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">Circuits</h3>
                  <p className="text-gray-600 mt-1">Gérer les circuits touristiques</p>
                </div>
              </div>
              <div className="flex items-center text-amber-600 font-semibold">
                <span>Gérer circuits</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/destinations')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Excursions</h3>
                  <p className="text-gray-600 mt-1">Gérer les excursions</p>
                </div>
              </div>
              <div className="flex items-center text-emerald-600 font-semibold">
                <span>Gérer excursions</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/drivers')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8.5 4C10.4 4 12 5.6 12 7.5S10.4 11 8.5 11 5 9.4 5 7.5 6.6 4 8.5 4M8.5 13C11.5 13 14 14.2 14 15.7V17H3V15.7C3 14.2 5.5 13 8.5 13Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Utilisateurs</h3>
                  <p className="text-gray-600 mt-1">Gérer les utilisateurs</p>
                </div>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold">
                <span>Voir tout</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/settings')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12S19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12S4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">Paramètres</h3>
                  <p className="text-gray-600 mt-1">Configuration du système</p>
                </div>
              </div>
              <div className="flex items-center text-orange-600 font-semibold">
                <span>Configurer</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => alert('Rapports et analytics - Fonctionnalité à venir')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Rapports</h3>
                  <p className="text-gray-600 mt-1">Analytics et statistiques</p>
                </div>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold">
                <span>Voir rapports</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/gallery')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">Galerie</h3>
                  <p className="text-gray-600 mt-1">Gérer les photos de la galerie</p>
                </div>
              </div>
              <div className="flex items-center text-pink-600 font-semibold">
                <span>Gérer galerie</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => router.push('/admin/blog')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">Blog</h3>
                  <p className="text-gray-600 mt-1">Gérer les articles du blog</p>
                </div>
              </div>
              <div className="flex items-center text-pink-600 font-semibold">
                <span>Gérer articles</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer" onClick={() => alert('Messages clients - 3 nouveaux messages non lus')}>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">Messages</h3>
                  <p className="text-gray-600 mt-1">Communication clients</p>
                </div>
              </div>
              <div className="flex items-center text-teal-600 font-semibold">
                <span>Voir messages</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}