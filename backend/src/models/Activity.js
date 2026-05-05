const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  short_description: { type: DataTypes.STRING(500) },
  image: { type: DataTypes.STRING(500) },
  images: { type: DataTypes.JSON, defaultValue: [] },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  price_luxury: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  duration: { type: DataTypes.STRING(100) },
  capacity: { type: DataTypes.INTEGER },
  location: { type: DataTypes.STRING(200) },
  difficulty: { type: DataTypes.STRING(50), defaultValue: 'facile' },
  included: { type: DataTypes.JSON, defaultValue: [] },
  not_included: { type: DataTypes.JSON, defaultValue: [] },
  program: { type: DataTypes.JSON, defaultValue: [] },
  luxury_advantages: { type: DataTypes.JSON, defaultValue: [] },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'activities', underscored: true });

module.exports = Activity;
