import Link from 'next/link';
import shareItem from '../utils/share';

export default function ServiceCard({ service }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-full shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 relative">
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">{service.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-600">{service.price}</span>
            <p className="text-sm text-gray-500">par personne</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => shareItem({ title: service.title || service.name, text: service.description || '', url: `${typeof window !== 'undefined' ? window.location.origin : ''}/services/${service.id}` })}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:bg-white/8 transition"
              aria-label="Partager"
            >
              🔗 Partager
            </button>
            <Link
              href={`/services/${service.id}`}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}