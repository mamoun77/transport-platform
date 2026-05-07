import { useState } from 'react';

const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url; // relative URLs served by Vercel from public/
};

export default function ImageGallery({ images = [], mainImage, alt = '', height = 'h-64' }) {
  const [active, setActive] = useState(0);

  const raw = images.length > 0 ? images : (mainImage ? [mainImage] : []);
  const all = raw.map(resolveUrl).filter(Boolean);
  if (all.length === 0) return null;

  return (
    <div className="flex flex-col">
      {/* Photo principale */}
      <div className={`relative ${height} overflow-hidden rounded-t-3xl`}>
        <img
          src={all[active]}
          alt={`${alt} - photo ${active + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        {all.length > 1 && (
          <>
            <button
              onClick={() => setActive(i => (i - 1 + all.length) % all.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition z-10"
            >‹</button>
            <button
              onClick={() => setActive(i => (i + 1) % all.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition z-10"
            >›</button>
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
              {active + 1} / {all.length}
            </span>
          </>
        )}
      </div>

      {/* Miniatures */}
      {all.length > 1 && (
        <div className="flex gap-2 px-3 py-2 bg-[#0a0f1e] border-t border-white/10 overflow-x-auto">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                active === i ? 'border-blue-400 scale-105' : 'border-white/20 hover:border-white/60 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`miniature ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
