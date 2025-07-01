import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/themeStore';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useThemeStore((state) => state.theme);
  const backgroundColor = theme === 'light'
    ? lightColor ?? Colors.light.background
    : darkColor ?? Colors.dark.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
