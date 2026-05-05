import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';

const categoryGradients = {
  voyage:     'from-sky-500 to-blue-600',
  transport:  'from-violet-500 to-purple-600',
  conseils:   'from-emerald-500 to-teal-600',
  actualites: 'from-orange-500 to-amber-600',
  default:    'from-slate-500 to-slate-700',
};

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });
      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
            <p className="text-blue-300 text-sm tracking-widest uppercase">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Blog - Transport Platform</title>
        <meta name="description" content="Découvrez nos articles sur le transport, les voyages et les destinations" />
      </Head>

      <div className="min-h-screen bg-[#0a0f1e] text-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/30 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              Notre Blog
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
              Conseils, guides<br />& actualités
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Découvrez nos articles sur le transport, les voyages et les meilleures destinations du Maroc.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 pb-24">

          {/* Search & Filter */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-transform shadow-lg"
              >
                Rechercher
              </button>
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition"
            >
              <option value="" className="bg-[#0a0f1e]">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a0f1e]">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Cards */}
          {blogs.length === 0 ? (
            <div className="text-center py-24 text-slate-500 text-lg">Aucun article trouvé</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map((blog) => {
                const gradient = categoryGradients[blog.category?.toLowerCase()] ?? categoryGradients.default;
                return (
                  <article
                    key={blog.id}
                    onClick={() => router.push(`/blog/${blog.slug}`)}
                    className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/30 cursor-pointer h-full"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/30 to-transparent" />

                      {/* Category badge */}
                      <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradient} shadow-lg`}>
                        {blog.category}
                      </span>

                      {/* Views badge */}
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 backdrop-blur-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        {blog.views_count || 0}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-2">{formatDate(blog.published_at)}</p>
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                          {blog.title}
                        </h2>
                        {blog.excerpt && (
                          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-sm text-slate-500">{formatDate(blog.published_at)}</span>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-105 transition-transform`}>
                          Lire la suite
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Glow on hover */}
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${gradient} blur-2xl -z-10 scale-95`} />
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Suivant
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
