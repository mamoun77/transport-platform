const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transport_platform', 'postgres', 'root', {
  host: 'localhost', dialect: 'postgres', port: 5432, logging: false
});

const generateSlug = (name) => name.toLowerCase()
  .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');

const excursions = [
  {
    name: 'Vallée de l\'Ourika',
    price: 70,
    location: 'Haut Atlas',
    distance_from_city: 60,
    short_description: 'Oasis de verdure et cascades au pied de l\'Atlas.',
    description: 'La vallée de l\'Ourika est l\'une des excursions les plus populaires au départ de Marrakech. À seulement 60 km, elle offre un dépaysement total avec ses villages berbères accrochés aux flancs de la montagne, ses jardins de safran et ses cascades de Setti Fatma. Vous traverserez des marchés locaux animés, découvrirez l\'artisanat amazigh et profiterez d\'un déjeuner traditionnel au bord de l\'oued. Une journée ressourçante entre nature et culture.',
    attractions: JSON.stringify(['Cascades de Setti Fatma', 'Villages berbères', 'Marché local du lundi', 'Jardins de safran', 'Randonnée légère'])
  },
  {
    name: 'Imlil & Toubkal',
    price: 80,
    location: 'Haut Atlas',
    distance_from_city: 65,
    short_description: 'Porte du Toubkal, plus haut sommet d\'Afrique du Nord.',
    description: 'Imlil est le point de départ incontournable pour explorer le massif du Toubkal, culminant à 4167 m. Cette excursion vous emmène à travers la vallée de l\'Aït Mizane, entre noyers centenaires et terrasses cultivées. Vous visiterez le village d\'Imlil, rencontrerez des familles berbères et pourrez vous aventurer sur les premiers sentiers de randonnée avec vue imprenable sur les sommets enneigés. Idéal pour les amoureux de montagne et de grand air.',
    attractions: JSON.stringify(['Village d\'Imlil', 'Vallée de l\'Aït Mizane', 'Panorama sur le Toubkal', 'Rencontre avec familles berbères', 'Sentiers de randonnée'])
  },
  {
    name: 'Désert d\'Agafay',
    price: 70,
    location: 'Agafay',
    distance_from_city: 35,
    short_description: 'Le désert de pierres aux portes de Marrakech.',
    description: 'Le désert d\'Agafay, surnommé le "désert de Marrakech", est un plateau rocheux aux paysages lunaires situé à seulement 35 km de la ville. Cette excursion vous plonge dans une atmosphère saharienne unique sans quitter la région. Au programme : balade à dos de dromadaire, quad sur les pistes ocre, coucher de soleil spectaculaire sur les collines et dîner berbère sous les étoiles dans un camp nomade. Une expérience magique et authentique.',
    attractions: JSON.stringify(['Balade à dos de dromadaire', 'Quad sur les pistes', 'Coucher de soleil', 'Dîner berbère', 'Nuit sous les étoiles'])
  },
  {
    name: 'Essaouira',
    price: 120,
    location: 'Côte Atlantique',
    distance_from_city: 180,
    short_description: 'La cité des vents, joyau de l\'Atlantique classé UNESCO.',
    description: 'Essaouira, ancienne cité portugaise devenue ville impériale marocaine, est un véritable bijou architectural classé au patrimoine mondial de l\'UNESCO. Cette excursion d\'une journée vous fait traverser les plaines du Haouz et les arganiers avant d\'arriver face à l\'Atlantique. Vous déambulerez dans la médina blanche et bleue, visiterez le port de pêche animé, les remparts battus par les vents et les galeries d\'art. Une ville hors du temps, bohème et envoûtante.',
    attractions: JSON.stringify(['Médina classée UNESCO', 'Remparts et bastions', 'Port de pêche', 'Galeries d\'art', 'Plage de surf', 'Souks d\'artisanat'])
  },
  {
    name: 'Oued Ourika & Lac',
    price: 120,
    location: 'Haut Atlas',
    distance_from_city: 70,
    short_description: 'Randonnée au bord de l\'oued et découverte du lac de montagne.',
    description: 'Cette excursion combine la beauté de la vallée de l\'Ourika avec la découverte d\'un lac de montagne préservé. Vous longerez l\'oued Ourika à travers des gorges spectaculaires, passerez par des villages berbères authentiques et atteindrez un lac aux eaux turquoise niché dans les montagnes. Une randonnée accessible à tous, ponctuée de pauses dans des cafés de montagne avec vue imprenable. Le retour se fait par une route panoramique offrant des vues à couper le souffle.',
    attractions: JSON.stringify(['Gorges de l\'Ourika', 'Lac de montagne', 'Villages berbères', 'Randonnée accessible', 'Cafés panoramiques'])
  },
  {
    name: 'Ouarzazate & Aït Benhaddou',
    price: 160,
    location: 'Ouarzazate',
    distance_from_city: 200,
    short_description: 'La porte du désert et le ksar d\'Aït Benhaddou classé UNESCO.',
    description: 'Ouarzazate, surnommée "la porte du désert" et "Hollywood de l\'Afrique", est une destination époustouflante à 200 km de Marrakech via le col du Tichka (2260 m). Cette excursion d\'une journée vous emmène à travers des paysages grandioses de l\'Anti-Atlas jusqu\'au ksar d\'Aït Benhaddou, forteresse de pisé classée UNESCO et décor de nombreux films (Gladiator, Game of Thrones). Vous visiterez également les studios de cinéma et la kasbah de Taourirt.',
    attractions: JSON.stringify(['Ksar Aït Benhaddou UNESCO', 'Col du Tichka 2260m', 'Studios de cinéma', 'Kasbah de Taourirt', 'Paysages de l\'Anti-Atlas'])
  },
  {
    name: 'Lac Lalla Takerkoust',
    price: 70,
    location: 'Lalla Takerkoust',
    distance_from_city: 40,
    short_description: 'Lac artificiel et détente au pied de l\'Atlas.',
    description: 'Le lac Lalla Takerkoust, retenue d\'eau artificielle créée dans les années 1930, est une oasis de fraîcheur à seulement 40 km de Marrakech. Entouré de collines ocre et de palmiers, ce lac offre un cadre idyllique pour une journée de détente. Au programme : balade en barque ou en pédalo sur les eaux calmes, déjeuner de poissons frais dans un restaurant au bord de l\'eau, baignade et farniente. Une escapade parfaite pour les familles et les amoureux de nature.',
    attractions: JSON.stringify(['Balade en barque', 'Pêche et baignade', 'Déjeuner poissons frais', 'Vue sur l\'Atlas', 'Détente en famille'])
  },
  {
    name: 'Trois Vallées',
    price: 130,
    location: 'Haut Atlas',
    distance_from_city: 80,
    short_description: 'Circuit panoramique à travers trois vallées berbères de l\'Atlas.',
    description: 'Le circuit des Trois Vallées est l\'une des plus belles excursions de la région de Marrakech. Il traverse successivement les vallées de l\'Ourika, de l\'Aït Mizane et du Zat, offrant une diversité de paysages exceptionnelle : gorges encaissées, plateaux verdoyants, villages de pisé accrochés aux falaises et terrasses cultivées en escalier. Vous rencontrerez des familles berbères, découvrirez leur mode de vie ancestral et profiterez d\'un déjeuner traditionnel avec vue panoramique sur les sommets.',
    attractions: JSON.stringify(['Vallée de l\'Ourika', 'Vallée de l\'Aït Mizane', 'Vallée du Zat', 'Villages berbères', 'Panoramas exceptionnels', 'Déjeuner traditionnel'])
  },
  {
    name: 'Oukaimeden',
    price: 90,
    location: 'Haut Atlas',
    distance_from_city: 75,
    short_description: 'Station de ski et gravures rupestres à 2600 m d\'altitude.',
    description: 'Oukaimeden est la plus haute station de ski d\'Afrique, perchée à 2600 m d\'altitude dans le Haut Atlas. En été, elle se transforme en paradis des randonneurs avec ses prairies alpines, ses lacs d\'altitude et ses gravures rupestres préhistoriques classées patrimoine mondial. En hiver, c\'est une destination unique pour skier avec vue sur les sommets enneigés. Cette excursion offre une montée spectaculaire par une route sinueuse avec des panoramas à 360° sur la chaîne atlasique.',
    attractions: JSON.stringify(['Station de ski la plus haute d\'Afrique', 'Gravures rupestres préhistoriques', 'Lac d\'altitude', 'Randonnées alpines', 'Panorama 360° sur l\'Atlas'])
  }
];

async function insertExcursions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté');

    for (const exc of excursions) {
      const slug = generateSlug(exc.name);
      await sequelize.query(`
        INSERT INTO destinations (name, slug, description, short_description, price, location, distance_from_city, attractions, is_active, is_featured, sort_order)
        VALUES (:name, :slug, :description, :short_description, :price, :location, :distance_from_city, :attractions::json, true, false, 0)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          price = EXCLUDED.price,
          location = EXCLUDED.location,
          distance_from_city = EXCLUDED.distance_from_city,
          attractions = EXCLUDED.attractions;
      `, {
        replacements: {
          name: exc.name,
          slug,
          description: exc.description,
          short_description: exc.short_description,
          price: exc.price,
          location: exc.location,
          distance_from_city: exc.distance_from_city,
          attractions: exc.attractions
        }
      });
      console.log(`✅ ${exc.name} — ${exc.price} MAD`);
    }

    console.log('\n🎉 9 excursions insérées avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

insertExcursions();
