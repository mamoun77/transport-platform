const { Sequelize } = require('sequelize');

function parseDbUrl(url) {
  try {
    const u = new URL(url);
    return {
      database: u.pathname.slice(1),
      username: u.username,
      password: u.password,
      host: u.hostname,
      port: parseInt(u.port) || 5432,
    };
  } catch {
    return null;
  }
}

const dbUrl = process.env.DATABASE_URL;
let sequelize;

if (dbUrl) {
  const parsed = parseDbUrl(dbUrl);
  if (parsed) {
    sequelize = new Sequelize(parsed.database, parsed.username, parsed.password, {
      host: parsed.host,
      port: parsed.port,
      dialect: 'postgres',
      logging: false,
    });
  } else {
    sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });
  }
} else {
  sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  });
}

module.exports = sequelize;
