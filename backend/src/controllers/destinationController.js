const Destination = require('../models/Destination');

// GET /api/destinations - Liste des destinations (public)
exports.getDestinations = async (req, res) => {
  try {
    const { featured } = req.query;
    const where = { is_active: true };
    if (featured === 'true') where.is_featured = true;
    
    const destinations = await Destination.findAll({
      where,
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    res.json({ success: true, destinations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/destinations/:slug - Destination par slug (public)
exports.getDestinationBySlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      where: { slug: req.params.slug, is_active: true }
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination non trouvée' });
    }
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ADMIN ROUTES
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    res.json({ success: true, destinations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const destinationData = {
      ...req.body,
      slug: generateSlug(req.body.name)
    };
    const destination = await Destination.create(destinationData);
    res.status(201).json({ success: true, destination });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    const [updated] = await Destination.update(updateData, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination non trouvée' });
    }
    
    const destination = await Destination.findByPk(req.params.id);
    res.json({ success: true, destination });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Destination non trouvée' });
    }
    
    res.json({ success: true, message: 'Destination supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}