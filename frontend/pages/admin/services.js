import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MultiImageUpload from '../../components/MultiImageUpload';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', short_description: '', image: '', images: [],
    price_from: '', duration: '', capacity: '', features: [], is_active: true, sort_order: 0
  });

  const router = useRouter();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/backend/services/admin/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setServices(data.services);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingService ? `/backend/services/admin/${editingService.id}` : '/backend/services/admin';
      const method = editingService ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        image: formData.images[0] || formData.image || '',
        features: formData.features.filter(f => f.trim())
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Service sauvegardé avec succès');
        setShowForm(false); setEditingService(null); resetForm(); fetchServices();
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name, description: service.description,
      short_description: service.short_description || '', image: service.image || '',
      images: service.images || (service.image ? [service.image] : []),
      price_from: service.price_from || '', duration: service.duration || '',
      capacity: service.capacity || '', features: service.features || [],
      is_active: service.is_active, sort_order: service.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce service ?')) {
      try {
        const response = await fetch(`/backend/services/admin/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) { alert('Service supprimé'); fetchServices(); }
      } catch { alert('Erreur lors de la suppression'); }
    }
  };

  const resetForm = () => setFormData({
    name: '', description: '', short_description: '', image: '', images: [],
    price_from: '', duration: '', capacity: '', features: [], is_active: true, sort_order: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFeatureChange = (index, value) => {
    const arr = [...formData.features]; arr[index] = value;
    setFormData(prev => ({ ...prev, features: arr }));
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des Transferts</h1>
          <div className="flex gap-2">
            <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm">Retour Admin</button>
            <button onClick={() => { setShowForm(true); setEditingService(null); resetForm(); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Nouveau Transfert</button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingService ? 'Modifier le transfert' : 'Nouveau transfert'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nom du transfert *" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="Description courte" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description complète *" required rows="4" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <MultiImageUpload
                images={formData.images}
                onChange={(imgs) => setFormData(prev => ({ ...prev, images: imgs }))}
                uploadEndpoint="service-images"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" name="price_from" value={formData.price_from} onChange={handleInputChange} placeholder="Prix à partir de" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Durée" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder="Capacité" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caractéristiques</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="Caractéristique" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+ Ajouter</button>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="mr-2" />
                  Service actif
                </label>
                <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} placeholder="Ordre" className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">{editingService ? 'Mettre à jour' : 'Créer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingService(null); resetForm(); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.short_description}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {service.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="flex gap-1 mb-3">
                {(service.images || []).slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="" className="w-12 h-12 object-cover rounded border" />
                ))}
                {(service.images || []).length > 3 && <span className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">+{service.images.length - 3}</span>}
                {!(service.images || []).length && service.image && <img src={service.image} alt="" className="w-12 h-12 object-cover rounded border" />}
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                {service.price_from && <span className="font-semibold text-green-700">{service.price_from} $</span>}
                {service.duration && <span>⏱ {service.duration}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(service)} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm font-medium hover:bg-blue-600">Modifier</button>
                <button onClick={() => handleDelete(service.id)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm font-medium hover:bg-red-600">Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.short_description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {(service.images || []).slice(0, 3).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-10 h-10 object-cover rounded border" />
                      ))}
                      {(service.images || []).length > 3 && <span className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">+{service.images.length - 3}</span>}
                      {!(service.images || []).length && service.image && <img src={service.image} alt="" className="w-10 h-10 object-cover rounded border" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{service.price_from ? `${service.price_from} $` : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{service.duration || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {service.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
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
