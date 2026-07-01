import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { saveAdminSettings } from '../../utils/adminSettings';

export default function AdminSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    siteName: 'Trendy Travel',
    siteDescription: 'Plateforme de transport touristique premium',
    contactPhone: '+212 6 12 34 56 78',
    contactEmail: 'contact@trendy-travel.com',
    currency: 'MAD',
    language: 'fr',
    enableBookings: true,
    enablePayments: true,
    extraPassengerFee: 0,
  });
  const [vehicles, setVehicles] = useState([
    { id: 1, brand: 'Mercedes', model: 'Classe E', status: 'available' },
    { id: 2, brand: 'BMW', model: 'X5', status: 'maintenance' },
    { id: 3, brand: 'Audi', model: 'A6', status: 'available' }
  ]);
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ahmed Benali', rating: 4.8, status: 'available' },
    { id: 2, name: 'Mohamed Alami', rating: 4.9, status: 'busy' },
    { id: 3, name: 'Youssef Tazi', rating: 4.7, status: 'available' }
  ]);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed, extraPassengerFee: Number(parsed.extraPassengerFee) || 0 }));
      } catch {
        // ignore invalid saved settings
      }
    }
  }, []);

  const handleSave = () => {
    saveAdminSettings(settings);
    alert('Paramètres sauvegardés avec succès !');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <>
      <Head>
        <title>Paramètres - Administration</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12S19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12S4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
                  <p className="text-gray-600">Configuration du système</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => router.push('/admin')} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg">
                  ← Retour
                </button>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Site */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Configuration du Site</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du site</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Devise</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="MAD">MAD - Dirham Marocain</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supplément par passager à partir du 4ème</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.extraPassengerFee}
                      onChange={(e) => setSettings({...settings, extraPassengerFee: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="0 = calcul automatique"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Laisser à 0 pour utiliser le calcul automatique (25% du prix de base).
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description du site</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                    </svg>
                    Fonctionnalités
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.enableBookings}
                        onChange={(e) => setSettings({...settings, enableBookings: e.target.checked})}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-700 font-medium">Activer les réservations en ligne</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.enablePayments}
                        onChange={(e) => setSettings({...settings, enablePayments: e.target.checked})}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-700 font-medium">Activer les paiements en ligne</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gestion Véhicules & Chauffeurs */}
            <div className="space-y-8">
              {/* Véhicules */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Véhicules</h2>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">{vehicles.length} véhicules</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => router.push('/admin/vehicles')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    Ajouter Véhicule
                  </button>
                  <button 
                    onClick={() => router.push('/admin/vehicles')}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    Voir Véhicules
                  </button>
                </div>

                <div className="space-y-2">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' : 'Maintenance'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chauffeurs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Chauffeurs</h2>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{drivers.length} chauffeurs</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => router.push('/admin/drivers')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    Ajouter Chauffeur
                  </button>
                  <button 
                    onClick={() => router.push('/admin/drivers')}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    Voir Chauffeurs
                  </button>
                </div>

                <div className="space-y-2">
                  {drivers.slice(0, 3).map((driver) => (
                    <div key={driver.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {driver.name.charAt(0)}
                        </div>
                        <span className="font-medium">{driver.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">★ {driver.rating}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {driver.status === 'available' ? 'Disponible' : 'Occupé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Sauvegarder les Paramètres
            </button>
          </div>
        </div>
      </div>
    </>
  );
}