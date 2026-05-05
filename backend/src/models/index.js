const sequelize = require('../config/database');

let User, Booking, Vehicle, Route;

try {
  User = require('./User')(sequelize);
  Booking = require('./Booking')(sequelize);
  Vehicle = require('./Vehicle')(sequelize);
  Route = require('./Route');

  // Relations
  User.hasMany(Booking, { foreignKey: 'userId' });
  Booking.belongsTo(User, { foreignKey: 'userId' });

  Vehicle.hasMany(Booking, { foreignKey: 'vehicleId' });
  Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
} catch (error) {
  console.log('Modèles en mode simulation');
  // Modèles factices pour le mode simulation
  Route = {
    findAll: () => Promise.reject(new Error('DB not available')),
    findByPk: () => Promise.reject(new Error('DB not available')),
    create: () => Promise.reject(new Error('DB not available')),
    update: () => Promise.reject(new Error('DB not available')),
    destroy: () => Promise.reject(new Error('DB not available'))
  };
}

module.exports = {
  sequelize,
  User,
  Booking,
  Vehicle,
  Route
};