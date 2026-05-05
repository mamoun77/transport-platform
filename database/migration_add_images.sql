-- Migration: ajouter colonne images (JSON) aux tables activities et services
ALTER TABLE activities    ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]';
ALTER TABLE services     ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]';
ALTER TABLE circuits     ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]';
