const Circuit = require('../models/Circuit');

const generateSlug = (name) => name.toLowerCase()
  .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');

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
    const circuit = await Circuit.create({ ...req.body, slug: generateSlug(req.body.name) });
    res.status(201).json({ success: true, circuit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateCircuit = async (req, res) => {
  try {
    const updateData = { ...req.body };
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
