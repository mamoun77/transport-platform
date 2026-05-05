const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  departure_location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  arrival_location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  distance_km: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  estimated_duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  price_per_passenger: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  vehicle_type: {
    type: DataTypes.ENUM('sedan', 'suv', 'van', 'minibus', 'bus', 'luxury'),
    allowNull: true
  },
  service_type: {
    type: DataTypes.ENUM('transfer', 'excursion', 'private_tour', 'shuttle'),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'routes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Route;