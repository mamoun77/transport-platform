import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ahmed Benali', phone: '+212 6 12 34 56 78', rating: 4.8, status: 'available', experience: 5 },
    { id: 2, name: 'Mohamed Alami', phone: '+212 6 87 65 43 21', rating: 4.9, status: 'busy', experience: 8 },
    { id: 3, name: 'Youssef Tazi', phone: '+212 6 11 22 33 44', rating: 4.7, status: 'available', experience: 3 }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', experience: '' });
  const router = useRouter();

  const addDriver = () => {
    if (newDriver.name && newDriver.phone) {
      setDrivers([...drivers, {
        id: Date.now(),
        ...newDriver,
        experience: parseInt(newDriver.experience) || 0,
        rating: 5.0,
        status: 'available'
      }]);
      setNewDriver({ name: '', phone: '', experience: '' });
      setShowForm(false);
    }
  };

  const deleteDriver = (id) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  const updateStatus = (id, status) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, status } : d));
  };

  const updateRating = (id, rating) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, rating: parseFloat(rating) } : d));
  };

  return (
    <>
      <Head>
        <title>Chauffeurs - Admin</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestion des Chauffeurs</h1>
            <div className="space-x-4">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                + Ajouter Chauffeur
              </button>
              <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                ← Retour
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Nouveau Chauffeur</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Années d'expérience"
                  value={newDriver.experience}
                  onChange={(e) => setNewDriver({...newDriver, experience: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="mt-4 space-x-2">
                <button onClick={addDriver} className="bg-green-500 text-white px-4 py-2 rounded">
                  Ajouter
                </button>
                <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{driver.name}</h3>
                    <p className="text-gray-600 text-sm">{driver.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Expérience:</span>
                    <span className="font-semibold">{driver.experience} ans</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Note:</span>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={driver.rating}
                      onChange={(e) => updateRating(driver.id, e.target.value)}
                      className="border rounded px-2 py-1 w-16 text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut:</label>
                    <select 
                      value={driver.status}
                      onChange={(e) => updateStatus(driver.id, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="available">Disponible</option>
                      <option value="busy">Occupé</option>
                      <option value="offline">Hors ligne</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteDriver(driver.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}