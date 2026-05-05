const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Circuit = sequelize.define('Circuit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  short_description: { type: DataTypes.STRING(500), allowNull: true },
  image: { type: DataTypes.STRING(500), allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
  price_luxury: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
  luxury_advantages: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  duration: { type: DataTypes.STRING(100), allowNull: true },
  distance_km: { type: DataTypes.INTEGER, allowNull: true },
  difficulty: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'facile' },
  departure_point: { type: DataTypes.STRING(200), allowNull: true },
  included: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  not_included: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  program: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  capacity: { type: DataTypes.INTEGER, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'circuits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Circuit;
