import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚡</Text>
      </View>
      <Text style={styles.title}>Electric Dreams</Text>
      <Text style={styles.subtitle}>Advanced LED & Matrix Controller</Text>
      <View style={styles.decorativeLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  icon: {
    fontSize: 32,
    color: theme.colors.textPrimary,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  decorativeLine: {
    width: 100,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
});
