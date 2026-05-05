const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;

const sequelize = dbUrl
  ? new Sequelize(dbUrl, { dialect: 'postgres', logging: false })
  : new Sequelize('transport_platform', 'postgres', 'root', {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432,
      logging: false
    });

module.exports = sequelize;
