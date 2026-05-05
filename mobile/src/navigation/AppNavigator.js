import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen    from '../screens/HomeScreen';
import ListScreen    from '../screens/ListScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { LoginScreen, RegisterScreen } from '../screens/AuthScreens';
import { getServices, getCircuits, getDestinations, getActivities } from '../services/api';

const FETCH_FNS = {
  transfert:  getServices,
  circuit:    getCircuits,
  excursion:  getDestinations,
  activite:   getActivities,
};

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const HEADER = {
  headerStyle: { backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trendy Travel', headerShown: false }} />
      <Stack.Screen name="Transfert" component={ListScreen} options={{ title: 'Transferts' }}
        initialParams={{ title: 'Transferts', type: 'transfert', accentColor: '#0ea5e9', priceKey: 'price_from' }} />
      <Stack.Screen name="Circuits" component={ListScreen} options={{ title: 'Circuits' }}
        initialParams={{ title: 'Circuits', type: 'circuit', accentColor: '#d97706', priceKey: 'price' }} />
      <Stack.Screen name="Excursions" component={ListScreen} options={{ title: 'Excursions' }}
        initialParams={{ title: 'Excursions', type: 'excursion', accentColor: '#059669', priceKey: 'price' }} />
      <Stack.Screen name="Activites" component={ListScreen} options={{ title: 'Activités' }}
        initialParams={{ title: 'Activités', type: 'activite', accentColor: '#7c3aed', priceKey: 'price' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Réservation' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Mon compte' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
    </Stack.Navigator>
  );
}

function TransfertStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="TransfertList" component={ListScreen} options={{ title: 'Transferts' }}
        initialParams={{ title: 'Transferts', type: 'transfert', accentColor: '#0ea5e9', priceKey: 'price_from' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Réservation' }} />
    </Stack.Navigator>
  );
}

function CircuitsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="CircuitsList" component={ListScreen} options={{ title: 'Circuits' }}
        initialParams={{ title: 'Circuits', type: 'circuit', accentColor: '#d97706', priceKey: 'price' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Réservation' }} />
    </Stack.Navigator>
  );
}

function ExcursionsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="ExcursionsList" component={ListScreen} options={{ title: 'Excursions' }}
        initialParams={{ title: 'Excursions', type: 'excursion', accentColor: '#059669', priceKey: 'price' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Réservation' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', borderTopWidth: 1, height: 65, paddingBottom: 10 },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#475569',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              HomeTab:    focused ? 'home'         : 'home-outline',
              TransfertTab: focused ? 'airplane'   : 'airplane-outline',
              CircuitsTab: focused ? 'map'         : 'map-outline',
              ExcursionsTab: focused ? 'leaf'      : 'leaf-outline',
              ProfileTab: focused ? 'person'       : 'person-outline',
            };
            return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Accueil' }} />
        <Tab.Screen name="TransfertTab" component={TransfertStack} options={{ title: 'Transferts' }} />
        <Tab.Screen name="CircuitsTab" component={CircuitsStack} options={{ title: 'Circuits' }} />
        <Tab.Screen name="ExcursionsTab" component={ExcursionsStack} options={{ title: 'Excursions' }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Compte' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
