import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../services/api';

const COLORS = { bg: '#080d1a', card: '#0f172a', border: '#1e293b', muted: '#64748b' };

const STATUS_COLORS = {
  pending:   { bg: 'rgba(234,179,8,0.2)',  text: '#fbbf24', label: 'En attente' },
  confirmed: { bg: 'rgba(34,197,94,0.2)',  text: '#4ade80', label: 'Confirmé' },
  completed: { bg: 'rgba(59,130,246,0.2)', text: '#60a5fa', label: 'Terminé' },
  cancelled: { bg: 'rgba(239,68,68,0.2)',  text: '#f87171', label: 'Annulé' },
};

export default function ProfileScreen({ navigation }) {
  const { user, token, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (token) {
      getBookings(token).then(d => { if (d.success) setBookings(d.bookings); }).catch(() => {});
    }
  }, [token]);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: async () => {
        await signOut();
        navigation.reset({ index: 0, routes: [{ name: 'ProfileMain' }] });
      }},
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1e3a5f', '#080d1a']} style={styles.guestHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#475569" />
          <Text style={styles.guestTitle}>Non connecté</Text>
          <Text style={styles.guestSub}>Connectez-vous pour accéder à votre compte</Text>
        </LinearGradient>
        <View style={styles.authBtns}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('Register')}>
            <LinearGradient colors={['#3b82f6', '#6366f1']} style={styles.registerGradient}>
              <Text style={styles.registerBtnText}>S'inscrire</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#1e3a5f', '#080d1a']} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.firstName?.[0] || user.first_name?.[0] || '?'}</Text>
        </View>
        <Text style={styles.userName}>{user.firstName || user.first_name} {user.lastName || user.last_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {user.role === 'admin' && (
          <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>👑 Administrateur</Text></View>
        )}
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Réservations</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{bookings.filter(b => b.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{bookings.filter(b => b.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
      </View>

      {/* Réservations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes réservations</Text>
        {bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucune réservation</Text>
            <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.bookNowText}>Réserver maintenant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.slice(0, 10).map(b => {
            const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
            return (
              <View key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingNumber}>{b.booking_number}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <Text style={[styles.statusText, { color: s.text }]}>{s.label}</Text>
                  </View>
                </View>
                <Text style={styles.bookingService}>{b.service_name}</Text>
                <View style={styles.bookingMeta}>
                  <Text style={styles.bookingMetaText}>📅 {b.pickup_date} à {b.pickup_time}</Text>
                  <Text style={styles.bookingMetaText}>👥 {b.passengers} pers.</Text>
                </View>
                <Text style={styles.bookingPrice}>{b.total_price} MAD</Text>
              </View>
            );
          })
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={22} color="#3b82f6" />
          <Text style={styles.menuText}>Accueil</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="call-outline" size={22} color="#10b981" />
          <Text style={styles.menuText}>+212 662 100 714</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderColor: 'rgba(239,68,68,0.3)' }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={[styles.menuText, { color: '#ef4444' }]}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  userEmail: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  adminBadge: { marginTop: 8, backgroundColor: 'rgba(234,179,8,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  adminBadgeText: { color: '#fbbf24', fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', margin: 16, gap: 10 },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  emptyBox: { backgroundColor: COLORS.card, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.muted, fontSize: 15, marginBottom: 14 },
  bookNowBtn: { backgroundColor: '#3b82f6', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 10 },
  bookNowText: { color: '#fff', fontWeight: '700' },
  bookingCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bookingNumber: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  bookingService: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  bookingMeta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  bookingMetaText: { color: COLORS.muted, fontSize: 12 },
  bookingPrice: { color: '#3b82f6', fontSize: 16, fontWeight: '800' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  menuText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  guestHeader: { paddingTop: 80, paddingBottom: 40, alignItems: 'center' },
  guestTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 },
  guestSub: { color: '#94a3b8', fontSize: 14, marginTop: 6, textAlign: 'center', paddingHorizontal: 30 },
  authBtns: { padding: 24, gap: 12 },
  loginBtn: { backgroundColor: COLORS.card, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  registerBtn: { borderRadius: 16, overflow: 'hidden' },
  registerGradient: { paddingVertical: 16, alignItems: 'center' },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
