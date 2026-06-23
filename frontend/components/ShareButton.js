import React from 'react';

export default function ShareButton({ onClick, className = '', label = 'Partager' }) {
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      <span className="inline-flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8l-6-6-6 6" />
          <path d="M12 2v14" />
          <path d="M6 14h12" />
          <path d="M4 20h16" />
        </svg>
        <span>{label}</span>
      </span>
    </button>
  );
}
