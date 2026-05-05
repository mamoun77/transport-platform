const { Sequelize } = require('sequelize');

// Fonction pour créer la base de données si elle n'existe pas
async function createDatabaseIfNotExists() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('⚠️  DATABASE_URL non définie, skip DB setup');
      return false;
    }
    
    const sequelizeRoot = new Sequelize(dbUrl, { 
      dialect: 'postgres', 
      logging: false,
      dialectOptions: {
        ssl: false
      }
    });

    await sequelizeRoot.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');
    await sequelizeRoot.close();
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la création de la base de données:', error.message);
    return false;
  }
}

// Fonction pour créer les tables avec des données de test
async function setupTables() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('⚠️  DATABASE_URL non définie, skip tables setup');
      return false;
    }

    const sequelize = new Sequelize(dbUrl, { 
      dialect: 'postgres', 
      logging: false,
      dialectOptions: {
        ssl: false
      }
    });
    await sequelize.authenticate();
    
    // Créer les tables
    await sequelize.query(`
      -- Table des utilisateurs
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'driver')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      -- Table des véhicules
      CREATE TABLE IF NOT EXISTS vehicles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL CHECK (type IN ('sedan', 'suv', 'van', 'bus', 'luxury')),
          capacity INTEGER NOT NULL,
          price_per_km DECIMAL(10,2) NOT NULL,
          license_plate VARCHAR(20) UNIQUE,
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      -- Table des itinéraires
      CREATE TABLE IF NOT EXISTS routes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          departure_location VARCHAR(200) NOT NULL,
          arrival_location VARCHAR(200) NOT NULL,
          distance_km INTEGER NOT NULL,
          estimated_duration INTEGER NOT NULL,
          base_price DECIMAL(10,2) NOT NULL,
          price_per_passenger DECIMAL(10,2) DEFAULT 0.00,
          vehicle_type VARCHAR(50) NOT NULL,
          service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('transfer', 'excursion', 'shuttle')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      -- Table des blogs
      CREATE TABLE IF NOT EXISTS blogs (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          slug VARCHAR(250) UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          featured_image VARCHAR(500),
          author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          category VARCHAR(100) DEFAULT 'general',
          tags JSON DEFAULT '[]',
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          is_featured BOOLEAN DEFAULT false,
          views_count INTEGER DEFAULT 0,
          published_at TIMESTAMP,
          meta_title VARCHAR(200),
          meta_description VARCHAR(300),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      -- Table des services
      CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(250) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          short_description VARCHAR(500),
          image VARCHAR(500),
          price_from DECIMAL(10,2),
          duration VARCHAR(100),
          capacity INTEGER,
          features JSON DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      -- Table des destinations
      CREATE TABLE IF NOT EXISTS destinations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(250) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          short_description VARCHAR(500),
          image VARCHAR(500),
          location VARCHAR(200),
          distance_from_city INTEGER,
          attractions JSON DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Compte admin uniquement
    await sequelize.query(`
      INSERT INTO users (email, password, first_name, last_name, role) VALUES
      ('admin@transport.com', '$2a$10$demo', 'Admin', 'System', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);

    await sequelize.query(`
      ALTER TABLE destinations ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS circuits (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(250) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          short_description VARCHAR(500),
          image VARCHAR(500),
          price DECIMAL(10,2) DEFAULT 0,
          duration VARCHAR(100),
          distance_km INTEGER,
          difficulty VARCHAR(50) DEFAULT 'facile',
          departure_point VARCHAR(200),
          included JSON DEFAULT '[]',
          not_included JSON DEFAULT '[]',
          program JSON DEFAULT '[]',
          capacity INTEGER,
          is_active BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          booking_number VARCHAR(50) UNIQUE NOT NULL,
          service_name VARCHAR(200),
          pickup_location VARCHAR(200),
          dropoff_location VARCHAR(200),
          pickup_date VARCHAR(20),
          pickup_time VARCHAR(10),
          passengers INTEGER DEFAULT 1,
          total_price DECIMAL(10,2) DEFAULT 0,
          client_name VARCHAR(200),
          client_phone VARCHAR(50),
          client_email VARCHAR(200),
          flight_number VARCHAR(50),
          notes TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables créées et données de test insérées');
    await sequelize.close();
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la création des tables:', error.message);
    await sequelize.close();
    return false;
  }
}

module.exports = { createDatabaseIfNotExists, setupTables };