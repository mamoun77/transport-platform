const sequelize = require('../src/config/database');
const { User } = require('../src/models');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    const adminData = {
      email: 'admin@transport-platform.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'System',
      phone: '+33123456789',
      role: 'admin',
      language: 'fr',
      isActive: true,
      emailVerified: true
    };

    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    
    if (existingAdmin) {
      console.log('Un admin avec cet email existe déjà.');
      return;
    }

    const admin = await User.create(adminData);
    console.log('Utilisateur admin créé avec succès !');
    console.log('Email:', adminData.email);
    console.log('Mot de passe:', adminData.password);
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin();