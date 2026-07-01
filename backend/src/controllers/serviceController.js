const Service = require('../models/Service');

// GET /api/services - Liste des services (public)
exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/services/:slug - Service par slug (public)
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug, is_active: true }
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ADMIN ROUTES
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const serviceData = { ...req.body, slug: generateSlug(req.body.name) };
    ['features', 'program', 'included', 'not_included', 'luxury_advantages', 'images'].forEach(field => {
      if (serviceData[field] && typeof serviceData[field] === 'string') {
        try { serviceData[field] = JSON.parse(serviceData[field]); } catch { serviceData[field] = []; }
      }
      if (!serviceData[field]) serviceData[field] = [];
    });
    ['price_from', 'price_luxury', 'extra_passenger_fee', 'capacity', 'sort_order'].forEach(field => {
      if (serviceData[field] === '' || serviceData[field] === undefined) serviceData[field] = null;
    });
    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error('createService error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Nettoyer les champs JSON
    ['features', 'program', 'included', 'not_included', 'luxury_advantages', 'images'].forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try { updateData[field] = JSON.parse(updateData[field]); } catch { updateData[field] = []; }
      }
      if (!updateData[field]) updateData[field] = [];
    });

    // Convertir les champs numériques — string vide → null
    ['price_from', 'price_luxury', 'extra_passenger_fee', 'capacity', 'sort_order'].forEach(field => {
      if (updateData[field] === '' || updateData[field] === undefined) updateData[field] = null;
    });

    // Ne pas mettre à jour le slug pour éviter les conflits
    delete updateData.slug;

    if (updateData.name) {
      const newSlug = generateSlug(updateData.name);
      const existing = await Service.findOne({ where: { slug: newSlug } });
      if (!existing || String(existing.id) === String(req.params.id)) {
        updateData.slug = newSlug;
      }
    }
    
    const [updated] = await Service.update(updateData, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    
    const service = await Service.findByPk(req.params.id);
    res.json({ success: true, service });
  } catch (error) {
    console.error('updateService error:', error.message);
    console.error('updateService data:', JSON.stringify(updateData));
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    
    res.json({ success: true, message: 'Service supprimé' });
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