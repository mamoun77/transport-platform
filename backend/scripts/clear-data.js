const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false
});

async function clearData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à la base de données');

    await sequelize.query('DELETE FROM blogs;');
    console.log('✅ Blogs supprimés');

    await sequelize.query('DELETE FROM services;');
    console.log('✅ Services supprimés');

    await sequelize.query('DELETE FROM destinations;');
    console.log('✅ Destinations/Excursions supprimées');

    await sequelize.query('DELETE FROM routes;');
    console.log('✅ Itinéraires supprimés');

    await sequelize.query('DELETE FROM vehicles;');
    console.log('✅ Véhicules supprimés');

    await sequelize.query(`DELETE FROM users WHERE email != 'admin@transport.com';`);
    console.log('✅ Utilisateurs de test supprimés (admin conservé)');

    // Réinitialiser les séquences
    await sequelize.query(`ALTER SEQUENCE IF EXISTS services_id_seq RESTART WITH 1;`);
    await sequelize.query(`ALTER SEQUENCE IF EXISTS destinations_id_seq RESTART WITH 1;`);
    await sequelize.query(`ALTER SEQUENCE IF EXISTS blogs_id_seq RESTART WITH 1;`);
    await sequelize.query(`ALTER SEQUENCE IF EXISTS routes_id_seq RESTART WITH 1;`);
    await sequelize.query(`ALTER SEQUENCE IF EXISTS vehicles_id_seq RESTART WITH 1;`);
    console.log('✅ Séquences réinitialisées');

    console.log('\n🎉 Base de données vidée avec succès !');
    console.log('👉 Connectez-vous sur /admin pour ajouter vos services et excursions.');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

clearData();
