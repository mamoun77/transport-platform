const { Sequelize } = require('sequelize');

let _sequelize = null;

function getSequelize() {
  if (_sequelize) return _sequelize;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    _sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });
  } else {
    _sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
      host: 'localhost', dialect: 'postgres', port: 5432, logging: false
    });
  }
  return _sequelize;
}

// Proxy pour garder la compatibilité avec le code existant
const handler = {
  get(target, prop) {
    const seq = getSequelize();
    const val = seq[prop];
    return typeof val === 'function' ? val.bind(seq) : val;
  }
};

module.exports = new Proxy({}, handler);
