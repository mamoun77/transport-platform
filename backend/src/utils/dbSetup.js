const sequelize = require('../config/database');

async function createDatabaseIfNotExists() {
  return true;
}

async function setupTables() {
  if (!sequelize) return false;
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');

    await sequelize.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL DEFAULT '', first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL, phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'client', is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, slug VARCHAR(250) UNIQUE NOT NULL,
      description TEXT DEFAULT '', short_description VARCHAR(500), image VARCHAR(500),
      price_from DECIMAL(10,2), duration VARCHAR(100), capacity INTEGER,
      features JSON DEFAULT '[]', is_active BOOLEAN DEFAULT true, sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, slug VARCHAR(250) UNIQUE NOT NULL,
      description TEXT DEFAULT '', short_description VARCHAR(500), image VARCHAR(500),
      price DECIMAL(10,2) DEFAULT 0, location VARCHAR(200), distance_from_city INTEGER,
      attractions JSON DEFAULT '[]', is_active BOOLEAN DEFAULT true, is_featured BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS circuits (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, slug VARCHAR(250) UNIQUE NOT NULL,
      description TEXT DEFAULT '', short_description VARCHAR(500), image VARCHAR(500),
      price DECIMAL(10,2) DEFAULT 0, duration VARCHAR(100), distance_km INTEGER,
      difficulty VARCHAR(50) DEFAULT 'facile', departure_point VARCHAR(200),
      included JSON DEFAULT '[]', not_included JSON DEFAULT '[]', program JSON DEFAULT '[]',
      capacity INTEGER, is_active BOOLEAN DEFAULT true, is_featured BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY, booking_number VARCHAR(50) UNIQUE NOT NULL,
      service_name VARCHAR(200), pickup_location VARCHAR(200), dropoff_location VARCHAR(200),
      pickup_date VARCHAR(20), pickup_time VARCHAR(10), passengers INTEGER DEFAULT 1,
      total_price DECIMAL(10,2) DEFAULT 0, client_name VARCHAR(200), client_phone VARCHAR(50),
      client_email VARCHAR(200), flight_number VARCHAR(50), notes TEXT,
      status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, slug VARCHAR(250) UNIQUE NOT NULL,
      excerpt TEXT, content TEXT DEFAULT '', featured_image VARCHAR(500),
      category VARCHAR(100) DEFAULT 'general', tags JSON DEFAULT '[]',
      status VARCHAR(20) DEFAULT 'draft', is_featured BOOLEAN DEFAULT false,
      views_count INTEGER DEFAULT 0, published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await sequelize.query(`INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ('admin@transport.com', 'root', 'Admin', 'System', 'admin')
      ON CONFLICT (email) DO NOTHING`);

    console.log('✅ Tables créées');
    return true;
  } catch (error) {
    console.log('❌ DB setup error:', error.message);
    return false;
  }
}

module.exports = { createDatabaseIfNotExists, setupTables };
