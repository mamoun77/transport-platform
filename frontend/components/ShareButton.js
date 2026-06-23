import React from 'react';

export default function ShareButton({ onClick, className = '', label = 'Partager' }) {
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8l4-4 4 4" />
        <path d="M12 4v10" />
        <path d="M5 18h14" />
        <path d="M5 18v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5" />
      </svg>
    </button>
  );
}
