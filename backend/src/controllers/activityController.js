const Activity = require('../models/Activity');

const generateSlug = (name) => name.toLowerCase()
  .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-') + '-' + Date.now();

exports.getActivities = async (req, res) => {
  try {
    const where = { is_active: true };
    if (req.query.featured === 'true') where.is_featured = true;
    const activities = await Activity.findAll({ where, order: [['sort_order', 'ASC'], ['name', 'ASC']] });
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getActivityBySlug = async (req, res) => {
  try {
    const activity = await Activity.findOne({ where: { slug: req.params.slug, is_active: true } });
    if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({ order: [['sort_order', 'ASC'], ['created_at', 'DESC']] });
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const normalizeNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
};

const sanitizeActivityData = (data) => ({
  ...data,
  price: normalizeNumber(data.price, null),
  price_luxury: normalizeNumber(data.price_luxury, null),
  capacity: normalizeNumber(data.capacity, null),
  sort_order: normalizeNumber(data.sort_order, 0),
  is_active: data.is_active === undefined ? true : data.is_active,
  is_featured: data.is_featured === undefined ? false : data.is_featured,
});

exports.createActivity = async (req, res) => {
  try {
    const payload = sanitizeActivityData(req.body);
    const activity = await Activity.create({ ...payload, slug: generateSlug(payload.name) });
    res.status(201).json({ success: true, activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const updateData = sanitizeActivityData(req.body);
    if (updateData.name) updateData.slug = generateSlug(updateData.name);
    const [updated] = await Activity.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    const activity = await Activity.findByPk(req.params.id);
    res.json({ success: true, activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const deleted = await Activity.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
    res.json({ success: true, message: 'Activité supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
