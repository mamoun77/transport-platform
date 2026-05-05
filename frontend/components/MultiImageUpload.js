import { useState } from 'react';

export default function MultiImageUpload({ images = [], onChange, uploadEndpoint }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const r = await fetch(`/backend/upload/${uploadEndpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const d = await r.json();
      if (d.success) onChange([...images, ...d.imageUrls]);
      else alert('Erreur upload: ' + d.error);
    } catch {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));
  const moveLeft = (idx) => {
    if (idx === 0) return;
    const arr = [...images];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Photos ({images.length})
        <span className="text-xs font-normal text-gray-400 ml-2">La 1ère photo est la photo principale</span>
      </label>

      {/* Grille des photos */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={url} alt={`photo ${i + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-200" />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">Principal</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-1">
                {i > 0 && (
                  <button type="button" onClick={() => moveLeft(i)}
                    className="bg-white text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-blue-100"
                    title="Mettre en principal">←</button>
                )}
                <button type="button" onClick={() => remove(i)}
                  className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600">×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton d'ajout */}
      <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-sm text-gray-500">{uploading ? 'Upload en cours...' : 'Ajouter des photos (plusieurs à la fois)'}</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>
    </div>
  );
}
