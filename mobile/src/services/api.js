import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001/api'   // Émulateur Android → localhost
  : 'http://localhost:3001/api';  // Web / iOS

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return res.json();
};

export const getServices    = () => api('/services');
export const getCircuits    = () => api('/circuits');
export const getDestinations = () => api('/destinations');
export const getActivities  = () => api('/activities');
export const getBlog        = () => api('/blog');

export const login = (email, password) =>
  api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
  });

export const register = (data) =>
  api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, email: data.email.trim().toLowerCase() }),
  });

export const createBooking = (data) =>
  api('/bookings', { method: 'POST', body: JSON.stringify(data) });

export const getBookings = (token) =>
  api('/bookings', { headers: { Authorization: `Bearer ${token}` } });
