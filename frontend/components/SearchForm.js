import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function SearchForm({ onSearch }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des trajets:', error);
    }
  };

  const calculatePrice = async (routeId, passengers) => {
    if (!routeId || !passengers) return;
    
    try {
      const response = await axios.post('/api/routes/calculate-price', {
        routeId,
        passengers: parseInt(passengers)
      });
      setCalculatedPrice(response.data);
    } catch (error) {
      console.error('Erreur calcul prix:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (selectedRoute && calculatedPrice) {
        const result = {
          route: selectedRoute,
          pricing: calculatedPrice,
          searchData: data
        };
        onSearch([result]);
      } else {
        alert('Veuillez sélectionner un trajet');
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto border border-white/20">
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-4">
        {/* Sélection du trajet */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">
            Trajet
          </label>
          <select
            {...register('route', { required: 'Trajet requis' })}
            onChange={(e) => {
              const route = routes.find(r => r.id === e.target.value);
              setSelectedRoute(route);
              const passengers = document.querySelector('[name="passengers"]').value;
              if (route && passengers) {
                calculatePrice(route.id, passengers);
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-black"
          >
            <option value="">Sélectionner un trajet</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.name} - {route.departure_location} → {route.arrival_location}
              </option>
            ))}
          </select>
          {errors.route && (
            <p className="text-red-500 text-xs mt-1">{errors.route.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Date
          </label>
          <input
            {...register('date', { required: 'Date requise' })}
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-black"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Passagers */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Passagers
          </label>
          <select
            {...register('passengers', { required: 'Nombre de passagers requis' })}
            onChange={(e) => {
              if (selectedRoute) {
                calculatePrice(selectedRoute.id, e.target.value);
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-black"
          >
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'passager' : 'passagers'}
              </option>
            ))}
          </select>
          {calculatedPrice && (
            <p className="text-green-600 text-sm mt-1 font-semibold">
              Prix: {calculatedPrice.total_price}€
            </p>
          )}
        </div>

        {/* Bouton de recherche */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !selectedRoute}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Recherche...' : 'Réserver'}
          </button>
        </div>
      </form>
    </div>
  );
}