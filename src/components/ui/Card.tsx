import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = false }) => {
  return (
    <View style={[
      styles.card,
      elevated && styles.elevated,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  elevated: {
    backgroundColor: theme.colors.surfaceElevated,
    ...theme.shadows.md,
  },
});