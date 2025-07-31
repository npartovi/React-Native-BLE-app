import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ConnectedCloud } from '../types';
import { SectionHeader } from './ui';
import { EditNameModal } from './EditNameModal';
import { theme } from '../styles/theme';

interface CloudManagerProps {
  connectedClouds: ConnectedCloud[];
  activeCloudId: string | null;
  onSwitchToCloud: (cloudId: string) => void;
  onDisconnectCloud: (cloudId: string) => void;
  onControlCloud: (cloudId: string) => void;
  onRenameCloud: (cloudId: string, newName: string) => Promise<void>;
}

export const CloudManager: React.FC<CloudManagerProps> = ({
  connectedClouds,
  activeCloudId,
  onSwitchToCloud,
  onDisconnectCloud,
  onControlCloud,
  onRenameCloud,
}) => {
  const [editingCloud, setEditingCloud] = useState<{ id: string; name: string } | null>(null);
  if (connectedClouds.length === 0) {
    return (
      <View style={styles.container}>
        <SectionHeader
          title="Connected Devices"
          icon="☁️"
          color={theme.colors.primary}
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No devices connected</Text>
          <Text style={styles.emptyStateSubtext}>
            Scan for Electric Dream devices to connect your device
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Connected Devices"
        icon="☁️"
        color={theme.colors.primary}
      />

      <ScrollView
        style={styles.cloudsList}
        showsVerticalScrollIndicator={false}
      >
        {connectedClouds.map(cloud => (
          <View key={cloud.id} style={styles.cloudCard}>
            <View style={styles.cloudHeader}>
              <View style={styles.cloudInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.cloudName}>{cloud.name}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditingCloud({ id: cloud.id, name: cloud.name })}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          cloud.id === activeCloudId
                            ? theme.colors.success
                            : theme.colors.textSecondary,
                      },
                    ]}
                  />
                  <Text style={styles.cloudStatus}>
                    {cloud.id === activeCloudId ? 'Active' : 'Connected'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cloudActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.controlButton]}
                onPress={() => {
                  // Automatically switch to the device when controlling it
                  if (cloud.id !== activeCloudId) {
                    onSwitchToCloud(cloud.id);
                  }
                  onControlCloud(cloud.id);
                }}
              >
                <Text style={styles.controlButtonText}>Control</Text>
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

      {/* Edit Name Modal */}
      {editingCloud && (
        <EditNameModal
          visible={!!editingCloud}
          currentName={editingCloud.name}
          onClose={() => setEditingCloud(null)}
          onSave={async (newName) => {
            await onRenameCloud(editingCloud.id, newName);
            setEditingCloud(null);
          }}
        />
      )}
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  cloudName: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  cloudStatus: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
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
