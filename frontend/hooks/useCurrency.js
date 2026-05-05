import { useState, useEffect, createContext, useContext } from 'react';

const RATE_MAD_TO_USD = 0.099; // 1 MAD = 0.099 USD (taux approximatif)
const RATE_USD_TO_MAD = 10.1;

export const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('MAD');

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved === 'USD' || saved === 'MAD') setCurrency(saved);
  }, []);

  const toggle = () => {
    const next = currency === 'MAD' ? 'USD' : 'MAD';
    setCurrency(next);
    localStorage.setItem('currency', next);
  };

  const convert = (amount) => {
    if (!amount) return 0;
    const n = parseFloat(amount);
    return currency === 'USD' ? +(n * RATE_MAD_TO_USD).toFixed(2) : n;
  };

  const format = (amount) => {
    const val = convert(amount);
    return currency === 'USD' ? `$${val}` : `${val} MAD`;
  };

  const symbol = currency === 'USD' ? '$' : 'MAD';

  return (
    <CurrencyContext.Provider value={{ currency, toggle, convert, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
