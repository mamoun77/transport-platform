require('dotenv').config({ path: '../.env' });
const { v2: cloudinary } = require('cloudinary');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

// Connexion directe Railway
const DB_URL = process.env.RAILWAY_DB_URL || require('../src/config/database');
const sequelize = process.env.RAILWAY_DB_URL
  ? new Sequelize(process.env.RAILWAY_DB_URL, { dialect: 'postgres', logging: false, dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } })
  : require('../src/config/database');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcu2kzg02',
  api_key: process.env.CLOUDINARY_API_KEY || '187784422248774',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'fWh0i9qOIH5pcTk1EwvvdO0iweQ',
});

const UPLOADS_DIR = path.join(__dirname, '../../frontend/public/uploads');

// Upload un fichier local vers Cloudinary
async function uploadToCloudinary(localPath, folder) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `transport/${folder}`,
      use_filename: true,
      unique_filename: false,
    });
    return result.secure_url;
  } catch (e) {
    console.error(`  ❌ Erreur upload ${localPath}:`, e.message);
    return null;
  }
}

// Convertit une URL locale en chemin absolu
function localUrlToPath(url) {
  if (!url || url.startsWith('http')) return null;
  // ex: /uploads/services/service-xxx.jpg
  return path.join(__dirname, '../../frontend/public', url);
}

// Détermine le folder Cloudinary selon l'URL
function getFolder(url) {
  if (!url) return 'misc';
  if (url.includes('/services/') || url.includes('/activities/')) return 'services';
  if (url.includes('/circuits/')) return 'circuits';
  if (url.includes('/destinations/')) return 'destinations';
  if (url.includes('/blog/')) return 'blog';
  return 'misc';
}

async function migrateTable(tableName, imageCol = 'image') {
  console.log(`\n📦 Migration table: ${tableName}`);
  const [rows] = await sequelize.query(`SELECT id, ${imageCol} as image, images FROM ${tableName}`);
  let updated = 0;

  for (const row of rows) {
    let newImage = row.image;
    let newImages = row.images;
    let changed = false;

    // Migrer image principale
    if (row.image && !row.image.startsWith('http')) {
      const localPath = localUrlToPath(row.image);
      if (localPath && fs.existsSync(localPath)) {
        console.log(`  ⬆️  Upload image: ${row.image}`);
        const url = await uploadToCloudinary(localPath, getFolder(row.image));
        if (url) { newImage = url; changed = true; console.log(`  ✅ ${url}`); }
      } else {
        console.log(`  ⚠️  Fichier introuvable: ${row.image}`);
      }
    }

    // Migrer tableau images
    if (row.images) {
      const imgs = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        const newImgs = [];
        for (const img of imgs) {
          if (img && !img.startsWith('http')) {
            const localPath = localUrlToPath(img);
            if (localPath && fs.existsSync(localPath)) {
              console.log(`  ⬆️  Upload image[]: ${img}`);
              const url = await uploadToCloudinary(localPath, getFolder(img));
              if (url) { newImgs.push(url); changed = true; console.log(`  ✅ ${url}`); continue; }
            } else {
              console.log(`  ⚠️  Fichier introuvable: ${img}`);
            }
          }
          newImgs.push(img);
        }
        newImages = newImgs;
      }
    }

    if (changed) {
      await sequelize.query(
        `UPDATE ${tableName} SET ${imageCol} = :image, images = :images WHERE id = :id`,
        { replacements: { image: newImage, images: JSON.stringify(newImages), id: row.id } }
      );
      updated++;
    }
  }

  console.log(`  ✅ ${updated}/${rows.length} enregistrements mis à jour`);
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    await migrateTable('services');
    await migrateTable('circuits');
    await migrateTable('destinations');

    console.log('\n🎉 Migration terminée !');
  } catch (e) {
    console.error('❌ Erreur:', e.message);
  } finally {
    await sequelize.close();
  }
}

main();
