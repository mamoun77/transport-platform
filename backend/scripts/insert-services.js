const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
  host: 'localhost', dialect: 'postgres', port: 5432, logging: false
});

const services = [
  {
    name: 'Transfert Aéroport',
    slug: 'transfert-aeroport',
    price_from: 15.00,
    duration: '20-30 min',
    capacity: 4,
    short_description: 'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.',
    description: 'Profitez d\'un transfert confortable et ponctuel depuis ou vers l\'aéroport Marrakech-Menara. Nos chauffeurs professionnels vous accueillent à la sortie des arrivées avec un panneau à votre nom, s\'occupent de vos bagages et vous conduisent à destination en toute sérénité. Véhicule climatisé, Wi-Fi gratuit à bord. Disponible 24h/24, 7j/7.',
    features: JSON.stringify(['Accueil personnalisé', 'Prise en charge des bagages', 'Véhicule climatisé', 'Wi-Fi gratuit', 'Chauffeur professionnel', 'Disponible 24h/24'])
  },
  {
    name: 'Transfert Essaouira',
    slug: 'transfert-essaouira',
    price_from: 100.00,
    duration: '2h30 - 3h',
    capacity: 4,
    short_description: 'Transfert privé Marrakech ↔ Essaouira, la cité des vents.',
    description: 'Rejoignez la magnifique ville côtière d\'Essaouira depuis Marrakech en toute confort. Ce transfert privé de 2h30 à 3h vous fait traverser les plaines du Haouz et les arganiers de la région. Idéal pour une escapade à la mer, une journée dans la médina classée UNESCO ou un séjour prolongé. Retour possible le même jour ou à la date de votre choix.',
    features: JSON.stringify(['Trajet direct sans arrêt imposé', 'Véhicule confortable', 'Chauffeur expérimenté', 'Arrêts photos sur demande', 'Retour flexible', 'Climatisation'])
  },
  {
    name: 'Transfert Casablanca Centre',
    slug: 'transfert-casa-centre',
    price_from: 160.00,
    duration: '2h30 - 3h',
    capacity: 4,
    short_description: 'Transfert privé Marrakech ↔ Casablanca centre-ville.',
    description: 'Voyagez en toute tranquillité entre Marrakech et le centre de Casablanca. Notre service de transfert privé vous évite les contraintes des transports en commun et vous garantit une arrivée à l\'heure. Idéal pour les voyages d\'affaires ou les connexions vers la métropole économique du Maroc. Trajet via l\'autoroute A7, durée approximative 2h30 à 3h selon la circulation.',
    features: JSON.stringify(['Trajet via autoroute', 'Ponctualité garantie', 'Idéal affaires', 'Véhicule haut de gamme', 'Chauffeur bilingue', 'Facturation simplifiée'])
  },
  {
    name: 'Transfert Casablanca Aéroport',
    slug: 'transfert-casa-aeroport',
    price_from: 140.00,
    duration: '2h30 - 3h',
    capacity: 4,
    short_description: 'Transfert privé Marrakech ↔ Aéroport Mohammed V Casablanca.',
    description: 'Ne manquez plus jamais votre vol ! Notre service de transfert entre Marrakech et l\'aéroport international Mohammed V de Casablanca vous assure une prise en charge à l\'heure, calculée en fonction de votre horaire de vol. Suivi de votre vol en temps réel, attente gratuite en cas de retard. Le chauffeur vous accueille directement à l\'aéroport avec votre nom affiché.',
    features: JSON.stringify(['Suivi vol en temps réel', 'Attente gratuite retard', 'Accueil avec panneau', 'Prise en charge bagages', 'Calcul heure départ optimisé', 'Disponible 24h/24'])
  },
  {
    name: 'Transfert Agadir',
    slug: 'transfert-agadir',
    price_from: 140.00,
    duration: '2h30 - 3h',
    capacity: 4,
    short_description: 'Transfert privé Marrakech ↔ Agadir, la station balnéaire.',
    description: 'Rejoignez la perle du Souss depuis Marrakech en passant par les magnifiques paysages de l\'Anti-Atlas. Ce transfert privé vers Agadir, station balnéaire réputée pour ses plages et son ensoleillement, est idéal pour prolonger votre séjour marocain au bord de l\'Atlantique. Trajet d\'environ 2h30 via la route des cols ou l\'autoroute selon votre préférence.',
    features: JSON.stringify(['Route panoramique disponible', 'Arrêts sur demande', 'Véhicule climatisé', 'Chauffeur professionnel', 'Bagages inclus', 'Retour organisable'])
  },
  {
    name: 'Transfert Ouirgane',
    slug: 'transfert-ouirgane',
    price_from: 160.00,
    duration: '1h - 1h30',
    capacity: 4,
    short_description: 'Transfert privé vers Ouirgane, oasis de verdure au pied de l\'Atlas.',
    description: 'Découvrez Ouirgane, ce petit village berbère niché dans la vallée du Nfis au cœur du Haut Atlas. Notre transfert privé vous emmène depuis Marrakech à travers des paysages montagnards époustouflants, en longeant l\'oued Nfis et ses oliveraies. Idéal pour rejoindre un écolodge, un riad de montagne ou pour une journée de randonnée dans la nature.',
    features: JSON.stringify(['Route de montagne pittoresque', 'Chauffeur connaissant la région', 'Arrêts panoramiques', 'Véhicule adapté montagne', 'Bagages et équipement acceptés', 'Retour flexible'])
  },
  {
    name: 'Transfert Agafay',
    slug: 'transfert-agafay',
    price_from: 60.00,
    duration: '30-45 min',
    capacity: 4,
    short_description: 'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.',
    description: 'Le désert d\'Agafay, surnommé le "désert de pierres" de Marrakech, est accessible en seulement 30 à 45 minutes depuis la ville. Notre transfert privé vous conduit directement à votre camp ou lodge dans ce paysage lunaire unique. Parfait pour une nuit sous les étoiles, un dîner berbère ou une excursion en quad. Idéal pour les familles et les couples.',
    features: JSON.stringify(['Trajet court 30-45 min', 'Idéal nuit sous les étoiles', 'Accès camps et lodges', 'Retour nuit disponible', 'Véhicule confortable', 'Chauffeur ponctuel'])
  },
  {
    name: 'Transfert Imlil',
    slug: 'transfert-imlil',
    price_from: 70.00,
    duration: '1h - 1h30',
    capacity: 4,
    short_description: 'Transfert privé vers Imlil, porte du Toubkal et des randonnées.',
    description: 'Imlil est le point de départ incontournable pour les randonnées vers le Jbel Toubkal, le plus haut sommet d\'Afrique du Nord (4167m). Notre transfert privé depuis Marrakech vous emmène à travers la vallée de l\'Ourika et les villages berbères jusqu\'à ce village de montagne à 1740m d\'altitude. Idéal pour les randonneurs, alpinistes et amoureux de la nature.',
    features: JSON.stringify(['Accès direct village Imlil', 'Véhicule adapté route montagne', 'Chauffeur guide local', 'Transport équipement randonnée', 'Départ tôt le matin possible', 'Retour après randonnée'])
  },
  {
    name: 'Transfert Taghazout',
    slug: 'transfert-taghazout',
    price_from: 170.00,
    duration: '3h - 3h30',
    capacity: 4,
    short_description: 'Transfert privé vers Taghazout, paradis des surfeurs sur l\'Atlantique.',
    description: 'Taghazout, village de pêcheurs devenu la capitale marocaine du surf, vous attend à 3h de Marrakech sur la côte atlantique. Notre transfert privé vous conduit confortablement jusqu\'à ce spot de renommée mondiale, réputé pour ses vagues parfaites, ses couchers de soleil dorés et son ambiance décontractée. Idéal pour les surfeurs, les amateurs de yoga et les voyageurs en quête d\'authenticité.',
    features: JSON.stringify(['Trajet confortable 3h', 'Transport planches de surf', 'Arrêts sur demande', 'Chauffeur expérimenté', 'Climatisation', 'Retour organisable'])
  },
  {
    name: 'Transfert Palmeraie',
    slug: 'transfert-palmeraie',
    price_from: 25.00,
    duration: '15-25 min',
    capacity: 4,
    short_description: 'Transfert privé vers la Palmeraie de Marrakech.',
    description: 'La Palmeraie de Marrakech, oasis de 13 000 hectares aux portes de la ville, abrite les plus beaux riads et resorts de luxe de la région. Notre transfert privé vous y conduit en 15 à 25 minutes depuis le centre-ville ou l\'aéroport. Idéal pour rejoindre votre hôtel, participer à une balade à dos de dromadaire ou profiter d\'un déjeuner dans un cadre exceptionnel.',
    features: JSON.stringify(['Trajet rapide 15-25 min', 'Accès tous hôtels et riads', 'Idéal balade dromadaire', 'Véhicule climatisé', 'Chauffeur ponctuel', 'Disponible toute la journée'])
  }
];

async function insertServices() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté');

    for (const service of services) {
      await sequelize.query(`
        INSERT INTO services (name, slug, description, short_description, price_from, duration, capacity, features, is_active, sort_order)
        VALUES (:name, :slug, :description, :short_description, :price_from, :duration, :capacity, :features::json, true, 0)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          price_from = EXCLUDED.price_from,
          duration = EXCLUDED.duration,
          capacity = EXCLUDED.capacity,
          features = EXCLUDED.features;
      `, { replacements: service });
      console.log(`✅ ${service.name} — ${service.price_from}€`);
    }

    console.log('\n🎉 10 services insérés avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

insertServices();
