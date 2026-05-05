import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreLogs([
  'aria-hidden',
  'Non-serializable values',
  'props.pointerEvents is deprecated',
]);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('pointerEvents')) return;
  originalWarn(...args);
};

if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('aria-hidden')) return;
    originalError(...args);
  };
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#080d1a" />
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
