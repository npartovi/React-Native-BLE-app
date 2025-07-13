import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'matrix';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  selected = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    selected && styles.selected,
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  matrix: {
    backgroundColor: theme.colors.matrix,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },
  
  // States
  selected: {
    borderWidth: 3,
    borderColor: theme.colors.textPrimary,
    transform: [{ scale: 1.02 }],
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    ...theme.typography.button,
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.textPrimary,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
  },
  accentText: {
    color: theme.colors.textInverse,
  },
  matrixText: {
    color: theme.colors.textPrimary,
  },
  
  // Size text
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  
  disabledText: {
    opacity: 0.7,
  },
});