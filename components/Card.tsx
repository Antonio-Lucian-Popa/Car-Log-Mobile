import { Colors } from '@/constants/Colors';
import { useThemeStore } from '@/stores/themeStore';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface CardProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  style,
  titleStyle,
  contentStyle,
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const createStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
    content: {
      flex: 1,
    },
  });

export default Card;
