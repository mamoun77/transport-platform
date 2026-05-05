import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MultiImageUpload from '../../components/MultiImageUpload';

const EMPTY_FORM = {
  name: '', short_description: '', description: '', image: '', images: [],
  price: '', price_luxury: '', duration: '', distance_km: '', difficulty: 'facile',
  departure_point: '', capacity: '', included: [], not_included: [],
  luxury_advantages: [], program: [], is_active: true, is_featured: false, sort_order: 0
};

const API = '/backend/circuits';
const token = () => typeof window !== 'undefined' ? localStorage.getItem('token') : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` });

export default function AdminCircuits() {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const router = useRouter();

  useEffect(() => { fetchCircuits(); }, []);

  const fetchCircuits = async () => {
    try {
      const r = await fetch(`${API}/admin/all`, { headers: { 'Authorization': `Bearer ${token()}` } });
      const d = await r.json();
      if (d.success) setCircuits(d.circuits);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `${API}/admin/${editing.id}` : `${API}/admin`;
    const method = editing ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify({ ...form, image: form.images[0] || form.image || '', included: form.included.filter(x => x.trim()), not_included: form.not_included.filter(x => x.trim()), program: form.program.filter(x => x.trim()) }) });
      const d = await r.json();
      if (d.success) { alert('Circuit sauvegardé !'); setShowForm(false); setEditing(null); setForm(EMPTY_FORM); fetchCircuits(); }
      else alert(d.error || 'Erreur');
    } catch { alert('Erreur lors de la sauvegarde'); }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, short_description: c.short_description || '', description: c.description, image: c.image || '', images: c.images || (c.image ? [c.image] : []), price: c.price || '', price_luxury: c.price_luxury || '', duration: c.duration || '', distance_km: c.distance_km || '', difficulty: c.difficulty || 'facile', departure_point: c.departure_point || '', capacity: c.capacity || '', included: c.included || [], not_included: c.not_included || [], luxury_advantages: c.luxury_advantages || [], program: c.program || [], is_active: c.is_active, is_featured: c.is_featured, sort_order: c.sort_order || 0 });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce circuit ?')) return;
    await fetch(`${API}/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token()}` } });
    fetchCircuits();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const r = await fetch('/backend/upload/circuit-image', { method: 'POST', headers: { 'Authorization': `Bearer ${token()}` }, body: fd });
      const d = await r.json();
      if (d.success) setForm(p => ({ ...p, image: d.imageUrl }));
    } catch { alert('Erreur upload'); }
  };

  const listField = (key, value, placeholder) => (
    <div>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input type="text" value={item} onChange={e => { const a = [...value]; a[i] = e.target.value; setForm(p => ({ ...p, [key]: a })); }}
            placeholder={placeholder} className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={() => setForm(p => ({ ...p, [key]: value.filter((_, j) => j !== i) }))} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">×</button>
        </div>
      ))}
      <button type="button" onClick={() => setForm(p => ({ ...p, [key]: [...value, ''] }))} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">+ Ajouter</button>
    </div>
  );

  const inp = (name, placeholder, type = 'text', extra = {}) => (
    <input type={type} name={name} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
      placeholder={placeholder} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" {...extra} />
  );

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Circuits</h1>
          <div className="space-x-4">
            <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Retour Admin</button>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Nouveau Circuit</button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Modifier le circuit' : 'Nouveau circuit'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Infos de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inp('name', 'Nom du circuit *', 'text', { required: true })}
                {inp('short_description', 'Description courte')}
              </div>

              <textarea name="description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Description complète *" required rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {/* Images */}
              <MultiImageUpload
                images={form.images}
                onChange={(imgs) => setForm(p => ({ ...p, images: imgs }))}
                uploadEndpoint="circuit-images"
              />

              {/* Prix, durée, distance, difficulté */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {inp('price', 'Prix Standard (€) *', 'number', { required: true, min: 0, step: '0.01' })}
                {inp('price_luxury', 'Prix Luxe (€)', 'number', { min: 0, step: '0.01' })}
                {inp('duration', 'Durée (ex: 2 jours)')}
                {inp('distance_km', 'Distance (km)', 'number')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select name="difficulty" value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="facile">Facile</option>
                    <option value="modere">Modéré</option>
                    <option value="difficile">Difficile</option>
                  </select>
                </div>
                {inp('departure_point', 'Point de départ')}
              </div>

              {/* Départ, capacité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inp('capacity', 'Capacité max (personnes)', 'number')}
              </div>

              {/* Avantages Luxe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">✨ Avantages formule Luxe</label>
                {listField('luxury_advantages', form.luxury_advantages, 'Ex: Hôtel 5★, Guide privé...')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ce qui est inclus</label>
                {listField('included', form.included, 'Ex: Guide professionnel')}
              </div>

              {/* Non inclus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Non inclus</label>
                {listField('not_included', form.not_included, 'Ex: Repas du soir')}
              </div>

              {/* Programme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Programme / Étapes</label>
                {listField('program', form.program, 'Ex: Jour 1 - Départ de Marrakech...')}
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                  <span className="text-sm">Circuit actif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} />
                  <span className="text-sm">En vedette</span>
                </label>
                <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                  placeholder="Ordre" className="w-20 border border-gray-300 rounded-md px-3 py-2" />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">{editing ? 'Mettre à jour' : 'Créer'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Circuit', 'Prix', 'Durée', 'Difficulté', 'Départ', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {circuits.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Aucun circuit. Créez le premier !</td></tr>
              ) : circuits.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {(c.images || []).slice(0, 2).map((img, i) => (
                          <img key={i} src={img} alt={c.name} className="w-10 h-8 object-cover rounded" />
                        ))}
                        {!(c.images || []).length && c.image && <img src={c.image} alt={c.name} className="w-10 h-8 object-cover rounded" />}
                        {(c.images || []).length > 2 && <span className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">+{c.images.length - 2}</span>}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {c.name}
                          {c.is_featured && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">Vedette</span>}
                        </div>
                        <div className="text-xs text-gray-500">{c.short_description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    <div className="text-green-700">{c.price ? `${c.price}€` : '-'} <span className="text-xs font-normal text-gray-500">std</span></div>
                    {c.price_luxury > 0 && <div className="text-yellow-600">{c.price_luxury}€ <span className="text-xs font-normal text-gray-500">lux</span></div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.duration || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.difficulty === 'facile' ? 'bg-green-100 text-green-800' : c.difficulty === 'modere' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {c.difficulty || 'facile'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.departure_point || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {c.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
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
