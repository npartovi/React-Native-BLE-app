import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ConnectedCloud } from '../types';
import { SectionHeader } from './ui';
import { theme } from '../styles/theme';

interface CloudManagerProps {
  connectedClouds: ConnectedCloud[];
  activeCloudId: string | null;
  onSwitchToCloud: (cloudId: string) => void;
  onDisconnectCloud: (cloudId: string) => void;
  onControlCloud: (cloudId: string) => void;
}

export const CloudManager: React.FC<CloudManagerProps> = ({
  connectedClouds,
  activeCloudId,
  onSwitchToCloud,
  onDisconnectCloud,
  onControlCloud,
}) => {
  if (connectedClouds.length === 0) {
    return (
      <View style={styles.container}>
        <SectionHeader 
          title="Electric Dream Clouds" 
          icon="☁️"
          color={theme.colors.primary}
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No clouds connected</Text>
          <Text style={styles.emptyStateSubtext}>
            Scan for Electric Dream devices to connect your first cloud
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader 
        title="Electric Dream Clouds" 
        icon="☁️"
        color={theme.colors.primary}
      />
      
      <ScrollView style={styles.cloudsList} showsVerticalScrollIndicator={false}>
        {connectedClouds.map((cloud) => (
          <View key={cloud.id} style={styles.cloudCard}>
            <View style={styles.cloudHeader}>
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudName}>{cloud.name}</Text>
                <Text style={styles.cloudStatus}>
                  {cloud.id === activeCloudId ? 'Active' : 'Connected'}
                </Text>
              </View>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: cloud.id === activeCloudId ? theme.colors.success : theme.colors.warning }
              ]} />
            </View>
            
            <View style={styles.cloudActions}>
              {cloud.id !== activeCloudId && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.switchButton]}
                  onPress={() => onSwitchToCloud(cloud.id)}
                >
                  <Text style={styles.switchButtonText}>Switch To</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.actionButton, styles.controlButton]}
                onPress={() => onControlCloud(cloud.id)}
              >
                <Text style={styles.controlButtonText}>
                  {cloud.id === activeCloudId ? 'Control' : 'View'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.disconnectButton]}
                onPress={() => onDisconnectCloud(cloud.id)}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.subtitle,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  cloudsList: {
    maxHeight: 300,
  },
  cloudCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  cloudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cloudInfo: {
    flex: 1,
  },
  cloudName: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  cloudStatus: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cloudActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: theme.colors.primary,
  },
  switchButtonText: {
    ...theme.typography.caption,
    color: theme.colors.textInverse,
    fontWeight: '600',
  },
  controlButton: {
    backgroundColor: theme.colors.success,
  },
  controlButtonText: {
    ...theme.typography.caption,
    color: theme.colors.textInverse,
    fontWeight: '600',
  },
  disconnectButton: {
    backgroundColor: theme.colors.error,
  },
  disconnectButtonText: {
    ...theme.typography.caption,
    color: theme.colors.textInverse,
    fontWeight: '600',
  },
});