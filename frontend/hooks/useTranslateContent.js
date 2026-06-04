import { useRouter } from 'next/router';

const translations = {
  // Transfers
  'Transfert Aéroport': { en: 'Airport Transfer', fr: 'Transfert Aéroport' },
  'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.': { en: 'Fast transfer to/from Marrakech-Menara airport.', fr: 'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.' },
  'Transfert Essaouira': { en: 'Essaouira Transfer', fr: 'Transfert Essaouira' },
  'Transfert privé Marrakech ↔ Essaouira, la cité des vents.': { en: 'Private transfer Marrakech ↔ Essaouira, the windy city.', fr: 'Transfert privé Marrakech ↔ Essaouira, la cité des vents.' },
  'Transfert Casablanca Centre': { en: 'Casablanca Downtown Transfer', fr: 'Transfert Casablanca Centre' },
  'Transfert privé Marrakech ↔ Casablanca centre-ville.': { en: 'Private transfer Marrakech ↔ Casablanca city center.', fr: 'Transfert privé Marrakech ↔ Casablanca centre-ville.' },
  'Transfert Casablanca Aéroport': { en: 'Casablanca Airport Transfer', fr: 'Transfert Casablanca Aéroport' },
  'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.': { en: 'Private transfer Marrakech → Mohammed V Airport Casablanca.', fr: 'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.' },
  'Transfert Agadir': { en: 'Agadir Transfer', fr: 'Transfert Agadir' },
  'Transfert privé Marrakech ↔ Agadir, la station balnéaire.': { en: 'Private transfer Marrakech ↔ Agadir, the seaside resort.', fr: 'Transfert privé Marrakech ↔ Agadir, la station balnéaire.' },
  'Transfert Ouirgane': { en: 'Ouirgane Transfer', fr: 'Transfert Ouirgane' },
  'Transfert privé vers Ouirgane, oasis de verdure au pied de l\'Atlas.': { en: 'Private transfer to Ouirgane, a green oasis at the foot of the Atlas.', fr: 'Transfert privé vers Ouirgane, oasis de verdure au pied de l\'Atlas.' },
  'Transfert Agafay': { en: 'Agafay Transfer', fr: 'Transfert Agafay' },
  'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.': { en: 'Private transfer to Agafay desert, 30 min from Marrakech.', fr: 'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.' },
  'Transfert Imlil': { en: 'Imlil Transfer', fr: 'Transfert Imlil' },
  'Transfert privé vers Imlil, porte du Toubkal et des randonnées.': { en: 'Private transfer to Imlil, gateway to Toubkal and hiking.', fr: 'Transfert privé vers Imlil, porte du Toubkal et des randonnées.' },
  'Transfert Taghazout': { en: 'Taghazout Transfer', fr: 'Transfert Taghazout' },
  'Transfert privé vers Taghazout, paradis des surfeurs sur l\'Atlantique.': { en: 'Private transfer to Taghazout, the surfer\'s paradise on the Atlantic.', fr: 'Transfert privé vers Taghazout, paradis des surfeurs sur l\'Atlantique.' },
  'Transfert Palmeraie': { en: 'Palmeraie Transfer', fr: 'Transfert Palmeraie' },
  'Transfert privé vers la Palmeraie de Marrakech.': { en: 'Private transfer to Marrakech Palmeraie.', fr: 'Transfert privé vers la Palmeraie de Marrakech.' },
  
  // Circuits (Tours)
  '4 Jours Merzouga & Sahara': { en: '4 Days Merzouga & Sahara', fr: '4 Jours Merzouga & Sahara' },
  'L\'aventure ultime vers les dunes de l\'Erg Chebbi à Merzouga.': { en: 'The ultimate adventure to the dunes of Erg Chebbi in Merzouga.', fr: 'L\'aventure ultime vers les dunes de l\'Erg Chebbi à Merzouga.' },
  '2 Jours Zagora & Sahara': { en: '2 Days Zagora & Sahara', fr: '2 Jours Zagora & Sahara' },
  'Mini-aventure désertique à Zagora, la porte du Sahara.': { en: 'Mini desert adventure in Zagora, the gateway to the Sahara.', fr: 'Mini-aventure désertique à Zagora, la porte du Sahara.' },
  '2 Jours Zagora & Désert': { en: '2 Days Zagora & Desert', fr: '2 Jours Zagora & Désert' },
  'Zagora, surnommée "la porte du Sahara", est accessible en 2 jours depuis Marrakech pour une première expérience désertique authentique. Ce circuit traverse la vallée du Drâa, la plus longue du Maroc, bordée de milliers de palmiers et de kasbahs de pisé. Vous passerez la nuit dans un camp nomade au milieu des dunes, avec dîner berbère, musique gnaoua et ciel étoilé exceptionnel. Une introduction parfaite au désert marocain.': {
    en: 'Zagora, nicknamed "the gateway to the Sahara", is reachable in 2 days from Marrakech for an authentic desert introduction. This tour crosses the Drâa Valley, Morocco\'s longest valley, lined with thousands of palm trees and adobe kasbahs. You will spend the night in a nomad camp among the dunes, with a Berber dinner, Gnawa music and a spectacular starry sky. A perfect introduction to the Moroccan desert.',
    fr: 'Zagora, surnommée "la porte du Sahara", est accessible en 2 jours depuis Marrakech pour une première expérience désertique authentique. Ce circuit traverse la vallée du Drâa, la plus longue du Maroc, bordée de milliers de palmiers et de kasbahs de pisé. Vous passerez la nuit dans un camp nomade au milieu des dunes, avec dîner berbère, musique gnaoua et ciel étoilé exceptionnel. Une introduction parfaite au désert marocain.'
  },
  '3 Jours Zagora & Drâa': { en: '3 Days Zagora & Drâa', fr: '3 Jours Zagora & Drâa' },
  'Immersion complète dans la vallée du Drâa et le désert de Zagora.': { en: 'Complete immersion in the Drâa Valley and Zagora desert.', fr: 'Immersion complète dans la vallée du Drâa et le désert de Zagora.' },
  '1 Jour Ouarzazate & Aït Benhaddou': { en: '1 Day Ouarzazate & Aït Benhaddou', fr: '1 Jour Ouarzazate & Aït Benhaddou' },
  'Hollywood du Maroc et ksar UNESCO en une journée.': { en: 'Morocco\'s Hollywood and UNESCO kasar in one day.', fr: 'Hollywood du Maroc et ksar UNESCO en une journée.' },
  'Agafay Demi-Journée': { en: 'Agafay Half-Day', fr: 'Agafay Demi-Journée' },
  'Agafay Demi-Journée 9H a 13H30': { en: 'Agafay Half-Day 9:00 AM - 1:30 PM', fr: 'Agafay Demi-Journée 9H a 13H30' },
  'Agafay Demi-Journée 9H à 13H30': { en: 'Agafay Half-Day 9:00 AM - 1:30 PM', fr: 'Agafay Demi-Journée 9H à 13H30' },
  'Agafay Demi-Journée — 1h Quad + 1h Dromadaire': { en: 'Agafay Half-Day — 1h Quad + 1h Camel Ride', fr: 'Agafay Demi-Journée — 1h Quad + 1h Dromadaire' },
  'Agafay Demi-Journée — 2h Quad + 1h Dromadaire': { en: 'Agafay Half-Day — 2h Quad + 1h Camel Ride', fr: 'Agafay Demi-Journée — 2h Quad + 1h Dromadaire' },
  
  // Excursions (Destinations)
  'Vallée de l\'Ourika': { en: 'Ourika Valley', fr: 'Vallée de l\'Ourika' },
  'Oasis de verdure et cascades au pied de l\'Atlas.': { en: 'Green oasis and waterfalls at the foot of the Atlas.', fr: 'Oasis de verdure et cascades au pied de l\'Atlas.' },
  'Imlil & Toubkal': { en: 'Imlil & Toubkal', fr: 'Imlil & Toubkal' },
  'Porte du Toubkal, plus haut sommet d\'Afrique du Nord.': { en: 'Gateway to Toubkal, the highest peak in North Africa.', fr: 'Porte du Toubkal, plus haut sommet d\'Afrique du Nord.' },
  'Désert d\'Agafay': { en: 'Agafay Desert', fr: 'Désert d\'Agafay' },
  'Le désert de pierres aux portes de Marrakech.': { en: 'The rocky desert at the gates of Marrakech.', fr: 'Le désert de pierres aux portes de Marrakech.' },
  'Essaouira': { en: 'Essaouira', fr: 'Essaouira' },
  'La cité des vents, joyau de l\'Atlantique classé UNESCO.': { en: 'The windy city, a UNESCO gem on the Atlantic coast.', fr: 'La cité des vents, joyau de l\'Atlantique classé UNESCO.' },
  'Oued Ourika & Lac': { en: 'Oued Ourika & Lake', fr: 'Oued Ourika & Lac' },
  'Randonnée au bord de l\'oued et découverte du lac de montagne.': { en: 'Hiking along the oued and discovering a mountain lake.', fr: 'Randonnée au bord de l\'oued et découverte du lac de montagne.' },
  'Ouarzazate & Aït Benhaddou': { en: 'Ouarzazate & Aït Benhaddou', fr: 'Ouarzazate & Aït Benhaddou' },
  'La porte du désert et le ksar d\'Aït Benhaddou classé UNESCO.': { en: 'Gateway to the desert and UNESCO-listed Aït Benhaddou kasar.', fr: 'La porte du désert et le ksar d\'Aït Benhaddou classé UNESCO.' },
  'Lac Lalla Takerkoust': { en: 'Lalla Takerkoust Lake', fr: 'Lac Lalla Takerkoust' },
  'Lac artificiel et détente au pied de l\'Atlas.': { en: 'Artificial lake and relaxation at the foot of the Atlas.', fr: 'Lac artificiel et détente au pied de l\'Atlas.' },
  'Trois Vallées': { en: 'Three Valleys', fr: 'Trois Vallées' },
  'Circuit panoramique à travers trois vallées berbères de l\'Atlas.': { en: 'Panoramic circuit through three Berber valleys of the Atlas.', fr: 'Circuit panoramique à travers trois vallées berbères de l\'Atlas.' },
  'Oukaimeden': { en: 'Oukaimeden', fr: 'Oukaimeden' },
  'Station de ski et gravures rupestres à 2600 m d\'altitude.': { en: 'Ski resort and rock carvings at 2600 m altitude.', fr: 'Station de ski et gravures rupestres à 2600 m d\'altitude.' },
  'Profitez d\'un transfert confortable et ponctuel depuis ou vers l\'aéroport Marrakech-Menara. Nos chauffeurs professionnels vous accueillent à la sortie des arrivées avec un panneau à votre nom, s\'occupent de vos bagages et vous conduisent à destination en toute sérénité. Véhicule climatisé, Wi-Fi gratuit à bord. Disponible 24h/24, 7j/7.': {
    en: 'Enjoy a comfortable and punctual transfer to or from Marrakech-Menara airport. Our professional drivers meet you at arrivals with a sign, handle your luggage, and take you to your destination with complete peace of mind. Air-conditioned vehicle, free onboard Wi-Fi. Available 24/7.',
  },
  'Rejoignez la magnifique ville côtière d\'Essaouira depuis Marrakech en toute confort. Ce transfert privé de 2h30 à 3h vous fait traverser les plaines du Haouz et les arganiers de la région. Idéal pour une escapade à la mer, une journée dans la médina classée UNESCO ou un séjour prolongé. Retour possible le même jour ou à la date de votre choix.': {
    en: 'Reach the beautiful coastal town of Essaouira from Marrakech in complete comfort. This private transfer of 2h30 to 3h takes you through the Haouz plains and argan groves. Ideal for a seaside getaway, a day in the UNESCO-listed medina, or an extended stay. Return possible the same day or on your chosen date.',
  },
  'Voyagez en toute tranquillité entre Marrakech et le centre de Casablanca. Notre service de transfert privé vous évite les contraintes des transports en commun et vous garantit une arrivée à l\'heure. Idéal pour les voyages d\'affaires ou les connexions vers la métropole économique du Maroc. Trajet via l\'autoroute A7, durée approximative 2h30 à 3h selon la circulation.': {
    en: 'Travel in total comfort between Marrakech and downtown Casablanca. Our private transfer service avoids public transport hassles and guarantees a timely arrival. Ideal for business travel or connections to Morocco’s economic capital. Route via the A7 motorway, approximately 2h30 to 3h depending on traffic.',
  },
  'Ne manquez plus jamais votre vol ! Notre service de transfert entre Marrakech et l\'aéroport international Mohammed V de Casablanca vous assure une prise en charge à l\'heure, calculée en fonction de votre horaire de vol. Suivi de votre vol en temps réel, attente gratuite en cas de retard. Le chauffeur vous accueille directement à l\'aéroport avec votre nom affiché.': {
    en: 'Never miss your flight again! Our transfer service between Marrakech and Casablanca Mohammed V international airport ensures timely pickup based on your flight schedule. Real-time flight tracking and free waiting time in case of delay. The driver meets you directly at the airport with your name displayed.',
  },
  'Rejoignez la perle du Souss depuis Marrakech en passant par les magnifiques paysages de l\'Anti-Atlas. Ce transfert privé vers Agadir, station balnéaire réputée pour ses plages et son ensoleillement, est idéal pour prolonger votre séjour marocain au bord de l\'Atlantique. Trajet d\'environ 2h30 via la route des cols ou l\'autoroute selon votre préférence.': {
    en: 'Reach the jewel of the Souss from Marrakech through the magnificent Anti-Atlas landscapes. This private transfer to Agadir, a seaside resort famed for its beaches and sunshine, is ideal for extending your Moroccan stay on the Atlantic coast. Journey about 2h30 via the mountain road or motorway depending on your preference.',
  },
  'Découvrez Ouirgane, ce petit village berbère niché dans la vallée du Nfis au cœur du Haut Atlas. Notre transfert privé vous emmène depuis Marrakech à travers des paysages montagnards époustouflants, en longeant l\'oued Nfis et ses oliveraies. Idéal pour rejoindre un écolodge, un riad de montagne ou pour une journée de randonnée dans la nature.': {
    en: 'Discover Ouirgane, a small Berber village nestled in the Nfis valley in the High Atlas. Our private transfer takes you from Marrakech through stunning mountain scenery, following the Nfis river and olive groves. Ideal for reaching an ecolodge, mountain riad, or for a day of hiking in nature.',
  },
  'Le désert d\'Agafay, surnommé le "désert de pierres" de Marrakech, est accessible en seulement 30 à 45 minutes depuis la ville. Notre transfert privé vous conduit directement à votre camp ou lodge dans ce paysage lunaire unique. Parfait pour une nuit sous les étoiles, un dîner berbère ou une excursion en quad. Idéal pour les familles et les couples.': {
    en: 'The Agafay desert, nicknamed Marrakech’s "stone desert," is reachable in just 30 to 45 minutes from the city. Our private transfer brings you directly to your camp or lodge in this unique lunar landscape. Perfect for an overnight under the stars, a Berber dinner, or a quad excursion. Ideal for families and couples.',
  },
  'Imlil est le point de départ incontournable pour les randonnées vers le Jbel Toubkal, le plus haut sommet d\'Afrique du Nord (4167m). Notre transfert privé depuis Marrakech vous emmène à travers la vallée de l\'Ourika et les villages berbères jusqu\'à ce village de montagne à 1740m d\'altitude. Idéal pour les randonneurs, alpinistes et amoureux de la nature.': {
    en: 'Imlil is the essential starting point for hikes to Jbel Toubkal, the highest peak in North Africa (4167m). Our private transfer from Marrakech takes you through the Ourika valley and Berber villages to this mountain village at 1740m altitude. Ideal for hikers, climbers and nature lovers.',
  },
  'Taghazout, village de pêcheurs devenu la capitale marocaine du surf, vous attend à 3h de Marrakech sur la côte atlantique. Notre transfert privé vous conduit confortablement jusqu\'à ce spot de renommée mondiale, réputé pour ses vagues parfaites, ses couchers de soleil dorés et son ambiance décontractée. Idéal pour les surfeurs, les amateurs de yoga et les voyageurs en quête d\'authenticité.': {
    en: 'Taghazout, a fishing village turned Moroccan surf capital, awaits you 3 hours from Marrakech on the Atlantic coast. Our private transfer takes you comfortably to this world-renowned spot, famous for perfect waves, golden sunsets and a relaxed atmosphere. Ideal for surfers, yoga lovers and travelers seeking authenticity.',
  },
  'La Palmeraie de Marrakech, oasis de 13 000 hectares aux portes de la ville, abrite les plus beaux riads et resorts de luxe de la région. Notre transfert privé vous y conduit en 15 à 25 minutes depuis le centre-ville ou l\'aéroport. Idéal pour rejoindre votre hôtel, participer à une balade à dos de dromadaire ou profiter d\'un déjeuner dans un cadre exceptionnel.': {
    en: 'The Marrakech Palmeraie, a 13,000-hectare oasis at the edge of the city, is home to the region’s finest riads and luxury resorts. Our private transfer takes you there in 15 to 25 minutes from the city center or airport. Ideal for reaching your hotel, enjoying a camel ride or having lunch in an exceptional setting.',
  },
  'La vallée de l\'Ourika est l\'une des excursions les plus populaires au départ de Marrakech. À seulement 60 km, elle offre un dépaysement total avec ses villages berbères accrochés aux flancs de la montagne, ses jardins de safran et ses cascades de Setti Fatma. Vous traverserez des marchés locaux animés, découvrirez l\'artisanat amazigh et profiterez d\'un déjeuner traditionnel au bord de l\'oued. Une journée ressourçante entre nature et culture.': {
    en: 'The Ourika Valley is one of the most popular excursions from Marrakech. Just 60 km away, it offers a complete change of scenery with Berber villages clinging to the mountainsides, saffron gardens and the Setti Fatma waterfalls. You will cross lively local markets, discover Amazigh craftsmanship and enjoy a traditional lunch by the river. A refreshing day between nature and culture.',
  },
  'Imlil est le point de départ incontournable pour explorer le massif du Toubkal, culminant à 4167 m. Cette excursion vous emmène à travers la vallée de l\'Aït Mizane, entre noyers centenaires et terrasses cultivées. Vous visiterez le village d\'Imlil, rencontrerez des familles berbères et pourrez vous aventurer sur les premiers sentiers de randonnée avec vue imprenable sur les sommets enneigés. Idéal pour les amoureux de montagne et de grand air.': {
    en: 'Imlil is the essential starting point for exploring the Toubkal massif, reaching 4167 m. This excursion takes you through the Aït Mizane valley, past centuries-old walnut trees and terraced fields. You will visit the village of Imlil, meet Berber families and can venture onto the first hiking trails with breathtaking views of the snowy peaks. Ideal for mountain and fresh-air lovers.',
  },
  'Le désert d\'Agafay, surnommé le "désert de Marrakech", est un plateau rocheux aux paysages lunaires situé à seulement 35 km de la ville. Cette excursion vous plonge dans une atmosphère saharienne unique sans quitter la région. Au programme : balade à dos de dromadaire, quad sur les pistes ocre, coucher de soleil spectaculaire sur les collines et dîner berbère sous les étoiles dans un camp nomade. Une expérience magique et authentique.': {
    en: 'The Agafay desert, nicknamed the "Marrakech desert," is a rocky plateau with lunar landscapes located just 35 km from the city. This excursion immerses you in a unique Saharan atmosphere without leaving the region. On the program: camel ride, quad on ochre tracks, spectacular sunset over the hills and a Berber dinner under the stars in a nomad camp. A magical and authentic experience.',
  },
  'Essaouira, ancienne cité portugaise devenue ville impériale marocaine, est un véritable bijou architectural classé au patrimoine mondial de l\'UNESCO. Cette excursion d\'une journée vous fait traverser les plaines du Haouz et les arganiers avant d\'arriver face à l\'Atlantique. Vous déambulerez dans la médina blanche et bleue, visiterez le port de pêche animé, les remparts battus par les vents et les galeries d\'art. Une ville hors du temps, bohème et envoûtante.': {
    en: 'Essaouira, a former Portuguese city turned Moroccan imperial town, is a true architectural gem listed as a UNESCO World Heritage Site. This day excursion takes you across the Haouz plains and argan groves before arriving on the Atlantic coast. You will wander the white and blue medina, visit the lively fishing port, wind-beaten ramparts, and art galleries. A timeless, bohemian and captivating city.',
  },
  'Ouarzazate, surnommée "la porte du désert" et "Hollywood de l\'Afrique", est une destination époustouflante à 200 km de Marrakech via le col du Tichka (2260 m). Cette excursion d\'une journée vous emmène à travers des paysages grandioses de l\'Anti-Atlas jusqu\'au ksar d\'Aït Benhaddou, forteresse de pisé classée UNESCO et décor de nombreux films (Gladiator, Game of Thrones). Vous visiterez également les studios de cinéma et la kasbah de Taourirt.': {
    en: 'Ouarzazate, nicknamed "the gate of the desert" and "Africa\'s Hollywood," is an astonishing destination 200 km from Marrakech via the Tichka pass (2260 m). This day excursion takes you through the grand landscapes of the Anti-Atlas to the Aït Benhaddou ksar, a UNESCO-listed earthen fortress and film location for many movies (Gladiator, Game of Thrones). You will also visit the film studios and the Taourirt kasbah.',
  },
  'Le lac Lalla Takerkoust, retenue d\'eau artificielle créée dans les années 1930, est une oasis de fraîcheur à seulement 40 km de Marrakech. Entouré de collines ocre et de palmiers, ce lac offre un cadre idyllique pour une journée de détente. Au programme : balade en barque ou en pédalo sur les eaux calmes, déjeuner de poissons frais dans un restaurant au bord de l\'eau, baignade et farniente. Une escapade parfaite pour les familles et les amoureux de nature.': {
    en: 'Lake Lalla Takerkoust, an artificial reservoir created in the 1930s, is a refreshing oasis just 40 km from Marrakech. Surrounded by ochre hills and palm trees, this lake offers an idyllic setting for a relaxing day. On the program: boat or pedal boat ride on calm waters, fresh fish lunch at a lakeside restaurant, swimming and lounging. A perfect escape for families and nature lovers.',
  },
  'Le circuit des Trois Vallées est l\'une des plus belles excursions de la région de Marrakech. Il traverse successivement les vallées de l\'Ourika, de l\'Aït Mizane et du Zat, offrant une diversité de paysages exceptionnelle : gorges encaissées, plateaux verdoyants, villages de pisé accrochés aux falaises et terrasses cultivées en escalier. Vous rencontrerez des familles berbères, découvrirez leur mode de vie ancestral et profiterez d\'un déjeuner traditionnel avec vue panoramique sur les sommets...': {
    en: 'The Three Valleys circuit is one of the most beautiful excursions in the Marrakech region. It passes through the Ourika, Aït Mizane and Zat valleys, offering exceptional landscape diversity: narrow gorges, green plateaus, earthen villages clinging to cliffs and terraced gardens. You will meet Berber families, discover their ancestral way of life, and enjoy a traditional lunch with panoramic mountain views.',
  },
  'Oukaimeden est la plus haute station de ski d\'Afrique, perchée à 2600 m d\'altitude dans le Haut Atlas. En été, elle se transforme en paradis des randonneurs avec ses prairies alpines, ses lacs d\'altitude et ses gravures rupestres préhistoriques classées patrimoine mondial. En hiver, c\'est une destination unique pour skier avec vue sur les sommets enneigés. Cette excursion offre une montée spectaculaire par une route sinueuse avec des panoramas à 360° sur la chaîne atlasique.': {
    en: 'Oukaimeden is the highest ski resort in Africa, perched at 2600 m altitude in the High Atlas. In summer, it becomes a hiker’s paradise with alpine meadows, mountain lakes and prehistoric rock engravings listed as world heritage. In winter, it is a unique destination for skiing with views of snow-capped peaks. This excursion offers a spectacular ascent on a winding road with 360° panoramas of the Atlas range.',
  },
  
  // Activities
  'Quad Bike in the Palmeraie': { en: 'Quad Bike in the Palmeraie', fr: 'Quad Bike in the Palmeraie' },
  'Thrilling quad adventure through palm groves, desert tracks and Berber villages just outside Marrakech.': { en: 'Thrilling quad adventure through palm groves, desert tracks and Berber villages just outside Marrakech.', fr: 'Thrilling quad adventure through palm groves, desert tracks and Berber villages just outside Marrakech.' },
};

