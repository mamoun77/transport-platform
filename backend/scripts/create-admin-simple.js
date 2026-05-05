const bcrypt = require('bcryptjs');

async function createAdminData() {
  const password = 'Admin123!';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('=== DONNÉES ADMIN ===');
  console.log('Email: admin@transport-platform.com');
  console.log('Mot de passe:', password);
  console.log('Hash du mot de passe:', hashedPassword);
  console.log('Rôle: admin');
  console.log('');
  console.log('SQL pour insérer directement:');
  console.log(`INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, language, is_active, email_verified) VALUES (gen_random_uuid(), 'admin@transport-platform.com', '${hashedPassword}', 'Admin', 'System', '+33123456789', 'admin', 'fr', true, true);`);
}

createAdminData();