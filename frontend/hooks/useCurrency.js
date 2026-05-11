import { useState, useEffect, createContext, useContext } from 'react';

const RATE_MAD_TO_USD = 0.099; // 1 MAD = 0.099 USD (taux approximatif)
const RATE_USD_TO_MAD = 10.1;

export const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('currency');
    if (saved === 'EUR' || saved === 'MAD') setCurrency(saved);
  }, []);

  const toggle = () => {
    const next = currency === 'MAD' ? 'EUR' : 'MAD';
    setCurrency(next);
    if (typeof window !== 'undefined') localStorage.setItem('currency', next);
  };

  const convert = (amount) => {
    if (!amount) return 0;
    const n = parseFloat(amount);
    return currency === 'MAD' ? +(n * RATE_USD_TO_MAD).toFixed(2) : n;
  };

  const format = (amount) => {
    const val = convert(amount);
    return currency === 'MAD' ? `${val} MAD` : `€${val}`;
  };

  const symbol = currency === 'EUR' ? '€' : 'MAD';

  return (
    <CurrencyContext.Provider value={{ currency, toggle, convert, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) return {
    currency: 'MAD',
    toggle: () => {},
    convert: (a) => parseFloat(a) || 0,
    format: (a) => `${parseFloat(a) || 0} MAD`,
    symbol: 'MAD',
  };
  return ctx;
};
