const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
  host: 'localhost', dialect: 'postgres', port: 5432, logging: false
});

const activity = {
  name: 'Quad Bike in the Palmeraie',
  slug: 'quad-bike-palmeraie-marrakech',
  short_description: 'Thrilling quad adventure through palm groves, desert tracks and Berber villages just outside Marrakech.',
  description: 'Just outside Marrakech, the Palmeraie offers the perfect setting for an unforgettable quad bike adventure. Perfect for adventure lovers, families, and anyone looking for a unique outdoor activity during their stay in Marrakech. Ride through lush palm groves, open desert tracks, authentic Berber villages and rocky trails, with breathtaking views of the Atlas Mountains along the way.',
  price: 45,
  price_luxury: 65,
  duration: '3h30',
  capacity: 10,
  location: 'Palmeraie, Marrakech',
  difficulty: 'facile',
  program: [
    { time: '09:00', description: 'Pickup from your hotel or riad' },
    { time: '09:30', description: 'Arrival at the quad base in the Palmeraie' },
    { time: '09:30 - 09:45', description: 'Safety briefing and equipment (helmet, goggles, gloves) + test drive with the guide' },
    { time: '09:45 - 11:30', description: 'Quad adventure through palm groves, desert tracks, Berber villages and rocky trails — tea break in a traditional village — photo stops with Atlas Mountains views' },
    { time: '11:30 - 12:00', description: 'Return ride back to the base' },
    { time: '12:00 - 12:30', description: 'Return transfer to Marrakech' }
  ],
  included: [
    'Hotel pickup & drop-off',
    'Quad bike',
    'Professional guide',
    'Safety equipment (helmet, goggles, gloves)',
    'Moroccan mint tea'
  ],
  not_included: [
    'Personal travel insurance',
    'Tips',
    'Personal expenses'
  ],
  is_active: true,
  is_featured: true,
  sort_order: 1
};

async function insertActivity() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected');

    await sequelize.query(`
      INSERT INTO activities (
        name, slug, short_description, description, price, price_luxury,
        duration, capacity, location, difficulty,
        program, included, not_included,
        is_active, is_featured, sort_order,
        created_at, updated_at
      ) VALUES (
        :name, :slug, :short_description, :description, :price, :price_luxury,
        :duration, :capacity, :location, :difficulty,
        :program::json, :included::json, :not_included::json,
        :is_active, :is_featured, :sort_order,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        price_luxury = EXCLUDED.price_luxury,
        duration = EXCLUDED.duration,
        capacity = EXCLUDED.capacity,
        location = EXCLUDED.location,
        difficulty = EXCLUDED.difficulty,
        program = EXCLUDED.program,
        included = EXCLUDED.included,
        not_included = EXCLUDED.not_included,
        is_active = EXCLUDED.is_active,
        is_featured = EXCLUDED.is_featured,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();
    `, {
      replacements: {
        ...activity,
        program: JSON.stringify(activity.program),
        included: JSON.stringify(activity.included),
        not_included: JSON.stringify(activity.not_included)
      }
    });

    console.log('🎉 Quad Bike in the Palmeraie — inserted successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

insertActivity();
