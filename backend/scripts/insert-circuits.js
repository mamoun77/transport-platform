const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
  host: 'localhost', dialect: 'postgres', port: 5432, logging: false
});

const generateSlug = (name) => name.toLowerCase()
  .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');

const circuits = [
  {
    name: '4 Jours Merzouga & Sahara',
    price: 450,
    price_luxury: 495,
    duration: '4 jours / 3 nuits',
    distance_km: 560,
    difficulty: 'modere',
    departure_point: 'Marrakech',
    capacity: 8,
    short_description: 'L\'aventure ultime vers les dunes de l\'Erg Chebbi à Merzouga.',
    description: 'Partez pour 4 jours inoubliables à la découverte du Sahara marocain. Ce circuit vous emmène de Marrakech jusqu\'aux majestueuses dunes de l\'Erg Chebbi à Merzouga, en passant par les paysages grandioses de l\'Anti-Atlas, les gorges du Dadès, la vallée des Roses et les kasbahs de pisé. Nuit en camp nomade sous un ciel étoilé, lever de soleil sur les dunes à dos de dromadaire, visite des villages berbères et des oasis de palmiers. Un voyage au cœur de l\'âme du Maroc.',
    program: JSON.stringify([
      'Jour 1 : Marrakech → Col du Tichka → Ouarzazate → Vallée du Dadès (nuit à Boumalne)',
      'Jour 2 : Gorges du Dadès → Vallée des Roses → Gorges du Todra → Erfoud (nuit à Erfoud)',
      'Jour 3 : Erfoud → Merzouga → Dunes Erg Chebbi → Coucher de soleil → Nuit en camp nomade',
      'Jour 4 : Lever de soleil sur les dunes → Retour Marrakech via Ouarzazate'
    ]),
    included: JSON.stringify([
      'Transport en 4x4 ou minibus climatisé',
      'Hébergement 3 nuits (hôtel + camp nomade)',
      'Petit-déjeuner et dîner inclus',
      'Balade à dos de dromadaire',
      'Guide professionnel francophone',
      'Nuit en camp nomade avec dîner berbère'
    ]),
    not_included: JSON.stringify([
      'Déjeuners (environ 8-12€/repas)',
      'Boissons personnelles',
      'Pourboires guides et chauffeurs',
      'Activités optionnelles (quad, sandboard)'
    ]),
    luxury_advantages: JSON.stringify([
      'Hôtels 4★ et 5★ sélectionnés',
      'Camp de luxe avec tentes privatives équipées',
      'Dîner gastronomique au camp',
      'Transferts en véhicule 4x4 premium',
      'Guide privé dédié',
      'Petit-déjeuner buffet inclus'
    ])
  },
  {
    name: '2 Jours Zagora & Désert',
    price: 210,
    price_luxury: 240,
    duration: '2 jours / 1 nuit',
    distance_km: 360,
    difficulty: 'facile',
    departure_point: 'Marrakech',
    capacity: 8,
    short_description: 'Mini-aventure désertique à Zagora, la porte du Sahara.',
    description: 'Zagora, surnommée "la porte du Sahara", est accessible en 2 jours depuis Marrakech pour une première expérience désertique authentique. Ce circuit traverse la vallée du Drâa, la plus longue du Maroc, bordée de milliers de palmiers et de kasbahs de pisé. Vous passerez la nuit dans un camp nomade au milieu des dunes, avec dîner berbère, musique gnaoua et ciel étoilé exceptionnel. Une introduction parfaite au désert marocain.',
    program: JSON.stringify([
      'Jour 1 : Marrakech → Col du Tichka → Ouarzazate → Vallée du Drâa → Zagora → Camp nomade (nuit)',
      'Jour 2 : Lever de soleil → Balade dromadaire → Retour Marrakech via Agdz'
    ]),
    included: JSON.stringify([
      'Transport climatisé',
      'Nuit en camp nomade',
      'Dîner et petit-déjeuner',
      'Balade à dos de dromadaire',
      'Guide professionnel',
      'Visite de la vallée du Drâa'
    ]),
    not_included: JSON.stringify([
      'Déjeuners',
      'Boissons personnelles',
      'Pourboires'
    ]),
    luxury_advantages: JSON.stringify([
      'Camp de luxe avec tentes privatives',
      'Salle de bain privée dans la tente',
      'Dîner gastronomique aux chandelles',
      'Véhicule 4x4 premium',
      'Guide privé',
      'Hammam au camp inclus'
    ])
  },
  {
    name: '3 Jours Zagora & Drâa',
    price: 420,
    price_luxury: 445,
    duration: '3 jours / 2 nuits',
    distance_km: 360,
    difficulty: 'facile',
    departure_point: 'Marrakech',
    capacity: 8,
    short_description: 'Immersion complète dans la vallée du Drâa et le désert de Zagora.',
    description: 'Ce circuit de 3 jours offre une immersion profonde dans la culture berbère et saharienne du sud marocain. Vous aurez le temps de visiter les kasbahs de la vallée du Drâa, d\'explorer les oasis de palmiers, de vous perdre dans les ruelles des ksour et de passer deux nuits dans le désert pour vivre pleinement l\'expérience nomade. Le troisième jour est consacré à la découverte des gravures rupestres de Taouz et au retour panoramique via les gorges du Dadès.',
    program: JSON.stringify([
      'Jour 1 : Marrakech → Ouarzazate → Agdz → Vallée du Drâa → Zagora (nuit en hôtel)',
      'Jour 2 : Zagora → Dunes M\'Hamid → Camp nomade (nuit sous les étoiles)',
      'Jour 3 : Lever de soleil → Taouz → Gorges du Dadès → Retour Marrakech'
    ]),
    included: JSON.stringify([
      'Transport climatisé',
      '2 nuits (hôtel + camp nomade)',
      'Petits-déjeuners et dîners',
      'Balade à dos de dromadaire',
      'Guide professionnel francophone',
      'Visite des kasbahs et ksour'
    ]),
    not_included: JSON.stringify([
      'Déjeuners',
      'Boissons personnelles',
      'Pourboires',
      'Entrées sites payants'
    ]),
    luxury_advantages: JSON.stringify([
      'Hôtel 4★ à Zagora',
      'Camp de luxe avec tentes climatisées',
      'Dîners gastronomiques inclus',
      'Véhicule 4x4 premium',
      'Guide privé dédié',
      'Massage relaxant au camp'
    ])
  },
  {
    name: '1 Jour Ouarzazate & Aït Benhaddou',
    price: 210,
    price_luxury: 270,
    duration: '1 jour',
    distance_km: 200,
    difficulty: 'facile',
    departure_point: 'Marrakech',
    capacity: 8,
    short_description: 'Hollywood du Maroc et ksar UNESCO en une journée.',
    description: 'Ouarzazate, "la porte du désert" et capitale du cinéma africain, s\'explore en une journée depuis Marrakech. La route traverse le majestueux col du Tichka (2260 m) avec des panoramas à couper le souffle sur la chaîne atlasique. Vous visiterez le ksar d\'Aït Benhaddou, forteresse de pisé classée UNESCO et décor de films légendaires (Gladiator, Lawrence d\'Arabie, Game of Thrones), ainsi que les studios de cinéma Atlas et la kasbah de Taourirt. Une journée entre histoire, cinéma et architecture berbère.',
    program: JSON.stringify([
      'Départ Marrakech → Col du Tichka (2260m) → Arrêt panoramique',
      'Visite ksar Aït Benhaddou (UNESCO)',
      'Déjeuner à Ouarzazate',
      'Visite studios Atlas + Kasbah Taourirt',
      'Retour Marrakech en fin d\'après-midi'
    ]),
    included: JSON.stringify([
      'Transport climatisé',
      'Guide professionnel',
      'Entrée ksar Aït Benhaddou',
      'Visite studios de cinéma',
      'Arrêts photos panoramiques'
    ]),
    not_included: JSON.stringify([
      'Déjeuner (environ 10-15€)',
      'Boissons',
      'Pourboires'
    ]),
    luxury_advantages: JSON.stringify([
      'Véhicule 4x4 ou berline premium',
      'Déjeuner gastronomique inclus dans un riad',
      'Guide privé dédié toute la journée',
      'Visite privée du ksar sans groupe',
      'Accès VIP studios de cinéma',
      'Pause thé dans une kasbah de luxe'
    ])
  },
  {
    name: 'Agafay Demi-Journée — 1h Quad + 1h Dromadaire',
    price: 95,
    price_luxury: 0,
    duration: 'Demi-journée (4h)',
    distance_km: 35,
    difficulty: 'facile',
    departure_point: 'Marrakech',
    capacity: 10,
    short_description: '1h de quad + 1h de dromadaire dans le désert d\'Agafay.',
    description: 'Une demi-journée d\'aventure dans le désert de pierres d\'Agafay, à seulement 35 km de Marrakech. Cette formule combine deux activités emblématiques : 1 heure de quad sur les pistes ocre du désert avec des sensations fortes garanties, suivie d\'1 heure de balade à dos de dromadaire pour une immersion nomade authentique. Le tout se termine par un thé à la menthe dans un camp berbère avec vue panoramique sur l\'Atlas enneigé. Idéal pour les familles et les groupes.',
    program: JSON.stringify([
      'Transfert Marrakech → Agafay (35 min)',
      '1h de quad sur les pistes du désert',
      'Pause et changement d\'activité',
      '1h de balade à dos de dromadaire',
      'Thé à la menthe au camp berbère',
      'Retour Marrakech'
    ]),
    included: JSON.stringify([
      'Transport aller-retour',
      '1h de quad (casque et équipement fournis)',
      '1h de balade dromadaire',
      'Thé à la menthe au camp',
      'Guide accompagnateur',
      'Assurance activités'
    ]),
    not_included: JSON.stringify([
      'Photos et vidéos professionnelles',
      'Repas',
      'Pourboires'
    ]),
    luxury_advantages: JSON.stringify([])
  },
  {
    name: 'Agafay Demi-Journée — 2h Quad + 1h Dromadaire',
    price: 105,
    price_luxury: 0,
    duration: 'Demi-journée (5h)',
    distance_km: 35,
    difficulty: 'modere',
    departure_point: 'Marrakech',
    capacity: 10,
    short_description: '2h de quad + 1h de dromadaire pour les amateurs de sensations.',
    description: 'Pour ceux qui veulent pousser l\'aventure plus loin, cette formule prolongée offre 2 heures de quad dans le désert d\'Agafay. Vous explorerez des pistes plus variées et plus éloignées, avec des passages dans les collines rocheuses et des vues panoramiques sur l\'Atlas. La session se termine par 1 heure de balade à dos de dromadaire au coucher du soleil, moment magique dans ce paysage désertique. Un thé berbère clôture cette demi-journée d\'exception.',
    program: JSON.stringify([
      'Transfert Marrakech → Agafay (35 min)',
      '2h de quad — circuit étendu avec collines et panoramas',
      'Pause rafraîchissement',
      '1h de balade dromadaire au coucher du soleil',
      'Thé à la menthe et gâteaux berbères au camp',
      'Retour Marrakech'
    ]),
    included: JSON.stringify([
      'Transport aller-retour',
      '2h de quad (casque et équipement fournis)',
      '1h de balade dromadaire',
      'Thé et gâteaux berbères',
      'Guide accompagnateur',
      'Assurance activités'
    ]),
    not_included: JSON.stringify([
      'Photos et vidéos professionnelles',
      'Repas',
      'Pourboires'
    ]),
    luxury_advantages: JSON.stringify([])
  }
];

