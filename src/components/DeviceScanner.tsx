import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../styles/theme';

interface DeviceScannerProps {
  onOpenScanModal: () => void;
}

export const DeviceScanner: React.FC<DeviceScannerProps> = ({
  onOpenScanModal,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={onOpenScanModal}
      >
        <Text style={styles.scanIcon}>📡</Text>
        <Text style={styles.buttonText}>Scan for Electric Dream Devices</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  scanIcon: {
    fontSize: 24,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
