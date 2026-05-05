import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    // Charger les réservations
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Erreur chargement réservations');
    }
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
        <title>Tableau de bord - Transport Platform</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Transport Platform</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span>Bonjour, {user.firstName}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Réservations totales</h3>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Réservations actives</h3>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Points de fidélité</h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">Mes réservations</h2>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune réservation trouvée
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{booking.serviceType}</h3>
                            <p className="text-sm text-gray-600">
                              {booking.pickupLocation} → {booking.dropoffLocation}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.pickupDate} à {booking.pickupTime}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}