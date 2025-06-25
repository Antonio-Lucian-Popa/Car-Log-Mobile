import Colors from '@/constants/Colors';
import React, { ReactNode } from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  leftIcon?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  rightContent,
  leftIcon,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginVertical: 4,
  },
  leftIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rightContent: {
    marginLeft: 8,
  },
});

export default ListItem;