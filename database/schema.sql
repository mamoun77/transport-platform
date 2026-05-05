-- Schéma de base de données pour Transport Platform
-- ================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Table des chauffeurs
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des itinéraires
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    departure_location VARCHAR(200) NOT NULL,
    arrival_location VARCHAR(200) NOT NULL,
    distance_km INTEGER NOT NULL,
    estimated_duration INTEGER NOT NULL, -- en minutes
    base_price DECIMAL(10,2) NOT NULL,
    price_per_passenger DECIMAL(10,2) DEFAULT 0.00,
    vehicle_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('transfer', 'excursion', 'shuttle')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    passengers INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MAD',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@transport.com', '$2a$10$demo', 'Admin', 'System', 'admin'),
('user@test.com', '$2a$10$demo', 'Client', 'Test', 'client'),
('driver@transport.com', '$2a$10$demo', 'Ahmed', 'Benali', 'driver')
ON CONFLICT (email) DO NOTHING;

INSERT INTO vehicles (name, type, capacity, price_per_km, license_plate) VALUES
('Mercedes Classe S', 'luxury', 4, 2.50, 'A-123-45'),
('Mercedes Vito', 'van', 8, 1.80, 'B-678-90'),
('Bus Mercedes', 'bus', 20, 3.00, 'C-111-22')
ON CONFLICT (license_plate) DO NOTHING;

INSERT INTO routes (name, departure_location, arrival_location, distance_km, estimated_duration, base_price, price_per_passenger, vehicle_type, service_type) VALUES
('Aéroport → Centre-ville', 'Aéroport Mohammed V', 'Centre-ville Casablanca', 35, 45, 25.00, 5.00, 'sedan', 'transfer'),
('Hôtel → Plage', 'Hôtel Marina', 'Plage Ain Diab', 15, 20, 15.00, 3.00, 'sedan', 'transfer'),
('Circuit Touristique', 'Centre-ville', 'Sites touristiques', 50, 120, 40.00, 8.00, 'van', 'excursion')
ON CONFLICT DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_routes_active ON routes(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(is_available);

DO $$
BEGIN
  RAISE NOTICE 'Schéma de base de données créé avec succès !';
END
$$;