import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = { bg: '#080d1a', card: '#0f172a', border: '#1e293b', muted: '#64748b' };

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#475569" {...props} />
    </View>
  );
}

export function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Remplissez tous les champs'); return; }
    setLoading(true);
    try {
      const res = await login(email, password);
      console.log('Login response:', JSON.stringify(res));
      if (res.token) {
        await signIn(res.user, res.token);
      } else {
        Alert.alert('Erreur', res.error || res.message || 'Identifiants incorrects');
      }
    } catch (e) {
      console.error('Login error:', e);
      Alert.alert('Erreur', 'Impossible de contacter le serveur: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.center}>
      <LinearGradient colors={['#1e3a5f', '#080d1a']} style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.brand}>Trendy Travel</Text>
        <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Field label="Email" placeholder="votre@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Mot de passe" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          <LinearGradient colors={['#3b82f6', '#6366f1']} style={styles.btnGradient}>
            <Text style={styles.btnText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Pas de compte ? <Text style={{ color: '#3b82f6' }}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password) { Alert.alert('Erreur', 'Remplissez les champs obligatoires'); return; }
    setLoading(true);
    try {
      const res = await register(form);
      if (res.token) {
        await signIn(res.user, res.token);
      } else {
        Alert.alert('Erreur', res.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
    setLoading(false);
  };

  const F = (label, key, props = {}) => (
    <Field key={key} label={label} placeholder={label} value={form[key]} onChangeText={v => setForm(p => ({ ...p, [key]: v }))} {...props} />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1e3a5f', '#080d1a']} style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.brand}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez Trendy Travel</Text>
      </LinearGradient>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Prénom *" placeholder="Jean" value={form.firstName} onChangeText={v => setForm(p => ({ ...p, firstName: v }))} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Nom *" placeholder="Dupont" value={form.lastName} onChangeText={v => setForm(p => ({ ...p, lastName: v }))} />
          </View>
        </View>
        <Field label="Email *" placeholder="votre@email.com" value={form.email} onChangeText={v => setForm(p => ({ ...p, email: v }))} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Téléphone" placeholder="+212 6XX XXX XXX" value={form.phone} onChangeText={v => setForm(p => ({ ...p, phone: v }))} keyboardType="phone-pad" />
        <Field label="Mot de passe *" placeholder="••••••••" value={form.password} onChangeText={v => setForm(p => ({ ...p, password: v }))} secureTextEntry />

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleRegister} disabled={loading}>
          <LinearGradient colors={['#3b82f6', '#6366f1']} style={styles.btnGradient}>
            <Text style={styles.btnText}>{loading ? 'Inscription...' : 'Créer mon compte'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Déjà un compte ? <Text style={{ color: '#3b82f6' }}>Se connecter</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flexGrow: 1 },
  header: { paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  logo: { width: 70, height: 70, borderRadius: 35, marginBottom: 12 },
  brand: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  form: { padding: 20 },
  row: { flexDirection: 'row', gap: 10 },
  fieldWrap: { marginBottom: 14 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: COLORS.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  btn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: COLORS.muted, fontSize: 14 },
});
