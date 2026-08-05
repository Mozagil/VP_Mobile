export type Colors = {
  background: string;
  card: string;
  cardAlt: string;
  border: string;

  foreground: string;
  muted: string;

  accent: string;
  accentLight: string;
  accentDark: string;

  success: string;
  warning: string;
  error: string;

  phaseIsınma: string;
  phaseAna: string;
  phaseOyun: string;
  phaseSoğuma: string;

  indigo: string;
  blue: string;
  green: string;
  purple: string;
};

// Karanlık mod — mevcut tasarım, değişmedi.
export const darkColors: Colors = {
  background: '#0d1b3e',
  card: '#122040',
  cardAlt: '#1a2a5e',
  border: '#1e3060',

  foreground: '#ffffff',
  muted: '#8da3cc',

  accent: '#f97316',
  accentLight: '#fb923c',
  accentDark: '#ea6c0a',

  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',

  phaseIsınma: '#f97316',
  phaseAna: '#6366f1',
  phaseOyun: '#4ade80',
  phaseSoğuma: '#60a5fa',

  indigo: '#6366f1',
  blue: '#60a5fa',
  green: '#4ade80',
  purple: '#a78bfa',
};

// Aydınlık mod — beyaz + turuncu ağırlıklı, mavi yalnızca faz/durum
// renklerinde (phaseAna, phaseSoğuma, indigo, blue) korunuyor.
export const lightColors: Colors = {
  background: '#ffffff',
  card: '#fff6ee',
  cardAlt: '#ffe8d3',
  border: '#f2ddc4',

  foreground: '#1c1c1c',
  muted: '#8b7d6f',

  accent: '#f97316',
  accentLight: '#fb923c',
  accentDark: '#ea6c0a',

  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',

  phaseIsınma: '#f97316',
  phaseAna: '#6366f1',
  phaseOyun: '#4ade80',
  phaseSoğuma: '#60a5fa',

  indigo: '#6366f1',
  blue: '#60a5fa',
  green: '#4ade80',
  purple: '#a78bfa',
};