async function insertCircuits() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté');

    for (const c of circuits) {
      const slug = generateSlug(c.name) + '-' + Date.now();
      await sequelize.query(`
        INSERT INTO circuits (name, slug, description, short_description, price, price_luxury, duration, distance_km, difficulty, departure_point, capacity, program, included, not_included, luxury_advantages, is_active, is_featured, sort_order)
        VALUES (:name, :slug, :description, :short_description, :price, :price_luxury, :duration, :distance_km, :difficulty, :departure_point, :capacity, :program::json, :included::json, :not_included::json, :luxury_advantages::json, true, false, 0)
      `, {
        replacements: {
          name: c.name,
          slug,
          description: c.description,
          short_description: c.short_description,
          price: c.price,
          price_luxury: c.price_luxury,
          duration: c.duration,
          distance_km: c.distance_km,
          difficulty: c.difficulty,
          departure_point: c.departure_point,
          capacity: c.capacity,
          program: c.program,
          included: c.included,
          not_included: c.not_included,
          luxury_advantages: c.luxury_advantages
        }
      });
      const luxeInfo = c.price_luxury > 0 ? ` / Luxe ${c.price_luxury}€` : '';
      console.log(`✅ ${c.name} — Standard ${c.price}€${luxeInfo}`);
    }

    console.log('\n🎉 6 circuits insérés avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

insertCircuits();
