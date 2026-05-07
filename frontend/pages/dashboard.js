import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';

const STATUS_COLORS = {
  pending:   'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  confirmed: 'bg-green-500/20 border-green-500/40 text-green-400',
  completed: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  cancelled: 'bg-red-500/20 border-red-500/40 text-red-400',
};

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    setUser(JSON.parse(userData));
    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const res = await fetch('/backend/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Annuler cette réservation ?')) return;
    await fetch(`/backend/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchBookings(localStorage.getItem('token'));
  };

  if (!user) return null;

  return (
    <>
      <Head><title>Mon compte — Trendy Travel</title></Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">

          {/* Profil */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">
              {user.firstName?.[0] || user.email?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total', value: bookings.length, color: 'text-blue-400' },
              { label: 'En attente', value: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-400' },
              { label: 'Confirmées', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-green-400' },
              { label: 'Terminées', value: bookings.filter(b => b.status === 'completed').length, color: 'text-slate-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 text-center">
                <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Réservations */}
          <div className="bg-white/[0.04] border border-white/8 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-bold">Mes réservations</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-xl mb-2">Aucune réservation</p>
                <button onClick={() => router.push('/transfert')}
                  className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:scale-105 transition">
                  Faire une réservation
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {bookings.map(b => (
                  <div key={b.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white">{b.service_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                          {STATUS_LABELS[b.status] || b.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        📅 {b.pickup_date} {b.pickup_time && `à ${b.pickup_time}`}
                        {b.passengers && ` · 👥 ${b.passengers} pers.`}
                      </p>
                      {(b.pickup_location || b.dropoff_location) && (
                        <p className="text-slate-500 text-xs mt-1">
                          {b.pickup_location} {b.dropoff_location && `→ ${b.dropoff_location}`}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 mt-1">#{b.booking_number}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {b.total_price > 0 && (
                        <span className="text-xl font-extrabold text-green-400">${b.total_price}</span>
                      )}
                      {b.status === 'pending' && (
                        <button onClick={() => cancelBooking(b.id)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition">
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
