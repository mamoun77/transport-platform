const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    serviceType: {
      type: DataTypes.ENUM('transfer', 'excursion', 'private_tour', 'shuttle'),
      allowNull: false
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropoffLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickupDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pickupTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    passengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 50 }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'EUR'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'refunded'),
      defaultValue: 'pending'
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clientNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Booking;
};