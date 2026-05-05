import { useCurrency } from '../hooks/useCurrency';

export default function CurrencySwitcher({ className = '' }) {
  const { currency, toggle } = useCurrency();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
        currency === 'USD'
          ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25'
          : 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25'
      } ${className}`}
      title="Changer de devise"
    >
      <span>{currency === 'MAD' ? '🇲🇦' : '🇺🇸'}</span>
      <span>{currency}</span>
      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </button>
  );
}
