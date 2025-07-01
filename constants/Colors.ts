const lightColors = {
  primary: '#007AFF',
  secondary: '#FF9500',
  background: '#FFFFFF',
  card: '#F3F3F3',
  text: '#000000',
  textSecondary: '#6e6e6e',
  border: '#E0E0E0',
  error: '#FF3B30',
  warning: '#FFCC00',
  disabled: '#C7C7CC',
  tint: '#0A7EA4',
};

const darkColors = {
  primary: '#0A84FF',
  secondary: '#FF9F0A',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#A1A1A1',
  border: '#3A3A3C',
  error: '#FF453A',
  warning: '#FFD60A',
  disabled: '#3A3A3C',
  tint: '#4DD0E1',
};

const Colors = {
  light: lightColors,
  dark: darkColors,
};

export default Colors;
export type ThemeType = keyof typeof Colors;
