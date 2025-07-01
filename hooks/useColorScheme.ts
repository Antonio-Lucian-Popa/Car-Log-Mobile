// hooks/useColorScheme.ts
import { useThemeStore } from '@/stores/themeStore';

export function useColorScheme(): 'light' | 'dark' {
  const { theme } = useThemeStore();
  return theme;
}
