import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

export default function Galerie() {
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/backend/gallery')
      .then(r => r.json())
      .then(d => { if (d.success) setPhotos(d.photos); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Galerie — Trendy Travel Marrakech</title>
      </Head>
      <div className="min-h-screen bg-[#080d1a] text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400">Galerie</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">Nos Moments</h1>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Aucune photo disponible</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
              {photos.map((photo, i) => (
                <div key={photo.id} onClick={() => setLightbox(photo.url)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group border border-white/8 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={photo.url} alt={photo.alt || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-3xl">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300" onClick={() => setLightbox(null)}>×</button>
            <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        )}
      </div>
    </>
  );
}
