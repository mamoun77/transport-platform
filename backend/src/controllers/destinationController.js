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
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Le nom et la description sont requis.' });
    }

    const destinationData = {
      ...req.body,
      distance_from_city: req.body.distance_from_city === '' || req.body.distance_from_city === null ? null : parseInt(req.body.distance_from_city, 10),
      price: req.body.price === '' || req.body.price === null ? null : parseFloat(req.body.price),
      sort_order: req.body.sort_order === '' || req.body.sort_order === null ? 0 : parseInt(req.body.sort_order, 10),
      slug: generateSlug(name)
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
    // normalize numeric fields if present
    if (Object.prototype.hasOwnProperty.call(updateData, 'distance_from_city')) {
      updateData.distance_from_city = updateData.distance_from_city === '' || updateData.distance_from_city === null ? null : parseInt(updateData.distance_from_city, 10);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'price')) {
      updateData.price = updateData.price === '' || updateData.price === null ? null : parseFloat(updateData.price);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'sort_order')) {
      updateData.sort_order = updateData.sort_order === '' || updateData.sort_order === null ? 0 : parseInt(updateData.sort_order, 10);
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