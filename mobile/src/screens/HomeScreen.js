import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getServices, getCircuits, getDestinations, getActivities } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.6;

const COLORS = {
  bg: '#080d1a', card: '#0f172a', border: '#1e293b',
  text: '#f1f5f9', muted: '#64748b', accent: '#3b82f6',
};

function SectionTitle({ title, color = COLORS.accent, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={{ color, fontSize: 13 }}>Voir tout →</Text>
      </TouchableOpacity>
    </View>
  );
}

function ItemCard({ item, price, onPress, accentColor }) {
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' }}
        style={styles.cardImage}
      />
      <LinearGradient colors={['transparent', '#080d1a']} style={styles.cardGradient} />
      {price > 0 && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{price} MAD</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        {item.duration && <Text style={styles.cardMeta}>⏱ {item.duration}</Text>}
        {item.location && <Text style={styles.cardMeta}>📍 {item.location}</Text>}
        <TouchableOpacity style={[styles.bookBtn, { backgroundColor: accentColor }]} onPress={onPress}>
          <Text style={styles.bookBtnText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [services, setServices]     = useState([]);
  const [circuits, setCircuits]     = useState([]);
  const [excursions, setExcursions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getCircuits(), getDestinations(), getActivities()])
      .then(([s, c, d, a]) => {
        if (s.success) setServices(s.services.slice(0, 5));
        if (c.success) setCircuits(c.circuits.slice(0, 5));
        if (d.success) setExcursions(d.destinations.slice(0, 5));
        if (a.success) setActivities(a.activities.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={['#1e3a5f', '#080d1a']} style={styles.hero}>
        <Image source={require('../../assets/icon.png')} style={styles.heroLogo} />
        <Text style={styles.heroTitle}>Trendy Travel</Text>
        <Text style={styles.heroSub}>Transport Premium au Maroc</Text>
        <View style={styles.heroBadges}>
          {['✓ Réservation instantanée', '✓ Support 24/7'].map(b => (
            <View key={b} style={styles.badge}>
              <Text style={styles.badgeText}>{b}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[['10+', "Années d'exp."], ['50+', 'Véhicules'], ['10K+', 'Clients'], ['24/7', 'Support']].map(([v, l]) => (
          <View key={l} style={styles.statBox}>
            <Text style={styles.statValue}>{v}</Text>
            <Text style={styles.statLabel}>{l}</Text>
          </View>
        ))}
      </View>

      {/* Transferts */}
      {services.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="✈️ Transferts" color="#38bdf8" onSeeAll={() => navigation.navigate('Transfert')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {services.map(s => (
              <ItemCard key={s.id} item={s} price={s.price_from} accentColor="#0ea5e9"
                onPress={() => navigation.navigate('Booking', { item: s, type: 'transfert' })} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Circuits */}
      {circuits.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="🗺️ Circuits" color="#f59e0b" onSeeAll={() => navigation.navigate('Circuits')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {circuits.map(c => (
              <ItemCard key={c.id} item={c} price={c.price} accentColor="#d97706"
                onPress={() => navigation.navigate('Booking', { item: c, type: 'circuit' })} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Excursions */}
      {excursions.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="🌿 Excursions" color="#10b981" onSeeAll={() => navigation.navigate('Excursions')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {excursions.map(e => (
              <ItemCard key={e.id} item={e} price={e.price} accentColor="#059669"
                onPress={() => navigation.navigate('Booking', { item: e, type: 'excursion' })} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Activités */}
      {activities.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="🎯 Activités" color="#a78bfa" onSeeAll={() => navigation.navigate('Activites')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {activities.map(a => (
              <ItemCard key={a.id} item={a} price={a.price} accentColor="#7c3aed"
                onPress={() => navigation.navigate('Booking', { item: a, type: 'activite' })} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Contact */}
      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>Besoin d'aide ?</Text>
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.contactBtnText}>+212 662 100 714</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25d366', marginTop: 8 }]}>
          <Ionicons name="logo-whatsapp" size={18} color="#fff" />
          <Text style={styles.contactBtnText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  hero: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  heroLogo: { width: 70, height: 70, borderRadius: 35, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  heroSub: { fontSize: 14, color: '#94a3b8', marginTop: 4, marginBottom: 16 },
  heroBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  badge: { backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: '#93c5fd', fontSize: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 16, gap: 8 },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 10, color: COLORS.muted, marginTop: 2, textAlign: 'center' },
  section: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  hScroll: { paddingLeft: 16, paddingRight: 8, gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginBottom: 4 },
  cardImage: { width: '100%', height: 160 },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  priceBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  priceText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardContent: { padding: 12 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMeta: { color: COLORS.muted, fontSize: 12, marginBottom: 2 },
  bookBtn: { marginTop: 10, borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  contactBox: { margin: 16, backgroundColor: COLORS.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  contactTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, width: '100%', justifyContent: 'center' },
  contactBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
