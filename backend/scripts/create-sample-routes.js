const { Route } = require('../src/models');

const sampleRoutes = [
  {
    name: 'Aéroport Mohammed V - Centre-ville Casablanca',
    departure_location: 'Aéroport Mohammed V',
    arrival_location: 'Centre-ville Casablanca',
    distance_km: 35,
    estimated_duration: 45,
    base_price: 25.00,
    price_per_passenger: 5.00,
    vehicle_type: 'sedan',
    service_type: 'transfer'
  },
  {
    name: 'Casablanca - Rabat',
    departure_location: 'Casablanca',
    arrival_location: 'Rabat',
    distance_km: 90,
    estimated_duration: 90,
    base_price: 40.00,
    price_per_passenger: 7.50,
    vehicle_type: 'suv',
    service_type: 'transfer'
  },
  {
    name: 'Circuit Marrakech - Vallée de l\'Ourika',
    departure_location: 'Marrakech',
    arrival_location: 'Vallée de l\'Ourika',
    distance_km: 65,
    estimated_duration: 480,
    base_price: 80.00,
    price_per_passenger: 10.00,
    vehicle_type: 'van',
    service_type: 'excursion'
  },
  {
    name: 'Transfert Hôtel - Aéroport Marrakech',
    departure_location: 'Hôtels Marrakech',
    arrival_location: 'Aéroport Marrakech-Ménara',
    distance_km: 15,
    estimated_duration: 25,
    base_price: 15.00,
    price_per_passenger: 2.50,
    vehicle_type: 'sedan',
    service_type: 'transfer'
  },
  {
    name: 'Circuit privé Fès - Chefchaouen',
    departure_location: 'Fès',
    arrival_location: 'Chefchaouen',
    distance_km: 200,
    estimated_duration: 600,
    base_price: 120.00,
    price_per_passenger: 15.00,
    vehicle_type: 'luxury',
    service_type: 'private_tour'
  },
  {
    name: 'Navette Agadir Centre - Plages',
    departure_location: 'Centre-ville Agadir',
    arrival_location: 'Plages d\'Agadir',
    distance_km: 8,
    estimated_duration: 15,
    base_price: 8.00,
    price_per_passenger: 1.50,
    vehicle_type: 'minibus',
    service_type: 'shuttle'
  }
];

async function createSampleRoutes() {
  try {
    console.log('Création des trajets de démonstration...');
    
    // Supprimer les trajets existants
    await Route.destroy({ where: {} });
    console.log('Trajets existants supprimés');
    
    for (const routeData of sampleRoutes) {
      await Route.create(routeData);
      console.log(`✓ Trajet créé: ${routeData.name} - ${routeData.base_price}€`);
    }
    
    console.log('Tous les trajets ont été créés avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création des trajets:', error);
    process.exit(1);
  }
}

createSampleRoutes();