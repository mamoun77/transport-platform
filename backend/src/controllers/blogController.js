const Blog = require('../models/Blog');
const { Op } = require('sequelize');

// Obtenir tous les articles (public)
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, featured } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'published' };
    
    if (category) where.category = category;
    if (featured === 'true') where.is_featured = true;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Blog.findAndCountAll({
      where,
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'tags', 'published_at', 'views_count']
    });

    res.json({
      success: true,
      blogs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir un article par slug (public)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({
      where: { slug, status: 'published' }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    // Incrémenter le compteur de vues
    await blog.increment('views_count');

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir les catégories (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(c => c.category).filter(Boolean);
    
    res.json({ success: true, categories: categoryList });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ADMIN ROUTES

// Obtenir tous les articles (admin)
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const { count, rows } = await Blog.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      blogs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Créer un article (admin)
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author_id: req.user.userId,
      slug: generateSlug(req.body.title)
    };

    if (blogData.status === 'published' && !blogData.published_at) {
      blogData.published_at = new Date();
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, blog, message: 'Article créé avec succès' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mettre à jour un article (admin)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    if (updateData.status === 'published' && !updateData.published_at) {
      updateData.published_at = new Date();
    }

    const [updated] = await Blog.update(updateData, {
      where: { id }
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    const blog = await Blog.findByPk(id);
    res.json({ success: true, blog, message: 'Article mis à jour avec succès' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Supprimer un article (admin)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Blog.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    res.json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir un article par ID (admin)
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fonction utilitaire pour générer un slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}