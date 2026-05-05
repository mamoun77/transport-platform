import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = { bg: '#080d1a', card: '#0f172a', border: '#1e293b', text: '#f1f5f9', muted: '#64748b' };

const DIFFICULTY_COLORS = {
  facile:    { bg: 'rgba(34,197,94,0.2)',  text: '#4ade80' },
  modere:    { bg: 'rgba(234,179,8,0.2)',  text: '#facc15' },
  difficile: { bg: 'rgba(239,68,68,0.2)',  text: '#f87171' },
};

import { getServices, getCircuits, getDestinations, getActivities } from '../services/api';

const FETCH_MAP = {
  transfert: getServices,
  circuit:   getCircuits,
  excursion: getDestinations,
  activite:  getActivities,
};

export default function ListScreen({ route, navigation }) {
  const { title, type, accentColor = '#3b82f6', priceKey = 'price' } = route.params;
  const fetchFn = FETCH_MAP[type];
  const [items, setItems]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    fetchFn()
      .then(d => {
        const list = d.success ? (d.services || d.circuits || d.destinations || d.activities || []) : [];
        setItems(list); setFiltered(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(items); return; }
    setFiltered(items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, items]);

  const renderItem = ({ item }) => {
    const price = item[priceKey] || item.price_from || 0;
    const diff  = item.difficulty;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Booking', { item, type })} activeOpacity={0.85}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' }}
          style={styles.image}
        />
        <LinearGradient colors={['transparent', '#080d1a']} style={styles.gradient} />
        {price > 0 && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{price} MAD</Text>
          </View>
        )}
        {diff && (
          <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[diff]?.bg || 'rgba(100,116,139,0.2)' }]}>
            <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[diff]?.text || '#94a3b8' }]}>{diff}</Text>
          </View>
        )}
        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Vedette</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.short_description || item.description}</Text>
          <View style={styles.meta}>
            {item.duration && <Text style={styles.metaText}>⏱ {item.duration}</Text>}
            {item.location && <Text style={styles.metaText}>📍 {item.location}</Text>}
            {item.departure_point && <Text style={styles.metaText}>🚌 {item.departure_point}</Text>}
          </View>
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceMain}>{price > 0 ? `${price} MAD` : 'Sur demande'}</Text>
              {item.price_luxury > 0 && <Text style={styles.priceLuxury}>✨ {item.price_luxury} MAD luxe</Text>}
            </View>
            <TouchableOpacity style={[styles.bookBtn, { backgroundColor: accentColor }]}
              onPress={() => navigation.navigate('Booking', { item, type })}>
              <Text style={styles.bookBtnText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={`Rechercher ${title.toLowerCase()}...`}
          placeholderTextColor="#475569"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={accentColor} /></View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Aucun résultat</Text></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: COLORS.muted, fontSize: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 20, gap: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  image: { width: '100%', height: 200 },
  gradient: { position: 'absolute', top: 100, left: 0, right: 0, height: 100 },
  priceBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  priceText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  diffBadge: { position: 'absolute', top: 12, left: 12, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  diffText: { fontSize: 11, fontWeight: '700' },
  featuredBadge: { position: 'absolute', bottom: 200, left: 12, backgroundColor: 'rgba(234,179,8,0.2)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(234,179,8,0.4)' },
  featuredText: { color: '#fde68a', fontSize: 11, fontWeight: '700' },
  content: { padding: 16 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  desc: { color: COLORS.muted, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  metaText: { color: COLORS.muted, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  priceMain: { color: '#fff', fontSize: 18, fontWeight: '800' },
  priceLuxury: { color: '#fbbf24', fontSize: 13, fontWeight: '600' },
  bookBtn: { borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10 },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
