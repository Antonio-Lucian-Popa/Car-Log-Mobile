import Colors from '@/constants/Colors';
import { useThemeStore } from '@/stores/themeStore';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(colors);

  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};

    switch (variant) {
      case 'primary':
        buttonStyle = styles.primaryButton;
        break;
      case 'secondary':
        buttonStyle = styles.secondaryButton;
        break;
      case 'outline':
        buttonStyle = styles.outlineButton;
        break;
      case 'danger':
        buttonStyle = styles.dangerButton;
        break;
    }

    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'medium':
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }

    if (disabled || isLoading) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleVar: TextStyle = {};

    switch (variant) {
      case 'primary':
        textStyleVar = styles.primaryText;
        break;
      case 'secondary':
        textStyleVar = styles.secondaryText;
        break;
      case 'outline':
        textStyleVar = styles.outlineText;
        break;
      case 'danger':
        textStyleVar = styles.dangerText;
        break;
    }

    switch (size) {
      case 'small':
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case 'medium':
        textStyleVar = { ...textStyleVar, ...styles.mediumText };
        break;
      case 'large':
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
    }

    if (disabled || isLoading) {
      textStyleVar = { ...textStyleVar, ...styles.disabledText };
    }

    return textStyleVar;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.button, getButtonStyle(), style]}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} size="small" />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      fontWeight: '600',
      textAlign: 'center',
    },

    // Variant styles
    primaryButton: {
      backgroundColor: colors.primary,
    },
    primaryText: {
      color: '#fff',
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
    },
    secondaryText: {
      color: '#fff',
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    outlineText: {
      color: colors.primary,
    },
    dangerButton: {
      backgroundColor: colors.error,
    },
    dangerText: {
      color: '#fff',
    },

    // Sizes
    smallButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    smallText: {
      fontSize: 12,
    },
    mediumButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    mediumText: {
      fontSize: 14,
    },
    largeButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    largeText: {
      fontSize: 16,
    },

    // Disabled
    disabledButton: {
      backgroundColor: colors.disabled,
      borderColor: colors.disabled,
    },
    disabledText: {
      color: '#fff',
    },
  });

export default Button;
