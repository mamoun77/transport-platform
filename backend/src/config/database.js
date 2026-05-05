const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;
console.log('🔧 DATABASE_URL defined:', !!dbUrl);
console.log('🔧 DATABASE_URL value:', dbUrl ? dbUrl.substring(0, 50) : 'undefined');

let sequelize;

if (dbUrl) {
  try {
    // Fix special chars in password by splitting manually
    const withoutProto = dbUrl.replace(/^postgresql:\/\/|^postgres:\/\//, '');
    const atLastIndex = withoutProto.lastIndexOf('@');
    const credentials = withoutProto.substring(0, atLastIndex);
    const hostPart = withoutProto.substring(atLastIndex + 1);
    const colonIdx = credentials.indexOf(':');
    const username = credentials.substring(0, colonIdx);
    const password = credentials.substring(colonIdx + 1);
    const slashIdx = hostPart.indexOf('/');
    const hostPort = hostPart.substring(0, slashIdx);
    const database = hostPart.substring(slashIdx + 1);
    const portIdx = hostPort.lastIndexOf(':');
    const host = hostPort.substring(0, portIdx);
    const port = parseInt(hostPort.substring(portIdx + 1)) || 5432;

    sequelize = new Sequelize(database, username, password, {
      host, port, dialect: 'postgres', logging: false
    });
    console.log('✅ Sequelize configured, host:', host);
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
