import { StyleSheet, Text, type TextProps } from 'react-native';

import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/themeStore';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
   const { theme } = useThemeStore();
   const color = theme === 'light'
      ? lightColor || getTextColor(type, 'light')
      : darkColor || getTextColor(type, 'dark');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

function getTextColor(type: string, theme: 'light' | 'dark') {
  const colorMap = {
    text: Colors[theme].text,
    link: Colors[theme].tint ?? Colors[theme].primary,
  };

  return type === 'link' ? colorMap.link : colorMap.text;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
