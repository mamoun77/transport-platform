const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  price_from: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'transfer'
  },
  price_luxury: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  departure_point: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  program: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  included: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  not_included: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  luxury_advantages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Service;