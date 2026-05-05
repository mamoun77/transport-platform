import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBooking } from '../services/api';

const COLORS = { bg: '#080d1a', card: '#0f172a', border: '#1e293b', muted: '#64748b' };

const Field = React.memo(({ label, inputRef, defaultValue, ...props }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={inputRef}
      style={styles.input}
      placeholderTextColor="#475569"
      defaultValue={defaultValue}
      {...props}
    />
  </View>
));

export default function BookingScreen({ route, navigation }) {
  const { item, type } = route.params;
  const [bookingType, setBookingType] = useState('standard');
  const [passengers, setPassengers]   = useState(1);
  const [submitting, setSubmitting]   = useState(false);

  const nameRef    = useRef('');
  const phoneRef   = useRef('');
  const emailRef   = useRef('');
  const dateRef    = useRef('');
  const timeRef    = useRef('');
  const flightRef  = useRef('');
  const notesRef   = useRef('');

  const price = bookingType === 'luxury' && item.price_luxury > 0
    ? item.price_luxury
    : (item.price_from || item.price || 0);

  const total = price * passengers;

  const handleSubmit = async () => {
    const name  = nameRef.current;
    const phone = phoneRef.current;
    const date  = dateRef.current;
    const time  = timeRef.current;

    if (!name || !phone || !date || !time) {
      Alert.alert('Champs requis', 'Veuillez remplir nom, téléphone, date et heure.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createBooking({
        serviceName: `${item.name} (${bookingType === 'luxury' ? 'Luxe' : 'Standard'})`,
        pickup: item.departure_point || item.location || 'Non précisé',
        destination: item.name,
        date, time, passengers,
        price,
        name, phone,
        email: emailRef.current,
        flight_number: flightRef.current,
        notes: notesRef.current,
      });
      if (res.success) {
        Alert.alert('✅ Réservation confirmée !',
          `Numéro : ${res.bookingNumber}\n\nNous vous contacterons bientôt.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
      } else {
        Alert.alert('Erreur', res.error || 'Une erreur est survenue');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
    setSubmitting(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Item header */}
      <View style={styles.itemHeader}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' }}
          style={styles.itemImage}
        />
        <LinearGradient colors={['transparent', '#080d1a']} style={StyleSheet.absoluteFill} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.duration && <Text style={styles.itemMeta}>⏱ {item.duration}</Text>}
        </View>
      </View>

      <View style={styles.form}>
        {/* Standard / Luxe */}
        {item.price_luxury > 0 && (
          <View style={styles.typeRow}>
            {['standard', 'luxury'].map(t => (
              <TouchableOpacity key={t}
                style={[styles.typeBtn, bookingType === t && styles.typeBtnActive]}
                onPress={() => setBookingType(t)}>
                <Text style={[styles.typeBtnLabel, bookingType === t && { color: '#fff' }]}>
                  {t === 'luxury' ? '✨ Luxe' : 'Standard'}
                </Text>
                <Text style={[styles.typeBtnPrice, bookingType === t && { color: '#fff' }]}>
                  {t === 'luxury' ? item.price_luxury : (item.price_from || item.price)} MAD
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Prix */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Prix par personne</Text>
          <Text style={styles.priceValue}>{price > 0 ? `${price} MAD` : 'Sur demande'}</Text>
        </View>

        <Field label="Nom complet *" inputRef={r => nameRef.current = r?._lastNativeText ?? nameRef.current}
          placeholder="Votre nom complet"
          onChangeText={v => { nameRef.current = v; }} />

        <Field label="Téléphone *" inputRef={r => phoneRef.current = r?._lastNativeText ?? phoneRef.current}
          placeholder="+212 6XX XXX XXX" keyboardType="phone-pad"
          onChangeText={v => { phoneRef.current = v; }} />

        <Field label="Email" inputRef={r => emailRef.current = r?._lastNativeText ?? emailRef.current}
          placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none"
          onChangeText={v => { emailRef.current = v; }} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Date *" inputRef={r => dateRef.current = r?._lastNativeText ?? dateRef.current}
              placeholder="YYYY-MM-DD"
              onChangeText={v => { dateRef.current = v; }} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Heure *" inputRef={r => timeRef.current = r?._lastNativeText ?? timeRef.current}
              placeholder="HH:MM"
              onChangeText={v => { timeRef.current = v; }} />
          </View>
        </View>

        {/* Passagers */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Passagers</Text>
          <View style={styles.passengerRow}>
            <TouchableOpacity style={styles.passengerBtn} onPress={() => setPassengers(p => Math.max(1, p - 1))}>
              <Text style={styles.passengerBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.passengerCount}>{passengers}</Text>
            <TouchableOpacity style={styles.passengerBtn} onPress={() => setPassengers(p => Math.min(item.capacity || 20, p + 1))}>
              <Text style={styles.passengerBtnText}>+</Text>
            </TouchableOpacity>
            {price > 0 && (
              <Text style={styles.totalText}>
                Total : <Text style={{ color: '#fff', fontWeight: '800' }}>{total} MAD</Text>
              </Text>
            )}
          </View>
        </View>

        {type === 'transfert' && (
          <Field label="Numéro de vol" inputRef={r => flightRef.current = r?._lastNativeText ?? flightRef.current}
            placeholder="Ex: AT204"
            onChangeText={v => { flightRef.current = v; }} />
        )}

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Remarques</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Demandes spécifiques..."
            placeholderTextColor="#475569"
            multiline
            onChangeText={v => { notesRef.current = v; }}
          />
        </View>

        <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
          <LinearGradient colors={['#3b82f6', '#6366f1']} style={styles.submitGradient}>
            <Text style={styles.submitText}>{submitting ? 'Traitement...' : 'Confirmer la réservation'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  itemHeader: { height: 220, position: 'relative' },
  itemImage: { width: '100%', height: '100%' },
  itemInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  itemName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  itemMeta: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  form: { padding: 16 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  typeBtnActive: { backgroundColor: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' },
  typeBtnLabel: { color: COLORS.muted, fontWeight: '700', fontSize: 14 },
  typeBtnPrice: { color: COLORS.muted, fontSize: 16, fontWeight: '800', marginTop: 4 },
  priceBox: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  priceLabel: { color: COLORS.muted, fontSize: 14 },
  priceValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
  fieldWrap: { marginBottom: 14 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: COLORS.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', gap: 10 },
  passengerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  passengerBtn: { width: 40, height: 40, backgroundColor: COLORS.card, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  passengerBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  passengerCount: { color: '#fff', fontSize: 20, fontWeight: '800', minWidth: 30, textAlign: 'center' },
  totalText: { color: COLORS.muted, fontSize: 14, marginLeft: 'auto' },
  submitBtn: { marginTop: 8, borderRadius: 18, overflow: 'hidden' },
  submitGradient: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
