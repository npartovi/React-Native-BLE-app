import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  color?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  color = theme.colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.title, { color }]}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={[styles.divider, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  icon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  title: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  divider: {
    height: 3,
    borderRadius: 2,
    width: 40,
  },
});