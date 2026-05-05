const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    licensePlate: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      validate: { min: 2000, max: new Date().getFullYear() + 1 }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 50 }
    },
    vehicleType: {
      type: DataTypes.ENUM('sedan', 'suv', 'van', 'minibus', 'bus', 'luxury'),
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    insuranceExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lastMaintenance: {
      type: DataTypes.DATE,
      allowNull: true
    },
    photos: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  });

  return Vehicle;
};