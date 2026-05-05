import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MultiImageUpload from '../../components/MultiImageUpload';

export default function AdminExcursions() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', short_description: '', image: '', images: [],
    location: '', distance_from_city: '', price: '', attractions: [],
    is_active: true, is_featured: false, sort_order: 0
  });

  const router = useRouter();

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/backend/destinations/admin/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setDestinations(data.destinations);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDestination ? `/backend/destinations/admin/${editingDestination.id}` : '/backend/destinations/admin';
      const method = editingDestination ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        image: formData.images[0] || formData.image || '',
        attractions: formData.attractions.filter(a => a.trim())
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Excursion sauvegardée avec succès');
        setShowForm(false); setEditingDestination(null); resetForm(); fetchDestinations();
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name, description: destination.description,
      short_description: destination.short_description || '', image: destination.image || '',
      images: destination.images || (destination.image ? [destination.image] : []),
      location: destination.location || '', distance_from_city: destination.distance_from_city || '',
      price: destination.price || '', attractions: destination.attractions || [],
      is_active: destination.is_active, is_featured: destination.is_featured, sort_order: destination.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette excursion ?')) {
      try {
        const response = await fetch(`/backend/destinations/admin/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) { alert('Excursion supprimée'); fetchDestinations(); }
      } catch { alert('Erreur lors de la suppression'); }
    }
  };

  const resetForm = () => setFormData({
    name: '', description: '', short_description: '', image: '', images: [],
    location: '', distance_from_city: '', price: '', attractions: [],
    is_active: true, is_featured: false, sort_order: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Excursions</h1>
          <div className="space-x-4">
            <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Retour Admin</button>
            <button onClick={() => { setShowForm(true); setEditingDestination(null); resetForm(); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Nouvelle Excursion</button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingDestination ? 'Modifier l\'excursion' : 'Nouvelle excursion'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nom de l'excursion *" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="Description courte" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description complète *" required rows="4" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <MultiImageUpload
                images={formData.images}
                onChange={(imgs) => setFormData(prev => ({ ...prev, images: imgs }))}
                uploadEndpoint="excursion-images"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Localisation" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" name="distance_from_city" value={formData.distance_from_city} onChange={handleInputChange} placeholder="Distance (km)" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (MAD) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Ex: 250" min="0" step="0.01" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attractions</label>
                {formData.attractions.map((attraction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={attraction} onChange={(e) => { const arr = [...formData.attractions]; arr[index] = e.target.value; setFormData(prev => ({ ...prev, attractions: arr })); }} placeholder="Attraction" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, attractions: prev.attractions.filter((_, i) => i !== index) }))} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, attractions: [...prev.attractions, ''] }))} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+ Ajouter</button>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="mr-2" />
                  Active
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="mr-2" />
                  En vedette
                </label>
                <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} placeholder="Ordre" className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">{editingDestination ? 'Mettre à jour' : 'Créer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingDestination(null); resetForm(); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Annuler</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Excursion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix (MAD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {destinations.map((destination) => (
                <tr key={destination.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {destination.name}
                      {destination.is_featured && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Vedette</span>}
                    </div>
                    <div className="text-sm text-gray-500">{destination.short_description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {(destination.images || []).slice(0, 3).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-10 h-10 object-cover rounded border" />
                      ))}
                      {(destination.images || []).length > 3 && <span className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">+{destination.images.length - 3}</span>}
                      {!(destination.images || []).length && destination.image && <img src={destination.image} alt="" className="w-10 h-10 object-cover rounded border" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{destination.location || '-'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-700">{destination.price ? `${destination.price} MAD` : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${destination.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {destination.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(destination)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                    <button onClick={() => handleDelete(destination.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
