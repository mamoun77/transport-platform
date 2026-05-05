import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';

export default function BlogPost() {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.blog);
        fetchRelatedBlogs(data.blog.category);
      } else {
        setError('Article non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category) => {
    try {
      const response = await fetch(`/api/blog?category=${category}&limit=3`);
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.blogs.filter(b => b.slug !== slug);
        setRelatedBlogs(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles liés:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Article non trouvé'}
            </h1>
            <button
              onClick={() => router.push('/blog')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Retour au blog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.meta_title || blog.title} - Transport Platform</title>
        <meta name="description" content={blog.meta_description || blog.excerpt} />
      </Head>

      <Header />

      <article className="min-h-screen bg-gray-50">
        <div className="bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-sm text-gray-600">
                  <li>
                    <button onClick={() => router.push('/')} className="hover:text-blue-600">
                      Accueil
                    </button>
                  </li>
                  <li>/</li>
                  <li>
                    <button onClick={() => router.push('/blog')} className="hover:text-blue-600">
                      Blog
                    </button>
                  </li>
                  <li>/</li>
                  <li className="text-gray-800">{blog.title}</li>
                </ol>
              </nav>

              <header className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>{blog.views_count || 0} vues</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  {blog.title}
                </h1>
                
                {blog.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">
                    {blog.excerpt}
                  </p>
                )}
                
                <div className="text-gray-500 text-sm">
                  Publié le {formatDate(blog.published_at)}
                </div>
              </header>

              {blog.featured_image && (
                <div className="mb-8">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Articles similaires
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedBlogs.map((relatedBlog) => (
                    <article
                      key={relatedBlog.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/blog/${relatedBlog.slug}`)}
                    >
                      <div className="p-6">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                          {relatedBlog.category}
                        </span>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {relatedBlog.title}
                        </h3>
                        
                        {relatedBlog.excerpt && (
                          <p className="text-gray-600 text-sm mb-4">
                            {relatedBlog.excerpt}
                          </p>
                        )}
                        
                        <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
                          Lire la suite →
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <button
                onClick={() => router.push('/blog')}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                ← Retour au blog
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}