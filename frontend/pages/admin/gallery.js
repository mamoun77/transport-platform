import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState('');
  const fileRef = useRef();
  const router = useRouter();

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/backend/gallery/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setPhotos(data.photos);
    } finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('alt', alt);
        await fetch('/backend/gallery/admin', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: fd
        });
      }
      setAlt('');
      fileRef.current.value = '';
      fetchPhotos();
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette photo ?')) return;
    await fetch(`/backend/gallery/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchPhotos();
  };

  const toggleActive = async (photo) => {
    await fetch(`/backend/gallery/admin/${photo.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !photo.is_active })
    });
    fetchPhotos();
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Galerie Photos</h1>
          <button onClick={() => router.push('/admin')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm">Retour Admin</button>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Ajouter des photos</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="text" value={alt} onChange={e => setAlt(e.target.value)}
              placeholder="Description (optionnel)" className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label className={`cursor-pointer inline-flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
              {uploading ? 'Upload en cours...' : '📷 Choisir photos'}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-2">Formats acceptés : JPG, PNG, WEBP — Max 10MB par photo</p>
        </div>

        {/* Grille photos */}
        {photos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucune photo — ajoutez-en ci-dessus</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className={`relative group rounded-xl overflow-hidden border-2 ${photo.is_active ? 'border-green-400' : 'border-gray-300'}`}>
                <img src={photo.url} alt={photo.alt} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => toggleActive(photo)}
                    className={`px-2 py-1 rounded text-xs font-bold text-white ${photo.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {photo.is_active ? 'Masquer' : 'Afficher'}
                  </button>
                  <button onClick={() => handleDelete(photo.id)} className="px-2 py-1 rounded text-xs font-bold text-white bg-red-500 hover:bg-red-600">
                    Supprimer
                  </button>
                </div>
                {!photo.is_active && (
                  <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded">Masqué</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
