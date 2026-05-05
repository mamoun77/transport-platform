@echo off
echo ========================================
echo   Configuration Base de Donnees PostgreSQL
echo ========================================
echo.

echo Creation de la base de donnees...
psql -U postgres -c "CREATE DATABASE transport_platform;"

echo.
echo Creation d'un utilisateur admin par defaut...
cd backend
node -e "
const { User } = require('./src/models');
const { sequelize } = require('./src/models');

async function createAdmin() {
  try {
    await sequelize.sync({ force: true });
    
    await User.create({
      email: 'admin@transport.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin'
    });
    
    await User.create({
      email: 'user@transport.com',
      password: '123456',
      firstName: 'User',
      lastName: 'Test',
      role: 'client'
    });
    
    console.log('Utilisateurs crees avec succes');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

createAdmin();
"

echo.
echo Base de donnees configuree avec succes!
echo Comptes de test:
echo - Admin: admin@transport.com / 123456
echo - User: user@transport.com / 123456
echo.
pause