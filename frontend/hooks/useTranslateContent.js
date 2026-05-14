import { useRouter } from 'next/router';

const translations = {
  // Transfers
  'Transfer Aéroport': { en: 'Airport Transfer', fr: 'Transfer Aéroport' },
  'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.': { en: 'Fast transfer to/from Marrakech-Menara airport.', fr: 'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.' },
  'Transfer Agadir': { en: 'Agadir Transfer', fr: 'Transfer Agadir' },
  'Transfert privé Marrakech ↔ Agadir, la station balnéaire.': { en: 'Private transfer Marrakech ↔ Agadir, the seaside resort.', fr: 'Transfert privé Marrakech ↔ Agadir, la station balnéaire.' },
  'Transfer Agafay': { en: 'Agafay Transfer', fr: 'Transfer Agafay' },
  'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.': { en: 'Private transfer to Agafay desert, 30 min from Marrakech.', fr: 'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.' },
  'Transfer Casablanca Aéroport': { en: 'Casablanca Airport Transfer', fr: 'Transfer Casablanca Aéroport' },
  'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.': { en: 'Private transfer Marrakech → Mohammed V Airport Casablanca.', fr: 'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.' },
  
  // Circuits (Tours)
  '4 Jours Merzouga & Sahara': { en: '4 Days Merzouga & Sahara', fr: '4 Jours Merzouga & Sahara' },
  'L\'aventure ultime vers les dunes de l\'Erg Chebbi à Merzouga.': { en: 'The ultimate adventure to the dunes of Erg Chebbi in Merzouga.', fr: 'L\'aventure ultime vers les dunes de l\'Erg Chebbi à Merzouga.' },
  '2 Jours Zagora & Sahara': { en: '2 Days Zagora & Sahara', fr: '2 Jours Zagora & Sahara' },
  'Mini-aventure désertique à Zagora, la porte du Sahara.': { en: 'Mini desert adventure in Zagora, the gateway to the Sahara.', fr: 'Mini-aventure désertique à Zagora, la porte du Sahara.' },
  '3 Jours Zagora & Drâa': { en: '3 Days Zagora & Drâa', fr: '3 Jours Zagora & Drâa' },
  'Immersion complète dans la vallée du Drâa et le désert de Zagora.': { en: 'Complete immersion in the Drâa Valley and Zagora desert.', fr: 'Immersion complète dans la vallée du Drâa et le désert de Zagora.' },
  '1 Jour Ouarzazate & Aït Benhaddou': { en: '1 Day Ouarzazate & Aït Benhaddou', fr: '1 Jour Ouarzazate & Aït Benhaddou' },
  'Hollywood du Maroc et ksar UNESCO en une journée.': { en: 'Morocco\'s Hollywood and UNESCO kasar in one day.', fr: 'Hollywood du Maroc et ksar UNESCO en une journée.' },
  
  // Excursions
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
};

export function useTranslateContent(items) {
  const { locale = 'fr' } = useRouter();
  if (!items || !Array.isArray(items)) return [];
  
  return items.map(item => ({
    ...item,
    name: translations[item.name]?.[locale] || item.name,
    description: translations[item.description]?.[locale] || item.description,
    short_description: translations[item.short_description]?.[locale] || item.short_description,
  }));
}
