const Circuit = require('../models/Circuit');

const generateSlug = (name) => name.toLowerCase()
  .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-') + '-' + Date.now();

const normalizeNumber = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
};

const normalizeJsonArray = (value) => {
  if (Array.isArray(value)) return value.filter(x => typeof x === 'string' && x.trim());
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string' && x.trim()) : [];
    } catch {
      return [value];
    }
  }
  return [];
};

exports.getCircuits = async (req, res) => {
  try {
    const where = { is_active: true };
    if (req.query.featured === 'true') where.is_featured = true;
    const circuits = await Circuit.findAll({ where, order: [['sort_order', 'ASC'], ['name', 'ASC']] });
    res.json({ success: true, circuits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCircuitBySlug = async (req, res) => {
  try {
    const circuit = await Circuit.findOne({ where: { slug: req.params.slug, is_active: true } });
    if (!circuit) return res.status(404).json({ success: false, message: 'Circuit non trouvé' });
    res.json({ success: true, circuit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCircuits = async (req, res) => {
  try {
    const circuits = await Circuit.findAll({ order: [['sort_order', 'ASC'], ['created_at', 'DESC']] });
    res.json({ success: true, circuits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCircuit = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      slug: generateSlug(req.body.name),
      price: normalizeNumber(req.body.price, null),
      price_luxury: normalizeNumber(req.body.price_luxury, null),
      distance_km: normalizeNumber(req.body.distance_km, null),
      capacity: normalizeNumber(req.body.capacity, null),
      sort_order: normalizeNumber(req.body.sort_order, 0),
      included: normalizeJsonArray(req.body.included),
      not_included: normalizeJsonArray(req.body.not_included),
      luxury_advantages: normalizeJsonArray(req.body.luxury_advantages),
      program: normalizeJsonArray(req.body.program),
    };
    const circuit = await Circuit.create(payload);
    res.status(201).json({ success: true, circuit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateCircuit = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      price: normalizeNumber(req.body.price, null),
      price_luxury: normalizeNumber(req.body.price_luxury, null),
      distance_km: normalizeNumber(req.body.distance_km, null),
      capacity: normalizeNumber(req.body.capacity, null),
      sort_order: normalizeNumber(req.body.sort_order, 0),
      included: normalizeJsonArray(req.body.included),
      not_included: normalizeJsonArray(req.body.not_included),
      luxury_advantages: normalizeJsonArray(req.body.luxury_advantages),
      program: normalizeJsonArray(req.body.program),
    };
    if (updateData.name) updateData.slug = generateSlug(updateData.name);
    const [updated] = await Circuit.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'Circuit non trouvé' });
    const circuit = await Circuit.findByPk(req.params.id);
    res.json({ success: true, circuit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteCircuit = async (req, res) => {
  try {
    const deleted = await Circuit.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Circuit non trouvé' });
    res.json({ success: true, message: 'Circuit supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
