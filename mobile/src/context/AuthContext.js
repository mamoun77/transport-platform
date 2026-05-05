import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

const AuthContext = createContext(null);

const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    const SecureStore = require('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    const SecureStore = require('expo-secure-store');
    return SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key) => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    const SecureStore = require('expo-secure-store');
    return SecureStore.deleteItemAsync(key);
  },
};

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await storage.getItem('token');
        const u = await storage.getItem('user');
        if (t && u) { setToken(t); setUser(JSON.parse(u)); }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const signIn = async (userData, userToken) => {
    await storage.setItem('token', userToken);
    await storage.setItem('user', JSON.stringify(userData));
    setToken(userToken); setUser(userData);
  };

  const signOut = async () => {
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
