export const DEFAULT_EXTRA_PASSENGER_FEE = 0;

export function readAdminSettings() {
  if (typeof window === 'undefined') return { extraPassengerFee: DEFAULT_EXTRA_PASSENGER_FEE };
  try {
    const raw = localStorage.getItem('adminSettings');
    if (!raw) return { extraPassengerFee: DEFAULT_EXTRA_PASSENGER_FEE };
    const parsed = JSON.parse(raw);
    return {
      extraPassengerFee: Number(parsed.extraPassengerFee) || DEFAULT_EXTRA_PASSENGER_FEE,
    };
  } catch {
    return { extraPassengerFee: DEFAULT_EXTRA_PASSENGER_FEE };
  }
}

export function getExtraPassengerFee() {
  return readAdminSettings().extraPassengerFee;
}

export function saveAdminSettings(settings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adminSettings', JSON.stringify(settings));
}