export function useTranslateContent(items) {
  const { locale = 'fr' } = useRouter();
  if (!items || !Array.isArray(items)) return [];
  // Build a normalized lookup to tolerate small differences (arrows, punctuation)
  const normalize = str => ('' + (str || '')).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const normalizedMap = {};
  Object.keys(translations).forEach(k => {
    normalizedMap[normalize(k)] = translations[k];
  });

  const translateValue = (value) => {
    if (!value || typeof value !== 'string') return value;
    const normalized = normalize(value);
    const translation = normalizedMap[normalized] || null;
    if (translation) return translation[locale];
    const prefixTranslation = translateByPrefix(value);
    return prefixTranslation || value;
  };

  const translateArray = (value) => {
    if (!Array.isArray(value)) return value;
    return value.map((item) => translateValue(item));
  };

  const translateTimeSuffix = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
      .replace(/(\d{1,2})[Hh](\d{2})/g, (_, h, m) => {
        const hour = parseInt(h, 10);
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${m}${period}`;
      })
      .replace(/(\d{1,2})[Hh](?!\d)/g, (_, h) => {
        const hour = parseInt(h, 10);
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:00${period}`;
      })
      .replace(/\b(a|à)\b/gi, ' - ');
  };

  const translateByPrefix = (value) => {
    const words = ('' + value).trim().split(/\s+/);
    for (let len = words.length - 1; len >= 2; len--) {
      const prefix = words.slice(0, len).join(' ');
      const normalizedPrefix = normalize(prefix);
      const translation = normalizedMap[normalizedPrefix];
      if (translation) {
        const suffix = words.slice(len).join(' ');
        return `${translation[locale]}${suffix ? ' ' + (locale === 'en' ? translateTimeSuffix(suffix) : suffix) : ''}`;
      }
    }
    return null;
  };

  const findFuzzy = nKey => {
    if (!nKey) return null;
    if (normalizedMap[nKey]) return normalizedMap[nKey];
    for (const k of Object.keys(normalizedMap)) {
      if (k.includes(nKey) || nKey.includes(k)) return normalizedMap[k];
    }
    return null;
  };

  return items.map(item => {
    const nName = normalize(item.name);
    const nDesc = normalize(item.description);
    const nShort = normalize(item.short_description);

    const tName = (findFuzzy(nName)?.[locale]) || translateValue(item.name);
    const tDesc = (findFuzzy(nDesc)?.[locale]) || translateValue(item.description);
    const tShort = (findFuzzy(nShort)?.[locale]) || translateValue(item.short_description);

    return {
      ...item,
      name: tName,
      description: tDesc,
      short_description: tShort,
      program: translateArray(item.program),
      included: translateArray(item.included),
      not_included: translateArray(item.not_included),
      luxury_advantages: translateArray(item.luxury_advantages),
    };
  });
}
