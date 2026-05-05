const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;
console.log('🔧 DATABASE_URL defined:', !!dbUrl);

let sequelize;

if (dbUrl) {
  try {
    const u = new URL(dbUrl);
    sequelize = new Sequelize(
      decodeURIComponent(u.pathname.slice(1)),
      decodeURIComponent(u.username),
      decodeURIComponent(u.password),
      {
        host: u.hostname,
        port: parseInt(u.port) || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );
    console.log('✅ Sequelize configured with DATABASE_URL');
  } catch (e) {
    console.log('❌ Failed to parse DATABASE_URL:', e.message);
    sequelize = null;
  }
} else {
  console.log('⚠️  No DATABASE_URL, using localhost');
  sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  });
}

module.exports = sequelize;
