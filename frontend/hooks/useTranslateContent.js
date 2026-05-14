import { useRouter } from 'next/router';

const translations = {
  'Transfer Aéroport': { en: 'Airport Transfer', fr: 'Transfer Aéroport' },
  'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.': { en: 'Fast transfer to/from Marrakech-Menara airport.', fr: 'Transfert rapide depuis/vers l\'aéroport de Marrakech-Menara.' },
  'Transfer Agadir': { en: 'Agadir Transfer', fr: 'Transfer Agadir' },
  'Transfert privé Marrakech ↔ Agadir, la station balnéaire.': { en: 'Private transfer Marrakech ↔ Agadir, the seaside resort.', fr: 'Transfert privé Marrakech ↔ Agadir, la station balnéaire.' },
  'Transfer Agafay': { en: 'Agafay Transfer', fr: 'Transfer Agafay' },
  'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.': { en: 'Private transfer to Agafay desert, 30 min from Marrakech.', fr: 'Transfert privé vers le désert d\'Agafay, à 30 min de Marrakech.' },
  'Transfer Casablanca Aéroport': { en: 'Casablanca Airport Transfer', fr: 'Transfer Casablanca Aéroport' },
  'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.': { en: 'Private transfer Marrakech → Mohammed V Airport Casablanca.', fr: 'Transfert privé Marrakech → Aéroport Mohammed V Casablanca.' },
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
