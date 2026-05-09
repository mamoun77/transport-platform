-- Migration: ajouter les champs manquants à la table services
ALTER TABLE services ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'transfer';
ALTER TABLE services ADD COLUMN IF NOT EXISTS price_luxury DECIMAL(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS departure_point VARCHAR(300);
ALTER TABLE services ADD COLUMN IF NOT EXISTS program JSON DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS included JSON DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS not_included JSON DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS luxury_advantages JSON DEFAULT '[]';
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
