import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MultiImageUpload from '../../components/MultiImageUpload';

const EMPTY = {
  name: '', short_description: '', description: '', image: '', images: [],
  price: '', price_luxury: '', duration: '', capacity: '', location: '',
  difficulty: 'facile', included: [], not_included: [], program: [],
  luxury_advantages: [], is_active: true, is_featured: false, sort_order: 0,
};

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const router = useRouter();

  const token = () => typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const r = await fetch('/backend/activities/admin/all', { headers: { Authorization: `Bearer ${token()}` } });
      const d = await r.json();
      if (d.success) setActivities(d.activities);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url    = editing ? `/backend/activities/admin/${editing.id}` : '/backend/activities/admin';
    const method = editing ? 'PUT' : 'POST';
    const payload = {
      ...form,
      image: form.images[0] || form.image || '',
      included: form.included.filter(x => x.trim()),
      not_included: form.not_included.filter(x => x.trim()),
      program: form.program.filter(x => x.trim()),
      luxury_advantages: form.luxury_advantages.filter(x => x.trim())
    };
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (d.success) { closeForm(); fetchAll(); }
    else alert(d.error || 'Erreur');
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette activité ?')) return;
    await fetch(`/backend/activities/admin/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    fetchAll();
  };

  const openEdit = (a) => { setEditing(a); setForm({ ...EMPTY, ...a, images: a.images || (a.image ? [a.image] : []), included: a.included || [], not_included: a.not_included || [], program: a.program || [], luxury_advantages: a.luxury_advantages || [] }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const listField = (key, label, placeholder) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <button type="button" onClick={() => setForm(p => ({ ...p, [key]: [...p[key], ''] }))}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">+ Ajouter</button>
      </div>
      {form[key].map((v, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={v} onChange={e => { const arr = [...form[key]]; arr[i] = e.target.value; setForm(p => ({ ...p, [key]: arr })); }}
            placeholder={placeholder} className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={() => setForm(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }))}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm">×</button>
        </div>
      ))}
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <>
      <Head><title>Activités - Admin</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gestion des Activités</h1>
                <p className="text-gray-500 text-xs sm:text-sm">{activities.length} activité(s)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-3 py-2 rounded-xl hover:bg-gray-600 text-sm font-semibold">← Retour</button>
              <button onClick={() => { closeForm(); setShowForm(true); }} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-2 rounded-xl hover:scale-105 transition text-sm font-semibold">+ Nouvelle activité</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Formulaire */}
          {showForm && (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-violet-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{editing ? 'Modifier l\'activité' : 'Nouvelle activité'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Quad dans le désert d'Agafay"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Localisation</label>
                    <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Ex: Agafay, Marrakech"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description courte</label>
                  <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} placeholder="Résumé en une phrase"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description complète *</label>
                  <textarea required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description détaillée de l'activité"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                </div>

                {/* Images */}
                <MultiImageUpload
                  images={form.images}
                  onChange={(imgs) => setForm(p => ({ ...p, images: imgs }))}
                  uploadEndpoint="activity-images"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prix standard (MAD)</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prix luxe (MAD)</label>
                    <input type="number" step="0.01" value={form.price_luxury} onChange={e => setForm(p => ({ ...p, price_luxury: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Durée</label>
                    <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Ex: 2h, 1 journée"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Capacité max</label>
                    <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulté</label>
                    <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500">
                      <option value="facile">Facile</option>
                      <option value="modere">Modéré</option>
                      <option value="difficile">Difficile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ordre d'affichage</label>
                    <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div className="flex flex-col gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-violet-500" />
                      <span className="text-sm font-semibold text-gray-700">Actif</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">⭐ Vedette</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listField('program', 'Programme / Étapes', 'Ex: Accueil et briefing sécurité')}
                  {listField('included', '✅ Inclus', 'Ex: Équipement de sécurité')}
                  {listField('not_included', '❌ Non inclus', 'Ex: Transport depuis hôtel')}
                  {listField('luxury_advantages', '✨ Avantages Luxe', 'Ex: Guide privé dédié')}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition">
                    {editing ? 'Mettre à jour' : 'Créer l\'activité'}
                  </button>
                  <button type="button" onClick={closeForm} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition">Annuler</button>
                </div>
              </form>
            </div>
          )}

          {/* Liste */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(a => (
              <div key={a.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/20 hover:shadow-xl transition">
                <div className="relative h-44">
                  <img src={(a.images && a.images[0]) || a.image || 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=80'} alt={a.name} className="w-full h-full object-cover" />
                  {(a.images || []).length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{a.images.length} photos</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {a.is_featured && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/90 text-yellow-900">⭐ Vedette</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.is_active ? 'bg-green-400/90 text-green-900' : 'bg-red-400/90 text-red-900'}`}>{a.is_active ? 'Actif' : 'Inactif'}</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg leading-tight">{a.name}</h3>
                    {a.location && <p className="text-white/70 text-xs">📍 {a.location}</p>}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{a.short_description || a.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {a.duration && <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold">⏱ {a.duration}</span>}
                    {a.capacity && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">👥 {a.capacity} pers.</span>}
                    {a.difficulty && <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">{a.difficulty}</span>}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-bold text-violet-600">{a.price > 0 ? `${a.price} MAD` : 'Sur demande'}</p>
                      {a.price_luxury > 0 && <p className="text-sm text-yellow-600 font-semibold">✨ {a.price_luxury} MAD luxe</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(a)} className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition">Modifier</button>
                      <button onClick={() => handleDelete(a.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition">Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activities.length === 0 && !showForm && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl mb-2">Aucune activité</p>
              <button onClick={() => setShowForm(true)} className="mt-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition">Créer la première activité</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
